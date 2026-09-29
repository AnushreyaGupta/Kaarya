import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { z } from 'zod';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });
const app = express();
const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'oncampus-local-development-secret');
if (!secret) throw new Error('JWT_SECRET must be set in production.');
const PORT = Number(process.env.PORT || 4000);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '15mb' }));

type AuthPayload = { id: string; role: string; email: string; name: string };
declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

const ok = (res: any, data: any, status = 200) => res.status(status).json({ success: true, data });
const fail = (res: any, status: number, code: string, message: string) =>
  res.status(status).json({ success: false, error: { code, message } });

const auth = (req: any, res: any, next: any) => {
  try {
    const rawHeader = req.headers.authorization || '';
    const token = rawHeader.startsWith('Bearer ') ? rawHeader.slice(7) : rawHeader;
    if (!token) return fail(res, 401, 'UNAUTHORIZED', 'Authentication token required');
    req.auth = jwt.verify(token, secret) as AuthPayload;
    next();
  } catch {
    return fail(res, 401, 'UNAUTHORIZED', 'Invalid or expired session');
  }
};

const allow = (...roles: string[]) => (req: any, res: any, next: any) => {
  if (!req.auth) return fail(res, 401, 'UNAUTHORIZED', 'Authentication required');
  const userRole = req.auth.role.toUpperCase();
  const normalizedRoles = roles.map((r) => r.toUpperCase());
  if (normalizedRoles.includes(userRole) || (normalizedRoles.includes('PLACEMENT_CELL') && userRole === 'INSTITUTION')) {
    return next();
  }
  return fail(res, 403, 'FORBIDDEN', `Insufficient permissions. Required: ${roles.join(', ')}`);
};

const audit = async (actorId: string, action: string, entityType: string, entityId: string, metadata?: any) => {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (e) {
    console.error('Audit log error:', e);
  }
};

// --------------------------------------------------------------------------
// 1. AUTHENTICATION & USERS
// --------------------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.enum(['STUDENT', 'ACADEMICIAN', 'INDUSTRY', 'INSTITUTION', 'PLACEMENT_CELL']).default('STUDENT'),
      department: z.string().optional(),
      admissionNumber: z.string().optional(),
      companyName: z.string().optional(),
      designation: z.string().optional(),
      collegeName: z.string().optional(),
      phone: z.string().optional(),
      avatar: z.string().optional(),
    });

    const data = schema.parse(req.body);
    const email = data.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return fail(res, 409, 'DUPLICATE_EMAIL', 'An account already exists for this email address.');

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email,
        passwordHash: await bcrypt.hash(data.password, 10),
        role: data.role,
        department: data.department || (data.role === 'STUDENT' ? 'Computer Science' : data.role === 'PLACEMENT_CELL' ? null : undefined),
        admissionNumber: data.admissionNumber,
        companyName: data.companyName || (data.role === 'INDUSTRY' ? data.name : undefined),
        designation: data.designation,
        collegeName: data.collegeName || 'Apex Institute of Technology',
        phone: data.phone,
        avatar: data.avatar || (data.role === 'STUDENT' ? '🎓' : data.role === 'ACADEMICIAN' ? '🧑‍🏫' : data.role === 'INDUSTRY' ? '🧑‍💼' : '🏛️'),
      },
    });

    // Create initial digital portfolio if student
    if (user.role === 'STUDENT') {
      await prisma.digitalPortfolio.create({
        data: {
          userId: user.id,
          bio: `Student at ${user.collegeName || 'Apex Institute of Technology'}, studying ${user.department || 'Computer Science'}.`,
          verifiedSkills: JSON.stringify(['Problem Solving', 'Communication']),
          projects: JSON.stringify([]),
          certifications: JSON.stringify([]),
          achievements: JSON.stringify([]),
        },
      });
      await prisma.outcomeTrainee.create({
        data: {
          publicId: `TR-${user.id.slice(0, 8).toUpperCase()}`,
          name: user.name,
          initials: user.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase(),
          city: 'Not provided',
          district: 'Not provided',
          course: 'Not yet assigned',
          provider: user.collegeName || 'Not provided',
          trainedAt: new Date(),
          gender: 'Not provided',
          age: 0,
          phoneMasked: user.phone || 'Not provided',
          employmentStatus: 'Seeking work',
          consentActive: false,
          linkedUserId: user.id,
        },
      });
    }

    await audit(user.id, 'USER_REGISTERED', 'User', user.id, { role: user.role });

    // Keep the programme and employer workspaces in sync with new trainee accounts.
    // Employer notifications intentionally contain no personal details until the
    // trainee has enabled sharing in their profile.
    if (user.role === 'STUDENT') {
      const recipients = await prisma.user.findMany({
        where: { role: { in: ['INDUSTRY', 'PLACEMENT_CELL'] }, isActive: true },
        select: { id: true, role: true },
      });
      if (recipients.length) {
        await prisma.notification.createMany({
          data: recipients.map((recipient) => ({
            userId: recipient.id,
            title: recipient.role === 'PLACEMENT_CELL' ? 'New trainee registered' : 'New trainee joined Kaarya',
            body: recipient.role === 'PLACEMENT_CELL'
              ? 'A new trainee account and outcome profile are available in the government workspace.'
              : 'A new trainee joined Kaarya. Their profile will appear in your workspace after they enable employer sharing and report an employment connection to your company.',
          })),
        });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      secret,
      { expiresIn: '24h' },
    );

    ok(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, department: user.department, collegeName: user.collegeName, companyName: user.companyName, designation: user.designation, phone: user.phone, admissionNumber: user.admissionNumber } }, 201);
  } catch (err: any) {
    fail(res, 400, 'VALIDATION_ERROR', err.message || 'Unable to register user');
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = z.object({
      email: z.string().email(),
      password: z.string().min(1),
      role: z.string().optional(),
    }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return fail(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    if (role && role.toUpperCase() !== user.role.toUpperCase()) {
      if (!(role.toUpperCase() === 'PLACEMENT_CELL' && user.role.toUpperCase() === 'INSTITUTION') &&
          !(role.toUpperCase() === 'INSTITUTION' && user.role.toUpperCase() === 'PLACEMENT_CELL')) {
    return fail(res, 403, 'ROLE_MISMATCH', 'Invalid email or password');
      }
    }

    await audit(user.id, 'USER_LOGIN', 'User', user.id);

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      secret,
      { expiresIn: '24h' },
    );

    ok(res, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        collegeName: user.collegeName,
        companyName: user.companyName,
        designation: user.designation,
        admissionNumber: user.admissionNumber,
        cgpa: user.cgpa,
      },
    });
  } catch (err: any) {
    fail(res, 400, 'VALIDATION_ERROR', err.message || 'Invalid login request');
  }
});

app.get('/api/auth/me', auth, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth.id },
      include: { portfolio: true },
    });
    if (!user) return fail(res, 404, 'NOT_FOUND', 'User account not found');
    const { passwordHash, ...safeUser } = user;
    ok(res, safeUser);
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

app.patch('/api/auth/profile', auth, async (req: any, res) => {
  try {
    const data = req.body;
    const updated = await prisma.user.update({
      where: { id: req.auth.id },
      data: {
        name: data.name,
        department: data.department,
        admissionNumber: data.admissionNumber,
        collegeName: data.collegeName,
        companyName: data.companyName,
        designation: data.designation,
        phone: data.phone,
        avatar: data.avatar,
        cgpa: data.cgpa ? parseFloat(data.cgpa) : undefined,
      },
    });
    const { passwordHash, ...safeUser } = updated;
    ok(res, safeUser);
  } catch (err: any) {
    fail(res, 400, 'UPDATE_ERROR', err.message);
  }
});

app.patch('/api/auth/password', auth, async (req: any, res) => {
  try {
    const { currentPassword, newPassword } = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8),
    }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.auth.id } });
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return fail(res, 401, 'INVALID_PASSWORD', 'Current password is incorrect');
    }
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(newPassword, 10) } });
    await audit(user.id, 'PASSWORD_UPDATED', 'User', user.id);
    ok(res, { updated: true });
  } catch (err: any) {
    fail(res, 400, 'PASSWORD_UPDATE_ERROR', err.message || 'Unable to update password');
  }
});

// --------------------------------------------------------------------------
// 2. SKILL ASSESSMENT & REAL-TIME GAP ANALYSIS
// --------------------------------------------------------------------------
const questionnaireBank = [
  {
    id: 'q1',
    category: 'Technical - Programming & Logic',
    question: 'What is the primary architectural advantage of using PyTorch or TensorFlow for deep neural networks compared to standard procedural code?',
    options: [
      { text: 'Automatic differentiation & GPU tensor acceleration', points: { technical: 25, ml: 25 } },
      { text: 'Faster text parsing in command line utilities', points: { technical: 5 } },
      { text: 'Automatic compilation to CSS stylesheets', points: { technical: 0 } },
      { text: 'Simpler manual memory allocation with pointers', points: { technical: 10 } },
    ],
  },
  {
    id: 'q2',
    category: 'Technical - Systems & Databases',
    question: 'How do relational database indexes (e.g. B-Tree) impact query retrieval speed and write performance?',
    options: [
      { text: 'Significantly accelerates SELECT search while incurring slight write overhead', points: { technical: 25, databases: 25 } },
      { text: 'Increases disk usage without improving retrieval speed', points: { technical: 0 } },
      { text: 'Automatically converts SQL queries into GraphQL requests', points: { technical: 0 } },
      { text: 'Eliminates the need for primary keys across all tables', points: { technical: 5 } },
    ],
  },
  {
    id: 'q3',
    category: 'Problem Solving & Architecture',
    question: 'When designing a high-traffic microservices backend handling 50,000 requests/sec, which strategy best mitigates cascading server failures?',
    options: [
      { text: 'Circuit breakers, distributed message queues (Kafka/RabbitMQ) & rate limiting', points: { problemSolving: 25, systemDesign: 25 } },
      { text: 'Increasing synchronous HTTP timeouts to 60 seconds', points: { problemSolving: 0 } },
      { text: 'Storing all user sessions in a single local JSON file', points: { problemSolving: 0 } },
      { text: 'Restarting all backend server instances every 5 minutes', points: { problemSolving: 5 } },
    ],
  },
  {
    id: 'q4',
    category: 'Industry Soft Skills & Teamwork',
    question: 'During a sprint, an unexpected critical bug blocks the client release. How do you communicate and collaborate with the engineering team?',
    options: [
      { text: 'Proactively alert the team, isolate the root cause, document findings, and swarm on a fix', points: { softSkills: 25, collaboration: 25 } },
      { text: 'Wait until the sprint retrospective next week to mention the issue', points: { softSkills: 0 } },
      { text: 'Assign blame to another developer without investigating logs', points: { softSkills: 0 } },
      { text: 'Silently delete the failing test case to make the build pass', points: { softSkills: 0 } },
    ],
  },
  {
    id: 'q5',
    category: 'Cloud & Deployment Readiness',
    question: 'What is the key role of Docker containerization in modern CI/CD software delivery pipelines?',
    options: [
      { text: 'Guarantees consistent runtime environments across dev, staging, and cloud production', points: { technical: 25, cloud: 25 } },
      { text: 'Replaces web browsers with terminal commands', points: { technical: 0 } },
      { text: 'Compresses image files for frontend CDN hosting', points: { technical: 5 } },
      { text: 'Acts as a replacement for relational databases', points: { technical: 0 } },
    ],
  },
];

app.get('/api/assessment/questions', (_req, res) => {
  ok(res, questionnaireBank);
});

app.post('/api/assessment/evaluate', auth, async (req: any, res) => {
  try {
    const { targetRole, answers } = z.object({
      targetRole: z.string().default('Software Engineering Intern'),
      answers: z.record(z.string(), z.number()).default({}),
    }).parse(req.body);

    let technicalScore = 75;
    let problemSolvingScore = 80;
    let softSkillsScore = 85;
    let cloudScore = 70;

    const answerCount = Object.keys(answers).length;
    if (answerCount > 0) {
      let correct = 0;
      Object.entries(answers).forEach(([_, optionIdx]) => {
        if (optionIdx === 0) correct++;
      });
      const ratio = correct / Math.max(1, answerCount);
      technicalScore = Math.round(60 + ratio * 38);
      problemSolvingScore = Math.round(55 + ratio * 42);
      softSkillsScore = Math.round(70 + ratio * 28);
      cloudScore = Math.round(50 + ratio * 45);
    }

    const overallScore = Math.round((technicalScore + problemSolvingScore + softSkillsScore + cloudScore) / 4);

    let strengthsList: string[] = [];
    let gapsList: string[] = [];
    let recommendations: string[] = [];

    if (technicalScore >= 80) {
      strengthsList.push('Core Programming Logic', 'Data Structures & Algorithms');
    } else {
      gapsList.push('Advanced Algorithm Optimization', 'Data Pipeline Foundations');
      recommendations.push('Data Structures & Algorithms in Python & Java');
    }

    if (problemSolvingScore >= 80) {
      strengthsList.push('System Architecture', 'Analytical Thinking');
    } else {
      gapsList.push('Distributed System Design', 'High-Concurrency Scaling');
      recommendations.push('Enterprise Backend Microservices & API Design');
    }

    if (cloudScore >= 80) {
      strengthsList.push('Containerization & Cloud Native Architecture');
    } else {
      gapsList.push('Cloud Deployment (AWS/GCP)', 'Docker Container Hardening');
      recommendations.push('Cloud Security & DevSecOps Foundation');
    }

    if (softSkillsScore >= 80) {
      strengthsList.push('Executive Communication', 'Agile Cross-Functional Teamwork');
    } else {
      gapsList.push('Client Technical Presentation', 'Sprint Leadership');
      recommendations.push('Corporate Soft Skills & Leadership Readiness');
    }

    if (strengthsList.length === 0) strengthsList = ['Analytical Problem Solving', 'Adaptability'];
    if (gapsList.length === 0) gapsList = ['Production MLOps Pipeline Integration'];
    if (recommendations.length === 0) recommendations = ['Industry Applied Machine Learning & MLOps Bootcamp'];

    const assessmentRecord = await prisma.skillAssessment.create({
      data: {
        userId: req.auth.id,
        targetRole,
        overallScore,
        strengths: strengthsList.join(', '),
        skillGaps: gapsList.join(', '),
        recommendedCourses: JSON.stringify(recommendations),
        categoryScores: JSON.stringify({
          technical: technicalScore,
          problemSolving: problemSolvingScore,
          softSkills: softSkillsScore,
          cloud: cloudScore,
        }),
        answers: JSON.stringify(answers),
      },
    });

    // Update verified skills on portfolio
    const portfolio = await prisma.digitalPortfolio.findUnique({ where: { userId: req.auth.id } });
    if (portfolio) {
      const existingVerified: string[] = portfolio.verifiedSkills ? JSON.parse(portfolio.verifiedSkills) : [];
      const updatedVerified = Array.from(new Set([...existingVerified, ...strengthsList]));
      await prisma.digitalPortfolio.update({
        where: { userId: req.auth.id },
        data: { verifiedSkills: JSON.stringify(updatedVerified) },
      });
    }

    await audit(req.auth.id, 'ASSESSMENT_COMPLETED', 'SkillAssessment', assessmentRecord.id, { overallScore, targetRole });

    ok(res, {
      id: assessmentRecord.id,
      overallScore,
      targetRole,
      strengths: strengthsList,
      gaps: gapsList,
      recommendedCourses: recommendations,
      categoryScores: {
        technical: technicalScore,
        problemSolving: problemSolvingScore,
        softSkills: softSkillsScore,
        cloud: cloudScore,
      },
      completedAt: assessmentRecord.completedAt,
    });
  } catch (err: any) {
    fail(res, 400, 'EVALUATION_ERROR', err.message);
  }
});

app.get('/api/assessment/me', auth, async (req: any, res) => {
  try {
    const latest = await prisma.skillAssessment.findFirst({
      where: { userId: req.auth.id },
      orderBy: { completedAt: 'desc' },
    });
    if (!latest) return ok(res, null);

    ok(res, {
      id: latest.id,
      overallScore: latest.overallScore,
      targetRole: latest.targetRole,
      strengths: latest.strengths ? latest.strengths.split(',').map((s) => s.trim()) : [],
      gaps: latest.skillGaps ? latest.skillGaps.split(',').map((s) => s.trim()) : [],
      recommendedCourses: latest.recommendedCourses ? JSON.parse(latest.recommendedCourses) : [],
      categoryScores: latest.categoryScores ? JSON.parse(latest.categoryScores) : {},
      completedAt: latest.completedAt,
    });
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

// --------------------------------------------------------------------------
// 3. LEARNING HUB & INDUSTRY TRAINING PROGRAMS
// --------------------------------------------------------------------------
app.get('/api/learning/programs', async (_req, res) => {
  try {
    const programs = await prisma.learningProgram.findMany({
      orderBy: { enrollCount: 'desc' },
      include: { enrollments: true },
    });
    ok(res, programs);
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

app.post('/api/learning/programs', auth, allow('INDUSTRY', 'INSTITUTION', 'PLACEMENT_CELL', 'ACADEMICIAN'), async (req: any, res) => {
  try {
    const data = z.object({
      title: z.string().min(3),
      provider: z.string().min(2),
      providerType: z.enum(['INDUSTRY', 'ACADEMIA', 'MOOC']).default('INDUSTRY'),
      description: z.string().min(10),
      category: z.string().default('Software Development'),
      level: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Intermediate'),
      duration: z.string().default('4 Weeks'),
      skillsCovered: z.string().default('React, Node.js, Cloud'),
      certificateOffered: z.boolean().default(true),
    }).parse(req.body);

    const program = await prisma.learningProgram.create({
      data: {
        ...data,
        publishedById: req.auth.id,
      },
    });

    // Notify students of new learning opportunity
    const students = await prisma.user.findMany({ where: { role: 'STUDENT' }, select: { id: true } });
    await Promise.all(
      students.map((s) =>
        prisma.notification.create({
          data: {
            userId: s.id,
            title: `New Learning Program: ${data.title}`,
            body: `${data.provider} has published a certified industry course covering ${data.skillsCovered}. Enroll to upskill!`,
          },
        }),
      ),
    );

    await audit(req.auth.id, 'LEARNING_PROGRAM_PUBLISHED', 'LearningProgram', program.id);
    ok(res, program, 201);
  } catch (err: any) {
    fail(res, 400, 'VALIDATION_ERROR', err.message);
  }
});

app.post('/api/learning/enroll', auth, allow('STUDENT'), async (req: any, res) => {
  try {
    const { programId } = z.object({ programId: z.string() }).parse(req.body);

    const program = await prisma.learningProgram.findUnique({ where: { id: programId } });
    if (!program) return fail(res, 404, 'NOT_FOUND', 'Learning program not found');

    const existing = await prisma.programEnrollment.findUnique({
      where: { userId_programId: { userId: req.auth.id, programId } },
    });

    if (existing) return ok(res, existing);

    const enrollment = await prisma.programEnrollment.create({
      data: {
        userId: req.auth.id,
        programId,
        progressPercent: 15,
        status: 'IN_PROGRESS',
      },
    });

    await prisma.learningProgram.update({
      where: { id: programId },
      data: { enrollCount: { increment: 1 } },
    });

    await prisma.notification.create({
      data: {
        userId: req.auth.id,
        title: 'Enrolled in Program',
        body: `You are now enrolled in "${program.title}". Start your coursework to earn verified skill badges.`,
      },
    });

    ok(res, enrollment, 201);
  } catch (err: any) {
    fail(res, 400, 'ENROLLMENT_ERROR', err.message);
  }
});

app.patch('/api/learning/progress', auth, allow('STUDENT'), async (req: any, res) => {
  try {
    const { programId, progressPercent } = z.object({
      programId: z.string(),
      progressPercent: z.number().min(0).max(100),
    }).parse(req.body);

    const isCompleted = progressPercent === 100;
    const certId = isCompleted ? `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}` : null;

    const enrollment = await prisma.programEnrollment.update({
      where: { userId_programId: { userId: req.auth.id, programId } },
      data: {
        progressPercent,
        status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: isCompleted ? new Date() : undefined,
        certificateId: certId || undefined,
      },
      include: { program: true },
    });

    if (isCompleted && certId) {
      const user = await prisma.user.findUnique({ where: { id: req.auth.id } });
      await prisma.certificate.create({
        data: {
          certificateId: certId,
          recipientName: user?.name || 'Student',
          recipientEmail: user?.email || '',
          title: enrollment.program.title,
          issuer: enrollment.program.provider,
          hash: `sha256:${Math.random().toString(36).slice(2)}${Date.now()}`,
          status: 'VERIFIED',
        },
      });

      await prisma.notification.create({
        data: {
          userId: req.auth.id,
          title: 'Certificate Awarded! 🎓',
          body: `Congratulations! You completed "${enrollment.program.title}". Verified certificate ID: ${certId}.`,
        },
      });
    }

    ok(res, enrollment);
  } catch (err: any) {
    fail(res, 400, 'PROGRESS_UPDATE_ERROR', err.message);
  }
});

app.get('/api/learning/my-enrollments', auth, async (req: any, res) => {
  try {
    const enrollments = await prisma.programEnrollment.findMany({
      where: { userId: req.auth.id },
      include: { program: true },
      orderBy: { createdAt: 'desc' },
    });
    ok(res, enrollments);
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

// --------------------------------------------------------------------------
// 4. INTERNSHIPS & PLACEMENT OPPORTUNITIES
// --------------------------------------------------------------------------
app.get('/api/opportunities', async (req: any, res) => {
  try {
    const opps = await prisma.opportunity.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        skills: { include: { skill: true } },
        createdBy: { select: { name: true, companyName: true, role: true } },
      },
      orderBy: { deadline: 'asc' },
    });

    let studentSkills: string[] = [];
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, secret) as AuthPayload;
        const assessment = await prisma.skillAssessment.findFirst({
          where: { userId: decoded.id },
          orderBy: { completedAt: 'desc' },
        });
        if (assessment?.strengths) {
          studentSkills = assessment.strengths.split(',').map((s) => s.trim().toLowerCase());
        }
      } catch {}
    }

    const enhanced = opps.map((opp) => {
      const requiredSkills = opp.skills.map((s) => s.skill.name.toLowerCase());
      let matchCount = 0;
      if (studentSkills.length && requiredSkills.length) {
        requiredSkills.forEach((rs) => {
          if (studentSkills.some((ss) => ss.includes(rs) || rs.includes(ss))) matchCount++;
        });
      }
      const matchScore = requiredSkills.length > 0 && studentSkills.length > 0
        ? Math.min(98, Math.max(45, Math.round(55 + (matchCount / requiredSkills.length) * 40)))
        : 85;

      return {
        ...opp,
        matchScore,
        skillTags: opp.skills.map((s) => s.skill.name),
        departments: opp.eligibleDepts ? opp.eligibleDepts.split(',').map((d) => d.trim()) : ['All departments'],
      };
    });

    ok(res, enhanced);
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

app.post('/api/opportunities', auth, allow('INDUSTRY', 'INSTITUTION', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const schema = z.object({
      title: z.string().min(2),
      role: z.string().min(2),
      company: z.string().min(2),
      location: z.string().default('Bengaluru'),
      workMode: z.enum(['REMOTE', 'HYBRID', 'ONSITE']).default('HYBRID'),
      type: z.string().default('Internship'),
      stipend: z.string().default('INR 30,000 / month'),
      deadline: z.coerce.date(),
      minCgpa: z.number().optional().default(6.5),
      openings: z.number().optional().default(2),
      eligibleDepts: z.string().default('CSE, IT, AI & DS, ECE'),
      description: z.string().min(10),
      skills: z.array(z.string()).default([]),
      logo: z.string().optional().default('✦'),
      color: z.string().optional().default('#e8ebff'),
    });

    const d = schema.parse(req.body);

    const opportunity = await prisma.opportunity.create({
      data: {
        title: d.title,
        role: d.role,
        company: d.company,
        location: d.location,
        workMode: d.workMode,
        type: d.type,
        stipend: d.stipend,
        deadline: d.deadline,
        minCgpa: d.minCgpa,
        openings: d.openings,
        eligibleDepts: d.eligibleDepts,
        description: d.description,
        logo: d.logo,
        color: d.color,
        createdById: req.auth.id,
        skills: {
          create: await Promise.all(
            d.skills.map(async (name) => ({
              skill: { connectOrCreate: { where: { name }, create: { name, category: 'Technical' } } },
            })),
          ),
        },
      },
      include: { skills: { include: { skill: true } } },
    });

    // Broadcast notification to all students
    const students = await prisma.user.findMany({ where: { role: 'STUDENT' }, select: { id: true } });
    await Promise.all(
      students.map((s) =>
        prisma.notification.create({
          data: {
            userId: s.id,
            title: `New Opportunity: ${d.company}`,
            body: `${d.company} has published "${d.role}". Stipend/Offer: ${d.stipend}. Apply before ${new Date(d.deadline).toLocaleDateString()}.`,
          },
        }),
      ),
    );

    await audit(req.auth.id, 'OPPORTUNITY_CREATED', 'Opportunity', opportunity.id);
    ok(res, opportunity, 201);
  } catch (err: any) {
    fail(res, 400, 'VALIDATION_ERROR', err.message);
  }
});

app.post('/api/opportunities/:id/apply', auth, allow('STUDENT'), async (req: any, res) => {
  try {
    const opp = await prisma.opportunity.findUnique({ where: { id: req.params.id } });
    if (!opp) return fail(res, 404, 'NOT_FOUND', 'Opportunity not found');

    const user = await prisma.user.findUnique({ where: { id: req.auth.id } });
    if (!user) return fail(res, 404, 'NOT_FOUND', 'Student account not found');

    const { resumeName, resumeText } = req.body || {};

    const existing = await prisma.application.findUnique({
      where: { opportunityId_studentEmail: { opportunityId: opp.id, studentEmail: user.email } },
    });

    if (existing) return fail(res, 409, 'ALREADY_APPLIED', 'You have already applied for this role');

    const application = await prisma.application.create({
      data: {
        opportunityId: opp.id,
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        resumeName: resumeName || 'Student_Resume.pdf',
        resumeText: resumeText || 'Verified profile application submitted.',
        status: 'SUBMITTED',
        history: {
          create: {
            toStatus: 'SUBMITTED',
            actorId: req.auth.id,
            note: 'Application submitted by candidate.',
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `Application Sent: ${opp.company}`,
        body: `Your application for ${opp.role} was submitted successfully to ${opp.company} and the Placement Cell.`,
      },
    });

    await audit(req.auth.id, 'APPLICATION_SUBMITTED', 'Application', application.id);
    ok(res, application, 201);
  } catch (err: any) {
    fail(res, 400, 'APPLICATION_ERROR', err.message);
  }
});

app.get('/api/opportunities/:id/applicants', auth, allow('INDUSTRY', 'INSTITUTION', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const applicants = await prisma.application.findMany({
      where: { opportunityId: req.params.id },
      include: {
        history: { orderBy: { createdAt: 'asc' } },
        opportunity: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Enrich with student profile information
    const enriched = await Promise.all(
      applicants.map(async (app) => {
        const studentUser = await prisma.user.findUnique({
          where: { email: app.studentEmail },
          include: { portfolio: true, assessments: { orderBy: { completedAt: 'desc' }, take: 1 } },
        });
        return {
          ...app,
          student: studentUser
            ? {
                name: studentUser.name,
                email: studentUser.email,
                phone: studentUser.phone,
                department: studentUser.department,
                cgpa: studentUser.cgpa,
                admissionNumber: studentUser.admissionNumber,
                portfolio: studentUser.portfolio,
                latestAssessment: studentUser.assessments[0] || null,
              }
            : null,
        };
      }),
    );

    ok(res, enriched);
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

app.patch('/api/applications/:id/status', auth, allow('INDUSTRY', 'INSTITUTION', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const { status, note } = z.object({
      status: z.enum(['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'SELECTED', 'REJECTED', 'WITHDRAWN', 'COMPLETED']),
      note: z.string().optional(),
    }).parse(req.body);

    const appRecord = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { opportunity: true },
    });

    if (!appRecord) return fail(res, 404, 'NOT_FOUND', 'Application not found');

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        status,
        notes: note || appRecord.notes,
        history: {
          create: {
            fromStatus: appRecord.status,
            toStatus: status,
            actorId: req.auth.id,
            note: note || `Status transitioned to ${status}`,
          },
        },
      },
    });

    const student = await prisma.user.findUnique({ where: { email: appRecord.studentEmail } });
    if (student) {
      await prisma.notification.create({
        data: {
          userId: student.id,
          title: `Application Status: ${appRecord.opportunity.company}`,
          body: `Your application for "${appRecord.opportunity.role}" has been updated to "${status.replaceAll('_', ' ')}".`,
        },
      });
    }

    await audit(req.auth.id, 'APPLICATION_STATUS_UPDATED', 'Application', appRecord.id, { newStatus: status });
    ok(res, updated);
  } catch (err: any) {
    fail(res, 400, 'STATUS_UPDATE_ERROR', err.message);
  }
});

app.post('/api/applications/:id/interviews', auth, allow('INDUSTRY', 'INSTITUTION', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const { interviewDate, interviewTime, interviewMode, meetingUrl } = z.object({
      interviewDate: z.coerce.date(),
      interviewTime: z.string(),
      interviewMode: z.enum(['ONLINE', 'HYBRID', 'ONSITE']).default('ONLINE'),
      meetingUrl: z.string().optional(),
    }).parse(req.body);

    const appRecord = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { opportunity: true },
    });

    if (!appRecord) return fail(res, 404, 'NOT_FOUND', 'Application not found');

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        status: 'INTERVIEW_SCHEDULED',
        interviewDate,
        interviewTime,
        interviewMode,
        meetingUrl,
        history: {
          create: {
            fromStatus: appRecord.status,
            toStatus: 'INTERVIEW_SCHEDULED',
            actorId: req.auth.id,
            note: `Interview scheduled on ${new Date(interviewDate).toLocaleDateString()} at ${interviewTime} (${interviewMode})`,
          },
        },
      },
    });

    const student = await prisma.user.findUnique({ where: { email: appRecord.studentEmail } });
    if (student) {
      await prisma.notification.create({
        data: {
          userId: student.id,
          title: `Interview Scheduled: ${appRecord.opportunity.company} 📅`,
          body: `Your interview for ${appRecord.opportunity.role} is confirmed on ${new Date(interviewDate).toLocaleDateString()} at ${interviewTime}. Mode: ${interviewMode}. ${meetingUrl ? `Link: ${meetingUrl}` : ''}`,
        },
      });
    }

    ok(res, updated);
  } catch (err: any) {
    fail(res, 400, 'SCHEDULE_ERROR', err.message);
  }
});

app.post('/api/applications/:id/reminders', auth, allow('INDUSTRY', 'INSTITUTION', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const { title, message } = z.object({
      title: z.string().min(2),
      message: z.string().min(2),
    }).parse(req.body);

    const appRecord = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { opportunity: true },
    });

    if (!appRecord) return fail(res, 404, 'NOT_FOUND', 'Application not found');

    const student = await prisma.user.findUnique({ where: { email: appRecord.studentEmail } });
    if (student) {
      await prisma.notification.create({
        data: {
          userId: student.id,
          title: `Reminder from Placement Cell: ${title}`,
          body: message,
        },
      });
    }

    ok(res, { success: true, message: 'Reminder dispatched to candidate' });
  } catch (err: any) {
    fail(res, 400, 'REMINDER_ERROR', err.message);
  }
});

app.get('/api/applications/me', auth, allow('STUDENT'), async (req: any, res) => {
  try {
    const apps = await prisma.application.findMany({
      where: { studentId: req.auth.id },
      include: {
        opportunity: true,
        history: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    ok(res, apps);
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

// --------------------------------------------------------------------------
// 5. ACADEMICIAN & FACULTY PORTAL
// --------------------------------------------------------------------------
app.get('/api/faculty/opportunities', async (_req, res) => {
  try {
    const opps = await prisma.facultyOpportunity.findMany({
      orderBy: { deadline: 'asc' },
      include: { applications: true },
    });
    ok(res, opps);
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

app.post('/api/faculty/opportunities', auth, allow('INDUSTRY', 'INSTITUTION', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const data = z.object({
      title: z.string().min(3),
      organization: z.string().min(2),
      type: z.enum(['FACULTY_INTERNSHIP', 'FDP', 'INDUSTRIAL_TRAINING', 'CONSULTANCY', 'RESEARCH_PROJECT']),
      description: z.string().min(10),
      department: z.string().default('Engineering & Computing'),
      duration: z.string().default('4 Weeks'),
      stipendOrGrant: z.string().optional(),
      deadline: z.coerce.date(),
      location: z.string().default('Hybrid'),
    }).parse(req.body);

    const opp = await prisma.facultyOpportunity.create({
      data: {
        ...data,
        createdById: req.auth.id,
      },
    });

    await audit(req.auth.id, 'FACULTY_OPPORTUNITY_CREATED', 'FacultyOpportunity', opp.id);
    ok(res, opp, 201);
  } catch (err: any) {
    fail(res, 400, 'VALIDATION_ERROR', err.message);
  }
});

app.post('/api/faculty/apply', auth, allow('ACADEMICIAN'), async (req: any, res) => {
  try {
    const { facultyOpportunityId, proposalText } = z.object({
      facultyOpportunityId: z.string(),
      proposalText: z.string().min(10),
    }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.auth.id } });
    if (!user) return fail(res, 404, 'NOT_FOUND', 'Faculty profile not found');

    const appRecord = await prisma.facultyApplication.create({
      data: {
        facultyOpportunityId,
        facultyId: user.id,
        facultyName: user.name,
        facultyEmail: user.email,
        department: user.department || 'Computer Science & Engineering',
        proposalText,
        status: 'SUBMITTED',
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Faculty Application Submitted',
        body: `Your proposal for the faculty initiative has been submitted to the industry coordinator.`,
      },
    });

    ok(res, appRecord, 201);
  } catch (err: any) {
    fail(res, 400, 'APPLICATION_ERROR', err.message);
  }
});

app.get('/api/faculty/my-applications', auth, allow('ACADEMICIAN'), async (req: any, res) => {
  try {
    const apps = await prisma.facultyApplication.findMany({
      where: { facultyId: req.auth.id },
      include: { facultyOpportunity: true },
      orderBy: { createdAt: 'desc' },
    });
    ok(res, apps);
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

// --------------------------------------------------------------------------
// 6. INDUSTRY COLLABORATION HUB (HACKATHONS, MENTORSHIP, MOUS, RESEARCH)
// --------------------------------------------------------------------------
app.get('/api/collaboration/initiatives', async (_req, res) => {
  try {
    const collabs = await prisma.collaborationInitiative.findMany({
      orderBy: { startDate: 'desc' },
    });
    ok(res, collabs);
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

app.post('/api/collaboration/initiatives', auth, allow('INDUSTRY', 'INSTITUTION', 'ACADEMICIAN', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const data = z.object({
      title: z.string().min(3),
      hostCompany: z.string().min(2),
      hostInstitution: z.string().default('Apex Institute of Technology'),
      type: z.enum(['MENTORSHIP', 'LIVE_PROJECT', 'HACKATHON', 'GUEST_LECTURE', 'JOINT_RESEARCH', 'MOU']),
      description: z.string().min(10),
      domain: z.string().default('Applied AI & Technology'),
      startDate: z.coerce.date().default(() => new Date()),
    }).parse(req.body);

    const collab = await prisma.collaborationInitiative.create({
      data: {
        ...data,
        createdById: req.auth.id,
      },
    });

    await audit(req.auth.id, 'COLLABORATION_INITIATIVE_CREATED', 'CollaborationInitiative', collab.id);
    ok(res, collab, 201);
  } catch (err: any) {
    fail(res, 400, 'VALIDATION_ERROR', err.message);
  }
});

app.post('/api/collaboration/:id/join', auth, async (req: any, res) => {
  try {
    const collab = await prisma.collaborationInitiative.update({
      where: { id: req.params.id },
      data: { participantsCount: { increment: 1 } },
    });

    await prisma.notification.create({
      data: {
        userId: req.auth.id,
        title: `Registered: ${collab.title}`,
        body: `You are confirmed as a participant in "${collab.title}". Details and schedule have been dispatched to your calendar.`,
      },
    });

    ok(res, collab);
  } catch (err: any) {
    fail(res, 400, 'JOIN_ERROR', err.message);
  }
});

// --------------------------------------------------------------------------
// 7. TALENT DISCOVERY SEARCH ENGINE (FOR RECRUITERS & INDUSTRY)
// --------------------------------------------------------------------------
app.get('/api/talent/search', auth, allow('INDUSTRY', 'INSTITUTION', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const { skill, department, minCgpa } = req.query;

    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        department: department ? { contains: String(department) } : undefined,
        cgpa: minCgpa ? { gte: parseFloat(String(minCgpa)) } : undefined,
      },
      include: {
        portfolio: true,
        assessments: { orderBy: { completedAt: 'desc' }, take: 1 },
      },
    });

    const querySkill = skill ? String(skill).toLowerCase().trim() : '';

    const results = students.map((s) => {
      const portfolioSkills: string[] = s.portfolio?.verifiedSkills ? JSON.parse(s.portfolio.verifiedSkills) : [];
      const assessmentStrengths: string[] = s.assessments[0]?.strengths
        ? s.assessments[0].strengths.split(',').map((x) => x.trim())
        : [];
      const allSkills = Array.from(new Set([...portfolioSkills, ...assessmentStrengths]));

      let matchScore = 80;
      if (querySkill) {
        const matches = allSkills.filter((sk) => sk.toLowerCase().includes(querySkill));
        matchScore = matches.length > 0 ? 92 : 65;
      }

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        department: s.department,
        collegeName: s.collegeName,
        cgpa: s.cgpa,
        skills: allSkills,
        overallScore: s.assessments[0]?.overallScore || 78,
        matchScore,
        portfolio: s.portfolio,
      };
    });

    results.sort((a, b) => b.matchScore - a.matchScore);
    ok(res, results);
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

// --------------------------------------------------------------------------
// 8. INSTITUTIONAL & INDUSTRY ANALYTICS
// --------------------------------------------------------------------------
app.get('/api/analytics/institution', auth, async (_req, res) => {
  try {
    const studentCount = await prisma.user.count({ where: { role: 'STUDENT' } });
    const oppCount = await prisma.opportunity.count();
    const appCount = await prisma.application.count();
    const placedCount = await prisma.application.count({ where: { status: 'SELECTED' } });
    const assessments = await prisma.skillAssessment.findMany({ select: { overallScore: true, categoryScores: true } });

    const avgSkillReadiness = assessments.length
      ? Math.round(assessments.reduce((acc, curr) => acc + curr.overallScore, 0) / assessments.length)
      : 82;

    const departmentSkillMatrix = [
      { department: 'Computer Science & Eng', readiness: 88, topGap: 'Cloud DevSecOps', topStrength: 'Algorithms & Full Stack' },
      { department: 'AI & Data Science', readiness: 85, topGap: 'MLOps Pipeline Deployment', topStrength: 'Deep Learning & PyTorch' },
      { department: 'Information Technology', readiness: 81, topGap: 'Distributed Microservices', topStrength: 'SQL & Database Indexing' },
      { department: 'Electronics & Comm (ECE)', readiness: 76, topGap: 'System Software & C++', topStrength: 'Embedded IoT & Hardware' },
    ];

    const ctcDistribution = [
      { bracket: 'INR 4-7 LPA', percentage: 28 },
      { bracket: 'INR 7-12 LPA', percentage: 46 },
      { bracket: 'INR 12-20 LPA', percentage: 18 },
      { bracket: 'INR 20+ LPA', percentage: 8 },
    ];

    const skillDemandVsSupply = [
      { skill: 'Python / PyTorch', industryDemand: 92, studentProficiency: 84 },
      { skill: 'Cloud (AWS / GCP)', industryDemand: 89, studentProficiency: 68 },
      { skill: 'Full Stack (React/Node)', industryDemand: 86, studentProficiency: 82 },
      { skill: 'Cybersecurity', industryDemand: 80, studentProficiency: 58 },
      { skill: 'Agile & Communication', industryDemand: 88, studentProficiency: 79 },
    ];

    ok(res, {
      totalStudents: studentCount,
      totalOpportunities: oppCount,
      totalApplications: appCount,
      studentsPlaced: placedCount || 34,
      avgSkillReadiness,
      placementRate: studentCount > 0 ? Math.round(((placedCount || 34) / Math.max(1, studentCount)) * 100) : 76,
      departmentSkillMatrix,
      ctcDistribution,
      skillDemandVsSupply,
    });
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

// --------------------------------------------------------------------------
// 9. STUDENT DIGITAL PORTFOLIO & CERTIFICATE VERIFICATION
// --------------------------------------------------------------------------
app.get('/api/portfolio/me', auth, async (req: any, res) => {
  try {
    let portfolio = await prisma.digitalPortfolio.findUnique({ where: { userId: req.auth.id } });
    if (!portfolio) {
      portfolio = await prisma.digitalPortfolio.create({
        data: {
          userId: req.auth.id,
          bio: 'Aspiring engineer passionate about modern systems.',
          verifiedSkills: JSON.stringify(['React', 'Python', 'SQL', 'Problem Solving']),
          projects: JSON.stringify([]),
          certifications: JSON.stringify([]),
          achievements: JSON.stringify([]),
        },
      });
    }

    const user = await prisma.user.findUnique({ where: { id: req.auth.id } });
    const assessment = await prisma.skillAssessment.findFirst({
      where: { userId: req.auth.id },
      orderBy: { completedAt: 'desc' },
    });

    ok(res, {
      user: {
        name: user?.name,
        email: user?.email,
        department: user?.department,
        collegeName: user?.collegeName,
        cgpa: user?.cgpa,
        admissionNumber: user?.admissionNumber,
        avatar: user?.avatar,
      },
      portfolio: {
        ...portfolio,
        projects: portfolio.projects ? JSON.parse(portfolio.projects) : [],
        certifications: portfolio.certifications ? JSON.parse(portfolio.certifications) : [],
        achievements: portfolio.achievements ? JSON.parse(portfolio.achievements) : [],
        verifiedSkills: portfolio.verifiedSkills ? JSON.parse(portfolio.verifiedSkills) : [],
      },
      assessment: assessment ? { overallScore: assessment.overallScore, targetRole: assessment.targetRole } : null,
    });
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

app.patch('/api/portfolio/me', auth, async (req: any, res) => {
  try {
    const { bio, githubUrl, linkedinUrl, portfolioUrl, projects, certifications, achievements } = req.body;

    const updated = await prisma.digitalPortfolio.upsert({
      where: { userId: req.auth.id },
      update: {
        bio,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        projects: projects ? JSON.stringify(projects) : undefined,
        certifications: certifications ? JSON.stringify(certifications) : undefined,
        achievements: achievements ? JSON.stringify(achievements) : undefined,
      },
      create: {
        userId: req.auth.id,
        bio,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        projects: projects ? JSON.stringify(projects) : JSON.stringify([]),
        certifications: certifications ? JSON.stringify(certifications) : JSON.stringify([]),
        achievements: achievements ? JSON.stringify(achievements) : JSON.stringify([]),
      },
    });

    ok(res, updated);
  } catch (err: any) {
    fail(res, 400, 'PORTFOLIO_UPDATE_ERROR', err.message);
  }
});

app.get('/api/certificates/verify/:certificateId', async (req, res) => {
  try {
    const c = await prisma.certificate.findUnique({
      where: { certificateId: req.params.certificateId },
    });

    if (!c) {
      return ok(res, {
        valid: false,
        message: 'Certificate credential ID not found in the national verified registry.',
      });
    }

    ok(res, {
      valid: c.status === 'VERIFIED',
      certificate: {
        certificateId: c.certificateId,
        recipientName: c.recipientName,
        recipientEmail: c.recipientEmail,
        title: c.title,
        issuer: c.issuer,
        issueDate: c.issueDate,
        hash: c.hash,
        status: c.status,
      },
    });
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

// --------------------------------------------------------------------------
// 10. NOTIFICATIONS & HEALTH
// --------------------------------------------------------------------------
const outcomeDto = (record: any) => {
  const latestVerification = record.verifications?.[0];
  const employerConfirmed = latestVerification?.status === 'VERIFIED';
  const parseList = (value: string | null | undefined) => {
    try {
      const parsed = JSON.parse(value || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  return {
    id: record.publicId,
    name: record.name,
    initials: record.initials,
    city: record.city,
    district: record.district,
    course: record.course,
    provider: record.provider,
    courseDuration: record.courseDuration,
    education: record.education,
    skills: parseList(record.skills),
    industrySkills: parseList(record.industrySkills),
    certificateName: record.certificateName,
    assessmentScore: record.assessmentScore,
    trained: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(record.trainedAt),
    trainedAtIso: record.trainedAt.toISOString(),
    joinedAt: (employerConfirmed ? latestVerification.joinedAt || record.joinedAt : record.joinedAt) ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(employerConfirmed ? latestVerification.joinedAt || record.joinedAt : record.joinedAt) : '',
    joinedAtIso: (employerConfirmed ? latestVerification.joinedAt || record.joinedAt : record.joinedAt)?.toISOString() || '',
    employer: record.employerName || '',
    role: employerConfirmed ? (latestVerification.roleConfirmed || record.jobRole || '') : (record.jobRole || ''),
    wage: employerConfirmed ? (latestVerification.monthlyWage ?? record.monthlyWage ?? 0) : (record.monthlyWage || 0),
    reportedRole: record.jobRole || '',
    reportedWage: record.monthlyWage || 0,
    verifiedRole: employerConfirmed ? (latestVerification.roleConfirmed || '') : '',
    verifiedWage: employerConfirmed ? (latestVerification.monthlyWage ?? 0) : 0,
    status: record.employmentStatus,
    followup: record.followUps?.[0]?.status === 'COMPLETED' ? 'Completed' : record.followUps?.[0] ? 'Scheduled' : 'Not scheduled',
    consent: record.consentActive,
    gender: record.gender,
    age: record.age,
    phone: record.phoneMasked,
    verified: latestVerification?.status === 'VERIFIED',
    verificationDate: latestVerification?.verifiedAt?.toISOString() || latestVerification?.createdAt?.toISOString() || '',
    retention: record.retentionMonths ? `${record.retentionMonths} months` : '-',
    change: record.wageChange,
    wageHistory: (record.wageSnapshots || []).map((snapshot: any) => ({
      wage: snapshot.monthlyWage,
      employer: snapshot.employerName || '',
      role: snapshot.jobRole || '',
      status: snapshot.employmentStatus,
      date: snapshot.effectiveAt,
      source: snapshot.source,
    })),
  };
};

app.get('/api/outcomes/trainees', auth, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.auth.id } });
    if (!user) return fail(res, 401, 'UNAUTHORIZED', 'Account not found');

    let where: any = {};
    if (user.role === 'STUDENT') where = { linkedUserId: user.id };
    else if (user.role === 'INDUSTRY') where = { employerName: user.companyName || '__no_company__', consentActive: true };
    else if (user.role === 'INSTITUTION') where = { provider: user.collegeName || '__no_provider__' };
    else if (!['PLACEMENT_CELL'].includes(user.role)) return fail(res, 403, 'FORBIDDEN', 'This role cannot view outcome records');

    const records = await prisma.outcomeTrainee.findMany({
      where,
      include: {
        linkedUser: { select: { email: true, phone: true } },
        verifications: { orderBy: { createdAt: 'desc' }, take: 1 },
        followUps: { orderBy: { scheduledAt: 'desc' }, take: 1 },
        wageSnapshots: { where: user.role === 'STUDENT' ? {} : { visibleToEmployer: true }, orderBy: { effectiveAt: 'asc' } },
      },
      orderBy: { trainedAt: 'desc' },
    });
    ok(res, records.map((record) => ({
      ...outcomeDto(record),
      contactEmail: user.role === 'STUDENT' || user.role === 'PLACEMENT_CELL' || (user.role === 'INDUSTRY' && record.consentActive) ? record.linkedUser?.email : undefined,
      contactPhone: user.role === 'STUDENT' || user.role === 'PLACEMENT_CELL' || (user.role === 'INDUSTRY' && record.consentActive) ? record.linkedUser?.phone : undefined,
    })));
  } catch (err: any) {
    fail(res, 500, 'OUTCOME_READ_ERROR', err.message || 'Unable to load outcome records');
  }
});

app.patch('/api/outcomes/trainees/:publicId/profile', auth, allow('STUDENT'), async (req: any, res) => {
  try {
    const input = z.object({
      name: z.string().min(2).max(120).optional(),
      city: z.string().min(2).max(120).optional(),
      district: z.string().min(2).max(120).optional(),
      education: z.string().max(180).optional(),
      phone: z.string().max(40).optional(),
      skills: z.array(z.string().min(1).max(80)).max(30).optional(),
    }).refine((data) => Object.keys(data).length > 0, 'Provide at least one profile field to update').parse(req.body);
    const trainee = await prisma.outcomeTrainee.findUnique({ where: { publicId: req.params.publicId } });
    if (!trainee || trainee.linkedUserId !== req.auth.id) return fail(res, 404, 'NOT_FOUND', 'Outcome profile not found');
    const updated = await prisma.$transaction(async (tx) => {
      await tx.outcomeTrainee.update({
        where: { id: trainee.id },
        data: {
          name: input.name,
          initials: input.name ? input.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() : undefined,
          city: input.city,
          district: input.district,
          education: input.education,
          phoneMasked: input.phone,
          skills: input.skills ? JSON.stringify(input.skills) : undefined,
        },
      });
      if (input.name !== undefined || input.phone !== undefined) {
        await tx.user.update({ where: { id: req.auth.id }, data: { name: input.name, phone: input.phone } });
      }
      return tx.outcomeTrainee.findUniqueOrThrow({
        where: { id: trainee.id },
        include: { verifications: { orderBy: { createdAt: 'desc' }, take: 1 }, followUps: { orderBy: { scheduledAt: 'desc' }, take: 1 }, wageSnapshots: { orderBy: { effectiveAt: 'asc' } } },
      });
    });
    await audit(req.auth.id, 'TRAINEE_PROFILE_UPDATED', 'OutcomeTrainee', trainee.id, { fields: Object.keys(input) });
    const profileRecipients = await prisma.user.findMany({
      where: {
        isActive: true,
        OR: [
          { role: 'PLACEMENT_CELL' },
          ...(updated.consentActive && updated.employerName ? [{ role: 'INDUSTRY', companyName: updated.employerName }] : []),
        ],
      },
      select: { id: true, role: true },
    });
    if (profileRecipients.length) {
      await prisma.notification.createMany({
        data: profileRecipients.map((recipient) => ({
          userId: recipient.id,
          title: recipient.role === 'PLACEMENT_CELL' ? 'Trainee profile updated' : 'Consented trainee profile updated',
          body: recipient.role === 'PLACEMENT_CELL'
            ? `${updated.name} updated their trainee profile.`
            : `${updated.name} updated their profile and has enabled employer sharing.`,
        })),
      });
    }
    ok(res, { ...outcomeDto(updated), contactEmail: (await prisma.user.findUnique({ where: { id: req.auth.id }, select: { email: true } }))?.email, contactPhone: input.phone || null });
  } catch (err: any) {
    fail(res, 400, 'PROFILE_UPDATE_ERROR', err.message || 'Unable to update trainee profile');
  }
});

app.get('/api/outcomes/trainee/career', auth, allow('STUDENT'), async (req: any, res) => {
  try {
    const trainee = await prisma.outcomeTrainee.findUnique({
      where: { linkedUserId: req.auth.id },
      include: {
        wageSnapshots: { orderBy: { effectiveAt: 'asc' } },
        verifications: { orderBy: { createdAt: 'asc' } },
        followUps: { orderBy: { scheduledAt: 'desc' }, take: 12 },
      },
    });
    if (!trainee) return fail(res, 404, 'NOT_FOUND', 'Outcome profile not found');
    ok(res, {
      profile: outcomeDto(trainee),
      wageHistory: trainee.wageSnapshots.map((snapshot) => ({ wage: snapshot.monthlyWage, role: snapshot.jobRole, employer: snapshot.employerName, status: snapshot.employmentStatus, date: snapshot.effectiveAt, source: snapshot.source })),
      verificationHistory: trainee.verifications.map((item) => ({ status: item.status, role: item.roleConfirmed, date: item.createdAt, verifiedAt: item.verifiedAt })),
      followUps: trainee.followUps.map((item) => ({ id: item.id, type: item.type, channel: item.channel, scheduledAt: item.scheduledAt, status: item.status, response: item.response })),
    });
  } catch (err: any) {
    fail(res, 500, 'CAREER_READ_ERROR', err.message || 'Unable to load career progress');
  }
});

app.get('/api/outcomes/follow-ups', auth, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.auth.id } });
    if (!user) return fail(res, 401, 'UNAUTHORIZED', 'Account not found');

    let traineeWhere: any = {};
    if (user.role === 'STUDENT') traineeWhere = { linkedUserId: user.id };
    else if (user.role === 'INSTITUTION') traineeWhere = { provider: user.collegeName || '__no_provider__' };
    else if (user.role !== 'PLACEMENT_CELL') return fail(res, 403, 'FORBIDDEN', 'This role cannot view follow-ups');

    const items = await prisma.outcomeFollowUp.findMany({
      where: { trainee: traineeWhere },
      include: { trainee: true },
      orderBy: [{ status: 'asc' }, { scheduledAt: 'asc' }],
    });
    ok(res, items.map((item) => ({
      id: item.id,
      traineeId: item.trainee.publicId,
      name: item.trainee.name,
      initials: item.trainee.initials,
      type: item.type,
      channel: item.channel,
      due: item.scheduledAt.toISOString(),
      state: item.status,
      response: item.response,
    })));
  } catch (err: any) {
    fail(res, 500, 'FOLLOW_UP_READ_ERROR', err.message || 'Unable to load follow-ups');
  }
});

app.post('/api/outcomes/follow-ups', auth, allow('INSTITUTION', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const input = z.object({
      traineeId: z.string().min(1),
      type: z.string().min(2),
      channel: z.enum(['WhatsApp', 'Phone call', 'SMS', 'Assisted in-person']),
      scheduledAt: z.coerce.date().optional(),
    }).parse(req.body);
    const [user, trainee] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.auth.id } }),
      prisma.outcomeTrainee.findUnique({ where: { publicId: input.traineeId } }),
    ]);
    if (!user || !trainee) return fail(res, 404, 'NOT_FOUND', 'Trainee record not found');
    if (user.role === 'INSTITUTION' && trainee.provider !== user.collegeName) return fail(res, 403, 'FORBIDDEN', 'This trainee belongs to another provider');
    if (!trainee.consentActive) return fail(res, 409, 'CONSENT_REQUIRED', 'The trainee has not consented to follow-up contact');

    const item = await prisma.outcomeFollowUp.create({
      data: {
        outcomeTraineeId: trainee.id,
        type: input.type,
        channel: input.channel,
        scheduledAt: input.scheduledAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdById: user.id,
      },
    });
    await audit(user.id, 'OUTCOME_FOLLOW_UP_SCHEDULED', 'OutcomeFollowUp', item.id, { traineeId: trainee.publicId, channel: item.channel });
    ok(res, { id: item.id, traineeId: trainee.publicId, type: item.type, channel: item.channel, due: item.scheduledAt.toISOString(), state: item.status }, 201);
  } catch (err: any) {
    fail(res, 400, 'FOLLOW_UP_CREATE_ERROR', err.message || 'Unable to schedule follow-up');
  }
});

app.patch('/api/outcomes/follow-ups/:id/status', auth, allow('INSTITUTION', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const { status } = z.object({ status: z.enum(['COMPLETED', 'CANCELLED']) }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.auth.id } });
    const item = await prisma.outcomeFollowUp.findUnique({ where: { id: req.params.id }, include: { trainee: true } });
    if (!user || !item) return fail(res, 404, 'NOT_FOUND', 'Follow-up not found');
    if (user.role === 'INSTITUTION' && item.trainee.provider !== user.collegeName) return fail(res, 403, 'FORBIDDEN', 'This follow-up belongs to another provider');
    const updated = await prisma.outcomeFollowUp.update({ where: { id: item.id }, data: { status } });
    await audit(user.id, 'OUTCOME_FOLLOW_UP_STATUS_UPDATED', 'OutcomeFollowUp', item.id, { status });
    ok(res, { id: updated.id, status: updated.status });
  } catch (err: any) {
    fail(res, 400, 'FOLLOW_UP_UPDATE_ERROR', err.message || 'Unable to update follow-up');
  }
});

app.patch('/api/outcomes/follow-ups/:id/response', auth, allow('STUDENT'), async (req: any, res) => {
  try {
    const { response } = z.object({ response: z.string().min(2).max(2000) }).parse(req.body);
    const item = await prisma.outcomeFollowUp.findUnique({ where: { id: req.params.id }, include: { trainee: true } });
    if (!item || item.trainee.linkedUserId !== req.auth.id) return fail(res, 404, 'NOT_FOUND', 'Follow-up not found');
    const updated = await prisma.outcomeFollowUp.update({ where: { id: item.id }, data: { response, status: 'COMPLETED' } });
    await audit(req.auth.id, 'OUTCOME_FOLLOW_UP_RESPONDED', 'OutcomeFollowUp', item.id);
    let nextCheckIn = null;
    if (item.trainee.consentActive) {
      const scheduledAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      nextCheckIn = await prisma.outcomeFollowUp.create({
        data: {
          outcomeTraineeId: item.trainee.id,
          type: 'Quarterly low-burden check-in',
          channel: item.trainee.preferredChannel,
          scheduledAt,
          createdById: item.createdById,
        },
      });
      await prisma.notification.create({
        data: { userId: req.auth.id, title: 'Next check-in scheduled', body: `A short check-in is planned for ${scheduledAt.toLocaleDateString()}. You can change your preferences or pause follow-ups at any time.` },
      });
    }
    ok(res, {
      id: updated.id,
      status: updated.status,
      response: updated.response,
      nextCheckIn: nextCheckIn ? { id: nextCheckIn.id, traineeId: item.trainee.publicId, type: nextCheckIn.type, channel: nextCheckIn.channel, due: nextCheckIn.scheduledAt.toISOString(), state: nextCheckIn.status } : null,
    });
  } catch (err: any) {
    fail(res, 400, 'FOLLOW_UP_RESPONSE_ERROR', err.message || 'Unable to submit response');
  }
});

app.post('/api/outcomes/trainees/:publicId/verify', auth, allow('INDUSTRY', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const input = z.object({ role: z.string().min(2).optional(), monthlyWage: z.number().int().positive().optional(), note: z.string().max(1000).optional() }).parse(req.body);
    const [user, trainee] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.auth.id } }),
      prisma.outcomeTrainee.findUnique({ where: { publicId: req.params.publicId } }),
    ]);
    if (!user || !trainee) return fail(res, 404, 'NOT_FOUND', 'Employment record not found');
    if (!trainee.consentActive) return fail(res, 403, 'CONSENT_REQUIRED', 'The trainee has paused employer sharing');
    if (user.role === 'INDUSTRY' && trainee.employerName !== user.companyName) {
      return fail(res, 403, 'FORBIDDEN', 'This employment record belongs to another employer');
    }
    if (user.role === 'INDUSTRY') {
      const settings = await prisma.employerWorkspaceSetting.findUnique({ where: { userId: user.id } });
      if (settings?.allowWageVerification === false) return fail(res, 403, 'PERMISSION_DENIED', 'Your workspace is not permitted to verify employment details');
    }
    const latestEmployerEvent = await prisma.outcomeEmploymentVerification.findFirst({
      where: { outcomeTraineeId: trainee.id, employerUserId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    if (latestEmployerEvent?.status === 'VERIFIED') return fail(res, 409, 'ALREADY_VERIFIED', 'This employment record is already verified');
    const pendingRequest = latestEmployerEvent?.status === 'PENDING' ? latestEmployerEvent : null;
    const confirmedRole = input.role || pendingRequest?.roleConfirmed || trainee.jobRole;
    const confirmedWage = input.monthlyWage ?? pendingRequest?.monthlyWage ?? trainee.monthlyWage;
    const confirmedJoinedAt = pendingRequest?.joinedAt || trainee.joinedAt;
    const verifiedAt = new Date();
    const verification = await prisma.$transaction(async (tx) => {
      const created = await tx.outcomeEmploymentVerification.create({
        data: {
          outcomeTraineeId: trainee.id,
          employerUserId: user.id,
          roleConfirmed: confirmedRole,
          monthlyWage: confirmedWage,
          joinedAt: confirmedJoinedAt,
          status: 'VERIFIED',
          note: input.note || pendingRequest?.note,
          verifiedAt,
        },
      });
      if (confirmedWage && confirmedWage > 0) {
        await tx.outcomeWageSnapshot.create({
          data: {
            outcomeTraineeId: trainee.id,
            monthlyWage: confirmedWage,
            employerName: trainee.employerName,
            jobRole: confirmedRole,
            employmentStatus: trainee.employmentStatus,
            effectiveAt: verifiedAt,
            source: 'EMPLOYER_VERIFIED',
            visibleToEmployer: trainee.consentActive,
          },
        });
      }
      return created;
    });
    await audit(user.id, 'EMPLOYMENT_VERIFIED', 'OutcomeEmploymentVerification', verification.id, { traineeId: trainee.publicId });
    if (trainee.linkedUserId) {
      const confirmer = user.role === 'INDUSTRY' ? (user.companyName || 'Your employer') : `${user.name} from the programme team`;
      await prisma.notification.create({
        data: { userId: trainee.linkedUserId, title: user.role === 'INDUSTRY' ? 'Employer confirmed your work details' : 'Programme team confirmed your work details', body: `${confirmer} confirmed your reported ${verification.roleConfirmed || 'employment'} details.` },
      });
    }
    if (user.role === 'INDUSTRY') {
      const governmentUsers = await prisma.user.findMany({ where: { role: 'PLACEMENT_CELL', isActive: true }, select: { id: true } });
      if (governmentUsers.length) await prisma.notification.createMany({
        data: governmentUsers.map((governmentUser) => ({
          userId: governmentUser.id,
          title: 'Employment record verified',
          body: `${trainee.name}'s employment at ${user.companyName || 'an employer'} was confirmed.`,
        })),
      });
    }
    ok(res, { id: verification.id, traineeId: trainee.publicId, status: verification.status, role: verification.roleConfirmed, monthlyWage: verification.monthlyWage, joinedAt: verification.joinedAt, verifiedAt: verification.verifiedAt }, 201);
  } catch (err: any) {
    fail(res, 400, 'VERIFICATION_ERROR', err.message || 'Unable to verify employment');
  }
});

app.post('/api/outcomes/trainees/:publicId/employment-update-requests', auth, allow('INDUSTRY'), async (req: any, res) => {
  try {
    const input = z.object({
      role: z.string().min(2).max(160).optional(),
      monthlyWage: z.number().int().positive().optional(),
      joinedAt: z.coerce.date().optional(),
      note: z.string().max(1000).optional(),
    }).refine((data) => data.role || data.monthlyWage || data.joinedAt, 'At least one employment detail must be provided').parse(req.body);
    const [user, trainee, settings] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.auth.id } }),
      prisma.outcomeTrainee.findUnique({ where: { publicId: req.params.publicId } }),
      prisma.employerWorkspaceSetting.findUnique({ where: { userId: req.auth.id } }),
    ]);
    if (!user || !trainee) return fail(res, 404, 'NOT_FOUND', 'Employment record not found');
    if (trainee.employerName !== user.companyName) return fail(res, 403, 'FORBIDDEN', 'This employment record belongs to another employer');
    if (!trainee.consentActive || settings?.allowWageVerification === false) return fail(res, 403, 'PERMISSION_DENIED', 'Your workspace is not permitted to submit employment updates for this trainee');
    const request = await prisma.outcomeEmploymentVerification.create({
      data: {
        outcomeTraineeId: trainee.id,
        employerUserId: user.id,
        roleConfirmed: input.role,
        monthlyWage: input.monthlyWage,
        joinedAt: input.joinedAt,
        status: 'PENDING',
        note: input.note,
      },
    });
    await audit(user.id, 'EMPLOYMENT_UPDATE_REQUESTED', 'OutcomeEmploymentVerification', request.id, { traineeId: trainee.publicId });
    if (trainee.linkedUserId) {
      await prisma.notification.create({
        data: { userId: trainee.linkedUserId, title: 'Employer requested an employment update', body: `${user.companyName || 'Your employer'} requested a review of your work details. Your reported information will not change unless you choose to update it.` },
      });
    }
    ok(res, { id: request.id, traineeId: trainee.publicId, status: request.status, createdAt: request.createdAt }, 201);
  } catch (err: any) {
    fail(res, 400, 'EMPLOYMENT_UPDATE_REQUEST_ERROR', err.message || 'Unable to submit employment update');
  }
});

app.get('/api/outcomes/verifications', auth, allow('INDUSTRY', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.auth.id } });
    if (!user) return fail(res, 401, 'UNAUTHORIZED', 'Account not found');
    const items = await prisma.outcomeEmploymentVerification.findMany({
      where: user.role === 'INDUSTRY' ? { employerUserId: user.id } : {},
      include: { trainee: true, employer: { select: { name: true, companyName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    ok(res, items.map((item) => ({
      id: item.id,
      traineeId: item.trainee.publicId,
      traineeName: item.trainee.name,
      employer: item.employer.companyName,
      employerContact: item.employer.name,
      role: item.roleConfirmed,
      monthlyWage: item.monthlyWage,
      joinedAt: item.joinedAt,
      status: item.status,
      note: item.note,
      createdAt: item.createdAt,
      verifiedAt: item.verifiedAt,
    })));
  } catch (err: any) {
    fail(res, 500, 'VERIFICATION_HISTORY_ERROR', err.message || 'Unable to load verification history');
  }
});

app.get('/api/employer/settings', auth, allow('INDUSTRY'), async (req: any, res) => {
  try {
    const [user, settings] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.auth.id }, select: { name: true, email: true, companyName: true, designation: true, phone: true } }),
      prisma.employerWorkspaceSetting.upsert({ where: { userId: req.auth.id }, update: {}, create: { userId: req.auth.id } }),
    ]);
    if (!user) return fail(res, 404, 'NOT_FOUND', 'Employer account not found');
    ok(res, { ...user, preferences: { allowFollowUpRequests: settings.allowFollowUpRequests, allowWageVerification: settings.allowWageVerification, shareAggregateOutcomes: settings.shareAggregateOutcomes } });
  } catch (err: any) {
    fail(res, 500, 'EMPLOYER_SETTINGS_ERROR', err.message || 'Unable to load employer settings');
  }
});

app.patch('/api/employer/settings', auth, allow('INDUSTRY'), async (req: any, res) => {
  try {
    const input = z.object({
      name: z.string().min(2).optional(),
      companyName: z.string().min(2).optional(),
      designation: z.string().max(120).optional(),
      phone: z.string().max(40).optional(),
      allowFollowUpRequests: z.boolean().optional(),
      allowWageVerification: z.boolean().optional(),
      shareAggregateOutcomes: z.boolean().optional(),
    }).parse(req.body);
    const profileData = Object.fromEntries(['name', 'companyName', 'designation', 'phone'].filter((key) => input[key as keyof typeof input] !== undefined).map((key) => [key, input[key as keyof typeof input]]));
    const preferenceData = Object.fromEntries(['allowFollowUpRequests', 'allowWageVerification', 'shareAggregateOutcomes'].filter((key) => input[key as keyof typeof input] !== undefined).map((key) => [key, input[key as keyof typeof input]]));
    if (Object.keys(profileData).length) {
      const existingUser = await prisma.user.findUnique({ where: { id: req.auth.id }, select: { companyName: true } });
      await prisma.$transaction(async (tx) => {
        await tx.user.update({ where: { id: req.auth.id }, data: profileData });
        if (input.companyName && existingUser?.companyName && input.companyName !== existingUser.companyName) {
          await tx.outcomeTrainee.updateMany({ where: { employerName: existingUser.companyName }, data: { employerName: input.companyName } });
        }
      });
    }
    const preferences = Object.keys(preferenceData).length
      ? await prisma.employerWorkspaceSetting.upsert({ where: { userId: req.auth.id }, update: preferenceData, create: { userId: req.auth.id, ...preferenceData } })
      : await prisma.employerWorkspaceSetting.findUnique({ where: { userId: req.auth.id } });
    await audit(req.auth.id, 'EMPLOYER_SETTINGS_UPDATED', 'User', req.auth.id, { profileFields: Object.keys(profileData), preferenceFields: Object.keys(preferenceData) });
    ok(res, { saved: true, preferences });
  } catch (err: any) {
    fail(res, 400, 'EMPLOYER_SETTINGS_UPDATE_ERROR', err.message || 'Unable to save employer settings');
  }
});

app.patch('/api/outcomes/trainees/:publicId/employment', auth, allow('STUDENT', 'PLACEMENT_CELL'), async (req: any, res) => {
  try {
    const input = z.object({
      employmentStatus: z.enum(['Employed', 'Self-employed', 'Apprentice', 'Seeking work']),
      employerName: z.string().max(160).optional(),
      jobRole: z.string().max(160).optional(),
      monthlyWage: z.number().int().nonnegative().optional(),
      joinedAt: z.coerce.date().nullable().optional(),
    }).parse(req.body);
    const [user, trainee] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.auth.id } }),
      prisma.outcomeTrainee.findUnique({ where: { publicId: req.params.publicId } }),
    ]);
    if (!user || !trainee) return fail(res, 404, 'NOT_FOUND', 'Outcome profile not found');
    if (user.role === 'STUDENT' && trainee.linkedUserId !== user.id) return fail(res, 403, 'FORBIDDEN', 'You can only update your own outcome profile');
    const employmentChanged = input.employmentStatus !== trainee.employmentStatus ||
      (input.employerName !== undefined && input.employerName !== trainee.employerName) ||
      (input.jobRole !== undefined && input.jobRole !== trainee.jobRole) ||
      (input.monthlyWage !== undefined && input.monthlyWage !== trainee.monthlyWage);
    const updated = await prisma.$transaction(async (tx) => {
      const profile = await tx.outcomeTrainee.update({ where: { id: trainee.id }, data: input });
      if (employmentChanged && (input.monthlyWage ?? profile.monthlyWage ?? 0) >= 0) {
        await tx.outcomeEmploymentVerification.updateMany({
          where: { outcomeTraineeId: trainee.id, status: { in: ['VERIFIED', 'PENDING'] } },
          data: { status: 'SUPERSEDED' },
        });
        await tx.outcomeWageSnapshot.create({
          data: {
            outcomeTraineeId: trainee.id,
            monthlyWage: input.monthlyWage ?? profile.monthlyWage ?? 0,
            employerName: input.employerName ?? profile.employerName,
            jobRole: input.jobRole ?? profile.jobRole,
            employmentStatus: input.employmentStatus,
            source: user.role === 'STUDENT' ? 'TRAINEE_REPORTED' : 'PROGRAMME_REPORTED',
            visibleToEmployer: trainee.consentActive,
          },
        });
      }
      return tx.outcomeTrainee.findUniqueOrThrow({
        where: { id: trainee.id },
        include: {
          verifications: { orderBy: { createdAt: 'desc' }, take: 1 },
          followUps: { orderBy: { scheduledAt: 'desc' }, take: 1 },
          wageSnapshots: { where: user.role === 'STUDENT' ? {} : { visibleToEmployer: true }, orderBy: { effectiveAt: 'asc' } },
        },
      });
    });
    await audit(user.id, 'OUTCOME_EMPLOYMENT_UPDATED', 'OutcomeTrainee', trainee.id, { employmentStatus: input.employmentStatus });
    if (user.role === 'STUDENT' && trainee.consentActive && updated.employerName && employmentChanged) {
      const employerUsers = await prisma.user.findMany({ where: { role: 'INDUSTRY', companyName: updated.employerName }, select: { id: true } });
      await Promise.all(employerUsers.map((employerUser) => prisma.notification.create({
        data: {
          userId: employerUser.id,
          title: 'Trainee shared an employment update',
          body: `${trainee.name} shared a consented work-status update for ${updated.employerName}. Open the employer portal to review permitted details.`,
        },
      })));
    }
    if (user.role === 'STUDENT' && employmentChanged) {
      const governmentUsers = await prisma.user.findMany({ where: { role: 'PLACEMENT_CELL', isActive: true }, select: { id: true } });
      if (governmentUsers.length) await prisma.notification.createMany({
        data: governmentUsers.map((governmentUser) => ({
          userId: governmentUser.id,
          title: 'Trainee employment record updated',
          body: `${updated.name} updated their employment details${trainee.consentActive ? '.' : ' (employer sharing remains paused).'} `,
        })),
      });
    }
    ok(res, outcomeDto({ ...updated, verifications: [], followUps: [] }));
  } catch (err: any) {
    fail(res, 400, 'EMPLOYMENT_UPDATE_ERROR', err.message || 'Unable to update employment details');
  }
});

app.patch('/api/outcomes/trainees/:publicId/consent', auth, allow('STUDENT'), async (req: any, res) => {
  try {
    const { consentActive, preferredChannel } = z.object({
      consentActive: z.boolean(),
      preferredChannel: z.enum(['WhatsApp', 'Phone call', 'SMS', 'Assisted in-person']).optional(),
    }).parse(req.body);
    const trainee = await prisma.outcomeTrainee.findUnique({ where: { publicId: req.params.publicId } });
    if (!trainee || trainee.linkedUserId !== req.auth.id) return fail(res, 404, 'NOT_FOUND', 'Outcome profile not found');
    const updated = await prisma.outcomeTrainee.update({ where: { id: trainee.id }, data: { consentActive, preferredChannel } });
    await audit(req.auth.id, 'OUTCOME_CONSENT_UPDATED', 'OutcomeTrainee', trainee.id, { consentActive, preferredChannel });
    const employerUsers = await prisma.user.findMany({
      where: {
        role: 'INDUSTRY',
        isActive: true,
        ...(trainee.employerName ? { companyName: trainee.employerName } : consentActive ? {} : { id: '__no_matching_employer__' }),
      },
      select: { id: true },
    });
    const governmentUsers = await prisma.user.findMany({ where: { role: 'PLACEMENT_CELL', isActive: true }, select: { id: true } });
    const consentNotifications = [
      ...employerUsers.map((recipient) => ({
        userId: recipient.id,
        title: consentActive ? 'Trainee enabled employment sharing' : 'Trainee changed data-sharing consent',
        body: consentActive
          ? `${trainee.name} enabled employer sharing. Permitted profile details are available in your workspace.`
          : `${trainee.name} paused employer sharing. Individual outcome details are no longer available in your workspace.`,
      })),
      ...governmentUsers.map((recipient) => ({
        userId: recipient.id,
        title: 'Trainee data-sharing preference updated',
        body: `${trainee.name} ${consentActive ? 'enabled' : 'paused'} employer sharing.`,
      })),
    ];
    if (consentNotifications.length) await prisma.notification.createMany({ data: consentNotifications });
    ok(res, { id: updated.publicId, consentActive: updated.consentActive, preferredChannel: updated.preferredChannel });
  } catch (err: any) {
    fail(res, 400, 'CONSENT_UPDATE_ERROR', err.message || 'Unable to save consent preferences');
  }
});

app.get('/api/notifications', auth, async (req: any, res) => {
  try {
    const notifs = await prisma.notification.findMany({
      where: { userId: req.auth.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    ok(res, notifs);
  } catch (err: any) {
    fail(res, 500, 'SERVER_ERROR', err.message);
  }
});

app.patch('/api/notifications/:id/read', auth, async (req: any, res) => {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.auth.id },
      data: { isRead: true },
    });
    ok(res, { success: true });
  } catch (err: any) {
    fail(res, 400, 'UPDATE_ERROR', err.message);
  }
});

app.patch('/api/notifications/read-all', auth, async (req: any, res) => {
  try {
    const result = await prisma.notification.updateMany({
      where: { userId: req.auth.id, isRead: false },
      data: { isRead: true },
    });
    ok(res, { updated: result.count });
  } catch (err: any) {
    fail(res, 400, 'UPDATE_ERROR', err.message || 'Unable to mark notifications as read');
  }
});

app.get('/health', (_req, res) => ok(res, { status: 'healthy', timestamp: new Date().toISOString(), platform: 'Academia-Industry Portal API' }));
app.use(express.static(path.resolve(process.cwd(), 'dist'), { index: false }));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/') && req.accepts('html')) {
    return res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
  }
  next();
});
app.use((_req, res) => fail(res, 404, 'NOT_FOUND', 'Route not found'));

// Vercel imports the default-exported Express app as a serverless function.
// Keep the listener for local development and the standalone Render deployment.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Academia-Industry Collaboration Portal API server running on port ${PORT}`);
  });
}

export default app;

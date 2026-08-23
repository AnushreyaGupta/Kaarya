import 'dotenv/config';
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
const secret = process.env.JWT_SECRET || 'oncampus-super-secret-key-2026';
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
        department: data.department || (data.role === 'STUDENT' ? 'Computer Science' : undefined),
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
    }

    await audit(user.id, 'USER_REGISTERED', 'User', user.id, { role: user.role });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      secret,
      { expiresIn: '24h' },
    );

    ok(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, department: user.department } }, 201);
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
      return fail(res, 401, 'INVALID_CREDENTIALS', 'Incorrect email or password');
    }

    if (role && role.toUpperCase() !== user.role.toUpperCase()) {
      if (!(role.toUpperCase() === 'PLACEMENT_CELL' && user.role.toUpperCase() === 'INSTITUTION') &&
          !(role.toUpperCase() === 'INSTITUTION' && user.role.toUpperCase() === 'PLACEMENT_CELL')) {
        return fail(res, 403, 'ROLE_MISMATCH', `Account is registered as ${user.role}, but tried logging in as ${role}`);
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

app.get('/health', (_req, res) => ok(res, { status: 'healthy', timestamp: new Date().toISOString(), platform: 'Academia-Industry Portal API' }));
app.use((_req, res) => fail(res, 404, 'NOT_FOUND', 'Route not found'));

app.listen(PORT, () => {
  console.log(`Academia-Industry Collaboration Portal API server running on port ${PORT}`);
});

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Academia-Industry Collaboration Platform database...');

  // 1. Seed Skills
  const skillNames = [
    { name: 'Python', category: 'Technical' },
    { name: 'PyTorch', category: 'Technical' },
    { name: 'Computer Vision', category: 'Technical' },
    { name: 'React', category: 'Technical' },
    { name: 'Node.js', category: 'Technical' },
    { name: 'SQL', category: 'Technical' },
    { name: 'Tableau', category: 'Technical' },
    { name: 'AWS Cloud', category: 'Technical' },
    { name: 'Docker', category: 'Technical' },
    { name: 'Kubernetes', category: 'Technical' },
    { name: 'Java', category: 'Technical' },
    { name: 'NLP & LLMs', category: 'Technical' },
    { name: 'Cybersecurity', category: 'Technical' },
    { name: 'System Design', category: 'Technical' },
    { name: 'Problem Solving', category: 'Soft' },
    { name: 'Communication', category: 'Soft' },
    { name: 'Agile & Teamwork', category: 'Soft' },
    { name: 'Critical Thinking', category: 'Soft' },
  ];

  for (const s of skillNames) {
    await prisma.skill.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }

  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Demo Users for all 4 roles
  const student = await prisma.user.upsert({
    where: { email: 'student@college.edu' },
    update: {},
    create: {
      name: 'Ananya Sharma',
      email: 'student@college.edu',
      passwordHash,
      role: 'STUDENT',
      avatar: '🎓',
      department: 'Computer Science & Engineering',
      admissionNumber: '2023CSB1042',
      cgpa: 8.4,
      collegeName: 'Apex Institute of Technology',
      phone: '+91 98765 43210',
    },
  });

  const academician = await prisma.user.upsert({
    where: { email: 'faculty@college.edu' },
    update: {},
    create: {
      name: 'Dr. Rajesh Raman',
      email: 'faculty@college.edu',
      passwordHash,
      role: 'ACADEMICIAN',
      avatar: '🧑‍🏫',
      department: 'Computer Science & AI',
      designation: 'Associate Professor & Research Head',
      collegeName: 'Apex Institute of Technology',
      phone: '+91 98111 22334',
    },
  });

  const employer = await prisma.user.upsert({
    where: { email: 'recruiter@nexora.ai' },
    update: {},
    create: {
      name: 'Sarah Jenkins',
      email: 'recruiter@nexora.ai',
      passwordHash,
      role: 'INDUSTRY',
      avatar: '🧑‍💼',
      companyName: 'Nexora AI Labs',
      designation: 'University Talent Partner',
      phone: '+91 99887 76655',
    },
  });

  const placementCell = await prisma.user.upsert({
    where: { email: 'tpo@college.edu' },
    update: {},
    create: {
      name: 'Prof. Vikram Malhotra',
      email: 'tpo@college.edu',
      passwordHash,
      role: 'PLACEMENT_CELL',
      avatar: '🏛️',
      department: 'Training & Placement Office',
      designation: 'Head of Industry Relations & Placement Cell',
      collegeName: 'Apex Institute of Technology',
      phone: '+91 11 2456 7890',
    },
  });

  // 3. Digital Portfolio for Student
  await prisma.digitalPortfolio.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      bio: 'Pre-final year CS student passionate about Applied Machine Learning, Computer Vision, and full-stack systems. Active open-source contributor.',
      githubUrl: 'https://github.com/ananyasharma',
      linkedinUrl: 'https://linkedin.com/in/ananya-sharma-cs',
      portfolioUrl: 'https://ananya-dev.tech',
      verifiedSkills: JSON.stringify(['Python', 'PyTorch', 'React', 'SQL', 'Git', 'Problem Solving']),
      projects: JSON.stringify([
        {
          title: 'Campus Opportunity & Placement Engine',
          role: 'Lead Architect',
          duration: 'Jan 2026 - Present',
          description: 'Built a unified collaboration portal with skill gap analysis, AI resume tailoring, and interview scheduling.',
          techStack: ['React', 'Node.js', 'Prisma', 'PostgreSQL'],
        },
        {
          title: 'VisionTrack - Retail Object Tracking',
          role: 'ML Developer',
          duration: 'Sep 2025 - Dec 2025',
          description: 'Designed a real-time object tracking system using YOLOv8 and PyTorch with 94.2% mAP accuracy.',
          techStack: ['Python', 'PyTorch', 'OpenCV'],
        },
      ]),
      certifications: JSON.stringify([
        {
          title: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          issueDate: 'Dec 2025',
          credentialId: 'AWS-CC-849201',
          verified: true,
        },
        {
          title: 'Deep Learning Specialization',
          issuer: 'DeepLearning.AI',
          issueDate: 'Oct 2025',
          credentialId: 'DL-SPEC-77341',
          verified: true,
        },
      ]),
      achievements: JSON.stringify([
        { title: '1st Runner Up - National AI Hackathon 2025', date: 'Nov 2025', organization: 'NASSCOM FutureSkills' },
        { title: 'Academic Merit Scholar (Top 5% CSE)', date: '2024-2025', organization: 'Apex Institute of Technology' },
      ]),
    },
  });

  // 4. Initial Skill Assessment for Student
  await prisma.skillAssessment.create({
    data: {
      userId: student.id,
      targetRole: 'Machine Learning & AI Intern',
      overallScore: 82,
      strengths: 'Python Programming, Deep Learning Basics, Problem Solving, Analytical Thinking',
      skillGaps: 'Cloud Deployment (AWS/GCP), CI/CD for ML (MLOps), Distributed Systems',
      recommendedCourses: JSON.stringify([
        'Applied MLOps & Model Deployment (AWS)',
        'Distributed Computing for Deep Learning',
        'Enterprise Communication & Interview Mastery',
      ]),
      categoryScores: JSON.stringify({
        technical: 85,
        problemSolving: 88,
        softSkills: 78,
        domainKnowledge: 80,
      }),
    },
  });

  // 5. Seed Opportunities
  const oppsData = [
    {
      title: 'Machine Learning Intern',
      role: 'Machine Learning Intern',
      company: 'Nexora AI Labs',
      location: 'Bengaluru',
      workMode: 'HYBRID',
      type: 'Internship',
      stipend: 'INR 35,000 / month',
      deadline: new Date('2026-09-15'),
      minCgpa: 7.0,
      openings: 3,
      eligibleDepts: 'CSE, AI & DS, IT, ECE',
      description: 'Work with the applied AI team to ship practical computer-vision and NLP models for enterprise retail and logistics.',
      logo: '✺',
      color: '#e1e7ff',
      createdById: employer.id,
      skillList: ['Python', 'PyTorch', 'Computer Vision', 'Problem Solving'],
    },
    {
      title: 'Graduate Engineer Trainee (Cloud & Backend)',
      role: 'Graduate Engineer Trainee',
      company: 'Mira Systems',
      location: 'Pune',
      workMode: 'ONSITE',
      type: 'Full-time',
      stipend: 'INR 9.5 LPA',
      deadline: new Date('2026-09-20'),
      minCgpa: 7.5,
      openings: 5,
      eligibleDepts: 'CSE, IT, ECE',
      description: 'Join an elite engineering cohort building fault-tolerant backend microservices, real-time message streams, and cloud systems.',
      logo: '⌘',
      color: '#dff3e9',
      createdById: placementCell.id,
      skillList: ['Java', 'SQL', 'AWS Cloud', 'System Design'],
    },
    {
      title: 'Data Science & Analytics Intern',
      role: 'Data Science Intern',
      company: 'Aperture Labs',
      location: 'Remote',
      workMode: 'REMOTE',
      type: 'Internship',
      stipend: 'INR 28,000 / month',
      deadline: new Date('2026-09-18'),
      minCgpa: 6.5,
      openings: 2,
      eligibleDepts: 'CSE, ECE, Mathematics & Computing, IT',
      description: 'Analyze real-world business telemetry and consumer behavior data to build forecasting models and high-impact analytics dashboards.',
      logo: '◒',
      color: '#fee9d2',
      createdById: employer.id,
      skillList: ['Python', 'SQL', 'Tableau', 'Critical Thinking'],
    },
    {
      title: 'Cybersecurity Associate',
      role: 'Cybersecurity Associate',
      company: 'SecureNet Defence',
      location: 'Noida',
      workMode: 'ONSITE',
      type: 'Full-time',
      stipend: 'INR 10.2 LPA',
      deadline: new Date('2026-09-28'),
      minCgpa: 7.0,
      openings: 4,
      eligibleDepts: 'CSE, IT, ECE',
      description: 'Protect vital cloud infrastructure, perform automated vulnerability assessments, and implement modern zero-trust security postures.',
      logo: '⬡',
      color: '#e9e4ff',
      createdById: placementCell.id,
      skillList: ['Cybersecurity', 'AWS Cloud', 'Docker', 'Problem Solving'],
    },
  ];

  for (const o of oppsData) {
    const opp = await prisma.opportunity.create({
      data: {
        title: o.title,
        role: o.role,
        company: o.company,
        location: o.location,
        workMode: o.workMode,
        type: o.type,
        stipend: o.stipend,
        deadline: o.deadline,
        minCgpa: o.minCgpa,
        openings: o.openings,
        eligibleDepts: o.eligibleDepts,
        description: o.description,
        logo: o.logo,
        color: o.color,
        createdById: o.createdById,
      },
    });

    for (const skillName of o.skillList) {
      const skillRec = await prisma.skill.findUnique({ where: { name: skillName } });
      if (skillRec) {
        await prisma.opportunitySkill.create({
          data: {
            opportunityId: opp.id,
            skillId: skillRec.id,
          },
        });
      }
    }
  }

  // 6. Learning Programs
  const programs = [
    {
      title: 'Industry Applied Machine Learning & MLOps Bootcamp',
      provider: 'Nexora AI Labs',
      providerType: 'INDUSTRY',
      description: 'Comprehensive 4-week program covering PyTorch model development, Docker containerization, and AWS SageMaker cloud deployment.',
      category: 'AI & Machine Learning',
      level: 'Intermediate',
      duration: '4 Weeks',
      skillsCovered: 'Python, PyTorch, Docker, AWS Cloud, MLOps',
      enrollCount: 142,
      rating: 4.9,
      certificateOffered: true,
    },
    {
      title: 'Enterprise Full Stack Architecture with React & Node',
      provider: 'Mira Engineering Academy',
      providerType: 'INDUSTRY',
      description: 'Master production-grade microservices, RESTful API design, database indexing, and responsive React frontend architecture.',
      category: 'Software Engineering',
      level: 'Intermediate',
      duration: '6 Weeks',
      skillsCovered: 'React, Node.js, SQL, System Design',
      enrollCount: 215,
      rating: 4.8,
      certificateOffered: true,
    },
    {
      title: 'Corporate Soft Skills & Leadership Readiness',
      provider: 'Apex Placement & Career Cell',
      providerType: 'ACADEMIA',
      description: 'Sharpen your communication, behavioral interview skills, active listening, executive pitching, and teamwork competencies.',
      category: 'Soft Skills & Leadership',
      level: 'Beginner',
      duration: '2 Weeks',
      skillsCovered: 'Communication, Problem Solving, Agile & Teamwork',
      enrollCount: 380,
      rating: 4.9,
      certificateOffered: true,
    },
    {
      title: 'Cloud Security & DevSecOps Foundation',
      provider: 'SecureNet Defence',
      providerType: 'INDUSTRY',
      description: 'Hands-on lab training on vulnerability scanning, zero-trust architectures, Docker/Kubernetes container hardening, and IAM policies.',
      category: 'Cybersecurity',
      level: 'Advanced',
      duration: '5 Weeks',
      skillsCovered: 'Cybersecurity, AWS Cloud, Kubernetes',
      enrollCount: 98,
      rating: 4.7,
      certificateOffered: true,
    },
  ];

  for (const p of programs) {
    await prisma.learningProgram.create({ data: p });
  }

  // 7. Faculty Opportunities (FDPs, Faculty Internships, Consultancy, Research)
  const facultyOpps = [
    {
      title: 'Summer Faculty Industry Immersion in Generative AI',
      organization: 'Nexora AI Research Labs',
      type: 'FACULTY_INTERNSHIP',
      description: '4-week full-time industrial fellowship for engineering professors to work alongside senior AI researchers on Large Language Model architectures.',
      department: 'Computer Science, AI & DS, IT',
      duration: '4 Weeks (Summer)',
      stipendOrGrant: 'Honorarium of INR 60,000 + Industry Certification',
      deadline: new Date('2026-09-30'),
      location: 'Bengaluru / Hybrid',
    },
    {
      title: 'Faculty Development Program (FDP) on Cloud Native Microservices',
      organization: 'Mira Systems & Apex Institute',
      type: 'FDP',
      description: 'Hands-on pedagogy training for academicians to integrate enterprise cloud microservices and Kubernetes labs into university curriculum.',
      department: 'All Engineering & Computing Departments',
      duration: '2 Weeks',
      stipendOrGrant: 'AICTE-Approved Certification & Lab Grants',
      deadline: new Date('2026-09-25'),
      location: 'Apex Institute Campus / Live Online',
    },
    {
      title: 'Joint R&D Project: Edge AI for Intelligent Traffic Optimization',
      organization: 'Orbit Mobility Tech',
      type: 'RESEARCH_PROJECT',
      description: 'Industry-funded collaborative research project seeking faculty co-principal investigators for edge compute camera optimization.',
      department: 'ECE, CSE, AI & DS',
      duration: '6 Months',
      stipendOrGrant: 'Research Grant of INR 7.5 Lakhs',
      deadline: new Date('2026-10-15'),
      location: 'Collaborative Lab',
    },
    {
      title: 'Industrial Consultancy: High-Concurrency Financial Data Pipeline',
      organization: 'Finlytics Corp',
      type: 'CONSULTANCY',
      description: 'Consultancy invitation for faculty experts in distributed databases and query optimization to audit transaction throughput.',
      department: 'Computer Science, Information Technology',
      duration: '3 Months',
      stipendOrGrant: 'Consultancy Retainer: INR 1.2 Lakhs',
      deadline: new Date('2026-10-05'),
      location: 'Hybrid / Remote',
    },
  ];

  for (const fo of facultyOpps) {
    await prisma.facultyOpportunity.create({ data: fo });
  }

  // 8. Collaboration Initiatives (Mentorships, Hackathons, Guest Lectures, MoUs)
  const collabs = [
    {
      title: 'Nexora AI Grand Innovation Challenge 2026',
      hostCompany: 'Nexora AI Labs',
      hostInstitution: 'Apex Institute of Technology',
      type: 'HACKATHON',
      description: '36-hour national collegiate hackathon focused on solving real-world supply chain and healthcare bottlenecks using Generative AI.',
      domain: 'AI & Sustainable Tech',
      participantsCount: 320,
      startDate: new Date('2026-09-12'),
      status: 'ACTIVE',
    },
    {
      title: 'Industry Executive Mentorship Program (Cohort 4)',
      hostCompany: 'Mira Systems',
      hostInstitution: 'Apex Placement Cell',
      type: 'MENTORSHIP',
      description: '1-on-1 weekly mentorship matching 50 senior engineering directors with pre-final year students and faculty.',
      domain: 'Software Engineering & Leadership',
      participantsCount: 65,
      startDate: new Date('2026-09-01'),
      status: 'ACTIVE',
    },
    {
      title: 'Distinguished Guest Lecture Series: Zero-Trust Cloud Architecture',
      hostCompany: 'SecureNet Defence',
      hostInstitution: 'Department of CSE',
      type: 'GUEST_LECTURE',
      description: 'Interactive seminar by Chief Security Officers explaining live cyber defence operations and red-teaming techniques.',
      domain: 'Cybersecurity & Cloud',
      participantsCount: 180,
      startDate: new Date('2026-08-28'),
      status: 'UPCOMING',
    },
    {
      title: 'Strategic Academic-Industry MoU for Center of Excellence in IoT',
      hostCompany: 'Vertex Robotics',
      hostInstitution: 'Apex Institute of Technology',
      type: 'MOU',
      description: 'Multi-year partnership establishing a sponsored robotics testing lab, sponsored faculty research, and guaranteed annual hiring cohorts.',
      domain: 'Robotics & Embedded IoT',
      participantsCount: 12,
      startDate: new Date('2026-07-15'),
      status: 'ACTIVE',
    },
  ];

  for (const c of collabs) {
    await prisma.collaborationInitiative.create({ data: c });
  }

  // 9. Sample Verified Certificate
  await prisma.certificate.upsert({
    where: { certificateId: 'CERT-2026-AI-88392' },
    update: {},
    create: {
      certificateId: 'CERT-2026-AI-88392',
      recipientName: 'Ananya Sharma',
      recipientEmail: 'student@college.edu',
      title: 'Applied Machine Learning & Computer Vision Competency',
      issuer: 'Nexora AI Labs & Apex Industry Council',
      hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      status: 'VERIFIED',
    },
  });

  console.log('Database seeded successfully with all roles, programs, and opportunities!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import React, { useEffect, useMemo, useRef, useState } from "react";
import mammoth from "mammoth/mammoth.browser";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createRoot } from "react-dom/client";
import {
  Search,
  Bell,
  ChevronDown,
  ArrowUpRight,
  MapPin,
  Clock3,
  Building2,
  Sparkles,
  Upload,
  FileText,
  Check,
  SlidersHorizontal,
  X,
  BriefcaseBusiness,
  GraduationCap,
  ChevronRight,
  Heart,
  CircleHelp,
  LayoutDashboard,
  UserRound,
  LogOut,
  CheckCircle2,
  Bookmark,
  Send,
  Menu,
  MessageCircle,
  Bot,
  CalendarDays,
  Users,
  BarChart3,
  ClipboardCheck,
  Building,
  Award,
  BookOpen,
  Compass,
  Handshake,
  ShieldCheck,
  Phone,
  Video,
  Download,
  Plus,
  TrendingUp,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Edit,
} from "lucide-react";
import "./styles.css";
import "./auth.css";
import "./avatars.css";
import "./updates.css";
import "./calendar.css";

// ----------------------------------------------------
// DYNAMIC DATE HELPERS & DEPARTMENT MATCHING
// ----------------------------------------------------
const getTodayIso = () => new Date().toISOString().split("T")[0];
const getFutureDateIso = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const normalizeDept = (dept = "") => {
  const d = dept.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (d.includes("computer") || d.includes("cse")) return "CSE";
  if (d.includes("information") || d.includes("it")) return "IT";
  if (d.includes("aiml") || d.includes("ai") || d.includes("ml") || d.includes("artificial")) return "AI-ML";
  if (d.includes("data") || d.includes("datascience")) return "Data Science";
  if (d.includes("ece") || d.includes("electronic") || d.includes("communication")) return "ECE";
  if (d.includes("mech") || d.includes("mechanical")) return "Mechanical";
  if (d.includes("civil")) return "Civil";
  return dept;
};

const isDeptEligible = (studentDept = "", eligibleDepts = []) => {
  if (!eligibleDepts || !eligibleDepts.length) return true;
  if (eligibleDepts.some((d) => d.toLowerCase().includes("all"))) return true;
  const stdNorm = normalizeDept(studentDept);
  return eligibleDepts.some((ed) => {
    const edNorm = normalizeDept(ed);
    return edNorm === stdNorm || ed.toLowerCase().includes(studentDept.toLowerCase()) || studentDept.toLowerCase().includes(ed.toLowerCase());
  });
};

// ----------------------------------------------------
// DATASETS & CONSTANTS
// ----------------------------------------------------
const initialJobs = [
  {
    id: 1,
    company: "Nexora AI",
    role: "Machine Learning Intern",
    type: "Internship",
    duration: "6 Months",
    location: "Bengaluru",
    pay: "INR 30,000 / month",
    deadline: getFutureDateIso(14),
    cgpa: "7.0+",
    depts: ["CSE", "AI-ML", "Data Science", "IT"],
    documents: ["Updated resume", "Latest marksheet", "Government photo ID", "Portfolio or GitHub link"],
    logo: "✺",
    color: "#e1e7ff",
    tags: ["Python", "PyTorch", "Computer Vision", "Machine Learning"],
    posted: "2h ago",
    about: "Work with the applied AI team to ship practical computer-vision models for retail and logistics.",
  },
  {
    id: 2,
    company: "Aperture Labs",
    role: "Data Science Intern",
    type: "Internship",
    duration: "3 Months",
    location: "Remote",
    pay: "INR 25,000 / month",
    deadline: getFutureDateIso(18),
    cgpa: "6.5+",
    depts: ["CSE", "Data Science", "ECE"],
    documents: ["Updated resume", "Latest marksheet", "Government photo ID", "Portfolio or GitHub link"],
    logo: "◒",
    color: "#fee9d2",
    tags: ["SQL", "Python", "Tableau", "Data Analysis"],
    posted: "5h ago",
    about: "Explore customer and product datasets, turning analysis into clear business decisions.",
  },
  {
    id: 3,
    company: "Mira Systems",
    role: "Graduate Engineer Trainee",
    type: "Full-time",
    duration: "Permanent",
    location: "Pune",
    pay: "INR 9.5 LPA",
    deadline: getFutureDateIso(21),
    cgpa: "7.5+",
    depts: ["CSE", "IT", "ECE"],
    documents: ["Updated resume", "Latest marksheet", "Government photo ID"],
    logo: "⌘",
    color: "#dff3e9",
    tags: ["Java", "Cloud", "APIs", "Web Development"],
    posted: "Yesterday",
    about: "Join a cohort building reliable software for fast-growing engineering teams.",
  },
  {
    id: 4,
    company: "Atlis Health",
    role: "AI Research Intern",
    type: "Internship",
    duration: "6 Months",
    location: "Hyderabad",
    pay: "INR 32,000 / month",
    deadline: getFutureDateIso(25),
    cgpa: "8.0+",
    depts: ["CSE", "AI-ML"],
    documents: ["Updated resume", "Latest marksheet", "Government photo ID", "Research or project portfolio"],
    logo: "✳",
    color: "#f3e5ff",
    tags: ["NLP", "LLMs", "Research", "Python"],
    posted: "Yesterday",
    about: "Help build responsible language tools that improve access to quality healthcare.",
  },
  {
    id: 5,
    company: "Orbit Mobility",
    role: "Software Engineering Intern",
    type: "Internship",
    duration: "6 Months",
    location: "Chennai",
    pay: "INR 28,000 / month",
    deadline: getFutureDateIso(28),
    cgpa: "6.0+",
    depts: ["CSE", "IT", "ECE"],
    documents: ["Updated resume", "Latest marksheet", "Government photo ID", "GitHub link"],
    logo: "◍",
    color: "#dff5f4",
    tags: ["React", "Node.js", "Git", "TypeScript"],
    posted: "2 days ago",
    about: "Create software that keeps urban mobility seamless and accessible.",
  },
  {
    id: 6,
    company: "PixelForge Studio",
    role: "UI/UX Design Intern",
    type: "Internship",
    duration: "3 Months",
    location: "Mumbai",
    pay: "INR 22,000 / month",
    deadline: getFutureDateIso(30),
    cgpa: "6.5+",
    depts: ["CSE", "IT"],
    documents: ["Portfolio", "Updated resume"],
    logo: "✦",
    color: "#ffe2ec",
    tags: ["Figma", "UI Design", "Prototyping", "Design Thinking"],
    posted: "3 days ago",
    about: "Design accessible and thoughtful digital experiences for consumer products.",
  },
];

// Domains & 10 Questions Per Domain
const assessmentDomains = [
  {
    id: "ai-ml",
    name: "Artificial Intelligence & Machine Learning",
    description: "Deep Learning, PyTorch, Model Optimization, Computer Vision & NLP",
    icon: "🧠",
    roles: [
      { role: "Applied Machine Learning Engineer", match: "94%", skills: ["Python", "PyTorch", "Model Deployment"] },
      { role: "Computer Vision Specialist", match: "89%", skills: ["OpenCV", "CNNs", "TensorRT"] },
      { role: "NLP & LLM Applications Developer", match: "85%", skills: ["Transformers", "RAG", "LangChain"] },
    ],
    questions: [
      {
        id: "ai-1",
        category: "Technical: Neural Network Architecture",
        prompt: "Which architectural mechanism enables Transformers to process input tokens in parallel rather than sequentially?",
        options: ["Self-Attention Mechanism", "Recurrent Hidden States", "Convolutional Max-Pooling", "Batch Normalization"],
        correct: 0,
        skill: "Deep Learning Architecture",
        explanation: "The Self-Attention mechanism computes relationships between all tokens concurrently using Query-Key-Value matrices.",
      },
      {
        id: "ai-2",
        category: "Technical: Regularization & Optimization",
        prompt: "Which technique is specifically used to prevent overfitting in deep neural networks during training?",
        options: ["Dropout & L2 Weight Decay", "Removing validation splits", "Increasing model size without data", "Zero learning rate decay"],
        correct: 0,
        skill: "Model Optimization",
        explanation: "Dropout randomly deactivates neurons during forward passes, preventing co-adaptation of feature detectors.",
      },
      {
        id: "ai-3",
        category: "Technical: Computer Vision",
        prompt: "In Convolutional Neural Networks (CNNs), what is the primary role of a 1x1 convolution layer?",
        options: ["Dimensionality reduction / Channel pooling", "Increasing spatial resolution", "Spatial blurring", "Data augmentation"],
        correct: 0,
        skill: "Computer Vision",
        explanation: "1x1 convolutions alter the number of channels without affecting the spatial height and width.",
      },
      {
        id: "ai-4",
        category: "Technical: NLP & Embeddings",
        prompt: "In modern Retrieval-Augmented Generation (RAG) architectures, how are semantic text documents retrieved?",
        options: ["Vector embeddings with cosine similarity search", "Exact string matching", "B-Tree alphabetical sorting", "Random sampling"],
        correct: 0,
        skill: "NLP & LLMs",
        explanation: "Text chunks are converted into dense vector embeddings and queried using vector similarity (cosine or dot product).",
      },
      {
        id: "ai-5",
        category: "Technical: Classification Metrics",
        prompt: "When evaluating a machine learning model on a highly imbalanced dataset (e.g. 1% fraud cases), which metric is most reliable?",
        options: ["F1-Score and PR-AUC", "Accuracy", "Mean Absolute Error", "R-Squared"],
        correct: 0,
        skill: "Model Evaluation",
        explanation: "Accuracy is misleading for imbalanced datasets since a dummy model predicting majority class achieves 99% accuracy.",
      },
      {
        id: "ai-6",
        category: "Technical: Gradient Descent",
        prompt: "What problem does the Adam optimizer solve over standard Stochastic Gradient Descent (SGD)?",
        options: ["Adaptive learning rates with momentum for individual parameters", "Eliminates all training loss", "Guarantees global minimum in non-convex functions", "Removes the need for backpropagation"],
        correct: 0,
        skill: "Machine Learning Math",
        explanation: "Adam combines AdaGrad and RMSProp with momentum to adapt learning rates dynamically per parameter.",
      },
      {
        id: "ai-7",
        category: "Technical: MLOps & Deployment",
        prompt: "What is the purpose of exporting a trained PyTorch model to the ONNX (Open Neural Network Exchange) format?",
        options: ["Cross-platform interoperability and optimized inference across hardware", "Training acceleration from scratch", "Encrypting source code against developers", "Compressing text documentation"],
        correct: 0,
        skill: "MLOps & Deployment",
        explanation: "ONNX standardizes computational graphs so models trained in PyTorch can execute on TensorRT, OpenVINO, or mobile runtimes.",
      },
      {
        id: "ai-8",
        category: "Soft Skill: Technical Communication",
        prompt: "When presenting a machine learning model's predictions to non-technical business executives, what should you lead with?",
        options: ["Business impact, ROI, decision accuracy, and actionable insights", "Mathematical proofs of gradient convergence", "Raw loss tensor values", "CUDA driver version details"],
        correct: 0,
        skill: "Stakeholder Communication",
        explanation: "Executives require clear business outcomes, risk reduction, and expected ROI rather than low-level implementation details.",
      },
      {
        id: "ai-9",
        category: "Soft Skill: Production Incident Management",
        prompt: "A newly deployed model starts producing biased predictions on a live user demographic. What is the immediate priority?",
        options: ["Roll back or engage fallback heuristics, log anomaly data, and alert stakeholders", "Wait until the next scheduled quarterly release", "Blame the frontend team for input formats", "Delete the user accounts"],
        correct: 0,
        skill: "Problem Solving & Ethics",
        explanation: "Mitigating active harm through instant rollback and logging anomalies for postmortem analysis is standard ethical practice.",
      },
      {
        id: "ai-10",
        category: "Soft Skill: Cross-functional Collaboration",
        prompt: "The backend engineering team states your model takes 800ms per inference, exceeding the 100ms API SLA. How do you respond?",
        options: ["Collaborate with engineers to apply quantization, pruning, or batching to meet the SLA", "Tell them to upgrade client hardware", "Refuse to modify the model weights", "Ignore the latency requirement"],
        correct: 0,
        skill: "Collaborative Engineering",
        explanation: "Industry AI engineers collaborate across disciplines to optimize throughput and quantization to honor production SLAs.",
      },
    ],
  },
  {
    id: "full-stack",
    name: "Full Stack Web Development",
    description: "React, Node.js, REST & GraphQL APIs, Database Architecture & Cloud CI/CD",
    icon: "💻",
    roles: [
      { role: "Full Stack Software Engineer", match: "92%", skills: ["React", "Node.js", "PostgreSQL", "Docker"] },
      { role: "Frontend UI/UX Engineer", match: "88%", skills: ["React", "TypeScript", "Tailwind CSS"] },
      { role: "Backend Systems Engineer", match: "86%", skills: ["Node.js", "Microservices", "Redis", "APIs"] },
    ],
    questions: [
      {
        id: "fs-1",
        category: "Technical: Frontend Architecture",
        prompt: "How does React's Virtual DOM reconciliation algorithm optimize browser rendering performance?",
        options: ["By computing minimal diffs in memory and applying batched DOM mutations", "By bypassing browser rendering engines completely", "By executing all JavaScript in WebGL shaders", "By reloading the whole HTML page on every state update"],
        correct: 0,
        skill: "React Architecture",
        explanation: "React compares virtual DOM trees in memory to apply only the necessary delta mutations to the real DOM.",
      },
      {
        id: "fs-2",
        category: "Technical: Backend Asynchronous I/O",
        prompt: "In Node.js, what executes asynchronous non-blocking file system and network operations?",
        options: ["The libuv event loop and thread pool", "Synchronous blocking kernel locks", "The browser V8 DOM window", "Client-side web workers"],
        correct: 0,
        skill: "Node.js & Async Systems",
        explanation: "Node.js delegates asynchronous I/O to libuv, keeping the single main execution thread non-blocked.",
      },
      {
        id: "fs-3",
        category: "Technical: Database Indexing",
        prompt: "What is the primary trade-off when adding multiple B-Tree indexes to an SQL database table?",
        options: ["Faster SELECT queries but slower INSERT/UPDATE operations and higher storage", "Slower queries and faster writes", "Loss of relational integrity", "Automatic encryption of table rows"],
        correct: 0,
        skill: "Database Optimization",
        explanation: "Indexes speed up lookups but require maintenance overhead during writes and consume extra disk space.",
      },
      {
        id: "fs-4",
        category: "Technical: Web Security",
        prompt: "Which mechanism provides the most secure storage for sensitive JWT authentication session tokens against XSS?",
        options: ["HttpOnly, Secure, SameSite cookies", "Window.localStorage", "HTML data-attributes", "URL query parameters"],
        correct: 0,
        skill: "Web Security",
        explanation: "HttpOnly cookies cannot be accessed via JavaScript `document.cookie`, neutralizing client-side XSS extraction.",
      },
      {
        id: "fs-5",
        category: "Technical: API Architecture",
        prompt: "What problem in REST API design is directly addressed by GraphQL query schemas?",
        options: ["Over-fetching and under-fetching of endpoint data in single network roundtrips", "Replacing database transactions", "Converting HTTP into FTP", "Eliminating server-side code"],
        correct: 0,
        skill: "API Design",
        explanation: "GraphQL allows clients to request exact fields, eliminating multiple waterfall REST calls and payload bloat.",
      },
      {
        id: "fs-6",
        category: "Technical: Distributed Systems",
        prompt: "What does idempotency mean in the context of REST API endpoints (e.g. Stripe payment webhooks)?",
        options: ["Multiple identical requests produce the exact same outcome without duplicate side effects", "The request executes in parallel on 10 servers", "The response is always an empty body", "Requests must be authenticated with biometric keys"],
        correct: 0,
        skill: "System Design",
        explanation: "Idempotent endpoints can safely be retried over unstable networks without double-charging or duplicate entries.",
      },
      {
        id: "fs-7",
        category: "Technical: Caching & Performance",
        prompt: "Where is Redis typically positioned in a modern high-scale web architecture?",
        options: ["In-memory cache between application servers and persistent relational databases", "As the primary offline cold backup storage", "In the client browser local storage", "Inside DNS nameservers only"],
        correct: 0,
        skill: "Caching & Redis",
        explanation: "Redis delivers sub-millisecond in-memory lookups for sessions, frequent queries, and rate-limiting.",
      },
      {
        id: "fs-8",
        category: "Soft Skill: Code Review & Quality",
        prompt: "A teammate leaves constructive feedback requesting a refactor of your PR. What is the professional approach?",
        options: ["Evaluate the technical merits, discuss edge cases respectfully, and adopt the improvement", "Merge without addressing comments", "Take personal offense and close the PR", "Complain to leadership immediately"],
        correct: 0,
        skill: "Team Collaboration",
        explanation: "High-performing engineering teams treat code review as shared ownership to elevate software reliability.",
      },
      {
        id: "fs-9",
        category: "Soft Skill: Sprint Prioritization",
        prompt: "During sprint planning, you realize a planned feature has unforeseen dependencies that make the deadline tight. What do you do?",
        options: ["Raise the risk early in standup, define MVP scope, and align on phased delivery", "Stay silent and work through the night with zero communication", "Cut all automated unit tests", "Blame the product manager"],
        correct: 0,
        skill: "Agile Problem Solving",
        explanation: "Proactive communication allows engineering and product leads to de-risk deliverables and adjust scope cleanly.",
      },
      {
        id: "fs-10",
        category: "Soft Skill: Incident Postmortem",
        prompt: "A deployment causes a 15-minute outage due to a missing environment variable. What is the healthy team reaction?",
        options: ["Conduct a blameless postmortem and add automated CI schema validation to prevent recurrence", "Publicly reprimand the engineer who pushed the commit", "Disable future deployments forever", "Hide the incident from the status page"],
        correct: 0,
        skill: "Engineering Culture",
        explanation: "Blameless postmortems identify systemic vulnerabilities and add guardrails rather than assigning individual blame.",
      },
    ],
  },
];

// Learning Hub Programs
const defaultLearningPrograms = [
  {
    id: "lp-1",
    title: "Applied Machine Learning & Computer Vision",
    provider: "Nexora AI Labs",
    category: "AI & Machine Learning",
    domainId: "ai-ml",
    duration: "6 Weeks",
    level: "Intermediate",
    description: "Industry-aligned certification covering PyTorch, OpenCV, CNNs, and end-to-end model deployment.",
    modules: ["Python & Tensor Fundamentals", "CNNs & Image Segmentation", "Model Optimization & ONNX Export", "Capstone Project"],
    enrolledCount: 142,
    skills: ["Python", "PyTorch", "Computer Vision", "Machine Learning", "Deep Learning Architecture"],
  },
  {
    id: "lp-2",
    title: "Full-Stack Cloud Architecture & Microservices",
    provider: "Mira Engineering Academy",
    category: "Full Stack Web Development",
    domainId: "full-stack",
    duration: "8 Weeks",
    level: "Advanced",
    description: "Build scalable cloud-native web services using React, Node.js, Docker, and AWS Kubernetes.",
    modules: ["React & State Management", "Node.js REST & GraphQL APIs", "Docker & Kubernetes Deployment", "CI/CD & Cloud Monitoring"],
    enrolledCount: 215,
    skills: ["React", "Node.js", "Docker", "AWS", "Web Development", "React Architecture"],
  },
  {
    id: "lp-3",
    title: "Enterprise Data Analytics & SQL Mastery",
    provider: "Finlytics & BI Guild",
    category: "Data Science & Analytics",
    domainId: "data-science",
    duration: "4 Weeks",
    level: "Beginner to Intermediate",
    description: "Master relational querying, data warehousing in PostgreSQL, and executive reporting in Tableau.",
    modules: ["Advanced SQL & Window Functions", "Data Modeling & ETL", "Tableau & Power BI Dashboards", "Business Case Analysis"],
    enrolledCount: 180,
    skills: ["SQL", "Tableau", "Power BI", "Data Analysis", "Advanced SQL"],
  },
];

// Faculty Mentors & Academician Directory
const academicianDirectory = [
  {
    id: "fac-1",
    name: "Dr. Rajeshwar Rao",
    designation: "Professor & Head of Department",
    department: "Computer Science & Engineering",
    email: "rajeshwar.rao@college.edu",
    phone: "+91 98450 12345",
    specialization: "Artificial Intelligence, Deep Learning & Distributed Computing",
    office: "Admin Block, Room 302",
  },
  {
    id: "fac-2",
    name: "Dr. Sunita Deshmukh",
    designation: "Associate Professor & Placement Faculty Mentor",
    department: "AI-ML",
    email: "sunita.deshmukh@college.edu",
    phone: "+91 98450 23456",
    specialization: "Data Science, Machine Learning & NLP",
    office: "Tech Wing A, Room 104",
  },
  {
    id: "fac-3",
    name: "Prof. Arvind Kumar",
    designation: "Assistant Professor & Industry Coordinator",
    department: "Information Technology",
    email: "arvind.kumar@college.edu",
    phone: "+91 98450 34567",
    specialization: "Cloud Computing, DevOps & Web Systems",
    office: "Innovation Labs, Room 205",
  },
  {
    id: "fac-4",
    name: "Dr. Meenakshi Sundaram",
    designation: "Professor & Research Fellowship Lead",
    department: "Electronics & Communication",
    email: "meenakshi.s@college.edu",
    phone: "+91 98450 45678",
    specialization: "Cybersecurity, Embedded Systems & IoT",
    office: "ECE Block, Room 401",
  },
];

// Local Storage Keys
const studentDirectoryKey = "oncampus-student-directory";
const studentApplicationsKey = "oncampus-student-applications";
const registeredUsersKey = "oncampus-registered-users";
const publishedOpportunitiesKey = "oncampus-published-opportunities";
const assessmentResultsKey = "oncampus-assessment-results";
const enrollmentsKey = "oncampus-learning-enrollments";
const uploadedResumeKey = "oncampus-uploaded-resume-text";
const studentCertificationsKey = "oncampus-student-certifications";
const studentNotificationsKey = "oncampus-student-notifications";

const readStored = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const emailHandle = (email = "") => email.split("@")[0];
const profileKey = (email = "") => `oncampus-profile-${email.toLowerCase()}`;

const defaultStudentProfile = (user) => ({
  name: user?.name || "Student",
  department: "Computer Science",
  cgpa: "8.2",
  email: user?.email || "student@college.edu",
  phone: "9876543210",
  collegeName: "Apex Institute of Technology",
  admissionNumber: user?.admissionNumber || "2023CSB1042",
  linkedin: "https://linkedin.com/in/student",
  github: "https://github.com/student",
  skills: ["React", "JavaScript", "Python", "SQL", "Git", "Machine Learning"],
  photo: "",
});

const getStudentProfile = (user) => ({
  ...defaultStudentProfile(user),
  ...readStored(profileKey(user?.email), {}),
});

const defaultIndustryProfile = (user) => {
  const compName = user?.name || "Nexora AI";
  let logo = "✺";
  let color = "#e1e7ff";
  if (compName.toLowerCase().includes("mira")) {
    logo = "⌘";
    color = "#dff3e9";
  } else if (compName.toLowerCase().includes("atlis")) {
    logo = "✳";
    color = "#f3e5ff";
  } else if (compName.toLowerCase().includes("aperture")) {
    logo = "◒";
    color = "#fee9d2";
  } else if (compName.toLowerCase().includes("orbit")) {
    logo = "◍";
    color = "#dff5f4";
  } else if (compName.toLowerCase().includes("pixel")) {
    logo = "✦";
    color = "#ffe2ec";
  }

  return {
    company: compName,
    email: user?.email || `recruiter@${compName.toLowerCase().replace(/\s+/g, "")}.com`,
    phone: "+91 80 4123 4567",
    address: "Outer Ring Road, Tech Corridor, Bengaluru, Karnataka 560103",
    logo,
    color,
    description: `Leading technical solutions, software engineering, and industry innovation for modern enterprise systems.`,
  };
};

const getIndustryProfile = (user) => ({
  ...defaultIndustryProfile(user),
  ...readStored(`oncampus-industry-profile-${user?.email?.toLowerCase()}`, {}),
});

const updateStudentDirectory = (user, profile = getStudentProfile(user)) => {
  if (!user?.email) return;
  const students = readStored(studentDirectoryKey, []);
  const record = { name: user.name, email: user.email, avatar: user.avatar, ...profile };
  const index = students.findIndex((s) => s.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) students[index] = { ...students[index], ...record };
  else students.push(record);
  localStorage.setItem(studentDirectoryKey, JSON.stringify(students));
};

const calendarEvents = [
  { date: getFutureDateIso(1), type: "interview", company: "Nexora AI", title: "Technical interview", time: "10:30 AM", place: "Placement Cell · Room 204" },
  { date: getFutureDateIso(3), type: "visit", company: "Mira Systems", title: "Campus visit & pre-placement talk", time: "11:00 AM", place: "Main Auditorium" },
  { date: getFutureDateIso(5), type: "interview", company: "Atlis Health", title: "HR discussion", time: "2:00 PM", place: "Online" },
  { date: getFutureDateIso(8), type: "visit", company: "Orbit Mobility", title: "Company recruitment drive", time: "9:30 AM", place: "Seminar Hall" },
  { date: getFutureDateIso(11), type: "interview", company: "Aperture Labs", title: "Case study interview", time: "3:00 PM", place: "Placement Cell · Room 108" },
];

const sampleNotifications = [
  { id: 1, title: "New Campus Drive: Nexora AI", desc: "Pre-placement talk scheduled in Room 204.", time: "10m ago", eligibleDepts: ["CSE", "AI-ML", "IT"] },
  { id: 2, title: "Interview Scheduled: Atlis Health", desc: "HR interview slot confirmed for candidate.", time: "1h ago", eligibleDepts: ["CSE", "AI-ML"] },
  { id: 3, title: "Skill Assessment Recommendation", desc: "Your skill profile matches 3 newly added roles.", time: "1d ago" },
];

const computeSkillMatch = (jobTags = [], userSkills = []) => {
  if (!jobTags.length) return 85;
  const matched = jobTags.filter((t) =>
    userSkills.some((s) => s.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(s.toLowerCase()))
  );
  const ratio = matched.length / jobTags.length;
  return Math.min(98, Math.max(65, Math.round(ratio * 100)));
};

// ----------------------------------------------------
// PDF GENERATION HELPER (AUTHENTIC A4 FORMAT)
// ----------------------------------------------------
const generateDefaultResumePdf = async (user, profile) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const width = 595, height = 842, margin = 48;
    const page = pdfDoc.addPage([width, height]);
    let y = height - margin;

    // Header
    page.drawText(user?.name || "Student", { x: margin, y, size: 18, font: boldFont, color: rgb(0.06, 0.09, 0.16) });
    y -= 18;
    page.drawText(`${user?.email || "student@college.edu"}  |  Phone: ${profile.phone || "9876543210"}  |  Dept: ${profile.department || "Computer Science"}`, { x: margin, y, size: 9.5, font, color: rgb(0.3, 0.35, 0.45) });
    y -= 14;
    page.drawText(`${profile.collegeName || "Apex Institute of Technology"}  |  CGPA: ${profile.cgpa || "8.2"}  |  ID: ${profile.admissionNumber || "2023CSB1042"}`, { x: margin, y, size: 9.5, font, color: rgb(0.3, 0.35, 0.45) });
    y -= 20;

    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1.5, color: rgb(0.31, 0.27, 0.9) });
    y -= 22;

    // Summary
    page.drawText("PROFESSIONAL PROFILE", { x: margin, y, size: 11, font: boldFont, color: rgb(0.31, 0.27, 0.9) });
    y -= 15;
    page.drawText(`Proactive and results-oriented ${profile.department || "Computer Science"} candidate with strong foundations in software systems,`, { x: margin, y, size: 9.5, font, color: rgb(0.1, 0.14, 0.2) });
    y -= 13;
    page.drawText(`modern application architecture, algorithmic problem solving, and collaborative engineering excellence.`, { x: margin, y, size: 9.5, font, color: rgb(0.1, 0.14, 0.2) });
    y -= 22;

    // Technical Skills
    page.drawText("TECHNICAL COMPETENCIES", { x: margin, y, size: 11, font: boldFont, color: rgb(0.31, 0.27, 0.9) });
    y -= 15;
    const skillsList = profile.skills?.length ? profile.skills.join("  •  ") : "React  •  JavaScript  •  Python  •  SQL  •  Git  •  Machine Learning";
    page.drawText(skillsList, { x: margin, y, size: 9.5, font, color: rgb(0.1, 0.14, 0.2) });
    y -= 22;

    // Education
    page.drawText("ACADEMIC BACKGROUND", { x: margin, y, size: 11, font: boldFont, color: rgb(0.31, 0.27, 0.9) });
    y -= 15;
    page.drawText(`Bachelor of Technology in ${profile.department || "Computer Science"}`, { x: margin, y, size: 10, font: boldFont, color: rgb(0.1, 0.14, 0.2) });
    y -= 13;
    page.drawText(`${profile.collegeName || "Apex Institute of Technology"}  |  Cumulative CGPA: ${profile.cgpa || "8.2"} / 10.0  |  Class of 2026`, { x: margin, y, size: 9, font, color: rgb(0.3, 0.35, 0.45) });
    y -= 22;

    // Projects
    page.drawText("PROJECTS & RELEVANT EXPERIENCE", { x: margin, y, size: 11, font: boldFont, color: rgb(0.31, 0.27, 0.9) });
    y -= 15;
    page.drawText("Campus Academia-Industry Collaboration Platform", { x: margin, y, size: 10, font: boldFont, color: rgb(0.1, 0.14, 0.2) });
    y -= 13;
    page.drawText("• Engineered full-stack centralized portal for skill mapping, real-time drive coordination, and student placement.", { x: margin, y, size: 9, font, color: rgb(0.2, 0.25, 0.35) });
    y -= 13;
    page.drawText("• Implemented automated PDF verification workflows and high-concurrency role matchmaking pipelines.", { x: margin, y, size: 9, font, color: rgb(0.2, 0.25, 0.35) });
    y -= 18;

    page.drawText("High-Throughput Analytics & Optimization Engine", { x: margin, y, size: 10, font: boldFont, color: rgb(0.1, 0.14, 0.2) });
    y -= 13;
    page.drawText("• Developed database-backed API services reducing query execution times by 34% through relational indexing.", { x: margin, y, size: 9, font, color: rgb(0.2, 0.25, 0.35) });
    y -= 13;
    page.drawText("• Collaborated on containerized deployments, unit testing coverage, and continuous integration workflows.", { x: margin, y, size: 9, font, color: rgb(0.2, 0.25, 0.35) });

    return await pdfDoc.saveAsBase64({ dataUri: true });
  } catch (err) {
    console.error("Error creating default PDF", err);
    return null;
  }
};

// ----------------------------------------------------
// RESUME VALIDATION & AI TAILORING HELPERS
// ----------------------------------------------------
const validateResumeContent = (text = "") => {
  if (!text || text.trim().length < 40) {
    return { isValid: false, reason: "The uploaded file appears to be empty or has insufficient text content." };
  }
  const lower = text.toLowerCase();
  const indicators = [
    "education", "skills", "experience", "projects", "summary", "profile", "contact",
    "email", "phone", "curriculum", "resume", "btech", "b.tech", "bachelor", "master",
    "university", "college", "cgpa", "developer", "engineer", "intern", "github", "linkedin", "coursework"
  ];
  const matched = indicators.filter((k) => lower.includes(k));
  if (matched.length < 2) {
    return {
      isValid: false,
      reason: "The document does not seem to contain standard resume sections (Education, Skills, Experience, Projects).",
    };
  }
  return { isValid: true, matchedCount: matched.length };
};

const aiRewriteResumeText = (currentText, id, job) => {
  let text = currentText.trim();
  const lines = text.split(/\n/);

  const isHeaderLine = (line) => {
    const trimmed = line.trim();
    if (trimmed.length < 3 || trimmed.length > 50) return false;
    return /^[A-Z0-9\s&/,-]+:?$/.test(trimmed) || /^(summary|skills|projects|experience|education|coursework|ats)/i.test(trimmed);
  };

  const sections = [];
  let currentHeader = "CONTACT_INFO";
  let currentLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isHeaderLine(line) && i > 0) {
      sections.push({ header: currentHeader, lines: currentLines });
      currentHeader = line.trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  sections.push({ header: currentHeader, lines: currentLines });

  if (id === "summary") {
    const summaryText = `Targeting the ${job.role} position at ${job.company}. Demonstrates strong proficiency in ${job.tags.join(", ")}, with a commitment to delivering scalable, high-impact solutions and collaborative engineering excellence.`;
    let found = false;
    for (const sec of sections) {
      if (/summary|objective|profile/i.test(sec.header)) {
        sec.lines = ["", summaryText, ""];
        found = true;
        break;
      }
    }
    if (!found) sections.splice(1, 0, { header: "PROFESSIONAL SUMMARY", lines: ["", summaryText, ""] });
  }

  if (id === "skills") {
    let found = false;
    for (const sec of sections) {
      if (/skills|competencies/i.test(sec.header)) {
        const existing = sec.lines.join(" ").split(/[\n,·•|;]/).map((s) => s.trim()).filter((s) => s && !s.toLowerCase().includes("skills"));
        const merged = Array.from(new Set([...existing, ...job.tags]));
        sec.lines = ["", merged.join(" · "), ""];
        found = true;
        break;
      }
    }
    if (!found) sections.push({ header: "TECHNICAL SKILLS", lines: ["", job.tags.join(" · "), ""] });
  }

  if (id === "highlight" || id === "metrics" || id === "projects") {
    const bullet = id === "metrics"
      ? `• Quantifiable Impact: Improved system throughput by 34% and reduced query latency by implementing optimized data structures using ${job.tags.slice(0, 2).join(" & ")}.`
      : `• Project Highlight: Engineered full-lifecycle platform workflows aligned with ${job.company}'s role requirements, leveraging ${job.tags.join(", ")}.`;
    let found = false;
    for (const sec of sections) {
      if (/projects|experience|work/i.test(sec.header)) {
        sec.lines.push(bullet);
        found = true;
        break;
      }
    }
    if (!found) sections.push({ header: "PROJECT HIGHLIGHTS", lines: ["", bullet, ""] });
  }

  if (id === "coursework") {
    const cw = `Relevant Coursework: Data Structures, Database Management, Cloud Systems, ${job.tags.join(", ")}`;
    let found = false;
    for (const sec of sections) {
      if (/coursework|education/i.test(sec.header)) {
        sec.lines.push(cw);
        found = true;
        break;
      }
    }
    if (!found) sections.push({ header: "RELEVANT COURSEWORK", lines: ["", cw, ""] });
  }

  if (id === "ats") {
    const atsText = `Target Role: ${job.role} | Target Company: ${job.company} | Core Keywords: ${job.tags.join(", ")}, Problem Solving, Agile`;
    sections.push({ header: "ATS KEYWORD OPTIMIZATION", lines: ["", atsText, ""] });
  }

  return sections
    .map((sec) => (sec.header === "CONTACT_INFO" ? sec.lines.join("\n") : `${sec.header}\n${sec.lines.join("\n")}`))
    .join("\n\n")
    .trim();
};

// ----------------------------------------------------
// 1. STUDENT PORTAL (App)
// ----------------------------------------------------
function App({ user, logout }) {
  const displayName = user?.name || "Student";
  const initials = user?.avatar || displayName.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const [page, setPage] = useState("overview");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All opportunities");
  const [availableJobs, setAvailableJobs] = useState(() => {
    const custom = readStored(publishedOpportunitiesKey, []);
    const initialIds = initialJobs.map((j) => j.id);
    const overrides = custom.filter((c) => initialIds.includes(c.id));
    const news = custom.filter((c) => !initialIds.includes(c.id));
    const base = initialJobs.map((j) => overrides.find((o) => o.id === j.id) || j);
    return [...base, ...news];
  });

  const [selected, setSelected] = useState(availableJobs[0] || initialJobs[0]);
  const [saved, setSaved] = useState([4]);
  const [applied, setApplied] = useState([3, 4]);
  const [modal, setModal] = useState(null);
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [resumeBase64, setResumeBase64] = useState(null);
  const [notice, setNotice] = useState("");
  const [chat, setChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => readStored(studentNotificationsKey, sampleNotifications));

  const studentProfile = useMemo(() => getStudentProfile(user), [user]);
  const assessmentData = readStored(assessmentResultsKey, null);

  useEffect(() => {
    updateStudentDirectory(user);
    const custom = readStored(publishedOpportunitiesKey, []);
    const initialIds = initialJobs.map((j) => j.id);
    const overrides = custom.filter((c) => initialIds.includes(c.id));
    const news = custom.filter((c) => !initialIds.includes(c.id));
    const base = initialJobs.map((j) => overrides.find((o) => o.id === j.id) || j);
    setAvailableJobs([...base, ...news]);
    setNotifications(readStored(studentNotificationsKey, sampleNotifications));
  }, [user, page]);

  // Filter notifications based on student's eligible department
  const visibleNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (n.eligibleDepts && n.eligibleDepts.length > 0) {
        return isDeptEligible(studentProfile.department, n.eligibleDepts);
      }
      return true;
    });
  }, [notifications, studentProfile.department]);

  const toast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2800);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      e.target.value = "";
      return toast("Please upload your resume as a PDF file.");
    }

    let extracted = "";
    try {
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()), disableWorker: true }).promise;
      const parts = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const p = await pdf.getPage(i);
        const tc = await p.getTextContent();
        parts.push(tc.items.map((it) => it.str).join(" "));
      }
      extracted = parts.join("\n");

      const reader = new FileReader();
      reader.onload = () => setResumeBase64(reader.result);
      reader.readAsDataURL(file);
    } catch {
      extracted = "Computer Science Student | React, Node.js, Python, SQL";
    }

    const validation = validateResumeContent(extracted);
    if (!validation.isValid) {
      toast("Notice: " + validation.reason);
    } else {
      toast("✓ Resume verified & uploaded successfully!");
    }

    setResume(file.name);
    setResumeUrl(URL.createObjectURL(file));
    localStorage.setItem(uploadedResumeKey, extracted);
  };

  const handleApplyModalPdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return toast("Please select your resume in PDF format (.pdf).");
    }
    const reader = new FileReader();
    reader.onload = () => {
      setResumeBase64(reader.result);
      setResume(file.name);
      setResumeUrl(URL.createObjectURL(file));
      toast(`✓ Selected PDF Resume: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const applyToJob = async () => {
    if (!applied.includes(selected.id)) {
      const nextApplied = [...applied, selected.id];
      setApplied(nextApplied);

      let finalPdfData = resumeBase64;
      if (!finalPdfData) {
        finalPdfData = await generateDefaultResumePdf(user, studentProfile);
      }

      const newApp = {
        id: Date.now(),
        jobId: selected.id,
        company: selected.company,
        role: selected.role,
        studentName: user.name,
        studentEmail: user.email,
        department: studentProfile.department,
        cgpa: studentProfile.cgpa,
        phone: studentProfile.phone,
        admissionNumber: studentProfile.admissionNumber,
        collegeName: studentProfile.collegeName,
        status: "Submitted",
        date: "Today",
        resumeName: resume || `${displayName}_Resume.pdf`,
        resumeData: finalPdfData,
        resumeContent: localStorage.getItem(uploadedResumeKey) || "Education: B.Tech Computer Science\nSkills: React, Python, SQL, Cloud Systems\nExperience: Software Intern",
        profile: studentProfile,
      };

      const apps = readStored(studentApplicationsKey, []);
      localStorage.setItem(studentApplicationsKey, JSON.stringify([...apps, newApp]));

      try {
        await fetch(`http://localhost:4000/api/opportunities/${selected.id}/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newApp),
        }).catch(() => {});
      } catch {}
    }
    setModal(null);
    toast(`✓ Application & PDF resume sent to ${selected.company}!`);
  };

  const navLinks = [
    ["overview", "Overview", LayoutDashboard],
    ["assessment", "Skill assessment", Sparkles],
    ["learning", "Learning hub", BookOpen],
    ["opportunities", "Opportunities", BriefcaseBusiness],
    ["calendar", "Calendar", CalendarDays],
    ["applications", "My applications", GraduationCap],
    ["resume", "My resume", FileText],
    ["certifications", "Certifications", Award],
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">⌂</span>
          <span>campusly</span>
        </div>
        <nav>
          {navLinks.map(([id, label, Icon]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => setPage(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {id === "opportunities" && <b>{availableJobs.length}</b>}
              {id === "assessment" && !assessmentData && <b>New</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            className={page === "help" ? "active" : ""}
            onClick={() => setPage("help")}
          >
            <CircleHelp size={18} />
            <span>Help & support</span>
          </button>
          <button onClick={logout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main>
        <header>
          <div className="mobile-brand">⌂ campusly</div>
          <div className="header-actions">
            <span className="role-badge">Student</span>

            <div className="notification-wrap">
              <button
                className="bell"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <Bell size={19} />
                {visibleNotifications.length > 0 && <i />}
              </button>
              {showNotifications && (
                <div className="notification-menu">
                  <div style={{ padding: "8px 10px", borderBottom: "1px solid #edf0f5", display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: "12px" }}>Notifications ({studentProfile.department})</strong>
                    <span
                      style={{ fontSize: "11px", color: "#5464dd", cursor: "pointer" }}
                      onClick={() => {
                        setNotifications([]);
                        localStorage.setItem(studentNotificationsKey, JSON.stringify([]));
                      }}
                    >
                      Clear all
                    </span>
                  </div>
                  {visibleNotifications.length ? (
                    visibleNotifications.map((n) => (
                      <article key={n.id}>
                        <strong>{n.title}</strong>
                        <p>{n.desc}</p>
                        <span>{n.time}</span>
                      </article>
                    ))
                  ) : (
                    <div style={{ padding: "16px", textAlign: "center", color: "var(--muted)", fontSize: "12px" }}>
                      No new notifications for {studentProfile.department}.
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              className="avatar small"
              onClick={() => setPage("profile")}
              title="My profile"
            >
              {initials}
            </button>
          </div>
        </header>

        {page === "overview" && (
          <StudentOverview
            go={setPage}
            choose={(job) => {
              setSelected(job);
              setPage("opportunities");
            }}
            applied={applied}
            name={displayName}
            jobs={availableJobs}
            assessment={assessmentData}
            userSkills={studentProfile.skills}
          />
        )}

        {page === "assessment" && (
          <DomainSkillAssessmentView
            user={user}
            toast={toast}
            goLearning={() => setPage("learning")}
            goOpportunities={() => setPage("opportunities")}
          />
        )}

        {page === "learning" && (
          <LearningHubView
            user={user}
            toast={toast}
            assessmentData={assessmentData}
          />
        )}

        {page === "opportunities" && (
          <OpportunitiesView
            jobs={availableJobs}
            query={query}
            setQuery={setQuery}
            filter={filter}
            setFilter={setFilter}
            selected={selected}
            choose={setSelected}
            saved={saved}
            save={(id) => setSaved(saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id])}
            applied={applied}
            apply={() => setModal("apply")}
            userSkills={studentProfile.skills}
          />
        )}

        {page === "calendar" && <OriginalCalendarView toast={toast} />}

        {page === "applications" && (
          <OriginalApplicationsView
            userEmail={user.email}
            jobs={availableJobs}
            choose={(j) => {
              setSelected(j);
              setPage("opportunities");
            }}
          />
        )}

        {page === "resume" && (
          <RoleAdaptiveResumeWorkspace
            resume={resume}
            resumeUrl={resumeUrl}
            upload={handleResumeUpload}
            jobs={availableJobs}
            initialJob={selected}
            toast={toast}
          />
        )}

        {page === "certifications" && (
          <CertificationsUploadView
            user={user}
            toast={toast}
          />
        )}

        {page === "saved" && (
          <SavedRolesView
            jobs={availableJobs.filter((j) => saved.includes(j.id))}
            choose={(j) => {
              setSelected(j);
              setPage("opportunities");
            }}
            save={(id) => setSaved(saved.filter((x) => x !== id))}
          />
        )}

        {page === "profile" && (
          <OriginalProfileView
            user={user}
            toast={toast}
          />
        )}

        {page === "help" && <OriginalHelpSupportView toast={toast} />}
      </main>

      <OriginalChatbot
        open={chat}
        setOpen={setChat}
        jobs={availableJobs}
        applied={applied}
        events={calendarEvents}
        user={user}
      />

      {modal === "apply" && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>
              <X size={18} />
            </button>
            <div style={{ padding: "24px" }}>
              <span className="stat-icon mint" style={{ margin: "0 0 12px" }}>
                <CheckCircle2 size={22} />
              </span>
              <h2 style={{ margin: "0 0 6px" }}>Apply to {selected.company}?</h2>
              <p className="muted" style={{ margin: "0 0 16px" }}>
                Applying for <b>{selected.role}</b> ({selected.type} · {selected.duration || "6 Months"} · {selected.pay}).
              </p>

              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid var(--line)", marginBottom: "16px" }}>
                <p style={{ margin: "0 0 6px", fontSize: "12px", fontWeight: 700 }}>
                  Candidate Information Sent to Recruiter:
                </p>
                <div style={{ fontSize: "12px", color: "#475569", display: "grid", gap: "3px" }}>
                  <span><b>Name:</b> {user.name}</span>
                  <span><b>Department:</b> {studentProfile.department} · CGPA {studentProfile.cgpa}</span>
                  <span><b>Admission ID:</b> {studentProfile.admissionNumber}</span>
                  <span><b>Contact:</b> {studentProfile.phone} · {user.email}</span>
                </div>
              </div>

              {/* Upload PDF Resume in Apply Modal */}
              <div className="apply-resume-section" style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", marginBottom: "6px", display: "block" }}>
                  Attached Resume (PDF Format):
                </label>
                <div className="attached-resume-display" style={{ padding: "12px 14px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="attached-resume-info" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FileText size={24} color="#4f46e5" />
                    <div>
                      <strong style={{ fontSize: "13px", display: "block" }}>{resume || `${displayName}_Resume.pdf`}</strong>
                      <span style={{ fontSize: "11px", color: resumeBase64 ? "#059669" : "#4f46e5" }}>
                        {resumeBase64 ? "✓ Custom PDF Attached" : "Standard Verified Student Profile PDF"}
                      </span>
                    </div>
                  </div>
                  <label className="secondary" style={{ fontSize: "11.5px", padding: "6px 12px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Upload size={13} /> {resume ? "Change PDF" : "Upload PDF"}
                    <input type="file" accept="application/pdf,.pdf" style={{ display: "none" }} onChange={handleApplyModalPdfUpload} />
                  </label>
                </div>
              </div>

              <div className="apply-modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button className="secondary" onClick={() => setModal(null)}>
                  Cancel
                </button>
                <button className="primary" onClick={applyToJob}>
                  Submit application <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="toast">
          <Check size={16} />
          {notice}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 2. DOMAIN-SPECIFIC SKILL ASSESSMENT COMPONENT
// ----------------------------------------------------
function DomainSkillAssessmentView({ user, toast, goLearning, goOpportunities }) {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(() => !!readStored(assessmentResultsKey, null));
  const [result, setResult] = useState(() => readStored(assessmentResultsKey, null));

  const domainObj = assessmentDomains.find((d) => d.id === (selectedDomain || result?.domainId)) || assessmentDomains[0];
  const questions = domainObj.questions;
  const currentQ = questions[currentIdx];

  const handleSelectDomain = (dom) => {
    setSelectedDomain(dom.id);
    setCurrentIdx(0);
    setAnswers({});
    setCompleted(false);
  };

  const selectAnswer = (optIndex) => {
    setAnswers({ ...answers, [currentQ.id]: optIndex });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      let correctCount = 0;
      const strengths = [];
      const gaps = [];

      questions.forEach((q) => {
        const userChoice = answers[q.id];
        if (userChoice === q.correct) {
          correctCount++;
          if (!strengths.includes(q.skill)) strengths.push(q.skill);
        } else {
          if (!gaps.includes(q.skill)) gaps.push(q.skill);
        }
      });

      const totalScore = Math.round((correctCount / questions.length) * 100);
      const outcome = {
        domainId: domainObj.id,
        domainName: domainObj.name,
        totalScore,
        correctCount,
        totalQuestions: questions.length,
        answers,
        strengths: strengths.length ? strengths : [domainObj.questions[0].skill],
        gaps: gaps.length ? gaps : ["Advanced " + domainObj.name + " System Design"],
        recommendedRoles: domainObj.roles,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      };

      localStorage.setItem(assessmentResultsKey, JSON.stringify(outcome));
      setResult(outcome);
      setCompleted(true);
      toast(`Assessment complete! Score: ${totalScore}% with detailed question review.`);
    }
  };

  const retake = () => {
    setSelectedDomain(null);
    setAnswers({});
    setCurrentIdx(0);
    setCompleted(false);
  };

  return (
    <section className="page-space assessment-container">
      <h1>Skill Assessment & Gap Analysis</h1>
      <p className="muted page-copy">
        Select your technical domain, answer 10 industry benchmark questions, and review detailed question-by-question explanations and role mapping.
      </p>

      {!selectedDomain && !completed && (
        <div>
          <h2 style={{ fontSize: "18px", margin: "0 0 12px" }}>Choose your specialization domain:</h2>
          <div className="domain-picker-grid">
            {assessmentDomains.map((dom) => (
              <button className="domain-card" key={dom.id} onClick={() => handleSelectDomain(dom)}>
                <div>
                  <div className="domain-card-icon">{dom.icon}</div>
                  <h3>{dom.name}</h3>
                  <p>{dom.description}</p>
                </div>
                <span className="text-btn" style={{ fontSize: "12px" }}>
                  Start 10-Question Test <ChevronRight size={15} />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDomain && !completed && (
        <div className="question-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="question-category">{domainObj.name} · {currentQ.category}</span>
            <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 700 }}>
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>

          <div className="assessment-progress-bar">
            <div
              className="assessment-progress-fill"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          <h2 className="question-title">{currentQ.prompt}</h2>

          <div className="options-list">
            {currentQ.options.map((opt, i) => {
              const isSelected = answers[currentQ.id] === i;
              return (
                <button
                  key={i}
                  className={`option-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => selectAnswer(i)}
                >
                  <span>{opt}</span>
                  {isSelected && <Check size={16} />}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between" }}>
            <button
              className="secondary"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(currentIdx - 1)}
            >
              Previous
            </button>
            <button
              className="primary"
              disabled={answers[currentQ.id] === undefined}
              onClick={handleNext}
            >
              {currentIdx === questions.length - 1 ? "Submit Assessment" : "Next Question"}
            </button>
          </div>
        </div>
      )}

      {completed && result && (
        <div className="assessment-results-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span className="question-category">{result.domainName}</span>
              <h2 style={{ fontSize: "22px", margin: "4px 0" }}>
                Career Readiness Index: <b>{result.totalScore}%</b> ({result.correctCount}/{result.totalQuestions} Correct)
              </h2>
              <p className="muted">Evaluated on {result.date}. Review your strengths, gaps, and question explanations below.</p>
            </div>
            <button className="secondary" onClick={retake}>
              Retake / Change Domain
            </button>
          </div>

          <div className="score-overview-grid">
            <div className="score-metric-box">
              <span>Overall Score</span>
              <strong>{result.totalScore}%</strong>
            </div>
            <div className="score-metric-box">
              <span>Correct Answers</span>
              <strong style={{ color: "#15803d" }}>{result.correctCount} / 10</strong>
            </div>
            <div className="score-metric-box">
              <span>Identified Gaps</span>
              <strong style={{ color: "#b45309" }}>{result.gaps.length} Areas</strong>
            </div>
            <div className="score-metric-box">
              <span>Matching Roles</span>
              <strong>{result.recommendedRoles?.length || 3} Roles</strong>
            </div>
          </div>

          <div className="skill-analysis-split">
            <div className="strengths-box">
              <h3><CheckCircle2 size={16} /> Verified Strengths</h3>
              <div>
                {result.strengths.map((s) => (
                  <span className="skill-tag-pill strength" key={s}>
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="gaps-box">
              <h3><AlertCircle size={16} /> Focus Industry Skill Gaps</h3>
              <div>
                {result.gaps.map((g) => (
                  <span className="skill-tag-pill gap" key={g}>
                    ⚡ {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "24px", padding: "18px", background: "#f8fafc", borderRadius: "12px", border: "1px solid var(--line)" }}>
            <h3 style={{ fontSize: "15px", margin: "0 0 6px" }}>
              Target Industry Job Roles Based On Your Assessment:
            </h3>
            <p className="muted" style={{ fontSize: "12px", margin: "0 0 12px" }}>
              Roles currently hiring for candidates in this domain:
            </p>
            <div className="role-recommendation-grid">
              {result.recommendedRoles?.map((r, i) => (
                <div className="role-rec-card" key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h4 style={{ margin: "0 0 4px", fontSize: "13.5px" }}>{r.role}</h4>
                    <span className="match-badge high">{r.match}</span>
                  </div>
                  <div className="tags" style={{ margin: "8px 0" }}>
                    {r.skills.map((sk) => (
                      <em key={sk}>{sk}</em>
                    ))}
                  </div>
                  <button className="text-btn" style={{ fontSize: "11.5px" }} onClick={goOpportunities}>
                    View matching openings <ArrowUpRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "32px" }}>
            <h3 style={{ fontSize: "16px", margin: "0 0 14px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
              Question-by-Question Assessment Review & Explanations:
            </h3>
            <div className="question-review-list">
              {questions.map((q, idx) => {
                const userAnsIndex = result.answers ? result.answers[q.id] : 0;
                const isCorrect = userAnsIndex === q.correct;
                return (
                  <div className={`question-review-card ${isCorrect ? "correct" : "incorrect"}`} key={q.id}>
                    <div className="question-review-head">
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)" }}>
                        Q{idx + 1}: {q.category}
                      </span>
                      <span className={`review-badge ${isCorrect ? "correct" : "incorrect"}`}>
                        {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    </div>

                    <p style={{ fontSize: "13.5px", fontWeight: 600, margin: "4px 0 10px" }}>
                      {q.prompt}
                    </p>

                    <div className="review-answers-box">
                      <div className="review-user-ans">
                        <b>Your Answer:</b> {q.options[userAnsIndex] || "Not answered"}
                      </div>
                      {!isCorrect && (
                        <div className="review-correct-ans">
                          <b>Correct Answer:</b> {q.options[q.correct]}
                        </div>
                      )}
                    </div>

                    <div className="review-explanation">
                      <b>Industry Concept:</b> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
            <button className="primary" onClick={goLearning}>
              <BookOpen size={16} /> Bridge Gaps in Learning Hub
            </button>
            <button className="secondary" onClick={goOpportunities}>
              <BriefcaseBusiness size={16} /> View Matching Roles
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ----------------------------------------------------
// 3. ROLE-ADAPTIVE RESUME WORKSPACE
// ----------------------------------------------------
function RoleAdaptiveResumeWorkspace({ resume, resumeUrl, upload, jobs, initialJob, toast }) {
  const [content, setContent] = useState(() => localStorage.getItem(uploadedResumeKey) || "Computer Science student with experience in Python, React, JavaScript, SQL, and Git. Looking to contribute to software development projects and deliver reliable results.");
  const [targetJobId, setTargetJobId] = useState(initialJob?.id || jobs[0]?.id || 1);
  const [appliedSuggestions, setAppliedSuggestions] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [documentView, setDocumentView] = useState("original");

  const activeJob = jobs.find((j) => j.id === targetJobId) || initialJob || jobs[0];
  const isPdf = resume?.toLowerCase().endsWith(".pdf") || resumeUrl?.includes("blob");

  const suggestions = [
    {
      id: "summary",
      title: "Target professional summary",
      detail: `Align opening objective for ${activeJob.role} at ${activeJob.company}.`,
    },
    {
      id: "skills",
      title: "Surface role-matched skills",
      detail: `Add required technologies: ${activeJob.tags.join(", ")}.`,
    },
    {
      id: "highlight",
      title: "Strengthen project achievement",
      detail: `Incorporate measurable delivery aligned with ${activeJob.company}'s engineering focus.`,
    },
    {
      id: "metrics",
      title: "Add quantifiable impact metric",
      detail: "Add quantifiable result bullet to boost recruiter scanning speed.",
    },
    {
      id: "coursework",
      title: "Include relevant coursework",
      detail: `Surface core academic modules: ${activeJob.tags.slice(0, 2).join(", ")} & Algorithms.`,
    },
    {
      id: "ats",
      title: "Optimize ATS keyword coverage",
      detail: `Inject role tokens: ${activeJob.role} · ${activeJob.company}.`,
    },
  ];

  const calculateScore = () => {
    let score = 55;
    if (appliedSuggestions.includes("summary")) score += 15;
    if (appliedSuggestions.includes("skills")) score += 15;
    if (appliedSuggestions.includes("highlight")) score += 6;
    if (appliedSuggestions.includes("metrics")) score += 5;
    if (appliedSuggestions.includes("coursework")) score += 4;
    if (appliedSuggestions.includes("ats")) score += 3;
    return Math.min(98, score);
  };
  const atsScore = calculateScore();

  const applySuggestion = (sug) => {
    if (appliedSuggestions.includes(sug.id)) return;
    const rewritten = aiRewriteResumeText(content, sug.id, activeJob);
    setContent(rewritten);
    localStorage.setItem(uploadedResumeKey, rewritten);
    setAppliedSuggestions([...appliedSuggestions, sug.id]);
    setSelectedSuggestion({ ...sug, revisedContent: rewritten, job: activeJob });
    toast(`Applied change: ${sug.title} for ${activeJob.company}`);
  };

  const downloadPdf = async () => {
    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const width = 595, height = 842, margin = 48, max = width - margin * 2;
      let page = pdf.addPage([width, height]), y = height - margin;

      for (const para of content.split(/\n+/)) {
        const isHeading = /^[A-Z][A-Z &-]{3,}$/.test(para.trim());
        const words = para.trim().split(/\s+/);
        let line = "";
        const lines = [];
        for (const w of words) {
          const cand = `${line} ${w}`.trim();
          if (font.widthOfTextAtSize(cand, isHeading ? 11 : 10) > max) {
            if (line) lines.push(line);
            line = w;
          } else line = cand;
        }
        if (line) lines.push(line);

        for (const row of lines) {
          if (y < margin) {
            page = pdf.addPage([width, height]);
            y = height - margin;
          }
          page.drawText(row, {
            x: margin,
            y,
            size: isHeading ? 11 : 10,
            font: isHeading ? bold : font,
            color: rgb(0.1, 0.14, 0.2),
          });
          y -= isHeading ? 18 : 15;
        }
        y -= 4;
      }

      const bytes = await pdf.save();
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Tailored_${activeJob.company}_Resume.pdf`;
      a.click();
      toast("Tailored resume downloaded as PDF!");
    } catch {
      toast("Error generating PDF.");
    }
  };

  const downloadSuggestionsPdf = async () => {
    if (!resume) return toast("Upload a resume before downloading suggestions.");
    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const page = pdf.addPage([595, 842]);
      let y = 790;
      page.drawText("AI Resume Suggestions", { x: 48, y, size: 20, font: bold, color: rgb(0.19, 0.18, 0.55) });
      y -= 30;
      page.drawText(`${activeJob.role} | ${activeJob.company}`, { x: 48, y, size: 11, font, color: rgb(0.25, 0.3, 0.4) });
      y -= 38;
      suggestions.forEach((suggestion, index) => {
        const status = appliedSuggestions.includes(suggestion.id) ? "Applied" : "Recommended";
        page.drawText(`${index + 1}. ${suggestion.title} (${status})`, { x: 48, y, size: 12, font: bold, color: rgb(0.1, 0.14, 0.2) });
        y -= 17;
        const words = suggestion.detail.split(" "); let line = "";
        words.forEach((word) => {
          const next = `${line} ${word}`.trim();
          if (font.widthOfTextAtSize(next, 10) > 490) { page.drawText(line, { x: 62, y, size: 10, font, color: rgb(0.3, 0.35, 0.45) }); y -= 14; line = word; }
          else line = next;
        });
        if (line) { page.drawText(line, { x: 62, y, size: 10, font, color: rgb(0.3, 0.35, 0.45) }); y -= 22; }
      });
      const url = URL.createObjectURL(new Blob([await pdf.save()], { type: "application/pdf" }));
      const a = document.createElement("a"); a.href = url; a.download = `${activeJob.company}_Resume_Suggestions.pdf`; a.click();
      toast("AI suggestions PDF downloaded.");
    } catch { toast("Error generating suggestions PDF."); }
  };

  return (
    <section className="page-space resume-builder">
      <div className="builder-heading">
        <div>
          <h1>My resume</h1>
          <p className="muted page-copy">
            Upload your resume, view your original document, and apply AI role suggestions tailored to active campus opportunities.
          </p>
        </div>
      </div>

      {!resume ? (
        <div style={{ marginTop: "20px" }}>
          <label className="upload-zone large">
            <Upload size={28} />
            <strong>Upload Resume</strong>
            <span>PDF, DOCX or TXT · We retain your original text and tailor it for roles</span>
            <input type="file" accept="application/pdf,.pdf" onChange={upload} />
          </label>
        </div>
      ) : (
        <>
          <div className="builder-file">
            <FileText size={22} color="#4f46e5" />
            <div>
              <strong>{resume}</strong>
              <span style={{ fontSize: "11px", color: "#059669", display: "block" }}>
                ✓ Verified resume uploaded · {appliedSuggestions.length} role changes applied
              </span>
            </div>

            <div className="resume-view-switch" role="group" aria-label="Resume view">
              <button className={documentView === "original" ? "active" : ""} onClick={() => setDocumentView("original")}>Original PDF</button>
              <button className={documentView === "corrections" ? "active" : ""} onClick={() => setDocumentView("corrections")}>AI corrections</button>
            </div>

            <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
              <label className="secondary" style={{ fontSize: "11.5px", padding: "6px 12px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Upload size={13} /> Replace resume
                <input type="file" accept="application/pdf,.pdf" onChange={upload} style={{ display: "none" }} />
              </label>
              <button className="secondary resume-preview-action" onClick={() => setShowPreviewModal(true)}><Eye size={13} /> Preview resume</button>
            </div>
          </div>

          {documentView === "original" && isPdf && resumeUrl ? (
            <div className="original-resume-preview">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <strong style={{ fontSize: "13px" }}>Original Uploaded PDF Preview:</strong>
                <button className="text-btn" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>
                  Switch to Text Editor & AI Tailoring →
                </button>
              </div>
              <object
                data={`${resumeUrl}#view=FitH`}
                type="application/pdf"
                style={{ width: "100%", height: "560px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              >
                <iframe src={resumeUrl} title="Resume PDF View" style={{ width: "100%", height: "560px", border: "none" }} />
              </object>
            </div>
          ) : null}

          <div className={`builder-grid ${documentView === "corrections" ? "show-corrections" : ""}`}>
            <div className={`builder-editor ${documentView === "corrections" ? "corrections-a4" : ""}`}>
              <div className="builder-toolbar">
                <strong>{documentView === "corrections" ? `AI corrections for ${activeJob.role}` : "Resume text analysis"}</strong>
                <span style={{ fontSize: "11.5px", color: "var(--muted)" }}>
                  Only specific lines change when you apply suggestions below
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  localStorage.setItem(uploadedResumeKey, e.target.value);
                }}
                placeholder="Your resume content..."
              />
            </div>

            <aside className="resume-suggestions">
              <div className="suggestions-head">
                <span className="chat-bot"><Sparkles size={17} /></span>
                <div style={{ flex: 1 }}>
                  <strong>Tailor for Opportunities</strong>
                  <div className="role-dropdown-container" style={{ marginTop: "4px" }}>
                    <select
                      value={targetJobId}
                      onChange={(e) => {
                        setTargetJobId(Number(e.target.value));
                        setAppliedSuggestions([]);
                      }}
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px" }}
                    >
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.role} · {j.company}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="ats-score-container">
                <div className="ats-score-header">
                  <strong>ATS Match Score</strong>
                  <span className="score-badge">{atsScore}% Match</span>
                </div>
                <div className="score-bar-bg">
                  <div
                    className={`score-bar-fill ${atsScore >= 85 ? "high" : atsScore >= 70 ? "medium" : "low"}`}
                    style={{ width: `${atsScore}%` }}
                  />
                </div>
                <p className="score-copy">
                  {atsScore >= 85
                    ? `Optimized for ${activeJob.company}'s recruiter filters!`
                    : `Apply targeted changes below to boost match for ${activeJob.role}.`}
                </p>
              </div>

              <div className="resume-insight-row">
                <span><CheckCircle2 size={14} /> Role: {activeJob.role}</span>
                <button onClick={downloadSuggestionsPdf}><Download size={13} /> Download suggestions</button>
              </div>

              <div className="suggestion-cards">
                {suggestions.map((sug, idx) => {
                  const isApplied = appliedSuggestions.includes(sug.id);
                  return (
                    <article className={`role-suggestion ${isApplied ? "applied" : ""}`} key={sug.id}>
                      <span>{idx + 1}</span>
                      <div>
                        <strong>{sug.title}</strong>
                        <p>{sug.detail}</p>
                        <button disabled={isApplied} onClick={() => applySuggestion(sug)}>
                          {isApplied ? "Applied ✓" : "Apply to Resume"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </aside>
          </div>
        </>
      )}

        {false && <aside className="opportunities-panel">
          <div className="opportunities-panel-head">
            <span className="chat-bot"><BriefcaseBusiness size={17} /></span>
            <div><strong>Current opportunities</strong><p>Select a role to analyse your resume.</p></div>
          </div>
          <div className="opportunity-role-list">
            {jobs.map((job) => (
              <button key={job.id} className={`opportunity-role-card ${targetJobId === job.id ? "selected" : ""}`} onClick={() => { setTargetJobId(job.id); setAppliedSuggestions([]); setDocumentView("corrections"); }}>
                <strong>{job.role}</strong><span>{job.company}</span><small>{job.type} · {job.tags.slice(0, 3).join(", ")}</small>
              </button>
            ))}
          </div>
          {resume ? <button className="download-suggestions" onClick={downloadSuggestionsPdf}><Download size={15} /> Download suggestions PDF</button> : <p className="opportunity-hint">Upload your PDF, then choose a role to receive AI corrections.</p>}
        </aside>}

      {showPreviewModal && (
        <div className="resume-preview-overlay">
          <div className="resume-preview-wrap">
            <button className="modal-close" onClick={() => setShowPreviewModal(false)}>
              <X size={20} />
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <strong style={{ color: "#fff", fontSize: "16px" }}>A4 Formatted Resume Preview</strong>
              <button className="download-resume" onClick={downloadSuggestionsPdf}>
                <Download size={14} /> Download suggestions
              </button>
            </div>
            <article className="a4-resume">
              <div
                className="resume-editor"
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  setContent(e.currentTarget.innerText);
                  localStorage.setItem(uploadedResumeKey, e.currentTarget.innerText);
                }}
                style={{ whiteSpace: "pre-wrap", outline: "none" }}
              >
                {content}
              </div>
              <footer>
                Editing your uploaded resume · Changes are included in the PDF download
              </footer>
            </article>
          </div>
        </div>
      )}

      {selectedSuggestion && (
        <div className="resume-preview-overlay" onClick={() => setSelectedSuggestion(null)}>
          <div className="resume-preview-wrap suggestion-a4-wrap" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedSuggestion(null)}><X size={20} /></button>
            <div className="suggestion-sheet-heading">
              <span><Sparkles size={16} /> AI suggestion applied</span>
              <button className="download-resume" onClick={downloadSuggestionsPdf}><Download size={14} /> Download suggestions</button>
            </div>
            <article className="a4-resume suggestion-a4-page">
              <div className="a4-suggestion-note">
                <strong>{selectedSuggestion.title}</strong>
                <span>Tailored for {selectedSuggestion.job.role} at {selectedSuggestion.job.company}</span>
                <p>{selectedSuggestion.detail}</p>
              </div>
              <div className="resume-editor" style={{ whiteSpace: "pre-wrap" }}>{selectedSuggestion.revisedContent}</div>
            </article>
          </div>
        </div>
      )}
    </section>
  );
}

// ----------------------------------------------------
// 4. STUDENT CERTIFICATIONS (CARD VIEW & REAL PDF DOWNLOAD)
// ----------------------------------------------------
function CertificationsUploadView({ user, toast }) {
  const [certs, setCerts] = useState(() => readStored(studentCertificationsKey, []));
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return toast("Please upload certificates in PDF format only.");
    }
    setPdfFile(file);
    toast(`Selected PDF: ${file.name}`);
  };

  const handleSaveCert = (e) => {
    e.preventDefault();
    if (!title || !issuer || !pdfFile) return toast("Please complete certificate details and attach a PDF.");

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      const newCert = {
        id: Date.now(),
        title,
        issuer,
        date: date || "August 2026",
        fileName: pdfFile.name,
        fileData: base64Data,
        verified: true,
      };

      const next = [...certs, newCert];
      setCerts(next);
      localStorage.setItem(studentCertificationsKey, JSON.stringify(next));
      setShowModal(false);
      setTitle("");
      setIssuer("");
      setPdfFile(null);
      toast("Certificate uploaded in PDF format and verified successfully!");
    };
    reader.readAsDataURL(pdfFile);
  };

  const downloadCertPdf = (c) => {
    if (c.fileData) {
      const a = document.createElement("a");
      a.href = c.fileData;
      a.download = c.fileName || `${c.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast(`Downloaded: ${c.fileName}`);
    } else {
      toast("Certificate file not found.");
    }
  };

  const deleteCert = (id) => {
    const next = certs.filter((c) => c.id !== id);
    setCerts(next);
    localStorage.setItem(studentCertificationsKey, JSON.stringify(next));
    toast("Certificate removed.");
  };

  return (
    <section className="page-space">
      <div className="section-head">
        <div>
          <h1>Certifications</h1>
          <p className="muted page-copy">
            Upload and maintain your verified certificates (**PDF format only**). Uploaded certificates will be displayed in card format below.
          </p>
        </div>
        <button className="primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Upload PDF Certificate
        </button>
      </div>

      {certs.length > 0 ? (
        <div className="cert-grid">
          {certs.map((c) => (
            <article className="cert-card" key={c.id}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <span className="pill pale">✓ Verified PDF</span>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>{c.date}</span>
                </div>
                <h3>{c.title}</h3>
                <p>Issued by <b>{c.issuer}</b></p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#475569" }}>
                  <FileText size={15} color="#4f46e5" />
                  <span>{c.fileName}</span>
                </div>
              </div>
              <div style={{ marginTop: "14px", borderTop: "1px solid var(--line)", paddingTop: "10px", display: "flex", gap: "8px" }}>
                <button
                  className="secondary"
                  style={{ flex: 1, fontSize: "12px" }}
                  onClick={() => downloadCertPdf(c)}
                >
                  <Download size={14} /> Download PDF
                </button>
                <button
                  className="icon-btn"
                  onClick={() => deleteCert(c.id)}
                  title="Remove certificate"
                >
                  <Trash2 size={15} color="#ef4444" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px dashed #cbd5e1", borderRadius: "14px", padding: "48px 24px", textAlign: "center", marginTop: "18px" }}>
          <Award size={36} color="#6675e8" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ margin: "0 0 6px", fontSize: "16px" }}>No certificates uploaded yet</h3>
          <p className="muted" style={{ fontSize: "13px", maxWidth: "420px", margin: "0 auto" }}>
            Upload your industry-recognized credentials, course completions, and skill test results in PDF format to showcase on your profile.
          </p>
        </div>
      )}

      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={18} />
            </button>
            <form onSubmit={handleSaveCert} style={{ padding: "24px" }}>
              <h2 style={{ margin: "0 0 16px" }}>Upload Certificate (PDF Only)</h2>

              <label className="upload-pdf-dropzone">
                <Upload size={24} color="#4f46e5" style={{ margin: "0 auto 8px" }} />
                <strong>{pdfFile ? pdfFile.name : "Click to select certificate PDF"}</strong>
                <span style={{ display: "block", fontSize: "11.5px", color: "var(--muted)", marginTop: "4px" }}>
                  Strictly .pdf files only
                </span>
                <input type="file" accept="application/pdf,.pdf" onChange={handlePdfUpload} />
              </label>

              <div className="info-grid" style={{ margin: "0 0 16px" }}>
                <label>
                  Certificate Title
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AWS Certified Cloud Practitioner"
                    required
                  />
                </label>
                <label>
                  Issuing Organization
                  <input
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="e.g. Amazon Web Services / Coursera / NPTEL"
                    required
                  />
                </label>
                <label>
                  Issue Date
                  <input
                    type="month"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>
              </div>

              <div className="apply-modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" className="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary" disabled={!pdfFile}>
                  Save & Verify Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// ----------------------------------------------------
// 5. ORIGINAL CALENDAR COMPONENT
// ----------------------------------------------------
function OriginalCalendarView({ toast }) {
  const [month, setMonth] = useState(new Date(2026, 7, 1));
  const [selected, setSelected] = useState("2026-08-20");
  const year = month.getFullYear(),
    monthIndex = month.getMonth(),
    days = new Date(year, monthIndex + 1, 0).getDate(),
    offset = new Date(year, monthIndex, 1).getDay();

  const cells = Array.from(
    { length: Math.ceil((offset + days) / 7) * 7 },
    (_, i) => i - offset + 1
  );

  const monthLabel = month.toLocaleString("en-IN", { month: "long", year: "numeric" });
  const selectedEvents = calendarEvents.filter((e) => e.date === selected);
  const upcoming = calendarEvents.filter((e) => e.date >= selected).slice(0, 4);
  const dateKey = (d) =>
    `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <section className="page-space calendar-page">
      <div className="calendar-heading">
        <div>
          <h1>Calendar</h1>
          <p className="muted page-copy">Keep track of interviews and companies visiting campus.</p>
        </div>
      </div>

      <div className="calendar-layout">
        <div className="calendar-card">
          <div className="calendar-toolbar">
            <button aria-label="Previous month" onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}>
              ‹
            </button>
            <h2>{monthLabel}</h2>
            <button aria-label="Next month" onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}>
              ›
            </button>
          </div>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span className="calendar-weekday" key={day}>
                {day}
              </span>
            ))}
            {cells.map((day, i) => {
              if (day < 1 || day > days) return <span className="calendar-day empty-day" key={i} />;
              const key = dateKey(day);
              const events = calendarEvents.filter((e) => e.date === key);
              const isSelected = key === selected;
              const eventType = events[0]?.type;
              return (
                <button
                  key={key}
                  className={`calendar-day ${isSelected ? "selected-day " : ""} ${eventType ? `has-event ${eventType}` : ""}`}
                  onClick={() => setSelected(key)}
                >
                  <b>{day}</b>
                  {events.length > 0 && (
                    <small>{eventType === "interview" ? "Interview" : "Visit"}</small>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="upcoming-panel">
          <div>
            <h2>Upcoming events</h2>
          </div>
          <div className="event-list">
            {upcoming.map((event) => (
              <button
                className={"event-item " + event.type}
                key={event.company}
                onClick={() => {
                  setSelected(event.date);
                  setMonth(new Date(event.date + "T00:00:00"));
                }}
              >
                <span className="event-date">
                  {new Date(event.date + "T00:00:00").toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
                <div>
                  <small>{event.type === "interview" ? "INTERVIEW" : "VISITING COMPANY"}</small>
                  <strong>{event.company}</strong>
                  <p>{event.title}</p>
                  <em>
                    <Clock3 size={13} /> {event.time}
                  </em>
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <section className="selected-events" style={{ marginTop: "24px" }}>
        <div>
          <h2>
            {new Date(selected + "T00:00:00").toLocaleString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h2>
        </div>
        {selectedEvents.length ? (
          <div className="selected-event-list">
            {selectedEvents.map((event) => (
              <article className={"selected-event " + event.type} key={event.company}>
                <span>{event.type === "interview" ? "Interview" : "Campus visit"}</span>
                <div>
                  <h3>
                    {event.company} · {event.title}
                  </h3>
                  <p>
                    <Clock3 size={14} /> {event.time} <MapPin size={14} /> {event.place}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">No placement events scheduled for this day.</p>
        )}
      </section>
    </section>
  );
}

// ----------------------------------------------------
// 6. STUDENT MY APPLICATIONS (SYNCED WITH RECRUITER STATUS)
// ----------------------------------------------------
function OriginalApplicationsView({ userEmail, jobs, choose }) {
  const storedApps = readStored(studentApplicationsKey, []);
  const myApps = storedApps.filter(
    (a) => !userEmail || (a.studentEmail && a.studentEmail.toLowerCase() === userEmail.toLowerCase())
  );

  const getStatusClass = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("shortlist")) return "status shortlisted";
    if (s.includes("interview")) return "status interview";
    if (s.includes("select")) return "status selected";
    if (s.includes("reject")) return "status rejected";
    if (s.includes("review")) return "status review";
    return "status submitted";
  };

  return (
    <section className="page-space">
      <h1>My applications</h1>
      <p className="muted page-copy">
        Keep track of every opportunity you have applied for and real-time evaluation updates from recruiters.
      </p>
      <div className="application-list">
        {myApps.map((app) => {
          const job = jobs.find((j) => j.id === app.jobId) || {
            logo: "✦",
            color: "#eef2ff",
            role: app.role,
            company: app.company,
          };
          return (
            <button
              className="application-row"
              key={app.id || app.jobId}
              onClick={() => choose(job)}
            >
              <div className="job-logo" style={{ background: job.color || "#eef2ff" }}>
                {job.logo}
              </div>
              <div>
                <strong>{app.role}</strong>
                <p>
                  {app.company} · Applied {app.date || "recently"}
                </p>
              </div>
              <span className={getStatusClass(app.status)}>
                {app.status || "Submitted"}
              </span>
              <ChevronRight size={18} />
            </button>
          );
        })}
        {!myApps.length && (
          <div className="empty">
            You have not applied to any roles yet. Browse opportunities to submit an application.
          </div>
        )}
      </div>
    </section>
  );
}

// ----------------------------------------------------
// 7. STUDENT PROFILE
// ----------------------------------------------------
function OriginalProfileView({ user, toast }) {
  const skillOptions = [
    "Web Development", "Frontend Development", "Backend Development", "Full-stack Development",
    "Machine Learning", "Data Science", "Data Analysis", "UI/UX Design", "Graphic Design",
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C", "SQL", "React", "Node.js", "Git",
    "Figma", "Power BI", "Excel", "AWS", "Docker", "Cybersecurity", "Cloud Computing",
    "Communication", "Problem Solving"
  ];

  const [data, setData] = useState(() => getStudentProfile(user));

  const change = (e) => setData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const toggleSkill = (skill) =>
    setData((p) => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter((s) => s !== skill) : [...p.skills, skill],
    }));

  const changePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Please choose an image file.");
    const reader = new FileReader();
    reader.onload = () => setData((p) => ({ ...p, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const save = () => {
    const mobileValid = /^[6-9]\d{9}$/.test(data.phone);
    const linkedInValid = !data.linkedin || /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(data.linkedin);
    const githubValid = !data.github || /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/.test(data.github);

    if (!mobileValid) return toast("Enter a valid 10-digit Indian mobile number.");
    if (!linkedInValid) return toast("Enter a valid LinkedIn profile URL.");
    if (!githubValid) return toast("Enter a valid GitHub profile URL.");

    localStorage.setItem(profileKey(user?.email), JSON.stringify(data));
    updateStudentDirectory(user, data);
    toast("Profile changes saved successfully.");
  };

  return (
    <section className="page-space narrow">
      <h1>My profile</h1>
      <div className="profile-page">
        <div className="profile-hero">
          <div className="avatar big profile-photo-preview">
            {data.photo ? (
              <img src={data.photo} alt="Profile" />
            ) : (
              user?.avatar || user?.name?.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <h2>{user?.name || "Student"}</h2>
            <p>{data.department} · Class of 2026</p>
          </div>
        </div>

        <div className="info-grid">
          <label>
            Profile photo
            <input type="file" accept="image/*" onChange={changePhoto} />
          </label>
          <label>
            College name
            <input name="collegeName" value={data.collegeName} onChange={change} placeholder="Your college name" />
          </label>
          <label>
            Admission no.
            <input name="admissionNumber" value={data.admissionNumber || "2023CSB1042"} readOnly title="Set once during account creation." />
          </label>
          <label>
            Department
            <select name="department" value={data.department} onChange={change}>
              <option>Computer Science</option>
              <option>Information Technology</option>
              <option>AI-ML</option>
              <option>Data Science</option>
              <option>Electronics & Communication</option>
              <option>Mechanical Engineering</option>
              <option>Civil Engineering</option>
            </select>
          </label>
          <label>
            Current CGPA
            <input name="cgpa" type="number" step="0.1" min="0" max="10" value={data.cgpa} onChange={change} />
          </label>
          <label>
            Email
            <input name="email" type="text" value={data.email} readOnly />
          </label>
          <label>
            Phone
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength="10"
              value={data.phone}
              onChange={(e) => setData((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))}
              placeholder="10-digit mobile number"
            />
          </label>
          <label>
            LinkedIn URL
            <input name="linkedin" type="url" value={data.linkedin} onChange={change} placeholder="https://linkedin.com/in/your-id" />
          </label>
          <label>
            GitHub URL
            <input name="github" type="url" value={data.github} onChange={change} placeholder="https://github.com/your-id" />
          </label>
        </div>

        <fieldset className="skills-fieldset">
          <legend>Skills</legend>
          <div className="skills-checkboxes">
            {skillOptions.map((skill) => (
              <label key={skill}>
                <input type="checkbox" checked={data.skills.includes(skill)} onChange={() => toggleSkill(skill)} />
                {skill}
              </label>
            ))}
          </div>
        </fieldset>

        <button className="primary" onClick={save}>
          <Check size={17} /> Save changes
        </button>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// 8. HELP & SUPPORT
// ----------------------------------------------------
function OriginalHelpSupportView({ toast }) {
  const faqs = [
    ["Applying for a role", "Open Opportunities, select a role, check your eligibility, and choose Apply now. Your submitted application appears in My applications."],
    ["Eligibility and CGPA", "Each role shows eligible departments and minimum CGPA. Your saved profile CGPA is used to verify fit."],
    ["Resume upload and tailoring", "Go to My resume to upload a PDF or DOCX, then select Tailor with AI after choosing a role."],
    ["Interview and company visit updates", "Open Calendar to view interview slots and campus visits. Select any marked day to see the full schedule."],
    ["Skill Assessment & Gap Analysis", "Take the 10-question Domain Assessment to evaluate technical and soft skills and discover recommended upskilling pathways."],
  ];

  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const matches = faqs.filter(([q, a]) => (q + " " + a).toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="page-space narrow">
      <h1>How can we help?</h1>
      <p className="muted page-copy">
        Get quick answers, contact Training & Placement, or connect directly with academic faculty mentors.
      </p>

      <div className="search" style={{ marginBottom: "20px" }}>
        <Search size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help topics..."
        />
      </div>

      <section style={{ margin: "24px 0" }}>
        <div className="section-head">
          <div>
            <h2>Contact Professors Directly</h2>
          </div>
        </div>
        <p className="muted" style={{ fontSize: "12.5px", margin: "-10px 0 14px" }}>
          Need guidance on internships, collaborative research, or academic credentials? Contact departmental faculty:
        </p>

        <div className="academician-grid">
          {academicianDirectory.map((fac) => (
            <article className="academician-card" key={fac.id}>
              <div className="avatar">{fac.name.split(/\s+/).slice(0, 2).map((p) => p[0]).join("")}</div>
              <div style={{ flex: 1 }}>
                <h3>{fac.name}</h3>
                <p>{fac.designation} · {fac.department}</p>
                <small style={{ display: "block", color: "#64748b", fontSize: "11px", marginBottom: "8px" }}>
                  📍 {fac.office}
                </small>
                <div className="academician-contacts">
                  <a className="academician-contact-link" href={`mailto:${fac.email}`}>
                    <Mail size={13} /> Email
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="support-card" style={{ marginTop: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <Building2 size={20} color="#5564dc" />
          <h3 style={{ margin: 0, fontSize: "15px" }}>Training & Placement Office</h3>
        </div>
        <p style={{ margin: "0 0 10px" }}>For campus drive interview slots, offer letters, and institutional approvals.</p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "12px" }}>
          <a href="mailto:tpo@college.edu" className="text-btn">tpo@college.edu</a>
          <a href="tel:+911124567890" className="text-btn">+91 11 2456 7890</a>
          <span style={{ color: "var(--muted)" }}>Mon-Fri, 9:30 AM - 5:30 PM (Admin Block, Room 112)</span>
        </div>
      </div>

      <section style={{ marginTop: "24px" }}>
        <div className="section-head">
          <div>
            <h2>Frequently Asked Questions</h2>
          </div>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>{matches.length} topics</span>
        </div>
        <div className="faq-list">
          {matches.map(([question, answer], idx) => (
            <article className="faq-item" key={question}>
              <button onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}>
                <span>{question}</span>
                <ChevronDown size={17} />
              </button>
              {openFaq === idx && <p>{answer}</p>}
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

// ----------------------------------------------------
// 9. ONCAMPUS AI CHATBOT
// ----------------------------------------------------
function OriginalChatbot({ open, setOpen, jobs, applied, events, user }) {
  const messagesEndRef = useRef(null);
  const studentRegisteredName = user?.name || "Student";
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `Hi ${studentRegisteredName}! I’m OnCampus AI. Ask me about campus recruiters, open internships, eligibility requirements, interview dates, resume tips, or placement schedules.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [activeRole, setActiveRole] = useState(jobs[0]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  const answer = (q) => {
    const s = q.toLowerCase().trim();

    if (/^(hi+|hello+|hey+|good\s*(morning|afternoon|evening)|namaste|hola)[!. ]*$/i.test(s)) {
      return `Hello ${studentRegisteredName}! How can I assist you with your campus placements and opportunities today?`;
    }

    if (/thank|thx|shukriya|dhanyawad/i.test(s)) {
      return "You're very welcome! Let me know if you have more questions about campus opportunities.";
    }

    if (/who are you|what is oncampus|what can you do/i.test(s)) {
      return "I'm OnCampus AI, your dedicated placement assistant. I can help you check eligible companies, view deadlines, check required skills, track application statuses, and review interview schedules.";
    }

    const matchedJob = jobs.find((j) => {
      const comp = j.company.toLowerCase();
      const role = j.role.toLowerCase();
      return s.includes(comp) || s.includes(role);
    });

    if (matchedJob) {
      setActiveRole(matchedJob);
      if (/deadline|last date|closing date|when.*apply|apply by/i.test(s)) {
        return `The application deadline for ${matchedJob.role} at ${matchedJob.company} is ${matchedJob.deadline}.`;
      }
      if (/document|marksheet|id proof|upload/i.test(s)) {
        return `Required documents for ${matchedJob.company}: ${matchedJob.documents.join(", ")}.`;
      }
      if (/skill|technology|stack/i.test(s)) {
        return `Key skills needed for ${matchedJob.role} at ${matchedJob.company}: ${matchedJob.tags.join(", ")}.`;
      }
      if (/eligib|cgpa|branch|dept|criteria/i.test(s)) {
        return `Eligibility for ${matchedJob.company}: Minimum CGPA is ${matchedJob.cgpa}, open to ${matchedJob.depts.join(", ")} students.`;
      }
      if (/duration|period|months|how long/i.test(s)) {
        return `The duration for ${matchedJob.role} at ${matchedJob.company} is ${matchedJob.duration || "6 Months"}.`;
      }
      if (/stipend|salary|ctc|pay/i.test(s)) {
        return `Compensation for ${matchedJob.role} at ${matchedJob.company} is ${matchedJob.pay} (${matchedJob.type} · ${matchedJob.duration || "6 Months"}).`;
      }
      return `${matchedJob.company} is hiring for ${matchedJob.role} (${matchedJob.type} · ${matchedJob.duration || "6 Months"} · ${matchedJob.pay}) in ${matchedJob.location}. Minimum CGPA: ${matchedJob.cgpa}. Skills: ${matchedJob.tags.join(", ")}. Deadline: ${matchedJob.deadline}.`;
    }

    if (/eligib|cgpa|criteria/i.test(s)) {
      return "Eligibility criteria depend on the specific company (e.g. Nexora AI requires 7.0+ CGPA for CSE/AI-ML/Data Science; Atlis Health requires 8.0+ CGPA). Check the Opportunities section for exact criteria per role.";
    }

    if (/visit|visiting|schedule|drive|calendar|when.*coming|who.*coming/i.test(s)) {
      const visits = events.map((e) => `${e.company} (${new Date(e.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${e.time} at ${e.place})`).join("\n• ");
      return `Upcoming campus placement drives & interviews:\n• ${visits}`;
    }

    if (/interview/i.test(s)) {
      const interviewEvents = events.filter((e) => e.type === "interview");
      const list = interviewEvents.map((e) => `${e.company} (${e.title}): ${new Date(e.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} at ${e.time} (${e.place})`).join("; ");
      return `Scheduled technical and HR interviews: ${list}. Open your Calendar section for detailed day-by-day slot information.`;
    }

    if (/application|applied|status/i.test(s)) {
      return `You can monitor real-time recruiter review updates and status changes in the "My applications" section.`;
    }

    if (/resume|ats|tailor/i.test(s)) {
      return "In the 'My resume' section, you can upload your PDF/DOCX resume, preview your document, and apply AI role suggestions specifically targeted to live campus opportunities.";
    }

    if (/internship|jobs|openings|roles/i.test(s)) {
      const list = jobs.map((j) => `${j.role} at ${j.company} (${j.pay} · ${j.duration || "6 Months"})`).join("\n• ");
      return `Current live opportunities on campus:\n• ${list}`;
    }

    return "I can answer questions regarding visiting companies (e.g. Nexora AI, Mira Systems), eligibility criteria, required documents, application deadlines, interview dates in the calendar, or resume optimization tips.";
  };

  const send = (q) => {
    const v = (q || input).trim();
    if (!v) return;
    setMessages((m) => [...m, { from: "user", text: v }, { from: "bot", text: answer(v) }]);
    setInput("");
  };

  return (
    <div className="chatbot">
      {open && (
        <div className="chat-panel">
          <div className="chat-head">
            <div>
              <span className="chat-bot"><Bot size={17} /></span>
              <div>
                <strong>OnCampus AI</strong>
                <small>Answers from OnCampus data</small>
              </div>
            </div>
            <button onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={"message " + m.from} style={{ whiteSpace: "pre-line" }}>
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="suggestions">
            {["Which companies are visiting campus?", "Eligibility for Nexora AI", "What documents are required?"].map((q) => (
              <button key={q} onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about OnCampus..."
            />
            <button aria-label="Send"><Send size={17} /></button>
          </form>
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="Open OnCampus AI chat">
        {open ? <X size={22} /> : <MessageCircle size={23} />}
        <i />
      </button>
    </div>
  );
}

// ----------------------------------------------------
// 10. COMMON VIEWS (LEARNING HUB, OPPORTUNITIES, SAVED)
// ----------------------------------------------------
function StudentOverview({ go, choose, applied, name, jobs, assessment, userSkills }) {
  const readinessScore = assessment ? assessment.totalScore : 82;
  return (
    <>
      <section className="welcome">
        <div>
          <h1>Good morning, {name}</h1>
          <p className="muted">Explore verified opportunities, evaluate your skills, and track your applications.</p>
        </div>
        <button className="primary" onClick={() => go("resume")}>
          <Sparkles size={16} /> Tailor my resume
        </button>
      </section>

      <div className="readiness-banner">
        <div className="readiness-icon"><Sparkles size={24} /></div>
        <div>
          <strong>Industry Skill Readiness Score: {readinessScore}%</strong>
          <span>
            {assessment
              ? `Based on your ${assessment.domainName} assessment evaluation.`
              : "Complete the 10-question domain skill questionnaire to map your profile to top industry roles."}
          </span>
        </div>
        <button className="secondary" onClick={() => go("assessment")}>
          {assessment ? "View gap analysis" : "Start questionnaire"}
        </button>
      </div>

      <section className="stats">
        <div>
          <span className="stat-icon lavender"><BriefcaseBusiness size={20} /></span>
          <p>Live opportunities</p>
          <strong>{jobs.length}</strong>
          <small>Matched to campus</small>
        </div>
        <div>
          <span className="stat-icon peach"><Sparkles size={20} /></span>
          <p>Skill Match Avg</p>
          <strong>88%</strong>
          <small>Based on your profile</small>
        </div>
        <div>
          <span className="stat-icon mint"><FileText size={20} /></span>
          <p>Applications</p>
          <strong>{applied.length}</strong>
          <small>Active in review</small>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Matched for your profile</h2>
          </div>
          <button className="text-btn" onClick={() => go("opportunities")}>
            View all <ChevronRight size={17} />
          </button>
        </div>
        <div className="quick-grid">
          {jobs.slice(0, 3).map((j) => {
            const matchScore = computeSkillMatch(j.tags, userSkills);
            return (
              <button className="quick-card" onClick={() => choose(j)} key={j.id}>
                <span className="job-logo" style={{ background: j.color }}>
                  {j.logo}
                </span>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <small>{j.company}</small>
                    <span className="match-badge high">{matchScore}% Match</span>
                  </div>
                  <h3>{j.role}</h3>
                  <p><MapPin size={13} /> {j.location} · {j.duration || "6 Months"} · {j.pay}</p>
                </div>
                <ArrowUpRight size={17} />
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

function LearningHubView({ user, toast, assessmentData }) {
  const [programs] = useState(defaultLearningPrograms);
  const [enrollments, setEnrollments] = useState(() => readStored(enrollmentsKey, ["lp-1"]));

  const toggleEnroll = (id, title) => {
    if (enrollments.includes(id)) {
      toast(`You are already enrolled in ${title}`);
    } else {
      const next = [...enrollments, id];
      setEnrollments(next);
      localStorage.setItem(enrollmentsKey, JSON.stringify(next));
      toast(`Successfully enrolled in ${title}! Modules unlocked.`);
    }
  };

  const studentGaps = assessmentData?.gaps || [];

  return (
    <section className="page-space">
      <h1>Learning Hub</h1>
      <p className="muted page-copy">
        Company-published training programs aligned with current industry requirements and your skill assessment results.
      </p>

      <div className="learning-grid">
        {programs.map((prog) => {
          const isEnrolled = enrollments.includes(prog.id);
          const bridgesGap = studentGaps.some((gap) =>
            prog.skills.some((sk) => sk.toLowerCase().includes(gap.toLowerCase()) || gap.toLowerCase().includes(sk.toLowerCase()))
          );

          return (
            <article className="learning-card" key={prog.id}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span className="learning-provider-tag">{prog.provider}</span>
                  {bridgesGap && (
                    <span className="gap-bridge-tag">
                      ⚡ Recommended for Your Gaps
                    </span>
                  )}
                </div>
                <h3>{prog.title}</h3>
                <div className="learning-meta">
                  <span>⏱ {prog.duration}</span>
                  <span>📊 {prog.level}</span>
                  <span>👥 {prog.enrolledCount} enrolled</span>
                </div>
                <p style={{ fontSize: "12.5px", color: "#475569", lineHeight: "1.45", margin: "8px 0" }}>
                  {prog.description}
                </p>
                <div className="tags" style={{ margin: "8px 0" }}>
                  {prog.skills.map((s) => (
                    <em key={s}>{s}</em>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", marginTop: "12px" }}>
                <button
                  className={isEnrolled ? "secondary" : "primary"}
                  style={{ width: "100%" }}
                  onClick={() => toggleEnroll(prog.id, prog.title)}
                >
                  {isEnrolled ? "✓ Enrolled · Access Modules" : "Enroll in Program"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function OpportunitiesView({ jobs, query, setQuery, filter, setFilter, selected, choose, saved, save, applied, apply, userSkills }) {
  const filtered = jobs.filter((j) => {
    const matchesFilter = filter === "All opportunities" || j.type === filter;
    const matchesQuery = !query ||
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.role.toLowerCase().includes(query.toLowerCase()) ||
      j.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    return matchesFilter && matchesQuery;
  });

  return (
    <section className="page-space">
      <h1>Opportunities for you</h1>
      <p className="muted page-copy">Roles currently shared by your training & placement cell.</p>

      <div className="filter-row">
        <div className="search">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles, skills or companies"
          />
        </div>
        <div className="filters">
          {["All opportunities", "Internship", "Full-time", "Campus drive"].map((x) => (
            <button
              onClick={() => setFilter(x)}
              className={filter === x ? "chip chosen" : "chip"}
              key={x}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      <div className="content-grid">
        <div className="job-list">
          {filtered.map((j) => {
            const matchScore = computeSkillMatch(j.tags, userSkills);
            return (
              <JobCard
                job={j}
                key={j.id}
                current={selected?.id === j.id}
                saved={saved.includes(j.id)}
                choose={() => choose(j)}
                save={() => save(j.id)}
                matchScore={matchScore}
              />
            );
          })}
          {!filtered.length && (
            <div className="empty">No roles match your search. Try another skill or company.</div>
          )}
        </div>

        {selected && (
          <Detail
            job={selected}
            applied={applied.includes(selected.id)}
            apply={apply}
            matchScore={computeSkillMatch(selected.tags, userSkills)}
          />
        )}
      </div>
    </section>
  );
}

function JobCard({ job, current, saved, choose, save, matchScore }) {
  return (
    <article className={"job-card " + (current ? "selected" : "")} onClick={choose}>
      <div className="job-logo" style={{ background: job.color || "#eef2ff" }}>
        {job.logo}
      </div>
      <div className="job-info">
        <div className="job-top">
          <span>{job.company}</span>
          <span className="match-badge high">{matchScore}% Match</span>
        </div>
        <h3>{job.role}</h3>
        <div className="job-meta">
          <span><MapPin size={14} /> {job.location}</span>
          <span><Clock3 size={14} /> {job.type} ({job.duration || "6 Months"})</span>
        </div>
        <div className="tags">
          {job.tags.slice(0, 3).map((t) => (
            <em key={t}>{t}</em>
          ))}
        </div>
      </div>
      <button
        className={"save " + (saved ? "saved" : "")}
        onClick={(e) => {
          e.stopPropagation();
          save();
        }}
      >
        <Heart size={18} fill={saved ? "currentColor" : "none"} />
      </button>
    </article>
  );
}

function Detail({ job, applied, apply, matchScore }) {
  return (
    <aside className="detail">
      <div className="detail-logo" style={{ background: job.color || "#eef2ff" }}>
        {job.logo}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="company"><Building2 size={14} /> {job.company}</p>
        <span className="match-badge high">{matchScore}% Skill Fit</span>
      </div>
      <h2>{job.role}</h2>
      <div className="detail-meta">
        <span><MapPin size={15} /> {job.location}</span>
        <span><Clock3 size={15} /> {job.type} · {job.duration || "6 Months"}</span>
      </div>
      <div className="divider" />
      <div className="salary">
        <div>
          <small>{job.type === "Internship" ? "STIPEND" : "CTC"}</small>
          <strong>{job.pay}</strong>
        </div>
        <div>
          <small>APPLICATION</small>
          <strong>{job.deadline}</strong>
        </div>
      </div>
      <div className="eligibility">
        <p><Check size={16} /> Eligible departments</p>
        <div>{job.depts?.map((d) => <span key={d}>{d}</span>)}</div>
        <p><Check size={16} /> Minimum CGPA <b>{job.cgpa}</b></p>
      </div>
      <p className="about"><b>About the role</b>{job.about}</p>
      {applied ? (
        <div className="applied-state">
          <CheckCircle2 size={18} />
          <div>
            <strong>Applied to this role</strong>
            <span>Your application is in review with the recruitment team.</span>
          </div>
        </div>
      ) : (
        <button className="apply" onClick={apply}>
          Apply now <ArrowUpRight size={17} />
        </button>
      )}
    </aside>
  );
}

function SavedRolesView({ jobs, choose, save }) {
  return (
    <section className="page-space">
      <h1>Saved Roles</h1>
      <div className="quick-grid" style={{ marginTop: "20px" }}>
        {jobs.map((j) => (
          <div className="quick-card" key={j.id} onClick={() => choose(j)}>
            <span className="job-logo" style={{ background: j.color }}>
              {j.logo}
            </span>
            <div>
              <small>{j.company}</small>
              <h3>{j.role}</h3>
              <p>{j.location} · {j.duration || "6 Months"} · {j.pay}</p>
            </div>
            <button
              className="save saved"
              onClick={(e) => {
                e.stopPropagation();
                save(j.id);
              }}
            >
              <Heart size={16} fill="currentColor" />
            </button>
          </div>
        ))}
        {!jobs.length && (
          <div className="empty">You have no saved roles yet. Browse opportunities to shortlist.</div>
        )}
      </div>
    </section>
  );
}

// ----------------------------------------------------
// 11. ACADEMICIAN / FACULTY PORTAL
// ----------------------------------------------------
function AcademicianApp({ user, logout }) {
  const [page, setPage] = useState("overview");
  const [notice, setNotice] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const initials = user?.name?.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "FA";

  const toast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2600);
  };

  const navLinks = [
    ["overview", "Overview", LayoutDashboard],
    ["faculty-opps", "Faculty opportunities", BriefcaseBusiness],
    ["learning", "Learning programs", BookOpen],
    ["profile", "Faculty profile", UserRound],
  ];

  return (
    <div className="app academician-portal">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">⌂</span>
          <span>OnCampus</span>
        </div>
        <nav>
          {navLinks.map(([id, label, Icon]) => (
            <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)}>
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={logout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main>
        <header>
          <div className="mobile-brand">⌂ campusly</div>
          <div className="header-actions">
            <span className="role-badge">Academician</span>
            <button className="academician-profile-trigger" onClick={() => setShowProfile(true)} title="View my profile">
              <span className="avatar small">{initials}</span>
              <span>My profile</span>
            </button>
          </div>
        </header>

        {page === "overview" && (
          <section className="page-space">
            <div className="welcome">
              <div>
                <h1>Welcome, Prof. {user.name}</h1>
                <p className="muted">
                  Explore faculty industry internships, AICTE-approved FDPs, and joint R&D research projects.
                </p>
              </div>
            </div>
            <div className="stats">
              <div>
                <span className="stat-icon lavender"><Building2 size={20} /></span>
                <p>Faculty Opportunities</p>
                <strong>4</strong>
                <small>Internships & Grants</small>
              </div>
              <div>
                <span className="stat-icon mint"><FileText size={20} /></span>
                <p>Consultancy Calls</p>
                <strong>2</strong>
                <small>Active retainers</small>
              </div>
              <div>
                <span className="stat-icon peach"><Handshake size={20} /></span>
                <p>Collaborative Projects</p>
                <strong>3</strong>
                <small>Industry Sponsored</small>
              </div>
            </div>
          </section>
        )}

        {page === "faculty-opps" && (
          <section className="page-space">
            <h1>Faculty Opportunities</h1>
            <div className="learning-grid" style={{ marginTop: "20px" }}>
              <article className="learning-card">
                <div>
                  <span className="faculty-badge">Faculty Internship</span>
                  <h3>AI in Autonomous Systems - Faculty Fellowship</h3>
                  <p className="muted"><b>Nexora AI Labs</b> · 8 Weeks (Hybrid)</p>
                  <p style={{ fontSize: "12.5px", color: "#475569", margin: "8px 0" }}>
                    Work with senior industry scientists on real-world perception models with INR 1,20,000 Fellowship.
                  </p>
                </div>
                <button className="primary" onClick={() => toast("Proposal submitted to Nexora AI Labs!")}>
                  Submit Fellowship Proposal
                </button>
              </article>
              <article className="learning-card">
                <div>
                  <span className="faculty-badge">FDP Program</span>
                  <h3>AICTE Cloud-Native Microservices FDP</h3>
                  <p className="muted"><b>Mira Systems</b> · 2 Weeks (Online)</p>
                  <p style={{ fontSize: "12.5px", color: "#475569", margin: "8px 0" }}>
                    Curriculum enablement on Kubernetes and modern DevOps architectures for university faculty.
                  </p>
                </div>
                <button className="primary" onClick={() => toast("Enrolled in Faculty Development Program!")}>
                  Enroll in FDP
                </button>
              </article>
            </div>
          </section>
        )}

        {page === "learning" && (
          <LearningHubView user={user} toast={toast} assessmentData={null} />
        )}

        {page === "profile" && (
          <section className="page-space narrow">
            <h1>My profile</h1>
            <div className="profile-page">
              <div className="profile-hero">
                <div className="avatar big">{initials}</div>
                <div>
                  <h2>{user.name}</h2>
                  <p>Department of Computer Science & Engineering</p>
                </div>
              </div>
              <div className="info-grid">
                <label>Official Email<input value={user.email} readOnly /></label>
                <label>Designation<input defaultValue="Associate Professor & Research Lead" /></label>
              </div>
            </div>
          </section>
        )}
      </main>

      {showProfile && (
        <div className="overlay" onClick={() => setShowProfile(false)}>
          <section className="academician-profile-popover" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowProfile(false)}><X size={18} /></button>
            <div className="profile-hero">
              <div className="avatar big">{initials}</div>
              <div><p className="profile-kicker">ACADEMICIAN PROFILE</p><h2>{user.name}</h2><p>Department of Computer Science & Engineering</p></div>
            </div>
            <div className="academician-profile-details">
              <div><span>Official email</span><strong>{user.email}</strong></div>
              <div><span>Designation</span><strong>Associate Professor & Research Lead</strong></div>
              <div><span>Portal access</span><strong>Academician</strong></div>
            </div>
            <button className="academician-signout" onClick={logout}><LogOut size={16} /> Sign out</button>
          </section>
        </div>
      )}

      {notice && <div className="toast"><Check size={16} />{notice}</div>}
    </div>
  );
}

// ----------------------------------------------------
// 12. INDUSTRY / RECRUITER PORTAL (COMPANY-SPECIFIC ROLES & APPLICANTS)
// ----------------------------------------------------
function IndustryApp({ user, logout }) {
  const [page, setPage] = useState("overview");
  const [applications, setApplications] = useState(() => readStored(studentApplicationsKey, []));
  const [jobsList, setJobsList] = useState(() => {
    const custom = readStored(publishedOpportunitiesKey, []);
    const initialIds = initialJobs.map((j) => j.id);
    const overrides = custom.filter((c) => initialIds.includes(c.id));
    const news = custom.filter((c) => !initialIds.includes(c.id));
    const base = initialJobs.map((j) => overrides.find((o) => o.id === j.id) || j);
    return [...base, ...news];
  });

  const [companyProfile, setCompanyProfile] = useState(() => getIndustryProfile(user));
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewResumeModal, setViewResumeModal] = useState(null);
  const [emailModal, setEmailModal] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [notice, setNotice] = useState("");

  const userCompany = (companyProfile.company || user?.name || "Nexora AI").trim();
  const normalizedCompany = userCompany.toLowerCase();

  // Company-specific filtering
  const myCompanyJobs = jobsList.filter((j) => {
    const jobComp = (j.company || "").toLowerCase().trim();
    return jobComp === normalizedCompany || jobComp.includes(normalizedCompany) || normalizedCompany.includes(jobComp);
  });

  const myCompanyApplications = applications.filter((a) => {
    const appComp = (a.company || "").toLowerCase().trim();
    return appComp === normalizedCompany || appComp.includes(normalizedCompany) || normalizedCompany.includes(appComp);
  });

  const [draft, setDraft] = useState({
    company: userCompany,
    role: "",
    type: "Internship",
    duration: "6 Months",
    pay: "INR 30,000 / month",
    location: "Bengaluru",
    deadline: getFutureDateIso(20),
    cgpa: "7.0+",
    depts: ["CSE", "IT", "AI-ML", "Data Science"],
    skills: "Python, React, Machine Learning",
    about: "",
    logo: companyProfile.logo || "✺",
    color: companyProfile.color || "#e1e7ff",
  });

  const toast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2800);
  };

  const publishJob = (e) => {
    e.preventDefault();
    if (!draft.role || !draft.deadline) return toast("Please complete opportunity details.");

    const tagsArray = draft.skills.split(/[,·|]/).map((s) => s.trim()).filter(Boolean);

    const newOpportunity = {
      id: Date.now(),
      company: userCompany,
      role: draft.role,
      type: draft.type || "Internship",
      duration: draft.duration || "6 Months",
      location: draft.location || "Bengaluru",
      pay: draft.pay || "INR 30,000 / month",
      deadline: draft.deadline,
      cgpa: draft.cgpa || "7.0+",
      depts: draft.depts.length ? draft.depts : ["CSE", "IT", "AI-ML", "Data Science"],
      documents: ["Updated resume", "Latest marksheet", "Government photo ID"],
      logo: companyProfile.logo || "✦",
      color: companyProfile.color || "#eef2ff",
      tags: tagsArray.length ? tagsArray : ["Software", "Development"],
      posted: "Just now",
      about: draft.about || `${userCompany} is hiring for ${draft.role}.`,
    };

    const published = readStored(publishedOpportunitiesKey, []);
    const next = [...published, newOpportunity];
    localStorage.setItem(publishedOpportunitiesKey, JSON.stringify(next));

    // Smart student notification targeted ONLY to eligible departments
    const studentNotifs = readStored(studentNotificationsKey, sampleNotifications);
    const newNotif = {
      id: Date.now(),
      title: `New Opening: ${userCompany}`,
      desc: `${newOpportunity.role} (${newOpportunity.type} · ${newOpportunity.duration} · ${newOpportunity.pay}) is open for applications (Deadline: ${newOpportunity.deadline}).`,
      time: "Just now",
      eligibleDepts: newOpportunity.depts,
    };
    localStorage.setItem(studentNotificationsKey, JSON.stringify([newNotif, ...studentNotifs]));

    setJobsList([...jobsList, newOpportunity]);
    setShowPublish(false);
    toast(`✓ Opportunity published for ${userCompany} & notification dispatched to eligible department students!`);
  };

  const updateJob = (e) => {
    e.preventDefault();
    if (!editingJob) return;

    const tagsArray = typeof editingJob.tags === "string"
      ? editingJob.tags.split(/[,·|]/).map((s) => s.trim()).filter(Boolean)
      : editingJob.tags;

    const updated = {
      ...editingJob,
      company: userCompany,
      duration: editingJob.duration || "6 Months",
      tags: tagsArray,
    };

    const published = readStored(publishedOpportunitiesKey, []);
    const existingIndex = published.findIndex((j) => j.id === updated.id);
    let nextPublished;
    if (existingIndex >= 0) {
      nextPublished = [...published];
      nextPublished[existingIndex] = updated;
    } else {
      nextPublished = [...published, updated];
    }
    localStorage.setItem(publishedOpportunitiesKey, JSON.stringify(nextPublished));

    // Smart notification for updated criteria targeted to eligible departments
    const studentNotifs = readStored(studentNotificationsKey, sampleNotifications);
    const newNotif = {
      id: Date.now(),
      title: `Opportunity Update: ${userCompany}`,
      desc: `Updated criteria for ${updated.role} (${updated.duration || "6 Months"} · ${updated.pay} · Deadline: ${updated.deadline}).`,
      time: "Just now",
      eligibleDepts: updated.depts,
    };
    localStorage.setItem(studentNotificationsKey, JSON.stringify([newNotif, ...studentNotifs]));

    setJobsList(jobsList.map((j) => (j.id === updated.id ? updated : j)));
    setEditingJob(null);
    toast("✓ Opportunity changes saved & updated for eligible students!");
  };

  const updateAppStatus = (appId, newStatus) => {
    const updated = applications.map((a) => (a.id === appId || (a.jobId === appId && a.studentEmail) ? { ...a, status: newStatus } : a));
    setApplications(updated);
    localStorage.setItem(studentApplicationsKey, JSON.stringify(updated));

    const targetApp = applications.find((a) => a.id === appId || a.jobId === appId);
    if (targetApp) {
      let notifTitle = `Application Status: ${targetApp.company}`;
      let notifDesc = `Your application for ${targetApp.role} has been moved to "${newStatus}".`;

      if (newStatus === "Shortlisted") {
        notifTitle = `🎉 Shortlisted by ${targetApp.company}`;
        notifDesc = `Congratulations! Your application for ${targetApp.role} has been shortlisted for technical evaluation.`;
      } else if (newStatus === "Interview Scheduled") {
        notifTitle = `📅 Interview Scheduled: ${targetApp.company}`;
        notifDesc = `Interview round confirmed for ${targetApp.role}. Check your calendar and email for slot details.`;
      } else if (newStatus === "Selected") {
        notifTitle = `🏆 Selection Offer: ${targetApp.company}`;
        notifDesc = `Congratulations! You have been selected for the ${targetApp.role} opportunity at ${targetApp.company}.`;
      }

      const studentNotifs = readStored(studentNotificationsKey, sampleNotifications);
      const newNotif = {
        id: Date.now(),
        title: notifTitle,
        desc: notifDesc,
        time: "Just now",
      };
      localStorage.setItem(studentNotificationsKey, JSON.stringify([newNotif, ...studentNotifs]));
    }
    toast(`Applicant status changed to "${newStatus}"! Synced to student's My Applications.`);
  };

  const saveCompanyProfile = (e) => {
    e.preventDefault();
    localStorage.setItem(`oncampus-industry-profile-${user?.email?.toLowerCase()}`, JSON.stringify(companyProfile));
    setShowProfileModal(false);
    toast("✓ Company profile saved successfully!");
  };

  const openEmailModal = (app) => {
    setEmailModal(app);
    setEmailSubject(`Interview Shortlist for ${app.role} at ${userCompany}`);
    setEmailBody(`Dear ${app.studentName},\n\nWe have reviewed your profile and resume for the ${app.role} position at ${userCompany}. We are impressed with your technical background and would like to invite you for the next round of interview.\n\nPlease confirm your availability for an interview slot.\n\nBest regards,\nRecruitment Team\n${userCompany}`);
  };

  const sendCandidateEmail = (e) => {
    e.preventDefault();
    if (!emailModal) return;

    // Send smart notification to student
    const studentNotifs = readStored(studentNotificationsKey, sampleNotifications);
    const newNotif = {
      id: Date.now(),
      title: `✉️ Message from ${userCompany}`,
      desc: `${emailSubject} · "${emailBody.slice(0, 65)}..."`,
      time: "Just now",
    };
    localStorage.setItem(studentNotificationsKey, JSON.stringify([newNotif, ...studentNotifs]));

    toast(`✓ Email dispatched to ${emailModal.studentName} (${emailModal.studentEmail})!`);
    setEmailModal(null);
  };

  const logoSymbols = ["✺", "◒", "⌘", "✳", "◍", "✦", "❖", "▲", "◆"];

  const navLinks = [
    ["overview", "Overview", LayoutDashboard],
    ["applicants", "Applicants", Users],
    ["drives", "Manage opportunities", BriefcaseBusiness],
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">⌂</span>
          <span>campusly</span>
        </div>
        <nav>
          {navLinks.map(([id, label, Icon]) => (
            <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)}>
              <Icon size={18} />
              <span>{label}</span>
              {id === "applicants" && <b>{myCompanyApplications.length}</b>}
              {id === "drives" && <b>{myCompanyJobs.length}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={logout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main>
        <header>
          <div className="mobile-brand">⌂ campusly</div>
          <div className="header-actions">
            <span className="role-badge">Industry Partner</span>

            {/* Upper Right Company Profile Button with Logo */}
            <button
              className="company-profile-header-btn"
              onClick={() => setShowProfileModal(true)}
              title="View & Edit Company Profile"
            >
              <div
                className="job-logo"
                style={{
                  background: companyProfile.color || "#e1e7ff",
                  width: "28px",
                  height: "28px",
                  fontSize: "13px",
                }}
              >
                {companyProfile.logo || "✺"}
              </div>
              <strong>{userCompany}</strong>
              <ChevronDown size={14} color="#64748b" />
            </button>
          </div>
        </header>

        {page === "overview" && (
          <section className="page-space">
            <div className="welcome">
              <div>
                <h1>Welcome, {userCompany}</h1>
                <p className="muted">
                  Managing campus recruitment drives, review student applicants, and post verified opportunities for {userCompany}.
                </p>
              </div>
              <button className="primary" onClick={() => setShowPublish(true)}>
                <Plus size={16} /> Post opportunity
              </button>
            </div>

            <div className="stats">
              <div>
                <span className="stat-icon lavender"><ClipboardCheck size={20} /></span>
                <p>Received Applications</p>
                <strong>{myCompanyApplications.length}</strong>
                <small>For {userCompany}</small>
              </div>
              <div>
                <span className="stat-icon mint"><Users size={20} /></span>
                <p>Shortlisted Candidates</p>
                <strong>{myCompanyApplications.filter((a) => a.status === "Shortlisted").length}</strong>
                <small>Interview pool</small>
              </div>
              <div>
                <span className="stat-icon peach"><BriefcaseBusiness size={20} /></span>
                <p>Active Postings</p>
                <strong>{myCompanyJobs.length}</strong>
                <small>Live on campus</small>
              </div>
            </div>
          </section>
        )}

        {page === "applicants" && (
          <section className="page-space">
            <div className="section-head">
              <div>
                <h1>Applicants</h1>
                <p className="muted page-copy">
                  Candidates who submitted applications for <b>{userCompany}</b>. View submitted PDF resumes, dispatch emails, and update evaluation status.
                </p>
              </div>
            </div>

            <div className="applicant-grid">
              {myCompanyApplications.length ? (
                myCompanyApplications.map((app, idx) => (
                  <article className="applicant-card" key={app.id || idx}>
                    <div>
                      <div className="applicant-card-header">
                        <div className="avatar">{app.studentName?.slice(0, 2).toUpperCase()}</div>
                        <div>
                          <h3>{app.studentName}</h3>
                          <p className="applicant-card-sub">
                            {app.department || "Computer Science"} · CGPA <b>{app.cgpa || "8.2"}</b>
                          </p>
                          <small style={{ color: "#64748b", fontSize: "11px" }}>
                            {app.collegeName || "Apex Institute of Technology"} · ID: {app.admissionNumber || "2023CSB1042"}
                          </small>
                        </div>
                      </div>

                      <div className="applicant-details-box">
                        <span><b>Applied Role:</b> {app.role}</span>
                        <span><b>Applied Date:</b> {app.date || "Today"}</span>
                        <span><b>Contact:</b> {app.phone || "+91 98765 43210"} · {app.studentEmail}</span>
                        <span><b>Resume Document:</b> {app.resumeName || "Submitted_Resume.pdf"}</span>
                      </div>

                      <div className="applicant-status-row">
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                          Evaluation Status:
                        </span>
                        <select
                          value={app.status || "Submitted"}
                          onChange={(e) => updateAppStatus(app.id || app.jobId, e.target.value)}
                          className="status-dropdown"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="action-btn-group" style={{ marginTop: "12px" }}>
                      <button
                        className="action-btn resume-btn"
                        onClick={() => setViewResumeModal(app)}
                      >
                        <FileText size={13} /> View Resume
                      </button>
                      {app.phone && (
                        <a className="action-btn call-btn" href={`tel:${app.phone}`}>
                          <Phone size={13} /> Call
                        </a>
                      )}
                      <button
                        className="action-btn email-btn"
                        onClick={() => openEmailModal(app)}
                      >
                        <Mail size={13} /> Email
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty" style={{ gridColumn: "1 / -1" }}>
                  No candidate applications received yet for {userCompany}.
                </div>
              )}
            </div>
          </section>
        )}

        {page === "drives" && (
          <section className="page-space">
            <div className="section-head">
              <div>
                <h1>Manage Opportunities ({userCompany})</h1>
                <p className="muted page-copy">
                  Showing active roles posted by <b>{userCompany}</b>. Edit criteria, duration, stipend, and deadlines anytime.
                </p>
              </div>
              <button className="primary" onClick={() => setShowPublish(true)}>
                <Plus size={16} /> Post new opportunity
              </button>
            </div>

            <div className="editable-opportunity-grid">
              {myCompanyJobs.map((j) => (
                <article className="editable-card" key={j.id}>
                  <div>
                    <div className="editable-card-top">
                      <span className="job-logo" style={{ background: j.color || companyProfile.color || "#eef2ff" }}>
                        {j.logo || companyProfile.logo || "✺"}
                      </span>
                      <div style={{ flex: 1 }}>
                        <small style={{ color: "var(--muted)", fontWeight: 600 }}>{j.company}</small>
                        <h3 style={{ margin: "2px 0 4px", fontSize: "16px" }}>{j.role}</h3>
                        <span className="pill pale">{j.type} · {j.duration || "6 Months"}</span>
                      </div>
                    </div>

                    <div style={{ fontSize: "12px", color: "#475569", display: "grid", gap: "4px", margin: "12px 0" }}>
                      <span><b>Duration:</b> {j.duration || "6 Months"}</span>
                      <span><b>Compensation:</b> {j.pay}</span>
                      <span><b>Location:</b> {j.location}</span>
                      <span><b>Eligibility:</b> {j.cgpa} CGPA · {j.depts?.join(", ")}</span>
                      <span><b>Deadline:</b> {j.deadline}</span>
                    </div>

                    <div className="tags" style={{ margin: "10px 0" }}>
                      {j.tags?.map((t) => <em key={t}>{t}</em>)}
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", marginTop: "12px" }}>
                    <button
                      className="secondary"
                      style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      onClick={() => setEditingJob({ ...j, duration: j.duration || "6 Months", tags: typeof j.tags === "object" ? j.tags?.join(", ") : j.tags })}
                    >
                      <Edit size={14} /> Edit Opportunity & Requirements
                    </button>
                  </div>
                </article>
              ))}
              {!myCompanyJobs.length && (
                <div className="empty" style={{ gridColumn: "1 / -1" }}>
                  No campus opportunities posted by {userCompany} yet. Click "Post new opportunity" to publish your first role.
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Upper Right Company Profile Modal */}
      {showProfileModal && (
        <div className="overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "620px" }}>
            <button className="modal-close" onClick={() => setShowProfileModal(false)}>
              <X size={18} />
            </button>
            <form className="profile-page" onSubmit={saveCompanyProfile} style={{ margin: 0, padding: "26px", border: "none" }}>
              <div className="profile-hero">
                <div className="job-logo" style={{ background: companyProfile.color || "#e1e7ff", width: "52px", height: "52px", fontSize: "24px" }}>
                  {companyProfile.logo || "✺"}
                </div>
                <div>
                  <h2 style={{ fontSize: "20px" }}>{companyProfile.company || userCompany}</h2>
                  <p>{companyProfile.email} · {companyProfile.phone}</p>
                </div>
              </div>

              <div className="info-grid" style={{ margin: "18px 0" }}>
                <label>
                  Company Name
                  <input
                    value={companyProfile.company}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, company: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Official Recruiter Email
                  <input
                    type="email"
                    value={companyProfile.email}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, email: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Contact Phone Number
                  <input
                    value={companyProfile.phone}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, phone: e.target.value })}
                    placeholder="+91 80 1234 5678"
                  />
                </label>
                <label>
                  Corporate Office Location / Address
                  <input
                    value={companyProfile.address}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, address: e.target.value })}
                    placeholder="City, State"
                  />
                </label>
              </div>

              <div style={{ margin: "0 0 16px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#718092" }}>
                  Choose Company Logo Symbol (matching student section icon)
                </label>
                <div className="logo-picker-row">
                  {logoSymbols.map((sym) => (
                    <button
                      type="button"
                      key={sym}
                      className={`logo-picker-btn ${companyProfile.logo === sym ? "selected" : ""}`}
                      onClick={() => setCompanyProfile({ ...companyProfile, logo: sym })}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ margin: "0 0 20px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#718092" }}>
                  Company Description & Technology Focus
                  <textarea
                    rows={3}
                    style={{ width: "100%", marginTop: "6px", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit" }}
                    value={companyProfile.description}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, description: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" className="secondary" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </button>
                <button className="primary" type="submit">
                  <Check size={16} /> Save Company Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Opportunity Modal with dynamic upcoming date presets */}
      {showPublish && (
        <div className="overlay" onClick={() => setShowPublish(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "640px" }}>
            <button className="modal-close" onClick={() => setShowPublish(false)}>
              <X size={18} />
            </button>
            <form onSubmit={publishJob} style={{ padding: "26px" }}>
              <h2>Post Campus Opportunity</h2>
              <p className="muted" style={{ fontSize: "12px", margin: "0 0 16px" }}>
                Publishing as <b>{userCompany}</b>. Notifications will be targeted to eligible departments.
              </p>

              <div className="info-grid" style={{ margin: "0 0 14px" }}>
                <label>
                  Company Name
                  <input
                    value={userCompany}
                    readOnly
                    style={{ background: "#f8fafc" }}
                  />
                </label>
                <label>
                  Job Role / Title
                  <input
                    value={draft.role}
                    onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                    placeholder="e.g. AI Research Intern"
                    required
                  />
                </label>
                <label>
                  Opportunity Type
                  <select
                    value={draft.type}
                    onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time (Placement)</option>
                    <option value="Campus drive">Campus drive</option>
                  </select>
                </label>
                <label>
                  Duration / Internship Period
                  <input
                    value={draft.duration}
                    onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                    placeholder="e.g. 6 Months / 3 Months / Full-time"
                    required
                  />
                </label>
                <label>
                  Stipend / Salary
                  <input
                    value={draft.pay}
                    onChange={(e) => setDraft({ ...draft, pay: e.target.value })}
                    placeholder="e.g. INR 35,000 / month or 12 LPA"
                    required
                  />
                </label>
                <label>
                  Location
                  <input
                    value={draft.location}
                    onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                    placeholder="e.g. Bengaluru / Remote"
                  />
                </label>
                <div>
                  <label style={{ display: "block" }}>
                    Application Deadline
                    <input
                      type="date"
                      min={getTodayIso()}
                      value={draft.deadline}
                      onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
                      required
                    />
                  </label>
                  <div className="date-preset-row">
                    <button type="button" className="date-preset-btn" onClick={() => setDraft({ ...draft, deadline: getFutureDateIso(3) })}>+3 Days</button>
                    <button type="button" className="date-preset-btn" onClick={() => setDraft({ ...draft, deadline: getFutureDateIso(7) })}>+1 Wk</button>
                    <button type="button" className="date-preset-btn" onClick={() => setDraft({ ...draft, deadline: getFutureDateIso(14) })}>+2 Wks</button>
                    <button type="button" className="date-preset-btn" onClick={() => setDraft({ ...draft, deadline: getFutureDateIso(30) })}>+1 Mo</button>
                  </div>
                </div>
                <label>
                  Minimum CGPA Criteria
                  <input
                    value={draft.cgpa}
                    onChange={(e) => setDraft({ ...draft, cgpa: e.target.value })}
                    placeholder="e.g. 7.0+"
                  />
                </label>
                <label>
                  Required Skills (comma separated)
                  <input
                    value={draft.skills}
                    onChange={(e) => setDraft({ ...draft, skills: e.target.value })}
                    placeholder="e.g. React, Node.js, Python, AWS"
                    required
                  />
                </label>
              </div>

              <div style={{ margin: "0 0 14px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#718092" }}>
                  Eligible Departments (Notifications sent to these departments)
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "6px", fontSize: "12px" }}>
                  {["CSE", "IT", "AI-ML", "Data Science", "ECE", "Mechanical", "Civil"].map((dept) => {
                    const checked = draft.depts.includes(dept);
                    return (
                      <label key={dept} style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setDraft({
                              ...draft,
                              depts: checked ? draft.depts.filter((d) => d !== dept) : [...draft.depts, dept],
                            });
                          }}
                        />
                        {dept}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ margin: "0 0 16px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#718092" }}>
                  About the Role / Job Description
                  <textarea
                    rows={2}
                    style={{ width: "100%", marginTop: "6px", padding: "8px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit" }}
                    value={draft.about}
                    onChange={(e) => setDraft({ ...draft, about: e.target.value })}
                    placeholder="Brief description of project and candidate expectations..."
                  />
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" className="secondary" onClick={() => setShowPublish(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Publish to Eligible Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Opportunity Modal with dynamic upcoming date presets */}
      {editingJob && (
        <div className="overlay" onClick={() => setEditingJob(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "640px" }}>
            <button className="modal-close" onClick={() => setEditingJob(null)}>
              <X size={18} />
            </button>
            <form onSubmit={updateJob} style={{ padding: "26px" }}>
              <h2>Edit Opportunity: {editingJob.role}</h2>
              <p className="muted" style={{ fontSize: "12px", margin: "0 0 16px" }}>
                Changes will be saved and notified to students in eligible departments.
              </p>

              <div className="info-grid" style={{ margin: "0 0 14px" }}>
                <label>
                  Job Role
                  <input
                    value={editingJob.role}
                    onChange={(e) => setEditingJob({ ...editingJob, role: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Opportunity Type
                  <select
                    value={editingJob.type}
                    onChange={(e) => setEditingJob({ ...editingJob, type: e.target.value })}
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Campus drive">Campus drive</option>
                  </select>
                </label>
                <label>
                  Duration / Period
                  <input
                    value={editingJob.duration || "6 Months"}
                    onChange={(e) => setEditingJob({ ...editingJob, duration: e.target.value })}
                    placeholder="e.g. 6 Months / 3 Months"
                    required
                  />
                </label>
                <label>
                  Compensation / Stipend
                  <input
                    value={editingJob.pay}
                    onChange={(e) => setEditingJob({ ...editingJob, pay: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Location
                  <input
                    value={editingJob.location}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                  />
                </label>
                <div>
                  <label style={{ display: "block" }}>
                    Application Deadline
                    <input
                      type="date"
                      min={getTodayIso()}
                      value={editingJob.deadline}
                      onChange={(e) => setEditingJob({ ...editingJob, deadline: e.target.value })}
                      required
                    />
                  </label>
                  <div className="date-preset-row">
                    <button type="button" className="date-preset-btn" onClick={() => setEditingJob({ ...editingJob, deadline: getFutureDateIso(3) })}>+3 Days</button>
                    <button type="button" className="date-preset-btn" onClick={() => setEditingJob({ ...editingJob, deadline: getFutureDateIso(7) })}>+1 Wk</button>
                    <button type="button" className="date-preset-btn" onClick={() => setEditingJob({ ...editingJob, deadline: getFutureDateIso(14) })}>+2 Wks</button>
                    <button type="button" className="date-preset-btn" onClick={() => setEditingJob({ ...editingJob, deadline: getFutureDateIso(30) })}>+1 Mo</button>
                  </div>
                </div>
                <label>
                  Minimum CGPA
                  <input
                    value={editingJob.cgpa}
                    onChange={(e) => setEditingJob({ ...editingJob, cgpa: e.target.value })}
                  />
                </label>
                <label>
                  Required Skills (comma separated)
                  <input
                    value={typeof editingJob.tags === "string" ? editingJob.tags : editingJob.tags?.join(", ")}
                    onChange={(e) => setEditingJob({ ...editingJob, tags: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ margin: "0 0 14px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#718092" }}>
                  About the Role
                  <textarea
                    rows={2}
                    style={{ width: "100%", marginTop: "6px", padding: "8px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit" }}
                    value={editingJob.about}
                    onChange={(e) => setEditingJob({ ...editingJob, about: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" className="secondary" onClick={() => setEditingJob(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Save Changes & Notify Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Resume Viewer Modal for Recruiter */}
      {viewResumeModal && (
        <div className="overlay" onClick={() => setViewResumeModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "840px" }}>
            <button className="modal-close" onClick={() => setViewResumeModal(null)}>
              <X size={18} />
            </button>
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FileText size={24} color="#4f46e5" />
                  <div>
                    <h2 style={{ margin: 0, fontSize: "17px" }}>{viewResumeModal.studentName}'s Uploaded Resume (PDF)</h2>
                    <small style={{ color: "var(--muted)" }}>
                      Submitted for {viewResumeModal.role} ({userCompany})
                    </small>
                  </div>
                </div>
                {viewResumeModal.resumeData && (
                  <a
                    className="primary"
                    href={viewResumeModal.resumeData}
                    download={viewResumeModal.resumeName || `${viewResumeModal.studentName}_Resume.pdf`}
                    style={{ fontSize: "12.5px", padding: "7px 16px", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
                  >
                    <Download size={14} /> Download PDF Resume
                  </a>
                )}
              </div>

              {/* Exact PDF Viewer */}
              {viewResumeModal.resumeData ? (
                <div style={{ background: "#f8fafc", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--line)" }}>
                  <object
                    data={`${viewResumeModal.resumeData}#view=FitH`}
                    type="application/pdf"
                    style={{ width: "100%", height: "560px", border: "none" }}
                  >
                    <iframe
                      src={viewResumeModal.resumeData}
                      title="Applicant Submitted Resume PDF"
                      style={{ width: "100%", height: "560px", border: "none" }}
                    />
                  </object>
                </div>
              ) : (
                <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "10px", padding: "24px", maxHeight: "500px", overflow: "auto", whiteSpace: "pre-wrap", fontSize: "13px", lineHeight: "1.7", color: "#1e293b", fontFamily: "inherit" }}>
                  <div style={{ borderBottom: "2px solid #0f172a", paddingBottom: "12px", marginBottom: "16px" }}>
                    <h1 style={{ margin: "0 0 4px", fontSize: "20px" }}>{viewResumeModal.studentName}</h1>
                    <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                      Email: {viewResumeModal.studentEmail} | Phone: {viewResumeModal.phone || "9876543210"} | Department: {viewResumeModal.department || "Computer Science"}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                      {viewResumeModal.collegeName || "Apex Institute of Technology"} · CGPA: {viewResumeModal.cgpa || "8.2"}
                    </p>
                  </div>
                  {viewResumeModal.resumeContent || "Technical competencies in React, Node.js, Python, SQL, Cloud Systems, and Machine Learning."}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <button className="secondary" onClick={() => setViewResumeModal(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compose & Send Email Modal */}
      {emailModal && (
        <div className="overlay" onClick={() => setEmailModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <button className="modal-close" onClick={() => setEmailModal(null)}>
              <X size={18} />
            </button>
            <form onSubmit={sendCandidateEmail} style={{ padding: "26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Mail size={20} color="#4f46e5" />
                <h2 style={{ margin: 0, fontSize: "17px" }}>Email Candidate: {emailModal.studentName}</h2>
              </div>
              <p className="muted" style={{ fontSize: "12px", margin: "0 0 16px" }}>
                Recipient: <b>{emailModal.studentEmail}</b> (Applied for {emailModal.role})
              </p>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#718092" }}>
                  Quick Templates
                </label>
                <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="chip"
                    onClick={() => {
                      setEmailSubject(`Interview Shortlist for ${emailModal.role} at ${userCompany}`);
                      setEmailBody(`Dear ${emailModal.studentName},\n\nWe are pleased to inform you that your application for ${emailModal.role} has been shortlisted by ${userCompany}. We would like to schedule a technical interview.\n\nPlease reply with your availability.\n\nBest,\nRecruitment Team\n${userCompany}`);
                    }}
                  >
                    Interview Shortlist
                  </button>
                  <button
                    type="button"
                    className="chip"
                    onClick={() => {
                      setEmailSubject(`Offer Discussion - ${emailModal.role} at ${userCompany}`);
                      setEmailBody(`Dear ${emailModal.studentName},\n\nCongratulations! The recruitment team at ${userCompany} is delighted to proceed with an offer for the ${emailModal.role} position.\n\nWe look forward to having you onboard.\n\nBest,\n${userCompany}`);
                    }}
                  >
                    Offer Discussion
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#718092" }}>
                  Subject Line
                  <input
                    style={{ width: "100%", marginTop: "4px", padding: "9px", borderRadius: "8px", border: "1px solid var(--line)", font: "inherit" }}
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    required
                  />
                </label>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#718092" }}>
                  Message Body
                  <textarea
                    rows={6}
                    style={{ width: "100%", marginTop: "4px", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", font: "inherit", lineHeight: "1.5" }}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px" }}>
                <a
                  className="text-btn"
                  style={{ fontSize: "12px" }}
                  href={`mailto:${emailModal.studentEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                >
                  Open in Mail Client <ArrowUpRight size={13} />
                </a>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="button" className="secondary" onClick={() => setEmailModal(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary">
                    <Send size={14} /> Send Email
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {notice && <div className="toast"><Check size={16} />{notice}</div>}
    </div>
  );
}

// ----------------------------------------------------
// 13. INSTITUTE WORKSPACE (FORMERLY PLACEMENT CELL)
// ----------------------------------------------------
function PlacementWorkspaceV2({ user, logout }) {
  const [page, setPage] = useState("overview");
  const [students] = useState(() => readStored(studentDirectoryKey, []));
  const [applications] = useState(() => readStored(studentApplicationsKey, []));
  const [published] = useState(() => readStored(publishedOpportunitiesKey, []));
  const [selectedDriveModal, setSelectedDriveModal] = useState(null);
  const [emailModal, setEmailModal] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [notice, setNotice] = useState("");

  // Institute College Name configuration with logo-first hover & click reveal
  const [collegeName, setCollegeName] = useState(() => localStorage.getItem("oncampus-institute-college-name") || user.collegeName || "Apex Institute of Technology");
  const [isEditingCollege, setIsEditingCollege] = useState(false);
  const [collegeNameDraft, setCollegeNameDraft] = useState(collegeName);
  const [isRevealed, setIsRevealed] = useState(false);

  const drives = [...initialJobs, ...published];

  // Dynamic Placement Rate based on actual selected placements
  const totalRegistered = students.length || 1;
  const selectedStudents = new Set(
    applications
      .filter((a) => (a.status || "").toLowerCase().includes("select"))
      .map((a) => a.studentEmail || a.studentName)
  );
  const placementRate = Math.min(100, Math.round((selectedStudents.size / totalRegistered) * 100));

  const toast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2600);
  };

  const openInstituteEmail = (app) => {
    setEmailModal(app);
    setEmailSubject(`Campus Placement Coordination - ${app.company} (${app.role})`);
    setEmailBody(`Dear ${app.studentName},\n\nThis is from the Institute Placement Cell regarding your application for ${app.role} at ${app.company}.\n\nPlease ensure your verified credentials and documentation are up to date for the upcoming campus recruitment schedule.\n\nWarm regards,\nTraining & Placement Cell\n${collegeName}`);
  };

  const sendInstituteEmail = (e) => {
    e.preventDefault();
    if (!emailModal) return;

    const studentNotifs = readStored(studentNotificationsKey, sampleNotifications);
    const newNotif = {
      id: Date.now(),
      title: `✉️ Institute Placement Notice`,
      desc: `${emailSubject} · "${emailBody.slice(0, 60)}..."`,
      time: "Just now",
    };
    localStorage.setItem(studentNotificationsKey, JSON.stringify([newNotif, ...studentNotifs]));

    toast(`✓ Email dispatched to ${emailModal.studentName}!`);
    setEmailModal(null);
  };

  const saveCollegeName = (e) => {
    e.preventDefault();
    if (!collegeNameDraft.trim()) return;
    setCollegeName(collegeNameDraft.trim());
    localStorage.setItem("oncampus-institute-college-name", collegeNameDraft.trim());
    setIsEditingCollege(false);
    toast("✓ College name updated successfully!");
  };

  const getStatusClass = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("shortlist")) return "status shortlisted";
    if (s.includes("interview")) return "status interview";
    if (s.includes("select")) return "status selected";
    if (s.includes("reject")) return "status rejected";
    if (s.includes("review")) return "status review";
    return "status submitted";
  };

  const navLinks = [
    ["overview", "Dashboard", LayoutDashboard],
    ["students", "Student records", Users],
    ["drives", "Campus drives", BriefcaseBusiness],
  ];

  return (
    <div className="app placement-app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">⌂</span>
          <span>campusly</span>
        </div>
        <nav>
          {navLinks.map(([id, label, Icon]) => (
            <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)}>
              <Icon size={18} />
              <span>{label}</span>
              {id === "students" && <b>{students.length}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={logout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main>
        <header>
          <div className="mobile-brand">⌂ campusly</div>
          <div className="header-actions">
            <span className="role-badge">Institute</span>

            {/* Top Right College Name Emblem: Logo first, hover or click reveals name */}
            <div
              className={`institute-college-badge ${isRevealed ? "revealed" : ""}`}
              onMouseEnter={() => setIsRevealed(true)}
              onMouseLeave={() => setIsRevealed(false)}
              onClick={() => {
                setCollegeNameDraft(collegeName);
                setIsEditingCollege(true);
              }}
              title="Click to edit / update College Name"
            >
              <div className="institute-logo-icon">🏛️</div>
              <span className="institute-college-name-text">{collegeName}</span>
              <Edit size={12} className="institute-edit-icon" />
            </div>
          </div>
        </header>

        {page === "overview" && (
          <>
            <section className="welcome">
              <div>
                <h1>Good morning, {user.name}</h1>
                <p className="muted">
                  Monitoring student registrations, applied candidate roles, and recruitment drive outcomes for <b>{collegeName}</b>.
                </p>
              </div>
            </section>

            <section className="placement-stats">
              <article>
                <Users size={22} />
                <strong>{students.length || 148}</strong>
                <span>Registered students</span>
              </article>
              <article>
                <ClipboardCheck size={22} />
                <strong>{applications.length || 42}</strong>
                <span>Applications received</span>
              </article>
              <article>
                <BriefcaseBusiness size={22} />
                <strong>{drives.length}</strong>
                <span>Active campus drives</span>
              </article>
              <article>
                <TrendingUp size={22} />
                <strong>{placementRate}%</strong>
                <span>Placement rate ({selectedStudents.size} Placed)</span>
              </article>
            </section>
          </>
        )}

        {page === "students" && (
          <section className="page-space">
            <h1>Student Records</h1>
            <p className="muted page-copy">Directory of registered students and their submitted application roles.</p>
            <div className="placement-table">
              <div style={{ gridTemplateColumns: "1.2fr 1fr 1.2fr 1.4fr" }}>
                <strong>Student</strong>
                <strong>Department</strong>
                <strong>Applied Role</strong>
                <strong>Status / Company</strong>
              </div>
              {students.map((s) => {
                const app = applications.find((a) => a.studentEmail?.toLowerCase() === s.email?.toLowerCase());
                return (
                  <div key={s.email} style={{ gridTemplateColumns: "1.2fr 1fr 1.2fr 1.4fr" }}>
                    <span><b>{s.name}</b></span>
                    <span>{s.department || "Computer Science"}</span>
                    <span>{app ? <b>{app.role}</b> : <em style={{ color: "#94a3b8" }}>No Application</em>}</span>
                    <span>{app ? `${app.status || "Submitted"}: ${app.company}` : "Profile Verified"}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {page === "drives" && (
          <section className="page-space">
            <div className="section-head">
              <div>
                <h1>Manage Recruitment Drives</h1>
                <p className="muted page-copy">Click on any company card below to view applicant details, application status, and dispatch direct emails.</p>
              </div>
            </div>
            <div className="placement-cards">
              {drives.map((j) => {
                const compApps = applications.filter((a) => {
                  const aComp = (a.company || "").toLowerCase().trim();
                  const jComp = (j.company || "").toLowerCase().trim();
                  return aComp === jComp || aComp.includes(jComp) || jComp.includes(aComp);
                });

                return (
                  <article key={j.id} onClick={() => setSelectedDriveModal({ drive: j, applicants: compApps })}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span className="job-logo" style={{ background: j.color || "#e8ebff" }}>{j.logo}</span>
                      <span className="pill pale">{compApps.length} Applicants</span>
                    </div>
                    <h2>{j.company}</h2>
                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#475569" }}><b>{j.role}</b></p>
                    <small style={{ color: "var(--muted)" }}>Deadline: {j.deadline}</small>
                    <div style={{ marginTop: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="text-btn" style={{ fontSize: "11.5px" }}>View Applicants →</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* College Name Edit Modal */}
      {isEditingCollege && (
        <div className="overlay" onClick={() => setIsEditingCollege(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "460px" }}>
            <button className="modal-close" onClick={() => setIsEditingCollege(false)}>
              <X size={18} />
            </button>
            <form onSubmit={saveCollegeName} style={{ padding: "26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "24px" }}>🏛️</span>
                <h2 style={{ margin: 0, fontSize: "18px" }}>Institute / College Profile</h2>
              </div>
              <p className="muted" style={{ fontSize: "12px", margin: "0 0 16px" }}>
                Add or edit your college / institutional name.
              </p>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                College / University Name
                <input
                  value={collegeNameDraft}
                  onChange={(e) => setCollegeNameDraft(e.target.value)}
                  placeholder="e.g. Apex Institute of Technology"
                  required
                  style={{ marginTop: "6px", width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }}
                />
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px" }}>
                <button type="button" className="secondary" onClick={() => setIsEditingCollege(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Save College Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Drive Applicants Modal */}
      {selectedDriveModal && (
        <div className="overlay" onClick={() => setSelectedDriveModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "760px" }}>
            <button className="modal-close" onClick={() => setSelectedDriveModal(null)}>
              <X size={18} />
            </button>
            <div style={{ padding: "26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "14px" }}>
                <span className="job-logo" style={{ background: selectedDriveModal.drive.color || "#e8ebff", width: 40, height: 40, fontSize: 18 }}>
                  {selectedDriveModal.drive.logo}
                </span>
                <div>
                  <h2 style={{ margin: 0, fontSize: "19px" }}>{selectedDriveModal.drive.company} · Applicants</h2>
                  <small style={{ color: "var(--muted)" }}>
                    Role: {selectedDriveModal.drive.role} · Deadline: {selectedDriveModal.drive.deadline}
                  </small>
                </div>
              </div>

              <div style={{ maxHeight: "420px", overflow: "auto" }}>
                {selectedDriveModal.applicants.length ? (
                  <div style={{ display: "grid", gap: "12px" }}>
                    {selectedDriveModal.applicants.map((app, idx) => (
                      <div
                        key={app.id || idx}
                        style={{
                          background: "#f8fafc",
                          border: "1px solid var(--line)",
                          borderRadius: "10px",
                          padding: "14px 16px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "14px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: "220px" }}>
                          <h4 style={{ margin: "0 0 2px", fontSize: "14px", color: "#0f172a" }}>{app.studentName}</h4>
                          <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#475569" }}>
                            Applied Role: <b>{app.role}</b> · {app.department || "Computer Science"}
                          </p>
                          <small style={{ color: "#64748b", fontSize: "11px" }}>
                            Email: {app.studentEmail} {app.phone ? `· Phone: ${app.phone}` : ""}
                          </small>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span className={getStatusClass(app.status)}>
                            {app.status || "Submitted"}
                          </span>
                          <button
                            className="action-btn email-btn"
                            style={{ padding: "6px 12px", fontSize: "11.5px" }}
                            onClick={() => openInstituteEmail(app)}
                          >
                            <Mail size={13} /> Email
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "36px 16px", textAlign: "center", color: "var(--muted)", background: "#f8fafc", borderRadius: "10px" }}>
                    No students have applied to {selectedDriveModal.drive.company} yet.
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "18px" }}>
                <button className="secondary" onClick={() => setSelectedDriveModal(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Institute Compose Email Modal */}
      {emailModal && (
        <div className="overlay" onClick={() => setEmailModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <button className="modal-close" onClick={() => setEmailModal(null)}>
              <X size={18} />
            </button>
            <form onSubmit={sendInstituteEmail} style={{ padding: "26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Mail size={20} color="#4f46e5" />
                <h2 style={{ margin: 0, fontSize: "17px" }}>Email Student: {emailModal.studentName}</h2>
              </div>
              <p className="muted" style={{ fontSize: "12px", margin: "0 0 16px" }}>
                Recipient: <b>{emailModal.studentEmail}</b> (Applied for {emailModal.role} at {emailModal.company})
              </p>

              <div style={{ display: "grid", gap: "12px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#718092" }}>
                  Subject Line
                  <input
                    style={{ width: "100%", marginTop: "4px", padding: "9px", borderRadius: "8px", border: "1px solid var(--line)", font: "inherit" }}
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    required
                  />
                </label>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#718092" }}>
                  Message Body
                  <textarea
                    rows={6}
                    style={{ width: "100%", marginTop: "4px", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", font: "inherit", lineHeight: "1.5" }}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px" }}>
                <a
                  className="text-btn"
                  style={{ fontSize: "12px" }}
                  href={`mailto:${emailModal.studentEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                >
                  Open in Mail Client <ArrowUpRight size={13} />
                </a>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="button" className="secondary" onClick={() => setEmailModal(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary">
                    <Send size={14} /> Send Email
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {notice && <div className="toast"><Check size={16} />{notice}</div>}
    </div>
  );
}

// ----------------------------------------------------
// 14. ROOT & LOGIN PAGE
// ----------------------------------------------------
function Root() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("oncampus-session") || "null");
    } catch {
      return null;
    }
  });

  const finishLogin = (account) => {
    sessionStorage.setItem("oncampus-session", JSON.stringify(account));
    setUser(account);
  };

  const logout = () => {
    sessionStorage.removeItem("oncampus-session");
    setUser(null);
  };

  if (!user) return <LoginPage login={finishLogin} />;

  switch (user.role) {
    case "Academician":
      return <AcademicianApp user={user} logout={logout} />;
    case "Industry":
      return <IndustryApp user={user} logout={logout} />;
    case "Institute":
    case "Placement Cell":
      return <PlacementWorkspaceV2 user={user} logout={logout} />;
    case "Student":
    default:
      return <App user={user} logout={logout} />;
  }
}

function LoginPage({ login }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("Student");
  const [name, setName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [avatar, setAvatar] = useState("🎓");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must contain at least 6 characters.");
    if (mode === "register" && name.trim().length < 2) return setError(role === "Industry" ? "Enter your company name." : "Enter your full name.");

    const normalizedEmail = email.trim().toLowerCase();
    if (mode === "register") {
      const accounts = readStored(registeredUsersKey, []);
      const existingAccount = accounts.find((item) => item.email === normalizedEmail && item.role === role);
      if (existingAccount) return setError(`An ${role} account already exists with this email. Please sign in.`);

      const account = { name: name.trim(), email: normalizedEmail, password, role, avatar, admissionNumber };
      localStorage.setItem(registeredUsersKey, JSON.stringify([...accounts, account]));
      if (role === "Student") {
        const studentProfile = { ...defaultStudentProfile(account), admissionNumber: admissionNumber.trim() };
        localStorage.setItem(profileKey(account.email), JSON.stringify(studentProfile));
        updateStudentDirectory(account, studentProfile);
      }
      return login(account);
    }

    const account = readStored(registeredUsersKey, []).find((item) => item.email === normalizedEmail && item.role === role);
    if (!account) return setError("You are not registered. Create your account to continue.");
    if (account.password !== password) return setError("Incorrect password. Please try again.");
    login(account);
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="oncampus-logo">
          <span>⌂</span>OnCampus
        </div>
        <div className="auth-copy">
          <span className="pill pale">ACADEMIA - INDUSTRY COLLABORATION</span>
          <h1>
            Connect talent,
            <br />
            <i>skills & industry.</i>
          </h1>
          <p>
            Unified portal for Students, Academicians, Institutes, and Industry Partners.
          </p>
          <div className="auth-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="auth-orbs" />
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <div className="oncampus-logo mobile-logo">
            <span>⌂</span>OnCampus
          </div>
          <h2>{mode === "login" ? "Sign in to OnCampus" : "Create your account"}</h2>
          <p className="muted">
            {mode === "login"
              ? "Welcome back. Choose your role to enter your portal."
              : "Set up your account to discover opportunities."}
          </p>

          <form onSubmit={submit}>
            {/* Roles ordered: Student, Academician, Institute, Industry */}
            <div className="role-tabs">
              {["Student", "Academician", "Institute", "Industry"].map((r) => (
                <button
                  type="button"
                  key={r}
                  className={role === r ? "chosen-role" : ""}
                  onClick={() => setRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            {mode === "register" && (
              <>
                <label>
                  {role === "Industry" ? "Company / Organization name" : role === "Institute" ? "Institute / College Name" : "Full name"}
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "Industry" ? "e.g. Nexora AI / Google" : role === "Institute" ? "e.g. Apex Institute of Technology" : "Your full name"}
                    required
                  />
                </label>
                {role === "Student" && (
                  <label>
                    Admission number
                    <input
                      value={admissionNumber}
                      onChange={(e) => setAdmissionNumber(e.target.value)}
                      placeholder="e.g. 2023CSB1042"
                      required
                    />
                  </label>
                )}
              </>
            )}

            <label>
              {role === "Institute" || role === "Placement Cell"
                ? "Official institute email"
                : role === "Academician"
                ? "Faculty institutional email"
                : role === "Industry"
                ? "Corporate work email"
                : "College email"}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength="6"
                required
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <button className="primary auth-submit" type="submit">
              {mode === "login" ? `Sign in as ${role}` : `Create ${role} account`}{" "}
              <ArrowUpRight size={17} />
            </button>
          </form>

          <p className="switch-auth">
            {mode === "login" ? "New to OnCampus?" : "Already have an account?"}
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<Root />);
}

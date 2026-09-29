import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BriefcaseBusiness,
  Building2, CalendarDays, Check, CheckCheck, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, ClipboardCheck, Download, FileBarChart2,
  Filter, GraduationCap, HandCoins, HeartHandshake, LayoutDashboard, LogOut,
  Menu, MoreHorizontal, Plus, Search, Settings2, ShieldCheck, Sparkles, Upload,
  Target, TrendingDown, TrendingUp, UserRound, Users, WalletCards, X, Award,
} from "lucide-react";
import "./outcomes.css";
import "./employer.css";
import "./trainee.css";
import "./ui-polish.css";
import "./responsive.css";
import {
  TraineeProfileModal,
  TraineeNotificationDropdown,
  TraineeOverview,
  TraineeTrainingCertificates,
  TraineeEmploymentStatus,
  TraineeSalaryTracker,
  TraineeJobHistory,
  TraineeRecommendedSkills,
  TraineeHelpSupport,
  defaultTraineeProfile,
  defaultEmploymentRecord,
  defaultTrainingList,
  defaultCertificates,
  defaultSalaryHistory,
  defaultTraineeNotifications,
} from "./components/TraineePortal";

const trainees = [
  { id: "SK-24018", name: "Aarav Mehta", initials: "AM", city: "Pune, Maharashtra", district: "Pune", course: "Solar PV Installation", provider: "Udaan Skills Centre", trained: "12 Feb 2025", employer: "SunGrid Energy", role: "Solar Technician", wage: 18500, status: "Employed", followup: "Due today", consent: true, gender: "Male", age: 23, phone: "+91 98765 43421", verified: true, retention: "8 months", change: 18 },
  { id: "SK-24027", name: "Priya Nair", initials: "PN", city: "Kochi, Kerala", district: "Ernakulam", course: "Healthcare Assistant", provider: "Saksham Foundation", trained: "04 Mar 2025", employer: "Aster Medcity", role: "Patient Care Assistant", wage: 21000, status: "Employed", followup: "In 3 days", consent: true, gender: "Female", age: 25, phone: "+91 97654 32856", verified: true, retention: "6 months", change: 12 },
  { id: "SK-24033", name: "Imran Khan", initials: "IK", city: "Jaipur, Rajasthan", district: "Jaipur", course: "Retail Sales Associate", provider: "Kaushal Pragati", trained: "19 Jan 2025", employer: "", role: "", wage: 0, status: "Seeking work", followup: "Overdue", consent: true, gender: "Male", age: 21, phone: "+91 99876 54037", verified: false, retention: "-", change: 0 },
  { id: "SK-24041", name: "Kavya Reddy", initials: "KR", city: "Hyderabad, Telangana", district: "Hyderabad", course: "Data Entry & Office Tools", provider: "Nirmaan Trust", trained: "27 Feb 2025", employer: "Self-employed", role: "Freelance Data Operator", wage: 24000, status: "Self-employed", followup: "In 12 days", consent: true, gender: "Female", age: 24, phone: "+91 96543 21512", verified: true, retention: "7 months", change: 32 },
  { id: "SK-24056", name: "Sanjay Das", initials: "SD", city: "Kolkata, West Bengal", district: "Kolkata", course: "Electric Vehicle Service", provider: "Udaan Skills Centre", trained: "10 Apr 2025", employer: "Volt Motors", role: "Service Apprentice", wage: 16000, status: "Apprentice", followup: "Due today", consent: true, gender: "Male", age: 22, phone: "+91 90123 45194", verified: false, retention: "4 months", change: 9 },
  { id: "SK-24063", name: "Meena Kumari", initials: "MK", city: "Patna, Bihar", district: "Patna", course: "Healthcare Assistant", provider: "Saksham Foundation", trained: "15 Mar 2025", employer: "CareWell Clinic", role: "Care Assistant", wage: 17500, status: "Employed", followup: "Completed", consent: true, gender: "Female", age: 27, phone: "+91 91234 56668", verified: true, retention: "5 months", change: 15 },
  { id: "SK-24072", name: "Neha Kulkarni", initials: "NK", city: "Pune, Maharashtra", district: "Pune", course: "Solar PV Installation", provider: "Udaan Skills Centre", trained: "22 May 2025", employer: "SunGrid Energy", role: "Solar Installation Associate", wage: 22000, status: "Employed", followup: "In 5 days", consent: true, gender: "Female", age: 24, phone: "+91 98230 44716", verified: true, retention: "9 months", change: 19, skills: ["Solar panel installation", "Electrical safety", "Site assessment", "Customer handover"], demoRecord: true },
  { id: "SK-24081", name: "Ritesh Yadav", initials: "RY", city: "Jaipur, Rajasthan", district: "Jaipur", course: "Electric Vehicle Service", provider: "Udaan Skills Centre", trained: "09 Jun 2025", employer: "SunGrid Energy", role: "EV Service Technician", wage: 20500, status: "Employed", followup: "Due today", consent: true, gender: "Male", age: 26, phone: "+91 98291 33608", verified: false, retention: "6 months", change: 14, skills: ["Battery diagnostics", "Electrical safety", "Fault diagnosis", "Digital maintenance logs"], demoRecord: true },
  { id: "SK-24094", name: "Farah Siddiqui", initials: "FS", city: "Hyderabad, Telangana", district: "Hyderabad", course: "Data Entry & Office Tools", provider: "Nirmaan Trust", trained: "17 Jul 2025", employer: "SunGrid Energy", role: "Operations Coordinator", wage: 23000, status: "Employed", followup: "In 8 days", consent: true, gender: "Female", age: 25, phone: "+91 98490 76214", verified: true, retention: "4 months", change: 11, skills: ["Spreadsheet reporting", "Digital maintenance logs", "Customer handover"], demoRecord: true },
  { id: "SK-24102", name: "Dev Patel", initials: "DP", city: "Ahmedabad, Gujarat", district: "Ahmedabad", course: "Solar PV Installation", provider: "Udaan Skills Centre", trained: "02 Aug 2025", employer: "SunGrid Energy", role: "Solar Technician", wage: 19000, status: "Apprentice", followup: "Overdue", consent: true, gender: "Male", age: 22, phone: "+91 98790 55482", verified: false, retention: "2 months", change: 8, skills: ["Solar panel installation", "Electrical safety"], demoRecord: true },
];

// Keep the employer workspace populated in prototype/demo mode even when its API
// returns no workforce records yet. These sample rows also drive every employer
// section from the same record set.
function employerDemoKey(email, kind) {
  return `kaaryaEmployerDemo:${String(email || "company").trim().toLowerCase()}:${kind}`;
}

function readEmployerDemoData(email, kind, fallback) {
  try { return JSON.parse(localStorage.getItem(employerDemoKey(email, kind)) || "null") ?? fallback; } catch { return fallback; }
}

function withEmployerDemoRecords(records, companyName, email) {
  const templates = trainees.slice(-4);
  const stored = readEmployerDemoData(email, "records", []);
  const storedById = new Map(stored.map((person) => [person.id, person]));
  const templatesById = new Map(templates.map((person) => [person.id, person]));
  const demoIds = new Set(templates.map((person) => person.id));
  const workspaceRecords = records.map((person) => {
    if (!demoIds.has(person.id)) return person;
    return { ...templatesById.get(person.id), ...person, ...storedById.get(person.id), employer: companyName || person.employer, demoRecord: true };
  });
  const existingIds = new Set(workspaceRecords.map((person) => person.id));
  const demoRecords = templates.filter((person) => !existingIds.has(person.id)).map((person) => ({
    ...person,
    ...(storedById.get(person.id) || {}),
    employer: companyName || person.employer || "SunGrid Energy",
    demoRecord: true,
  }));
  return [...workspaceRecords, ...demoRecords];
}

const portalDetails = {
  "Government / Admin": { workspace: "National Skills Mission", initials: "NS", name: "Ananya Sharma", accountRole: "Programme admin" },
  Employer: { workspace: "SunGrid Energy", initials: "SG", name: "Rohan Desai", accountRole: "People operations" },
  "Training Provider": { workspace: "Udaan Skills Centre", initials: "UC", name: "Farah Khan", accountRole: "Provider administrator" },
  Trainee: { workspace: "My skilling journey", initials: "AM", name: "Aarav Mehta", accountRole: "Trainee" },
};

const apiRoleForPortal = {
  "Government / Admin": "PLACEMENT_CELL",
  Employer: "INDUSTRY",
  "Training Provider": "INSTITUTION",
  Trainee: "STUDENT",
};

const portalForApiRole = Object.fromEntries(Object.entries(apiRoleForPortal).map(([portal, apiRole]) => [apiRole, portal]));
// In production, call the API on this deployment's origin. The localhost
// fallback is only useful when running the frontend with Vite locally.
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4000" : "");

async function apiRequest(path, token, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body,
    });
  } catch {
    throw new Error("The outcomes service is unavailable. Start the API server and try again.");
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === false) throw new Error(result.error?.message || "The request could not be completed.");
  return result.data;
}

function normalizeFollowUp(item) {
  const scheduled = new Date(item.due);
  const now = new Date();
  const state = item.state === "COMPLETED" ? "Completed" : item.state === "CANCELLED" ? "Cancelled" : scheduled < now ? "Overdue" : scheduled.toDateString() === now.toDateString() ? "Due today" : "Scheduled";
  return { ...item, due: scheduled.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }), state };
}

function exportCsv(filename, rows) {
  if (!rows.length) return false;
  const columns = Object.keys(rows[0]);
  const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const content = [columns, ...rows.map((row) => columns.map((column) => row[column]))].map((row) => row.map(escapeCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

const portalNavGroups = {
  "Government / Admin": [
    { label: "", items: [["Overview", LayoutDashboard], ["Trainees", Users], ["Training", GraduationCap], ["Employment", BriefcaseBusiness], ["Skill Gap", Sparkles], ["Analytics & Insights", FileBarChart2]] },
  ],
  Employer: [
    { label: "", items: [
      ["Overview", LayoutDashboard],
      ["Employees / Trainees", Users],
      ["Employment Verification", ShieldCheck],
      ["Salary & Employment", WalletCards],
      ["Skills & Job Requirements", Sparkles],
      ["Reports", FileBarChart2],
    ] },
  ],
  "Training Provider": [
    { label: "Institute", items: [["Overview", LayoutDashboard], ["Courses", GraduationCap], ["Trainees", Users], ["Outcomes", BriefcaseBusiness], ["Skill Gap", Sparkles]] },
    { label: "Reporting", items: [["Reports & Analytics", FileBarChart2]] },
  ],
  Trainee: [
    { label: "", items: [["Overview", LayoutDashboard], ["Training & Certificates", GraduationCap], ["Employment Status", BriefcaseBusiness], ["Salary Progress", TrendingUp], ["Job History", Activity], ["Recommended Skills", Sparkles]] },
  ],
};

const employerNavTargets = {
  Overview: "Overview",
  "Employees / Trainees": "Employees",
  "Employment Verification": "Verification",
  "Salary & Employment": "Salary & Retention",
  "Skills & Job Requirements": "Skill-wise Hiring",
  Reports: "Reports",
};

const portalPageCopy = {
  "Government / Admin": {
    Overview: ["Welcome", "Here is what is happening across your skilling cohorts."], Trainees: ["Trainees", "A consent-first view of every learner, from training through livelihood."], Training: ["Training programmes", "Compare course completion, certification, and employment outcomes."], Employment: ["Employment tracking", "Follow placement, self-employment, and retention signals over time."], "Skill Gap": ["Skill gap analysis", "Compare skills taught with skills employers are asking for."], "Analytics & Insights": ["Analytics & insights", "Explore verified outcomes and practical programme signals."], "Officer Profile": ["Officer profile", "Your government workspace profile details."], Analytics: ["Outcome analytics", "Explore verified outcomes across cohorts, courses, and districts."], Insights: ["Signals & insights", "Turn outcome patterns into practical next steps for your teams."], Settings: ["Workspace settings", "Manage access, privacy, and shared programme definitions."],
  },
  Employer: {
    Overview: ["Welcome", "A clear view of your hires, verifications, and workforce outcomes."], Notifications: ["Notifications", "Review employment requests, verification updates, and account activity."], Employees: ["Employees / trainees", "People hired through skilling programmes and their current employment details."], "Employment History": ["Employment history", "Review employee roles, joining details, and reported changes over time."], Verification: ["Employment verification", "Confirm hiring details and keep employment records current."], "Verification History": ["Verification history", "Review employer confirmations and pending employment detail updates."], "Salary & Retention": ["Salary & employment", "Track wage progression, role continuity, and employee milestones."], "Employee Progress": ["Employee progress", "Review employee milestones, retention, and changes in role over time."], Reports: ["Reports", "Hiring, retention, and workforce outcomes for your company."], "Skill-wise Hiring": ["Skills & job requirements", "See which skills are represented across your hires."], "Retention Reports": ["Retention reports", "Track workforce continuity and retention milestones."], "Employment Reports": ["Employment reports", "Review employment status, joining dates, and workforce outcomes."], "Company Profile": ["Company profile", "Manage your organisation details and employer record."], "Contact Details": ["Contact details", "Manage the authorised point of contact for this workspace."], "Account Settings": ["Account settings", "Manage your account and sign-in details."], "Privacy / Permissions": ["Privacy & permissions", "Manage what employment information your team can access and confirm."], "Help & Support": ["Help & support", "Get help with employee records, verifications, and your company workspace."],
  },
  "Training Provider": {
    Overview: ["Welcome", "Track learner progress from attendance through long-term employment."], Courses: ["Courses", "Your active courses, skills covered, certification, and learner outcomes."], Trainees: ["Trainees", "Learner records, assessment progress, and consent-aware follow-ups."], Outcomes: ["Course outcomes", "Placement, retention, and salary outcomes across your programmes."], "Skill Gap": ["Skill gap analysis", "Compare skills taught with skills employers are asking for."], "Reports & Analytics": ["Reports & analytics", "Course, batch, placement, and district-level performance."], Settings: ["Institute profile", "Manage institute details, contacts, and account preferences."],
  },
  Trainee: {
    Overview: ["Welcome", "Your training, employment, and career progress at a glance."], "Training & Certificates": ["Training & Certificates", "Your courses, providers, assessments, and certificates."], "Employment Status": ["Employment Status", "Keep your current work status and details up to date."], "Salary Progress": ["Salary Progress", "Track your salary changes over time."], "Job History": ["Job History", "Review your work and training milestones."], "Recommended Skills": ["Recommended Skills", "Skills to strengthen for your next opportunity."], "Help & Support": ["Help & Support", "Contacts and answers to common questions."],
  },
};

const money = (value) => `INR ${Number(value).toLocaleString("en-IN")}`;

const readStoredObject = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || "null"); }
  catch { return null; }
};

const traineeAccountKey = (key, email) => `${key}:${String(email || "").trim().toLowerCase()}`;

function readTraineeAccountValue(key, user, fallback) {
  const email = String(user?.email || "").trim().toLowerCase();
  if (email) {
    const scoped = readStoredObject(traineeAccountKey(key, email));
    if (scoped !== null) return scoped;
    const legacyProfile = readStoredObject("kaaryaTraineeProfile");
    if (legacyProfile?.email?.trim().toLowerCase() === email) {
      const legacyValue = readStoredObject(key);
      if (legacyValue !== null) return legacyValue;
    }
    return fallback;
  }
  return readStoredObject(key) ?? fallback;
}

function hasTraineeAccountValue(key, user) {
  const email = String(user?.email || "").trim().toLowerCase();
  if (!email) return localStorage.getItem(key) !== null;
  if (localStorage.getItem(traineeAccountKey(key, email)) !== null) return true;
  const legacyProfile = readStoredObject("kaaryaTraineeProfile");
  return legacyProfile?.email?.trim().toLowerCase() === email && localStorage.getItem(key) !== null;
}

function saveTraineeAccountValue(key, email, value) {
  const serialized = JSON.stringify(value);
  localStorage.setItem(key, serialized);
  if (email) localStorage.setItem(traineeAccountKey(key, email), serialized);
}

function employerProfileForUser(user) {
  const email = String(user?.email || "").trim().toLowerCase();
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(`kaaryaEmployerProfile:${email}`) || "{}"); } catch {}
  const avatar = typeof user?.avatar === "string" && (user.avatar.startsWith("data:") || user.avatar.startsWith("http")) ? user.avatar : "";
  return {
    name: user?.name || "",
    companyName: user?.companyName || "",
    email: user?.email || "",
    employeeId: user?.employeeId || (user?.id ? `EMP-${String(user.id).slice(-6).toUpperCase()}` : "Not linked"),
    phone: user?.phone || "",
    jobRole: user?.designation || "Employer representative",
    joiningDate: "",
    employmentType: "Full-time",
    employmentStatus: "Active",
    workLocation: "",
    photo: avatar,
    ...saved,
    name: user?.name || saved.name || "",
    companyName: user?.companyName || saved.companyName || "",
    email: user?.email || saved.email || "",
    photo: saved.photo || avatar,
  };
}

function profileForAuthenticatedUser(user) {
  const saved = readTraineeAccountValue("kaaryaTraineeProfile", user, {});
  const avatar = typeof user?.avatar === "string" && (user.avatar.startsWith("data:") || user.avatar.startsWith("http")) ? user.avatar : "";
  return {
    ...defaultTraineeProfile,
    name: user?.name || "",
    email: user?.email || "",
    institute: user?.collegeName || "",
    degreeName: "",
    cgpa: user?.cgpa == null ? "" : String(user.cgpa),
    photo: avatar,
    ...saved,
    name: saved?.name || user?.name || "",
    email: user?.email || saved?.email || "",
    institute: saved?.institute || user?.collegeName || "",
    educationLevel: saved?.educationLevel || "",
    degreeName: saved?.degreeName || "",
    yearOfCompletion: saved?.yearOfCompletion || saved?.graduationYear || "",
    photo: saved?.photo || avatar,
  };
}

function employmentFromOutcome(person) {
  const sourceStatus = String(person?.status || "Seeking work");
  const status = sourceStatus === "Apprentice" ? "Apprenticeship" : sourceStatus === "Seeking work" ? "Looking for work" : sourceStatus;
  return {
    status,
    company: person?.employer || "",
    role: person?.role || "",
    industry: "",
    joinedAt: person?.joinedAtIso ? person.joinedAtIso.slice(0, 10) : "",
    salary: person?.wage ? String(person.wage) : "",
    location: person?.city || "",
    skills: person?.industrySkills || [],
    type: "",
    employerVerified: Boolean(person?.verified),
    verificationDate: person?.verificationDate ? person.verificationDate.slice(0, 10) : "",
  };
}

function trainingFromOutcome(person) {
  if (!person?.course && !person?.certificateName && !person?.trainedAtIso && !person?.provider) return [];
  const skills = person?.skills || [];
  return [{
    id: person?.id || "linked-training",
    course: person?.course || "Training details not recorded",
    provider: person?.provider || "Provider not recorded",
    start: "Not recorded",
    end: person?.trained || "Not recorded",
    duration: person?.courseDuration || "Not recorded",
    trainingMode: "Not recorded",
    skillsCovered: skills.join(", ") || "Not recorded",
    description: "Course details are supplied by your linked training outcome record.",
    assessment: person?.assessmentScore ? `Assessment score: ${person.assessmentScore}` : "Assessment not recorded",
    verified: false,
  }];
}

function salaryHistoryFromOutcome(person) {
  const sourceHistory = Array.isArray(person?.wageHistory) ? person.wageHistory : [];
  const entries = sourceHistory.map((item, index) => {
    const dateValue = item.date ? new Date(item.date) : null;
    const previousWage = index ? Number(sourceHistory[index - 1].wage) || 0 : 0;
    const wage = Number(item.wage) || 0;
    return {
      date: dateValue && !Number.isNaN(dateValue.getTime()) ? dateValue.toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Date not recorded",
      fullDate: dateValue && !Number.isNaN(dateValue.getTime()) ? dateValue.toISOString().slice(0, 10) : "",
      employer: item.employer || person?.employer || "Employer not recorded",
      role: item.role || person?.role || "Role not recorded",
      previousWage,
      wage,
      hikeAmount: wage - previousWage,
      hikePercent: previousWage ? Number((((wage - previousWage) / previousWage) * 100).toFixed(1)) : 0,
      reason: "Outcome record update",
      verified: item.source === "EMPLOYER_VERIFIED",
    };
  });
  if (!entries.length && Number(person?.wage) > 0) {
    const dateValue = person.joinedAtIso || person.trainedAtIso;
    const date = dateValue ? new Date(dateValue) : null;
    entries.push({
      date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Date not recorded",
      fullDate: date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : "",
      employer: person.employer || "Employer not recorded", role: person.role || "Role not recorded",
      previousWage: 0, wage: Number(person.wage), hikeAmount: 0, hikePercent: 0,
      reason: "Current outcome record", verified: Boolean(person.verified),
    });
  }
  return entries;
}

function App() {
  const [page, setPage] = useState("Overview");
  const [role, setRole] = useState(() => portalForApiRole[localStorage.getItem("kaaryaRole")] || "Government / Admin");
  const [roleMenu, setRoleMenu] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(() => readStoredObject("kaaryaUser"));
  const [traineeProfileOpen, setTraineeProfileOpen] = useState(false);
  const [traineeProfile, setTraineeProfile] = useState(() => profileForAuthenticatedUser(authenticatedUser));
  const [employerProfileOpen, setEmployerProfileOpen] = useState(false);
  const [employerProfile, setEmployerProfile] = useState(() => employerProfileForUser(authenticatedUser));
  const emptyTraineeEmployment = { status: "Unemployed", company: "", role: "", industry: "", joinedAt: "", salary: "", location: "", type: "", employerVerified: false, verificationDate: "" };

  const [traineeEmployment, setTraineeEmployment] = useState(() => {
    return readTraineeAccountValue("kaaryaTraineeEmployment", authenticatedUser, authenticatedUser ? emptyTraineeEmployment : defaultEmploymentRecord);
  });

  const [traineeCertificates, setTraineeCertificates] = useState(() => {
    return readTraineeAccountValue("kaaryaTraineeCertificates", authenticatedUser, authenticatedUser ? [] : defaultCertificates);
  });

  const [traineeTrainings, setTraineeTrainings] = useState(() => {
    return readTraineeAccountValue("kaaryaTraineeTrainings", authenticatedUser, authenticatedUser ? [] : defaultTrainingList);
  });

  const [traineeSalaries, setTraineeSalaries] = useState(() => {
    return readTraineeAccountValue("kaaryaTraineeSalaryHistory", authenticatedUser, authenticatedUser ? [] : defaultSalaryHistory);
  });

  const [traineeNotifications, setTraineeNotifications] = useState(() => {
    return readTraineeAccountValue("kaaryaTraineeNotifications", authenticatedUser, authenticatedUser ? [] : defaultTraineeNotifications);
  });

  const handleSaveTraineeProfile = async (updated) => {
    const accountProfile = { ...updated, name: updated.name || authenticatedUser?.name || "", email: authenticatedUser?.email || updated.email || "" };
    setTraineeProfile(accountProfile);
    saveTraineeAccountValue("kaaryaTraineeProfile", authenticatedUser?.email, accountProfile);
    setTraineeProfileOpen(false);
    notify("Profile saved successfully!");
    try {
      await updateTraineeProfile({ name: accountProfile.name, education: [accountProfile.educationLevel, accountProfile.degreeName].filter(Boolean).join(" - "), skills: updated.skills || [] });
    } catch (e) {}
  };

  const handleSaveEmployerProfile = (updated) => {
    const profile = { ...updated, name: authenticatedUser?.name || updated.name, companyName: authenticatedUser?.companyName || updated.companyName, email: authenticatedUser?.email || updated.email };
    setEmployerProfile(profile);
    localStorage.setItem(`kaaryaEmployerProfile:${String(profile.email || "guest").toLowerCase()}`, JSON.stringify(profile));
    setEmployerProfileOpen(false);
    notify("Employer profile updated.");
  };

  const handleSaveTraineeEmployment = async (updated) => {
    const savedToWorkspace = await updateTraineeEmployment({
      employmentStatus: ({ Employed: "Employed", "Self-employed": "Self-employed", Unemployed: "Seeking work", "Looking for work": "Seeking work", "Higher education": "Seeking work", Apprenticeship: "Apprentice" }[updated.status] || "Seeking work"),
      employerName: updated.company,
      jobRole: updated.role,
      monthlyWage: Number(updated.salary) || 0,
      joinedAt: updated.joinedAt ? new Date(`${updated.joinedAt}T12:00:00`).toISOString() : null,
    });
    if (!savedToWorkspace) return false;
    setTraineeEmployment(updated);
    saveTraineeAccountValue("kaaryaTraineeEmployment", authenticatedUser?.email, updated);
    if (["Employed", "Self-employed", "Apprenticeship"].includes(updated.status) && Number(updated.salary) > 0) {
      const latest = traineeSalaries[traineeSalaries.length - 1];
      const wage = Number(updated.salary);
      if (!latest || Number(latest.wage) !== wage) {
        const previousWage = Number(latest?.wage) || 0;
        const fullDate = new Date().toISOString().slice(0, 10);
        const nextSalaries = [...traineeSalaries, {
          date: new Date(`${fullDate}T12:00:00`).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
          fullDate,
          employer: updated.company || "Current employment",
          role: updated.role || "Current role",
          previousWage,
          wage,
          hikeAmount: wage - previousWage,
          hikePercent: previousWage ? Number((((wage - previousWage) / previousWage) * 100).toFixed(1)) : 0,
          reason: "Current employment details updated",
          verified: Boolean(updated.employerVerified),
        }];
        setTraineeSalaries(nextSalaries);
        saveTraineeAccountValue("kaaryaTraineeSalaryHistory", authenticatedUser?.email, nextSalaries);
      }
    }
    return true;
  };

  const handleUploadCertificate = (newCert) => {
    const next = [newCert, ...traineeCertificates];
    setTraineeCertificates(next);
    saveTraineeAccountValue("kaaryaTraineeCertificates", authenticatedUser?.email, next);
  };

  const handleDeleteCertificate = (certId) => {
    const next = traineeCertificates.filter((c) => c.id !== certId);
    setTraineeCertificates(next);
    saveTraineeAccountValue("kaaryaTraineeCertificates", authenticatedUser?.email, next);
    notify("Certificate removed.");
  };

  const handleAddSalaryRecord = (newSalaries) => {
    setTraineeSalaries(newSalaries);
    saveTraineeAccountValue("kaaryaTraineeSalaryHistory", authenticatedUser?.email, newSalaries);
    const latest = newSalaries[newSalaries.length - 1];
    if (latest) {
      const nextEmployment = { ...traineeEmployment, salary: String(latest.wage), company: latest.employer || traineeEmployment.company, role: latest.role || traineeEmployment.role };
      setTraineeEmployment(nextEmployment);
      saveTraineeAccountValue("kaaryaTraineeEmployment", authenticatedUser?.email, nextEmployment);
    }
  };

  const markTraineeNotificationRead = async (notifId) => {
    try {
      await apiRequest(`/api/notifications/${encodeURIComponent(notifId)}/read`, apiToken, { method: "PATCH" });
    } catch (error) {
      notify(error.message);
      return;
    }
    const next = traineeNotifications.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
    setTraineeNotifications(next);
    saveTraineeAccountValue("kaaryaTraineeNotifications", authenticatedUser?.email, next);
  };

  const markAllTraineeNotificationsRead = () => {
    apiRequest("/api/notifications/read-all", apiToken, { method: "PATCH" }).catch((error) => notify(error.message));
    const next = traineeNotifications.map((n) => ({ ...n, isRead: true }));
    setTraineeNotifications(next);
    saveTraineeAccountValue("kaaryaTraineeNotifications", authenticatedUser?.email, next);
    notify("All notifications marked as read.");
  };
  const [activeTrainee, setActiveTrainee] = useState(null);
  const [outcomeRecords, setOutcomeRecords] = useState(trainees);
  const [verificationHistory, setVerificationHistory] = useState(() => readEmployerDemoData(authenticatedUser?.email, "verification-history", []));
  const [employerSettings, setEmployerSettings] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All trainees");
  const [followupOpen, setFollowupOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [apiToken, setApiToken] = useState(() => localStorage.getItem("kaaryaToken") || "");
  const [signedIn, setSignedIn] = useState(() => Boolean(localStorage.getItem("kaaryaToken")));
  const [registerMode, setRegisterMode] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [verifiedIds, setVerifiedIds] = useState(() => new Set(trainees.filter((item) => item.verified).map((item) => item.id)));
  const [completedIds, setCompletedIds] = useState(() => new Set());
  const [followupList, setFollowupList] = useState([
    { id: 1, traineeId: "SK-24018", channel: "WhatsApp", due: "Today, 10:30 AM", type: "6-month check-in", state: "Due today" },
    { id: 2, traineeId: "SK-24033", channel: "Phone call", due: "Yesterday", type: "Placement support", state: "Overdue" },
    { id: 3, traineeId: "SK-24056", channel: "SMS", due: "Today, 2:00 PM", type: "Employer confirmation", state: "Due today" },
    { id: 4, traineeId: "SK-24027", channel: "WhatsApp", due: "Friday, 11:00 AM", type: "3-month check-in", state: "Scheduled" },
  ]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const visibleRecords = useMemo(() => outcomeRecords.filter((person) => {
    const matchesQuery = `${person.name || ""} ${person.id || ""} ${person.course || ""} ${person.employer || ""} ${person.district || ""} ${person.city || ""} ${person.role || ""} ${person.provider || ""}`.toLowerCase().includes(query.trim().toLowerCase());
    const allStatuses = ["All trainees", "All employees", "All records"];
    return matchesQuery && (allStatuses.includes(statusFilter) || person.status === statusFilter);
  }), [outcomeRecords, query, statusFilter]);

  useEffect(() => {
    if (!apiToken) return undefined;
    let active = true;
    const loadWorkspace = async () => {
      try {
        const [records, followUps, history, settings, notificationItems] = await Promise.all([
          apiRequest("/api/outcomes/trainees", apiToken),
          role === "Employer" ? Promise.resolve(null) : apiRequest("/api/outcomes/follow-ups", apiToken),
          role === "Employer" ? apiRequest("/api/outcomes/verifications", apiToken) : Promise.resolve(null),
          role === "Employer" ? apiRequest("/api/employer/settings", apiToken) : Promise.resolve(null),
          apiRequest("/api/notifications", apiToken),
        ]);
        if (!active) return;
        const workspaceRecords = role === "Employer"
          ? withEmployerDemoRecords(records, employerProfile.companyName, authenticatedUser?.email)
          : records;
        setOutcomeRecords(workspaceRecords);
        setVerifiedIds(new Set(workspaceRecords.filter((record) => record.verified).map((record) => record.id)));
        if (followUps) setFollowupList(followUps.map(normalizeFollowUp));
        if (history) {
          const demoHistory = readEmployerDemoData(authenticatedUser?.email, "verification-history", []);
          setVerificationHistory([...demoHistory, ...history.filter((item) => !demoHistory.some((demo) => demo.id === item.id))]);
        }
        if (settings) setEmployerSettings(settings);
        setNotifications(notificationItems);
        if (role === "Trainee" && authenticatedUser?.email) {
          const person = records[0];
          if (person) {
            if ((!traineeEmployment.company && !traineeEmployment.salary) && (person.employer || person.wage)) {
              const employment = employmentFromOutcome(person);
              setTraineeEmployment(employment);
              saveTraineeAccountValue("kaaryaTraineeEmployment", authenticatedUser.email, employment);
            }
            if (traineeTrainings.length === 0) {
              const training = trainingFromOutcome(person);
              setTraineeTrainings(training);
              saveTraineeAccountValue("kaaryaTraineeTrainings", authenticatedUser.email, training);
            }
            if (traineeSalaries.length === 0) {
              const salaries = salaryHistoryFromOutcome(person);
              setTraineeSalaries(salaries);
              saveTraineeAccountValue("kaaryaTraineeSalaryHistory", authenticatedUser.email, salaries);
            }
            if (traineeCertificates.length === 0 && person.certificateName) {
              const certificate = [{
                id: `CERT-${person.id}`,
                name: person.certificateName,
                issueDate: person.trainedAtIso ? person.trainedAtIso.slice(0, 10) : "",
                issuer: person.provider || "Provider not recorded",
                status: "Pending Verification",
                verifiedDate: "",
              }];
              setTraineeCertificates(certificate);
              saveTraineeAccountValue("kaaryaTraineeCertificates", authenticatedUser.email, certificate);
            }
          }
          const savedNotices = readTraineeAccountValue("kaaryaTraineeNotifications", authenticatedUser, []);
          const serverIds = new Set(notificationItems.map((item) => item.id));
          const traineeNotices = [
            ...notificationItems.map((item) => ({ ...item, type: "default" })),
            ...savedNotices.filter((item) => !serverIds.has(item.id)),
          ];
          setTraineeNotifications(traineeNotices);
          saveTraineeAccountValue("kaaryaTraineeNotifications", authenticatedUser.email, traineeNotices);
        }
      } catch (error) {
        if (!active) return;
        notify(error.message);
        if (/session|token|unauthorized/i.test(error.message)) logout();
      }
    };
    loadWorkspace();
    const refreshInterval = window.setInterval(() => {
      if (document.visibilityState === "visible") loadWorkspace();
    }, 15000);
    const refreshOnFocus = () => { if (document.visibilityState === "visible") loadWorkspace(); };
    window.addEventListener("focus", refreshOnFocus);
    return () => { active = false; window.clearInterval(refreshInterval); window.removeEventListener("focus", refreshOnFocus); };
  }, [apiToken, role, authenticatedUser]);

  const findTrainee = (id) => outcomeRecords.find((person) => person.id === id);
  const setAndClosePage = (nextPage) => { setPage(nextPage); setMobileNav(false); setActiveTrainee(null); };
  const logout = () => {
    localStorage.removeItem("kaaryaToken");
    localStorage.removeItem("kaaryaRole");
    localStorage.removeItem("kaaryaUser");
    setApiToken("");
    setAuthenticatedUser(null);
    setSignedIn(false);
    setActiveTrainee(null);
  };
  const switchRole = (nextRole) => { logout(); setRole(nextRole); setPage("Overview"); setQuery(""); setRoleMenu(false); setMobileNav(false); };
  const handleAuthenticated = ({ token, apiRole, user }) => {
    const nextRole = portalForApiRole[apiRole] || role;
    localStorage.setItem("kaaryaToken", token);
    localStorage.setItem("kaaryaRole", apiRole);
    localStorage.setItem("kaaryaUser", JSON.stringify(user));
    setApiToken(token);
    setAuthenticatedUser(user);
    if (nextRole === "Employer") setEmployerProfile(employerProfileForUser(user));
    if (nextRole === "Trainee") {
      const profile = profileForAuthenticatedUser(user);
      setTraineeProfile(profile);
      saveTraineeAccountValue("kaaryaTraineeProfile", user.email, profile);
      const employment = readTraineeAccountValue("kaaryaTraineeEmployment", user, { status: "Unemployed", company: "", role: "", industry: "", joinedAt: "", salary: "", location: "", type: "", employerVerified: false, verificationDate: "" });
      const certificates = readTraineeAccountValue("kaaryaTraineeCertificates", user, []);
      const trainings = readTraineeAccountValue("kaaryaTraineeTrainings", user, []);
      const salaries = readTraineeAccountValue("kaaryaTraineeSalaryHistory", user, []);
      const traineeNotices = readTraineeAccountValue("kaaryaTraineeNotifications", user, []);
      const mySkills = readTraineeAccountValue("kaaryaTraineeMySkills", user, []);
      const skillPlan = readTraineeAccountValue("kaaryaTraineeSkillPlan", user, []);
      const previousJob = readTraineeAccountValue("kaaryaTraineePreviousJob", user, null);
      setTraineeEmployment(employment);
      setTraineeCertificates(certificates);
      setTraineeTrainings(trainings);
      setTraineeSalaries(salaries);
      setTraineeNotifications(traineeNotices);
      for (const [key, value] of [["kaaryaTraineeEmployment", employment], ["kaaryaTraineeCertificates", certificates], ["kaaryaTraineeTrainings", trainings], ["kaaryaTraineeSalaryHistory", salaries], ["kaaryaTraineeNotifications", traineeNotices], ["kaaryaTraineeMySkills", mySkills], ["kaaryaTraineeSkillPlan", skillPlan], ["kaaryaTraineePreviousJob", previousJob]]) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
    setRole(nextRole);
    setPage("Overview");
    setSignedIn(true);
  };
  const saveEmployerDemoRecords = (records) => {
    const demoRecords = records.filter((person) => person.demoRecord);
    localStorage.setItem(employerDemoKey(authenticatedUser?.email, "records"), JSON.stringify(demoRecords));
  };
  const addEmployerDemoHistory = (person, status, note) => {
    const timestamp = new Date().toISOString();
    const item = { id: `demo-verification-${person.id}-${Date.now()}`, traineeId: person.id, traineeName: person.name, role: person.role || "", monthlyWage: Number(person.wage) || null, status, createdAt: timestamp, verifiedAt: status === "VERIFIED" ? timestamp : null, note, demoRecord: true };
    setVerificationHistory((current) => {
      const next = [item, ...current];
      localStorage.setItem(employerDemoKey(authenticatedUser?.email, "verification-history"), JSON.stringify(next.filter((entry) => entry.demoRecord)));
      return next;
    });
  };
  const verifyEmployment = async (person) => {
    if (person.demoRecord) {
      setVerifiedIds((current) => new Set([...current, person.id]));
      setOutcomeRecords((current) => {
        const next = current.map((record) => record.id === person.id ? { ...record, verified: true } : record);
        saveEmployerDemoRecords(next);
        return next;
      });
      addEmployerDemoHistory(person, "VERIFIED", "Confirmed by employer in the demo workspace.");
      notify("Employment verified. Verification history and status have been updated.");
      return;
    }
    try {
      const confirmed = await apiRequest(`/api/outcomes/trainees/${encodeURIComponent(person.id)}/verify`, apiToken, { method: "POST", body: { role: person.role, monthlyWage: person.wage || undefined } });
      setVerifiedIds((current) => new Set([...current, person.id]));
      setOutcomeRecords((current) => current.map((record) => record.id === person.id ? {
        ...record,
        role: confirmed.role || record.role,
        wage: confirmed.monthlyWage ?? record.wage,
        joinedAt: confirmed.joinedAt ? new Date(confirmed.joinedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : record.joinedAt,
        verified: true,
      } : record));
      const history = await apiRequest("/api/outcomes/verifications", apiToken);
      setVerificationHistory(history);
      notify("Employment details verified and added to verification history.");
    } catch (error) {
      notify(error.message);
    }
  };
  const requestEmploymentUpdate = async (person, update) => {
    if (person.demoRecord) {
      const updatedPerson = { ...person, role: update.role || person.role, wage: Number(update.monthlyWage) || person.wage, verified: false };
      setOutcomeRecords((current) => {
        const next = current.map((record) => record.id === person.id ? updatedPerson : record);
        saveEmployerDemoRecords(next);
        return next;
      });
      setVerifiedIds((current) => { const next = new Set(current); next.delete(person.id); return next; });
      addEmployerDemoHistory(updatedPerson, "PENDING", update.note || "Employment details sent for review.");
      notify("Employment update saved and added to verification history.");
      return true;
    }
    try {
      await apiRequest(`/api/outcomes/trainees/${encodeURIComponent(person.id)}/employment-update-requests`, apiToken, { method: "POST", body: update });
      setVerificationHistory(await apiRequest("/api/outcomes/verifications", apiToken));
      setOutcomeRecords((current) => current.map((record) => record.id === person.id ? { ...record, verified: false } : record));
      setVerifiedIds((current) => { const next = new Set(current); next.delete(person.id); return next; });
      notify("Employment update sent for verification.");
      return true;
    } catch (error) {
      notify(error.message);
      return false;
    }
  };
  const saveEmployerSettings = async (changes) => {
    try {
      const saved = await apiRequest("/api/employer/settings", apiToken, { method: "PATCH", body: changes });
      setEmployerSettings((current) => ({ ...current, ...changes, preferences: { ...current?.preferences, ...saved.preferences } }));
      notify("Company settings saved.");
      return true;
    } catch (error) {
      notify(error.message);
      return false;
    }
  };
  const markNotificationRead = async (item) => {
    try {
      await apiRequest(`/api/notifications/${encodeURIComponent(item.id)}/read`, apiToken, { method: "PATCH" });
      setNotifications((current) => current.map((notification) => notification.id === item.id ? { ...notification, isRead: true } : notification));
    } catch (error) {
      notify(error.message);
    }
  };
  const updateTraineeEmployment = async (data) => {
    const person = outcomeRecords.find((record) => record.linkedUser) || outcomeRecords[0];
    if (!person) return false;
    try {
      const updated = await apiRequest(`/api/outcomes/trainees/${encodeURIComponent(person.id)}/employment`, apiToken, { method: "PATCH", body: data });
      setOutcomeRecords((current) => current.map((record) => record.id === updated.id ? { ...record, ...updated } : record));
      setNotifications(await apiRequest("/api/notifications", apiToken));
      notify("Your work update is saved and shared only according to your consent.");
      return true;
    } catch (error) {
      notify(error.message);
      return false;
    }
  };
  const updateTraineeProfile = async (data) => {
    const person = outcomeRecords[0];
    if (!person) return false;
    try {
      const updated = await apiRequest(`/api/outcomes/trainees/${encodeURIComponent(person.id)}/profile`, apiToken, { method: "PATCH", body: data });
      setOutcomeRecords((current) => current.map((record) => record.id === updated.id ? { ...record, ...updated } : record));
      notify("Your profile is saved.");
      return true;
    } catch (error) {
      notify(error.message);
      return false;
    }
  };
  const updateTraineeConsent = async (data) => {
    const person = outcomeRecords[0];
    if (!person) return false;
    try {
      const updated = await apiRequest(`/api/outcomes/trainees/${encodeURIComponent(person.id)}/consent`, apiToken, { method: "PATCH", body: data });
      setOutcomeRecords((current) => current.map((record) => record.id === person.id ? { ...record, consent: updated.consentActive, preferredChannel: updated.preferredChannel } : record));
      setNotifications(await apiRequest("/api/notifications", apiToken));
      notify("Your consent and contact preferences are saved.");
      return true;
    } catch (error) {
      notify(error.message);
      return false;
    }
  };
  const respondToTraineeFollowUp = async (item) => {
    try {
      const result = await apiRequest(`/api/outcomes/follow-ups/${encodeURIComponent(item.id)}/response`, apiToken, { method: "PATCH", body: { response: "Trainee confirmed current employment details." } });
      setFollowupList((current) => [
        ...(result.nextCheckIn ? [normalizeFollowUp({ ...result.nextCheckIn, traineeId: item.traineeId, name: item.name, initials: item.initials })] : []),
        ...current.map((followUp) => followUp.id === item.id ? { ...followUp, state: "Completed" } : followUp),
      ]);
      setNotifications(await apiRequest("/api/notifications", apiToken));
      notify("Thanks. Your check-in is recorded; the next small check-in is scheduled automatically.");
    } catch (error) {
      notify(error.message);
    }
  };
  const scheduleFollowUp = async (input) => {
    try {
      const item = await apiRequest("/api/outcomes/follow-ups", apiToken, { method: "POST", body: input });
      const person = findTrainee(item.traineeId);
      setFollowupList((current) => [normalizeFollowUp({ ...item, name: person?.name, initials: person?.initials }), ...current]);
      setFollowupOpen(false);
      notify("Follow-up scheduled.");
    } catch (error) {
      notify(error.message);
    }
  };
  const completeFollowUp = async (followUpId) => {
    try {
      await apiRequest(`/api/outcomes/follow-ups/${encodeURIComponent(followUpId)}/status`, apiToken, { method: "PATCH", body: { status: "COMPLETED" } });
      setCompletedIds((current) => new Set([...current, followUpId]));
      setFollowupList((current) => current.map((item) => item.id === followUpId ? { ...item, state: "Completed" } : item));
      notify("Follow-up marked complete.");
    } catch (error) {
      notify(error.message);
    }
  };

  if (!signedIn) return <Login registerMode={registerMode} setRegisterMode={setRegisterMode} role={role} setRole={setRole} onSubmit={handleAuthenticated} />;

  const details = portalDetails[role];
  const navGroups = portalNavGroups[role];
  const pageCopy = portalPageCopy[role][page] || portalPageCopy[role].Overview;

  return (
    <div className={`shell ${role === "Trainee" ? "shell-trainee" : ""}`}>
      {mobileNav && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand-lockup"><span className="brand-symbol"><Activity size={19} strokeWidth={2.5} /></span><span>kaarya<span className="brand-period">.</span></span></div>
        {role !== "Trainee" && role !== "Government / Admin" && role !== "Employer" && <><button className="workspace-switch" aria-expanded={roleMenu} onClick={() => setRoleMenu(!roleMenu)}><span className="workspace-avatar">{details.initials}</span><span className="workspace-label"><strong>{details.workspace}</strong><small>{role} workspace</small></span><ChevronDown size={15} /></button>{roleMenu && <div className="role-menu">{Object.keys(portalDetails).map((portal) => <button key={portal} className={role === portal ? "role-option selected" : "role-option"} onClick={() => switchRole(portal)}><span className="role-option-icon">{portalDetails[portal].initials}</span><span><strong>{portal}</strong><small>{portalDetails[portal].workspace}</small></span>{role === portal && <Check size={15} />}</button>)}</div>}</>}
        {navGroups.map((group) => <div className={`nav-group ${role === "Trainee" ? "trainee-nav-group" : ""}`} key={group.label || role}>{group.label && <p className="nav-label">{group.label}</p>}{group.items.map(([label, Icon]) => { const target = role === "Employer" ? employerNavTargets[label] || label : label; return <button key={label} className={`nav-item ${page === target ? "nav-active" : ""}`} onClick={() => setAndClosePage(target)}><Icon size={17} /><span>{label}</span>{label === "Follow-ups" && <i className="nav-count">12</i>}</button>; })}</div>)}
        <div className="sidebar-bottom">{role === "Trainee" ? <><button className={`nav-item ${page === "Help & Support" ? "nav-active" : ""}`} onClick={() => setAndClosePage("Help & Support")}><CircleHelp size={17} /><span>Help & Support</span></button><button className="nav-item trainee-signout" onClick={logout}><LogOut size={17} /><span>Sign out</span></button></> : role === "Government / Admin" ? <button className="nav-item government-signout" onClick={logout}><LogOut size={17} /><span>Sign out</span></button> : role === "Employer" ? <><button className={`nav-item ${page === "Help & Support" ? "nav-active" : ""}`} onClick={() => setAndClosePage("Help & Support")}><CircleHelp size={17} /><span>Help & Support</span></button><button className="nav-item trainee-signout" onClick={logout}><LogOut size={17} /><span>Sign out</span></button></> : <><div className="privacy-note"><ShieldCheck size={16} /><span>Consent-led data<br /><strong>Privacy protected</strong></span></div><button className={`nav-item ${page === "Settings" ? "nav-active" : ""}`} onClick={() => setAndClosePage(role === "Employer" ? "Company Profile" : "Settings")}><Settings2 size={17} /><span>Profile & settings</span></button><button className="account-row" onClick={logout}><span className="account-avatar">{details.initials}</span><span><strong>{details.name}</strong><small>{details.accountRole}</small></span><LogOut size={15} /></button></>}</div>
      </aside>

      <main className="main-area">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="crumb"><span>{role}</span><ChevronRight size={14} /><strong>{page}</strong></div><div className="top-actions">{role !== "Trainee" && role !== "Government / Admin" && <><div className="notification-wrap"><button className="icon-button notification-button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} />{notifications.some((item) => !item.isRead) && <i />}</button>{notificationsOpen && <div className="notification-menu"><div className="notification-menu-heading"><strong>Notifications</strong><button onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X size={15} /></button></div>{notifications.length ? notifications.map((item) => <button className={`notification-item ${item.isRead ? "" : "notification-unread"}`} key={item.id} onClick={() => markNotificationRead(item)}><strong>{item.title}</strong><span>{item.body}</span><small>{new Date(item.createdAt).toLocaleString()}</small></button>) : <p className="notification-empty">No notifications yet.</p>}</div>}</div><span className="top-divider" /></>}{role === "Trainee" ? (
            <div className="trainee-top-actions">
              <div className="notification-wrap">
                <button
                  className="icon-button notification-button"
                  aria-label="Notifications"
                  title="Notifications"
                  aria-expanded={notificationsOpen}
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell size={18} />
                  {traineeNotifications.filter((n) => !n.isRead).length > 0 && (
                    <span className="notification-badge">
                      {traineeNotifications.filter((n) => !n.isRead).length}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <TraineeNotificationDropdown
                    notifications={traineeNotifications}
                    onMarkAsRead={markTraineeNotificationRead}
                    onMarkAllAsRead={markAllTraineeNotificationsRead}
                    onClose={() => setNotificationsOpen(false)}
                  />
                )}
              </div>

              <div className="trainee-profile-wrap">
                <button
                  className="trainee-circle-avatar-btn"
                  aria-label="Trainee profile"
                  title="Click to view & edit profile"
                  onClick={() => setTraineeProfileOpen(true)}
                >
                  <span
                    className="trainee-circular-avatar"
                    style={
                      traineeProfile.photo
                        ? {
                            backgroundImage: `url(${traineeProfile.photo})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            color: "transparent",
                          }
                        : {}
                    }
                  >
                    {traineeProfile.photo
                      ? ""
                      : (traineeProfile.name || authenticatedUser?.name || "T")
                          .split(/\s+/)
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                  </span>
                  <span className="avatar-online-dot" />
                </button>
              </div>
            </div>
          ) : role === "Employer" ? (
            <button className="top-profile employer-profile-trigger" onClick={() => setEmployerProfileOpen(true)} aria-label="Open employer profile" title="Employer profile">
              <span className="account-avatar">{employerProfile.photo ? <img src={employerProfile.photo} alt="Employer profile" /> : (employerProfile.name || authenticatedUser?.name || "E").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>
            </button>
          ) : (
            <button className="top-profile" onClick={() => setAndClosePage(role === "Government / Admin" ? "Officer Profile" : "Settings")}>
              <span className="account-avatar">{role === "Government / Admin" && authenticatedUser?.avatar?.startsWith("data:image/") ? <img src={authenticatedUser.avatar} alt="Profile" /> : details.initials}</span>
              <ChevronDown size={14} />
            </button>
          )}</div></header>

        <section className={`page-content ${role === "Government / Admin" && page === "Training" ? "government-training-page" : ""}`}>
          <div className={`page-heading ${role === "Trainee" && page === "Overview" ? "trainee-overview-heading" : ""}`}><div>{role !== "Trainee" && role !== "Government / Admin" && role !== "Employer" && <p className="eyebrow">Saturday, 26 September 2026 <span className="eyebrow-dot" /> 2025-26 programme</p>}<h1>{pageCopy[0]}</h1><p className="page-subtitle">{pageCopy[1]}</p></div><div className="heading-actions">{role === "Employer" && ["Reports", "Skill-wise Hiring", "Retention Reports", "Employment Reports"].includes(page) && <button className="button button-light" onClick={() => { exportCsv(`${page.toLowerCase().replaceAll(" ", "-")}.csv`, outcomeRecords); notify("Employer report downloaded as CSV."); }}><Download size={16} /> Export report</button>}{role !== "Trainee" && role !== "Government / Admin" && (page === "Overview" || page === "Reports & Analytics") && role !== "Employer" && <button className="button button-light" onClick={() => { exportCsv("kaarya-outcomes.csv", outcomeRecords); notify("Outcome report downloaded as CSV."); }}><Download size={16} /> Export report</button>}{role === "Training Provider" && <button className="button button-primary" onClick={() => setFollowupOpen(true)}><Plus size={17} /> New follow-up</button>}{role === "Employer" && page === "Verification" && <button className="button button-primary" onClick={() => setAndClosePage("Verification History")}><ClipboardCheck size={16} /> Verification history</button>}</div></div>

          {role === "Employer" && outcomeRecords.some((person) => person.demoRecord) && <div className="employer-demo-notice"><Sparkles size={14} /><span><strong>Sample workforce data</strong> — replace these prototype records with your company’s employee data.</span></div>}

          {role === "Trainee" && (
            <TraineeWorkspace
              page={page}
              profile={traineeProfile}
              employment={traineeEmployment}
              trainings={traineeTrainings}
              certificates={traineeCertificates}
              salaries={traineeSalaries}
              onNavigate={setAndClosePage}
              onOpenProfile={() => setTraineeProfileOpen(true)}
              onSaveEmployment={handleSaveTraineeEmployment}
              onUploadCertificate={handleUploadCertificate}
              onDeleteCertificate={handleDeleteCertificate}
              onAddSalaryRecord={handleAddSalaryRecord}
              onNotice={notify}
            />
          )}
          {page === "Overview" && role !== "Trainee" && (role === "Government / Admin" ? <Overview records={outcomeRecords} onNavigate={setAndClosePage} onOpenTrainee={setActiveTrainee}  /> : <PortalOverview role={role} records={outcomeRecords} onNavigate={setAndClosePage} onOpenTrainee={setActiveTrainee} />)}
          {(page === "Trainees" || page === "Employees") && <TraineePage records={role === "Employer" ? visibleRecords.filter((person) => person.employer && person.employer !== "Self-employed") : visibleRecords} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} openTrainee={setActiveTrainee} onNotice={notify} entity={role === "Employer" ? "employee" : "trainee"} />}
          {role === "Employer" && page === "Employment History" && <EmployerEmploymentHistory records={outcomeRecords} onOpenTrainee={setActiveTrainee} onRequestUpdate={(person) => requestEmploymentUpdate(person, { role: person.role, monthlyWage: person.wage || undefined, note: "Employer requested a review of current employment details." })} />}
          {role === "Employer" && page === "Notifications" && <NotificationsPage items={notifications} onRead={markNotificationRead} />}
          {(page === "Training" || page === "Courses") && (role === "Trainee" ? <TraineePortalWorkspace page="Training" person={outcomeRecords[0]} onNotice={notify} onNavigate={setAndClosePage} /> : <TrainingPage onNotice={notify} />)}
          {page === "Employment" && (role === "Trainee" ? <TraineePortalWorkspace page={page} person={outcomeRecords[0]} onNotice={notify} onEmploymentUpdate={updateTraineeEmployment} /> : <EmploymentPage records={outcomeRecords} verifiedIds={verifiedIds} onVerify={verifyEmployment} openTrainee={setActiveTrainee} />)}
          {page === "Follow-ups" && (role === "Trainee" ? <TraineePortalWorkspace page="Profile" person={outcomeRecords[0]} followUps={followupList} notifications={notifications} onNotice={notify} onRespond={respondToTraineeFollowUp} /> : <FollowupsPage items={followupList} findTrainee={findTrainee} completedIds={completedIds} onComplete={completeFollowUp} onOpenTrainee={setActiveTrainee} onNew={() => setFollowupOpen(true)} />)}
          {(page === "Analytics" || page === "Analytics & Insights" && role !== "Government / Admin" || page === "Outcomes" || page === "Reports" || page === "Reports & Analytics" || page === "Salary & Retention" || page === "Skill-wise Hiring" || page === "Retention Reports" || page === "Employment Reports" || page === "Employee Progress") && (role === "Employer" ? <EmployerReportsPage page={page} records={outcomeRecords} onNotice={notify} onRequestUpdate={requestEmploymentUpdate} onNavigate={setAndClosePage} onOpenTrainee={setActiveTrainee} /> : <AnalyticsPage onNotice={notify} />)}
          {page === "Verification" && <EmployerVerificationPage records={outcomeRecords} verifiedIds={verifiedIds} history={verificationHistory} onVerify={(id) => { const person = findTrainee(id); if (person) verifyEmployment(person); }} onRequestUpdate={(person, update) => requestEmploymentUpdate(person, update)} openTrainee={setActiveTrainee} onNavigate={setAndClosePage} />}
          {role === "Employer" && page === "Verification History" && <EmployerVerificationHistory items={verificationHistory} onNavigate={setAndClosePage} />}
          {role === "Employer" && ["Company Profile", "Contact Details", "Account Settings", "Privacy / Permissions"].includes(page) && <EmployerSettingsPage page={page} settings={employerSettings} onNavigate={setAndClosePage} onSave={saveEmployerSettings} onChangePassword={async (currentPassword, newPassword) => { try { await apiRequest("/api/auth/password", apiToken, { method: "PATCH", body: { currentPassword, newPassword } }); notify("Password updated."); return true; } catch (error) { notify(error.message); return false; } }} />}
          {page === "Help & Support" && role === "Employer" && <EmployerHelpSupport onNavigate={setAndClosePage} />}
          {page === "Skill Gap" && <SkillGapPage onNotice={notify} />}
          {page === "Career" && <TraineePortalWorkspace page={page} person={outcomeRecords[0]} onNotice={notify} onNavigate={setAndClosePage} />}
          {page === "Profile" && <TraineePortalWorkspace page={page} person={outcomeRecords[0]} followUps={followupList} notifications={notifications} onNotice={notify} onProfileUpdate={updateTraineeProfile} onConsentUpdate={updateTraineeConsent} onRespond={respondToTraineeFollowUp} onSignOut={logout} />}
          {page === "Analytics & Insights" && role === "Government / Admin" && <><AnalyticsPage onNotice={notify} /><InsightsPage onNavigate={setAndClosePage} onNotice={notify} /></>}
          {page === "Insights" && role === "Government / Admin" && <InsightsPage onNavigate={setAndClosePage} onNotice={notify} />}
          {page === "Settings" && <SettingsPage role={role} onNotice={notify} />}
          {page === "Officer Profile" && role === "Government / Admin" && <GovernmentOfficerProfile details={details} user={authenticatedUser} email={authenticatedUser?.email || "tpo@college.edu"} onSave={async (updates) => { try { const updated = await apiRequest("/api/auth/profile", apiToken, { method: "PATCH", body: updates }); setAuthenticatedUser(updated); localStorage.setItem("kaaryaUser", JSON.stringify(updated)); notify("Officer profile saved."); return true; } catch (error) { notify(error.message); return false; } }} />}
          {role !== "Trainee" && role !== "Government / Admin" && role !== "Employer" && <footer className="page-footer"><span><ShieldCheck size={14} /> Participant data is consent-led and encrypted</span><span>Kaarya Outcomes <i /> Last synced 8 minutes ago</span></footer>}
        </section>
      </main>


      {activeTrainee && (role === "Employer" ? <EmployerEmployeeDrawer person={activeTrainee} close={() => setActiveTrainee(null)} onNavigate={setAndClosePage} onRequestUpdate={requestEmploymentUpdate} /> : <TraineeDrawer person={activeTrainee} isVerified={verifiedIds.has(activeTrainee.id)} close={() => setActiveTrainee(null)} onFollowup={() => setFollowupOpen(true)} onNavigate={setAndClosePage} />)}
      {followupOpen && <FollowupModal records={outcomeRecords} close={() => setFollowupOpen(false)} onSave={scheduleFollowUp} />}
      {traineeProfileOpen && (
        <TraineeProfileModal
          profile={traineeProfile}
          onSave={handleSaveTraineeProfile}
          onClose={() => setTraineeProfileOpen(false)}
        />
      )}
      {employerProfileOpen && <EmployerProfileModal profile={employerProfile} onSave={handleSaveEmployerProfile} onClose={() => setEmployerProfileOpen(false)} />}
      {toast && <div role="status" className="toast"><CheckCircle2 size={17} />{toast}</div>}
    </div>
  );
}

function LegacyPortalOverview({ role, records, onNavigate, onOpenTrainee }) {
  if (role === "Trainee") return <TraineePortalPage page="Overview" person={records[0]} onNotice={() => onNavigate("Trainees")} />;
  const employer = role === "Employer";
  const employeeRecords = records.filter((person) => person.employer && person.employer !== "Self-employed");
  const pendingVerifications = employeeRecords.filter((person) => !person.verified).length;
  const averageWage = employeeRecords.length ? Math.round(employeeRecords.reduce((sum, person) => sum + (person.wage || 0), 0) / employeeRecords.length) : 0;
  const retainedCount = employeeRecords.filter((person) => Number.parseInt(person.retention, 10) >= 6).length;
  const metrics = employer
    ? [[Users, "Employees / trainees hired", employeeRecords.length, "In your employer workspace", "green"], [ShieldCheck, "Pending verifications", pendingVerifications, "Employment details to confirm", "orange"], [HeartHandshake, "Retained at 6 months", `${employeeRecords.length ? Math.round(retainedCount / employeeRecords.length * 100) : 0}%`, `${retainedCount} current records`, "blue"], [WalletCards, "Average monthly wage", money(averageWage), `Across ${employeeRecords.length} employees`, "violet"]]
    : [[Users, "Trainees enrolled", "2,480", "+12.4% this cohort", "green"], [GraduationCap, "Active courses", "12", "Across 6 centres", "orange"], [CheckCircle2, "Completion rate", "91.4%", "+2.8% this quarter", "blue"], [BriefcaseBusiness, "Employment rate", "72%", "+5.6% year on year", "violet"]];
  const title = employer ? "Recent hires" : "Course performance";
  const list = employer
    ? employeeRecords
    : records;
  return <>
    <div className="cohort-strip"><div><span className="strip-icon">{employer ? <Building2 size={17} /> : <GraduationCap size={17} />}</span><span><strong>{employer ? "Skills pathway hiring" : "2025-26 programme cohorts"}</strong><small>{employer ? "Hiring outcomes from training programme partners" : "Across 6 centres and 8 districts"}</small></span></div><button className="select-button" onClick={() => onNavigate(employer ? "Reports" : "Reports & Analytics")}>{employer ? "All hiring" : "All cohorts"} <ChevronDown size={14} /></button><span className="strip-divider" /><span className="strip-updated"><i /> Updated today</span></div>
    <div className="metric-grid">{metrics.map(([icon, label, value, note, tone]) => <Metric key={label} icon={icon} label={label} value={value} trend={label === "Pending verifications" ? `${pendingVerifications} open` : "On track"} note={note} tone={tone} />)}</div>
    <div className="portal-overview-grid"><section className="panel portal-main-panel"><div className="panel-heading"><div><p className="eyebrow">{employer ? "LATEST EMPLOYMENT RECORDS" : "OUTCOME SNAPSHOT"}</p><h2>{title}</h2></div><button className="panel-link panel-link-button" onClick={() => onNavigate(employer ? "Employees" : "Courses")}>View all <ArrowRight size={14} /></button></div>{employer ? <div className="portal-list">{list.slice(0, 4).map((person) => <button className="portal-list-row" key={person.id} onClick={() => onOpenTrainee(person)}><span className="person-avatar sage">{person.initials}</span><span className="portal-list-copy"><strong>{person.name}</strong><small>{person.role}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {person.employer}</small></span><span className="verified-label"><CheckCircle2 size={14} /> {person.verified ? "Verified" : "Review"}</span><ChevronRight size={15} /></button>)}</div> : <div className="provider-course-list">{[["Solar PV Installation", "72%", 72], ["Healthcare Assistant", "68%", 68], ["Electric Vehicle Service", "74%", 74], ["Data Entry & Office Tools", "61%", 61]].map(([name, rate, width]) => <button key={name} className="provider-course-row" onClick={() => onNavigate("Courses")}><span>{name}</span><div><i style={{ width: `${width}%` }} /></div><strong>{rate}</strong><ChevronRight size={14} /></button>)}</div>}</section><section className="panel portal-attention-panel"><div className="panel-heading"><div><p className="eyebrow">{employer ? "ACTION NEEDED" : "LEARNER SUPPORT"}</p><h2>{employer ? "Verification queue" : "Follow-up opportunities"}</h2></div><span className="insight-icon">{employer ? <ShieldCheck size={17} /> : <HeartHandshake size={17} />}</span></div><strong className="portal-callout-number">{employer ? "7" : "28"}<small>{employer ? "employment records need confirmation" : "learners may need placement support"}</small></strong><p>{employer ? "Confirm role, joining date, and wage to strengthen programme outcome records." : "These learners have completed training but have not yet reported a placement."}</p><button className="panel-link" onClick={() => onNavigate(employer ? "Verification" : "Trainees")}>{employer ? "Review pending verifications" : "View learner list"} <ArrowRight size={14} /></button></section></div>
    <section className="panel portal-bottom-panel"><div className="panel-heading"><div><p className="eyebrow">{employer ? "SKILLS IN YOUR WORKFORCE" : "COHORT ACTIVITY"}</p><h2>{employer ? "Most hired skills" : "Latest trainee updates"}</h2></div><button className="panel-link panel-link-button" onClick={() => onNavigate(employer ? "Reports" : "Trainees")}>See details <ArrowRight size={14} /></button></div><div className="portal-skills">{(employer ? [["Solar installation", 78], ["Patient care", 61], ["EV diagnostics", 52], ["Retail operations", 43]] : [["Assessment passed", 94], ["Certification issued", 87], ["Placed in work", 72], ["Six-month retained", 68]]).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}%</strong><div><i style={{ width: `${value}%` }} /></div></div>)}</div></section>
  </>;
}

function EmployerDashboard({ records, onNavigate, onOpenTrainee }) {
  const employees = records.filter((person) => person.employer && person.employer !== "Self-employed");
  const pending = employees.filter((person) => !person.verified).length;
  const active = employees.filter((person) => ["Employed", "Apprentice", "Self-employed"].includes(person.status)).length;
  const retained = employees.filter((person) => Number.parseInt(person.retention, 10) >= 6).length;
  const activePercent = employees.length ? Math.round(active / employees.length * 100) : 0;
  return <div className="employer-dashboard">
    <div className="metric-grid employer-summary-grid"><Metric icon={Users} label="Employees / trainees" value={employees.length} note="Company employment records" tone="green" /><Metric icon={ShieldCheck} label="Pending verification" value={pending} note="Employment claims to review" tone="orange" /><Metric icon={HeartHandshake} label="Employment & retention" value={retained} note="Active for 6+ months" tone="blue" /></div>
    <div className="employer-action-grid"><section className="panel employer-action-card"><span className="metric-icon green"><BriefcaseBusiness size={17} /></span><p className="eyebrow">HIRING SUMMARY</p><h2>Workforce at a glance</h2><p>{employees.length} employment records and {active} active employees or trainees.</p><button className="button button-light" onClick={() => onNavigate("Employees")}>View employees <ArrowRight size={15} /></button></section><section className="panel employer-action-card pending-action-card"><span className="metric-icon orange"><ShieldCheck size={17} /></span><p className="eyebrow">PENDING VERIFICATIONS</p><h2>{pending} claims need review</h2><p>Confirm employment details to keep company outcomes up to date.</p><button className="button button-primary" onClick={() => onNavigate("Verification")}>Review verifications <ArrowRight size={15} /></button></section></div>
    <div className="employer-insight-grid"><section className="panel employer-insight-card"><div><p className="eyebrow">HIRING & RETENTION HEALTH</p><h2>Active workforce</h2><p>Share of tracked records with an active employment status.</p></div><div className="employer-donut" style={{ "--progress": `${activePercent}%` }}><span><strong>{activePercent}%</strong><small>active</small></span></div></section><section className="panel employer-insight-card"><div><p className="eyebrow">RETENTION TREND</p><h2>Workforce continuity</h2><p>{retained} employees have reached the 6-month milestone.</p><button className="panel-link" onClick={() => onNavigate("Salary & Retention")}>View retention <ArrowRight size={14} /></button></div><div className="retention-sparkline"><svg viewBox="0 0 340 95" preserveAspectRatio="none" aria-label="Retention trend"><path d="M0 76 C40 70 48 60 82 66 S130 48 166 55 S220 37 251 43 S300 21 340 19" fill="none" stroke="#438362" strokeWidth="3"/><path d="M0 76 C40 70 48 60 82 66 S130 48 166 55 S220 37 251 43 S300 21 340 19 L340 95 L0 95Z" fill="#438362" fillOpacity=".08"/></svg><div><span>0 months</span><span>3 months</span><span>6+ months</span></div></div></section></div>
    <section className="panel employer-overview-panel"><div className="panel-heading"><div><p className="eyebrow">EMPLOYMENT & RETENTION</p><h2>Workforce overview</h2></div><button className="panel-link panel-link-button" onClick={() => onNavigate("Employees")}>View all employees <ArrowRight size={14} /></button></div><div className="table-wrap"><table><thead><tr><th>Name / ID</th><th>Job role</th><th>Status</th><th>Joining date</th><th>Monthly wage</th><th>Verification</th></tr></thead><tbody>{employees.slice(0, 6).map((person) => <tr key={person.id} onClick={() => onOpenTrainee(person)} className="employer-overview-row"><td><strong>{person.name}</strong><small>{person.id}</small></td><td>{person.role || "Not provided"}</td><td><OutcomeBadge status={person.status} /></td><td>{person.joinedAt || "Not recorded"}</td><td>{person.wage ? money(person.wage) : "Not reported"}</td><td><span className={person.verified ? "verified-label" : "status-tag tag-due"}>{person.verified ? "Verified" : "Pending"}</span></td></tr>)}</tbody></table>{!employees.length && <div className="empty-state">No employee or trainee records are linked to this company yet.</div>}</div></section>
  </div>;
}

function PortalOverview({ role, records, onNavigate, onOpenTrainee }) {
  if (role !== "Employer") return <LegacyPortalOverview role={role} records={records} onNavigate={onNavigate} onOpenTrainee={onOpenTrainee} />;
  return <EmployerDashboard records={records} onNavigate={onNavigate} onOpenTrainee={onOpenTrainee} />;
  const employees = records.filter((person) => person.employer && person.employer !== "Self-employed");
  const pending = employees.filter((person) => !person.verified).length;
  const retained = employees.filter((person) => Number.parseInt(person.retention, 10) >= 6).length;
  const averageWage = employees.length ? Math.round(employees.reduce((sum, person) => sum + (person.wage || 0), 0) / employees.length) : 0;
  const metrics = [
    [Users, "Employees / trainees hired", employees.length, "In your employer workspace", "green"],
    [ShieldCheck, "Pending verifications", pending, `${pending} need confirmation`, "orange"],
    [HeartHandshake, "Retained at 6 months", `${employees.length ? Math.round(retained / employees.length * 100) : 0}%`, `${retained} employees in current records`, "blue"],
    [WalletCards, "Average monthly wage", money(averageWage), `Across ${employees.length} employees`, "violet"],
  ];
  return <>
    <div className="cohort-strip"><div><span className="strip-icon"><Building2 size={17} /></span><span><strong>Skills pathway hiring</strong><small>Employment outcomes from training programme partners</small></span></div><button className="select-button" onClick={() => onNavigate("Reports")}>Hiring summary <ArrowRight size={14} /></button><span className="strip-divider" /><span className="strip-updated"><i /> Live company data</span></div>
    <div className="metric-grid">{metrics.map(([icon, label, value, note, tone]) => <Metric key={label} icon={icon} label={label} value={value} trend={label === "Pending verifications" ? `${pending} open` : "Current data"} note={note} tone={tone} />)}</div>
    <div className="portal-overview-grid"><section className="panel portal-main-panel"><div className="panel-heading"><div><p className="eyebrow">EMPLOYEES / TRAINEES HIRED</p><h2>Recent hires</h2></div><button className="panel-link panel-link-button" onClick={() => onNavigate("Employees")}>Employee list <ArrowRight size={14} /></button></div><div className="portal-list">{employees.slice(0, 4).map((person) => <button className="portal-list-row" key={person.id} onClick={() => onOpenTrainee(person)}><span className="person-avatar sage">{person.initials}</span><span className="portal-list-copy"><strong>{person.name}</strong><small>{person.role}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {person.employer}</small></span><span className="verified-label"><CheckCircle2 size={14} /> {person.verified ? "Verified" : "Review"}</span><ChevronRight size={15} /></button>)}{employees.length === 0 && <div className="empty-state">No employees are linked to this company yet.</div>}</div></section><section className="panel portal-attention-panel"><div className="panel-heading"><div><p className="eyebrow">PENDING VERIFICATIONS</p><h2>Needs your review</h2></div><span className="insight-icon"><ShieldCheck size={17} /></span></div><strong className="portal-callout-number">{pending}<small>employment record{pending === 1 ? "" : "s"} need confirmation</small></strong><p>Confirm role, joining date, and wage to strengthen programme outcome records.</p><button className="panel-link" onClick={() => onNavigate("Verification")}>Review pending employment <ArrowRight size={14} /></button><button className="panel-link" onClick={() => onNavigate("Notifications")}>Open company notifications <ArrowRight size={14} /></button></section></div>
    <div className="bottom-grid"><section className="panel provider-panel"><div className="panel-heading"><div><p className="eyebrow">EMPLOYMENT STATISTICS</p><h2>Workforce snapshot</h2></div><button className="panel-link panel-link-button" onClick={() => onNavigate("Employment Reports")}>Employment report <ArrowRight size={14} /></button></div><div className="employer-dashboard-stats"><div><strong>{employees.filter((person) => person.status === "Employed").length}</strong><span>Employed</span></div><div><strong>{employees.filter((person) => person.status === "Apprentice").length}</strong><span>Apprentices</span></div><div><strong>{employees.filter((person) => person.verified).length}</strong><span>Verified</span></div><div><strong>{money(averageWage)}</strong><span>Average wage</span></div></div></section><section className="panel alert-panel"><div className="panel-heading"><div><p className="eyebrow">EMPLOYEE PROGRESS</p><h2>Retention and wage updates</h2></div><span className="insight-icon"><TrendingUp size={17} /></span></div><p className="signal-title">{retained} of {employees.length} employees have at least six months in role.</p><p className="signal-copy">Review salary progression, retention, and role changes from the workforce reports.</p><button className="panel-link" onClick={() => onNavigate("Salary & Retention")}>View salary & retention <ArrowRight size={14} /></button><button className="panel-link" onClick={() => onNavigate("Employee Progress")}>View employee progress <ArrowRight size={14} /></button></section></div>
  </>;
}

function EmployerVerificationCards({ records, verifiedIds, history = [], onVerify, openTrainee, onNavigate }) {
  const employees = records.filter((person) => person.employer && person.employer !== "Self-employed");
  const pending = employees.filter((person) => !verifiedIds.has(person.id));
  const verified = employees.length - pending.length;
  const rate = employees.length ? Math.round(verified / employees.length * 100) : 0;
  const [selectedId, setSelectedId] = useState(pending[0]?.id || "");
  const selected = employees.find((person) => person.id === selectedId) || pending[0] || employees[0];
  return <div className="verification-dashboard">
    <div className="verification-card-grid"><section className="panel verification-dashboard-card"><div className="verification-card-head"><span className="metric-icon orange"><ShieldCheck size={17} /></span><span className="status-tag tag-due">{pending.length} pending</span></div><p className="eyebrow">PENDING VERIFICATION</p><h2>Employment claims to review</h2><p className="verification-card-copy">Check the employment details submitted for your company.</p><div className="verification-mini-list">{employees.slice(0, 5).map((person) => { const isVerified = verifiedIds.has(person.id); return <div key={person.id}><button className="verification-person" onClick={() => openTrainee(person)}><strong>{person.name}</strong><small>{person.role || "Role not provided"} · {person.id}</small></button><button className={`verify-button ${isVerified ? "is-verified" : ""}`} disabled={isVerified} onClick={() => onVerify(person.id)}>{isVerified ? <CheckCircle2 size={13} /> : <Check size={13} />}{isVerified ? "Verified" : "Verify"}</button></div>; })}{!employees.length && <div className="empty-state">No employment claims are available.</div>}</div><button className="panel-link" onClick={() => onNavigate("Employees")}>View employee records <ArrowRight size={14} /></button></section>
      <section className="panel verification-dashboard-card"><div className="verification-card-head"><span className="metric-icon green"><CheckCircle2 size={17} /></span><span className="verified-label">Secure confirmation</span></div><p className="eyebrow">VERIFY EMPLOYMENT</p><h2>Confirm a company record</h2><p className="verification-card-copy">Select an employee or trainee and confirm their current employment claim.</p>{employees.length ? <><label className="verification-select-label">Employee or trainee<select value={selected?.id || ""} onChange={(event) => setSelectedId(event.target.value)}>{employees.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.id}{verifiedIds.has(person.id) ? " · Verified" : " · Pending"}</option>)}</select></label>{selected && <div className="verification-selected-summary"><strong>{selected.role || "Role not provided"}</strong><span>{selected.employer} · {selected.joinedAt || selected.trained}</span><span>{selected.wage ? money(selected.wage) : "Wage not reported"}</span></div>}<button className={`button ${selected && verifiedIds.has(selected.id) ? "button-light" : "button-primary"}`} disabled={!selected || verifiedIds.has(selected.id)} onClick={() => selected && onVerify(selected.id)}>{selected && verifiedIds.has(selected.id) ? <CheckCircle2 size={15} /> : <Check size={15} />}{selected && verifiedIds.has(selected.id) ? "Verified" : "Verify employment"}</button></> : <div className="empty-state">No company employment records are available.</div>}</section></div>
    <div className="verification-card-grid verification-circle-grid"><section className="panel verification-dashboard-card verification-circle-card"><div><p className="eyebrow">VERIFICATION HISTORY</p><h2>Recorded confirmations</h2><p className="verification-card-copy">Completed and pending verification events for this company.</p><button className="panel-link" onClick={() => onNavigate("Verification History")}>Open verification history <ArrowRight size={14} /></button></div><div className="verification-ring" style={{ "--ring-value": `${history.length ? 100 : 0}%` }}><span><strong>{history.length}</strong><small>records</small></span></div></section><section className="panel verification-dashboard-card verification-circle-card"><div><p className="eyebrow">VERIFICATION STATUS</p><h2>Company record status</h2><p className="verification-card-copy">{verified} verified and {pending.length} awaiting review.</p><button className="panel-link" onClick={() => onNavigate("Employees")}>View status by employee <ArrowRight size={14} /></button></div><div className="verification-ring" style={{ "--ring-value": `${rate}%` }}><span><strong>{rate}%</strong><small>verified</small></span></div></section></div>
  </div>;
}

function EmployerVerificationPage({ records, verifiedIds, history, onVerify, openTrainee, onNavigate }) {
  return <EmployerVerificationCards records={records} verifiedIds={verifiedIds} history={history} onVerify={onVerify} openTrainee={openTrainee} onNavigate={onNavigate} />;
}

function EmployerUpdateModal({ person, close, onSubmit }) {
  const [jobRole, setJobRole] = useState(person.role || "");
  const [monthlyWage, setMonthlyWage] = useState(person.wage ? String(person.wage) : "");
  const [joinedAt, setJoinedAt] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><form className="follow-modal" onSubmit={async (event) => { event.preventDefault(); setSaving(true); await onSubmit({ role: jobRole || undefined, monthlyWage: monthlyWage ? Number(monthlyWage) : undefined, joinedAt: joinedAt || undefined, note: note || undefined }); setSaving(false); }}><div className="modal-head"><div><p className="eyebrow">EMPLOYMENT RECORD</p><h2>Update {person.name}'s details</h2></div><button type="button" className="icon-button" onClick={close} aria-label="Close update form"><X size={18} /></button></div><p className="modal-intro">Changes are submitted for review and do not replace the trainee's reported information.</p><label>Job role<input value={jobRole} onChange={(event) => setJobRole(event.target.value)} placeholder="Job role" /></label><label>Monthly wage (INR)<input type="number" min="1" step="1" value={monthlyWage} onChange={(event) => setMonthlyWage(event.target.value)} placeholder="Monthly wage" /></label><label>Joining date<input type="date" value={joinedAt} onChange={(event) => setJoinedAt(event.target.value)} /></label><label>Note for reviewer<input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional context" /></label><div className="modal-actions"><button type="button" className="button button-light" onClick={close}>Cancel</button><button className="button button-primary" type="submit" disabled={saving || (!jobRole && !monthlyWage && !joinedAt)}>{saving ? "Submitting..." : "Submit update request"}</button></div></form></div>;
}

function EmployerEmploymentHistory({ records, onOpenTrainee, onRequestUpdate }) {
  const [status, setStatus] = useState("All employees");
  const [editing, setEditing] = useState(null);
  const filtered = records.filter((item) => (status === "All employees" || item.status === status) && item.employer && item.employer !== "Self-employed");
  return <><div className="section-title-row"><div><p className="eyebrow">EMPLOYMENT RECORDS</p><h2>Roles and joining details</h2></div><label className="filter-select"><Filter size={14} /><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All employees</option><option>Employed</option><option>Apprentice</option></select><ChevronDown size={14} /></label></div><section className="panel data-panel"><div className="table-wrap"><table className="trainee-table"><thead><tr><th>Employee</th><th>Job role</th><th>Joined</th><th>Current status</th><th>Monthly wage</th><th>Progress</th><th /></tr></thead><tbody>{filtered.map((person) => <tr key={person.id} onClick={() => onOpenTrainee(person)}><td><span className="table-person"><span className="person-avatar sage">{person.initials}</span><span><strong>{person.name}</strong><small>{person.id}</small></span></span></td><td>{person.role || "-"}</td><td>{person.joinedAt || person.trained}</td><td><OutcomeBadge status={person.status} /></td><td>{person.wage ? money(person.wage) : "Not reported"}</td><td>{person.retention}</td><td><button className="icon-button" title="Request an employment detail update" aria-label={`Request update for ${person.name}`} onClick={(event) => { event.stopPropagation(); setEditing(person); }}><ArrowUpRight size={16} /></button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state">No employee records match this filter.</div>}</div></section>{editing && <EmployerUpdateModal person={editing} close={() => setEditing(null)} onSubmit={async (data) => { if (await onRequestUpdate(editing, data)) setEditing(null); }} />}</>;
}

function EmployerVerificationHistory({ items, onNavigate }) {
  const [status, setStatus] = useState("All statuses");
  const filtered = items.filter((item) => status === "All statuses" || item.status === status.toUpperCase());
  const statusLabel = (value) => value === "VERIFIED" ? "Verified" : value === "SUPERSEDED" ? "Needs re-verification" : "Pending";
  return <><div className="secondary-stat-row"><div><span>All verification events</span><strong>{items.length}</strong><small>Recorded in this workspace</small></div><div><span>Confirmed</span><strong>{items.filter((item) => item.status === "VERIFIED").length}</strong><small>Employer-confirmed</small></div><div><span>Awaiting review</span><strong>{items.filter((item) => ["PENDING", "SUPERSEDED"].includes(item.status)).length}</strong><small>Pending or changed details</small></div><div><span>Latest activity</span><strong>{items.length ? new Date(items[0].createdAt).toLocaleDateString() : "-"}</strong><small>Verification log</small></div></div><div className="section-title-row"><div><p className="eyebrow">AUDITABLE EMPLOYMENT SIGNALS</p><h2>Verification history</h2></div><label className="filter-select"><Filter size={14} /><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Verified</option><option>Pending</option><option>Superseded</option></select><ChevronDown size={14} /></label></div><section className="panel data-panel"><div className="table-wrap"><table className="trainee-table"><thead><tr><th>Employee</th><th>Submitted role</th><th>Monthly wage</th><th>Status</th><th>Submitted</th><th>Verified</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><strong>{item.traineeName}</strong><small className="history-id">{item.traineeId}</small></td><td>{item.role || "-"}</td><td>{item.monthlyWage ? money(item.monthlyWage) : "-"}</td><td><span className={`status-tag ${item.status === "VERIFIED" ? "tag-done" : "tag-due"}`}>{statusLabel(item.status)}</span></td><td>{new Date(item.createdAt).toLocaleString()}</td><td>{item.verifiedAt ? new Date(item.verifiedAt).toLocaleString() : "-"}</td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state">No verification events match this status.</div>}</div><div className="verification-note"><ShieldCheck size={16} /><span>Verification history remains an audit trail; a changed employment claim returns to review without deleting its previous confirmation.</span></div></section><button className="panel-link" onClick={() => onNavigate("Verification")}>Back to pending verification <ArrowRight size={14} /></button></>;
}

function NotificationsPage({ items, onRead }) {
  const [filter, setFilter] = useState("All notifications");
  const visible = items.filter((item) => filter === "All notifications" || (filter === "Unread" ? !item.isRead : item.isRead));
  return <><div className="notification-center-toolbar"><div className="notification-center-count"><strong>{items.filter((item) => !item.isRead).length}</strong><span>unread notifications</span></div><label className="filter-select"><Filter size={14} /><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All notifications</option><option>Unread</option><option>Read</option></select><ChevronDown size={14} /></label></div><section className="panel notification-center">{visible.map((item) => <button key={item.id} className={`notification-center-row ${item.isRead ? "" : "notification-center-unread"}`} onClick={() => !item.isRead && onRead(item)}><span className="notification-center-icon"><Bell size={16} /></span><span className="notification-center-copy"><strong>{item.title}</strong><small>{item.body}</small><time>{new Date(item.createdAt).toLocaleString()}</time></span>{!item.isRead && <i aria-label="Unread" />}</button>)}{visible.length === 0 && <div className="empty-state">No notifications in this view.</div>}</section></>;
}

function EmployerSalaryEmployment({ records, onOpenTrainee }) {
  const active = records.filter((person) => ["Employed", "Apprentice", "Self-employed"].includes(person.status));
  const wageAverage = records.length ? Math.round(records.reduce((sum, person) => sum + Number(person.wage || 0), 0) / records.length) : 0;
  const wageGrowth = records.length ? Math.round(records.reduce((sum, person) => sum + Number(person.change || 0), 0) / records.length) : 0;
  const retained = records.filter((person) => Number.parseInt(person.retention, 10) >= 6).length;
  const retentionRate = records.length ? Math.round(retained / records.length * 100) : 0;
  const salaryUpdated = records.filter((person) => Number(person.wage) > 0).length;
  const reviewRecords = records.filter((person) => !person.verified || !person.wage || !person.role);
  const statusCounts = [["Active employees", records.filter((person) => person.status === "Employed").length], ["Apprentices", records.filter((person) => person.status === "Apprentice").length], ["Self-employed", records.filter((person) => person.status === "Self-employed").length], ["Exited", records.filter((person) => ["Left", "Exited"].includes(person.status)).length]];
  const initialWage = records.length ? Math.round(records.reduce((sum, person) => sum + (Number(person.startingWage) || (Number(person.wage || 0) / (1 + Number(person.change || 0) / 100))), 0) / records.length) : 0;
  const maxWage = Math.max(wageAverage, initialWage, 1);
  return <div className="salary-employment-dashboard">
    <div className="salary-metric-grid"><Metric icon={Users} label="Active employees" value={active.length} note="Currently working" tone="green" /><Metric icon={WalletCards} label="Average monthly wage" value={money(wageAverage)} note="Across company records" tone="blue" /><Metric icon={TrendingUp} label="Average wage growth" value={`${wageGrowth}%`} note="From joining wage" tone="violet" /><Metric icon={HeartHandshake} label="Employment retention" value={`${retentionRate}%`} note="Reached 6 months" tone="green" /><Metric icon={CheckCircle2} label="Salary records updated" value={salaryUpdated} note={`Of ${records.length} records`} tone="blue" /><Metric icon={ClipboardCheck} label="Employees needing update" value={reviewRecords.length} note="Verification or details due" tone="orange" /></div>
    <div className="salary-dashboard-row"><section className="panel salary-dashboard-card"><p className="eyebrow">EMPLOYMENT OVERVIEW</p><h2>Current workforce</h2><p className="salary-card-note">Employment status across tracked company records.</p><div className="employment-status-bars">{statusCounts.map(([label, count]) => <div key={label}><span>{label}</span><strong>{count}</strong><i><b style={{ width: `${records.length ? Math.max(count ? 5 : 0, count / records.length * 100) : 0}%` }} /></i></div>)}</div></section><section className="panel salary-dashboard-card"><p className="eyebrow">WAGE PROGRESSION</p><h2>Joining to current wage</h2><p className="salary-card-note">Average monthly wages for this company.</p><div className="wage-progression-bars"><div><span style={{ height: `${Math.max(8, initialWage / maxWage * 100)}%` }} /><strong>{money(initialWage)}</strong><small>Joining wage</small></div><div><span style={{ height: `${Math.max(8, wageAverage / maxWage * 100)}%` }} /><strong>{money(wageAverage)}</strong><small>Current wage</small></div></div></section></div>
    <div className="salary-dashboard-row"><section className="panel salary-dashboard-card retention-overview-card"><div><p className="eyebrow">RETENTION OVERVIEW</p><h2>Six-month milestone</h2><p className="salary-card-note">Employees retained for 6 months or longer.</p><strong className="retention-overview-number">{retained}<small>of {records.length} employees</small></strong></div><div className="verification-ring" style={{ "--ring-value": `${retentionRate}%` }}><span><strong>{retentionRate}%</strong><small>retained</small></span></div></section><section className="panel salary-dashboard-card"><p className="eyebrow">RECORDS TO REVIEW</p><h2>{reviewRecords.length} employees need an update</h2><p className="salary-card-note">Review missing salary, role, or employment verification.</p><div className="review-record-list">{reviewRecords.slice(0, 3).map((person) => <button key={person.id} onClick={() => onOpenTrainee(person)}><span><strong>{person.name}</strong><small>{person.role || "Role or salary details missing"}</small></span><span className={person.verified ? "tag-done status-tag" : "tag-due status-tag"}>{person.verified ? "Update" : "Verify"}</span></button>)}{!reviewRecords.length && <div className="empty-state">All employment records are up to date.</div>}</div></section></div>
    <section className="panel salary-dashboard-card transitions-card"><p className="eyebrow">EMPLOYMENT TRANSITIONS</p><h2>Workforce movement</h2><p className="salary-card-note">Current employment categories in your records.</p><div className="transition-summary">{statusCounts.map(([label, count]) => <div key={label}><strong>{count}</strong><span>{label}</span><i><b style={{ width: `${records.length ? Math.max(count ? 5 : 0, count / records.length * 100) : 0}%` }} /></i></div>)}</div></section>
    <section className="panel salary-dashboard-card employee-outcomes-card"><div className="panel-heading"><div><p className="eyebrow">EMPLOYEE OUTCOMES</p><h2>Employment and salary</h2></div><span className="salary-card-note">{records.length} workforce records</span></div><div className="table-wrap"><table className="trainee-table"><thead><tr><th>Employee</th><th>Job role</th><th>Employment</th><th>Monthly salary</th><th>Wage growth</th><th>Retention</th></tr></thead><tbody>{records.map((person) => <tr key={person.id} onClick={() => onOpenTrainee(person)} className="employer-overview-row"><td><strong>{person.name}</strong><small>{person.id}</small></td><td>{person.role || "Not provided"}</td><td><OutcomeBadge status={person.status} /></td><td>{person.wage ? money(person.wage) : "Not reported"}</td><td>{Number(person.change || 0)}%</td><td>{person.retention || "Not recorded"}</td></tr>)}</tbody></table>{!records.length && <div className="empty-state">No employment outcome records are available.</div>}</div></section>
  </div>;
}

const starterSkillRequirements = {
  "Solar Technician": ["Electrical safety", "Solar PV installation", "System commissioning"],
  "EV Service Technician": ["Battery diagnostics", "Vehicle safety", "Digital diagnostics"],
  "Patient Care Assistant": ["Patient care", "Infection control", "Patient communication"],
  "Data Entry Operator": ["Data entry", "Spreadsheet skills", "Data accuracy"],
};

function employerSkillSet(person) {
  if (Array.isArray(person.skills) && person.skills.length) return person.skills;
  const source = `${person.role || ""} ${person.course || ""}`.toLowerCase();
  if (/solar|pv/.test(source)) return ["Electrical safety", "Solar PV installation", "System commissioning"];
  if (/electric vehicle|ev service|battery/.test(source)) return ["Battery diagnostics", "Vehicle safety", "Digital diagnostics"];
  if (/health|patient|care assistant/.test(source)) return ["Patient care", "Infection control", "Patient communication"];
  if (/data entry|office tools|data operator/.test(source)) return ["Data entry", "Spreadsheet skills", "Data accuracy"];
  if (/retail/.test(source)) return ["Customer service", "Point of sale", "Inventory handling"];
  return [];
}

function EmployerSkillsPage({ records, onNotice }) {
  const employerUser = readStoredObject("kaaryaUser");
  const keyPrefix = `kaaryaEmployerSkills:${String(employerUser?.email || "company").trim().toLowerCase()}`;
  const loadSaved = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(`${keyPrefix}:${key}`)) ?? fallback; } catch { return fallback; }
  };
  const [requirements, setRequirements] = useState(() => loadSaved("requirements", starterSkillRequirements));
  const [feedback, setFeedback] = useState(() => loadSaved("feedback", []));
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [newRole, setNewRole] = useState(Object.keys(starterSkillRequirements)[0]);
  const [newSkill, setNewSkill] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState({ provider: "", course: "", rating: "4", transfers: "", needsPractice: "" });
  const skillProfiles = records.map((person) => ({ person, skills: employerSkillSet(person) }));
  const inDemand = [...new Set(Object.values(requirements).flat())].map((skill) => ({ skill, count: skillProfiles.filter(({ skills }) => skills.some((item) => item.toLowerCase() === skill.toLowerCase())).length })).sort((a, b) => b.count - a.count);
  const totalRequired = Object.values(requirements).reduce((sum, skills) => sum + skills.length, 0);
  const totalMatched = Object.entries(requirements).reduce((sum, [role, skills]) => sum + skillProfiles.filter(({ person }) => person.role?.toLowerCase().includes(role.split(" ")[0].toLowerCase())).reduce((matched, { skills: employeeSkills }) => matched + skills.filter((skill) => employeeSkills.some((item) => item.toLowerCase() === skill.toLowerCase())).length, 0), 0);
  const relevance = totalRequired ? Math.min(100, Math.round(totalMatched / Math.max(totalRequired, skillProfiles.length) * 100)) : 0;
  const gaps = skillProfiles.reduce((sum, { person, skills }) => {
    const role = Object.keys(requirements).find((name) => person.role?.toLowerCase().includes(name.split(" ")[0].toLowerCase()));
    return sum + (role ? requirements[role].filter((skill) => !skills.some((item) => item.toLowerCase() === skill.toLowerCase())).length : 0);
  }, 0);
  const filteredProfiles = skillProfiles.filter(({ person }) => `${person.name} ${person.id} ${person.role} ${person.course}`.toLowerCase().includes(employeeSearch.toLowerCase()));
  const persist = (key, value) => localStorage.setItem(`${keyPrefix}:${key}`, JSON.stringify(value));
  const addRequiredSkill = (event) => {
    event.preventDefault();
    const skill = newSkill.trim();
    if (!skill) return;
    const next = { ...requirements, [newRole]: requirements[newRole].some((item) => item.toLowerCase() === skill.toLowerCase()) ? requirements[newRole] : [...requirements[newRole], skill] };
    setRequirements(next);
    persist("requirements", next);
    setNewSkill("");
    setAddSkillOpen(false);
    onNotice("Required skill added.");
  };
  const submitFeedback = (event) => {
    event.preventDefault();
    const entry = { ...feedbackDraft, id: Date.now(), submittedAt: new Date().toLocaleDateString("en-IN") };
    const next = [entry, ...feedback];
    setFeedback(next);
    persist("feedback", next);
    setFeedbackDraft({ provider: "", course: "", rating: "4", transfers: "", needsPractice: "" });
    onNotice("Employer feedback saved.");
  };
  return <div className="employer-skills-page">
    <div className="employer-skill-summary-grid"><Metric icon={Target} label="Required skills" value={totalRequired} note="Across job roles" tone="green" /><Metric icon={TrendingDown} label="Skill gaps" value={gaps} note="Across this workforce" tone="orange" /><Metric icon={Sparkles} label="In-demand skills" value={inDemand.length} note="Represented in role needs" tone="blue" /><Metric icon={GraduationCap} label="Training relevance" value={`${relevance}%`} note="Workforce skill alignment" tone="violet" /></div>
    <div className="employer-skill-feature-grid"><section className="panel employer-skill-feature"><p className="eyebrow">IN-DEMAND SKILLS</p><h2>Skills present in this workforce</h2><p className="skills-help-copy">Skills matched against the requirements for your company roles.</p>{inDemand.slice(0, 5).map(({ skill, count }) => <div className="demand-skill-row" key={skill}><span>{skill}</span><i><b style={{ width: `${records.length ? Math.max(count ? 6 : 0, count / records.length * 100) : 0}%` }} /></i><strong>{count}</strong></div>)}{!inDemand.length && <div className="empty-state">Add role requirements to see workforce demand.</div>}</section><section className="panel employer-skill-feature relevance-feature"><p className="eyebrow">TRAINING RELEVANCE</p><h2>Workforce skill alignment</h2><p className="skills-help-copy">Percentage of required role skills currently represented in employee records.</p><div className="relevance-score"><strong>{relevance}%</strong><span>aligned skills</span></div><div className="relevance-bar"><i style={{ width: `${relevance}%` }} /></div><small>{feedback.length ? `${feedback.length} employer feedback entr${feedback.length === 1 ? "y" : "ies"} recorded` : "Share field feedback below to add training context."}</small></section></div>
    <section className="panel employer-skill-section"><div className="panel-heading"><div><p className="eyebrow">ROLE REQUIREMENTS</p><h2>Required skills</h2></div><button className="button button-primary" onClick={() => setAddSkillOpen((open) => !open)}><Plus size={15} /> Add skill</button></div>{addSkillOpen && <form className="add-required-skill-form" onSubmit={addRequiredSkill}><label>Job role<select value={newRole} onChange={(event) => setNewRole(event.target.value)}>{Object.keys(requirements).map((role) => <option key={role}>{role}</option>)}</select></label><label>Required skill<input value={newSkill} onChange={(event) => setNewSkill(event.target.value)} placeholder="e.g. Workplace safety" required /></label><button className="button button-primary" type="submit">Save skill</button></form>}<div className="required-role-grid">{Object.entries(requirements).map(([role, skills]) => <article key={role}><strong>{role}</strong><div>{skills.map((skill) => <span className="skill-chip" key={skill}>{skill}<button type="button" aria-label={`Remove ${skill}`} onClick={() => { const next = { ...requirements, [role]: skills.filter((item) => item !== skill) }; setRequirements(next); persist("requirements", next); }}>×</button></span>)}</div></article>)}</div></section>
    <section className="panel employer-skill-section"><div className="panel-heading development-map-heading"><div><p className="eyebrow">EMPLOYEE BY EMPLOYEE</p><h2>Development map</h2></div><label className="skills-search"><Search size={15} /><input value={employeeSearch} onChange={(event) => setEmployeeSearch(event.target.value)} placeholder="Search employees or roles" /></label></div><div className="development-map-list">{filteredProfiles.map(({ person, skills }) => { const role = Object.keys(requirements).find((name) => person.role?.toLowerCase().includes(name.split(" ")[0].toLowerCase())); const missing = role ? requirements[role].filter((skill) => !skills.some((item) => item.toLowerCase() === skill.toLowerCase())) : []; const matchPercent = role && requirements[role].length ? Math.round((requirements[role].length - missing.length) / requirements[role].length * 100) : 0; return <article key={person.id}><div className="development-person"><span className="person-avatar sage">{person.initials}</span><span><strong>{person.name}</strong><small>{person.role || person.course} · {person.id}</small></span><b>{matchPercent}% match</b></div><div className="development-skills"><span><small>Skills present</small>{skills.length ? skills.map((skill) => <i key={skill}>{skill}</i>) : <em>No skills recorded</em>}</span><span><small>Skill gaps</small>{missing.length ? missing.map((skill) => <i className="gap-skill" key={skill}>{skill}</i>) : <em>No identified gaps</em>}</span></div></article>; })}{!filteredProfiles.length && <div className="empty-state">No employees match your search.</div>}</div></section>
    <section className="panel employer-skill-section employer-feedback-section"><div><p className="eyebrow">EMPLOYER FEEDBACK FROM THE FIELD</p><h2>Share training feedback</h2><p className="skills-help-copy">Tell training partners what transfers well to work and where employees need more practice.</p></div><form className="employer-feedback-form" onSubmit={submitFeedback}><label>Training provider<input value={feedbackDraft.provider} onChange={(event) => setFeedbackDraft({ ...feedbackDraft, provider: event.target.value })} placeholder="Provider name" required /></label><label>Course<input value={feedbackDraft.course} onChange={(event) => setFeedbackDraft({ ...feedbackDraft, course: event.target.value })} placeholder="Course or programme" required /></label><label>Training relevance<select value={feedbackDraft.rating} onChange={(event) => setFeedbackDraft({ ...feedbackDraft, rating: event.target.value })}><option value="5">5 · Highly relevant</option><option value="4">4 · Relevant</option><option value="3">3 · Partly relevant</option><option value="2">2 · Needs improvement</option><option value="1">1 · Not relevant</option></select></label><label>Skills that transfer well<textarea value={feedbackDraft.transfers} onChange={(event) => setFeedbackDraft({ ...feedbackDraft, transfers: event.target.value })} placeholder="What are employees applying on the job?" required /></label><label>Areas needing more practice<textarea value={feedbackDraft.needsPractice} onChange={(event) => setFeedbackDraft({ ...feedbackDraft, needsPractice: event.target.value })} placeholder="What should the training include more of?" required /></label><button className="button button-primary" type="submit">Save employer feedback</button></form>{feedback.length > 0 && <div className="saved-feedback-list">{feedback.slice(0, 3).map((item) => <article key={item.id}><strong>{item.course} · {item.provider}</strong><span>{item.rating}/5 relevance · {item.submittedAt}</span><p>{item.transfers}</p><small>More practice: {item.needsPractice}</small></article>)}</div>}</section>
  </div>;
}

function EmployerHiringRetentionTab({ records, onNavigate }) {
  const employees = records.filter((person) => person.employer && person.employer !== "Self-employed");
  const active = employees.filter((person) => ["Employed", "Apprentice", "Self-employed"].includes(person.status)).length;
  const retained = employees.filter((person) => Number.parseInt(person.retention, 10) >= 6).length;
  const exits = employees.filter((person) => ["Left", "Exited"].includes(person.status)).length;
  const milestones = [["Under 3 months", employees.filter((person) => Number.parseInt(person.retention, 10) < 3).length], ["3–5 months", employees.filter((person) => { const months = Number.parseInt(person.retention, 10); return months >= 3 && months < 6; }).length], ["6–11 months", employees.filter((person) => { const months = Number.parseInt(person.retention, 10); return months >= 6 && months < 12; }).length], ["12+ months", employees.filter((person) => Number.parseInt(person.retention, 10) >= 12).length]];
  const recent = [...employees].sort((a, b) => new Date(b.joinedAt || b.trained || 0) - new Date(a.joinedAt || a.trained || 0)).slice(0, 6);
  const maxMilestone = Math.max(...milestones.map(([, count]) => count), 1);
  return <div className="employer-reports-dashboard"><div className="reports-metric-grid"><Metric icon={Users} label="People hired" value={employees.length} note="Company workforce records" tone="green" /><Metric icon={BriefcaseBusiness} label="Currently active" value={active} note="Active employees and trainees" tone="blue" /><Metric icon={HeartHandshake} label="Retained 6+ months" value={retained} note="Reached a retention milestone" tone="violet" /><Metric icon={LogOut} label="Recorded exits" value={exits} note="Employees marked as exited" tone="orange" /></div><div className="employer-report-cards"><section className="panel employer-report-card"><div className="panel-heading"><div><p className="eyebrow">RETENTION MILESTONES</p><h2>How long people stay</h2></div><span className="metric-icon green"><HeartHandshake size={17} /></span></div><p className="report-card-copy">Company workforce grouped by recorded time in employment.</p><div className="retention-milestone-list">{milestones.map(([label, count]) => <div key={label}><span>{label}</span><i><b style={{ width: `${count ? Math.max(6, count / maxMilestone * 100) : 0}%` }} /></i><strong>{count}</strong></div>)}</div><button className="panel-link" onClick={() => onNavigate("Salary & Retention")}>View salary & employment <ArrowRight size={14} /></button></section><section className="panel employer-report-card"><div className="panel-heading"><div><p className="eyebrow">HIRING ROSTER</p><h2>Recent workforce outcomes</h2></div><button className="panel-link panel-link-button" onClick={() => onNavigate("Employees")}>View all <ArrowRight size={14} /></button></div><div className="table-wrap"><table className="trainee-table"><thead><tr><th>Employee</th><th>Role</th><th>Status</th><th>Joined</th><th>Monthly wage</th></tr></thead><tbody>{recent.map((person) => <tr key={person.id}><td><strong>{person.name}</strong><small className="history-id">{person.id}</small></td><td>{person.role || "Not provided"}</td><td><OutcomeBadge status={person.status} /></td><td>{person.joinedAt || person.trained || "Not recorded"}</td><td>{person.wage ? money(person.wage) : "Not reported"}</td></tr>)}</tbody></table>{!recent.length && <div className="empty-state">No workforce outcomes recorded yet.</div>}</div></section></div></div>;
}

function EmployerReportsDashboard({ records, onNavigate }) {
  const [tab, setTab] = useState("hiring");
  const [period, setPeriod] = useState("All time");
  const [status, setStatus] = useState("All statuses");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const visible = records.filter((person) => {
    const searchText = `${person.name || ""} ${person.id || ""} ${person.role || ""} ${person.course || ""}`.toLowerCase();
    if (employeeSearch && !searchText.includes(employeeSearch.toLowerCase())) return false;
    if (status !== "All statuses" && person.status !== status) return false;
    if (period !== "All time") {
      const months = period === "Last 6 months" ? 6 : 12;
      const dateValue = person.joinedAt || person.trainedAtIso || person.trained;
      const date = dateValue ? new Date(dateValue) : null;
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - months);
      if (date && !Number.isNaN(date.getTime()) && date < cutoff) return false;
    }
    return true;
  });
  return <div className="reports-tabs-layout"><div className="reports-toolbar"><div className="reports-tabs" role="tablist" aria-label="Company reports">{[["hiring", "Hiring & Retention"], ["salary", "Salary & Wage"], ["employment", "Employment Trends"]].map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "reports-tab active" : "reports-tab"} onClick={() => setTab(id)}>{label}</button>)}</div><div className="reports-filters"><label className="reports-filter-select"><span>Period</span><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>All time</option><option>Last 12 months</option><option>Last 6 months</option></select></label><label className="reports-filter-select"><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Employed</option><option>Apprentice</option><option>Self-employed</option><option>Seeking work</option><option>Left</option><option>Exited</option></select></label><label className="reports-employee-search"><Search size={15} /><input value={employeeSearch} onChange={(event) => setEmployeeSearch(event.target.value)} placeholder="Search employee" /></label></div></div>{tab === "hiring" ? <EmployerHiringRetentionTab records={visible} onNavigate={onNavigate} /> : tab === "salary" ? <EmployerSalaryWageTab records={visible} /> : <EmployerEmploymentTrendsTab records={visible} />}</div>;
}

function EmployerSalaryWageTab({ records }) {
  const wages = records.map((person) => Number(person.wage || 0)).filter((wage) => wage > 0).sort((a, b) => a - b);
  const average = wages.length ? Math.round(wages.reduce((sum, wage) => sum + wage, 0) / wages.length) : 0;
  const median = wages.length ? Math.round(wages.length % 2 ? wages[(wages.length - 1) / 2] : (wages[wages.length / 2 - 1] + wages[wages.length / 2]) / 2) : 0;
  const payroll = wages.reduce((sum, wage) => sum + wage, 0);
  const growth = records.length ? Math.round(records.reduce((sum, person) => sum + Number(person.change || 0), 0) / records.length) : 0;
  const bands = [["Under INR 15k", wages.filter((wage) => wage < 15000).length], ["INR 15k–25k", wages.filter((wage) => wage >= 15000 && wage < 25000).length], ["INR 25k–35k", wages.filter((wage) => wage >= 25000 && wage < 35000).length], ["INR 35k+", wages.filter((wage) => wage >= 35000).length]];
  const maxBand = Math.max(...bands.map(([, count]) => count), 1);
  const startingAverage = records.length ? Math.round(records.reduce((sum, person) => sum + (Number(person.startingWage) || Number(person.wage || 0) / (1 + Number(person.change || 0) / 100)), 0) / records.length) : 0;
  return <div className="employer-report-tab-content"><div className="reports-metric-grid"><Metric icon={WalletCards} label="Average monthly wage" value={money(average)} note="Across reported salaries" tone="green" /><Metric icon={HandCoins} label="Median monthly wage" value={money(median)} note="Middle reported salary" tone="blue" /><Metric icon={TrendingUp} label="Average wage growth" value={`${growth}%`} note="Since joining" tone="violet" /><Metric icon={BriefcaseBusiness} label="Total monthly payroll" value={money(payroll)} note={`${wages.length} salary records`} tone="orange" /></div><div className="employer-report-cards"><section className="panel employer-report-card"><div className="panel-heading"><div><p className="eyebrow">WAGE DISTRIBUTION</p><h2>Monthly salary ranges</h2></div><span className="metric-icon blue"><WalletCards size={17} /></span></div><p className="report-card-copy">Employees grouped by their current reported monthly wage.</p><div className="retention-milestone-list salary-distribution-list">{bands.map(([label, count]) => <div key={label}><span>{label}</span><i><b style={{ width: `${count ? Math.max(6, count / maxBand * 100) : 0}%` }} /></i><strong>{count}</strong></div>)}</div></section><section className="panel employer-report-card"><div className="panel-heading"><div><p className="eyebrow">WAGE PROGRESSION</p><h2>Joining to current average</h2></div><span className="positive"><TrendingUp size={13} /> {growth}%</span></div><p className="report-card-copy">Average monthly wage across the company workforce.</p><div className="salary-comparison"><div><small>Joining wage</small><strong>{money(startingAverage)}</strong><i><b style={{ width: `${average ? Math.min(100, startingAverage / Math.max(average, startingAverage, 1) * 100) : 0}%` }} /></i></div><div><small>Current wage</small><strong>{money(average)}</strong><i><b style={{ width: "100%" }} /></i></div></div></section></div></div>;
}

function EmployerEmploymentTrendsTab({ records }) {
  const employed = records.filter((person) => person.status === "Employed").length;
  const apprentices = records.filter((person) => person.status === "Apprentice").length;
  const selfEmployed = records.filter((person) => person.status === "Self-employed").length;
  const exited = records.filter((person) => ["Left", "Exited"].includes(person.status)).length;
  const statusRows = [["Employed", employed], ["Apprentices", apprentices], ["Self-employed", selfEmployed], ["Exited", exited], ["Seeking work", records.filter((person) => person.status === "Seeking work").length]];
  const maxStatus = Math.max(...statusRows.map(([, count]) => count), 1);
  const recent = [...records].sort((a, b) => new Date(b.joinedAt || b.trained || 0) - new Date(a.joinedAt || a.trained || 0)).slice(0, 6);
  return <div className="employer-report-tab-content"><div className="reports-metric-grid"><Metric icon={Users} label="Total workforce records" value={records.length} note="All company employment records" tone="green" /><Metric icon={BriefcaseBusiness} label="Employed workers" value={employed} note="Currently employed" tone="blue" /><Metric icon={GraduationCap} label="Apprentices" value={apprentices} note="Apprenticeship records" tone="violet" /><Metric icon={LogOut} label="Self-employed / exited" value={`${selfEmployed} / ${exited}`} note="Other workforce outcomes" tone="orange" /></div><div className="employer-report-cards"><section className="panel employer-report-card"><div className="panel-heading"><div><p className="eyebrow">STATUS DISTRIBUTION</p><h2>Employment trends</h2></div><span className="metric-icon green"><Activity size={17} /></span></div><p className="report-card-copy">Current workforce status across company records.</p><div className="retention-milestone-list">{statusRows.map(([label, count]) => <div key={label}><span>{label}</span><i><b style={{ width: `${count ? Math.max(6, count / maxStatus * 100) : 0}%` }} /></i><strong>{count}</strong></div>)}</div></section><section className="panel employer-report-card"><div className="panel-heading"><div><p className="eyebrow">JOINING ACTIVITY</p><h2>Recent workforce changes</h2></div><span className="metric-icon blue"><CalendarDays size={17} /></span></div><p className="report-card-copy">Recent hiring and exit activity recorded in the workforce.</p><div className="table-wrap"><table className="trainee-table"><thead><tr><th>Employee</th><th>Status</th><th>Joining / exit date</th></tr></thead><tbody>{recent.map((person) => <tr key={person.id}><td><strong>{person.name}</strong><small className="history-id">{person.id}</small></td><td><OutcomeBadge status={person.status} /></td><td>{person.joinedAt || person.trained || "Not recorded"}</td></tr>)}</tbody></table>{!recent.length && <div className="empty-state">No workforce activity recorded yet.</div>}</div></section></div></div>;
}

function EmployerHelpSupport({ onNavigate }) {
  const faqs = [
    ["How do I verify an employment claim?", "Open Employment Verification, choose a pending record, review the role and wage, then confirm it."],
    ["What should I do if an employee's details are incorrect?", "Open the employee record and submit an update request. The trainee's own report stays unchanged until they update it."],
    ["Where can I review workforce and retention data?", "The Reports section shows hiring totals, recent workforce outcomes, and retention milestones."],
  ];
  const contacts = [
    { name: "Ananya Sharma", designation: "National Super Admin · Kaarya Skills Mission", email: "admin.ananya@kaarya.gov.in" },
    { name: "K. S. Narayanan", designation: "District Skill Officer · Pune District", email: "dso.pune@maharashtra.gov.in" },
  ];
  return <div className="employer-support-page"><section className="panel employer-support-faq"><div className="support-section-heading"><span className="metric-icon green"><CircleHelp size={18} /></span><div><p className="eyebrow">HELP & SUPPORT</p><h2>Frequently asked questions</h2></div></div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}<div className="employer-help-links"><button onClick={() => onNavigate("Verification")}>Open employment verification <ArrowRight size={15} /></button><button onClick={() => onNavigate("Employees")}>Open employee records <ArrowRight size={15} /></button></div></section><section className="employer-government-contacts"><div className="support-section-heading"><span className="metric-icon blue"><Building2 size={18} /></span><div><p className="eyebrow">GOVERNMENT CONTACTS</p><h2>Programme support</h2></div></div>{contacts.map((contact) => <article className="panel government-contact-card" key={contact.email}><span className="person-avatar sage"><UserRound size={15} /></span><div><strong>{contact.name}</strong><small>{contact.designation}</small><a href={`mailto:${contact.email}`}>{contact.email}</a></div></article>)}</section></div>;
}

function EmployerReportsPage({ page, records, onNotice, onRequestUpdate, onNavigate, onOpenTrainee }) {
  const retention = page === "Salary & Retention";
  const employeeRecords = records.filter((person) => person.employer && person.employer !== "Self-employed");
  const reportTitle = page === "Skill-wise Hiring" ? "Skill-wise hiring" : page === "Retention Reports" || retention || page === "Employee Progress" ? "Retention and employee progress" : page === "Employment Reports" ? "Employment report" : "Hiring summary";
  const [period, setPeriod] = useState("Last 12 months");
  const [courseFilter, setCourseFilter] = useState("All programmes");
  const [editing, setEditing] = useState(null);
  const [groupBy, setGroupBy] = useState("By month");
  const periodMonths = period === "Last 6 months" ? 6 : period === "Current quarter" ? 3 : 12;
  const periodStart = period === "All records" ? null : new Date(new Date().getFullYear(), new Date().getMonth() - periodMonths, new Date().getDate());
  const visible = employeeRecords.filter((person) => {
    const joiningDate = person.joinedAt ? new Date(person.joinedAt) : null;
    return (!periodStart || !joiningDate || joiningDate >= periodStart) && (courseFilter === "All programmes" || person.course === courseFilter);
  });
  const wageAverage = visible.length ? Math.round(visible.reduce((sum, person) => sum + (person.wage || 0), 0) / visible.length) : 0;
  const retainedCount = visible.filter((person) => Number.parseInt(person.retention, 10) >= 6).length;
  const retentionRate = visible.length ? Math.round(retainedCount / visible.length * 100) : 0;
  const employerReported = page === "Employment Reports" || page === "Reports";
  const skills = [...new Set(visible.map((person) => person.course))].map((course) => ({ course, count: visible.filter((person) => person.course === course).length }));
  const reportRows = visible.map((person) => ({ employee: person.name, traineeId: person.id, course: person.course, role: person.role, status: person.status, joiningDate: person.joinedAt || person.trained, monthlyWage: person.wage, retention: person.retention }));
  if (page === "Reports") return <EmployerReportsDashboard records={employeeRecords} onNavigate={onNavigate} />;
  if (page === "Skill-wise Hiring") return <EmployerSkillsPage records={employeeRecords} onNotice={onNotice} />;
  if (retention) return <EmployerSalaryEmployment records={employeeRecords} onOpenTrainee={onOpenTrainee} />;
  return <><div className="analytics-filters"><label className="filter-select"><CalendarDays size={14} /><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 12 months</option><option>Last 6 months</option><option>Current quarter</option><option>All records</option></select><ChevronDown size={14} /></label><label className="filter-select"><Building2 size={14} /><select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}><option>All programmes</option>{[...new Set(employeeRecords.map((person) => person.course))].map((course) => <option key={course}>{course}</option>)}</select><ChevronDown size={14} /></label><button className="button button-light" onClick={() => { exportCsv(`${page.toLowerCase().replaceAll(" ", "-")}.csv`, reportRows); onNotice("Employer report downloaded as CSV."); }}><Download size={15} /> Export CSV</button></div><div className="analytics-kpis"><div className="panel analytics-kpi"><small>{retention || page === "Retention Reports" || page === "Employee Progress" ? "Six-month retention" : "Employees hired"}</small><strong>{retention || page === "Retention Reports" || page === "Employee Progress" ? `${retentionRate}%` : visible.length}</strong><span>Based on {period.toLowerCase()} data</span></div><div className="panel analytics-kpi"><small>Median monthly wage</small><strong>{money(wageAverage)}</strong><span>Across {visible.length} listed employees</span></div><div className="panel analytics-kpi"><small>Employees retained 6+ months</small><strong>{retainedCount}</strong><span>From current employer records</span></div><div className="panel analytics-kpi"><small>Verified employment</small><strong>{visible.filter((person) => person.verified).length}</strong><span>Employer-confirmed records</span></div></div><div className="analytics-main-grid"><section className="panel analytics-chart-panel"><div className="panel-heading"><div><p className="eyebrow">{page === "Skill-wise Hiring" ? "COURSE / SKILL MIX" : retention ? "RETENTION TREND" : "EMPLOYMENT OUTCOMES"}</p><h2>{reportTitle}</h2></div><label className="filter-select"><select value={page === "Skill-wise Hiring" ? "By programme" : "By month"} onChange={(event) => setPeriod(event.target.value === "By quarter" ? "Current quarter" : "Last 12 months")}><option>By month</option><option>By quarter</option></select><ChevronDown size={14} /></label></div>{page === "Skill-wise Hiring" ? <div className="employer-skill-list">{skills.map(({ course, count }) => <div key={course}><span>{course}</span><i><b style={{ width: `${Math.max(8, count / Math.max(visible.length, 1) * 100)}%` }} /></i><strong>{count} hires</strong></div>)}</div> : <div className="wage-chart"><div className="wage-axis"><span>100%</span><span>75%</span><span>50%</span><span>25%</span></div><div className="wage-bars">{visible.map((person, index) => <div className="wage-bar-group" key={person.id}><div className="wage-bar" style={{ height: `${Math.max(12, Math.min(96, person.retentionMonths * 10))}%` }} /><span>{person.name.split(" ")[0]}</span></div>)}</div></div>}</section><section className="panel district-panel"><div className="panel-heading"><div><p className="eyebrow">{employerReported ? "EMPLOYMENT RECORDS" : "EMPLOYEE PROGRESS"}</p><h2>{page === "Skill-wise Hiring" ? "Employees by programme" : "Current workforce"}</h2></div><button className="icon-button" title="Download current report" aria-label="Download current report" onClick={() => exportCsv(`${page.toLowerCase().replaceAll(" ", "-")}.csv`, reportRows)}><Download size={16} /></button></div>{visible.map((person) => <div className="milestone-row" key={person.id}><span className="milestone-check"><Check size={13} /></span><span><strong>{person.name}</strong><small>{person.role || person.course}</small></span><span className="milestone-trailing"><strong>{person.retention}</strong><button className="text-link" onClick={() => setEditing(person)}>Update</button></span></div>)}{visible.length === 0 && <div className="empty-state">No employees match this programme.</div>}</section></div><section className="panel data-panel employer-report-table"><div className="data-panel-head"><div><strong>{reportTitle}</strong><span>  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {visible.length} employees</span></div><button className="button button-light" onClick={() => exportCsv(`${page.toLowerCase().replaceAll(" ", "-")}.csv`, reportRows)}><Download size={14} /> Export CSV</button></div><div className="table-wrap"><table className="trainee-table"><thead><tr><th>Employee</th><th>Programme</th><th>Role</th><th>Status</th><th>Monthly wage</th><th>Retention</th></tr></thead><tbody>{visible.map((person) => <tr key={person.id}><td><strong>{person.name}</strong><small className="history-id">{person.id}</small></td><td>{person.course}</td><td>{person.role}</td><td><OutcomeBadge status={person.status} /></td><td>{person.wage ? money(person.wage) : "-"}</td><td>{person.retention}</td></tr>)}</tbody></table></div></section>{editing && <EmployerUpdateModal person={editing} close={() => setEditing(null)} onSubmit={async (data) => { if (await onRequestUpdate(editing, data)) setEditing(null); }} />}</>;
}

function EmployerSettingsPage({ page, settings, onNavigate, onSave, onChangePassword }) {
  const [profile, setProfile] = useState({ name: settings?.name || "", companyName: settings?.companyName || "", designation: settings?.designation || "", phone: settings?.phone || "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [preferences, setPreferences] = useState(settings?.preferences || { allowFollowUpRequests: true, allowWageVerification: true, shareAggregateOutcomes: false });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!settings) return;
    setProfile({ name: settings.name || "", companyName: settings.companyName || "", designation: settings.designation || "", phone: settings.phone || "" });
    setPreferences(settings.preferences || { allowFollowUpRequests: true, allowWageVerification: true, shareAggregateOutcomes: false });
  }, [settings]);
  const saveProfile = async (event) => { event.preventDefault(); setSaving(true); await onSave(profile); setSaving(false); };
  const savePreference = async (key, value) => {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    if (!await onSave({ [key]: value })) setPreferences(preferences);
  };
  const passwordSubmit = async (event) => { event.preventDefault(); setSaving(true); const changed = await onChangePassword(currentPassword, newPassword); setSaving(false); if (changed) { setCurrentPassword(""); setNewPassword(""); } };
  const profilePage = page === "Company Profile" || page === "Contact Details";
  const privacyPage = page === "Privacy / Permissions";
  return <div className="employer-settings-layout"><div className="settings-nav">{[["Company Profile", Building2], ["Contact Details", UserRound], ["Account Settings", Settings2], ["Privacy / Permissions", ShieldCheck]].map(([label, Icon]) => <button className={`settings-tab ${page === label ? "active" : ""}`} key={label} onClick={() => onNavigate(label)}><Icon size={16} />{label}</button>)}</div><section className="panel settings-panel">{profilePage ? <form onSubmit={saveProfile}><p className="eyebrow">{page === "Contact Details" ? "AUTHORISED COMPANY CONTACT" : "ORGANISATION DETAILS"}</p><h2>{page === "Contact Details" ? "Contact details" : "Company profile"}</h2><p className="settings-desc">Changes are saved to your employer account and audit history.</p>{page === "Company Profile" && <label className="employer-form-field">Company name<input required minLength="2" value={profile.companyName} onChange={(event) => setProfile({ ...profile, companyName: event.target.value })} /></label>}<label className="employer-form-field">Contact name<input required minLength="2" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label><label className="employer-form-field">Job title<input value={profile.designation} onChange={(event) => setProfile({ ...profile, designation: event.target.value })} /></label><label className="employer-form-field">Work phone<input value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label><label className="employer-form-field">Account email<input type="email" value={settings?.email || ""} readOnly /></label><div className="settings-save"><span><ShieldCheck size={15} /> Authorised employer account</span><button className="button button-primary" disabled={saving}>{saving ? "Saving..." : "Save company details"}</button></div></form> : privacyPage ? <><p className="eyebrow">EMPLOYER DATA PERMISSIONS</p><h2>Privacy and permissions</h2><p className="settings-desc">Changes are applied to your employer workspace and audited. Participant consent remains required for individual-level updates.</p><PreferenceRow title="Receive consented follow-up requests" note="Allow the programme team to include your company in trainee follow-up coordination." checked={preferences.allowFollowUpRequests} onChange={(value) => savePreference("allowFollowUpRequests", value)} /><PreferenceRow title="Submit wage and role verifications" note="Permit authorised staff in this company to submit employment detail updates." checked={preferences.allowWageVerification} onChange={(value) => savePreference("allowWageVerification", value)} /><PreferenceRow title="Share de-identified hiring summaries" note="Contribute aggregate, non-identifying data to programme analytics." checked={preferences.shareAggregateOutcomes} onChange={(value) => savePreference("shareAggregateOutcomes", value)} /><div className="verification-note"><ShieldCheck size={16} /><span>Personal trainee information is never included in aggregate reports.</span></div></> : <form onSubmit={passwordSubmit}><p className="eyebrow">ACCOUNT SECURITY</p><h2>Account settings</h2><p className="settings-desc">Update your password. Use at least eight characters and do not reuse a shared demo password.</p><label className="employer-form-field">Current password<input type="password" minLength="1" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" /></label><label className="employer-form-field">New password<input type="password" minLength="8" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" /></label><div className="settings-save"><span><ShieldCheck size={15} /> Passwords are securely hashed</span><button className="button button-primary" disabled={saving}>{saving ? "Updating..." : "Update password"}</button></div></form>}</section></div>;
}

function PreferenceRow({ title, note, checked, onChange }) {
  return <div className="setting-row"><span><strong>{title}</strong><small>{note}</small></span><button type="button" role="switch" aria-checked={checked} className={`toggle ${checked ? "toggle-on" : ""}`} onClick={() => onChange(!checked)}><i /></button></div>;
}

function SkillGapPage() {
  const [selectedCourse, setSelectedCourse] = useState("Electric Vehicle Service");
  const courseSkills = {
    "Electric Vehicle Service": [["Battery diagnostics", 72, 48], ["Digital documentation", 66, 81], ["Customer communication", 61, 54], ["Safety procedures", 88, 92], ["Motor controller testing", 70, 42]],
    "Solar PV Installation": [["Solar system commissioning", 76, 48], ["Electrical safety", 88, 74], ["Site documentation", 63, 51], ["Customer handover", 58, 62], ["Fault diagnosis", 69, 44]],
    "Healthcare Assistant": [["Patient communication", 79, 68], ["Infection control", 91, 86], ["Digital records", 72, 53], ["First aid response", 84, 71], ["Patient mobility support", 68, 61]],
  };
  const skills = courseSkills[selectedCourse];
  return <><div className="skillgap-intro"><span className="insight-intro-icon"><Sparkles size={19} /></span><span><strong>Industry demand is shifting faster than course updates</strong><small>Compare employer-reported demand with current course coverage to prioritise practical improvements.</small></span></div><section className="panel skillgap-panel"><div className="panel-heading"><div><p className="eyebrow">COURSE VS. INDUSTRY</p><h2>Skills in demand, skills taught</h2></div><label className="filter-select"><GraduationCap size={14} /><select value={selectedCourse} onChange={(event) => setSelectedCourse(event.target.value)}><option>Electric Vehicle Service</option><option>Solar PV Installation</option><option>Healthcare Assistant</option></select><ChevronDown size={14} /></label></div><div className="skill-legend"><span><i /> Employer demand</span><span><i /> Course coverage</span></div>{skills.map(([name, demand, coverage]) => <div className="skill-row" key={name}><strong>{name}</strong><div className="skill-bars"><i className="skill-demand" style={{ width: demand + "%" }} /><i className="skill-coverage" style={{ width: coverage + "%" }} /></div><span className={demand - coverage > 20 ? "gap-alert" : "gap-ok"}>{demand - coverage > 20 ? "+" + (demand - coverage) + " pt gap" : "Aligned"}</span></div>)}</section></>;
}
function TraineePortalWorkspace({ page, person, followUps = [], notifications = [], onNavigate, onNotice, onEmploymentUpdate, onProfileUpdate, onConsentUpdate, onRespond, onSignOut }) {
  const [profileDraft, setProfileDraft] = useState({ name: person?.name || "", education: person?.education || "", city: person?.city || "", district: person?.district || "", phone: person?.contactPhone || "", skills: (person?.skills || []).join(", ") });
  const [employmentDraft, setEmploymentDraft] = useState({ employmentStatus: person?.status || "Seeking work", employerName: person?.employer || "", jobRole: person?.role || "", monthlyWage: person?.wage ? String(person.wage) : "", joinedAt: person?.joinedAtIso?.slice(0, 10) || "" });
  const [preferredChannel, setPreferredChannel] = useState(person?.preferredChannel || "WhatsApp");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!person) return;
    setProfileDraft({ name: person.name || "", education: person.education || "", city: person.city || "", district: person.district || "", phone: person.contactPhone || "", skills: (person.skills || []).join(", ") });
    setEmploymentDraft({ employmentStatus: person.status || "Seeking work", employerName: person.employer || "", jobRole: person.role || "", monthlyWage: person.wage ? String(person.wage) : "", joinedAt: person.joinedAtIso?.slice(0, 10) || "" });
    setPreferredChannel(person.preferredChannel || "WhatsApp");
  }, [person]);

  if (!person) return <section className="panel empty-state">Your trainee record is still being loaded.</section>;

  const wageHistory = person.wageHistory || [];
  const latestFollowUps = followUps.filter((item) => item.state !== "Completed" && item.state !== "Cancelled").slice(0, 3);
  const unreadNotifications = notifications.filter((item) => !item.isRead).slice(0, 3);
  const skills = person.skills || [];
  const requiredSkills = person.industrySkills || [];
  const missingSkills = requiredSkills.filter((skill) => !skills.some((current) => current.toLowerCase() === skill.toLowerCase()));
  const employmentHistory = [...wageHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
  const consentUpdate = async (active) => {
    setSaving(true);
    await onConsentUpdate?.({ consentActive: active, preferredChannel });
    setSaving(false);
  };
  const profileSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const saved = await onProfileUpdate?.({ ...profileDraft, skills: profileDraft.skills.split(",").map((skill) => skill.trim()).filter(Boolean) });
    setSaving(false);
    if (saved) onNotice("Profile updated.");
  };
  const employmentSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const saved = await onEmploymentUpdate?.({
      employmentStatus: employmentDraft.employmentStatus,
      employerName: employmentDraft.employerName,
      jobRole: employmentDraft.jobRole,
      monthlyWage: employmentDraft.monthlyWage ? Number(employmentDraft.monthlyWage) : 0,
      joinedAt: employmentDraft.joinedAt ? new Date(`${employmentDraft.joinedAt}T12:00:00`).toISOString() : null,
    });
    setSaving(false);
    if (saved) onNotice("Your employment update is saved.");
  };

  if (page === "Training") return <>
    <div className="trainee-section-header"><div><p className="eyebrow">YOUR LEARNING RECORD</p><h2>My training</h2><p>Training and certification already on file. No repeated data entry required.</p></div><span className="outcome-badge outcome-employed"><i /> 1 completed</span></div>
    <div className="trainee-dashboard-facts"><div><small>Training provider</small><strong>{person.provider}</strong></div><div><small>Course duration</small><strong>{person.courseDuration || "Recorded in your course history"}</strong></div><div><small>Assessment score</small><strong>{person.assessmentScore ? `${person.assessmentScore}%  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Passed` : "Completed"}</strong></div><div><small>Certificate</small><strong>{person.certificateName || "Certificate record on file"}</strong></div></div>
    <section className="panel trainee-detail-panel"><div className="trainee-section-header"><div><p className="eyebrow">COMPLETED COURSE</p><h2>{person.course}</h2><p>{person.provider}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Completed {person.trained}</p></div><span className="course-icon course-icon-0"><GraduationCap size={19} /></span></div><div className="trainee-skill-columns"><div><h3>Skills covered</h3>{skills.map((skill) => <span className="trainee-skill-tag" key={skill}>{skill}</span>)}</div><div><h3>Current certificate</h3><p className="muted">{person.certificateName || "Certificate on file"}</p><button className="button button-light" onClick={() => onNotice("Your certificate record is available through your training provider.")}><ShieldCheck size={14} /> Certificate details</button></div></div></section>
    <section className="trainee-section-grid"><article className="panel"><p className="eyebrow">TRAINING HISTORY</p><h2>Course completed</h2><div className="career-event"><span className="career-event-icon"><Check size={13} /></span><span className="career-event-copy"><strong>{person.course}</strong><small>{person.provider}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {person.trained}</small></span></div></article><article className="panel"><p className="eyebrow">NEXT STEP</p><h2>Skills to strengthen</h2><p className="settings-desc">Skills are compared automatically with current employer requirements.</p>{missingSkills.length ? missingSkills.slice(0, 3).map((skill) => <span className="trainee-skill-tag missing" key={skill}>{skill}</span>) : <span className="trainee-skill-tag">Your recorded skills match current requirements</span>}</article></section>
  </>;

  if (page === "Employment") return <>
    <div className="trainee-section-header"><div><p className="eyebrow">CURRENT WORK</p><h2>Employment details</h2><p>Share a short update when something changes. Your report stays separate from employer verification.</p></div><OutcomeBadge status={person.status} /></div>
    <div className="trainee-dashboard-facts"><div><small>Company</small><strong>{person.employer || "Not currently employed"}</strong></div><div><small>Job role</small><strong>{person.role || "Not reported"}</strong></div><div><small>Monthly salary</small><strong>{person.wage ? money(person.wage) : "Not reported"}</strong></div><div><small>Employer verification</small><strong>{person.verified ? "Confirmed" : person.employer ? "Awaiting employer" : "Not applicable"}</strong></div></div>
    <section className="panel employment-detail-card"><div className="employment-detail-head"><span className="course-icon course-icon-0"><BriefcaseBusiness size={19} /></span><span><strong>Update your work status</strong><small>Only update the fields that have changed. This usually takes less than a minute.</small></span></div><form className="trainee-profile-form" onSubmit={employmentSubmit}><label className="employer-form-field">Current status<select value={employmentDraft.employmentStatus} onChange={(event) => setEmploymentDraft({ ...employmentDraft, employmentStatus: event.target.value })}><option>Employed</option><option>Self-employed</option><option>Apprentice</option><option>Seeking work</option></select></label><label className="employer-form-field">Company or activity<input value={employmentDraft.employerName} onChange={(event) => setEmploymentDraft({ ...employmentDraft, employerName: event.target.value })} placeholder="Company or self-employment" /></label><label className="employer-form-field">Job role<input value={employmentDraft.jobRole} onChange={(event) => setEmploymentDraft({ ...employmentDraft, jobRole: event.target.value })} placeholder="Your current role" /></label><label className="employer-form-field">Monthly salary (INR)<input type="number" min="0" value={employmentDraft.monthlyWage} onChange={(event) => setEmploymentDraft({ ...employmentDraft, monthlyWage: event.target.value })} placeholder="Optional" /></label><label className="employer-form-field">Joining date<input type="date" value={employmentDraft.joinedAt} onChange={(event) => setEmploymentDraft({ ...employmentDraft, joinedAt: event.target.value })} /></label><div className="profile-full"><button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Share work update"} <ArrowRight size={14} /></button></div></form></section>
    <div className="low-burden-note"><span className="low-burden-icon"><ShieldCheck size={18} /></span><span><strong>{person.consent ? "Employer sharing is enabled" : "Employer sharing is paused"}</strong><small>{person.consent ? "Only work updates you have consented to share are sent to your current employer." : "You can enable sharing from Profile at any time."}</small></span><button onClick={() => onNavigate?.("Profile")}>Consent settings <ArrowRight size={14} /></button></div>
  </>;

  if (page === "Career") return <>
    <div className="trainee-section-header"><div><p className="eyebrow">YOUR LONGITUDINAL OUTCOME</p><h2>Career progress</h2><p>Training ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Certificate ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ First job ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Current job ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Salary growth</p></div><button className="button button-light" onClick={() => { exportCsv("my-career-progress.csv", employmentHistory.map((item) => ({ date: item.date, employer: item.employer, role: item.role, status: item.status, monthlyWage: item.wage }))); onNotice("Career history downloaded as CSV."); }}><Download size={14} /> Export my history</button></div>
    <div className="trainee-dashboard-facts"><div><small>Current role</small><strong>{person.role || "No current job reported"}</strong></div><div><small>Current employer</small><strong>{person.employer || "Not reported"}</strong></div><div><small>Time in current role</small><strong>{person.retention || "Not reported"}</strong></div><div><small>Salary change</small><strong>{person.change ? `+${person.change}% since joining` : "No change recorded"}</strong></div></div>
    <div className="trainee-section-grid"><section className="panel"><p className="eyebrow">CAREER TIMELINE</p><h2>Training to livelihood</h2><div className="career-timeline"><div className="career-event"><span className="career-event-icon"><GraduationCap size={13} /></span><span className="career-event-copy"><strong>Training completed  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {person.course}</strong><small>{person.provider}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {person.trained}</small></span><time>{person.trained}</time></div><div className="career-event"><span className="career-event-icon"><ShieldCheck size={13} /></span><span className="career-event-copy"><strong>Certificate earned</strong><small>{person.certificateName || "Training certificate recorded"}</small></span></div>{employmentHistory.map((item, index) => <div className="career-event" key={`${item.date}-${index}`}><span className="career-event-icon"><BriefcaseBusiness size={13} /></span><span className="career-event-copy"><strong>{index === 0 ? "First job" : "Employment update"}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {item.role || item.status}</strong><small>{item.employer || "Employer not reported"}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {money(item.wage)}</small></span><time>{new Date(item.date).toLocaleDateString()}</time></div>)}{person.employer && <div className="career-event"><span className="career-event-icon"><Activity size={13} /></span><span className="career-event-copy"><strong>Current job  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {person.role}</strong><small>{person.employer}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {person.retention}</small></span><time>Current</time></div>}</div></section><section className="panel"><p className="eyebrow">SALARY PROGRESSION</p><h2>Monthly income over time</h2>{employmentHistory.length ? <div className="mini-wage-chart">{employmentHistory.map((item, index) => <div key={`${item.date}-${index}`}><span>{new Date(item.date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span><i style={{ width: `${Math.max(12, Math.min(100, item.wage / Math.max(person.wage, 1) * 100))}%` }} /><strong>{money(item.wage)}</strong></div>)}</div> : <p className="empty-state">Salary history will appear as you share periodic updates.</p>}<button className="panel-link" onClick={() => onNavigate?.("Employment")}>Update current work details <ArrowRight size={14} /></button></section></div>
    <section className="panel trainee-detail-panel"><div className="trainee-section-header"><div><p className="eyebrow">SKILLS & SKILL GAP</p><h2>Skills for your next opportunity</h2></div><button className="button button-light" onClick={() => onNavigate?.("Training")}>Browse training <ArrowRight size={14} /></button></div><div className="trainee-skill-columns"><div><h3>Your current skills</h3>{skills.map((skill) => <span className="trainee-skill-tag" key={skill}>{skill}</span>)}</div><div><h3>In demand  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· skills to build</h3>{missingSkills.length ? missingSkills.map((skill) => <span className="trainee-skill-tag missing" key={skill}>{skill}</span>) : <span className="trainee-skill-tag">No gaps identified</span>}</div></div>{missingSkills.length > 0 && <div className="low-burden-note"><span className="low-burden-icon"><Sparkles size={18} /></span><span><strong>Recommended next step</strong><small>Ask your training provider about a short module for {missingSkills[0]}.</small></span><button onClick={() => onNotice("Your provider will see this training interest.")}>Request course info <ArrowRight size={14} /></button></div>}</section>
  </>;

  if (page === "Profile") return <>
    <div className="trainee-profile-heading"><span className="profile-avatar">{person.initials}</span><span><strong>{person.name}</strong><small>{person.id}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Consent-first profile</small></span><span className="consent-pill"><ShieldCheck size={13} /> {person.consent ? "Consent active" : "Sharing paused"}</span></div>
    <div className="trainee-section-grid"><section className="panel"><div className="trainee-section-header"><div><p className="eyebrow">PERSONAL DETAILS</p><h2>My profile</h2><p>Update only what has changed; your saved course and job details stay connected.</p></div></div><form className="trainee-profile-form" onSubmit={profileSubmit}><label className="employer-form-field">Full name<input required value={profileDraft.name} onChange={(event) => setProfileDraft({ ...profileDraft, name: event.target.value })} /></label><label className="employer-form-field">Education<input value={profileDraft.education} onChange={(event) => setProfileDraft({ ...profileDraft, education: event.target.value })} placeholder="Education" /></label><label className="employer-form-field">City / location<input value={profileDraft.city} onChange={(event) => setProfileDraft({ ...profileDraft, city: event.target.value })} /></label><label className="employer-form-field">District<input value={profileDraft.district} onChange={(event) => setProfileDraft({ ...profileDraft, district: event.target.value })} /></label><label className="employer-form-field">Phone<input value={profileDraft.phone} onChange={(event) => setProfileDraft({ ...profileDraft, phone: event.target.value })} /></label><label className="employer-form-field profile-full">Skills, separated by commas<input value={profileDraft.skills} onChange={(event) => setProfileDraft({ ...profileDraft, skills: event.target.value })} /></label><div className="profile-full"><button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button></div></form></section><section className="panel"><div className="trainee-section-header"><div><p className="eyebrow">NOTIFICATIONS & CONSENT</p><h2>Small updates, on your terms</h2><p>We use your preferred channel and only ask for changes needed to track outcomes.</p></div></div><label className="employer-form-field">Preferred reminder channel<select value={preferredChannel} onChange={(event) => setPreferredChannel(event.target.value)}><option>WhatsApp</option><option>Phone call</option><option>SMS</option><option>Assisted in-person</option></select></label><PreferenceRow title="Share employment updates with my employer" note="Only role, work status, and wage updates. Contact and education details remain private." checked={person.consent} onChange={consentUpdate} /><div className="trainee-reminder-list">{latestFollowUps.map((item) => <div className="trainee-reminder-row" key={item.id}><CalendarDays size={16} /><span><strong>{item.type}</strong><small>{item.channel}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {item.due}</small></span><button className="text-link" onClick={() => onRespond?.({ ...item, traineeId: person.id, name: person.name, initials: person.initials })}>Quick update</button></div>)}{unreadNotifications.map((item) => <div className="trainee-reminder-row" key={item.id}><Bell size={16} /><span><strong>{item.title}</strong><small>{item.body}</small></span><span className="status-tag tag-due">New</span></div>)}{latestFollowUps.length === 0 && unreadNotifications.length === 0 && <p className="empty-state">No reminders due. WeÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ll only contact you when a small outcome update is needed.</p>}</div><button className="text-link" onClick={onSignOut}><LogOut size={14} /> Sign out</button></section></div>
  </>;

  return <>
    <div className="trainee-dashboard-grid"><section className="panel trainee-dashboard-main"><div className="panel-heading"><div><p className="eyebrow">YOUR CURRENT OUTCOME</p><h2>Training to livelihood</h2></div><button className="text-link" onClick={() => onNavigate?.("Career")}>Career progress <ArrowRight size={14} /></button></div><div className="trainee-status-card"><span className="course-icon course-icon-0"><BriefcaseBusiness size={19} /></span><span><strong>{person.status === "Seeking work" ? "Looking for work" : `${person.status}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· ${person.role || "Current work"}`}</strong><small>{person.employer || "Share an update when you start work"}{person.employer ? `  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· ${person.city}` : ""}</small></span><OutcomeBadge status={person.status} /></div><div className="trainee-dashboard-facts"><div><small>Monthly salary</small><strong>{person.wage ? money(person.wage) : "Not reported"}</strong></div><div><small>Training</small><strong>{person.course}</strong></div><div><small>Certificate</small><strong>{person.certificateName ? "Earned" : "In progress"}</strong></div><div><small>Time in role</small><strong>{person.retention}</strong></div></div><div className="trainee-action-row"><button className="button button-primary" onClick={() => onNavigate?.("Employment")}>Update work status <ArrowRight size={14} /></button><button className="button button-light" onClick={() => onNavigate?.("Training")}>View training record</button></div></section><section className="panel trainee-dashboard-side"><div className="panel-heading"><div><p className="eyebrow">IMPORTANT UPDATES</p><h2>Quick check-ins</h2></div><CalendarDays size={17} /></div>{latestFollowUps.map((item) => <div className="trainee-reminder-row" key={item.id}><CalendarDays size={15} /><span><strong>{item.type}</strong><small>{item.channel}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {item.due}</small></span><button className="text-link" onClick={() => onRespond?.({ ...item, traineeId: person.id, name: person.name, initials: person.initials })}>2-min update</button></div>)}{unreadNotifications.map((item) => <div className="trainee-notice" key={item.id}><Bell size={15} /><span><strong>{item.title}</strong><small>{item.body}</small></span></div>)}{latestFollowUps.length === 0 && unreadNotifications.length === 0 && <p className="empty-state">YouÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢re up to date. WeÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ll ask only when an outcome update is due.</p>}<button className="panel-link" onClick={() => onNavigate?.("Profile")}>Notifications & consent settings <ArrowRight size={14} /></button></section></div>
    <section className="panel trainee-detail-panel"><div className="trainee-section-header"><div><p className="eyebrow">YOUR CAREER PATH</p><h2>Training ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ certificate ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ work</h2><p>{person.course}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {person.provider}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Completed {person.trained}</p></div><button className="panel-link" onClick={() => onNavigate?.("Career")}>View full journey <ArrowRight size={14} /></button></div><div className="career-timeline"><div className="career-event"><span className="career-event-icon"><Check size={13} /></span><span className="career-event-copy"><strong>Training completed</strong><small>{person.course}</small></span><time>{person.trained}</time></div><div className="career-event"><span className="career-event-icon"><ShieldCheck size={13} /></span><span className="career-event-copy"><strong>Certificate earned</strong><small>{person.certificateName || "Certificate recorded"}</small></span></div><div className="career-event"><span className="career-event-icon"><BriefcaseBusiness size={13} /></span><span className="career-event-copy"><strong>{person.employer ? `Current job  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· ${person.role}` : "Employment update"}</strong><small>{person.employer || "Share when your employment changes"}</small></span></div></div></section>
  </>;
}

function TraineePortalPage({ page, onNotice }) {
  const person = trainees[0];
  return <><div className="trainee-welcome"><div><span className="profile-avatar">{person.initials}</span><span><strong>{person.name}</strong><small>{person.id} <i /> Pune, Maharashtra</small></span><span className="consent-pill"><ShieldCheck size={13} /> Consent active</span></div><span className="trainee-welcome-status"><i /> Current status <strong>{person.status}</strong></span></div>{page === "Training Record" ? <><div className="trainee-section-title"><p className="eyebrow">YOUR COURSE</p><h2>Solar PV Installation</h2><p>Udaan Skills Centre  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Completed 12 February 2025</p></div><div className="trainee-info-grid"><article className="panel trainee-info-card"><GraduationCap size={19} /><small>Training duration</small><strong>420 hours  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· 14 weeks</strong></article><article className="panel trainee-info-card"><CheckCircle2 size={19} /><small>Assessment result</small><strong>Passed  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· 86%</strong></article><article className="panel trainee-info-card"><ShieldCheck size={19} /><small>Certification</small><strong>NSQF Level 4</strong></article></div><section className="panel trainee-detail-panel"><h3>Skills covered</h3><div className="skill-chip-list">{["Solar panel installation", "Electrical safety", "System commissioning", "Fault diagnosis", "Customer handover"].map((skill) => <span key={skill}>{skill}</span>)}</div><button className="button button-light" onClick={() => onNotice("Your certificate is ready to view.")}><Download size={15} /> View certificate</button></section></> : page === "Employment" ? <><div className="trainee-section-title"><p className="eyebrow">WORK UPDATE</p><h2>Your employment details</h2><p>Last updated 18 September 2026</p></div><section className="panel employment-detail-card"><div className="employment-detail-head"><span className="course-icon course-icon-0"><BriefcaseBusiness size={20} /></span><span><strong>Solar Technician</strong><small>SunGrid Energy  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Pune</small></span><OutcomeBadge status="Employed" /></div><div className="profile-facts"><div><small>Joined</small><strong>12 January 2026</strong></div><div><small>Monthly wage</small><strong>INR 18,500</strong></div><div><small>Employment duration</small><strong>8 months</strong></div><div><small>Employer confirmation</small><strong>Confirmed 12 Aug 2026</strong></div></div><button className="button button-light" onClick={() => onNotice("Employment update form opened.")}><Plus size={15} /> Share an update</button></section><section className="panel trainee-detail-panel"><div className="panel-heading"><div><p className="eyebrow">WAGE PROGRESSION</p><h2>Your work, over time</h2></div><span className="positive"><TrendingUp size={13} /> +18%</span></div><div className="mini-wage-chart"><div><span>At placement</span><i style={{ width: "62%" }} /><strong>INR 15,700</strong></div><div><span>Latest update</span><i style={{ width: "82%" }} /><strong>INR 18,500</strong></div></div></section></> : page === "Follow-ups" ? <><div className="trainee-section-title"><p className="eyebrow">YOUR CHOICE, YOUR VOICE</p><h2>Recent check-ins</h2><p>Check-ins help keep your work information accurate. You can skip any question or opt out.</p></div><section className="panel trainee-checkin"><span className="follow-summary-icon orange"><CalendarDays size={17} /></span><span><strong>How is your current job going?</strong><small>Quick 2-minute check-in  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· WhatsApp  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Due today</small></span><button className="button button-primary" onClick={() => onNotice("Thanks. Your check-in response has been recorded.")}>Respond</button></section><div className="trainee-preferences"><div><ShieldCheck size={18} /><span><strong>Your contact preferences</strong><small>WhatsApp is your preferred channel. Your number is masked in programme reports.</small></span></div><button className="button button-light" onClick={() => onNotice("Contact preferences updated.")}>Update preferences</button><button className="text-link" onClick={() => onNotice("Your follow-up consent has been paused.")}>Pause follow-ups</button></div></> : <><div className="trainee-journey-grid"><section className="panel trainee-journey-card"><div className="panel-heading"><div><p className="eyebrow">YOUR JOURNEY</p><h2>Training to livelihood</h2></div><span className="journey-progress">3 of 4 milestones</span></div><div className="journey-timeline"><div className="journey-step complete"><i><Check size={12} /></i><span><strong>Training completed</strong><small>Solar PV Installation  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Feb 2025</small></span><b>Done</b></div><div className="journey-step complete"><i><Check size={12} /></i><span><strong>First job started</strong><small>Solar Technician  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Jan 2026</small></span><b>Done</b></div><div className="journey-step current"><i>3</i><span><strong>Six-month check-in</strong><small>Share how your work is going</small></span><b>Today</b></div><div className="journey-step"><i>4</i><span><strong>One-year progress</strong><small>Wage and role update</small></span><b>Jan 2027</b></div></div><button className="panel-link" onClick={() => onNotice("Thanks. Your check-in response has been recorded.")}>Complete today's check-in <ArrowRight size={14} /></button></section><section className="panel trainee-outcome-card"><p className="eyebrow">CURRENT OUTCOME</p><OutcomeBadge status="Employed" /><h2>Working at SunGrid Energy</h2><p>Solar Technician  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Pune, Maharashtra</p><div className="trainee-wage-highlight"><small>Latest monthly wage</small><strong>INR 18,500</strong><span className="positive"><TrendingUp size={12} /> +18% since joining</span></div><button className="button button-light" onClick={() => onNotice("Employment details opened.")}>Review work details <ArrowRight size={14} /></button></section></div><div className="low-burden-note"><span className="low-burden-icon"><ShieldCheck size={18} /></span><span><strong>You stay in control of your information</strong><small>Your personal updates are only shared with your programme team when you have consented.</small></span><button onClick={() => onNotice("Privacy preferences opened.")}>Privacy preferences <ArrowRight size={14} /></button></div></> }</>;
}

function TraineeWorkspace({
  page,
  profile,
  employment,
  trainings,
  certificates,
  salaries,
  onNavigate,
  onOpenProfile,
  onSaveEmployment,
  onUploadCertificate,
  onDeleteCertificate,
  onAddSalaryRecord,
  onNotice,
}) {
  if (page === "Overview") {
    return (
      <TraineeOverview
        profile={profile}
        employment={employment}
        trainingList={trainings}
        onNavigate={onNavigate}
        onOpenProfile={onOpenProfile}
      />
    );
  }
  if (page === "Training & Certificates") {
    return (
      <TraineeTrainingCertificates
        trainingList={trainings}
        certificates={certificates}
        onUploadCertificate={onUploadCertificate}
        onDeleteCertificate={onDeleteCertificate}
        onNotice={onNotice}
      />
    );
  }
  if (page === "Employment Status") {
    return (
      <TraineeEmploymentStatus
        employment={employment}
        onSaveEmployment={onSaveEmployment}
        onNotice={onNotice}
      />
    );
  }
  if (page === "Salary Progress") {
    return (
      <TraineeSalaryTracker
        salaryHistory={salaries}
        onAddSalaryRecord={onAddSalaryRecord}
        onNotice={onNotice}
      />
    );
  }
  if (page === "Job History") {
    return <TraineeJobHistory onNotice={onNotice} />;
  }
  if (page === "Recommended Skills") {
    return <TraineeRecommendedSkills employment={employment} trainingList={trainings} onNotice={onNotice} />;
  }
  if (page === "Help & Support") {
    return <TraineeHelpSupport profile={profile} employment={employment} trainingList={trainings} onNotice={onNotice} />;
  }
  return (
    <TraineeOverview
      profile={profile}
      employment={employment}
      trainingList={trainings}
      onNavigate={onNavigate}
      onOpenProfile={onOpenProfile}
    />
  );
}

function Login({ registerMode, setRegisterMode, role, setRole, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const apiRole = apiRoleForPortal[role];
    const body = registerMode
      ? { name, email, password, role: apiRole, ...(role === "Employer" ? { companyName: organisation } : {}), ...(role === "Training Provider" ? { collegeName: organisation } : {}) }
      : { email, password, role: apiRole };
    try {
      const result = await apiRequest(registerMode ? "/api/auth/register" : "/api/auth/login", "", { method: "POST", body });
      onSubmit({ token: result.token, apiRole: result.user.role, user: result.user });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return <main className="login-screen"><aside className="login-story"><div className="brand-lockup brand-lockup-light"><span className="brand-symbol"><Activity size={19} strokeWidth={2.5} /></span><span>kaarya<span className="brand-period">.</span></span></div><div className="story-copy"><h1>What happens<br />after training<br /><em>matters.</em></h1><p>Follow every learner's journey from first skill to lasting livelihood, with evidence that respects their choices.</p></div></aside><section className="login-form-side"><form className="login-form" onSubmit={submit}><h2>{registerMode ? (role === "Employer" ? "Create employer account" : "Create your workspace") : "Welcome back"}</h2><p className="muted">{registerMode ? (role === "Employer" ? "Create your company workspace account." : "Set up your programme team access.") : "Sign in to your workspace."}</p>{registerMode && <label>Full name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required placeholder="Your name" /></label>}<label>Portal<select value={role} onChange={(event) => { setRole(event.target.value); setError(""); }}><option>Government / Admin</option><option>Employer</option><option>Trainee</option></select></label>{registerMode && role === "Employer" && <label>Company name<input autoComplete="organization" value={organisation} onChange={(event) => setOrganisation(event.target.value)} required placeholder="Company name" /></label>}<label>{role === "Trainee" ? "Email address" : "Work email"}<input autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="you@organisation.org" /></label><label>Password<input autoComplete={registerMode ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength="6" placeholder="Enter your password" /></label>{error && <p className="auth-error" role="alert">{error}</p>}<button className="button button-primary login-submit" disabled={busy}>{busy ? "Connecting..." : registerMode ? (role === "Employer" ? "Create account" : "Create workspace") : "Sign in"}<ArrowRight size={16} /></button><p className="login-switch">{registerMode ? "Already have an account?" : "New to Kaarya?"} <button type="button" onClick={() => { setRegisterMode(!registerMode); setError(""); }}>{registerMode ? "Sign in" : "Create account"}</button></p></form></section></main>;
}

function Overview({ records, onNavigate, onOpenTrainee }) {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 months");
  const [periodOpen, setPeriodOpen] = useState(false);
  const periodOptions = {
    "Last 3 months": { months: ["Jul", "Aug", "Sep"], values: [67, 71, 78], rate: "72.0%", change: "5.3%" },
    "Last 6 months": { months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"], values: [46, 56, 50, 67, 71, 78], rate: "65.5%", change: "6.2%" },
    "Last 12 months": { months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"], values: [38, 42, 45, 47, 49, 52, 46, 56, 50, 67, 71, 78], rate: "61.8%", change: "8.1%" },
  };
  const { months, values: chartData, rate: placementRate, change: periodChange } = periodOptions[selectedPeriod];
  const points = chartData.map((value, index) => ({ x: index * 660 / (chartData.length - 1), y: 165 - value * 1.8 }));
  const linePath = points.map((point, index) => (index === 0 ? "M" : "L") + point.x + " " + point.y).join(" ");
  const areaPath = linePath + " L660 185 L0 185 Z";
  const lastPoint = points[points.length - 1];  return <>
    <div className="cohort-strip"><div><span className="strip-icon"><Users size={17} /></span><span><strong>2025 - 26 training cohorts</strong><small>Across 18 districts and 42 training partners</small></span></div><button className="select-button" onClick={() => onNavigate("Analytics & Insights")}>All cohorts <ChevronDown size={14} /></button><span className="strip-divider" /><span className="strip-updated"><i /> Live data</span></div>
    <div className="metric-grid">
      <Metric icon={Users} label="Trainees enrolled" value="12,840" trend="12.8%" note="vs. previous cohort" tone="green" />
      <Metric icon={BriefcaseBusiness} label="Placed in work" value="8,412" trend="8.4%" note="65.5% placement rate" tone="orange" />
      <Metric icon={HeartHandshake} label="Retained at 6 months" value="6,227" trend="4.2%" note="74.0% of employed" tone="blue" />
      <Metric icon={WalletCards} label="Median monthly wage" value="INR 18,450" trend="11.6%" note="since training completion" tone="violet" />
    </div>
    <div className="overview-grid"><section className="panel outcome-panel"><div className="panel-heading"><div><p className="eyebrow">EMPLOYMENT OUTCOMES</p><h2>Where trainees are now</h2></div><div className="period-dropdown-wrap"><button className="select-button" aria-expanded={periodOpen} onClick={() => setPeriodOpen((open) => !open)}>{selectedPeriod} <ChevronDown size={14} /></button>{periodOpen && <div className="period-dropdown" role="menu">{Object.keys(periodOptions).map((period) => <button key={period} role="menuitem" className={selectedPeriod === period ? "period-option-active" : ""} onClick={() => { setSelectedPeriod(period); setPeriodOpen(false); }}>{period}</button>)}</div>}</div></div><div className="chart-summary"><strong>{placementRate}</strong><span>of trainees moved into work <b className="positive"><TrendingUp size={13} /> {periodChange}</b></span></div><div className="line-chart" aria-label={"Employment outcomes trend for " + selectedPeriod.toLowerCase()}><div className="chart-gridlines"><i /><i /><i /><i /></div><div className="chart-y-labels"><span>80%</span><span>60%</span><span>40%</span><span>20%</span></div><svg viewBox="0 0 660 185" preserveAspectRatio="none" role="img" aria-label="Employment trend increasing from 46 to 78 percent"><defs><linearGradient id="outcomeFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#71ae87" stopOpacity=".22"/><stop offset="100%" stopColor="#71ae87" stopOpacity="0"/></linearGradient></defs><path d={areaPath} fill="url(#outcomeFill)"/><path d={linePath} fill="none" stroke="#367e58" strokeWidth="3" vectorEffect="non-scaling-stroke"/><circle cx={lastPoint.x} cy={lastPoint.y} r="5" fill="#367e58" stroke="white" strokeWidth="3" vectorEffect="non-scaling-stroke"/></svg><div className="chart-months">{months.map((month) => <span key={month}>{month}</span>)}</div></div><div className="outcome-legend"><span><i className="legend-green" />Employed <strong>6,944</strong></span><span><i className="legend-yellow" />Self-employed <strong>912</strong></span><span><i className="legend-blue" />Apprenticeship <strong>556</strong></span><span><i className="legend-gray" />Seeking work <strong>1,106</strong></span></div></section>
      <section className="panel follow-panel"><div className="panel-heading"><div><p className="eyebrow">NEEDS ATTENTION</p><h2>Learner check-ins <span className="count-badge">{records.filter((person) => person.followup !== "Completed" && person.followup !== "Not scheduled").length}</span></h2></div><CalendarDays size={17} /></div><div className="queue-list">{records.filter((person) => person.followup !== "Completed" && person.followup !== "Not scheduled").slice(0, 3).map((person) => <button className="queue-row" key={person.id} onClick={() => onOpenTrainee(person)}><span className={`person-avatar ${person.gender === "Female" ? "peach" : "sage"}`}>{person.initials}</span><span className="queue-person"><strong>{person.name}</strong><small>{person.followup} Â· {person.preferredChannel || "WhatsApp"}</small></span><span className={`status-tag ${person.followup === "Overdue" ? "tag-alert" : "tag-due"}`}>{person.followup}</span></button>)}{records.filter((person) => person.followup !== "Completed" && person.followup !== "Not scheduled").length === 0 && <p className="empty-state">No learner updates need attention.</p>}</div><button className="panel-link" onClick={() => onNavigate("Trainees")}>View trainees <ArrowRight size={14} /></button></section></div>
    <div className="bottom-grid"><section className="panel provider-panel"><div className="panel-heading"><div><p className="eyebrow">PROVIDER PERFORMANCE</p><h2>Partner snapshot</h2></div><button className="panel-link panel-link-button" onClick={() => onNavigate("Analytics & Insights")}>View all <ArrowRight size={14} /></button></div><div className="table-wrap"><table><thead><tr><th>Training partner</th><th>Trainees</th><th>Placed</th><th>6-mo retained</th><th>Trend</th></tr></thead><tbody><tr><td><span className="provider-mark mark-olive">UC</span><strong>Udaan Skills Centre</strong></td><td>2,480</td><td><b>72%</b></td><td><b>81%</b></td><td><span className="positive">+8.2%</span></td></tr><tr><td><span className="provider-mark mark-coral">SF</span><strong>Saksham Foundation</strong></td><td>1,960</td><td><b>68%</b></td><td><b>76%</b></td><td><span className="positive">+5.4%</span></td></tr><tr><td><span className="provider-mark mark-blue">NP</span><strong>Nirmaan Trust</strong></td><td>1,720</td><td><b>61%</b></td><td><b>69%</b></td><td><span className="negative">-1.3%</span></td></tr></tbody></table></div></section><section className="panel alert-panel"><div className="panel-heading"><div><p className="eyebrow">PROGRAMME SIGNAL</p><h2>One thing to look at</h2></div><span className="insight-icon"><Sparkles size={17} /></span></div><p className="signal-title">EV trainees in Jaipur are waiting longer to find work.</p><p className="signal-copy">Median time to placement is 47 days, 16 days above the programme average. 38 learners may benefit from employer introductions.</p><button className="panel-link" onClick={() => onNavigate("Analytics & Insights")}>Explore this signal <ArrowRight size={14} /></button></section></div>
  </>;
}

function findTraineeLocal(id) { return trainees.find((item) => item.id === id); }

function Metric({ icon: Icon, label, value, trend, note, tone }) {
  return <article className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={18} /></div><span className="metric-trend"><TrendingUp size={12} /> {trend}</span><p>{label}</p><strong>{value}</strong><small>{note}</small></article>;
}

function TraineePage({ records, query, setQuery, statusFilter, setStatusFilter, openTrainee, onNotice, entity = "trainee" }) {
  const plural = entity === "employee" ? "employees" : "trainees";
  const singular = entity === "employee" ? "Employee" : "Trainee";
  const allValue = "All records";
  const selectedStatus = ["All trainees", "All employees", allValue].includes(statusFilter) ? allValue : statusFilter;
  const exportVisibleRecords = () => {
    if (!records.length) {
      onNotice?.("There are no matching records to export.");
      return;
    }
    const rows = records.map((person) => ({
      Name: person.name || "",
      Email: person.contactEmail || "",
      ID: person.id || "",
      Role: person.role || "",
      TrainingProgram: person.course || "",
      TrainingProvider: person.provider || "",
      Location: person.city || person.district || "",
      Status: person.status || "",
      MonthlyWageINR: person.wage || "",
      Employer: person.employer || "",
      Verification: person.verified ? "Verified" : "Pending",
    }));
    exportCsv(`${plural}.csv`, rows);
    onNotice?.(`${records.length} ${plural} exported as CSV.`);
  };
  const hasFilters = query.trim() || selectedStatus !== allValue;
  return <div className="employee-list-page"><div className="list-toolbar employee-list-toolbar"><label className="table-search"><Search size={16} /><input aria-label={`Search ${plural}`} placeholder={`Search ${plural} by name, ID, role, or course`} value={query} onChange={(event) => setQuery(event.target.value)} /></label><label className="filter-select employee-status-filter"><Filter size={15} /><span>Status</span><select aria-label="Filter by employment status" value={selectedStatus} onChange={(event) => setStatusFilter(event.target.value)}><option value={allValue}>{entity === "employee" ? "All employees" : "All trainees"}</option><option>Employed</option><option>Apprentice</option><option>Self-employed</option><option>Seeking work</option><option>Left</option><option>Exited</option></select><ChevronDown size={14} /></label>{hasFilters && <button className="button button-light clear-employee-filters" onClick={() => { setQuery(""); setStatusFilter(allValue); }}>Clear filters</button>}<button className="button button-primary employee-export-button" onClick={exportVisibleRecords}><Download size={15} /> Export CSV</button></div><section className="panel data-panel employee-list-panel"><div className="data-panel-head"><div><strong>{records.length.toLocaleString()} {plural}</strong><span>{hasFilters ? "Matching your current filters" : entity === "employee" ? "Company workforce records" : "Consent recorded for listed participants"}</span></div><span className="employee-result-count">Showing {records.length}</span></div><div className="table-wrap"><table className="trainee-table"><thead><tr><th>{singular}</th><th>Training programme</th><th>District</th><th>Current outcome</th><th>Monthly wage</th><th>Next follow-up</th><th /></tr></thead><tbody>{records.map((person) => <tr key={person.id} onClick={() => openTrainee(person)}><td><span className="table-person"><span className={`person-avatar ${person.gender === "Female" ? "peach" : "sage"}`}>{person.initials}</span><span><strong>{person.name}</strong><small>{person.id}</small>{person.contactEmail && <small>{person.contactEmail}</small>}</span></span></td><td><span className="course-cell">{person.course || "Not recorded"}<small>{person.provider || "Training provider not recorded"}</small></span></td><td>{person.district || person.city || "-"}</td><td><OutcomeBadge status={person.status} /></td><td>{person.wage ? money(person.wage) : "-"}</td><td><span className={`followup-cell ${person.followup === "Overdue" ? "overdue-text" : ""}`}>{person.followup || "-"}</span></td><td><ChevronRight size={16} className="row-chevron" /></td></tr>)}</tbody></table>{records.length === 0 && <div className="empty-state">No {plural} match your search and status filter. Try clearing the filters.</div>}</div><div className="table-pagination"><span>{records.length} {plural} shown</span><span>{records.length ? "Select a row to view its profile" : "No records to display"}</span></div></section></div>;
}

function OutcomeBadge({ status }) {
  const className = status === "Employed" ? "outcome-employed" : status === "Self-employed" ? "outcome-self" : status === "Apprentice" ? "outcome-apprentice" : "outcome-seeking";
  return <span className={`outcome-badge ${className}`}><i />{status}</span>;
}

function TrainingPage({ onNotice }) {
  const courses = [
    { title: "Solar PV Installation", provider: "Udaan Skills Centre", trained: "1,240", certified: "94%", placed: "72%", demand: "High employer demand", mark: "Energy", summary: "Strong placement outcomes with continued demand for hands-on commissioning skills." },
    { title: "Healthcare Assistant", provider: "Saksham Foundation", trained: "980", certified: "89%", placed: "68%", demand: "High employer demand", mark: "Care", summary: "Consistent hiring across care providers; practical patient support remains a priority." },
    { title: "Retail Sales Associate", provider: "Kaushal Pragati", trained: "860", certified: "91%", placed: "57%", demand: "Review outcomes", mark: "Retail", summary: "Certification is strong; placement conversion needs a review with local employers." },
    { title: "Data Entry & Office Tools", provider: "Nirmaan Trust", trained: "720", certified: "96%", placed: "61%", demand: "Review outcomes", mark: "Digital", summary: "High completion and certification; digital workplace practice may improve placement." },
    { title: "Electric Vehicle Service", provider: "Udaan Skills Centre", trained: "640", certified: "87%", placed: "74%", demand: "Growing employer demand", mark: "Mobility", summary: "Strong placement and growing demand for battery diagnostics and service skills." },
  ];
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);
  return <><div className="secondary-stat-row"><div><span>Active programmes</span><strong>24</strong><small>Across 42 partner centres</small></div><div><span>Trainees in training</span><strong>1,286</strong><small>Current cohort</small></div><div><span>Certification rate</span><strong>91.4%</strong><small className="positive">+2.8% this quarter</small></div><div><span>Courses under review</span><strong>3</strong><small>Outcome data flagged</small></div></div><div className="section-title-row"><div><p className="eyebrow">COURSE CATALOGUE</p><h2>Programme outcomes</h2></div><button className="button button-light" aria-expanded={comparisonOpen} onClick={() => setComparisonOpen((open) => !open)}><FileBarChart2 size={15} />{comparisonOpen ? "Hide comparison" : "Compare programmes"}<ChevronDown size={14} className={comparisonOpen ? "rotate-chevron" : ""} /></button></div>{comparisonOpen && <section className="panel course-comparison"><div className="panel-heading"><div><p className="eyebrow">SIDE-BY-SIDE COMPARISON</p><h2>Programme performance</h2></div><button className="icon-button" aria-label="Close comparison" onClick={() => setComparisonOpen(false)}><X size={17} /></button></div><div className="table-wrap"><table className="trainee-table"><thead><tr><th>Programme</th><th>Training provider</th><th>Trainees</th><th>Certified</th><th>Placed</th></tr></thead><tbody>{courses.map((course) => <tr key={course.title}><td><strong>{course.title}</strong></td><td>{course.provider}</td><td>{course.trained}</td><td>{course.certified}</td><td>{course.placed}</td></tr>)}</tbody></table></div></section>}<div className="course-grid">{courses.map((course, index) => <article className={`course-card ${expandedCourse === course.title ? "course-card-expanded" : ""}`} key={course.title}><div className="course-card-head"><span className={`course-icon course-icon-${index}`}><GraduationCap size={19} /></span><button className="icon-button" aria-label={`${expandedCourse === course.title ? "Hide" : "Show"} details for ${course.title}`} aria-expanded={expandedCourse === course.title} onClick={() => setExpandedCourse((current) => current === course.title ? null : course.title)}><ChevronDown size={17} className={expandedCourse === course.title ? "rotate-chevron" : ""} /></button></div><span className="course-category">{course.mark}</span><h3>{course.title}</h3><p>{course.provider}</p><div className="course-metrics"><div><small>Trainees</small><strong>{course.trained}</strong></div><div><small>Certified</small><strong>{course.certified}</strong></div><div><small>Placed</small><strong>{course.placed}</strong></div></div>{expandedCourse === course.title && <p className="course-summary">{course.summary}</p>}<button className={`demand-note ${index < 2 ? "demand-high" : ""}`} aria-expanded={expandedCourse === course.title} onClick={() => setExpandedCourse((current) => current === course.title ? null : course.title)}><span />{course.demand}<ArrowRight size={14} /></button></article>)}</div></>;
}

function EmploymentPage({ records, verifiedIds, onVerify, openTrainee }) {
  const [outcomeFilter, setOutcomeFilter] = useState("All outcomes");
  const employed = records.filter((item) => item.status !== "Seeking work" && (outcomeFilter === "All outcomes" || item.status === outcomeFilter));
  return <><div className="secondary-stat-row employment-stats"><div><span>In paid employment</span><strong>{records.filter((item) => item.status === "Employed").length}</strong><small>Employed records in this view</small></div><div><span>Self-employed</span><strong>{records.filter((item) => item.status === "Self-employed").length}</strong><small>Current records</small></div><div><span>Apprenticeships</span><strong>{records.filter((item) => item.status === "Apprentice").length}</strong><small>Current records</small></div><div><span>Employer verified</span><strong>{records.length ? Math.round(records.filter((item) => verifiedIds.has(item.id)).length / records.length * 100) : 0}%</strong><small>Of records in this view</small></div></div><div className="section-title-row"><div><p className="eyebrow">RECENT EMPLOYMENT SIGNALS</p><h2>Employment records</h2></div><label className="filter-select"><Filter size={15} /><select value={outcomeFilter} onChange={(event) => setOutcomeFilter(event.target.value)}><option>All outcomes</option><option>Employed</option><option>Self-employed</option><option>Apprentice</option></select><ChevronDown size={14} /></label></div><section className="panel data-panel"><div className="table-wrap"><table className="trainee-table"><thead><tr><th>Trainee</th><th>Employer / activity</th><th>Role</th><th>Monthly wage</th><th>Retention</th><th>Verification</th><th /></tr></thead><tbody>{employed.map((person) => <tr key={person.id} onClick={() => openTrainee(person)}><td><span className="table-person"><span className="person-avatar sage">{person.initials}</span><span><strong>{person.name}</strong><small>{person.id}</small></span></span></td><td><span className="course-cell">{person.employer || "Not reported"}<small>{person.status}</small></span></td><td>{person.role || "-"}</td><td>{money(person.wage)}</td><td>{person.retention}</td><td><span className={`verification-status ${verifiedIds.has(person.id) ? "is-verified" : "is-unverified"}`}>{verifiedIds.has(person.id) ? <><CheckCircle2 size={15} /> Verified</> : <><X size={15} /> Not verified</>}</span></td><td><ChevronRight size={16} className="row-chevron" /></td></tr>)}</tbody></table>{employed.length === 0 && <div className="empty-state">No employment records match this outcome.</div>}</div><div className="verification-note"><ShieldCheck size={16} /><span>Employer confirmations are stored as a separate verification signal. Trainee-reported outcomes remain visible and are never overwritten.</span></div></section></>;
}

function FollowupsPage({ items, findTrainee, completedIds, onComplete, onOpenTrainee, onNew }) {
  const [channelFilter, setChannelFilter] = useState("All channels");
  const [showCompleted, setShowCompleted] = useState(false);
  const visibleItems = items.filter((item) => {
    const isDone = item.state === "Completed" || completedIds.has(item.id);
    return (showCompleted ? isDone : !isDone) && (channelFilter === "All channels" || item.channel === channelFilter);
  });
  return <><div className="follow-summary"><div><span className="follow-summary-icon orange"><CalendarDays size={17} /></span><span><small>Due today</small><strong>{items.filter((item) => item.state === "Due today").length}</strong></span></div><div><span className="follow-summary-icon red"><AlertMark /></span><span><small>Overdue</small><strong>{items.filter((item) => item.state === "Overdue").length}</strong></span></div><div><span className="follow-summary-icon green"><CheckCheck size={17} /></span><span><small>Completed this week</small><strong>{items.filter((item) => item.state === "Completed").length}</strong></span></div><button className="button button-primary" onClick={onNew}><Plus size={16} /> Schedule check-in</button></div><div className="section-title-row"><div><p className="eyebrow">FOLLOW-UP WORKLIST</p><h2>{showCompleted ? "Completed check-ins" : "Upcoming and overdue"}</h2></div><label className="filter-select"><Filter size={14} /><select value={channelFilter} onChange={(event) => setChannelFilter(event.target.value)}><option>All channels</option><option>WhatsApp</option><option>Phone call</option><option>SMS</option><option>Assisted in-person</option></select><ChevronDown size={14} /></label></div><section className="panel follow-table-panel"><div className="follow-table-head"><span>Trainee</span><span>Check-in</span><span>Channel</span><span>Due</span><span>Status</span><span>Action</span></div>{visibleItems.map((item) => { const person = findTrainee(item.traineeId); const isDone = item.state === "Completed" || completedIds.has(item.id); if (!person) return null; return <div className="follow-table-row" key={item.id}><button className="table-person follow-person" onClick={() => onOpenTrainee(person)}><span className="person-avatar sage">{person.initials}</span><span><strong>{person.name}</strong><small>{person.id}</small></span></button><span>{item.type}</span><span className="channel-cell">{item.channel}</span><span>{item.due}</span><span><span className={`status-tag ${isDone ? "tag-done" : item.state === "Overdue" ? "tag-alert" : item.state === "Scheduled" ? "tag-scheduled" : "tag-due"}`}>{isDone ? "Completed" : item.state}</span></span><button className="complete-action" disabled={isDone} onClick={() => onComplete(item.id)}>{isDone ? <><Check size={14} /> Done</> : "Mark complete"}</button></div>; })}{visibleItems.length === 0 && <div className="empty-state">No check-ins match this view.</div>}<div className="follow-table-foot"><span>Showing {visibleItems.length} check-ins</span><button onClick={() => setShowCompleted(!showCompleted)}>{showCompleted ? "View open check-ins" : "View completed"} <ArrowRight size={14} /></button></div></section><div className="low-burden-note"><span className="low-burden-icon"><HeartHandshake size={18} /></span><span><strong>Keep it easy to respond</strong><small>Use the trainee's preferred channel and ask only for the update you need. Every check-in includes a way to opt out.</small></span><button onClick={onNew}>Schedule with consent <ArrowRight size={14} /></button></div></>;
}

function AlertMark() { return <span className="alert-mark">!</span>; }

function AnalyticsPage({ onNotice }) {
  const [selectedDistrict, setSelectedDistrict] = useState("All districts");
  const [selectedCohort, setSelectedCohort] = useState("2025-26");
  const [selectedDemographic, setSelectedDemographic] = useState("All demographics");
  const districts = [
    { name: "Pune", placement: 78, retention: 81, wageChange: 2520, confidence: 88, change: "+8.1%", bars: [54,62,64,74,72,84,81,92,89,98], equity: [["Women","74%","+6.1%"],["Men","81%","+5.2%"],["Rural learners","71%","+7.4%"],["Urban learners","83%","+4.2%"]] },
    { name: "Kochi", placement: 73, retention: 76, wageChange: 2340, confidence: 85, change: "+5.6%", bars: [50,60,58,70,68,79,76,88,83,95], equity: [["Women","68%","+5.3%"],["Men","76%","+4.6%"],["Rural learners","66%","+6.2%"],["Urban learners","78%","+3.8%"]] },
    { name: "Jaipur", placement: 59, retention: 66, wageChange: 1800, confidence: 76, change: "+2.4%", bars: [42,48,53,61,60,69,66,75,72,84], equity: [["Women","55%","+3.8%"],["Men","63%","+2.9%"],["Rural learners","53%","+4.4%"],["Urban learners","67%","+2.1%"]] },
    { name: "Hyderabad", placement: 67, retention: 74, wageChange: 2180, confidence: 82, change: "+4.2%", bars: [48,57,59,68,66,78,74,86,82,94], equity: [["Women","64%","+4.7%"],["Men","70%","+3.9%"],["Rural learners","60%","+5.1%"],["Urban learners","74%","+3.4%"]] },
    { name: "Kolkata", placement: 62, retention: 71, wageChange: 1950, confidence: 79, change: "+3.1%", bars: [45,54,56,65,62,73,71,81,78,90], equity: [["Women","59%","+4.2%"],["Men","66%","+3.5%"],["Rural learners","56%","+4.8%"],["Urban learners","69%","+2.7%"]] },
  ];
  const aggregate = { name: "All districts", placement: 65.5, retention: 74, wageChange: 2180, confidence: 82, change: "+6.2%", bars: [52,61,59,72,68,81,78,90,86,98], equity: [["Women","62%","+5.1%"],["Men","68%","+4.4%"],["Rural learners","59%","+7.2%"],["Urban learners","71%","+3.2%"]] };
  const cohortAdjustments = {
    "2025-26": { placement: 0, retention: 0, wage: 0, confidence: 0, bars: 1 },
    "2024-25": { placement: -3.7, retention: -3.7, wage: -205, confidence: -2, bars: 0.95 },
    "2023-24": { placement: -6.9, retention: -7.6, wage: -440, confidence: -5, bars: 0.9 },
  };
  const demographicFactors = { "All demographics": 1, Women: 0.98, Men: 1.01, "Rural learners": 0.96, "Urban learners": 1.02 };
  const cohortAdjustment = cohortAdjustments[selectedCohort];
  const demographicFactor = demographicFactors[selectedDemographic] || 1;
  const applyFilters = (district) => {
    const groupRate = selectedDemographic === "All demographics"
      ? district.placement
      : Number.parseFloat(district.equity.find(([label]) => label === selectedDemographic)?.[1] || district.placement);
    return {
      ...district,
      placement: Math.max(0, Math.min(100, groupRate + cohortAdjustment.placement)),
      retention: Math.max(0, Math.min(100, district.retention + cohortAdjustment.retention)),
      wageChange: Math.max(0, district.wageChange + cohortAdjustment.wage),
      confidence: Math.max(0, Math.min(100, district.confidence + cohortAdjustment.confidence)),
      bars: district.bars.map((height) => Math.min(100, Math.round(height * cohortAdjustment.bars * demographicFactor))),
    };
  };
  const activeBase = districts.find((district) => district.name === selectedDistrict) || aggregate;
  const active = applyFilters(activeBase);
  const visibleDistricts = (selectedDistrict === "All districts" ? districts : [activeBase]).map(applyFilters);
  const exportAnalytics = () => {
    const rows = [
      { cohort: selectedCohort, demographic: selectedDemographic, section: "Programme outcomes", district: selectedDistrict, metric: "Placement rate", value: active.placement.toFixed(1) + "%" },
      { cohort: selectedCohort, demographic: selectedDemographic, section: "Programme outcomes", district: selectedDistrict, metric: "Retained at 6 months", value: active.retention.toFixed(1) + "%" },
      { cohort: selectedCohort, demographic: selectedDemographic, section: "Programme outcomes", district: selectedDistrict, metric: "Median wage change", value: "INR " + active.wageChange },
      { cohort: selectedCohort, demographic: selectedDemographic, section: "Programme outcomes", district: selectedDistrict, metric: "Outcome confidence", value: active.confidence + "%" },
      ...visibleDistricts.map((district) => ({ cohort: selectedCohort, demographic: selectedDemographic, section: "District placement", district: district.name, metric: "Placement rate", value: district.placement.toFixed(1) + "%" })),
    ];
    if (exportCsv("government-outcomes-analytics.csv", rows)) onNotice("Government analytics CSV downloaded.");
    else onNotice("No analytics data is available to export.");
  };
  const groups = active.equity.map(([label, rate, change]) => [
    label,
    label === selectedDemographic ? active.placement.toFixed(1) + "%" : rate,
    change,
  ]);
  const bars = active.bars;
  return <><div className="analytics-filters"><label className="filter-select"><CalendarDays size={14} /><select aria-label="Select cohort" value={selectedCohort} onChange={(event) => setSelectedCohort(event.target.value)}><option>2025-26</option><option>2024-25</option><option>2023-24</option></select><ChevronDown size={14} /></label><label className="filter-select"><Building2 size={14} /><select aria-label="Select district" value={selectedDistrict} onChange={(event) => setSelectedDistrict(event.target.value)}><option>All districts</option>{districts.map((district) => <option key={district.name}>{district.name}</option>)}</select><ChevronDown size={14} /></label><label className="filter-select"><Users size={14} /><select aria-label="Select demographic group" value={selectedDemographic} onChange={(event) => setSelectedDemographic(event.target.value)}><option>All demographics</option><option>Women</option><option>Men</option><option>Rural learners</option><option>Urban learners</option></select><ChevronDown size={14} /></label><button className="button button-light" onClick={exportAnalytics}><Download size={15} /> Export</button></div><div className="analytics-kpis"><div className="panel analytics-kpi"><small>Placement rate{selectedDistrict === "All districts" ? "" : " - " + selectedDistrict}</small><strong>{active.placement.toFixed(1)}%</strong><span className="positive"><TrendingUp size={13} /> {active.change} vs previous cohort</span></div><div className="panel analytics-kpi"><small>Retained at 6 months</small><strong>{active.retention.toFixed(1)}%</strong><span className="positive"><TrendingUp size={13} /> {selectedCohort} cohort</span></div><div className="panel analytics-kpi"><small>Median wage change</small><strong>+INR {active.wageChange.toLocaleString("en-IN")}</strong><span>Between first and latest follow-up</span></div><div className="panel analytics-kpi"><small>Outcome confidence</small><strong>{active.confidence}%</strong><span>Verified or trainee-confirmed</span></div></div><div className="analytics-main-grid"><section className="panel analytics-chart-panel"><div className="panel-heading"><div><p className="eyebrow">WAGE PROGRESSION{selectedDistrict === "All districts" ? "" : " - " + selectedDistrict.toUpperCase()}</p><h2>Median monthly wages</h2></div><span className="muted">{selectedCohort} - {selectedDemographic}</span></div><div className="wage-chart"><div className="wage-axis"><span>INR 22k</span><span>INR 18k</span><span>INR 14k</span><span>INR 10k</span></div><div className="wage-bars">{bars.map((height, index) => <div className="wage-bar-group" key={index}><div className="wage-bar" style={{ height: height + "%" }} /><span>{["Start", "1 mo", "2 mo", "3 mo", "4 mo", "5 mo", "6 mo", "7 mo", "8 mo", "Now"][index]}</span></div>)}</div></div></section><section className="panel district-panel"><div className="panel-heading"><div><p className="eyebrow">{selectedDistrict === "All districts" ? "DISTRICT COMPARISON" : "SELECTED DISTRICT"}</p><h2>Placement rate</h2></div><button className="icon-button" aria-label="Export district placement data" title="Export district placement data" onClick={exportAnalytics}><Download size={15} /></button></div>{visibleDistricts.map((district) => <div className="district-row" key={district.name}><span>{district.name}</span><div><i style={{ width: district.placement + "%" }} /></div><strong>{district.placement.toFixed(1)}%</strong></div>)}</section></div><section className="panel demographic-panel"><div className="panel-heading"><div><p className="eyebrow">EQUITY CHECK</p><h2>Outcomes by learner group</h2></div><span className="muted">{selectedDemographic} - {selectedDistrict} - {selectedCohort}</span></div><div className="equity-grid">{groups.map(([label, rate, change]) => <div className={label === selectedDemographic ? "equity-active" : ""} key={label}><span>{label}</span><strong>{rate}</strong><small className="positive"><TrendingUp size={12} /> {change}</small></div>)}</div></section></>;
}
function InsightsPage({ onNavigate, onNotice }) {
  return <><div className="insights-toolbar"><div><p className="eyebrow">PROGRAMME SIGNALS</p><span>Verified outcomes and follow-up signals</span></div><button className="button button-light" onClick={() => onNotice("Insights summary exported.")}><Download size={15} /> Export summary</button></div><div className="insights-list"><article className="insight-card insight-priority"><div className="insight-card-top"><span className="insight-category"><i className="priority-dot" /> Placement gap</span><span className="insight-period">Updated 2 days ago</span><button className="icon-button"><MoreHorizontal size={18} /></button></div><h2>EV trainees in Jaipur are waiting 16 days longer to find work</h2><p>Among 186 graduates of Electric Vehicle Service, 38 are still seeking work after 60 days. Local employers report that candidates need more hands-on battery diagnostics experience.</p><div className="insight-evidence"><span><strong>47 days</strong><small>Median time to placement</small></span><span><strong>38 learners</strong><small>May need placement support</small></span><span><strong>12 employers</strong><small>Interviewed this quarter</small></span></div><button className="button button-primary" onClick={() => { onNavigate("Training"); onNotice("Course and placement review opened."); }}>Review course &amp; placement <ArrowRight size={15} /></button></article><article className="insight-card"><div className="insight-card-top"><span className="insight-category"><i className="positive-dot" /> Wage progression</span><span className="insight-period">Updated 5 days ago</span><button className="icon-button"><MoreHorizontal size={18} /></button></div><h2>Solar graduates report stronger wage growth after month three</h2><p>Trainees who received an employer check-in at the 90-day mark saw 14% higher median wage growth. The relationship is promising, but does not establish causation.</p><div className="insight-evidence"><span><strong>+14%</strong><small>Median wage difference</small></span><span><strong>312</strong><small>Consented responses</small></span><span><strong>High</strong><small>Response confidence</small></span></div><button className="button button-light" onClick={() => onNavigate("Analytics")}>Explore wage data <ArrowRight size={15} /></button></article><article className="insight-card"><div className="insight-card-top"><span className="insight-category"><i className="blue-dot" /> Retention signal</span><span className="insight-period">Updated 1 week ago</span><button className="icon-button"><MoreHorizontal size={18} /></button></div><h2>Commute costs are a recurring reason for early exits</h2><p>In Patna and Jaipur, 1 in 5 trainees who left work cited travel cost or distance. Flexible shifts and travel support were common suggestions in follow-up responses.</p><button className="button button-light" onClick={() => onNavigate("Follow-ups")}>Review trainee responses <ArrowRight size={15} /></button></article></div></>;
}

function GovernmentOfficerProfile({ details, user, email, onSave }) {
  const officerName = user?.name || details.name;
  const [photo, setPhoto] = useState(user?.avatar?.startsWith("data:image/") ? user.avatar : "");
  const [saving, setSaving] = useState(false);
  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    await onSave({ avatar: photo });
    setSaving(false);
  };
  return <section className="government-profile-card"><div className="government-profile-avatar">{photo ? <img src={photo} alt={`${officerName}'s profile`} /> : officerName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</div><div className="government-profile-intro"><span className="eyebrow">OFFICER DETAILS</span><h2>{officerName}</h2><p>Government programme account</p><label className="government-photo-upload">Upload photo<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : ""); reader.readAsDataURL(file); }} /></label></div><form className="government-profile-edit" onSubmit={saveProfile}><div><small>Department name</small><strong>{user?.department || "Not provided"}</strong></div><div><small>Designation</small><strong>{user?.designation || "Not provided"}</strong></div><div><small>Officer name</small><strong>{officerName}</strong></div><div><small>Officer e-mail</small><strong>{email || user?.email || "Not provided"}</strong></div><button className="button button-primary" disabled={saving || !photo}>{saving ? "Saving..." : "Save profile photo"}</button></form></section>;
}

function SettingsPage({ role, onNotice }) {
  const trainee = role === "Trainee";
  const employer = role === "Employer";
  const provider = role === "Training Provider";
  const title = trainee ? "Privacy and contact preferences" : employer ? "Company profile and permissions" : provider ? "Institute profile and account" : "Consent and privacy";
  const description = trainee ? "Choose how the programme can contact you and what personal information you consent to share." : employer ? "Manage company contact details and the employment information your team can verify." : provider ? "Manage institute details, authorised contacts, and the learner information your team can access." : "Your workspace only uses trainee records for the purposes they agreed to. Consent status is visible on every profile.";
  return <div className="settings-layout"><div className="settings-nav"><button className="settings-tab active"><ShieldCheck size={16} /> {trainee ? "Privacy & consent" : "Profile details"}</button><button className="settings-tab"><Users size={16} /> {trainee ? "Contact preferences" : "Team access"}</button><button className="settings-tab"><FileBarChart2 size={16} /> {trainee ? "Data shared" : "Data permissions"}</button><button className="settings-tab"><Building2 size={16} /> {trainee ? "Account security" : "Organisation"}</button></div><section className="panel settings-panel"><p className="eyebrow">{trainee ? "YOUR CHOICES" : "WORKSPACE CONTROLS"}</p><h2>{title}</h2><p className="settings-desc">{description}</p>{trainee && <div className="settings-profile-summary"><span className="profile-avatar">AM</span><span><strong>Aarav Mehta</strong><small>Contact number ending in 421  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Pune, Maharashtra</small></span><button className="text-link" onClick={() => onNotice("Profile update request sent.")}>Request update</button></div>}<SettingRow title={trainee ? "Allow programme follow-ups" : "Require consent before follow-up"} note={trainee ? "You can pause or withdraw consent at any time." : "Only contact trainees with active follow-up consent."} checked /><SettingRow title={trainee ? "Contact me on WhatsApp" : "Mask phone numbers in exports"} note={trainee ? "Your preferred channel for check-ins." : "Full contact details stay limited to authorised staff."} checked /><SettingRow title={trainee ? "Share employment updates with my programme" : employer ? "Allow employment verification requests" : "Include employer verification"} note={trainee ? "Your work information is shared only with your consent." : "Employment confirmation is stored as a separate, auditable signal."} checked /><SettingRow title={trainee ? "Share de-identified programme analytics" : "Share de-identified cohort analytics"} note="Personal details are excluded from aggregate reporting." checked={false} /><div className="settings-save"><span><ShieldCheck size={15} /> Changes are recorded securely</span><button className="button button-primary" onClick={() => onNotice("Settings saved.")}>Save settings</button></div></section></div>;
}

function SettingRow({ title, note, checked }) {
  const [enabled, setEnabled] = useState(checked);
  return <div className="setting-row"><span><strong>{title}</strong><small>{note}</small></span><button role="switch" aria-checked={enabled} className={`toggle ${enabled ? "toggle-on" : ""}`} onClick={() => setEnabled(!enabled)}><i /></button></div>;
}

function TraineeDrawer({ person, isVerified, close, onFollowup, onNavigate }) {
  return <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><aside className="trainee-drawer"><div className="drawer-header"><span className="eyebrow">TRAINEE PROFILE</span><button className="icon-button" onClick={close} aria-label="Close profile"><X size={19} /></button></div><div className="profile-identity"><span className="profile-avatar">{person.initials}</span><div><h2>{person.name}</h2><span>{person.id} <i /> {person.city}</span></div><span className="consent-pill"><ShieldCheck size={13} /> Consented</span></div><div className="profile-actions"><button className="button button-primary" onClick={() => { close(); onFollowup(); }}><CalendarDays size={15} /> Schedule follow-up</button><button className="button button-light" onClick={() => { close(); onNavigate("Employment"); }}><BriefcaseBusiness size={15} /> Employment</button></div><div className="profile-section"><div className="profile-section-heading"><h3>Current outcome</h3><OutcomeBadge status={person.status} /></div><div className="profile-facts"><div><small>Employer / activity</small><strong>{person.employer || "No current employer"}</strong></div><div><small>Role</small><strong>{person.role || "Seeking placement"}</strong></div><div><small>Monthly wage</small><strong>{person.wage ? money(person.wage) : "Not reported"}</strong></div><div><small>Time in role</small><strong>{person.retention}</strong></div></div>{isVerified && <div className="profile-verified"><CheckCircle2 size={15} /> Employer information verified</div>}</div><div className="profile-section"><div className="profile-section-heading"><h3>Training history</h3><button className="text-link" onClick={() => { close(); onNavigate("Training"); }}>View programme</button></div><div className="timeline-item"><i className="timeline-dot done" /><span><strong>{person.course}</strong><small>{person.provider}</small><small>Completed {person.trained}</small></span><span className="timeline-status">Certified</span></div><div className="timeline-item"><i className="timeline-dot current" /><span><strong>{person.status === "Seeking work" ? "Placement support" : "Employment outcome"}</strong><small>{person.employer || "Awaiting placement"}</small><small>{person.status === "Seeking work" ? "Last update: 18 Sep 2026" : `Employed for ${person.retention}`}</small></span><span className="timeline-status">Current</span></div></div><div className="profile-section"><div className="profile-section-heading"><h3>Wage progression</h3><span className="muted">Monthly</span></div><div className="mini-wage-chart"><div><span>At placement</span><i style={{ width: `${Math.max(30, (person.wage - 6000) / 200)}%` }} /><strong>{money(Math.max(7000, person.wage - 2500))}</strong></div><div><span>Latest update</span><i style={{ width: `${Math.max(38, person.wage / 240)}%` }} /><strong>{person.wage ? money(person.wage) : "-"}</strong></div></div></div><div className="profile-section profile-consent"><ShieldCheck size={18} /><span><strong>Follow-up consent is active</strong><small>Preferred channel: WhatsApp  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Updated 12 Aug 2026</small></span><button className="text-link">View</button></div><p className="profile-footnote">Personal details are limited to authorised programme staff. <button>View access history</button></p></aside></div>;
}

function EmployerProfileModal({ profile, onSave, onClose }) {
  const [draft, setDraft] = useState(profile);
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const readPhoto = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => update("photo", String(reader.result || ""));
    reader.readAsDataURL(file);
  };
  return <div className="modal-backdrop employer-profile-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><form className="employer-profile-modal" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}><div className="modal-head"><div><p className="eyebrow">EMPLOYER ACCOUNT</p><h2>Your profile</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close profile"><X size={19} /></button></div><div className="employer-photo-row"><span className="employer-profile-photo">{draft.photo ? <img src={draft.photo} alt="Profile" /> : (draft.name || "E").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><label className="button button-light employer-photo-upload"><Upload size={15} /> Upload photo<input type="file" accept="image/*" onChange={(event) => readPhoto(event.target.files?.[0])} /></label><small>Choose a profile photo for your account icon.</small></div><div className="employer-profile-fields"><label>Name<input value={draft.name} readOnly /></label><label>Company name<input value={draft.companyName} readOnly /></label><label>Work email<input type="email" value={draft.email} readOnly /></label><label>Employee ID<input value={draft.employeeId} onChange={(event) => update("employeeId", event.target.value)} /></label><label>Phone number<input type="tel" value={draft.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Add phone number" /></label><label>Job role<input value={draft.jobRole} onChange={(event) => update("jobRole", event.target.value)} placeholder="Employer representative" /></label><label>Joining date<input type="date" value={draft.joiningDate} onChange={(event) => update("joiningDate", event.target.value)} /></label><label>Employment type<select value={draft.employmentType} onChange={(event) => update("employmentType", event.target.value)}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Apprenticeship</option></select></label><label>Employment status<select value={draft.employmentStatus} onChange={(event) => update("employmentStatus", event.target.value)}><option>Active</option><option>On leave</option><option>Exited</option></select></label><label>Work location<input value={draft.workLocation} onChange={(event) => update("workLocation", event.target.value)} placeholder="City or worksite" /></label></div><div className="modal-actions"><button type="button" className="button button-light" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">Save profile</button></div></form></div>;
}

function EmployerEmployeeDrawer({ person, close, onNavigate, onRequestUpdate }) {
  const [editing, setEditing] = useState(false);
  return <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><aside className="trainee-drawer"><div className="drawer-header"><span className="eyebrow">EMPLOYEE PROFILE</span><button className="icon-button" onClick={close} aria-label="Close employee profile"><X size={19} /></button></div><div className="profile-identity"><span className="profile-avatar">{person.initials}</span><div><h2>{person.name}</h2><span>{person.id} <i /> {person.city}</span></div><OutcomeBadge status={person.status} /></div><div className="profile-actions"><button className="button button-primary" onClick={() => setEditing(true)}><Settings2 size={15} /> Update employment</button><button className="button button-light" onClick={() => { close(); onNavigate("Employment History"); }}><Activity size={15} /> Employment history</button></div><div className="profile-section"><div className="profile-section-heading"><h3>Current employment</h3><span className={person.verified ? "verified-label" : "status-tag tag-due"}>{person.verified ? "Verified" : "Awaiting verification"}</span></div><div className="profile-facts"><div><small>Company</small><strong>{person.employer || "Not reported"}</strong></div><div><small>Job role</small><strong>{person.role || "Not provided"}</strong></div><div><small>Employment status</small><strong>{person.status}</strong></div><div><small>Joining date</small><strong>{person.joinedAt || "Not reported"}</strong></div><div><small>Monthly wage</small><strong>{person.wage ? money(person.wage) : "Not reported"}</strong></div><div><small>Time in role</small><strong>{person.retention || "Not reported"}</strong></div></div></div><div className="profile-section"><div className="profile-section-heading"><h3>Training and hiring history</h3><span className="muted">{person.id}</span></div><div className="timeline-item"><i className="timeline-dot done" /><span><strong>{person.course}</strong><small>{person.provider}</small><small>Training completed {person.trained}</small></span><span className="timeline-status">Completed</span></div><div className="timeline-item"><i className={`timeline-dot ${person.employer ? "current" : ""}`} /><span><strong>{person.employer ? "Employment started" : "No employment record"}</strong><small>{person.role || "Role not reported"}</small><small>{person.joinedAt || "Joining date not reported"}</small></span><span className="timeline-status">Current</span></div></div><div className="profile-section profile-consent"><ShieldCheck size={18} /><span><strong>{person.consent ? "Consent active" : "Consent not active"}</strong><small>Personal information is limited to authorised employer staff.</small></span></div>{editing && <EmployerUpdateModal person={person} close={() => setEditing(false)} onSubmit={async (data) => { if (await onRequestUpdate(person, data)) setEditing(false); }} />}</aside></div>;
}

function FollowupModal({ records, close, onSave }) {
  const eligibleRecords = records.filter((item) => item.consent);
  const [traineeId, setTraineeId] = useState(eligibleRecords[0]?.id || "");
  const [channel, setChannel] = useState("WhatsApp");
  const [type, setType] = useState("Employment check-in");
  const [scheduledDate, setScheduledDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const person = eligibleRecords.find((item) => item.id === traineeId);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><form className="follow-modal" onSubmit={(event) => { event.preventDefault(); if (person) onSave({ traineeId, channel, type, scheduledAt: new Date(`${scheduledDate}T10:00:00`).toISOString() }); }}><div className="modal-head"><div><p className="eyebrow">TRAINEE OUTREACH</p><h2>Schedule a follow-up</h2></div><button type="button" className="icon-button" onClick={close} aria-label="Close"><X size={19} /></button></div><p className="modal-intro">A brief check-in helps keep outcome records current. The trainee can opt out at any time.</p>{eligibleRecords.length ? <><label>Trainee<select value={traineeId} onChange={(event) => setTraineeId(event.target.value)}>{eligibleRecords.map((item) => <option key={item.id} value={item.id}>{item.name}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {item.id}</option>)}</select></label><div className="modal-trainee-summary"><span className="person-avatar sage">{person?.initials}</span><span><strong>{person?.name}</strong><small>{person?.phone}  - ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Consent active</small></span><span className="consent-pill"><ShieldCheck size={13} /> Opt-in</span></div><label>Check-in type<select value={type} onChange={(event) => setType(event.target.value)}><option>Employment check-in</option><option>Placement support</option><option>Wage update</option><option>Employer confirmation</option><option>Apprenticeship check-in</option></select></label><label>Preferred channel<select value={channel} onChange={(event) => setChannel(event.target.value)}><option>WhatsApp</option><option>Phone call</option><option>SMS</option><option>Assisted in-person</option></select></label><label>Schedule for<input type="date" value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} required /></label></> : <p className="empty-state">No trainees in this workspace have active follow-up consent.</p>}<div className="modal-actions"><button type="button" className="button button-light" onClick={close}>Cancel</button><button className="button button-primary" type="submit" disabled={!person}><CalendarDays size={15} /> Schedule follow-up</button></div></form></div>;
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const appRoot = globalThis.__kaaryaRoot || createRoot(rootElement);
  globalThis.__kaaryaRoot = appRoot;
  appRoot.render(<App />);
}

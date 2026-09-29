import React, { useState, useEffect } from "react";
import {
  Activity, ArrowRight, Award, Bell, BookOpen, BriefcaseBusiness,
  Building, CalendarDays, Camera, Check, CheckCircle2, ChevronDown,
  ChevronRight, Clock, Download, ExternalLink, Eye, FileText,
  Filter, GraduationCap, Layers, LogOut, MapPin, Plus, CircleHelp, Copy,
  Search, Settings2, ShieldCheck, Sparkles, Target, Trash2,
  TrendingUp, Upload, UserRound, Users, X, AlertCircle
} from "lucide-react";

export function formatINR(val) {
  const num = Number(val);
  if (isNaN(num)) return "INR 0";
  return `INR ${num.toLocaleString("en-IN")}`;
}

export const defaultTraineeProfile = {
  name: "",
  educationLevel: "",
  degreeName: "",
  yearOfCompletion: "",
  cgpa: "",
  email: "",
  institute: "",
  linkedin: "",
  github: "",
  photo: "",
};

export const defaultEmploymentRecord = {
  status: "Employed",
  company: "SunGrid Energy Solutions Pvt. Ltd.",
  role: "Graduate Engineer Trainee - Solar Installations",
  industry: "Renewable Energy & Clean Tech",
  joinedAt: "2025-08-18",
  salary: "28000",
  location: "Jaipur, Rajasthan",
  type: "Full-time",
  employerVerified: true,
  verificationDate: "2026-09-18",
};

export const defaultTrainingList = [
  {
    id: "TRN-01",
    course: "Solar Photovoltaic System Design & Installation",
    provider: "Udaan Skills Centre",
    start: "05 May 2025",
    end: "12 Aug 2025",
    duration: "14 Weeks (360 Hours)",
    trainingMode: "Hybrid (70% Practical Workshop & On-Site Labs + 30% Digital Theory)",
    skillsCovered: "Photovoltaic System Sizing, String Inverter Synchronization, MPPT Controller Tuning, DC Cable Routing, Earthing & Surge Protection, System Testing",
    description: "In-depth industrial skills curriculum covering design, commissioning, and diagnostic maintenance of grid-tied and commercial solar PV installations under National Skill Qualification Framework (NSQF Level 4).",
    assessment: "Passed • Grade A+ (94%)",
    certId: "CERT-2025-SLR-9041",
    certificateName: "Certified Solar PV Installation & Commissioning Specialist",
    verified: true,
  },
  {
    id: "TRN-02",
    course: "Industrial Automation & Sensor Interfacing",
    provider: "Kaushal Technical Academy",
    start: "10 Jan 2025",
    end: "18 Apr 2025",
    duration: "12 Weeks (280 Hours)",
    trainingMode: "Classroom & Hands-on Hardware Lab",
    skillsCovered: "PLC Ladder Logic, Digital Sensor Calibration, Relay Logic Circuits, SCADA Setup, Industrial Diagnostic Protocols",
    description: "Hands-on foundation in industrial automation, PLC programming, telemetry sensor integration, and predictive maintenance for modern renewable energy power plants.",
    assessment: "Passed • Grade A (89%)",
    certId: "CERT-2025-AUT-4819",
    certificateName: "Industrial Automation Foundation Credential",
    verified: true,
  },
  {
    id: "TRN-03",
    course: "Electric Vehicle (EV) Powertrain & Battery Fundamentals",
    provider: "Saksham Skills Foundation",
    start: "01 Sep 2024",
    end: "20 Nov 2024",
    duration: "10 Weeks (200 Hours)",
    trainingMode: "Digital Interactive & Simulation Labs",
    skillsCovered: "Lithium-ion BMS Diagnostics, Thermal Management, High-Voltage Safety, EV Charging Protocols, Telemetry",
    description: "Comprehensive foundational programme on lithium-ion chemistry, high-voltage vehicle electrical safety, battery management architectures, and DC fast charging.",
    assessment: "Passed • Grade B+ (84%)",
    certId: "CERT-2024-EVP-2201",
    certificateName: "EV Powertrain & High-Voltage Safety Certificate",
    verified: true,
  },
];

export const defaultCertificates = [
  {
    id: "CERT-2025-SLR-9041",
    name: "Solar PV Installation & Commissioning Specialist (NSQF-4)",
    issueDate: "2025-08-14",
    issuer: "Udaan Skills Centre & NSDC",
    status: "Verified",
    verifiedDate: "2025-08-16",
  },
  {
    id: "CERT-2025-AUT-4819",
    name: "Industrial Automation & PLC Specialist Credential",
    issueDate: "2025-04-20",
    issuer: "Kaushal Technical Academy",
    status: "Verified",
    verifiedDate: "2025-04-22",
  },
  {
    id: "CERT-2024-EVP-2201",
    name: "EV High-Voltage Safety & Battery Diagnostics",
    issueDate: "2024-11-25",
    issuer: "Saksham Skills Foundation",
    status: "Verified",
    verifiedDate: "2024-11-28",
  },
];

export const defaultSalaryHistory = [
  {
    date: "Aug 2025",
    fullDate: "2025-08-18",
    employer: "SunGrid Energy Solutions Pvt. Ltd.",
    role: "Graduate Engineer Trainee - Solar Installations",
    previousWage: 0,
    wage: 18000,
    hikeAmount: 0,
    hikePercent: 0,
    reason: "Initial Placement & Joining",
    verified: true,
  },
  {
    date: "Dec 2025",
    fullDate: "2025-12-15",
    employer: "SunGrid Energy Solutions Pvt. Ltd.",
    role: "Graduate Engineer Trainee - Solar Installations",
    previousWage: 18000,
    wage: 22500,
    hikeAmount: 4500,
    hikePercent: 25.0,
    reason: "Probation Clearance & Skill Certification Bonus",
    verified: true,
  },
  {
    date: "Aug 2026",
    fullDate: "2026-08-18",
    employer: "SunGrid Energy Solutions Pvt. Ltd.",
    role: "Graduate Engineer Trainee - Solar Installations",
    previousWage: 22500,
    wage: 28000,
    hikeAmount: 5500,
    hikePercent: 24.4,
    reason: "Annual Performance Appraisal & Project Lead Recognition",
    verified: true,
  },
];

export const defaultTraineeNotifications = [
  {
    id: "NOTIF-1",
    title: "Employer Verification Completed",
    body: "SunGrid Energy Solutions confirmed your appointment as Graduate Engineer Trainee and verified your joining records.",
    createdAt: "2026-09-18T10:30:00Z",
    isRead: false,
    type: "verification",
  },
  {
    id: "NOTIF-2",
    title: "Certificate Issued & Digitally Signed",
    body: "Your Solar PV Installation certification ID CERT-2025-SLR-9041 was verified and digitally stamped by Udaan Skills Centre.",
    createdAt: "2026-09-12T14:15:00Z",
    isRead: false,
    type: "certificate",
  },
  {
    id: "NOTIF-3",
    title: "Salary Increment Logged",
    body: "Annual appraisal salary hike of +24.4% (INR 28,000/month) has been recorded in your salary tracker.",
    createdAt: "2026-08-20T09:00:00Z",
    isRead: true,
    type: "salary",
  },
  {
    id: "NOTIF-4",
    title: "Skill Gap Identified in Regional Market",
    body: "48 solar & clean-tech employers in Rajasthan are actively hiring for Battery Energy Storage Systems (BESS). Consider adding it to your learning plan.",
    createdAt: "2026-08-05T16:45:00Z",
    isRead: true,
    type: "skill",
  },
];

/* =========================================================================
   1. TRAINEE PROFILE MODAL
   ========================================================================= */
export function TraineeProfileModal({ profile, onSave, onClose }) {
  const [draft, setDraft] = useState(() => ({
    name: profile?.name || defaultTraineeProfile.name,
    educationLevel: profile?.educationLevel || defaultTraineeProfile.educationLevel,
    degreeName: profile?.degreeName || defaultTraineeProfile.degreeName,
    yearOfCompletion: profile?.yearOfCompletion || defaultTraineeProfile.yearOfCompletion,
    cgpa: profile?.cgpa ?? defaultTraineeProfile.cgpa,
    email: profile?.email || defaultTraineeProfile.email,
    institute: profile?.institute || defaultTraineeProfile.institute,
    linkedin: profile?.linkedin || defaultTraineeProfile.linkedin,
    github: profile?.github || defaultTraineeProfile.github,
    photo: profile?.photo || "",
  }));

  const setField = (key, val) => setDraft((curr) => ({ ...curr, [key]: val }));

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Please upload a photo smaller than 8 MB.");
      e.target.value = "";
      return;
    }
    const image = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      image.onload = () => {
        const scale = Math.min(1, 640 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        setField("photo", canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setField("photo", "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(draft);
  };

  const educationLevels = ["Below 12", "ITI", "Diploma", "Undergraduate", "Post graduate", "Others"];

  return (
    <div className="trainee-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="trainee-profile-modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="trainee-modal-header">
          <div>
            <span className="trainee-badge-tag"><UserRound size={13} /> Trainee Profile</span>
            <h2 id="modal-title">Edit Your Profile</h2>
            <p>Update your academic, contact, and career records.</p>
          </div>
          <button type="button" className="icon-button modal-close-btn" onClick={onClose} aria-label="Close profile">
            <X size={18} />
          </button>
        </div>

        {/* Top Circular Photo Display & Upload */}
        <div className="trainee-photo-upload-section">
          <div className="trainee-photo-circle-wrap">
            <div
              className="trainee-circle-preview"
              style={
                draft.photo
                  ? { backgroundImage: `url(${draft.photo})`, backgroundSize: "cover", backgroundPosition: "center", color: "transparent" }
                  : {}
              }
            >
              {!draft.photo && (
                <span className="circle-initials">
                  {(draft.name || "AM")
                    .split(/\s+/)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </div>
            <label className="photo-upload-overlay" title="Upload profile photo">
              <Camera size={18} />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} />
            </label>
          </div>
          <div className="photo-meta">
            <strong>Profile Photo</strong>
            <p>This photo will appear in the top-right profile circle and across your records.</p>
            <div className="photo-btn-row">
              <label className="button button-light btn-sm photo-picker-btn">
                <Upload size={14} /> Upload new photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
              </label>
              {draft.photo && (
                <button type="button" className="button button-light btn-sm photo-remove-btn" onClick={handleRemovePhoto}>
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="trainee-modal-form">
          <div className="trainee-form-grid">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name <span className="req">*</span></label>
              <input
                id="name"
                type="text"
                required
                value={draft.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            {/* Education level */}
            <div className="form-group">
              <label htmlFor="educationLevel">Educational Qualification <span className="req">*</span></label>
              <select
                id="educationLevel"
                value={draft.educationLevel}
                onChange={(e) => setField("educationLevel", e.target.value)}
                required
              >
                <option value="" disabled>Select qualification</option>
                {educationLevels.map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="degreeName">Degree Name</label>
              <input id="degreeName" type="text" value={draft.degreeName} onChange={(e) => setField("degreeName", e.target.value)} placeholder="e.g. Diploma in Renewable Energy" />
            </div>

            {/* Year of Completion */}
            <div className="form-group">
              <label htmlFor="yearOfCompletion">Year of Completion <span className="req">*</span></label>
              <select
                id="yearOfCompletion"
                value={draft.yearOfCompletion}
                onChange={(e) => setField("yearOfCompletion", e.target.value)}
                required
              >
                <option value="" disabled>Select year</option>
                {Array.from({ length: 30 }, (_, index) => new Date().getFullYear() - 15 + index).map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* CGPA */}
            <div className="form-group">
              <label htmlFor="cgpa">CGPA (Out of 10) <span className="optional-tag">(Optional)</span></label>
              <input
                id="cgpa"
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={draft.cgpa}
                onChange={(e) => setField("cgpa", e.target.value)}
                placeholder="e.g. 8.65"
              />
            </div>

            {/* Gmail */}
            <div className="form-group">
              <label htmlFor="email">Gmail Address <span className="req">*</span></label>
              <input
                id="email"
                type="email"
                value={draft.email}
                readOnly
                aria-readonly="true"
                placeholder="Email used to sign in"
                required
              />
            </div>

            {/* Institute */}
            <div className="form-group">
              <label htmlFor="institute">Institute / College <span className="req">*</span></label>
              <input
                id="institute"
                type="text"
                value={draft.institute}
                onChange={(e) => setField("institute", e.target.value)}
                placeholder="e.g. Government Polytechnic Institute"
                required
              />
            </div>

            {/* LinkedIn ID */}
            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn ID / URL</label>
              <input
                id="linkedin"
                type="text"
                value={draft.linkedin}
                onChange={(e) => setField("linkedin", e.target.value)}
                placeholder="e.g. linkedin.com/in/aarav-mehta"
              />
            </div>

            {/* GitHub ID (Optional) */}
            <div className="form-group">
              <label htmlFor="github">
                GitHub ID <span className="optional-tag">(Optional)</span>
              </label>
              <input
                id="github"
                type="text"
                value={draft.github}
                onChange={(e) => setField("github", e.target.value)}
                placeholder="e.g. github.com/aaravmehta (optional)"
              />
            </div>
          </div>

          <div className="trainee-modal-actions">
            <button type="button" className="button button-light" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button-primary">
              <Check size={16} /> Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   2. TOP BAR NOTIFICATION DROPDOWN
   ========================================================================= */
export function TraineeNotificationDropdown({ notifications, onMarkAsRead, onMarkAllAsRead, onClose }) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="trainee-notif-dropdown">
      <div className="notif-dropdown-header">
        <div>
          <strong>Notifications</strong>
          <span className="notif-count-pill">{unreadCount} new</span>
        </div>
        <div className="notif-header-actions">
          {unreadCount > 0 && (
            <button type="button" className="text-link" onClick={onMarkAllAsRead}>
              Mark all as read
            </button>
          )}
          <button type="button" className="icon-button btn-sm" onClick={onClose} aria-label="Close notifications">
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">No notifications yet.</div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`notif-item ${item.isRead ? "notif-read" : "notif-unread"}`}
              onClick={() => onMarkAsRead(item.id)}
            >
              <span className={`notif-icon-circle notif-${item.type || "default"}`}>
                {item.type === "verification" && <ShieldCheck size={15} />}
                {item.type === "certificate" && <Award size={15} />}
                {item.type === "salary" && <TrendingUp size={15} />}
                {item.type === "skill" && <Sparkles size={15} />}
                {!item.type && <Bell size={15} />}
              </span>
              <div className="notif-copy">
                <div className="notif-title-row">
                  <strong>{item.title}</strong>
                  {!item.isRead && <span className="unread-dot" />}
                </div>
                <p>{item.body}</p>
                <time>{new Date(item.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</time>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   3. OVERVIEW SECTION
   ========================================================================= */
export function TraineeOverview({ profile, employment, trainingList, onNavigate, onOpenProfile }) {
  // Calculate profile completion percentage
  const fields = [
    { key: "name", label: "Full Name", weight: 20, filled: Boolean(profile?.name?.trim()) },
    { key: "educationLevel", label: "Educational Qualification", weight: 15, filled: Boolean(profile?.educationLevel?.trim()) },
    { key: "degreeName", label: "Degree Name", weight: 5, filled: Boolean(profile?.degreeName?.trim()) },
    { key: "yearOfCompletion", label: "Year of Completion", weight: 10, filled: Boolean(profile?.yearOfCompletion) },
    { key: "cgpa", label: "CGPA", weight: 10, filled: Boolean(profile?.cgpa) },
    { key: "email", label: "Gmail", weight: 15, filled: Boolean(profile?.email?.trim()) },
    { key: "institute", label: "Institute", weight: 10, filled: Boolean(profile?.institute?.trim()) },
    { key: "photo", label: "Profile Photo", weight: 10, filled: Boolean(profile?.photo) },
    { key: "linkedin", label: "LinkedIn ID", weight: 5, filled: Boolean(profile?.linkedin?.trim()) },
    { key: "github", label: "GitHub ID", weight: 0, filled: true },
  ];

  const completionPercent = Math.min(
    100,
    fields.reduce((acc, curr) => acc + (curr.filled ? curr.weight : 0), 0)
  );

  const latestTraining = trainingList?.[0] || null;
  const hasCurrentWork = ["Employed", "Self-employed", "Apprenticeship"].includes(employment?.status);
  const joinedAt = employment?.joinedAt ? new Date(`${employment.joinedAt}T12:00:00`) : null;
  const tenure = joinedAt && !Number.isNaN(joinedAt.getTime())
    ? `In role since ${joinedAt.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`
    : "Add your joining date in Employment Status";

  return (
    <div className="trainee-overview-container">
      {/* Welcome Banner */}
      <section className="trainee-welcome-card">
        <div className="welcome-content">
          <h1 className="welcome-heading">Welcome{profile?.name ? ` ${profile.name}` : ""}</h1>
          <p className="welcome-subtitle">
            Your profile, training, salary and career progress in one place.
          </p>
        </div>
      </section>

      {/* 4 Core Overview Cards */}
      <div className="trainee-four-cards-grid">
        {/* 1. Percent Profile Completion */}
        <div className="trainee-stat-card profile-completion-card">
          <div className="card-top-row">
            <span className="card-icon-pill icon-emerald">
              <UserRound size={18} />
            </span>
            <span className="badge-pill completion-badge">{completionPercent}% Completed</span>
          </div>
          <div className="card-body">
            <small className="card-label">Profile Completion</small>
            <div className="progress-number-row">
              <strong className="main-metric">{completionPercent}%</strong>
              <span className="metric-context">
                {completionPercent === 100 ? "Profile 100% complete" : "Complete your profile details"}
              </span>
            </div>
            {/* Visual Progress Bar */}
            <div className="completion-bar-track">
              <div className="completion-bar-fill" style={{ width: `${completionPercent}%` }} />
            </div>
            <p className="card-hint">
              {completionPercent < 100
                ? "Upload photo or add LinkedIn to boost verified placement matching."
                : "All profile fields are complete."}
            </p>
          </div>
          <button type="button" className="card-action-btn" onClick={onOpenProfile}>
            Complete your profile <ArrowRight size={14} />
          </button>
        </div>

        {/* 2. Current Salary */}
        <div className="trainee-stat-card salary-summary-card">
          <div className="card-top-row">
            <span className="card-icon-pill icon-blue">
              <TrendingUp size={18} />
            </span>
            <span className="badge-pill hike-badge">Salary tracker</span>
          </div>
          <div className="card-body">
            <small className="card-label">Current Monthly Salary</small>
            <div className="progress-number-row">
              <strong className="main-metric">{hasCurrentWork && Number(employment?.salary) > 0 ? formatINR(employment.salary) : "Not recorded"}</strong>
              <span className="metric-context">{hasCurrentWork && Number(employment?.salary) > 0 ? "/ month" : "No current salary"}</span>
            </div>
            <div className="salary-meta-row">
              <Building size={14} />
              <span>{hasCurrentWork ? (employment?.company || "Company not added") : "No current employment"}</span>
            </div>
            <p className="card-hint">
              {!hasCurrentWork ? "Update your employment status when you start work." : employment?.employerVerified ? "Verified by employer with payroll confirmation." : "Pending employer verification."}
            </p>
          </div>
          <button type="button" className="card-action-btn" onClick={() => onNavigate("Salary Progress")}>
            View salary tracker <ArrowRight size={14} />
          </button>
        </div>

        {/* 3. Latest Training Completed */}
        <div className="trainee-stat-card training-summary-card">
          <div className="card-top-row">
            <span className="card-icon-pill icon-amber">
              <GraduationCap size={18} />
            </span>
            {latestTraining && <span className={`badge-pill ${latestTraining.verified ? "verified-badge" : "status-tag tag-complete"}`}>
              {latestTraining.verified && <CheckCircle2 size={12} />} {latestTraining.verified ? "Verified" : "Training record"}
            </span>}
          </div>
          <div className="card-body">
            <small className="card-label">Latest Training Completed</small>
            <h3 className="training-title-text">{latestTraining?.course || "No training recorded yet"}</h3>
            {latestTraining && <>
              <div className="training-meta-sub"><span>{latestTraining.provider || "Provider not recorded"}</span><span className="dot-sep">{"\u00b7"}</span><span>{latestTraining.end || "Completion date not recorded"}</span></div>
              <div className="training-assessment-tag"><Award size={13} /> {latestTraining.assessment || "Assessment not recorded"}</div>
            </>}
          </div>
          <button type="button" className="card-action-btn" onClick={() => onNavigate("Training & Certificates")}>
            View training & certificates <ArrowRight size={14} />
          </button>
        </div>

        {/* 4. Career Progress Summary */}
        <div className="trainee-stat-card career-summary-card">
          <div className="card-top-row">
            <span className="card-icon-pill icon-purple">
              <BriefcaseBusiness size={18} />
            </span>
            <span className="badge-pill status-badge-pill">{employment?.status || "Employment status not added"}</span>
          </div>
          <div className="card-body">
            <small className="card-label">Career Progress Summary</small>
            <h3 className="career-title-text">{hasCurrentWork ? (employment?.role || "Current role not added") : "No current job reported"}</h3>
            <div className="career-tenure-tag"><Clock size={13} /> {hasCurrentWork ? tenure : employment?.status || "Employment status not added"}</div>
            <p className="card-hint">
              Review your employment and training details to keep this summary current.
            </p>
          </div>
          <button type="button" className="card-action-btn" onClick={() => onNavigate("Job History")}>
            Review career timeline <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}

/* =========================================================================
   4. TRAINING & CERTIFICATES SECTION
   ========================================================================= */
export function TraineeTrainingCertificates({
  profile,
  trainingList,
  certificates,
  onUploadCertificate,
  onDeleteCertificate,
  onNotice
}) {
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [certForm, setCertForm] = useState({
    name: "",
    id: "",
    issueDate: new Date().toISOString().slice(0, 10),
    file: null,
    fileName: "",
  });
  const [uploading, setUploading] = useState(false);
  const [viewingCert, setViewingCert] = useState(null);
  const profileName = (() => {
    try { return JSON.parse(localStorage.getItem("kaaryaTraineeProfile") || "{}").name || "Trainee"; }
    catch { return "Trainee"; }
  })();

  const toggleCourseDetails = (id) => {
    setExpandedCourseId((prev) => (prev === id ? null : id));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      onNotice("File must be smaller than 2 MB so it can be saved securely in this prototype.");
      e.target.value = "";
      return;
    }
    setCertForm((prev) => ({
      ...prev,
      file,
      fileName: file.name,
      name: prev.name || file.name.replace(/\.[^/.]+$/, ""),
      id: prev.id || `CERT-${Date.now().toString().slice(-6)}`,
    }));
  };

  const handleCertSubmit = (e) => {
    e.preventDefault();
    if (!certForm.name.trim()) {
      onNotice("Please provide a certificate name.");
      return;
    }
    if (!certForm.file) {
      onNotice("Choose a PDF or image file before uploading.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const newCert = {
        id: certForm.id || `CERT-${Date.now().toString().slice(-6)}`,
        name: certForm.name.trim(),
        issueDate: certForm.issueDate || new Date().toISOString().slice(0, 10),
        issuer: "Awaiting provider verification",
        status: "Pending Verification",
        verifiedDate: "",
        fileName: certForm.fileName,
        fileType: certForm.file.type,
        fileData: reader.result,
      };
      try {
        onUploadCertificate(newCert);
        setCertForm({ name: "", id: "", issueDate: new Date().toISOString().slice(0, 10), file: null, fileName: "" });
        setUploading(false);
        onNotice(`Certificate "${newCert.name}" uploaded and is waiting for verification.`);
      } catch {
        setUploading(false);
        onNotice("The certificate could not be saved. Try a smaller file.");
      }
    };
    reader.onerror = () => { setUploading(false); onNotice("The selected file could not be read."); };
    reader.readAsDataURL(certForm.file);
  };

  return (
    <div className="trainee-section-wrapper">
      {/* Part 1: Training List */}
      <div className="subsection-block">
        <h3 className="subsection-title">
          <BookOpen size={18} /> Enrolled & Completed Programmes
        </h3>

        <div className="courses-accordion-list">
          {trainingList.length === 0 && <div className="panel training-empty-state"><GraduationCap size={22} /><strong>No training records yet</strong><p>Your linked training records will appear here once they are added by your institute or provider.</p></div>}
          {trainingList.map((course) => {
            const isExpanded = expandedCourseId === course.id;
            return (
              <div key={course.id} className={`course-card ${isExpanded ? "course-card-expanded" : ""}`}>
                <div className="course-card-summary">
                  <div className="course-badge-icon">
                    <GraduationCap size={22} />
                  </div>
                  <div className="course-title-meta">
                    <div className="course-head-row">
                      <h4>{course.course}</h4>
                      {course.assessment && <span className="status-tag tag-complete">{course.assessment}</span>}
                    </div>
                    <div className="course-meta-tags">
                      <span className="meta-tag"><Building size={13} /> {course.provider}</span>
                      <span className="meta-tag"><CalendarDays size={13} /> Start: {course.start}</span>
                      <span className="meta-tag"><CalendarDays size={13} /> End: {course.end}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="button button-light btn-sm toggle-details-btn"
                    onClick={() => toggleCourseDetails(course.id)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? "Hide Details" : "Course Details"}
                    <ChevronDown size={15} className={`chevron-icon ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {/* Course Details (Visible on Click) */}
                {isExpanded && (
                  <div className="course-expanded-content">
                    <div className="details-grid-spec">
                      <div className="spec-card">
                        <small>Course Description</small>
                        <p>{course.description || "Course description has not been added yet."}</p>
                      </div>
                      <div className="spec-card">
                        <small>Duration</small>
                        <strong>{course.duration || "Not recorded"}</strong>
                      </div>
                      <div className="spec-card">
                        <small>Training Mode</small>
                        <strong>{course.trainingMode || "Not recorded"}</strong>
                      </div>
                      <div className="spec-card spec-full">
                        <small>Skills Covered</small>
                        <div className="skills-pill-wrap">
                          {(course.skillsCovered || "").split(",").filter((skill) => skill.trim()).map((skill) => (
                            <span key={skill} className="skill-chip">
                              <Check size={12} /> {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: Upload Certificate & Records */}
      <div className="subsection-block">
        <h3 className="subsection-title">
          <Award size={18} /> Certificates & Digital Credentials
        </h3>

        <div className="certificates-two-col">
          {/* Upload Form */}
          <div className="panel cert-upload-panel">
            <div className="panel-heading-clean">
              <span className="icon-circle-sm"><Upload size={16} /></span>
              <div>
                <strong>Upload Certificate</strong>
                <p>Upload credentials in PDF or Image format for employer verification.</p>
              </div>
            </div>

            <form onSubmit={handleCertSubmit} className="cert-form">
              <div className="form-group">
                <label>Certificate Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  value={certForm.name}
                  onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                  placeholder="e.g. Advanced Solar PV Commissioning Credential"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Certificate ID</label>
                  <input
                    type="text"
                    value={certForm.id}
                    onChange={(e) => setCertForm({ ...certForm, id: e.target.value })}
                    placeholder="e.g. CERT-2026-9042"
                  />
                </div>
                <div className="form-group">
                  <label>Issue Date</label>
                  <input
                    type="date"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Upload File (PDF / Image)</label>
                <div className="file-drop-area">
                  <Upload size={22} className="drop-icon" />
                  <span>{certForm.fileName || "Click or drag certificate document"}</span>
                  <small>Required · PDF or image · Max 2 MB</small>
                  <input type="file" accept="application/pdf,image/*" required onChange={handleFileChange} />
                </div>
              </div>

              <button type="submit" className="button button-primary btn-block" disabled={uploading}>
                {uploading ? "Uploading & Stamping..." : "Upload & Save Certificate"}
              </button>
            </form>
          </div>

          {/* Certificate List */}
          <div className="panel cert-list-panel">
            <div className="panel-heading-clean">
              <span className="icon-circle-sm"><ShieldCheck size={16} /></span>
              <div>
                <strong>Certificate Records</strong>
                <p>{certificates.length} digital credentials linked to your identity.</p>
              </div>
            </div>

            <div className="cert-items-stack">
              {certificates.length === 0 && <div className="cert-empty-state"><Award size={20} /><strong>No certificates uploaded</strong><span>Upload your first certificate to keep it with your training record.</span></div>}
              {certificates.map((cert) => (
                <div key={cert.id} className="cert-card-row">
                  <div className="cert-badge-left">
                    <Award size={22} />
                  </div>
                  <div className="cert-info-middle">
                    <strong>{cert.name}</strong>
                    <div className="cert-sub-tags">
                      <span className="mono-id">ID: {cert.id}</span>
                      <span>•</span>
                      <span>Issued: {cert.issueDate}</span>
                    </div>
                    <div className="cert-status-row">
                      <span className={`status-tag ${cert.status === "Verified" ? "tag-complete" : "tag-due"}`}>
                        <CheckCircle2 size={12} /> {cert.status}
                      </span>
                      {cert.issuer && <span className="issuer-text">By {cert.issuer}</span>}
                    </div>
                  </div>
                  <div className="cert-actions-right">
                    <button
                      type="button"
                      className="button button-light btn-sm"
                      onClick={() => setViewingCert(cert)}
                    >
                      <Eye size={13} /> View
                    </button>
                    {onDeleteCertificate && (
                      <button
                        type="button"
                        className="icon-button btn-sm delete-btn"
                        onClick={() => onDeleteCertificate(cert.id)}
                        title="Delete certificate"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {viewingCert && (
        <div className="trainee-modal-backdrop" onClick={() => setViewingCert(null)}>
          <div className="cert-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cert-preview-header">
              <div className="cert-seal"><Award size={28} /></div>
              <div>
                <h3>{viewingCert.name}</h3>
                <p>Certificate ID: {viewingCert.id} • Issued: {viewingCert.issueDate}</p>
              </div>
              <button className="icon-button modal-close-btn" onClick={() => setViewingCert(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="cert-preview-body">
              {viewingCert.fileData ? (
                viewingCert.fileType?.startsWith("image/") ? (
                  <img src={viewingCert.fileData} alt={viewingCert.name} style={{ display: "block", maxWidth: "100%", maxHeight: "65vh", margin: "0 auto", objectFit: "contain" }} />
                ) : (
                  <iframe title={`${viewingCert.name} certificate`} src={viewingCert.fileData} style={{ width: "100%", height: "65vh", border: 0, background: "#fff" }} />
                )
              ) : <div className="official-cert-card">
                <div className="cert-frame">
                  <div className="cert-inner-border">
                    <span className="emblem-text">NATIONAL SKILLS QUALIFICATION FRAMEWORK</span>
                    <h2>Certificate of Competence</h2>
                    <p className="cert-awarded-to">This credential is awarded to</p>
                    <h1 className="cert-recipient-name">{profileName}</h1>
                    <p className="cert-statement">
                      for having demonstrated mastery in <strong>{viewingCert.name}</strong> as verified by official
                      assessment criteria and employer standards.
                    </p>
                    <div className="cert-meta-footer">
                      <div>
                        <small>Certificate ID</small>
                        <strong>{viewingCert.id}</strong>
                      </div>
                      <div>
                        <small>Status</small>
                      <strong className={viewingCert.status === "Verified" ? "positive" : "verif-pending"}>{viewingCert.status}</strong>
                      </div>
                      <div>
                        <small>Issued Date</small>
                        <strong>{viewingCert.issueDate}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
            </div>
            <div className="cert-preview-actions">
              <button className="button button-light" onClick={() => setViewingCert(null)}>
                Close Preview
              </button>
              <button
                className="button button-primary"
                onClick={() => {
                  if (viewingCert.fileData) {
                    const link = document.createElement("a");
                    link.href = viewingCert.fileData;
                    link.download = viewingCert.fileName || `${viewingCert.id}.${viewingCert.fileType === "application/pdf" ? "pdf" : "jpg"}`;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  } else {
                    const record = `${viewingCert.name}\nCertificate ID: ${viewingCert.id}\nIssue date: ${viewingCert.issueDate}\nStatus: ${viewingCert.status}\nIssuer: ${viewingCert.issuer || "Not recorded"}`;
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(new Blob([record], { type: "text/plain;charset=utf-8" }));
                    link.download = `${viewingCert.id}-record.txt`;
                    link.click();
                    URL.revokeObjectURL(link.href);
                  }
                  onNotice(`Certificate record ${viewingCert.id} downloaded.`);
                }}
              >
                <Download size={15} /> Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   5. EMPLOYMENT STATUS SECTION
   ========================================================================= */
export function TraineeEmploymentStatus({ employment, onSaveEmployment, onNotice }) {
  const [formData, setFormData] = useState(() => ({
    status: employment?.status ?? defaultEmploymentRecord.status,
    company: employment?.company ?? defaultEmploymentRecord.company,
    role: employment?.role ?? defaultEmploymentRecord.role,
    industry: employment?.industry ?? defaultEmploymentRecord.industry,
    joinedAt: employment?.joinedAt ?? defaultEmploymentRecord.joinedAt,
    salary: employment?.salary ?? defaultEmploymentRecord.salary,
    location: employment?.location ?? defaultEmploymentRecord.location,
    type: employment?.type ?? defaultEmploymentRecord.type,
    skills: employment?.skills ?? [],
    employerVerified: employment?.employerVerified ?? defaultEmploymentRecord.employerVerified,
    verificationDate: employment?.verificationDate || defaultEmploymentRecord.verificationDate,
  }));
  useEffect(() => {
    setFormData({
      status: employment?.status ?? defaultEmploymentRecord.status,
      company: employment?.company ?? defaultEmploymentRecord.company,
      role: employment?.role ?? defaultEmploymentRecord.role,
      industry: employment?.industry ?? defaultEmploymentRecord.industry,
      joinedAt: employment?.joinedAt ?? defaultEmploymentRecord.joinedAt,
      salary: employment?.salary ?? defaultEmploymentRecord.salary,
      location: employment?.location ?? defaultEmploymentRecord.location,
      type: employment?.type ?? defaultEmploymentRecord.type,
      skills: employment?.skills ?? [],
      employerVerified: employment?.employerVerified ?? defaultEmploymentRecord.employerVerified,
      verificationDate: employment?.verificationDate || defaultEmploymentRecord.verificationDate,
    });
  }, [employment]);

  const [saving, setSaving] = useState(false);

  const statusOptions = [
    "Employed",
    "Self-employed",
    "Unemployed",
    "Looking for work",
    "Higher education",
    "Apprenticeship",
  ];

  const hasJobFields = ["Employed", "Self-employed", "Apprenticeship"].includes(formData.status);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await onSaveEmployment(formData);
      if (saved !== false) onNotice("Employment status and job details updated successfully!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="trainee-section-wrapper">
      <form onSubmit={handleSubmit} className="panel employment-form-panel">
        {/* Employment Status Dropdown */}
        <div className="form-highlight-section">
          <div className="form-group form-group-lg">
            <label htmlFor="employment-status">
              Current Employment Status <span className="req">*</span>
            </label>
            <select
              id="employment-status"
              className="select-status-major"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <small className="help-text">
              Select your current livelihood condition. When Employed, Self-employed, or Apprenticeship is chosen,
              enter your workplace details below.
            </small>
          </div>
        </div>

        {/* Current Job Section */}
        {hasJobFields ? (
          <div className="job-details-fieldset">
            <h3 className="fieldset-title">
              <Building size={17} /> Current Job Details
            </h3>

            <div className="trainee-form-grid">
              <div className="form-group">
                <label>Company Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. SunGrid Energy Solutions Pvt. Ltd."
                />
              </div>

              <div className="form-group">
                <label>Job Role <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Graduate Engineer Trainee - Solar Installations"
                />
              </div>

              <div className="form-group">
                <label>Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                >
                  <option>Renewable Energy & Clean Tech</option>
                  <option>Industrial Automation & Robotics</option>
                  <option>Automotive & Electric Mobility</option>
                  <option>IT & Software Services</option>
                  <option>Electrical Contracting & Power</option>
                  <option>Healthcare & Medical Devices</option>
                  <option>Construction & Civil Infrastructure</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Joining Date</label>
                <input
                  type="date"
                  value={formData.joinedAt}
                  onChange={(e) => setFormData({ ...formData, joinedAt: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Current Monthly Salary (INR) <span className="req">*</span></label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g. 28000"
                />
              </div>

              <div className="form-group">
                <label>Work Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Jaipur, Rajasthan"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-job-notice">
            <Sparkles size={20} />
            <div>
              <strong>{formData.status} selected</strong>
              <p>No current employer data is required for this status. Update when you take up work or an internship.</p>
            </div>
          </div>
        )}

        {/* Employer Verification Section */}
        <div className="employer-verification-box">
          <div className="verif-box-head">
            <span className="shield-icon"><ShieldCheck size={22} /></span>
            <div>
              <strong>Employer Verification Status & Date</strong>
              <p>This verification confirms your active employment for placement metrics.</p>
            </div>
          </div>

          <div className="verif-inputs-row">
            <div className="form-group">
              <label>Verification Status</label>
              <select
                value={formData.employerVerified ? "Verified" : "Pending Confirmation"}
                onChange={(e) => setFormData({ ...formData, employerVerified: e.target.value === "Verified" })}
              >
                <option value="Verified">Verified by Employer</option>
                <option value="Pending Confirmation">Pending Confirmation</option>
              </select>
            </div>

            <div className="form-group">
              <label>Employer Verification Date</label>
              <input
                type="date"
                value={formData.verificationDate}
                onChange={(e) => setFormData({ ...formData, verificationDate: e.target.value })}
              />
            </div>
          </div>

          <div className="verif-status-display">
            {formData.employerVerified ? (
              <span className="verif-confirmed">
                <CheckCircle2 size={16} /> Verified by {formData.company || "Employer"} on {formData.verificationDate}
              </span>
            ) : (
              <span className="verif-pending">
                <Clock size={16} /> Verification pending from HR department of {formData.company || "employer"}
              </span>
            )}
          </div>
        </div>

        <div className="form-save-row">
          <button type="submit" className="button button-primary" disabled={saving}>
            {saving ? "Saving Employment Data..." : "Save Employment Status"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================================
   6. SALARY PROGRESS (SALARY TRACKER) SECTION
   ========================================================================= */
export function TraineeSalaryTracker({ salaryHistory, onAddSalaryRecord, onNotice }) {
  const [history, setHistory] = useState(salaryHistory ?? []);
  useEffect(() => setHistory(salaryHistory ?? []), [salaryHistory]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [newLog, setNewLog] = useState(() => {
    let employment = {};
    try { employment = JSON.parse(localStorage.getItem("kaaryaTraineeEmployment") || "{}"); } catch {}
    const now = new Date();
    return {
      date: now.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      fullDate: now.toISOString().slice(0, 10),
      employer: employment.company || "",
      role: employment.role || "",
      wage: employment.salary || "",
      reason: "",
    };
  });

  const currentWage = Number(history[history.length - 1]?.wage) || 0;
  const startingWage = Number(history[0]?.wage) || 0;
  const totalHikeAmount = currentWage - startingWage;
  const totalHikePercent = startingWage > 0 ? ((totalHikeAmount / startingWage) * 100).toFixed(1) : "0";

  // SVG Coordinates calculation
  const wages = history.map((h) => Number(h.wage));
  const minWage = Math.min(...wages, 12000);
  const maxWage = Math.max(...wages, 35000);
  const range = maxWage - minWage || 1;

  const chartWidth = 640;
  const chartHeight = 180;
  const paddingX = 60;
  const paddingY = 30;

  const points = history.map((entry, idx) => {
    const x = history.length <= 1 ? chartWidth / 2 : paddingX + idx * ((chartWidth - 2 * paddingX) / (history.length - 1));
    const y = chartHeight - paddingY - ((Number(entry.wage) - minWage) / range) * (chartHeight - 2 * paddingY);
    return { x, y, ...entry };
  });

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(" ");
  const salaryTicks = Array.from({ length: 5 }, (_, index) => minWage + (range * index) / 4);

  const handleAddRecord = (e) => {
    e.preventDefault();
    const newWageNum = Number(newLog.wage);
    if (!(newWageNum > 0)) {
      onNotice("Enter a monthly salary above zero.");
      return;
    }
    const prevWage = currentWage;
    const diff = newWageNum - prevWage;
    const pct = prevWage > 0 ? ((diff / prevWage) * 100).toFixed(1) : 0;

    const record = {
      date: newLog.date,
      fullDate: newLog.fullDate,
      employer: newLog.employer,
      role: newLog.role,
      previousWage: prevWage,
      wage: newWageNum,
      hikeAmount: diff,
      hikePercent: Number(pct),
      reason: newLog.reason,
      verified: false,
    };

    const nextList = [...history, record];
    setHistory(nextList);
    onAddSalaryRecord(nextList);
    setShowLogForm(false);
    onNotice(`New salary record of ${formatINR(newWageNum)} recorded!`);
  };

  const exportSalaryCsv = () => {
    const header = "Date,Employer,Role,Previous Monthly Wage (INR),New Monthly Wage (INR),Hike Percent,Reason\n";
    const rows = history
      .map((h) => `"${h.date}","${h.employer}","${h.role}","${h.previousWage}","${h.wage}","+${h.hikePercent}%","${h.reason}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-salary-hike-history.csv";
    a.click();
    URL.revokeObjectURL(url);
    onNotice("Salary tracker history exported as CSV.");
  };

  return (
    <div className="trainee-section-wrapper">
      <div className="trainee-page-title-row">
        <h2>Salary Progress</h2>
        <div className="salary-top-btn-row">
          <button className="button button-light" onClick={exportSalaryCsv}>
            <Download size={15} /> Export CSV
          </button>
          <button className="button button-primary" onClick={() => setShowLogForm(true)}>
            <Plus size={15} /> Log Salary Hike
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="salary-stats-quad">
        <div className="salary-stat-box">
          <small>Current Monthly Salary</small>
            <strong>{currentWage ? formatINR(currentWage) : "No salary data"}</strong>
            <span className="sub-stat">{history[history.length - 1]?.date || "Add a salary record to start tracking"}</span>
        </div>
        <div className="salary-stat-box">
          <small>Starting Salary</small>
            <strong>{startingWage ? formatINR(startingWage) : "Not recorded"}</strong>
            <span className="sub-stat">First saved salary record</span>
        </div>
        <div className="salary-stat-box">
          <small>Total Salary Hike</small>
          <strong className={history.length ? "positive" : "muted"}>{history.length ? `+${totalHikePercent}%` : "Not recorded"}</strong>
          <span className={history.length ? "sub-stat positive" : "sub-stat"}>{history.length ? `+${formatINR(totalHikeAmount)}` : "Add salary records to compare"}</span>
        </div>
        <div className="salary-stat-box">
          <small>Increments Recorded</small>
          <strong>{history.length}</strong>
          <span className="sub-stat">Salary changes recorded</span>
        </div>
      </div>

      {/* Salary Hike Graph */}
      <div className="panel salary-graph-panel">
        <div className="graph-panel-head">
          <div>
            <h3>Salary Hike Trajectory</h3>
            <p>Visualising wage growth milestones across your skilling and employment journey.</p>
          </div>
          <span className="graph-badge">Salary History</span>
        </div>

        {history.length ? <div className="salary-chart-svg-container">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="salary-svg-chart">
            <defs>
              <linearGradient id="salaryFillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2e7d32" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2e7d32" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
    {salaryTicks.map((tick) => {
              const y = chartHeight - paddingY - ((tick - minWage) / range) * (chartHeight - 2 * paddingY);
              if (y < 10 || y > chartHeight - 10) return null;
              return (
                <g key={tick}>
                  <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#e4ebe2" strokeDasharray="3 3" />
                  <text x={paddingX - 10} y={y + 4} textAnchor="end" className="chart-tick-label">
                    INR {tick >= 1000 ? `${(tick / 1000).toFixed(1).replace(/\.0$/, "")}k` : Math.round(tick)}
                  </text>
                </g>
              );
            })}

            {/* Gradient Area under curve */}
            {points.length > 1 && (
              <polygon
                points={`
                  ${points[0].x},${chartHeight - paddingY}
                  ${polylineStr}
                  ${points[points.length - 1].x},${chartHeight - paddingY}
                `}
                fill="url(#salaryFillGrad)"
              />
            )}

            {/* Main Polyline */}
            {points.length > 1 && (
              <polyline
                points={polylineStr}
                fill="none"
                stroke="#2e7d32"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Node Points */}
            {points.map((pt, i) => (
              <g key={i} className="chart-node-group">
                <circle cx={pt.x} cy={pt.y} r="7" fill="#ffffff" stroke="#2e7d32" strokeWidth="3" />
                {/* Hike Pill Badge */}
                {pt.hikePercent > 0 && (
                  <g transform={`translate(${pt.x - 28}, ${pt.y - 30})`}>
                    <rect width="56" height="18" rx="9" fill="#2e7d32" />
                    <text x="28" y="13" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                      +{pt.hikePercent}%
                    </text>
                  </g>
                )}
                {/* Salary Amount */}
                <text x={pt.x} y={pt.y - (pt.hikePercent > 0 ? 36 : 14)} textAnchor="middle" className="chart-salary-label">
                  {`INR ${Number(pt.wage) >= 1000 ? `${(Number(pt.wage) / 1000).toFixed(1).replace(/\.0$/, "")}k` : pt.wage}`}
                </text>
                {/* Date Label */}
                <text x={pt.x} y={chartHeight - 8} textAnchor="middle" className="chart-date-label">
                  {pt.date}
                </text>
              </g>
            ))}
          </svg>
        </div> : <div className="empty-state">Add a salary record to see your salary progress graph.</div>}
      </div>

      {/* Salary History Table */}
      <div className="panel salary-table-panel">
        <div className="table-heading-clean">
          <h3>Salary History & Appraisal Log</h3>
          <span className="record-count">{history.length} Records</span>
        </div>

        <div className="table-wrap">
          <table className="trainee-data-table">
            <thead>
              <tr>
                <th>Effective Date</th>
                <th>Employer & Role</th>
                <th>Previous Salary</th>
                <th>New Monthly Salary</th>
                <th>Salary Hike</th>
                <th>Reason / Appraisal Note</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && <tr><td colSpan="7" className="salary-history-empty">Your salary changes will appear here after you add a record.</td></tr>}
              {history.map((rec, i) => (
                <tr key={i}>
                  <td><strong>{rec.date}</strong></td>
                  <td>
                    <div className="table-cell-emp">
                      <span>{rec.employer}</span>
                      <small>{rec.role}</small>
                    </div>
                  </td>
                  <td>{rec.previousWage > 0 ? formatINR(rec.previousWage) : "-"}</td>
                  <td><strong>{formatINR(rec.wage)}</strong></td>
                  <td>
                    {rec.hikePercent > 0 ? (
                      <span className="badge-pill hike-badge">
                        +{rec.hikePercent}% ({formatINR(rec.hikeAmount)})
                      </span>
                    ) : (
                      <span className="text-muted">Starting Base</span>
                    )}
                  </td>
                  <td><span className="reason-text">{rec.reason}</span></td>
                  <td>
                    <span className={`status-tag ${rec.verified ? "tag-complete" : "tag-due"}`}>
                      <ShieldCheck size={12} /> {rec.verified ? "Verified" : "Self-reported"}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && <tr><td colSpan="7" className="empty-state">No salary records yet. Save an employment or salary update to start the tracker.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Hike Modal */}
      {showLogForm && (
        <div className="trainee-modal-backdrop" onClick={() => setShowLogForm(false)}>
          <div className="trainee-profile-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="trainee-modal-header">
              <div>
                <span className="trainee-badge-tag"><TrendingUp size={13} /> Log Increment</span>
                <h3>Add New Salary Hike</h3>
                <p>Record a newly awarded wage increment, promotion, or appraisal.</p>
              </div>
              <button className="icon-button modal-close-btn" onClick={() => setShowLogForm(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="trainee-modal-form">
              <div className="trainee-form-grid">
                <div className="form-group">
                  <label>Milestone Date Label</label>
                  <input
                    type="text"
                    required
                    value={newLog.date}
                    onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                    placeholder="e.g. Oct 2026"
                  />
                </div>

                <div className="form-group">
                  <label>Effective Date</label>
                  <input
                    type="date"
                    required
                    value={newLog.fullDate}
                    onChange={(e) => setNewLog({ ...newLog, fullDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>New Monthly Salary (INR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newLog.wage}
                    onChange={(e) => setNewLog({ ...newLog, wage: e.target.value })}
                    placeholder="e.g. 32000"
                  />
                </div>

                <div className="form-group">
                  <label>Company / Employer</label>
                  <input
                    type="text"
                    required
                    value={newLog.employer}
                    onChange={(e) => setNewLog({ ...newLog, employer: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Designation / Role</label>
                  <input
                    type="text"
                    required
                    value={newLog.role}
                    onChange={(e) => setNewLog({ ...newLog, role: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Hike Reason / Note</label>
                  <input
                    type="text"
                    required
                    value={newLog.reason}
                    onChange={(e) => setNewLog({ ...newLog, reason: e.target.value })}
                    placeholder="e.g. Annual Appraisal, Promotion"
                  />
                </div>
              </div>

              <div className="trainee-modal-actions">
                <button type="button" className="button button-light" onClick={() => setShowLogForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  Save Salary Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   7. JOB HISTORY SECTION
   ========================================================================= */
export function TraineeJobHistory({ onNotice }) {
  const savedEmployment = (() => {
    try { return JSON.parse(localStorage.getItem("kaaryaTraineeEmployment") || "null"); }
    catch { return null; }
  })();
  const savedProfile = (() => {
    try { return JSON.parse(localStorage.getItem("kaaryaTraineeProfile") || "null"); }
    catch { return null; }
  })();
  const [prevJob, setPrevJob] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kaaryaTraineePreviousJob") || "null"); }
    catch { return null; }
  });
  const [showPrevJobForm, setShowPrevJobForm] = useState(false);
  const [prevJobDraft, setPrevJobDraft] = useState({ company: "", role: "", industry: "", startDate: "", endDate: "", salary: "", location: "", responsibilities: "" });
  const savePrevJob = (event) => {
    event.preventDefault();
    const saved = { ...prevJobDraft, responsibilities: prevJobDraft.responsibilities.split("\n").map((line) => line.trim()).filter(Boolean) };
    setPrevJob(saved);
    localStorage.setItem("kaaryaTraineePreviousJob", JSON.stringify(saved));
    if (savedProfile?.email) localStorage.setItem(`kaaryaTraineePreviousJob:${savedProfile.email.trim().toLowerCase()}`, JSON.stringify(saved));
    setShowPrevJobForm(false);
    onNotice("Previous job saved to your career timeline.");
  };
  const job = { ...defaultEmploymentRecord, ...savedEmployment };
  const hasCurrentJob = ["Employed", "Self-employed", "Apprenticeship"].includes(job.status);
  const joinedDate = job.joinedAt ? new Date(`${job.joinedAt}T12:00:00`) : null;
  const joiningLabel = joinedDate && !Number.isNaN(joinedDate.getTime())
    ? joinedDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "Not provided";
  const tenureLabel = joinedDate && !Number.isNaN(joinedDate.getTime())
    ? `${joinedDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" })} - Present`
    : "Current role";
  const currentJob = {
    role: hasCurrentJob ? (job.role || "Current job role not added") : "No current job reported",
    company: hasCurrentJob ? (job.company || "Company not added") : "No current employer",
    industry: hasCurrentJob ? (job.industry || "Industry not added") : "—",
    joiningDate: joiningLabel,
    duration: tenureLabel,
    salary: hasCurrentJob ? `${formatINR(job.salary)} / month` : "—",
    location: hasCurrentJob ? (job.location || "Work location not added") : "—",
    verified: hasCurrentJob && Boolean(job.employerVerified),
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
  };

  const savedTrainings = (() => {
    try { return JSON.parse(localStorage.getItem("kaaryaTraineeTrainings") || "[]"); }
    catch { return []; }
  })();
  const careerTimeline = [
    (savedProfile?.educationLevel || savedProfile?.degreeName || savedProfile?.institute) ? {
      title: "Education",
      subtitle: savedProfile.institute || "Institute not added",
      date: savedProfile.yearOfCompletion ? `Completed ${savedProfile.yearOfCompletion}` : "Year of completion not added",
      detail: `${savedProfile.educationLevel || "Qualification not added"}${savedProfile.degreeName ? ` - ${savedProfile.degreeName}` : ""}${savedProfile.cgpa ? ` - CGPA ${savedProfile.cgpa}` : ""}`,
      status: "Completed", icon: GraduationCap,
    } : null,
    ...savedTrainings.map((course) => ({
      title: course.course,
      subtitle: course.provider || "Training provider not recorded",
      date: `${course.start || "Start date not recorded"} - ${course.end || "End date not recorded"}`,
      detail: course.assessment || "Assessment not recorded",
      status: course.verified ? "Certified" : "Completed", icon: Award,
    })),
    prevJob ? {
      title: prevJob.role || "Previous employment",
      subtitle: prevJob.company || "Employer not recorded",
      date: [prevJob.startDate, prevJob.endDate].filter(Boolean).join(" - ") || "Dates not recorded",
      detail: `${prevJob.industry || "Industry not recorded"} - ${prevJob.salary ? formatINR(prevJob.salary) : "Salary not recorded"}`,
      status: "Completed", icon: BriefcaseBusiness,
    } : null,
    hasCurrentJob ? {
      title: "Current Employment", subtitle: currentJob.company,
      date: tenureLabel,
      detail: `${currentJob.role} - Monthly salary ${currentJob.salary} - ${currentJob.verified ? "Employer verified" : "Verification pending"}`,
      status: "Current", icon: Building,
    } : null,
  ].filter(Boolean);

  return (
    <div className="trainee-section-wrapper">
      {/* Part 1: Current Job Card */}
      <div className="job-card current-job-highlight">
        <div className="job-card-header">
          <div className="job-tag-group">
            <span className="badge-pill current-role-pill">{hasCurrentJob ? "Current Job" : "Employment Status"}</span>
            {hasCurrentJob && <span className={`badge-pill ${currentJob.verified ? "verified-pill" : "prev-role-pill"}`}><ShieldCheck size={12} /> {currentJob.verified ? `Verified${job.verificationDate ? ` - ${job.verificationDate}` : ""}` : "Verification pending"}</span>}
          </div>
          <strong className="job-salary-figure">{currentJob.salary}</strong>
        </div>

        <div className="job-main-info">
          <h3>{currentJob.role}</h3>
          <div className="job-sub-row">
            <span><strong>{currentJob.company}</strong></span>
            <span>•</span>
            <span>{currentJob.industry}</span>
            <span>•</span>
            <span><MapPin size={13} /> {currentJob.location}</span>
          </div>
          <div className="job-duration-pill">
            <Clock size={13} /> Joined {currentJob.joiningDate} ({currentJob.duration})
          </div>
        </div>

        {currentJob.responsibilities.length > 0 && <div className="job-responsibilities"><small>Key Roles & Achievements:</small><ul>{currentJob.responsibilities.map((resp, i) => <li key={i}><Check size={14} className="li-check" /> {resp}</li>)}</ul></div>}
      </div>

      {/* Part 2: Previous Job Card */}
      {prevJob ? <div className="job-card prev-job-highlight">
        <div className="job-card-header"><div className="job-tag-group"><span className="badge-pill prev-role-pill">Previous Job</span><span className="badge-pill complete-pill">Completed</span></div><strong className="job-salary-figure">{prevJob.salary ? `${formatINR(prevJob.salary)} / month` : "Salary not recorded"}</strong></div>
        <div className="job-main-info"><h3>{prevJob.role || "Previous role"}</h3><div className="job-sub-row"><strong>{prevJob.company || "Employer not recorded"}</strong><span>/</span><span>{prevJob.industry || "Industry not recorded"}</span><span>/</span><span><MapPin size={13} /> {prevJob.location || "Location not recorded"}</span></div><div className="job-duration-pill"><Clock size={13} /> {[prevJob.startDate, prevJob.endDate].filter(Boolean).join(" - ") || "Dates not recorded"}</div></div>
        {prevJob.responsibilities?.length > 0 && <div className="job-responsibilities"><small>Responsibilities & transition details:</small><ul>{prevJob.responsibilities.map((item, index) => <li key={index}><Check size={14} className="li-check" /> {item}</li>)}</ul></div>}
        <button type="button" className="text-link" onClick={() => { setPrevJobDraft({ ...prevJob, responsibilities: (prevJob.responsibilities || []).join("\n") }); setShowPrevJobForm(true); }}>Edit previous job</button>
      </div> : <div className="job-card prev-job-empty"><div><span className="badge-pill prev-role-pill">Previous Job</span><h3>No previous role added</h3><p>Add a previous position to include it in your career timeline.</p></div><button type="button" className="button button-light btn-sm" onClick={() => { setPrevJobDraft({ company: "", role: "", industry: "", startDate: "", endDate: "", salary: "", location: "", responsibilities: "" }); setShowPrevJobForm(true); }}>Add previous job</button></div>}

      {/* Part 3: Career Timeline */}
      <div className="panel timeline-panel">
        <div className="panel-heading-clean">
          <span className="icon-circle-sm"><Layers size={16} /></span>
          <div>
            <h3>Career Trajectory Timeline</h3>
            <p>Education, training, and work records saved to this account.</p>
          </div>
        </div>

        <div className="visual-timeline-track">
          {careerTimeline.length === 0 && <p className="empty-state">Your education, training, and employment milestones will appear here when saved.</p>}
          {careerTimeline.map((item, idx) => {
            const Icon = item.icon;
            const isCurrent = item.status === "Current";
            const isUpcoming = item.status === "Upcoming Goal";
            return (
              <div key={idx} className={`timeline-step-row ${isCurrent ? "step-current" : ""} ${isUpcoming ? "step-upcoming" : ""}`}>
                <div className="timeline-left-node">
                  <div className="step-circle">
                    <Icon size={16} />
                  </div>
                  {idx < careerTimeline.length - 1 && <div className="step-connector-line" />}
                </div>

                <div className="timeline-right-card">
                  <div className="step-head-row">
                    <h4>{item.title}</h4>
                    <span className={`step-badge-pill badge-${item.status.toLowerCase().replace(/\s+/g, "-")}`}>
                      {item.status}
                    </span>
                  </div>
                  <strong className="step-subtitle">{item.subtitle}</strong>
                  <time className="step-time"><CalendarDays size={13} /> {item.date}</time>
                  <p className="step-detail">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showPrevJobForm && <div className="trainee-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowPrevJobForm(false); }}>
        <form className="trainee-profile-modal-box prev-job-form-modal" onSubmit={savePrevJob}>
          <div className="panel-heading-clean"><div><h3>{prevJob ? "Edit previous job" : "Add previous job"}</h3><p>Include the details you want shown in your career history.</p></div><button type="button" className="icon-button" aria-label="Close" onClick={() => setShowPrevJobForm(false)}>×</button></div>
          <div className="form-row-2">
            <label className="form-group"><span>Company name</span><input required value={prevJobDraft.company} onChange={(event) => setPrevJobDraft({ ...prevJobDraft, company: event.target.value })} /></label>
            <label className="form-group"><span>Job role</span><input required value={prevJobDraft.role} onChange={(event) => setPrevJobDraft({ ...prevJobDraft, role: event.target.value })} /></label>
            <label className="form-group"><span>Industry</span><input value={prevJobDraft.industry} onChange={(event) => setPrevJobDraft({ ...prevJobDraft, industry: event.target.value })} /></label>
            <label className="form-group"><span>Work location</span><input value={prevJobDraft.location} onChange={(event) => setPrevJobDraft({ ...prevJobDraft, location: event.target.value })} /></label>
            <label className="form-group"><span>Start date</span><input type="date" value={prevJobDraft.startDate} onChange={(event) => setPrevJobDraft({ ...prevJobDraft, startDate: event.target.value })} /></label>
            <label className="form-group"><span>End date</span><input type="date" value={prevJobDraft.endDate} onChange={(event) => setPrevJobDraft({ ...prevJobDraft, endDate: event.target.value })} /></label>
            <label className="form-group"><span>Monthly salary (INR)</span><input type="number" min="0" value={prevJobDraft.salary} onChange={(event) => setPrevJobDraft({ ...prevJobDraft, salary: event.target.value })} /></label>
            <label className="form-group form-group-full"><span>Responsibilities (one per line)</span><textarea rows="3" value={prevJobDraft.responsibilities} onChange={(event) => setPrevJobDraft({ ...prevJobDraft, responsibilities: event.target.value })} /></label>
          </div>
          <div className="form-actions"><button type="button" className="button button-light" onClick={() => setShowPrevJobForm(false)}>Cancel</button><button type="submit" className="button button-primary">Save previous job</button></div>
        </form>
      </div>}
    </div>
  );
}

/* =========================================================================
   8. RECOMMENDED SKILLS SECTION
   ========================================================================= */
export function TraineeRecommendedSkills({ employment, trainingList = [], onNotice }) {
  const savedEmployment = employment || {};
  const savedTrainings = trainingList;
  const providerNames = [...new Set(savedTrainings.map((course) => course.provider).filter(Boolean))];
  const trainingSkills = savedTrainings.flatMap((course) => (course.skillsCovered || "").split(",").map((skill) => skill.trim()).filter(Boolean));
  const coveredTerms = new Set(trainingSkills.map((skill) => skill.toLocaleLowerCase()));
  const employerSkills = [...new Set((savedEmployment.skills || []).map((skill) => String(skill).trim()).filter(Boolean))];
  const uncoveredGaps = employerSkills
    .filter((skill) => !coveredTerms.has(skill.toLocaleLowerCase()))
    .map((name) => ({
      id: `gap-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
      category: savedEmployment.industry || "Current employer requirement",
      demandRate: "Listed for your current role",
      description: `This skill is listed in your current job record but is not listed in the training records saved from ${providerNames.join(", ") || "your provider"}.`,
      sourceInfo: `${savedEmployment.role || "Current role"} at ${savedEmployment.company || "your employer"}`,
      recommendedBy: providerNames.join(" & ") || "Training provider data not added",
    }));
  const [mySkills, setMySkills] = useState(() => {
    try {
      const saved = localStorage.getItem("kaaryaTraineeMySkills");
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {
      // Fall through to account-specific course and job skills.
    }
    return [
      ...savedTrainings.flatMap((course) => (course.skillsCovered || "").split(",").map((name) => name.trim()).filter(Boolean).map((name) => ({
        id: `training-${course.id}-${name}`, name, source: "Training Assessment",
        sourceDetails: `${course.provider || "Training provider"}${course.assessment ? ` - ${course.assessment}` : ""}`, level: "Recorded",
      }))),
      ...(savedEmployment.skills || []).map((name, index) => ({ id: `job-${index}-${name}`, name, source: "Current Job", sourceDetails: savedEmployment.company || savedEmployment.role || "Current job", level: "Recorded" })),
    ];
  });

  const [learningPlan, setLearningPlan] = useState(() => {
    try {
      const saved = localStorage.getItem("kaaryaTraineeSkillPlan");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    source: "Training Assessment",
    sourceDetails: "Udaan Skills Centre Exam",
    level: "Proficient",
  });

  const handleTogglePlan = (skillName) => {
    let nextPlan;
    if (learningPlan.includes(skillName)) {
      nextPlan = learningPlan.filter((s) => s !== skillName);
      onNotice(`Removed "${skillName}" from learning plan.`);
    } else {
      nextPlan = [...learningPlan, skillName];
      onNotice(`"${skillName}" added to your personalised learning plan.`);
    }
    setLearningPlan(nextPlan);
    localStorage.setItem("kaaryaTraineeSkillPlan", JSON.stringify(nextPlan));
    const email = (() => { try { return JSON.parse(localStorage.getItem("kaaryaTraineeProfile") || "{}").email || ""; } catch { return ""; } })();
    if (email) localStorage.setItem(`kaaryaTraineeSkillPlan:${email.trim().toLowerCase()}`, JSON.stringify(nextPlan));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    const item = {
      id: `sk-${Date.now()}`,
      name: newSkill.name.trim(),
      source: newSkill.source,
      sourceDetails: newSkill.sourceDetails || (newSkill.source === "Training Assessment" ? "Vocational Assessment" : "Current Employer"),
      level: newSkill.level,
    };

    const nextList = [...mySkills, item];
    setMySkills(nextList);
    localStorage.setItem("kaaryaTraineeMySkills", JSON.stringify(nextList));
    const email = (() => { try { return JSON.parse(localStorage.getItem("kaaryaTraineeProfile") || "{}").email || ""; } catch { return ""; } })();
    if (email) localStorage.setItem(`kaaryaTraineeMySkills:${email.trim().toLowerCase()}`, JSON.stringify(nextList));
    setShowAddSkillModal(false);
    setNewSkill({ name: "", source: "Training Assessment", sourceDetails: "", level: "Proficient" });
    onNotice(`Skill "${item.name}" added to your profile!`);
  };

  return (
    <div className="trainee-section-wrapper">
      <div className="trainee-page-title-row">
        <h2>Recommended Skills</h2>
        <button className="button button-primary" onClick={() => setShowAddSkillModal(true)}>
          <Plus size={15} /> Add My Skill
        </button>
      </div>

      {/* Part 1: My Skills with Sources */}
      <div className="subsection-block">
        <div className="subsection-header-row">
          <h3 className="subsection-title">
            <CheckCircle2 size={18} /> My Skills
          </h3>
          <span className="skill-count-badge">{mySkills.length} Skills</span>
        </div>

        <div className="my-skills-grid">
          {mySkills.length === 0 && <div className="panel training-empty-state"><Sparkles size={21} /><strong>No skills recorded yet</strong><p>Skills from your training assessments and current job will appear here.</p></div>}
          {mySkills.map((sk) => (
            <div key={sk.id} className="skill-card-item">
              <div className="skill-card-top">
                <span className="skill-bullet-icon"><Check size={14} /></span>
                <strong>{sk.name}</strong>
              </div>
              <div className="skill-source-box">
                <span className={`source-pill pill-${(sk.source || "Training Assessment").toLowerCase().includes("training") ? "training" : "job"}`}>
                  Source: {sk.source || "Training Assessment"}
                </span>
                <small className="source-meta-text">{sk.sourceDetails}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Skill Gap Card (System Intelligence based on employer & provider data) */}
      <div className="subsection-block">
        <div className="panel skill-gap-intelligence-card">
          <div className="gap-card-header">
            <div className="gap-icon-badge">
              <Sparkles size={24} />
            </div>
            <div>
              <span className="ai-intel-pill">Role & Training Review</span>
              <h3>Skill Gap Analysis</h3>
              <p>
                Employer listed role skills are compared with the skills in your saved training records.
              </p>
            </div>
          </div>

          <div className="gap-items-grid">
            {uncoveredGaps.length === 0 && <p className="card-hint">{employerSkills.length ? "Your saved training records cover the skills listed for your current role." : "Skill gaps will appear when employer role skills and training provider records are available for this account."}</p>}
            {uncoveredGaps.map((gap) => {
              const inPlan = learningPlan.includes(gap.name);
              return (
                <div key={gap.id} className={`gap-card ${inPlan ? "gap-card-planned" : ""}`}>
                  <div className="gap-card-top">
                    <span className="gap-category-pill">{gap.category}</span>
                    <span className="gap-demand-pill">{gap.demandRate}</span>
                  </div>
                  <h4>{gap.name}</h4>
                  <p className="gap-desc">{gap.description}</p>

                  <div className="gap-source-attribution">
                    <AlertCircle size={13} />
                    <span>Based on: {gap.sourceInfo}</span>
                  </div>

                  <div className="gap-footer-action">
                    <span className="recommended-by">
                      <GraduationCap size={13} /> {gap.recommendedBy}
                    </span>
                    <button
                      type="button"
                      className={`button btn-sm ${inPlan ? "button-light btn-planned" : "button-primary"}`}
                      onClick={() => handleTogglePlan(gap.name)}
                    >
                      {inPlan ? (
                        <>
                          <Check size={14} /> Added to Plan
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> Add to My Plan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="trainee-modal-backdrop" onClick={() => setShowAddSkillModal(false)}>
          <div className="trainee-profile-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="trainee-modal-header">
              <div>
                <span className="trainee-badge-tag"><Plus size={13} /> Add Competency</span>
                <h3>Add New Skill</h3>
                <p>Record a newly acquired skill and select its verification source.</p>
              </div>
              <button className="icon-button modal-close-btn" onClick={() => setShowAddSkillModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="trainee-modal-form">
              <div className="form-group">
                <label>Skill Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="e.g. Battery Energy Storage Systems (BESS)"
                />
              </div>

              <div className="form-group">
                <label>Source of Skill <span className="req">*</span></label>
                <select
                  value={newSkill.source}
                  onChange={(e) => setNewSkill({ ...newSkill, source: e.target.value })}
                >
                  <option value="Training Assessment">Training Assessment</option>
                  <option value="Current Job">Current Job</option>
                </select>
              </div>

              <div className="form-group">
                <label>Source Details / Institution / Company</label>
                <input
                  type="text"
                  value={newSkill.sourceDetails}
                  onChange={(e) => setNewSkill({ ...newSkill, sourceDetails: e.target.value })}
                  placeholder="e.g. Udaan Skills Centre or SunGrid Energy"
                />
              </div>

              <div className="trainee-modal-actions">
                <button type="button" className="button button-light" onClick={() => setShowAddSkillModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  <Check size={16} /> Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function TraineeHelpSupport({ profile, employment, trainingList, onNotice }) {
  const contacts = [
    { label: "Account email", value: profile?.email || "Not available", copyable: Boolean(profile?.email) },
    { label: "Institute", value: profile?.institute || "Not added to your profile" },
    { label: "Training provider", value: trainingList?.[0]?.provider || "No provider recorded" },
    { label: "Employer", value: employment?.company || "No current employer recorded" },
  ];

  const copyEmail = async () => {
    if (!profile?.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      onNotice("Account email copied.");
    } catch {
      onNotice(`Your account email is ${profile.email}`);
    }
  };

  return (
    <div className="trainee-section-wrapper trainee-help-support">
      <div className="trainee-page-title-row"><h2>Help & Support</h2></div>
      <div className="help-contact-grid">
        {contacts.map((contact) => (
          <section className="panel help-contact-card" key={contact.label}>
            <small>{contact.label}</small>
            <strong>{contact.value}</strong>
            {contact.copyable && <button type="button" className="text-link" onClick={copyEmail}><Copy size={14} /> Copy email</button>}
          </section>
        ))}
      </div>
      <section className="panel help-faq-panel">
        <div className="help-section-heading"><CircleHelp size={18} /><h3>Frequently asked questions</h3></div>
        <details><summary>How do I change my profile details?</summary><p>Open the circular profile button in the top-right corner, edit your details, then save. The profile is kept with the signed-in email.</p></details>
        <details><summary>How do I upload a certificate?</summary><p>Open Training & Certificates, choose a PDF or image, enter its name and issue date, then upload it. New uploads show Pending Verification until reviewed.</p></details>
        <details><summary>Why is my salary history empty?</summary><p>Salary history appears after an employment record or salary update is saved to this account.</p></details>
        <details><summary>Who should I contact about training or employment details?</summary><p>Use the institute, training provider, and employer listed above. Their direct contact information is not stored in this profile.</p></details>
      </section>
      <p className="help-contact-note">For account-specific help, share the account email shown above with your programme coordinator.</p>
    </div>
  );
}

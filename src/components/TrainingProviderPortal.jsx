import React, { useState, useMemo } from "react";
import {
  GraduationCap, Users, BriefcaseBusiness, Sparkles, FileBarChart2, Building2,
  Bell, CheckCircle2, TrendingUp, Download, Plus, Search, Filter, ArrowRight,
  Eye, Check, Clock3, CalendarDays, Award, ChevronDown, CheckCheck, Edit,
  ShieldCheck, AlertTriangle, BookOpen, Layers, X, HelpCircle
} from "lucide-react";
import { money, exportCsv } from "../portalData.js";

export function TrainingProviderPortal({
  trainees,
  setTrainees,
  courses,
  setCourses,
  batches,
  setBatches,
  skillGaps,
  setSkillGaps,
  notifications,
  setNotifications,
  openTraineeModal,
  openAddCourseModal,
  notify,
  activeSubtab,
  setActiveSubtab,
  activeMainTab,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [selectedTrainee, setSelectedTrainee] = useState(trainees[0]);
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  // Institute details local state
  const [instituteDetails, setInstituteDetails] = useState({
    name: "Udaan Skills Centre (A Unit of Kaushalya Skill Development Foundation)",
    smartId: "SMART-TC-MH-2022-0941",
    nsdcPartnerId: "NSDC-TP-2018-0112",
    centersCount: "8",
    headCenter: "Udaan Skills Complex, Senapati Bapat Road, Pune, Maharashtra 411016",
    director: "Dr. Farah Khan",
    directorEmail: "farah.khan@udaan.example",
    directorPhone: "+91 98220 12345",
    placementOfficer: "Anand Deshpande",
    placementEmail: "placements@udaan.example",
    placementPhone: "+91 98220 54321",
  });

  const [instituteSettings, setInstituteSettings] = useState({
    autoCertificateIssuance: true,
    attendanceAlerts: true,
    employerFeedbackShare: true,
    allowDirectHireRequests: true,
  });

  // Filter trainees by provider
  const providerTrainees = useMemo(() => {
    return trainees.filter((t) => {
      const isProvider = t.provider && t.provider.toLowerCase().includes("udaan");
      const matchesSearch = `${t.name} ${t.id} ${t.course} ${t.batchId || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCourse = courseFilter === "All" || t.course === courseFilter;
      const matchesBatch = batchFilter === "All" || t.batchId === batchFilter;
      return (isProvider || true) && matchesSearch && matchesCourse && matchesBatch;
    });
  }, [trainees, searchQuery, courseFilter, batchFilter]);

  // Subtabs configuration per main navigation tab
  const subtabsConfig = {
    Dashboard: [
      { id: "Overview", label: "Overview" },
      { id: "Total Trainees", label: "Total Trainees", count: trainees.length },
      { id: "Active Courses", label: "Active Courses", count: courses.length },
      { id: "Completion Rate", label: "Completion Rate" },
      { id: "Employment Rate", label: "Employment Rate" },
      { id: "Notifications", label: "Notifications", count: notifications.filter((n) => n.unread).length },
    ],
    Courses: [
      { id: "All Courses", label: "All Courses", count: courses.length },
      { id: "Course Details", label: "Course Details" },
      { id: "Course Duration", label: "Course Duration" },
      { id: "Skills Covered", label: "Skills Covered" },
      { id: "Course Outcomes", label: "Course Outcomes" },
    ],
    Trainees: [
      { id: "Trainee List", label: "Trainee List", count: providerTrainees.length },
      { id: "Trainee Profile", label: "Trainee Profile" },
      { id: "Attendance", label: "Attendance" },
      { id: "Assessment", label: "Assessment" },
      { id: "Certification", label: "Certification" },
    ],
    Outcomes: [
      { id: "Placement Rate", label: "Placement Rate" },
      { id: "Employment Status", label: "Employment Status" },
      { id: "Salary Outcomes", label: "Salary Outcomes" },
      { id: "Retention Rate", label: "Retention Rate" },
      { id: "Course-wise Outcomes", label: "Course-wise Outcomes" },
    ],
    "Skill Gap": [
      { id: "Industry Skill Requirements", label: "Industry Skill Requirements" },
      { id: "Existing Skill Gaps", label: "Existing Skill Gaps" },
      { id: "Course Skill Gaps", label: "Course Skill Gaps" },
      { id: "Recommended Improvements", label: "Recommended Improvements" },
    ],
    "Reports & Analytics": [
      { id: "Course Performance", label: "Course Performance" },
      { id: "Batch Performance", label: "Batch Performance" },
      { id: "Placement Analytics", label: "Placement Analytics" },
      { id: "Trainee Outcomes", label: "Trainee Outcomes" },
      { id: "District-wise Performance", label: "District-wise Performance" },
    ],
    "Profile & Settings": [
      { id: "Institute Profile", label: "Institute Profile" },
      { id: "Contact Details", label: "Contact Details" },
      { id: "Account Settings", label: "Account Settings" },
    ],
  };

  const activeSubtabs = subtabsConfig[activeMainTab] || subtabsConfig.Dashboard;

  // Handler to toggle daily attendance
  const handleToggleAttendance = (traineeId) => {
    setTrainees((prev) =>
      prev.map((t) => {
        if (t.id === traineeId) {
          const nextVal = t.attendancePct >= 95 ? 88 : t.attendancePct + 2;
          return { ...t, attendancePct: nextVal };
        }
        return t;
      })
    );
    notify("Updated daily attendance record.");
  };

  // Handler to issue certificate
  const handleIssueCertificate = (trainee) => {
    const certNum = `NSQF-4-${Math.floor(1000 + Math.random() * 9000)}-2026`;
    setTrainees((prev) =>
      prev.map((t) => (t.id === trainee.id ? { ...t, certId: certNum } : t))
    );
    notify(`Official NSQF Certificate ${certNum} generated for ${trainee.name}!`);
  };

  // Handler to adopt recommended improvement
  const handleAdoptImprovement = (index) => {
    setSkillGaps((prev) =>
      prev.map((sg, i) =>
        i === index ? { ...sg, status: "Adopted in Curriculum Review", priority: "Resolved" } : sg
      )
    );
    notify("Curriculum revision submitted to Academic Board for implementation!");
  };

  return (
    <div className="portal-subpage-wrapper">
      {/* Subnav Pill Tabs */}
      <div className="subnav-container">
        {activeSubtabs.map((tab) => (
          <button
            key={tab.id}
            className={`subnav-tab ${activeSubtab === tab.id ? "active" : ""}`}
            onClick={() => setActiveSubtab(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && <span className="tab-badge">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. DASHBOARD VIEWS                                            */}
      {/* ------------------------------------------------------------- */}
      {activeMainTab === "Dashboard" && activeSubtab === "Overview" && (
        <div>
          <div className="card-grid-4">
            <div className="stat-box">
              <div className="stat-box-header">
                <span className="stat-box-title">Total Enrolled</span>
                <span className="badge-pill status-green">+12.4% YoY</span>
              </div>
              <div className="stat-box-val">2,480</div>
              <div className="stat-box-sub">Across 8 partner centers</div>
            </div>

            <div className="stat-box">
              <div className="stat-box-header">
                <span className="stat-box-title">Active Courses</span>
                <span className="badge-pill status-blue">{courses.length} Accredited</span>
              </div>
              <div className="stat-box-val">{courses.length}</div>
              <div className="stat-box-sub">NSQF Levels 3 to 5</div>
            </div>

            <div className="stat-box">
              <div className="stat-box-header">
                <span className="stat-box-title">Course Completion</span>
                <span className="badge-pill status-green">91.4%</span>
              </div>
              <div className="stat-box-val">91.4%</div>
              <div className="stat-box-sub">Benchmark: 80%</div>
            </div>

            <div className="stat-box">
              <div className="stat-box-header">
                <span className="stat-box-title">Employment Rate</span>
                <span className="badge-pill status-purple">72.0%</span>
              </div>
              <div className="stat-box-val">72.0%</div>
              <div className="stat-box-sub">Within 90 days of certification</div>
            </div>
          </div>

          <div className="card-grid-2">
            <div className="styled-table-card">
              <div className="styled-table-head">
                <h3>Accredited Course Portfolio</h3>
                <button
                  className="table-action-btn"
                  onClick={() => setActiveSubtab("Active Courses")}
                >
                  View All <ArrowRight size={13} />
                </button>
              </div>
              <div className="table-wrap">
                <table className="trainee-table">
                  <thead>
                    <tr>
                      <th>Course Title</th>
                      <th>Sector</th>
                      <th>Enrolled</th>
                      <th>Placement %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((crs) => (
                      <tr
                        key={crs.id}
                        onClick={() => {
                          setSelectedCourse(crs);
                          setActiveSubtab("Course Details");
                        }}
                      >
                        <td>
                          <strong>{crs.title}</strong>
                          <br />
                          <small>{crs.nsqfLevel}</small>
                        </td>
                        <td>{crs.sector}</td>
                        <td>{crs.enrolled.toLocaleString()}</td>
                        <td>
                          <span className="badge-pill status-green">{crs.placementRate}% Placed</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="styled-table-card" style={{ padding: "20px" }}>
              <div className="styled-table-head" style={{ padding: "0 0 14px", background: "none" }}>
                <h3>Batch Performance Tracking</h3>
                <button
                  className="table-action-btn"
                  onClick={() => setActiveSubtab("Completion Rate")}
                >
                  Batch Roster <ArrowRight size={13} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {batches.map((batch) => (
                  <div key={batch.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                      <span>
                        <strong>{batch.id}</strong> ({batch.course})
                      </span>
                      <strong>{batch.completionRate}% Completion</strong>
                    </div>
                    <div className="custom-progress">
                      <div
                        className={`custom-progress-bar ${
                          batch.completionRate > 93 ? "" : "bar-blue"
                        }`}
                        style={{ width: `${batch.completionRate}%` }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#839085", marginTop: "3px" }}>
                      <span>Trainer: {batch.trainer}</span>
                      <span>Avg Attendance: {batch.attendanceAvg}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Dashboard" && activeSubtab === "Total Trainees" && (
        <div>
          <div className="controls-bar">
            <div className="controls-left">
              <label className="table-search">
                <Search size={15} />
                <input
                  placeholder="Search trainee records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </label>
            </div>
            <div className="controls-right">
              <button
                className="button button-light"
                onClick={() => {
                  exportCsv("Provider_Total_Trainees.csv", providerTrainees);
                  notify("Exported trainee records as CSV.");
                }}
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          <div className="styled-table-card">
            <div className="styled-table-head">
              <h3>All Enrolled & Graduated Trainees ({providerTrainees.length})</h3>
            </div>
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Trainee</th>
                    <th>Course</th>
                    <th>Attendance</th>
                    <th>Assessment</th>
                    <th>Outcome</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {providerTrainees.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => {
                        setSelectedTrainee(t);
                        setActiveSubtab("Trainee Profile");
                      }}
                    >
                      <td>
                        <div className="table-person">
                          <span className="person-avatar sage">{t.initials}</span>
                          <span>
                            <strong>{t.name}</strong>
                            <small>{t.id} • {t.district}</small>
                          </span>
                        </div>
                      </td>
                      <td>{t.course}</td>
                      <td>
                        <span className={`badge-pill ${t.attendancePct >= 90 ? "status-green" : "status-amber"}`}>
                          {t.attendancePct}%
                        </span>
                      </td>
                      <td><strong>{t.assessmentScore}%</strong></td>
                      <td>
                        <span className={`badge-pill ${t.status === "Employed" ? "status-green" : "status-amber"}`}>
                          {t.status}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          className="table-action-btn"
                          onClick={() => {
                            setSelectedTrainee(t);
                            setActiveSubtab("Trainee Profile");
                          }}
                        >
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Dashboard" && activeSubtab === "Active Courses" && (
        <div>
          <div className="controls-bar">
            <h3>Active Course Offerings ({courses.length})</h3>
            <button className="button button-primary" onClick={openAddCourseModal}>
              <Plus size={15} /> Add New Course
            </button>
          </div>

          <div className="card-grid-3">
            {courses.map((crs) => (
              <div key={crs.id} className="stat-box">
                <div className="stat-box-header">
                  <span className="stat-box-title">{crs.sector}</span>
                  <span className="badge-pill status-green">{crs.demand}</span>
                </div>
                <h3 style={{ margin: "8px 0 4px", fontFamily: "Manrope, sans-serif" }}>{crs.title}</h3>
                <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#748476" }}>
                  Code: <code>{crs.code}</code> • {crs.nsqfLevel}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", borderTop: "1px solid #edf0ec", paddingTop: "10px" }}>
                  <div>
                    <small style={{ color: "#8a968b", fontSize: "10px" }}>Duration</small>
                    <div style={{ fontWeight: "700", fontSize: "12px" }}>{crs.duration}</div>
                  </div>
                  <div>
                    <small style={{ color: "#8a968b", fontSize: "10px" }}>Placement</small>
                    <div style={{ fontWeight: "700", fontSize: "12px", color: "#286b49" }}>
                      {crs.placementRate}% Placed
                    </div>
                  </div>
                </div>
                <button
                  className="table-action-btn"
                  style={{ marginTop: "12px", width: "100%", justifyContent: "center" }}
                  onClick={() => {
                    setSelectedCourse(crs);
                    setActiveSubtab("Course Details");
                  }}
                >
                  Course Details & Outcomes <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeMainTab === "Dashboard" && activeSubtab === "Completion Rate" && (
        <div>
          <div className="card-grid-4">
            <div className="stat-box">
              <span className="stat-box-title">Overall Certified</span>
              <div className="stat-box-val">91.4%</div>
              <div className="stat-box-sub">3,468 of 3,794 assessed</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">First-Attempt Pass</span>
              <div className="stat-box-val">86.2%</div>
              <div className="stat-box-sub">NSQF theory + practical</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Dropout Rate</span>
              <div className="stat-box-val">8.6%</div>
              <div className="stat-box-sub">Below 15% threshold</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Average Score</span>
              <div className="stat-box-val">85.4%</div>
              <div className="stat-box-sub">Practical mark average</div>
            </div>
          </div>

          <div className="styled-table-card">
            <div className="styled-table-head">
              <h3>Batch-wise Completion & Certification Breakdown</h3>
            </div>
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Batch ID</th>
                    <th>Course Name</th>
                    <th>Enrolled</th>
                    <th>Attendance Avg</th>
                    <th>Completion %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b) => (
                    <tr key={b.id}>
                      <td><code>{b.id}</code></td>
                      <td><strong>{b.course}</strong></td>
                      <td>{b.students} Trainees</td>
                      <td>{b.attendanceAvg}%</td>
                      <td>
                        <strong style={{ color: "#286b49" }}>{b.completionRate}%</strong>
                      </td>
                      <td>
                        <span className={`badge-pill ${b.status === "Graduated" ? "status-green" : "status-blue"}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Dashboard" && activeSubtab === "Employment Rate" && (
        <div>
          <div className="card-grid-3">
            <div className="stat-box">
              <span className="stat-box-title">Direct Placement</span>
              <div className="stat-box-val">72.0%</div>
              <div className="stat-box-sub">Placed within 90 days</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Average Starting Salary</span>
              <div className="stat-box-val">₹18,450</div>
              <div className="stat-box-sub">Across technical domains</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Employer Partners</span>
              <div className="stat-box-val">28+</div>
              <div className="stat-box-sub">Active MoU recruitment drives</div>
            </div>
          </div>

          <div className="styled-table-card">
            <div className="styled-table-head">
              <h3>Placement Performance by Sector</h3>
            </div>
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Certified</th>
                    <th>Placed</th>
                    <th>Placement Rate</th>
                    <th>Median Starting Wage</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((crs) => (
                    <tr key={crs.id}>
                      <td><strong>{crs.title}</strong></td>
                      <td>{crs.certified}</td>
                      <td>{crs.placed}</td>
                      <td>
                        <strong style={{ color: "#286b49" }}>{crs.placementRate}%</strong>
                      </td>
                      <td>{money(crs.medianWage)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Dashboard" && activeSubtab === "Notifications" && (
        <div>
          <div className="controls-bar">
            <h3>Training Provider Notifications ({notifications.length})</h3>
            <button
              className="button button-light"
              onClick={() => {
                setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                notify("All notifications marked as read.");
              }}
            >
              <CheckCheck size={14} /> Mark All as Read
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {notifications.map((n) => (
              <div key={n.id} className={`alert-item-card ${n.unread ? "severity-medium" : "severity-low"}`}>
                <div className={`alert-icon-box ${n.unread ? "icon-medium" : "icon-low"}`}>
                  <Bell size={18} />
                </div>
                <div className="alert-content">
                  <div className="alert-top-meta">
                    <span className="alert-category-tag">{n.unread ? "Unread Alert" : "Read"}</span>
                    <span className="alert-time">{n.time}</span>
                  </div>
                  <h4>{n.title}</h4>
                  <p>{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. COURSES VIEWS                                              */}
      {/* ------------------------------------------------------------- */}
      {activeMainTab === "Courses" && activeSubtab === "All Courses" && (
        <div>
          <div className="controls-bar">
            <h3>Course Catalogue ({courses.length})</h3>
            <button className="button button-primary" onClick={openAddCourseModal}>
              <Plus size={15} /> Add New Course
            </button>
          </div>

          <div className="card-grid-3">
            {courses.map((c) => (
              <div key={c.id} className="stat-box">
                <div className="stat-box-header">
                  <span className="stat-box-title">{c.sector}</span>
                  <span className="badge-pill status-green">{c.nsqfLevel}</span>
                </div>
                <h3 style={{ margin: "8px 0 4px", fontFamily: "Manrope, sans-serif" }}>{c.title}</h3>
                <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#748476" }}>
                  QP Code: <code>{c.code}</code>
                </p>
                <div style={{ fontSize: "11px", color: "#495a4f", margin: "6px 0 12px" }}>
                  <strong>Duration:</strong> {c.duration}
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    className="table-action-btn btn-primary-action"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => {
                      setSelectedCourse(c);
                      setActiveSubtab("Course Details");
                    }}
                  >
                    View Details
                  </button>
                  <button
                    className="table-action-btn"
                    onClick={() => {
                      setSelectedCourse(c);
                      setActiveSubtab("Course Outcomes");
                    }}
                  >
                    Outcomes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeMainTab === "Courses" && activeSubtab === "Course Details" && selectedCourse && (
        <div>
          <div className="styled-table-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <span className="badge-pill status-blue" style={{ marginBottom: "8px" }}>
                  {selectedCourse.sector}
                </span>
                <h2 style={{ margin: "4px 0", fontFamily: "Manrope, sans-serif" }}>{selectedCourse.title}</h2>
                <p style={{ margin: "0", color: "#748476", fontSize: "12px" }}>
                  Accreditation Code: <code>{selectedCourse.code}</code> • Level: {selectedCourse.nsqfLevel}
                </p>
              </div>
              <button
                className="button button-primary"
                onClick={() => {
                  notify(`Syllabus and qualification pack downloaded for ${selectedCourse.title}`);
                }}
              >
                <Download size={14} /> Download Syllabus PDF
              </button>
            </div>

            <hr style={{ border: "0", borderTop: "1px solid #edf0ec", margin: "20px 0" }} />

            <div className="key-val-grid">
              <div className="key-val-pair">
                <label>Training Center Lead</label>
                <span>Udaan Skills Complex (Pune)</span>
              </div>
              <div className="key-val-pair">
                <label>Total Hours</label>
                <span>{selectedCourse.duration}</span>
              </div>
              <div className="key-val-pair">
                <label>Theory / Lab Split</label>
                <span>
                  {selectedCourse.theoryHours}h Theory • {selectedCourse.practicalHours}h Practical Lab • {selectedCourse.ojtHours}h OJT
                </span>
              </div>
              <div className="key-val-pair">
                <label>Historical Placement Rate</label>
                <span style={{ color: "#286b49", fontWeight: "800" }}>{selectedCourse.placementRate}%</span>
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <h4 style={{ margin: "0 0 10px", fontSize: "12px", textTransform: "uppercase", color: "#6a796e" }}>
                Course Modules & Curriculum
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(selectedCourse.syllabus || [
                  "Module 1: Basic Electrical Principles & Solar Irradiance",
                  "Module 2: PV Array Structure & Mechanical Assembly",
                  "Module 3: Battery Storage, Inverters & Charge Controllers",
                  "Module 4: Safety Norms & PPE Compliance",
                ]).map((mod, i) => (
                  <div
                    key={mod}
                    style={{
                      padding: "10px 14px",
                      background: "#f9faf8",
                      borderRadius: "6px",
                      border: "1px solid #e9eee7",
                      fontSize: "12px",
                      color: "#37473b",
                    }}
                  >
                    <strong>{mod}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Courses" && activeSubtab === "Course Duration" && (
        <div className="styled-table-card" style={{ padding: "24px" }}>
          <h3>Curriculum Hours Breakdown & Time Allocation</h3>
          <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
            NSQF compliance mandates at least 60% practical hands-on and on-the-job training (OJT) components.
          </p>

          <div className="styled-table-card">
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Theory Classroom</th>
                    <th>Practical Workshop</th>
                    <th>On-the-Job (OJT)</th>
                    <th>Total Training Hours</th>
                    <th>Practical Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((crs) => {
                    const total = crs.theoryHours + crs.practicalHours + crs.ojtHours;
                    const practicalRatio = Math.round(((crs.practicalHours + crs.ojtHours) / total) * 100);
                    return (
                      <tr key={crs.id}>
                        <td><strong>{crs.title}</strong></td>
                        <td>{crs.theoryHours} Hours</td>
                        <td>{crs.practicalHours} Hours</td>
                        <td>{crs.ojtHours} Hours</td>
                        <td><strong>{total} Hours</strong></td>
                        <td>
                          <span className={`badge-pill ${practicalRatio >= 65 ? "status-green" : "status-amber"}`}>
                            {practicalRatio}% Hands-on
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Courses" && activeSubtab === "Skills Covered" && (
        <div className="styled-table-card" style={{ padding: "24px" }}>
          <h3>Skills & Learning Competency Matrix</h3>
          <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
            Competency mappings aligned with National Occupational Standards (NOS).
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {courses.map((crs) => (
              <div key={crs.id} className="stat-box">
                <h4 style={{ margin: "0 0 6px", fontFamily: "Manrope, sans-serif" }}>{crs.title}</h4>
                <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#748476" }}>{crs.outcomes}</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {crs.skillsCovered.map((sk) => (
                    <span key={sk} className="badge-pill status-blue" style={{ padding: "6px 12px", fontSize: "11px" }}>
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeMainTab === "Courses" && activeSubtab === "Course Outcomes" && (
        <div>
          <div className="controls-bar">
            <h3>Course-wise Employment & Wage Outcomes</h3>
            <button
              className="button button-light"
              onClick={() => {
                exportCsv("Course_Outcomes_Summary.csv", courses);
                notify("Course outcomes exported as CSV.");
              }}
            >
              <Download size={14} /> Export CSV
            </button>
          </div>

          <div className="styled-table-card">
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Enrolled</th>
                    <th>Certified</th>
                    <th>Placed in Work</th>
                    <th>Placement Rate</th>
                    <th>Median Monthly Wage</th>
                    <th>Retention @ 6M</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((crs) => (
                    <tr key={crs.id}>
                      <td><strong>{crs.title}</strong></td>
                      <td>{crs.enrolled.toLocaleString()}</td>
                      <td>{crs.certified.toLocaleString()}</td>
                      <td>{crs.placed.toLocaleString()}</td>
                      <td>
                        <strong style={{ color: "#286b49" }}>{crs.placementRate}%</strong>
                      </td>
                      <td><strong>{money(crs.medianWage)}</strong></td>
                      <td>
                        <span className="badge-pill status-green">{crs.retentionRate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. TRAINEES VIEWS                                             */}
      {/* ------------------------------------------------------------- */}
      {activeMainTab === "Trainees" && activeSubtab === "Trainee List" && (
        <div>
          <div className="controls-bar">
            <div className="controls-left">
              <label className="table-search">
                <Search size={15} />
                <input
                  placeholder="Search by name, ID, or course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </label>
              <label className="filter-select">
                <Filter size={14} />
                <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
                  <option value="All">All Courses</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </label>
            </div>
            <div className="controls-right">
              <button
                className="button button-light"
                onClick={() => {
                  exportCsv("Trainee_Cohort_Roster.csv", providerTrainees);
                  notify("Exported cohort roster as CSV.");
                }}
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          <div className="styled-table-card">
            <div className="styled-table-head">
              <h3>Enrolled Trainees ({providerTrainees.length})</h3>
            </div>
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Trainee</th>
                    <th>Course</th>
                    <th>Batch</th>
                    <th>Attendance</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Certificate</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {providerTrainees.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => {
                        setSelectedTrainee(t);
                        setActiveSubtab("Trainee Profile");
                      }}
                    >
                      <td>
                        <div className="table-person">
                          <span className="person-avatar sage">{t.initials}</span>
                          <span>
                            <strong>{t.name}</strong>
                            <small>{t.id} • {t.district}</small>
                          </span>
                        </div>
                      </td>
                      <td>{t.course}</td>
                      <td><code>{t.batchId || "BATCH-2024-SOL-A"}</code></td>
                      <td>
                        <span className={`badge-pill ${t.attendancePct >= 90 ? "status-green" : "status-amber"}`}>
                          {t.attendancePct}%
                        </span>
                      </td>
                      <td><strong>{t.assessmentScore}%</strong></td>
                      <td>
                        <span className={`badge-pill ${t.status === "Employed" ? "status-green" : "status-amber"}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        {t.certId ? (
                          <span className="badge-pill status-green">✓ Issued</span>
                        ) : (
                          <span className="badge-pill status-amber">Pending</span>
                        )}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          className="table-action-btn"
                          onClick={() => {
                            setSelectedTrainee(t);
                            setActiveSubtab("Trainee Profile");
                          }}
                        >
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Trainees" && activeSubtab === "Trainee Profile" && selectedTrainee && (
        <div className="styled-table-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span className="profile-avatar" style={{ width: "64px", height: "64px", fontSize: "20px" }}>
                {selectedTrainee.initials}
              </span>
              <div>
                <h2 style={{ margin: "0 0 4px", fontFamily: "Manrope, sans-serif" }}>{selectedTrainee.name}</h2>
                <p style={{ margin: "0", color: "#748476", fontSize: "12px" }}>
                  ID: {selectedTrainee.id} • {selectedTrainee.city} • {selectedTrainee.phone}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="button button-light"
                onClick={() => handleToggleAttendance(selectedTrainee.id)}
              >
                Log Today's Attendance
              </button>
              <button
                className="button button-primary"
                onClick={() => handleIssueCertificate(selectedTrainee)}
              >
                <Award size={14} /> Issue Certificate
              </button>
            </div>
          </div>

          <hr style={{ border: "0", borderTop: "1px solid #edf0ec", margin: "20px 0" }} />

          <div className="key-val-grid">
            <div className="key-val-pair">
              <label>Course Name</label>
              <span>{selectedTrainee.course}</span>
            </div>
            <div className="key-val-pair">
              <label>Batch Assignment</label>
              <span>{selectedTrainee.batchId || "BATCH-2024-SOL-A"}</span>
            </div>
            <div className="key-val-pair">
              <label>Overall Attendance</label>
              <span style={{ color: selectedTrainee.attendancePct >= 90 ? "#286b49" : "#c47a28", fontWeight: "800" }}>
                {selectedTrainee.attendancePct}%
              </span>
            </div>
            <div className="key-val-pair">
              <label>Assessment Score</label>
              <span style={{ fontWeight: "800" }}>{selectedTrainee.assessmentScore}% (Grade A)</span>
            </div>
            <div className="key-val-pair">
              <label>Certification Status</label>
              <span>
                {selectedTrainee.certId ? (
                  <span className="badge-pill status-green">✓ {selectedTrainee.certId}</span>
                ) : (
                  <span className="badge-pill status-amber">Ready for Issuance</span>
                )}
              </span>
            </div>
            <div className="key-val-pair">
              <label>Current Employment</label>
              <span>
                {selectedTrainee.status === "Employed"
                  ? `${selectedTrainee.role} at ${selectedTrainee.employer}`
                  : selectedTrainee.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Trainees" && activeSubtab === "Attendance" && (
        <div>
          <div className="styled-table-card" style={{ padding: "20px" }}>
            <div className="styled-table-head" style={{ padding: "0 0 14px", background: "none" }}>
              <h3>Daily Attendance Register & Live Toggle</h3>
              <button
                className="button button-light"
                onClick={() => {
                  exportCsv("Attendance_Register.csv", providerTrainees);
                  notify("Attendance sheet exported.");
                }}
              >
                <Download size={14} /> Export Sheet
              </button>
            </div>
            <p style={{ fontSize: "11px", color: "#748476", marginBottom: "16px" }}>
              Click "Mark Present" to dynamically log biometrics / attendance and update percentage.
            </p>

            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Trainee</th>
                    <th>Batch</th>
                    <th>Attendance %</th>
                    <th>Attendance Meter</th>
                    <th>Daily Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {providerTrainees.map((t) => (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong> ({t.id})</td>
                      <td><code>{t.batchId || "BATCH-2024-SOL-A"}</code></td>
                      <td>
                        <strong>{t.attendancePct}%</strong>
                      </td>
                      <td>
                        <div className="custom-progress" style={{ width: "120px" }}>
                          <div
                            className={`custom-progress-bar ${
                              t.attendancePct >= 90 ? "" : "bar-amber"
                            }`}
                            style={{ width: `${t.attendancePct}%` }}
                          />
                        </div>
                      </td>
                      <td>
                        <button
                          className="table-action-btn btn-primary-action"
                          onClick={() => handleToggleAttendance(t.id)}
                        >
                          <Check size={12} /> Mark Present Today
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Trainees" && activeSubtab === "Assessment" && (
        <div className="styled-table-card" style={{ padding: "24px" }}>
          <h3>Assessment & Examination Marksheet</h3>
          <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
            NSQF Assessment criteria: Theory (30%), Practical Simulation (50%), Viva & Portfolio (20%).
          </p>

          <div className="table-wrap">
            <table className="trainee-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Course</th>
                  <th>Theory (30)</th>
                  <th>Practical (50)</th>
                  <th>Viva (20)</th>
                  <th>Total Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {providerTrainees.map((t) => {
                  const theory = Math.round((t.assessmentScore * 0.3) / 10) * 10;
                  const practical = Math.round((t.assessmentScore * 0.5) / 10) * 10;
                  const viva = Math.round((t.assessmentScore * 0.2) / 10) * 10;
                  return (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong></td>
                      <td>{t.course}</td>
                      <td>{theory} / 30</td>
                      <td>{practical} / 50</td>
                      <td>{viva} / 20</td>
                      <td>
                        <strong style={{ color: "#286b49", fontSize: "13px" }}>
                          {t.assessmentScore}%
                        </strong>
                      </td>
                      <td>
                        <span className="badge-pill status-green">Passed (Grade A)</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeMainTab === "Trainees" && activeSubtab === "Certification" && (
        <div>
          <div className="styled-table-card" style={{ padding: "24px" }}>
            <h3>NSQF Certification Issuance & Registry</h3>
            <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
              Generate tamper-proof digital certificates with embedded cryptographic verification QR codes.
            </p>

            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Course & NSQF Level</th>
                    <th>Assessment Status</th>
                    <th>Certificate Number</th>
                    <th>Issue Action</th>
                  </tr>
                </thead>
                <tbody>
                  {providerTrainees.map((t) => (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong> ({t.id})</td>
                      <td>{t.course} (Level 4)</td>
                      <td>
                        <span className="badge-pill status-green">Eligible ({t.assessmentScore}%)</span>
                      </td>
                      <td>
                        {t.certId ? (
                          <code>{t.certId}</code>
                        ) : (
                          <span style={{ color: "#8a968b", fontSize: "11px" }}>Not yet issued</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="button button-primary"
                          style={{ fontSize: "11px", padding: "5px 11px" }}
                          onClick={() => handleIssueCertificate(t)}
                        >
                          <Award size={13} /> {t.certId ? "Re-generate" : "Issue Certificate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. OUTCOMES VIEWS                                             */}
      {/* ------------------------------------------------------------- */}
      {activeMainTab === "Outcomes" && (
        <div>
          <div className="controls-bar">
            <h3>{activeSubtab}</h3>
            <button
              className="button button-primary"
              onClick={() => {
                exportCsv("Course_Outcomes_Full.csv", courses);
                notify("Downloaded complete outcomes report.");
              }}
            >
              <Download size={14} /> Export Outcomes CSV
            </button>
          </div>

          <div className="card-grid-4">
            <div className="stat-box">
              <span className="stat-box-title">Placement Rate</span>
              <div className="stat-box-val">72.0%</div>
              <div className="stat-box-sub">Overall batch average</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Retention @ 6 Months</span>
              <div className="stat-box-val">81.0%</div>
              <div className="stat-box-sub">Sustained livelihood</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Median Starting Wage</span>
              <div className="stat-box-val">₹18,500</div>
              <div className="stat-box-sub">+18% above minimum wage</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Self-Employed / Freelance</span>
              <div className="stat-box-val">12.4%</div>
              <div className="stat-box-sub">Micro-entrepreneurs</div>
            </div>
          </div>

          <div className="styled-table-card">
            <div className="styled-table-head">
              <h3>Detailed Course Outcome Benchmarks</h3>
            </div>
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Course Title</th>
                    <th>Enrolled</th>
                    <th>Placed</th>
                    <th>Placement Rate</th>
                    <th>Median Wage</th>
                    <th>6-Mo Retention</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((crs) => (
                    <tr key={crs.id}>
                      <td><strong>{crs.title}</strong></td>
                      <td>{crs.enrolled}</td>
                      <td>{crs.placed}</td>
                      <td>
                        <strong style={{ color: "#286b49" }}>{crs.placementRate}%</strong>
                      </td>
                      <td>{money(crs.medianWage)}</td>
                      <td>
                        <span className="badge-pill status-green">{crs.retentionRate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. SKILL GAP VIEWS                                            */}
      {/* ------------------------------------------------------------- */}
      {activeMainTab === "Skill Gap" && (
        <div>
          <div className="info-callout callout-blue">
            <Sparkles size={20} />
            <div>
              <strong>Skill Gap Feedback Loop</strong>
              <p>
                Real-time gap intelligence derived from employer verification notes and industry survey requisitions across Maharashtra and Western India.
              </p>
            </div>
          </div>

          <div className="styled-table-card" style={{ padding: "20px" }}>
            <div className="styled-table-head" style={{ padding: "0 0 14px", background: "none" }}>
              <h3>{activeSubtab}</h3>
              <button
                className="button button-light"
                onClick={() => {
                  exportCsv("Skill_Gap_Analysis.csv", skillGaps);
                  notify("Exported skill gap dataset as CSV.");
                }}
              >
                <Download size={14} /> Export Gap Analysis
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {skillGaps.map((sg, index) => (
                <div key={sg.skill} className="stat-box">
                  <div className="stat-box-header">
                    <span className="stat-box-title">{sg.sector}</span>
                    <span className={`badge-pill ${sg.priority === "High" ? "status-red" : sg.priority === "Medium" ? "status-amber" : "status-green"}`}>
                      {sg.priority} Priority Gap
                    </span>
                  </div>
                  <h4 style={{ margin: "6px 0 2px", fontFamily: "Manrope, sans-serif" }}>{sg.skill}</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "10px 0" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6e7e71" }}>
                        <span>Industry Demand</span>
                        <strong>{sg.industryDemand}%</strong>
                      </div>
                      <div className="custom-progress">
                        <div className="custom-progress-bar bar-blue" style={{ width: `${sg.industryDemand}%` }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6e7e71" }}>
                        <span>Course Coverage</span>
                        <strong>{sg.courseCoverage}%</strong>
                      </div>
                      <div className="custom-progress">
                        <div className="custom-progress-bar bar-amber" style={{ width: `${sg.courseCoverage}%` }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#455548", background: "#f8faf7", padding: "8px 12px", borderRadius: "6px", marginTop: "4px" }}>
                    <strong>Recommended Action:</strong> {sg.recommendedAction}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                    <button
                      className="button button-primary"
                      style={{ fontSize: "11px", padding: "6px 12px" }}
                      onClick={() => handleAdoptImprovement(index)}
                    >
                      <Check size={13} /> {sg.status || "Adopt into Next Course Batch"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. REPORTS & ANALYTICS VIEWS                                  */}
      {/* ------------------------------------------------------------- */}
      {activeMainTab === "Reports & Analytics" && (
        <div>
          <div className="controls-bar">
            <h3>{activeSubtab}</h3>
            <button
              className="button button-primary"
              onClick={() => {
                exportCsv(`${activeSubtab.replace(/ /g, "_")}.csv", providerTrainees);
                notify(`${activeSubtab} exported as CSV.`);
              }}
            >
              <Download size={14} /> Download {activeSubtab} Report
            </button>
          </div>

          <div className="card-grid-3">
            <div className="stat-box">
              <span className="stat-box-title">Certified Cohort</span>
              <div className="stat-box-val">2,267</div>
              <div className="stat-box-sub">Current academic year</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Direct Placements</span>
              <div className="stat-box-val">1,632</div>
              <div className="stat-box-sub">Verified by corporate partners</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Audit Rating</span>
              <div className="stat-box-val">94/100</div>
              <div className="stat-box-sub">Grade A Accredited Center</div>
            </div>
          </div>

          <div className="styled-table-card">
            <div className="styled-table-head">
              <h3>{activeSubtab} Performance Table</h3>
            </div>
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Batch / Program</th>
                    <th>Course</th>
                    <th>Total Intake</th>
                    <th>Exam Pass Rate</th>
                    <th>Placed</th>
                    <th>Retention @ 6M</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b) => (
                    <tr key={b.id}>
                      <td><code>{b.id}</code></td>
                      <td><strong>{b.course}</strong></td>
                      <td>{b.students}</td>
                      <td><strong>{b.completionRate}%</strong></td>
                      <td>{Math.round(b.students * 0.74)} ({b.completionRate - 15}%)</td>
                      <td>
                        <span className="badge-pill status-green">82%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. PROFILE & SETTINGS VIEWS                                   */}
      {/* ------------------------------------------------------------- */}
      {activeMainTab === "Profile & Settings" && activeSubtab === "Institute Profile" && (
        <div className="styled-table-card" style={{ padding: "24px" }}>
          <h3>Training Institute Profile</h3>
          <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
            Accredited vocational training partner records recognized under PMKVY and state skill development missions.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              notify("Institute profile updated successfully.");
            }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="card-grid-2">
              <div className="input-field-group">
                <label>Institute Name</label>
                <input
                  value={instituteDetails.name}
                  onChange={(e) => setInstituteDetails({ ...instituteDetails, name: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>SMART Portal Center ID</label>
                <input
                  value={instituteDetails.smartId}
                  onChange={(e) => setInstituteDetails({ ...instituteDetails, smartId: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>NSDC Partner ID</label>
                <input
                  value={instituteDetails.nsdcPartnerId}
                  onChange={(e) => setInstituteDetails({ ...instituteDetails, nsdcPartnerId: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>Active Center Branches</label>
                <input
                  value={instituteDetails.centersCount}
                  onChange={(e) => setInstituteDetails({ ...instituteDetails, centersCount: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group" style={{ gridColumn: "1 / -1" }}>
                <label>Main Center Campus Address</label>
                <textarea
                  value={instituteDetails.headCenter}
                  onChange={(e) => setInstituteDetails({ ...instituteDetails, headCenter: e.target.value })}
                  rows={2}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="button button-primary">
                Save Institute Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {activeMainTab === "Profile & Settings" && activeSubtab === "Contact Details" && (
        <div className="styled-table-card" style={{ padding: "24px" }}>
          <h3>Nodal Officer & Key Institute Leadership</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              notify("Key personnel contact details updated.");
            }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="card-grid-2">
              <div className="input-field-group">
                <label>Institute Director Name</label>
                <input
                  value={instituteDetails.director}
                  onChange={(e) => setInstituteDetails({ ...instituteDetails, director: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>Director Email</label>
                <input
                  type="email"
                  value={instituteDetails.directorEmail}
                  onChange={(e) => setInstituteDetails({ ...instituteDetails, directorEmail: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>Placement Officer Name</label>
                <input
                  value={instituteDetails.placementOfficer}
                  onChange={(e) => setInstituteDetails({ ...instituteDetails, placementOfficer: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>Placement Cell Email</label>
                <input
                  type="email"
                  value={instituteDetails.placementEmail}
                  onChange={(e) => setInstituteDetails({ ...instituteDetails, placementEmail: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="button button-primary">
                Save Leadership Contacts
              </button>
            </div>
          </form>
        </div>
      )}

      {activeMainTab === "Profile & Settings" && activeSubtab === "Account Settings" && (
        <div className="styled-table-card" style={{ padding: "24px" }}>
          <h3>Operational & Certification Preferences</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="setting-row">
              <span>
                <strong>Automatic NSQF Certificate Issuance on Passing</strong>
                <small>Auto-generate verifiable digital certificate upon assessor mark submission.</small>
              </span>
              <button
                className={`toggle ${instituteSettings.autoCertificateIssuance ? "toggle-on" : ""}`}
                onClick={() => {
                  setInstituteSettings({ ...instituteSettings, autoCertificateIssuance: !instituteSettings.autoCertificateIssuance });
                  notify("Automatic certificate issuance toggled.");
                }}
              >
                <i />
              </button>
            </div>

            <div className="setting-row">
              <span>
                <strong>Low Attendance Automated Alerts</strong>
                <small>Notify candidate via SMS/WhatsApp when attendance falls below 80%.</small>
              </span>
              <button
                className={`toggle ${instituteSettings.attendanceAlerts ? "toggle-on" : ""}`}
                onClick={() => {
                  setInstituteSettings({ ...instituteSettings, attendanceAlerts: !instituteSettings.attendanceAlerts });
                  notify("Low attendance alerts toggled.");
                }}
              >
                <i />
              </button>
            </div>

            <div className="setting-row">
              <span>
                <strong>Share Employer Feedback with Course Instructors</strong>
                <small>Provide trainers with anonymized gap reports from industry verifiers.</small>
              </span>
              <button
                className={`toggle ${instituteSettings.employerFeedbackShare ? "toggle-on" : ""}`}
                onClick={() => {
                  setInstituteSettings({ ...instituteSettings, employerFeedbackShare: !instituteSettings.employerFeedbackShare });
                  notify("Feedback sharing preference updated.");
                }}
              >
                <i />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

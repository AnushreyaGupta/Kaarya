import React, { useState, useMemo } from "react";
import {
  Users, ShieldCheck, WalletCards, FileBarChart2, Building2, Bell, CheckCircle2,
  TrendingUp, Download, Plus, Search, Filter, ArrowRight, Eye, Check, Clock3,
  CalendarDays, Award, BriefcaseBusiness, AlertCircle, ChevronDown, CheckCheck,
  ChevronRight, RefreshCw, X, Edit, SlidersHorizontal, MapPin, Mail, Phone, Lock
} from "lucide-react";
import { money, exportCsv } from "../portalData.js";

export function EmployerPortal({
  trainees,
  setTrainees,
  verificationHistory,
  setVerificationHistory,
  notifications,
  setNotifications,
  openTraineeModal,
  openVerifyModal,
  openUpdateModal,
  openSalaryModal,
  notify,
  activeSubtab,
  setActiveSubtab,
  activeMainTab,
}) {
  // Local state for Employer subpages
  const [empSearch, setEmpSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState(trainees[0]);

  // Settings local state
  const [companyDetails, setCompanyDetails] = useState({
    name: "SunGrid Energy Private Limited",
    cin: "U40106MH2018PTC312450",
    sector: "Renewable Energy & Solar Power",
    headquarters: "Shivaji Nagar, Pune, Maharashtra 411005",
    employeesCount: "486",
    website: "https://sungridenergy.example.in",
    nodalOfficer: "Rohan Desai",
    designation: "Head of Talent & People Operations",
    email: "rohan.desai@sungrid.example",
    phone: "+91 98230 45678",
  });

  const [companySettings, setCompanySettings] = useState({
    emailAlerts: true,
    weeklyDigest: true,
    consentEnforced: true,
    maskPiiInGovtExports: true,
    twoFactorAuth: true,
    thirdPartyAuditAccess: false,
  });

  // Filter trainees belonging to or hireable by this employer
  const employerHires = useMemo(() => {
    return trainees.filter((t) => t.employer && t.employer.toLowerCase().includes("sungrid"));
  }, [trainees]);

  const allVisibleEmployees = useMemo(() => {
    return trainees.filter((t) => {
      const isRelevant = t.employer ? t.employer.toLowerCase().includes("sungrid") || t.status === "Employed" : false;
      const matchesSearch = `${t.name} ${t.id} ${t.role} ${t.department} ${t.course}`
        .toLowerCase()
        .includes(empSearch.toLowerCase());
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      const matchesDept = deptFilter === "All" || t.department === deptFilter;
      return isRelevant && matchesSearch && matchesStatus && matchesDept;
    });
  }, [trainees, empSearch, statusFilter, deptFilter]);

  const pendingVerificationList = useMemo(() => {
    return trainees.filter((t) => t.employer && !t.verified);
  }, [trainees]);

  // Quick Action Handler for instant Verification from table
  const handleQuickVerify = (trainee) => {
    const newVer = {
      id: `VER-${Math.floor(1000 + Math.random() * 9000)}`,
      traineeId: trainee.id,
      name: trainee.name,
      employer: trainee.employer || "SunGrid Energy",
      role: trainee.role || "Solar Technician",
      wage: trainee.wage || 18500,
      verifiedBy: "Rohan Desai (People Ops)",
      verifiedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Confirmed",
    };
    setVerificationHistory((prev) => [newVer, ...prev]);
    setTrainees((prev) =>
      prev.map((item) => (item.id === trainee.id ? { ...item, verified: true, employer: "SunGrid Energy" } : item))
    );
    notify(`Employment verified for ${trainee.name}! Recorded in Verification History.`);
  };

  // Subtabs configuration per main navigation tab
  const subtabsConfig = {
    Dashboard: [
      { id: "Overview", label: "Overview" },
      { id: "Employees / Trainees Hired", label: "Employees / Trainees Hired", count: employerHires.length },
      { id: "Pending Verifications", label: "Pending Verifications", count: pendingVerificationList.length },
      { id: "Employment Statistics", label: "Employment Statistics" },
      { id: "Notifications", label: "Notifications", count: notifications.filter((n) => n.unread).length },
    ],
    Employees: [
      { id: "Employee List", label: "Employee List", count: allVisibleEmployees.length },
      { id: "Employee Profile", label: "Employee Profile" },
      { id: "Employment Status", label: "Employment Status" },
      { id: "Job Role", label: "Job Role" },
      { id: "Joining Details", label: "Joining Details" },
      { id: "Employment History", label: "Employment History" },
    ],
    Verification: [
      { id: "Pending Verification", label: "Pending Verification", count: pendingVerificationList.length },
      { id: "Verify Employment", label: "Verify Employment" },
      { id: "Update Employment Details", label: "Update Employment Details" },
      { id: "Verification History", label: "Verification History", count: verificationHistory.length },
    ],
    "Salary & Retention": [
      { id: "Salary Details", label: "Salary Details" },
      { id: "Salary Updates", label: "Salary Updates" },
      { id: "Job Retention", label: "Job Retention" },
      { id: "Employee Progress", label: "Employee Progress" },
    ],
    Reports: [
      { id: "Hiring Summary", label: "Hiring Summary" },
      { id: "Skill-wise Hiring", label: "Skill-wise Hiring" },
      { id: "Retention Reports", label: "Retention Reports" },
      { id: "Employment Reports", label: "Employment Reports" },
    ],
    "Profile & Settings": [
      { id: "Company Profile", label: "Company Profile" },
      { id: "Contact Details", label: "Contact Details" },
      { id: "Account Settings", label: "Account Settings" },
      { id: "Privacy / Permissions", label: "Privacy / Permissions" },
    ],
  };

  const activeSubtabs = subtabsConfig[activeMainTab] || subtabsConfig.Dashboard;

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
          {/* Key Metrics */}
          <div className="card-grid-4">
            <div className="stat-box">
              <div className="stat-box-header">
                <span className="stat-box-title">Total Hires</span>
                <span className="badge-pill status-green">+18 this month</span>
              </div>
              <div className="stat-box-val">{employerHires.length + 480}</div>
              <div className="stat-box-sub">
                <Users size={12} /> Hired through certified skilling partners
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-box-header">
                <span className="stat-box-title">Pending Verifications</span>
                <span className="badge-pill status-amber">{pendingVerificationList.length} Action Needed</span>
              </div>
              <div className="stat-box-val">{pendingVerificationList.length}</div>
              <div className="stat-box-sub">
                <ShieldCheck size={12} /> Requires employer confirmation
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-box-header">
                <span className="stat-box-title">6-Month Retention</span>
                <span className="badge-pill status-blue">+4.8% QoQ</span>
              </div>
              <div className="stat-box-val">82.4%</div>
              <div className="stat-box-sub">
                <Award size={12} /> Exceeds national benchmark (70%)
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-box-header">
                <span className="stat-box-title">Median Monthly Wage</span>
                <span className="badge-pill status-purple">+9.2% YoY</span>
              </div>
              <div className="stat-box-val">₹19,450</div>
              <div className="stat-box-sub">
                <WalletCards size={12} /> Across solar & technical roles
              </div>
            </div>
          </div>

          {/* Quick Overview Grid */}
          <div className="card-grid-2">
            <div className="styled-table-card">
              <div className="styled-table-head">
                <h3>Recent Hires from Skilling Partners</h3>
                <button
                  className="table-action-btn"
                  onClick={() => setActiveSubtab("Employees / Trainees Hired")}
                >
                  View All <ArrowRight size={13} />
                </button>
              </div>
              <div className="table-wrap">
                <table className="trainee-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Role & Dept</th>
                      <th>Joining Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employerHires.slice(0, 5).map((emp) => (
                      <tr key={emp.id} onClick={() => { setSelectedEmployee(emp); setActiveSubtab("Employee Profile"); }}>
                        <td>
                          <div className="table-person">
                            <span className="person-avatar sage">{emp.initials}</span>
                            <span>
                              <strong>{emp.name}</strong>
                              <small>{emp.id}</small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <strong>{emp.role}</strong>
                          <br />
                          <small>{emp.department || "Operations"}</small>
                        </td>
                        <td>{emp.joiningDate || "12 Jan 2026"}</td>
                        <td>
                          <span className={`badge-pill ${emp.verified ? "status-green" : "status-amber"}`}>
                            {emp.verified ? "Verified" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="styled-table-card">
              <div className="styled-table-head">
                <h3>Verification Action Queue</h3>
                <button
                  className="table-action-btn btn-primary-action"
                  onClick={() => setActiveSubtab("Pending Verifications")}
                >
                  Process Queue <ShieldCheck size={13} />
                </button>
              </div>
              <div style={{ padding: "16px" }}>
                {pendingVerificationList.length === 0 ? (
                  <p className="empty-state">All current employee verification records are up to date.</p>
                ) : (
                  pendingVerificationList.slice(0, 3).map((item) => (
                    <div key={item.id} className="alert-item-card severity-medium">
                      <div className="alert-icon-box icon-medium">
                        <ShieldCheck size={18} />
                      </div>
                      <div className="alert-content">
                        <div className="alert-top-meta">
                          <span className="alert-category-tag">Confirmation Due</span>
                          <span className="alert-time">{item.course}</span>
                        </div>
                        <h4>{item.name} ({item.id})</h4>
                        <p>
                          Reported joining role <strong>{item.role || "Trainee"}</strong> with starting wage of{" "}
                          <strong>{money(item.wage || 18000)}</strong>.
                        </p>
                        <div className="alert-actions-row">
                          <button
                            className="table-action-btn btn-primary-action"
                            onClick={() => handleQuickVerify(item)}
                          >
                            <Check size={12} /> Confirm Employment
                          </button>
                          <button
                            className="table-action-btn"
                            onClick={() => openVerifyModal(item)}
                          >
                            Review & Edit Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Dashboard" && activeSubtab === "Employees / Trainees Hired" && (
        <div>
          <div className="controls-bar">
            <div className="controls-left">
              <label className="table-search">
                <Search size={15} />
                <input
                  placeholder="Search by name, ID, or job role..."
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                />
              </label>
              <label className="filter-select">
                <Filter size={14} />
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                  <option value="All">All Departments</option>
                  <option value="Field Engineering">Field Engineering</option>
                  <option value="Inpatient Care">Inpatient Care</option>
                  <option value="Battery & Drivetrain Workshop">Battery & Drivetrain</option>
                  <option value="Supply Chain & ERP">Supply Chain & ERP</option>
                  <option value="Diagnostics Center">Diagnostics Center</option>
                </select>
                <ChevronDown size={14} />
              </label>
            </div>
            <div className="controls-right">
              <button
                className="button button-light"
                onClick={() => {
                  exportCsv("SunGrid_Employees_Hired.csv", employerHires);
                  notify("Exported hired employees list as CSV.");
                }}
              >
                <Download size={15} /> Export Employees CSV
              </button>
            </div>
          </div>

          <div className="styled-table-card">
            <div className="styled-table-head">
              <h3>All Employees Hired from Skilling Channels ({employerHires.length})</h3>
            </div>
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Job Role</th>
                    <th>Department</th>
                    <th>Training Partner</th>
                    <th>Joining Date</th>
                    <th>Monthly Wage</th>
                    <th>Verification</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employerHires.map((emp) => (
                    <tr key={emp.id} onClick={() => { setSelectedEmployee(emp); setActiveSubtab("Employee Profile"); }}>
                      <td>
                        <div className="table-person">
                          <span className="person-avatar sage">{emp.initials}</span>
                          <span>
                            <strong>{emp.name}</strong>
                            <small>{emp.id} • {emp.city}</small>
                          </span>
                        </div>
                      </td>
                      <td><strong>{emp.role}</strong></td>
                      <td>{emp.department || "Operations"}</td>
                      <td>{emp.provider}</td>
                      <td>{emp.joiningDate || "12 Jan 2026"}</td>
                      <td><strong>{money(emp.wage)}</strong></td>
                      <td>
                        <span className={`badge-pill ${emp.verified ? "status-green" : "status-amber"}`}>
                          {emp.verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          className="table-action-btn"
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setActiveSubtab("Employee Profile");
                          }}
                        >
                          <Eye size={12} /> View Profile
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

      {activeMainTab === "Dashboard" && activeSubtab === "Pending Verifications" && (
        <div>
          <div className="info-callout callout-amber">
            <ShieldCheck size={20} />
            <div>
              <strong>Government Compliance Mandate</strong>
              <p>
                Under the National Skilling Mission, employer verification of employment status, role, and starting salary enables
                performance-based incentive credits and provides authentic outcome data for state decision-making.
              </p>
            </div>
          </div>

          <div className="controls-bar">
            <h3>{pendingVerificationList.length} Records Awaiting Confirmation</h3>
            <button
              className="button button-primary"
              onClick={() => {
                pendingVerificationList.forEach((p) => handleQuickVerify(p));
              }}
              disabled={pendingVerificationList.length === 0}
            >
              <CheckCircle2 size={15} /> Verify All Pending ({pendingVerificationList.length})
            </button>
          </div>

          <div className="styled-table-card">
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Training Course</th>
                    <th>Claimed Role</th>
                    <th>Claimed Wage</th>
                    <th>Partner Provider</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingVerificationList.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div className="table-person">
                          <span className="person-avatar peach">{emp.initials}</span>
                          <span>
                            <strong>{emp.name}</strong>
                            <small>{emp.id}</small>
                          </span>
                        </div>
                      </td>
                      <td>{emp.course}</td>
                      <td><strong>{emp.role || "Technician Trainee"}</strong></td>
                      <td><strong>{money(emp.wage || 18000)}</strong></td>
                      <td>{emp.provider}</td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="table-action-btn btn-primary-action"
                            onClick={() => handleQuickVerify(emp)}
                          >
                            <Check size={12} /> Verify
                          </button>
                          <button
                            className="table-action-btn"
                            onClick={() => openVerifyModal(emp)}
                          >
                            <Edit size={12} /> Edit Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingVerificationList.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#859388" }}>
                        🎉 All candidate employment verifications have been confirmed!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Dashboard" && activeSubtab === "Employment Statistics" && (
        <div>
          <div className="card-grid-4">
            <div className="stat-box">
              <span className="stat-box-title">Average Tenure</span>
              <div className="stat-box-val">9.4 Mo</div>
              <div className="stat-box-sub">Across active skilling hires</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Appraisal Rate</span>
              <div className="stat-box-val">68.2%</div>
              <div className="stat-box-sub">Promoted within 12 months</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Average Wage Increment</span>
              <div className="stat-box-val">+17.8%</div>
              <div className="stat-box-sub">Year 1 wage trajectory</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Conversion to Permanent</span>
              <div className="stat-box-val">92.0%</div>
              <div className="stat-box-sub">From probation/apprenticeship</div>
            </div>
          </div>

          <div className="card-grid-2">
            <div className="styled-table-card" style={{ padding: "20px" }}>
              <h3>Retention Cohort Breakdown</h3>
              <p style={{ fontSize: "11px", color: "#7a877c" }}>
                Tracking workforce continuity at 30-day, 90-day, 180-day, and 365-day marks.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                    <span>1-Month Retention (Onboarding)</span>
                    <strong>96.8%</strong>
                  </div>
                  <div className="custom-progress">
                    <div className="custom-progress-bar" style={{ width: "96.8%" }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                    <span>3-Month Retention (Probation)</span>
                    <strong>89.4%</strong>
                  </div>
                  <div className="custom-progress">
                    <div className="custom-progress-bar" style={{ width: "89.4%" }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                    <span>6-Month Retention (Confirmed)</span>
                    <strong>82.4%</strong>
                  </div>
                  <div className="custom-progress">
                    <div className="custom-progress-bar bar-blue" style={{ width: "82.4%" }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                    <span>12-Month Retention (Long-term)</span>
                    <strong>74.6%</strong>
                  </div>
                  <div className="custom-progress">
                    <div className="custom-progress-bar bar-amber" style={{ width: "74.6%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="styled-table-card" style={{ padding: "20px" }}>
              <h3>Hiring Channel Distribution</h3>
              <p style={{ fontSize: "11px", color: "#7a877c" }}>
                Share of hires by skilling partner institution.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                {[
                  ["Udaan Skills Centre (Solar & EV)", "48%", "48%"],
                  ["Saksham Foundation (Healthcare & Operations)", "28%", "28%"],
                  ["Nirmaan Trust (Data & Back-office)", "16%", "16%"],
                  ["Kaushal Pragati (Retail & Logistics)", "8%", "8%"],
                ].map(([partner, pct, width]) => (
                  <div key={partner}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                      <span>{partner}</span>
                      <strong>{pct}</strong>
                    </div>
                    <div className="custom-progress">
                      <div className="custom-progress-bar" style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Dashboard" && activeSubtab === "Notifications" && (
        <div>
          <div className="controls-bar">
            <h3>Company Notifications ({notifications.length})</h3>
            <button
              className="button button-light"
              onClick={() => {
                setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                notify("All notifications marked as read.");
              }}
            >
              <CheckCheck size={15} /> Mark All as Read
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {notifications.map((item) => (
              <div key={item.id} className={`alert-item-card ${item.unread ? "severity-medium" : "severity-low"}`}>
                <div className={`alert-icon-box ${item.unread ? "icon-medium" : "icon-low"}`}>
                  <Bell size={18} />
                </div>
                <div className="alert-content">
                  <div className="alert-top-meta">
                    <span className="alert-category-tag">{item.unread ? "Unread" : "Archived"}</span>
                    <span className="alert-time">{item.time}</span>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>
                {item.unread && (
                  <button
                    className="table-action-btn"
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
                      );
                      notify("Notification marked as read.");
                    }}
                  >
                    Dismiss
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. EMPLOYEES VIEWS                                            */}
      {/* ------------------------------------------------------------- */}
      {activeMainTab === "Employees" && activeSubtab === "Employee List" && (
        <div>
          <div className="controls-bar">
            <div className="controls-left">
              <label className="table-search">
                <Search size={15} />
                <input
                  placeholder="Search by employee name, role, ID, or course..."
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                />
              </label>
              <label className="filter-select">
                <Filter size={14} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Employment Statuses</option>
                  <option value="Employed">Active Employed</option>
                  <option value="Apprentice">Apprentice / NAPS</option>
                  <option value="Self-employed">Contract / Freelance</option>
                </select>
                <ChevronDown size={14} />
              </label>
            </div>
            <div className="controls-right">
              <button
                className="button button-light"
                onClick={() => {
                  exportCsv("All_Employees_List.csv", allVisibleEmployees);
                  notify("Exported employee database as CSV.");
                }}
              >
                <Download size={15} /> Export CSV
              </button>
            </div>
          </div>

          <div className="styled-table-card">
            <div className="styled-table-head">
              <h3>Active Workforce Roster ({allVisibleEmployees.length})</h3>
            </div>
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Role & Dept</th>
                    <th>Joining Date</th>
                    <th>Monthly Wage</th>
                    <th>Tenure</th>
                    <th>Verification</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allVisibleEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setActiveSubtab("Employee Profile");
                      }}
                    >
                      <td>
                        <div className="table-person">
                          <span className="person-avatar sage">{emp.initials}</span>
                          <span>
                            <strong>{emp.name}</strong>
                            <small>{emp.id} • {emp.city}</small>
                          </span>
                        </div>
                      </td>
                      <td>
                        <strong>{emp.role || "Trainee"}</strong>
                        <br />
                        <small>{emp.department || "Operations"}</small>
                      </td>
                      <td>{emp.joiningDate || "12 Jan 2026"}</td>
                      <td><strong>{money(emp.wage)}</strong></td>
                      <td>{emp.retention || "6 months"}</td>
                      <td>
                        <span className={`badge-pill ${emp.verified ? "status-green" : "status-amber"}`}>
                          {emp.verified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="table-action-btn"
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setActiveSubtab("Employee Profile");
                            }}
                          >
                            Profile
                          </button>
                          <button
                            className="table-action-btn"
                            onClick={() => openUpdateModal(emp)}
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Employees" && activeSubtab === "Employee Profile" && selectedEmployee && (
        <div>
          <div className="styled-table-card" style={{ padding: "24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span className="profile-avatar" style={{ width: "64px", height: "64px", fontSize: "20px" }}>
                  {selectedEmployee.initials}
                </span>
                <div>
                  <h2 style={{ margin: "0 0 4px", fontFamily: "Manrope, sans-serif" }}>
                    {selectedEmployee.name}
                  </h2>
                  <p style={{ margin: "0", color: "#748477", fontSize: "12px" }}>
                    {selectedEmployee.role} • {selectedEmployee.department || "Engineering"} • {selectedEmployee.city}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="button button-light" onClick={() => openUpdateModal(selectedEmployee)}>
                  <Edit size={14} /> Edit Employment Details
                </button>
                <button className="button button-primary" onClick={() => openSalaryModal(selectedEmployee)}>
                  <WalletCards size={14} /> Log Salary Appraisal
                </button>
              </div>
            </div>

            <hr style={{ border: "0", borderTop: "1px solid #edf0ec", margin: "20px 0" }} />

            <div className="key-val-grid">
              <div className="key-val-pair">
                <label>Employee ID</label>
                <span>{selectedEmployee.id}</span>
              </div>
              <div className="key-val-pair">
                <label>Employment Status</label>
                <span>
                  <span className={`badge-pill ${selectedEmployee.verified ? "status-green" : "status-amber"}`}>
                    {selectedEmployee.status} ({selectedEmployee.verified ? "Verified" : "Pending"})
                  </span>
                </span>
              </div>
              <div className="key-val-pair">
                <label>Job Role</label>
                <span>{selectedEmployee.role}</span>
              </div>
              <div className="key-val-pair">
                <label>Department / Team</label>
                <span>{selectedEmployee.department || "Field Engineering"}</span>
              </div>
              <div className="key-val-pair">
                <label>Reporting Manager</label>
                <span>{selectedEmployee.manager || "Vikram Sen"}</span>
              </div>
              <div className="key-val-pair">
                <label>Date of Joining</label>
                <span>{selectedEmployee.joiningDate || "12 Jan 2026"}</span>
              </div>
              <div className="key-val-pair">
                <label>Contract Type</label>
                <span>{selectedEmployee.contractType || "Full-time Permanent"}</span>
              </div>
              <div className="key-val-pair">
                <label>Current Monthly Wage</label>
                <span style={{ color: "#286b49", fontWeight: "800", fontSize: "14px" }}>
                  {money(selectedEmployee.wage)}
                </span>
              </div>
              <div className="key-val-pair">
                <label>Training Background</label>
                <span>{selectedEmployee.course} ({selectedEmployee.provider})</span>
              </div>
              <div className="key-val-pair">
                <label>Certification</label>
                <span>{selectedEmployee.certId || "NSQF Level 4"}</span>
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <h4 style={{ margin: "0 0 10px", fontSize: "12px", textTransform: "uppercase", color: "#6a796e" }}>
                Verified Competencies & Skills
              </h4>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(selectedEmployee.skills || ["Solar Installation", "Electrical Safety", "Inverter Commissioning"]).map((sk) => (
                  <span key={sk} className="badge-pill status-blue" style={{ fontSize: "11px", padding: "5px 10px" }}>
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Employees" && activeSubtab === "Employment Status" && (
        <div>
          <div className="card-grid-3">
            <div className="stat-box">
              <span className="stat-box-title">Active Full-time</span>
              <div className="stat-box-val">{employerHires.filter((e) => e.status === "Employed").length}</div>
              <div className="stat-box-sub">Permanent on-roll employees</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Active Apprentices (NAPS)</span>
              <div className="stat-box-val">{employerHires.filter((e) => e.status === "Apprentice").length || 2}</div>
              <div className="stat-box-sub">Subsidized apprenticeship roles</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Probation Period (&lt;3 Mo)</span>
              <div className="stat-box-val">{employerHires.filter((e) => e.retentionMonths < 3).length || 1}</div>
              <div className="stat-box-sub">Under 90-day review</div>
            </div>
          </div>

          <div className="styled-table-card">
            <div className="styled-table-head">
              <h3>Status Distribution & Retention Tracking</h3>
            </div>
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Current Status</th>
                    <th>Contract Type</th>
                    <th>Retention Duration</th>
                    <th>Wage Tier</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employerHires.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <strong>{emp.name}</strong> ({emp.id})
                      </td>
                      <td>
                        <span className={`badge-pill ${emp.status === "Employed" ? "status-green" : "status-blue"}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td>{emp.contractType || "Full-time"}</td>
                      <td>{emp.retention}</td>
                      <td><strong>{money(emp.wage)}</strong></td>
                      <td>
                        <button
                          className="table-action-btn"
                          onClick={() => openUpdateModal(emp)}
                        >
                          Modify Status
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

      {activeMainTab === "Employees" && activeSubtab === "Job Role" && (
        <div>
          <div className="styled-table-card" style={{ padding: "20px" }}>
            <h3>Job Role & Skill Profile Mapping</h3>
            <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
              Alignment of skilling curricula to internal job descriptions at SunGrid Energy.
            </p>

            <div className="card-grid-3">
              {[
                { role: "Solar Technician", dept: "Field Engineering", count: 18, minWage: 17000, maxWage: 24000, skills: "Solar PV Modules, Inverters, Earthing" },
                { role: "Solar Installer", dept: "Rooftop Projects", count: 12, minWage: 16000, maxWage: 21000, skills: "Mounting, Cable Laying, Height Safety" },
                { role: "Operations Support Associate", dept: "Supply Chain & ERP", count: 8, minWage: 18000, maxWage: 26000, skills: "Advanced Excel, ERP Data, Tally" },
                { role: "EV Service Technician", dept: "Workshops", count: 6, minWage: 19000, maxWage: 28000, skills: "Battery Diagnostics, High Voltage Safety" },
                { role: "Patient Care Assistant", dept: "Healthcare Partner", count: 10, minWage: 18000, maxWage: 25000, skills: "Vitals, Hygiene, BLS Support" },
              ].map((jr) => (
                <div key={jr.role} className="stat-box">
                  <div className="stat-box-header">
                    <span className="stat-box-title">{jr.dept}</span>
                    <span className="badge-pill status-blue">{jr.count} Hired</span>
                  </div>
                  <h4 style={{ margin: "6px 0 2px", fontFamily: "Manrope, sans-serif" }}>{jr.role}</h4>
                  <div style={{ fontSize: "11px", color: "#286b49", fontWeight: "700" }}>
                    Band: {money(jr.minWage)} - {money(jr.maxWage)}
                  </div>
                  <div style={{ fontSize: "10px", color: "#839085", marginTop: "8px" }}>
                    <strong>Required Skills:</strong> {jr.skills}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Employees" && activeSubtab === "Joining Details" && (
        <div>
          <div className="styled-table-card">
            <div className="styled-table-head">
              <h3>Onboarding & Joining Register</h3>
              <button
                className="button button-light"
                onClick={() => {
                  exportCsv("Joining_Register.csv", employerHires);
                  notify("Joining register exported.");
                }}
              >
                <Download size={14} /> Export Register
              </button>
            </div>
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Reporting Manager</th>
                    <th>Department</th>
                    <th>Date of Joining</th>
                    <th>Probation Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employerHires.map((emp) => (
                    <tr key={emp.id}>
                      <td><code>{emp.id}</code></td>
                      <td><strong>{emp.name}</strong></td>
                      <td>{emp.manager || "Vikram Sen"}</td>
                      <td>{emp.department || "Operations"}</td>
                      <td>{emp.joiningDate || "12 Jan 2026"}</td>
                      <td>
                        <span className="badge-pill status-green">Confirmed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Employees" && activeSubtab === "Employment History" && (
        <div>
          <div className="styled-table-card" style={{ padding: "24px" }}>
            <h3>Workforce Progression & Appraisal Timeline</h3>
            <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
              Chronological log of role promotions, wage appraisals, and milestone achievements for skilling hires.
            </p>

            <div className="timeline-stepper">
              <div className="timeline-step-item">
                <div className="timeline-step-node completed">✓</div>
                <div className="timeline-step-content">
                  <h5>Aarav Mehta - Promoted to Senior Solar Technician</h5>
                  <p>Performance appraisal milestone passed. Monthly wage revised from ₹15,500 to ₹18,500 (+18%).</p>
                </div>
                <div className="timeline-step-date">15 Jun 2026</div>
              </div>

              <div className="timeline-step-item">
                <div className="timeline-step-node completed">✓</div>
                <div className="timeline-step-content">
                  <h5>Rohan Varma - Lead Installer Certification</h5>
                  <p>Successfully completed advanced grid-sync project with zero safety violations. Wage revised to ₹19,000.</p>
                </div>
                <div className="timeline-step-date">01 Sep 2026</div>
              </div>

              <div className="timeline-step-item">
                <div className="timeline-step-node completed">✓</div>
                <div className="timeline-step-content">
                  <h5>Ananya Deshmukh - Confirmed Full-time Operations Associate</h5>
                  <p>Accelerated probation confirmation due to exceptional performance in ERP supply chain tracking.</p>
                </div>
                <div className="timeline-step-date">15 Sep 2026</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. VERIFICATION VIEWS                                         */}
      {/* ------------------------------------------------------------- */}
      {activeMainTab === "Verification" && activeSubtab === "Pending Verification" && (
        <div>
          <div className="controls-bar">
            <h3>Pending Verifications Queue ({pendingVerificationList.length})</h3>
            <button
              className="button button-primary"
              onClick={() => {
                pendingVerificationList.forEach((p) => handleQuickVerify(p));
              }}
              disabled={pendingVerificationList.length === 0}
            >
              <CheckCircle2 size={15} /> Confirm All ({pendingVerificationList.length})
            </button>
          </div>

          <div className="styled-table-card">
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Course Completed</th>
                    <th>Training Center</th>
                    <th>Designation</th>
                    <th>Offered Wage</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingVerificationList.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div className="table-person">
                          <span className="person-avatar peach">{emp.initials}</span>
                          <span>
                            <strong>{emp.name}</strong>
                            <small>{emp.id}</small>
                          </span>
                        </div>
                      </td>
                      <td>{emp.course}</td>
                      <td>{emp.provider}</td>
                      <td><strong>{emp.role || "Trainee"}</strong></td>
                      <td><strong>{money(emp.wage || 18000)}</strong></td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="table-action-btn btn-primary-action"
                            onClick={() => handleQuickVerify(emp)}
                          >
                            <Check size={12} /> Confirm
                          </button>
                          <button
                            className="table-action-btn"
                            onClick={() => openVerifyModal(emp)}
                          >
                            Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingVerificationList.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                        All verification requests have been resolved!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Verification" && activeSubtab === "Verify Employment" && (
        <div>
          <div className="styled-table-card" style={{ padding: "24px" }}>
            <h3>Verify Employment Details</h3>
            <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
              Select a candidate from the pending list to review their placement terms and stamp official company verification.
            </p>

            {pendingVerificationList.length === 0 ? (
              <div className="info-callout callout-green">
                <CheckCircle2 size={20} />
                <div>
                  <strong>No Pending Verifications</strong>
                  <p>All candidates currently assigned to SunGrid Energy have been verified.</p>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {pendingVerificationList.map((cand) => (
                  <div key={cand.id} className="alert-item-card severity-medium">
                    <div className="alert-icon-box icon-medium">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="alert-content">
                      <div className="alert-top-meta">
                        <span className="alert-category-tag">{cand.course}</span>
                        <span className="alert-time">{cand.provider}</span>
                      </div>
                      <h4>{cand.name} (Trainee ID: {cand.id})</h4>
                      <p>
                        Candidate completed certification on <strong>{cand.trained}</strong> and reported joining as{" "}
                        <strong>{cand.role || "Solar Technician"}</strong> with monthly salary of <strong>{money(cand.wage || 18000)}</strong>.
                      </p>
                      <div className="alert-actions-row">
                        <button
                          className="button button-primary"
                          onClick={() => handleQuickVerify(cand)}
                        >
                          <Check size={14} /> One-Click Verification
                        </button>
                        <button
                          className="button button-light"
                          onClick={() => openVerifyModal(cand)}
                        >
                          <Edit size={14} /> Modify Role & Salary Before Verifying
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeMainTab === "Verification" && activeSubtab === "Update Employment Details" && (
        <div>
          <div className="styled-table-card" style={{ padding: "24px" }}>
            <h3>Update Employment Details Form</h3>
            <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
              Choose an employee to update job role, monthly wage, reporting manager, or contract status.
            </p>

            <div className="styled-table-card">
              <div className="table-wrap">
                <table className="trainee-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Current Role</th>
                      <th>Monthly Wage</th>
                      <th>Contract Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employerHires.map((emp) => (
                      <tr key={emp.id}>
                        <td><strong>{emp.name}</strong> ({emp.id})</td>
                        <td>{emp.role}</td>
                        <td><strong>{money(emp.wage)}</strong></td>
                        <td>{emp.contractType || "Full-time Permanent"}</td>
                        <td>
                          <button
                            className="button button-light"
                            style={{ fontSize: "10px", padding: "5px 10px" }}
                            onClick={() => openUpdateModal(emp)}
                          >
                            <Edit size={12} /> Edit Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Verification" && activeSubtab === "Verification History" && (
        <div>
          <div className="controls-bar">
            <h3>Verification Audit Trail ({verificationHistory.length})</h3>
            <button
              className="button button-light"
              onClick={() => {
                exportCsv("Verification_History_Audit.csv", verificationHistory);
                notify("Verification history exported as CSV.");
              }}
            >
              <Download size={14} /> Export Audit Log
            </button>
          </div>

          <div className="styled-table-card">
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Verification ID</th>
                    <th>Employee Name</th>
                    <th>Verified Role</th>
                    <th>Verified Wage</th>
                    <th>Verified By</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {verificationHistory.map((v) => (
                    <tr key={v.id}>
                      <td><code>{v.id}</code></td>
                      <td><strong>{v.name}</strong></td>
                      <td>{v.role}</td>
                      <td><strong>{money(v.wage)}</strong></td>
                      <td>{v.verifiedBy}</td>
                      <td>{v.verifiedAt}</td>
                      <td>
                        <span className="badge-pill status-green">✓ {v.status}</span>
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
      {/* 4. SALARY & RETENTION VIEWS                                  */}
      {/* ------------------------------------------------------------- */}
      {activeMainTab === "Salary & Retention" && activeSubtab === "Salary Details" && (
        <div>
          <div className="card-grid-3">
            <div className="stat-box">
              <span className="stat-box-title">Starting Monthly Wage</span>
              <div className="stat-box-val">₹16,000</div>
              <div className="stat-box-sub">Entry-level benchmark</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Median Current Wage</span>
              <div className="stat-box-val">₹19,450</div>
              <div className="stat-box-sub">+21% over baseline minimum</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Top 10% Wage Range</span>
              <div className="stat-box-val">₹24,500+</div>
              <div className="stat-box-sub">Senior technical roles</div>
            </div>
          </div>

          <div className="styled-table-card">
            <div className="styled-table-head">
              <h3>Salary Breakdown by Employee</h3>
              <button
                className="button button-light"
                onClick={() => {
                  exportCsv("Salary_Breakdown.csv", employerHires);
                  notify("Salary breakdown exported.");
                }}
              >
                <Download size={14} /> Export Salary CSV
              </button>
            </div>
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Designation</th>
                    <th>Starting Wage</th>
                    <th>Current Wage</th>
                    <th>Growth</th>
                    <th>Appraisal Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employerHires.map((emp) => (
                    <tr key={emp.id}>
                      <td><strong>{emp.name}</strong> ({emp.id})</td>
                      <td>{emp.role}</td>
                      <td>{money(emp.startingWage || 15500)}</td>
                      <td style={{ color: "#286b49", fontWeight: "800" }}>{money(emp.wage)}</td>
                      <td>
                        <span className="positive">
                          <TrendingUp size={12} /> +{emp.change || 18}%
                        </span>
                      </td>
                      <td>
                        <button
                          className="table-action-btn btn-primary-action"
                          onClick={() => openSalaryModal(emp)}
                        >
                          <WalletCards size={12} /> Update Wage
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

      {activeMainTab === "Salary & Retention" && activeSubtab === "Salary Updates" && (
        <div>
          <div className="styled-table-card" style={{ padding: "24px" }}>
            <h3>Log Salary Appraisal & Increment</h3>
            <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
              Record performance-based or cost-of-living salary hikes. Every update recalculates wage progression metrics.
            </p>

            <div className="styled-table-card">
              <div className="table-wrap">
                <table className="trainee-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Current Wage</th>
                      <th>Tenure</th>
                      <th>Last Appraisal Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employerHires.map((emp) => (
                      <tr key={emp.id}>
                        <td><strong>{emp.name}</strong></td>
                        <td><strong>{money(emp.wage)}</strong></td>
                        <td>{emp.retention}</td>
                        <td>{emp.appraisalHistory?.[emp.appraisalHistory.length - 1]?.date || "15 Jun 2026"}</td>
                        <td>
                          <button
                            className="button button-primary"
                            style={{ fontSize: "11px", padding: "6px 12px" }}
                            onClick={() => openSalaryModal(emp)}
                          >
                            <Plus size={13} /> Log Increment
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Salary & Retention" && activeSubtab === "Job Retention" && (
        <div>
          <div className="card-grid-2">
            <div className="styled-table-card" style={{ padding: "20px" }}>
              <h3>Workforce Retention Milestones</h3>
              <p style={{ fontSize: "11px", color: "#748476", marginBottom: "16px" }}>
                Active tracking across critical milestone thresholds.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span>Passed 3-Month Mark</span>
                    <strong>89.4% (42/47)</strong>
                  </div>
                  <div className="custom-progress">
                    <div className="custom-progress-bar" style={{ width: "89.4%" }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span>Passed 6-Month Mark</span>
                    <strong>82.4% (38/47)</strong>
                  </div>
                  <div className="custom-progress">
                    <div className="custom-progress-bar bar-blue" style={{ width: "82.4%" }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span>Passed 12-Month Mark</span>
                    <strong>74.6% (35/47)</strong>
                  </div>
                  <div className="custom-progress">
                    <div className="custom-progress-bar bar-amber" style={{ width: "74.6%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="styled-table-card" style={{ padding: "20px" }}>
              <h3>Retention Intervention Triggers</h3>
              <p style={{ fontSize: "11px", color: "#748476", marginBottom: "16px" }}>
                Early indicators to prevent voluntary attrition in technical field roles.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="info-callout callout-blue">
                  <div>
                    <strong>90-Day Follow-up Survey</strong>
                    <p>88% of trainees who received a 90-day check-in remained employed past month six.</p>
                  </div>
                </div>
                <div className="info-callout callout-green">
                  <div>
                    <strong>Upskilling Pathways</strong>
                    <p>Offering micro-certifications increased 1-year retention by +14.2%.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Salary & Retention" && activeSubtab === "Employee Progress" && (
        <div>
          <div className="styled-table-card" style={{ padding: "24px" }}>
            <h3>Employee Progress & Career Advancement Matrix</h3>
            <div className="styled-table-card" style={{ marginTop: "16px" }}>
              <div className="table-wrap">
                <table className="trainee-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Starting Role</th>
                      <th>Current Role</th>
                      <th>Cumulative Wage Increase</th>
                      <th>Appraisal History</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employerHires.map((emp) => (
                      <tr key={emp.id}>
                        <td><strong>{emp.name}</strong> ({emp.id})</td>
                        <td>Junior Trainee</td>
                        <td><strong>{emp.role}</strong></td>
                        <td style={{ color: "#286b49", fontWeight: "700" }}>
                          +{emp.change || 18}% ({money(emp.wage - (emp.startingWage || 15500))})
                        </td>
                        <td>
                          <button
                            className="table-action-btn"
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setActiveSubtab("Employee Profile");
                            }}
                          >
                            View Appraisals ({emp.appraisalHistory?.length || 2})
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. REPORTS VIEWS                                              */}
      {/* ------------------------------------------------------------- */}
      {activeMainTab === "Reports" && (
        <div>
          <div className="controls-bar">
            <h3>{activeSubtab}</h3>
            <div className="controls-right">
              <button
                className="button button-primary"
                onClick={() => {
                  exportCsv(`${activeSubtab.replace(/ /g, "_")}_Export.csv", employerHires);
                  notify(`${activeSubtab} generated and downloaded as CSV.`);
                }}
              >
                <Download size={15} /> Download Full {activeSubtab} CSV
              </button>
            </div>
          </div>

          <div className="card-grid-4">
            <div className="stat-box">
              <span className="stat-box-title">Total Hires</span>
              <div className="stat-box-val">486</div>
              <div className="stat-box-sub">All skilling cohorts</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Retention Rate</span>
              <div className="stat-box-val">82.4%</div>
              <div className="stat-box-sub">At 6 months</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Median Starting</span>
              <div className="stat-box-val">₹16,500</div>
              <div className="stat-box-sub">Initial placement</div>
            </div>
            <div className="stat-box">
              <span className="stat-box-title">Current Median</span>
              <div className="stat-box-val">₹19,450</div>
              <div className="stat-box-sub">After appraisals</div>
            </div>
          </div>

          <div className="styled-table-card">
            <div className="styled-table-head">
              <h3>{activeSubtab} Dataset</h3>
            </div>
            <div className="table-wrap">
              <table className="trainee-table">
                <thead>
                  <tr>
                    <th>Candidate ID</th>
                    <th>Full Name</th>
                    <th>Job Role</th>
                    <th>Department</th>
                    <th>Partner Institution</th>
                    <th>Starting Wage</th>
                    <th>Current Wage</th>
                    <th>Retention Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {employerHires.map((emp) => (
                    <tr key={emp.id}>
                      <td><code>{emp.id}</code></td>
                      <td><strong>{emp.name}</strong></td>
                      <td>{emp.role}</td>
                      <td>{emp.department || "Operations"}</td>
                      <td>{emp.provider}</td>
                      <td>{money(emp.startingWage || 15500)}</td>
                      <td><strong>{money(emp.wage)}</strong></td>
                      <td>{emp.retention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. PROFILE & SETTINGS VIEWS                                   */}
      {/* ------------------------------------------------------------- */}
      {activeMainTab === "Profile & Settings" && activeSubtab === "Company Profile" && (
        <div className="styled-table-card" style={{ padding: "24px" }}>
          <h3>Company Profile Details</h3>
          <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
            Official corporate entity information recognized by the National Skill Development Corporation (NSDC).
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              notify("Company profile changes saved successfully.");
            }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="card-grid-2">
              <div className="input-field-group">
                <label>Company Legal Name</label>
                <input
                  value={companyDetails.name}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>Corporate Identity Number (CIN)</label>
                <input
                  value={companyDetails.cin}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, cin: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>Industry Sector</label>
                <input
                  value={companyDetails.sector}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, sector: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>Official Website</label>
                <input
                  value={companyDetails.website}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, website: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group" style={{ gridColumn: "1 / -1" }}>
                <label>Headquarters Address</label>
                <textarea
                  value={companyDetails.headquarters}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, headquarters: e.target.value })}
                  rows={2}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="button button-primary">
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {activeMainTab === "Profile & Settings" && activeSubtab === "Contact Details" && (
        <div className="styled-table-card" style={{ padding: "24px" }}>
          <h3>Nodal Officer & Key Contacts</h3>
          <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
            Authorized contact personnel for government scheme verification and institutional partner coordination.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              notify("Contact details updated successfully.");
            }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="card-grid-2">
              <div className="input-field-group">
                <label>Nodal Officer Name</label>
                <input
                  value={companyDetails.nodalOfficer}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, nodalOfficer: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>Designation</label>
                <input
                  value={companyDetails.designation}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, designation: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>Official Work Email</label>
                <input
                  type="email"
                  value={companyDetails.email}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>Direct Phone Number</label>
                <input
                  value={companyDetails.phone}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="button button-primary">
                Save Contact Information
              </button>
            </div>
          </form>
        </div>
      )}

      {activeMainTab === "Profile & Settings" && activeSubtab === "Account Settings" && (
        <div className="styled-table-card" style={{ padding: "24px" }}>
          <h3>Account & Security Settings</h3>
          <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
            Manage authentication preferences, email notifications, and portal access credentials.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="setting-row">
              <span>
                <strong>Two-Factor Authentication (2FA)</strong>
                <small>Enforce SMS / Authenticator OTP for all employer portal sign-ins.</small>
              </span>
              <button
                className={`toggle ${companySettings.twoFactorAuth ? "toggle-on" : ""}`}
                onClick={() => {
                  setCompanySettings({ ...companySettings, twoFactorAuth: !companySettings.twoFactorAuth });
                  notify(`2FA ${!companySettings.twoFactorAuth ? "Enabled" : "Disabled"}.`);
                }}
              >
                <i />
              </button>
            </div>

            <div className="setting-row">
              <span>
                <strong>Email Alerts on New Verification Requests</strong>
                <small>Receive instantaneous notifications when a training partner reports a new placement.</small>
              </span>
              <button
                className={`toggle ${companySettings.emailAlerts ? "toggle-on" : ""}`}
                onClick={() => {
                  setCompanySettings({ ...companySettings, emailAlerts: !companySettings.emailAlerts });
                  notify(`Email alerts ${!companySettings.emailAlerts ? "Enabled" : "Disabled"}.`);
                }}
              >
                <i />
              </button>
            </div>

            <div className="setting-row">
              <span>
                <strong>Weekly Retention Digest</strong>
                <small>Receive automated PDF summary of active cohort retention rates every Monday.</small>
              </span>
              <button
                className={`toggle ${companySettings.weeklyDigest ? "toggle-on" : ""}`}
                onClick={() => {
                  setCompanySettings({ ...companySettings, weeklyDigest: !companySettings.weeklyDigest });
                  notify(`Weekly digest ${!companySettings.weeklyDigest ? "Enabled" : "Disabled"}.`);
                }}
              >
                <i />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "Profile & Settings" && activeSubtab === "Privacy / Permissions" && (
        <div className="styled-table-card" style={{ padding: "24px" }}>
          <h3>Privacy, Consent & Data Permissions</h3>
          <p style={{ fontSize: "11px", color: "#748476", marginBottom: "20px" }}>
            Control data sharing policies in compliance with India's Digital Personal Data Protection (DPDP) Act 2023.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="setting-row">
              <span>
                <strong>Require Trainee Digital Consent Prior to Verification</strong>
                <small>Only permit employment confirmation if candidate has an active signed consent record.</small>
              </span>
              <button
                className={`toggle ${companySettings.consentEnforced ? "toggle-on" : ""}`}
                onClick={() => {
                  setCompanySettings({ ...companySettings, consentEnforced: !companySettings.consentEnforced });
                  notify("Consent enforcement setting updated.");
                }}
              >
                <i />
              </button>
            </div>

            <div className="setting-row">
              <span>
                <strong>Mask PII in Government Export Reports</strong>
                <small>Hide candidate full mobile numbers and Aadhaar references in exported analytical files.</small>
              </span>
              <button
                className={`toggle ${companySettings.maskPiiInGovtExports ? "toggle-on" : ""}`}
                onClick={() => {
                  setCompanySettings({ ...companySettings, maskPiiInGovtExports: !companySettings.maskPiiInGovtExports });
                  notify("PII masking preference saved.");
                }}
              >
                <i />
              </button>
            </div>

            <div className="setting-row">
              <span>
                <strong>Third-Party Compliance Audit Access</strong>
                <small>Allow authorized state auditor credentials read-only view of verified employment timestamps.</small>
              </span>
              <button
                className={`toggle ${companySettings.thirdPartyAuditAccess ? "toggle-on" : ""}`}
                onClick={() => {
                  setCompanySettings({ ...companySettings, thirdPartyAuditAccess: !companySettings.thirdPartyAuditAccess });
                  notify("Third-party audit access permission saved.");
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

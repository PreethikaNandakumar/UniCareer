/* ============================================================
   UniCareer — API Helper
   ------------------------------------------------------------
   Handles:
     1. Session management (login/logout)
     2. Saving student data to Google Sheets (via Apps Script)
     3. Retrieving student data from Google Sheets
     4. Running the local rule-based matching engine to
        auto-compute career matches, skill gaps, and roadmap
   ============================================================ */

import { computeProfile, getAllSubjects, getAllCareers, getSkillsForSubject, getRequirementsForCareer } from '../data/matching-engine.js';

/* ============================================================
   >>> PASTE YOUR APPS SCRIPT WEB APP URL BELOW <<<
   (See SETUP_GUIDE.md for how to create and deploy it)
   ============================================================ */
const API_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL";

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";

const UniCareerAPI = (() => {

  /* ---------- Session management ---------- */
  function currentEmail() {
    return sessionStorage.getItem("uc_email") || "";
  }

  function setSession(email, name) {
    sessionStorage.setItem("uc_email", email);
    if (name) sessionStorage.setItem("uc_name", name);
  }

  function clearSession() {
    sessionStorage.removeItem("uc_email");
    sessionStorage.removeItem("uc_name");
  }

  function isConfigured() {
    return API_URL && API_URL.indexOf("YOUR_APPS_SCRIPT_WEB_APP_URL") === -1;
  }

  /* ---------- Google Apps Script communication ---------- */
  // Apps Script Web Apps only reliably accept simple GET/POST requests
  // without custom headers (to avoid a CORS pre-flight OPTIONS request),
  // so we send POST bodies as text/plain and JSON-encode everything.

  async function callAppsScript(action, data) {
    if (!isConfigured()) {
      throw new Error("Apps Script URL not configured. Open src/api/api.js and paste your Web App URL into API_URL. See SETUP_GUIDE.md for instructions.");
    }
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, data })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Request failed.");
    return json;
  }

  async function getStudent(email) {
    if (!isConfigured()) {
      throw new Error("Apps Script URL not configured. See SETUP_GUIDE.md.");
    }
    const res = await fetch(`${API_URL}?action=getStudent&email=${encodeURIComponent(email)}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to load data.");
    return json.data; // null if not found
  }

  async function saveStudent(payload) {
    return callAppsScript("saveStudent", payload);
  }

  async function saveProfile(payload) {
    return callAppsScript("saveProfile", payload);
  }

  async function updateRoadmapProgress(email, progress) {
    return callAppsScript("updateRoadmapProgress", { email, progress });
  }

  async function updateRoadmapStep(email, stepIndex, status) {
    return callAppsScript("updateRoadmapStep", { email, stepIndex, status });
  }

  async function getAllStudents() {
    if (!isConfigured()) {
      throw new Error("Apps Script URL not configured. See SETUP_GUIDE.md.");
    }
    const res = await fetch(`${API_URL}?action=getAllStudents`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to load data.");
    return json.data;
  }

  /* ---------- Local computation (the "brain") ---------- */
  // This runs entirely in the browser using the predefined
  // knowledge base — no server round-trip needed for computation.

  function computeStudentProfile(studentData) {
    return computeProfile(studentData);
  }

  function listAllSubjects() {
    return getAllSubjects();
  }

  function listAllCareers() {
    return getAllCareers();
  }

  function skillsForSubject(subjectName) {
    return getSkillsForSubject(subjectName);
  }

  function requirementsForCareer(careerName) {
    return getRequirementsForCareer(careerName);
  }

  return {
    currentEmail,
    setSession,
    clearSession,
    isConfigured,
    // Apps Script calls
    saveStudent,
    saveProfile,
    getStudent,
    getAllStudents,
    updateRoadmapProgress,
    updateRoadmapStep,
    // Local computation
    computeStudentProfile,
    listAllSubjects,
    listAllCareers,
    skillsForSubject,
    requirementsForCareer,
    // Constants
    SPREADSHEET_ID,
    API_URL,
  };
})();

export default UniCareerAPI;

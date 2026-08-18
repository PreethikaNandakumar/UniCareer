/* ============================================================
   UniCareer — Google Apps Script Backend (Code.gs)
   ------------------------------------------------------------
   This script runs inside a Google Sheets project and acts as
   the database + API for the UniCareer web app.

   Sheets required:
     Students, Subjects, SubjectSkills, StudentSkills,
     Careers, CareerSkills, Projects, Roadmaps, Progress

   Deploy as a Web App (Executions: Me, Access: Anyone)
   to get a URL to paste into the website's api.js.
   ============================================================ */

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";

/* ============================================================
   SHEET HEADER DEFINITIONS
   ============================================================ */

const SHEET_HEADERS = {
  Students:        ["email", "studentName", "university", "degree", "currentSemester", "roadmapProgress", "createdAt", "updatedAt"],
  Subjects:        ["subjectName", "code", "credits"],
  SubjectSkills:   ["subjectName", "skill", "level"],
  StudentSkills:   ["email", "skill", "level", "category"],
  Careers:         ["careerName", "description"],
  CareerSkills:    ["careerName", "skill", "requiredLevel"],
  Projects:        ["email", "projectName", "description", "skillsUsed"],
  Roadmaps:        ["email", "skill", "stage", "step", "status", "priority"],
  Progress:        ["email", "stepIndex", "status", "updatedAt"],
};

/* ============================================================
   ENTRY POINTS — doGet / doPost
   ============================================================ */

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || "";
    var result;

    switch (action) {
      case "getStudent":
        result = getStudent(e.parameter.email);
        break;
      case "getAllStudents":
        result = getAllStudents();
        break;
      case "getSubjects":
        result = getSubjects();
        break;
      case "getSubjectSkills":
        result = getSubjectSkills();
        break;
      case "getCareers":
        result = getCareers();
        break;
      case "getCareerSkills":
        result = getCareerSkills();
        break;
      default:
        return jsonOut({ success: false, error: "Unknown action: " + action });
    }

    return jsonOut({ success: true, data: result });
  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var data = body.data;
    var result;

    switch (action) {
      case "saveStudent":
        saveStudent(data);
        result = { saved: true };
        break;
      case "saveProfile":
        saveProfile(data);
        result = { saved: true };
        break;
      case "updateRoadmapProgress":
        updateRoadmapProgress(data.email, data.progress);
        result = { updated: true };
        break;
      case "updateRoadmapStep":
        updateRoadmapStep(data.email, data.stepIndex, data.status);
        result = { updated: true };
        break;
      default:
        return jsonOut({ success: false, error: "Unknown action: " + action });
    }

    return jsonOut({ success: true, data: result });
  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

/* ============================================================
   JSON OUTPUT HELPER
   ============================================================ */

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ============================================================
   SHEET HELPERS
   ============================================================ */

function ss() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet(name) {
  var spreadsheet = ss();
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    var headers = SHEET_HEADERS[name] || [];
    if (headers.length) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function sheetToObjects(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    rows.push(obj);
  }
  return rows;
}

function findRowByEmail(sheet, email) {
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === email) return i + 1; // 1-indexed
  }
  return -1;
}

function clearRowsByEmail(sheet, email, emailCol) {
  emailCol = emailCol || 1;
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return;
  var rowsToDelete = [];
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][emailCol - 1] === email) {
      sheet.deleteRow(i + 1);
    }
  }
}

/* ============================================================
   STUDENT OPERATIONS
   ============================================================ */

function getStudent(email) {
  if (!email) return null;

  var studentSheet = getSheet("Students");
  var rowNum = findRowByEmail(studentSheet, email);
  if (rowNum === -1) return null;

  var headers = studentSheet.getRange(1, 1, 1, studentSheet.getLastColumn()).getValues()[0];
  var rowData = studentSheet.getRange(rowNum, 1, 1, headers.length).getValues()[0];
  var student = {};
  for (var i = 0; i < headers.length; i++) {
    student[headers[i]] = rowData[i];
  }

  // Load related data
  student.completedSubjects = getStudentSubjects(email);
  student.currentSkills = getStudentSkills(email);
  student.projects = getStudentProjects(email);
  student.learningRoadmap = getStudentRoadmap(email);
  student.careerInterests = student.careerInterests ? String(student.careerInterests).split(",").map(function(s){return s.trim();}).filter(Boolean) : [];
  student.careerMatches = student.careerMatches ? JSON.parse(student.careerMatches) : [];
  student.skillGaps = student.skillGaps ? JSON.parse(student.skillGaps) : [];

  return student;
}

function getStudentSubjects(email) {
  // For this prototype, subjects are stored as part of the student record
  // (completedSubjects column with JSON). If you prefer a separate sheet,
  // you can adapt this to read from a StudentSubjects sheet.
  var sheet = getSheet("Students");
  var rowNum = findRowByEmail(sheet, email);
  if (rowNum === -1) return [];
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var colIdx = headers.indexOf("completedSubjects");
  if (colIdx === -1) return [];
  var raw = sheet.getRange(rowNum, colIdx + 1).getValue();
  return raw ? JSON.parse(raw) : [];
}

function getStudentSkills(email) {
  var sheet = getSheet("StudentSkills");
  var allRows = sheetToObjects(sheet);
  return allRows.filter(function(r) { return r.email === email; });
}

function getStudentProjects(email) {
  var sheet = getSheet("Projects");
  var allRows = sheetToObjects(sheet);
  return allRows.filter(function(r) { return r.email === email; }).map(function(r){
    return { name: r.projectName, description: r.description, skills: r.skillsUsed };
  });
}

function getStudentRoadmap(email) {
  var sheet = getSheet("Roadmaps");
  var allRows = sheetToObjects(sheet);
  return allRows.filter(function(r) { return r.email === email; }).map(function(r){
    return { skill: r.skill, stage: r.stage, step: r.step, status: r.status, priority: r.priority };
  });
}

/* ============================================================
   SAVE STUDENT (full profile, called from website)
   ============================================================ */

function saveStudent(data) {
  var sheet = getSheet("Students");
  var now = new Date().toISOString();
  var rowNum = findRowByEmail(sheet, data.email);

  var completedSubjects = data.completedSubjects || [];
  var currentSkills = data.currentSkills || [];
  var projects = data.projects || [];
  var careerInterests = data.careerInterests || [];
  var careerMatches = data.careerMatches || [];
  var skillGaps = data.skillGaps || [];
  var learningRoadmap = data.learningRoadmap || [];
  var roadmapProgress = data.roadmapProgress || 0;

  var rowData = [
    data.email,
    data.studentName || "",
    data.university || "",
    data.degree || "",
    data.currentSemester || "",
    roadmapProgress,
    JSON.stringify(completedSubjects),
    JSON.stringify(careerInterests),
    JSON.stringify(careerMatches),
    JSON.stringify(skillGaps),
    JSON.stringify(learningRoadmap),
    rowNum === -1 ? now : "",
    now
  ];

  // Ensure headers match
  var headers = SHEET_HEADERS.Students.concat(["completedSubjects", "careerInterests", "careerMatches", "skillGaps", "learningRoadmap"]);
  if (sheet.getLastColumn() < headers.length) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
  }

  if (rowNum === -1) {
    sheet.appendRow(rowData);
  } else {
    sheet.getRange(rowNum, 1, 1, rowData.length).setValues([rowData]);
  }

  // Save student skills
  clearRowsByEmail(getSheet("StudentSkills"), data.email);
  var skillsSheet = getSheet("StudentSkills");
  currentSkills.forEach(function(sk) {
    skillsSheet.appendRow([data.email, sk.skill, sk.level || 0, sk.category || "Technical"]);
  });

  // Save projects
  clearRowsByEmail(getSheet("Projects"), data.email);
  var projectsSheet = getSheet("Projects");
  projects.forEach(function(p) {
    projectsSheet.appendRow([data.email, p.name || "", p.description || "", p.skills || ""]);
  });

  // Save roadmap
  clearRowsByEmail(getSheet("Roadmaps"), data.email);
  var roadmapSheet = getSheet("Roadmaps");
  learningRoadmap.forEach(function(r) {
    roadmapSheet.appendRow([data.email, r.skill || "", r.stage || "", r.step || "", r.status || "Upcoming", r.priority || "Low"]);
  });
}

/* ============================================================
   SAVE PROFILE (alias for saveStudent)
   ============================================================ */

function saveProfile(data) {
  saveStudent(data);
}

/* ============================================================
   UPDATE ROADMAP PROGRESS
   ============================================================ */

function updateRoadmapProgress(email, progress) {
  var sheet = getSheet("Students");
  var rowNum = findRowByEmail(sheet, email);
  if (rowNum === -1) return;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var colIdx = headers.indexOf("roadmapProgress");
  if (colIdx === -1) return;
  sheet.getRange(rowNum, colIdx + 1).setValue(progress);
}

function updateRoadmapStep(email, stepIndex, status) {
  var sheet = getSheet("Roadmaps");
  var allRows = sheetToObjects(sheet);
  var emailRows = [];
  for (var i = 1; i < sheet.getLastRow(); i++) {
    if (sheet.getRange(i + 1, 1).getValue() === email) {
      emailRows.push(i + 1);
    }
  }
  if (stepIndex < emailRows.length) {
    var rowNum = emailRows[stepIndex];
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var colIdx = headers.indexOf("status");
    if (colIdx !== -1) {
      sheet.getRange(rowNum, colIdx + 1).setValue(status);
    }
  }
}

/* ============================================================
   GET ALL STUDENTS
   ============================================================ */

function getAllStudents() {
  var sheet = getSheet("Students");
  return sheetToObjects(sheet);
}

/* ============================================================
   KNOWLEDGE BASE — Subjects, Skills, Careers
   ============================================================ */

function getSubjects() {
  return sheetToObjects(getSheet("Subjects"));
}

function getSubjectSkills() {
  return sheetToObjects(getSheet("SubjectSkills"));
}

function getCareers() {
  return sheetToObjects(getSheet("Careers"));
}

function getCareerSkills() {
  return sheetToObjects(getSheet("CareerSkills"));
}

/* ============================================================
   SETUP — Run this function ONCE to create all sheets
   with headers and sample data.
   ============================================================ */

function setupSheets() {
  // Create all sheets with headers
  Object.keys(SHEET_HEADERS).forEach(function(name) {
    var sheet = getSheet(name);
    var headers = SHEET_HEADERS[name];
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  });

  // Add Students headers (extended)
  var studentSheet = getSheet("Students");
  var studentHeaders = SHEET_HEADERS.Students.concat(["completedSubjects", "careerInterests", "careerMatches", "skillGaps", "learningRoadmap"]);
  studentSheet.clear();
  studentSheet.getRange(1, 1, 1, studentHeaders.length).setValues([studentHeaders]).setFontWeight("bold");
  studentSheet.setFrozenRows(1);

  // --- Sample data: Subjects ---
  var subjectsSheet = getSheet("Subjects");
  var subjectsData = [
    ["Data Structures", "CS201", 4],
    ["Algorithms", "CS301", 4],
    ["Database Management Systems", "CS305", 3],
    ["Object Oriented Programming", "CS204", 4],
    ["Software Engineering", "CS401", 3],
    ["Web Development", "CS310", 3],
    ["Data Communication and Networks", "CS306", 3],
    ["Operating Systems", "CS308", 3],
    ["Information Systems Analysis and Design", "IS201", 3],
    ["Data Analytics", "DS401", 3],
    ["Machine Learning", "DS405", 3],
    ["Artificial Intelligence", "DS410", 3],
    ["Human Computer Interaction", "IS305", 3],
    ["Project Management", "IS401", 3],
    ["Cybersecurity", "CS415", 3],
    ["Cloud Computing", "CS412", 3],
    ["Mobile Application Development", "CS311", 3],
    ["Statistics for Computing", "MA201", 3],
    ["Discrete Mathematics", "MA101", 3],
    ["Business Process Management", "IS306", 3],
    ["Enterprise Systems", "IS402", 3],
    ["IT Project Management", "IS405", 3],
    ["Data Mining", "DS406", 3],
    ["Big Data Analytics", "DS411", 3],
  ];
  subjectsData.forEach(function(row) { subjectsSheet.appendRow(row); });

  // --- Sample data: SubjectSkills ---
  var ssSheet = getSheet("SubjectSkills");
  var ssData = [
    ["Data Structures", "Algorithms", 70],
    ["Data Structures", "Java", 65],
    ["Data Structures", "Problem Solving", 60],
    ["Algorithms", "Algorithms", 85],
    ["Algorithms", "Problem Solving", 75],
    ["Algorithms", "Computational Thinking", 70],
    ["Database Management Systems", "SQL", 75],
    ["Database Management Systems", "Database Design", 70],
    ["Database Management Systems", "Data Modeling", 65],
    ["Object Oriented Programming", "Java", 75],
    ["Object Oriented Programming", "OOP Concepts", 80],
    ["Object Oriented Programming", "Software Design", 60],
    ["Software Engineering", "Software Design", 70],
    ["Software Engineering", "UML Modeling", 65],
    ["Software Engineering", "Project Management", 60],
    ["Software Engineering", "Git Version Control", 55],
    ["Web Development", "HTML & CSS", 80],
    ["Web Development", "JavaScript", 70],
    ["Web Development", "REST APIs", 60],
    ["Data Communication and Networks", "Computer Networks", 70],
    ["Data Communication and Networks", "Network Security", 55],
    ["Operating Systems", "Operating Systems", 70],
    ["Operating Systems", "System Design", 55],
    ["Information Systems Analysis and Design", "Requirements Engineering", 75],
    ["Information Systems Analysis and Design", "UML Modeling", 70],
    ["Information Systems Analysis and Design", "Business Analysis", 65],
    ["Data Analytics", "Data Analysis", 75],
    ["Data Analytics", "Python", 65],
    ["Data Analytics", "Data Visualization", 60],
    ["Machine Learning", "Machine Learning", 70],
    ["Machine Learning", "Python", 75],
    ["Machine Learning", "Statistics", 65],
    ["Artificial Intelligence", "Artificial Intelligence", 70],
    ["Artificial Intelligence", "Problem Solving", 75],
    ["Artificial Intelligence", "Python", 70],
    ["Human Computer Interaction", "UI/UX Design", 70],
    ["Human Computer Interaction", "User Research", 60],
    ["Human Computer Interaction", "Prototyping", 55],
    ["Project Management", "Project Management", 80],
    ["Project Management", "Agile Methodologies", 70],
    ["Project Management", "Team Leadership", 60],
    ["Cybersecurity", "Network Security", 75],
    ["Cybersecurity", "Cryptography", 65],
    ["Cybersecurity", "Risk Assessment", 60],
    ["Cloud Computing", "Cloud Platforms (AWS/Azure)", 65],
    ["Cloud Computing", "DevOps", 55],
    ["Cloud Computing", "System Design", 60],
    ["Mobile Application Development", "Mobile Development", 70],
    ["Mobile Application Development", "Java", 65],
    ["Mobile Application Development", "UI/UX Design", 55],
    ["Statistics for Computing", "Statistics", 75],
    ["Statistics for Computing", "Data Analysis", 60],
    ["Discrete Mathematics", "Computational Thinking", 70],
    ["Discrete Mathematics", "Problem Solving", 65],
    ["Business Process Management", "Business Analysis", 75],
    ["Business Process Management", "Process Modeling", 65],
    ["Business Process Management", "Project Management", 55],
    ["Enterprise Systems", "ERP Systems", 65],
    ["Enterprise Systems", "Business Analysis", 60],
    ["Enterprise Systems", "Database Design", 55],
    ["IT Project Management", "Project Management", 80],
    ["IT Project Management", "Agile Methodologies", 75],
    ["IT Project Management", "Risk Management", 65],
    ["Data Mining", "Data Mining", 70],
    ["Data Mining", "Python", 65],
    ["Data Mining", "Statistics", 60],
    ["Big Data Analytics", "Big Data", 65],
    ["Big Data Analytics", "Data Analysis", 70],
    ["Big Data Analytics", "Python", 65],
  ];
  ssData.forEach(function(row) { ssSheet.appendRow(row); });

  // --- Sample data: Careers ---
  var careersSheet = getSheet("Careers");
  var careersData = [
    ["Business Analyst", "Bridges business needs and IT solutions"],
    ["Data Analyst", "Analyzes data to drive business decisions"],
    ["Software Engineer", "Designs and builds software systems"],
    ["Full Stack Developer", "Builds end-to-end web applications"],
    ["Data Scientist", "Uses ML and statistics to extract insights"],
    ["Machine Learning Engineer", "Builds and deploys ML models"],
    ["UI/UX Designer", "Designs user-centered interfaces"],
    ["Project Manager (IT)", "Leads IT projects to delivery"],
    ["Cybersecurity Analyst", "Protects systems from threats"],
    ["Cloud Solutions Architect", "Designs cloud infrastructure"],
    ["Database Administrator", "Manages and optimizes databases"],
    ["Mobile App Developer", "Builds mobile applications"],
    ["IT Consultant", "Advises organizations on IT strategy"],
    ["Data Engineer", "Builds data pipelines and infrastructure"],
  ];
  careersData.forEach(function(row) { careersSheet.appendRow(row); });

  // --- Sample data: CareerSkills ---
  var csSheet = getSheet("CareerSkills");
  var csData = [
    ["Business Analyst", "Business Analysis", 75],
    ["Business Analyst", "Requirements Engineering", 70],
    ["Business Analyst", "UML Modeling", 65],
    ["Business Analyst", "SQL", 60],
    ["Business Analyst", "Data Visualization", 60],
    ["Business Analyst", "Project Management", 55],
    ["Data Analyst", "Data Analysis", 75],
    ["Data Analyst", "SQL", 70],
    ["Data Analyst", "Python", 65],
    ["Data Analyst", "Data Visualization", 70],
    ["Data Analyst", "Statistics", 60],
    ["Software Engineer", "Java", 75],
    ["Software Engineer", "Algorithms", 70],
    ["Software Engineer", "Software Design", 70],
    ["Software Engineer", "Git Version Control", 65],
    ["Software Engineer", "OOP Concepts", 75],
    ["Software Engineer", "Problem Solving", 70],
    ["Full Stack Developer", "JavaScript", 75],
    ["Full Stack Developer", "HTML & CSS", 75],
    ["Full Stack Developer", "REST APIs", 70],
    ["Full Stack Developer", "Database Design", 65],
    ["Full Stack Developer", "Git Version Control", 65],
    ["Full Stack Developer", "Python", 60],
    ["Data Scientist", "Machine Learning", 75],
    ["Data Scientist", "Python", 80],
    ["Data Scientist", "Statistics", 70],
    ["Data Scientist", "Data Analysis", 70],
    ["Data Scientist", "Data Mining", 65],
    ["Machine Learning Engineer", "Machine Learning", 80],
    ["Machine Learning Engineer", "Python", 80],
    ["Machine Learning Engineer", "Algorithms", 70],
    ["Machine Learning Engineer", "Statistics", 65],
    ["Machine Learning Engineer", "Artificial Intelligence", 70],
    ["UI/UX Designer", "UI/UX Design", 80],
    ["UI/UX Designer", "User Research", 70],
    ["UI/UX Designer", "Prototyping", 75],
    ["UI/UX Designer", "HTML & CSS", 55],
    ["UI/UX Designer", "Problem Solving", 55],
    ["Project Manager (IT)", "Project Management", 80],
    ["Project Manager (IT)", "Agile Methodologies", 75],
    ["Project Manager (IT)", "Team Leadership", 70],
    ["Project Manager (IT)", "Risk Management", 65],
    ["Project Manager (IT)", "Business Analysis", 60],
    ["Cybersecurity Analyst", "Network Security", 75],
    ["Cybersecurity Analyst", "Cryptography", 65],
    ["Cybersecurity Analyst", "Risk Assessment", 70],
    ["Cybersecurity Analyst", "Operating Systems", 60],
    ["Cybersecurity Analyst", "Problem Solving", 60],
    ["Cloud Solutions Architect", "Cloud Platforms (AWS/Azure)", 80],
    ["Cloud Solutions Architect", "System Design", 75],
    ["Cloud Solutions Architect", "DevOps", 70],
    ["Cloud Solutions Architect", "Computer Networks", 60],
    ["Cloud Solutions Architect", "Database Design", 60],
    ["Database Administrator", "SQL", 80],
    ["Database Administrator", "Database Design", 75],
    ["Database Administrator", "Data Modeling", 70],
    ["Database Administrator", "Operating Systems", 60],
    ["Database Administrator", "Problem Solving", 55],
    ["Mobile App Developer", "Mobile Development", 80],
    ["Mobile App Developer", "Java", 70],
    ["Mobile App Developer", "UI/UX Design", 60],
    ["Mobile App Developer", "REST APIs", 60],
    ["Mobile App Developer", "Problem Solving", 60],
    ["IT Consultant", "Business Analysis", 70],
    ["IT Consultant", "Project Management", 65],
    ["IT Consultant", "ERP Systems", 60],
    ["IT Consultant", "Process Modeling", 60],
    ["IT Consultant", "Communication", 70],
    ["Data Engineer", "SQL", 75],
    ["Data Engineer", "Python", 75],
    ["Data Engineer", "Big Data", 70],
    ["Data Engineer", "Database Design", 70],
    ["Data Engineer", "Cloud Platforms (AWS/Azure)", 60],
  ];
  csData.forEach(function(row) { csSheet.appendRow(row); });

  // --- Sample student ---
  var sampleStudent = [
    "preethi@university.edu",
    "Preethi Fernando",
    "University of Colombo",
    "BSc Information Systems",
    "Semester 5",
    0,
    JSON.stringify([
      { subject: "Database Management Systems", code: "CS305" },
      { subject: "Object Oriented Programming", code: "CS204" },
      { subject: "Information Systems Analysis and Design", code: "IS201" }
    ]),
    JSON.stringify(["Business Analyst", "Data Analyst"]),
    "[]", "[]", "[]",
    new Date().toISOString(),
    new Date().toISOString()
  ];
  studentSheet.appendRow(sampleStudent);

  // Sample student skills
  var skillsSheet2 = getSheet("StudentSkills");
  [
    ["preethi@university.edu", "SQL", 75, "Technical"],
    ["preethi@university.edu", "Communication", 65, "Soft Skill"],
  ].forEach(function(row) { skillsSheet2.appendRow(row); });

  // Sample project
  var projSheet = getSheet("Projects");
  projSheet.appendRow(["preethi@university.edu", "Library Management System", "Built a Java + MySQL app for managing library loans", "Java, SQL, Database Design"]);

  Logger.log("Setup complete! All sheets created with sample data.");
}

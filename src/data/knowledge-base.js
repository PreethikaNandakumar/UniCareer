/* ============================================================
   UniCareer — Predefined Knowledge Base
   ------------------------------------------------------------
   This is the rule-based "brain" of UniCareer. It contains:
     1. Subject → Skills   (what skills each subject teaches)
     2. Career → Required Skills + Required Levels
     3. Skill → Learn / Practice / Build recommendations

   The matching algorithm (in api.js) uses this data to
   automatically compute:
     - Skills gained from completed subjects
     - Career match percentages
     - Skill gaps and their priority
     - A Learn → Practice → Build roadmap

   This is a predefined, editable knowledge base — no AI/ML.
   Add or edit entries below to extend UniCareer's coverage.
   ============================================================ */

/* ------------------------------------------------------------
   1. SUBJECT → SKILLS
   Each subject maps to a list of skills it develops.
   "level" = the proficiency level (0-100) a student typically
   reaches after completing the subject.
   ------------------------------------------------------------ */
export const SUBJECT_SKILLS = {
  "Data Structures": [
    { skill: "Algorithms", level: 70 },
    { skill: "Java", level: 65 },
    { skill: "Problem Solving", level: 60 },
  ],
  "Algorithms": [
    { skill: "Algorithms", level: 85 },
    { skill: "Problem Solving", level: 75 },
    { skill: "Computational Thinking", level: 70 },
  ],
  "Database Management Systems": [
    { skill: "SQL", level: 75 },
    { skill: "Database Design", level: 70 },
    { skill: "Data Modeling", level: 65 },
  ],
  "Object Oriented Programming": [
    { skill: "Java", level: 75 },
    { skill: "OOP Concepts", level: 80 },
    { skill: "Software Design", level: 60 },
  ],
  "Software Engineering": [
    { skill: "Software Design", level: 70 },
    { skill: "UML Modeling", level: 65 },
    { skill: "Project Management", level: 60 },
    { skill: "Git Version Control", level: 55 },
  ],
  "Web Development": [
    { skill: "HTML & CSS", level: 80 },
    { skill: "JavaScript", level: 70 },
    { skill: "REST APIs", level: 60 },
  ],
  "Data Communication and Networks": [
    { skill: "Computer Networks", level: 70 },
    { skill: "Network Security", level: 55 },
  ],
  "Operating Systems": [
    { skill: "Operating Systems", level: 70 },
    { skill: "System Design", level: 55 },
  ],
  "Information Systems Analysis and Design": [
    { skill: "Requirements Engineering", level: 75 },
    { skill: "UML Modeling", level: 70 },
    { skill: "Business Analysis", level: 65 },
  ],
  "Data Analytics": [
    { skill: "Data Analysis", level: 75 },
    { skill: "Python", level: 65 },
    { skill: "Data Visualization", level: 60 },
  ],
  "Machine Learning": [
    { skill: "Machine Learning", level: 70 },
    { skill: "Python", level: 75 },
    { skill: "Statistics", level: 65 },
  ],
  "Artificial Intelligence": [
    { skill: "Artificial Intelligence", level: 70 },
    { skill: "Problem Solving", level: 75 },
    { skill: "Python", level: 70 },
  ],
  "Computer Graphics": [
    { skill: "Computer Graphics", level: 65 },
    { skill: "C++", level: 60 },
  ],
  "Human Computer Interaction": [
    { skill: "UI/UX Design", level: 70 },
    { skill: "User Research", level: 60 },
    { skill: "Prototyping", level: 55 },
  ],
  "Project Management": [
    { skill: "Project Management", level: 80 },
    { skill: "Agile Methodologies", level: 70 },
    { skill: "Team Leadership", level: 60 },
  ],
  "Cybersecurity": [
    { skill: "Network Security", level: 75 },
    { skill: "Cryptography", level: 65 },
    { skill: "Risk Assessment", level: 60 },
  ],
  "Cloud Computing": [
    { skill: "Cloud Platforms (AWS/Azure)", level: 65 },
    { skill: "DevOps", level: 55 },
    { skill: "System Design", level: 60 },
  ],
  "Mobile Application Development": [
    { skill: "Mobile Development", level: 70 },
    { skill: "Java", level: 65 },
    { skill: "UI/UX Design", level: 55 },
  ],
  "Statistics for Computing": [
    { skill: "Statistics", level: 75 },
    { skill: "Data Analysis", level: 60 },
  ],
  "Discrete Mathematics": [
    { skill: "Computational Thinking", level: 70 },
    { skill: "Problem Solving", level: 65 },
  ],
  "Business Process Management": [
    { skill: "Business Analysis", level: 75 },
    { skill: "Process Modeling", level: 65 },
    { skill: "Project Management", level: 55 },
  ],
  "Enterprise Systems": [
    { skill: "ERP Systems", level: 65 },
    { skill: "Business Analysis", level: 60 },
    { skill: "Database Design", level: 55 },
  ],
  "IT Project Management": [
    { skill: "Project Management", level: 80 },
    { skill: "Agile Methodologies", level: 75 },
    { skill: "Risk Management", level: 65 },
  ],
  "Data Mining": [
    { skill: "Data Mining", level: 70 },
    { skill: "Python", level: 65 },
    { skill: "Statistics", level: 60 },
  ],
  "Big Data Analytics": [
    { skill: "Big Data", level: 65 },
    { skill: "Data Analysis", level: 70 },
    { skill: "Python", level: 65 },
  ],
};

/* ------------------------------------------------------------
   2. CAREER → REQUIRED SKILLS + REQUIRED LEVELS
   Each career lists the skills needed and the minimum level
   (0-100) required to be considered "proficient" for that role.
   ------------------------------------------------------------ */
export const CAREER_REQUIREMENTS = {
  "Business Analyst": [
    { skill: "Business Analysis", requiredLevel: 75 },
    { skill: "Requirements Engineering", requiredLevel: 70 },
    { skill: "UML Modeling", requiredLevel: 65 },
    { skill: "SQL", requiredLevel: 60 },
    { skill: "Data Visualization", requiredLevel: 60 },
    { skill: "Project Management", requiredLevel: 55 },
  ],
  "Data Analyst": [
    { skill: "Data Analysis", requiredLevel: 75 },
    { skill: "SQL", requiredLevel: 70 },
    { skill: "Python", requiredLevel: 65 },
    { skill: "Data Visualization", requiredLevel: 70 },
    { skill: "Statistics", requiredLevel: 60 },
  ],
  "Software Engineer": [
    { skill: "Java", requiredLevel: 75 },
    { skill: "Algorithms", requiredLevel: 70 },
    { skill: "Software Design", requiredLevel: 70 },
    { skill: "Git Version Control", requiredLevel: 65 },
    { skill: "OOP Concepts", requiredLevel: 75 },
    { skill: "Problem Solving", requiredLevel: 70 },
  ],
  "Full Stack Developer": [
    { skill: "JavaScript", requiredLevel: 75 },
    { skill: "HTML & CSS", requiredLevel: 75 },
    { skill: "REST APIs", requiredLevel: 70 },
    { skill: "Database Design", requiredLevel: 65 },
    { skill: "Git Version Control", requiredLevel: 65 },
    { skill: "Python", requiredLevel: 60 },
  ],
  "Data Scientist": [
    { skill: "Machine Learning", requiredLevel: 75 },
    { skill: "Python", requiredLevel: 80 },
    { skill: "Statistics", requiredLevel: 70 },
    { skill: "Data Analysis", requiredLevel: 70 },
    { skill: "Data Mining", requiredLevel: 65 },
  ],
  "Machine Learning Engineer": [
    { skill: "Machine Learning", requiredLevel: 80 },
    { skill: "Python", requiredLevel: 80 },
    { skill: "Algorithms", requiredLevel: 70 },
    { skill: "Statistics", requiredLevel: 65 },
    { skill: "Artificial Intelligence", requiredLevel: 70 },
  ],
  "UI/UX Designer": [
    { skill: "UI/UX Design", requiredLevel: 80 },
    { skill: "User Research", requiredLevel: 70 },
    { skill: "Prototyping", requiredLevel: 75 },
    { skill: "HTML & CSS", requiredLevel: 55 },
    { skill: "Problem Solving", requiredLevel: 55 },
  ],
  "Project Manager (IT)": [
    { skill: "Project Management", requiredLevel: 80 },
    { skill: "Agile Methodologies", requiredLevel: 75 },
    { skill: "Team Leadership", requiredLevel: 70 },
    { skill: "Risk Management", requiredLevel: 65 },
    { skill: "Business Analysis", requiredLevel: 60 },
  ],
  "Cybersecurity Analyst": [
    { skill: "Network Security", requiredLevel: 75 },
    { skill: "Cryptography", requiredLevel: 65 },
    { skill: "Risk Assessment", requiredLevel: 70 },
    { skill: "Operating Systems", requiredLevel: 60 },
    { skill: "Problem Solving", requiredLevel: 60 },
  ],
  "Cloud Solutions Architect": [
    { skill: "Cloud Platforms (AWS/Azure)", requiredLevel: 80 },
    { skill: "System Design", requiredLevel: 75 },
    { skill: "DevOps", requiredLevel: 70 },
    { skill: "Computer Networks", requiredLevel: 60 },
    { skill: "Database Design", requiredLevel: 60 },
  ],
  "Database Administrator": [
    { skill: "SQL", requiredLevel: 80 },
    { skill: "Database Design", requiredLevel: 75 },
    { skill: "Data Modeling", requiredLevel: 70 },
    { skill: "Operating Systems", requiredLevel: 60 },
    { skill: "Problem Solving", requiredLevel: 55 },
  ],
  "Mobile App Developer": [
    { skill: "Mobile Development", requiredLevel: 80 },
    { skill: "Java", requiredLevel: 70 },
    { skill: "UI/UX Design", requiredLevel: 60 },
    { skill: "REST APIs", requiredLevel: 60 },
    { skill: "Problem Solving", requiredLevel: 60 },
  ],
  "IT Consultant": [
    { skill: "Business Analysis", requiredLevel: 70 },
    { skill: "Project Management", requiredLevel: 65 },
    { skill: "ERP Systems", requiredLevel: 60 },
    { skill: "Process Modeling", requiredLevel: 60 },
    { skill: "Communication", requiredLevel: 70 },
  ],
  "Data Engineer": [
    { skill: "SQL", requiredLevel: 75 },
    { skill: "Python", requiredLevel: 75 },
    { skill: "Big Data", requiredLevel: 70 },
    { skill: "Database Design", requiredLevel: 70 },
    { skill: "Cloud Platforms (AWS/Azure)", requiredLevel: 60 },
  ],
};

/* ------------------------------------------------------------
   3. SKILL → LEARN / PRACTICE / BUILD RECOMMENDATIONS
   For every skill, we provide a concrete recommendation for
   each stage of the Learn → Practice → Build roadmap.
   ------------------------------------------------------------ */
export const SKILL_ROADMAPS = {
  "Business Analysis": {
    Learn: "Complete the 'Business Analysis Foundations' course on Coursera",
    Practice: "Analyze 3 real business case studies and write requirement documents",
    Build: "Create a full Business Requirements Document (BRD) for a mock enterprise system",
  },
  "Requirements Engineering": {
    Learn: "Study 'Requirements Engineering Fundamentals' via IEEE guidelines",
    Practice: "Write functional and non-functional requirements for 2 sample projects",
    Build: "Produce a complete Software Requirements Specification (SRS) document",
  },
  "UML Modeling": {
    Learn: "Take 'UML Diagrams Tutorial' on Lucidchart or YouTube",
    Practice: "Draw use case, class, and sequence diagrams for a sample system",
    Build: "Model a complete system design using all 14 UML diagram types",
  },
  "SQL": {
    Learn: "Complete 'SQL for Data Science' on Coursera or SQLBolt interactive",
    Practice: "Solve 50 SQL practice problems on HackerRank or LeetCode",
    Build: "Design and query a normalized database for a library management system",
  },
  "Data Visualization": {
    Learn: "Complete 'Data Visualization with Tableau' or Power BI guided tour",
    Practice: "Recreate 5 popular dashboard designs from the Tableau Public Gallery",
    Build: "Build an interactive Power BI / Tableau dashboard from a real dataset",
  },
  "Project Management": {
    Learn: "Study 'Google Project Management Certificate' on Coursera",
    Practice: "Create project plans, Gantt charts, and risk registers for 2 mock projects",
    Build: "Manage a real team project end-to-end using Agile and document outcomes",
  },
  "Java": {
    Learn: "Complete 'Java Programming and Software Engineering Fundamentals' on Coursera",
    Practice: "Solve 40 Java coding challenges on HackerRank",
    Build: "Build a complete Java application with OOP principles and unit tests",
  },
  "Algorithms": {
    Learn: "Complete 'Algorithms Specialization' on Coursera (Stanford)",
    Practice: "Solve 50 algorithm problems on LeetCode (easy → medium)",
    Build: "Implement 10 classic algorithms from scratch with complexity analysis",
  },
  "Software Design": {
    Learn: "Study 'Software Design and Architecture' on Coursera",
    Practice: "Apply 5 design patterns to small coding exercises",
    Build: "Design a complete system architecture using SOLID principles and design patterns",
  },
  "Git Version Control": {
    Learn: "Complete 'Git & GitHub Crash Course' on YouTube (Traversy Media)",
    Practice: "Manage a repository with branching, merging, and pull requests",
    Build: "Contribute to an open-source project with a documented pull request",
  },
  "OOP Concepts": {
    Learn: "Study 'Object Oriented Programming in Java' on Coursera",
    Practice: "Implement 5 OOP design patterns in small projects",
    Build: "Build a complete OOP-based application with inheritance, polymorphism, and encapsulation",
  },
  "Problem Solving": {
    Learn: "Complete 'Problem Solving with Algorithms and Data Structures' textbook",
    Practice: "Solve 30 logic puzzles and coding challenges on Codewars",
    Build: "Participate in a competitive programming contest or hackathon",
  },
  "JavaScript": {
    Learn: "Complete 'Modern JavaScript' on freeCodeCamp or JavaScript.info",
    Practice: "Build 5 interactive web components (todo, calculator, gallery, etc.)",
    Build: "Create a single-page application using vanilla JavaScript and a public API",
  },
  "HTML & CSS": {
    Learn: "Complete 'Responsive Web Design' on freeCodeCamp",
    Practice: "Recreate 3 popular website layouts from scratch",
    Build: "Build a responsive portfolio website with modern CSS (Grid, Flexbox, animations)",
  },
  "REST APIs": {
    Learn: "Study 'REST API Design' on YouTube or Google API Design Guide",
    Practice: "Build 2 CRUD REST APIs using Express.js or Flask",
    Build: "Design and document a complete REST API with authentication for a real use case",
  },
  "Database Design": {
    Learn: "Study 'Database Design Fundamentals' on Coursera",
    Practice: "Design normalized schemas for 3 different application scenarios",
    Build: "Design and implement a complete database with ER diagrams, normalization, and indexing",
  },
  "Data Modeling": {
    Learn: "Study 'Data Modeling' concepts via ER/Studio tutorials",
    Practice: "Create conceptual, logical, and physical data models for 2 systems",
    Build: "Build a complete data model for an enterprise system with relationships and constraints",
  },
  "Python": {
    Learn: "Complete 'Python for Everybody' on Coursera",
    Practice: "Solve 40 Python coding challenges on HackerRank",
    Build: "Build a Python data analysis or automation project with real-world data",
  },
  "Data Analysis": {
    Learn: "Complete 'Data Analysis with Python' or 'Google Data Analytics' on Coursera",
    Practice: "Analyze 3 public datasets (Kaggle) and write summary reports",
    Build: "Perform end-to-end analysis on a real dataset and present findings in a report",
  },
  "Statistics": {
    Learn: "Study 'Statistics for Data Science' on Coursera or Khan Academy",
    Practice: "Solve 30 statistics problems covering probability, distributions, and hypothesis testing",
    Build: "Conduct a complete statistical analysis on a real dataset and write a report",
  },
  "Machine Learning": {
    Learn: "Complete 'Machine Learning Specialization' by Andrew Ng on Coursera",
    Practice: "Implement 5 ML algorithms from scratch on Kaggle datasets",
    Build: "Build, train, and deploy a complete ML model for a real-world problem",
  },
  "Artificial Intelligence": {
    Learn: "Study 'AI for Everyone' and 'Introduction to AI' on Coursera",
    Practice: "Implement 3 AI search and optimization algorithms",
    Build: "Build an AI-powered application (chatbot, game agent, or recommendation system)",
  },
  "Data Mining": {
    Learn: "Study 'Data Mining' on Coursera (University of Illinois)",
    Practice: "Apply clustering and classification to 3 Kaggle datasets",
    Build: "Build a complete data mining pipeline with preprocessing, mining, and evaluation",
  },
  "Big Data": {
    Learn: "Study 'Big Data' fundamentals on Coursera (UC San Diego)",
    Practice: "Process large datasets using Hadoop/Spark in a sandbox environment",
    Build: "Build a big data pipeline processing real datasets with Spark or Hadoop",
  },
  "UI/UX Design": {
    Learn: "Complete 'Google UX Design Certificate' on Coursera",
    Practice: "Redesign 3 app/website interfaces and create wireframes in Figma",
    Build: "Design a complete app UX from research to high-fidelity prototype in Figma",
  },
  "User Research": {
    Learn: "Study 'User Research Methods' via Nielsen Norman Group articles",
    Practice: "Conduct 3 user interviews and synthesize findings into personas",
    Build: "Run a complete user research study for a product and present insights",
  },
  "Prototyping": {
    Learn: "Learn Figma or Adobe XD through official tutorials",
    Practice: "Create 5 interactive prototypes for different app screens",
    Build: "Build a complete clickable high-fidelity prototype in Figma for a real app idea",
  },
  "Network Security": {
    Learn: "Complete 'Introduction to Cybersecurity' on Coursera or Cisco",
    Practice: "Complete 5 labs on TryHackMe or HackTheCap",
    Build: "Perform a security audit of a sample network and write a vulnerability report",
  },
  "Cryptography": {
    Learn: "Study 'Cryptography I' on Coursera (Stanford)",
    Practice: "Implement 5 encryption/decryption algorithms in Python",
    Build: "Build a secure communication application with end-to-end encryption",
  },
  "Risk Assessment": {
    Learn: "Study 'Risk Management for IT' on Coursera or ISO 27005",
    Practice: "Conduct risk assessments for 2 mock organizations",
    Build: "Produce a complete enterprise risk assessment document with mitigation plan",
  },
  "Cloud Platforms (AWS/Azure)": {
    Learn: "Complete 'AWS Cloud Practitioner' or 'Azure Fundamentals' certification course",
    Practice: "Deploy 3 sample applications to AWS/Azure free tier",
    Build: "Architect and deploy a complete cloud-based application with CI/CD",
  },
  "DevOps": {
    Learn: "Study 'DevOps Engineering' on Coursera or 'Docker & Kubernetes' on YouTube",
    Practice: "Containerize 3 applications with Docker and set up CI/CD pipelines",
    Build: "Build a complete DevOps pipeline with Docker, Kubernetes, and automated deployment",
  },
  "System Design": {
    Learn: "Study 'System Design' via Grokking the System Design Interview",
    Practice: "Design architectures for 5 common system design interview questions",
    Build: "Design and document a complete scalable system architecture for a real-world problem",
  },
  "Mobile Development": {
    Learn: "Complete 'Android Development' or 'React Native' on Coursera",
    Practice: "Build 3 mobile app screens with navigation and data persistence",
    Build: "Publish a complete mobile app to Google Play Store or App Store",
  },
  "Computer Networks": {
    Learn: "Study 'Computer Networking' on Coursera (Stanford)",
    Practice: "Configure network topologies in Cisco Packet Tracer",
    Build: "Design and simulate a complete enterprise network in Packet Tracer",
  },
  "Operating Systems": {
    Learn: "Study 'Operating Systems' on Coursera (Stanford)",
    Practice: "Implement 3 OS concepts (scheduling, memory management, file system) in C",
    Build: "Build a simple shell or mini operating system kernel module",
  },
  "Computer Graphics": {
    Learn: "Study 'Computer Graphics' via learnopengl.com",
    Practice: "Implement 5 rendering algorithms (line drawing, shading, transforms)",
    Build: "Build a complete 3D scene or game using OpenGL or WebGL",
  },
  "C++": {
    Learn: "Complete 'C++ Programming' on Coursera or learnCpp.com",
    Practice: "Solve 40 C++ coding challenges on HackerRank",
    Build: "Build a complete C++ application (game engine, simulation, or tool)",
  },
  "Computational Thinking": {
    Learn: "Study 'Computational Thinking' on Coursera (Penn)",
    Practice: "Decompose 5 real-world problems into computational models",
    Build: "Build a project that applies computational thinking to solve a community problem",
  },
  "Agile Methodologies": {
    Learn: "Study 'Agile with Scrum' on Coursera or read the Scrum Guide",
    Practice: "Run 3 sprint cycles on a mock project with stories and retrospectives",
    Build: "Manage a real project using Scrum and document sprint outcomes",
  },
  "Team Leadership": {
    Learn: "Study 'Leadership for Engineers' on Coursera or read 'The Team Builder's Handbook'",
    Practice: "Lead a small team through a 2-week project with defined roles",
    Build: "Lead a real team project from kickoff to delivery and write a reflection",
  },
  "Risk Management": {
    Learn: "Study 'Risk Management' on Coursera or PMI Risk Management framework",
    Practice: "Create risk registers and mitigation plans for 2 mock projects",
    Build: "Develop a complete risk management plan for a real IT project",
  },
  "ERP Systems": {
    Learn: "Study 'ERP Systems' on Coursera or SAP Learning Hub",
    Practice: "Configure 3 ERP modules in a sandbox (SAP, Odoo, or Oracle)",
    Build: "Implement and customize an ERP system for a mock business",
  },
  "Process Modeling": {
    Learn: "Study 'BPMN 2.0' via Camunda tutorials",
    Practice: "Model 5 business processes using BPMN in Camunda Modeler",
    Build: "Model and simulate a complete end-to-end business process for a real organization",
  },
  "Communication": {
    Learn: "Complete 'Improving Communication Skills' on Coursera (Wharton)",
    Practice: "Present 3 technical topics to a non-technical audience",
    Build: "Deliver a complete technical presentation and workshop at a university event",
  },
};

/* ------------------------------------------------------------
   4. SKILL CATEGORIES (for display purposes)
   ------------------------------------------------------------ */
export const SKILL_CATEGORIES = {
  "Algorithms": "Technical",
  "Java": "Technical",
  "Problem Solving": "Soft Skill",
  "Computational Thinking": "Technical",
  "SQL": "Technical",
  "Database Design": "Technical",
  "Data Modeling": "Technical",
  "OOP Concepts": "Technical",
  "Software Design": "Technical",
  "UML Modeling": "Technical",
  "Project Management": "Management",
  "Git Version Control": "Technical",
  "HTML & CSS": "Technical",
  "JavaScript": "Technical",
  "REST APIs": "Technical",
  "Computer Networks": "Technical",
  "Network Security": "Technical",
  "Operating Systems": "Technical",
  "System Design": "Technical",
  "Requirements Engineering": "Technical",
  "Business Analysis": "Business",
  "Data Analysis": "Technical",
  "Python": "Technical",
  "Data Visualization": "Technical",
  "Machine Learning": "Technical",
  "Statistics": "Technical",
  "Artificial Intelligence": "Technical",
  "Computer Graphics": "Technical",
  "C++": "Technical",
  "UI/UX Design": "Design",
  "User Research": "Design",
  "Prototyping": "Design",
  "Agile Methodologies": "Management",
  "Team Leadership": "Soft Skill",
  "Cybersecurity": "Technical",
  "Cryptography": "Technical",
  "Risk Assessment": "Management",
  "Cloud Platforms (AWS/Azure)": "Technical",
  "DevOps": "Technical",
  "Mobile Development": "Technical",
  "Data Mining": "Technical",
  "Big Data": "Technical",
  "ERP Systems": "Business",
  "Process Modeling": "Business",
  "Risk Management": "Management",
  "Communication": "Soft Skill",
};

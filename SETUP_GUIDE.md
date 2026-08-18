# UniCareer — Setup & Deployment Guide

This guide walks you through setting up the complete UniCareer project: the website, the Google Sheets database, and the Google Apps Script backend.

---

## Project Structure

```
UniCareer/
├── index.html              ← Landing page
├── login.html              ← Login / Register page
├── profile-setup.html      ← Student profile form (auto-computes results)
├── dashboard.html          ← Student dashboard (shows computed results)
├── public/
│   ├── style.css           ← All styling
│   └── api.js              ← Knowledge base + matching engine + API layer
├── google-apps-script/
│   └── Code.gs             ← Google Apps Script backend
├── src/
│   ├── data/
│   │   ├── knowledge-base.js    ← Knowledge base (ES module version)
│   │   └── matching-engine.js   ← Matching algorithm (ES module version)
│   └── api/
│       └── api.js               ← API helper (ES module version)
├── vite.config.ts          ← Vite build config
├── package.json            ← Dependencies
└── SETUP_GUIDE.md         ← This file
```

---

## Part 1: Run the Website Locally

### Prerequisites
- Node.js 18+ installed on your computer

### Steps

1. **Download/clone the project** to your computer.

2. **Open a terminal** in the project folder and install dependencies:
   ```
   npm install
   ```

3. **Start the dev server:**
   ```
   npm run dev
   ```

4. **Open your browser** to the URL shown in the terminal (usually `http://localhost:5173`).

The website works immediately in **offline/demo mode** — student data is saved in the browser's localStorage. You can register, fill in your profile, and see the dashboard without any backend setup.

---

## Part 2: Set Up Google Sheets (Optional — for Multi-Device Persistence)

If you want student data to persist across devices (not just in the browser), connect Google Sheets as the database.

### Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it **"UniCareer Database"**.
3. Copy the **Spreadsheet ID** from the URL — it's the long string between `/d/` and `/edit`:
   ```
   https://docs.google.com/spreadsheets/d/THIS_IS_YOUR_SPREADSHEET_ID/edit
   ```

### Step 2: Add the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**.
2. Delete any code in the editor.
3. Open the `google-apps-script/Code.gs` file from this project.
4. Copy all the code and paste it into the Apps Script editor.
5. In the code, replace `YOUR_SPREADSHEET_ID` with your actual Spreadsheet ID:
   ```javascript
   const SPREADSHEET_ID = "1AbCdEf...your-actual-id...";
   ```
6. Click **Save** (Ctrl+S).

### Step 3: Run the Setup Function

1. In the Apps Script editor, select the function dropdown at the top.
2. Choose **`setupSheets`** and click **Run**.
3. Authorize the script when prompted (click through the warnings — it's safe, it's your own script).
4. Check your Google Sheet — you should now see these tabs with sample data:
   - **Students** — student accounts
   - **Subjects** — predefined subjects
   - **SubjectSkills** — what skills each subject teaches
   - **StudentSkills** — each student's self-reported skills
   - **Careers** — predefined career paths
   - **CareerSkills** — required skills + levels for each career
   - **Projects** — student projects
   - **Roadmaps** — learning roadmaps
   - **Progress** — roadmap progress tracking

### Step 4: Deploy as a Web App

1. In the Apps Script editor, click **Deploy → New Deployment**.
2. Click the gear icon and select **Web app**.
3. Fill in:
   - **Description:** UniCareer API
   - **Execute as:** Me (your account)
   - **Who has access:** Anyone
4. Click **Deploy**.
5. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

### Step 5: Connect the Website to Google Sheets

1. Open `public/api.js` in the project.
2. Find this line near the bottom of the file:
   ```javascript
   var API_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL";
   ```
3. Replace it with your Web App URL:
   ```javascript
   var API_URL = "https://script.google.com/macros/s/AKfycby.../exec";
   ```
4. Save the file.

The website will now save and load data from Google Sheets instead of localStorage.

---

## Google Sheets Structure

### Students Sheet
| email | studentName | university | degree | currentSemester | roadmapProgress | completedSubjects | careerInterests | careerMatches | skillGaps | learningRoadmap | createdAt | updatedAt |
|-------|-------------|-----------|--------|-----------------|-----------------|-------------------|----------------|--------------|-----------|-----------------|-----------|-----------|
| preethi@university.edu | Preethi Fernando | University of Colombo | BSc IS | Semester 5 | 0 | [JSON] | [JSON] | [JSON] | [JSON] | [JSON] | 2026-01-01 | 2026-01-01 |

### Subjects Sheet
| subjectName | code | credits |
|-------------|------|---------|
| Data Structures | CS201 | 4 |

### SubjectSkills Sheet
| subjectName | skill | level |
|-------------|-------|-------|
| Data Structures | Algorithms | 70 |

### Careers Sheet
| careerName | description |
|------------|-------------|
| Business Analyst | Bridges business needs and IT solutions |

### CareerSkills Sheet
| careerName | skill | requiredLevel |
|------------|-------|---------------|
| Business Analyst | Business Analysis | 75 |

### StudentSkills Sheet
| email | skill | level | category |
|-------|-------|-------|----------|
| preethi@university.edu | SQL | 75 | Technical |

### Projects Sheet
| email | projectName | description | skillsUsed |
|-------|-------------|-------------|------------|
| preethi@university.edu | Library Management System | Built a Java + MySQL app | Java, SQL |

### Roadmaps Sheet
| email | skill | stage | step | status | priority |
|-------|-------|-------|------|--------|----------|
| preethi@university.edu | Data Visualization | Learn | Complete Power BI course | Upcoming | High |

### Progress Sheet
| email | stepIndex | status | updatedAt |
|-------|-----------|--------|----------|
| preethi@university.edu | 0 | Completed | 2026-01-15 |

---

## How the Matching Algorithm Works

UniCareer uses a simple **rule-based algorithm** (no AI/ML):

```
Student Skills (from subjects + self-reported)
  + Career Requirements (from knowledge base)
  → Career Match % = average of (studentLevel / requiredLevel) × 100
  → Skill Gaps = where studentLevel < requiredLevel
  → Roadmap = Learn → Practice → Build steps for each gap
```

### Priority Levels
- **High:** Gap ≥ 40 points
- **Medium:** Gap 20–39 points
- **Low:** Gap < 20 points

---

## Deploying the Website Online

### Option A: Deploy on Bolt.new
The project is already running on Bolt.new — just share the preview URL.

### Option B: Deploy on Netlify or Vercel
1. Run `npm run build` to generate the `dist/` folder.
2. Drag the `dist/` folder onto [Netlify Drop](https://app.netlify.com/drop) or upload to Vercel.

### Option C: Deploy on GitHub Pages
1. Push the project to a GitHub repository.
2. Go to Settings → Pages → Source → Deploy from branch.
3. Select `main` branch and `/dist` folder.

---

## Troubleshooting

**"Apps Script URL not configured" message:**
- You haven't pasted your Web App URL into `public/api.js`. The site still works in offline mode (localStorage).

**CORS errors in the browser console:**
- Make sure you deployed the Apps Script with "Who has access: Anyone".
- The `api.js` sends POST requests as `text/plain` to avoid CORS pre-flight issues.

**Data not saving to Google Sheets:**
- Check that the Spreadsheet ID in `Code.gs` is correct.
- Check the Apps Script execution logs for errors.

**Sample data not appearing:**
- Make sure you ran the `setupSheets` function in the Apps Script editor.

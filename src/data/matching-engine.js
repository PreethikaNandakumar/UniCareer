/* ============================================================
   UniCareer — Matching Engine (Rule-Based Algorithm)
   ------------------------------------------------------------
   Student Skills + Career Requirements
     → Career Match %
     → Skill Gaps (with priority)
     → Recommended Roadmap (Learn → Practice → Build)

   No AI/ML. Pure deterministic rules.
   ============================================================ */

import { SUBJECT_SKILLS, CAREER_REQUIREMENTS, SKILL_ROADMAPS, SKILL_CATEGORIES } from './knowledge-base.js';

/* ------------------------------------------------------------
   Merge multiple skill sources into a single profile map.
   If a skill appears more than once (e.g. from two subjects or
   a subject + a self-reported skill), keep the HIGHEST level.
   ------------------------------------------------------------ */
export function buildSkillProfile(completedSubjects, currentSkills) {
  const profile = {}; // { skillName: level }

  // 1. Skills gained from completed subjects (auto-computed)
  (completedSubjects || []).forEach(entry => {
    const subjectName = entry.subject || entry.name || '';
    const subjectSkills = SUBJECT_SKILLS[subjectName];
    if (subjectSkills) {
      subjectSkills.forEach(ss => {
        const current = profile[ss.skill] || 0;
        if (ss.level > current) profile[ss.skill] = ss.level;
      });
    }
  });

  // 2. Self-reported skills (student-entered) override if higher
  (currentSkills || []).forEach(entry => {
    const skill = entry.skill || '';
    const level = Number(entry.level) || 0;
    if (skill) {
      const current = profile[skill] || 0;
      if (level > current) profile[skill] = level;
    }
  });

  return profile; // { 'SQL': 75, 'Java': 80, ... }
}

/* ------------------------------------------------------------
   Compute career match percentages for ALL careers.
   Match % = average of (studentLevel / requiredLevel) * 100
   across all required skills, capped at 100 per skill.
   ------------------------------------------------------------ */
export function computeCareerMatches(skillProfile) {
  const matches = [];

  Object.entries(CAREER_REQUIREMENTS).forEach(([career, requirements]) => {
    let totalRatio = 0;
    const skillDetails = [];

    requirements.forEach(req => {
      const studentLevel = skillProfile[req.skill] || 0;
      const ratio = Math.min(1, studentLevel / req.requiredLevel);
      totalRatio += ratio;
      skillDetails.push({
        skill: req.skill,
        requiredLevel: req.requiredLevel,
        studentLevel: studentLevel,
        hasGap: studentLevel < req.requiredLevel,
      });
    });

    const matchPercent = Math.round((totalRatio / requirements.length) * 100);
    matches.push({
      career,
      match: matchPercent,
      note: matchPercent >= 75 ? 'High Alignment' : matchPercent >= 50 ? 'Moderate Alignment' : 'Low Alignment — gaps to close',
      skillDetails,
    });
  });

  // Sort by match % descending
  matches.sort((a, b) => b.match - a.match);
  return matches;
}

/* ------------------------------------------------------------
   Compute skill gaps for a specific career.
   A gap exists when studentLevel < requiredLevel.
   Priority:
     - Gap > 40  → High
     - Gap 20-40 → Medium
     - Gap < 20  → Low
   ------------------------------------------------------------ */
export function computeSkillGaps(skillProfile, careerName) {
  const requirements = CAREER_REQUIREMENTS[careerName];
  if (!requirements) return [];

  const gaps = [];
  requirements.forEach(req => {
    const studentLevel = skillProfile[req.skill] || 0;
    const gap = req.requiredLevel - studentLevel;
    if (gap > 0) {
      let priority;
      if (gap >= 40) priority = 'High';
      else if (gap >= 20) priority = 'Medium';
      else priority = 'Low';

      gaps.push({
        skill: req.skill,
        requiredLevel: req.requiredLevel,
        studentLevel: studentLevel,
        gap: gap,
        priority: priority,
        note: `Need to improve from ${studentLevel}% to ${req.requiredLevel}% (${gap} points)`,
      });
    }
  });

  // Sort by gap size descending (biggest gap first)
  gaps.sort((a, b) => b.gap - a.gap);
  return gaps;
}

/* ------------------------------------------------------------
   Generate a Learn → Practice → Build roadmap for the top gaps.
   Uses the SKILL_ROADMAPS knowledge base.
   Only generates steps for skills that have a gap.
   ------------------------------------------------------------ */
export function generateRoadmap(skillProfile, careerName, maxGaps = 5) {
  const gaps = computeSkillGaps(skillProfile, careerName);
  const roadmap = [];

  gaps.slice(0, maxGaps).forEach(gap => {
    const recs = SKILL_ROADMAPS[gap.skill];
    if (recs) {
      // Learn stage
      roadmap.push({
        skill: gap.skill,
        stage: 'Learn',
        step: recs.Learn,
        status: 'Upcoming',
        priority: gap.priority,
      });
      // Practice stage
      roadmap.push({
        skill: gap.skill,
        stage: 'Practice',
        step: recs.Practice,
        status: 'Upcoming',
        priority: gap.priority,
      });
      // Build stage
      roadmap.push({
        skill: gap.skill,
        stage: 'Build',
        step: recs.Build,
        status: 'Upcoming',
        priority: gap.priority,
      });
    }
  });

  return roadmap;
}

/* ------------------------------------------------------------
   Compute everything for a student profile in one call.
   This is the main function the API uses.
   ------------------------------------------------------------ */
export function computeProfile(studentData) {
  const completedSubjects = studentData.completedSubjects || [];
  const currentSkills = studentData.currentSkills || [];
  const careerInterests = studentData.careerInterests || [];

  // 1. Build the unified skill profile
  const skillProfile = buildSkillProfile(completedSubjects, currentSkills);

  // 2. Compute career matches for ALL careers
  const allMatches = computeCareerMatches(skillProfile);

  // 3. Determine which careers to show:
  //    - If student expressed interests, prioritize those (sorted by match)
  //    - Otherwise show top 5 by match
  let topMatches;
  if (careerInterests.length > 0) {
    const interestLower = careerInterests.map(c => c.toLowerCase());
    const interested = allMatches.filter(m =>
      interestLower.some(i => m.career.toLowerCase().includes(i))
    );
    const others = allMatches.filter(m =>
      !interestLower.some(i => m.career.toLowerCase().includes(i))
    );
    topMatches = [...interested, ...others].slice(0, 5);
  } else {
    topMatches = allMatches.slice(0, 5);
  }

  // 4. Compute skill gaps for the best-matching career
  const bestCareer = topMatches[0]?.career || allMatches[0]?.career || '';
  const skillGaps = computeSkillGaps(skillProfile, bestCareer);

  // 5. Generate roadmap based on the best career's gaps
  const learningRoadmap = generateRoadmap(skillProfile, bestCareer);

  // 6. Compute overall career readiness
  //    = average match % across top 5 careers
  const readiness = topMatches.length > 0
    ? Math.round(topMatches.reduce((sum, m) => sum + m.match, 0) / topMatches.length)
    : 0;

  // 7. Enrich completed subjects with auto-computed skills
  const enrichedSubjects = completedSubjects.map(sub => {
    const subjectName = sub.subject || sub.name || '';
    const subjectSkills = SUBJECT_SKILLS[subjectName];
    return {
      ...sub,
      subject: subjectName,
      skills: subjectSkills ? subjectSkills.map(s => s.skill).join(', ') : (sub.skills || '—'),
    };
  });

  // 8. Enrich current skills with categories
  const enrichedSkills = currentSkills.map(s => ({
    ...s,
    category: s.category || SKILL_CATEGORIES[s.skill] || 'Technical',
  }));

  return {
    ...studentData,
    completedSubjects: enrichedSubjects,
    currentSkills: enrichedSkills,
    careerMatches: topMatches,
    skillGaps: skillGaps,
    learningRoadmap: learningRoadmap,
    careerReadiness: readiness,
    bestCareer: bestCareer,
    allCareerMatches: allMatches,
  };
}

/* ------------------------------------------------------------
   Get list of all available subjects (for dropdowns / autocomplete)
   ------------------------------------------------------------ */
export function getAllSubjects() {
  return Object.keys(SUBJECT_SKILLS).sort();
}

/* ------------------------------------------------------------
   Get list of all available careers
   ------------------------------------------------------------ */
export function getAllCareers() {
  return Object.keys(CAREER_REQUIREMENTS).sort();
}

/* ------------------------------------------------------------
   Get skills for a specific subject
   ------------------------------------------------------------ */
export function getSkillsForSubject(subjectName) {
  return SUBJECT_SKILLS[subjectName] || [];
}

/* ------------------------------------------------------------
   Get requirements for a specific career
   ------------------------------------------------------------ */
export function getRequirementsForCareer(careerName) {
  return CAREER_REQUIREMENTS[careerName] || [];
}

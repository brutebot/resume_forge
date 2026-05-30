/* ========================================
   ResumeForge — AI Module (Gemini API)
   Summary gen, ATS score, interview prep,
   skill suggestions, grammar improvement
   ======================================== */

const AI = (() => {
  const GEMINI_MODEL = 'gemini-2.0-flash';

  function getApiKey() {
    return localStorage.getItem('resumeforge_gemini_key') || '';
  }

  function setApiKey(key) {
    localStorage.setItem('resumeforge_gemini_key', key);
  }

  function hasKey() {
    return !!getApiKey();
  }

  async function callGemini(prompt) {
    const key = getApiKey();
    if (!key) throw new Error('No API key set. Open Settings to add your Gemini API key.');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API error ${res.status}`);
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  // Generate a professional summary
  async function generateSummary(title, skills, experience) {
    const prompt = `Write a concise, professional resume summary (3-4 sentences) for a "${title}" with skills in ${skills}. ${experience ? `Recent experience: ${experience}.` : ''} Write in first person implied (no "I"), professional tone. Return ONLY the summary text, no quotes or labels.`;
    return callGemini(prompt);
  }

  // Improve/rewrite text
  async function improveText(text, context) {
    const prompt = `Improve this resume text for clarity, impact and professionalism. Use strong action verbs and quantify achievements where possible. Context: ${context}.\n\nOriginal text:\n${text}\n\nReturn ONLY the improved text, no labels or explanations.`;
    return callGemini(prompt);
  }

  // ATS score checker
  async function scoreATS(resumeData, jobDescription) {
    const resumeText = buildResumeText(resumeData);
    const prompt = `Analyze this resume against the job description for ATS compatibility. Score from 0-100.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return a JSON object ONLY (no markdown, no code fences) with this exact structure:
{"score": <number>, "matchedKeywords": ["keyword1","keyword2"], "missingKeywords": ["keyword1","keyword2"], "suggestions": ["tip1","tip2","tip3"]}`;

    const raw = await callGemini(prompt);
    try {
      const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return { score: 0, matchedKeywords: [], missingKeywords: [], suggestions: ['Could not parse ATS results. Try again.'] };
    }
  }

  // Suggest skills based on job title
  async function suggestSkills(title, currentSkills) {
    const prompt = `Suggest 10 relevant technical and soft skills for a "${title}" role. Current skills: ${currentSkills || 'none'}. Return ONLY a comma-separated list of skills, nothing else.`;
    const result = await callGemini(prompt);
    return result.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Generate interview questions
  async function generateInterviewQuestions(resumeData) {
    const resumeText = buildResumeText(resumeData);
    const prompt = `Based on this resume, generate 8 likely interview questions (mix of behavioral and technical). For each, provide a brief suggested approach to answer.

Resume:
${resumeText}

Return a JSON array ONLY (no markdown, no code fences) with this structure:
[{"question": "...", "approach": "..."}]`;

    const raw = await callGemini(prompt);
    try {
      const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return [{ question: 'Could not generate questions. Try again.', approach: '' }];
    }
  }

  // Build plain text from resume data
  function buildResumeText(state) {
    const p = state.personal;
    let text = `${p.firstName} ${p.lastName} — ${p.title}\n${p.email} | ${p.phone} | ${p.location}\n\n`;
    if (state.summary) text += `Summary: ${state.summary}\n\n`;
    state.experience.forEach(e => {
      text += `${e.jobTitle} at ${e.company} (${e.startDate} - ${e.endDate})\n${e.description}\n\n`;
    });
    state.education.forEach(e => {
      text += `${e.degree} from ${e.school} (${e.startDate} - ${e.endDate})\n${e.description}\n\n`;
    });
    if (state.skills) text += `Skills: ${state.skills}\n\n`;
    state.projects.forEach(proj => {
      text += `Project: ${proj.name} (${proj.techStack})\n${proj.description}\n\n`;
    });
    state.certifications.forEach(c => {
      text += `Certification: ${c.name} by ${c.issuer} (${c.date})\n`;
    });
    return text;
  }

  // Ask Gemini directly
  async function askGeminiChat(prompt, resumeData) {
    const resumeText = resumeData ? buildResumeText(resumeData) : 'No resume data provided yet.';
    const fullPrompt = `You are a helpful career and resume assistant named ResumeForge AI. Help the user with their request.
If the user asks about their resume, use the following context. Be concise and professional.
User's Resume Data:
${resumeText}

User Request:
${prompt}`;
    return callGemini(fullPrompt);
  }

  return {
    getApiKey, setApiKey, hasKey,
    generateSummary, improveText, scoreATS,
    suggestSkills, generateInterviewQuestions,
    askGeminiChat
  };
})();

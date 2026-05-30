/* ========================================
   ResumeForge — Application Logic
   Core state, navigation, features
   ======================================== */

// ============ STATE ============
const state = {
  template: 'modern',
  zoom: 100,
  currentStep: 0,
  profilePhoto: null,
  personal: {
    firstName: '', lastName: '', title: '',
    email: '', phone: '', location: '', website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: '',
  projects: [],
  certifications: [],
};

const STEPS = ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
const resumePage = document.getElementById('resume-page');

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  Voice.init();
  bindPersonalInputs();
  bindSummary();
  bindSkills();
  bindStepNavigation();
  bindTemplateTabs();
  bindZoom();
  bindButtons();
  bindModals();
  bindDarkMode();
  bindLanguage();
  bindPhotoUpload();
  bindAIButtons();
  bindMicButtons();
  bindLandingPage();
  renderAllEntries();
  renderResume();
  showStep(state.currentStep);
});

// ============ LOCAL STORAGE ============
function saveState() {
  try { localStorage.setItem('resumeforge_data', JSON.stringify(state)); } catch {}
  Analytics.trackEdit();
}

function loadState() {
  try {
    const saved = localStorage.getItem('resumeforge_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
      Object.keys(state.personal).forEach(key => {
        const input = document.querySelector(`[data-field="${key}"]`);
        if (input) input.value = state.personal[key] || '';
      });
      const si = document.getElementById('input-summary');
      if (si) si.value = state.summary || '';
      const sk = document.getElementById('input-skills');
      if (sk) sk.value = state.skills || '';
      document.querySelectorAll('.tab').forEach(t => {
        t.classList.toggle('active', t.dataset.template === state.template);
      });
      // Restore photo preview
      if (state.profilePhoto) {
        const preview = document.getElementById('photo-preview');
        if (preview) {
          preview.innerHTML = `<img src="${state.profilePhoto}" alt="Profile" />`;
          document.getElementById('btn-remove-photo').style.display = '';
        }
      }
    }
  } catch {}
  // Load API key
  const keyInput = document.getElementById('input-api-key');
  if (keyInput && AI.hasKey()) {
    keyInput.value = AI.getApiKey();
  }
  // Load lang — default to English always, only apply saved if explicit
  const langSel = document.getElementById('lang-select');
  const savedLang = localStorage.getItem('resumeforge_lang');
  if (savedLang && savedLang !== 'en' && langSel) {
    langSel.value = savedLang;
    I18n.setLang(savedLang);
    applyI18n();
  } else {
    // Ensure English is set
    I18n.setLang('en');
    if (langSel) langSel.value = 'en';
    applyI18n();
  }
  // Load dark mode
  if (localStorage.getItem('resumeforge_dark') === 'true') {
    document.body.setAttribute('data-theme', 'dark');
  }
}

// ============ STEP NAVIGATION ============
function showStep(index) {
  state.currentStep = index;
  document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
  const stepName = STEPS[index];
  const target = document.querySelector(`.form-section[data-step="${stepName}"]`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.step-item').forEach((item, i) => {
    item.classList.remove('active', 'completed');
    if (i < index) item.classList.add('completed');
    else if (i === index) item.classList.add('active');
  });

  const backBtn = document.getElementById('btn-back');
  const continueBtn = document.getElementById('btn-continue');
  if (backBtn) backBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
  if (continueBtn) {
    const isLast = index === STEPS.length - 1;
    continueBtn.innerHTML = isLast
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${I18n.t('downloadPdf')}`
      : `${I18n.t('continue')} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
  }

  const formScroll = document.querySelector('.form-area-scroll');
  if (formScroll) formScroll.scrollTop = 0;
}

function bindStepNavigation() {
  document.querySelectorAll('.step-item').forEach((item, i) => {
    item.addEventListener('click', () => showStep(i));
  });
  document.getElementById('btn-back')?.addEventListener('click', () => {
    if (state.currentStep > 0) showStep(state.currentStep - 1);
  });
  document.getElementById('btn-continue')?.addEventListener('click', async () => {
    if (state.currentStep < STEPS.length - 1) showStep(state.currentStep + 1);
    else await downloadPDF();
  });
}

// ============ BINDINGS ============
function bindPersonalInputs() {
  document.querySelectorAll('#section-personal input[data-field]').forEach(input => {
    input.addEventListener('input', () => {
      state.personal[input.dataset.field] = input.value;
      saveState(); renderResume();
    });
  });
}

function bindSummary() {
  const el = document.getElementById('input-summary');
  el?.addEventListener('input', () => { state.summary = el.value; saveState(); renderResume(); });
}

function bindSkills() {
  const el = document.getElementById('input-skills');
  el?.addEventListener('input', () => { state.skills = el.value; saveState(); renderResume(); });
}

function bindTemplateTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.template = tab.dataset.template;
      saveState(); renderResume();
      Analytics.trackTemplateUse(state.template);
    });
  });
}

function bindZoom() {
  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    state.zoom = Math.min(150, state.zoom + 10); applyZoom();
  });
  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    state.zoom = Math.max(50, state.zoom - 10); applyZoom();
  });
}

function applyZoom() {
  resumePage.style.transform = `scale(${state.zoom / 100})`;
}

function bindButtons() {
  document.getElementById('btn-add-experience')?.addEventListener('click', () => {
    state.experience.push({ jobTitle: '', company: '', startDate: '', endDate: '', description: '' });
    saveState(); renderExperience(); renderResume();
  });
  document.getElementById('btn-add-education')?.addEventListener('click', () => {
    state.education.push({ degree: '', school: '', startDate: '', endDate: '', description: '' });
    saveState(); renderEducation(); renderResume();
  });
  document.getElementById('btn-add-project')?.addEventListener('click', () => {
    state.projects.push({ name: '', techStack: '', description: '' });
    saveState(); renderProjects(); renderResume();
  });
  document.getElementById('btn-add-certification')?.addEventListener('click', () => {
    state.certifications.push({ name: '', issuer: '', date: '' });
    saveState(); renderCertifications(); renderResume();
  });
  document.getElementById('btn-download')?.addEventListener('click', () => downloadPDF());
  document.getElementById('btn-clear')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all data?')) {
      localStorage.removeItem('resumeforge_data');
      location.reload();
    }
  });
}

// ============ PHOTO UPLOAD ============
function bindPhotoUpload() {
  const input = document.getElementById('input-photo');
  const removeBtn = document.getElementById('btn-remove-photo');
  input?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      state.profilePhoto = ev.target.result;
      const preview = document.getElementById('photo-preview');
      preview.innerHTML = `<img src="${state.profilePhoto}" alt="Profile" />`;
      removeBtn.style.display = '';
      saveState(); renderResume();
    };
    reader.readAsDataURL(file);
  });
  removeBtn?.addEventListener('click', () => {
    state.profilePhoto = null;
    const preview = document.getElementById('photo-preview');
    preview.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    removeBtn.style.display = 'none';
    saveState(); renderResume();
  });
}

// ============ DARK MODE ============
function bindDarkMode() {
  document.getElementById('btn-dark-mode')?.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? '' : 'dark');
    localStorage.setItem('resumeforge_dark', !isDark);
  });
}

// ============ LANGUAGE ============
function bindLanguage() {
  document.getElementById('lang-select')?.addEventListener('change', (e) => {
    const lang = e.target.value;
    I18n.setLang(lang);
    localStorage.setItem('resumeforge_lang', lang);
    Voice.setLanguage(I18n.getSpeechLang());
    applyI18n();
    showStep(state.currentStep); // Re-render nav buttons
  });
}

// ============ LANDING PAGE ============
function bindLandingPage() {
  document.querySelectorAll('.start-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const landingPage = document.getElementById('landing-page');
      const appLayout = document.getElementById('app-layout');
      if (landingPage) landingPage.style.display = 'none';
      if (appLayout) appLayout.style.display = 'flex';
      
      // Navigate to skills section if skills were selected
      if (state.skills.trim().length > 0 && state.currentStep === 0) {
        // Optional: showStep(4); // 4 is skills section
      }
    });
  });

  const returnHome = () => {
    const landingPage = document.getElementById('landing-page');
    const appLayout = document.getElementById('app-layout');
    if (landingPage) landingPage.style.display = '';
    if (appLayout) appLayout.style.display = 'none';
  };
  
  document.getElementById('logo')?.addEventListener('click', returnHome);
  document.getElementById('top-bar-logo')?.addEventListener('click', returnHome);

  // Handle quiz chips
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      
      // Open MCQ quiz page
      if (typeof Quiz !== 'undefined') {
        Quiz.open(lang);
      }
    });
  });
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    // Only update text nodes that are UI labels, skip elements with child elements
    // that should preserve their children (like buttons with icons)
    if (el.children.length === 0) {
      el.textContent = I18n.t(key);
    } else {
      // For elements with children, only update text content if it's a simple label
      const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = I18n.t(key);
      } else {
        el.textContent = I18n.t(key);
      }
    }
  });
}

// ============ VOICE INPUT ============
function bindMicButtons() {
  document.querySelectorAll('.mic-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const target = document.getElementById(targetId);
      if (target) Voice.start(target, btn);
    });
  });
}

// ============ AI FEATURES ============
function bindAIButtons() {
  // AI Summary
  document.getElementById('btn-ai-summary')?.addEventListener('click', async () => {
    if (!AI.hasKey()) { showToast('Add your Gemini API key in Settings first', 'error'); return; }
    const btn = document.getElementById('btn-ai-summary');
    btn.disabled = true; btn.textContent = '⏳ Generating...';
    try {
      const result = await AI.generateSummary(
        state.personal.title || 'Professional',
        state.skills || 'various skills',
        state.experience.length ? state.experience[0].description : ''
      );
      document.getElementById('input-summary').value = result;
      state.summary = result;
      saveState(); renderResume();
      showToast('Summary generated! ✨', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
    btn.disabled = false; btn.innerHTML = '✨ <span data-i18n="aiSuggest">AI Suggest</span>';
  });

  // AI Skill Suggestions
  document.getElementById('btn-ai-skills')?.addEventListener('click', async () => {
    if (!AI.hasKey()) { showToast('Add your Gemini API key in Settings first', 'error'); return; }
    const btn = document.getElementById('btn-ai-skills');
    btn.disabled = true; btn.textContent = '⏳ Loading...';
    try {
      const suggestions = await AI.suggestSkills(state.personal.title || 'Professional', state.skills);
      const container = document.getElementById('skill-suggestions');
      container.style.display = 'flex';
      container.innerHTML = suggestions.map(s =>
        `<button class="skill-chip" data-skill="${s}">${s} <span>+</span></button>`
      ).join('');
      container.querySelectorAll('.skill-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const skill = chip.dataset.skill;
          const el = document.getElementById('input-skills');
          el.value = el.value ? el.value + ', ' + skill : skill;
          state.skills = el.value;
          chip.remove();
          saveState(); renderResume();
        });
      });
    } catch (err) { showToast(err.message, 'error'); }
    btn.disabled = false; btn.textContent = '✨ Suggest Skills';
  });

  // ATS Score
  document.getElementById('btn-run-ats')?.addEventListener('click', async () => {
    if (!AI.hasKey()) { showToast('Add your Gemini API key in Settings first', 'error'); return; }
    const jd = document.getElementById('input-job-desc')?.value;
    if (!jd) { showToast('Please paste a job description', 'error'); return; }
    const btn = document.getElementById('btn-run-ats');
    btn.disabled = true; btn.textContent = '⏳ Analyzing...';
    try {
      const result = await AI.scoreATS(state, jd);
      displayATSResults(result);
    } catch (err) { showToast(err.message, 'error'); }
    btn.disabled = false; btn.textContent = '✨ Analyze ATS Score';
  });

  // Interview Prep
  document.getElementById('btn-gen-interview')?.addEventListener('click', async () => {
    if (!AI.hasKey()) { showToast('Add your Gemini API key in Settings first', 'error'); return; }
    const btn = document.getElementById('btn-gen-interview');
    btn.disabled = true; btn.textContent = '⏳ Generating...';
    try {
      const questions = await AI.generateInterviewQuestions(state);
      const container = document.getElementById('interview-questions');
      container.innerHTML = questions.map((q, i) => `
        <div class="interview-card">
          <div class="interview-q">Q${i + 1}: ${q.question}</div>
          <div class="interview-a">💡 ${q.approach}</div>
        </div>
      `).join('');
    } catch (err) { showToast(err.message, 'error'); }
    btn.disabled = false; btn.textContent = '✨ Generate Questions';
  });

  // Settings — Save API Key
  document.getElementById('btn-save-key')?.addEventListener('click', () => {
    const key = document.getElementById('input-api-key')?.value;
    if (key) { AI.setApiKey(key); showToast('API key saved! ✅', 'success'); }
  });

  // Settings — Save/Load Resume
  document.getElementById('btn-save-resume')?.addEventListener('click', () => {
    const name = document.getElementById('input-resume-name')?.value.trim();
    if (!name) { showToast('Enter a name for this resume', 'error'); return; }
    saveResumeVersion(name);
    showToast(`"${name}" saved!`, 'success');
    renderResumeManager();
  });

  // Ask Gemini Chat
  document.getElementById('btn-send-gemini')?.addEventListener('click', async () => {
    if (!AI.hasKey()) { showToast('Add your Gemini API key in Settings first', 'error'); return; }
    const inputEl = document.getElementById('gemini-chat-input');
    const prompt = inputEl?.value.trim();
    if (!prompt) { showToast('Please enter a question', 'error'); return; }
    
    const btn = document.getElementById('btn-send-gemini');
    btn.disabled = true; btn.textContent = '⏳ Thinking...';
    
    try {
      const response = await AI.askGeminiChat(prompt, state);
      const resContainer = document.getElementById('gemini-chat-response');
      resContainer.style.display = 'block';
      resContainer.innerHTML = response.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      inputEl.value = '';
    } catch (err) {
      showToast(err.message, 'error');
    }
    btn.disabled = false; btn.textContent = 'Send to Gemini';
  });

  // Suggest Template
  bindSuggestTemplate();
}

// ============ SUGGEST TEMPLATE ============
const TEMPLATE_META = {
  modern:      { label: 'Modern',      icon: '📐', desc: 'Clean two-column layout, great for tech & product roles' },
  classic:     { label: 'Classic',     icon: '📜', desc: 'Traditional serif look, trusted in finance & law' },
  minimal:     { label: 'Minimal',     icon: '✨', desc: 'Ultra-clean whitespace, ideal for design & UX' },
  executive:   { label: 'Executive',   icon: '🏢', desc: 'Bold header, suits senior management & C-suite' },
  creative:    { label: 'Creative',    icon: '🎨', desc: 'Vibrant accents, perfect for marketing & media' },
  tech:        { label: 'Tech',        icon: '💻', desc: 'Code-inspired style, built for engineers & developers' },
  elegant:     { label: 'Elegant',     icon: '👑', desc: 'Refined typography, great for consulting & academia' },
  bold:        { label: 'Bold',        icon: '🔥', desc: 'High-impact visuals, stands out in sales & startups' },
  nebula:      { label: 'Nebula',      icon: '🌌', desc: 'Deep-space dark sidebar with purple/cyan accents' },
  horizon:     { label: 'Horizon',     icon: '🌅', desc: 'Warm terracotta header, two-column professional layout' },
  aurora:      { label: 'Aurora',      icon: '🌈', desc: 'Soft multi-color gradient with glassmorphism contact pills' },
  lunar:       { label: 'Lunar',       icon: '🌙', desc: 'Ultra-minimal monochrome, centered — highly ATS-friendly' },
};

function getRuleBasedSuggestions() {
  const title = (state.personal.title || '').toLowerCase();
  const skills = (state.skills || '').toLowerCase();
  const hasProjects = state.projects.length > 0;

  const scores = Object.fromEntries(Object.keys(TEMPLATE_META).map(k => [k, 0]));

  // Title-based heuristics
  if (/engineer|developer|software|devops|backend|frontend|fullstack/.test(title)) { scores.tech += 3; scores.modern += 2; }
  if (/design|ux|ui|creative|artist|brand/.test(title)) { scores.creative += 3; scores.minimal += 2; }
  if (/manager|director|vp|ceo|cto|executive|lead|head/.test(title)) { scores.executive += 3; scores.elegant += 2; }
  if (/analyst|consultant|finance|banking|legal|lawyer/.test(title)) { scores.classic += 3; scores.elegant += 1; }
  if (/marketing|sales|growth|content|social/.test(title)) { scores.bold += 3; scores.creative += 2; }
  if (/research|professor|academic|scientist/.test(title)) { scores.elegant += 3; scores.classic += 2; }

  // Skills-based heuristics
  if (/react|vue|angular|node|python|java|aws|docker|kubernetes/.test(skills)) { scores.tech += 2; scores.modern += 1; }
  if (/figma|sketch|adobe|photoshop|illustrator/.test(skills)) { scores.creative += 2; scores.minimal += 1; }
  if (/excel|powerbi|sql|tableau|finance/.test(skills)) { scores.classic += 2; scores.executive += 1; }

  // Content-based
  if (hasProjects) { scores.tech += 1; scores.modern += 1; }
  if (state.experience.length >= 3) { scores.executive += 1; scores.elegant += 1; }

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => key);
}

function showSuggestPopup(templates) {
  // Remove any existing popup
  document.getElementById('template-suggest-popup')?.remove();

  const btn = document.getElementById('btn-suggest-template');
  const rect = btn.getBoundingClientRect();

  const popup = document.createElement('div');
  popup.className = 'template-suggest-popup';
  popup.id = 'template-suggest-popup';
  popup.style.top = (rect.bottom + 8) + 'px';
  popup.style.left = Math.max(8, rect.left - 60) + 'px';

  const rankLabels = ['#1 Best', '#2 Pick', '#3 Alt'];
  popup.innerHTML = `
    <h4>✨ AI Template Picks</h4>
    <p>Based on your role and content — click to apply.</p>
    <div class="template-suggest-options">
      ${templates.map((key, i) => {
        const m = TEMPLATE_META[key];
        return `<button class="template-suggest-option" data-tmpl="${key}">
          <span class="opt-rank">${rankLabels[i]}</span>
          <span>${m.icon} ${m.label}</span>
        </button>`;
      }).join('')}
    </div>`;

  document.body.appendChild(popup);

  // Apply template on click
  popup.querySelectorAll('.template-suggest-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const tmpl = opt.dataset.tmpl;
      document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.template === tmpl));
      state.template = tmpl;
      saveState(); renderResume();
      Analytics.trackTemplateUse(tmpl);
      showToast(`Applied "${TEMPLATE_META[tmpl].label}" template ✨`, 'success');
      popup.remove();
    });
  });

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function handler(e) {
      if (!popup.contains(e.target) && e.target.id !== 'btn-suggest-template') {
        popup.remove();
        document.removeEventListener('click', handler);
      }
    });
  }, 50);
}

async function bindSuggestTemplate() {
  document.getElementById('btn-suggest-template')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    // Close existing popup
    if (document.getElementById('template-suggest-popup')) {
      document.getElementById('template-suggest-popup').remove();
      return;
    }

    const btn = document.getElementById('btn-suggest-template');

    if (AI.hasKey()) {
      btn.disabled = true;
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> Thinking…`;
      try {
        const prompt = `Given a resume for "${state.personal.title || 'a professional'}" with skills: "${state.skills || 'general skills'}", suggest the 3 best resume templates from this list: modern, classic, minimal, executive, creative, tech, elegant, bold, nebula, horizon, aurora, lunar. Return ONLY a JSON array of 3 template keys, e.g. ["tech","nebula","modern"]. No explanations.`;
        const raw = await AI.callGemini ? AI.callGemini(prompt) : null;
        // callGemini is internal; use the public askGeminiChat workaround
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AI.getApiKey()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 60 } })
        });
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const parsed = JSON.parse(cleaned);
        const valid = parsed.filter(k => TEMPLATE_META[k]);
        showSuggestPopup(valid.length >= 2 ? valid.slice(0, 3) : getRuleBasedSuggestions());
      } catch {
        showSuggestPopup(getRuleBasedSuggestions());
      }
      btn.disabled = false;
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> Suggest`;
    } else {
      showSuggestPopup(getRuleBasedSuggestions());
    }
  });
}

// ============ ATS RESULTS DISPLAY ============
function displayATSResults(result) {
  document.getElementById('ats-results').style.display = 'block';
  const score = result.score || 0;
  document.getElementById('ats-score-number').textContent = score;

  // Animate ring
  const ring = document.getElementById('ats-ring-fill');
  const circumference = 2 * Math.PI * 54;
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = circumference - (score / 100) * circumference;
  ring.style.stroke = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  const kw = document.getElementById('ats-keywords');
  kw.innerHTML = `
    <h4 style="margin:16px 0 8px;">✅ Matched Keywords</h4>
    <div class="skill-suggestions">${(result.matchedKeywords || []).map(k => `<span class="skill-chip matched">${k}</span>`).join('')}</div>
    <h4 style="margin:16px 0 8px;">❌ Missing Keywords</h4>
    <div class="skill-suggestions">${(result.missingKeywords || []).map(k => `<span class="skill-chip missing">${k}</span>`).join('')}</div>
  `;

  const sug = document.getElementById('ats-suggestions');
  sug.innerHTML = `
    <h4 style="margin:16px 0 8px;">💡 Suggestions</h4>
    <ul class="ats-tips">${(result.suggestions || []).map(s => `<li>${s}</li>`).join('')}</ul>
  `;
}

// ============ RESUME MANAGER ============
function saveResumeVersion(name) {
  const versions = JSON.parse(localStorage.getItem('resumeforge_versions') || '{}');
  versions[name] = JSON.parse(JSON.stringify(state));
  localStorage.setItem('resumeforge_versions', JSON.stringify(versions));
}

function loadResumeVersion(name) {
  const versions = JSON.parse(localStorage.getItem('resumeforge_versions') || '{}');
  if (versions[name]) {
    Object.assign(state, versions[name]);
    saveState();
    location.reload();
  }
}

function deleteResumeVersion(name) {
  const versions = JSON.parse(localStorage.getItem('resumeforge_versions') || '{}');
  delete versions[name];
  localStorage.setItem('resumeforge_versions', JSON.stringify(versions));
}

function renderResumeManager() {
  const list = document.getElementById('resume-manager-list');
  if (!list) return;
  const versions = JSON.parse(localStorage.getItem('resumeforge_versions') || '{}');
  const names = Object.keys(versions);
  if (!names.length) { list.innerHTML = '<p class="hint">No saved resumes yet.</p>'; return; }
  list.innerHTML = names.map(name => `
    <div class="resume-version-item">
      <span class="resume-version-name">${name}</span>
      <div>
        <button class="btn btn-small" onclick="loadResumeVersion('${name}')">Load</button>
        <button class="btn btn-small btn-danger-text" onclick="deleteResumeVersion('${name}');renderResumeManager()">Delete</button>
      </div>
    </div>
  `).join('');
}

// ============ MODALS ============
function bindModals() {
  document.getElementById('btn-settings')?.addEventListener('click', () => { openModal('modal-settings'); renderResumeManager(); });
  document.getElementById('btn-ats')?.addEventListener('click', () => openModal('modal-ats'));
  document.getElementById('btn-interview')?.addEventListener('click', () => openModal('modal-interview'));
  document.getElementById('btn-analytics')?.addEventListener('click', () => { openModal('modal-analytics'); renderAnalytics(); });
  document.getElementById('btn-ask-gemini')?.addEventListener('click', () => openModal('modal-gemini'));

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });
}

function openModal(id) {
  document.getElementById(id).style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
  document.body.style.overflow = '';
}

function renderAnalytics() {
  const stats = Analytics.getStats();
  const body = document.getElementById('analytics-body');
  body.innerHTML = `
    <div class="analytics-grid">
      <div class="analytics-card"><div class="analytics-num">${stats.totalDownloads}</div><div class="analytics-label">Downloads</div></div>
      <div class="analytics-card"><div class="analytics-num">${stats.totalEdits}</div><div class="analytics-label">Edits</div></div>
      <div class="analytics-card"><div class="analytics-num">${stats.favoriteTemplate}</div><div class="analytics-label">Favorite Template</div></div>
      <div class="analytics-card"><div class="analytics-num">${stats.lastEdit}</div><div class="analytics-label">Last Edit</div></div>
    </div>
    ${stats.downloadHistory.length ? `
      <h4 style="margin:20px 0 8px;">Recent Downloads</h4>
      <div class="download-history">${stats.downloadHistory.map(d => `<div class="history-item"><span>${new Date(d.date).toLocaleDateString()}</span><span>${d.template}</span><span>${d.fileName}</span></div>`).join('')}</div>
    ` : ''}
  `;
}

// ============ RENDER ENTRY FORMS ============
function renderAllEntries() { renderExperience(); renderEducation(); renderProjects(); renderCertifications(); }

function renderExperience() {
  const list = document.getElementById('experience-list'); list.innerHTML = '';
  state.experience.forEach((exp, i) => {
    list.appendChild(createEntryCard('Experience', i, [
      { label: I18n.t('jobTitle'), key: 'jobTitle', value: exp.jobTitle, placeholder: 'Software Engineer' },
      { label: I18n.t('company'), key: 'company', value: exp.company, placeholder: 'Google' },
      { label: I18n.t('startDate'), key: 'startDate', value: exp.startDate, placeholder: 'Jan 2022', half: true },
      { label: I18n.t('endDate'), key: 'endDate', value: exp.endDate, placeholder: 'Present', half: true },
      { label: I18n.t('description'), key: 'description', value: exp.description, placeholder: 'Led development of...', textarea: true },
    ], (key, val) => { state.experience[i][key] = val; saveState(); renderResume(); },
    () => { state.experience.splice(i, 1); saveState(); renderExperience(); renderResume(); }));
  });
}

function renderEducation() {
  const list = document.getElementById('education-list'); list.innerHTML = '';
  state.education.forEach((edu, i) => {
    list.appendChild(createEntryCard('Education', i, [
      { label: I18n.t('degree'), key: 'degree', value: edu.degree, placeholder: 'B.S. Computer Science' },
      { label: I18n.t('school'), key: 'school', value: edu.school, placeholder: 'MIT' },
      { label: I18n.t('startDate'), key: 'startDate', value: edu.startDate, placeholder: '2018', half: true },
      { label: I18n.t('endDate'), key: 'endDate', value: edu.endDate, placeholder: '2022', half: true },
      { label: I18n.t('details'), key: 'description', value: edu.description, placeholder: "GPA: 3.9, Dean's List...", textarea: true },
    ], (key, val) => { state.education[i][key] = val; saveState(); renderResume(); },
    () => { state.education.splice(i, 1); saveState(); renderEducation(); renderResume(); }));
  });
}

function renderProjects() {
  const list = document.getElementById('projects-list'); list.innerHTML = '';
  state.projects.forEach((proj, i) => {
    list.appendChild(createEntryCard('Project', i, [
      { label: I18n.t('projectName'), key: 'name', value: proj.name, placeholder: 'My Awesome Project' },
      { label: I18n.t('techStack'), key: 'techStack', value: proj.techStack, placeholder: 'React, Node.js, MongoDB' },
      { label: I18n.t('description'), key: 'description', value: proj.description, placeholder: 'Built a full-stack...', textarea: true },
    ], (key, val) => { state.projects[i][key] = val; saveState(); renderResume(); },
    () => { state.projects.splice(i, 1); saveState(); renderProjects(); renderResume(); }));
  });
}

function renderCertifications() {
  const list = document.getElementById('certifications-list'); list.innerHTML = '';
  state.certifications.forEach((cert, i) => {
    list.appendChild(createEntryCard('Certification', i, [
      { label: I18n.t('certName'), key: 'name', value: cert.name, placeholder: 'AWS Solutions Architect' },
      { label: I18n.t('issuer'), key: 'issuer', value: cert.issuer, placeholder: 'Amazon Web Services' },
      { label: I18n.t('date'), key: 'date', value: cert.date, placeholder: 'March 2023' },
    ], (key, val) => { state.certifications[i][key] = val; saveState(); renderResume(); },
    () => { state.certifications.splice(i, 1); saveState(); renderCertifications(); renderResume(); }));
  });
}

function createEntryCard(type, index, fields, onChange, onRemove) {
  const card = document.createElement('div');
  card.className = 'entry-card';
  const header = document.createElement('div');
  header.className = 'entry-card-header';
  header.innerHTML = `<span>${type} #${index + 1}</span>`;
  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn-remove'; removeBtn.innerHTML = '✕'; removeBtn.title = `Remove ${type}`;
  removeBtn.addEventListener('click', onRemove);
  header.appendChild(removeBtn);
  card.appendChild(header);

  let halfRow = null;
  fields.forEach(field => {
    const group = document.createElement('div');
    group.className = 'form-group';
    const label = document.createElement('label');
    label.textContent = field.label;
    group.appendChild(label);

    let input;
    if (field.textarea) {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = 'text';
    }
    input.placeholder = field.placeholder || '';
    input.value = field.value || '';
    input.addEventListener('input', () => onChange(field.key, input.value));
    group.appendChild(input);

    if (field.half) {
      if (!halfRow) { halfRow = document.createElement('div'); halfRow.className = 'form-row'; card.appendChild(halfRow); }
      halfRow.appendChild(group);
      if (halfRow.children.length === 2) halfRow = null;
    } else {
      card.appendChild(group);
    }
  });
  return card;
}

// ============ RENDER RESUME PREVIEW ============
function renderResume() {
  const p = state.personal;
  const hasContent = p.firstName || p.lastName || p.title || state.summary ||
    state.experience.length || state.education.length || state.skills ||
    state.projects.length || state.certifications.length;

  if (!hasContent) {
    resumePage.className = 'resume-page';
    resumePage.innerHTML = `
      <div class="resume-empty-state">
        <div class="empty-icon">📄</div>
        <h3>${I18n.t('emptyTitle')}</h3>
        <p>${I18n.t('emptySub')}</p>
      </div>`;
    return;
  }

  resumePage.className = `resume-page template-${state.template}`;
  resumePage.innerHTML = Templates.render(state);
}

// ============ HELPERS ============
function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDescription(text) {
  return Templates.formatDesc(text);
}

// ============ PDF DOWNLOAD ============
async function downloadPDF() {
  const source = document.getElementById('resume-page');
  if (!source || source.querySelector('.resume-empty-state')) {
    showToast('Please fill in some information first!', 'error');
    return;
  }

  // Show loading state on button
  const btn = document.getElementById('btn-download');
  const btnOrigHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> <span>Generating…</span>`;

  // Add spin keyframe if not already present
  if (!document.getElementById('spin-style')) {
    const s = document.createElement('style');
    s.id = 'spin-style';
    s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(s);
  }

  const firstName = state.personal.firstName || 'My';
  const lastName  = state.personal.lastName  || 'Resume';
  const fileName  = `${firstName}_${lastName}_Resume.pdf`;

  // A4 dimensions at 96 dpi
  const A4_W = 794;   // px
  const A4_H = 1123;  // px

  // The preview renders at this width (from CSS max-width)
  const PREVIEW_W = 370;

  // Scale factor to go from preview size → A4
  const scaleFactor = A4_W / PREVIEW_W; // ≈ 2.146

  // ── 1. Deep-clone preserving all template CSS classes ──
  const clone = source.cloneNode(true);

  // Clear zoom transform and preview sizing; set to scaled-up A4 size
  clone.style.cssText = `
    width: ${PREVIEW_W}px !important;
    max-width: none !important;
    min-height: auto !important;
    height: auto !important;
    transform: scale(${scaleFactor}) !important;
    transform-origin: top left !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    overflow: visible !important;
    font-size: 0.65rem !important;
  `;

  // ── 2. Off-screen wrapper at exact A4 width ──
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position: fixed;
    top: -99999px;
    left: 0;
    width: ${A4_W}px;
    min-height: ${A4_H}px;
    background: #fff;
    overflow: visible;
    z-index: -1000;
  `;
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // Small wait for fonts & layout to settle
  await new Promise(r => setTimeout(r, 250));

  // Measure actual content height after scaling
  const scaledHeight = clone.scrollHeight * scaleFactor;
  wrapper.style.minHeight = Math.max(A4_H, scaledHeight) + 'px';

  const opt = {
    margin:    0,
    filename:  fileName,
    image:     { type: 'jpeg', quality: 0.99 },
    html2canvas: {
      scale:         2,          // 2× for crisp hi-res output
      useCORS:       true,
      letterRendering: true,
      scrollX:       0,
      scrollY:       0,
      width:         A4_W,
      windowWidth:   A4_W,
    },
    jsPDF: {
      unit:        'mm',
      format:      'a4',
      orientation: 'portrait',
    },
    pagebreak: {
      mode:    ['avoid-all', 'css', 'legacy'],
      before:  '.page-break-before',
      after:   '.page-break-after',
      avoid:   ['.resume-entry', '.resume-section', '.resume-header', '.horizon-header', '.aurora-header', '.lunar-header', '.nebula-sidebar'],
    },
  };

  try {
    await html2pdf().set(opt).from(wrapper).save();
    showToast('✅ PDF downloaded successfully!', 'success');
    Analytics.trackDownload(state.template, fileName);
  } catch (err) {
    console.error('PDF error:', err);
    showToast('Failed to generate PDF. Please try again.', 'error');
  } finally {
    document.body.removeChild(wrapper);
    btn.disabled  = false;
    btn.innerHTML = btnOrigHtml;
  }
}


// ============ TOAST ============
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 300); }, 3000);
}

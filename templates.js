/* ========================================
   ResumeForge — Template Renderer Engine
   8 professional templates
   ======================================== */

const Templates = (() => {

  function esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDesc(text) {
    if (!text) return '';
    const lines = text.split('\n').filter(l => l.trim());
    const hasBullets = lines.some(l => /^\s*[-•*]\s/.test(l));
    if (hasBullets) {
      const items = lines.map(l => {
        const cleaned = l.replace(/^\s*[-•*]\s*/, '');
        return `<li>${esc(cleaned)}</li>`;
      }).join('');
      return `<ul style="margin:4px 0 0 16px;padding:0;list-style:disc;">${items}</ul>`;
    }
    return esc(text);
  }

  // Build common section HTML used by most templates
  function buildSections(state) {
    const p = state.personal;
    const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Your Name';
    const contacts = [];
    if (p.email) contacts.push(`<span class="resume-contact-item">📧 ${esc(p.email)}</span>`);
    if (p.phone) contacts.push(`<span class="resume-contact-item">📱 ${esc(p.phone)}</span>`);
    if (p.location) contacts.push(`<span class="resume-contact-item">📍 ${esc(p.location)}</span>`);
    if (p.website) contacts.push(`<span class="resume-contact-item">🔗 ${esc(p.website)}</span>`);

    let html = '';

    if (state.summary) {
      html += `<div class="resume-section"><div class="resume-section-title">Professional Summary</div><p class="resume-summary-text">${esc(state.summary)}</p></div>`;
    }

    if (state.experience.length) {
      const entries = state.experience.map(e => {
        if (!e.jobTitle && !e.company && !e.description) return '';
        const d = [e.startDate, e.endDate].filter(Boolean).join(' — ');
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(e.jobTitle || 'Untitled Position')}</span><span class="resume-entry-date">${esc(d)}</span></div><div class="resume-entry-subtitle">${esc(e.company || '')}</div><div class="resume-entry-description">${formatDesc(e.description)}</div></div>`;
      }).join('');
      if (entries.trim()) html += `<div class="resume-section"><div class="resume-section-title">Work Experience</div>${entries}</div>`;
    }

    if (state.education.length) {
      const entries = state.education.map(e => {
        if (!e.degree && !e.school && !e.description) return '';
        const d = [e.startDate, e.endDate].filter(Boolean).join(' — ');
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(e.degree || 'Untitled Degree')}</span><span class="resume-entry-date">${esc(d)}</span></div><div class="resume-entry-subtitle">${esc(e.school || '')}</div><div class="resume-entry-description">${formatDesc(e.description)}</div></div>`;
      }).join('');
      if (entries.trim()) html += `<div class="resume-section"><div class="resume-section-title">Education</div>${entries}</div>`;
    }

    if (state.skills) {
      const tags = state.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => `<span class="resume-skill-tag">${esc(s)}</span>`).join('');
      html += `<div class="resume-section"><div class="resume-section-title">Skills</div><div class="resume-skills-grid">${tags}</div></div>`;
    }

    if (state.projects.length) {
      const entries = state.projects.map(proj => {
        if (!proj.name && !proj.description) return '';
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(proj.name || 'Untitled Project')}</span><span class="resume-entry-date">${esc(proj.techStack || '')}</span></div><div class="resume-entry-description">${formatDesc(proj.description)}</div></div>`;
      }).join('');
      if (entries.trim()) html += `<div class="resume-section"><div class="resume-section-title">Projects</div>${entries}</div>`;
    }

    if (state.certifications.length) {
      const entries = state.certifications.map(c => {
        if (!c.name) return '';
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(c.name)}</span><span class="resume-entry-date">${esc(c.date || '')}</span></div><div class="resume-entry-subtitle">${esc(c.issuer || '')}</div></div>`;
      }).join('');
      if (entries.trim()) html += `<div class="resume-section"><div class="resume-section-title">Certifications</div>${entries}</div>`;
    }

    return { fullName, contacts, sectionsHtml: html };
  }

  // Photo HTML helper
  function photoHtml(state, cls) {
    if (!state.profilePhoto) return '';
    return `<div class="${cls}"><img src="${state.profilePhoto}" alt="Profile" /></div>`;
  }

  // Standard layout (used by Modern, Classic, Minimal, Creative, Tech, Elegant, Bold)
  function renderStandard(state) {
    const { fullName, contacts, sectionsHtml } = buildSections(state);
    const p = state.personal;
    return `
      <div class="resume-header">
        ${photoHtml(state, 'resume-photo')}
        <div class="resume-header-text">
          <div class="resume-name">${esc(fullName)}</div>
          ${p.title ? `<div class="resume-title">${esc(p.title)}</div>` : ''}
          ${contacts.length ? `<div class="resume-contact">${contacts.join('')}</div>` : ''}
        </div>
      </div>
      <div class="resume-body">${sectionsHtml}</div>
    `;
  }

  // Executive two-column layout
  function renderExecutive(state) {
    const p = state.personal;
    const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Your Name';

    const contactHtml = [
      p.email && `<span class="resume-contact-item">📧 ${esc(p.email)}</span>`,
      p.phone && `<span class="resume-contact-item">📱 ${esc(p.phone)}</span>`,
      p.location && `<span class="resume-contact-item">📍 ${esc(p.location)}</span>`,
      p.website && `<span class="resume-contact-item">🔗 ${esc(p.website)}</span>`,
    ].filter(Boolean).join('');

    const skillsSidebar = state.skills
      ? `<div class="resume-section sidebar-section"><div class="resume-section-title">Skills</div><div class="resume-skills-grid">${state.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => `<span class="resume-skill-tag">${esc(s)}</span>`).join('')}</div></div>`
      : '';

    const certsSidebar = state.certifications.length
      ? `<div class="resume-section sidebar-section"><div class="resume-section-title">Certifications</div>${state.certifications.map(c => c.name ? `<div class="resume-entry"><div class="resume-entry-title" style="color:rgba(255,255,255,0.85);font-size:0.57rem;font-weight:700;">${esc(c.name)}</div>${c.issuer ? `<div style="font-size:0.52rem;color:rgba(200,169,74,0.8);margin-top:1px;">${esc(c.issuer)}</div>` : ''}${c.date ? `<div style="font-size:0.5rem;color:rgba(255,255,255,0.4);margin-top:1px;">${esc(c.date)}</div>` : ''}</div>` : '').join('')}</div>`
      : '';

    let mainHtml = '';
    if (state.summary) {
      mainHtml += `<div class="resume-section"><div class="resume-section-title">Profile</div><p class="resume-summary-text">${esc(state.summary)}</p></div>`;
    }
    if (state.experience.length) {
      const entries = state.experience.map(e => {
        if (!e.jobTitle && !e.company && !e.description) return '';
        const d = [e.startDate, e.endDate].filter(Boolean).join(' — ');
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(e.jobTitle || 'Untitled')}</span><span class="resume-entry-date">${esc(d)}</span></div><div class="resume-entry-subtitle">${esc(e.company || '')}</div><div class="resume-entry-description">${formatDesc(e.description)}</div></div>`;
      }).join('');
      if (entries.trim()) mainHtml += `<div class="resume-section"><div class="resume-section-title">Experience</div>${entries}</div>`;
    }
    if (state.education.length) {
      const entries = state.education.map(e => {
        if (!e.degree && !e.school) return '';
        const d = [e.startDate, e.endDate].filter(Boolean).join(' — ');
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(e.degree || 'Degree')}</span><span class="resume-entry-date">${esc(d)}</span></div><div class="resume-entry-subtitle">${esc(e.school || '')}</div><div class="resume-entry-description">${formatDesc(e.description)}</div></div>`;
      }).join('');
      if (entries.trim()) mainHtml += `<div class="resume-section"><div class="resume-section-title">Education</div>${entries}</div>`;
    }
    if (state.projects.length) {
      const entries = state.projects.map(proj => {
        if (!proj.name && !proj.description) return '';
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(proj.name || 'Untitled Project')}</span><span class="resume-entry-date">${esc(proj.techStack || '')}</span></div><div class="resume-entry-description">${formatDesc(proj.description)}</div></div>`;
      }).join('');
      if (entries.trim()) mainHtml += `<div class="resume-section"><div class="resume-section-title">Projects</div>${entries}</div>`;
    }

    return `
      <div class="resume-header">
        <div class="resume-header-sidebar">
          ${photoHtml(state, 'resume-photo executive-photo')}
          <div class="resume-name">${esc(fullName)}</div>
          ${p.title ? `<div class="resume-title">${esc(p.title)}</div>` : ''}
        </div>
        <div class="resume-header-main">
          <div class="resume-contact">${contactHtml}</div>
        </div>
      </div>
      <div class="resume-body">
        <div class="resume-body-sidebar">${skillsSidebar}${certsSidebar}</div>
        <div class="resume-body-main">${mainHtml}</div>
      </div>
    `;
  }

  // ── NEBULA: Deep-space dark with purple/cyan gradient sidebar ──
  function renderNebula(state) {
    const p = state.personal;
    const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Your Name';

    const contactHtml = [
      p.email    && `<div class="resume-contact-item">📧 ${esc(p.email)}</div>`,
      p.phone    && `<div class="resume-contact-item">📱 ${esc(p.phone)}</div>`,
      p.location && `<div class="resume-contact-item">📍 ${esc(p.location)}</div>`,
      p.website  && `<div class="resume-contact-item">🔗 ${esc(p.website)}</div>`,
    ].filter(Boolean).join('');

    const skillsSide = state.skills
      ? `<div class="resume-section"><div class="resume-section-title">Skills</div><div class="resume-skills-grid">${state.skills.split(',').map(s=>s.trim()).filter(Boolean).map(s=>`<span class="resume-skill-tag">${esc(s)}</span>`).join('')}</div></div>`
      : '';
    const certsSide = state.certifications.length
      ? `<div class="resume-section"><div class="resume-section-title">Certifications</div>${state.certifications.map(c=>c.name?`<div class="resume-entry"><div class="resume-entry-title">${esc(c.name)}</div>${c.issuer?`<div class="resume-entry-subtitle">${esc(c.issuer)}</div>`:''}</div>`:'').join('')}</div>`
      : '';

    let mainHtml = '';
    if (state.summary) mainHtml += `<div class="resume-section"><div class="resume-section-title">About</div><p class="resume-summary-text">${esc(state.summary)}</p></div>`;
    if (state.experience.length) {
      const entries = state.experience.map(e => {
        if (!e.jobTitle && !e.company) return '';
        const d = [e.startDate, e.endDate].filter(Boolean).join(' – ');
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(e.jobTitle||'Position')}</span><span class="resume-entry-date">${esc(d)}</span></div><div class="resume-entry-subtitle">${esc(e.company||'')}</div><div class="resume-entry-description">${formatDesc(e.description)}</div></div>`;
      }).join('');
      if (entries.trim()) mainHtml += `<div class="resume-section"><div class="resume-section-title">Experience</div>${entries}</div>`;
    }
    if (state.education.length) {
      const entries = state.education.map(e => {
        if (!e.degree && !e.school) return '';
        const d = [e.startDate, e.endDate].filter(Boolean).join(' – ');
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(e.degree||'Degree')}</span><span class="resume-entry-date">${esc(d)}</span></div><div class="resume-entry-subtitle">${esc(e.school||'')}</div><div class="resume-entry-description">${formatDesc(e.description)}</div></div>`;
      }).join('');
      if (entries.trim()) mainHtml += `<div class="resume-section"><div class="resume-section-title">Education</div>${entries}</div>`;
    }
    if (state.projects.length) {
      const entries = state.projects.map(proj => {
        if (!proj.name) return '';
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(proj.name)}</span><span class="resume-entry-date">${esc(proj.techStack||'')}</span></div><div class="resume-entry-description">${formatDesc(proj.description)}</div></div>`;
      }).join('');
      if (entries.trim()) mainHtml += `<div class="resume-section"><div class="resume-section-title">Projects</div>${entries}</div>`;
    }

    return `
      <div class="resume-body" style="display:flex;min-height:520px;">
        <div class="nebula-sidebar">
          ${photoHtml(state, 'resume-photo nebula-photo')}
          <div class="nebula-name">${esc(fullName)}</div>
          ${p.title ? `<div class="nebula-role">${esc(p.title)}</div>` : ''}
          <div class="nebula-contacts">${contactHtml}</div>
          <div class="nebula-side-sections">${skillsSide}${certsSide}</div>
        </div>
        <div class="nebula-main">${mainHtml}</div>
      </div>`;
  }

  // ── HORIZON: Warm terracotta/peach split-header, two-section clean ──
  function renderHorizon(state) {
    const p = state.personal;
    const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Your Name';
    const contacts = [
      p.email    && `<span class="resume-contact-item">📧 ${esc(p.email)}</span>`,
      p.phone    && `<span class="resume-contact-item">📱 ${esc(p.phone)}</span>`,
      p.location && `<span class="resume-contact-item">📍 ${esc(p.location)}</span>`,
      p.website  && `<span class="resume-contact-item">🔗 ${esc(p.website)}</span>`,
    ].filter(Boolean).join('');

    let bodyLeft = '';
    if (state.skills) {
      bodyLeft += `<div class="resume-section"><div class="resume-section-title">Skills</div><div class="resume-skills-grid">${state.skills.split(',').map(s=>s.trim()).filter(Boolean).map(s=>`<span class="resume-skill-tag">${esc(s)}</span>`).join('')}</div></div>`;
    }
    if (state.certifications.length) {
      const certs = state.certifications.map(c=>c.name?`<div class="resume-entry"><div class="resume-entry-title">${esc(c.name)}</div>${c.issuer?`<div class="resume-entry-subtitle">${esc(c.issuer)}</div>`:''}${c.date?`<div class="resume-entry-date">${esc(c.date)}</div>`:''}</div>`:'').join('');
      if (certs.trim()) bodyLeft += `<div class="resume-section"><div class="resume-section-title">Certifications</div>${certs}</div>`;
    }
    if (state.education.length) {
      const entries = state.education.map(e=>{
        if (!e.degree&&!e.school) return '';
        const d=[e.startDate,e.endDate].filter(Boolean).join(' – ');
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(e.degree||'Degree')}</span><span class="resume-entry-date">${esc(d)}</span></div><div class="resume-entry-subtitle">${esc(e.school||'')}</div></div>`;
      }).join('');
      if (entries.trim()) bodyLeft += `<div class="resume-section"><div class="resume-section-title">Education</div>${entries}</div>`;
    }

    let bodyRight = '';
    if (state.summary) bodyRight += `<div class="resume-section"><div class="resume-section-title">Profile</div><p class="resume-summary-text">${esc(state.summary)}</p></div>`;
    if (state.experience.length) {
      const entries = state.experience.map(e=>{
        if (!e.jobTitle&&!e.company) return '';
        const d=[e.startDate,e.endDate].filter(Boolean).join(' – ');
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(e.jobTitle||'Position')}</span><span class="resume-entry-date">${esc(d)}</span></div><div class="resume-entry-subtitle">${esc(e.company||'')}</div><div class="resume-entry-description">${formatDesc(e.description)}</div></div>`;
      }).join('');
      if (entries.trim()) bodyRight += `<div class="resume-section"><div class="resume-section-title">Experience</div>${entries}</div>`;
    }
    if (state.projects.length) {
      const entries = state.projects.map(proj=>{
        if (!proj.name) return '';
        return `<div class="resume-entry"><div class="resume-entry-header"><span class="resume-entry-title">${esc(proj.name)}</span><span class="resume-entry-date">${esc(proj.techStack||'')}</span></div><div class="resume-entry-description">${formatDesc(proj.description)}</div></div>`;
      }).join('');
      if (entries.trim()) bodyRight += `<div class="resume-section"><div class="resume-section-title">Projects</div>${entries}</div>`;
    }

    return `
      <div class="horizon-header">
        ${photoHtml(state, 'resume-photo horizon-photo')}
        <div class="horizon-header-text">
          <div class="horizon-name">${esc(fullName)}</div>
          ${p.title ? `<div class="horizon-role">${esc(p.title)}</div>` : ''}
          <div class="horizon-contacts">${contacts}</div>
        </div>
      </div>
      <div class="horizon-body">
        <div class="horizon-left">${bodyLeft}</div>
        <div class="horizon-right">${bodyRight}</div>
      </div>`;
  }

  // ── AURORA: Soft pastel gradient, glassmorphism contact pills ──
  function renderAurora(state) {
    const { fullName, contacts, sectionsHtml } = buildSections(state);
    const p = state.personal;
    return `
      <div class="aurora-header">
        <div class="aurora-glow"></div>
        ${photoHtml(state, 'resume-photo aurora-photo')}
        <div class="aurora-header-text">
          <div class="aurora-name">${esc(fullName)}</div>
          ${p.title ? `<div class="aurora-role">${esc(p.title)}</div>` : ''}
          ${contacts.length ? `<div class="resume-contact aurora-contacts">${contacts.join('')}</div>` : ''}
        </div>
      </div>
      <div class="aurora-body">${sectionsHtml}</div>`;
  }

  // ── LUNAR: Ultra-minimal monochrome, strong typography, centered ──
  function renderLunar(state) {
    const { fullName, contacts, sectionsHtml } = buildSections(state);
    const p = state.personal;
    return `
      <div class="lunar-header">
        ${photoHtml(state, 'resume-photo lunar-photo')}
        <div class="lunar-name">${esc(fullName)}</div>
        ${p.title ? `<div class="lunar-role">${esc(p.title)}</div>` : ''}
        <div class="lunar-divider"></div>
        ${contacts.length ? `<div class="resume-contact lunar-contacts">${contacts.join('')}</div>` : ''}
      </div>
      <div class="lunar-body">${sectionsHtml}</div>`;
  }

  // Public API
  return {
    render(state) {
      if (state.template === 'executive') return renderExecutive(state);
      if (state.template === 'nebula')    return renderNebula(state);
      if (state.template === 'horizon')   return renderHorizon(state);
      if (state.template === 'aurora')    return renderAurora(state);
      if (state.template === 'lunar')     return renderLunar(state);
      return renderStandard(state);
    },
    esc,
    formatDesc
  };
})();

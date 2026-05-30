/* ========================================
   ResumeForge — Analytics Module
   Local tracking of downloads and edits
   ======================================== */

const Analytics = (() => {
  const STORAGE_KEY = 'resumeforge_analytics';

  function getData() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || getDefault();
    } catch { return getDefault(); }
  }

  function getDefault() {
    return {
      totalDownloads: 0,
      totalEdits: 0,
      templateUsage: {},
      downloadHistory: [],
      editHistory: [],
      createdAt: new Date().toISOString(),
      lastEditAt: null,
    };
  }

  function save(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { }
  }

  function trackDownload(template, fileName) {
    const data = getData();
    data.totalDownloads++;
    data.downloadHistory.push({
      date: new Date().toISOString(),
      template,
      fileName
    });
    // Keep last 50
    if (data.downloadHistory.length > 50) data.downloadHistory = data.downloadHistory.slice(-50);
    save(data);
  }

  function trackEdit() {
    const data = getData();
    data.totalEdits++;
    data.lastEditAt = new Date().toISOString();
    save(data);
  }

  function trackTemplateUse(template) {
    const data = getData();
    data.templateUsage[template] = (data.templateUsage[template] || 0) + 1;
    save(data);
  }

  function getStats() {
    const data = getData();
    const fav = Object.entries(data.templateUsage).sort((a, b) => b[1] - a[1]);
    return {
      totalDownloads: data.totalDownloads,
      totalEdits: data.totalEdits,
      favoriteTemplate: fav.length ? fav[0][0] : 'None',
      lastEdit: data.lastEditAt ? new Date(data.lastEditAt).toLocaleDateString() : 'Never',
      downloadHistory: data.downloadHistory.slice(-10).reverse(),
      createdAt: new Date(data.createdAt).toLocaleDateString(),
    };
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { trackDownload, trackEdit, trackTemplateUse, getStats, reset };
})();

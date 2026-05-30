/* ========================================
   ResumeForge — i18n Module
   English, Hindi, Marathi UI translations
   ======================================== */

const I18n = (() => {
  let currentLang = 'en';

  const translations = {
    en: {
      // Nav
      contact: 'Contact', summary: 'Summary', experience: 'Experience',
      education: 'Education', skills: 'Skills', projects: 'Projects',
      certifications: 'Certifications',
      // Section headings
      headerTitle: "Let's start with your header",
      headerSub: 'Include your full name and multiple ways for employers to reach you.',
      summaryTitle: 'Write your professional summary',
      summarySub: 'A brief overview of your experience, strengths, and career goals.',
      experienceTitle: 'Tell us about your work experience',
      experienceSub: 'List your most recent positions first, including key responsibilities.',
      educationTitle: 'Education',
      educationSub: 'Add your degrees, certifications, and relevant coursework.',
      skillsTitle: 'Highlight your skills',
      skillsSub: 'List both technical and soft skills relevant to the roles you\'re targeting.',
      projectsTitle: 'Show off your projects',
      projectsSub: 'Highlight personal or professional projects that demonstrate your abilities.',
      certsTitle: 'Add certifications',
      certsSub: 'Include relevant professional certifications and licenses.',
      // Labels
      firstName: 'First Name', lastName: 'Last Name',
      professionalTitle: 'Professional Title', email: 'Email',
      phone: 'Phone', location: 'City / Location',
      website: 'Website / LinkedIn', summaryLabel: 'Summary',
      skillsLabel: 'Skills', skillsHint: '(comma-separated)',
      jobTitle: 'Job Title', company: 'Company',
      startDate: 'Start Date', endDate: 'End Date',
      description: 'Description', degree: 'Degree',
      school: 'School', details: 'Details',
      projectName: 'Project Name', techStack: 'Tech Stack',
      certName: 'Certification Name', issuer: 'Issuing Organization',
      date: 'Date',
      // Buttons
      back: 'Back', continue: 'Continue', downloadPdf: 'Download PDF',
      clear: 'Clear', addExperience: 'Add Experience',
      addEducation: 'Add Education', addProject: 'Add Project',
      addCertification: 'Add Certification',
      // AI
      aiSuggest: 'AI Suggest', atsCheck: 'ATS Check',
      interviewPrep: 'Interview Prep', settings: 'Settings',
      // Misc
      darkMode: 'Dark Mode', language: 'Language',
      profilePhoto: 'Profile Photo', uploadPhoto: 'Upload Photo',
      removePhoto: 'Remove', analytics: 'Analytics',
      resumeManager: 'My Resumes',
      emptyTitle: 'Your Resume Preview',
      emptySub: 'Start filling in the form to see your resume come to life!',
    },
    hi: {
      contact: 'संपर्क', summary: 'सारांश', experience: 'अनुभव',
      education: 'शिक्षा', skills: 'कौशल', projects: 'प्रोजेक्ट',
      certifications: 'प्रमाणपत्र',
      headerTitle: 'अपने हेडर से शुरू करें',
      headerSub: 'अपना पूरा नाम और नियोक्ताओं से संपर्क के तरीके शामिल करें।',
      summaryTitle: 'अपना पेशेवर सारांश लिखें',
      summarySub: 'अपने अनुभव, शक्तियों और करियर लक्ष्यों का संक्षिप्त विवरण।',
      experienceTitle: 'अपने कार्य अनुभव के बारे में बताएं',
      experienceSub: 'अपनी सबसे हालिया पदों को पहले सूचीबद्ध करें।',
      educationTitle: 'शिक्षा',
      educationSub: 'अपनी डिग्री और प्रासंगिक कोर्सवर्क जोड़ें।',
      skillsTitle: 'अपने कौशल को हाइलाइट करें',
      skillsSub: 'तकनीकी और सॉफ्ट दोनों कौशल सूचीबद्ध करें।',
      projectsTitle: 'अपने प्रोजेक्ट दिखाएं',
      projectsSub: 'अपनी क्षमताओं को प्रदर्शित करने वाले प्रोजेक्ट हाइलाइट करें।',
      certsTitle: 'प्रमाणपत्र जोड़ें',
      certsSub: 'प्रासंगिक पेशेवर प्रमाणपत्र शामिल करें।',
      firstName: 'पहला नाम', lastName: 'अंतिम नाम',
      professionalTitle: 'पेशेवर शीर्षक', email: 'ईमेल',
      phone: 'फ़ोन', location: 'शहर / स्थान',
      website: 'वेबसाइट / लिंक्डइन', summaryLabel: 'सारांश',
      skillsLabel: 'कौशल', skillsHint: '(अल्पविराम से अलग)',
      jobTitle: 'पद का नाम', company: 'कंपनी',
      startDate: 'प्रारंभ तिथि', endDate: 'समाप्ति तिथि',
      description: 'विवरण', degree: 'डिग्री',
      school: 'स्कूल', details: 'विवरण',
      projectName: 'प्रोजेक्ट का नाम', techStack: 'टेक स्टैक',
      certName: 'प्रमाणपत्र का नाम', issuer: 'जारी करने वाला संगठन',
      date: 'तारीख',
      back: 'पीछे', continue: 'जारी रखें', downloadPdf: 'PDF डाउनलोड',
      clear: 'साफ़ करें', addExperience: 'अनुभव जोड़ें',
      addEducation: 'शिक्षा जोड़ें', addProject: 'प्रोजेक्ट जोड़ें',
      addCertification: 'प्रमाणपत्र जोड़ें',
      aiSuggest: 'AI सुझाव', atsCheck: 'ATS जांच',
      interviewPrep: 'साक्षात्कार तैयारी', settings: 'सेटिंग्स',
      darkMode: 'डार्क मोड', language: 'भाषा',
      profilePhoto: 'प्रोफ़ाइल फ़ोटो', uploadPhoto: 'फ़ोटो अपलोड',
      removePhoto: 'हटाएं', analytics: 'विश्लेषण',
      resumeManager: 'मेरे रिज्यूमे',
      emptyTitle: 'आपका रिज्यूमे प्रीव्यू',
      emptySub: 'अपना रिज्यूमे देखने के लिए फ़ॉर्म भरना शुरू करें!',
    },
    mr: {
      contact: 'संपर्क', summary: 'सारांश', experience: 'अनुभव',
      education: 'शिक्षण', skills: 'कौशल्ये', projects: 'प्रकल्प',
      certifications: 'प्रमाणपत्रे',
      headerTitle: 'तुमच्या हेडरपासून सुरुवात करा',
      headerSub: 'तुमचे पूर्ण नाव आणि नियोक्त्यांशी संपर्क साधण्याचे मार्ग समाविष्ट करा.',
      summaryTitle: 'तुमचा व्यावसायिक सारांश लिहा',
      summarySub: 'तुमच्या अनुभवाचे, सामर्थ्यांचे संक्षिप्त वर्णन.',
      experienceTitle: 'तुमच्या कामाच्या अनुभवाबद्दल सांगा',
      experienceSub: 'तुमच्या अलीकडील पदांची यादी करा.',
      educationTitle: 'शिक्षण',
      educationSub: 'तुमच्या पदव्या आणि संबंधित अभ्यासक्रम जोडा.',
      skillsTitle: 'तुमची कौशल्ये हायलाइट करा',
      skillsSub: 'तांत्रिक आणि सॉफ्ट दोन्ही कौशल्ये सूचीबद्ध करा.',
      projectsTitle: 'तुमचे प्रकल्प दाखवा',
      projectsSub: 'तुमच्या क्षमता दर्शवणारे प्रकल्प हायलाइट करा.',
      certsTitle: 'प्रमाणपत्रे जोडा',
      certsSub: 'संबंधित व्यावसायिक प्रमाणपत्रे समाविष्ट करा.',
      firstName: 'पहिले नाव', lastName: 'आडनाव',
      professionalTitle: 'व्यावसायिक शीर्षक', email: 'ईमेल',
      phone: 'फोन', location: 'शहर / ठिकाण',
      website: 'वेबसाइट / लिंक्डइन', summaryLabel: 'सारांश',
      skillsLabel: 'कौशल्ये', skillsHint: '(स्वल्पविरामाने वेगळे)',
      jobTitle: 'पदाचे नाव', company: 'कंपनी',
      startDate: 'सुरुवातीची तारीख', endDate: 'शेवटची तारीख',
      description: 'वर्णन', degree: 'पदवी',
      school: 'शाळा', details: 'तपशील',
      projectName: 'प्रकल्पाचे नाव', techStack: 'टेक स्टॅक',
      certName: 'प्रमाणपत्राचे नाव', issuer: 'जारी करणारी संस्था',
      date: 'तारीख',
      back: 'मागे', continue: 'पुढे', downloadPdf: 'PDF डाउनलोड',
      clear: 'साफ करा', addExperience: 'अनुभव जोडा',
      addEducation: 'शिक्षण जोडा', addProject: 'प्रकल्प जोडा',
      addCertification: 'प्रमाणपत्र जोडा',
      aiSuggest: 'AI सूचना', atsCheck: 'ATS तपासणी',
      interviewPrep: 'मुलाखत तयारी', settings: 'सेटिंग्ज',
      darkMode: 'डार्क मोड', language: 'भाषा',
      profilePhoto: 'प्रोफाइल फोटो', uploadPhoto: 'फोटो अपलोड',
      removePhoto: 'काढा', analytics: 'विश्लेषण',
      resumeManager: 'माझे रिझ्युमे',
      emptyTitle: 'तुमचा रिझ्युमे प्रीव्यू',
      emptySub: 'तुमचा रिझ्युमे पाहण्यासाठी फॉर्म भरण्यास सुरुवात करा!',
    }
  };

  function setLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'en' ? 'en' : lang === 'hi' ? 'hi' : 'mr';
  }

  function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key;
  }

  function getLang() { return currentLang; }

  function getSpeechLang() {
    const map = { en: 'en-US', hi: 'hi-IN', mr: 'mr-IN' };
    return map[currentLang] || 'en-US';
  }

  return { setLang, getLang, t, getSpeechLang };
})();

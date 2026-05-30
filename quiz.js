const QuizData = {
  "JavaScript": [
    { q: "What is a closure in JavaScript?", options: ["A feature to lock variables", "A combination of a function and its lexical environment", "A loop termination", "A way to close browser tabs"], ans: 1 },
    { q: "Which method converts JSON data to a JavaScript object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.toObj()"], ans: 0 },
    { q: "What does 'typeof null' return?", options: ["null", "undefined", "object", "string"], ans: 2 }
  ],
  "Python": [
    { q: "What is a decorator in Python?", options: ["A design pattern", "A string formatting tool", "A function that takes another function and extends its behavior", "A variable type"], ans: 2 },
    { q: "Which keyword is used for handling exceptions?", options: ["catch", "except", "error", "throw"], ans: 1 },
    { q: "What does the 'self' keyword represent?", options: ["The parent class", "A global variable", "The instance of the class", "None of the above"], ans: 2 }
  ],
  "Java": [
    { q: "What is the size of an int in Java?", options: ["8 bits", "16 bits", "32 bits", "64 bits"], ans: 2 },
    { q: "Which of these is not an access modifier in Java?", options: ["public", "protected", "virtual", "private"], ans: 2 },
    { q: "What is the root class from which every class in Java inherits?", options: ["Object", "Class", "Root", "Parent"], ans: 0 }
  ],
  "React": [
    { q: "What hook is used to perform side effects?", options: ["useState", "useContext", "useEffect", "useReducer"], ans: 2 },
    { q: "Properties passed from a parent to a child in React are called:", options: ["State", "Props", "Context", "Values"], ans: 1 },
    { q: "What is the Virtual DOM?", options: ["A direct copy of the real DOM", "A lightweight, in-memory representation of the actual DOM", "A browser feature", "A server-side DOM cache"], ans: 1 }
  ],
  "C++": [
    { q: "What is a virtual function?", options: ["A function with no body", "A math function", "A member function you expect to be redefined in derived classes", "A function executed in a virtual machine"], ans: 2 },
    { q: "Which operator is used to allocate memory dynamically?", options: ["malloc", "alloc", "new", "pointer"], ans: 2 },
    { q: "What does 'cout' represent?", options: ["Character output stream", "Console out", "Standard output stream in C++", "All of the above"], ans: 3 }
  ],
  "Node.js": [
    { q: "Which engine powers Node.js?", options: ["SpiderMonkey", "V8 Engine", "WebKit", "Chakra"], ans: 1 },
    { q: "Node.js is primarily:", options: ["Synchronous and multi-threaded", "Asynchronous and single-threaded", "Synchronous and single-threaded", "Asynchronous and multi-threaded"], ans: 1 },
    { q: "Which module is used to create a web server?", options: ["fs", "path", "http", "url"], ans: 2 }
  ]
};

const Quiz = {
  currentLang: null,
  currentQuestions: [],

  init() {
    document.getElementById('mcq-back-logo')?.addEventListener('click', Quiz.close);
    document.getElementById('btn-mcq-back')?.addEventListener('click', Quiz.close);
    document.getElementById('btn-submit-mcq')?.addEventListener('click', Quiz.submit);
  },

  open(lang) {
    this.currentLang = lang;
    this.currentQuestions = QuizData[lang] || [];
    
    const landing = document.getElementById('landing-page');
    const appLayout = document.getElementById('app-layout');
    const mcqPage = document.getElementById('mcq-page');
    
    if (landing) landing.style.display = 'none';
    if (appLayout) appLayout.style.display = 'none';
    if (mcqPage) {
      mcqPage.style.display = 'flex';
      mcqPage.style.flexDirection = 'column';
    }
    
    document.getElementById('mcq-title').textContent = `${lang} Interview Quiz`;
    document.getElementById('mcq-score-display').style.display = 'none';
    document.getElementById('btn-submit-mcq').style.display = 'inline-flex';
    
    this.renderQuestions();
    
    // Add skill automatically
    if (typeof state !== 'undefined' && state) {
       const currentSkills = state.skills ? state.skills.split(',').map(s => s.trim()) : [];
       if (!currentSkills.includes(lang)) {
           currentSkills.push(lang);
           state.skills = currentSkills.filter(Boolean).join(', ');
           const skillsInput = document.getElementById('input-skills');
           if (skillsInput) skillsInput.value = state.skills;
           if (typeof saveState === 'function') saveState();
       }
    }
  },

  close() {
    const mcqPage = document.getElementById('mcq-page');
    const landing = document.getElementById('landing-page');
    if (mcqPage) mcqPage.style.display = 'none';
    if (landing) landing.style.display = '';
  },

  renderQuestions() {
    const container = document.getElementById('mcq-questions-container');
    if (!this.currentQuestions.length) {
      container.innerHTML = '<p>No questions available for this language yet.</p>';
      return;
    }
    
    container.innerHTML = this.currentQuestions.map((q, i) => `
      <div class="quiz-box mcq-card">
        <h2>${i + 1}. ${q.q}</h2>
        ${q.options.map((opt, j) => `
          <label class="option mcq-option-label">
            <input type="radio" name="q${i}" value="${j}">
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    `).join('');
    
    // Check dark theme support for labels
    if (document.body.getAttribute('data-theme') === 'dark') {
      container.querySelectorAll('.mcq-option-label span').forEach(el => el.style.color = '#cbd5e1');
      container.querySelectorAll('.quiz-box h2').forEach(el => el.style.color = '#f8fafc');
    }
  },

  submit() {
    if (!Quiz.currentQuestions.length) return;
    
    let score = 0;
    let allAnswered = true;
    
    Quiz.currentQuestions.forEach((q, i) => {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      const card = document.querySelectorAll('.mcq-card')[i];
      const labels = card.querySelectorAll('.mcq-option-label');
      
      if (!selected) {
        allAnswered = false;
      } else {
        const val = parseInt(selected.value);
        if (val === q.ans) {
          score++;
        }
        
        // Disable inputs and highlight
        labels.forEach((label, j) => {
          label.querySelector('input').disabled = true;
          if (j === q.ans) {
            label.style.background = 'rgba(16, 185, 129, 0.1)'; // green
            label.querySelector('span').style.color = '#10b981';
            label.style.fontWeight = 'bold';
          } else if (j === val && val !== q.ans) {
            label.style.background = 'rgba(239, 68, 68, 0.1)'; // red
            label.querySelector('span').style.color = '#ef4444';
          }
        });
      }
    });

    if (!allAnswered && !confirm("You haven't answered all questions. Submit anyway?")) {
      return;
    }

    const display = document.getElementById('mcq-score-display');
    display.textContent = `Score: ${score} / ${Quiz.currentQuestions.length}`;
    if (score === Quiz.currentQuestions.length) {
      display.style.color = '#10b981';
      display.innerHTML += ` 🎉`;
    } else {
      display.style.color = 'inherit';
    }
    display.style.display = 'block';
    
    document.getElementById('btn-submit-mcq').style.display = 'none';
    
    // Provide visual feedback for next step
    setTimeout(() => {
        showToast(`Quiz completed! ${score}/${Quiz.currentQuestions.length} correct.`, 'success');
    }, 500);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Quiz.init();
});

/* ========================================
   ResumeForge — Voice Input Module
   Web Speech API for hands-free entry
   ======================================== */

const Voice = (() => {
  let recognition = null;
  let activeBtn = null;

  const isSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  function init() {
    if (!isSupported) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || 'en-US';
  }

  function start(targetInput, micButton) {
    if (!isSupported || !recognition) return;

    // If already recording on this button, stop
    if (activeBtn === micButton) {
      stop();
      return;
    }

    // Stop any existing
    if (activeBtn) stop();

    activeBtn = micButton;
    micButton.classList.add('mic-active');

    let finalTranscript = targetInput.value;

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? ' ' : '') + event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      targetInput.value = finalTranscript + (interim ? ' ' + interim : '');
      targetInput.dispatchEvent(new Event('input', { bubbles: true }));
    };

    recognition.onerror = () => stop();
    recognition.onend = () => stop();

    recognition.start();
  }

  function stop() {
    if (recognition) {
      try { recognition.stop(); } catch (e) { /* ignore */ }
    }
    if (activeBtn) {
      activeBtn.classList.remove('mic-active');
      activeBtn = null;
    }
  }

  function setLanguage(lang) {
    if (recognition) recognition.lang = lang;
  }

  return { isSupported, init, start, stop, setLanguage };
})();

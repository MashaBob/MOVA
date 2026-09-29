/* ===== НИКА: КНОПКА, МИКРОФОН И ГОЛОС =====
   Этот файл можно менять отдельно от основного приложения. */
(function () {
  function openNika() {
    var shell = document.getElementById('nika-float');
    var input = document.getElementById('nika-input');
    if (shell) shell.classList.add('open');
    if (input) setTimeout(function () { input.focus(); }, 100);
  }

  function say(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var voice = new SpeechSynthesisUtterance(text);
    voice.lang = /[А-Яа-яЁё]/.test(text) ? 'ru-RU' : 'es-MX';
    voice.rate = 0.92;
    window.speechSynthesis.speak(voice);
  }

  function addMessage(kind, text) {
    var messages = document.getElementById('nika-messages');
    if (!messages) return;
    var item = document.createElement('p');
    item.className = 'nika-bubble ' + kind;
    item.textContent = text;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  }

  function replyTo(text) {
    var answer = typeof window.nika === 'function'
      ? window.nika(text)
      : 'Estoy en modo práctica. Puedo ayudarte con saludos, pronunciación y cursos.';
    addMessage('user', text);
    addMessage('nika', answer);
    say(answer);
  }

  function setupVoiceButton() {
    var actions = document.querySelector('.nika-actions');
    if (!actions || document.getElementById('nika-mic')) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'nika-mic';
    button.textContent = '🎙 Hablar';
    button.setAttribute('aria-label', 'Hablar con Nika por micrófono');
    actions.appendChild(button);

    var status = document.createElement('small');
    status.id = 'nika-mic-status';
    status.style.cssText = 'display:block;margin-top:8px;color:#087fa8;font-weight:700';
    actions.parentElement.appendChild(status);

    var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      button.onclick = async function () {
        try {
          var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(function (track) { track.stop(); });
          status.textContent = 'Micrófono conectado. Usa Chrome o Edge actualizado para reconocimiento de voz.';
        } catch (error) {
          status.textContent = 'Permite el micrófono en el navegador y vuelve a intentarlo.';
        }
      };
      return;
    }

    var recognition = new Recognition();
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;

    button.onclick = function () {
      openNika();
      status.textContent = 'Te escucho… habla ahora.';
      button.disabled = true;
      try { recognition.start(); } catch (error) { button.disabled = false; }
    };
    recognition.onresult = function (event) {
      var spoken = event.results[0][0].transcript;
      status.textContent = 'Escuché: ' + spoken;
      replyTo(spoken);
    };
    recognition.onerror = function () {
      status.textContent = 'No pude oírte. Revisa el permiso del micrófono y prueba otra vez.';
      button.disabled = false;
    };
    recognition.onend = function () { button.disabled = false; };
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest && event.target.closest('#talk-to-nika')) openNika();
  });

  function mount() { setupVoiceButton(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  setTimeout(mount, 800);
})();

/* ==========================================================================
   НИКА — видимый помощник, чат, голос и микрофон
   Этот файл независимый: он создаёт Нику, даже если разметка страницы
   была случайно удалена. Стандартный API-ключ OpenAI здесь НЕ хранится.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- 1. ВНЕШНИЙ ВИД ---------- */
  function addStyles() {
    if (document.getElementById('nika-safe-styles')) return;

    var style = document.createElement('style');
    style.id = 'nika-safe-styles';
    style.textContent = `
      #nika-float { position: fixed; right: 22px; bottom: 20px; z-index: 99999; font-family: Arial, sans-serif; }
      #nika-launch { display: flex; align-items: center; gap: 9px; border: 0; border-radius: 999px; padding: 7px 15px 7px 7px; color: #fff; background: linear-gradient(135deg, #18b9ca, #126bb4); box-shadow: 0 10px 28px rgba(10, 86, 150, .35); cursor: pointer; }
      #nika-launch img { width: 52px; height: 52px; object-fit: cover; border-radius: 50%; border: 2px solid #fff; background: #f6d0d8; }
      #nika-launch b, #nika-launch small { display: block; text-align: left; }
      #nika-launch small { opacity: .85; margin-top: 2px; }
      #nika-panel { display: none; position: absolute; right: 0; bottom: 76px; width: min(360px, calc(100vw - 32px)); overflow: hidden; border: 2px solid #20c4d4; border-radius: 22px; color: #14304c; background: #fff; box-shadow: 0 18px 50px rgba(0,0,0,.25); }
      #nika-float.open #nika-panel { display: block; animation: nikaFly .45s ease-out both; }
      @keyframes nikaFly { from { opacity: 0; transform: translateY(30px) scale(.75); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .nika-top { display: flex; align-items: center; gap: 10px; padding: 12px; color: #fff; background: linear-gradient(135deg,#0d67ae,#21c4d4); }
      .nika-top img { width: 54px; height: 54px; object-fit: cover; border-radius: 50%; border: 2px solid #fff; }
      .nika-top strong, .nika-top span { display: block; }
      #nika-close { margin-left: auto; border: 0; color: #fff; background: transparent; font-size: 24px; cursor: pointer; }
      #nika-messages { min-height: 115px; max-height: 210px; overflow-y: auto; padding: 12px; background: #eefcff; }
      .nika-bubble { margin: 7px 0; padding: 9px 11px; border-radius: 13px; line-height: 1.35; }
      .nika-bubble.nika { background: #fff; border: 1px solid #b8eaf0; }
      .nika-bubble.user { margin-left: 35px; color: #fff; background: #126bb4; }
      #nika-form { display: flex; gap: 7px; padding: 10px; }
      #nika-input { min-width: 0; flex: 1; padding: 10px; border: 1px solid #a6dfe7; border-radius: 12px; }
      #nika-send, #nika-mic { border: 0; border-radius: 12px; padding: 10px 11px; color: #fff; background: #087fac; cursor: pointer; }
      #nika-status { padding: 0 12px 11px; font-size: 12px; color: #426279; }
    `;
    document.head.appendChild(style);
  }

  /* ---------- 2. СОЗДАНИЕ ОКНА НИКИ ---------- */
  function ensureNika() {
    addStyles();

    if (document.getElementById('nika-float')) return;

    var shell = document.createElement('aside');
    shell.id = 'nika-float';
    shell.innerHTML = `
      <button id="nika-launch" type="button" aria-label="Hablar con Nika">
        <img src="nika-v1.png" alt="Nika">
        <span><b>Nika</b><small>tu ayudante</small></span>
      </button>
      <section id="nika-panel" aria-label="Chat con Nika">
        <header class="nika-top">
          <img src="nika-v1.png" alt="Nika">
          <div><strong>Nika</strong><span>Tu guía de ruso</span></div>
          <button id="nika-close" type="button" aria-label="Cerrar">×</button>
        </header>
        <div id="nika-messages" aria-live="polite"></div>
        <form id="nika-form">
          <input id="nika-input" autocomplete="off" placeholder="Escribe o habla con Nika…">
          <button id="nika-mic" type="button" title="Hablar con Nika">🎙</button>
          <button id="nika-send" type="submit">Enviar</button>
        </form>
        <div id="nika-status">Pulsa 🎙 y permite el micrófono para practicar.</div>
      </section>
    `;
    document.body.appendChild(shell);

    document.getElementById('nika-launch').addEventListener('click', openNika);
    document.getElementById('nika-close').addEventListener('click', closeNika);
    document.getElementById('nika-form').addEventListener('submit', function (event) {
      event.preventDefault();
      var input = document.getElementById('nika-input');
      var text = input.value.trim();
      if (!text) return;
      input.value = '';
      replyTo(text);
    });
    document.getElementById('nika-mic').addEventListener('click', listen);
  }

  /* ---------- 3. ОТКРЫТИЕ И ЗАКРЫТИЕ ---------- */
  function openNika() {
    ensureNika();
    var shell = document.getElementById('nika-float');
    shell.classList.add('open');

    if (!shell.dataset.greeted) {
      shell.dataset.greeted = 'yes';
      addMessage('nika', '¡Hola! Me llamo Nika y seré tu ayudante. Pulsa el micrófono o escríbeme una pregunta.');
    }

    setTimeout(function () {
      var input = document.getElementById('nika-input');
      if (input) input.focus();
    }, 150);
  }

  function closeNika() {
    var shell = document.getElementById('nika-float');
    if (shell) shell.classList.remove('open');
  }

  /* ---------- 4. ОЗВУЧКА ---------- */
  function say(text) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    var speech = new SpeechSynthesisUtterance(text);
    speech.lang = /[А-Яа-яЁё]/.test(text) ? 'ru-RU' : 'es-MX';
    speech.rate = 0.9;
    speech.pitch = 1.12;

    var voices = window.speechSynthesis.getVoices();
    var female = voices.find(function (voice) {
      return voice.lang.toLowerCase().indexOf(speech.lang.toLowerCase().slice(0, 2)) === 0 && /female|mujer|woman|helena|irina|sabina|paulina|dalia/i.test(voice.name);
    });
    if (female) speech.voice = female;
    window.speechSynthesis.speak(speech);
  }

  /* ---------- 5. МИНИ-ОТВЕТЧИК ДЛЯ УРОКА ---------- */
  function answerFor(text) {
    var question = text.toLowerCase().trim();

    if (question.indexOf('привет') !== -1 || question.indexOf('hola') !== -1) {
      return '«Привет» significa «Hola». Es un saludo informal para amigos.';
    }
    if (question.indexOf('здравствуйте') !== -1) {
      return '«Здравствуйте» significa «Hola» de forma formal.';
    }
    if (question.indexOf('как тебя зовут') !== -1) {
      return '«Как тебя зовут?» significa «¿Cómo te llamas?». Puedes responder: «Меня зовут…».';
    }
    if (question.indexOf('меня зовут') !== -1) {
      return '«Меня зовут…» significa «Me llamo…». Ahora añade tu nombre.';
    }
    if (question.indexOf('откуда') !== -1 || question.indexOf('из россии') !== -1 || question.indexOf('из испании') !== -1) {
      return '«Откуда ты?» significa «¿De dónde eres?». Ejemplo: «Я из Мексики» — «Soy de México».';
    }

    return 'Te escucho. En el Día 1 practicamos: «Привет», «Как тебя зовут?», «Меня зовут…» y «Я из…». Prueba una de estas frases.';
  }

  function addMessage(kind, text) {
    var messages = document.getElementById('nika-messages');
    if (!messages) return;

    var bubble = document.createElement('p');
    bubble.className = 'nika-bubble ' + kind;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function replyTo(text) {
    var answer = answerFor(text);
    addMessage('user', text);
    addMessage('nika', answer);
    say(answer);
  }

  /* ---------- 6. МИКРОФОН ---------- */
  function listen() {
    ensureNika();
    var status = document.getElementById('nika-status');
    var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      status.textContent = 'Este navegador no reconoce voz. Escribe tu pregunta o prueba Chrome.';
      return;
    }

    var recognition = new Recognition();
    recognition.lang = 'es-MX';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    status.textContent = 'Escuchando… habla ahora.';

    recognition.onresult = function (event) {
      var text = event.results[0][0].transcript;
      status.textContent = 'Te escuché: ' + text;
      replyTo(text);
    };
    recognition.onerror = function (event) {
      status.textContent = 'No pude escuchar: ' + event.error + '. Revisa el permiso del micrófono.';
    };
    recognition.onend = function () {
      if (status.textContent === 'Escuchando… habla ahora.') status.textContent = 'Pulsa 🎙 para volver a hablar.';
    };

    try {
      recognition.start();
    } catch (error) {
      status.textContent = 'El micrófono ya está activo. Di tu frase o vuelve a intentarlo.';
    }
  }

  /* ---------- 7. ПОДКЛЮЧЕНИЕ К СТРАНИЦЕ ---------- */
  document.addEventListener('click', function (event) {
    var button = event.target.closest('#talk-to-nika, [data-open-nika], .talk-to-nika');
    if (!button) return;
    event.preventDefault();
    openNika();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureNika);
  } else {
    ensureNika();
  }

  window.openNika = openNika;
})();

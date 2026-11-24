// MOVA · меню, курсы и первый урок
const courses=[['Ruso desde cero','A0','Saludos, alfabeto y frases esenciales'],['Ruso A1','A1','Vida diaria y conversaciones cortas'],['Ruso A2','A2','Viajes y situaciones reales'],['Ruso B1','B1','Conversación con confianza'],['Ruso B2','B2','Fluidez y cultura'],['Ruso C1','C1','Ruso avanzado'],['Ruso para viajar','TEMÁTICO','Viajes'],['Ruso para ligar','TEMÁTICO','Conversación natural']];
const topics=['Привет! Знакомство','Как дела?','Алфавит','Ты и твоя страна','Числа 1–10','Моя семья','Он, она, они','Мой дом','Еда y bebidas','В кафе','Где находится...?','Город и места','Транспорт','В магазине','Цвета','Дни недели','Мой день','Глаголы','Мне нравится','Погода','Ресторан','Отель','Аптека','Телефон','Друзья','Свободное время','Повторение','Повторение','Мини-диалог','Финальная миссия'];
let activeCourse=0,activeDay=1;
const saved=JSON.parse(localStorage.getItem('mova-state')||'{"progress":0,"streak":0}');
function show(name){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===name+'-view'));document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===name));document.getElementById('crumb').textContent=name.toUpperCase();document.getElementById('page-title').textContent={home:'Hola, María',courses:'Mis cursos',lesson:'Mi lección',games:'Juegos MOVA',chat:'Chat con Nika',teacher:'Cabinet pedagógico',admin:'Administración',builder:'MOVA para profesores'}[name]||'MOVA'}
function speak(text){if(!speechSynthesis)return;speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text);u.lang='ru-RU';u.rate=.78;u.pitch=1.1;speechSynthesis.speak(u)}
function save(){localStorage.setItem('mova-state',JSON.stringify(saved));document.getElementById('stat-progress').textContent=saved.progress+'%';document.getElementById('stat-streak').textContent=saved.streak||0;document.getElementById('home-progress').style.width=saved.progress+'%'}
function renderCourses(){let grid=document.getElementById('course-grid');grid.innerHTML=courses.map((c,i)=>'<article class="course-card"><p>'+c[1]+' · '+((i===0||i>5)?'30 DÍAS':'6 MESES')+'</p><h3>'+c[0]+'</h3><span>'+c[2]+'</span><button data-course="'+i+'">Abrir curso →</button></article>').join('');grid.querySelectorAll('[data-course]').forEach(b=>b.onclick=()=>{activeCourse=Number(b.dataset.course);activeDay=1;renderLesson();show('lesson')})}
function renderLesson(){let days=(activeCourse===0||activeCourse>5)?30:180;let course=courses[activeCourse];document.getElementById('lesson-level').textContent=course[1]+' · '+(days===30?'MINI CURSO · 30 DÍAS':'CURSO COMPLETO · 6 MESES');document.getElementById('lesson-course-title').textContent=course[0];document.getElementById('lesson-course-description').textContent='Lección diaria con vocabulario, conversación, práctica y juego.';document.getElementById('day-list').innerHTML=Array.from({length:days},(_,i)=>'<button class="day-item '+(i+1===activeDay?'active':'')+'" data-day="'+(i+1)+'"><b>'+(i+1)+'</b><span>Día '+(i+1)+'<small>'+(topics[i]||'Práctica guiada')+'</small></span></button>').join('');document.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{activeDay=Number(b.dataset.day);renderLesson()});let words=activeDay===1?[['Привет!','Hola'],['Здравствуйте!','Hola formal'],['Как тебя зовут?','¿Cómo te llamas?'],['Меня зовут...','Me llamo...'],['Откуда ты?','¿De dónde eres?'],['Я из Мексики.','Soy de México.']]:[['Привет','Hola'],['Спасибо','Gracias'],['Пожалуйста','Por favor'],['До свидания','Adiós']];let cards=words.map(w=>'<article class="word-card"><button class="listen" data-say="'+w[0]+'">🔊</button><b>'+w[0]+'</b><span>'+w[1]+'</span></article>').join('');document.getElementById('lesson-content').innerHTML='<p class="eyebrow">DÍA '+activeDay+' · 25–30 MINUTOS</p><h3>'+(topics[activeDay-1]||'Práctica guiada')+'</h3><p class="lesson-time">Hoy: escucha · habla · lee · juega</p><div class="lesson-block"><p class="eyebrow">VOCABULARIO CON AUDIO</p><div class="vocab-grid">'+cards+'</div></div><div class="lesson-block"><p class="eyebrow">DIÁLOGO</p><p><b>Nika:</b> Привет! Как тебя зовут?</p><p><b>Tú:</b> Привет! Меня зовут María. Я из Мексики.</p><button class="listen" data-say="Привет! Как тебя зовут?">🔊 Escuchar a Nika</button></div><div class="lesson-block exercise"><p class="eyebrow">RUTA DE PRÁCTICA · 17 EJERCICIOS</p><div class="exercise-progress"><i id="lesson-progress" style="width:0%"></i></div><p id="exercise-status">Ejercicio 1 de 17</p><h4>¿Cómo dices Hola en ruso?</h4><button data-answer="wrong">Спасибо</button><button data-answer="correct">Привет!</button><button data-answer="wrong">Пока!</button><p id="exercise-result"></p><button id="next-exercise">Siguiente ejercicio →</button></div><div class="lesson-block"><p class="eyebrow">🎮 JUEGO DEL DÍA</p><h4>Conoce a María: responde bien para avanzar.</h4><button id="game-start">Empezar juego →</button><p id="game-message"></p></div><div class="lesson-block"><p class="eyebrow">⭐ MISIÓN DEL DÍA</p><p>Di: Привет! · Меня зовут... · Я из...</p><button id="complete-day" class="complete-day">Completar día '+activeDay+' ✓</button></div>';document.querySelectorAll('.listen').forEach(b=>b.onclick=()=>speak(b.dataset.say));document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>document.getElementById('exercise-result').textContent=b.dataset.answer==='correct'?'✓ ¡Correcto!':'Inténtalo otra vez.');let exercise=1;document.getElementById('next-exercise').onclick=()=>{exercise=Math.min(17,exercise+1);document.getElementById('exercise-status').textContent='Ejercicio '+exercise+' de 17';document.getElementById('lesson-progress').style.width=(exercise/17*100)+'%'};document.getElementById('game-start').onclick=()=>{let g=document.getElementById('game-message');g.innerHTML='María: Привет! Как тебя зовут?<br><button id="game-answer">Меня зовут María.</button>';document.getElementById('game-answer').onclick=()=>{g.textContent='🎉 ¡Muy bien! María entiende tu presentación.';speak('Молодец!')}};document.getElementById('complete-day').onclick=()=>{saved.progress=Math.max(saved.progress,Math.round(activeDay/days*100));saved.streak=(saved.streak||0)+1;save();document.getElementById('complete-day').textContent='Día completado ✓'}}
function setupGames(){let n=0,deck=[['Спасибо','Gracias'],['Привет','Hola'],['Пожалуйста','Por favor'],['До свидания','Adiós']];let draw=()=>{document.getElementById('card-russian').textContent=deck[n][0];document.getElementById('card-spanish').textContent=deck[n][1];document.getElementById('flash-count').textContent=(n+1)+' / '+deck.length};draw();document.getElementById('flash-next').onclick=()=>{n=(n+1)%deck.length;draw()};document.getElementById('flash-prev').onclick=()=>{n=(n+deck.length-1)%deck.length;draw()};document.getElementById('flash-card').onclick=()=>{let a=document.getElementById('card-russian'),b=document.getElementById('card-spanish'),t=a.textContent;a.textContent=b.textContent;b.textContent=t};let x=8,y=8;document.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{let d=b.dataset.move;if(d==='up')y=Math.max(8,y-42);if(d==='down')y=Math.min(176,y+42);if(d==='left')x=Math.max(8,x-42);if(d==='right')x=Math.min(176,x+42);let p=document.getElementById('player');p.style.left=x+'px';p.style.top=y+'px';if(x>=176&&y>=176)document.getElementById('maze-message').textContent='¡Llegaste al café! Кофе, пожалуйста.'})}
document.querySelectorAll('.nav-link').forEach(b=>b.onclick=()=>show(b.dataset.view));document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));document.getElementById('back-courses').onclick=()=>show('courses');document.getElementById('mobile-menu').onclick=()=>document.querySelector('.sidebar').classList.toggle('open');renderCourses();setupGames();save();


/* ================================================================
   DÍA 2 · КАК ДЕЛА?
   Este bloque sustituye SOLO la vista del día 2.
   Aquí puedes cambiar las palabras, ejercicios y juego sin tocar Día 1.
   ================================================================ */
(() => {
  const renderOriginalLesson = renderLesson;

  const dayTwoWords = [
    ['Как дела?', '¿Cómo estás?'], ['Хорошо.', 'Bien.'],
    ['Отлично!', '¡Excelente!'], ['Нормально.', 'Normal.'],
    ['Так себе.', 'Más o menos.'], ['Плохо.', 'Mal.'],
    ['Спасибо.', 'Gracias.'], ['А у тебя?', '¿Y tú?'],
    ['Очень хорошо!', '¡Muy bien!'], ['Не очень.', 'No muy bien.']
  ];

  const dayTwoExercises = [
    ['¿Cómo preguntas «¿Cómo estás?»?', ['Как дела?', 'Как тебя зовут?', 'Откуда ты?'], 0],
    ['Elige «Bien» en ruso.', ['Плохо.', 'Хорошо.', 'Так себе.'], 1],
    ['¿Qué significa «Отлично!»?', ['¡Excelente!', 'Gracias', 'Hasta luego'], 0],
    ['Completa: Хорошо, ...', ['спасибо', 'пожалуйста', 'привет'], 0],
    ['¿Cómo dices «¿Y tú?»?', ['А у тебя?', 'Как дела?', 'Откуда ты?'], 0],
    ['Elige una respuesta normal.', ['Нормально.', 'Меня зовут.', 'Я из.'], 0],
    ['¿Qué significa «Так себе»?', ['Más o menos', 'Muy bien', 'Por favor'], 0],
    ['Elige «Mal».', ['Плохо.', 'Хорошо.', 'Отлично!'], 0],
    ['Completa: Очень ...!', ['хорошо', 'меня', 'тебя'], 0],
    ['Elige el diálogo correcto.', ['Как дела? — Хорошо.', 'Как дела? — Меня зовут María.', 'Как дела? — Я из México.'], 0],
    ['¿Qué frase escuchas?', ['А у тебя?', 'До свидания!', 'Здравствуйте!'], 0],
    ['Elige una palabra positiva.', ['Отлично!', 'Плохо.', 'Не очень.'], 0],
    ['Completa: Не ...', ['очень', 'тебя', 'дела'], 0],
    ['Responde con educación.', ['Хорошо, спасибо.', 'Спасибо, как зовут?', 'Откуда, хорошо?'], 0],
    ['Ordena la conversación.', ['Как дела? — Нормально.', 'Нормально. — Как тебя?', 'Спасибо. — Откуда ты?'], 0],
    ['Traduce «Очень хорошо».', ['Muy bien', 'Muy mal', 'Mi nombre'], 0],
    ['¿Cómo estás hoy?', ['Хорошо!', 'Меня зовут!', 'Я из!'], 0]
  ];

  // Внешний вид только для блоков второго дня.
  document.head.insertAdjacentHTML('beforeend', '<style id="day-two-style">.exercise-card{margin-top:14px}.exercise-card.is-correct{border-color:#14b9c9;box-shadow:0 0 0 2px rgba(20,185,201,.13)}.answer-row{display:flex;gap:8px;flex-wrap:wrap}.exercise-answer,.record-answer,.add-word{margin-top:8px}.add-word{font-size:11px;padding:5px 8px}.lesson-goal{border-left:4px solid #15bed0}.exercise-progress{height:9px;background:#d8f0f3;border-radius:20px;overflow:hidden}.exercise-progress i{height:100%;display:block;background:linear-gradient(90deg,#087eaa,#17c6c7);transition:width .3s}.dialogue-game{padding:18px;border-radius:18px;background:linear-gradient(135deg,#073766,#087d9d);color:#fff;position:relative;overflow:hidden}.game-nika{font-size:52px;position:absolute;right:18px;top:12px;transition:transform .45s}.game-path{height:8px;background:rgba(255,255,255,.25);border-radius:10px;margin:16px 80px 16px 0;overflow:hidden}.game-path i{display:block;height:100%;width:10%;background:#77f4e9;transition:width .45s}.dialogue-game button{margin:5px}.final-mission{background:#effcff}</style>');

  renderLesson = function () {
    if (activeDay !== 2) {
      renderOriginalLesson();
      return;
    }

    const days = (activeCourse === 0 || activeCourse > 5) ? 30 : 180;
    const course = courses[activeCourse];
    document.getElementById('lesson-level').textContent = course[1] + ' · ' + (days === 30 ? 'MINI CURSO · 30 DÍAS' : 'CURSO COMPLETO · 6 MESES');
    document.getElementById('lesson-course-title').textContent = course[0];
    document.getElementById('lesson-course-description').textContent = 'Lección diaria con vocabulario, conversación, práctica y juego.';

    document.getElementById('day-list').innerHTML = Array.from({ length: days }, (_, index) => {
      const day = index + 1;
      return '<button class="day-item ' + (day === activeDay ? 'active' : '') + '" data-day="' + day + '"><b>' + day + '</b><span>Día ' + day + '<small>' + (topics[index] || 'Práctica guiada') + '</small></span></button>';
    }).join('');
    document.querySelectorAll('[data-day]').forEach(button => {
      button.onclick = () => { activeDay = Number(button.dataset.day); renderLesson(); };
    });

    const vocabulary = dayTwoWords.map(word =>
      '<article class="word-card"><button class="listen" data-say="' + word[0] + '">🔊</button><b>' + word[0] + '</b><span>' + word[1] + '</span><button class="add-word" data-word="' + word[0] + '">＋ Guardar</button></article>'
    ).join('');
    const exercises = dayTwoExercises.map((item, index) =>
      '<section class="lesson-block exercise-card" data-card="' + index + '"><p class="eyebrow">EJERCICIO ' + (index + 1) + ' DE 17</p><h4>' + item[0] + '</h4><div class="answer-row">' +
      item[1].map((choice, answer) => '<button class="exercise-answer" data-number="' + index + '" data-correct="' + (answer === item[2]) + '">' + choice + '</button>').join('') +
      '</div><p id="feedback-' + index + '"></p></section>'
    ).join('');

    document.getElementById('lesson-content').innerHTML =
      '<p class="eyebrow">DÍA 2 · 25–30 MINUTOS</p><h3>Как дела?</h3><p class="lesson-time">Hoy: escucha · habla · lee · juega</p>' +
      '<section class="lesson-block lesson-goal"><p class="eyebrow">🎯 HOY VAS A PODER</p><p>Preguntar <b>«Как дела?»</b>, responder cómo te sientes y continuar una conversación corta.</p></section>' +
      '<section class="lesson-block"><p class="eyebrow">VOCABULARIO CON AUDIO</p><div class="vocab-grid">' + vocabulary + '</div></section>' +
      '<section class="lesson-block"><p class="eyebrow">💬 DIÁLOGO REAL CON NIKA</p><p><b>Nika:</b> Привет! Как дела?</p><p><b>Tú:</b> Хорошо, спасибо. А у тебя?</p><p><b>Nika:</b> Отлично! Очень хорошо, что ты здесь.</p><button class="listen" data-say="Привет! Как дела? Хорошо, спасибо. А у тебя? Отлично! Очень хорошо, что ты здесь.">🔊 Escuchar el diálogo</button><button class="record-answer" id="record-answer">🎙 Grabar mi respuesta</button><p id="record-status"></p></section>' +
      '<section class="lesson-block"><p class="eyebrow">RUTA DE PRÁCTICA · 17 EJERCICIOS</p><div class="exercise-progress"><i id="lesson-progress" style="width:0%"></i></div><p id="exercise-status">0 de 17 completados</p></section>' + exercises +
      '<section class="lesson-block"><p class="eyebrow">🎮 JUEGO DEL DÍA · CONVERSACIÓN</p><h4>Habla con Nika: responde bien para acercarte.</h4><div class="dialogue-game"><div class="game-nika" id="game-nika">👩🏻</div><div class="game-path"><i id="game-path-dot"></i></div><div id="game-stage"><p>Nika: Привет! Как дела?</p><button data-game="wrong">Меня зовут María.</button><button data-game="right">Хорошо, спасибо. А у тебя?</button><button data-game="wrong">Я из Мексики.</button></div></div><p id="game-message">Elige la respuesta que usarías en una conversación.</p></section>' +
      '<section class="lesson-block final-mission"><p class="eyebrow">⭐ MISIÓN DEL DÍA</p><p>Di sin mirar: <b>Как дела? · Хорошо, спасибо. · А у тебя? · Отлично!</b></p><button class="listen" data-say="Как дела? Хорошо, спасибо. А у тебя? Отлично!">🔊 Modelo de Nika</button><button id="complete-day" class="complete-day">Completar día 2 ✓</button></section>';

    // Аудио и личный словарь.
    document.querySelectorAll('.listen').forEach(button => button.onclick = () => speak(button.dataset.say));
    document.querySelectorAll('.add-word').forEach(button => {
      button.onclick = () => { button.textContent = '✓ Guardado'; button.disabled = true; localStorage.setItem('mova-word-' + button.dataset.word, 'saved'); };
    });

    // Прогресс по всем 17 упражнениям.
    const completed = new Set();
    document.querySelectorAll('.exercise-answer').forEach(button => {
      button.onclick = () => {
        const number = button.dataset.number;
        const feedback = document.getElementById('feedback-' + number);
        if (button.dataset.correct === 'true') {
          completed.add(number);
          feedback.textContent = '✓ ¡Correcto! Muy bien.';
          button.closest('.exercise-card').classList.add('is-correct');
        } else {
          feedback.textContent = 'Inténtalo otra vez y escucha la palabra.';
        }
        document.getElementById('lesson-progress').style.width = Math.round(completed.size / 17 * 100) + '%';
        document.getElementById('exercise-status').textContent = completed.size + ' de 17 completados';
      };
    });

    // Запись ответа ученика — браузер попросит разрешение на микрофон.
    const record = document.getElementById('record-answer');
    const status = document.getElementById('record-status');
    record.onclick = async () => {
      if (!navigator.mediaDevices || !window.MediaRecorder) { status.textContent = 'Tu navegador no permite grabar audio aquí.'; return; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        recorder.start();
        record.textContent = '■ Detener grabación';
        status.textContent = 'Grabando… di: Хорошо, спасибо. А у тебя?';
        record.onclick = () => { recorder.stop(); stream.getTracks().forEach(track => track.stop()); record.textContent = '🎙 Grabar otra vez'; status.textContent = '✓ Audio grabado en este navegador.'; };
      } catch (error) {
        status.textContent = 'No hay permiso para el micrófono. Permítelo en el navegador e inténtalo de nuevo.';
      }
    };

    // Игра: правильный ответ двигает Нику к ученику.
    document.querySelectorAll('[data-game]').forEach(button => {
      button.onclick = () => {
        const message = document.getElementById('game-message');
        if (button.dataset.game !== 'right') { message.textContent = 'Prueba otra vez: Nika preguntó «Как дела?»'; return; }
        document.getElementById('game-nika').style.transform = 'translateX(-60px) scale(1.16)';
        document.getElementById('game-path-dot').style.width = '82%';
        document.getElementById('game-stage').innerHTML = '<p>Nika: Отлично! Очень хорошо, что ты здесь.</p><button id="game-finish">Очень приятно!</button>';
        message.textContent = '✓ ¡Perfecto! Nika se acercó porque respondiste correctamente.';
        speak('Отлично! Очень хорошо, что ты здесь.');
        document.getElementById('game-finish').onclick = () => { document.getElementById('game-path-dot').style.width = '100%'; document.getElementById('game-nika').style.transform = 'translateX(-95px) scale(1.28)'; document.getElementById('game-stage').innerHTML = '<p>🎉 ¡Diálogo terminado!</p>'; };
      };
    });

    document.getElementById('complete-day').onclick = () => {
      saved.progress = Math.max(saved.progress, Math.round(activeDay / days * 100));
      saved.streak = (saved.streak || 0) + 1;
      save();
      document.getElementById('complete-day').textContent = 'Día completado ✓';
    };
  };
})();


/* ================================================================
   NAVEGACIÓN POR PROGRESO
   «Continuar aprendiendo» abre el siguiente día pendiente.
   ================================================================ */
(() => {
  function getNextDay() {
    const totalDays = 30;
    const done = Math.round((Number(saved.progress) || 0) / 100 * totalDays);
    return Math.min(totalDays, Math.max(1, done + 1));
  }

  function updateContinueCard() {
    const nextDay = getNextDay();
    const title = topics[nextDay - 1] || 'Práctica guiada';
    const index = document.querySelector('.continue-card .lesson-index');
    const heading = document.querySelector('.continue-card h3');
    const description = document.querySelector('.continue-card p');
    if (index) index.textContent = String(nextDay).padStart(2, '0');
    if (heading) heading.textContent = 'Día ' + nextDay + ' · ' + title;
    if (description) description.textContent = nextDay === 2 ? 'Как дела? · Хорошо · Спасибо · А у тебя?' : 'Tu siguiente práctica de ruso.';
  }

  function continueLearning() {
    activeCourse = 0;
    activeDay = getNextDay();
    renderLesson();
    show('lesson');
  }

  // Кнопка в большом баннере и круглая стрелка на карточке.
  document.querySelectorAll('[data-go="courses"]').forEach(button => {
    if (button.classList.contains('primary') || button.classList.contains('round')) {
      button.onclick = continueLearning;
    }
  });

  // Карточка следующего урока — тоже открывает нужный день.
  document.querySelector('.continue-card')?.addEventListener('click', event => {
    if (event.target.closest('button') || event.target.closest('.continue-card')) continueLearning();
  });

  // После завершения дня обновляем карточку на главной странице.
  const saveBeforeProgress = save;
  save = function () {
    saveBeforeProgress();
    updateContinueCard();
  };

  updateContinueCard();
})();


/* ================================================================
   MI DICCIONARIO
   Palabras guardadas desde Día 1 y Día 2.
   ================================================================ */
(() => {
  const dictionaryKey = 'mova-my-dictionary';
  const renderBeforeDictionary = renderLesson;

  function readDictionary() {
    try { return JSON.parse(localStorage.getItem(dictionaryKey) || '[]'); }
    catch (error) { return []; }
  }

  function saveWord(russian, spanish, button) {
    const words = readDictionary();
    if (!words.some(word => word.russian === russian)) {
      words.push({ russian, spanish });
      localStorage.setItem(dictionaryKey, JSON.stringify(words));
    }
    button.textContent = '✓ Guardado';
    button.disabled = true;
  }

  function renderDictionary() {
    const view = document.getElementById('dictionary-view');
    const words = readDictionary();
    view.innerHTML = '<div class="section-head"><div><p class="eyebrow">MI VOCABULARIO</p><h2>Mi diccionario</h2><p>Palabras que guardaste en tus lecciones.</p></div><strong class="dictionary-count">' + words.length + ' palabras</strong></div>' +
      (words.length ? '<div class="dictionary-grid">' + words.map((word, index) => '<article class="dictionary-word"><button class="listen dictionary-listen" data-say="' + word.russian + '">🔊</button><b>' + word.russian + '</b><span>' + word.spanish + '</span><button class="remove-word" data-remove="' + index + '">Eliminar</button></article>').join('') + '</div>' : '<article class="empty-dictionary"><h3>Aún no guardaste palabras</h3><p>En Día 1 y Día 2 toca <b>＋ Guardar</b> debajo de cualquier tarjeta.</p></article>');

    view.querySelectorAll('.dictionary-listen').forEach(button => button.onclick = () => speak(button.dataset.say));
    view.querySelectorAll('.remove-word').forEach(button => {
      button.onclick = () => {
        const wordsNow = readDictionary();
        wordsNow.splice(Number(button.dataset.remove), 1);
        localStorage.setItem(dictionaryKey, JSON.stringify(wordsNow));
        renderDictionary();
      };
    });
  }

  // Создаём отдельный пункт меню и страницу словаря.
  const nav = document.getElementById('main-nav');
  if (!document.getElementById('dictionary-link')) {
    const link = document.createElement('button');
    link.id = 'dictionary-link';
    link.className = 'nav-link';
    link.innerHTML = '▤ Mi diccionario';
    nav.insertBefore(link, nav.querySelector('[data-view="games"]'));
    link.onclick = () => { renderDictionary(); show('dictionary'); };
  }

  if (!document.getElementById('dictionary-view')) {
    const view = document.createElement('section');
    view.id = 'dictionary-view';
    view.className = 'view';
    document.querySelector('.main').appendChild(view);
  }

  document.head.insertAdjacentHTML('beforeend', '<style id="dictionary-style">.dictionary-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}.dictionary-word,.empty-dictionary{padding:18px;border:1px solid #beeaf0;border-radius:18px;background:#fff;box-shadow:0 10px 26px rgba(5,52,93,.08)}.dictionary-word b,.dictionary-word span{display:block}.dictionary-word b{font-size:21px;color:#08345c;margin:8px 0}.dictionary-word span{color:#5d7280}.dictionary-listen{float:right}.remove-word{margin-top:13px;font-size:12px}.dictionary-count{color:#087eaa}.empty-dictionary{max-width:520px}</style>');

  // Добавляет кнопку Guardar к карточкам Дня 1 и Дня 2.
  renderLesson = function () {
    renderBeforeDictionary();
    if (activeDay !== 1 && activeDay !== 2) return;

    document.querySelectorAll('.word-card').forEach(card => {
      const russian = card.querySelector('b')?.textContent || '';
      const spanish = card.querySelector('span')?.textContent || '';
      let button = card.querySelector('.add-word');
      if (!button) {
        button = document.createElement('button');
        button.className = 'add-word';
        button.textContent = '＋ Guardar';
        card.appendChild(button);
      }
      const alreadySaved = readDictionary().some(word => word.russian === russian);
      if (alreadySaved) { button.textContent = '✓ Guardado'; button.disabled = true; }
      button.onclick = () => saveWord(russian, spanish, button);
    });
  };
})();


/* ================================================================
   DÍA 3 · АЛФАВИТ I
   10 letras visualmente parecidas al español.
   ================================================================ */
(() => {
  const renderBeforeDay3 = renderLesson;
  topics[2] = 'Алфавит I · буквы, похожие на español';
  topics[3] = 'Алфавит II · новые буквы';
  topics[4] = 'Числа 1–10';
  topics[5] = 'Числа 10–99';
  topics[6] = 'Большие числа · 100–1000';
  topics[7] = 'Ты и твоя страна';

  const letters = [
    ['А а', 'A · como en español'], ['В в', 'V · no es B'],
    ['Е е', 'YE / E · no es E siempre'], ['К к', 'K · como K'],
    ['М м', 'M · como M'], ['Н н', 'N · parece H'],
    ['О о', 'O · como O'], ['Р р', 'R · parece P'],
    ['С с', 'S · parece C'], ['Т т', 'T · como T']
  ];
  const quiz = [
    ['¿Qué letra rusa suena como V?', ['В', 'Б', 'Р'], 0],
    ['¿Qué letra parece H pero suena N?', ['Н', 'И', 'П'], 0],
    ['¿Qué letra parece P pero suena R?', ['Р', 'П', 'Г'], 0],
    ['¿Qué letra parece C pero suena S?', ['С', 'О', 'В'], 0],
    ['Elige la letra A.', ['А', 'Д', 'Я'], 0],
    ['¿Qué letra suena como M?', ['М', 'Н', 'И'], 0],
    ['¿Qué letra suena como T?', ['Т', 'Г', 'Р'], 0],
    ['Elige la letra O.', ['О', 'С', 'Ф'], 0],
    ['¿Cómo se lee В?', ['V', 'B', 'P'], 0],
    ['¿Cómo se lee Н?', ['N', 'H', 'M'], 0],
    ['¿Cómo se lee Р?', ['R', 'P', 'B'], 0],
    ['¿Cómo se lee С?', ['S', 'C', 'K'], 0],
    ['Completa: М + А =', ['МА', 'НА', 'РА'], 0],
    ['Completa: С + О =', ['СО', 'РО', 'ВО'], 0],
    ['Elige la palabra con letra Р.', ['РА', 'НА', 'МО'], 0],
    ['¿Cuál es la letra K?', ['К', 'Х', 'Ж'], 0],
    ['Mira la letra y di su sonido: В', ['V', 'R', 'N'], 0]
  ];

  document.head.insertAdjacentHTML('beforeend', '<style id="day-three-style">.alphabet-note{border-left:4px solid #16c7ca;background:#effcfc}.letter-card b{font-size:32px;line-height:1;color:#073a67}.letter-card span{font-size:13px}.alpha-game{background:linear-gradient(135deg,#073766,#0b8cab);color:white}.alpha-tiles{display:flex;gap:9px;flex-wrap:wrap;margin-top:14px}.alpha-tiles button{min-width:55px;font-size:22px}.alpha-tiles button.good{background:#78f6dd;color:#073766}.alpha-tiles button.bad{background:#f2a2b0}.quiz-card{margin:12px 0}.quiz-card.done{border-color:#14b9c9;background:#f2feff}</style>');

  renderLesson = function () {
    if (activeDay !== 3) { renderBeforeDay3(); return; }
    const days = 30;
    document.getElementById('lesson-level').textContent = 'A0 · MINI CURSO · 30 DÍAS';
    document.getElementById('lesson-course-title').textContent = 'Ruso desde cero';
    document.getElementById('lesson-course-description').textContent = 'Día 3: lee 10 letras rusas que reconocerás inmediatamente.';
    document.getElementById('day-list').innerHTML = Array.from({length:days}, (_,index) => '<button class="day-item '+(index+1===activeDay?'active':'')+'" data-day="'+(index+1)+'"><b>'+(index+1)+'</b><span>Día '+(index+1)+'<small>'+(topics[index]||'Práctica guiada')+'</small></span></button>').join('');
    document.querySelectorAll('[data-day]').forEach(button => button.onclick = () => { activeDay = Number(button.dataset.day); renderLesson(); });

    const vocabulary = letters.map(letter => '<article class="word-card letter-card"><b>'+letter[0]+'</b><span>'+letter[1]+'</span><button class="add-word" data-russian="'+letter[0]+'" data-spanish="'+letter[1]+'">＋ Guardar</button></article>').join('');
    const tasks = quiz.map((item,index) => '<section class="lesson-block quiz-card" data-task="'+index+'"><p class="eyebrow">EJERCICIO '+(index+1)+' DE 17</p><h4>'+item[0]+'</h4><div class="answer-row">'+item[1].map((answer,i) => '<button data-day3-answer="'+index+'" data-right="'+(i===item[2])+'">'+answer+'</button>').join('')+'</div><p id="day3-feedback-'+index+'"></p></section>').join('');

    document.getElementById('lesson-content').innerHTML =
      '<p class="eyebrow">DÍA 3 · 25–30 MINUTOS</p><h3>Алфавит I · letras que ya conoces</h3><p class="lesson-time">Hoy: mira · compara · lee · juega</p>'+ 
      '<section class="lesson-block alphabet-note"><p class="eyebrow">💡 CONEXIÓN CON ESPAÑOL</p><p>Estas letras se ven familiares, pero algunas cambian de sonido. La más importante de hoy: <b>В = V</b>, <b>Н = N</b>, <b>Р = R</b> y <b>С = S</b>.</p></section>'+ 
      '<section class="lesson-block"><p class="eyebrow">10 LETRAS PARA LEER</p><div class="vocab-grid">'+vocabulary+'</div></section>'+ 
      '<section class="lesson-block"><p class="eyebrow">LEE SÍLABAS</p><p><b>МА · НА · РА · СО · ТО · ВА</b></p><p>Primero mira la letra, luego di el sonido. No memorices: compara la forma con el español.</p></section>'+ 
      '<section class="lesson-block"><p class="eyebrow">RUTA DE PRÁCTICA · 17 EJERCICIOS</p><div class="exercise-progress"><i id="day3-progress" style="width:0%"></i></div><p id="day3-status">0 de 17 completados</p></section>'+tasks+
      '<section class="lesson-block alpha-game"><p class="eyebrow">🎮 JUEGO · CAZA LA LETRA</p><h4 id="alpha-question">Encuentra la letra que suena como V.</h4><div class="alpha-tiles" id="alpha-tiles"><button data-letter="Н">Н</button><button data-letter="В">В</button><button data-letter="Р">Р</button><button data-letter="С">С</button></div><p id="alpha-message">Elige una letra. Si aciertas, pasa a la siguiente ronda.</p></section>'+ 
      '<section class="lesson-block"><p class="eyebrow">⭐ MISIÓN DEL DÍA</p><p>Reconoce y lee sin mirar: <b>А, В, Е, К, М, Н, О, Р, С, Т</b>.</p><button id="day3-complete" class="complete-day">Completar día 3 ✓</button></section>';

    document.querySelectorAll('.add-word').forEach(button => button.onclick = () => {
      const key = 'mova-my-dictionary'; let words=[]; try { words=JSON.parse(localStorage.getItem(key)||'[]'); } catch(error) {}
      if (!words.some(word => word.russian===button.dataset.russian)) words.push({russian:button.dataset.russian,spanish:button.dataset.spanish});
      localStorage.setItem(key,JSON.stringify(words)); button.textContent='✓ Guardado'; button.disabled=true;
    });
    const completed = new Set();
    document.querySelectorAll('[data-day3-answer]').forEach(button => button.onclick = () => {
      const number = button.dataset.day3Answer, feedback=document.getElementById('day3-feedback-'+number);
      if (button.dataset.right==='true') { completed.add(number); feedback.textContent='✓ ¡Correcto!'; button.closest('.quiz-card').classList.add('done'); }
      else feedback.textContent='Mira otra vez la forma y el sonido.';
      document.getElementById('day3-status').textContent=completed.size+' de 17 completados';
      document.getElementById('day3-progress').style.width=Math.round(completed.size/17*100)+'%';
    });
    let round=0; const game=[['Encuentra la letra que suena como V.','В'],['Encuentra la letra que parece H pero suena N.','Н'],['Encuentra la letra que parece P pero suena R.','Р'],['Encuentra la letra que suena S.','С']];
    document.querySelectorAll('[data-letter]').forEach(button => button.onclick = () => { const message=document.getElementById('alpha-message'); if(button.dataset.letter!==game[round][1]) { button.classList.add('bad'); message.textContent='No todavía. Mira la conexión con español.'; return; } button.classList.add('good'); round++; if(round===game.length){ document.getElementById('alpha-question').textContent='🎉 ¡Ganaste! Ya puedes leer estas letras.'; message.textContent='Excelente: completaste las cuatro rondas.'; return; } document.getElementById('alpha-question').textContent=game[round][0]; message.textContent='✓ Correcto. Siguiente letra.'; });
    document.getElementById('day3-complete').onclick=()=>{saved.progress=Math.max(saved.progress,10); saved.streak=(saved.streak||0)+1; save(); document.getElementById('day3-complete').textContent='Día 3 completado ✓';};
  };
})();

/* DAY 1 — independent module; other lessons untouched */
(()=>{
const previous=renderLesson;
const W=[['Привет!','Hola informal','👋','при-ВЕТ'],['Здравствуйте!','Hola formal','🤝','ЗДРА-ствуйте; la primera в no se pronuncia'],['Как тебя зовут?','¿Cómo te llamas?','❓','как те-БЯ за-ВУТ'],['Меня зовут Анна.','Me llamo Anna.','🪪','ме-НЯ за-ВУТ АН-на'],['Очень приятно!','Mucho gusto','😊','О-чень при-ЯТ-на'],['Пока!','Adiós informal','🚪','па-КА'],['До свидания!','Adiós formal','🙋','да сви-ДА-ни-я'],['Как вас зовут?','¿Cómo se llama usted?','💬','как вас за-ВУТ'],['Меня зовут Мария.','Me llamo María.','👩','ме-НЯ за-ВУТ ма-РИ-я']];
const D=[[0,2,3,4,4,5],[1,7,8,4,4,6],[0,2,8,4,5,5]];
const names=['Tarjetas','Escucha y elige','Une las parejas','Reconoce la frase','Construye la palabra','Repite en voz alta','Dictado','Completa','Ordena la frase','Memory','Escucha el diálogo','Reconstruye el diálogo','Laberinto','Encuentra a Anna','Conversación con Anna','Práctica con Nika','Misión final'];
const key='mova-day1-v2';let S;try{S=JSON.parse(localStorage.getItem(key))||{}}catch{S={}};S.done??={};S.errors??={};S.correct??=0;S.wrong??=0;S.voice??=0;S.listening??=0;S.current??=0;S.seen??={};
const persist=()=>{try{localStorage.setItem(key,JSON.stringify(S))}catch{}};
const norm=s=>s.toLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N} ]/gu,'').replace(/\s+/g,' ').trim();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let root,stage,rate=1,volume=1,token=0,recognition;
const recorded={'привет':'privet','здравствуйте':'zdravstvuyte','как тебя зовут':'kak-tebya-zovut','очень приятно':'ochen-priyatno','пока':'poka','как вас зовут':'kak-vas-zovut','меня зовут мария':'menya-zovut-mariya','меня зовут':'menya-zovut','я анна':'ya-anna','меня зовут маша':'menya-zovut-masha'};let player;
function audio(text,after){const status=root.querySelector('#d1audio');const id=++token;if(player){player.pause();player.onended=null}if(window.speechSynthesis)window.speechSynthesis.cancel();const file=recorded[norm(text)];if(!file){status.textContent='Esta frase todavía no tiene grabación. No se contará como escucha.';return}player=new Audio(new URL('audio/'+file+'.mp3',document.baseURI).href);player.preload='auto';player.playbackRate=rate;player.volume=volume;status.textContent='Cargando audio…';player.onplaying=()=>{if(id===token)status.textContent='Reproduciendo audio ruso'};player.onended=()=>{if(id===token){status.textContent='Audio terminado';after?.()}};const fail=()=>{if(id===token)status.textContent='No se pudo reproducir. Toca Escuchar para reintentar.'};player.onerror=fail;player.play().catch(fail)}
const nativeSpeak=window.speechSynthesis ? window.speechSynthesis.speak.bind(window.speechSynthesis) : ()=>{};
const button=(label,fn,parent=stage)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;parent.append(b);return b};
const say=(text,parent=stage)=>button('🔊 Escuchar',()=>audio(text),parent);
const p=(text,parent=stage)=>{const e=document.createElement('p');e.textContent=text;parent.append(e);return e};
function report(){root.querySelector('#d1progress').textContent=Object.keys(S.done).length+' / 17 · '+Math.round(Object.keys(S.done).length/17*100)+'%';root.querySelector('#d1bar').value=Object.keys(S.done).length;root.querySelector('#d1report').textContent='Respuestas correctas: '+S.correct+' · Intentos incorrectos: '+S.wrong+' · Comprensión auditiva: '+S.listening+' · Frases reconocidas por voz: '+S.voice+' · Vocabulario revisado: '+Object.keys(S.seen).length+'/'+W.length+'. Repasa: '+(Object.keys(S.errors).sort((a,b)=>S.errors[b]-S.errors[a]).slice(0,4).join(' · ')||'sin dificultades registradas');persist()}
function complete(){if(stage.dataset.completed==='yes')return;stage.dataset.completed='yes';S.done[S.current]=true;report();p('✓ Actividad completada.');if(Object.keys(S.done).length===17&&!S.finished){S.finished=true;saved.progress=Math.max(saved.progress,3);saved.streak=(saved.streak||0)+1;save();persist()}if(S.current<16)button('Siguiente actividad →',()=>open(S.current+1))}
function mark(ok,word,feedback,listen=false){if(ok){S.correct++;if(listen)S.listening++;feedback.textContent='✓ Correcto.'}else{S.wrong++;S.errors[word]=(S.errors[word]||0)+1;feedback.textContent='Intenta otra vez. Pista: '+(W.find(w=>w[0]===word)?.[1]||word)}report()}
function rounds(items,draw){let i=0;const next=()=>{stage.innerHTML='';if(i===items.length){complete();return}p('Ronda '+(i+1)+' / '+items.length);draw(items[i],()=>{i++;next()})};next()}
function choices(prompt,options,answer,word,next,listen=false){p(prompt);const f=p('');let locked=false;options.forEach(x=>button(x,()=>{if(locked)return;const ok=x===answer;mark(ok,word,f,listen);if(ok){locked=true;button('Continuar →',next)}}))}
function mix(a){return a.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1])}
function order(parts,next,word){let chosen=[];const out=p('');const f=p('');const buttons=mix(parts).map(x=>button(x,()=>{},stage));/* use separate handlers to retain each tile */buttons.forEach(b=>b.onclick=()=>{chosen.push(b.textContent);b.disabled=true;out.textContent=chosen.join(parts.every(x=>x.length===1)?'':' ')});button('Reiniciar',()=>{chosen=[];out.textContent='';buttons.forEach(b=>b.disabled=false)});button('Comprobar',()=>{const ok=chosen.join('|')===parts.join('|');mark(ok,word,f);if(ok){buttons.forEach(b=>b.disabled=true);next()}})}
function voice(expected,next,free=false){const f=p('Reconocimiento de palabras, no evaluación fonética.');const R=window.SpeechRecognition||window.webkitSpeechRecognition;let done=false;const input=document.createElement('input');input.placeholder='Alternativa escrita (no evalúa pronunciación)';stage.append(input);button('Comprobar respuesta escrita',()=>{if(done)return;const n=norm(input.value);const ok=free?n.startsWith(norm(expected)+' '):n===norm(expected);mark(ok,expected,f);if(ok){done=true;next()}});button('🎙 Hablar',()=>{if(done)return;if(!R){f.textContent='Reconocimiento no disponible en este navegador. Usa Safari o Chrome compatible.';return}try{recognition?.abort();recognition=new R();recognition.lang='ru-RU';recognition.interimResults=false;recognition.onresult=e=>{const a=e.results[0][0];if(a.confidence>0&&a.confidence<.55){f.textContent='No estoy segura de lo que oí. Repite, por favor.';return}const n=norm(a.transcript);const ok=free?n.startsWith(norm(expected))&&n.length>norm(expected).length:n===norm(expected);f.textContent='Escuché: '+a.transcript;if(ok){done=true;S.voice++;report();p('✓ Frase reconocida.');button('Continuar',next)}else{f.textContent+=' · Repite el modelo; no se ha calificado tu acento.'}};recognition.onerror=()=>f.textContent='No pude escuchar. Revisa el permiso y vuelve a intentar.';recognition.start();f.textContent='Escuchando…'}catch{f.textContent='No se pudo iniciar el micrófono.'}})}
function dialog(d,parent){const box=document.createElement('div');box.className='lesson-block';parent.append(box);let hideR=false,hideT=false;const lines=document.createElement('div');const draw=()=>{lines.innerHTML='';d.forEach((id,i)=>{const w=W[id];const row=document.createElement('div');row.style.margin='10px 0';p((i%2?'B: ':'A: ')+(hideR?'•••':w[0]),row);if(!hideT)p(w[1],row);say(w[0],row);lines.append(row)})};button('Mostrar / ocultar ruso',()=>{hideR=!hideR;draw()},box);button('Mostrar / ocultar traducción',()=>{hideT=!hideT;draw()},box);button('🔊 Diálogo completo',()=>{let i=0;const run=()=>{if(i<d.length)audio(W[d[i++]][0],run)};run()},box);box.append(lines);draw();button('Practicar papel B',()=>{const practice=document.createElement('div');box.append(practice);d.filter((_,i)=>i%2).forEach(id=>{p(W[id][0],practice);say(W[id][0],practice)})},box)}
function maze(mission){const map=['.....','.###.','...#.','.#...','.....'];let x=0,y=0,got=new Set();const targets=mission?[[2,0,0],[4,2,2],[0,4,4]]:[[2,0,0],[4,2,5]];p('Usa las flechas. Visita los personajes marcados y llega a la puerta.');const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(5,1fr);gap:4px;max-width:360px';stage.append(grid);const info=p('');const task=document.createElement('div');stage.append(task);let busy=false;function draw(){grid.innerHTML='';map.forEach((row,j)=>[...row].forEach((cell,i)=>{const t=targets.findIndex(a=>a[0]===i&&a[1]===j);const b=button(x===i&&y===j?'🧍':cell==='#'?'▧':i===4&&j===4?'🚪':t>=0?(got.has(t)?'✓':'👩'):'·',()=>move(i-x,j-y),grid);b.style.cssText='aspect-ratio:1;min-width:0;padding:0;background:'+(cell==='#'?'#b4d6df':'#e1f8fa');b.disabled=cell==='#'}));info.textContent='Encuentros: '+got.size+'/'+targets.length}function move(dx,dy){if(busy||Math.abs(dx)+Math.abs(dy)!==1)return;const a=x+dx,b=y+dy;if(!map[b]||!map[b][a]||map[b][a]==='#')return;x=a;y=b;draw();const t=targets.findIndex(v=>v[0]===x&&v[1]===y);if(t>=0&&!got.has(t)){busy=true;const w=W[targets[t][2]];task.innerHTML='';p('Personaje: '+w[1],task);say(w[0],task);mix([w[0],W[1][0],W[6][0]].filter((v,i,a)=>a.indexOf(v)===i)).forEach(v=>button(v,()=>{if(v===w[0]){got.add(t);busy=false;task.innerHTML='';draw()}else p('Pista: escucha otra vez.',task)},task))}if(x===4&&y===4){if(got.size===targets.length){busy=true;complete()}else info.textContent='Visita todos los personajes antes de salir.'}}[['↑',0,-1],['←',-1,0],['↓',0,1],['→',1,0]].forEach(([a,b,c])=>button(a,()=>move(b,c)));draw()}
function open(n){recognition?.abort();S.current=n;persist();stage.innerHTML='';stage.dataset.completed='';root.querySelector('#d1select').value=n;const h=document.createElement('h4');h.textContent=(n+1)+'. '+names[n];stage.append(h);const ids=[0,1,2,3,4,5,6,7,8];const pick=[0,1,2,4,5,6,7];switch(n){
case 0: rounds(ids,(i,next)=>{const w=W[i];p(w[2]+' '+w[0]);p(w[1]+' · '+w[3]);say(w[0]);button('He revisado esta tarjeta',()=>{S.seen[w[0]]=true;report();next()})});break;
case 1: rounds(pick,(i,next)=>{say(W[i][0]);let visual=false;button('Alternativa: mostrar frase rusa',()=>{visual=true;p(W[i][0])});const f=p('Elige el significado.');let locked=false;mix(pick.map(j=>W[j][2]+' '+W[j][1])).forEach(v=>button(v,()=>{if(locked)return;const ok=v===W[i][2]+' '+W[i][1];mark(ok,W[i][0],f,false);if(ok){locked=true;button('Continuar',next)}}))});break;
case 2: {let selected=null,matched=new Set();const f=p('Selecciona ruso y después su traducción.');const a=document.createElement('div'),b=document.createElement('div');stage.append(a,b);pick.forEach(i=>button(W[i][0],()=>{selected=i;f.textContent=W[i][0]},a));mix(pick).forEach(i=>button(W[i][1],()=>{if(selected===null||matched.has(i))return;mark(selected===i,W[i][0],f);if(selected===i){matched.add(i);f.textContent='Parejas: '+matched.size+'/'+pick.length;if(matched.size===pick.length)complete()}selected=null},b));break}
case 3: rounds(pick,(i,next)=>choices(W[i][2]+' '+W[i][1],mix(pick.map(j=>W[j][0])),W[i][0],W[i][0],next));break;
case 4: rounds(['Привет','Пока','Анна','Очень','Зовут'],(w,next)=>{p('Modelo: '+w);order([...w],next,w)});break;
case 5: rounds([0,2,4,5],(i,next)=>{p(W[i][0]);say(W[i][0]);voice(W[i][0],next)});break;
case 6: rounds([0,5,4,2,1],(i,next)=>{say(W[i][0]);button('Alternativa visual: ver modelo',()=>p(W[i][0]));const input=document.createElement('input');input.placeholder='Escribe en ruso';stage.append(input);const f=p('');button('Comprobar',()=>{const ok=norm(input.value)===norm(W[i][0]);mark(ok,W[i][0],f,false);if(ok)next()});button('Modo inicial: letras',()=>{order([...W[i][0].replace(/[!. ]/g,'')],next,W[i][0])})});break;
case 7: rounds([['Как ___ зовут?','тебя',['тебя','меня','приятно']],['Меня ___ Анна.','зовут',['зовут','тебя','пока']],['Очень ___!','приятно',['приятно','зовут','меня']]],(a,next)=>choices(a[0],mix(a[2]),a[1],a[1],next));break;
case 8: rounds([2,3,4,7,8],(i,next)=>{p(W[i][1]);order(W[i][0].split(' '),next,W[i][0])});break;
case 9:{let first=null,locked=false,count=0;const deck=mix(pick.flatMap(i=>[[i,W[i][0]],[i,W[i][1]]]));const g=document.createElement('div');g.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px';stage.append(g);deck.forEach(([i,t])=>{const b=button('?',()=>{if(locked||b.disabled||b===first?.b)return;b.textContent=t;if(!first){first={i,b};return}if(first.i===i){first.b.disabled=b.disabled=true;first=null;if(++count===pick.length)complete()}else{locked=true;const old=first.b;first=null;setTimeout(()=>{old.textContent=b.textContent='?';locked=false},800)}},g)});break}
case 10: rounds([0,1,2],(i,next)=>{button('Alternativa visual: leer diálogo',()=>p(D[i].map(j=>W[j][0]).join(' / ')));button('🔊 Escuchar conversación',()=>{let j=0;const run=()=>{if(j<D[i].length)audio(W[D[i][j++]][0],run)};run()});choices('¿Cómo se llama la persona?', ['Анна','Мария'],i===0?'Анна':'Мария',W[i===0?3:8][0],next,false)});break;
case 11: rounds([0,1,2],(i,next)=>{p('Ordena las primeras cuatro intervenciones.');order(D[i].slice(0,4).map(j=>W[j][0]),next,W[D[i][1]][0])});break;
case 12:maze(false);break;case 13: {p('Estás en la escuela de ruso. Encuentra a Anna y consigue tu tarjeta de estudiante.');let found=false;const scene=document.createElement('div');scene.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px';stage.append(scene);const f=p('Explora las habitaciones.');button('🚪 Entrada',()=>f.textContent='La recepción está abierta.',scene);button('📚 Biblioteca',()=>f.textContent='Anna no está aquí.',scene);button('🪪 Recepción',()=>{if(found)f.textContent='Ya tienes tu tarjeta.';else f.textContent='Primero conoce a Anna.'},scene);button('👩 Aula',()=>{if(found)return;found=true;scene.querySelectorAll('button').forEach(b=>b.disabled=true);rounds([0,2,4,5],(i,next)=>{p('Anna: '+W[i][1]);choices('¿Qué dices?',mix([W[i][0],W[1][0],W[6][0]].filter((v,j,a)=>a.indexOf(v)===j)),W[i][0],W[i][0],next)})},scene);break;}
case 14: rounds([0,2,4],(i,next)=>{say(W[i][0]);p('Anna · responde en ruso');if(i===2)voice('Меня зовут',next,true);else voice(W[i][0],next)});break;
case 15: rounds([1,7,6],(i,next)=>{p('Nika · práctica guiada por reglas, no IA generativa');say(W[i][0]);voice(i===7?'Меня зовут':W[i][0],next,i===7)});break;
case 16: rounds([0,2,4,5],(i,next)=>{say(W[i][0]);p('Misión: saluda, preséntate y despídete sin mirar el texto.');voice(i===2?'Меня зовут':W[i][0],next,i===2)});break;
}}
renderLesson=function(){if(activeDay!==1||activeCourse!==0){recognition?.abort();return previous()}previous();root=document.getElementById('lesson-content');root.innerHTML='<p class="eyebrow">DAY 1 · A0 · 45–60 MIN</p><h3>Привет! Знакомство</h3><section class="lesson-block"><h4>Nika · Bienvenida</h4><p>Hoy aprenderás a saludar, preguntar un nombre, presentarte y despedirte. Primero escucha; no necesitas conocer todo el alfabeto.</p><p>Привет se usa con amigos. Здравствуйте es formal. Как тебя зовут? es informal; Как вас зовут? es formal. Меня зовут + nombre significa Me llamo. Очень приятно expresa mucho gusto. Пока es informal; До свидания es formal.</p><p>Las mayúsculas de la guía indican la sílaba tónica. Las vocales sin acento se reducen; escucha el modelo. No leas la guía como si fuera español exacto.</p></section><section class="lesson-block"><h4>Audio ruso</h4><label>Velocidad <select id="d1rate"><option value="1">Normal</option><option value=".75">Lenta</option></select></label><p><label>Volumen <input id="d1volume" type="range" min="0" max="1" step=".1" value="1"></label></p><p id="d1audio" role="status">Toca Escuchar para iniciar.</p></section><section class="lesson-block" id="d1words"><h4>Vocabulario</h4></section><section class="lesson-block" id="d1dialogs"><h4>Tres diálogos</h4></section><section class="lesson-block"><h4>Tu práctica</h4><progress id="d1bar" max="17" style="width:100%"></progress><p id="d1progress"></p><select id="d1select" style="width:100%"></select><div id="d1stage" class="exercise"></div></section><section class="lesson-block"><h4>Mi informe</h4><p id="d1report"></p><p>Datos locales de este navegador. La sincronización con profesor y la evaluación fonética requieren servidor.</p></section>';stage=root.querySelector('#d1stage');root.querySelector('#d1rate').onchange=e=>rate=Number(e.target.value);root.querySelector('#d1volume').oninput=e=>volume=Number(e.target.value);W.forEach(w=>{const a=document.createElement('article');a.className='word-card';const ru=p(w[2]+' '+w[0],a);ru.className='d1ru';const es=p(w[1]+' · '+w[3],a);es.className='d1es';say(w[0],a);button('Guardar',()=>{let list=[];try{list=JSON.parse(localStorage.getItem('mova-my-dictionary')||'[]')}catch{}if(!list.some(x=>x.russian===w[0]))list.push({russian:w[0],spanish:w[1]});localStorage.setItem('mova-my-dictionary',JSON.stringify(list))},a);root.querySelector('#d1words').append(a)});let hideES=false,hideRU=false;const words=root.querySelector('#d1words');const toggles=document.createElement('div');words.prepend(toggles);button('Ocultar / mostrar español',()=>{hideES=!hideES;words.querySelectorAll('.d1es').forEach(e=>e.hidden=hideES)},toggles);button('Ocultar / mostrar ruso',()=>{hideRU=!hideRU;words.querySelectorAll('.d1ru').forEach(e=>e.hidden=hideRU)},toggles);D.forEach(d=>dialog(d,root.querySelector('#d1dialogs')));const sel=root.querySelector('#d1select');names.forEach((name,i)=>sel.add(new Option((i+1)+'. '+name,i)));const menu=document.createElement('div');menu.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:8px;margin:12px 0';sel.after(menu);names.forEach((name,i)=>button((i+1)+'. '+name,()=>open(i),menu));sel.onchange=()=>open(Number(sel.value));report();open(S.current)};

const originalDayRender=renderLesson;
renderLesson=function(){originalDayRender();if(activeDay!==1||activeCourse!==0)return;
const words=root.querySelector('#d1words'), dialogs=root.querySelector('#d1dialogs'), practice=root.querySelector('#d1stage').parentElement;
const welcome=root.querySelector('.lesson-block'), audioBox=root.querySelector('#d1audio').closest('.lesson-block'), reportBox=root.querySelector('#d1report').closest('.lesson-block');
const nav=document.createElement('div');nav.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin:16px 0';welcome.before(nav);
const pages=[welcome,words,dialogs,practice,reportBox];const labels=['01 · Inicio','02 · Palabras','03 · Diálogos','04 · Práctica','05 · Resultados'];const navButtons=[];
function showPage(i){pages.forEach((el,j)=>{el.style.display=i===j?'':'none'});audioBox.style.display='none';navButtons.forEach((b,j)=>{b.style.background=i===j?'#087fae':'';b.style.color=i===j?'white':''});}
labels.forEach((label,i)=>navButtons.push(button(label,()=>showPage(i),nav)));
const cards=[...words.querySelectorAll('article')];const groups=[[0,1,5],[2,3,4],[7,8,6]];let group=0,pos=0;const controls=document.createElement('div');controls.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin:12px 0';words.append(controls);const count=p('',controls);const title=p('',words);words.insertBefore(title,cards[0]);title.style.fontWeight='700';
function drawCard(){cards.forEach((el,i)=>{el.style.display=i===groups[group][pos]?'':'none';el.style.width='100%';el.style.minWidth='0';el.style.boxSizing='border-box';el.style.padding='24px';el.style.textAlign='center';const ru=el.querySelector('.d1ru');if(ru)ru.style.cssText='font-size:clamp(24px,6vw,36px);font-weight:700;overflow-wrap:break-word'});title.textContent=['Saludos','Presentación','Conversación formal'][group];count.textContent='Grupo '+(group+1)+' de 3 · Tarjeta '+(pos+1)+' de 3';}
button('← Anterior',()=>{if(pos>0)pos--;else if(group>0){group--;pos=2}drawCard()},controls);button('Siguiente →',()=>{if(pos<2)pos++;else if(group<2){group++;pos=0}else{showPage(2);return}drawCard()},controls);drawCard();
button('Empezar →',()=>showPage(1),welcome);button('Ir a ejercicios →',()=>showPage(3),dialogs);button('Ajustes de audio',()=>{audioBox.style.display=audioBox.style.display==='none'?'':'none'},nav);
showPage(1);
};
})();
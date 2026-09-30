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

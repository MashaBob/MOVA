import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is missing. Add it as a GitHub Actions secret.');
}

const clips = [
  ['privet', 'Привет!'],
  ['zdravstvuyte', 'Здравствуйте!'],
  ['kak-tebya-zovut', 'Как тебя зовут?'],
  ['menya-zovut-mariya', 'Меня зовут Мария.'],
  ['ya-anna', 'Я Анна.'],
  ['otkuda-ty', 'Откуда ты?'],
  ['ya-iz-meksiki', 'Я из Мексики.'],
  ['ya-iz-ispanii', 'Я из Испании.'],
  ['ya-iz-rossii', 'Я из России.'],
  ['dialogo-1', 'Привет! Как тебя зовут? Меня зовут Мария.'],
  ['ochen-priyatno', 'Очень приятно!'],
  ['kak-dela', 'Как дела?'],
  ['horosho-spasibo', 'Хорошо, спасибо!'],
  ['molodets', 'Молодец!'],
  ['nika-russian', 'Привет! Я Ника, твой помощник в MOVA.'],
];

const output = new URL('../audio/', import.meta.url).pathname;
await mkdir(output, { recursive: true });

for (const [name, text] of clips) {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice: 'coral',
      input: text,
      instructions: 'Habla en ruso con voz femenina, cálida, natural y clara para estudiantes hispanohablantes. Pronuncia despacio y correctamente.',
      response_format: 'mp3',
    }),
  });
  if (!response.ok) throw new Error(`OpenAI returned ${response.status} for ${name}`);
  await writeFile(join(output, `${name}.mp3`), Buffer.from(await response.arrayBuffer()));
  console.log(`Created ${name}.mp3`);
}

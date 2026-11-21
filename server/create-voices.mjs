// Создание 7 голосов-персонажей в ElevenLabs через Voice Design (голос по текстовому описанию, без записи чужого голоса).
// Запуск: ELEVENLABS_API_KEY=... node server/create-voices.mjs
// Результат: server/voices-preview/*.mp3 (прослушать) и строка VOICE_IDS для tts-proxy.mjs.
// Проверьте актуальные эндпоинты и условия коммерческого использования вашего тарифа в документации ElevenLabs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KEY = process.env.ELEVENLABS_API_KEY; if (!KEY) { console.error('Нужен ELEVENLABS_API_KEY'); process.exit(1); }
const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '../src/voices.js'), 'utf8');
const chars = [...src.matchAll(/\{ id: '(\w+)'[\s\S]*?prompt: '((?:[^'\\]|\\.)*)'/g)].map(m => ({ id: m[1], prompt: m[2].replace(/\\'/g, "'") }));
const SAMPLE = 'Today was one of those days I want to remember. The light was soft, the air smelled of rain, and for a moment everything felt exactly right.';
const H = { 'xi-api-key': KEY, 'Content-Type': 'application/json' };
const out = path.join(here, 'voices-preview'); fs.mkdirSync(out, { recursive: true });
const ids = {};
for (const c of chars) {
  console.log('→', c.id);
  const r = await fetch('https://api.elevenlabs.io/v1/text-to-voice/design', { method: 'POST', headers: H, body: JSON.stringify({ voice_description: c.prompt, model_id: 'eleven_multilingual_ttv_v2', text: SAMPLE }) });
  if (!r.ok) { console.error('  design', r.status, (await r.text()).slice(0, 300)); continue; }
  const { previews = [] } = await r.json(); if (!previews.length) { console.error('  нет превью'); continue; }
  previews.forEach((p, i) => fs.writeFileSync(path.join(out, `${c.id}-${i + 1}.mp3`), Buffer.from(p.audio_base_64, 'base64')));
  const pick = previews[0];
  let cr = await fetch('https://api.elevenlabs.io/v1/text-to-voice', { method: 'POST', headers: H, body: JSON.stringify({ voice_name: 'Diary — ' + c.id, voice_description: c.prompt.slice(0, 1000), generated_voice_id: pick.generated_voice_id }) });
  if (cr.status === 404) cr = await fetch('https://api.elevenlabs.io/v1/text-to-voice/create-voice-from-preview', { method: 'POST', headers: H, body: JSON.stringify({ voice_name: 'Diary — ' + c.id, voice_description: c.prompt.slice(0, 1000), generated_voice_id: pick.generated_voice_id }) });
  if (!cr.ok) { console.error('  create', cr.status, (await cr.text()).slice(0, 300)); continue; }
  ids[c.id] = (await cr.json()).voice_id; console.log('  voice_id', ids[c.id]);
}
console.log("\nVOICE_IDS='" + JSON.stringify(ids) + "'");
console.log('Превью сохранены в', out, '— если первый вариант не нравится, создайте голос из другого превью в кабинете ElevenLabs.');

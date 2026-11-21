// Прокси нейро-озвучки для «Дневника моей жизни».
// Ключ API хранится только на сервере (в переменных окружения), браузер его не видит.
//
// Запуск (Node.js 18+, без зависимостей):
//   PROVIDER=elevenlabs ELEVENLABS_API_KEY=... VOICE_IDS='{"dreamy":"...","casual":"..."}' node server/tts-proxy.mjs
//   PROVIDER=openai OPENAI_API_KEY=... node server/tts-proxy.mjs
// Затем на сайте: Настройки → Студия голосов → «Сервер нейро-озвучки» = http://localhost:8787/tts
//
// ElevenLabs: голоса персонажей создаются один раз скриптом server/create-voices.mjs (Voice Design по описаниям),
// их ID кладутся в VOICE_IDS. Эмоциональный режим передаётся через voice_settings (stability/style).
// OpenAI: встроенные голоса + параметр `instructions` (модель gpt-4o-mini-tts) — описание персонажа и режима.
// Внимание: по документации OpenAI модели tts-1/tts-1-hd/gpt-4o-mini-tts объявлены устаревшими (отключение 6 января 2027).
import http from 'node:http';

const PORT = +(process.env.PORT || 8787);
const PROVIDER = (process.env.PROVIDER || 'elevenlabs').toLowerCase();
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || '*';
const VOICE_IDS = JSON.parse(process.env.VOICE_IDS || '{}');
// Соответствие персонажей встроенным голосам OpenAI (можно поменять через OPENAI_VOICES)
const OPENAI_VOICES = Object.assign({ dreamy: 'shimmer', casual: 'ash', grandma: 'sage', storyteller: 'onyx', sunshine: 'nova', calm: 'echo', poet: 'ballad' }, JSON.parse(process.env.OPENAI_VOICES || '{}'));
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini-tts';
const ELEVEN_MODEL = process.env.ELEVEN_MODEL || 'eleven_multilingual_v2';
// Эмоциональные режимы для ElevenLabs: меньше stability — больше выразительности; style — сила подачи
const ELEVEN_MODES = {
  happy: { stability: .3, similarity_boost: .8, style: .55, use_speaker_boost: true },
  soft: { stability: .6, similarity_boost: .8, style: .15, use_speaker_boost: true },
  nostalgic: { stability: .5, similarity_boost: .8, style: .35, use_speaker_boost: true },
  dreamy: { stability: .42, similarity_boost: .8, style: .45, use_speaker_boost: true }
};
const MAX_CHARS = 4000;

async function synthesize({ text, character, mode, instructions }) {
  if (PROVIDER === 'openai') {
    const r = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OPENAI_MODEL, voice: OPENAI_VOICES[character] || 'coral', input: text, instructions, response_format: 'mp3' })
    });
    if (!r.ok) throw new Error('OpenAI ' + r.status + ' ' + (await r.text()).slice(0, 300));
    return Buffer.from(await r.arrayBuffer());
  }
  const voiceId = VOICE_IDS[character];
  if (!voiceId) throw new Error('Нет voice_id для персонажа ' + character + ' — запустите server/create-voices.mjs и заполните VOICE_IDS');
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST', headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: ELEVEN_MODEL, voice_settings: ELEVEN_MODES[mode] || ELEVEN_MODES.soft })
  });
  if (!r.ok) throw new Error('ElevenLabs ' + r.status + ' ' + (await r.text()).slice(0, 300));
  return Buffer.from(await r.arrayBuffer());
}

http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method !== 'POST' || !req.url.startsWith('/tts')) { res.writeHead(404); return res.end('not found'); }
  try {
    let body = ''; for await (const c of req) { body += c; if (body.length > 64000) throw new Error('too large'); }
    const q = JSON.parse(body); const text = String(q.text || '').slice(0, MAX_CHARS);
    if (!text.trim()) { res.writeHead(400); return res.end('empty text'); }
    const audio = await synthesize({ text, character: String(q.character || 'dreamy'), mode: String(q.mode || 'soft'), instructions: String(q.instructions || '').slice(0, 2000) });
    res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' }); res.end(audio);
  } catch (e) { console.error(e); res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(String(e.message || e)); }
}).listen(PORT, () => console.log(`TTS-прокси (${PROVIDER}) слушает http://localhost:${PORT}/tts`));

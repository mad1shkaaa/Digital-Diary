
// ===================== Библиотека голосов-персонажей =====================
// Два движка: (1) нейросетевой TTS через ваш сервер-прокси (server/tts-proxy.mjs: ElevenLabs или OpenAI),
// (2) запасной — голоса браузера (Web Speech API) с профилем персонажа: подбор голоса по полу, темп, высота, паузы, интонации.
const VOICES = [
  { id: 'dreamy', e: '🌙', g: 'f', age: 22, base: [.95, 1.14, 1.15], n: { ru: 'Мечтательная девушка', en: 'The Dreamy Girl', kk: 'Арманшыл қыз' },
    d: { ru: 'Мягкий, тёплый, бархатный голос. Рассказывает с нежностью и искренним вдохновением.', en: 'Soft, warm, velvety. Tells stories with tenderness and genuine inspiration.', kk: 'Жұмсақ, жылы, барқыт дауыс. Нәзіктікпен әрі шабытпен әңгімелейді.' },
    prompt: 'A young adult female voice, approximately 22 years old. Soft, warm, melodic and naturally expressive. Her voice should sound gentle and slightly airy, with a beautiful, smooth vocal texture. She tells stories with genuine enthusiasm, tenderness and emotional warmth, as if sharing a meaningful personal memory or a beautiful story with someone close to her. Use natural variations in pitch, subtle emotional emphasis and graceful pauses. Her delivery should feel uplifting, sincere and captivating, never overly theatrical or artificially sweet.' },
  { id: 'casual', e: '🧢', g: 'm', age: 21, base: [1.06, .98, .8], n: { ru: 'Простой парень', en: 'The Casual Guy', kk: 'Қарапайым жігіт' },
    d: { ru: 'Живой, дружелюбный голос — как будто друг рассказывает тебе про свой день.', en: 'Relaxed and friendly — like a friend telling you about his day.', kk: 'Жанды, достық дауыс — досың күнін айтып бергендей.' },
    prompt: 'A young adult male voice, approximately 21 years old. Natural, relaxed, friendly and casually expressive. His voice has a warm, medium-pitched tone with a slightly textured, authentic quality. He should sound like an ordinary young man casually telling a friend about his day. His speech is conversational, spontaneous and engaging, with natural changes in pace, occasional excitement, subtle amusement and genuine curiosity. Use realistic conversational intonation, comfortable pauses and natural emphasis on interesting details.' },
  { id: 'grandma', e: '🧶', g: 'f', age: 70, base: [.82, .9, 1.45], n: { ru: 'Уютная бабушка', en: 'The Cozy Grandma', kk: 'Жайлы әже' },
    d: { ru: 'Тёплый, чуть хрипловатый голос. Как бабушка, рассказывающая историю тихим вечером.', en: 'Warm, slightly husky and comforting — a grandmother on a quiet evening.', kk: 'Жылы, сәл қырылдаған дауыс — тыныш кештегі әже әңгімесі.' },
    prompt: 'An original elderly female voice, approximately 70 years old. Warm, gentle, slightly husky and comforting. Her voice should carry the natural texture and subtle imperfections of an older woman. She speaks with kindness and affection, like a loving grandmother sharing childhood memories or telling a heartwarming story to her grandchildren. Her pace is relaxed, with thoughtful pauses and gentle emotional emphasis. Her delivery should feel intimate, sincere and reassuring, with a touch of nostalgia.' },
  { id: 'storyteller', e: '📜', g: 'm', age: 37, base: [.86, .78, 1.5], n: { ru: 'Рассказчик', en: 'The Storyteller', kk: 'Ертегіші' },
    d: { ru: 'Глубокий, бархатный, загадочный голос — будто древняя легенда.', en: 'Deep, rich and mysterious — like an ancient legend.', kk: 'Терең, барқыт, жұмбақ дауыс — көне аңыздай.' },
    prompt: 'A mature male storytelling voice, approximately 35 years old. Deep, rich, velvety and resonant. Calm but highly expressive, with a naturally captivating presence. He narrates stories with a mysterious and immersive atmosphere, carefully building anticipation through subtle changes in pitch, pace and intensity. Use deliberate pauses before important revelations and gentle emphasis on meaningful words. His voice should feel sophisticated, cinematic and engaging.' },
  { id: 'sunshine', e: '🌻', g: 'f', age: 21, base: [1.1, 1.26, .8], n: { ru: 'Солнечная девушка', en: 'The Sunshine Girl', kk: 'Күншуақ қыз' },
    d: { ru: 'Яркий, звонкий, жизнерадостный голос — делится чем-то чудесным.', en: 'Bright, lively and cheerful — sharing something wonderful.', kk: 'Жарқын, сыңғырлаған, көңілді дауыс — керемет жаңалықпен бөліседі.' },
    prompt: 'A young adult female voice, approximately 21 years old. Bright, lively, cheerful and naturally energetic. Her voice is clear, light and expressive, with a pleasant youthful tone. She speaks with genuine excitement and positivity, as if telling a close friend about something wonderful that happened. Her delivery includes playful intonation, natural enthusiasm, occasional laughter-like warmth and expressive changes in pitch. Keep the energy authentic and spontaneous rather than exaggerated.' },
  { id: 'calm', e: '🌿', g: 'm', age: 25, base: [.93, .9, 1.15], n: { ru: 'Спокойный друг', en: 'The Calm Friend', kk: 'Байсалды дос' },
    d: { ru: 'Мягкий, чуть низкий, уверенный голос — как ночной разговор с близким человеком.', en: 'Soft, slightly deep and reassuring — a late-night talk with someone you trust.', kk: 'Жұмсақ, сәл төмен, сенімді дауыс — жақын адаммен түнгі әңгіме.' },
    prompt: 'A young adult male voice, approximately 25 years old. Calm, warm, slightly deep and naturally reassuring. His voice has a smooth, relaxed texture without sounding sleepy or monotonous. He speaks like a thoughtful friend sharing personal reflections or describing meaningful moments from his life. His delivery is conversational, sincere and unhurried, with subtle emotional variations and natural pauses. The overall feeling should be peaceful, grounded and authentic.' },
  { id: 'poet', e: '🪶', g: 'f', age: 24, base: [.86, 1.06, 1.45], n: { ru: 'Нежная поэтесса', en: 'The Soft Poet', kk: 'Нәзік ақын' },
    d: { ru: 'Воздушный, мелодичный голос — о памяти, природе и времени.', en: 'Delicate, airy and melodic — about memories, nature and time.', kk: 'Ауадай жеңіл, әуезді дауыс — естелік, табиғат, уақыт туралы.' },
    prompt: 'A young adult female voice, approximately 24 years old. Delicate, dreamy, melodic and softly expressive. Her voice should have an airy yet warm quality, with a naturally graceful rhythm. She narrates reflective and poetic texts as if describing memories, beautiful moments or thoughts she has never shared before. Her delivery is gentle and immersive, with subtle nostalgia, wonder and emotional depth. Use flowing intonation, carefully placed pauses and delicate emphasis.' }
];
const VOICE = Object.fromEntries(VOICES.map(v => [v.id, v]));
// Эмоциональные режимы: меняют не только скорость — интонацию, паузы, акценты, разброс высоты
const VMODES = {
  happy: { e: '✨', n: { ru: 'Радостно', en: 'Happy & Inspired', kk: 'Қуанышты' }, rate: 1.06, pitch: .08, pause: .85, varia: 1.6, lift: .06,
    ai: 'Emotional mode: happy and inspired — energetic, uplifting, expressive and enthusiastic, with bright rising intonation and lively rhythm.' },
  soft: { e: '🤍', n: { ru: 'Мягко и нежно', en: 'Soft & Gentle', kk: 'Жұмсақ' }, rate: .94, pitch: -.02, pause: 1.1, varia: .6, lift: 0,
    ai: 'Emotional mode: soft and gentle — tender, calm, smooth and affectionate, with a quiet warm tone and gentle emphasis.' },
  nostalgic: { e: '🍂', n: { ru: 'Ностальгично', en: 'Nostalgic', kk: 'Сағынышпен' }, rate: .9, pitch: -.05, pause: 1.35, varia: .9, lift: -.03,
    ai: 'Emotional mode: nostalgic — thoughtful, reflective, slightly melancholic and warm, with lingering pauses as if remembering.' },
  dreamy: { e: '🌌', n: { ru: 'Мечтательно', en: 'Dreamy & Magical', kk: 'Арманшыл' }, rate: .9, pitch: .04, pause: 1.45, varia: 1.1, lift: .02,
    ai: 'Emotional mode: dreamy and magical — flowing, imaginative, delicate and atmospheric, with a floating, wondering intonation.' }
};
const VMODE_KEYS = Object.keys(VMODES);
const MOOD_VOICE = { joy: ['sunshine', 'happy'], calm: ['calm', 'soft'], love: ['dreamy', 'soft'], inspired: ['dreamy', 'happy'], nostalgic: ['grandma', 'nostalgic'], sad: ['poet', 'soft'], tired: ['calm', 'soft'], angry: ['casual', 'happy'] };
const defaultVoice = mood => { const m = MOOD_VOICE[mood] || ['dreamy', 'soft']; return { c: m[0], m: m[1] }; };
const VOICE_SAMPLE = { ru: 'Сегодня был особенный день… Я расскажу его так, будто мы сидим совсем рядом.', en: 'Today was a special day… I will tell it as if we were sitting right next to each other.', kk: 'Бүгін ерекше күн болды… Мен оны қатар отырғандай етіп айтып беремін.' };

const FEMALE_RX = /female|woman|girl|svetlana|dariya|daria|milena|alyona|alena|katya|anna|irina|elena|aigul|zira|aria|jenny|michelle|sonia|libby|samantha|karen|moira|tessa|victoria|serena|fiona|ava|allison|susan|joanna|kendra|salli|ivy|emma|olivia|natasha|tatyana|marina|google русский|google uk english female/i;
const MALE_RX = /\bmale\b|\bman\b|dmitry|dmitri|pavel|daulet|yuri|maxim|guy|davis|david|mark|daniel|alex\b|fred|tom\b|ryan|thomas|george|christopher|eric|roger|brian|andrew|google uk english male/i;
const Narrator = {
  token: 0,
  langCode() { return LANG === 'kk' ? 'kk' : LANG; },
  score(v) { const n = v.name; let s = 0; if (/natural/i.test(n)) s += 60; if (/neural/i.test(n)) s += 50; if (/online/i.test(n)) s += 20; if (/premium|enhanced|siri/i.test(n)) s += 35; if (/google/i.test(n)) s += 25; if (!v.localService) s += 6; if (/compact|espeak|robot/i.test(n)) s -= 40; return s; },
  list(all) { if (!('speechSynthesis' in window)) return []; const vs = speechSynthesis.getVoices(), c = this.langCode(); let L = vs.filter(v => v.lang.toLowerCase().replace('_', '-').startsWith(c)); if (!L.length && all) L = vs; return L.sort((a, b) => this.score(b) - this.score(a)); },
  // Подбор голоса браузера под персонажа: язык → пол → качество; «пожилой» и «глубокий» достигаются профилем высоты/темпа
  pick(ch) {
    const vs = speechSynthesis.getVoices(), u = me && me(); this.fallback = false;
    const pref = u && u.voiceMap && u.voiceMap[ch.id]; if (pref) { const v = vs.find(v => v.voiceURI === pref); if (v) return v; }
    let L = this.list(false); if (!L.length && LANG === 'kk') { L = vs.filter(v => /^ru/i.test(v.lang)).sort((a, b) => this.score(b) - this.score(a)); this.fallback = true; }
    if (!L.length) { this.fallback = true; return null; }
    const want = ch.g === 'f' ? FEMALE_RX : MALE_RX, other = ch.g === 'f' ? MALE_RX : FEMALE_RX;
    const ranked = L.map(v => ({ v, s: this.score(v) + (want.test(v.name) ? 80 : 0) - (other.test(v.name) ? 80 : 0) })).sort((a, b) => b.s - a.s);
    this.genderMiss = !want.test(ranked[0].v.name); return ranked[0].v;
  },
  chunks(text) {
    const out = [], re = /[^.!?…\n]+(?:[.!?…]+|\n+|$)/g; let m;
    while ((m = re.exec(text))) {
      const raw = m[0]; if (!raw.trim()) { if (re.lastIndex === m.index) re.lastIndex++; continue; }
      const end = (raw.trim().match(/[.!?…]+$/) || [''])[0], para = /\n/.test(raw);
      const parts = raw.length > 100 ? raw.split(/(?<=[,;:—–])\s+/) : [raw]; let off = m.index;
      parts.forEach((p, i) => { const st = text.indexOf(p, off); off = st + p.length; const last = i === parts.length - 1; const kind = !last ? ',' : end.includes('?') ? '?' : end.includes('!') ? '!' : end.includes('…') || end.includes('...') ? '…' : '.'; out.push({ text: p.trim(), start: st + (p.length - p.trimStart().length), kind, para: last && para }); });
      if (re.lastIndex === m.index) re.lastIndex++;
    }
    return out;
  },
  ttsUrl() { try { return (localStorage.getItem('dml.tts') || '').trim(); } catch (e) { return ''; } },
  // sel = { c: персонаж, m: режим }
  async speak(text, sel, h = {}) {
    this.stop(); const tok = ++this.token, ch = VOICE[(sel && sel.c) || 'dreamy'] || VOICES[0], md = VMODES[(sel && sel.m) || 'soft'] || VMODES.soft;
    const url = this.ttsUrl();
    if (url) { try { return await this.speakAI(url, text, ch, md, tok, h); } catch (e) { console.warn('AI TTS недоступен, использую голос браузера', e); if (tok !== this.token) return false; } }
    if (!('speechSynthesis' in window)) { toast(t('noSpeech')); return false; }
    const ss = speechSynthesis, voice = this.pick(ch), [br, bp, bpause] = ch.base;
    if (this.fallback && LANG !== 'ru') toast(t('noVoiceLang'));
    const ch2 = this.chunks(text), r = mulberry32(hashStr(text + ch.id)); let i = 0;
    const next = () => {
      if (tok !== this.token) return; if (this.paused) { this.resumeFn = next; return; } if (i >= ch2.length) { h.onEnd && h.onEnd(); return; }
      const c = ch2[i], u = new SpeechSynthesisUtterance(c.text); this.cur = u;
      if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = { ru: 'ru-RU', en: 'en-US', kk: 'kk-KZ' }[LANG];
      const v = md.varia;
      let rate = br * md.rate * (1 + (r() - .5) * .05 * v), pitch = bp + md.pitch + (r() - .5) * .07 * v;
      if (this.genderMiss) pitch += ch.g === 'f' ? .22 : -.22; // голос не того пола в системе — сдвигаем высоту
      if (c.kind === '?') pitch += .1; if (c.kind === '!') { rate *= 1 + .04 * v; pitch += .05 * v; } if (c.kind === ',') pitch += .02 + md.lift;
      if (i === 0) rate *= .96; if (i === ch2.length - 1) { rate *= .92; pitch -= .04; }
      if (ch.id === 'storyteller' && i > 0 && c.text.length < 60) rate *= .94;
      u.rate = clamp(rate, .5, 1.5); u.pitch = clamp(pitch, .4, 1.8);
      u.onboundary = e => { if (e.charIndex !== undefined) h.onWord && h.onWord(c.start + e.charIndex); };
      u.onend = () => { if (tok !== this.token) return; i++; const pause = ({ ',': 230, '.': 540, '!': 440, '?': 600, '…': 950 }[c.kind] + r() * 160 + (c.para ? 500 : 0)) * bpause * md.pause; this.tm = setTimeout(next, pause); };
      u.onerror = e => { if (tok !== this.token) return; if (e.error === 'interrupted' || e.error === 'canceled') return; i++; this.tm = setTimeout(next, 200); };
      ss.speak(u);
    };
    h.onStart && h.onStart(); next(); return true;
  },
  async speakAI(url, text, ch, md, tok, h) {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, character: ch.id, mode: Object.keys(VMODES).find(k => VMODES[k] === md), lang: LANG, prompt: ch.prompt, instructions: ch.prompt + ' ' + md.ai }) });
    if (!res.ok) throw new Error('TTS ' + res.status);
    const blob = await res.blob(); if (tok !== this.token) return false;
    const a = new Audio(URL.createObjectURL(blob)); this.audio = a;
    a.ontimeupdate = () => { if (a.duration && h.onWord) h.onWord(Math.floor(text.length * a.currentTime / a.duration)); };
    a.onended = () => { if (tok === this.token) h.onEnd && h.onEnd(); URL.revokeObjectURL(a.src); };
    h.onStart && h.onStart(); await a.play(); return true;
  },
  pause() { this.paused = true; if (this.audio && !this.audio.paused) this.audio.pause(); if ('speechSynthesis' in window && speechSynthesis.speaking) speechSynthesis.pause(); },
  resume() { this.paused = false; if (this.audio && this.audio.paused && this.audio.currentTime > 0 && !this.audio.ended) this.audio.play(); if ('speechSynthesis' in window && speechSynthesis.paused) speechSynthesis.resume(); if (this.resumeFn) { const f = this.resumeFn; this.resumeFn = null; f(); } },
  stop() { this.token++; this.paused = false; this.resumeFn = null; clearTimeout(this.tm); if (this.audio) { this.audio.pause(); this.audio = null; } if ('speechSynthesis' in window) speechSynthesis.cancel(); }
};
// Выбор голоса: карточки персонажей + эмоциональные режимы (используется в записи дня, редактировании и «студии голосов»)
function voicePickerHTML(sel, idp) {
  return `<div class="vcards">${VOICES.map(v => `<div class="vcard ${sel.c === v.id ? 'on' : ''}" data-vc="${v.id}"><i>${v.e}</i><div><b>${esc(L3(v.n))}</b><small>${esc(L3(v.d))}</small></div><button type="button" class="pv" data-vpv="${v.id}" aria-label="preview">▶</button></div>`).join('')}</div>
    <div class="vmodes">${VMODE_KEYS.map(k => `<button type="button" class="vmode ${sel.m === k ? 'on' : ''}" data-vm="${k}">${VMODES[k].e} ${esc(L3(VMODES[k].n))}</button>`).join('')}</div>`;
}
function bindVoicePicker(root, sel, onChange) {
  $$('[data-vc]', root).forEach(el => el.onclick = e => { if (e.target.closest('[data-vpv]')) return; sel.c = el.dataset.vc; onChange(); });
  $$('[data-vm]', root).forEach(el => el.onclick = () => { sel.m = el.dataset.vm; onChange(); });
  $$('[data-vpv]', root).forEach(b => b.onclick = () => { const playing = b.classList.contains('playing'); Narrator.stop(); $$('[data-vpv]', root).forEach(x => { x.classList.remove('playing'); x.textContent = '▶'; }); if (playing) return; b.classList.add('playing'); b.textContent = '■'; Narrator.speak(VOICE_SAMPLE[LANG] || VOICE_SAMPLE.ru, { c: b.dataset.vpv, m: sel.m }, { onEnd: () => { b.classList.remove('playing'); b.textContent = '▶'; } }); });
}

// ===================== Запись текста голосом =====================
const Dictation = {
  supported() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); },
  start(textarea, btn) {
    if (this.rec) { this.stop(); return; }
    if (!this.supported()) { toast(t('noDictation')); return; }
    const R = window.SpeechRecognition || window.webkitSpeechRecognition, rec = new R(); this.rec = rec; this.btn = btn;
    rec.lang = { ru: 'ru-RU', en: 'en-US', kk: 'kk-KZ' }[LANG]; rec.continuous = true; rec.interimResults = true;
    const base = textarea.value.replace(/\s*$/, ''); let finalTxt = '';
    rec.onresult = e => { let interim = ''; for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) finalTxt += r[0].transcript + ' '; else interim += r[0].transcript; } textarea.value = (base ? base + ' ' : '') + (finalTxt + interim).replace(/\s+/g, ' ').trimStart(); };
    rec.onerror = e => { if (e.error === 'not-allowed') toast(t('micDenied')); else if (e.error === 'language-not-supported' && rec.lang === 'kk-KZ') toast(t('noDictationLang')); };
    rec.onend = () => { this.rec = null; btn.classList.remove('rec'); btn.innerHTML = t('dictate'); };
    btn.classList.add('rec'); btn.innerHTML = t('dictateStop'); rec.start();
  },
  stop() { if (this.rec) { try { this.rec.stop(); } catch (e) { } } }
};

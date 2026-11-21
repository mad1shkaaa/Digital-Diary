'use strict';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const raf = () => new Promise(r => requestAnimationFrame(r));
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rgb2hsl(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); if (mx === r) h = (g - b) / d + (g < b ? 6 : 0); else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h /= 6; } return [h * 360, s, l]; }
function hsl2rgb(h, s, l) { h = (((h % 360) + 360) % 360) / 360; let r, g, b; if (s === 0) { r = g = b = l; } else { const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; const f = t => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }; r = f(h + 1 / 3); g = f(h); b = f(h - 1 / 3); } return [r * 255, g * 255, b * 255]; }
const css = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const hex2rgb = h => { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
const rgb2hex = c => '#' + c.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
const mixc = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const cdist = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function drawCover(g, img, w, h, ox = 0, oy = 0) { const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height; const s = Math.max(w / iw, h / ih); const dw = iw * s, dh = ih * s; g.drawImage(img, ox + (w - dw) / 2, oy + (h - dh) / 2, dw, dh); }
// toDataURL синхронный: не ждёт композитор во время анимаций (toBlob под нагрузкой бывает очень медленным)
function canvasToBlob(c, type = 'image/jpeg', q = .9) { const u = c.toDataURL(type, q), bin = atob(u.slice(u.indexOf(',') + 1)), a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return Promise.resolve(new Blob([a], { type })); }
function blobToImage(blob) {
  return new Promise((res, rej) => {
    const u = URL.createObjectURL(blob); const im = new Image();
    im.onload = () => res(im);
    im.onerror = async () => {
      URL.revokeObjectURL(u);
      // запасной путь: некоторые форматы декодируются через createImageBitmap
      try { const bm = await createImageBitmap(blob); const c = mk(bm.width, bm.height); c.getContext('2d').drawImage(bm, 0, 0); c.naturalWidth = bm.width; c.naturalHeight = bm.height; res(c); }
      catch (e) { rej(new Error('Не удалось открыть изображение' + (blob.name ? ' «' + blob.name + '»' : '') + ' — браузер не поддерживает этот формат (часто это HEIC с iPhone). Сохраните фото как JPG или PNG.')); }
    };
    im.src = u;
  });
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
const MONTHS_G = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const WEEKDAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const SEASON_RU = { winter: 'зима', spring: 'весна', summer: 'лето', autumn: 'осень' };
function parseDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function todayISO() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function fmtLong(s) { const d = parseDate(s); return `${d.getDate()} ${MONTHS_G[d.getMonth()]} ${d.getFullYear()}`; }
function fmtShort(s) { const d = parseDate(s); return `${String(d.getDate()).padStart(2, '0')} · ${ROMAN[d.getMonth()]} · ${d.getFullYear()}`; }
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
let _toastT;
function toast(msg, ms = 3400) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(_toastT); _toastT = setTimeout(() => t.classList.remove('on'), ms); }
function wrapText(g, text, maxW) { const words = text.split(' '); const lines = []; let cur = ''; for (const w of words) { const t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; }
let _AC = null;
function getAC() { if (!_AC) { const C = window.AudioContext || window.webkitAudioContext; if (C) _AC = new C(); } return _AC; }
function decodeAudio(ab) { const ac = getAC(); return new Promise((res, rej) => { try { const p = ac.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); } catch (e) { rej(e); } }); }
function download(blob, name) {
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 1000); toast('Файл «' + name + '» готов. Если скачивание не началось — откройте прототип отдельной страницей.', 5000); }
  catch (e) { toast('Скачивание заблокировано в этом окне просмотра'); }
}

// Хранилище дней: IndexedDB, при недоступности — память вкладки
const DB = {
  db: null, ok: false, mem: [],
  async open() {
    try {
      this.db = await new Promise((res, rej) => {
        const r = indexedDB.open('inside-memory', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('days', { keyPath: 'id' });
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
        setTimeout(() => rej(new Error('idb timeout')), 4000);
      });
      this.ok = true;
    } catch (e) { this.ok = false; console.warn('IndexedDB недоступна, данные живут до перезагрузки', e); }
  },
  async all() {
    if (!this.ok) return this.mem.slice();
    try { return await new Promise((res, rej) => { const r = this.db.transaction('days').objectStore('days').getAll(); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
    catch (e) { return this.mem.slice(); }
  },
  async put(d) {
    this.mem = this.mem.filter(x => x.id !== d.id); this.mem.push(d);
    if (!this.ok) return;
    try { await new Promise((res, rej) => { const tx = this.db.transaction('days', 'readwrite'); tx.objectStore('days').put(d); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); }
    catch (e) { console.warn('Не удалось сохранить', e); }
  },
  async del(id) {
    this.mem = this.mem.filter(x => x.id !== id);
    if (!this.ok) return;
    try { await new Promise((res) => { const tx = this.db.transaction('days', 'readwrite'); tx.objectStore('days').delete(id); tx.oncomplete = res; tx.onerror = res; }); } catch (e) { }
  },
  async clear() {
    this.mem = [];
    if (!this.ok) return;
    try { await new Promise((res) => { const tx = this.db.transaction('days', 'readwrite'); tx.objectStore('days').clear(); tx.oncomplete = res; tx.onerror = res; }); } catch (e) { }
  }
};

// ===== Анализ ввода: текст, фото, музыка =====
// Текст: словарь основ (русский), с учётом отрицания «не …»
const RX = s => new RegExp('(^|[^а-я])(' + s + ')', 'g');
function matchAll(t, stems) {
  const out = [];
  for (const s of stems) {
    const re = RX(s); let m;
    while ((m = re.exec(t))) {
      const start = m.index + m[1].length;
      const neg = /(^|[^а-я])не\s+$/.test(t.slice(Math.max(0, start - 4), start));
      const wm = t.slice(start).match(/^[а-я-]+/);
      out.push({ word: wm ? wm[0] : m[2], pos: start, neg });
      if (re.lastIndex === m.index) re.lastIndex++;
    }
  }
  return out;
}
const TEXT_LEX = {
  pos: ['счаст', 'радост', 'радова', 'рад([^а-я]|$)', 'весел', 'смея', 'смех', 'улыб', 'любл', 'любов', 'обнима', 'обня', 'тепл', 'уют', 'кайф', 'классн', 'прекрасн', 'чудесн', 'красив', 'волшебн', 'нежн', 'спокойн', 'мирн', 'отдых', 'гуля', 'вкусн', 'праздн', 'побед', 'ура([^а-я]|$)', 'восторг', 'свобод', 'легк', 'благодар', 'мечт', 'обожа', 'лучш', 'хорош', 'солн', 'какао', 'разговарива', 'сюрприз', 'заработал', 'получил', 'смешн', 'душевн', 'ласков', 'поцел', 'тишин'],
  neg: ['груст', 'печал', 'тоск', 'одинок', 'плак', 'слез', 'устал', 'тяжел', 'тяжк', 'страш', 'трев', 'злю', 'злост', 'злил', 'бесит', 'раздраж', 'плох', 'ужас', 'боль', 'болел', 'обид', 'скуч', 'потер', 'разочар', 'сер(ый|ое|ая|ые|о)([^а-я]|$)', 'пуст', 'стресс', 'паник', 'провал', 'не успе', 'ссор', 'поругал', 'темн', 'уныл', 'нерв', 'баг', 'мерз', 'холодн', 'одиночеств', 'сломал', 'опозд'],
  hi: ['бега', 'бежал', 'быстр', 'сроч', 'дедлайн', 'сдач', 'энерг', 'танц', 'концерт', 'крич', 'шумн', 'вечеринк', 'адреналин', 'спорт', 'трениров', 'ноч', 'не спал', 'кофе', 'гонк', 'драйв', 'громк', 'взрыв', 'восторг', 'прыга', 'сует', 'спеш', 'опазд', 'стресс', 'паник', 'экзамен', 'офис', 'работ', 'проект', 'кнопк', 'деплой', 'электрон', 'фестивал', 'салют', 'сюрприз', 'смея', 'носил', 'шарик'],
  lo: ['тих', 'спокойн', 'медлен', 'лениво', 'сонн', 'уют', 'плед', 'ча(й|ем|я)([^а-я]|$)', 'какао', 'книг', 'дремал', 'неспеш', 'долго', 'молча', 'тишин', 'отдых', 'лежал', 'медитац', 'смотрел', 'пруд', 'озер', 'закат', 'рассвет', 'одеял', 'дома([^а-я]|$)', 'туман', 'сидел', 'капли', 'дожд', 'ни о чем'],
  nost: ['детств', 'детск', 'вспомин', 'ностальг', 'как раньше', 'стар(ый|ые|ая|ое|ого|ых)', 'фотоальбом', 'альбом', 'бабушк', 'дедушк', 'родител', 'школ', 'выпускн', 'давно', 'пленк', 'кассет', 'винил', 'ретро', 'мандарин'],
  nature: ['лес([ауе]|ом)?([^а-я]|$)', 'гор(ы|ах|ам)([^а-я]|$)', 'мор(е|я|ю)([^а-я]|$)', 'озер', 'пруд', 'рек(а|и|у|е)([^а-я]|$)', 'степ', 'пол(е|я)([^а-я]|$)', 'неб', 'звезд', 'листь', 'листв', 'дерев', 'сад([ауе]|ом)?([^а-я]|$)', 'цвет', 'трав', 'рассвет', 'закат', 'облак', 'птиц', 'камыш', 'туман', 'солн', 'вод(а|ой|у|е)'],
  solo: ['одна([^а-я]|$)', 'наедине', 'в одиночестве', 'сама с собой', 'сам с собой', 'один дома', 'был один']
};
const normText = raw => ' ' + raw.toLowerCase().replace(/ё/g, 'е') + ' ';
function analyzeText(raw) {
  const t = normText(raw);
  const M = {}; for (const k in TEXT_LEX) M[k] = matchAll(t, TEXT_LEX[k]);
  let P = 0, N = 0;
  M.pos.forEach(m => m.neg ? N += 1 : P += 1);
  M.neg.forEach(m => m.neg ? P += .5 : N += 1);
  const H = M.hi.length, L = M.lo.length;
  const excl = (raw.match(/!/g) || []).length, ell = (raw.match(/\.\.\.|…/g) || []).length;
  const valence = clamp((P - N) / (P + N + 1.5), -1, 1);
  const arousal = clamp(.5 + (H - L) / (H + L + 2) * .75 + Math.min(excl, 4) * .04 - Math.min(ell, 3) * .03);
  const signals = [...new Set([...M.pos, ...M.neg, ...M.hi, ...M.lo].sort((a, b) => a.pos - b.pos).map(m => m.word))].slice(0, 8);
  return { valence, arousal, P, N, H, L, nost: M.nost.length, nature: M.nature.length, solo: M.solo.length > 0, signals, conf: clamp((P + N + H + L) / 6) };
}

// Фото: яркость, контраст, насыщенность, теплота света, k-means палитра
function kmeans(px, k) {
  const sorted = px.slice().sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
  let C = []; for (let i = 0; i < k; i++) C.push(sorted[Math.floor((i + .5) / k * sorted.length)].slice());
  const A = new Array(px.length);
  for (let it = 0; it < 9; it++) {
    const S = C.map(() => [0, 0, 0, 0]);
    for (let i = 0; i < px.length; i++) {
      const p = px[i]; let bi = 0, bd = 1e12;
      for (let j = 0; j < C.length; j++) { const c = C[j]; const dd = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2; if (dd < bd) { bd = dd; bi = j; } }
      A[i] = bi; const s = S[bi]; s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; s[3]++;
    }
    C = C.map((c, j) => S[j][3] ? [S[j][0] / S[j][3], S[j][1] / S[j][3], S[j][2] / S[j][3]] : c);
  }
  const cnt = C.map(() => 0); A.forEach(a => cnt[a]++);
  return C.map((c, j) => ({ c: c.map(Math.round), w: cnt[j] / px.length })).sort((a, b) => b.w - a.w);
}
function analyzePhoto(img) {
  const w = 48, h = 60, c = mk(w, h), g = c.getContext('2d', { willReadFrequently: true });
  drawCover(g, img, w, h);
  const d = g.getImageData(0, 0, w, h).data;
  let sL = 0, sL2 = 0, sS = 0, sR = 0, sB = 0; const px = [];
  for (let i = 0; i < d.length; i += 4) { const r = d[i], gg = d[i + 1], b = d[i + 2]; const hs = rgb2hsl(r, gg, b); sL += hs[2]; sL2 += hs[2] * hs[2]; sS += hs[1]; sR += r; sB += b; px.push([r, gg, b]); }
  const n = px.length, bri = sL / n;
  return { brightness: bri, contrast: Math.sqrt(Math.max(0, sL2 / n - bri * bri)), saturation: sS / n, warmth: (sR - sB) / n / 255, palette: kmeans(px, 5) };
}
function mergePhotos(stats) {
  const n = stats.length; const avg = k => stats.reduce((s, x) => s + x[k], 0) / n;
  const pal = []; stats.forEach(s => s.palette.forEach(p => pal.push({ c: p.c, w: p.w / n })));
  const out = []; pal.sort((a, b) => b.w - a.w).forEach(p => { const f = out.find(o => cdist(o.c, p.c) < 40); if (f) f.w += p.w; else out.push({ c: p.c.slice(), w: p.w }); });
  out.sort((a, b) => b.w - a.w);
  const b = avg('brightness'), s = avg('saturation'), w = avg('warmth'), ct = avg('contrast');
  return { brightness: b, saturation: s, warmth: w, contrast: ct, palette: out.slice(0, 6).map(p => ({ c: p.c, w: +p.w.toFixed(3) })), count: n,
    valence: clamp((b - .45) * 1.1 + (s - .3) * .8 + w * .9, -1, 1), arousal: clamp(.2 + s * .6 + ct * 1.3) };
}

// Музыка: аудиоанализ (FFT): темп по автокорреляции огибающей атак, лад по хрома-профилю Крумхансла, энергия, «яркость»
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang), half = len >> 1;
    for (let i = 0; i < n; i += len) { let cr = 1, ci = 0; for (let j = 0; j < half; j++) { const a = i + j, b = a + half; const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr; re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti; const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr; } }
  }
}
const hann = N => { const w = new Float64Array(N); for (let i = 0; i < N; i++) w[i] = .5 - .5 * Math.cos(2 * Math.PI * i / (N - 1)); return w; };
const KMAJ = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88], KMIN = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
const NOTE = ['до', 'до♯', 'ре', 'ми♭', 'ми', 'фа', 'фа♯', 'соль', 'ля♭', 'ля', 'си♭', 'си'];
function corr(a, b) { const n = a.length; let ma = 0, mb = 0; for (let i = 0; i < n; i++) { ma += a[i]; mb += b[i]; } ma /= n; mb /= n; let num = 0, da = 0, db = 0; for (let i = 0; i < n; i++) { num += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; } return num / (Math.sqrt(da * db) || 1); }
function detectKey(ch) {
  let bM = -2, bMi = 0, bm = -2, bmi = 0;
  for (let r = 0; r < 12; r++) { const rot = []; for (let i = 0; i < 12; i++) rot.push(ch[(i + r) % 12]); const a = corr(rot, KMAJ), b = corr(rot, KMIN); if (a > bM) { bM = a; bMi = r; } if (b > bm) { bm = b; bmi = r; } }
  const major = bM >= bm;
  return { mode: major ? 'major' : 'minor', name: major ? NOTE[bMi] + ' мажор' : NOTE[bmi] + ' минор', conf: clamp(Math.abs(bM - bm) * 4 + .15) };
}
function analyzeAudioBuffer(buf) {
  const sr = buf.sampleRate, c0 = buf.getChannelData(0), c1 = buf.numberOfChannels > 1 ? buf.getChannelData(1) : null;
  const step = Math.max(1, Math.round(sr / 11025)), fs = sr / step;
  const maxLen = Math.floor(45 * sr); let st = 0; if (c0.length > maxLen) st = Math.floor(Math.min(c0.length - maxLen, c0.length * .25));
  const en = Math.min(c0.length, st + maxLen), n = Math.floor((en - st) / step), x = new Float32Array(n);
  let s2 = 0;
  for (let i = 0; i < n; i++) { let v = 0; const j = st + i * step; for (let k = 0; k < step; k++) v += c0[j + k] + (c1 ? c1[j + k] : 0); v /= step * (c1 ? 2 : 1); x[i] = v; s2 += v * v; }
  const rms = Math.sqrt(s2 / Math.max(1, n)) || 1e-6, db = 20 * Math.log10(rms), loud = clamp((db + 32) / 22);
  // огибающая атак (spectral flux)
  const N = 1024, H = 256, win = hann(N), re = new Float64Array(N), im = new Float64Array(N), prev = new Float64Array(N / 2), env = [];
  let cSum = 0, mSum = 0;
  for (let p = 0; p + N <= n; p += H) {
    for (let i = 0; i < N; i++) { re[i] = x[p + i] * win[i]; im[i] = 0; }
    fft(re, im); let flux = 0;
    for (let k = 1; k < N / 2; k++) { const m = Math.log1p(20 * Math.hypot(re[k], im[k])); const df = m - prev[k]; if (df > 0) flux += df; prev[k] = m; cSum += k * m; mSum += m; }
    env.push(flux);
  }
  const fps = fs / H, E = env.length;
  const centroid = mSum ? (cSum / mSum) * fs / N : 1000, bright = clamp((centroid - 400) / 1800);
  const o = new Float32Array(E);
  for (let i = 0; i < E; i++) { let s = 0, c = 0; for (let j = Math.max(0, i - 12); j < Math.min(E, i + 12); j++) { s += env[j]; c++; } o[i] = Math.max(0, env[i] - s / c); }
  let best = 0, bestLag = 0; const acs = [];
  const lo = Math.floor(fps * 60 / 190), hi = Math.ceil(fps * 60 / 55);
  for (let lag = lo; lag <= hi && lag < E; lag++) { let s = 0; for (let i = 0; i + lag < E; i++) s += o[i] * o[i + lag]; s /= (E - lag); const bpm = 60 * fps / lag; const w = Math.exp(-.5 * Math.pow(Math.log2(bpm / 105) / .9, 2)); const v = s * w; acs[lag] = v; if (v > best) { best = v; bestLag = lag; } }
  let lag = bestLag;
  if (acs[lag - 1] !== undefined && acs[lag + 1] !== undefined) { const a = acs[lag - 1], b = acs[lag], c = acs[lag + 1]; const d = a - 2 * b + c; if (d) lag = lag + .5 * (a - c) / d; }
  let bpm = bestLag ? Math.round(60 * fps / lag) : 100;
  let mean = 0; for (const v of o) mean += v; mean /= Math.max(1, E); let sd = 0; for (const v of o) sd += (v - mean) ** 2; sd = Math.sqrt(sd / Math.max(1, E));
  let peaks = 0, last = -10; for (let i = 1; i < E - 1; i++) if (o[i] > mean + sd && o[i] >= o[i - 1] && o[i] >= o[i + 1] && i - last > 3) { peaks++; last = i; }
  const density = clamp(peaks / Math.max(1, E / fps) / 4.5);
  if (bpm > 110 && density < .5 && bestLag && acs[bestLag * 2] !== undefined && acs[bestLag * 2] > .4 * acs[bestLag]) bpm = Math.round(bpm / 2);
  // хрома → тональность
  const N2 = 8192, H2 = 4096, win2 = hann(N2), r2 = new Float64Array(N2), i2 = new Float64Array(N2), chroma = new Float64Array(12);
  for (let p = 0; p + N2 <= n; p += H2) {
    for (let i = 0; i < N2; i++) { r2[i] = x[p + i] * win2[i]; i2[i] = 0; }
    fft(r2, i2);
    for (let k = 1; k < N2 / 2; k++) { const f = k * fs / N2; if (f < 60 || f > 2000) continue; const m = Math.hypot(r2[k], i2[k]); const midi = 69 + 12 * Math.log2(f / 440); const pc = ((Math.round(midi) % 12) + 12) % 12; chroma[pc] += Math.sqrt(m); }
  }
  const key = chroma.some(v => v > 0) ? detectKey(chroma) : { mode: 'major', name: 'лад не определён', conf: .1 };
  const energy = clamp(.2 * loud + .5 * density + .3 * bright);
  return finishMusic({ bpm, energy, bright, mode: key.mode, keyName: key.name, keyConf: key.conf, source: 'audio', duration: buf.duration, db: Math.round(db) });
}
const GENRES = {
  '': null, 'классика': { bpm: 76, energy: .28, bright: .45 }, 'джаз': { bpm: 104, energy: .42, bright: .5 }, 'лоу-фай': { bpm: 80, energy: .25, bright: .35 },
  'инди / фолк': { bpm: 96, energy: .42, bright: .5 }, 'поп': { bpm: 118, energy: .68, bright: .62 }, 'рок': { bpm: 132, energy: .82, bright: .6 },
  'электроника': { bpm: 126, energy: .85, bright: .6 }, 'хип-хоп': { bpm: 92, energy: .7, bright: .5 }, 'эмбиент': { bpm: 66, energy: .15, bright: .35 },
  'k-pop': { bpm: 124, energy: .82, bright: .7 }, 'ретро / эстрада': { bpm: 100, energy: .5, bright: .5 }, 'саундтрек': { bpm: 84, energy: .45, bright: .45 }
};
function musicFromMeta(meta) {
  const g = GENRES[meta.genre] || { bpm: 100, energy: .5, bright: .5 };
  let bpm = g.bpm, energy = g.energy;
  if (meta.tempo === 'slow') { bpm = Math.min(bpm, 72); energy -= .12; }
  if (meta.tempo === 'mid') bpm = 104;
  if (meta.tempo === 'fast') { bpm = Math.max(bpm, 132); energy += .12; }
  const mode = meta.mood === 'minor' ? 'minor' : 'major';
  const keyName = meta.mood === 'minor' ? 'минор (по описанию)' : meta.mood === 'major' ? 'мажор (по описанию)' : 'лад не указан';
  return finishMusic({ bpm, energy: clamp(energy), bright: g.bright, mode, keyName, keyConf: meta.mood ? .8 : .1, source: 'описание', year: meta.year ? +meta.year : null });
}
function finishMusic(m) {
  const tempoN = clamp((m.bpm - 60) / 110);
  m.tempoN = tempoN;
  m.valence = clamp((m.mode === 'major' ? .32 : -.32) * (.35 + .65 * m.keyConf) + (m.bright - .5) * .3 + (tempoN - .5) * .15, -1, 1);
  m.arousal = clamp(.55 * m.energy + .3 * tempoN + .15 * m.bright);
  return m;
}

// ===== Визуальная система: правила «настроение → форма» =====
const MODES = {
  impression: { name: 'Импрессионизм', short: 'мазок · Моне', ref: 'Клод Моне, Пьер-Огюст Ренуар', mood: 'тёплый покой', proto: [.55, .3],
    palette: ['#f2c46d', '#e08a3c', '#c9603a', '#8fae7e', '#6f8fb8', '#f6e3b4'], hue: 38, vignette: .28,
    why: 'Короткие мазки и рассеянный свет растворяют контуры: день вспоминается не деталями, а теплом и воздухом.',
    when: 'светлый и спокойный день: прогулка, разговор, природа, медленная мажорная музыка',
    voice: { rate: .92, pitch: 1.0, label: 'тихий и тёплый' }, trans: 'dissolve', fx: 'flecks' },
  fauve: { name: 'Фовизм и вырезки', short: 'цвет · Матисс', ref: 'Анри Матисс, фовисты', mood: 'радость, праздник', proto: [.6, .82],
    palette: ['#ff4f5e', '#ffb000', '#2ec4b6', '#3a86ff', '#ff7bd5', '#fff1d0'], hue: 350, vignette: .1,
    why: 'Чистые открытые цвета и танцующие вырезанные формы передают громкость и движение счастливого дня.',
    when: 'яркий шумный день: праздник, танцы, друзья, быстрая мажорная музыка',
    voice: { rate: 1.12, pitch: 1.15, label: 'живой и быстрый' }, trans: 'pop', fx: 'confetti' },
  kandinsky: { name: 'Геометрическая абстракция', short: 'ритм · Кандинский', ref: 'Василий Кандинский, конструктивизм', mood: 'напряжение, собранность', proto: [-.25, .8],
    palette: ['#1d2a44', '#3d5a80', '#98c1d9', '#e0fbfc', '#ee6c4d', '#f4d35e'], hue: 215, vignette: .2,
    why: 'Жёсткая сетка, диагонали и резкие пересечения линий — визуальный ритм дедлайна: всё собрано, натянуто, на пределе.',
    when: 'напряжённый день: работа ночью, экзамен, сдача проекта, быстрая электронная музыка',
    voice: { rate: 1.06, pitch: .88, label: 'собранный и ровный' }, trans: 'cut', fx: 'lines' },
  nocturne: { name: 'Ноктюрн и акварельный туман', short: 'туман · Уистлер', ref: 'Джеймс Уистлер, Уильям Тёрнер', mood: 'меланхолия, тоска', proto: [-.5, .22],
    palette: ['#1c2541', '#3a506b', '#5c6f8a', '#8d99ae', '#c9ced6', '#e8c7a0'], hue: 220, vignette: .45,
    why: 'Размытые края и приглушённый холодный свет — как воспоминание сквозь мокрое стекло: видно не всё, но чувство остаётся.',
    when: 'грустный и медленный день: дождь, одиночество, тоска, медленная минорная музыка',
    voice: { rate: .82, pitch: .85, label: 'медленный и негромкий' }, trans: 'dissolve', fx: 'rain' },
  film: { name: 'Плёночная фотография', short: 'плёнка · альбом', ref: 'плёнка Kodak Portra, семейные альбомы 80–90-х', mood: 'ностальгия, нежность', proto: [.22, .42],
    palette: ['#f4d6b0', '#e9a178', '#c8745a', '#7c9a8c', '#3e4a5a', '#fff4e3'], hue: 28, vignette: .42,
    why: 'Зерно, ореолы света и тёплый засвет делают день похожим на снимок из семейного альбома — то, что хочется хранить.',
    when: 'тёплая ностальгия: семья, детство, старые фото, праздники дома, музыка прошлых десятилетий',
    voice: { rate: .9, pitch: 1.0, label: 'мягкий, как рассказ из альбома' }, trans: 'flash', fx: 'dust' },
  japan: { name: 'Японская минималистичная графика', short: 'пустота · укиё-э', ref: 'укиё-э, Кацусика Хокусай, принцип «ма»', mood: 'созерцание, тишина', proto: [.15, .12],
    palette: ['#efe6d4', '#1f2a44', '#d1495b', '#8c9a7a', '#c8a96a', '#2b2b2b'], hue: 200, vignette: .06,
    why: 'Много пустого пространства и плоские цвета — тишина и ясность, когда в дне было мало событий, но много воздуха.',
    when: 'тихий день наедине с собой: рассвет, природа, вода, эмбиент',
    voice: { rate: .8, pitch: .95, label: 'очень спокойный, с паузами' }, trans: 'fade', fx: 'petals' }
};
const MODE_KEYS = Object.keys(MODES);

// ----- Лексикон для названий папок -----
const PLACES = [
  { re: 'парк', nom: 'парк', g: 'm', prep: 'в парке' }, { re: 'пруд', nom: 'пруд', g: 'm', prep: 'у пруда' }, { re: 'озер', nom: 'озеро', g: 'n', prep: 'у озера' },
  { re: 'мор(е|я|ю|ем)([^а-я]|$)', nom: 'море', g: 'n', prep: 'у моря' }, { re: 'пляж', nom: 'пляж', g: 'm', prep: 'на пляже' }, { re: 'рек(а|и|у|е|ой)([^а-я]|$)', nom: 'река', g: 'f', prep: 'у реки' },
  { re: 'набережн', nom: 'набережная', g: 'f', prep: 'на набережной' }, { re: 'офис', nom: 'офис', g: 'm', prep: 'в офисе' }, { re: 'кафе', nom: 'кафе', g: 'n', prep: 'в кафе' },
  { re: 'кофейн', nom: 'кофейня', g: 'f', prep: 'в кофейне' }, { re: 'ресторан', nom: 'ресторан', g: 'm', prep: 'в ресторане' },
  { re: 'лес(у|а|ом|е)?([^а-я]|$)', nom: 'лес', g: 'm', prep: 'в лесу' }, { re: 'гор(ы|ах|ам|у)([^а-я]|$)', nom: 'горы', g: 'p', prep: 'в горах' }, { re: 'степ(ь|и)', nom: 'степь', g: 'f', prep: 'в степи' },
  { re: 'дач(а|е|у|и)([^а-я]|$)', nom: 'дача', g: 'f', prep: 'на даче' }, { re: 'сад(у|а|ом|е)?([^а-я]|$)', nom: 'сад', g: 'm', prep: 'в саду' },
  { re: 'крыш', nom: 'крыша', g: 'f', prep: 'на крыше' }, { re: 'окн|окош', nom: 'окно', g: 'n', prep: 'у окна' }, { re: 'балкон', nom: 'балкон', g: 'm', prep: 'на балконе' }, { re: 'кухн', nom: 'кухня', g: 'f', prep: 'на кухне' },
  { re: 'музе', nom: 'музей', g: 'm', prep: 'в музее' }, { re: 'концерт', nom: 'концерт', g: 'm', prep: 'на концерте' }, { re: 'кино([^а-я]|$)|кинотеатр', nom: 'кино', g: 'n', prep: 'в кино' },
  { re: 'театр', nom: 'театр', g: 'm', prep: 'в театре' }, { re: 'кат(ок|ке|ка)([^а-я]|$)', nom: 'каток', g: 'm', prep: 'на катке' },
  { re: 'поезд', nom: 'поезд', g: 'm', prep: 'в поезде' }, { re: 'аэропорт', nom: 'аэропорт', g: 'm', prep: 'в аэропорту' }, { re: 'вокзал', nom: 'вокзал', g: 'm', prep: 'на вокзале' },
  { re: 'универ', nom: 'универ', g: 'm', prep: 'в универе' }, { re: 'школ', nom: 'школа', g: 'f', prep: 'в школе' }, { re: 'библиотек', nom: 'библиотека', g: 'f', prep: 'в библиотеке' },
  { re: 'день рожд|дне рожд|дня рожд|днюх', nom: 'день рождения', g: 'm', prep: 'на дне рождения', party: 1 }, { re: 'вечеринк', nom: 'вечеринка', g: 'f', prep: 'на вечеринке', party: 1 }, { re: 'свадьб', nom: 'свадьба', g: 'f', prep: 'на свадьбе', party: 1 },
  { re: 'город', nom: 'город', g: 'm', prep: 'в городе' }, { re: 'дома([^а-я]|$)|домой', nom: 'дом', g: 'm', prep: 'дома' }, { re: 'квартир', nom: 'квартира', g: 'f', prep: 'дома' }
];
const PEOPLE = [
  { re: 'девушк', w: 'с девушкой' }, { re: 'парн(ем|я|ю)([^а-я]|$)|бойфренд', w: 'с парнем' }, { re: 'подруг', w: 'с подругой' }, { re: 'друз', w: 'с друзьями' },
  { re: 'друг(ом|у|а)?([^а-я]|$)', w: 'с другом' }, { re: 'мам(а|ой|е|у|ы)([^а-я]|$)', w: 'с мамой' }, { re: 'пап(а|ой|е|у|ы)([^а-я]|$)', w: 'с папой' },
  { re: 'бабушк', w: 'с бабушкой' }, { re: 'дедушк', w: 'с дедушкой' }, { re: 'семь(я|ей|е|ю)|родител', w: 'с семьёй' }, { re: 'брат', w: 'с братом' }, { re: 'сестр', w: 'с сестрой' },
  { re: 'коллег|команд', w: 'с командой' }, { re: 'одна([^а-я]|$)|наедине|в одиночестве|один дома', w: 'наедине с собой' }
];
const OBJECTS = [
  { re: 'какао', n: 'какао', g: 'n' }, { re: 'кофе', n: 'кофе', g: 'm' }, { re: 'ча(й|ем|я|ю)([^а-я]|$)', n: 'чай', g: 'm' }, { re: 'глинтвейн', n: 'глинтвейн', g: 'm' },
  { re: 'танц', n: 'танцы', g: 'p' }, { re: 'пикник', n: 'пикник', g: 'm' }, { re: 'костер|костр', n: 'костёр', g: 'm' }, { re: 'гитар', n: 'гитара', g: 'f' },
  { re: 'книг', n: 'книги', g: 'p' }, { re: 'фильм', n: 'фильм', g: 'm' }, { re: 'плед', n: 'плед', g: 'm' }, { re: 'звезд', n: 'звёзды', g: 'p' }, { re: 'салют', n: 'салют', g: 'm' },
  { re: 'листь|листв', n: 'листья', g: 'p' }, { re: 'цвет(ы|ов|ами)', n: 'цветы', g: 'p' }, { re: 'морожен', n: 'мороженое', g: 'n' }, { re: 'пицц', n: 'пицца', g: 'f' },
  { re: 'торт', n: 'торт', g: 'm' }, { re: 'мандарин', n: 'мандарины', g: 'p' },
  { re: 'дожд', n: 'дождь', g: 'm', wx: 'rain' }, { re: 'снег', n: 'снег', g: 'm', wx: 'snow' }, { re: 'туман', n: 'туман', g: 'm', wx: 'fog' }
];
const EVENTS = [{ re: 'сдач', t: 'перед сдачей' }, { re: 'дедлайн', t: 'перед дедлайном' }, { re: 'экзамен', t: 'перед экзаменом' }, { re: 'защит', t: 'перед защитой' }, { re: 'релиз', t: 'перед релизом' }, { re: 'собеседован', t: 'перед собеседованием' }];
const TIMES = [
  { re: 'рассвет', n: 'Рассвет', g: 'm', k: 'утро' }, { re: 'утр(о|ом|а|енн)', n: 'Утро', g: 'n', k: 'утро' }, { re: 'закат', n: 'Закат', g: 'm', k: 'вечер' },
  { re: 'вечер(ом|а|у|е|ний|няя|нее|ние)?([^а-я]|$)', n: 'Вечер', g: 'm', k: 'вечер' }, { re: 'ноч', n: 'Ночь', g: 'f', k: 'ночь' }, { re: 'днем([^а-я]|$)|полдень|в обед', n: 'День', g: 'm', k: 'день' }
];
const WEATHER_RX = [['rain', 'дожд|ливен|ливн'], ['snow', 'снег|снеж|метел'], ['fog', 'туман'], ['sunny', 'солнечн|солнце'], ['cold', 'холодн|мороз'], ['hot', 'жар(а|к)']];
const WEATHER_RU = { rain: 'дождь', snow: 'снег', fog: 'туман', sunny: 'солнечно', cold: 'холодно', hot: 'жара' };
const ADJ = { autumn: ['Осенний', 'Осенняя', 'Осеннее', 'Осенние'], winter: ['Зимний', 'Зимняя', 'Зимнее', 'Зимние'], spring: ['Весенний', 'Весенняя', 'Весеннее', 'Весенние'], summer: ['Летний', 'Летняя', 'Летнее', 'Летние'], rain: ['Дождливый', 'Дождливая', 'Дождливое', 'Дождливые'], snow: ['Снежный', 'Снежная', 'Снежное', 'Снежные'], fog: ['Туманный', 'Туманная', 'Туманное', 'Туманные'] };
const GI = { m: 0, f: 1, n: 2, p: 3 };
const TAIL = { impression: 'в тёплом свете', fauve: 'на одном дыхании', kandinsky: 'на пределе сил', nocturne: 'под серым небом', film: 'как в старом альбоме', japan: 'в полной тишине' };
const reOne = s => new RegExp('(^|[^а-я])(' + s + ')');
function firstPos(t, list) { let best = null; for (const e of list) { const m = reOne(e.re).exec(t); if (m) { const pos = m.index + m[1].length; if (/(после|из|до)\s+$/.test(t.slice(Math.max(0, pos - 7), pos))) continue; if (!best || pos < best.pos) best = { ...e, pos }; } } return best; }
function monthSeason(m) { return m === 11 || m < 2 ? 'winter' : m < 5 ? 'spring' : m < 8 ? 'summer' : 'autumn'; }

function detectCtx(raw, dateStr, weatherSel) {
  const t = normText(raw);
  const season = reOne('осен').test(t) ? 'autumn' : reOne('зим').test(t) ? 'winter' : reOne('весн').test(t) ? 'spring' : reOne('лет(о|ом|н)').test(t) ? 'summer' : monthSeason(parseDate(dateStr).getMonth());
  let weather = weatherSel || null;
  if (!weather) for (const [k, re] of WEATHER_RX) if (reOne(re).test(t)) { weather = k; break; }
  let obj = null; for (const o of OBJECTS) { if (weather && o.wx === weather) continue; if (reOne(o.re).test(t)) { obj = o; break; } }
  return { season, weather, time: firstPos(t, TIMES), place: firstPos(t, PLACES), person: firstPos(t, PEOPLE), obj, ev: firstPos(t, EVENTS), date: dateStr };
}
function makeTitle(ctx, mode, existing = []) {
  const ak = ['rain', 'snow', 'fog'].includes(ctx.weather) ? ctx.weather : ctx.season;
  const A = g => ADJ[ak][GI[g]];
  const { time, place, person, obj, ev } = ctx;
  const tl = x => x.n.toLowerCase();
  let w;
  if (time && place) w = [ev ? time.n : A(time.g) + ' ' + tl(time), place.prep, ev ? ev.t : person ? person.w : obj ? 'и ' + obj.n : ''];
  else if (place && obj) w = [A(place.g) + ' ' + place.nom, 'и', obj.n];
  else if (place && person) w = [A('m') + ' день', place.prep, person.w];
  else if (place) w = [A('m') + ' день', place.prep, ev ? ev.t : ''];
  else if (time && obj) w = [A(time.g) + ' ' + tl(time), 'и', obj.n];
  else if (time) w = [A(time.g) + ' ' + tl(time), person ? person.w : ev ? ev.t : TAIL[mode]];
  else if (obj) w = [A(obj.g) + ' ' + obj.n, person ? person.w : TAIL[mode]];
  else w = [A('m') + ' день', person ? person.w : TAIL[mode]];
  let s = w.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  if (s.split(' ').length < 3) s += ' ' + TAIL[mode];
  const words = s.split(' '); if (words.length > 7) s = words.slice(0, 7).join(' ');
  s = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  let out = s, k = 2; while (existing.includes(out)) out = s + ' (' + (k++) + ')';
  return out;
}

// ----- Сведение настроения и выбор приёма -----
function buildStyle({ text, photo, music, raw, date, weather, existing, mood }) {
  const ctx = detectCtx(raw, date, weather);
  const wt = .25 + .25 * text.conf;
  let v = clamp((text.valence * wt + music.valence * .35 + photo.valence * .2) / (wt + .55), -1, 1);
  let a = clamp((text.arousal * wt + music.arousal * .5 + photo.arousal * .15) / (wt + .65));
  if (mood) { v = clamp(mood.v * .62 + v * .38, -1, 1); a = clamp(mood.a * .62 + a * .38); }
  const bonus = { impression: 0, fauve: 0, kandinsky: 0, nocturne: 0, film: 0, japan: 0 }, reasons = {};
  const add = (k, val, why) => { bonus[k] += val; (reasons[k] = reasons[k] || []).push(why); };
  if (text.nost) add('film', Math.min(.4, .12 * text.nost), 'ностальгия в тексте');
  if (music.year && music.year < 2005) add('film', .15, 'песня ' + music.year + ' года');
  if (text.solo) { add('japan', .18, 'день наедине с собой'); if (text.nature) add('japan', .04 * Math.min(4, text.nature), 'природа и тишина'); }
  else if (text.nature && v > 0) add('impression', .03 * Math.min(3, text.nature), 'природа и воздух');
  if (ctx.weather === 'rain') add('nocturne', .1, 'дождь');
  if (ctx.ev) add('kandinsky', .12, 'событие «' + ctx.ev.t + '»');
  if (ctx.place && ctx.place.nom === 'офис') add('kandinsky', .06, 'офис');
  if ((ctx.place && ctx.place.party) || (ctx.obj && ['танцы', 'салют'].includes(ctx.obj.n))) add('fauve', .12, 'праздник');
  const scores = {};
  for (const k of MODE_KEYS) { const p = MODES[k].proto; scores[k] = -((v - p[0]) ** 2 + (a - p[1]) ** 2) + bonus[k]; }
  const mode = MODE_KEYS.reduce((b, k) => scores[k] > scores[b] ? k : b, MODE_KEYS[0]);
  const M = MODES[mode];
  const timeKey = ctx.time ? ctx.time.k : null;
  const seasonHue = { winter: 210, spring: 110, summer: 46, autumn: 32 }[ctx.season];
  const dh = ((seasonHue - M.hue + 540) % 360) - 180;
  let tintHue = M.hue + dh * .45; if (timeKey === 'ночь') tintHue = lerp(tintHue, 228, .4);
  const tn = music.tempoN, en = music.energy;
  const bpb = (mode === 'kandinsky' || mode === 'fauve') ? 4 : music.bpm < 90 ? 6 : 8;
  const P = {
    strokeScale: lerp(1.45, .72, tn) * (1 + (1 - en) * .1),
    density: lerp(.7, 1.35, en),
    sat: clamp(1 + v * .22 + (music.mode === 'major' ? .06 : -.14) + (mode === 'nocturne' ? -.25 : 0) + (mode === 'fauve' ? .2 : 0), .45, 1.6),
    light: (timeKey === 'ночь' ? -.1 : timeKey === 'утро' ? .03 : 0) + (photo.brightness - .5) * -.12 + v * .03,
    contrast: lerp(.85, 1.22, a),
    tintHue, tintAmt: clamp(.16 + .14 * (1 - photo.saturation) + (mode === 'nocturne' ? .1 : 0), 0, .4),
    grain: clamp(.05 + Math.min(text.nost, 3) * .02 + (music.year && music.year < 2000 ? .07 : 0) + (mode === 'film' ? .1 : 0) + (mode === 'nocturne' ? .04 : 0), 0, .3),
    vignette: M.vignette,
    slideSec: +clamp(60 / music.bpm * bpb, 2.2, 7).toFixed(2), beatsPerSlide: bpb,
    animSpeed: lerp(.4, 1.6, tn * .6 + en * .4),
    pal: M.palette.slice()
  };
  const grade = makeGrader(P);
  P.photoPal = photo.palette.slice(0, 5).map(p => rgb2hex(grade(...p.c)));
  let acc = null, bs = 0; for (const h of P.photoPal) { const c = hex2rgb(h); const [, s, l] = rgb2hsl(...c); const sc = s * (l > .3 && l < .75 ? 1 : .3); if (sc > bs) { bs = sc; acc = h; } }
  P.accent = bs > .25 ? acc : M.palette[4];
  const title = makeTitle(ctx, mode, existing);
  const voice = { ...M.voice, rate: +(M.voice.rate * lerp(.95, 1.05, tn)).toFixed(2) };
  const explain = buildExplain({ text, photo, music, ctx, v, a, mode, P, scores, reasons, voice, title });
  const plainCtx = { season: ctx.season, weather: ctx.weather, timeKey, date, place: ctx.place && ctx.place.nom, person: ctx.person && ctx.person.w, obj: ctx.obj && ctx.obj.n, ev: ctx.ev && ctx.ev.t, time: ctx.time && ctx.time.n };
  return { mode, params: P, trans: M.trans, fx: M.fx, voice, title, explain, mood: { v: +v.toFixed(3), a: +a.toFixed(3) }, ctx: plainCtx, scores };
}
function makeGrader(P) {
  return (r, g, b) => {
    let [h, s, l] = rgb2hsl(r, g, b);
    s = clamp(s * P.sat); l = clamp((l - .5) * P.contrast + .5 + P.light);
    const dh = ((P.tintHue - h + 540) % 360) - 180; h += dh * P.tintAmt * (1 - s * .5);
    const o = hsl2rgb(h, s, l); const tc = hsl2rgb(P.tintHue, .45, l);
    return mixc(o, tc, P.tintAmt * .3);
  };
}
const vWord = v => v > .35 ? 'светлый' : v > .1 ? 'скорее светлый' : v > -.1 ? 'ровный' : v > -.35 ? 'скорее грустный' : 'грустный';
const aWord = a => a > .65 ? 'быстрый, напряжённый' : a > .45 ? 'живой' : a > .3 ? 'размеренный' : 'тихий и медленный';
function buildExplain({ text, photo, music, ctx, v, a, mode, P, scores, reasons, voice, title }) {
  const M = MODES[mode], L = [];
  const sw = hs => hs.map(h => `<span class="sw" style="background:${h}"></span>`).join('');
  L.push(`<b>Текст.</b> ${text.signals.length ? 'Слова-сигналы: ' + text.signals.slice(0, 6).map(w => '«' + esc(w) + '»').join(', ') + '.' : 'Явных сигналов настроения немного — больше веса у музыки и фото.'} Тон ${vWord(text.valence)}, темп ${aWord(text.arousal)}.`);
  const bri = photo.brightness > .58 ? 'светлые кадры' : photo.brightness < .38 ? 'тёмные кадры' : 'кадры средней яркости';
  const warm = photo.warmth > .06 ? 'тёплый свет' : photo.warmth < -.03 ? 'холодный свет' : 'нейтральный свет';
  L.push(`<b>Фото (${photo.count}).</b> ${bri}, ${warm}, ${photo.saturation > .4 ? 'насыщенные цвета' : 'спокойные цвета'}. Палитра собрана из ваших снимков: ${sw(P.photoPal)}`);
  const tempoTxt = music.bpm < 85 ? 'медленная музыка → крупные мазки (×' + P.strokeScale.toFixed(2) + ') и долгие кадры' : music.bpm > 115 ? 'быстрая музыка → мелкий плотный ритм и короткие кадры' : 'средний темп → умеренный ритм';
  L.push(`<b>Музыка.</b> ${music.source === 'audio' ? 'Аудиоанализ' : 'По описанию'}: ~${music.bpm} BPM, ${music.keyName}, энергия ${Math.round(music.energy * 100)}%. ${tempoTxt}; смена кадров каждые ${P.slideSec} с (${P.beatsPerSlide} долей такта). ${music.mode === 'minor' ? 'Минор → насыщенность ниже, свет приглушён.' : 'Мажор → цвета чуть ярче.'}`);
  const cparts = [SEASON_RU[ctx.season]]; if (ctx.time) cparts.push(ctx.time.n.toLowerCase()); if (ctx.weather) cparts.push(WEATHER_RU[ctx.weather]);
  L.push(`<b>Контекст.</b> ${cparts.join(', ')} → тонировка в оттенок ${Math.round(((P.tintHue % 360) + 360) % 360)}°, зерно ${Math.round(P.grain * 100)}%.`);
  const second = MODE_KEYS.filter(k => k !== mode).reduce((b, k) => scores[k] > scores[b] ? k : b, MODE_KEYS.find(k => k !== mode));
  L.push(`<b>Приём: ${M.name}</b> (${M.ref}). Итоговое настроение: светлота ${v.toFixed(2)}, энергия ${a.toFixed(2)} — ближе всего к «${M.mood}»${reasons[mode] ? ' (+ ' + reasons[mode].join(', ') + ')' : ''}. ${M.why} Второй кандидат был «${MODES[second].name}».`);
  L.push(`<b>Голос озвучки.</b> ${voice.label}: скорость ${voice.rate}, высота ${voice.pitch}.`);
  const tp = []; if (ctx.time) tp.push('время «' + ctx.time.n.toLowerCase() + '»'); if (ctx.place) tp.push('место «' + ctx.place.nom + '»'); if (ctx.person) tp.push('люди «' + ctx.person.w + '»'); if (ctx.obj) tp.push('деталь «' + ctx.obj.n + '»'); if (ctx.ev) tp.push('событие «' + ctx.ev.t + '»');
  L.push(`<b>Название папки.</b> «${esc(title)}» — собрано из: ${tp.length ? tp.join(', ') : 'сезона и настроения'}${['rain', 'snow', 'fog'].includes(ctx.weather) ? ', погода «' + WEATHER_RU[ctx.weather] + '»' : ', сезон «' + SEASON_RU[ctx.season] + '»'}.`);
  L.push(`<span class="note">Это оценка настроения для оформления, а не психологическая диагностика.</span>`);
  return L;
}

// ===== Художественные приёмы: генеративная живопись поверх фото =====
const RW = 800, RH = 1000;
function makeSampler(img) {
  const w = 200, h = 250, c = mk(w, h), g = c.getContext('2d', { willReadFrequently: true });
  drawCover(g, img, w, h);
  const d = g.getImageData(0, 0, w, h).data, L = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) L[i] = (d[i * 4] * .3 + d[i * 4 + 1] * .59 + d[i * 4 + 2] * .11) / 255;
  const sx = w / RW, sy = h / RH;
  const idx = (x, y) => clamp((y * sy) | 0, 0, h - 1) * w + clamp((x * sx) | 0, 0, w - 1);
  return {
    rgb: (x, y) => { const i = idx(x, y) * 4; return [d[i], d[i + 1], d[i + 2]]; },
    lum: (x, y) => L[idx(x, y)],
    angle: (x, y) => { const e = 6 / sx; const gx = L[idx(x + e, y)] - L[idx(x - e, y)], gy = L[idx(x, y + e)] - L[idx(x, y - e)]; if (Math.hypot(gx, gy) < .02) return Math.sin(x * .006) + Math.cos(y * .008) * 1.3; return Math.atan2(gy, gx) + Math.PI / 2; }
  };
}
function gradedSmall(img, w, h, grade) {
  const c = mk(w, h), g = c.getContext('2d', { willReadFrequently: true }); drawCover(g, img, w, h);
  const id = g.getImageData(0, 0, w, h), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const o = grade(d[i], d[i + 1], d[i + 2]); d[i] = o[0]; d[i + 1] = o[1]; d[i + 2] = o[2]; }
  g.putImageData(id, 0, 0); return c;
}
const _grainCache = {};
function grainTile(seed) {
  if (_grainCache[seed]) return _grainCache[seed];
  const c = mk(128, 128), g = c.getContext('2d'), id = g.createImageData(128, 128), r = mulberry32(seed);
  for (let i = 0; i < id.data.length; i += 4) { const v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
  g.putImageData(id, 0, 0); return (_grainCache[seed] = c);
}
function applyGrain(g, amt, seed) { if (amt <= 0) return; g.save(); g.globalAlpha = amt; g.globalCompositeOperation = 'overlay'; g.fillStyle = g.createPattern(grainTile(seed % 7), 'repeat'); g.fillRect(0, 0, RW, RH); g.restore(); }
function vignette(g, amt) { const gr = g.createRadialGradient(RW / 2, RH * .48, RH * .28, RW / 2, RH / 2, RH * .78); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${amt})`); g.fillStyle = gr; g.fillRect(0, 0, RW, RH); }
function paperTexture(g, amt, r) { g.save(); g.globalAlpha = amt; for (let i = 0; i < 1600; i++) { g.strokeStyle = r() < .5 ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.35)'; g.lineWidth = r() * .8 + .2; const x = r() * RW, y = r() * RH, a = r() * Math.PI; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 7, y + Math.sin(a) * 7); g.stroke(); } g.restore(); }
function canvasWeave(g, amt) { g.save(); g.globalAlpha = amt; g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 1; for (let y = 0; y < RH; y += 4) { g.beginPath(); g.moveTo(0, y); g.lineTo(RW, y); g.stroke(); } g.strokeStyle = 'rgba(0,0,0,.5)'; for (let x = 0; x < RW; x += 4) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, RH); g.stroke(); } g.restore(); }
function blob(g, x, y, R, r, pts = 22) { g.beginPath(); for (let k = 0; k <= pts; k++) { const a = k / pts * Math.PI * 2; const rr = R * (.75 + r() * .45); const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; k ? g.lineTo(px, py) : g.moveTo(px, py); } g.closePath(); }

// Моне: мазки по направлению формы, рассеянный свет
function rImpression(g, img, S, P, r, grade) {
  g.drawImage(gradedSmall(img, 50, 62, grade), 0, 0, RW, RH);
  g.lineCap = 'round';
  const passes = [[1300, 46, 18, .5], [4000, 26, 10, .72], [6200, 14, 5.5, .86]];
  for (const [n0, len0, w0, al] of passes) {
    const n = (n0 * P.density) | 0;
    for (let i = 0; i < n; i++) {
      const x = r() * RW, y = r() * RH; const c = grade(...S.rgb(x, y)); let [h, s, l] = rgb2hsl(...c);
      h += (r() - .5) * 16; l = clamp(l + (r() - .5) * .13); s = clamp(s * (.9 + r() * .35));
      const cc = hsl2rgb(h, s, l), ang = S.angle(x, y) + (r() - .5) * .7, len = len0 * P.strokeScale * (.6 + r() * .8);
      const dx = Math.cos(ang) * len / 2, dy = Math.sin(ang) * len / 2, bend = (r() - .5) * .6;
      g.strokeStyle = css(cc, al); g.lineWidth = w0 * P.strokeScale * (.6 + r() * .7);
      g.beginPath(); g.moveTo(x - dx, y - dy); g.quadraticCurveTo(x - dy * bend, y + dx * bend, x + dx, y + dy); g.stroke();
    }
  }
  const light = hex2rgb('#fff1cf');
  for (let i = 0; i < 1100 * P.density; i++) { const x = r() * RW, y = r() * RH; if (S.lum(x, y) < .6) continue; g.fillStyle = css(mixc(light, grade(...S.rgb(x, y)), .45), .6); g.beginPath(); g.arc(x, y, 1.5 + r() * 3.5 * P.strokeScale, 0, 7); g.fill(); }
  canvasWeave(g, .07);
}
// Матисс / фовизм: открытый цвет, вырезки, конфетти
function rFauve(g, img, S, P, r, grade, pal) {
  const strong = [...pal.slice(0, 5), ...P.photoPal.slice(0, 2).map(hex2rgb).map(c => { const [h, s, l] = rgb2hsl(...c); return hsl2rgb(h, Math.min(1, s * 1.6 + .25), clamp(l, .4, .68)); })];
  const near = q => { let bi = 0, bd = 1e12; strong.forEach((p, j) => { const dd = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2; if (dd < bd) { bd = dd; bi = j; } }); return strong[bi]; };
  const w = 70, h = 88, c = mk(w, h), cg = c.getContext('2d', { willReadFrequently: true }); drawCover(cg, img, w, h);
  const id = cg.getImageData(0, 0, w, h), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const [hh, s, l] = rgb2hsl(d[i], d[i + 1], d[i + 2]); const q = hsl2rgb(hh, Math.min(1, s * 1.8 + .15), clamp(l * 1.05)); const p = near(q); d[i] = p[0] * .72 + q[0] * .28; d[i + 1] = p[1] * .72 + q[1] * .28; d[i + 2] = p[2] * .72 + q[2] * .28; }
  cg.putImageData(id, 0, 0); g.imageSmoothingEnabled = true; g.drawImage(c, 0, 0, RW, RH);
  g.lineCap = 'round';
  for (let i = 0; i < 1000 * P.density; i++) { const x = r() * RW, y = r() * RH, ang = S.angle(x, y), L = 20 + r() * 30; g.strokeStyle = css(near(grade(...S.rgb(x, y))), .55); g.lineWidth = 8 + r() * 14; g.beginPath(); g.moveTo(x - Math.cos(ang) * L, y - Math.sin(ang) * L); g.lineTo(x + Math.cos(ang) * L, y + Math.sin(ang) * L); g.stroke(); }
  const n = Math.round(5 + P.density * 6);
  for (let i = 0; i < n; i++) {
    let x, y; const side = (r() * 4) | 0;
    if (r() < .8) { x = side === 0 ? r() * RW * .22 : side === 1 ? RW - r() * RW * .22 : r() * RW; y = side === 2 ? r() * RH * .2 : side === 3 ? RH - r() * RH * .2 : r() * RH; } else { x = r() * RW; y = r() * RH; }
    const R = 50 + r() * 120, lobes = 3 + ((r() * 5) | 0), ph = r() * 6.28, col = strong[(r() * strong.length) | 0];
    const path = new Path2D(); for (let k = 0; k <= 72; k++) { const a = k / 72 * Math.PI * 2; const rr = R * (.4 + .6 * Math.abs(Math.sin(lobes * a / 2 + ph))) * (.92 + .08 * Math.sin(a * 9)); const px = Math.cos(a) * rr * .7, py = Math.sin(a) * rr; k ? path.lineTo(px, py) : path.moveTo(px, py); } path.closePath();
    g.save(); g.translate(x, y); g.rotate(r() * 6.28); g.fillStyle = 'rgba(0,0,0,.2)'; g.translate(6, 8); g.fill(path); g.translate(-6, -8); g.fillStyle = css(col); g.fill(path); g.restore();
  }
  for (let i = 0; i < 150 * P.density; i++) { g.save(); g.translate(r() * RW, r() * RH); g.rotate(r() * 6.28); g.fillStyle = css(strong[(r() * strong.length) | 0], .92); if (r() < .5) g.fillRect(-7, -3, 14, 6); else { g.beginPath(); g.arc(0, 0, 3 + r() * 4, 0, 7); g.fill(); } g.restore(); }
  paperTexture(g, .3, r);
}
// Кандинский: сетка, диагонали, круги, треугольники
function rKandinsky(g, img, S, P, r, grade, pal, style) {
  const dark = style.mood.v < .05 || style.ctx.timeKey === 'ночь';
  g.fillStyle = dark ? css(pal[0]) : '#ece6d6'; g.fillRect(0, 0, RW, RH);
  const w = 32, h = 40, c = mk(w, h), cg = c.getContext('2d', { willReadFrequently: true }); drawCover(cg, img, w, h);
  const id = cg.getImageData(0, 0, w, h), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const l = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255; const q = Math.min(3, Math.floor(Math.pow(clamp(l * P.contrast), .9) * 4)); const t = pal[q]; d[i] = t[0]; d[i + 1] = t[1]; d[i + 2] = t[2]; }
  cg.putImageData(id, 0, 0); g.save(); g.imageSmoothingEnabled = false; g.globalAlpha = dark ? .78 : .5; g.drawImage(c, 0, 0, RW, RH); g.restore();
  const ink = dark ? [230, 240, 245] : [22, 24, 30];
  g.strokeStyle = css(ink, .13); g.lineWidth = 1;
  for (let i = 1; i < 10; i++) { g.beginPath(); g.moveTo(i * RW / 10, 0); g.lineTo(i * RW / 10, RH); g.stroke(); }
  for (let i = 1; i < 12; i++) { g.beginPath(); g.moveTo(0, i * RH / 12); g.lineTo(RW, i * RH / 12); g.stroke(); }
  const pts = []; for (let i = 0; i < 400; i++) { const x = 60 + r() * (RW - 120), y = 60 + r() * (RH - 120); pts.push({ x, y, l: S.lum(x, y) }); } pts.sort((a, b) => b.l - a.l);
  const accent = hex2rgb(P.accent); const cols = [pal[4], pal[5], pal[2], accent];
  const nc = 2 + Math.round(P.density * 1.5);
  for (let i = 0; i < nc; i++) {
    const p = pts[Math.min(pts.length - 1, i * 9)], R = (45 + r() * 100) * (i === 0 ? 1.6 : 1);
    g.save(); g.globalCompositeOperation = dark ? 'screen' : 'multiply';
    for (let k = 3; k >= 0; k--) { g.beginPath(); g.arc(p.x, p.y, R * (.3 + k * .24), 0, 7); g.fillStyle = css(cols[(k + i) % cols.length], .82); g.fill(); }
    g.restore(); g.strokeStyle = css(ink, .9); g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y, R * 1.12, 0, 7); g.stroke();
  }
  const ang = -Math.PI / 5 + (r() - .5) * .4, nb = 2 + Math.round(P.density * 2);
  for (let b = 0; b < nb; b++) {
    const cx = r() * RW, cy = r() * RH, cnt = 3 + ((r() * 6) | 0), a = ang + (b % 2 ? Math.PI / 2 : 0) + (r() - .5) * .3, dx = Math.cos(a), dy = Math.sin(a);
    for (let k = 0; k < cnt; k++) { const off = (k - cnt / 2) * (6 + r() * 10), L = 300 + r() * 600, ox = -dy * off, oy = dx * off; g.strokeStyle = css(k % 3 === 0 ? pal[4] : ink, .88); g.lineWidth = k % 4 === 0 ? 6 : 1.5 + r() * 2; g.beginPath(); g.moveTo(cx + ox - dx * L / 2, cy + oy - dy * L / 2); g.lineTo(cx + ox + dx * L / 2, cy + oy + dy * L / 2); g.stroke(); }
  }
  for (let i = 0; i < 2 + P.density * 2; i++) { const x = r() * RW, y = r() * RH, s = 40 + r() * 110; g.beginPath(); g.moveTo(x, y - s); g.lineTo(x + s * .9, y + s * .6); g.lineTo(x - s * .9, y + s * .6); g.closePath(); g.fillStyle = css(pal[[5, 4, 1][i % 3]], .82); g.fill(); }
  for (let q = 0; q < 2; q++) { const x0 = r() * RW * .8, y0 = r() * RH * .85, cs = 10 + r() * 8; g.fillStyle = css(ink, .85); for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2 === 0) g.fillRect(x0 + i * cs, y0 + j * cs, cs, cs); }
  g.lineWidth = 2.5; for (let i = 0; i < 3 + P.density * 3; i++) { g.strokeStyle = css(i % 2 ? ink : pal[5], .9); g.beginPath(); const s0 = r() * 6; g.arc(r() * RW, r() * RH, 30 + r() * 160, s0, s0 + 1 + r() * 2); g.stroke(); }
  for (let i = 0; i < 40 * P.density; i++) { g.fillStyle = css(r() < .5 ? ink : pal[5], .9); g.beginPath(); g.arc(r() * RW, r() * RH, 2 + r() * 5, 0, 7); g.fill(); }
}
// Уистлер / Тёрнер: акварельный туман, отражения огней
function rNocturne(g, img, S, P, r, grade, pal) {
  g.drawImage(gradedSmall(img, 22, 28, grade), 0, 0, RW, RH);
  g.save(); g.globalAlpha = .62; g.drawImage(gradedSmall(img, 120, 150, grade), 0, 0, RW, RH); g.restore();
  const ops = ['multiply', 'soft-light', 'screen'];
  for (let i = 0; i < 45; i++) { g.save(); g.globalCompositeOperation = ops[(r() * 3) | 0]; g.fillStyle = css(r() < .6 ? pal[(r() * 6) | 0] : grade(...S.rgb(r() * RW, r() * RH)), .05 + r() * .09); blob(g, r() * RW, r() * RH, 60 + r() * 200, r); g.fill(); g.restore(); }
  for (let i = 0; i < 5; i++) { const y = r() * RH; const gr = g.createLinearGradient(0, y - 90, 0, y + 90); gr.addColorStop(0, 'rgba(220,226,236,0)'); gr.addColorStop(.5, 'rgba(220,226,236,.13)'); gr.addColorStop(1, 'rgba(220,226,236,0)'); g.fillStyle = gr; g.fillRect(0, y - 90, RW, 180); }
  const pts = []; for (let i = 0; i < 500; i++) { const x = r() * RW, y = r() * RH; pts.push({ x, y, l: S.lum(x, y) }); } pts.sort((a, b) => b.l - a.l);
  const warm = pal[5];
  for (let i = 0; i < 26; i++) { const p = pts[i * 3]; const L = 50 + r() * 120, wd = 2 + r() * 3; const gr = g.createLinearGradient(0, p.y, 0, p.y + L); gr.addColorStop(0, css(warm, .45)); gr.addColorStop(1, css(warm, 0)); g.fillStyle = gr; g.fillRect(p.x - wd / 2, p.y, wd, L); const rg = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14); rg.addColorStop(0, css(warm, .5)); rg.addColorStop(1, css(warm, 0)); g.fillStyle = rg; g.fillRect(p.x - 14, p.y - 14, 28, 28); }
  g.lineCap = 'round';
  for (let i = 0; i < 900; i++) { const x = r() * RW, y = r() * RH, L = (40 + r() * 110) * P.strokeScale, a = (r() - .5) * .16; g.strokeStyle = css(grade(...S.rgb(x, y)), .12); g.lineWidth = 1.5 + r() * 4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); }
  paperTexture(g, .3, r);
}
// Плёнка: приподнятые тени, тёплые света, ореолы, засвет, дата-штамп
function rFilm(g, img, S, P, r, grade, pal, style) {
  const w = 400, h = 500, c = mk(w, h), cg = c.getContext('2d', { willReadFrequently: true }); drawCover(cg, img, w, h);
  const id = cg.getImageData(0, 0, w, h), d = id.data;
  const hc = mk(80, 100), hg = hc.getContext('2d'), hid = hg.createImageData(80, 100);
  for (let i = 0; i < d.length; i += 4) {
    let R = d[i] / 255, G = d[i + 1] / 255, B = d[i + 2] / 255;
    let L = .3 * R + .59 * G + .11 * B; const sat = P.sat * .88;
    R = L + (R - L) * sat; G = L + (G - L) * sat; B = L + (B - L) * sat;
    R = R + (R - .5) * (P.contrast - 1) * .4; G = G + (G - .5) * (P.contrast - 1) * .4; B = B + (B - .5) * (P.contrast - 1) * .4;
    R = .07 + R * .88; G = .06 + G * .87; B = .1 + B * .78; L = .3 * R + .59 * G + .11 * B; R += L * L * .07; B -= L * L * .03; G += (1 - L) * .015;
    d[i] = clamp(R) * 255; d[i + 1] = clamp(G) * 255; d[i + 2] = clamp(B) * 255;
    const px = (i / 4) % w, py = ((i / 4) / w) | 0; if (px % 5 === 0 && py % 5 === 0) { const j = ((py / 5) * 80 + px / 5) * 4; const k = Math.max(0, L - .68) * 3; hid.data[j] = 255 * k; hid.data[j + 1] = 110 * k; hid.data[j + 2] = 60 * k; hid.data[j + 3] = 255; }
  }
  cg.putImageData(id, 0, 0); g.drawImage(c, 0, 0, RW, RH);
  hg.putImageData(hid, 0, 0); g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = .6; g.drawImage(hc, 0, 0, RW, RH); g.restore();
  const cx = r() < .5 ? 0 : RW, cy = r() * RH * .6; const lk = g.createRadialGradient(cx, cy, 0, cx, cy, RW * .9); lk.addColorStop(0, 'rgba(255,140,60,.55)'); lk.addColorStop(.4, 'rgba(255,70,40,.16)'); lk.addColorStop(1, 'rgba(255,60,40,0)');
  g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = lk; g.fillRect(0, 0, RW, RH); g.restore();
  const dt = parseDate(style.ctx.date); const stamp = `'${String(dt.getFullYear()).slice(2)}  ${dt.getMonth() + 1}  ${dt.getDate()}`;
  g.save(); g.font = 'bold 30px "Courier New",monospace'; g.textAlign = 'right'; g.fillStyle = '#ffa53a'; g.shadowColor = '#ff5a00'; g.shadowBlur = 10; g.fillText(stamp, RW - 52, RH - 190); g.restore();
}
// Укиё-э / минимализм: пустота, плоские тона, солнце, печать
function rJapan(g, img, S, P, r, grade, pal, style) {
  const night = style.ctx.timeKey === 'ночь';
  const paper = night ? pal[1] : pal[0], ink = night ? pal[0] : pal[5];
  g.fillStyle = css(paper); g.fillRect(0, 0, RW, RH);
  g.save(); g.strokeStyle = css(ink, .08); g.lineWidth = 1.4;
  for (let row = 0, y = 0; y < RH * .38; y += 24, row++) for (let x = -26 + (row % 2) * 26; x < RW + 26; x += 52) for (const k of [24, 16, 8]) { g.beginPath(); g.arc(x, y + 24, k, Math.PI, Math.PI * 2); g.stroke(); }
  g.restore();
  const sx = RW * (.55 + r() * .22), sy = RH * (.2 + r() * .06), sR = 92 + r() * 30;
  g.fillStyle = night ? '#ece4cd' : css(pal[2]); g.beginPath(); g.arc(sx, sy, sR, 0, 7); g.fill();
  const y0 = RH * .4, ph = r() * 6, path = new Path2D(); path.moveTo(0, RH);
  for (let x = 0; x <= RW; x += 10) path.lineTo(x, y0 + Math.sin(x * .011 + ph) * 26 + Math.sin(x * .031 + ph * 2) * 12);
  path.lineTo(RW, RH); path.closePath();
  const pw = 160, phh = Math.round(160 * (RH - y0 + 40) / RW), c = mk(pw, phh), cg = c.getContext('2d', { willReadFrequently: true }); drawCover(cg, img, pw, phh);
  const id = cg.getImageData(0, 0, pw, phh), d = id.data; const tones = [ink, pal[1], pal[3], mixc(paper, pal[4], .35)];
  for (let i = 0; i < d.length; i += 4) { const l = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255; const q = Math.min(3, Math.floor(clamp(l * 1.1) * 4)); const t = tones[q]; d[i] = t[0]; d[i + 1] = t[1]; d[i + 2] = t[2]; }
  cg.putImageData(id, 0, 0);
  g.save(); g.clip(path); g.imageSmoothingEnabled = true; g.drawImage(c, 0, y0 - 40, RW, RH - y0 + 40);
  g.strokeStyle = css(paper, .35); g.lineWidth = 2; for (let i = 0; i < 6; i++) { const y = y0 + 60 + r() * (RH - y0 - 80); g.beginPath(); g.moveTo(r() * RW * .3, y); g.lineTo(RW * .5 + r() * RW * .5, y); g.stroke(); }
  g.restore();
  g.strokeStyle = css(ink); g.lineWidth = 3; g.stroke(path);
  g.fillStyle = css(pal[2]); g.fillRect(RW - 112, 104, 56, 56); g.fillStyle = css(paper); g.font = '600 34px "Cormorant Garamond",serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText((style.title || '·').charAt(0), RW - 84, 133); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  paperTexture(g, .42, r);
}
const RENDERERS = { impression: rImpression, fauve: rFauve, kandinsky: rKandinsky, nocturne: rNocturne, film: rFilm, japan: rJapan };
function stylize(img, style, seed) {
  const c = mk(RW, RH), g = c.getContext('2d'); const P = style.params;
  const grade = makeGrader(P), S = makeSampler(img), r = mulberry32(seed), pal = P.pal.map(hex2rgb);
  RENDERERS[style.mode](g, img, S, P, r, grade, pal, style);
  applyGrain(g, P.grain, seed); vignette(g, P.vignette);
  return c;
}

// ===== Демо-дни: процедурные «фото» и оригинальные мелодии (без чужого контента) =====
const lg = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; };
function glow(g, x, y, R, col, a) { const gr = g.createRadialGradient(x, y, 0, x, y, R); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(x - R, y - R, R * 2, R * 2); }
function bokeh(g, r, n, cols, W, H, rmin, rmax, a, y0 = 0, y1 = 1) { g.save(); g.globalCompositeOperation = 'screen'; for (let i = 0; i < n; i++) glow(g, r() * W, (y0 + r() * (y1 - y0)) * H, rmin + r() * (rmax - rmin), cols[(r() * cols.length) | 0], a * (.5 + r() * .5)); g.restore(); }
function person(g, x, y, h, col, arms = 0) { g.fillStyle = col; g.beginPath(); g.arc(x, y - h * .88, h * .09, 0, 7); g.fill(); g.beginPath(); g.moveTo(x - h * .13, y - h * .76); g.lineTo(x + h * .13, y - h * .76); g.lineTo(x + h * .1, y - h * .38); g.lineTo(x - h * .1, y - h * .38); g.closePath(); g.fill(); g.fillRect(x - h * .09, y - h * .4, h * .07, h * .4); g.fillRect(x + h * .02, y - h * .4, h * .07, h * .4); if (arms) { g.lineWidth = h * .05; g.strokeStyle = col; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - h * .11, y - h * .72); g.lineTo(x - h * .25, y - h * 1.05); g.moveTo(x + h * .11, y - h * .72); g.lineTo(x + h * .27, y - h * 1.02); g.stroke(); } }
function tree(g, r, x, base, h, cols) { g.fillStyle = '#3b2a1e'; g.beginPath(); g.moveTo(x - 10, base); g.lineTo(x - 5, base - h); g.lineTo(x + 5, base - h); g.lineTo(x + 10, base); g.fill(); for (let i = 0; i < 70; i++) { const a = r() * 6.28, d = r() * h * .32; g.fillStyle = cols[(r() * cols.length) | 0]; g.globalAlpha = .75 + r() * .25; g.beginPath(); g.arc(x + Math.cos(a) * d * 1.2, base - h + Math.sin(a) * d * .8, 18 + r() * 34, 0, 7); g.fill(); } g.globalAlpha = 1; }
const SCENES = {
  park(g, W, H, r, v) {
    g.fillStyle = lg(g, 0, 0, 0, H * .6, [[0, '#c9d5df'], [1, '#f3d9a8']]); g.fillRect(0, 0, W, H);
    glow(g, W * .72, H * .22, 380, '255,220,150', .7);
    for (let i = 0; i < 46; i++) { g.fillStyle = ['#c99a3a', '#d9a441', '#b5782c', '#e3b85a'][(r() * 4) | 0]; g.globalAlpha = .55; g.beginPath(); g.arc(r() * W, H * (.38 + r() * .12), 40 + r() * 60, 0, 7); g.fill(); } g.globalAlpha = 1;
    g.fillStyle = lg(g, 0, H * .52, 0, H, [[0, '#b98a4a'], [1, '#6e4a24']]); g.fillRect(0, H * .52, W, H * .48);
    if (v === 2) { g.fillStyle = lg(g, 0, H * .6, 0, H * .85, [[0, '#8fa3b5'], [1, '#5f7488']]); g.beginPath(); g.ellipse(W * .5, H * .72, W * .62, H * .13, 0, 0, 7); g.fill(); for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(230,170,70,.35)'; g.fillRect(r() * W, H * (.62 + r() * .2), 40 + r() * 90, 3 + r() * 5); } }
    if (v === 0) { g.fillStyle = '#d8c39f'; g.beginPath(); g.moveTo(W * .3, H); g.lineTo(W * .47, H * .53); g.lineTo(W * .53, H * .53); g.lineTo(W * .8, H); g.fill(); }
    const cols = ['#e8b23a', '#d98a2b', '#f2c94c', '#c76b26', '#b8502a'];
    for (let i = 0; i < 7; i++) tree(g, r, (i / 6) * W + (r() - .5) * 80, H * (.58 + r() * .08), H * (.32 + r() * .14), cols);
    for (let i = 0; i < 500; i++) { g.fillStyle = cols[(r() * 5) | 0]; g.save(); g.translate(r() * W, H * (.6 + r() * .4)); g.rotate(r() * 6); g.beginPath(); g.ellipse(0, 0, 7, 3.5, 0, 0, 7); g.fill(); g.restore(); }
    if (v === 0) { person(g, W * .48, H * .78, 230, '#2a2230'); person(g, W * .56, H * .785, 250, '#3a2a28'); }
    if (v === 1) {
      g.fillStyle = '#6b4a2e'; for (let i = 0; i < 4; i++) g.fillRect(0, H * (.62 + i * .085), W, H * .07);
      const mug = (x, col) => { g.fillStyle = col; g.fillRect(x - 70, H * .5, 140, 170); g.beginPath(); g.ellipse(x, H * .5 + 170, 70, 18, 0, 0, 7); g.fill(); g.fillStyle = '#5a3524'; g.beginPath(); g.ellipse(x, H * .5, 70, 18, 0, 0, 7); g.fill(); g.strokeStyle = col; g.lineWidth = 16; g.beginPath(); g.arc(x + 82, H * .5 + 80, 32, -1.3, 1.3); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 6; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(x - 30 + k * 30, H * .48); g.bezierCurveTo(x - 60 + k * 30, H * .42, x + k * 30, H * .38, x - 30 + k * 30, H * .3); g.stroke(); } };
      mug(W * .36, '#efe6d8'); mug(W * .66, '#c0473a');
    }
  },
  home(g, W, H, r, v) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#5a3a2a'], [1, '#24160f']]); g.fillRect(0, 0, W, H);
    if (v !== 1) {
      const x0 = W * .14, y0 = H * .1, ww = W * (v === 2 ? .72 : .5), hh = H * .45;
      g.fillStyle = lg(g, 0, y0, 0, y0 + hh, [[0, '#1d2c4d'], [1, '#41608c']]); g.fillRect(x0, y0, ww, hh);
      glow(g, x0 + ww * .7, y0 + hh * .35, 90, '255,210,140', .7);
      g.fillStyle = '#e9eef6'; for (let i = 0; i < 160; i++) { g.globalAlpha = .4 + r() * .6; g.beginPath(); g.arc(x0 + r() * ww, y0 + r() * hh, 1 + r() * 3, 0, 7); g.fill(); } g.globalAlpha = 1;
      g.fillStyle = '#e9eef6'; g.fillRect(x0, y0 + hh - 30, ww, 30);
      g.strokeStyle = '#3a2416'; g.lineWidth = 18; g.strokeRect(x0, y0, ww, hh); g.beginPath(); g.moveTo(x0 + ww / 2, y0); g.lineTo(x0 + ww / 2, y0 + hh); g.moveTo(x0, y0 + hh * .45); g.lineTo(x0 + ww, y0 + hh * .45); g.stroke();
      if (v === 2) { for (let i = 0; i < 24; i++) glow(g, x0 + (i / 23) * ww, y0 + 20 + Math.sin(i * .9) * 20, 26, ['255,190,90', '255,120,90', '140,220,160'][i % 3], .9); }
      glow(g, W * .85, H * .32, 260, '255,170,80', .5);
    }
    g.fillStyle = lg(g, 0, H * .62, 0, H, [[0, '#8a5634'], [1, '#4a2a18']]); g.fillRect(0, H * .62, W, H * .38);
    if (v === 1) { glow(g, W * .5, H * .3, 500, '255,170,90', .35); }
    const ax = v === 1 ? W * .18 : W * .45, ay = v === 1 ? H * .5 : H * .7, aw = v === 1 ? W * .64 : W * .4, ah = v === 1 ? H * .32 : H * .18;
    g.fillStyle = '#f1e6cf'; g.fillRect(ax, ay, aw, ah); g.fillStyle = '#d9cbb0'; g.fillRect(ax + aw / 2 - 3, ay, 6, ah);
    const sep = ['#b88a5a', '#8c6a4a', '#c9a27a', '#a07a58'];
    for (let i = 0; i < 4; i++) { const px = ax + (i % 2 ? aw * .55 : aw * .07), py = ay + (i < 2 ? ah * .08 : ah * .54), pw = aw * .38, phh = ah * .38; g.fillStyle = '#fff8ea'; g.fillRect(px - 4, py - 4, pw + 8, phh + 8); g.fillStyle = sep[i]; g.fillRect(px, py, pw, phh); g.fillStyle = 'rgba(60,40,30,.7)'; g.beginPath(); g.arc(px + pw * .4, py + phh * .45, phh * .18, 0, 7); g.fill(); g.fillRect(px + pw * .3, py + phh * .6, pw * .2, phh * .4); }
    const cx = v === 1 ? W * .86 : W * .25, cy = v === 1 ? H * .62 : H * .74;
    g.fillStyle = '#f4efe6'; g.beginPath(); g.ellipse(cx, cy + 70, 80, 18, 0, 0, 7); g.fill(); g.fillRect(cx - 50, cy, 100, 70); g.fillStyle = '#9a4a20'; g.beginPath(); g.ellipse(cx, cy, 50, 12, 0, 0, 7); g.fill();
    for (let i = 0; i < 4; i++) { g.fillStyle = '#f08a24'; g.beginPath(); g.arc(W * (.6 + i * .08), H * (.88 + (i % 2) * .03), 34, 0, 7); g.fill(); }
  },
  office(g, W, H, r, v) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#0b1222'], [1, '#05070d']]); g.fillRect(0, 0, W, H);
    if (v !== 1) {
      const top = v === 2 ? 0 : H * .05, bottom = v === 2 ? H : H * .55;
      if (v === 2) { g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#0e1a3a'], [.7, '#24365e'], [1, '#3b4a6e']]); g.fillRect(0, 0, W, H); }
      for (let i = 0; i < 14; i++) { const bx = r() * W, bw = 50 + r() * 110, bh = (bottom - top) * (.3 + r() * .7); g.fillStyle = '#0d1630'; g.fillRect(bx, bottom - bh, bw, bh); for (let y = bottom - bh + 10; y < bottom - 8; y += 14) for (let x = bx + 6; x < bx + bw - 6; x += 12) if (r() < .35) { g.fillStyle = r() < .7 ? 'rgba(255,214,140,.85)' : 'rgba(150,220,255,.8)'; g.fillRect(x, y, 6, 8); } if (r() < .5) glow(g, bx + bw / 2, bottom - bh - 6, 14, '255,60,60', .9); }
    }
    if (v === 0) {
      g.fillStyle = '#121a2c'; g.fillRect(0, H * .55, W, H * .45);
      const mon = (x, y, w, h) => { glow(g, x + w / 2, y + h / 2, w, '90,170,255', .25); g.fillStyle = '#0a0f1a'; g.fillRect(x - 8, y - 8, w + 16, h + 16); g.fillStyle = lg(g, x, y, x, y + h, [[0, '#1b2c48'], [1, '#0f1a2e']]); g.fillRect(x, y, w, h); for (let k = 0; k < 18; k++) { g.fillStyle = ['#7fd1ff', '#f4d35e', '#ee6c4d', '#c9e4ff'][(r() * 4) | 0]; g.fillRect(x + 14 + (r() * 3 | 0) * 16, y + 14 + k * (h - 28) / 18, 40 + r() * (w * .6), 5); } };
      mon(W * .1, H * .58, W * .38, H * .2); mon(W * .53, H * .56, W * .38, H * .22);
      g.fillStyle = '#05070d'; g.beginPath(); g.arc(W * .5, H * .95, 120, Math.PI, 0); g.fill(); g.beginPath(); g.arc(W * .5, H * .78, 70, 0, 7); g.fill();
    }
    if (v === 1) {
      glow(g, W * .5, H * .4, 520, '80,150,255', .3);
      g.fillStyle = '#1a2236'; g.beginPath(); g.moveTo(W * .1, H * .9); g.lineTo(W * .9, H * .9); g.lineTo(W * .82, H * .72); g.lineTo(W * .18, H * .72); g.fill();
      g.fillStyle = '#0d1424'; g.fillRect(W * .16, H * .2, W * .68, H * .5); g.fillStyle = '#132038'; g.fillRect(W * .19, H * .23, W * .62, H * .44);
      for (let k = 0; k < 22; k++) { g.fillStyle = ['#7fd1ff', '#f4d35e', '#ee6c4d', '#98c1d9', '#e0fbfc'][(r() * 5) | 0]; g.fillRect(W * .22 + (r() * 4 | 0) * 20, H * .25 + k * 17, 40 + r() * 260, 6); }
      g.fillStyle = '#2a3550'; for (let y = 0; y < 4; y++) for (let x = 0; x < 13; x++) g.fillRect(W * .2 + x * 42 + y * 6, H * .75 + y * 28, 34, 20);
      g.fillStyle = '#e8e2d8'; g.fillRect(W * .86, H * .7, 70, 90); g.fillStyle = '#3b2416'; g.beginPath(); g.ellipse(W * .86 + 35, H * .7, 35, 9, 0, 0, 7); g.fill();
    }
  },
  party(g, W, H, r, v) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#3a1430'], [1, '#12060f']]); g.fillRect(0, 0, W, H);
    bokeh(g, r, 70, ['255,90,120', '255,190,60', '80,220,200', '90,140,255', '255,130,220'], W, H, 20, 70, .8, 0, .7);
    if (v !== 1) {
      for (let i = 0; i < 9; i++) { const x = r() * W, y = H * (.12 + r() * .3), col = ['#ff4f5e', '#ffb000', '#2ec4b6', '#3a86ff', '#ff7bd5'][i % 5]; g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y + 60); g.quadraticCurveTo(x + 20, y + 160, x - 10, y + 260); g.stroke(); g.fillStyle = col; g.beginPath(); g.ellipse(x, y, 44, 56, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.ellipse(x - 14, y - 20, 9, 15, -.4, 0, 7); g.fill(); }
      const n = v === 2 ? 9 : 6; for (let i = 0; i < n; i++) person(g, W * (.08 + i * (.84 / (n - 1))) + (r() - .5) * 30, H * (1.02 + r() * .04), 380 + r() * 120, '#0a0408', r() < .7 ? 1 : 0);
      if (v === 2) { g.save(); g.globalCompositeOperation = 'screen'; for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(${['255,80,140', '80,200,255', '255,200,80'][i % 3]},.18)`; g.beginPath(); g.moveTo(W * (.2 + i * .15), 0); g.lineTo(W * (.05 + i * .2), H); g.lineTo(W * (.15 + i * .2), H); g.fill(); } g.restore(); }
    } else {
      g.fillStyle = '#f2f2f2'; g.beginPath(); g.ellipse(W * .5, H * .78, 300, 60, 0, 0, 7); g.fill();
      g.fillStyle = '#f7c6d4'; g.fillRect(W * .5 - 220, H * .52, 440, 230); g.fillStyle = '#fff3e8'; g.fillRect(W * .5 - 220, H * .6, 440, 22); g.fillRect(W * .5 - 220, H * .7, 440, 22);
      g.beginPath(); g.ellipse(W * .5, H * .52, 220, 50, 0, 0, 7); g.fillStyle = '#fbe0e8'; g.fill();
      for (let i = 0; i < 7; i++) { const x = W * .5 - 150 + i * 50; g.fillStyle = ['#3a86ff', '#ff4f5e', '#ffb000'][i % 3]; g.fillRect(x - 6, H * .52 - 80, 12, 70); glow(g, x, H * .52 - 98, 40, '255,200,90', .95); g.fillStyle = '#fff4c0'; g.beginPath(); g.ellipse(x, H * .52 - 96, 6, 12, 0, 0, 7); g.fill(); }
    }
    for (let i = 0; i < 160; i++) { g.save(); g.translate(r() * W, r() * H); g.rotate(r() * 6); g.fillStyle = ['#ff4f5e', '#ffb000', '#2ec4b6', '#fff', '#ff7bd5'][(r() * 5) | 0]; g.fillRect(-5, -2, 10, 5); g.restore(); }
  },
  lake(g, W, H, r, v) {
    const hz = H * .52;
    g.fillStyle = lg(g, 0, 0, 0, hz, [[0, '#8fa1c4'], [.55, '#e9b9a8'], [1, '#f7dcb3']]); g.fillRect(0, 0, W, hz);
    glow(g, W * .62, hz - 30, 300, '255,220,170', .9); g.fillStyle = '#fff1d6'; g.beginPath(); g.arc(W * .62, hz - 30, 40, 0, 7); g.fill();
    for (let l = 0; l < 3; l++) { g.fillStyle = ['#a7a6bf', '#8e8aa8', '#6f6a8c'][l]; g.beginPath(); g.moveTo(0, hz); for (let x = 0; x <= W; x += 20) g.lineTo(x, hz - 40 - l * 15 - Math.abs(Math.sin(x * .004 + l * 2)) * (120 - l * 30) * (.6 + r() * .02)); g.lineTo(W, hz); g.fill(); }
    g.fillStyle = lg(g, 0, hz, 0, H, [[0, '#e8c3ae'], [.4, '#9fa6c0'], [1, '#4f5978']]); g.fillRect(0, hz, W, H - hz);
    for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(255,236,200,.35)'; g.fillRect(W * .62 - 100 + r() * 200, hz + r() * (H - hz) * .6, 20 + r() * 80, 2 + r() * 3); }
    const mist = v === 1 ? 9 : 5; for (let i = 0; i < mist; i++) { const y = hz - 60 + r() * 220; g.fillStyle = lg(g, 0, y - 40, 0, y + 40, [[0, 'rgba(255,245,235,0)'], [.5, 'rgba(255,245,235,.45)'], [1, 'rgba(255,245,235,0)']]); g.fillRect(0, y - 40, W, 80); }
    g.strokeStyle = '#2b2a35'; g.lineCap = 'round';
    const nr = v === 1 ? 90 : 40; for (let i = 0; i < nr; i++) { const x = (v === 1 ? r() * W : (r() < .5 ? r() * W * .25 : W - r() * W * .25)), h = 120 + r() * (v === 1 ? 380 : 220); g.lineWidth = 2 + r() * 3; g.beginPath(); g.moveTo(x, H); g.quadraticCurveTo(x + (r() - .5) * 60, H - h * .6, x + (r() - .5) * 90, H - h); g.stroke(); if (r() < .3) { g.fillStyle = '#3a2a22'; g.beginPath(); g.ellipse(x + (r() - .5) * 20, H - h * .8, 6, 22, 0, 0, 7); g.fill(); } }
    if (v === 2) { g.fillStyle = '#5a4030'; g.fillRect(0, H * .82, W, H * .18); for (let i = 0; i < 8; i++) { g.fillStyle = '#4a3326'; g.fillRect(i * W / 8, H * .82, 4, H * .18); } g.fillStyle = '#4c6b5a'; g.fillRect(W * .6, H * .68, 70, 160); g.fillStyle = '#e8e2d6'; g.fillRect(W * .72, H * .76, 80, 90); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 5; g.beginPath(); g.moveTo(W * .76, H * .74); g.bezierCurveTo(W * .74, H * .7, W * .79, H * .67, W * .76, H * .62); g.stroke(); }
    for (let i = 0; i < 6; i++) { g.strokeStyle = '#3a3440'; g.lineWidth = 2; const bx = r() * W, by = r() * hz * .7; g.beginPath(); g.moveTo(bx - 10, by); g.quadraticCurveTo(bx - 5, by - 6, bx, by); g.quadraticCurveTo(bx + 5, by - 6, bx + 10, by); g.stroke(); }
  },
  rain(g, W, H, r, v) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#5d6878'], [1, '#2c333e']]); g.fillRect(0, 0, W, H);
    if (v === 1) {
      for (let i = 0; i < 10; i++) { const bx = r() * W, bw = 80 + r() * 120, bh = H * (.3 + r() * .4); g.fillStyle = '#3e4652'; g.fillRect(bx, H * .55 - bh, bw, bh); }
      g.fillStyle = '#2b313b'; g.fillRect(0, H * .55, W, H * .45);
      bokeh(g, r, 30, ['255,210,140', '255,90,80', '230,240,255'], W, H, 10, 40, .8, .4, .6);
      for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(255,210,140,.25)'; g.fillRect(r() * W, H * (.58 + r() * .4), 3 + r() * 4, 30 + r() * 80); }
      for (let i = 0; i < 6; i++) { const x = W * (.1 + i * .16), y = H * (.7 + r() * .1), col = ['#1f2530', '#6a2a35', '#2a3a55', '#1a1f28'][i % 4]; person(g, x, y + 160, 230, '#14181f'); g.fillStyle = col; g.beginPath(); g.ellipse(x, y - 60, 90, 50, 0, Math.PI, 0); g.fill(); g.strokeStyle = '#111'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y - 60); g.lineTo(x, y + 20); g.stroke(); }
    } else {
      bokeh(g, r, 60, ['255,200,120', '255,80,70', '220,230,255', '255,240,200'], W, H, 20, 80, .55, .3, 1);
      if (v === 2) { g.fillStyle = '#d8d4cc'; g.fillRect(0, H * .8, W, H * .2); g.fillStyle = '#efe9df'; g.fillRect(W * .2, H * .65, 110, 130); g.fillStyle = '#4a3020'; g.beginPath(); g.ellipse(W * .2 + 55, H * .65, 55, 12, 0, 0, 7); g.fill(); g.fillStyle = '#b05a3a'; g.fillRect(W * .62, H * .68, 100, 110); g.fillStyle = '#4f7a4a'; for (let i = 0; i < 12; i++) { g.beginPath(); g.ellipse(W * .62 + 50 + (r() - .5) * 90, H * .62 - r() * 120, 16, 40, (r() - .5) * 1.5, 0, 7); g.fill(); } }
      g.strokeStyle = 'rgba(40,48,60,.85)'; g.lineWidth = 24; g.strokeRect(0, 0, W, H); g.beginPath(); g.moveTo(W * .5, 0); g.lineTo(W * .5, v === 2 ? H * .8 : H); g.stroke();
    }
    for (let i = 0; i < (v === 1 ? 260 : 420); i++) { const x = r() * W, y = r() * H, R = v === 1 ? .8 : 2 + r() * 7; if (v === 1) { g.strokeStyle = 'rgba(220,230,240,.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 6, y + 40); g.stroke(); continue; } const gr = g.createRadialGradient(x - R * .3, y - R * .3, 0, x, y, R); gr.addColorStop(0, 'rgba(255,255,255,.75)'); gr.addColorStop(.5, 'rgba(160,175,195,.35)'); gr.addColorStop(1, 'rgba(40,50,60,.25)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, R, 0, 7); g.fill(); if (r() < .12) { g.strokeStyle = 'rgba(200,210,225,.25)'; g.lineWidth = R * .6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - .5) * 8, y + 40 + r() * 120); g.stroke(); } }
  }
};
function scene(kind, v, seed) { const W = 900, H = 1125, c = mk(W, H), g = c.getContext('2d'); SCENES[kind](g, W, H, mulberry32(seed), v); return c; }

// Оригинальные мелодии, синтезированные в браузере (OfflineAudioContext)
async function synthSong(sp, dur = 20) {
  const sr = 22050, OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new OAC(1, sr * dur, sr), r = mulberry32(sp.root * 31 + sp.bpm);
  const comp = ctx.createDynamicsCompressor(); comp.connect(ctx.destination);
  const master = ctx.createGain(); master.gain.value = .55; master.connect(comp);
  const conv = ctx.createConvolver(); const IL = Math.floor(sr * 2.4), ib = ctx.createBuffer(1, IL, sr), idd = ib.getChannelData(0); for (let i = 0; i < IL; i++) idd[i] = (r() * 2 - 1) * Math.pow(1 - i / IL, 3); conv.buffer = ib;
  const wet = ctx.createGain(); wet.gain.value = sp.style === 'electro' ? .12 : sp.style === 'ambient' ? .6 : .3; conv.connect(wet); wet.connect(master);
  const bus = ctx.createGain();
  if (sp.lofi) { const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; bus.connect(lp); lp.connect(master); lp.connect(conv); } else { bus.connect(master); bus.connect(conv); }
  const nb = ctx.createBuffer(1, sr, sr), nd = nb.getChannelData(0); for (let i = 0; i < sr; i++) nd[i] = r() * 2 - 1;
  const spb = 60 / sp.bpm, scale = sp.mode === 'major' ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
  const prog = sp.prog || (sp.mode === 'major' ? [0, 4, 5, 3] : [0, 5, 2, 6]);
  const bpb = (sp.style === 'waltz' || sp.style === 'dombra') ? 3 : 4, bar = spb * bpb * (sp.style === 'ambient' ? 2 : 1);
  const mid = (d, o = 0) => { const oc = Math.floor(d / 7); return sp.root + scale[((d % 7) + 7) % 7] + 12 * (oc + o); };
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const note = (m, t, len, { type = 'triangle', vol = .1, cut = 3000, att = .005, dec = 0 } = {}) => {
    if (t >= dur) return; const o = ctx.createOscillator(); o.type = type; o.frequency.value = hz(m);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cut; const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + att);
    if (dec) g.gain.setTargetAtTime(0, t + att, dec); else { g.gain.setValueAtTime(vol, t + Math.max(att, len * .7)); g.gain.linearRampToValueAtTime(0, t + len); }
    o.connect(f); f.connect(g); g.connect(bus); o.start(t); o.stop(Math.min(dur, t + len + (dec ? dec * 5 : .05)));
  };
  const kick = t => { if (t >= dur) return; const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + .12); g.gain.setValueAtTime(.9, t); g.gain.exponentialRampToValueAtTime(.001, t + .3); o.connect(g); g.connect(master); o.start(t); o.stop(t + .32); };
  const hit = (t, hp, vol, len) => { if (t >= dur) return; const s = ctx.createBufferSource(); s.buffer = nb; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + len); s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + len + .02); };
  const pat = sp.pat || [0, 1, 2, 3, 2, 1, 0, 1], up = sp.up || [0, 2, 4, 7], mr = mulberry32((sp.seed || 1) * 977 + sp.root);
  // собственный мотив трека: 8 нот, повторяется с вариациями
  const motif = Array.from({ length: 8 }, () => [0, 1, 2, 4, 5, 7, 2, 4][(mr() * 8) | 0] + ((mr() * 3) | 0) - 1), rhythm = Array.from({ length: 8 }, () => mr() < .7 ? 1 : mr() < .5 ? 2 : 0);
  for (let t = 0, ci = 0; t < dur; t += bar, ci++) {
    const d = prog[ci % 4], ch = [d, d + 2, d + 4];
    note(mid(d, -1), t, bar * .95, { type: 'triangle', vol: .16, cut: 500, att: .02 });
    if (sp.style === 'piano') { ch.forEach(x => note(mid(x), t, bar, { type: 'sine', vol: .035, cut: 1500, att: .3 })); for (let k = 0; k < 8; k++) note(mid(d + up[pat[k]], 1), t + k * spb / 2, spb * 2, { type: 'triangle', vol: .085, cut: 2600, dec: .35 }); if (ci % 2) note(mid(d + 4 + ((r() * 3) | 0), 1), t + spb * 2, spb * 2, { type: 'sine', vol: .07, dec: .6 }); }
    else if (sp.style === 'waltz') { note(mid(d, 0), t, spb, { type: 'triangle', vol: .1, dec: .3 }); for (let k = 1; k < 3; k++) ch.forEach(x => note(mid(x, 1), t + k * spb, spb * .8, { type: 'triangle', vol: .045, dec: .25 })); note(mid(d + 2 + ((r() * 4) | 0), 2), t, spb * 2, { type: 'sine', vol: .06, att: .03, dec: .6 }); note(mid(d + ((r() * 5) | 0), 2), t + spb * 2, spb, { type: 'sine', vol: .05, att: .02, dec: .4 }); }
    else if (sp.style === 'electro') { ch.forEach(x => note(mid(x), t, bar, { type: 'sawtooth', vol: .025, cut: 900, att: .05 })); for (let k = 0; k < 16; k++) note(mid(d + up[k % 4] + (k % 8 > 5 ? 7 : 0), 1), t + k * spb / 4, spb / 4, { type: 'square', vol: .04, cut: 1700 + 700 * Math.sin(t + k), dec: .06 }); for (let b = 0; b < 4; b++) { kick(t + b * spb); hit(t + b * spb + spb / 2, 7000, .25, .05); if (b % 2) hit(t + b * spb, 1800, .35, .15); } }
    else if (sp.style === 'pop') { ch.forEach(x => { for (let b = 0; b < 4; b++) note(mid(x), t + b * spb + spb / 2, spb * .4, { type: 'square', vol: .03, cut: 2200, dec: .12 }); }); for (let k = 0; k < 4; k++) note(mid(d + [4, 2, 0, 2, 4, 5, 4, 2][(ci * 4 + k) % 8], 1), t + k * spb, spb * .9, { type: 'triangle', vol: .08, cut: 3500, att: .01 }); for (let b = 0; b < 4; b++) { if (b % 2 === 0) kick(t + b * spb); if (b % 2) hit(t + b * spb, 1500, .4, .18); hit(t + b * spb + spb / 2, 8000, .18, .04); } }
    else if (sp.style === 'box') { ch.forEach(x => note(mid(x), t, bar, { type: 'sine', vol: .03, cut: 1400, att: .25 })); for (let k = 0; k < 8; k++) { const deg = d + [0, 2, 4, 7, 4, 2, 4, 9][(k + ci) % 8]; note(mid(deg, 2), t + k * spb / 2, spb, { type: 'sine', vol: .075, dec: .55 }); note(mid(deg, 3), t + k * spb / 2, spb, { type: 'triangle', vol: .014, dec: .25 }); } }
    else if (sp.style === 'dombra') { const pent = [0, 1, 2, 4, 5]; for (let k = 0; k < 6; k++) { const tt = t + k * spb / 2; note(mid(d, 0), tt, spb * .5, { type: 'sawtooth', vol: k % 3 === 0 ? .07 : .04, cut: 1700, dec: .11 }); note(mid(d + 4, 0), tt + .022, spb * .5, { type: 'sawtooth', vol: .035, cut: 1500, dec: .09 }); } for (let k = 0; k < 3; k++) if (r() < .85) note(mid(d + pent[(r() * 5) | 0] + 7, 0), t + k * spb + (r() < .3 ? spb / 2 : 0), spb, { type: 'triangle', vol: .085, cut: 2600, dec: .32 }); hit(t, 180, .25, .2); }
    else if (sp.style === 'guitar') { for (let s2 = 0; s2 < (bpb === 3 ? 6 : 8); s2++) { const st2 = t + s2 * spb / 2, x = [d, d + 4, d + 7, d + 9, d + 11, d + 9, d + 7, d + 4][s2]; note(mid(x, s2 > 3 ? 1 : 0), st2, spb * 1.5, { type: 'triangle', vol: .075, cut: 2200, att: .003, dec: .38 }); note(mid(x, s2 > 3 ? 1 : 0) + .08, st2 + .004, spb, { type: 'sawtooth', vol: .012, cut: 1400, dec: .2 }); } }
    else if (sp.style === 'strings') { ch.forEach((x, k) => { note(mid(x, k === 0 ? 0 : 1), t, bar * 1.1, { type: 'sawtooth', vol: .028, cut: 900 + 300 * Math.sin(ci), att: bar * .35 }); note(mid(x, k === 0 ? 0 : 1) + .1, t, bar * 1.1, { type: 'sawtooth', vol: .02, cut: 800, att: bar * .4 }); }); if (ci % 2) hit(t, 60, .12, 1.2); }
    else if (sp.style === 'ambient') { ch.forEach(x => note(mid(x), t, bar * 1.2, { type: 'sine', vol: .05, cut: 1200, att: 1.2 })); for (let k = 0; k < 5; k++) if (r() < .75) note(mid(ch[(r() * 3) | 0] + (r() < .5 ? 7 : 0), 1), t + k * bar / 5 + r() * .3, 3, { type: 'sine', vol: .07, att: .01, dec: 1.1 }); }
  }
  if (sp.lead !== false && ['piano', 'waltz', 'pop', 'box', 'guitar', 'strings', 'dombra'].includes(sp.style)) {
    const step = spb * (sp.style === 'strings' ? 1 : .5), oc = sp.style === 'box' ? 2 : 1, tp = sp.leadType || (sp.style === 'strings' ? 'sine' : 'triangle');
    for (let t = bar * 2, k = 0, ph = 0; t < dur - step; t += step, k++) { const i = k % 8; if (k % 32 === 0) ph++; if (!rhythm[i] || (ph % 2 === 0 && k % 16 >= 12)) continue; const dg = prog[Math.floor(t / bar) % 4] + motif[i] + (ph % 2 ? 2 : 0) * (i > 4 ? 1 : 0);
      note(mid(dg, oc), t, step * rhythm[i] * 1.6, { type: tp, vol: sp.style === 'strings' ? .06 : .07, cut: 3200, att: sp.style === 'strings' ? .08 : .008, dec: sp.style === 'strings' ? .5 : .28 }); }
  }
  const buf = await ctx.startRendering();
  const d = buf.getChannelData(0); let pk = 0; for (let i = 0; i < d.length; i++) pk = Math.max(pk, Math.abs(d[i])); const k = pk > 0 ? .95 / pk : 1; for (let i = 0; i < d.length; i++) d[i] *= k;
  return buf;
}
function encodeWAV(buf) {
  const d = buf.getChannelData(0), n = d.length, sr = buf.sampleRate, ab = new ArrayBuffer(44 + n * 2), v = new DataView(ab);
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); ws(8, 'WAVE'); ws(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); ws(36, 'data'); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, clamp(d[i], -1, 1) * 32767, true);
  return new Blob([ab], { type: 'audio/wav' });
}

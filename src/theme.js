
// ===================== Фон «космос»: слива, золото, созвездия, астролябия =====================
// Слои рисуются один раз (с размытием, приглушённо), затем каждый кадр поворачиваются вслед за аватаром.
const Cosmos = {
  angle: 0, target: 0, drift: true,
  init() {
    this.c = $('#cosmos'); this.g = this.c.getContext('2d');
    this.resize(); addEventListener('resize', () => this.resize());
    const loop = now => { requestAnimationFrame(loop); this.draw(now); }; requestAnimationFrame(loop);
  },
  resize() {
    const d = Math.min(1.5, devicePixelRatio || 1), W = innerWidth, H = innerHeight; this.d = d; this.W = W; this.H = H;
    this.c.width = W * d; this.c.height = H * d;
    const S = Math.ceil(Math.hypot(W, H) * 1.05); this.S = S;
    this.base = this.mkBase(W, H); this.ring = this.mkRing(S); this.stars = this.mkStars(S); this.orn = this.mkOrnaments(W, H);
  },
  mkBase(W, H) {
    const c = mk(W, H), g = c.getContext('2d');
    const bg = g.createRadialGradient(W * .55, H * .45, 0, W * .5, H * .5, Math.max(W, H) * .8);
    bg.addColorStop(0, '#5a2550'); bg.addColorStop(.45, '#3a1638'); bg.addColorStop(1, '#170818'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const r = mulberry32(17); g.filter = 'blur(40px)';
    for (let i = 0; i < 9; i++) { const x = r() * W, y = r() * H, R = (.15 + r() * .3) * Math.max(W, H); const gr = g.createRadialGradient(x, y, 0, x, y, R); const c2 = r() < .5 ? '140,40,95' : '95,30,90'; gr.addColorStop(0, `rgba(${c2},.45)`); gr.addColorStop(1, `rgba(${c2},0)`); g.fillStyle = gr; g.fillRect(x - R, y - R, R * 2, R * 2); }
    g.filter = 'none'; return c;
  },
  mkRing(S) {
    const c = mk(S, S), g = c.getContext('2d'), cx = S / 2, cy = S / 2, R = S * .36;
    g.filter = 'blur(1.1px)'; g.strokeStyle = 'rgba(236,199,127,.22)'; g.lineWidth = 1.2;
    for (const k of [1, .92, .78, .62, .5, 1.18]) { g.beginPath(); g.arc(cx, cy, R * k, 0, 7); g.stroke(); }
    for (let i = 0; i < 120; i++) { const a = i / 120 * Math.PI * 2, l = i % 10 === 0 ? 16 : i % 5 === 0 ? 9 : 4; g.beginPath(); g.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.lineTo(cx + Math.cos(a) * (R - l), cy + Math.sin(a) * (R - l)); g.stroke(); }
    g.strokeStyle = 'rgba(236,199,127,.13)'; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * R * .5, cy + Math.sin(a) * R * .5); g.lineTo(cx + Math.cos(a) * R * .92, cy + Math.sin(a) * R * .92); g.stroke(); }
    g.beginPath(); g.ellipse(cx, cy, R * 1.05, R * .42, .5, 0, 7); g.stroke(); g.beginPath(); g.ellipse(cx, cy, R * 1.05, R * .42, -.7, 0, 7); g.stroke();
    // созвездия
    const r = mulberry32(31); g.strokeStyle = 'rgba(240,205,140,.32)'; g.fillStyle = 'rgba(255,236,190,.85)';
    for (let k = 0; k < 14; k++) { const a0 = r() * 7, d0 = (.25 + r() * .95) * S * .5; let x = cx + Math.cos(a0) * d0, y = cy + Math.sin(a0) * d0; const n = 3 + (r() * 4 | 0); g.beginPath(); g.moveTo(x, y); const pts = [[x, y]]; for (let i = 0; i < n; i++) { x += (r() - .5) * 140; y += (r() - .5) * 140; g.lineTo(x, y); pts.push([x, y]); } g.stroke(); pts.forEach(([px, py]) => { g.beginPath(); g.arc(px, py, 1.6 + r() * 1.6, 0, 7); g.fill(); }); }
    g.filter = 'none'; return c;
  },
  mkStars(S) {
    const c = mk(S, S), g = c.getContext('2d'), r = mulberry32(5);
    for (let i = 0; i < 700; i++) { const x = r() * S, y = r() * S, s = r() < .9 ? .6 + r() * .9 : 1.5 + r() * 1.4; g.fillStyle = r() < .6 ? `rgba(255,232,190,${.3 + r() * .5})` : `rgba(255,255,255,${.25 + r() * .5})`; g.beginPath(); g.arc(x, y, s, 0, 7); g.fill(); }
    g.filter = 'blur(6px)'; for (let i = 0; i < 40; i++) { const x = r() * S, y = r() * S; g.fillStyle = 'rgba(255,215,150,.18)'; g.beginPath(); g.arc(x, y, 4 + r() * 10, 0, 7); g.fill(); } g.filter = 'none';
    return c;
  },
  mkOrnaments(W, H) {
    const c = mk(W, H), g = c.getContext('2d'), m = Math.min(W, H);
    g.filter = 'blur(1.4px)'; g.strokeStyle = 'rgba(236,199,127,.26)'; g.lineWidth = 1.5; g.lineCap = 'round';
    // полумесяц и солнце внизу слева
    const mx = m * .12, my = H - m * .2, mr = m * .1; g.beginPath(); g.arc(mx, my, mr, Math.PI * .35, Math.PI * 1.65); g.arc(mx + mr * .45, my, mr * .82, Math.PI * 1.55, Math.PI * .45, true); g.stroke();
    const sx = m * .3, sy = H - m * .06, sr = m * .05; g.beginPath(); g.arc(sx, sy, sr, 0, 7); g.stroke(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; g.beginPath(); g.moveTo(sx + Math.cos(a) * sr * 1.3, sy + Math.sin(a) * sr * 1.3); g.lineTo(sx + Math.cos(a) * sr * (i % 2 ? 1.7 : 2.1), sy + Math.sin(a) * sr * (i % 2 ? 1.7 : 2.1)); g.stroke(); }
    // завитки-филигрань по углам
    const curl = (x, y, s, rot) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.beginPath(); for (let t = 0; t < 9; t += .05) { const r = 4 + t * 7, a = t; const px = Math.cos(a) * r, py = Math.sin(a) * r; t ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); g.beginPath(); g.moveTo(60, 0); g.bezierCurveTo(90, -40, 140, -20, 170, -60); g.stroke(); g.beginPath(); g.moveTo(20, 60); g.bezierCurveTo(-10, 110, 30, 150, -10, 190); g.stroke(); g.restore(); };
    const s = m / 900; curl(m * .05, m * .07, s * 1.1, .4); curl(W - m * .05, m * .07, s * 1.1, Math.PI - .4); curl(W - m * .04, H - m * .08, s, Math.PI + .5);
    g.filter = 'none'; return c;
  },
  draw(now) {
    const g = this.g, W = this.W, H = this.H, S = this.S, t = now / 1000;
    if (this.drift) this.target += .0006;
    this.angle += (this.target - this.angle) * .06;
    g.setTransform(this.d, 0, 0, this.d, 0, 0);
    const px = Math.sin(this.angle) * 30;
    g.drawImage(this.base, px * .3 - 15, 0, W + 30, H);
    g.save(); g.translate(W / 2, H / 2); g.rotate(this.angle * .12); g.globalAlpha = .9; g.drawImage(this.stars, -S / 2 + px * .5, -S / 2, S, S); g.restore();
    g.save(); g.translate(W * .5 + px, H * .5); g.rotate(this.angle * .45); g.globalAlpha = .85; g.drawImage(this.ring, -S / 2, -S / 2, S, S); g.restore();
    g.globalAlpha = .9; g.drawImage(this.orn, 0, 0, W, H); g.globalAlpha = 1;
    const tw = (Math.sin(t * 1.7) + 1) / 2; g.fillStyle = `rgba(255,230,180,${.03 + tw * .03})`; g.fillRect(0, 0, W, H);
  },
  follow(a) { this.drift = false; this.target = a; },
  free() { this.drift = true; }
};
// Золотой ореол с узорами за аватаром
function makeHalo() {
  const S = 640, c = mk(S, S), g = c.getContext('2d'), cx = S / 2, cy = S / 2;
  g.strokeStyle = 'rgba(255,236,190,.55)'; g.fillStyle = 'rgba(255,240,205,.8)'; g.lineWidth = 1.3;
  for (const r of [300, 286, 232, 160]) { g.globalAlpha = r === 286 ? .5 : .8; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); }
  g.globalAlpha = .8; for (let i = 0; i < 144; i++) { const a = i / 144 * Math.PI * 2, l = i % 12 === 0 ? 14 : 6; g.beginPath(); g.moveTo(cx + Math.cos(a) * 286, cy + Math.sin(a) * 286); g.lineTo(cx + Math.cos(a) * (286 - l), cy + Math.sin(a) * (286 - l)); g.stroke(); }
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.save(); g.translate(cx, cy); g.rotate(a); g.beginPath(); g.moveTo(0, -234); g.quadraticCurveTo(22, -258, 0, -282); g.quadraticCurveTo(-22, -258, 0, -234); g.stroke(); g.beginPath(); g.arc(0, -294, 3, 0, 7); g.fill(); g.restore(); }
  const r = mulberry32(8); g.globalAlpha = .6; for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + .4; let x = cx + Math.cos(a) * 200, y = cy + Math.sin(a) * 200; g.beginPath(); g.moveTo(x, y); for (let i = 0; i < 4; i++) { x += (r() - .5) * 60; y += (r() - .5) * 60; g.lineTo(x, y); g.fillRect(x - 1.5, y - 1.5, 3, 3); } g.stroke(); }
  g.globalAlpha = 1; return c.toDataURL();
}
function initHalos() { const u = makeHalo(); $$('.stage-glow').forEach(el => { el.innerHTML = `<img src="${u}" alt="">`; }); }

// ===================== Полный RGB-спектр: выбор любого цвета =====================
function hsv2hex(h, s, v) { const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return rgb2hex([f(5) * 255, f(3) * 255, f(1) * 255]); }
function hex2hsv(hex) { const [r, g, b] = hex2rgb(hex).map(x => x / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } return [h, mx ? d / mx : 0, mx]; }
function colorPicker(hex, onInput, onCommit) {
  const box = document.createElement('div'); box.className = 'cpick';
  box.innerHTML = `<canvas class="sv" width="240" height="140"></canvas><canvas class="hue" width="240" height="16"></canvas><div class="cp-row"><span class="cp-prev"></span><input type="text" class="cp-hex" maxlength="7" spellcheck="false"></div>`;
  let [h, s, v] = hex2hsv(hex || '#c08080');
  const sv = $('.sv', box), hu = $('.hue', box), prev = $('.cp-prev', box), inp = $('.cp-hex', box);
  const paint = () => {
    const g = sv.getContext('2d'); g.fillStyle = hsv2hex(h, 1, 1); g.fillRect(0, 0, 240, 140);
    let gr = g.createLinearGradient(0, 0, 240, 0); gr.addColorStop(0, '#fff'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 240, 140);
    gr = g.createLinearGradient(0, 0, 0, 140); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(0, 0, 240, 140);
    g.strokeStyle = v > .5 ? '#000' : '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(s * 240, (1 - v) * 140, 7, 0, 7); g.stroke();
    const hg = hu.getContext('2d'), hg2 = hg.createLinearGradient(0, 0, 240, 0); for (let i = 0; i <= 6; i++) hg2.addColorStop(i / 6, hsv2hex(i * 60 % 360, 1, 1)); hg.fillStyle = hg2; hg.fillRect(0, 0, 240, 16);
    hg.strokeStyle = '#fff'; hg.lineWidth = 3; hg.strokeRect(h / 360 * 240 - 3, 1, 6, 14);
    const c = hsv2hex(h, s, v); prev.style.background = c; if (document.activeElement !== inp) inp.value = c;
  };
  let pend = 0; const emit = () => { if (pend) return; pend = requestAnimationFrame(() => { pend = 0; onInput(hsv2hex(h, s, v)); }); };
  const drag = (el, fn) => { el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); fn(e); const mv = ev => fn(ev), up = () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); onCommit(hsv2hex(h, s, v)); }; el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); }); };
  const rel = (el, e) => { const r = el.getBoundingClientRect(); return [clamp((e.clientX - r.left) / r.width), clamp((e.clientY - r.top) / r.height)]; };
  drag(sv, e => { const [x, y] = rel(sv, e); s = x; v = 1 - y; paint(); emit(); });
  drag(hu, e => { const [x] = rel(hu, e); h = x * 359.9; paint(); emit(); });
  inp.addEventListener('change', () => { const m = inp.value.trim().match(/^#?([0-9a-f]{6})$/i); if (m) { [h, s, v] = hex2hsv('#' + m[1]); paint(); onCommit('#' + m[1].toLowerCase()); } });
  paint(); return box;
}

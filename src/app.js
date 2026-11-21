
// ===================== Хранилище аккаунтов и сессии (на устройстве) =====================
const Store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn('storage', e); } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { } }
};
const SESSION_MS = 3 * 24 * 3600 * 1000;
const Auth = {
  all() { return Store.get('dml.accounts', {}); },
  get(uid) { return this.all()[uid] || null; },
  put(acc) { const a = this.all(); a[acc.uid] = acc; Store.set('dml.accounts', a); },
  session() { const s = Store.get('dml.session', null); return s && s.exp > Date.now() && this.get(s.uid) ? s : null; },
  start(uid) { Store.set('dml.session', { uid, exp: Date.now() + SESSION_MS }); },
  end() { Store.del('dml.session'); },
  async hash(pw, salt) {
    const s = salt + '::' + pw;
    try { if (crypto.subtle) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); } } catch (e) { }
    let h = s; for (let i = 0; i < 2000; i++) h = hashStr(h + i).toString(36) + h.slice(0, 40); return h.slice(0, 64);
  },
  async register({ provider, name, email, pw }) {
    email = email.trim().toLowerCase();
    if (Object.values(this.all()).some(a => a.email === email && a.provider === provider)) throw 'errExists';
    const uid = 'u' + hashStr(provider + ':' + email).toString(36) + Date.now().toString(36).slice(-3), salt = Math.random().toString(36).slice(2);
    const acc = { uid, name: name.trim(), email, provider, salt, pw: await this.hash(pw, salt), lang: LANG, created: Date.now(), avatar: null };
    this.put(acc); return acc;
  },
  async login({ provider, email, pw }) {
    email = email.trim().toLowerCase(); const list = Object.values(this.all());
    const acc = list.find(a => a.email === email && a.provider === provider) || list.find(a => a.email === email);
    if (!acc) throw 'errNoAcc'; if (await this.hash(pw, acc.salt) !== acc.pw) throw 'errWrongPw'; return acc;
  }
};
const me = () => App.user;
function saveMe(patch) { Object.assign(App.user, patch); Auth.put(App.user); }

// ===================== Экраны =====================
const GEAR_SCREENS = ['home', 'intro', 'gallery', 'memory'];
function show(id) { $$('.screen').forEach(s => s.classList.toggle('active', s.id === id)); App.screen = id; if (id !== 'home' && id !== 'builder') Cosmos.free(); $('#gear').classList.toggle('hidden', !GEAR_SCREENS.includes(id)); $('#albumsBtn').classList.toggle('hidden', !GEAR_SCREENS.includes(id)); if (id !== 'intro') Brain.stop(); if (id !== 'gallery') Gallery.active = false; }
function openModal(id) { $('#' + id).classList.add('open'); }
function closeModal(id) { $('#' + id).classList.remove('open'); if (id === 'composer') { Player.stop(); Composer.previewing = null; } }
$$('.modal').forEach(m => { m.addEventListener('click', e => { if (e.target === m && m.id !== 'progress') closeModal(m.id); }); $$('[data-close]', m).forEach(b => b.onclick = () => closeModal(m.id)); });

const Lang = {
  open() {
    $('#langCards').innerHTML = LANGS.map(l => `<button class="lang-card" data-l="${l.id}">${FLAGS[l.id]}<b>${l.name}</b><small>${l.sub}</small></button>`).join('');
    $$('#langCards .lang-card').forEach(b => b.onclick = () => { setLang(b.dataset.l); AuthUI.open(); });
    show('lang');
  }
};
function setLang(l) { LANG = l; Store.set('dml.lang', l); if (App.user) saveMe({ lang: l }); applyI18n(); }

const AuthUI = {
  mode: 'register', prov: 'google',
  open() {
    $('#authMain').classList.remove('hidden'); $('#authForm').classList.add('hidden');
    $('[data-reg="google"]').innerHTML = ICON_G + `<span>${t('regGoogle')}</span>`; $('[data-reg="apple"]').innerHTML = ICON_A + `<span>${t('regApple')}</span>`;
    const accs = Object.values(Auth.all()).sort((a, b) => (b.last || 0) - (a.last || 0)).slice(0, 4);
    $('#recentAcc').innerHTML = accs.length ? `<div class="or"><span>${t('switchAcc')}</span></div>` + accs.map(a => `<button class="recent-item" data-uid="${a.uid}">${a.thumb ? `<img src="${a.thumb}" alt="">` : '<span class="ph"></span>'}<span><b>${esc(a.name)}</b><small>${esc(a.email)} · ${a.provider === 'apple' ? 'Apple' : 'Google'}</small></span></button>`).join('') : '';
    $$('#recentAcc .recent-item').forEach(b => b.onclick = () => { const a = Auth.get(b.dataset.uid); this.form('login', a.provider, a.email); });
    show('auth');
  },
  form(mode, prov = 'google', email = '') {
    this.mode = mode; this.prov = prov;
    $('#authMain').classList.add('hidden'); $('#authForm').classList.remove('hidden');
    $('#afTitle').textContent = t(mode === 'register' ? 'regTitle' : 'loginTitle');
    $('#afNameWrap').classList.toggle('hidden', mode !== 'register'); $('#afPw2Wrap').classList.toggle('hidden', mode !== 'register'); $('#afPwHint').classList.toggle('hidden', mode !== 'register');
    $('#afSubmit').textContent = t(mode === 'register' ? 'create' : 'login');
    $('#afPw').autocomplete = mode === 'register' ? 'new-password' : 'current-password';
    $('#afEmail').value = email; $('#afPw').value = ''; $('#afPw2').value = ''; $('#afErr').textContent = '';
    this.setProv(prov); setTimeout(() => (mode === 'register' ? $('#afName') : email ? $('#afPw') : $('#afEmail')).focus(), 60);
  },
  setProv(p) {
    this.prov = p; const [g, a] = $$('#afProv button');
    g.innerHTML = ICON_G + 'Google'; a.innerHTML = ICON_A + 'Apple'; g.classList.toggle('on', p === 'google'); a.classList.toggle('on', p === 'apple');
    $('#afEmailL').textContent = t(p === 'google' ? 'emailGoogle' : 'emailApple'); $('#afEmail').placeholder = p === 'google' ? 'name@gmail.com' : 'name@icloud.com';
  },
  async submit() {
    const err = $('#afErr'), email = $('#afEmail').value.trim(), pw = $('#afPw').value, name = $('#afName').value.trim();
    const E = k => { err.textContent = t(k); };
    if (this.mode === 'register' && (name.length < 2 || name.length > 24)) return E('errName');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return E('errEmail');
    if (pw.length < 6) return E('errPw');
    if (this.mode === 'register' && pw !== $('#afPw2').value) return E('errPw2');
    try {
      const acc = this.mode === 'register' ? await Auth.register({ provider: this.prov, name, email, pw }) : await Auth.login({ provider: this.prov, email, pw });
      App.signIn(acc, this.mode === 'register');
    } catch (e) { if (typeof e === 'string') E(e); else { console.error(e); err.textContent = String(e); } }
  },
  bind() {
    $$('[data-reg]').forEach(b => b.onclick = () => this.form('register', b.dataset.reg));
    $('#toLogin').onclick = () => this.form('login', 'google');
    $('#toLang').onclick = () => Lang.open();
    $$('#afProv button').forEach(b => b.onclick = () => this.setProv(b.dataset.p));
    $('#afBack').onclick = () => this.open();
    $('#authForm').onsubmit = e => { e.preventDefault(); this.submit(); };
  }
};

// ===================== Конструктор аватара: интерфейс =====================
const CATS = [['gender', '⚥'], ['hair', '💇'], ['hairColor', '🎨'], ['eyes', '👁️'], ['brows', '〰️'], ['face', '🙂'], ['skin', '✋'], ['clothes', '👕'], ['acc', '👓']];
const NUMK = new Set(['hairColor', 'eyeSize', 'eyeColor', 'browThick', 'skin', 'clothesColor']);
const Builder = {
  cfg: null, hist: [], fut: [], cat: 'hair', editing: false,
  open({ cfg, editing = false, askGender = false }) {
    this.cfg = JSON.parse(JSON.stringify(cfg || avDefault('female'))); this.orig = JSON.stringify(this.cfg); this.hist = []; this.fut = []; this.editing = editing;
    show('builder'); $('#bCancel').classList.toggle('hidden', !editing); $('#bDone').textContent = t('done');
    if (Stage.ok) { Stage.mount($('#bStage'), 'builder'); Stage.onTap = null; Stage.rotY = 0; Stage.setAvatar(this.cfg); } else this.no3d($('#bStage'));
    this.cat = askGender ? 'hair' : (this.cat || 'hair'); this.renderTabs(); if (askGender) { $('#bOpts').innerHTML = ''; Thumbs.clearQueue(); } else this.renderOpts(); this.syncBtns();
    $('#genderStep').classList.toggle('hidden', !askGender);
    if (askGender && Stage.ok) { Thumbs.request(avDefault('female'), 'full', .25, $('#gImgF'), 220, 275); Thumbs.request(avDefault('male'), 'full', -.25, $('#gImgM'), 220, 275); }
  },
  no3d(host) { if (!$('.stage-msg', host)) { const d = document.createElement('div'); d.className = 'stage-msg'; d.textContent = t('three3d'); host.appendChild(d); } },
  pickGender(g) { this.cfg = avDefault(g); this.hist = []; this.fut = []; $('#genderStep').classList.add('hidden'); this.apply(); },
  set(k, v) { if (this.cfg[k] === v) return; this.hist.push(JSON.stringify(this.cfg)); this.fut = []; this.cfg = { ...this.cfg, [k]: v }; this.apply(); },
  apply() { if (Stage.ok) Stage.setAvatar(this.cfg); this.renderOpts(true); this.syncBtns(); },
  undo() { if (!this.hist.length) return; this.fut.push(JSON.stringify(this.cfg)); this.cfg = JSON.parse(this.hist.pop()); this.apply(); },
  redo() { if (!this.fut.length) return; this.hist.push(JSON.stringify(this.cfg)); this.cfg = JSON.parse(this.fut.pop()); this.apply(); },
  reset() { const d = avDefault(this.cfg.gender); if (JSON.stringify(d) === JSON.stringify(this.cfg)) return; this.hist.push(JSON.stringify(this.cfg)); this.fut = []; this.cfg = d; this.apply(); },
  syncBtns() { $('#bUndo').disabled = !this.hist.length; $('#bRedo').disabled = !this.fut.length; $('#bUndo').style.opacity = this.hist.length ? 1 : .4; $('#bRedo').style.opacity = this.fut.length ? 1 : .4; },
  renderTabs() {
    $('#bTabs').innerHTML = CATS.map(([id, ic]) => `<button class="b-tab ${id === this.cat ? 'on' : ''}" data-c="${id}"><i>${ic}</i>${t('cat_' + id)}</button>`).join('');
    $$('#bTabs .b-tab').forEach(b => b.onclick = () => { this.cat = b.dataset.c; Thumbs.clearQueue(); $$('#bTabs .b-tab').forEach(x => x.classList.toggle('on', x === b)); this.renderOpts(); $('#bOpts').scrollTop = 0; });
  },
  grid(key, list, view, yaw = 0, nameFn) {
    const cur = this.cfg[key];
    return `<div class="opt-grid">` + list.map(([v, n]) => `<button class="opt ${String(cur) === String(v) ? 'on' : ''}" data-k="${key}" data-v="${v}" data-view="${view}" data-yaw="${yaw}"><img alt=""><span>${nameFn ? nameFn(v, n) : v === 'none' ? t('none') : esc(L3(n))}</span></button>`).join('') + `</div>`;
  },
  swatches(key, cols, accent) {
    const cur = this.cfg[key], custom = typeof cur === 'string' && !(accent && cols.includes(cur));
    return `<div class="swatches">` + (accent ? `<button class="swatch ${!cur ? 'on' : ''}" data-k="${key}" data-v="" style="background:repeating-linear-gradient(45deg,#3a1d38 0 6px,#2a1230 6px 12px)" aria-label="default"></button>` : '')
      + cols.map((c, i) => { const v = accent ? c : i; return `<button class="swatch ${cur === v ? 'on' : ''}" data-k="${key}" data-v="${v}" style="background:${c}" aria-label="${c}"></button>`; }).join('')
      + `<button class="swatch rainbow ${custom ? 'on' : ''}" data-pick="${key}" aria-label="RGB" style="${custom ? `box-shadow:0 0 0 3px #1a0c21,0 0 0 5px ${cur}` : ''}"></button></div><div class="pick-slot" data-slot="${key}"></div>`;
  },
  openPicker(key) {
    const slot = $(`[data-slot="${key}"]`); if (!slot) return; if (slot.firstChild) { slot.innerHTML = ''; this.pick = null; return; }
    $$('.pick-slot').forEach(x => x.innerHTML = ''); this.pick = key;
    const v = this.cfg[key], list = { hairColor: AV.HAIRC, eyeColor: AV.EYEC, clothesColor: AV.CLOTHC }[key];
    const cur = typeof v === 'string' && v ? v : list ? list[v] : '#e0b860';
    slot.appendChild(colorPicker(cur, hex => { if (Stage.ok) Stage.setAvatar({ ...this.cfg, [key]: hex }); }, hex => this.set(key, hex)));
  },
  renderOpts(keepScroll) {
    const H = s => `<div class="opt-h">${s}</div>`, c = this.cat, idx = n => Array.from({ length: n }, (_, i) => [i, null]);
    let html = '';
    if (c === 'gender') html = this.grid('gender', [['female', N3('Женский', 'Female', 'Әйел')], ['male', N3('Мужской', 'Male', 'Ер')]], 'body', .3);
    if (c === 'hair') html = this.grid('hair', AV.HAIRS, 'hair', .6);
    if (c === 'hairColor') html = H(t('color')) + this.swatches('hairColor', AV.HAIRC) + H(t('cat_hair')) + this.grid('hairColor', AV.HAIRC.map((x, i) => [i, null]).concat(typeof this.cfg.hairColor === 'string' ? [[this.cfg.hairColor, null]] : []), 'hair', .6, () => '');
    if (c === 'eyes') html = H(t('shape')) + this.grid('eyes', AV.EYES, 'eyes') + H(t('size')) + this.grid('eyeSize', idx(3), 'eyes', 0, v => t('sizes')[v]) + H(t('color')) + this.swatches('eyeColor', AV.EYEC);
    if (c === 'brows') html = H(t('shape')) + this.grid('brows', AV.BROWS, 'eyes') + H(t('thickness')) + this.grid('browThick', idx(3), 'eyes', 0, v => t('thick')[v]);
    if (c === 'face') html = this.grid('face', AV.FACES, 'face');
    if (c === 'skin') html = this.grid('skin', idx(AV.SKIN.length), 'face', .25, () => '');
    if (c === 'clothes') html = H(t('cat_clothes')) + this.grid('clothes', AV.CLOTHES, 'body', .25) + H(t('color')) + this.swatches('clothesColor', AV.CLOTHC);
    const AC = ['#e0b860', '#d9d9e0', '#1d1a22', '#b23a48', '#e79ac0', '#7d5ba6', '#3d428b', '#5f9e7a', '#f3eadb'];
    if (c === 'acc') html = H(t('glasses')) + this.grid('glasses', AV.GLASSES, 'face', .35) + (this.cfg.glasses !== 'none' ? H(t('color')) + this.swatches('glassesColor', AC, 1) : '')
      + H(t('earrings')) + this.grid('earrings', AV.EARRINGS, 'face', 1.15) + (this.cfg.earrings !== 'none' ? H(t('color')) + this.swatches('earColor', AC, 1) : '')
      + H(t('hats')) + this.grid('hat', AV.HATS, 'head', .35) + (this.cfg.hat !== 'none' ? H(t('color')) + this.swatches('hatColor', AC, 1) : '')
      + H(t('neck')) + this.grid('neck', AV.NECKS, 'neck', .3) + (this.cfg.neck !== 'none' ? H(t('color')) + this.swatches('neckColor', AC, 1) : '')
      + H(t('details')) + this.grid('details', AV.DETAILS, 'face', .15);
    const box = $('#bOpts'), st = box.scrollTop; box.innerHTML = html; if (keepScroll) box.scrollTop = st;
    Thumbs.clearQueue();
    $$('[data-pick]', box).forEach(b => b.onclick = () => this.openPicker(b.dataset.pick));
    if (this.pick && $(`[data-slot="${this.pick}"]`)) { const k = this.pick; this.pick = null; this.openPicker(k); }
    $$('[data-k]', box).forEach(b => {
      const k = b.dataset.k, raw = b.dataset.v, v = raw === '' ? null : (NUMK.has(k) && /^\d+$/.test(raw)) ? +raw : raw;
      b.onclick = () => this.set(k, v);
      const img = $('img', b); const pc = { ...this.cfg, [k]: v }; if (k === 'earrings' && ['long', 'longBangs', 'wavy', 'curlyLong', 'bob', 'wolf', 'afro', 'dreads'].includes(pc.hair)) pc.hair = 'bunTop'; if (img && Stage.ok) Thumbs.request(pc, b.dataset.view, +b.dataset.yaw, img);
    });
  },
  done() {
    const cfg = this.cfg; let thumb = me().thumb;
    try { if (Stage.ok) thumb = Thumbs.shot(cfg, 'head', .3, 176, 176); } catch (e) { }
    saveMe({ avatar: cfg, thumb }); Home.open();
  },
  cancel() { if (this.editing) { Home.open(); } },
  bind() {
    $('#bUndo').onclick = () => this.undo(); $('#bRedo').onclick = () => this.redo(); $('#bReset').onclick = () => this.reset();
    $('#bDone').onclick = () => this.done(); $('#bCancel').onclick = () => this.cancel();
    $('#rotL').onclick = () => Stage.rotateBy(-Math.PI / 4); $('#rotR').onclick = () => Stage.rotateBy(Math.PI / 4);
    $$('#genderStep [data-g]').forEach(b => b.onclick = () => this.pickGender(b.dataset.g));
    addEventListener('keydown', e => { if (App.screen !== 'builder') return; if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? this.redo() : this.undo(); } });
  }
};

// ===================== Главный экран: герой + «Дневник моей жизни» =====================
const Home = {
  open() {
    show('home'); $('#hName').textContent = me().name; $('#hName').style.opacity = '';
    if (Stage.ok) { Stage.mount($('#hStage'), 'home'); Stage.nameEl = $('#hName'); Stage.resetCam(); Stage.setAvatar(me().avatar); Stage.onTap = () => this.dive(); }
    else { Builder.no3d($('#hStage')); $('#hStage').onclick = () => this.dive(); $('#hName').style.top = '30%'; }
  },
  dive() {
    if (this.busy) return; this.busy = true; getAC(); $('#hName').style.opacity = 0;
    const el = Stage.ok ? Stage.renderer.domElement : $('#hStage');
    Warp.run(el, () => { Intro.open(true); if (Stage.ok) Stage.resetCam(); this.busy = false; });
  }
};

// ===================== Мозг: «Архив Воспоминаний» =====================
const Brain = {
  init(cv) {
    this.c = cv; this.g = cv.getContext('2d'); this.t0 = performance.now();
    const r = mulberry32(42);
    const inside = (x, y) => {
      const ce = (x / .95) ** 2 + ((y + .05) / .68) ** 2 < 1 && y < .36 + .08 * Math.cos(x * 2);
      const cb = ((x - .5) / .32) ** 2 + ((y - .42) / .19) ** 2 < 1;
      const stem = y > .3 && y < .9 && Math.abs(x - .2 - (y - .3) * .18) < .085;
      return ce || cb || stem;
    };
    const depth = (x, y) => Math.sqrt(Math.max(0, 1 - (x / 1) ** 2 - ((y + .05) / .75) ** 2)) * .55;
    this.P = [];
    while (this.P.length < 1000) { const x = r() * 2 - 1, y = r() * 1.8 - .8; if (!inside(x, y)) continue; const dz = depth(x, y); this.P.push({ x, y, z: (r() * 2 - 1) * dz, h: r() }); }
    this.E = []; this.nb = this.P.map(() => []);
    for (let i = 0; i < this.P.length; i++) {
      const a = this.P[i], ds = [];
      for (let j = 0; j < this.P.length; j++) if (j !== i) { const b = this.P[j], d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2; if (d < .012) ds.push([d, j]); }
      ds.sort((p, q) => p[0] - q[0]).slice(0, 3).forEach(([, j]) => { if (i < j) this.E.push([i, j]); this.nb[i].push(j); this.nb[j].push(i); });
    }
    this.S = [];
    for (let k = 0; k < 34; k++) { let x = r() * 1.6 - .8, y = r() * 1 - .6, a = r() * 6.28; const sgn = r() < .5 ? 1 : -1; if (!inside(x, y)) { k--; continue; } const line = []; for (let s = 0; s < 46; s++) { a += (r() - .5) * .9; const nx = x + Math.cos(a) * .028, ny = y + Math.sin(a) * .028; if (!inside(nx, ny) || ny > .3) { a += Math.PI * .7; continue; } x = nx; y = ny; line.push({ x, y, z: depth(x, y) * sgn * .9 }); } this.S.push(line); }
    this.pulses = [];
    this.spr = mk(64, 64); const sg = this.spr.getContext('2d'); const gr = sg.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,250,235,1)'); gr.addColorStop(.25, 'rgba(255,205,140,.7)'); gr.addColorStop(1, 'rgba(255,160,120,0)'); sg.fillStyle = gr; sg.fillRect(0, 0, 64, 64);
    this.resize(); addEventListener('resize', () => this.resize());
    const hit = e => { const R = Math.min(innerWidth, innerHeight * 1.15) * .36, cx = innerWidth / 2, cy = innerHeight * .4; return Math.hypot(e.clientX - cx, (e.clientY - cy) / .8) < R * 1.05; };
    cv.addEventListener('click', e => { if (hit(e) && this.onEnter && !this.zt0) this.onEnter(); });
    cv.addEventListener('mousemove', e => { this.hover = hit(e); cv.style.cursor = this.hover ? 'pointer' : 'default'; });
  },
  start(appear) { this.alive = true; this.zt0 = null; this.at0 = appear ? performance.now() : 0; this.hover = false; $('.intro-ui').classList.remove('gone'); if (!this.running) { this.running = true; const loop = now => { if (!this.alive) { this.running = false; return; } this.draw(now); requestAnimationFrame(loop); }; requestAnimationFrame(loop); } },
  stop() { this.alive = false; },
  resize() { const d = Math.min(2, devicePixelRatio || 1); this.dpr = d; this.c.width = innerWidth * d; this.c.height = innerHeight * d; },
  zoomIn(cb) { this.zt0 = performance.now(); this.cb = cb; $('.intro-ui').classList.add('gone'); },
  draw(now) {
    const g = this.g, W = this.c.width, H = this.c.height, t = (now - this.t0) / 1000;
    let Z = 1, fade = 1;
    if (this.zt0) { const k = (now - this.zt0) / 1700; Z = Math.exp(k * k * 5.2); fade = clamp(1 - (k - .55) / .45); if (k >= 1) { this.alive = false; g.clearRect(0, 0, W, H); this.cb && this.cb(); return; } }
    if (this.at0) { const A = clamp((now - this.at0) / 1700), ea = 1 - Math.pow(1 - A, 3); Z *= lerp(3.2, 1, ea); fade *= clamp(A * 1.6); }
    this.hv = lerp(this.hv || 0, this.hover ? 1 : 0, .08);
    g.clearRect(0, 0, W, H);
    const R = Math.min(W, H * 1.15) * .36 * (1 + this.hv * .03), cx = W / 2, cy = H * .4, rot = Math.sin(t * .22) * .5, cs = Math.cos(rot), sn = Math.sin(rot);
    const fx = cx - R * .05, fy = cy - R * .1;
    const proj = p => { const x = p.x * cs - p.z * sn, z = p.x * sn + p.z * cs, s = 1 / (1 - z * .35); const breathe = 1 + Math.sin(t * 1.1) * .012; return [fx + (cx + x * R * s * breathe - fx) * Z, fy + (cy + p.y * R * s * breathe - fy) * Z, z]; };
    g.globalAlpha = fade;
    g.save(); g.globalCompositeOperation = 'screen'; const core = g.createRadialGradient(cx, cy, 0, cx, cy, R * 1.3 * Z); core.addColorStop(0, `rgba(255,190,130,${.2 + this.hv * .2})`); core.addColorStop(1, 'rgba(255,160,120,0)'); g.fillStyle = core; g.fillRect(0, 0, W, H); g.restore();
    const PP = this.P.map(proj);
    g.lineWidth = 1 * this.dpr; g.strokeStyle = 'rgba(240,205,150,.16)'; g.beginPath(); for (const [i, j] of this.E) { g.moveTo(PP[i][0], PP[i][1]); g.lineTo(PP[j][0], PP[j][1]); } g.stroke();
    g.strokeStyle = 'rgba(255,190,210,.18)'; g.lineWidth = 1.4 * this.dpr; for (const line of this.S) { g.beginPath(); line.forEach((p, i) => { const q = proj(p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.stroke(); }
    for (let i = 0; i < PP.length; i++) { const p = PP[i], h = this.P[i].h, s = (1.3 + (p[2] + .5) * 1.4) * this.dpr * Math.min(Z, 6); g.fillStyle = h < .5 ? `rgba(255,222,165,${.45 + p[2] * .4})` : h < .85 ? `rgba(255,170,200,${.45 + p[2] * .4})` : `rgba(255,244,220,${.6 + p[2] * .3})`; g.fillRect(p[0] - s / 2, p[1] - s / 2, s, s); }
    const maxP = 150 + this.hv * 80; if (this.pulses.length < maxP) for (let k = 0; k < 3 + this.hv * 3; k++) { const a = (Math.random() * this.P.length) | 0, nb = this.nb[a]; if (nb.length) this.pulses.push({ a, b: nb[(Math.random() * nb.length) | 0], t: 0, sp: .02 + Math.random() * .04, life: 4 + (Math.random() * 6 | 0) }); }
    g.save(); g.globalCompositeOperation = 'screen';
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i]; p.t += p.sp;
      if (p.t >= 1) { const nb = this.nb[p.b]; if (--p.life > 0 && nb.length) { p.a = p.b; p.b = nb[(Math.random() * nb.length) | 0]; p.t = 0; } else { this.pulses.splice(i, 1); continue; } }
      const A = PP[p.a], B = PP[p.b], x = lerp(A[0], B[0], p.t), y = lerp(A[1], B[1], p.t), s = 18 * this.dpr * Math.min(Z, 5);
      g.drawImage(this.spr, x - s / 2, y - s / 2, s, s);
    }
    g.restore(); g.globalAlpha = 1;
    if (this.zt0) { const k = (now - this.zt0) / 1700; g.fillStyle = `rgba(255,240,210,${clamp((k - .6) * 1.6) * .6})`; g.fillRect(0, 0, W, H); }
  }
};
const Intro = {
  open(appear) { show('intro'); Brain.start(appear); $('#archiveSub').textContent = ''; App.ensureDays(); }
};

// ===================== Архив: ряды-годы слева направо, месяцы вглубь =====================
const URLS = new Map();
function coverURL(d) { const i = d.main || 0, k = d.id + ':' + i; if (!URLS.has(k)) URLS.set(k, URL.createObjectURL(d.frames[i] || d.frames[0])); return URLS.get(k); }
const _imgMemo = new WeakMap();
function imgOf(blob) { if (!_imgMemo.has(blob)) _imgMemo.set(blob, blobToImage(blob)); return _imgMemo.get(blob); }
function moodOfMonth(days) { const cnt = {}; let best = null, bc = 0; days.forEach(d => { const m = d.mood || 'calm'; cnt[m] = (cnt[m] || 0) + 1; }); for (const d of days.slice().reverse()) { const m = d.mood || 'calm'; if (cnt[m] > bc) { bc = cnt[m]; best = m; } } return best || 'calm'; }
const COLLAGE = new Map();
async function monthCollage(days, key) {
  if (COLLAGE.has(key)) return COLLAGE.get(key);
  const p = (async () => {
    let blobs = []; days.forEach(d => { const main = d.main || 0; blobs.push(d.photos[main]); d.photos.forEach((b, i) => { if (i !== main) blobs.push(b); }); });
    if (blobs.length > 9) { const mains = days.map(d => d.photos[d.main || 0]); const rest = blobs.filter(b => !mains.includes(b)); blobs = mains.slice(0, 9).concat(rest).slice(0, 9); }
    const n = blobs.length, W = 640, H = 800, c = mk(W, H), g = c.getContext('2d'), gap = 6;
    g.fillStyle = '#0d0b1e'; g.fillRect(0, 0, W, H);
    const cols = n === 1 ? 1 : n === 2 ? 1 : n <= 4 ? 2 : n <= 6 ? 2 : 3, rows = Math.ceil(n / cols), rh = (H - gap * (rows + 1)) / rows;
    const imgs = await Promise.all(blobs.map(b => imgOf(b).catch(() => null)));
    let k = 0; for (let r = 0; r < rows; r++) { const inRow = Math.min(cols, n - k), cw = (W - gap * (inRow + 1)) / inRow; for (let j = 0; j < inRow; j++, k++) { const im = imgs[k], x = gap + j * (cw + gap), y = gap + r * (rh + gap); g.save(); g.beginPath(); g.rect(x, y, cw, rh); g.clip(); if (im) drawCover(g, im, cw, rh, x, y); g.restore(); } }
    const mc = hex2rgb(MOODS[moodOfMonth(days)].c); g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = css(mc, .35); g.fillRect(0, 0, W, H); g.restore();
    const vg = g.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(8,6,20,.45)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    return URL.createObjectURL(await canvasToBlob(c, 'image/jpeg', .86));
  })();
  COLLAGE.set(key, p); return p;
}
const Gallery = {
  items: [], signs: [], lanes: [], lane: 0, camZ: 0, tZ: 0, camX: 0, tX: 0, active: false,
  layout() { const nw = innerWidth < 700; this.FW = nw ? 250 : 360; this.FH = this.FW * 1.25; this.X = nw ? 120 : 330; this.ROT = nw ? 8 : 18; this.S = nw ? 820 : 950; this.LW = nw ? 2100 : 2200; this.narrow = nw; },
  build(days) {
    this.layout(); this.days = days;
    const W = $('#world'); W.innerHTML = ''; this.items = []; this.signs = []; this.lanes = [];
    const cy = new Date().getFullYear(), years = [...new Set(days.map(d => +d.date.slice(0, 4)).concat([cy]))].sort((a, b) => a - b);
    years.forEach((y, li) => {
      const lx = li * this.LW, lane = { year: y, x: lx, items: [] }; let z = -300;
      this.addSign('year', String(y), lx, z); z -= 700;
      const byM = {}; days.filter(d => +d.date.slice(0, 4) === y).forEach(d => { const m = +d.date.slice(5, 7) - 1; (byM[m] = byM[m] || []).push(d); });
      Object.keys(byM).map(Number).sort((a, b) => a - b).forEach((m, k) => {
        const ds = byM[m], side = k % 2 ? 1 : -1, x = lx + side * this.X, mood = moodOfMonth(ds);
        const el = this.frameEl(x, z, side, `${monthName(m)}<small>${daysN(ds.length)}</small>`, '<img alt="" draggable="false">', MOODS[mood].c);
        const it = { el, x, z, lane: li, kind: 'month', y, m, days: ds }; lane.items.push(it); this.items.push(it);
        el.addEventListener('click', e => { e.stopPropagation(); this.open(it); });
        const key = `${y}-${m}|` + ds.map(d => d.id + ':' + (d.main || 0)).join(',');
        monthCollage(ds, key).then(u => { const im = $('img', el); if (im) { im.onload = () => im.classList.add('ready'); im.src = u; } });
        z -= this.S;
      });
      if (y === cy) { const side = lane.items.length % 2 ? 1 : -1, x = lx + side * this.X; const el = this.frameEl(x, z, side, `${t('today')}<small>${t('newPage')}</small>`, `<span>+</span>${t('writeNew')}`, '#a6aff5', 'new'); const it = { el, x, z, lane: li, kind: 'new' }; lane.items.push(it); this.items.push(it); el.addEventListener('click', e => { e.stopPropagation(); this.open(it); }); z -= this.S; }
      lane.maxZ = -(lane.items.length ? lane.items[lane.items.length - 1].z : z) - 200;
      this.lanes.push(lane);
    });
    $('#years').innerHTML = this.lanes.map((l, i) => `<button data-l="${i}">${l.year}</button>`).join('');
    $$('#years button').forEach(b => b.onclick = () => this.setLane(+b.dataset.l));
    this.lane = Math.min(this.lane, this.lanes.length - 1);
  },
  frameEl(x, z, side, label, inner, glow, cls = '') {
    const el = document.createElement('div'); el.className = 'frame ' + cls; el.style.width = this.FW + 'px'; el.style.height = this.FH + 'px'; el.style.setProperty('--glow', glow);
    el.innerHTML = `<div class="label">${label}</div><div class="pic">${inner}</div>`;
    el.style.transform = `translate3d(${x - this.FW / 2}px,${-this.FH / 2}px,${z}px) rotateY(${-side * this.ROT}deg)`;
    $('#world').appendChild(el); return el;
  },
  addSign(kind, text, x, z) { const el = document.createElement('div'); el.className = 'sign ' + kind; el.textContent = text; el.style.transform = `translate3d(${x}px,${-this.FH * .35}px,${z}px) translate(-50%,-50%)`; $('#world').appendChild(el); this.signs.push({ el, z, x }); },
  focus(it, hl = true) { if (!it) return; this.lane = it.lane; const lx = this.lanes[it.lane].x; this.tZ = -it.z - 600; this.tX = lx + (it.x - lx) * (this.narrow ? .75 : .5); if (hl) { this.items.forEach(x => x.el.classList.remove('hl')); clearTimeout(this._hlT); this._hlT = setTimeout(() => { it.el.classList.add('hl'); setTimeout(() => it.el.classList.remove('hl'), 2000); }, 700); } },
  setLane(li, last = false) { li = clamp(li, 0, this.lanes.length - 1); const L = this.lanes[li]; this.lane = li; const its = L.items.filter(x => x.kind === 'month'); const it = last ? (its[its.length - 1] || L.items[0]) : (L.items[0]); if (it) this.focus(it); else { this.tX = L.x; this.tZ = 0; } },
  laneItems() { return this.lanes[this.lane] ? this.lanes[this.lane].items : []; },
  nearest() { const its = this.laneItems(); let bi = 0, bd = 1e9; its.forEach((it, i) => { const d = Math.abs(it.z + this.camZ + 600); if (d < bd) { bd = d; bi = i; } }); return its[bi]; },
  step(dir) { const its = this.laneItems(), n = its.indexOf(this.nearest()); if (n < 0) return; const it = its[n], dz = it.z + this.camZ + 600; let i = dir > 0 ? (dz > 120 ? n : n + 1) : (dz < -120 ? n : n - 1); this.focus(its[clamp(i, 0, its.length - 1)]); },
  open(it) {
    const dz = it.z + this.camZ + 600; this.focus(it, false);
    const go = () => it.kind === 'new' ? Composer.open() : MonthPanel.open(it.y, it.m);
    if (Math.abs(dz) > 160 || Math.abs(this.camX - this.tX) > 60) setTimeout(go, Math.min(1200, 450 + Math.abs(dz) * .35)); else go();
  },
  tick() {
    this.camZ += (this.tZ - this.camZ) * .075; this.camX += (this.tX - this.camX) * .07;
    $('#world').style.transform = `translate3d(${-this.camX}px,0px,${this.camZ}px)`;
    const vis = (o, z, other) => { const dz = z + this.camZ; let a = dz > 0 ? clamp(1 - dz / 320) : clamp(1 - (-dz - 4200) / 2600); if (other) a *= .5; o.el.style.opacity = a; o.el.style.visibility = a <= .01 ? 'hidden' : 'visible'; };
    this.items.forEach(it => vis(it, it.z, it.lane !== this.lane)); this.signs.forEach(s => vis(s, s.z, Math.abs(s.x - this.lanes[this.lane].x) > 10));
    const it = this.nearest(); const w = it ? (it.kind === 'month' ? `${monthName(it.m)} ${it.y}` : t('today')) : ''; if (this._where !== w) { this._where = w; $('#where').textContent = w; }
    if (this._lane !== this.lane) { this._lane = this.lane; $$('#years button').forEach((b, i) => b.classList.toggle('on', i === this.lane)); }
    Dust.draw(this.camZ, this.camX, this.tZ - this.camZ, this.FH);
  },
  bind() {
    const sc = $('#gallery'); let wheelLock = 0;
    sc.addEventListener('wheel', e => { if (e.target.closest('.results')) return; e.preventDefault(); if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.4 && Math.abs(e.deltaX) > 12) { if (performance.now() > wheelLock) { wheelLock = performance.now() + 700; this.setLane(this.lane + Math.sign(e.deltaX)); } return; } const L = this.lanes[this.lane]; this.tZ = clamp(this.tZ + e.deltaY * 1.5, -300, L ? L.maxZ : 0); }, { passive: false });
    let tx = null, ty = null, sx = 0, sy = 0;
    sc.addEventListener('touchstart', e => { if (e.target.closest('.hud-top')) return; tx = sx = e.touches[0].clientX; ty = sy = e.touches[0].clientY; }, { passive: true });
    sc.addEventListener('touchmove', e => { if (ty === null) return; const x = e.touches[0].clientX, y = e.touches[0].clientY; if (Math.abs(y - sy) > Math.abs(x - sx)) { const L = this.lanes[this.lane]; this.tZ = clamp(this.tZ + (ty - y) * 3.2, -300, L ? L.maxZ : 0); } tx = x; ty = y; }, { passive: true });
    sc.addEventListener('touchend', () => { if (ty === null) return; const dx = tx - sx, dy = ty - sy; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) this.setLane(this.lane - Math.sign(dx)); tx = ty = null; });
    addEventListener('keydown', e => { if (!this.active || document.activeElement === $('#search') || $('.modal.open')) return; if (e.key === 'ArrowUp') { this.step(1); e.preventDefault(); } if (e.key === 'ArrowDown') { this.step(-1); e.preventDefault(); } if (e.key === 'ArrowRight') { this.setLane(this.lane + 1); e.preventDefault(); } if (e.key === 'ArrowLeft') { this.setLane(this.lane - 1); e.preventDefault(); } if (e.key === 'Enter' && this.nearest()) this.open(this.nearest()); });
    $('#prevYear').onclick = () => this.setLane(this.lane - 1); $('#nextYear').onclick = () => this.setLane(this.lane + 1);
    $('#galBack').onclick = () => Intro.open(true);
    addEventListener('resize', () => { if (this.days && this.active) { const it = this.nearest(), lane = this.lane; this.build(this.days); this.lane = lane; const its = this.laneItems(); const f = it && its.find(x => x.kind === it.kind && x.m === it.m); this.focus(f || its[0], false); this.camZ = this.tZ; this.camX = this.tX; } });
  }
};
const Dust = {
  init() { this.c = $('#dust'); this.g = this.c.getContext('2d'); const r = mulberry32(7); this.pts = []; for (let i = 0; i < 260; i++) this.pts.push({ x: (r() - .5) * 4200, y: (r() - .5) * 2600, z: r() * 9000, h: r() }); },
  draw(camZ, camX, vel, FH) {
    const c = this.c, d = Math.min(2, devicePixelRatio || 1); if (c.width !== innerWidth * d || c.height !== innerHeight * d) { c.width = innerWidth * d; c.height = innerHeight * d; }
    const g = this.g, W = innerWidth, H = innerHeight, cx = W / 2, cy = H * .45, f = 800;
    g.setTransform(d, 0, 0, d, 0, 0); g.clearRect(0, 0, W, H);
    
    const fy = FH * .5 + 170; g.lineWidth = 1;
    for (let k = 0; k < 60; k++) { const zw = -k * 260 - (((-camZ) % 260) + 260) % 260; const s = f / (f - zw); if (s <= 0) continue; const y = cy + fy * s; const a = clamp(s * 1.1) * .22; g.strokeStyle = `rgba(236,199,127,${a})`; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    for (let k = -14; k <= 14; k++) { const xw = k * 260 - (camX % 260); const s1 = f / (f + 9000), s0 = f / (f - 600); g.strokeStyle = `rgba(236,199,127,${.12 - Math.abs(k) * .006})`; g.beginPath(); g.moveTo(cx + xw * s0, cy + fy * s0); g.lineTo(cx + xw * s1, cy + fy * s1); g.stroke(); }
    const hz = g.createLinearGradient(0, cy, 0, cy + 140); hz.addColorStop(0, 'rgba(240,190,130,.16)'); hz.addColorStop(1, 'rgba(240,190,130,0)'); g.fillStyle = hz; g.fillRect(0, cy, W, 140);
    g.save(); g.globalCompositeOperation = 'screen';
    for (const p of this.pts) {
      const dz = -((((p.z - camZ) % 9000) + 9000) % 9000) + 300; const s = f / (f - dz); if (s <= 0 || s > 8) continue;
      const px = ((p.x - camX * .6) % 4200 + 6300) % 4200 - 2100, x = cx + px * s, y = cy + p.y * s; if (x < -50 || x > W + 50 || y < -50 || y > H + 50) continue;
      const a = clamp(s * 1.4) * .8, col = p.h < .5 ? '255,220,160' : p.h < .85 ? '255,170,200' : '255,240,215', R = Math.max(1, 2.4 * s);
      if (Math.abs(vel) > 25) { const s2 = f / (f - (dz - vel * .25)); g.strokeStyle = `rgba(${col},${a * .5})`; g.lineWidth = R * .8; g.beginPath(); g.moveTo(cx + px * s2, cy + p.y * s2); g.lineTo(x, y); g.stroke(); }
      const gr = g.createRadialGradient(x, y, 0, x, y, R * 3); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(x - R * 3, y - R * 3, R * 6, R * 6);
    }
    g.restore();
  }
};

// ===================== Месяц: стена картин-дней =====================
const MonthPanel = {
  open(y, m) {
    this.y = y; this.m = m; const days = App.days.filter(d => +d.date.slice(0, 4) === y && +d.date.slice(5, 7) - 1 === m);
    $('#mpTitle').textContent = `${monthName(m)} ${y}`;
    if (days.length) { const mo = MOODS[moodOfMonth(days)]; $('#mpDot').style.setProperty('--c', mo.c); $('#mpDot').innerHTML = `<i></i>${t('mostly', { m: mo.e + ' ' + L3(mo.n) })}`; } else $('#mpDot').innerHTML = '';
    $('#mpWall').innerHTML = days.map(d => { const mo = MOODS[d.mood] || MOODS.calm; return `<figure class="dcard" data-id="${d.id}" style="--glow:${mo.c}"><div class="dpic"><img src="${coverURL(d)}" alt=""><span class="dm">${mo.e}</span></div><figcaption><b>${fmtDay(d.date)}</b><span>${fmtWeek(d.date)}</span></figcaption></figure>`; }).join('')
      + `<figure class="dcard add" id="mpAdd"><div class="dpic"><span>+</span>${t('addInMonth')}</div><figcaption><b>&nbsp;</b></figcaption></figure>`;
    $$('#mpWall .dcard[data-id]').forEach(f => f.onclick = () => { const d = App.days.find(x => x.id === f.dataset.id); diveFrom($('img', f), () => { closeModal('monthPanel'); Memory.open(d); }); });
    $('#mpAdd').onclick = () => { closeModal('monthPanel'); const now = new Date(); Composer.open(now.getFullYear() === y && now.getMonth() === m ? todayISO() : `${y}-${String(m + 1).padStart(2, '0')}-${String(Math.min(28, now.getDate())).padStart(2, '0')}`); };
    openModal('monthPanel'); $('#monthPanel').scrollTop = 0;
  }
};
function diveFrom(img, cb) {
  if (diveFrom.busy) return; diveFrom.busy = true; const rc = img.getBoundingClientRect();
  const cl = document.createElement('img'); cl.src = img.src; cl.className = 'dive'; Object.assign(cl.style, { left: rc.left + 'px', top: rc.top + 'px', width: rc.width + 'px', height: rc.height + 'px' }); document.body.appendChild(cl);
  const wo = document.createElement('div'); wo.className = 'whiteout'; document.body.appendChild(wo);
  const h = Math.min(innerHeight * 1.6, innerWidth * 2), w = h * .8;
  requestAnimationFrame(() => requestAnimationFrame(() => { Object.assign(cl.style, { left: (innerWidth - w) / 2 + 'px', top: (innerHeight - h) / 2 + 'px', width: w + 'px', height: h + 'px', filter: 'blur(2px) brightness(1.2)' }); wo.classList.add('on'); }));
  setTimeout(() => { cb(); cl.style.opacity = 0; wo.classList.remove('on'); setTimeout(() => { cl.remove(); wo.remove(); diveFrom.busy = false; }, 700); }, 900);
}

// ===================== Музыка: проигрыватель библиотеки =====================
// Пользовательские треки (например, скачанные с Pixabay Music) хранятся в IndexedDB рядом с днями
const UserTracks = {
  list: [],
  async load() { await App.dbReady; const uid = me() && me().uid; this.list = (await DB.all()).filter(x => x.kind === 'track' && x.owner === uid); return this.list; },
  async add(file, tags) {
    const buf = await decodeAudio(await file.arrayBuffer()); const m = analyzeAudioBuffer(buf);
    const tr = { id: 'trk' + Date.now().toString(36), kind: 'track', owner: me().uid, user: true, blob: file, name: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim(), bpm: m.bpm, mode: m.mode, v: +m.valence.toFixed(2), e: +m.energy.toFixed(2), tags: tags && tags.length ? tags : [nearestMood(m.valence, m.arousal)], n: null, created: Date.now() };
    tr.n = { ru: tr.name, en: tr.name, kk: tr.name }; await DB.put(tr); this.list.push(tr); Player.cache.set(tr.id, Promise.resolve(buf)); return tr;
  },
  async del(id) { await DB.del(id); this.list = this.list.filter(x => x.id !== id); }
};
function nearestMood(v, a) { let best = 'calm', bd = 9; for (const k of MOOD_KEYS) { const m = MOODS[k], d = Math.hypot(m.v - v, m.a - a); if (d < bd) { bd = d; best = k; } } return best; }
const trackById = id => TRACK[id] || UserTracks.list.find(x => x.id === id) || null;
const allTracks = () => UserTracks.list.concat(TRACKS);
const Player = {
  cache: new Map(), playing: false, offset: 0, id: null, ducked: false, token: 0, live: new Set(),
  buffer(id) {
    if (!this.cache.has(id)) { const tr = trackById(id); this.cache.set(id, !tr ? Promise.reject(new Error('no track')) : tr.blob ? tr.blob.arrayBuffer().then(decodeAudio) : synthSong(tr, 32)); }
    return this.cache.get(id);
  },
  graph() { const ac = getAC(); if (!this.gain) { this.gain = ac.createGain(); this.an = ac.createAnalyser(); this.an.fftSize = 1024; this.data = new Uint8Array(1024); this.gain.connect(this.an); this.an.connect(ac.destination); } return ac; },
  async play(id, fromStart) {
    const tok = ++this.token; this.halt();
    if (this.id !== id || fromStart) this.offset = 0; this.id = id; this.want = id;
    let buf; try { buf = await this.buffer(id); } catch (e) { console.warn(e); return; }
    if (tok !== this.token) return; // за время синтеза пришла другая команда — этот запуск отменён
    const ac = this.graph(); if (ac.state === 'suspended') { try { await ac.resume(); } catch (e) { } }
    if (tok !== this.token) return;
    const src = ac.createBufferSource(); src.buffer = buf; src.loop = true; src.connect(this.gain);
    this.gain.gain.cancelScheduledValues(ac.currentTime); this.gain.gain.setValueAtTime(0, ac.currentTime); this.gain.gain.linearRampToValueAtTime(this.ducked ? .22 : .85, ac.currentTime + .6);
    src.start(0, this.offset % buf.duration); this.startAt = ac.currentTime - this.offset; this.src = src; this.live.add(src); this.dur = buf.duration; this.playing = true; this.onchange && this.onchange();
  },
  halt() { this.live.forEach(src => { try { src.stop(); } catch (e) { } try { src.disconnect(); } catch (e) { } }); this.live.clear(); this.src = null; this.playing = false; },
  pause() { this.token++; if (!this.playing) { this.onchange && this.onchange(); return; } this.offset = getAC().currentTime - this.startAt; this.halt(); this.onchange && this.onchange(); },
  stop() { this.token++; this.want = null; this.halt(); this.offset = 0; this.id = null; this.onchange && this.onchange(); },
  time() { return this.playing ? getAC().currentTime - this.startAt : this.offset; },
  duck(on) { this.ducked = on; if (this.gain) this.gain.gain.setTargetAtTime(on ? .22 : .85, getAC().currentTime, .35); },
  level() { if (!this.an || !this.playing) return 0; this.an.getByteTimeDomainData(this.data); let s = 0; for (let i = 0; i < this.data.length; i++) { const x = (this.data[i] - 128) / 128; s += x * x; } return Math.sqrt(s / this.data.length) * 3; }
};
function pickTrack(mood, text, photo, seedStr) {
  const M = MOODS[mood] || MOODS.calm, v = M.v * .6 + text.valence * .25 + photo.valence * .15, e = M.a * .6 + text.arousal * .25 + photo.arousal * .15;
  const sc = allTracks().map(tr => ({ tr, d: Math.hypot(tr.v - v, (tr.e - e) * 1.2) - (tr.tags.includes(mood) ? .22 : 0) })).sort((a, b) => a.d - b.d);
  const r = mulberry32(hashStr(seedStr)); return (sc[1] && sc[1].d - sc[0].d < .06 && r() < .5) ? sc[1].tr : sc[0].tr;
}
function musicFromTrack(tr) { return finishMusic({ bpm: tr.bpm, energy: tr.e, bright: clamp(.5 + tr.v * .2), mode: tr.mode, keyName: tr.mode, keyConf: .8, source: 'library' }); }
function musicFromMood(mood) { const M = MOODS[mood] || MOODS.calm; return finishMusic({ bpm: Math.round(62 + M.a * 70), energy: M.a, bright: clamp(.5 + M.v * .2), mode: M.v >= 0 ? 'major' : 'minor', keyName: '', keyConf: .6, source: 'mood' }); }

// ===================== День: живое фото, листание, видео, эмоции по фото =====================
const domMood = list => { const c = {}; let best = list[0], bc = 0; list.forEach(m => { c[m] = (c[m] || 0) + 1; if (c[m] > bc) { bc = c[m]; best = m; } }); return best || 'calm'; };
const Live = {
  mode: 'live',
  init() {
    this.c = $('#live'); this.g = this.c.getContext('2d'); this.grainPat = this.g.createPattern(grainTile(3), 'repeat'); this.loop = this.loop.bind(this);
    let sx = null; this.c.addEventListener('pointerdown', e => { sx = e.clientX; });
    this.c.addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) this.go(this.idx - Math.sign(dx)); else if (e.clientX - this.c.getBoundingClientRect().left > this.c.clientWidth * .5) this.go(this.idx + 1); else this.go(this.idx - 1); });
  },
  load(day, srcs, idx) { this.day = day; this.srcs = srcs; this.idx = idx; this.prev = null; this.sw = performance.now(); this.t0 = performance.now(); this.motes = []; const r = mulberry32(5); for (let i = 0; i < 38; i++) this.motes.push({ x: r() * RW, y: r() * RH, R: 1.5 + r() * 3.5, s: .15 + r() * .4, ph: r() * 6 }); this.syncVideos(); if (!this.run) { this.run = true; requestAnimationFrame(this.loop); } },
  go(i) { const n = this.srcs.length; if (n < 2) return; i = ((i % n) + n) % n; if (i === this.idx) return; this.prev = this.idx; this.idx = i; this.sw = performance.now(); this.syncVideos(); Memory.syncIdx(); },
  stop() { this.run = false; (this.srcs || []).forEach(s => { if (s.tagName === 'VIDEO') s.pause(); }); },
  syncVideos() { (this.srcs || []).forEach((s, i) => { if (s.tagName !== 'VIDEO') return; if (i === this.idx && this.mode === 'live') { s.muted = true; s.play().catch(() => { }); } else { s.pause(); if (this.mode !== 'live') try { s.currentTime = .1; } catch (e) { } } }); },
  dims(s) { return [s.videoWidth || s.naturalWidth || s.width, s.videoHeight || s.naturalHeight || s.height]; },
  draw(g, s, z, ox, oy) { const [w, h] = this.dims(s); if (!w || !h) return; const sc = Math.max(RW / w, RH / h) * z, dw = w * sc, dh = h * sc; g.drawImage(s, (RW - dw) / 2 + ox, (RH - dh) / 2 + oy, dw, dh); },
  // «живое фото»: мягкое покачивание камеры влево-вправо и лёгкое дыхание масштаба, без искажения кадра
  pose(t, i) { if (this.mode !== 'live') return [1, 0, 0]; const ph = i * 1.7; return [1.06 + .016 * Math.sin(t * .23 + ph), Math.sin(t * .31 + ph) * RW * .022, Math.sin(t * .19 + ph * 1.3) * RH * .008]; },
  loop(now) {
    if (!this.run) return; requestAnimationFrame(this.loop);
    const g = this.g, n = this.srcs ? this.srcs.length : 0; if (!n) return;
    const t = (now - this.t0) / 1000, since = (now - this.sw) / 1000, cur = this.srcs[this.idx];
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#120812'; g.fillRect(0, 0, RW, RH);
    if (this.prev !== null && since < .7 && this.srcs[this.prev]) { const p = this.pose(t, this.prev); this.draw(g, this.srcs[this.prev], ...p); g.globalAlpha = since / .7; }
    this.draw(g, cur, ...this.pose(t, this.idx)); g.globalAlpha = 1;
    if (this.mode === 'live') {
      const lx = RW * (.5 + .35 * Math.sin(t * .17)), ly = RH * (.3 + .1 * Math.sin(t * .11)), gr = g.createRadialGradient(lx, ly, 0, lx, ly, RH * .6);
      gr.addColorStop(0, 'rgba(255,236,200,.10)'); gr.addColorStop(1, 'rgba(255,236,200,0)'); g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = gr; g.fillRect(0, 0, RW, RH);
      const lv = Player.level();
      for (const p of this.motes) { p.y -= p.s; p.x += Math.sin(t + p.ph) * .25; if (p.y < -10) { p.y = RH + 10; p.x = Math.random() * RW; } const a = (.18 + .18 * Math.sin(t * 2 + p.ph) + lv * .3) * .7, R = p.R * 3; const m = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, R); m.addColorStop(0, `rgba(255,236,190,${a})`); m.addColorStop(1, 'rgba(255,236,190,0)'); g.fillStyle = m; g.fillRect(p.x - R, p.y - R, R * 2, R * 2); }
      g.restore();
      g.save(); g.globalAlpha = .035; g.globalCompositeOperation = 'overlay'; g.translate(-Math.random() * 128, -Math.random() * 128); g.fillStyle = this.grainPat; g.fillRect(0, 0, RW + 128, RH + 128); g.restore();
    }
    g.strokeStyle = 'rgba(255,236,200,.45)'; g.lineWidth = 1.5; g.strokeRect(24, 24, RW - 48, RH - 48);
  }
};
const Memory = {
  day: null, srcCache: {}, muted: false,
  async sources(day) {
    if (this.srcCache[day.id] && this.srcCache[day.id].n === day.photos.length) return this.srcCache[day.id].s;
    const out = [];
    for (let i = 0; i < day.photos.length; i++) {
      const vb = day.videos && day.videos[i];
      if (vb) { const v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'auto'; v.src = URL.createObjectURL(vb); out.push(v); }
      else out.push(await imgOf(day.photos[i]));
    }
    this.srcCache[day.id] = { n: day.photos.length, s: out }; return out;
  },
  moodAt(i) { const d = this.day; return (d.moods && d.moods[i]) || d.mood || 'calm'; },
  async open(day, startIdx) {
    this.stopAll(); this.day = day;
    show('memory'); $('#memory').scrollTop = 0; $('#memMenu').classList.add('hidden'); $('#moodPop').classList.add('hidden'); this.immerse(false);
    this.render(); const srcs = await this.sources(day); if (this.day !== day) return;
    Live.load(day, srcs, clamp(startIdx !== undefined ? startIdx : (day.main || 0), 0, srcs.length - 1)); this.syncIdx();
    if (day.song && day.song.type === 'lib' && trackById(day.song.id) && !this.muted) Player.play(day.song.id, true);
  },
  render() {
    const day = this.day, y = day.date.slice(0, 4);
    $('#mDay').innerHTML = esc(fmtDay(day.date)).replace(/(\d+)/, '<span class="dnum">$1</span>'); $('#mWeek').textContent = `${fmtWeek(day.date)} · ${y}`;
    const words = day.text.split(/(\s+)/); let pos = 0; $('#mText').innerHTML = words.map(w => { const st = pos; pos += w.length; return /^\s+$/.test(w) ? w : `<span class="w" data-s="${st}">${esc(w)}</span>`; }).join('');
    (this.urls || []).forEach(u => URL.revokeObjectURL(u)); this.urls = day.photos.map(b => URL.createObjectURL(b));
    const n = day.photos.length; $('#phPrev').style.display = $('#phNext').style.display = n > 1 ? '' : 'none';
    $('#mThumbs').innerHTML = n > 1 ? this.urls.map((u, i) => `<button data-i="${i}"><img src="${u}" alt="">${i === (day.main || 0) ? '<span class="star">★</span>' : ''}${day.videos && day.videos[i] ? '<span class="vid">▶</span>' : ''}</button>`).join('') : '';
    $$('#mThumbs button').forEach(b => b.onclick = () => Live.go(+b.dataset.i));
    $('#mCount').innerHTML = n > 1 ? day.photos.map(() => '<i></i>').join('') : '';
    $('#delBtn').textContent = t('delete'); $('#delBtn').dataset.arm = ''; $('#memMore').classList.toggle('hidden', day.owner !== me().uid);
    this.syncBtns();
  },
  syncIdx() {
    const i = Live.idx, mo = MOODS[this.moodAt(i)] || MOODS.calm;
    $$('#mThumbs button').forEach((b, k) => b.classList.toggle('on', k === i)); $$('#mCount i').forEach((b, k) => b.classList.toggle('on', k === i));
    $('#viewer').style.setProperty('--glow', mo.c); $('#mSticker').style.setProperty('--c', mo.c); $('#mSticker').innerHTML = `<i>${mo.e}</i><span>${esc(L3(mo.n))}</span>`;
    const b = $$('#mThumbs button')[i]; if (b) b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (!$('#moodPop').classList.contains('hidden')) this.renderMoodPop();
    this.syncBtns();
  },
  syncBtns() {
    const d = this.day; if (!d) return; const hasSong = d.song && d.song.type === 'lib' && trackById(d.song.id);
    $('#musicBtn').textContent = !hasSong ? t('musicOff') : Player.playing ? t('musicPause') : t('music'); $('#musicBtn').disabled = !hasSong; $('#musicBtn').style.opacity = hasSong ? 1 : .5;
    $('#voiceBtn').textContent = this.speaking ? t('stop') : t('voice');
    $('#artBtn').textContent = Live.mode === 'live' ? t('still') : t('live');
    const isMain = Live.idx === (d.main || 0); $('#mainBtn').textContent = isMain ? t('isMain') : t('makeMain'); $('#mainBtn').disabled = isMain; $('#mainBtn').style.opacity = isMain ? .6 : 1; $('#mainBtn').classList.toggle('hidden', d.photos.length < 2);
    $('#vidBtn').classList.toggle('hidden', !(d.videos && d.videos[Live.idx]));
  },
  renderMoodPop() {
    const cur = this.moodAt(Live.idx);
    $('#moodPop').innerHTML = `<div class="mp-title">${t('moodPhoto')}</div><div class="moods">${MOOD_KEYS.map(k => { const m = MOODS[k]; return `<button type="button" class="mood ${cur === k ? 'on' : ''}" data-pm="${k}" style="--c:${m.c}"><i>${m.e}</i>${esc(L3(m.n))}</button>`; }).join('')}</div>${this.day.photos.length > 1 ? `<button type="button" class="btn ghost small wide" id="moodAll" style="margin-top:10px">${t('forAll')}</button>` : ''}`;
    $$('#moodPop [data-pm]').forEach(b => b.onclick = () => this.setMood(b.dataset.pm, false));
    if ($('#moodAll')) $('#moodAll').onclick = () => this.setMood(this.moodAt(Live.idx), true);
  },
  async setMood(k, all) {
    const d = this.day, n = d.photos.length; d.moods = (d.moods && d.moods.length === n) ? d.moods.slice() : Array(n).fill(d.mood || 'calm');
    if (all) d.moods = Array(n).fill(k); else d.moods[Live.idx] = k;
    d.mood = domMood(d.moods); await DB.put(d); Gallery.dirty = true; this.syncIdx(); if (all) { toast(t('forAllDone')); $('#moodPop').classList.add('hidden'); }
  },
  toggleLive() { Live.mode = Live.mode === 'live' ? 'still' : 'live'; Live.prev = null; Live.syncVideos(); this.syncBtns(); },
  immerse(on) { const m = $('#memory'); on = on === undefined ? !m.classList.contains('immersive') : on; m.classList.toggle('immersive', on); $('#immBtn').textContent = on ? t('exitImmerse') : t('immerse'); },
  async setMain() { const d = this.day; d.main = Live.idx; await DB.put(d); this.render(); this.syncIdx(); Gallery.dirty = true; toast(t('mainSaved')); },
  toggleMusic() { const d = this.day; if (!d.song || d.song.type !== 'lib') return; if (Player.playing) { Player.pause(); this.muted = true; } else { this.muted = false; Player.play(d.song.id); } },
  // видео со звуком: музыка и озвучка ставятся на паузу и продолжаются с того же места
  playVideo() {
    const d = this.day, vb = d.videos && d.videos[Live.idx]; if (!vb) return;
    const wasMusic = Player.playing, wasVoice = this.speaking; if (wasMusic) Player.pause(); if (wasVoice) Narrator.pause();
    const ov = document.createElement('div'); ov.className = 'vplayer'; ov.innerHTML = `<video controls playsinline autoplay></video><button class="x" type="button">✕</button>`;
    const v = $('video', ov); v.src = URL.createObjectURL(vb); document.body.appendChild(ov);
    let resumed = false; const resume = () => { if (resumed) return; resumed = true; if (wasMusic && this.day === d) { this.muted = false; Player.play(d.song.id); } if (wasVoice) Narrator.resume(); };
    const unresume = () => { if (!resumed) return; resumed = false; if (Player.playing) Player.pause(); if (this.speaking) Narrator.pause(); };
    v.onpause = resume; v.onended = resume; v.onplay = unresume;
    $('.x', ov).onclick = () => { v.pause(); resume(); URL.revokeObjectURL(v.src); ov.remove(); };
  },
  speak() {
    if (this.speaking) { Narrator.stop(); this.speaking = false; Player.duck(false); this.clearHl(); this.syncBtns(); return; }
    const d = this.day, spans = $$('#mText .w'), starts = spans.map(s => +s.dataset.s);
    Narrator.speak(d.text, d.voice || defaultVoice(d.mood), {
      onStart: () => { this.speaking = true; Player.duck(true); this.syncBtns(); },
      onWord: ci => { let k = 0; for (let i = 0; i < starts.length; i++) if (starts[i] <= ci) k = i; spans.forEach((s, i) => s.classList.toggle('on', i === k)); },
      onEnd: () => { this.speaking = false; Player.duck(false); this.clearHl(); this.syncBtns(); }
    });
  },
  clearHl() { $$('#mText .w.on').forEach(s => s.classList.remove('on')); },
  stopAll() { Player.stop(); Narrator.stop(); this.speaking = false; this.clearHl(); Live.stop(); },
  close() { const d = this.day; this.stopAll(); this.immerse(false); show('gallery'); Gallery.active = true; if (Gallery.dirty) { Gallery.dirty = false; Gallery.build(App.days); } const it = Gallery.items.find(x => x.kind === 'month' && x.days.some(z => z.id === d.id)); if (it) { Gallery.focus(it, false); Gallery.camZ = Gallery.tZ; Gallery.camX = Gallery.tX; MonthPanel.open(it.y, it.m); } },
  async del(btn) {
    if (!btn.dataset.arm) { btn.dataset.arm = 1; btn.textContent = t('deleteConfirm'); return; }
    const d = this.day; await DB.del(d.id); App.days = App.days.filter(x => x.id !== d.id); Albums.forgetDay(d.id); this.stopAll(); Gallery.build(App.days); show('gallery'); Gallery.active = true;
    const it = Gallery.items.find(x => x.kind === 'month' && x.y === +d.date.slice(0, 4) && x.m === +d.date.slice(5, 7) - 1); if (it) { Gallery.focus(it, false); MonthPanel.open(it.y, it.m); } else Gallery.setLane(Gallery.lane, true);
    toast(t('deleted'));
  },
  bind() {
    $('#closeMem').onclick = () => this.close(); $('#phPrev').onclick = () => Live.go(Live.idx - 1); $('#phNext').onclick = () => Live.go(Live.idx + 1);
    $('#voiceBtn').onclick = () => this.speak(); $('#musicBtn').onclick = () => this.toggleMusic(); $('#artBtn').onclick = () => this.toggleLive(); $('#mainBtn').onclick = () => this.setMain();
    $('#immBtn').onclick = () => this.immerse(); $('#vidBtn').onclick = () => this.playVideo();
    $('#memMore').onclick = () => $('#memMenu').classList.toggle('hidden'); $('#delBtn').onclick = e => this.del(e.currentTarget);
    $('#editBtn').onclick = () => { $('#memMenu').classList.add('hidden'); Composer.open(null, this.day); };
    $('#mSticker').onclick = () => { const p = $('#moodPop'); p.classList.toggle('hidden'); if (!p.classList.contains('hidden')) this.renderMoodPop(); };
    Player.onchange = () => { if (App.screen === 'memory') this.syncBtns(); };
    addEventListener('keydown', e => { if (App.screen !== 'memory' || $('.modal.open') || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return; if (e.key === 'ArrowRight') Live.go(Live.idx + 1); if (e.key === 'ArrowLeft') Live.go(Live.idx - 1); if (e.key === 'Escape') { if ($('#memory').classList.contains('immersive')) this.immerse(false); else this.close(); } });
  }
};

// ===================== Новый день и редактирование =====================
function videoPoster(blob) {
  return new Promise((res, rej) => {
    const v = document.createElement('video'), u = URL.createObjectURL(blob); v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = u;
    const fail = () => { URL.revokeObjectURL(u); rej(new Error(t('badVideo'))); };
    v.onerror = fail; setTimeout(fail, 15000);
    v.onloadeddata = () => { try { v.currentTime = Math.min(.5, (v.duration || 1) / 3); } catch (e) { fail(); } };
    v.onseeked = () => { const c = mk(v.videoWidth, v.videoHeight); c.getContext('2d').drawImage(v, 0, 0); c.naturalWidth = c.width; c.naturalHeight = c.height; URL.revokeObjectURL(u); res(c); };
  });
}
const isVideo = f => !!(f && f.type && f.type.startsWith('video'));
async function createDay(inp, step, existing = []) {
  const st = i => step && step(i);
  st(0); const text = analyzeText(inp.text); if (step) await sleep(300);
  st(1); const imgs = [], photoBlobs = [], media = [], videos = {};
  for (const f of inp.photos.slice(0, 10)) {
    const vid = isVideo(f), im = vid ? await videoPoster(f) : await blobToImage(f), w = im.naturalWidth || im.width, h = im.naturalHeight || im.height, s = Math.min(1, 1400 / Math.max(w, h));
    const c = mk(Math.round(w * s), Math.round(h * s)); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
    if (im.src) URL.revokeObjectURL(im.src); if (vid) videos[imgs.length] = f; media.push(vid ? 'video' : 'image'); imgs.push(c); photoBlobs.push(await canvasToBlob(c, 'image/jpeg', .88));
  }
  const photo = mergePhotos(imgs.map(analyzePhoto)); if (step) await sleep(250);
  st(2); let track = null;
  if (inp.music.mode === 'auto') track = pickTrack(inp.mood, text, photo, inp.date + inp.text);
  else if (inp.music.mode === 'lib') track = trackById(inp.music.id);
  const music = track ? musicFromTrack(track) : musicFromMood(inp.mood), song = track ? { type: 'lib', id: track.id } : { type: 'none' };
  if (step && track) $('#pNote').textContent = t('picked', { n: L3(track.n) });
  if (step) await sleep(350);
  st(3); const M = MOODS[inp.mood] || MOODS.calm;
  const style = buildStyle({ text, photo, music, raw: inp.text, date: inp.date, weather: null, existing, mood: { v: M.v, a: M.a } }); if (step) await sleep(300);
  st(4); const id = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), seed = hashStr(id + inp.text), frames = [];
  for (let i = 0; i < imgs.length; i++) { frames.push(await canvasToBlob(stylize(imgs[i], style, seed + i * 97), 'image/jpeg', .88)); await raf(); }
  st(5);
  const day = { id, owner: inp.owner, date: inp.date, text: inp.text, mood: inp.mood, moods: imgs.map(() => inp.mood), main: clamp(inp.main || 0, 0, frames.length - 1), title: style.title, created: Date.now(), demo: !!inp.demo,
    style, music, musicMode: inp.music.mode, voice: inp.voice || defaultVoice(inp.mood), photo: { brightness: photo.brightness, saturation: photo.saturation, warmth: photo.warmth, count: photo.count, valence: photo.valence, arousal: photo.arousal },
    photos: photoBlobs, media, videos, song, frames };
  await DB.put(day); if (step) await sleep(250); st(6);
  return day;
}
const Composer = {
  photos: [], main: 0, mood: null, mmode: 'auto', track: null, voice: null, editing: null,
  init() {
    $('#cPhotos').onchange = async e => {
      const files = [...e.target.files]; e.target.value = ''; const bad = [];
      for (const f of files) { if (isVideo(f)) { this.photos.push(f); continue; } try { const im = await blobToImage(f); if (im.src) URL.revokeObjectURL(im.src); this.photos.push(f); } catch (err) { bad.push(f.name); } }
      this.renderThumbs(); $('#cErr').textContent = bad.length ? t('badPhotos', { f: bad.join(', ') }) : '';
    };
    $$('#cMusicSeg button').forEach(b => b.onclick = () => { this.mmode = b.dataset.m; if (this.mmode !== 'lib') { Player.stop(); this.previewing = null; } this.renderMusic(); });
    $('#cMic').onclick = () => Dictation.start($('#cText'), $('#cMic'));
    $('#cPxFile').onchange = async e => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; const lbl = $('#cPxLbl'), old = lbl.textContent; lbl.textContent = '…'; try { const tr = await UserTracks.add(f, this.mood ? [this.mood] : null); this.track = tr.id; this.mmode = 'lib'; toast(t('pxAdded', { n: tr.name })); } catch (err) { console.error(err); toast(t('badAudio')); } lbl.textContent = old; this.renderMusic(); };
    $('#cForm').onsubmit = e => { e.preventDefault(); this.submit(); };
  },
  open(date, day) {
    Dictation.stop(); this.editing = day || null; $('#cErr').textContent = '';
    $('#cMediaWrap').classList.toggle('hidden', !!day); $('#cTitleH').textContent = t(day ? 'editTitle' : 'cTitle'); $('#cSave').textContent = t(day ? 'saveChanges' : 'save');
    if (day) { $('#cDate').value = day.date; $('#cText').value = day.text; this.mood = day.mood; this.voice = { ...(day.voice || defaultVoice(day.mood)) }; this.mmode = day.song && day.song.type === 'lib' ? (day.musicMode === 'auto' ? 'auto' : 'lib') : 'none'; this.track = day.song && day.song.id || null; }
    else { $('#cDate').value = date || todayISO(); if (this.wasEditing) { $('#cText').value = ''; this.mood = null; this.voice = null; this.track = null; this.mmode = 'auto'; } }
    this.wasEditing = !!day;
    this.renderThumbs(); this.renderMoods(); this.renderMusic(); this.renderVoice(); $('#cMic').innerHTML = t('dictate'); openModal('composer'); $('#composer').scrollTop = 0;
  },
  voiceSel() { return this.voice || defaultVoice(this.mood || 'calm'); },
  renderVoice() { const sel = { ...this.voiceSel() }, box = $('#cVoice'); box.innerHTML = voicePickerHTML(sel); bindVoicePicker(box, sel, () => { this.voice = sel; this.renderVoice(); }); },
  renderThumbs() {
    const box = $('#cThumbs'); (this.turls || []).forEach(u => URL.revokeObjectURL(u)); this.turls = this.photos.map(f => URL.createObjectURL(f)); this.main = Math.min(this.main, Math.max(0, this.photos.length - 1));
    box.innerHTML = this.turls.map((u, i) => `<div class="th ${i === this.main ? 'main' : ''}" data-i="${i}">${isVideo(this.photos[i]) ? `<video src="${u}" muted playsinline preload="metadata"></video><span class="vid">▶</span>` : `<img src="${u}" alt="">`}${i === this.main ? '<span class="st">★</span>' : ''}<button type="button" class="rm" data-rm="${i}">✕</button></div>`).join('');
    $$('.th', box).forEach(el => el.onclick = e => { if (e.target.dataset.rm !== undefined) { this.photos.splice(+e.target.dataset.rm, 1); if (this.main >= this.photos.length) this.main = 0; } else this.main = +el.dataset.i; this.renderThumbs(); });
    $('#cMainHint').classList.toggle('hidden', this.photos.length < 2);
  },
  renderMoods() { $('#cMoods').innerHTML = MOOD_KEYS.map(k => { const m = MOODS[k]; return `<button type="button" class="mood ${this.mood === k ? 'on' : ''}" data-m="${k}" style="--c:${m.c}"><i>${m.e}</i>${esc(L3(m.n))}</button>`; }).join(''); $$('#cMoods .mood').forEach(b => b.onclick = () => { this.mood = b.dataset.m; this.renderMoods(); if (!this.voice) this.renderVoice(); this.renderMusic(); }); },
  renderMusic() {
    $$('#cMusicSeg button').forEach(b => b.classList.toggle('on', b.dataset.m === this.mmode));
    $('#cMusicNote').textContent = t(this.mmode === 'none' ? 'noteNone' : this.mmode === 'auto' ? 'noteAuto' : 'noteLib');
    $('#cLib').classList.toggle('hidden', this.mmode !== 'lib'); $('#cPxOpen').href = 'https://pixabay.com/music/search/' + encodeURIComponent(({ joy: 'happy', calm: 'calm', love: 'romantic', inspired: 'inspiring', nostalgic: 'nostalgic', sad: 'sad', tired: 'lofi', angry: 'epic' })[this.mood] || 'relaxing') + '/';
    if (this.mmode !== 'lib') return; const box = $('#cTracks');
    box.innerHTML = allTracks().map(tr => { const pl = this.previewing === tr.id && Player.playing; return `<div class="track ${this.track === tr.id ? 'on' : ''}" data-id="${tr.id}"><button type="button" class="pv ${pl ? 'playing' : ''}" data-pv="${tr.id}">${pl ? '❚❚' : '▶'}</button><div><b>${esc(L3(tr.n))}</b><small>${tr.user ? 'Pixabay · ' : ''}${tr.bpm} BPM</small></div><span class="tg">${tr.tags.map(m => MOODS[m] ? MOODS[m].e : '').join('')}</span>${tr.user ? `<button type="button" class="pv" data-tdel="${tr.id}" title="delete">🗑</button>` : ''}</div>`; }).join('');
    $$('.track', box).forEach(el => el.onclick = async e => {
      const del = e.target.closest('[data-tdel]'); if (del) { await UserTracks.del(del.dataset.tdel); if (this.track === del.dataset.tdel) this.track = null; this.renderMusic(); return; }
      const pv = e.target.closest('[data-pv]'); if (pv) { const id = pv.dataset.pv; if (this.previewing === id && Player.playing) { Player.stop(); this.previewing = null; } else { this.previewing = id; pv.textContent = '…'; Player.play(id, true).then(() => this.renderMusic()); } this.renderMusic(); return; }
      this.track = el.dataset.id; this.renderMusic();
    });
  },
  async submit() {
    const text = $('#cText').value.trim(), date = $('#cDate').value || todayISO(), err = $('#cErr'); Dictation.stop();
    if (text.length < 10) { err.textContent = t('errText'); return; }
    if (!this.editing && !this.photos.length) { err.textContent = t('errPhotos'); return; }
    if (!this.mood) { err.textContent = t('errMood'); return; }
    if (this.mmode === 'lib' && !this.track) { err.textContent = t('errTrack'); return; }
    err.textContent = ''; getAC(); Player.stop(); this.previewing = null; Narrator.stop();
    if (this.editing) return this.saveEdit(text, date);
    closeModal('composer');
    $('#pNote').textContent = ''; $('#pSteps').innerHTML = t('pSteps').map(s => `<li>${s}</li>`).join(''); openModal('progress');
    const step = i => $$('#pSteps li').forEach((l, k) => l.className = k < i ? 'done' : k === i ? 'on' : '');
    try {
      const day = await createDay({ owner: me().uid, date, text, photos: this.photos, main: this.main, mood: this.mood, voice: this.voiceSel(), music: { mode: this.mmode, id: this.track } }, step, App.days.map(d => d.title));
      await sleep(600); closeModal('progress');
      App.days.push(day); App.sortDays(); Gallery.build(App.days);
      const it = Gallery.items.find(x => x.kind === 'month' && x.days.some(z => z.id === day.id)); if (it) { Gallery.focus(it, false); Gallery.camZ = Gallery.tZ; Gallery.camX = Gallery.tX; }
      $('#cText').value = ''; this.photos = []; this.main = 0; this.mood = null; this.voice = null; this.renderThumbs();
      Memory.open(day);
    } catch (e) { console.error(e); closeModal('progress'); openModal('composer'); err.textContent = t('failDay', { e: e instanceof Error ? e.message : String(e) }); }
  },
  async saveEdit(text, date) {
    const d = this.editing, moodChanged = d.mood !== this.mood;
    d.date = date; d.text = text; if (moodChanged) { d.mood = this.mood; d.moods = (d.photos || []).map(() => this.mood); }
    let track = null; if (this.mmode === 'auto') track = (d.musicMode === 'auto' && !moodChanged && d.song && trackById(d.song.id)) || pickTrack(this.mood, analyzeText(text), d.photo && d.photo.valence !== undefined ? d.photo : { valence: 0, arousal: .5 }, date + text);
    else if (this.mmode === 'lib') track = trackById(this.track);
    d.song = track ? { type: 'lib', id: track.id } : { type: 'none' }; d.music = track ? musicFromTrack(track) : musicFromMood(this.mood); d.musicMode = this.mmode; d.voice = { ...this.voiceSel() };
    await DB.put(d); App.sortDays(); Gallery.build(App.days); closeModal('composer'); toast(t('saved')); Memory.open(d);
  }
};

// ===================== Поиск =====================
const Search = {
  init() {
    const inp = $('#search'), res = $('#results');
    inp.addEventListener('focus', () => inp.value && this.render(inp.value)); inp.addEventListener('input', () => this.render(inp.value));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { const f = $('.res', res); if (f) f.click(); } if (e.key === 'Escape') { inp.blur(); res.classList.remove('open'); } });
    document.addEventListener('pointerdown', e => { if (!e.target.closest('.search')) res.classList.remove('open'); });
  },
  index(d) { const dt = parseDate(d.date), mo = MOODS[d.mood] || MOODS.calm; return [d.text, fmtDay(d.date), fmtWeek(d.date), CAL[LANG].months[dt.getMonth()], dt.getFullYear(), d.date, `${String(dt.getDate()).padStart(2, '0')}.${String(dt.getMonth() + 1).padStart(2, '0')}.${dt.getFullYear()}`, L3(mo.n)].join(' ').toLowerCase().replace(/ё/g, 'е'); },
  render(q) {
    const res = $('#results'), toks = q.toLowerCase().replace(/ё/g, 'е').split(/\s+/).filter(Boolean); if (!toks.length) { res.classList.remove('open'); return; }
    const list = App.days.filter(d => { const s = this.index(d); return toks.every(x => s.includes(x)); }).reverse();
    res.innerHTML = list.length ? list.map(d => `<div class="res" data-id="${d.id}"><img src="${coverURL(d)}" alt=""><div><b>${fmtDay(d.date)} ${d.date.slice(0, 4)}</b><span>${(MOODS[d.mood] || MOODS.calm).e} ${esc(d.text.slice(0, 60))}…</span></div></div>`).join('') : `<div class="res-empty">${t('noResults')}</div>`;
    res.classList.add('open');
    $$('.res', res).forEach(el => el.onclick = () => { res.classList.remove('open'); $('#search').blur(); const d = App.days.find(x => x.id === el.dataset.id); diveFrom($('img', el), () => Memory.open(d)); });
  }
};

// ===================== Настройки =====================
const Settings = {
  open() { this.render(); $('#settings').classList.add('open'); },
  close() { $('#settings').classList.remove('open'); Narrator.stop(); },
  render() {
    const u = me(); if (!u) return; const g = (u.avatar || {}).gender || 'female';
    const vs = Narrator.list(true);
    $('#sPanel').innerHTML = `<button class="x" id="sX">✕</button><h3>${t('settings')}</h3>
      <div class="s-me">${u.thumb ? `<img src="${u.thumb}" alt="">` : '<img alt="">'}<div><small>${t('signedAs')}</small><b>${esc(u.name)}</b><small>${esc(u.email)} · ${u.provider === 'apple' ? 'Apple' : 'Google'}</small></div></div>
      <div class="s-sec"><h4>${t('sLang')}</h4><div class="flagrow">${LANGS.map(l => `<button class="flagbtn ${LANG === l.id ? 'on' : ''}" data-l="${l.id}">${FLAGS[l.id]}${l.name}</button>`).join('')}</div></div>
      <div class="s-sec"><h4>${t('sGender')}</h4><div class="seg"><button data-g="female" class="${g === 'female' ? 'on' : ''}">${t('female')}</button><button data-g="male" class="${g === 'male' ? 'on' : ''}">${t('male')}</button></div>
        <button class="btn ghost wide" id="sAvatar" style="margin-top:10px">✎ ${t('sAvatar')}</button></div>
      <div class="s-sec"><h4>${t('sName')}</h4><div class="row" style="flex-wrap:nowrap"><input type="text" id="sName" maxlength="24" value="${esc(u.name)}"><button class="btn ghost" id="sNameSave">${t('saveName')}</button></div></div>
      <div class="s-sec"><h4>${t('studio')}</h4><div id="sVoicePick"></div><textarea id="sStudioText" style="min-height:90px;margin-top:10px" placeholder="${esc(t('studioPh'))}">${esc(VOICE_SAMPLE[LANG] || '')}</textarea>
        <div class="row" style="margin-top:8px"><button class="btn primary small" id="sSpeak">${t('speakBtn')}</button><button class="btn ghost small" id="sStop">${t('stop')}</button></div>
        <label class="f">${t('ttsUrl')}</label><input type="text" id="sTts" placeholder="https://…/tts" value="${esc(Narrator.ttsUrl())}"><p class="note" style="margin-top:6px">${t('ttsHint')}</p></div>
      ${App.days.some(d => d.demo) ? `<div class="s-sec"><button class="btn ghost small" id="sDemo">${t('sDemo')}</button></div>` : ''}
      <div class="s-sec" style="display:grid;gap:8px"><button class="btn ghost wide" id="sSwitch">⇄ ${t('switchAcc')}</button><button class="btn danger wide" id="sLogout">${t('logout')}</button><p class="note">${t('sAbout')}</p></div>`;
    $('#sX').onclick = () => this.close();
    $$('#sPanel .flagbtn').forEach(b => b.onclick = () => { setLang(b.dataset.l); App.relocalize(); this.render(); });
    $$('#sPanel [data-g]').forEach(b => b.onclick = () => { const cfg = { ...(u.avatar || avDefault(b.dataset.g)), gender: b.dataset.g }; let thumb = u.thumb; try { if (Stage.ok) thumb = Thumbs.shot(cfg, 'head', .3); } catch (e) { } saveMe({ avatar: cfg, thumb }); if (App.screen === 'home' && Stage.ok) Stage.setAvatar(cfg); this.render(); });
    $('#sAvatar').onclick = () => { this.close(); Narrator.stop(); Player.stop(); Live.stop(); Builder.open({ cfg: u.avatar, editing: true }); };
    $('#sNameSave').onclick = () => { const v = $('#sName').value.trim(); if (v.length < 2) { toast(t('errName')); return; } saveMe({ name: v }); $('#hName').textContent = v; toast(t('nameSaved')); this.render(); };
    const vsel = this.vsel = this.vsel || { c: 'dreamy', m: 'soft' }; const drawV = () => { const box = $('#sVoicePick'); box.innerHTML = voicePickerHTML(vsel); bindVoicePicker(box, vsel, drawV); }; drawV();
    $('#sSpeak').onclick = () => { const txt = $('#sStudioText').value.trim(); if (txt) Narrator.speak(txt, vsel); };
    $('#sStop').onclick = () => Narrator.stop();
    $('#sTts').onchange = e => { try { localStorage.setItem('dml.tts', e.target.value.trim()); } catch (err) { } toast(t('saved')); };
    if ($('#sDemo')) $('#sDemo').onclick = async () => { for (const d of App.days.filter(x => x.demo)) await DB.del(d.id); App.days = App.days.filter(x => !x.demo); if (App.screen === 'gallery') Gallery.build(App.days); if (App.screen === 'memory' && Memory.day && Memory.day.demo) Memory.close(); toast(t('demoRemoved')); this.render(); };
    $('#sSwitch').onclick = () => { this.close(); App.signOut(); AuthUI.open(); AuthUI.form('login', 'google'); };
    $('#sLogout').onclick = () => { this.close(); App.signOut(); Lang.open(); };
  }
};

// ===================== Демо-дни (свои фото-сцены и мелодии, без чужого контента) =====================
const DEMO = [
  { date: '2025-10-12', scene: 'park', mood: 'calm', track: 'warm-palms', main: 0, text: {
    ru: 'Гуляли с Аней по парку, всё вокруг в жёлтых листьях, они шуршали под ногами. Было холодно, пальцы мёрзли, но мы купили какао в маленьком киоске и долго разговаривали обо всём на свете. Солнце пробивалось сквозь деревья, и на душе было очень спокойно и тепло.',
    en: 'Walked through the park with Anya; everything around was covered in yellow leaves rustling under our feet. It was cold and our fingers were freezing, but we bought cocoa at a tiny kiosk and talked for ages about everything. The sun broke through the trees, and I felt so calm and warm inside.',
    kk: 'Анямен саябақта серуендедік, айнала сап-сары жапырақ, аяқ астында сыбдырлап жатты. Күн суық, саусақтарымыз тоңды, бірақ кішкентай дүңгіршектен какао алып, дүниенің бәрі туралы ұзақ сөйлестік. Күн сәулесі ағаштардың арасынан түсіп, жаным тып-тыныш әрі жылы болды.' } },
  { date: '2025-10-26', scene: 'park', mood: 'joy', track: 'sunrise-run', main: 1, seed: 7, text: {
    ru: 'Утром бегали с Мадиной по парку. Листья шуршали под кроссовками, солнце светило прямо в глаза, а мы смеялись и обгоняли друг друга. Потом пили горячий чай на скамейке и строили планы на зиму!',
    en: 'This morning Madina and I went running in the park. Leaves crunched under our sneakers, the sun shone right into our eyes, and we laughed and kept overtaking each other. Afterwards we drank hot tea on a bench and made plans for the winter!',
    kk: 'Таңертең Мадина екеуміз саябақта жүгірдік. Кроссовка астында жапырақтар сыбдырлап, күн көзге тура түсті, біз күліп, бірімізді біріміз озып жүгірдік. Сосын орындықта ыстық шай ішіп, қысқа жоспар құрдық!' } },
  { date: '2025-12-30', scene: 'home', mood: 'nostalgic', track: 'grandma-record', main: 0, text: {
    ru: 'Вечером приехали к бабушке домой. За окном шёл снег, на кухне пахло мандаринами и пирогом. Пили чай, бабушка достала старый фотоальбом, и мы до ночи смотрели детские фотографии родителей и смеялись. Было уютно и чуть-чуть грустно, что всё это было так давно.',
    en: 'In the evening we went to Grandma’s. Snow was falling outside the window, and the kitchen smelled of tangerines and pie. We drank tea, Grandma brought out an old photo album, and we looked at our parents’ childhood photos until midnight, laughing. It felt cozy and just a little sad that all of it was so long ago.',
    kk: 'Кешке әжемнің үйіне бардық. Терезе сыртында қар жауып тұрды, ас үйден мандарин мен бәліштің иісі шықты. Шай іштік, әжем ескі фотоальбомды шығарды, біз түн ортасына дейін ата-анамыздың балалық суреттерін қарап, күлдік. Жайлы болды, әрі мұның бәрі сонау ертеде болғанына сәл мұңайдым.' } },
  { date: '2025-12-31', scene: 'party', mood: 'love', track: 'music-box', main: 2, seed: 9, text: {
    ru: 'Канун Нового года. Вся семья собралась за большим столом, на ёлке мигали огоньки, а за окном взрывался салют. Мы загадывали желания под бой курантов и обнимались. Шумный, счастливый и очень тёплый вечер.',
    en: 'New Year’s Eve. The whole family gathered around a big table, lights twinkled on the tree, and fireworks burst outside the window. We made wishes as the clock struck midnight and hugged each other. A loud, happy and very warm evening.',
    kk: 'Жаңа жыл қарсаңы. Бүкіл отбасы үлкен дастарқан басына жиналды, шыршада шамдар жыпылықтап, терезе сыртында салют атылды. Сағат тілі он екіні соққанда тілек тілеп, құшақтастық. Шулы, бақытты әрі өте жылы кеш.' } },
  { date: '2026-03-14', scene: 'office', mood: 'tired', track: 'four-am', main: 0, text: {
    ru: 'Ночь в офисе перед сдачей проекта. Сидели с командой до четырёх утра, кофе уже не помогал, в наушниках долбила электроника. Баги вылезали один за другим, нервы на пределе, но в шесть утра мы нажали кнопку деплоя, и всё заработало.',
    en: 'A night at the office before the project deadline. The team and I sat there until four in the morning; coffee had stopped helping, electronic music pounded in our headphones. Bugs popped up one after another, nerves were on edge, but at six in the morning we pressed the deploy button, and everything worked.',
    kk: 'Жобаны тапсырар алдындағы кеңседегі түн. Командамен таңғы төртке дейін отырдық, кофе де көмектеспей қалды, құлаққапта электронды музыка соғып тұрды. Қателер бірінен соң бірі шықты, жүйке шегіне жетті, бірақ таңғы алтыда деплой түймесін бастық — бәрі жұмыс істеді.' } },
  { date: '2026-05-23', scene: 'party', mood: 'joy', track: 'blow-candles', main: 0, text: {
    ru: 'Мой день рождения! Друзья устроили сюрприз: шарики по всей квартире, огромный торт и музыка на полную громкость. Мы танцевали до упаду, смеялись, кричали и фоткались. Самый счастливый и шумный день за весь год!',
    en: 'My birthday! My friends threw me a surprise: balloons all over the apartment, a huge cake and music at full volume. We danced until we dropped, laughed, shouted and took photos. The happiest and loudest day of the whole year!',
    kk: 'Менің туған күнім! Достарым тосынсый жасады: бүкіл пәтер толы шарлар, үлкен торт және қатты қойылған музыка. Шаршағанша биледік, күлдік, айқайладық, суретке түстік. Жыл бойғы ең бақытты әрі ең шулы күн!' } },
  { date: '2026-07-19', scene: 'lake', mood: 'calm', track: 'fog-water', main: 1, text: {
    ru: 'Встала в пять утра и одна поехала на озеро. Над водой стоял туман, было совсем тихо, только птицы и камыши. Смотрела, как медленно поднимается солнце, и ни о чём не думала. Рассвет, тёплый чай из термоса и тишина.',
    en: 'I got up at five and drove to the lake alone. Mist hung over the water, it was completely quiet — only birds and reeds. I watched the sun rise slowly and thought about nothing at all. Dawn, warm tea from a thermos, and silence.',
    kk: 'Таңғы бесте тұрып, көлге жалғыз бардым. Су үстінде тұман тұрды, айнала тым-тырыс — тек құстар мен қамыстар. Күннің баяу көтерілгеніне қарап, ештеңе ойламадым. Таң шапағы, термостағы жылы шай және тыныштық.' } },
  { date: '2026-09-02', scene: 'rain', mood: 'sad', track: 'rain-glass', main: 0, text: {
    ru: 'Весь день шёл дождь. Сидела одна у окна, смотрела, как капли стекают по стеклу, и скучала по дому. Город серый, люди под зонтами куда-то спешат. Включила грустную песню на повтор и так и просидела до вечера.',
    en: 'It rained all day. I sat alone by the window, watching the drops run down the glass, and missed home. The city was gray, people under umbrellas hurried somewhere. I put a sad song on repeat and sat like that until evening.',
    kk: 'Күні бойы жаңбыр жауды. Терезенің жанында жалғыз отырып, әйнектен аққан тамшыларға қарап, үйімді сағындым. Қала сұрғылт, қолшатыр астындағы адамдар бір жаққа асығады. Мұңды әнді қайталап қойып, кешке дейін солай отырдым.' } },
  { date: '2026-09-20', scene: 'lake', mood: 'inspired', track: 'steppe-wind', main: 2, seed: 5, text: {
    ru: 'Поехали с друзьями в степь к озеру. Бесконечное небо, ветер в волосах и запах полыни. Включили домбру, пели песни у воды и смотрели, как солнце садится за холмы. Хочется рисовать, писать и жить на полную!',
    en: 'Drove out to the steppe lake with friends. Endless sky, wind in our hair and the smell of wormwood. We played dombra music, sang songs by the water and watched the sun set behind the hills. I want to draw, write and live to the fullest!',
    kk: 'Достарыммен далаға, көлге бардық. Шексіз аспан, шашты желпіген жел және жусанның иісі. Домбыра тартып, су жағасында ән салдық, күннің төбелердің артына батқанын тамашаладық. Сурет салғым, жазғым және өмірді толық сүргім келеді!' } }
];
async function seedDemo(owner, onProgress) {
  const days = [];
  for (let i = 0; i < DEMO.length; i++) {
    const s = DEMO[i]; onProgress && onProgress(i + 1, DEMO.length);
    const photos = []; for (const v of [0, 1, 2]) photos.push(await canvasToBlob(scene(s.scene, v, 100 + i * 10 + v + (s.seed || 0) * 31), 'image/jpeg', .88));
    const day = await createDay({ owner, date: s.date, text: s.text[LANG] || s.text.ru, photos, main: s.main, mood: s.mood, music: { mode: 'lib', id: s.track }, demo: true }, null, days.map(d => d.title));
    days.push(day); await raf();
  }
  return days;
}

// ===================== Приложение =====================
const App = {
  days: [], user: null, screen: null,
  sortDays() { this.days.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.created - b.created); },
  async ensureThree() {
    if (window.THREE) return true;
    await new Promise(res => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js'; s.onload = res; s.onerror = res; document.head.appendChild(s); setTimeout(res, 9000); });
    return !!window.THREE;
  },
  async init() {
    LANG = Store.get('dml.lang', 'ru'); if (!I18N[LANG]) LANG = 'ru'; applyI18n(); Cosmos.init(); initHalos();
    Live.init(); Dust.init(); Composer.init(); Search.init(); Gallery.bind(); Memory.bind(); AuthUI.bind(); Builder.bind();
    Brain.init($('#brain')); Brain.onEnter = () => this.enterArchive();
    $('#archiveLabel').onclick = () => this.enterArchive(); $('#brainBack').onclick = () => Home.open();
    $('#addBtn').onclick = () => Composer.open();
    $('#gear').onclick = () => Settings.open(); $('#albumsBtn').onclick = () => Albums.open(); $('#albums').addEventListener('click', e => { if (e.target.id === 'albums') Albums.close(); }); $('#settings').addEventListener('click', e => { if (e.target.id === 'settings') Settings.close(); });
    if ('speechSynthesis' in window) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => { if ($('#settings').classList.contains('open')) Settings.render(); }; }
    const loop = () => { if (Gallery.active) Gallery.tick(); requestAnimationFrame(loop); }; requestAnimationFrame(loop);
    this.dbReady = DB.open();
    if (await this.ensureThree()) Stage.init();
    const s = Auth.session();
    if (s) { const acc = Auth.get(s.uid); this.signIn(acc, false, true); } else Lang.open();
  },
  signIn(acc, isNew, resumed) {
    this.user = acc; Auth.start(acc.uid); saveMe({ last: Date.now(), lang: resumed ? (acc.lang || LANG) : LANG });
    if (resumed && acc.lang && acc.lang !== LANG) { LANG = acc.lang; Store.set('dml.lang', LANG); } applyI18n();
    this.days = []; this.daysLoaded = null;
    if (!acc.avatar) Builder.open({ cfg: avDefault('female'), askGender: true }); else Home.open();
  },
  signOut() { Narrator.stop(); Player.stop(); Live.stop(); Auth.end(); this.user = null; this.days = []; this.daysLoaded = null; },
  ensureDays() {
    if (this.daysLoaded) return this.daysLoaded;
    const uid = me().uid;
    this.daysLoaded = (async () => {
      await this.dbReady; await UserTracks.load(); let days = (await DB.all()).filter(d => d.owner === uid && d.frames && d.frames.length);
      if (!days.length && !me().demoSeeded) {
        try { days = await seedDemo(uid, (i, n) => { if (App.screen === 'intro') $('#archiveSub').textContent = t('gathering', { i, n }); }); saveMe({ demoSeeded: true }); } catch (e) { console.error(e); }
      }
      if (me() && me().uid === uid) { this.days = days; this.sortDays(); }
      if (App.screen === 'intro') $('#archiveSub').textContent = t('brainHint');
      return days;
    })();
    return this.daysLoaded;
  },
  async enterArchive() {
    if (this.entering) return; this.entering = true; getAC();
    await this.ensureDays();
    Brain.zoomIn(() => {
      Gallery.build(this.days); Gallery.setLane(Gallery.lanes.length - 1, true); Gallery.camZ = -1400; Gallery.camX = Gallery.tX; Gallery.active = true; show('gallery'); Gallery.active = true;
      $('#hint').style.opacity = 1; setTimeout(() => $('#hint').style.opacity = 0, 9000); this.entering = false;
    });
  },
  relocalize() {
    applyI18n();
    if (this.screen === 'gallery') { const lane = Gallery.lane; Gallery.build(this.days); Gallery.lane = lane; Gallery._lane = -1; Gallery._where = null; }
    if (this.screen === 'memory') { Memory.render(); Memory.syncIdx(); } if (this.screen === 'builder') { Builder.renderTabs(); Builder.renderOpts(true); $('#bDone').textContent = t('done'); }
    if (this.screen === 'intro') $('#archiveSub').textContent = this.days.length ? t('brainHint') : '';
    if ($('#monthPanel').classList.contains('open')) MonthPanel.open(MonthPanel.y, MonthPanel.m);
  }
};
App.init();

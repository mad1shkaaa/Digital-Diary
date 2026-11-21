
// ===================== Аватар: 3D-персонаж до пупка, процедурные варианты =====================
const N3 = (ru, en, kk) => ({ ru, en, kk });
const AV = {
  SKIN: ['#fbe4d5', '#f6d3bb', '#efc3a2', '#e3ab8b', '#d49b73', '#c38559', '#a96f46', '#8e5a37', '#6f4429', '#4f301d'],
  HAIRC: ['#1c1a22', '#3a2620', '#6a4028', '#a2532c', '#cf6a2f', '#9c7a54', '#d9ad62', '#eee2c4', '#bdbcc8', '#e99bc2', '#a993e6', '#4f63c9'],
  EYEC: ['#3b2516', '#6b4226', '#957238', '#4f7a3a', '#3f8a84', '#4a76b8', '#7d9bd0', '#7b6aa8', '#5b5d66', '#17151c'],
  CLOTHC: ['#f1eef7', '#2a2733', '#60688d', '#848dc5', '#3d428b', '#5a5b9f', '#7d5ba6', '#c8a2d8', '#e8b4c8', '#c95b5b', '#e0a84f', '#5f9e7a'],
  HAIRS: [
    ['short', N3('Короткая', 'Short crop', 'Қысқа')], ['buzz', N3('Ёжик', 'Buzz cut', 'Кірпі')], ['sidepart', N3('Пробор', 'Side part', 'Бүйір фарқ')], ['quiff', N3('Квифф', 'Quiff', 'Квифф')],
    ['curlyShort', N3('Кудряшки', 'Short curls', 'Қысқа бұйра')], ['spiky', N3('Шипы', 'Spiky', 'Тікенек')], ['afro', N3('Афро', 'Afro', 'Афро')], ['pixie', N3('Пикси', 'Pixie', 'Пикси')],
    ['bob', N3('Каре', 'Bob', 'Каре')], ['long', N3('Длинные', 'Long', 'Ұзын')], ['longBangs', N3('С чёлкой', 'With bangs', 'Кекілді')], ['wavy', N3('Волны', 'Wavy', 'Толқынды')],
    ['curlyLong', N3('Локоны', 'Long curls', 'Ұзын бұйра')], ['ponyHigh', N3('Высокий хвост', 'High ponytail', 'Биік құйрық')], ['ponyLow', N3('Низкий хвост', 'Low ponytail', 'Төмен құйрық')],
    ['pigtails', N3('Хвостики', 'Pigtails', 'Қос құйрық')], ['braid', N3('Коса', 'Braid', 'Бұрым')], ['twoBraids', N3('Две косы', 'Two braids', 'Қос бұрым')], ['bunTop', N3('Пучок', 'Top bun', 'Түйін')],
    ['spaceBuns', N3('Два пучка', 'Space buns', 'Қос түйін')], ['manBun', N3('Мужской пучок', 'Man bun', 'Ер түйін')], ['dreads', N3('Дреды', 'Dreadlocks', 'Дредтер')], ['wolf', N3('Вулф-кат', 'Wolf cut', 'Вулф-кат')],
    ['bald', N3('Без волос', 'Bald', 'Шашсыз')]
  ],
  EYES: [['round', N3('Круглые', 'Round', 'Дөңгелек')], ['almond', N3('Миндаль', 'Almond', 'Бадам')], ['big', N3('Аниме', 'Anime', 'Аниме')], ['cat', N3('Кошачьи', 'Cat', 'Мысық')],
    ['puppy', N3('Щенячьи', 'Puppy', 'Күшік')], ['sleepy', N3('Сонные', 'Sleepy', 'Ұйқылы')], ['monolid', N3('Узкие', 'Monolid', 'Қысық')], ['happy', N3('Улыбка', 'Smiling', 'Күлімдеген')]],
  BROWS: [['straight', N3('Прямые', 'Straight', 'Түзу')], ['arched', N3('Дугой', 'Arched', 'Доға')], ['soft', N3('Мягкие', 'Soft', 'Жұмсақ')], ['angled', N3('С изломом', 'Angled', 'Сынық')],
    ['rounded', N3('Округлые', 'Rounded', 'Дөңес')], ['flat', N3('Короткие', 'Short', 'Қысқа')], ['rising', N3('Вразлёт', 'Rising', 'Көтеріңкі')]],
  FACES: [['oval', N3('Овал', 'Oval', 'Сопақ')], ['round', N3('Круглое', 'Round', 'Дөңгелек')], ['square', N3('Квадрат', 'Square', 'Шаршы')], ['heart', N3('Сердце', 'Heart', 'Жүрек')],
    ['long', N3('Вытянутое', 'Long', 'Ұзынша')], ['diamond', N3('Ромб', 'Diamond', 'Ромб')]],
  CLOTHES: [['tee', N3('Футболка', 'T-shirt', 'Футболка')], ['stripes', N3('Полоска', 'Stripes', 'Жолақты')], ['vneck', N3('V-вырез', 'V-neck', 'V-ойық')], ['shirt', N3('Рубашка', 'Shirt', 'Жейде')],
    ['polo', N3('Поло', 'Polo', 'Поло')], ['sweater', N3('Свитер', 'Sweater', 'Свитер')], ['turtleneck', N3('Водолазка', 'Turtleneck', 'Водолазка')], ['hoodie', N3('Худи', 'Hoodie', 'Худи')],
    ['jacket', N3('Пиджак', 'Blazer', 'Пиджак')], ['denim', N3('Джинсовка', 'Denim jacket', 'Джинс күрте')], ['varsity', N3('Бомбер', 'Varsity', 'Бомбер')], ['kamzol', N3('Камзол', 'Kamzol vest', 'Камзол')],
    ['overalls', N3('Комбинезон', 'Overalls', 'Комбинезон')], ['tank', N3('Майка', 'Tank top', 'Майка')], ['top', N3('Топ', 'Cami top', 'Топ')], ['blouse', N3('Блузка', 'Blouse', 'Блузка')]],
  GLASSES: [['none'], ['round', N3('Круглые', 'Round', 'Дөңгелек')], ['square', N3('Квадратные', 'Square', 'Төртбұрыш')], ['cateye', N3('Кошачий глаз', 'Cat-eye', 'Мысық көз')],
    ['sun', N3('Солнечные', 'Sunglasses', 'Күн көзілдірігі')], ['aviator', N3('Авиаторы', 'Aviators', 'Авиатор')]],
  EARRINGS: [['none'], ['studs', N3('Гвоздики', 'Studs', 'Шегесырға')], ['hoops', N3('Кольца', 'Hoops', 'Шеңбер')], ['drops', N3('Подвески', 'Drops', 'Салпыншақ')], ['pearls', N3('Жемчуг', 'Pearls', 'Інжу')], ['syrga', N3('Сырга', 'Syrga', 'Сырға')]],
  HATS: [['none'], ['beanie', N3('Шапка', 'Beanie', 'Бөрік')], ['cap', N3('Кепка', 'Cap', 'Кепка')], ['beret', N3('Берет', 'Beret', 'Берет')], ['bucket', N3('Панама', 'Bucket hat', 'Панама')],
    ['headband', N3('Ободок', 'Headband', 'Шаш таңғыш')], ['bow', N3('Бантик', 'Bow', 'Бантик')], ['crown', N3('Венок', 'Flower crown', 'Гүл тәж')], ['headphones', N3('Наушники', 'Headphones', 'Құлаққап')], ['takiya', N3('Тюбетейка', 'Takiya', 'Тақия')]],
  NECKS: [['none'], ['necklace', N3('Цепочка', 'Necklace', 'Алқа')], ['choker', N3('Чокер', 'Choker', 'Чокер')], ['scarf', N3('Шарф', 'Scarf', 'Шарф')], ['bowtie', N3('Бабочка', 'Bow tie', 'Көбелек')], ['tie', N3('Галстук', 'Tie', 'Галстук')]],
  DETAILS: [['none'], ['freckles', N3('Веснушки', 'Freckles', 'Сепкіл')], ['blush', N3('Румянец', 'Blush', 'Ұялған бет')], ['mole', N3('Родинка', 'Beauty mark', 'Мең')], ['stars', N3('Звёздочки', 'Stars', 'Жұлдызшалар')]]
};
const avDefault = g => g === 'male'
  ? { gender: 'male', hair: 'short', hairColor: 1, eyes: 'almond', eyeSize: 1, eyeColor: 1, brows: 'straight', browThick: 2, face: 'square', skin: 3, clothes: 'hoodie', clothesColor: 3, glasses: 'none', earrings: 'none', hat: 'none', neck: 'none', details: 'none' }
  : { gender: 'female', hair: 'long', hairColor: 2, eyes: 'round', eyeSize: 1, eyeColor: 4, brows: 'soft', browThick: 1, face: 'oval', skin: 1, clothes: 'blouse', clothesColor: 7, glasses: 'none', earrings: 'studs', hat: 'none', neck: 'none', details: 'blush' };

const Y_HEAD = 2.3, HS = .64, SZ = .62;
const colOf = (list, v) => typeof v === 'string' ? v : list[v] !== undefined ? list[v] : list[0];
function pushHead(B, x, y, z, m) { const q = pushOut(B, x * HS, Y_HEAD + y * HS, z * HS, m); return [q[0] / HS, q[1] / HS]; }
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const shade = (hex, k) => rgb2hex(mixc(hex2rgb(hex), k < 0 ? [0, 0, 0] : [255, 255, 255], Math.abs(k)));
const lin = hex => new THREE.Color(hex).convertSRGBToLinear();
function ctex(c, rep) { const tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; tx.anisotropy = 4; if (rep) { tx.wrapS = tx.wrapT = THREE.RepeatWrapping; } return tx; }
function std(hex, rough = .75, metal = 0, extra = {}) { return new THREE.MeshStandardMaterial(Object.assign({ color: lin(hex), roughness: rough, metalness: metal }, extra)); }
function disposeTree(o) { o.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material) (Array.isArray(x.material) ? x.material : [x.material]).forEach(m => { ['map', 'alphaMap'].forEach(k => { if (m[k] && !m[k]._shared) m[k].dispose(); }); m.dispose(); }); }); }

// ---------- форма головы ----------
function headDeform(face, fem) {
  const taper = { oval: .2, round: .08, square: .02, heart: .34, long: .16, diamond: .3 }[face] || .2;
  return (x, y, z) => {
    let sx = 1, sy = 1, sz = .97;
    if (face === 'oval') { sx = .92; sy = 1.06; }
    else if (face === 'round') { sx = 1.02; sy = .96; }
    else if (face === 'square') { sx = .95 + .09 * clamp(.35 - y); sy = .99; }
    else if (face === 'heart') { sx = .97 + .07 * y; sy = 1.03; }
    else if (face === 'long') { sx = .87; sy = 1.13; sz = .94; }
    else if (face === 'diamond') { sx = 1.03 - .16 * y * y; sy = 1.05; }
    if (!fem) sx *= 1.02;
    let X = x * sx, Y = y * sy, Z = z * sz;
    if (Y < -.15) { const k = -Y - .15; X *= 1 - k * taper; Y -= k * .05; if (Z > 0) Z += k * .04; }
    return [X, Y, Z];
  };
}
function deformGeo(geo, fn, s = 1) { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const v = fn(p.getX(i), p.getY(i), p.getZ(i)); p.setXYZ(i, v[0] * s, v[1] * s, v[2] * s); } geo.computeVertexNormals(); }
const dirOf = (a, th) => [Math.sin(a) * Math.sin(th), Math.cos(th), Math.cos(a) * Math.sin(th)];

// ---------- лицо: текстура в равнопромежуточной развёртке ----------
const EYE_SH = {
  round: { u: x => -.95 * Math.sqrt(1 - x * x), l: x => .85 * Math.sqrt(1 - x * x), ir: .5 },
  almond: { u: x => -.8 * Math.pow(1 - x * x, .85) - .04 * x, l: x => .5 * Math.pow(1 - x * x, 1.1), ir: .47 },
  big: { u: x => -1.18 * Math.sqrt(1 - x * x), l: x => 1.02 * Math.sqrt(1 - x * x), ir: .6 },
  cat: { u: x => -.74 * Math.pow(1 - x * x, .75) - .26 * x, l: x => .44 * Math.pow(1 - x * x, 1.1) - .2 * x, ir: .46 },
  puppy: { u: x => -.86 * Math.pow(1 - x * x, .75) + .16 * x, l: x => .56 * (1 - x * x) + .18 * x, ir: .5 },
  sleepy: { u: x => -.44 * Math.pow(1 - x * x, .6), l: x => .62 * (1 - x * x), ir: .5, lid: 1 },
  monolid: { u: x => -.5 * Math.pow(1 - x * x, .55), l: x => .38 * (1 - x * x), ir: .43 },
  happy: { arc: 1 }
};
const BROW_SH = { straight: x => -.05 * x, arched: x => -.44 * (1 - Math.pow((x - .2) / 1.2, 2)), soft: x => -.26 * (1 - x * x), angled: x => -.42 * Math.max(0, 1 - Math.abs(x - .35) / 1.35), rounded: x => -.52 * (1 - x * x) + .06, flat: x => 0, rising: x => -.34 * x - .06 };
function drawEye(g, cx, cy, side, ew, cfg, closed) {
  const S = EYE_SH[cfg.eyes] || EYE_SH.round, fem = cfg.gender === 'female', col = colOf(AV.EYEC, cfg.eyeColor);
  g.save(); g.translate(cx, cy); g.scale(side, 1); g.lineCap = 'round'; g.lineJoin = 'round';
  const curve = (f, a = -1, b = 1, n = 24) => { for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; const y = f(x); i ? g.lineTo(x * ew, y * ew) : g.moveTo(x * ew, y * ew); } };
  if (closed || S.arc) {
    g.strokeStyle = '#2a1f2b'; g.lineWidth = ew * (fem ? .15 : .12); g.beginPath();
    curve(S.arc ? (x => -.5 * (1 - x * x)) : (x => .16 * (1 - x * x) - .05)); g.stroke();
    if (fem) { g.lineWidth = ew * .07; g.beginPath(); const ox = ew, oy = S.arc ? 0 : -.05 * ew; g.moveTo(ox * .92, oy); g.lineTo(ox * 1.16, oy - ew * .16); g.stroke(); }
    g.restore(); return;
  }
  const path = () => { g.beginPath(); curve(S.u); for (let i = 24; i >= 0; i--) { const x = -1 + 2 * i / 24; g.lineTo(x * ew, S.l(x) * ew); } g.closePath(); };
  path(); g.fillStyle = '#fbf9ff'; g.fill();
  g.save(); path(); g.clip();
  const ir = S.ir * ew, iy = (S.lid ? .14 : .05) * ew;
  const gr = g.createRadialGradient(0, iy, ir * .1, 0, iy, ir);
  gr.addColorStop(0, shade(col, .45)); gr.addColorStop(.55, col); gr.addColorStop(1, shade(col, -.55));
  g.fillStyle = gr; g.beginPath(); g.arc(0, iy, ir, 0, 7); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = ew * .02; for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; g.beginPath(); g.moveTo(Math.cos(a) * ir * .5, iy + Math.sin(a) * ir * .5); g.lineTo(Math.cos(a) * ir * .9, iy + Math.sin(a) * ir * .9); g.stroke(); }
  g.fillStyle = '#120d18'; g.beginPath(); g.arc(0, iy, ir * .44, 0, 7); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(-.32 * ir * side, iy - .36 * ir, ir * .27, 0, 7); g.fill();
  g.globalAlpha = .8; g.beginPath(); g.arc(.3 * ir * side, iy + .32 * ir, ir * .11, 0, 7); g.fill(); g.globalAlpha = 1;
  const sh = g.createLinearGradient(0, -ew, 0, 0); sh.addColorStop(0, 'rgba(70,40,80,.32)'); sh.addColorStop(1, 'rgba(70,40,80,0)'); g.fillStyle = sh; g.fillRect(-ew * 1.2, -ew * 1.3, ew * 2.4, ew * 1.3);
  g.restore();
  g.strokeStyle = '#211822'; g.lineWidth = ew * (fem ? .17 : .1); g.beginPath(); curve(S.u, -1.02, 1.02); g.stroke();
  if (fem) { const ux = 1, uy = S.u(.98) * ew; g.lineWidth = ew * .09; g.beginPath(); g.moveTo(ux * ew * .95, uy); g.quadraticCurveTo(ew * 1.14, uy - ew * .04, ew * 1.24, uy - ew * .2); g.stroke();
    g.lineWidth = ew * .045; for (const x of [.55, .78]) { const y = S.u(x) * ew; g.beginPath(); g.moveTo(x * ew, y); g.lineTo(x * ew + ew * .12, y - ew * .2); g.stroke(); } }
  g.strokeStyle = 'rgba(70,45,60,.35)'; g.lineWidth = ew * .05; g.beginPath(); curve(S.l, -.55, .95, 16); g.stroke();
  g.restore();
}
function drawFace(cfg, W, closed) {
  const H = W / 2, c = mk(W, H), g = c.getContext('2d'), K = W / (2 * Math.PI), fem = cfg.gender === 'female';
  const P = (a, th) => [W / 2 + a * K, th * K];
  const skin = AV.SKIN[cfg.skin];
  g.fillStyle = skin; g.fillRect(0, 0, W, H);
  const lg2 = g.createLinearGradient(0, H * .8, 0, H); lg2.addColorStop(0, 'rgba(0,0,0,0)'); lg2.addColorStop(1, 'rgba(60,20,30,.15)'); g.fillStyle = lg2; g.fillRect(0, H * .8, W, H * .2);
  const blushA = cfg.details === 'blush' ? .5 : fem ? .26 : .12;
  for (const s of [-1, 1]) { const [x, y] = P(s * .56, 1.95), R = .16 * K; g.save(); g.translate(x, y); g.scale(1.35, .8); const gr = g.createRadialGradient(0, 0, 0, 0, 0, R); gr.addColorStop(0, `rgba(255,110,140,${blushA})`); gr.addColorStop(1, 'rgba(255,110,140,0)'); g.fillStyle = gr; g.fillRect(-R, -R, 2 * R, 2 * R); g.restore(); }
  if (cfg.details === 'freckles') { const r = mulberry32(7); g.fillStyle = rgb2hex(mixc(hex2rgb(skin), [90, 45, 25], .45)); for (let i = 0; i < 46; i++) { const s = r() < .5 ? -1 : 1; const a = s * (.12 + r() * .5), th = 1.83 + r() * .17; const [x, y] = P(a, th); g.globalAlpha = .45 + r() * .3; g.beginPath(); g.arc(x, y, K * (.006 + r() * .005), 0, 7); g.fill(); } g.globalAlpha = 1; }
  if (cfg.details === 'mole') { const [x, y] = P(.25, 2.13); g.fillStyle = '#3b2420'; g.beginPath(); g.arc(x, y, K * .011, 0, 7); g.fill(); }
  if (cfg.details === 'stars') { g.fillStyle = '#c9b6ff'; for (const [a, th, s] of [[.62, 1.92, 1], [.52, 2.0, .6], [-.6, 1.93, .8]]) { const [x, y] = P(a, th), R = K * .03 * s; g.beginPath(); for (let k = 0; k < 8; k++) { const ang = k / 8 * Math.PI * 2, rr = k % 2 ? R * .35 : R; g.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } g.fill(); } }
  const ew = .118 * K * [.84, 1, 1.16][cfg.eyeSize];
  for (const s of [-1, 1]) { const [x, y] = P(s * .36, 1.72); drawEye(g, x, y, s, ew, cfg, closed); }
  const hc = hex2rgb(colOf(AV.HAIRC, cfg.hairColor)); const light = (hc[0] + hc[1] + hc[2]) / 3 > 140;
  const bcol = cfg.hair === 'bald' ? rgb2hex(mixc(hex2rgb(skin), [40, 25, 20], .6)) : rgb2hex(mixc(hc, [26, 18, 22], light ? .5 : .3));
  const bf = BROW_SH[cfg.brows] || BROW_SH.soft, T = K * [.03, .048, .07][cfg.browThick] * (fem ? .9 : 1.1), bw = K * (cfg.brows === 'flat' ? .13 : .17);
  for (const s of [-1, 1]) {
    const [x, y] = P(s * .37, 1.42 + (cfg.eyeSize === 2 ? -.02 : 0)); g.save(); g.translate(x, y); g.scale(s, 1);
    const top = [], bot = []; for (let i = 0; i <= 24; i++) { const u = -1 + i / 12, yy = bf(u) * bw * .62; const w = T * (u < -.6 ? .8 + (u + 1) / .4 * .2 : 1 - (u + .6) / 1.6 * .62); top.push([u * bw, yy - w / 2]); bot.push([u * bw, yy + w / 2]); }
    g.fillStyle = bcol; g.beginPath(); top.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); for (let i = bot.length - 1; i >= 0; i--) g.lineTo(bot[i][0], bot[i][1]); g.closePath(); g.fill(); g.restore();
  }
  const dk = rgb2hex(mixc(hex2rgb(skin), [70, 30, 35], .45));
  { const [x, y] = P(0, 1.95); g.strokeStyle = dk; g.globalAlpha = .55; g.lineWidth = K * .01; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - K * .035, y); g.quadraticCurveTo(x, y + K * .022, x + K * .035, y); g.stroke(); g.globalAlpha = 1; }
  { const [x, y] = P(0, 2.08), mw = K * (fem ? .085 : .09); g.lineCap = 'round';
    if (fem) { g.fillStyle = '#d4697c'; g.beginPath(); g.moveTo(x - mw, y); g.quadraticCurveTo(x, y + mw * .42, x + mw, y); g.quadraticCurveTo(x, y + mw * 1.0, x - mw, y); g.fill(); g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.ellipse(x, y + mw * .62, mw * .3, mw * .08, 0, 0, 7); g.fill(); }
    g.strokeStyle = fem ? '#8e3445' : dk; g.lineWidth = K * (fem ? .011 : .014); g.beginPath(); g.moveTo(x - mw, y - mw * .05); g.quadraticCurveTo(x, y + mw * .45, x + mw, y - mw * .05); g.stroke(); }
  return c;
}

// ---------- волосы: маска шапки + объёмы ----------
const HAIR_SPEC = {
  short: { cap: { bang: 'none', front: 50, side: 86, back: 118, r: 1.1 }, vol: 'shortTop' }, buzz: { cap: { bang: 'none', front: 56, side: 84, back: 112, r: 1.025 } },
  sidepart: { cap: { bang: 'side', front: 50, side: 88, back: 120, r: 1.08 }, vol: 'sideSwoop' }, quiff: { cap: { bang: 'none', front: 54, side: 84, back: 116, r: 1.07 }, vol: 'quiff' },
  curlyShort: { cap: { bang: 'none', front: 50, side: 88, back: 120, r: 1.06 }, vol: 'curlsTop' }, spiky: { cap: { bang: 'none', front: 50, side: 86, back: 118, r: 1.07 }, vol: 'spikes' },
  afro: { cap: { bang: 'none', front: 48, side: 94, back: 126, r: 1.08 }, vol: 'afro' }, pixie: { cap: { bang: 'side', front: 50, side: 94, back: 124, r: 1.08 }, vol: 'pixie' },
  bob: { cap: { bang: 'straight', front: 50, side: 100, back: 130, r: 1.08 }, vol: 'bob' }, long: { cap: { bang: 'curtain', front: 50, side: 100, back: 134, r: 1.075 }, vol: 'long' },
  longBangs: { cap: { bang: 'straight', front: 50, side: 100, back: 134, r: 1.075 }, vol: 'long' }, wavy: { cap: { bang: 'side', front: 50, side: 100, back: 134, r: 1.08 }, vol: 'wavy' },
  curlyLong: { cap: { bang: 'curtain', front: 48, side: 100, back: 134, r: 1.09 }, vol: 'curlyLong' }, ponyHigh: { cap: { bang: 'none', front: 50, side: 84, back: 112, r: 1.055 }, vol: 'ponyHigh' },
  ponyLow: { cap: { bang: 'curtain', front: 50, side: 88, back: 118, r: 1.06 }, vol: 'ponyLow' }, pigtails: { cap: { bang: 'straight', front: 50, side: 90, back: 120, r: 1.06 }, vol: 'pigtails' },
  braid: { cap: { bang: 'side', front: 50, side: 90, back: 120, r: 1.06 }, vol: 'braid' }, twoBraids: { cap: { bang: 'curtain', front: 50, side: 90, back: 120, r: 1.06 }, vol: 'twoBraids' },
  bunTop: { cap: { bang: 'none', front: 50, side: 86, back: 114, r: 1.055 }, vol: 'bunTop' }, spaceBuns: { cap: { bang: 'straight', front: 50, side: 88, back: 116, r: 1.06 }, vol: 'spaceBuns' },
  manBun: { cap: { bang: 'none', front: 52, side: 86, back: 116, r: 1.06 }, vol: 'manBun' }, dreads: { cap: { bang: 'none', front: 52, side: 90, back: 122, r: 1.07 }, vol: 'dreads' },
  wolf: { cap: { bang: 'curtain', front: 50, side: 98, back: 128, r: 1.09 }, vol: 'wolf' }, bald: { cap: null }
};
function capBoundary(az, c) {
  const A = Math.abs(az), s = sstep(.9, 1.75, A), b = sstep(1.9, 2.9, A);
  let th = lerp(lerp(c.front, c.side, s), c.back, b);
  if (A < 1.05) {
    const k = 1 - sstep(.8, 1.05, A); let bt = th;
    if (c.bang === 'straight') bt = 83 + 3 * Math.cos(az * 3);
    else if (c.bang === 'side') bt = 58 + 30 * clamp((az + .9) / 1.8);
    else if (c.bang === 'curtain') bt = 57 + 33 * Math.pow(A / 1.05, 1.35);
    th = lerp(th, Math.max(th, bt), k);
  }
  return th;
}
const _texCache = {};
function strandTex() {
  if (_texCache.strand) return _texCache.strand;
  const c = mk(512, 512), g = c.getContext('2d'), r = mulberry32(3); g.fillStyle = '#d8d6dc'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 1100; i++) { const x = r() * 512, v = 150 + r() * 105 | 0; g.strokeStyle = `rgba(${v},${v},${v + 4},${.35 + r() * .4})`; g.lineWidth = .6 + r() * 2.2; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + (r() - .5) * 14, 170, x + (r() - .5) * 14, 340, x + (r() - .5) * 8, 512); g.stroke(); }
  const t = ctex(c, true); t._shared = 1; return (_texCache.strand = t);
}
function capTex() {
  if (_texCache.cap) return _texCache.cap;
  const W = 1024, H = 512, c = mk(W, H), g = c.getContext('2d'), r = mulberry32(5); g.fillStyle = '#d4d2d8'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 2600; i++) { const x = r() * W, v = 140 + r() * 115 | 0; g.strokeStyle = `rgba(${v},${v},${v + 4},${.3 + r() * .45})`; g.lineWidth = .6 + r() * 2; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (r() - .5) * 10, H); g.stroke(); }
  const sh = g.createLinearGradient(0, H * .14, 0, H * .32); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(.5, 'rgba(255,255,255,.55)'); sh.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = sh; g.fillRect(0, H * .14, W, H * .18);
  const t = ctex(c); t._shared = 1; return (_texCache.cap = t);
}
function capMask(spec) {
  const key = 'm' + JSON.stringify(spec); if (_texCache[key]) return _texCache[key];
  const W = 1024, H = 512, c = mk(W, H), g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.fillStyle = '#fff';
  g.beginPath(); g.moveTo(0, 0);
  for (let x = 0; x <= W; x += 2) { const az = (x / W - .5) * Math.PI * 2; let y = capBoundary(az, spec) / 180 * H; y += 2.2 * Math.sin(x * .085) + 1.3 * Math.sin(x * .21 + 1.3); g.lineTo(x, y); }
  g.lineTo(W, 0); g.closePath(); g.fill();
  const t = new THREE.CanvasTexture(c); t._shared = 1; return (_texCache[key] = t);
}

// ---------- тело ----------
function torsoProfile(fem) {
  const P = fem ? [[.8, -1.45], [.79, -.95], [.86, -.45], [.95, .05], [1.0, .5], [1.0, .85], [.92, 1.08], [.68, 1.26], [.42, 1.37], [.25, 1.42]]
    : [[.95, -1.45], [.98, -.9], [1.04, -.3], [1.1, .3], [1.14, .75], [1.1, 1.02], [.88, 1.24], [.5, 1.37], [.29, 1.43]];
  return new THREE.SplineCurve(P.map(p => new THREE.Vector2(p[0], p[1]))).getSpacedPoints(64);
}
function Body(fem) {
  const pts = torsoProfile(fem), SX = fem ? 1.04 : 1.14;
  const rAt = y => { if (y <= pts[0].y) return pts[0].x; for (let i = 1; i < pts.length; i++) if (pts[i].y >= y) { const a = pts[i - 1], b = pts[i]; return lerp(a.x, b.x, (y - a.y) / ((b.y - a.y) || 1)); } return 0; };
  const vAt = y => { const n = pts.length; for (let i = n - 1; i >= 0; i--) if (pts[i].y <= y) return (n - 1 - i) / (n - 1); return 1; };
  const shY = 1.0, AX = rAt(1.0) * SX - (fem ? .1 : .12), tilt = .1;
  return { fem, pts, SX, rAt, vAt, shY, AX, tilt, zAt: y => rAt(y) * SZ, topY: pts[pts.length - 1].y };
}
function pushOut(B, x, yw, z, m = .05) {
  if (yw < B.topY - .02) {
    const r = B.rAt(yw), ax = r * B.SX * (1 + m), az = r * SZ * (1 + m) + .02, e = (x / ax) ** 2 + (z / az) ** 2;
    if (e < 1 && e > 1e-6) { const s = 1 / Math.sqrt(e); x *= s; z *= s; }
  }
  if (yw < B.shY + .3) for (const sd of [-1, 1]) {
    const axX = sd * (B.AX + (B.shY - yw) * Math.tan(B.tilt)), dx = x - axX, d = Math.hypot(dx, z);
    if (d < .4 && d > 1e-6 && Math.sign(x) === sd) { const s = .4 / d; x = axX + dx * s; z *= s; }
  }
  return [x, z];
}
const SLEEVE = { tee: .36, stripes: .36, vneck: .36, shirt: 1, polo: .36, sweater: 1, turtleneck: 1, hoodie: 1, jacket: 1, denim: 1, varsity: 1, kamzol: 1, overalls: .36, tank: 0, top: 0, blouse: .3 };
function drawTorso(cfg, B, W) {
  const H = W, c = mk(W, H), g = c.getContext('2d'), C = colOf(AV.CLOTHC, cfg.clothesColor), D = shade(C, -.28), Lc = shade(C, .3), S = AV.SKIN[cfg.skin], WH = '#f3f1f8';
  const X = az => W * (.5 + az / (2 * Math.PI)), Y = y => B.vAt(y) * H, k = cfg.clothes;
  const rect = (col, x0, y0, x1, y1) => { g.fillStyle = col; g.fillRect(x0, y0, x1 - x0, y1 - y0); };
  const poly = (col, pts) => { g.fillStyle = col; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fill(); };
  const vlines = (col, step, w, y0 = 0, y1 = H, a = .35) => { g.strokeStyle = col; g.globalAlpha = a; g.lineWidth = w; for (let x = 0; x < W; x += step) { g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.stroke(); } g.globalAlpha = 1; };
  const buttons = (col, x, ys, r = 7) => { ys.forEach(y => { g.fillStyle = shade(col, -.3); g.beginPath(); g.arc(x, y, r + 1.5, 0, 7); g.fill(); g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }); };
  const band = (col, y0, y1) => { rect(col, 0, y0, W, y1); vlines(shade(col, -.3), 7, 2, y0, y1, .45); };
  const collarPts = (col, spread = .42, len = 1.05) => { for (const s of [-1, 1]) { poly(col, [[X(s * .03), 0], [X(s * spread), Y(1.32)], [X(s * (spread - .05)), Y(len)], [X(s * .04), Y(1.22)]]); g.strokeStyle = shade(col, -.35); g.lineWidth = 2; g.stroke(); } };
  rect(C, 0, 0, W, H);
  if (k === 'tee' || k === 'vneck') { if (k === 'vneck') { poly(S, [[X(-.34), 0], [X(.34), 0], [X(0), Y(.78)]]); g.strokeStyle = D; g.lineWidth = 6; g.beginPath(); g.moveTo(X(-.34), 0); g.lineTo(X(0), Y(.78)); g.lineTo(X(.34), 0); g.stroke(); } else band(D, 0, Y(1.36)); }
  if (k === 'stripes') { rect(WH, 0, 0, W, H); g.fillStyle = C; for (let y = Y(1.2); y < H; y += 44) g.fillRect(0, y, W, 20); band(C, 0, Y(1.36)); }
  if (k === 'shirt' || k === 'polo') { rect(Lc, X(-.045), 0, X(.045), k === 'polo' ? Y(.7) : H); g.strokeStyle = D; g.lineWidth = 2; g.strokeRect(X(-.045), -2, X(.045) - X(-.045), (k === 'polo' ? Y(.7) : H) + 2);
    buttons('#f6f3ee', X(0), k === 'polo' ? [Y(1.05), Y(.85)] : [Y(.95), Y(.4), Y(-.15), Y(-.7), Y(-1.2)], 6); collarPts(k === 'polo' ? Lc : shade(C, .15));
    if (k === 'shirt') { rect(shade(C, -.06), X(-.62), Y(.62), X(-.36), Y(.28)); g.strokeStyle = D; g.strokeRect(X(-.62), Y(.62), X(-.36) - X(-.62), Y(.28) - Y(.62)); } }
  if (k === 'sweater' || k === 'turtleneck') { vlines(D, 10, 3, 0, H, .3); if (k === 'sweater') { band(D, Y(-1.2), H); band(D, 0, Y(1.35)); g.strokeStyle = Lc; g.lineWidth = 6; g.globalAlpha = .6; for (const s of [-.28, .28]) { g.beginPath(); for (let y = Y(1.2); y < Y(-1.15); y += 4) { const x = X(s) + Math.sin(y * .06) * 12; y === Y(1.2) ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); g.beginPath(); for (let y = Y(1.2); y < Y(-1.15); y += 4) { const x = X(s) - Math.sin(y * .06) * 12; y === Y(1.2) ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); } g.globalAlpha = 1; } }
  if (k === 'hoodie') { band(D, Y(-1.25), H); poly(D, [[X(-.55), Y(-.45)], [X(.55), Y(-.45)], [X(.68), Y(-1.2)], [X(-.68), Y(-1.2)]]); poly(C, [[X(-.5), Y(-.5)], [X(.5), Y(-.5)], [X(.6), Y(-1.14)], [X(-.6), Y(-1.14)]]); g.strokeStyle = shade(C, -.12); g.lineWidth = 3; g.beginPath(); g.moveTo(X(-.5), Y(-.5)); g.lineTo(X(.5), Y(-.5)); g.stroke(); }
  if (k === 'jacket' || k === 'denim' || k === 'kamzol') {
    const inner = k === 'kamzol' ? WH : WH, open = k === 'denim' ? .1 : .3;
    if (k === 'kamzol') { rect(WH, 0, 0, W, H); poly(C, [[X(.14), 0], [X(Math.PI * .99), 0], [X(Math.PI * .99), H], [X(.1), H], [X(.1), Y(.25)]]); poly(C, [[X(-.14), 0], [X(-Math.PI * .99), 0], [X(-Math.PI * .99), H], [X(-.1), H], [X(-.1), Y(.25)]]);
      const gold = '#e2b860'; g.strokeStyle = gold; g.lineWidth = 4; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(X(s * .14), 0); g.lineTo(X(s * .1), Y(.25)); g.lineTo(X(s * .1), H); g.stroke();
        for (let y = Y(.2); y < H - 40; y += 70) { const x = X(s * .2); g.lineWidth = 3.5; g.beginPath(); g.arc(x - 9 * s, y, 11, Math.PI * .1, Math.PI * 1.6); g.stroke(); g.beginPath(); g.arc(x + 9 * s, y + 4, 11, Math.PI * 1.4, Math.PI * 2.9); g.stroke(); g.beginPath(); g.moveTo(x - 20, y + 22); g.lineTo(x + 20, y + 22); g.stroke(); } }
      g.lineWidth = 3; for (let x = 0; x < W; x += 46) { g.beginPath(); g.arc(x + 23, H - 26, 12, Math.PI, 0); g.stroke(); } buttons(gold, X(.13), [Y(-.1), Y(-.6)], 7);
    } else {
      poly(inner, [[X(-open), 0], [X(open), 0], [X(.06), Y(k === 'denim' ? -1.4 : -.35)], [X(-.06), Y(k === 'denim' ? -1.4 : -.35)]]);
      if (k === 'jacket') { for (const s of [-1, 1]) { poly(D, [[X(s * open), 0], [X(s * (open + .16)), Y(1.05)], [X(s * .07), Y(-.3)], [X(s * .05), Y(-.3)]]); } buttons(shade(C, -.45), X(.08), [Y(-.55), Y(-.95)], 8); rect(WH, X(-.66), Y(.55), X(-.48), Y(.5)); }
      else { g.setLineDash([9, 7]); g.strokeStyle = '#e8b56a'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, Y(.7)); g.lineTo(W, Y(.7)); g.stroke(); for (const s of [-1, 1]) { g.strokeRect(Math.min(X(s * .28), X(s * .6)), Y(.55), Math.abs(X(s * .6) - X(s * .28)), Y(.05) - Y(.55)); g.beginPath(); g.moveTo(X(s * .12), Y(1.3)); g.lineTo(X(s * .12), Y(-1.3)); g.stroke(); } g.setLineDash([]); band(D, Y(-1.2), H); collarPts(shade(C, -.12), .5, 1.0); buttons('#c9ccd6', X(.12), [Y(.6), Y(.1), Y(-.4), Y(-.9)], 7); }
    }
  }
  if (k === 'varsity') { band(shade(C, -.2), 0, Y(1.36)); band(shade(C, -.2), Y(-1.2), H); g.fillStyle = '#efe7d6'; g.fillRect(0, Y(-1.15), W, 7); g.fillRect(0, Y(1.38), W, 6); buttons('#efe7d6', X(0), [Y(1.0), Y(.5), Y(0), Y(-.5), Y(-1.0)], 7); const cx = X(-.42), cy = Y(.5); g.fillStyle = '#efe7d6'; g.beginPath(); g.arc(cx, cy, 34, 0, 7); g.fill(); g.fillStyle = C; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 11 : 26; g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.fill(); }
  if (k === 'overalls') { rect(WH, 0, 0, W, H); const yb = Y(.55); rect(C, X(-.45), yb, X(.45), H); rect(C, 0, Y(-.75), W, H); for (const s of [-1, 1]) { rect(C, X(s * .36) - 18, 0, X(s * .36) + 18, yb + 4); rect(C, X(s * (Math.PI - .5)) - 18, 0, X(s * (Math.PI - .5)) + 18, Y(-.7)); buttons('#e2b860', X(s * .36), [yb + 18], 9); } g.strokeStyle = shade(C, .3); g.setLineDash([8, 6]); g.lineWidth = 3; g.strokeRect(X(-.2), Y(.25), X(.2) - X(-.2), Y(-.2) - Y(.25)); g.setLineDash([]); band(shade(WH, -.08), 0, Y(1.36)); }
  if (k === 'tank' || k === 'top') { const ys = Y(.92); rect(S, 0, 0, W, ys); const sw = k === 'tank' ? 22 : 7; for (const az of [.5, -.5, Math.PI - .5, -(Math.PI - .5)]) rect(C, X(az) - sw, 0, X(az) + sw, ys + 2);
    if (k === 'tank') { g.fillStyle = S; g.beginPath(); g.ellipse(X(0), ys, X(.42) - X(0), Y(.58) - ys, 0, 0, Math.PI); g.fill(); }
    else { g.fillStyle = WH; for (let x = X(-1.6); x < X(1.6); x += 18) { g.beginPath(); g.arc(x + 9, ys, 9, 0, Math.PI); g.fill(); } } }
  if (k === 'blouse') { for (const s of [-1, 1]) { g.fillStyle = WH; g.beginPath(); g.ellipse(X(s * .15), Y(1.2), 46, 30, s * .4, 0, 7); g.fill(); g.strokeStyle = shade(WH, -.2); g.lineWidth = 2; g.stroke(); } buttons(WH, X(0), [Y(.9), Y(.5), Y(.1), Y(-.3)], 5); band(D, Y(-1.25), H); }
  return c;
}
function drawArm(cfg, frac, col) {
  const W = 256, H = 256, c = mk(W, H), g = c.getContext('2d'); g.fillStyle = AV.SKIN[cfg.skin]; g.fillRect(0, 0, W, H);
  if (frac > 0) { g.fillStyle = col; g.fillRect(0, 0, W, H * frac); g.fillStyle = shade(col, -.25); g.fillRect(0, H * frac - 10, W, 10);
    if (cfg.clothes === 'sweater' || cfg.clothes === 'turtleneck') { g.strokeStyle = shade(col, -.3); g.globalAlpha = .3; g.lineWidth = 3; for (let x = 0; x < W; x += 10) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H * frac); g.stroke(); } g.globalAlpha = 1; } }
  return c;
}

// ---------- сборка персонажа ----------
function taperTube(pts, r0, r1, mat, bulge = 0, segs = 40, rad = 14, B = null) {
  if (B) pts = pts.map(p => { const [x, z] = pushHead(B, p[0], p[1], p[2], .12); return [x, p[1], z]; });
  const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p[0], p[1], p[2])));
  const geo = new THREE.TubeGeometry(curve, segs, 1, rad, false), pos = geo.attributes.position, P = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) { const tt = i / segs; curve.getPointAt(tt, P); const rr = lerp(r0, r1, tt) * (1 + bulge * Math.sin(Math.PI * Math.min(1, tt * 1.7))); for (let j = 0; j <= rad; j++) { const id = i * (rad + 1) + j; pos.setXYZ(id, P.x + (pos.getX(id) - P.x) * rr, P.y + (pos.getY(id) - P.y) * rr, P.z + (pos.getZ(id) - P.z) * rr); } }
  geo.computeVertexNormals(); return new THREE.Mesh(geo, mat);
}
function ellip(mat, r, s, p, rot = [0, 0, 0], seg = 28) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.round(seg * .7)), mat); m.scale.set(...s); m.position.set(...p); m.rotation.set(...rot); return m; }
function curtain(o, mat, B, hs = 1) {
  const Nt = 60, Ny = 30, th0 = o.gap, th1 = Math.PI * 2 - o.gap, pos = [], uv = [], idx = [];
  for (let j = 0; j <= Ny; j++) { const tt = j / Ny; for (let i = 0; i <= Nt; i++) {
    const th = th0 + (th1 - th0) * i / Nt, L = o.len(th) * (1 + .035 * Math.sin(th * 9) + .02 * Math.sin(th * 5.3)), y = o.top - tt * L;
    let r = lerp(o.rTop, o.rBot, Math.pow(tt, .65)) - .08 * sstep(.85, 1, tt);
    if (o.wave) r += o.wave * Math.sin(tt * 13 + th * 5) * Math.min(1, tt * 3);
    if (o.noise) r += o.noise * (Math.sin(th * 23 + tt * 9) * Math.sin(tt * 17 + th * 7));
    if (o.curl) r -= o.curl * sstep(.78, 1, tt);
    r += .03 * Math.sin(th * 13 + 1.3) * tt;
    const edge = 1 - sstep(0, .4, Math.min(th - th0, th1 - th)); r -= .09 * edge * (1 - tt * .6);
    let x = r * Math.sin(th) * .96 * hs, z = r * Math.cos(th) * .94; const c = Math.cos(th);
    if (c > .2 && o.lean) z += o.lean * tt * c;
    if (Y_HEAD + y * HS < B.topY + .3) { const q = pushHead(B, x, y, z, .06); x = q[0]; z = q[1]; }
    pos.push(x, y, z); uv.push(i / Nt * 3, (1 - tt) * 2);
  } }
  for (let j = 0; j < Ny; j++) for (let i = 0; i < Nt; i++) { const a = j * (Nt + 1) + i, b = a + Nt + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
  return new THREE.Mesh(geo, mat);
}
function longLen(front, side, back) { return th => { const c = Math.cos(th); return c > 0 ? lerp(side, front, sstep(.1, .55, c)) : lerp(side, back, sstep(.1, .6, -c)); }; }
function scatter(spec, n, seed, thMax, fn) { const r = mulberry32(seed); let k = 0, guard = 0; while (k < n && guard++ < n * 30) { const az = (r() * 2 - 1) * Math.PI, th = Math.acos(1 - r() * (1 - Math.cos(thMax))); if (th * 180 / Math.PI > capBoundary(az, spec) - 4) continue; fn(dirOf(az, th), r, th); k++; } }
function buildHair(cfg, B, deform) {
  const grp = new THREE.Group(), spec = HAIR_SPEC[cfg.hair]; if (!spec || !spec.cap) return grp; const hs = deform(1, 0, 0)[0];
  const col = lin(colOf(AV.HAIRC, cfg.hairColor));
  const mat = new THREE.MeshStandardMaterial({ color: col, map: strandTex(), roughness: .55, side: THREE.DoubleSide });
  const cs = spec.cap, cg = new THREE.SphereGeometry(1, 64, 40, -Math.PI / 2); deformGeo(cg, deform, cs.r);
  grp.add(new THREE.Mesh(cg, new THREE.MeshStandardMaterial({ color: col, map: capTex(), alphaMap: capMask(cs), alphaTest: .5, roughness: .5, side: THREE.DoubleSide })));
  const top = m => { m.userData.top = 1; return m; }, add = m => grp.add(m);
  switch (spec.vol) {
    case 'shortTop': break;
    case 'sideSwoop': add(top(ellip(mat, 1, [.5, .22, .42], [-.3, .82, .4], [-.55, 0, .45]))); break;
    case 'quiff': add(top(ellip(mat, 1, [.62, .4, .6], [.04, .86, .48], [-.62, 0, -.1]))); break;
    case 'pixie': add(top(ellip(mat, 1, [.66, .28, .5], [.25, .74, .55], [-.6, 0, -.55]))); break;
    case 'curlsTop': { const g2 = new THREE.SphereGeometry(1, 14, 10); scatter(cs, 80, 9, 1.35, (d, r) => { const m = new THREE.Mesh(g2, mat); const s = .15 + r() * .07; m.scale.setScalar(s); m.position.set(d[0] * 1.06, d[1] * 1.06, d[2] * 1.06); add(top(m)); }); break; }
    case 'spikes': scatter(cs, 30, 4, 1.15, (d, r) => { const h = .45 + r() * .2, m = new THREE.Mesh(new THREE.ConeGeometry(.16, h, 10), mat); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(d[0], d[1] + .25, d[2]).normalize()); m.position.set(d[0] * (1.02 + h * .3), d[1] * (1.02 + h * .3), d[2] * (1.02 + h * .3)); add(top(m)); }); break;
    case 'afro': { const g2 = new THREE.SphereGeometry(1, 18, 12); scatter({ ...cs, back: 122 }, 110, 11, 2.1, (d, r, th) => { const m = new THREE.Mesh(g2, mat); m.scale.setScalar(.33 + r() * .12); const R = 1.18 + r() * .12; m.position.set(d[0] * R * 1.05, d[1] * R + .08, d[2] * R); if (th < 1.0) m.userData.top = 1; add(m); }); break; }
    case 'bob': add(curtain({ top: .42, rTop: 1.0, rBot: 1.2, gap: .78, len: () => 1.55, curl: .1 }, mat, B, hs)); break;
    case 'long': add(curtain({ top: .42, rTop: 1.0, rBot: 1.24, gap: .86, len: longLen(2.9, 2.5, 4.1), lean: .12 }, mat, B, hs)); break;
    case 'wavy': add(curtain({ top: .42, rTop: 1.0, rBot: 1.3, gap: .86, len: longLen(2.8, 2.5, 4.0), lean: .12, wave: .075 }, mat, B, hs)); break;
    case 'curlyLong': add(curtain({ top: .42, rTop: 1.02, rBot: 1.5, gap: .82, len: longLen(2.6, 2.3, 3.6), lean: .1, noise: .09, wave: .05 }, mat, B, hs)); { const g2 = new THREE.SphereGeometry(1, 14, 10); scatter(cs, 45, 13, 1.1, (d, r) => { const m = new THREE.Mesh(g2, mat); m.scale.setScalar(.17 + r() * .06); m.position.set(d[0] * 1.08, d[1] * 1.08, d[2] * 1.08); add(top(m)); }); } break;
    case 'wolf': add(curtain({ top: .42, rTop: 1.02, rBot: 1.32, gap: .84, len: th => 2.0 + .2 * Math.sin(th * 9), noise: .045 }, mat, B, hs)); break;
    case 'ponyHigh': add(new THREE.Mesh(new THREE.TorusGeometry(.15, .055, 10, 24), std('#b48cff', .5)).translateX(0).translateY(.7).translateZ(-.78)); grp.children[grp.children.length - 1].rotation.x = -.9;
      add(taperTube([[0, .66, -.82], [0, .6, -1.15], [0, -.1, -1.35], [0, -1.3, -1.3], [0, -2.5, -1.2]], .2, .05, mat, .5, 40, 14, B)); break;
    case 'ponyLow': add(new THREE.Mesh(new THREE.TorusGeometry(.14, .05, 10, 24), std('#b48cff', .5))); grp.children[grp.children.length - 1].position.set(0, -.48, -.92);
      add(taperTube([[0, -.45, -.95], [0, -1.1, -1.12], [0, -2.2, -1.05], [0, -3.3, -.95]], .18, .05, mat, .45, 40, 14, B)); break;
    case 'pigtails': for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.TorusGeometry(.12, .045, 10, 24), std('#ff8fb1', .5)); b.position.set(s * .92, -.18, -.32); b.rotation.y = Math.PI / 2; add(b);
        add(taperTube([[s * .95, -.18, -.34], [s * 1.3, -.6, -.3], [s * 1.55, -1.6, -.15], [s * 1.6, -2.6, -.02]], .17, .045, mat, .5, 36, 12, B)); } break;
    case 'braid': case 'twoBraids': { const sides = spec.vol === 'braid' ? [1] : [-1, 1]; const g2 = new THREE.SphereGeometry(1, 16, 12);
      for (const s of sides) { const pts = [[s * .55, -.6, -.72], [s * 1.05, -1.3, -.35], [s * 1.45, -2.1, .3], [s * 1.35, -3.3, .7]].map(p => { const [x, z] = pushHead(B, p[0], p[1], p[2], .14); return new THREE.Vector3(x, p[1], z); });
        const cv = new THREE.CatmullRomCurve3(pts), n = 16;
        for (let i = 0; i < n; i++) { const tt = i / n, p = cv.getPointAt(tt), tg = cv.getTangentAt(tt), m = new THREE.Mesh(g2, mat), sc = lerp(.2, .1, tt); m.scale.set(sc * 1.05, sc * .9, sc * .95); const off = (i % 2 ? 1 : -1) * sc * .35; m.position.set(p.x + off, p.y, p.z); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tg.clone().normalize()); m.rotateZ((i % 2 ? 1 : -1) * .5); add(m); }
        const e = cv.getPointAt(1), band = new THREE.Mesh(new THREE.TorusGeometry(.06, .025, 8, 16), std('#b48cff', .5)); band.position.copy(e); band.rotation.x = Math.PI / 2; add(band);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(.08, .28, 10), mat); tip.position.set(e.x, e.y - .14, e.z); tip.rotation.x = Math.PI; add(tip); } break; }
    case 'bunTop': add(top(ellip(mat, .44, [1, .9, 1], [0, 1.08, -.22]))); { const t2 = new THREE.Mesh(new THREE.TorusGeometry(.34, .05, 10, 30), mat); t2.position.set(0, .86, -.18); t2.rotation.x = Math.PI / 2 - .2; add(top(t2)); } break;
    case 'spaceBuns': for (const s of [-1, 1]) add(top(ellip(mat, .34, [1, .95, 1], [s * .6, .9, -.08]))); break;
    case 'manBun': add(ellip(mat, .28, [1, .9, 1], [0, .66, -.9])); break;
    case 'dreads': { const r = mulberry32(21); for (let i = 0; i < 34; i++) { let az = Math.PI + (i / 33 - .5) * Math.PI * 1.25; if (az > Math.PI) az -= Math.PI * 2; const th = capBoundary(az, cs) / 180 * Math.PI - .12, d = dirOf(az, th);
        const L = 2.1 + r() * .8, p0 = [d[0] * 1.02, d[1] * 1.02, d[2] * 1.02], p1 = [d[0] * 1.22, d[1] - .4, d[2] * 1.22], p2 = [d[0] * 1.32, d[1] - L, d[2] * 1.3];
        add(taperTube([p0, p1, p2], .07, .055, mat, 0, 14, 7, B)); } break; }
  }
  return grp;
}
function lensOutline(type, side) {
  const P = [], n = 56; let w = .2, h = .17, p = 2;
  if (type === 'round') { w = h = .19; } else if (type === 'square') { w = .23; h = .16; p = 5; } else if (type === 'cateye') { w = .23; h = .16; p = 3; } else if (type === 'sun') { w = .25; h = .19; p = 3.4; } else if (type === 'aviator') { w = .23; h = .2; p = 2.4; }
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); let x = w * Math.sign(c) * Math.pow(Math.abs(c), 2 / p), y = h * Math.sign(s) * Math.pow(Math.abs(s), 2 / p);
    if (type === 'cateye' && x > 0 && y > 0) y += .09 * Math.pow(x / w, 2.2); if (type === 'aviator' && y < 0) { y *= 1.15; x += -.04 * (y / h); } if (type === 'aviator' && y > 0) y *= .75;
    P.push(new THREE.Vector2(x * side, y)); }
  if (side < 0) P.reverse(); return P;
}
function buildAccessories(cfg, B, deform, head, root) {
  const E = s => { const d = dirOf(s * .36, 1.72); const v = deform(...d); return new THREE.Vector3(...v); };
  const ear = s => { const v = deform(...dirOf(s * Math.PI / 2, 1.78)); return new THREE.Vector3(v[0] + s * .06, v[1], v[2] + .02); };
  // очки
  if (cfg.glasses !== 'none') {
    const ty = cfg.glasses, frameCol = cfg.glassesColor || { round: '#d8b45a', square: '#1d1a22', cateye: '#7a2840', sun: '#121015', aviator: '#d8b45a' }[ty], metal = ty === 'round' || ty === 'aviator';
    const fm = std(frameCol, metal ? .3 : .45, metal ? .8 : 0), gl = new THREE.Group();
    const lensMat = new THREE.MeshStandardMaterial({ color: lin(ty === 'sun' ? '#1a1530' : ty === 'aviator' ? '#7488e0' : '#d8e8ff'), transparent: true, opacity: ty === 'sun' ? .86 : ty === 'aviator' ? .5 : .14, roughness: .1, metalness: .2 });
    for (const s of [-1, 1]) {
      const e = E(s), out = lensOutline(ty, s), shp = new THREE.Shape(out), inner = out.map(v => v.clone().multiplyScalar(.82)).reverse(); shp.holes.push(new THREE.Path(inner));
      const fr = new THREE.Mesh(new THREE.ExtrudeGeometry(shp, { depth: .035, bevelEnabled: false, curveSegments: 4 }), fm);
      const ln = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(inner.slice().reverse())), lensMat);
      const lg3 = new THREE.Group(); lg3.add(fr, ln); ln.position.z = .015; lg3.position.set(e.x * 1.02, e.y + .02, e.z + .1); lg3.rotation.y = s * .22; gl.add(lg3);
      const ex = ear(s), sx = e.x + s * .24, a = new THREE.Vector3(sx, e.y + .06, e.z + .02), b = new THREE.Vector3(ex.x, ex.y + .14, ex.z - .05);
      const tm = new THREE.Mesh(new THREE.BoxGeometry(.03, .035, a.distanceTo(b)), fm); tm.position.copy(a).add(b).multiplyScalar(.5); tm.lookAt(b); gl.add(tm);
    }
    const e = E(1), br = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, Math.max(.08, e.x * 2 - .38), 8), fm); br.rotation.z = Math.PI / 2; br.position.set(0, e.y + .07, e.z + .14); gl.add(br);
    head.add(gl);
  }
  // серьги
  if (cfg.earrings !== 'none') for (const s of [-1, 1]) {
    const e = ear(s), lobe = new THREE.Vector3(e.x + s * .03, e.y - .2, e.z + .04), gold = std(cfg.earColor || '#e0b860', .28, .9), ty = cfg.earrings; let m;
    if (ty === 'studs') { m = new THREE.Mesh(new THREE.SphereGeometry(.05, 12, 10), gold); m.position.copy(lobe); }
    else if (ty === 'hoops') { m = new THREE.Mesh(new THREE.TorusGeometry(.12, .02, 8, 28), gold); m.position.set(lobe.x, lobe.y - .11, lobe.z); m.rotation.y = Math.PI / 2; }
    else if (ty === 'drops') { m = new THREE.Group(); const a = new THREE.Mesh(new THREE.SphereGeometry(.035, 10, 8), gold); a.position.copy(lobe); const b = ellip(std('#b48cff', .1, .2), .06, [1, 1.7, 1], [lobe.x, lobe.y - .16, lobe.z]); m.add(a, b); }
    else if (ty === 'pearls') { m = new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 12), std('#f6f1ea', .22, .1)); m.position.set(lobe.x, lobe.y - .03, lobe.z); }
    else { m = new THREE.Group(); const d = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, .02, 20), gold); d.rotation.z = Math.PI / 2; d.position.set(lobe.x, lobe.y - .1, lobe.z); m.add(d); for (let i = -1; i <= 1; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(.028, 8, 6), std('#d14b5a', .3)); p.position.set(lobe.x, lobe.y - .24 - Math.abs(i) * -.02, lobe.z + i * .06); m.add(p); } }
    head.add(m);
  }
  // головные уборы
  const hat = cfg.hat, HC = cfg.hatColor || null, NC = cfg.neckColor || null;
  if (hat !== 'none') {
    const hg = new THREE.Group(); head.add(hg);
    const knit = (() => { const c = mk(256, 256), g = c.getContext('2d'); g.fillStyle = '#dedde3'; g.fillRect(0, 0, 256, 256); g.strokeStyle = 'rgba(120,120,130,.5)'; g.lineWidth = 4; for (let x = 0; x < 256; x += 12) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); } const tx = ctex(c, true); tx.repeat.set(4, 1); return tx; })();
    if (hat === 'beanie') { const m = new THREE.MeshStandardMaterial({ color: lin(HC || '#e0a84f'), map: knit, roughness: .9 }); hg.rotation.x = -.38; hg.position.y = .08;
      hg.add(new THREE.Mesh(new THREE.SphereGeometry(1.17, 48, 24, 0, Math.PI * 2, 0, Math.PI * .52), m)); const cuff = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.21, .34, 48, 1, true), new THREE.MeshStandardMaterial({ color: lin(shade(HC || '#e0a84f', -.15)), map: knit, roughness: .9, side: THREE.DoubleSide })); cuff.position.y = -.02; hg.add(cuff); hg.add(ellip(std('#f3eadb', .95), .26, [1, 1, 1], [0, 1.2, 0])); }
    else if (hat === 'cap') { const m = std(HC || '#3d428b', .7); hg.rotation.x = -.26; hg.position.y = .06; hg.add(new THREE.Mesh(new THREE.SphereGeometry(1.15, 48, 24, 0, Math.PI * 2, 0, Math.PI * .5), m));
      const vg = new THREE.RingGeometry(1.08, 1.9, 40, 1, Math.PI * 1.5 - .95, 1.9); vg.rotateX(-Math.PI / 2); vg.translate(0, 0, -1.1); const v = new THREE.Mesh(vg, new THREE.MeshStandardMaterial({ color: lin(shade(HC || '#3d428b', -.15)), roughness: .7, side: THREE.DoubleSide })); const vp = new THREE.Group(); vp.position.set(0, 0, 1.1); vp.rotation.x = .22; vp.add(v); hg.add(vp); hg.add(ellip(m, .07, [1, .6, 1], [0, 1.15, 0])); }
    else if (hat === 'beret') { hg.add(ellip(std(HC || '#b23a48', .85), 1, [1.26, .34, 1.2], [.12, .74, -.1], [-.15, 0, -.22], 40)); hg.add(ellip(std(HC || '#b23a48', .85), .06, [1, 1.6, 1], [.04, 1.15, -.12])); }
    else if (hat === 'bucket') { const m = new THREE.MeshStandardMaterial({ color: lin(HC || '#efe4cf'), roughness: .9, side: THREE.DoubleSide }); hg.rotation.x = -.16; hg.position.y = .1; hg.add(new THREE.Mesh(new THREE.SphereGeometry(1.14, 48, 24, 0, Math.PI * 2, 0, Math.PI * .44), m)); const br = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.45, .3, 48, 1, true), m); br.position.y = .1; hg.add(br); }
    else if (hat === 'headband' || hat === 'bow') { const arc = Math.PI * 1.1, tg = new THREE.TorusGeometry(1.11, .065, 12, 64, arc); tg.rotateZ(Math.PI / 2 - arc / 2); const band = new THREE.Mesh(tg, std(HC || (hat === 'bow' ? '#2b2350' : '#ff8fb1'), .4)); hg.add(band); hg.rotation.x = -.42; hg.position.y = .05;
      if (hat === 'bow') { const b = new THREE.Group(), bm = std('#ff6f91', .45); for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.ConeGeometry(.2, .42, 16), bm); c.rotation.z = s * Math.PI / 2; c.position.x = s * .2; c.scale.z = .5; b.add(c); } b.add(ellip(bm, .09, [1, 1, .8], [0, 0, 0])); b.position.set(.55, .96, .1); b.rotation.set(0, .4, -.55); hg.add(b); } }
    else if (hat === 'crown') { hg.rotation.x = -.45; hg.position.y = .42; const cols = ['#ffb3c7', '#fff1f5', '#c7b3ff', '#ffd27f'], N = 11, leaf = std('#6fa86a', .7);
      hg.add(new THREE.Mesh(new THREE.TorusGeometry(1.0, .03, 8, 60), leaf).rotateX(Math.PI / 2));
      for (let k = 0; k < N; k++) { const a = k / N * Math.PI * 2, f = new THREE.Group(), pm = std(cols[k % 4], .6); for (let p = 0; p < 5; p++) { const pa = p / 5 * Math.PI * 2; f.add(ellip(pm, .075, [1, 1, .5], [Math.cos(pa) * .09, Math.sin(pa) * .09, 0])); } f.add(ellip(std('#f2c14e', .5), .055, [1, 1, .6], [0, 0, .02]));
        f.position.set(Math.sin(a) * 1.04, .02, Math.cos(a) * 1.04); f.lookAt(Math.sin(a) * 3, .02, Math.cos(a) * 3); hg.add(f); hg.add(ellip(leaf, .07, [1.6, .5, .5], [Math.sin(a + .28) * 1.03, 0, Math.cos(a + .28) * 1.03], [0, a + .28, 0])); } }
    else if (hat === 'headphones') { const dm = std(HC || '#2a2545', .45), am = std('#b48cff', .35, .2, { emissive: lin('#6b4fd8'), emissiveIntensity: .35 }); const tg = new THREE.TorusGeometry(1.17, .07, 12, 48, Math.PI); const band = new THREE.Mesh(tg, dm); band.rotation.x = -.08; hg.add(band);
      for (const s of [-1, 1]) { const cup = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .22, 32), dm); cup.rotation.z = Math.PI / 2; cup.position.set(s * 1.13, -.06, 0); hg.add(cup); const ring = new THREE.Mesh(new THREE.TorusGeometry(.22, .035, 8, 28), am); ring.rotation.y = Math.PI / 2; ring.position.set(s * 1.25, -.06, 0); hg.add(ring); } }
    else if (hat === 'takiya') { const c = mk(512, 256), g = c.getContext('2d'); g.fillStyle = HC || '#2b2350'; g.fillRect(0, 0, 512, 256); g.strokeStyle = '#e2b860'; g.lineWidth = 5;
      for (let x = 0; x < 512; x += 64) { g.beginPath(); g.arc(x + 20, 150, 18, Math.PI * .2, Math.PI * 1.7); g.stroke(); g.beginPath(); g.arc(x + 44, 150, 18, Math.PI * 1.3, Math.PI * 2.8); g.stroke(); g.beginPath(); g.moveTo(x + 32, 40); g.lineTo(x + 32, 110); g.stroke(); }
      g.fillStyle = '#e2b860'; g.fillRect(0, 226, 512, 10); const tm = new THREE.MeshStandardMaterial({ map: ctex(c), roughness: .8 });
      hg.rotation.x = -.14; hg.position.y = .02; hg.add(new THREE.Mesh(new THREE.SphereGeometry(1.135, 48, 16, 0, Math.PI * 2, 0, Math.PI * .31), tm)); }
    root.traverse(o => { if (o.userData.top) o.visible = false; });
  }
  // шея
  const nk = cfg.neck;
  if (nk !== 'none') {
    const ng = new THREE.Group(); root.add(ng); const gold = std('#e0b860', .3, .9);
    if (nk === 'necklace') { const yF = 1.12, zF = B.zAt(yF) + .03; let R = .5; if (zF > R - .05) R = zF + .1; const a = Math.acos(zF / R), yC = yF + R * Math.sin(a);
      const t = new THREE.Mesh(new THREE.TorusGeometry(R, .013, 8, 64), gold); t.rotation.x = Math.PI / 2 - a; t.position.set(0, yC, 0); ng.add(t); const p = ellip(std(NC || '#b48cff', .15, .3), .06, [1, 1.3, .6], [0, yF - .07, zF + .02]); ng.add(p); }
    else if (nk === 'choker') { const t = new THREE.Mesh(new THREE.TorusGeometry(B.fem ? .215 : .255, .04, 10, 40), std(NC || '#1d1a22', .5)); t.rotation.x = Math.PI / 2; t.position.y = 1.7; ng.add(t); ng.add(ellip(gold, .035, [1, 1, .6], [0, 1.64, B.fem ? .25 : .29])); }
    else if (nk === 'scarf') { const sm = std(NC || '#c95b5b', .9), t = new THREE.Mesh(new THREE.TorusGeometry(.42, .17, 14, 40), sm); t.rotation.x = Math.PI / 2 - .25; t.position.set(0, 1.46, .04); ng.add(t); const z = B.zAt(.85) + .08, tail = new THREE.Mesh(new THREE.BoxGeometry(.3, 1.0, .08), sm); tail.position.set(-.3, .85, z); tail.rotation.set(-.12, 0, .1); ng.add(tail); }
    else if (nk === 'bowtie') { const bm = std(NC || '#2b2350', .5), y = 1.34, z = B.zAt(y) + .12; for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.ConeGeometry(.12, .22, 4), bm); c.rotation.z = -s * Math.PI / 2; c.position.set(s * .12, y, z); c.scale.z = .5; ng.add(c); } ng.add(ellip(bm, .05, [1, 1, .7], [0, y, z + .01])); }
    else if (nk === 'tie') { const tmat = std(NC || '#5a5b9f', .55), yT = 1.3, yB = .2, zT = B.zAt(yT) + .07, zB = B.zAt(yB) + .05; const sh = new THREE.Shape([new THREE.Vector2(-.06, 0), new THREE.Vector2(.06, 0), new THREE.Vector2(.12, -(yT - yB) * .92), new THREE.Vector2(0, -(yT - yB)), new THREE.Vector2(-.12, -(yT - yB) * .92)]);
      const bl = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: .03, bevelEnabled: false }), tmat); bl.position.set(0, yT - .06, zT); bl.rotation.x = -Math.atan2(zB - zT, yT - yB); ng.add(bl); ng.add(ellip(tmat, .07, [1.2, 1, .7], [0, yT, zT + .02])); }
  }
}
function buildAvatar(cfg, o = {}) {
  const fem = cfg.gender === 'female', B = Body(fem), root = new THREE.Group(), res = o.low ? 1024 : 2048;
  const skin = AV.SKIN[cfg.skin], skinMat = std(skin, .72);
  const head = new THREE.Group(); head.position.y = Y_HEAD; head.scale.setScalar(HS); root.add(head); root.userData.head = head;
  const deform = headDeform(cfg.face, fem), hg = new THREE.SphereGeometry(1, 72, 48, -Math.PI / 2); deformGeo(hg, deform);
  const faceTex = ctex(drawFace(cfg, res, false)), headMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: .68 });
  const hm = new THREE.Mesh(hg, headMat); head.add(hm); root.userData.headMat = headMat; root.userData.faceTex = faceTex;
  if (!o.low) { root.userData.blinkTex = ctex(drawFace(cfg, 1024, true)); }
  const nose = ellip(skinMat, .075, [.9, 1, .55], [0, -.3, .96]); nose.position.z = deform(0, -.3, .96)[2] - .01; head.add(nose);
  for (const s of [-1, 1]) { const ev = deform(...dirOf(s * Math.PI / 2, 1.78)); head.add(ellip(skinMat, .2, [.55, 1.05, .8], [ev[0] + s * .02, ev[1], ev[2] + .02], [0, s * .25, s * -.08])); }
  const neckCloth = cfg.clothes === 'turtleneck', C = colOf(AV.CLOTHC, cfg.clothesColor);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(fem ? .19 : .23, fem ? .23 : .28, .75, 28), neckCloth ? std(C, .9) : skinMat); neck.position.y = 1.6; root.add(neck);
  if (neckCloth) { const rib = new THREE.Mesh(new THREE.TorusGeometry(fem ? .25 : .3, .07, 10, 36), std(shade(C, -.1), .9)); rib.rotation.x = Math.PI / 2; rib.position.y = 1.44; root.add(rib); }
  const tg = new THREE.LatheGeometry(B.pts, 72, Math.PI, Math.PI * 2), tp = tg.attributes.position;
  for (let i = 0; i < tp.count; i++) { let x = tp.getX(i) * B.SX, y = tp.getY(i), z = tp.getZ(i) * SZ; if (fem && z > 0) { for (const s of [-1, 1]) z += .085 * Math.exp(-((x - s * .36) ** 2 / .09 + (y - .4) ** 2 / .11)) * Math.min(1, z * 3); } tp.setXYZ(i, x, y, z); }
  tg.computeVertexNormals();
  const torsoTex = ctex(drawTorso(cfg, B, o.low ? 512 : 1024)); root.add(new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ map: torsoTex, roughness: .86 })));
  const k = cfg.clothes; if (false) { const col = k === 'kamzol' ? '#f3f1f8' : k === 'stripes' ? C : shade(C, k === 'varsity' ? -.2 : -.12); const ring = new THREE.Mesh(new THREE.TorusGeometry(fem ? .29 : .33, .05, 10, 36), std(col, .85)); ring.rotation.x = Math.PI / 2 - .12; ring.position.set(0, 1.4, .02); root.add(ring); }
  if (k === 'hoodie') { const arc = Math.PI * 1.3, hdg = new THREE.TorusGeometry(.56, .2, 14, 36, arc); hdg.rotateZ(Math.PI / 2 - arc / 2); hdg.rotateX(-Math.PI / 2); const hood = new THREE.Mesh(hdg, std(C, .9)); hood.position.set(0, 1.38, -.06); hood.scale.set(1.12, 1, .92); root.add(hood); root.add(ellip(std(C, .9), 1, [.72, .42, .3], [0, 1.52, -.6])); for (const s of [-1, 1]) { const z = B.zAt(.85) + .02, st = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .6, 6), std('#f3f1f8', .7)); st.position.set(s * .17, .98, z); st.rotation.x = -.18; root.add(st); } }
  if (k === 'blouse') for (const s of [-1, 1]) root.add(ellip(std(C, .85), .43, [1, .82, .95], [s * B.AX, B.shY - .05, 0]));
  const armPts = new THREE.SplineCurve([[.17, -2.6], [.19, -1.9], [.21, -1.35], [.2, -1.15], [.23, -.9], [.26, -.45], [.29, -.1], [.28, .14], [.2, .28], [.02, .33]].map(p => new THREE.Vector2(p[0], p[1]))).getSpacedPoints(40);
  const sleeveCol = k === 'varsity' ? '#efe7d6' : (k === 'kamzol' || k === 'overalls') ? '#f3f1f8' : C;
  const armTex = ctex(drawArm(cfg, SLEEVE[k] || 0, sleeveCol)), armMat = new THREE.MeshStandardMaterial({ map: armTex, roughness: .8 });
  for (const s of [-1, 1]) { const ag = new THREE.LatheGeometry(armPts, 28); const a = new THREE.Mesh(ag, armMat); a.position.set(s * B.AX, B.shY, 0); a.rotation.z = s * B.tilt; a.scale.set(fem ? .9 : 1, 1, .95); root.add(a); }
  const hair = buildHair(cfg, B, deform); head.add(hair);
  buildAccessories(cfg, B, deform, head, root);
  return root;
}

// ---------- сцена: свет, камера, вращение ----------
function addLights(scene) {
  scene.add(new THREE.HemisphereLight(lin('#ddd8ff'), lin('#3a2f5c'), .8));
  const key = new THREE.DirectionalLight(lin('#fff3e8'), 1.0); key.position.set(3, 5, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(lin('#a88cff'), 1.0); rim.position.set(-4, 3, -5); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(lin('#ffb8e6'), .45); rim2.position.set(5, 1, -4); scene.add(rim2);
  const fill = new THREE.DirectionalLight(lin('#cfd6ff'), .3); fill.position.set(-5, 0, 4); scene.add(fill);
}
const VIEWS = { full: [1.0, 10.4, 0], hair: [Y_HEAD - .55, 6.6, 0], head: [Y_HEAD + .08, 4.3, 0], face: [Y_HEAD - .03, 2.85, 0], eyes: [Y_HEAD - .1, 1.65, 0], body: [.9, 9.6, 0], neck: [1.7, 5.0, 0] };
const Thumbs = {
  ready: false, cache: new Map(), q: [], busy: false,
  init() { const r = this.r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r.outputEncoding = THREE.sRGBEncoding; r.setPixelRatio(1); r.setSize(176, 176); this.scene = new THREE.Scene(); addLights(this.scene); this.cam = new THREE.PerspectiveCamera(28, 1, .1, 100); this.ready = true; },
  shot(cfg, view, yaw = 0, w = 176, h = 176) {
    const key = view + '|' + yaw + '|' + w + '|' + JSON.stringify(cfg); if (this.cache.has(key)) return this.cache.get(key);
    if (!this.ready) this.init(); const g = buildAvatar(cfg, { low: true }); g.rotation.y = yaw; this.scene.add(g);
    this.r.setSize(w, h); const [ty, d] = VIEWS[view]; this.cam.aspect = w / h; this.cam.fov = 28; this.cam.position.set(0, ty + d * .04, d); this.cam.lookAt(0, ty, 0); this.cam.updateProjectionMatrix();
    this.r.render(this.scene, this.cam); const url = this.r.domElement.toDataURL('image/png'); this.scene.remove(g); disposeTree(g); this.cache.set(key, url); return url;
  },
  // очередь: рисуем превью по одному, не блокируя интерфейс
  request(cfg, view, yaw, el, w, h) { const key = view + '|' + yaw + '|' + (w || 176) + '|' + JSON.stringify(cfg); if (this.cache.has(key)) { setImg(el, this.cache.get(key)); return; } this.q.push({ cfg, view, yaw, el, w, h }); if (!this.busy) this.pump(); },
  async pump() { this.busy = true; while (this.q.length) { const j = this.q.shift(); if (!j.el.isConnected) continue; try { setImg(j.el, this.shot(j.cfg, j.view, j.yaw, j.w, j.h)); } catch (e) { console.warn(e); } await raf(); } this.busy = false; },
  clearQueue() { this.q = []; }
};
function setImg(el, url) { if (el.tagName === 'IMG') { el.src = url; return; } const im = document.createElement('img'); im.src = url; im.alt = ''; im.className = el.className.replace('ph', '').trim(); if (el.id) im.id = el.id; el.replaceWith(im); }

const Stage = {
  ok: false, rotY: 0, vel: 0, drag: null, lastInteract: 0, mode: 'builder',
  init() {
    if (this.ok) return true; if (!window.THREE) return false;
    try { const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); r.outputEncoding = THREE.sRGBEncoding; r.setPixelRatio(Math.min(2, devicePixelRatio || 1)); r.domElement.className = 'three'; }
    catch (e) { console.warn(e); return false; }
    this.scene = new THREE.Scene(); addLights(this.scene); this.cam = new THREE.PerspectiveCamera(28, 1, .1, 100); this.pivot = new THREE.Group(); this.scene.add(this.pivot);
    const cv = this.renderer.domElement;
    cv.addEventListener('pointerdown', e => { this.drag = { x: e.clientX, y: e.clientY, t: performance.now(), lx: e.clientX, moved: 0 }; this.vel = 0; cv.setPointerCapture(e.pointerId); this.lastInteract = performance.now(); });
    cv.addEventListener('pointermove', e => { this.mx = (e.clientX / innerWidth - .5); if (!this.drag) return; const dx = e.clientX - this.drag.lx; this.drag.lx = e.clientX; this.drag.moved += Math.abs(dx); this.rotY += dx * .011; this.vel = dx * .011; this.lastInteract = performance.now(); });
    cv.addEventListener('pointerup', e => { const d = this.drag; this.drag = null; if (d && d.moved < 7 && performance.now() - d.t < 450 && this.onTap) { const hit = this.hitAvatar(e); if (hit) this.onTap(); } });
    cv.addEventListener('pointercancel', () => this.drag = null);
    addEventListener('resize', () => this.resize());
    const loop = now => { requestAnimationFrame(loop); this.tick(now); }; requestAnimationFrame(loop);
    this.ok = true; return true;
  },
  hitAvatar(e) { if (!this.avatar) return false; const rc = this.renderer.domElement.getBoundingClientRect(); const v = new THREE.Vector2((e.clientX - rc.left) / rc.width * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1); const ray = new THREE.Raycaster(); ray.setFromCamera(v, this.cam); return ray.intersectObject(this.avatar, true).length > 0; },
  mount(el, mode) { this.mode = mode; this.host = el; el.appendChild(this.renderer.domElement); this.resize(); },
  resize() { if (!this.host) return; const w = this.host.clientWidth, h = this.host.clientHeight; if (!w || !h) return; this.renderer.setSize(w, h, false); this.cam.aspect = w / h; this.frame(); },
  frame() { const a = this.cam.aspect, home = this.mode === 'home', half = home ? 2.75 : 2.55, tn = Math.tan(14 * Math.PI / 180); let d = half / tn; const wneed = (home ? 2.3 : 2.1) / (tn * a); d = Math.max(d, wneed); this.dist = d; this.camY = home ? .98 : 1.0; if (!this.diving) { this.cam.fov = 28; this.cam.position.set(0, this.camY + .3, d); this.cam.lookAt(0, this.camY, 0); this.cam.updateProjectionMatrix(); } },
  setAvatar(cfg) {
    if (!this.ok) return; if (this.avatar) { this.pivot.remove(this.avatar); disposeTree(this.avatar); if (this.avatar.userData.blinkTex) this.avatar.userData.blinkTex.dispose(); }
    this.avatar = buildAvatar(cfg); this.pivot.add(this.avatar);
    const bb = new THREE.Box3().setFromObject(this.avatar.userData.head); this.topY = Math.min(bb.max.y, Y_HEAD + 1.25);
  },
  rotateBy(a) { this.rotTarget = this.rotY + a; this.lastInteract = performance.now(); },
  tick(now) {
    if (!this.host || !this.avatar) return; const sc = this.host.closest('.screen'); if (!sc || !sc.classList.contains('active')) return;
    const t = now / 1000;
    if (this.rotTarget !== undefined) { this.rotY += (this.rotTarget - this.rotY) * .12; if (Math.abs(this.rotTarget - this.rotY) < .002) this.rotTarget = undefined; }
    else if (!this.drag) { this.rotY += this.vel; this.vel *= .93; if (this.mode === 'home' && now - this.lastInteract > 3000) { const base = Math.round(this.rotY / (Math.PI * 2)) * Math.PI * 2; this.rotY += (base + Math.sin(t * .35) * .32 - this.rotY) * .02; } }
    this.pivot.rotation.y = this.rotY; Cosmos.follow(this.rotY);
    const A = this.avatar, h = A.userData.head; h.position.y = Y_HEAD + Math.sin(t * 1.6) * .015; h.rotation.x = Math.sin(t * .7) * .025; h.rotation.z = Math.sin(t * .5) * .02;
    if (this.mode === 'home' && this.mx !== undefined) h.rotation.y += (this.mx * .5 - h.rotation.y) * .05; else h.rotation.y *= .9;
    A.scale.set(1, 1 + Math.sin(t * 1.6) * .004, 1);
    if (A.userData.blinkTex) { if (!this.nextBlink || now > this.nextBlink + 140) { if (this.nextBlink) A.userData.headMat.map = A.userData.faceTex; this.nextBlink = now + 2200 + Math.random() * 3200; } else if (now > this.nextBlink) A.userData.headMat.map = A.userData.blinkTex; }
    if (this.diving) { const k = clamp((now - this.diving.t0) / 1300), e = k * k * (3 - 2 * k); const d = lerp(this.dist, .9, e); this.cam.position.set(0, lerp(this.camY + .3, Y_HEAD + .05, e), d); this.cam.lookAt(0, lerp(this.camY, Y_HEAD, e), 0); this.cam.fov = lerp(28, 50, e * e); this.cam.updateProjectionMatrix(); if (k >= 1 && !this.diving.done) { this.diving.done = 1; this.diving.cb(); } }
    this.renderer.render(this.scene, this.cam);
    if (this.mode === 'home' && this.nameEl) { const v = new THREE.Vector3(0, this.topY + .22, 0).project(this.cam); this.nameEl.style.left = ((v.x + 1) / 2 * this.host.clientWidth) + 'px'; const titleB = ($('#home .diary-title').getBoundingClientRect().bottom - this.host.getBoundingClientRect().top) + 58 + this.nameEl.offsetHeight; this.nameEl.style.top = Math.max(titleB, (1 - v.y) / 2 * this.host.clientHeight) + 'px'; }
  },
  dive(cb) { this.diving = { t0: performance.now(), cb }; this.rotTarget = Math.round(this.rotY / (Math.PI * 2)) * Math.PI * 2; },
  resetCam() { this.diving = null; this.frame(); }
};

// ===================== Альбомы (свои и общие) =====================
// Хранятся на устройстве. Общий альбом: владелец добавляет почты участников — альбом появляется у них.
// Синхронизация между разными устройствами потребует сервера (см. README).
const Albums = {
  view: 'list', cur: null, draft: null, urls: new Map(),
  all() { return Store.get('dml.albums', []); },
  save(list) { Store.set('dml.albums', list); },
  mine() { const u = me(); if (!u) return []; return this.all().filter(a => a.owner === u.uid || (a.shared && (a.members || []).includes(u.email))); },
  forgetDay(id) { const L = this.all(); L.forEach(a => { a.items = a.items.filter(x => x.d !== id); if (a.cover && a.cover.d === id) a.cover = null; }); this.save(L); },
  async dayMap() { await App.dbReady; const m = new Map(); (await DB.all()).forEach(d => { if (d.frames) m.set(d.id, d); }); return m; },
  url(d, i) { const k = d.id + '#' + i; if (!this.urls.has(k)) this.urls.set(k, URL.createObjectURL(d.photos[i] || d.photos[0])); return this.urls.get(k); },
  open() { this.view = 'list'; this.render(); $('#albums').classList.add('open'); },
  close() { $('#albums').classList.remove('open'); },
  async render() {
    const P = $('#aPanel'), u = me(), map = await this.dayMap();
    if (this.view === 'list') {
      const L = this.mine();
      P.innerHTML = `<button class="x" id="aX">✕</button><h3>${t('albums')}</h3><p class="note">${t('albumsSub')}</p>
        <div class="alist"><div class="acard new" id="aNew"><div class="ac">+</div><b>${t('newAlbum')}</b></div>
        ${L.map(a => { const c = a.cover || a.items[0], d = c && map.get(c.d); return `<div class="acard" data-a="${a.id}"><div class="ac">${d ? `<img src="${this.url(d, c.i)}" alt="">` : ''}${a.shared ? `<span class="sh">👥 ${t('shared')}</span>` : ''}</div><b>${esc(a.name)}</b><small>${a.items.length} ${t('photosN')}${a.owner !== u.uid ? ' · ' + esc(a.ownerName || '') : ''}</small></div>`; }).join('')}</div>`;
      $('#aNew').onclick = () => { this.draft = { id: 'al' + Date.now().toString(36), name: '', owner: u.uid, ownerName: u.name, shared: false, members: [], items: [], cover: null, created: Date.now() }; this.view = 'edit'; this.render(); };
      $$('[data-a]', P).forEach(el => el.onclick = () => { this.cur = el.dataset.a; this.view = 'album'; this.render(); });
    } else if (this.view === 'album') {
      const a = this.all().find(x => x.id === this.cur); if (!a) { this.view = 'list'; return this.render(); }
      const own = a.owner === u.uid;
      P.innerHTML = `<button class="x" id="aX">✕</button><button class="btn ghost small" id="aBack">← ${t('albums')}</button><h3 style="margin-top:12px">${esc(a.name)}</h3>
        <p class="note">${a.shared ? '👥 ' + t('sharedWith') + ': ' + esc([a.ownerName].concat(a.members || []).join(', ')) : t('privateAlbum')}</p>
        ${own || a.shared ? `<div class="row" style="margin-top:10px"><button class="btn ghost small" id="aEdit">✎ ${t('editAlbum')}</button></div>` : ''}
        <div class="agrid">${a.items.map((x, k) => { const d = map.get(x.d); return d ? `<figure data-k="${k}"><img src="${this.url(d, x.i)}" alt=""><figcaption>${fmtDay(d.date)} ${d.date.slice(0, 4)}</figcaption></figure>` : ''; }).join('')}</div>`;
      $('#aBack').onclick = () => { this.view = 'list'; this.render(); };
      if ($('#aEdit')) $('#aEdit').onclick = () => { this.draft = JSON.parse(JSON.stringify(a)); this.view = 'edit'; this.render(); };
      $$('.agrid figure', P).forEach(f => f.onclick = () => { const x = a.items[+f.dataset.k], d = map.get(x.d); if (!d) return; this.close(); Memory.open(d, x.i); });
    } else {
      const a = this.draft, own = a.owner === u.uid, mine = [...map.values()].filter(d => d.owner === u.uid).sort((x, y) => x.date < y.date ? 1 : -1);
      const has = (d, i) => a.items.some(x => x.d === d && x.i === i), isCover = (d, i) => a.cover && a.cover.d === d && a.cover.i === i;
      P.innerHTML = `<button class="x" id="aX">✕</button><button class="btn ghost small" id="aBack">← ${t('back')}</button>
        <label class="f">${t('albumName')}</label><input type="text" id="aName" maxlength="40" value="${esc(a.name)}" placeholder="${t('albumNamePh')}">
        <label class="f">${t('pickDays')}</label><div class="seg" id="aMode"><button type="button" data-mode="pick" class="${this.mode !== 'cover' ? 'on' : ''}">✓ ${t('pickPhotos2')}</button><button type="button" data-mode="cover" class="${this.mode === 'cover' ? 'on' : ''}">★ ${t('pickCover')}</button></div>
        <div class="pickgrid">${mine.map(d => d.photos.map((b, i) => `<button type="button" data-d="${d.id}" data-i="${i}" class="${has(d.id, i) ? 'on' : ''} ${isCover(d.id, i) ? 'cover' : ''}"><img src="${this.url(d, i)}" alt=""><small>${fmtDay(d.date)}</small></button>`).join('')).join('')}</div>
        ${own ? `<label class="f">${t('shareL')}</label><label class="row" style="gap:10px;cursor:pointer"><input type="checkbox" id="aShared" ${a.shared ? 'checked' : ''}> ${t('shareToggle')}</label>
        <div id="aMembers" class="${a.shared ? '' : 'hidden'}"><div class="row" style="flex-wrap:nowrap;margin-top:8px"><input type="email" id="aEmail" placeholder="friend@gmail.com"><button type="button" class="btn ghost" id="aAdd">+</button></div>
        <div class="chips">${(a.members || []).map((m, k) => `<span class="chip">${esc(m)}<button type="button" data-rmm="${k}">✕</button></span>`).join('')}</div><p class="note" style="margin-top:8px">${t('shareNote')}</p></div>` : ''}
        <div class="err" id="aErr"></div>
        <div class="row" style="margin-top:12px"><button class="btn primary" id="aSave">${t('saveAlbum')}</button>${own && this.all().some(x => x.id === a.id) ? `<button class="btn danger small" id="aDel">${t('deleteAlbum')}</button>` : ''}</div>`;
      const keep = () => { a.name = $('#aName').value; };
      $('#aBack').onclick = () => { this.view = this.all().some(x => x.id === a.id) ? 'album' : 'list'; this.cur = a.id; this.render(); };
      $$('#aMode button').forEach(b => b.onclick = () => { keep(); this.mode = b.dataset.mode; this.render(); });
      $$('.pickgrid button', P).forEach(b => b.onclick = () => { keep(); const d = b.dataset.d, i = +b.dataset.i;
        if (this.mode === 'cover') { if (!has(d, i)) a.items.push({ d, i }); a.cover = { d, i }; }
        else { if (has(d, i)) { a.items = a.items.filter(x => !(x.d === d && x.i === i)); if (isCover(d, i)) a.cover = null; } else a.items.push({ d, i }); }
        const st = $('.pickgrid', P).scrollTop; this.render().then(() => { const g = $('.pickgrid', $('#aPanel')); if (g) g.scrollTop = st; }); });
      if ($('#aShared')) { $('#aShared').onchange = e => { keep(); a.shared = e.target.checked; this.render(); };
        $('#aAdd').onclick = () => { keep(); const v = $('#aEmail').value.trim().toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { $('#aErr').textContent = t('errEmail'); return; } if (!a.members.includes(v) && v !== u.email) a.members.push(v); this.render(); };
        $$('[data-rmm]', P).forEach(b => b.onclick = () => { keep(); a.members.splice(+b.dataset.rmm, 1); this.render(); }); }
      $('#aSave').onclick = () => { keep(); if (!a.name.trim()) { $('#aErr').textContent = t('errAlbumName'); return; } if (!a.items.length) { $('#aErr').textContent = t('errAlbumEmpty'); return; } const L = this.all().filter(x => x.id !== a.id); L.push(a); this.save(L); this.cur = a.id; this.view = 'album'; this.mode = 'pick'; toast(t('albumSaved')); this.render(); };
      if ($('#aDel')) $('#aDel').onclick = e => { if (!e.target.dataset.arm) { e.target.dataset.arm = 1; e.target.textContent = t('deleteConfirm'); return; } this.save(this.all().filter(x => x.id !== a.id)); this.view = 'list'; this.render(); };
    }
    $('#aX').onclick = () => this.close();
  }
};

// ===================== Телепорт: ускорение, засасывание по краям, вспышка =====================
const Warp = {
  run(stageEl, cb) {
    const c = $('#warp'), d = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight; c.width = W * d; c.height = H * d; c.style.display = 'block';
    const g = c.getContext('2d'), cx = W / 2, cy = H * .42, R = Math.hypot(W, H) * .6, r = mulberry32(99), streaks = [];
    for (let i = 0; i < 260; i++) streaks.push({ a: r() * Math.PI * 2, d: .3 + r() * .9, w: .6 + r() * 2.2, gold: r() < .65 });
    const t0 = performance.now(), T = 1550; let fired = false;
    const frame = now => {
      const k = clamp((now - t0) / T), e = Math.pow(k, 2.4);
      g.setTransform(d, 0, 0, d, 0, 0); g.clearRect(0, 0, W, H);
      // засасывание: края темнеют и «смыкаются», закручиваясь к центру
      const hole = R * (1.15 - e * .95), vg = g.createRadialGradient(cx, cy, hole * .55, cx, cy, hole);
      vg.addColorStop(0, 'rgba(20,6,22,0)'); vg.addColorStop(1, `rgba(16,4,18,${.55 + e * .45})`); g.fillStyle = vg; g.fillRect(0, 0, W, H);
      g.fillStyle = `rgba(16,4,18,${Math.min(1, e * 1.1)})`; g.beginPath(); g.rect(0, 0, W, H); g.arc(cx, cy, Math.max(4, hole), 0, Math.PI * 2, true); g.fill();
      // световые полосы, летящие к центру с ускорением
      g.lineCap = 'round';
      for (const s of streaks) { const a = s.a + e * 2.2 * (1 - s.d * .5); const dist = R * (1 - ((s.d + e * 2.8) % 1)); const len = 8 + e * 260 * s.d; const x1 = cx + Math.cos(a) * dist, y1 = cy + Math.sin(a) * dist, x2 = cx + Math.cos(a - .04 * e) * Math.max(0, dist - len), y2 = cy + Math.sin(a - .04 * e) * Math.max(0, dist - len);
        g.strokeStyle = s.gold ? `rgba(255,214,150,${.25 + e * .6})` : `rgba(255,250,240,${.2 + e * .6})`; g.lineWidth = s.w * (1 + e * 2); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
      // аватар втягивается внутрь
      if (stageEl) { stageEl.style.transform = `scale(${1 + e * 2.6}) rotate(${e * 14}deg)`; stageEl.style.filter = `blur(${e * 7}px) brightness(${1 + e * 1.4})`; stageEl.style.opacity = String(1 - Math.max(0, (k - .7) / .3)); }
      // вспышка
      if (k > .72) { const f = (k - .72) / .28, fg = g.createRadialGradient(cx, cy, 0, cx, cy, R * (.2 + f)); fg.addColorStop(0, `rgba(255,252,240,${f})`); fg.addColorStop(.4, `rgba(255,220,160,${f * .9})`); fg.addColorStop(1, `rgba(255,200,150,${f * .6})`); g.fillStyle = fg; g.fillRect(0, 0, W, H); }
      if (k < 1) requestAnimationFrame(frame);
      else if (!fired) { fired = true; cb(); const t1 = performance.now(); const fade = now2 => { const f = 1 - clamp((now2 - t1) / 650); g.setTransform(d, 0, 0, d, 0, 0); g.clearRect(0, 0, W, H); g.fillStyle = `rgba(255,246,228,${f})`; g.fillRect(0, 0, W, H); if (f > 0) requestAnimationFrame(fade); else { c.style.display = 'none'; if (stageEl) { stageEl.style.transform = ''; stageEl.style.filter = ''; stageEl.style.opacity = ''; } } }; requestAnimationFrame(fade); }
    };
    requestAnimationFrame(frame);
  }
};

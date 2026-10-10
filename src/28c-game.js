
/* =================== LE JEU : niveaux, coffres, jokers, quêtes =================== */
const ITEMS = {
  ff:{l:'Joker 50/50', s:'50/50', d:'Retire deux mauvaises réponses d’un QCM.', ic:'half'},
  sc:{l:'Seconde chance', s:'2e chance', d:'Une erreur pardonnée dans un quiz : tu peux répondre à nouveau.', ic:'heart'},
  boost:{l:'Booster ×2', s:'Booster', d:'Double tout ton XP pendant 15 minutes.', ic:'bolt'},
  shield:{l:'Bouclier de série', s:'Bouclier', d:'Protège ta série si tu rates un jour.', ic:'shield'}
};
/* Récompenses en arrivant à chaque niveau (index = niveau − 1) : de plus en plus grosses. */
const REW = [null,
  {ff:1, sc:1},
  {ff:1, sc:1, boost:1, skin:'lavande'},
  {ff:2, sc:1, shield:1},
  {ff:2, sc:2, boost:1, skin:'rubis'},
  {ff:2, sc:2, shield:1, fx:'etoiles'},
  {ff:3, sc:2, boost:2, skin:'or'},
  {ff:3, sc:3, shield:2},
  {ff:4, sc:3, boost:2, skin:'holo'},
  {ff:4, sc:3, boost:2, shield:2, fx:'feux'},
  {ff:5, sc:4, boost:3, shield:2},
  {ff:6, sc:5, boost:3, shield:3, skin:'twingo', fx:'couronne'}
];
const PREST_REW = {ff:3, sc:2, boost:1, shield:1};
const WELCOME = {ff:1, sc:1, boost:1};
const FX = {
  etoiles:{l:'Étoiles filantes', d:'Ton sceau scintille d’étoiles.', lv:6},
  feux:{l:'Feux d’artifice', d:'Tes plus beaux scores finissent en feu d’artifice.', lv:10},
  couronne:{l:'La couronne', d:'Une couronne d’or sur ton sceau, partout sur le site.', lv:12}
};
const TIER_COL = {bronze:['#F6C9A0', '#C27A45', '#6E3A16'], argent:['#FFFFFF', '#B9C3D3', '#5B6577'], or:['#FFF4C2', '#E8B73A', '#8A5A00'], diamant:['#E6FDFF', '#7FE3F5', '#3570C9'], legende:['#FFF36B', '#FF8A3D', '#C2185B']};
const TIER_FX = {bronze:['#F6C9A0', '#E39A62', '#FFF1E2', '#C6AEFF'], argent:['#FFFFFF', '#D7DEEA', '#A9B5C9', '#C6AEFF'], or:['#FFE18F', '#FFF4C2', '#E8B73A', '#FFFFFF'], diamant:['#B8F4FF', '#7FE3F5', '#FFFFFF', '#C69CFF'], legende:['#FFF36B', '#FF8A3D', '#FF5A8A', '#C6AEFF', '#62D6A6']};
const lvReached = () => (S.lvlSeen || 0) + 1;
const skinUnlocked = sk => sk.lv <= lvReached();
const fxOn = k => lvReached() >= FX[k].lv;
function sumRew(list){
  const o = {ff:0, sc:0, boost:0, shield:0, skins:[], fx:[]};
  list.forEach(r => { if (!r) return; Object.keys(ITEMS).forEach(k => { o[k] += r[k] || 0; }); if (r.skin) o.skins.push(r.skin); if (r.fx) o.fx.push(r.fx); });
  return o;
}
function grant(o){ Object.keys(ITEMS).forEach(k => { S.inv[k] = (S.inv[k] || 0) + (o[k] || 0); }); save(); }
const rewChips = r => [...Object.keys(ITEMS).filter(k => r[k]).map(k => `<span class="rw" title="${ITEMS[k].l}">${icon(ITEMS[k].ic)}${r[k]}</span>`), r.skin ? `<span class="rw rw-skin" title="Sceau ${skinOf(r.skin).l}">${icon('seal')}${skinOf(r.skin).l}</span>` : '', r.fx ? `<span class="rw rw-fx" title="${FX[r.fx].l}">${icon('sparkle')}${FX[r.fx].l}</span>` : ''].join('');

/* ---------- son (WebAudio, discret) ---------- */
let AC = null;
function audio(){ if (!S.sound) return null; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; } catch(e){ return null; } }
function tone(f, t0, dur, type = 'sine', g = .07, slide = 0){
  const a = audio(); if (!a) return; const t = a.currentTime + t0;
  const o = a.createOscillator(), v = a.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(f * slide, t + dur);
  v.gain.setValueAtTime(.0001, t); v.gain.exponentialRampToValueAtTime(g, t + .015); v.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(v); v.connect(a.destination); o.start(t); o.stop(t + dur + .05);
}
function noise(t0, dur, g = .06, freq = 900){
  const a = audio(); if (!a) return; const t = a.currentTime + t0;
  const b = a.createBuffer(1, Math.max(1, Math.floor(a.sampleRate * dur)), a.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = a.createBufferSource(); s.buffer = b; const fl = a.createBiquadFilter(); fl.type = 'bandpass'; fl.frequency.value = freq; const v = a.createGain(); v.gain.value = g;
  s.connect(fl); fl.connect(v); v.connect(a.destination); s.start(t);
}
const SFX = {
  whoosh(){ noise(0, .5, .07, 1400); },
  boom(){ tone(130, 0, .55, 'sine', .16, .45); noise(0, .3, .1, 300); },
  up(){ [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, .05 + i * .085, .38, 'triangle', .06)); },
  coin(){ tone(1318.5, 0, .1, 'square', .025); tone(1760, .07, .22, 'square', .025); },
  chest(){ noise(0, .12, .05, 260); tone(220, .02, .14, 'triangle', .04); },
  open(){ [392, 523.25, 659.25, 783.99, 1046.5, 1318.5, 1568].forEach((f, i) => tone(f, i * .045, .55, 'sine', .045)); noise(0, .4, .04, 3000); },
  ding(k = 0){ const f = 880 * Math.pow(1.1225, k); tone(f, 0, .55, 'sine', .055); tone(f * 2, 0, .25, 'sine', .02); },
  quest(){ tone(659.25, 0, .22, 'triangle', .06); tone(987.77, .1, .35, 'triangle', .06); },
  rename(){ [392, 493.88, 587.33, 783.99].forEach((f, i) => tone(f, i * .12, .6, 'triangle', .05)); }
};
function sfx(n, k){ try { if (S.sound && SFX[n]) SFX[n](k); } catch(e){} }

/* ---------- médaille de rang ---------- */
function medalSVG(n, tier, crown){
  const t = TIERS[tier].id, c = TIER_COL[t], id = 'md' + Math.random().toString(36).slice(2, 7);
  const pts = []; if (tier >= 2) for (let k = 0; k < 16; k++){ const a = k / 16 * Math.PI * 2, r1 = 58, r2 = 52, a2 = a + Math.PI / 16; pts.push(`${(60 + r1 * Math.cos(a)).toFixed(1)},${(60 + r1 * Math.sin(a)).toFixed(1)} ${(60 + r2 * Math.cos(a2)).toFixed(1)},${(60 + r2 * Math.sin(a2)).toFixed(1)}`); }
  return `<svg viewBox="0 0 120 120" class="medal" data-tier="${t}" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset=".55" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient></defs>
    ${pts.length ? `<polygon points="${pts.join(' ')}" fill="url(#${id})" opacity=".85"/>` : ''}
    <circle cx="60" cy="60" r="${tier >= 2 ? 50 : 54}" fill="url(#${id})"/>
    <circle cx="60" cy="60" r="${tier >= 2 ? 43 : 46}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-dasharray="1.5 4"/>
    <circle cx="60" cy="60" r="${tier >= 2 ? 37 : 40}" fill="${c[2]}" fill-opacity=".3"/>
    <path d="M28 44 Q60 14 92 44" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="7" stroke-linecap="round"/>
    ${n != null ? `<text x="60" y="${n > 9 ? 74 : 77}" text-anchor="middle" font-family="Bodoni Moda, Didot, Georgia, serif" font-weight="800" font-size="${n > 9 ? 40 : 48}" fill="#fff" stroke="${c[2]}" stroke-width="4" paint-order="stroke">${n}</text>` : ''}
    ${crown ? `<path d="M40 22 L45 6 L53 15 L60 2 L67 15 L75 6 L80 22 Z" fill="#FFE18F" stroke="#8A5A00" stroke-width="1.5"/>` : ''}
  </svg>`;
}

/* ---------- particules (étincelles, confettis, feux d’artifice) ---------- */
function fxCanvas(host){
  const cv = document.createElement('canvas'); cv.className = 'fx-cv'; host.appendChild(cv);
  const ctx = cv.getContext('2d'); let P = [], raf = 0, W = 0, H = 0, alive = true;
  const size = () => { const dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener('resize', size);
  const frame = () => {
    if (!alive) return;
    ctx.clearRect(0, 0, W, H);
    for (let i = P.length - 1; i >= 0; i--){
      const p = P[i];
      p.vy += p.g; p.vx *= p.f; p.vy *= p.f; p.x += p.vx; p.y += p.vy; p.l -= p.d;
      if (p.l <= 0 || p.y > H + 40){ P.splice(i, 1); continue; }
      if (p.t === 'c'){
        p.r += p.vr; ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = Math.min(1, p.l * 2); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2))); ctx.restore();
      } else {
        ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.max(0, Math.min(1, p.l));
        if (p.tr){ ctx.strokeStyle = p.c; ctx.lineWidth = p.s * .7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 3.5, p.y - p.vy * 3.5); ctx.stroke(); }
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * (.45 + p.l * .55), 0, 6.2832); ctx.fill();
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  const api = {
    burst(x, y, n, cols, sp = 8, o = {}){ for (let i = 0; i < n; i++){ const a = Math.random() * 6.2832, v = sp * (.3 + Math.random() * .8); P.push({t:'s', x, y, vx:Math.cos(a) * v, vy:Math.sin(a) * v, g:o.g == null ? .05 : o.g, f:.962, l:1, d:.007 + Math.random() * .013, s:1.5 + Math.random() * 2.6, c:cols[i % cols.length], tr:o.tr}); } },
    pop(x, y, n, cols){ for (let i = 0; i < n; i++){ const a = -Math.PI / 2 + (Math.random() - .5) * 2.4, v = 6 + Math.random() * 10; P.push({t:'c', x, y, vx:Math.cos(a) * v, vy:Math.sin(a) * v, g:.3, f:.985, l:1.5, d:.0055, r:Math.random() * 6, vr:(Math.random() - .5) * .35, w:5 + Math.random() * 5, h:8 + Math.random() * 7, c:cols[i % cols.length]}); } },
    rain(n, cols){ for (let i = 0; i < n; i++) P.push({t:'c', x:Math.random() * W, y:-20 - Math.random() * H * .7, vx:(Math.random() - .5) * 2, vy:2 + Math.random() * 3, g:.035, f:.996, l:1.8, d:.0024, r:Math.random() * 6, vr:(Math.random() - .5) * .25, w:6 + Math.random() * 6, h:9 + Math.random() * 8, c:cols[i % cols.length]}); },
    firework(x, y, cols){ api.burst(x, y, 72, cols, 6.8, {g:.055, tr:true}); },
    stop(){ alive = false; cancelAnimationFrame(raf); removeEventListener('resize', size); cv.remove(); }
  };
  return api;
}
function fireworks(k = 3){
  if (reduced()) return;
  const f = fxCanvas($('#fx'));
  const cols = [['#FFE18F', '#FFF4C2', '#F1C36E'], ['#C6AEFF', '#A283FF', '#F3EDFF'], ['#FFB8C9', '#FF8199', '#FFFFFF'], ['#A9E8CE', '#62D6A6', '#FFFFFF']];
  for (let i = 0; i < k; i++) setTimeout(() => f.firework(innerWidth * (.2 + Math.random() * .6), innerHeight * (.14 + Math.random() * .3), cols[i % cols.length]), i * 360);
  setTimeout(() => f.stop(), k * 360 + 2800);
}

/* ---------- la cinématique de passage de niveau ---------- */
let luOpen = false; const luQueue = [];
function lettersHTML(name){
  let i = 0;
  const segs = name.replace(/([a-zà-öø-ÿ])([A-ZÀ-ÖØ-Þ])/g, '$1|$2').replace(/ /g, ' |').split('|');
  return segs.map(sg => `<span class="lu-w">${Array.from(sg).map(ch => `<span class="lu-l" style="--i:${i++}">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('')}</span>`).join('<wbr>');
}
function lootCard(c, i){
  if (c.skin){ const sk = skinOf(c.skin); return `<div class="lu-card lu-card-skin" style="--i:${i}"><div class="lu-cin"><div class="lu-cb"></div><div class="lu-cf"><span class="lu-cs">${sealSVG({ring:false, skin:sk.id})}</span><b>Sceau ${esc(sk.l)}</b><button class="btn btn-sm" data-skin="${sk.id}">Équiper</button></div></div></div>`; }
  if (c.fx){ const f = FX[c.fx]; return `<div class="lu-card lu-card-fx" style="--i:${i}"><div class="lu-cin"><div class="lu-cb"></div><div class="lu-cf"><span class="lu-ci">${icon('sparkle')}</span><b>${f.l}</b><span>${f.d}</span></div></div></div>`; }
  const it = ITEMS[c.k];
  return `<div class="lu-card" style="--i:${i}"><div class="lu-cin"><div class="lu-cb"></div><div class="lu-cf"><span class="lu-ci">${icon(it.ic)}</span><b>×${c.n}</b><span>${it.l}</span></div></div></div>`;
}
function levelCinematic(o){
  luOpen = true;
  const L = LEVELS[o.to], T = TIERS[L.tier], cols = TIER_FX[T.id];
  const rew = o.rew || sumRew([]);
  const cards = [...Object.keys(ITEMS).filter(k => rew[k] > 0).map(k => ({k, n:rew[k]})), ...(rew.skins || []).map(s => ({skin:s})), ...(rew.fx || []).map(f => ({fx:f}))];
  const nums = []; for (let k = Math.max(0, o.from); k <= o.to; k++) nums.push(k + 1);
  const b0 = BONUS[Math.max(0, o.from)], b1 = BONUS[o.to];
  const eyebrow = o.title || (o.stars ? `Étoile de prestige n° ${o.stars}` : o.to - o.from > 1 ? `Niveaux ${o.from + 2} à ${o.to + 1} débloqués` : `Niveau ${o.to + 1} débloqué`);
  const root = document.createElement('div'); root.className = 'lu' + (o.chestOnly ? ' chest-only' : '') + (reduced() ? ' still' : ''); root.dataset.tier = T.id;
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', o.chestOnly ? eyebrow : `${eyebrow} : ${L.name}`);
  root.innerHTML = `<div class="lu-bg"></div><div class="lu-rays"></div><div class="lu-flash"></div>
    <div class="lu-scroll"><div class="lu-stage">
      ${o.chestOnly ? `<div class="lu-eyebrow lu-show">${esc(o.kicker || 'Récompense')}</div><h2 class="lu-ctitle">${esc(eyebrow)}</h2>${o.sub ? `<p class="lu-sub">${o.sub}</p>` : ''}` : `
      <div class="lu-hero"><div class="lu-rings"><i></i><i></i><i></i></div>
        <div class="lu-medal">${medalSVG(null, L.tier, o.to === LEVELS.length - 1)}<div class="lu-num"><span class="lu-roll" style="--k:${nums.length - 1}">${nums.map(n => `<b>${n}</b>`).join('')}</span></div>${o.stars ? `<span class="lu-star">★ ${o.stars}</span>` : ''}</div></div>
      <div class="lu-eyebrow">${esc(eyebrow)} · Rang ${T.l}</div>
      <h2 class="lu-name" aria-label="${esc(L.name)}">${lettersHTML(L.name)}</h2>
      <div class="lu-bonus">${b1 > b0 ? `Bonus XP permanent <b class="lu-b0">+${b0} %</b>${icon('arrow')}<b class="lu-b1">+${b0} %</b>` : `Bonus XP permanent <b class="lu-b1">+${b1} %</b>${b1 >= 50 ? ' · maximum' : ''}`}</div>`}
      ${cards.length ? `<div class="lu-loot"><button class="chest" aria-label="Ouvrir le coffre"><span class="ch-glow"></span><span class="ch-lid"><i></i></span><span class="ch-box"><i></i><b class="ch-lock"></b></span></button><p class="lu-hint">Touche le coffre !</p><div class="lu-cards">${cards.map(lootCard).join('')}</div></div>` : ''}
      <div class="lu-actions"><button class="btn btn-primary" data-lu="close">Continuer</button>${o.chestOnly ? '' : `<button class="btn" data-lu="hub">${icon('trophy')}Mes récompenses</button>`}</div>
    </div></div>
    <button class="lu-skip" data-lu="skip">Passer</button>
    <button class="lu-snd" data-lu="snd" aria-pressed="${!!S.sound}" aria-label="${S.sound ? 'Couper le son' : 'Activer le son'}">${icon(S.sound ? 'volume' : 'mute')}</button>`;
  document.body.appendChild(root);
  const app = $('#app'); if (app) app.inert = true;
  document.documentElement.classList.add('lu-lock');
  const fx = reduced() ? null : fxCanvas(root);
  const timers = []; const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  const add = c => root.classList.add(c);
  const center = sel => { const n = $(sel, root); if (!n) return [innerWidth / 2, innerHeight / 3]; const r = n.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  let opened = false, done = false;
  const countBonus = () => { const b = $('.lu-b1', root); if (!b || b1 <= b0) return; const t0 = performance.now(); const step = t => { const k = clamp((t - t0) / 700, 0, 1); b.textContent = '+' + Math.round(b0 + (b1 - b0) * k) + ' %'; if (k < 1 && root.isConnected) requestAnimationFrame(step); else b.classList.add('pop'); }; requestAnimationFrame(step); };
  const finish = () => { if (done) return; done = true; add('done'); const c = $('[data-lu="close"]', root); if (c) c.focus({preventScroll:true}); };
  const openChest = () => {
    if (opened || !cards.length) return; opened = true; add('open'); sfx('open');
    if (fx){ const [x, y] = center('.chest'); fx.burst(x, y - 20, 90, ['#FFE18F', '#FFF4C2', '#FFFFFF'], 7, {g:.04}); fx.pop(x, y - 30, 70, cols); }
    cards.forEach((c, i) => at(560 + i * 260, () => sfx('ding', i)));
    at(700 + cards.length * 260, finish);
    const lt = $('.lu-loot', root); if (lt && lt.getBoundingClientRect().bottom > innerHeight - 40) at(350, () => lt.scrollIntoView({block:'center', behavior: reduced() ? 'auto' : 'smooth'}));
  };
  const skip = () => {
    timers.forEach(clearTimeout); add('skip');
    ['in', 'drop', 'impact', 'roll', 'title', 'bonus', 'loot'].forEach(add);
    const b = $('.lu-b1', root); if (b) b.textContent = '+' + b1 + ' %';
    if (cards.length && !opened){ opened = true; add('open'); }
    finish();
  };
  const close = go2 => {
    timers.forEach(clearTimeout); root.classList.add('out');
    setTimeout(() => {
      if (fx) fx.stop(); root.remove(); if (app) app.inert = false; document.documentElement.classList.remove('lu-lock'); luOpen = false;
      if (go2) go(go2); else if (ROUTE === 'progres') go('progres', {silent:true, keepScroll:true});
      if (luQueue.length) setTimeout(luQueue.shift(), 250);
    }, 320);
  };
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-lu]');
    if (b){ const a = b.dataset.lu;
      if (a === 'close') close(); else if (a === 'hub') close('progres'); else if (a === 'skip') skip();
      else if (a === 'snd'){ S.sound = !S.sound; save(); b.setAttribute('aria-pressed', S.sound); b.innerHTML = icon(S.sound ? 'volume' : 'mute'); }
      return; }
    if (e.target.closest('.chest')) openChest();
  });
  root.addEventListener('keydown', e => { if (e.key === 'Escape'){ e.preventDefault(); if (done) close(); else skip(); } });
  if (reduced()){ skip(); return; }
  sfx('whoosh');
  add('in');
  if (o.chestOnly){ at(200, () => { add('loot'); sfx('chest'); }); at(1500, openChest); return; }
  at(240, () => add('drop'));
  at(860, () => {
    add('impact'); sfx('boom'); sfx('up');
    const [x, y] = center('.lu-medal'); fx.burst(x, y, 140, cols, 10); fx.pop(x, y, 90, cols);
    if (L.tier >= 4) fx.rain(160, cols);
  });
  at(980, () => add('roll'));
  if (L.tier >= 2) [1500, 1950, 2500].forEach((ms, k) => at(ms, () => { fx.firework(innerWidth * (.18 + Math.random() * .64), innerHeight * (.12 + Math.random() * .25), k % 2 ? cols : ['#FFFFFF', '#FFE18F', '#C6AEFF']); }));
  const tName = 1250, nL = Array.from(L.name).length;
  at(tName, () => add('title'));
  at(tName + nL * 45 + 300, () => { add('bonus'); countBonus(); if (b1 > b0) sfx('coin'); });
  at(tName + nL * 45 + 900, () => { if (cards.length){ add('loot'); sfx('chest'); } else finish(); });
  if (cards.length) at(tName + nL * 45 + 2700, openChest);
}
function checkLevel(){
  if ((S.gameV || 0) < 2) return;
  const lv = levelOf(S.xp);
  const last = LEVELS.length - 1;
  const up = lv.i > (S.lvlSeen || 0), star = lv.i === last && lv.stars > (S.prest || 0);
  if (!up && !star) return;
  const from = S.lvlSeen || 0, list = [];
  for (let k = from + 1; k <= lv.i; k++) list.push(REW[k]);
  const nStars = lv.i === last ? Math.max(0, lv.stars - (S.prest || 0)) : 0;
  for (let k = 0; k < nStars; k++) list.push(PREST_REW);
  const rew = sumRew(list); grant(rew);
  S.lvlSeen = Math.max(from, lv.i); if (lv.i === last) S.prest = lv.stars; save();
  applyFx(); updateChip();
  const play = () => levelCinematic({from: up ? from : lv.i, to:lv.i, rew, stars: up ? 0 : lv.stars});
  if (luOpen) luQueue.push(play); else setTimeout(play, 450);
}

/* ---------- booster, boucliers, effets ---------- */
let boostTick = 0;
function updateBoostPill(){
  const pill = $('#boostPill'); if (!pill) return;
  const left = (S.boostUntil || 0) - Date.now();
  if (left <= 0){ pill.hidden = true; clearInterval(boostTick); boostTick = 0; return; }
  pill.hidden = false;
  const m = Math.floor(left / 60000), s = Math.floor(left % 60000 / 1000);
  pill.innerHTML = `${icon('bolt')}<b>×2</b><span>${m}:${pad2(s)}</span>`;
  pill.setAttribute('aria-label', `Booster ×2 actif : encore ${m} min ${s} s`);
  if (!boostTick) boostTick = setInterval(updateBoostPill, 1000);
}
function activateBoost(ev){
  if (!(S.inv.boost > 0)){ toast('Pas de booster en stock : monte de niveau pour en gagner !'); return; }
  S.inv.boost--; S.boostUntil = Math.max(Date.now(), S.boostUntil || 0) + 15 * 60 * 1000; save();
  updateBoostPill(); sfx('coin'); toast('Booster activé : tout ton XP compte double pendant 15 min !');
  if (!reduced()){ const f = fxCanvas($('#fx')); const r = ev && ev.target && ev.target.getBoundingClientRect ? ev.target.getBoundingClientRect() : {left:innerWidth / 2, top:innerHeight / 2, width:0, height:0}; f.burst(r.left + r.width / 2, r.top + r.height / 2, 60, ['#FFE18F', '#F1C36E', '#FFFFFF'], 6); setTimeout(() => f.stop(), 1800); }
}
function applyShields(){
  if (!(S.inv.shield > 0)) return;
  const today = dayKey(); if (S.days[today]) return;
  const d = new Date(); let missed = 0, lastActive = null;
  for (let i = 1; i <= 40; i++){ d.setDate(d.getDate() - 1); const k = dayKey(d); if (S.days[k]){ lastActive = k; break; } missed++; }
  if (!lastActive || missed < 1 || missed > S.inv.shield) return;
  let before = 0; const e = new Date(lastActive + 'T12:00:00'); for (let i = 0; i < 400; i++){ if (S.days[dayKey(e)]) before++; else break; e.setDate(e.getDate() - 1); }
  if (before < 2) return;
  const f = new Date(); for (let i = 0; i < missed; i++){ f.setDate(f.getDate() - 1); S.days[dayKey(f)] = 'sh'; }
  S.inv.shield -= missed; save();
  setTimeout(() => toast(`${missed > 1 ? missed + ' boucliers utilisés' : 'Bouclier utilisé'} : ta série de ${before + missed} jours est sauvée !`), 900);
}
function applyFx(){
  const r = document.documentElement;
  r.classList.toggle('fx-stars', fxOn('etoiles')); r.classList.toggle('fx-crown', fxOn('couronne'));
}
function refreshSeals(){ const b = $('#brandSeal'); if (b) b.innerHTML = sealSVG({ring:false}); $$('.hero-seal').forEach(h => { h.innerHTML = sealSVG(); }); }
function equipSkin(id){ const sk = skinOf(id); if (!skinUnlocked(sk)) return; S.skin = sk.id; save(); refreshSeals(); toast(`Sceau ${sk.l} équipé`); $$('[data-skin]').forEach(b => { const on = b.dataset.skin === sk.id; b.classList.toggle('on', on); if (b.tagName === 'BUTTON' && b.closest('.lu-card')) b.textContent = on ? 'Équipé ✓' : 'Équiper'; }); }

/* ---------- jokers (dans les quiz) ---------- */
function jokerBar(q, armed){
  return `<div class="jk-bar" role="group" aria-label="Jokers">
    <button class="jk" data-jk="ff" ${q.tf || q._ff || !(S.inv.ff > 0) ? 'disabled' : ''} title="${esc(ITEMS.ff.d)}">${icon('half')}<span>50/50</span><b>${S.inv.ff || 0}</b></button>
    <button class="jk${armed ? ' armed' : ''}" data-jk="sc" aria-pressed="${!!armed}" ${!(S.inv.sc > 0) && !armed ? 'disabled' : ''} title="${esc(ITEMS.sc.d)}">${icon('heart')}<span>${armed ? 'Seconde chance armée' : 'Seconde chance'}</span><b>${S.inv.sc || 0}</b></button>
  </div>`;
}
function useFifty(el, q){
  if (q.tf || !(S.inv.ff > 0)) return false;
  const wrong = shuffle($$('.opt', el).filter(x => +x.dataset.v !== q.ans && !x.disabled));
  const n = wrong.length >= 3 ? 2 : Math.min(1, wrong.length);
  if (!n) return false;
  wrong.slice(0, n).forEach((x, i) => { x.disabled = true; x.classList.add('gone'); x.style.animationDelay = (i * 120) + 'ms'; });
  q._ff = true; S.inv.ff--; save(); sfx('coin');
  return true;
}

/* ---------- quêtes du jour ---------- */
const QPOOL = [
  {k:'quiz', ic:'target', t:n => `Donne ${n} bonnes réponses en quiz`, n:i => Math.round(6 + i * 1.5)},
  {k:'card', ic:'cards', t:n => `Coche « Je savais » sur ${n} flashcards`, n:i => 10 + i * 2},
  {k:'sort', ic:'grid', t:n => n > 1 ? `Termine ${n} jeux de tri` : 'Termine un jeu de tri', n:i => 1 + Math.floor(i / 4)},
  {k:'stamp', ic:'fiche', t:n => n > 1 ? `Tamponne ${n} cartes de fiche` : 'Tamponne une carte de fiche', n:i => 2 + Math.floor(i / 3), ok:n => { let r = 0; JLG.chapters.forEach(c => (c.fiche || []).forEach(f => { if (S.fk[c.id + ':' + f.id] === undefined) r++; })); return r >= n; }},
  {k:'case', ic:'scale', t:() => 'Termine un cas pratique', n:() => 1},
  {k:'daily', ic:'bolt', t:() => 'Relève le défi du jour', n:() => 1, ok:() => S.daily[dayKey()] == null},
  {k:'xp', ic:'sparkle', t:n => `Gagne ${fmtNum(n)} XP aujourd’hui`, n:i => 120 + i * 50},
  {k:'exam', ic:'trophy', t:() => 'Termine un examen blanc', n:() => 1}
];
function questsToday(){
  const day = dayKey();
  if (!S.dq || S.dq.day !== day){
    const lv = levelOf(S.xp).i; const rnd = seeded(+day.replace(/-/g, '') * 7 + 13);
    const pool = shuffle(QPOOL, rnd).filter(q => !q.ok || q.ok(q.n(lv)));
    const pickQ = pool.slice(0, 3).map(q => ({k:q.k, n:q.n(lv)}));
    S.dq = {day, list:pickQ, p:[0, 0, 0], c:[0, 0, 0], chest:false}; save();
  }
  return S.dq;
}
const qDef = k => QPOOL.find(q => q.k === k);
const qReward = () => 25 + 5 * (levelOf(S.xp).i + 1);
function quest(type, n = 1){
  if ((S.gameV || 0) < 2) return;
  const D = questsToday(); let changed = false;
  D.list.forEach((q, i) => {
    if (q.k !== type || D.p[i] >= q.n) return;
    D.p[i] = Math.min(q.n, D.p[i] + n); changed = true;
    if (D.p[i] >= q.n){ setTimeout(() => { toast(`Quête accomplie : ${qDef(q.k).t(q.n)} · réclame ta récompense !`); sfx('quest'); }, 700); }
  });
  if (changed){ save(); refreshQuests(); }
}
function questsHTML(){
  const D = questsToday(), rw = qReward();
  const all = D.c.every(Boolean);
  return `<div class="q-list">${D.list.map((q, i) => { const d = qDef(q.k); const done = D.p[i] >= q.n, claimed = !!D.c[i]; return `<div class="q-item${done ? ' done' : ''}${claimed ? ' claimed' : ''}"><span class="q-ic">${icon(d.ic)}</span><div class="q-body"><b>${d.t(q.n)}</b><span class="meter"><i style="width:${Math.round(D.p[i] / q.n * 100)}%"></i></span><span class="q-n">${fmtNum(D.p[i])} / ${fmtNum(q.n)}</span></div>${claimed ? `<span class="q-ok">${icon('check')}</span>` : done ? `<button class="btn btn-sm btn-primary q-claim" data-claim="${i}">+${rw} XP</button>` : `<span class="q-rw">+${rw} XP</span>`}</div>`; }).join('')}</div>
    <div class="q-chest${all ? (D.chest ? ' got' : ' ready') : ''}">${icon('gift')}<span>${D.chest ? 'Coffre du jour ouvert. Reviens demain !' : all ? 'Les 3 quêtes sont faites : ton coffre du jour arrive !' : `Finis les 3 quêtes : coffre du jour avec ${1 + Math.floor(levelOf(S.xp).i / 4)} objet${Math.floor(levelOf(S.xp).i / 4) ? 's' : ''}.`}</span></div>`;
}
function questsCard(){ return `<section class="q-card" aria-label="Quêtes du jour"><div class="q-head"><div><div class="eyebrow">${icon('quest', 'sr-only')}Quêtes du jour</div><h3>Trois missions, une récompense</h3></div><span class="tag plain">Nouvelles demain</span></div><div class="q-slot">${questsHTML()}</div></section>`; }
function refreshQuests(){ $$('.q-slot').forEach(s => { s.innerHTML = questsHTML(); }); }
function claimQuest(i, ev){
  const D = questsToday(); const q = D.list[i]; if (!q || D.c[i] || D.p[i] < q.n) return;
  D.c[i] = 1; save(); sfx('coin');
  addXP(qReward(), ev, {raw:true, noQuest:true});
  refreshQuests();
  if (D.c.every(Boolean) && !D.chest){
    D.chest = true;
    const lv = levelOf(S.xp).i, nItems = 1 + Math.floor(lv / 4), rnd = Math.random, list = [];
    for (let k = 0; k < nItems; k++){ const r = rnd(); list.push(r < .35 ? {ff:1} : r < .65 ? {sc:1} : r < .85 ? {boost:1} : {shield:1}); }
    const rew = sumRew(list); grant(rew); save();
    const play = () => levelCinematic({chestOnly:true, from:lv, to:lv, rew, kicker:'Quêtes du jour', title:'Le coffre du jour'});
    setTimeout(() => { refreshQuests(); if (luOpen) luQueue.push(play); else play(); }, 600);
  }
}

/* ---------- carte de niveau (accueil et hub) ---------- */
function lvlCard(full){
  const st = stats(), lv = st.lv, T = TIERS[lv.tier], next = LEVELS[lv.i + 1];
  return `<div class="lvl-card" data-tier="${T.id}">
    <div class="lvl-top">
      <div class="lvl-medal">${medalSVG(lv.n, lv.tier, lv.i === LEVELS.length - 1)}</div>
      <div class="lvl-id"><div class="eyebrow">Niveau ${lv.n} · Rang ${T.l}${lv.stars ? ` · ★ ${lv.stars}` : ''}</div><div class="lvl-name">${nameHTML(lv.name)}</div></div>
      <div class="lvl-bonus" title="Bonus permanent sur tout l’XP gagné"><b>+${lv.bonus} %</b><span>bonus XP</span></div>
    </div>
    <span class="meter" aria-hidden="true"><i style="width:${Math.round(lv.pct * 100)}%"></i></span>
    <div class="lvl-meta"><span><b>${fmtNum(S.xp)}</b> XP</span>${next ? `<span>Encore <b>${fmtNum(next.x - S.xp)}</b> XP avant « ${nameHTML(next.name)} »</span>` : `<span>Encore <b>${fmtNum(lv.nextStar - S.xp)}</b> XP avant l’étoile ${lv.stars + 1}</span>`}</div>
    ${boostOn() ? `<div class="lvl-boost">${icon('bolt')}<span>Booster ×2 actif</span></div>` : ''}
    <div class="stat-row">
      <div class="stat"><b>${st.streak}</b><span>${st.streak > 1 ? 'jours d’affilée' : 'jour de série'}</span></div>
      <div class="stat"><b>${st.known}/${st.cards}</b><span>cartes maîtrisées</span></div>
      <div class="stat"><b>${Object.values(S.inv).reduce((a, b) => a + (b || 0), 0)}</b><span>objets en stock</span></div>
    </div>
    ${full ? '' : `<div class="btn-row"><button class="btn btn-sm" data-go="progres">${icon('trophy')}Mes récompenses et la route des niveaux</button></div>`}
  </div>`;
}

/* ---------- le hub : progression, inventaire, route, collection ---------- */
function viewProgress(){
  const lv = levelOf(S.xp);
  const days = []; const d = new Date(); d.setDate(d.getDate() - 27);
  for (let i = 0; i < 28; i++){ days.push({k:dayKey(d), l:d.getDate()}); d.setDate(d.getDate() + 1); }
  const rows = JLG.chapters.slice().sort((a, b) => ((subj(a.subject) || {}).order || 0) - ((subj(b.subject) || {}).order || 0) || (a.order || 0) - (b.order || 0)).map(c => {
    const n = (c.flashcards || []).length, k = (c.flashcards || []).filter((f, i) => (S.cards[c.id + ':' + i] || 0) >= 2).length;
    const qb = S.quiz[c.id] ? Math.round(S.quiz[c.id].best * 100) + ' %' : '—';
    const gs = (c.sorts || []).filter(g => S.sorts[g.id] != null).length + '/' + (c.sorts || []).length;
    const cs = (c.cases || []).filter(x => S.cases[x.id]).length + '/' + (c.cases || []).length;
    const fz = (c.fiche || []).filter(f => S.fk[c.id + ':' + f.id] === true).length + '/' + (c.fiche || []).length;
    return [`<button class="tbl-link" data-go="ch-${c.id}">${esc(c.kicker)} · ${c.title}</button>`, fz, `${k}/${n}`, qb, gs, cs];
  });
  const inv = Object.keys(ITEMS).map(k => `<div class="inv-it" data-it="${k}"><span class="inv-ic">${icon(ITEMS[k].ic)}</span><div><b>${ITEMS[k].l}</b><span>${ITEMS[k].d}</span></div><span class="inv-n">×${S.inv[k] || 0}</span>${k === 'boost' ? `<button class="btn btn-sm btn-primary" data-boost ${S.inv.boost > 0 ? '' : 'disabled'}>${boostOn() ? 'Prolonger' : 'Activer'}</button>` : ''}</div>`).join('');
  const road = LEVELS.map((L, i) => {
    const st = i < lv.i ? 'done' : i === lv.i ? 'cur' : 'lock'; const T = TIERS[L.tier];
    return `<li class="rd-n ${st}" data-tier="${T.id}" style="--i:${i}"><span class="rd-m">${medalSVG(i + 1, L.tier, i === LEVELS.length - 1)}</span><div class="rd-b"><div class="rd-t"><b>${nameHTML(L.name)}</b><span class="tag plain">${T.l}</span></div><div class="rd-x">${i ? `${fmtNum(L.x)} XP` : 'Départ'} · bonus +${BONUS[i]} %${st === 'lock' ? ` · encore ${fmtNum(L.x - S.xp)} XP` : st === 'done' ? ' · atteint ✓' : ' · tu es ici'}</div>${REW[i] ? `<div class="rd-r">${rewChips(REW[i])}</div>` : '<div class="rd-r"><span class="rw">Le début de l’aventure</span></div>'}</div></li>`;
  }).join('');
  const skins = SKINS.map(sk => { const un = skinUnlocked(sk); return `<button class="skin${un ? '' : ' locked'}${S.skin === sk.id ? ' on' : ''}" ${un ? `data-skin="${sk.id}"` : 'disabled'} aria-label="Sceau ${sk.l}${un ? '' : ', niveau ' + sk.lv}"><span class="skin-s">${sealSVG({ring:false, skin:sk.id})}</span><b>${sk.l}</b><span>${un ? (S.skin === sk.id ? 'Équipé' : 'Équiper') : `${icon('lock')}Niveau ${sk.lv}`}</span></button>`; }).join('');
  const fxs = Object.keys(FX).map(k => `<div class="fx-it${fxOn(k) ? ' on' : ''}">${icon(fxOn(k) ? 'sparkle' : 'lock')}<div><b>${FX[k].l}</b><span>${fxOn(k) ? FX[k].d : 'Niveau ' + FX[k].lv}</span></div></div>`).join('');
  return {html:`<div class="eyebrow">Le jeu · ton parcours</div><h1 style="font-size:var(--fs-3xl);margin:6px 0 4px">Progression</h1>
  ${lvlCard(true)}
  <div class="section-title"><h2>Ton inventaire</h2>${boostOn() ? `<span class="tag good">${icon('bolt')}Booster actif</span>` : ''}</div>
  <div class="inv">${inv}</div>
  <p class="muted" style="font-size:.88rem;margin-top:8px">Les jokers s’utilisent pendant les quiz (pas en examen blanc). Les boucliers protègent ta série tout seuls.</p>
  <div class="section-title"><h2>Quêtes du jour</h2></div>${questsCard()}
  <div class="section-title"><h2>La route des 12 niveaux</h2><span class="tag plain">de plus en plus durs</span></div>
  <ol class="road" style="--p:${((lv.i + (lv.next ? lv.pct : 1)) / (LEVELS.length - 1) * 100).toFixed(1)}%">${road}</ol>
  <p class="muted" style="font-size:.88rem;margin-top:10px">Après « LaTwingoPrime » : une étoile de prestige tous les ${fmtNum(PRESTIGE)} XP, avec son coffre.</p>
  <div class="section-title"><h2>Ta collection de sceaux</h2></div>
  <div class="skins">${skins}</div>
  <div class="fx-list">${fxs}</div>
  <div class="section-title"><h2>Réglages</h2></div>
  <div class="panel set-row"><button class="btn btn-sm" data-sound aria-pressed="${!!S.sound}">${icon(S.sound ? 'volume' : 'mute')}${S.sound ? 'Son activé' : 'Son coupé'}</button><button class="btn btn-sm" data-replay>${icon('play')}Rejouer l’animation de mon niveau</button></div>
  <div class="section-title"><h2>Tes 4 dernières semaines</h2></div>
  <div class="cal">${days.map(x => `<span title="${x.k}${S.days[x.k] === 'sh' ? ' : protégé par un bouclier' : ''}" class="${S.days[x.k] === 'sh' ? 'sh' : S.days[x.k] ? 'on' : ''}">${S.days[x.k] === 'sh' ? icon('shield') : x.l}</span>`).join('')}</div>
  <div class="section-title"><h2>Par chapitre</h2></div>
  ${block({t:'table', head:['Chapitre', 'Fiche', 'Cartes', 'Meilleur quiz', 'Jeux', 'Cas'], rows})}
  <div class="section-title"><h2>Recommencer à zéro</h2></div>
  <div class="panel" id="resetBox"><p class="muted">Efface l’XP, les niveaux, l’inventaire, les cartes et les scores enregistrés sur cet appareil.</p><div class="btn-row" style="margin-top:12px"><button class="btn btn-sm" id="resetAsk">Tout réinitialiser</button></div></div>`,
  mount(v){
    $('#resetAsk', v).addEventListener('click', () => {
      $('#resetBox', v).innerHTML = `<p><b>Sûre ?</b> Toute la progression de cet appareil sera effacée : niveaux, objets, sceaux.</p><div class="btn-row" style="margin-top:12px"><button class="btn btn-sm" id="resetNo">Annuler</button><button class="btn btn-sm btn-primary" id="resetYes">Oui, effacer</button></div>`;
      $('#resetNo', v).onclick = () => go('progres', {silent:true, keepScroll:true});
      $('#resetYes', v).onclick = () => { const th = S.theme, snd = S.sound; S = defaults(); S.theme = th; S.sound = snd; S.gameV = 2; save(); applyFx(); refreshSeals(); updateChip(); toast('Progression effacée'); go('progres', {silent:true}); };
    });
    const cur = $('.rd-n.cur', v); if (cur && !reduced()) cur.classList.add('glow');
  }};
}

/* ---------- l’intro : Jade la Goat devient Alves Cances ---------- */
function introFlow(){
  const lv = levelOf(S.xp);
  const old = !FRESH && (S.xp > 0 || Object.keys(S.days).length > 0);
  const list = []; for (let k = 1; k <= lv.i; k++) list.push(REW[k]); list.push(WELCOME);
  const rew = sumRew(list); grant(rew);
  S.lvlSeen = lv.i; S.prest = lv.stars; S.gameV = 2; save(); applyFx(); updateChip();
  const word = (w, cls) => Array.from(w).map((ch, i) => `<span class="${cls}" style="--i:${i};--rx:${(Math.random() * 2 - 1).toFixed(2)};--ry:${(Math.random() * 2 - 1).toFixed(2)};--rr:${Math.round(Math.random() * 120 - 60)}deg">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
  const root = document.createElement('div'); root.className = 'lu intro' + (old ? ' has-old' : '') + (reduced() ? ' still' : ''); root.dataset.tier = 'bronze';
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Bienvenue sur Alves Cances');
  root.innerHTML = `<div class="lu-bg"></div><div class="lu-rays"></div><div class="lu-flash"></div>
    <div class="lu-scroll"><div class="lu-stage">
      <div class="in-seal">${sealSVG()}</div>
      <div class="in-names">${old ? `<div class="in-old" aria-hidden="true">${word('Jade la Goat', 'in-ol')}</div>` : ''}<h2 class="in-new" aria-label="Alves Cances">${word('Alves Cances', 'in-nl')}</h2></div>
      <p class="in-sub">${old ? 'Ton site de révision change de nom… et devient un vrai jeu.' : 'Ton QG de révision du BTS notariat est aussi un vrai jeu.'}</p>
      <ul class="in-list">
        <li style="--i:0">${icon('trophy')}<span><b>12 niveaux</b>, de plus en plus durs : de « Jade la Neuille » à « LaTwingoPrime ».</span></li>
        <li style="--i:1">${icon('gift')}<span>À chaque niveau : une <b>animation</b>, un <b>coffre</b> de jokers et un <b>bonus d’XP permanent</b>, jusqu’à +50 %.</span></li>
        <li style="--i:2">${icon('quest')}<span><b>3 quêtes</b> chaque jour, et un coffre si tu les finis toutes.</span></li>
        <li style="--i:3">${icon('seal')}<span>Des <b>sceaux</b> à collectionner : lavande, rubis, or, holographique…</span></li>
      </ul>
      <div class="lu-actions"><button class="btn btn-primary" data-in="go">${icon('gift')}${lv.i ? 'Ouvrir mes récompenses' : 'Ouvrir mon cadeau de bienvenue'}</button></div>
    </div></div>
    <button class="lu-skip" data-in="skip">Passer</button>`;
  document.body.appendChild(root);
  const app = $('#app'); if (app) app.inert = true;
  document.documentElement.classList.add('lu-lock'); luOpen = true;
  const fx = reduced() ? null : fxCanvas(root);
  const timers = []; const at = (ms, fn) => timers.push(setTimeout(fn, ms)); const add = c => root.classList.add(c);
  const end = fast => { timers.forEach(clearTimeout); if (fast === true) add('skip'); ['in', 'scatter', 'assemble', 'stamp', 'lst', 'done'].forEach(add); const b = $('[data-in="go"]', root); if (b) b.focus({preventScroll:true}); };
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-in]'); if (!b) return;
    if (b.dataset.in === 'skip'){ end(true); return; }
    timers.forEach(clearTimeout); root.classList.add('out');
    setTimeout(() => {
      if (fx) fx.stop(); root.remove(); if (app) app.inert = false; document.documentElement.classList.remove('lu-lock'); luOpen = false;
      if (lv.i) levelCinematic({from:0, to:lv.i, rew, title: `Tes ${lv.i + 1} premiers niveaux`});
      else levelCinematic({chestOnly:true, from:0, to:0, rew, kicker:'Bienvenue', title:'Ton cadeau de bienvenue', sub:'Un joker 50/50, une seconde chance et un booster ×2 pour bien démarrer.'});
    }, 320);
  });
  root.addEventListener('keydown', e => { if (e.key === 'Escape'){ e.preventDefault(); end(true); } });
  if (reduced()){ end(); return; }
  add('in'); sfx('whoosh');
  if (old){ at(1300, () => add('scatter')); at(1800, () => { add('assemble'); sfx('rename'); }); }
  else at(400, () => { add('assemble'); sfx('rename'); });
  at(old ? 2500 : 1200, () => { add('stamp'); sfx('boom'); if (fx){ const r = $('.in-seal', root).getBoundingClientRect(); fx.burst(r.left + r.width / 2, r.top + r.height / 2, 120, TIER_FX.legende, 9); } });
  at(old ? 3100 : 1800, () => add('lst'));
  at(old ? 3900 : 2600, end);
}

/* ---------- démarrage du jeu ---------- */
function gameInit(){
  const ta = $('.top-actions');
  if (ta && !$('#boostPill')){ const p = document.createElement('button'); p.id = 'boostPill'; p.className = 'boost-pill'; p.hidden = true; p.setAttribute('data-go', 'progres'); ta.insertBefore(p, ta.firstChild); }
  applyFx(); applyShields(); updateBoostPill();
  if (!skinUnlocked(skinOf(S.skin))){ S.skin = 'amethyste'; save(); }
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-claim]'); if (c){ claimQuest(+c.dataset.claim, e); return; }
    const b = e.target.closest('[data-boost]'); if (b){ activateBoost(e); if (ROUTE === 'progres') go('progres', {silent:true, keepScroll:true}); return; }
    const k = e.target.closest('[data-skin]'); if (k){ equipSkin(k.dataset.skin); if (ROUTE === 'progres' && !k.closest('.lu')) go('progres', {silent:true, keepScroll:true}); return; }
    const s = e.target.closest('[data-sound]'); if (s){ S.sound = !S.sound; save(); if (S.sound) sfx('coin'); go('progres', {silent:true, keepScroll:true}); return; }
    const r = e.target.closest('[data-replay]'); if (r){ const lv = levelOf(S.xp); levelCinematic({from:Math.max(0, lv.i - 1), to:lv.i, rew:sumRew([REW[lv.i] || WELCOME]), title: lv.i ? `Niveau ${lv.n}` : 'Ton premier niveau'}); }
  });
  if ((S.gameV || 0) < 2) setTimeout(introFlow, 700); else checkLevel();
}

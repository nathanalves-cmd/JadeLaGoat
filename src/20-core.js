(function(){
'use strict';
/* =========================================================
   JADE LA GOAT — moteur
   Les cours sont déclarés plus bas, chacun dans son propre
   bloc script : JLG.subject(), JLG.chapter(), JLG.glossary(), JLG.log()
   ========================================================= */
const JLG = window.JLG = window.JLG || {};
JLG.subjects = []; JLG.chapters = []; JLG.gloss = []; JLG.logs = []; JLG.widgets = {};
JLG.subject = s => { JLG.subjects.push(s); };
JLG.chapter = c => { JLG.chapters.push(c); };
JLG.glossary = list => { JLG.gloss.push(...list); };
JLG.log = l => { JLG.logs.push(l); };
JLG.widget = (name, fn) => { JLG.widgets[name] = fn; };

/* ---------- utilitaires ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const strip = s => String(s).replace(/<[^>]+>/g, '');
const norm = s => strip(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function shuffle(a, rnd = Math.random){ a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function seeded(seed){ return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const pad2 = n => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
const fmtDate = iso => { try { return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric'}); } catch(e){ return iso; } };
const fmtNum = n => Number(n).toLocaleString('fr-FR');
const reduced = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const plural = (n, w, p) => n + ' ' + (n > 1 ? (p || w + 's') : w);

/* ---------- icônes ---------- */
const IC = {
  home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
  book:'<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v14H6.5A1.5 1.5 0 0 0 5 18.5z"/><path d="M5 18.5A1.5 1.5 0 0 0 6.5 20H19"/><path d="M9 7h6"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  tools:'<path d="M3 17 17 3l4 4L7 21H3z"/><path d="M14 6l4 4"/><path d="M11 9l1.5 1.5M8 12l1.5 1.5"/>',
  az:'<path d="M3 18 7 6l4 12M4.5 14h5"/><path d="M14 6h6l-6 12h6"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
  check:'<path d="M4 12.5 9.5 18 20 6.5"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  play:'<path d="M7 4.5v15l12-7.5z"/>',
  flame:'<path d="M12 22c4 0 7-2.8 7-6.8 0-3.7-2.6-6-4.4-8.2-.5 2.3-1.8 3.6-3.1 4.1.3-3.3-1.2-6.5-4-9.1C7.4 6 5 9.5 5 14.6 5 19 8 22 12 22z"/>',
  cards:'<rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v13"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  grid:'<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  scale:'<path d="M12 3v18M7 21h10M4 7h16"/><path d="M6 7l-3 6a3 3 0 0 0 6 0zM18 7l-3 6a3 3 0 0 0 6 0z"/>',
  seal:'<circle cx="12" cy="10" r="6"/><path d="M9 15.5 7.5 22l4.5-2.5 4.5 2.5-1.5-6.5"/>',
  map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>',
  bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
  pen:'<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  crown:'<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
  hat:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/>',
  calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8.5 11.5h1M11.5 11.5h1M14.5 11.5h1M8.5 15h1M11.5 15h1M14.5 15h1M8.5 18h1M11.5 18h4"/>',
  tree:'<circle cx="12" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M12 7v4M12 11H6v6M12 11h6v6"/>',
  doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  euro:'<path d="M17 6.5A6.5 6.5 0 1 0 17 17.5"/><path d="M4 10.5h9M4 13.5h9"/>',
  house:'<path d="M3 11 12 4l9 7"/><path d="M6 9.5V20h12V9.5"/><rect x="10" y="13" width="4" height="7"/>'
};
const icon = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;

/* ---------- sceau (forme de cire générée) ---------- */
function waxPath(cx, cy, r, bumps = 14, amp = .055, seed = 3){
  const rnd = seeded(seed); let d = '';
  const n = 140;
  const ph = rnd() * 6;
  for (let i = 0; i <= n; i++){
    const a = i / n * Math.PI * 2;
    const rr = r * (1 + amp * Math.sin(a * bumps + ph) + amp * .45 * Math.sin(a * (bumps * 2 + 1) + ph * 2));
    const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
    d += (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2);
  }
  return d + 'Z';
}
function sealSVG(opts = {}){
  const id = 'sg' + Math.random().toString(36).slice(2, 7);
  const ring = opts.ring !== false;
  return `<svg viewBox="0 0 200 200" role="img" aria-label="Sceau de Jade la Goat">
  <defs>
    <radialGradient id="${id}a" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#C6AEFF"/><stop offset=".45" stop-color="#7C4DFF"/><stop offset="1" stop-color="#3A138F"/></radialGradient>
    <radialGradient id="${id}b" cx="50%" cy="50%" r="50%"><stop offset=".7" stop-color="#2A0C6E" stop-opacity="0"/><stop offset="1" stop-color="#1A0646" stop-opacity=".55"/></radialGradient>
    <path id="${id}c" d="M100 100 m-68 0 a68 68 0 1 1 136 0 a68 68 0 1 1 -136 0"/>
  </defs>
  <g class="seal-ripple"><circle cx="100" cy="100" r="86" fill="none" stroke="#9D7BFF" stroke-width="2" opacity=".6"/></g>
  <g class="seal-stamp">
    <path d="${waxPath(100, 104, 88, 13, .05, 7)}" fill="#1A0646" opacity=".35"/>
    <path d="${waxPath(100, 100, 88, 13, .05, 7)}" fill="url(#${id}a)"/>
    <path d="${waxPath(100, 100, 88, 13, .05, 7)}" fill="url(#${id}b)"/>
    <circle cx="100" cy="100" r="62" fill="none" stroke="#E9DEFF" stroke-opacity=".55" stroke-width="1.4"/>
    <circle cx="100" cy="100" r="55" fill="#5B2BD6" fill-opacity=".35" stroke="#2A0C6E" stroke-opacity=".5" stroke-width="1"/>
    ${ring ? `<g class="seal-ring"><text font-family="JetBrains Mono, monospace" font-size="9.6" letter-spacing="3.1" fill="#F3EDFF" fill-opacity=".85"><textPath href="#${id}c">JADE LA GOAT · BTS NOTARIAT · SCEAU OFFICIEL ·</textPath></text></g>` : ''}
    <path d="M78 66 C70 52 74 40 86 36 C80 46 82 56 90 62 M122 66 C130 52 126 40 114 36 C120 46 118 56 110 62" fill="none" stroke="#F3EDFF" stroke-width="3.2" stroke-linecap="round"/>
    <text x="100" y="128" text-anchor="middle" font-family="Bodoni Moda, Didot, Georgia, serif" font-style="italic" font-weight="800" font-size="64" fill="#F8F4FF">J</text>
    <text x="100" y="146" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" letter-spacing="2.6" fill="#E9DEFF">LA GOAT</text>
    <path d="M64 70 Q100 30 136 70" fill="none" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="10" stroke-linecap="round"/>
  </g>
</svg>`;
}

/* ---------- état (progression locale) ---------- */
const KEY = 'jlg.v1';
const defaults = () => ({xp:0, days:{}, last:null, cards:{}, quiz:{}, sorts:{}, cases:{}, daily:{}, seenLog:null, theme:null});
let S = (function(){ try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign(defaults(), JSON.parse(raw)); } catch(e){} return defaults(); })();
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }
function markActive(){ S.days[dayKey()] = true; save(); }
function streak(){
  let c = 0; const d = new Date();
  for (let i = 0; i < 400; i++){ const k = dayKey(d); if (S.days[k]) c++; else if (i > 0) break; d.setDate(d.getDate() - 1); }
  return c;
}

/* ---------- niveaux & XP ---------- */
const LEVELS = [[0,'Chevreau stagiaire'],[150,'Chèvre clerc'],[400,'Chèvre juriste'],[800,'Chèvre notaire'],[1400,'LA GOAT'],[2200,'GOAT légendaire'],[3200,'GOAT éternelle']];
function levelOf(xp){
  let i = 0; LEVELS.forEach((l, k) => { if (xp >= l[0]) i = k; });
  const cur = LEVELS[i][0], next = LEVELS[i + 1] ? LEVELS[i + 1][0] : null;
  return {i, n:i + 1, name:LEVELS[i][1], cur, next, pct: next ? (xp - cur) / (next - cur) : 1};
}
function addXP(n, ev){
  const before = levelOf(S.xp).i;
  S.xp += n; markActive(); popXP('+' + n + ' XP', ev); updateChip();
  const after = levelOf(S.xp).i;
  if (after > before) setTimeout(() => levelUp(after), 450);
}
function popXP(txt, ev){
  if (reduced()) return;
  const el = document.createElement('div'); el.className = 'xp-pop'; el.textContent = txt;
  let x = innerWidth / 2, y = innerHeight / 2;
  if (ev && ev.clientX != null && (ev.clientX || ev.clientY)){ x = ev.clientX; y = ev.clientY; }
  else if (ev && ev.target && ev.target.getBoundingClientRect){ const r = ev.target.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top; }
  el.style.left = x + 'px'; el.style.top = (y - 10) + 'px';
  document.body.appendChild(el); setTimeout(() => el.remove(), 1200);
}
function updateChip(){
  const lv = levelOf(S.xp);
  $$('.xp-chip').forEach(c => { c.innerHTML = `<span class="lvl">${lv.n}</span><span>${esc(lv.name)}</span><span class="xpv">${fmtNum(S.xp)} XP</span>`; c.setAttribute('aria-label', `Niveau ${lv.n}, ${lv.name}, ${S.xp} XP — voir ma progression`); });
}
function levelUp(i){
  confetti(160);
  modal(`<div class="crown">${sealSVG({ring:false})}</div>
    <span class="eyebrow">Niveau ${i + 1} débloqué</span>
    <h3>${esc(LEVELS[i][1])}</h3>
    <p class="muted">${i >= 4 ? 'Tu es officiellement la GOAT. Le Code civil tremble.' : 'Tu montes en grade. Prochain palier : ' + esc((LEVELS[i + 1] || LEVELS[i])[1]) + '.'}</p>
    <button class="btn btn-primary" data-close>Continuer</button>`);
}

/* ---------- toasts, modale, confettis ---------- */
let toastT;
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
function modal(html){
  const m = $('#modal'); m.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true">${html}</div>`; m.hidden = false;
  const close = () => { m.hidden = true; m.innerHTML = ''; };
  m.onclick = e => { if (e.target === m || e.target.closest('[data-close]')) close(); };
  const b = $('[data-close]', m); if (b) b.focus();
  return close;
}
function confetti(n = 120){
  if (reduced()) return;
  const fx = $('#fx'); const cv = document.createElement('canvas'); fx.appendChild(cv);
  const dpr = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
  const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
  const cs = getComputedStyle(document.documentElement);
  const cols = [cs.getPropertyValue('--accent').trim(), cs.getPropertyValue('--accent-strong').trim(), cs.getPropertyValue('--fg').trim(), '#C9B6FF', cs.getPropertyValue('--warn').trim()];
  const P = Array.from({length:n}, () => ({x:innerWidth / 2 + (Math.random() - .5) * 80, y:innerHeight * .38, vx:(Math.random() - .5) * 13, vy:-Math.random() * 13 - 4, r:Math.random() * Math.PI, vr:(Math.random() - .5) * .35, w:5 + Math.random() * 6, h:8 + Math.random() * 8, c:cols[Math.floor(Math.random() * cols.length)]}));
  let t0 = performance.now();
  (function frame(t){
    const dt = Math.min(32, t - t0) / 16; t0 = t;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    let alive = 0;
    P.forEach(p => { p.vy += .35 * dt; p.vx *= .99; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
      if (p.y < innerHeight + 30){ alive++; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2))); ctx.restore(); } });
    if (alive) requestAnimationFrame(frame); else cv.remove();
  })(t0);
}

/* ---------- thème ---------- */
function applyTheme(){ const r = document.documentElement; if (S.theme) r.setAttribute('data-theme', S.theme); else r.removeAttribute('data-theme'); const b = $('#themeBtn'); if (b) b.innerHTML = icon(curTheme() === 'dark' ? 'sun' : 'moon'); }
function curTheme(){ return S.theme || (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); }

/* ---------- données ---------- */
const subj = id => JLG.subjects.find(s => s.id === id);
const chap = id => JLG.chapters.find(c => c.id === id);
const chaptersOf = sid => JLG.chapters.filter(c => c.subject === sid).sort((a, b) => (a.order || 0) - (b.order || 0));
const sortedSubjects = () => JLG.subjects.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
const isNew = c => { if (!c.added) return false; const d = (Date.now() - new Date(c.added + 'T12:00:00').getTime()) / 864e5; return d < 10; };
function chapterProgress(c){
  const parts = [];
  if (c.flashcards && c.flashcards.length){ const k = c.flashcards.filter((f, i) => (S.cards[c.id + ':' + i] || 0) >= 2).length; parts.push(k / c.flashcards.length); }
  if (c.quiz && c.quiz.length){ parts.push((S.quiz[c.id] && S.quiz[c.id].best) || 0); }
  if (c.sorts && c.sorts.length){ parts.push(c.sorts.reduce((a, g) => a + (S.sorts[g.id] || 0), 0) / c.sorts.length); }
  if (c.cases && c.cases.length){ parts.push(c.cases.filter(k => S.cases[k.id]).length / c.cases.length); }
  return parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0;
}

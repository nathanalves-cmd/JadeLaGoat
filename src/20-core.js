(function(){
'use strict';
/* =========================================================
   ALVES CANCES — moteur (anciennement « Jade la Goat »)
   Les cours sont déclarés plus bas, chacun dans son propre
   bloc script : JLG.subject(), JLG.chapter(), JLG.glossary(), JLG.log()
   ========================================================= */
const JLG = window.JLG = window.JLG || {};
JLG.subjects = []; JLG.chapters = []; JLG.gloss = []; JLG.logs = []; JLG.widgets = {}; JLG.fiches = {};
JLG.subject = s => { JLG.subjects.push(s); };
JLG.chapter = c => { JLG.chapters.push(c); };
JLG.fiche = (cid, cards) => { JLG.fiches[cid] = cards; };
JLG.glossary = list => { JLG.gloss.push(...list); };
JLG.log = l => { JLG.logs.push(l); };
JLG.widget = (name, fn) => { JLG.widgets[name] = fn; };

/* ---------- utilitaires ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const strip = s => String(s).replace(/<[^>]+>/g, '');
const norm = s => strip(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
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
  house:'<path d="M3 11 12 4l9 7"/><path d="M6 9.5V20h12V9.5"/><rect x="10" y="13" width="4" height="7"/>',
  fiche:'<rect x="3" y="7" width="15" height="13" rx="2"/><path d="M6 11h9M6 14.5h9M6 18h5"/><path d="M7 4h12a2 2 0 0 1 2 2v10"/>',
  eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M3 3l18 18"/><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6A17.3 17.3 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  rings:'<circle cx="9" cy="14" r="5.5"/><circle cx="15" cy="10" r="5.5"/>',
  family:'<circle cx="12" cy="4.5" r="2"/><circle cx="5" cy="19.5" r="2"/><circle cx="12" cy="19.5" r="2"/><circle cx="19" cy="19.5" r="2"/><path d="M12 6.5V12M5 17.5V12h14v5.5M12 12v5.5"/>',
  ladder:'<path d="M6 3v18M18 3v18M6 7h12M6 12h12M6 17h12"/>',
  split:'<path d="M12 3v6M12 9l-6 6v6M12 9l6 6v6"/>',
  half:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17"/><path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="currentColor" stroke="none"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',
  shield:'<path d="M12 3l7.5 3v5.5c0 4.8-3.3 8.3-7.5 9.8-4.2-1.5-7.5-5-7.5-9.8V6z"/><path d="M8.8 12.2l2.3 2.3 4.2-4.6"/>',
  gift:'<rect x="3.5" y="9" width="17" height="11.5" rx="1.5"/><path d="M2.5 9h19M12 9v11.5"/><path d="M12 9C9 9 7 7.6 7 6a2 2 0 0 1 3.6-1.2L12 7l1.4-2.2A2 2 0 0 1 17 6c0 1.6-2 3-5 3z"/>',
  star:'<path d="M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>',
  volume:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',
  mute:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  lock:'<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  quest:'<path d="M6 3.5h9l3 3v14H6z"/><path d="M9 10l1.8 1.8L14.5 8M9 15.5h6"/>'
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
/* Les skins du sceau se débloquent en montant de niveau (voir le jeu). */
const SKINS = [
  {id:'amethyste', l:'Améthyste', lv:1, g:['#C6AEFF', '#7C4DFF', '#3A138F'], dk:'#1A0646', inn:'#5B2BD6', t:'#F3EDFF', m:'#F8F4FF'},
  {id:'lavande', l:'Lavande', lv:3, g:['#FBF7FF', '#C9B3FF', '#7457CF'], dk:'#2E1A66', inn:'#A88BF0', t:'#2A1660', m:'#FFFFFF'},
  {id:'rubis', l:'Rubis', lv:5, g:['#FFB8C9', '#E0245E', '#6E0727'], dk:'#3A0315', inn:'#B0123F', t:'#FFE8EE', m:'#FFF5F7'},
  {id:'or', l:'Or', lv:7, g:['#FFF4C2', '#E8B73A', '#8A5A00'], dk:'#4A2F00', inn:'#C9921C', t:'#3D2600', m:'#FFFBEA'},
  {id:'holo', l:'Holographique', lv:9, g:['#B8F4FF', '#C69CFF', '#FF9CD6'], dk:'#3A1F6E', inn:'#9D7BFF', t:'#2A1660', m:'#FFFFFF', holo:true},
  {id:'twingo', l:'TwingoPrime', lv:12, g:['#FFF36B', '#FF8A3D', '#E0245E'], dk:'#5A0A22', inn:'#FF5A36', t:'#3A0A18', m:'#FFFFFF', race:true}
];
const skinOf = id => SKINS.find(k => k.id === id) || SKINS[0];
function sealSVG(opts = {}){
  const id = 'sg' + Math.random().toString(36).slice(2, 7);
  const ring = opts.ring !== false;
  const sk = skinOf(opts.skin || (S && S.skin));
  const wax = waxPath(100, 100, 88, 13, .05, 7);
  return `<svg viewBox="0 0 200 200" role="img" aria-label="Sceau d’Alves Cances"${sk.holo ? ' class="seal-holo"' : ''}>
  <defs>
    <radialGradient id="${id}a" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="${sk.g[0]}"/><stop offset=".45" stop-color="${sk.g[1]}"/><stop offset="1" stop-color="${sk.g[2]}"/></radialGradient>
    <radialGradient id="${id}b" cx="50%" cy="50%" r="50%"><stop offset=".7" stop-color="${sk.dk}" stop-opacity="0"/><stop offset="1" stop-color="${sk.dk}" stop-opacity=".55"/></radialGradient>
    <path id="${id}c" d="M100 100 m-68 0 a68 68 0 1 1 136 0 a68 68 0 1 1 -136 0"/>
  </defs>
  <g class="seal-ripple"><circle cx="100" cy="100" r="86" fill="none" stroke="${sk.g[1]}" stroke-width="2" opacity=".6"/></g>
  <g class="seal-stamp">
    <path d="${waxPath(100, 104, 88, 13, .05, 7)}" fill="${sk.dk}" opacity=".35"/>
    <path d="${wax}" fill="url(#${id}a)"/>
    <path d="${wax}" fill="url(#${id}b)"/>
    <circle cx="100" cy="100" r="62" fill="none" stroke="${sk.t}" stroke-opacity=".55" stroke-width="1.4"/>
    <circle cx="100" cy="100" r="55" fill="${sk.inn}" fill-opacity=".35" stroke="${sk.dk}" stroke-opacity=".5" stroke-width="1"/>
    ${sk.race ? `<path d="M52 150 L96 52 M66 156 L110 58" stroke="${sk.m}" stroke-opacity=".22" stroke-width="7"/>` : ''}
    ${ring ? `<g class="seal-ring"><text font-family="JetBrains Mono, monospace" font-size="9.3" letter-spacing="2.9" fill="${sk.t}" fill-opacity=".85"><textPath href="#${id}c">ALVES CANCES · BTS NOTARIAT · SCEAU OFFICIEL ·</textPath></text></g>` : ''}
    <path d="M81 72 L84.5 56 L92.5 64.5 L100 50 L107.5 64.5 L115.5 56 L119 72 Z" fill="${sk.m}" fill-opacity=".94"/>
    <rect x="80" y="73.5" width="40" height="4" rx="1.5" fill="${sk.m}" fill-opacity=".94"/>
    <circle cx="100" cy="50" r="2.6" fill="${sk.m}"/><circle cx="84.5" cy="56" r="2" fill="${sk.m}"/><circle cx="115.5" cy="56" r="2" fill="${sk.m}"/>
    <text x="100" y="127" text-anchor="middle" font-family="Bodoni Moda, Didot, Georgia, serif" font-style="italic" font-weight="800" font-size="50" letter-spacing="-1.5" fill="${sk.m}">AC</text>
    <text x="100" y="146" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2.6" fill="${sk.t}">NOTARIAT</text>
    <path d="M64 70 Q100 30 136 70" fill="none" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="10" stroke-linecap="round"/>
  </g>
</svg>`;
}

/* ---------- état (progression locale) ---------- */
const KEY = 'jlg.v1';
const defaults = () => ({xp:0, days:{}, last:null, cards:{}, quiz:{}, sorts:{}, cases:{}, daily:{}, fk:{}, ficheHide:false, seenLog:null, theme:null,
  inv:{ff:0, sc:0, boost:0, shield:0}, skin:'amethyste', sound:true, boostUntil:0, lvlSeen:0, prest:0, gameV:0, dq:null,
  srs:null, srsNew:null, err:{}});
let FRESH = true;
let S = (function(){ try { const raw = localStorage.getItem(KEY); if (raw){ FRESH = false; const o = Object.assign(defaults(), JSON.parse(raw)); o.inv = Object.assign({ff:0, sc:0, boost:0, shield:0}, o.inv || {}); return o; } } catch(e){} return defaults(); })();
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }
function markActive(){ S.days[dayKey()] = true; save(); }
function streak(){
  let c = 0; const d = new Date();
  for (let i = 0; i < 400; i++){ const k = dayKey(d); if (S.days[k]) c++; else if (i > 0) break; d.setDate(d.getDate() - 1); }
  return c;
}

/* ---------- niveaux & XP ---------- */
/* 12 niveaux, de plus en plus durs : l’écart entre deux paliers grandit à chaque fois. */
const LEVELS = [
  {x:0, name:'Jade la Neuille', tier:0},
  {x:150, name:'Jade Chiki brrr', tier:0},
  {x:400, name:'Jadorlabite', tier:0},
  {x:800, name:'JadorLaVody', tier:1},
  {x:1400, name:'JadeLaSDF', tier:1},
  {x:2300, name:'MarlèneLaMadeleine', tier:1},
  {x:3500, name:'JadeSousLigamentsCroisés', tier:2},
  {x:5100, name:'LaMeilleureCoachHandball', tier:2},
  {x:7200, name:'LaMeilleureNotaire', tier:2},
  {x:9900, name:'LeDaronSousdrift', tier:3},
  {x:13400, name:'LaPoloDelabrée', tier:3},
  {x:17900, name:'LaTwingoPrime', tier:4}
];
const TIERS = [{id:'bronze', l:'Bronze'}, {id:'argent', l:'Argent'}, {id:'or', l:'Or'}, {id:'diamant', l:'Diamant'}, {id:'legende', l:'Légende'}];
const BONUS = [0, 5, 8, 12, 15, 20, 25, 30, 35, 40, 45, 50];
const PRESTIGE = 5000;
function levelOf(xp){
  let i = 0; LEVELS.forEach((l, k) => { if (xp >= l.x) i = k; });
  const L = LEVELS[i], cur = L.x, next = LEVELS[i + 1] ? LEVELS[i + 1].x : null;
  const stars = next ? 0 : Math.floor((xp - cur) / PRESTIGE);
  return {i, n:i + 1, name:L.name, tier:L.tier, bonus:BONUS[i], cur, next, stars,
    nextStar: next ? null : cur + (stars + 1) * PRESTIGE,
    pct: next ? (xp - cur) / (next - cur) : ((xp - cur) % PRESTIGE) / PRESTIGE};
}
const nameHTML = s => esc(s).replace(/([a-zà-öø-ÿ])([A-ZÀ-ÖØ-Þ])/g, '$1<wbr>$2');
const boostOn = () => Date.now() < (S.boostUntil || 0);
function xpGain(n){ const lv = levelOf(S.xp); let g = n * (1 + lv.bonus / 100); if (boostOn()) g *= 2; return Math.max(1, Math.round(g)); }
function addXP(n, ev, opt = {}){
  const g = opt.raw ? n : xpGain(n);
  S.xp += g; markActive(); popXP('+' + g + ' XP', ev, g > n); updateChip();
  if (!opt.noQuest) quest('xp', g);
  checkLevel();
  return g;
}
function popXP(txt, ev, boosted){
  if (reduced()) return;
  const el = document.createElement('div'); el.className = 'xp-pop' + (boosted ? ' boosted' : ''); el.textContent = txt;
  let x = innerWidth / 2, y = innerHeight / 2;
  if (ev && ev.clientX != null && (ev.clientX || ev.clientY)){ x = ev.clientX; y = ev.clientY; }
  else if (ev && ev.target && ev.target.getBoundingClientRect){ const r = ev.target.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top; }
  el.style.left = x + 'px'; el.style.top = (y - 10) + 'px';
  document.body.appendChild(el); setTimeout(() => el.remove(), 1200);
}
function updateChip(){
  const lv = levelOf(S.xp), T = TIERS[lv.tier];
  $$('.xp-chip').forEach(c => { c.dataset.tier = T.id; c.innerHTML = `<span class="lvl">${lv.n}</span><span class="lname">${esc(lv.name)}${lv.stars ? ' ★' + lv.stars : ''}</span><span class="xpv">${fmtNum(S.xp)} XP</span>`; c.setAttribute('aria-label', `Niveau ${lv.n}, ${lv.name}, ${S.xp} XP : voir mes récompenses`); });
  if (typeof updateBoostPill === 'function') updateBoostPill();
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
  if (n >= 100 && S.lvlSeen >= 9) setTimeout(() => fireworks(3), 250);
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
  if (c.fiche && c.fiche.length){ parts.push(c.fiche.filter(f => S.fk[c.id + ':' + f.id]).length / c.fiche.length); }
  return parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0;
}
const ficheCount = sid => { let n = 0, k = 0; chaptersOf(sid).forEach(c => (c.fiche || []).forEach(f => { n++; if (S.fk[c.id + ':' + f.id]) k++; })); return {n, k}; };

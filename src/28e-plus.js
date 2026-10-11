
/* =================== RÉVISION ESPACÉE (flashcards) ===================
   Chaque carte vit dans une boîte de 1 à 6. Juste : elle monte d’une boîte et revient plus tard
   (1, 2, 4, 8, 16 puis 32 jours). Ratée : retour en boîte 1, à revoir le jour même. */
const SRS_INT = [0, 1, 2, 4, 8, 16, 32];
const NEW_PER_DAY = 10;
const dayNum = (d = new Date()) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
const cardByKey = k => { const [cid, i] = k.split(':'); const c = chap(cid); const f = c && c.flashcards && c.flashcards[+i]; return f ? {c, i:+i, f} : null; };
function srsInit(){
  if (S.srs && typeof S.srs === 'object') return;
  S.srs = {}; const t = dayNum();
  Object.keys(S.cards || {}).forEach(k => { if (!cardByKey(k)) return; const v = S.cards[k]; S.srs[k] = v >= 3 ? {b:3, d:t + 2, n:1} : v === 2 ? {b:2, d:t + 1, n:1} : {b:1, d:t, n:1}; });
  save();
}
function srsMark(key, ok){
  srsInit(); const t = dayNum(); const old = S.srs[key];
  const e = old ? Object.assign({}, old) : {b:0, d:t, n:0};
  if (ok){ e.b = Math.min(6, (e.b || 0) + 1); e.d = t + SRS_INT[e.b]; } else { e.b = 1; e.d = t; }
  e.n = (e.n || 0) + 1; S.srs[key] = e;
  if (!old){ if (!S.srsNew || S.srsNew.day !== t) S.srsNew = {day:t, n:0}; S.srsNew.n++; }
}
function srsQueue(){
  srsInit(); const t = dayNum(); const due = [], fresh = [];
  const started = new Set(Object.keys(S.srs).map(k => k.split(':')[0]));
  sortedSubjects().forEach(s => chaptersOf(s.id).forEach(c => (c.flashcards || []).forEach((f, i) => {
    const e = S.srs[c.id + ':' + i];
    if (e){ if (e.d <= t) due.push({x:{c, i, f}, e}); } else fresh.push({c, i, f, st:started.has(c.id)});
  })));
  due.sort((a, b) => a.e.d - b.e.d || a.e.b - b.e.b);
  fresh.sort((a, b) => (b.st - a.st));
  const room = Math.max(0, NEW_PER_DAY - ((S.srsNew && S.srsNew.day === t) ? S.srsNew.n : 0));
  let next = null; Object.values(S.srs).forEach(e => { if (e.d > t && (next == null || e.d < next)) next = e.d; });
  return {due:due.map(d => d.x), fresh:fresh.slice(0, room), nDue:due.length, nFresh:Math.min(room, fresh.length), next:next == null ? null : next - t};
}
const whenTxt = n => n === 1 ? 'demain' : 'dans ' + n + ' jours';

/* =================== POINTS FAIBLES (questions ratées) =================== */
function errMark(q, right){
  if (!q || q.cid == null || q.qi == null) return;
  if (!S.err || typeof S.err !== 'object') S.err = {};
  const k = q.cid + ':' + q.qi, e = S.err[k];
  if (!right) S.err[k] = {n:(e ? e.n : 0) + 1, t:dayNum()};
  else if (e){ e.n--; if (e.n <= 0) delete S.err[k]; }
  save();
}
function errList(){
  const out = [];
  Object.keys(S.err || {}).forEach(k => { const [cid, qi] = k.split(':'); const c = chap(cid); const q = c && c.quiz && c.quiz[+qi]; if (q) out.push({q:Object.assign({cid, qi:+qi}, q), n:S.err[k].n, t:S.err[k].t}); });
  return out.sort((a, b) => b.n - a.n || b.t - a.t);
}

/* =================== LE PROGRAMME DU JOUR (accueil) =================== */
function planCard(){
  const q = srsQueue(), nRev = q.nDue + q.nFresh, nErr = errList().length, daily = S.daily[dayKey()];
  const fresh = JLG.chapters.filter(c => isNew(c) && chapterProgress(c) < .05).sort((a, b) => (b.added || '').localeCompare(a.added || ''))[0];
  const tile = (go, ic, k, big, sub, done, extra) => `<button class="plan-t${done ? ' done' : ''}${extra ? ' ' + extra : ''}" data-go="${go}"><span class="plan-ic">${icon(done ? 'check' : ic)}</span><span class="plan-k">${k}</span><b class="plan-n">${big}</b><span class="plan-s">${sub}</span></button>`;
  const tiles = [
    tile('train-revision', 'cards', 'Révision du jour', nRev ? nRev : '✓', nRev ? `${q.nDue ? plural(q.nDue, 'carte') + ' à revoir' : ''}${q.nDue && q.nFresh ? ' · ' : ''}${q.nFresh ? plural(q.nFresh, 'nouvelle', 'nouvelles') : ''}` : (q.next ? 'Tout est à jour. Prochaine révision ' + whenTxt(q.next) + '.' : 'Tout est à jour.'), !nRev),
    tile('train-daily', 'bolt', 'Défi du jour', daily != null ? daily + '/5' : '5', daily != null ? 'Relevé ! Reviens demain.' : 'questions, toutes matières', daily != null),
    tile('train-erreurs', 'target', 'Points faibles', nErr || '0', nErr ? (nErr > 1 ? 'questions ratées à retravailler' : 'question ratée à retravailler') : 'Aucune erreur en attente. Bravo.', !nErr)
  ];
  if (fresh) tiles.push(tile('ch-' + fresh.id, 'sparkle', 'Nouveau cours', esc(fresh.short || strip(fresh.title)), esc((subj(fresh.subject) || {}).short || '') + ' · à découvrir', false, 'is-new'));
  return `<section class="plan" aria-label="Ton programme du jour"><div class="section-title" style="margin-top:28px"><h2>Ton programme du jour</h2><span class="tag plain">${fmtDate(dayKey())}</span></div><div class="plan-g n${tiles.length}">${tiles.join('')}</div></section>`;
}

/* =================== RECHERCHE GLOBALE =================== */
const txtOf = v => typeof v === 'string' ? v : Array.isArray(v) ? v.map(txtOf).join(' ') : (v && typeof v === 'object') ? Object.keys(v).filter(k => !['t', 'k', 'w', 'id', 'o', 'e', 'c', 'n', 'num', 'cid'].includes(k)).map(k => txtOf(v[k])).join(' ') : '';
const clean = s => strip(String(s || '')).replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();
let SIDX = null;
function searchIndex(){
  if (SIDX) return SIDX; const out = [];
  const add = (type, title, text, go, opt, sub, w) => { const t = clean(title), x = clean(text); out.push({type, t, x, nt:norm(t), nx:norm(x), go, opt, sub, w:w || 1}); };
  sortedSubjects().forEach(s => chaptersOf(s.id).forEach(c => {
    const where = s.short + ' · ' + c.kicker;
    add('Chapitre', c.title, c.intro, 'ch-' + c.id, null, where, 3);
    c.sections.forEach(sec => add('Cours', sec.title, sec.blocks.filter(b => b.t !== 'widget').map(txtOf).join(' '), 'ch-' + c.id, {sec:sec.id}, where, 2));
    (c.fiche || []).forEach(f => add('Fiche', f.t, txtOf(f.items), 'ch-' + c.id + '-revision', null, where, 1.5));
    (c.traps || []).forEach(t => add('Piège', t.t, t.h, 'ch-' + c.id, null, where, 1.4));
    (c.flashcards || []).forEach(f => add('Flashcard', f.q, f.a, 'ch-' + c.id + '-cartes', null, where, 1));
    (c.cases || []).forEach(k => add('Cas pratique', k.title, txtOf(k.facts) + ' ' + k.q, 'ch-' + c.id + '-cas', {open:k.id}, where, 1));
  }));
  JLG.gloss.forEach(g => add('Lexique', g.t, g.d + (g.ref ? ' ' + g.ref : ''), 'lexique', {q:g.t}, [].concat(g.s).map(subj).filter(Boolean).map(s => s.short).join(' · '), 2.5));
  TOOLS.forEach(t => add('Outil', t.t, t.d, 'outils-' + t.id, null, t.g, 1.6));
  return SIDX = out;
}
function markHTML(text, toks){
  const n = norm(text); if (n.length !== text.length) return esc(text);
  const R = []; toks.forEach(tk => { let i = 0; while (tk && (i = n.indexOf(tk, i)) >= 0){ R.push([i, i + tk.length]); i += tk.length; } });
  if (!R.length) return esc(text);
  R.sort((a, b) => a[0] - b[0]); const M = [R[0]]; R.slice(1).forEach(r => { const l = M[M.length - 1]; if (r[0] <= l[1]) l[1] = Math.max(l[1], r[1]); else M.push(r); });
  let out = '', p = 0; M.forEach(([a, b]) => { out += esc(text.slice(p, a)) + '<mark>' + esc(text.slice(a, b)) + '</mark>'; p = b; });
  return out + esc(text.slice(p));
}
function snippet(it, toks){
  const x = it.x; if (!x) return '';
  let i = -1; toks.forEach(tk => { const j = it.nx.indexOf(tk); if (j >= 0 && (i < 0 || j < i)) i = j; });
  if (i < 0) return markHTML(x.slice(0, 140) + (x.length > 140 ? '…' : ''), toks);
  let a = Math.max(0, i - 50), b = Math.min(x.length, i + 110);
  if (a > 0){ const sp = x.indexOf(' ', a); if (sp > 0 && sp < i) a = sp + 1; }
  if (b < x.length){ const sp = x.lastIndexOf(' ', b); if (sp > i + 20) b = sp; }
  return (a ? '…' : '') + markHTML(x.slice(a, b), toks) + (b < x.length ? '…' : '');
}
function searchRun(q){
  const toks = norm(q).split(/[\s'’,;:.!?()«»"-]+/).filter(t => t.length > 1 || /\d/.test(t));
  if (!toks.length) return {toks, res:[]};
  const nq = norm(q).trim();
  const res = [];
  searchIndex().forEach(it => {
    let sc = 0;
    for (const tk of toks){ const inT = it.nt.includes(tk), inX = it.nx.includes(tk); if (!inT && !inX) return; sc += inT ? 6 : 1; }
    if (it.nt === nq) sc += 30; else if (it.nt.startsWith(nq)) sc += 14; else if (it.nt.includes(nq)) sc += 8;
    res.push({it, sc:sc * it.w});
  });
  res.sort((a, b) => b.sc - a.sc);
  return {toks, res:res.slice(0, 40)};
}
let searchOpen = false;
function openSearch(prefill){
  if (searchOpen) return; searchOpen = true;
  const box = document.createElement('div'); box.className = 'sx'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Rechercher dans tes cours');
  box.innerHTML = `<div class="sx-card">
    <div class="sx-top">${icon('search')}<label class="sr-only" for="sxq">Rechercher</label><input id="sxq" type="search" autocomplete="off" enterkeyhint="search" placeholder="Une notion, un article, un mot…"><button class="icon-btn sx-x" aria-label="Fermer la recherche">${icon('x')}</button></div>
    <div class="sx-res" role="listbox" aria-label="Résultats"></div>
    <p class="sx-foot"><span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span><span><kbd>Entrée</kbd> ouvrir</span><span><kbd>Échap</kbd> fermer</span></p></div>`;
  document.body.appendChild(box); document.documentElement.classList.add('sx-lock');
  const inp = $('#sxq', box), list = $('.sx-res', box); let sel = 0, cur = [];
  const ideas = ['force exécutoire', 'usufruit', 'art. 1198', 'PACS', 'opposabilité', 'servitude', 'nullité', 'hectare'];
  const draw = () => {
    const q = inp.value.trim();
    if (!q){ cur = []; list.innerHTML = `<div class="sx-empty"><p class="muted">Tout le site, d’un coup : cours, fiches, flashcards, lexique, outils, cas pratiques.</p><div class="sx-ideas">${ideas.map(t => `<button class="chip" data-idea="${esc(t)}">${esc(t)}</button>`).join('')}</div></div>`; return; }
    const {toks, res} = searchRun(q); cur = res; sel = 0;
    if (!res.length){ list.innerHTML = `<div class="sx-empty"><p>Rien trouvé pour « ${esc(q)} ».</p><p class="muted">Essaie un mot plus court, ou sans accent.</p></div>`; return; }
    list.innerHTML = res.map(({it}, i) => `<button class="sx-it" role="option" id="sxo${i}" aria-selected="${i === 0}" data-i="${i}"><span class="sx-ty t-${norm(it.type).replace(/\s+/g, '-')}">${it.type}</span><span class="sx-tt">${markHTML(it.t, toks)}</span><span class="sx-sub">${esc(it.sub || '')}</span>${it.x ? `<span class="sx-sn">${snippet(it, toks)}</span>` : ''}</button>`).join('');
    inp.setAttribute('aria-activedescendant', 'sxo0');
  };
  const pickI = i => { const r = cur[i]; if (!r) return; close(); go(r.it.go, Object.assign({}, r.it.opt || {})); };
  const move = d => { if (!cur.length) return; sel = (sel + d + cur.length) % cur.length; $$('.sx-it', list).forEach((b, i) => b.setAttribute('aria-selected', i === sel)); const b = $(`#sxo${sel}`, list); if (b){ b.scrollIntoView({block:'nearest'}); inp.setAttribute('aria-activedescendant', b.id); } };
  const close = () => { searchOpen = false; box.classList.add('out'); document.documentElement.classList.remove('sx-lock'); document.removeEventListener('keydown', onKey, true); setTimeout(() => box.remove(), reduced() ? 0 : 180); };
  const onKey = e => { if (e.key === 'Escape'){ e.preventDefault(); close(); } else if (e.key === 'ArrowDown'){ e.preventDefault(); move(1); } else if (e.key === 'ArrowUp'){ e.preventDefault(); move(-1); } else if (e.key === 'Enter' && document.activeElement === inp){ e.preventDefault(); pickI(sel); } };
  document.addEventListener('keydown', onKey, true);
  let tmr; inp.addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(draw, 90); });
  box.addEventListener('click', e => {
    if (e.target === box || e.target.closest('.sx-x')) return close();
    const it = e.target.closest('.sx-it'); if (it) return pickI(+it.dataset.i);
    const idea = e.target.closest('[data-idea]'); if (idea){ inp.value = idea.dataset.idea; draw(); inp.focus(); }
  });
  if (prefill) inp.value = prefill;
  draw(); setTimeout(() => inp.focus(), 30);
}

/* =================== ÉCOUTER (synthèse vocale) =================== */
const canSpeak = () => 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
const sayable = s => clean(s)
  .replace(/\bart\.\s*/gi, 'article ').replace(/\bal\.\s*/g, 'alinéa ').replace(/C\.\s*civ\./g, 'Code civil').replace(/\bCGI\b/g, 'C G I')
  .replace(/\b1er\b/g, 'premier').replace(/Télé@ctes/g, 'Télé-actes').replace(/≠/g, ' différent de ').replace(/→/g, ', ').replace(/\s\+\s/g, ' plus ')
  .replace(/\bex\.\s*:/gi, 'par exemple :').replace(/\bha\b/g, 'hectares').replace(/\bca\b/g, 'centiares');
let speakEl = null;
function speakStop(){ try { speechSynthesis.cancel(); } catch(e){} if (speakEl){ speakEl.classList.remove('on'); speakEl.setAttribute('aria-pressed', 'false'); speakEl = null; } }
function speak(text, btn){
  if (!canSpeak()) return;
  if (speakEl && speakEl === btn){ speakStop(); return; }
  speakStop();
  const u = new SpeechSynthesisUtterance(sayable(text)); u.lang = 'fr-FR'; u.rate = 1;
  const vs = speechSynthesis.getVoices(); const v = vs.find(x => /^fr[-_]FR/i.test(x.lang)) || vs.find(x => /^fr/i.test(x.lang)); if (v) u.voice = v;
  u.onend = u.onerror = () => { if (speakEl === btn) speakStop(); };
  if (btn){ speakEl = btn; btn.classList.add('on'); btn.setAttribute('aria-pressed', 'true'); }
  speechSynthesis.speak(u);
}
const speakBtn = (what, label) => canSpeak() ? `<button class="speak" data-speak="${what}" aria-pressed="false" aria-label="${esc(label || 'Écouter')}" title="${esc(label || 'Écouter')}">${icon('volume')}</button>` : '';
const sayBlock = b => {
  const j = a => (a || []).map(x => typeof x === 'string' ? x : (x.l || '') + (x.h ? ' : ' + x.h : '')).join('. ');
  switch (b.t){
    case 'def': return b.term + ' : ' + b.h;
    case 'tip': return (TIP[b.k] || TIP.info)[0] + (b.title ? ', ' + b.title : '') + ' : ' + b.h;
    case 'quote': return b.ref + ' : ' + b.h;
    case 'list': return j(b.items);
    case 'table': return (b.rows || []).map(r => r.join(', ')).join('. ');
    case 'vs': return b.a.title + ' : ' + b.a.items.join(', ') + '. ' + b.b.title + ' : ' + b.b.items.join(', ');
    case 'chips': return b.groups.map(g => (g.label ? g.label + ' : ' : '') + j(g.items)).join('. ');
    case 'steps': case 'acc': return j(b.items);
    case 'widget': return '';
    default: return txtOf(b);
  }
};
const sayItem = it => it.d != null ? it.d + ' : ' + it.v : it.a != null ? it.a + ' : ' + it.v : it.kv ? it.kv.map(p => p.join(' : ')).join('. ')
  : it.l != null ? it.l + ' : ' + it.items.join(', ') : it.tab ? (it.tab.rows || []).map(r => r.join(' : ')).join('. ') : it.m != null ? 'Moyen mnémo : ' + it.m : it.p != null ? 'Piège : ' + it.p : txtOf(it);
function speakText(what, btn){
  const [kind, a, b] = what.split('|');
  if (kind === 'sec'){ const c = chap(a); const s = c && c.sections.find(x => x.id === b); return s ? s.title + '. ' + s.blocks.map(sayBlock).filter(Boolean).join('. ') : ''; }
  if (kind === 'fiche'){ const c = chap(a); const f = c && (c.fiche || []).find(x => x.id === b); return f ? f.t + '. ' + f.items.map(sayItem).join('. ') : ''; }
  if (kind === 'card'){ const card = btn.closest('.deck-wrap'); const f = card && $('.fcard', card); if (!f) return ''; const back = f.classList.contains('flipped'); return clean($(back ? '.fa' : '.fq', f).innerHTML); }
  return '';
}
document.addEventListener('click', e => { const b = e.target.closest('[data-speak]'); if (!b) return; e.preventDefault(); e.stopPropagation(); speak(speakText(b.dataset.speak, b), b); }, true);
window.addEventListener('hashchange', speakStop);

/* =================== SAUVEGARDE / RESTAURATION de la progression =================== */
/* Dans la copie claude.ai (artifact, affichée dans un cadre), le téléchargement n’est pas permis : on n’y propose pas la sauvegarde. */
const inArtifact = () => {
  try { if (window.self !== window.top) return true; } catch(e){ return true; }
  return !!(window.claude && window.claude.hot) || /claude(usercontent)?\.(ai|com)$/.test(location.hostname);
};
function backupDownload(){
  try {
    const data = JSON.stringify(Object.assign({_app:'alves-cances', _date:new Date().toISOString()}, S), null, 0);
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], {type:'application/json'}));
    a.download = 'alves-cances-progression-' + dayKey() + '.json'; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    toast('Sauvegarde téléchargée. Garde ce fichier précieusement !');
  } catch(err){ toast('Le téléchargement n’est pas possible ici.'); }
}
function backupRestore(file){
  const r = new FileReader();
  r.onload = () => {
    let d = null; try { d = JSON.parse(r.result); } catch(e){}
    if (!d || typeof d !== 'object' || typeof d.xp !== 'number' || d.xp < 0){ toast('Ce fichier n’est pas une sauvegarde d’Alves Cances.'); return; }
    const a = levelOf(S.xp), b = levelOf(d.xp);
    const close = modal(`<h3>Restaurer ?</h3><p class="muted">Ta progression actuelle (niveau ${a.n}, ${fmtNum(S.xp)} XP) sera remplacée par la sauvegarde${d._date ? ' du ' + esc(fmtDate(String(d._date).slice(0, 10))) : ''} (niveau ${b.n}, ${fmtNum(d.xp)} XP).</p><div class="btn-row" style="justify-content:center"><button class="btn btn-primary" data-ok>Restaurer</button><button class="btn" data-close>Annuler</button></div>`);
    $('#modal [data-ok]').onclick = () => { delete d._app; delete d._date; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch(e){} close(); location.reload(); };
  };
  r.readAsText(file);
}
document.addEventListener('click', e => {
  if (e.target.closest('[data-backup]')){ backupDownload(); return; }
  if (e.target.closest('[data-restore]')){ const i = document.createElement('input'); i.type = 'file'; i.accept = '.json,application/json'; i.onchange = () => { if (i.files && i.files[0]) backupRestore(i.files[0]); }; i.click(); return; }
  const th = e.target.closest('[data-theme-set]'); if (th){ const v = th.dataset.themeSet; S.theme = v === 'auto' ? null : v; save(); applyTheme(); $$('[data-theme-set]').forEach(b => b.setAttribute('aria-selected', b === th)); }
});

/* =================== HORS LIGNE (application installable) =================== */
function swInit(){
  if (!('serviceWorker' in navigator)) return;
  if (!/(^|\.)github\.io$/.test(location.hostname) && location.hostname !== 'localhost') return;
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
}

/* Les tableaux qui défilent doivent rester accessibles au clavier, même ceux créés par les schémas. */
function a11yObserve(){
  const v = $('#view'); if (!v || !window.MutationObserver) return;
  let n = 0; const fix = () => $$('.ap-tbl:not([tabindex]), .tbl:not([tabindex]), .fi-tab:not([tabindex])', v).forEach(t => { t.tabIndex = 0; t.setAttribute('role', 'region'); if (!t.hasAttribute('aria-label')){ const th = t.querySelector('th, td'); t.setAttribute('aria-label', 'Tableau ' + (++n) + (th ? ' : ' + th.textContent.trim().slice(0, 40) : '')); } });
  new MutationObserver(fix).observe(v, {childList:true, subtree:true}); fix();
}

/* Installer l’appli (écran d’accueil) */
let installEvt = null;
const onlineSite = () => /(^|\.)github\.io$/.test(location.hostname) || location.hostname === 'localhost';
const isStandalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; $$('[data-install]').forEach(b => { b.hidden = false; }); });
window.addEventListener('appinstalled', () => { installEvt = null; toast('Alves Cances est installée. Retrouve-la sur ton écran d’accueil !'); $$('[data-install]').forEach(b => { b.hidden = true; }); });
function installItem(){
  if (!onlineSite()) return '';
  const txt = isStandalone() ? 'C’est fait : tu utilises déjà l’appli.' : isIOS() ? 'Sur iPhone : touche le bouton Partager, puis « Sur l’écran d’accueil ». Elle marchera même hors ligne.' : 'Dans le menu de ton navigateur, choisis « Installer l’application » ou « Ajouter à l’écran d’accueil » : Alves Cances s’ouvrira comme une vraie appli, même sans internet.';
  return `<div class="set-item"><div><b>Installer l’appli</b><span class="muted">${txt}</span></div><div class="btn-row"><button class="btn btn-sm" data-install${installEvt && !isStandalone() ? '' : ' hidden'}>${icon('house')}Installer</button></div></div>`;
}
document.addEventListener('click', async e => {
  if (!e.target.closest('[data-install]') || !installEvt) return;
  const ev = installEvt; installEvt = null;
  try { ev.prompt(); await ev.userChoice; } catch(err){}
  $$('[data-install]').forEach(b => { b.hidden = true; });
});

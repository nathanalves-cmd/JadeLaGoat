
/* =================== NAVIGATION =================== */
const TABS = [['home','Accueil','home'],['cours','Cours','book'],['fiches','Fiches','fiche'],['train',"S'entraîner",'bolt'],['outils','Outils','tools'],['lexique','Lexique','az']];
function navFor(r){ if (r === 'cours' || r.indexOf('ch-') === 0 || r.indexOf('sub-') === 0) return 'cours'; if (r.indexOf('fiches') === 0) return 'fiches'; if (r.indexOf('train') === 0) return 'train'; if (r.indexOf('outils') === 0) return 'outils'; if (r === 'lexique') return 'lexique'; if (r === 'progres') return ''; return 'home'; }
function renderNav(){
  $('#tabbar').innerHTML = TABS.map(([r, l, i]) => `<button data-go="${r}">${icon(i)}<span>${l}</span></button>`).join('');
  $('#topnav').innerHTML = TABS.map(([r, l]) => `<button data-go="${r}">${l}</button>`).join('');
}
function setNav(r){ const t = navFor(r); $$('#tabbar button, #topnav button').forEach(b => { if (b.getAttribute('data-go') === t) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); }); }

let ROUTE = 'home';
function go(r, opt = {}){
  r = String(r || 'home');
  const p = r.split('-');
  let out;
  switch (p[0]){
    case 'cours': out = viewCours(); break;
    case 'sub': out = subj(p[1]) ? viewSubject(p[1]) : null; break;
    case 'ch': out = chap(p[1]) ? viewChapter(p[1], p[2] || 'fiche', opt) : null; break;
    case 'fiches': out = viewFiches(p[1], p[2]); break;
    case 'train': out = viewTrain(p[1], p[2], opt); break;
    case 'outils': out = viewOutils(p[1]); break;
    case 'lexique': out = viewLexique(opt); break;
    case 'progres': out = viewProgress(); break;
    case 'home': out = viewHome(); break;
  }
  if (!out){ r = 'home'; out = viewHome(); }
  ROUTE = r;
  if (!opt.silent){ try { if (location.hash.slice(1) !== r) history.pushState({r}, '', '#' + r); } catch(e){} }
  if (p[0] === 'ch'){ S.last = r; save(); }
  const v = $('#view');
  v.innerHTML = `<div class="wrap view-enter">${out.html}</div>`;
  mountWidgets(v);
  if (out.mount) out.mount(v);
  setNav(r);
  if (!opt.keepScroll) window.scrollTo(0, 0);
}
function mountWidgets(root){
  $$('[data-w]', root).forEach(el => {
    if (el.__mounted) return; el.__mounted = true;
    const fn = JLG.widgets[el.getAttribute('data-w')];
    let o = {}; try { o = JSON.parse(el.getAttribute('data-o') || '{}'); } catch(e){}
    if (fn) { try { fn(el, o); } catch(err){ el.innerHTML = '<div class="empty">Ce schéma n’a pas pu s’afficher.</div>'; console.error(err); } }
  });
}

/* =================== BLOCS DE FICHE =================== */
const CHIPS = [];
const TIP = {memo:['Moyen mnémo','sparkle'], piege:['Piège à éviter','alert'], prof:['Le + du prof','hat'], ex:['Exemple','bulb'], notaire:['En étude notariale','seal'], info:['À savoir','book']};
function block(b){
  switch (b.t){
    case 'p': return `<p>${b.h}</p>`;
    case 'h3': return `<h3>${b.h}${b.small ? ` <small>${b.small}</small>` : ''}</h3>`;
    case 'def': return `<div class="def"><div class="k"><span>Définition</span>${b.ref ? `<span>${b.ref}</span>` : ''}</div><div class="term">${b.term}</div><div>${b.h}</div></div>`;
    case 'tip': { const d = TIP[b.k] || TIP.info; return `<div class="tip ${b.k}"><div class="ti">${icon(d[1])}</div><div><div class="tt">${b.title || d[0]}</div><div class="tb">${b.h}</div></div></div>`; }
    case 'quote': return `<figure class="quote" style="margin:0"><div class="ref">${b.ref}</div><blockquote class="qt" style="margin:0">${b.h}</blockquote></figure>`;
    case 'list': return `<ul class="list${b.num ? ' num' : ''}">${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    case 'table': return `<div class="tbl"><table>${b.head ? `<thead><tr>${b.head.map(h => `<th>${h}</th>`).join('')}</tr></thead>` : ''}<tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    case 'vs': return `<div class="vs">${[b.a, b.b].map(c => `<div class="vs-col"><h4>${c.title}</h4><ul>${c.items.map(i => `<li>${i}</li>`).join('')}</ul></div>`).join('')}<span class="vs-badge">vs</span></div>`;
    case 'chips': { CHIPS.push(b.groups); return `<div class="chips-wrap" data-cd="${CHIPS.length - 1}">${b.groups.map((g, gi) => `<div class="chips-group" data-cg="${gi}">${g.label ? `<div class="chips-label">${g.label}</div>` : ''}<div class="chips">${g.items.map((it, ii) => `<button class="chip" aria-expanded="false" data-ci="${ii}">${it.l}</button>`).join('')}</div><div class="chip-slot"></div></div>`).join('')}</div>`; }
    case 'tree': return `<div class="tree">${treeNode(b.root)}</div>`;
    case 'steps': return `<ol class="steps">${b.items.map(i => `<li><div><b>${i.l}</b>${i.h ? `<span class="muted">${i.h}</span>` : ''}</div></li>`).join('')}</ol>`;
    case 'acc': return b.items.map(i => `<details class="acc"><summary>${i.l}</summary><div class="acc-b">${i.h}</div></details>`).join('');
    case 'widget': return `<div class="wslot" data-w="${b.w}" data-o='${esc(JSON.stringify(b.o || {}))}'></div>`;
    default: return '';
  }
}
function treeNode(n){
  return `<div class="tree-node"><div class="tn">${n.l}</div>${n.h ? `<div class="td">${n.h}</div>` : ''}</div>${n.kids ? `<div class="tree-kids">${n.kids.map(treeNode).join('')}</div>` : ''}`;
}
function bindChips(root){
  $$('.chips-wrap', root).forEach(w => {
    const groups = CHIPS[+w.dataset.cd] || [];
    w.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      const g = b.closest('.chips-group'); const gi = +g.dataset.cg, ii = +b.dataset.ci;
      const open = b.getAttribute('aria-expanded') === 'true';
      $$('.chip', g).forEach(x => x.setAttribute('aria-expanded', 'false'));
      const slot = $('.chip-slot', g);
      if (open){ slot.innerHTML = ''; return; }
      b.setAttribute('aria-expanded', 'true');
      const it = groups[gi].items[ii];
      slot.innerHTML = `<div class="chip-detail"><b>${it.l}</b>${it.h}</div>`;
    });
  });
}

/* =================== ACCUEIL =================== */
const chars = (w, d0 = .3) => w.split('').map((c, i) => `<span class="ch" style="animation-delay:${(d0 + i * .06).toFixed(2)}s">${c}</span>`).join('');
function allCards(){ const out = []; JLG.chapters.forEach(c => (c.flashcards || []).forEach((f, i) => out.push({c, i, f}))); return out; }
function stats(){
  const cards = allCards(); const known = cards.filter(x => (S.cards[x.c.id + ':' + x.i] || 0) >= 2).length;
  return {cards:cards.length, known, streak:streak(), lv:levelOf(S.xp)};
}
function chapRow(c){
  const pct = Math.round(chapterProgress(c) * 100);
  const nC = (c.flashcards || []).length, nQ = (c.quiz || []).length;
  return `<button class="chap-row" data-go="ch-${c.id}">
    <span class="chap-num">${esc(c.num)}</span>
    <span style="min-width:0"><span class="t">${c.title}${isNew(c) ? ' <span class="new-badge">Nouveau</span>' : ''}</span>
      <span class="s">${esc(c.kicker)} · ${c.minutes} min · ${nC} cartes · ${nQ} questions · ${pct} %</span>
      <span class="meter"><i style="width:${pct}%"></i></span></span>
    <span class="arrow">${icon('arrow')}</span></button>`;
}
function subjectPanel(s){
  const cs = chaptersOf(s.id);
  return `<article class="subject">
    <div class="subject-head"><span class="subject-code">${esc(s.code)}</span><h3>${s.title}</h3><p class="muted">${s.desc}</p></div>
    ${cs.length ? cs.map(chapRow).join('') : '<div class="empty" style="margin:16px">Les cours de cette matière arrivent bientôt.</div>'}
    <div class="subject-foot">${ficheCount(s.id).n ? `<button class="btn btn-sm" data-go="fiches-${s.id}">${icon('fiche')}Fiche</button>` : ''}<button class="btn btn-sm" data-go="train-exam-${s.id}">${icon('trophy')}Examen blanc</button><button class="btn btn-sm btn-ghost" data-go="sub-${s.id}">Voir la matière</button></div>
  </article>`;
}
function allTraps(){ const t = []; JLG.chapters.forEach(c => (c.traps || []).forEach(x => t.push({c, x}))); return t; }
function trapOfDay(){
  const t = allTraps(); if (!t.length) return '';
  const d = new Date(); const r = seeded(d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate())();
  const pick = t[Math.floor(r * t.length)]; const s = subj(pick.c.subject);
  return `<div class="trap-card"><div class="eyebrow">${icon('alert', 'sr-only')}${esc(s ? s.short : '')} · ${esc(pick.c.kicker)}</div><p><b>${pick.x.t}</b></p><p class="muted" style="margin-top:4px">${pick.x.h}</p><div class="btn-row" style="margin-top:12px"><button class="btn btn-sm" data-go="ch-${pick.c.id}">Revoir le cours</button></div></div>`;
}
function viewHome(){
  const lastC = S.last && chap(S.last.split('-')[1]);
  const html = `
  <section class="hero">
    <div class="hero-seal" aria-hidden="true">${sealSVG()}</div>
    <div>
      <div class="eyebrow">BTS <b>Collaborateur juriste notarial</b> · 2026-2027</div>
      <h1 class="hero-title" aria-label="Alves Cances"><span class="l1">${chars('Alves')}</span><span class="l2"><em>${chars('Cances', .62)}</em></span></h1>
      <p class="hero-sub">Ton QG de révision : des fiches claires, des schémas animés, des quiz, des flashcards, des jeux et des cas pratiques corrigés.</p>
      <div class="hero-cta btn-row">
        ${lastC ? `<button class="btn btn-primary" data-go="${S.last}">${icon('play')}Reprendre : ${esc(lastC.short || lastC.title)}</button>` : `<button class="btn btn-primary" data-go="cours">${icon('book')}Commencer les cours</button>`}
        <button class="btn" data-go="train-daily">${icon('bolt')}Défi du jour${S.daily[dayKey()] != null ? ' ✓' : ''}</button>
      </div>
    </div>
  </section>
  ${lvlCard()}
  ${questsCard()}
  <div class="section-title"><h2>Tes matières</h2><button class="btn btn-sm btn-ghost" data-go="cours">Tout voir</button></div>
  <div class="subjects stagger">${sortedSubjects().map(subjectPanel).join('')}</div>
  ${allTraps().length ? `<div class="section-title"><h2>Le piège du jour</h2></div>${trapOfDay()}` : ''}
  <div class="section-title"><h2>Raccourcis</h2></div>
  <div class="quick-grid stagger">
    ${quick('fiches', 'fiche', 'Fiches à apprendre', 'Une fiche par matière, avec le mode cache.')}
    ${quick('train-daily', 'bolt', 'Défi du jour', '5 questions tirées de tous tes cours.')}
    ${quick('progres', 'trophy', 'Le jeu', '12 niveaux, des coffres, des jokers et des quêtes.')}
    ${quick('train', 'cards', 'Flashcards & jeux', 'Retourne les cartes, trie, gagne de l’XP.')}
    ${quick('outils-duel', 'seal', 'Le duel des actes', 'Sous seing privé contre acte authentique.')}
    ${quick('outils-effetrel', 'pen', 'Clause « effet relatif »', 'Le générateur, avec le bon vocabulaire.')}
    ${quick('outils-chaine', 'clock', 'La chaîne des propriétaires', 'Remonter 30 ans pour l’origine de propriété.')}
    ${quick('outils-bareme', 'euro', 'Barème de l’usufruit', 'L’article 669 du CGI, en un curseur.')}
    ${quick('outils-galerie', 'doc', 'Les clauses du cours', 'Désignation, effet relatif, origine, autres clauses.')}
    ${quick('outils-famille', 'family', 'Qui peut-on épouser ?', 'L’arbre des empêchements, mariage et PACS.')}
    ${quick('outils-convert', 'calc', 'Convertisseur ha · a · ca', 'Les m² en hectares, ares, centiares.')}
    ${quick('outils-methode', 'scale', 'Méthode du cas pratique', 'Les 5 étapes pour ne jamais sécher.')}
    ${quick('lexique', 'az', 'Lexique', 'Tous les mots-clés, définis simplement.')}
  </div>
  ${JLG.logs.length ? `<div class="section-title"><h2>Nouveautés</h2></div><div class="log">${JLG.logs.slice().sort((a, b) => b.date.localeCompare(a.date)).map(l => `<div class="log-item"><time datetime="${l.date}">${fmtDate(l.date)}</time><ul>${l.items.map(i => `<li>${i}</li>`).join('')}</ul></div>`).join('')}</div>` : ''}
  <p class="faint" style="margin-top:36px;font-size:.85rem">Fait pour Jade, avec beaucoup de violet. Ta progression reste enregistrée sur cet appareil.</p>`;
  return {html};
}
const quick = (r, ic, t, s) => `<button class="quick" data-go="${r}"><span class="ico">${icon(ic)}</span><span><b>${t}</b><span>${s}</span></span></button>`;

/* =================== COURS & MATIÈRE =================== */
function viewCours(){
  return {html:`<div class="eyebrow">Programme</div><h1 style="font-size:var(--fs-3xl);margin:8px 0 10px">Tes cours</h1>
  <p class="lead">Chaque matière a ses chapitres. Dans chaque chapitre : le cours, la fiche à apprendre, les flashcards, le quiz, les jeux et les cas pratiques.</p>
  <div class="subjects stagger" style="margin-top:24px">${sortedSubjects().map(subjectPanel).join('')}</div>`};
}
function viewSubject(sid){
  const s = subj(sid), cs = chaptersOf(sid);
  return {html:`<div class="crumbs"><button data-go="cours">Cours</button><span>/</span><span>${esc(s.short)}</span></div>
  <div class="chap-head"><span class="subject-code">${esc(s.code)}</span><h1>${s.title}</h1><p class="lead">${s.desc}</p></div>
  <div class="subject stagger" style="margin-top:22px">${cs.map(chapRow).join('') || '<div class="empty" style="margin:16px">Les cours arrivent bientôt.</div>'}</div>
  <div class="btn-row" style="margin-top:18px">${ficheCount(sid).n ? `<button class="btn btn-primary" data-go="fiches-${sid}">${icon('fiche')}Apprendre la fiche</button>` : ''}<button class="btn" data-go="train-exam-${sid}">${icon('trophy')}Lancer l’examen blanc</button></div>`};
}

/* =================== CHAPITRE =================== */
const CTABS = [['fiche','Cours','book'],['revision','Fiche','fiche'],['cartes','Flashcards','cards'],['quiz','Quiz','target'],['jeux','Jeux','grid'],['cas','Cas pratiques','scale']];
function tabCount(c, t){ return t === 'revision' ? (c.fiche || []).length : t === 'cartes' ? (c.flashcards || []).length : t === 'quiz' ? (c.quiz || []).length : t === 'jeux' ? (c.sorts || []).length + (c.extraGames || []).length : t === 'cas' ? (c.cases || []).length : null; }
function viewChapter(cid, tab, opt){
  const c = chap(cid), s = subj(c.subject);
  const tabs = CTABS.filter(([t]) => t === 'fiche' || tabCount(c, t));
  if (!tabs.find(x => x[0] === tab)) tab = 'fiche';
  const html = `<div class="crumbs"><button data-go="cours">Cours</button><span>/</span><button data-go="sub-${s.id}">${esc(s.short)}</button><span>/</span><span>${esc(c.kicker)}</span></div>
  <header class="chap-head">
    <div class="eyebrow"><b>${esc(c.kicker)}</b> · ${esc(s.title)}</div>
    <h1>${c.titleHtml || c.title}</h1>
    <div class="chap-facts"><span class="tag plain">${icon('clock', 'sr-only')}${c.minutes} min de lecture</span><span class="tag plain">${(c.flashcards || []).length} flashcards</span><span class="tag plain">${(c.quiz || []).length} questions</span>${isNew(c) ? '<span class="new-badge">Nouveau</span>' : ''}</div>
  </header>
  <div class="tabs" role="tablist" aria-label="Sections du chapitre">${tabs.map(([t, l, i]) => `<button role="tab" aria-selected="${t === tab}" data-tab="${t}">${icon(i)}${l}${tabCount(c, t) ? ` <span class="count">${tabCount(c, t)}</span>` : ''}</button>`).join('')}</div>
  <div class="tab-panel" id="tabPanel"></div>`;
  return {html, mount(v){
    const panel = $('#tabPanel', v);
    const show = (t, o = {}) => {
      $$('.tabs [role=tab]', v).forEach(b => b.setAttribute('aria-selected', b.dataset.tab === t));
      panel.innerHTML = ''; panel.className = 'tab-panel view-enter';
      if (t === 'fiche') renderFiche(panel, c, o.open);
      else if (t === 'revision') renderRevision(panel, c);
      else if (t === 'cartes') runCards(panel, c.flashcards.map((f, i) => ({c, i, f})), {title:c.title});
      else if (t === 'quiz') quizHome(panel, c);
      else if (t === 'jeux') gamesHome(panel, c, o.open);
      else if (t === 'cas') casesHome(panel, c, o.open);
      const r = 'ch-' + c.id + (t === 'fiche' ? '' : '-' + t); ROUTE = r; S.last = r; save();
      try { history.replaceState({r}, '', '#' + r); } catch(e){}
    };
    $('.tabs', v).addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; show(b.dataset.tab); const top = $('.tabs', v).getBoundingClientRect().top + scrollY - 70; if (scrollY > top) window.scrollTo({top, behavior: reduced() ? 'auto' : 'smooth'}); });
    panel.addEventListener('click', e => { const b = e.target.closest('[data-tab-go]'); if (!b) return; const t = $(`.tabs [data-tab="${b.dataset.tabGo}"]`, v); if (t) t.click(); });
    show(tab, opt);
  }};
}
function renderFiche(panel, c, open){
  if (open) setTimeout(() => { const w = $(`[data-w="${open}"]`, panel); if (w) w.scrollIntoView({block:'center'}); }, 80);
  panel.innerHTML = `<div class="col">
    ${c.intro ? `<p class="lead">${c.intro}</p>` : ''}
    ${c.objectives ? `<div class="objectives"><div class="eyebrow">Objectifs</div><ul>${c.objectives.map(o => `<li>${o}</li>`).join('')}</ul></div>` : ''}
    ${c.prereq ? `<p class="muted" style="font-size:.9rem;margin-top:10px"><b>Prérequis :</b> ${c.prereq}</p>` : ''}
    <nav class="toc" aria-label="Plan du chapitre">${c.sections.map(s => `<button data-sec="${s.id}"><b>${s.n}</b>${strip(s.title)}</button>`).join('')}</nav>
  </div>
  ${c.sections.map(s => `<section class="sec" id="sec-${s.id}"><div class="sec-head"><span class="sec-num">${s.n}</span>${s.eyebrow ? `<span class="eyebrow">${s.eyebrow}</span>` : '<span></span>'}<h2>${s.title}</h2></div><div class="blocks col">${s.blocks.map(block).join('')}</div></section>`).join('')}
  ${c.essentials ? `<div class="essentials col"><h2>${icon('crown')}L’essentiel à retenir</h2><ol>${c.essentials.map(e => `<li>${e}</li>`).join('')}</ol></div>` : ''}
  <div class="next-cta">${tabCount(c, 'revision') ? `<button class="btn btn-primary" data-tab-go="revision">${icon('fiche')}Apprendre la fiche</button>` : ''}${tabCount(c, 'cartes') ? `<button class="btn${tabCount(c, 'revision') ? '' : ' btn-primary'}" data-tab-go="cartes">${icon('cards')}Passer aux flashcards</button>` : ''}${tabCount(c, 'quiz') ? `<button class="btn" data-tab-go="quiz">${icon('target')}Faire le quiz</button>` : ''}</div>`;
  mountWidgets(panel); bindChips(panel);
  $('.toc', panel).addEventListener('click', e => { const b = e.target.closest('[data-sec]'); if (!b) return; const el = $('#sec-' + b.dataset.sec, panel); if (el) el.scrollIntoView({behavior: reduced() ? 'auto' : 'smooth', block:'start'}); });
}

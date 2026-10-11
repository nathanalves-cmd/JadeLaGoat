
/* =================== S'ENTRAÎNER =================== */
function allQuestions(filter){ const out = []; JLG.chapters.forEach(c => { if (filter && !filter(c)) return; (c.quiz || []).forEach((q, i) => out.push(Object.assign({cid:c.id, qi:i}, q))); }); return out; }
function viewTrain(a, b, opt){
  if (a === 'daily') return {html:`<div class="crumbs"><button data-go="train">S’entraîner</button><span>/</span><span>Défi du jour</span></div><div class="eyebrow">${fmtDate(dayKey())}</div><h1 style="font-size:var(--fs-3xl);margin:6px 0 18px">Défi du jour</h1><div id="tp"></div>`,
    mount(v){
      const d = new Date(); const rnd = seeded(d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate());
      const qs = shuffle(allQuestions(), rnd).slice(0, 5);
      runQuiz($('#tp', v), qs, {kind:'daily', title:'Défi du jour', onDone(sc, tot, ev){ const first = S.daily[dayKey()] == null; S.daily[dayKey()] = sc; save(); if (first){ addXP(40, ev); quest('daily'); } }});
    }};
  if (a === 'exam' && subj(b)) { const s = subj(b); return {html:`<div class="crumbs"><button data-go="train">S’entraîner</button><span>/</span><span>Examen blanc</span></div><div class="eyebrow">${esc(s.code)}</div><h1 style="font-size:var(--fs-3xl);margin:6px 0 8px">Examen blanc</h1><p class="lead" style="margin-bottom:20px">${esc(s.title)} · 20 questions tirées au hasard, note sur 20.</p><div id="tp"></div>`,
    mount(v){ const qs = shuffle(allQuestions(c => c.subject === s.id)).slice(0, 20); runQuiz($('#tp', v), qs, {kind:'exam', title:'Examen blanc', timer:true, onDone(){ quest('exam'); }}); }}; }
  if (a === 'cards' && subj(b)) { const s = subj(b); return {html:`<div class="crumbs"><button data-go="train">S’entraîner</button><span>/</span><span>Flashcards</span></div><div class="eyebrow">${esc(s.code)}</div><h1 style="font-size:var(--fs-3xl);margin:6px 0 18px">Toutes les cartes</h1><div id="tp"></div>`,
    mount(v){ const deck = []; chaptersOf(s.id).forEach(c => (c.flashcards || []).forEach((f, i) => deck.push({c, i, f}))); runCards($('#tp', v), deck, {title:s.short}); }}; }

  const daily = S.daily[dayKey()];
  const games = []; const cases = [];
  JLG.chapters.forEach(c => { (c.sorts || []).forEach(g => games.push({c, g})); (c.cases || []).forEach(k => cases.push({c, k})); });
  const html = `<div class="eyebrow">Entraînement</div><h1 style="font-size:var(--fs-3xl);margin:6px 0 10px">S’entraîner</h1>
  <p class="lead">Chaque bonne réponse rapporte de l’XP. Un peu chaque jour vaut mieux que tout la veille.</p>
  <div class="mode-grid" style="margin-top:22px">
    <div class="panel" style="display:grid;gap:10px"><div class="eyebrow">${icon('bolt', 'sr-only')}Défi du jour</div><h3>${daily != null ? `Fait : ${daily}/5 ✓` : '5 questions, toutes matières'}</h3><p class="muted">Le même défi toute la journée. +40 XP la première fois.</p><div><button class="btn btn-primary" data-go="train-daily">${icon('play')}${daily != null ? 'Le refaire' : 'Relever le défi'}</button></div></div>
    <div class="panel" style="display:grid;gap:10px"><div class="eyebrow">Examens blancs</div><h3>Note sur 20, chrono lancé</h3><p class="muted">20 questions au hasard dans une matière.</p><div class="btn-row">${sortedSubjects().map(s => `<button class="btn btn-sm" data-go="train-exam-${s.id}">${icon('trophy')}${esc(s.short)}</button>`).join('')}</div></div>
  </div>
  <div class="section-title"><h2>Quêtes du jour</h2><button class="btn btn-sm btn-ghost" data-go="progres">Le jeu</button></div>
  ${questsCard()}
  <div class="section-title"><h2>Flashcards</h2></div>
  <div class="subjects">${sortedSubjects().map(s => `<article class="subject"><div class="subject-head"><span class="subject-code">${esc(s.code)}</span><h3>${esc(s.short)}</h3></div>${chaptersOf(s.id).map(c => { const n = (c.flashcards || []).length; const k = (c.flashcards || []).filter((f, i) => (S.cards[c.id + ':' + i] || 0) >= 2).length; return `<button class="chap-row" data-go="ch-${c.id}-cartes"><span class="chap-num">${esc(c.num)}</span><span style="min-width:0"><span class="t">${c.title}</span><span class="s">${k}/${n} cartes maîtrisées</span><span class="meter"><i style="width:${n ? Math.round(k / n * 100) : 0}%"></i></span></span><span class="arrow">${icon('arrow')}</span></button>`; }).join('')}<div class="subject-foot"><button class="btn btn-sm" data-go="train-cards-${s.id}">${icon('cards')}Mélanger toute la matière</button></div></article>`).join('')}</div>
  <div class="section-title"><h2>Jeux de tri</h2></div>
  <div class="game-list stagger">${games.map(({c, g}) => `<button class="quick" data-go="ch-${c.id}-jeux" data-open="${g.id}"><span class="ico">${icon('grid')}</span><span><b>${g.title}</b><span>${esc(c.kicker)} · ${g.items.length} cartes${S.sorts[g.id] != null ? ` · record ${Math.round(S.sorts[g.id] * 100)} %` : ''}</span></span></button>`).join('')}</div>
  <div class="section-title"><h2>Défis interactifs</h2></div>
  <div class="game-list">
    ${quick('outils-qualif', 'tree', 'Qualifie l’opération', 'L’arbre de décision du notaire.')}
    ${quick('outils-contenances', 'calc', 'Additions de contenances', 'Comme dans une vraie désignation.')}
    ${quick('outils-cadastre', 'map', 'Lire un plan cadastral', 'Section, numéro, contenance.')}
    ${chap('immo1') ? `<button class="quick" data-go="ch-immo1" data-open="maison"><span class="ico">${icon('house')}</span><span><b>La ferme aux immeubles</b><span>Nature, destination ou objet ? Trouve-les.</span></span></button>` : ''}
    ${chap('immo2') ? [['chaine', 'clock', 'Remonte la chaîne des propriétaires', 'L’ordre des actes, l’effet relatif, l’origine.'], ['prescription', 'scale', 'Usucapion : prescrit ou pas ?', 'Bonne foi, juste titre, tolérance.'], ['etages', 'house', 'Qui a le droit de… ?', 'Usufruitier, nu-propriétaire ou usager ?'], ['voisinage', 'tree', 'Le voisin a-t-il le droit ?', 'Arbres, haies et fenêtres.']].map(([w, ic, t, d]) => `<button class="quick" data-go="ch-immo2-jeux" data-open="${w}"><span class="ico">${icon(ic)}</span><span><b>${t}</b><span>${d}</span></span></button>`).join('') : ''}
    ${chap('deo1') ? [['opposabilite', 'clock', 'La course à la publication', 'Deux acheteurs, une maison : qui l’emporte ?'], ['etude', 'doc', 'Le dossier fait le tour de l’étude', 'Envoie chaque tâche au bon bureau.']].map(([w, ic, t, d]) => `<button class="quick" data-go="ch-deo1-jeux" data-open="${w}"><span class="ico">${icon(ic)}</span><span><b>${t}</b><span>${d}</span></span></button>`).join('') : ''}
    ${quick('outils-famille', 'family', 'Qui peut-on épouser ?', 'L’arbre des empêchements, mariage et PACS.')}
    ${quick('outils-nullite', 'alert', 'Simulateur de nullité', 'Absolue ou relative, qui agit, quel délai.')}
    ${quick('outils-pacs', 'split', 'Séparation ou indivision ?', 'Range les biens du couple pacsé.')}
    ${quick('outils-couples', 'ladder', 'Concubinage, PACS, mariage', 'Compare les trois, critère par critère.')}
  </div>
  <div class="section-title"><h2>Cas pratiques corrigés</h2></div>
  <div class="case-list">${cases.map(({c, k}) => `<button class="case-card" data-go="ch-${c.id}-cas" data-open="${k.id}"><span class="eyebrow">${esc(c.kicker)} · ${esc(k.tag || '')}</span><b>${k.title}</b>${S.cases[k.id] ? '<span class="done">✓ Fait</span>' : ''}</button>`).join('')}</div>`;
  return {html};
}

/* =================== OUTILS =================== */
const TOOLS = [
  {id:'convert', g:'Notariat & immobilier', t:'Convertisseur ha · a · ca', d:'Passe des m² aux hectares, ares et centiares, comme dans un acte.', w:'convert'},
  {id:'contenances', g:'Notariat & immobilier', t:'Additions de contenances', d:'Additionne des parcelles et retrouve le total à l’are près.', w:'trainer'},
  {id:'clause', g:'Notariat & immobilier', t:'Générateur de clause « désignation »', d:'Remplis les champs : la clause s’écrit toute seule, avec les 4 mentions obligatoires.', w:'builder'},
  {id:'galerie', g:'Notariat & immobilier', t:'Galerie des clauses du cours', d:'Désignation, effet relatif, origine de propriété et autres clauses : les modèles de ton cours, avec le surligneur.', w:'gallery'},
  {id:'cadastre', g:'Notariat & immobilier', t:'Lire un plan cadastral', d:'Touche une parcelle pour lire sa référence cadastrale.', w:'cadastre'},
  {id:'qualif', g:'Notariat & immobilier', t:'Qualifier une opération immobilière', d:'Réponds aux questions : l’arbre te donne la qualification.', w:'qualif'},
  {id:'ventil', g:'Notariat & immobilier', t:'Ventilation des meubles', d:'Pourquoi le notaire liste les meubles avec leur prix : calcule l’assiette taxable.', w:'ventil'},
  {id:'effetrel', g:'Immobilier · Séance 2', t:'Générateur de clause « effet relatif »', d:'Dis comment le vendeur a eu le bien : la clause s’écrit, avec « bureau des hypothèques » avant 2013.', w:'effetrel'},
  {id:'chaine', g:'Immobilier · Séance 2', t:'La chaîne des propriétaires (30 ans)', d:'Effet relatif ou origine de propriété ? La frise de la vente DITCH.', w:'chaine'},
  {id:'bareme', g:'Immobilier · Séance 2', t:'Barème de l’usufruit (art. 669 CGI)', d:'L’âge de l’usufruitier fait la valeur de l’usufruit et de la nue-propriété.', w:'bareme'},
  {id:'etages', g:'Immobilier · Séance 2', t:'Qui a quoi ? La maison en trois étages', d:'Usus, fructus, abusus : plein propriétaire, usufruitier, nu-propriétaire, usager.', w:'etages'},
  {id:'usucapion', g:'Immobilier · Séance 2', t:'Simulateur d’usucapion', d:'Bonne foi, juste titre, simple tolérance : 10 ans, 30 ans ou jamais.', w:'prescription'},
  {id:'voisinage', g:'Immobilier · Séance 2', t:'Distances entre voisins', d:'Plantations et fenêtres : ce que dit le Code civil.', w:'voisinage'},
  {id:'sol', g:'Immobilier · Séance 2', t:'Du ciel au sous-sol (art. 552)', d:'La coupe d’un terrain : ce que le propriétaire peut faire au-dessus et en dessous.', w:'sol'},
  {id:'couples', g:'Droit civil', t:'Concubinage, PACS ou mariage ?', d:'Compare les trois façons de vivre en couple, critère par critère.', w:'echelle'},
  {id:'famille', g:'Droit civil', t:'Qui peut-on épouser ou pacser ?', d:'Touche un membre de la famille de Léa : interdit, dispense possible ou autorisé.', w:'famille'},
  {id:'nullite', g:'Droit civil', t:'Simulateur de nullité du mariage', d:'Choisis une cause : type de nullité, qui peut agir, délai, effets.', w:'nullite'},
  {id:'pacs', g:'Droit civil', t:'PACS : séparation ou indivision ?', d:'Change de régime et regarde les biens changer de propriétaire.', w:'pacsregime'},
  {id:'delegation', g:'Déontologie', t:'La journée de l’étude au service de l’État', d:'Les tâches que l’État délègue au notaire : taxes, Télé@ctes, Perval, déclaration de succession.', w:'delegation'},
  {id:'duel', g:'Déontologie', t:'Le duel des actes', d:'Acte sous signature privée contre acte authentique, en quatre manches.', w:'authentique'},
  {id:'publication', g:'Déontologie', t:'La course à la publication (art. 1198)', d:'Deux acheteurs, une maison : le premier qui publie l’emporte, s’il est de bonne foi.', w:'opposabilite'},
  {id:'etude', g:'Déontologie', t:'Le parcours d’un dossier dans l’étude', d:'Négociateur, collaborateur, notaire, formaliste, comptable-taxateur : qui fait quoi.', w:'etude'},
  {id:'professions', g:'Déontologie', t:'Notaire, avocat, juge, commissaire de justice', d:'Le comparateur des professions du droit.', w:'pros'},
  {id:'methode', g:'Méthode', t:'Méthode du cas pratique', d:'Les 5 étapes du raisonnement juridique, avec un exemple.', w:'methode'}
];
function viewOutils(id){
  let g0 = '';
  const html = `<div class="eyebrow">Boîte à outils</div><h1 style="font-size:var(--fs-3xl);margin:6px 0 10px">Outils</h1><p class="lead">Les gestes du collaborateur de notaire, en version interactive.</p>
  <nav class="toc" style="margin-top:18px">${TOOLS.map(t => `<button data-tool="${t.id}">${t.t}</button>`).join('')}</nav>
  ${TOOLS.map(t => { const head = t.g !== g0 ? `<div class="eyebrow" style="margin-top:44px">${t.g}</div>` : ''; g0 = t.g; return `${head}<section class="sec" id="tool-${t.id}" style="margin-top:22px"><div class="sec-head" style="grid-template-columns:1fr"><h2>${t.t}</h2><p class="muted">${t.d}</p></div><div data-w="${t.w}"></div></section>`; }).join('')}`;
  return {html, mount(v){
    $('.toc', v).addEventListener('click', e => { const b = e.target.closest('[data-tool]'); if (b) $('#tool-' + b.dataset.tool, v).scrollIntoView({behavior: reduced() ? 'auto' : 'smooth'}); });
    if (id){ const el = $('#tool-' + id, v); if (el) setTimeout(() => el.scrollIntoView({block:'start'}), 60); }
  }};
}

/* =================== LEXIQUE =================== */
function viewLexique(){
  return {html:`<div class="eyebrow">Vocabulaire</div><h1 style="font-size:var(--fs-3xl);margin:6px 0 10px">Lexique</h1><p class="lead">Les mots-clés de tes cours, définis simplement. Tape un mot pour filtrer.</p>
  <div class="search" style="margin-top:20px">${icon('search')}<label class="sr-only" for="glq">Rechercher un mot</label><input id="glq" type="search" placeholder="servitude, CSI, usufruit…" autocomplete="off"></div>
  <div class="filters" id="glf"><button aria-pressed="true" data-f="">Tout</button>${sortedSubjects().map(s => `<button aria-pressed="false" data-f="${s.id}">${esc(s.short)}</button>`).join('')}</div>
  <p class="muted" id="glc" style="font-size:.85rem"></p>
  <div class="gl" id="glList"></div>`,
  mount(v){
    let f = '', q = '';
    const list = JLG.gloss.slice().sort((a, b) => a.t.localeCompare(b.t, 'fr', {sensitivity:'base'}));
    const hi = s => { if (!q) return s; const i = norm(s).indexOf(norm(q)); if (i < 0) return s; return s.slice(0, i) + '<mark>' + s.slice(i, i + q.length) + '</mark>' + s.slice(i + q.length); };
    const draw = () => {
      const nq = norm(q);
      const items = list.filter(g => (!f || [].concat(g.s).includes(f)) && (!nq || norm(g.t).includes(nq) || norm(g.d).includes(nq)));
      $('#glc', v).textContent = items.length + (items.length > 1 ? ' définitions' : ' définition');
      let L = '', out = '';
      items.forEach(g => { const l = norm(g.t).charAt(0).toUpperCase(); if (l !== L && !nq){ L = l; out += `<div class="gl-letter">${l}</div>`; }
        const tags = [].concat(g.s).map(subj).filter(Boolean).map(s => `<span class="tag plain">${esc(s.short)}</span>`).join('');
        out += `<div class="gl-item"><div class="gt"><b>${hi(esc(g.t))}</b>${tags}${g.ref ? `<span class="mono faint">${esc(g.ref)}</span>` : ''}</div><div class="gd">${g.d}</div></div>`; });
      $('#glList', v).innerHTML = out || '<div class="empty">Aucun mot ne correspond. Essaie un autre terme.</div>';
    };
    $('#glq', v).addEventListener('input', e => { q = e.target.value.trim(); draw(); });
    $('#glf', v).addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; f = b.dataset.f; $$('#glf button', v).forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
    draw();
  }};
}

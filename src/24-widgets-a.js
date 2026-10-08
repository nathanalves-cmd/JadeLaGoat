
/* =================== SCHÉMAS — DROIT FONDAMENTAL =================== */

/* Pyramide des normes */
JLG.widget('pyramid', el => {
  const L = [
    {t:'Constitution', s:'du 4 octobre 1958', d:'Le texte suprême : il organise les pouvoirs et protège les droits fondamentaux. Toutes les autres normes doivent la respecter. Son gardien : le <b>Conseil constitutionnel</b>.'},
    {t:'Traités & droit de l’UE', s:'art. 55 de la Constitution', d:'Un traité régulièrement ratifié a, dès sa publication, une autorité <b>supérieure à celle des lois</b>, à condition que l’autre État l’applique aussi. Le droit de l’Union européenne l’emporte sur les règles nationales contraires.'},
    {t:'Lois', s:'votées par le Parlement', d:'Votées par l’Assemblée nationale et le Sénat, dans les matières de l’<b>article 34</b>. Contrôle de constitutionnalité par le Conseil constitutionnel <b>avant la promulgation</b>.'},
    {t:'Règlements', s:'décrets, puis arrêtés', d:'Textes du pouvoir exécutif : <b>décrets</b> (Président, Premier ministre) puis <b>arrêtés</b> (ministres, préfets, maires). Ils doivent respecter la loi. Contrôle a posteriori par le <b>juge administratif</b>.'}
  ];
  el.innerHTML = `<div class="w w-pyr">
    <div class="w-head"><span class="eyebrow">Schéma interactif</span><b>La hiérarchie des normes</b><span class="muted">Touche un étage. Chaque norme doit respecter celles du dessus.</span></div>
    <div class="pyr">${L.map((l, i) => `<button class="pyr-l pl${i}" data-i="${i}" style="--i:${i}"><span class="pt">${l.t}</span><span class="ps">${l.s}</span></button>`).join('')}</div>
    <div class="pyr-aside">${icon('book')}<span><b>À côté de la pyramide :</b> la <b>coutume</b> (jamais contre la loi) et la <b>jurisprudence</b> (elle interprète et complète les textes, art. 4 C. civ.).</span></div>
    <div class="w-detail" aria-live="polite"></div></div>`;
  const det = $('.w-detail', el);
  const sel = i => { $$('.pyr-l', el).forEach(b => b.classList.toggle('on', +b.dataset.i === i)); det.innerHTML = `<div class="w-card"><div class="eyebrow">Étage ${i + 1} sur 4</div><b class="w-t">${L[i].t}</b><p>${L[i].d}</p></div>`; };
  $('.pyr', el).addEventListener('click', e => { const b = e.target.closest('.pyr-l'); if (b) sel(+b.dataset.i); });
  sel(2);
});

/* Fabrication de la loi */
JLG.widget('loi', el => {
  const P = [
    {t:'Initiative', d:'<b>Projet de loi</b> s’il vient du Gouvernement, <b>proposition de loi</b> s’il vient des députés ou des sénateurs.'},
    {t:'Vote par les deux chambres', d:'L’Assemblée nationale et le Sénat doivent adopter le même texte, mot pour mot.'},
    {t:'Navette parlementaire', d:'En cas de désaccord, le texte fait des allers-retours : deux lectures possibles dans chaque chambre.', opt:1, nav:1},
    {t:'Commission mixte paritaire', d:'Si le désaccord persiste : 7 députés et 7 sénateurs cherchent un texte commun.', opt:1},
    {t:'Dernier mot à l’Assemblée', d:'En dernier recours, le Gouvernement peut donner le dernier mot à l’Assemblée nationale.', opt:1},
    {t:'Contrôle du Conseil constitutionnel', d:'Avant la promulgation, s’il est saisi par le Président, le Premier ministre, les présidents des deux assemblées, des députés ou des sénateurs.', opt:1},
    {t:'Promulgation', d:'Le Président de la République signe un <b>décret</b> : c’est l’ordre d’exécuter la loi (dans les 15 jours).'},
    {t:'Publication au Journal officiel', d:'La loi est portée à la connaissance de tous.'},
    {t:'Entrée en vigueur', d:'Le <b>lendemain</b> de la publication au JO, sauf si la loi fixe une autre date (art. 1 C. civ.).'}
  ];
  el.innerHTML = `<div class="w w-loi">
    <div class="w-head"><span class="eyebrow">Schéma animé</span><b>Comment naît une loi</b><span class="muted">Lance l’animation ou touche une étape.</span></div>
    <div class="btn-row"><button class="btn btn-sm btn-primary" data-play>${icon('play')}Lancer l’animation</button></div>
    <ol class="proc">${P.map((p, i) => `<li class="proc-s${p.opt ? ' is-opt' : ''}" data-i="${i}"><button class="proc-dot" aria-label="Étape ${i + 1}">${i + 1}</button><div class="proc-c"><b>${p.t}</b>${p.opt ? ' <span class="tag plain">si besoin</span>' : ''}<p>${p.d}</p>${p.nav ? '<div class="pingpong"><span data-pp="0">Assemblée</span><i></i><span data-pp="1">Sénat</span></div>' : ''}</div></li>`).join('')}</ol></div>`;
  let timer = null;
  const set = i => { $('.w-loi', el).classList.toggle('running', i >= 0); $$('.proc-s', el).forEach(s => { const k = +s.dataset.i; s.classList.toggle('on', k === i); s.classList.toggle('done', k < i); }); };
  const pp = () => { const sp = $$('[data-pp]', el); let n = 0; const t = setInterval(() => { sp.forEach((s, k) => s.classList.toggle('lit', k === n % 2)); n++; if (n > 5){ clearInterval(t); sp.forEach(s => s.classList.remove('lit')); } }, 260); };
  $('.proc', el).addEventListener('click', e => { const s = e.target.closest('.proc-s'); if (!s) return; clearInterval(timer); set(+s.dataset.i); if (P[+s.dataset.i].nav) pp(); });
  $('[data-play]', el).onclick = () => {
    clearInterval(timer); let i = 0; set(0);
    timer = setInterval(() => { i++; if (i >= P.length || !el.isConnected){ clearInterval(timer); return; } set(i); if (P[i].nav) pp(); const s = $(`.proc-s[data-i="${i}"]`, el); const r = s.getBoundingClientRect(); if (r.bottom > innerHeight - 90 || r.top < 120) s.scrollIntoView({block:'center', behavior: reduced() ? 'auto' : 'smooth'}); }, reduced() ? 400 : 1300);
  };
  set(-1);
});

/* Application de la loi dans le temps */
JLG.widget('temps', el => {
  const T = {op:false, pen:false, ret:false};
  const rows = [
    {id:'passe', l:'Situation entièrement passée', s:'ex. : contrat déjà exécuté', segs:[[4, 40, 'past']]},
    {id:'cours', l:'Situation légale en cours', s:'ex. : un mariage ; ses effets avant / après', segs:[[14, 50, 'pastfx'], [50, 92, 'futfx']]},
    {id:'contrat', l:'Contrat en cours', s:'conclu avant, exécuté après', segs:[[22, 50, 'cpast'], [50, 90, 'cfut']]},
    {id:'futur', l:'Situation née après la loi', s:'ex. : contrat signé après', segs:[[58, 96, 'fut']]},
    {id:'penal', l:'Infraction commise avant, jugée après', s:'droit pénal', segs:[[30, 72, 'pen']]}
  ];
  const lawOf = k => {
    if (k === 'fut' || k === 'futfx') return 'new';
    if (k === 'pen') return T.pen ? 'new' : 'old';
    if (k === 'cfut') return (T.op || T.ret) ? 'new' : 'old';
    return T.ret ? 'new' : 'old';
  };
  el.innerHTML = `<div class="w w-time">
    <div class="w-head"><span class="eyebrow">Simulateur</span><b>Quelle loi s’applique ?</b><span class="muted">Active les cas particuliers et regarde les couleurs changer.</span></div>
    <div class="tl-toggles">
      <button aria-pressed="false" data-t="op">Loi d’ordre public</button>
      <button aria-pressed="false" data-t="pen">Loi pénale plus douce</button>
      <button aria-pressed="false" data-t="ret">Loi expressément rétroactive</button>
    </div>
    <div class="tl">
      <div class="tl-axis"><span>Passé</span><span class="tl-now">Loi nouvelle</span><span>Avenir</span></div>
      ${rows.map(r => `<div class="tl-row"><div class="tl-label"><b>${r.l}</b><span>${r.s}</span></div><div class="tl-track">${r.segs.map(s => `<i class="seg" data-k="${s[2]}" style="left:${s[0]}%;width:${s[1] - s[0]}%"></i>`).join('')}${r.id === 'penal' ? '<em class="tl-mark" style="left:30%">faits</em><em class="tl-mark" style="left:72%">jugement</em>' : ''}</div></div>`).join('')}
    </div>
    <div class="tl-legend"><span><i class="seg old"></i>Loi ancienne</span><span><i class="seg new"></i>Loi nouvelle</span></div>
    <div class="w-card tl-expl" aria-live="polite"></div></div>`;
  const draw = () => {
    $$('.seg[data-k]', el).forEach(s => { s.classList.toggle('new', lawOf(s.dataset.k) === 'new'); s.classList.toggle('old', lawOf(s.dataset.k) === 'old'); });
    const lines = ['<b>Principe (art. 2 C. civ.) :</b> la loi nouvelle ne revient pas sur le passé, mais s’applique tout de suite à l’avenir, y compris aux <b>effets futurs</b> des situations en cours.'];
    lines.push(T.op || T.ret ? '<b>Contrat en cours :</b> la loi nouvelle s’impose à ses effets futurs' + (T.op ? ' car elle est d’ordre public.' : '.') : '<b>Contrat en cours :</b> il reste soumis à la loi ancienne (« survie de la loi ancienne »), pour respecter les prévisions des parties.');
    lines.push(T.pen ? '<b>Pénal :</b> une loi plus douce s’applique aux faits commis avant elle, tant qu’ils n’ont pas été jugés définitivement.' : '<b>Pénal :</b> une loi plus sévère ne s’applique jamais aux faits passés.');
    if (T.ret) lines.push('<b>Rétroactivité expresse :</b> le législateur peut décider qu’une loi s’applique aussi au passé (jamais pour une loi pénale plus sévère).');
    $('.tl-expl', el).innerHTML = lines.map(l => `<p>${l}</p>`).join('');
  };
  $('.tl-toggles', el).addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (!b) return; T[b.dataset.t] = !T[b.dataset.t]; b.setAttribute('aria-pressed', T[b.dataset.t]); draw(); });
  draw();
});

/* Balance du patrimoine */
JLG.widget('patrimoine', el => {
  const A = [['Maison', 220000, true], ['Voiture', 12000, true], ['Compte bancaire', 6500, true], ['Actions', 4000, false]];
  const P = [['Crédit immobilier', 150000, true], ['Crédit conso', 7000, true], ['Impôts à payer', 1800, false], ['Factures courantes', 600, false]];
  el.innerHTML = `<div class="w w-bal">
    <div class="w-head"><span class="eyebrow">Schéma interactif</span><b>Le patrimoine : un actif et un passif</b><span class="muted">Ajoute ou retire des éléments : la balance réagit.</span></div>
    <svg class="bal-svg" viewBox="0 0 320 180" role="img" aria-label="Balance entre l’actif et le passif">
      <path d="M160 46 V164 M118 168 H202" stroke="var(--line-2)" stroke-width="6" stroke-linecap="round" fill="none"/>
      <circle cx="160" cy="46" r="7" fill="var(--accent)"/>
      <g id="beam"><rect x="50" y="42" width="220" height="8" rx="4" fill="var(--fg)"/></g>
      <g id="panL"><path d="M-34 0 L0 -58 L34 0" fill="none" stroke="var(--faint)" stroke-width="1.5"/><path d="M-44 0 H44 Q36 22 0 24 Q-36 22 -44 0Z" fill="var(--accent)"/><text y="16" text-anchor="middle" font-size="11" font-weight="700" fill="var(--accent-ink)" font-family="var(--font-body)">ACTIF</text></g>
      <g id="panR"><path d="M-34 0 L0 -58 L34 0" fill="none" stroke="var(--faint)" stroke-width="1.5"/><path d="M-44 0 H44 Q36 22 0 24 Q-36 22 -44 0Z" fill="var(--surface-3)" stroke="var(--line-2)"/><text y="16" text-anchor="middle" font-size="11" font-weight="700" fill="var(--fg)" font-family="var(--font-body)">PASSIF</text></g>
    </svg>
    <div class="bal-cols">
      <div><div class="eyebrow">Actif · les droits</div><div class="bal-items" data-side="A">${A.map((x, i) => `<button class="bal-it" aria-pressed="${x[2]}" data-i="${i}"><span>${x[0]}</span><b>${fmtNum(x[1])} €</b></button>`).join('')}</div></div>
      <div><div class="eyebrow">Passif · les dettes</div><div class="bal-items" data-side="P">${P.map((x, i) => `<button class="bal-it neg" aria-pressed="${x[2]}" data-i="${i}"><span>${x[0]}</span><b>${fmtNum(x[1])} €</b></button>`).join('')}</div></div>
    </div>
    <div class="bal-sum"><span>Actif <b id="ta">0</b></span><span>Passif <b id="tp">0</b></span><span>Valeur nette <b id="tn">0</b></span></div>
    <p class="w-note" id="bmsg"></p></div>`;
  let ang = 0, target = 0, raf;
  const place = a => {
    const r = a * Math.PI / 180, cx = 160, cy = 46, L = 104;
    $('#beam', el).setAttribute('transform', `rotate(${a.toFixed(2)} 160 46)`);
    $('#panL', el).setAttribute('transform', `translate(${(cx - L * Math.cos(r)).toFixed(1)} ${(cy - L * Math.sin(r) + 58).toFixed(1)})`);
    $('#panR', el).setAttribute('transform', `translate(${(cx + L * Math.cos(r)).toFixed(1)} ${(cy + L * Math.sin(r) + 58).toFixed(1)})`);
  };
  let v = 0;
  const anim = () => { cancelAnimationFrame(raf); if (reduced()){ ang = target; place(ang); return; } (function f(){ const k = .09, d = .82; v = (v + (target - ang) * k) * d; ang += v; place(ang); if (Math.abs(target - ang) > .02 || Math.abs(v) > .02) raf = requestAnimationFrame(f); else { ang = target; place(ang); } })(); };
  const draw = () => {
    const sum = (side, arr) => $$(`[data-side="${side}"] .bal-it`, el).reduce((s, b) => s + (b.getAttribute('aria-pressed') === 'true' ? arr[+b.dataset.i][1] : 0), 0);
    const a = sum('A', A), p = sum('P', P), n = a - p;
    $('#ta', el).textContent = fmtNum(a) + ' €'; $('#tp', el).textContent = fmtNum(p) + ' €'; $('#tn', el).textContent = fmtNum(n) + ' €';
    target = clamp((p - a) / Math.max(a, p, 1) * 16, -16, 16); anim();
    $('#bmsg', el).innerHTML = a === 0 && p === 0 ? 'Même sans rien, tu as un patrimoine : il est simplement vide. <b>Toute personne a un patrimoine.</b>' : n < 0 ? '<b>Passif supérieur à l’actif :</b> le patrimoine est déficitaire, mais il existe toujours. Les créanciers peuvent saisir n’importe quel bien de l’actif.' : '<b>L’actif répond du passif :</b> si une dette n’est pas payée, le créancier peut saisir n’importe quel bien de l’actif (droit de gage général, art. 2284 C. civ.).';
  };
  el.addEventListener('click', e => { const b = e.target.closest('.bal-it'); if (!b) return; b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); draw(); });
  place(0); draw();
});

/* Démembrement de la propriété */
JLG.widget('demembrement', el => {
  const TK = {usus:['Usus', 'Utiliser le bien', 'key'], fructus:['Fructus', 'Percevoir les fruits (loyers, récoltes)', 'fruit'], abusus:['Abusus', 'Disposer : vendre, donner, détruire', 'pen']};
  const M = {
    pleine:{l:'Pleine propriété', a:'Propriétaire', b:'Personne d’autre', A:['usus', 'fructus', 'abusus'], B:[], x:'Le propriétaire réunit les 3 prérogatives de l’article 544 : c’est le droit le plus complet.'},
    usufruit:{l:'Usufruit', a:'Usufruitier', b:'Nu-propriétaire', A:['usus', 'fructus'], B:['abusus'], x:'<b>USUFRUIT = USUS + FRUCTUS.</b> Le nu-propriétaire garde l’abusus. Au décès de l’usufruitier, il récupère tout : il devient plein propriétaire.'},
    usage:{l:'Droit d’usage', a:'Usager', b:'Propriétaire', A:['usus', 'fructus'], B:['abusus'], lim:'fructus', x:'L’usager peut utiliser le bien et en percevoir les fruits, mais <b>seulement pour ses besoins</b> (et ceux de sa famille), jamais pour en tirer des revenus.'},
    habitation:{l:'Droit d’habitation', a:'Titulaire', b:'Propriétaire', A:['usus'], B:['abusus'], off:'fructus', x:'Un droit d’usage <b>limité au logement</b> du titulaire et de sa famille. Il ne peut être ni cédé, ni loué.'}
  };
  const glyph = {key:'<path d="M14 9a4 4 0 1 1-3.9 4.9H4v3H2v-5h8.1A4 4 0 0 1 14 9z"/>', fruit:'<path d="M12 7c-4-2-8 1-7 6 .8 4.2 4 7 7 6 3 1 6.2-1.8 7-6 1-5-3-8-7-6z"/><path d="M12 7c0-2 1-3.5 3-4"/>', pen:'<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>'};
  el.innerHTML = `<div class="w w-dem">
    <div class="w-head"><span class="eyebrow">Schéma interactif</span><b>Qui a quoi ? Le démembrement</b><span class="muted">Choisis un droit : les trois prérogatives se répartissent.</span></div>
    <div class="seg-ctrl" role="tablist">${Object.keys(M).map(k => `<button role="tab" data-m="${k}">${M[k].l}</button>`).join('')}</div>
    <div class="dem-board"><div class="dem-z" data-z="A"><div class="dem-h"></div><div class="dem-slot"></div></div><div class="dem-z" data-z="B"><div class="dem-h"></div><div class="dem-slot"></div></div></div>
    <div class="dem-off"></div>
    <div class="w-card dem-x" aria-live="polite"></div></div>`;
  const tok = {};
  Object.keys(TK).forEach(k => { const t = document.createElement('div'); t.className = 'dem-tok'; t.dataset.k = k; t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyph[TK[k][2]]}</svg><span><b>${TK[k][0]}</b><small>${TK[k][1]}</small></span><em class="lim">limité</em>`; tok[k] = t; });
  const flip = (fn) => {
    const first = {}; Object.keys(tok).forEach(k => { if (tok[k].isConnected) first[k] = tok[k].getBoundingClientRect(); });
    fn();
    if (reduced()) return;
    Object.keys(tok).forEach(k => { const f = first[k]; if (!f || !tok[k].isConnected) return; const l = tok[k].getBoundingClientRect(); const dx = f.left - l.left, dy = f.top - l.top; if (!dx && !dy) return; tok[k].animate([{transform:`translate(${dx}px,${dy}px)`}, {transform:'none'}], {duration:620, easing:'cubic-bezier(.34,1.56,.64,1)'}); });
  };
  const show = m => {
    const d = M[m];
    $$('.seg-ctrl button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.m === m));
    flip(() => {
      $('[data-z="A"] .dem-h', el).textContent = d.a; $('[data-z="B"] .dem-h', el).textContent = d.b;
      const sA = $('[data-z="A"] .dem-slot', el), sB = $('[data-z="B"] .dem-slot', el), off = $('.dem-off', el);
      d.A.forEach(k => sA.appendChild(tok[k])); d.B.forEach(k => sB.appendChild(tok[k]));
      Object.keys(tok).forEach(k => tok[k].classList.toggle('limited', d.lim === k));
      if (d.off){ off.innerHTML = '<span class="muted">Personne ne peut louer le bien :</span>'; off.appendChild(tok[d.off]); tok[d.off].classList.add('ghost'); } else { off.innerHTML = ''; Object.keys(tok).forEach(k => tok[k].classList.remove('ghost')); }
      $('[data-z="B"]', el).classList.toggle('empty-z', !d.B.length);
    });
    $('.dem-x', el).innerHTML = `<p>${d.x}</p>`;
  };
  $('.seg-ctrl', el).addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (b) show(b.dataset.m); });
  show('pleine');
  setTimeout(() => { if (el.isConnected && $('.seg-ctrl [aria-selected="true"]', el).dataset.m === 'pleine') show('usufruit'); }, 1600);
});

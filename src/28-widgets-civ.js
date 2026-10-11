
/* =================== SCHÉMAS — DROIT CIVIL =================== */

/* Processus générique animé (étapes) */
JLG.widget('proc', (el, o) => {
  const P = o.steps || [];
  el.innerHTML = `<div class="w w-loi w-proc">
    <div class="w-head"><span class="eyebrow">${o.eyebrow || 'Schéma animé'}</span><b>${o.title || ''}</b>${o.sub ? `<span class="muted">${o.sub}</span>` : ''}</div>
    <div class="btn-row"><button class="btn btn-sm btn-primary" data-play>${icon('play')}Lancer l’animation</button></div>
    <ol class="proc">${P.map((p, i) => `<li class="proc-s${p.opt ? ' is-opt' : ''}" data-i="${i}"><button class="proc-dot" aria-label="Étape ${i + 1}">${i + 1}</button><div class="proc-c"><b>${p.t}</b>${p.opt ? ' <span class="tag plain">si besoin</span>' : ''}${p.tag ? ` <span class="tag">${p.tag}</span>` : ''}<p>${p.d}</p>${p.extra === 'bans' ? `<div class="bans" aria-hidden="true">${Array.from({length:10}, (_, k) => `<span style="--k:${k}">J${k + 1}</span>`).join('')}<em>Célébration possible</em></div>` : ''}</div></li>`).join('')}</ol></div>`;
  const root = $('.w-proc', el); let timer = null;
  const set = i => {
    root.classList.toggle('running', i >= 0);
    $$('.proc-s', el).forEach(s => { const k = +s.dataset.i; s.classList.toggle('on', k === i); s.classList.toggle('done', k < i); });
    $$('.bans', el).forEach(x => x.classList.remove('go'));
    const b = $('.proc-s.on .bans', el); if (b){ void b.offsetWidth; b.classList.add('go'); }
  };
  const run = i => {
    if (i >= P.length || !el.isConnected) return;
    set(i);
    const s = $(`.proc-s[data-i="${i}"]`, el); const r = s.getBoundingClientRect();
    if (i && (r.bottom > innerHeight - 90 || r.top < 120)) s.scrollIntoView({block:'center', behavior: reduced() ? 'auto' : 'smooth'});
    timer = setTimeout(() => run(i + 1), reduced() ? 400 : (P[i].extra === 'bans' ? 2600 : 1400));
  };
  $('.proc', el).addEventListener('click', e => { const s = e.target.closest('.proc-s'); if (!s) return; clearTimeout(timer); set(+s.dataset.i); });
  $('[data-play]', el).onclick = () => { clearTimeout(timer); run(0); };
  set(-1);
});

/* Arbre des empêchements (mariage / PACS) */
JLG.widget('famille', (el, o) => {
  let mode = o.mode === 'pacs' ? 'pacs' : 'mariage', dead = false, sel = 'L';
  const N = {
    GO:{x:50, y:40, l:'Grand-oncle', r:'Collatéral · 4e degré'},
    G:{x:160, y:40, l:'Grand-père', r:'Ligne directe · 2e degré'},
    O:{x:110, y:118, l:'Oncle', r:'Collatéral · 3e degré'},
    P:{x:210, y:118, l:'Père', r:'Ligne directe · 1er degré'},
    C:{x:60, y:200, l:'Cousin', r:'Collatéral · 4e degré (cousin germain)'},
    F:{x:160, y:200, l:'Frère', r:'Collatéral · 2e degré'},
    L:{x:230, y:200, l:'Léa', r:'C’est elle'},
    M:{x:305, y:200, l:'Ex-mari', l2:'Mari', r:'Son ancien conjoint', r2:'Son mari, décédé'},
    BP:{x:338, y:118, l:'Ex-beau-père', l2:'Beau-père', r:'Allié en ligne directe'},
    BR:{x:375, y:200, l:'Beau-frère', r:'Allié en ligne collatérale'},
    N:{x:160, y:290, l:'Neveu', r:'Collatéral · 3e degré'},
    E:{x:230, y:290, l:'Fils', r:'Ligne directe · 1er degré'},
    B:{x:318, y:290, l:'Beau-fils', r:'Allié en ligne directe (le fils de son mari, né d’une autre union)'}
  };
  const st = k => {
    if (k === 'L') return 'ego';
    if (k === 'M') return dead ? 'na' : 'ok';
    if (mode === 'pacs') return ['G', 'P', 'E', 'F', 'O', 'N', 'BP', 'B'].includes(k) ? 'no' : 'ok';
    if (['G', 'P', 'E', 'F'].includes(k)) return 'no';
    if (['O', 'N', 'GO'].includes(k)) return 'disp';
    if (['BP', 'B'].includes(k)) return dead ? 'disp' : 'no';
    return 'ok';
  };
  const LAB = {no:'Interdit', disp:'Dispense possible', ok:'Autorisé', na:'—', ego:'Léa'};
  const why = k => {
    const m = mode === 'mariage';
    switch (k){
      case 'G': case 'P': case 'E': return m ? 'Mariage interdit entre ascendants et descendants en ligne directe, sans aucune dispense possible (art. 161).' : 'PACS interdit entre ascendant et descendant en ligne directe (art. 515-2).';
      case 'F': return m ? 'Mariage interdit entre frère et sœur, sans dispense possible (art. 162).' : 'PACS interdit : collatéraux jusqu’au 3e degré inclus (art. 515-2). Le frère est au 2e degré.';
      case 'O': case 'N': return m ? 'Mariage interdit entre oncle et nièce, tante et neveu (art. 163). Le Président de la République peut accorder une dispense pour causes graves (art. 164).' : 'PACS interdit : le 3e degré est la limite, incluse (art. 515-2). Aucune dispense n’existe pour le PACS.';
      case 'GO': return m ? 'La jurisprudence étend l’interdiction au grand-oncle et à la petite-nièce. Une dispense du Président de la République reste possible.' : 'PACS autorisé : le grand-oncle est au 4e degré, au-delà de la limite du 3e degré.';
      case 'C': return m ? 'Mariage autorisé : les cousins germains sont au 4e degré, il n’y a aucun empêchement.' : 'PACS autorisé : cousins germains, 4e degré.';
      case 'BP': case 'B': return m ? (dead ? 'Alliés en ligne directe : mariage interdit (art. 161). Mais la personne qui a créé l’alliance, le mari de Léa, est décédée : le Président de la République peut accorder une dispense (art. 164).' : 'Alliés en ligne directe : mariage interdit (art. 161). Après un divorce, aucune dispense n’est possible : il faudrait que la personne qui a créé l’alliance soit décédée.') : 'PACS interdit entre alliés en ligne directe (art. 515-2), et sans dispense possible.';
      case 'BR': return m ? 'Mariage autorisé avec l’ancien beau-frère, une fois le premier mariage dissous (sinon c’est de la bigamie). Les alliés en ligne collatérale ne sont pas visés.' : 'PACS autorisé : les alliés en ligne collatérale ne sont pas visés par l’art. 515-2.';
      case 'M': return dead ? 'Le mari de Léa est décédé : le mariage est dissous par le décès. Léa est veuve et peut se remarier.' : (m ? 'Divorcés, Léa et son ex-mari peuvent se remarier ensemble.' : 'Divorcés, Léa et son ex-mari peuvent se pacser ensemble.');
      default: return 'Voici Léa. Touche un membre de sa famille pour savoir si elle peut l’épouser ou se pacser avec lui.';
    }
  };
  const glyph = '<circle class="fn-g" cx="0" cy="-4.5" r="4.2"/><path class="fn-g" d="M-8 9.5a8 7 0 0 1 16 0z"/>';
  el.innerHTML = `<div class="w w-fam">
    <div class="w-head"><span class="eyebrow">Arbre interactif</span><b>Qui Léa peut-elle épouser ?</b><span class="muted">Touche un membre de la famille. Bascule entre mariage et PACS : les règles changent.</span></div>
    <div class="fam-ctrl">
      <div class="seg-ctrl" role="tablist" aria-label="Type d’union"><button role="tab" data-m="mariage">Mariage</button><button role="tab" data-m="pacs">PACS</button></div>
      <div class="fam-dead"><span class="muted">Le mari de Léa :</span><div class="seg-mini" role="group" aria-label="Situation du mari de Léa"><button data-d="0" aria-pressed="true">Divorcés</button><button data-d="1" aria-pressed="false">Décédé</button></div></div>
    </div>
    <div class="fam-wrap"><svg class="fam" viewBox="0 0 410 330" role="group" aria-label="Arbre généalogique de Léa">
      <rect x="0" y="0" width="410" height="330" rx="16" fill="var(--bg-2)"/>
      <text x="402" y="18" text-anchor="end" class="fam-cap">Famille par alliance</text>
      <text x="8" y="322" class="fam-cap">Famille par le sang</text>
      <path class="fl" d="M50 24 V12 H160 V24"/>
      <path class="fl" d="M160 56 V80 M110 80 H210 M110 80 V102 M210 80 V102"/>
      <path class="fl" d="M110 134 V160 H60 V184"/>
      <path class="fl" d="M210 134 V160 M160 160 H230 M160 160 V184 M230 160 V184"/>
      <path class="fl" d="M338 134 V160 M305 160 H375 M305 160 V184 M375 160 V184"/>
      <path class="fl" d="M160 216 V274"/>
      <path class="fl" d="M267 200 V250 H230 V274"/>
      <path class="fl" d="M305 216 V258 H318 V274"/>
      <path class="fm" d="M246 200 H289"/>
      <text x="267" y="192" text-anchor="middle" class="fam-cap fm-l">divorcés</text>
      ${Object.keys(N).map(k => { const n = N[k]; return `<g class="fn" data-k="${k}" transform="translate(${n.x} ${n.y})" tabindex="0" role="button" aria-label="${esc(n.l)}"><circle class="fn-halo" r="22"/><circle class="fn-c" r="16"/>${glyph}<text class="fn-x" x="11" y="-9">†</text><text class="fn-l" y="31" text-anchor="middle">${esc(n.l)}</text></g>`; }).join('')}
    </svg></div>
    <div class="fam-legend"><span><i class="lg s-no"></i>Interdit</span><span><i class="lg s-disp"></i>Dispense possible</span><span><i class="lg s-ok"></i>Autorisé</span></div>
    <div class="fam-out" aria-live="polite"></div></div>`;
  const out = $('.fam-out', el);
  const draw = () => {
    $$('.seg-ctrl button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.m === mode));
    $$('.seg-mini button', el).forEach(b => b.setAttribute('aria-pressed', (b.dataset.d === '1') === dead));
    const lab = k => (dead && N[k].l2) || N[k].l;
    $$('.fn', el).forEach(g => { const k = g.dataset.k; g.setAttribute('class', `fn s-${st(k)}${k === sel ? ' sel' : ''}${k === 'M' && dead ? ' dead' : ''}`); g.setAttribute('aria-label', `${lab(k)} : ${LAB[st(k)]}`); $('.fn-l', g).textContent = lab(k); });
    $('.fm', el).classList.toggle('dissolved', !dead);
    $('.fm-l', el).textContent = dead ? 'veuvage' : 'divorcés';
    const n = N[sel], s = st(sel);
    out.innerHTML = `<div class="w-card fam-card s-${s}">${sel === 'L' || s === 'na' ? '' : `<span class="tag fam-tag">${LAB[s]}</span>`}<b class="w-t">${lab(sel)}</b><p class="muted" style="margin-top:-2px">${(dead && n.r2) || n.r}</p><p>${why(sel)}</p></div>`;
  };
  const pick = k => { sel = k; draw(); };
  const svg = $('.fam', el);
  svg.addEventListener('click', e => { const g = e.target.closest('.fn'); if (g) pick(g.dataset.k); });
  svg.addEventListener('keydown', e => { const g = e.target.closest('.fn'); if (g && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); pick(g.dataset.k); } });
  $('.seg-ctrl', el).addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (!b) return; mode = b.dataset.m; svg.classList.remove('flip'); void svg.getBBox(); svg.classList.add('flip'); draw(); });
  $('.seg-mini', el).addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (!b) return; dead = b.dataset.d === '1'; draw(); });
  draw();
});

/* Échelle de l'engagement : concubinage, PACS, mariage */
JLG.widget('echelle', el => {
  const S3 = [['Concubinage', 'Une union de fait'], ['PACS', 'Un contrat'], ['Mariage', 'Une union célébrée']];
  const K = [
    {k:'Nature', v:['Une simple situation de fait : aucun statut, on applique le droit commun.', 'Un contrat conclu entre deux personnes majeures pour organiser leur vie commune.', 'Une union célébrée publiquement par l’officier de l’état civil.'], s:[1, 2, 3]},
    {k:'Formation', v:['Aucune formalité. Un certificat de concubinage est possible, mais facultatif.', 'Convention, puis déclaration conjointe en mairie ou chez le notaire, enregistrement.', 'Dossier, audition, publication des bans pendant 10 jours, célébration en mairie.'], s:[1, 2, 3]},
    {k:'Conditions', v:['Aucune condition légale.', 'Être majeurs, sans lien de parenté proche (3e degré inclus), ni déjà marié ou pacsé.', '18 ans (dispense possible), pas de bigamie ni d’inceste, un vrai consentement.'], s:[1, 2, 3]},
    {k:'Devoirs', v:['Aucun devoir entre concubins.', 'Vie commune, aide matérielle et assistance réciproques.', 'Respect, fidélité, secours, assistance et communauté de vie.'], s:[0, 2, 3]},
    {k:'Dettes', v:['Aucune solidarité, sauf contrat signé par les deux.', 'Solidaires pour les dettes de la vie courante, sauf dépenses excessives.', 'Solidaires pour les dettes ménagères, sauf dépenses excessives.'], s:[0, 2, 2]},
    {k:'Biens', v:['Chacun ses biens. Sans preuve : présomption de propriété par moitié.', 'Séparation de biens par défaut, indivision au choix.', 'Un régime matrimonial : le régime légal, ou celui du contrat de mariage.'], s:[1, 2, 3]},
    {k:'Logement', v:['Bail transféré au concubin notoire, après au moins un an de vie commune.', 'Au décès, le survivant garde le logement gratuitement pendant un an.', 'Logement de la famille protégé : aucun acte sans l’accord des deux (art. 215).'], s:[1, 2, 3]},
    {k:'Rupture', v:['Libre, sans aucune formalité.', 'Déclaration conjointe, ou décision unilatérale signifiée par commissaire de justice.', 'Il faut un divorce (ou le décès d’un époux).'], s:[0, 1, 3]},
    {k:'Succession', v:['Pas héritier. Légataire par testament seulement, et taxé à 60 %.', 'Pas héritier. Légataire par testament seulement, mais exonéré de droits.', 'Héritier légal du conjoint décédé, et exonéré de droits.'], s:[0, 2, 3]},
    {k:'Adoption', v:['Adoption à deux possible depuis la loi du 21 février 2022.', 'Adoption à deux possible depuis la loi du 21 février 2022.', 'Adoption à deux possible.'], s:[3, 3, 3]}
  ];
  el.innerHTML = `<div class="w w-ech">
    <div class="w-head"><span class="eyebrow">Comparateur</span><b>Concubinage, PACS, mariage</b><span class="muted">Choisis un critère : les trois statuts se comparent, du moins au plus protecteur.</span></div>
    <div class="ech-crit" role="tablist">${K.map((k, i) => `<button role="tab" data-c="${i}">${k.k}</button>`).join('')}</div>
    <div class="ech-cols">${S3.map((s, j) => `<div class="ech-col" data-j="${j}"><div class="ech-top"><span class="ech-step" aria-hidden="true">${'<i></i>'.repeat(j + 1)}</span><div><b>${s[0]}</b><span>${s[1]}</span></div></div><div class="ech-v" aria-live="polite"></div><div class="ech-p"><span>Protection</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div></div>`).join('')}</div>
  </div>`;
  const show = i => {
    $$('.ech-crit button', el).forEach(b => b.setAttribute('aria-selected', +b.dataset.c === i));
    const mx = Math.max(...K[i].s);
    $$('.ech-col', el).forEach((col, j) => {
      const v = $('.ech-v', col); v.classList.remove('in'); void v.offsetWidth; v.innerHTML = K[i].v[j]; v.classList.add('in');
      $$('.dots i', col).forEach((d, n) => d.classList.toggle('on', n < K[i].s[j]));
      $('.ech-p', col).setAttribute('aria-label', `Protection ${K[i].s[j]} sur 3`);
      col.classList.toggle('best', K[i].s[j] === mx && mx > 0);
    });
  };
  $('.ech-crit', el).addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) show(+b.dataset.c); });
  show(1);
});

/* Simulateur de nullité du mariage */
JLG.widget('nullite', el => {
  const ALL = 'Les époux, tout intéressé, le ministère public';
  const C = [
    {l:'Âge légal non atteint', t:'abs', who:ALL, del:'30 ans à compter de la célébration', art:'Art. 144 et 184', plus:'Régularisation : l’action s’éteint 6 mois après que l’époux a atteint l’âge légal (art. 185).'},
    {l:'Bigamie', t:'abs', who:ALL + ' (dont le premier conjoint)', del:'30 ans à compter de la célébration', art:'Art. 147 et 184', plus:'Le premier mariage doit être dissous avant d’en contracter un second.'},
    {l:'Inceste', t:'abs', who:ALL, del:'30 ans à compter de la célébration', art:'Art. 161 à 163 et 184', plus:'Sauf si une dispense a été accordée par le Président de la République, quand elle est possible.'},
    {l:'Mariage blanc', t:'abs', who:ALL, del:'30 ans à compter de la célébration', art:'Art. 146 et 184', plus:'Le but est étranger au mariage (ex. : obtenir la nationalité). Le mariage reste valable si les époux ont seulement voulu limiter ses effets (arrêt Appietto, 1963).'},
    {l:'Absence d’un époux', t:'abs', who:ALL, del:'30 ans à compter de la célébration', art:'Art. 146-1 et 184', plus:'Exception : le mariage posthume, autorisé par le Président de la République.'},
    {l:'Clandestinité', t:'abs', who:'Les époux, leurs parents, tout intéressé, le ministère public', del:'30 ans à compter de la célébration', art:'Art. 191', plus:'Le juge apprécie selon les circonstances : c’est une nullité facultative.'},
    {l:'Officier incompétent', t:'abs', who:'Les époux, leurs parents, tout intéressé, le ministère public', del:'30 ans à compter de la célébration', art:'Art. 191', plus:'Là aussi, le juge apprécie selon les circonstances.'},
    {l:'Erreur sur la personne', t:'rel', who:'Seulement l’époux victime de l’erreur', del:'5 ans à compter du mariage', art:'Art. 180 al. 2 et 181', plus:'Erreur sur l’identité, ou sur les qualités essentielles (ex. : des antécédents judiciaires cachés).'},
    {l:'Violence, contrainte', t:'rel', who:'L’époux contraint, ou le ministère public', del:'5 ans à compter du mariage', art:'Art. 180 al. 1 et 181', plus:'Y compris la crainte révérencielle envers un ascendant (loi du 4 avril 2006).'},
    {l:'Pas d’autorisation des parents', t:'rel', who:'Les parents dont l’autorisation était requise, ou l’époux mineur', del:'5 ans (depuis la connaissance du mariage pour les parents, depuis sa majorité pour l’époux)', art:'Art. 182 et 183', plus:'L’action s’éteint aussi si les parents ont approuvé le mariage.'}
  ];
  const EFF = {
    2:{t:'Mariage putatif pour les deux (art. 201)', kept:'all', rows:[['Les époux', 'L’annulation joue comme un divorce : le mariage ne produit plus d’effets pour l’avenir, le passé est maintenu.'], ['Les biens', 'Le régime matrimonial est liquidé ; chacun garde les donations reçues en vue du mariage.'], ['Les enfants', 'Aucun changement : leur filiation est maintenue (art. 202).']]},
    1:{t:'Mariage putatif pour un seul époux (art. 201)', kept:'half', rows:[['L’époux de bonne foi', 'Lui seul peut se prévaloir du mariage pour le passé.'], ['L’époux de mauvaise foi', 'Il subit la rétroactivité : pour lui, le mariage n’a jamais existé.'], ['Les enfants', 'Aucun changement : leur filiation est maintenue (art. 202).']]},
    0:{t:'Pas de mariage putatif : rétroactivité totale', kept:'none', rows:[['Les époux', 'Perte du nom d’usage de l’autre, fin des liens d’alliance, perte de la nationalité acquise par le mariage.'], ['Les biens', 'Le régime matrimonial disparaît : on liquide comme entre concubins (société de fait).'], ['Les enfants', 'Aucun changement, même si les deux époux étaient de mauvaise foi (art. 202).']]}
  };
  let ci = 3, bf = 2;
  el.innerHTML = `<div class="w w-nul">
    <div class="w-head"><span class="eyebrow">Simulateur</span><b>La nullité du mariage</b><span class="muted">Choisis une cause de nullité, puis la bonne foi des époux.</span></div>
    <div class="chips-group"><div class="chips-label">La cause</div><div class="chips nul-chips">${C.map((c, i) => `<button class="chip" data-i="${i}" aria-expanded="false">${c.l}</button>`).join('')}</div></div>
    <div class="nul-out" aria-live="polite"></div>
    <div class="chips-group"><div class="chips-label">Le mariage est annulé. Les époux étaient :</div><div class="seg-ctrl nul-bf" role="tablist"><button role="tab" data-b="2">Tous deux de bonne foi</button><button role="tab" data-b="1">Un seul de bonne foi</button><button role="tab" data-b="0">De mauvaise foi</button></div></div>
    <div class="nul-eff" aria-live="polite"></div></div>`;
  const drawC = () => {
    const c = C[ci];
    $$('.nul-chips .chip', el).forEach(b => b.setAttribute('aria-expanded', +b.dataset.i === ci));
    $('.nul-out', el).innerHTML = `<div class="nul-card t-${c.t}"><div class="nul-top"><span class="nul-badge">${c.t === 'abs' ? 'Nullité absolue' : 'Nullité relative'}</span><span class="muted">${c.t === 'abs' ? 'Elle protège l’ordre public.' : 'Elle protège un époux.'}</span></div>
      <dl class="nul-dl"><div><dt>Qui peut agir ?</dt><dd>${c.who}</dd></div><div><dt>Délai</dt><dd>${c.del}</dd></div><div><dt>Textes</dt><dd>${c.art}</dd></div></dl><p class="w-note">${c.plus}</p></div>`;
  };
  const drawB = () => {
    const f = EFF[bf];
    $$('.nul-bf button', el).forEach(b => b.setAttribute('aria-selected', +b.dataset.b === bf));
    $('.nul-eff', el).innerHTML = `<div class="nul-time k-${f.kept}"><div class="nt-bar"><span class="nt-past"><i></i></span><span class="nt-cut" aria-hidden="true"></span><span class="nt-fut"></span></div><div class="nt-lab"><span>Célébration</span><span>Annulation</span><span>Avenir</span></div></div>
      <b class="w-t">${f.t}</b><dl class="nul-dl">${f.rows.map(r => `<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')}</dl>`;
  };
  $('.nul-chips', el).addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; ci = +b.dataset.i; drawC(); });
  $('.nul-bf', el).addEventListener('click', e => { const b = e.target.closest('[data-b]'); if (!b) return; bf = +b.dataset.b; drawB(); });
  drawC(); drawB();
});

/* PACS : séparation ou indivision */
JLG.widget('pacsregime', el => {
  const I = [
    {e:'🏠', s:'Appart d’avant', t:'L’appartement acheté par Tom avant le PACS', sep:'tom', ind:'tom', w:'Bien possédé au jour du pacte : il reste à Tom, quel que soit le régime.'},
    {e:'🚗', s:'Voiture de Léa', t:'La voiture achetée par Léa pendant le PACS, avec son salaire', sep:'lea', ind:'ind', w:'Séparation : elle est à Léa. Indivision : achetée à titre onéreux pendant le pacte, elle est indivise par moitié.'},
    {e:'🛋️', s:'Canapé à deux', t:'Le canapé acheté à deux pendant le PACS', sep:'ind', ind:'ind', w:'Acheté ensemble : il est indivis dans les deux régimes.'},
    {e:'🏡', s:'Maison héritée', t:'La maison héritée par Léa', sep:'lea', ind:'lea', w:'Bien reçu par succession : il reste personnel (art. 515-5-2).'},
    {e:'🎨', s:'Tableau peint', t:'Le tableau peint par Tom', sep:'tom', ind:'tom', w:'Bien créé par un partenaire : il reste personnel (art. 515-5-2).'},
    {e:'💶', s:'Livret de Tom', t:'Les économies de Tom sur son livret', sep:'tom', ind:'tom', w:'Deniers perçus pendant le pacte et non employés à une acquisition : ils restent personnels (art. 515-5-2).'},
    {e:'🏢', s:'Studio (remploi)', t:'Le studio acheté par Tom avec le prix de son ancien appartement', sep:'tom', ind:'tom', w:'Acheté avec des deniers antérieurs au pacte, ce que le notaire a précisé dans l’acte (clause de remploi) : il reste à Tom.'},
    {e:'📺', s:'Télé sans facture', t:'La télé dont personne ne retrouve la facture', sep:'ind', ind:'ind', w:'Séparation : faute de preuve d’une propriété exclusive, elle est réputée indivise. Indivision : c’est un acquêt, indivis.'},
    {e:'👗', s:'Affaires de Léa', t:'Les vêtements et les affaires personnelles de Léa', sep:'lea', ind:'lea', w:'Biens à caractère personnel : ils restent à Léa (art. 515-5-2).'},
    {e:'💻', s:'Ordi de Tom', t:'L’ordinateur acheté par Tom pendant le PACS, avec son salaire', sep:'tom', ind:'ind', w:'Séparation : à Tom, s’il prouve son achat. Indivision : acquêt à titre onéreux, indivis par moitié.'}
  ];
  const Z = [['tom', 'Tom'], ['ind', 'Indivis 50/50'], ['lea', 'Léa']];
  let mode = 'sep';
  el.innerHTML = `<div class="w w-preg">
    <div class="w-head"><span class="eyebrow">Schéma interactif</span><b>Tom et Léa sont pacsés : à qui sont les biens ?</b><span class="muted">Change de régime et regarde les biens se déplacer. Touche un bien pour l’explication.</span></div>
    <div class="seg-ctrl" role="tablist"><button role="tab" data-m="sep">Séparation (défaut)</button><button role="tab" data-m="ind">Indivision (option)</button></div>
    <div class="preg-board">${Z.map(z => `<div class="preg-z z-${z[0]}" data-z="${z[0]}"><div class="preg-h"><b>${z[1]}</b><span class="preg-n">0</span></div><div class="preg-slot"></div></div>`).join('')}</div>
    <div class="preg-out" aria-live="polite"></div></div>`;
  const tok = I.map((it, i) => { const b = document.createElement('button'); b.className = 'preg-tok'; b.dataset.i = i; b.innerHTML = `<span class="pe" aria-hidden="true">${it.e}</span><span>${it.s}</span>`; return b; });
  const flip = fn => {
    const first = tok.map(t => t.isConnected ? t.getBoundingClientRect() : null);
    fn();
    if (reduced()) return;
    tok.forEach((t, i) => { const f = first[i]; if (!f) return; const l = t.getBoundingClientRect(); const dx = f.left - l.left, dy = f.top - l.top; if (!dx && !dy) return; t.animate([{transform:`translate(${dx}px,${dy}px)`}, {transform:'none'}], {duration:650, easing:'cubic-bezier(.34,1.56,.64,1)'}); });
  };
  const place = () => {
    $$('.seg-ctrl button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.m === mode));
    flip(() => { I.forEach((it, i) => $(`.preg-z[data-z="${it[mode]}"] .preg-slot`, el).appendChild(tok[i])); });
    Z.forEach(z => { $(`.preg-z[data-z="${z[0]}"] .preg-n`, el).textContent = I.filter(it => it[mode] === z[0]).length; });
  };
  const explain = i => {
    const it = I[i]; const lab = z => Z.find(x => x[0] === z)[1];
    tok.forEach((t, k) => t.classList.toggle('sel', k === i));
    $('.preg-out', el).innerHTML = `<div class="w-card"><b class="w-t">${it.e} ${it.t}</b><p><span class="tag plain">Séparation : ${lab(it.sep)}</span> <span class="tag plain">Indivision : ${lab(it.ind)}</span></p><p style="margin-top:8px">${it.w}</p></div>`;
  };
  $('.seg-ctrl', el).addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (!b) return; mode = b.dataset.m; place(); });
  $('.preg-board', el).addEventListener('click', e => { const t = e.target.closest('.preg-tok'); if (t) explain(+t.dataset.i); });
  place(); explain(1);
  setTimeout(() => { if (el.isConnected && mode === 'sep' && !el.__touched){ mode = 'ind'; place(); } }, 1800);
  el.addEventListener('pointerdown', () => { el.__touched = true; }, {once:true});
});

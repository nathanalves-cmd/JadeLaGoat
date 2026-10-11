
/* =================== SCHÉMAS — DÉONTOLOGIE (bloc 1) =================== */
const later = (el, fn, ms) => setTimeout(() => { if (el.isConnected) fn(); }, reduced() ? 0 : ms);

/* 1. La journée de l’étude au service de l’État (délégation de service public) */
JLG.widget('delegation', el => {
  const M = [
    {h:'9 h', t:'Collecter les taxes', s:'pour le service de la publicité foncière', pk:'€', to:'SPF', d:'À la vente, le client remet au notaire les droits et taxes dus (droits d’enregistrement, taxe de publicité foncière, contribution de sécurité immobilière). Le notaire les reverse à l’État : il joue le rôle de percepteur.'},
    {h:'11 h', t:'Envoyer l’acte par Télé@ctes', s:'pour mettre à jour le fichier immobilier', pk:'@', to:'Fichier immobilier', d:'Après la signature, l’étude transmet l’acte par voie électronique au service de la publicité foncière. Le fichier immobilier est mis à jour : chacun peut savoir qui est propriétaire.'},
    {h:'14 h', t:'Renseigner Perval', s:'la base des prix de l’immobilier', pk:'%', to:'Perval', d:'L’étude transmet le prix et les caractéristiques de chaque vente. Ces données nourrissent les statistiques officielles des prix (les indices Notaires-Insee). Depuis la loi du 28 mars 2011, c’est une mission de service public.'},
    {h:'17 h', t:'Déposer la déclaration de succession', s:'pour l’administration fiscale', pk:'DS', to:'Impôts', d:'Après un décès, le notaire établit la déclaration de succession, calcule les droits dus par les héritiers et la dépose à l’administration fiscale.'}
  ];
  el.innerHTML = `<div class="w w-dl">
    <div class="w-head"><span class="eyebrow">Schéma animé</span><b>La journée de l’étude au service de l’État</b><span class="muted">Quatre tâches qu’une administration ferait sinon elle-même. Touche une mission, ou lance la journée.</span></div>
    <ol class="dl-list">${M.map((m, i) => `<li class="dl-row" data-i="${i}">
      <button class="dl-head" aria-expanded="false"><span class="dl-h">${m.h}</span><span class="dl-txt"><b>${m.t}</b><span>${m.s}</span></span></button>
      <div class="dl-lane" aria-hidden="true"><span class="dl-from">${sealSVG({ring:false})}<i>Étude</i></span><span class="dl-track"><i class="dl-pk">${m.pk}</i></span><span class="dl-to">${esc(m.to)}</span></div>
      <div class="dl-body" hidden><p>${m.d}</p></div></li>`).join('')}</ol>
    <div class="btn-row"><button class="btn btn-sm btn-primary" data-play>${icon('play')}Lancer la journée</button></div>
    <p class="w-note">L’État ne paie pas le notaire pour ces tâches : elles font partie de la mission de service public qu’il a acceptée en devenant officier public.</p></div>`;
  const seen = new Set(); let timer = null;
  const send = (i, ev) => {
    const row = $(`.dl-row[data-i="${i}"]`, el); if (!row) return;
    const lane = $('.dl-lane', row), body = $('.dl-body', row), head = $('.dl-head', row);
    lane.classList.remove('go', 'hit'); void lane.offsetWidth; lane.classList.add('go');
    head.setAttribute('aria-expanded', 'true'); row.classList.add('on');
    later(el, () => { lane.classList.add('hit'); body.hidden = false; if (!seen.has(i)){ seen.add(i); addXP(2, ev || {target:head}); } }, 1050);
  };
  el.addEventListener('click', e => {
    const h = e.target.closest('.dl-head');
    if (h){ clearTimeout(timer); const row = h.closest('.dl-row'); if (h.getAttribute('aria-expanded') === 'true'){ h.setAttribute('aria-expanded', 'false'); $('.dl-body', row).hidden = true; row.classList.remove('on'); return; } send(+row.dataset.i, e); return; }
    if (e.target.closest('[data-play]')){
      clearTimeout(timer);
      $$('.dl-row', el).forEach(r => { r.classList.remove('on'); $('.dl-head', r).setAttribute('aria-expanded', 'false'); $('.dl-body', r).hidden = true; $('.dl-lane', r).classList.remove('go', 'hit'); });
      const run = i => { if (i >= M.length || !el.isConnected) return; send(i); const r = $(`.dl-row[data-i="${i}"]`, el).getBoundingClientRect(); if (i && (r.bottom > innerHeight - 90)) $(`.dl-row[data-i="${i}"]`, el).scrollIntoView({block:'center', behavior: reduced() ? 'auto' : 'smooth'}); timer = setTimeout(() => run(i + 1), reduced() ? 200 : 1700); };
      run(0);
    }
  });
});

/* 2. Le duel : acte sous signature privée contre acte authentique */
JLG.widget('authentique', el => {
  const R = [
    {k:'La date', l:'On conteste la date', a:'Sa date peut être contestée par les tiers : elle ne devient certaine qu’à l’enregistrement, au décès d’un signataire, ou si un acte authentique la reprend.', b:'<b>Date certaine</b> dès la signature : elle fait foi, la preuve est simplifiée.'},
    {k:'La preuve', l:'On conteste le contenu', a:'Il suffit de désavouer son écriture ou sa signature : le juge doit alors procéder à une vérification d’écriture.', b:'Ce que le notaire a constaté fait foi <b>jusqu’à inscription de faux</b>. C’est à celui qui conteste de prouver.'},
    {k:'L’exécution', l:'Le débiteur ne paie pas', a:'Il faut d’abord un procès pour obtenir un jugement, puis le faire exécuter. Des mois de perdus.', b:'Avec la <b>copie exécutoire</b>, un commissaire de justice agit directement, sans passer par le tribunal.'},
    {k:'La publicité', l:'On veut publier la vente', a:'Impossible tel quel : pour être publiée au fichier immobilier, la vente doit résulter d’un acte authentique (art. 710-1).', b:'Le notaire publie l’acte au SPF : la vente devient <b>opposable aux tiers</b>.'}
  ];
  el.innerHTML = `<div class="w w-du">
    <div class="w-head"><span class="eyebrow">Le duel des actes</span><b>Sous signature privée, ou chez le notaire ?</b><span class="muted">Choisis une manche : les deux actes s’affrontent.</span></div>
    <div class="du-rounds" role="tablist" aria-label="Manches">${R.map((r, i) => `<button role="tab" aria-selected="false" data-r="${i}"><span class="mono">Manche ${i + 1}</span>${r.l}</button>`).join('')}</div>
    <div class="du-arena">
      <article class="du-card du-a"><div class="du-top"><span class="du-badge">SSP</span><span><b>Acte sous signature privée</b><span>signé entre les parties</span></span></div><span class="du-hp" aria-hidden="true"><i></i></span><p class="du-say">Signé à la maison, sans officier public.</p><span class="du-res" aria-hidden="true"></span></article>
      <span class="du-vs" aria-hidden="true">VS</span>
      <article class="du-card du-b"><div class="du-top"><span class="du-badge seal">${sealSVG({ring:false})}</span><span><b>Acte authentique</b><span>reçu par le notaire</span></span></div><span class="du-hp" aria-hidden="true"><i></i></span><p class="du-say">Reçu par un officier public, avec les solennités requises.</p><span class="du-res" aria-hidden="true"></span></article>
    </div>
    <div class="du-score" aria-live="polite"><em>Sous seing privé</em><b class="du-sa">0</b><i>–</i><b class="du-sb">0</b><em>Authentique</em></div>
    <div class="du-pitch" hidden></div></div>`;
  const won = new Set(); const A = $('.du-a', el), B = $('.du-b', el);
  const play = (i, ev) => {
    $$('.du-rounds button', el).forEach(b => b.setAttribute('aria-selected', +b.dataset.r === i));
    [A, B].forEach(c => c.classList.remove('clash', 'win', 'lose'));
    const arena = $('.du-arena', el); arena.classList.remove('fight'); void arena.offsetWidth; arena.classList.add('fight');
    $('.du-say', A).innerHTML = R[i].a; $('.du-say', B).innerHTML = R[i].b;
    $$('.du-say', el).forEach(s => { s.classList.remove('in'); void s.offsetWidth; s.classList.add('in'); });
    later(el, () => {
      B.classList.add('win'); A.classList.add('lose');
      $('.du-res', A).textContent = '✗'; $('.du-res', B).textContent = '✓';
      if (!won.has(i)){ won.add(i); $('.du-rounds [data-r="' + i + '"]', el).classList.add('done'); }
      const n = won.size; $('.du-sb', el).textContent = n;
      $('.du-hp i', A).style.width = (100 - n * 25) + '%';
      if (n === R.length && !el.__done){
        el.__done = true; const p = $('.du-pitch', el); p.hidden = false;
        p.innerHTML = `<div class="eyebrow">KO en 4 manches · ce que tu dis au client</div><p>« L’acte reçu par le notaire a une <b>date</b> que personne ne peut contester, il <b>fait foi</b> jusqu’à inscription de faux, il se fait <b>exécuter sans procès</b>, et il peut être <b>publié</b> pour vous protéger contre tous. »</p>`;
        confetti(70); addXP(10, ev || {target:p});
      }
    }, 520);
  };
  $('.du-rounds', el).addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (b) play(+b.dataset.r, e); });
});

/* 3. La course à la publication (art. 1198) — simulateur, ou défi en 5 manches */
JLG.widget('opposabilite', (el, o) => {
  const D = 30, SA = 3, SB = 10;
  const pos = d => ((d - 1) / (D - 1) * 100).toFixed(2) + '%';
  const verdict = (a, b, bad) => {
    if (a === b) return {w:null, t:'Publiés le même jour : c’est l’ordre de dépôt au service de la publicité foncière qui départage. La morale : on publie au plus vite !'};
    if (a < b) return {w:'a', t:`Anna a publié la première (jour ${a}) : elle est préférée. Bruno ne peut rien lui opposer ; il peut seulement se retourner contre M. Roux.`};
    if (bad) return {w:'a', t:`Bruno a publié le premier (jour ${b}), mais il <b>savait</b> que la maison était déjà vendue : il est de mauvaise foi, l’article 1198 ne le protège pas. Anna, la première acheteuse, l’emporte.`};
    return {w:'b', t:`Bruno a signé après Anna, mais il a publié le premier (jour ${b}) et il est de bonne foi : il est préféré (art. 1198), même si son droit est postérieur. Anna peut seulement agir contre M. Roux.`};
  };
  const lane = (who, name, s, p) => `<div class="op-lane op-${who}"><span class="op-name">${name}</span><span class="op-rail">
      <span class="op-bar" style="left:${pos(s)};width:calc(${pos(p)} - ${pos(s)})"></span>
      <span class="op-mk op-sign" style="left:${pos(s)}" title="Signature"></span>
      <span class="op-mk op-pub" style="left:${pos(p)}" title="Publication"><i>SPF</i><em class="op-crown" aria-hidden="true">${icon('crown')}</em></span></span></div>`;
  const ruler = () => `<div class="op-ruler" aria-hidden="true"><span class="op-name"></span><span class="op-rail">${[1, 5, 10, 15, 20, 25, 30].map(d => `<i style="left:${pos(d)}">${d}</i>`).join('')}<b class="op-now"></b></span></div>`;
  const board = (a, b) => `<div class="op-board">${ruler()}${lane('a', 'Anna', SA, a)}${lane('b', 'Bruno', SB, b)}<p class="op-legend"><span><i class="lg-s"></i> signature</span><span><i class="lg-p">SPF</i> publication</span><span><i class="lg-r"></i> la maison reste saisissable par les créanciers du vendeur</span></p></div>`;
  const crown = (w) => { $$('.op-lane', el).forEach(l => l.classList.toggle('won', !!w && l.classList.contains('op-' + w))); };

  if (o.mode === 'defi'){
    const rnd = () => { const a = 4 + Math.floor(Math.random() * 27); let b; do { b = 11 + Math.floor(Math.random() * 20); } while (b === a); return {a, b, bad: Math.random() < .3}; };
    let k = 0, score = 0, cur = null;
    const N = 5;
    const draw = () => {
      if (k >= N) return end();
      cur = rnd();
      el.innerHTML = `<div class="w w-op"><div class="w-head"><span class="eyebrow">Défi · manche ${k + 1}/${N}</span><b>Qui est propriétaire à l’égard des tiers ?</b><span class="muted">M. Roux a vendu sa maison à Anna (jour ${SA}), puis à Bruno (jour ${SB}).</span></div>
        ${board(cur.a, cur.b)}
        <p class="op-q">${cur.bad ? '⚠️ Bruno <b>savait</b> que la maison était déjà vendue.' : 'Bruno ignorait tout de la première vente.'} Anna publie le jour <b>${cur.a}</b>, Bruno le jour <b>${cur.b}</b>.</p>
        <div class="btn-row op-pick"><button class="btn" data-p="a">Anna</button><button class="btn" data-p="b">Bruno</button></div>
        <div class="op-verdict" aria-live="polite"></div></div>`;
      $('.op-pick', el).addEventListener('click', e => {
        const b = e.target.closest('[data-p]'); if (!b) return;
        const v = verdict(cur.a, cur.b, cur.bad); const ok = b.dataset.p === v.w;
        $$('.op-pick button', el).forEach(x => { x.disabled = true; if (x.dataset.p === v.w) x.classList.add('btn-primary'); });
        if (ok){ score++; addXP(5, e); } crown(v.w);
        $('.op-verdict', el).innerHTML = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Exact !' : 'Raté…'}</div><p>${v.t}</p></div><div class="qnext"><button class="btn btn-primary" id="opn">${k + 1 < N ? 'Manche suivante' : 'Résultat'}${icon('arrow')}</button></div>`;
        $('#opn', el).onclick = () => { k++; draw(); };
      });
    };
    const end = () => {
      if (score >= 4) confetti(90); addXP(10, {target:el});
      el.innerHTML = `<div class="result"><div class="eyebrow">La course à la publication</div><h3>${score}/${N} bons verdicts</h3><p class="muted">${score === N ? 'Parfait : l’article 1198 n’a plus de secret pour toi.' : 'Retiens : le premier qui publie l’emporte… s’il est de bonne foi.'}</p><div class="btn-row" style="justify-content:center"><button class="btn btn-primary" id="opr">${icon('refresh')}Rejouer</button></div></div>`;
      $('#opr', el).onclick = () => { k = 0; score = 0; draw(); };
    };
    return draw();
  }

  let a = 21, b = 14, bad = false, played = false;
  el.innerHTML = `<div class="w w-op">
    <div class="w-head"><span class="eyebrow">Simulateur · art. 1198 C. civ.</span><b>La course à la publication</b><span class="muted">M. Roux vend sa maison à Anna le jour ${SA}, puis la revend à Bruno le jour ${SB}. Règle les publications et regarde qui l’emporte.</span></div>
    <div class="op-slot"></div>
    <div class="op-ctrl">
      <label class="op-range"><span>Publication de l’acte d’<b>Anna</b> : jour <output id="opa">${a}</output></span><input type="range" min="${SA + 1}" max="${D}" value="${a}" data-who="a" aria-label="Jour de publication de l’acte d’Anna"></label>
      <label class="op-range"><span>Publication de l’acte de <b>Bruno</b> : jour <output id="opb">${b}</output></span><input type="range" min="${SB + 1}" max="${D}" value="${b}" data-who="b" aria-label="Jour de publication de l’acte de Bruno"></label>
      <button class="op-faith" aria-pressed="false">${icon('eye')}Bruno savait que la maison était déjà vendue</button>
    </div>
    <div class="op-verdict" aria-live="polite"></div>
    <div class="btn-row"><button class="btn btn-sm btn-primary" data-play>${icon('play')}Rejouer le mois</button></div></div>`;
  const update = (anim) => {
    $('.op-slot', el).innerHTML = board(a, b);
    const v = verdict(a, b, bad);
    const risk = a - SA;
    const show = () => { crown(v.w); $('.op-verdict', el).innerHTML = `<div class="w-card"><b class="w-t">${v.w ? (v.w === 'a' ? 'Anna' : 'Bruno') + ' l’emporte' : 'Égalité'}</b><p>${v.t}</p><p class="w-note" style="margin-top:8px">Pendant ${risk} jour${risk > 1 ? 's' : ''}, entre sa signature et sa publication, la maison d’Anna est restée saisissable par les créanciers de M. Roux.</p></div>`; };
    if (!anim || reduced()){ show(); return; }
    const now = $('.op-now', el); $('.op-board', el).classList.add('playing'); $('.op-verdict', el).innerHTML = '';
    const t0 = performance.now(), dur = 2600;
    (function step(t){
      if (!el.isConnected) return;
      const k = Math.min(1, (t - t0) / dur), day = 1 + k * (D - 1);
      now.style.left = pos(day);
      $$('.op-mk', el).forEach(m => { const d = parseFloat(m.style.left) / 100 * (D - 1) + 1; m.classList.toggle('lit', day >= d - .01); });
      if (k < 1) requestAnimationFrame(step); else { $('.op-board', el).classList.remove('playing'); show(); }
    })(t0);
  };
  el.addEventListener('input', e => { const r = e.target.closest('input[type=range]'); if (!r) return; if (r.dataset.who === 'a') a = +r.value; else b = +r.value; $('#op' + r.dataset.who, el).textContent = r.value; update(false); });
  el.addEventListener('click', e => {
    const f = e.target.closest('.op-faith'); if (f){ bad = !bad; f.setAttribute('aria-pressed', bad); update(false); return; }
    if (e.target.closest('[data-play]')){ update(true); if (!played){ played = true; addXP(3, e); } }
  });
  update(false);
});

/* 4. Le parcours d’un dossier dans l’étude — animation, ou défi « envoie le dossier au bon bureau » */
JLG.widget('etude', (el, o) => {
  const DK = [
    {id:'neg', r:'Négociateur', v:'Trouver', ic:'house', t:'Il estime la maison, organise les visites et trouve l’acheteur.'},
    {id:'col', r:'Collaborateur', v:'Préparer', ic:'pen', t:'Il réunit les pièces, demande l’EHF et le certificat d’urbanisme, et rédige le projet d’acte.'},
    {id:'not', r:'Notaire', v:'Signer', ic:'seal', t:'Il conseille les parties, vérifie leur identité, signe et appose son sceau : l’acte devient authentique.'},
    {id:'for', r:'Formaliste', v:'Publier', ic:'doc', t:'Il envoie l’acte au SPF par Télé@ctes et reçoit l’état sur formalité.'},
    {id:'com', r:'Comptable-taxateur', v:'Facturer', ic:'euro', t:'Il établit la facture et reverse à l’État les taxes collectées.'}
  ];
  const desks = (cls) => `<ol class="et-desks ${cls || ''}">${DK.map((d, i) => `<li class="et-desk${d.id === 'not' ? ' is-not' : ''}" data-i="${i}" data-d="${d.id}">
      <button class="et-av" aria-label="${esc(d.r)}">${icon(d.ic)}</button>
      <span class="et-role"><b>${d.r}</b><span class="et-verb">${d.v}</span></span>
      <span class="et-file" aria-hidden="true">${icon('fiche')}</span>
      ${d.id === 'not' ? `<span class="et-stamp" aria-hidden="true">${sealSVG({ring:false})}</span>` : ''}
      <p class="et-task">${d.t}</p></li>`).join('')}</ol>`;

  if (o.mode === 'defi'){
    const T = [
      ['Le client veut faire estimer sa maison', 'neg'], ['Il faut organiser trois visites samedi', 'neg'],
      ['Demander l’état hypothécaire hors formalité (EHF)', 'col'], ['Rédiger le projet d’acte de vente', 'col'], ['Le client appelle pour savoir où en est son dossier', 'col'],
      ['Le jour J : vérifier l’identité des parties et signer l’acte', 'not'], ['Conseiller les deux parties sur une clause délicate', 'not'],
      ['Envoyer l’acte signé au SPF par Télé@ctes', 'for'], ['Déposer une pièce au greffe après la signature', 'for'],
      ['Calculer les taxes à reverser à l’État', 'com'], ['Établir la facture du client', 'com'], ['Préparer la paie de fin de mois', 'com']
    ];
    let list = [], k = 0, score = 0, lock = false;
    const start = () => { list = shuffle(T).slice(0, 8); k = 0; score = 0; draw(); };
    const draw = () => {
      if (k >= list.length) return end();
      lock = false;
      el.innerHTML = `<div class="w w-et defi">
        <div class="w-head"><span class="eyebrow">Défi · tâche ${k + 1}/${list.length} · ${score} ✓</span><b class="et-q">${list[k][0]}</b><span class="muted">Touche le bureau qui s’en occupe.</span></div>
        ${desks('pick')}<div class="et-fb" aria-live="polite"></div></div>`;
      $('.et-desks', el).addEventListener('click', e => {
        const d = e.target.closest('.et-desk'); if (!d || lock) return; lock = true;
        const want = list[k][1], ok = d.dataset.d === want, good = $(`.et-desk[data-d="${want}"]`, el);
        good.classList.add('got'); if (!ok) d.classList.add('nope');
        if (ok){ score++; addXP(5, e); }
        const who = DK.find(x => x.id === want);
        $('.et-fb', el).innerHTML = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? pick(['Bien envoyé !', 'Exact.', 'Oui !']) : 'Non : c’est le ' + who.r.toLowerCase()}</div><p>${who.t}</p></div><div class="qnext"><button class="btn btn-primary" id="etn">${k + 1 < list.length ? 'Tâche suivante' : 'Résultat'}${icon('arrow')}</button></div>`;
        $('#etn', el).onclick = () => { k++; draw(); };
      });
    };
    const end = () => {
      const p = score / list.length; if (p >= .8) confetti(90); addXP(10, {target:el});
      el.innerHTML = `<div class="result"><div class="eyebrow">Le dossier fait le tour de l’étude</div><h3>${score}/${list.length} dossiers bien envoyés</h3><p class="muted">${p === 1 ? 'Tu connais l’étude comme ta poche.' : 'Trouver, préparer, signer, publier, facturer : un verbe par métier.'}</p><div class="btn-row" style="justify-content:center"><button class="btn btn-primary" id="etr">${icon('refresh')}Rejouer</button></div></div>`;
      $('#etr', el).onclick = start;
    };
    return start();
  }

  el.innerHTML = `<div class="w w-et">
    <div class="w-head"><span class="eyebrow">Schéma animé</span><b>Le parcours d’un dossier de vente</b><span class="muted">Suis le dossier de bureau en bureau, ou touche un métier. Un seul bureau a le sceau.</span></div>
    ${desks()}
    <div class="btn-row"><button class="btn btn-sm btn-primary" data-play>${icon('play')}Lancer le dossier</button></div>
    <p class="w-note">Tous travaillent sous la responsabilité du notaire, mais <b>seul le notaire authentifie</b>.</p></div>`;
  const list = $('.et-desks', el); let timer = null, played = false;
  const set = i => {
    $$('.et-desk', el).forEach((d, k) => { d.classList.toggle('on', k === i); d.classList.toggle('done', i >= 0 && k < i); });
  };
  const run = i => { if (i >= DK.length || !el.isConnected){ if (i >= DK.length) list.classList.add('finished'); return; } set(i); const d = $(`.et-desk[data-i="${i}"]`, el), r = d.getBoundingClientRect(); if (i && (r.bottom > innerHeight - 90 || r.top < 100)) d.scrollIntoView({block:'center', behavior: reduced() ? 'auto' : 'smooth'}); timer = setTimeout(() => run(i + 1), reduced() ? 300 : (DK[i].id === 'not' ? 2100 : 1500)); };
  el.addEventListener('click', e => {
    if (e.target.closest('[data-play]')){ clearTimeout(timer); list.classList.remove('finished'); set(-1); later(el, () => run(0), 120); if (!played){ played = true; addXP(3, e); } return; }
    const d = e.target.closest('.et-desk'); if (d){ clearTimeout(timer); list.classList.remove('finished'); set(+d.dataset.i); }
  });
  set(-1);
});

/* 5. Les professions du droit : comparateur */
JLG.widget('pros', el => {
  const P = [['not', 'Notaire', 'seal'], ['avo', 'Avocat', 'scale'], ['jug', 'Juge', 'trophy'], ['cj', 'Commissaire de justice', 'doc']];
  const C = [
    {k:'En un verbe', big:true, v:['Prévenir', 'Défendre', 'Trancher', 'Exécuter']},
    {k:'Pour qui ?', v:['Pour les deux parties : il est impartial.', 'Pour son seul client.', 'Pour personne : il départage les parties en appliquant le droit.', 'Pour le créancier qui le mandate, ou en exécution d’une décision.']},
    {k:'Quand ?', v:['Avant le conflit, pour l’éviter.', 'Avant ou pendant le conflit.', 'Quand le conflit est né.', 'Après : pour faire exécuter.']},
    {k:'Au tribunal ?', v:['Il ne représente pas ses clients en justice.', 'Il représente son client et plaide.', 'Il rend la décision.', 'Il fait exécuter la décision.']},
    {k:'Service public ?', y:[1, 0, 1, 1], v:['Oui : l’authenticité des actes.', 'Non : profession libérale, auxiliaire de justice.', 'Oui : rendre la justice.', 'Oui : officier public et ministériel.']},
    {k:'Acte authentique ?', y:[1, 0, 1, 1], v:['Oui : c’est le cœur de son métier.', 'Non : ses actes restent sous signature privée.', 'Oui : ses jugements sont authentiques.', 'Oui, pour les actes de sa fonction.']}
  ];
  el.innerHTML = `<div class="w w-pr">
    <div class="w-head"><span class="eyebrow">Comparateur</span><b>Notaire, avocat, juge, commissaire de justice</b><span class="muted">Pose une question : les quatre répondent.</span></div>
    <div class="ech-crit pr-crit" role="tablist" aria-label="Question">${C.map((c, i) => `<button role="tab" aria-selected="false" data-c="${i}">${c.k}</button>`).join('')}</div>
    <div class="pr-cols">${P.map(([id, n, ic]) => `<div class="pr-col${id === 'not' ? ' me' : ''}" data-p="${id}"><div class="pr-top"><span class="pr-av">${icon(ic)}</span><b>${n}</b></div><div class="pr-v" aria-live="polite"></div></div>`).join('')}</div></div>`;
  const show = i => {
    $$('.pr-crit button', el).forEach(b => b.setAttribute('aria-selected', +b.dataset.c === i));
    $$('.pr-col', el).forEach((col, j) => {
      const v = $('.pr-v', col), c = C[i];
      v.className = 'pr-v' + (c.big ? ' big' : ''); void v.offsetWidth; v.classList.add('in'); v.style.animationDelay = (j * 70) + 'ms';
      v.innerHTML = (c.y ? `<span class="pr-yn ${c.y[j] ? 'y' : 'n'}">${c.y[j] ? '✓' : '✗'}</span>` : '') + c.v[j];
    });
  };
  $('.pr-crit', el).addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) show(+b.dataset.c); });
  show(0);
});

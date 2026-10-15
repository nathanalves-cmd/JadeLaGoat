
/* =================== SCHÉMAS — DROIT CIVIL, PARTIE 3 : LES RÉGIMES MATRIMONIAUX =================== */

/* Déplacement animé (FLIP) : fn() déplace les éléments dans le DOM, ils glissent jusqu’à leur nouvelle place */
function flipMove(nodes, fn, dur = 520){
  const first = nodes.map(n => n.isConnected ? n.getBoundingClientRect() : null);
  fn();
  if (reduced()) return;
  nodes.forEach((n, i) => {
    const f = first[i]; if (!f || !n.isConnected) return;
    const l = n.getBoundingClientRect(); const dx = f.left - l.left, dy = f.top - l.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    n.animate([{transform:`translate(${dx}px,${dy}px)`}, {transform:'none'}], {duration:dur + (i % 4) * 45, easing:'cubic-bezier(.2,.8,.2,1)'});
  });
}
/* Compteur qui défile jusqu’à sa valeur */
function countTo(node, to, fmt, dur = 700){
  if (!node) return;
  const from = parseFloat(node.dataset.v || '0') || 0; node.dataset.v = to;
  if (reduced() || from === to){ node.textContent = fmt(to); return; }
  const t0 = performance.now();
  (function step(t){ if (!node.isConnected) return; const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); node.textContent = fmt(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); })(t0);
}
/* Envoie une copie d’un élément voler d’un point à un autre de l’écran */
function flyClone(src, dst, opt = {}){
  if (reduced() || !src || !dst) return Promise.resolve();
  const a = src.getBoundingClientRect(), b = dst.getBoundingClientRect();
  const c = src.cloneNode(true); c.classList.add('fly-clone'); c.setAttribute('aria-hidden', 'true');
  Object.assign(c.style, {position:'fixed', left:a.left + 'px', top:a.top + 'px', width:a.width + 'px', height:a.height + 'px', margin:0, zIndex:60, pointerEvents:'none'});
  document.body.appendChild(c);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = c.animate([{transform:'none', opacity:1}, {transform:`translate(${dx * .55}px,${dy * .55 - 40}px) scale(.8)`, opacity:1, offset:.55}, {transform:`translate(${dx}px,${dy}px) scale(${opt.scale || .35})`, opacity:.15}], {duration:opt.dur || 620, easing:'cubic-bezier(.3,.7,.3,1)'});
  return anim.finished.then(() => c.remove(), () => c.remove());
}

/* 1. Les trois masses : Paul et Julie, régime par régime — ou défi « propre ou commun ? » */
const MS_R = [
  {id:'legal', l:'Régime légal', s:'Communauté réduite aux acquêts', z:['Propres de Paul', 'Communauté', 'Propres de Julie'], note:'Mariés sans contrat depuis le 1er février 1966 : seuls les acquêts sont communs.'},
  {id:'old', l:'Avant 1966', s:'Communauté de meubles et acquêts', z:['Propres de Paul', 'Communauté', 'Propres de Julie'], note:'Mariés sans contrat avant le 1er février 1966 : tous les meubles tombent en communauté, quelle que soit leur origine.'},
  {id:'sep', l:'Séparation', s:'Séparation de biens', z:['Biens de Paul', 'Indivis', 'Biens de Julie'], note:'Pas de masse commune : chacun ses biens ; ce qui est acheté ou reçu à deux est indivis.'},
  {id:'univ', l:'Universelle', s:'Communauté universelle', z:['Propres de Paul', 'Communauté', 'Propres de Julie'], note:'Tous les biens, présents et à venir, sont communs, sauf les propres par nature.'}
];
const MS_I = [
  {e:'🏠', s:'Appart d’avant', t:'L’appartement acheté par Paul avant le mariage', z:{legal:'p', old:'p', sep:'p', univ:'c'}, w:{legal:'Possédé au jour du mariage : il reste propre (art. 1405).', old:'Un immeuble possédé avant le mariage reste propre, même dans l’ancien régime légal.', sep:'Acheté par Paul : il est à lui.', univ:'En communauté universelle, même les biens d’avant le mariage deviennent communs.'}},
  {e:'💶', s:'Livret de Julie', t:'Les économies de Julie sur son livret, avant le mariage', z:{legal:'j', old:'c', sep:'j', univ:'c'}, w:{legal:'Possédées au jour du mariage : propres.', old:'L’argent est un meuble : avant 1966, il tombe en communauté, même s’il date d’avant le mariage.', sep:'Ses économies restent à elle.', univ:'Tout devient commun.'}},
  {e:'🏡', s:'Maison héritée', t:'La maison héritée par Julie pendant le mariage', z:{legal:'j', old:'j', sep:'j', univ:'c'}, w:{legal:'Reçue par succession : propre (art. 1405).', old:'Un immeuble reçu par succession reste propre.', sep:'Elle en hérite seule : elle est à elle.', univ:'Les biens à venir, même hérités, sont communs.'}},
  {e:'💰', s:'Héritage en argent', t:'Les 30 000 € hérités par Paul pendant le mariage', z:{legal:'p', old:'c', sep:'p', univ:'c'}, w:{legal:'Reçus par succession : propres, même si c’est de l’argent.', old:'C’est un meuble : avant 1966, il tombe en communauté, même hérité. Toute la différence entre les deux régimes légaux.', sep:'À Paul.', univ:'Communs.'}},
  {e:'💼', s:'Salaires épargnés', t:'Les salaires de Paul mis de côté pendant le mariage', z:{legal:'c', old:'c', sep:'p', univ:'c'}, w:{legal:'Les revenus professionnels sont communs, même sur le compte personnel de Paul.', old:'Communs.', sep:'Chacun garde ce qu’il gagne.', univ:'Communs.'}},
  {e:'🚗', s:'Voiture', t:'La voiture achetée par Julie pendant le mariage, avec ses salaires', z:{legal:'c', old:'c', sep:'j', univ:'c'}, w:{legal:'Acquise à titre onéreux pendant le mariage : un acquêt, commun.', old:'Un acquêt : commun.', sep:'Julie l’a payée : elle est à elle, si elle peut le prouver.', univ:'Commune.'}},
  {e:'🛋️', s:'Maison à deux', t:'La maison achetée ensemble pendant le mariage', z:{legal:'c', old:'c', sep:'c', univ:'c'}, w:{legal:'Un acquêt : commun.', old:'Un acquêt : commun.', sep:'Achetée à deux : elle est indivise, chacun pour sa part.', univ:'Commune.'}},
  {e:'👗', s:'Vêtements', t:'Les vêtements et affaires personnelles de Julie', z:{legal:'j', old:'j', sep:'j', univ:'j'}, w:{legal:'Propres par nature (art. 1404).', old:'Les biens attachés à la personne restent propres.', sep:'À Julie.', univ:'Même en communauté universelle, les propres par nature restent propres (art. 1526).'}},
  {e:'🩹', s:'Indemnité corporelle', t:'L’indemnité versée à Paul pour son préjudice corporel', z:{legal:'p', old:'p', sep:'p', univ:'p'}, w:{legal:'Elle répare un dommage à sa personne : propre par nature (art. 1404).', old:'Attachée à la personne : propre.', sep:'À Paul.', univ:'Propre par nature : elle échappe même à la communauté universelle.'}},
  {e:'🏢', s:'Studio (remploi)', t:'Le studio acheté par Paul avec le prix de son appartement d’avant, avec déclaration de remploi', z:{legal:'p', old:'p', sep:'p', univ:'c'}, w:{legal:'Remploi déclaré dans l’acte : propre (art. 1434).', old:'Remploi déclaré : propre.', sep:'À Paul, qui l’a payé.', univ:'En communauté universelle, le remploi ne sert à rien : tout est commun.'}},
  {e:'📈', s:'Loyers épargnés', t:'Les loyers de l’appartement de Paul, mis de côté', z:{legal:'c', old:'c', sep:'p', univ:'c'}, w:{legal:'Les revenus des propres non consommés sont communs (art. 1401 et 1403).', old:'Communs.', sep:'À Paul, propriétaire de l’appartement.', univ:'Communs.'}},
  {e:'🎁', s:'Chalet donné aux deux', t:'Le chalet donné par les parents de Julie aux deux époux', z:{legal:'c', old:'c', sep:'c', univ:'c'}, w:{legal:'Donation faite aux deux époux : commun.', old:'Donné aux deux : commun.', sep:'Donné aux deux : indivis.', univ:'Commun.'}}
];
const MS_D = [
  ['🏠', 'L’appartement acheté par Paul avant le mariage', 'p', 'Possédé au jour du mariage : propre de Paul (art. 1405).'],
  ['💼', 'Le salaire de Julie, versé sur son compte personnel', 'c', 'Les revenus professionnels sont communs, même sur un compte personnel.'],
  ['🏡', 'La maison héritée par Julie', 'j', 'Reçue par succession : propre de Julie (art. 1405).'],
  ['🚗', 'La voiture achetée par Paul pendant le mariage, avec ses salaires', 'c', 'Un acquêt : commun.'],
  ['📄', 'L’indemnité de licenciement de Paul', 'c', 'Elle remplace un salaire : commune.'],
  ['🩹', 'L’indemnité réparant le préjudice corporel de Julie', 'j', 'Propre par nature (art. 1404).'],
  ['🔥', 'L’indemnité d’assurance après l’incendie de la maison propre de Paul', 'p', 'Elle remplace un bien propre : propre (art. 1406 al. 2).'],
  ['📈', 'Les actions gratuites reçues sur les titres propres de Julie', 'j', 'Accroissement d’un propre : propre (art. 1406 al. 1).'],
  ['💶', 'Les loyers économisés de l’appartement propre de Paul', 'c', 'Revenus de propres non consommés : communs (art. 1403).'],
  ['🎁', 'Le chalet donné par les parents de Julie aux deux époux', 'c', 'Donation faite aux deux époux : commun.'],
  ['🎀', 'La maison donnée à Paul seul par sa mère', 'p', 'Donation à un seul époux : propre.'],
  ['🔑', 'La maison donnée à Julie seule, avec une clause de mise en communauté', 'c', 'Le donateur a voulu qu’elle soit commune (art. 1405 al. 2).'],
  ['🏢', 'Le studio payé à 70 % par l’héritage de Paul, avec déclaration de remploi', 'p', 'Remploi régulier : propre de Paul (art. 1434).'],
  ['🏬', 'Le même studio, sans déclaration de remploi dans l’acte', 'c', 'Sans déclaration : commun, avec une récompense due à Paul.'],
  ['🔧', 'Le matériel acheté pour l’entreprise propre de Julie', 'j', 'Accessoire d’un propre : propre (art. 1406).'],
  ['❓', 'Un tableau dont personne ne sait qui l’a acheté', 'c', 'Dans le doute, il est présumé commun (art. 1402).'],
  ['👔', 'Les costumes de Paul', 'p', 'Vêtements personnels : propres par nature (art. 1404).']
];
JLG.widget('masses', (el, o) => {
  const ZK = ['p', 'c', 'j'];
  const board = (labels, cls) => `<div class="ms-board ${cls || ''}">${ZK.map((z, i) => `<div class="ms-z z-${z}" data-z="${z}"><div class="ms-h"><b>${labels[i]}</b><span class="ms-n">0</span></div><div class="ms-slot"></div></div>`).join('')}</div>`;

  if (o.mode === 'defi'){
    const N = 10; let list = [], k = 0, score = 0, lock = false, placed = [];
    const start = () => { list = shuffle(MS_D).slice(0, N); k = 0; score = 0; placed = []; draw(); };
    const mini = (e, cls) => `<span class="ms-tok mini ${cls || ''}"><span class="pe" aria-hidden="true">${e}</span></span>`;
    const draw = () => {
      if (k >= list.length) return end();
      lock = false; const it = list[k];
      el.innerHTML = `<div class="w w-ms defi">
        <div class="w-head"><span class="eyebrow">Défi · bien ${k + 1}/${list.length} · ${score} ✓</span><b>Régime légal : où va ce bien ?</b><span class="muted">Paul et Julie sont mariés sans contrat. Touche la bonne masse.</span></div>
        <div class="ms-card" id="msc"><span class="ms-e" aria-hidden="true">${it[0]}</span><span>${it[1]}</span></div>
        ${board(['Propres de Paul', 'Communauté', 'Propres de Julie'], 'pick')}
        <div class="ms-fb" aria-live="polite"></div></div>`;
      $$('.ms-z', el).forEach(z => { z.setAttribute('role', 'button'); z.tabIndex = 0; z.setAttribute('aria-label', $('b', z).textContent);
        const mine = placed.filter(x => x[1] === z.dataset.z); $('.ms-slot', z).innerHTML = mine.map(x => mini(x[0], 'old')).join(''); $('.ms-n', z).textContent = mine.length; });
      const choose = (z, ev) => {
        if (lock) return; lock = true;
        const ok = z.dataset.z === it[2], good = $(`.ms-z[data-z="${it[2]}"]`, el);
        const card = $('#msc', el);
        placed.push([it[0], it[2]]);
        flyClone(card, $('.ms-slot', good)).then(() => {
          if (!good.isConnected) return;
          $('.ms-slot', good).insertAdjacentHTML('beforeend', mini(it[0]));
          const n = $('.ms-n', good); n.textContent = placed.filter(x => x[1] === it[2]).length; n.classList.add('bump');
        });
        card.classList.add('gone');
        good.classList.add('got'); if (!ok) z.classList.add('nope');
        if (ok){ score++; addXP(5, ev); }
        const lab = $('b', good).textContent;
        $('.ms-fb', el).innerHTML = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? pick(['Bien rangé !', 'Exact.', 'Oui !']) : 'Non : ' + lab}</div><p>${it[3]}</p></div><div class="qnext"><button class="btn btn-primary" id="msn">${k + 1 < list.length ? 'Bien suivant' : 'Résultat'}${icon('arrow')}</button></div>`;
        const n = $('#msn', el); n.focus({preventScroll:true}); n.onclick = () => { k++; draw(); };
      };
      $('.ms-board', el).addEventListener('click', e => { const z = e.target.closest('.ms-z'); if (z) choose(z, e); });
      $('.ms-board', el).addEventListener('keydown', e => { const z = e.target.closest('.ms-z'); if (z && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); choose(z, {target:z}); } });
    };
    const end = () => {
      const p = score / list.length; if (p >= .8) confetti(90); addXP(10, {target:el});
      el.innerHTML = `<div class="result"><div class="eyebrow">Propre ou commun ?</div><h2>${score}/${list.length} biens bien rangés</h2><p class="muted">${p === 1 ? 'Parfait : la communauté n’a plus de secret pour toi.' : 'Retiens : avant, gratuit ou personnel = propre ; acheté ou gagné pendant le mariage = commun.'}</p><div class="btn-row" style="justify-content:center"><button class="btn btn-primary" id="msr">${icon('refresh')}Rejouer</button></div></div>`;
      $('#msr', el).onclick = start;
    };
    return start();
  }

  let reg = 'legal', sel = 1, timer = null;
  el.innerHTML = `<div class="w w-ms">
    <div class="w-head"><span class="eyebrow">Schéma animé</span><b>Paul et Julie : à qui sont les biens ?</b><span class="muted">Change de régime : les biens changent de masse. Touche un bien pour comprendre.</span></div>
    <div class="seg-ctrl ms-regs" role="tablist" aria-label="Régime matrimonial">${MS_R.map(r => `<button role="tab" aria-selected="false" data-r="${r.id}">${r.l}</button>`).join('')}</div>
    <p class="ms-sub" aria-live="polite"></p>
    ${board(['', '', ''])}
    <div class="btn-row"><button class="btn btn-sm" data-play>${icon('play')}Faire défiler les quatre régimes</button></div>
    <div class="ms-out" aria-live="polite"></div></div>`;
  const tok = MS_I.map((it, i) => { const b = document.createElement('button'); b.className = 'ms-tok'; b.dataset.i = i; b.innerHTML = `<span class="pe" aria-hidden="true">${it.e}</span><span>${it.s}</span>`; return b; });
  const R = () => MS_R.find(r => r.id === reg);
  const explain = () => {
    const it = MS_I[sel], r = R(), lab = r.z[ZK.indexOf(it.z[reg])];
    tok.forEach((t, i) => t.classList.toggle('sel', i === sel));
    $('.ms-out', el).innerHTML = `<div class="w-card"><b class="w-t">${it.e} ${it.t}</b><p><span class="tag">${r.l} : ${lab}</span></p><p style="margin-top:8px">${it.w[reg]}</p></div>`;
  };
  const place = () => {
    const r = R();
    $$('.ms-regs button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.r === reg));
    $('.ms-sub', el).innerHTML = `<b>${r.s}</b> · ${r.note}`;
    $$('.ms-z', el).forEach((z, i) => { $('b', z).textContent = r.z[i]; z.classList.toggle('indiv', reg === 'sep' && z.dataset.z === 'c'); });
    flipMove(tok, () => { MS_I.forEach((it, i) => $(`.ms-z[data-z="${it.z[reg]}"] .ms-slot`, el).appendChild(tok[i])); });
    ZK.forEach(z => { const n = $(`.ms-z[data-z="${z}"] .ms-n`, el); n.textContent = MS_I.filter(it => it.z[reg] === z).length; n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump'); });
    explain();
  };
  $('.ms-regs', el).addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b) return; clearTimeout(timer); reg = b.dataset.r; place(); });
  $('.ms-board', el).addEventListener('click', e => { const t = e.target.closest('.ms-tok'); if (t){ sel = +t.dataset.i; explain(); } });
  $('[data-play]', el).addEventListener('click', e => {
    clearTimeout(timer); let i = 0;
    const run = () => { if (!el.isConnected || i >= MS_R.length) return; reg = MS_R[i].id; place(); i++; timer = setTimeout(run, reduced() ? 900 : 2300); };
    run(); if (!el.__played){ el.__played = true; addXP(3, e); }
  });
  place();
});

/* Comparateur générique : une question, toutes les colonnes répondent */
function cmpBoard(el, cfg){
  el.innerHTML = `<div class="w w-pr w-cmp">
    <div class="w-head"><span class="eyebrow">${cfg.eyebrow || 'Comparateur'}</span><b>${cfg.title}</b>${cfg.sub ? `<span class="muted">${cfg.sub}</span>` : ''}</div>
    <div class="ech-crit pr-crit" role="tablist" aria-label="Question">${cfg.rows.map((c, i) => `<button role="tab" aria-selected="false" data-c="${i}">${c.k}</button>`).join('')}</div>
    <div class="pr-cols">${cfg.cols.map(c => `<div class="pr-col${c.me ? ' me' : ''}"><div class="pr-top"><span class="pr-av">${icon(c.ic)}</span><b>${c.n}</b></div><div class="pr-v" aria-live="polite"></div></div>`).join('')}</div></div>`;
  const show = i => {
    $$('.pr-crit button', el).forEach(b => b.setAttribute('aria-selected', +b.dataset.c === i));
    $$('.pr-col', el).forEach((col, j) => {
      const v = $('.pr-v', col), c = cfg.rows[i];
      v.className = 'pr-v' + (c.big ? ' big' : ''); void v.offsetWidth; v.classList.add('in'); v.style.animationDelay = (j * 70) + 'ms';
      v.innerHTML = (c.y ? `<span class="pr-yn ${c.y[j] ? 'y' : 'n'}">${c.y[j] ? '✓' : '✗'}</span>` : '') + c.v[j];
    });
  };
  $('.pr-crit', el).addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) show(+b.dataset.c); });
  show(0);
}

/* 2. Les régimes comparés */
JLG.widget('regimes', el => cmpBoard(el, {
  title:'Quatre régimes, une question', sub:'Choisis une question : les quatre régimes répondent.',
  cols:[{n:'Communauté légale', ic:'rings', me:true}, {n:'Séparation de biens', ic:'split'}, {n:'Participation aux acquêts', ic:'scale'}, {n:'Communauté universelle', ic:'heart'}],
  rows:[
    {k:'L’idée', big:true, v:['Partager ce qu’on gagne', 'Chacun pour soi', 'Séparés, puis on partage', 'Tout à deux']},
    {k:'Qu’est-ce qui est commun ?', v:['Les acquêts : ce qui est acheté ou gagné pendant le mariage. Chacun garde ses propres.', 'Rien : pas de masse commune. Les biens achetés à deux sont indivis.', 'Rien pendant le mariage : chacun ses biens.', 'Tous les biens, présents et à venir, sauf les propres par nature.']},
    {k:'Les dettes', v:['Les créanciers d’un époux peuvent aussi saisir les biens communs (art. 1413) : un risque pour un entrepreneur.', 'Chacun paie ses dettes, sauf les dettes ménagères (art. 220) ou signées à deux.', 'Comme la séparation : chacun ses dettes.', 'Toutes les dettes des époux sont communes (art. 1526).']},
    {k:'Les pouvoirs', v:['Les actes graves se font à deux : vendre un immeuble commun, donner un bien commun (art. 1422 et 1424).', 'Pleins pouvoirs sur ses biens, sauf le logement de la famille (art. 215 al. 3).', 'Comme la séparation.', 'Comme la communauté légale : les actes graves à deux.']},
    {k:'À la fin du régime', v:['La communauté se partage par moitié, après les récompenses.', 'Chacun reprend ses biens ; les biens indivis se partagent.', 'Celui qui s’est le plus enrichi verse à l’autre la moitié de la différence.', 'Avec une clause d’attribution intégrale, tout va au survivant.']},
    {k:'Pour qui ?', v:['Le couple qui ne fait rien : c’est le régime par défaut.', 'L’époux commerçant ou artisan, qui veut protéger son conjoint.', 'Le couple qui veut l’autonomie pendant, et l’équité à la fin.', 'Les époux retraités qui veulent protéger le survivant.']}
  ]
}));

/* 3. Le remploi : propre ou commun ? (art. 1434 et 1436) */
JLG.widget('remploi', el => {
  let prix = 200000, frais = 15000, propres = 120000, decl = true, apres = false, last = '';
  el.innerHTML = `<div class="w w-rp">
    <div class="w-head"><span class="eyebrow">Simulateur · art. 1434 et 1436 C. civ.</span><b>Paul achète un studio : propre ou commun ?</b><span class="muted">Paul, marié sans contrat, paie avec le prix de vente de son appartement propre. Règle les montants, puis la déclaration.</span></div>
    <div class="rp-in">
      <label class="rp-f"><span>Prix du studio <output data-o="prix"></output></span><input type="range" min="50000" max="400000" step="5000" data-k="prix"></label>
      <label class="rp-f"><span>Frais d’acquisition <output data-o="frais"></output></span><input type="range" min="0" max="40000" step="1000" data-k="frais"></label>
      <label class="rp-f"><span>Fonds propres de Paul <output data-o="propres"></output></span><input type="range" min="0" max="440000" step="5000" data-k="propres"></label>
    </div>
    <div class="rp-tgs"><button class="rp-tg" data-t="decl" aria-pressed="true">${icon('pen')}Déclaration de remploi dans l’acte d’achat</button><button class="rp-tg" data-t="apres" aria-pressed="false" hidden>${icon('clock')}Déclaration faite après coup, avec l’accord de Julie</button></div>
    <div class="rp-bar" aria-hidden="true"><span class="rp-p"><i>Paul</i></span><span class="rp-c"><i>Communauté</i></span><b class="rp-mid"><em>la moitié</em></b></div>
    <div class="rp-legend"><span><i class="lg-p"></i>Fonds propres : <b data-v="p"></b></span><span><i class="lg-c"></i>Payé par la communauté : <b data-v="c"></b></span></div>
    <div class="rp-out" aria-live="polite"></div></div>`;
  const inp = k => $(`input[data-k="${k}"]`, el);
  const draw = () => {
    const tot = prix + frais; inp('propres').max = tot; if (propres > tot) propres = tot;
    inp('prix').value = prix; inp('frais').value = frais; inp('propres').value = propres;
    $('[data-o="prix"]', el).textContent = eurN(prix); $('[data-o="frais"]', el).textContent = eurN(frais); $('[data-o="propres"]', el).textContent = eurN(propres);
    const p = propres, c = tot - p, pp = tot ? p / tot * 100 : 0;
    $('.rp-p', el).style.width = pp + '%'; $('.rp-c', el).style.width = (100 - pp) + '%';
    $('.rp-p i', el).textContent = pp >= 14 ? Math.round(pp) + ' %' : ''; $('.rp-c i', el).textContent = 100 - pp >= 14 ? Math.round(100 - pp) + ' %' : '';
    $('[data-v="p"]', el).textContent = eurN(p); $('[data-v="c"]', el).textContent = eurN(c);
    const tg = $('[data-t="apres"]', el); tg.hidden = decl; tg.setAttribute('aria-pressed', apres && !decl);
    $('[data-t="decl"]', el).setAttribute('aria-pressed', decl);
    let k, title, txt;
    if (p === 0){ k = 'com'; title = 'Commun'; txt = 'Sans fonds propres, il n’y a pas de remploi : le studio, acheté pendant le mariage, est un <b>acquêt</b>.'; }
    else if (decl && p >= c){ k = 'pro'; title = 'Propre de Paul'; txt = `Les fonds propres paient ${Math.round(pp)} % du prix et des frais : la communauté ne paie pas plus que Paul. Avec la déclaration de remploi dans l’acte, le studio est <b>propre</b> (art. 1434), et c’est opposable à tous.` + (c > 0 ? ` La communauté a payé ${eurN(c)} : elle aura droit à une <b>récompense</b> à la dissolution (art. 1436).` : ' Paul a tout payé avec ses fonds propres : aucune récompense.'); }
    else if (decl){ k = 'com'; title = 'Commun'; txt = `La communauté paie plus que Paul (${eurN(c)} contre ${eurN(p)}) : malgré la déclaration, le studio tombe en communauté (art. 1436). Paul aura droit à une <b>récompense</b> pour ses ${eurN(p)}.`; }
    else if (apres && p >= c){ k = 'mid'; title = 'Propre… entre époux seulement'; txt = 'Faite après coup, d’un commun accord, la déclaration ne produit ses effets que <b>dans les rapports entre Paul et Julie</b> (art. 1434). Pour les tiers, notamment les créanciers du couple, le studio reste commun.'; }
    else { k = 'com'; title = 'Commun'; txt = `Sans déclaration dans l’acte d’achat, le studio est un <b>acquêt</b> : il tombe en communauté. Paul aura droit à une récompense pour ses ${eurN(p)}.` + (apres ? ' Même un accord après coup ne change rien : la communauté a payé plus que lui.' : ''); }
    const out = $('.rp-out', el);
    out.innerHTML = `<div class="rp-verdict v-${k}"><span class="rp-stamp${k !== last ? ' pop' : ''}">${title}</span><p>${txt}</p></div>`;
    last = k;
  };
  el.addEventListener('input', e => { const r = e.target.closest('input[data-k]'); if (!r) return; const v = +r.value; if (r.dataset.k === 'prix') prix = v; else if (r.dataset.k === 'frais') frais = v; else propres = v; draw(); });
  el.addEventListener('click', e => {
    const t = e.target.closest('.rp-tg'); if (!t) return;
    if (t.dataset.t === 'decl'){ decl = !decl; if (decl) apres = false; } else apres = !apres;
    draw(); if (!el.__touched){ el.__touched = true; addXP(2, e); }
  });
  draw();
});

/* 4. Donner à un enfant marié : trois formules */
JLG.widget('donation', el => {
  const O = [
    {id:'seul', l:'À Inès seule', to:['ines'], z:'ines', bien:'Propre d’Inès', tax:[[100, 'ld']], taxT:'Inès est la seule donataire : droits <b>en ligne directe</b> sur le tout (abattement et barème parent-enfant).', rap:'Inès rapporte le bien à la succession de ses parents.', note:'Si Inès divorce, l’appartement reste à elle.'},
    {id:'deux', l:'À Inès et Hugo', to:['ines', 'hugo'], z:'com', bien:'Commun', tax:[[50, 'ld'], [50, 'et']], taxT:'La moitié d’Inès en ligne directe ; la moitié d’Hugo, le gendre, au <b>tarif entre étrangers (60 %)</b>.', rap:'Inès ne rapporte que sa moitié (art. 849).', note:'Le couple en profite, mais la part du gendre coûte cher.'},
    {id:'clause', l:'À Inès + clause', to:['ines'], z:'com', bien:'Commun', tax:[[100, 'ld']], taxT:'Inès reste la seule donataire : droits <b>en ligne directe</b> sur le tout.', rap:'Inès rapporte le bien pour sa totalité.', note:'La clause de mise en communauté (art. 1405 al. 2) : le bien est commun, et la fiscalité reste douce.'}
  ];
  let cur = 0, busy = false;
  el.innerHTML = `<div class="w w-dn">
    <div class="w-head"><span class="eyebrow">Schéma animé</span><b>Les parents d’Inès lui donnent un appartement</b><span class="muted">Inès est mariée à Hugo sans contrat. Choisis la formule : suis le cadeau.</span></div>
    <div class="seg-ctrl dn-opts" role="tablist" aria-label="Formule de donation">${O.map((x, i) => `<button role="tab" aria-selected="false" data-i="${i}">${x.l}</button>`).join('')}</div>
    <div class="dn-scene">
      <div class="dn-who dn-par" data-a="par"><span class="dn-av" aria-hidden="true">👪</span><b>Les parents</b></div>
      <div class="dn-who dn-ines" data-a="ines"><span class="dn-av" aria-hidden="true">👩</span><b>Inès</b><span class="dn-clause">clause</span></div>
      <div class="dn-who dn-hugo" data-a="hugo"><span class="dn-av" aria-hidden="true">👨</span><b>Hugo</b></div>
      <div class="dn-z dn-zi" data-a="zines"><span>Propres d’Inès</span><i class="dn-gift" aria-hidden="true">${icon('gift')}</i></div>
      <div class="dn-z dn-zc" data-a="zcom"><span>Communauté</span><i class="dn-gift" aria-hidden="true">${icon('gift')}</i></div>
      <div class="dn-z dn-zh" data-a="zhugo"><span>Propres d’Hugo</span></div>
    </div>
    <div class="dn-cards" aria-live="polite"></div></div>`;
  const scene = $('.dn-scene', el);
  const at = a => { const s = scene.getBoundingClientRect(), r = $(`[data-a="${a}"]`, scene).getBoundingClientRect(); return [r.left - s.left + r.width / 2, r.top - s.top + r.height / 2]; };
  const gift = (cls) => { const g = document.createElement('i'); g.className = 'dn-fly ' + (cls || ''); g.setAttribute('aria-hidden', 'true'); g.innerHTML = icon('gift'); scene.appendChild(g); return g; };
  const move = (g, pts, dur, fadeIn) => g.animate(pts.map(([x, y], i) => ({transform:`translate(${x}px,${y}px) translate(-50%,-50%) scale(${fadeIn && i === 0 ? .6 : 1})`, opacity:fadeIn && i === 0 ? 0 : 1})), {duration:dur, easing:'cubic-bezier(.4,.1,.3,1)', fill:'forwards'}).finished;
  const cards = x => {
    $('.dn-cards', el).innerHTML = `
      <div class="dn-card"><span class="eyebrow">Le bien est</span><b class="w-t">${x.bien}</b><p class="muted">${x.note}</p></div>
      <div class="dn-card"><span class="eyebrow">Droits de donation</span><span class="dn-tax">${x.tax.map(([w, k]) => `<i class="t-${k}" style="width:${w}%">${k === 'ld' ? 'Ligne directe' : '60 %'}</i>`).join('')}</span><p>${x.taxT}</p></div>
      <div class="dn-card"><span class="eyebrow">Rapport à la succession</span><p>${x.rap}</p></div>`;
  };
  const play = async (i, ev) => {
    if (busy) return; cur = i; const x = O[i];
    $$('.dn-opts button', el).forEach(b => b.setAttribute('aria-selected', +b.dataset.i === i));
    $$('.dn-z', scene).forEach(z => z.classList.remove('has')); $$('.dn-who', scene).forEach(w => w.classList.remove('got', 'clause-on'));
    $$('.dn-fly', scene).forEach(g => g.remove());
    cards(x);
    const finish = () => { $$('.dn-fly', scene).forEach(g => g.remove()); scene.querySelector(x.z === 'ines' ? '.dn-zi' : '.dn-zc').classList.add('has'); x.to.forEach(t => $(`.dn-${t}`, scene).classList.add('got')); if (x.id === 'clause') $('.dn-ines', scene).classList.add('clause-on'); };
    if (reduced()){ finish(); return; }
    busy = true;
    try {
      const P = at('par'), I = at('ines'), H = at('hugo'), ZI = at('zines'), ZC = at('zcom');
      if (x.id === 'deux'){
        const g1 = gift('half'), g2 = gift('half');
        await Promise.all([move(g1, [P, I], 700, true), move(g2, [P, H], 700, true)]);
        $('.dn-ines', scene).classList.add('got'); $('.dn-hugo', scene).classList.add('got');
        await Promise.all([move(g1, [I, ZC], 650), move(g2, [H, ZC], 650)]);
      } else {
        const g = gift();
        await move(g, [P, I], 700, true); $('.dn-ines', scene).classList.add('got');
        if (x.id === 'clause'){ $('.dn-ines', scene).classList.add('clause-on'); await new Promise(r => setTimeout(r, 450)); }
        await move(g, [I, x.z === 'ines' ? ZI : ZC], 650);
      }
    } catch(e){}
    busy = false; if (el.isConnected) finish();
    if (ev && !el.__seen){ el.__seen = new Set(); } if (ev){ el.__seen.add(i); if (el.__seen.size === O.length && !el.__done){ el.__done = true; addXP(6, ev); } }
  };
  $('.dn-opts', el).addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) play(+b.dataset.i, e); });
  cards(O[0]); $$('.dn-opts button', el)[0].setAttribute('aria-selected', 'true');
  later(el, () => play(0), 500);
});

/* 5. La participation aux acquêts : calcul de la créance, ou défi en 5 manches */
JLG.widget('participation', (el, o) => {
  const k = v => Math.round(v / 1000);
  const calc = s => { const a = Math.max(0, s.mf - s.mo), b = Math.max(0, s.hf - s.ho); const d = Math.abs(a - b); return {a, b, d, cr:d / 2, who:a === b ? null : (a > b ? 'mme' : 'mr')}; };
  const rows = s => {
    const mx = Math.max(s.mo, s.mf, s.ho, s.hf, 1) * 1.08, pc = v => (v / mx * 100).toFixed(2) + '%';
    const one = (n, o1, f1, cls) => { const lo = Math.min(o1, f1), hi = Math.max(o1, f1), up = f1 >= o1;
      return `<div class="pa-row ${cls}"><b class="pa-n">${n}</b><span class="pa-track"><i class="pa-base" style="width:${pc(lo)}"></i><i class="pa-gain ${up ? 'up' : 'down'}" style="left:${pc(lo)};width:calc(${pc(hi)} - ${pc(lo)})"></i><em class="pa-mk pa-o" style="left:${pc(o1)}" title="Originaire"></em><em class="pa-mk pa-f" style="left:${pc(f1)}" title="Final"></em></span>
      <span class="pa-v"><span>${eurN(o1)} → ${eurN(f1)}</span><b class="${up ? 'up' : 'down'}">${up ? '+ ' + eurN(f1 - o1) : 'déficit ' + eurN(o1 - f1)}</b></span></div>`; };
    return one('Madame', s.mo, s.mf, 'mme') + one('Monsieur', s.ho, s.hf, 'mr');
  };
  const verdictTxt = (s, r) => r.who ? `${r.who === 'mme' ? 'Madame' : 'Monsieur'} s’est le plus enrichi${r.who === 'mme' ? 'e' : ''} : ${r.who === 'mme' ? 'elle' : 'il'} doit à ${r.who === 'mme' ? 'Monsieur' : 'Madame'} la moitié de la différence.` : 'Les deux se sont enrichis autant : aucune créance.';

  if (o.mode === 'defi'){
    const N = 5; let n = 0, score = 0;
    const rnd = () => { const r = () => 10000 * Math.floor(Math.random() * 31); let s; do { s = {mo:r(), ho:r()}; s.mf = s.mo + 10000 * Math.floor(Math.random() * 30); s.hf = s.ho + 10000 * Math.floor(Math.random() * 30); } while (calc(s).d === 0); return s; };
    const draw = () => {
      if (n >= N) return end();
      const s = rnd(), r = calc(s);
      const good = `${r.who === 'mme' ? 'Madame' : 'Monsieur'} doit ${eurN(r.cr)}`;
      const opts = shuffle([...new Set([good, `${r.who === 'mme' ? 'Monsieur' : 'Madame'} doit ${eurN(r.cr)}`, `${r.who === 'mme' ? 'Madame' : 'Monsieur'} doit ${eurN(r.d)}`, `${r.who === 'mme' ? 'Madame' : 'Monsieur'} doit ${eurN((r.a + r.b) / 2)}`])]);
      el.innerHTML = `<div class="w w-pa"><div class="w-head"><span class="eyebrow">Défi · manche ${n + 1}/${N} · ${score} ✓</span><b>Qui doit combien ?</b><span class="muted">Mariés en participation aux acquêts. Voici leurs patrimoines au mariage, puis au divorce.</span></div>
        <div class="pa-table"><span></span><b>Au mariage</b><b>Au divorce</b><b>Madame</b><span>${eurN(s.mo)}</span><span>${eurN(s.mf)}</span><b>Monsieur</b><span>${eurN(s.ho)}</span><span>${eurN(s.hf)}</span></div>
        <div class="q-ans pa-pick">${opts.map(t => `<button class="btn" data-t="${esc(t)}">${t}</button>`).join('')}</div><div class="pa-fb" aria-live="polite"></div></div>`;
      $('.pa-pick', el).addEventListener('click', e => {
        const b = e.target.closest('[data-t]'); if (!b || el.__lock) return; el.__lock = true;
        const ok = b.dataset.t === good; if (ok){ score++; addXP(6, e); }
        $$('.pa-pick button', el).forEach(x => { x.disabled = true; if (x.dataset.t === good) x.classList.add('btn-primary'); });
        $('.pa-fb', el).innerHTML = `<div class="pa-rows">${rows(s)}</div><div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Exact !' : 'Raté…'}</div><p>Acquêts nets : Madame ${eurN(r.a)}, Monsieur ${eurN(r.b)}. Différence : ${eurN(r.d)}. ${verdictTxt(s, r)} Soit <b>${eurN(r.cr)}</b>.</p></div><div class="qnext"><button class="btn btn-primary" id="pan">${n + 1 < N ? 'Manche suivante' : 'Résultat'}${icon('arrow')}</button></div>`;
        $('#pan', el).onclick = () => { el.__lock = false; n++; draw(); };
      });
    };
    const end = () => { if (score >= 4) confetti(90); addXP(10, {target:el}); el.innerHTML = `<div class="result"><div class="eyebrow">La créance de participation</div><h2>${score}/${N} bons calculs</h2><p class="muted">${score === N ? 'Parfait.' : 'La méthode : final − originaire pour chacun, on compare, puis la moitié de la différence.'}</p><div class="btn-row" style="justify-content:center"><button class="btn btn-primary" id="par">${icon('refresh')}Rejouer</button></div></div>`; $('#par', el).onclick = () => { n = 0; score = 0; draw(); }; };
    return draw();
  }

  const EX = {
    cours:{l:'L’exemple du cours', s:{mo:250000, mf:300000, ho:0, hf:200000}},
    cabinet:{l:'Le cabinet médical', s:{mo:60000, mf:110000, ho:20000, hf:820000}},
    baisse:{l:'Un patrimoine qui baisse', s:{mo:300000, mf:260000, ho:50000, hf:170000}}
  };
  let s = Object.assign({}, EX.cours.s);
  const F = [['mo', 'Madame, au mariage'], ['mf', 'Madame, à la dissolution'], ['ho', 'Monsieur, au mariage'], ['hf', 'Monsieur, à la dissolution']];
  el.innerHTML = `<div class="w w-pa">
    <div class="w-head"><span class="eyebrow">Calculateur</span><b>La créance de participation</b><span class="muted">Patrimoine originaire et final de chacun, en valeur : le calcul se fait tout seul.</span></div>
    <div class="seg-ctrl pa-ex" role="tablist" aria-label="Exemples">${Object.keys(EX).map(k2 => `<button role="tab" aria-selected="false" data-ex="${k2}">${EX[k2].l}</button>`).join('')}</div>
    <div class="pa-in">${F.map(([k2, l]) => `<div class="field"><label for="pa-${k2}">${l} (k€)</label><input id="pa-${k2}" inputmode="numeric" data-k="${k2}"></div>`).join('')}</div>
    <div class="pa-rows"></div>
    <div class="pa-calc">
      <div><span class="eyebrow">Acquêts nets</span><p>Madame <b data-c="a"></b> · Monsieur <b data-c="b"></b></p></div>
      <div><span class="eyebrow">Différence</span><p><b data-c="d"></b></p></div>
      <div class="pa-res"><span class="eyebrow">Créance de participation</span><p class="pa-big"><b data-c="cr"></b></p><p class="pa-who"></p></div>
    </div></div>`;
  const draw = (fromInput) => {
    if (!fromInput) F.forEach(([k2]) => { $('#pa-' + k2, el).value = k(s[k2]); });
    $('.pa-rows', el).innerHTML = rows(s);
    const r = calc(s);
    countTo($('[data-c="a"]', el), r.a, eurN); countTo($('[data-c="b"]', el), r.b, eurN); countTo($('[data-c="d"]', el), r.d, eurN); countTo($('[data-c="cr"]', el), r.cr, eurN, 900);
    const deficit = (s.mf < s.mo || s.hf < s.ho) ? ' Un patrimoine final inférieur à l’originaire ? Ce déficit reste à la charge de cet époux : ses acquêts comptent pour zéro.' : '';
    $('.pa-who', el).innerHTML = `${r.who ? `<span class="pa-arrow ${r.who}">${r.who === 'mme' ? 'Madame → Monsieur' : 'Monsieur → Madame'}</span>` : ''}${verdictTxt(s, r)}${deficit}`;
  };
  el.addEventListener('input', e => { const i = e.target.closest('input[data-k]'); if (!i) return; const v = parseFloat(String(i.value).replace(',', '.').replace(/[^\d.]/g, '')) || 0; s[i.dataset.k] = Math.min(v, 99999) * 1000; draw(true); });
  $('.pa-ex', el).addEventListener('click', e => { const b = e.target.closest('[data-ex]'); if (!b) return; $$('.pa-ex button', el).forEach(x => x.setAttribute('aria-selected', x === b)); s = Object.assign({}, EX[b.dataset.ex].s); draw(); if (!el.__touched){ el.__touched = true; addXP(2, e); } });
  $$('.pa-ex button', el)[0].setAttribute('aria-selected', 'true');
  draw();
});

/* 6. Au décès : que reçoit le conjoint survivant ? (communauté de 600 000 €, dont la maison : 300 000 €) */
JLG.widget('survivant', el => {
  const TOT = 600000, HOUSE = 300000;
  const O = [
    {id:'moitie', l:'Sans clause', pre:0, part:.5, t:'La communauté se partage <b>par moitié</b> : 300 000 € pour le survivant ; l’autre moitié entre dans la succession du défunt.'},
    {id:'preciput', l:'Préciput (la maison)', pre:HOUSE, part:.5, t:'Le survivant prélève d’abord la <b>maison</b> (300 000 €), sans payer, puis le reste se partage par moitié : 450 000 € pour lui.'},
    {id:'inegal', l:'Partage inégal (2/3)', pre:0, part:2 / 3, t:'Le contrat prévoit <b>2/3 pour le survivant</b> : 400 000 €, et 1/3 pour la succession.'},
    {id:'integrale', l:'Attribution intégrale', pre:0, part:1, t:'<b>Toute la communauté</b> va au survivant (en pleine propriété ou en usufruit) : rien n’entre dans la succession avant le second décès.'}
  ];
  const R = 70, C = 2 * Math.PI * R;
  el.innerHTML = `<div class="w w-sv">
    <div class="w-head"><span class="eyebrow">Schéma animé</span><b>Au premier décès, que reçoit le survivant ?</b><span class="muted">Une communauté de 600 000 €, dont la maison (300 000 €). Choisis la clause du contrat.</span></div>
    <div class="seg-ctrl sv-opts" role="tablist" aria-label="Clause">${O.map((x, i) => `<button role="tab" aria-selected="false" data-i="${i}">${x.l}</button>`).join('')}</div>
    <div class="sv-main">
      <svg class="sv-donut" viewBox="0 0 180 180" role="img" aria-label="Part de la communauté qui revient au survivant">
        <circle class="sv-bg" cx="90" cy="90" r="${R}"/>
        <circle class="sv-part" cx="90" cy="90" r="${R}" stroke-dasharray="0 ${C}"/>
        <circle class="sv-pre" cx="90" cy="90" r="${R}" stroke-dasharray="0 ${C}"/>
        <text class="sv-pct" x="90" y="88" text-anchor="middle">0 %</text><text class="sv-cap" x="90" y="108" text-anchor="middle">au survivant</text>
      </svg>
      <ul class="sv-legend">
        <li class="lg-pre"><i></i><span>Prélevé avant partage (préciput)</span><b data-l="pre"></b></li>
        <li class="lg-part"><i></i><span>Part du survivant au partage</span><b data-l="part"></b></li>
        <li class="lg-succ"><i></i><span>Entre dans la succession</span><b data-l="succ"></b></li>
      </ul>
    </div>
    <div class="sv-out" aria-live="polite"></div>
    <p class="w-note">Ces clauses sont des <b>avantages matrimoniaux</b>, pas des donations. Si l’un des époux a des enfants d’une autre union, ceux-ci peuvent agir en retranchement (art. 1527).</p></div>`;
  const show = (i, ev) => {
    const x = O[i]; $$('.sv-opts button', el).forEach(b => b.setAttribute('aria-selected', +b.dataset.i === i));
    const pre = x.pre, part = (TOT - pre) * x.part, succ = TOT - pre - part, surv = pre + part;
    const sp = $('.sv-pre', el), pa = $('.sv-part', el);
    sp.setAttribute('stroke-dasharray', `${pre / TOT * C} ${C}`);
    pa.setAttribute('stroke-dasharray', `${part / TOT * C} ${C}`); pa.setAttribute('stroke-dashoffset', `${-pre / TOT * C}`);
    const pct = $('.sv-pct', el); countTo(pct, Math.round(surv / TOT * 100), v => Math.round(v) + ' %', 800);
    countTo($('[data-l="pre"]', el), pre, eurN); countTo($('[data-l="part"]', el), part, eurN); countTo($('[data-l="succ"]', el), succ, eurN);
    $('.lg-pre', el).classList.toggle('off', !pre);
    $('.sv-out', el).innerHTML = `<div class="w-card"><b class="w-t">Le survivant reçoit ${eurN(surv)}</b><p>${x.t}</p>${x.id === 'moitie' ? '' : '<p class="muted" style="margin-top:6px">Sans compter ses droits d’héritier dans la succession du défunt.</p>'}</div>`;
    if (ev){ el.__seen = el.__seen || new Set(); el.__seen.add(i); if (el.__seen.size === O.length && !el.__done){ el.__done = true; addXP(5, ev); } }
  };
  $('.sv-opts', el).addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) show(+b.dataset.i, e); });
  later(el, () => show(0), 250);
});

/* 7. Le parcours du changement de régime matrimonial (art. 1397) */
JLG.widget('changement', el => {
  let tut = false, opp = false, timer = null;
  const steps = () => [
    ...(tut ? [{k:'tut', t:'L’autorisation du juge', d:'Un époux est sous mesure de protection : il faut l’autorisation préalable du juge des tutelles, ou du conseil de famille.', ic:'scale'}] : []),
    {k:'acte', t:'L’acte notarié', d:'Un acte solennel, en minute, qui contient la liquidation du régime modifié si elle est nécessaire.', ic:'seal'},
    {k:'info', t:'L’information', d:'Les enfants majeurs (et les parties au contrat modifié) : par lettre recommandée ou remise en main propre. Les créanciers : par un avis dans un journal d’annonces légales.', ic:'doc'},
    {k:'trois', t:'Trois mois pour s’opposer', d:'L’opposition se fait par lettre recommandée avec accusé de réception, ou par acte de commissaire de justice.', ic:'clock', timer:true},
    ...(opp ? [
      {k:'homol', t:'L’homologation', d:'Un enfant majeur (ou un créancier) s’est opposé : le tribunal judiciaire doit homologuer le changement, s’il est conforme à l’intérêt de la famille. Avocat obligatoire.', ic:'scale', alt:true},
      {k:'depot', t:'Le dépôt du jugement', d:'Le notaire dresse un second acte : le dépôt du jugement d’homologation au rang de ses minutes.', ic:'pen', alt:true}
    ] : [{k:'notif', t:'La notification à l’état civil', d:'Pas d’opposition : le notaire envoie à l’officier de l’état civil la copie authentique de l’acte et un certificat de non-opposition.', ic:'check'}]),
    {k:'mention', t:'La mention en marge', d:'Le changement est mentionné en marge de l’acte de mariage.', ic:'fiche'},
    {k:'effets', t:'Les effets', d:`Entre les époux : à la date ${opp ? 'du jugement d’homologation' : 'de l’acte'}. À l’égard des tiers : 3 mois après la mention en marge.`, ic:'star'}
  ];
  el.innerHTML = `<div class="w w-cg">
    <div class="w-head"><span class="eyebrow">Schéma animé · art. 1397 C. civ.</span><b>Le parcours d’un changement de régime</b><span class="muted">Coche une situation, puis lance le dossier.</span></div>
    <div class="cg-tgs"><button class="rp-tg" data-t="tut" aria-pressed="false">${icon('shield')}Un époux est sous tutelle</button><button class="rp-tg" data-t="opp" aria-pressed="false">${icon('alert')}Un enfant majeur s’oppose</button></div>
    <ol class="cg-path"></ol>
    <div class="btn-row"><button class="btn btn-sm btn-primary" data-play>${icon('play')}Lancer le dossier</button></div>
    <p class="w-note">Des enfants mineurs ? Depuis la loi du 23 mars 2019, ce n’est plus un cas d’homologation : le notaire peut seulement saisir le juge des tutelles s’il estime leur intérêt menacé.</p></div>`;
  const path = $('.cg-path', el);
  const render = () => {
    const old = new Map($$('.cg-s', path).map(n => [n.dataset.k, n]));
    path.innerHTML = steps().map((s, i) => `<li class="cg-s${s.alt ? ' alt' : ''}${old.has(s.k) ? '' : ' fresh'}" data-k="${s.k}"><span class="cg-dot">${icon(s.ic)}</span><div class="cg-c"><b>${s.t}</b><p>${s.d}</p>${s.timer ? '<div class="cg-timer" aria-hidden="true"><span class="cg-days">J+0</span><span class="cg-bar"><i></i></span><span>J+90</span></div>' : ''}</div></li>`).join('');
  };
  const set = i => { $$('.cg-s', path).forEach((s, k) => { s.classList.toggle('on', k === i); s.classList.toggle('done', k < i); }); };
  const run = i => {
    const all = $$('.cg-s', path); if (i >= all.length || !el.isConnected){ path.classList.add('finished'); return; }
    set(i); const s = all[i]; const r = s.getBoundingClientRect(); if (i && (r.bottom > innerHeight - 90 || r.top < 100)) s.scrollIntoView({block:'center', behavior: reduced() ? 'auto' : 'smooth'});
    let wait = reduced() ? 350 : 1500;
    if (s.dataset.k === 'trois' && !reduced()){
      wait = 2600; const d = $('.cg-days', s), bar = $('.cg-bar i', s), t0 = performance.now();
      (function step(t){ if (!s.isConnected) return; const k = Math.min(1, (t - t0) / 2200); d.textContent = 'J+' + Math.round(k * 90); bar.style.width = k * 100 + '%'; if (k < 1) requestAnimationFrame(step); })(t0);
    }
    timer = setTimeout(() => run(i + 1), wait);
  };
  el.addEventListener('click', e => {
    const t = e.target.closest('.rp-tg');
    if (t){ clearTimeout(timer); if (t.dataset.t === 'tut') tut = !tut; else opp = !opp; t.setAttribute('aria-pressed', t.dataset.t === 'tut' ? tut : opp); path.classList.remove('finished'); render(); set(-1); return; }
    if (e.target.closest('[data-play]')){ clearTimeout(timer); path.classList.remove('finished'); render(); set(-1); later(el, () => run(0), 120); if (!el.__played){ el.__played = true; addXP(3, e); } return; }
    const s = e.target.closest('.cg-s'); if (s){ clearTimeout(timer); set($$('.cg-s', path).indexOf(s)); }
  });
  render(); set(-1);
});


/* =================== SCHÉMAS — IMMOBILIER, SÉANCE 3 : CONDUIRE UN DOSSIER =================== */

/* 1. La table de signature : qui signe, à quel titre — ou défi « qui est qui ? » */
const SG_ROLES = {
  partie:{l:'Partie', c:'Clause « comparution »', d:'L’acte produit ses effets juridiques pour elle.'},
  intervenant:{l:'Intervenant', c:'Clause « intervention »', d:'L’acte ne produit pas d’effets pour lui, mais son accord est nécessaire.'},
  representant:{l:'Représentant', c:'Clause « présence – représentation »', d:'Il signe pour une partie ou un intervenant, sans subir les effets de l’acte.'},
  temoin:{l:'Témoin', c:'Cité seulement s’il est présent', d:'Il est appelé à confirmer l’intention des parties.'},
  notaire:{l:'Notaire', c:'En tête et en clôture de l’acte', d:'L’officier public qui reçoit l’acte : il le lit, recueille les signatures, signe et appose son sceau.'}
};
const SG_SC = [
  {id:'simple', l:'Vente simple', p:[
    {n:'Me Antoine', e:'⚖️', r:'notaire', w:'Il reçoit l’acte et lui donne l’authenticité.'},
    {n:'Matéo', e:'🧑', r:'partie', w:'Le vendeur : il perd la propriété et reçoit le prix.'},
    {n:'Loane', e:'👩', r:'partie', w:'L’acquéreuse : elle devient propriétaire et paie le prix.'}]},
  {id:'logement', l:'Logement de la famille', p:[
    {n:'Me Merieules', e:'⚖️', r:'notaire', w:'Il fait intervenir le conjoint : sans lui, la vente pourrait être annulée.'},
    {n:'Colette', e:'👩', r:'partie', w:'La venderesse : la maison lui appartient en propre.'},
    {n:'Jean-Jacques', e:'🧔', r:'intervenant', w:'Son mari : la maison est le logement de la famille, il consent à la vente (art. 215 al. 3) sans être vendeur.'},
    {n:'Hugo', e:'🧑', r:'partie', w:'L’acquéreur.'}]},
  {id:'tutelle', l:'Vendeur sous tutelle', p:[
    {n:'Me Lucastre', e:'⚖️', r:'notaire', w:'Il vérifie les pouvoirs de la tutrice et l’autorisation du juge.'},
    {n:'Armand', e:'👴', r:'partie', nosign:true, w:'Le vendeur, majeur sous tutelle : la vente le concerne, mais il ne signe pas.'},
    {n:'Juliette', e:'👩', r:'representant', w:'Sa tutrice : elle le représente, en vertu d’une ordonnance du juge des tutelles.'},
    {n:'Inès', e:'👩', r:'partie', w:'L’acquéreuse.'}]},
  {id:'sci', l:'SCI acquéreuse', p:[
    {n:'Me Gustav', e:'⚖️', r:'notaire', w:'Il annexe la délibération qui autorise l’achat.'},
    {n:'Gladys', e:'👩', r:'partie', w:'La venderesse.'},
    {n:'SCI Blanc & Bleu', e:'🏢', r:'partie', nosign:true, f:true, w:'L’acquéreuse : la SCI comparaît, car c’est elle qui devient propriétaire, mais une personne morale ne peut pas signer.'},
    {n:'Marc', e:'🧑', r:'representant', w:'Le gérant : il signe au nom et pour le compte de la SCI, avec la preuve de ses pouvoirs.'}]},
  {id:'absent', l:'Vendeur absent', p:[
    {n:'Me Lucastre', e:'⚖️', r:'notaire', w:'Il vérifie la procuration et l’identité du mandant.'},
    {n:'Matthieu', e:'🧑', r:'partie', nosign:true, w:'Le vendeur, absent le jour J : il a signé une procuration.'},
    {n:'Auguste', e:'🧔', r:'representant', w:'Son mandataire : il signe pour lui, en vertu de la procuration annexée à l’acte.'},
    {n:'Anaïs', e:'👩', r:'partie', w:'L’acquéreuse.'}]},
  {id:'testament', l:'Testament authentique', p:[
    {n:'Me Herckmann', e:'⚖️', r:'notaire', w:'Il reçoit le testament.'},
    {n:'Marie', e:'👵', r:'partie', w:'La testatrice : un acte unilatéral, avec une seule partie.'},
    {n:'Témoin 1', e:'🧑', r:'temoin', w:'Avec un seul notaire, il faut deux témoins (art. 971).'},
    {n:'Témoin 2', e:'👩', r:'temoin', w:'Un second notaire pourrait remplacer les deux témoins.'}]},
  {id:'concours', l:'Deux notaires', p:[
    {n:'Me Lemoine', e:'⚖️', r:'notaire', w:'Le notaire du vendeur.'},
    {n:'Jonas', e:'🧑', r:'partie', w:'Le vendeur, qui garde son notaire habituel.'},
    {n:'Me Fix', e:'⚖️', r:'notaire', w:'Le notaire de l’acquéreuse : deux notaires en concours.'},
    {n:'Suzanne', e:'👩', r:'partie', w:'L’acquéreuse, qui habite loin du bien.'}]}
];
const SG_D = [
  ['Le vendeur d’une maison', 'partie', 'La vente produit ses effets pour lui.'],
  ['L’acquéreur', 'partie', 'Il devient propriétaire : il est partie.'],
  ['Le mari de la venderesse, quand la maison vendue (propre à elle) est le logement de la famille', 'intervenant', 'Il consent à la vente (art. 215 al. 3), sans être vendeur.'],
  ['La mère qui a donné la maison avec une interdiction d’aliéner, et consent à sa vente', 'intervenant', 'La donatrice consent à la vente du bien donné : elle intervient.'],
  ['La sœur du vendeur, héritière réservataire, qui consent à la vente du bien donné', 'intervenant', 'Son consentement écarte toute action en réduction ou en revendication (art. 924-4).'],
  ['La tutrice d’un majeur qui vend son appartement', 'representant', 'Elle représente le majeur protégé.'],
  ['Le gérant de la SCI qui achète', 'representant', 'La SCI comparaît ; son gérant signe pour elle.'],
  ['L’ami qui signe pour le vendeur absent, avec une procuration', 'representant', 'C’est le mandataire : il représente le vendeur.'],
  ['Les parents d’un mineur qui vend un bien hérité', 'representant', 'Ils représentent leur enfant mineur.'],
  ['Les deux personnes présentes à la lecture d’un testament authentique', 'temoin', 'Avec un seul notaire, deux témoins (art. 971).'],
  ['La personne de confiance qui accompagne un acheteur malvoyant', 'temoin', 'Elle est témoin à l’acte.'],
  ['Les personnes qui attestent la possession d’état dans un acte de notoriété', 'temoin', 'Ce sont des témoins.'],
  ['L’officier public qui lit l’acte et appose son sceau', 'notaire', 'C’est le notaire instrumentaire.'],
  ['Le second notaire qui remplace deux témoins', 'notaire', 'Un second notaire peut remplacer deux témoins.'],
  ['Le donataire qui reçoit une donation', 'partie', 'La donation produit ses effets pour lui.'],
  ['L’épouse covendeuse d’une maison commune', 'partie', 'Bien commun : elle vend aussi (art. 1424), elle est partie.']
];
const SIGN_SVG = '<svg class="sg-sig" viewBox="0 0 120 30" aria-hidden="true"><path d="M4 22c8-14 14-16 16-8s-2 12 4 4 10-16 14-6-4 10 4 2 8-10 12-2 4 6 10 0 12-8 16-4 8 6 14 2 10-6 20-4"/></svg>';
JLG.widget('signataires', (el, o) => {
  const roleTag = r => `<span class="sg-role r-${r}">${SG_ROLES[r].l}</span>`;
  if (o.mode === 'defi'){
    const N = 8; let list = [], k = 0, score = 0, lock = false;
    const start = () => { list = shuffle(SG_D).slice(0, N); k = 0; score = 0; draw(); };
    const draw = () => {
      if (k >= list.length) return end();
      lock = false; const it = list[k];
      el.innerHTML = `<div class="w w-sg defi"><div class="w-head"><span class="eyebrow">Défi · ${k + 1}/${list.length} · ${score} ✓</span><b class="sg-q">${it[0]}</b><span class="muted">À quel titre signe-t-il (ou elle) l’acte ?</span></div>
        <div class="sg-pick">${Object.keys(SG_ROLES).map(r => `<button class="sg-role-btn r-${r}" data-r="${r}">${SG_ROLES[r].l}</button>`).join('')}</div><div class="sg-fb" aria-live="polite"></div></div>`;
      $('.sg-pick', el).addEventListener('click', e => {
        const b = e.target.closest('[data-r]'); if (!b || lock) return; lock = true;
        const ok = b.dataset.r === it[1]; if (ok){ score++; addXP(5, e); }
        $$('.sg-pick button', el).forEach(x => { x.disabled = true; if (x.dataset.r === it[1]) x.classList.add('got'); else if (x === b) x.classList.add('nope'); });
        $('.sg-fb', el).innerHTML = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? pick(['Exact.', 'Oui !', 'Bien vu.']) : 'Non : ' + SG_ROLES[it[1]].l.toLowerCase()}</div><p>${it[2]} ${SG_ROLES[it[1]].d}</p></div><div class="qnext"><button class="btn btn-primary" id="sgn">${k + 1 < list.length ? 'Suivant' : 'Résultat'}${icon('arrow')}</button></div>`;
        const n = $('#sgn', el); n.focus({preventScroll:true}); n.onclick = () => { k++; draw(); };
      });
    };
    const end = () => { const p = score / list.length; if (p >= .8) confetti(90); addXP(10, {target:el}); el.innerHTML = `<div class="result"><div class="eyebrow">Qui est qui à la signature ?</div><h2>${score}/${list.length} bonnes réponses</h2><p class="muted">${p === 1 ? 'Tu reconnais chaque signataire au premier coup d’œil.' : 'Une question : l’acte produit-il des effets pour lui ? Si oui, partie ; sinon, intervenant, représentant ou témoin.'}</p><div class="btn-row" style="justify-content:center"><button class="btn btn-primary" id="sgr">${icon('refresh')}Rejouer</button></div></div>`; $('#sgr', el).onclick = start; };
    return start();
  }

  let sc = 0, sel = -1, timer = null;
  el.innerHTML = `<div class="w w-sg">
    <div class="w-head"><span class="eyebrow">Schéma animé</span><b>La table de signature</b><span class="muted">Choisis un dossier : chacun prend sa place. Touche une personne, puis lance la signature.</span></div>
    <div class="seg-ctrl sg-sc" role="tablist" aria-label="Dossier">${SG_SC.map((s, i) => `<button role="tab" aria-selected="false" data-i="${i}">${s.l}</button>`).join('')}</div>
    <div class="sg-room"><div class="sg-table" aria-hidden="true"><span class="sg-doc">${icon('doc')}<b>L’acte</b><em class="sg-count">0 signature</em></span><span class="sg-stamp">${sealSVG({ring:false})}</span></div><div class="sg-seats"></div></div>
    <div class="sg-legend">${Object.keys(SG_ROLES).map(roleTag).join('')}</div>
    <div class="btn-row"><button class="btn btn-sm btn-primary" data-play>${icon('pen')}Passer à la signature</button></div>
    <div class="sg-out" aria-live="polite"></div></div>`;
  const room = $('.sg-room', el), seats = $('.sg-seats', el);
  const layout = () => {
    const P = SG_SC[sc].p, n = P.length;
    seats.innerHTML = P.map((p, i) => { const a = (-90 + i * 360 / n) * Math.PI / 180; const x = 50 + 35 * Math.cos(a), y = 50 + 36 * Math.sin(a);
      return `<button class="sg-seat r-${p.r}${p.nosign ? ' nosign' : ''}" data-i="${i}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;animation-delay:${i * 90}ms"><span class="sg-av" aria-hidden="true">${p.e}</span><b>${p.n}</b>${roleTag(p.r)}${SIGN_SVG}</button>`; }).join('');
    room.classList.remove('signed'); $('.sg-count', el).textContent = '0 signature';
  };
  const explain = i => {
    sel = i; $$('.sg-seat', el).forEach((s, k) => s.classList.toggle('sel', k === i));
    if (i < 0){ $('.sg-out', el).innerHTML = ''; return; }
    const p = SG_SC[sc].p[i], r = SG_ROLES[p.r];
    $('.sg-out', el).innerHTML = `<div class="w-card"><b class="w-t">${p.e} ${p.n} ${roleTag(p.r)}</b><p>${p.w}</p><p class="muted" style="margin-top:6px">${r.d} ${r.c}.${p.nosign ? ` <b>Ne signe pas</b> : quelqu’un signe pour ${p.f ? 'elle' : 'lui'}.` : ''}</p></div>`;
  };
  const setSc = i => { clearTimeout(timer); sc = i; $$('.sg-sc button', el).forEach(b => b.setAttribute('aria-selected', +b.dataset.i === i)); layout(); explain(-1); };
  const sign = ev => {
    clearTimeout(timer); room.classList.remove('signed'); const P = SG_SC[sc].p;
    const order = P.map((p, i) => i).filter(i => !P[i].nosign && P[i].r !== 'notaire').concat(P.map((p, i) => i).filter(i => P[i].r === 'notaire'));
    $$('.sg-seat', el).forEach(s => s.classList.remove('signing', 'did'));
    let k = 0;
    const step = () => {
      if (!el.isConnected) return;
      if (k >= order.length){ room.classList.add('signed'); $('.sg-count', el).textContent = 'Dont acte'; return; }
      const s = $(`.sg-seat[data-i="${order[k]}"]`, el); s.classList.add('signing');
      later(el, () => { s.classList.remove('signing'); s.classList.add('did'); }, 750);
      k++; $('.sg-count', el).textContent = plural(k, 'signature');
      timer = setTimeout(step, reduced() ? 120 : 850);
    };
    step(); if (!el.__played){ el.__played = true; addXP(3, ev); }
  };
  $('.sg-sc', el).addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) setSc(+b.dataset.i); });
  seats.addEventListener('click', e => { const s = e.target.closest('.sg-seat'); if (s) explain(+s.dataset.i); });
  $('[data-play]', el).addEventListener('click', sign);
  setSc(1);
});

/* 2. La comparution : générateur avec les 6 mentions du décret de 1955 — ou défi « le SPF rejette » */
const CP_PRESETS = {
  celib:{civ:'M', prenoms:'Matéo, Lucas', nom:'PETITJEAN', pro:'sans emploi', ville:'Château-Salins', cp:'57170', adr:'1 rue des Eglantines', nville:'Nancy', ncp:'54000', ndate:'1998-01-08'},
  pacs:{civ:'F', prenoms:'Loane, Maeva', nom:'KIMI', pro:'cheffe d’entreprise', ville:'Montreuil', cp:'93100', adr:'14 avenue Lafayette', nville:'Bordeaux', ncp:'33000', ndate:'1999-09-19', cciv:'M', cprenoms:'Jules Aloïs', cnom:'DARMOISE', pnot:'ANTOINE', pville:'Paris', pdate:'2020-10-14'},
  legal:{civ:'F', prenoms:'Maellys, Lisa', nom:'LINDT', pro:'aide-soignante', ville:'Paris', cp:'75018', adr:'1 bis rond-point des Faïenceries', nville:'Metz', ncp:'57000', ndate:'2001-12-20', cciv:'M', cprenoms:'Kenzo', cnom:'PONTON', mville:'Toul', mdep:'Meurthe-et-Moselle', mdate:'2024-05-30'},
  contrat:{civ:'F', prenoms:'Suzanne Marlise', nom:'FIX', pro:'infirmière', ville:'Strasbourg', cp:'67000', adr:'4 ter rue de la Petite France', nville:'Lubécourt', ncp:'57170', ndate:'1972-06-12', cciv:'F', cprenoms:'Delphine Jeanne Marguerite', cnom:'TOUSSAINT', regime:'séparation de biens', knot:'GUSTAV', kville:'Strasbourg', kdate:'2012-06-21', mville:'Amelécourt', mdep:'Moselle', mdate:'2012-07-14'},
  divorce:{civ:'M', prenoms:'Sébastien Michel Roger', nom:'LEGRAND', pro:'directeur financier', ville:'Charmes', cp:'88130', adr:'4 route de la Pinède', nville:'Essey-lès-Nancy', ncp:'54270', ndate:'1948-07-08', cciv:'F', cprenoms:'Lucie Romane', cnom:'AVELANGE', tville:'Épinal', tdep:'Vosges', tdate:'2021-05-02'},
  veuf:{civ:'M', prenoms:'Jonas, Charles, Jean-Michel', nom:'LEMOINE', pro:'professeur des écoles', ville:'Charleville-Mézières', cp:'08000', adr:'14 bis rue des Eperviers', nville:'Sedan', ncp:'08200', ndate:'1964-08-27', cciv:'M', cprenoms:'Paul Émile', cnom:'VICTOR', ddate:'2023-03-01'}
};
const CP_SIT = [['celib', 'Célibataire'], ['pacs', 'Pacsé(e)'], ['legal', 'Marié(e) sans contrat'], ['contrat', 'Marié(e) avec contrat'], ['divorce', 'Divorcé(e)'], ['veuf', 'Veuf, veuve']];
const CP_F = {
  base:[['prenoms', 'Prénoms, dans l’ordre'], ['nom', 'Nom'], ['pro', 'Profession'], ['ville', 'Ville du domicile'], ['cp', 'Code postal'], ['adr', 'Adresse'], ['nville', 'Ville de naissance'], ['ncp', 'Code postal de naissance'], ['ndate', 'Date de naissance', 'date']],
  conj:[['cprenoms', 'Prénoms du conjoint'], ['cnom', 'Nom du conjoint']],
  pacs:[['pnot', 'PACS reçu par Maître'], ['pville', 'Notaire à'], ['pdate', 'Date du PACS', 'date']],
  mar:[['mville', 'Mariage à la mairie de'], ['mdep', 'Département'], ['mdate', 'Date du mariage', 'date']],
  contrat:[['knot', 'Contrat reçu par Maître'], ['kville', 'Notaire à'], ['kdate', 'Date du contrat', 'date']],
  divorce:[['tville', 'Tribunal judiciaire de'], ['tdep', 'Département'], ['tdate', 'Date du jugement', 'date']],
  veuf:[['ddate', 'Date du décès du conjoint', 'date']]
};
const CP_D = [
  [['x', 'Monsieur'], ['pre', ' Matéo, Lucas'], ['nom', ' PETITJEAN'], ['x', ', '], ['pro', 'sans emploi, '], ['dom', 'Demeurant à CHATEAU-SALINS (57170), 1 rue des Eglantines, '], ['nai', 'Né à NANCY (54000) le 8 janvier 1998, '], ['x', 'Célibataire majeur non soumis à un pacte civil de solidarité, De nationalité française, Résident au sens de la réglementation fiscale.']],
  [['x', 'Madame'], ['pre', ' Maellys, Lisa'], ['nom', ' LINDT'], ['x', ', '], ['pro', 'aide-soignante, '], ['dom', 'Demeurant à PARIS (75018), 1 bis rond-point des Faïenceries, '], ['nai', 'Née à METZ (57000) le 20 décembre 2001, '], ['cj', 'Épouse de Monsieur Kenzo PONTON et soumise', 'Mariée et soumise'], ['x', ' au régime légal de la communauté réduite aux acquêts à défaut de contrat de mariage préalable à leur union célébrée à la mairie de TOUL (Meurthe-et-Moselle), le 30 mai 2024, ce régime n’ayant subi ni changement ni modification depuis, De nationalité française, Résidente au sens de la réglementation fiscale.']],
  [['x', 'Madame'], ['pre', ' Suzanne Marlise'], ['nom', ' FIX'], ['x', ', '], ['pro', 'infirmière, '], ['dom', 'Demeurant à STRASBOURG (67000), 4 ter rue de la Petite France, '], ['nai', 'Née à LUBECOURT (57170) le 12 juin 1972, '], ['cj', 'Épouse de Madame Delphine Jeanne Marguerite TOUSSAINT et soumise', 'Mariée et soumise'], ['x', ' au régime de la séparation de biens aux termes de leur contrat de mariage reçu par Maître GUSTAV, notaire à STRASBOURG (Bas-Rhin), le 21 juin 2012, préalablement à leur union célébrée à la mairie d’AMELECOURT (Moselle) le 14 juillet 2012, De nationalité française, Résidente au sens de la réglementation fiscale.']],
  [['x', 'Monsieur'], ['pre', ' Sébastien Michel Roger'], ['nom', ' LEGRAND'], ['x', ', '], ['pro', 'directeur financier, '], ['dom', 'Demeurant à CHARMES (88130), 4 route de la Pinède, '], ['nai', 'Né à ESSEY-LES-NANCY (54270) le 8 juillet 1948, '], ['x', 'Divorcé en premières noces de Madame Lucie Romane AVELANGE suivant jugement rendu par le tribunal judiciaire d’EPINAL (Vosges) en date du 2 mai 2021 et ayant acquis force de chose jugée, Non remarié depuis et non soumis à un pacte civil de solidarité, De nationalité française, Résident au sens de la réglementation fiscale.']],
  [['x', 'Madame'], ['pre', ' Loane, Maeva'], ['nom', ' KIMI'], ['x', ', '], ['pro', 'cheffe d’entreprise, '], ['dom', 'Demeurant à MONTREUIL (93100), 14 avenue Lafayette, '], ['nai', 'Née à BORDEAUX (33000) le 19 septembre 1999, '], ['x', 'Célibataire majeure partenaire de Monsieur Jules Aloïs DARMOISE, aux termes d’un pacte civil de solidarité reçu par Maître ANTOINE, notaire à PARIS, le 14 octobre 2020, enregistré le même jour, De nationalité française, Résidente au sens de la réglementation fiscale.']]
];
const CP_K = {pre:'Les prénoms', nom:'Le nom', pro:'La profession', dom:'Le domicile', nai:'La date et le lieu de naissance', cj:'Le nom du conjoint'};
JLG.widget('comparution', (el, o) => {
  if (o.mode === 'defi'){
    const N = 6; let k = 0, score = 0, lock = false, cur = null;
    const draw = () => {
      if (k >= N) return end();
      lock = false;
      const m = CP_D[Math.floor(Math.random() * CP_D.length)], keys = m.filter(s => CP_K[s[0]]).map(s => s[0]), miss = pick(keys);
      cur = {m, miss};
      el.innerHTML = `<div class="w w-cp defi"><div class="w-head"><span class="eyebrow">Défi · ${k + 1}/${N} · ${score} ✓</span><b>Le SPF rejette la formalité !</b><span class="muted">Une mention exigée par le décret du 4 janvier 1955 manque dans cette comparution. Laquelle ?</span></div>
        <article class="acte-paper cp-out"><div class="ap-h">Comparution</div><p>${m.map(s => s[0] === miss ? (s[2] || '') : s[1]).join('')}</p></article>
        <div class="q-ans cp-pick">${Object.keys(CP_K).map(kk => `<button class="btn" data-k="${kk}">${CP_K[kk]}</button>`).join('')}</div><div class="cp-fb" aria-live="polite"></div></div>`;
      $('.cp-pick', el).addEventListener('click', e => {
        const b = e.target.closest('[data-k]'); if (!b || lock) return; lock = true;
        const ok = b.dataset.k === cur.miss; if (ok){ score++; addXP(6, e); }
        $$('.cp-pick button', el).forEach(x => { x.disabled = true; if (x.dataset.k === cur.miss) x.classList.add('btn-primary'); });
        $('.cp-out p', el).innerHTML = cur.m.map(s => s[0] === cur.miss ? `${s[1].match(/^\s*/)[0]}<ins>${s[1].trim()}</ins>${s[1].match(/\s*$/)[0]}` : s[1]).join('');
        $('.cp-fb', el).innerHTML = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Bien vu !' : 'Non : ' + CP_K[cur.miss].toLowerCase()}</div><p>Pour être publiée, la comparution d’une personne physique doit contenir le nom, les prénoms dans l’ordre de l’état civil, le domicile, la date et le lieu de naissance, la profession et le nom du conjoint (décret de 1955, art. 5). Sinon, le SPF rejette la formalité.</p></div><div class="qnext"><button class="btn btn-primary" id="cpn">${k + 1 < N ? 'Suivante' : 'Résultat'}${icon('arrow')}</button></div>`;
        $('#cpn', el).onclick = () => { k++; draw(); };
      });
    };
    const end = () => { if (score >= 5) confetti(90); addXP(10, {target:el}); el.innerHTML = `<div class="result"><div class="eyebrow">Le SPF rejette !</div><h2>${score}/${N} mentions retrouvées</h2><p class="muted">Les six mentions : nom, prénoms dans l’ordre, domicile, naissance (date et lieu), profession, nom du conjoint.</p><div class="btn-row" style="justify-content:center"><button class="btn btn-primary" id="cpr">${icon('refresh')}Rejouer</button></div></div>`; $('#cpr', el).onclick = () => { k = 0; score = 0; draw(); }; };
    return draw();
  }

  let sit = 'legal', d = Object.assign({}, CP_PRESETS.legal, {nat:'française', res:true, regime:CP_PRESETS.contrat.regime});
  el.innerHTML = `<div class="w w-cp">
    <div class="w-head"><span class="eyebrow">Générateur</span><b>Rédige une comparution</b><span class="muted">Choisis la situation (les modèles de ton cours sont pré-remplis), modifie les champs : la clause s’écrit, et le SPF vérifie les six mentions.</span></div>
    <div class="cp-top">
      <div class="seg-ctrl cp-civ" role="tablist" aria-label="Civilité"><button role="tab" data-civ="M">Monsieur</button><button role="tab" data-civ="F">Madame</button></div>
      <div class="field"><label for="cp-sit">Situation</label><select id="cp-sit">${CP_SIT.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
    </div>
    <div class="cp-fields"></div>
    <div class="cp-res">
      <article class="acte-paper cp-out hl-on-idt hl-on-pro hl-on-dom hl-on-nai hl-on-civ hl-on-fis"></article>
      <div class="cp-check"><span class="eyebrow">Le contrôle du SPF · décret 1955, art. 5</span><ul></ul><div class="cp-stamp" aria-live="polite"></div></div>
    </div>
    <div class="btn-row"><button class="btn btn-sm" data-copy>${icon('copy')}Copier la clause</button></div></div>`;
  const fieldsFor = () => [...CP_F.base, ...(sit === 'celib' ? [] : CP_F.conj), ...(sit === 'pacs' ? CP_F.pacs : []), ...(sit === 'legal' || sit === 'contrat' ? CP_F.mar : []), ...(sit === 'contrat' ? CP_F.contrat : []), ...(sit === 'divorce' ? CP_F.divorce : []), ...(sit === 'veuf' ? CP_F.veuf : [])];
  const renderFields = () => {
    $('.cp-fields', el).innerHTML = fieldsFor().map(([k, l, t]) => `<div class="field"><label for="cp-${k}">${l}</label><input id="cp-${k}" data-k="${k}" ${t === 'date' ? 'type="date"' : 'type="text" autocomplete="off"'} value="${esc(d[k] || '')}"></div>`).join('')
      + (sit === 'celib' ? '' : `<div class="field"><label for="cp-cciv">Le conjoint est</label><select id="cp-cciv" data-k="cciv"><option value="M"${d.cciv === 'M' ? ' selected' : ''}>Monsieur</option><option value="F"${d.cciv === 'F' ? ' selected' : ''}>Madame</option></select></div>`)
      + (sit === 'contrat' ? `<div class="field"><label for="cp-regime">Régime choisi</label><select id="cp-regime" data-k="regime">${['séparation de biens', 'communauté universelle', 'participation aux acquêts', 'communauté de biens meubles et acquêts'].map(r => `<option${d.regime === r ? ' selected' : ''}>${r}</option>`).join('')}</select></div>` : '')
      + `<div class="field"><label for="cp-nat">Nationalité</label><input id="cp-nat" data-k="nat" type="text" value="${esc(d.nat)}"></div><label class="cp-res-tg"><input type="checkbox" data-k="res"${d.res ? ' checked' : ''}> Résident(e) au sens de la réglementation fiscale</label>`;
  };
  const text = () => {
    const F = d.civ === 'F', g = (m, f) => F ? f : m, cF = d.cciv === 'F', civL = c => c === 'F' ? 'Madame' : 'Monsieur';
    const up = s => String(s || '').trim().toUpperCase(), v = s => String(s || '').trim();
    const sp = (cls, h) => h ? `<span class="m-${cls}">${h}</span>` : '';
    const conj = `${civL(d.cciv)} ${esc(v(d.cprenoms))} ${esc(up(d.cnom))}`.replace(/\s+/g, ' ').trim();
    const old = sit === 'legal' && d.mdate && d.mdate < '1966-02-01';
    let civ = '';
    if (sit === 'celib') civ = `Célibataire ${g('majeur', 'majeure')} non ${g('soumis', 'soumise')} à un pacte civil de solidarité`;
    else if (sit === 'pacs') civ = `Célibataire ${g('majeur', 'majeure')} partenaire de ${conj}, aux termes d’un pacte civil de solidarité reçu par Maître ${esc(up(d.pnot))}, notaire à ${esc(up(d.pville))}, le ${frDate(d.pdate)}, enregistré le même jour`;
    else if (sit === 'legal') civ = `${g('Époux', 'Épouse')} de ${conj} et ${g('soumis', 'soumise')} au régime légal de la ${old ? 'communauté de biens meubles et acquêts' : 'communauté réduite aux acquêts'} à défaut de contrat de mariage préalable à leur union célébrée à la mairie de ${esc(up(d.mville))} (${esc(v(d.mdep))}), le ${frDate(d.mdate)}, ce régime n’ayant subi ni changement ni modification depuis`;
    else if (sit === 'contrat') civ = `${g('Époux', 'Épouse')} de ${conj} et ${g('soumis', 'soumise')} au régime de la ${esc(d.regime)} aux termes de leur contrat de mariage reçu par Maître ${esc(up(d.knot))}, notaire à ${esc(up(d.kville))}, le ${frDate(d.kdate)}, préalablement à leur union célébrée à la mairie de ${esc(up(d.mville))} (${esc(v(d.mdep))}), le ${frDate(d.mdate)}, ce régime n’ayant subi ni changement ni modification depuis`;
    else if (sit === 'divorce') civ = `${g('Divorcé', 'Divorcée')} en premières noces de ${conj} suivant jugement rendu par le tribunal judiciaire de ${esc(up(d.tville))} (${esc(v(d.tdep))}) en date du ${frDate(d.tdate)} et ayant acquis force de chose jugée, Non ${g('remarié', 'remariée')} depuis et non ${g('soumis', 'soumise')} à un pacte civil de solidarité`;
    else civ = `${g('Veuf', 'Veuve')} de ${conj}, ${cF ? 'décédée' : 'décédé'} le ${frDate(d.ddate)}, Non ${g('remarié', 'remariée')} depuis et non ${g('soumis', 'soumise')} à un pacte civil de solidarité`;
    const idt = `${civL(d.civ)} ${esc(v(d.prenoms))} ${esc(up(d.nom))}`.replace(/\s+/g, ' ').trim();
    return {old, html:`<div class="ap-h">Comparution</div><p>${sp('idt', idt)}${v(d.pro) ? ', ' + sp('pro', esc(v(d.pro))) : ''},<br>${sp('dom', `Demeurant à ${esc(up(d.ville))} (${esc(v(d.cp))}), ${esc(v(d.adr))}`)},<br>${sp('nai', `${g('Né', 'Née')} à ${esc(up(d.nville))} (${esc(v(d.ncp))}) le ${frDate(d.ndate)}`)},<br>${sp('civ', civ)},<br>${sp('fis', `De nationalité ${esc(v(d.nat))}, ${d.res ? g('Résident', 'Résidente') : g('Non résident', 'Non résidente')} au sens de la réglementation fiscale`)}.</p>`};
  };
  let wasOk = null;
  const draw = () => {
    $$('.cp-civ button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.civ === d.civ));
    const t = text(); $('.cp-out', el).innerHTML = t.html + (t.old ? '<p class="cp-note">Mariés avant le 1er février 1966 sans contrat : le régime légal était la communauté de biens meubles et acquêts.</p>' : '');
    const has = k => !!String(d[k] || '').trim();
    const C = [['Nom', has('nom')], ['Prénoms, dans l’ordre de l’état civil', has('prenoms')], ['Domicile', has('ville') && has('adr')], ['Date et lieu de naissance', has('ndate') && has('nville')], ['Profession', has('pro')], ['Nom du conjoint', sit === 'celib' ? null : has('cnom')]];
    $('.cp-check ul', el).innerHTML = C.map(([l, ok]) => `<li class="${ok === null ? 'na' : ok ? 'ok' : 'ko'}"><i aria-hidden="true">${ok === null ? '–' : ok ? '✓' : '✗'}</i>${l}${ok === null ? ' <span class="muted">(sans objet : célibataire)</span>' : ''}</li>`).join('');
    const miss = C.filter(c => c[1] === false).map(c => c[0].split(',')[0].toLowerCase());
    const ok = !miss.length;
    $('.cp-stamp', el).innerHTML = `<span class="cp-st ${ok ? 'ok' : 'ko'}${ok !== wasOk ? ' pop' : ''}">${ok ? 'Publiable' : 'Rejet du SPF'}</span><p>${ok ? 'Toutes les mentions exigées sont là.' : 'Il manque : ' + miss.join(', ') + '.'}</p>`;
    wasOk = ok;
  };
  const useSit = s => { sit = s; d = Object.assign({}, CP_PRESETS[s], {nat:d.nat || 'française', res:d.res !== false, regime:CP_PRESETS[s].regime || d.regime || 'séparation de biens'}); $('#cp-sit', el).value = s; renderFields(); draw(); };
  $('#cp-sit', el).addEventListener('change', e => { useSit(e.target.value); if (!el.__touched){ el.__touched = true; addXP(2, e); } });
  $('.cp-civ', el).addEventListener('click', e => { const b = e.target.closest('[data-civ]'); if (!b) return; d.civ = b.dataset.civ; draw(); });
  el.addEventListener('input', e => { const i = e.target.closest('[data-k]'); if (!i || !e.target.closest('.cp-fields')) return; d[i.dataset.k] = i.type === 'checkbox' ? i.checked : i.value; draw(); });
  el.addEventListener('change', e => { const i = e.target.closest('select[data-k], input[type=checkbox][data-k]'); if (!i || !e.target.closest('.cp-fields')) return; d[i.dataset.k] = i.type === 'checkbox' ? i.checked : i.value; draw(); });
  $('[data-copy]', el).addEventListener('click', e => copyText($('.cp-out', el).innerText, e.target.closest('button')));
  useSit('legal');
});

/* 3. Quelle procuration ? L’arbre du parallélisme des formes */
JLG.widget('procuration', el => {
  const SSP = 'Monsieur Matthieu MORREAU, non présent ce jour, est représenté par Monsieur Auguste LEFOLL, en vertu d’une procuration sous signature privée conclue à MOULINS (Moselle) le 15 août 2024, et dont l’original est demeuré annexé aux présentes.';
  const Q = {
    q0:{q:'Qui ne pourra pas signer lui-même le jour de l’acte ?', a:[['Une personne absente ce jour-là', 'q1'], ['Un mineur, ou un majeur sous tutelle ou curatelle', 'rInc'], ['Une société, une association', 'rPm'], ['Personne : tout le monde sera là', 'rPres']]},
    q1:{q:'L’acte à signer est-il solennel, c’est-à-dire authentique pour sa validité ?', a:[['Oui : une hypothèque, une VEFA, une donation', 'rAuth'], ['Non : une vente, authentique pour la publicité foncière', 'q2']]},
    q2:{q:'Comment le notaire vérifiera-t-il l’identité de l’absent ?', a:[['Il passe à l’étude signer sa procuration', 'rEtude'], ['Il habite tout près, mais ne peut pas se déplacer', 'rDepl'], ['Il habite loin, ou à l’étranger', 'rLoin']]}
  };
  const R = {
    rPres:{t:'Une clause de présence', d:'Chacun est là : l’acte indique simplement qui est présent.', cl:'Monsieur Jules VERNET est ici présent.<br>Madame Gladys MONRUPT est ici présente.'},
    rInc:{t:'Pas de procuration : le représentant légal', d:'Un incapable ne donne pas de procuration : il est représenté (mineur, majeur sous tutelle) ou assisté (majeur sous curatelle, qui signe avec son curateur). Le notaire vérifie les pouvoirs du représentant et, si besoin, l’autorisation du conseil de famille ou du juge des tutelles.', cl:'Monsieur Armand VAUTRIN est représenté par Madame Juliette CHONE, sa tutrice, ayant tous pouvoirs à l’effet des présentes aux termes d’une ordonnance rendue par Monsieur le juge des tutelles de REIMS (51000) en date du 3 juin 2019.'},
    rPm:{t:'Le représentant de la personne morale', d:'La personne morale comparaît, mais c’est une personne physique ayant le pouvoir d’agir pour elle qui signe (gérant, président), avec la preuve de ses pouvoirs annexée à l’acte.', cl:'La SELARL BATIPRO est représentée par Monsieur Marc AUDEMONT, demeurant à ALBI (81000), 14 b rue des Tulipes, agissant en qualité de gérant, et ayant tous pouvoirs à l’effet des présentes en vertu d’une délibération de l’assemblée générale en date du 1er juillet 2024 dont une copie certifiée conforme est demeurée jointe et annexée au présent acte.'},
    rAuth:{t:'Procuration authentique obligatoire', d:'Parallélisme des formes : l’acte est solennel, la procuration doit être reçue par un notaire, sous peine de nullité. L’absent la signe chez un notaire (sa procuration en brevet sera annexée à l’acte), ou à distance, par visioconférence, depuis le décret du 20 novembre 2020.', cl:'Madame Anaïs DUPRE est non présente ce jour mais représentée par Monsieur Jacques CONRAD, en vertu d’une procuration reçue par Maître LUCASTRE, notaire à TOMBLAINE (Meurthe-et-Moselle), le 4 avril 2024, et dont le brevet est demeuré annexé au présent acte.'},
    rEtude:{t:'Procuration sous signature privée, signée à l’étude', d:'La vente n’est authentique que pour la publicité foncière : une procuration sous signature privée suffit. En la faisant signer à l’étude, le notaire vérifie lui-même l’identité du mandant.', cl:SSP},
    rDepl:{t:'Procuration sous signature privée : le notaire se déplace', d:'Le mandant ne peut pas venir mais habite à proximité : le notaire se rend chez lui, lui fait signer la procuration et vérifie son identité.', cl:SSP},
    rLoin:{t:'Procuration sous signature privée, signature certifiée', d:'Le mandant fait certifier sa signature en mairie, dans un commissariat, au consulat ou chez un autre notaire : c’est cette autorité qui vérifie son identité. (La procuration notariée à distance est aussi possible.)', cl:SSP}
  };
  let path = [];
  el.innerHTML = `<div class="w w-qual w-pc">
    <div class="w-head"><span class="eyebrow">Arbre de décision</span><b>Quelle procuration pour l’absent ?</b><span class="muted">Réponds comme le notaire qui prépare la signature.</span></div>
    <ol class="q-path"></ol><div class="q-box" aria-live="polite"></div></div>`;
  const box = $('.q-box', el), pth = $('.q-path', el);
  const render = node => {
    pth.innerHTML = path.map((p, i) => `<li style="animation-delay:${i * 40}ms"><span class="muted">${Q[p.n].q}</span><b>${p.a}</b></li>`).join('');
    if (R[node]){
      const r = R[node];
      box.innerHTML = `<div class="w-card q-res pc-res"><span class="eyebrow">Réponse</span><b class="w-t">${r.t}</b><p>${r.d}</p><article class="acte-paper pc-paper"><div class="ap-h">${node === 'rPres' ? 'Présence' : 'Représentation'}</div><p>${r.cl}</p></article><div class="btn-row" style="margin-top:12px"><button class="btn btn-sm btn-primary" data-restart>${icon('refresh')}Une autre situation</button></div></div>`;
      $('[data-restart]', box).onclick = () => { path = []; render('q0'); };
      el.__seen = el.__seen || new Set(); el.__seen.add(node); if (el.__seen.size >= 4 && !el.__done){ el.__done = true; addXP(6, {target:box}); }
      return;
    }
    const q = Q[node];
    box.innerHTML = `<div class="w-card pc-q"><b class="w-t">${q.q}</b><div class="q-ans">${q.a.map((a, i) => `<button class="btn" data-i="${i}">${a[0]}</button>`).join('')}</div></div>`;
    $$('[data-i]', box).forEach(b => b.onclick = () => { const a = q.a[+b.dataset.i]; path.push({n:node, a:a[0]}); render(a[1]); });
  };
  render('q0');
});

/* 4. Qui doit intervenir à l’acte ? Simulateur — ou défi */
JLG.widget('intervenants', (el, o) => {
  const decide = s => {
    const comp = [{w:'Colette', r:'Venderesse', why:'Elle vend : la vente produit ses effets pour elle.'}], inter = [], notes = [];
    const commun = s.statut === 'marie' && s.regime === 'communaute' && s.nature === 'commun' && !s.donation;
    if (s.statut === 'marie'){
      if (commun) comp.push({w:'Jean-Jacques, son époux', r:'Covendeur', why:'Le bien est commun : des époux communs en biens ne peuvent vendre un immeuble commun l’un sans l’autre (art. 1424). Il est partie, pas intervenant.'});
      else if (s.logement) inter.push({w:'Jean-Jacques, son époux', r:'Intervenant', why:'Le bien appartient à Colette seule, mais c’est le logement de la famille : son époux consent à la vente (art. 215 al. 3), sans prendre la qualité de covendeur.'});
      else notes.push(s.regime === 'separation' ? 'Séparation de biens et pas de logement familial : l’époux n’a pas à signer.' : 'Bien propre qui n’est pas le logement de la famille : Colette vend seule.');
    } else if (s.logement) notes.push(s.statut === 'pacse' ? 'Pacsée : l’article 215 ne protège que les époux. Son partenaire n’a pas à intervenir pour un logement qui ne lui appartient pas.' : 'Célibataire : aucune protection du logement familial à respecter.');
    comp.push({w:'Hugo', r:'Acquéreur', why:'Il devient propriétaire.'});
    if (s.donation){
      if (s.deja) notes.push('L’acte de donation contient déjà le consentement du donateur et des réservataires à une vente : aucune intervention de leur part (art. 924-4 al. 2).');
      else if (s.donateur === 'vivant'){
        inter.push({w:'Marie-Charlotte, sa mère (donatrice)', r:'Intervenante', why:(s.inalien ? 'L’acte de donation interdit d’aliéner pendant sa vie : elle consent à la vente. ' : '') + 'Avec les héritiers réservataires, elle consent à l’aliénation : plus aucune action en réduction ou en revendication contre l’acquéreur (art. 924-4 al. 2).'});
        if (s.freres) inter.push({w:'Paul et Léa, frère et sœur de Colette', r:'Intervenants', why:'Héritiers réservataires présomptifs de la donatrice : ils consentent à la vente du bien donné (art. 924-4 al. 2).'});
      } else if (s.donateur === 'dcd10'){
        if (s.freres) inter.push({w:'Paul et Léa, frère et sœur de Colette', r:'Intervenants', why:'La donatrice est décédée depuis moins de 10 ans : l’action en réduction est encore possible (art. 921). Les héritiers réservataires consentent à la vente.'});
        else notes.push('Donatrice décédée, et Colette est sa seule héritière réservataire : personne d’autre ne peut agir en réduction.');
        if (s.inalien) notes.push('L’interdiction d’aliéner a pris fin au décès de la donatrice.');
      } else notes.push('Donatrice décédée depuis plus de 10 ans : l’action en réduction est prescrite (art. 921), aucune intervention.');
    }
    return {comp, inter, notes};
  };

  if (o.mode === 'defi'){
    const N = 6; let k = 0, score = 0, lock = false;
    const A = ['Oui, comme covendeur (partie)', 'Oui, comme intervenant', 'Non, il ne signe pas'];
    const B = ['Le donateur seul', 'Le donateur et les réservataires', 'Les réservataires seuls', 'Personne'];
    const round = i => {
      if (i % 2 === 0){
        const statut = Math.random() < .2 ? 'pacse' : 'marie', regime = Math.random() < .5 ? 'communaute' : 'separation', nature = regime === 'communaute' && Math.random() < .45 ? 'commun' : 'propre', logement = Math.random() < .65;
        const s = {statut, regime, nature, logement, donation:false};
        const r = decide(s); const ans = r.comp.some(c => c.r === 'Covendeur') ? 0 : r.inter.length ? 1 : 2;
        const txt = statut === 'pacse' ? `Colette, pacsée avec Jean-Jacques, vend une maison qui lui appartient${logement ? ', où le couple habite' : ''}.` : `Colette, mariée ${regime === 'communaute' ? 'sans contrat (communauté légale)' : 'sous la séparation de biens'}, vend une maison ${nature === 'commun' ? 'achetée avec Jean-Jacques pendant le mariage' : 'qu’elle avait achetée avant le mariage'}${logement ? ' ; le couple y habite' : ' (une maison de vacances)'}.`;
        return {txt, q:`Jean-Jacques doit-il signer l’acte ?`, opts:A, ans, why:(r.comp.find(c => c.r === 'Covendeur') || r.inter[0] || {why:r.notes[0] || 'Jean-Jacques n’est pas propriétaire, et l’article 215 ne protège que les époux : il ne signe pas.'}).why};
      }
      const inalien = Math.random() < .5, donateur = pick(['vivant', 'vivant', 'dcd10', 'dcdplus']), freres = Math.random() < .6, deja = Math.random() < .2;
      const s = {statut:'celib', logement:false, donation:true, inalien, donateur, freres, deja};
      const r = decide(s); const hasD = r.inter.some(x => x.w.startsWith('Marie')), hasR = r.inter.some(x => x.w.startsWith('Paul'));
      const ans = hasD && hasR ? 1 : hasD ? 0 : hasR ? 2 : 3;
      const txt = `Colette vend une maison reçue par donation de sa mère${inalien ? ', avec une clause d’interdiction d’aliéner' : ''}. Sa mère est ${donateur === 'vivant' ? 'vivante' : donateur === 'dcd10' ? 'décédée il y a 4 ans' : 'décédée il y a 15 ans'}. Colette ${freres ? 'a un frère et une sœur' : 'est fille unique'}.${deja ? ' L’acte de donation contient déjà l’accord de tous à une future vente.' : ''}`;
      return {txt, q:'Qui doit intervenir à la vente ?', opts:B, ans, why:[...r.inter.map(x => x.why), ...r.notes].join(' ')};
    };
    const draw = () => {
      if (k >= N) return end();
      lock = false; const R2 = round(k);
      el.innerHTML = `<div class="w w-iv defi"><div class="w-head"><span class="eyebrow">Défi · ${k + 1}/${N} · ${score} ✓</span><b>${R2.q}</b></div><div class="enonce" style="padding:14px 16px"><div class="ek">Situation</div><p style="margin-top:4px">${R2.txt}</p></div><div class="q-ans iv-pick">${R2.opts.map((t, i) => `<button class="btn" data-i="${i}">${t}</button>`).join('')}</div><div class="iv-fb" aria-live="polite"></div></div>`;
      $('.iv-pick', el).addEventListener('click', e => {
        const b = e.target.closest('[data-i]'); if (!b || lock) return; lock = true;
        const ok = +b.dataset.i === R2.ans; if (ok){ score++; addXP(6, e); }
        $$('.iv-pick button', el).forEach(x => { x.disabled = true; if (+x.dataset.i === R2.ans) x.classList.add('btn-primary'); });
        $('.iv-fb', el).innerHTML = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Exact !' : 'Non : ' + R2.opts[R2.ans].toLowerCase()}</div><p>${R2.why}</p></div><div class="qnext"><button class="btn btn-primary" id="ivn">${k + 1 < N ? 'Suivant' : 'Résultat'}${icon('arrow')}</button></div>`;
        $('#ivn', el).onclick = () => { k++; draw(); };
      });
    };
    const end = () => { if (score >= 5) confetti(90); addXP(10, {target:el}); el.innerHTML = `<div class="result"><div class="eyebrow">Qui doit intervenir ?</div><h2>${score}/${N} bonnes réponses</h2><p class="muted">Logement de la famille : le conjoint (art. 215). Bien donné : le donateur et les réservataires (art. 924-4).</p><div class="btn-row" style="justify-content:center"><button class="btn btn-primary" id="ivr">${icon('refresh')}Rejouer</button></div></div>`; $('#ivr', el).onclick = () => { k = 0; score = 0; draw(); }; };
    return draw();
  }

  const s = {statut:'marie', regime:'communaute', nature:'propre', logement:true, donation:false, inalien:true, donateur:'vivant', freres:true, deja:false};
  const seg = (k, opts, lab) => `<div class="iv-g" data-g="${k}"><span class="eyebrow">${lab}</span><div class="seg-ctrl" role="tablist" aria-label="${lab}">${opts.map(([v, l]) => `<button role="tab" aria-selected="false" data-k="${k}" data-v="${v}">${l}</button>`).join('')}</div></div>`;
  const tg = (k, l) => `<button class="rp-tg" data-t="${k}" aria-pressed="false">${l}</button>`;
  el.innerHTML = `<div class="w w-iv">
    <div class="w-head"><span class="eyebrow">Simulateur</span><b>Colette vend sa maison : qui doit signer ?</b><span class="muted">Décris la situation : l’acte se compose sous tes yeux.</span></div>
    <div class="iv-ctrl">
      ${seg('statut', [['marie', 'Mariée'], ['pacse', 'Pacsée'], ['celib', 'Célibataire']], 'Colette est')}
      ${seg('regime', [['communaute', 'Communauté'], ['separation', 'Séparation de biens']], 'Son régime')}
      ${seg('nature', [['propre', 'Propre à Colette'], ['commun', 'Commun']], 'La maison est')}
      <div class="iv-tgs">${tg('logement', 'C’est le logement de la famille')}${tg('donation', 'Colette l’a reçue par donation de sa mère')}</div>
      <div class="iv-don">
        ${seg('donateur', [['vivant', 'Vivante'], ['dcd10', 'Décédée depuis moins de 10 ans'], ['dcdplus', 'Depuis plus de 10 ans']], 'La donatrice est')}
        <div class="iv-tgs">${tg('inalien', 'Clause d’interdiction d’aliéner')}${tg('freres', 'Colette a un frère et une sœur')}${tg('deja', 'La donation contient déjà leur accord')}</div>
      </div>
    </div>
    <article class="acte-paper iv-acte"><div class="ap-h">Comparution</div><ul class="iv-list iv-comp"></ul><div class="ap-h">Intervention</div><ul class="iv-list iv-int"></ul></article>
    <div class="iv-notes" aria-live="polite"></div></div>`;
  let prev = new Set();
  const draw = () => {
    if (s.donation && s.nature === 'commun') s.nature = 'propre';
    $$('.iv-ctrl [data-k]', el).forEach(b => b.setAttribute('aria-selected', s[b.dataset.k] === b.dataset.v));
    $$('.iv-ctrl [data-t]', el).forEach(b => b.setAttribute('aria-pressed', !!s[b.dataset.t]));
    $('[data-g="regime"]', el).hidden = s.statut !== 'marie';
    $('[data-g="nature"]', el).hidden = !(s.statut === 'marie' && s.regime === 'communaute') || s.donation;
    $('.iv-don', el).hidden = !s.donation;
    $('[data-t="logement"]', el).textContent = s.statut === 'marie' ? 'Le couple y habite : logement de la famille' : 'Colette y habite avec son compagnon';
    const r = decide(s), now = new Set();
    const li = x => { const key = x.w + x.r; now.add(key); return `<li class="${prev.has(key) ? '' : 'in'}"><b>${x.w}</b> <span class="tag plain">${x.r}</span><span>${x.why}</span></li>`; };
    $('.iv-comp', el).innerHTML = r.comp.map(li).join('');
    $('.iv-int', el).innerHTML = r.inter.length ? r.inter.map(li).join('') : '<li class="none">Aucune intervention nécessaire.</li>';
    $('.iv-notes', el).innerHTML = r.notes.map(n => `<p class="w-note">${icon('bulb')} ${n}</p>`).join('');
    prev = now;
  };
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-k][data-v]'); if (b){ s[b.dataset.k] = b.dataset.v; draw(); return; }
    const t = e.target.closest('[data-t]'); if (t){ s[t.dataset.t] = !s[t.dataset.t]; draw(); if (!el.__touched){ el.__touched = true; addXP(2, e); } }
  });
  draw();
});

/* 5. Lire un état hypothécaire hors formalité (EHF) */
JLG.widget('ehf', el => {
  const Z = [
    {k:'tete', t:'L’en-tête', d:'Le service de la publicité foncière du <b>lieu de l’immeuble</b>, la demande (formulaire <b>cerfa 3233-SD</b>) et la <b>période certifiée</b> : l’état est certifié d’une date à une autre. Ici, 30 ans en arrière : de quoi vérifier l’origine de propriété.'},
    {k:'imm', t:'L’immeuble', d:'La commune et les références cadastrales (section, numéro, contenance) : on vérifie que c’est bien le bien vendu, comme dans la clause « désignation ».'},
    {k:'prop', t:'Le propriétaire actuel', d:'Qui est propriétaire, comment (acquisition, donation, succession…), par quel notaire, à quelle date, et la référence de publication : tout ce qu’il faut pour rédiger l’<b>effet relatif</b>, et pour vérifier que le vendeur a bien les droits nécessaires.'},
    {k:'chaine', t:'Les mutations antérieures', d:'Les propriétaires précédents : la <b>chaîne régulière de propriété sur 30 ans</b>, pour rédiger l’<b>origine de propriété</b>.'},
    {k:'insc', t:'Les inscriptions', d:'Les <b>droits réels accessoires</b> qui grèvent l’immeuble : ici une hypothèque au profit de la banque. Elle devra être remboursée et radiée (mainlevée) pour que l’acquéreur reçoive un bien libre.'},
    {k:'charges', t:'Les autres publications', d:'Les charges publiées : servitudes, baux de plus de 12 ans, règlements… L’acquéreur doit les connaître avant de s’engager.'}
  ];
  el.innerHTML = `<div class="w w-ehf">
    <div class="w-head"><span class="eyebrow">Document interactif</span><b>Lire un état hypothécaire hors formalité</b><span class="muted">Touche une zone de l’état : ce qu’elle apprend au notaire.</span></div>
    <article class="acte-paper ehf-doc">
      <button class="ehf-z" data-k="tete"><span class="ehf-l">SPF de NANCY 1</span><b>État hors formalité · demande n° 2026 H 01234 (cerfa 3233-SD)</b><span>Certifié du 1er octobre 1996 au 2 octobre 2026</span></button>
      <button class="ehf-z" data-k="imm"><span class="ehf-l">Immeuble</span><b>Commune de SEICHAMPS · section AB n° 123 · 08 a 35 ca</b></button>
      <button class="ehf-z" data-k="prop"><span class="ehf-l">Propriétaire actuel</span><b>Madame Colette GERBLOIS</b><span>Acquisition · acte de Maître CLAUDE, notaire à NANCY, du 3 mai 2010 · publié le 1er juin 2010, volume 2010 P n° 4567</span></button>
      <button class="ehf-z" data-k="chaine"><span class="ehf-l">Mutations antérieures</span><span>Monsieur Armand AURIOUX · donation · acte du 12 mars 1998 · publié le 20 avril 1998</span><span>Madame Lucie AURIOUX · attestation après décès · 4 février 1995 · publiée le 10 mars 1995</span></button>
      <button class="ehf-z" data-k="insc"><span class="ehf-l">Inscriptions</span><b>Hypothèque conventionnelle · BANQUE DU LAC</b><span>Inscrite le 1er juin 2010 · pour sûreté de 180 000 € · effet jusqu’au 1er juin 2032</span></button>
      <button class="ehf-z" data-k="charges"><span class="ehf-l">Autres publications</span><span>Servitude de passage au profit de la parcelle AB n° 124 · acte du 12 mars 2001</span></button>
    </article>
    <div class="ehf-out" aria-live="polite"></div>
    <div class="ehf-val">
      <label class="rp-f"><span>L’EHF a été délivré il y a <output class="ehf-d">30</output> jours</span><input type="range" min="0" max="120" value="30"></label>
      <div class="ehf-ring"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18"/><circle class="ehf-arc" cx="22" cy="22" r="18" pathLength="100"/></svg><p class="ehf-v" aria-live="polite"></p></div>
    </div></div>`;
  const out = $('.ehf-out', el);
  const show = k => { const z = Z.find(x => x.k === k); $$('.ehf-z', el).forEach(b => b.classList.toggle('sel', b.dataset.k === k)); out.innerHTML = `<div class="w-card"><b class="w-t">${z.t}</b><p>${z.d}</p></div>`; el.__seen = el.__seen || new Set(); el.__seen.add(k); if (el.__seen.size === Z.length && !el.__done){ el.__done = true; addXP(5, {target:out}); } };
  const val = () => {
    const d = +$('.ehf-val input', el).value; $('.ehf-d', el).textContent = d;
    const ok = d <= 60; $('.ehf-arc', el).style.strokeDasharray = `${Math.min(100, d / 60 * 100)} 100`; $('.ehf-ring', el).classList.toggle('ko', !ok);
    $('.ehf-v', el).innerHTML = ok ? `<b>Encore utilisable</b> : la pratique admet 2 mois (${60 - d} jour${60 - d > 1 ? 's' : ''} restant${60 - d > 1 ? 's' : ''}). Il n’y a pas de délai légal.` : '<b>Trop ancien</b> : au-delà de 2 mois, l’étude redemande un état au SPF, pour ne rien manquer de récent (une hypothèque, une saisie…).';
  };
  el.addEventListener('click', e => { const b = e.target.closest('.ehf-z'); if (b) show(b.dataset.k); });
  el.addEventListener('input', e => { if (e.target.closest('.ehf-val')) val(); });
  show('prop'); val();
});

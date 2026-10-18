/* =================== SCHÉMAS — DÉONTOLOGIE, ACTIVITÉ 3 : LES FORMALITÉS PRÉALABLES =================== */

/* Petit moteur de défi à choix multiples, partagé par les trois schémas : o.mode === 'defi'. */
function fmQuiz(el, cfg){
  let list = [], k = 0, score = 0, lock = false;
  const start = () => { list = shuffle(cfg.items).slice(0, cfg.n || 8); k = 0; score = 0; draw(); };
  const draw = () => {
    if (k >= list.length) return end();
    lock = false;
    const it = list[k], opts = shuffle(it.o);
    el.innerHTML = `<div class="w fm-defi">
      <div class="w-head"><span class="eyebrow">${esc(cfg.eyebrow)} · ${k + 1}/${list.length} · ${score} ✓</span><b class="fm-q">${it.q}</b><span class="muted">${esc(cfg.hint)}</span></div>
      <div class="fm-opts">${opts.map((o, i) => `<button class="fm-opt" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>
      <div class="fm-fb" aria-live="polite"></div></div>`;
    $('.fm-opts', el).addEventListener('click', e => {
      const b = e.target.closest('.fm-opt'); if (!b || lock) return; lock = true;
      const ok = b.dataset.v === it.a;
      $$('.fm-opt', el).forEach(x => { x.disabled = true; if (x.dataset.v === it.a) x.classList.add('got'); });
      if (!ok) b.classList.add('nope');
      if (ok){ score++; addXP(5, e); }
      $('.fm-fb', el).innerHTML = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? pick(['Bien vu !', 'Exact.', 'Oui !']) : 'Pas tout à fait : ' + esc(it.a)}</div><p>${it.e}</p></div><div class="qnext"><button class="btn btn-primary" id="fmn">${k + 1 < list.length ? 'Suivant' : 'Résultat'}${icon('arrow')}</button></div>`;
      $('#fmn', el).onclick = () => { k++; draw(); };
    });
  };
  const end = () => {
    const p = score / list.length; if (p >= .8) confetti(90); addXP(10, {target:el});
    el.innerHTML = `<div class="result"><div class="eyebrow">${esc(cfg.title)}</div><h2>${score}/${list.length} bonnes réponses</h2><p class="muted">${p === 1 ? cfg.perfect : cfg.again}</p><div class="btn-row" style="justify-content:center"><button class="btn btn-primary" id="fmr">${icon('refresh')}Rejouer</button></div></div>`;
    $('#fmr', el).onclick = start;
  };
  start();
}

/* 1. Le dossier d’identification : quelles pièces pour quel client ? — ou défi « quelle pièce demander ? » */
const PC_PROFILES = [
  {id:'mar', l:'Française mariée', e:'👩', p:[
    {t:'Carte d’identité ou passeport en cours de validité', o:'Le client', w:'Avec photographie : le notaire vérifie l’identité du comparant.'},
    {t:'Extrait d’acte de naissance avec filiation', o:'COMEDEC ou service d’état civil', w:'Identité, filiation, et mentions en marge (mariage, PACS, divorce).'},
    {t:'Acte de mariage récent', o:'Mairie du lieu de célébration ou COMEDEC', w:'Date du mariage, éventuel changement de régime.'},
    {t:'Copie du contrat de mariage, s’il y en a un', o:'Le notaire détenteur de l’acte', w:'Ce n’est pas la mairie qui le conserve : c’est un acte notarié.'},
    {t:'Justificatif de résidence principale', o:'Le client', w:'Pour le logement de la famille et les plus-values.'}]},
  {id:'pol', l:'Ressortissant européen', e:'🇪🇺', p:[
    {t:'Passeport ou pièce d’identité officielle', o:'Le client', w:'La pièce qui permet de vérifier l’identité.'},
    {t:'Actes d’état civil, avec traduction si besoin', o:'Autorités du pays d’origine', w:'Selon la situation : traduction appropriée.'},
    {t:'Titre de séjour', o:'Non exigé', w:'Les ressortissants de l’EEE et les Suisses en sont en principe dispensés.', x:true}]},
  {id:'etr', l:'Ressortissant hors Europe', e:'🌍', p:[
    {t:'Passeport ou pièce d’identité officielle', o:'Le client', w:'La pièce qui permet de vérifier l’identité.'},
    {t:'Actes d’état civil, avec traduction', o:'Autorités du pays d’origine', w:'Selon la situation, accompagnés d’une traduction appropriée.'},
    {t:'Pièces étrangères sur le mariage ou le divorce', o:'Autorités étrangères', w:'On vérifie leur reconnaissance et leurs effets en France.'}]},
  {id:'ne', l:'Français né à l’étranger', e:'🛬', p:[
    {t:'Carte d’identité ou passeport en cours de validité', o:'Le client', w:'Pour vérifier l’identité.'},
    {t:'Acte de naissance établi ou transcrit en France', o:'Service central d’état civil, à Nantes', w:'Démarches en ligne possibles.'},
    {t:'Acte de mariage, si marié en France', o:'Mairie du lieu de célébration ou COMEDEC', w:'Un extrait suffit.'}]},
  {id:'div', l:'Divorcé(e)', e:'📄', p:[
    {t:'Extrait d’acte de naissance avec mentions', o:'COMEDEC ou service d’état civil', w:'La mention du divorce figure en marge.'},
    {t:'Jugement de divorce ou convention déposée chez un notaire', o:'Le client ou le notaire dépositaire', w:'Les justificatifs adaptés au type de divorce.'},
    {t:'Preuve du caractère définitif', o:'Le client ou le greffe', w:'Le divorce doit être définitif.'},
    {t:'Copie du contrat de mariage ou de l’acte de liquidation', o:'Le notaire détenteur', w:'Pour connaître les droits sur le bien.'}]},
  {id:'pacs', l:'Pacsée', e:'🤝', p:[
    {t:'Extrait d’acte de naissance avec mention du PACS', o:'COMEDEC ou service d’état civil', w:'Le PACS est mentionné en marge de l’acte de naissance.'},
    {t:'Convention de PACS', o:'Les parties, ou le notaire si elle est notariée', w:'Pour connaître le régime choisi.'},
    {t:'Vérification de la date et d’une éventuelle dissolution', o:'Mention en marge', w:'Depuis le 1er novembre 2017, le PACS s’enregistre en mairie ou devant notaire.'}]},
  {id:'tut', l:'Majeur sous tutelle', e:'🧑‍⚖️', p:[
    {t:'Pièce d’identité du majeur', o:'Le tuteur', w:'Pour vérifier l’identité.'},
    {t:'Décision de tutelle', o:'Le tuteur', w:'On vérifie l’existence et l’étendue de la mesure.'},
    {t:'Pièce d’identité et pouvoirs du tuteur', o:'Le tuteur', w:'Il représente en principe le majeur.'},
    {t:'Autorisation du juge ou du conseil de famille', o:'Le tuteur', w:'Pour les actes de disposition notamment.'}]},
  {id:'min', l:'Mineur non émancipé', e:'🧒', p:[
    {t:'Acte de naissance du mineur', o:'COMEDEC ou service d’état civil', w:'Identité, filiation.'},
    {t:'Pièces d’identité des représentants légaux', o:'Les parents', w:'Ils agissent pour l’enfant.'},
    {t:'Autorisation du juge des tutelles des mineurs', o:'Le juge des tutelles', w:'Selon la nature et la gravité de l’acte.'}]},
  {id:'sci', l:'Société civile (SCI)', e:'🏢', p:[
    {t:'Statuts à jour', o:'La société', w:'Objet social et pouvoirs.'},
    {t:'Extrait Kbis le plus récent possible', o:'Registre du commerce et des sociétés', w:'La carte d’identité de la société.'},
    {t:'Pièce d’identité du gérant', o:'Le gérant', w:'Justification de l’identité du représentant.'},
    {t:'Délibération ou compte rendu d’AG autorisant la vente', o:'La société', w:'Si les statuts l’exigent : la preuve de l’autorisation.'},
    {t:'Annonces BODACC', o:'BODACC', w:'Pour vérifier l’absence de procédure collective.'}]},
  {id:'ass', l:'Association', e:'🎗️', p:[
    {t:'Statuts', o:'L’association', w:'Pour connaître l’objet et les pouvoirs.'},
    {t:'Date et lieu de déclaration ou de dépôt des statuts', o:'Préfecture', w:'Mention d’identification de l’association.'},
    {t:'Décision autorisant la vente', o:'L’association', w:'Pour les pouvoirs de son représentant.'},
    {t:'Pièce d’identité du représentant', o:'Le représentant', w:'Justification de son identité.'}]},
  {id:'pro', l:'Entrepreneur individuel', e:'🛠️', p:[
    {t:'Pièce d’identité', o:'Le client', w:'Pour vérifier l’identité.'},
    {t:'Justificatif d’immatriculation au RNE', o:'INPI (registre national des entreprises)', w:'Selon la situation du professionnel.'},
    {t:'Extrait K ou Kbis récent, s’il existe', o:'Registre du commerce et des sociétés', w:'Statut professionnel et pouvoirs utiles à l’opération.'},
    {t:'Annonces BODACC', o:'BODACC', w:'Pour vérifier l’existence d’une procédure collective.'}]}
];
const PC_DEFI = [
  {q:'La cliente est mariée sous contrat. Il manque la copie du contrat de mariage : où la demandes-tu ?', a:'Au notaire détenteur de l’acte', o:['À la mairie du mariage', 'Au notaire détenteur de l’acte', 'Au service de la publicité foncière', 'Au tribunal'], e:'Le contrat de mariage est un acte notarié : on le demande au notaire qui l’a reçu, pas à la mairie.'},
  {q:'Un vendeur polonais présente son passeport. Quelle pièce n’as-tu PAS à exiger systématiquement ?', a:'Un titre de séjour', o:['Une pièce d’identité', 'Un titre de séjour', 'Un acte de naissance traduit si besoin', 'Une pièce établissant son état civil'], e:'Les ressortissants de l’EEE et les Suisses sont en principe dispensés de titre de séjour.'},
  {q:'Un acquéreur est sous curatelle. Qui l’assiste ?', a:'Le curateur', o:['Le tuteur', 'Le curateur', 'Le maire', 'Le notaire seul'], e:'Sous curatelle, l’assistance du curateur est requise pour les actes prévus par la loi. Sous tutelle, c’est le tuteur qui représente.'},
  {q:'Une SCI vend un immeuble. Quelle pièce prouve que la vente est autorisée ?', a:'Le compte rendu d’assemblée générale', o:['Le Kbis', 'Le compte rendu d’assemblée générale', 'L’extrait de matrice', 'Le plan cadastral'], e:'Le Kbis identifie la société, il ne prouve pas l’autorisation. La décision des associés, si.'},
  {q:'Une Française née à l’étranger, dont l’acte est transcrit en France : où demandes-tu son acte de naissance ?', a:'Au SCEC, à Nantes', o:['À la mairie de sa commune actuelle', 'Au SCEC, à Nantes', 'Au SPF', 'Au greffe du tribunal'], e:'Le Service central d’état civil de Nantes, notamment par les démarches en ligne.'},
  {q:'Un vendeur est divorcé. Que vérifies-tu en plus du jugement ou de la convention ?', a:'Son caractère définitif', o:['Le nombre d’enfants', 'Son caractère définitif', 'Le salaire des époux', 'La durée du mariage'], e:'Le notaire recueille les justificatifs et vérifie qu’ils sont définitifs.'},
  {q:'Pour vérifier si une société est en redressement judiciaire, tu consultes…', a:'Le BODACC', o:['Le BODACC', 'Le plan cadastral', 'Perval', 'Télé@ctes'], e:'Le BODACC publie les procédures collectives et les rétablissements personnels.'},
  {q:'Un mineur non émancipé hérite d’un bien et veut le vendre. Qui agit ?', a:'Ses représentants légaux', o:['Lui seul', 'Ses représentants légaux', 'Le maire', 'Son voisin'], e:'Le mineur est représenté, avec l’autorisation du juge des tutelles des mineurs selon la nature de l’acte.'},
  {q:'Où est mentionné le PACS ?', a:'En marge de l’acte de naissance', o:['Dans l’acte de mariage', 'En marge de l’acte de naissance', 'Au casier judiciaire', 'Au cadastre'], e:'Le PACS est mentionné en marge de l’acte de naissance de chaque partenaire.'},
  {q:'Qui tient le registre national des entreprises (RNE) ?', a:'L’INPI', o:['L’INSEE', 'L’INPI', 'La préfecture', 'Le notaire'], e:'L’INPI. SIRENE, c’est l’INSEE : ne les confonds pas.'}
];
JLG.widget('pieces', (el, o) => {
  if (o && o.mode === 'defi') return fmQuiz(el, {items:PC_DEFI, n:8, eyebrow:'Défi', hint:'Choisis la bonne réponse.', title:'Quelle pièce demander ?', perfect:'Ton dossier est toujours complet.', again:'Les trois enquêtes : les personnes, le bien, les règles. Relis la fiche et réessaie.'});
  let cur = 'mar', got = new Set(), xp = false, done = {};
  const draw = () => {
    const P = PC_PROFILES.find(x => x.id === cur);
    el.innerHTML = `<div class="w w-fm">
      <div class="w-head"><span class="eyebrow">Schéma animé</span><b>Le dossier de ton client</b><span class="muted">Choisis un profil. Touche chaque pièce quand tu l’as reçue : le dossier se remplit.</span></div>
      <div class="ech-crit fm-tabs" role="tablist" aria-label="Profil du client">${PC_PROFILES.map(x => `<button role="tab" aria-selected="${x.id === cur}" data-p="${x.id}">${x.e} ${x.l}</button>`).join('')}</div>
      <ol class="fm-list">${P.p.map((x, i) => `<li class="fm-pc${x.x ? ' is-no' : ''}" style="--d:${i * 70}ms"><button class="fm-pcb${got.has(cur + i) ? ' on' : ''}" data-i="${i}" aria-pressed="${got.has(cur + i)}" ${x.x ? 'disabled' : ''}>
          <span class="fm-ck" aria-hidden="true">${x.x ? '✕' : icon('check')}</span>
          <span class="fm-tx"><b>${x.t}</b><span class="fm-or">${x.x ? '' : 'Où ? '}${x.o}</span><span class="fm-why">${x.w}</span></span></button></li>`).join('')}</ol>
      <div class="fm-bar" role="progressbar" aria-label="Pièces réunies" aria-valuemin="0" aria-valuemax="100"><i></i></div>
      <div class="fm-status" aria-live="polite"></div></div>`;
    refresh();
  };
  const refresh = () => {
    const P = PC_PROFILES.find(x => x.id === cur), need = P.p.map((x, i) => x.x ? null : i).filter(i => i != null), n = need.filter(i => got.has(cur + i)).length, pct = Math.round(n / need.length * 100);
    $('.fm-bar i', el).style.width = pct + '%'; $('.fm-bar', el).setAttribute('aria-valuenow', pct);
    const st = $('.fm-status', el);
    if (n === need.length){
      st.innerHTML = `<span class="fm-ok">${sealSVG({ring:false})}<b>Dossier complet : tu peux rédiger.</b></span>`;
      if (!done[cur]){ done[cur] = 1; addXP(4, {target:el}); }
    } else st.innerHTML = `<span class="muted">${n}/${need.length} pièces reçues</span>`;
  };
  el.addEventListener('click', e => {
    const t = e.target.closest('[data-p]'); if (t){ cur = t.dataset.p; draw(); return; }
    const b = e.target.closest('.fm-pcb'); if (!b || b.disabled) return;
    const key = cur + b.dataset.i; got.has(key) ? got.delete(key) : got.add(key);
    b.classList.toggle('on'); b.setAttribute('aria-pressed', got.has(key));
    if (!xp){ xp = true; addXP(2, e); }
    refresh();
  });
  draw();
});

/* 2. Les pièces d’urbanisme : comparateur — ou défi « le bon certificat » */
const UR_DOCS = [
  {id:'cua', l:'CUa', n:'Certificat d’urbanisme d’information', m:1, d:'Les règles d’urbanisme applicables au terrain, les servitudes et les taxes.', r:'Quelle est la constructibilité du terrain ? Quelles règles et quelles taxes s’y appliquent ?', c:'Instruction en principe 1 mois · gratuit · valable 18 mois', t:'Ce n’est pas une autorisation.'},
  {id:'cub', l:'CUb', n:'Certificat d’urbanisme opérationnel', m:2, d:'Si une opération précise, projetée sur le terrain, est réalisable.', r:'Pourrai-je construire cette maison, à cet endroit ?', c:'Instruction en principe 2 mois · gratuit · valable 18 mois', t:'Il ne remplace pas le permis de construire.'},
  {id:'ali', l:'Alignement', n:'Certificat d’alignement', m:0, d:'La limite du domaine public routier (État, département ou commune) et des propriétés riveraines.', r:'Où s’arrête ma propriété, où commence la voie publique ?', c:'Délivré par l’autorité administrative', t:'Utile quand le bien borde une route.'},
  {id:'num', l:'Numérotage', n:'Certificat de numérotage', m:0, d:'L’adresse attribuée à l’immeuble.', r:'Quel est le numéro officiel de ce bien ?', c:'Quand il est nécessaire', t:'L’adresse figure dans la désignation de l’acte.'},
  {id:'car', l:'Carrière', n:'Certificat de carrière', m:0, d:'La situation du bien au regard des risques du sol et du sous-sol (anciennes carrières, travaux confortatifs).', r:'Y a-t-il des cavités sous ce terrain ?', c:'Selon la zone', t:'Un risque à connaître avant de construire.'},
  {id:'dia', l:'DIA', n:'Déclaration d’intention d’aliéner', m:2, d:'À déposer en mairie quand la vente est soumise au droit de préemption urbain (DPU) ou à une ZAD.', r:'La commune veut-elle acheter ce bien à ma place ?', c:'Réponse du titulaire sous 2 mois', t:'La DIA n’est pas un certificat : on la dépose, on ne la reçoit pas.'}
];
const UR_DEFI = [
  {q:'L’acheteur veut savoir si le terrain est constructible, de façon générale.', a:'CUa', e:'Le CUa d’information renseigne sur les règles applicables au terrain.'},
  {q:'L’acheteur veut être sûr de pouvoir bâtir une maison de 120 m² à un endroit précis.', a:'CUb', e:'Le CUb est opérationnel : il se prononce sur le projet.'},
  {q:'Le terrain borde une route départementale : où s’arrête la propriété ?', a:'Alignement', e:'Le certificat d’alignement détermine la limite du domaine public routier.'},
  {q:'La vente se fait dans une zone soumise au droit de préemption urbain.', a:'DIA', e:'On dépose une déclaration d’intention d’aliéner en mairie.'},
  {q:'Il faut attester que l’adresse du bien est le 12, rue des Lilas.', a:'Numérotage', e:'Le certificat de numérotage atteste l’adresse attribuée.'},
  {q:'On craint des anciennes carrières sous le terrain.', a:'Carrière', e:'Le certificat de carrière renseigne sur les risques du sol et du sous-sol.'},
  {q:'La vente est dans une zone d’aménagement différé (ZAD).', a:'DIA', e:'ZAD : droit de préemption, donc DIA.'},
  {q:'Le notaire veut connaître les taxes applicables à un terrain, sans projet précis.', a:'CUa', e:'Le CUa informe sur les règles, les servitudes et les taxes.'},
  {q:'Le client veut faire valider la faisabilité d’une extension de 40 m².', a:'CUb', e:'C’est un projet précis : un CUb.'},
  {q:'Le bien a-t-il une limite avec le domaine public routier ?', a:'Alignement', e:'C’est l’objet de l’alignement.'}
];
JLG.widget('urba', (el, o) => {
  if (o && o.mode === 'defi') return fmQuiz(el, {items:UR_DEFI.map(x => { const all = ['CUa', 'CUb', 'Alignement', 'Numérotage', 'Carrière', 'DIA']; return {q:x.q, a:x.a, e:x.e, o:shuffle(all.filter(v => v !== x.a)).slice(0, 3).concat(x.a)}; }), n:8, eyebrow:'Défi', hint:'Quel document demandes-tu ?', title:'Le bon certificat', perfect:'La mairie n’a plus de secrets pour toi.', again:'a = 1 mois (information), b = 2 mois (opérationnel). La DIA, on la dépose : relis la partie 5.'});
  let cur = 'cua', xp = false;
  const show = (id) => {
    cur = id; const d = UR_DOCS.find(x => x.id === id);
    $$('.fm-tabs button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.u === id));
    const body = $('.fm-ur', el); body.classList.remove('in'); void body.offsetWidth; body.classList.add('in');
    const months = d.m ? `<div class="fm-gantt" aria-hidden="true"><span class="fm-g-l">Délai ${d.m} mois</span><div class="fm-g-t"><i style="--w:${d.m / 2 * 100}%"></i></div></div>` : '';
    body.innerHTML = `<div class="fm-ur-head"><span class="fm-badge">${d.l}</span><div><b>${d.n}</b><span class="muted">${d.c}</span></div></div>
      <div class="fm-ur-grid"><div class="fm-card"><i>Il dit</i><p>${d.d}</p></div><div class="fm-card"><i>Question du client</i><p>« ${d.r} »</p></div></div>
      ${months}<p class="fm-trap"><b>À retenir :</b> ${d.t}</p>`;
  };
  el.innerHTML = `<div class="w w-fm">
    <div class="w-head"><span class="eyebrow">Comparateur</span><b>Les pièces d’urbanisme</b><span class="muted">Touche un document : à quoi il sert, et combien de temps il faut attendre.</span></div>
    <div class="ech-crit fm-tabs" role="tablist" aria-label="Document d’urbanisme">${UR_DOCS.map(d => `<button role="tab" aria-selected="false" data-u="${d.id}">${d.l}</button>`).join('')}</div>
    <div class="fm-ur" aria-live="polite"></div></div>`;
  $('.fm-tabs', el).addEventListener('click', e => { const b = e.target.closest('[data-u]'); if (!b) return; show(b.dataset.u); if (!xp){ xp = true; addXP(2, e); } });
  show('cua');
});

/* 3. Les diagnostics : un bien, ses diagnostics — ou défi « combien de temps ça vaut ? » */
const DD_DEFI = [
  ['Termites', '6 mois', 'Dans une zone délimitée par arrêté préfectoral : 6 mois.'],
  ['État des risques (ERP)', 'Moins de 6 mois', 'L’ERP doit dater de moins de 6 mois.'],
  ['Gaz (vente)', '3 ans', 'Installation de plus de 15 ans : 3 ans pour une vente.'],
  ['Électricité (vente)', '3 ans', 'Installation de plus de 15 ans : 3 ans pour une vente.'],
  ['Assainissement non collectif', '3 ans', 'Immeuble non raccordé au réseau public : 3 ans.'],
  ['Audit énergétique', '5 ans', 'Maison classée E, F ou G : 5 ans, à remettre dès la première visite.'],
  ['DPE', '10 ans', '10 ans (mais les DPE d’avant juillet 2021 ne sont plus utilisables en 2026).'],
  ['Plomb (CREP), absence de plomb', 'Illimitée', 'Illimitée en l’absence de plomb au seuil réglementaire (1 an si positif).'],
  ['Amiante réalisé depuis le 1er avril 2013', 'Illimitée', 'Illimitée, même si le résultat est positif.'],
  ['Superficie loi Carrez', 'Pas de durée légale', 'Pas de durée fixe : on la refait si la superficie a changé.']
];
JLG.widget('ddt', (el, o) => {
  const OPT = ['6 mois', 'Moins de 6 mois', '3 ans', '5 ans', '10 ans', 'Illimitée', 'Pas de durée légale', '1 an'];
  if (o && o.mode === 'defi') return fmQuiz(el, {items:DD_DEFI.map(([n, a, e]) => ({q:'<span class="muted">Durée de validité :</span> ' + n, a, e, o:shuffle(OPT.filter(v => v !== a && (a !== 'Moins de 6 mois' || v !== '6 mois') && (a !== '6 mois' || v !== 'Moins de 6 mois'))).slice(0, 3).concat(a)})), n:8, eyebrow:'Défi', hint:'Choisis la durée de validité pour une vente.', title:'Combien de temps ça vaut ?', perfect:'Tes diagnostics sont tous à jour.', again:'6 mois : termites et risques. 3 ans : gaz, électricité, assainissement. 10 ans : DPE.'});
  const S = {year:1962, type:'mai', gaz:true, elec:true, term:true, erp:true, anc:false, dpe:'F'};
  const calc = () => {
    const y = S.year, r = [], no = [];
    const add = (c, id, t, v, why) => (c ? r : no).push({id, t, v, why});
    add(y < 1949, 'plomb', 'Plomb (CREP)', 'Illimitée si absence de plomb · 1 an si positif', 'Logement construit avant le 1er janvier 1949');
    add(y < 1997 || (y === 1997), 'amiante', 'Amiante', 'Illimitée si réalisé depuis le 1er avril 2013', y === 1997 ? 'Permis avant le 1er juillet 1997 : à vérifier selon la date du permis' : 'Permis de construire délivré avant le 1er juillet 1997');
    add(S.term, 'termites', 'Termites', '6 mois', 'Zone délimitée par arrêté préfectoral');
    add(S.gaz, 'gaz', 'Gaz', '3 ans', 'Installation intérieure de plus de 15 ans');
    add(S.elec, 'elec', 'Électricité', '3 ans', 'Installation intérieure de plus de 15 ans');
    add(S.erp, 'erp', 'État des risques (ERP)', 'Moins de 6 mois', 'Bien situé dans une zone concernée par les risques');
    add(S.anc, 'anc', 'Assainissement non collectif', '3 ans', 'Immeuble non raccordé au réseau public');
    add(true, 'dpe', 'DPE', '10 ans', 'Logements concernés, sauf exceptions');
    add(S.type === 'mai' && 'EFG'.includes(S.dpe), 'audit', 'Audit énergétique', '5 ans · dès la première visite', 'Maison individuelle classée E, F ou G');
    add(S.type === 'app', 'carrez', 'Superficie loi Carrez', 'Pas de durée légale', 'Lot de copropriété');
    return {r, no};
  };
  const draw = () => {
    const {r, no} = calc();
    $('.fm-dd-out', el).innerHTML = `<div class="fm-dd-count"><b>${r.length}</b> <span>à fournir dès la promesse de vente</span></div>
      <ul class="fm-dd-list">${r.map((x, i) => `<li style="--d:${i * 55}ms"><span class="fm-chk">${icon('check')}</span><span><b>${x.t}</b><small>${x.why}</small></span><em>${x.v}</em></li>`).join('')}</ul>
      ${no.length ? `<details class="fm-dd-no"><summary>${no.length} non concerné${no.length > 1 ? 's' : ''}</summary><ul>${no.map(x => `<li><b>${x.t}</b><small>${x.why}</small></li>`).join('')}</ul></details>` : ''}
      <p class="fm-dd-note">Le détecteur de fumée est une obligation d’équipement, pas un diagnostic. Mérule et radon : de l’information, pas de diagnostic autonome.</p>`;
  };
  el.innerHTML = `<div class="w w-fm">
    <div class="w-head"><span class="eyebrow">Simulateur</span><b>Quels diagnostics pour ce bien ?</b><span class="muted">Règle la maison : le dossier de diagnostic technique se compose tout seul.</span></div>
    <div class="fm-dd">
      <div class="fm-dd-in">
        <div class="field"><label for="fmy">Année du permis de construire : <b id="fmyv">${S.year}</b></label><input id="fmy" type="range" min="1900" max="2024" step="1" value="${S.year}"></div>
        <div class="ech-crit fm-type" role="tablist" aria-label="Type de bien"><button role="tab" aria-selected="true" data-t="mai">Maison individuelle</button><button role="tab" aria-selected="false" data-t="app">Appartement (copropriété)</button></div>
        <div class="fm-tg">
          <label><input type="checkbox" data-k="gaz" checked> Gaz : plus de 15 ans</label>
          <label><input type="checkbox" data-k="elec" checked> Électricité : plus de 15 ans</label>
          <label><input type="checkbox" data-k="term" checked> Zone termites (arrêté)</label>
          <label><input type="checkbox" data-k="erp" checked> Zone à risques (ERP)</label>
          <label><input type="checkbox" data-k="anc"> Non raccordé au réseau public</label>
        </div>
        <div class="field"><label for="fmd">Étiquette du DPE</label><select id="fmd">${'ABCDEFG'.split('').map(c => `<option${c === S.dpe ? ' selected' : ''}>${c}</option>`).join('')}</select></div>
      </div>
      <div class="fm-dd-out" aria-live="polite"></div>
    </div></div>`;
  el.addEventListener('input', e => {
    if (e.target.id === 'fmy'){ S.year = +e.target.value; $('#fmyv', el).textContent = S.year; draw(); }
    else if (e.target.dataset.k){ S[e.target.dataset.k] = e.target.checked; draw(); }
    else if (e.target.id === 'fmd'){ S.dpe = e.target.value; draw(); }
  });
  let xp = false;
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-t]'); if (!b) return;
    S.type = b.dataset.t; $$('.fm-type button', el).forEach(x => x.setAttribute('aria-selected', x === b)); draw();
    if (!xp){ xp = true; addXP(2, e); }
  });
  draw();
});

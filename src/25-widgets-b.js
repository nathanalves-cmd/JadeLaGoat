
/* =================== SCHÉMAS — IMMOBILIER =================== */
const CATS = {nature:'Immeuble par nature', destination:'Immeuble par destination', objet:'Immeuble par l’objet', meuble:'Meuble'};

/* La ferme aux immeubles */
JLG.widget('maison', (el, o) => {
  const H = [
    [115, 80, 'La maison', 'nature', 'Un bâtiment est un immeuble par nature. Art. 518 C. civ. : « les fonds de terre et les bâtiments sont immeubles par leur nature ».'],
    [73, 128, 'Fenêtres et volets', 'nature', 'Attachés durablement au bâtiment, ils font corps avec lui : immeubles par nature.'],
    [42, 166, 'Les tuyaux', 'nature', 'Art. 523 C. civ. : les tuyaux servant à la conduite des eaux font partie du fonds auquel ils sont attachés.'],
    [156, 137, 'La statue scellée dans sa niche', 'destination', 'Un meuble attaché à perpétuelle demeure par le propriétaire : immeuble par destination.'],
    [246, 58, 'La cuisine intégrée', 'destination', 'Encastrée, voulue définitive par le propriétaire : immeuble par destination. Elle se vend avec la maison.'],
    [281, 54, 'Le réfrigérateur posé', 'meuble', 'Simplement posé, il reste un meuble meublant. Le notaire le liste à part avec sa valeur : il sort de l’assiette des taxes.'],
    [50, 221, 'La piscine enterrée', 'nature', 'Fixée durablement dans le sol : immeuble par nature.'],
    [136, 211, 'Le tracteur de la ferme', 'destination', 'Il appartient au propriétaire du fonds et sert à l’exploiter : immeuble par destination (art. 524). S’il appartenait à un fermier locataire, ce serait un simple meuble.'],
    [206, 226, 'La vache du cheptel', 'destination', 'Animal attaché à l’exploitation, même propriétaire que le fonds : immeuble par destination (art. 524).'],
    [234, 128, 'Les pommes sur l’arbre', 'nature', 'Fruits non encore cueillis : immeubles par nature (art. 520). Une fois cueillies, elles deviennent des meubles.'],
    [338, 166, 'Le blé sur pied', 'nature', 'Récolte « pendante par les racines » : immeuble par nature (art. 520).'],
    [330, 213, 'Le blé coupé, en gerbes', 'meuble', 'Art. 520 : dès que les grains sont coupés, même pas encore enlevés, ils sont meubles. À ne pas confondre avec la paille gardée pour la ferme, immeuble par destination.'],
    [318, 251, 'Le droit de passage sur le terrain voisin', 'objet', 'Une servitude de passage est un droit qui porte sur un immeuble : immeuble par l’objet (art. 526).'],
    [358, 35, 'L’usufruit de la ferme', 'objet', 'L’usufruit d’une chose immobilière est un immeuble par l’objet (art. 526).']
  ];
  const uid = 'f' + Math.random().toString(36).slice(2, 7);
  const wheat = Array.from({length:13}, (_, i) => { const x = 290 + i * 8; return `<path d="M${x} 184 V162" stroke="var(--il-wheat)" stroke-width="2"/><ellipse cx="${x}" cy="160" rx="2.4" ry="5" fill="var(--il-wheat)"/>`; }).join('');
  const sheaves = [300, 326, 352, 378].map(x => `<g transform="translate(${x} 202)"><path d="M-7 26 L-1 0 H5 L11 26Z" fill="var(--il-wheat)"/><rect x="-4" y="12" width="12" height="3" rx="1" fill="var(--il-dark)"/></g>`).join('');
  el.innerHTML = `<div class="w w-farm">
    <div class="w-head"><span class="eyebrow">Illustration interactive</span><b>La ferme aux immeubles</b><span class="muted">${o.mode === 'defi' ? 'Touche un numéro et classe-le.' : 'Touche un numéro pour savoir ce que c’est.'}</span></div>
    <div class="seg-ctrl" role="tablist"><button role="tab" data-mode="explore">Explorer</button><button role="tab" data-mode="defi">Défi : à toi de classer</button></div>
    <div class="farm-wrap"><svg class="farm" viewBox="0 0 400 270" role="img" aria-label="Une ferme avec une maison, un tracteur, des animaux, un champ et un acte d’usufruit">
      <defs><clipPath id="${uid}b"><circle r="40"/></clipPath></defs>
      <rect x="0" y="0" width="400" height="270" rx="16" fill="var(--il-sky)"/>
      <circle cx="182" cy="26" r="11" fill="var(--accent)" opacity=".8"/>
      <path d="M0 182 Q100 170 200 180 T400 176 V270 H0Z" fill="var(--il-ground)"/>
      <rect x="282" y="150" width="112" height="38" rx="6" fill="var(--il-green)" opacity=".35"/>${wheat}
      <path d="M262 270 Q300 246 340 252 T400 238" fill="none" stroke="var(--il-wall)" stroke-width="7" stroke-dasharray="1 10" stroke-linecap="round" opacity=".8"/>
      <rect x="150" y="54" width="14" height="30" fill="var(--il-dark)"/>
      <rect x="40" y="98" width="150" height="88" rx="2" fill="var(--il-wall)"/>
      <polygon points="28,100 115,44 202,100" fill="var(--il-roof)"/>
      <rect x="58" y="114" width="30" height="28" fill="var(--il-sky)" stroke="var(--il-dark)" stroke-width="2"/><path d="M73 114 V142 M58 128 H88" stroke="var(--il-dark)" stroke-width="1.4"/>
      <rect x="48" y="113" width="9" height="30" rx="1.5" fill="var(--accent-deep)"/><rect x="89" y="113" width="9" height="30" rx="1.5" fill="var(--accent-deep)"/>
      <path d="M104 186 V146 a11 11 0 0 1 22 0 V186Z" fill="var(--il-dark)"/><circle cx="121" cy="168" r="1.6" fill="var(--il-wall)"/>
      <path d="M146 152 V126 a10 10 0 0 1 20 0 V152Z" fill="var(--il-dark)" opacity=".85"/><circle cx="156" cy="130" r="4" fill="var(--il-wall)"/><path d="M150.5 150 Q156 133 161.5 150Z" fill="var(--il-wall)"/>
      <path d="M34 101 H42 V178 Q42 186 50 186" fill="none" stroke="var(--il-line)" stroke-width="4" stroke-linecap="round"/>
      <rect x="14" y="208" width="72" height="26" rx="13" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><path d="M24 221 q6 -4 12 0 t12 0 t12 0 t12 0" fill="none" stroke="var(--accent)" stroke-width="1.5"/>
      <g transform="translate(108 196)"><rect x="0" y="10" width="40" height="16" rx="3" fill="var(--accent)"/><rect x="22" y="-6" width="18" height="17" rx="2" fill="none" stroke="var(--accent)" stroke-width="3"/><rect x="4" y="1" width="4" height="10" fill="var(--il-dark)"/><circle cx="32" cy="28" r="11" fill="var(--il-dark)"/><circle cx="32" cy="28" r="4" fill="var(--il-wall)"/><circle cx="8" cy="31" r="7" fill="var(--il-dark)"/><circle cx="8" cy="31" r="2.5" fill="var(--il-wall)"/></g>
      <g transform="translate(184 214)"><path d="M8 22 v11 M16 23 v11 M30 23 v11 M38 22 v11" stroke="var(--il-dark)" stroke-width="3" stroke-linecap="round"/><ellipse cx="22" cy="12" rx="22" ry="12" fill="var(--il-wall)" stroke="var(--il-dark)" stroke-width="1.5"/><path d="M10 5 q7 2 5 9 q-7 0 -5 -9Z" fill="var(--il-dark)"/><circle cx="30" cy="9" r="4" fill="var(--il-dark)"/><ellipse cx="46" cy="5" rx="8" ry="7" fill="var(--il-wall)" stroke="var(--il-dark)" stroke-width="1.5"/><path d="M43 -1 l-2 -5 M49 -1 l2 -5" stroke="var(--il-dark)" stroke-width="1.6" stroke-linecap="round"/></g>
      <rect x="229" y="150" width="10" height="36" rx="3" fill="var(--il-dark)"/><circle cx="214" cy="146" r="16" fill="var(--il-green)"/><circle cx="254" cy="146" r="16" fill="var(--il-green)"/><circle cx="234" cy="134" r="27" fill="var(--il-leaf)"/>
      ${[[222, 128], [244, 120], [238, 146], [252, 134], [216, 146], [230, 112]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.6" fill="var(--bad)"/>`).join('')}
      ${sheaves}
      <path d="M190 112 Q214 100 226 86" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="2 4"/>
      <g transform="translate(262 62)"><circle r="42" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/><g clip-path="url(#${uid}b)"><rect x="-42" y="16" width="84" height="30" fill="var(--surface-3)"/><rect x="-36" y="-26" width="38" height="12" rx="2" fill="var(--accent-deep)"/><rect x="-36" y="0" width="38" height="17" rx="2" fill="var(--accent-deep)"/><rect x="-38" y="-3" width="42" height="3.5" fill="var(--il-dark)"/><path d="M-30 -20 h8 M-14 -20 h8 M-30 6 h8 M-14 6 h8" stroke="var(--il-wall)" stroke-width="1.4"/><rect x="10" y="-28" width="19" height="44" rx="3" fill="var(--il-wall)" stroke="var(--il-dark)" stroke-width="1.5"/><path d="M10 -9 H29 M25 -22 v8 M25 -4 v8" stroke="var(--il-dark)" stroke-width="1.6"/></g></g>
      <text x="262" y="114" text-anchor="middle" font-size="8.5" fill="var(--muted)" font-family="var(--font-mono)">intérieur</text>
      <g transform="translate(330 18)"><rect width="56" height="34" rx="4" fill="var(--paper)" stroke="var(--il-line)"/><text x="28" y="13" text-anchor="middle" font-size="7.5" font-family="var(--font-mono)" fill="var(--paper-ink)" letter-spacing="1">ACTE</text><text x="28" y="26" text-anchor="middle" font-size="10" font-style="italic" font-family="var(--font-display)" fill="#5A28DA">usufruit</text></g>
      <text x="392" y="264" text-anchor="end" font-size="8" fill="var(--muted)" font-family="var(--font-mono)">terrain voisin</text>
      <g class="pins">${H.map((h, i) => `<g class="pin" data-i="${i}" transform="translate(${h[0]} ${h[1]})" tabindex="0" role="button" aria-label="${i + 1}. ${esc(h[2])}"><circle class="pin-pulse" r="11"/><circle class="pin-c" r="10.5"/><text dy="3.8" text-anchor="middle">${i + 1}</text></g>`).join('')}</g>
    </svg></div>
    <div class="farm-legend">${Object.keys(CATS).map(k => `<span><i class="cat-dot c-${k}"></i>${CATS[k]}</span>`).join('')}</div>
    <div class="farm-ui" aria-live="polite"></div></div>`;
  const ui = $('.farm-ui', el);
  let mode = 'explore'; const ans = {}; let sel = null;
  const setMode = m => {
    mode = m; Object.keys(ans).forEach(k => delete ans[k]); sel = null;
    $$('.seg-ctrl button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.mode === m));
    el.classList.toggle('is-defi', m === 'defi');
    $$('.pin', el).forEach(p => { p.setAttribute('class', 'pin' + (m === 'explore' ? ' c-' + H[+p.dataset.i][3] : '')); });
    ui.innerHTML = m === 'explore' ? `<div class="w-card"><p class="muted">Touche un numéro sur l’image. Les couleurs donnent la catégorie : la légende est juste au-dessus.</p></div>` : `<div class="w-card"><p><b>Défi :</b> touche un numéro, puis choisis sa catégorie. ${H.length} éléments à classer.</p><p class="muted" id="fsc">0/${H.length} classés · 0 bonne réponse</p></div>`;
  };
  const choose = i => {
    sel = i; const h = H[i];
    $$('.pin', el).forEach(p => p.classList.toggle('sel', +p.dataset.i === i));
    if (mode === 'explore'){ ui.innerHTML = `<div class="w-card farm-card"><span class="tag c-${h[3]}">${CATS[h[3]]}</span><b class="w-t">${i + 1}. ${h[2]}</b><p>${h[4]}</p></div>`; return; }
    if (ans[i] != null){ ui.innerHTML = `<div class="w-card farm-card"><span class="tag c-${h[3]}">${CATS[h[3]]}</span><b class="w-t">${i + 1}. ${h[2]}</b><p>${h[4]}</p></div>`; return; }
    ui.innerHTML = `<div class="w-card farm-card"><b class="w-t">${i + 1}. ${h[2]}</b><p class="muted">C’est quoi ?</p><div class="cats" style="margin-top:10px">${Object.keys(CATS).map(k => `<button class="cat" data-c="${k}">${CATS[k]}</button>`).join('')}</div></div>`;
    $$('.cat', ui).forEach(b => b.onclick = e => {
      const ok = b.dataset.c === h[3]; ans[i] = ok;
      const pin = $(`.pin[data-i="${i}"]`, el); pin.classList.add(ok ? 'ok' : 'ko', 'c-' + h[3]);
      if (ok) addXP(6, e);
      const done = Object.keys(ans).length, good = Object.values(ans).filter(Boolean).length;
      ui.innerHTML = `<div class="w-card farm-card"><div class="verdict ${ok ? 'good' : 'bad'}" style="font-weight:800">${ok ? 'Exact !' : 'Raté : ' + CATS[h[3]]}</div><b class="w-t">${i + 1}. ${h[2]}</b><p>${h[4]}</p><p class="muted">${done}/${H.length} classés · ${good} bonne${good > 1 ? 's' : ''} réponse${good > 1 ? 's' : ''}</p></div>`;
      if (done === H.length){ addXP(25, e); confetti(120); ui.innerHTML += `<div class="w-card" style="margin-top:10px"><b>Ferme terminée : ${good}/${H.length}.</b> <button class="btn btn-sm" data-again>Rejouer</button></div>`; $('[data-again]', ui).onclick = () => setMode('defi'); }
    });
  };
  $('.seg-ctrl', el).addEventListener('click', e => { const b = e.target.closest('[data-mode]'); if (b) setMode(b.dataset.mode); });
  const svg = $('.farm', el);
  svg.addEventListener('click', e => { const p = e.target.closest('.pin'); if (p) choose(+p.dataset.i); });
  svg.addEventListener('keydown', e => { const p = e.target.closest('.pin'); if (p && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); choose(+p.dataset.i); } });
  setMode(o.mode === 'defi' ? 'defi' : 'explore');
});

/* L’acte authentique : sceau puis publication */
JLG.widget('sceau', el => {
  el.innerHTML = `<div class="w w-acte">
    <div class="w-head"><span class="eyebrow">Schéma animé</span><b>Ce que change la signature du notaire</b><span class="muted">Appose le sceau, puis publie l’acte au service de la publicité foncière.</span></div>
    <div class="acte-stage">
      <div class="acte-doc"><div class="acte-k">Acte authentique</div><div class="acte-t">VENTE</div><div class="acte-lines"><i></i><i></i><i style="width:72%"></i><i></i><i style="width:58%"></i></div>
        <div class="acte-sign"><span>Le notaire</span><span class="acte-slot"></span></div>
        <div class="acte-seal" aria-hidden="true">${sealSVG({ring:false})}</div><div class="acte-pub" aria-hidden="true">Publié · SPF</div></div>
      <ul class="acte-fx">
        <li data-f="1"><b>Force probante</b><span>L’acte fait foi : le notaire s’engage personnellement sur son contenu.</span></li>
        <li data-f="1"><b>Date certaine</b><span>La date de l’acte ne peut pas être contestée.</span></li>
        <li data-f="1"><b>Force exécutoire</b><span>L’acte peut être exécuté comme un jugement, sans repasser devant un juge.</span></li>
        <li data-f="2"><b>Opposabilité aux tiers</b><span>Publiée au SPF du lieu de l’immeuble, la vente s’impose à tous.</span></li>
      </ul>
    </div>
    <div class="btn-row"><button class="btn btn-primary" data-s="1">${icon('seal')}Apposer le sceau</button><button class="btn" data-s="2" disabled>${icon('doc')}Publier au SPF</button><button class="btn btn-ghost btn-sm" data-s="0">Recommencer</button></div>
    <p class="w-note">À retenir : les 3 premières vertus viennent de <b>l’authenticité</b> de l’acte. La <b>publication</b> ajoute l’opposabilité aux tiers.</p></div>`;
  const doc = $('.acte-doc', el), b1 = $('[data-s="1"]', el), b2 = $('[data-s="2"]', el);
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-s]'); if (!b) return;
    const s = +b.dataset.s;
    if (s === 0){ doc.classList.remove('stamped', 'published'); $$('.acte-fx li', el).forEach(l => l.classList.remove('lit')); b1.disabled = false; b2.disabled = true; return; }
    if (s === 1){ doc.classList.add('stamped'); b1.disabled = true; b2.disabled = false; $$('.acte-fx li[data-f="1"]', el).forEach((l, k) => setTimeout(() => l.classList.add('lit'), 420 + k * 220)); addXP(3, e); }
    if (s === 2){ doc.classList.add('published'); b2.disabled = true; setTimeout(() => $('.acte-fx li[data-f="2"]', el).classList.add('lit'), 380); addXP(3, e); }
  });
});

/* Plan cadastral */
JLG.widget('cadastre', el => {
  const P = [
    [321, '20,40 95,30 100,120 25,125', '7 a 85 ca'], [322, '95,30 165,25 170,118 100,120', '7 a 20 ca'], [323, '165,25 240,30 238,115 170,118', '6 a 95 ca'], [324, '240,30 335,40 330,112 238,115', '9 a 60 ca'],
    [325, '25,125 100,120 105,198 30,198', '10 a 41 ca'], [326, '100,120 170,118 172,198 105,198', '6 a 02 ca'], [327, '170,118 238,115 240,198 172,198', '6 a 48 ca'], [328, '238,115 330,112 325,198 240,198', '8 a 05 ca'],
    [340, '20,228 120,228 118,256 20,256', '4 a 90 ca'], [341, '120,228 230,228 232,256 118,256', '5 a 12 ca'], [342, '230,228 340,228 340,256 232,256', '5 a 40 ca']
  ];
  const B = ['45,140,38,30', '116,46,34,30', '186,136,34,28', '262,150,40,24', '150,233,40,16'];
  const uid = 'c' + Math.random().toString(36).slice(2, 7);
  const cen = pts => { const a = pts.split(' ').map(p => p.split(',').map(Number)); return [a.reduce((s, p) => s + p[0], 0) / a.length, a.reduce((s, p) => s + p[1], 0) / a.length]; };
  el.innerHTML = `<div class="w w-cad">
    <div class="w-head"><span class="eyebrow">Plan schématique</span><b>Extrait de plan cadastral · Section AB</b><span class="muted">Exemple inspiré du cours (PULNOY, AB 325). Touche une parcelle.</span></div>
    <div class="seg-ctrl" role="tablist"><button role="tab" data-m="lire">Lire le plan</button><button role="tab" data-m="trouve">Trouve la parcelle</button></div>
    <div class="cad-wrap"><svg class="cad" viewBox="0 0 360 270" role="img" aria-label="Plan cadastral schématique de la section AB">
      <defs><pattern id="${uid}h" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="var(--fg)" stroke-width="1.2" opacity=".55"/></pattern></defs>
      <rect x="0" y="0" width="360" height="270" rx="14" fill="var(--surface)"/>
      <polygon points="20,200 340,200 340,226 20,226" fill="var(--surface-3)"/><text x="180" y="217" text-anchor="middle" font-size="9" font-style="italic" fill="var(--muted)" font-family="var(--font-display)">Allée des Mimosas</text>
      ${P.map(p => { const c = cen(p[1]); return `<g class="parc" data-n="${p[0]}" tabindex="0" role="button" aria-label="Parcelle ${p[0]}"><polygon points="${p[1]}"/><text x="${c[0].toFixed(0)}" y="${(c[1] + 4).toFixed(0)}" text-anchor="middle">${p[0]}</text></g>`; }).join('')}
      ${B.map(b => { const [x, y, w, h] = b.split(','); return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${uid}h)" stroke="var(--fg)" stroke-opacity=".5" pointer-events="none"/>`; }).join('')}
      <text x="338" y="24" text-anchor="end" font-size="22" font-weight="800" font-family="var(--font-display)" font-style="italic" fill="var(--accent)">AB</text>
      <g transform="translate(330 62)"><path d="M0 -14 L6 6 L0 2 L-6 6Z" fill="var(--fg)"/><text y="18" text-anchor="middle" font-size="8" fill="var(--muted)" font-family="var(--font-mono)">N</text></g>
    </svg></div>
    <div class="cad-legend"><span><i class="lg-b"></i>Bâti (hachuré)</span><span><b class="mono">AB</b> section</span><span><b class="mono">325</b> parcelle</span></div>
    <div class="cad-ui" aria-live="polite"></div></div>`;
  const ui = $('.cad-ui', el); let mode = 'lire', target = null, score = 0;
  const info = n => { const p = P.find(x => x[0] === n); const [a, ca] = [p[2].split(' a ')[0], p[2].split(' a ')[1].replace(' ca', '')]; return {p, txt:`00 ha ${pad2(a)} a ${pad2(ca)} ca`}; };
  const setMode = m => { mode = m; $$('.seg-ctrl button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.m === m)); $$('.parc', el).forEach(g => g.classList.remove('on', 'ok', 'ko'));
    if (m === 'lire') ui.innerHTML = `<div class="w-card"><p class="muted">Le plan découpe la commune en <b>sections</b> (lettres), puis en <b>parcelles</b> (numéros). Il est consultable par tous et ne donne pas le nom des propriétaires.</p></div>`;
    else { score = 0; next(); } };
  const next = () => { target = P[Math.floor(Math.random() * P.length)][0]; ui.innerHTML = `<div class="w-card"><p>Trouve la parcelle <b class="mono">AB ${target}</b> sur le plan.</p><p class="muted">Score : ${score}</p></div>`; };
  const choose = n => {
    $$('.parc', el).forEach(g => g.classList.toggle('on', +g.dataset.n === n));
    const {p, txt} = info(n);
    if (mode === 'lire'){ ui.innerHTML = `<div class="w-card"><div class="cad-ref"><span><small>Section</small><b>AB</b></span><span><small>N°</small><b>${p[0]}</b></span><span><small>Lieudit</small><b>Allée des Mimosas</b></span><span><small>Contenance</small><b>${txt}</b></span></div><p class="muted" style="margin-top:10px">Dans l’acte : « figurant au cadastre section AB numéro ${p[0]}, lieudit Allée des Mimosas, pour une contenance de ${p[2]} ».</p></div>`; return; }
    const g = $(`.parc[data-n="${n}"]`, el);
    if (n === target){ score++; g.classList.add('ok'); addXP(4, {target:g}); setTimeout(() => { g.classList.remove('ok', 'on'); next(); }, 700); }
    else { g.classList.add('ko'); setTimeout(() => g.classList.remove('ko'), 600); ui.innerHTML = `<div class="w-card"><p>Non, ça c’est la <b>${n}</b>. Cherche la <b class="mono">AB ${target}</b>.</p><p class="muted">Score : ${score}</p></div>`; }
  };
  const svg = $('.cad', el);
  svg.addEventListener('click', e => { const g = e.target.closest('.parc'); if (g) choose(+g.dataset.n); });
  svg.addEventListener('keydown', e => { const g = e.target.closest('.parc'); if (g && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); choose(+g.dataset.n); } });
  $('.seg-ctrl', el).addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (b) setMode(b.dataset.m); });
  setMode('lire'); choose(325);
});

/* Arbre de qualification d'une opération immobilière */
JLG.widget('qualif', el => {
  const Q = {
    q1:{q:'La propriété du bien (ou une partie) change-t-elle de mains ?', a:[['Oui', 'q2'], ['Non', 'q3']]},
    q2:{q:'Y a-t-il une contrepartie : un prix, ou une soulte en cas d’échange ?', a:[['Oui', 'oner'], ['Non', 'q4']]},
    q4:{q:'Le bénéficiaire doit-il supporter une charge en échange ?', a:[['Aucune charge', 'grat'], ['Oui, mais moindre que la valeur reçue', 'grat'], ['Oui, et elle vaut autant que le bien', 'requal']]},
    q3:{q:'Que se passe-t-il alors ?', a:[['On laisse l’usage du bien contre un loyer', 'loc'], ['On garantit un prêt avec le bien', 'gar'], ['On impose une charge au profit du terrain voisin', 'serv']]}
  };
  const R = {
    oner:['Mutation à titre onéreux', 'Transfert de propriété contre un prix (vente) ou une soulte (échange).', 'Acte authentique notarié obligatoire.'],
    grat:['Mutation à titre gratuit', 'Transfert de propriété sans contrepartie financière : donation, succession, legs.', 'Acte authentique notarié obligatoire (donation, attestation immobilière après un décès…).'],
    requal:['Requalification : titre onéreux', 'Si l’avantage demandé n’est pas moindre que ce qui est donné, l’opération n’est plus gratuite.', 'Bien qualifier change tout : formalités et taxes ne sont pas les mêmes.'],
    loc:['Location (bail)', 'Aucun transfert de propriété : le bailleur laisse l’usage du bien au locataire contre un loyer.', 'Notaire obligatoire seulement pour un bail de plus de 12 ans (publication au SPF).'],
    gar:['Prise de garantie', 'Le prêteur grève l’immeuble d’une sûreté pour s’assurer du remboursement : hypothèque conventionnelle, légale ou judiciaire.', 'Le bien reste au propriétaire, mais il est « grevé ».'],
    serv:['Constitution de servitude', 'Une charge grève le fonds servant au profit du fonds dominant : passage, échelle, tréfonds…', 'Le fonds qui en profite est dominant, celui qui la subit est servant.']
  };
  const EX = [['M. Leroy vend sa maison 280 000 €.', 'oner'], ['Deux agriculteurs échangent leurs champs ; l’un verse une soulte à l’autre.', 'oner'], ['Une grand-mère donne un terrain à sa petite-fille.', 'grat'], ['Un fils hérite de l’usufruit d’un appartement.', 'grat'], ['Un étudiant loue un studio meublé.', 'loc'], ['La banque prend une hypothèque sur la maison achetée à crédit.', 'gar'], ['Le voisin obtient le droit de passer sur ton terrain pour rejoindre sa maison.', 'serv'], ['On donne une ferme à charge pour le donataire de payer une somme qui vaut autant que la ferme.', 'requal'], ['Un fleuriste prend à bail une boutique pour 9 ans.', 'loc'], ['Un frère cède à sa sœur sa part indivise d’un local commercial contre un prix.', 'oner']];
  let path = [], ex = null, scoreOk = 0, scoreN = 0;
  el.innerHTML = `<div class="w w-qual"><div class="w-head"><span class="eyebrow">Arbre de décision</span><b>Quelle opération immobilière ?</b><span class="muted">Réponds aux questions, comme le ferait le notaire.</span></div>
    <div class="seg-ctrl" role="tablist"><button role="tab" data-m="libre">Mode libre</button><button role="tab" data-m="test">Teste-toi sur des exemples</button></div>
    <div class="q-ex"></div><ol class="q-path"></ol><div class="q-box" aria-live="polite"></div></div>`;
  const box = $('.q-box', el), pth = $('.q-path', el), exb = $('.q-ex', el);
  const render = node => {
    pth.innerHTML = path.map(p => `<li><span class="muted">${Q[p.n].q}</span><b>${p.a}</b></li>`).join('');
    if (R[node]){
      const r = R[node]; let verdict = '';
      if (ex){ const ok = node === ex[1]; scoreN++; if (ok) scoreOk++; verdict = `<div class="verdict ${ok ? 'good' : 'bad'}" style="font-weight:800;margin-bottom:6px">${ok ? 'Bonne qualification !' : 'Pas la bonne : il fallait « ' + R[ex[1]][0] + ' »'}</div>`; if (ok) addXP(6, {target:box}); }
      box.innerHTML = `<div class="w-card q-res">${verdict}<span class="eyebrow">Résultat</span><b class="w-t">${r[0]}</b><p>${r[1]}</p><p class="muted">${r[2]}</p><div class="btn-row" style="margin-top:12px"><button class="btn btn-sm btn-primary" data-restart>${ex ? 'Exemple suivant' : 'Recommencer'}</button></div>${ex ? `<p class="muted" style="margin-top:8px">Score : ${scoreOk}/${scoreN}</p>` : ''}</div>`;
      $('[data-restart]', box).onclick = () => start(!!ex);
      return;
    }
    const q = Q[node];
    box.innerHTML = `<div class="w-card"><b class="w-t">${q.q}</b><div class="q-ans">${q.a.map((a, i) => `<button class="btn" data-i="${i}">${a[0]}</button>`).join('')}</div></div>`;
    $$('[data-i]', box).forEach(b => b.onclick = () => { const a = q.a[+b.dataset.i]; path.push({n:node, a:a[0]}); render(a[1]); });
  };
  const start = test => { path = []; ex = test ? EX[Math.floor(Math.random() * EX.length)] : null; exb.innerHTML = ex ? `<div class="enonce" style="padding:14px 16px"><div class="ek">Situation</div><p style="margin-top:4px">${ex[0]}</p></div>` : ''; render('q1'); };
  $('.seg-ctrl', el).addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (!b) return; $$('.seg-ctrl button', el).forEach(x => x.setAttribute('aria-selected', x === b)); start(b.dataset.m === 'test'); });
  $$('.seg-ctrl button', el)[0].setAttribute('aria-selected', 'true'); start(false);
});

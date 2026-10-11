
/* =================== SCHÉMAS — IMMOBILIER, SÉANCE 2 =================== */
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const frDate = iso => { const p = String(iso || '').split('-').map(Number); if (!p[0] || !p[1] || !p[2]) return '…'; return (p[2] === 1 ? '1er' : p[2]) + ' ' + MOIS[p[1] - 1] + ' ' + p[0]; };
const eurN = v => Math.round(v).toLocaleString('fr-FR') + ' €';
const keyAct = (node, fn) => node.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fn(e); } });

/* ——— Les trois caractères (triangle) ——— */
JLG.widget('caracteres', el => {
  const C = {
    ab:{l:'Absolu', ref:'Art. 544 C. civ.', x:160, y:50, s:'Le propriétaire a la <b>plénitude des pouvoirs</b> sur son bien : il l’utilise, en perçoit les fruits et en dispose. Le droit n’est absolu que si les <b>3 attributs</b> sont réunis sur sa tête.', lim:['Les lois et les règlements : « pourvu qu’on n’en fasse pas un usage prohibé »', 'L’urbanisme : PLU, déclaration préalable, permis de construire', 'Le voisinage : vues, plantations', 'La réquisition, le bail forcé, l’expropriation'], ex:'Tu peux peindre tes volets en violet… sauf si le règlement du lotissement l’interdit.'},
    ex:{l:'Exclusif', ref:'Action en revendication', x:62, y:218, s:'Le propriétaire peut <b>exclure les tiers</b> : il a le monopole de son bien. Contre un occupant, il agit <b>en revendication</b>, une action imprescriptible (art. 2227).', lim:['Les servitudes : le voisin qui a un droit de passage', 'La prescription acquisitive : 10 ans (bonne foi et juste titre) ou 30 ans', 'Jamais au profit d’un simple toléré (art. 2262)'], ex:'Ton voisin a installé son abri de jardin chez toi : tu peux exiger qu’il l’enlève… sauf s’il l’a possédé assez longtemps pour l’usucaper.'},
    pe:{l:'Perpétuel', ref:'Pas d’extinction par le non-usage', x:258, y:218, s:'Le droit dure <b>autant que le bien</b> : il se transmet par succession, survit à son titulaire et ne se perd pas, même après une très longue inoccupation.', lim:['L’expropriation pour cause d’utilité publique (art. 545)', 'L’usucapion par un autre possesseur'], ex:'Une maison vide depuis 40 ans appartient toujours à son propriétaire, ou à ses héritiers… sauf si quelqu’un l’a possédée pendant 30 ans.'}
  };
  const keys = Object.keys(C);
  el.innerHTML = `<div class="w w-car">
    <div class="w-head"><span class="eyebrow">Schéma interactif</span><b>Absolu, exclusif, perpétuel</b><span class="muted">Touche un sommet du triangle : son sens, ses limites, un exemple.</span></div>
    <div class="car-grid">
      <svg viewBox="0 0 320 262" class="car-svg" role="group" aria-label="Les trois caractères du droit de propriété">
        <path class="car-fill" d="M160 50 L62 218 L258 218 Z"/>
        <line class="car-e" pathLength="1" x1="160" y1="50" x2="62" y2="218"/><line class="car-e" pathLength="1" x1="62" y1="218" x2="258" y2="218" style="animation-delay:.25s"/><line class="car-e" pathLength="1" x1="258" y1="218" x2="160" y2="50" style="animation-delay:.5s"/>
        <g class="car-c"><circle cx="160" cy="162" r="34"/><text x="160" y="158" text-anchor="middle" class="car-ct">PROPRIÉTÉ</text><text x="160" y="173" text-anchor="middle" class="car-cs">art. 544</text></g>
        ${keys.map((k, i) => `<g class="car-v" data-k="${k}" tabindex="0" role="button" aria-label="${C[k].l}" style="animation-delay:${.35 + i * .15}s"><circle class="car-halo" cx="${C[k].x}" cy="${C[k].y}" r="44"/><circle class="car-dot" cx="${C[k].x}" cy="${C[k].y}" r="36"/><text x="${C[k].x}" y="${C[k].y + 5}" text-anchor="middle" class="car-vt">${C[k].l}</text></g>`).join('')}
      </svg>
      <div class="w-card car-card" aria-live="polite"></div>
    </div></div>`;
  const card = $('.car-card', el);
  const show = k => {
    const d = C[k];
    $$('.car-v', el).forEach(g => g.classList.toggle('on', g.dataset.k === k));
    card.innerHTML = `<div class="car-h"><b>${d.l}</b><span class="tag plain">${d.ref}</span></div><p>${d.s}</p><div class="car-lim"><span class="eyebrow">Ses limites</span><ul>${d.lim.map(x => `<li>${x}</li>`).join('')}</ul></div><p class="car-ex">${icon('bulb')}<span>${d.ex}</span></p>`;
    card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';
  };
  $$('.car-v', el).forEach(g => { g.addEventListener('click', () => show(g.dataset.k)); keyAct(g, () => show(g.dataset.k)); });
  show('ab');
});

/* ——— Usucapion (prescription acquisitive) ——— */
const PRES_CASES = [
  {t:'Marc achète en 2013 un champ à un vendeur qui n’en était pas propriétaire. Il est de bonne foi et le cultive depuis, au vu de tous. Nous sommes en 2026.', a:'oui', w:'Juste titre (la vente) + bonne foi : 10 ans suffisent. Il en compte 13 : usucapion acquise.'},
  {t:'Léa occupe depuis 2004 une cabane sur le terrain d’autrui, en sachant très bien qu’elle n’est pas à elle. Nous sommes en 2026.', a:'non', w:'Mauvaise foi : il faut 30 ans. Elle n’en compte que 22.'},
  {t:'Depuis 40 ans, M. Blanc traverse le jardin de sa voisine pour rejoindre la rue, parce qu’elle le lui permet gentiment.', a:'jamais', w:'Acte de simple tolérance : ni possession, ni prescription (art. 2262), même au bout de 40 ans.'},
  {t:'Sophie a acheté en 2020, de bonne foi, un terrain à quelqu’un qui n’en était pas propriétaire. Nous sommes en 2026.', a:'non', w:'Bonne foi et juste titre : 10 ans. Elle n’en compte que 6.'},
  {t:'Paul occupe depuis 1990 une parcelle qu’il sait appartenir à son cousin, au vu de tous et sans que personne ne réagisse. Nous sommes en 2026.', a:'oui', w:'Mauvaise foi, donc 30 ans… et il en compte 36 : usucapion acquise.'},
  {t:'Nina exploite depuis 2014 un bois qu’elle croit avoir hérité, mais aucun acte ne le lui a transmis. Nous sommes en 2026.', a:'non', w:'Bonne foi, mais pas de juste titre : il faut 30 ans. Elle n’en compte que 12.'},
  {t:'Un agriculteur laisse son voisin stocker du bois dans sa grange depuis 32 ans, par amitié.', a:'jamais', w:'Simple tolérance : le voisin n’a jamais possédé, il ne peut rien prescrire.'}
];
JLG.widget('prescription', (el, o) => {
  const head = `<div class="w-head"><span class="eyebrow">${o.mode === 'defi' ? 'Défi' : 'Simulateur'}</span><b>Usucapion : le possesseur devient-il propriétaire ?</b><span class="muted">${o.mode === 'defi' ? 'Lis la situation, puis tranche.' : 'Règle les conditions et fais avancer le temps.'}</span></div>`;
  if (o.mode === 'defi'){
    const list = shuffle(PRES_CASES).slice(0, 5); let i = 0, sc = 0;
    const draw = () => {
      if (i >= list.length){ el.innerHTML = `<div class="w w-pres">${head}<div class="result" style="padding:18px"><h2>${sc}/${list.length}</h2><p class="muted">${sc === list.length ? 'Parfait : tu raisonnes comme un notaire.' : 'Retiens : 10 ans = bonne foi ET juste titre ; tolérance = jamais.'}</p><button class="btn btn-primary" data-again>${icon('refresh')}Rejouer</button></div></div>`; if (sc === list.length) confetti(70); $('[data-again]', el).onclick = () => { list.splice(0, list.length, ...shuffle(PRES_CASES).slice(0, 5)); i = 0; sc = 0; draw(); }; return; }
      const c = list[i];
      el.innerHTML = `<div class="w w-pres">${head}<div class="qbar"><span class="qn">${i + 1}/${list.length}</span><span class="meter"><i style="width:${i / list.length * 100}%"></i></span><span class="qn">${sc} ✓</span></div>
        <div class="enonce pr-case"><div class="ek">Situation</div><p>${c.t}</p></div>
        <div class="pr-ans"><button class="opt" data-a="oui">Usucapion acquise</button><button class="opt" data-a="non">Pas encore</button><button class="opt" data-a="jamais">Jamais</button></div><div class="pr-out"></div></div>`;
      $$('[data-a]', el).forEach(b => b.onclick = e => {
        const ok = b.dataset.a === c.a;
        $$('[data-a]', el).forEach(x => { x.disabled = true; if (x.dataset.a === c.a) x.classList.add('is-right'); else if (x !== b) x.classList.add('dim'); });
        if (!ok) b.classList.add('is-wrong'); else { sc++; addXP(8, e); }
        $('.pr-out', el).innerHTML = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Exact !' : 'Pas tout à fait.'}</div><p>${c.w}</p></div><div class="qnext"><button class="btn btn-primary" data-n>${i + 1 < list.length ? 'Situation suivante' : 'Résultat'}${icon('arrow')}</button></div>`;
        $('[data-n]', el).onclick = () => { i++; draw(); };
      });
    };
    draw(); return;
  }
  let bf = true, jt = true, tol = false, yrs = 8, wasWon = false;
  const CIRC = 2 * Math.PI * 66, uid = Math.random().toString(36).slice(2, 7);
  el.innerHTML = `<div class="w w-pres">${head}
    <div class="pres-tog" role="group" aria-label="Conditions de la possession">
      <button aria-pressed="true" data-t="bf">Bonne foi</button><button aria-pressed="true" data-t="jt">Juste titre</button><button aria-pressed="false" data-t="tol">Simple tolérance</button>
    </div>
    <div class="pres-main">
      <div class="pres-ring"><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="66" class="pr-track"/><circle cx="80" cy="80" r="66" class="pr-prog" stroke-dasharray="${CIRC.toFixed(1)}" stroke-dashoffset="${CIRC.toFixed(1)}"/></svg><div class="pr-in"><b class="prY">8</b><span class="prN">ans sur 10</span></div><div class="pres-stamp" aria-hidden="true">${sealSVG({ring:false})}<span>Prescrit</span></div></div>
      <div class="pres-side">
        <div class="field"><label for="prS-${uid}">Années de possession : <b class="prL">8 ans</b></label><input type="range" id="prS-${uid}" class="prS" min="0" max="35" value="8"></div>
        <div class="pres-scale" aria-hidden="true"><span style="left:${10 / 35 * 100}%">10 ans</span><span style="left:${30 / 35 * 100}%">30 ans</span></div>
        <div class="w-card pr-v" aria-live="polite"></div>
      </div>
    </div></div>`;
  const root = $('.w-pres', el), prog = $('.pr-prog', el);
  const draw = () => {
    const need = bf && jt ? 10 : 30;
    const won = !tol && yrs >= need;
    $('.prY', el).textContent = tol ? '∞' : yrs; $('.prN', el).textContent = tol ? 'jamais' : `an${yrs > 1 ? 's' : ''} sur ${need}`; $('.prL', el).textContent = yrs + (yrs > 1 ? ' ans' : ' an');
    prog.style.strokeDashoffset = tol ? CIRC : (CIRC * (1 - Math.min(1, yrs / need))).toFixed(1);
    root.classList.toggle('tol', tol); root.classList.toggle('won', won);
    let msg;
    if (tol) msg = `<p><b>Jamais.</b> Un acte de <b>simple tolérance</b> ne fonde ni possession ni prescription (art. 2262). Le propriétaire peut y mettre fin quand il veut, même après 40 ans.</p>`;
    else if (won) msg = `<p><b>Usucapion acquise !</b> ${need === 10 ? 'Bonne foi + juste titre : <b>10 ans</b> suffisent' : 'Sans bonne foi ou sans juste titre : il fallait <b>30 ans</b>'}. Le possesseur est devenu propriétaire ; l’action en revendication du propriétaire échoue.</p>`;
    else msg = `<p><b>Pas encore.</b> Il faut ${need} ans ${need === 10 ? '(bonne foi + juste titre, art. 2272 al. 2)' : bf ? '(bonne foi, mais pas de juste titre : art. 2272 al. 1)' : '(mauvaise foi : art. 2272 al. 1)'}. Il manque <b>${need - yrs} an${need - yrs > 1 ? 's' : ''}</b>.</p>`;
    $('.pr-v', el).innerHTML = msg;
    if (won && !wasWon && !reduced()) confetti(36);
    wasWon = won;
  };
  $('.pres-tog', el).addEventListener('click', e => {
    const b = e.target.closest('[data-t]'); if (!b) return;
    const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on);
    if (b.dataset.t === 'bf') bf = on; else if (b.dataset.t === 'jt') jt = on; else tol = on;
    draw();
  });
  $('.prS', el).addEventListener('input', e => { yrs = +e.target.value; draw(); });
  draw();
});

/* ——— Barème de l’usufruit (art. 669 CGI) ——— */
JLG.widget('bareme', el => {
  const T = [[21, 90, 'Moins de 21 ans'], [31, 80, '21 à 30 ans'], [41, 70, '31 à 40 ans'], [51, 60, '41 à 50 ans'], [61, 50, '51 à 60 ans'], [71, 40, '61 à 70 ans'], [81, 30, '71 à 80 ans'], [91, 20, '81 à 90 ans'], [999, 10, '91 ans et plus']];
  const row = age => T.findIndex(r => age < r[0]);
  let age = 64, val = 300000, raf = 0, ended = false;
  el.innerHTML = `<div class="w w-bm">
    <div class="w-head"><span class="eyebrow">Calculateur · art. 669 CGI</span><b>Combien vaut l’usufruit ?</b><span class="muted">Change l’âge de l’usufruitier : plus il vieillit, plus la nue-propriété vaut cher.</span></div>
    <div class="bm-in">
      <div class="bm-age" aria-hidden="true"><b class="bmA">64</b><span>ans</span></div>
      <div class="field bm-sl"><label for="bmS">Âge de l’usufruitier</label><input type="range" id="bmS" class="bmS" min="0" max="100" value="64"></div>
      <div class="field bm-v"><label for="bmV">Valeur du bien (€)</label><input id="bmV" class="bmV" inputmode="numeric" value="300 000"></div>
    </div>
    <div class="bm-bar" aria-live="polite"><div class="bm-u"><span>Usufruit</span><b></b><em></em></div><div class="bm-n"><span>Nue-propriété</span><b></b><em></em></div></div>
    <p class="w-note bm-x"></p>
    <div class="btn-row"><button class="btn btn-sm btn-primary bm-play">${icon('play')}Faire passer les années</button></div>
    <div class="bm-tbl" role="table" aria-label="Barème fiscal"><div class="bm-r bm-hd" role="row"><span role="columnheader">Âge</span><b role="columnheader">Usufruit</b><b role="columnheader">Nue-prop.</b></div>${T.map((r, i) => `<div class="bm-r" role="row" data-i="${i}"><span role="cell">${r[2]}</span><b role="cell">${r[1]} %</b><b role="cell">${100 - r[1]} %</b></div>`).join('')}</div>
  </div>`;
  const root = $('.w-bm', el), U = $('.bm-u', el), N = $('.bm-n', el);
  const draw = () => {
    const i = row(age), p = T[i][1];
    root.classList.remove('dead'); ended = false;
    $('.bmA', el).textContent = age;
    U.style.flexBasis = p + '%'; N.style.flexBasis = (100 - p) + '%';
    $('b', U).textContent = p + ' %'; $('em', U).textContent = eurN(val * p / 100);
    $('b', N).textContent = (100 - p) + ' %'; $('em', N).textContent = eurN(val * (100 - p) / 100);
    $$('.bm-r[data-i]', el).forEach(r => r.classList.toggle('on', +r.dataset.i === i));
    $('.bm-x', el).innerHTML = `À <b>${age} ans</b> (${T[i][2].toLowerCase()}), l’usufruit vaut <b>${p} %</b> et la nue-propriété <b>${100 - p} %</b>. Une donation de la nue-propriété serait taxée sur <b>${eurN(val * (100 - p) / 100)}</b>.`;
  };
  const end = () => {
    ended = true; root.classList.add('dead');
    U.style.flexBasis = '0%'; N.style.flexBasis = '100%';
    $('span', N).textContent = 'Pleine propriété'; $('b', N).textContent = '100 %'; $('em', N).textContent = eurN(val);
    $('.bm-x', el).innerHTML = `<b>Décès de l’usufruitier :</b> l’usufruit s’éteint et rejoint la nue-propriété. Le nu-propriétaire devient <b>plein propriétaire</b>, sans droits à payer (art. 1133 CGI).`;
  };
  $('.bmS', el).addEventListener('input', e => { cancelAnimationFrame(raf); $('span', N).textContent = 'Nue-propriété'; age = +e.target.value; draw(); });
  $('.bmV', el).addEventListener('input', e => { val = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0; if (ended) end(); else draw(); });
  $('.bmV', el).addEventListener('blur', e => { e.target.value = fmtNum(val); });
  $('.bm-play', el).onclick = () => {
    cancelAnimationFrame(raf); $('span', N).textContent = 'Nue-propriété';
    const a0 = age >= 90 ? 20 : age, a1 = 96, dur = reduced() ? 1 : 5200; const t0 = performance.now();
    const step = t => {
      if (!el.isConnected) return;
      const k = clamp((t - t0) / dur, 0, 1); age = Math.round(a0 + (a1 - a0) * k); $('.bmS', el).value = age; draw();
      if (k < 1) raf = requestAnimationFrame(step); else setTimeout(() => { if (el.isConnected && age === a1) end(); }, reduced() ? 0 : 600);
    };
    raf = requestAnimationFrame(step);
  };
  draw();
});

/* ——— La maison en trois étages : qui a quoi ? ——— */
const ETA_H = {
  pp:{l:'Plein propriétaire', q:'Le plein propriétaire', a:['us', 'fr', 'ab'], x:'Il réunit les <b>3 attributs</b> : c’est la pleine propriété.'},
  us:{l:'Usufruitier', q:'L’usufruitier', a:['us', 'fr'], x:'<b>Usus + fructus</b> : il habite ou il loue, mais il ne dispose pas de l’immeuble.'},
  np:{l:'Nu-propriétaire', q:'Le nu-propriétaire', a:['ab'], x:'L’<b>abusus</b> seul : il attend l’extinction de l’usufruit pour devenir plein propriétaire.'},
  du:{l:'Usager (DUH)', q:'L’usager (DUH)', a:['us'], x:'L’<b>usus</b> seul : il occupe le bien, sans le louer ni en disposer.'}
};
const ETA_A = [
  {l:'Habiter le logement', q:'habiter le logement', v:{pp:'y', us:'y', np:'n', du:'y'}, n:{np:'Il n’a pas l’usus.'}},
  {l:'Le louer et toucher les loyers', q:'louer le bien et toucher les loyers', v:{pp:'y', us:'y', np:'n', du:'n'}, n:{us:'Pour un bail rural, commercial, industriel ou artisanal : avec le nu-propriétaire.', du:'Habiter, oui ; louer, non.', np:'Les loyers vont à l’usufruitier.'}},
  {l:'Vendre l’immeuble en pleine propriété', q:'vendre l’immeuble en pleine propriété', v:{pp:'y', us:'a', np:'a', du:'n'}, n:{us:'Seulement en signant avec le nu-propriétaire.', np:'Seulement en signant avec l’usufruitier.'}},
  {l:'Céder son propre droit', q:'céder son propre droit', v:{pp:'y', us:'y', np:'y', du:'n'}, n:{us:'Art. 595 : il peut vendre ou céder son usufruit.', np:'Il peut céder seul sa nue-propriété.', du:'Le droit d’usage et d’habitation ne se cède pas.'}},
  {l:'Démolir la maison', q:'démolir la maison', v:{pp:'y', us:'n', np:'n', du:'n'}, n:{np:'Pas tant que dure l’usufruit.'}},
  {l:'Devenir un jour plein propriétaire', q:'devenir un jour plein propriétaire', v:{pp:'-', us:'n', np:'y', du:'n'}, n:{pp:'C’est déjà le cas !', us:'Son droit s’éteint à son décès.', np:'Au décès de l’usufruitier, l’usufruit s’éteint et le rejoint.', du:'Son droit viager s’éteint à son décès.'}}
];
const ETA_V = {y:['Oui', 'good'], n:['Non', 'bad'], a:['Avec l’accord de l’autre', 'warn'], '-':['Déjà fait', 'plain']};
function etaHouse(){
  const band = (k, y, h, ic, t, s) => `<g class="eta-b" data-a="${k}"><rect x="34" y="${y}" width="172" height="${h}" rx="3"/><circle cx="62" cy="${y + h / 2}" r="15" class="eta-ic"/><g transform="translate(${62 - 9} ${y + h / 2 - 9}) scale(.75)" class="eta-g">${ic}</g><text x="88" y="${y + h / 2 - 3}" class="eta-t">${t}</text><text x="88" y="${y + h / 2 + 12}" class="eta-s">${s}</text></g>`;
  return `<svg viewBox="0 0 240 262" class="eta-svg" aria-hidden="true">
    <path d="M24 98 L120 22 L216 98 Z" class="eta-roof"/><rect x="164" y="34" width="18" height="34" class="eta-chim"/>
    ${band('us', 96, 54, '<path d="M6 21v-7h12v7M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>', 'Usus', 'Habiter, utiliser')}
    ${band('fr', 152, 54, '<path d="M18 6.5A6.5 6.5 0 1 0 18 17.5M4 10.5h9M4 13.5h9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>', 'Fructus', 'Toucher les loyers')}
    ${band('ab', 208, 46, '<path d="M4 20l4-1 11-11-3-3L5 16zM14 6l3 3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>', 'Abusus', 'Vendre, donner')}
    <path class="eta-brace" d=""/>
  </svg>`;
}
JLG.widget('etages', (el, o) => {
  const keys = Object.keys(ETA_H);
  if (o.mode === 'defi'){
    const pool = []; ETA_A.forEach((a, ai) => keys.forEach(h => { if (a.v[h] !== '-') pool.push({ai, h}); }));
    let list = shuffle(pool).slice(0, 8), i = 0, sc = 0;
    const head = `<div class="w-head"><span class="eyebrow">Défi</span><b>Qui a le droit de… ?</b><span class="muted">Oui, non, ou seulement avec l’accord de l’autre ?</span></div>`;
    const draw = () => {
      if (i >= list.length){ el.innerHTML = `<div class="w w-eta">${head}<div class="result" style="padding:18px"><h2>${sc}/${list.length}</h2><p class="muted">${sc >= 7 ? 'Usus, fructus, abusus : tu maîtrises.' : 'Revois la maison en trois étages, puis rejoue.'}</p><button class="btn btn-primary" data-again>${icon('refresh')}Rejouer</button></div></div>`; if (sc === list.length) confetti(70); $('[data-again]', el).onclick = () => { list = shuffle(pool).slice(0, 8); i = 0; sc = 0; draw(); }; return; }
      const it = list[i], a = ETA_A[it.ai], h = ETA_H[it.h], good = a.v[it.h];
      el.innerHTML = `<div class="w w-eta">${head}<div class="qbar"><span class="qn">${i + 1}/${list.length}</span><span class="meter"><i style="width:${i / list.length * 100}%"></i></span><span class="qn">${sc} ✓</span></div>
        <div class="enonce"><div class="ek">${h.l}</div><p class="eta-q">${h.q} peut-il ${a.q} ?</p></div>
        <div class="pr-ans"><button class="opt" data-v="y">Oui</button><button class="opt" data-v="a">Avec l’accord de l’autre</button><button class="opt" data-v="n">Non</button></div><div class="pr-out"></div></div>`;
      $$('[data-v]', el).forEach(b => b.onclick = e => {
        const ok = b.dataset.v === good;
        $$('[data-v]', el).forEach(x => { x.disabled = true; if (x.dataset.v === good) x.classList.add('is-right'); else if (x !== b) x.classList.add('dim'); });
        if (!ok) b.classList.add('is-wrong'); else { sc++; addXP(6, e); }
        $('.pr-out', el).innerHTML = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Exact !' : 'Non : ' + ETA_V[good][0].toLowerCase()}</div><p>${(a.n && a.n[it.h]) || h.x}</p></div><div class="qnext"><button class="btn btn-primary" data-n>${i + 1 < list.length ? 'Question suivante' : 'Résultat'}${icon('arrow')}</button></div>`;
        $('[data-n]', el).onclick = () => { i++; draw(); };
      });
    };
    draw(); return;
  }
  el.innerHTML = `<div class="w w-eta">
    <div class="w-head"><span class="eyebrow">Schéma interactif</span><b>La maison en trois étages</b><span class="muted">Choisis un titulaire : ses étages s’allument, ses droits s’affichent.</span></div>
    <div class="seg-ctrl" role="tablist">${keys.map(k => `<button role="tab" data-h="${k}">${ETA_H[k].l}</button>`).join('')}</div>
    <div class="eta-grid">${etaHouse()}<div class="eta-side"><div class="w-card eta-x" aria-live="polite"></div><ul class="eta-acts">${ETA_A.map((a, i) => `<li data-i="${i}"><span>${a.l}</span><span class="tag"></span><small></small></li>`).join('')}</ul></div></div></div>`;
  const brace = $('.eta-brace', el);
  const Y = {us:[96, 150], fr:[152, 206], ab:[208, 254]};
  const show = h => {
    const d = ETA_H[h];
    $$('.seg-ctrl button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.h === h));
    $$('.eta-b', el).forEach(g => g.classList.toggle('on', d.a.includes(g.dataset.a)));
    const ys = d.a.map(k => Y[k]); const y0 = Math.min(...ys.map(v => v[0])) + 2, y1 = Math.max(...ys.map(v => v[1])) - 2, ym = (y0 + y1) / 2;
    brace.setAttribute('d', `M26 ${y0} q-8 0 -8 8 V${ym - 8} q0 8 -8 8 q8 0 8 8 V${y1 - 8} q0 8 8 8`);
    brace.classList.remove('draw'); void brace.getBoundingClientRect(); brace.classList.add('draw');
    $('.eta-x', el).innerHTML = `<p><b>${d.l}</b> · ${d.x}</p>`;
    $$('.eta-acts li', el).forEach(li => { const a = ETA_A[+li.dataset.i]; const v = ETA_V[a.v[h]]; const t = $('.tag', li); t.className = 'tag ' + v[1]; t.textContent = v[0]; $('small', li).textContent = (a.n && a.n[h]) || ''; li.classList.remove('pop'); void li.offsetWidth; li.classList.add('pop'); });
  };
  $('.seg-ctrl', el).addEventListener('click', e => { const b = e.target.closest('[data-h]'); if (b) show(b.dataset.h); });
  show('pp');
  setTimeout(() => { if (el.isConnected && $('.seg-ctrl [aria-selected="true"]', el).dataset.h === 'pp') show('us'); }, 1700);
});

/* ——— Servitudes : la division du cours (plan) ——— */
JLG.widget('servitudes', el => {
  const M = {
    passage:{l:'Passage + réseaux', x:'<b>Servitude de passage et de réseaux.</b> Pour rejoindre la rue, la maison A (au fond) passe sur la bande de la parcelle B, sous laquelle courent aussi ses canalisations (eau, électricité). La parcelle <b>B</b> est le <b>fonds servant</b>, la parcelle <b>A</b> le <b>fonds dominant</b>.'},
    cour:{l:'Cour commune', x:'<b>Servitude de cour commune</b> entre A et B : sur cette zone, on ne construit pas (ou pas au-delà d’une certaine hauteur). Elle permet de bâtir B plus près de A : c’est une composante du <b>permis de construire de B</b>.'},
    roles:{l:'Active ou passive ?', x:'Pour A, la servitude de passage est <b>active</b> : il en profite. Pour B, elle est <b>passive</b> : il la supporte. La servitude est attachée aux terrains, pas aux personnes : si A ou B vendent, elle suit le terrain, et le notaire la reprend dans la clause « servitudes ».'}
  };
  el.innerHTML = `<div class="w w-sv">
    <div class="w-head"><span class="eyebrow">Le schéma du cours, animé</span><b>Diviser un terrain : les servitudes</b><span class="muted">Une maison initiale (A) au fond, une maison neuve (B) sur la rue.</span></div>
    <div class="seg-ctrl" role="tablist">${Object.keys(M).map(k => `<button role="tab" data-m="${k}">${M[k].l}</button>`).join('')}</div>
    <svg viewBox="0 0 360 262" class="sv-svg" role="img" aria-label="Plan : parcelle résiduelle avec la maison A, nouvelle parcelle avec la maison B, servitude de passage et de réseaux, servitude de cour commune">
      <rect x="0" y="0" width="46" height="262" class="sv-road"/><line x1="23" y1="0" x2="23" y2="262" class="sv-road-l"/>
      <text class="sv-road-t" transform="translate(30 222) rotate(-90)">Voie publique</text>
      <polygon points="58,22 204,22 204,150 272,150 272,242 58,242" class="sv-par sv-pB"/>
      <rect x="204" y="22" width="140" height="128" class="sv-par sv-pA"/>
      <rect x="58" y="22" width="146" height="40" class="sv-strip"/>
      <path d="M46 34 H216 V62 H228" class="sv-flow sv-water"/><path d="M46 50 H210 V92 H228" class="sv-flow sv-elec"/>
      <g class="sv-carg"><rect x="-8" y="-5" width="16" height="10" rx="3" class="sv-car"/></g>
      <rect x="176" y="114" width="60" height="58" class="sv-cour"/>
      <rect x="228" y="46" width="94" height="62" rx="2" class="sv-house"/><text x="275" y="84" class="sv-hl">A</text>
      <rect x="82" y="96" width="94" height="104" rx="2" class="sv-house"/><text x="129" y="156" class="sv-hl">B</text>
      <text x="290" y="134" class="sv-lab">Parcelle résiduelle</text><text x="290" y="145" class="sv-lab sv-lab2">maison initiale</text>
      <text x="64" y="224" class="sv-lab sv-lab-l">Nouvelle parcelle</text><text x="64" y="234" class="sv-lab sv-lab-l sv-lab2">maison neuve</text>
      <text x="131" y="44" class="sv-lab sv-lab-s">Passage + réseaux</text>
      <text x="206" y="182" class="sv-lab sv-lab-c">Cour commune</text>
      <g class="sv-roles"><text x="274" y="122" class="sv-role sv-dom">FONDS DOMINANT</text><text x="122" y="80" class="sv-role sv-ser">FONDS SERVANT</text><path d="M150 70 C 190 70, 200 92, 236 100" class="sv-arrow"/></g>
    </svg>
    <div class="w-card sv-x" aria-live="polite"></div></div>`;
  const root = $('.w-sv', el);
  const show = m => {
    $$('.seg-ctrl button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.m === m));
    root.classList.remove('m-passage', 'm-cour', 'm-roles'); root.classList.add('m-' + m);
    $('.sv-x', el).innerHTML = `<p>${M[m].x}</p>`;
  };
  $('.seg-ctrl', el).addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (b) show(b.dataset.m); });
  show('passage');
});

/* ——— Voisinage : plantations et vues ——— */
const VOI_CASES = [
  {t:'Un cerisier de 5 m, planté à 1,20 m de la limite.', a:'n', w:'Plus de 2 m de haut : il faut 2 m de distance. Le voisin peut exiger qu’il soit arraché ou réduit à 2 m (art. 672).'},
  {t:'Une haie de 1,80 m de haut, plantée à 0,60 m de la limite.', a:'y', w:'2 m de haut au plus : 0,50 m de distance suffisent.'},
  {t:'Un chêne de 12 m, planté à 3 m de la limite.', a:'y', w:'À 2 m ou plus de la limite, la hauteur est libre.'},
  {t:'Un rosier grimpant de 1,50 m, planté à 0,30 m de la limite.', a:'n', w:'Moins de 0,50 m de la limite : trop près, quelle que soit la hauteur.'},
  {t:'Une fenêtre qui donne droit sur le jardin du voisin, à 1,50 m de la limite.', a:'n', w:'Vue droite : 1,90 m au minimum (art. 678).'},
  {t:'Une fenêtre de côté (vue oblique), à 0,80 m de la limite.', a:'y', w:'Vue oblique : 0,60 m suffisent (art. 679).'},
  {t:'Une baie vitrée face au voisin, à 2,50 m de la limite.', a:'y', w:'Vue droite à plus de 1,90 m : autorisée.'},
  {t:'Les branches du noyer du voisin dépassent sur ton terrain : tu les coupes toi-même.', a:'n', w:'Tu peux exiger que le voisin les coupe (art. 673). Ce sont les racines que tu peux couper toi-même.'},
  {t:'Les noix tombées naturellement de ces branches, dans ton jardin : tu les ramasses.', a:'y', w:'Les fruits tombés naturellement sur ton terrain t’appartiennent (art. 673).'}
];
JLG.widget('voisinage', (el, o) => {
  if (o.mode === 'defi'){
    let list = shuffle(VOI_CASES).slice(0, 6), i = 0, sc = 0;
    const head = `<div class="w-head"><span class="eyebrow">Défi</span><b>Le voisin a-t-il le droit ?</b><span class="muted">Autorisé ou interdit ? Les distances du Code civil.</span></div>`;
    const draw = () => {
      if (i >= list.length){ el.innerHTML = `<div class="w w-voi">${head}<div class="result" style="padding:18px"><h2>${sc}/${list.length}</h2><p class="muted">Retiens : 2 m / 0,50 m pour les plantations, 1,90 m / 0,60 m pour les vues.</p><button class="btn btn-primary" data-again>${icon('refresh')}Rejouer</button></div></div>`; if (sc === list.length) confetti(70); $('[data-again]', el).onclick = () => { list = shuffle(VOI_CASES).slice(0, 6); i = 0; sc = 0; draw(); }; return; }
      const c = list[i];
      el.innerHTML = `<div class="w w-voi">${head}<div class="qbar"><span class="qn">${i + 1}/${list.length}</span><span class="meter"><i style="width:${i / list.length * 100}%"></i></span><span class="qn">${sc} ✓</span></div>
        <div class="enonce"><div class="ek">Situation</div><p>${c.t}</p></div>
        <div class="tf"><button class="opt" data-v="y">Autorisé</button><button class="opt" data-v="n">Interdit</button></div><div class="pr-out"></div></div>`;
      $$('[data-v]', el).forEach(b => b.onclick = e => {
        const ok = b.dataset.v === c.a;
        $$('[data-v]', el).forEach(x => { x.disabled = true; if (x.dataset.v === c.a) x.classList.add('is-right'); else if (x !== b) x.classList.add('dim'); });
        if (!ok) b.classList.add('is-wrong'); else { sc++; addXP(6, e); }
        $('.pr-out', el).innerHTML = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Exact !' : 'Pas tout à fait.'}</div><p>${c.w}</p></div><div class="qnext"><button class="btn btn-primary" data-n>${i + 1 < list.length ? 'Situation suivante' : 'Résultat'}${icon('arrow')}</button></div>`;
        $('[data-n]', el).onclick = () => { i++; draw(); };
      });
    };
    draw(); return;
  }
  let mode = 'pl', d = 1.2, h = 4, br = false, vd = 1.5, vt = 'droite';
  const uid = Math.random().toString(36).slice(2, 7);
  el.innerHTML = `<div class="w w-voi">
    <div class="w-head"><span class="eyebrow">Simulateur</span><b>Les distances entre voisins</b><span class="muted">Déplace les curseurs : le schéma te dit si c’est permis.</span></div>
    <div class="seg-ctrl" role="tablist"><button role="tab" data-m="pl">Plantations</button><button role="tab" data-m="vu">Vues (fenêtres)</button></div>
    <svg viewBox="0 0 360 226" class="voi-svg" role="img" aria-label="Schéma des distances"></svg>
    <div class="voi-ctl"></div>
    <div class="w-card voi-x" aria-live="polite"></div></div>`;
  const svg = $('.voi-svg', el), ctl = $('.voi-ctl', el), X = $('.voi-x', el);
  const LIM = 232, G = 192;
  const fmt = v => v.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' m';
  const renderCtl = () => {
    ctl.innerHTML = mode === 'pl'
      ? `<div class="field"><label for="vd-${uid}">Distance de la limite : <b class="vdv"></b></label><input type="range" id="vd-${uid}" class="vd" min="0" max="4" step=".05" value="${d}"></div><div class="field"><label for="vh-${uid}">Hauteur de la plantation : <b class="vhv"></b></label><input type="range" id="vh-${uid}" class="vh" min="0.5" max="10" step=".1" value="${h}"></div><button class="btn btn-sm voi-br" aria-pressed="${br}">${icon('tree')}Les branches dépassent</button>`
      : `<div class="seg-ctrl voi-vt" role="tablist"><button role="tab" data-v="droite" aria-selected="${vt === 'droite'}">Vue droite</button><button role="tab" data-v="oblique" aria-selected="${vt === 'oblique'}">Vue oblique</button></div><div class="field"><label for="vv-${uid}">Distance de la fenêtre à la limite : <b class="vvv"></b></label><input type="range" id="vv-${uid}" class="vv" min="0" max="3" step=".05" value="${vd}"></div>`;
  };
  const drawPl = () => {
    const x = LIM - d * 42, H = h * 15.5, r = clamp(H * .3, 7, 42), cy = G - H + r;
    const ok = d >= 2 ? 'y' : d >= .5 ? (h <= 2 ? 'y' : 'h') : 'n';
    const brPath = br ? `<path d="M${x} ${cy} C ${x + 40} ${cy - 20}, ${LIM - 20} ${cy - 10}, ${LIM + 46} ${cy + 4}" class="voi-branch"/><circle cx="${LIM + 40}" cy="${cy + 8}" r="5" class="voi-fruit"/><circle cx="${LIM + 58}" cy="${G - 5}" r="5" class="voi-fruit fall"/>` : '';
    svg.innerHTML = `<rect x="0" y="0" width="360" height="${G}" class="voi-sky"/>
      <circle cx="40" cy="34" r="12" class="voi-sun"/>
      <g class="voi-nhouse"><path d="M276 ${G - 46} L306 ${G - 70} L336 ${G - 46} Z"/><rect x="282" y="${G - 46}" width="48" height="46"/><rect x="300" y="${G - 22}" width="12" height="22" class="voi-ndoor"/></g>
      <rect x="0" y="${G}" width="360" height="34" class="voi-ground"/>
      <rect x="${LIM - 2 * 42}" y="${G}" width="${2 * 42 - 21}" height="6" class="voi-z voi-zw"/><rect x="${LIM - 21}" y="${G}" width="21" height="6" class="voi-z voi-zb"/><rect x="0" y="${G}" width="${LIM - 84}" height="6" class="voi-z voi-zg"/>
      <line x1="0" y1="${G - 31}" x2="${LIM}" y2="${G - 31}" class="voi-guide"/><text x="6" y="${G - 35}" class="voi-gt">2 m de haut</text>
      <line x1="${LIM}" y1="14" x2="${LIM}" y2="${G + 30}" class="voi-lim"/><text x="${LIM + 6}" y="24" class="voi-lt">Limite</text>
      <text x="10" y="${G + 26}" class="voi-side">Chez toi</text><text x="350" y="${G + 26}" class="voi-side" text-anchor="end">Chez le voisin</text>
      <g class="voi-tree ${ok === 'y' ? 'ok' : 'ko'}"><rect x="${x - 3}" y="${cy}" width="6" height="${G - cy}" rx="2" class="voi-trunk"/><circle cx="${x}" cy="${cy}" r="${r}" class="voi-crown"/>${brPath}</g>
      <line x1="${x}" y1="${G + 12}" x2="${LIM}" y2="${G + 12}" class="voi-meas"/><text x="${(x + LIM) / 2}" y="${G + 24}" class="voi-mt" text-anchor="middle">${fmt(d)}</text>`;
    $('.vdv', el).textContent = fmt(d); $('.vhv', el).textContent = fmt(h);
    const msg = ok === 'y' ? (d >= 2 ? `<b class="good">Autorisé.</b> À 2 m ou plus de la limite, la hauteur est libre (art. 671).` : `<b class="good">Autorisé.</b> Une plantation de 2 m au plus peut être à 0,50 m de la limite.`)
      : ok === 'h' ? `<b class="bad">Trop haut.</b> À moins de 2 m de la limite, la plantation ne doit pas dépasser 2 m. Le voisin peut exiger qu’elle soit arrachée ou réduite à 2 m (art. 672).`
      : `<b class="bad">Trop près.</b> À moins de 0,50 m de la limite, aucune plantation n’est permise : le voisin peut exiger qu’elle soit arrachée.`;
    X.innerHTML = `<p>${msg}</p>${br ? '<p>Branches qui dépassent : le voisin peut exiger que tu les coupes. Les fruits <b>tombés naturellement</b> chez lui sont à lui (art. 673).</p>' : ''}<p class="w-note">Ces distances s’appliquent à défaut de règlement ou d’usage local.</p>`;
  };
  const drawVu = () => {
    const wall = LIM - vd * 60; const ok = vt === 'droite' ? vd >= 1.9 : vd >= .6;
    const hx = Math.max(10, wall - 120);
    const win = vt === 'droite' ? `<rect x="${wall - 4}" y="84" width="8" height="40" class="voi-win"/><path d="M${wall + 4} 90 L${LIM + 120} 50 L${LIM + 120} 164 L${wall + 4} 118 Z" class="voi-cone ${ok ? 'ok' : 'ko'}"/>` : `<rect x="${wall - 40}" y="56" width="34" height="8" class="voi-win"/><path d="M${wall - 6} 60 L${LIM + 120} 10 L${LIM + 120} 60 Z" class="voi-cone ${ok ? 'ok' : 'ko'}"/>`;
    svg.innerHTML = `<rect x="0" y="0" width="360" height="226" class="voi-plan"/>
      <rect x="${LIM}" y="0" width="${360 - LIM}" height="226" class="voi-nb"/>
      <line x1="${LIM}" y1="0" x2="${LIM}" y2="226" class="voi-lim"/><text x="${LIM + 6}" y="216" class="voi-lt">Limite</text>
      <rect x="${hx}" y="60" width="${wall - hx}" height="110" class="voi-house"/><text x="${(hx + wall) / 2}" y="150" class="voi-side" text-anchor="middle">Ta maison</text>
      <text x="${LIM + 64}" y="200" class="voi-side" text-anchor="middle">Jardin du voisin</text>
      ${win}
      <line x1="${vt === 'droite' ? wall : wall - 6}" y1="${vt === 'droite' ? 140 : 40}" x2="${LIM}" y2="${vt === 'droite' ? 140 : 40}" class="voi-meas"/><text x="${((vt === 'droite' ? wall : wall - 6) + LIM) / 2}" y="${vt === 'droite' ? 156 : 32}" class="voi-mt" text-anchor="middle">${fmt(vd)}</text>`;
    $('.vvv', el).textContent = fmt(vd);
    X.innerHTML = `<p>${ok ? `<b class="good">Autorisé.</b>` : `<b class="bad">Interdit.</b>`} Une vue ${vt} doit être à <b>${vt === 'droite' ? '1,90 m' : '0,60 m'}</b> au moins de la limite (art. ${vt === 'droite' ? '678' : '679'} C. civ.).${ok ? '' : ' Le voisin peut exiger que la fenêtre soit supprimée.'}</p><p class="w-note">Vue droite : la fenêtre regarde en face le terrain voisin. Vue oblique : il faut tourner la tête pour le voir.</p>`;
  };
  const draw = () => { if (mode === 'pl') drawPl(); else drawVu(); };
  const setMode = m => { mode = m; $$('.w-voi > .seg-ctrl button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.m === m)); renderCtl(); draw(); };
  $('.w-voi > .seg-ctrl', el).addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (b) setMode(b.dataset.m); });
  ctl.addEventListener('input', e => { if (e.target.classList.contains('vd')) d = +e.target.value; else if (e.target.classList.contains('vh')) h = +e.target.value; else if (e.target.classList.contains('vv')) vd = +e.target.value; draw(); });
  ctl.addEventListener('click', e => {
    const b = e.target.closest('.voi-br'); if (b){ br = !br; b.setAttribute('aria-pressed', br); draw(); return; }
    const v = e.target.closest('[data-v]'); if (v){ vt = v.dataset.v; $$('.voi-vt button', el).forEach(x => x.setAttribute('aria-selected', x === v)); draw(); }
  });
  setMode('pl');
});

/* ——— Le sol : dessus et dessous (coupe) ——— */
JLG.widget('sol', el => {
  const P = {
    plu:{x:222, y:86, z:'up', t:'Construire en hauteur', h:'Le <b>PLU</b> peut interdire de construire, limiter l’emprise au sol ou la hauteur. Avant tout projet : déclaration préalable ou permis de construire, à la mairie.', r:'Art. 552 C. civ. et PLU'},
    grue:{x:104, y:30, z:'up', t:'La flèche de grue', h:'Une grue ne peut pas faire passer sa flèche au-dessus de ton terrain sans ton autorisation.', r:'CA Aix-en-Provence, 19 déc. 1979'},
    ligne:{x:300, y:47, z:'up', t:'Les lignes électriques', h:'Le terrain peut être grevé d’une servitude de passage de lignes (de plus en plus enfouies). Le propriétaire peut refuser des câbles aériens au-dessus de son terrain.', r:'Cass. req., 6 mars 1934'},
    arbre:{x:68, y:80, z:'up', t:'Les plantations', h:'2 m de haut au plus : à 0,50 m de la limite. Plus de 2 m : à 2 m de la limite. Les branches qui dépassent : le voisin peut exiger qu’on les coupe.', r:'Art. 671 à 673 C. civ.'},
    piscine:{x:254, y:190, z:'down', t:'Piscine, fondations, garage enterré', h:'L’exploitation classique du dessous : fondations, canalisations, piscine, garage souterrain, après une DP ou un PC.', r:'Art. 552 C. civ.'},
    reseau:{x:322, y:222, z:'down', t:'Les raccordements', h:'Canalisation privée et branchement sous le domaine public : à la charge du <b>propriétaire</b> (la collectivité peut faire les travaux contre remboursement). Réseau public : à la charge de la <b>collectivité</b>.', r:'Schéma du cours (SIAVOS)'},
    puits:{x:114, y:214, z:'down', t:'Le puits', h:'Ton cours : à 35 m au moins de la limite, moins de 10 m de profondeur, usage domestique de moins de 1 000 m³ par an. Un puits domestique se déclare en mairie.', r:'Art. L.2224-9 CGCT'},
    vestige:{x:190, y:236, z:'down', t:'Les vestiges archéologiques', h:'Ils sont présumés appartenir à l’<b>État</b> : le propriétaire ne les garde pas.', r:'Art. L.541-1 C. patrimoine'},
    mine:{x:278, y:278, z:'down', t:'Les mines', h:'Les ressources minérales appartiennent à l’<b>État</b>, pas au propriétaire du sol.', r:'Art. 552 C. civ. et code minier'}
  };
  const keys = Object.keys(P);
  el.innerHTML = `<div class="w w-sol">
    <div class="w-head"><span class="eyebrow">Coupe interactive · art. 552</span><b>Du ciel au sous-sol</b><span class="muted">Touche un repère numéroté.</span></div>
    <div class="seg-ctrl" role="tablist"><button role="tab" data-z="all">Tout</button><button role="tab" data-z="up">Le dessus</button><button role="tab" data-z="down">Le dessous</button></div>
    <svg viewBox="0 0 360 300" class="sol-svg" role="group" aria-label="Coupe d’un terrain : dessus et dessous">
      <defs><linearGradient id="solSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sol-s0"/><stop offset="1" class="sol-s1"/></linearGradient></defs>
      <rect x="0" y="0" width="360" height="152" fill="url(#solSky)"/>
      <g class="sol-clouds"><ellipse cx="60" cy="54" rx="22" ry="8"/><ellipse cx="78" cy="48" rx="16" ry="9"/><ellipse cx="250" cy="20" rx="20" ry="7"/></g>
      <rect x="0" y="152" width="360" height="36" class="sol-l1"/><rect x="0" y="188" width="360" height="56" class="sol-l2"/><rect x="0" y="244" width="360" height="56" class="sol-l3"/>
      <rect x="290" y="146" width="70" height="8" class="sol-road"/><text x="325" y="143" class="sol-tx" text-anchor="middle">Domaine public</text>
      <line x1="18" y1="60" x2="18" y2="300" class="sol-lim"/><text x="22" y="298" class="sol-tx">Limite</text>
      <g class="sol-crane"><rect x="2" y="26" width="6" height="126" class="sol-steel"/><g class="sol-jib"><rect x="0" y="24" width="190" height="4" class="sol-steel"/><line x1="160" y1="28" x2="160" y2="56" class="sol-cable"/><rect x="152" y="56" width="16" height="10" class="sol-load"/></g></g>
      <g class="sol-pole"><rect x="282" y="40" width="4" height="112" class="sol-steel"/><path d="M284 44 Q 322 60 360 52" class="sol-wire"/><path d="M284 44 Q 230 56 196 46" class="sol-wire"/></g>
      <g class="sol-tree"><rect x="41" y="112" width="5" height="40" class="sol-trunk"/><circle cx="43" cy="100" r="20" class="sol-leaf"/></g>
      <g class="sol-house"><path d="M118 104 L166 72 L214 104 Z" class="sol-roof"/><rect x="124" y="104" width="84" height="48" class="sol-wall"/><rect x="158" y="124" width="14" height="28" class="sol-door"/><rect x="118" y="152" width="96" height="12" class="sol-found"/><line x1="222" y1="72" x2="222" y2="152" class="sol-h"/></g>
      <path d="M232 152 h44 v18 q0 4 -4 4 h-36 q-4 0 -4 -4z" class="sol-pool"/>
      <path d="M190 164 V200 H290" class="sol-pipe p1"/><rect x="288" y="194" width="14" height="14" class="sol-box"/><path d="M302 201 H360" class="sol-pipe p3"/>
      <rect x="86" y="152" width="12" height="84" class="sol-well"/><rect x="88" y="222" width="8" height="12" class="sol-water"/>
      <g class="sol-amph" transform="translate(146 222) scale(1.35)"><path d="M6 0 h8 v4 q8 4 6 14 q-2 8 -10 10 q-8 -2 -10 -10 q-2 -10 6 -14z"/></g>
      <g class="sol-ore"><path d="M200 278 l8 -13 l8 13z"/><path d="M216 288 l6 -10 l6 10z"/><path d="M232 280 l7 -12 l7 12z"/><path d="M246 290 l5 -9 l5 9z"/></g>
      ${keys.map((k, i) => `<g class="sol-hp" data-k="${k}" data-z="${P[k].z}" tabindex="0" role="button" aria-label="${P[k].t}"><circle cx="${P[k].x}" cy="${P[k].y}" r="13" class="sol-hr"/><circle cx="${P[k].x}" cy="${P[k].y}" r="9.5" class="sol-hc"/><text x="${P[k].x}" y="${P[k].y + 3.6}" text-anchor="middle" class="sol-hn">${i + 1}</text></g>`).join('')}
    </svg>
    <div class="w-card sol-x" aria-live="polite"><p class="muted">Le dessus : 1 à 4. Le dessous : 5 à 9. Touche un repère.</p></div></div>`;
  const show = k => {
    const d = P[k];
    $$('.sol-hp', el).forEach(g => g.classList.toggle('on', g.dataset.k === k));
    const x = $('.sol-x', el); x.innerHTML = `<div class="car-h"><b>${d.t}</b><span class="tag plain">${d.z === 'up' ? 'Dessus' : 'Dessous'}</span></div><p>${d.h}</p><p class="w-note">${d.r}</p>`;
    x.style.animation = 'none'; void x.offsetWidth; x.style.animation = '';
  };
  $$('.sol-hp', el).forEach(g => { g.addEventListener('click', () => show(g.dataset.k)); keyAct(g, () => show(g.dataset.k)); });
  const zone = z => { $$('.w-sol .seg-ctrl button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.z === z)); $('.w-sol', el).dataset.zone = z; };
  $('.w-sol .seg-ctrl', el).addEventListener('click', e => { const b = e.target.closest('[data-z]'); if (b) zone(b.dataset.z); });
  zone('all');
});

/* ——— Le cycle du bail réel solidaire ——— */
JLG.widget('brs', el => {
  const S6 = [
    {t:'L’OFS achète le terrain', h:'L’organisme de foncier solidaire acquiert le terrain et le <b>garde</b> : le foncier et le bâti sont dissociés.'},
    {t:'Les logements sont construits', h:'Un programme de logements en <b>accession sociale</b> est construit sur le terrain.'},
    {t:'Le ménage achète le bâti', h:'Sous <b>plafond de ressources</b>, il signe un bail réel solidaire (BRS) : il devient propriétaire des murs ; l’OFS reste propriétaire du terrain.'},
    {t:'Il paie chaque mois', h:'La <b>redevance</b> à l’OFS, les taxes locales, l’entretien et le remboursement de son prêt immobilier.'},
    {t:'Il revend', h:'À un ménage éligible, avec une <b>plus-value limitée</b> : le prix de revente est plafonné par l’OFS.'},
    {t:'Le logement reste abordable', h:'Le ménage suivant achète à un prix accessible, et la boucle recommence. C’est un dispositif <b>anti-spéculatif</b>.'}
  ];
  const R = 112, cx = 160, cy = 160;
  const pos = i => { const a = (-90 + i * 60) * Math.PI / 180; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; };
  el.innerHTML = `<div class="w w-brs">
    <div class="w-head"><span class="eyebrow">Schéma animé</span><b>Le cycle du bail réel solidaire</b><span class="muted">Le terrain reste à l’OFS, les murs passent de ménage en ménage.</span></div>
    <div class="brs-grid">
      <svg viewBox="0 0 320 320" class="brs-svg" role="group" aria-label="Cycle du bail réel solidaire">
        <circle cx="${cx}" cy="${cy}" r="${R}" class="brs-ring"/>
        <circle cx="${cx}" cy="${cy}" r="${R}" class="brs-ring2"/>
        <g class="brs-orbit"><circle cx="${cx}" cy="${cy - R}" r="6" class="brs-dot"/></g>
        <g class="brs-house"><path d="M118 152 L160 120 L202 152 Z" class="brs-roof"/><rect x="126" y="152" width="68" height="34" class="brs-wall"/><text x="160" y="173" text-anchor="middle" class="brs-ht">Bâti · ménage</text><rect x="104" y="188" width="112" height="22" rx="4" class="brs-land"/><text x="160" y="203" text-anchor="middle" class="brs-ht brs-lt">Terrain · OFS</text></g>
        ${S6.map((s, i) => { const [x, y] = pos(i); return `<g class="brs-n" data-i="${i}" tabindex="0" role="button" aria-label="Étape ${i + 1} : ${s.t}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="22" class="brs-c"/><text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle" class="brs-num">${i + 1}</text></g>`; }).join('')}
      </svg>
      <div class="brs-side"><div class="w-card brs-x" aria-live="polite"></div><div class="btn-row"><button class="btn btn-sm brs-play">${icon('refresh')}Rejouer le cycle</button></div></div>
    </div></div>`;
  let cur = -1, timer = null;
  const set = i => {
    cur = i;
    $$('.brs-n', el).forEach(n => { const k = +n.dataset.i; n.classList.toggle('on', k === i); n.classList.toggle('done', k < i); });
    $('.brs-orbit', el).style.transform = `rotate(${i * 60}deg)`;
    const x = $('.brs-x', el); x.innerHTML = `<div class="eyebrow">Étape ${i + 1} sur 6</div><p style="margin-top:4px"><b>${S6[i].t}</b></p><p>${S6[i].h}</p>`;
    x.style.animation = 'none'; void x.offsetWidth; x.style.animation = '';
  };
  const play = () => { clearTimeout(timer); let i = 0; const tick = () => { if (!el.isConnected) return; set(i); i++; if (i < S6.length) timer = setTimeout(tick, reduced() ? 600 : 2300); }; tick(); };
  $$('.brs-n', el).forEach(n => { const go = () => { clearTimeout(timer); set(+n.dataset.i); }; n.addEventListener('click', go); keyAct(n, go); });
  $('.brs-play', el).onclick = play;
  play();
});

/* ——— Générateur de clause « effet relatif » ——— */
JLG.widget('effetrel', el => {
  const TY = {
    acq:{l:'Acquisition (vente)', a:'Acquisition', v:'reçu'},
    don:{l:'Donation', a:'Donation', v:'reçu'},
    suc:{l:'Succession (attestation immobilière)', a:'Attestation de propriété immobilière', v:'dressée'},
    att:{l:'Partage (attribution)', a:'Attribution suivant acte de partage', v:'reçu'},
    con:{l:'Construction sur un terrain acheté', a:'Acquisition', v:'reçu'}
  };
  const uid = Math.random().toString(36).slice(2, 7);
  const F = (id, l, v, extra = '') => `<div class="field"><label for="er-${id}-${uid}">${l}</label><input id="er-${id}-${uid}" data-k="${id}" value="${esc(v)}" ${extra}></div>`;
  el.innerHTML = `<div class="w w-er">
    <div class="w-head"><span class="eyebrow">Générateur</span><b>Rédige la clause « effet relatif »</b><span class="muted">Remplis le dossier : la clause s’écrit, avec le bon vocabulaire selon les dates.</span></div>
    <div class="bd-grid">
      <div class="bd-form">
        <div class="field"><label for="er-t-${uid}">Comment le vendeur a-t-il eu le bien ?</label><select id="er-t-${uid}" data-k="t">${Object.keys(TY).map(k => `<option value="${k}">${TY[k].l}</option>`).join('')}</select></div>
        <div class="bd-2">${F('n', 'Notaire (prénom NOM)', 'Enzo GANT')}${F('v', 'Ville du notaire', 'CAEN')}</div>
        <label class="er-chk"><input type="checkbox" data-k="alors"> Le notaire n’exerce plus là : « alors notaire »</label>
        ${F('d', 'Date de l’acte', '2023-12-05', 'type="date"')}
        <div class="eyebrow" style="margin-top:6px">Publication</div>
        <div class="bd-2">${F('s', 'Service (ville)', 'CAEN')}${F('p', 'Date de publication', '2024-01-02', 'type="date"')}</div>
        <div class="bd-2">${F('vol', 'Volume', '2024 P')}${F('num', 'Numéro', '4', 'inputmode="numeric"')}</div>
      </div>
      <div class="bd-prev"><div class="bd-checks er-checks"></div><article class="acte-paper hl-on-act hl-on-not hl-on-dat hl-on-pub er-out"></article><p class="w-note er-warn"></p><div class="btn-row" style="margin-top:12px"><button class="btn btn-primary er-copy">${icon('copy')}Copier la clause</button></div></div>
    </div></div>`;
  let volAuto = true;
  const val = k => { const n = $(`[data-k="${k}"]`, el); return n.type === 'checkbox' ? n.checked : (n.value || '').trim(); };
  const draw = () => {
    const t = TY[val('t')], d = val('d'), p = val('p'), alors = val('alors');
    const old = p && p < '2013-01-01';
    const svc = old ? 'bureau des hypothèques' : 'service de la publicité foncière';
    const notaire = `<span class="m-not">Maître ${esc(val('n') || '…')}, ${alors ? 'alors ' : ''}notaire à ${esc((val('v') || '…').toUpperCase())}</span>`;
    const pub = `<span class="m-pub">${svc} de ${esc((val('s') || '…').toUpperCase())} le ${frDate(p)}, volume ${esc(val('vol') || '…')}, numéro ${esc(val('num') || '…')}</span>`;
    const core = `<span class="m-act">${t.a}</span> suivant acte ${t.v} par ${notaire}, le <span class="m-dat">${frDate(d)}</span>, dont une copie authentique a été publiée au ${pub}.`;
    let html;
    if (val('t') === 'con') html = `<p><span class="m-act">Les constructions : pour les avoir fait édifier</span> sans avoir consenti de privilège d’architecte, constructeur ou entrepreneur.</p><p><span class="m-act">Et le terrain : acquisition</span> suivant acte reçu par ${notaire}, le <span class="m-dat">${frDate(d)}</span>, publié au ${pub}.</p>`;
    else if (val('t') === 'suc') html = `<p><span class="m-act">${t.a}</span> dressée par ${notaire}, le <span class="m-dat">${frDate(d)}</span>, dont une copie authentique a été publiée au ${pub}.</p>`;
    else html = `<p>${core}</p>`;
    $('.er-out', el).innerHTML = `<div class="ap-h">Effet relatif</div>${html}`;
    const okD = !!(d && p && p >= d);
    const checks = [['Nature de l’acte', true], ['Notaire', !!val('n') && !!val('v')], ['Date', !!d], ['Publication', !!(p && val('s') && val('vol') && val('num'))]];
    $('.er-checks', el).innerHTML = checks.map(c => `<span class="tag ${c[1] ? 'good' : 'warn'}">${c[1] ? '✓' : '!'} ${c[0]}</span>`).join('');
    const warn = [];
    if (d && p && !okD) warn.push('<b>Attention :</b> la publication ne peut pas précéder l’acte.');
    if (old) warn.push('Publication avant le 1er janvier 2013 : on écrit « <b>bureau des hypothèques</b> ».');
    if (val('t') === 'suc') warn.push('Après un décès, on cite l’<b>attestation de propriété immobilière</b> : elle est « dressée » par le notaire.');
    if (val('t') === 'con') warn.push('Le terrain a été acheté, les constructions édifiées : on cite les deux.');
    $('.er-warn', el).innerHTML = warn.join(' ');
  };
  el.addEventListener('input', e => {
    const k = e.target.dataset.k;
    if (k === 'vol') volAuto = false;
    if (k === 'p' && volAuto){ const y = (e.target.value || '').slice(0, 4); if (y) $('[data-k="vol"]', el).value = y + (e.target.value >= '2013-01-01' ? ' P' : ''); }
    draw();
  });
  el.addEventListener('change', draw);
  $('.er-copy', el).onclick = e => copyText($('.er-out', el).innerText.replace(/^Effet relatif\s*/i, ''), e.currentTarget);
  draw();
});

/* ——— La chaîne des propriétaires (30 ans) ——— */
const CH_SC = [
  {id:'ditch', who:'M. DITCH vend sa maison de NANCY', acts:[
    {d:'1960-05-30', t:'La Ville de NANCY vend le terrain à M. AURIOUX', s:'Acte GLASSER · publié vol. 985 n° 415'},
    {d:'1961-12-31', t:'La maison est construite', s:'Constructions édifiées en 1961', c:true},
    {d:'1998-05-03', t:'Les époux AURIOUX vendent à M. DITCH', s:'Acte JUD · publié vol. 1998 n° 4215'}]},
  {id:'moreau', who:'Paul MOREAU vend la maison de ses parents', acts:[
    {d:'1975-03-12', t:'Les époux MOREAU achètent la maison', s:'Vente, acte publié en 1975'},
    {d:'1992-06-20', t:'Ils donnent la maison à leur fils Paul', s:'Donation, acte publié en 1992'}]},
  {id:'leroy', who:'Inès LEROY vend la maison de son père', acts:[
    {d:'1970-09-01', t:'Les époux GARNIER achètent la maison', s:'Vente de 1970'},
    {d:'2001-04-15', t:'Les GARNIER vendent à M. LEROY', s:'Vente de 2001'},
    {d:'2019-02-08', t:'M. LEROY décède : sa fille Inès hérite', s:'Attestation de propriété immobilière de 2019'}]}
];
function chainSolve(acts, sale){
  const lim = (+sale.slice(0, 4) - 30) + sale.slice(4);
  const titles = acts.filter(a => !a.c);
  const eff = titles[titles.length - 1];
  let k = titles.length - 1; while (k > 0 && titles[k].d > lim) k--;
  return {lim, eff, stop:titles[k], need:titles.slice(k), ok:titles[k].d <= lim};
}
JLG.widget('chaine', (el, o) => {
  const today = dayKey();
  if (o.mode === 'defi'){
    const head = `<div class="w-head"><span class="eyebrow">Défi</span><b>Remonte la chaîne des propriétaires</b><span class="muted">Trois dossiers, trois étapes : l’ordre, l’effet relatif, l’origine.</span></div>`;
    const rounds = shuffle(CH_SC);
    let r = 0, step = 0, sc = 0, order = [], picked = [], chosen = -1, fb = '';
    const draw = () => {
      if (r >= rounds.length){
        const tot = rounds.length * 3;
        el.innerHTML = `<div class="w w-ch">${head}<div class="result" style="padding:18px"><h2>${sc}/${tot}</h2><p class="muted">${sc === tot ? 'Chaîne parfaite : tu peux rédiger l’origine de propriété.' : 'Rappel : l’effet relatif cite le dernier titre ; l’origine remonte jusqu’à un titre de plus de 30 ans.'}</p><button class="btn btn-primary" data-again>${icon('refresh')}Rejouer</button></div></div>`;
        if (sc === tot) confetti(80);
        $('[data-again]', el).onclick = () => { r = 0; step = 0; sc = 0; order = []; picked = []; chosen = -1; fb = ''; rounds.splice(0, rounds.length, ...shuffle(CH_SC)); draw(); };
        return;
      }
      const R = rounds[r], sol = chainSolve(R.acts, today), done = fb !== '';
      if (!order.length) order = shuffle(R.acts.map((_, i) => i));
      const want = step === 1 ? sol.eff : step === 2 ? sol.stop : null;
      const prompt = step === 0 ? 'Touche les actes du <b>plus ancien</b> au <b>plus récent</b>.' : step === 1 ? 'Quel acte cites-tu dans l’<b>effet relatif</b> ?' : 'Jusqu’à quel acte l’<b>origine de propriété</b> doit-elle remonter ?';
      const cls = i => { if (step === 0) return picked.includes(i) ? ' picked' : ''; if (!done) return ''; const a = R.acts[i]; return a === want ? ' is-right' : i === chosen ? ' is-wrong' : ' dim'; };
      el.innerHTML = `<div class="w w-ch">${head}<div class="qbar"><span class="qn">Dossier ${r + 1}/${rounds.length}</span><span class="meter"><i style="width:${(r * 3 + step) / (rounds.length * 3) * 100}%"></i></span><span class="qn">${sc} ✓</span></div>
        <div class="enonce"><div class="ek">${fmtDate(today)} · ton acte</div><p><b>${R.who}.</b> ${prompt}</p></div>
        <div class="ch-cards">${order.map(i => { const a = R.acts[i]; const pos = picked.indexOf(i); return `<button class="ch-card${cls(i)}" data-i="${i}"${done || (step === 0 && pos >= 0) ? ' disabled' : ''}>${step === 0 && pos >= 0 ? `<span class="ch-ord">${pos + 1}</span>` : ''}<b>${a.t}</b>${step > 0 ? `<span>${fmtDate(a.d)}</span>` : ''}</button>`; }).join('')}</div><div class="pr-out">${fb}</div></div>`;
      const n = $('[data-n]', el); if (n){ n.onclick = () => { fb = ''; chosen = -1; step++; if (step > 2){ step = 0; r++; order = []; picked = []; } draw(); }; n.focus({preventScroll:true}); }
      if (done) return;
      $$('.ch-card', el).forEach(b => b.onclick = e => {
        const i = +b.dataset.i;
        const next = `<div class="qnext"><button class="btn btn-primary" data-n>${step === 2 && r + 1 >= rounds.length ? 'Résultat' : step === 2 ? 'Dossier suivant' : 'Étape suivante'}${icon('arrow')}</button></div>`;
        if (step === 0){
          picked.push(i);
          if (picked.length === R.acts.length){
            const ok = picked.every((v, k) => k === 0 || R.acts[v].d >= R.acts[picked[k - 1]].d);
            if (ok){ sc++; addXP(8, e); }
            fb = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Bon ordre !' : 'Pas dans l’ordre.'}</div><p>${R.acts.map(a => `<b>${a.d.slice(0, 4)}</b> ${a.t}`).join(' → ')}.</p></div>${next}`;
          }
        } else {
          chosen = i; const ok = R.acts[i] === want;
          if (ok){ sc++; addXP(8, e); }
          const why = step === 1 ? `L’effet relatif cite le <b>dernier titre</b> du vendeur : ${want.t.charAt(0).toLowerCase() + want.t.slice(1)} (${fmtDate(want.d)}).`
            : sol.stop === sol.eff ? `Ce titre a déjà <b>plus de 30 ans</b> (limite : ${fmtDate(sol.lim)}) : l’origine de propriété peut s’arrêter là.`
            : `Il faut un titre de <b>plus de 30 ans</b>, antérieur au ${fmtDate(sol.lim)} : ${want.t.charAt(0).toLowerCase() + want.t.slice(1)} (${fmtDate(want.d)}).${R.acts.some(a => a.c) ? ' On cite aussi les constructions de 1961.' : ''}`;
          fb = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Exact !' : 'Pas tout à fait.'}</div><p>${why}</p></div>${next}`;
        }
        draw();
      });
    };
    draw(); return;
  }
  const R = CH_SC[0]; let year = +today.slice(0, 4);
  const X0 = 1955, X1 = 2045, x = y => 16 + (y - X0) / (X1 - X0) * 328;
  const yOf = iso => +iso.slice(0, 4) + (+iso.slice(5, 7) - 1) / 12;
  el.innerHTML = `<div class="w w-ch">
    <div class="w-head"><span class="eyebrow">Frise interactive</span><b>Effet relatif et origine : la vente DITCH</b><span class="muted">Déplace la date de la vente : la fenêtre des 30 ans glisse.</span></div>
    <svg viewBox="0 0 360 150" class="ch-svg" role="img" aria-label="Frise de la chaîne des propriétaires"></svg>
    <div class="field"><label for="chY">Année de la vente : <b class="chYv"></b></label><input type="range" id="chY" class="chY" min="${year}" max="${year + 12}" value="${year}"></div>
    <div class="ch-out" aria-live="polite"></div></div>`;
  const svg = $('.ch-svg', el);
  const draw = () => {
    const sale = year + today.slice(4); const sol = chainSolve(R.acts, sale); const lim = sol.lim;
    $('.chYv', el).textContent = year;
    const ticks = []; for (let t = 1960; t <= 2040; t += 10) ticks.push(`<line x1="${x(t)}" y1="86" x2="${x(t)}" y2="92" class="ch-tick"/><text x="${x(t)}" y="104" text-anchor="middle" class="ch-tt">${t}</text>`);
    const ev = R.acts.map((a, i) => { const need = sol.need.includes(a) || (a.c && sol.need.length > 1); const eff = a === sol.eff; const up = i % 2 === 0; return `<g class="ch-ev${eff ? ' eff' : need ? ' need' : ''}" style="animation-delay:${i * .12}s"><circle cx="${x(yOf(a.d))}" cy="80" r="7"/><text x="${x(yOf(a.d))}" y="${up ? 62 : 124}" text-anchor="middle" class="ch-et">${a.d.slice(0, 4)}</text><text x="${x(yOf(a.d))}" y="${up ? 50 : 136}" text-anchor="middle" class="ch-es">${a.c ? 'construction' : a === sol.eff ? 'effet relatif' : 'titre'}</text></g>`; }).join('');
    const arcs = sol.need.map(a => { const x1 = x(yOf(sale)), x2 = x(yOf(a.d)); const hgt = Math.min(46, 12 + (x1 - x2) * .22); return `<path d="M${x1} 74 C ${x1 - 10} ${74 - hgt}, ${x2 + 10} ${74 - hgt}, ${x2} 72" class="ch-arc"/>`; }).join('');
    svg.innerHTML = `<rect x="${x(yOf(lim))}" y="30" width="${x(yOf(sale)) - x(yOf(lim))}" height="66" rx="8" class="ch-win"/><text x="${(x(yOf(lim)) + x(yOf(sale))) / 2}" y="24" text-anchor="middle" class="ch-wt">30 ans</text>
      <line x1="16" y1="80" x2="344" y2="80" class="ch-axis"/>${ticks.join('')}${arcs}${ev}
      <g class="ch-sale"><circle cx="${x(yOf(sale))}" cy="80" r="9"/><text x="${x(yOf(sale))}" y="124" text-anchor="middle" class="ch-et">${year}</text><text x="${x(yOf(sale))}" y="136" text-anchor="middle" class="ch-es">ton acte</text></g>`;
    $('.ch-out', el).innerHTML = `<div class="ch-res"><div class="w-card"><div class="eyebrow">Effet relatif</div><p><b>${sol.eff.t}</b></p><p class="muted">${fmtDate(sol.eff.d)} · ${sol.eff.s}</p></div>
      <div class="w-card"><div class="eyebrow">Origine de propriété</div>${sol.stop === sol.eff ? `<p>Le titre de ${sol.eff.d.slice(0, 4)} a <b>plus de 30 ans</b> au jour de la vente : l’origine peut s’arrêter à lui.</p>` : `<p>Le titre de ${sol.eff.d.slice(0, 4)} a <b>moins de 30 ans</b> (limite : ${fmtDate(lim)}). On remonte jusqu’au titre de <b>${sol.stop.d.slice(0, 4)}</b>, et on cite les constructions de 1961.</p>`}</div></div>`;
  };
  $('.chY', el).addEventListener('input', e => { year = +e.target.value; draw(); });
  draw();
});

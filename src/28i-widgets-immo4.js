/* =================== SCHÉMAS — IMMOBILIER, ACTIVITÉ 2 · SÉANCE 1 : L’ESTIMATION DU BIEN =================== */

const frN = (v, d = 0) => Number(v).toLocaleString('fr-FR', {minimumFractionDigits:d, maximumFractionDigits:d});
const eurR = v => frN(Math.round(v)) + ' €';
const round100 = v => Math.round(v / 100) * 100;

/* 1. Les huit règles de la négociation notariale (art. 7.1.2.2 du règlement professionnel) */
JLG.widget('negoc', el => {
  const R = [
    {k:'mandat', ok:1, t:'Un mandat écrit', d:'Le notaire doit être mandaté <b>par écrit</b>. Le mandat indique le <b>mode de calcul des honoraires</b>, la personne qui les paiera (vendeur, acquéreur, bailleur, locataire), une <b>durée raisonnable</b> (souvent 3 mois), et une copie est remise au mandant.'},
    {k:'contrat', ok:1, t:'En vue d’un contrat', d:'On ne négocie qu’<b>en vue de la réalisation d’un contrat</b>, l’acte de vente définitif, avec réserve et dignité envers tous les clients.'},
    {k:'demarchage', ok:0, t:'Pas de démarchage', d:'Il est <b>interdit</b> de rechercher de nouveaux clients, directement ou par personne interposée, pour recueillir un mandat.'},
    {k:'annonces', ok:0, t:'Pas d’annonces générales', d:'Interdiction d’annonces <b>sans bien précis</b> : biens à vendre ou à louer en général, capitaux à placer ou à emprunter.'},
    {k:'supports', ok:1, t:'Les supports, selon les usages', d:'Tout support publicitaire est possible, <b>dans le respect des usages</b> définis par les instances de la profession.'},
    {k:'vitrine', ok:0, t:'Pas de vitrine de boutique', d:'On n’affiche pas les annonces dans une <b>vitrine formant devanture de boutique</b>. Seule la profession peut faire de la publicité informative générale sur le notariat.'},
    {k:'groupe', ok:1, t:'Se grouper', d:'Plusieurs notaires peuvent <b>mettre des moyens en commun</b> et tenir un fichier commun des offres. Le groupement ne négocie pas lui-même.'},
    {k:'succursale', ok:0, t:'Pas de succursale dédiée', d:'Interdit d’ouvrir une succursale qui ne fait que de la négociation et qui a une <b>entrée distincte</b> de l’office.'}
  ];
  el.innerHTML = `<div class="w w-negoc">
    <div class="w-head"><span class="eyebrow">Document interactif</span><b>Huit règles, permis ou interdit</b><span class="muted">Touche une règle pour la lire. Vert : permis ; rouge : interdit.</span></div>
    <div class="ng-grid">${R.map(r => `<button class="ng-r ${r.ok ? 'ok' : 'ko'}" data-k="${r.k}"><span class="ng-b">${r.ok ? '✓' : '✕'}</span><b>${r.t}</b></button>`).join('')}</div>
    <div class="ng-out" aria-live="polite"></div></div>`;
  const out = $('.ng-out', el), seen = new Set();
  const show = k => { const r = R.find(x => x.k === k); $$('.ng-r', el).forEach(b => b.classList.toggle('sel', b.dataset.k === k)); out.innerHTML = `<div class="w-card"><b class="w-t">${r.t}</b><p>${r.d}</p></div>`; seen.add(k); if (seen.size === R.length && !el.__done){ el.__done = true; addXP(5, {target:out}); } };
  el.addEventListener('click', e => { const b = e.target.closest('.ng-r'); if (b) show(b.dataset.k); });
  show('mandat');
});

/* 2. La comparaison directe : le prix au m² — ou défi « le bon prix au m² » */
JLG.widget('perval', (el, o) => {
  if (o && o.mode === 'defi'){
    const items = [];
    for (let i = 0; i < 14; i++){
      const p1 = 1500 + 100 * Math.floor(Math.random() * 25), p2 = p1 + 100 * (1 + Math.floor(Math.random() * 6));
      const s1 = 40 + Math.floor(Math.random() * 25), s2 = 40 + Math.floor(Math.random() * 25), S = 40 + Math.floor(Math.random() * 50);
      const avg = (p1 + p2) / 2, good = round100(avg * S);
      const opts = [...new Set([good, round100(p1 * S), round100(p2 * S), round100((p1 * s1 + p2 * s2) / 2)])];
      while (opts.length < 4) opts.push(good + 1000 * (opts.length + 1));
      items.push({q:`Deux ventes dans PERVAL : <b>${eurR(p1 * s1)}</b> pour ${s1} m², et <b>${eurR(p2 * s2)}</b> pour ${s2} m². Quelle valeur vénale (arrondie à la centaine) pour un bien de <b>${S} m²</b> ?`, a:eurR(good), o:opts.map(eurR), e:`Prix au m² : ${frN(p1)} € et ${frN(p2)} €, moyenne ${frN(avg, 2)} €/m². Valeur : ${frN(avg, 2)} × ${S} = ${frN(avg * S, 2)} €, soit ${eurR(good)}.`});
    }
    return fmQuiz(el, {items, n:8, eyebrow:'Défi', hint:'Prix au m² de chaque vente, moyenne, puis surface.', title:'Le bon prix au m²', perfect:'Tu estimes comme un notaire.', again:'Rappelle-toi : prix ÷ surface pour chaque vente, moyenne, puis × surface du bien.'});
  }
  const V = [
    {a:'rue Haguenauer', d:'23/08/2026', p:111900, s:48.08, y:1976},
    {a:'rue Cyfflé', d:'01/09/2026', p:125000, s:46.43, y:1972},
    {a:'boulevard Joffre', d:'29/09/2026', p:131300, s:45.35, y:1962},
    {a:'boulevard Joffre', d:'28/10/2026', p:131800, s:50.04, y:1962},
    {a:'place Stanislas (hôtel particulier)', d:'12/10/2026', p:240000, s:44.5, y:1760, odd:1}
  ];
  el.innerHTML = `<div class="w w-pv">
    <div class="w-head"><span class="eyebrow">Simulateur</span><b>Estimer un T2 à Nancy avec PERVAL</b><span class="muted">Coche les ventes comparables, change la surface, regarde la valeur vénale.</span></div>
    <div class="pv-list">${V.map((v, i) => `<label class="pv-r${v.odd ? ' odd' : ''}"><input type="checkbox" data-i="${i}" ${v.odd ? '' : 'checked'}><span class="pv-i"><b>${v.a}</b><small>${v.d} · ${frN(v.s, 2)} m² · ${v.y}</small></span><span class="pv-p">${eurR(v.p)}</span><span class="pv-m"><i class="pv-bar"><u style="width:${Math.min(100, v.p / v.s / 60)}%"></u></i><b>${frN(v.p / v.s, 2)} €/m²</b></span></label>`).join('')}</div>
    <label class="rp-f"><span>Surface du bien à estimer : <output class="pv-s">49,42</output> m²</span><input type="range" min="30" max="90" step="0.01" value="49.42"></label>
    <div class="pv-res" aria-live="polite"><div><span>Prix moyen</span><b class="pv-avg">—</b></div><div><span>Valeur vénale</span><b class="pv-val">—</b></div><div><span>Prix affiché</span><b class="pv-fin">—</b></div></div>
    <p class="pv-n muted"></p></div>`;
  const calc = () => {
    const on = $$('input[type=checkbox]', el).filter(c => c.checked).map(c => V[+c.dataset.i]);
    const S = +$('input[type=range]', el).value; $('.pv-s', el).textContent = frN(S, 2);
    $$('.pv-r', el).forEach(r => r.classList.toggle('off', !$('input', r).checked));
    if (!on.length){ $('.pv-avg', el).textContent = $('.pv-val', el).textContent = $('.pv-fin', el).textContent = '—'; $('.pv-n', el).textContent = 'Retiens au moins une vente.'; return; }
    const avg = on.reduce((t, v) => t + v.p / v.s, 0) / on.length, val = avg * S;
    countTo($('.pv-avg', el), avg, n => frN(n, 2) + ' €/m²'); countTo($('.pv-val', el), val, n => frN(n, 2) + ' €'); countTo($('.pv-fin', el), round100(val), n => eurR(round100(n)));
    const odd = $('.pv-r.odd input', el).checked;
    $('.pv-n', el).innerHTML = odd ? '<b>Attention :</b> l’hôtel particulier de la place Stanislas n’est pas comparable (type, époque, style). Il fait grimper la moyenne : retire-le.' : `Moyenne des ${on.length} ventes : total des prix au m² ÷ ${on.length}. Le prix affiché est arrondi : ni dizaines d’euros, ni centimes.`;
    if (!odd && on.length === 4 && Math.abs(S - 49.42) < .005 && !el.__done){ el.__done = true; addXP(5, {target:el}); }
  };
  el.addEventListener('input', calc); el.addEventListener('change', calc); calc();
});

/* 3. Ça compte ou pas ? Habitable, Carrez, pondérée — ou défi */
JLG.widget('surfaces', (el, o) => {
  if (o && o.mode === 'defi'){
    const Y = 'Oui, ça compte', N = 'Non, ça ne compte pas';
    const q = (t, ok, e) => ({q:t, a:ok ? Y : N, o:[Y, N], e});
    const items = [
      q('Une <b>cave</b> compte-t-elle dans la surface habitable ?', 0, 'Caves, sous-sols, garages, remises : exclus.'),
      q('Un <b>garage</b> compte-t-il dans la surface habitable ?', 0, 'Exclu de la surface habitable (et de la loi Carrez).'),
      q('Une <b>loggia ouverte</b> compte-t-elle dans la surface habitable ?', 0, 'Terrasses, loggias, balcons : exclus.'),
      q('Une <b>véranda</b> compte-t-elle dans la surface habitable ?', 0, 'Exclue de la surface habitable. Elle peut compter dans la superficie Carrez (local clos et couvert).'),
      q('Une <b>véranda</b> peut-elle compter dans la superficie Carrez ?', 1, 'Oui : c’est un local clos et couvert (art. 4-1 du décret de 1967).'),
      q('Un <b>salon de 20 m²</b> compte-t-il dans la surface habitable ?', 1, 'Une pièce à vivre compte, murs et cloisons déduits.'),
      q('Une <b>salle d’eau</b> compte-t-elle dans la surface habitable ?', 1, 'Oui, comme toute pièce habitable.'),
      q('Dans une chambre mansardée, la partie de <b>moins de 1,80 m</b> de hauteur compte-t-elle ?', 0, 'Les parties de moins de 1,80 m sont exclues.'),
      q('Des <b>combles non aménagés</b> comptent-ils dans la surface habitable ?', 0, 'Seuls les combles aménagés peuvent compter.'),
      q('Un lot de <b>6 m²</b> compte-t-il dans la loi Carrez ?', 0, 'Les lots de moins de 8 m² ne sont pas comptés.'),
      q('Un <b>garage</b> compte-t-il dans la surface pondérée ?', 0, 'Dans la grille de pondération, les garages ne sont pas pris en compte.'),
      {q:'Quel est le coefficient d’un <b>sas d’entrée couvert et fermé</b> ?', a:'0,70', o:['0,70', '0,50', '0,40', '1'], e:'Un porche couvert et ouvert : 0,50.'},
      {q:'Quel est le coefficient d’un <b>balcon</b> de plus de 1 m de saillie et plus de 2 m² ?', a:'0,40', o:['0,40', '0,60', '0,70', '1'], e:'Comme les terrasses accessibles. Les loggias : 0,60.'},
      {q:'Quel est le coefficient du <b>rez-de-chaussée aménagé</b> ?', a:'1', o:['1', '0,50', '0,70', '0,15'], e:'Le rez-de-chaussée non aménagé (caves, communs) : 0,50.'},
      {q:'Quel est le coefficient d’une <b>loggia</b> (ou salle ouverte sur deux faces) ?', a:'0,60', o:['0,60', '0,40', '0,50', '1'], e:'0,40 pour balcons et terrasses.'}
    ];
    return fmQuiz(el, {items, n:8, eyebrow:'Défi', hint:'Surface habitable, Carrez ou pondérée : applique la règle.', title:'Ça compte ou pas ?', perfect:'Tu mesures au centimètre près.', again:'Exclus de la surface habitable : cave, garage, terrasse, loggia, balcon, véranda, parties sous 1,80 m.'});
  }
  const SETS = {
    hab:{l:'Habitable', p:5045, u:'Appartement à Strasbourg · 5 045 €/m²', rows:[
      {n:'Entrée', s:4.75, ok:1, w:'Pièce habitable.'}, {n:'Cuisine', s:8.25, ok:1, w:'Pièce habitable.'}, {n:'Salon – salle à manger', s:20.44, ok:1, w:'Pièce habitable.'},
      {n:'Loggia', s:7.5, ok:0, w:'Exclue : loggias, balcons et terrasses ne comptent pas.'},
      {n:'Chambre mansardée 1 (10,14 m² dont 1,11 sous 1,80 m)', s:9.03, ok:1, w:'10,14 − 1,11 = 9,03 m² : la partie sous 1,80 m est exclue.'},
      {n:'Chambre mansardée 2 (11,89 m² dont 1,72 sous 1,80 m)', s:10.17, ok:1, w:'11,89 − 1,72 = 10,17 m².'},
      {n:'Salle d’eau avec WC', s:6.12, ok:1, w:'Pièce habitable.'},
      {n:'Cave', s:3.8, ok:0, w:'Exclue : caves, sous-sols, remises.'}, {n:'Garage', s:11, ok:0, w:'Exclu : garage.'}]},
    pon:{l:'Pondérée', p:2491, u:'Chalet à Gérardmer · 2 491 €/m²', rows:[
      {n:'Sas d’entrée couvert et fermé (2,70 m²) · coef. 0,70', s:1.89, ok:1, w:'2,70 × 0,70 = 1,89 m² pondérés.'},
      {n:'Cuisine (7,82 m²) · coef. 1', s:7.82, ok:1, w:'Rez-de-chaussée aménagé : coefficient 1.'},
      {n:'Salon – salle à manger (22,10 m²) · coef. 1', s:22.1, ok:1, w:'Rez-de-chaussée aménagé : coefficient 1.'},
      {n:'Chambre avec salle de bains (16,79 m²) · coef. 1', s:16.79, ok:1, w:'Rez-de-chaussée aménagé : coefficient 1.'},
      {n:'Garage attenant (9,89 m²)', s:9.89, ok:0, w:'Les garages ne sont pas pris en compte.'}]}
  };
  let cur = 'hab', picked = new Set(), checked = false;
  el.innerHTML = `<div class="w w-sf">
    <div class="w-head"><span class="eyebrow">Simulateur</span><b>Quelle surface retenir ?</b><span class="muted">Touche les lignes qui comptent, puis vérifie.</span></div>
    <div class="seg-ctrl sf-tabs" role="tablist">${Object.entries(SETS).map(([k, s]) => `<button role="tab" data-k="${k}" aria-selected="${k === cur}">${s.l}</button>`).join('')}</div>
    <p class="muted sf-u"></p><div class="sf-list"></div>
    <div class="sf-res" aria-live="polite"><div><span class="sf-lab">Surface retenue</span><b class="sf-tot">0 m²</b></div><div><span>Valeur vénale</span><b class="sf-val">0 €</b></div></div>
    <div class="btn-row"><button class="btn btn-primary sf-chk">Vérifier</button><button class="btn sf-rst">Recommencer</button></div></div>`;
  const draw = () => {
    const S = SETS[cur]; $('.sf-u', el).textContent = S.u;
    $('.sf-list', el).innerHTML = S.rows.map((r, i) => `<button class="sf-r${picked.has(i) ? ' on' : ''}${checked ? (picked.has(i) === !!r.ok ? ' good' : ' bad') : ''}" data-i="${i}" aria-pressed="${picked.has(i)}"><span class="sf-ck">${picked.has(i) ? '✓' : ''}</span><span class="sf-n">${r.n}${checked ? `<small>${r.w}</small>` : ''}</span><b>${frN(r.s, 2)} m²</b></button>`).join('');
    const tot = [...picked].reduce((t, i) => t + S.rows[i].s, 0);
    countTo($('.sf-tot', el), tot, n => frN(n, 2) + ' m²'); countTo($('.sf-val', el), tot * S.p, n => eurR(n));
  };
  el.addEventListener('click', e => {
    const t = e.target.closest('.sf-tabs button'); if (t){ cur = t.dataset.k; picked = new Set(); checked = false; $$('.sf-tabs button', el).forEach(b => b.setAttribute('aria-selected', b === t)); return draw(); }
    const r = e.target.closest('.sf-r'); if (r && !checked){ const i = +r.dataset.i; picked.has(i) ? picked.delete(i) : picked.add(i); return draw(); }
    if (e.target.closest('.sf-chk')){ checked = true; draw(); const S = SETS[cur], okAll = S.rows.every((x, i) => picked.has(i) === !!x.ok); if (okAll && !el['__d' + cur]){ el['__d' + cur] = 1; addXP(5, e); confetti(40); } }
    if (e.target.closest('.sf-rst')){ picked = new Set(); checked = false; draw(); }
  });
  draw();
});

/* 4. La méthode par le revenu */
JLG.widget('capital', el => {
  const CAT = {
    IIA:{l:'II A', lo:2, hi:4}, IIB:{l:'II B', lo:2, hi:4}, IIC:{l:'II C', lo:3, hi:6}, IIIA:{l:'III A', lo:4, hi:7}, IIIB:{l:'III B', lo:5, hi:10}, IV:{l:'IV', lo:8, hi:12}, PRO:{l:'Local professionnel', lo:6, hi:10}
  };
  let cat = 'IIB';
  el.innerHTML = `<div class="w w-cap">
    <div class="w-head"><span class="eyebrow">Simulateur</span><b>Capitaliser un loyer</b><span class="muted">Valeur vénale = (loyer hors charges × 12) ÷ taux.</span></div>
    <div class="rp-tgs cp-cat">${Object.entries(CAT).map(([k, c]) => `<button class="rp-tg" data-k="${k}" aria-pressed="${k === cat}">${c.l}</button>`).join('')}</div>
    <label class="rp-f"><span>Loyer mensuel charges comprises : <output class="cp-l">1 370 €</output></span><input class="cp-lo" type="range" min="300" max="3000" step="10" value="1370"></label>
    <label class="rp-f"><span>Charges : <output class="cp-c">120 €</output></span><input class="cp-ch" type="range" min="0" max="400" step="5" value="120"></label>
    <label class="rp-f"><span>Taux de capitalisation : <output class="cp-t">3 %</output> <small class="cp-rg muted"></small></span><input class="cp-tx" type="range" min="2" max="12" step="0.5" value="3"></label>
    <div class="cp-eq"><div><span>Loyer net par mois</span><b class="cp-n">1 250 €</b></div><i>× 12</i><div><span>Revenu annuel net</span><b class="cp-a">15 000 €</b></div><i>÷ taux</i><div class="big"><span>Valeur vénale</span><b class="cp-v">500 000 €</b></div></div>
    <div class="cp-bar"><i class="cp-zone"></i><u class="cp-pt"></u></div>
    <p class="cp-n2 muted" aria-live="polite"></p></div>`;
  const calc = () => {
    const l = +$('.cp-lo', el).value, c = +$('.cp-ch', el).value, t = +$('.cp-tx', el).value, C = CAT[cat], net = Math.max(0, l - c), an = net * 12, v = an / (t / 100);
    $('.cp-l', el).textContent = eurR(l); $('.cp-c', el).textContent = eurR(c); $('.cp-t', el).textContent = frN(t, 1).replace(',0', '') + ' %'; $('.cp-rg', el).textContent = `(usage : ${C.lo} à ${C.hi} %)`;
    countTo($('.cp-n', el), net, eurR); countTo($('.cp-a', el), an, eurR); countTo($('.cp-v', el), round100(v), n => eurR(round100(n)));
    const z = $('.cp-zone', el), pt = $('.cp-pt', el); z.style.left = (C.lo - 2) / 10 * 100 + '%'; z.style.width = (C.hi - C.lo) / 10 * 100 + '%'; pt.style.left = (t - 2) / 10 * 100 + '%';
    const ok = t >= C.lo && t <= C.hi;
    $('.cp-n2', el).innerHTML = (ok ? 'Le taux est dans la fourchette d’usage de cette catégorie.' : '<b>Hors fourchette d’usage</b> : un taux isolé change la valeur de beaucoup, recoupe avec la comparaison.') + (c >= l ? ' Les charges dépassent le loyer : rien à capitaliser.' : '') + ` Avec les charges oubliées, on trouverait ${eurR(round100(l * 12 / (t / 100)))} : trop haut.`;
    if (cat === 'IIB' && l === 1370 && c === 120 && t === 3 && !el.__done){ el.__done = true; addXP(5, {target:el}); }
  };
  el.addEventListener('input', calc);
  el.addEventListener('click', e => { const b = e.target.closest('.cp-cat .rp-tg'); if (b){ cat = b.dataset.k; $$('.cp-cat .rp-tg', el).forEach(x => x.setAttribute('aria-pressed', x === b)); const C = CAT[cat]; $('.cp-tx', el).value = Math.round((C.lo + C.hi) / 2 * 2) / 2; calc(); } });
  calc();
});

/* 5. Le logement décent : louable ou non ? — ou défi */
JLG.widget('decence', (el, o) => {
  const rule = (s, h, dpe, y, sous) => {
    const r = [];
    const surf = (s >= 9 && h >= 2.2) || s * h >= 20;
    r.push({ok:surf, t:`Pièce principale : ${frN(s, 1)} m² sous ${frN(h, 2)} m = ${frN(s * h, 1)} m³`, w:surf ? 'Il faut 9 m² et 2,20 m, ou 20 m³ : c’est bon.' : 'Il faut 9 m² et 2,20 m de hauteur, ou 20 m³.'});
    const bad = ({G:2025, F:2028, E:2034})[dpe], en = !bad || y < bad;
    r.push({ok:en, t:`DPE ${dpe}, bail en ${y}`, w:en ? 'Louable : la classe n’est pas encore exclue.' : `Les logements ${dpe} sont exclus de la location depuis ${bad}.`});
    r.push({ok:!sous, t:sous ? 'Logement en sous-sol' : 'Logement hors sous-sol', w:sous ? 'Interdit de louer en sous-sol.' : 'Pas d’interdiction à ce titre.'});
    return r;
  };
  if (o && o.mode === 'defi'){
    const Y = 'Oui, louable', N = 'Non, indécent';
    const mk = (s, h, dpe, y, sous) => { const r = rule(s, h, dpe, y, sous), ok = r.every(x => x.ok), bad = r.find(x => !x.ok); return {q:`Pièce principale de <b>${frN(s, 1)} m²</b> pour <b>${frN(h, 2)} m</b> de hauteur, DPE <b>${dpe}</b>, bail signé en <b>${y}</b>${sous ? ', logement en <b>sous-sol</b>' : ''}. Peut-on le louer ?`, a:ok ? Y : N, o:[Y, N], e:ok ? 'Tous les critères testés sont remplis.' : bad.w};};
    const items = [mk(8.5, 2.5, 'D', 2026), mk(8, 2.4, 'C', 2026), mk(12, 2.5, 'G', 2026), mk(12, 2.5, 'G', 2024), mk(18, 2.5, 'F', 2026), mk(18, 2.5, 'F', 2028), mk(20, 2.5, 'E', 2033), mk(20, 2.5, 'E', 2034), mk(15, 2.5, 'C', 2026, true), mk(9, 2.2, 'D', 2026), mk(9, 2.1, 'D', 2026), mk(8, 2.6, 'B', 2026)];
    return fmQuiz(el, {items, n:8, eyebrow:'Défi', hint:'Surface, DPE à la date du bail, sous-sol.', title:'Louable ou non ?', perfect:'Aucun logement indécent ne t’échappe.', again:'9 m² et 2,20 m ou 20 m³. G exclu en 2025, F en 2028, E en 2034. Jamais de sous-sol.'});
  }
  let st = {s:9, h:2.5, dpe:'D', y:2026, sous:false};
  el.innerHTML = `<div class="w w-dc">
    <div class="w-head"><span class="eyebrow">Simulateur</span><b>Ce logement est-il décent ?</b><span class="muted">Règle le logement : le décret du 30 janvier 2002 et le calendrier DPE jugent.</span></div>
    <label class="rp-f"><span>Surface de la pièce principale : <output class="dc-s">9 m²</output></span><input class="dc-si" type="range" min="5" max="20" step="0.5" value="9"></label>
    <label class="rp-f"><span>Hauteur sous plafond : <output class="dc-h">2,50 m</output></span><input class="dc-hi" type="range" min="1.9" max="3" step="0.05" value="2.5"></label>
    <div class="dc-dpe" role="group" aria-label="Classe DPE">${'ABCDEFG'.split('').map(l => `<button class="dpe dpe-${l}" data-l="${l}" aria-pressed="${l === 'D'}">${l}</button>`).join('')}</div>
    <div class="seg-ctrl dc-y" role="tablist">${[2026, 2028, 2034].map(y => `<button role="tab" data-y="${y}" aria-selected="${y === 2026}">Bail en ${y}</button>`).join('')}</div>
    <div class="rp-tgs"><button class="rp-tg dc-sous" aria-pressed="false">Logement en sous-sol</button></div>
    <div class="dc-out" aria-live="polite"></div></div>`;
  const draw = () => {
    $('.dc-s', el).textContent = frN(st.s, 1) + ' m²'; $('.dc-h', el).textContent = frN(st.h, 2) + ' m';
    const r = rule(st.s, st.h, st.dpe, st.y, st.sous), ok = r.every(x => x.ok);
    $('.dc-out', el).innerHTML = `<div class="dc-stamp ${ok ? 'ok' : 'ko'}">${ok ? 'Décent : louable' : 'Indécent : pas louable'}</div><ul class="dc-ul">${r.map(x => `<li class="${x.ok ? 'ok' : 'ko'}"><b>${x.ok ? '✓' : '✕'}</b><span>${x.t}<small>${x.w}</small></span></li>`).join('')}</ul><p class="muted">Test limité à trois critères : il faut aussi la sécurité, l’absence de nuisibles et les équipements.</p>`;
    if (!ok && !el.__bad){ el.__bad = 1; } if (ok && el.__bad && !el.__done){ el.__done = 1; addXP(5, {target:el}); }
  };
  el.addEventListener('input', e => { if (e.target.matches('.dc-si')) st.s = +e.target.value; if (e.target.matches('.dc-hi')) st.h = +e.target.value; draw(); });
  el.addEventListener('click', e => {
    const d = e.target.closest('.dpe'); if (d){ st.dpe = d.dataset.l; $$('.dpe', el).forEach(x => x.setAttribute('aria-pressed', x === d)); draw(); }
    const y = e.target.closest('.dc-y button'); if (y){ st.y = +y.dataset.y; $$('.dc-y button', el).forEach(x => x.setAttribute('aria-selected', x === y)); draw(); }
    const s = e.target.closest('.dc-sous'); if (s){ st.sous = !st.sous; s.setAttribute('aria-pressed', st.sous); draw(); }
  });
  draw();
});

/* 6. Enchères en salle ou Immo-interactif — ou défi */
JLG.widget('ventes', (el, o) => {
  if (o && o.mode === 'defi'){
    const E = 'Enchères en salle', I = 'Immo-interactif';
    const q = (t, a, e) => ({q:t, a, o:[E, I], e});
    const items = [
      q('Le vendeur choisit l’offre qui lui convient le mieux.', I, 'Pas forcément la plus haute.'),
      q('Le dernier enchérisseur emporte le bien après deux feux de 30 secondes.', E, 'Si personne ne surenchérit pendant la minute.'),
      q('L’acquéreur peut se rétracter pendant 10 jours.', I, 'Après le compromis. L’adjudicataire, lui, ne peut pas.'),
      q('Un procès-verbal d’adjudication est signé.', E, 'L’adjudicataire n’a aucun droit de rétractation.'),
      q('Le notaire reçoit un mandat exclusif de 6 à 8 semaines.', I, 'La vente complète dure environ 45 jours.'),
      q('Une surenchère de 10 % est possible dans les 10 jours.', E, 'Puis une nouvelle séance de vente est organisée.'),
      q('Les offres se déposent pendant 24 heures sur internet.', I, 'En direct, en temps réel, sur immobilier.notaires.fr.'),
      q('La mise à prix est inférieure d’au moins 30 % à la valeur vénale.', E, 'Pour rendre le bien attractif (ton cours).'),
      q('L’acquéreur n’a ni à se déplacer ni à déposer d’argent.', I, 'Une inscription et un agrément électronique suffisent.'),
      q('Chaque candidat remet un chèque de banque (20 % de la mise à prix, ton cours).', E, 'C’est la consignation.'),
      q('Le bien est attribué au plus offrant.', E, 'Le plus offrant devient l’adjudicataire.'),
      q('Après la vente en ligne, on signe un compromis chez le notaire.', I, 'Avec les conditions suspensives (prêt, préemption…).')
    ];
    return fmQuiz(el, {items, n:8, eyebrow:'Défi', hint:'Enchères en salle ou Immo-interactif ?', title:'Enchères ou Immo-interactif ?', perfect:'Tu connais ces deux ventes sur le bout des doigts.', again:'Enchères : plus offrant, pas de rétractation. Immo-interactif : le vendeur choisit, compromis, 10 jours.'});
  }
  const T = {
    ench:{l:'Enchères en salle', s:[
      {t:'Expertise et mise à prix', d:'Une expertise fixe la valeur vénale. La mise à prix est inférieure d’au moins 30 % (ton cours).'},
      {t:'Cahier des charges', d:'Caractéristiques du bien, modalités de la vente, diagnostics, état hypothécaire.'},
      {t:'Publicité et visites', d:'Presse locale ou spécialisée, sites web, puis visites aux dates fixées.'},
      {t:'L’audience', d:'Pièce d’identité et chèque de banque (20 % de la mise à prix) ; une plaquette permet d’enchérir.'},
      {t:'Les feux', d:'Silence : deux feux de 30 secondes. Sans nouvelle enchère, le dernier enchérisseur est adjudicataire.'},
      {t:'La surenchère', d:'10 jours pour surenchérir d’au moins 10 % : nouvelle séance avec une mise à prix majorée.'},
      {t:'Le paiement', d:'Pas de rétractation. Prix payé sous 45 jours (ton cours).'}]},
    inter:{l:'Immo-interactif', s:[
      {t:'Mandat exclusif', d:'Le vendeur signe un mandat de 6 à 8 semaines au plus avec le notaire.'},
      {t:'Annonce et visites', d:'Annonce sur immobilier.notaires.fr (photos, diagnostics, plans) puis ailleurs ; visites pendant 3 à 4 semaines.'},
      {t:'Agrément', d:'Chaque visiteur signe une demande d’agrément, s’inscrit et reçoit un agrément électronique.'},
      {t:'24 heures d’offres', d:'Les offres sont déposées en direct, en temps réel. Aucun argent n’est déposé d’avance.'},
      {t:'Le vendeur choisit', d:'Pas forcément la plus haute offre : celle qui lui convient le mieux.'},
      {t:'Compromis', d:'Signé chez le notaire, avec 10 jours de rétractation et les conditions suspensives.'}]}
  };
  let cur = 'ench', k = 0;
  el.innerHTML = `<div class="w w-vt">
    <div class="w-head"><span class="eyebrow">Frise interactive</span><b>Le déroulé d’une vente notariale</b><span class="muted">Choisis la vente, puis avance étape par étape.</span></div>
    <div class="seg-ctrl vt-tabs" role="tablist">${Object.entries(T).map(([i, v]) => `<button role="tab" data-k="${i}" aria-selected="${i === cur}">${v.l}</button>`).join('')}</div>
    <ol class="vt-line"></ol><div class="vt-out" aria-live="polite"></div>
    <div class="btn-row"><button class="btn vt-prev">Précédent</button><button class="btn btn-primary vt-next">Suivant</button></div></div>`;
  const draw = () => {
    const S = T[cur].s; k = Math.max(0, Math.min(S.length - 1, k));
    $('.vt-line', el).innerHTML = S.map((s, i) => `<li><button class="vt-d${i < k ? ' done' : ''}${i === k ? ' cur' : ''}" data-i="${i}" aria-label="Étape ${i + 1} : ${esc(s.t)}"><span>${i + 1}</span></button></li>`).join('');
    $('.vt-out', el).innerHTML = `<div class="w-card"><span class="eyebrow">Étape ${k + 1} sur ${S.length}</span><b class="w-t">${S[k].t}</b><p>${S[k].d}</p></div>`;
    $('.vt-prev', el).disabled = k === 0; $('.vt-next', el).disabled = k === S.length - 1;
    if (k === S.length - 1){ el['__e' + cur] = 1; if (el.__eench && el.__einter && !el.__done){ el.__done = 1; addXP(5, {target:el}); } }
  };
  el.addEventListener('click', e => {
    const t = e.target.closest('.vt-tabs button'); if (t){ cur = t.dataset.k; k = 0; $$('.vt-tabs button', el).forEach(b => b.setAttribute('aria-selected', b === t)); return draw(); }
    const d = e.target.closest('.vt-d'); if (d){ k = +d.dataset.i; return draw(); }
    if (e.target.closest('.vt-next')){ k++; draw(); } if (e.target.closest('.vt-prev')){ k--; draw(); }
  });
  draw();
});

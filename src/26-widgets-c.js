
/* =================== OUTILS DU NOTARIAT =================== */
const toHaACa = m2 => { m2 = Math.max(0, Math.round(+m2 || 0)); return {ha:Math.floor(m2 / 10000), a:Math.floor(m2 % 10000 / 100), ca:m2 % 100}; };
const fmtCont = (x, acte) => acte ? `${pad2(x.ha)} ha ${pad2(x.a)} a ${pad2(x.ca)} ca` : `${x.ha} ha ${x.a} a ${x.ca} ca`;
function copyText(txt, btn){
  const ok = () => { toast('Copié !'); };
  try { navigator.clipboard.writeText(txt).then(ok, () => fallback()); } catch(e){ fallback(); }
  function fallback(){ const ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); let done = false; try { done = document.execCommand('copy'); } catch(e){} ta.remove(); toast(done ? 'Copié !' : 'Sélectionne le texte pour le copier'); }
}

/* Convertisseur ha · a · ca */
JLG.widget('convert', el => {
  el.innerHTML = `<div class="w w-conv">
    <div class="conv-grid">
      <div class="field"><label for="cv-m2">Surface en m²</label><input id="cv-m2" inputmode="numeric" autocomplete="off" value="12345"></div>
      <div class="conv-split" aria-hidden="true"></div>
      <div class="conv-out"><div class="cv-cell g-ha"><b id="cvha">0</b><span>hectare(s)</span></div><div class="cv-cell g-a"><b id="cva">0</b><span>are(s)</span></div><div class="cv-cell g-ca"><b id="cvca">0</b><span>centiare(s)</span></div></div>
      <p class="conv-acte">Dans un acte : <span class="mono" id="cvacte"></span> <button class="btn btn-sm btn-ghost" id="cvcopy">${icon('copy')}Copier</button></p>
    </div>
    ${block({t:'tip', k:'memo', title:'L’astuce des paquets de 2', h:'Découpe le nombre de m² <b>en partant de la droite</b>, par paquets de 2 chiffres : les 2 derniers = les <b>centiares</b>, les 2 d’avant = les <b>ares</b>, le reste = les <b>hectares</b>. 1 ha = 100 a = 10 000 m² ; 1 a = 100 m² ; 1 ca = 1 m².'})}
    <div class="conv-rev"><div class="eyebrow">Dans l’autre sens</div><div class="rev-in"><div class="field"><label for="cv-ha">ha</label><input id="cv-ha" inputmode="numeric" value="2"></div><div class="field"><label for="cv-a">a</label><input id="cv-a" inputmode="numeric" value="5"></div><div class="field"><label for="cv-ca">ca</label><input id="cv-ca" inputmode="numeric" value="30"></div><div class="rev-eq">= <b id="cvm2">0</b> m²</div></div><p class="w-note" id="cvwarn"></p></div></div>`;
  const inp = $('#cv-m2', el);
  const draw = () => {
    const raw = inp.value.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');
    const m = raw ? +raw : 0; const x = toHaACa(m);
    $('#cvha', el).textContent = fmtNum(x.ha); $('#cva', el).textContent = x.a; $('#cvca', el).textContent = x.ca;
    $('#cvacte', el).textContent = fmtCont(x, true);
    const ds = String(m).split(''); const n = ds.length;
    $('.conv-split', el).innerHTML = ds.map((d, i) => { const fromR = n - i; const g = fromR <= 2 ? 'g-ca' : fromR <= 4 ? 'g-a' : 'g-ha'; const gs = i > 0 && (fromR === 2 || fromR === 4) ? ' gs' : ''; return `<span class="dg ${g}${gs}" style="animation-delay:${i * 35}ms">${d}</span>`; }).join('') + '<span class="dg-u">m²</span>';
  };
  const rev = () => {
    const v = id => Math.max(0, parseInt($(id, el).value.replace(/[^\d]/g, ''), 10) || 0);
    const ha = v('#cv-ha'), a = v('#cv-a'), ca = v('#cv-ca');
    $('#cvm2', el).textContent = fmtNum(ha * 10000 + a * 100 + ca);
    $('#cvwarn', el).innerHTML = (a >= 100 || ca >= 100) ? `Attention : ${a >= 100 ? '100 a = 1 ha' : ''}${a >= 100 && ca >= 100 ? ' et ' : ''}${ca >= 100 ? '100 ca = 1 a' : ''}. On écrirait plutôt <b class="mono">${fmtCont(toHaACa(ha * 10000 + a * 100 + ca), true)}</b>.` : '';
  };
  inp.addEventListener('input', draw); $$('.rev-in input', el).forEach(i => i.addEventListener('input', rev));
  $('#cvcopy', el).onclick = e => copyText($('#cvacte', el).textContent, e.currentTarget);
  draw(); rev();
});

/* Additions de contenances */
JLG.widget('trainer', el => {
  let rows = [], tot = null;
  el.innerHTML = `<div class="w w-train"><div class="enonce"><div class="ek">Désignation · exercice</div><div class="tr-table"></div></div>
    <div class="tr-ans"><div class="eyebrow">Ton total</div><div class="rev-in"><div class="field"><label for="tr-ha">ha</label><input id="tr-ha" inputmode="numeric"></div><div class="field"><label for="tr-a">a</label><input id="tr-a" inputmode="numeric"></div><div class="field"><label for="tr-ca">ca</label><input id="tr-ca" inputmode="numeric"></div></div>
    <div class="btn-row" style="margin-top:12px"><button class="btn btn-primary" id="tr-ok">${icon('check')}Vérifier</button><button class="btn" id="tr-new">${icon('refresh')}Nouvelles parcelles</button></div></div>
    <div class="tr-out" aria-live="polite"></div></div>`;
  const gen = () => {
    const n = 3 + Math.floor(Math.random() * 2); const sec = pick(['ZB', 'AK', 'B', 'AI', 'DI']); let num = 100 + Math.floor(Math.random() * 400);
    rows = Array.from({length:n}, () => ({s:sec, n:(num += 1 + Math.floor(Math.random() * 3)), ha:Math.random() < .55 ? Math.floor(Math.random() * 4) : 0, a:Math.floor(Math.random() * 100), ca:Math.floor(Math.random() * 100)}));
    const sca = rows.reduce((s, r) => s + r.ca, 0), sa = rows.reduce((s, r) => s + r.a, 0), sha = rows.reduce((s, r) => s + r.ha, 0);
    const r1 = Math.floor(sca / 100), ca = sca % 100, a2 = sa + r1, r2 = Math.floor(a2 / 100), a = a2 % 100, ha = sha + r2;
    tot = {ha, a, ca, sca, sa, sha, r1, r2, a2};
    $('.tr-table', el).innerHTML = `<div class="tbl" style="border-color:#dcd2ea"><table style="min-width:0"><thead><tr><th>Section</th><th>N°</th><th>ha</th><th>a</th><th>ca</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.s}</td><td>${r.n}</td><td class="mono">${pad2(r.ha)}</td><td class="mono">${pad2(r.a)}</td><td class="mono">${pad2(r.ca)}</td></tr>`).join('')}<tr><td colspan="2"><b>Total</b></td><td class="mono">?</td><td class="mono">?</td><td class="mono">?</td></tr></tbody></table></div>`;
    $$('.tr-ans input', el).forEach(i => i.value = ''); $('.tr-out', el).innerHTML = '';
  };
  $('#tr-new', el).onclick = gen;
  $('#tr-ok', el).onclick = e => {
    const v = id => parseInt(($(id, el).value || '').replace(/[^\d]/g, ''), 10) || 0;
    const ok = v('#tr-ha') === tot.ha && v('#tr-a') === tot.a && v('#tr-ca') === tot.ca;
    $('.tr-out', el).innerHTML = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Total exact !' : 'Pas encore. Voici le calcul :'}</div>
      <p><b>1. Centiares :</b> ${rows.map(r => pad2(r.ca)).join(' + ')} = ${tot.sca} → <b>${pad2(tot.ca)} ca</b>${tot.r1 ? `, je retiens <b>${tot.r1} a</b>` : ''}.</p>
      <p><b>2. Ares :</b> ${rows.map(r => pad2(r.a)).join(' + ')}${tot.r1 ? ` + ${tot.r1} (retenue)` : ''} = ${tot.a2} → <b>${pad2(tot.a)} a</b>${tot.r2 ? `, je retiens <b>${tot.r2} ha</b>` : ''}.</p>
      <p><b>3. Hectares :</b> ${rows.map(r => r.ha).join(' + ')}${tot.r2 ? ` + ${tot.r2} (retenue)` : ''} = <b>${tot.ha} ha</b>.</p>
      <p><b>Total : <span class="mono">${fmtCont(tot, true)}</span></b></p></div>`;
    if (ok){ addXP(15, e); confetti(70); }
  };
  gen();
});

/* Générateur de clause « désignation » */
JLG.widget('builder', el => {
  const NAT = ['Une maison à usage d’habitation', 'Un terrain à bâtir', 'Une parcelle de terre', 'Des parcelles boisées', 'Un local commercial', 'Un appartement (lot de copropriété)'];
  el.innerHTML = `<div class="w w-build">
    <p class="w-note" style="margin:0 0 12px">Les champs sont pré-remplis avec un <b>exemple</b> : remplace-les par ton dossier.</p>
    <div class="bd-grid">
      <div class="bd-form">
        <div class="field"><label for="bd-nat">Nature du bien</label><select id="bd-nat">${NAT.map(n => `<option>${n}</option>`).join('')}</select></div>
        <div class="bd-2"><div class="field"><label for="bd-com">Commune</label><input id="bd-com" value="Nancy"></div><div class="field"><label for="bd-cp">Code postal</label><input id="bd-cp" inputmode="numeric" value="54000"></div></div>
        <div class="field"><label for="bd-adr">Adresse ou lieudit</label><input id="bd-adr" value="12 rue des Lilas"></div>
        <div class="field"><label for="bd-comp">Composition (facultatif)</label><textarea id="bd-comp" rows="2">au rez-de-chaussée : une entrée, une cuisine, un séjour ; à l’étage : trois chambres, une salle de bains et un WC</textarea></div>
        <div class="eyebrow" style="margin-top:6px">Parcelles cadastrales</div>
        <div id="bd-parc"></div><button class="btn btn-sm" id="bd-addp">+ Ajouter une parcelle</button>
        <div class="eyebrow" style="margin-top:14px">Meubles vendus avec le bien (facultatif)</div>
        <div id="bd-meu"></div><button class="btn btn-sm" id="bd-addm">+ Ajouter un meuble</button>
      </div>
      <div class="bd-prev"><div class="bd-checks" id="bd-checks"></div><article class="acte-paper" id="bd-out"></article><div class="btn-row" style="margin-top:12px"><button class="btn btn-primary" id="bd-copy">${icon('copy')}Copier la clause</button></div></div>
    </div></div>`;
  let parcs = [{s:'BK', n:'87', l:'12 rue des Lilas', m2:'605'}], meus = [{d:'Un réfrigérateur-congélateur', v:'600'}, {d:'Un lave-linge', v:'400'}];
  const pRow = (p, i) => `<div class="bd-row" data-i="${i}"><div class="field"><label for="bd-s${i}">Section</label><input id="bd-s${i}" data-k="s" value="${esc(p.s)}"></div><div class="field"><label for="bd-n${i}">N°</label><input id="bd-n${i}" data-k="n" inputmode="numeric" value="${esc(p.n)}"></div><div class="field grow"><label for="bd-l${i}">Lieudit</label><input id="bd-l${i}" data-k="l" value="${esc(p.l)}"></div><div class="field"><label for="bd-m${i}">m²</label><input id="bd-m${i}" data-k="m2" inputmode="numeric" value="${esc(p.m2)}"></div>${i ? `<button class="icon-btn bd-del" data-del="${i}" aria-label="Supprimer la parcelle">${icon('x')}</button>` : ''}</div>`;
  const mRow = (m, i) => `<div class="bd-row" data-i="${i}"><div class="field grow"><label for="bd-md${i}">Meuble</label><input id="bd-md${i}" data-k="d" value="${esc(m.d)}"></div><div class="field"><label for="bd-mv${i}">Valeur €</label><input id="bd-mv${i}" data-k="v" inputmode="numeric" value="${esc(m.v)}"></div><button class="icon-btn bd-del" data-delm="${i}" aria-label="Supprimer le meuble">${icon('x')}</button></div>`;
  const rows = () => { $('#bd-parc', el).innerHTML = parcs.map(pRow).join(''); $('#bd-meu', el).innerHTML = meus.map(mRow).join(''); };
  const val = id => ($(id, el).value || '').trim();
  const draw = () => {
    const nat = val('#bd-nat'), com = val('#bd-com').toUpperCase(), cp = val('#bd-cp'), adr = val('#bd-adr'), comp = val('#bd-comp');
    const ps = parcs.filter(p => p.s || p.n || p.m2);
    const totM2 = ps.reduce((s, p) => s + (parseInt(String(p.m2).replace(/[^\d]/g, ''), 10) || 0), 0);
    const ms = meus.filter(m => m.d); const totV = ms.reduce((s, m) => s + (parseFloat(String(m.v).replace(',', '.').replace(/[^\d.]/g, '')) || 0), 0);
    const checks = [['Nature', !!nat], ['Situation', !!(com && adr)], ['Contenance', totM2 > 0], ['Cadastre', ps.length && ps.every(p => p.s && p.n)]];
    $('#bd-checks', el).innerHTML = checks.map(c => `<span class="tag ${c[1] ? 'good' : 'warn'}">${c[1] ? '✓' : '!'} ${c[0]}</span>`).join('');
    const eur = n => n.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' EUR';
    $('#bd-out', el).innerHTML = `<div class="ap-h">Désignation</div>
      <p>A <b>${esc(com || '…')}</b> (${esc(cp || '…')}), ${esc(adr || '…')},</p>
      <p><b>${esc(nat)}</b>${comp ? ` comprenant : ${esc(comp)}` : ''}.</p>
      <p>Figurant au cadastre de la manière suivante :</p>
      <div class="ap-tbl"><table><thead><tr><th>Section</th><th>N°</th><th>Lieudit</th><th>Contenance</th></tr></thead><tbody>${ps.map(p => `<tr><td>${esc(p.s)}</td><td>${esc(p.n)}</td><td>${esc(p.l)}</td><td class="mono">${fmtCont(toHaACa(String(p.m2).replace(/[^\d]/g, '')), true)}</td></tr>`).join('')}${ps.length > 1 ? `<tr><td colspan="3"><b>Total</b></td><td class="mono"><b>${fmtCont(toHaACa(totM2), true)}</b></td></tr>` : ''}</tbody></table></div>
      <p>Tel que le BIEN existe, s’étend, se poursuit et comporte, avec toutes ses aisances et dépendances, sans aucune exception ni réserve.</p>
      ${ms.length ? `<div class="ap-h" style="margin-top:14px">Meubles</div><p>La vente comprend également les meubles et objets mobiliers suivants :</p><div class="ap-tbl"><table><tbody>${ms.map(m => `<tr><td>${esc(m.d)}</td><td class="mono" style="text-align:right">${eur(parseFloat(String(m.v).replace(',', '.').replace(/[^\d.]/g, '')) || 0)}</td></tr>`).join('')}<tr><td><b>Montant total du mobilier</b></td><td class="mono" style="text-align:right"><b>${eur(totV)}</b></td></tr></tbody></table></div>` : ''}`;
  };
  const sync = e => {
    const r = e.target.closest('.bd-row'); const k = e.target.dataset.k;
    if (r && k){ const arr = r.parentElement.id === 'bd-parc' ? parcs : meus; arr[+r.dataset.i][k] = e.target.value; }
    draw();
  };
  el.addEventListener('input', sync); el.addEventListener('change', sync);
  el.addEventListener('click', e => {
    if (e.target.closest('#bd-addp')){ if (parcs.length < 6){ parcs.push({s:parcs[0].s, n:'', l:parcs[0].l, m2:''}); rows(); draw(); } }
    else if (e.target.closest('#bd-addm')){ meus.push({d:'', v:''}); rows(); draw(); }
    else if (e.target.closest('[data-del]')){ parcs.splice(+e.target.closest('[data-del]').dataset.del, 1); rows(); draw(); }
    else if (e.target.closest('[data-delm]')){ meus.splice(+e.target.closest('[data-delm]').dataset.delm, 1); rows(); draw(); }
    else if (e.target.closest('#bd-copy')){ copyText($('#bd-out', el).innerText, e.target); }
  });
  rows(); draw();
});

/* Galerie des clauses du cours (surligneur), par jeux de clauses */
const GSETS = {
  designation:{l:'Désignation', head:'Désignation', hl:[['nat', 'Nature'], ['sit', 'Situation'], ['con', 'Contenance'], ['cad', 'Cadastre'], ['meu', 'Meubles'], ['cop', 'Copropriété / lots']]},
  effet:{l:'Effet relatif', head:'Effet relatif', hl:[['act', 'Nature de l’acte'], ['not', 'Notaire'], ['dat', 'Date de l’acte'], ['pub', 'Publication']]},
  origine:{l:'Origine de propriété', head:'Origine de propriété', hl:[['act', 'Nature de l’acte'], ['not', 'Notaire'], ['dat', 'Date de l’acte'], ['pub', 'Publication']]},
  autres:{l:'Autres clauses', head:'Clause', hl:[['tex', 'Textes de loi'], ['ref', 'Références'], ['dec', 'Déclarations']]},
  comparution:{l:'Comparution', head:'Comparution', hl:[['idt', 'Identité, dénomination'], ['pro', 'Profession, forme'], ['dom', 'Domicile, siège'], ['nai', 'Naissance, constitution'], ['civ', 'Situation familiale'], ['fis', 'Nationalité, immatriculation']]},
  acte:{l:'Signature et intervention', head:'Clause', hl:[['tex', 'Textes de loi'], ['ref', 'Références'], ['dec', 'Déclarations']]}
};
JLG.widget('gallery', (el, o) => {
  const all = []; JLG.chapters.forEach(c => (c.clauses || []).forEach(k => all.push(Object.assign({cid:c.id}, k))));
  if (!all.length){ el.innerHTML = '<div class="empty">Aucune clause pour l’instant.</div>'; return; }
  const setOf = k => k.set || 'designation';
  const sets = Object.keys(GSETS).filter(s => all.some(k => setOf(k) === s));
  const fixed = o.set && sets.includes(o.set);
  let cur = fixed ? o.set : sets[0], list = [];
  el.innerHTML = `<div class="w w-gal">
    ${!fixed && sets.length > 1 ? `<div class="seg-ctrl gal-sets" role="tablist" aria-label="Type de clause">${sets.map(s => `<button role="tab" data-set="${s}">${GSETS[s].l}</button>`).join('')}</div>` : ''}
    <div class="gal-pick"><label for="gal-s-${cur}" class="eyebrow">Choisis un modèle</label><select class="gal-s" id="gal-s-${cur}"></select></div>
    <div class="hl-tog" role="group" aria-label="Surligneur"></div>
    <article class="acte-paper gal-out"></article>
    <p class="w-note gal-note"></p></div>`;
  const out = $('.gal-out', el), sel = $('.gal-s', el), tog = $('.hl-tog', el);
  const show = i => { const k = list[i]; out.innerHTML = `<div class="ap-h">${k.head || GSETS[cur].head}</div>${k.h}`; $('.gal-note', el).innerHTML = k.note || ''; out.classList.remove('flash'); void out.offsetWidth; out.classList.add('flash'); $$('.ap-tbl', out).forEach(t => { t.tabIndex = 0; t.setAttribute('role', 'region'); t.setAttribute('aria-label', 'Tableau de la clause'); }); };
  const useSet = s => {
    cur = s; list = all.filter(k => setOf(k) === s);
    $$('.gal-sets button', el).forEach(b => b.setAttribute('aria-selected', b.dataset.set === s));
    sel.innerHTML = list.map((k, i) => `<option value="${i}">${k.t}</option>`).join('');
    const hl = GSETS[s].hl;
    tog.innerHTML = hl.map(h => `<button aria-pressed="true" data-h="${h[0]}"><i class="hl-sw hl-${h[0]}"></i>${h[1]}</button>`).join('');
    out.className = 'acte-paper gal-out ' + hl.map(h => 'hl-on-' + h[0]).join(' ');
    show(0);
  };
  sel.addEventListener('change', e => show(+e.target.value));
  tog.addEventListener('click', e => { const b = e.target.closest('[data-h]'); if (!b) return; const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); out.classList.toggle('hl-on-' + b.dataset.h, on); });
  const ss = $('.gal-sets', el); if (ss) ss.addEventListener('click', e => { const b = e.target.closest('[data-set]'); if (b) useSet(b.dataset.set); });
  useSet(cur);
});

/* Ventilation des meubles */
JLG.widget('ventil', el => {
  el.innerHTML = `<div class="w w-ventil">
    <div class="rev-in">
      <div class="field"><label for="vt-p">Prix total de vente (€)</label><input id="vt-p" inputmode="numeric" value="245000"></div>
      <div class="field"><label for="vt-m">Dont meubles (€)</label><input id="vt-m" inputmode="numeric" value="8200"></div>
      <div class="field"><label for="vt-t">Taux d’exemple (%)</label><input id="vt-t" inputmode="decimal" value="6"></div>
    </div>
    <div class="vt-bars"><div class="vt-bar"><span>Taxes sans liste des meubles</span><b id="vt-v1"></b><i id="vt-b1"></i></div><div class="vt-bar"><span>Taxes avec meubles ventilés</span><b id="vt-v2"></b><i id="vt-b2"></i></div></div>
    <div class="bal-sum"><span>Assiette taxable <b id="vt-a"></b></span><span>Taxes estimées <b id="vt-tx"></b></span><span>Économie <b id="vt-e"></b></span></div>
    <p class="w-note">La TPF et la CSI ne frappent que l’<b>immeuble</b>. Le taux réel dépend du département et de la date : ici c’est un ordre de grandeur. Les meubles doivent être estimés à leur juste valeur, sinon l’administration fiscale peut contester.</p></div>`;
  const draw = () => {
    const n = id => parseFloat(($(id, el).value || '0').replace(',', '.').replace(/[^\d.]/g, '')) || 0;
    const p = n('#vt-p'), m = Math.min(n('#vt-m'), p), t = n('#vt-t') / 100;
    const a = p - m, t1 = p * t, t2 = a * t;
    const eur = v => Math.round(v).toLocaleString('fr-FR') + ' €';
    $('#vt-a', el).textContent = eur(a); $('#vt-tx', el).textContent = eur(t2); $('#vt-e', el).textContent = eur(t1 - t2);
    $('#vt-v1', el).textContent = eur(t1); $('#vt-v2', el).textContent = eur(t2);
    $('#vt-b1', el).style.width = '100%'; $('#vt-b2', el).style.width = (t1 ? t2 / t1 * 100 : 0).toFixed(1) + '%';
  };
  el.addEventListener('input', draw); draw();
});


/* =================== FICHES À APPRENDRE =================== */
const fkKey = (c, f) => c.id + ':' + f.id;
const isKnown = (c, f) => S.fk[fkKey(c, f)] === true;
const cacheSpan = h => `<span class="cache">${h}</span>`;
function ficheItem(it){
  if (it.d != null) return `<div class="fi fi-def"><b class="fi-term">${it.d}</b>${cacheSpan(it.v)}</div>`;
  if (it.a != null) return `<div class="fi fi-art"><span class="fi-ref">${it.a}</span>${cacheSpan(it.v)}</div>`;
  if (it.kv) return `<dl class="fi fi-kv">${it.kv.map(([k, v]) => `<div><dt>${k}</dt><dd>${cacheSpan(v)}</dd></div>`).join('')}</dl>`;
  if (it.l != null) { const tag = it.num ? 'ol' : 'ul'; return `<div class="fi fi-list"><div class="fi-lab">${it.l}</div><${tag}>${it.items.map(x => `<li>${cacheSpan(x)}</li>`).join('')}</${tag}></div>`; }
  if (it.tab) return `<div class="fi fi-tab"><table>${it.tab.head ? `<thead><tr>${it.tab.head.map(h => h ? `<th>${h}</th>` : '<td></td>').join('')}</tr></thead>` : ''}<tbody>${it.tab.rows.map(r => `<tr>${r.map((c, i) => `<td>${i ? cacheSpan(c) : `<b>${c}</b>`}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if (it.m != null) return `<div class="fi fi-memo">${icon('sparkle')}<span>${it.m}</span></div>`;
  if (it.p != null) return `<div class="fi fi-piege">${icon('alert')}<span>${it.p}</span></div>`;
  if (it.x != null) return `<p class="fi fi-x">${it.x}</p>`;
  return '';
}
function ficheCard(c, f, i){
  const k = isKnown(c, f);
  return `<article class="bristol${k ? ' known' : ''}" id="fc-${c.id}-${f.id}" data-key="${fkKey(c, f)}">
    <header class="br-head"><span class="br-num">${i + 1}</span><h3>${f.t}</h3>${speakBtn('fiche|' + c.id + '|' + f.id, 'Écouter la carte')}</header>
    <div class="br-body">${f.items.map(ficheItem).join('')}</div>
    <footer class="br-foot"><button class="br-know" aria-pressed="${k}">${icon('check')}<span>${k ? 'Je la connais' : 'Je la connais ?'}</span></button></footer>
    ${k ? `<div class="br-seal" aria-hidden="true">${sealSVG({ring:false})}</div>` : ''}
  </article>`;
}
function ficheBar(cs, sticky){
  const jump = cls => cs.length > 1 ? `<nav class="fz-jump ${cls}" aria-label="Aller au chapitre">${cs.map(c => `<button data-jump="${c.id}">${esc(c.kicker)}</button>`).join('')}</nav>` : '';
  return `${sticky ? jump('fz-jump-row') : ''}<div class="fz-bar${sticky ? ' sticky' : ''}">
    <button class="fz-mode" aria-pressed="${!!S.ficheHide}"><span class="fz-ic">${icon(S.ficheHide ? 'eyeoff' : 'eye')}</span><span>Mode cache</span><i class="fz-sw" aria-hidden="true"></i></button>
    <button class="btn btn-sm btn-ghost fz-all" ${S.ficheHide ? '' : 'hidden'}>Tout révéler</button>
    <button class="btn btn-sm btn-ghost fz-print" data-print>${icon('doc')}Imprimer</button>
    ${jump('fz-jump-bar')}
  </div>`;
}
function bindFiches(box){
  const zone = $('.fiches', box);
  const setTab = on => $$('.cache', zone).forEach(x => { if (on) { x.setAttribute('tabindex', '0'); x.setAttribute('role', 'button'); } else { x.removeAttribute('tabindex'); x.removeAttribute('role'); } });
  setTab(!!S.ficheHide);
  const allBtn = $('.fz-all', box);
  const syncAll = () => { if (!allBtn) return; const hidden = $$('.cache:not(.shown)', zone).length; allBtn.textContent = hidden ? 'Tout révéler' : 'Tout recacher'; };
  box.addEventListener('click', e => {
    const m = e.target.closest('.fz-mode');
    if (m){
      S.ficheHide = !S.ficheHide; save();
      zone.classList.toggle('hide-on', S.ficheHide);
      m.setAttribute('aria-pressed', S.ficheHide); $('.fz-ic', m).innerHTML = icon(S.ficheHide ? 'eyeoff' : 'eye');
      $$('.cache.shown', zone).forEach(x => x.classList.remove('shown'));
      if (allBtn) allBtn.hidden = !S.ficheHide;
      setTab(S.ficheHide); syncAll();
      toast(S.ficheHide ? 'Mode cache activé : touche un surlignage pour vérifier' : 'Mode lecture');
      return;
    }
    if (e.target.closest('.fz-all')){
      const hidden = $$('.cache:not(.shown)', zone);
      if (hidden.length) hidden.forEach((x, i) => setTimeout(() => x.classList.add('shown'), Math.min(i * 12, 600)));
      else $$('.cache.shown', zone).forEach(x => x.classList.remove('shown'));
      setTimeout(syncAll, 650);
      return;
    }
    const j = e.target.closest('[data-jump]');
    if (j){ const t = $('#fz-' + j.dataset.jump, box); if (t) t.scrollIntoView({behavior: reduced() ? 'auto' : 'smooth', block:'start'}); return; }
    const cch = e.target.closest('.cache');
    if (cch && zone.classList.contains('hide-on')){ cch.classList.toggle('shown'); syncAll(); return; }
    const kb = e.target.closest('.br-know');
    if (kb){
      const card = kb.closest('.bristol'); const key = card.dataset.key;
      const was = S.fk[key]; const now = was !== true;
      S.fk[key] = now; save();
      card.classList.toggle('known', now); kb.setAttribute('aria-pressed', now);
      $('span', kb).textContent = now ? 'Je la connais' : 'Je la connais ?';
      const seal = $('.br-seal', card);
      if (now && !seal){ card.insertAdjacentHTML('beforeend', `<div class="br-seal stamp" aria-hidden="true">${sealSVG({ring:false})}</div>`); }
      if (!now && seal) seal.remove();
      if (now && was === undefined){ addXP(8, e); quest('stamp'); }
      updateFicheCounts(box);
      if (now){
        const sec = card.closest('.fz-chap') || zone;
        const all = $$('.bristol', sec), done = $$('.bristol.known', sec);
        if (all.length && all.length === done.length){ confetti(120); toast('Fiche complète. Tout est tamponné !'); }
      }
    }
  });
  zone.addEventListener('keydown', e => { const c = e.target.closest('.cache'); if (c && zone.classList.contains('hide-on') && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); c.classList.toggle('shown'); syncAll(); } });
}
function updateFicheCounts(box){
  $$('[data-fk-sub]', box).forEach(el => { const fc = ficheCount(el.dataset.fkSub); el.textContent = `${fc.k}/${fc.n} tamponnées`; });
  $$('[data-fk-chap]', box).forEach(el => { const c = chap(el.dataset.fkChap); const k = c.fiche.filter(f => isKnown(c, f)).length; el.textContent = `${k}/${c.fiche.length}`; });
}
function ficheMinutes(cs){ let w = 0; cs.forEach(c => (c.fiche || []).forEach(f => { w += strip(JSON.stringify(f.items)).split(/\s+/).length; })); return Math.max(2, Math.round(w / 170)); }
function viewFiches(sid, cid){
  if (!sid || !subj(sid) || !ficheCount(sid).n){
    const subs = sortedSubjects().filter(s => ficheCount(s.id).n);
    return {html:`<div class="eyebrow">À apprendre par cœur</div><h1 style="font-size:var(--fs-3xl);margin:6px 0 10px">Fiches</h1>
    <p class="lead">Une fiche par matière, découpée en cartes bristol. Lis-la, puis active le <b>mode cache</b> : les réponses sont surlignées en violet, touche-les pour vérifier. Quand une carte est sue, tamponne-la.</p>
    <div class="fcovers stagger">${subs.map(s => { const fc = ficheCount(s.id); const cs = chaptersOf(s.id).filter(c => (c.fiche || []).length); const pct = fc.n ? Math.round(fc.k / fc.n * 100) : 0;
      return `<button class="fcover" data-go="fiches-${s.id}"><span class="fc-code">${esc(s.code)}</span><span class="fc-title">${esc(s.short)}</span><span class="fc-meta">${fc.n} cartes · ${cs.length} ${cs.length > 1 ? 'chapitres' : 'chapitre'} · ≈ ${ficheMinutes(cs)} min</span><span class="meter"><i style="width:${pct}%"></i></span><span class="fc-foot"><span>${fc.k}/${fc.n} tamponnées</span><span class="fc-arrow">${icon('arrow')}</span></span></button>`; }).join('')}</div>
    <div class="section-title"><h2>La méthode</h2></div>
    <div class="col">${block({t:'steps', items:[
      {l:'Lire la carte', h:' : en mode lecture, tout est visible. Lis à voix haute, une carte à la fois.'},
      {l:'Se cacher les réponses', h:' : active le mode cache, récite, puis touche chaque surlignage pour vérifier.'},
      {l:'Tamponner', h:' : quand tu as tout bon, appuie sur « Je la connais ? ». Le sceau tombe, et tu gagnes de l’XP.'},
      {l:'Revenir demain', h:' : relis d’abord les cartes sans sceau. Puis enchaîne avec les flashcards et le quiz.'}]})}</div>`};
  }
  const s = subj(sid); const cs = chaptersOf(sid).filter(c => (c.fiche || []).length);
  const fc = ficheCount(sid);
  return {html:`<div class="crumbs"><button data-go="fiches">Fiches</button><span>/</span><span>${esc(s.short)}</span></div>
  <header class="chap-head"><div class="eyebrow"><b>${esc(s.code)}</b> · Fiche de révision</div><h1>La fiche <em>${esc(s.short)}</em></h1>
    <div class="chap-facts"><span class="tag plain">${fc.n} cartes</span><span class="tag plain" data-fk-sub="${s.id}">${fc.k}/${fc.n} tamponnées</span><span class="tag plain">≈ ${ficheMinutes(cs)} min</span></div></header>
  <div class="fz-box">${ficheBar(cs, true)}
  <div class="fiches${S.ficheHide ? ' hide-on' : ''}">${cs.map(c => `<section class="fz-chap" id="fz-${c.id}"><div class="fz-head"><div><span class="eyebrow"><b>${esc(c.kicker)}</b> · <span data-fk-chap="${c.id}">${c.fiche.filter(f => isKnown(c, f)).length}/${c.fiche.length}</span></span><h2>${c.title}</h2></div><button class="btn btn-sm btn-ghost" data-go="ch-${c.id}">${icon('book')}Le cours</button></div><div class="fz-cards">${c.fiche.map((f, i) => ficheCard(c, f, i)).join('')}</div></section>`).join('')}</div></div>
  <div class="next-cta"><button class="btn btn-primary" data-go="train-cards-${s.id}">${icon('cards')}Flashcards de la matière</button><button class="btn" data-go="train-exam-${s.id}">${icon('trophy')}Examen blanc</button></div>`,
  mount(v){ const box = $('.fz-box', v); bindFiches(box); if (cid){ const t = $('#fz-' + cid, v); if (t) setTimeout(() => t.scrollIntoView({block:'start'}), 60); } }};
}
function renderRevision(panel, c){
  const s = subj(c.subject);
  const box = document.createElement('div'); box.className = 'fz-box';
  box.innerHTML = `<h2 class="sr-only">La fiche du chapitre</h2><p class="lead" style="margin-bottom:14px">La fiche à apprendre de ce chapitre. Active le mode cache pour t’interroger, puis tamponne chaque carte que tu connais.</p>
    ${ficheBar([c], false)}
    <div class="fiches${S.ficheHide ? ' hide-on' : ''}"><div class="fz-cards">${c.fiche.map((f, i) => ficheCard(c, f, i)).join('')}</div></div>
    <div class="next-cta"><button class="btn btn-primary" data-tab-go="cartes">${icon('cards')}Passer aux flashcards</button><button class="btn" data-go="fiches-${s.id}">${icon('fiche')}Toute la fiche ${esc(s.short)}</button></div>`;
  panel.appendChild(box); bindFiches(box);
}


/* =================== FLASHCARDS =================== */
const pick = a => a[Math.floor(Math.random() * a.length)];
function runCards(el, deck, opt = {}){
  if (!deck.length){ el.innerHTML = '<div class="empty">Pas encore de flashcards ici.</div>'; return; }
  const key = x => x.c.id + ':' + x.i;
  const box = x => S.cards[key(x)] || 0;
  let queue = [], idx = 0, known = 0, review = 0;
  const counts = () => { let a = 0, b = 0, c = 0; deck.forEach(x => { const v = box(x); if (v >= 3) c++; else if (v === 2) b++; else a++; }); return [a, b, c]; };
  function start(onlyWeak){
    let d = onlyWeak ? deck.filter(x => box(x) < 2) : deck.slice();
    if (!d.length) d = deck.slice();
    queue = shuffle(d).sort((a, b) => box(a) - box(b)); idx = 0; known = 0; review = 0; draw();
  }
  function draw(){
    if (idx >= queue.length) return finish();
    const x = queue[idx]; const [b1, b2, b3] = counts();
    el.innerHTML = `<div class="deck-wrap">
      <div class="deck-top"><span>Carte <b>${idx + 1}</b>/${queue.length}</span><span class="boxes" aria-label="Avancement"><span><i></i>${b1}</span><span><i class="b2"></i>${b2}</span><span><i class="b3"></i>${b3} maîtrisées</span></span></div>
      <div class="deck">
        <div class="deck-ghost g2"></div><div class="deck-ghost"></div>
        <span class="swipe-tag ko">À revoir</span><span class="swipe-tag ok">Je savais</span>
        <div class="fcard enter" tabindex="0" role="button" aria-label="Retourner la carte">
          <div class="fface front"><div class="fk">${esc(x.c.kicker)}</div><div class="fq">${x.f.q}</div><div class="fhint">Touche pour voir la réponse</div></div>
          <div class="fface back"><div class="fk">Réponse</div><div class="fa">${x.f.a}</div><div class="fhint">Glisse à droite si tu savais, à gauche sinon</div></div>
        </div>
      </div>
      <div class="deck-actions"><button class="btn ko" data-k="0">${icon('x')}À revoir</button><button class="btn ok" data-k="1">${icon('check')}Je savais</button></div>
    </div>`;
    const card = $('.fcard', el), tOk = $('.swipe-tag.ok', el), tKo = $('.swipe-tag.ko', el);
    let down = false, sx = 0, sy = 0, dx = 0, moved = false, locked = false;
    const flipped = () => card.classList.contains('flipped');
    card.addEventListener('click', () => { if (moved){ moved = false; return; } card.classList.toggle('flipped'); });
    card.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); card.classList.toggle('flipped'); } if (e.key === 'ArrowRight') decide(1); if (e.key === 'ArrowLeft') decide(0); });
    card.addEventListener('pointerdown', e => { down = true; sx = e.clientX; sy = e.clientY; dx = 0; moved = false; });
    card.addEventListener('pointermove', e => {
      if (!down) return; dx = e.clientX - sx; const dy = e.clientY - sy;
      if (!moved && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)){ moved = true; card.classList.add('dragging'); try { card.setPointerCapture(e.pointerId); } catch(err){} }
      if (moved){ card.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)${flipped() ? ' rotateY(180deg)' : ''}`; tOk.style.opacity = clamp(dx / 90, 0, 1); tKo.style.opacity = clamp(-dx / 90, 0, 1); }
    });
    const up = () => { if (!down) return; down = false; card.classList.remove('dragging');
      if (moved && Math.abs(dx) > 90){ decide(dx > 0 ? 1 : 0); }
      else { card.style.transform = ''; tOk.style.opacity = 0; tKo.style.opacity = 0; } };
    card.addEventListener('pointerup', up); card.addEventListener('pointercancel', up);
    $$('.deck-actions [data-k]', el).forEach(b => b.addEventListener('click', e => decide(+b.dataset.k, e)));
    function decide(k, ev){
      if (locked) return; locked = true;
      const v = box(x); S.cards[key(x)] = k ? Math.min(3, Math.max(2, v + 1)) : 1; save();
      if (k){ known++; addXP(4, ev || {target:card}); quest('card'); } else { review++; addXP(1, ev || {target:card}); }
      card.style.transform = ''; card.classList.add(k ? 'fly-right' : 'fly-left');
      setTimeout(() => { idx++; draw(); }, reduced() ? 0 : 380);
    }
    card.focus({preventScroll:true});
  }
  function finish(){
    const weak = deck.filter(x => box(x) < 2).length;
    if (review === 0) confetti(90);
    el.innerHTML = `<div class="result">
      <div class="eyebrow">${esc(opt.title || 'Flashcards')}</div>
      <h3>${review === 0 ? 'Sans faute !' : 'Paquet terminé'}</h3>
      <p class="muted">${known} su${known > 1 ? 'es' : 'e'} · ${review} à revoir · ${deck.length - weak}/${deck.length} cartes maîtrisées au total</p>
      <div class="btn-row" style="justify-content:center">${weak ? `<button class="btn btn-primary" id="cw">${icon('refresh')}Revoir les ${weak} cartes fragiles</button>` : ''}<button class="btn" id="ca">${icon('cards')}Tout repasser</button></div>
    </div>`;
    const w = $('#cw', el); if (w) w.onclick = () => start(true);
    $('#ca', el).onclick = () => start(false);
  }
  start(false);
}

/* =================== QUIZ =================== */
function quizHome(el, c){
  const best = S.quiz[c.id];
  el.innerHTML = `<div class="quiz"><div class="panel" style="display:grid;gap:12px">
    <div class="eyebrow">Quiz · ${esc(c.kicker)}</div><h3>${c.quiz.length} questions sur « ${strip(c.title)} »</h3>
    <p class="muted">QCM et vrai/faux, corrigés et expliqués. +10 XP par bonne réponse.${best ? ` Ton meilleur score : <b>${Math.round(best.best * 100)} %</b>.` : ''}</p>
    <div class="btn-row"><button class="btn btn-primary" id="qa">${icon('play')}Quiz complet</button>${c.quiz.length > 10 ? `<button class="btn" id="qq">${icon('bolt')}Version rapide (10)</button>` : ''}</div></div></div>`;
  const run = n => { const qs = shuffle(c.quiz.map((q, i) => Object.assign({cid:c.id, qi:i}, q))).slice(0, n); runQuiz(el, qs, {kind:'chapter', title:c.title, onDone(sc, tot){ const p = sc / tot; const prev = S.quiz[c.id] || {best:0, runs:0}; S.quiz[c.id] = {best:Math.max(prev.best, p), runs:prev.runs + 1}; save(); }, again: () => quizHome(el, c)}); };
  $('#qa', el).onclick = () => run(c.quiz.length);
  const q = $('#qq', el); if (q) q.onclick = () => run(10);
}
function runQuiz(el, qs, opt = {}){
  if (!qs.length){ el.innerHTML = '<div class="empty">Pas encore de questions ici.</div>'; return; }
  let i = 0, score = 0, armed = false; const wrong = []; const t0 = Date.now(); let tick;
  const jokers = opt.kind !== 'exam';
  const items = qs.map(q => { if (q.tf) return Object.assign({}, q); const ord = shuffle(q.o.map((_, k) => k)); return Object.assign({}, q, {opts:ord.map(k => q.o[k]), ans:ord.indexOf(q.a)}); });
  const fmtT = ms => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + pad2(s % 60); };
  if (opt.timer){ tick = setInterval(() => { if (!el.isConnected) return clearInterval(tick); const t = $('#qt', el); if (t) t.textContent = fmtT(Date.now() - t0); }, 1000); }
  function draw(){
    if (i >= items.length) return end();
    const q = items[i]; const ch = chap(q.cid);
    el.innerHTML = `<div class="quiz">
      <div class="qbar"><span class="qn">${i + 1}/${items.length}</span><span class="meter"><i style="width:${i / items.length * 100}%"></i></span>${opt.timer ? `<span class="qn" id="qt">${fmtT(Date.now() - t0)}</span>` : ''}<span class="qn">${score} ✓</span></div>
      <div class="qcard"><div class="qk"><span class="eyebrow">${q.tf ? 'Vrai ou faux ?' : 'Une seule bonne réponse'}${ch && opt.kind !== 'chapter' ? ' · ' + esc(ch.kicker) : ''}</span></div>
      ${jokers ? jokerBar(q, armed) : ''}
      <div class="qt">${q.q}</div>
      ${q.tf ? `<div class="tf"><button class="opt" data-v="1">Vrai</button><button class="opt" data-v="0">Faux</button></div>` : `<div class="opts">${q.opts.map((o, k) => `<button class="opt" data-v="${k}"><span class="ol">${'ABCDE'[k]}</span><span>${o}</span></button>`).join('')}</div>`}
      <div id="qx"></div></div></div>`;
    $$('.opt', el).forEach(b => b.addEventListener('click', e => answer(b, e)));
    bindJk(q);
  }
  function bindJk(q){
    const jb = $('.jk-bar', el); if (!jb) return;
    jb.addEventListener('click', e => {
      const b = e.target.closest('[data-jk]'); if (!b || b.disabled) return;
      if (b.dataset.jk === 'ff'){ if (useFifty(el, q)){ b.disabled = true; $('b', b).textContent = S.inv.ff || 0; } return; }
      armed = !armed && S.inv.sc > 0;
      jb.outerHTML = jokerBar(q, armed);
      if (armed){ sfx('coin'); toast('Seconde chance armée !'); }
      bindJk(q);
    });
  }
  function answer(b, e){
    const q = items[i]; const v = +b.dataset.v;
    const isAns = xv => q.tf ? (xv === 1) === q.a : xv === q.ans;
    const right = isAns(v);
    if (!right && armed && !q._sc && S.inv.sc > 0){
      armed = false; q._sc = true; S.inv.sc--; save(); sfx('coin');
      b.classList.add('is-wrong'); b.disabled = true;
      const jb = $('.jk-bar', el); if (jb){ jb.outerHTML = jokerBar(q, false); const nb = $('.jk-bar', el); if (nb) $$('[data-jk]', nb).forEach(x => { x.disabled = true; }); }
      $('#qx', el).innerHTML = `<div class="expl sc-note"><div class="verdict">${icon('heart')}Seconde chance !</div><p>Ce n’est pas ça… mais ton joker te sauve : choisis une autre réponse.</p></div>`;
      return;
    }
    $$('.opt', el).forEach(x => { x.disabled = true; if (isAns(+x.dataset.v)) x.classList.add('is-right'); else if (x !== b) x.classList.add('dim'); });
    $$('.jk-bar [data-jk]', el).forEach(x => { x.disabled = true; });
    if (!right) b.classList.add('is-wrong');
    if (right){ score++; addXP(q._sc ? 5 : 10, e); quest('quiz'); } else wrong.push(q);
    const good = q.tf ? (q.a ? 'Vrai' : 'Faux') : q.opts[q.ans];
    $('#qx', el).innerHTML = `<div class="expl"><div class="verdict ${right ? 'good' : 'bad'}">${right ? pick(['Exact !', 'Bien vu.', 'Parfait.', 'Oui, c’est ça !']) : 'Pas tout à fait…'}</div>${right ? '' : `<p><b>Bonne réponse :</b> ${good}</p>`}${q.e ? `<p>${q.e}</p>` : ''}</div>
      <div class="qnext"><button class="btn btn-primary" id="qn">${i + 1 < items.length ? 'Question suivante' : 'Voir mon résultat'}${icon('arrow')}</button></div>`;
    const n = $('#qn', el); n.onclick = () => { i++; draw(); }; n.focus({preventScroll:true});
    const x = $('#qx', el); const r = x.getBoundingClientRect(); if (r.bottom > innerHeight - 80) window.scrollBy({top:r.bottom - innerHeight + 110, behavior: reduced() ? 'auto' : 'smooth'});
  }
  function end(){
    clearInterval(tick);
    const tot = items.length, p = score / tot, pct = Math.round(p * 100);
    const note = Math.round(p * 40) / 2;
    const msg = p >= .9 ? 'Digne de LaMeilleureNotaire. Rien à redire.' : p >= .7 ? 'Très solide. Encore un petit effort.' : p >= .5 ? 'En bonne voie. Relis les points ratés.' : 'On reprend la fiche et on y retourne. Tu vas l’avoir.';
    const C = 2 * Math.PI * 70;
    el.innerHTML = `<div class="result">
      <div class="eyebrow">${esc(opt.title || 'Quiz')}</div>
      <div class="ring"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="70" fill="none" stroke="var(--surface-3)" stroke-width="12"/><circle id="rg" cx="80" cy="80" r="70" fill="none" stroke="var(--accent)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" style="transition:stroke-dashoffset 1.2s var(--ease)"/></svg>
        <div class="rv"><b id="rn">0</b><span>${opt.kind === 'exam' ? 'sur 20' : '%'}</span></div></div>
      <h3>${msg}</h3>
      <p class="muted">${score} bonne${score > 1 ? 's' : ''} réponse${score > 1 ? 's' : ''} sur ${tot}${opt.timer ? ' · en ' + fmtT(Date.now() - t0) : ''}</p>
      ${wrong.length ? `<div class="mistakes"><div class="eyebrow">À revoir</div>${wrong.map(q => `<div class="mistake"><b>${q.q}</b>${q.tf ? (q.a ? 'Vrai' : 'Faux') : q.opts[q.ans]}${q.e ? ` — <span class="muted">${q.e}</span>` : ''}</div>`).join('')}</div>` : ''}
      <div class="btn-row" style="justify-content:center"><button class="btn btn-primary" id="qr">${icon('refresh')}Recommencer</button>${wrong.length ? `<button class="btn" id="qw">Rejouer mes erreurs</button>` : ''}</div>
    </div>`;
    const target = opt.kind === 'exam' ? note : pct;
    requestAnimationFrame(() => { const rg = $('#rg', el); if (rg) rg.style.strokeDashoffset = (C * (1 - p)).toFixed(1); });
    const rn = $('#rn', el); const t1 = performance.now();
    (function cnt(t){ const k = clamp((t - t1) / 1100, 0, 1); const e = 1 - Math.pow(1 - k, 3); const val = target * e; rn.textContent = opt.kind === 'exam' ? (Math.round(val * 2) / 2).toLocaleString('fr-FR') : Math.round(val); if (k < 1 && !reduced()) requestAnimationFrame(cnt); else rn.textContent = opt.kind === 'exam' ? note.toLocaleString('fr-FR') : pct; })(t1);
    if (p >= .8) confetti(130);
    if (opt.onDone) opt.onDone(score, tot, {target:rn});
    $('#qr', el).onclick = () => opt.again ? opt.again() : runQuiz(el, shuffle(qs), opt);
    const w = $('#qw', el); if (w) w.onclick = () => runQuiz(el, wrong.map(q => Object.assign({}, q)), Object.assign({}, opt, {onDone:null, again:null, title:'Mes erreurs'}));
    window.scrollTo({top:Math.max(0, el.getBoundingClientRect().top + scrollY - 120), behavior: reduced() ? 'auto' : 'smooth'});
  }
  draw();
}

/* =================== JEUX DE TRI =================== */
function gamesHome(el, c, open){
  const games = c.sorts || [];
  const extra = c.extraGames || [];
  if (open){ const g = games.find(x => x.id === open); if (g) return runSort(el, g, c); }
  const openX = open && extra.find(x => x.w === open);
  el.innerHTML = `<p class="lead" style="margin-bottom:18px">Une carte apparaît, tu choisis la bonne catégorie. Chaque erreur est expliquée.</p>
  <div class="game-list stagger">${games.map(g => `<button class="quick" data-g="${g.id}"><span class="ico">${icon('grid')}</span><span><b>${g.title}</b><span>${g.items.length} cartes · ${g.cats.length} catégories${S.sorts[g.id] != null ? ` · record ${Math.round(S.sorts[g.id] * 100)} %` : ''}</span></span></button>`).join('')}
  ${extra.map(x => `<button class="quick" data-x="${x.w}"><span class="ico">${icon(x.icon || 'sparkle')}</span><span><b>${x.title}</b><span>${x.sub}</span></span></button>`).join('')}</div><div id="xg"></div>`;
  el.onclick = e => {
    const b = e.target.closest('[data-g]'); if (b){ runSort(el, games.find(x => x.id === b.dataset.g), c); return; }
    const x = e.target.closest('[data-x]'); if (x) openExtra(x.dataset.x);
  };
  function openExtra(w){ const slot = $('#xg', el); slot.innerHTML = `<div class="section-title"><h2>${extra.find(k => k.w === w).title}</h2></div><div data-w="${w}" data-o='{"mode":"defi"}'></div>`; mountWidgets(slot); setTimeout(() => slot.scrollIntoView({behavior: reduced() ? 'auto' : 'smooth'}), 60); }
  if (openX) openExtra(openX.w);
}
function runSort(el, g, c){
  el.onclick = null;
  const items = shuffle(g.items); let i = 0, score = 0, chain = 0; const misses = [];
  const ncls = g.cats.length === 3 ? 'n3' : g.cats.length === 5 ? 'n5' : '';
  function draw(){
    if (i >= items.length) return end();
    const it = items[i];
    el.innerHTML = `<div class="sort">
      <div class="crumbs"><button data-back>Jeux</button><span>/</span><span>${g.title}</span></div>
      <h2 style="font-size:var(--fs-xl)">${g.title}</h2>${g.intro ? `<p class="muted" style="margin-top:6px">${g.intro}</p>` : ''}
      <div class="sort-hud" style="margin-top:16px"><span>${i + 1}/${items.length} · ${score} bonne${score > 1 ? 's' : ''}</span><span class="streak" id="stk">${icon('flame', 'sr-only')}Série ×${chain}</span></div>
      <span class="meter"><i style="width:${i / items.length * 100}%"></i></span>
      <div class="sort-stage"><div class="sort-item" id="si">${it.e ? `<div class="em" aria-hidden="true">${it.e}</div>` : ''}<div class="it">${it.t}</div></div></div>
      <div class="cats ${ncls}">${g.cats.map(k => `<button class="cat" data-c="${k.id}">${k.l}</button>`).join('')}</div>
      <div id="sx"></div></div>`;
    $('[data-back]', el).onclick = () => gamesHome(el, c);
    $$('.cat', el).forEach(b => b.addEventListener('click', e => {
      const ok = b.dataset.c === it.c;
      $$('.cat', el).forEach(x => { x.disabled = true; if (x.dataset.c === it.c) x.classList.add(ok ? 'hit' : 'answer'); });
      if (!ok){ b.classList.add('miss'); chain = 0; misses.push(it); } else { score++; chain++; addXP(6, e); }
      const stk = $('#stk', el); stk.innerHTML = `Série ×${chain}`; if (ok) stk.classList.add('bump');
      const catL = g.cats.find(k => k.id === it.c).l;
      $('#sx', el).innerHTML = `<div class="expl"><div class="verdict ${ok ? 'good' : 'bad'}">${ok ? pick(['Bien classé !', 'Exact.', 'Oui !']) : 'Non : ' + catL}</div>${it.w ? `<p>${it.w}</p>` : ''}</div><div class="qnext"><button class="btn btn-primary" id="sn">${i + 1 < items.length ? 'Carte suivante' : 'Résultat'}${icon('arrow')}</button></div>`;
      const n = $('#sn', el); n.focus({preventScroll:true});
      n.onclick = () => { const si = $('#si', el); si.classList.add(ok ? 'out-good' : 'out-bad'); setTimeout(() => { i++; draw(); }, reduced() ? 0 : 260); };
      const r = $('#sx', el).getBoundingClientRect(); if (r.bottom > innerHeight - 80) window.scrollBy({top:r.bottom - innerHeight + 110, behavior: reduced() ? 'auto' : 'smooth'});
    }));
  }
  function end(){
    const p = score / items.length; const prev = S.sorts[g.id];
    S.sorts[g.id] = Math.max(prev || 0, p); save(); addXP(20, {target:el}); quest('sort');
    if (p >= .8) confetti(110);
    el.innerHTML = `<div class="result"><div class="eyebrow">${g.title}</div><h3>${Math.round(p * 100)} % de bonnes réponses</h3><p class="muted">${score}/${items.length}${prev != null ? ` · record : ${Math.round(Math.max(prev, p) * 100)} %` : ''}</p>
      ${misses.length ? `<div class="mistakes"><div class="eyebrow">Les pièges du jour</div>${misses.map(m => `<div class="mistake"><b>${m.t} → ${g.cats.find(k => k.id === m.c).l}</b>${m.w || ''}</div>`).join('')}</div>` : ''}
      <div class="btn-row" style="justify-content:center"><button class="btn btn-primary" id="sr">${icon('refresh')}Rejouer</button><button class="btn" id="so">Autres jeux</button></div></div>`;
    $('#sr', el).onclick = () => runSort(el, g, c); $('#so', el).onclick = () => gamesHome(el, c);
  }
  draw();
}

/* =================== CAS PRATIQUES =================== */
function casesHome(el, c, open){
  if (open){ const k = (c.cases || []).find(x => x.id === open); if (k) return runCase(el, k, c); }
  el.innerHTML = `<p class="lead">Lis l’énoncé, cherche seul·e, puis révèle la correction étape par étape.</p>
  <div class="btn-row" style="margin:14px 0 18px"><button class="btn btn-sm" data-go="outils-methode">${icon('scale')}Revoir la méthode</button></div>
  <div class="case-list stagger">${(c.cases || []).map(k => `<button class="case-card" data-k="${k.id}"><span class="eyebrow">${esc(k.tag || 'Cas pratique')}</span><b>${k.title}</b><span class="muted" style="font-size:.9rem">${strip(k.q)}</span>${S.cases[k.id] ? '<span class="done">✓ Fait</span>' : ''}</button>`).join('')}</div>`;
  el.onclick = e => { const b = e.target.closest('[data-k]'); if (b) runCase(el, c.cases.find(x => x.id === b.dataset.k), c); };
}
function runCase(el, k, c){
  el.onclick = null;
  let shown = 0;
  el.innerHTML = `<div class="col">
    <div class="crumbs"><button data-back>Cas pratiques</button><span>/</span><span>${k.title}</span></div>
    <article class="enonce"><div class="ek">Énoncé · ${esc(k.tag || '')}</div><div class="et">${k.title}</div>${k.facts.map(f => `<p>${f}</p>`).join('')}<div class="eq">${k.q}</div></article>
    <div class="method">
      <div><label class="eyebrow" for="th-${k.id}">Ton brouillon, avant la correction</label><textarea class="think" id="th-${k.id}" placeholder="Les faits utiles, le problème de droit, la règle, ta conclusion…" style="margin-top:8px"></textarea></div>
      ${k.steps.map((s, n) => `<div class="mstep locked" data-n="${n}"><div class="mstep-h"><span class="mi">${n + 1}</span><b>${s.l}</b><button class="btn btn-sm" data-reveal="${n}" ${n ? 'disabled' : ''}>Révéler</button></div><div class="mstep-b" hidden>${s.h}</div></div>`).join('')}
      <div class="btn-row" id="cdone" hidden><button class="btn btn-primary" id="cok">${icon('check')}J’ai compris ce cas</button><button class="btn" data-back>Autres cas</button></div>
    </div></div>`;
  $$('[data-back]', el).forEach(b => b.onclick = () => casesHome(el, c));
  $$('[data-reveal]', el).forEach(b => b.onclick = () => {
    const n = +b.dataset.reveal; const st = b.closest('.mstep');
    $('.mstep-b', st).hidden = false; st.classList.remove('locked'); b.remove(); shown++;
    const nx = $(`[data-reveal="${n + 1}"]`, el); if (nx) nx.disabled = false;
    if (shown === k.steps.length) $('#cdone', el).hidden = false;
  });
  $('#cok', el).onclick = e => { if (!S.cases[k.id]){ S.cases[k.id] = true; save(); addXP(30, e); confetti(80); } else toast('Déjà validé, bravo !'); quest('case'); casesHome(el, c); };
}

/* =================== MÉTHODE (widget) =================== */
JLG.widget('methode', el => {
  el.innerHTML = `<div class="blocks col">
    ${block({t:'p', h:'Un cas pratique, c’est une petite histoire. On te demande de dire <b>ce que dit le droit</b> sur cette histoire. Le raisonnement est toujours le même : c’est le <b>syllogisme juridique</b>.'})}
    ${block({t:'vs', a:{title:'La majeure', items:['La règle de droit : article, définition, jurisprudence', 'Ses conditions et ses exceptions']}, b:{title:'La mineure', items:['Les faits de l’histoire, traduits en mots juridiques', 'On vérifie chaque condition de la règle']}})}
    ${block({t:'steps', items:[
      {l:'Les faits', h:' — Résume l’histoire en termes juridiques : qui sont les personnes (majeur, mineur, personne célèbre, salarié…) ? Que s’est-il passé ? Garde seulement les faits utiles.'},
      {l:'Le problème de droit', h:' — Pose LA question juridique, de façon générale, sans les prénoms. Ex. : « Une personne célèbre peut-elle s’opposer à la révélation de sa vie familiale par la presse ? »'},
      {l:'Les règles applicables (majeure)', h:' — Cite l’article ou la jurisprudence, explique la règle et ses exceptions.'},
      {l:'L’application aux faits (mineure)', h:' — Confronte chaque condition de la règle aux faits. C’est la partie qui rapporte le plus de points.'},
      {l:'La conclusion', h:' — Réponds clairement à la question : « Donc… ». Une réponse nuancée est permise si un fait manque.'}]})}
    ${block({t:'tip', k:'memo', h:'<b>F.P.R.A.C.</b> : Faits, Problème, Règle, Application, Conclusion. « Fais Pas Rire Avec ta Copie » : suis l’ordre et tu ne peux pas te perdre.'})}
    ${block({t:'tip', k:'piege', h:'Ne réponds jamais « oui » ou « non » sans citer la règle. Une conclusion sans article ni justification vaut très peu de points, même si elle est juste.'})}
    ${block({t:'tip', k:'ex', title:'Exemple express', h:'<p><b>Faits :</b> un journal publie la grossesse de la compagne d’un chanteur célèbre, découverte en fouillant ses poubelles.</p><p><b>Problème :</b> la révélation d’une future paternité par la presse porte-t-elle atteinte à la vie privée d’une personne célèbre ?</p><p><b>Règle :</b> art. 9 C. civ. : chacun a droit au respect de sa vie privée, quelle que soit sa notoriété.</p><p><b>Application :</b> la paternité relève de la vie familiale ; aucune actualité d’intérêt général ne justifie la publication.</p><p><b>Conclusion :</b> atteinte à la vie privée, réparation possible.</p>'})}
  </div>`;
});


/* =================== DÉMARRAGE =================== */
function boot(data){
  JLG.chapters.forEach(c => { if (JLG.fiches[c.id]) c.fiche = JLG.fiches[c.id]; });
  $('#brandSeal').innerHTML = sealSVG({ring:false});
  renderNav(); applyTheme(); updateChip();
  $('#themeBtn').addEventListener('click', () => { S.theme = curTheme() === 'dark' ? 'light' : 'dark'; save(); applyTheme(); });
  $('#searchBtn').innerHTML = icon('search');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-search]')){ e.preventDefault(); openSearch(); return; }
    if (e.target.closest('[data-print]')){ e.preventDefault(); window.print(); }
  });
  document.addEventListener('keydown', e => {
    const t = e.target, typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)){ e.preventDefault(); openSearch(); }
    else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey){ e.preventDefault(); openSearch(); }
  });
  swInit(); a11yObserve();
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (!g) return;
    e.preventDefault(); go(g.dataset.go, {open:g.dataset.open});
  });
  window.addEventListener('popstate', () => { const h = (location.hash || '').slice(1); go(/^[A-Za-z0-9._~-]+$/.test(h) ? h : 'home', {silent:true}); });
  try { matchMedia('(prefers-color-scheme: light)').addEventListener('change', applyTheme); } catch(e){}
  const hot = window.claude && window.claude.hot;
  if (hot && hot.snapshot) try { hot.snapshot(() => ({route:ROUTE})); } catch(e){}
  let start = (data && data.route) || (location.hash || '').slice(1) || 'home';
  if (!/^[A-Za-z0-9._~-]+$/.test(start)) start = 'home';
  gameInit();
  go(start, {silent:true});
}
JLG.boot = function(){
  const hot = window.claude && window.claude.hot;
  if (hot && hot.ready) hot.ready(boot); else boot((hot && hot.data) || {});
};
JLG.go = go;
})();

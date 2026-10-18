#!/usr/bin/env node
/* Vérifie les données de tous les cours avant un build : quiz, jeux de tri, cas, fiches, schémas, identifiants, lexique.
 *   node tools/check_data.js        (code de sortie 1 s'il y a un problème)
 */
const {JLG, widgets} = require('./_load')();
const bad = [], ids = new Set(), subs = new Set(JLG.subjects.map(s => s.id));
const add = m => bad.push(m);
JLG.chapters.forEach(c => {
  const P = c.id + ' : ';
  if (/-/.test(c.id)) add(P + 'id avec tiret'); if (ids.has(c.id)) add(P + 'id en double'); ids.add(c.id);
  if (!subs.has(c.subject)) add(P + 'matière inconnue ' + c.subject);
  if (!JLG.fiches[c.id] || !JLG.fiches[c.id].length) add(P + 'fiche manquante');
  (c.quiz || []).forEach((q, i) => { if (q.tf){ if (typeof q.a !== 'boolean') add(P + 'quiz ' + (i + 1) + ' : vrai/faux sans booléen'); } else if (!Array.isArray(q.o) || !Number.isInteger(q.a) || q.a < 0 || q.a >= q.o.length) add(P + 'quiz ' + (i + 1) + ' : réponse hors liste'); });
  (c.sorts || []).forEach(s => { const cs = s.cats.map(x => x.id); if (ids.has(s.id)) add(P + 'jeu en double ' + s.id); ids.add(s.id); s.items.forEach((it, i) => { if (!cs.includes(it.c)) add(P + s.id + ' carte ' + (i + 1) + ' : catégorie inconnue'); }); cs.forEach(k => { if (!s.items.some(it => it.c === k)) add(P + s.id + ' : catégorie vide ' + k); }); });
  (c.cases || []).forEach(k => { if (ids.has(k.id)) add(P + 'cas en double ' + k.id); ids.add(k.id); if (!k.steps || k.steps.length < 3 || k.steps.length > 7) add(P + k.id + ' : un cas a entre 3 et 7 étapes'); });
  c.sections.forEach(s => s.blocks.forEach(b => { if (b.t === 'widget' && !widgets.has(b.w)) add(P + 'schéma inconnu ' + b.w); if (/<\/script>/i.test(JSON.stringify(b))) add(P + '</script> dans une chaîne'); }));
  (c.extraGames || []).forEach(g => { if (!widgets.has(g.w)) add(P + 'défi inconnu ' + g.w); });
  if (/[a-zàâéèêîôûç]'[a-zàâéèêîôûç]/i.test(JSON.stringify(c.essentials || []).replace(/\\'/g, ''))) add(P + 'apostrophe droite dans un essentiel (utilise ’)');
});
JLG.gloss.forEach(g => [].concat(g.s).forEach(s => { if (!subs.has(s)) add('lexique « ' + g.t + ' » : matière inconnue ' + s); }));
const seen = new Set(); JLG.gloss.forEach(g => { const k = g.t.toLowerCase(); if (seen.has(k)) add('lexique : mot en double « ' + g.t + ' »'); seen.add(k); });
if (bad.length){ console.error(bad.length + ' problème(s) :\n- ' + bad.join('\n- ')); process.exit(1); }
console.log('OK : ' + JLG.chapters.length + ' chapitres, ' + JLG.chapters.reduce((n, c) => n + (c.quiz || []).length, 0) + ' questions, ' + JLG.gloss.length + ' mots de lexique, ' + widgets.size + ' schémas.');

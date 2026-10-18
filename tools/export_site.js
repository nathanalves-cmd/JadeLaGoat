#!/usr/bin/env node
/* Exporte le contenu du site « Alves Cances » (les cours de Jade) dans un format lisible par une conversation.
 *
 *   node tools/export_site.js                 -> export/site-jade-export.md   (état du site : matières, chapitres, points clés)
 *   node tools/export_site.js --chapter deo2  -> export/chapitre-deo2.md      (un chapitre en entier : essentiels, pièges, flashcards, quiz corrigé)
 *   node tools/export_site.js --json          -> export/site-jade-export.json (toutes les données brutes)
 *
 * Le script charge les fichiers de contenu de src/ avec une copie minimale de l'API JLG (voir _load.js) : rien n'est modifié.
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'src'), OUT = path.join(ROOT, 'export');
const args = process.argv.slice(2), opt = n => { const i = args.indexOf(n); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : null; };

const load = () => require('./_load')().JLG;
const txt = h => String(h == null ? '' : h).replace(/<br\s*\/?>/g, ' ').replace(/<\/(li|p|tr)>/g, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const subj = (J, id) => J.subjects.find(s => s.id === id) || {title:id, short:id};

function summary(J){
  const L = ['# Site « Alves Cances » (ex-Jade la Goat) : état du contenu', '', `Export du ${new Date().toISOString().slice(0, 10)}. Site : https://nathanalves-cmd.github.io/JadeLaGoat/`, '',
    'Les matières ne se mélangent jamais : chaque chapitre appartient à une seule matière.', ''];
  J.subjects.slice().sort((a, b) => a.order - b.order).forEach(s => {
    L.push(`## ${s.title} (\`${s.id}\`, ${s.code})`, '', s.desc, '');
    J.chapters.filter(c => c.subject === s.id).sort((a, b) => a.order - b.order).forEach(c => {
      L.push(`### \`${c.id}\` · ${c.kicker} : ${txt(c.title)}`, `Ajouté le ${c.added} · ${c.minutes} min · ${c.sections.length} parties · ${(c.flashcards || []).length} flashcards · ${(c.quiz || []).length} questions · ${(c.sorts || []).length} jeux de tri · ${(c.cases || []).length} cas pratiques · fiche de ${(J.fiches[c.id] || []).length} cartes`, '');
      L.push('Parties : ' + c.sections.map(x => `${x.n}. ${txt(x.title)}`).join(' · '), '');
      L.push('Points essentiels :'); (c.essentials || []).forEach(e => L.push('- ' + txt(e))); L.push('');
    });
  });
  L.push('## Lexique', '', `${J.gloss.length} mots. Par matière : ` + J.subjects.map(s => `${s.short} ${J.gloss.filter(g => [].concat(g.s).includes(s.id)).length}`).join(', '), '');
  L.push('## Nouveautés', ''); J.logs.slice().sort((a, b) => b.date.localeCompare(a.date)).forEach(l => { L.push(`- **${l.date}**`); l.items.forEach(i => L.push('  - ' + txt(i))); });
  return L.join('\n') + '\n';
}
function chapter(J, id){
  const c = J.chapters.find(x => x.id === id); if (!c){ console.error('Chapitre inconnu : ' + id + ' (' + J.chapters.map(x => x.id).join(', ') + ')'); process.exit(1); }
  const L = [`# ${txt(c.title)} (\`${c.id}\`, ${subj(J, c.subject).title})`, '', txt(c.intro), '', '## Objectifs', ...(c.objectives || []).map(o => '- ' + txt(o)), '', '## Pièges'];
  (c.traps || []).forEach(t => L.push(`- **${txt(t.t)}** : ${txt(t.h)}`));
  L.push('', '## Points essentiels', ...(c.essentials || []).map(e => '- ' + txt(e)), '', '## Parties');
  c.sections.forEach(s => L.push(`- ${s.n}. ${txt(s.title)}`));
  L.push('', '## Flashcards'); (c.flashcards || []).forEach((f, i) => L.push(`${i + 1}. **${txt(f.q)}** ${txt(f.a)}`));
  L.push('', '## Quiz (la bonne réponse est en gras)');
  (c.quiz || []).forEach((q, i) => L.push(q.tf ? `${i + 1}. ${txt(q.q)} → **${q.a ? 'Vrai' : 'Faux'}**${q.e ? ' (' + txt(q.e) + ')' : ''}` : `${i + 1}. ${txt(q.q)} → ` + q.o.map((o, k) => k === q.a ? `**${txt(o)}**` : txt(o)).join(' / ') + (q.e ? ` (${txt(q.e)})` : '')));
  L.push('', '## Cas pratiques'); (c.cases || []).forEach(k => L.push(`- **${txt(k.title)}** : ${txt(k.facts.join(' '))} → ${txt(k.steps[k.steps.length - 1].h)}`));
  return L.join('\n') + '\n';
}
const J = load(); fs.mkdirSync(OUT, {recursive: true});
if (opt('--json')){ const f = path.join(OUT, 'site-jade-export.json'); fs.writeFileSync(f, JSON.stringify({subjects: J.subjects, chapters: J.chapters, fiches: J.fiches, glossary: J.gloss, logs: J.logs}, null, 1)); console.log('OK ' + f); }
else if (opt('--chapter')){ const id = opt('--chapter'), f = path.join(OUT, 'chapitre-' + id + '.md'); fs.writeFileSync(f, chapter(J, id)); console.log('OK ' + f); }
else { const f = path.join(OUT, 'site-jade-export.md'); fs.writeFileSync(f, summary(J)); console.log('OK ' + f); }

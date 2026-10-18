/* Charge le contenu du site (matières, chapitres, fiches, lexique, nouveautés) sans navigateur.
 * Les fichiers de chaque chapitre sont lus dans l'ordre de la liste CHAPTERS de build.py, puis concaténés. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'src');
module.exports = function loadSite(){
  const JLG = {subjects:[], chapters:[], gloss:[], logs:[], fiches:{}};
  JLG.subject = s => JLG.subjects.push(s); JLG.chapter = c => JLG.chapters.push(c); JLG.fiche = (i, c) => { JLG.fiches[i] = c; };
  JLG.glossary = l => JLG.gloss.push(...l); JLG.log = l => JLG.logs.push(l);
  const run = (name, code) => { try { vm.runInNewContext(code, {JLG}, {filename: name}); } catch (e) { console.error('SYNTAXE ' + name + ' : ' + e.message); process.exit(1); } };
  const build = fs.readFileSync(path.join(ROOT, 'build.py'), 'utf8');
  const groups = [...build.matchAll(/\("(\w+)", \[([^\]]*)\]\)/g)].map(m => [m[1], [...m[2].matchAll(/"([^"]+)"/g)].map(x => x[1])]);
  const rd = f => fs.readFileSync(path.join(SRC, f), 'utf8');
  run('30-subjects.js', rd('30-subjects.js'));
  groups.forEach(([id, files]) => run('chapitre ' + id, files.map(rd).join('')));
  fs.readdirSync(SRC).filter(f => /^34.*\.js$/.test(f)).sort().forEach(f => run(f, rd(f)));
  const widgets = new Set(); fs.readdirSync(SRC).filter(f => /^2.*\.js$/.test(f)).forEach(f => { for (const m of rd(f).matchAll(/JLG\.widget\('([a-z0-9]+)'/g)) widgets.add(m[1]); });
  return {JLG, widgets, groups};
};

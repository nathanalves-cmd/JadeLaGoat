#!/usr/bin/env python3
"""Crée le squelette d'un nouveau chapitre (4 fichiers dans src/) et l'inscrit dans build.py.

Usage : python3 tools/new_chapter.py <id> <matière> <ordre> "<Titre>" [--kicker "Activité 3 · Chapitre 2"] [--short "Titre court"] [--num "3·2"]
Exemple : python3 tools/new_chapter.py deo3 deo 3 "Le secret professionnel" --kicker "Activité 3 · Chapitre 2"

Ensuite : remplir les 4 fichiers, puis  node tools/check_data.js  et  python3 build.py.
"""
import argparse, datetime, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
ap = argparse.ArgumentParser()
ap.add_argument('id'); ap.add_argument('subject', choices=['efd', 'immo', 'civ', 'deo']); ap.add_argument('order', type=int); ap.add_argument('title')
ap.add_argument('--kicker', default='Chapitre'); ap.add_argument('--short'); ap.add_argument('--num', default='')
a = ap.parse_args()
if not re.fullmatch(r'[a-z]+\d+', a.id): sys.exit('id : lettres puis chiffres, sans tiret (ex. deo3)')
build = open(os.path.join(ROOT, 'build.py'), encoding='utf-8').read()
if '("%s",' % a.id in build: sys.exit('Chapitre déjà dans build.py : ' + a.id)
nums = [int(m.group(1)) for f in os.listdir(SRC) for m in [re.match(r'(\d+)[a-z]?-', f)] if m]
n = max([x for x in nums if x >= 30] or [40]) + 1
files = ['%da-%s.js' % (n, a.id), '%db-%s.js' % (n, a.id), '%dc-%s.js' % (n, a.id), '%dd-%s-fiche.js' % (n, a.id)]
today = datetime.date.today().isoformat(); esc = lambda s: s.replace("'", '’')
T, S = esc(a.title), esc(a.short or a.title)
parts = [
f"""JLG.chapter({{
  id:'{a.id}', subject:'{a.subject}', order:{a.order}, num:'{a.num}', added:'{today}', minutes:30,
  kicker:'{esc(a.kicker)}', short:'{S}', title:'{T}', titleHtml:'{T}',
  intro:'',
  objectives:[],
  prereq:'',
  traps:[],
  sections:[
    // {{id:'s1', n:'I', eyebrow:'', title:'', blocks:[{{t:'p', h:''}}]}},
  ],
  essentials:[],
""",
"""  extraGames:[],
  flashcards:[
    // {q:'', a:''},
  ],
  quiz:[
    // {q:'', o:['', '', '', ''], a:0, e:''},
    // {q:'', tf:true, a:true, e:''},
  ],
""",
"""  sorts:[
    // {id:'ID_s1', title:'', cats:[{id:'a', label:''}, {id:'b', label:''}], items:[{t:'', c:'a'}]},
  ],
  cases:[
    // {id:'ID_c1', title:'', tag:'', facts:[''], q:'', steps:[{l:'Les règles applicables', h:''}]},
  ]
});
""",
f"""JLG.fiche('{a.id}', [
  // {{id:'f1', t:'', items:[{{p:''}}]}}
]);
"""]
for f, c in zip(files, parts):
    p = os.path.join(SRC, f)
    if os.path.exists(p): sys.exit('Existe déjà : ' + f)
    open(p, 'w', encoding='utf-8').write(c)
line = '    ("%s", [%s]),\n' % (a.id, ', '.join('"%s"' % f for f in files))
i = build.index('\n]\n', build.index('CHAPTERS = ['))
build = build[:i + 1] + line + build[i + 1:]
open(os.path.join(ROOT, 'build.py'), 'w', encoding='utf-8').write(build)
subj = os.path.join(SRC, '30-subjects.js'); s = open(subj, encoding='utf-8').read()
if not s.endswith('\n'): s += '\n'
s += "JLG.log({date:'%s', items:['%s : %s']});\n" % (today, esc(a.kicker), T)
open(subj, 'w', encoding='utf-8').write(s)
print('Créé :', ', '.join(files)); print('Inscrit dans build.py et dans les nouveautés (src/30-subjects.js : à compléter ou fusionner avec la ligne du jour).')

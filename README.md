# Jade la Goat

Le site de révision de Jade, en BTS Collaborateur juriste notarial.

**Site :** https://nathanalves-cmd.github.io/JadeLaGoat/

Fiches animées, flashcards, quiz, jeux de tri, cas pratiques corrigés, outils de notariat (convertisseur ha · a · ca, générateur de clause « désignation », plan cadastral) et lexique. La progression (XP, cartes maîtrisées) est enregistrée dans le navigateur de chaque appareil.

## Organisation

- `src/` : les sources. Moteur (`20-*.js` à `29-boot.js`), styles (`0*-*.css`), et un fichier de données par cours (`31a-efd1.js`, `33a-immo1.js`…).
- `build.py` : assemble tout en une seule page.
- `docs/` : le site publié par GitHub Pages (généré par `build.py`).
- `dist/` : la même page, au format artifact claude.ai.

## Ajouter un cours

1. Créer le fichier de données dans `src/` (un appel `JLG.chapter({...})`, sur le modèle des chapitres existants).
2. L'ajouter à la liste `CHAPTERS` de `build.py`, et ajouter une entrée `JLG.log(...)` dans `src/30-subjects.js`.
3. Lancer `python3 build.py`, vérifier, puis commit et push : le site se met à jour tout seul.

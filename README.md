# Alves Cances

Le site de révision de Jade, en BTS Collaborateur juriste notarial (anciennement « Jade la Goat »).

**Site :** https://nathanalves-cmd.github.io/JadeLaGoat/

Fiches animées, flashcards, quiz, jeux de tri, cas pratiques corrigés, outils de notariat (convertisseur ha · a · ca, générateurs de clauses « désignation » et « effet relatif », chaîne des propriétaires, barème de l’usufruit, plan cadastral…) et lexique.

Le site est aussi un jeu : 12 niveaux de plus en plus durs, une animation et un coffre à chaque niveau, des jokers (50/50, seconde chance), des boosters d’XP, des boucliers de série, des sceaux à collectionner et 3 quêtes par jour. La progression est enregistrée dans le navigateur de chaque appareil.

## Organisation

- `src/` : les sources. Moteur (`20-*.js` à `29-boot.js`, dont `28c-game.js` pour le jeu), styles (`0*-*.css`), et un fichier de données par cours (`31a-efd1.js`, `33a-immo1.js`, `37a-immo2.js`…).
- `build.py` : assemble tout en une seule page.
- `docs/` : le site publié par GitHub Pages (généré par `build.py`).
- `dist/` : la même page, au format artifact claude.ai.

## Ajouter un cours

1. Créer le fichier de données dans `src/` (un appel `JLG.chapter({...})`, sur le modèle des chapitres existants).
2. L’ajouter à la liste `CHAPTERS` de `build.py`, et ajouter une entrée `JLG.log(...)` dans `src/30-subjects.js`.
3. Lancer `python3 build.py`, vérifier, puis commit et push : le site se met à jour tout seul.

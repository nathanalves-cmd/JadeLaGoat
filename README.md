# Alves Cances

Le site de révision de Jade, en BTS Collaborateur juriste notarial (anciennement « Jade la Goat »).

**Site :** https://nathanalves-cmd.github.io/JadeLaGoat/

Quatre matières : Éléments fondamentaux du droit, Pratique des opérations immobilières, Droit civil (le couple), Accompagner le client selon les règles déontologiques. Dans chaque chapitre : le cours avec ses schémas animés, la fiche à apprendre, les flashcards, le quiz, les jeux de tri et les cas pratiques corrigés. Plus un lexique et une boîte à outils de notariat (convertisseur ha · a · ca, générateurs de clauses, chaîne des propriétaires, barème de l’usufruit, plan cadastral, course à la publication…).

## Pour réviser mieux

- **Le programme du jour**, sur l’accueil : la révision, le défi, les points faibles, le nouveau cours.
- **La révision espacée** : chaque flashcard sue revient de plus en plus tard (1, 2, 4, 8, 16, 32 jours), chaque carte ratée revient le jour même.
- **Les points faibles** : toute question ratée est gardée jusqu’à ce qu’elle soit réussie.
- **La recherche** dans tout le site (la loupe, `Ctrl K` ou `/`).
- **L’écoute** : un cours, une fiche ou une flashcard lus à voix haute.
- **Hors ligne** : une fois ouvert, le site marche sans internet et s’installe comme une appli.
- **Sauvegarde** de la progression (fichier à télécharger, puis à restaurer sur un autre appareil).

Le site est aussi un jeu : 12 niveaux de plus en plus durs, une animation et un coffre à chaque niveau, des jokers (50/50, seconde chance), des boosters d’XP, des boucliers de série, des sceaux à collectionner et 3 quêtes par jour. La progression est enregistrée dans le navigateur de chaque appareil (clé `jlg.v1`).

## Organisation

- `src/` : les sources. Moteur (`20-*.js` à `29-boot.js` : `28c-game.js` pour le jeu, `28e-plus.js` pour la révision espacée, les points faibles, la recherche, l’écoute, la sauvegarde et le hors-ligne), styles (`0*-*.css`), et un fichier de données par cours (`31a-efd1.js`, `33a-immo1.js`, `37a-immo2.js`, `38a-deo1.js`, `39a-civ3.js`, `40a-immo3.js`…). Les schémas propres à un cours ont leur fichier de moteur et de style (`28f-widgets-civ3.js` + `08b-civ3.css`, `28g-widgets-immo3.js` + `08c-immo3.css`).
- `build.py` : assemble tout en une seule page, et produit trois sorties :
  - `docs/index.html` (+ `docs/sw.js`, `docs/fonts/`) : le site publié par GitHub Pages ;
  - `dist/alves-cances.html` : la même page, au format artifact claude.ai (sans la sauvegarde par fichier, que la copie claude.ai ne permet pas : bloc « sauvegarde » de `28e-plus.js`) ;
  - `dist/Alves-Cances-hors-ligne.html` : le site entier dans un seul fichier, polices comprises, qui s’ouvre sans internet (non versionné).

## Ajouter un cours

1. Créer le fichier de données dans `src/` (un appel `JLG.chapter({...})`, sur le modèle des chapitres existants) et sa fiche (`JLG.fiche(...)`).
2. L’ajouter à la liste `CHAPTERS` de `build.py` (avec ses nouveaux fichiers de schémas, de style ou de lexique s’il en a), et ajouter une entrée `JLG.log(...)` dans `src/30-subjects.js`.
3. Lancer `python3 build.py`, vérifier, puis commit et push : le site se met à jour tout seul (le service worker change de version à chaque build).

---
name: help-jade-site
description: Importer un nouveau cours dans le site de révision de Jade (Alves Cances) ou exporter l’état du site vers une conversation. À utiliser quand l’utilisateur dit « nouveau cours dans ressource », donne un cours de BTS Notariat, ou demande ce que contient le site.
---

# Site de révision de Jade : import / export

Dépôt : `nathanalves-cmd/jadelagoat` (minuscules). Site : https://nathanalves-cmd.github.io/JadeLaGoat/ (lien perso, sans « claude »). Guide complet : la note `claude/site-jade-la-goat.md` du projet « Help jade ».

## Règles qui ne bougent pas
- Une matière par chapitre, jamais de mélange (`efd`, `immo`, `civ`, `deo`).
- Tutoiement, phrases courtes, exemples concrets, moyens mnémotechniques.
- Ne jamais changer la clé localStorage `jlg.v1`. Jamais `</script>` dans une chaîne JS. Apostrophes typographiques (’) dans les chaînes entre guillemets simples.
- Pas de création de compte, pas d’identifiants saisis.
- Quand l’utilisateur dit « nouveau cours dans ressource » : intégrer sans demander, jusqu’à la publication.

## Export : donner l’état du site à une conversation
1. Cloner le dépôt (`add_repo` avec accès push, puis `git clone`).
2. `node tools/export_site.js` écrit `export/site-jade-export.md` : matières, chapitres, points essentiels, lexique, nouveautés.
3. `node tools/export_site.js --chapter <id>` écrit `export/chapitre-<id>.md` : le chapitre entier (pièges, flashcards, quiz corrigé, cas).
4. `node tools/export_site.js --json` écrit toutes les données brutes.
5. Pour que toute conversation du projet puisse lire l’état du site : `Projects project_write` avec `claude/site-jade-export.md` (contenu du premier fichier). À régénérer après chaque ajout de cours.

## Import : ajouter un cours
1. Lire la ressource du projet en entier (`project_read`). Choisir la matière et l’ordre ; en cas de doute, le dire à l’utilisateur à la fin (changer de matière = changer le champ `subject`).
2. `python3 tools/new_chapter.py <id> <matière> <ordre> "<Titre>" --kicker "..."` crée les 4 fichiers `src/NNa..d-<id>*.js`, l’inscrit dans `build.py` et ajoute une ligne de nouveautés dans `src/30-subjects.js`.
3. Remplir : `a` = en-tête, pièges, sections, essentiels ; `b` = jeux, flashcards, quiz ; `c` = jeux de tri, cas pratiques, `});` ; `d` = fiche. Modèle : les fichiers `41a-d-deo2*.js`. Ajouter les mots au lexique (`34*-glossary-*.js`, `s:[…]` = matières).
4. Schémas animés propres au cours : un fichier `28*-widgets-*.js` (`JLG.widget`) + un CSS, à ajouter dans les listes de `build.py`.
5. `node tools/check_data.js` doit afficher OK (quiz, jeux de tri, cas, widgets, doublons, apostrophes).
6. `python3 build.py`, puis test navigateur (Playwright, `docs/` servi en http, localStorage `jlg.v1` avec `gameV:2`) : toutes les routes `#ch-<id>…`, mobile 390 px et bureau, pas de `.oops`, pas de défilement horizontal.
7. Commit (message + lignes d’attribution de la session), `git fetch origin main`, push sur `main` : GitHub Pages se met à jour en environ une minute.
8. Republier `dist/alves-cances.html` sur l’artifact (lire la version en ligne d’abord), mettre à jour la note du projet et l’export.
9. Réponse à l’utilisateur : le résultat en deux phrases, le choix de matière, le lien inchangé.

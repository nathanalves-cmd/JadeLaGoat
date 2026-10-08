#!/usr/bin/env python3
"""Assemble Jade la Goat.

- dist/jade-la-goat.html : version artifact claude.ai (sans doctype : le squelette est ajouté à la publication)
- docs/index.html        : version autonome pour GitHub Pages (nathanalves-cmd.github.io/JadeLaGoat)
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
SITE_URL = "https://nathanalves-cmd.github.io/JadeLaGoat/"

def r(name):
    return (SRC / name).read_text(encoding="utf-8")

def block(tag, label, body):
    return (f"<!-- ▼ JLG:{tag} {label} ▼ -->\n<script>\n{body}\n</script>\n"
            f"<!-- ▲ JLG:{tag} {label} ▲ -->\n")

# Ordre des cours : ajouter ici chaque nouveau chapitre (fichiers dans src/).
CHAPTERS = [
    ("efd1", ["31a-efd1.js", "31b-efd1.js", "31c-efd1-fiche.js"]),
    ("efd2", ["32a-efd2.js", "32b-efd2.js", "32c-efd2-fiche.js"]),
    ("immo1", ["33a-immo1.js", "33b-immo1.js", "33c-immo1.js", "33d-immo1-fiche.js"]),
    ("civ1", ["35a-civ1.js", "35b-civ1.js", "35c-civ1-fiche.js"]),
    ("civ2", ["36a-civ2.js", "36b-civ2.js", "36c-civ2.js", "36d-civ2-fiche.js"]),
]

css = "\n".join(r(n) for n in ["01-base.css", "02-pages.css", "03-games.css", "04-widgets.css", "05-fiches-civ.css"])
engine = "\n".join(r(n) for n in ["20-core.js", "21-views.js", "22-views2.js", "23-games.js",
                                   "24-widgets-a.js", "25-widgets-b.js", "26-widgets-c.js", "27-fiches.js", "28-widgets-civ.js", "29-boot.js"])
courses = "".join([
    "<!-- ═════════ CONTENU DES COURS : un bloc par chapitre ═════════ -->\n",
    block("MATIERES", "efd immo civ", r("30-subjects.js")),
    *[block("CHAPITRE", cid, "".join(r(f) for f in files)) for cid, files in CHAPTERS],
    block("LEXIQUE", "tous", r("34-glossary.js") + r("34b-glossary-civ.js")),
    "<!-- ▼ JLG:NOUVEAUX-COURS ▼ -->\n<!-- ▲ JLG:NOUVEAUX-COURS ▲ -->\n",
])
engine_tag = "<!-- ═════════ MOTEUR DU SITE ═════════ -->\n<script>\n" + engine + "\n</script>\n"
boot = "<script>JLG.boot();</script>\n"

# 1) Artifact
artifact = "".join([r("00-head.html"), "<style>\n", css, "\n</style>\n", r("10-shell.html"), engine_tag, courses, boot])
(ROOT / "dist").mkdir(exist_ok=True)
(ROOT / "dist" / "jade-la-goat.html").write_text(artifact, encoding="utf-8")

# 2) Site autonome
meta = f"""<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0B0911">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Jade la Goat">
<meta property="og:title" content="Jade la Goat">
<meta property="og:description" content="Le QG de révision de Jade : fiches animées, quiz, flashcards, jeux et cas pratiques du BTS notariat.">
<meta property="og:url" content="{SITE_URL}">
<meta property="og:image" content="{SITE_URL}og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="manifest.webmanifest">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Jade la Goat">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
"""
standalone_css = "\n:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}\nhtml{background:var(--bg)}\n"
site = "".join([
    '<!doctype html>\n<html lang="fr">\n<head>\n', meta, r("00-head.html"),
    "<style>\n", css, standalone_css, "</style>\n</head>\n<body>\n",
    r("10-shell.html"), engine_tag, courses, boot, "</body>\n</html>\n",
])
(ROOT / "docs").mkdir(exist_ok=True)
(ROOT / "docs" / "index.html").write_text(site, encoding="utf-8")
(ROOT / "docs" / ".nojekyll").write_text("", encoding="utf-8")
(ROOT / "docs" / "manifest.webmanifest").write_text("""{
  "name": "Jade la Goat",
  "short_name": "Jade la Goat",
  "description": "Le QG de révision de Jade (BTS notariat)",
  "lang": "fr",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#0B0911",
  "theme_color": "#0B0911",
  "icons": [
    {"src": "icon-192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "icon-512.png", "sizes": "512x512", "type": "image/png"}
  ]
}
""", encoding="utf-8")

for name, html in [("dist/jade-la-goat.html", artifact), ("docs/index.html", site)]:
    print(f"OK {name} — {len(html.encode('utf-8')) / 1024:.1f} Ko")

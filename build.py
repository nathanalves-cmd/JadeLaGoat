#!/usr/bin/env python3
"""Assemble Alves Cances (anciennement « Jade la Goat »).

- dist/alves-cances.html : version artifact claude.ai (sans doctype : le squelette est ajouté à la publication)
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
    ("immo2", ["37a-immo2.js", "37b-immo2.js", "37c-immo2.js", "37d-immo2-fiche.js"]),
    ("immo3", ["40a-immo3.js", "40b-immo3.js", "40c-immo3.js", "40d-immo3-fiche.js"]),
    ("civ1", ["35a-civ1.js", "35b-civ1.js", "35c-civ1-fiche.js"]),
    ("civ2", ["36a-civ2.js", "36b-civ2.js", "36c-civ2.js", "36d-civ2-fiche.js"]),
    ("civ3", ["39a-civ3.js", "39b-civ3.js", "39c-civ3.js", "39d-civ3-fiche.js"]),
    ("deo1", ["38a-deo1.js", "38b-deo1.js", "38c-deo1.js", "38d-deo1-fiche.js"]),
]

css = "\n".join(r(n) for n in ["01-base.css", "02-pages.css", "03-games.css", "04-widgets.css", "05-fiches-civ.css", "06-immo2.css", "07-game.css", "08-deo.css", "08b-civ3.css", "08c-immo3.css", "09-plus.css"])
engine = "\n".join(r(n) for n in ["20-core.js", "21-views.js", "22-views2.js", "23-games.js",
                                   "24-widgets-a.js", "25-widgets-b.js", "26-widgets-c.js", "27-fiches.js", "28-widgets-civ.js",
                                   "28b-widgets-immo2.js", "28c-game.js", "28d-widgets-deo.js", "28e-plus.js", "28f-widgets-civ3.js", "28g-widgets-immo3.js", "29-boot.js"])
courses = "".join([
    "<!-- ═════════ CONTENU DES COURS : un bloc par chapitre ═════════ -->\n",
    block("MATIERES", "efd immo civ deo", r("30-subjects.js")),
    *[block("CHAPITRE", cid, "".join(r(f) for f in files)) for cid, files in CHAPTERS],
    block("LEXIQUE", "tous", r("34-glossary.js") + r("34b-glossary-civ.js") + r("34c-glossary-immo2.js") + r("34d-glossary-deo.js") + r("34e-glossary-civ3.js") + r("34f-glossary-immo3.js")),
    "<!-- ▼ JLG:NOUVEAUX-COURS ▼ -->\n<!-- ▲ JLG:NOUVEAUX-COURS ▲ -->\n",
])
engine_tag = "<!-- ═════════ MOTEUR DU SITE ═════════ -->\n<script>\n" + engine + "\n</script>\n"
boot = "<script>JLG.boot();</script>\n"


# Polices : en ligne, le site autonome les sert lui-même (docs/fonts) ; le fichier hors ligne les embarque en base64.
import base64, re
FONTS = [("Bodoni Moda", "normal", "400 900", "bodoni-moda-latin-opsz-normal.woff2"),
         ("Bodoni Moda", "italic", "400 900", "bodoni-moda-latin-opsz-italic.woff2"),
         ("Bricolage Grotesque", "normal", "200 800", "bricolage-grotesque-latin-opsz-normal.woff2"),
         ("JetBrains Mono", "normal", "100 800", "jetbrains-mono-latin-wght-normal.woff2")]
def font_css(embed):
    out = []
    for fam, style, wght, f in FONTS:
        src = ("data:font/woff2;base64," + base64.b64encode((ROOT / "docs" / "fonts" / f).read_bytes()).decode()) if embed else "fonts/" + f
        out.append(f'@font-face{{font-family:"{fam}";font-style:{style};font-weight:{wght};font-display:swap;src:url({src}) format("woff2")}}')
    return "\n".join(out) + "\n"
def head_without_google():
    return re.sub(r'<link rel="(preconnect|stylesheet)" href="https://fonts\.g[^"]*"[^>]*>\n?', "", r("00-head.html"))

# 1) Artifact : la copie claude.ai ne peut pas télécharger de fichier, on retire la sauvegarde (bloc « sauvegarde » de 28e-plus.js).
engine_artifact, n_backup = re.subn(r"/\* ▼ sauvegarde ▼ \*/\n.*?/\* ▲ sauvegarde ▲ \*/\n", "const inArtifact = () => true;\n", engine, flags=re.S)
assert n_backup == 1, "bloc « sauvegarde » introuvable dans 28e-plus.js"
artifact_engine_tag = "<!-- ═════════ MOTEUR DU SITE ═════════ -->\n<script>\n" + engine_artifact + "\n</script>\n"
artifact = "".join([r("00-head.html"), "<style>\n", css, "\n</style>\n", r("10-shell.html"), artifact_engine_tag, courses, boot])
(ROOT / "dist").mkdir(exist_ok=True)
(ROOT / "dist" / "alves-cances.html").write_text(artifact, encoding="utf-8")

# 2) Site autonome
meta = f"""<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0B0911">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Alves Cances">
<meta property="og:title" content="Alves Cances">
<meta property="og:description" content="Le QG de révision de Jade : fiches animées, quiz, flashcards, cas pratiques du BTS notariat, et 12 niveaux à conquérir.">
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
<meta name="apple-mobile-web-app-title" content="Alves Cances">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
"""
standalone_css = "\n:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}\nhtml{background:var(--bg)}\n"
preload = '<link rel="preload" href="fonts/bricolage-grotesque-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>\n'
site = "".join([
    '<!doctype html>\n<html lang="fr">\n<head>\n', meta, preload, head_without_google(),
    "<style>\n", font_css(False), css, standalone_css, "</style>\n</head>\n<body>\n",
    r("10-shell.html"), engine_tag, courses, boot, "</body>\n</html>\n",
])
(ROOT / "docs").mkdir(exist_ok=True)
(ROOT / "docs" / "index.html").write_text(site, encoding="utf-8")
(ROOT / "docs" / ".nojekyll").write_text("", encoding="utf-8")

# Service worker : le site marche hors ligne une fois visité (page : réseau d’abord, le reste : cache d’abord).
import hashlib
ver = hashlib.sha1(site.encode("utf-8")).hexdigest()[:10]
core = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"] + ["fonts/" + f for _, _, _, f in FONTS]
(ROOT / "docs" / "sw.js").write_text(f"""/* Alves Cances : hors ligne. Version {ver} (générée par build.py). */
const V = 'ac-{ver}';
const CORE = {core!r};
self.addEventListener('install', e => {{ e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); }});
self.addEventListener('activate', e => {{ e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('ac-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); }});
self.addEventListener('fetch', e => {{
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin) return;
  if (r.mode === 'navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('.html')) {{
    e.respondWith(fetch(r).then(res => {{ if (res.ok) {{ const cp = res.clone(); caches.open(V).then(c => c.put('index.html', cp)); }} return res; }})
      .catch(() => caches.match('index.html').then(m => m || caches.match('./'))));
    return;
  }}
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => {{ if (res.ok) {{ const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }} return res; }})));
}});
""", encoding="utf-8")

(ROOT / "docs" / "manifest.webmanifest").write_text("""{
  "name": "Alves Cances",
  "short_name": "Alves Cances",
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

# 3) Fichier unique hors ligne (à télécharger) : tout est dedans, même les polices.
favicon = ("data:image/svg+xml," + "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%237C4DFF'/%3E"
           "%3Ctext x='32' y='41' text-anchor='middle' font-family='Georgia,serif' font-style='italic' font-weight='700' font-size='26' fill='white'%3EAC%3C/text%3E%3C/svg%3E")
offline_meta = f"""<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0B0911">
<link rel="icon" href="{favicon}">
"""
offline = "".join([
    '<!doctype html>\n<html lang="fr">\n<head>\n', offline_meta, head_without_google(),
    "<style>\n", font_css(True), css, standalone_css, "</style>\n</head>\n<body>\n",
    r("10-shell.html"), engine_tag, courses, boot, "</body>\n</html>\n",
])
(ROOT / "dist" / "Alves-Cances-hors-ligne.html").write_text(offline, encoding="utf-8")

for name, html in [("dist/alves-cances.html", artifact), ("docs/index.html", site), ("dist/Alves-Cances-hors-ligne.html", offline)]:
    print(f"OK {name} — {len(html.encode('utf-8')) / 1024:.1f} Ko")

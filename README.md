# Kuan Streetwear — 款

A personal streetwear project and **visual archive** based in Sài Gòn. Static site
hosted on **GitHub Pages** at [kuanstreetwear.com](https://kuanstreetwear.com).

> Not a store. Not a brand (yet). A living design project: clothing modification,
> documentation, and visual identity — between Vietnamese street culture and
> post-Soviet utility.

## Structure

```
/
├── index.html                  # Main — hero, selected projects, latest journal, story intro
├── story/index.html            # Story — how it started
├── projects/index.html         # Projects — KSW archive grid
│   └── projects/ksw-001/       # Project detail template (base item / idea / mods / result / gallery / specs)
├── blog/index.html             # Journal — editorial article list
│   └── blog/blank-tees/        # Article template
├── about/index.html            # About + contacts (Instagram, email, Telegram)
├── 404.html
├── favicon.svg                 # 款 mark
├── logo.png                    # legacy logo (social/OG preview)
├── CNAME                       # custom domain
└── assets/
    ├── css/style.css           # design system (editorial / archive)
    └── js/main.js              # mobile nav, scroll reveal, copy-email, year
```

## Design system

**Theme — editorial archive, light.**

- **Colors:** warm off-white paper `#f4f1ea`, near-black ink `#17160f`, concrete
  grey `#6f6d63`; dark sections `#15140f`; single restrained accent — muted
  industrial orange `#bf4d18` (used sparingly).
- **Typography** (one Google Fonts request, preconnected, `display=swap`):
  - **Inter Tight** — primary (display + UI). Supports **Latin, Cyrillic, Vietnamese**.
  - **IBM Plex Mono** — technical labels, codes, coordinates (also Cyrillic/Vietnamese).
  - **Noto Sans JP** — decorative microtypography only.
- **The mark:** 款 (kuǎn — "style / model / form"), used as favicon and quiet accent.
- **Archive language:** index numbers (`001`), codes (`KSW-001`), coordinates
  (`10°46′37″N 106°41′18″E`), `+` markers, bracketed section labels.

### Multilingual microtypography (intentional, subtle)

- **English** — main reading language.
- **Russian** — small section labels (`ПРОЕКТ`, `ЖУРНАЛ`, `ИСТОРИЯ`, `О ПРОЕКТЕ`)
  and occasional titles (`Сделано в Сайгоне`).
- **Vietnamese** — location and place names (`Sài Gòn / Việt Nam`).
- **Japanese** — decorative side labels / single glyphs only (`アーカイブ`, `サイゴン`, `款`).

Readability first — never more than a couple of scripts active on a screen.

## Editing content

- **Add a project:** copy a `.proj` card in `projects/index.html`; duplicate
  `projects/ksw-001/` for a detail page. Swap the code, title, meta, tags, and
  replace the `.frame` placeholder with a real `<img>` inside it.
- **Add an article:** copy an `.entry` row in `blog/index.html`; duplicate
  `blog/blank-tees/` for the article body.
- **Real photos:** drop an `<img>` inside any `.frame` (it crops with
  `object-fit: cover`); keep the `.frame__code` label for the archival look.
- **Colors / fonts:** edit the variables in `:root` (`assets/css/style.css`).
- **Nav / footer** are repeated per page (static, no build step) — keep in sync.

## Local preview

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Deploy

GitHub Pages serves the repository root from the default branch (`main`). The
`CNAME` keeps the custom domain bound.

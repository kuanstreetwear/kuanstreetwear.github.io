# Kuan Streetwear — 款

A personal streetwear project and **visual archive** based in Sài Gòn. Static site
hosted on **GitHub Pages** at [kuanstreetwear.com](https://kuanstreetwear.com).

> Not a store. Not a brand (yet). A living design project: clothing modification,
> documentation, and visual identity — between Vietnamese street culture and
> post-Soviet utility.

## Engine

Built with **Jekyll** (the generator GitHub Pages runs natively) plus **Sveltia
CMS** for browser-based editing. The nav/head/footer live once in `_includes/`;
the blog, projects, and the About/Story pages are rendered from Markdown through
shared layouts. Only the bespoke home-page body and the 404 stay as inline HTML.

```
/
├── _config.yml                 # Jekyll config — collections, permalinks, defaults
├── Gemfile                     # mirrors the GitHub Pages toolchain (github-pages gem)
├── _includes/                  # shared partials — head, nav, footer (single source)
├── _layouts/                   # default · post · project · about · story
├── _data/site.yml              # ← SITE settings: contacts, location, footer blurb
├── _blog/                      # ← BLOG entries (Markdown)
├── _projects/                  # ← PROJECT entries (Markdown)
├── about.md                    # ← About page content (layout: about)
├── story.md                    # ← Story page content (layout: story)
├── admin/                      # Sveltia CMS — /admin (index.html + config.yml)
│
├── index.html                  # Main — layout: default, bespoke hero/sections in body
├── 404.html                    # static (minimal footer, left as plain HTML)
├── blog/index.html             # Journal — listing, loops the _blog collection
├── projects/index.html         # Projects — grid, loops the _projects collection
├── favicon.svg                 # 款 mark
├── logo.png                    # social/OG preview image
├── CNAME                       # custom domain
└── assets/
    ├── css/style.css           # design system (editorial / archive)
    ├── js/main.js              # mobile nav, scroll reveal, copy-email, year
    └── img/uploads/            # CMS image uploads land here
```

> Detail-page URLs are unchanged: `_blog/blank-tees.md` → `/blog/blank-tees/`,
> `_projects/ksw-001.md` → `/projects/ksw-001/`.

**CMS sections** (at `/admin`): **Blog**, **Projects**, **Pages** (About + Story),
and **Site** (contacts / location / footer — edited once, applied everywhere).
Contacts and location are sourced from `_data/site.yml` by both the footer and the
About page. Blog posts and projects have a **Published** toggle — unchecking it
keeps the entry as a draft (`published: false`), excluded from the build and the
listings until you turn it on.

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

Three ways, all writing the same Markdown files in `_blog/` and `_projects/`:

1. **Browser CMS** — go to `/admin`, fill the forms, hit Save. Sveltia commits to
   `main`; GitHub Pages rebuilds automatically. Best for quick edits and mobile.
2. **By hand** — add a `.md` file to `_blog/` or `_projects/` with the
   front-matter fields (see existing entries as a template) and commit.
3. **With AI** — ask Claude to write or edit an entry; it creates the `.md` and
   commits. Good for drafting full posts and bulk changes.

Other edits:

- **Static pages** (`index.html`, `story/`, `about/`, `404.html`) are plain HTML —
  edit directly. The home page's "selected projects" / "latest journal" cards are
  curated by hand on purpose.
- **Nav / footer / `<head>`** live once in `_includes/` — edit there, every page
  updates.
- **Colors / fonts:** the variables in `:root` (`assets/css/style.css`).
- **Photos:** the CMS uploads to `assets/img/uploads/`; reference them in the
  `cover` / `card_image` / `gallery` fields. External URLs also work.

### CMS authentication

Sveltia signs in to GitHub with a **Personal Access Token** out of the box (no
setup). For a one-click "Sign in with GitHub" button instead, deploy
[sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) (a tiny Cloudflare
Worker) and set `base_url` in `admin/config.yml`.

## Local preview

Requires Ruby ≥ 3.0 (the system Ruby on macOS is too old — use `rbenv` or
Homebrew). Or use Docker, which needs nothing installed:

```bash
# Ruby toolchain
bundle install
bundle exec jekyll serve            # http://localhost:4000

# …or Docker
docker run --rm -v "$PWD":/srv/jekyll -p 4000:4000 \
  jekyll/jekyll:4.2.2 jekyll serve --host 0.0.0.0
```

## Deploy

Push to `main` — GitHub Pages builds the Jekyll site and serves it at the `CNAME`
domain. No Actions or extra config: the `github-pages` gem is the same toolchain
Pages runs in the cloud.

# KUAN — 款

Digital streetwear with an Asian, techno-urban spirit. Static site hosted on **GitHub Pages** at [kuanstreetwear.com](https://kuanstreetwear.com).

## Structure

```
/
├── index.html            # Home — hero, manifesto teaser, latest drop
├── drops/index.html      # Drops / lookbook (product grid, ready for real items)
├── about/index.html      # Manifesto & brand principles
├── contact/index.html    # Contact form + channels
├── 404.html              # Custom not-found page
├── favicon.svg           # 款 mark favicon
├── logo.png              # Brand logo (used for social/OG preview)
├── CNAME                 # Custom domain (kuanstreetwear.com)
└── assets/
    ├── css/style.css     # Design system + components
    └── js/main.js        # Nav, scroll reveal, marquee, form
```

## Design system

- **Theme:** near-black `#0b0b0c` with techno-red accent `#e3261b`
- **Fonts** (one Google Fonts request, preconnected, `display=swap`):
  - `Chakra Petch` — display / headings (techno)
  - `Space Mono` — UI / labels / body
  - `Noto Sans JP` — CJK accents (款 mark)
- **The mark:** 款 (kuǎn) — "style / model / form" — used as watermark, favicon and divider.

All design tokens live as CSS variables in `:root` (`assets/css/style.css`).

## Editing content

- **Add a product:** copy a `.card` block in `drops/index.html`. Swap the kanji in
  `.card__media .kanji`, the title and price. Replace the kanji block with an
  `<img>` once real photos exist.
- **Update navigation/footer:** these are repeated in each HTML file (static site,
  no build step). Keep them in sync.
- **Colors / fonts:** change the variables in `:root`.

## Contact form

The form on `/contact/` has **no backend yet** — `main.js` just shows a confirmation.
To make it live, point it at a service like [Formspree](https://formspree.io) or
[Getform](https://getform.io): set the `<form action="...">` and remove the
`e.preventDefault()` handler in `main.js`.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Push to the default branch — GitHub Pages serves the root. The `CNAME` file keeps
the custom domain bound.

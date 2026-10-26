// Kuan home: boot screen, archive cards from feed.json, generative tiles and the viewer.
// Shared helpers (scramble, segs, reveal) come from kuan.js.
(() => {
  const { $, $$, calm, esc, scramble, segs, observe } = window.KUAN;
  const bind = (k, v) => $$(`[data-bind="${k}"]`).forEach(n => { n.textContent = v; });

  // Boot: short fake handshake, once per tab session so navigation back is instant.
  function boot() {
    const root = document.documentElement;
    let seen = false;
    try { seen = sessionStorage.getItem("kuan-boot") === "1"; sessionStorage.setItem("kuan-boot", "1"); } catch {}
    if (calm || seen) { root.classList.add("is-booted"); return; }
    const pct = $(".boot__pct");
    const t0 = performance.now(), ms = 900;
    const tick = now => {
      const k = Math.min(1, (now - t0) / ms);
      pct.textContent = "...." + String(Math.round(k * 100)).padStart(3, "0") + "%";
      if (k < 1) requestAnimationFrame(tick);
      else root.classList.add("is-booted"); // fade delay lives in CSS; timers get throttled in background tabs
    };
    requestAnimationFrame(tick);
    $(".boot").addEventListener("click", () => root.classList.add("is-booted"));
  }

  function barcode() {
    const n = $(".barcode");
    if (!n) return;
    let x = 0, stops = [];
    while (x < 100) {
      const w = [1, 1, 2, 3][(Math.random() * 4) | 0] * 0.9, gap = [1, 2, 2, 3][(Math.random() * 4) | 0] * 0.9;
      stops.push(`var(--ink) ${x}% ${x + w}%`, `transparent ${x + w}% ${x + w + gap}%`);
      x += w + gap;
    }
    n.style.background = `linear-gradient(90deg, ${stops.join(",")})`;
  }

  function ticker(words) {
    const run = $('[data-bind="ticker"]');
    const once = words.map(w => `<span>${esc(w)}</span><span class="sep">◂▸</span>`).join("");
    run.innerHTML = once + once; // doubled for a seamless -50% loop
  }

  // ── generative tiles: content we can make ourselves while there are few photos ──
  // Dot terrain in the spirit of a holo-map: a moving height field drawn as rows of points,
  // three passes with a small x offset give the RGB fringe.
  function terrain(host) {
    const cv = document.createElement("canvas");
    host.append(cv);
    const ctx = cv.getContext("2d");
    let w = 0, h = 0, t = Math.random() * 100, raf = 0, visible = true;
    const resize = () => {
      const r = host.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const height = (x, z) => Math.sin(x * 2.1 + t * 0.6) * 0.35 + Math.sin(z * 3.3 - t * 0.4) * 0.25
      + Math.sin((x + z) * 5.7 + t) * 0.12 + Math.cos(x * 9 - z * 4 + t * 1.3) * 0.05;
    const draw = () => {
      ctx.fillStyle = "#0d0e0d"; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const rows = 48, cols = 84, horizon = h * 0.3;
      for (const [dx, col] of [[-2.4, "#ff2e4d"], [2.4, "#2ef2e0"], [0, "#ecece7"]]) {
        ctx.fillStyle = col;
        ctx.globalAlpha = col === "#ecece7" ? 0.9 : 0.7;
        for (let r = 0; r < rows; r++) {
          // far rows already span past the edges, so it reads as ground, not a dome
          const z = r / rows, persp = 0.9 + z * 1.4;
          const y0 = horizon + Math.pow(z, 1.4) * (h - horizon) * 0.95;
          for (let c = 0; c < cols; c++) {
            const x = (c / (cols - 1) - 0.5) * 1.5;
            const hy = height(x, z);
            const sx = w / 2 + x * w * persp + dx;
            const sy = y0 - hy * h * 0.16 * persp;
            if (sx < -4 || sx > w + 4) continue;
            const s = 0.8 + z * 1.8;
            ctx.fillRect(sx, sy, s, s);
          }
        }
      }
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    };
    const loop = () => {
      if (!cv.isConnected) return; // viewer copy was closed
      t += 0.012; draw(); raf = requestAnimationFrame(loop);
    };
    resize(); draw();
    new ResizeObserver(() => { resize(); draw(); }).observe(host);
    if (calm) return;
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) loop();
    }).observe(host);
  }

  // Kinetic type poster: one word per row, rows drift in alternating directions.
  function typePoster(host, words) {
    const rows = Array.from({ length: 7 }, (_, r) => {
      const w = words[r % words.length];
      const run = Array.from({ length: 6 }, () => `<span>${esc(w)}</span>`).join("");
      return `<div class="tp__row${r % 2 ? " tp__row--rev" : ""}${r % 3 === 1 ? " tp__row--solid" : ""}" style="--s:${18 + (r % 3) * 6}s">${run}${run}</div>`;
    }).join("");
    host.insertAdjacentHTML("beforeend", `<div class="tp">${rows}</div>`);
  }

  const GENS = { terrain, type: (host, p) => typePoster(host, p.words || ["KUAN"]) };

  function mediaHTML(p, inViewer = false) {
    if (p.type === "video") return `<video src="${esc(p.src)}" muted loop playsinline autoplay ${inViewer ? "controls" : 'preload="metadata"'}></video>`;
    if (p.type === "gen") return "";
    const base = `<img src="${esc(p.src)}" alt="${esc(p.title)}"${inViewer ? "" : ' loading="lazy" decoding="async"'}>`;
    if (inViewer) return base;
    return p.alt
      ? `${base}<img class="alt" src="${esc(p.alt)}" alt="" loading="lazy" decoding="async">`
      : `${base}<span class="streak" style="--img:url('${esc(p.src)}')"></span>`;
  }

  function cards(posts, open) {
    const box = $('[data-bind="cards"]');
    const html = posts.map((p, i) => {
      const media = mediaHTML(p);
      return `<article class="card hud${p.type === "gen" ? " card--gen" : ""}" style="--d:${(i % 2) * 0.12}s">
        <button class="card__media" type="button" data-i="${i}" aria-label="Open ${esc(p.title)}">${media}
          <i class="br tl"></i><i class="br tr"></i><i class="br bl"></i><i class="br br_"></i></button>
        <div class="card__head"><span class="chip"><i class="dot"></i>${esc(p.kind)}</span><span class="code">${esc(p.code)}</span></div>
        <h3>${esc(p.title)}</h3>
        <dl class="rows"><dt>Signal</dt><dd><span class="segs" data-segs="12" data-v="${p.signal ?? 0.5}"></span>${Math.round((p.signal ?? 0.5) * 100)}%</dd></dl>
      </article>`;
    }).join("");
    box.innerHTML = html + `<article class="card card--empty hud" aria-hidden="true">
        <div class="card__media"><i class="br tl"></i><i class="br tr"></i><i class="br bl"></i><i class="br br_"></i>
          <span class="nosig">SIGNAL LOST</span><span class="code">KSW-003 · next drop</span></div>
        <div class="card__head"><span class="chip">Pending</span><span class="code">[....]</span></div>
      </article>`;
    $$(".card__media[data-i]", box).forEach(m => {
      const p = posts[+m.dataset.i];
      if (p.type === "gen") GENS[p.gen]?.(m, p);
    });
    box.addEventListener("click", e => {
      const b = e.target.closest("[data-i]");
      if (b) open(+b.dataset.i);
    });
  }

  // Viewer
  const dlg = $(".viewer");
  let list = [], cur = 0;
  function show(i) {
    cur = (i + list.length) % list.length;
    const p = list[cur];
    const box = $(".viewer__media", dlg);
    box.innerHTML = mediaHTML(p, true);
    box.classList.toggle("is-gen", p.type === "gen");
    if (p.type === "gen") GENS[p.gen]?.(box, p);
    $(".viewer__code", dlg).textContent = `${p.code} · ${p.kind}`;
    scramble($(".viewer__title", dlg), p.title, 450);
    $(".viewer__text", dlg).textContent = p.caption || "";
  }
  const open = i => { show(i); dlg.showModal(); };
  $(".viewer__close", dlg).addEventListener("click", () => dlg.close());
  $(".viewer__nav--prev", dlg).addEventListener("click", () => show(cur - 1));
  $(".viewer__nav--next", dlg).addEventListener("click", () => show(cur + 1));
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { $(".viewer__media", dlg).innerHTML = ""; });
  addEventListener("keydown", e => {
    if (!dlg.open) return;
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "ArrowLeft") show(cur - 1);
  });

  boot();
  barcode();

  fetch("/assets/kuan/feed.json", { cache: "no-cache" })
    .then(r => r.json())
    .then(({ site, posts }) => {
      list = posts;
      bind("tagline", site.tagline);
      bind("coords", site.coords);
      bind("since-line", `Custom DIY studio — since ${site.since}`);
      bind("place", site.place);
      bind("since", site.since);
      bind("mode", site.mode);
      bind("count", String(posts.length).padStart(2, "0"));
      ticker(site.ticker);
      cards(posts, open);
      segs();
      observe($$(".card"));
    })
    .catch(err => console.error("[kuan] feed.json failed", err));
})();

// Kuan — shared motion layer for every page: clock, mobile menu, scramble labels,
// glitch bursts, segmented bars, scroll reveal. Page scripts reuse it via window.KUAN.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const GLYPHS = "!<>-_\\/[]{}=+*^?#░▒▓01";
  const esc = (s = "") => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Decode text from noise into the real string, left to right.
  function scramble(node, text = node.dataset.text || node.textContent, ms = 700) {
    node.dataset.text = text;
    if (calm) { node.textContent = text; return; }
    const t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / ms);
      const fixed = Math.floor(text.length * k);
      let out = text.slice(0, fixed);
      for (let i = fixed; i < text.length; i++) out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      node.textContent = out;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function segs(root = document) {
    $$("[data-segs]", root).forEach(n => {
      if (n.childElementCount) return;
      const total = +n.dataset.segs, on = Math.round(total * (+n.dataset.v || 0));
      n.innerHTML = Array.from({ length: total }, (_, i) => `<i class="${i < on ? "on" : ""}" style="--i:${i}"></i>`).join("");
    });
  }

  // One observer for everything that appears on scroll.
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const n = e.target;
    if (n.matches("[data-scramble]")) scramble(n);
    else n.classList.add("is-in");
    io.unobserve(n);
  }), { threshold: 0.2 });
  const observe = nodes => nodes.forEach(n => io.observe(n));

  function clock() {
    const n = $("[data-clock]");
    if (!n) return;
    const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const set = () => { n.textContent = "SGN " + f.format(new Date()); };
    set(); setInterval(set, 1000);
  }

  // Interference bursts at random intervals; also on hover.
  function glitch(node) {
    if (calm || !node) return;
    const hit = () => { node.classList.remove("is-glitching"); void node.offsetWidth; node.classList.add("is-glitching"); };
    const loop = () => { hit(); setTimeout(loop, 3000 + Math.random() * 5000); };
    setTimeout(loop, 1400);
    node.addEventListener("mouseenter", hit);
  }

  function cursorReadout() {
    const n = $(".coords-live");
    if (!n || calm || matchMedia("(pointer: coarse)").matches) return;
    addEventListener("mousemove", e => {
      n.textContent = `X ${String(e.clientX).padStart(4, "0")} · Y ${String(e.clientY + scrollY | 0).padStart(4, "0")}`;
    }, { passive: true });
  }

  function menu() {
    const btn = $(".burger"), panel = $("#menu");
    if (!btn || !panel) return;
    const set = open => {
      panel.hidden = !open;
      document.body.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "[CLOSE]" : "[MENU]";
      if (open) $$(".menu__links b", panel).forEach((b, i) => setTimeout(() => scramble(b, b.dataset.text, 420), i * 60));
    };
    // Warm the cache for the menu targets so the next page paints right away.
    const prefetched = new Set([location.pathname]);
    const prefetch = href => {
      const path = new URL(href, location.href).pathname;
      if (prefetched.has(path)) return;
      prefetched.add(path);
      document.head.append(Object.assign(document.createElement("link"), { rel: "prefetch", href: path }));
    };

    btn.addEventListener("click", () => {
      const open = panel.hidden;
      set(open);
      if (open) $$("a", panel).forEach(a => prefetch(a.href));
    });
    panel.addEventListener("click", e => {
      const a = e.target.closest("a");
      if (!a) return;
      // Same page (e.g. #archive on home): close and let it scroll.
      if (new URL(a.href, location.href).pathname === location.pathname) { set(false); return; }
      // Leaving: keep the menu up until the next page paints — closing first flashed the old page.
      panel.classList.add("is-leaving");
      a.classList.add("is-going");
    });
    $$(".nav a").forEach(a => a.addEventListener("pointerenter", () => prefetch(a.href), { once: true }));
    addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) set(false); });
    // Back/forward cache restores the page as it was left — with the menu still open.
    addEventListener("pageshow", e => {
      if (!e.persisted) return;
      panel.classList.remove("is-leaving");
      $$(".is-going", panel).forEach(n => n.classList.remove("is-going"));
      set(false);
    });
  }

  window.KUAN = { $, $$, calm, esc, scramble, segs, observe };

  clock();
  menu();
  cursorReadout();
  segs();
  $$("[data-glitch]").forEach(glitch);
  $$("[data-year]").forEach(n => { n.textContent = new Date().getFullYear(); });
  observe($$("[data-scramble], [data-reveal]"));
})();

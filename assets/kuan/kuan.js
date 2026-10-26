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
    btn.addEventListener("click", () => set(panel.hidden));
    panel.addEventListener("click", e => { if (e.target.closest("a")) set(false); });
    addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) set(false); });
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

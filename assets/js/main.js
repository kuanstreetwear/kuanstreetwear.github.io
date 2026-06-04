/* KUAN STREETWEAR — interactions (minimal, editorial) */
(function () {
  "use strict";

  // Mobile nav
  var burger = document.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Subtle scroll reveal
  var els = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("vis"); });
  }

  // Year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Copy-to-clipboard for email links marked data-copy
  document.querySelectorAll("[data-copy]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var text = el.getAttribute("data-copy");
      if (navigator.clipboard && text) {
        e.preventDefault();
        navigator.clipboard.writeText(text).then(function () {
          var prev = el.getAttribute("data-label-was") || el.querySelector(".v") && el.querySelector(".v").textContent;
          var v = el.querySelector(".v");
          if (v) { var orig = v.textContent; v.textContent = "copied ✓"; setTimeout(function () { v.textContent = orig; }, 1400); }
        });
      }
    });
  });
})();

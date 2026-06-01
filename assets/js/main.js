/* KUAN — interactions: mobile nav, scroll reveal, year, marquee duplication */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
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

  /* ---- Hide nav on scroll down, show on scroll up ---- */
  var nav = document.querySelector(".nav");
  var lastY = window.scrollY;
  if (nav) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (document.body.classList.contains("menu-open")) return;
      if (y > lastY && y > 200) nav.style.transform = "translateY(-100%)";
      else nav.style.transform = "translateY(0)";
      lastY = y;
    }, { passive: true });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Duplicate marquee content for seamless loop ---- */
  document.querySelectorAll(".marquee__track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ---- Current year in footers ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Contact form (no backend yet) ---- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector("[data-form-note]");
      if (note) note.textContent = "// SIGNAL RECEIVED — we'll be in touch.";
      form.reset();
    });
  }
})();

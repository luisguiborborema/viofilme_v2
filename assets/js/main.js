/* ============================================================
   VIOFILME — main.js
   GSAP + ScrollTrigger + Lenis (smooth scroll)
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";

  if (hasGSAP && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- tiny helpers ---------- */
  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const lerp = (a, b, n) => (1 - n) * a + n * b;

  /* =========================================================
     1. LENIS — smooth scroll
     ========================================================= */
  let lenis = null;
  function initSmoothScroll() {
    if (prefersReduced || isTouch || typeof window.Lenis === "undefined") return;
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", () => { if (hasGSAP) ScrollTrigger.update(); });
    if (hasGSAP) {
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* anchor links → smooth scroll via lenis (or native) */
  function initAnchors() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        closeMobileMenu();
        const header = $("#header");
        const offset = (header ? header.offsetHeight : 70) + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        if (lenis) lenis.scrollTo(top, { duration: 1.2 });
        else window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
      });
    });
  }

  /* =========================================================
     2. LOADER
     ========================================================= */
  function initLoader() {
    const loader = $("#loader");
    if (!loader) return Promise.resolve();
    if (prefersReduced || !hasGSAP) { loader.style.display = "none"; return Promise.resolve(); }

    const bar = $("#loaderProgress");
    const count = $("#loaderCount");
    const mark = $("#loaderMark");

    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });
      tl.to(mark, { opacity: 1, duration: 0.5, ease: "power2.out" })
        .to({ p: 0 }, {
          p: 100, duration: 1.15, ease: "power2.inOut",
          onUpdate: function () {
            const v = Math.round(this.targets()[0].p);
            if (bar) bar.style.width = v + "%";
            if (count) count.textContent = v;
          },
        }, "<0.1")
        .to(mark, { y: -8, scale: 0.9, opacity: 0, duration: 0.4, ease: "power2.in" }, "+=0.05")
        .to(loader, {
          yPercent: -100, duration: 0.8, ease: "expo.inOut",
          onComplete: () => (loader.style.display = "none"),
        }, "-=0.1");
    });
  }

  /* =========================================================
     3. HERO intro
     ========================================================= */
  function initHero() {
    if (!hasGSAP) return;

    if (prefersReduced) {
      gsap.set([".hero__eyebrow", ".hero__lead", ".hero__actions"], { clearProps: "all", opacity: 1, y: 0 });
      gsap.set(".hero__title .line__inner", { clearProps: "all", yPercent: 0 });
      return;
    }

    // GSAP owns the start states (overrides the CSS anti-FOUC values)
    gsap.set(".hero__title .line__inner", { yPercent: 110 });
    gsap.set([".hero__eyebrow", ".hero__lead", ".hero__actions"], { opacity: 0, y: 30 });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(".hero__eyebrow", { opacity: 1, y: 0, duration: 0.8 }, 0.1)
      .to(".hero__title .line__inner", { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.2)
      .to(".hero__lead", { opacity: 1, y: 0, duration: 0.9 }, 0.6)
      .to(".hero__actions", { opacity: 1, y: 0, duration: 0.9 }, 0.75);

    // floating + parallax hero mark
    const icon = $("#heroIcon");
    if (icon) {
      gsap.fromTo(icon,
        { opacity: 0, scale: 0.8, rotate: -8 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: "expo.out", delay: 0.4 });
      gsap.to(icon, { y: 18, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.6 });
      gsap.to(icon, {
        yPercent: 24, rotate: 10, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }

    // grid / glow subtle parallax
    gsap.to(".hero__grid", {
      yPercent: 14, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  }

  /* =========================================================
     4. SCROLL REVEALS
     ========================================================= */
  function initReveals() {
    if (!hasGSAP) return;

    if (prefersReduced) {
      gsap.set(".reveal-up", { opacity: 1, y: 0 });
      return;
    }

    // generic .reveal-up (batched for perf)
    ScrollTrigger.batch(".reveal-up", {
      start: "top 88%",
      onEnter: (els) => gsap.to(els, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", overwrite: true,
      }),
    });

    // headline line-mask reveals
    $$(".reveal-lines").forEach((el) => {
      const lines = splitToLines(el);
      gsap.from(lines, {
        yPercent: 115,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });

    // service rows slide in
    gsap.utils.toArray(".service").forEach((row) => {
      gsap.from(row, {
        opacity: 0, y: 50, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 90%" },
      });
    });

    // product / pillar cards
    ScrollTrigger.batch(".card, .pillar", {
      start: "top 90%",
      onEnter: (els) => gsap.from(els, {
        opacity: 0, y: 46, scale: 0.97, duration: 0.8, stagger: 0.07, ease: "power3.out", overwrite: true,
      }),
    });

    // method steps
    gsap.utils.toArray(".step").forEach((step) => {
      gsap.from(step, {
        opacity: 0, y: 40, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: step, start: "top 88%" },
      });
    });
  }

  /* wrap each line of an element's text into an overflow-hidden mask
     so it can rise into view. Falls back gracefully. */
  function splitToLines(el) {
    // Treat each block child (.line already exists in hero) — for section titles,
    // we split by the explicit <em> and text nodes, wrapping in masked spans.
    const masks = [];
    const nodes = Array.from(el.childNodes);
    el.textContent = "";
    nodes.forEach((node) => {
      const text = node.textContent.trim();
      if (!text) return;
      const isEm = node.nodeType === 1 && node.tagName === "EM";
      const mask = document.createElement("span");
      mask.className = "line-mask";
      mask.style.display = "block";
      mask.style.overflow = "hidden";
      const inner = document.createElement(isEm ? "em" : "span");
      inner.style.display = "block";
      inner.textContent = text;
      if (isEm) inner.style.fontStyle = "normal";
      mask.appendChild(inner);
      el.appendChild(mask);
      masks.push(inner);
    });
    return masks;
  }

  /* =========================================================
     5. COUNTERS
     ========================================================= */
  function initCounters() {
    $$("[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const render = (v) => {
        el.textContent = prefix + v.toFixed(decimals).replace(".", ",") + suffix;
      };

      if (prefersReduced || !hasGSAP) { render(target); return; }

      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => gsap.to(obj, {
          v: target, duration: 1.6, ease: "power2.out", onUpdate: () => render(obj.v),
        }),
      });
    });
  }

  /* =========================================================
     6. MARQUEE (infinite)
     ========================================================= */
  function initMarquee() {
    const track = $(".marquee__track");
    if (!track || !hasGSAP || prefersReduced) return;
    // duplicate-aware: content is already doubled in markup
    const total = track.scrollWidth / 2;
    gsap.to(track, {
      x: -total, duration: 22, ease: "none", repeat: -1,
      modifiers: { x: gsap.utils.unitize((x) => parseFloat(x) % total) },
    });
  }

  /* =========================================================
     7. HEADER state (scrolled / hide on scroll down)
     ========================================================= */
  function initHeader() {
    const header = $("#header");
    if (!header) return;
    let last = 0;
    const update = (y) => {
      header.classList.toggle("is-scrolled", y > 40);
      if (y > last && y > 400) header.classList.add("is-hidden");
      else header.classList.remove("is-hidden");
      last = y;
    };
    if (lenis) lenis.on("scroll", ({ scroll }) => update(scroll));
    else window.addEventListener("scroll", () => update(window.scrollY), { passive: true });

    // scroll progress bar
    const prog = $("#scrollProgress");
    if (prog && hasGSAP) {
      gsap.to(prog, {
        scaleX: 1, ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
      });
    }
  }

  /* =========================================================
     8. MOBILE MENU
     ========================================================= */
  function initMobileMenu() {
    const toggle = $("#navToggle");
    const menu = $("#mobileMenu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    });
  }
  function closeMobileMenu() {
    const toggle = $("#navToggle");
    const menu = $("#mobileMenu");
    if (!menu || !menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    if (toggle) { toggle.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* =========================================================
     9. CUSTOM CURSOR + MAGNETIC + TILT (desktop only)
     ========================================================= */
  function initCursor() {
    if (isTouch || prefersReduced) return;
    const cursor = $("#cursor");
    const label = $(".cursor__label", cursor);
    if (!cursor) return;
    cursor.classList.add("is-active");

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });

    const render = () => {
      cx = lerp(cx, mx, 0.18);
      cy = lerp(cy, my, 0.18);
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    // hover states
    const hoverables = $$('a, button, [data-tilt], .service, [data-cursor]');
    hoverables.forEach((el) => {
      const text = el.getAttribute("data-cursor");
      el.addEventListener("mouseenter", () => {
        if (text) { cursor.classList.add("is-label"); if (label) label.textContent = text; }
        else cursor.classList.add("is-hover");
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-hover", "is-label");
        if (label) label.textContent = "";
      });
    });
  }

  function initMagnetic() {
    if (isTouch || prefersReduced || !hasGSAP) return;
    $$(".btn").forEach((btn) => {
      const strength = 0.35;
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.4, ease: "power3.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  function initTilt() {
    if (isTouch || prefersReduced || !hasGSAP) return;
    $$("[data-tilt]").forEach((card) => {
      const max = 6;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        gsap.to(card, {
          rotateY: (px - 0.5) * max * 2,
          rotateX: (0.5 - py) * max * 2,
          transformPerspective: 800, transformOrigin: "center",
          duration: 0.5, ease: "power2.out",
        });
        // spotlight position for cards with ::before
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" });
      });
    });
  }

  /* =========================================================
     10. ACTIVE NAV LINK (IntersectionObserver)
     ========================================================= */
  function initActiveNav() {
    const links = $$(".nav__link");
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map = new Map();
    links.forEach((link) => {
      const id = link.getAttribute("href");
      const sec = id && id.length > 1 ? document.querySelector(id) : null;
      if (sec) map.set(sec, link);
    });
    if (!map.size) return;

    const setActive = (link) => {
      links.forEach((l) => l.classList.toggle("is-active", l === link));
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(map.get(entry.target));
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    map.forEach((_, sec) => io.observe(sec));
  }

  /* =========================================================
     11. HERO BACKGROUND VIDEO (lazy, desktop only, graceful)
     ========================================================= */
  function initHeroVideo() {
    const video = $("#heroVideo");
    if (!video) return;
    // Desktop only + respeita data-saver e reduced motion
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (narrow || isTouch || prefersReduced || saveData) return;

    const src = video.getAttribute("data-src");
    if (!src) return;

    const load = () => {
      video.src = src;
      video.addEventListener("canplay", () => {
        video.classList.add("is-playing");
        const p = video.play();
        if (p && p.catch) p.catch(() => {});
      }, { once: true });
      // Se o arquivo não existir / falhar, mantém o fundo animado atual.
      video.addEventListener("error", () => video.removeAttribute("src"), { once: true });
    };
    if (document.readyState === "complete") load();
    else window.addEventListener("load", load, { once: true });
  }

  /* =========================================================
     12. LEAD FORM (validação + estados + envio)
     ========================================================= */
  function initLeadForm() {
    const form = $("#leadForm");
    if (!form) return;
    const submitBtn = $("#leadSubmit");
    const formError = $("#leadFormError");
    const success = $("#leadSuccess");

    const required = $$("input[required], select[required]", form);

    const validators = {
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      whatsapp: (v) => (v.replace(/\D/g, "").length >= 10),
    };
    const messages = {
      empty: "Campo obrigatório.",
      email: "Digite um e-mail válido.",
      whatsapp: "Digite um WhatsApp válido com DDD.",
    };

    const fieldOf = (input) => input.closest(".field");
    const setError = (input, msg) => {
      const field = fieldOf(input);
      if (!field) return;
      field.classList.toggle("is-invalid", !!msg);
      const slot = $(".field__error", field);
      if (slot) slot.textContent = msg || "";
    };
    const validate = (input) => {
      const v = input.value.trim();
      if (!v) { setError(input, messages.empty); return false; }
      if (validators[input.name] && !validators[input.name](v)) {
        setError(input, messages[input.name]); return false;
      }
      setError(input, ""); return true;
    };

    // máscara leve de telefone (BR)
    const phone = $("#lf-whats");
    if (phone) {
      phone.addEventListener("input", () => {
        let d = phone.value.replace(/\D/g, "").slice(0, 11);
        if (d.length > 6) phone.value = `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
        else if (d.length > 2) phone.value = `(${d.slice(0,2)}) ${d.slice(2)}`;
        else if (d.length > 0) phone.value = `(${d}`;
      });
    }

    required.forEach((input) => {
      input.addEventListener("blur", () => validate(input));
      input.addEventListener("input", () => {
        if (fieldOf(input) && fieldOf(input).classList.contains("is-invalid")) validate(input);
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (formError) { formError.hidden = true; formError.textContent = ""; }

      let ok = true;
      required.forEach((input) => { if (!validate(input)) ok = false; });
      if (!ok) {
        const firstBad = $(".field.is-invalid input, .field.is-invalid select", form);
        if (firstBad) firstBad.focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      data.origem = "site viofilme";
      data.pagina = location.href;

      const endpoint = (form.getAttribute("data-endpoint") || "").trim();
      if (submitBtn) submitBtn.classList.add("is-loading");

      try {
        if (endpoint) {
          // Envia para webhook (Make/Zapier → Pipedrive + RD Station).
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("bad status " + res.status);
          showSuccess();
        } else {
          // Sem endpoint configurado ainda: fallback por e-mail (lead não se perde).
          mailtoFallback(data);
          showSuccess();
        }
      } catch (err) {
        if (submitBtn) submitBtn.classList.remove("is-loading");
        if (formError) {
          formError.hidden = false;
          formError.innerHTML = 'Não foi possível enviar agora. Tente de novo ou fale direto: ' +
            '<a href="mailto:contato@viofilme.com.br">contato@viofilme.com.br</a>.';
        }
      }
    });

    function showSuccess() {
      if (submitBtn) submitBtn.classList.remove("is-loading");
      form.hidden = true;
      if (success) {
        success.hidden = false;
        if (hasGSAP && !prefersReduced) {
          gsap.from(success, { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" });
        }
        success.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
      }
    }

    function mailtoFallback(data) {
      const subject = encodeURIComponent("Agendamento de diagnóstico — " + (data.empresa || data.nome || ""));
      const body = encodeURIComponent(
        `Nome: ${data.nome}\nE-mail: ${data.email}\nWhatsApp: ${data.whatsapp}\n` +
        `Empresa: ${data.empresa}\nFaturamento: ${data.faturamento}\nSegmento: ${data.segmento}\n` +
        `Desafio: ${data.desafio || "-"}\n`
      );
      // abre o cliente de e-mail sem trocar de página (mantém o estado de sucesso)
      const a = document.createElement("a");
      a.href = `mailto:contato@viofilme.com.br?subject=${subject}&body=${body}`;
      a.target = "_blank";
      document.body.appendChild(a); a.click(); a.remove();
    }
  }

  /* =========================================================
     13. MISC
     ========================================================= */
  function initYear() {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* =========================================================
     BOOT
     ========================================================= */
  function boot() {
    // Fallback: if GSAP failed to load, drop all JS-gated hidden states
    // so every section is visible (no animations, but full content).
    if (!hasGSAP) {
      document.documentElement.classList.remove("js");
      const loader = $("#loader");
      if (loader) loader.style.display = "none";
    }

    initYear();
    initSmoothScroll();
    initAnchors();
    initMobileMenu();
    initHeader();
    initActiveNav();
    initHeroVideo();
    initLeadForm();
    initCursor();
    initMagnetic();
    initTilt();
    initMarquee();
    initCounters();

    initLoader().then(() => {
      initHero();
      initReveals();
      if (hasGSAP) ScrollTrigger.refresh();
    });

    // safety: reveal everything if something goes wrong with the loader
    setTimeout(() => {
      if (hasGSAP) ScrollTrigger.refresh();
    }, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("load", () => { if (hasGSAP) ScrollTrigger.refresh(); });
})();

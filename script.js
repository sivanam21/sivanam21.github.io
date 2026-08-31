/* Sivan Amram — portfolio interactions */

(function () {
  'use strict';

  /* ── Language toggle ─────────────────────────────── */
  const html = document.documentElement;
  const btn = document.getElementById('langBtn');

  function applyLang(lang) {
    html.lang = lang;
    html.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-he][data-en]').forEach(el => {
      el.textContent = el.dataset[lang];
    });
    document.title = lang === 'he'
      ? 'סיון עמרם — מעצבת למידה דיגיטלית'
      : 'Sivan Amram — Instructional Designer';
    try { localStorage.setItem('sa_lang', lang); } catch (e) { /* private mode */ }
  }

  /* ?lang=en opens the site in English — handy for sharing one link
     with an international reader. Otherwise the last choice wins. */
  const asked = new URLSearchParams(location.search).get('lang');
  let start = asked === 'en' || asked === 'he' ? asked : null;
  if (!start) {
    try { start = localStorage.getItem('sa_lang'); } catch (e) { /* private mode */ }
  }
  applyLang(start === 'en' ? 'en' : 'he');

  btn.addEventListener('click', () => {
    applyLang(html.lang === 'he' ? 'en' : 'he');
  });

  /* ── Sticky nav hairline ─────────────────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── One-line draw-in ────────────────────────────── */
  /* Each stroked path is measured, then revealed by animating its
     dash offset from full length to zero, so the line appears to be
     drawn by hand in a single stroke. */
  /* Visibility is measured from each path's own box rather than with an
     observer, so the same code path covers SVG geometry elements. */
  let strokes = [...document.querySelectorAll('.draw')];
  strokes.forEach(p => p.style.setProperty('--len', Math.ceil(p.getTotalLength())));

  function drawVisible() {
    if (!strokes.length) return;
    const vh = window.innerHeight;
    strokes = strokes.filter(p => {
      const box = p.getBoundingClientRect();
      if (box.top > vh * 0.92 || box.bottom < 0) return true;   // not yet in view
      p.classList.add('drawn');
      return false;
    });
    if (!strokes.length) window.removeEventListener('scroll', drawVisible);
  }

  requestAnimationFrame(drawVisible);
  window.addEventListener('scroll', drawVisible, { passive: true });

  /* ── Reveal on scroll ────────────────────────────── */
  const targets = document.querySelectorAll('.case, .sec-head, .skill-card, .timeline li, .edu, .about-text');
  if ('IntersectionObserver' in window) {
    targets.forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(el => io.observe(el));
  }

  /* ── Year ────────────────────────────────────────── */
  document.getElementById('year').textContent = new Date().getFullYear();
})();

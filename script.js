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

  let saved = 'he';
  try { saved = localStorage.getItem('sa_lang') || 'he'; } catch (e) { /* ignore */ }
  applyLang(saved);

  btn.addEventListener('click', () => {
    applyLang(html.lang === 'he' ? 'en' : 'he');
  });

  /* ── Sticky nav shadow ───────────────────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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

/**
 * GNANMANDIR GURUKUL — WEBSITE SCRIPT
 * - Sticky navbar on scroll
 * - Active nav link highlighting
 * - Scroll reveal animations
 * - Mobile hamburger menu
 * - Smooth scroll
 */

(function () {
  'use strict';

  // ── NAVBAR SCROLL ─────────────────────────────
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run on load

  // ── ACTIVE NAV LINK ───────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = '';
    const offset = 120;

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - offset) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      if (href === current) link.classList.add('active');
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ── SCROLL REVEAL ─────────────────────────────
  const revealEls = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── HAMBURGER MENU ────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── ACTIVE LINK STYLE ─────────────────────────
  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: var(--gold) !important; }`;
  document.head.appendChild(style);

})();

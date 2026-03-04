/**
 * GNANMANDIR GURUKUL — PRESENTATION SCRIPT
 * Slide navigation, keyboard support, progress, dots
 */

(function () {
  'use strict';

  // ── STATE ──────────────────────────────────
  const slides      = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let   current     = 0;
  let   isAnimating = false;
  let   hintTimer;

  // ── ELEMENTS ───────────────────────────────
  const progressBar   = document.getElementById('progressBar');
  const currentLabel  = document.getElementById('currentSlide');
  const totalLabel    = document.getElementById('totalSlides');
  const prevBtn       = document.getElementById('prevBtn');
  const nextBtn       = document.getElementById('nextBtn');
  const navDotsWrap   = document.getElementById('navDots');
  const keyHint       = document.getElementById('keyHint');

  // ── INIT ───────────────────────────────────
  function init() {
    totalLabel.textContent = totalSlides;

    // Build nav dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      navDotsWrap.appendChild(dot);
    });

    updateUI();
    showKeyHint();
  }

  // ── NAVIGATION ─────────────────────────────
  function goTo(index, dir = null) {
    if (isAnimating || index === current || index < 0 || index >= totalSlides) return;

    isAnimating = true;
    const direction = dir !== null ? dir : (index > current ? 'next' : 'prev');
    const prev      = current;
    current         = index;

    const leaving  = slides[prev];
    const entering = slides[current];

    // Remove active, apply exit
    leaving.classList.remove('active');
    leaving.classList.add('exit-left');

    // Small delay so CSS transition plays
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        entering.classList.add('active');

        // Clean up after transition
        setTimeout(() => {
          leaving.classList.remove('exit-left');
          isAnimating = false;
        }, 700);
      });
    });

    updateUI();
  }

  function next() { goTo(current + 1, 'next'); }
  function prev() { goTo(current - 1, 'prev'); }

  // ── UPDATE UI ──────────────────────────────
  function updateUI() {
    // Progress bar
    const pct = ((current + 1) / totalSlides) * 100;
    progressBar.style.width = pct + '%';

    // Slide counter
    currentLabel.textContent = current + 1;

    // Nav dots
    navDotsWrap.querySelectorAll('.nav-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

    // Arrows
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === totalSlides - 1;
  }

  // ── KEYBOARD HINT ──────────────────────────
  function showKeyHint() {
    keyHint.classList.remove('hidden');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => keyHint.classList.add('hidden'), 4000);
  }

  // ── EVENTS ─────────────────────────────────
  // Buttons
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Keyboard
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        goTo(0);
        break;
      case 'End':
        e.preventDefault();
        goTo(totalSlides - 1);
        break;
    }
  });

  // Touch / swipe support
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only horizontal swipes
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) next();
      else        prev();
    }
  }, { passive: true });

  // Mouse wheel (debounced)
  let wheelCooldown = false;
  document.addEventListener('wheel', (e) => {
    if (wheelCooldown) return;
    wheelCooldown = true;
    if (e.deltaY > 30)       next();
    else if (e.deltaY < -30) prev();
    setTimeout(() => { wheelCooldown = false; }, 900);
  }, { passive: true });

  // ── PRESENTATION MODE ──────────────────────
  // Double-click to enter fullscreen
  document.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // ── SLIDE TIMING HINT ──────────────────────
  // Show key hint whenever user is idle on same slide for 8s
  let idleTimer;
  function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (current < totalSlides - 1) showKeyHint();
    }, 8000);
  }
  document.addEventListener('mousemove', resetIdle, { passive: true });
  document.addEventListener('keydown',   resetIdle, { passive: true });

  // ── START ──────────────────────────────────
  init();

})();

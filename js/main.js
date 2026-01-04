// js/main.js (Improved with smoother animations and reduced motion checks)
/* =========================================================
   IT NANBARGAL — MAIN JS (ELITE REFINED)
   Role: Bootstrap + Orchestration
   Philosophy:
   - Deterministic
   - Fail-safe
   - Accessibility-first
   - No side effects
   - Enhanced smoothness
   ========================================================= */
import { initScrollEngine } from './core/scroll-engine.js';
import { initScrollVelocity } from './core/velocity.js';
import { initSectionLock } from './core/section-lock.js';
import { initRevealText } from './components/reveal-text.js';
import { initMagneticCards } from './components/magnetic-cards.js';
import { initDepthCards } from './components/depth-cards.js';
import { initEdgeLight } from './components/edge-light.js';
import { initCTABreathing } from './components/cta-breathing.js';

/* -------------------------
   SAFE INIT WRAPPER
-------------------------- */
function safeInit(initFn, options) {
  try {
    if (typeof initFn === 'function') {
      initFn(options);
    }
  } catch (error) {
    console.warn(
      `[IT Nanbargal] Init failed: ${initFn?.name || 'unknown'}`,
      error
    );
  }
}

/* -------------------------
   DOM READY
-------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------
     ACCESSIBILITY FIRST
  -------------------------- */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const initOptions = Object.freeze({
    reducedMotion: prefersReducedMotion,
  });

  /* -------------------------
     CORE SYSTEMS
     (Order matters)
  -------------------------- */
  safeInit(initScrollEngine, initOptions);
  safeInit(initScrollVelocity, initOptions);
  safeInit(initSectionLock, initOptions);

  /* -------------------------
     COMPONENT SYSTEMS
  -------------------------- */
  safeInit(initRevealText, initOptions);
  safeInit(initMagneticCards, initOptions);
  safeInit(initDepthCards, initOptions);
  safeInit(initEdgeLight, initOptions);
  safeInit(initCTABreathing, initOptions);

  /* -------------------------
     CTA → PLAY STORE
     (Intent-protected with improved feedback)
  -------------------------- */
  const installBtn = document.getElementById('install-btn');
  if (installBtn) {
    let redirectLocked = false;
    installBtn.addEventListener('click', () => {
      if (redirectLocked) return;
      redirectLocked = true;
      installBtn.classList.add('is-pressed');
      // Enhanced human-feel delay with vibration on mobile
      if ('vibrate' in navigator) navigator.vibrate(50);
      setTimeout(() => {
        window.location.href =
          'https://play.google.com/store/apps/details?id=com.srivarsan.itnanbargal';
      }, 180);
    });
  }
});
// ================= SWIPE DOWN HINT DISABLE =================

const scrollHint = document.getElementById('scrollHint');

if (scrollHint) {
  const hideScrollHint = () => {
    scrollHint.classList.add('hide');
    window.removeEventListener('scroll', onFirstScroll);
  };

  const onFirstScroll = () => {
    if (window.scrollY > 20) {
      hideScrollHint();
    }
  };

  window.addEventListener('scroll', onFirstScroll, { passive: true });
}

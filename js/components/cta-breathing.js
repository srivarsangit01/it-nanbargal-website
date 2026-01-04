// js/components/cta-breathing.js (Improved with softer animation)
/* =========================================================
   IT NANBARGAL — CTA BREATHING
   Purpose:
   - Subtle idle breathing animation
   - Gains confidence as user scrolls
   - Deep press feedback handled elsewhere
   ========================================================= */
let cta = null;
let breathingEnabled = false;
const START_BREATH_SCROLL = 0.3; // Start earlier
const STOP_BREATH_SCROLL = 0.85; // Stop later

export function initCTABreathing({ reducedMotion = false } = {}) {
  if (reducedMotion) return;
  cta = document.getElementById('install-btn');
  if (!cta) return;
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* -------------------------
   SCROLL HANDLER
-------------------------- */
function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return;
  const progress = scrollTop / docHeight;
  if (progress > START_BREATH_SCROLL && progress < STOP_BREATH_SCROLL) {
    enableBreathing();
  } else {
    disableBreathing();
  }
}

/* -------------------------
   BREATHING TOGGLE
-------------------------- */
function enableBreathing() {
  if (breathingEnabled) return;
  breathingEnabled = true;
  cta.classList.add('is-breathing');
}
function disableBreathing() {
  if (!breathingEnabled) return;
  breathingEnabled = false;
  cta.classList.remove('is-breathing');
}

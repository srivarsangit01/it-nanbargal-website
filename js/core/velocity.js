// js/core/velocity.js (Improved with better thresholds for smoothness)
/* =========================================================
   IT NANBARGAL — SCROLL VELOCITY ENGINE (REFINED)
   Purpose:
   - Detect scroll speed
   - Classify user intent (fast / slow)
   - Stabilize state (no flicker)
   - Expose intent via body classes
   ========================================================= */
let lastScrollY = window.scrollY;
let lastTime = performance.now();
let velocity = 0;
let ticking = false;
let currentState = null; // 'fast' | 'slow' | null
// Tuned for smoother human behavior
const FAST_SCROLL_THRESHOLD = 1.0; // px/ms (slightly lowered for sensitivity)
const SLOW_SCROLL_THRESHOLD = 0.18; // px/ms (adjusted for calm scrolling)
const STATE_COOLDOWN = 100; // ms (reduced for quicker response)
let lastStateChange = 0;

export function initScrollVelocity({ reducedMotion = false } = {}) {
  if (reducedMotion) return;
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* -------------------------
   SCROLL HANDLER (RAF)
-------------------------- */
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      calculateVelocity();
      ticking = false;
    });
    ticking = true;
  }
}

/* -------------------------
   VELOCITY CALCULATION
-------------------------- */
function calculateVelocity() {
  const currentScrollY = window.scrollY;
  const currentTime = performance.now();
  const deltaY = Math.abs(currentScrollY - lastScrollY);
  const deltaTime = currentTime - lastTime || 16;
  velocity = deltaY / deltaTime;
  updateScrollState(velocity, currentTime);
  lastScrollY = currentScrollY;
  lastTime = currentTime;
}

/* -------------------------
   STATE CLASSIFICATION (STABLE)
-------------------------- */
function updateScrollState(speed, now) {
  const body = document.body;
  if (now - lastStateChange < STATE_COOLDOWN) return;
  if (speed > FAST_SCROLL_THRESHOLD && currentState !== 'fast') {
    body.classList.remove('slow-scroll');
    body.classList.add('fast-scroll');
    currentState = 'fast';
    lastStateChange = now;
    return;
  }
  if (speed < SLOW_SCROLL_THRESHOLD && currentState !== 'slow') {
    body.classList.remove('fast-scroll');
    body.classList.add('slow-scroll');
    currentState = 'slow';
    lastStateChange = now;
    return;
  }
  if (
    speed >= SLOW_SCROLL_THRESHOLD &&
    speed <= FAST_SCROLL_THRESHOLD &&
    currentState !== null
  ) {
    body.classList.remove('fast-scroll', 'slow-scroll');
    currentState = null;
    lastStateChange = now;
  }
}

// js/core/section-lock.js (Improved with softer lock times)
/* =========================================================
   IT NANBARGAL — SECTION LOCK ENGINE (REFINED)
   Purpose:
   - Briefly hold attention on important text
   - Encourage reading, never force it
   - One-time, respectful, escape-safe
   ========================================================= */
let lockZones = [];
let viewportHeight = window.innerHeight;
let ticking = false;

const LOCK_VIEWPORT_RATIO = 0.42; // Adjusted for better visual center
const UNLOCK_SCROLL_DISTANCE = 100; // px (softer unlock)
const MAX_LOCK_TIME = 1100; // ms (reduced for quicker flow)
const LOCK_COOLDOWN = 700; // ms between locks
let lastLockTime = 0;

export function initSectionLock({ reducedMotion = false } = {}) {
  if (reducedMotion) return;
  lockZones = Array.from(document.querySelectorAll('.lock-zone'));
  if (!lockZones.length) return;
  viewportHeight = window.innerHeight;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
}

/* -------------------------
   SCROLL HANDLER (RAF SAFE)
-------------------------- */
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      evaluateLocks();
      ticking = false;
    });
    ticking = true;
  }
}

/* -------------------------
   RESIZE HANDLER
-------------------------- */
function onResize() {
  viewportHeight = window.innerHeight;
}

/* -------------------------
   LOCK EVALUATION
-------------------------- */
function evaluateLocks() {
  const now = performance.now();
  if (now - lastLockTime < LOCK_COOLDOWN) return;
  lockZones.forEach((zone) => {
    if (zone.dataset.locked === 'true') return;
    const rect = zone.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > viewportHeight) return;
    const zoneCenter = rect.top + rect.height / 2;
    const targetCenter = viewportHeight * LOCK_VIEWPORT_RATIO;
    const withinFocusBand =
      Math.abs(zoneCenter - targetCenter) < rect.height * 0.2; // Tighter band
    if (withinFocusBand) {
      applyLock(zone);
      lastLockTime = now;
    }
  });
}

/* -------------------------
   APPLY LOCK (NON-BLOCKING)
-------------------------- */
function applyLock(zone) {
  zone.dataset.locked = 'true';
  zone.classList.add('is-locked');
  const startScroll = window.scrollY;
  const startTime = performance.now();
  function monitorUnlock() {
    const scrolled =
      Math.abs(window.scrollY - startScroll) > UNLOCK_SCROLL_DISTANCE;
    const timedOut = performance.now() - startTime > MAX_LOCK_TIME;
    if (scrolled || timedOut) {
      releaseLock(zone);
      return;
    }
    requestAnimationFrame(monitorUnlock);
  }
  requestAnimationFrame(monitorUnlock);
}

/* -------------------------
   RELEASE LOCK (ONE-TIME)
-------------------------- */
function releaseLock(zone) {
  zone.classList.remove('is-locked');
}

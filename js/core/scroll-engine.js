// js/core/scroll-engine.js (Improved with better ratios for mobile)
/* =========================================================
   IT NANBARGAL — SCROLL ENGINE (REFINED)
   Purpose:
   - Scroll-as-Timeline
   - Section activation with intent bias
   - Progress indicator
   - Stable foundation for pin / lock / shock systems
   ========================================================= */
let sections = [];
let viewportHeight = window.innerHeight;
let ticking = false;

const ENTER_RATIO = 0.65; // Adjusted for mobile visibility
const EXIT_RATIO = 0.25; // Adjusted for smoother transitions

export function initScrollEngine({ reducedMotion = false } = {}) {
  sections = Array.from(document.querySelectorAll('[data-section]'));
  if (!sections.length) return;
  viewportHeight = window.innerHeight;
  updateScrollState();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
}

/* -------------------------
   SCROLL HANDLER (RAF SAFE)
-------------------------- */
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollState();
      ticking = false;
    });
    ticking = true;
  }
}

/* -------------------------
   RESIZE HANDLER (STABLE)
-------------------------- */
function onResize() {
  viewportHeight = window.innerHeight;
  requestAnimationFrame(updateScrollState);
}

/* -------------------------
   CORE SCROLL LOGIC
-------------------------- */
function updateScrollState() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - viewportHeight;
  updateProgress(scrollTop, docHeight);
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > viewportHeight) return;
    const enterPoint = viewportHeight * ENTER_RATIO;
    const exitPoint = viewportHeight * EXIT_RATIO;
    const shouldActivate = rect.top < enterPoint && rect.bottom > exitPoint;
    toggleSection(section, shouldActivate);
  });
}

/* -------------------------
   SECTION STATE HANDLER
-------------------------- */
function toggleSection(section, activate) {
  if (activate) {
    if (!section.classList.contains('is-active')) {
      section.classList.add('is-active');
    }
  } else {
    if (section.classList.contains('is-active')) {
      section.classList.remove('is-active');
    }
  }
}

/* -------------------------
   SCROLL PROGRESS BAR
-------------------------- */
function updateProgress(scrollTop, docHeight) {
  const progressEl = document.getElementById('scroll-progress');
  if (!progressEl) return;
  if (docHeight <= 0) {
    progressEl.style.width = '0%';
    return;
  }
  const progress = Math.min(scrollTop / docHeight, 1);
  progressEl.style.width = `${progress * 100}%`;
}

// js/components/reveal-text.js (Improved with softer blur)
/* =========================================================
   IT NANBARGAL — REVEAL TEXT
   Purpose:
   - Mask-reveal text on first view
   - Animate only once (respectful UX)
   - Works with scroll-as-timeline
   ========================================================= */
let revealItems = [];
let observer = null;

export function initRevealText({ reducedMotion = false } = {}) {
  revealItems = Array.from(document.querySelectorAll('.reveal-text'));
  if (!revealItems.length) return;
  if (reducedMotion) {
    revealItems.forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }
  observer = new IntersectionObserver(onIntersect, {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Adjusted for earlier trigger
    threshold: 0.1,
  });
  revealItems.forEach((el) => {
    if (el.dataset.revealed === 'true') return;
    observer.observe(el);
  });
}

/* -------------------------
   INTERSECTION HANDLER
-------------------------- */
function onIntersect(entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('is-visible');
    el.dataset.revealed = 'true';
    observer.unobserve(el);
  });
}

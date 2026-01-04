// js/components/edge-light.js (Improved with softer gradient)
/* =========================================================
   IT NANBARGAL — EDGE LIGHT TRACING (ELITE)
   Purpose:
   - Precision cursor-follow glow
   - Per-card RAF control
   - Premium restraint
   ========================================================= */
export function initEdgeLight({ reducedMotion = false } = {}) {
  if (reducedMotion) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }
  const cards = Array.from(document.querySelectorAll('.card'));
  if (!cards.length) return;
  cards.forEach(setupEdgeLight);
}

/* -------------------------
   PER-CARD SETUP
-------------------------- */
function setupEdgeLight(card) {
  let ticking = false;
  let lastX = 50;
  let lastY = 50;
  card.addEventListener('mouseenter', () => {
    card.classList.add('is-hovered');
  });
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    lastX = ((e.clientX - rect.left) / rect.width) * 100;
    lastY = ((e.clientY - rect.top) / rect.height) * 100;
    lastX = clamp(lastX, 10, 90); // Softer clamp
    lastY = clamp(lastY, 10, 90);
    if (!ticking) {
      requestAnimationFrame(() => {
        card.style.setProperty('--x', `${lastX}%`);
        card.style.setProperty('--y', `${lastY}%`);
        ticking = false;
      });
      ticking = true;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.classList.remove('is-hovered');
    card.style.setProperty('--x', '50%');
    card.style.setProperty('--y', '50%');
  });
}

/* -------------------------
   UTILS
-------------------------- */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

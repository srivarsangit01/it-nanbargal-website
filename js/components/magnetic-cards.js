// js/components/magnetic-cards.js (Improved with softer max values)
/* =========================================================
   IT NANBARGAL — MAGNETIC CARDS (ELITE)
   Purpose:
   - Cursor gravity effect
   - Speed-aware tilt
   - RAF throttled
   - Touch & accessibility safe
   ========================================================= */
const MAX_TRANSLATE = 8; // px (softer for premium feel)
const MAX_ROTATE = 4; // deg (reduced for subtlety)
let cards = [];

export function initMagneticCards({ reducedMotion = false } = {}) {
  if (reducedMotion) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }
  cards = Array.from(document.querySelectorAll('.card.magnetic'));
  if (!cards.length) return;
  cards.forEach(setupCard);
}

/* -------------------------
   SETUP PER CARD
-------------------------- */
function setupCard(card) {
  let lastX = 0;
  let lastY = 0;
  let lastTime = performance.now();
  let ticking = false;
  let latestEvent = null;
  card.addEventListener('mouseenter', () => {
    card.classList.add('is-hovered');
  });
  card.addEventListener('mousemove', (e) => {
    latestEvent = e;
    if (!ticking) {
      requestAnimationFrame(() => {
        applyMagnet(latestEvent, card);
        ticking = false;
      });
      ticking = true;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.classList.remove('is-hovered');
    resetCard(card);
  });
  function applyMagnet(e, card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const normX = dx / (rect.width / 2);
    const normY = dy / (rect.height / 2);
    const now = performance.now();
    const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    const deltaTime = now - lastTime || 16;
    const speed = distance / deltaTime;
    const speedFactor = clamp(speed * 0.7, 0.3, 1.1); // Softer factors
    const translateX = clamp(
      normX * MAX_TRANSLATE * speedFactor,
      -MAX_TRANSLATE,
      MAX_TRANSLATE
    );
    const translateY = clamp(
      normY * MAX_TRANSLATE * speedFactor,
      -MAX_TRANSLATE,
      MAX_TRANSLATE
    );
    const rotateX = clamp(-normY * MAX_ROTATE, -MAX_ROTATE, MAX_ROTATE);
    const rotateY = clamp(normX * MAX_ROTATE, -MAX_ROTATE, MAX_ROTATE);
    card.style.transform = `
      translate3d(${translateX}px, ${translateY}px, 0)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;
    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;
  }
}

/* -------------------------
   RESET
-------------------------- */
function resetCard(card) {
  card.style.transform = 'translate3d(0,0,0) rotateX(0deg) rotateY(0deg)';
}

/* -------------------------
   UTILS
-------------------------- */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

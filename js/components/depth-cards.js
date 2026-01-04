// js/components/depth-cards.js (Improved with softer depths)
/* =========================================================
   IT NANBARGAL — DEPTH CARDS
   Purpose:
   - Multi-layer parallax depth inside cards
   - Foreground / mid / back move at different speeds
   - Subtle, controlled, premium
   ========================================================= */
let depthCards = [];
const DEPTH_FRONT = 12; // px (softer)
const DEPTH_MID = 6; // px
const DEPTH_BACK = 3; // px

export function initDepthCards({ reducedMotion = false } = {}) {
  if (reducedMotion) return;
  depthCards = Array.from(document.querySelectorAll('.card.depth-card'));
  if (!depthCards.length) return;
  depthCards.forEach((card) => {
    const layers = prepareLayers(card);
    if (!layers) return;
    card.addEventListener('mousemove', (e) => onMove(e, card, layers));
    card.addEventListener('mouseleave', () => resetLayers(layers));
  });
}

/* -------------------------
   PREPARE CARD LAYERS
   (wrap existing content safely)
-------------------------- */
function prepareLayers(card) {
  if (card.dataset.depthReady === 'true') return null;
  const content = card.innerHTML;
  card.innerHTML = `
    <div class="layer-back"></div>
    <div class="layer-mid">${content}</div>
    <div class="layer-front"></div>
  `;
  card.dataset.depthReady = 'true';
  return {
    front: card.querySelector('.layer-front'),
    mid: card.querySelector('.layer-mid'),
    back: card.querySelector('.layer-back'),
  };
}

/* -------------------------
   MOUSE MOVE → DEPTH SHIFT
-------------------------- */
function onMove(e, card, layers) {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const normX = (x / rect.width) * 2 - 1;
  const normY = (y / rect.height) * 2 - 1;
  layers.front.style.transform = `
    translate3d(${normX * DEPTH_FRONT}px, ${normY * DEPTH_FRONT}px, 0)
  `;
  layers.mid.style.transform = `
    translate3d(${normX * DEPTH_MID}px, ${normY * DEPTH_MID}px, 0)
  `;
  layers.back.style.transform = `
    translate3d(${normX * DEPTH_BACK}px, ${normY * DEPTH_BACK}px, 0)
  `;
}

/* -------------------------
   RESET DEPTH
-------------------------- */
function resetLayers(layers) {
  layers.front.style.transform = 'translate3d(0,0,0)';
  layers.mid.style.transform = 'translate3d(0,0,0)';
  layers.back.style.transform = 'translate3d(0,0,0)';
}

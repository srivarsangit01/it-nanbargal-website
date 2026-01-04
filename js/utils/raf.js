// js/utils/raf.js (Unchanged)
export function startLoop(cb) {
  let id = 0;
  function loop(t) {
    cb(t);
    id = requestAnimationFrame(loop);
  }
  id = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(id);
}

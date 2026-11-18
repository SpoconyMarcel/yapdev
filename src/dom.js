// Calls cb now and whenever the page changes (debounced to one call per frame).
export function watch(cb) {
  let raf = 0;
  const obs = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(cb); });
  obs.observe(document.body, { childList: true, subtree: true });
  cb();
  return () => { obs.disconnect(); cancelAnimationFrame(raf); };
}

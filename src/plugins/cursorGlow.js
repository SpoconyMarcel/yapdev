let el, move;
export default {
  id: "cursorGlow", name: "Cursor Glow", icon: "✨", category: "visual", added: "2026-11-26", version: "0.3.0", enabledByDefault: false,
  description: { en: "A soft glowing aura that follows your mouse.", pl: "Miękka, świecąca poświata podążająca za myszką." },
  options: [
    { key: "color", type: "color", default: "#8b5cf6", label: { en: "Color", pl: "Kolor" } },
    { key: "size", type: "range", min: 80, max: 420, step: 20, unit: "px", default: 220, label: { en: "Size", pl: "Rozmiar" } },
  ],
  start(ctx) {
    const s = Number(ctx.option("size")), c = ctx.option("color");
    el = document.createElement("div");
    el.style.cssText = `position:fixed;left:0;top:0;width:${s}px;height:${s}px;margin:${-s / 2}px 0 0 ${-s / 2}px;border-radius:50%;pointer-events:none;z-index:2147483644;background:radial-gradient(circle,${c}59,transparent 65%);mix-blend-mode:screen;transition:transform .09s linear;will-change:transform;transform:translate(-999px,-999px)`;
    document.body.appendChild(el);
    move = (e) => { el.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; };
    document.addEventListener("mousemove", move, { passive: true });
  },
  stop() { document.removeEventListener("mousemove", move); el?.remove(); },
};

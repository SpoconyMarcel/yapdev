let box, over, out, move;
export default {
  id: "imageZoom", name: "Image Zoom", icon: "🖼️", category: "tools", added: "2026-11-25", version: "0.2.0", enabledByDefault: false,
  description: { en: "Hover an image to see it bigger in a floating preview.", pl: "Najedź na obraz, aby zobaczyć go w większym podglądzie." },
  options: [
    { key: "size", type: "range", min: 30, max: 90, step: 5, unit: "%", default: 60, label: { en: "Preview size", pl: "Rozmiar podglądu" } },
    { key: "needAlt", type: "checkbox", default: true, label: { en: "Only while holding Alt", pl: "Tylko z wciśniętym Alt" } },
  ],
  start(ctx) {
    box = document.createElement("img");
    box.style.cssText = "position:fixed;z-index:2147483645;pointer-events:none;display:none;object-fit:contain;background:#000;border-radius:14px;box-shadow:0 20px 60px #000a";
    document.body.appendChild(box);
    const place = (e) => {
      const w = box.offsetWidth, h = box.offsetHeight;
      let x = e.clientX + 20, y = e.clientY + 20;
      if (x + w > innerWidth) x = e.clientX - w - 20;
      if (y + h > innerHeight) y = innerHeight - h - 10;
      box.style.left = Math.max(10, x) + "px"; box.style.top = Math.max(10, y) + "px";
    };
    over = (e) => {
      const t = e.target;
      if (!t || t.tagName !== "IMG" || t === box || (t.naturalWidth || 0) < 60) return;
      if (ctx.option("needAlt") && !e.altKey) return;
      const s = Number(ctx.option("size"));
      box.src = t.currentSrc || t.src; box.style.maxWidth = s + "vw"; box.style.maxHeight = s + "vh"; box.style.display = "block"; place(e);
    };
    out = (e) => { if (e.target && e.target.tagName === "IMG") box.style.display = "none"; };
    move = (e) => { if (box.style.display === "block") place(e); };
    document.addEventListener("mouseover", over, true);
    document.addEventListener("mouseout", out, true);
    document.addEventListener("mousemove", move, true);
  },
  stop() {
    document.removeEventListener("mouseover", over, true);
    document.removeEventListener("mouseout", out, true);
    document.removeEventListener("mousemove", move, true);
    box?.remove();
  },
};

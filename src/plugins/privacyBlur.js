export default {
  id: "privacyBlur", name: "Privacy Blur", icon: "🫥", category: "privacy", added: "2026-11-24", version: "0.2.0", enabledByDefault: false,
  description: { en: "Blurs images and videos so nobody sees them over your shoulder.", pl: "Rozmywa obrazy i filmy, żeby nikt nie podglądał ci przez ramię." },
  options: [
    { key: "amount", type: "range", min: 4, max: 30, step: 2, unit: "px", default: 14, label: { en: "Blur", pl: "Rozmycie" } },
    { key: "reveal", type: "checkbox", default: true, label: { en: "Reveal on hover", pl: "Odkryj po najechaniu" } },
  ],
  start(ctx) {
    const b = Number(ctx.option("amount"));
    ctx.css(`img,video{filter:blur(${b}px)!important;transition:filter .2s}` + (ctx.option("reveal") ? `img:hover,video:hover{filter:none!important}` : ""));
  },
};

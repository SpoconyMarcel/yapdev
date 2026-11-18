export default {
  id: "warmFilter", name: "Night Shift", icon: "🌙", category: "visual", added: "2026-11-23", version: "0.2.0", enabledByDefault: false,
  description: { en: "Warm, easier-on-the-eyes colors for late-night yapping.", pl: "Ciepłe kolory, łagodniejsze dla oczu przy nocnym siedzeniu." },
  options: [{ key: "strength", type: "range", min: 5, max: 60, step: 5, unit: "%", default: 25, label: { en: "Warmth", pl: "Ciepło" } }],
  start(ctx) { const s = Number(ctx.option("strength")) / 100; ctx.css(`html{filter:sepia(${s}) saturate(${1 + s / 3}) brightness(${1 - s / 8})}`); },
};

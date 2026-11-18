export default {
  id: "uiZoom", name: "UI Zoom", icon: "🔍", category: "visual", added: "2026-11-22", version: "0.2.0", enabledByDefault: false,
  description: { en: "Scales the whole app up or down.", pl: "Powiększa lub zmniejsza całą aplikację." },
  options: [{ key: "percent", type: "range", min: 80, max: 140, step: 5, unit: "%", default: 100, label: { en: "Size", pl: "Rozmiar" } }],
  start(ctx) { ctx.css(`html{zoom:${Number(ctx.option("percent")) / 100}}`); },
};

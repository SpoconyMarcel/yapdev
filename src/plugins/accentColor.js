export default {
  id: "accentColor", name: "Accent Color", icon: "🎨", category: "visual", added: "2026-11-22", version: "0.2.0", enabledByDefault: false,
  description: { en: "Tints selections, text cursors, form controls and scrollbars with your own color.", pl: "Koloruje zaznaczenie, kursor tekstu, kontrolki i paski przewijania na wybrany kolor." },
  options: [{ key: "color", type: "color", default: "#7c5cff", label: { en: "Color", pl: "Kolor" } }],
  start(ctx) {
    const c = ctx.option("color");
    ctx.css(`:root{accent-color:${c}}*{caret-color:${c}}::selection{background:${c};color:#fff}*::-webkit-scrollbar-thumb{background:${c};border-radius:8px}`);
  },
};

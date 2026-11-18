export default {
  id: "customCss", name: "Custom CSS", icon: "🧪", category: "visual", added: "2026-11-18", version: "0.2.0", enabledByDefault: false,
  description: { en: "Paste your own CSS to restyle the app.", pl: "Wklej własny CSS, aby zmienić wygląd aplikacji." },
  options: [{ key: "css", type: "textarea", default: "", label: "CSS" }],
  start(ctx) { ctx.css(ctx.option("css") || ""); },
};

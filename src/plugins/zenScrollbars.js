export default {
  id: "zenScrollbars", name: "Zen Scrollbars", icon: "🧘", category: "visual", added: "2026-11-19", version: "0.2.0", enabledByDefault: false,
  description: { en: "Hides scrollbars for a cleaner look.", pl: "Ukrywa paski przewijania dla czystszego wyglądu." },
  start(ctx) { ctx.css("*::-webkit-scrollbar{display:none!important}*{scrollbar-width:none!important}"); },
};

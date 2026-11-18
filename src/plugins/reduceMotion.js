export default {
  id: "reduceMotion", name: "Reduce Motion", icon: "🐢", category: "visual", added: "2026-11-20", version: "0.2.0", enabledByDefault: false,
  description: { en: "Turns off animations and transitions.", pl: "Wyłącza animacje i przejścia." },
  start(ctx) { ctx.css("*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}"); },
};

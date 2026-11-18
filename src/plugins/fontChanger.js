const FONTS = ["Segoe UI", "Inter", "Georgia", "Verdana", "Trebuchet MS", "Comic Sans MS", "Consolas", "system-ui"];
export default {
  id: "fontChanger", name: "Font Changer", icon: "🔤", category: "visual", added: "2026-11-23", version: "0.2.0", enabledByDefault: false,
  description: { en: "Swaps the app's font. Some parts that set their own font may not change.", pl: "Zmienia czcionkę aplikacji. Elementy z własną czcionką mogą się nie zmienić." },
  options: [{ key: "font", type: "select", choices: FONTS, default: "Segoe UI", label: { en: "Font", pl: "Czcionka" } }],
  start(ctx) { ctx.css(`:where(body,button,input,textarea,select){font-family:"${ctx.option("font")}",system-ui,sans-serif!important}`); },
};

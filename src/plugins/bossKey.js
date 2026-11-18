let onKey, hidden = false;
export default {
  id: "bossKey", name: "Boss Key", icon: "🕶️", category: "privacy", added: "2026-11-24", version: "0.2.0", enabledByDefault: false,
  description: { en: "Press Ctrl+Shift+H to instantly hide the whole app. Press it again to bring it back.", pl: "Ctrl+Shift+H natychmiast ukrywa całą aplikację. Ponowne naciśnięcie ją przywraca." },
  options: [{ key: "letter", type: "select", choices: ["H", "B", "X"], default: "H", label: { en: "Key (with Ctrl+Shift)", pl: "Klawisz (z Ctrl+Shift)" } }],
  start(ctx) {
    hidden = false;
    onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === String(ctx.option("letter")).toLowerCase()) {
        e.preventDefault(); hidden = !hidden;
        ctx.css(hidden ? "html{visibility:hidden!important;background:#000!important}" : "");
      }
    };
    window.addEventListener("keydown", onKey, true);
  },
  stop() { window.removeEventListener("keydown", onKey, true); },
};

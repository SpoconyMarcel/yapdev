let onClick;
export default {
  id: "codeCopier", name: "Code Copier", icon: "📋", category: "tools", added: "2026-11-27", version: "0.3.0", enabledByDefault: false,
  description: { en: "Alt+click any code block to copy it instantly.", pl: "Alt+klik na bloku kodu kopiuje go natychmiast." },
  start() {
    onClick = (e) => {
      if (!e.altKey) return;
      const t = e.target.closest && e.target.closest("pre,code");
      if (!t) return;
      e.preventDefault();
      navigator.clipboard?.writeText(t.innerText)?.catch(() => {});
      const tip = document.createElement("div");
      tip.textContent = "Copied!";
      tip.style.cssText = `position:fixed;left:${e.clientX + 12}px;top:${e.clientY + 12}px;z-index:2147483645;background:linear-gradient(135deg,#8b5cf6,#22d3ee);color:#fff;padding:4px 10px;border-radius:8px;font:600 12px Segoe UI,sans-serif;pointer-events:none`;
      document.body.appendChild(tip); setTimeout(() => tip.remove(), 900);
    };
    document.addEventListener("click", onClick, true);
  },
  stop() { document.removeEventListener("click", onClick, true); },
};

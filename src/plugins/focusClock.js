const POS = { "bottom-right": "right:18px;bottom:18px", "bottom-left": "left:76px;bottom:18px", "top-right": "right:18px;top:18px", "top-left": "left:18px;top:18px" };
let el, timer, end = 0;
export default {
  id: "focusClock", name: "Focus Clock", icon: "⏱️", category: "tools", added: "2026-11-28", version: "0.4.0", enabledByDefault: false,
  description: { en: "A small floating clock. Click it to start a focus timer, click again to cancel.", pl: "Mały pływający zegar. Kliknij, aby uruchomić licznik skupienia, kliknij ponownie, aby anulować." },
  options: [
    { key: "pos", type: "select", choices: Object.keys(POS), default: "bottom-right", label: { en: "Position", pl: "Pozycja" } },
    { key: "h12", type: "checkbox", default: false, label: { en: "12-hour clock", pl: "Zegar 12-godzinny" } },
    { key: "secs", type: "checkbox", default: false, label: { en: "Show seconds", pl: "Pokaż sekundy" } },
    { key: "mins", type: "range", min: 5, max: 90, step: 5, unit: " min", default: 25, label: { en: "Focus length", pl: "Długość sesji" } },
  ],
  start(ctx) {
    end = 0;
    el = document.createElement("div");
    el.style.cssText = `position:fixed;${POS[ctx.option("pos")] || POS["bottom-right"]};z-index:2147483640;padding:8px 15px;border-radius:999px;background:rgba(15,15,25,.82);backdrop-filter:blur(10px);border:1px solid #2c2c48;color:#eceef6;font:600 13px "Segoe UI",system-ui,sans-serif;cursor:pointer;user-select:none;box-shadow:0 8px 24px #0008;transition:border-color .2s,box-shadow .2s`;
    el.title = "Click: start / cancel focus timer";
    document.body.appendChild(el);
    el.onclick = () => { end = end ? 0 : Date.now() + Number(ctx.option("mins")) * 60000; draw(); };
    const draw = () => {
      if (end) {
        const left = end - Date.now();
        if (left <= 0) {
          end = 0;
          try { new Notification("Yapdev", { body: "Focus session finished 🎉" }); } catch {}
          el.style.boxShadow = "0 0 0 4px #34d39966"; setTimeout(() => (el.style.boxShadow = "0 8px 24px #0008"), 1500);
        } else {
          const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
          el.textContent = `🍅 ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`; el.style.borderColor = "#8b5cf6"; return;
        }
      }
      el.style.borderColor = "#2c2c48";
      el.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: ctx.option("secs") ? "2-digit" : undefined, hour12: !!ctx.option("h12") });
    };
    draw(); timer = setInterval(draw, 1000);
  },
  stop() { clearInterval(timer); el?.remove(); },
};

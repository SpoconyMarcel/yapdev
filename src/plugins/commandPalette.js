import { list, isEnabled, setEnabled } from "./index.js";

const CSS = `*{box-sizing:border-box;font-family:"Segoe UI",system-ui,sans-serif}
.bg{position:fixed;inset:0;background:#05050bb3;backdrop-filter:blur(6px);display:flex;justify-content:center;padding-top:14vh;z-index:2147483647}
.box{width:min(560px,92vw);height:fit-content;background:#0f0f19;border:1px solid #23233a;border-radius:18px;overflow:hidden;box-shadow:0 24px 70px #000c}
input{width:100%;background:none;border:0;border-bottom:1px solid #23233a;color:#eceef6;padding:16px 18px;font-size:16px;outline:none}
.ls{max-height:50vh;overflow:auto;padding:8px}
.it{padding:10px 12px;border-radius:10px;color:#c9cbe0;font-size:14px;cursor:pointer}
.it.on,.it:hover{background:linear-gradient(135deg,#7c5cff30,#38bdf820);color:#fff}`;

let host = null, onKey;
const close = () => { host?.remove(); host = null; };

function open() {
  if (host) return close();
  host = document.createElement("div");
  const r = host.attachShadow({ mode: "open" });
  r.innerHTML = `<style>${CSS}</style><div class="bg"><div class="box"><input placeholder="Type a command…"><div class="ls"></div></div></div>`;
  document.body.appendChild(host);
  const inp = r.querySelector("input"), ls = r.querySelector(".ls"), bg = r.querySelector(".bg");
  const cmds = () => [
    { label: "Open Yapdev menu", icon: "⚙️", run: () => window.dispatchEvent(new CustomEvent("yapdev:open")) },
    ...list.filter((p) => p.id !== "commandPalette").map((p) => ({ label: (isEnabled(p) ? "Turn off " : "Turn on ") + p.name, icon: p.icon, run: () => setEnabled(p, !isEnabled(p)) })),
  ];
  let shown = [], idx = 0;
  const draw = () => {
    const q = inp.value.toLowerCase();
    shown = cmds().filter((c) => c.label.toLowerCase().includes(q));
    idx = Math.min(idx, Math.max(0, shown.length - 1));
    ls.innerHTML = shown.map((c, i) => `<div class="it ${i === idx ? "on" : ""}" data-i="${i}">${c.icon || "⚡"}  ${c.label}</div>`).join("") || `<div class="it">No results</div>`;
  };
  const run = (i) => { const c = shown[i]; close(); if (c) c.run(); };
  inp.oninput = () => { idx = 0; draw(); };
  inp.onkeydown = (e) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") { idx = Math.min(idx + 1, shown.length - 1); draw(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { idx = Math.max(idx - 1, 0); draw(); e.preventDefault(); }
    else if (e.key === "Enter") run(idx);
  };
  ls.onclick = (e) => { const it = e.target.closest("[data-i]"); if (it) run(+it.dataset.i); };
  bg.onclick = (e) => { if (e.target === bg) close(); };
  draw(); inp.focus();
}

export default {
  id: "commandPalette", name: "Command Palette", icon: "⌘", category: "tools", added: "2026-11-25", version: "0.2.0", enabledByDefault: true,
  description: { en: "Ctrl+K opens a search box to toggle plugins or open Yapdev. Ctrl+Shift+Y opens the Yapdev menu.", pl: "Ctrl+K otwiera wyszukiwarkę do włączania wtyczek lub otwierania Yapdev. Ctrl+Shift+Y otwiera menu Yapdev." },
  options: [{ key: "letter", type: "select", choices: ["K", "J", "P"], default: "K", label: { en: "Key (with Ctrl)", pl: "Klawisz (z Ctrl)" } }],
  start(ctx) {
    onKey = (e) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && k === String(ctx.option("letter")).toLowerCase()) { e.preventDefault(); open(); }
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && k === "y") { e.preventDefault(); window.dispatchEvent(new CustomEvent("yapdev:open")); }
    };
    window.addEventListener("keydown", onKey, true);
  },
  stop() { window.removeEventListener("keydown", onKey, true); close(); },
};

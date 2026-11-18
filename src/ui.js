import { t, tx, LANGS } from "./i18n.js";
import * as store from "./store.js";
import { VERSION, SUPPORT_URL, REPO, LOGO_URL, BANNER_URL } from "./config.js";
import { findSettingsNav, findOwnId } from "./adapter.js";
import { DEFAULT_BADGES, badgeHtml } from "./badgeIcons.js";
import { list, isEnabled, setEnabled, getOption, setOption, resetAll, reloadAll } from "./plugins/index.js";

const CSS = `
:host{all:initial;--a:#8b5cf6;--b:#22d3ee}
*{box-sizing:border-box;font-family:"Segoe UI Variable","Segoe UI",system-ui,sans-serif}
.fab{position:fixed;left:16px;bottom:16px;width:46px;height:46px;border-radius:15px;border:0;background:linear-gradient(135deg,var(--a),var(--b));color:#fff;font-size:21px;cursor:pointer;z-index:2147483646;box-shadow:0 8px 26px color-mix(in srgb,var(--a) 47%,transparent);transition:.18s}
.fab:hover{transform:translateY(-2px) rotate(20deg)}
.ov{position:fixed;inset:0;background:#05050bbf;backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;z-index:2147483647}
.ov.open{display:flex}.ov.fresh .win{animation:pop .24s cubic-bezier(.2,.9,.3,1.2)}
@keyframes pop{from{opacity:0;transform:scale(.96) translateY(10px)}to{opacity:1;transform:none}}
.win{width:min(880px,95vw);height:min(640px,90vh);background:#0d0d17;color:#eceef6;border:1px solid #23233a;border-radius:22px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 90px #000d}
.hero{position:relative;height:122px;flex:none;background:linear-gradient(120deg,#2a1d6b,#17306e 55%,#0b4a6b);overflow:hidden}
.hero .bn{position:absolute;inset:-4% -2%;width:104%;height:108%;object-fit:cover;animation:kb 24s ease-in-out infinite alternate}
@keyframes kb{from{transform:scale(1)}to{transform:scale(1.1) translateX(-2%)}}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,#0d0d17 100%),linear-gradient(90deg,#0d0d17aa,transparent 55%)}
.hl{position:absolute;left:22px;bottom:14px;display:flex;align-items:center;gap:14px;z-index:2}
.logo{position:relative;width:62px;height:62px;display:grid;place-items:center;font-size:0;font-weight:700;color:#fff}
.logo::before{content:"";position:absolute;inset:-6px;border-radius:22px;background:conic-gradient(from 0deg,var(--a),var(--b),#d946ef,var(--a));filter:blur(12px);opacity:.55;animation:sp 8s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.logo img{position:relative;width:100%;height:100%;border-radius:19px;display:block}
.logo.fb{background:linear-gradient(135deg,var(--a),var(--b));border-radius:19px;font-size:30px}
.ttl{font-size:28px;font-weight:700;letter-spacing:-.8px;background:linear-gradient(90deg,#c4b5fd,#67e8f9 60%,#f0abfc);-webkit-background-clip:text;background-clip:text;color:transparent}.sb{font-size:12px;color:#b9bcd6}
.x{position:absolute;right:14px;top:14px;z-index:3;background:#0d0d1799;border:1px solid #ffffff22;color:#d6d8ea;width:34px;height:34px;border-radius:11px;font-size:18px;cursor:pointer}
.x:hover{background:#ffffff22;color:#fff}
.body{flex:1;display:flex;min-height:0}
.nav{width:190px;background:#0a0a13;padding:16px 12px;display:flex;flex-direction:column;gap:4px;border-right:1px solid #1d1d31}
.nav button{background:none;border:0;color:#9a9db6;text-align:left;padding:11px 13px;border-radius:12px;cursor:pointer;font-size:14px;transition:.15s}
.nav button:hover{background:#ffffff0d;color:#fff}
.nav button.on{background:linear-gradient(135deg,color-mix(in srgb,var(--a) 22%,transparent),color-mix(in srgb,var(--b) 14%,transparent));color:#fff}
.nav .foot{margin-top:auto;font-size:11px;color:#62657e;padding:8px;line-height:1.5}
.main{flex:1;padding:22px;overflow:auto;min-width:0}
.main h2{margin:0 0 14px;font-size:21px;letter-spacing:-.4px}
.row{display:flex;gap:8px;margin-bottom:12px}
input,select,textarea{background:#161625;border:1px solid #26263d;color:#eceef6;border-radius:12px;padding:10px 12px;font-size:13px}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--a)}
input[type=text],.row input{flex:1}
textarea{width:100%;min-height:90px;margin-top:8px;font-family:Consolas,monospace}
input[type=color]{padding:2px;width:44px;height:32px;cursor:pointer}
input[type=range]{padding:0;accent-color:var(--a);width:150px;background:none;border:0}
.stat{font-size:12px;color:#8d90aa;margin:-4px 0 12px}.stat b{color:#c4b5fd;font-weight:600}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.chip{background:#14141f;border:1px solid #23233a;color:#9a9db6;border-radius:999px;padding:6px 13px;font-size:12px;cursor:pointer;transition:.15s}
.chip:hover{color:#fff;border-color:#3a3a5c}.chip.on{background:linear-gradient(135deg,var(--a),var(--b));border-color:transparent;color:#fff}
.card{background:#13131f;border:1px solid #22223a;border-radius:18px;padding:14px 16px;margin-bottom:10px;transition:.18s}
.card:hover{border-color:#34345a}.card.off .ic{filter:grayscale(1);opacity:.6}
.top{display:flex;align-items:center;gap:12px}
.ic{width:42px;height:42px;border-radius:13px;background:#1b1b30;display:grid;place-items:center;font-size:21px;flex:none;transition:.18s}
.tt{flex:1;min-width:0}.nm{font-weight:600;font-size:15px;display:flex;align-items:center;gap:8px}
.cat{font-size:10px;font-weight:500;color:#a994ff;background:color-mix(in srgb,var(--a) 13%,transparent);border-radius:999px;padding:2px 8px}
.meta{font-size:11px;color:#6f728c;margin-top:2px}.ds{font-size:13px;color:#b4b7cc;margin-top:10px;line-height:1.45}
.opts{margin-top:12px;padding-top:12px;border-top:1px solid #1f1f33}
.opt{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:5px 0;font-size:13px;color:#c9cbe0}
.opt.col{flex-direction:column;align-items:stretch}.ctl{display:flex;align-items:center;gap:10px}.val{min-width:46px;text-align:right;font-size:12px;color:#a994ff;font-weight:500}
.sw{position:relative;width:44px;height:24px;flex:none}.sw input{opacity:0;width:100%;height:100%;margin:0;position:absolute;cursor:pointer;z-index:1}
.sw i{position:absolute;inset:0;background:#2a2a42;border-radius:12px;transition:.18s}
.sw i::after{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.18s}
.sw input:checked+i{background:linear-gradient(135deg,var(--a),var(--b))}.sw input:checked+i::after{left:23px}
.btn{background:linear-gradient(135deg,var(--a),var(--b));border:0;color:#fff;padding:11px 18px;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600;transition:.15s}
.btn:hover{transform:translateY(-1px)}.btn.ghost{background:#1b1b2a;border:1px solid #26263d;font-weight:500}.btn.red{background:#2a1618;border:1px solid #5a2a2c;color:#f87171;font-weight:500}
.small{font-size:12px;color:#7c7f98;margin-top:14px;line-height:1.5}
.btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.main{animation:fi .26s ease both}@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:6px}
.sc{background:linear-gradient(135deg,color-mix(in srgb,var(--a) 12%,transparent),color-mix(in srgb,var(--b) 6%,transparent));border:1px solid #2a2a48;border-radius:18px;padding:14px 16px}
.sc b{display:block;font-size:26px;letter-spacing:-.8px;background:linear-gradient(90deg,#c4b5fd,#67e8f9);-webkit-background-clip:text;background-clip:text;color:transparent}
.sc span{font-size:11px;color:#8d90aa;text-transform:uppercase;letter-spacing:.6px}
.sec{font-size:12px;color:#8d90aa;text-transform:uppercase;letter-spacing:.8px;font-weight:600;margin:18px 0 10px}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.tile{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:8px;background:#13131f;border:1px solid #22223a;color:#c9cbe0;border-radius:16px;padding:14px;font-size:13px;cursor:pointer;text-align:left;transition:.18s}
.tile:hover{transform:translateY(-2px);border-color:#44446a}.tile .ti{font-size:22px}
.tile.on{background:linear-gradient(135deg,color-mix(in srgb,var(--a) 20%,transparent),color-mix(in srgb,var(--b) 11%,transparent));border-color:var(--a);color:#fff}
.tile .dotc{position:absolute;right:12px;top:12px;width:9px;height:9px;border-radius:50%;background:#33334f}.tile.on .dotc{background:#34d399;box-shadow:0 0 10px #34d399}
.card.mini{padding:11px 14px}
.new{font-size:10px;font-weight:700;color:#06121a;background:linear-gradient(90deg,#67e8f9,#f0abfc);border-radius:999px;padding:2px 8px}
.toast{position:fixed;left:50%;bottom:30px;transform:translate(-50%,20px);opacity:0;pointer-events:none;background:#1b1b2e;border:1px solid #3a3a5c;color:#fff;padding:10px 18px;border-radius:14px;font-size:13px;z-index:2147483647;transition:.22s;box-shadow:0 12px 40px #000a}
.toast.show{opacity:1;transform:translate(-50%,0)}
@media(max-width:640px){.nav{width:120px}.hero .ttl{font-size:19px}}

.themes{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.th{width:54px;height:36px;border-radius:12px;border:2px solid transparent;cursor:pointer;transition:.18s;position:relative}
.th:hover{transform:translateY(-2px)}.th.on{border-color:#fff;box-shadow:0 0 0 3px #ffffff25}
.tip{display:flex;gap:12px;align-items:center;background:linear-gradient(135deg,#d946ef1a,#22d3ee10);border:1px solid #2a2a48;border-radius:16px;padding:12px 14px;margin-top:6px;font-size:13px;color:#c9cbe0;line-height:1.45}
.tip b{color:#fff}
.bset{display:flex;flex-wrap:wrap;gap:8px;font-size:14px}
.bchip{display:inline-flex;align-items:center;gap:8px;background:#13131f;border:1px solid #22223a;border-radius:999px;padding:5px 12px 5px 6px;font-size:12px;color:#c9cbe0}
`;

const THEMES = { galaxy: ["#8b5cf6", "#22d3ee"], sunset: ["#f97316", "#ec4899"], mint: ["#10b981", "#22d3ee"], rose: ["#f43f5e", "#a855f7"], mono: ["#94a3b8", "#e2e8f0"] };
const TIPS = [
  { en: "Press <b>Ctrl+K</b> anywhere to open the command palette.", pl: "Naciśnij <b>Ctrl+K</b> w dowolnym miejscu, aby otworzyć paletę poleceń." },
  { en: "<b>Boss Key</b> hides the whole app instantly with Ctrl+Shift+H.", pl: "<b>Boss Key</b> natychmiast ukrywa całą aplikację skrótem Ctrl+Shift+H." },
  { en: "Hold <b>Alt</b> and hover an image with Image Zoom for a big preview.", pl: "Przytrzymaj <b>Alt</b> i najedź na obraz z Image Zoom, aby zobaczyć duży podgląd." },
  { en: "Pick a menu <b>theme</b> in Settings to change Yapdev's colors.", pl: "Wybierz <b>motyw</b> menu w Ustawieniach, aby zmienić kolory Yapdev." },
  { en: "Use <b>Export</b> in Settings to back up all your plugin settings.", pl: "Użyj <b>Eksportu</b> w Ustawieniach, aby zrobić kopię wszystkich ustawień wtyczek." },
];
const who = () => (window.__YAPDEV_PROFILE && window.__YAPDEV_PROFILE.name) || "";
let host;
function applyTheme() {
  const [a, b] = THEMES[store.get().theme] || THEMES.galaxy;
  host?.style.setProperty("--a", a); host?.style.setProperty("--b", b);
}
let root, ov, state = { tab: "home", sort: "newest", q: "", cat: "all" };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sorters = {
  newest: (a, b) => b.added.localeCompare(a.added),
  oldest: (a, b) => a.added.localeCompare(b.added),
  az: (a, b) => a.name.localeCompare(b.name),
};

function optHtml(p, o) {
  const v = getOption(p, o.key), id = `${p.id}:${o.key}`, label = esc(tx(o.label || ""));
  if (o.type === "textarea") return `<div class="opt col"><span>${label}</span><textarea data-opt="${id}" placeholder="/* CSS */">${esc(v)}</textarea></div>`;
  let ctl;
  if (o.type === "color") ctl = `<input type="color" data-opt="${id}" value="${esc(v)}">`;
  else if (o.type === "range") ctl = `<input type="range" data-opt="${id}" data-unit="${esc(o.unit || "")}" min="${o.min}" max="${o.max}" step="${o.step || 1}" value="${esc(v)}"><span class="val">${esc(v)}${esc(o.unit || "")}</span>`;
  else if (o.type === "checkbox") ctl = `<label class="sw"><input type="checkbox" data-opt="${id}" ${v ? "checked" : ""}><i></i></label>`;
  else if (o.type === "select") ctl = `<select data-opt="${id}">${o.choices.map((c) => `<option value="${esc(c)}" ${c === v ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>`;
  else ctl = `<input type="text" data-opt="${id}" value="${esc(v)}">`;
  return `<div class="opt"><span>${label}</span><div class="ctl">${ctl}</div></div>`;
}
const isNew = (p) => [...list].sort(sorters.newest).slice(0, 3).includes(p);
function pluginCard(p) {
  const on = isEnabled(p), opts = (p.options || []).map((o) => optHtml(p, o)).join("");
  return `<div class="card ${on ? "" : "off"}"><div class="top"><div class="ic">${p.icon || "🧩"}</div>
    <div class="tt"><div class="nm">${esc(p.name)}<span class="cat">${t(p.category)}</span>${isNew(p) ? `<span class="new">NEW</span>` : ""}</div>
    <div class="meta">${t("version")} ${esc(p.version)} · ${t("added")} ${esc(p.added)}</div></div>
    <label class="sw"><input type="checkbox" data-toggle="${p.id}" ${on ? "checked" : ""}><i></i></label></div>
    <div class="ds">${esc(tx(p.description))}</div>${on && opts ? `<div class="opts">${opts}</div>` : ""}</div>`;
}
function listHtml() {
  const q = state.q.toLowerCase();
  const items = list
    .filter((p) => state.cat === "all" || p.category === state.cat)
    .filter((p) => !q || (p.name + tx(p.description)).toLowerCase().includes(q))
    .sort(sorters[state.sort]);
  return items.length ? items.map(pluginCard).join("") : `<div class="small">${t("none")}</div>`;
}
function tabHtml() {
  if (state.tab === "home") {
    const id = findOwnId();
    const quick = ["privacyBlur", "bossKey", "warmFilter", "imageZoom", "cursorGlow", "accentColor"].map((i) => list.find((p) => p.id === i)).filter(Boolean);
    const fresh = [...list].sort(sorters.newest).slice(0, 3);
    const tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length];
    return `<h2>${t("welcome")}${who() ? ", " + esc(who()) : ""}</h2>
      <div class="stats"><div class="sc"><b>${list.filter(isEnabled).length}</b><span>${t("active")}</span></div>
      <div class="sc"><b>${list.length}</b><span>${t("plugins")}</span></div>
      <div class="sc"><b>${id ? esc(String(id).slice(0, 8)) : "–"}</b><span>${t("yourId")}</span></div></div>
      <div class="sec">${t("quick")}</div>
      <div class="tiles">${quick.map((p) => `<button class="tile ${isEnabled(p) ? "on" : ""}" data-quick="${p.id}"><span class="ti">${p.icon}</span><span>${esc(p.name)}</span><i class="dotc"></i></button>`).join("")}</div>
      <div class="tip"><span style="font-size:22px">💡</span><span>${tip[store.get().lang] || tip.en}</span></div>
      <div class="sec">${t("badgeSet")}</div>
      <div class="bset">${Object.values(DEFAULT_BADGES).map((d) => `<span class="bchip">${badgeHtml(d)}<span>${esc(d.label)}</span></span>`).join("")}</div>
      <div class="sec">${t("whatsNew")}</div>
      ${fresh.map((p) => `<div class="card mini"><div class="top"><div class="ic">${p.icon}</div><div class="tt"><div class="nm">${esc(p.name)}<span class="new">NEW</span></div><div class="ds" style="margin-top:4px">${esc(tx(p.description))}</div></div></div></div>`).join("")}`;
  }
  if (state.tab === "plugins") {
    const cats = ["all", "visual", "privacy", "tools", "social"];
    return `<h2>${t("plugins")}</h2>
      <div class="row"><input type="text" id="q" placeholder="${esc(t("search"))}" value="${esc(state.q)}">
      <select id="sort" title="${esc(t("sort"))}">${["newest", "oldest", "az"].map((k) => `<option value="${k}" ${state.sort === k ? "selected" : ""}>${t(k)}</option>`).join("")}</select></div>
      <div class="stat"><b>${list.filter(isEnabled).length}</b> / ${list.length} ${t("active")}</div>
      <div class="chips">${cats.map((c) => `<button class="chip ${state.cat === c ? "on" : ""}" data-cat="${c}">${t(c)}</button>`).join("")}</div>
      <div id="list">${listHtml()}</div>`;
  }
  if (state.tab === "settings") {
    const id = findOwnId();
    return `<h2>${t("settings")}</h2>
      <div class="card"><div class="nm">${t("language")}</div><div class="row" style="margin:10px 0 0">
        <select id="lang">${Object.entries(LANGS).map(([k, v]) => `<option value="${k}" ${store.get().lang === k ? "selected" : ""}>${v}</option>`).join("")}</select></div></div>
      <div class="card"><div class="nm">${t("account")}</div><div class="ds">${t("yourId")}: ${id ? `<b>${esc(id)}</b>` : t("notDetected")}</div>
        ${id ? `<div class="btns"><button class="btn" data-act="copy" data-id="${esc(id)}">${t("copy")}</button><button class="btn ghost" data-act="request" data-id="${esc(id)}">${t("requestBadge")}</button></div>` : ""}</div>
      <div class="card"><div class="nm">${t("theme")}</div><div class="ds">${t("themeNote")}</div>
        <div class="themes">${Object.entries(THEMES).map(([k, [a, b]]) => `<button class="th ${(store.get().theme || "galaxy") === k ? "on" : ""}" data-theme="${k}" title="${k}" style="background:linear-gradient(135deg,${a},${b})"></button>`).join("")}</div></div>
      <div class="card"><div class="nm">${t("backup")}</div><div class="ds">${t("ioNote")}</div>
        <textarea id="io" placeholder='{ "lang": "en", "plugins": {}, "options": {} }'></textarea>
        <div class="btns"><button class="btn" data-act="export">${t("export")}</button><button class="btn ghost" data-act="import">${t("import")}</button></div></div>
      <div class="card"><div class="nm">${t("reset")}</div><div class="ds">${t("resetNote")}</div><div class="btns"><button class="btn red" data-act="reset">${t("reset")}</button></div></div>`;
  }
  return `<h2>${t("support")}</h2>
    <div class="card"><div class="ds" style="margin:0">${t("supportText")}</div>
      <div class="btns"><button class="btn" data-act="support">${t("join")}</button><button class="btn ghost" data-act="github">${t("github")}</button></div></div>
    <div class="small">${t("notOfficial")}</div>`;
}
function render() {
  ov.innerHTML = `<div class="win">
    <div class="hero"><img class="bn" src="${esc(BANNER_URL)}" onerror="this.style.display='none'">
      <div class="hl"><div class="logo">Y<img src="${esc(LOGO_URL)}" onerror="this.parentElement.classList.add('fb');this.remove()"></div>
      <div><div class="ttl">Yapdev</div><div class="sb">v${VERSION}</div></div></div>
      <button class="x" data-act="close">×</button></div>
    <div class="body"><div class="nav">
      ${[["home", "🏠"], ["plugins", "🧩"], ["settings", "⚙️"], ["support", "💬"]].map(([k, i]) => `<button data-tab="${k}" class="${state.tab === k ? "on" : ""}">${i}  ${t(k)}</button>`).join("")}
      <div class="foot">${t("hotkeys")}</div></div>
    <div class="main">${tabHtml()}</div></div></div>`;
}
let tt = 0;
function toast(m) { const el = root.querySelector(".toast"); el.textContent = m; el.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("show"), 1800); }
function open() { render(); ov.classList.add("open", "fresh"); setTimeout(() => ov.classList.remove("fresh"), 400); }

export function mount() {
  host = document.createElement("div");
  host.id = "yapdev-root";
  document.body.appendChild(host);
  root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>${CSS}</style><button class="fab" title="Yapdev">⚙</button><div class="ov"></div><div class="toast"></div>`;
  ov = root.querySelector(".ov");
  applyTheme();
  const fab = root.querySelector(".fab");
  fab.onclick = open;
  window.addEventListener("yapdev:open", open);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" && ov.classList.contains("open")) ov.classList.remove("open"); });

  let nt = 0;
  const tryAttach = () => {
    clearTimeout(nt);
    nt = setTimeout(() => {
      const have = document.getElementById("yapdev-nav");
      if (have && have.isConnected) { fab.style.display = "none"; return; }
      const nav = findSettingsNav();
      if (!nav) { fab.style.display = ""; return; }
      const item = document.createElement("div");
      item.id = "yapdev-nav"; item.textContent = "Yapdev"; item.style.cssText = "cursor:pointer;padding:8px 12px";
      item.onclick = open; nav.appendChild(item);
      fab.style.display = "none";
    }, 400);
  };
  new MutationObserver(tryAttach).observe(document.body, { childList: true, subtree: true });
  tryAttach();

  ov.addEventListener("click", (e) => {
    if (e.target === ov) return ov.classList.remove("open");
    const el = e.target.closest("[data-tab],[data-act],[data-cat],[data-quick],[data-theme]"); if (!el) return;
    if (el.dataset.theme) { store.set({ theme: el.dataset.theme }); applyTheme(); render(); }
    else if (el.dataset.quick) { const p = list.find((x) => x.id === el.dataset.quick); setEnabled(p, !isEnabled(p)); render(); }
    else if (el.dataset.tab) { state.tab = el.dataset.tab; render(); }
    else if (el.dataset.cat) { state.cat = el.dataset.cat; render(); }
    else if (el.dataset.act === "close") ov.classList.remove("open");
    else if (el.dataset.act === "support") window.open(SUPPORT_URL, "_blank");
    else if (el.dataset.act === "github") window.open(`https://github.com/${REPO}`, "_blank");
    else if (el.dataset.act === "reset") { resetAll(); render(); toast(t("reset") + " ✓"); }
    else if (el.dataset.act === "export") {
      const { lang, plugins, options } = store.get(); const txt = JSON.stringify({ lang, plugins, options }, null, 2);
      ov.querySelector("#io").value = txt; navigator.clipboard?.writeText(txt)?.catch(() => {}); toast(t("exported"));
    }
    else if (el.dataset.act === "import") {
      try {
        const d = JSON.parse(ov.querySelector("#io").value);
        if (!d || typeof d !== "object") throw 0;
        store.set({ lang: LANGS[d.lang] ? d.lang : store.get().lang, plugins: d.plugins && typeof d.plugins === "object" ? d.plugins : {}, options: d.options && typeof d.options === "object" ? d.options : {} });
        reloadAll(); render(); toast(t("imported"));
      } catch { toast(t("invalid")); }
    }
    else if (el.dataset.act === "copy") { navigator.clipboard?.writeText(el.dataset.id)?.catch(() => {}); el.textContent = t("copied"); toast(t("copied")); }
    else if (el.dataset.act === "request")
      window.open(`https://github.com/${REPO}/issues/new?title=${encodeURIComponent("Badge request")}&body=${encodeURIComponent("My Yapper ID: " + el.dataset.id + "\nBadge I want: ")}`, "_blank");
  });
  ov.addEventListener("input", (e) => {
    const el = e.target;
    if (el.id === "q") { state.q = el.value; ov.querySelector("#list").innerHTML = listHtml(); }
    else if (el.type === "range" && el.dataset.opt) { const v = el.parentElement.querySelector(".val"); if (v) v.textContent = el.value + (el.dataset.unit || ""); }
  });
  ov.addEventListener("change", (e) => {
    const el = e.target;
    if (el.id === "sort") { state.sort = el.value; render(); }
    else if (el.id === "lang") { store.set({ lang: el.value }); render(); }
    else if (el.dataset.toggle) { setEnabled(list.find((p) => p.id === el.dataset.toggle), el.checked); ov.querySelector("#list").innerHTML = listHtml(); const st = ov.querySelector(".stat"); if (st) st.innerHTML = `<b>${list.filter(isEnabled).length}</b> / ${list.length} ${t("active")}`; }
    else if (el.dataset.opt) {
      const [id, k] = el.dataset.opt.split(":");
      const v = el.type === "checkbox" ? el.checked : el.type === "range" ? Number(el.value) : el.value;
      setOption(list.find((p) => p.id === id), k, v);
    }
  });
}

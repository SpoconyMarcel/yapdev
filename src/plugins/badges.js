import { adapter, discover } from "../adapter.js";
import { watch } from "../dom.js";
import * as registry from "../registry.js";
import { DEFAULT_BADGES, badgeHtml } from "../badgeIcons.js";
let data = null, unwatch, unuse;
function scan() {
  if (!data || (!adapter.userSelector && !discover())) return;
  document.querySelectorAll(adapter.userSelector).forEach((el) => {
    const id = el.getAttribute(adapter.userIdAttr);
    if (!id) return;
    const list = data.users?.[id]?.badges || [];
    const key = id + ":" + list.join(",");
    if (el.dataset.ycB === key) return;
    el.dataset.ycB = key;
    el.querySelectorAll(":scope > .yc-badges").forEach((n) => n.remove());
    if (!list.length) return;
    const wrap = document.createElement("span");
    wrap.className = "yc-badges";
    wrap.style.cssText = "display:inline-flex;gap:.3em;margin-left:.4em;vertical-align:middle;font-size:1em;line-height:1";
    const defs = { ...DEFAULT_BADGES, ...(data.badges || {}) };
    for (const b of list) wrap.insertAdjacentHTML("beforeend", badgeHtml(defs[b]));
    el.appendChild(wrap);
  });
}
export default {
  id: "badges", name: "Fake Badges", icon: "🏅", category: "social", added: "2026-11-16", version: "0.2.0", enabledByDefault: true,
  description: { en: "Shows Yapdev badges next to users. Only people running Yapdev can see them.", pl: "Pokazuje odznaki Yapdev przy użytkownikach. Widzą je tylko osoby z Yapdev." },
  start() { unuse = registry.use((d) => { data = d; scan(); }); unwatch = watch(scan); },
  stop() {
    unwatch?.(); unuse?.(); data = null;
    document.querySelectorAll(".yc-badges").forEach((n) => n.remove());
    document.querySelectorAll("[data-yc-b]").forEach((n) => delete n.dataset.ycB);
  },
};

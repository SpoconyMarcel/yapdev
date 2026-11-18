import { adapter, discover } from "../adapter.js";
import { watch } from "../dom.js";
import * as registry from "../registry.js";
let data = null, unwatch, unuse;
function scan() {
  if (!data || (!adapter.userSelector && !discover())) return;
  document.querySelectorAll(adapter.userSelector).forEach((el) => {
    const id = el.getAttribute(adapter.userIdAttr);
    if (!id) return;
    const tag = data.users?.[id]?.tag || "";
    if (el.dataset.ycT === id + ":" + tag) return;
    el.dataset.ycT = id + ":" + tag;
    el.querySelectorAll(":scope > .yc-tag").forEach((n) => n.remove());
    if (!tag) return;
    const s = document.createElement("span");
    s.className = "yc-tag"; s.textContent = tag; s.title = "Yapdev name tag (not official)";
    s.style.cssText = "margin-left:6px;padding:1px 7px;border-radius:7px;font-size:.75em;background:#7c5cff;color:#fff;vertical-align:middle";
    el.appendChild(s);
  });
}
export default {
  id: "nameTag", name: "Name Tags", icon: "🏷️", category: "social", added: "2026-11-17", version: "0.2.0", enabledByDefault: true,
  description: { en: "Shows a small custom name tag next to users. Only visible to Yapdev users.", pl: "Pokazuje małą etykietę przy nazwie użytkownika. Widoczna tylko dla Yapdev." },
  start() { unuse = registry.use((d) => { data = d; scan(); }); unwatch = watch(scan); },
  stop() {
    unwatch?.(); unuse?.(); data = null;
    document.querySelectorAll(".yc-tag").forEach((n) => n.remove());
    document.querySelectorAll("[data-yc-t]").forEach((n) => delete n.dataset.ycT);
  },
};

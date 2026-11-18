import { adapter, discover } from "../adapter.js";
import { watch } from "../dom.js";
import * as registry from "../registry.js";
let data = null, unwatch, unuse;
function scan() {
  if (!data || (!adapter.userSelector && !discover())) return;
  document.querySelectorAll(adapter.userSelector).forEach((el) => {
    const id = el.getAttribute(adapter.userIdAttr);
    if (!id) return;
    const plus = !!data.users?.[id]?.plus;
    if (el.dataset.ycP === id + ":" + plus) return;
    el.dataset.ycP = id + ":" + plus;
    el.querySelectorAll(":scope > .yc-plus").forEach((n) => n.remove());
    if (!plus) return;
    const s = document.createElement("span");
    s.className = "yc-plus"; s.textContent = "✦ Yapdev+";
    s.title = "Yapdev+ is a cosmetic label from the Yapdev mod. It unlocks nothing and is not Yapper Plus.";
    s.style.cssText = "margin-left:6px;padding:1px 8px;border-radius:999px;font-size:.75em;background:linear-gradient(135deg,#7c5cff,#38bdf8);color:#fff;vertical-align:middle";
    el.appendChild(s);
  });
}
export default {
  id: "yapdevPlus", name: "Fake Plus", icon: "✦", category: "social", added: "2026-11-21", version: "0.2.0", enabledByDefault: true,
  description: { en: "A cosmetic “Yapdev+” label next to chosen users. Only Yapdev users see it. It unlocks nothing and is not Yapper Plus.", pl: "Kosmetyczna etykieta „Yapdev+” przy wybranych użytkownikach. Widzą ją tylko osoby z Yapdev. Nic nie odblokowuje i nie jest Plusem Yapper." },
  start() { unuse = registry.use((d) => { data = d; scan(); }); unwatch = watch(scan); },
  stop() {
    unwatch?.(); unuse?.(); data = null;
    document.querySelectorAll(".yc-plus").forEach((n) => n.remove());
    document.querySelectorAll("[data-yc-p]").forEach((n) => delete n.dataset.ycP);
  },
};

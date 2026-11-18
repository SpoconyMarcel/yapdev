import * as store from "../store.js";
import badges from "./badges.js";
import nameTag from "./nameTag.js";
import yapdevPlus from "./yapdevPlus.js";
import accentColor from "./accentColor.js";
import uiZoom from "./uiZoom.js";
import fontChanger from "./fontChanger.js";
import warmFilter from "./warmFilter.js";
import privacyBlur from "./privacyBlur.js";
import bossKey from "./bossKey.js";
import imageZoom from "./imageZoom.js";
import commandPalette from "./commandPalette.js";
import cursorGlow from "./cursorGlow.js";
import linkCleaner from "./linkCleaner.js";
import codeCopier from "./codeCopier.js";
import focusClock from "./focusClock.js";
import customCss from "./customCss.js";
import zenScrollbars from "./zenScrollbars.js";
import reduceMotion from "./reduceMotion.js";

export const list = [badges, nameTag, yapdevPlus, accentColor, uiZoom, fontChanger, warmFilter, privacyBlur, bossKey, imageZoom, commandPalette, cursorGlow, linkCleaner, codeCopier, focusClock, customCss, zenScrollbars, reduceMotion];
const running = new Map();

export const isEnabled = (p) => { const v = store.get().plugins[p.id]; return v === undefined ? !!p.enabledByDefault : v; };
export const getOption = (p, k) => store.get().options?.[p.id]?.[k] ?? p.options?.find((o) => o.key === k)?.default;

function makeCtx(p) {
  const id = "yapdev-css-" + p.id;
  return {
    css(text) {
      let el = document.getElementById(id);
      if (!el) { el = document.createElement("style"); el.id = id; document.head.appendChild(el); }
      el.textContent = text;
    },
    removeCss() { document.getElementById(id)?.remove(); },
    option: (k) => getOption(p, k),
  };
}
function start(p) {
  if (running.has(p.id)) return;
  const ctx = makeCtx(p);
  try { p.start(ctx); running.set(p.id, ctx); } catch (e) { console.error("[Yapdev] plugin failed:", p.id, e); }
}
function stop(p) {
  const ctx = running.get(p.id); if (!ctx) return;
  try { p.stop?.(ctx); } catch (e) { console.error(e); }
  ctx.removeCss(); running.delete(p.id);
}
export function setEnabled(p, on) {
  store.set({ plugins: { ...store.get().plugins, [p.id]: on } });
  on ? start(p) : stop(p);
}
export function setOption(p, k, v) {
  const s = store.get();
  store.set({ options: { ...s.options, [p.id]: { ...(s.options?.[p.id] || {}), [k]: v } } });
  if (isEnabled(p)) { stop(p); start(p); }
}
export const startAll = () => list.forEach((p) => isEnabled(p) && start(p));
export function resetAll() {
  list.forEach(stop);
  store.set({ plugins: {}, options: {} });
  startAll();
}
export function reloadAll() {
  list.forEach(stop);
  startAll();
}

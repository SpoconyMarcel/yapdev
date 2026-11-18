import { BADGES_URL } from "./config.js";
let data = null, timer = null;
const subs = new Set();
async function load() {
  try { data = await (await fetch(BADGES_URL, { cache: "no-store" })).json(); subs.forEach((f) => f(data)); } catch {}
}
export function use(cb) {
  subs.add(cb);
  if (subs.size === 1) { load(); timer = setInterval(load, 600000); } else if (data) cb(data);
  return () => { subs.delete(cb); if (!subs.size) clearInterval(timer); };
}

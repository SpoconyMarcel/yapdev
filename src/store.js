const KEY = "yapdev:v1";
const defaults = { lang: "en", plugins: {}, options: {} };
export function get() {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { return { ...defaults }; }
}
export function set(patch) {
  const v = { ...get(), ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
  return v;
}

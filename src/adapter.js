// Yapdev figures out Yapper's page on its own. If auto-detection ever picks the wrong thing,
// set an override below (F12 -> Elements to find the right selector).
const overrides = {
  settingsNavSelector: null, // e.g. ".settings-sidebar"
  userSelector: null,        // e.g. "[data-user-id]"
  userIdAttr: null,          // e.g. "data-user-id"
};

export const adapter = { userSelector: overrides.userSelector, userIdAttr: overrides.userIdAttr };

const ATTR = /^data-(user|author|member|uid|account|profile|sender)[-_]?id$|^data-uid$/i;
let last = 0;

// Finds which attribute Yapper uses to mark users (most common matching data-attribute).
export function discover() {
  if (adapter.userSelector) return true;
  const now = Date.now();
  if (now - last < 2000) return false;
  last = now;
  const counts = {};
  const els = document.body.querySelectorAll("*");
  for (let i = 0; i < Math.min(els.length, 6000); i++)
    for (const a of els[i].attributes) if (ATTR.test(a.name) && a.value) counts[a.name] = (counts[a.name] || 0) + 1;
  const best = Object.entries(counts).sort((x, y) => y[1] - x[1])[0];
  if (!best) return false;
  adapter.userIdAttr = best[0];
  adapter.userSelector = "[" + best[0] + "]";
  return true;
}

// Finds the Settings sidebar: the container that holds the "Log out" item.
export function findSettingsNav() {
  if (overrides.settingsNavSelector) return document.querySelector(overrides.settingsNavSelector);
  const re = /^(log ?out|sign ?out|wyloguj( się)?|cerrar sesi[oó]n|abmelden)$/i;
  for (const el of document.querySelectorAll("button,a,div,span,li"))
    if (el.children.length === 0 && re.test(el.textContent.trim()))
      return el.closest("li")?.parentElement || el.parentElement?.parentElement || el.parentElement;
  return null;
}

// Best-effort: finds YOUR Yapper user ID from what the app stores in the browser.
export function findOwnId() {
  const keyRe = /user|me|account|session|auth|profile|current/i;
  const pick = (o, d = 0) => {
    if (!o || typeof o !== "object" || d > 3) return null;
    for (const k of ["id", "userId", "user_id", "uid", "_id"])
      if (typeof o[k] === "string" || typeof o[k] === "number") return String(o[k]);
    for (const k of Object.keys(o)) if (/user|me|account|profile|data/i.test(k)) { const r = pick(o[k], d + 1); if (r) return r; }
    return null;
  };
  for (const s of [localStorage, sessionStorage]) {
    try {
      for (let i = 0; i < s.length; i++) {
        const k = s.key(i);
        if (k.startsWith("yapdev") || !keyRe.test(k)) continue;
        const v = s.getItem(k);
        try { const r = pick(JSON.parse(v)); if (r) return r; } catch {}
        const m = v.split(".");
        if (m.length === 3) {
          try {
            const j = JSON.parse(atob(m[1].replace(/-/g, "+").replace(/_/g, "/")));
            const r = j.sub || j.id || j.user_id; if (r) return String(r);
          } catch {}
        }
      }
    } catch {}
  }
  return null;
}

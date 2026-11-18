// One unified icon set: every badge uses the same plate, size and stroke style.
const I = {
  sunrise: '<path d="M17 18a5 5 0 0 0-10 0M12 2v7M4.22 10.22l1.42 1.42M1 18h2M21 18h2M18.36 11.64l1.42-1.42M23 22H1M8 6l4-4 4 4"/>',
  lifebuoy: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24"/>',
  flask: '<path d="M9 3h6M10 3v6L4 19a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 19l-6-10V3"/>',
  bug: '<path d="M8 9h8a4 4 0 0 1 4 4v1a8 8 0 0 1-16 0v-1a4 4 0 0 1 4-4zM9 5l1.5 2M15 5l-1.5 2M2 13h3M19 13h3M3 19l3-2M21 19l-3-2M12 14v8"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
  award: '<circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  crown: '<path d="M2 20h20M4 20L2 6l6 5 4-7 4 7 6-5-2 14"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
};

// Built-in Yapdev badge set (custom Yapdev badges, not copies of any official ones).
export const DEFAULT_BADGES = {
  boss:       { label: "Boss",            icon: "crown",    color: "#8b5cf6" },
  founder:    { label: "Yapdev Founder",  icon: "wrench",   color: "#0ea5e9" },
  dev:        { label: "Plugin Dev",      icon: "code",     color: "#10b981" },
  helper:     { label: "Yapdev Helper",   icon: "lifebuoy", color: "#3b82f6" },
  earlybird:  { label: "Early Bird",      icon: "sunrise",  color: "#f59e0b" },
  tester:     { label: "Tester",          icon: "flask",    color: "#14b8a6" },
  bughunter:  { label: "Bug Hunter",      icon: "bug",      color: "#ef4444" },
  translator: { label: "Translator",      icon: "globe",    color: "#06b6d4" },
  themer:     { label: "Theme Maker",     icon: "droplet",  color: "#ec4899" },
  supporter:  { label: "Supporter",       icon: "heart",    color: "#f43f5e" },
  og:         { label: "OG Yapdev",       icon: "award",    color: "#a855f7" },
  nightowl:   { label: "Night Owl",       icon: "moon",     color: "#6366f1" },
  yapper:     { label: "Certified Yapper",icon: "chat",     color: "#8b5cf6" },
  cat:        { label: "Cat Person",      icon: "smile",    color: "#f97316" },
};

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function badgeHtml(def) {
  if (!def) return "";
  const c = /^#[0-9a-f]{6}$/i.test(def.color || "") ? def.color : "#8b5cf6";
  const tip = esc(def.label) + " (Yapdev badge, not official)";
  const inner = I[def.icon];
  if (!inner) return def.emoji ? `<span title="${tip}">${esc(def.emoji)}</span>` : "";
  return `<span class="yc-b" title="${tip}" style="display:inline-flex;align-items:center;justify-content:center;flex:none;width:1.4em;height:1.4em;border-radius:.42em;background:linear-gradient(135deg,${c},${c}bb);box-shadow:inset 0 0 0 1px #ffffff33;vertical-align:middle"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:.88em;height:.88em">${inner}</svg></span>`;
}

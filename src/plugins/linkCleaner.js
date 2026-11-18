let onCopy;
const TRACK = /^(utm_|fbclid|gclid|mc_|igshid|ref_|yclid|msclkid)/i;
export default {
  id: "linkCleaner", name: "Link Cleaner", icon: "🧹", category: "tools", added: "2026-11-26", version: "0.3.0", enabledByDefault: true,
  description: { en: "Strips tracking junk (utm_, fbclid, gclid…) from links when you copy them.", pl: "Usuwa śledzące parametry (utm_, fbclid, gclid…) z linków, które kopiujesz." },
  start() {
    onCopy = (e) => {
      const sel = String(getSelection() || "").trim();
      if (!/^https?:\/\/\S+$/.test(sel)) return;
      try {
        const u = new URL(sel); let changed = false;
        for (const k of [...u.searchParams.keys()]) if (TRACK.test(k)) { u.searchParams.delete(k); changed = true; }
        if (changed) { e.clipboardData.setData("text/plain", u.toString()); e.preventDefault(); }
      } catch {}
    };
    document.addEventListener("copy", onCopy, true);
  },
  stop() { document.removeEventListener("copy", onCopy, true); },
};

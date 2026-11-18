import * as store from "./store.js";
export const LANGS = { en: "English", pl: "Polski", es: "Español", de: "Deutsch" };
const D = {
  en: { plugins: "Plugins", settings: "Settings", support: "Support", language: "Language", sort: "Sort by",
        newest: "Newest", oldest: "Oldest", az: "A–Z", search: "Search plugins…", none: "No plugins found.",
        supportText: "Need help, found a bug or want to suggest a plugin? Join the official Yapdev server.",
        join: "Join the Yapdev server", version: "Version", added: "Added", notOfficial: "Yapdev is a community mod, not made by Yapper." },
  pl: { plugins: "Wtyczki", settings: "Ustawienia", support: "Pomoc", language: "Język", sort: "Sortuj",
        newest: "Najnowsze", oldest: "Najstarsze", az: "A–Z", search: "Szukaj wtyczek…", none: "Nie znaleziono wtyczek.",
        supportText: "Potrzebujesz pomocy, znalazłeś błąd lub masz pomysł na wtyczkę? Dołącz do oficjalnego serwera Yapdev.",
        join: "Dołącz do serwera Yapdev", version: "Wersja", added: "Dodano", notOfficial: "Yapdev to modyfikacja społeczności, nie jest tworzona przez Yapper." },
  es: { plugins: "Plugins", settings: "Ajustes", support: "Soporte", language: "Idioma", sort: "Ordenar por",
        newest: "Más nuevos", oldest: "Más antiguos", az: "A–Z", search: "Buscar plugins…", none: "No se encontraron plugins.",
        supportText: "¿Necesitas ayuda, encontraste un error o quieres sugerir un plugin? Únete al servidor oficial de Yapdev.",
        join: "Unirse al servidor de Yapdev", version: "Versión", added: "Añadido", notOfficial: "Yapdev es un mod de la comunidad, no lo crea Yapper." },
  de: { plugins: "Plugins", settings: "Einstellungen", support: "Support", language: "Sprache", sort: "Sortieren nach",
        newest: "Neueste", oldest: "Älteste", az: "A–Z", search: "Plugins suchen…", none: "Keine Plugins gefunden.",
        supportText: "Hilfe nötig, Fehler gefunden oder Plugin-Idee? Tritt dem offiziellen Yapdev-Server bei.",
        join: "Yapdev-Server beitreten", version: "Version", added: "Hinzugefügt", notOfficial: "Yapdev ist eine Community-Mod, nicht von Yapper." },
};
export const t = (k) => (D[store.get().lang] || D.en)[k] ?? D.en[k] ?? k;

Object.assign(D.en, { account: "Your account", yourId: "Your Yapper ID", notDetected: "Not detected yet. Log in and open your profile, then reopen this menu.", copy: "Copy ID", copied: "Copied!", requestBadge: "Request a badge" });
Object.assign(D.pl, { account: "Twoje konto", yourId: "Twoje ID w Yapper", notDetected: "Jeszcze nie wykryto. Zaloguj się i otwórz profil, potem otwórz to menu ponownie.", copy: "Kopiuj ID", copied: "Skopiowano!", requestBadge: "Poproś o odznakę" });
Object.assign(D.es, { account: "Tu cuenta", yourId: "Tu ID de Yapper", notDetected: "Aún no detectado. Inicia sesión y abre tu perfil, luego reabre este menú.", copy: "Copiar ID", copied: "¡Copiado!", requestBadge: "Pedir una insignia" });
Object.assign(D.de, { account: "Dein Konto", yourId: "Deine Yapper-ID", notDetected: "Noch nicht erkannt. Melde dich an, öffne dein Profil und öffne dieses Menü erneut.", copy: "ID kopieren", copied: "Kopiert!", requestBadge: "Badge anfragen" });

export const tx = (o) => (typeof o === "string" ? o : (o && (o[store.get().lang] || o.en)) || "");
Object.assign(D.en, { all: "All", visual: "Visual", privacy: "Privacy", tools: "Tools", social: "Social", reset: "Reset all plugins", resetNote: "Turns every plugin back to its default.", hotkeys: "Ctrl+K command palette · Ctrl+Shift+Y open Yapdev", github: "Open GitHub", on: "On", about: "About" });
Object.assign(D.pl, { all: "Wszystkie", visual: "Wygląd", privacy: "Prywatność", tools: "Narzędzia", social: "Społeczność", reset: "Zresetuj wszystkie wtyczki", resetNote: "Przywraca każdej wtyczce ustawienia domyślne.", hotkeys: "Ctrl+K paleta poleceń · Ctrl+Shift+Y otwiera Yapdev", github: "Otwórz GitHub", on: "Wł.", about: "O programie" });
Object.assign(D.es, { all: "Todos", visual: "Visual", privacy: "Privacidad", tools: "Herramientas", social: "Social", reset: "Restablecer plugins", resetNote: "Devuelve cada plugin a su valor predeterminado.", hotkeys: "Ctrl+K paleta de comandos · Ctrl+Shift+Y abre Yapdev", github: "Abrir GitHub", on: "Act.", about: "Acerca de" });
Object.assign(D.de, { all: "Alle", visual: "Optik", privacy: "Privatsphäre", tools: "Werkzeuge", social: "Social", reset: "Alle Plugins zurücksetzen", resetNote: "Setzt jedes Plugin auf den Standard zurück.", hotkeys: "Strg+K Befehlspalette · Strg+Shift+Y öffnet Yapdev", github: "GitHub öffnen", on: "An", about: "Info" });

Object.assign(D.en, { active: "active" });
Object.assign(D.pl, { active: "aktywne" });
Object.assign(D.es, { active: "activos" });
Object.assign(D.de, { active: "aktiv" });

Object.assign(D.en, { home: "Home", welcome: "Welcome back", quick: "Quick toggles", whatsNew: "What's new", backup: "Backup & restore", ioNote: "Export your settings as text, or paste settings here and import them.", export: "Export", import: "Import", exported: "Settings copied!", imported: "Settings imported!", invalid: "That doesn't look like valid settings." });
Object.assign(D.pl, { home: "Start", welcome: "Witaj z powrotem", quick: "Szybkie przełączniki", whatsNew: "Co nowego", backup: "Kopia i przywracanie", ioNote: "Wyeksportuj ustawienia jako tekst albo wklej tutaj ustawienia i zaimportuj je.", export: "Eksportuj", import: "Importuj", exported: "Skopiowano ustawienia!", imported: "Zaimportowano ustawienia!", invalid: "To nie wygląda na poprawne ustawienia." });

Object.assign(D.en, { theme: "Menu theme", themeNote: "Pick the colors of the Yapdev menu." });
Object.assign(D.pl, { theme: "Motyw menu", themeNote: "Wybierz kolory menu Yapdev." });

Object.assign(D.en, { badgeSet: "Badge set" });
Object.assign(D.pl, { badgeSet: "Zestaw odznak" });
Object.assign(D.es, { badgeSet: "Conjunto de insignias" });
Object.assign(D.de, { badgeSet: "Abzeichen-Set" });

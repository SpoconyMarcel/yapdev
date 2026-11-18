const fs = require("fs");
const path = require("path");

const shim = (distFile) => `const path = require("path"), fs = require("fs"), electron = require("electron");
const orig = path.join(__dirname, "..", "_app.asar");
const DIST = ${JSON.stringify(distFile)};
function readMod() {
  let profile = {};
  try { profile = JSON.parse(fs.readFileSync(path.join(path.dirname(DIST), "profile.json"), "utf8")); } catch (e) {}
  for (const f of [DIST, path.join(__dirname, "yapdev.js")]) {
    try { return "window.__YAPDEV_PROFILE=" + JSON.stringify(profile) + ";" + fs.readFileSync(f, "utf8"); } catch (e) {}
  }
  return "";
}
electron.app.on("browser-window-created", (_, win) => {
  win.webContents.on("dom-ready", () => {
    const code = readMod();
    if (code) win.webContents.executeJavaScript(code).catch(() => {});
  });
});
try {
  const pkg = require(path.join(orig, "package.json"));
  require.main.filename = path.join(orig, pkg.main);
  electron.app.setAppPath(orig);
  require(path.join(orig, pkg.main));
} catch (e) { console.error("[Yapdev] could not start original app:", e); }
`;

function findResources(dir) {
  if (!dir || !fs.existsSync(dir)) return null;
  if (path.basename(dir).toLowerCase() === "resources") return dir;
  const direct = path.join(dir, "resources");
  if (fs.existsSync(direct)) return direct;
  try {
    const subs = fs.readdirSync(dir).filter((n) => /^app-/.test(n)).sort().reverse();
    for (const s of subs) {
      const r = path.join(dir, s, "resources");
      if (fs.existsSync(r)) return r;
    }
  } catch {}
  return null;
}

function detect() {
  const local = process.env.LOCALAPPDATA || "";
  const pf = process.env.ProgramFiles || "";
  const pf86 = process.env["ProgramFiles(x86)"] || "";
  const names = ["Yapper", "Yapin", "Yapin'", "Yapper Desktop"];
  for (const root of [path.join(local, "Programs"), local, pf, pf86]) {
    for (const n of names) {
      const r = findResources(path.join(root, n));
      if (r) return r;
    }
  }
  return null;
}

function installDir(res) {
  const d = path.dirname(res);
  return /^app-/.test(path.basename(d)) ? path.dirname(d) : d;
}

function detectAll() {
  const local = process.env.LOCALAPPDATA || "";
  const pf = process.env.ProgramFiles || "";
  const pf86 = process.env["ProgramFiles(x86)"] || "";
  const names = ["Yapper", "Yapin", "Yapin'", "Yapper Desktop"];
  const out = [], seen = new Set();
  for (const root of [path.join(local, "Programs"), local, pf, pf86])
    for (const n of names) {
      const res = findResources(path.join(root, n));
      if (res && !seen.has(res)) { seen.add(res); out.push({ label: n, dir: installDir(res), res, status: status(res) }); }
    }
  return out;
}

// Finds the .exe to close/restart (handles Squirrel-style app-x.y.z installs too).
function getExe(res) {
  const dir = path.dirname(res);
  let name = null;
  try { name = fs.readdirSync(dir).find((n) => /\.exe$/i.test(n) && !/uninstall|update|squirrel|crash|elevate/i.test(n)) || null; } catch {}
  let launch = name ? { cmd: path.join(dir, name), args: [] } : null;
  if (/^app-/.test(path.basename(dir)) && name) {
    const upd = path.join(path.dirname(dir), "Update.exe");
    if (fs.existsSync(upd)) launch = { cmd: upd, args: ["--processStart", name] };
  }
  return { name, launch };
}

function status(res) {
  if (!res) return { found: false };
  const asar = fs.existsSync(path.join(res, "app.asar"));
  const bak = fs.existsSync(path.join(res, "_app.asar"));
  const shim = fs.existsSync(path.join(res, "app", "yapdev.js"));
  return { found: true, res, installed: shim && bak && !asar, needsRepair: shim && (!bak || asar), clean: !shim && asar };
}

function install(res, bundle, distFile) {
  const asar = path.join(res, "app.asar");
  const bak = path.join(res, "_app.asar");
  const appDir = path.join(res, "app");
  if (!fs.existsSync(bak)) {
    if (!fs.existsSync(asar)) throw new Error("app.asar not found. This app may not be Electron, or it is packaged differently.");
    fs.renameSync(asar, bak);
  } else if (fs.existsSync(asar)) {
    // Yapper updated itself after patching: keep the new app.asar as the backup.
    fs.rmSync(bak, { force: true });
    fs.renameSync(asar, bak);
  }
  fs.mkdirSync(appDir, { recursive: true });
  fs.writeFileSync(path.join(appDir, "package.json"), JSON.stringify({ name: "yapdev-shim", main: "index.js" }));
  fs.writeFileSync(path.join(appDir, "index.js"), shim(distFile || path.join(appDir, "yapdev.js")));
  fs.copyFileSync(bundle, path.join(appDir, "yapdev.js"));
}

function uninstall(res) {
  const asar = path.join(res, "app.asar");
  const bak = path.join(res, "_app.asar");
  fs.rmSync(path.join(res, "app"), { recursive: true, force: true });
  if (fs.existsSync(bak)) {
    if (fs.existsSync(asar)) fs.rmSync(bak, { force: true }); // keep the newer one
    else fs.renameSync(bak, asar);
  }
}

function repair(res, bundle, distFile) {
  uninstall(res);
  install(res, bundle, distFile);
}

module.exports = { detect, detectAll, getExe, findResources, status, install, uninstall, repair };

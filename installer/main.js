const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const { execFile, spawn } = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");
const patcher = require("./patcher");

let info = { version: require("./package.json").version, sha: "dev", repo: "SpoconyMarcel/yapdev" };
try { info = { ...info, ...require("./buildinfo.json") }; } catch {}

// Like Vencord: files live in the user's data folder (override with YAPDEV_USER_DATA_DIR).
const dataDir = process.env.YAPDEV_USER_DATA_DIR || path.join(process.env.APPDATA || app.getPath("appData"), "Yapdev");
const distDir = path.join(dataDir, "dist");
const distJs = path.join(distDir, "yapdev.js");
const embedded = path.join(__dirname, "bundle", "yapdev.js");
const base = () => `https://github.com/${info.repo}/releases/download/latest/`;

function createWindow() {
  const w = new BrowserWindow({
    width: 820, height: 740, resizable: false, autoHideMenuBar: true, frame: false,
    backgroundColor: "#090911", title: "Yapdev Installer", icon: path.join(__dirname, "assets", "icon.png"),
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true },
  });
  w.loadFile("index.html");
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());

const sh = (cmd, args) => new Promise((r) => execFile(cmd, args, { windowsHide: true }, (e, out) => r(out || "")));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function isRunning(name) {
  if (!name) return false;
  const out = await sh("tasklist", ["/FI", `IMAGENAME eq ${name}`, "/FO", "CSV", "/NH"]);
  return out.toLowerCase().includes(name.toLowerCase());
}
async function closeApp(name) { await sh("taskkill", ["/F", "/IM", name, "/T"]); await wait(1500); }
function startApp(l) { if (l) try { spawn(l.cmd, l.args, { detached: true, stdio: "ignore" }).unref(); } catch {} }

async function download(url) {
  const r = await fetch(url, { headers: { "User-Agent": "YapdevInstaller" } });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return Buffer.from(await r.arrayBuffer());
}
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } };

// Download the newest mod from GitHub; fall back to the copy bundled inside this exe if offline.
async function refreshDist() {
  fs.mkdirSync(distDir, { recursive: true });
  try {
    const js = await download(base() + "yapdev.js");
    const v = await download(base() + "version.json");
    fs.writeFileSync(distJs, js);
    fs.writeFileSync(path.join(distDir, "version.json"), v);
  } catch (e) {
    if (!fs.existsSync(distJs)) fs.copyFileSync(embedded, distJs);
  }
}

const friendly = (e) =>
  ["EBUSY", "EPERM", "EACCES"].includes(e.code)
    ? "Yapper's files are protected or in use. Try again, or run this installer as administrator."
    : e.message;

ipcMain.handle("info", async () => {
  let latest = null;
  try { latest = JSON.parse((await download(base() + "version.json")).toString()); } catch {}
  const local = readJson(path.join(distDir, "version.json"));
  return {
    distDir, repo: info.repo,
    installer: `v${info.version} (${info.sha})`,
    outdated: !!latest && latest.installer !== info.version,
    local: local?.sha || "not downloaded yet",
    latest: latest?.sha || "unavailable (offline?)",
  };
});
ipcMain.handle("whoami", () => { try { return os.userInfo().username; } catch { return ""; } });
ipcMain.handle("win", (ev, a) => { const w = BrowserWindow.fromWebContents(ev.sender); if (!w) return; if (a === "min") w.minimize(); else if (a === "close") w.close(); });
ipcMain.handle("installs", () => patcher.detectAll());
ipcMain.handle("resolve", (_, p) => { const res = patcher.findResources(p); return res ? { label: "Custom", dir: p, res, status: patcher.status(res) } : null; });
ipcMain.handle("browse", async () => {
  const r = await dialog.showOpenDialog({ properties: ["openDirectory"], title: "Select the Yapper install folder" });
  return r.canceled ? null : r.filePaths[0];
});
ipcMain.handle("openDir", () => { fs.mkdirSync(distDir, { recursive: true }); return shell.openPath(distDir); });
ipcMain.handle("openUrl", (_, u) => /^https:\/\//.test(u) && shell.openExternal(u));

ipcMain.handle("run", async (ev, action, res) => {
  const send = (plan, i) => ev.sender.send("step", { plan, i });
  try {
    const exe = patcher.getExe(res);
    const wasRunning = await isRunning(exe.name);
    const restart = !!exe.launch && (action !== "uninstall" || wasRunning);
    const plan = [];
    if (wasRunning) plan.push("closing");
    if (action !== "uninstall") plan.push("downloading");
    plan.push("patching");
    if (restart) plan.push("starting");
    let i = 0;
    const next = () => send(plan, i++);
    if (wasRunning) { next(); await closeApp(exe.name); }          // close Yapper automatically
    if (action !== "uninstall") {
      next(); await refreshDist();
      try { fs.writeFileSync(path.join(distDir, "profile.json"), JSON.stringify({ name: os.userInfo().username })); } catch {}
    }    // newest mod from GitHub
    next(); patcher[action](res, distJs, distJs);
    if (restart) { next(); startApp(exe.launch); await wait(600); } // and start it again
    send(plan, plan.length);
    return { ok: true, status: patcher.status(res), restarted: restart };
  } catch (e) { return { ok: false, error: friendly(e) }; }
});

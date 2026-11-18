const { contextBridge, ipcRenderer } = require("electron");
const call = (c) => (...a) => ipcRenderer.invoke(c, ...a);
contextBridge.exposeInMainWorld("api", {
  info: call("info"), whoami: call("whoami"), win: call("win"), installs: call("installs"), resolve: call("resolve"), browse: call("browse"),
  openDir: call("openDir"), openUrl: call("openUrl"), run: call("run"),
  onStep: (cb) => ipcRenderer.on("step", (_, d) => cb(d)),
});

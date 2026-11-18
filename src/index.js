import { startAll } from "./plugins/index.js";
import { mount } from "./ui.js";

if (!window.__yapdev) {
  window.__yapdev = true;
  const init = () => { startAll(); mount(); };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
}

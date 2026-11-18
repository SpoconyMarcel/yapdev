const esbuild = require("esbuild");
const fs = require("fs");

esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "chrome110",
  outfile: "dist/yapdev.js",
}).then(() => {
  fs.mkdirSync("installer/bundle", { recursive: true });
  fs.copyFileSync("dist/yapdev.js", "installer/bundle/yapdev.js");
  console.log("Yapdev bundle built.");
}).catch(() => process.exit(1));

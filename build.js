/* Production build for the Mesh Finance website.
 *
 * The site is authored as classic (non-module) JSX loaded via
 * <script type="text/babel"> and compiled in the browser by @babel/standalone
 * — great for editing, but every visitor downloads ~3 MB of Babel + the React
 * *development* builds and compiles the whole site on-device.
 *
 * This build compiles that JSX once, ahead of time, into a single minified
 * app.min.js and emits a ./dist tree whose index.html loads the *production*
 * React builds with no Babel. Runtime semantics are unchanged: the files are
 * transformed individually and concatenated in the SAME order the browser
 * loads them, so they still share one global scope exactly as before.
 *
 * Local dev is untouched — keep using ui_kits/website/index.html with Babel in
 * the browser. This script only writes to ./dist (which is gitignored) and is
 * run by CI before deploying. Run locally with `npm run build`.
 */
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = __dirname;
const WEB = path.join(ROOT, "ui_kits", "website");
const DIST = path.join(ROOT, "dist");
const DIST_WEB = path.join(DIST, "ui_kits", "website");
const INDEX = path.join(WEB, "index.html");

/* Top-level files/dirs copied verbatim into the deploy artifact. */
const COPY = ["assets", "tokens", "styles.css", "server.js", "robots.txt", "sitemap.xml", "ui_kits"];

function log(msg) { console.log("[build] " + msg); }

/* 1. Read the source index.html and pull out the ordered list of JSX scripts
 *    the browser compiles (the design-system bundle in <head> first, then
 *    icons, header, footer, each screen, and App last). */
const srcHtml = fs.readFileSync(INDEX, "utf8");
const babelSrcs = [...srcHtml.matchAll(/<script type="text\/babel" src="([^"]+)"><\/script>/g)].map(m => m[1]);
if (babelSrcs.length === 0) throw new Error("No <script type=text/babel> tags found in index.html");
log(`bundling ${babelSrcs.length} JSX files`);

/* 2. Compile each JSX file individually (classic React.createElement, minified)
 *    and concatenate — mirroring the browser's per-script, shared-global model.
 *    Identifiers are NOT renamed so the global window.Mesh* registrations and
 *    cross-file references keep working. */
let bundle = "";
for (const src of babelSrcs) {
  const file = path.resolve(WEB, src);
  const code = fs.readFileSync(file, "utf8");
  const out = esbuild.transformSync(code, {
    loader: "jsx",
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    minifyWhitespace: true,
    minifySyntax: true,
    minifyIdentifiers: false,
    charset: "utf8",
  });
  bundle += `/* ${path.basename(file)} */\n${out.code}\n`;
}

/* 3. Produce the production index.html: production React, no Babel, no per-file
 *    <script type=text/babel> tags — just the plain data scripts and app.min.js. */
let outHtml = srcHtml
  .replace("react.development.js", "react.production.min.js")
  .replace("react-dom.development.js", "react-dom.production.min.js")
  // strip Subresource Integrity from the React tags (hashes were for the dev files)
  .replace(/<script\s+src="[^"]*react[^"]*"[^>]*><\/script>/g, m => m.replace(/\s+integrity="[^"]*"/, ""))
  // drop the in-browser Babel compiler
  .replace(/\s*<script src="https:\/\/unpkg\.com\/@babel\/standalone[^"]*"[^>]*><\/script>/g, "")
  // drop every JSX script tag (design-system bundle, icons, screens, App)
  .replace(/\s*<script type="text\/babel"[^>]*><\/script>/g, "")
  // load the compiled bundle last, after the plain data scripts
  .replace("</body>", '<script src="app.min.js"></script>\n</body>');

if (/text\/babel/.test(outHtml) || /standalone/.test(outHtml)) {
  throw new Error("index.html transform left Babel references behind");
}

/* 4. Assemble ./dist: clean, copy the static tree, drop the now-bundled JSX
 *    sources, then write the bundle, production index.html and a runtime-only
 *    package.json (no devDependencies for the host to install). */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
for (const item of COPY) {
  fs.cpSync(path.join(ROOT, item), path.join(DIST, item), { recursive: true });
}
for (const f of fs.readdirSync(DIST_WEB)) {
  if (f.endsWith(".jsx")) fs.rmSync(path.join(DIST_WEB, f));
}
fs.writeFileSync(path.join(DIST_WEB, "app.min.js"), bundle);
fs.writeFileSync(path.join(DIST_WEB, "index.html"), outHtml);

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
delete pkg.devDependencies;
delete pkg.scripts.build;
fs.writeFileSync(path.join(DIST, "package.json"), JSON.stringify(pkg, null, 2) + "\n");

const kb = (Buffer.byteLength(bundle) / 1024).toFixed(0);
log(`wrote dist/ui_kits/website/app.min.js (${kb} KB)`);
log("done");

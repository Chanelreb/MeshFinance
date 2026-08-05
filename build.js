/* Production build for the Mesh Finance website.
 *
 * The site is authored as classic (non-module) JSX loaded via
 * <script type="text/babel"> and compiled in the browser by @babel/standalone
 * — great for editing, but every visitor downloads ~3 MB of Babel + the React
 * *development* builds and compiles the whole site on-device.
 *
 * This build compiles that JSX once, ahead of time, into a single minified
 * ui_kits/website/app.min.js and rewrites ui_kits/website/index.html to load the
 * *production* React builds with no Babel. Runtime semantics are unchanged: the
 * files are transformed individually and concatenated in the SAME order the
 * browser loads them, so they still share one global scope exactly as before.
 *
 * It runs IN PLACE so the existing, proven `rsync ./` deploy ships the built
 * files with no pipeline changes. To avoid clobbering the editable dev file
 * during local runs, index.html is only overwritten when running in CI; locally
 * the production HTML is written to index.prod.html for inspection. app.min.js
 * and index.prod.html are gitignored build artifacts.
 *
 * Local dev is untouched — keep using ui_kits/website/index.html with Babel in
 * the browser. Run the build with `npm run build`.
 */
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = __dirname;
const WEB = path.join(ROOT, "ui_kits", "website");
const INDEX = path.join(WEB, "index.html");
const IN_CI = process.env.CI === "true" || process.env.BUILD_INPLACE === "1";

function log(msg) { console.log("[build] " + msg); }

/* 1. Read the source index.html and pull out the ordered list of JSX scripts
 *    the browser compiles (design-system bundle in <head> first, then icons,
 *    header, footer, each screen, and App last). */
const srcHtml = fs.readFileSync(INDEX, "utf8");
if (!/text\/babel/.test(srcHtml)) {
  throw new Error("index.html has no <script type=text/babel> tags — is it already built? Restore the dev index.html first.");
}
const babelSrcs = [...srcHtml.matchAll(/<script type="text\/babel" src="([^"]+)"><\/script>/g)].map(m => m[1]);
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

/* 3. Production index.html: production React, no Babel, no per-file
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

/* 4. Write the artifacts. In CI, overwrite index.html so `rsync ./` ships the
 *    production page; locally, write index.prod.html and leave the dev file. */
fs.writeFileSync(path.join(WEB, "app.min.js"), bundle);
const htmlTarget = IN_CI ? INDEX : path.join(WEB, "index.prod.html");
fs.writeFileSync(htmlTarget, outHtml);

const kb = (Buffer.byteLength(bundle) / 1024).toFixed(0);
log(`wrote ui_kits/website/app.min.js (${kb} KB)`);
log(`wrote ${path.relative(ROOT, htmlTarget)}${IN_CI ? " (in place)" : " (dev index.html left untouched)"}`);
log("done");

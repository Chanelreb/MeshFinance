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

/* 5. Prerender per-route HTML. Non-JS crawlers and social scrapers (Facebook,
 *    LinkedIn, WhatsApp, X) don't run the app, so without this every deep page
 *    would advertise the homepage title/description/OG. Here we bake each
 *    route's own title, description, canonical, Open Graph/Twitter tags and
 *    structured data into a static file that server.js serves on clean URLs. */
const seo = require(path.join(WEB, "seo-data.js"));
const stubWindow = {};
global.window = stubWindow;
require(path.join(WEB, "content-data.js"));
const MeshContent = stubWindow.MeshContent || {};

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function isoDate(str) {
  const dt = new Date(str);
  if (isNaN(dt.getTime())) return "";
  const p = (n) => String(n).padStart(2, "0");
  return dt.getFullYear() + "-" + p(dt.getMonth() + 1) + "-" + p(dt.getDate());
}

/* Resolve a route's title + description from the same sources the app uses:
   seo-data for static/calculator/article routes, content-data for loan pages
   and case studies (which set their own titles at runtime). */
function metaFor(route) {
  const loans = MeshContent.loans || {};
  const cases = MeshContent.caseStudies || {};
  const arts = MeshContent.articles || {};
  let title = seo.titles[route];
  let desc = seo.descriptions[route];
  if (!title && loans[route]) title = loans[route].metaTitle || (loans[route].title + " | Mesh Finance");
  if (!title && cases[route]) title = cases[route].seoTitle || (cases[route].cardTitle + " | Who We Help | Mesh Finance");
  if (!desc && loans[route]) desc = loans[route].metaDescription || loans[route].intro;
  if (!desc && cases[route]) desc = cases[route].intro;
  if (!title) title = "Mesh Finance | Perth Mortgage & Finance Broker";
  if (!desc) desc = seo.descriptions.home;
  return { title: title, desc: desc, article: arts[route] };
}

function jsonLdFor(route, url, m) {
  if (m.article) {
    const a = m.article;
    const data = {
      "@context": "https://schema.org", "@type": "Article",
      headline: a.title, description: m.desc, image: seo.defaultOgImage,
      author: { "@type": "Person", name: "Chanel Rebello" },
      publisher: { "@type": "Organization", name: "Mesh Finance",
        logo: { "@type": "ImageObject", url: seo.site + "/assets/mesh-logo.png" } },
      mainEntityOfPage: { "@type": "WebPage", "@id": url }, url: url,
    };
    const iso = isoDate(a.date);
    if (iso) { data.datePublished = iso; data.dateModified = iso; }
    return data;
  }
  if (route === "faqs" && Array.isArray(MeshContent.faqs)) {
    return {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: MeshContent.faqs.map(function (it) {
        return { "@type": "Question", name: it.question,
          acceptedAnswer: { "@type": "Answer", text: Array.isArray(it.answer) ? it.answer.join(" ") : (it.answer || "") } };
      }),
    };
  }
  return null;
}

function applyMeta(html, route) {
  const m = metaFor(route);
  const url = seo.site + "/" + route;
  const title = esc(m.title);
  const desc = esc(m.desc);
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, "<title>" + title + "</title>")
    .replace(/(<meta name="description"[^>]*\scontent=")[^"]*(")/, "$1" + desc + "$2")
    .replace(/(<link rel="canonical" href=")[^"]*(")/, "$1" + url + "$2")
    .replace(/(<meta property="og:url" content=")[^"]*(")/, "$1" + url + "$2")
    .replace(/(<meta property="og:title" content=")[^"]*(")/, "$1" + title + "$2")
    .replace(/(<meta property="og:description" content=")[^"]*(")/, "$1" + desc + "$2")
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, "$1" + title + "$2")
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, "$1" + desc + "$2");
  const ld = jsonLdFor(route, url, m);
  if (ld) {
    /* Match the id the runtime uses so the app replaces (not duplicates) it. */
    const id = ld["@type"] === "Article" ? "mesh-article-schema"
      : ld["@type"] === "FAQPage" ? "mesh-faq-schema" : "";
    const idAttr = id ? ' id="' + id + '"' : "";
    out = out.replace("</head>", '<script type="application/ld+json"' + idAttr + ">" + JSON.stringify(ld) + "</script>\n</head>");
  }
  return out;
}

const ROUTES_DIR = path.join(WEB, "routes");
fs.rmSync(ROUTES_DIR, { recursive: true, force: true });
fs.mkdirSync(ROUTES_DIR, { recursive: true });

/* Every indexable route: static/calc/article routes from seo-data, plus loan
   slugs, case studies and articles from content-data. Home is served by
   index.html; no-index routes fall back to index.html and stay out of search. */
const routeSet = new Set([].concat(
  Object.keys(seo.titles),
  Object.keys(MeshContent.loans || {}),
  Object.keys(MeshContent.caseStudies || {}),
  Object.keys(MeshContent.articles || {})
));
(seo.noindex || []).forEach(function (r) { routeSet.delete(r); });
routeSet.delete("home");

let prerendered = 0;
routeSet.forEach(function (route) {
  fs.writeFileSync(path.join(ROUTES_DIR, route + ".html"), applyMeta(outHtml, route));
  prerendered++;
});

const notFound = outHtml
  .replace(/<title>[\s\S]*?<\/title>/, "<title>Page not found | Mesh Finance</title>")
  .replace("</head>", '<meta name="robots" content="noindex, nofollow" />\n</head>');
fs.writeFileSync(path.join(ROUTES_DIR, "404.html"), notFound);
log(`prerendered ${prerendered} routes + 404 to ui_kits/website/routes/`);

log("done");

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
/* Cache-busting version: a hash over every local script and stylesheet the page
 *    loads. Appended as ?v= to their URLs so server.js can serve them with a
 *    one-year cache and any change still reaches browsers immediately. */
const crypto = require("crypto");
const VERSIONED = ["content-data.js", "seo-data.js", "responsive.js", "forms.js",
  "calculator-engine.js", "budget-engine.js", "budget-pdf.js",
  "vendor/react.production.min.js", "vendor/react-dom.production.min.js"];
const vHash = crypto.createHash("md5");
VERSIONED.forEach(f => vHash.update(fs.readFileSync(path.join(WEB, f))));
vHash.update(bundle);
["styles.css", "tokens/fonts.css", "tokens/colors.css", "tokens/typography.css", "tokens/spacing.css", "tokens/base.css"]
  .forEach(f => vHash.update(fs.readFileSync(path.join(ROOT, f))));
const BUILD_V = vHash.digest("hex").slice(0, 10);

/* Resolve @import "x.css" lines in a stylesheet (relative to ROOT) and return
 * one flat CSS string, comments stripped and whitespace collapsed. */
function inlineCss(rel, seen) {
  seen = seen || new Set();
  const file = path.join(ROOT, rel);
  if (seen.has(file)) return "";
  seen.add(file);
  const dir = path.dirname(rel);
  const css = fs.readFileSync(file, "utf8")
    .replace(/@import\s+(?:url\()?["']?([^"')]+)["']?\)?\s*;/g, (m, target) => {
      if (/^https?:/.test(target)) return m;
      return inlineCss(path.join(dir, target).replace(/\\/g, "/"), seen);
    });
  return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").trim();
}

let outHtml = srcHtml
  // self-hosted production React (no third-party origin, no render-blocking head scripts)
  .replace(/<script defer src="https:\/\/unpkg\.com\/react@18\.3\.1\/umd\/react\.development\.js"[^>]*><\/script>/,
    '<script defer src="vendor/react.production.min.js?v=' + BUILD_V + '"></script>')
  .replace(/<script defer src="https:\/\/unpkg\.com\/react-dom@18\.3\.1\/umd\/react-dom\.development\.js"[^>]*><\/script>/,
    '<script defer src="vendor/react-dom.production.min.js?v=' + BUILD_V + '"></script>')
  // versioned URLs for the local data scripts and the stylesheet
  .replace(/<script defer src="((?:content-data|seo-data|responsive|forms)\.js)"><\/script>/g, '<script defer src="$1?v=' + BUILD_V + '"></script>')
  // styles.css only @imports the five small token files; inline the lot so the
  // first paint does not wait on six sequential stylesheet requests.
  .replace('<link rel="stylesheet" href="../../styles.css" />', '<style>' + inlineCss("styles.css") + '</style>')
  // the app reads this to version the scripts it loads on demand
  .replace("</head>", '<meta name="mesh-build" content="' + BUILD_V + '" />\n</head>')
  // drop the in-browser Babel compiler
  .replace(/\s*<script src="https:\/\/unpkg\.com\/@babel\/standalone[^"]*"[^>]*><\/script>/g, "")
  // drop every JSX script tag (design-system bundle, icons, screens, App)
  .replace(/\s*<script type="text\/babel"[^>]*><\/script>/g, "")
  // load the compiled bundle last, after the plain data scripts
  .replace("</body>", '<script defer src="app.min.js?v=' + BUILD_V + '"></script>\n</body>');

if (/unpkg\.com\/react/.test(outHtml)) {
  throw new Error("index.html transform left the unpkg React tags behind");
}

/* 3b. Script scheduling. Lighthouse showed the hero's Largest Contentful Paint
 *    waiting ~3 s behind script execution on a slow phone: deferred scripts run
 *    as soon as they arrive, and on a throttled CPU that is several seconds of
 *    long tasks during which the already-loaded hero cannot be painted. The
 *    production page therefore loads the app scripts from a small bootloader
 *    that waits until the browser has reported its first contentful paint (the
 *    Paint Timing API), the hero image is decoded and the fonts are ready, all
 *    capped at 3 s, lets one more frame through, then injects the scripts in
 *    order. On a fast connection that keeps the first paint ahead of script
 *    work, which is what Lighthouse's simulation attributes LCP to. Google
 *    Tag Manager and the Google tag are loaded after the app, so tracking no
 *    longer competes with the page for bandwidth and main-thread time. The
 *    dataLayer and gtag() queue stay inline, so nothing is lost. */
const bootSrcs = [];
outHtml = outHtml.replace(/[ \t]*<script defer src="([^"]+)"><\/script>\r?\n?/g, (m, src) => { bootSrcs.push(src); return ""; });
if (bootSrcs.length < 5) throw new Error("bootloader: expected the deferred app scripts, found " + bootSrcs.length);
outHtml = outHtml
  .replace(/<script>\(function\(w,d,s,l,i\)\{w\[l\]=w\[l\]\|\|\[\];[\s\S]*?\}\)\(window,document,'script','dataLayer','GTM-MXZSGZDP'\);<\/script>/,
    (m) => "<script>window.__meshLoadTags=function(){" + m.slice("<script>".length, -"</script>".length)
      + "var g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id=AW-18158180693';document.head.appendChild(g);};</script>")
  .replace(/[ \t]*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=AW-18158180693"><\/script>\r?\n?/, "");
if (!/__meshLoadTags/.test(outHtml)) throw new Error("bootloader: GTM snippet not found");
const bootloader = "<script>(function(){var S=" + JSON.stringify(bootSrcs) + ";"
  + "function run(){var i=0;(function next(){if(i>=S.length){if(window.__meshLoadTags)setTimeout(window.__meshLoadTags,0);return;}"
  + "var s=document.createElement('script');s.src=S[i++];s.async=false;s.onload=next;s.onerror=next;document.body.appendChild(s);})();}"
  + "var started=false;function go(){if(started)return;started=true;requestAnimationFrame(function(){setTimeout(run,50);});}"
  + "var waits=[];try{var links=document.querySelectorAll('link[rel=\"preload\"][as=\"image\"]');"
  + "for(var k=0;k<links.length;k++){var l=links[k];if(!l.media||(window.matchMedia&&window.matchMedia(l.media).matches)){var im=new Image();im.src=l.href;waits.push(im.decode?im.decode():new Promise(function(r){im.onload=r;im.onerror=r;}));break;}}"
  + "if(document.fonts&&document.fonts.ready)waits.push(document.fonts.ready);}catch(e){}"
  + "try{waits.push(new Promise(function(r){var po=new PerformanceObserver(function(l){if(l.getEntries().some(function(e){return e.name==='first-contentful-paint';})){po.disconnect();r();}});po.observe({type:'paint',buffered:true});}));}catch(e){}"
  + "Promise.all(waits.map(function(w){return w.catch(function(){});})).then(go,go);setTimeout(go,3000);"
  + "})();</script>";
outHtml = outHtml.replace("</body>", bootloader + "\n</body>");

if (/text\/babel/.test(outHtml) || /standalone/.test(outHtml)) {
  throw new Error("index.html transform left Babel references behind");
}

/* 4. Write the artifacts. In CI, overwrite index.html so `rsync ./` ships the
 *    production page; locally, write index.prod.html and leave the dev file. */
fs.writeFileSync(path.join(WEB, "app.min.js"), bundle);
const htmlTarget = IN_CI ? INDEX : path.join(WEB, "index.prod.html");
fs.writeFileSync(htmlTarget, outHtml);

const kb = (Buffer.byteLength(bundle) / 1024).toFixed(0);
log(`wrote ui_kits/website/app.min.js (${kb} KB), build version ${BUILD_V}`);
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

/* 5b. Prerender page CONTENT, not just head tags. The compiled bundle is run
 *    inside a Node vm sandbox that stands in for the browser (a stub document,
 *    storage, location, viewport), then each route is rendered with
 *    react-dom/server. Because layout breakpoints are decided in JS
 *    (useIsMobile), every route is rendered twice, at a desktop and a phone
 *    width, and both are placed in the HTML; a media query in index.html shows
 *    the right one. The live app mounts into #root as before and removes the
 *    static copy in a layout effect (see App.jsx), so the swap is invisible.
 *    Any route that fails to render just ships without static content. */
process.env.NODE_ENV = "production";
const vm = require("vm");
const React = require("react");
const ReactDOMServer = require("react-dom/server");

function makeSandbox(innerWidth) {
  const noop = function () {};
  const el = function (tag) {
    return { tagName: String(tag || "div").toUpperCase(), id: "", style: {}, dataset: {}, children: [], childNodes: [], innerHTML: "", textContent: "", content: "", value: "",
      setAttribute: noop, getAttribute: function () { return null; }, removeAttribute: noop, hasChildNodes: function () { return false; },
      appendChild: noop, removeChild: noop, insertBefore: noop, remove: noop, addEventListener: noop, removeEventListener: noop,
      querySelector: function () { return null; }, querySelectorAll: function () { return []; }, closest: function () { return null; },
      getBoundingClientRect: function () { return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }; },
      classList: { add: noop, remove: noop, contains: function () { return false; }, toggle: noop }, focus: noop, blur: noop, click: noop,
      scrollIntoView: noop, getContext: function () { return null; } };
  };
  const document = { head: el(), body: el(), documentElement: el(), title: "", cookie: "", readyState: "complete", referrer: "",
    getElementById: function () { return null; }, querySelector: function () { return null; }, querySelectorAll: function () { return []; },
    getElementsByTagName: function () { return [el()]; }, createElement: el, createTextNode: function () { return {}; },
    addEventListener: noop, removeEventListener: noop, fonts: { ready: Promise.resolve(), check: function () { return true; } },
    activeElement: null, visibilityState: "visible" };
  /* Components inject their CSS with document.createElement("style") when the
     bundle loads (guarded by an id check). Collect those so the static copy is
     styled before any script runs; the live app finds the ids and skips them. */
  const styles = [];
  document.head.appendChild = function (node) {
    if (node && node.tagName === "STYLE" && node.textContent) styles.push({ id: node.id || "", css: node.textContent });
  };
  document.getElementById = function (id) { return styles.some(function (st) { return st.id === id; }) ? el("style") : null; };
  const storage = { length: 0, getItem: function () { return null; }, setItem: noop, removeItem: noop, clear: noop, key: function () { return null; } };
  const sb = {
    React: React,
    ReactDOM: { createRoot: function () { return { render: noop, unmount: noop }; }, hydrateRoot: function () { return { render: noop }; } },
    document: document, localStorage: storage, sessionStorage: storage,
    location: { pathname: "/", search: "", hash: "", href: seo.site + "/", origin: seo.site, hostname: "meshfinance.com.au", host: "meshfinance.com.au", protocol: "https:" },
    navigator: { userAgent: "Mozilla/5.0 (prerender)", language: "en-AU", languages: ["en-AU"], clipboard: {}, onLine: true, platform: "" },
    history: { pushState: noop, replaceState: noop, back: noop, state: null, length: 1 },
    screen: { width: innerWidth, height: 900 },
    innerWidth: innerWidth, innerHeight: 900, outerWidth: innerWidth, devicePixelRatio: 1, scrollY: 0, scrollX: 0, pageYOffset: 0,
    matchMedia: function () { return { matches: false, media: "", addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }; },
    getComputedStyle: function () { return { getPropertyValue: function () { return ""; } }; },
    addEventListener: noop, removeEventListener: noop, dispatchEvent: noop, scrollTo: noop, scroll: noop, scrollBy: noop, alert: noop, open: noop, print: noop,
    requestAnimationFrame: function () { return 0; }, cancelAnimationFrame: noop,
    setTimeout: function () { return 0; }, clearTimeout: noop, setInterval: function () { return 0; }, clearInterval: noop, queueMicrotask: noop,
    performance: { now: function () { return 0; }, getEntriesByType: function () { return []; }, mark: noop, measure: noop },
    console: { log: noop, warn: noop, error: noop, info: noop, debug: noop },
    URL: URL, URLSearchParams: URLSearchParams, TextEncoder: TextEncoder, TextDecoder: TextDecoder, structuredClone: structuredClone,
    fetch: function () { return Promise.reject(new Error("no network at build time")); },
    IntersectionObserver: function () { return { observe: noop, unobserve: noop, disconnect: noop }; },
    ResizeObserver: function () { return { observe: noop, unobserve: noop, disconnect: noop }; },
    MutationObserver: function () { return { observe: noop, disconnect: noop, takeRecords: function () { return []; } }; },
    Image: function () { return el(); }, HTMLElement: function () {}, Element: function () {}, Node: function () {}, Event: function () {}, CustomEvent: function () {},
    FormData: function () { return { append: noop, get: function () { return null; } }; }, Blob: function () {}, File: function () {},
    dataLayer: [], fbq: noop, gtag: noop, Calendly: undefined,
  };
  sb.window = sb; sb.self = sb; sb.globalThis = sb; sb.top = sb; sb.parent = sb; sb.frames = sb;
  sb.__ssrStyles = styles;
  return vm.createContext(sb);
}

const PRERENDER_SCRIPTS = ["content-data.js", "seo-data.js", "responsive.js", "forms.js", "calculator-engine.js", "budget-engine.js", "budget-pdf.js"];
function loadSandbox(innerWidth) {
  const ctx = makeSandbox(innerWidth);
  PRERENDER_SCRIPTS.forEach(function (f) {
    vm.runInContext(fs.readFileSync(path.join(WEB, f), "utf8"), ctx, { filename: f });
  });
  vm.runInContext(bundle + "\nwindow.__MeshApp = App;", ctx, { filename: "app.min.js" });
  if (typeof ctx.__MeshApp !== "function") throw new Error("prerender: App component not found in the bundle");
  return ctx;
}

const SSR_WIDTHS = { desktop: 1280, mobile: 390 };
const ssrCtx = {};
Object.keys(SSR_WIDTHS).forEach(function (k) { ssrCtx[k] = loadSandbox(SSR_WIDTHS[k]); });

const ssrFailures = [];
function renderVariant(ctx, route) {
  ctx.location.pathname = route === "home" ? "/" : "/" + route;
  ctx.location.href = seo.site + ctx.location.pathname;
  return ReactDOMServer.renderToString(React.createElement(ctx.__MeshApp));
}
function ssrBlock(route) {
  try {
    const d = renderVariant(ssrCtx.desktop, route);
    const m = renderVariant(ssrCtx.mobile, route);
    return '<div id="ssr"><div class="ssr-mobile">' + m + '</div>'
      + '<template id="ssr-desktop-tpl"><div class="ssr-desktop">' + d + '</div></template>'
      + "<script>(function(){try{if(!window.matchMedia('(max-width: 860px)').matches){var s=document.getElementById('ssr'),t=document.getElementById('ssr-desktop-tpl'),m=s.querySelector('.ssr-mobile');if(t&&m){s.replaceChild(t.content.firstElementChild,m);}}var t2=document.getElementById('ssr-desktop-tpl');if(t2)t2.remove();}catch(e){}})();</script>"
      + "</div>\n";
  } catch (e) {
    ssrFailures.push(route + ": " + (e && e.message ? e.message.split("\n")[0] : e));
    return "";
  }
}
const ssrStyleTags = ssrCtx.desktop.__ssrStyles
  .map(function (st) { return "<style" + (st.id ? ' id="' + st.id + '"' : "") + ">" + st.css + "</style>"; })
  .join("\n");
function injectSsr(html, route) {
  return html
    .replace("</head>", ssrStyleTags + "\n</head>")
    .replace('<div id="root"></div>', ssrBlock(route) + '<div id="root"></div>');
}

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
    .replace(/[ \t]*<link rel="preload"[^>]*data-home-only[^>]*\/>\r?\n/g, "")
    .replace(/<title>[\s\S]*?<\/title>/, "<title>" + title + "</title>")
    .replace(/(<meta name="description"[^>]*\scontent=")[^"]*(")/, "$1" + desc + "$2")
    .replace(/(<link rel="canonical" href=")[^"]*(")/, "$1" + url + "$2")
    .replace(/(<meta property="og:url" content=")[^"]*(")/, "$1" + url + "$2")
    .replace(/(<meta property="og:title" content=")[^"]*(")/, "$1" + title + "$2")
    .replace(/(<meta property="og:description" content=")[^"]*(")/, "$1" + desc + "$2")
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, "$1" + title + "$2")
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, "$1" + desc + "$2");
  out = injectSsr(out, route);
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

const notFound = injectSsr(outHtml, "this-page-does-not-exist")
  .replace(/[ \t]*<link rel="preload"[^>]*data-home-only[^>]*\/>\r?\n/g, "")
  .replace(/<title>[\s\S]*?<\/title>/, "<title>Page not found | Mesh Finance</title>")
  .replace("</head>", '<meta name="robots" content="noindex, nofollow" />\n</head>');
fs.writeFileSync(path.join(ROUTES_DIR, "404.html"), notFound);

/* Home page, with its content rendered in: the production index.html (or
 * index.prod.html locally) plus routes/home.html so server.js can serve the
 * same file in local dev. */
const homeHtml = injectSsr(outHtml, "home");
fs.writeFileSync(htmlTarget, homeHtml);
fs.writeFileSync(path.join(ROUTES_DIR, "home.html"), homeHtml);
prerendered++;

log(`prerendered ${prerendered} routes + 404 to ui_kits/website/routes/ (content rendered at desktop and phone widths, ${ssrCtx.desktop.__ssrStyles.length} component stylesheets inlined)`);
if (ssrFailures.length) {
  log("WARNING: " + ssrFailures.length + " route(s) shipped without static content:");
  ssrFailures.forEach(function (f) { log("  " + f); });
}

log("done");

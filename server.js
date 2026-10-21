/* Zero-dependency static file server for Node.js hosting (cPanel / Passenger
   friendly). Serves the repository's files as-is. Clean (extensionless) URLs are
   SPA routes: when the build has prerendered per-route HTML (ui_kits/website/
   routes/*.html) each route is served with its own title/description/Open Graph
   tags baked in, and unknown routes return a real 404. Without a build (local
   dev), clean URLs fall back to the single index.html as before. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const WEB = path.join(ROOT, "ui_kits", "website");
const INDEX_HTML = path.join(WEB, "index.html");
const ROUTES_DIR = path.join(WEB, "routes");
const NOT_FOUND_HTML = path.join(ROUTES_DIR, "404.html");
const routesAvailable = fs.existsSync(ROUTES_DIR);

/* Shared route aliases + no-index list (same file the app and build use). */
let SEO = {};
try { SEO = require("./ui_kits/website/seo-data.js"); } catch (e) { /* dev without the file */ }
const ALIASES = SEO.aliases || {};
const NOINDEX = SEO.noindex || [];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
};

function send(res, status, filePath, versioned) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not found");
    }
    /* HTML always revalidates (304 when unchanged). Scripts and stylesheets
       requested with the build's ?v= query (see build.js) are immutable for a
       year, since any change produces a new URL; without it they revalidate.
       Images and fonts use versioned filenames, so they can cache for a week. */
    const ext = path.extname(filePath).toLowerCase();
    const code = [".js", ".jsx", ".css", ".json"].includes(ext);
    const revalidate = ext === ".html" || ext === ".xml" || (code && !versioned);
    res.writeHead(status, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": revalidate ? "no-cache"
        : versioned ? "public, max-age=31536000, immutable"
        : "public, max-age=604800",
    });
    res.end(data);
  });
}

/* "/home-loans" -> "home-loans"; "/" -> "home"; tolerates the app's file path
   and applies SEO aliases, mirroring the client-side router. */
function routeFromPath(urlPath) {
  const p = urlPath
    .replace(/^.*\/ui_kits\/website/, "")
    .replace(/\/index\.html$/, "")
    .replace(/\/+$/, "");
  const seg = p.replace(/^\//, "") || "home";
  return ALIASES[seg] || seg;
}

const server = http.createServer((req, res) => {
  let urlPath, versioned = false;
  try {
    const u = new URL(req.url, "http://localhost");
    urlPath = decodeURIComponent(u.pathname);
    versioned = u.searchParams.has("v");
  } catch {
    res.writeHead(400);
    return res.end("Bad request");
  }

  /* One address per page. Search Console showed the site indexed under both
     www and non-www hosts, with and without trailing slashes, and at legacy
     WordPress URLs. Send all of those to the canonical address with a 301 so
     Google consolidates them. Static assets are left alone. */
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim().toLowerCase();
  const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  if (/^www\.meshfinance\.com\.au$/.test(host)) {
    res.writeHead(301, { Location: "https://meshfinance.com.au" + urlPath + query });
    return res.end();
  }
  if (!path.extname(urlPath)) {
    const stripped = urlPath.length > 1 ? urlPath.replace(/\/+$/, "") : urlPath;
    const seg = stripped.replace(/^\//, "");
    const canon = seg === "home" || ALIASES[seg] === "home" ? "" : ALIASES[seg];
    const target = canon !== undefined ? "/" + canon : stripped;
    if (target !== urlPath) {
      res.writeHead(301, { Location: target + query });
      return res.end();
    }
  }

  /* Never serve dotfiles or dot-directories (.git, .claude, .gitignore, …).
     This also blocks path-traversal segments (../). */
  if (urlPath.split("/").some((seg) => seg.startsWith("."))) {
    res.writeHead(404);
    return res.end("Not found");
  }

  /* Clean (extensionless) URLs are SPA routes. */
  if (!path.extname(urlPath)) {
    if (!routesAvailable) {
      /* No prerendered routes (local dev without a build): single-page fallback. */
      return send(res, 200, INDEX_HTML);
    }
    const route = routeFromPath(urlPath);
    if (route === "home") {
      const homePage = path.join(ROUTES_DIR, "home.html");
      return send(res, 200, fs.existsSync(homePage) ? homePage : INDEX_HTML);
    }
    const pf = path.join(ROUTES_DIR, route + ".html");
    if (pf.startsWith(ROUTES_DIR + path.sep) && fs.existsSync(pf)) {
      return send(res, 200, pf);
    }
    /* Known but intentionally not prerendered (thank-you / booking): serve the
       app shell so the page still works, without a search-facing static file. */
    if (NOINDEX.includes(route)) return send(res, 200, INDEX_HTML);
    /* Genuinely unknown: real 404. */
    return send(res, 404, fs.existsSync(NOT_FOUND_HTML) ? NOT_FOUND_HTML : INDEX_HTML);
  }

  /* Real files with an extension. */
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  send(res, 200, filePath, versioned);
});

server.listen(PORT, () => {
  console.log(`Mesh Finance website serving on port ${PORT}`);
});

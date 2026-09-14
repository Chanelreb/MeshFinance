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

function send(res, status, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not found");
    }
    /* App code/markup changes often, so make browsers revalidate HTML/JS/CSS
       (304 when unchanged). Static media can cache for a day. */
    const ext = path.extname(filePath).toLowerCase();
    const revalidate = [".html", ".js", ".jsx", ".css", ".json", ".xml"].includes(ext);
    res.writeHead(status, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": revalidate ? "no-cache" : "public, max-age=86400",
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
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400);
    return res.end("Bad request");
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
    if (route === "home") return send(res, 200, INDEX_HTML);
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
  send(res, 200, filePath);
});

server.listen(PORT, () => {
  console.log(`Mesh Finance website serving on port ${PORT}`);
});

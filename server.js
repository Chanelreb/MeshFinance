/* Zero-dependency static file server for Node.js hosting (cPanel / Passenger
   friendly). Serves the repository's files as-is; "/" redirects to the
   website entry point. No npm install required on the host. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
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

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400);
    return res.end("Bad request");
  }

  /* Never serve dotfiles or dot-directories (.git, .claude, .gitignore, …). */
  if (urlPath.split("/").some((seg) => seg.startsWith("."))) {
    res.writeHead(404);
    return res.end("Not found");
  }

  /* SPA routing: the app owns every extension-less path (/, /home-loans,
     /contact, …) — serve the single-page app and let the client-side router
     pick the screen from the URL. Paths with a file extension are real files. */
  if (!path.extname(urlPath)) {
    urlPath = "/ui_kits/website/index.html";
  }

  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Mesh Finance website serving on port ${PORT}`);
});

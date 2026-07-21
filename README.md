# Mesh Finance Website

Interactive recreation of the Mesh Finance marketing website, built from the
Mesh Finance Design System. Static HTML/CSS/JSX — React and Babel load from a
CDN and compile in the browser, so there is no build step.

## Run locally

```
npm start
```

Then open http://localhost:3000. Requires Node.js 18+.
No `npm install` needed — the server ([server.js](server.js)) has zero dependencies.

Every screen has a real URL (`/home-loans`, `/contact`, `/calc-stamp-duty`, …):
the server hands any extension-less path to the single-page app, which picks
the screen from the URL. Deep links, reloads, back/forward, and per-page
titles all work, and header/footer links carry real hrefs for crawlers.

## Deploy to Node.js hosting (cPanel "Setup Node.js App")

1. Upload the repository contents to the app folder on the host (or pull from
   GitHub: `https://github.com/Chanelreb/MeshFinance.git`).
2. In cPanel → **Setup Node.js App** → Create Application:
   - **Node.js version**: 18 or newer
   - **Application root**: the folder you uploaded to
   - **Application startup file**: `server.js`
3. Start the application. Skip "Run NPM Install" — there are no dependencies.

The host's Passenger/proxy sets the `PORT` environment variable automatically;
`server.js` reads it and falls back to 3000 locally.

## Structure

- `ui_kits/website/` — the site: `index.html`, screen components, content data
- `styles.css` + `tokens/` — design-system CSS tokens (colors, type, spacing)
- `_ds_bundle.local.jsx` — the design-system component library (Button, Card, …)
- `assets/` — logos and images
- `server.js` — zero-dependency static server for Node.js hosting

## Notes

- The Contact page embeds Calendly (event: `chanel-fqxz/intro-to-mesh-finance-clone`);
  bookings go straight into the connected calendar.
- Hero photos live in `assets/`: the home hero (`hero-home.jpg`) is blended
  behind the heading via a gradient overlay; Financial Toolkit, First Home
  Buyers, and ATO Debt show their photo in a rounded box beside the heading.

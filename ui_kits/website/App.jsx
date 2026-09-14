/* App shell, routes between screens via the URL (History API), so every screen
   has a real address for indexing, sharing, reload, and back/forward. */

/* "/home-loans" -> "home-loans"; "/" -> "home". Tolerates being served from
   the app's file path (/ui_kits/website/...) as well as clean root routes. */
/* All per-route SEO metadata (titles, descriptions, aliases, no-index list)
   lives in seo-data.js (window.MeshSEO), shared with the Node build so the
   prerendered HTML and the live app always agree. */
const MESH_SEO = (typeof window !== "undefined" && window.MeshSEO) || {};
const MESH_ROUTE_ALIASES = MESH_SEO.aliases || {};

function meshRouteFromLocation() {
  let p = window.location.pathname.replace(/\/+$/, "");
  p = p.replace(/^.*\/ui_kits\/website/, "").replace(/\/index\.html$/, "");
  const seg = p.replace(/^\//, "") || "home";
  return MESH_ROUTE_ALIASES[seg] || seg;
}

/* Default titles for screens that don't set their own (LoanScreen and
   CaseStudyScreen manage document.title themselves). See seo-data.js. */
const MESH_TITLES = MESH_SEO.titles || {};

/* Per-page meta descriptions for SEO. Routes without an entry keep the
   default description set in index.html. See seo-data.js. */
const MESH_DESCRIPTIONS = MESH_SEO.descriptions || {};

/* Live-updated <head> tags for the single-page app: canonical URL, Open Graph
   and Twitter cards keep pace with client-side navigation so each route shares
   and indexes as its own page. */
const MESH_SITE = MESH_SEO.site || "https://meshfinance.com.au";
const MESH_NOINDEX = MESH_SEO.noindex || [];

function meshUpsertMeta(attr, key, value) {
  if (!value) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", value);
}

function meshUpsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) { el = document.createElement("link"); el.setAttribute("rel", "canonical"); document.head.appendChild(el); }
  el.setAttribute("href", href);
}

/* Simple 404 for unknown routes. Kept out of the index via noindex (set in the
   title effect below) instead of silently showing the homepage. */
function MeshNotFoundScreen({ onNav }) {
  const { Button } = window.MeshFinanceDesignSystem_5c98d0;
  return (
    <section style={{ maxWidth:640, margin:"0 auto", padding:"80px 28px", textAlign:"center" }}>
      <div style={{ fontFamily:"var(--font-display)", fontSize:64, fontWeight:800, color:"var(--blue-500)", lineHeight:1 }}>404</div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:28, color:"var(--navy-700)", margin:"14px 0 10px" }}>Page not found</h1>
      <p style={{ fontSize:16, lineHeight:1.6, color:"var(--text-body)", margin:"0 0 24px" }}>
        Sorry, we couldn't find that page. It may have moved. Try our home page, or get in touch and we'll point you the right way.
      </p>
      <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
        <Button size="lg" onClick={()=>onNav("home")}>Back to home</Button>
        <Button variant="secondary" size="lg" onClick={()=>onNav("contact")}>Contact us</Button>
      </div>
    </section>
  );
}

function App() {
  const { useState, useEffect, useRef } = React;
  const [route, setRoute] = useState(meshRouteFromLocation());
  const firstRender = useRef(true);

  const onNav = (id) => {
    id = MESH_ROUTE_ALIASES[id] || id;
    setRoute(id);
    const path = id === "home" ? "/" : "/" + id;
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Route classification, used for rendering, per-page titles and 404 handling. */
  const loanSlugs = ["home-loans","investment-home-loans","bad-credit-home-loans","personal-loans","car-loans","leisure-loans","debt-consolidation-loans"];
  const caseStudySlugs = window.MeshContent.caseStudies || {};
  const calcKinds = { "calc-loan-repayment":"loan-repayment", "calc-interest-only":"interest-only",
    "stamp-duty-calculator":"stamp-duty", "calc-borrowing-power":"borrowing-power", "calc-savings":"savings", "calc-extra-repayment":"extra-repayment",
    "calc-lump-sum":"lump-sum", "calc-how-long":"how-long", "calc-offset-vs-redraw":"offset-vs-redraw",
    "calc-max-purchase-price":"max-purchase-price", "calc-funding-position":"funding-position" };
  const screenMap = {
    "financial-toolkit": window.MeshFinancialToolkitScreen,
    "who-we-help": window.MeshWhoWeHelpScreen,
    "first-home-buyers": window.MeshServiceScreen,
    "family-guarantee": window.MeshFamilyGuaranteeScreen,
    "ato-debt": window.MeshAtoDebtScreen,
    "calculator-hub": window.MeshCalculatorHubScreen,
    "money-by-design": window.MeshMoneyByDesignScreen,
    "faqs": window.MeshFAQScreen,
    "knowledge-centre": window.MeshKnowledgeCentreScreen,
    "helpful-articles": window.MeshHelpfulArticlesScreen,
    "my-credit-file": window.MeshMyCreditFileScreen,
    "property-profile-report": window.MeshPropertyProfileReportScreen,
    "request-report": window.MeshRequestReportScreen,
    "referral-hub": window.MeshReferralHubScreen,
    "contact": window.MeshContactScreen,
    "about-us": window.MeshAboutScreen,
    "privacy-policy": window.MeshPrivacyPolicyScreen,
    "terms-conditions": window.MeshTermsConditionsScreen,
    "disclaimer": window.MeshDisclaimerScreen,
    "family-finance-check": window.MeshFamilyFinanceCheckScreen,
    "ffc-thank-you": window.MeshFFCThankYouScreen,
    "family-finance-check-booking": window.MeshFFCBookingScreen,
    "booking-confirmed": window.MeshThankYouScreen,
  };
  const isArticle = !!window.MeshContent.articles[route];
  const known = route === "home" || loanSlugs.includes(route) || !!caseStudySlugs[route]
    || !!calcKinds[route] || isArticle || !!screenMap[route];

  /* Back/forward buttons re-read the route from the URL. */
  useEffect(() => {
    const onPop = () => setRoute(meshRouteFromLocation());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* Per-page titles + meta. Self-titling screens (loans, case studies, articles)
     are deliberately absent from MESH_TITLES so this effect never fights theirs.
     Unknown routes render the 404 screen and are marked noindex. */
  useEffect(() => {
    if (!known) {
      document.title = "Page not found | Mesh Finance";
      meshUpsertMeta("name", "robots", "noindex, nofollow");
      return;
    }
    if (MESH_TITLES[route]) document.title = MESH_TITLES[route];
    const meta = document.querySelector('meta[name="description"]');
    const desc = MESH_DESCRIPTIONS[route] || (meta && (meta.dataset.default || meta.getAttribute("content"))) || "";
    if (meta && desc) meta.setAttribute("content", desc);

    /* Self-referencing canonical + social tags, mirroring the final title that
       any self-titling child screen has already set by the time this runs. */
    const url = MESH_SITE + (route === "home" ? "/" : "/" + route);
    meshUpsertCanonical(url);
    meshUpsertMeta("property", "og:url", url);
    meshUpsertMeta("property", "og:title", document.title);
    meshUpsertMeta("property", "og:description", desc);
    meshUpsertMeta("name", "twitter:title", document.title);
    meshUpsertMeta("name", "twitter:description", desc);
    meshUpsertMeta("name", "robots", MESH_NOINDEX.includes(route) ? "noindex, nofollow" : "index, follow");

    /* Virtual pageview for Google Tag Manager. GTM's All Pages trigger fires
       only on a full page load, so in this single-page app it never sees in-app
       navigation. Pushing this on each route change lets GTM fire the Meta Pixel
       and URL-based conversions on SPA navigation (e.g. landing on the booking
       page after the lead form). Skipped on the initial load, which GTM's own
       All Pages trigger already covers. */
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "spa_pageview",
        page_path: route === "home" ? "/" : "/" + route,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [route]);

  let content;
  if (!known) {
    content = <MeshNotFoundScreen onNav={onNav}/>;
  } else if (loanSlugs.includes(route)) {
    content = <window.MeshLoanScreen onNav={onNav} slug={route}/>;
  } else if (caseStudySlugs[route]) {
    content = <window.MeshCaseStudyScreen key={route} onNav={onNav} slug={route}/>;
  } else if (calcKinds[route]) {
    content = <window.MeshCalculatorScreen key={calcKinds[route]} onNav={onNav} kind={calcKinds[route]}/>;
  } else if (isArticle) {
    content = <window.MeshArticleScreen onNav={onNav} slug={route}/>;
  } else {
    const Screen = screenMap[route] || window.MeshHomeScreen;
    content = <Screen onNav={onNav}/>;
  }

  /* Campaign landing pages hide the site header and footer so they stay
     focused on conversion (they carry their own logo and compliance text). */
  const bare = MESH_BARE_ROUTES.includes(route);

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {!bare && <window.MeshHeader onNav={onNav} current={route}/>}
      <main style={{ flex:1 }}>{content}</main>
      {!bare && <window.MeshFooter onNav={onNav}/>}
      {!bare && <window.MeshChatWidget onNav={onNav}/>}
    </div>
  );
}

const MESH_BARE_ROUTES = ["family-finance-check", "ffc-thank-you", "family-finance-check-booking"];

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);

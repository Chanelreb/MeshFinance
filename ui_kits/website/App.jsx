/* App shell, routes between screens via the URL (History API), so every screen
   has a real address for indexing, sharing, reload, and back/forward. */

/* "/home-loans" -> "home-loans"; "/" -> "home". Tolerates being served from
   the app's file path (/ui_kits/website/...) as well as clean root routes. */
/* Legacy / SEO-friendly URL aliases → canonical route id. Lets URLs that Google
   has already indexed (e.g. /calc-stamp-duty, /contact-us) resolve to the right
   screen and dedupe onto the canonical route rather than falling back to home. */
const MESH_ROUTE_ALIASES = {
  "calc-stamp-duty": "stamp-duty-calculator",
  "contact-us": "contact",
};

function meshRouteFromLocation() {
  let p = window.location.pathname.replace(/\/+$/, "");
  p = p.replace(/^.*\/ui_kits\/website/, "").replace(/\/index\.html$/, "");
  const seg = p.replace(/^\//, "") || "home";
  return MESH_ROUTE_ALIASES[seg] || seg;
}

/* Default titles for screens that don't set their own (LoanScreen and
   CaseStudyScreen manage document.title themselves). */
const MESH_TITLES = {
  "home": "Mesh Finance | Perth Mortgage & Finance Broker",
  "financial-toolkit": "Financial Toolkit | Mesh Finance",
  "who-we-help": "Who We Help | Mesh Finance",
  "first-home-buyers": "WA First Home Buyers | Mesh Finance",
  "family-guarantee": "Family Guarantee Home Loans | Mesh Finance",
  "ato-debt": "ATO Debt Loans | Mesh Finance",
  "calculator-hub": "Calculator Hub | Mesh Finance",
  "calc-loan-repayment": "Loan Repayment Calculator | Mesh Finance",
  "calc-interest-only": "Interest Only Calculator | Mesh Finance",
  "stamp-duty-calculator": "Stamp Duty Calculator | Mesh Finance",
  "calc-borrowing-power": "Borrowing Power Calculator | Mesh Finance",
  "calc-savings": "Saving Calculator | Mesh Finance",
  "calc-extra-repayment": "Extra Repayment Calculator | Mesh Finance",
  "calc-lump-sum": "Lump Sum Repayment Calculator | Mesh Finance",
  "calc-how-long": "How Long to Repay Calculator | Mesh Finance",
  "calc-offset-vs-redraw": "Offset vs Redraw Calculator | Mesh Finance",
  "calc-max-purchase-price": "Maximum Home Purchase Price Calculator | Mesh Finance",
  "faqs": "FAQs | Mesh Finance",
  "knowledge-centre": "Knowledge Centre | Mesh Finance",
  "helpful-articles": "Helpful Articles | Mesh Finance",
  "my-credit-file": "Check Your Credit Report in Australia | Mesh Finance",
  "property-profile-report": "Property Profile Report | Mesh Finance",
  "request-report": "Request a Property Report | Mesh Finance",
  "referral-hub": "Refer a Friend | Mesh Finance",
  "contact": "Book Appointment | Mesh Finance",
  "about-us": "About Us | Mesh Finance",
  "privacy-policy": "Privacy Policy | Mesh Finance",
  "terms-conditions": "Terms and Conditions | Mesh Finance",
  "disclaimer": "Disclaimer | Mesh Finance",
  "family-finance-check": "Family Finance Check for Families | Mesh Finance",
  "ffc-thank-you": "Thank You | Mesh Finance",
  "booking-confirmed": "You're Booked In | Mesh Finance",
  "wa-first-home-buyer-changes-2026": "WA First Home Buyer Changes 2026: New Stamp Duty & FHOG Thresholds",
  "help-to-buy-wa": "Help to Buy WA: Buy With a 2% Deposit | Mesh Finance",
  "ato-debt-lending-solutions-business-owners": "ATO Debt Lending Solutions for Business Owners | Mesh Finance",
  "using-parents-property-as-security-first-home-buyer": "Using a Parent's Property as Security | Mesh Finance",
  "wa-new-home-guarantee-scheme": "WA First Home Buyers: Home Guarantee Scheme | Mesh Finance",
  "protect-your-credit-file": "How to Place and Remove a Credit Ban | Mesh Finance",
};

/* Per-page meta descriptions for SEO. Routes without an entry keep the
   default description set in index.html. */
const MESH_DESCRIPTIONS = {
  "home": "Mesh Finance is a Perth mortgage and finance broker helping with home loans, refinancing, investment, first home buyers, asset finance and debt consolidation.",
  "financial-toolkit": "Explore the finance we arrange at Mesh Finance — home, investment, first home buyer, bad credit, car, personal and debt consolidation loans across Perth.",
  "who-we-help": "See how Mesh Finance helps Perth clients — first home buyers, refinancers, investors, families consolidating debt and borrowers after a bank says no.",
  "about-us": "Meet the Mesh Finance team — founder and finance broker Chanel Rebello, mortgage analyst Jason Varischetti and mortgage broker assistant Kerwin Tansio.",
  "contact": "Book a free, no-obligation chat with Mesh Finance, your Perth mortgage and finance broker. Call, email or schedule a time that suits you.",
  "faqs": "Answers to common questions about home loans, refinancing, deposits, pre-approval and working with a mortgage broker in Perth, from Mesh Finance.",
  "calculator-hub": "Free home loan calculators from Mesh Finance — estimate repayments, borrowing power, stamp duty, offset vs redraw, extra repayments and more.",
  "property-profile-report": "Request a free CoreLogic property valuation report through Mesh Finance to understand a property's estimated value, market trends and comparable sales.",
  "referral-hub": "Refer a friend to Mesh Finance. If someone you know needs a home loan or finance in Perth, connect them with a broker who will look after them.",
  "home-loans": "Home loans made simple with Mesh Finance. We compare 40+ lenders to find a competitive home loan structured around your goals, across Perth and WA.",
  "first-home-buyers": "First home buyer help in WA. Mesh Finance guides you through grants, schemes, deposits and pre-approval so you can buy your first home with confidence.",
  "ato-debt": "ATO tax debt loans through Mesh Finance. Consolidate ATO, private and solicitor debt into a manageable solution and get your finances back on track.",
  "family-finance-check": "Feeling stretched by credit cards, Afterpay, car loans and home loan repayments? Book a Family Finance Check with Mesh Finance and review your debt consolidation options.",
  "family-guarantee": "Family guarantee home loans with Mesh Finance. A parent's property as security can help first home buyers buy sooner with a smaller deposit and avoid LMI.",
  "investment-home-loans": "Investment property loans with Mesh Finance. We help Perth investors structure borrowing, compare 40+ lenders and grow a property portfolio with confidence.",
  "bad-credit-home-loans": "Bad credit home loans in Perth. Defaults, arrears or a low credit score? Mesh Finance works with specialist lenders to find a path to home ownership.",
  "personal-loans": "Personal loans arranged by Mesh Finance for cars, renovations, travel or consolidating debt. Compare competitive rates and flexible terms across Perth.",
  "car-loans": "Car and vehicle finance with Mesh Finance. Compare lenders for competitive rates on new or used cars, novated leases and business vehicles in Perth.",
  "leisure-loans": "Leisure and lifestyle finance from Mesh Finance — caravans, boats, motorbikes and camper trailers. Compare lenders for a loan that suits your budget.",
  "debt-consolidation-loans": "Debt consolidation loans with Mesh Finance. Roll credit cards, personal loans and other debts into one manageable repayment and take back control of your budget.",
  "knowledge-centre": "The Mesh Finance Knowledge Centre — guides, tools and articles on home loans, refinancing, credit and property to help you make informed decisions.",
  "helpful-articles": "Helpful articles from Mesh Finance on home loans, first home buyer schemes, refinancing, credit files and property across Perth and Western Australia.",
  "my-credit-file": "Learn how to check your credit report and score in Australia for free, understand what affects them and how to fix errors, with Mesh Finance.",
  "request-report": "Request a free property report through Mesh Finance. Get a CoreLogic estimate of a property's value, recent sales and suburb market insights.",
  "faqs": "Answers to common questions about home loans, refinancing, deposits, pre-approval and working with a mortgage broker in Perth, from Mesh Finance.",
  "privacy-policy": "Read the Mesh Finance privacy policy to understand how we collect, use, store and protect your personal information.",
  "terms-conditions": "Read the terms and conditions for using the Mesh Finance website and services.",
  "disclaimer": "Important disclaimer for the Mesh Finance website. Information here is general in nature and not personal credit or financial advice.",
  "calc-loan-repayment": "Free loan repayment calculator from Mesh Finance. Estimate your home loan repayments by loan amount, interest rate and term in seconds.",
  "calc-interest-only": "Interest only calculator from Mesh Finance. Compare interest-only and principal-and-interest repayments to see how each affects your home loan.",
  "stamp-duty-calculator": "Stamp duty calculator for WA property from Mesh Finance. Estimate stamp duty and government fees on your next home or investment purchase.",
  "calc-borrowing-power": "Borrowing power calculator from Mesh Finance. Estimate how much you may be able to borrow for a home loan based on your income and expenses.",
  "calc-savings": "Savings calculator from Mesh Finance. See how regular deposits and interest grow your home deposit over time and plan your path to buying.",
  "calc-extra-repayment": "Extra repayment calculator from Mesh Finance. See how paying a little extra each month can cut years and interest off your home loan.",
  "calc-lump-sum": "Lump sum repayment calculator from Mesh Finance. See how a one-off payment reduces your home loan balance, interest and loan term.",
  "calc-how-long": "How long to repay calculator from Mesh Finance. Work out how long it will take to pay off your loan at your chosen repayment amount.",
  "calc-offset-vs-redraw": "Offset vs redraw calculator from Mesh Finance. Compare how an offset account and a redraw facility each affect your home loan interest.",
  "calc-max-purchase-price": "Estimate the maximum price you may be able to pay for a WA owner-occupied home, factoring in your deposit, borrowing power, stamp duty, government schemes and the First Home Owner Grant.",
  "cs-families-consolidate-debt": "How Mesh Finance helped a Perth family consolidate multiple debts into one manageable home loan repayment and ease the pressure on their budget.",
  "cs-first-home-buyers-get-ready": "How Mesh Finance helped Perth first home buyers get pre-approval ready, understand grants and schemes, and buy their first home with confidence.",
  "cs-refinance-with-confidence": "How Mesh Finance helped clients refinance their home loan with confidence, compare lenders and secure a structure that suited their goals.",
  "cs-upgrade-their-home": "How Mesh Finance helped clients upgrade to their next home, manage the sale-and-purchase timing and finance the move without the stress.",
  "cs-self-employed-find-options": "How Mesh Finance helped self-employed clients improve cash flow and find home loan options that recognise how their business income really works.",
  "cs-after-a-bank-says-no": "How Mesh Finance helped clients find a way forward after a bank said no, working with specialist lenders to get their finance approved.",
  "wa-first-home-buyer-changes-2026": "Buying your first home in WA? From 7 May 2026, first home buyers can pay no stamp duty on homes up to $600,000, with concessions to $800,000. See what the changes mean for Perth buyers.",
  "help-to-buy-wa": "The Australian Government's Help to Buy shared equity scheme has arrived in WA. Mesh Finance explains how you may buy with as little as a 2% deposit.",
  "ato-debt-lending-solutions-business-owners": "ATO debt is getting more expensive. Mesh Finance explains why business owners should review their lending options beyond an ATO payment arrangement.",
  "using-parents-property-as-security-first-home-buyer": "Thinking of a family guarantee? Mesh Finance explains how using a parent's property as security works and what first home buyers need to know.",
  "wa-new-home-guarantee-scheme": "Mesh Finance explains what the expanded Home Guarantee Scheme changes mean for Perth first-home buyers, including deposit and income cap updates.",
  "protect-your-credit-file": "Worried about fraud or identity theft? Mesh Finance explains how to place and remove a credit ban in Australia to protect your credit file.",
};

/* Live-updated <head> tags for the single-page app: canonical URL, Open Graph
   and Twitter cards keep pace with client-side navigation so each route shares
   and indexes as its own page. */
const MESH_SITE = "https://meshfinance.com.au";
const MESH_NOINDEX = ["ffc-thank-you", "booking-confirmed"];

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

function App() {
  const { useState, useEffect } = React;
  const [route, setRoute] = useState(meshRouteFromLocation());

  const onNav = (id) => {
    id = MESH_ROUTE_ALIASES[id] || id;
    setRoute(id);
    const path = id === "home" ? "/" : "/" + id;
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Back/forward buttons re-read the route from the URL. */
  useEffect(() => {
    const onPop = () => setRoute(meshRouteFromLocation());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* Per-page titles. Self-titling screens (loans, case studies, articles) are
     deliberately absent from MESH_TITLES so this effect never fights theirs. */
  useEffect(() => {
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
  }, [route]);

  const loanSlugs = ["home-loans","investment-home-loans","bad-credit-home-loans","personal-loans","car-loans","leisure-loans","debt-consolidation-loans"];
  const caseStudySlugs = window.MeshContent.caseStudies || {};
  const calcKinds = { "calc-loan-repayment":"loan-repayment", "calc-interest-only":"interest-only",
    "stamp-duty-calculator":"stamp-duty", "calc-borrowing-power":"borrowing-power", "calc-savings":"savings", "calc-extra-repayment":"extra-repayment",
    "calc-lump-sum":"lump-sum", "calc-how-long":"how-long", "calc-offset-vs-redraw":"offset-vs-redraw",
    "calc-max-purchase-price":"max-purchase-price" };

  let content;
  if (loanSlugs.includes(route)) {
    content = <window.MeshLoanScreen onNav={onNav} slug={route}/>;
  } else if (caseStudySlugs[route]) {
    content = <window.MeshCaseStudyScreen key={route} onNav={onNav} slug={route}/>;
  } else if (calcKinds[route]) {
    content = <window.MeshCalculatorScreen key={calcKinds[route]} onNav={onNav} kind={calcKinds[route]}/>;
  } else if (window.MeshContent.articles[route]) {
    content = <window.MeshArticleScreen onNav={onNav} slug={route}/>;
  } else {
    const Screen = ({
      "financial-toolkit": window.MeshFinancialToolkitScreen,
      "who-we-help": window.MeshWhoWeHelpScreen,
      "first-home-buyers": window.MeshServiceScreen,
      "family-guarantee": window.MeshFamilyGuaranteeScreen,
      "ato-debt": window.MeshAtoDebtScreen,
      "calculator-hub": window.MeshCalculatorHubScreen,
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
      "booking-confirmed": window.MeshThankYouScreen,
    })[route] || window.MeshHomeScreen;
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
    </div>
  );
}

const MESH_BARE_ROUTES = ["family-finance-check", "ffc-thank-you"];

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);

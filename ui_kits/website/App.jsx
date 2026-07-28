/* App shell, routes between screens via the URL (History API), so every screen
   has a real address for indexing, sharing, reload, and back/forward. */

/* "/home-loans" -> "home-loans"; "/" -> "home". Tolerates being served from
   the app's file path (/ui_kits/website/...) as well as clean root routes. */
function meshRouteFromLocation() {
  let p = window.location.pathname.replace(/\/+$/, "");
  p = p.replace(/^.*\/ui_kits\/website/, "").replace(/\/index\.html$/, "");
  return p.replace(/^\//, "") || "home";
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
  "calc-stamp-duty": "Stamp Duty Calculator | Mesh Finance",
  "calc-borrowing-power": "Borrowing Power Calculator | Mesh Finance",
  "calc-savings": "Saving Calculator | Mesh Finance",
  "calc-extra-repayment": "Extra Repayment Calculator | Mesh Finance",
  "calc-lump-sum": "Lump Sum Repayment Calculator | Mesh Finance",
  "calc-how-long": "How Long to Repay Calculator | Mesh Finance",
  "calc-offset-vs-redraw": "Offset vs Redraw Calculator | Mesh Finance",
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
  "family-finance-check": "Family Finance Check | Debt Consolidation for Families | Mesh Finance",
  "ffc-thank-you": "Thank You | Mesh Finance",
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
};

function App() {
  const { useState, useEffect } = React;
  const [route, setRoute] = useState(meshRouteFromLocation());

  const onNav = (id) => {
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
    if (meta) meta.setAttribute("content", MESH_DESCRIPTIONS[route] || meta.dataset.default || meta.getAttribute("content"));
  }, [route]);

  const loanSlugs = ["home-loans","investment-home-loans","bad-credit-home-loans","personal-loans","car-loans","leisure-loans","debt-consolidation-loans"];
  const caseStudySlugs = window.MeshContent.caseStudies || {};
  const calcKinds = { "calc-loan-repayment":"loan-repayment", "calc-interest-only":"interest-only",
    "calc-stamp-duty":"stamp-duty", "calc-borrowing-power":"borrowing-power", "calc-savings":"savings", "calc-extra-repayment":"extra-repayment",
    "calc-lump-sum":"lump-sum", "calc-how-long":"how-long", "calc-offset-vs-redraw":"offset-vs-redraw" };

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

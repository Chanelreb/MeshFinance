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
  "my-credit-file": "My Credit File | Mesh Finance",
  "property-profile-report": "Property Profile Report | Mesh Finance",
  "request-report": "Request a Property Report | Mesh Finance",
  "referral-hub": "Refer a Friend | Mesh Finance",
  "contact": "Book Now | Mesh Finance",
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
    })[route] || window.MeshHomeScreen;
    content = <Screen onNav={onNav}/>;
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <window.MeshHeader onNav={onNav} current={route}/>
      <main style={{ flex:1 }}>{content}</main>
      <window.MeshFooter onNav={onNav}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);

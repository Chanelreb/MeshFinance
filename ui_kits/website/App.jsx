/* App shell, routes between screens via simple state. */
function App() {
  const { useState } = React;
  const [route, setRoute] = useState("home");
  const onNav = (id) => { setRoute(id); window.scrollTo({ top: 0, behavior: "smooth" }); };

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

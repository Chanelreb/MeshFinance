/* Terms and Conditions, static legal page. Content is data-driven and rendered
   in the site's hero-band + body layout, matching the Privacy Policy page. */

const TERMS = {
  updated: "22 July 2026",
  sections: [
    { h: "Operator of this website", blocks: [
      { p: "This website is owned and operated by Rebello Enterprises Pty Ltd trading as Mesh Finance (ABN 40 160 343 484), Credit Representative Number 506123. Mesh Finance is authorised as a credit representative of Finsure Finance and Insurance Pty Ltd (ABN 72 068 153 926), Australian Credit Licence 384704." },
      { p: "In these Terms and Conditions, “Mesh Finance”, “we”, “us” and “our” refer to Rebello Enterprises Pty Ltd trading as Mesh Finance." },
    ]},
    { h: "Acceptance of these Terms and Conditions", blocks: [
      { p: "These Terms and Conditions govern your access to and use of the Mesh Finance website. By accessing or using this website, you agree to be bound by these Terms and Conditions, together with our Privacy Policy and any other terms, notices or disclaimers displayed on the website." },
      { p: "If you do not agree with these Terms and Conditions, you should not use this website." },
      { p: "We may update these Terms and Conditions from time to time. Any changes will take effect when the updated version is published on this website. We recommend reviewing this page periodically." },
    ]},
    { h: "General information only", blocks: [
      { p: "The information, calculators, examples, articles, guides and other materials available through this website are provided for general information and educational purposes only." },
      { p: "The content does not constitute personal financial advice, legal advice, taxation advice, property advice or a recommendation that a particular credit product is suitable for you. It does not take into account your complete objectives, financial situation, needs or personal circumstances." },
      { p: "Before acting on information from this website, you should consider whether it is appropriate for your circumstances and obtain independent financial, legal, taxation or other professional advice where required." },
    ]},
    { h: "Credit assistance", blocks: [
      { p: "Any credit assistance provided by Mesh Finance will be based on the information you provide, an assessment of your requirements and objectives, applicable lender policies, and our legal and regulatory obligations." },
      { p: "Information displayed on this website is not an offer, approval or guarantee of finance. All finance applications are subject to lender assessment, eligibility criteria, responsible lending obligations, acceptable security, valuation, verification, terms and conditions, fees and final approval." },
      { p: "Interest rates, fees, lender policies, government charges, grants, concessions, product features and eligibility requirements may change at any time. Products or services mentioned on this website may not be available from every lender or suitable for every applicant." },
    ]},
    { h: "Calculators and estimates", blocks: [
      { p: "Any calculator results, borrowing estimates, repayment examples, comparisons or scenarios shown on this website are indicative only. Results may be based on the information entered by you and general calculation assumptions." },
      { p: "Actual loan amounts, repayments, interest charges, fees, government charges, savings and approval outcomes may differ. Calculator results should not be relied upon as a quote, loan approval, credit assessment or statement of your borrowing capacity." },
      { p: "You should speak with Mesh Finance and review the lender's final documents before making a financial commitment." },
    ]},
    { h: "Accuracy and availability", blocks: [
      { p: "We take reasonable steps to keep the information on this website accurate, complete and current. However, to the extent permitted by law, we do not warrant that the content is free from errors or omissions, suitable for a particular purpose, or continuously available." },
      { p: "You are responsible for assessing the relevance and accuracy of information before relying on it. Mesh Finance is not responsible for any loss arising from reliance on outdated, incomplete or inaccurate information, except where liability cannot be excluded under law." },
      { p: "We may update, remove, suspend or restrict access to any part of the website without notice." },
    ]},
    { h: "Privacy and website monitoring", blocks: [
      { p: "We respect your privacy and handle personal information in accordance with our Privacy Policy and applicable privacy laws." },
      { p: "When you use this website, we or our service providers may collect technical information through cookies, analytics tools and similar technologies. This information may be used to operate and secure the website, understand how visitors use it, improve the website experience and support relevant advertising." },
      { p: "For more information about how we collect, use, disclose and protect personal information, please read our Privacy Policy." },
    ]},
    { h: "Contact and enquiry forms", blocks: [
      { p: "Our website provides forms and other methods for contacting Mesh Finance. By submitting an enquiry or using a website form, you acknowledge and agree that:" },
      { list: [
        "the information you provide will be handled in accordance with our Privacy Policy;",
        "you must provide accurate and complete information;",
        "we may use your contact details to respond to your enquiry and provide information relevant to your request;",
        "submitting an enquiry does not create a broker-client relationship, constitute credit assistance or guarantee that finance will be available;",
        "you should not send information through a website form if you do not have authority to provide it; and",
        "electronic communications may not always be secure, uninterrupted or error-free.",
      ]},
      { p: "We aim to respond to enquiries within five business days. Response times may vary depending on the nature of the enquiry, public holidays and staff availability." },
      { p: "If your matter is time-sensitive, please contact us by telephone on 0416 291 241." },
    ]},
    { h: "Intellectual property and copyright", blocks: [
      { p: "Unless otherwise stated, the content and design of this website, including text, graphics, logos, images, videos, downloads, calculators and other materials, are owned by or licensed to Mesh Finance and are protected by Australian and international intellectual property laws." },
      { p: "You may view, download or print website content for your personal, non-commercial use. You must not, without our prior written permission:" },
      { list: [
        "reproduce, republish, distribute or commercially exploit website content;",
        "modify, adapt or create derivative works from the content;",
        "remove copyright, trademark or other proprietary notices;",
        "use our name, branding or logo in a way that suggests endorsement, affiliation or approval; or",
        "copy or use substantial parts of the website to build or support another product or service.",
      ]},
      { p: "Nothing in these Terms and Conditions limits any rights available under the Copyright Act 1968 (Cth), including permitted fair dealing." },
    ]},
    { h: "Third-party content and links", blocks: [
      { p: "This website may include links to lender websites, government websites, property information services, calculators, social media platforms and other third-party services." },
      { p: "Links are provided for convenience and do not necessarily indicate that Mesh Finance endorses or controls the third party, its content, products or services. Third-party websites have their own terms, privacy policies and security practices. You access and use them at your own risk." },
      { p: "Mesh Finance is not responsible for the availability, accuracy, security or content of third-party websites, except to the extent required by law." },
    ]},
    { h: "Acceptable use", blocks: [
      { p: "You must not use this website:" },
      { list: [
        "for any unlawful, fraudulent or misleading purpose;",
        "to interfere with the operation, security or availability of the website;",
        "to introduce malicious code, viruses or other harmful material;",
        "to attempt to gain unauthorised access to the website, systems or data;",
        "to collect information about other users without authority; or",
        "in a way that infringes another person's rights or causes loss or damage.",
      ]},
      { p: "We may restrict or block access to the website if we reasonably believe these Terms and Conditions have been breached." },
    ]},
    { h: "Limitation of liability", blocks: [
      { p: "To the maximum extent permitted by law, Mesh Finance excludes all warranties, representations and liability relating to your use of, or reliance on, this website and its content." },
      { p: "Mesh Finance will not be liable for indirect, incidental, special or consequential loss arising from website use, inability to access the website, reliance on its content, or use of third-party links or services." },
      { p: "Nothing in these Terms and Conditions excludes, restricts or modifies any consumer guarantee, right or remedy that cannot lawfully be excluded under the Australian Consumer Law or other applicable legislation." },
    ]},
    { h: "Governing law", blocks: [
      { p: "These Terms and Conditions are governed by the laws of Western Australia. You submit to the non-exclusive jurisdiction of the courts of Western Australia and any courts entitled to hear appeals from them." },
    ]},
    { h: "Contact Mesh Finance", blocks: [
      { p: "If you have a question about these Terms and Conditions or the website, please contact:" },
      { contact: true },
    ]},
  ],
};

function TermsConditionsScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Card } = DS;

  const ContactCard = () => (
    <Card elevation="shadow" style={tc.contactCard}>
      <div style={tc.contactName}>Mesh Finance</div>
      <div style={tc.contactOrg}>Rebello Enterprises Pty Ltd trading as Mesh Finance</div>
      <div style={tc.contactRows}>
        <div style={tc.contactRow}><span style={tc.contactLabel}>Email</span><a href="mailto:hello@meshfinance.com.au" style={tc.contactLink}>hello@meshfinance.com.au</a></div>
        <div style={tc.contactRow}><span style={tc.contactLabel}>Phone</span><a href="tel:+61416291241" style={tc.contactLink}>0416 291 241</a></div>
        <div style={tc.contactRow}><span style={tc.contactLabel}>Mail</span><span style={tc.contactVal}>Suite 206, Level 2, 96 Mill Point Road, South Perth WA 6151</span></div>
      </div>
      <div style={tc.contactFine}>ABN 40 160 343 484</div>
      <div style={tc.contactFine}>Credit Representative Number 506123 of Australian Credit Licence 384704</div>
    </Card>
  );

  const renderBlock = (b, i) => {
    if (b.p) return <p key={i} style={tc.p}>{b.p}</p>;
    if (b.list) return <ul key={i} style={tc.list}>{b.list.map((li, j) => <li key={j} style={tc.li}>{li}</li>)}</ul>;
    if (b.contact) return <ContactCard key={i}/>;
    return null;
  };

  return (
    <div>
      <section style={tc.head}>
        <div style={tc.headInner}>
          <Badge color="blue" dot>Legal</Badge>
          <h1 style={tc.h1}>Terms and Conditions</h1>
          <p style={tc.lead}>Last updated: {TERMS.updated}</p>
        </div>
      </section>
      <section style={tc.body}>
        <div style={tc.inner}>
          {TERMS.sections.map((sec, i) => (
            <div key={i} style={tc.section}>
              <h2 style={tc.h2}>{sec.h}</h2>
              {sec.blocks.map(renderBlock)}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const tc = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"820px", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" },
  body: { background:"var(--surface-page)", padding:"56px 0 80px" },
  inner: { maxWidth:"820px", margin:"0 auto", padding:"0 28px" },
  h1: { fontSize:40, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:0 },
  section: { marginBottom:36 },
  h2: { fontSize:22, margin:"0 0 14px", color:"var(--navy-700)", letterSpacing:"-.01em" },
  p: { fontSize:16, lineHeight:1.7, color:"var(--text-body)", margin:"0 0 14px" },
  list: { listStyle:"disc", margin:"0 0 14px", padding:"0 0 0 22px", display:"flex", flexDirection:"column", gap:8 },
  li: { fontSize:16, lineHeight:1.6, color:"var(--text-body)" },

  contactCard: { display:"flex", flexDirection:"column", gap:4, padding:"26px 30px", background:"#fff", margin:"0 0 6px" },
  contactName: { fontFamily:"var(--font-display)", fontWeight:700, fontSize:17, color:"var(--navy-700)" },
  contactOrg: { fontSize:15, color:"var(--text-body)", lineHeight:1.5 },
  contactRows: { display:"grid", gap:8, margin:"14px 0" },
  contactRow: { display:"flex", gap:12, alignItems:"baseline", flexWrap:"wrap", fontSize:15, color:"var(--text-body)" },
  contactLabel: { flex:"none", width:70, fontSize:12.5, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em", color:"var(--text-subtle)" },
  contactVal: { color:"var(--text-strong)" },
  contactLink: { color:"var(--color-primary)", fontWeight:600, textDecoration:"none" },
  contactFine: { fontSize:13.5, color:"var(--text-muted)", lineHeight:1.5 },
};

Object.assign(window, { MeshTermsConditionsScreen: TermsConditionsScreen });

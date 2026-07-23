/* Disclaimer and Limitation of Liability, static legal page. Rendered in the
   site's hero-band + body layout, matching the Privacy and Terms pages. */

const DISCLAIMER = {
  updated: "22 July 2026",
  sections: [
    { h: "Website content", blocks: [
      { p: "The content on this website includes text, images, graphics, software, calculators, tools, links and other material provided by Mesh Finance, its service providers, licensors and other third parties." },
      { p: "Mesh Finance takes reasonable steps to ensure the information published on this website is accurate and current. However, we do not guarantee that all content will always be complete, accurate, reliable, suitable or up to date." },
      { p: "The information on this website is general in nature and does not take into account your individual financial circumstances, objectives or needs. You should not rely on it as a substitute for personalised credit assistance or professional advice." },
      { p: "To the extent permitted by law, Mesh Finance accepts no responsibility for any action taken, or decision made, in reliance on information provided through this website." },
      { p: "We may change, update or remove website content at any time without notice." },
      { p: "While we take reasonable precautions, we cannot guarantee that this website will always be available, uninterrupted, secure or free from errors, viruses or other harmful components. Your use of this website is at your own risk." },
      { p: "If you believe any information on this website is inaccurate, outdated or misleading, please contact us at hello@meshfinance.com.au." },
    ]},
    { h: "Exclusions and limitation of liability", blocks: [
      { p: "To the maximum extent permitted by law, Mesh Finance and its related parties exclude all warranties, representations, guarantees and conditions that are not expressly stated and that may otherwise be implied by law." },
      { p: "To the maximum extent permitted by law, Mesh Finance is not liable for any loss, damage, cost or expense arising from or connected with:" },
      { list: [
        "your access to, use of or reliance on this website or its content;",
        "any interruption, delay, error or unavailability affecting the website;",
        "any virus, malicious code or other harmful component; or",
        "the loss, corruption or unauthorised access of data.",
      ]},
      { p: "This includes any indirect, incidental, special or consequential loss, including loss of profits, business opportunities, data or goodwill." },
      { p: "Nothing in this disclaimer excludes, restricts or modifies any right, guarantee or remedy that cannot lawfully be excluded under the Australian Consumer Law or any other applicable legislation. Where our liability cannot be excluded but may lawfully be limited, it will be limited to the extent permitted by law." },
    ]},
    { h: "Intellectual property", blocks: [
      { p: "Unless otherwise stated, the Mesh Finance name, logo, branding and other identifying marks displayed on this website are owned by, or used under licence by, Mesh Finance." },
      { p: "Other trademarks, business names and logos displayed on this website belong to their respective owners. Nothing on this website grants you a licence or right to use any trademark, logo or other intellectual property without the prior written permission of Mesh Finance or the relevant owner." },
    ]},
    { h: "Copyright", blocks: [
      { p: "Unless otherwise stated, the content on this website is owned by, or licensed to, Mesh Finance and is protected by Australian and international copyright laws." },
      { p: "You may view, download or print website content for your personal, internal or non-commercial use, provided that you:" },
      { list: [
        "do not alter the content;",
        "retain all copyright and ownership notices; and",
        "do not represent the content as your own.",
      ]},
      { p: "You must not reproduce, publish, distribute, modify, commercially exploit or otherwise use website content without prior written permission from Mesh Finance or the relevant copyright owner, except where permitted by law." },
    ]},
  ],
};

function DisclaimerScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge } = DS;
  const EMAIL = "hello@meshfinance.com.au";

  const renderBlock = (b, i) => {
    if (b.p) {
      if (b.p.includes(EMAIL)) {
        const [before, after] = b.p.split(EMAIL);
        return <p key={i} style={dc.p}>{before}<a href={"mailto:" + EMAIL} style={dc.inlineLink}>{EMAIL}</a>{after}</p>;
      }
      return <p key={i} style={dc.p}>{b.p}</p>;
    }
    if (b.list) return <ul key={i} style={dc.list}>{b.list.map((li, j) => <li key={j} style={dc.li}>{li}</li>)}</ul>;
    return null;
  };

  return (
    <div>
      <section style={dc.head}>
        <div style={dc.headInner}>
          <Badge color="blue" dot>Legal</Badge>
          <h1 style={dc.h1}>Disclaimer and Limitation of Liability</h1>
          <p style={dc.lead}>Last updated: {DISCLAIMER.updated}</p>
        </div>
      </section>
      <section style={dc.body}>
        <div style={dc.inner}>
          {DISCLAIMER.sections.map((sec, i) => (
            <div key={i} style={dc.section}>
              <h2 style={dc.h2}>{sec.h}</h2>
              {sec.blocks.map(renderBlock)}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const dc = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"820px", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" },
  body: { background:"var(--surface-page)", padding:"56px 0 80px" },
  inner: { maxWidth:"820px", margin:"0 auto", padding:"0 28px" },
  h1: { fontSize:38, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em", lineHeight:1.15 },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:0 },
  section: { marginBottom:36 },
  h2: { fontSize:22, margin:"0 0 14px", color:"var(--navy-700)", letterSpacing:"-.01em" },
  p: { fontSize:16, lineHeight:1.7, color:"var(--text-body)", margin:"0 0 14px" },
  list: { listStyle:"disc", margin:"0 0 14px", padding:"0 0 0 22px", display:"flex", flexDirection:"column", gap:8 },
  li: { fontSize:16, lineHeight:1.6, color:"var(--text-body)" },
  inlineLink: { color:"var(--color-primary)", fontWeight:600, textDecoration:"none" },
};

Object.assign(window, { MeshDisclaimerScreen: DisclaimerScreen });

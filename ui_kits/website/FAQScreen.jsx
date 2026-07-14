/* FAQ page, real site FAQs in a single accordion. */
function FAQScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Accordion, Badge, Button, Card } = DS;
  const items = window.MeshContent.faqs;

  return (
    <div style={f.page}>
      <div style={f.inner}>
        <div style={f.head}>
          <Badge color="blue" dot>FAQs</Badge>
          <h1 style={f.h1}>Frequently Asked Questions</h1>
          <p style={f.lead}>More questions? SMS us on 0416 291 241.</p>
        </div>
        <Card elevation="shadow" style={{padding:"8px 28px 20px"}}>
          <Accordion defaultOpen={[0]} items={items}/>
        </Card>
        <div style={f.cta}>
          <span style={f.ctaTxt}>Still not sure? A quick chat usually clears it up.</span>
          <Button onClick={()=>onNav("contact")}>Book a chat</Button>
        </div>
      </div>
    </div>
  );
}

const f = {
  page: { background:"var(--surface-page)", padding:"52px 0 80px" },
  inner: { maxWidth:"880px", margin:"0 auto", padding:"0 28px" },
  head: { textAlign:"center", maxWidth:600, margin:"0 auto 32px" },
  h1: { fontSize:40, margin:"18px 0 12px", color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.55, color:"var(--text-muted)", margin:0 },
  cta: { marginTop:28, padding:"22px 28px", background:"var(--blue-50)", borderRadius:"var(--radius-lg)",
    display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" },
  ctaTxt: { fontFamily:"var(--font-display)", fontWeight:600, fontSize:17, color:"var(--navy-700)" },
};

Object.assign(window, { MeshFAQScreen: FAQScreen });

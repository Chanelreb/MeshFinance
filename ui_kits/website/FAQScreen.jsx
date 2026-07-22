/* FAQ page, real site FAQs in a single accordion. */
function FAQScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Accordion, Badge, Button, Card } = DS;
  /* Answers may be a string or an array of paragraphs; render arrays as
     spaced <p> elements so multi-paragraph answers read cleanly. */
  const items = window.MeshContent.faqs.map((it) => ({
    question: it.question,
    answer: Array.isArray(it.answer)
      ? it.answer.map((p, i) => <p key={i} style={{ margin: i === 0 ? 0 : "12px 0 0" }}>{p}</p>)
      : it.answer,
  }));

  return (
    <div>
      <section style={f.head}>
        <div style={f.headInner}>
          <Badge color="blue" dot>FAQs</Badge>
          <h1 style={f.h1}>Frequently Asked Questions</h1>
          <p style={f.lead}>More questions? SMS us on 0416 291 241.</p>
        </div>
      </section>
      <section style={f.body}>
        <div style={f.inner}>
          <Card elevation="shadow" style={{padding:"8px 28px 20px"}}>
            <Accordion defaultOpen={[0]} items={items}/>
          </Card>
          <div style={f.cta}>
            <span style={f.ctaTxt}>Still not sure? A quick chat usually clears it up.</span>
            <Button onClick={()=>onNav("contact")}>Book a chat</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

const f = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"880px", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" },
  body: { background:"var(--surface-page)", padding:"56px 0 80px" },
  inner: { maxWidth:"880px", margin:"0 auto", padding:"0 28px" },
  h1: { fontSize:40, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:0 },
  cta: { marginTop:28, padding:"22px 28px", background:"var(--blue-50)", borderRadius:"var(--radius-lg)",
    display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" },
  ctaTxt: { fontFamily:"var(--font-display)", fontWeight:600, fontSize:17, color:"var(--navy-700)" },
};

Object.assign(window, { MeshFAQScreen: FAQScreen });

/* Who We Help, hub landing page listing client case studies as cards. */
function WhoWeHelpScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Button, Card } = DS;
  const { ArrowRight } = window.MeshIcons;
  const d = window.MeshContent.whoWeHelp;
  const studies = window.MeshContent.caseStudies;
  const isMobile = window.useIsMobile();

  return (
    <div>
      <section style={wwh.head}>
        <div style={wwh.headInner}>
          <Badge color="blue" dot>{d.eyebrow}</Badge>
          <h1 style={wwh.h1}>{d.title}</h1>
          <p style={wwh.lead}>{d.intro}</p>
        </div>
      </section>

      <section style={wwh.body}>
        <div style={wwh.bodyInner}>
          <div style={{...wwh.grid, ...(isMobile ? wwh.gridMobile : {})}}>
            {d.order.map((id) => {
              const s = studies[id];
              if (!s) return null;
              return (
                <Card key={id} elevation="shadow" style={wwh.card}>
                  <div style={wwh.cardTop}>
                    <span style={wwh.tag}>{s.tag}</span>
                    {s.comingSoon && <span style={wwh.soon}>Coming soon</span>}
                  </div>
                  <h3 style={wwh.cardTitle}>{s.cardTitle}</h3>
                  <p style={wwh.teaser}>{s.teaser}</p>
                  <div style={wwh.cardFoot}>
                    <a href="#" onClick={(e)=>{e.preventDefault();onNav(id);}} style={wwh.readLink}>
                      Read the story <ArrowRight width={16} height={16}/>
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card elevation="shadow" style={wwh.ctaCard}>
            <p style={wwh.ctaP}>Every situation is different. If any of these stories feel familiar, let's have a no-obligation chat about yours.</p>
            <Button size="lg" onClick={()=>onNav("contact")} iconRight={<ArrowRight width={18} height={18}/>}>Talk to a broker</Button>
          </Card>
        </div>
      </section>
    </div>
  );
}

const wwh = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" },
  h1: { fontSize:42, lineHeight:1.1, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:18, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:720 },

  body: { padding:"56px 0 80px" },
  bodyInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },
  grid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:44 },
  gridMobile: { gridTemplateColumns:"1fr" },
  card: { display:"flex", flexDirection:"column", gap:18, padding:"26px 28px", background:"#fff", height:"100%" },
  cardTop: { display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", minHeight:26 },
  tag: { fontSize:12, fontWeight:700, letterSpacing:".04em", textTransform:"uppercase",
    color:"var(--blue-600)", background:"var(--blue-50)", padding:"4px 10px", borderRadius:999 },
  soon: { fontSize:12, fontWeight:600, color:"var(--text-muted)", background:"var(--surface-page)",
    border:"1px solid var(--border-subtle)", padding:"4px 10px", borderRadius:999 },
  cardTitle: { fontFamily:"var(--font-display)", fontSize:20, lineHeight:1.25, color:"var(--navy-700)", margin:"14px 0", fontWeight:700, minHeight:"calc(1.25em * 2)", display:"flex", alignItems:"center" },
  teaser: { fontSize:15, lineHeight:1.55, color:"var(--text-body)", margin:0, flex:1 },
  cardFoot: { marginTop:6 },
  readLink: { display:"inline-flex", alignItems:"center", gap:6, fontSize:15, fontWeight:600, color:"var(--color-primary)", textDecoration:"none" },

  ctaCard: { display:"flex", flexDirection:"column", gap:20, alignItems:"flex-start", padding:"32px 36px", background:"#fff" },
  ctaP: { fontFamily:"var(--font-display)", fontSize:19, lineHeight:1.45, color:"var(--navy-700)", fontWeight:600, margin:0, maxWidth:680 },
};

Object.assign(window, { MeshWhoWeHelpScreen: WhoWeHelpScreen });

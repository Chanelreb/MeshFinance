/* Property Profile Report, CoreLogic valuation service page. */
function PropertyProfileReportScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Card, Button, Breadcrumb } = DS;
  const { Check } = window.MeshIcons;
  const d = window.MeshContent.propertyProfileReport;
  const isMobile = window.useIsMobile();
  return (
    <div>
      <section style={pprS.head}>
        <div style={pprS.headInner}>
          <Breadcrumb items={[
            {label:"Home", href:window.meshHref("home"), onClick:(e)=>{e.preventDefault();onNav("home");}},
            {label:"Guides and Tools", href:window.meshHref("knowledge-centre"), onClick:(e)=>{e.preventDefault();onNav("knowledge-centre");}},
            {label:"Property Profile Report"},
          ]}/>
          <Badge color="blue" dot>Property Reports</Badge>
          <h1 style={pprS.h1}>{d.title}</h1>
          <p style={pprS.subtitle}>{d.subtitle}</p>
          <p style={pprS.lead}>{d.intro}</p>
        </div>
      </section>
      <section style={pprS.body}>
        <div style={pprS.inner}>
          <div style={{...pprS.grid, ...(isMobile ? pprS.gridMobile : {})}}>
            {d.items.map((it,i)=>(
              <Card key={i} elevation="shadow" style={pprS.card}>
                <h3 style={pprS.cardTitle}>{it.title}</h3>
                <p style={pprS.cardBody}>{it.body}</p>
              </Card>
            ))}
          </div>

          <h2 style={pprS.h2}>What's Included in a CoreLogic Valuation Report?</h2>
          <ul style={pprS.checks}>
            {d.included.map((item,i)=>(
              <li key={i} style={pprS.checkItem}><span style={pprS.checkIcon}><Check width={14} height={14}/></span>{item}</li>
            ))}
          </ul>

          <Card elevation="shadow" style={pprS.closingCard}>
            <p style={pprS.closingP}>{d.closing}</p>
            <Button size="lg" onClick={()=>onNav("request-report")}>Request a report</Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
const pprS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:12, alignItems:"flex-start" },
  body: { background:"var(--surface-page)", padding:"56px 0 72px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },
  h1: { fontSize:38, margin:"2px 0 0", color:"var(--navy-700)", letterSpacing:"-.02em", lineHeight:1.15, maxWidth:780 },
  subtitle: { fontSize:17, color:"var(--color-primary)", fontWeight:600, margin:0, maxWidth:720 },
  lead: { fontSize:16.5, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:720 },
  grid: { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:36 },
  gridMobile: { gridTemplateColumns:"1fr" },
  card: { padding:22 },
  cardTitle: { fontFamily:"var(--font-display)", fontSize:16.5, color:"var(--navy-700)", margin:"0 0 6px", fontWeight:700 },
  cardBody: { fontSize:14.5, color:"var(--text-body)", lineHeight:1.5, margin:0 },
  h2: { fontSize:22, margin:"0 0 14px", color:"var(--navy-700)" },
  checks: { listStyle:"none", margin:"0 0 36px", padding:0, display:"grid", gap:10 },
  checkItem: { display:"flex", gap:12, alignItems:"flex-start", fontSize:15.5, color:"var(--text-body)" },
  checkIcon: { flex:"none", width:22, height:22, borderRadius:"50%", background:"var(--color-success)",
    color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", marginTop:1 },
  closingCard: { display:"flex", flexDirection:"column", gap:24, alignItems:"flex-start", padding:"28px 32px", background:"#fff" },
  closingP: { fontFamily:"var(--font-display)", fontSize:17, lineHeight:1.5, color:"var(--navy-700)", fontWeight:600, margin:"0 0 16px" },
};
Object.assign(window, { MeshPropertyProfileReportScreen: PropertyProfileReportScreen });

/* Calculator Hub, tile list linking to each calculator. */
function CalculatorHubScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Card, Button, Breadcrumb } = DS;
  const d = window.MeshContent.calculatorHub;
  const isMobile = window.useIsMobile();

  return (
    <div>
      <section style={calcHubS.head}>
        <div style={calcHubS.headInner}>
          <Breadcrumb items={[
            {label:"Home", href:window.meshHref("home"), onClick:(e)=>{e.preventDefault();onNav("home");}},
            {label:"Guides and Tools", href:window.meshHref("knowledge-centre"), onClick:(e)=>{e.preventDefault();onNav("knowledge-centre");}},
            {label:"Calculator Hub"},
          ]}/>
          <Badge color="blue" dot>Calculators</Badge>
          <h1 style={calcHubS.h1}>{d.title}</h1>
          <p style={calcHubS.lead}>{d.intro}</p>
        </div>
      </section>
      <section style={calcHubS.body}>
        <div style={calcHubS.inner}>
          <div style={{...calcHubS.grid, ...(isMobile ? calcHubS.gridMobile : {})}}>
            {d.items.map((it,i)=>(
              <Card key={i} elevation="shadow" padded={false} style={calcHubS.card}
                onClick={()=>onNav(it.id)}>
                <div style={calcHubS.cardInner}>
                  <span style={calcHubS.emoji}>{it.emoji}</span>
                  <h3 style={calcHubS.cardTitle}>{it.title}</h3>
                  <p style={calcHubS.cardName}>{it.name}</p>
                  <p style={calcHubS.cardBody}>{it.body}</p>
                  <span style={calcHubS.cardLink}>Open calculator →</span>
                </div>
              </Card>
            ))}
          </div>
          <p style={calcHubS.closing}>{d.closing}</p>
        </div>
      </section>
    </div>
  );
}

const calcHubS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" },
  body: { background:"var(--surface-page)", padding:"56px 0 72px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },
  h1: { fontSize:38, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:720 },
  grid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:36 },
  gridMobile: { gridTemplateColumns:"1fr" },
  card: { cursor:"pointer", display:"flex", flexDirection:"column" },
  cardInner: { flex:1, display:"flex", flexDirection:"column", padding:26 },
  emoji: { fontSize:28, lineHeight:1, height:34, display:"flex", alignItems:"center", marginBottom:8 },
  cardTitle: { fontFamily:"var(--font-display)", fontSize:18, lineHeight:1.25, color:"var(--navy-700)", margin:"0 0 4px", fontWeight:700,
    minHeight:45, display:"flex", flexDirection:"column", justifyContent:"flex-end" },
  cardName: { fontSize:12.5, lineHeight:1.3, color:"var(--color-primary)", fontWeight:600, margin:"0 0 10px", textTransform:"uppercase", letterSpacing:".03em" },
  cardBody: { fontSize:14.5, color:"var(--text-muted)", lineHeight:1.5, margin:"0 0 16px" },
  cardLink: { fontSize:14, fontWeight:600, color:"var(--color-primary)", marginTop:"auto" },
  closing: { fontFamily:"var(--font-display)", fontSize:18, color:"var(--navy-700)", fontWeight:600, textAlign:"center" },
};

Object.assign(window, { MeshCalculatorHubScreen: CalculatorHubScreen });

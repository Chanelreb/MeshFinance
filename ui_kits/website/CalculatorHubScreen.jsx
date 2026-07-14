/* Calculator Hub, tile list linking to each calculator. */
function CalculatorHubScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Card, Button } = DS;
  const d = window.MeshContent.calculatorHub;
  const isMobile = window.useIsMobile();

  return (
    <div style={calcHubS.page}>
      <div style={calcHubS.inner}>
        <div style={calcHubS.head}>
          <Badge color="blue" dot>Guides and Tools</Badge>
          <h1 style={calcHubS.h1}>{d.title}</h1>
          <p style={calcHubS.lead}>{d.intro}</p>
        </div>
        <div style={{...calcHubS.grid, ...(isMobile ? calcHubS.gridMobile : {})}}>
          {d.items.map((it,i)=>(
            <Card key={i} elevation="shadow" style={calcHubS.card}
              onClick={()=>onNav(it.id)}>
              <span style={calcHubS.emoji}>{it.emoji}</span>
              <h3 style={calcHubS.cardTitle}>{it.title}</h3>
              <p style={calcHubS.cardName}>{it.name}</p>
              <p style={calcHubS.cardBody}>{it.body}</p>
              <span style={calcHubS.cardLink}>Open calculator →</span>
            </Card>
          ))}
        </div>
        <p style={calcHubS.closing}>{d.closing}</p>
      </div>
    </div>
  );
}

const calcHubS = {
  page: { background:"var(--surface-page)", padding:"48px 0 72px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },
  head: { maxWidth:640, marginBottom:36 },
  h1: { fontSize:38, margin:"12px 0 12px", color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.55, color:"var(--text-muted)", margin:0 },
  grid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:36 },
  gridMobile: { gridTemplateColumns:"1fr" },
  card: { padding:26, cursor:"pointer", display:"flex", flexDirection:"column", gap:6 },
  emoji: { fontSize:28 },
  cardTitle: { fontFamily:"var(--font-display)", fontSize:18, color:"var(--navy-700)", margin:"4px 0 0", fontWeight:700 },
  cardName: { fontSize:12.5, color:"var(--color-primary)", fontWeight:600, margin:0, textTransform:"uppercase", letterSpacing:".03em" },
  cardBody: { fontSize:14.5, color:"var(--text-muted)", lineHeight:1.5, margin:"4px 0 8px" },
  cardLink: { fontSize:14, fontWeight:600, color:"var(--color-primary)" },
  closing: { fontFamily:"var(--font-display)", fontSize:18, color:"var(--navy-700)", fontWeight:600, textAlign:"center" },
};

Object.assign(window, { MeshCalculatorHubScreen: CalculatorHubScreen });

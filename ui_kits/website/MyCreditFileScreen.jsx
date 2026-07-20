/* My Credit File, what's in a credit file, explained. */
function MyCreditFileScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Card, Button } = DS;
  const d = window.MeshContent.myCreditFile;
  const isMobile = window.useIsMobile();
  return (
    <div style={mcfS.page}>
      <div style={mcfS.inner}>
        <Badge color="blue" dot>Guides and Tools</Badge>
        <h1 style={mcfS.h1}>{d.title}</h1>
        <p style={mcfS.lead}>{d.intro}</p>
        <div style={{...mcfS.grid, ...(isMobile ? mcfS.gridMobile : {})}}>
          {d.items.map((it,i)=>(
            <Card key={i} elevation="shadow" style={mcfS.card}>
              <h3 style={mcfS.cardTitle}>{it.title}</h3>
              <p style={mcfS.cardBody}>{it.body}</p>
            </Card>
          ))}
        </div>
        <Card elevation="shadow" style={mcfS.closingCard}>
          <p style={mcfS.closingP}>{d.closing}</p>
          <Button size="lg" onClick={()=>onNav("contact")}>Ask about my credit file</Button>
        </Card>
      </div>
    </div>
  );
}
const mcfS = {
  page: { background:"var(--surface-page)", padding:"48px 0 72px" },
  inner: { maxWidth:"820px", margin:"0 auto", padding:"0 28px" },
  h1: { fontSize:38, margin:"18px 0 12px", color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.55, color:"var(--text-muted)", margin:"0 0 32px" },
  grid: { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:32 },
  gridMobile: { gridTemplateColumns:"1fr" },
  card: { padding:22 },
  cardTitle: { fontFamily:"var(--font-display)", fontSize:16.5, color:"var(--navy-700)", margin:"0 0 6px", fontWeight:700 },
  cardBody: { fontSize:14.5, color:"var(--text-body)", lineHeight:1.5, margin:0 },
  closingCard: { display:"flex", flexDirection:"column", gap:24, alignItems:"flex-start", padding:"28px 32px", background:"#fff" },
  closingP: { fontFamily:"var(--font-display)", fontSize:17, lineHeight:1.5, color:"var(--navy-700)", fontWeight:600, margin:"0 0 16px" },
};
Object.assign(window, { MeshMyCreditFileScreen: MyCreditFileScreen });

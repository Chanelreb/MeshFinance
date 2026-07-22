/* Knowledge Centre, tile hub linking to Property Report, Credit File, Articles, FAQs. */
function KnowledgeCentreScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge } = DS;
  const I = window.MeshIcons;
  const { ArrowRight } = I;
  const items = window.MeshContent.knowledgeCentre;
  const isMobile = window.useIsMobile();

  // Rotate accent colours across the tiles for visual rhythm.
  const accents = [
    { bg:"var(--blue-600)", soft:"var(--blue-50)", ring:"var(--blue-100)" },
    { bg:"var(--color-success)", soft:"#e8f5ee", ring:"#cfead9" },
    { bg:"var(--navy-700)", soft:"#eef1f6", ring:"#dbe2ee" },
    { bg:"#c8862b", soft:"#f8f0df", ring:"#eeddba" },
  ];

  return (
    <div>
      <style>{`
        .kc-card{ position:relative; overflow:hidden; transition:transform .22s ease, box-shadow .22s ease; }
        .kc-card:hover{ transform:translateY(-6px); box-shadow:0 22px 44px -22px rgba(15,32,66,.4); }
        .kc-card::before{ content:""; position:absolute; inset:0 0 auto 0; height:4px; background:var(--kc-accent); }
        .kc-card:hover .kc-icon{ transform:scale(1.06) rotate(-3deg); }
        .kc-icon{ transition:transform .22s ease; }
        .kc-card:hover .kc-arrow{ transform:translateX(4px); }
        .kc-arrow{ transition:transform .22s ease; display:inline-flex; }
      `}</style>
      <section style={kcS.head}>
        <div style={kcS.headInner}>
          <Badge color="blue" dot>Guides and Tools</Badge>
          <h1 style={kcS.h1}>Knowledge Centre</h1>
          <p style={kcS.lead}>Everything you need to make informed decisions, reports, credit basics, articles and FAQs, all in one place.</p>
        </div>
      </section>
      <section style={kcS.body}>
        <div style={kcS.inner}>
          <div style={{...kcS.grid, ...(isMobile ? kcS.gridMobile : {})}}>
            {items.map((it,i)=>{
              const a = accents[i % accents.length];
              const Icon = I[it.icon] || I.Star;
              return (
                <div key={i} className="kc-card" style={{...kcS.card, "--kc-accent":a.bg}} onClick={()=>onNav(it.id)}>
                  <div className="kc-icon" style={{...kcS.iconWrap, background:a.soft, boxShadow:`0 0 0 6px ${a.ring}`}}>
                    <Icon width={24} height={24} style={{color:a.bg}}/>
                  </div>
                  <h3 style={kcS.cardTitle}>{it.title}</h3>
                  <p style={kcS.cardBody}>{it.body}</p>
                  <span style={{...kcS.cardLink, color:a.bg}}>
                    {it.cta || "Explore"} <span className="kc-arrow"><ArrowRight width={15} height={15}/></span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
const kcS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" },
  body: { background:"var(--surface-page)", padding:"56px 0 72px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },
  h1: { fontSize:38, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:720 },
  grid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:22 },
  gridMobile: { gridTemplateColumns:"1fr" },
  card: { padding:"32px 26px 26px", cursor:"pointer", display:"flex", flexDirection:"column", gap:14,
    background:"#fff", borderRadius:"var(--radius-lg)", border:"1px solid var(--border-subtle)",
    boxShadow:"0 1px 2px rgba(15,32,66,.06)", height:"100%" },
  iconWrap: { width:52, height:52, borderRadius:"var(--radius-md)", display:"flex", alignItems:"center",
    justifyContent:"center", marginBottom:28 },
  cardTitle: { fontFamily:"var(--font-display)", fontSize:18, color:"var(--navy-700)", margin:0, fontWeight:700 },
  cardBody: { fontSize:14.5, color:"var(--text-body)", lineHeight:1.55, margin:0, flex:1 },
  cardLink: { fontSize:14, fontWeight:700, display:"inline-flex", alignItems:"center", gap:7, marginTop:4 },
};
Object.assign(window, { MeshKnowledgeCentreScreen: KnowledgeCentreScreen });

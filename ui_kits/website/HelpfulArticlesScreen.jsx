/* Helpful Articles, blog-style listing with clickable cards + a sidebar
   duplicating the same list for quick jump-to navigation. */
function HelpfulArticlesScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Card, Button, Breadcrumb } = DS;
  const items = window.MeshContent.helpfulArticles;
  const isMobile = window.useIsMobile();
  const FHB_GROUP = "First home buyer guides";
  const grouped = items.filter(a => a.group === FHB_GROUP);
  const rest = items.filter(a => a.group !== FHB_GROUP);
  const sections = [
    { label: FHB_GROUP, list: grouped },
    { label: "More guides & articles", list: rest },
  ];
  const renderCard = (a, i) => (
    <Card key={a.slug} elevation="shadow" style={{...haS.card, ...(a.featured?haS.cardFeatured:{})}} onClick={()=>onNav(a.slug)}>
      {a.featured && <span style={haS.featBadge}>★ Featured</span>}
      <span style={haS.date}>{a.date}</span>
      <h3 style={haS.title}>{a.title}</h3>
      <p style={haS.body}>{a.body}</p>
      <span style={haS.readMore}>Read More »</span>
    </Card>
  );
  return (
    <div>
      <section style={haS.head}>
        <div style={haS.headInner}>
          <Breadcrumb items={[
            {label:"Home", href:window.meshHref("home"), onClick:(e)=>{e.preventDefault();onNav("home");}},
            {label:"Guides and Tools", href:window.meshHref("knowledge-centre"), onClick:(e)=>{e.preventDefault();onNav("knowledge-centre");}},
            {label:"Helpful Articles"},
          ]}/>
          <Badge color="blue" dot>Articles</Badge>
          <h1 style={haS.h1}>Helpful Articles</h1>
          <p style={haS.lead}>Guides on schemes, grants and lending, kept current.</p>
        </div>
      </section>
      <section style={haS.bodySection}>
      <div style={{...haS.inner, ...(isMobile ? haS.innerMobile : {})}}>
        <div style={haS.main}>
          {sections.map((sec)=> sec.list.length ? (
            <div key={sec.label} style={haS.groupBlock}>
              <h2 style={haS.groupH}>{sec.label}</h2>
              <div style={haS.list}>
                {sec.list.map(renderCard)}
              </div>
            </div>
          ) : null)}
          <div style={haS.cta}>
            <span style={haS.ctaTxt}>Want the full story on any of these? Reach out and we'll talk it through.</span>
            <Button onClick={()=>onNav("contact")}>Get in touch</Button>
          </div>
        </div>

        <aside style={haS.aside}>
          <Card elevation="shadow" style={{position:"sticky", top:90, padding:20}}>
            <h3 style={haS.sideH}>Helpful Articles</h3>
            <div style={haS.sideList}>
              {items.map((a,i)=>(
                <a key={i} href="#" onClick={(e)=>{e.preventDefault();onNav(a.slug);}} style={haS.sideItem}>
                  <span style={haS.sideDate}>{a.date}</span>
                  <span style={haS.sideTitle}>{a.title}</span>
                </a>
              ))}
            </div>
          </Card>
        </aside>
      </div>
      </section>
    </div>
  );
}
const haS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" },
  bodySection: { background:"var(--surface-page)", padding:"56px 0 72px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px",
    display:"grid", gridTemplateColumns:"1fr 320px", gap:44, alignItems:"start" },
  innerMobile: { gridTemplateColumns:"1fr", padding:"0 20px", gap:28 },
  main: { maxWidth:720 },
  h1: { fontSize:38, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:720 },
  list: { display:"grid", gap:16, marginBottom:0 },
  groupBlock: { marginBottom:36 },
  groupH: { fontFamily:"var(--font-display)", fontSize:20, color:"var(--navy-700)", margin:"0 0 16px", fontWeight:700,
    borderBottomWidth:1, borderBottomStyle:"solid", borderBottomColor:"var(--border-subtle)", paddingBottom:8 },
  card: { padding:26, display:"flex", flexDirection:"column", gap:6, cursor:"pointer" },
  cardFeatured: { borderLeftWidth:4, borderLeftStyle:"solid", borderLeftColor:"var(--color-primary)", background:"var(--blue-50)" },
  featBadge: { alignSelf:"flex-start", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em",
    color:"var(--color-primary)", background:"#fff", padding:"3px 10px", borderRadius:999, marginBottom:4 },
  date: { fontSize:12.5, color:"var(--text-subtle)", fontWeight:600, textTransform:"uppercase", letterSpacing:".04em" },
  title: { fontFamily:"var(--font-display)", fontSize:19, color:"var(--navy-700)", margin:"2px 0 4px", fontWeight:700 },
  body: { fontSize:15, color:"var(--text-body)", lineHeight:1.55, margin:0 },
  readMore: { fontSize:13.5, fontWeight:600, color:"var(--color-primary)", marginTop:4 },
  cta: { padding:"22px 28px", background:"var(--blue-50)", borderRadius:"var(--radius-lg)",
    display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" },
  ctaTxt: { fontFamily:"var(--font-display)", fontWeight:600, fontSize:16, color:"var(--navy-700)" },

  aside: {},
  sideH: { fontFamily:"var(--font-display)", fontSize:15, textTransform:"uppercase", letterSpacing:".04em",
    color:"var(--navy-700)", margin:"0 0 14px", fontWeight:700 },
  sideList: { display:"grid", gap:4 },
  sideItem: { display:"flex", flexDirection:"column", gap:2, textDecoration:"none", padding:"10px 10px", borderRadius:"var(--radius-sm)" },
  sideDate: { fontSize:11.5, color:"var(--text-subtle)", fontWeight:600, textTransform:"uppercase" },
  sideTitle: { fontSize:13.5, color:"var(--text-strong)", fontWeight:600, lineHeight:1.35 },
};
Object.assign(window, { MeshHelpfulArticlesScreen: HelpfulArticlesScreen });

/* Article detail, data-driven from window.MeshContent.articles[slug].
   Sidebar duplicates the full article list for quick navigation. */
function ArticleScreen({ onNav, slug }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Breadcrumb, Badge, Button, Card } = DS;
  const d = window.MeshContent.articles[slug];
  const all = window.MeshContent.helpfulArticles;
  const isMobile = window.useIsMobile();
  if (!d) return null;

  return (
    <div>
      <section style={artS.head}>
        <div style={artS.headInner}>
          <Breadcrumb items={[{label:"Home",href:"#"},{label:"Helpful Articles",href:"#"},{label:d.title}]}/>
          <Badge color="blue" dot>{d.date}</Badge>
          <h1 style={artS.h1}>{d.title}</h1>
          {d.subtitle && <p style={artS.subtitle}>{d.subtitle}</p>}
          <p style={artS.lead}>{d.intro}</p>
        </div>
      </section>
      <section style={artS.bodySection}>
      <div style={{...artS.inner, ...(isMobile ? artS.innerMobile : {})}}>
        <div style={artS.main}>
          {d.blocks.map((b,i)=>(
            <div key={i} style={artS.block}>
              {b.h && <h2 style={artS.h2}>{b.h}</h2>}
              {b.body && <p style={artS.p}>{b.body}</p>}
              {b.list && (
                <ul style={artS.list}>
                  {b.list.map((item,j)=>(<li key={j} style={artS.listItem}>{item}</li>))}
                </ul>
              )}
              {b.numbered && (
                <div style={artS.numGrid}>
                  {b.numbered.map((n,j)=>(
                    <div key={j} style={artS.numCard}>
                      <span style={artS.numBadge}>{j+1}</span>
                      <div>
                        <div style={artS.numT}>{n.t}</div>
                        <div style={artS.numB}>{n.b}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Card elevation="shadow" style={artS.closingCard}>
            <p style={artS.closingP}>{d.closing}</p>
            <Button size="lg" onClick={()=>onNav("contact")}>Reach out now for a chat!</Button>
          </Card>
        </div>

        <aside style={artS.aside}>
          <Card elevation="shadow" style={{position:"sticky", top:90, padding:20}}>
            <h3 style={artS.sideH}>Helpful Articles</h3>
            <div style={artS.sideList}>
              {all.map((a,i)=>(
                <a key={i} href="#" onClick={(e)=>{e.preventDefault();onNav(a.slug);}}
                  style={{...artS.sideItem, ...(a.slug===slug?artS.sideItemActive:{})}}>
                  <span style={artS.sideDate}>{a.date}</span>
                  <span style={artS.sideTitle}>{a.title}</span>
                </a>
              ))}
            </div>
            <a href="#" onClick={(e)=>{e.preventDefault();onNav("helpful-articles");}} style={artS.sideAll}>View all articles →</a>
          </Card>
        </aside>
      </div>
      </section>
    </div>
  );
}

const artS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"28px 28px 44px" },
  bodySection: { background:"var(--surface-page)", padding:"48px 0 80px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px",
    display:"grid", gridTemplateColumns:"1fr 320px", gap:44, alignItems:"start" },
  innerMobile: { gridTemplateColumns:"1fr", padding:"0 20px", gap:28 },
  main: { maxWidth:720 },
  h1: { fontSize:34, margin:"14px 0 8px", color:"var(--navy-700)", letterSpacing:"-.02em", lineHeight:1.15, maxWidth:820 },
  subtitle: { fontSize:17, color:"var(--color-primary)", fontWeight:600, margin:"0 0 12px" },
  lead: { fontSize:16.5, lineHeight:1.65, color:"var(--text-body)", margin:0, maxWidth:820 },
  block: { marginTop:28 },
  h2: { fontSize:21, margin:"0 0 10px", color:"var(--navy-700)" },
  p: { fontSize:15.5, lineHeight:1.65, color:"var(--text-body)", margin:0 },
  list: { listStyle:"disc", margin:0, padding:"0 0 0 20px", display:"grid", gap:8 },
  listItem: { fontSize:15, lineHeight:1.55, color:"var(--text-body)" },
  numGrid: { display:"grid", gap:14 },
  numCard: { display:"flex", gap:14, padding:"14px 16px", background:"var(--blue-50)", borderRadius:"var(--radius-md)" },
  numBadge: { flex:"none", width:28, height:28, borderRadius:"50%", background:"var(--color-primary)", color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:13 },
  numT: { fontWeight:700, color:"var(--navy-700)", marginBottom:3, fontSize:15 },
  numB: { fontSize:14, color:"var(--text-body)", lineHeight:1.5 },
  closingCard: { display:"flex", flexDirection:"column", gap:44, alignItems:"flex-start", padding:"26px 28px", background:"#fff", marginTop:32 },
  closingP: { fontFamily:"var(--font-display)", fontSize:17, lineHeight:1.45, color:"var(--navy-700)", fontWeight:600, margin:"0 0 16px" },

  aside: {},
  sideH: { fontFamily:"var(--font-display)", fontSize:15, textTransform:"uppercase", letterSpacing:".04em",
    color:"var(--navy-700)", margin:"0 0 14px", fontWeight:700 },
  sideList: { display:"grid", gap:4 },
  sideItem: { display:"flex", flexDirection:"column", gap:2, textDecoration:"none", padding:"10px 10px",
    borderRadius:"var(--radius-sm)" },
  sideItemActive: { background:"var(--blue-50)" },
  sideDate: { fontSize:11.5, color:"var(--text-subtle)", fontWeight:600, textTransform:"uppercase" },
  sideTitle: { fontSize:13.5, color:"var(--text-strong)", fontWeight:600, lineHeight:1.35 },
  sideAll: { display:"block", marginTop:10, fontSize:13.5, fontWeight:600, color:"var(--color-primary)", textDecoration:"none" },
};

Object.assign(window, { MeshArticleScreen: ArticleScreen });

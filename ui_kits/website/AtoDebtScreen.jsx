/* ATO Debt, tax debt consolidation guide: feature grid, how-it-works, FAQs, closing CTA. */
function AtoDebtScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Button, Card, Breadcrumb, Accordion } = DS;
  const { Check, Shield, Coins, Building, Users, Refi } = window.MeshIcons;
  const d = window.MeshContent.atoDebt;
  const icons = [Building, Coins, Shield, Users, Check, Refi];
  const isMobile = window.useIsMobile();

  return (
    <div>
      <section style={aS.head}>
        <div style={{...aS.headInner, ...(isMobile ? aS.headInnerMobile : {})}}>
          <div style={aS.headCopy}>
            <Breadcrumb items={[{label:"Home",href:"#"},{label:"How We Help",href:"#"},{label:"ATO Debt"}]}/>
            <Badge color="solid">{d.eyebrow}</Badge>
            <h1 style={aS.h1}>{d.title}</h1>
            <p style={aS.subtitle}>{d.subtitle}</p>
            <p style={aS.lead}>{d.intro}</p>
            <div style={aS.heroBtns}>
              <Button size="lg" onClick={()=>onNav("contact")}>Apply now</Button>
            </div>
          </div>
        </div>
      </section>

      <section style={aS.body}>
        <div style={{...aS.bodyInner, ...(isMobile ? aS.bodyInnerMobile : {})}}>
          <h2 style={aS.h2}>Our loan features</h2>
          <div style={{...aS.grid, ...(isMobile ? aS.gridMobile : {})}}>
            {d.features.map((f,i)=>{
              const Icon = icons[i % icons.length];
              return (
                <Card key={i} elevation="shadow" style={aS.card}>
                  <span style={aS.cardIcon}><Icon width={22} height={22}/></span>
                  <h3 style={aS.cardTitle}>{f.title}</h3>
                  <p style={aS.cardBody}>{f.body}</p>
                </Card>
              );
            })}
          </div>

          <h2 style={{...aS.h2, marginTop:44}}>Ways we can help clear ATO debt</h2>
          <p style={aS.p}>{d.seoIntro}</p>
          <div style={aS.wayGrid}>
            {d.howItWorks.map((w,i)=>(
              <div key={i} style={aS.wayCard}>
                <span style={aS.wayBadge}>{i+1}</span>
                <div>
                  <div style={aS.wayT}>{w.t}</div>
                  <div style={aS.wayB}>{w.b}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{...aS.h2, marginTop:44}}>ATO debt loan FAQs</h2>
          <Accordion defaultOpen={[0]} items={d.faqs.map(f=>({question:f.q, answer:f.a}))}/>

          <Card elevation="shadow" style={aS.closingCard}>
            <div>
              <h3 style={aS.closingH}>Ready to take the next step?</h3>
              <p style={aS.closingP}>{d.closing}</p>
            </div>
            <Button size="lg" onClick={()=>onNav("contact")}>Apply now</Button>
          </Card>
        </div>
      </section>
    </div>
  );
}

const aS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"24px 28px 48px" },
  headInnerMobile: { padding:"20px 20px 32px" },
  headCopy: { display:"flex", flexDirection:"column", gap:10, maxWidth:760 },
  h1: { fontSize:38, lineHeight:1.15, margin:"6px 0 0", color:"var(--navy-700)", letterSpacing:"-.02em" },
  subtitle: { fontSize:18, color:"var(--color-primary)", fontWeight:600, margin:0 },
  lead: { fontSize:16.5, lineHeight:1.6, color:"var(--text-body)", margin:"6px 0 0" },
  heroBtns: { marginTop:10 },

  body: { padding:"48px 0 80px" },
  bodyInner: { maxWidth:"820px", margin:"0 auto", padding:"0 28px" },
  bodyInnerMobile: { padding:"0 20px" },
  h2: { fontSize:24, margin:"0 0 16px", color:"var(--navy-700)" },
  p: { fontSize:16, lineHeight:1.65, color:"var(--text-body)", margin:"0 0 20px" },

  grid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 },
  gridMobile: { gridTemplateColumns:"1fr" },
  card: { padding:22, display:"flex", flexDirection:"column", gap:8 },
  cardIcon: { flex:"none", width:40, height:40, borderRadius:"var(--radius-md)", background:"var(--color-primary-soft)",
    color:"var(--color-primary)", display:"flex", alignItems:"center", justifyContent:"center" },
  cardTitle: { fontFamily:"var(--font-display)", fontSize:16, color:"var(--navy-700)", margin:0, fontWeight:700 },
  cardBody: { fontSize:14, color:"var(--text-body)", lineHeight:1.5, margin:0 },

  wayGrid: { display:"grid", gap:14, marginBottom:8 },
  wayCard: { display:"flex", gap:14, padding:"16px 18px", background:"var(--blue-50)", borderRadius:"var(--radius-md)" },
  wayBadge: { flex:"none", width:30, height:30, borderRadius:"50%", background:"var(--color-primary)", color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:14 },
  wayT: { fontWeight:700, color:"var(--navy-700)", marginBottom:4, fontSize:15.5 },
  wayB: { fontSize:14.5, color:"var(--text-body)", lineHeight:1.55 },

  closingCard: { display:"flex", flexDirection:"column", gap:20, alignItems:"flex-start", padding:"28px 32px", background:"#fff", marginTop:44 },
  closingH: { fontFamily:"var(--font-display)", fontSize:20, color:"var(--navy-700)", margin:"0 0 6px", fontWeight:700 },
  closingP: { fontSize:16, lineHeight:1.5, color:"var(--text-body)", margin:"0 0 16px" },
};

Object.assign(window, { MeshAtoDebtScreen: AtoDebtScreen });

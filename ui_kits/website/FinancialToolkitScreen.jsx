/* Financial Toolkit, hub linking out to all loan-type pages. */
function FinancialToolkitScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Button, ServiceCard, Card, Field, Input, Select } = DS;
  const { Home, Building, Key, Shield, Coins, Car, Caravan, Refi, Clock, HardHat, ArrowRight } = window.MeshIcons;
  const d = window.MeshContent.financialToolkit;
  const isMobile = window.useIsMobile();
  const iconFor = { "home-loans":<Home/>, "construction-home-loans":<HardHat/>, "investment-home-loans":<Building/>, "first-home-buyers":<Key/>,
    "bad-credit-home-loans":<Shield/>, "personal-loans":<Coins/>, "car-loans":<Car/>, "leisure-loans":<Caravan/>,
    "debt-consolidation-loans":<Refi/>, "ato-debt":<Clock/> };

  return (
    <div>
      <section style={{...toolkitS.head, ...(isMobile ? toolkitS.headMobile : {})}}
        role="img" aria-label="Client reviewing finances at home">
        <div style={{...toolkitS.headOverlay, ...(isMobile ? toolkitS.headOverlayMobile : {})}}/>
        <div style={{...toolkitS.headInner, ...(isMobile ? toolkitS.headInnerMobile : {})}}>
          <div style={toolkitS.headCopy}>
            <Badge color="blue" dot>Financial Toolkit</Badge>
            <h1 style={toolkitS.h1}>{d.title}</h1>
            <p style={toolkitS.lead}>{d.intro}</p>
          </div>
        </div>
      </section>

      <section style={toolkitS.body}>
        <div style={toolkitS.bodyInner}>
          <div style={{...toolkitS.grid, ...(isMobile ? toolkitS.gridMobile : {})}}>
            {d.items.map((it,i)=>(
              <ServiceCard key={i} icon={iconFor[it.id]} title={it.title} description={it.body} href="#"
                onClick={(e)=>{e.preventDefault();onNav(it.id);}}/>
            ))}
          </div>

          <Card elevation="shadow" style={toolkitS.closingCard}>
            <p style={toolkitS.closingP}>{d.closing}</p>
            <Button size="lg" onClick={()=>onNav("contact")} iconRight={<ArrowRight width={18} height={18}/>}>Reach out 👋</Button>
          </Card>
        </div>
      </section>
    </div>
  );
}

const toolkitS = {
  /* Hero photo as the section background, the same treatment as the loan pages:
     desktop fades blue-50 over the copy so the photo bleeds in on the right;
     mobile shows the photo under a light top-weighted scrim. */
  head: { position:"relative", overflow:"hidden",
    background:"var(--blue-50) url(../../assets/hero-toolkit.jpg) right 50%/cover no-repeat" },
  headMobile: { background:"var(--blue-50) url(../../assets/hero-toolkit.jpg) 71% 50%/cover no-repeat" },
  headOverlay: { position:"absolute", inset:0,
    background:"linear-gradient(90deg, var(--blue-50) 0%, var(--blue-50) 38%, rgba(234,244,252,.9) 55%, rgba(234,244,252,.45) 78%, rgba(234,244,252,.08) 100%)" },
  headOverlayMobile: { background:"linear-gradient(180deg, rgba(234,244,252,.95) 0%, rgba(234,244,252,.78) 46%, rgba(234,244,252,.4) 100%)" },
  headInner: { position:"relative", maxWidth:"var(--container-max)", margin:"0 auto", padding:"24px 28px 64px",
    minHeight:380, boxSizing:"border-box" },
  headInnerMobile: { padding:"20px 20px 32px", minHeight:0 },
  headCopy: { display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start", maxWidth:600 },
  h1: { fontSize:40, lineHeight:1.15, margin:"0 0 8px", color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:640 },
  body: { padding:"56px 0 80px" },
  bodyInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },
  grid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:44 },
  gridMobile: { gridTemplateColumns:"1fr" },
  closingCard: { display:"flex", flexDirection:"column", gap:24, alignItems:"flex-start", padding:"32px 36px", background:"#fff" },
  closingP: { fontFamily:"var(--font-display)", fontSize:19, lineHeight:1.45, color:"var(--navy-700)", fontWeight:600, margin:"0 0 16px", maxWidth:680 },
};

Object.assign(window, { MeshFinancialToolkitScreen: FinancialToolkitScreen });

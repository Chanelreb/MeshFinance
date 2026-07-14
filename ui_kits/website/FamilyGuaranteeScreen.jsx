/* Family Guarantee Home Loans, long-form guide page. */
function FamilyGuaranteeScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Button, Card, Breadcrumb } = DS;
  const { Check } = window.MeshIcons;
  const d = window.MeshContent.familyGuarantee;
  const isMobile = window.useIsMobile();

  return (
    <div>
      <section style={fgS.head}>
        <div style={{...fgS.headInner, ...(isMobile ? fgS.headInnerMobile : {})}}>
          <div style={fgS.headCopy}>
            <Breadcrumb items={[{label:"Home",href:"#"},{label:"Guides & Tools",href:"#"},{label:"Family Guarantee Home Loans"}]}/>
            <Badge color="solid">Family Guarantee</Badge>
            <h1 style={fgS.h1}>{d.title}</h1>
            <p style={fgS.subtitle}>{d.subtitle}</p>
            <p style={fgS.lead}>{d.intro}</p>
          </div>
          <div style={fgS.headImg} role="img" aria-label="Family guarantee illustration placeholder">
            <span style={fgS.headImgLabel}>family guarantee photo</span>
          </div>
        </div>
      </section>

      <section style={fgS.body}>
        <div style={fgS.bodyInner}>
          {d.sections.map((sec,i)=>(
            <div key={i} style={fgS.block}>
              <h2 style={fgS.h2}>{sec.h}</h2>
              {sec.body && <p style={fgS.p}>{sec.body}</p>}
              {sec.list && (
                <ul style={fgS.checks}>
                  {sec.list.map((item,j)=>(
                    <li key={j} style={fgS.checkItem}><span style={fgS.checkIcon}><Check width={14} height={14}/></span>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <Card elevation="shadow" style={fgS.closingCard}>
            <p style={fgS.closingP}>{d.closing}</p>
            <Button size="lg" onClick={()=>onNav("contact")}>Book a chat</Button>
          </Card>
        </div>
      </section>
    </div>
  );
}

const fgS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"24px 28px 48px",
    display:"grid", gridTemplateColumns:"1.1fr .9fr", gap:40, alignItems:"center" },
  headInnerMobile: { gridTemplateColumns:"1fr", padding:"20px 20px 32px", gap:24 },
  headCopy: { display:"flex", flexDirection:"column", gap:16 },
  headImg: { aspectRatio:"4/3", borderRadius:16,
    backgroundImage:"repeating-linear-gradient(135deg, var(--blue-100) 0px, var(--blue-100) 14px, var(--blue-50) 14px, var(--blue-50) 28px)",
    display:"flex", alignItems:"center", justifyContent:"center" },
  headImgLabel: { fontFamily:"monospace", fontSize:13, color:"var(--navy-700)", background:"#fff",
    padding:"4px 10px", borderRadius:6, opacity:.7 },
  h1: { fontSize:36, lineHeight:1.15, margin:"6px 0 0", minHeight:83, color:"var(--navy-700)", letterSpacing:"-.02em" },
  subtitle: { fontSize:18, color:"var(--color-primary)", fontWeight:600, margin:0 },
  lead: { fontSize:16.5, lineHeight:1.6, color:"var(--text-body)", margin:"6px 0 0" },
  body: { padding:"48px 0 80px" },
  bodyInner: { maxWidth:"780px", margin:"0 auto", padding:"0 28px" },
  block: { marginBottom:32 },
  h2: { fontSize:22, margin:"0 0 12px", color:"var(--navy-700)" },
  p: { fontSize:16, lineHeight:1.65, color:"var(--text-body)", margin:0 },
  checks: { listStyle:"none", margin:0, padding:0, display:"grid", gap:10 },
  checkItem: { display:"flex", gap:12, alignItems:"flex-start", fontSize:15.5, lineHeight:1.5, color:"var(--text-body)" },
  checkIcon: { flex:"none", width:22, height:22, borderRadius:"50%", background:"var(--color-success)",
    color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", marginTop:1 },
  closingCard: { display:"flex", flexDirection:"column", gap:44, alignItems:"flex-start", padding:"28px 32px", background:"#fff" },
  closingP: { fontFamily:"var(--font-display)", fontSize:18, lineHeight:1.45, color:"var(--navy-700)", fontWeight:600, margin:0 },
};

Object.assign(window, { MeshFamilyGuaranteeScreen: FamilyGuaranteeScreen });

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
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"24px 28px 48px" },
  headInnerMobile: { padding:"20px 20px 32px" },
  headCopy: { display:"flex", flexDirection:"column", gap:16, maxWidth:760 },
  h1: { fontSize:36, lineHeight:1.15, margin:"6px 0 0", color:"var(--navy-700)", letterSpacing:"-.02em" },
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
  closingP: { fontFamily:"var(--font-display)", fontSize:18, lineHeight:1.45, color:"var(--navy-700)", fontWeight:600, margin:"0 0 16px" },
};

Object.assign(window, { MeshFamilyGuaranteeScreen: FamilyGuaranteeScreen });

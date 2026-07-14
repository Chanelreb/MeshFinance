/* Generic loan-type page, data-driven from window.MeshContent.loans[slug].
   Used for: home-loans, investment-home-loans, bad-credit-home-loans,
   personal-loans, car-loans, leisure-loans, debt-consolidation-loans. */
function LoanScreen({ onNav, slug }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Breadcrumb, Badge, Button, Card, Field, Input, Select, Check } = DS;
  const { Check: CheckIcon, ArrowRight } = window.MeshIcons;
  const d = window.MeshContent.loans[slug];
  const isMobile = window.useIsMobile();

  /* SEO: per-page title, meta description, and FAQPage JSON-LD. */
  React.useEffect(() => {
    if (!d) return;
    document.title = d.metaTitle || d.title + " | Mesh Finance";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = d.metaDescription || d.intro;
    let ld = null;
    if (d.faqs) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": d.faqs.map((f) => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      });
      document.head.appendChild(ld);
    }
    return () => { if (ld) ld.remove(); };
  }, [slug]);

  if (!d) return null;

  return (
    <div>
      <section style={loanS.head}>
        <div style={{...loanS.headInner, ...(isMobile ? loanS.headInnerMobile : {})}}>
          <div style={loanS.headCopy}>
            <Breadcrumb items={[
              {label:"Home",href:"#",onClick:(e)=>{e.preventDefault();onNav("home");}},
              {label:d.eyebrow,href:"#",onClick:(e)=>{e.preventDefault();onNav("financial-toolkit");}},
              {label:window.MeshContent.nav[0]?.children?.find?.((n)=>n.id===slug)?.label || d.title},
            ]}/>
            <Badge color="solid">{d.eyebrow}</Badge>
            <h1 style={loanS.h1}>{d.title}</h1>
            <p style={loanS.lead}>{d.intro}</p>
            <div style={loanS.heroBtns}>
              <Button size="lg" onClick={()=>onNav("contact")} iconRight={<ArrowRight width={18} height={18}/>}>Reach out for a chat</Button>
            </div>
          </div>
          <div style={loanS.headImg} role="img" aria-label={d.imgAlt || `${d.title} illustration placeholder`}>
            <span style={loanS.headImgLabel}>{d.title.toLowerCase()} photo</span>
          </div>
        </div>
      </section>

      <section style={loanS.body}>
        <div style={{...loanS.bodyInner, ...(isMobile ? loanS.bodyInnerMobile : {})}}>
          <div style={loanS.main}>
            {d.blocks.map((b,i)=>(
              <div key={i} style={loanS.block}>
                {b.h && <h2 style={loanS.h2}>{b.h}</h2>}
                {b.body && <p style={loanS.p}>{b.body}</p>}
                {b.list && (
                  <ul style={loanS.checks}>
                    {b.list.map((item,j)=>(
                      <li key={j} style={loanS.checkItem}>
                        <span style={loanS.checkIcon}><CheckIcon width={14} height={14}/></span>{item}
                      </li>
                    ))}
                  </ul>
                )}
                {b.numbered && (
                  <div style={loanS.numGrid}>
                    {b.numbered.map((n,j)=>(
                      <div key={j} style={loanS.numCard}>
                        <span style={loanS.numBadge}>{j+1}</span>
                        <div>
                          <div style={loanS.numT}>{n.t}</div>
                          <div style={loanS.numB}>{n.b}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {d.faqs && (
              <div style={loanS.block}>
                <h2 style={loanS.h2}>Frequently asked questions</h2>
                <DS.Accordion items={d.faqs.map((f)=>({question:f.q, answer:f.a}))}/>
              </div>
            )}

            {d.closing && (
              <Card elevation="shadow" style={loanS.closingCard}>
                <p style={loanS.closingP}>{d.closing}<br/><br/></p>
                <Button size="lg" onClick={()=>onNav("contact")}>Book a chat</Button>
              </Card>
            )}

            {d.links && (
              <div style={loanS.linkRow}>
                <span style={loanS.linkRowLabel}>Related:</span>
                {d.links.map((l,i)=>(
                  <a key={i} href="#" onClick={(e)=>{e.preventDefault();onNav(l.id);}} style={loanS.linkBtn}>{l.label} →</a>
                ))}
              </div>
            )}
          </div>

          <aside style={loanS.aside}>
            <Card elevation="shadow" style={{position:"sticky", top:90, padding:0}}>
              <h3 style={loanS.sideH}>Reach out for a chat 👋</h3>
              <p style={loanS.sideP}>No obligation. We'll get back to you fast.</p>
              <div style={{display:"grid", gap:12}}>
                <Field label="Name" required><Input placeholder="Your name"/></Field>
                <Field label="Email" required><Input type="email" placeholder="you@email.com"/></Field>
                <Field label="Phone" required><Input type="tel" placeholder="04xx xxx xxx"/></Field>
                <Button block size="md" onClick={(e)=>{e.preventDefault();onNav("contact");}}>Send 📩</Button>
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

const loanS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"24px 28px 48px",
    display:"grid", gridTemplateColumns:"1.1fr .9fr", gap:40, alignItems:"center" },
  headInnerMobile: { gridTemplateColumns:"1fr", padding:"20px 20px 32px", gap:24 },
  headCopy: { display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" },
  headImg: { aspectRatio:"4/3", borderRadius:16,
    backgroundImage:"repeating-linear-gradient(135deg, var(--blue-100) 0px, var(--blue-100) 14px, var(--blue-50) 14px, var(--blue-50) 28px)",
    display:"flex", alignItems:"center", justifyContent:"center" },
  headImgLabel: { fontFamily:"monospace", fontSize:13, color:"var(--navy-700)", background:"#fff",
    padding:"4px 10px", borderRadius:6, opacity:.7 },
  h1: { fontSize:40, lineHeight:1.15, margin:"6px 0 8px", minHeight:92, color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:"0 0 6px", maxWidth:640 },
  heroBtns: { display:"flex", gap:12, marginTop:6 },

  body: { padding:"56px 0 80px" },
  bodyInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px",
    display:"grid", gridTemplateColumns:"1fr 340px", gap:48, alignItems:"start" },
  bodyInnerMobile: { gridTemplateColumns:"1fr", padding:"0 20px", gap:32 },
  main: {},
  block: { marginBottom:36 },
  h2: { fontSize:26, margin:"0 0 12px", color:"var(--navy-700)" },
  p: { fontSize:16, lineHeight:1.65, color:"var(--text-body)", margin:0 },
  checks: { listStyle:"none", margin:0, padding:0, display:"grid", gap:12 },
  checkItem: { display:"flex", gap:12, alignItems:"flex-start", fontSize:15.5, lineHeight:1.5, color:"var(--text-body)" },
  checkIcon: { flex:"none", width:22, height:22, borderRadius:"50%", background:"var(--color-success)",
    color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", marginTop:1 },
  numGrid: { display:"grid", gap:16 },
  numCard: { display:"flex", gap:14, padding:"16px 18px", background:"var(--blue-50)", borderRadius:"var(--radius-md)" },
  numBadge: { flex:"none", width:30, height:30, borderRadius:"50%", background:"var(--color-primary)", color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:14 },
  numT: { fontWeight:700, color:"var(--navy-700)", marginBottom:4, fontSize:15.5 },
  numB: { fontSize:14.5, color:"var(--text-body)", lineHeight:1.55 },

  closingCard: { display:"flex", flexDirection:"column", gap:32, alignItems:"flex-start", padding:"28px 32px", background:"#fff" },
  closingP: { fontFamily:"var(--font-display)", fontSize:19, lineHeight:1.4, color:"var(--navy-700)", fontWeight:600, margin:0 },
  linkRow: { display:"flex", gap:16, flexWrap:"wrap", marginTop:20, alignItems:"center" },
  linkRowLabel: { fontSize:14, fontWeight:600, color:"var(--text-muted)" },
  linkBtn: { fontSize:14.5, fontWeight:600, color:"var(--color-primary)", textDecoration:"none" },

  aside: {},
  sideH: { fontFamily:"var(--font-display)", fontSize:19, margin:"20px 22px 4px", color:"var(--navy-700)", fontWeight:700 },
  sideP: { fontSize:13.5, color:"var(--text-muted)", margin:"0 22px 16px", lineHeight:1.5 },
};

Object.assign(window, { MeshLoanScreen: LoanScreen });

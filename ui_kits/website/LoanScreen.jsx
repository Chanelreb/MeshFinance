/* Generic loan-type page, data-driven from window.MeshContent.loans[slug].
   Used for: home-loans, investment-home-loans, bad-credit-home-loans,
   personal-loans, car-loans, leisure-loans, debt-consolidation-loans. */
function LoanScreen({ onNav, slug }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Breadcrumb, Badge, Button, Card, Field, Input, Select, Check } = DS;
  const { Check: CheckIcon, ArrowRight } = window.MeshIcons;
  const d = window.MeshContent.loans[slug];
  const isMobile = window.useIsMobile();
  const { useState } = React;
  const [sideStatus, setSideStatus] = useState("idle"); // idle | sending | sent | error

  const submitSideForm = async (e) => {
    e.preventDefault();
    setSideStatus("sending");
    try {
      const ok = await window.MeshSubmitForm(e.target);
      setSideStatus(ok ? "sent" : "error");
    } catch {
      setSideStatus("error");
    }
  };

  /* LoanScreen is reused for every loan slug without remounting, so reset the
     sidebar form's state when navigating between loan pages via related links. */
  React.useEffect(() => { setSideStatus("idle"); }, [slug]);

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
                <p style={loanS.closingP}>{d.closing}</p>
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
              {sideStatus === "sent" ? (
                <div style={loanS.sideThanks}>
                  <div style={loanS.sideTick}>✓</div>
                  <h3 style={loanS.sideH}>Thanks, that's sent!</h3>
                  <p style={loanS.sideP}>We'll get back to you fast.</p>
                </div>
              ) : (
                <React.Fragment>
                  <h3 style={loanS.sideH}>Reach out for a chat 👋</h3>
                  <p style={loanS.sideP}>No obligation. We'll get back to you fast.</p>
                  <form onSubmit={submitSideForm} style={{display:"grid", gap:12}}>
                    <input type="hidden" name="_subject" value={`New enquiry — ${d.title} page`}/>
                    <Field label="Name" required><Input name="name" required placeholder="Your name"/></Field>
                    <Field label="Email" required><Input name="email" type="email" required placeholder="you@email.com"/></Field>
                    <Field label="Phone" required><Input name="phone" type="tel" required placeholder="04xx xxx xxx"/></Field>
                    {sideStatus === "error" && <p style={loanS.sideError}>Something went wrong, please try again or call us.</p>}
                    <Button block size="md" type="submit" disabled={sideStatus==="sending"}>{sideStatus==="sending" ? "Sending…" : "Send 📩"}</Button>
                  </form>
                </React.Fragment>
              )}
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

const loanS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"24px 28px 48px" },
  headInnerMobile: { padding:"20px 20px 32px" },
  headCopy: { display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start", maxWidth:760 },
  h1: { fontSize:40, lineHeight:1.15, margin:"6px 0 8px", color:"var(--navy-700)", letterSpacing:"-.02em" },
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
  closingP: { fontFamily:"var(--font-display)", fontSize:19, lineHeight:1.4, color:"var(--navy-700)", fontWeight:600, margin:"0 0 16px" },
  linkRow: { display:"flex", gap:16, flexWrap:"wrap", marginTop:20, alignItems:"center" },
  linkRowLabel: { fontSize:14, fontWeight:600, color:"var(--text-muted)" },
  linkBtn: { fontSize:14.5, fontWeight:600, color:"var(--color-primary)", textDecoration:"none" },

  aside: {},
  sideH: { fontFamily:"var(--font-display)", fontSize:19, margin:"20px 22px 4px", color:"var(--navy-700)", fontWeight:700 },
  sideP: { fontSize:13.5, color:"var(--text-muted)", margin:"0 22px 16px", lineHeight:1.5 },
  sideError: { fontSize:13, color:"var(--color-danger)", margin:0 },
  sideThanks: { textAlign:"center", padding:"12px 4px" },
  sideTick: { width:48, height:48, borderRadius:"50%", background:"var(--color-success)", color:"#fff",
    fontSize:24, display:"flex", alignItems:"center", justifyContent:"center", margin:"20px auto 0" },
};

Object.assign(window, { MeshLoanScreen: LoanScreen });

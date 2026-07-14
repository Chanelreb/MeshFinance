/* Case study page, data-driven from window.MeshContent.caseStudies[slug]. */
function CaseStudyScreen({ onNav, slug }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Breadcrumb, Badge, Button, Card, Accordion } = DS;
  const { Check, ArrowRight } = window.MeshIcons;
  const d = window.MeshContent.caseStudies[slug];
  const isMobile = window.useIsMobile();

  React.useEffect(() => {
    if (!d) return;
    document.title = d.seoTitle || (d.cardTitle + " | Who We Help | Mesh Finance");
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = d.seoDescription || d.teaser;

    let ld = document.getElementById("mesh-faq-ldjson");
    if (d.faqs && d.faqs.length) {
      if (!ld) { ld = document.createElement("script"); ld.type = "application/ld+json"; ld.id = "mesh-faq-ldjson"; document.head.appendChild(ld); }
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": d.faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer },
        })),
      });
    } else if (ld) {
      ld.remove();
    }
    return () => { const l = document.getElementById("mesh-faq-ldjson"); if (l) l.remove(); };
  }, [slug]);

  if (!d) return null;

  const renderBlocks = (blocks) => blocks.map((b, i) => {
    if (b.p) return <p key={i} style={cs.p}>{b.p}</p>;
    if (b.list) return (
      <ul key={i} style={cs.list}>
        {b.list.map((li, j) => (
          <li key={j} style={cs.li}>
            <span style={cs.check}><Check width={14} height={14}/></span>
            <span>{li}</span>
          </li>
        ))}
      </ul>
    );
    if (b.link) return (
      <p key={i} style={cs.p}>
        <a href="#" onClick={(e)=>{e.preventDefault();onNav(b.link.id);}} style={cs.inlineLink}>
          {b.link.label} <ArrowRight width={15} height={15}/>
        </a>
      </p>
    );
    return null;
  });

  return (
    <div>
      <section style={cs.head}>
        <div style={cs.headInner}>
          <Breadcrumb items={[
            {label:"Home",href:"#",onClick:(e)=>{e.preventDefault();onNav("home");}},
            {label:"Who We Help",href:"#",onClick:(e)=>{e.preventDefault();onNav("who-we-help");}},
            {label:d.navLabel},
          ]}/>
          <Badge color="solid">{d.tag}</Badge>
          <h1 style={cs.h1}>{d.title}</h1>
          {d.lead && d.lead.map((l, i) => <p key={i} style={cs.lead}>{l}</p>)}
        </div>
      </section>

      <section style={cs.body}>
        <div style={{...cs.bodyInner, ...(isMobile ? cs.bodyInnerMobile : {})}}>
          <div style={cs.main}>
            {d.comingSoon ? (
              <Card elevation="shadow" style={cs.soonCard}>
                <p style={cs.p}>This story is on its way. In the meantime, we'd love to hear about your situation.</p>
                <Button size="lg" onClick={()=>onNav("contact")} iconRight={<ArrowRight width={18} height={18}/>}>Talk to a broker</Button>
              </Card>
            ) : (
              <React.Fragment>
                {d.sections && d.sections.map((sec, i) => (
                  <div key={i} style={cs.section}>
                    <h2 style={cs.h2}>{sec.h}</h2>
                    {renderBlocks(sec.blocks)}
                  </div>
                ))}

                {d.callout && (
                  <Card elevation="shadow" style={cs.calloutCard}>
                    <h2 style={cs.calloutH}>{d.callout.h}</h2>
                    {renderBlocks(d.callout.blocks)}
                  </Card>
                )}

                {d.closing && <p style={cs.closing}>{d.closing}</p>}

                {d.faqs && (
                  <div style={cs.section}>
                    <h2 style={cs.h2}>Frequently Asked Questions</h2>
                    <Card elevation="shadow" style={cs.faqCard}>
                      <Accordion items={d.faqs}/>
                    </Card>
                  </div>
                )}

                <div style={cs.ctaRow}>
                  <Button size="lg" onClick={()=>onNav("contact")} iconRight={<ArrowRight width={18} height={18}/>}>Talk to a broker</Button>
                  <Button size="lg" variant="secondary" onClick={()=>onNav("who-we-help")}>See more stories</Button>
                </div>
              </React.Fragment>
            )}
          </div>

          <aside style={cs.side}>
            <Card elevation="shadow" style={cs.sideCard}>
              <h3 style={cs.sideH}>Related</h3>
              <div style={cs.sideLinks}>
                {(d.relatedLinks || [
                  { label: "Financial Toolkit", id: "financial-toolkit" },
                  { label: "Calculator Hub", id: "calculator-hub" },
                ]).map((l, i) => (
                  <a key={i} href="#" onClick={(e)=>{e.preventDefault();onNav(l.id);}} style={cs.sideLink}>
                    {l.label} <ArrowRight width={15} height={15}/>
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

const cs = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"20px 28px 48px",
    display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" },
  h1: { fontSize:40, lineHeight:1.12, margin:"4px 0 4px", color:"var(--navy-700)", letterSpacing:"-.02em", maxWidth:820 },
  lead: { fontSize:18, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:760 },

  body: { padding:"56px 0 80px" },
  bodyInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px",
    display:"grid", gridTemplateColumns:"1fr 300px", gap:48, alignItems:"start" },
  bodyInnerMobile: { gridTemplateColumns:"1fr", gap:28 },
  main: { maxWidth:720 },

  section: { marginBottom:36 },
  h2: { fontSize:26, margin:"0 0 14px", color:"var(--navy-700)", letterSpacing:"-.01em" },
  p: { fontSize:17, lineHeight:1.7, color:"var(--text-body)", margin:"0 0 14px" },
  list: { listStyle:"none", padding:0, margin:"0 0 16px", display:"flex", flexDirection:"column", gap:10 },
  li: { display:"flex", alignItems:"flex-start", gap:12, fontSize:17, lineHeight:1.5, color:"var(--navy-700)", fontWeight:600 },
  inlineLink: { display:"inline-flex", alignItems:"center", gap:6, fontSize:16, fontWeight:700, color:"var(--color-primary)", textDecoration:"none" },
  check: { flex:"none", width:24, height:24, borderRadius:"50%", background:"var(--color-success)", color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center", marginTop:1 },

  faqCard: { padding:"8px 28px 20px", background:"#fff", margin:"0 0 28px" },
  calloutCard: { display:"flex", flexDirection:"column", gap:4, padding:"28px 32px", background:"var(--blue-50)", border:"1px solid var(--blue-200)", margin:"8px 0 28px" },
  calloutH: { fontSize:23, margin:"0 0 10px", color:"var(--navy-700)" },
  closing: { fontFamily:"var(--font-display)", fontSize:20, lineHeight:1.45, color:"var(--color-primary)", fontWeight:700, margin:"0 0 28px" },
  ctaRow: { display:"flex", gap:12, flexWrap:"wrap" },

  soonCard: { display:"flex", flexDirection:"column", gap:20, alignItems:"flex-start", padding:"32px 36px", background:"#fff" },

  side: { position:"sticky", top:24 },
  sideCard: { display:"flex", flexDirection:"column", gap:14, padding:"24px 26px", background:"#fff" },
  sideH: { fontSize:14, fontWeight:700, letterSpacing:".04em", textTransform:"uppercase", color:"var(--text-muted)", margin:0 },
  sideLinks: { display:"flex", flexDirection:"column", gap:12 },
  sideLink: { display:"inline-flex", alignItems:"center", gap:6, fontSize:15.5, fontWeight:600, color:"var(--color-primary)", textDecoration:"none" },
};

Object.assign(window, { MeshCaseStudyScreen: CaseStudyScreen });

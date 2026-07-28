/* My Credit File — long-form guide to checking your credit report in Australia.
   Article column (readable measure) + sticky sidebar (free-report links + CTA),
   so the page fills the container width without an over-long line length. */
function MyCreditFileScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Card, Button, Breadcrumb } = DS;
  const { ArrowRight, ArrowUpRight } = window.MeshIcons;
  const d = window.MeshContent.myCreditFile;
  const isMobile = window.useIsMobile();

  /* A paragraph/list item may be a plain string or an array of parts, where a
     part is either a string or {a,href} for an inline external link. */
  const renderParts = (parts) => {
    if (!Array.isArray(parts)) return parts;
    return parts.map((seg, i) =>
      typeof seg === "string"
        ? <React.Fragment key={i}>{seg}</React.Fragment>
        : <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer" style={mcfS.inlineLink}>{seg.a}</a>
    );
  };

  const renderBlock = (b, i) => {
    if (b.h3) return <h3 key={i} style={mcfS.h3}>{b.h3}</h3>;
    if (b.p) return <p key={i} style={mcfS.p}>{renderParts(b.p)}</p>;
    if (b.list) return <ul key={i} style={mcfS.list}>{b.list.map((li, j) => <li key={j} style={mcfS.li}>{renderParts(li)}</li>)}</ul>;
    return null;
  };

  const sidebar = (
    <React.Fragment>
      <Card elevation="shadow" padded={false} style={mcfS.sideCard}>
        <h3 style={mcfS.sideH}>Get your free report</h3>
        <p style={mcfS.sideSub}>You can request a free copy once every three months.</p>
        <div style={mcfS.provList}>
          {d.providers.map((pr, i) => (
            <a key={i} href={pr.href} target="_blank" rel="noopener noreferrer" style={mcfS.provRow}>
              <span>
                <span style={mcfS.provName}>{pr.name}</span>
                <span style={mcfS.provBlurb}>{pr.blurb}</span>
              </span>
              {ArrowUpRight
                ? <ArrowUpRight width={16} height={16} style={{color:"var(--color-primary)",flex:"none"}}/>
                : <ArrowRight width={16} height={16} style={{color:"var(--color-primary)",flex:"none"}}/>}
            </a>
          ))}
        </div>
      </Card>
      <Card elevation="shadow" padded={false} style={mcfS.ctaCard}>
        <h3 style={mcfS.ctaH}>{d.cta.heading}</h3>
        <p style={mcfS.ctaSub}>{d.cta.sub}</p>
        <Button block size="lg" onClick={()=>onNav("contact")} iconRight={<ArrowRight width={18} height={18}/>}>{d.cta.button}</Button>
      </Card>
    </React.Fragment>
  );

  return (
    <div>
      <section style={mcfS.head}>
        <div style={mcfS.headInner}>
          <Breadcrumb items={[
            {label:"Home", href:window.meshHref("home"), onClick:(e)=>{e.preventDefault();onNav("home");}},
            {label:"Guides and Tools", href:window.meshHref("knowledge-centre"), onClick:(e)=>{e.preventDefault();onNav("knowledge-centre");}},
            {label:"My Credit File"},
          ]}/>
          <Badge color="blue" dot>Guides and Tools</Badge>
          <h1 style={mcfS.h1}>{d.title}</h1>
          {d.intro.map((p, i) => <p key={i} style={mcfS.lead}>{p}</p>)}
        </div>
      </section>

      <section style={mcfS.body}>
        <div style={{...mcfS.inner, ...(isMobile ? mcfS.innerMobile : {})}}>
          <article style={mcfS.article}>
            {d.sections.map((sec, i) => (
              <div key={i} style={mcfS.section}>
                <h2 style={mcfS.h2}>{sec.h}</h2>
                {sec.blocks.map(renderBlock)}
              </div>
            ))}
            <p style={mcfS.note}>{d.note}</p>
          </article>
          <aside style={{...mcfS.aside, ...(isMobile ? mcfS.asideMobile : {})}}>
            <div style={isMobile ? {} : mcfS.asideSticky}>{sidebar}</div>
          </aside>
        </div>
      </section>
    </div>
  );
}

const mcfS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:14, alignItems:"flex-start" },
  h1: { fontSize:38, margin:"2px 0 4px", color:"var(--navy-700)", letterSpacing:"-.02em", lineHeight:1.15, maxWidth:820 },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:760 },

  body: { background:"var(--surface-page)", padding:"56px 0 80px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px",
    display:"grid", gridTemplateColumns:"minmax(0,1fr) 320px", gap:48, alignItems:"start" },
  innerMobile: { gridTemplateColumns:"1fr", padding:"0 20px", gap:32 },

  article: { minWidth:0, maxWidth:760 },
  section: { marginBottom:34 },
  h2: { fontSize:23, margin:"0 0 14px", color:"var(--navy-700)", letterSpacing:"-.01em", lineHeight:1.2 },
  h3: { fontSize:17, margin:"22px 0 8px", color:"var(--navy-700)", fontWeight:700 },
  p: { fontSize:16, lineHeight:1.7, color:"var(--text-body)", margin:"0 0 14px" },
  list: { listStyle:"disc", margin:"0 0 14px", padding:"0 0 0 22px", display:"flex", flexDirection:"column", gap:8 },
  li: { fontSize:16, lineHeight:1.6, color:"var(--text-body)" },
  inlineLink: { color:"var(--color-primary)", fontWeight:600, textDecoration:"none" },
  note: { fontSize:13.5, lineHeight:1.6, color:"var(--text-muted)", margin:"8px 0 0",
    paddingTop:20, borderTop:"1px solid var(--border-subtle)" },

  aside: { minWidth:0 },
  asideMobile: {},
  asideSticky: { position:"sticky", top:90, display:"flex", flexDirection:"column", gap:18 },
  sideCard: { padding:"22px 24px", background:"#fff" },
  sideH: { fontFamily:"var(--font-display)", fontSize:18, color:"var(--navy-700)", margin:"0 0 4px", fontWeight:700 },
  sideSub: { fontSize:13.5, color:"var(--text-muted)", lineHeight:1.5, margin:"0 0 14px" },
  provList: { display:"flex", flexDirection:"column", gap:10 },
  provRow: { display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, textDecoration:"none",
    padding:"12px 14px", borderRadius:"var(--radius-md)", background:"var(--blue-50)", border:"1px solid var(--border-subtle)" },
  provName: { display:"block", fontWeight:700, fontSize:15, color:"var(--navy-700)" },
  provBlurb: { display:"block", fontSize:12.5, color:"var(--text-muted)", lineHeight:1.4, marginTop:2 },
  ctaCard: { padding:"24px 26px", background:"#fff", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:0 },
  ctaH: { fontFamily:"var(--font-display)", fontSize:19, color:"var(--navy-700)", margin:"0 0 8px", fontWeight:700 },
  ctaSub: { fontSize:14.5, color:"var(--text-body)", lineHeight:1.55, margin:"0 0 18px" },
};

Object.assign(window, { MeshMyCreditFileScreen: MyCreditFileScreen });

/* Financial Hardship Support and Free Resources — a plain, non-marketing page
   for people we couldn't help with lending. Same layout language as
   MyCreditFileScreen (blue-50 header + float sidebar + article sections), with
   a phone callout block and click-to-call helplines in the sidebar. */
function HardshipSupportScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Card, Button, Breadcrumb } = DS;
  const { ArrowRight, ArrowUpRight } = window.MeshIcons;
  const d = window.MeshContent.hardshipSupport;
  const isMobile = window.useIsMobile();

  /* A paragraph/list item may be a plain string or an array of parts, where a
     part is either a string or {a,href} for an inline external link. */
  const renderParts = (parts) => {
    if (!Array.isArray(parts)) return parts;
    return parts.map((seg, i) =>
      typeof seg === "string"
        ? <React.Fragment key={i}>{seg}</React.Fragment>
        : <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer" style={hsS.inlineLink}>{seg.a}</a>
    );
  };

  const renderPhone = (ph, i) => (
    <div key={i} style={hsS.phoneBox}>
      <span style={hsS.phoneLabel}>{ph.label}</span>
      <a href={ph.tel} style={hsS.phoneNumber}>{ph.number}</a>
      {ph.web && (
        <a href={ph.web.href} target="_blank" rel="noopener noreferrer" style={hsS.phoneWeb}>{ph.web.a}</a>
      )}
    </div>
  );

  const renderBlock = (b, i) => {
    if (b.h3) return <h3 key={i} style={hsS.h3}>{b.h3}</h3>;
    if (b.p) return <p key={i} style={hsS.p}>{renderParts(b.p)}</p>;
    if (b.list) return <ul key={i} style={hsS.list}>{b.list.map((li, j) => <li key={j} style={hsS.li}>{renderParts(li)}</li>)}</ul>;
    if (b.phone) return renderPhone(b.phone, i);
    return null;
  };

  const sidebar = (
    <React.Fragment>
      <Card elevation="shadow" padded={false} style={hsS.sideCard}>
        <h3 style={hsS.sideH}>Free, confidential support</h3>
        <p style={hsS.sideSub}>You can call these services directly. There is no cost to speak with them.</p>
        <div style={hsS.provList}>
          {d.helplines.map((hl, i) => (
            <div key={i} style={hsS.provRow}>
              <span style={hsS.provName}>{hl.name}</span>
              <a href={hl.tel} style={hsS.provNumber}>{hl.number}</a>
              {hl.web && (
                <a href={hl.web.href} target="_blank" rel="noopener noreferrer" style={hsS.provWeb}>
                  {hl.web.a}
                  {ArrowUpRight && <ArrowUpRight width={13} height={13} style={{flex:"none"}}/>}
                </a>
              )}
            </div>
          ))}
        </div>
      </Card>
      <Card elevation="shadow" padded={false} style={hsS.ctaCard}>
        <h3 style={hsS.ctaH}>{d.cta.heading}</h3>
        <p style={hsS.ctaSub}>{d.cta.sub}</p>
        <Button block size="lg" onClick={()=>onNav("contact")} iconRight={ArrowRight ? <ArrowRight width={18} height={18}/> : null}>{d.cta.button}</Button>
      </Card>
    </React.Fragment>
  );

  return (
    <div>
      <section style={hsS.head}>
        <div style={hsS.headInner}>
          <Breadcrumb items={[
            {label:"Home", href:window.meshHref("home"), onClick:(e)=>{e.preventDefault();onNav("home");}},
            {label:"Financial Hardship Support"},
          ]}/>
          <Badge color="blue" dot>Free Support</Badge>
          <h1 style={hsS.h1}>{d.title}</h1>
          {d.intro.map((p, i) => <p key={i} style={hsS.lead}>{p}</p>)}
        </div>
      </section>

      <section style={hsS.body}>
        <div style={{...hsS.inner, ...(isMobile ? hsS.innerMobile : {})}}>
          {!isMobile && <div style={hsS.floatBox}>{sidebar}</div>}
          <article style={hsS.article}>
            {d.sections.map((sec, i) => (
              <div key={i} style={hsS.section}>
                <h2 style={hsS.h2}>{sec.h}</h2>
                {sec.blocks.map(renderBlock)}
              </div>
            ))}
            <p style={hsS.note}>{d.note}</p>
          </article>
          {isMobile && <div style={hsS.mobileBox}>{sidebar}</div>}
        </div>
      </section>
    </div>
  );
}

const hsS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:14, alignItems:"flex-start" },
  h1: { fontSize:38, margin:"2px 0 4px", color:"var(--navy-700)", letterSpacing:"-.02em", lineHeight:1.15, maxWidth:820 },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:760 },

  body: { background:"var(--surface-page)", padding:"56px 0 80px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },
  innerMobile: { padding:"0 20px" },

  floatBox: { float:"right", width:320, marginLeft:44, marginBottom:24,
    display:"flex", flexDirection:"column", gap:18 },
  mobileBox: { marginTop:32, display:"flex", flexDirection:"column", gap:18 },

  article: { minWidth:0 },
  section: { marginBottom:34 },
  h2: { fontSize:23, margin:"0 0 14px", color:"var(--navy-700)", letterSpacing:"-.01em", lineHeight:1.2 },
  h3: { fontSize:17, margin:"22px 0 8px", color:"var(--navy-700)", fontWeight:700 },
  p: { fontSize:16, lineHeight:1.7, color:"var(--text-body)", margin:"0 0 14px" },
  list: { listStyle:"disc", margin:"0 0 14px", padding:"0 0 0 22px", display:"flex", flexDirection:"column", gap:8 },
  li: { fontSize:16, lineHeight:1.6, color:"var(--text-body)" },
  inlineLink: { color:"var(--color-primary)", fontWeight:600, textDecoration:"none" },
  note: { fontSize:13.5, lineHeight:1.6, color:"var(--text-muted)", margin:"8px 0 0",
    paddingTop:20, borderTop:"1px solid var(--border-subtle)" },

  phoneBox: { display:"flex", flexDirection:"column", gap:2, margin:"4px 0 16px",
    padding:"14px 18px", background:"var(--blue-50)", borderRadius:"var(--radius-md)",
    border:"1px solid var(--border-subtle)", alignItems:"flex-start" },
  phoneLabel: { fontSize:13, fontWeight:700, color:"var(--navy-700)", textTransform:"uppercase", letterSpacing:".03em" },
  phoneNumber: { fontFamily:"var(--font-display)", fontSize:24, fontWeight:700, color:"var(--color-primary)", textDecoration:"none", lineHeight:1.2 },
  phoneWeb: { fontSize:14, fontWeight:600, color:"var(--color-primary)", textDecoration:"none", marginTop:2 },

  sideCard: { padding:"22px 24px", background:"#fff" },
  sideH: { fontFamily:"var(--font-display)", fontSize:18, color:"var(--navy-700)", margin:"0 0 4px", fontWeight:700 },
  sideSub: { fontSize:13.5, color:"var(--text-muted)", lineHeight:1.5, margin:"0 0 14px" },
  provList: { display:"flex", flexDirection:"column", gap:10 },
  provRow: { display:"flex", flexDirection:"column", gap:2, padding:"12px 14px",
    borderRadius:"var(--radius-md)", background:"var(--blue-50)", border:"1px solid var(--border-subtle)" },
  provName: { fontWeight:700, fontSize:14.5, color:"var(--navy-700)" },
  provNumber: { fontFamily:"var(--font-display)", fontSize:19, fontWeight:700, color:"var(--color-primary)", textDecoration:"none" },
  provWeb: { display:"inline-flex", alignItems:"center", gap:4, fontSize:12.5, fontWeight:600, color:"var(--color-primary)", textDecoration:"none", marginTop:2 },
  ctaCard: { padding:"24px 26px", background:"#fff", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:0 },
  ctaH: { fontFamily:"var(--font-display)", fontSize:19, color:"var(--navy-700)", margin:"0 0 8px", fontWeight:700 },
  ctaSub: { fontSize:14.5, color:"var(--text-body)", lineHeight:1.55, margin:"0 0 18px" },
};

Object.assign(window, { MeshHardshipSupportScreen: HardshipSupportScreen });

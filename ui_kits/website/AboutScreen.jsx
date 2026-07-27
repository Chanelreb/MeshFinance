/* About Us — introduces the Mesh Finance team with alternating photo/bio rows.
   Each member shows a real photo when `photo` is set, otherwise a styled
   initials avatar so the layout looks intentional until photos are supplied. */

/* Shows the member's photo as a circular headshot, with per-person framing
   (photoPos / photoZoom). Falls back to the initials avatar if the photo
   isn't set or fails to load. A hidden <img> detects load failures. */
function MemberPhoto({ m }) {
  const [failed, setFailed] = React.useState(false);
  if (!m.photo || failed) {
    return <div style={ab.avatar}><span style={ab.avatarInitials}>{m.initials}</span></div>;
  }
  return (
    <React.Fragment>
      <div role="img" aria-label={m.name} style={{
        ...ab.photoImg,
        backgroundImage: `url(${m.photo})`,
        backgroundSize: m.photoZoom || "cover",
        backgroundPosition: m.photoPos || "center",
        backgroundRepeat: "no-repeat",
      }}/>
      <img src={m.photo} alt="" aria-hidden="true" style={{ display:"none" }} onError={()=>setFailed(true)}/>
    </React.Fragment>
  );
}

function AboutScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Button, Card } = DS;
  const { ArrowRight } = window.MeshIcons;
  const d = window.MeshContent.about;
  const isMobile = window.useIsMobile();

  return (
    <div>
      <style>{`
        .mesh-about-row{ display:grid; grid-template-columns:300px 1fr; gap:56px; align-items:center; }
        .mesh-about-row--flip{ grid-template-columns:1fr 300px; }
        .mesh-about-row--flip .mesh-about-photo{ order:2; }
        .mesh-about-row--flip .mesh-about-bio{ order:1; }
        @media (max-width:860px){
          .mesh-about-row, .mesh-about-row--flip{ grid-template-columns:1fr; gap:24px; justify-items:center; text-align:center; }
          .mesh-about-row--flip .mesh-about-photo{ order:0; }
          .mesh-about-row--flip .mesh-about-bio{ order:0; }
          .mesh-about-bio{ text-align:left; }
        }
      `}</style>

      <section style={ab.head}>
        <div style={ab.headInner}>
          <Badge color="blue" dot>{d.eyebrow}</Badge>
          <h1 style={ab.h1}>{d.title}</h1>
          <p style={ab.lead}>{d.intro}</p>
        </div>
      </section>

      <section style={ab.body}>
        <div style={ab.bodyInner}>
          {d.team.map((m, i) => (
            <div key={m.id}
              className={"mesh-about-row" + (i % 2 === 1 ? " mesh-about-row--flip" : "")}
              style={{ marginBottom: i === d.team.length - 1 ? 0 : 64 }}>
              <div className="mesh-about-photo" style={ab.photoWrap}>
                <MemberPhoto m={m}/>
              </div>
              <div className="mesh-about-bio" style={ab.bioCol}>
                <div style={ab.nameRow}>
                  <h2 style={ab.name}>{m.name}</h2>
                  {m.comingSoon && <span style={ab.soon}>Bio coming soon</span>}
                </div>
                <div style={ab.role}>{m.role}</div>
                {m.bio.map((p, j) => <p key={j} style={ab.para}>{p}</p>)}
              </div>
            </div>
          ))}

          <Card elevation="shadow" style={ab.ctaCard}>
            <p style={ab.ctaP}>Ready to have a genuine, no-obligation chat about your finances? We'd love to hear from you.</p>
            <Button size="lg" onClick={()=>onNav("contact")} iconRight={<ArrowRight width={18} height={18}/>}>Book an appointment</Button>
          </Card>
        </div>
      </section>
    </div>
  );
}

const ab = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" },
  h1: { fontSize:42, lineHeight:1.1, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:18, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:760 },

  body: { padding:"56px 0 80px" },
  bodyInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },

  photoWrap: { display:"flex", justifyContent:"center" },
  photoImg: { width:220, height:220, objectFit:"cover", borderRadius:"50%", boxShadow:"var(--shadow-md)" },
  avatar: { width:220, height:220, borderRadius:"50%",
    background:"linear-gradient(150deg, var(--navy-700), var(--blue-600))",
    display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"var(--shadow-md)" },
  avatarInitials: { fontFamily:"var(--font-display)", fontWeight:800, fontSize:64, color:"#fff", letterSpacing:".02em" },

  bioCol: { display:"flex", flexDirection:"column" },
  nameRow: { display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:4 },
  name: { fontFamily:"var(--font-display)", fontSize:28, lineHeight:1.15, color:"var(--navy-700)", margin:0, letterSpacing:"-.01em" },
  soon: { fontSize:12, fontWeight:600, color:"var(--text-muted)", background:"var(--surface-page)",
    border:"1px solid var(--border-subtle)", padding:"4px 10px", borderRadius:999 },
  role: { fontSize:15, fontWeight:700, color:"var(--color-primary)", textTransform:"uppercase",
    letterSpacing:".04em", marginBottom:16 },
  para: { fontSize:15.5, lineHeight:1.65, color:"var(--text-body)", margin:"0 0 14px" },

  ctaCard: { display:"flex", flexDirection:"column", gap:20, alignItems:"flex-start",
    padding:"32px 36px", background:"#fff", marginTop:64 },
  ctaP: { fontFamily:"var(--font-display)", fontSize:19, lineHeight:1.45, color:"var(--navy-700)",
    fontWeight:600, margin:"0 0 16px", maxWidth:680 },
};

Object.assign(window, { MeshAboutScreen: AboutScreen });

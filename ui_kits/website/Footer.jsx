/* Dark navy footer, mirrors the live site (logo, licence line, links, contact). */
function Footer({ onNav }) {
  const { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } = window.MeshIcons;
  const isMobile = window.useIsMobile();
  const Col = ({ title, items }) => (
    <div>
      <h5 style={ft.h}>{title}</h5>
      <ul style={ft.ul}>
        {items.map((t,i)=>(
          <li key={i}><a href={window.meshHref(t.id)} onClick={(e)=>{e.preventDefault();onNav&&onNav(t.id);}} style={ft.a}>{t.label}</a></li>
        ))}
      </ul>
    </div>
  );
  return (
    <footer style={ft.wrap}>
      <div style={{...ft.inner, ...(isMobile ? ft.innerMobile : {})}}>
        <div style={ft.brandCol}>
          <img src="../../assets/mesh-logo-white.png" alt="Mesh Finance" style={{height:46}}/>
          <p style={ft.licence}>Credit Representative Number 506123 is authorised under Australian Credit Licence Number 384704.</p>
          <div style={ft.social}>
            {[
              { Ic: Facebook, href: "https://www.facebook.com/meshfinance", label: "Mesh Finance on Facebook" },
              { Ic: Instagram, href: "https://www.instagram.com/mesh_finance/", label: "Mesh Finance on Instagram" },
              { Ic: Linkedin, href: "https://www.linkedin.com/in/chanel-rebello-financebroker/", label: "Mesh Finance on LinkedIn" },
            ].map(({ Ic, href, label }, i) => (
              <a key={i} href={href} aria-label={label}
                {...(href !== "#" ? { target: "_blank", rel: "noopener noreferrer" } : { onClick: (e)=>e.preventDefault() })}
                style={ft.soc}><Ic width={18} height={18}/></a>
            ))}
          </div>
        </div>
        <Col title="Calculators" items={[
          {label:"Borrowing Power",id:"calc-borrowing-power"},{label:"Loan Repayment",id:"calc-loan-repayment"},{label:"Interest Only",id:"calc-interest-only"},
          {label:"Stamp Duty Calculator",id:"calc-stamp-duty"},{label:"Saving Calculator",id:"calc-savings"},
          {label:"Extra Repayment Calculator",id:"calc-extra-repayment"},{label:"Lump Sum Repayment",id:"calc-lump-sum"},
          {label:"How Long to Repay",id:"calc-how-long"},{label:"Offset vs Redraw",id:"calc-offset-vs-redraw"}]}/>
        <Col title="Guides & Tools" items={[
          {label:"FAQ's",id:"faqs"},{label:"Knowledge Centre",id:"knowledge-centre"},
          {label:"Helpful Articles",id:"helpful-articles"},{label:"My Credit File",id:"my-credit-file"},
          {label:"Property Profile Report",id:"property-profile-report"},
          {label:"Family Guarantee Home Loans",id:"family-guarantee"}]}/>
        <div>
          <h5 style={ft.h}>Get in touch</h5>
          <ul style={ft.ul}>
            <li style={ft.contact}><Mail width={16} height={16} style={{color:"var(--blue-400)"}}/> hello@meshfinance.com.au</li>
            <li style={ft.contact}><Phone width={16} height={16} style={{color:"var(--blue-400)"}}/> 0416 291 241</li>
            <li style={ft.contact}><MapPin width={16} height={16} style={{color:"var(--blue-400)"}}/> Suite 206, Level 2, 96 Mill Point Rd, South Perth</li>
            <li><a href="/referral-hub" onClick={(e)=>{e.preventDefault();onNav&&onNav("referral-hub");}} style={ft.a}>Refer a friend →</a></li>
          </ul>
        </div>
      </div>
      <div style={{...ft.bottom, ...(isMobile ? ft.bottomMobile : {})}}>
        <span>©2026 Mesh Finance. All Rights Reserved.</span>
        <span style={ft.legal}>
          <a href="/privacy-policy" onClick={(e)=>{e.preventDefault();onNav&&onNav("privacy-policy");}} style={ft.legalLink}>Privacy Policy</a>
          &nbsp;|&nbsp; Terms &amp; Conditions &nbsp;|&nbsp; Disclaimer
        </span>
      </div>
    </footer>
  );
}

const ft = {
  wrap: { background:"var(--navy-800)", color:"#fff", marginTop:"auto" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"56px 28px 36px",
    display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 1.4fr", gap:40 },
  innerMobile: { gridTemplateColumns:"1fr", gap:32, padding:"40px 24px 28px" },
  brandCol: { display:"flex", flexDirection:"column", gap:18, alignItems:"flex-start" },
  licence: { fontSize:12.5, lineHeight:1.6, color:"rgba(255,255,255,.6)", maxWidth:300, margin:0 },
  social: { display:"flex", gap:10 },
  soc: { width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,.1)", color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none" },
  h: { fontFamily:"var(--font-display)", fontSize:12, letterSpacing:".1em", textTransform:"uppercase",
    color:"#fff", margin:"0 0 16px", fontWeight:700 },
  ul: { listStyle:"none", margin:0, padding:0, display:"grid", gap:11 },
  a: { color:"rgba(255,255,255,.7)", textDecoration:"none", fontSize:14 },
  contact: { display:"flex", gap:9, alignItems:"flex-start", color:"rgba(255,255,255,.7)", fontSize:13.5, lineHeight:1.45 },
  bottom: { borderTop:"1px solid rgba(255,255,255,.12)", padding:"20px 28px",
    maxWidth:"var(--container-max)", margin:"0 auto", display:"flex", justifyContent:"space-between",
    fontSize:12.5, color:"rgba(255,255,255,.55)" },
  bottomMobile: { flexDirection:"column", gap:8, padding:"20px 24px", textAlign:"center" },
  legal: { color:"rgba(255,255,255,.55)" },
  legalLink: { color:"rgba(255,255,255,.75)", textDecoration:"none" },
};

Object.assign(window, { MeshFooter: Footer });

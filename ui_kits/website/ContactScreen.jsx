/* Contact / Book Now, split layout: details + booking form. */
function ContactScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Card, Button, Field, Input, Select, Textarea, Checkbox, Radio, Badge } = DS;
  const { Phone, Mail, MapPin, Clock } = window.MeshIcons;
  const { useState } = React;
  const [sent, setSent] = useState(false);
  const isMobile = window.useIsMobile();

  return (
    <div style={ct.page}>
      <div style={{...ct.inner, ...(isMobile ? ct.innerMobile : {})}}>
        <div style={ct.left}>
          <Badge color="solid">Book now</Badge>
          <h1 style={ct.h1}>Let's start with a chat.</h1>
          <p style={ct.lead}>Tell us a little about what you're after and the best time to reach you. There's no cost and no obligation, just clear, friendly advice.</p>
          <ul style={ct.details}>
            <li style={ct.row}><span style={ct.ic}><Phone width={18} height={18}/></span><div><div style={ct.rowL}>Phone</div><div style={ct.rowV}>0416 291 241</div></div></li>
            <li style={ct.row}><span style={ct.ic}><Mail width={18} height={18}/></span><div><div style={ct.rowL}>Email</div><div style={ct.rowV}>hello@meshfinance.com.au</div></div></li>
            <li style={ct.row}><span style={ct.ic}><MapPin width={18} height={18}/></span><div><div style={ct.rowL}>Office</div><div style={ct.rowV}>Suite 206, Level 2, 96 Mill Point Road, South Perth</div></div></li>
            <li style={ct.row}><span style={ct.ic}><Clock width={18} height={18}/></span><div><div style={ct.rowL}>Hours</div><div style={ct.rowV}>9am – 5pm, Mon–Fri (and after hours when you need us)</div></div></li>
          </ul>
        </div>

        <Card elevation="shadow-lg" style={{padding:32}}>
          {sent ? (
            <div style={ct.thanks}>
              <div style={ct.tick}>✓</div>
              <h3 style={{fontFamily:"var(--font-display)",color:"var(--navy-700)",margin:"0 0 6px"}}>Thank you!</h3>
              <p style={{color:"var(--text-muted)",margin:"0 0 18px"}}>Your message is on its way. We'll be in touch shortly.</p>
              <Button variant="secondary" onClick={()=>setSent(false)}>Send another</Button>
            </div>
          ) : (
            <div style={{display:"grid", gap:15}}>
              <h3 style={{fontFamily:"var(--font-display)",fontSize:20,color:"var(--navy-700)",margin:0,fontWeight:700}}>Reach out for a chat 👋</h3>
              <Field label="Name" required><Input placeholder="Your name"/></Field>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Field label="Email" required><Input type="email" placeholder="you@email.com"/></Field>
                <Field label="Phone" required><Input type="tel" placeholder="04xx xxx xxx"/></Field>
              </div>
              <Field label="Finance Required">
                <Select placeholder="Select Loan Type" defaultValue="">
                  <option>Home Loan</option><option>Car Loan</option><option>Caravan Loan</option>
                  <option>Debt Consolidation</option><option>Personal Loan</option><option>Bad Credit Loan</option>
                </Select>
              </Field>
              <div>
                <div style={ct.legend}>Best time to call</div>
                <div style={{display:"flex",gap:20, flexWrap:"wrap"}}>
                  <Radio name="time" label="Morning" defaultChecked/>
                  <Radio name="time" label="Afternoon"/>
                  <Radio name="time" label="Evening"/>
                </div>
              </div>
              <Field label="Additional message"><Textarea rows={3} placeholder="Tell us a bit about your situation…"/></Field>
              <Checkbox label="I'd like occasional rate & scheme updates"/>
              <Button block size="lg" onClick={(e)=>{e.preventDefault();setSent(true);}}>Send 📩</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

const ct = {
  page: { background:"var(--surface-page)", padding:"56px 0 80px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px",
    display:"grid", gridTemplateColumns:"1fr 480px", gap:56, alignItems:"start" },
  innerMobile: { gridTemplateColumns:"1fr", padding:"0 20px", gap:32 },
  left: { paddingTop:6 },
  h1: { fontSize:42, margin:"14px 0 14px", color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:"0 0 32px", maxWidth:440 },
  details: { listStyle:"none", margin:0, padding:0, display:"grid", gap:20 },
  row: { display:"flex", gap:14, alignItems:"flex-start" },
  ic: { flex:"none", width:44, height:44, borderRadius:"var(--radius-md)", background:"var(--color-primary-soft)",
    color:"var(--color-primary)", display:"flex", alignItems:"center", justifyContent:"center" },
  rowL: { fontSize:12.5, color:"var(--text-subtle)", textTransform:"uppercase", letterSpacing:".08em", fontWeight:600 },
  rowV: { fontSize:15.5, color:"var(--text-strong)", fontWeight:500, lineHeight:1.4, maxWidth:340 },
  legend: { fontFamily:"var(--font-body)", fontWeight:600, fontSize:14, color:"var(--text-strong)", marginBottom:9 },
  thanks: { textAlign:"center", padding:"30px 10px" },
  tick: { width:56, height:56, borderRadius:"50%", background:"var(--color-success)", color:"#fff",
    fontSize:28, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" },
};

Object.assign(window, { MeshContactScreen: ContactScreen });

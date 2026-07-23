/* Contact / Book Now, split layout: details + tabbed card (Calendly booking / message form). */

const CALENDLY_URL = "https://calendly.com/chanel-fqxz/intro-to-mesh-finance-clone";

/* Live Calendly inline embed. Loads Calendly's widget.js once, then mounts the
   scheduler into this div. Bookings land directly in Chanel's calendar. */
function CalendlyEmbed() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    const init = () => {
      if (window.Calendly && el && !el.hasChildNodes()) {
        window.Calendly.initInlineWidget({ url: CALENDLY_URL, parentElement: el });
      }
    };
    if (window.Calendly) { init(); return; }
    let s = document.getElementById("calendly-widget-js");
    if (!s) {
      s = document.createElement("script");
      s.id = "calendly-widget-js";
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.head.appendChild(s);
    }
    s.addEventListener("load", init);
    return () => s.removeEventListener("load", init);
  }, []);
  return <div ref={ref} style={{ minWidth: 280, height: 660 }} aria-label="Book a time with Mesh Finance" />;
}

function ContactScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Card, Button, Field, Input, Select, Textarea, Checkbox, Radio, Badge } = DS;
  const { Phone, Mail, MapPin, Clock } = window.MeshIcons;
  const { useState } = React;
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("book");
  const isMobile = window.useIsMobile();

  const submitMessage = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const ok = await window.MeshSubmitForm(e.target);
      if (ok) setSent(true); else setError(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <section style={ct.head}>
        <div style={ct.headInner}>
          <Badge color="solid">Book Appointment</Badge>
          <h1 style={ct.h1}>Let's start with a chat.</h1>
          <p style={ct.lead}>Tell us a little about what you're after and the best time to reach you. There's no cost and no obligation, just clear, friendly advice.</p>
        </div>
      </section>
      <section style={ct.body}>
      <div style={{...ct.inner, ...(isMobile ? ct.innerMobile : {})}}>
        <div style={ct.left}>
          <ul style={ct.details}>
            <li style={ct.row}><span style={ct.ic}><Phone width={18} height={18}/></span><div><div style={ct.rowL}>Phone</div><div style={ct.rowV}>0416 291 241</div></div></li>
            <li style={ct.row}><span style={ct.ic}><Mail width={18} height={18}/></span><div><div style={ct.rowL}>Email</div><div style={ct.rowV}>hello@meshfinance.com.au</div></div></li>
            <li style={ct.row}><span style={ct.ic}><MapPin width={18} height={18}/></span><div><div style={ct.rowL}>Office</div><div style={ct.rowV}>Suite 206, Level 2, 96 Mill Point Road, South Perth</div></div></li>
            <li style={ct.row}><span style={ct.ic}><Clock width={18} height={18}/></span><div><div style={ct.rowL}>Hours</div><div style={ct.rowV}>9am – 5pm, Mon–Fri (and after hours when you need us)</div></div></li>
          </ul>
        </div>

        <Card elevation="shadow-lg" style={{padding:"24px 32px 32px"}}>
          <div style={ct.tabRow} role="tablist" aria-label="Contact options">
            <button type="button" role="tab" aria-selected={tab==="book"}
              onClick={()=>setTab("book")}
              style={{...ct.tab, ...(tab==="book" ? ct.tabActive : {})}}>
              📅 Book a time
            </button>
            <button type="button" role="tab" aria-selected={tab==="message"}
              onClick={()=>setTab("message")}
              style={{...ct.tab, ...(tab==="message" ? ct.tabActive : {})}}>
              ✉️ Send a message
            </button>
          </div>

          {/* Both panels stay mounted so the Calendly widget doesn't reload on
              every tab switch; the inactive one is hidden. */}
          <div style={{display: tab==="book" ? "block" : "none"}} role="tabpanel">
            <h3 style={ct.tabHead}>Book straight into the calendar 📅</h3>
            <p style={ct.tabSub}>Pick a time that suits you — free, no obligation.</p>
            <CalendlyEmbed/>
          </div>

          <div style={{display: tab==="message" ? "block" : "none"}} role="tabpanel">
          {sent ? (
            <div style={ct.thanks}>
              <div style={ct.tick}>✓</div>
              <h3 style={{fontFamily:"var(--font-display)",color:"var(--navy-700)",margin:"0 0 6px"}}>Thank you!</h3>
              <p style={{color:"var(--text-muted)",margin:"0 0 18px"}}>Your message is on its way. We'll be in touch shortly.</p>
              <Button variant="secondary" onClick={()=>setSent(false)}>Send another</Button>
            </div>
          ) : (
            <form onSubmit={submitMessage} style={{display:"grid", gap:15}}>
              <input type="hidden" name="_subject" value="New message — Mesh Finance contact page"/>
              <h3 style={{fontFamily:"var(--font-display)",fontSize:20,color:"var(--navy-700)",margin:0,fontWeight:700}}>Reach out for a chat 👋</h3>
              <Field label="Name" required><Input name="name" required placeholder="Your name"/></Field>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Field label="Email" required><Input name="email" type="email" required placeholder="you@email.com"/></Field>
                <Field label="Phone" required><Input name="phone" type="tel" required placeholder="04xx xxx xxx"/></Field>
              </div>
              <Field label="Finance Required">
                <Select name="financeRequired" placeholder="Select Loan Type" defaultValue="">
                  <option>Home Loan</option><option>Car Loan</option><option>Caravan Loan</option>
                  <option>Debt Consolidation</option><option>Personal Loan</option><option>Bad Credit Loan</option>
                </Select>
              </Field>
              <div>
                <div style={ct.legend}>Best time to call</div>
                <div style={{display:"flex",gap:20, flexWrap:"wrap"}}>
                  <Radio name="bestTime" label="Morning" value="Morning" defaultChecked/>
                  <Radio name="bestTime" label="Afternoon" value="Afternoon"/>
                  <Radio name="bestTime" label="Evening" value="Evening"/>
                </div>
              </div>
              <Field label="Additional message"><Textarea name="message" rows={3} placeholder="Tell us a bit about your situation…"/></Field>
              <Checkbox name="updatesOptIn" value="yes" label="I'd like occasional rate & scheme updates"/>
              {error && <p style={ct.formError}>Something went wrong, please try again or call us.</p>}
              <Button block size="lg" type="submit" disabled={sending}>{sending ? "Sending…" : "Send 📩"}</Button>
            </form>
          )}
          </div>
        </Card>
      </div>
      </section>
    </div>
  );
}

const ct = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:14, alignItems:"flex-start" },
  body: { background:"var(--surface-page)", padding:"56px 0 80px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px",
    display:"grid", gridTemplateColumns:"1fr 480px", gap:56, alignItems:"start" },
  innerMobile: { gridTemplateColumns:"1fr", padding:"0 20px", gap:32 },
  left: { paddingTop:6 },
  h1: { fontSize:42, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:560 },
  details: { listStyle:"none", margin:0, padding:0, display:"grid", gap:20 },
  row: { display:"flex", gap:14, alignItems:"flex-start" },
  ic: { flex:"none", width:44, height:44, borderRadius:"var(--radius-md)", background:"var(--color-primary-soft)",
    color:"var(--color-primary)", display:"flex", alignItems:"center", justifyContent:"center" },
  rowL: { fontSize:12.5, color:"var(--text-subtle)", textTransform:"uppercase", letterSpacing:".08em", fontWeight:600 },
  rowV: { fontSize:15.5, color:"var(--text-strong)", fontWeight:500, lineHeight:1.4, maxWidth:340 },
  legend: { fontFamily:"var(--font-body)", fontWeight:600, fontSize:14, color:"var(--text-strong)", marginBottom:9 },
  tabRow: { display:"flex", gap:4, borderBottom:"1px solid var(--border-subtle)", marginBottom:20 },
  tab: { appearance:"none", background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-body)",
    fontWeight:600, fontSize:15, color:"var(--text-muted)", padding:"12px 16px",
    borderBottomWidth:2, borderBottomStyle:"solid", borderBottomColor:"transparent", marginBottom:-1 },
  tabActive: { color:"var(--color-primary)", borderBottomColor:"var(--color-primary)" },
  tabHead: { fontFamily:"var(--font-display)", fontSize:20, color:"var(--navy-700)", margin:"0 0 4px", fontWeight:700 },
  tabSub: { fontSize:14, color:"var(--text-muted)", margin:"0 0 16px" },
  formError: { fontSize:13.5, color:"var(--color-danger)", margin:0 },
  thanks: { textAlign:"center", padding:"30px 10px" },
  tick: { width:56, height:56, borderRadius:"50%", background:"var(--color-success)", color:"#fff",
    fontSize:28, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" },
};

Object.assign(window, { MeshContactScreen: ContactScreen });

/* Home Loan Review — campaign landing page for Perth homeowners thinking about
   refinancing, cloned from the Home Loan Review / Family Finance Check
   pages. Standalone conversion page: hero + video, familiar, who it's for,
   process, FAQ, about Chanel, compliance. Three routes: landing, booking (fires
   the Lead conversion) and thank-you. The video is a placeholder until Chanel
   supplies the campaign video. */

const HLR = {
  hero: {
    eyebrow: "Home Loan Review",
    title: "Is your home loan still working for you? Find out in one free review.",
    subhead: "A free Home Loan Review for Perth homeowners: what you're paying now, what you could be paying, and whether refinancing, renegotiating or staying put is the right move.",
    primary: "Book my Home Loan Review",
  },
  familiar: {
    h: "Does this sound familiar?",
    cards: [
      { t: "Rates have gone up, and your repayments with them?" },
      { t: "Haven't looked at your rate since the day you settled?" },
      { t: "Suspect your bank gives new customers a better deal than you?" },
      { t: "Wondering if you could use your equity, but not sure how?" },
    ],
  },
  forWhom: {
    h: "Who the Home Loan Review is for",
    lead: "This is for Perth homeowners who want a straight answer on their mortgage without the hard sell. It may be helpful if:",
    list: [
      "Your repayments have gone up with the recent rate rises",
      "Your fixed rate is ending, or has already rolled onto a variable rate",
      "You haven't reviewed your loan in the last two years",
      "You're paying an annual package fee for features you don't use",
      "You'd like to consolidate other debts into your home loan",
      "You want to access equity for a renovation or an investment",
      "You've been told you can't refinance and want a second opinion",
      "You simply want to know you're on a fair deal",
    ],
    closing: "You don't need your paperwork sorted or to know what rate you're on. Bring what you have and we'll do the rest.",
  },
  process: {
    h: "How it works",
    steps: [
      { t: "Tell us about your loan", b: "You share your lender, rough balance and rate if you know it, and what you'd like your loan to do for you." },
      { t: "We compare your options", b: "We check whether your current lender will sharpen your rate, then compare it against our panel of 40+ lenders." },
      { t: "You get a clear answer", b: "Stay, renegotiate or refinance. We show you the numbers side by side, including any costs, so you decide." },
      { t: "We handle the switch", b: "If refinancing is the right move, we manage the application, discharge and settlement, and keep you updated the whole way." },
    ],
  },
  about: {
    h: "Hi, I'm Chanel",
    paras: [
      "As a finance broker with over seventeen years' experience, I've helped clients through every stage of the journey, from buying their first home, to purchasing their first investment property, to refinancing and restructuring their loans as life changes.",
      "Born and raised in the Perth Hills, I still live locally with my own young family, so I know what a rate rise feels like at the kitchen table. That's why I created the Home Loan Review: a straight answer on whether your loan still fits, with no pressure to switch if staying put is the better outcome.",
      "Whether we meet online or in person, you'll get clear, honest advice from someone who genuinely gets it.",
    ],
    name: "Chanel Rebello, BSc (Mathematical Sciences and Finance)",
    title: "Founder and Finance Broker at Mesh Finance",
    licence: "Credit Representative Number 506123 is authorised under Australian Credit Licence Number 384704.",
  },
  form: {
    h: "Book your Home Loan Review",
    step1Label: "What best describes your situation?",
    describeOptions: [
      "My repayments have gone up and I want to check my rate",
      "My fixed rate is ending soon",
      "I want to access equity or consolidate debt",
      "I just want to know if I'm on a good deal",
    ],
    button: "Book my Home Loan Review",
  },
  faqs: [
    { q: "Is it worth refinancing for a small rate difference?", a: "Often, yes. On a $600,000 loan, a 0.25% difference is roughly $1,500 a year in interest. But refinancing has costs, so we show you the break-even point rather than assume switching is always right. Sometimes your existing lender will match a better rate and you don't need to move at all." },
    { q: "What does refinancing cost?", a: "Typically a discharge fee from your current lender, government mortgage registration and discharge fees, and sometimes an application or valuation fee with the new lender, although many waive these. If you're on a fixed rate, break costs can apply. We put every cost in front of you before you decide." },
    { q: "Will refinancing affect my credit score?", a: "A refinance application is recorded on your credit file like any other credit enquiry. One well-prepared application has minimal impact. What hurts is applying to several lenders at once, which is exactly what a broker helps you avoid." },
    { q: "Can I refinance if my situation has changed?", a: "Possibly. Lenders assess your current income, expenses and the value of your property. If you're self-employed, have recently changed jobs, or your property value has moved, the right lender matters. We know which lenders suit which situations." },
    { q: "Do I have to refinance after the review?", a: "No. The review is free and there is no obligation. If staying with your current lender is the better outcome, we'll tell you that." },
    { q: "What does the Home Loan Review cost?", a: "Nothing. If you do refinance, the new lender pays us a commission once the loan settles, and we disclose that upfront." },
  ],
  compliance: "Any information provided is general only and does not take into account your personal objectives, financial situation or needs. Refinancing may not be suitable for everyone and may involve costs. Loan approval is subject to lender assessment, eligibility criteria and credit approval. Fees, charges and lending conditions may apply. Figures quoted are examples only.",
};

/* PLACEHOLDER: swap for the Home Loan Review booking link once Chanel sends it. */
const HLR_BOOKING_EMBED = "https://marketli.app/book/embed/finance-check-in";
const HLR_CALENDLY_URL = "https://calendly.com/chanel-fqxz/intro_to_mesh?hide_event_type_details=1&hide_gdpr_banner=1&text_color=102a43&primary_color=3898e0";

function HomeLoanReviewScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Button, Card, Field, Input, Accordion } = DS;
  const { Check, ArrowRight } = window.MeshIcons;
  const { useState, useRef } = React;
  const isMobile = window.useIsMobile();
  const fs = hlrS;

  const formElRef = useRef(null);

  /* Three-step booking wizard, same flow as the Family Finance Check:
     1) where are you at, 2) contact details, 3) booking. The lead is sent to
     Formspree at the 2 -> 3 transition, then the visitor goes to the dedicated
     booking page, which fires the conversion on load. */
  const [step, setStep] = useState(1);
  const [describes, setDescribes] = useState("");
  const [sending, setSending] = useState(false);
  const [prefill, setPrefill] = useState({});
  /* Video is optional until the campaign file exists: hide the player and show a
     branded placeholder if the source fails to load. */
  const [videoOk, setVideoOk] = useState(true);

  const selectDescribes = (o) => { setDescribes(o); setStep(2); };
  const goToBooking = async () => {
    const form = formElRef.current;
    if (!form) return;
    const ok = ["name", "email", "phone"].every((n) => {
      const el = form.elements[n];
      return el ? el.reportValidity() : true;
    });
    if (!ok) return;
    const name = (form.elements["name"].value || "").trim();
    const email = (form.elements["email"].value || "").trim();
    setPrefill({ name, email });
    setSending(true);
    try { await window.MeshSubmitForm(form); } catch {}
    setSending(false);
    onNav("home-loan-review-booking");
  };

  const CheckList = ({ items }) => (
    <ul style={fs.checkList}>
      {items.map((it, i) => (
        <li key={i} style={fs.checkItem}>
          <span style={fs.checkIcon}><Check width={13} height={13}/></span>{it}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      {/* HERO (blue band runs to the very top; logo sits inside it) */}
      <section style={fs.hero}>
        <div style={fs.logoBar}>
          <a href="/" onClick={(e)=>{e.preventDefault();onNav("home");}} style={fs.logoLink} aria-label="Mesh Finance home">
            <img src="../../assets/mesh-logo.png" alt="Mesh Finance" style={{height:34, display:"block"}}/>
          </a>
          <a href="mailto:hello@meshfinance.com.au" style={fs.logoBarEmail}>hello@meshfinance.com.au</a>
        </div>
        <div style={fs.heroTop}>
          <h1 style={fs.h1}>{HLR.hero.title}</h1>
          <p style={fs.heroSubhead}>{HLR.hero.subhead}</p>
        </div>
        <div style={fs.heroStack}>
          <div style={fs.videoCol}>
            {videoOk ? (
              <video style={fs.heroVideo} controls preload="metadata" playsInline onError={()=>setVideoOk(false)}>
                <source src="../../assets/home-loan-review-video.mp4" type="video/mp4"/>
                Your browser doesn't support embedded video.
              </video>
            ) : (
              <div style={fs.videoInner} role="img" aria-label="Home Loan Review video coming soon">
                <span style={fs.playBtn} aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--navy-700)"><path d="M8 5v14l11-7z"/></svg>
                </span>
                <span style={fs.videoCaption}>Watch: your Home Loan Review in two minutes (video coming soon)</span>
              </div>
            )}
          </div>
          <div style={fs.formCol}>
            <Card elevation="shadow-lg" padded={false} style={fs.formCard}>
              <form ref={formElRef} onSubmit={(e)=>e.preventDefault()} style={{display:"grid", gridTemplateColumns:"minmax(0,1fr)", gap:14}}>
                <input type="hidden" name="_subject" value="New Home Loan Review booking | Mesh Finance"/>
                <input type="hidden" name="campaign" value="Home Loan Review"/>
                <input type="hidden" name="describes" value={describes}/>
                <div>
                  <h2 style={fs.formTitle}>{HLR.form.h}</h2>
                </div>
                <div style={fs.progressRow}>
                  <div style={fs.progressTrack}><div style={{...fs.progressFill, width: step===1 ? "33%" : step===2 ? "66%" : "100%"}}/></div>
                  <span style={fs.stepLabel}>Step {step} of 3</span>
                </div>

                {/* STEP 1 — where are you at */}
                <div style={{display: step===1 ? "grid" : "none", gridTemplateColumns:"minmax(0,1fr)", gap:12}}>
                  <div style={fs.legend}>{HLR.form.step1Label}</div>
                  {HLR.form.describeOptions.map((o,i)=>{
                    const active = describes === o;
                    return (
                      <button type="button" key={i} onClick={()=>selectDescribes(o)}
                        style={{...fs.choice, ...(active ? fs.choiceActive : {})}}>
                        <span style={{...fs.choiceDot, ...(active ? fs.choiceDotActive : {})}}>{active && <Check width={12} height={12}/>}</span>
                        <span>{o}</span>
                      </button>
                    );
                  })}
                </div>

                {/* STEP 2 — contact details */}
                <div style={{display: step===2 ? "grid" : "none", gridTemplateColumns:"minmax(0,1fr)", gap:14}}>
                  <Field label="Name" required><Input name="name" required placeholder="First and last name"/></Field>
                  <Field label="Email" required><Input name="email" type="email" required placeholder="you@email.com"/></Field>
                  <Field label="Phone number" required><Input name="phone" type="tel" required placeholder="04xx xxx xxx"/></Field>
                  <Button block size="lg" type="button" onClick={goToBooking} disabled={sending} iconRight={sending ? null : <ArrowRight width={18} height={18}/>}>{sending ? "One sec…" : "Continue to booking"}</Button>
                  <button type="button" onClick={()=>setStep(1)} style={fs.backLink}>← Back</button>
                </div>

                {/* STEP 3 — live Calendly booking (kept for parity with the Family Finance Check flow) */}
                {step===3 && (
                  <div style={{display:"grid", gap:10}}>
                    <div>
                      <h3 style={fs.bookH}>Pick a time that suits you 📅</h3>
                      <p style={fs.formSub}>Choose a slot and you're booked in, free and no obligation.</p>
                    </div>
                    <HLRCalendlyEmbed prefill={prefill} onScheduled={()=>onNav("hlr-thank-you")}/>
                    <button type="button" onClick={()=>setStep(2)} style={fs.backLink}>← Back</button>
                  </div>
                )}
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* ACCREDITED LENDERS, strip under the hero */}
      <window.MeshLenderStrip/>

      {/* GOOGLE REVIEWS */}
      <section style={fs.reviewsBand}>
        <div style={fs.reviewsInner}><HLRGoogleReviews/></div>
      </section>

      {/* FAMILIAR */}
      <section style={fs.bodyTint}>
        <div style={fs.wide}>
          <h2 style={{...fs.h2, textAlign:"center", marginBottom:28}}>{HLR.familiar.h}</h2>
          <ul style={{...fs.familiarPoints, ...(isMobile ? fs.familiarPointsMobile : {})}}>
            {HLR.familiar.cards.map((c,i)=>(
              <li key={i} style={fs.familiarPoint}>
                <span style={fs.familiarTick}><Check width={14} height={14}/></span>
                <span>{c.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section style={fs.bodyWhite}>
        <div style={fs.narrow}>
          <h2 style={fs.h2}>{HLR.forWhom.h}</h2>
          <p style={fs.p}>{HLR.forWhom.lead}</p>
          <CheckList items={HLR.forWhom.list}/>
          <p style={{...fs.p, fontWeight:600, color:"var(--navy-700)"}}>{HLR.forWhom.closing}</p>
        </div>
      </section>

      {/* PROCESS */}
      <section style={fs.bodyTint}>
        <div style={fs.wide}>
          <h2 style={{...fs.h2, textAlign:"center", marginBottom:28}}>{HLR.process.h}</h2>
          <div style={{...fs.stepGrid, ...(isMobile ? fs.grid1 : {})}}>
            {HLR.process.steps.map((st,i)=>(
              <div key={i} style={fs.stepCard}>
                <span style={fs.stepNum}>{i+1}</span>
                <h3 style={fs.stepTitle}>{st.t}</h3>
                <p style={fs.cardBody}>{st.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={fs.bodyWhite}>
        <div style={fs.narrow}>
          <h2 style={{...fs.h2, marginBottom:18}}>Frequently asked questions</h2>
          <Accordion defaultOpen={[0]} items={HLR.faqs.map(f=>({question:f.q, answer:f.a}))}/>
        </div>
      </section>

      {/* ABOUT CHANEL */}
      <section style={fs.bodyTint}>
        <div style={{...fs.aboutGrid, ...(isMobile ? fs.aboutGridMobile : {})}}>
          <div style={fs.aboutInner}>
            <div style={fs.aboutPhoto} role="img" aria-label="Chanel Rebello"/>
            <h2 style={fs.h2}>{HLR.about.h}</h2>
            {HLR.about.paras.map((p,i)=><p key={i} style={fs.p}>{p}</p>)}
            <p style={fs.aboutName}>{HLR.about.name}</p>
            <p style={fs.aboutTitle}>{HLR.about.title}</p>
            <p style={fs.aboutLicence}>{HLR.about.licence}</p>
            <div style={fs.aboutLogos}>
              <span style={fs.logoChip}><HLRAssocLogo src="../../assets/afca-logo-hi-res.png" label="AFCA"/></span>
              <span style={fs.logoChip}><HLRAssocLogo src="../../assets/FBAA-ACCREDITED-STACKED-LOGO-.jpg" label="FBAA"/></span>
            </div>
          </div>
          <div style={fs.aboutMapCol}>
            <iframe
              title="Mesh Finance office location, South Perth"
              style={fs.aboutMap}
              src="https://www.google.com/maps?q=96%20Mill%20Point%20Road%2C%20South%20Perth%20WA%206151&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <p style={fs.aboutAddress}>
              Suite 206, Level 2, 96 Mill Point Road, South Perth WA 6151
              <br/>
              <a href="https://www.google.com/maps/dir/?api=1&destination=96%20Mill%20Point%20Road%2C%20South%20Perth%20WA%206151"
                 target="_blank" rel="noopener noreferrer" style={fs.aboutDirections}>Get directions</a>
            </p>
          </div>
        </div>
      </section>

      {/* COMPLIANCE */}
      <section style={fs.bodyWhite}>
        <div style={fs.narrow}>
          <p style={fs.compliance}>{HLR.compliance}</p>
        </div>
      </section>
    </div>
  );
}

/* Live Calendly inline booking, prefilled with the visitor's name/email. */
function HLRCalendlyEmbed({ prefill, onScheduled }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    const init = () => {
      if (window.Calendly && el && !el.hasChildNodes()) {
        window.Calendly.initInlineWidget({ url: HLR_CALENDLY_URL, parentElement: el, prefill: prefill || {} });
      }
    };
    if (window.Calendly) { init(); return; }
    let sc = document.getElementById("calendly-widget-js");
    if (!sc) {
      sc = document.createElement("script");
      sc.id = "calendly-widget-js";
      sc.src = "https://assets.calendly.com/assets/external/widget.js";
      sc.async = true;
      document.head.appendChild(sc);
    }
    sc.addEventListener("load", init);
    return () => sc.removeEventListener("load", init);
  }, []);
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data && typeof e.data === "object" && e.data.event === "calendly.event_scheduled") {
        onScheduled && onScheduled();
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onScheduled]);
  return <div ref={ref} style={{ minWidth: 260, height: 700 }} aria-label="Book a time with Mesh Finance"/>;
}

/* Industry-body logo with a labelled fallback. */
function HLRAssocLogo({ src, label }) {
  const [failed, setFailed] = React.useState(false);
  if (failed) return <span style={hlrS.logoBadge} aria-label={label}>{label}</span>;
  return <img src={src} alt={label} style={hlrS.logoImg} onError={()=>setFailed(true)}/>;
}

/* Google reviews (Trustindex) widget, same loader as the homepage. */
function HLRGoogleReviews() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || el.hasChildNodes()) return;
    const sc = document.createElement("script");
    sc.src = "https://cdn.trustindex.io/loader.js?1f3f74d765942510b78680b7215";
    sc.async = true;
    sc.defer = true;
    el.appendChild(sc);
  }, []);
  return <div ref={ref} aria-label="Google reviews for Mesh Finance"/>;
}

/* Styles: a copy of the Family Finance Check landing styles so the two
   campaign pages look identical. Kept separate so each page can diverge. */
const hlrS = {
  logoBar: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"22px 28px 0",
    display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 },
  logoLink: { display:"inline-flex", alignItems:"center" },
  logoBarEmail: { fontFamily:"var(--font-display)", fontWeight:700, fontSize:14.5, color:"var(--navy-700)",
    textDecoration:"none", wordBreak:"break-all" },

  hero: { background:"linear-gradient(rgba(234,244,252,0.72), rgba(234,244,252,0.82)), url(../../assets/officebackground.jpeg) 62% 38%/130% no-repeat" },
  heroTop: { maxWidth:720, margin:"0 auto", padding:"36px 28px 10px",
    display:"flex", flexDirection:"column", gap:14, alignItems:"center", textAlign:"center" },
  heroStack: { maxWidth:640, margin:"0 auto", padding:"8px 28px 52px",
    display:"flex", flexDirection:"column", gap:22 },
  h1: { fontSize:34, lineHeight:1.16, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em" },
  heroSubhead: { fontSize:17, lineHeight:1.5, color:"var(--color-primary)", fontWeight:600, margin:0 },

  formCol: { minWidth:0 },
  videoCol: { minWidth:0, width:"100%" },
  heroVideo: { width:"100%", aspectRatio:"16/9", display:"block", borderRadius:16, overflow:"hidden",
    background:"var(--navy-800)", boxShadow:"var(--shadow-md)", objectFit:"cover" },
  videoInner: { position:"relative", aspectRatio:"16/9", borderRadius:16, overflow:"hidden",
    background:"linear-gradient(150deg, var(--navy-700), var(--blue-600))", boxShadow:"var(--shadow-md)",
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, padding:20, textAlign:"center" },
  playBtn: { width:72, height:72, borderRadius:"50%", background:"#fff", display:"flex", alignItems:"center",
    justifyContent:"center", boxShadow:"0 8px 24px -8px rgba(0,0,0,.5)", paddingLeft:4 },
  videoCaption: { color:"rgba(255,255,255,.9)", fontFamily:"var(--font-body)", fontSize:14, fontWeight:600, letterSpacing:".01em" },
  formCard: { padding:"24px 26px", background:"#fff" },
  formTitle: { fontFamily:"var(--font-display)", fontSize:21, color:"var(--navy-700)", margin:0, fontWeight:700 },
  formSub: { fontSize:14, color:"var(--text-muted)", lineHeight:1.5, margin:0 },
  bookH: { fontFamily:"var(--font-display)", fontSize:18, color:"var(--navy-700)", margin:"0 0 4px", fontWeight:700 },
  choice: { display:"flex", alignItems:"center", gap:12, width:"100%", textAlign:"left", cursor:"pointer",
    padding:"14px 16px", borderRadius:"var(--radius-md)", border:"1.5px solid var(--border-subtle)",
    background:"#fff", fontFamily:"var(--font-body)", fontSize:14.5, fontWeight:600, color:"var(--text-strong)",
    lineHeight:1.4, transition:"border-color .15s, background .15s" },
  choiceActive: { borderColor:"var(--color-primary)", background:"var(--blue-50)" },
  choiceDot: { flex:"none", width:22, height:22, borderRadius:"50%", border:"2px solid var(--border-strong)",
    display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" },
  choiceDotActive: { background:"var(--color-primary)", borderColor:"var(--color-primary)" },
  progressRow: { display:"flex", alignItems:"center", gap:12 },
  progressTrack: { flex:1, height:6, borderRadius:999, background:"var(--blue-50)", overflow:"hidden",
    border:"1px solid var(--border-subtle)" },
  progressFill: { height:"100%", background:"var(--color-primary)", borderRadius:999, transition:"width .3s ease" },
  stepLabel: { flex:"none", fontSize:12.5, fontWeight:600, color:"var(--text-muted)" },
  backLink: { appearance:"none", background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)",
    fontFamily:"var(--font-body)", fontSize:13.5, fontWeight:600, padding:4, justifySelf:"center" },

  reviewsBand: { background:"#fff", borderBottom:"1px solid var(--border-subtle)" },
  reviewsInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"24px 28px" },

  aboutGrid: { maxWidth:1160, margin:"0 auto", padding:"0 24px",
    display:"grid", gridTemplateColumns:"minmax(0,1.55fr) minmax(0,1fr)", gap:44, alignItems:"stretch" },
  aboutGridMobile: { gridTemplateColumns:"minmax(0,1fr)", gap:28, padding:"0 20px" },
  aboutMapCol: { minWidth:0, width:"100%", display:"flex", flexDirection:"column", justifyContent:"center" },
  aboutMap: { width:"100%", flex:"1 1 auto", minHeight:340, border:0, display:"block",
    borderRadius:"var(--radius-lg)", boxShadow:"var(--shadow-md)" },
  aboutAddress: { textAlign:"center", fontSize:13.5, lineHeight:1.6, color:"var(--text-muted)", margin:"14px 0 0" },
  aboutDirections: { color:"var(--blue-500)", fontWeight:600, textDecoration:"none" },
  aboutInner: { maxWidth:720, margin:"0 auto", padding:"0 24px", textAlign:"center" },
  aboutPhoto: { width:180, height:180, borderRadius:"50%", boxShadow:"var(--shadow-md)", margin:"0 auto 22px",
    backgroundImage:"url(../../assets/1.png)", backgroundSize:"150%", backgroundPosition:"center 18%", backgroundRepeat:"no-repeat" },
  aboutName: { fontFamily:"var(--font-display)", fontWeight:700, fontSize:15.5, color:"var(--navy-700)", margin:"6px 0 0" },
  aboutTitle: { fontSize:14, fontWeight:600, color:"var(--text-muted)", margin:"2px 0 0" },
  aboutLicence: { fontSize:12.5, lineHeight:1.5, color:"var(--text-muted)", margin:"10px auto 0", maxWidth:520 },
  aboutLogos: { display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginTop:18, flexWrap:"wrap" },
  logoChip: { display:"inline-flex", alignItems:"center", justifyContent:"center", background:"#fff",
    borderRadius:"var(--radius-md)", padding:"10px 16px", boxShadow:"var(--shadow-sm)", border:"1px solid var(--border-subtle)" },
  logoImg: { height:40, width:"auto", maxWidth:150, objectFit:"contain", display:"block" },
  logoBadge: { display:"inline-flex", alignItems:"center", justifyContent:"center", height:40, padding:"0 14px",
    color:"var(--text-muted)", fontFamily:"var(--font-display)", fontWeight:800, fontSize:16, letterSpacing:".06em" },

  bodyWhite: { background:"var(--surface-page)", padding:"52px 0" },
  bodyTint: { background:"var(--blue-50)", padding:"52px 0" },
  narrow: { maxWidth:820, margin:"0 auto", padding:"0 28px" },
  wide: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },

  h2: { fontSize:28, lineHeight:1.2, margin:"0 0 16px", color:"var(--navy-700)", letterSpacing:"-.01em", textAlign:"center" },
  p: { fontSize:16.5, lineHeight:1.7, color:"var(--text-body)", margin:"0 0 14px", textAlign:"center" },
  checkList: { listStyle:"none", margin:"0 auto 18px", padding:0, display:"grid", gap:10,
    width:"fit-content", maxWidth:"100%", textAlign:"left" },
  checkItem: { display:"flex", gap:12, alignItems:"flex-start", fontSize:15.5, lineHeight:1.5, color:"var(--text-body)", textAlign:"left" },
  checkIcon: { flex:"none", width:22, height:22, borderRadius:"50%", background:"var(--color-success)", color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center", marginTop:1 },

  familiarPoints: { listStyle:"none", margin:"0 auto", padding:0, maxWidth:760,
    display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"16px 40px" },
  familiarPointsMobile: { gridTemplateColumns:"1fr", gap:16 },
  familiarPoint: { display:"flex", gap:13, alignItems:"center", justifyContent:"center",
    fontSize:17, lineHeight:1.4, fontWeight:600, color:"var(--navy-700)", textAlign:"center" },
  familiarTick: { flex:"none", width:30, height:30, borderRadius:"50%",
    background:"var(--color-primary-soft)", color:"var(--color-primary)",
    display:"flex", alignItems:"center", justifyContent:"center" },

  grid1: { gridTemplateColumns:"1fr" },
  cardBody: { fontSize:15, color:"var(--text-body)", lineHeight:1.6, margin:0 },

  stepGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18 },
  stepCard: { padding:"26px 22px", background:"#fff", borderRadius:"var(--radius-lg)", border:"1px solid var(--border-subtle)",
    textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start" },
  stepNum: { display:"flex", alignItems:"center", justifyContent:"center", width:38, height:38, borderRadius:"50%",
    background:"var(--color-primary)", color:"#fff", fontFamily:"var(--font-display)", fontWeight:800, fontSize:17, margin:"0 auto 14px" },
  stepTitle: { fontFamily:"var(--font-display)", fontSize:16.5, color:"var(--navy-700)", margin:"0 0 8px", fontWeight:700 },

  legend: { fontFamily:"var(--font-body)", fontWeight:600, fontSize:14, color:"var(--text-strong)", marginBottom:9 },
  compliance: { fontSize:13, lineHeight:1.6, color:"var(--text-muted)", margin:0, textAlign:"center" },
};

Object.assign(window, { MeshHomeLoanReviewScreen: HomeLoanReviewScreen });

/* Booking page reached right after the contact form is submitted. Reaching
   this URL counts as a completed lead even if the visitor doesn't go on to
   book a time: navigating here pushes a "spa_pageview" dataLayer event (see
   App.jsx) with page_path "/home-loan-review-booking", which GTM can
   match to fire the Meta Pixel and a URL-based conversion for this campaign. */
function HLRBookingScreen({ onNav }) {
  /* Meta "Lead" conversion, fired directly (window.MeshMetaEvent in forms.js) so it does not rely on a GTM trigger. */
  React.useEffect(() => { window.MeshMetaEvent && window.MeshMetaEvent("Lead", { content_name: "Home Loan Review" }); }, []);
  const fs = hlrS;
  return (
    <div>
      <div style={fs.logoBar}>
        <a href="/" onClick={(e)=>{e.preventDefault();onNav("home");}} style={fs.logoLink} aria-label="Mesh Finance home">
          <img src="../../assets/mesh-logo.png" alt="Mesh Finance" style={{height:34, display:"block"}}/>
        </a>
        <a href="mailto:hello@meshfinance.com.au" style={fs.logoBarEmail}>hello@meshfinance.com.au</a>
      </div>
      <section style={fs.hero}>
        <div style={fs.heroTop}>
          <h1 style={fs.h1}>Thanks! Now pick a time that suits you</h1>
          <p style={fs.heroSubhead}>Your details are with us. Book your free Home Loan Review below, online or in person, with no obligation.</p>
        </div>
        <div style={hlrBk.embedWrap}>
          <iframe src={HLR_BOOKING_EMBED} title="Book your Home Loan Review"
            style={hlrBk.embed} loading="lazy"/>
        </div>
      </section>
      <p style={hlrBk.compliance}>{HLR.compliance}</p>
    </div>
  );
}
Object.assign(window, { MeshHLRBookingScreen: HLRBookingScreen });

const hlrBk = {
  embedWrap: { maxWidth: 600, margin: "0 auto", padding: "6px 20px 44px", width: "100%" },
  embed: { width: "100%", height: 760, border: 0, borderRadius: 16, background: "#fff",
    boxShadow: "var(--shadow-md)", display: "block" },
  compliance: { maxWidth: 720, margin: "0 auto", padding: "0 28px 44px", fontSize: 11.5,
    lineHeight: 1.5, color: "var(--text-subtle)", textAlign: "center" },
};

/* Thank-you page shown after a Home Loan Review booking is confirmed.
   No conversion fires here: it already fired on the booking page. */
function HLRThankYouScreen({ onNav }) {
  React.useEffect(() => { window.MeshMetaEvent && window.MeshMetaEvent("Schedule", { content_name: "Home Loan Review" }); }, []);
  const { Button } = window.MeshFinanceDesignSystem_5c98d0;
  const { ArrowRight } = window.MeshIcons;
  return (
    <div style={hlrTy.wrap}>
      <a href="/" onClick={(e)=>{e.preventDefault();onNav("home");}} style={hlrTy.logoLink} aria-label="Mesh Finance home">
        <img src="../../assets/mesh-logo.png" alt="Mesh Finance" style={{height:36, display:"block"}}/>
      </a>
      <div style={hlrTy.card}>
        <div style={hlrTy.tick} aria-hidden="true">✓</div>
        <h1 style={hlrTy.h1}>You're booked in. Thank you!</h1>
        <p style={hlrTy.lead}>Your Home Loan Review is confirmed. Keep an eye on your inbox for a calendar invite with all the details, plus a reminder before we chat.</p>
        <p style={hlrTy.sub}>Looking forward to taking a proper look at your home loan.</p>
        <div style={hlrTy.sign}>Chanel Rebello, Mesh Finance</div>
        <Button size="lg" onClick={()=>onNav("home")} iconRight={<ArrowRight width={18} height={18}/>}>Explore Mesh Finance</Button>
      </div>
    </div>
  );
}
Object.assign(window, { MeshHLRThankYouScreen: HLRThankYouScreen });

const hlrTy = {
  wrap: { minHeight:"100vh", background:"var(--blue-50)", display:"flex", flexDirection:"column",
    alignItems:"center", padding:"28px 20px 60px" },
  logoLink: { display:"inline-flex", alignItems:"center", alignSelf:"flex-start", maxWidth:"var(--container-max)",
    width:"100%", margin:"0 auto 40px" },
  card: { background:"#fff", borderRadius:"var(--radius-lg)", boxShadow:"var(--shadow-md)", maxWidth:560,
    width:"100%", margin:"auto", padding:"44px 40px", textAlign:"center",
    display:"flex", flexDirection:"column", alignItems:"center", gap:0 },
  tick: { width:64, height:64, borderRadius:"50%", background:"var(--color-success)", color:"#fff", fontSize:32,
    display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 },
  h1: { fontSize:30, lineHeight:1.2, margin:"0 0 12px", color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:16.5, lineHeight:1.6, color:"var(--text-body)", margin:"0 0 12px" },
  sub: { fontSize:15.5, lineHeight:1.6, color:"var(--text-body)", margin:"0 0 6px" },
  sign: { fontFamily:"var(--font-display)", fontWeight:700, fontSize:15, color:"var(--navy-700)", margin:"0 0 24px" },
};

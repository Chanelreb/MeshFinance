/* First Home Buyer Plan — campaign landing page for Perth first home buyers,
   cloned from the Family Finance Check page. Standalone conversion page:
   hero + video, familiar, who it's for, process, FAQ, about Chanel, compliance.
   Three routes: landing, booking (fires the conversion) and thank-you.
   The video is a placeholder until Chanel supplies the campaign video. */

const FHBP = {
  hero: {
    eyebrow: "First Home Buyer Plan",
    title: "Buy your first home in Perth with a clear plan, not guesswork.",
    subhead: "A free, tailored First Home Buyer Plan for Perth buyers: your borrowing power, the deposit you really need, the government help you qualify for, and your next steps.",
    primary: "Book my First Home Buyer Plan",
  },
  familiar: {
    h: "Does this sound familiar?",
    cards: [
      { t: "Not sure how much deposit you actually need?" },
      { t: "Confused by the 5% scheme, the grant and stamp duty?" },
      { t: "Getting different answers from the bank, friends and the internet?" },
      { t: "Saving hard, but not sure when you'll be ready to buy?" },
    ],
  },
  forWhom: {
    h: "Who the First Home Buyer Plan is for",
    lead: "This is designed for Perth first home buyers who want a straight answer on where they stand. It may be helpful if:",
    list: [
      "You're saving for a deposit and want to know your real target",
      "You've heard about the 5% Deposit Scheme but aren't sure if you qualify",
      "You want to know if you're eligible for the First Home Owner Grant or stamp duty concessions",
      "You'd like to know your borrowing capacity before you start looking",
      "Your parents might be able to help with a family guarantee",
      "You've been told no, or to come back later, and want a plan to get there",
      "You want someone to explain it all without the jargon",
      "You're ready to buy and want pre-approval sorted",
    ],
    closing: "You do not need to have your full deposit saved or know all the rules before speaking with us. That is exactly what the plan is for.",
  },
  process: {
    h: "How it works",
    steps: [
      { t: "Tell us where you're at", b: "You share a snapshot of your savings, income, any debts and the kind of home you'd like to buy." },
      { t: "We map your options", b: "We work out your borrowing power, the deposit you need, and which schemes, grants and stamp duty concessions you can use." },
      { t: "You get a clear plan", b: "We show you what you could buy now, or exactly what to aim for and when, with the numbers explained clearly so you decide." },
      { t: "We take you through to the keys", b: "From pre-approval to your application and settlement, we manage it start to finish and keep you supported the whole way." },
    ],
  },
  about: {
    h: "Hi, I'm Chanel",
    paras: [
      "As a finance broker with over seventeen years' experience, I've helped clients through every stage of the journey, from buying their first home, to purchasing their first investment property, to refinancing and restructuring their loans as life changes.",
      "Born and raised in the Perth Hills, I still live locally with my own young family, and I remember how overwhelming buying a first home felt. That's exactly why I created the First Home Buyer Plan: to map out your deposit, your borrowing power and the government help you can use, without judgement, so you know exactly where you stand and what to do next.",
      "Whether we meet online or in person, you'll get clear, honest advice from someone who genuinely gets it.",
    ],
    name: "Chanel Rebello, BSc (Mathematical Sciences and Finance)",
    title: "Founder and Finance Broker at Mesh Finance",
    licence: "Credit Representative Number 506123 is authorised under Australian Credit Licence Number 384704.",
  },
  form: {
    h: "Book your First Home Buyer Plan",
    step1Label: "Where are you at right now?",
    describeOptions: [
      "Just starting to save for a deposit",
      "Saving, and want to know when I'll be ready",
      "Ready to buy and want pre-approval sorted",
      "I've been told no and want a plan to get there",
    ],
    button: "Book my First Home Buyer Plan",
  },
  faqs: [
    { q: "How much deposit do I need to buy my first home in Perth?", a: "It depends on the scheme you use and the price of the home. Eligible first home buyers can buy with as little as a 5% deposit through the Australian Government 5% Deposit Scheme, without paying Lenders Mortgage Insurance. Outside the scheme, lenders usually want more. Your plan works out the exact figure for the home you have in mind." },
    { q: "Do I qualify for the 5% Deposit Scheme?", a: "You generally need to be an eligible first home buyer, an Australian citizen or permanent resident, and buying a home to live in within the scheme's price cap, which is currently $850,000 for Perth. There is currently no income cap. We check your eligibility as part of your plan." },
    { q: "What is the First Home Owner Grant and can I get it?", a: "The WA First Home Owner Grant is $10,000 and is generally for buying or building a brand-new home, not an established one. In Perth the property value cap is $800,000. We confirm whether it applies to the home you are looking at." },
    { q: "Will I pay stamp duty?", a: "Eligible WA first home buyers pay no transfer duty on homes valued up to $600,000, with a concessional rate between $600,000 and $800,000 (thresholds applying from 7 May 2026). Above $800,000 the general rate applies. Your plan shows the duty, if any, for your target price." },
    { q: "Can my parents help without giving me cash?", a: "Often, yes. With a family guarantee, a parent can use some of the equity in their own property as additional security for your loan, which can reduce the deposit you need and help you avoid Lenders Mortgage Insurance. We explain how it works and what it means for everyone involved." },
    { q: "What does the First Home Buyer Plan cost?", a: "Nothing. The plan is free and there is no obligation. If you go on to take out a loan, the lender pays us a commission once it settles, and we disclose that upfront." },
  ],
  compliance: "Any information provided is general only and does not take into account your personal objectives, financial situation or needs. Loan approval is subject to lender assessment, eligibility criteria and credit approval. Government scheme and grant eligibility is determined by the relevant authority and your lender. Fees, charges and lending conditions may apply.",
};

/* PLACEHOLDER: swap for the First Home Buyer booking link once Chanel sends it. */
const FHBP_BOOKING_EMBED = "https://marketli.app/book/embed/finance-check-in";
const FHBP_CALENDLY_URL = "https://calendly.com/chanel-fqxz/intro_to_mesh?hide_event_type_details=1&hide_gdpr_banner=1&text_color=102a43&primary_color=3898e0";

function FirstHomeBuyerPlanScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Button, Card, Field, Input, Accordion } = DS;
  const { Check, ArrowRight } = window.MeshIcons;
  const { useState, useRef } = React;
  const isMobile = window.useIsMobile();
  const fs = fhbS;

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
    onNav("first-home-buyer-plan-booking");
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
            <img src="../../assets/mesh-logo-v2.png" alt="Mesh Finance" style={{height:34, display:"block"}}/>
          </a>
          <a href="mailto:hello@meshfinance.com.au" style={fs.logoBarEmail}>hello@meshfinance.com.au</a>
        </div>
        <div style={fs.heroTop}>
          <h1 style={fs.h1}>{FHBP.hero.title}</h1>
          <p style={fs.heroSubhead}>{FHBP.hero.subhead}</p>
        </div>
        <div style={fs.heroStack}>
          <div style={fs.videoCol}>
            {videoOk ? (
              <video style={fs.heroVideo} controls preload="metadata" playsInline onError={()=>setVideoOk(false)}>
                <source src="../../assets/first-home-buyer-video.mp4" type="video/mp4"/>
                Your browser doesn't support embedded video.
              </video>
            ) : (
              <div style={fs.videoInner} role="img" aria-label="First Home Buyer Plan video coming soon">
                <span style={fs.playBtn} aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--navy-700)"><path d="M8 5v14l11-7z"/></svg>
                </span>
                <span style={fs.videoCaption}>Watch: your First Home Buyer Plan in two minutes (video coming soon)</span>
              </div>
            )}
          </div>
          <div style={fs.formCol}>
            <Card elevation="shadow-lg" padded={false} style={fs.formCard}>
              <form ref={formElRef} onSubmit={(e)=>e.preventDefault()} style={{display:"grid", gridTemplateColumns:"minmax(0,1fr)", gap:14}}>
                <input type="hidden" name="_subject" value="New First Home Buyer Plan booking | Mesh Finance"/>
                <input type="hidden" name="campaign" value="First Home Buyer Plan"/>
                <input type="hidden" name="describes" value={describes}/>
                <div>
                  <h2 style={fs.formTitle}>{FHBP.form.h}</h2>
                </div>
                <div style={fs.progressRow}>
                  <div style={fs.progressTrack}><div style={{...fs.progressFill, width: step===1 ? "33%" : step===2 ? "66%" : "100%"}}/></div>
                  <span style={fs.stepLabel}>Step {step} of 3</span>
                </div>

                {/* STEP 1 — where are you at */}
                <div style={{display: step===1 ? "grid" : "none", gridTemplateColumns:"minmax(0,1fr)", gap:12}}>
                  <div style={fs.legend}>{FHBP.form.step1Label}</div>
                  {FHBP.form.describeOptions.map((o,i)=>{
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
                    <FHBPCalendlyEmbed prefill={prefill} onScheduled={()=>onNav("fhb-thank-you")}/>
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
        <div style={fs.reviewsInner}><FHBPGoogleReviews/></div>
      </section>

      {/* FAMILIAR */}
      <section style={fs.bodyTint}>
        <div style={fs.wide}>
          <h2 style={{...fs.h2, textAlign:"center", marginBottom:28}}>{FHBP.familiar.h}</h2>
          <ul style={{...fs.familiarPoints, ...(isMobile ? fs.familiarPointsMobile : {})}}>
            {FHBP.familiar.cards.map((c,i)=>(
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
          <h2 style={fs.h2}>{FHBP.forWhom.h}</h2>
          <p style={fs.p}>{FHBP.forWhom.lead}</p>
          <CheckList items={FHBP.forWhom.list}/>
          <p style={{...fs.p, fontWeight:600, color:"var(--navy-700)"}}>{FHBP.forWhom.closing}</p>
        </div>
      </section>

      {/* PROCESS */}
      <section style={fs.bodyTint}>
        <div style={fs.wide}>
          <h2 style={{...fs.h2, textAlign:"center", marginBottom:28}}>{FHBP.process.h}</h2>
          <div style={{...fs.stepGrid, ...(isMobile ? fs.grid1 : {})}}>
            {FHBP.process.steps.map((st,i)=>(
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
          <Accordion defaultOpen={[0]} items={FHBP.faqs.map(f=>({question:f.q, answer:f.a}))}/>
        </div>
      </section>

      {/* ABOUT CHANEL */}
      <section style={fs.bodyTint}>
        <div style={{...fs.aboutGrid, ...(isMobile ? fs.aboutGridMobile : {})}}>
          <div style={fs.aboutInner}>
            <div style={fs.aboutPhoto} role="img" aria-label="Chanel Rebello"/>
            <h2 style={fs.h2}>{FHBP.about.h}</h2>
            {FHBP.about.paras.map((p,i)=><p key={i} style={fs.p}>{p}</p>)}
            <p style={fs.aboutName}>{FHBP.about.name}</p>
            <p style={fs.aboutTitle}>{FHBP.about.title}</p>
            <p style={fs.aboutLicence}>{FHBP.about.licence}</p>
            <div style={fs.aboutLogos}>
              <span style={fs.logoChip}><FHBPAssocLogo src="../../assets/afca-logo-hi-res.png" label="AFCA"/></span>
              <span style={fs.logoChip}><FHBPAssocLogo src="../../assets/FBAA-ACCREDITED-STACKED-LOGO-.jpg" label="FBAA"/></span>
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
          <p style={fs.compliance}>{FHBP.compliance}</p>
        </div>
      </section>
    </div>
  );
}

/* Live Calendly inline booking, prefilled with the visitor's name/email. */
function FHBPCalendlyEmbed({ prefill, onScheduled }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    const init = () => {
      if (window.Calendly && el && !el.hasChildNodes()) {
        window.Calendly.initInlineWidget({ url: FHBP_CALENDLY_URL, parentElement: el, prefill: prefill || {} });
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
  return <div ref={ref} style={{ minWidth: 260, height: 700 }} role="region" aria-label="Book a time with Mesh Finance"/>;
}

/* Industry-body logo with a labelled fallback. */
function FHBPAssocLogo({ src, label }) {
  const [failed, setFailed] = React.useState(false);
  if (failed) return <span style={fhbS.logoBadge}>{label}</span>;
  return <img src={src} alt={label} style={fhbS.logoImg} onError={()=>setFailed(true)}/>;
}

/* Google reviews (Trustindex) widget, same loader as the homepage. */
function FHBPGoogleReviews() {
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
  return <div ref={ref} role="region" aria-label="Google reviews for Mesh Finance"/>;
}

/* Styles: a copy of the Family Finance Check landing styles so the two
   campaign pages look identical. Kept separate so each page can diverge. */
const fhbS = {
  logoBar: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"22px 28px 0",
    display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 },
  logoLink: { display:"inline-flex", alignItems:"center" },
  logoBarEmail: { fontFamily:"var(--font-display)", fontWeight:700, fontSize:14.5, color:"var(--navy-700)",
    textDecoration:"none", wordBreak:"break-all" },

  hero: { background:"linear-gradient(rgba(234,244,252,0.72), rgba(234,244,252,0.82)), url(../../assets/officebackground-v2.webp) 62% 38%/130% no-repeat" },
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

Object.assign(window, { MeshFirstHomeBuyerPlanScreen: FirstHomeBuyerPlanScreen });

/* Booking page reached right after the contact form is submitted. Reaching
   this URL counts as a completed lead even if the visitor doesn't go on to
   book a time: navigating here pushes a "spa_pageview" dataLayer event (see
   App.jsx) with page_path "/first-home-buyer-plan-booking", which GTM can
   match to fire the Meta Pixel and a URL-based conversion for this campaign. */
function FHBPBookingScreen({ onNav }) {
  /* Meta "Lead" conversion, fired directly (window.MeshMetaEvent in forms.js) so it does not rely on a GTM trigger. */
  React.useEffect(() => { window.MeshMetaEvent && window.MeshMetaEvent("Lead", { content_name: "First Home Buyer Plan" }); }, []);
  const fs = fhbS;
  return (
    <div>
      <section style={fs.hero}>
        <div style={fs.logoBar}>
          <a href="/" onClick={(e)=>{e.preventDefault();onNav("home");}} style={fs.logoLink} aria-label="Mesh Finance home">
            <img src="../../assets/mesh-logo-v2.png" alt="Mesh Finance" style={{height:34, display:"block"}}/>
          </a>
          <a href="mailto:hello@meshfinance.com.au" style={fs.logoBarEmail}>hello@meshfinance.com.au</a>
        </div>
          <div style={fs.heroTop}>
          <h1 style={fs.h1}>Thanks! Now pick a time that suits you</h1>
          <p style={fs.heroSubhead}>Your details are with us. Book your free First Home Buyer Plan below, online or in person, with no obligation.</p>
        </div>
        <div style={fhbBk.embedWrap}>
          <iframe src={FHBP_BOOKING_EMBED} title="Book your First Home Buyer Plan"
            style={fhbBk.embed} loading="lazy"/>
        </div>
      </section>
      <p style={fhbBk.compliance}>{FHBP.compliance}</p>
    </div>
  );
}
Object.assign(window, { MeshFHBPBookingScreen: FHBPBookingScreen });

const fhbBk = {
  embedWrap: { maxWidth: 600, margin: "0 auto", padding: "6px 20px 44px", width: "100%" },
  embed: { width: "100%", height: 760, border: 0, borderRadius: 16, background: "#fff",
    boxShadow: "var(--shadow-md)", display: "block" },
  compliance: { maxWidth: 720, margin: "0 auto", padding: "0 28px 44px", fontSize: 11.5,
    lineHeight: 1.5, color: "var(--text-subtle)", textAlign: "center" },
};

/* Thank-you page shown after a First Home Buyer Plan booking is confirmed.
   No conversion fires here: it already fired on the booking page. */
function FHBPThankYouScreen({ onNav }) {
  React.useEffect(() => { window.MeshMetaEvent && window.MeshMetaEvent("Schedule", { content_name: "First Home Buyer Plan" }); }, []);
  /* If Marketli redirects here inside its booking iframe, take over the whole window. */
  React.useEffect(() => { if (window.top !== window.self) { try { window.top.location.href = window.location.href; } catch (e) {} } }, []);
  const { Button } = window.MeshFinanceDesignSystem_5c98d0;
  const { ArrowRight } = window.MeshIcons;
  return (
    <div style={fhbTy.wrap}>
      <a href="/" onClick={(e)=>{e.preventDefault();onNav("home");}} style={fhbTy.logoLink} aria-label="Mesh Finance home">
        <img src="../../assets/mesh-logo-v2.png" alt="Mesh Finance" style={{height:36, display:"block"}}/>
      </a>
      <div style={fhbTy.card}>
        <div style={fhbTy.tick} aria-hidden="true">✓</div>
        <h1 style={fhbTy.h1}>You're booked in. Thank you!</h1>
        <p style={fhbTy.lead}>Your First Home Buyer Plan is confirmed. Keep an eye on your inbox for a calendar invite with all the details, plus a reminder before we chat.</p>
        <p style={fhbTy.sub}>Looking forward to helping you get the keys to your first home.</p>
        <div style={fhbTy.sign}>Chanel Rebello, Mesh Finance</div>
        <Button size="lg" onClick={()=>onNav("home")} iconRight={<ArrowRight width={18} height={18}/>}>Explore Mesh Finance</Button>
      </div>
    </div>
  );
}
Object.assign(window, { MeshFHBPThankYouScreen: FHBPThankYouScreen });

const fhbTy = {
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

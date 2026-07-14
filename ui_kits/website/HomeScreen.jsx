/* Home, hero + lead form, service grid, trust stats, testimonial, CTA band. */
function HomeScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Button, Card, ServiceCard, StatCard, Field, Input, Select, Badge } = DS;
  const { Home, Building, Key, Coins, Car, Refi, Caravan, Shield, Star, Quote, ArrowRight } = window.MeshIcons;
  const { useState } = React;
  const isMobile = window.useIsMobile();
  const [heroStatus, setHeroStatus] = useState("idle"); // idle | sending | sent | error

  const submitHero = async (e) => {
    e.preventDefault();
    setHeroStatus("sending");
    try {
      const ok = await window.MeshSubmitForm(e.target);
      setHeroStatus(ok ? "sent" : "error");
    } catch {
      setHeroStatus("error");
    }
  };

  const services = [
    { icon:<Home/>, title:"Home Loans", desc:"Competitive rates and personalised support for your purchase.", id:"home-loans" },
    { icon:<Building/>, title:"Investment Loans", desc:"Grow your portfolio with the right structure and lender.", id:"investment-home-loans" },
    { icon:<Key/>, title:"First Home Buyers", desc:"Grants, schemes and stamp-duty concessions, explained simply.", id:"first-home-buyers" },
    { icon:<Shield/>, title:"Bad Credit Loans", desc:"A compassionate, non-judgmental approach when life got complicated.", id:"bad-credit-home-loans" },
    { icon:<Coins/>, title:"Debt Consolidation", desc:"Merge multiple debts into one manageable repayment.", id:"debt-consolidation-loans" },
    { icon:<Car/>, title:"Car & Caravan Loans", desc:"Quick, easy and affordable finance to get you moving.", id:"car-loans" },
  ];

  return (
    <div>
      {/* HERO */}
      <section style={h.hero}>
        <div style={h.heroOverlay}/>
        <div style={{...h.heroInner, ...(isMobile ? h.heroInnerMobile : {})}}>
          <div style={h.heroCopy}>
            <Badge color="blue" dot>Perth, Western Australia</Badge>
            <h1 style={{...h.h1, ...(isMobile ? h.h1Mobile : {})}}>Your finance partner through every stage of life.</h1>
            <p style={h.lead}>From buying your first home to refinancing, investing or simply getting a better deal, we help you make confident decisions with clear advice and genuine support.</p>
            <div style={{...h.heroBtns, ...(isMobile ? h.heroBtnsMobile : {})}}>
              <Button size="lg" onClick={()=>onNav("financial-toolkit")} iconRight={<ArrowRight width={18} height={18}/>}>Explore the toolkit</Button>
              <Button size="lg" variant="secondary" onClick={()=>onNav("contact")}>Book a chat</Button>
            </div>
            <div style={h.trustRow}>
              <span style={h.stars}>{[0,1,2,3,4].map(i=><Star key={i} width={18} height={18} style={{color:"#F0A92B"}}/>)}</span>
              <span style={h.trustTxt}><strong>5.0</strong> on Google · loved by Perth families</span>
            </div>
          </div>
          <Card elevation="shadow-lg" className="" style={h.formCard}>
            {heroStatus === "sent" ? (
              <div style={h.formThanks}>
                <div style={h.formTick}>✓</div>
                <h3 style={h.formTitle}>Thanks, that's sent!</h3>
                <p style={h.formSub}>We'll get back to you fast.</p>
              </div>
            ) : (
              <React.Fragment>
                <h3 style={h.formTitle}>Reach out for a chat 👋</h3>
                <p style={h.formSub}>No obligation. We'll get back to you fast.</p>
                <form onSubmit={submitHero} style={{display:"grid", gap:13, marginTop:4}}>
                  <input type="hidden" name="_subject" value="New enquiry — Mesh Finance homepage"/>
                  <Field label="Name" required><Input name="name" required placeholder="Your name"/></Field>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                    <Field label="Email" required><Input name="email" type="email" required placeholder="you@email.com"/></Field>
                    <Field label="Phone" required><Input name="phone" type="tel" required placeholder="04xx xxx xxx"/></Field>
                  </div>
                  <Field label="Finance Required">
                    <Select name="financeRequired" placeholder="Select Loan Type" defaultValue="">
                      <option>Home Loan</option><option>Investment Loan</option><option>First Home Buyer</option>
                      <option>Debt Consolidation</option><option>Car / Caravan Loan</option><option>Personal Loan</option>
                    </Select>
                  </Field>
                  {heroStatus === "error" && <p style={h.formError}>Something went wrong, please try again or call us.</p>}
                  <Button block size="lg" type="submit" disabled={heroStatus==="sending"}>{heroStatus==="sending" ? "Sending…" : "Send 📩"}</Button>
                </form>
              </React.Fragment>
            )}
          </Card>
        </div>
      </section>

      {/* GOOGLE REVIEWS BANNER */}
      <section style={h.reviewsBand}>
        <div style={h.reviewsInner}>
          <GoogleReviews/>
        </div>
      </section>

      {/* STATS */}
      <section style={h.statsBand}>
        <div style={{...h.statsInner, ...(isMobile ? h.statsInnerMobile : {})}}>
          <StatCard tone="navy" value="40+" label="Lenders compared"/>
          <StatCard tone="navy" value="5.0★" label="Google rating"/>
          <StatCard tone="navy" value="9–5" label="Mon–Fri, & after hours"/>
        </div>
      </section>

      {/* SERVICES */}
      <section style={h.section}>
        <div style={h.sectionInner}>
          <p className="eyebrow">The Mesh Finance approach</p>
          <h2 style={h.h2}>One team, a whole panel of lenders.</h2>
          <p style={h.sectionLead}>We compare a wide panel of lenders on your behalf, not a single bank, to find competitive, tailored options that fit your life.</p>
          <div style={{...h.grid, ...(isMobile ? h.gridMobile : {})}}>
            {services.map((s,i)=>(
              <ServiceCard key={i} icon={s.icon} title={s.title} description={s.desc} href="#"
                onClick={(e)=>{e.preventDefault();onNav(s.id);}} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={h.ctaBand}>
        <div style={h.ctaInner}>
          <h2 style={h.ctaH}>Let's make your financial dreams a reality.</h2>
          <p style={h.ctaP}>Book a no-obligation chat and we'll do the heavy lifting.</p>
          <Button size="lg" variant="secondary" onClick={()=>onNav("contact")}>Book now</Button>
        </div>
      </section>
    </div>
  );
}

/* Google reviews banner, loads the Trustindex widget once and renders it into this container. */
function GoogleReviews() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = document.createElement("script");
    s.src = "https://cdn.trustindex.io/loader.js?1f3f74d765942510b78680b7215";
    s.async = true;
    s.defer = true;
    el.appendChild(s);
  }, []);
  return <div ref={ref} aria-label="Google reviews for Mesh Finance"/>;
}

const h = {
  hero: { position:"relative", background:"url(../../assets/hero-home.jpg) center/cover no-repeat" },
  reviewsBand: { background:"#fff", borderBottom:"1px solid var(--border-subtle)" },
  reviewsInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"24px 28px" },
  heroOverlay: { position:"absolute", inset:0,
    background:"linear-gradient(90deg, var(--surface-page) 0%, var(--surface-page) 34%, rgba(255,255,255,.86) 55%, rgba(255,255,255,.55) 75%, rgba(255,255,255,.2) 100%)" },
  heroInner: { position:"relative", maxWidth:"var(--container-max)", margin:"0 auto", padding:"60px 28px 64px",
    display:"grid", gridTemplateColumns:"1.05fr .95fr", gap:48, alignItems:"center" },
  heroInnerMobile: { gridTemplateColumns:"1fr", padding:"36px 20px 40px", gap:32 },
  heroCopy: { display:"flex", flexDirection:"column", gap:18, alignItems:"flex-start" },
  h1: { fontSize:48, lineHeight:1.05, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em" },
  h1Mobile: { fontSize:32, lineHeight:1.15 },
  lead: { fontSize:18, lineHeight:1.55, color:"var(--text-body)", margin:0, maxWidth:480 },
  heroBtns: { display:"flex", gap:12, marginTop:4 },
  heroBtnsMobile: { flexDirection:"column", width:"100%" },
  trustRow: { display:"flex", alignItems:"center", gap:10, marginTop:6 },
  stars: { display:"flex", gap:1 },
  trustTxt: { fontSize:14, color:"var(--text-muted)" },
  formCard: { padding:0 },
  formTitle: { fontFamily:"var(--font-display)", fontSize:22, margin:"0", color:"var(--navy-700)", fontWeight:700 },
  formSub: { fontSize:14, color:"var(--text-muted)", margin:"4px 0 0" },
  formThanks: { textAlign:"center", padding:"12px 4px" },
  formTick: { width:48, height:48, borderRadius:"50%", background:"var(--color-success)", color:"#fff",
    fontSize:24, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" },
  formError: { fontSize:13.5, color:"var(--color-danger)", margin:0 },

  statsBand: { background:"var(--navy-700)" },
  statsInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"10px 28px",
    display:"flex", justifyContent:"center", gap:"clamp(32px, 6vw, 96px)" },
  statsInnerMobile: { flexWrap:"wrap", gap:24 },

  section: { padding:"72px 0" },
  sectionInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },
  h2: { fontSize:34, margin:"10px 0 12px", color:"var(--navy-700)" },
  sectionLead: { fontSize:17, color:"var(--text-muted)", maxWidth:600, margin:"0 0 36px", lineHeight:1.55 },
  grid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 },
  gridMobile: { gridTemplateColumns:"1fr" },

  quoteCard: { display:"flex", flexDirection:"column", gap:16, padding:"36px 40px", background:"#fff" },
  quote: { fontFamily:"var(--font-display)", fontSize:22, lineHeight:1.4, color:"var(--navy-700)",
    fontWeight:600, margin:0, maxWidth:760, letterSpacing:"-.01em" },  quoteBy: { display:"flex", alignItems:"center", gap:12 },
  avatar: { width:46, height:46, borderRadius:"50%", background:"var(--color-primary)", color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:700 },
  byName: { fontWeight:700, color:"var(--navy-700)" },
  byMeta: { fontSize:13, color:"var(--text-muted)" },

  ctaBand: { background:"linear-gradient(120deg, var(--blue-600), var(--blue-500))" },
  ctaInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"60px 28px", textAlign:"center" },
  ctaH: { fontSize:34, color:"#fff", margin:"0 0 8px" },
  ctaP: { fontSize:17, color:"rgba(255,255,255,.9)", margin:"0 0 24px" },
};

Object.assign(window, { MeshHomeScreen: HomeScreen });

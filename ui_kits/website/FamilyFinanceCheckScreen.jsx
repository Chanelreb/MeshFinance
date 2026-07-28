/* Family Finance Check — refinance/debt-consolidation campaign landing page
   targeting young families with multiple debts. Standalone conversion page:
   hero + video, problem, offer, options, process, help, trust, CTA, form, FAQ.
   The video area is a placeholder until Chanel supplies the campaign video. */

const FFC = {
  hero: {
    eyebrow: "Family Finance Check",
    title: "Feel confident and in control of your family budget with one easy-to-manage loan repayment.",
    subhead: "Tailored online or in-person home loan health check and debt consolidation plan.",
    lead: "When you're managing a household, the money side of life can get messy quickly — home loan, car loan, credit card, Afterpay, school costs, childcare, groceries, fuel and everything else that pops up right when you thought you were getting ahead.",
    primary: "Book my Family Finance Check",
    secondary: "Check my options",
  },
  intro: {
    h: "A calmer way to manage the family budget",
    paras: [
      "Managing multiple repayments can feel overwhelming, especially when they all come out on different days. One loan payment here. A credit card there. Afterpay instalments in the background. A car loan. A mortgage. Then the normal family expenses on top.",
      "It can leave you feeling like your income disappears before you've had a chance to properly plan.",
      "The Family Finance Check is designed to help busy families step back, look at the full picture and see whether there's a smarter way to structure their debts. At Mesh Finance, we review your current loans and repayments, compare your options and work out whether debt consolidation or refinancing could help reduce monthly pressure.",
    ],
  },
  familiar: {
    h: "Does this sound familiar?",
    cards: [
      { t: "Your repayments are spread everywhere", b: "You have a home loan, car loan, credit card, buy now pay later balances or personal loans, and it's getting harder to keep track of everything." },
      { t: "Your monthly cashflow feels tight", b: "Even if your income is good, the timing and total amount of repayments can make the household budget feel stretched." },
      { t: "You want to simplify things", b: "You're not looking for a lecture. You just want someone to help review the numbers and explain what can be done." },
      { t: "You want a clearer plan", b: "You want to know whether consolidating debt, refinancing or restructuring your loans could help you move forward with less stress." },
    ],
  },
  what: {
    h: "What is the Family Finance Check?",
    paras: [
      "The Family Finance Check is a review of your current household debt position. We look at your existing repayments, loan balances, interest rates, debts and overall cashflow to see whether there may be a better structure available.",
    ],
    reviewLabel: "This may include reviewing:",
    review: [
      "Your current home loan",
      "Credit cards",
      "Personal loans",
      "Car loans",
      "Afterpay or other buy now pay later facilities",
      "Existing repayment amounts",
      "Interest rates and fees",
      "Available equity in your home, if applicable",
      "Options to consolidate debt",
      "Options to refinance",
      "Whether your monthly cashflow could improve",
    ],
    closing: "The aim is not to just move debt around. The aim is to help you create a clearer, more manageable structure.",
  },
  benefits: {
    h: "How debt consolidation may help families",
    lead: "Debt consolidation means combining multiple debts into one loan or repayment structure. For families, this may help simplify the household budget and reduce the stress of managing several debts at once.",
    cards: [
      { t: "One simpler repayment", b: "Instead of juggling multiple repayments across different lenders, you may be able to combine eligible debts into one repayment." },
      { t: "Less stress around due dates", b: "A simpler repayment structure can make it easier to keep track of what is due and when." },
      { t: "More monthly breathing room", b: "Depending on the structure, consolidating debt may reduce your monthly repayment commitments and free up cashflow." },
      { t: "A clearer plan to move forward", b: "When your debts are organised properly, it can be easier to focus on paying them down and getting ahead." },
    ],
  },
  options: {
    h: "Your debt consolidation options",
    lead: "There are two main ways we may be able to help, depending on your situation.",
    cards: [
      {
        tag: "Option 1",
        t: "Personal loan debt consolidation",
        body: "A personal loan can be used to consolidate eligible debts such as credit cards, buy now pay later balances, personal loans or smaller debts. This may suit families who do not own a home, or those who want to keep their debt separate from their mortgage.",
        suitLabel: "This may suit you if:",
        suit: [
          "You have multiple unsecured debts",
          "You want one set repayment",
          "You want a clear loan term",
          "You do not want to use your home as security",
          "You want a structured plan to pay the debt down",
        ],
        consider: "A personal loan may have a higher interest rate than a home loan, but it usually has a shorter repayment term. This can help keep the debt contained and avoid spreading it over too many years.",
      },
      {
        tag: "Option 2",
        t: "Home loan debt consolidation",
        body: "If you own a home and have available equity, you may be able to consolidate other debts into your home loan. This can sometimes reduce monthly repayments because home loan interest rates are generally lower than credit card or personal loan rates.",
        suitLabel: "This may suit you if:",
        suit: [
          "You own a home",
          "You have enough available equity",
          "Your repayments are putting pressure on cashflow",
          "You have credit cards, personal loans, car loans or buy now pay later debt",
          "You want to simplify your repayments through your home loan",
        ],
        consider: "Using your home loan for debt consolidation needs to be structured carefully. While it may reduce your monthly repayments, adding short-term debt to a longer home loan term may mean you pay more interest over time if you do not make extra repayments. That is why we explain the numbers clearly before you make a decision.",
      },
    ],
  },
  forWhom: {
    h: "Who the Family Finance Check is for",
    lead: "This campaign is designed for families who feel like their household finances have become harder to manage. It may be helpful if:",
    list: [
      "You have young kids and family costs are increasing",
      "You have credit cards, Afterpay, personal loans or a car loan",
      "Your home loan repayments feel like a lot alongside other debts",
      "You want to reduce monthly repayment pressure",
      "You want to understand whether refinancing could help",
      "You want a clear plan without feeling judged",
      "You are ready to tidy things up and get back in control",
    ],
    closing: "You do not need to have everything perfectly organised before speaking with us. That is what we are here for.",
  },
  process: {
    h: "How it works",
    steps: [
      { t: "Tell us what's going on", b: "You share a snapshot of your current debts, repayments and what is feeling hard to manage." },
      { t: "We review the full picture", b: "We look at your home loan, other debts, repayment amounts, rates and possible consolidation options." },
      { t: "We compare your options", b: "We check whether a personal loan, home loan refinance, equity release or another structure may suit your situation." },
      { t: "You decide what feels right", b: "We explain the numbers clearly so you can decide whether to proceed." },
    ],
  },
  help: {
    h: "What we may be able to help with",
    cards: [
      { t: "Credit card debt", b: "Credit cards can be hard to reduce if you are mostly covering interest and minimum repayments. Consolidating may help create a clearer repayment plan." },
      { t: "Afterpay and buy now pay later", b: "Buy now pay later can feel manageable at first, but multiple small repayments can quickly impact cashflow. We can help review how these fit into your overall position." },
      { t: "Car loans", b: "If your car loan repayment is adding pressure to the family budget, we can review whether it makes sense to consolidate, refinance or leave it separate." },
      { t: "Personal loans", b: "Personal loans may be able to be combined with other debts, depending on your situation and lender approval." },
      { t: "Home loans", b: "If your home loan is no longer competitive or your structure no longer suits your household, we can compare refinance options and check whether debt consolidation is suitable." },
    ],
  },
  why: {
    h: "Why families choose Mesh Finance",
    cards: [
      { t: "We keep it simple", b: "We explain the options clearly without confusing bank jargon." },
      { t: "We are non-judgmental", b: "Life gets expensive. Families go through different seasons. We are here to help you move forward, not make you feel bad." },
      { t: "We compare lenders for you", b: "We review options across a range of lenders and help you understand which structure may suit your situation." },
      { t: "We look at the whole picture", b: "We do not just focus on the rate. We look at repayments, fees, loan structure, cashflow and your longer-term goals." },
    ],
  },
  finalCta: {
    h: "Ready to get your household finances back under control?",
    text: "The first step is simply having a look. Book your Family Finance Check and let's see whether consolidating debt or refinancing could help simplify your repayments and create more breathing room in your monthly budget.",
    primary: "Book my Family Finance Check",
    secondary: "Start my debt check",
  },
  form: {
    h: "Book your Family Finance Check",
    step1Label: "Which best describes you?",
    describeOptions: [
      "Making multiple debt repayments a month",
      "Finding it hard to put money away at the end of the month",
      "Struggling to make repayments on my loans",
    ],
    button: "Book my Family Finance Check",
  },
  faqs: [
    { q: "Can I consolidate Afterpay or buy now pay later debt?", a: "In some cases, yes. It depends on the lender, your overall position and the type of debt. We can review this as part of your Family Finance Check." },
    { q: "Can I consolidate credit cards?", a: "Yes, eligible credit card debts may be able to be consolidated into a personal loan or home loan structure, depending on your situation and lender approval." },
    { q: "Can I include a car loan?", a: "Sometimes. We can review whether it makes sense to consolidate the car loan, refinance it separately or leave it as is." },
    { q: "Do I need to own a home?", a: "No. If you do not own a home, a personal loan may still be an option. If you do own a home, we can also review whether home loan debt consolidation may be suitable." },
    { q: "Will this reduce my repayments?", a: "It may reduce your monthly repayments, depending on your loan balances, interest rates, loan term and structure. We will show you the numbers before you decide." },
    { q: "Is debt consolidation always the best option?", a: "No. Sometimes it makes sense, and sometimes it does not. Our role is to help you compare the options clearly so you can make an informed decision." },
  ],
  compliance: "Any information provided is general only and does not take into account your personal objectives, financial situation or needs. Loan approval is subject to lender assessment, eligibility criteria and credit approval. Fees, charges and lending conditions may apply.",
};

function FamilyFinanceCheckScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Button, Card, Field, Input, Select, Radio, Accordion } = DS;
  const { Check, ArrowRight, Coins, Clock, Refi, Shield, Users, Car, Home } = window.MeshIcons;
  const { useState, useRef } = React;
  const isMobile = window.useIsMobile();

  const formRef = useRef(null);
  const optionsRef = useRef(null);
  const formElRef = useRef(null);
  const scrollTo = (ref) => {
    if (!ref.current) return;
    const y = ref.current.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  /* Three-step booking wizard: 1) which best describes you, 2) contact
     details, 3) live Calendly booking. The lead is sent to Formspree at the
     2 -> 3 transition, then the name/email prefill the Calendly widget. */
  const [step, setStep] = useState(1);
  const [describes, setDescribes] = useState("");
  const [sending, setSending] = useState(false);
  const [prefill, setPrefill] = useState({});

  const goToDetails = () => { if (describes) setStep(2); };
  const goToBooking = async () => {
    const form = formElRef.current;
    if (!form) return;
    const ok = ["firstName", "lastName", "email", "phone"].every((n) => {
      const el = form.elements[n];
      return el ? el.reportValidity() : true;
    });
    if (!ok) return;
    const fn = (form.elements["firstName"].value || "").trim();
    const ln = (form.elements["lastName"].value || "").trim();
    const email = (form.elements["email"].value || "").trim();
    setPrefill({ name: (fn + " " + ln).trim(), email });
    setSending(true);
    try { await window.MeshSubmitForm(form); } catch {}
    setSending(false);
    setStep(3);
  };

  const familiarIcons = [Coins, Clock, Refi, Check];
  const benefitIcons = [Coins, Clock, Shield, Check];
  const helpIcons = [Coins, Clock, Car, Coins, Home];
  const whyIcons = [Check, Users, Refi, Shield];

  const CheckList = ({ items }) => (
    <ul style={s.checkList}>
      {items.map((it, i) => (
        <li key={i} style={s.checkItem}>
          <span style={s.checkIcon}><Check width={13} height={13}/></span>{it}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      {/* HERO (blue band runs to the very top; logo sits inside it) */}
      <section style={s.hero} ref={formRef}>
        <div style={s.logoBar}>
          <a href="/" onClick={(e)=>{e.preventDefault();onNav("home");}} style={s.logoLink} aria-label="Mesh Finance home">
            <img src="../../assets/mesh-logo.png" alt="Mesh Finance" style={{height:34, display:"block"}}/>
          </a>
        </div>
        <div style={{...s.heroInner, ...(isMobile ? s.heroInnerMobile : {})}}>
          <div style={s.heroCopy}>
            <h1 style={s.h1}>{FFC.hero.title}</h1>
            <p style={s.heroSubhead}>{FFC.hero.subhead}</p>
            <p style={s.heroLead}>{FFC.hero.lead}</p>
            <ul style={s.heroPoints}>
              {["No obligation, no judgement","We compare a range of lenders for you","See if you could simplify your repayments"].map((t,i)=>(
                <li key={i} style={s.heroPoint}><span style={s.heroTick}><Check width={13} height={13}/></span>{t}</li>
              ))}
            </ul>
          </div>

          <div style={s.formCol}>
            <Card elevation="shadow-lg" padded={false} style={s.formCard}>
              <form ref={formElRef} onSubmit={(e)=>e.preventDefault()} style={{display:"grid", gridTemplateColumns:"minmax(0,1fr)", gap:14}}>
                <input type="hidden" name="_subject" value="New Family Finance Check booking — Mesh Finance"/>
                <input type="hidden" name="campaign" value="Family Finance Check"/>
                <input type="hidden" name="describes" value={describes}/>
                <div>
                  <h2 style={s.formTitle}>{FFC.form.h}</h2>
                </div>
                <div style={s.progressRow}>
                  <div style={s.progressTrack}><div style={{...s.progressFill, width: step===1 ? "33%" : step===2 ? "66%" : "100%"}}/></div>
                  <span style={s.stepLabel}>Step {step} of 3</span>
                </div>

                {/* STEP 1 — which best describes you */}
                <div style={{display: step===1 ? "grid" : "none", gridTemplateColumns:"minmax(0,1fr)", gap:12}}>
                  <div style={s.legend}>{FFC.form.step1Label}</div>
                  {FFC.form.describeOptions.map((o,i)=>{
                    const active = describes === o;
                    return (
                      <button type="button" key={i} onClick={()=>setDescribes(o)}
                        style={{...s.choice, ...(active ? s.choiceActive : {})}}>
                        <span style={{...s.choiceDot, ...(active ? s.choiceDotActive : {})}}>{active && <Check width={12} height={12}/>}</span>
                        <span>{o}</span>
                      </button>
                    );
                  })}
                  <Button block size="lg" type="button" onClick={goToDetails} disabled={!describes} iconRight={<ArrowRight width={18} height={18}/>}>Next</Button>
                </div>

                {/* STEP 2 — contact details */}
                <div style={{display: step===2 ? "grid" : "none", gridTemplateColumns:"minmax(0,1fr)", gap:14}}>
                  <div style={{display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)", gap:12}}>
                    <Field label="First name" required><Input name="firstName" required placeholder="First name"/></Field>
                    <Field label="Last name" required><Input name="lastName" required placeholder="Last name"/></Field>
                  </div>
                  <Field label="Email" required><Input name="email" type="email" required placeholder="you@email.com"/></Field>
                  <Field label="Phone number" required><Input name="phone" type="tel" required placeholder="04xx xxx xxx"/></Field>
                  <Button block size="lg" type="button" onClick={goToBooking} disabled={sending} iconRight={sending ? null : <ArrowRight width={18} height={18}/>}>{sending ? "One sec…" : "Continue to booking"}</Button>
                  <button type="button" onClick={()=>setStep(1)} style={s.backLink}>← Back</button>
                </div>

                {/* STEP 3 — live Calendly booking */}
                {step===3 && (
                  <div style={{display:"grid", gap:10}}>
                    <div>
                      <h3 style={s.bookH}>Pick a time that suits you 📅</h3>
                      <p style={s.formSub}>Choose a slot and you're booked in — free and no obligation.</p>
                    </div>
                    <CalendlyEmbed prefill={prefill}/>
                    <button type="button" onClick={()=>setStep(2)} style={s.backLink}>← Back</button>
                  </div>
                )}
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS */}
      <section style={s.reviewsBand}>
        <div style={s.reviewsInner}><GoogleReviews/></div>
      </section>

      {/* A CALMER WAY (with video placeholder) */}
      <section style={s.bodyWhite}>
        <div style={{...s.calmerInner, ...(isMobile ? s.calmerInnerMobile : {})}}>
          <div>
            <h2 style={s.h2}>{FFC.intro.h}</h2>
            {FFC.intro.paras.map((p,i)=><p key={i} style={s.p}>{p}</p>)}
          </div>
          <div style={s.videoWrap}>
            <div style={s.videoInner} aria-label="Campaign video coming soon">
              <span style={s.playBtn}>
                <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="var(--navy-700)"/></svg>
              </span>
              <span style={s.videoCaption}>Your video will appear here</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAMILIAR */}
      <section style={s.bodyTint}>
        <div style={s.wide}>
          <h2 style={{...s.h2, textAlign:"center", marginBottom:28}}>{FFC.familiar.h}</h2>
          <div style={{...s.grid2, ...(isMobile ? s.grid1 : {})}}>
            {FFC.familiar.cards.map((c,i)=>{
              const Icon = familiarIcons[i];
              return (
                <Card key={i} elevation="shadow" style={s.card}>
                  <span style={s.cardIcon}><Icon width={22} height={22}/></span>
                  <h3 style={s.cardTitle}>{c.t}</h3>
                  <p style={s.cardBody}>{c.b}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHAT IS IT */}
      <section style={s.bodyWhite}>
        <div style={s.narrow}>
          <h2 style={s.h2}>{FFC.what.h}</h2>
          {FFC.what.paras.map((p,i)=><p key={i} style={s.p}>{p}</p>)}
          <p style={s.listLabel}>{FFC.what.reviewLabel}</p>
          <CheckList items={FFC.what.review}/>
          <Card elevation="shadow" style={s.noteCard}>
            <p style={s.noteCardP}>{FFC.what.closing}</p>
          </Card>
        </div>
      </section>

      {/* BENEFITS */}
      <section style={s.bodyTint}>
        <div style={s.wide}>
          <h2 style={s.h2}>{FFC.benefits.h}</h2>
          <p style={{...s.p, maxWidth:760, marginBottom:28}}>{FFC.benefits.lead}</p>
          <div style={{...s.grid2, ...(isMobile ? s.grid1 : {})}}>
            {FFC.benefits.cards.map((c,i)=>{
              const Icon = benefitIcons[i];
              return (
                <Card key={i} elevation="shadow" style={s.card}>
                  <span style={s.cardIcon}><Icon width={22} height={22}/></span>
                  <h3 style={s.cardTitle}>{c.t}</h3>
                  <p style={s.cardBody}>{c.b}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* OPTIONS */}
      <section style={s.bodyWhite} ref={optionsRef}>
        <div style={s.wide}>
          <h2 style={s.h2}>{FFC.options.h}</h2>
          <p style={{...s.p, maxWidth:760, marginBottom:28}}>{FFC.options.lead}</p>
          <div style={{...s.grid2, ...(isMobile ? s.grid1 : {})}}>
            {FFC.options.cards.map((c,i)=>(
              <Card key={i} elevation="shadow" style={s.optionCard}>
                <span style={s.optionTag}>{c.tag}</span>
                <h3 style={s.optionTitle}>{c.t}</h3>
                <p style={s.cardBody}>{c.body}</p>
                <p style={s.listLabel}>{c.suitLabel}</p>
                <CheckList items={c.suit}/>
                <div style={s.considerBox}>
                  <span style={s.considerLabel}>Things to consider</span>
                  <p style={s.considerText}>{c.consider}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section style={s.bodyTint}>
        <div style={s.narrow}>
          <h2 style={s.h2}>{FFC.forWhom.h}</h2>
          <p style={s.p}>{FFC.forWhom.lead}</p>
          <CheckList items={FFC.forWhom.list}/>
          <p style={{...s.p, fontWeight:600, color:"var(--navy-700)"}}>{FFC.forWhom.closing}</p>
        </div>
      </section>

      {/* PROCESS */}
      <section style={s.bodyWhite}>
        <div style={s.wide}>
          <h2 style={{...s.h2, textAlign:"center", marginBottom:28}}>{FFC.process.h}</h2>
          <div style={{...s.stepGrid, ...(isMobile ? s.grid1 : {})}}>
            {FFC.process.steps.map((st,i)=>(
              <div key={i} style={s.stepCard}>
                <span style={s.stepNum}>{i+1}</span>
                <h3 style={s.stepTitle}>{st.t}</h3>
                <p style={s.cardBody}>{st.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HELP WITH */}
      <section style={s.bodyTint}>
        <div style={s.wide}>
          <h2 style={{...s.h2, marginBottom:28}}>{FFC.help.h}</h2>
          <div style={{...s.grid3, ...(isMobile ? s.grid1 : {})}}>
            {FFC.help.cards.map((c,i)=>{
              const Icon = helpIcons[i];
              return (
                <Card key={i} elevation="shadow" style={s.card}>
                  <span style={s.cardIcon}><Icon width={22} height={22}/></span>
                  <h3 style={s.cardTitle}>{c.t}</h3>
                  <p style={s.cardBody}>{c.b}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY MESH */}
      <section style={s.bodyWhite}>
        <div style={s.wide}>
          <h2 style={{...s.h2, marginBottom:28}}>{FFC.why.h}</h2>
          <div style={{...s.grid2, ...(isMobile ? s.grid1 : {})}}>
            {FFC.why.cards.map((c,i)=>{
              const Icon = whyIcons[i];
              return (
                <Card key={i} elevation="shadow" style={s.card}>
                  <span style={s.cardIcon}><Icon width={22} height={22}/></span>
                  <h3 style={s.cardTitle}>{c.t}</h3>
                  <p style={s.cardBody}>{c.b}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA (navy) */}
      <section style={s.finalCta}>
        <div style={s.finalInner}>
          <h2 style={s.finalH}>{FFC.finalCta.h}</h2>
          <p style={s.finalText}>{FFC.finalCta.text}</p>
          <div style={{...s.heroBtns, ...(isMobile ? s.heroBtnsMobile : {}), justifyContent:"center"}}>
            <Button block={isMobile} size="lg" onClick={()=>scrollTo(formRef)} iconRight={<ArrowRight width={18} height={18}/>}>{FFC.finalCta.primary}</Button>
            <Button block={isMobile} size="lg" variant="ghost" onClick={()=>scrollTo(formRef)} style={s.ghostOnNavy}>{FFC.finalCta.secondary}</Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={s.bodyTint}>
        <div style={s.narrow}>
          <h2 style={{...s.h2, marginBottom:18}}>Frequently asked questions</h2>
          <Accordion defaultOpen={[0]} items={FFC.faqs.map(f=>({question:f.q, answer:f.a}))}/>
        </div>
      </section>

      {/* COMPLIANCE */}
      <section style={s.bodyWhite}>
        <div style={s.narrow}>
          <p style={s.compliance}>{FFC.compliance}</p>
        </div>
      </section>
    </div>
  );
}

/* Live Calendly inline booking, prefilled with the visitor's name/email.
   Mounts only when step 3 renders, so the widget initialises on demand. */
const FFC_CALENDLY_URL = "https://calendly.com/chanel-fqxz/intro-to-mesh-finance-clone";
function CalendlyEmbed({ prefill }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    const init = () => {
      if (window.Calendly && el && !el.hasChildNodes()) {
        window.Calendly.initInlineWidget({ url: FFC_CALENDLY_URL, parentElement: el, prefill: prefill || {} });
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
  return <div ref={ref} style={{ minWidth: 260, height: 630 }} aria-label="Book a time with Mesh Finance"/>;
}

/* Google reviews (Trustindex) widget — same loader used on the homepage. */
function GoogleReviews() {
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

const s = {
  logoBar: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"22px 28px 0",
    display:"flex", alignItems:"center" },
  logoLink: { display:"inline-flex", alignItems:"center" },

  hero: { background:"var(--blue-50)" },
  heroInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"22px 28px 52px",
    display:"grid", gridTemplateColumns:"minmax(0,1.05fr) minmax(0,.95fr)", gap:48, alignItems:"center" },
  heroInnerMobile: { gridTemplateColumns:"minmax(0,1fr)", padding:"18px 20px 36px", gap:28 },
  heroCopy: { minWidth:0, display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" },
  h1: { fontSize:36, lineHeight:1.15, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em", maxWidth:580 },
  heroSubhead: { fontSize:17, lineHeight:1.5, color:"var(--color-primary)", fontWeight:600, margin:0, maxWidth:560 },
  heroLead: { fontSize:16.5, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:560 },
  heroPoints: { listStyle:"none", margin:"2px 0 0", padding:0, display:"grid", gap:10 },
  heroPoint: { display:"flex", gap:11, alignItems:"flex-start", fontSize:15.5, color:"var(--text-body)", fontWeight:500 },
  heroTick: { flex:"none", width:22, height:22, borderRadius:"50%", background:"var(--color-success)", color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center", marginTop:1 },
  heroBtns: { display:"flex", gap:12, flexWrap:"wrap", marginTop:4 },
  heroBtnsMobile: { flexDirection:"column", alignSelf:"stretch", width:"100%" },

  formCol: { minWidth:0 },
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
  formReassure: { fontSize:12.5, color:"var(--text-muted)", textAlign:"center", margin:0 },
  backLink: { appearance:"none", background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)",
    fontFamily:"var(--font-body)", fontSize:13.5, fontWeight:600, padding:4, justifySelf:"center" },

  reviewsBand: { background:"#fff", borderBottom:"1px solid var(--border-subtle)" },
  reviewsInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"24px 28px" },

  calmerInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px",
    display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,.85fr)", gap:44, alignItems:"center" },
  calmerInnerMobile: { gridTemplateColumns:"minmax(0,1fr)", padding:"0 20px", gap:24 },

  videoWrap: { minWidth:0, width:"100%" },
  videoInner: { position:"relative", aspectRatio:"16/9", borderRadius:16, overflow:"hidden",
    background:"linear-gradient(150deg, var(--navy-700), var(--blue-600))", boxShadow:"var(--shadow-md)",
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 },
  playBtn: { width:72, height:72, borderRadius:"50%", background:"#fff", display:"flex", alignItems:"center",
    justifyContent:"center", boxShadow:"0 8px 24px -8px rgba(0,0,0,.5)", paddingLeft:4 },
  videoCaption: { color:"rgba(255,255,255,.9)", fontFamily:"var(--font-body)", fontSize:14, fontWeight:600, letterSpacing:".01em" },

  bodyWhite: { background:"var(--surface-page)", padding:"52px 0" },
  bodyTint: { background:"var(--blue-50)", padding:"52px 0" },
  narrow: { maxWidth:820, margin:"0 auto", padding:"0 28px" },
  wide: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },

  h2: { fontSize:28, lineHeight:1.2, margin:"0 0 16px", color:"var(--navy-700)", letterSpacing:"-.01em" },
  p: { fontSize:16.5, lineHeight:1.7, color:"var(--text-body)", margin:"0 0 14px" },
  listLabel: { fontSize:16, fontWeight:700, color:"var(--navy-700)", margin:"6px 0 12px" },
  checkList: { listStyle:"none", margin:"0 0 18px", padding:0, display:"grid", gap:10 },
  checkItem: { display:"flex", gap:12, alignItems:"flex-start", fontSize:15.5, lineHeight:1.5, color:"var(--text-body)" },
  checkIcon: { flex:"none", width:22, height:22, borderRadius:"50%", background:"var(--color-success)", color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center", marginTop:1 },

  grid2: { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:18 },
  grid3: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 },
  grid1: { gridTemplateColumns:"1fr" },
  card: { padding:"24px 26px", background:"#fff", height:"100%" },
  cardIcon: { flex:"none", width:44, height:44, borderRadius:"var(--radius-md)", background:"var(--color-primary-soft)",
    color:"var(--color-primary)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 },
  cardTitle: { fontFamily:"var(--font-display)", fontSize:18, color:"var(--navy-700)", margin:"0 0 8px", fontWeight:700 },
  cardBody: { fontSize:15, color:"var(--text-body)", lineHeight:1.6, margin:0 },

  noteCard: { padding:"22px 26px", background:"var(--blue-50)", marginTop:8 },
  noteCardP: { fontFamily:"var(--font-display)", fontSize:17, lineHeight:1.5, color:"var(--navy-700)", fontWeight:600, margin:0 },

  optionCard: { padding:"28px 30px", background:"#fff", height:"100%", display:"flex", flexDirection:"column" },
  optionTag: { alignSelf:"flex-start", fontSize:12, fontWeight:700, letterSpacing:".05em", textTransform:"uppercase",
    color:"var(--blue-600)", background:"var(--blue-50)", padding:"5px 12px", borderRadius:999, marginBottom:12 },
  optionTitle: { fontFamily:"var(--font-display)", fontSize:20, color:"var(--navy-700)", margin:"0 0 10px", fontWeight:700 },
  considerBox: { marginTop:"auto", padding:"16px 18px", background:"var(--surface-page)", borderRadius:"var(--radius-md)",
    border:"1px solid var(--border-subtle)" },
  considerLabel: { display:"block", fontSize:12.5, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em",
    color:"var(--text-subtle)", marginBottom:6 },
  considerText: { fontSize:14, lineHeight:1.6, color:"var(--text-body)", margin:0 },

  stepGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18 },
  stepCard: { padding:"24px 22px", background:"#fff", borderRadius:"var(--radius-lg)", border:"1px solid var(--border-subtle)" },
  stepNum: { display:"flex", alignItems:"center", justifyContent:"center", width:38, height:38, borderRadius:"50%",
    background:"var(--color-primary)", color:"#fff", fontFamily:"var(--font-display)", fontWeight:800, fontSize:17, marginBottom:14 },
  stepTitle: { fontFamily:"var(--font-display)", fontSize:16.5, color:"var(--navy-700)", margin:"0 0 8px", fontWeight:700 },

  finalCta: { background:"var(--navy-700)", padding:"64px 0" },
  finalInner: { maxWidth:820, margin:"0 auto", padding:"0 28px", textAlign:"center",
    display:"flex", flexDirection:"column", alignItems:"center", gap:16 },
  finalH: { fontSize:32, lineHeight:1.2, margin:0, color:"#fff", letterSpacing:"-.01em" },
  finalText: { fontSize:17, lineHeight:1.65, color:"rgba(255,255,255,.85)", margin:0, maxWidth:640 },
  ghostOnNavy: { color:"#fff", borderColor:"rgba(255,255,255,.5)" },

  legend: { fontFamily:"var(--font-body)", fontWeight:600, fontSize:14, color:"var(--text-strong)", marginBottom:9 },
  formError: { fontSize:13.5, color:"var(--color-danger)", margin:0 },
  thanks: { textAlign:"center", padding:"24px 10px" },
  tick: { width:56, height:56, borderRadius:"50%", background:"var(--color-success)", color:"#fff", fontSize:28,
    display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" },
  thanksH: { fontFamily:"var(--font-display)", color:"var(--navy-700)", margin:"0 0 6px" },
  thanksP: { color:"var(--text-muted)", margin:"0 0 18px" },

  compliance: { fontSize:13, lineHeight:1.6, color:"var(--text-muted)", margin:0 },
};

Object.assign(window, { MeshFamilyFinanceCheckScreen: FamilyFinanceCheckScreen });

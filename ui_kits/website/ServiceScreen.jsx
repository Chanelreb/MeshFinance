/* Service page, First Home Buyers. Breadcrumb, hero, content, FAQ, side CTA. */
function ServiceScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Breadcrumb, Badge, Button, Card, Accordion, Alert, Tabs } = DS;
  const { Check, Key, Phone } = window.MeshIcons;
  const isMobile = window.useIsMobile();

  const benefits = [
    "WA First Home Buyer Grant, a one-time grant for eligible first-time buyers, giving you a financial boost.",
    "WA FHB Stamp Duty Rebate, reduces or eliminates stamp duty fees, cutting upfront costs.",
    "Home Guarantee Scheme, buy with a smaller deposit as the government covers part of the lender's risk.",
    "Home Buyers Assistance & Lender Offers, extra perks and financial support from lenders.",
    "LMI waivers for many industry professionals, doctors, nurses, accountants, engineers, pilots, lawyers, essential workers and more.",
    "Guarantor Loans, a family member's property as security, so you don't need a large deposit.",
  ];

  return (
    <div>
      <section style={svcS.head}>
        <div style={svcS.headInner}>
          <Breadcrumb items={[{label:"Home",href:"#"},{label:"How We Help",href:"#"},{label:"First Home Buyers"}]}/>
          <div style={svcS.headRow}>
            <div style={{maxWidth:620}}>
              <Badge color="solid">First Home Buyers</Badge>
              <h1 style={svcS.h1}>WA First Home Buyers</h1>
              <p style={svcS.lead}>For first home buyers the process of purchasing a home can be overwhelming. From saving for a deposit to navigating the complex world of loans and financing, it can be difficult to know where to start. There are a range of First Home Buyer benefits available to help young Australians into their first home.</p>
              <Button size="lg" onClick={()=>onNav("contact")}>Book in for a First Home Q&A</Button>
            </div>
          </div>
        </div>
      </section>

      <section style={svcS.body}>
        <div style={{...svcS.bodyInner, ...(isMobile ? svcS.bodyInnerMobile : {})}}>
          <div style={svcS.main}>
            <h2 style={svcS.h2}>What you could be entitled to</h2>
            <p style={svcS.p}>There are a range of First Home Buyer benefits available in WA to help you get into your first home, the rules change and overlap, so here's what we'll check for you:</p>
            <ul style={svcS.checks}>
              {benefits.map((b,i)=>(
                <li key={i} style={svcS.checkItem}>
                  <span style={svcS.checkIcon}><Check width={15} height={15}/></span>{b}
                </li>
              ))}
            </ul>

            <Alert variant="info" title="Schemes change, we keep up so you don't have to">
              Grant amounts, price caps and stamp-duty thresholds are reviewed regularly. We'll confirm what currently applies to your situation before you commit.
            </Alert>

            <h2 style={{...svcS.h2, marginTop:40}}>Home loan or family guarantee?</h2>
            <Tabs tabs={[
              {label:"Standard low-deposit", content:<p style={svcS.p}>With the Home Guarantee Scheme you may be able to buy with as little as a 5% deposit and avoid Lenders Mortgage Insurance, subject to eligibility and place availability.</p>},
              {label:"Family guarantee", content:<p style={svcS.p}>A parent uses equity in their own property as additional security. It can let you buy sooner, borrow more and skip LMI, without them handing over cash.</p>},
            ]}/>

            <h2 style={{...svcS.h2, marginTop:40}}>First home buyer FAQs</h2>
            <Accordion defaultOpen={[0]} items={[
              {question:"Do I need to have my deposit before talking to a broker?", answer:"No. We actually prefer it when clients chat with us early in their home buying journey. It lets us help you build a plan that fits your situation, and often clients have come across information that isn't quite right, so getting the facts early saves time and stress later."},
              {question:"How much deposit do I really need?", answer:"It depends on the lender and scheme. With the Home Guarantee Scheme it can be as low as 5%. We'll map your options against your savings and income."},
              {question:"Does using a broker cost me anything?", answer:"No, our service is free to you. Lenders pay us a commission once your loan settles, and we disclose it upfront."},
              {question:"Can I use a grant and a family guarantee together?", answer:"Often, yes. We'll structure them so they work together rather than against each other."},
            ]}/>
          </div>

          <aside style={svcS.aside}>
            <Card elevation="shadow" style={{position:"sticky", top:90, padding:0}}>
              <div style={svcS.sideIcon}><Key width={26} height={26}/></div>
              <h3 style={svcS.sideH}>Talk to a real person</h3>
              <p style={svcS.sideP}>A quick, no-obligation chat is the fastest way to see where you stand.</p>
              <Button block size="md" onClick={()=>onNav("contact")}>Book a chat</Button>
              <a href="tel:+61416291241" style={svcS.sidePhone}><Phone width={16} height={16} style={{color:"var(--color-primary)"}}/> 0416 291 241</a>
            </Card>
          </aside>
        </div>
      </section>

      <section style={{padding:"0 0 64px"}}>
        <div style={{maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px"}}>
          <p style={{fontFamily:"var(--font-display)", fontSize:19, color:"var(--navy-700)", fontWeight:600, textAlign:"center"}}>
            Let's make your homeownership dream a reality, reach out to us today!
          </p>
        </div>
      </section>
    </div>
  );
}

const svcS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"24px 28px 48px" },
  headRow: { marginTop:18 },
  h1: { fontSize:42, lineHeight:1.15, margin:"18px 0 14px", color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:18, lineHeight:1.55, color:"var(--text-body)", margin:"0 0 28px", maxWidth:560 },
  body: { padding:"56px 0 80px" },
  bodyInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px",
    display:"grid", gridTemplateColumns:"1fr 340px", gap:48, alignItems:"start" },
  bodyInnerMobile: { gridTemplateColumns:"1fr", padding:"0 20px", gap:32 },
  main: {},
  h2: { fontSize:28, margin:"0 0 12px", color:"var(--navy-700)" },
  p: { fontSize:16, lineHeight:1.65, color:"var(--text-body)", margin:"0 0 20px" },
  checks: { listStyle:"none", margin:"0 0 28px", padding:0, display:"grid", gap:12 },
  checkItem: { display:"flex", gap:12, alignItems:"flex-start", fontSize:16, color:"var(--text-body)" },
  checkIcon: { flex:"none", width:24, height:24, borderRadius:"50%", background:"var(--color-success)",
    color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", marginTop:1 },
  aside: {},
  sideIcon: { width:52, height:52, borderRadius:"var(--radius-md)", background:"var(--color-primary-soft)",
    color:"var(--color-primary)", display:"flex", alignItems:"center", justifyContent:"center", margin:"4px 0 14px" },
  sideH: { fontFamily:"var(--font-display)", fontSize:20, margin:"0 0 6px", color:"var(--navy-700)", fontWeight:700 },
  sideP: { fontSize:14.5, color:"var(--text-muted)", margin:"0 0 18px", lineHeight:1.5 },
  sidePhone: { display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:14,
    fontFamily:"var(--font-display)", fontWeight:700, fontSize:15, color:"var(--navy-700)", textDecoration:"none" },
};

Object.assign(window, { MeshServiceScreen: ServiceScreen });

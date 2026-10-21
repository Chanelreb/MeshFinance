/* Areas we serve: local landing page for the Perth regions Mesh Finance works
   in (Perth Hills, South Perth and the rest of the metro area). Built
   from Search Console data showing suburb-level searches, and from Chanel's own
   description of where she works: the Hills through South Perth and beyond,
   the whole of Perth really. Office map, region sections with suburb lists,
   how appointments work, FAQs, closing CTA. */
const AREAS = {
  eyebrow: "Areas we serve",
  title: "A mortgage broker for the whole of Perth, from the Hills to the river and beyond",
  lead: "Our office is in South Perth, our roots are in the Perth Hills, and our clients are right across Perth. Meet us in person, by phone or by video, wherever you are.",
  regions: [
    {
      h: "Perth Hills",
      body: [
        "Chanel was born and raised in the Hills and still lives there with her family, so this is home turf. We regularly help first home buyers, upgraders and investors across the Hills, and we watch the local market closely.",
        "Hills properties often come with larger blocks, older homes and the odd quirk a lender needs explained properly. Knowing the area helps us pick lenders who are comfortable with it.",
      ],
      suburbs: ["Kalamunda", "Maida Vale", "High Wycombe", "Forrestfield", "Gooseberry Hill", "Lesmurdie", "Mundaring", "Darlington", "Glen Forrest"],
      links: [{ label: "Forrestfield property market 2026", id: "forrestfield-property-market-2026" }, { label: "First home buyers", id: "first-home-buyers" }],
    },
    {
      h: "South Perth and the inner south",
      body: [
        "Our office is at Suite 206, Level 2, 96 Mill Point Road, South Perth, a few minutes from Como, Applecross, Victoria Park and the CBD. Face-to-face appointments are by arrangement, with parking nearby.",
        "Inner-south clients tend to be refinancing, upgrading or buying an investment property, often using the equity they have built up. We compare the options across 40+ lenders and explain the numbers plainly.",
      ],
      suburbs: ["South Perth", "Como", "Applecross", "Ardross", "Attadale", "Myaree", "Victoria Park", "Cannington", "Gosnells"],
      links: [{ label: "Refinance your home loan", id: "refinance-home-loans" }, { label: "Home equity calculator", id: "equity-calculator" }],
    },
    {
      h: "Everywhere else in Perth, and regional WA",
      body: [
        "North of the river and beyond, from Subiaco, Dianella and Innaloo up to Joondalup and Yanchep, and south through Bibra Lake and Atwell to Rockingham and Mandurah, we work online with clients across the whole metro area. Phone, email and video appointments mean distance makes no difference to the service.",
        "Regional clients work with us the same way, with lender valuations arranged locally and documents signed online.",
      ],
      suburbs: ["Subiaco", "Swanbourne", "Innaloo", "Doubleview", "Dianella", "Joondalup", "Yanchep", "Bibra Lake", "Atwell", "Rockingham", "Mandurah"],
      links: [{ label: "Home loans", id: "home-loans" }, { label: "Investment property loans", id: "investment-home-loans" }, { label: "Calculators and tools", id: "calculator-hub" }],
    },
  ],
  how: {
    h: "How appointments work",
    steps: [
      { t: "Choose how we meet", b: "In person at South Perth, by phone, or by video. Evenings and some weekends are available by arrangement." },
      { t: "We compare the market", b: "Your situation against 40+ banks and specialist lenders, with the numbers explained so you can decide." },
      { t: "We handle the rest", b: "Application, lender follow-up and settlement, with you kept in the loop the whole way." },
    ],
  },
  faqs: [
    { q: "Do I need to come into the office?", a: "No. Most of our clients never visit the office. Phone, email and video appointments cover everything, and documents are signed online. If you prefer to sit down together, book a time at our South Perth office." },
    { q: "Are you a local mortgage broker for the Perth Hills?", a: "Yes. Chanel grew up in the Hills and still lives there, and a large share of our clients are in Kalamunda, Maida Vale, High Wycombe, Forrestfield and the surrounding suburbs." },
    { q: "Do you work with clients outside Perth?", a: "Yes. We work with clients across regional WA online, exactly as we do with Perth clients. Lender valuations are arranged locally and settlement happens the same way." },
    { q: "Which parts of Perth do you cover?", a: "All of it. Our office is in South Perth and our home base is the Perth Hills, but phone and video appointments mean we work with clients from Yanchep to Mandurah and everywhere in between." },
    { q: "Which lenders do you compare?", a: "A panel of 40+ lenders, from the major banks to specialist and non-bank lenders. You can see the full list on our What We Finance pages." },
  ],
  closing: "Wherever you are in Perth, the first conversation is free and there's no obligation. Tell us where you're at and we'll tell you what's possible.",
};

function AreasScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Button, Card, Breadcrumb, Accordion } = DS;
  const { MapPin, Check } = window.MeshIcons;
  const isMobile = window.useIsMobile();
  const d = AREAS;

  return (
    <div>
      <section style={arS.head}>
        <div style={{...arS.headInner, ...(isMobile ? arS.headInnerMobile : {})}}>
          <div style={arS.headCopy}>
            <Breadcrumb items={[
              {label:"Home", href:window.meshHref("home"), onClick:(e)=>{e.preventDefault();onNav("home");}},
              {label:"Areas We Serve"},
            ]}/>
            <Badge color="solid">{d.eyebrow}</Badge>
            <h1 style={arS.h1}>{d.title}</h1>
            <p style={arS.lead}>{d.lead}</p>
            <div style={arS.heroBtns}>
              <Button size="lg" onClick={()=>onNav("contact")}>Book a chat</Button>
            </div>
          </div>
        </div>
      </section>

      <window.MeshLenderStrip/>

      <section style={arS.body}>
        <div style={{...arS.bodyInner, ...(isMobile ? arS.bodyInnerMobile : {})}}>
          {d.regions.map((r, i) => (
            <Card key={i} elevation="shadow" style={arS.regionCard}>
              <div style={arS.regionHead}>
                <span style={arS.regionIcon}><MapPin width={20} height={20}/></span>
                <h2 style={arS.h2}>{r.h}</h2>
              </div>
              {r.body.map((p, j) => <p key={j} style={arS.p}>{p}</p>)}
              <div style={arS.chips} role="group" aria-label={"Suburbs we serve in " + r.h}>
                {r.suburbs.map((sName, j) => <span key={j} style={arS.chip}>{sName}</span>)}
              </div>
              <div style={arS.linkRow}>
                {r.links.map((l, j) => (
                  <a key={j} href={window.meshHref(l.id)} onClick={(e)=>{e.preventDefault();onNav(l.id);}} style={arS.linkBtn}>{l.label} →</a>
                ))}
              </div>
            </Card>
          ))}

          <h2 style={{...arS.h2, marginTop:44}}>{d.how.h}</h2>
          <div style={arS.wayGrid}>
            {d.how.steps.map((w, i) => (
              <div key={i} style={arS.wayCard}>
                <span style={arS.wayBadge}>{i+1}</span>
                <div>
                  <div style={arS.wayT}>{w.t}</div>
                  <div style={arS.wayB}>{w.b}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{...arS.h2, marginTop:44}}>Our South Perth office</h2>
          <div style={{...arS.officeGrid, ...(isMobile ? arS.officeGridMobile : {})}}>
            <iframe
              title="Mesh Finance office location, South Perth"
              style={arS.map}
              src="https://www.google.com/maps?q=96%20Mill%20Point%20Road%2C%20South%20Perth%20WA%206151&z=14&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div style={arS.officeCopy}>
              <p style={arS.p}>Suite 206, Level 2, 96 Mill Point Road, South Perth WA 6151</p>
              <ul style={arS.tickList}>
                {["In-person appointments by arrangement", "Phone and video appointments across Perth and WA", "Documents signed online, no printing"].map((t, i) => (
                  <li key={i} style={arS.tickItem}><span style={arS.tick}><Check width={12} height={12}/></span>{t}</li>
                ))}
              </ul>
              <a href="https://www.google.com/maps/dir/?api=1&destination=96%20Mill%20Point%20Road%2C%20South%20Perth%20WA%206151"
                 target="_blank" rel="noopener noreferrer" style={arS.linkBtn}>Get directions →</a>
            </div>
          </div>

          <h2 style={{...arS.h2, marginTop:44}}>Frequently asked questions</h2>
          <Accordion defaultOpen={[0]} items={d.faqs.map(f=>({question:f.q, answer:f.a}))}/>

          <Card elevation="shadow" style={arS.closingCard}>
            <div>
              <h3 style={arS.closingH}>Wherever you are in Perth, let's talk</h3>
              <p style={arS.closingP}>{d.closing}</p>
            </div>
            <Button size="lg" onClick={()=>onNav("contact")}>Book a chat</Button>
          </Card>
        </div>
      </section>
    </div>
  );
}

const arS = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"32px 28px 56px" },
  headInnerMobile: { padding:"24px 20px 40px" },
  headCopy: { display:"flex", flexDirection:"column", gap:10, alignItems:"flex-start", maxWidth:760 },
  h1: { fontSize:38, lineHeight:1.15, margin:"6px 0 0", color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:"6px 0 0", maxWidth:680 },
  heroBtns: { marginTop:10 },

  body: { padding:"48px 0 80px" },
  bodyInner: { maxWidth:"860px", margin:"0 auto", padding:"0 28px" },
  bodyInnerMobile: { padding:"0 20px" },
  h2: { fontSize:24, margin:"0 0 16px", color:"var(--navy-700)" },
  p: { fontSize:16, lineHeight:1.65, color:"var(--text-body)", margin:"0 0 14px" },

  regionCard: { padding:"26px 26px 22px", marginBottom:18 },
  regionHead: { display:"flex", alignItems:"center", gap:12, marginBottom:10 },
  regionIcon: { flex:"none", width:40, height:40, borderRadius:"var(--radius-md)", background:"var(--color-primary-soft)",
    color:"var(--color-primary)", display:"flex", alignItems:"center", justifyContent:"center" },
  chips: { display:"flex", flexWrap:"wrap", gap:8, margin:"4px 0 14px" },
  chip: { fontSize:13, fontWeight:600, color:"var(--navy-700)", background:"var(--blue-50)", border:"1px solid var(--border-subtle)",
    borderRadius:999, padding:"5px 12px" },
  linkRow: { display:"flex", flexWrap:"wrap", gap:"8px 18px" },
  linkBtn: { color:"var(--blue-500)", fontWeight:600, textDecoration:"none", fontSize:14.5 },

  wayGrid: { display:"grid", gap:14, marginBottom:8 },
  wayCard: { display:"flex", gap:14, padding:"16px 18px", background:"var(--blue-50)", borderRadius:"var(--radius-md)" },
  wayBadge: { flex:"none", width:30, height:30, borderRadius:"50%", background:"var(--color-primary)", color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:14 },
  wayT: { fontWeight:700, color:"var(--navy-700)", marginBottom:4, fontSize:15.5 },
  wayB: { fontSize:14.5, color:"var(--text-body)", lineHeight:1.55 },

  officeGrid: { display:"grid", gridTemplateColumns:"minmax(0,1.1fr) minmax(0,.9fr)", gap:24, alignItems:"center" },
  officeGridMobile: { gridTemplateColumns:"minmax(0,1fr)" },
  map: { width:"100%", minHeight:280, border:0, display:"block", borderRadius:"var(--radius-lg)", boxShadow:"var(--shadow-md)" },
  officeCopy: { minWidth:0 },
  tickList: { listStyle:"none", margin:"0 0 14px", padding:0, display:"grid", gap:8 },
  tickItem: { display:"flex", gap:10, alignItems:"flex-start", fontSize:15, lineHeight:1.5, color:"var(--text-body)" },
  tick: { flex:"none", width:20, height:20, borderRadius:"50%", background:"var(--color-success)", color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center", marginTop:2 },

  closingCard: { display:"flex", flexDirection:"column", gap:20, alignItems:"flex-start", padding:"28px 32px", background:"#fff", marginTop:44 },
  closingH: { fontFamily:"var(--font-display)", fontSize:20, color:"var(--navy-700)", margin:"0 0 6px", fontWeight:700 },
  closingP: { fontSize:16, lineHeight:1.5, color:"var(--text-body)", margin:"0 0 16px" },
};

Object.assign(window, { MeshAreasScreen: AreasScreen });

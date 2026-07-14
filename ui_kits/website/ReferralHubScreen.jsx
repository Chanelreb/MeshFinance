/* Referral Hub, refer-a-friend competition. */
function ReferralHubScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Badge, Card, Button, Field, Input, Textarea } = DS;
  const d = window.MeshContent.referralHub;
  const isMobile = window.useIsMobile();
  const { useState } = React;
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const submitReferral = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const ok = await window.MeshSubmitForm(e.target);
      setStatus(ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };
  return (
    <div style={refS.page}>
      <div style={{...refS.inner, ...(isMobile ? refS.innerMobile : {})}}>
        <div style={refS.left}>
          <Badge color="solid">Connect With Us</Badge>
          <h1 style={refS.h1}>{d.title}</h1>
          <p style={refS.lead}>{d.intro}</p>

          <Card elevation="shadow" style={refS.banner}>
            <h2 style={refS.bannerH}>{d.headline}</h2>
            <p style={refS.bannerP}>{d.headlineBody}</p>
          </Card>

          <div style={{...refS.twoCol, ...(isMobile ? refS.twoColMobile : {})}}>
            <div>
              <h3 style={refS.h3}>🏆 What You Could Win</h3>
              <ul style={refS.plainList}>
                {d.prizes.map((p,i)=>(<li key={i} style={refS.plainItem}><strong>{p.label}:</strong> {p.value}</li>))}
              </ul>
            </div>
            <div>
              <h3 style={refS.h3}>📅 Key Dates</h3>
              <ul style={refS.plainList}>
                {d.dates.map((p,i)=>(<li key={i} style={refS.plainItem}><strong>{p.label}:</strong> {p.value}</li>))}
              </ul>
            </div>
          </div>

          <h3 style={refS.h3}>✅ How to Enter</h3>
          <ol style={refS.steps}>
            {d.howToEnter.map((step,i)=>(<li key={i} style={refS.stepItem}>{step}</li>))}
          </ol>
        </div>

        <Card elevation="shadow-lg" style={{padding:28}}>
          {status === "sent" ? (
            <div style={refS.thanks}>
              <div style={refS.tick}>✓</div>
              <h3 style={refS.formH}>Thanks for the referral!</h3>
              <p style={refS.thanksP}>We'll be in touch with your friend shortly.</p>
              <Button variant="secondary" onClick={()=>setStatus("idle")}>Refer another friend</Button>
            </div>
          ) : (
            <React.Fragment>
              <h3 style={refS.formH}>Client Referral Form 🙌🏼</h3>
              <form onSubmit={submitReferral} style={{display:"grid", gap:14, marginTop:10}}>
                <input type="hidden" name="_subject" value="New referral — Mesh Finance"/>
                <Field label="Your Name" required><Input name="referrerName" required placeholder="Your name"/></Field>
                <Field label="Friend's Name" required><Input name="friendName" required placeholder="Their name"/></Field>
                <Field label="Friend's Email"><Input name="friendEmail" type="email" placeholder="their@email.com"/></Field>
                <Field label="Friend's Number"><Input name="friendPhone" type="tel" placeholder="04xx xxx xxx"/></Field>
                <Field label="Comment or Message"><Textarea name="message" rows={3} placeholder="Anything we should know?"/></Field>
                {status === "error" && <p style={refS.formError}>Something went wrong, please try again or call us.</p>}
                <Button block size="lg" type="submit" disabled={status==="sending"}>{status==="sending" ? "Sending…" : "Refer a Friend"}</Button>
              </form>
            </React.Fragment>
          )}
        </Card>
      </div>
    </div>
  );
}
const refS = {
  page: { background:"var(--surface-page)", padding:"48px 0 72px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px",
    display:"grid", gridTemplateColumns:"1fr 400px", gap:48, alignItems:"start" },
  innerMobile: { gridTemplateColumns:"1fr", padding:"0 20px", gap:32 },
  h1: { fontSize:36, margin:"12px 0 12px", color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:16.5, lineHeight:1.6, color:"var(--text-body)", margin:"0 0 24px" },
  banner: { padding:"22px 26px", background:"linear-gradient(120deg, var(--blue-600), var(--blue-500))", marginBottom:28, border:"none" },
  bannerH: { color:"#fff", fontFamily:"var(--font-display)", fontSize:20, margin:"0 0 6px" },
  bannerP: { color:"rgba(255,255,255,.9)", margin:0, fontSize:15 },
  twoCol: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:24 },
  twoColMobile: { gridTemplateColumns:"1fr", gap:20 },
  h3: { fontSize:17, color:"var(--navy-700)", margin:"0 0 10px" },
  plainList: { listStyle:"none", margin:0, padding:0, display:"grid", gap:8, fontSize:14.5, color:"var(--text-body)" },
  plainItem: {},
  steps: { paddingLeft:20, display:"grid", gap:8, fontSize:15, color:"var(--text-body)", lineHeight:1.55 },
  stepItem: {},
  formH: { fontFamily:"var(--font-display)", fontSize:19, color:"var(--navy-700)", margin:0, fontWeight:700 },
  formError: { fontSize:13.5, color:"var(--color-danger)", margin:0 },
  thanks: { textAlign:"center", padding:"20px 6px" },
  tick: { width:56, height:56, borderRadius:"50%", background:"var(--color-success)", color:"#fff",
    fontSize:28, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" },
  thanksP: { color:"var(--text-muted)", margin:"0 0 18px" },
};
Object.assign(window, { MeshReferralHubScreen: ReferralHubScreen });

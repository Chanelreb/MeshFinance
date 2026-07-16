/* Request a Report, dedicated submission form for CoreLogic property reports. */
function RequestReportScreen({ onNav }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Card, Button, Field, Input, Radio, Badge } = DS;
  const { Mail, Clock } = window.MeshIcons;
  const { useState } = React;
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "", ownership: "", loanBalance: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
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
    <div style={rr.page}>
      <div style={rr.inner}>
        <Badge color="blue" dot>Guides and Tools</Badge>
        <h1 style={rr.h1}>Request a Property Report</h1>
        <p style={rr.lead}>
          Pop in a few details and we'll send a CoreLogic valuation report straight to your inbox.
        </p>

        <Card elevation="shadow-lg" style={rr.card}>
          {sent ? (
            <div style={rr.thanks}>
              <div style={rr.tick}>✓</div>
              <h3 style={rr.thanksH}>Thank you!</h3>
              <p style={rr.thanksP}>
                Check your junk folder, you'll get your report back within two hours on business days.
              </p>
              <Button variant="secondary" onClick={() => onNav("property-profile-report")}>
                Back to reports
              </Button>
            </div>
          ) : (
            <form style={{ display: "grid", gap: 16 }} onSubmit={submit}>
              <input type="hidden" name="_subject" value="New property report request — Mesh Finance" />
              <Field label="Name" required>
                <Input name="name" required placeholder="Your name" value={form.name} onChange={set("name")} />
              </Field>
              <Field label="Email address" required>
                <Input name="email" required type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} />
              </Field>
              <Field label="Property address" required>
                <Input name="propertyAddress" required placeholder="123 Example Street, Suburb WA" value={form.address} onChange={set("address")} />
              </Field>
              <div>
                <div style={rr.legend}>Is this your property, or one you're looking to buy?</div>
                <div style={{ display: "flex", gap: 20 }}>
                  <Radio name="ownership" value="My property" label="My property" checked={form.ownership === "mine"} onChange={() => setForm((f) => ({ ...f, ownership: "mine" }))} />
                  <Radio name="ownership" value="Looking to buy" label="One I'm looking to buy" checked={form.ownership === "buying"} onChange={() => setForm((f) => ({ ...f, ownership: "buying" }))} />
                </div>
              </div>
              {form.ownership === "mine" && (
                <Field label="Would you like to give us your loan balance? We can tell you the usable equity you currently have for renovations, purchasing another property, and more.">
                  <Input name="loanBalance" placeholder="Current loan balance (optional)" value={form.loanBalance} onChange={set("loanBalance")} />
                </Field>
              )}
              {error && <p style={rr.error}>Something went wrong, please try again or call us.</p>}
              <Button block size="lg" type="submit" disabled={sending}>{sending ? "Sending…" : "Request report 📩"}</Button>
              <div style={rr.note}>
                <Clock width={15} height={15} style={{ flex: "none", marginTop: 1 }} />
                <span>We aim to send reports within two hours on business days, check your junk folder if it doesn't land in your inbox.</span>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

const rr = {
  page: { background: "var(--surface-page)", padding: "48px 0 80px" },
  inner: { maxWidth: "560px", margin: "0 auto", padding: "0 28px" },
  h1: { fontSize: 34, margin: "18px 0 4px", color: "var(--navy-700)", letterSpacing: "-.02em" },
  lead: { fontSize: 16.5, lineHeight: 1.6, color: "var(--text-body)", margin: "0 0 28px" },
  card: { padding: 32 },
  note: { display: "flex", gap: 8, fontSize: 13, color: "var(--text-subtle)", lineHeight: 1.5 },
  legend: { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: "var(--text-strong)", marginBottom: 9 },
  error: { fontSize: 13.5, color: "var(--color-danger)", margin: 0 },
  thanks: { textAlign: "center", padding: "20px 6px" },
  tick: { width: 56, height: 56, borderRadius: "50%", background: "var(--color-success)", color: "#fff",
    fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" },
  thanksH: { fontFamily: "var(--font-display)", color: "var(--navy-700)", margin: "0 0 8px", fontSize: 22 },
  thanksP: { color: "var(--text-body)", margin: "0 0 22px", fontSize: 15.5, lineHeight: 1.6, maxWidth: 380, marginLeft: "auto", marginRight: "auto" },
};

Object.assign(window, { MeshRequestReportScreen: RequestReportScreen });

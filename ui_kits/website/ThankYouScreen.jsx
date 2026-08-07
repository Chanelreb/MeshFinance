/* Shared "booking confirmed" thank-you page. Every Calendly booking outside the
   Family Finance Check campaign (homepage hero form, contact page) redirects
   here after the booking is confirmed. Fires the Google Ads and Meta
   conversions once on load. Rendered as a normal page (header + footer shown). */
function ThankYouScreen({ onNav }) {
  const { Button } = window.MeshFinanceDesignSystem_5c98d0;
  const { ArrowRight } = window.MeshIcons;

  React.useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-18158180693/nDPBCJ2ykNgcENWyv9JD",
        value: 1.0,
        currency: "AUD",
      });
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", "Schedule", { value: 1.0, currency: "AUD" });
    }
  }, []);

  return (
    <div style={tyx.wrap}>
      <div style={tyx.card}>
        <div style={tyx.tick} aria-hidden="true">✓</div>
        <h1 style={tyx.h1}>You're booked in. Thank you!</h1>
        <p style={tyx.lead}>
          Your chat with Mesh Finance is confirmed. Keep an eye on your inbox for a calendar invite with all the
          details, plus a reminder before we catch up.
        </p>
        <p style={tyx.sub}>Looking forward to helping you make a confident decision.</p>
        <div style={tyx.sign}>Chanel Rebello, Mesh Finance</div>
        <div style={tyx.btns}>
          <Button size="lg" onClick={() => onNav("home")} iconRight={<ArrowRight width={18} height={18}/>}>Back to home</Button>
          <button type="button" onClick={() => onNav("calculator-hub")} style={tyx.linkBtn}>Browse the calculators</button>
        </div>
      </div>
    </div>
  );
}

const tyx = {
  wrap: { background: "var(--blue-50)", padding: "72px 24px 96px", display: "flex", justifyContent: "center" },
  card: { background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: "44px 40px",
    maxWidth: 560, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" },
  tick: { width: 64, height: 64, borderRadius: "50%", background: "var(--color-success)", color: "#fff",
    fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  h1: { fontFamily: "var(--font-display)", fontSize: 32, color: "var(--navy-700)", margin: "0 0 12px", letterSpacing: "-.02em" },
  lead: { fontSize: 16.5, lineHeight: 1.6, color: "var(--text-body)", margin: "0 0 10px", maxWidth: 460 },
  sub: { fontSize: 14.5, color: "var(--text-muted)", margin: "0 0 4px" },
  sign: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--navy-700)", margin: "0 0 26px" },
  btns: { display: "flex", flexDirection: "column", gap: 12, alignItems: "center" },
  linkBtn: { appearance: "none", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)",
    fontWeight: 600, fontSize: 14.5, color: "var(--color-primary)" },
};

Object.assign(window, { MeshThankYouScreen: ThankYouScreen });

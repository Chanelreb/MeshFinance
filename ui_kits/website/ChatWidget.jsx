/* Mesh Finance website assistant — a floating chat widget.
 *
 * Talks to the serverless /api/chat function (which holds the Anthropic key and
 * streams Claude's reply). The widget never sees the key. When a visitor leaves
 * their details, it posts the lead + transcript to Formspree (same helper the
 * rest of the site uses) and fires the Google Ads + Meta conversions, so chat
 * leads land in the numbers like every other lead.
 *
 * Endpoint: set window.MESH_CHAT_API_URL (e.g. in index.html) to your deployed
 * Vercel URL, or edit MESH_CHAT_API below after deploying.
 */

/* Deployed Vercel endpoint. Set window.MESH_CHAT_API_URL in index.html to
   override without editing this file; the URL is read at send time. */
const MESH_CHAT_API_DEFAULT = "https://mesh-finance-git-main-scw3.vercel.app/api/chat";
function meshChatEndpoint() {
  return (typeof window !== "undefined" && window.MESH_CHAT_API_URL) || MESH_CHAT_API_DEFAULT;
}

const MESH_CHAT_STORE = "mesh_chat_v1";

const MESH_CHAT_INTRO =
  "Hi! I'm the Mesh Finance assistant. I can help with home loans, first home buyer questions, refinancing and more, and point you to the right calculator. What can I help you with today?";

const MESH_CHAT_CHIPS = [
  "I'm a first home buyer",
  "Thinking about refinancing",
  "How much can I borrow?",
  "I have a quick question",
];

function ChatWidget({ onNav }) {
  const { useState, useRef, useEffect } = React;
  const isMobile = window.useIsMobile ? window.useIsMobile() : false;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(MESH_CHAT_STORE) || "null");
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {}
    return [{ role: "assistant", content: MESH_CHAT_INTRO }];
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const [leadSending, setLeadSending] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  /* Persist the conversation so it survives page changes (same SPA session). */
  useEffect(() => {
    try {
      localStorage.setItem(MESH_CHAT_STORE, JSON.stringify(messages.slice(-40)));
    } catch {}
  }, [messages]);

  /* Keep the transcript scrolled to the latest message. */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, showLead, streaming]);

  useEffect(() => {
    if (open && !isMobile && inputRef.current) inputRef.current.focus();
  }, [open, isMobile]);

  const transcriptText = () =>
    messages
      .map((m) => (m.role === "user" ? "Visitor: " : "Assistant: ") + m.content)
      .join("\n\n");

  async function send(text) {
    const clean = (text || "").trim();
    if (!clean || streaming) return;
    setShowLead(false);
    const next = [...messages, { role: "user", content: clean }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch(meshChatEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
      if (!acc.trim()) throw new Error("Empty reply");
    } catch (e) {
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "Sorry, I had trouble responding just then. Please try again, or reach Mesh directly on 0416 291 241 or hello@meshfinance.com.au.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  function bookCall() {
    setOpen(false);
    if (onNav) onNav("contact");
  }

  /* Render assistant text, turning [label](url) into clickable links. Internal
     links (starting with "/") navigate within the app via onNav (no reload);
     external links open in a new tab. */
  function renderRich(text) {
    if (!text) return null;
    const parts = [];
    const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    let last = 0, m, key = 0;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      const label = m[1];
      const url = m[2];
      if (/^https?:\/\//i.test(url)) {
        parts.push(
          <a key={key++} href={url} target="_blank" rel="noopener noreferrer" style={cw.link}>{label}</a>
        );
      } else {
        const slug = url.replace(/^\//, "");
        parts.push(
          <a
            key={key++}
            href={url}
            style={cw.link}
            onClick={(e) => {
              e.preventDefault();
              if (onNav) onNav(slug);
              if (isMobile) setOpen(false);
            }}
          >{label}</a>
        );
      }
      last = re.lastIndex;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  }

  function fireLeadTracking() {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", {
          send_to: "AW-18158180693/nDPBCJ2ykNgcENWyv9JD",
          value: 1.0,
          currency: "AUD",
        });
      }
    } catch {}
    try {
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", { value: 1.0, currency: "AUD" });
      }
    } catch {}
  }

  async function submitLead(e) {
    e.preventDefault();
    if (leadSending) return;
    setLeadSending(true);
    const form = e.target;
    let ok = false;
    try {
      ok = await window.MeshSubmitForm(form);
    } catch {}
    setLeadSending(false);
    if (ok) {
      fireLeadTracking();
      setLeadDone(true);
      setShowLead(false);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Thanks, I've passed your details to Chanel. She'll be in touch soon. Anything else I can help with in the meantime?",
        },
      ]);
    }
  }

  function resetChat() {
    setMessages([{ role: "assistant", content: MESH_CHAT_INTRO }]);
    setLeadDone(false);
    setShowLead(false);
    try {
      localStorage.removeItem(MESH_CHAT_STORE);
    } catch {}
  }

  const showChips = messages.length <= 1 && !streaming;
  const lastIsEmptyAssistant =
    streaming &&
    messages.length &&
    messages[messages.length - 1].role === "assistant" &&
    !messages[messages.length - 1].content;

  const panelStyle = isMobile
    ? cw.panelMobile
    : cw.panel;

  return (
    <div>
      <MeshChatStyle />

      {/* Launcher bubble */}
      {!open && (
        <button
          type="button"
          aria-label="Open chat with Mesh Finance"
          style={cw.launcher}
          onClick={() => setOpen(true)}
        >
          <ChatBubbleIcon />
          <span style={cw.launcherDot} />
        </button>
      )}

      {open && (
        <div style={panelStyle} role="dialog" aria-label="Mesh Finance chat">
          {/* Header */}
          <div style={cw.header}>
            <div style={cw.headerLeft}>
              <div style={cw.avatar}>M</div>
              <div>
                <div style={cw.headerTitle}>Mesh Finance</div>
                <div style={cw.headerSub}>
                  <span style={cw.online} /> Ask us anything
                </div>
              </div>
            </div>
            <div style={cw.headerActions}>
              <button
                type="button"
                aria-label="Start a new chat"
                title="New chat"
                style={cw.iconBtn}
                onClick={resetChat}
              >
                <RefreshIcon />
              </button>
              <button
                type="button"
                aria-label="Close chat"
                title="Close"
                style={cw.iconBtn}
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={cw.body} ref={scrollRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...cw.row,
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    ...cw.bubble,
                    ...(m.role === "user" ? cw.bubbleUser : cw.bubbleBot),
                  }}
                >
                  {m.role === "assistant" ? renderRich(m.content) : m.content}
                  {lastIsEmptyAssistant && i === messages.length - 1 && (
                    <span style={cw.typing}>
                      <span className="mesh-dot" />
                      <span className="mesh-dot" />
                      <span className="mesh-dot" />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {showChips && (
              <div style={cw.chips}>
                {MESH_CHAT_CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    style={cw.chip}
                    onClick={() => send(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Lead form */}
            {showLead && !leadDone && (
              <form style={cw.leadForm} onSubmit={submitLead}>
                <div style={cw.leadTitle}>Leave your details and Chanel will be in touch</div>
                <input type="hidden" name="_subject" value="New chat lead — website assistant" />
                <input type="hidden" name="source" value="Website chat assistant" />
                <input type="hidden" name="transcript" value={transcriptText()} />
                <input style={cw.leadInput} name="name" placeholder="Your name" required />
                <input style={cw.leadInput} name="email" type="email" placeholder="Email" required />
                <input style={cw.leadInput} name="phone" type="tel" placeholder="Phone" />
                <textarea
                  style={{ ...cw.leadInput, minHeight: 56, resize: "vertical" }}
                  name="message"
                  placeholder="Anything you'd like Chanel to know? (optional)"
                />
                <div style={cw.leadRow}>
                  <button type="submit" style={cw.leadSubmit} disabled={leadSending}>
                    {leadSending ? "Sending..." : "Send my details"}
                  </button>
                  <button
                    type="button"
                    style={cw.leadCancel}
                    onClick={() => setShowLead(false)}
                  >
                    Cancel
                  </button>
                </div>
                <div style={cw.leadNote}>
                  We'll only use these details to contact you about your enquiry.
                </div>
              </form>
            )}
          </div>

          {/* Actions + input */}
          <div style={cw.footer}>
            <div style={cw.actionRow}>
              <button type="button" style={cw.bookBtn} onClick={bookCall}>
                📅 Book a free call
              </button>
              {!showLead && !leadDone && (
                <button
                  type="button"
                  style={cw.detailsBtn}
                  onClick={() => setShowLead(true)}
                >
                  Leave your details
                </button>
              )}
            </div>

            <form
              style={cw.inputRow}
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                ref={inputRef}
                style={cw.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                aria-label="Type your message"
                disabled={streaming}
              />
              <button
                type="submit"
                style={{ ...cw.sendBtn, opacity: streaming || !input.trim() ? 0.5 : 1 }}
                disabled={streaming || !input.trim()}
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </form>

            <div style={cw.disclaimer}>
              General information only, not personal credit advice. For advice about
              your situation, book a chat with Chanel.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Inline icons (keeps the widget self-contained) ---- */
function ChatBubbleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.1A8.38 8.38 0 0 1 4 12 8.5 8.5 0 0 1 12.5 3.5 8.38 8.38 0 0 1 21 11.5Z"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function RefreshIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4 20-7Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* One-time injected CSS for the typing dots + custom scrollbar. */
function MeshChatStyle() {
  return (
    <style>{`
      @keyframes meshBlink { 0%,80%,100%{opacity:.25} 40%{opacity:1} }
      .mesh-dot{display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;
        background:var(--navy-700,#102a43);animation:meshBlink 1.2s infinite both}
      .mesh-dot:nth-child(2){animation-delay:.2s}
      .mesh-dot:nth-child(3){animation-delay:.4s}
    `}</style>
  );
}

const SHADOW = "0 18px 48px -12px rgba(16,42,67,.45)";
const cw = {
  launcher: {
    position: "fixed", right: 22, bottom: 22, zIndex: 2147483000,
    width: 60, height: 60, borderRadius: "50%", border: "none", cursor: "pointer",
    background: "var(--blue-500,#3898e0)", boxShadow: SHADOW,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  launcherDot: {
    position: "absolute", top: 12, right: 12, width: 11, height: 11,
    borderRadius: "50%", background: "var(--green-500,#2e9e5b)", border: "2px solid #fff",
  },
  panel: {
    position: "fixed", right: 22, bottom: 22, zIndex: 2147483000,
    width: 384, height: 588, maxHeight: "calc(100vh - 44px)",
    background: "#fff", borderRadius: 18, boxShadow: SHADOW, overflow: "hidden",
    display: "flex", flexDirection: "column",
    fontFamily: "var(--font-body, system-ui, sans-serif)",
    border: "1px solid rgba(16,42,67,.08)",
  },
  panelMobile: {
    position: "fixed", inset: 0, zIndex: 2147483000,
    width: "100%", height: "100%", background: "#fff",
    display: "flex", flexDirection: "column",
    fontFamily: "var(--font-body, system-ui, sans-serif)",
  },
  header: {
    background: "linear-gradient(135deg, var(--navy-800,#0b2237), var(--navy-700,#102a43))",
    color: "#fff", padding: "14px 16px", display: "flex",
    alignItems: "center", justifyContent: "space-between", flexShrink: 0,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 11 },
  avatar: {
    width: 38, height: 38, borderRadius: "50%", background: "var(--blue-500,#3898e0)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontFamily: "var(--font-display, inherit)", fontSize: 18,
  },
  headerTitle: { fontWeight: 700, fontSize: 15.5, fontFamily: "var(--font-display, inherit)" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,.72)", display: "flex", alignItems: "center", gap: 6, marginTop: 1 },
  online: { width: 7, height: 7, borderRadius: "50%", background: "var(--green-500,#2e9e5b)", display: "inline-block" },
  headerActions: { display: "flex", gap: 4 },
  iconBtn: {
    width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
    background: "rgba(255,255,255,.12)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  body: {
    flex: 1, overflowY: "auto", padding: "16px 14px",
    background: "var(--surface-page, #f6f8fb)", display: "flex", flexDirection: "column", gap: 10,
  },
  row: { display: "flex", width: "100%" },
  bubble: {
    maxWidth: "82%", padding: "10px 13px", borderRadius: 14, fontSize: 14.2,
    lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word",
  },
  bubbleBot: {
    background: "#fff", color: "var(--navy-700,#102a43)",
    border: "1px solid rgba(16,42,67,.08)", borderBottomLeftRadius: 4,
    boxShadow: "0 1px 2px rgba(16,42,67,.05)",
  },
  bubbleUser: {
    background: "var(--blue-500,#3898e0)", color: "#fff", borderBottomRightRadius: 4,
  },
  link: {
    color: "var(--blue-500,#3898e0)", fontWeight: 600, textDecoration: "underline",
    cursor: "pointer", wordBreak: "break-word",
  },
  typing: { display: "inline-flex", alignItems: "center", marginLeft: 2, verticalAlign: "middle" },
  chips: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 },
  chip: {
    background: "#fff", border: "1px solid var(--blue-500,#3898e0)", color: "var(--blue-500,#3898e0)",
    borderRadius: 999, padding: "7px 13px", fontSize: 13, cursor: "pointer", fontWeight: 600,
  },
  leadForm: {
    background: "#fff", border: "1px solid rgba(16,42,67,.1)", borderRadius: 14,
    padding: 14, display: "flex", flexDirection: "column", gap: 8, marginTop: 4,
  },
  leadTitle: { fontWeight: 700, fontSize: 13.5, color: "var(--navy-700,#102a43)", marginBottom: 2 },
  leadInput: {
    border: "1px solid rgba(16,42,67,.18)", borderRadius: 9, padding: "9px 11px",
    fontSize: 14, fontFamily: "inherit", width: "100%",
  },
  leadRow: { display: "flex", gap: 8, marginTop: 2 },
  leadSubmit: {
    background: "var(--green-500,#2e9e5b)", color: "#fff", border: "none", borderRadius: 9,
    padding: "9px 14px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", flex: 1,
  },
  leadCancel: {
    background: "transparent", color: "var(--navy-700,#102a43)", border: "1px solid rgba(16,42,67,.2)",
    borderRadius: 9, padding: "9px 14px", fontSize: 13.5, cursor: "pointer",
  },
  leadNote: { fontSize: 11, color: "rgba(16,42,67,.55)", marginTop: 2 },
  footer: {
    borderTop: "1px solid rgba(16,42,67,.08)", padding: "10px 12px",
    background: "#fff", flexShrink: 0,
  },
  actionRow: { display: "flex", gap: 8, marginBottom: 9 },
  bookBtn: {
    background: "var(--green-500,#2e9e5b)", color: "#fff", border: "none", borderRadius: 10,
    padding: "9px 12px", fontSize: 13.2, fontWeight: 700, cursor: "pointer", flex: 1,
  },
  detailsBtn: {
    background: "var(--surface-page,#eef3f8)", color: "var(--navy-700,#102a43)", border: "none",
    borderRadius: 10, padding: "9px 12px", fontSize: 13.2, fontWeight: 600, cursor: "pointer",
  },
  inputRow: { display: "flex", gap: 8, alignItems: "center" },
  input: {
    flex: 1, border: "1px solid rgba(16,42,67,.18)", borderRadius: 999, padding: "10px 15px",
    fontSize: 14, fontFamily: "inherit", outline: "none",
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: "50%", border: "none", cursor: "pointer",
    background: "var(--blue-500,#3898e0)", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  disclaimer: { fontSize: 10.5, color: "rgba(16,42,67,.5)", marginTop: 8, lineHeight: 1.4, textAlign: "center" },
};

Object.assign(window, { MeshChatWidget: ChatWidget });

/* Mesh Finance chat backend — a single Vercel serverless function.
 *
 * It holds the Anthropic API key (as the ANTHROPIC_API_KEY env var in Vercel,
 * never in the browser), relays the visitor's conversation to Claude, and
 * streams the reply back as plain text. The website's ChatWidget talks only to
 * this endpoint; it never sees the key.
 *
 * Deploy: set Vercel's project Root Directory to `chat-api/`. Set the env var
 * ANTHROPIC_API_KEY in the Vercel dashboard. The function is served at
 * https://<your-project>.vercel.app/api/chat
 */

const _A = require("@anthropic-ai/sdk");
const Anthropic = _A.default || _A;
const { SYSTEM_PROMPT } = require("../system-prompt.js");

/* Only these origins may call the endpoint (keeps other sites off your key). */
const ALLOWED_ORIGINS = [
  "https://meshfinance.com.au",
  "https://www.meshfinance.com.au",
  "https://meshfinance.networkdynamics.dev",
];

/* Guardrails on request size (bounds cost + blocks abuse). */
const MAX_MESSAGES = 30;         // messages kept per conversation
const MAX_CHARS_PER_MSG = 2000;  // one message
const MAX_TOTAL_CHARS = 20000;   // whole transcript
const MAX_OUTPUT_TOKENS = 800;   // reply length cap

/* Best-effort in-memory rate limit (per warm instance). Not bulletproof on
   serverless, but combined with the size + token caps it keeps the blast radius
   of any single abuser tiny. Upgrade to Upstash/Vercel KV if you ever need a
   hard, shared limit. */
const RL_WINDOW_MS = 60 * 1000;
const RL_MAX = 20; // requests per IP per window
const rlHits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (rlHits.get(ip) || []).filter((t) => now - t < RL_WINDOW_MS);
  arr.push(now);
  rlHits.set(ip, arr);
  if (rlHits.size > 5000) rlHits.clear(); // cheap memory guard
  return arr.length > RL_MAX;
}

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method === "GET") {
    // Simple health check so you can eyeball that the function is live.
    res.status(200).json({ ok: true, service: "mesh-chat-api" });
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    res.status(403).json({ error: "Origin not allowed" });
    return;
  }

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";
  if (rateLimited(ip)) {
    res.status(429).json({ error: "Too many requests, please slow down." });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: "Server is not configured." });
    return;
  }

  /* Parse + validate the conversation. */
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  const incoming = body && Array.isArray(body.messages) ? body.messages : null;
  if (!incoming || incoming.length === 0) {
    res.status(400).json({ error: "No messages provided." });
    return;
  }

  let total = 0;
  const messages = [];
  for (const m of incoming.slice(-MAX_MESSAGES)) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) continue;
    let content = typeof m.content === "string" ? m.content : "";
    if (!content) continue;
    if (content.length > MAX_CHARS_PER_MSG) content = content.slice(0, MAX_CHARS_PER_MSG);
    total += content.length;
    if (total > MAX_TOTAL_CHARS) break;
    messages.push({ role: m.role, content });
  }
  if (messages.length === 0 || messages[0].role !== "user") {
    // The API requires the first message to be from the user.
    while (messages.length && messages[0].role !== "user") messages.shift();
  }
  if (messages.length === 0) {
    res.status(400).json({ error: "No valid messages." });
    return;
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  /* Stream plain-text deltas back to the widget. */
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  try {
    const stream = client.messages.stream({
      model: "claude-sonnet-5",
      max_tokens: MAX_OUTPUT_TOKENS,
      thinking: { type: "disabled" }, // snappy, cheap replies for a chat UI
      output_config: { effort: "low" },
      system: [
        { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
      ],
      messages,
    });

    stream.on("text", (t) => {
      res.write(t);
    });

    await stream.finalMessage();
    res.end();
  } catch (err) {
    console.error("chat error:", err?.message || err);
    if (!res.headersSent) {
      res.status(502).json({ error: "The assistant is unavailable right now." });
    } else {
      // Already streaming; close the connection so the client can recover.
      res.end();
    }
  }
};

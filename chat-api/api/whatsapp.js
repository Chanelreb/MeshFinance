/* Mesh Finance WhatsApp agent: one Vercel serverless function.
 *
 * Meta's WhatsApp Business Platform (Cloud API) calls this URL whenever someone
 * messages the business number. The function checks Meta's signature, loads the
 * conversation so far, asks Claude for the next reply (giving it two tools:
 * save_lead and handover_to_chanel), sends the reply back through the Cloud API
 * and stores the updated conversation. Leads and handovers go to the same
 * Formspree inbox as the website forms, with the transcript attached.
 *
 *   GET  /api/whatsapp   webhook verification handshake (Meta calls this once)
 *   POST /api/whatsapp   incoming messages and delivery statuses
 *
 * Environment variables (set in the Vercel project, see WHATSAPP-SETUP.md):
 *   ANTHROPIC_API_KEY          Claude
 *   WHATSAPP_TOKEN             permanent system-user access token from Meta
 *   WHATSAPP_PHONE_NUMBER_ID   the business number's id from the WhatsApp setup page
 *   WHATSAPP_VERIFY_TOKEN      any phrase you choose; typed into Meta's webhook form
 *   META_APP_SECRET            from the Meta app's Settings > Basic; signs webhooks
 *   KV_REST_API_URL / KV_REST_API_TOKEN   Upstash Redis (conversation memory)
 *   META_CAPI_TOKEN, META_PIXEL_ID        optional: send a Lead event to Meta
 *   FORMSPREE_ENDPOINT         optional override of the website's form inbox
 */

const crypto = require("crypto");
const _A = require("@anthropic-ai/sdk");
const Anthropic = _A.default || _A;
const store = require("../lib/store.js");
const { WHATSAPP_SYSTEM_PROMPT } = require("../whatsapp-prompt.js");

const GRAPH = "https://graph.facebook.com/" + (process.env.GRAPH_VERSION || "v22.0");
const FORMSPREE = process.env.FORMSPREE_ENDPOINT || "https://formspree.io/f/xnjenagj";
const MODEL = "claude-opus-5-5";

/* Limits. */
const HISTORY_MAX = 30;          // turns remembered per person
const HISTORY_TTL = 7 * 86400;   // seconds a quiet conversation is kept
const MSG_MAX_CHARS = 2000;      // longest inbound message we pass on
const HOURLY_MAX = 40;           // inbound messages per person per hour
const STALE_SECONDS = 15 * 60;   // ignore webhook retries older than this
const WA_TEXT_MAX = 4000;        // WhatsApp caps a text message at 4096 chars

module.exports = async function handler(req, res) {
  if (req.method === "GET") return verify(req, res);
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).end("Method not allowed");
  }

  const raw = await readRawBody(req);
  if (!validSignature(req, raw)) return res.status(403).end("Bad signature");

  let body;
  try { body = JSON.parse(raw.toString("utf8")); } catch { return res.status(200).end(); }
  if (!body || body.object !== "whatsapp_business_account") return res.status(200).end();

  const inbound = [];
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== "messages") continue;
      const v = change.value || {};
      const phoneNumberId = (v.metadata && v.metadata.phone_number_id) || process.env.WHATSAPP_PHONE_NUMBER_ID;
      const names = {};
      for (const c of v.contacts || []) names[c.wa_id] = c.profile && c.profile.name;
      for (const m of v.messages || []) inbound.push({ m, phoneNumberId, profileName: names[m.from] });
      /* v.statuses (sent / delivered / read receipts) need nothing from us. */
    }
  }

  /* Handle everything before answering Meta, so the function is not frozen
     mid-reply. Meta accepts a few seconds of latency and retries on non-200. */
  for (const item of inbound) {
    try { await handleMessage(item); }
    catch (err) { console.error("whatsapp: message failed", item.m && item.m.id, err && err.message); }
  }
  res.status(200).end();
};

/* Vercel: keep the raw body so the signature can be checked, and allow time
   for the model call plus the WhatsApp send. */
module.exports.config = { api: { bodyParser: false }, maxDuration: 60 };

/* ---------- webhook plumbing ---------- */

function verify(req, res) {
  const u = new URL(req.url, "http://localhost");
  const mode = u.searchParams.get("hub.mode");
  const token = u.searchParams.get("hub.verify_token");
  const challenge = u.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).end(challenge || "");
  }
  if (!mode) return res.status(200).json({ ok: true, service: "mesh-whatsapp-agent", store: store.isRemote ? "redis" : "memory" });
  return res.status(403).end("Verification failed");
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body !== undefined) {
      /* A body parser ran anyway (local harness): best effort. */
      return resolve(Buffer.from(typeof req.body === "string" ? req.body : JSON.stringify(req.body)));
    }
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function validSignature(req, raw) {
  const secret = process.env.META_APP_SECRET;
  if (!secret) { console.error("whatsapp: META_APP_SECRET is not set; rejecting webhook"); return false; }
  const header = String(req.headers["x-hub-signature-256"] || "");
  if (!header.startsWith("sha256=")) return false;
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const given = header.slice(7);
  if (given.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given, "hex"), Buffer.from(expected, "hex"));
}

/* ---------- one inbound message ---------- */

async function handleMessage({ m, phoneNumberId, profileName }) {
  const from = m.from;
  if (!from || !m.id) return;

  /* Once only, even if Meta retries the delivery. */
  if (!(await store.claim("wa:seen:" + m.id, 86400))) return;
  /* Old retries after an outage: do not answer hours later. */
  const age = Math.floor(Date.now() / 1000) - Number(m.timestamp || 0);
  if (m.timestamp && age > STALE_SECONDS) return;

  const text = inboundText(m);
  const wa = { phoneNumberId, to: from, messageId: m.id };

  if (text === null) {
    await sendText(wa, "Thanks for that. I can only read typed messages here, so if you can pop it in words I will help straight away, or Chanel can take a look when she is next in.");
    return;
  }

  /* Opt-out and opt-in. */
  const lower = text.trim().toLowerCase();
  const silenceKey = "wa:silent:" + from;
  if (["stop", "unsubscribe", "opt out"].includes(lower)) {
    await store.setJson(silenceKey, true, 365 * 86400);
    await sendText(wa, "No problem, I will not message you again. Reply START any time if you change your mind.");
    return;
  }
  if (await store.getJson(silenceKey)) {
    if (lower === "start") { await store.del(silenceKey); }
    else return;
  }

  /* Rate limit per person. */
  const n = await store.bump("wa:rate:" + from, 3600);
  if (n > HOURLY_MAX) {
    if (n === HOURLY_MAX + 1) await sendText(wa, "I have had a lot of messages from this number in the last hour, so I will pause here. Chanel can pick things up with you directly: 0416 291 241.");
    return;
  }

  await markReadAndTyping(wa);

  const convKey = "wa:conv:" + from;
  const conv = (await store.getJson(convKey)) || { messages: [], profileName: null, lead: null, handover: null, started: new Date().toISOString() };
  if (profileName && !conv.profileName) conv.profileName = profileName;
  conv.messages.push({ role: "user", content: text.slice(0, MSG_MAX_CHARS) });
  conv.messages = conv.messages.slice(-HISTORY_MAX);

  const { reply, events } = await converse(conv, { phone: "+" + from });
  for (const e of events) {
    if (e.type === "lead") conv.lead = e.data;
    if (e.type === "handover") conv.handover = e.data;
  }
  if (reply) conv.messages.push({ role: "assistant", content: reply });
  await store.setJson(convKey, conv, HISTORY_TTL);

  for (const part of splitForWhatsApp(reply || "Sorry, I lost my train of thought. Could you send that again?")) {
    await sendText(wa, part);
  }
}

function inboundText(m) {
  switch (m.type) {
    case "text": return (m.text && m.text.body) || "";
    case "button": return (m.button && m.button.text) || "";
    case "interactive": {
      const i = m.interactive || {};
      if (i.button_reply) return i.button_reply.title || "";
      if (i.list_reply) return [i.list_reply.title, i.list_reply.description].filter(Boolean).join(": ");
      return "";
    }
    case "reaction": return null;
    default: return null; // image, audio, document, sticker, location, contacts
  }
}

/* ---------- the brain ---------- */

const TOOLS = [
  {
    name: "save_lead",
    description: "Record this person as a lead for Chanel. Call as soon as you know their first name and what they are hoping to do. Call again later only if something important changes.",
    strict: true,
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["name", "goal", "summary"],
      properties: {
        name: { type: "string", description: "Their name as they gave it." },
        goal: { type: "string", enum: ["first home", "upgrade", "refinance or review", "debt consolidation", "investment", "car or personal loan", "self-employed or business", "other"] },
        timeframe: { type: "string", description: "When they want to act, in their words, or an empty string." },
        suburb: { type: "string", description: "Suburb or area if mentioned, else an empty string." },
        summary: { type: "string", description: "One or two sentences Chanel can read in ten seconds." },
        best_time: { type: "string", description: "Best time to contact them if given, else an empty string." },
      },
    },
  },
  {
    name: "handover_to_chanel",
    description: "Alert Chanel that this person needs her personally: they asked for a human or a call, they are in hardship or distressed, it is a complaint or an existing client matter, or you could not answer confidently.",
    strict: true,
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["reason", "summary"],
      properties: {
        reason: { type: "string", enum: ["asked for a person", "wants a call", "hardship", "complaint", "existing client", "could not answer", "other"] },
        summary: { type: "string", description: "What they need, in one or two sentences." },
        best_time: { type: "string", description: "Best time to call if given, else an empty string." },
      },
    },
  },
];

/* Runs Claude over the conversation, executes any tool calls, and returns the
   text to send plus a list of side effects that happened (lead, handover). */
async function converse(conv, ctx) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const events = [];
  const messages = conv.messages.map((m) => ({ role: m.role, content: m.content }));
  while (messages.length && messages[0].role !== "user") messages.shift();

  /* The current Perth time goes in as a mid-conversation system message so the
     long system prompt stays byte-identical and cached. */
  const perthNow = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Perth", weekday: "long", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date());
  const facts = ["Now in Perth: " + perthNow + "."];
  if (conv.profileName) facts.push("WhatsApp profile name: " + conv.profileName + " (may be a nickname; confirm before using).");
  if (conv.lead) facts.push("A lead has already been saved for this person: " + conv.lead.summary);
  if (conv.handover) facts.push("Chanel has already been alerted to this conversation (" + conv.handover.reason + ").");
  const turnNote = { role: "system", content: facts.join(" ") };

  const base = {
    model: MODEL,
    max_tokens: 1024,
    output_config: { effort: "low" },
    system: [{ type: "text", text: WHATSAPP_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    tools: TOOLS,
  };

  let reply = "";
  for (let round = 0; round < 4; round++) {
    const response = await createWithFallbacks(client, { ...base, messages: [...messages, turnNote] });

    if (response.stop_reason === "refusal") {
      reply = "That is one for Chanel rather than me. I have let her know, and she will be in touch. If it is urgent, call 0416 291 241.";
      events.push({ type: "handover", data: await notifyHandover(conv, ctx, { reason: "could not answer", summary: "Assistant declined to answer; needs a human reply.", best_time: "" }) });
      break;
    }

    const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    if (text) reply = reply ? reply + "\n\n" + text : text;

    const toolUses = response.content.filter((b) => b.type === "tool_use");
    if (response.stop_reason !== "tool_use" || toolUses.length === 0) break;

    messages.push({ role: "assistant", content: response.content });
    const results = [];
    for (const t of toolUses) {
      let out;
      try {
        if (t.name === "save_lead") {
          const data = await notifyLead(conv, ctx, t.input);
          events.push({ type: "lead", data });
          out = "Lead saved and emailed to Chanel.";
        } else if (t.name === "handover_to_chanel") {
          const data = await notifyHandover(conv, ctx, t.input);
          events.push({ type: "handover", data });
          out = "Chanel has been alerted by email.";
        } else {
          out = "Unknown tool.";
        }
      } catch (err) {
        console.error("whatsapp: tool failed", t.name, err && err.message);
        out = "The alert could not be sent just now. Tell the person Chanel will still follow up, and give the phone number 0416 291 241.";
      }
      results.push({ type: "tool_result", tool_use_id: t.id, content: out });
    }
    messages.push({ role: "user", content: results });
  }

  return { reply: plainForWhatsApp(reply), events };
}

/* Opus 5.5 with Anthropic's server-side refusal fallbacks switched on, so a
   safety-classifier decline is retried on a fallback model inside the same
   call. Falls back to a plain request if the account cannot use the beta. */
async function createWithFallbacks(client, params) {
  try {
    return await client.beta.messages.create({ ...params, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" });
  } catch (err) {
    if (err && err.status === 400 && /fallback/i.test(err.message || "")) {
      return client.messages.create(params);
    }
    throw err;
  }
}

/* ---------- side effects: email Chanel, tell Meta ---------- */

function transcript(conv) {
  return conv.messages.map((m) => (m.role === "user" ? "Customer: " : "Assistant: ") + m.content).join("\n");
}

async function postForm(fields) {
  if (process.env.WHATSAPP_DRY_RUN) { console.log("  [email to Chanel] " + fields._subject); return; }
  const res = await fetch(FORMSPREE, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error("formspree " + res.status);
}

async function notifyLead(conv, ctx, input) {
  const data = { ...input, phone: ctx.phone, at: new Date().toISOString() };
  await postForm({
    _subject: "WhatsApp lead: " + input.name + " (" + input.goal + ")",
    source: "WhatsApp agent",
    name: input.name,
    phone: ctx.phone,
    goal: input.goal,
    timeframe: input.timeframe || "",
    suburb: input.suburb || "",
    best_time: input.best_time || "",
    summary: input.summary,
    transcript: transcript(conv),
  });
  await metaLead(ctx.phone, input.goal).catch((e) => console.error("whatsapp: meta lead", e && e.message));
  return data;
}

async function notifyHandover(conv, ctx, input) {
  const data = { ...input, phone: ctx.phone, at: new Date().toISOString() };
  await postForm({
    _subject: "WhatsApp handover: " + input.reason + " (" + ctx.phone + ")",
    source: "WhatsApp agent",
    phone: ctx.phone,
    name: (conv.lead && conv.lead.name) || conv.profileName || "",
    reason: input.reason,
    best_time: input.best_time || "",
    summary: input.summary,
    transcript: transcript(conv),
  });
  return data;
}

/* Optional Conversions API event, mirroring the website's Lead event. Needs a
   system-user token with access to the dataset. Phone is hashed as Meta
   requires. */
async function metaLead(phone, goal) {
  const token = process.env.META_CAPI_TOKEN;
  const pixel = process.env.META_PIXEL_ID || "1364666885761207";
  if (!token) return;
  const ph = crypto.createHash("sha256").update(phone.replace(/\D/g, "")).digest("hex");
  const res = await fetch(GRAPH + "/" + pixel + "/events?access_token=" + encodeURIComponent(token), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "chat",
      user_data: { ph: [ph] },
      custom_data: { content_name: "WhatsApp agent", content_category: goal },
    }] }),
  });
  if (!res.ok) throw new Error("capi " + res.status + " " + (await res.text()).slice(0, 200));
}

async function graph(path, payload) {
  const res = await fetch(GRAPH + "/" + path, {
    method: "POST",
    headers: { Authorization: "Bearer " + process.env.WHATSAPP_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("graph " + res.status + " " + (await res.text()).slice(0, 300));
  return res.json();
}

async function sendText(wa, body) {
  return graph(wa.phoneNumberId + "/messages", {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: wa.to,
    type: "text",
    text: { preview_url: true, body },
  });
}

/* Blue ticks plus the "typing" dots while Claude thinks. Best effort. */
async function markReadAndTyping(wa) {
  try {
    await graph(wa.phoneNumberId + "/messages", {
      messaging_product: "whatsapp",
      status: "read",
      message_id: wa.messageId,
      typing_indicator: { type: "text" },
    });
  } catch (err) { console.warn("whatsapp: read receipt", err && err.message); }
}

/* ---------- text shaping ---------- */

function plainForWhatsApp(s) {
  return String(s || "")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "$1: $2") // [text](url) -> text: url
    .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, "$1: https://meshfinance.com.au$2")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/[–—]/g, ", ")
    .trim();
}

function splitForWhatsApp(s) {
  const parts = [];
  let rest = String(s);
  while (rest.length > WA_TEXT_MAX) {
    let cut = rest.lastIndexOf("\n", WA_TEXT_MAX);
    if (cut < WA_TEXT_MAX / 2) cut = rest.lastIndexOf(" ", WA_TEXT_MAX);
    if (cut < WA_TEXT_MAX / 2) cut = WA_TEXT_MAX;
    parts.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

/* Exposed for the local test harness (scripts/whatsapp-chat.js). */
module.exports.converse = converse;
module.exports.plainForWhatsApp = plainForWhatsApp;

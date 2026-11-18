/* Tiny key-value store for the WhatsApp agent: conversation history, seen
 * message ids, rate limits and opt-outs.
 *
 * In production it talks to an Upstash Redis database over its REST API (the
 * Vercel Marketplace "Upstash Redis" integration sets KV_REST_API_URL and
 * KV_REST_API_TOKEN automatically; the UPSTASH_* names are accepted too). No
 * client library is needed: every command is one HTTPS POST.
 *
 * Without those variables it falls back to process memory, which works for
 * local testing and survives only as long as the serverless instance is warm.
 */

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const remote = Boolean(URL_ && TOKEN);

const mem = new Map(); // key -> { value, expires }
function memGet(key) {
  const e = mem.get(key);
  if (!e) return null;
  if (e.expires && e.expires < Date.now()) { mem.delete(key); return null; }
  return e.value;
}
function memSet(key, value, ttlSeconds) {
  mem.set(key, { value, expires: ttlSeconds ? Date.now() + ttlSeconds * 1000 : 0 });
  if (mem.size > 10000) mem.clear(); // cheap memory guard
}

async function redis(...command) {
  const res = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(command.map(String)),
  });
  if (!res.ok) throw new Error("store: " + res.status + " " + (await res.text()).slice(0, 200));
  const data = await res.json();
  if (data.error) throw new Error("store: " + data.error);
  return data.result;
}

/* JSON values. */
async function getJson(key) {
  if (!remote) return memGet(key);
  const raw = await redis("GET", key);
  if (raw == null) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
async function setJson(key, value, ttlSeconds) {
  if (!remote) return memSet(key, value, ttlSeconds);
  const args = ["SET", key, JSON.stringify(value)];
  if (ttlSeconds) args.push("EX", ttlSeconds);
  await redis(...args);
}
async function del(key) {
  if (!remote) { mem.delete(key); return; }
  await redis("DEL", key);
}

/* Returns true the first time a key is claimed, false if it already existed.
   Used to make sure each WhatsApp message is handled once even when Meta
   retries the webhook. */
async function claim(key, ttlSeconds) {
  if (!remote) {
    if (memGet(key)) return false;
    memSet(key, 1, ttlSeconds);
    return true;
  }
  const r = await redis("SET", key, "1", "EX", ttlSeconds, "NX");
  return r === "OK";
}

/* Increments a counter that expires ttlSeconds after it was first touched. */
async function bump(key, ttlSeconds) {
  if (!remote) {
    const n = (memGet(key) || 0) + 1;
    const e = mem.get(key);
    mem.set(key, { value: n, expires: e && e.expires ? e.expires : Date.now() + ttlSeconds * 1000 });
    return n;
  }
  const n = await redis("INCR", key);
  if (n === 1) await redis("EXPIRE", key, ttlSeconds);
  return n;
}

module.exports = { getJson, setJson, del, claim, bump, isRemote: remote };

/* Talk to the WhatsApp agent's brain from the terminal, without WhatsApp or
 * Meta involved. Useful for trying wording changes in whatsapp-prompt.js.
 *
 *   cd chat-api
 *   set ANTHROPIC_API_KEY=...   (PowerShell: $env:ANTHROPIC_API_KEY="...")
 *   node scripts/whatsapp-chat.js
 *
 * Leads and handovers are printed here instead of being emailed. Run with
 * WHATSAPP_DRY_RUN unset and FORMSPREE_ENDPOINT set to test the email path.
 */

if (!process.env.FORMSPREE_ENDPOINT) process.env.WHATSAPP_DRY_RUN = "1";

const readline = require("readline");
const { converse } = require("../api/whatsapp.js");

const conv = { messages: [], profileName: process.env.WA_NAME || null, lead: null, handover: null };
const ctx = { phone: "+61400000000" };
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("Mesh WhatsApp agent (local). Type a message, or 'quit'.\n");
function ask() {
  rl.question("You: ", async (line) => {
    const text = line.trim();
    if (!text) return ask();
    if (text === "quit") { rl.close(); return; }
    conv.messages.push({ role: "user", content: text });
    try {
      const { reply, events } = await converse(conv, ctx);
      for (const e of events) {
        if (e.type === "lead") conv.lead = e.data;
        if (e.type === "handover") conv.handover = e.data;
        console.log("  [" + e.type + "] " + JSON.stringify(e.data));
      }
      conv.messages.push({ role: "assistant", content: reply });
      console.log("Agent: " + reply + "\n");
    } catch (err) {
      console.error("error:", err && err.message);
    }
    ask();
  });
}
ask();

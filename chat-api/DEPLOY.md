# Deploying the Mesh Finance chat backend (Vercel)

This folder (`chat-api/`) is a small serverless backend for the website chat
assistant. It holds the Anthropic API key and relays visitor messages to Claude.
It deploys to Vercel, separately from the main website (which keeps deploying the
way it already does). Nothing here ever ships to the website host.

## What you need
- A free Vercel account (vercel.com)
- Your Anthropic API key (from console.anthropic.com)
- This repo already on GitHub (github.com/Chanelreb/MeshFinance)

## One-time setup

1. Go to **vercel.com** and sign up / log in (the "Continue with GitHub" option
   is easiest, then Vercel can see your repos).
2. Click **Add New... > Project**.
3. Find **MeshFinance** in the list and click **Import**.
4. On the configure screen, set **Root Directory** to **`chat-api`**
   (click "Edit" next to Root Directory, pick the `chat-api` folder).
   This tells Vercel to deploy only the chat backend, not the whole site.
5. Leave Framework Preset as **Other**. Build/output settings can stay default.
6. Open **Environment Variables** and add one:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** paste your Anthropic API key
   - Apply to all environments (Production, Preview, Development).
7. Click **Deploy** and wait for it to finish.
8. Vercel gives you a URL like `https://mesh-finance-xxxx.vercel.app`.
   Your chat endpoint is that URL with `/api/chat` on the end, e.g.
   `https://mesh-finance-xxxx.vercel.app/api/chat`.
9. Send that full `/api/chat` URL to Claude. Claude wires the website widget to
   it, pushes to staging to test, and then you push live as usual.

## Testing the endpoint yourself (optional)
Open the base Vercel URL in a browser: you should see a 404 or a small message
(there is no home page, only `/api/chat`). That is normal. The real test is the
chat widget on the site once it is wired up.

## Updating later
- To change what the assistant knows or how it behaves, edit
  `chat-api/system-prompt.js`, commit, and push. Vercel redeploys automatically.
- The model is set in `chat-api/api/chat.js` (`claude-sonnet-5`). Change it there
  if you ever want a cheaper (Haiku) or smarter (Opus) model.

## Cost
Each conversation costs roughly 1 to 3 cents on Sonnet 5. The function caps reply
length and rate-limits requests to keep costs predictable.

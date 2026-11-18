# Mesh Finance WhatsApp agent: setup walkthrough

The agent is the file `api/whatsapp.js` in this folder, deployed as part of the
same Vercel project as the website chat (`mesh-finance`, Root Directory
`chat-api`). Its behaviour is the plain-English file `whatsapp-prompt.js`.

Once this walkthrough is done, anyone who messages the business WhatsApp
number gets an answer within a few seconds, any hour. Qualified enquiries and
handover requests arrive in the same inbox as website form leads, with the
transcript attached.

Allow about 45 minutes the first time. You will finish with five values to
paste into Vercel. Keep a notepad open.

## Part A: Meta side

### 1. Create the Meta app

1. Go to https://developers.facebook.com/apps and sign in with the Facebook
   login that manages the Mesh Finance business portfolio (the one you use for
   Events Manager).
2. Click **Create App**.
3. Use case: choose **Other**, then **Next**.
4. App type: **Business**, then **Next**.
5. App name: `Mesh Finance WhatsApp`. Contact email: your Mesh address.
   Business portfolio: pick **Mesh Finance**. Click **Create app**.
6. On the app dashboard, find **WhatsApp** in the product list and click
   **Set up**.

### 2. Get the App Secret (value 1 of 5)

1. In the left menu click **App settings**, then **Basic**.
2. Next to **App secret** click **Show**, confirm your password, and copy the
   value. Note it as `META_APP_SECRET`.

### 3. Add the business phone number

1. In the left menu click **WhatsApp**, then **API Setup**.
2. Meta gives you a free **test number** here. Leave it; it is handy for a
   first test (step 12).
3. Click **Add phone number**.
4. Business display name: `Mesh Finance`. Category: **Finance**. Description
   optional. Website: `https://meshfinance.com.au`.
5. Enter the VoIP number from the CRM. For the verification method choose
   **Phone call**, since VoIP numbers often cannot receive SMS. Click **Next**.
6. Answer the call on the CRM softphone, write down the six-digit code, and
   type it in.

   If the call does not come through within two minutes, try once more. If it
   still fails, the number's provider blocks verification calls. Use a cheap
   prepaid mobile SIM instead. Nothing else changes.

7. Important: that number must not be signed in to the WhatsApp app on any
   phone. If it is, open that app first, go to Settings, Account, Delete
   account, then come back and add the number.

### 4. Copy the Phone number ID (value 2 of 5)

1. Still on **API Setup**, in the **From** dropdown pick the Mesh number you
   just added.
2. Under it you will see **Phone number ID**. Copy it. Note it as
   `WHATSAPP_PHONE_NUMBER_ID`.

### 5. Create a permanent access token (value 3 of 5)

The token shown on API Setup expires in 24 hours. The agent needs one that
does not.

1. Open https://business.facebook.com/settings in a new tab (Business
   Settings for the Mesh Finance portfolio).
2. In the left menu under **Users** click **System users**, then **Add**.
3. Name: `whatsapp-agent`. Role: **Admin**. Click **Create system user**.
4. With the new system user selected, click **Add assets**.
   - Choose **Apps**, tick **Mesh Finance WhatsApp**, switch on **Manage app**.
     Save.
   - Click **Add assets** again, choose **WhatsApp accounts**, tick the Mesh
     Finance WhatsApp account, switch on **Manage WhatsApp account**. Save.
5. Click **Generate new token**.
   - App: **Mesh Finance WhatsApp**.
   - Token expiration: **Never**.
   - Permissions: tick `whatsapp_business_messaging` and
     `whatsapp_business_management`.
   - Click **Generate token**, copy it, and note it as `WHATSAPP_TOKEN`.
     Meta only shows it once.

### 6. Choose a verify token (value 4 of 5)

This is just a password you make up so Meta can prove it is talking to our
server. Pick a long phrase, for example `mesh-wa-2026-kookaburra-telescope`.
Note it as `WHATSAPP_VERIFY_TOKEN`. You will type it into Meta in step 9.

## Part B: Vercel side

### 7. Add conversation memory (Upstash Redis)

The agent remembers each conversation for seven days so people can reply later
and it still knows the context.

1. Go to https://vercel.com, open the **mesh-finance** project.
2. Click the **Storage** tab, then **Create Database** (or **Browse
   Marketplace**).
3. Choose **Upstash**, then **Redis**. Plan: **Free**. Region: **Sydney**
   (`ap-southeast-2`) or the closest offered.
4. Click **Create**, then **Connect Project**, keep all environments ticked,
   and confirm.

   This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` to the project for you.

### 8. Add the five values

1. In the same project click **Settings**, then **Environment Variables**.
2. Add each of these (Key, then Value, leave all environments ticked, Save):

   | Key | Value |
   |---|---|
   | `WHATSAPP_TOKEN` | from step 5 |
   | `WHATSAPP_PHONE_NUMBER_ID` | from step 4 |
   | `WHATSAPP_VERIFY_TOKEN` | the phrase from step 6 |
   | `META_APP_SECRET` | from step 2 |
   | `ANTHROPIC_API_KEY` | already set for the website chat; nothing to do |

3. Open the **Deployments** tab, click the three dots on the latest
   deployment, choose **Redeploy**, and wait for it to finish. New variables
   only apply to a fresh deployment.
4. Check it is live: open
   `https://mesh-finance-git-main-scw3.vercel.app/api/whatsapp` in a browser.
   You should see `{"ok":true,"service":"mesh-whatsapp-agent","store":"redis"}`.
   If `store` says `memory`, the Upstash variables are missing; repeat step 7.

## Part C: Connect the two

### 9. Point Meta at the agent

1. Back in https://developers.facebook.com, open the app, then **WhatsApp**,
   then **Configuration**.
2. Under **Webhook** click **Edit**.
   - Callback URL: `https://mesh-finance-git-main-scw3.vercel.app/api/whatsapp`
   - Verify token: the phrase from step 6, exactly.
   - Click **Verify and save**. If it says the token is wrong, check for a
     stray space in Vercel and that you redeployed.
3. Under **Webhook fields** click **Manage**, find **messages**, tick
   **Subscribe**, and click **Done**.

### 10. Turn on business messaging

1. Go to **App settings**, **Basic**. Fill in **Privacy policy URL**:
   `https://meshfinance.com.au/privacy-policy`. Save.
2. At the top of the dashboard switch **App Mode** from **Development** to
   **Live**. Until this is Live, only up to five test numbers can message
   the agent.
3. Meta may ask for **Business verification** if the Mesh Finance portfolio
   has not been verified before. Follow the prompts (ABN plus a document
   showing the business name and address). It can take a few days. The agent
   keeps working for test numbers meanwhile.

### 11. Approve the display name

On **WhatsApp**, **Phone numbers**, the Mesh number shows a display name
status. **Approved** usually comes within a day. Until then recipients see
the raw number instead of "Mesh Finance".

## Part D: Test

### 12. First conversation

1. On **WhatsApp**, **API Setup**, under **To**, add your own mobile number
   and confirm the code it sends you.
2. From your own phone, send a WhatsApp message to the Mesh business number
   (or the test number if the real one is not verified yet). Try: "Hi, we're
   thinking about refinancing".
3. Within a few seconds you should get a reply, a question back, and after a
   couple of exchanges the Home Loan Review booking link.
4. Ask for a call: "can Chanel ring me tomorrow morning?". You should receive
   an email with the subject "WhatsApp handover" and the transcript.
5. Give a name and a goal: the email "WhatsApp lead: ..." should arrive.

### 13. If something does not work

- **No reply at all**: in Vercel open the deployment, click **Functions**,
  then `api/whatsapp`, and read the logs. "Bad signature" means
  `META_APP_SECRET` is wrong. A `graph 401` means `WHATSAPP_TOKEN` is wrong
  or lacks the two permissions. A `graph 400 ... 131030` means the recipient
  is not on the test list (step 12, item 1) while the app is in Development.
- **Reply arrives but conversations forget**: `store` must say `redis` in
  step 8, item 4.
- **Meta says the webhook failed to verify**: the verify token in Vercel and
  in Meta differ, or the redeploy had not finished.

Send me a screenshot of whatever you see and I will tell you which it is.

## Changing what the agent says

Edit `chat-api/whatsapp-prompt.js`, push to main, and Vercel redeploys in
about a minute. To try wording before pushing, from the `chat-api` folder:

```bash
node scripts/whatsapp-chat.js
```

This talks to the same brain in the terminal, with leads and handovers
printed instead of emailed. It needs `ANTHROPIC_API_KEY` in the environment.

## What it costs to run

- Meta: nothing for replies to customer messages within 24 hours, which is
  everything the agent does. The agent never starts conversations.
- Claude: a few cents per conversation at current volumes.
- Vercel and Upstash: free tiers.

## Opting out

Anyone who sends STOP is not answered again until they send START.

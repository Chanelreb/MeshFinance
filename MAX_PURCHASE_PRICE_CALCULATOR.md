# Maximum Home Purchase Price Calculator — implementation guide

WA owner-occupied calculator that estimates the maximum property price a client
may be able to buy, given their borrowing capacity, cash, WA transfer duty,
government deposit pathway, FHOG and indicative LMI.

**Route:** `/calc-max-purchase-price` · **Hub tile:** "What's My Ceiling?"

---

## 1. How it maps to your stack (important)

The original brief specified TypeScript + Next.js + separate `.ts`/`.tsx` files +
Vitest. **This website is not Next.js/TypeScript** — it's classic-JSX React with no
module bundler that resolves `import` and no test runner. So the same design was
delivered in the site's actual stack, keeping the engine cleanly separated:

| Brief (Next.js/TS)                         | Delivered (this site)                                            |
|--------------------------------------------|------------------------------------------------------------------|
| `lib/calculators/*.ts` (duty, LMI, solver, config, types) | **`ui_kits/website/calculator-engine.js`** — one UMD module, `window.MeshCalc`, also `require()`-able under Node. JSDoc types. |
| `components/calculators/MaximumPurchasePriceCalculator.tsx` | **`ui_kits/website/CalculatorScreen.jsx`** — `kind === "max-purchase-price"` → module-scope `MaxPurchasePriceCalculator` component |
| Vitest unit tests                          | **`ui_kits/website/calculator-engine.test.js`** — runs with `node calculator-engine.test.js` (48 tests, zero deps) |

Calculation logic and presentation are fully separated, exactly as asked — just
packaged for the site that exists.

## 2. Files

- `ui_kits/website/calculator-engine.js` — engine + **`CALC_CONFIG`** (the single dated config block)
- `ui_kits/website/calculator-engine.test.js` — `node calculator-engine.test.js`
- `ui_kits/website/CalculatorScreen.jsx` — UI (component + `mp` styles + `kind` branch)
- `ui_kits/website/App.jsx` — route `calc-max-purchase-price`, title + meta description
- `ui_kits/website/index.html` — `<script src="calculator-engine.js">` (loads before the app bundle)
- `ui_kits/website/content-data.js` — Calculator Hub tile
- `sitemap.xml` — new URL

## 3. Public API (`window.MeshCalc`)

```js
calculateWATransferDuty({ dutiableValue, firstHomeOwnerRateEligible, ownerOccupied = true })  // → number
estimateIndicativeLMI({ baseLoanAmount, propertyValue, rateBands?, loanSizeFactors? })          // → number
calculateMaximumPurchasePrice(inputs)                                                           // → result
formatCurrency(n)
CALC_CONFIG
```

The LMI estimator and rate tables are injectable via `inputs.config` (or the
`rateBands` / `loanSizeFactors` args) so Mesh can swap the approximation without
touching the solver.

## 4. Key behaviours (verified by tests)

- **Solver:** binary search to $1; headline **rounded down to the nearest $1,000**; all detail figures to the nearest dollar; hard safety ceiling `$5,000,000`.
- **Duty:** general / residential-concessional (owner-occ ≤ $200k) / first-home-owner schedules; "per $100 or part thereof" via `Math.ceil`.
- **Scheme deposit gate uses ENTERED CASH only** — the FHOG can add to funds but never counts toward the 2%/5% minimum saved deposit.
- **Scheme selected → two results:** primary (scheme, $0 LMI, scheme price cap) + secondary (standard, indicative capitalised LMI, 97% total-LVR cap, no scheme cap).
- **FHOG** only for new/completed homes, only when the candidate price is within the location cap; if the result exceeds the cap it recalculates without the grant and warns.
- Every constraint reports a **limiting factor**; infeasible cases explain the gap instead of showing a misleading $0.

## 5. Assumptions

1. **Design tokens:** used the site's existing CSS variables (`--blue-500` `#3898e0`, `--navy-700` `#102a43`, etc.) rather than the brief's slightly-different hex values, for visual consistency with the other calculators. They are near-identical.
2. **Duty base amounts** are the legislated fixed figures from the brief verbatim (e.g. `$28,453` at $725k+, which is RevenueWA's rounded base; the raw formula gives 28,452.50).
3. **FHOG "Unsure"** is treated as **$0 / not applied** (conservative), mirroring the "Unsure" duty behaviour. Only "Yes" adds the grant.
4. **FHOG + scheme** are independent; the grant increases funds but the cash-only deposit gate still enforces the 2%/5% saved-deposit rule.
5. Feasibility is monotonic in price, which makes the binary search sound.
6. **Location is client-selected**, not geocoded — the 26th-parallel split and suburb/postcode cap nuances are surfaced as a warning to confirm with Mesh.
7. **Indicative LMI is a placeholder** conservative table — see §7.

## 6. Connecting the shared duty function to the Stamp Duty calculator

Your current **Stamp Duty** calculator (`kind === "stamp-duty"`) is a third-party
Vision Abacus iframe (multi-state). The engine now exposes a reusable WA duty
function you can use to make it a native WA calculator:

```jsx
// inside CalculatorScreen.jsx, kind === "stamp-duty"
const duty = window.MeshCalc.calculateWATransferDuty({
  dutiableValue: propertyValue,
  firstHomeOwnerRateEligible: isFirstHomeOwner, // from a Yes/No control
  ownerOccupied: true,
});
// render window.MeshCalc.formatCurrency(duty)
```

Caveat: the shared function is **WA-only**. If you want to keep multi-state duty,
leave the iframe; if WA-only is fine, replace the iframe with native inputs +
this call so both calculators share one source of truth. (Kept as the iframe for
now to avoid changing scope; the function is ready when you are.)

## 7. ⚠️ Review before production — values in `CALC_CONFIG`

Everything below lives in one block at the top of `calculator-engine.js`:

- **WA general duty** brackets & rates
- **Residential concessional** rate + `$200,000` threshold
- **First Home Owner duty:** nil ≤ $600k, `$16.15`/$100 to $800k, general above
- **FHOG:** amount `$10,000`; caps `$800k` Perth / `$800k` south / `$1,000,000` north
- **Scheme property caps:** `$850k` Perth / `$600k` other WA
- **Scheme rules:** 2% → 98% loan; 5% → 95% loan
- **Default other purchase costs:** `$5,000`
- **Max standard total LVR:** `97%`
- **Indicative LMI rate bands + loan-size factors** — **these are a conservative guide only, NOT a lender/insurer premium schedule. Replace with a Mesh-approved table before relying on the LMI figures.**
- **`effectiveDate` 2026-05-07**, **`lastReviewed` 2026-08-05** (shown under the calculator)

Verify duty output against RevenueWA's Transfer Duty Assessment page and scheme
thresholds against Housing Australia's postcode-cap tool. Nothing in the tool
depends on those sites at runtime — the formulas are implemented locally.

The client UI is written to never claim eligibility: scheme, duty and FHOG
answers are the client's own selections, and the result is repeatedly shown as
subject to confirmation by Mesh Finance, the lender and the relevant authority.

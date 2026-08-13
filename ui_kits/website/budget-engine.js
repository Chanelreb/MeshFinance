/* =============================================================================
 * Money by Design — budget calculation engine
 *
 * Pure, UI-free calculation + configuration for the Money by Design budgeting
 * tool. Exposed as window.MeshBudget (browser) and module.exports (Node tests).
 *
 * Design principles (see the build spec, sections 30 "Calculation integrity"):
 *   - Every user value is kept as entered; monthly figures are derived, never
 *     stored back over the originals.
 *   - Income − all UNIQUE outgoings = Breathing Room. Nothing is counted twice:
 *       expenses live in `expenses[]` (each with a bucket),
 *       debt repayments live in `debts[]` (always Future You),
 *       goal contributions live in `goals[]` (always Goals).
 *     The three arrays are disjoint, so a mortgage / debt / goal is only ever
 *     summed once.
 *   - Mortgage/rent is flagged `housing:true` so the dashboard can show it as a
 *     separate chart slice WITHOUT removing it from the Essentials maths.
 *   - Rounding happens only at display time (formatMoney / formatPct).
 * ===========================================================================*/
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.MeshBudget = api;
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  /* ------------------------------------------------------------------ config */

  /* The four Money by Design buckets. Percentages are SUGGESTED starting points
   * only — change them here to change the default split everywhere. */
  var DEFAULT_BUCKETS = { essentials: 60, lifestyle: 10, goals: 10, futureYou: 20 };

  var BUCKET_ORDER = ["essentials", "lifestyle", "goals", "futureYou"];

  var BUCKET_META = {
    essentials: { label: "Essentials", blurb: "Keeping everyday life running.", color: "#3898e0" },
    lifestyle:  { label: "Lifestyle",  blurb: "The things you choose to enjoy.", color: "#54a6e5" },
    goals:      { label: "Goals",      blurb: "Money aimed at what you're building towards.", color: "#2e9e5b" },
    futureYou:  { label: "Future You", blurb: "Debt reduction, savings and getting ahead.", color: "#102a43" },
  };

  /* Housing shown separately in the "Where your money goes" chart. */
  var HOUSING_COLOR = "#2167a0";
  var BREATHING_COLOR = "#cfe6f8";

  /* Frequency → annual multiplier. Monthly amount = amount * mult / 12.
   * (Weekly is annualised ×52 then ÷12 — never a naive ×4.) */
  var FREQUENCIES = {
    weekly:      { label: "Weekly",      mult: 52 },
    fortnightly: { label: "Fortnightly", mult: 26 },
    monthly:     { label: "Monthly",     mult: 12 },
    quarterly:   { label: "Quarterly",   mult: 4 },
    annually:    { label: "Annually",    mult: 1 },
  };
  var INCOME_FREQUENCIES = ["weekly", "fortnightly", "monthly"];
  var EXPENSE_FREQUENCIES = ["weekly", "fortnightly", "monthly", "quarterly", "annually"];

  var HOUSING_OPTIONS = [
    { value: "mortgage", label: "I own with a mortgage", icon: "Home" },
    { value: "rent",     label: "I rent",                icon: "Key" },
    { value: "outright", label: "I own my home outright", icon: "Shield" },
    { value: "other",    label: "Other / living arrangement", icon: "MapPin" },
  ];

  var DEBT_TYPES = ["Credit card", "Personal loan", "Car loan", "Buy Now Pay Later", "HECS/HELP", "Other debt"];

  var GOAL_PRESETS = ["Home deposit", "Holiday", "Renovation", "New car", "Emergency fund", "Wedding", "Christmas", "Education", "Investment", "Other"];

  /* Default expense catalogue. Each item: { name, bucket, housing?, freq? }.
   * The screen assembles the starting expense list from these groups based on
   * the household toggles. Bucket is a sensible default the user can override. */
  var CATALOG = {
    home: {
      mortgage: [
        { name: "Mortgage repayment", bucket: "essentials", housing: true, freq: "monthly" },
        { name: "Council rates", bucket: "essentials", freq: "quarterly" },
        { name: "Building / home insurance", bucket: "essentials", freq: "annually" },
        { name: "Strata fees", bucket: "essentials", freq: "quarterly" },
        { name: "Home maintenance", bucket: "essentials", freq: "monthly" },
      ],
      rent: [
        { name: "Rent", bucket: "essentials", housing: true, freq: "weekly" },
        { name: "Contents insurance", bucket: "essentials", freq: "annually" },
      ],
      outright: [
        { name: "Council rates", bucket: "essentials", freq: "quarterly" },
        { name: "Building / home insurance", bucket: "essentials", freq: "annually" },
        { name: "Strata fees", bucket: "essentials", freq: "quarterly" },
        { name: "Home maintenance", bucket: "essentials", freq: "monthly" },
      ],
      other: [
        { name: "Housing costs", bucket: "essentials", housing: true, freq: "monthly" },
      ],
    },
    household: [
      { name: "Groceries", bucket: "essentials", freq: "weekly" },
      { name: "Electricity", bucket: "essentials", freq: "quarterly" },
      { name: "Gas", bucket: "essentials", freq: "quarterly" },
      { name: "Water", bucket: "essentials", freq: "quarterly" },
      { name: "Internet", bucket: "essentials", freq: "monthly" },
      { name: "Mobile phones", bucket: "essentials", freq: "monthly" },
      { name: "Household supplies", bucket: "essentials", freq: "weekly" },
    ],
    transport: [
      { name: "Fuel", bucket: "essentials", freq: "weekly" },
      { name: "Public transport", bucket: "essentials", freq: "weekly" },
      { name: "Car registration", bucket: "essentials", freq: "annually" },
      { name: "Car insurance", bucket: "essentials", freq: "annually" },
      { name: "Car servicing / maintenance", bucket: "essentials", freq: "annually" },
      { name: "Parking / tolls", bucket: "essentials", freq: "monthly" },
    ],
    health: [
      { name: "Private health insurance", bucket: "essentials", freq: "monthly" },
      { name: "Medical", bucket: "essentials", freq: "monthly" },
      { name: "Dental", bucket: "essentials", freq: "annually" },
      { name: "Pharmacy / medications", bucket: "essentials", freq: "monthly" },
    ],
    lifestyle: [
      { name: "Eating out", bucket: "lifestyle", freq: "weekly" },
      { name: "Takeaway", bucket: "lifestyle", freq: "weekly" },
      { name: "Entertainment", bucket: "lifestyle", freq: "monthly" },
      { name: "Streaming subscriptions", bucket: "lifestyle", freq: "monthly" },
      { name: "Gym / memberships", bucket: "lifestyle", freq: "monthly" },
      { name: "Shopping", bucket: "lifestyle", freq: "monthly" },
      { name: "Personal care", bucket: "lifestyle", freq: "monthly" },
      { name: "Hobbies", bucket: "lifestyle", freq: "monthly" },
    ],
    kids: [
      { name: "Childcare", bucket: "essentials", freq: "weekly" },
      { name: "School fees", bucket: "essentials", freq: "annually" },
      { name: "School supplies / books", bucket: "essentials", freq: "annually" },
      { name: "Uniforms", bucket: "essentials", freq: "annually" },
      { name: "Kids sport", bucket: "lifestyle", freq: "monthly" },
      { name: "Activities / lessons", bucket: "lifestyle", freq: "monthly" },
      { name: "Pocket money", bucket: "lifestyle", freq: "weekly" },
      { name: "Child support", bucket: "essentials", freq: "monthly" },
    ],
    pets: [
      { name: "Pet food", bucket: "essentials", freq: "weekly" },
      { name: "Pet insurance", bucket: "essentials", freq: "monthly" },
      { name: "Vet", bucket: "essentials", freq: "annually" },
      { name: "Medication", bucket: "essentials", freq: "monthly" },
      { name: "Grooming", bucket: "lifestyle", freq: "monthly" },
      { name: "Boarding / daycare", bucket: "lifestyle", freq: "monthly" },
    ],
  };

  /* ------------------------------------------------------------- small utils */

  // Coerce to a finite, non-negative number (blank / bad input → 0).
  function num(v) {
    var n = typeof v === "number" ? v : parseFloat(String(v == null ? "" : v).replace(/[^0-9.\-]/g, ""));
    return isFinite(n) && n > 0 ? n : 0;
  }

  // Convert an amount at a given frequency to a monthly figure.
  function toMonthly(amount, freq) {
    var a = num(amount);
    var f = FREQUENCIES[freq] ? FREQUENCIES[freq].mult : 12;
    return (a * f) / 12;
  }

  // Whole-dollar (or cents) AUD, deterministic across Node/browser. e.g. -$1,234
  function formatMoney(value, opts) {
    opts = opts || {};
    var v = Number(value);
    if (!isFinite(v)) v = 0;
    var neg = v < 0;
    v = Math.abs(v);
    var digits = opts.cents ? 2 : 0;
    var parts = v.toFixed(digits).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (neg ? "-$" : "$") + parts.join(".");
  }

  // Percent for display, guarding NaN/Infinity. e.g. formatPct(61.4) -> "61%"
  function formatPct(value, dp) {
    var v = Number(value);
    if (!isFinite(v)) v = 0;
    return v.toFixed(dp == null ? 0 : dp) + "%";
  }

  function pctOf(part, whole) {
    return whole > 0 ? (part / whole) * 100 : 0;
  }

  function clamp(v, lo, hi) {
    if (!isFinite(v)) return lo;
    return Math.max(lo, Math.min(hi, v));
  }

  /* ------------------------------------------------------- feedback language */

  var FEEDBACK_TOLERANCE = 5; // percentage points either side of target = "around"

  /* Warm, non-judgemental messaging keyed off how actual% compares to target%.
   *
   * Direction depends on the bucket. Essentials and Lifestyle are SPENDING
   * buckets — coming in UNDER target is good (frees up room). Goals and Future
   * You are BUILD buckets — the point is to feed them, so being under target is
   * an opportunity to build, not a win, and coming in above is getting ahead.
   * `key` selects the right framing; omitted → spend behaviour. */
  function feedbackFor(actualPct, targetPct, key) {
    var diff = actualPct - targetPct;
    var build = key === "goals" || key === "futureYou";

    if (build) {
      if (diff > FEEDBACK_TOLERANCE) {
        return { tone: "ahead", emoji: "🙌", title: "Getting ahead",
          message: "You're putting more than the suggested amount towards this — a great position to be in." };
      }
      if (diff >= -FEEDBACK_TOLERANCE) {
        return { tone: "around", emoji: "🎯", title: "Killing it",
          message: "You're putting a healthy share towards this, right around your suggested range." };
      }
      if (diff >= -15) {
        return { tone: "build-slight", emoji: "🌱", title: "Room to build",
          message: "You're a little under your suggested range here. Even a small regular amount towards this adds up over time." };
      }
      return { tone: "build", emoji: "🧭", title: "A chance to build",
        message: "There's not much going here at the moment. When you're ready, directing even a small amount towards this is a great way to get ahead." };
    }

    if (diff < -FEEDBACK_TOLERANCE) {
      return { tone: "under", emoji: "🙌", title: "Looking good",
        message: "You're using less than the suggested amount here, which may give you some extra room elsewhere." };
    }
    if (diff <= FEEDBACK_TOLERANCE) {
      return { tone: "around", emoji: "🎯", title: "Killing it",
        message: "You're sitting right around your suggested range for this part of your budget." };
    }
    if (diff <= 10) {
      return { tone: "slight", emoji: "🌱", title: "A little room to improve",
        message: "You're just above your suggested range. A few small changes could bring this part of your budget back into balance." };
    }
    if (diff <= 20) {
      return { tone: "notable", emoji: "👀", title: "Worth a closer look",
        message: "This part of your budget is taking up a bigger share of your income. Have a look through the expenses below and see whether there's anything you'd like to adjust." };
    }
    return { tone: "significant", emoji: "🧭", title: "Let's find some breathing room",
      message: "A larger portion of your income is going here at the moment. That doesn't necessarily mean anything is wrong, but it could be a useful place to start if you'd like to create more flexibility." };
  }

  /* --------------------------------------------------------------- goal maths */

  // Whole months from `now` to a YYYY-MM-DD target (negative if already past).
  function monthsUntil(targetDate, now) {
    if (!targetDate) return null;
    var t = new Date(targetDate + "T00:00:00");
    if (isNaN(t.getTime())) return null;
    var months = (t.getFullYear() - now.getFullYear()) * 12 + (t.getMonth() - now.getMonth());
    if (t.getDate() < now.getDate()) months -= 1; // not yet a full month into the final one
    return months;
  }

  function goalResult(goal, now) {
    var target = num(goal.target);
    var saved = num(goal.saved);
    var contributionMonthly = toMonthly(goal.contribution, goal.freq);
    var savedPct = target > 0 ? clamp((saved / target) * 100, 0, 100) : (saved > 0 ? 100 : 0);
    var remaining = Math.max(target - saved, 0);
    var months = monthsUntil(goal.targetDate, now);
    var pastDue = months != null && months <= 0 && remaining > 0;
    var requiredMonthly = null;
    if (months != null && months > 0) requiredMonthly = remaining / months;
    var onTrack = null;
    if (requiredMonthly != null && contributionMonthly > 0) onTrack = contributionMonthly + 1e-6 >= requiredMonthly;
    return {
      id: goal.id, name: goal.name || "Goal",
      target: target, saved: saved, remaining: remaining, savedPct: savedPct,
      contributionMonthly: contributionMonthly,
      monthsLeft: months, requiredMonthly: requiredMonthly, onTrack: onTrack, pastDue: pastDue,
      complete: target > 0 && saved >= target,
    };
  }

  /* ----------------------------------------------------- the main computation */

  /**
   * @param {object} state  full calculator state (incomes, housing, expenses,
   *                        debts, goals, buckets, flags)
   * @param {object} [opts] { now?: Date }  injectable clock for deterministic tests
   */
  function computeResults(state, opts) {
    state = state || {};
    opts = opts || {};
    var now = opts.now || new Date();

    var buckets = normaliseBuckets(state.buckets);
    var bucketsTotalPct = BUCKET_ORDER.reduce(function (s, k) { return s + buckets[k]; }, 0);
    var bucketsValid = Math.abs(bucketsTotalPct - 100) < 0.001;

    /* Income → monthly */
    var incomes = (state.incomes || []).map(function (p) {
      return { name: p.name || "", monthly: toMonthly(p.amount, p.freq) };
    });
    var incomeMonthly = incomes.reduce(function (s, p) { return s + p.monthly; }, 0);

    /* Expenses → monthly, grouped by bucket (single source of truth) */
    var expenseByBucket = { essentials: 0, lifestyle: 0, goals: 0, futureYou: 0 };
    var breakdown = { essentials: [], lifestyle: [], goals: [], futureYou: [] };
    var housingMonthly = 0;
    (state.expenses || []).forEach(function (e) {
      var m = toMonthly(e.amount, e.freq);
      if (m <= 0) return;
      var b = expenseByBucket[e.bucket] != null ? e.bucket : "essentials";
      expenseByBucket[b] += m;
      breakdown[b].push({ name: e.name || "Expense", monthly: m, housing: !!e.housing });
      if (e.housing) housingMonthly += m;
    });

    /* Debt repayments → monthly, always Future You (never in expenses[]) */
    var debtMonthly = 0, debtBalance = 0, debtCount = 0;
    (state.debts || []).forEach(function (d) {
      var m = toMonthly(d.repayment, d.freq);
      debtBalance += num(d.balance);
      if (m <= 0) return;
      debtMonthly += m;
      debtCount += 1;
      breakdown.futureYou.push({ name: d.name || d.type || "Debt", monthly: m, debt: true });
    });

    /* Goal contributions → monthly, always Goals (never in expenses[]) */
    var goalMonthly = 0;
    (state.goals || []).forEach(function (g) {
      var m = toMonthly(g.contribution, g.freq);
      if (m <= 0) return;
      goalMonthly += m;
      breakdown.goals.push({ name: g.name || "Goal", monthly: m, goal: true });
    });

    /* Bucket actuals: expenses in that bucket + the dedicated stream */
    var actual = {
      essentials: expenseByBucket.essentials,
      lifestyle: expenseByBucket.lifestyle,
      goals: expenseByBucket.goals + goalMonthly,
      futureYou: expenseByBucket.futureYou + debtMonthly,
    };

    var totalExpenses = expenseByBucket.essentials + expenseByBucket.lifestyle + expenseByBucket.goals + expenseByBucket.futureYou;
    var outgoings = totalExpenses + debtMonthly + goalMonthly; // each stream counted exactly once
    var breathingRoom = incomeMonthly - outgoings;

    /* Per-bucket comparison vs suggested target */
    var bucketResults = BUCKET_ORDER.map(function (key) {
      var actualAmt = actual[key];
      var targetPct = buckets[key];
      var targetAmt = (targetPct / 100) * incomeMonthly;
      var actualPct = pctOf(actualAmt, incomeMonthly);
      return {
        key: key, label: BUCKET_META[key].label, blurb: BUCKET_META[key].blurb, color: BUCKET_META[key].color,
        targetPct: targetPct, targetAmt: targetAmt,
        actualAmt: actualAmt, actualPct: actualPct,
        diffPct: actualPct - targetPct, diffAmt: actualAmt - targetAmt,
        feedback: feedbackFor(actualPct, targetPct, key),
      };
    });

    /* Housing / mortgage check */
    var housing = null;
    if (state.housing && housingMonthly > 0) {
      var isRent = state.housing === "rent";
      housing = {
        type: state.housing,
        isRent: isRent,
        label: isRent ? "Rent" : (state.housing === "mortgage" ? "Mortgage" : "Housing"),
        monthly: housingMonthly,
        pctOfIncome: pctOf(housingMonthly, incomeMonthly),
        meta: state.mortgage || null,
      };
    }

    /* "Where your money goes" chart — mortgage/rent pulled out of Essentials for
     * display only (otherEssentials + housing === essentials actual). */
    var otherEssentials = Math.max(actual.essentials - housingMonthly, 0);
    var chartBase = incomeMonthly > 0 ? incomeMonthly : outgoings;
    var rawSegments = [
      { key: "housing", label: housing ? housing.label : "Housing", amount: housingMonthly, color: HOUSING_COLOR },
      { key: "essentials", label: "Other essentials", amount: otherEssentials, color: BUCKET_META.essentials.color },
      { key: "lifestyle", label: "Lifestyle", amount: actual.lifestyle, color: BUCKET_META.lifestyle.color },
      { key: "goals", label: "Goals", amount: actual.goals, color: BUCKET_META.goals.color },
      { key: "futureYou", label: "Future You", amount: actual.futureYou, color: BUCKET_META.futureYou.color },
      { key: "breathing", label: "Breathing room", amount: breathingRoom > 0 ? breathingRoom : 0, color: BREATHING_COLOR },
    ];
    var segments = rawSegments.filter(function (s) { return s.amount > 0.005; }).map(function (s) {
      return { key: s.key, label: s.label, amount: s.amount, color: s.color, pct: pctOf(s.amount, chartBase) };
    });

    /* Goals */
    var goalsResults = (state.goals || []).map(function (g) { return goalResult(g, now); });

    /* Future You firepower — surplus that COULD go to debt/savings (never assumed) */
    var futureYou = {
      breathingRoom: breathingRoom,
      hasDebt: debtCount > 0,
      potentialExtra: breathingRoom > 0 ? breathingRoom : 0,
    };

    return {
      income: { monthly: incomeMonthly, byPerson: incomes },
      totals: { expenses: totalExpenses, debtRepayments: debtMonthly, goalContributions: goalMonthly, outgoings: outgoings },
      breathingRoom: breathingRoom,
      buckets: bucketResults,
      bucketsByKey: bucketResults.reduce(function (o, b) { o[b.key] = b; return o; }, {}),
      bucketsValid: bucketsValid, bucketsTotalPct: bucketsTotalPct,
      housing: housing,
      debt: { totalBalance: debtBalance, monthlyRepayments: debtMonthly, pctOfIncome: pctOf(debtMonthly, incomeMonthly), count: debtCount },
      goals: goalsResults,
      futureYou: futureYou,
      chart: { segments: segments, base: chartBase },
      breakdown: breakdown,
    };
  }

  /* Clean an incoming bucket object to the four known keys (numbers only). */
  function normaliseBuckets(b) {
    b = b || {};
    var out = {};
    BUCKET_ORDER.forEach(function (k) {
      var v = Number(b[k]);
      out[k] = isFinite(v) && v >= 0 ? v : DEFAULT_BUCKETS[k];
    });
    return out;
  }

  return {
    DEFAULT_BUCKETS: DEFAULT_BUCKETS,
    BUCKET_ORDER: BUCKET_ORDER,
    BUCKET_META: BUCKET_META,
    FREQUENCIES: FREQUENCIES,
    INCOME_FREQUENCIES: INCOME_FREQUENCIES,
    EXPENSE_FREQUENCIES: EXPENSE_FREQUENCIES,
    HOUSING_OPTIONS: HOUSING_OPTIONS,
    DEBT_TYPES: DEBT_TYPES,
    GOAL_PRESETS: GOAL_PRESETS,
    CATALOG: CATALOG,
    FEEDBACK_TOLERANCE: FEEDBACK_TOLERANCE,
    num: num,
    toMonthly: toMonthly,
    formatMoney: formatMoney,
    formatPct: formatPct,
    feedbackFor: feedbackFor,
    monthsUntil: monthsUntil,
    goalResult: goalResult,
    computeResults: computeResults,
    normaliseBuckets: normaliseBuckets,
  };
});

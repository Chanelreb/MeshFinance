/* Zero-dependency tests for the Money by Design engine.  Run: node budget-engine.test.js */
var B = require("./budget-engine.js");

var passed = 0, failed = 0;
function ok(name, cond) { if (cond) { passed++; } else { failed++; console.error("FAIL: " + name); } }
function near(a, b, eps) { return Math.abs(a - b) <= (eps == null ? 0.01 : eps); }
var NOW = new Date("2026-08-13T00:00:00");

/* ---- frequency conversions (never a naive weekly ×4) ---- */
ok("weekly→monthly", near(B.toMonthly(100, "weekly"), 100 * 52 / 12));
ok("fortnightly→monthly", near(B.toMonthly(1000, "fortnightly"), 1000 * 26 / 12));
ok("monthly→monthly", near(B.toMonthly(3000, "monthly"), 3000));
ok("quarterly→monthly", near(B.toMonthly(300, "quarterly"), 100));
ok("annually→monthly", near(B.toMonthly(1200, "annually"), 100));
ok("weekly 200 ≠ ×4", B.toMonthly(200, "weekly") > 800 + 1); // 866.67, not 800
ok("blank amount → 0", B.toMonthly("", "weekly") === 0);
ok("negative amount → 0", B.toMonthly(-50, "monthly") === 0);

/* ---- currency formatting ---- */
ok("money whole", B.formatMoney(1234.56) === "$1,235");
ok("money cents", B.formatMoney(1234.5, { cents: true }) === "$1,234.50");
ok("money negative", B.formatMoney(-320) === "-$320");
ok("money NaN → $0", B.formatMoney(NaN) === "$0");
ok("money big", B.formatMoney(1234567) === "$1,234,567");

/* ---- reconciliation: income − unique outgoings = breathing room ---- */
var state = {
  incomes: [{ amount: 1500, freq: "fortnightly" }, { amount: 1200, freq: "weekly" }],
  housing: "mortgage",
  expenses: [
    { name: "Mortgage repayment", amount: 2750, freq: "monthly", bucket: "essentials", housing: true },
    { name: "Groceries", amount: 250, freq: "weekly", bucket: "essentials" },
    { name: "Eating out", amount: 400, freq: "monthly", bucket: "lifestyle" },
    { name: "Extra mortgage", amount: 200, freq: "monthly", bucket: "futureYou" },
  ],
  debts: [
    { type: "Credit card", balance: 5000, repayment: 300, freq: "monthly" },
    { type: "Car loan", balance: 18000, repayment: 500, freq: "monthly" },
  ],
  goals: [
    { name: "Holiday", target: 10000, saved: 4200, contribution: 100, freq: "fortnightly", targetDate: "2027-08-01" },
  ],
  buckets: { essentials: 60, lifestyle: 10, goals: 10, futureYou: 20 },
};
var r = B.computeResults(state, { now: NOW });

var incomeExpected = (1500 * 26 / 12) + (1200 * 52 / 12);
ok("income sums", near(r.income.monthly, incomeExpected));

// outgoings = sum of everything, counted once
var expExpected = 2750 + (250 * 52 / 12) + 400 + 200;
var debtExpected = 300 + 500;
var goalExpected = 100 * 26 / 12;
ok("total expenses", near(r.totals.expenses, expExpected));
ok("debt repayments", near(r.totals.debtRepayments, debtExpected));
ok("goal contributions", near(r.totals.goalContributions, goalExpected));
ok("outgoings = sum of three streams", near(r.totals.outgoings, expExpected + debtExpected + goalExpected));
ok("breathing = income − outgoings", near(r.breathingRoom, r.income.monthly - r.totals.outgoings));

/* ---- buckets reconcile & no double counting ---- */
var sumBuckets = r.buckets.reduce(function (s, b) { return s + b.actualAmt; }, 0);
ok("four buckets sum to outgoings", near(sumBuckets, r.totals.outgoings));
ok("Future You = its expenses + debt (once)", near(r.bucketsByKey.futureYou.actualAmt, 200 + debtExpected));
ok("Goals = its expenses + goal contribs (once)", near(r.bucketsByKey.goals.actualAmt, goalExpected));

/* ---- mortgage shown separately but stays inside Essentials maths ---- */
ok("Essentials still includes mortgage", near(r.bucketsByKey.essentials.actualAmt, 2750 + (250 * 52 / 12)));
var housingSeg = r.chart.segments.filter(function (s) { return s.key === "housing"; })[0];
var otherEssSeg = r.chart.segments.filter(function (s) { return s.key === "essentials"; })[0];
ok("chart housing slice = mortgage", near(housingSeg.amount, 2750));
ok("housing + other-essentials = Essentials bucket", near(housingSeg.amount + otherEssSeg.amount, r.bucketsByKey.essentials.actualAmt));
ok("mortgage % of income", near(r.housing.pctOfIncome, 2750 / r.income.monthly * 100));

/* ---- chart segments never exceed 100% of base when breathing positive/neg ---- */
var segTotal = r.chart.segments.reduce(function (s, x) { return s + x.amount; }, 0);
if (r.breathingRoom > 0) ok("segments incl breathing = income", near(segTotal, r.income.monthly, 0.1));

/* ---- goal maths ---- */
var g = r.goals[0];
ok("goal saved %", near(g.savedPct, 42));
ok("goal remaining", near(g.remaining, 5800));
ok("goal months left > 0", g.monthsLeft > 0);
ok("goal required monthly", near(g.requiredMonthly, 5800 / g.monthsLeft));

/* ---- feedback bands (5pt tolerance) ---- */
ok("around at target", B.feedbackFor(60, 60).tone === "around");
ok("around within +5", B.feedbackFor(64, 60).tone === "around");
ok("61 vs 60 not corrective", B.feedbackFor(61, 60).tone === "around");
ok("under below −5", B.feedbackFor(50, 60).tone === "under");
ok("slight +5..10", B.feedbackFor(68, 60).tone === "slight");
ok("notable +10..20", B.feedbackFor(75, 60).tone === "notable");
ok("significant >20", B.feedbackFor(90, 60).tone === "significant");

/* ---- build buckets (goals / future you) invert: under target ≠ "looking good" ---- */
ok("goals 0% is NOT 'Looking good'", B.feedbackFor(0, 10, "goals").title !== "Looking good");
ok("goals 0% flagged to build", ["build", "build-slight"].indexOf(B.feedbackFor(0, 10, "goals").tone) !== -1);
ok("future you 0% is a chance to build", B.feedbackFor(0, 20, "futureYou").tone === "build");
ok("future you 10 vs 20 = room to build", B.feedbackFor(10, 20, "futureYou").tone === "build-slight");
ok("build bucket at target = around", B.feedbackFor(10, 10, "goals").tone === "around");
ok("build bucket above target = getting ahead", B.feedbackFor(30, 20, "futureYou").tone === "ahead");
ok("spend bucket under still 'Looking good'", B.feedbackFor(50, 60, "essentials").title === "Looking good");
// engine wires the key through per bucket (essentials 40% here → under target)
var fbState = B.computeResults({ incomes: [{ amount: 5000, freq: "monthly" }], expenses: [{ name: "Rent", amount: 2000, freq: "monthly", bucket: "essentials" }] }, { now: NOW });
ok("computed goals bucket (0%) not 'Looking good'", fbState.bucketsByKey.goals.feedback.title !== "Looking good");
ok("computed futureYou bucket (0%) not 'Looking good'", fbState.bucketsByKey.futureYou.feedback.title !== "Looking good");
ok("computed essentials under target still 'Looking good'", fbState.bucketsByKey.essentials.feedback.title === "Looking good");

/* ---- edge cases ---- */
var empty = B.computeResults({}, { now: NOW });
ok("empty state: income 0", empty.income.monthly === 0);
ok("empty state: breathing 0", empty.breathingRoom === 0);
ok("empty state: no NaN in buckets", empty.buckets.every(function (b) { return isFinite(b.actualPct) && isFinite(b.actualAmt); }));
ok("empty state: no chart segments", empty.chart.segments.length === 0);

var overBudget = B.computeResults({
  incomes: [{ amount: 3000, freq: "monthly" }],
  expenses: [{ name: "Rent", amount: 2500, freq: "monthly", bucket: "essentials", housing: true }],
  debts: [{ type: "Credit card", balance: 9000, repayment: 900, freq: "monthly" }],
}, { now: NOW });
ok("over budget: negative breathing", overBudget.breathingRoom < 0);
ok("over budget: no breathing chart slice", overBudget.chart.segments.every(function (s) { return s.key !== "breathing"; }));

var pastGoal = B.goalResult({ name: "Xmas", target: 2000, saved: 500, contribution: 0, freq: "monthly", targetDate: "2020-01-01" }, NOW);
ok("past-due goal flagged", pastGoal.pastDue === true);
ok("past-due goal no negative required", pastGoal.requiredMonthly == null);

var savedOver = B.goalResult({ name: "Buffer", target: 1000, saved: 1500, contribution: 0, freq: "monthly" }, NOW);
ok("saved>target caps at 100%", savedOver.savedPct === 100 && savedOver.complete === true && savedOver.remaining === 0);

var zeroIncomeGoals = B.computeResults({ incomes: [], expenses: [{ name: "x", amount: 100, freq: "monthly", bucket: "essentials" }] }, { now: NOW });
ok("zero income: bucket % finite (not Infinity)", isFinite(zeroIncomeGoals.bucketsByKey.essentials.actualPct));

var badBuckets = B.computeResults({ incomes: [{ amount: 5000, freq: "monthly" }], buckets: { essentials: 70, lifestyle: 10, goals: 10, futureYou: 20 } }, { now: NOW });
ok("buckets not 100 flagged invalid", badBuckets.bucketsValid === false && badBuckets.bucketsTotalPct === 110);

console.log("\n" + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);

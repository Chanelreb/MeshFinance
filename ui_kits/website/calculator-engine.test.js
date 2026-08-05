/* Unit tests for the Mesh Finance Maximum Purchase Price engine.
 * Runs under plain Node — no test framework required:  node calculator-engine.test.js
 * Exit code 0 = all passed, 1 = failures.
 */
const assert = require("assert");
const M = require("./calculator-engine.js");
const { calculateWATransferDuty, estimateIndicativeLMI, calculateMaximumPurchasePrice, PATHWAY, _internal } = M;

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; }
  catch (e) { failed++; console.error("FAIL: " + name + "\n      " + e.message); }
}
// approx equality to the cent
function near(a, b, eps) { assert.ok(Math.abs(a - b) <= (eps == null ? 0.005 : eps), `expected ${a} ≈ ${b}`); }

/* -------------------------------------------------------------------------
 * GENERAL WA TRANSFER DUTY (general schedule, tested directly)
 * ---------------------------------------------------------------------- */
const gd = _internal.generalDuty;
test("general duty $0", () => near(gd(0), 0));
test("general duty $120,000", () => near(gd(120000), 2280));
test("general duty $120,001", () => near(gd(120001), 2282.85));
test("general duty $150,000", () => near(gd(150000), 3135));
test("general duty $150,001", () => near(gd(150001), 3138.8));
test("general duty $360,000", () => near(gd(360000), 11115));
test("general duty $360,001", () => near(gd(360001), 11119.75));
test("general duty $725,000", () => near(gd(725000), 28452.5));
test("general duty $725,001", () => near(gd(725001), 28458.15));
test("general duty $800,000", () => near(gd(800000), 32315.5));
test("general duty $1,000,000", () => near(gd(1000000), 42615.5));

/* Residential concessional (owner-occupied, ≤ $200,000) via the public fn */
test("residential concession applies at $200,000 (owner-occ)", () => {
  const d = calculateWATransferDuty({ dutiableValue: 200000, firstHomeOwnerRateEligible: false, ownerOccupied: true });
  near(d, 5032); // 1800 + 800*4.04
});
test("above $200,000 uses general (owner-occ)", () => {
  const d = calculateWATransferDuty({ dutiableValue: 200001, firstHomeOwnerRateEligible: false, ownerOccupied: true });
  near(d, gd(200001));
});

/* -------------------------------------------------------------------------
 * FIRST HOME OWNER RATE
 * ---------------------------------------------------------------------- */
const fho = (v) => calculateWATransferDuty({ dutiableValue: v, firstHomeOwnerRateEligible: true, ownerOccupied: true });
test("FHO duty $599,999", () => near(fho(599999), 0));
test("FHO duty $600,000", () => near(fho(600000), 0));
test("FHO duty $600,001", () => near(fho(600001), 16.15));
test("FHO duty $700,000", () => near(fho(700000), 16150));
test("FHO duty $800,000", () => near(fho(800000), 32300));
test("FHO duty $800,001 → general", () => near(fho(800001), gd(800001)));
test("FHO duty $800,001 = 32,320.65 (general: 28453 + 751×5.15)", () => near(fho(800001), 32320.65));

/* -------------------------------------------------------------------------
 * FHOG inclusion logic
 * ---------------------------------------------------------------------- */
const fhog = _internal.fhogForPrice;
const newPerth = { propertyType: "NEW_COMPLETED_HOME", fhogEligibility: "yes", location: "PERTH_CAPITAL_CITY" };
const newNorth = { propertyType: "NEW_COMPLETED_HOME", fhogEligibility: "yes", location: "OTHER_WA_NORTH_26" };
test("FHOG new Perth $800,000 → $10,000", () => assert.strictEqual(fhog(800000, newPerth), 10000));
test("FHOG new Perth $800,001 → $0", () => assert.strictEqual(fhog(800001, newPerth), 0));
test("FHOG new north $1,000,000 → $10,000", () => assert.strictEqual(fhog(1000000, newNorth), 10000));
test("FHOG new north $1,000,001 → $0", () => assert.strictEqual(fhog(1000001, newNorth), 0));
test("FHOG established with 'yes' selected → $0", () => {
  assert.strictEqual(fhog(700000, { propertyType: "ESTABLISHED_HOME", fhogEligibility: "yes", location: "PERTH_CAPITAL_CITY" }), 0);
});
test("FHOG 'unsure' → $0", () => {
  assert.strictEqual(fhog(700000, { propertyType: "NEW_COMPLETED_HOME", fhogEligibility: "unsure", location: "PERTH_CAPITAL_CITY" }), 0);
});

/* -------------------------------------------------------------------------
 * GOVERNMENT SCHEMES — deposit gate uses CASH only (FHOG must not count)
 * new Perth home, FHO duty eligible (duty $0 ≤ $600k), FHOG eligible, huge capacity
 * ---------------------------------------------------------------------- */
const bigCap = 10000000;
function schemeInputs(pathway, cash) {
  return {
    borrowingCapacity: bigCap, totalCash: cash, location: "PERTH_CAPITAL_CITY",
    propertyType: "NEW_COMPLETED_HOME", pathway,
    firstHomeDutyEligibility: "yes", fhogEligibility: "yes", otherPurchaseCosts: 5000,
    config: M.CALC_CONFIG,
  };
}
test("5% cash exactly meets min saved deposit → feasible", () => {
  const r = _internal.evaluateCandidate(600000, PATHWAY.SCHEME_5, schemeInputs(PATHWAY.SCHEME_5, 30000), M.CALC_CONFIG);
  assert.ok(r.feasible, "should be feasible with cash == 5%");
});
test("5% cash $1 below min → infeasible on MIN_SAVED_DEPOSIT (not loan)", () => {
  const r = _internal.evaluateCandidate(600000, PATHWAY.SCHEME_5, schemeInputs(PATHWAY.SCHEME_5, 29999), M.CALC_CONFIG);
  assert.ok(!r.feasible);
  assert.ok(r.reasons.indexOf("MIN_SAVED_DEPOSIT") !== -1, "reasons: " + r.reasons);
});
test("2% cash exactly meets min saved deposit → feasible", () => {
  const r = _internal.evaluateCandidate(600000, PATHWAY.SCHEME_2, schemeInputs(PATHWAY.SCHEME_2, 12000), M.CALC_CONFIG);
  assert.ok(r.feasible);
});
test("2% cash $1 below min → infeasible on MIN_SAVED_DEPOSIT", () => {
  const r = _internal.evaluateCandidate(600000, PATHWAY.SCHEME_2, schemeInputs(PATHWAY.SCHEME_2, 11999), M.CALC_CONFIG);
  assert.ok(!r.feasible);
  assert.ok(r.reasons.indexOf("MIN_SAVED_DEPOSIT") !== -1, "reasons: " + r.reasons);
});
test("FHOG does not satisfy the saved-deposit requirement", () => {
  // cash below 5% but FHOG would otherwise bridge the gap → still infeasible on deposit
  const r = _internal.evaluateCandidate(600000, PATHWAY.SCHEME_5, schemeInputs(PATHWAY.SCHEME_5, 25000), M.CALC_CONFIG);
  assert.ok(!r.feasible && r.reasons.indexOf("MIN_SAVED_DEPOSIT") !== -1);
});

test("Perth 5% result reaches $850,000 scheme cap", () => {
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: bigCap, totalCash: 120000, location: "PERTH_CAPITAL_CITY",
    propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.SCHEME_5,
    firstHomeDutyEligibility: "no", fhogEligibility: "no", otherPurchaseCosts: 5000,
  });
  assert.strictEqual(r.primary.maxPrice, 850000);
  assert.strictEqual(r.primary.limitingFactor, "SCHEME_PRICE_CAP");
  assert.strictEqual(r.primary.lmi, 0);
});
test("Other WA 5% result reaches $600,000 scheme cap", () => {
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: bigCap, totalCash: 120000, location: "OTHER_WA_SOUTH_26",
    propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.SCHEME_5,
    firstHomeDutyEligibility: "no", fhogEligibility: "no", otherPurchaseCosts: 5000,
  });
  assert.strictEqual(r.primary.maxPrice, 600000);
  assert.strictEqual(r.primary.limitingFactor, "SCHEME_PRICE_CAP");
});
test("scheme result carries $0 LMI", () => {
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: 500000, totalCash: 60000, location: "PERTH_CAPITAL_CITY",
    propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.SCHEME_5,
    firstHomeDutyEligibility: "no", fhogEligibility: "no",
  });
  assert.strictEqual(r.primary.lmi, 0);
});

/* -------------------------------------------------------------------------
 * STANDARD LENDING / LMI
 * ---------------------------------------------------------------------- */
test("80% base LVR → $0 LMI", () => {
  assert.strictEqual(estimateIndicativeLMI({ baseLoanAmount: 400000, propertyValue: 500000 }), 0);
});
test("above 80% LVR → indicative LMI > 0", () => {
  const lmi = estimateIndicativeLMI({ baseLoanAmount: 410000, propertyValue: 500000 }); // 82% LVR
  assert.ok(lmi > 0 && lmi < 410000);
});
test("LMI matches Helia at a captured point ($450k loan, 90% LVR = $8,218.64)", () => {
  near(estimateIndicativeLMI({ baseLoanAmount: 450000, propertyValue: 500000 }), 8218.64, 3);
});
test("LMI rate is flat above $750k (900k loan, 90% LVR uses the top band rate)", () => {
  near(estimateIndicativeLMI({ baseLoanAmount: 900000, propertyValue: 1000000 }), 900000 * 0.0232023, 1);
});
test("standard result constrained by borrowing capacity", () => {
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: 400000, totalCash: 300000, location: "PERTH_CAPITAL_CITY",
    propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.STANDARD,
    firstHomeDutyEligibility: "no", fhogEligibility: "no",
  });
  assert.ok(r.primary.feasible);
  assert.ok(["BORROWING_CAPACITY", "LVR_CAP"].indexOf(r.primary.limitingFactor) !== -1, r.primary.limitingFactor);
  assert.ok(r.primary.totalLoan <= 400000 + 1, "total loan within capacity");
});
test("standard result constrained by available cash", () => {
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: 5000000, totalCash: 40000, location: "PERTH_CAPITAL_CITY",
    propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.STANDARD,
    firstHomeDutyEligibility: "no", fhogEligibility: "no",
  });
  assert.ok(r.primary.feasible);
  assert.ok(r.primary.totalLvr <= 0.97 + 1e-9, "LVR within 97%");
  assert.ok(["LVR_CAP", "AVAILABLE_CASH"].indexOf(r.primary.limitingFactor) !== -1, r.primary.limitingFactor);
});
test("capitalised LMI keeps total LVR within 97%", () => {
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: 5000000, totalCash: 45000, location: "PERTH_CAPITAL_CITY",
    propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.STANDARD,
    firstHomeDutyEligibility: "no", fhogEligibility: "no",
  });
  assert.ok(r.primary.totalLvr <= 0.97 + 1e-9);
});

/* -------------------------------------------------------------------------
 * SOLVER behaviour
 * ---------------------------------------------------------------------- */
test("headline rounds down to nearest $1,000", () => {
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: 620000, totalCash: 88000, location: "PERTH_CAPITAL_CITY",
    propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.STANDARD,
    firstHomeDutyEligibility: "no", fhogEligibility: "no",
  });
  assert.strictEqual(r.primary.headlinePrice % 1000, 0);
  assert.ok(r.primary.headlinePrice <= r.primary.maxPrice);
  assert.ok(r.primary.maxPrice - r.primary.headlinePrice < 1000);
});
test("no NaN / Infinity anywhere in a result", () => {
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: 700000, totalCash: 90000, location: "PERTH_CAPITAL_CITY",
    propertyType: "NEW_COMPLETED_HOME", pathway: PATHWAY.SCHEME_5,
    firstHomeDutyEligibility: "yes", fhogEligibility: "yes",
  });
  const nums = [r.primary, r.secondary].filter(Boolean).flatMap((p) => [
    p.maxPrice, p.headlinePrice, p.duty, p.fhog, p.baseLoan, p.lmi, p.totalLoan, p.baseLvr, p.totalLvr, p.depositContribution, p.remainingCash,
  ]);
  nums.forEach((n) => assert.ok(Number.isFinite(n), "non-finite value: " + n));
});
test("stable across the $800,000 discontinuity (FHO duty + FHOG)", () => {
  for (let p = 799000; p <= 801000; p += 500) {
    const r = _internal.evaluateCandidate(p, PATHWAY.STANDARD, {
      borrowingCapacity: 5000000, totalCash: 200000, location: "PERTH_CAPITAL_CITY",
      propertyType: "NEW_COMPLETED_HOME", fhogEligibility: "yes",
      firstHomeDutyEligibility: "yes", otherPurchaseCosts: 5000,
    }, M.CALC_CONFIG);
    assert.ok(Number.isFinite(r.duty) && Number.isFinite(r.totalLvr));
  }
});
test("no infinite loop / terminates and monotonic feasibility", () => {
  const inp = {
    borrowingCapacity: 800000, totalCash: 100000, location: "PERTH_CAPITAL_CITY",
    propertyType: "ESTABLISHED_HOME", firstHomeDutyEligibility: "no", fhogEligibility: "no", otherPurchaseCosts: 5000, config: M.CALC_CONFIG,
  };
  const r = calculateMaximumPurchasePrice(Object.assign({ pathway: PATHWAY.STANDARD }, inp));
  const max = r.primary.maxPrice;
  assert.ok(_internal.evaluateCandidate(max, PATHWAY.STANDARD, inp, M.CALC_CONFIG).feasible, "max feasible");
  assert.ok(!_internal.evaluateCandidate(max + 1000, PATHWAY.STANDARD, inp, M.CALC_CONFIG).feasible, "past max infeasible");
});

/* -------------------------------------------------------------------------
 * VALIDATION / EDGE CASES
 * ---------------------------------------------------------------------- */
test("blank / zero inputs → not ok, friendly message", () => {
  const r = calculateMaximumPurchasePrice({ borrowingCapacity: 0, totalCash: 0, location: "PERTH_CAPITAL_CITY", propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.STANDARD });
  assert.strictEqual(r.ok, false);
});
test("negative inputs are clamped, never negative outputs", () => {
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: -100, totalCash: -50, location: "PERTH_CAPITAL_CITY",
    propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.STANDARD,
  });
  assert.strictEqual(r.ok, false); // both clamp to 0
});
test("scheme BELOW the cap hides the standard comparison", () => {
  // capacity-limited well under the $850k Perth cap -> no secondary
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: 700000, totalCash: 90000, location: "PERTH_CAPITAL_CITY",
    propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.SCHEME_5,
    firstHomeDutyEligibility: "no", fhogEligibility: "no",
  });
  assert.notStrictEqual(r.primary.limitingFactor, "SCHEME_PRICE_CAP");
  assert.strictEqual(r.secondary, null);
});
test("scheme AT the cap shows the standard comparison", () => {
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: bigCap, totalCash: 120000, location: "PERTH_CAPITAL_CITY",
    propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.SCHEME_5,
    firstHomeDutyEligibility: "no", fhogEligibility: "no",
  });
  assert.strictEqual(r.primary.limitingFactor, "SCHEME_PRICE_CAP");
  assert.ok(r.secondary && r.secondary.pathway === PATHWAY.STANDARD);
});
test("duty 'unsure' adds an explanatory message", () => {
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: 700000, totalCash: 90000, location: "PERTH_CAPITAL_CITY",
    propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.STANDARD,
    firstHomeDutyEligibility: "unsure", fhogEligibility: "no",
  });
  assert.ok(r.messages.some((m) => /standard duty estimate/i.test(m)));
});
test("values with cents are handled", () => {
  const r = calculateMaximumPurchasePrice({
    borrowingCapacity: 650000.55, totalCash: 90000.99, location: "PERTH_CAPITAL_CITY",
    propertyType: "ESTABLISHED_HOME", pathway: PATHWAY.STANDARD,
    firstHomeDutyEligibility: "no", fhogEligibility: "no",
  });
  assert.ok(r.ok && Number.isFinite(r.primary.maxPrice));
});

/* -------------------------------------------------------------------------- */
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);

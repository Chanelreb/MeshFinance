/* ============================================================================
 * Mesh Finance — Maximum Home Purchase Price calculation engine
 * ----------------------------------------------------------------------------
 * Pure calculation logic, kept separate from the React UI. Runs in the browser
 * (attaches to window.MeshCalc) and under Node (module.exports) so the same
 * code powers the site and the unit tests.
 *
 * Scope: Western Australia, owner-occupied established or newly-built completed
 * homes only. Implements RevenueWA transfer-duty formulas locally — it does NOT
 * call, scrape or depend on any external calculator at runtime.
 *
 * All money is handled as unrounded numbers until the final display stage.
 * "per $100 or part thereof" is implemented with Math.ceil(amount / 100).
 * ==========================================================================*/
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api; // Node / tests
  root.MeshCalc = api; // browser
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  /* ==========================================================================
   * DATED CONFIGURATION — single source of truth.
   * Review every value in this block before production. Rates and thresholds
   * use WA rules applying from 7 May 2026.
   * ========================================================================*/

  /* Indicative guide only. These rates are NOT a lender or insurer premium
   * schedule and must be reviewed by Mesh Finance before production deployment. */
  var DEFAULT_INDICATIVE_LMI_RATE_BANDS = [
    { minLvrExclusive: 0.8, maxLvrInclusive: 0.85, rate: 0.01 },
    { minLvrExclusive: 0.85, maxLvrInclusive: 0.9, rate: 0.02 },
    { minLvrExclusive: 0.9, maxLvrInclusive: 0.92, rate: 0.03 },
    { minLvrExclusive: 0.92, maxLvrInclusive: 0.95, rate: 0.04 },
    { minLvrExclusive: 0.95, maxLvrInclusive: 0.97, rate: 0.05 },
  ];

  var DEFAULT_LMI_LOAN_SIZE_FACTORS = [
    { maxLoan: 300000, factor: 0.9 },
    { maxLoan: 500000, factor: 1.0 },
    { maxLoan: 750000, factor: 1.1 },
    { maxLoan: 1000000, factor: 1.2 },
    { maxLoan: Infinity, factor: 1.3 },
  ];

  var CALC_CONFIG = {
    effectiveDate: "2026-05-07",
    lastReviewed: "2026-08-05",

    // First Home Owner Grant (new/completed homes only)
    fhogAmount: 10000,
    fhogCaps: {
      PERTH_CAPITAL_CITY: 800000,
      OTHER_WA_SOUTH_26: 800000,
      OTHER_WA_NORTH_26: 1000000,
    },

    // Federal deposit-scheme property-price caps
    schemePropertyCaps: {
      PERTH_CAPITAL_CITY: 850000,
      OTHER_WA_SOUTH_26: 600000,
      OTHER_WA_NORTH_26: 600000,
    },

    defaultOtherPurchaseCosts: 5000,
    maxStandardTotalLvr: 0.97,
    hardMaxPrice: 5000000,

    scheme2: { minDeposit: 0.02, maxLoan: 0.98 }, // 2% single-parent scheme
    scheme5: { minDeposit: 0.05, maxLoan: 0.95 }, // 5% first-home-buyer scheme

    // WA transfer duty — brackets are [upTo, base, over, ratePer100].
    // duty = base + ceil((value - over) / 100) * ratePer100 for the first
    // bracket whose upTo >= value.
    duty: {
      general: [
        { upTo: 120000, base: 0, over: 0, ratePer100: 1.9 },
        { upTo: 150000, base: 2280, over: 120000, ratePer100: 2.85 },
        { upTo: 360000, base: 3135, over: 150000, ratePer100: 3.8 },
        { upTo: 725000, base: 11115, over: 360000, ratePer100: 4.75 },
        { upTo: Infinity, base: 28453, over: 725000, ratePer100: 5.15 },
      ],
      // Residential concessional rate — owner-occupied homes not exceeding
      // $200,000. Above $200,000 the general rate applies.
      residentialMaxValue: 200000,
      residential: [
        { upTo: 120000, base: 0, over: 0, ratePer100: 1.5 },
        { upTo: 200000, base: 1800, over: 120000, ratePer100: 4.04 },
      ],
      // First Home Owner rate for homes (from 7 May 2026).
      firstHomeOwner: {
        noDutyUpTo: 600000, // $0 up to $600,000
        concessionUpTo: 800000, // $600,001–$800,000
        concessionRatePer100: 16.15,
        // Above $800,000 the full general rate applies (not a marginal discount).
      },
    },

    lmiRateBands: DEFAULT_INDICATIVE_LMI_RATE_BANDS,
    lmiLoanSizeFactors: DEFAULT_LMI_LOAN_SIZE_FACTORS,
  };

  /* ==========================================================================
   * Small helpers
   * ========================================================================*/

  function isFiniteNumber(n) {
    return typeof n === "number" && isFinite(n);
  }

  // Number of $100 units, counting any part of $100 as a whole unit.
  function units100(amount) {
    if (amount <= 0) return 0;
    return Math.ceil(amount / 100);
  }

  function clampNonNegative(n) {
    return n > 0 ? n : 0;
  }

  // Whole-dollar currency, e.g. 847000 -> "$847,000".
  function formatCurrency(n) {
    var v = Math.round(isFiniteNumber(n) ? n : 0);
    return "$" + v.toLocaleString("en-AU");
  }

  function dutyFromBrackets(value, brackets) {
    for (var i = 0; i < brackets.length; i++) {
      var b = brackets[i];
      if (value <= b.upTo) {
        return b.base + units100(value - b.over) * b.ratePer100;
      }
    }
    // Fallback (should not happen — last bracket is Infinity).
    var last = brackets[brackets.length - 1];
    return last.base + units100(value - last.over) * last.ratePer100;
  }

  /* ==========================================================================
   * WA TRANSFER DUTY (reusable — see stamp-duty integration notes)
   * ========================================================================*/

  function generalDuty(value, cfg) {
    return dutyFromBrackets(value, cfg.duty.general);
  }

  function residentialDuty(value, cfg) {
    if (value > cfg.duty.residentialMaxValue) return generalDuty(value, cfg);
    return dutyFromBrackets(value, cfg.duty.residential);
  }

  function firstHomeOwnerDuty(value, cfg) {
    var f = cfg.duty.firstHomeOwner;
    if (value <= f.noDutyUpTo) return 0;
    if (value <= f.concessionUpTo) {
      return units100(value - f.noDutyUpTo) * f.concessionRatePer100;
    }
    // Above the concession cap the full general rate applies.
    return generalDuty(value, cfg);
  }

  /**
   * WA transfer duty on a dutiable value. Returns an unrounded number.
   * @param {object} p
   * @param {number} p.dutiableValue
   * @param {boolean} p.firstHomeOwnerRateEligible
   * @param {boolean} [p.ownerOccupied=true]
   * @param {string}  [p.effectiveDate]
   * @param {object}  [p.config]
   */
  function calculateWATransferDuty(p) {
    var cfg = (p && p.config) || CALC_CONFIG;
    var v = p ? p.dutiableValue : 0;
    if (!isFiniteNumber(v) || v <= 0) return 0;
    if (p.firstHomeOwnerRateEligible) return firstHomeOwnerDuty(v, cfg);
    var ownerOccupied = p.ownerOccupied !== false; // default true
    if (ownerOccupied && v <= cfg.duty.residentialMaxValue) {
      return residentialDuty(v, cfg);
    }
    return generalDuty(v, cfg);
  }

  /* ==========================================================================
   * INDICATIVE LMI
   * Indicative guide only. Not a lender or insurer premium schedule; must be
   * reviewed by Mesh Finance before production deployment.
   * ========================================================================*/

  /**
   * Estimate indicative, capitalisable LMI. Returns an unrounded number.
   * @param {object} p
   * @param {number} p.baseLoanAmount  base loan before LMI
   * @param {number} p.propertyValue
   * @param {Array}  [p.rateBands]
   * @param {Array}  [p.loanSizeFactors]
   */
  function estimateIndicativeLMI(p) {
    var cfg = (p && p.config) || CALC_CONFIG;
    var baseLoanAmount = p.baseLoanAmount;
    var propertyValue = p.propertyValue;
    if (
      !isFiniteNumber(baseLoanAmount) ||
      !isFiniteNumber(propertyValue) ||
      propertyValue <= 0 ||
      baseLoanAmount <= 0
    ) {
      return 0;
    }
    var baseLvr = baseLoanAmount / propertyValue;
    if (baseLvr <= 0.8) return 0;

    var bands = (p && p.rateBands) || cfg.lmiRateBands;
    var factors = (p && p.loanSizeFactors) || cfg.lmiLoanSizeFactors;

    var rate = 0;
    for (var i = 0; i < bands.length; i++) {
      if (baseLvr > bands[i].minLvrExclusive && baseLvr <= bands[i].maxLvrInclusive) {
        rate = bands[i].rate;
        break;
      }
    }
    // LVR above the top band (e.g. > 0.97) has no defined premium here — the
    // solver rejects those candidates, but guard anyway with the top rate.
    if (rate === 0 && baseLvr > bands[bands.length - 1].maxLvrInclusive) {
      rate = bands[bands.length - 1].rate;
    }

    var factor = factors[factors.length - 1].factor;
    for (var j = 0; j < factors.length; j++) {
      if (baseLoanAmount <= factors[j].maxLoan) {
        factor = factors[j].factor;
        break;
      }
    }

    return baseLoanAmount * rate * factor;
  }

  /* ==========================================================================
   * MAXIMUM PURCHASE PRICE
   * ========================================================================*/

  var PATHWAY = { SCHEME_2: "SCHEME_2", SCHEME_5: "SCHEME_5", STANDARD: "STANDARD" };

  // Federal deposit scheme applicable to a pathway (or null for standard).
  function schemeParams(pathway, cfg) {
    if (pathway === PATHWAY.SCHEME_2) return cfg.scheme2;
    if (pathway === PATHWAY.SCHEME_5) return cfg.scheme5;
    return null;
  }

  function fhogForPrice(price, inputs, cfg) {
    // FHOG only for new/completed homes, only when eligibility === 'yes',
    // only when the price is within the applicable location cap.
    if (inputs.propertyType !== "NEW_COMPLETED_HOME") return 0;
    if (inputs.fhogEligibility !== "yes") return 0;
    var cap = cfg.fhogCaps[inputs.location];
    if (!isFiniteNumber(cap)) return 0;
    if (price > cap) return 0;
    return cfg.fhogAmount;
  }

  // Duty for a candidate price given the client's WA duty selection.
  // 'unsure' is treated as the standard (non first-home) estimate.
  function dutyForPrice(price, inputs, cfg) {
    return calculateWATransferDuty({
      dutiableValue: price,
      firstHomeOwnerRateEligible: inputs.firstHomeDutyEligibility === "yes",
      ownerOccupied: true,
      config: cfg,
    });
  }

  /**
   * Evaluate one candidate property price for a given pathway. Returns a detail
   * object plus feasibility and, when infeasible, the failed constraints.
   */
  function evaluateCandidate(price, pathway, inputs, cfg) {
    var otherCosts = clampNonNegative(inputs.otherPurchaseCosts);
    var cash = clampNonNegative(inputs.totalCash);
    var capacity = clampNonNegative(inputs.borrowingCapacity);

    var duty = dutyForPrice(price, inputs, cfg);
    var fhog = fhogForPrice(price, inputs, cfg);
    var totalFunds = cash + fhog;

    var requiredBaseLoanRaw = price + duty + otherCosts - totalFunds;
    var requiredBaseLoan = clampNonNegative(requiredBaseLoanRaw);

    var reasons = [];
    var scheme = schemeParams(pathway, cfg);

    var lmi = 0;
    var maxSchemeLoan = null;
    var schemeCap = null;

    if (scheme) {
      // --- Federal deposit scheme candidate -------------------------------
      schemeCap = cfg.schemePropertyCaps[inputs.location];
      maxSchemeLoan = price * scheme.maxLoan;
      var minSavedDeposit = price * scheme.minDeposit;

      // The saved-deposit test uses ENTERED CASH only (FHOG must not count).
      if (cash < minSavedDeposit) reasons.push("MIN_SAVED_DEPOSIT");
      if (requiredBaseLoan > capacity) reasons.push("BORROWING_CAPACITY");
      if (requiredBaseLoan > maxSchemeLoan) reasons.push("SCHEME_MAX_LOAN");
      if (price > schemeCap) reasons.push("SCHEME_PRICE_CAP");
      // scheme LMI is always $0
    } else {
      // --- Standard lending candidate -------------------------------------
      // At price 0, a fully cash-funded position (requiredBaseLoan 0) is fine;
      // a positive required loan with nothing to borrow against is not.
      var baseLvr = price > 0 ? requiredBaseLoan / price : (requiredBaseLoan > 0 ? Infinity : 0);
      lmi = baseLvr > 0.8 ? estimateIndicativeLMI({ baseLoanAmount: requiredBaseLoan, propertyValue: price, config: cfg }) : 0;
      var totalLoan = requiredBaseLoan + lmi;
      var totalLvr = price > 0 ? totalLoan / price : (totalLoan > 0 ? Infinity : 0);

      if (!isFiniteNumber(totalLoan) || !isFiniteNumber(totalLvr)) reasons.push("INVALID");
      if (totalLoan > capacity) reasons.push("BORROWING_CAPACITY");
      if (totalLvr > cfg.maxStandardTotalLvr) reasons.push("LVR_CAP");
    }

    // Common: funds must at least cover costs (price=0 edge). If requiredBaseLoan
    // clamped from a negative raw value, funds already exceed everything.
    // A positive base loan that exceeds no cap is fine.

    var baseLvrOut = price > 0 ? requiredBaseLoan / price : 0;
    var totalLoanOut = requiredBaseLoan + lmi;
    var totalLvrOut = price > 0 ? totalLoanOut / price : 0;
    var depositContribution = clampNonNegative(price - requiredBaseLoan); // portion of price funded by cash+fhog
    var remainingCash = totalFunds - (depositContribution + duty + otherCosts);

    return {
      feasible: reasons.length === 0,
      reasons: reasons,
      price: price,
      duty: duty,
      fhog: fhog,
      otherCosts: otherCosts,
      totalFunds: totalFunds,
      requiredBaseLoan: requiredBaseLoan,
      lmi: lmi,
      baseLoan: requiredBaseLoan,
      totalLoan: totalLoanOut,
      baseLvr: baseLvrOut,
      totalLvr: totalLvrOut,
      depositContribution: depositContribution,
      remainingCash: remainingCash,
      schemeCap: schemeCap,
      maxSchemeLoan: maxSchemeLoan,
    };
  }

  // Solve for the maximum feasible price for a pathway via binary search ($1).
  function solvePathway(pathway, inputs, cfg) {
    var cash = clampNonNegative(inputs.totalCash);
    var capacity = clampNonNegative(inputs.borrowingCapacity);

    // Safe strict upper bound: price can never exceed loan + cash + grant.
    var upper = Math.min(cfg.hardMaxPrice, capacity + cash + cfg.fhogAmount + 1000);
    if (!isFiniteNumber(upper) || upper <= 0) {
      var zero = evaluateCandidate(0, pathway, inputs, cfg);
      return { maxPrice: 0, detail: zero };
    }

    // If price 0 is not feasible, there isn't enough cash to cover costs.
    var atZero = evaluateCandidate(0, pathway, inputs, cfg);

    var lo = 0;
    var hi = upper;
    // Ensure hi is infeasible; if the whole range is feasible, hi is the answer.
    var hiEval = evaluateCandidate(hi, pathway, inputs, cfg);
    if (hiEval.feasible) {
      return { maxPrice: hi, detail: hiEval };
    }
    if (!atZero.feasible) {
      return { maxPrice: 0, detail: atZero };
    }

    // Binary search: invariant lo feasible, hi infeasible.
    var guard = 0;
    while (hi - lo > 1 && guard < 200) {
      var mid = Math.floor((lo + hi) / 2);
      if (evaluateCandidate(mid, pathway, inputs, cfg).feasible) lo = mid;
      else hi = mid;
      guard++;
    }
    return { maxPrice: lo, detail: evaluateCandidate(lo, pathway, inputs, cfg) };
  }

  // Human-readable limiting factor from a solved detail (evaluated just past max).
  function limitingFactorFor(pathway, maxPrice, inputs, cfg) {
    if (maxPrice <= 0) return "INSUFFICIENT_FUNDS";
    var justPast = evaluateCandidate(maxPrice + 1, pathway, inputs, cfg);
    if (justPast.feasible) return "UPPER_BOUND"; // hit the safe search ceiling / hard max
    var r = justPast.reasons;
    // Priority order for a clear message.
    var order = ["SCHEME_PRICE_CAP", "MIN_SAVED_DEPOSIT", "BORROWING_CAPACITY", "SCHEME_MAX_LOAN", "LVR_CAP", "INVALID"];
    for (var i = 0; i < order.length; i++) if (r.indexOf(order[i]) !== -1) return order[i];
    return "AVAILABLE_CASH";
  }

  function roundHeadlineDown(price) {
    return Math.floor(price / 1000) * 1000;
  }

  function buildResult(pathway, inputs, cfg) {
    var solved = solvePathway(pathway, inputs, cfg);
    var maxPrice = solved.maxPrice;
    var headline = roundHeadlineDown(maxPrice);
    // Report figures at the headline (rounded-down) price — always feasible.
    var detail = evaluateCandidate(headline > 0 ? headline : 0, pathway, inputs, cfg);
    var limiting = limitingFactorFor(pathway, maxPrice, inputs, cfg);

    return {
      pathway: pathway,
      feasible: maxPrice > 0,
      maxPrice: maxPrice,
      headlinePrice: headline,
      limitingFactor: limiting,
      duty: detail.duty,
      fhog: detail.fhog,
      otherCosts: detail.otherCosts,
      baseLoan: detail.baseLoan,
      lmi: detail.lmi,
      totalLoan: detail.totalLoan,
      baseLvr: detail.baseLvr,
      totalLvr: detail.totalLvr,
      depositContribution: detail.depositContribution,
      remainingCash: clampNonNegative(detail.remainingCash),
      schemeCap: detail.schemeCap,
      totalFunds: detail.totalFunds,
      // Funds / transaction position at the headline price.
      fundsPosition: {
        price: headline,
        duty: detail.duty,
        otherCosts: detail.otherCosts,
        lmiCapitalised: detail.lmi,
        totalPosition: headline + detail.duty + detail.otherCosts + detail.lmi,
        cashFunded: detail.depositContribution + detail.duty + detail.otherCosts,
        loanFundedPrice: detail.baseLoan,
        lmiAddedToLoan: detail.lmi,
      },
    };
  }

  /**
   * Estimate the maximum owner-occupied WA home purchase price.
   * @param {object} inputs
   * @param {number} inputs.borrowingCapacity   hard cap on the total loan (incl. capitalised LMI)
   * @param {number} inputs.totalCash           one total cash figure
   * @param {string} inputs.location            PERTH_CAPITAL_CITY | OTHER_WA_SOUTH_26 | OTHER_WA_NORTH_26
   * @param {string} inputs.propertyType        ESTABLISHED_HOME | NEW_COMPLETED_HOME
   * @param {string} inputs.pathway             SCHEME_2 | SCHEME_5 | STANDARD
   * @param {string} inputs.firstHomeDutyEligibility  'yes' | 'no' | 'unsure'
   * @param {string} inputs.fhogEligibility     'yes' | 'no' | 'unsure'
   * @param {number} [inputs.otherPurchaseCosts]
   * @param {object} [inputs.config]            override CALC_CONFIG (e.g. injected LMI table)
   */
  function calculateMaximumPurchasePrice(inputs) {
    var cfg = (inputs && inputs.config) || CALC_CONFIG;
    var messages = [];

    // ---- Validation -------------------------------------------------------
    var borrowingCapacity = Number(inputs && inputs.borrowingCapacity);
    var totalCash = Number(inputs && inputs.totalCash);
    if (!isFiniteNumber(borrowingCapacity) || borrowingCapacity < 0) borrowingCapacity = 0;
    if (!isFiniteNumber(totalCash) || totalCash < 0) totalCash = 0;

    var otherPurchaseCosts = Number(inputs && inputs.otherPurchaseCosts);
    if (!isFiniteNumber(otherPurchaseCosts) || otherPurchaseCosts < 0) {
      otherPurchaseCosts = cfg.defaultOtherPurchaseCosts;
    }

    var clean = {
      borrowingCapacity: borrowingCapacity,
      totalCash: totalCash,
      location: inputs.location,
      propertyType: inputs.propertyType,
      pathway: inputs.pathway,
      firstHomeDutyEligibility: inputs.firstHomeDutyEligibility || "unsure",
      fhogEligibility: inputs.propertyType === "NEW_COMPLETED_HOME" ? (inputs.fhogEligibility || "unsure") : "no",
      otherPurchaseCosts: otherPurchaseCosts,
      config: cfg,
    };

    if (borrowingCapacity <= 0 && totalCash <= 0) {
      return {
        ok: false,
        reason: "NO_INPUT",
        messages: ["Enter your borrowing capacity and available cash to see an estimate."],
        primary: null,
        secondary: null,
        inputsUsed: clean,
      };
    }

    if (clean.firstHomeDutyEligibility === "unsure") {
      messages.push("We have used the standard duty estimate because eligibility has not been confirmed.");
    }

    // ---- Primary (selected pathway) --------------------------------------
    var primary = buildResult(clean.pathway, clean, cfg);
    var usingScheme = clean.pathway === PATHWAY.SCHEME_2 || clean.pathway === PATHWAY.SCHEME_5;

    // FHOG-cap warning (new home, FHOG=yes, but the result sits above the cap).
    if (clean.propertyType === "NEW_COMPLETED_HOME" && clean.fhogEligibility === "yes") {
      var fhogCap = cfg.fhogCaps[clean.location];
      if (primary.headlinePrice > fhogCap) {
        messages.push(
          "Your estimated price is above the $" +
            fhogCap.toLocaleString("en-AU") +
            " First Home Owner Grant cap for this area, so the $10,000 grant has not been included."
        );
      }
    }

    // ---- Secondary (standard lending) when a scheme is selected ----------
    var secondary = null;
    if (usingScheme) {
      secondary = buildResult(PATHWAY.STANDARD, clean, cfg);
      if (secondary.feasible && secondary.maxPrice > primary.maxPrice && primary.limitingFactor === "SCHEME_PRICE_CAP") {
        messages.push(
          "Your estimated buying position may be higher than the government scheme property-price cap. To use the scheme, both the purchase price and the lender-assessed property value must remain within the applicable cap."
        );
      }
      if (!primary.feasible && primary.limitingFactor === "MIN_SAVED_DEPOSIT") {
        messages.push(
          "Your saved cash is below the minimum deposit this scheme requires. The scheme deposit must come from your own funds — the First Home Owner Grant cannot count towards it."
        );
      }
    } else if (!primary.feasible) {
      messages.push(
        "Based on these figures there isn't enough to cover the deposit, duty and costs for a purchase yet. A quick chat with Mesh Finance can help map out the gap."
      );
    }

    return {
      ok: true,
      usingScheme: usingScheme,
      primary: primary,
      secondary: secondary,
      messages: messages,
      inputsUsed: clean,
      config: { effectiveDate: cfg.effectiveDate, lastReviewed: cfg.lastReviewed },
    };
  }

  /* ==========================================================================
   * Public API
   * ========================================================================*/
  return {
    CALC_CONFIG: CALC_CONFIG,
    DEFAULT_INDICATIVE_LMI_RATE_BANDS: DEFAULT_INDICATIVE_LMI_RATE_BANDS,
    DEFAULT_LMI_LOAN_SIZE_FACTORS: DEFAULT_LMI_LOAN_SIZE_FACTORS,
    PATHWAY: PATHWAY,
    calculateWATransferDuty: calculateWATransferDuty,
    estimateIndicativeLMI: estimateIndicativeLMI,
    calculateMaximumPurchasePrice: calculateMaximumPurchasePrice,
    formatCurrency: formatCurrency,
    // exposed for reuse / testing
    _internal: {
      generalDuty: function (v) { return generalDuty(v, CALC_CONFIG); },
      residentialDuty: function (v) { return residentialDuty(v, CALC_CONFIG); },
      firstHomeOwnerDuty: function (v) { return firstHomeOwnerDuty(v, CALC_CONFIG); },
      units100: units100,
      evaluateCandidate: evaluateCandidate,
      roundHeadlineDown: roundHeadlineDown,
      fhogForPrice: function (price, inputs) { return fhogForPrice(price, inputs, CALC_CONFIG); },
    },
  };
});

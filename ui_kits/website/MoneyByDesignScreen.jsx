/* =============================================================================
 * Money by Design, budgeting tool screen.
 * Guided 6-step wizard + results dashboard. All maths live in window.MeshBudget
 * (budget-engine.js); PDF export in window.MeshBudgetPdf (budget-pdf.js).
 * Data autosaves to localStorage on this device only.
 * ===========================================================================*/

var MBD_STORAGE_KEY = "mesh_money_by_design_v1";

/* unique id without Date/Math.random dependence issues */
var MBD_UID = 0;
function mbdId() { MBD_UID += 1; return "mbd-" + MBD_UID + "-" + (Date.now ? Date.now() : 0); }

function mbdReduceMotion() {
  try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  catch (e) { return false; }
}

/* ----- expense seeding / reconciliation from the engine catalogue ---------- */
function mbdSeedGroup(group, housing) {
  var C = window.MeshBudget.CATALOG;
  var items;
  if (group === "home") items = C.home[housing] || C.home.other;
  else items = C[group] || [];
  return items.map(function (it) {
    return { id: mbdId(), key: group + "|" + it.name, group: group, name: it.name,
      amount: "", freq: it.freq || "monthly", bucket: it.bucket, housing: !!it.housing, custom: false };
  });
}

/* Keep expenses in sync with the household toggles, preserving anything the user
 * has already entered (matched by key) and never dropping custom rows. */
function mbdReconcile(expenses, flags) {
  var desired = ["home", "household", "transport", "health", "lifestyle"];
  if (flags.hasKids) desired.push("kids");
  if (flags.hasPets) desired.push("pets");
  var byKey = {};
  expenses.forEach(function (e) { if (!e.custom) byKey[e.key] = e; });
  var out = [];
  desired.forEach(function (group) {
    mbdSeedGroup(group, flags.housing || "other").forEach(function (seed) {
      var existing = byKey[seed.key];
      if (existing) out.push(existing);            // keep user's amount/freq/bucket
      else out.push(seed);
    });
  });
  // append custom rows in their original order
  expenses.forEach(function (e) { if (e.custom) out.push(e); });
  return out;
}

function mbdDefaultState() {
  return {
    view: "intro",
    incomes: [{ name: "", amount: "", freq: "monthly" }],
    hasPerson2: false,
    housing: "",
    hasKids: false,
    hasPets: false,
    mortgage: { lender: "", balance: "", rate: "" },
    expenses: [],
    debts: [],
    goals: [],
    buckets: Object.assign({}, window.MeshBudget.DEFAULT_BUCKETS),
    adjustBuckets: false,
  };
}

function mbdLoad() {
  try {
    var raw = window.localStorage.getItem(MBD_STORAGE_KEY);
    if (!raw) return null;
    var s = JSON.parse(raw);
    if (!s || typeof s !== "object") return null;
    var d = mbdDefaultState();
    return Object.assign(d, s, { buckets: Object.assign({}, d.buckets, s.buckets || {}) });
  } catch (e) { return null; }
}

/* ===========================================================================
 * Small presentational atoms (SVG charts, rings, gauge)
 * ===========================================================================*/

function MbdRing(props) {
  var size = props.size || 96, stroke = props.stroke || 9;
  var r = (size - stroke) / 2, c = 2 * Math.PI * r;
  var pct = Math.max(0, Math.min(100, isFinite(props.pct) ? props.pct : 0));
  var off = c - (pct / 100) * c;
  var reduce = mbdReduceMotion();
  return (
    <svg width={size} height={size} viewBox={"0 0 " + size + " " + size} role="img"
      aria-label={props.ariaLabel || (Math.round(pct) + "%")} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--gray-200)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={props.color || "var(--color-primary)"}
        strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
        transform={"rotate(-90 " + size / 2 + " " + size / 2 + ")"}
        style={{ transition: reduce ? "none" : "stroke-dashoffset .7s ease" }} />
      {props.center != null && (
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: props.centerSize || 18, fill: "var(--navy-700)" }}>
          {props.center}
        </text>
      )}
    </svg>
  );
}

function MbdDonut(props) {
  var segments = props.segments || [];
  var size = props.size || 240, stroke = props.stroke || 34;
  var r = (size - stroke) / 2, c = 2 * Math.PI * r;
  var total = segments.reduce(function (s, x) { return s + x.amount; }, 0);
  var reduce = mbdReduceMotion();
  var acc = 0;
  return (
    <svg width={size} height={size} viewBox={"0 0 " + size + " " + size} role="img"
      aria-label={props.ariaLabel || "Where your money goes"} style={{ display: "block", margin: "0 auto" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--gray-100)" strokeWidth={stroke} />
      {total > 0 && segments.map(function (seg, i) {
        var frac = seg.amount / total;
        var dash = frac * c;
        var el = (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={dash + " " + (c - dash)} strokeDashoffset={-acc}
            transform={"rotate(-90 " + size / 2 + " " + size / 2 + ")"}
            style={{ transition: reduce ? "none" : "stroke-dasharray .6s ease" }}>
            <title>{seg.label + ": " + window.MeshBudget.formatMoney(seg.amount)}</title>
          </circle>
        );
        acc += dash;
        return el;
      })}
      <circle cx={size / 2} cy={size / 2} r={r - stroke / 2 - 2} fill="var(--surface-card)" />
      <text x="50%" y="44%" textAnchor="middle" style={{ fontSize: 11, letterSpacing: ".06em", fill: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 700 }}>{props.centerLabel || "Income"}</text>
      <text x="50%" y="56%" textAnchor="middle" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, fill: "var(--navy-700)" }}>
        {window.MeshBudget.formatMoney(props.centerValue != null ? props.centerValue : total)}
      </text>
    </svg>
  );
}

function MbdGauge(props) {
  var pct = Math.max(0, Math.min(100, isFinite(props.pct) ? props.pct : 0));
  var reduce = mbdReduceMotion();
  return (
    <div>
      <div style={{ position: "relative", height: 14, borderRadius: 999, background: "var(--gray-100)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, width: pct + "%", background: props.color || "var(--color-primary)",
          borderRadius: 999, transition: reduce ? "none" : "width .7s ease" }} />
      </div>
      {props.marker != null && (
        <div style={{ position: "relative", height: 0 }}>
          <div title={props.markerLabel} style={{ position: "absolute", left: Math.min(props.marker, 100) + "%", top: -18,
            transform: "translateX(-50%)", fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
            ▲ {props.markerLabel}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===========================================================================
 * Input atoms
 * ===========================================================================*/

function MbdMoney(props) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 15 }}>$</span>
      <input type="text" inputMode="decimal" value={props.value} onChange={function (e) { props.onChange(e.target.value); }}
        placeholder={props.placeholder || "0"} aria-label={props.ariaLabel}
        style={{ width: "100%", padding: "11px 12px 11px 24px", border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)", fontSize: 15, fontFamily: "var(--font-body)", color: "var(--text-strong)",
          background: "var(--surface-card)", boxSizing: "border-box" }} />
    </div>
  );
}

function MbdFreq(props) {
  var opts = props.income ? window.MeshBudget.INCOME_FREQUENCIES : window.MeshBudget.EXPENSE_FREQUENCIES;
  var F = window.MeshBudget.FREQUENCIES;
  return (
    <select value={props.value} onChange={function (e) { props.onChange(e.target.value); }} aria-label={props.ariaLabel || "Frequency"}
      style={{ padding: "11px 10px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
        fontSize: 14.5, background: "var(--surface-card)", color: "var(--text-strong)", fontFamily: "var(--font-body)", width: "100%", boxSizing: "border-box" }}>
      {opts.map(function (k) { return <option key={k} value={k}>{F[k].label}</option>; })}
    </select>
  );
}

function MbdBucketSelect(props) {
  var M = window.MeshBudget.BUCKET_META, order = window.MeshBudget.BUCKET_ORDER;
  return (
    <select value={props.value} onChange={function (e) { props.onChange(e.target.value); }} aria-label="Budget bucket"
      style={{ padding: "9px 8px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)",
        fontSize: 12.5, background: "var(--blue-50)", color: "var(--color-primary-active)", fontWeight: 600,
        fontFamily: "var(--font-body)", width: "100%", boxSizing: "border-box" }}>
      {order.map(function (k) { return <option key={k} value={k}>{M[k].label}</option>; })}
    </select>
  );
}

/* Segmented / card toggle. options: [{value,label,sub?}] */
function MbdToggle(props) {
  var mobile = props.mobile;
  return (
    <div role="radiogroup" aria-label={props.legend} style={{ display: "grid",
      gridTemplateColumns: mobile ? "1fr" : "repeat(" + props.options.length + ", 1fr)", gap: 10 }}>
      {props.options.map(function (o) {
        var active = props.value === o.value;
        return (
          <button type="button" key={o.value} role="radio" aria-checked={active}
            onClick={function () { props.onChange(o.value); }}
            style={{ appearance: "none", cursor: "pointer", textAlign: "left", padding: "14px 16px",
              borderRadius: "var(--radius-md)", borderWidth: 1.5, borderStyle: "solid",
              borderColor: active ? "var(--color-primary)" : "var(--border-subtle)",
              background: active ? "var(--blue-50)" : "var(--surface-card)", display: "flex", flexDirection: "column", gap: 2,
              boxShadow: active ? "var(--ring)" : "none", transition: "border-color .15s ease, background .15s ease" }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: active ? "var(--color-primary-active)" : "var(--text-strong)" }}>{o.label}</span>
            {o.sub && <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{o.sub}</span>}
          </button>
        );
      })}
    </div>
  );
}

function MbdYesNo(props) {
  return (
    <div style={{ display: "inline-flex", gap: 8 }}>
      {[["yes", "Yes"], ["no", "No"]].map(function (o) {
        var active = props.value === o[0];
        return (
          <button type="button" key={o[0]} aria-pressed={active} onClick={function () { props.onChange(o[0]); }}
            style={{ cursor: "pointer", padding: "9px 22px", borderRadius: 999, borderWidth: 1.5, borderStyle: "solid",
              borderColor: active ? "var(--color-primary)" : "var(--border-default)", fontWeight: 700, fontSize: 14.5,
              background: active ? "var(--color-primary)" : "var(--surface-card)", color: active ? "#fff" : "var(--text-body)" }}>
            {o[1]}
          </button>
        );
      })}
    </div>
  );
}

/* An expandable section shell for grouping expenses. */
function MbdSection(props) {
  var { useState } = React;
  var [open, setOpen] = useState(props.defaultOpen !== false);
  return (
    <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 14, background: "var(--surface-card)" }}>
      <button type="button" onClick={function () { setOpen(!open); }} aria-expanded={open}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          padding: "16px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-display)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {props.emoji && <span style={{ fontSize: 20 }} aria-hidden="true">{props.emoji}</span>}
          <span style={{ fontWeight: 700, fontSize: 16.5, color: "var(--navy-700)" }}>{props.title}</span>
          {props.hint && <span style={{ fontSize: 12.5, color: "var(--text-subtle)", fontWeight: 400 }}>{props.hint}</span>}
        </span>
        <span aria-hidden="true" style={{ color: "var(--text-muted)", fontSize: 13, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▼</span>
      </button>
      {open && <div style={{ padding: "4px 18px 18px" }}>{props.children}</div>}
    </div>
  );
}

/* ===========================================================================
 * Expense row
 * ===========================================================================*/
function MbdExpenseRow(props) {
  var e = props.expense, mobile = props.mobile;
  var B = window.MeshBudget;
  var monthly = B.toMonthly(e.amount, e.freq);
  var nameEl = e.custom
    ? <input value={e.name} onChange={function (ev) { props.onChange("name", ev.target.value); }} placeholder="Expense name"
        aria-label="Expense name" style={{ padding: "10px 12px", border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)", fontSize: 14.5, fontFamily: "var(--font-body)", width: "100%", boxSizing: "border-box" }} />
    : <span style={{ fontSize: 14.5, color: "var(--text-strong)", fontWeight: 600 }}>{e.name}</span>;
  var remove = function (px) { return (
    <button type="button" onClick={props.onRemove} aria-label={"Remove " + e.name}
      style={{ background: "none", border: "none", color: "var(--text-subtle)", cursor: "pointer", fontSize: px, lineHeight: 1, padding: "0 4px" }}>×</button>
  ); };

  /* Mobile: name + remove on top, amount|frequency side by side, then bucket +
     the monthly figure, three compact rows instead of four stacked controls. */
  if (mobile) {
    return (
      <div style={{ padding: "12px 0", borderBottom: "1px solid var(--gray-100)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>{nameEl}</div>
          {remove(24)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <MbdMoney value={e.amount} onChange={function (v) { props.onChange("amount", v); }} ariaLabel={e.name + " amount"} />
          <MbdFreq value={e.freq} onChange={function (v) { props.onChange("freq", v); }} ariaLabel={e.name + " frequency"} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <div style={{ width: 160 }}><MbdBucketSelect value={e.bucket} onChange={function (v) { props.onChange("bucket", v); }} /></div>
          {monthly > 0 && <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--text-muted)" }}>{B.formatMoney(monthly)}/mo</span>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 8, gridTemplateColumns: "minmax(0,1.5fr) 120px 130px 130px 28px",
      alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--gray-100)" }}>
      {nameEl}
      <MbdMoney value={e.amount} onChange={function (v) { props.onChange("amount", v); }} ariaLabel={e.name + " amount"} />
      <MbdFreq value={e.freq} onChange={function (v) { props.onChange("freq", v); }} ariaLabel={e.name + " frequency"} />
      <MbdBucketSelect value={e.bucket} onChange={function (v) { props.onChange("bucket", v); }} />
      {remove(18)}
    </div>
  );
}

/* ===========================================================================
 * MAIN SCREEN
 * ===========================================================================*/
function MoneyByDesignScreen(props) {
  var onNav = props.onNav;
  var { useState, useEffect, useMemo, useRef } = React;
  var B = window.MeshBudget;
  var isMobile = window.useIsMobile();
  var DS = window.MeshFinanceDesignSystem_5c98d0;
  var Button = DS.Button, Card = DS.Card, Badge = DS.Badge, Alert = DS.Alert;

  var [state, setState] = useState(function () { return mbdLoad() || mbdDefaultState(); });
  var [pdfBusy, setPdfBusy] = useState(false);
  var firstLoad = useRef(true);

  /* Autosave (debounced-lite: on every change). */
  useEffect(function () {
    if (firstLoad.current) { firstLoad.current = false; return; }
    try { window.localStorage.setItem(MBD_STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  function patch(p) { setState(function (s) { return Object.assign({}, s, p); }); }
  function setView(v) { patch({ view: v }); window.scrollTo({ top: 0, behavior: mbdReduceMotion() ? "auto" : "smooth" }); }

  /* reconcile expenses whenever housing/kids/pets change */
  function setFlags(p) {
    setState(function (s) {
      var next = Object.assign({}, s, p);
      next.expenses = mbdReconcile(next.expenses, { housing: next.housing, hasKids: next.hasKids, hasPets: next.hasPets });
      return next;
    });
  }

  var results = useMemo(function () { return B.computeResults(state); }, [state]);

  /* ---- income helpers ---- */
  function setIncome(i, field, v) {
    setState(function (s) {
      var incomes = s.incomes.slice();
      incomes[i] = Object.assign({}, incomes[i], (field === "" ? v : (function () { var o = {}; o[field] = v; return o; })()));
      return Object.assign({}, s, { incomes: incomes });
    });
  }
  function addPerson2() {
    setState(function (s) {
      if (s.hasPerson2) return s;
      var incomes = s.incomes.slice(); incomes[1] = { name: "", amount: "", freq: "monthly" };
      return Object.assign({}, s, { incomes: incomes, hasPerson2: true });
    });
  }
  function removePerson2() {
    setState(function (s) { return Object.assign({}, s, { incomes: [s.incomes[0]], hasPerson2: false }); });
  }

  /* ---- expense helpers ---- */
  function changeExpense(id, field, v) {
    setState(function (s) {
      return Object.assign({}, s, { expenses: s.expenses.map(function (e) {
        if (e.id !== id) return e; var o = {}; o[field] = v; return Object.assign({}, e, o);
      }) });
    });
  }
  function removeExpense(id) {
    setState(function (s) { return Object.assign({}, s, { expenses: s.expenses.filter(function (e) { return e.id !== id; }) }); });
  }
  function addCustomExpense(bucket) {
    setState(function (s) {
      var row = { id: mbdId(), key: "custom|" + mbdId(), group: "custom", name: "", amount: "", freq: "monthly", bucket: bucket || "essentials", housing: false, custom: true };
      return Object.assign({}, s, { expenses: s.expenses.concat([row]) });
    });
  }

  /* ---- debts ---- */
  function addDebt() {
    setState(function (s) {
      return Object.assign({}, s, { debts: s.debts.concat([{ id: mbdId(), type: "Credit card", name: "", balance: "", repayment: "", freq: "monthly", rate: "" }]) });
    });
  }
  function changeDebt(id, field, v) {
    setState(function (s) { return Object.assign({}, s, { debts: s.debts.map(function (d) { if (d.id !== id) return d; var o = {}; o[field] = v; return Object.assign({}, d, o); }) }); });
  }
  function removeDebt(id) { setState(function (s) { return Object.assign({}, s, { debts: s.debts.filter(function (d) { return d.id !== id; }) }); }); }

  /* ---- goals ---- */
  function addGoal() {
    setState(function (s) {
      return Object.assign({}, s, { goals: s.goals.concat([{ id: mbdId(), name: "", target: "", saved: "", targetDate: "", contribution: "", freq: "monthly" }]) });
    });
  }
  function changeGoal(id, field, v) {
    setState(function (s) { return Object.assign({}, s, { goals: s.goals.map(function (g) { if (g.id !== id) return g; var o = {}; o[field] = v; return Object.assign({}, g, o); }) }); });
  }
  function removeGoal(id) { setState(function (s) { return Object.assign({}, s, { goals: s.goals.filter(function (g) { return g.id !== id; }) }); }); }

  /* ---- buckets ---- */
  function setBucket(k, v) {
    setState(function (s) { var b = Object.assign({}, s.buckets); b[k] = v === "" ? 0 : Math.max(0, parseInt(v, 10) || 0); return Object.assign({}, s, { buckets: b }); });
  }
  function resetBuckets() { patch({ buckets: Object.assign({}, B.DEFAULT_BUCKETS) }); }

  function clearData() {
    if (!window.confirm("Clear your Money by Design information from this device? This can't be undone.")) return;
    try { window.localStorage.removeItem(MBD_STORAGE_KEY); } catch (e) {}
    setState(mbdDefaultState());
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  async function downloadPdf() {
    setPdfBusy(true);
    try {
      await window.MeshBudgetPdf.download(results, {
        firstName: (state.incomes[0] && state.incomes[0].name) || "",
        housing: state.housing, mortgage: state.mortgage,
      });
    } catch (e) { window.alert("Sorry, the PDF couldn't be generated just now. Please try again."); }
    setPdfBusy(false);
  }

  /* group expenses for a step by their catalogue group */
  function groupRows(groups) {
    return state.expenses.filter(function (e) { return groups.indexOf(e.group) !== -1; });
  }
  function rowsFor(group) { return state.expenses.filter(function (e) { return e.group === group; }); }

  var sx = mbdStyles;
  var incomeMonthly = results.income.monthly;

  /* ============================ RENDER: shell ============================ */
  function Shell(children) {
    return (
      <div style={sx.page}>
        <section style={sx.hero}>
          <div style={{ ...sx.heroInner, ...(isMobile ? { padding: "24px 20px 26px" } : {}) }}>
            <Badge color="solid">Money by Design</Badge>
            <h1 style={{ ...sx.h1, ...(isMobile ? { fontSize: 27 } : {}) }}>Money by Design</h1>
            <p style={{ ...sx.tagline, ...(isMobile ? { fontSize: 15.5 } : {}) }}>Map out your money. Build the life you want to live.</p>
          </div>
        </section>
        <div style={sx.body}>{children}</div>
        <p style={sx.disclaimer}>{MBD_DISCLAIMER}</p>
      </div>
    );
  }

  /* ===================== INTRO (concept B: show the payoff) ============== */
  if (state.view === "intro") {
    /* Illustrative sample so first-time visitors can see the kind of result
       they'll get. Not the user's data, labelled "Example". */
    var introSample = [
      { key: "housing", label: "Mortgage", amount: 2750, color: "#2167a0" },
      { key: "essentials", label: "Other essentials", amount: 2880, color: B.BUCKET_META.essentials.color },
      { key: "lifestyle", label: "Lifestyle", amount: 575, color: B.BUCKET_META.lifestyle.color },
      { key: "goals", label: "Goals", amount: 525, color: B.BUCKET_META.goals.color },
      { key: "futureYou", label: "Future You", amount: 850, color: B.BUCKET_META.futureYou.color },
      { key: "breathing", label: "Breathing room", amount: 870, color: "#cfe6f8" },
    ];
    return Shell(
      <Card elevation="shadow" style={{ padding: 0, overflow: "hidden" }}>
        <div style={isMobile ? { display: "block" } : { display: "grid", gridTemplateColumns: "1.05fr .95fr" }}>
          <div style={sx.introLeft}>
            <Badge color="solid">Money by Design</Badge>
            <h2 style={sx.introHeadline}>Map out your money.</h2>
            <p style={sx.introTagline}>Build the life you want to live.</p>
            <p style={sx.introLead}>See what's coming in, where it's going and how much breathing room you've really got, in about five minutes.</p>
            <Button size="lg" onClick={function () { setView("step1"); }} iconRight={<window.MeshIcons.ArrowRight width={18} height={18} />}>Build My Money Plan</Button>
            <p style={sx.introMicro}>No sign-up · saved on your device</p>
          </div>
          <div style={sx.introRight}>
            <h3 style={sx.peekTitle}>Here's what you'll see</h3>
            <div style={sx.peekCard}>
              <MbdDonut segments={introSample} size={116} stroke={17} centerValue={8450} centerLabel="Income" />
              <div style={{ minWidth: 0 }}>
                <div style={sx.peekH}>Your breathing room</div>
                <div style={sx.peekBig}>$870<span style={sx.peekPer}> / mo</span></div>
                <div style={sx.peekSub}>left after everything's covered</div>
              </div>
            </div>
            <p style={sx.peekBlurb}>Plus where your money goes, how your buckets compare, your mortgage share and progress on your goals.</p>
          </div>
        </div>
      </Card>
    );
  }

  /* ============================ WIZARD scaffolding ============================ */
  var STEPS = [
    { key: "step1", label: "Your Household" },
    { key: "step2", label: "Everyday Spending" },
    { key: "step3", label: "Your Lifestyle" },
    { key: "step4", label: "Your Debts" },
    { key: "step5", label: "Your Goals" },
  ];
  var stepIndex = STEPS.map(function (s) { return s.key; }).indexOf(state.view);

  function StepFrame(title, subtitle, children, opts) {
    opts = opts || {};
    return (
      <div style={sx.wizardWrap}>
        <div style={sx.progressRow}>
          <div style={sx.progressTrack}><div style={{ ...sx.progressFill, width: ((stepIndex + 1) / STEPS.length * 100) + "%" }} /></div>
          <span style={sx.stepCount}>Step {stepIndex + 1} of {STEPS.length}</span>
        </div>
        <h2 style={sx.stepTitle}>{title}</h2>
        {subtitle && <p style={sx.stepSub}>{subtitle}</p>}
        <Card elevation="shadow" style={sx.stepCard}>{children}</Card>
        <div style={sx.navRow}>
          <button type="button" onClick={function () { setView(stepIndex === 0 ? "intro" : STEPS[stepIndex - 1].key); }} style={sx.backBtn}>← Back</button>
          <Button size="lg" onClick={opts.onNext || function () { setView(STEPS[stepIndex + 1].key); }}
            iconRight={<window.MeshIcons.ArrowRight width={18} height={18} />}>{opts.nextLabel || "Continue"}</Button>
        </div>
        <button type="button" onClick={clearData} style={sx.clearLink}>Clear my saved data</button>
      </div>
    );
  }

  /* ---------------- STEP 1: household ---------------- */
  if (state.view === "step1") {
    return Shell(StepFrame("Your Household", "A couple of quick questions so we only ask about what's relevant to you.", (
      <div style={{ display: "grid", gap: 24 }}>
        <div>
          <h3 style={sx.blockH}>Your income</h3>
          <p style={sx.blockHint}>Enter your take-home (after-tax) income. We'll convert everything to a monthly figure for you.</p>
          {state.incomes.map(function (p, i) {
            if (i === 1 && !state.hasPerson2) return null;
            return (
              <div key={i} style={sx.incomeBlock}>
                <div style={sx.incomeHead}>
                  <span style={sx.personTag}>{i === 0 ? "You" : "Second income"}</span>
                  {i === 1 && <button type="button" onClick={removePerson2} style={sx.removeInline}>Remove</button>}
                </div>
                <div style={{ display: "grid", gap: 10, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr" }}>
                  <input value={p.name} onChange={function (e) { setIncome(i, "name", e.target.value); }} placeholder="First name (optional)"
                    aria-label="First name" style={sx.textInput} />
                  <MbdMoney value={p.amount} onChange={function (v) { setIncome(i, "amount", v); }} ariaLabel="Take-home income" placeholder="Take-home" />
                  <MbdFreq income value={p.freq} onChange={function (v) { setIncome(i, "freq", v); }} />
                </div>
              </div>
            );
          })}
          {!state.hasPerson2 && <button type="button" onClick={addPerson2} style={sx.addBtn}>+ Add a second income</button>}
          <div style={sx.incomeTotal}>
            <span>Total household take-home</span>
            <b>{B.formatMoney(incomeMonthly)} <span style={{ fontWeight: 500, color: "var(--text-muted)", fontSize: 13 }}>/ month</span></b>
          </div>
        </div>

        <div>
          <h3 style={sx.blockH}>What does your household look like?</h3>
          <p style={sx.blockHint}>Housing</p>
          <MbdToggle legend="Housing" mobile={isMobile} value={state.housing}
            onChange={function (v) { setFlags({ housing: v }); }} options={B.HOUSING_OPTIONS.map(function (o) { return { value: o.value, label: o.label }; })} />
        </div>

        <div style={{ display: "grid", gap: 18, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
          <div style={sx.toggleCard}>
            <div><div style={sx.toggleCardH}>👶 Do you have kids?</div><div style={sx.blockHint}>We'll only show child-related expenses if you do.</div></div>
            <MbdYesNo value={state.hasKids ? "yes" : "no"} onChange={function (v) { setFlags({ hasKids: v === "yes" }); }} />
          </div>
          <div style={sx.toggleCard}>
            <div><div style={sx.toggleCardH}>🐾 Do you have pets?</div><div style={sx.blockHint}>We'll only show pet expenses if you do.</div></div>
            <MbdYesNo value={state.hasPets ? "yes" : "no"} onChange={function (v) { setFlags({ hasPets: v === "yes" }); }} />
          </div>
        </div>
      </div>
    ), { onNext: function () { if (!state.housing) { setFlags({ housing: "other" }); } setView("step2"); } }));
  }

  /* ---------------- STEP 2: everyday spending (essentials) ---------------- */
  if (state.view === "step2") {
    var homeEmoji = state.housing === "rent" ? "🔑" : "🏠";
    return Shell(StepFrame("Your Everyday Spending", "Fill in what you can. Leave anything that doesn't apply at $0, you don't need to complete every field.", (
      <div>
        <MbdSection title="Home" emoji={homeEmoji} defaultOpen>
          {mbdExpenseTable(rowsFor("home"), isMobile, changeExpense, removeExpense)}
          {state.housing === "mortgage" && (
            <div style={sx.loanPanel}>
              <div style={sx.loanPanelH}>Loan details (optional)</div>
              <p style={sx.blockHint}>Only used for your Mortgage Check, nothing here is required.</p>
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
                <input value={state.mortgage.lender} onChange={function (e) { patch({ mortgage: Object.assign({}, state.mortgage, { lender: e.target.value }) }); }} placeholder="Current lender" aria-label="Current lender" style={sx.textInput} />
                <MbdMoney value={state.mortgage.balance} onChange={function (v) { patch({ mortgage: Object.assign({}, state.mortgage, { balance: v }) }); }} ariaLabel="Approximate loan balance" placeholder="Loan balance" />
                <div style={{ position: "relative" }}>
                  <input value={state.mortgage.rate} onChange={function (e) { patch({ mortgage: Object.assign({}, state.mortgage, { rate: e.target.value }) }); }} placeholder="Interest rate" inputMode="decimal" aria-label="Interest rate"
                    style={{ ...sx.textInput, paddingRight: 28 }} />
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>%</span>
                </div>
              </div>
            </div>
          )}
        </MbdSection>
        <MbdSection title="Household" emoji="💡">{mbdExpenseTable(rowsFor("household"), isMobile, changeExpense, removeExpense)}</MbdSection>
        <MbdSection title="Transport" emoji="🚗" defaultOpen={false}>{mbdExpenseTable(rowsFor("transport"), isMobile, changeExpense, removeExpense)}</MbdSection>
        <MbdSection title="Health" emoji="➕" defaultOpen={false}>{mbdExpenseTable(rowsFor("health"), isMobile, changeExpense, removeExpense)}</MbdSection>
        {state.hasKids && <MbdSection title="Kids" emoji="👶" defaultOpen={false}>{mbdExpenseTable(rowsFor("kids"), isMobile, changeExpense, removeExpense)}</MbdSection>}
        {state.hasPets && <MbdSection title="Pets" emoji="🐾" defaultOpen={false}>{mbdExpenseTable(rowsFor("pets"), isMobile, changeExpense, removeExpense)}</MbdSection>}
        <button type="button" onClick={function () { addCustomExpense("essentials"); }} style={sx.addBtn}>+ Add another expense</button>
        {groupRows(["custom"]).filter(function (e) { return e.bucket === "essentials"; }).length > 0 &&
          <div style={{ marginTop: 8 }}>{mbdExpenseTable(state.expenses.filter(function (e) { return e.custom && e.bucket === "essentials"; }), isMobile, changeExpense, removeExpense)}</div>}
      </div>
    )));
  }

  /* ---------------- STEP 3: lifestyle ---------------- */
  if (state.view === "step3") {
    return Shell(StepFrame("Your Lifestyle", "The things you choose to enjoy. There's no right answer here, just what's true for you.", (
      <div>
        <MbdSection title="Lifestyle" emoji="✨" defaultOpen>{mbdExpenseTable(rowsFor("lifestyle"), isMobile, changeExpense, removeExpense)}</MbdSection>
        <button type="button" onClick={function () { addCustomExpense("lifestyle"); }} style={sx.addBtn}>+ Add another lifestyle expense</button>
        {state.expenses.filter(function (e) { return e.custom && e.bucket === "lifestyle"; }).length > 0 &&
          <div style={{ marginTop: 8 }}>{mbdExpenseTable(state.expenses.filter(function (e) { return e.custom && e.bucket === "lifestyle"; }), isMobile, changeExpense, removeExpense)}</div>}
      </div>
    )));
  }

  /* ---------------- STEP 4: debts ---------------- */
  if (state.view === "step4") {
    return Shell(StepFrame("Your Debts", "Add any debts you're paying off. These sit in your Future You bucket. No debts? Just continue.", (
      <div>
        {state.debts.length === 0 && <p style={sx.emptyNote}>No debts added yet. Add one below, or continue if you have none.</p>}
        {state.debts.map(function (d) {
          return (
            <div key={d.id} style={sx.debtCard}>
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr" }}>
                <label style={sx.miniLabel}>Debt type
                  <select value={d.type} onChange={function (e) { changeDebt(d.id, "type", e.target.value); }} style={sx.select}>
                    {B.DEBT_TYPES.map(function (t) { return <option key={t}>{t}</option>; })}
                  </select>
                </label>
                <label style={sx.miniLabel}>Name (optional)
                  <input value={d.name} onChange={function (e) { changeDebt(d.id, "name", e.target.value); }} placeholder="e.g. Visa" style={sx.textInput} />
                </label>
                <label style={sx.miniLabel}>Current balance
                  <MbdMoney value={d.balance} onChange={function (v) { changeDebt(d.id, "balance", v); }} ariaLabel="Current balance" />
                </label>
                <label style={sx.miniLabel}>Repayment
                  <MbdMoney value={d.repayment} onChange={function (v) { changeDebt(d.id, "repayment", v); }} ariaLabel="Current repayment" />
                </label>
                <label style={sx.miniLabel}>Frequency
                  <MbdFreq value={d.freq} onChange={function (v) { changeDebt(d.id, "freq", v); }} />
                </label>
                <label style={sx.miniLabel}>Interest rate (optional)
                  <div style={{ position: "relative" }}>
                    <input value={d.rate} onChange={function (e) { changeDebt(d.id, "rate", e.target.value); }} placeholder="Optional" inputMode="decimal" style={{ ...sx.textInput, paddingRight: 28 }} />
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>%</span>
                  </div>
                </label>
              </div>
              <button type="button" onClick={function () { removeDebt(d.id); }} style={sx.removeInline}>Remove debt</button>
            </div>
          );
        })}
        <button type="button" onClick={addDebt} style={sx.addBtn}>+ Add a debt</button>
        {results.debt.count > 0 && (
          <div style={sx.debtSummary}>
            <div><span style={sx.dsLabel}>Total balance</span><b>{B.formatMoney(results.debt.totalBalance)}</b></div>
            <div><span style={sx.dsLabel}>Monthly repayments</span><b>{B.formatMoney(results.debt.monthlyRepayments)}</b></div>
            <div><span style={sx.dsLabel}>Of take-home income</span><b>{B.formatPct(results.debt.pctOfIncome)}</b></div>
          </div>
        )}
      </div>
    )));
  }

  /* ---------------- STEP 5: goals ---------------- */
  if (state.view === "step5") {
    return Shell(StepFrame("What Are You Building Towards?", "Add the things you're saving for. Contributions sit in your Goals bucket.", (
      <div>
        {state.goals.length === 0 && <p style={sx.emptyNote}>No goals yet. Add one below, or continue.</p>}
        {state.goals.map(function (g) {
          var gr = B.goalResult(g, new Date());
          return (
            <div key={g.id} style={sx.debtCard}>
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr" }}>
                <label style={sx.miniLabel}>Goal
                  <input list="mbd-goal-presets" value={g.name} onChange={function (e) { changeGoal(g.id, "name", e.target.value); }} placeholder="e.g. Japan holiday" style={sx.textInput} />
                </label>
                <label style={sx.miniLabel}>Target amount<MbdMoney value={g.target} onChange={function (v) { changeGoal(g.id, "target", v); }} ariaLabel="Target amount" /></label>
                <label style={sx.miniLabel}>Already saved<MbdMoney value={g.saved} onChange={function (v) { changeGoal(g.id, "saved", v); }} ariaLabel="Amount already saved" /></label>
                <label style={sx.miniLabel}>Target date
                  <input type="date" value={g.targetDate} onChange={function (e) { changeGoal(g.id, "targetDate", e.target.value); }} style={sx.textInput} />
                </label>
                <label style={sx.miniLabel}>Regular contribution (optional)<MbdMoney value={g.contribution} onChange={function (v) { changeGoal(g.id, "contribution", v); }} ariaLabel="Planned contribution" /></label>
                <label style={sx.miniLabel}>Frequency<MbdFreq value={g.freq} onChange={function (v) { changeGoal(g.id, "freq", v); }} /></label>
              </div>
              {B.num(g.target) > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                  <MbdRing size={54} stroke={7} pct={gr.savedPct} color={B.BUCKET_META.goals.color} center={Math.round(gr.savedPct) + "%"} centerSize={12} />
                  <div style={{ fontSize: 13.5, color: "var(--text-body)" }}>
                    <b>{g.name || "Goal"}</b>,{B.formatMoney(gr.saved)} saved of {B.formatMoney(gr.target)}
                    {gr.pastDue && <div style={{ color: "var(--color-warning)", fontSize: 12.5 }}>Target date has passed, update it to see what's needed.</div>}
                  </div>
                </div>
              )}
              <button type="button" onClick={function () { removeGoal(g.id); }} style={sx.removeInline}>Remove goal</button>
            </div>
          );
        })}
        <datalist id="mbd-goal-presets">{B.GOAL_PRESETS.map(function (p) { return <option key={p} value={p} />; })}</datalist>
        <button type="button" onClick={addGoal} style={sx.addBtn}>+ Add a goal</button>
      </div>
    ), { nextLabel: "See my Money by Design", onNext: function () { setView("results"); } }));
  }

  /* ============================ RESULTS ============================ */
  return Shell(<MbdResults state={state} results={results} isMobile={isMobile} B={B} sx={sx} onNav={onNav}
    setView={setView} setBucket={setBucket} resetBuckets={resetBuckets} patch={patch}
    downloadPdf={downloadPdf} pdfBusy={pdfBusy} clearData={clearData} />);
}

/* helper to render an expense table (kept outside the row map for clarity) */
function mbdExpenseTable(rows, mobile, changeExpense, removeExpense) {
  if (!rows.length) return <p style={{ fontSize: 13, color: "var(--text-subtle)", margin: "6px 0" }}>Nothing here yet.</p>;
  return (
    <div>
      {!mobile && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) 120px 130px 130px 28px", gap: 8, padding: "0 0 6px", fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-subtle)", fontWeight: 700 }}>
          <span>Expense</span><span>Amount</span><span>How often</span><span>Bucket</span><span></span>
        </div>
      )}
      {rows.map(function (e) {
        return <MbdExpenseRow key={e.id} expense={e} mobile={mobile}
          onChange={function (f, v) { changeExpense(e.id, f, v); }} onRemove={function () { removeExpense(e.id); }} />;
      })}
    </div>
  );
}

var MBD_DISCLAIMER = "This tool is designed to help you understand your household budget and is for general information only. Suggested allocations are guides only and may not be suitable for your individual circumstances. Results are based solely on the information you enter and do not constitute personal financial advice, credit advice or a lending assessment.";

/* ===========================================================================
 * RESULTS DASHBOARD
 * ===========================================================================*/
function MbdBreakdownBucket(props) {
  var { useState } = React;
  var [open, setOpen] = useState(false);
  var B = window.MeshBudget, sx = mbdStyles;
  var items = (props.items || []).slice().sort(function (a, b) { return b.monthly - a.monthly; });
  var total = items.reduce(function (s, x) { return s + x.monthly; }, 0);
  return (
    <div style={sx.breakdownItem}>
      <button type="button" onClick={function () { setOpen(!open); }} aria-expanded={open} style={sx.breakdownHead}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: props.color }} />
          <b style={{ color: "var(--navy-700)" }}>{props.label}</b>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{B.formatMoney(total)}/mo</span>
        </span>
        <span aria-hidden="true" style={{ color: "var(--text-subtle)", fontSize: 12, transform: open ? "rotate(180deg)" : "none" }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: "4px 4px 10px 26px" }}>
          {items.length === 0 && <div style={{ fontSize: 13, color: "var(--text-subtle)" }}>Nothing in this bucket yet.</div>}
          {items.map(function (it, i) {
            return <div key={i} style={sx.breakdownLine}><span>{it.name}</span><span>{B.formatMoney(it.monthly)}</span></div>;
          })}
        </div>
      )}
    </div>
  );
}

function MbdResults(props) {
  var state = props.state, r = props.results, isMobile = props.isMobile, B = props.B, sx = props.sx, onNav = props.onNav;
  var breathing = r.breathingRoom;
  var hasLending = r.debt.count > 0 || (state.mortgage && (B.num(state.mortgage.balance) > 0 || state.mortgage.lender));

  var toneColor = { under: "var(--color-success)", around: "var(--color-success)", ahead: "var(--color-success)",
    slight: "var(--color-primary)", "build-slight": "var(--color-primary)",
    notable: "var(--color-warning)", significant: "var(--color-warning)", build: "var(--color-warning)" };

  var bucketsInvalid = !r.bucketsValid;

  return (
    <div style={{ display: "grid", gap: 22 }}>
      {/* Header stats */}
      <Mbd_Card>
        <h2 style={sx.resultHead}>Your Money by Design</h2>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr" }}>
          <div style={sx.statCard}>
            <span style={sx.statLabel}>Household take-home</span>
            <span style={sx.statValue}>{B.formatMoney(r.income.monthly)}<span style={sx.perMo}> / month</span></span>
          </div>
          <div style={sx.statCard}>
            <span style={sx.statLabel}>Total current spending</span>
            <span style={sx.statValue}>{B.formatMoney(r.totals.outgoings)}<span style={sx.perMo}> / month</span></span>
          </div>
          <div style={{ ...sx.statCard, background: breathing >= 0 ? "var(--green-50)" : "var(--blue-50)", borderColor: breathing >= 0 ? "var(--green-500)" : "var(--color-primary)" }}>
            <span style={sx.statLabel}>Your breathing room</span>
            <span style={{ ...sx.statValue, color: breathing >= 0 ? "var(--green-600)" : "var(--navy-700)" }}>{B.formatMoney(breathing)}<span style={sx.perMo}> / month</span></span>
          </div>
        </div>
        {breathing < 0 && (
          <p style={sx.softNote}>Your current plan is using a little more than your monthly income. That gives us a useful place to start, have a look through the categories below to see where there may be room to adjust.</p>
        )}
      </Mbd_Card>

      {/* Where your money goes */}
      <Mbd_Card>
        <h3 style={sx.sectionH}>Where your money goes</h3>
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: isMobile ? "1fr" : "260px 1fr", alignItems: "center" }}>
          <MbdDonut segments={r.chart.segments} size={isMobile ? 220 : 240} centerValue={r.income.monthly > 0 ? r.income.monthly : r.totals.outgoings} centerLabel={r.income.monthly > 0 ? "Income" : "Spending"} />
          <div style={{ display: "grid", gap: 8 }}>
            {r.chart.segments.length === 0 && <p style={{ color: "var(--text-muted)" }}>Add your income and expenses to see this chart.</p>}
            {r.chart.segments.map(function (s) {
              return (
                <div key={s.key} style={sx.legendItem}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color }} />
                    <span style={{ fontSize: 14, color: "var(--text-body)" }}>{s.label}</span>
                  </span>
                  <span style={{ fontSize: 13.5, color: "var(--text-strong)", fontWeight: 600 }}>{B.formatMoney(s.amount)} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>· {B.formatPct(s.pct)}</span></span>
                </div>
              );
            })}
          </div>
        </div>
      </Mbd_Card>

      {/* Four buckets */}
      <Mbd_Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
          <h3 style={sx.sectionH}>Your four buckets</h3>
          <button type="button" onClick={function () { props.patch({ adjustBuckets: !state.adjustBuckets }); }} style={sx.linkBtn}>{state.adjustBuckets ? "Hide bucket settings" : "Adjust my buckets"}</button>
        </div>

        {state.adjustBuckets && (
          <div style={sx.adjustWrap}>
            <p style={sx.blockHint}>These are suggested starting points. Adjust to suit your household, they need to total 100%.</p>
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)" }}>
              {B.BUCKET_ORDER.map(function (k) {
                return (
                  <label key={k} style={sx.miniLabel}>{B.BUCKET_META[k].label}
                    <div style={{ position: "relative" }}>
                      <input type="number" min="0" max="100" value={state.buckets[k]} onChange={function (e) { props.setBucket(k, e.target.value); }} style={{ ...sx.textInput, paddingRight: 26 }} />
                      <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>%</span>
                    </div>
                  </label>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
              <span style={{ ...sx.totalPill, background: r.bucketsValid ? "var(--green-50)" : "var(--amber-50)", color: r.bucketsValid ? "var(--green-600)" : "var(--amber-600)" }}>
                Total: {r.bucketsTotalPct}% {r.bucketsValid ? "✓" : ""}
              </span>
              {!r.bucketsValid && <span style={{ fontSize: 13, color: "var(--amber-600)" }}>Please adjust so your buckets total 100%.</span>}
              <button type="button" onClick={props.resetBuckets} style={sx.linkBtn}>Reset to suggested split (60/10/10/20)</button>
            </div>
          </div>
        )}

        <div style={{ ...sx.bucketGrid, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
          {r.buckets.map(function (b) {
            var fb = b.feedback;
            return (
              <div key={b.key} style={sx.bucketCard}>
                <MbdRing size={72} stroke={9} pct={b.actualPct} color={b.color} center={B.formatPct(b.actualPct)} centerSize={15} ariaLabel={b.label + " " + B.formatPct(b.actualPct)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                    <b style={{ color: "var(--navy-700)", fontSize: 16 }}>{b.label}</b>
                    <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>target {B.formatPct(b.targetPct)}</span>
                  </div>
                  <div style={{ fontSize: 20, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--navy-700)", margin: "2px 0" }}>{B.formatMoney(b.actualAmt)}<span style={sx.perMo}>/mo</span></div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{b.diffAmt >= 0 ? "+" : "−"}{B.formatMoney(Math.abs(b.diffAmt))} vs target</div>
                  <div style={{ ...sx.feedbackPill, color: toneColor[fb.tone] }}><span aria-hidden="true">{fb.emoji}</span> {fb.title}</div>
                  <p style={sx.feedbackMsg}>{fb.message}</p>
                </div>
              </div>
            );
          })}
        </div>
        {bucketsInvalid && <p style={sx.softNote}>Your buckets don't total 100% yet, so the comparisons above are approximate. Open "Adjust my buckets" to fix this.</p>}
      </Mbd_Card>

      {/* Mortgage / housing check */}
      {r.housing && (
        <Mbd_Card>
          <h3 style={sx.sectionH}>Your {r.housing.isRent ? "Housing" : "Mortgage"} Check</h3>
          <p style={{ fontSize: 15, color: "var(--text-body)", margin: "0 0 14px" }}>
            Your {r.housing.label.toLowerCase()} currently uses <b>{B.formatPct(r.housing.pctOfIncome)}</b> of your household take-home income ({B.formatMoney(r.housing.monthly)}/month).
          </p>
          <div style={{ marginTop: 22 }}>
            <MbdGauge pct={r.housing.pctOfIncome} color="var(--color-primary)" marker={30} markerLabel="~30% guide" />
          </div>
          {r.housing.meta && (B.num(r.housing.meta.balance) > 0 || r.housing.meta.lender || r.housing.meta.rate) && (
            <div style={sx.mortgageMeta}>
              {r.housing.meta.lender && <span><b>Lender:</b> {r.housing.meta.lender}</span>}
              {B.num(r.housing.meta.balance) > 0 && <span><b>Balance:</b> {B.formatMoney(B.num(r.housing.meta.balance))}</span>}
              {r.housing.meta.rate && <span><b>Rate:</b> {r.housing.meta.rate}%</span>}
            </div>
          )}
          <p style={sx.smallPrint}>Housing-cost rules of thumb (you may have heard "around 30%") are general guides only and can use different income definitions. What matters more is your actual percentage, what's left after essentials, and your overall breathing room.</p>
        </Mbd_Card>
      )}

      {/* Future You firepower */}
      <Mbd_Card>
        <h3 style={sx.sectionH}>Future You</h3>
        {breathing > 0 ? (
          <div style={sx.firepower}>
            <div style={{ fontSize: 34 }} aria-hidden="true">🚀</div>
            <div>
              <b style={{ color: "var(--navy-700)", fontSize: 17 }}>{r.futureYou.hasDebt ? "You've got extra firepower" : "You've got breathing room"}</b>
              <p style={{ margin: "4px 0 0", color: "var(--text-body)", fontSize: 14.5 }}>
                Based on your current plan, you have approximately <b>{B.formatMoney(breathing)} per month</b> of breathing room.
                You could choose to put some or all of this towards {r.futureYou.hasDebt ? "your debts, " : ""}savings or other goals, it's entirely up to you.
              </p>
            </div>
          </div>
        ) : (
          <p style={{ color: "var(--text-body)", fontSize: 14.5, margin: 0 }}>Right now your plan is fully allocated. As you review the buckets above, any room you free up will show here as breathing room you can direct towards debt, savings or goals.</p>
        )}
      </Mbd_Card>

      {/* Goals */}
      {r.goals.filter(function (g) { return g.target > 0; }).length > 0 && (
        <Mbd_Card>
          <h3 style={sx.sectionH}>What you're building towards</h3>
          <div style={{ display: "grid", gap: 14 }}>
            {r.goals.filter(function (g) { return g.target > 0; }).map(function (g) {
              return (
                <div key={g.id} style={sx.goalCard}>
                  <MbdRing size={68} stroke={8} pct={g.savedPct} color={B.BUCKET_META.goals.color} center={Math.round(g.savedPct) + "%"} centerSize={14} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ color: "var(--navy-700)", fontSize: 16 }}>{g.name}</b>
                    <p style={{ margin: "3px 0", fontSize: 14, color: "var(--text-body)" }}>
                      {g.complete ? "✨ You've reached this goal!" : (g.savedPct > 0 ? "✨ Look at you go," : "🌱 Every bit counts,")}
                      {B.formatMoney(g.saved)} of {B.formatMoney(g.target)} ({Math.round(g.savedPct)}%).
                    </p>
                    {!g.complete && g.monthsLeft != null && g.monthsLeft > 0 && (
                      <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
                        {B.formatMoney(g.remaining)} to go over {g.monthsLeft} month{g.monthsLeft === 1 ? "" : "s"},about <b>{B.formatMoney(g.requiredMonthly)}/month</b>.
                        {g.contributionMonthly > 0 && (g.onTrack ? " Your planned contribution looks on track. 🎯" : " That's a little more than your current plan, worth a look.")}
                      </p>
                    )}
                    {!g.complete && g.pastDue && <p style={{ margin: 0, fontSize: 13, color: "var(--color-warning)" }}>Your target date has passed, update it to see what's needed from here.</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </Mbd_Card>
      )}

      {/* Expense breakdown */}
      <Mbd_Card>
        <h3 style={sx.sectionH}>Your expense breakdown</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {B.BUCKET_ORDER.map(function (k) {
            return <MbdBreakdownBucket key={k} label={B.BUCKET_META[k].label} color={B.BUCKET_META[k].color} items={r.breakdown[k]} />;
          })}
        </div>
        <button type="button" onClick={function () { props.setView("step1"); }} style={{ ...sx.linkBtn, marginTop: 12 }}>← Edit my budget</button>
      </Mbd_Card>

      {/* Lending CTA */}
      {hasLending && (
        <div style={sx.ctaCard}>
          <div>
            <b style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#fff" }}>Want us to review your lending?</b>
            <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,.85)", fontSize: 14.5, maxWidth: 520 }}>Your budget is only one part of the picture. If you'd like, we can review your current lending, repayments and loan structure to see whether there may be a better way to set things up.</p>
          </div>
          <Button size="lg" onClick={function () { onNav("contact"); }}>Review My Lending</Button>
        </div>
      )}

      {/* Actions */}
      <div style={sx.actionRow}>
        <Button size="lg" onClick={props.downloadPdf} disabled={props.pdfBusy}>{props.pdfBusy ? "Preparing…" : "Download My Money Plan"}</Button>
        <button type="button" onClick={function () { props.setView("step1"); }} style={sx.secondaryBtn}>Edit my budget</button>
        <button type="button" onClick={props.clearData} style={sx.clearLink}>Clear my saved data</button>
      </div>
      <p style={sx.privacyNote}>Your budget information stays on this device unless you choose to contact Mesh Finance.</p>
    </div>
  );
}

/* Local Card wrapper (design-system Card, with our padding). */
function Mbd_Card(props) {
  var Card = window.MeshFinanceDesignSystem_5c98d0.Card;
  return <Card elevation="shadow" style={{ padding: "22px 24px", background: "var(--surface-card)" }}>{props.children}</Card>;
}

/* ===========================================================================
 * Styles
 * ===========================================================================*/
var mbdStyles = {
  page: { background: "var(--surface-page)" },
  hero: { background: "var(--blue-50)" },
  heroInner: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "40px 24px 44px", display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" },
  h1: { fontSize: 40, margin: 0, color: "var(--navy-700)", letterSpacing: "-.02em" },
  tagline: { fontSize: 18, color: "var(--color-primary-active)", margin: 0, fontWeight: 600 },
  body: { maxWidth: 920, margin: "0 auto", padding: "32px 20px 24px" },
  disclaimer: { maxWidth: 920, margin: "0 auto", padding: "0 20px 48px", fontSize: 12, lineHeight: 1.55, color: "var(--text-subtle)" },

  introCard: { padding: "28px 28px 30px", display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" },
  introLead: { fontSize: 16.5, lineHeight: 1.6, color: "var(--text-body)", margin: 0, maxWidth: "42ch" },
  introLeft: { padding: "36px 34px", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", justifyContent: "center", minWidth: 0 },
  introHeadline: { fontFamily: "var(--font-display)", fontSize: 32, color: "var(--navy-700)", margin: "6px 0 0", letterSpacing: "-.02em", lineHeight: 1.05, fontWeight: 700 },
  introTagline: { fontSize: 17, color: "var(--color-primary-active)", margin: 0, fontWeight: 600 },
  introMicro: { fontSize: 12.5, color: "var(--text-subtle)", margin: "6px 0 0" },
  introRight: { background: "var(--navy-700)", color: "#fff", padding: "34px 32px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, minWidth: 0 },
  peekTitle: { fontFamily: "var(--font-display)", fontSize: 19, color: "#fff", margin: 0, fontWeight: 700 },
  peekCard: { background: "#fff", borderRadius: "var(--radius-lg)", padding: 18, display: "flex", gap: 16, alignItems: "center" },
  peekH: { fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-muted)", fontWeight: 700 },
  peekBig: { fontFamily: "var(--font-display)", fontSize: 27, fontWeight: 700, color: "var(--green-600)", letterSpacing: "-.02em", lineHeight: 1.1 },
  peekPer: { fontSize: 13, fontWeight: 500, color: "var(--text-muted)" },
  peekSub: { fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 },
  peekBlurb: { fontSize: 14, color: "#c3cede", margin: 0, lineHeight: 1.5 },
  introNote: { fontSize: 14.5, color: "var(--color-primary-active)", background: "var(--blue-50)", padding: "10px 14px", borderRadius: "var(--radius-md)", fontWeight: 600 },
  splitRow: { display: "flex", flexWrap: "wrap", gap: 10 },
  splitChip: { display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "var(--text-body)", background: "var(--gray-50)", border: "1px solid var(--border-subtle)", borderRadius: 999, padding: "6px 12px" },
  privacyNote: { fontSize: 12.5, color: "var(--text-subtle)", margin: 0, lineHeight: 1.5 },

  wizardWrap: { display: "block" },
  progressRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 },
  progressTrack: { flex: 1, height: 8, borderRadius: 999, background: "var(--gray-200)", overflow: "hidden" },
  progressFill: { height: "100%", background: "var(--color-primary)", borderRadius: 999, transition: "width .3s ease" },
  stepCount: { fontSize: 12.5, color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" },
  stepTitle: { fontSize: 26, color: "var(--navy-700)", margin: "0 0 4px", letterSpacing: "-.01em" },
  stepSub: { fontSize: 15, color: "var(--text-body)", margin: "0 0 18px", lineHeight: 1.55 },
  stepCard: { padding: "22px 24px" },
  navRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, gap: 12 },
  backBtn: { background: "none", border: "none", color: "var(--text-muted)", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "var(--font-body)" },
  clearLink: { display: "block", margin: "16px auto 0", background: "none", border: "none", color: "var(--text-subtle)", fontSize: 13, cursor: "pointer", textDecoration: "underline", fontFamily: "var(--font-body)" },

  blockH: { fontFamily: "var(--font-display)", fontSize: 18, color: "var(--navy-700)", margin: "0 0 4px", fontWeight: 700 },
  blockHint: { fontSize: 13.5, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.5 },
  incomeBlock: { border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: 14, marginBottom: 10 },
  incomeHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  personTag: { fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700, color: "var(--color-primary)" },
  removeInline: { background: "none", border: "none", color: "var(--text-subtle)", fontSize: 13, cursor: "pointer", textDecoration: "underline", fontFamily: "var(--font-body)", marginTop: 8 },
  textInput: { width: "100%", padding: "11px 12px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: 15, fontFamily: "var(--font-body)", color: "var(--text-strong)", background: "var(--surface-card)", boxSizing: "border-box" },
  select: { width: "100%", padding: "11px 10px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: 14.5, background: "var(--surface-card)", color: "var(--text-strong)", fontFamily: "var(--font-body)", boxSizing: "border-box" },
  addBtn: { display: "inline-block", marginTop: 10, background: "var(--blue-50)", border: "1px dashed var(--color-primary)", color: "var(--color-primary-active)", fontWeight: 600, fontSize: 14, cursor: "pointer", padding: "10px 16px", borderRadius: "var(--radius-md)", fontFamily: "var(--font-body)" },
  incomeTotal: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, padding: "12px 16px", background: "var(--blue-50)", borderRadius: "var(--radius-md)", fontSize: 15, color: "var(--navy-700)" },
  toggleCard: { border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: 16, display: "flex", flexDirection: "column", gap: 12, justifyContent: "space-between" },
  toggleCardH: { fontWeight: 700, fontSize: 15.5, color: "var(--navy-700)" },
  loanPanel: { marginTop: 12, padding: 14, background: "var(--gray-50)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" },
  loanPanelH: { fontWeight: 700, fontSize: 14, color: "var(--navy-700)" },
  miniLabel: { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)" },
  debtCard: { border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: 16, marginBottom: 12 },
  debtSummary: { display: "flex", flexWrap: "wrap", gap: 24, marginTop: 14, padding: "14px 16px", background: "var(--blue-50)", borderRadius: "var(--radius-md)" },
  dsLabel: { display: "block", fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600, marginBottom: 2 },
  emptyNote: { fontSize: 14, color: "var(--text-muted)", margin: "0 0 12px" },

  resultHead: { fontFamily: "var(--font-display)", fontSize: 24, color: "var(--navy-700)", margin: "0 0 16px" },
  statCard: { border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 4, background: "var(--gray-50)" },
  statLabel: { fontSize: 12.5, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700 },
  statValue: { fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--navy-700)" },
  perMo: { fontSize: 13, fontWeight: 500, color: "var(--text-muted)" },
  softNote: { marginTop: 14, background: "var(--blue-50)", borderRadius: "var(--radius-md)", padding: "12px 16px", fontSize: 14, color: "var(--navy-700)", lineHeight: 1.55 },
  sectionH: { fontFamily: "var(--font-display)", fontSize: 19, color: "var(--navy-700)", margin: "0 0 14px", fontWeight: 700 },
  legendItem: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "6px 0", borderBottom: "1px solid var(--gray-100)" },
  linkBtn: { background: "none", border: "none", color: "var(--color-primary)", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "var(--font-body)", padding: 0 },
  adjustWrap: { background: "var(--gray-50)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: 16, marginBottom: 16 },
  totalPill: { fontSize: 13.5, fontWeight: 700, padding: "5px 12px", borderRadius: 999 },
  bucketGrid: { display: "grid", gap: 14, marginTop: 4 },
  bucketCard: { display: "flex", gap: 16, alignItems: "flex-start", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 16 },
  feedbackPill: { fontSize: 13.5, fontWeight: 700, marginTop: 6 },
  feedbackMsg: { fontSize: 13, color: "var(--text-body)", lineHeight: 1.5, margin: "3px 0 0" },
  mortgageMeta: { display: "flex", flexWrap: "wrap", gap: 18, marginTop: 16, fontSize: 13.5, color: "var(--text-body)" },
  smallPrint: { fontSize: 12.5, color: "var(--text-subtle)", lineHeight: 1.5, margin: "14px 0 0" },
  firepower: { display: "flex", gap: 16, alignItems: "flex-start", background: "var(--green-50)", borderRadius: "var(--radius-md)", padding: 18 },
  goalCard: { display: "flex", gap: 16, alignItems: "center", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 16 },
  breakdownItem: { border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" },
  breakdownHead: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" },
  breakdownLine: { display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "var(--text-body)", padding: "4px 0" },
  ctaCard: { display: "flex", gap: 18, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", background: "var(--navy-700)", borderRadius: "var(--radius-lg)", padding: "22px 24px" },
  actionRow: { display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", justifyContent: "center" },
  secondaryBtn: { background: "var(--surface-card)", border: "1.5px solid var(--border-default)", color: "var(--text-strong)", fontWeight: 600, fontSize: 15, cursor: "pointer", padding: "12px 22px", borderRadius: "var(--radius-md)", fontFamily: "var(--font-body)" },
};

/* Make the dark CTA card's heading/paragraph readable, override text colors inline where used. */
mbdStyles.ctaCard = Object.assign({}, mbdStyles.ctaCard);

var Button = window.MeshFinanceDesignSystem_5c98d0.Button;
var Badge = window.MeshFinanceDesignSystem_5c98d0.Badge;
var Alert = window.MeshFinanceDesignSystem_5c98d0.Alert;

Object.assign(window, { MeshMoneyByDesignScreen: MoneyByDesignScreen, mbdExpenseTable: mbdExpenseTable, MBD_DISCLAIMER: MBD_DISCLAIMER });

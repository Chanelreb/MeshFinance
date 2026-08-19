/* Calculators, interactive tools driven by a `kind` prop.
   kind: "loan-repayment" | "interest-only" | "stamp-duty" | "borrowing-power" | "savings" | "extra-repayment" | "lump-sum" | "how-long" | "offset-vs-redraw"
   Slider = range slider + typed number input (module scope so inputs keep focus across re-renders). */
function CalculatorScreen({ onNav, kind = "loan-repayment" }) {
  const DS = window.MeshFinanceDesignSystem_5c98d0;
  const { Card, Button, Badge, Alert } = DS;
  const { ArrowRight, Check: CheckIcon } = window.MeshIcons;
  const { useState } = React;
  const isMobile = window.useIsMobile();
  const fmt = (v) => "$" + Math.round(v).toLocaleString("en-AU");

  if (kind === "loan-repayment" || kind === "interest-only") {
    const [amount, setAmount] = useState(550000);
    const [rate, setRate] = useState(6.2);
    const [term, setTerm] = useState(30);
    const [freq, setFreq] = useState("monthly");
    const [repayType, setRepayType] = useState(kind === "interest-only" ? "IO" : "PI");
    const [ioTerm, setIoTerm] = useState(5);
    const isIO = repayType === "IO";
    const periodsPerYear = freq === "monthly" ? 12 : 26;
    const r = rate/100/periodsPerYear;

    // Principal & interest over the full term
    const piN = term*periodsPerYear;
    const piRepay = r>0 ? amount * r / (1-Math.pow(1+r,-piN)) : amount/piN;
    const totalPaid = piRepay*piN;

    // Interest only during the IO period, then P&I over the remaining term
    const ioRepay = amount * r;
    const afterN = Math.max(term - ioTerm, 1) * periodsPerYear;
    const piAfter = r>0 ? amount * r / (1-Math.pow(1+r,-afterN)) : amount/afterN;

    return (
      <Shell onNav={onNav} badge="Calculator" title="Home Loan Repayment Calculator"
        lead="Estimate your repayments for a principal and interest or interest-only home loan, based on your loan amount, rate and term."
        note={isIO
          ? "This is an indicative estimate only and not an offer of credit. During the interest-only period your loan balance does not reduce, so repayments step up once principal and interest begins."
          : "This is an indicative estimate only and not an offer of credit."}>
        <div style={{...c.layout, ...(isMobile ? c.layoutMobile : {})}}>
          <Card elevation="shadow" style={{padding:28}}>
            <Slider label="Loan amount" value={amount} set={setAmount} min={100000} max={2000000} step={10000} prefix="$"/>
            <Slider label="Interest rate" value={rate} set={setRate} min={4} max={9} step={0.1} suffix="% p.a."/>
            <Slider label="Loan term" value={term} set={setTerm} min={10} max={30} step={1} suffix="years"/>
            <div style={c.field}>
              <label style={c.label}>Repayment type</label>
              <div style={c.toggleRow}>
                {[["PI","Principal & interest"],["IO","Interest only"]].map(([val,lbl])=>(
                  <button key={val} type="button" onClick={()=>setRepayType(val)} style={{...c.toggleBtn, ...(repayType===val?c.toggleBtnActive:{})}}>{lbl}</button>
                ))}
              </div>
            </div>
            {isIO && <Slider label="Interest-only period" value={ioTerm} set={setIoTerm} min={1} max={5} step={1} suffix="years"/>}
            <div style={c.field}>
              <label style={c.label}>Repayment frequency</label>
              <div style={c.toggleRow}>
                {["monthly","fortnightly"].map(f=>(
                  <button key={f} type="button" onClick={()=>setFreq(f)} style={{...c.toggleBtn, ...(freq===f?c.toggleBtnActive:{})}}>{f}</button>
                ))}
              </div>
            </div>
          </Card>
          {isIO ? (
            <ResultCard onNav={onNav} label={`Interest-only ${freq} repayment`} big={fmt(ioRepay)}
              sub="Interest only. Your loan balance doesn't reduce during this period."
              stats={[{v:fmt(piAfter),l:`P&I repayment after year ${ioTerm}`},{v:fmt(amount),l:"Loan amount stays the same"}]}/>
          ) : (
            <ResultCard onNav={onNav} label={`Estimated ${freq} repayment`} big={fmt(piRepay)}
              sub="Principal and interest (P&I) repayment"
              stats={[{v:fmt(totalPaid),l:"Total repaid over term"},{v:fmt(totalPaid-amount),l:"Total interest"}]}/>
          )}
        </div>
      </Shell>
    );
  }

  if (kind === "stamp-duty") {
    return (
      <Shell onNav={onNav} badge="Calculator" title="Stamp Duty Calculator" lead="The stamp duty decoder, know roughly what you'll need to budget for based on property value and buyer type.">
        <Card elevation="shadow" style={{padding:0, overflow:"hidden"}}>
          <iframe
            title="Stamp Duty Calculator"
            src="https://www.visionabacus.net/Tools/B3/SuiteA/A200/Stamp_Duty_Calculator/MeshFinance"
            style={c.embedFrame}
            loading="lazy"
          />
        </Card>
      </Shell>
    );
  }

  if (kind === "borrowing-power") {
    return (
      <Shell onNav={onNav} badge="Calculator" title="Borrowing Power Calculator" lead="Get an idea of how much you may be able to borrow based on your income, expenses and existing commitments. Powered by Vision Abacus, so living expense benchmarks and lender figures stay up to date.">
        <Card elevation="shadow" style={{padding:0, overflow:"hidden"}}>
          <iframe
            title="Borrowing Power Calculator"
            src="https://www.visionabacus.net/Tools/B3/SuiteA/A200/Borrowing_Power_Calculator/MeshFinance"
            style={c.embedFrame}
            loading="lazy"
          />
        </Card>
      </Shell>
    );
  }

  if (kind === "extra-repayment") {
    const [amount, setAmount] = useState(500000);
    const [rate, setRate] = useState(6.2);
    const [term, setTerm] = useState(30);
    const [extra, setExtra] = useState(300);
    const r = rate/100/12; const n = term*12;
    const baseRepay = r>0 ? amount * r / (1-Math.pow(1+r,-n)) : amount/n;
    const withExtra = baseRepay + extra;
    // amortize with extra to find months to payoff
    let bal = amount, months = 0;
    while (bal > 0 && months < 900) { bal = bal*(1+r) - withExtra; months++; }
    const yearsSaved = Math.max(0, (term*12 - months) / 12);
    const interestBase = baseRepay*n - amount;
    const interestWithExtra = withExtra*months - amount;
    const interestSaved = Math.max(0, interestBase - interestWithExtra);
    return (
      <Shell onNav={onNav} badge="Calculator" title="Extra Repayment Calculator" lead="Extra payments, big savings, see how making additional repayments can reduce your loan term and interest."
        note="This is an indicative estimate only and not an offer of credit.">
        <div style={{...c.layout, ...(isMobile ? c.layoutMobile : {})}}>
          <Card elevation="shadow" style={{padding:28}}>
            <Slider label="Loan amount" value={amount} set={setAmount} min={100000} max={2000000} step={10000} prefix="$"/>
            <Slider label="Interest rate" value={rate} set={setRate} min={4} max={9} step={0.1} suffix="% p.a."/>
            <Slider label="Loan term" value={term} set={setTerm} min={10} max={30} step={1} suffix="years"/>
            <Slider label="Extra monthly repayment" value={extra} set={setExtra} min={0} max={2000} step={50} prefix="$"/>
          </Card>
          <ResultCard onNav={onNav} label="You could save" big={`${yearsSaved.toFixed(1)} years`}
            sub={`and ${fmt(interestSaved)} in interest`}
            stats={[{v:fmt(withExtra),l:"New monthly repayment"},{v:fmt(baseRepay),l:"Original repayment"}]}/>
        </div>
      </Shell>
    );
  }

  if (kind === "savings") {
    const [balance, setBalance] = useState(10000);
    const [monthly, setMonthly] = useState(500);
    const [rate, setRate] = useState(4.5);
    const [years, setYears] = useState(5);
    const r = rate/100/12; const n = years*12;
    const fv = balance*Math.pow(1+r,n) + monthly*((Math.pow(1+r,n)-1)/r);
    const contributed = balance + monthly*n;
    return (
      <Shell onNav={onNav} badge="Calculator" title="Saving Calculator" lead="Grow my savings, see how a starting balance plus regular deposits builds up over time with interest.">
        <div style={{...c.layout, ...(isMobile ? c.layoutMobile : {})}}>
          <Card elevation="shadow" style={{padding:28}}>
            <Slider label="Starting balance" value={balance} set={setBalance} min={0} max={200000} step={1000} prefix="$"/>
            <Slider label="Monthly deposit" value={monthly} set={setMonthly} min={0} max={5000} step={50} prefix="$"/>
            <Slider label="Interest rate" value={rate} set={setRate} min={1} max={7} step={0.1} suffix="% p.a."/>
            <Slider label="Time frame" value={years} set={setYears} min={1} max={30} step={1} suffix="years"/>
          </Card>
          <ResultCard onNav={onNav} label={`Balance after ${years} years`} big={fmt(fv)}
            sub={`You'll have contributed ${fmt(contributed)}`}
            stats={[{v:fmt(fv-contributed),l:"Interest earned"},{v:fmt(contributed),l:"Total deposited"}]}
            ctaLabel="Talk to a broker about your goals"/>
        </div>
      </Shell>
    );
  }

  if (kind === "lump-sum") {
    const [amount, setAmount] = useState(500000);
    const [rate, setRate] = useState(6.2);
    const [term, setTerm] = useState(30);
    const [lump, setLump] = useState(20000);
    const r = rate/100/12; const n = term*12;
    const repay = r>0 ? amount * r / (1-Math.pow(1+r,-n)) : amount/n;
    let bal = amount - lump, months = 0;
    while (bal > 0 && months < 900) { bal = bal*(1+r) - repay; months++; }
    const yearsSaved = Math.max(0, (n - months) / 12);
    const interestBase = repay*n - amount;
    const interestWithLump = repay*months - (amount-lump);
    const interestSaved = Math.max(0, interestBase - interestWithLump);
    return (
      <Shell onNav={onNav} badge="Calculator" title="Lump Sum Repayment Calculator" lead="Put a lump sum to work, see how a one-off payment against your loan cuts your term and interest bill."
        note="This is an indicative estimate only and not an offer of credit.">
        <div style={{...c.layout, ...(isMobile ? c.layoutMobile : {})}}>
          <Card elevation="shadow" style={{padding:28}}>
            <Slider label="Loan amount" value={amount} set={setAmount} min={100000} max={2000000} step={10000} prefix="$"/>
            <Slider label="Interest rate" value={rate} set={setRate} min={4} max={9} step={0.1} suffix="% p.a."/>
            <Slider label="Loan term" value={term} set={setTerm} min={10} max={30} step={1} suffix="years"/>
            <Slider label="Lump sum payment" value={lump} set={setLump} min={0} max={200000} step={5000} prefix="$"/>
          </Card>
          <ResultCard onNav={onNav} label="You could save" big={`${yearsSaved.toFixed(1)} years`}
            sub={`and ${fmt(interestSaved)} in interest`}
            stats={[{v:fmt(repay),l:"Repayment stays the same"},{v:fmt(lump),l:"Lump sum applied"}]}/>
        </div>
      </Shell>
    );
  }

  if (kind === "how-long") {
    const [amount, setAmount] = useState(400000);
    const [rate, setRate] = useState(6.2);
    const [repay, setRepay] = useState(3000);
    const r = rate/100/12;
    const minRepay = amount*r;
    const safeRepay = Math.max(repay, minRepay+1);
    const months = r>0 ? Math.log(safeRepay/(safeRepay-amount*r)) / Math.log(1+r) : amount/safeRepay;
    const years = months/12;
    const totalPaid = safeRepay*months;
    return (
      <Shell onNav={onNav} badge="Calculator" title="How Long to Repay Calculator" lead="Set a repayment amount and see how long it will take to pay off your loan in full."
        note={repay <= minRepay ? "That repayment only covers interest, increase it to make progress on the balance." : "This is an indicative estimate only and not an offer of credit."}>
        <div style={{...c.layout, ...(isMobile ? c.layoutMobile : {})}}>
          <Card elevation="shadow" style={{padding:28}}>
            <Slider label="Loan amount" value={amount} set={setAmount} min={100000} max={2000000} step={10000} prefix="$"/>
            <Slider label="Interest rate" value={rate} set={setRate} min={4} max={9} step={0.1} suffix="% p.a."/>
            <Slider label="Monthly repayment" value={repay} set={setRepay} min={500} max={10000} step={50} prefix="$"/>
          </Card>
          <ResultCard onNav={onNav} label="Time to repay in full" big={`${years.toFixed(1)} years`}
            sub={`(about ${Math.round(months)} months)`}
            stats={[{v:fmt(totalPaid),l:"Total repaid"},{v:fmt(totalPaid-amount),l:"Total interest"}]}/>
        </div>
      </Shell>
    );
  }

  if (kind === "offset-vs-redraw") {
    const [loanBalance, setLoanBalance] = useState(600000);
    const [savingsBalance, setSavingsBalance] = useState(20000);
    const [everydayBalance, setEverydayBalance] = useState(10000);
    const [offsetRate, setOffsetRate] = useState(6.2);
    const [offsetFee, setOffsetFee] = useState(395);
    const [redrawRate, setRedrawRate] = useState(5.99);
    const [redrawFee, setRedrawFee] = useState(0);

    // Offset: both savings and everyday balances sit in the offset account and reduce the balance interest is charged on.
    const offsetInterest = Math.max(0, loanBalance - savingsBalance - everydayBalance) * (offsetRate / 100);
    const offsetCost = offsetInterest + offsetFee;
    // Redraw: interest is charged on the full loan balance, savings sitting elsewhere don't reduce it.
    const redrawInterest = loanBalance * (redrawRate / 100);
    const redrawCost = redrawInterest + redrawFee;
    const diff = Math.abs(offsetCost - redrawCost);
    const offsetCheaper = offsetCost < redrawCost;

    // Break-even savings balance (holding everyday balance fixed) where offsetCost === redrawCost.
    // redrawCost doesn't depend on savings, so solve: (loanBalance - savings - everyday)*rOff + offsetFee = redrawCost
    const rOff = offsetRate / 100;
    const breakEvenDegenerate = rOff <= 0;
    const breakEvenSavings = breakEvenDegenerate ? null : (loanBalance - everydayBalance) - ((redrawCost - offsetFee) / rOff);
    let breakEvenMsg;
    if (breakEvenDegenerate) {
      breakEvenMsg = "Enter an offset interest rate above 0% to calculate a break-even savings balance.";
    } else if (breakEvenSavings <= 0) {
      breakEvenMsg = `Even with $0 in savings, the ${offsetCheaper ? "offset" : "redraw only"} option comes out ahead based on these figures.`;
    } else if (breakEvenSavings > loanBalance) {
      breakEvenMsg = "Based on these figures, keeping savings in offset doesn't get you to break-even, the redraw option stays cheaper regardless of your savings balance.";
    } else {
      breakEvenMsg = `You'd need to keep about ${fmt(breakEvenSavings)} in savings (on top of your ${fmt(everydayBalance)} everyday balance) for the offset loan to break even against the redraw loan.`;
    }

    return (
      <Shell onNav={onNav} badge="Calculator" title="Offset vs Redraw Calculator"
        lead="Wondering if an offset account is actually worth it? Compare the cost of a loan with an offset account against a lower-rate loan with redraw, based on your loan balance and average offset amount."
        note="This is a simplified, annualised estimate only, it doesn't model daily interest, amortisation or lender policy.">
        <div style={{...c.layout, ...(isMobile ? c.layoutMobile : {})}}>
          <Card elevation="shadow" style={{padding:28}}>
            <div style={{...c.fieldGrid, ...(isMobile ? c.fieldGridMobile : {})}}>
              <AmountField label="Current home loan balance" value={loanBalance} set={setLoanBalance} prefix="$" step={1000}
                hint="Roughly how much you still owe."/>
              <AmountField label="Savings you'd keep in offset" value={savingsBalance} set={setSavingsBalance} prefix="$" step={500}
                hint="Average savings balance you'd keep in the offset account."/>
              <AmountField label="Everyday spending balance" value={everydayBalance} set={setEverydayBalance} prefix="$" step={500}
                hint="Average everyday/transaction balance, stays out of redraw."/>
              <AmountField label="Interest rate with offset account" value={offsetRate} set={setOffsetRate} prefix="%" step={0.01}
                hint="Rate on the offset/package loan (p.a.)"/>
              <AmountField label="Annual fee with offset account" value={offsetFee} set={setOffsetFee} prefix="$" step={5}
                hint="Package or offset fee per year."/>
              <AmountField label="Interest rate with redraw only" value={redrawRate} set={setRedrawRate} prefix="%" step={0.01}
                hint="Rate on the cheaper, no-offset loan (p.a.)"/>
              <AmountField label="Annual fee with redraw only" value={redrawFee} set={setRedrawFee} prefix="$" step={5}
                hint="Often $0, but check the loan."/>
            </div>
          </Card>

          <Card padded={false} style={{...c.result, ...(isMobile ? c.resultMobile : {})}}>
            <div style={c.resultTop}>
              <span style={c.resultLabel}>Your result</span>
              <span style={c.compareHeadline}>{`The ${offsetCheaper ? "offset" : "redraw only"} option may save you about ${fmt(diff)} per year`}</span>
              <span style={c.resultSub}>{`That's about ${fmt(diff/12)} per month.`}</span>
            </div>
            <div style={c.compareHeading}>
              <span style={c.compareHeadingT}>Estimated annual cost</span>
              <span style={c.compareHeadingSub}>Total interest plus fees for one year, based on the figures you entered.</span>
            </div>
            <div style={c.compareGrid}>
              <div style={{...c.compareCard, ...(offsetCheaper ? c.compareCardWin : {})}}>
                <span style={c.compareLabel}>Loan with offset</span>
                <div style={c.compareBigRow}>
                  <span style={c.compareBig}>{fmt(offsetCost)}</span>
                  {offsetCheaper && <Badge color="blue" dot>Cheaper</Badge>}
                </div>
                <span style={c.compareSub}>{`Interest ${fmt(offsetInterest)} · Fees ${fmt(offsetFee)}`}</span>
              </div>
              <div style={{...c.compareCard, ...(!offsetCheaper ? c.compareCardWin : {})}}>
                <span style={c.compareLabel}>Loan with redraw only</span>
                <div style={c.compareBigRow}>
                  <span style={c.compareBig}>{fmt(redrawCost)}</span>
                  {!offsetCheaper && <Badge color="blue" dot>Cheaper</Badge>}
                </div>
                <span style={c.compareSub}>{`Interest ${fmt(redrawInterest)} · Fees ${fmt(redrawFee)}`}</span>
              </div>
            </div>
            <div style={c.breakEvenBox}>
              <span style={c.breakEvenLabel}>Break-even savings balance</span>
              <span style={c.breakEvenBody}>{breakEvenMsg}</span>
            </div>
            <div style={c.resultFoot}>
              <Button block size="lg" onClick={()=>onNav("contact")} iconRight={<ArrowRight width={18} height={18}/>}>Talk to a broker</Button>
            </div>
          </Card>
        </div>

        <OffsetVsRedrawInfo/>
      </Shell>
    );
  }

  if (kind === "max-purchase-price") {
    return <MaxPurchasePriceCalculator onNav={onNav} contactUrl="/contact"/>;
  }

  // default: loan-repayment (fallback, App.jsx always passes a valid kind)
  return null;
}

/* Page shell shared by all calculators, module scope so component identity is stable across re-renders. */
function Shell({ badge, title, lead, children, note, onNav }) {
  const { Badge, Alert, Breadcrumb } = window.MeshFinanceDesignSystem_5c98d0;
  return (
    <div>
      <section style={c.head}>
        <div style={c.headInner}>
          {onNav && <Breadcrumb items={[
            {label:"Home", href:window.meshHref("home"), onClick:(e)=>{e.preventDefault();onNav("home");}},
            {label:"Guides and Tools", href:window.meshHref("knowledge-centre"), onClick:(e)=>{e.preventDefault();onNav("knowledge-centre");}},
            {label:"Calculator Hub", href:window.meshHref("calculator-hub"), onClick:(e)=>{e.preventDefault();onNav("calculator-hub");}},
            {label:title},
          ]}/>}
          <Badge color="blue" dot>{badge}</Badge>
          <h1 style={c.h1}>{title}</h1>
          <p style={c.lead}>{lead}</p>
        </div>
      </section>
      <section style={c.body}>
        <div style={c.inner}>
          {children}
          {note && <Alert variant="warning">{note}</Alert>}
        </div>
      </section>
    </div>
  );
}

/* Result summary card, module scope for stable identity. */
function ResultCard({ onNav, label, big, sub, stats, ctaLabel = "Talk to a broker" }) {
  const { Card, Button } = window.MeshFinanceDesignSystem_5c98d0;
  const { ArrowRight } = window.MeshIcons;
  const isMobile = window.useIsMobile();
  return (
    <Card padded={false} style={{...c.result, ...(isMobile ? c.resultMobile : {})}}>
      <div style={c.resultTop}>
        <span style={c.resultLabel}>{label}</span>
        <span style={c.resultBig}>{big}</span>
        {sub && <span style={c.resultSub}>{sub}</span>}
      </div>
      {stats && (
        <div style={c.resultGrid}>
          {stats.map((st,i)=>(
            <div key={i} style={c.miniStat}><span style={c.miniV}>{st.v}</span><span style={c.miniL}>{st.l}</span></div>
          ))}
        </div>
      )}
      <div style={c.resultFoot}>
        <Button block size="lg" onClick={()=>onNav("contact")} iconRight={<ArrowRight width={18} height={18}/>}>{ctaLabel}</Button>
      </div>
    </Card>
  );
}

/* Comma-group an integer, 550000 -> "550,000". */
const commaFmt = (v) => Math.round(Number(v) || 0).toLocaleString("en-AU");

/* Slider with a typed number input, drag the slider or type an exact value.
   Dollar fields ($ prefix) render as text inputs with live comma grouping. */
function Slider({ label, value, set, min, max, step, prefix, suffix }) {
  const [draft, setDraft] = React.useState(null);
  const money = prefix === "$";
  const onType = (e) => {
    const raw = e.target.value;
    if (money) {
      const digits = raw.replace(/[^\d]/g, "");
      if (digits === "") { setDraft(""); return; }
      const v = Number(digits);
      set(v); setDraft(commaFmt(v));
    } else {
      setDraft(raw);
      const v = Number(raw);
      if (raw !== "" && !isNaN(v)) set(v);
    }
  };
  return (
    <div style={c.field}>
      <div style={c.fieldTop}>
        <label style={c.label}>{label}</label>
        <div style={c.valWrap}>
          {prefix && <span style={c.valAffix}>{prefix}</span>}
          <input type={money ? "text" : "number"} inputMode={money ? "numeric" : "decimal"}
            min={money ? undefined : 0} step={money ? undefined : step}
            value={draft !== null ? draft : (money ? commaFmt(value) : value)}
            onChange={onType}
            onBlur={()=>setDraft(null)}
            aria-label={label}
            style={c.valInput}/>
          {suffix && <span style={c.valAffix}>{suffix}</span>}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(e)=>{ setDraft(null); set(Number(e.target.value)); }} style={c.range}/>
    </div>
  );
}

/* Labelled number input with prefix + hint, used by the offset-vs-redraw form.
   Dollar fields ($ prefix) render with live comma grouping. */
function AmountField({ label, value, set, prefix, hint, step = 1 }) {
  const [draft, setDraft] = React.useState(null);
  const money = prefix === "$";
  const onType = (e) => {
    const raw = e.target.value;
    if (money) {
      const digits = raw.replace(/[^\d]/g, "");
      if (digits === "") { setDraft(""); return; }
      const v = Number(digits);
      set(v); setDraft(commaFmt(v));
    } else {
      setDraft(raw);
      const v = Number(raw);
      if (raw !== "" && !isNaN(v)) set(v);
    }
  };
  return (
    <div style={c.field}>
      <label style={c.label}>{label}</label>
      <div style={c.inputWrap}>
        {prefix && <span style={c.inputPrefix}>{prefix}</span>}
        <input type={money ? "text" : "number"} inputMode={money ? "numeric" : "decimal"}
          value={draft !== null ? draft : (money ? commaFmt(value) : value)}
          step={money ? undefined : step}
          onChange={onType}
          onBlur={()=>setDraft(null)}
          style={{...c.numInput, ...(prefix ? c.numInputPad : {})}}/>
      </div>
      {hint && <span style={c.inputHint}>{hint}</span>}
    </div>
  );
}

/* Educational content block for the offset-vs-redraw calculator, data-driven. */
function OffsetVsRedrawInfo() {
  const { Check: CheckIcon } = window.MeshIcons;
  const { Alert } = window.MeshFinanceDesignSystem_5c98d0;
  const d = window.MeshContent.offsetVsRedraw;
  const isMobile = window.useIsMobile();
  if (!d) return null;

  return (
    <div style={info.wrap}>
      <div style={info.block}>
        <h2 style={info.h2}>How the calculator works</h2>
        <p style={info.p}>This calculator compares the estimated annual cost of each loan option so you can see which structure may suit your situation. Here is the step-by-step logic.</p>
        <div style={info.numGrid}>
          {d.howItWorks.map((s,i)=>(
            <div key={i} style={info.numCard}>
              <div style={info.numT}>{s.h}</div>
              <div style={info.numB}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={info.block}>
        <h3 style={info.h3}>What the numbers mean</h3>
        <ul style={info.plainList}>
          {d.whatNumbersMean.map((s,i)=>(
            <li key={i} style={info.plainItem}><strong style={info.strong}>{s.t}</strong>: {s.b}</li>
          ))}
        </ul>
      </div>

      <div style={{...info.twoCol, ...(isMobile ? info.twoColMobile : {})}}>
        <div style={info.block}>
          <h3 style={info.h3}>{d.offset.title}</h3>
          <p style={info.p}>{d.offset.body}</p>
          <ul style={info.checks}>
            {d.offset.list.map((item,j)=>(
              <li key={j} style={info.checkItem}><span style={info.checkIcon}><CheckIcon width={13} height={13}/></span>{item}</li>
            ))}
          </ul>
        </div>
        <div style={info.block}>
          <h3 style={info.h3}>{d.redraw.title}</h3>
          <p style={info.p}>{d.redraw.body}</p>
          <ul style={info.checks}>
            {d.redraw.list.map((item,j)=>(
              <li key={j} style={info.checkItem}><span style={info.checkIcon}><CheckIcon width={13} height={13}/></span>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={info.block}>
        <h3 style={info.h3}>Offset vs redraw, which one suits you?</h3>
        <div style={{...info.twoCol, ...(isMobile ? info.twoColMobile : {})}}>
          <div style={info.suitCard}>
            <div style={info.suitT}>{d.suits.offset.title}</div>
            <ul style={info.checks}>
              {d.suits.offset.list.map((item,j)=>(
                <li key={j} style={info.checkItem}><span style={info.checkIcon}><CheckIcon width={13} height={13}/></span>{item}</li>
              ))}
            </ul>
          </div>
          <div style={info.suitCard}>
            <div style={info.suitT}>{d.suits.redraw.title}</div>
            <ul style={info.checks}>
              {d.suits.redraw.list.map((item,j)=>(
                <li key={j} style={info.checkItem}><span style={info.checkIcon}><CheckIcon width={13} height={13}/></span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={info.block}>
        <h3 style={info.h3}>Things to consider before choosing</h3>
        <div style={{...info.considerGrid, ...(isMobile ? info.considerGridMobile : {})}}>
          {d.considerations.map((it,i)=>(
            <div key={i} style={info.considerCard}>
              <div style={info.numT}>{it.t}</div>
              <div style={info.numB}>{it.b}</div>
            </div>
          ))}
        </div>
      </div>

      <Alert variant="warning">{d.disclaimer}</Alert>
    </div>
  );
}

const info = {
  wrap: { display:"flex", flexDirection:"column", gap:40, marginTop:8 },
  block: {},
  h2: { fontSize:24, margin:"0 0 10px", color:"var(--navy-700)" },
  h3: { fontSize:19, margin:"0 0 10px", color:"var(--navy-700)" },
  p: { fontSize:15.5, lineHeight:1.6, color:"var(--text-body)", margin:"0 0 14px" },
  numGrid: { display:"grid", gap:14 },
  numCard: { padding:"16px 18px", background:"var(--blue-50)", borderRadius:"var(--radius-md)" },
  numT: { fontWeight:700, color:"var(--navy-700)", marginBottom:4, fontSize:15 },
  numB: { fontSize:14.5, color:"var(--text-body)", lineHeight:1.55 },
  plainList: { margin:0, padding:"0 0 0 20px", display:"flex", flexDirection:"column", gap:8 },
  plainItem: { fontSize:15, lineHeight:1.55, color:"var(--text-body)" },
  strong: { color:"var(--navy-700)" },
  twoCol: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 },
  twoColMobile: { gridTemplateColumns:"1fr", gap:28 },
  checks: { listStyle:"none", margin:0, padding:0, display:"grid", gap:10 },
  checkItem: { display:"flex", gap:10, alignItems:"flex-start", fontSize:14.5, lineHeight:1.5, color:"var(--text-body)" },
  checkIcon: { flex:"none", width:20, height:20, borderRadius:"50%", background:"var(--color-success)",
    color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", marginTop:1 },
  suitCard: { padding:20, background:"var(--surface-page)", borderRadius:"var(--radius-md)", border:"1px solid var(--border-subtle)" },
  suitT: { fontFamily:"var(--font-display)", fontWeight:700, fontSize:16, color:"var(--navy-700)", marginBottom:10 },
  considerGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 },
  considerGridMobile: { gridTemplateColumns:"1fr" },
  considerCard: { padding:"16px 18px", background:"#fff", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-md)" },
};

/* ===========================================================================
 * Maximum Home Purchase Price Calculator (WA owner-occupied)
 * Pure calculation logic lives in calculator-engine.js (window.MeshCalc).
 * This component is presentation only.
 * =========================================================================*/
const mfmt = (n) => "$" + Math.round(isFinite(n) ? n : 0).toLocaleString("en-AU");
const mpct = (x) => (isFinite(x) ? (x * 100).toFixed(1) : "0.0") + "%";
/* Indicative monthly principal-and-interest repayment: 30-year term at 6% p.a. */
const mpMonthlyRepayment = (loan) => {
  if (!(loan > 0)) return 0;
  const r = 0.06 / 12, n = 360;
  return loan * r / (1 - Math.pow(1 + r, -n));
};

const MP_LIMIT_LABEL = {
  BORROWING_CAPACITY: "your borrowing capacity",
  AVAILABLE_CASH: "your available cash",
  MIN_SAVED_DEPOSIT: "the scheme's minimum saved-deposit requirement",
  SCHEME_PRICE_CAP: "the government scheme property-price cap",
  SCHEME_MAX_LOAN: "the scheme's maximum loan limit",
  LVR_CAP: "the 97% total loan-to-value limit (including LMI)",
  INSUFFICIENT_FUNDS: "not having enough cash yet to cover the deposit and costs",
  UPPER_BOUND: "your borrowing capacity and cash",
};

function MoneyField({ id, label, helper, value, onChange, error, placeholder, icon }) {
  const [draft, setDraft] = React.useState(null);
  const show = (v) => (v == null || v === "" ? "" : Math.round(Number(v) || 0).toLocaleString("en-AU"));
  const onType = (e) => {
    const digits = e.target.value.replace(/[^\d]/g, "");
    if (digits === "") { setDraft(""); onChange(null); return; }
    const v = Number(digits);
    setDraft(v.toLocaleString("en-AU"));
    onChange(v);
  };
  const helpId = id + "-help", errId = id + "-err";
  const describedBy = [helper ? helpId : null, error ? errId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div style={mp.field}>
      <label htmlFor={id} style={mp.label}>{icon && <span style={mp.legendIcon} aria-hidden="true">{icon}</span>}<span style={mp.legendText}>{label}</span></label>
      <div style={mp.moneyWrap}>
        <span style={mp.moneyPrefix} aria-hidden="true">$</span>
        <input id={id} type="text" inputMode="numeric" autoComplete="off" className="mpx-money"
          value={draft !== null ? draft : show(value)} onChange={onType} onBlur={() => setDraft(null)}
          placeholder={placeholder} aria-describedby={describedBy} aria-invalid={error ? "true" : undefined}
          style={{ ...mp.moneyInput, ...(error ? mp.inputError : {}) }}/>
      </div>
      {helper && <span id={helpId} style={mp.helper}>{helper}</span>}
      {error && <span id={errId} role="alert" style={mp.errorText}>{error}</span>}
    </div>
  );
}

function MPRadioGroup({ legend, name, options, value, onChange, helper, note }) {
  const helpId = name + "-help";
  return (
    <fieldset style={mp.fieldset} aria-describedby={helper ? helpId : undefined}>
      <legend style={mp.legend}>{legend}</legend>
      {helper && <span id={helpId} style={mp.helper}>{helper}</span>}
      <div style={mp.radioList}>
        {options.map((o) => {
          const active = value === o.value;
          const rid = name + "-" + o.value;
          return (
            <label key={o.value} htmlFor={rid} className="mpx-radiocard" style={{ ...mp.radioCard, ...(active ? mp.radioCardActive : {}) }}>
              <input type="radio" id={rid} name={name} value={o.value} checked={active}
                onChange={() => onChange(o.value)} style={mp.radioInput}/>
              <span style={mp.radioBody}>
                <span style={mp.radioLabel}>{o.label}</span>
                {o.desc && <span style={mp.radioDesc}>{o.desc}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {note && <p style={mp.note}>{note}</p>}
    </fieldset>
  );
}

/* Segmented pill toggle (radiogroup) — friendlier than a stack of radio cards
   for yes/no/unsure and the scheme choice. The native radio is visually hidden
   but keeps keyboard focus, surfaced by .mpx-pill:focus-within in the scoped
   <style> block. */
function MPToggle({ legend, name, options, value, onChange, helper, note, icon }) {
  const helpId = name + "-help";
  return (
    <fieldset style={mp.fieldset} aria-describedby={helper ? helpId : undefined}>
      <legend style={mp.legend}>{icon && <span style={mp.legendIcon} aria-hidden="true">{icon}</span>}<span style={mp.legendText}>{legend}</span></legend>
      {helper && <span id={helpId} style={mp.helper}>{helper}</span>}
      <div style={mp.toggleRow} role="radiogroup" aria-label={legend}>
        {options.map((o) => {
          const active = value === o.value;
          const rid = name + "-" + o.value;
          return (
            <label key={o.value} htmlFor={rid} className="mpx-pill" style={{ ...mp.pill, ...(active ? mp.pillOn : {}) }}>
              <input type="radio" id={rid} name={name} value={o.value} checked={active} onChange={() => onChange(o.value)} style={mp.srOnly}/>
              <span style={{ ...mp.pillLabel, ...(active ? mp.pillLabelOn : {}) }}>{o.label}</span>
              {o.sub && <span style={{ ...mp.pillSub, ...(active ? mp.pillSubOn : {}) }}>{o.sub}</span>}
            </label>
          );
        })}
      </div>
      {note && <p style={mp.note}>{note}</p>}
    </fieldset>
  );
}

/* Shared input options + copy used by both the single-page and guided UIs. */
const MP_LOCATION_OPTIONS = [
  { value: "PERTH_CAPITAL_CITY", label: "Perth", sub: "capital-city area" },
  { value: "OTHER_WA_SOUTH_26", label: "Regional WA", sub: "South of the 26th" },
  { value: "OTHER_WA_NORTH_26", label: "Regional WA", sub: "North of the 26th" },
];
const MP_TYPE_OPTIONS = [
  { value: "ESTABLISHED_HOME", label: "Established", sub: "existing home" },
  { value: "NEW_COMPLETED_HOME", label: "Newly built", sub: "completed, never lived in" },
];
const MP_SCHEME_TOGGLE = [
  { value: "SCHEME_5", label: "Yes, 5% scheme", sub: "first home buyer" },
  { value: "SCHEME_2", label: "Yes, 2% scheme", sub: "single parent or guardian" },
  { value: "STANDARD", label: "No / not sure", sub: "standard lending" },
];
const MP_YESNO = [
  { value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Unsure" },
];
const MP_PATHWAY_WARNING = {
  SCHEME_2: "To use this option you must be an eligible single parent or single legal guardian and meet all Housing Australia and participating-lender requirements. Eligibility is confirmed by Housing Australia and your lender, not by this tool.",
  SCHEME_5: "To use this option you must meet all Housing Australia and participating-lender requirements. Eligibility is confirmed by Housing Australia and your lender, not by this tool.",
  STANDARD: "Any LMI shown is an indicative guide only. LMI varies by lender, insurer, loan amount and application.",
};
const MP_LEAD = "See roughly the most you may be able to spend on a Western Australian home to live in, once your deposit, stamp duty, costs and any government help are taken into account.";

/* Shared result rendering, used by both UIs. */
function mpRows(d, showScheme, borrowingCapacity, totalCash) {
  const list = [
    ["Maximum purchase price", mfmt(d.headlinePrice)],
    ["Borrowing capacity entered", mfmt(borrowingCapacity || 0)],
    ["Total cash entered", mfmt(totalCash || 0)],
  ];
  if (d.fhog > 0) list.push(["First Home Owner Grant included", mfmt(d.fhog)]);
  list.push(
    ["Your cash contribution toward the property", mfmt(d.depositContribution)],
    ["Estimated WA stamp duty", mfmt(d.duty)],
    ["Other purchase costs", mfmt(d.otherCosts)],
  );
  if (d.lmi > 0) list.push(["Estimated LMI (indicative)", mfmt(d.lmi)]);
  list.push(
    ["Base loan before LMI", mfmt(d.baseLoan)],
    ["Total loan including LMI", mfmt(d.totalLoan)],
    ["Base LVR", mpct(d.baseLvr)],
    ["Total LVR including LMI", mpct(d.totalLvr)],
  );
  if (showScheme && d.schemeCap) list.push(["Scheme property-price cap", mfmt(d.schemeCap)]);
  if (d.remainingCash > 0) list.push(["Remaining unused cash", mfmt(d.remainingCash)]);
  return list;
}

function MPResultBlock({ d, heading, subheading, scheme, borrowingCapacity, totalCash }) {
  const [open, setOpen] = React.useState(false);
  const repay = d.feasible ? mpMonthlyRepayment(d.totalLoan) : 0;
  return (
    <div style={mp.resultBlock}>
      {heading && <div style={mp.resultBlockHead}>{heading}</div>}
      {subheading && <div style={mp.resultBlockSub}>{subheading}</div>}
      {!d.feasible ? (
        <p style={mp.resultUnfeasible}>
          Based on these figures we couldn't estimate a purchase price yet. There isn't enough to cover the deposit,
          duty and costs. A quick chat with Mesh Finance can help map out the gap and a plan to get there.
        </p>
      ) : (
        <React.Fragment>
          <div style={mp.bigPrice}>{mfmt(d.headlinePrice)}</div>
          <div style={mp.limitLine}>Limited by {MP_LIMIT_LABEL[d.limitingFactor] || "your figures"}.</div>
          {repay > 0 && (
            <div style={mp.repayBox}>
              <span style={mp.repayValue}>≈ {mfmt(repay)} <span style={mp.repayPer}>/ month</span></span>
              <span style={mp.repayCaption}>Indicative repayment on a ${mfmt(d.totalLoan).slice(1)} loan over 30 years, principal and interest at 6% p.a.</span>
            </div>
          )}
          <button type="button" aria-expanded={open} aria-controls={"mp-detail-" + (scheme ? "scheme" : "std")}
            onClick={() => setOpen(!open)} style={mp.detailsToggle}>
            {open ? "Hide the details" : "See the full breakdown"}
            <span aria-hidden="true" style={mp.detailsChevron}>{open ? "▲" : "▼"}</span>
          </button>
          {open && (
            <div id={"mp-detail-" + (scheme ? "scheme" : "std")}>
              <dl style={mp.figGrid}>
                {mpRows(d, scheme, borrowingCapacity, totalCash).map(([k, v], i) => (
                  <div key={i} style={mp.figRow}>
                    <dt style={mp.figK}>{k}</dt>
                    <dd style={mp.figV}>{v}</dd>
                  </div>
                ))}
              </dl>
              <div style={mp.breakdown}>
                <div style={mp.breakdownTitle}>How the money adds up</div>
                <div style={mp.brRow}><span>Maximum property price</span><span>{mfmt(d.fundsPosition.price)}</span></div>
                <div style={mp.brRow}><span>+ Stamp duty</span><span>{mfmt(d.fundsPosition.duty)}</span></div>
                <div style={mp.brRow}><span>+ Other purchase costs</span><span>{mfmt(d.fundsPosition.otherCosts)}</span></div>
                {d.fundsPosition.lmiCapitalised > 0 &&
                  <div style={mp.brRow}><span>+ Indicative LMI added to the loan</span><span>{mfmt(d.fundsPosition.lmiCapitalised)}</span></div>}
                <div style={{ ...mp.brRow, ...mp.brTotal }}><span>= Total transaction &amp; loan position</span><span>{mfmt(d.fundsPosition.totalPosition)}</span></div>
                <div style={mp.brSplit}>
                  <div><span style={mp.brSplitL}>Funded by your cash</span><span style={mp.brSplitV}>{mfmt(d.fundsPosition.cashFunded)}</span></div>
                  <div><span style={mp.brSplitL}>Purchase price funded by the loan</span><span style={mp.brSplitV}>{mfmt(d.fundsPosition.loanFundedPrice)}</span></div>
                  <div><span style={mp.brSplitL}>LMI added to the loan</span><span style={mp.brSplitV}>{mfmt(d.fundsPosition.lmiAddedToLoan)}</span></div>
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

function MPResultView({ result, borrowingCapacity, totalCash, onNav }) {
  const { Alert, Button } = window.MeshFinanceDesignSystem_5c98d0;
  const { ArrowRight, Home } = window.MeshIcons;
  return (
    <div style={mp.resultCard} aria-live="polite">
      <div style={mp.resultLabel}><span style={mp.resultLabelIcon} aria-hidden="true"><Home width={24} height={24}/></span><span style={mp.legendText}>Your Estimated Maximum Purchase Price</span></div>
      {!result.ok ? (
        <p style={mp.prompt}>{result.messages && result.messages[0]}</p>
      ) : (
        <React.Fragment>
          <MPResultBlock d={result.primary} heading={result.usingScheme ? "Using the selected scheme" : null}
            scheme={result.usingScheme} borrowingCapacity={borrowingCapacity} totalCash={totalCash}/>
          {result.usingScheme && result.secondary && (
            <MPResultBlock d={result.secondary} heading="Estimated maximum without the government scheme"
              subheading="Standard lending, with indicative LMI and the 97% total loan-to-value limit, and no scheme price cap."
              scheme={false} borrowingCapacity={borrowingCapacity} totalCash={totalCash}/>
          )}
          {result.messages.map((m, i) => (<Alert key={i} variant="warning">{m}</Alert>))}
          <div style={mp.ctaWrap}>
            <Button block size="lg" onClick={() => onNav("contact")} iconRight={<ArrowRight width={18} height={18}/>}>
              Check this with Mesh Finance
            </Button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function MPDisclaimers({ lastReviewed }) {
  const { Alert } = window.MeshFinanceDesignSystem_5c98d0;
  return (
    <div style={mp.disclaimers}>
      <Alert variant="warning">
        LMI varies by lender, insurer, loan amount and application. This is a rough estimate only and may differ
        materially from the final premium.
      </Alert>
      <p style={mp.fine}>
        This calculator provides a general estimate only. It is not a loan approval, credit assessment,
        government-scheme eligibility assessment or quote for stamp duty or Lenders Mortgage Insurance. Actual
        borrowing capacity, property valuation, costs, LMI and eligibility will depend on the lender, insurer,
        RevenueWA, Housing Australia and your individual circumstances. Speak with Mesh Finance before entering into a
        property contract.
      </p>
      <p style={mp.fine}>
        Government thresholds and duty rates can change. Figures in this calculator use WA rules applying from
        7 May 2026 and should be reviewed regularly.
      </p>
      <p style={mp.reviewed}>Figures last reviewed {lastReviewed}.</p>
    </div>
  );
}

/* Shared input state + derived result for both UIs. */
function useMaxPurchaseInputs() {
  const MeshCalc = window.MeshCalc;
  const [borrowingCapacity, setBorrowingCapacity] = React.useState(null);
  const [totalCash, setTotalCash] = React.useState(null);
  const [location, setLocation] = React.useState("PERTH_CAPITAL_CITY");
  const [propertyType, setPropertyType] = React.useState("ESTABLISHED_HOME");
  const [pathway, setPathway] = React.useState("SCHEME_5");
  const [dutyElig, setDutyElig] = React.useState("unsure");
  const [fhogElig, setFhogElig] = React.useState("unsure");
  const [otherCosts, setOtherCosts] = React.useState(MeshCalc.CALC_CONFIG.defaultOtherPurchaseCosts);
  const isNew = propertyType === "NEW_COMPLETED_HOME";
  const result = React.useMemo(() => MeshCalc.calculateMaximumPurchasePrice({
    borrowingCapacity: borrowingCapacity || 0,
    totalCash: totalCash || 0,
    location, propertyType, pathway,
    firstHomeDutyEligibility: dutyElig,
    fhogEligibility: isNew ? fhogElig : "no",
    otherPurchaseCosts: otherCosts == null ? MeshCalc.CALC_CONFIG.defaultOtherPurchaseCosts : otherCosts,
  }), [borrowingCapacity, totalCash, location, propertyType, pathway, dutyElig, fhogElig, otherCosts, isNew, MeshCalc]);
  return {
    borrowingCapacity, setBorrowingCapacity, totalCash, setTotalCash, location, setLocation,
    propertyType, setPropertyType, pathway, setPathway, dutyElig, setDutyElig, fhogElig, setFhogElig,
    otherCosts, setOtherCosts, isNew, result, lastReviewed: MeshCalc.CALC_CONFIG.lastReviewed,
  };
}

/* Adjustable "other purchase costs" — shared expandable control. */
function MPCostsToggle({ idPrefix, otherCosts, setOtherCosts }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={mp.costsToggleWrap}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={idPrefix + "-costs-panel"} style={mp.costsToggle}>
        {open ? "▾" : "▸"} Adjust purchase costs
      </button>
      {open && (
        <div id={idPrefix + "-costs-panel"} style={mp.costsPanel}>
          <MoneyField id={idPrefix + "-costs"} label="Other estimated purchase costs"
            helper="This allowance may include settlement, registration, inspections and lender-related costs. Your actual costs may differ. It does not include stamp duty or LMI."
            value={otherCosts} onChange={setOtherCosts}/>
        </div>
      )}
    </div>
  );
}

/* ----- Option A: single-page, two-column ----- */
function MaxPurchasePriceCalculator({ onNav, contactUrl = "/contact" }) {
  const { Alert } = window.MeshFinanceDesignSystem_5c98d0;
  const { Building, Coins, MapPin, Home, Shield, Key, Star } = window.MeshIcons;
  // These glyphs fill their 24x24 box by different amounts, so a fixed size
  // makes some look smaller than others. Per-icon sizes even out the optical
  // footprint so every chip's icon looks the same size.
  const MP_ICON_SIZE = new Map([[Home, 19], [Building, 19], [Coins, 19], [MapPin, 19], [Shield, 20], [Key, 21], [Star, 18]]);
  const ic = (I) => { const px = MP_ICON_SIZE.get(I) || 18; return <I width={px} height={px}/>; };
  const isMobile = window.useIsMobile();
  const s = useMaxPurchaseInputs();
  const [touched, setTouched] = React.useState(false);
  const capError = touched && !s.borrowingCapacity ? "Enter your borrowing capacity to see an estimate." : null;
  const cashError = touched && !s.totalCash ? "Enter the cash you have available." : null;

  return (
    <Shell onNav={onNav} badge="Calculator" title="Maximum Home Purchase Price Calculator" lead={MP_LEAD}>
      <style>{MP_STYLE_CSS}</style>
      <div style={{ ...mp.layout, ...(isMobile ? mp.layoutMobile : {}) }}>
        <div style={mp.inputsCard}>
          <span style={mp.startHere}>Start here <span aria-hidden="true">↓</span></span>
          <MoneyField id="mp-borrow" label="How much can you borrow?" icon={ic(Building)}
            helper="Enter the maximum home loan amount you have been told you may be able to borrow."
            value={s.borrowingCapacity} onChange={(v) => { s.setBorrowingCapacity(v); setTouched(true); }} error={capError} placeholder="e.g. 600,000"/>
          <MoneyField id="mp-cash" label="How much cash do you have available?" icon={ic(Coins)}
            helper="Include the funds you're comfortable using towards your deposit and purchase costs. We'll split it between the deposit, stamp duty and costs for you."
            value={s.totalCash} onChange={(v) => { s.setTotalCash(v); setTouched(true); }} error={cashError} placeholder="e.g. 90,000"/>
          <MPToggle legend="Where is the property?" name="mp-location" icon={ic(MapPin)} options={MP_LOCATION_OPTIONS} value={s.location} onChange={s.setLocation}
            note="Scheme price caps can depend on the exact suburb and postcode. Confirm the applicable cap with Mesh Finance."/>
          <MPToggle legend="What type of home is it?" name="mp-type" icon={ic(Home)} options={MP_TYPE_OPTIONS} value={s.propertyType} onChange={s.setPropertyType}/>
          <Alert variant="info">
            Buying land, building a home or considering a house and land package? These purchases need a more tailored
            calculation. <a href={contactUrl} onClick={(e) => { e.preventDefault(); onNav("contact"); }} style={mp.link}>Contact Mesh Finance</a> for a personalised estimate.
          </Alert>
          <MPToggle legend="Are you eligible for either of these government schemes?" name="mp-scheme" icon={ic(Shield)} options={MP_SCHEME_TOGGLE} value={s.pathway} onChange={s.setPathway}
            helper="These federal schemes let eligible buyers get in with a smaller deposit and no LMI. Not sure? Choose “No / not sure” and we'll use standard lending."/>
          {MP_PATHWAY_WARNING[s.pathway] && <Alert variant="warning">{MP_PATHWAY_WARNING[s.pathway]}</Alert>}
          <MPToggle legend="Are you eligible for the WA first home owner rate of stamp duty?" name="mp-duty" icon={ic(Key)} options={MP_YESNO} value={s.dutyElig} onChange={s.setDutyElig}
            helper="This is separate from the schemes above. You can qualify for one and not the other."/>
          {s.isNew && (
            <MPToggle legend="Are you eligible for the $10,000 WA First Home Owner Grant?" name="mp-fhog" icon={ic(Star)} options={MP_YESNO} value={s.fhogElig} onChange={s.setFhogElig}
              helper="The grant can add to your available funds, but it can't count towards a scheme's minimum deposit."/>
          )}
          <MPCostsToggle idPrefix="mp" otherCosts={s.otherCosts} setOtherCosts={s.setOtherCosts}/>
        </div>

        <div style={mp.resultCol}>
          <MPResultView result={s.result} borrowingCapacity={s.borrowingCapacity} totalCash={s.totalCash} onNav={onNav}/>
        </div>
      </div>

      <MPDisclaimers lastReviewed={s.lastReviewed}/>
    </Shell>
  );
}

const MP_STYLE_CSS = `
  .mpx-money { transition: border-color .15s ease, box-shadow .15s ease; }
  .mpx-money:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--blue-50); }
  .mpx-money::placeholder { color: var(--text-subtle); font-weight: 500; }
  .mpx-radiocard { transition: border-color .15s ease, background .15s ease; }
  .mpx-radiocard:hover { border-color: var(--blue-300); }
  .mpx-pill { transition: border-color .15s ease, background .15s ease, box-shadow .15s ease; }
  .mpx-pill:hover { border-color: var(--blue-300); }
  .mpx-pill:focus-within { outline: 2px solid var(--color-primary); outline-offset: 2px; }
`;

const mp = {
  layout: { display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,420px)", gap: 28, alignItems: "start", marginBottom: 28 },
  layoutMobile: { gridTemplateColumns: "minmax(0,1fr)", gap: 22 },
  inputs: { display: "flex", flexDirection: "column", gap: 22 },
  inputsCard: { display: "flex", flexDirection: "column", gap: 24, background: "#fff",
    borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", boxShadow: "0 1px 3px rgba(16,42,67,0.06)", padding: "26px 24px" },
  startHere: { alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6,
    background: "var(--color-primary)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 700,
    fontSize: 11.5, letterSpacing: ".08em", textTransform: "uppercase", padding: "5px 13px", borderRadius: 999, marginBottom: -10 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15, color: "var(--text-strong)", display: "flex", alignItems: "center" },
  legendIcon: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 9,
    background: "var(--blue-50)", color: "var(--color-primary)", marginRight: 10, verticalAlign: "middle", flex: "none" },
  legendText: { verticalAlign: "middle" },
  resultLabelIcon: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 11,
    background: "rgba(255,255,255,0.22)", color: "#fff", marginRight: 12, verticalAlign: "middle", flex: "none" },
  helper: { fontSize: 13, lineHeight: 1.5, color: "var(--text-muted)" },
  errorText: { fontSize: 13, color: "var(--color-danger)", fontWeight: 600 },
  moneyWrap: { position: "relative", display: "flex", alignItems: "center" },
  moneyPrefix: { position: "absolute", left: 14, fontWeight: 700, fontSize: 16, color: "var(--text-muted)" },
  moneyInput: { width: "100%", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--navy-700)",
    background: "var(--surface-page)", border: "1.5px solid var(--border-subtle)", borderRadius: 12, padding: "13px 14px 13px 28px", lineHeight: 1.3 },
  inputError: { border: "1px solid var(--color-danger)" },

  fieldset: { border: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 },
  legend: { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15, color: "var(--text-strong)", padding: 0, marginBottom: 2, display: "flex", alignItems: "center" },
  radioList: { display: "flex", flexDirection: "column", gap: 8 },
  radioCard: { display: "flex", gap: 12, alignItems: "flex-start", padding: "13px 15px", borderRadius: 14,
    border: "1.5px solid var(--border-subtle)", background: "#fff", cursor: "pointer" },
  radioCardActive: { border: "1.5px solid var(--color-primary)", background: "var(--blue-50)" },
  radioInput: { marginTop: 3, accentColor: "var(--color-primary)", width: 17, height: 17, flex: "none", cursor: "pointer" },
  radioBody: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  radioLabel: { fontSize: 14.5, fontWeight: 600, color: "var(--text-strong)", lineHeight: 1.35 },
  radioDesc: { fontSize: 13, color: "var(--text-muted)", lineHeight: 1.45 },
  toggleRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  pill: { flex: "1 1 110px", minWidth: 104, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    textAlign: "center", gap: 2, padding: "11px 12px", borderRadius: 12, border: "1.5px solid var(--border-subtle)", background: "#fff", cursor: "pointer", position: "relative" },
  pillOn: { border: "1.5px solid var(--color-primary)", background: "var(--blue-50)" },
  pillLabel: { fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)", lineHeight: 1.25 },
  pillLabelOn: { color: "var(--blue-600)" },
  pillSub: { fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.3 },
  pillSubOn: { color: "var(--blue-500)" },
  srOnly: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 },
  note: { fontSize: 12.5, lineHeight: 1.5, color: "var(--text-muted)", margin: "4px 0 0", fontStyle: "italic" },
  link: { color: "var(--color-primary)", fontWeight: 600, textDecoration: "underline" },

  costsToggleWrap: {},
  costsToggle: { appearance: "none", background: "none", border: "none", padding: "4px 0", cursor: "pointer",
    fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14.5, color: "var(--color-primary)" },
  costsPanel: { marginTop: 12, padding: 16, background: "var(--surface-page)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" },

  resultCol: { position: "sticky", top: 90 },
  resultCard: { background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", overflow: "hidden",
    display: "flex", flexDirection: "column" },
  resultLabel: { background: "linear-gradient(135deg, var(--blue-600), var(--blue-500))", color: "#fff",
    padding: "20px 22px", fontSize: 18.5, fontWeight: 700, letterSpacing: "-.01em", lineHeight: 1.2, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" },
  prompt: { padding: "24px 22px", fontSize: 15, lineHeight: 1.55, color: "var(--text-muted)", margin: 0 },
  resultBlock: { padding: "20px 22px", borderBottom: "1px solid var(--border-subtle)" },
  resultBlockHead: { fontSize: 12.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--color-primary)", marginBottom: 6 },
  resultBlockSub: { fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.45, marginBottom: 10 },
  resultUnfeasible: { fontSize: 14.5, lineHeight: 1.55, color: "var(--text-body)", margin: 0 },
  bigPrice: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, lineHeight: 1, letterSpacing: "-.02em", color: "var(--navy-700)" },
  limitLine: { fontSize: 13, color: "var(--text-muted)", marginTop: 8, marginBottom: 14 },
  repayBox: { display: "flex", flexDirection: "column", gap: 3, padding: "13px 15px", background: "var(--blue-50)",
    borderRadius: 12, marginBottom: 14 },
  repayValue: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--navy-700)", lineHeight: 1 },
  repayPer: { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13.5, color: "var(--text-muted)" },
  repayCaption: { fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.4 },
  detailsToggle: { appearance: "none", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)",
    fontWeight: 600, fontSize: 13.5, color: "var(--color-primary)", padding: "4px 0", display: "inline-flex", alignItems: "center", gap: 6 },
  detailsChevron: { fontSize: 10 },
  figGrid: { margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 0 },
  figRow: { display: "flex", justifyContent: "space-between", gap: 14, padding: "7px 0", borderTop: "1px solid var(--border-subtle)" },
  figK: { fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.4, margin: 0 },
  figV: { fontSize: 13.5, fontWeight: 700, color: "var(--navy-700)", margin: 0, whiteSpace: "nowrap" },
  breakdown: { marginTop: 16, padding: 14, background: "var(--blue-50)", borderRadius: "var(--radius-md)" },
  breakdownTitle: { fontSize: 12.5, fontWeight: 700, color: "var(--navy-700)", marginBottom: 8 },
  brRow: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, color: "var(--text-body)", padding: "3px 0" },
  brTotal: { fontWeight: 700, color: "var(--navy-700)", borderTop: "1px solid var(--border-subtle)", marginTop: 4, paddingTop: 7 },
  brSplit: { marginTop: 10, display: "grid", gap: 6 },
  brSplitL: { fontSize: 12, color: "var(--text-muted)", display: "block" },
  brSplitV: { fontSize: 13.5, fontWeight: 700, color: "var(--navy-700)" },
  ctaWrap: { padding: "18px 22px" },

  disclaimers: { display: "flex", flexDirection: "column", gap: 12, maxWidth: 820 },
  fine: { fontSize: 12.5, lineHeight: 1.55, color: "var(--text-muted)", margin: 0 },
  reviewed: { fontSize: 12, color: "var(--text-subtle)", margin: "2px 0 0", fontStyle: "italic" },
};

const c = {
  head: { background:"var(--blue-50)" },
  headInner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"48px 28px 52px",
    display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" },
  body: { background:"var(--surface-page)", padding:"48px 0 72px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },
  h1: { fontSize:40, margin:0, color:"var(--navy-700)", letterSpacing:"-.02em", maxWidth:760 },
  lead: { fontSize:17, lineHeight:1.6, color:"var(--text-body)", margin:0, maxWidth:760 },
  layout: { display:"grid", gridTemplateColumns:"1fr 380px", gap:24, alignItems:"start", marginBottom:24 },
  layoutMobile: { gridTemplateColumns:"1fr" },
  fieldGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 24px" },
  fieldGridMobile: { gridTemplateColumns:"1fr" },
  field: { marginBottom:22 },
  fieldTop: { display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:9 },
  label: { fontFamily:"var(--font-body)", fontWeight:600, fontSize:14, color:"var(--text-strong)" },
  value: { fontFamily:"var(--font-display)", fontWeight:700, fontSize:16, color:"var(--color-primary)" },
  valWrap: { display:"flex", alignItems:"center", gap:6 },
  valAffix: { fontFamily:"var(--font-display)", fontWeight:700, fontSize:15, color:"var(--color-primary)" },
  valInput: { width:104, fontFamily:"var(--font-display)", fontWeight:700, fontSize:15.5, color:"var(--color-primary)",
    textAlign:"right", background:"#fff", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-sm)",
    padding:"6px 10px", lineHeight:1.3 },
  range: { width:"100%", accentColor:"var(--color-primary)", height:6, cursor:"pointer" },
  inputWrap: { position:"relative", display:"flex", alignItems:"center" },
  inputPrefix: { position:"absolute", left:14, fontFamily:"var(--font-body)", fontWeight:600, fontSize:15, color:"var(--text-muted)" },
  numInput: { width:"100%", fontFamily:"var(--font-body)", fontSize:15.5, color:"var(--text-strong)",
    background:"#fff", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-sm)",
    padding:"11px 14px", lineHeight:1.4, appearance:"none" },
  numInputPad: { paddingLeft:28 },
  inputHint: { fontSize:12.5, color:"var(--text-muted)", marginTop:5 },
  toggleRow: { display:"flex", gap:8, marginTop:6 },
  toggleBtn: { flex:1, padding:"10px 12px", borderRadius:"var(--radius-sm)", border:"1px solid var(--border-subtle)",
    background:"#fff", fontFamily:"var(--font-body)", fontWeight:600, fontSize:13.5, color:"var(--text-muted)", cursor:"pointer" },
  toggleBtnActive: { background:"var(--color-primary)", color:"#fff", borderColor:"var(--color-primary)" },

  result: { position:"sticky", top:90, overflow:"hidden", border:"none", boxShadow:"var(--shadow-md)" },
  resultMobile: { position:"static" },
  resultTop: { background:"linear-gradient(135deg, var(--blue-600), var(--blue-500))", color:"#fff",
    padding:"30px 28px 26px", display:"flex", flexDirection:"column", gap:6 },
  resultLabel: { fontSize:13.5, color:"rgba(255,255,255,.85)", fontWeight:500 },
  resultBig: { fontFamily:"var(--font-display)", fontWeight:800, fontSize:42, lineHeight:1, letterSpacing:"-.02em" },
  resultSub: { fontSize:13.5, color:"rgba(255,255,255,.9)", marginTop:4 },
  resultGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:"var(--border-subtle)" },
  miniStat: { background:"#fff", padding:"18px 22px", display:"flex", flexDirection:"column", gap:3 },
  miniV: { fontFamily:"var(--font-display)", fontWeight:700, fontSize:20, color:"var(--navy-700)" },
  miniL: { fontSize:12.5, color:"var(--text-muted)" },
  resultFoot: { padding:22, background:"#fff" },
  embedFrame: { width:"100%", height:900, border:"none", display:"block" },

  compareHeadline: { fontFamily:"var(--font-display)", fontWeight:700, fontSize:22, lineHeight:1.3, letterSpacing:"-.01em" },
  compareHeading: { padding:"16px 22px 4px", background:"#fff", display:"flex", flexDirection:"column", gap:2 },
  compareHeadingT: { fontSize:13.5, fontWeight:700, color:"var(--navy-700)" },
  compareHeadingSub: { fontSize:12.5, color:"var(--text-muted)" },
  compareGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:"var(--border-subtle)" },
  compareCard: { background:"#fff", padding:"14px 20px 18px", display:"flex", flexDirection:"column", gap:6 },
  compareCardWin: { background:"var(--blue-50)" },
  compareLabelRow: { display:"flex", flexWrap:"wrap", alignItems:"center", gap:8, minHeight:38 },
  compareLabel: { fontSize:12.5, fontWeight:600, color:"var(--text-strong)" },
  compareBigRow: { display:"flex", flexWrap:"wrap", alignItems:"center", gap:8 },
  compareBig: { fontFamily:"var(--font-display)", fontWeight:800, fontSize:23, color:"var(--navy-700)" },
  compareSub: { fontSize:12.5, color:"var(--text-muted)" },
  breakEvenBox: { padding:"18px 22px", background:"#fff", borderTop:"1px solid var(--border-subtle)", display:"flex", flexDirection:"column", gap:5 },
  breakEvenLabel: { fontSize:13, fontWeight:700, color:"var(--navy-700)" },
  breakEvenBody: { fontSize:13.5, lineHeight:1.5, color:"var(--text-muted)" },
};

Object.assign(window, { MeshCalculatorScreen: CalculatorScreen });

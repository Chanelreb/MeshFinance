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

  if (kind === "loan-repayment") {
    const [amount, setAmount] = useState(550000);
    const [rate, setRate] = useState(6.2);
    const [term, setTerm] = useState(30);
    const [freq, setFreq] = useState("monthly");
    const periodsPerYear = freq === "monthly" ? 12 : 26;
    const r = rate/100/periodsPerYear;
    const n = term*periodsPerYear;
    const repay = r>0 ? amount * r / (1-Math.pow(1+r,-n)) : amount/n;
    const totalPaid = repay*n;
    return (
      <Shell badge="Calculator" title="Home Loan Repayment Calculator" lead="Crunch my repayments, estimate your monthly or fortnightly repayment based on loan amount, rate and term."
        note="This is an indicative estimate only and not an offer of credit.">
        <div style={{...c.layout, ...(isMobile ? c.layoutMobile : {})}}>
          <Card elevation="shadow" style={{padding:28}}>
            <Slider label="Loan amount" value={amount} set={setAmount} min={100000} max={2000000} step={10000} prefix="$"/>
            <Slider label="Interest rate" value={rate} set={setRate} min={4} max={9} step={0.1} suffix="% p.a."/>
            <Slider label="Loan term" value={term} set={setTerm} min={10} max={30} step={1} suffix="years"/>
            <div style={c.toggleRow}>
              {["monthly","fortnightly"].map(f=>(
                <button key={f} onClick={()=>setFreq(f)} style={{...c.toggleBtn, ...(freq===f?c.toggleBtnActive:{})}}>{f}</button>
              ))}
            </div>
          </Card>
          <ResultCard onNav={onNav} label={`Estimated ${freq} repayment`} big={fmt(repay)}
            stats={[{v:fmt(totalPaid),l:"Total repaid over term"},{v:fmt(totalPaid-amount),l:"Total interest"}]}/>
        </div>
      </Shell>
    );
  }

  if (kind === "stamp-duty") {
    return (
      <Shell badge="Calculator" title="Stamp Duty Calculator" lead="The stamp duty decoder, know roughly what you'll need to budget for based on property value and buyer type.">
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
      <Shell badge="Calculator" title="Borrowing Power Calculator" lead="Get an idea of how much you may be able to borrow based on your income, expenses and existing commitments. Powered by Vision Abacus, so living expense benchmarks and lender figures stay up to date.">
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
      <Shell badge="Calculator" title="Extra Repayment Calculator" lead="Extra payments, big savings, see how making additional repayments can reduce your loan term and interest."
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

  if (kind === "interest-only") {
    const [amount, setAmount] = useState(550000);
    const [rate, setRate] = useState(6.4);
    const [ioTerm, setIoTerm] = useState(5);
    const [term, setTerm] = useState(30);
    const ioRepay = amount * (rate/100/12);
    const r = rate/100/12; const remainingTerm = (term - ioTerm) * 12;
    const piRepay = r>0 ? amount * r / (1-Math.pow(1+r,-remainingTerm)) : amount/remainingTerm;
    return (
      <Shell badge="Calculator" title="Interest Only Mortgage Calculator" lead="See what you'd pay during an interest-only period, and how repayments step up once principal and interest kick in."
        note="This is an indicative estimate only and not an offer of credit.">
        <div style={{...c.layout, ...(isMobile ? c.layoutMobile : {})}}>
          <Card elevation="shadow" style={{padding:28}}>
            <Slider label="Loan amount" value={amount} set={setAmount} min={100000} max={2000000} step={10000} prefix="$"/>
            <Slider label="Interest rate" value={rate} set={setRate} min={4} max={9} step={0.1} suffix="% p.a."/>
            <Slider label="Interest-only period" value={ioTerm} set={setIoTerm} min={1} max={5} step={1} suffix="years"/>
            <Slider label="Total loan term" value={term} set={setTerm} min={15} max={30} step={1} suffix="years"/>
          </Card>
          <ResultCard onNav={onNav} label="Interest-only repayment (monthly)" big={fmt(ioRepay)}
            sub="Interest only, principal doesn't reduce during this period"
            stats={[{v:fmt(piRepay),l:`P&I repayment after year ${ioTerm}`},{v:fmt(amount),l:"Loan amount stays the same"}]}/>
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
      <Shell badge="Calculator" title="Saving Calculator" lead="Grow my savings, see how a starting balance plus regular deposits builds up over time with interest.">
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
      <Shell badge="Calculator" title="Lump Sum Repayment Calculator" lead="Put a lump sum to work, see how a one-off payment against your loan cuts your term and interest bill."
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
      <Shell badge="Calculator" title="How Long to Repay Calculator" lead="Set a repayment amount and see how long it will take to pay off your loan in full."
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
      <Shell badge="Calculator" title="Offset vs Redraw Calculator"
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

  // default: loan-repayment (fallback, App.jsx always passes a valid kind)
  return null;
}

/* Page shell shared by all calculators, module scope so component identity is stable across re-renders. */
function Shell({ badge, title, lead, children, note }) {
  const { Badge, Alert } = window.MeshFinanceDesignSystem_5c98d0;
  return (
    <div style={c.page}>
      <div style={c.inner}>
        <div style={c.intro}>
          <Badge color="blue" dot>{badge}</Badge>
          <h1 style={c.h1}>{title}</h1>
          <p style={c.lead}>{lead}</p>
        </div>
        {children}
        {note && <Alert variant="warning">{note}</Alert>}
      </div>
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
            <li key={i} style={info.plainItem}><strong style={info.strong}>{s.t}</strong> — {s.b}</li>
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

const c = {
  page: { background:"var(--surface-page)", padding:"48px 0 72px" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", padding:"0 28px" },
  intro: { maxWidth:620, marginBottom:32 },
  h1: { fontSize:40, margin:"18px 0 12px", color:"var(--navy-700)", letterSpacing:"-.02em" },
  lead: { fontSize:17, lineHeight:1.55, color:"var(--text-muted)", margin:0 },
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

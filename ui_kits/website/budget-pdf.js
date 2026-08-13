/* =============================================================================
 * Money by Design — client-side PDF export (window.MeshBudgetPdf).
 * Builds a branded, intentionally-designed multi-page PDF from the engine
 * results (NOT a print of the page). jsPDF is vendored locally and lazy-loaded
 * only when the user actually downloads, so it never weighs down page load.
 * Kept deliberately modular so a future email/export path can reuse build().
 * ===========================================================================*/
(function () {
  "use strict";

  var JSPDF_SRC = "vendor.jspdf.umd.min.js"; // resolves against <base href="/ui_kits/website/">

  function ensureLib() {
    return new Promise(function (resolve, reject) {
      if (window.jspdf && window.jspdf.jsPDF) return resolve(window.jspdf.jsPDF);
      var existing = document.getElementById("mesh-jspdf");
      if (existing) { existing.addEventListener("load", function () { resolve(window.jspdf.jsPDF); }); existing.addEventListener("error", reject); return; }
      var s = document.createElement("script");
      s.id = "mesh-jspdf"; s.src = JSPDF_SRC; s.async = true;
      s.onload = function () { window.jspdf && window.jspdf.jsPDF ? resolve(window.jspdf.jsPDF) : reject(new Error("jsPDF missing")); };
      s.onerror = function () { reject(new Error("jsPDF failed to load")); };
      document.head.appendChild(s);
    });
  }

  var C = {
    navy: [16, 42, 67], blue: [56, 152, 224], gray: [58, 66, 77], muted: [107, 114, 128],
    green: [46, 158, 91], amber: [224, 161, 50], line: [225, 230, 236], soft: [234, 244, 252],
    grayWord: [104, 104, 104], white: [255, 255, 255],
  };
  function hexToRgb(h) {
    var m = /^#?([0-9a-f]{6})$/i.exec(h || "");
    if (!m) return C.blue;
    var n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function fmtDate(d) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  }
  function fmtDateFile(d) {
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  /* Build the document. Exposed for reuse. */
  function build(jsPDF, results, meta) {
    var B = window.MeshBudget;
    meta = meta || {};
    var now = new Date();
    var doc = new jsPDF({ unit: "mm", format: "a4" });
    var PW = 210, M = 16, CW = PW - M * 2;
    var y = M;

    function color(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function fill(c) { doc.setFillColor(c[0], c[1], c[2]); }
    function draw(c) { doc.setDrawColor(c[0], c[1], c[2]); }
    function font(style, size) { doc.setFont("helvetica", style); doc.setFontSize(size); }
    function pageBreak(needed) { if (y + needed > 285) { doc.addPage(); y = M; } }

    function heading(text) {
      pageBreak(14);
      y += 4;
      font("bold", 13); color(C.navy); doc.text(text, M, y);
      y += 2.5; draw(C.line); doc.setLineWidth(0.4); doc.line(M, y, M + CW, y);
      y += 6;
    }
    function para(text, size, c) {
      font("normal", size || 10); color(c || C.gray);
      var lines = doc.splitTextToSize(text, CW);
      lines.forEach(function (ln) { pageBreak(6); doc.text(ln, M, y); y += 5; });
    }

    /* ---- Branded header band ---- */
    fill(C.navy); doc.rect(0, 0, PW, 26, "F");
    font("bold", 20); color(C.white); doc.text("MESH", M, 16);
    var mw = doc.getTextWidth("MESH");
    font("normal", 20); doc.setTextColor(200, 210, 222); doc.text(" FINANCE", M + mw, 16);
    font("normal", 9); doc.setTextColor(200, 210, 222); doc.text("meshfinance.com.au", PW - M, 12, { align: "right" });
    doc.text("0416 291 241", PW - M, 17, { align: "right" });
    y = 34;

    font("bold", 22); color(C.navy); doc.text("Money by Design", M, y); y += 8;
    font("italic", 11); color(C.blue); doc.text("Map out your money. Build the life you want to live.", M, y); y += 7;
    font("normal", 9); color(C.muted);
    doc.text((meta.firstName ? meta.firstName + "'s plan · " : "") + "Generated " + fmtDate(now), M, y);
    y += 4;

    /* ---- Headline numbers ---- */
    heading("Your money at a glance");
    var stats = [
      ["Household take-home", B.formatMoney(results.income.monthly) + " /mo", C.navy],
      ["Total current spending", B.formatMoney(results.totals.outgoings) + " /mo", C.navy],
      ["Breathing room", B.formatMoney(results.breathingRoom) + " /mo", results.breathingRoom >= 0 ? C.green : C.blue],
    ];
    var bw = (CW - 8) / 3;
    stats.forEach(function (s, i) {
      var x = M + i * (bw + 4);
      fill(C.soft); doc.roundedRect(x, y, bw, 20, 2, 2, "F");
      font("normal", 8); color(C.muted); doc.text(s[0].toUpperCase(), x + 4, y + 6);
      font("bold", 13); color(s[2]); doc.text(s[1], x + 4, y + 14);
    });
    y += 26;
    if (results.breathingRoom < 0) {
      para("Your current plan is using a little more than your monthly income. That's a useful place to start — the sections below show where there may be room to adjust.", 9, C.muted);
    }

    /* ---- Where your money goes (stacked bar) ---- */
    heading("Where your money goes");
    var segs = results.chart.segments;
    if (segs.length) {
      var base = results.chart.base || 1;
      var barY = y, barH = 10, x0 = M;
      segs.forEach(function (sg) {
        var w = (sg.amount / base) * CW;
        fill(hexToRgb(sg.color)); doc.rect(x0, barY, w, barH, "F");
        x0 += w;
      });
      y += barH + 6;
      segs.forEach(function (sg) {
        pageBreak(6);
        fill(hexToRgb(sg.color)); doc.roundedRect(M, y - 3, 3, 3, 0.5, 0.5, "F");
        font("normal", 9.5); color(C.gray);
        doc.text(sg.label, M + 6, y);
        font("normal", 9.5); color(C.muted);
        doc.text(B.formatMoney(sg.amount) + "  ·  " + B.formatPct(sg.pct), M + CW, y, { align: "right" });
        y += 5.5;
      });
    } else { para("Add income and expenses to see your breakdown.", 9, C.muted); }

    /* ---- Four buckets ---- */
    heading("Your four buckets");
    results.buckets.forEach(function (b) {
      pageBreak(18);
      font("bold", 11); color(C.navy); doc.text(b.label, M, y);
      font("normal", 9); color(C.muted);
      doc.text(b.feedback.title, M + CW, y, { align: "right" });
      y += 5;
      font("normal", 9.5); color(C.gray);
      doc.text(B.formatMoney(b.actualAmt) + " /mo  ·  " + B.formatPct(b.actualPct) + " of income  (target " + B.formatPct(b.targetPct) + ")", M, y);
      y += 3;
      // mini bar: actual fill + target marker
      var mbY = y, mbH = 4;
      fill(C.line); doc.rect(M, mbY, CW, mbH, "F");
      var af = Math.max(0, Math.min(1, b.actualPct / 100));
      fill(hexToRgb(b.color)); doc.rect(M, mbY, CW * af, mbH, "F");
      var tf = Math.max(0, Math.min(1, b.targetPct / 100));
      draw(C.navy); doc.setLineWidth(0.6); doc.line(M + CW * tf, mbY - 1, M + CW * tf, mbY + mbH + 1);
      y += mbH + 4;
      font("normal", 8.5); color(C.muted);
      var fl = doc.splitTextToSize(b.feedback.message, CW); doc.text(fl[0], M, y); y += 6;
    });

    /* ---- Mortgage / housing check ---- */
    if (results.housing) {
      heading("Your " + (results.housing.isRent ? "housing" : "mortgage") + " check");
      para("Your " + results.housing.label.toLowerCase() + " uses " + B.formatPct(results.housing.pctOfIncome) + " of your household take-home income (" + B.formatMoney(results.housing.monthly) + "/mo).", 10, C.gray);
      var gY = y, gH = 6;
      fill(C.line); doc.rect(M, gY, CW, gH, "F");
      fill(C.blue); doc.rect(M, gY, CW * Math.min(1, results.housing.pctOfIncome / 100), gH, "F");
      draw(C.muted); doc.setLineWidth(0.5); doc.line(M + CW * 0.30, gY - 1, M + CW * 0.30, gY + gH + 1);
      y += gH + 5;
      para("The ~30% marker is a general guide only and may use different income definitions.", 8.5, C.muted);
    }

    /* ---- Debt summary ---- */
    if (results.debt.count > 0) {
      heading("Your debts");
      para("Total balance: " + B.formatMoney(results.debt.totalBalance) + "    ·    Monthly repayments: " + B.formatMoney(results.debt.monthlyRepayments) + "    ·    " + B.formatPct(results.debt.pctOfIncome) + " of take-home income.", 10, C.gray);
      (results.breakdown.futureYou || []).filter(function (i) { return i.debt; }).forEach(function (i) {
        pageBreak(6); font("normal", 9.5); color(C.gray); doc.text(i.name, M + 2, y);
        doc.text(B.formatMoney(i.monthly) + " /mo", M + CW, y, { align: "right" }); y += 5;
      });
    }

    /* ---- Goals ---- */
    var goals = (results.goals || []).filter(function (g) { return g.target > 0; });
    if (goals.length) {
      heading("What you're building towards");
      goals.forEach(function (g) {
        pageBreak(14);
        font("bold", 10.5); color(C.navy); doc.text(g.name, M, y);
        font("normal", 9); color(C.muted);
        doc.text(Math.round(g.savedPct) + "%", M + CW, y, { align: "right" }); y += 4;
        var pY = y, pH = 4;
        fill(C.line); doc.rect(M, pY, CW, pH, "F");
        fill(hexToRgb(window.MeshBudget.BUCKET_META.goals.color)); doc.rect(M, pY, CW * Math.min(1, g.savedPct / 100), pH, "F");
        y += pH + 3;
        font("normal", 9); color(C.gray);
        var line = B.formatMoney(g.saved) + " of " + B.formatMoney(g.target);
        if (!g.complete && g.monthsLeft != null && g.monthsLeft > 0) line += "  ·  " + B.formatMoney(g.requiredMonthly) + "/mo needed over " + g.monthsLeft + " months";
        doc.text(line, M, y); y += 6;
      });
    }

    /* ---- Expense summary ---- */
    heading("Expense summary");
    B.BUCKET_ORDER.forEach(function (k) {
      var items = (results.breakdown[k] || []);
      var total = items.reduce(function (s, x) { return s + x.monthly; }, 0);
      pageBreak(6);
      font("bold", 9.5); color(C.navy); doc.text(B.BUCKET_META[k].label, M, y);
      doc.text(B.formatMoney(total) + " /mo", M + CW, y, { align: "right" }); y += 5;
    });

    /* ---- Contact CTA ---- */
    pageBreak(26); y += 2;
    fill(C.navy); doc.roundedRect(M, y, CW, 20, 2, 2, "F");
    font("bold", 11); color(C.white); doc.text("Want to talk it through?", M + 5, y + 8);
    font("normal", 9); doc.setTextColor(210, 220, 230);
    doc.text("Mesh Finance can review your lending, repayments and structure. hello@meshfinance.com.au · 0416 291 241 · meshfinance.com.au", M + 5, y + 14, { maxWidth: CW - 10 });
    y += 26;

    /* ---- Disclaimer ---- */
    para(window.MBD_DISCLAIMER || "This tool is for general information only and does not constitute personal financial or credit advice.", 7.5, C.muted);

    return doc;
  }

  function filename(meta) {
    var d = fmtDateFile(new Date());
    var name = (meta && meta.firstName ? String(meta.firstName).replace(/[^A-Za-z0-9]/g, "") : "");
    return "Money-by-Design-" + (name ? name + "-" : "") + d + ".pdf";
  }

  function download(results, meta) {
    return ensureLib().then(function (jsPDF) {
      var doc = build(jsPDF, results, meta);
      doc.save(filename(meta));
    });
  }

  window.MeshBudgetPdf = { download: download, build: build, ensureLib: ensureLib };
})();

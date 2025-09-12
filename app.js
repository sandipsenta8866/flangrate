// This file contains all the functional logic for the calculator app.
// It reads data from product files and handles UI updates and PDF generation.

document.addEventListener("DOMContentLoaded", () => {
  // --- Global Constants ---
  const OUTPUT_DECIMALS = {
    I: 2,
    J: 2,
    K: 3,
    L: 3,
    M: 3,
    N: 3,
    O: 3,
    P: 3,
    Q: 3,
    R: 3,
    V: 2,
    W: 2,
    X: 2,
    Z: 2,
    AA: 0,
    AB: 3,
  };
  const PI = 3.14,
    DENS = 0.00000785;

  // --- Application State ---
  let currentProductKey = "ASA SORF";
  let currentRowKey = 0;

  // --- Helper Functions ---
  function n(v) {
    const t = Number(v);
    return isFinite(t) ? t : 0;
  }
  function fmtDec(v, d) {
    return (
      Math.round((n(v) + Number.EPSILON) * Math.pow(10, d)) / Math.pow(10, d)
    ).toFixed(d);
  }
  function inr(v, d) {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      }).format(n(v));
    } catch (e) {
      return "₹" + fmtDec(v, d);
    }
  }
  // Expose for use in other files
  window.inr = inr;

  function getCurrentConfig() {
    return window.PRODUCT_REGISTRY.configs[currentProductKey];
  }

  // --- Core Calculation Logic ---
  function computeOutputs(IN) {
    const calculator = window.PRODUCT_REGISTRY.calculators[currentProductKey];
    if (typeof calculator === "function") {
      return calculator(IN, { n, PI, DENS });
    } else {
      console.error(`Calculator for product "${currentProductKey}" not found.`);
      return {};
    }
  }

  // --- DOM Manipulation & Event Handlers ---
  function getIN() {
    const o = {};
    const config = getCurrentConfig();
    config.INPUT_COLS.forEach((c) => {
      const el = document.getElementById("IN_" + c);
      o[c] = n(el && el.value);
    });
    return o;
  }
  function outLabelDynamic(col) {
    const config = getCurrentConfig();
    const raw = (config.OUTPUT_LABELS && config.OUTPUT_LABELS[col]) || col;
    const inputLabels = new Set(
      Object.values(config.INPUT_HEADERS || {}).map((s) =>
        String(s || "")
          .trim()
          .toLowerCase()
      )
    );
    return inputLabels.has(String(raw).trim().toLowerCase())
      ? raw + " (calc)"
      : raw;
  }
  function recalc() {
    const IN = getIN();
    const O = computeOutputs(IN);
    const config = getCurrentConfig();
    document.getElementById("finalAmt").textContent = inr(
      O.AA,
      OUTPUT_DECIMALS["AA"] ?? 0
    );
    const grid = document.getElementById("results");
    grid.innerHTML = "";
    config.OUTPUT_ORDER.forEach((col) => {
      const wrap = document.createElement("div");
      wrap.className = "pair";
      const k = document.createElement("div");
      k.className = "k";
      k.textContent = outLabelDynamic(col);
      const v = document.createElement("div");
      v.className = "v";
      v.textContent = fmtDec(O[col], OUTPUT_DECIMALS[col] ?? 2);
      wrap.appendChild(k);
      wrap.appendChild(v);
      grid.appendChild(wrap);
    });
  }
  function renderInputs() {
    const config = getCurrentConfig();
    const box = document.getElementById("inputs");
    box.innerHTML = "";
    const defaults = config.DEFAULTS[currentRowKey] || {};
    config.INPUT_COLS.forEach((c) => {
      const w = document.createElement("div");
      const lab = document.createElement("label");
      lab.className = "small";
      lab.textContent = config.INPUT_HEADERS[c] || c;
      const inp = document.createElement("input");
      inp.type = "number";
      inp.step = "any";
      inp.id = "IN_" + c;
      inp.value = defaults[c] == null ? "" : defaults[c];
      inp.addEventListener("input", recalc);
      w.appendChild(lab);
      w.appendChild(inp);
      box.appendChild(w);
    });
  }

  function populateProductTemplateDropdown(valueToSet) {
    const config = getCurrentConfig();
    const sel = document.getElementById("rowPick");
    sel.innerHTML = "";
    config.ROWS.forEach((r) => {
      const o = document.createElement("option");
      o.value = r;
      o.textContent = config.ROW_LABELS[r];
      sel.appendChild(o);
    });

    const valueAsNumber = parseInt(valueToSet, 10);
    if (valueToSet !== undefined && config.ROWS.includes(valueAsNumber)) {
      sel.value = valueToSet;
      currentRowKey = valueAsNumber;
    } else if (config.ROWS.length > 0) {
      let defaultRow =
        config.ROWS.find((r) => String(config.ROW_LABELS[r]).includes("12")) ||
        config.ROWS[0];
      sel.value = defaultRow;
      currentRowKey = defaultRow;
    }

    sel.onchange = (event) => {
      currentRowKey = parseInt(event.target.value, 10);
      renderInputs();
      recalc();
    };
  }

  function initProductSelector() {
    const sel = document.getElementById("productPick");
    if (!sel) return;
    sel.innerHTML = "";
    Object.keys(window.PRODUCT_REGISTRY.configs).forEach((name) => {
      const o = document.createElement("option");
      o.value = name;
      o.textContent = name;
      sel.appendChild(o);
    });
    sel.value = currentProductKey;
    sel.addEventListener("change", (e) => {
      currentProductKey = e.target.value;
      populateProductTemplateDropdown();
      renderInputs();
      recalc();
    });
    populateProductTemplateDropdown();
    renderInputs();
    recalc();
  }

  // ---- PDF & Logo helpers ----
  function getPDFSpecCols() {
    const config = getCurrentConfig();
    return config.PDF_SPEC_COLS || [];
  }
  function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const logoDataUrl = e.target.result;
      try {
        localStorage.setItem("brandLogo", logoDataUrl);
        document.getElementById("logoPreview").src = logoDataUrl;
      } catch (err) {
        console.error("Error saving logo to localStorage:", err);
      }
    };
    reader.readAsDataURL(file);
  }
  function loadLogo() {
    try {
      const savedLogo = localStorage.getItem("brandLogo");
      if (savedLogo) {
        document.getElementById("logoPreview").src = savedLogo;
      }
    } catch (err) {
      console.error("Error loading logo from localStorage:", err);
    }
  }
  function populateDateDropdowns() {
    const now = new Date();
    const ySel = document.getElementById("qYear"),
      mSel = document.getElementById("qMonth"),
      dSel = document.getElementById("qDay");
    if (!ySel || !mSel || !dSel) return;
    const y0 = now.getFullYear() - 3,
      y1 = now.getFullYear() + 3;
    ySel.innerHTML = "";
    for (let y = y0; y <= y1; y++) {
      const o = document.createElement("option");
      o.value = y;
      o.textContent = y;
      ySel.appendChild(o);
    }
    ySel.value = now.getFullYear();
    const monthNames = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    mSel.innerHTML = "";
    for (let i = 1; i <= 12; i++) {
      const o = document.createElement("option");
      o.value = i;
      o.textContent = monthNames[i - 1];
      mSel.appendChild(o);
    }
    mSel.value = now.getMonth() + 1;
    dSel.innerHTML = "";
    for (let d = 1; d <= 31; d++) {
      const o = document.createElement("option");
      o.value = d;
      o.textContent = String(d).padStart(2, "0");
      dSel.appendChild(o);
    }
    dSel.value = now.getDate();
  }

  function getBrand() {
    const v = (id) => (document.getElementById(id)?.value || "").trim();
    const dd = String(document.getElementById("qDay")?.value || "01").padStart(
      2,
      "0"
    );
    const mm = String(
      document.getElementById("qMonth")?.value || "01"
    ).padStart(2, "0");
    const yy = String(
      document.getElementById("qYear")?.value || new Date().getFullYear()
    );
    return {
      brandName: v("brandName"),
      brandPhone: v("brandPhone"),
      brandEmail: v("brandEmail"),
      brandAddr: v("brandAddr"),
      brandGST: v("brandGST"),
      clientName: v("clientName"),
      clientMobile: v("clientMobile"),
      quoteDateDMY: dd + "/" + mm + "/" + yy,
    };
  }

  function buildPrintDoc() {
    const logoContainer = document.getElementById("printBackgroundLogo");
    const savedLogo = localStorage.getItem("brandLogo");
    logoContainer.style.backgroundImage = savedLogo
      ? `url(${savedLogo})`
      : "none";
    const B = getBrand();
    const config = getCurrentConfig();
    const rowLabel = config.ROW_LABELS[currentRowKey] || "Row " + currentRowKey;
    const IN = getIN();
    const OUT = computeOutputs(IN);
    const wrap = document.getElementById("printWrap");
    wrap.innerHTML = "";
    const head = document.createElement("div");
    head.className = "print-header";
    const left = document.createElement("div");
    left.className = "print-brand";
    left.innerHTML =
      `<h1>${B.brandName || ""}</h1>` +
      (B.brandPhone
        ? `<div class='print-meta'><b>Mobile:</b> ${B.brandPhone}</div>`
        : "") +
      (B.brandAddr ? `<div class='print-meta'>${B.brandAddr}</div>` : "") +
      (B.brandEmail ? `<div class='print-meta'>${B.brandEmail}</div>` : "") +
      (B.brandGST
        ? `<div class='print-meta'><b>GST:</b> ${B.brandGST}</div>`
        : "");
    const right = document.createElement("div");
    right.className = "print-meta";
    right.innerHTML =
      `<div><b>Date:</b> ${B.quoteDateDMY || ""}</div>` +
      (B.clientName ? `<div><b>Client:</b> ${B.clientName}</div>` : "") +
      (B.clientMobile
        ? `<div><b>Client Mobile:</b> ${B.clientMobile}</div>`
        : "");
    head.appendChild(left);
    head.appendChild(right);
    wrap.appendChild(head);
    const title = document.createElement("div");
    title.className = "print-title";
    title.textContent = "QUOTATION";
    wrap.appendChild(title);
    const subt = document.createElement("div");
    subt.className = "print-meta";
    subt.innerHTML = `<b>Product Template:</b> ${rowLabel}`;
    wrap.appendChild(subt);
    const t1 = document.createElement("table");
    t1.innerHTML =
      "<thead><tr><th colspan='2'>Specifications</th></tr></thead>";
    const b1 = document.createElement("tbody");
    getPDFSpecCols().forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${config.INPUT_HEADERS[c] || c}</td><td>${fmtDec(
        IN[c],
        2
      )}</td>`;
      b1.appendChild(tr);
    });
    t1.appendChild(b1);
    wrap.appendChild(t1);
    const tot = document.createElement("div");
    tot.className = "total-box";
    tot.innerHTML = `<div class='total-line'><div>Final Quotation</div><div>${inr(
      OUT.AA,
      OUTPUT_DECIMALS["AA"] ?? 0
    )}</div></div>`;
    wrap.appendChild(tot);
  }

  function handlePDF() {
    buildPrintDoc();
    const btn = document.getElementById("btnPDF");
    btn.textContent = "Generating...";
    btn.disabled = true;
    const printArea = document.getElementById("printArea");
    printArea.style.display = "block";
    html2canvas(printArea, { scale: 1.5, useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const ratio = canvas.width / canvas.height;
        const imgWidth = pdfWidth - 20;
        const imgHeight = imgWidth / ratio;
        pdf.addImage(imgData, "JPEG", 10, 15, imgWidth, imgHeight);
        pdf.save("quotation.pdf");
        printArea.style.display = "none";
        btn.textContent = "Confirm & Download PDF";
        btn.disabled = false;
      })
      .catch((err) => {
        console.error("Error generating PDF:", err);
        printArea.style.display = "none";
        btn.textContent = "Confirm & Download PDF";
        btn.disabled = false;
      });
  }

  // --- Safe brand defaults + persistence ---
  (function () {
    const DEFAULTS = {
      brandName: "JRH ENGINEERING",
      brandPhone: "7046278859",
      brandEmail: "jrhengineering18@gmail.com",
      brandAddr:
        "PLOT NO 27, SHED NO. 17, VARTEJ, Vishwakarma Industries, GIDC Chitra, Bhavnagar, Gujarat, 364004",
      brandGST: "24AAOFJ2713M1Z6",
    };
    function ensureGSTField() {
      if (document.getElementById("brandGST")) return;
      const emailInput = document.getElementById("brandEmail");
      if (!emailInput) return;
      const emailDiv = emailInput.closest("div");
      const parent = emailDiv && emailDiv.parentElement;
      if (!parent) return;
      const gstDiv = document.createElement("div");
      gstDiv.style.flex = "1";
      gstDiv.style.minWidth = "200px";
      gstDiv.innerHTML =
        "<label class='small'>GST</label><input id='brandGST' type='text' />";
      emailDiv.parentNode.insertBefore(gstDiv, emailDiv.nextSibling);
    }
    function prefillBrand() {
      ensureGSTField();
      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el && !el.value) el.value = val;
      };
      Object.entries(DEFAULTS).forEach(([k, v]) => set(k, v));
    }
    function saveBrand() {
      const ids = [
        "brandName",
        "brandPhone",
        "brandEmail",
        "brandAddr",
        "brandGST",
      ];
      const data = {};
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) data[id] = el.value || "";
      });
      try {
        localStorage.setItem("brandDefaults", JSON.stringify(data));
      } catch (e) {}
    }
    function loadBrand() {
      try {
        const raw = localStorage.getItem("brandDefaults");
        if (!raw) return;
        const data = JSON.parse(raw);
        Object.keys(data).forEach((id) => {
          const el = document.getElementById(id);
          if (el && data[id]) el.value = data[id];
        });
      } catch (e) {}
    }
    prefillBrand();
    loadBrand();
    loadLogo();
    var bn = document.getElementById("brandName");
    if (bn && (!bn.value || bn.value === "Your Brand")) {
      bn.value = "JRH ENGINEERING";
    }
    saveBrand();
    ["brandName", "brandPhone", "brandEmail", "brandAddr", "brandGST"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", saveBrand);
      }
    );
  })();

  // --- Modal & Page Initialization ---
  const shareModal = document.getElementById("shareModal");
  const openModalBtn = document.getElementById("openShareModalBtn");
  const closeModalBtn = document.querySelector(".modal-close-btn");
  const printPdfBtn = document.getElementById("btnPDF");
  const logoUpload = document.getElementById("logoUpload");

  if (openModalBtn) {
    openModalBtn.addEventListener("click", () => {
      shareModal.style.display = "flex";
    });
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      shareModal.style.display = "none";
    });
  }
  if (printPdfBtn) {
    printPdfBtn.addEventListener("click", handlePDF);
  }
  if (logoUpload) {
    logoUpload.addEventListener("change", handleLogoUpload);
  }
  window.addEventListener("click", (event) => {
    if (event.target == shareModal) {
      shareModal.style.display = "none";
    }
  });

  populateDateDropdowns();
  initProductSelector();

  // --- Expose functions for firebase-auth.js ---
  window.getCalculatorState = () => {
    const finalAmountString =
      document.getElementById("finalAmt").textContent || "₹0";
    const finalAmount = Number(finalAmountString.replace(/[^0-9.-]+/g, ""));
    return {
      inputs: getIN(),
      productKey: currentProductKey,
      rowKey: currentRowKey,
      brandDetails: getBrand(),
      finalAmount: finalAmount,
    };
  };

  window.restoreCalculatorState = (state) => {
    if (!state || !state.productKey || !state.inputs) {
      console.error("Invalid state provided to restoreCalculatorState");
      return;
    }
    currentProductKey = state.productKey;
    const productPick = document.getElementById("productPick");
    productPick.value = currentProductKey;

    populateProductTemplateDropdown(state.rowKey);

    renderInputs();

    Object.keys(state.inputs).forEach((key) => {
      const el = document.getElementById("IN_" + key);
      if (el) {
        el.value = state.inputs[key];
      } else {
        console.warn(`Could not find input for key: ${key} during restore.`);
      }
    });
    if (state.brandDetails) {
      const mainClientName = document.getElementById("main-client-name");
      if (mainClientName) {
        mainClientName.value = state.brandDetails.clientName || "";
        mainClientName.dispatchEvent(new Event("input"));
      }
      const mainClientMobile = document.getElementById("main-client-mobile");
      if (mainClientMobile) {
        mainClientMobile.value = state.brandDetails.clientMobile || "";
        mainClientMobile.dispatchEvent(new Event("input"));
      }
    }
    recalc();
  };

  window.resetCalculator = () => {
    const mainClientName = document.getElementById("main-client-name");
    if (mainClientName) mainClientName.value = "";
    const mainClientMobile = document.getElementById("main-client-mobile");
    if (mainClientMobile) mainClientMobile.value = "";
    mainClientName.dispatchEvent(new Event("input"));
    mainClientMobile.dispatchEvent(new Event("input"));
    initProductSelector();
  };
});

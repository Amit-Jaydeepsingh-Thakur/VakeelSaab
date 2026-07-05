import React, { useState } from "react";
import { Calculator, Clock, HelpCircle, FileText } from "lucide-react";

export default function CalculatorDesk({ language = "en" }) {
  // Localization dictionary for the Calculator Desk
  const t = {
    en: {
      limitationTitle: "Limitation Act, 1963 Calculator",
      limitationDesc: "Calculate statutory filing deadlines to avoid time-barred dismissals.",
      causeOfActionLabel: "Date of Cause of Action",
      categoryLabel: "Select Suit Category",
      calculateBtn: "Calculate Deadline",
      calculatedDeadline: "Filing Deadline (End Date)",
      remainingTime: "Time Remaining",
      days: "Days",
      expired: "EXPIRED (Time Barred)",
      courtFeeTitle: "Stamp Duty & Court Fee Estimator",
      courtFeeDesc: "Ad-valorem court fee estimator based on state jurisdiction and claim value.",
      stateLabel: "Select State Jurisdiction",
      claimLabel: "Enter Claim Value (INR)",
      estimatedFee: "Estimated Court Fee (INR)",
      disclaimer: "Formula calculations are based on standard state court acts and are for advisory estimates."
    },
    hi: {
      limitationTitle: "परिसीमा अधिनियम, 1963 कैलकुलेटर",
      limitationDesc: "समय-सीमा समाप्त होने वाले खटलों से बचने के लिए कानूनी समय-सीमा की गणना करें।",
      causeOfActionLabel: "कार्यवाही के कारण की तिथि (Cause of Action)",
      categoryLabel: "मामला श्रेणी चुनें",
      calculateBtn: "समय-सीमा की गणना करें",
      calculatedDeadline: "दायर करने की अंतिम तिथि",
      remainingTime: "शेष समय",
      days: "दिन",
      expired: "अवधि समाप्त (Time Barred)",
      courtFeeTitle: "स्टाम्प शुल्क और अदालती शुल्क अनुमानक",
      courtFeeDesc: "राज्य क्षेत्राधिकार और दावा मूल्य के आधार पर अदालती शुल्क का अनुमान लगाएं।",
      stateLabel: "राज्य क्षेत्राधिकार चुनें",
      claimLabel: "दावा मूल्य दर्ज करें (INR)",
      estimatedFee: "अनुमानित अदालती शुल्क (INR)",
      disclaimer: "गणना मानक राज्य अदालती नियमों पर आधारित है और केवल सलाहकार अनुमान है।"
    },
    mr: {
      limitationTitle: "मर्यादा कायदा, १९६३ कॅल्क्युलेटर",
      limitationDesc: "वेळ-मर्यादा संपलेल्या खटल्यांना टाळण्यासाठी कायदेशीर अंतिम मुदतीची गणना करा.",
      causeOfActionLabel: "कृतीचे कारण उद्भवल्याची तारीख (Cause of Action)",
      categoryLabel: "खटला प्रवर्ग निवडा",
      calculateBtn: "अंतिम मुदत मोजा",
      calculatedDeadline: "दाखल करण्याची अंतिम मुदत",
      remainingTime: "उर्वरित वेळ",
      days: "दिवस",
      expired: "मुदत संपली (Time Barred)",
      courtFeeTitle: "स्टॅम्प ड्युटी आणि न्यायालयीन शुल्क अंदाजक",
      courtFeeDesc: "राज्य अधिकार क्षेत्र आणि दावा मूल्याच्या आधारे न्यायालयीन शुल्काचा अंदाज लावा.",
      stateLabel: "राज्य अधिकार क्षेत्र निवडा",
      claimLabel: "दावा मूल्य प्रविष्ट करा (INR)",
      estimatedFee: "अंदाजे न्यायालयीन शुल्क (INR)",
      disclaimer: "गणना प्रमाणित राज्य न्यायालयीन कायद्यावर आधारित असून केवळ अंदाजे मूल्य आहे."
    }
  }[language];

  // State variables for Limitation Calculator
  const [causeDate, setCauseDate] = useState("");
  const [suitCategory, setSuitCategory] = useState("money_recovery");
  const [limitationResult, setLimitationResult] = useState(null);

  // State variables for Court Fee Estimator
  const [stateJur, setStateJur] = useState("maharashtra");
  const [claimVal, setClaimVal] = useState("");
  const [courtFeeResult, setCourtFeeResult] = useState(null);

  // Categories under Limitation Act, 1963
  const limitationCategories = {
    money_recovery: { title: { en: "Money Recovery (Suit for Debt)", hi: "धन वसूली सूट", mr: "पैसे वसुली खटला" }[language], durationYears: 3 },
    cheque_bounce: { title: { en: "Cheque Bounce Complaint (Sec 138 NI Act)", hi: "चेक बाउंस शिकायत (धारा 138)", mr: "चेक बाऊन्स तक्रार (कलम १३८)" }[language], durationDays: 30 },
    contract_breach: { title: { en: "Breach of Contract (Damages)", hi: "अनुबंध उल्लंघन (हर्जाना)", mr: "करार उल्लंघन (नुकसानभरपाई)" }[language], durationYears: 3 },
    specific_performance: { title: { en: "Specific Performance of Contract", hi: "अनुबंध का विशिष्ट पालन", mr: "कराराची विशिष्ट पूर्तता" }[language], durationYears: 3 },
    possession_immovable: { title: { en: "Recovery of Immovable Property (Title Dispute)", hi: "अचल संपत्ति की वसूली", mr: "स्थावर मालमत्ता ताबा मिळवणे" }[language], durationYears: 12 },
    consumer_complaint: { title: { en: "Consumer Complaint (District Commission)", hi: "उपभोक्ता शिकायत (जिला आयोग)", mr: "ग्राहक तक्रार (जिल्हा मंच)" }[language], durationYears: 2 }
  };

  const handleCalculateLimitation = (e) => {
    e.preventDefault();
    if (!causeDate) return;

    const baseDate = new Date(causeDate);
    if (isNaN(baseDate.getTime())) {
      alert("Please enter a valid date.");
      return;
    }

    const category = limitationCategories[suitCategory];
    const deadlineDate = new Date(baseDate);

    if (category.durationYears) {
      deadlineDate.setFullYear(deadlineDate.getFullYear() + category.durationYears);
    } else if (category.durationDays) {
      deadlineDate.setDate(deadlineDate.getDate() + category.durationDays);
    }

    const today = new Date();
    const differenceMs = deadlineDate - today;
    const remainingDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    setLimitationResult({
      deadline: deadlineDate.toLocaleDateString(language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "mr-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }),
      daysLeft: remainingDays
    });
  };

  const handleCalculateCourtFee = (e) => {
    e.preventDefault();
    const claim = parseFloat(claimVal);
    if (isNaN(claim) || claim <= 0) return;

    let fee = 0;
    // Standard court fee structures in India (simplifications for demonstrative / commercial estimation)
    if (stateJur === "maharashtra") {
      // Under Maharashtra Court Fees Act: Slab-based ad-valorem structure
      if (claim <= 2000) fee = 200;
      else if (claim <= 50000) fee = 200 + (claim - 2000) * 0.05; // 5% ad-valorem
      else if (claim <= 100000) fee = 2600 + (claim - 50000) * 0.04;
      else if (claim <= 1000000) fee = 4600 + (claim - 100000) * 0.03;
      else fee = Math.min(31600 + (claim - 1000000) * 0.02, 300000); // capped at 3 Lakhs in Maharashtra
    } else {
      // Delhi / standard state fees
      if (claim <= 10000) fee = 250;
      else if (claim <= 50000) fee = 250 + (claim - 10000) * 0.04;
      else fee = 1850 + (claim - 50000) * 0.025; // 2.5% flat on remaining
    }

    setCourtFeeResult(Math.round(fee));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "28px", maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
      
      {/* 1. Limitation Period Desk */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "28px", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
          <Clock size={22} style={{ color: "var(--color-gold)" }} />
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "var(--color-navy)" }}>{t.limitationTitle}</h2>
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{t.limitationDesc}</p>
          </div>
        </div>

        <form onSubmit={handleCalculateLimitation} style={{ display: "flex", gap: "16px", flexWrap: "wrap", borderBottom: limitationResult ? "1px dashed var(--color-gray-border)" : "none", paddingBottom: limitationResult ? "20px" : "0" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--color-text-dark)", marginBottom: "6px" }}>{t.categoryLabel}</label>
            <select 
              className="acts-search-input" 
              style={{ backgroundColor: "var(--color-cream-dark)", height: "38px" }}
              value={suitCategory}
              onChange={(e) => setSuitCategory(e.target.value)}
            >
              {Object.entries(limitationCategories).map(([key, val]) => (
                <option key={key} value={key}>{val.title}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--color-text-dark)", marginBottom: "6px" }}>{t.causeOfActionLabel}</label>
            <input 
              type="date" 
              className="acts-search-input" 
              style={{ backgroundColor: "var(--color-white)", height: "38px" }}
              value={causeDate}
              onChange={(e) => setCauseDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end", height: "38px" }}>
            <Calculator size={15} /> {t.calculateBtn}
          </button>
        </form>

        {limitationResult && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "20px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase" }}>{t.calculatedDeadline}</span>
              <strong style={{ fontSize: "20px", fontFamily: "var(--font-serif)", color: "var(--color-navy)" }}>{limitationResult.deadline}</strong>
            </div>

            <div style={{ padding: "12px 24px", borderRadius: "var(--radius-md)", backgroundColor: limitationResult.daysLeft > 0 ? "var(--color-success-light)" : "var(--color-danger-light)" }}>
              <span style={{ display: "block", fontSize: "11px", fontWeight: "600", color: limitationResult.daysLeft > 0 ? "var(--color-success)" : "var(--color-danger)" }}>{t.remainingTime}</span>
              <strong style={{ fontSize: "18px", color: limitationResult.daysLeft > 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                {limitationResult.daysLeft > 0 ? `${limitationResult.daysLeft} ${t.days}` : t.expired}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* 2. Court Fees and Stamp Duty Estimator */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "28px", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
          <FileText size={22} style={{ color: "var(--color-gold)" }} />
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "var(--color-navy)" }}>{t.courtFeeTitle}</h2>
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{t.courtFeeDesc}</p>
          </div>
        </div>

        <form onSubmit={handleCalculateCourtFee} style={{ display: "flex", gap: "16px", flexWrap: "wrap", borderBottom: courtFeeResult !== null ? "1px dashed var(--color-gray-border)" : "none", paddingBottom: courtFeeResult !== null ? "20px" : "0" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--color-text-dark)", marginBottom: "6px" }}>{t.stateLabel}</label>
            <select 
              className="acts-search-input" 
              style={{ backgroundColor: "var(--color-cream-dark)", height: "38px" }}
              value={stateJur}
              onChange={(e) => setStateJur(e.target.value)}
            >
              <option value="maharashtra">Maharashtra (Bombay HC jurisdiction)</option>
              <option value="delhi">Delhi (Ad-Valorem Union Territory Act)</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--color-text-dark)", marginBottom: "6px" }}>{t.claimLabel}</label>
            <input 
              type="number" 
              className="acts-search-input" 
              style={{ backgroundColor: "var(--color-white)", height: "38px" }}
              placeholder="e.g. 500000"
              value={claimVal}
              onChange={(e) => setClaimVal(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end", height: "38px" }}>
            <Calculator size={15} /> Calculate Fee
          </button>
        </form>

        {courtFeeResult !== null && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "20px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase" }}>{t.estimatedFee}</span>
              <strong style={{ fontSize: "24px", fontFamily: "var(--font-serif)", color: "var(--color-gold-hover)" }}>
                ₹ {courtFeeResult.toLocaleString("en-IN")}
              </strong>
            </div>

            <div style={{ flex: 2, fontSize: "11px", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              <HelpCircle size={14} /> {t.disclaimer}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

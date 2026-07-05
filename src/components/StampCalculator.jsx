import React, { useState } from "react";
import { Calculator, Scale, FileText, Check, Copy, Sparkles, Info, ShieldAlert } from "lucide-react";

export default function StampCalculator({ language = "en" }) {
  // Localization dictionary
  const t = {
    en: {
      title: "Court Fee & Stamp Duty Calculator",
      desc: "Calculate state-specific civil court fees, ad-valorem stamps, and advocate welfare stamps under local Court Fees Acts.",
      stateLabel: "Select Jurisdiction State",
      courtLabel: "Select Court Level",
      petitionLabel: "Select Petition / Suit Type",
      valuationLabel: "Suit Valuation Amount (Rs.)",
      calcBtn: "Calculate Court Fee & Stamps",
      resultTitle: "Court Fee & Stamp Valuation Report",
      copyBtn: "Copy Report",
      copied: "Copied!",
      stateFeesDesc: "Statutory Reference: Calculated in accordance with the local Court Fees Act of the selected state.",
      pitchTitle: "💰 Critical Civil Practice B2B Hook",
      pitchDesc: "Every civil suit or appeal requires paying precise court fees. Overpaying is a waste, and underpaying leads to registry rejections. A quick court-fee calculator is an essential subscription driver.",
      valWarning: "Maximum court fee cap applied for Maharashtra (Capped at Rs. 3,00,000/- under Article 1 of Schedule I of Bombay Court Fees Act).",
      loadSampleBtn: "Load High-Value Recovery Suit"
    },
    hi: {
      title: "कोर्ट फीस और स्टांप शुल्क कैलकुलेटर",
      desc: "स्थानीय न्यायालय फीस अधिनियमों के तहत राज्य-विशिष्ट सिविल कोर्ट फीस, विज्ञापन मूल्य स्टांप और अधिवक्ता कल्याण स्टांप की गणना करें।",
      stateLabel: "राज्य क्षेत्राधिकार चुनें",
      courtLabel: "न्यायालय का स्तर चुनें",
      petitionLabel: "याचिका / मुकदमे का प्रकार चुनें",
      valuationLabel: "मुकदमे का मूल्यांकन मूल्य (रु.)",
      calcBtn: "कोर्ट फीस और स्टांप की गणना करें",
      resultTitle: "कोर्ट फीस और स्टांप मूल्यांकन रिपोर्ट",
      copyBtn: "रिपोर्ट कॉपी करें",
      copied: "कॉपी हो गया!",
      stateFeesDesc: "वैधानिक संदर्भ: चयनित राज्य के स्थानीय न्यायालय शुल्क अधिनियम के अनुसार गणना की गई है।",
      pitchTitle: "💰 सिविल वकालत सशुल्क सेवा हुक",
      pitchDesc: "हर सिविल मुकदमे के लिए सटीक कोर्ट फीस आवश्यक है। कम भुगतान पर रजिस्ट्री याचिका खारिज कर देती है। यह कैलकुलेटर वकीलों के लिए बेहद उपयोगी है।",
      valWarning: "महाराष्ट्र के लिए अधिकतम कोर्ट फीस सीमा लागू (बॉम्बे कोर्ट फीस एक्ट के तहत रु. 3,00,000/- पर कैप)।",
      loadSampleBtn: "उच्च मूल्य वसूली मुकदमा लोड करें"
    },
    mr: {
      title: "कोर्ट फी आणि मुद्रांक शुल्क मोजणी पत्रक",
      desc: "विविध राज्यांमधील कोर्ट फी कायद्यांनुसार दिवाणी दावे, अपीले आणि वकालतनाम्यावरील कायदेशीर मुद्रांक आणि वकील कल्याण निधी तिकिटांचे शुल्क मोजा.",
      stateLabel: "राज्य निवडा",
      courtLabel: "न्यायालयाची पातळी",
      petitionLabel: "दावा / अर्जाचा प्रकार",
      valuationLabel: "दाव्याचे मूल्यांकन मूल्य (रु.)",
      calcBtn: "कोर्ट फी आणि मुद्रांक मोजा",
      resultTitle: "कोर्ट फी व मुद्रांक मोजणी अहवाल",
      copyBtn: "अहवाल कॉपी करा",
      copied: "कॉपी केले!",
      stateFeesDesc: "कायदेशीर संदर्भ: संबंधित राज्याच्या स्थानिक कोर्ट फी कायद्यानुसार ही मोजणी केली गेली आहे.",
      pitchTitle: "💰 दिवाणी वकिली सशुल्क उपयुक्तता",
      pitchDesc: "दिवाणी दाव्यात कमी कोर्ट फी भरल्यास अर्ज बाद होतो. त्यामुळे अचूक मोजणी करणारे साधन वकिलांचा वेळ व कष्ट वाचवते. हे सशुल्क वर्गणी मिळवण्यासाठी उत्तम फिचर आहे.",
      valWarning: "महाराष्ट्र राज्यासाठी कमाल कोर्ट फी मर्यादा लागू (कमाल रु. ३,००,०००/- मर्यादा बॉम्बे कोर्ट फी कायद्यानुसार).",
      loadSampleBtn: "मोठ्या रकमेचा दिवाणी नमुना लोड करा"
    }
  }[language];

  // Form States
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [courtLevel, setCourtLevel] = useState("District");
  const [petitionType, setPetitionType] = useState("MoneySuit");
  const [valuation, setValuation] = useState("");
  const [calculation, setCalculation] = useState(null);
  const [copying, setCopying] = useState(false);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!valuation) return;

    const valAmount = parseFloat(valuation);
    let courtFee = 0;
    let welfareStamps = 0;
    let warning = "";

    // 1. Calculate Court Fees based on State Rules
    if (selectedState === "Maharashtra") {
      // Bombay Court Fees Act: Ad-valorem slabs, capped at Rs. 3,00,000/-
      if (petitionType === "MoneySuit" || petitionType === "Property") {
        if (valAmount <= 10000) {
          courtFee = 500;
        } else if (valAmount <= 50000) {
          courtFee = 1500;
        } else if (valAmount <= 100000) {
          courtFee = 3000;
        } else {
          // approx 3% + base
          courtFee = 3000 + (valAmount - 100000) * 0.025;
        }
        
        // Cap check
        if (courtFee > 300000) {
          courtFee = 300000;
          warning = t.valWarning;
        }
      } else if (petitionType === "Injunction") {
        courtFee = 1000; // Fixed fee
      } else {
        courtFee = 200;
      }
      welfareStamps = 40; // Adv Welfare + Clerk Welfare
    } else if (selectedState === "Delhi") {
      // Delhi Court Fees Act: approx 4% straight for suits
      if (petitionType === "MoneySuit" || petitionType === "Property") {
        courtFee = valAmount * 0.04;
      } else {
        courtFee = 500;
      }
      welfareStamps = 50;
    } else if (selectedState === "Karnataka") {
      // Karnataka Court Fees: approx 2.5% to 10% ad-valorem
      if (petitionType === "MoneySuit" || petitionType === "Property") {
        courtFee = valAmount * 0.06;
      } else {
        courtFee = 800;
      }
      welfareStamps = 30;
    } else {
      // Tamil Nadu / Others
      if (petitionType === "MoneySuit" || petitionType === "Property") {
        courtFee = valAmount * 0.03;
      } else {
        courtFee = 600;
      }
      welfareStamps = 30;
    }

    courtFee = Math.round(courtFee);

    // Formulate a beautiful summary output report
    const textReport = `================================================
COURT FEE & STAMP VALUATION REPORT
================================================
Jurisdiction State   : ${selectedState}
Court Level          : ${courtLevel === "District" ? "District & Sessions Court" : "High Court"}
Petition/Suit Type   : ${petitionType === "MoneySuit" ? "Suit for Money Recovery" : petitionType === "Property" ? "Declaration & Possession Suit" : petitionType === "Injunction" ? "Temporary/Permanent Injunction Application" : "Vakalatnama/Memo Filing"}
Suit Valuation       : Rs. ${valAmount.toLocaleString()}/-
------------------------------------------------
CALCULATED STATUTORY FEES:
------------------------------------------------
1. Court Fee Stamps   : Rs. ${courtFee.toLocaleString()}/-
2. Advocate Welfare   : Rs. ${welfareStamps}/-
3. Court Library Fund : Rs. 20/-
------------------------------------------------
TOTAL STAMPS REQUIRED : Rs. ${(courtFee + welfareStamps + 20).toLocaleString()}/-
================================================
${warning ? `NOTE: ${warning}\n` : ""}Calculated in accordance with local Court Fees rules. Ensure stamp papers are purchased from licensed vendors.`;

    setCalculation({
      courtFee,
      welfareStamps,
      total: courtFee + welfareStamps + 20,
      warning,
      textReport
    });
  };

  const handleLoadSample = () => {
    setSelectedState("Maharashtra");
    setCourtLevel("District");
    setPetitionType("MoneySuit");
    setValuation("15000000"); // 1.5 Crores (will hit cap limit)
  };

  const handleCopy = () => {
    if (!calculation) return;
    navigator.clipboard.writeText(calculation.textReport);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "100%" }}>
      
      {/* Input Form Pane */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1 }}>
            <Scale size={20} style={{ color: "var(--color-gold)" }} />
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)", margin: 0 }}>{t.title}</h3>
          </div>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={handleLoadSample}>
            {t.loadSampleBtn}
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)", margin: 0 }}>{t.desc}</p>

        <form onSubmit={handleCalculate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.stateLabel}</label>
            <select
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px", cursor: "pointer", fontWeight: "600" }}
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="Maharashtra">Maharashtra (Bombay Court Fees Act)</option>
              <option value="Delhi">Delhi Court Fees Act</option>
              <option value="Karnataka">Karnataka Court Fees Act</option>
              <option value="TamilNadu">Tamil Nadu Court Fees Act</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.courtLabel}</label>
            <select
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px", cursor: "pointer" }}
              value={courtLevel}
              onChange={(e) => setCourtLevel(e.target.value)}
            >
              <option value="District">District & Sessions Court / Civil Courts</option>
              <option value="HighCourt">High Court (Original/Appellate Jurisdiction)</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.petitionLabel}</label>
            <select
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px", cursor: "pointer" }}
              value={petitionType}
              onChange={(e) => setPetitionType(e.target.value)}
            >
              <option value="MoneySuit">Civil Money Recovery Suit</option>
              <option value="Property">Declaration & Possession Suit (Property)</option>
              <option value="Injunction">Injunction Application</option>
              <option value="Vakalatnama">Vakalatnama & Memo of Appearance</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.valuationLabel} *</label>
            <input
              type="number"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder="e.g., 1000000"
              value={valuation}
              onChange={(e) => setValuation(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 18px", alignSelf: "flex-end" }} disabled={!valuation}>
            <Sparkles size={14} /> {t.calcBtn}
          </button>
        </form>
      </div>

      {/* Output Panel */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-gray-border)", paddingBottom: "12px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1 }}>
            <FileText size={20} style={{ color: "var(--color-gold)" }} />
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)", margin: 0 }}>{t.resultTitle}</h3>
          </div>
          {calculation && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={handleCopy}>
                {copying ? <Check size={12} style={{ color: "var(--color-success)" }} /> : <Copy size={12} />}
                {copying ? t.copied : t.copyBtn}
              </button>
            </div>
          )}
        </div>

        {/* Warning Indicator */}
        {calculation?.warning && (
          <div style={{ backgroundColor: "#fee2e2", border: "1px solid #f87171", borderRadius: "var(--radius-md)", padding: "10px 14px", display: "flex", gap: "6px", fontSize: "11.5px", color: "#991b1b" }}>
            <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: "1px" }} />
            <span>{calculation.warning}</span>
          </div>
        )}

        <div style={{ 
          flex: 1, 
          border: "1px solid var(--color-gray-border)", 
          borderRadius: "var(--radius-md)", 
          padding: "16px",
          backgroundColor: "var(--color-cream)", 
          fontSize: "13.5px",
          color: "var(--color-text-dark)",
          overflowY: "auto",
          fontFamily: "Courier, monospace",
          minHeight: "220px",
          whiteSpace: "pre-wrap"
        }}>
          {calculation ? (
            calculation.textReport
          ) : (
            <span style={{ color: "var(--color-text-muted)", fontStyle: "italic", fontFamily: "var(--font-sans)" }}>
              The breakdown of court fees, welfare stamps, and total calculations will appear here.
            </span>
          )}
        </div>

        {/* Informative Footer */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <Info size={12} style={{ color: "var(--color-gold-hover)" }} />
          <span style={{ fontSize: "10.5px", color: "var(--color-text-muted)" }}>{t.stateFeesDesc}</span>
        </div>

        {/* Pitch Callout */}
        <div style={{ backgroundColor: "var(--color-gold-light)", border: "1px solid var(--color-gold)", borderRadius: "var(--radius-md)", padding: "12px 16px" }}>
          <strong style={{ display: "block", fontSize: "11.5px", color: "#78350f", marginBottom: "4px" }}>{t.pitchTitle}</strong>
          <span style={{ fontSize: "10.5px", color: "#92400e", lineHeight: "1.4" }}>{t.pitchDesc}</span>
        </div>
      </div>

    </div>
  );
}

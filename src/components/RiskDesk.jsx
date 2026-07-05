import React, { useState } from "react";
import { AlertTriangle, FileText, Check, Copy, FileDown, Sparkles } from "lucide-react";
import { geminiService } from "../services/geminiService";
import { renderMarkdown } from "../utils/markdown";

export default function RiskDesk({ language = "en" }) {
  // Localization dictionary
  const t = {
    en: {
      title: "Contract Risk & Red-Flag Audit Desk",
      desc: "Audit any legal agreement or contract (pasted below) for predatory clauses, lock-in risks, hidden penalty fees, and get simplified explanations.",
      label: "Paste Contract / Clause Text",
      placeholder: "e.g., Paste your rent agreement, employment contract, or loan terms here...",
      auditBtn: "Audit Contract",
      auditing: "Auditing document clauses...",
      resultTitle: "Contract Risk Analysis & Negotiating Options",
      copyBtn: "Copy Report",
      copied: "Copied!",
      downloadBtn: "Download Report",
      pitchTitle: "💰 Layperson Contract Explainer Monetization Hook",
      pitchDesc: "Over 80% of self-represented litigants sign contracts without legal counsel. Charging a nominal fee (₹199 per audit) to review rental, loan, or employment contracts is a massive monetization hook.",
      loadSampleBtn: "Load Sample Predatory Agreement"
    },
    hi: {
      title: "अनुबंध जोखिम और आपत्तिजनक क्लॉज ऑडिट डेस्क",
      desc: "किसी भी कानूनी समझौते या अनुबंध (नीचे पेस्ट करें) में आपत्तिजनक क्लॉज, लॉक-इन जोखिम, और छिपे हुए जुर्माने के शुल्क की जांच करें।",
      label: "अनुबंध या क्लॉज का पाठ पेस्ट करें",
      placeholder: "उदा. अपना किराया समझौता, रोजगार अनुबंध, या ऋण की शर्तें यहाँ पेस्ट करें...",
      auditBtn: "अनुबंध का ऑडिट करें",
      auditing: "दस्तावेज़ की जांच जारी...",
      resultTitle: "अनुबंध जोखिम विश्लेषण और वार्ता विकल्प",
      copyBtn: "रिपोर्ट कॉपी करें",
      copied: "कॉपी हो गया!",
      downloadBtn: "रिपोर्ट डाउनलोड करें",
      pitchTitle: "💰 आम नागरिक अनुबंध समीक्षक मुद्रीकरण हुक",
      pitchDesc: "80% से अधिक लोग बिना वकील के अनुबंधों पर हस्ताक्षर करते हैं। किराया या रोजगार अनुबंधों की समीक्षा के लिए मामूली शुल्क (₹199/ऑडिट) चार्ज करना एक बड़ा राजस्व मॉडल है।",
      loadSampleBtn: "कच्चा आपत्तिजनक अनुबंध लोड करें"
    },
    mr: {
      title: "करार जोखीम आणि गुप्त अटी ऑडिट डेस्क",
      desc: "कोणत्याही करारातील (खाली पेस्ट करा) अन्यायकारक अटी, लॉक-इन जोखीम, आणि छुपे दंड किंवा व्याज तपासण्यासाठी मसुदा ऑडिट करा.",
      label: "करार किंवा अटींचे संकलन पेस्ट करा",
      placeholder: "उदा. तुमचा भाडे करार, रोजगार करार किंवा कर्ज कराराच्या अटी येथे पेस्ट करा...",
      auditBtn: "कराराचे ऑडिट करा",
      auditing: "करार ऑडिट सुरू आहे...",
      resultTitle: "करार जोखीम विश्लेषण आणि पर्यायी मसुदे",
      copyBtn: "रिपोर्ट कॉपी करा",
      copied: "कॉपी केले!",
      downloadBtn: "रिपोर्ट डाउनलोड करा",
      pitchTitle: "💰 सामान्य नागरिक करार समीक्षक महसूल संधी",
      pitchDesc: "८०% हून अधिक लोक वकिलाकडून तपासणी न करताच करारांवर स्वाक्षऱ्या करतात. घरमालक, नोकरी किंवा कर्ज करारांच्या पडताळणीसाठी किरकोळ शुल्क (उदा. ₹१९९) आकारून चांगला महसूल मिळवता येईल.",
      loadSampleBtn: "अन्यायकारक करार नमुना लोड करा"
    }
  }[language];

  const samplePredatoryContract = `LEAVE AND LICENSE AGREEMENT (EXCERPT)
  
Clause 4. LOCK-IN PERIOD:
The Licensee shall remain in the premises for a minimum lock-in period of 36 months. If the Licensee vacates the premises before the completion of the lock-in period, the Licensee shall forfeit the entire security deposit of Rs. 1,00,000/- and shall also be liable to pay the balance rent for the remaining period of the lock-in immediately.

Clause 9. INTEREST AND PENALTY FOR LATE PAYMENT:
In the event of delay in payment of license fee beyond the 5th of any month, the Licensee shall pay a penal interest at the rate of 24% per annum compounded monthly on the outstanding dues.

Clause 14. DISPUTE RESOLUTION:
Any dispute arising out of this agreement shall be referred to arbitration to be held solely in Chennai, in accordance with Chennai Jurisdiction, and the costs of arbitration shall be borne entirely by the Licensee, regardless of the outcome.`;

  const [contractText, setContractText] = useState("");
  const [auditOutput, setAuditOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!contractText.trim() || loading) return;

    setLoading(true);
    setAuditOutput("");
    try {
      const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
      const apiLanguage = langNameMap[language] || "English";
      
      const analysis = await geminiService.auditContractRisk(contractText, apiLanguage);
      setAuditOutput(analysis);
    } catch (err) {
      alert(`Audit failed: ${err.message}`);
      setAuditOutput("Failed to review contract. Please verify API configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(auditOutput);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([auditOutput], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "contract_risk_audit.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLoadSample = () => {
    setContractText(samplePredatoryContract);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "100%" }}>
      
      {/* Input panel */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifySpace: "between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1 }}>
            <AlertTriangle size={20} style={{ color: "var(--color-gold)" }} />
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)" }}>{t.title}</h3>
          </div>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={handleLoadSample}>
            {t.loadSampleBtn}
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{t.desc}</p>

        <form onSubmit={handleAudit} style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          <label style={{ fontSize: "12px", fontWeight: "600" }}>{t.label}</label>
          <textarea
            className="editor-textarea"
            style={{ 
              flex: 1, 
              border: "1px solid var(--color-gray-border)", 
              borderRadius: "var(--radius-md)", 
              backgroundColor: "var(--color-cream-dark)",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              padding: "16px",
              minHeight: "220px"
            }}
            placeholder={t.placeholder}
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 18px", alignSelf: "flex-end" }} disabled={loading || !contractText.trim()}>
            <Sparkles size={14} /> {loading ? t.auditing : t.auditBtn}
          </button>
        </form>
      </div>

      {/* Output Panel */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-gray-border)", paddingBottom: "12px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1 }}>
            <FileText size={20} style={{ color: "var(--color-gold)" }} />
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)" }}>{t.resultTitle}</h3>
          </div>
          {auditOutput && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={handleCopy}>
                {copying ? <Check size={12} style={{ color: "var(--color-success)" }} /> : <Copy size={12} />}
                {copying ? t.copied : t.copyBtn}
              </button>
              <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={handleDownload}>
                <FileDown size={12} /> {t.downloadBtn}
              </button>
            </div>
          )}
        </div>

        <div style={{ 
          flex: 1, 
          border: "1px solid var(--color-gray-border)", 
          borderRadius: "var(--radius-md)", 
          padding: "16px",
          backgroundColor: "var(--color-cream)", 
          fontSize: "13.5px",
          color: "var(--color-text-dark)",
          overflowY: "auto",
          minHeight: "220px",
          whiteSpace: "normal"
        }}>
          {auditOutput ? (
            renderMarkdown(auditOutput)
          ) : (
            <span style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
              The detailed contract risk audit and negotiated clause drafts will appear here.
            </span>
          )}
        </div>

        {/* Business Pitch Callout */}
        <div style={{ backgroundColor: "var(--color-gold-light)", border: "1px solid var(--color-gold)", borderRadius: "var(--radius-md)", padding: "12px 16px" }}>
          <strong style={{ display: "block", fontSize: "11.5px", color: "#78350f", marginBottom: "4px" }}>{t.pitchTitle}</strong>
          <span style={{ fontSize: "10.5px", color: "#92400e", lineHeight: "1.4" }}>{t.pitchDesc}</span>
        </div>
      </div>

    </div>
  );
}

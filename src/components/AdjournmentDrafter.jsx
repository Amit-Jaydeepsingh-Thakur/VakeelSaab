import React, { useState } from "react";
import { Scale, FileText, Check, Copy, FileDown, Sparkles } from "lucide-react";
import { geminiService } from "../services/geminiService";
import { renderMarkdown } from "../utils/markdown";

export default function AdjournmentDrafter({ language = "en" }) {
  // Localization dictionary
  const t = {
    en: {
      title: "Adjournment & Passover Application Generator",
      desc: "Draft standard, formal adjournment slips or passover applications for trial and appellate courts in India.",
      courtLabel: "Court Name",
      courtPlaceholder: "e.g., Court of Civil Judge Junior Division, Pune",
      caseLabel: "Case Number & Title",
      casePlaceholder: "e.g., Regular Civil Suit No. 452/2024 (Ramesh vs Amit)",
      judgeLabel: "Judge's Name (Optional)",
      judgePlaceholder: "e.g., Shri. R. K. Patil",
      counselLabel: "Advocate Name",
      counselPlaceholder: "e.g., Adv. Sunil Deshmukh",
      nextDateLabel: "Proposed Next Date (Optional)",
      nextDatePlaceholder: "e.g., 20th Feb 2026",
      reasonLabel: "Reason for Adjournment",
      draftBtn: "Draft Adjournment Application",
      drafting: "Drafting formal slip...",
      resultTitle: "Draft Adjournment Application / Slip",
      copyBtn: "Copy Text",
      copied: "Copied!",
      downloadBtn: "Download (.txt)",
      pitchTitle: "💰 Courtroom Utility Subscription Hook",
      pitchDesc: "Passover and Adjournment slips are drafted daily in thousands of Indian courtrooms. Small trial court practitioners will pay for a quick mobile tool that generates them in seconds.",
      reasons: [
        "Counsel is currently arguing a matter in Court Room No. 4 (High Court)",
        "Advocate appearing is medically indisposed and unable to attend",
        "Material witness is unavailable due to medical emergency",
        "Certified copies of documents are pending retrieval from the registry",
        "Amicable settlement negotiations are ongoing between the parties",
        "Custom reason (describe below)"
      ]
    },
    hi: {
      title: "स्थगन और पासओवर आवेदन मसूदा",
      desc: "भारत में निचली अदालतों और अपीलीय अदालतों के लिए मानक, औपचारिक स्थगन पर्ची या पासओवर आवेदन तैयार करें।",
      courtLabel: "न्यायालय का नाम",
      courtPlaceholder: "उदा. सिविल जज जूनियर डिवीजन कोर्ट, पुणे",
      caseLabel: "मामला संख्या और शीर्षक",
      casePlaceholder: "उदा. नियमित सिविल सूट संख्या 452/2024 (रमेश बनाम अमित)",
      judgeLabel: "न्यायाधीश का नाम (वैकल्पिक)",
      judgePlaceholder: "उदा. श्री आर. के. पाटिल",
      counselLabel: "अधिवक्ता का नाम",
      counselPlaceholder: "उदा. एडवोकेट सुनील देशमुख",
      nextDateLabel: "प्रस्तावित अगली तारीख (वैकल्पिक)",
      nextDatePlaceholder: "उदा. 20 फरवरी 2026",
      reasonLabel: "स्थगन का कारण",
      draftBtn: "स्थगन आवेदन मसूदा बनाएं",
      drafting: "पर्ची मसूदा जारी...",
      resultTitle: "स्थगन आवेदन मसूदा / पर्ची",
      copyBtn: "कॉपी करें",
      copied: "कॉपी हो गया!",
      downloadBtn: "डाउनलोड (.txt)",
      pitchTitle: "💰 कोर्ट उपयोगिता सदस्यता मुद्रीकरण हुक",
      pitchDesc: "भारतीय न्यायालयों में दैनिक रूप से हजारों स्थगन पर्ची तैयार की जाती हैं। वकील इस त्वरित मोबाइल उपकरण के लिए भुगतान करने को तैयार रहते हैं।",
      reasons: [
        "अधिवक्ता वर्तमान में कोर्ट रूम नंबर 4 (उच्च न्यायालय) में बहस कर रहे हैं",
        "उपस्थित अधिवक्ता अस्वस्थ हैं और उपस्थित होने में असमर्थ हैं",
        "मुख्य गवाह चिकित्सा आपातकाल के कारण अनुपलब्ध है",
        "रजिस्ट्री से दस्तावेजों की प्रमाणित प्रतियां प्राप्त होना लंबित है",
        "पक्षकारों के बीच सौहार्दपूर्ण समझौते की बातचीत चल रही है",
        "कस्टम कारण (नीचे लिखें)"
      ]
    },
    mr: {
      title: "सुनावणी तहकुबी आणि पासओव्हर अर्ज मसुदा",
      desc: "भारतातील दिवाणी आणि फौजदारी न्यायालयांसाठी अधिकृत सुनावणी तहकुबी अर्ज किंवा पासओव्हर चिठ्ठीचा मसुदा तयार करा.",
      courtLabel: "न्यायालयाचे नाव",
      courtPlaceholder: "उदा. दिवाणी न्यायाधीश कनिष्ठ स्तर न्यायालय, पुणे",
      caseLabel: "खटला क्रमांक आणि नाव",
      casePlaceholder: "उदा. दिवाणी खटला क्र. ४५२/२०२४ (रमेश विरुद्ध अमित)",
      judgeLabel: "न्यायाधीशांचे नाव (पर्यायी)",
      judgePlaceholder: "उदा. श्री. आर. के. पाटील",
      counselLabel: "वकिलाचे नाव",
      counselPlaceholder: "उदा. अॅड. सुनील देशमुख",
      nextDateLabel: "प्रस्तावित पुढील तारीख (पर्यायी)",
      nextDatePlaceholder: "उदा. २० फेब्रुवारी २०२६",
      reasonLabel: "तहकुबीचे कारण",
      draftBtn: "तहकुबी अर्ज मसुदा तयार करा",
      drafting: "तहकुबी मसुदा तयार होत आहे...",
      resultTitle: "सुनावणी तहकुबी मसुदा / चिठ्ठी",
      copyBtn: "कॉपी करा",
      copied: "कॉपी केले!",
      downloadBtn: "डाउनलोड (.txt)",
      pitchTitle: "💰 न्यायालयीन उपयुक्तता सदस्यता संधी",
      pitchDesc: "भारतातील हजारो कोर्टांमध्ये रोज तहकुबी अर्ज दाखल केले जातात. जिल्हा आणि सत्र न्यायालयातील वकिलांसाठी हे मोबाईलवर चालणारे साधन मोलाचे ठरेल.",
      reasons: [
        "वकील सध्या कोर्ट रूम नंबर ४ (उच्च न्यायालय) मध्ये युक्तिवाद करत आहेत",
        "युक्तिवाद करणारे वकील आजारी असल्याने उपस्थित राहू शकत नाहीत",
        "महत्त्वाचा साक्षीदार वैद्यकीय कारणामुळे अनुपलब्ध आहे",
        "मालमत्तेची प्रमाणित कागदपत्रे निबंधक कार्यालयाकडून मिळणे प्रलंबित आहे",
        "पक्षकारांमध्ये आपसातील तडजोडीची बोलणी सुरू आहे",
        "इतर सानुकूल कारण (खाली स्पष्ट करा)"
      ]
    }
  }[language];

  const [court, setCourt] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [judgeName, setJudgeName] = useState("");
  const [counselName, setCounselName] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [reasonIndex, setReasonIndex] = useState(0);
  const [customReason, setCustomReason] = useState("");
  const [draftOutput, setDraftOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleDraft = async (e) => {
    e.preventDefault();
    if (!court || !caseNumber || !counselName || loading) return;

    const chosenReason = reasonIndex === t.reasons.length - 1 ? customReason : t.reasons[reasonIndex];
    if (!chosenReason.trim()) return;

    setLoading(true);
    setDraftOutput("");
    try {
      const details = { court, caseNumber, judgeName, counselName, nextDate, reason: chosenReason };
      
      const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
      const apiLanguage = langNameMap[language] || "English";
      
      const letter = await geminiService.generateAdjournmentLetter(details, apiLanguage);
      setDraftOutput(letter);
    } catch (err) {
      alert(`Drafting failed: ${err.message}`);
      setDraftOutput("Error drafting document.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftOutput);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([draftOutput], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "adjournment_application.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "100%" }}>
      
      {/* Input Form Pane */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Scale size={20} style={{ color: "var(--color-gold)" }} />
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)" }}>{t.title}</h3>
        </div>
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{t.desc}</p>

        <form onSubmit={handleDraft} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.courtLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.courtPlaceholder}
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.caseLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.casePlaceholder}
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.counselLabel} *</label>
              <input
                type="text"
                className="acts-search-input"
                style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
                placeholder={t.counselPlaceholder}
                value={counselName}
                onChange={(e) => setCounselName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.judgeLabel}</label>
              <input
                type="text"
                className="acts-search-input"
                style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
                placeholder={t.judgePlaceholder}
                value={judgeName}
                onChange={(e) => setJudgeName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.nextDateLabel}</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.nextDatePlaceholder}
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.reasonLabel}</label>
            <select
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px", width: "100%", outline: "none", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-md)", fontSize: "12px", cursor: "pointer" }}
              value={reasonIndex}
              onChange={(e) => setReasonIndex(parseInt(e.target.value))}
            >
              {t.reasons.map((r, i) => (
                <option key={i} value={i}>{r}</option>
              ))}
            </select>
          </div>

          {reasonIndex === t.reasons.length - 1 && (
            <div>
              <textarea
                className="editor-textarea"
                style={{ border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-md)", padding: "10px", fontSize: "12px", height: "80px", backgroundColor: "var(--color-cream-dark)" }}
                placeholder="Explain the custom reason here..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 18px", alignSelf: "flex-end" }} disabled={loading || !court || !caseNumber || !counselName}>
            <Sparkles size={14} /> {loading ? t.drafting : t.draftBtn}
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
          {draftOutput && (
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
          fontFamily: "Courier, monospace",
          minHeight: "220px",
          whiteSpace: "pre-wrap"
        }}>
          {draftOutput ? (
            draftOutput
          ) : (
            <span style={{ color: "var(--color-text-muted)", fontStyle: "italic", fontFamily: "var(--font-sans)" }}>
              The drafted adjournment slip will appear here once generated.
            </span>
          )}
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

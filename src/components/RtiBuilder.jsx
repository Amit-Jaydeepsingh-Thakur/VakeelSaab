import React, { useState } from "react";
import { HelpCircle, FileText, Check, Copy, FileDown, Sparkles } from "lucide-react";
import { geminiService } from "../services/geminiService";
import { renderMarkdown } from "../utils/markdown";

export default function RtiBuilder({ language = "en" }) {
  // Localization dictionary
  const t = {
    en: {
      title: "RTI (Right to Information) Application Builder",
      desc: "Draft formal, legally formatted applications under Section 6(1) of the Indian Right to Information Act, 2005 to query government offices.",
      nameLabel: "Applicant Name & Full Postal Address",
      namePlaceholder: "e.g., Sunil Sharma, H-402, Green Meadows, Aundh, Pune - 411007",
      authorityLabel: "Public Authority Name & Address",
      authorityPlaceholder: "e.g., Public Information Officer (PIO), Pune Municipal Corporation, Pune",
      subjectLabel: "Subject Matter of Information Required",
      subjectPlaceholder: "e.g., Road repair budget allocations and status for Aundh ward",
      periodLabel: "Relevant Time Period",
      periodPlaceholder: "e.g., Financial Years 2024-25 and 2025-26",
      queriesLabel: "Specific Information / Questions Required",
      queriesPlaceholder: "e.g., 1. Provide total fund sanctioned for road repair on Main Aundh Road.\n2. Provide names of contractors assigned...",
      draftBtn: "Draft RTI Application",
      drafting: "Formulating RTI application...",
      resultTitle: "Draft RTI Application (Section 6(1) RTI Act)",
      copyBtn: "Copy Application",
      copied: "Copied!",
      downloadBtn: "Download (.txt)",
      pitchTitle: "💰 Everyday Citizen Utility Subscription",
      pitchDesc: "Filing RTIs is one of the most popular ways for Indian citizens to hold local authorities accountable. This simple, structured generator makes filing RTIs accessible, serving as a high-retention premium feature.",
      loadSampleBtn: "Load Road Repair Sample"
    },
    hi: {
      title: "आरटीआई (सूचना का अधिकार) आवेदन निर्माता",
      desc: "सरकारी कार्यालयों से जानकारी प्राप्त करने के लिए भारतीय सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के तहत औपचारिक आरटीआई आवेदन का मसूदा तैयार करें।",
      nameLabel: "आवेदक का नाम और पूरा डाक पता",
      namePlaceholder: "उदा. सुनील शर्मा, एच-402, ग्रीन मीडोज, औंध, पुणे - 411007",
      authorityLabel: "लोक प्राधिकरण (विभाग) का नाम और पता",
      authorityPlaceholder: "उदा. जन सूचना अधिकारी (PIO), पुणे नगर निगम, पुणे",
      subjectLabel: "आवश्यक जानकारी का विषय",
      subjectPlaceholder: "उदा. औंध वार्ड के लिए सड़क मरम्मत बजट आवंटन और स्थिति",
      periodLabel: "संबंधित समय अवधि",
      periodPlaceholder: "उदा. वित्तीय वर्ष 2024-25 और 2025-26",
      queriesLabel: "विशिष्ट प्रश्न / आवश्यक जानकारी",
      queriesPlaceholder: "उदा. 1. मुख्य औंध रोड पर सड़क मरम्मत के लिए स्वीकृत कुल राशि का विवरण दें।\n2. ठेकेदार का नाम प्रदान करें...",
      draftBtn: "आरटीआई आवेदन मसूदा बनाएं",
      drafting: "आरटीआई मसूदा जारी...",
      resultTitle: "आरटीआई आवेदन पत्र मसूदा (धारा 6(1))",
      copyBtn: "आवेदन कॉपी करें",
      copied: "कॉपी हो गया!",
      downloadBtn: "डाउनलोड (.txt)",
      pitchTitle: "💰 आम नागरिक उपयोगिता मुद्रीकरण हुक",
      pitchDesc: "स्थानीय अधिकारियों को जवाबदेह बनाने के लिए भारतीय नागरिकों में आरटीआई दाखिल करना बहुत लोकप्रिय है। यह सरल एआई निर्माता नागरिकों के लिए बेहद मूल्यवान है।",
      loadSampleBtn: "सड़क मरम्मत उदाहरण लोड करें"
    },
    mr: {
      title: "आरटीआय (माहितीचा अधिकार) अर्ज निर्माता",
      desc: "सरकारी विभागांकडून माहिती मागवण्यासाठी भारतीय माहितीचा अधिकार कायदा, २००५ च्या कलम ६(१) अंतर्गत अधिकृत आरटीआय अर्जाचा मसुदा तयार करा.",
      nameLabel: "अर्जदाराचे नाव आणि संपूर्ण टपाल पत्ता",
      namePlaceholder: "उदा. सुनील शर्मा, रा. औंध, पुणे - ४११००७",
      authorityLabel: "सार्वजनिक प्राधिकरण (शासकीय कार्यालय) आणि पत्ता",
      authorityPlaceholder: "उदा. जन माहिती अधिकारी (PIO), पुणे महानगरपालिका, पुणे",
      subjectLabel: "माहिती मागवण्याचा मुख्य विषय",
      subjectPlaceholder: "उदा. औंध प्रभागातील रस्ते दुरुस्तीच्या कामांचा निधी आणि सद्यस्थिती",
      periodLabel: "संबंधित कालावधी",
      periodPlaceholder: "उदा. आर्थिक वर्षे २०२४-२५ आणि २०२५-२६",
      queriesLabel: "माहिती मिळवण्यासाठी विशिष्ट प्रश्न / मुद्दे",
      queriesPlaceholder: "उदा. १. मुख्य औंध रस्त्यावरील दुरुस्ती कामांसाठी मंजूर निधीची माहिती द्या.\n२. संबंधित गुत्तेदाराचे नाव आणि करार पत्र द्या...",
      draftBtn: "आरटीआय अर्ज मसुदा तयार करा",
      drafting: "अर्ज मसुदा तयार होत आहे...",
      resultTitle: "आरटीआय अर्ज मसुदा (कलम ६(१))",
      copyBtn: "अर्ज कॉपी करा",
      copied: "कॉपी केले!",
      downloadBtn: "डाउनलोड (.txt)",
      pitchTitle: "💰 सामान्य नागरिक आरटीआय मुद्रीकरण संधी",
      pitchDesc: "स्थानिक स्वराज्य संस्थांना जाब विचारण्यासाठी आरटीआय अर्ज करणे हा अत्यंत लोकप्रिय मार्ग आहे. हा सुलभ मसुदा निर्माता सामान्य लोकांसाठी आरटीआय दाखल करणे सोपे करतो.",
      loadSampleBtn: "रस्ता दुरुस्ती नमुना लोड करा"
    }
  }[language];

  const [complainantName, setComplainantName] = useState("");
  const [authorityName, setAuthorityName] = useState("");
  const [subject, setSubject] = useState("");
  const [period, setPeriod] = useState("");
  const [questions, setQuestions] = useState("");
  const [draftOutput, setDraftOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleDraft = async (e) => {
    e.preventDefault();
    if (!complainantName || !authorityName || !subject || !questions || loading) return;

    setLoading(true);
    setDraftOutput("");
    try {
      const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
      const apiLanguage = langNameMap[language] || "English";
      
      const details = { complainantName, authorityName, subject, period, questions };
      const complaint = await geminiService.draftRtiComplaint(details, apiLanguage);
      setDraftOutput(complaint);
    } catch (err) {
      alert(`RTI drafting failed: ${err.message}`);
      setDraftOutput("Error drafting RTI application.");
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
    element.download = "rti_application.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLoadSample = () => {
    setComplainantName("Amitesh Kulkarni, Flat 104, Sai Heritage, Baner, Pune - 411045");
    setAuthorityName("Public Information Officer (PIO), Office of the City Engineer, Pune Municipal Corporation");
    setSubject("Sanctioned budget and work completion certificate for road resurfacing work conducted on Baner Road in 2025");
    setPeriod("1st January 2025 to 31st December 2025");
    setQuestions("1. Provide the certified copy of the sanctioned budget estimate and expenditure details for Baner Road resurfacing.\n2. Provide the certified copy of the Work Completion Certificate issued to the contractor.\n3. Provide the name and contact details of the contractor who executed this project.");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "100%" }}>
      
      {/* Input panel */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1 }}>
            <HelpCircle size={20} style={{ color: "var(--color-gold)" }} />
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)" }}>{t.title}</h3>
          </div>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={handleLoadSample}>
            {t.loadSampleBtn}
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{t.desc}</p>

        <form onSubmit={handleDraft} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.nameLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.namePlaceholder}
              value={complainantName}
              onChange={(e) => setComplainantName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.authorityLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.authorityPlaceholder}
              value={authorityName}
              onChange={(e) => setAuthorityName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.subjectLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.subjectPlaceholder}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.periodLabel}</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.periodPlaceholder}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.queriesLabel} *</label>
            <textarea
              className="editor-textarea"
              style={{ border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-md)", padding: "10px", fontSize: "12px", height: "100px", backgroundColor: "var(--color-cream-dark)" }}
              placeholder={t.queriesPlaceholder}
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 18px", alignSelf: "flex-end" }} disabled={loading || !complainantName || !authorityName || !subject || !questions}>
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
              The drafted RTI application will appear here once generated.
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

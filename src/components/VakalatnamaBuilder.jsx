import React, { useState } from "react";
import { FileText, Scale, Check, Copy, FileDown, Sparkles } from "lucide-react";
import { geminiService } from "../services/geminiService";

export default function VakalatnamaBuilder({ language = "en" }) {
  // Localization dictionary
  const t = {
    en: {
      title: "Vakalatnama & Appearance Builder",
      desc: "Draft standard court-compliant Vakalatnamas (Power of Attorney authorizing representing advocate) for High Courts and District Courts in India.",
      courtLabel: "Name of Court",
      courtPlaceholder: "e.g., In the High Court of Judicature at Bombay",
      caseLabel: "Case Title & Classification",
      casePlaceholder: "e.g., Civil Writ Petition No. 1205 of 2026 (Ramesh vs Suresh)",
      clientLabel: "Client / Principal Appointer",
      clientPlaceholder: "e.g., Ramesh S/o Vijay Kumar, residing at Pune",
      advocateLabel: "Advocate / Counsel Name(s)",
      advocatePlaceholder: "e.g., Sunil Deshmukh, Advocate & Associates, Enrollment No. MAH/1245/2015",
      draftBtn: "Draft Vakalatnama",
      drafting: "Generating Vakalatnama template...",
      resultTitle: "Draft Vakalatnama / Memo of Appearance",
      copyBtn: "Copy Vakalatnama",
      copied: "Copied!",
      downloadBtn: "Download (.txt)",
      pitchTitle: "💰 Essential Lawyer B2B Daily Utility Hook",
      pitchDesc: "Every lawyer must file a Vakalatnama for every litigation case. Restructuring this daily administrative bottleneck into a quick, auto-filled cloud templates assistant is a powerful B2B subscription pitch.",
      loadSampleBtn: "Load Civil Suit Sample"
    },
    hi: {
      title: "वकालतनामा (Vakalatnama) और उपस्थिति निर्माता",
      desc: "भारत में उच्च न्यायालयों और जिला न्यायालयों के लिए अदालत के नियमों के अनुरूप वकालतनामा (अधिवक्ता का अधिकार पत्र) का मसूदा तैयार करें।",
      courtLabel: "न्यायालय का नाम",
      courtPlaceholder: "उदा. उच्च न्यायालय मुंबई, खंडपीठ नागपुर",
      caseLabel: "मामला संख्या और शीर्षक",
      casePlaceholder: "उदा. सिविल रिट याचिका संख्या 1205/2026 (रमेश बनाम सुरेश)",
      clientLabel: "मुवक्किल / नियुक्तकर्ता का नाम",
      clientPlaceholder: "उदा. रमेश, पिता विजय कुमार, निवासी पुणे",
      advocateLabel: "अधिवक्ता / काउंसिल का नाम",
      advocatePlaceholder: "उदा. सुनील देशमुख, एडवोकेट, नामांकन संख्या MAH/1245/2015",
      draftBtn: "वकालतनामा का मसूदा बनाएं",
      drafting: "मसूदा जारी...",
      resultTitle: "वकालतनामा पत्र मसूदा",
      copyBtn: "कॉपी करें",
      copied: "कॉपी हो गया!",
      downloadBtn: "डाउनलोड (.txt)",
      pitchTitle: "💰 दैनिक वकील उपयोगिता सदस्यता हुक",
      pitchDesc: "हर मुकदमे के लिए वकालतनामा दाखिल करना अनिवार्य है। इस दैनिक प्रशासनिक काम को स्वचालित बनाना वकीलों के लिए एक बहुत उपयोगी सशुल्क सेवा है।",
      loadSampleBtn: "दिवाणी खटला उदाहरण लोड करें"
    },
    mr: {
      title: "वकालतनामा (Vakalatnama) आणि मुखत्यारपत्र निर्माता",
      desc: "भारतातील उच्च न्यायालये आणि जिल्हा न्यायालयांसाठी अधिकृत वकालतनामा (वकिलाचे अधिकार पत्र) मसुदा तयार करा.",
      courtLabel: "न्यायालयाचे नाव",
      courtPlaceholder: "उदा. उच्च न्यायालय मुंबई, खंडपीठ औरंगाबाद",
      caseLabel: "खटला क्रमांक आणि नाव",
      casePlaceholder: "उदा. दिवाणी रिट याचिका क्र. १२०५/२०२६ (रमेश विरुद्ध सुरेश)",
      clientLabel: "पक्षकार / नियुक्त करणाऱ्याचे नाव",
      clientPlaceholder: "उदा. रमेश, रा. पुणे",
      advocateLabel: "वकिलाचे नाव आणि सनद क्रमांक",
      advocatePlaceholder: "उदा. सुनील देशमुख, अॅडव्होकेट, सनद क्र. MAH/१२४५/२०१५",
      draftBtn: "वकालतनामा मसुदा तयार करा",
      drafting: "वकालतनामा तयार होत आहे...",
      resultTitle: "वकालतनामा अर्ज मसुदा",
      copyBtn: "कॉपी करा",
      copied: "कॉपी केले!",
      downloadBtn: "डाउनलोड (.txt)",
      pitchTitle: "💰 दैनिक वकील उपयुक्तता सदस्यता संधी",
      pitchDesc: "प्रत्येक दाव्यात वकालतनामा सादर करणे अनिवार्य असते. हा रोजचा कागदोपत्री कारभार सोपा करून मिळणारे साधन वकिलांच्या व्यावसायिक उपयोगासाठी उत्कृष्ट सशुल्क पर्याय ठरेल.",
      loadSampleBtn: "दिवाणी नमुना लोड करा"
    }
  }[language];

  const [court, setCourt] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [advocateName, setAdvocateName] = useState("");
  const [draftOutput, setDraftOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleDraft = async (e) => {
    e.preventDefault();
    if (!court || !clientName || !advocateName || loading) return;

    setLoading(true);
    setDraftOutput("");
    try {
      const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
      const apiLanguage = langNameMap[language] || "English";
      
      const details = { court, caseTitle, clientName, advocateName };
      const letter = await geminiService.draftVakalatnama(details, apiLanguage);
      setDraftOutput(letter);
    } catch (err) {
      alert(`Drafting failed: ${err.message}`);
      setDraftOutput("Error drafting Vakalatnama.");
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
    element.download = "court_vakalatnama_draft.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLoadSample = () => {
    setCourt("Before the Ld. District and Sessions Judge at Pune");
    setCaseTitle("Regular Civil Suit No. 245 of 2026 (Kishore Patil vs Nilesh Shah)");
    setClientName("Kishore Patil S/o Pandurang Patil, age 45 years, residing at Kothrud, Pune");
    setAdvocateName("Adv. Shekhar R. Kulkarni (Enrollment No. MAH/9988/2012) and associates");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "100%" }}>
      
      {/* Input Form Pane */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1 }}>
            <Scale size={20} style={{ color: "var(--color-gold)" }} />
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)" }}>{t.title}</h3>
          </div>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={handleLoadSample}>
            {t.loadSampleBtn}
          </button>
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
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.caseLabel}</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.casePlaceholder}
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.clientLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.clientPlaceholder}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.advocateLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.advocatePlaceholder}
              value={advocateName}
              onChange={(e) => setAdvocateName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 18px", alignSelf: "flex-end" }} disabled={loading || !court || !clientName || !advocateName}>
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
              The drafted Vakalatnama will appear here once generated.
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

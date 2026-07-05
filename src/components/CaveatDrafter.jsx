import React, { useState } from "react";
import { FileText, Scale, Check, Copy, FileDown, Sparkles } from "lucide-react";
import { geminiService } from "../services/geminiService";

export default function CaveatDrafter({ language = "en" }) {
  // Localization dictionary
  const t = {
    en: {
      title: "Caveat Petition Generator (Section 148A CPC)",
      desc: "Draft formal, legally formatted Caveat Petitions under Section 148A of the Code of Civil Procedure, 1908 to shield against ex-parte stay orders.",
      courtLabel: "Name of Court",
      courtPlaceholder: "e.g., In the Court of Civil Judge Senior Division at Pune",
      caveatorLabel: "Caveator Name & Full Address (You / Apprehender)",
      caveatorPlaceholder: "e.g., Ramesh Kumar, S/o Vijay Kumar, residing at Baner Road, Pune",
      caveateeLabel: "Caveatee Name & Full Address (Opponent)",
      caveateePlaceholder: "e.g., Amit Verma, S/o Suresh Verma, residing at Aundh, Pune",
      disputeLabel: "Subject Matter of Dispute & Suit Details",
      disputePlaceholder: "e.g., Dispute regarding the ownership and possession of land situated at Survey No. 42, Baner, Pune. Apprehending ex-parte injunction suit...",
      draftBtn: "Draft Caveat Petition",
      drafting: "Formulating Caveat Petition...",
      resultTitle: "Draft Caveat Petition under Section 148A CPC",
      copyBtn: "Copy Caveat",
      copied: "Copied!",
      downloadBtn: "Download (.txt)",
      pitchTitle: "💰 Proactive Litigation Shield B2B Monetization Hook",
      pitchDesc: "A Caveat is the only legal protection a property owner or business has against sudden ex-parte court stays. An automated Caveat generator is a high-value litigation feature.",
      loadSampleBtn: "Load Land Dispute Sample"
    },
    hi: {
      title: "कैविएट याचिका मसूदा निर्माता (धारा 148A)",
      desc: "एकतरफा अदालती स्थगन आदेशों (ex-parte stay orders) से सुरक्षा के लिए सिविल प्रक्रिया संहिता, 1908 की धारा 148A के तहत औपचारिक कैविएट याचिका का मसूदा तैयार करें।",
      courtLabel: "न्यायालय का नाम",
      courtPlaceholder: "उदा. दिवाणी न्यायाधीश वरिष्ठ स्तर न्यायालय, पुणे",
      caveatorLabel: "कैविएटर का नाम और पूरा पता (आप / आवेदक)",
      caveatorPlaceholder: "उदा. रमेश कुमार, पिता विजय कुमार, निवासी बानेर रोड, पुणे",
      caveateeLabel: "कैविएटी का नाम और पूरा पता (विपक्षी पार्टी)",
      caveateePlaceholder: "उदा. अमित वर्मा, पिता सुरेश वर्मा, निवासी औंध, पुणे",
      disputeLabel: "विवाद का विषय और विवरण",
      disputePlaceholder: "उदा. सर्वे नंबर 42, बानेर, पुणे में स्थित भूमि के स्वामित्व और कब्जे के संबंध में विवाद। विपक्षी द्वारा एकतरफा निषेधाज्ञा (injunction) याचिका दायर करने की आशंका...",
      draftBtn: "कैविएट याचिका का मसूदा बनाएं",
      drafting: "मसूदा जारी...",
      resultTitle: "कैविएट याचिका मसूदा (धारा 148A)",
      copyBtn: "कॉपी करें",
      copied: "कॉपी हो गया!",
      downloadBtn: "डाउनलोड (.txt)",
      pitchTitle: "💰 मुकदमेबाजी ढाल सशुल्क सेवा हुक",
      pitchDesc: "अदालत में अचानक एकतरफा स्थगन को रोकने के लिए कैविएट एकमात्र साधन है। भूमि या व्यावसायिक विवादों में त्वरित कैविएट निर्माता एक उच्च-मूल्य वाली सेवा है।",
      loadSampleBtn: "भूमि विवाद उदाहरण लोड करें"
    },
    mr: {
      title: "कॅव्हेट (Caveat) याचिका मसुदा निर्माता",
      desc: "न्यायालयाकडून अचानक एकतर्फी स्थगिती आदेश (ex-parte stay order) देणे रोखण्यासाठी दिवाणी प्रक्रिया संहिता, १९०८ च्या कलम १४८A अंतर्गत कॅव्हेट याचिकेचा मसुदा तयार करा.",
      courtLabel: "न्यायालयाचे नाव",
      courtPlaceholder: "उदा. दिवाणी न्यायालय वरिष्ठ स्तर, पुणे",
      caveatorLabel: "कॅव्हेटरचे नाव आणि पत्ता (अर्जदार)",
      caveatorPlaceholder: "उदा. रमेश कुमार, रा. बाणेर रोड, पुणे",
      caveateeLabel: "कॅव्हेटीचे नाव आणि पत्ता (विपक्षी पक्ष)",
      caveateePlaceholder: "उदा. अमित वर्मा, रा. औंध, पुणे",
      disputeLabel: "विवाद आणि मालमत्तेचा सविस्तर मजकूर",
      disputePlaceholder: "उदा. बाणेर, पुणे येथील मिळकत सर्व्हे क्र. ४२ च्या मालकी हक्काबाबत वाद. विपक्षी पक्षाकडून एकतर्फी तात्पुरती स्थगिती अर्ज दाखल होण्याची दाट शक्यता...",
      draftBtn: "कॅव्हेट याचिका मसुदा तयार करा",
      drafting: "कॅव्हेट मसुदा तयार होत आहे...",
      resultTitle: "कॅव्हेट याचिका मसुदा (कलम १४८A)",
      copyBtn: "कॉपी करा",
      copied: "कॉपी केले!",
      downloadBtn: "डाउनलोड (.txt)",
      pitchTitle: "💰 कायदेशीर संरक्षण सशुल्क फिचर संधी",
      pitchDesc: "कोणत्याही व्यावसायिक किंवा मालमत्तेच्या वादात एकतर्फी स्थगिती टाळण्यासाठी कॅव्हेट दाखल करणे ही पहिली पायरी असते. हे साधन वकिलांना तसेच मालमत्ता धारकांना मोठा फायदा मिळवून देऊ शकते.",
      loadSampleBtn: "जमीन वाद नमुना लोड करा"
    }
  }[language];

  const [court, setCourt] = useState("");
  const [caveatorName, setCaveatorName] = useState("");
  const [caveateeName, setCaveateeName] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [draftOutput, setDraftOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleDraft = async (e) => {
    e.preventDefault();
    if (!court || !caveatorName || !caveateeName || !caseDetails || loading) return;

    setLoading(true);
    setDraftOutput("");
    try {
      const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
      const apiLanguage = langNameMap[language] || "English";
      
      const details = { court, caveatorName, caveateeName, caseDetails };
      const petition = await geminiService.draftCaveatPetition(details, apiLanguage);
      setDraftOutput(petition);
    } catch (err) {
      alert(`Drafting failed: ${err.message}`);
      setDraftOutput("Error drafting Caveat Petition.");
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
    element.download = "court_caveat_petition.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLoadSample = () => {
    setCourt("In the Court of the Civil Judge Senior Division at Pune");
    setCaveatorName("Vijay S. Deshpande S/o Shripad Deshpande, age 52 years, residing at Bungalow No. 5, Sahakar Nagar, Pune");
    setCaveateeName("Nitin K. Shinde S/o Kamlakar Shinde, age 48 years, residing at Kothrud, Pune");
    setCaseDetails("The dispute concerns commercial shop property situated at Survey No. 84, Hissa No. 2, Kothrud, Pune. The caveator is the legal owner in possession. The caveatee has threatened to file a partition and injunction lawsuit seeking an ex-parte status-quo order to seal the shop.");
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
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.caveatorLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.caveatorPlaceholder}
              value={caveatorName}
              onChange={(e) => setCaveatorName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.caveateeLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.caveateePlaceholder}
              value={caveateeName}
              onChange={(e) => setCaveateeName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.disputeLabel} *</label>
            <textarea
              className="editor-textarea"
              style={{ border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-md)", padding: "10px", fontSize: "12px", height: "100px", backgroundColor: "var(--color-cream-dark)" }}
              placeholder={t.disputePlaceholder}
              value={caseDetails}
              onChange={(e) => setCaseDetails(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 18px", alignSelf: "flex-end" }} disabled={loading || !court || !caveatorName || !caveateeName || !caseDetails}>
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
              The drafted Caveat Petition will appear here once generated.
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

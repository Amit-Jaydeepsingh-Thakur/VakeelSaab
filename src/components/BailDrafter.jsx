import React, { useState } from "react";
import { FileText, Scale, Check, Copy, FileDown, Sparkles } from "lucide-react";
import { geminiService } from "../services/geminiService";

export default function BailDrafter({ language = "en" }) {
  // Localization dictionary
  const t = {
    en: {
      title: "Bail Application Builder (BNSS)",
      desc: "Draft formal, legally formatted Bail Applications under Section 480 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 (formerly Section 439 CrPC) for Magistrates or Sessions Courts.",
      courtLabel: "Name of Court",
      courtPlaceholder: "e.g., In the Court of Ld. Judicial Magistrate First Class, Pune",
      accusedLabel: "Accused Name & Personal Details",
      accusedPlaceholder: "e.g., Suresh Kumar, S/o Vijay Kumar, aged 32 years, residing at Baner, Pune (presently in judicial custody)",
      firLabel: "FIR Number, Offence Sections & Police Station",
      firPlaceholder: "e.g., FIR No. 120/2026 registered at Chaturshringi Police Station under Section 303 & 318 BNS",
      groundsLabel: "Grounds for Seeking Bail (List one per line)",
      groundsPlaceholder: "e.g., The applicant is innocent and falsely implicated.\nThe investigation is complete and custody is no longer required.\nThe applicant has deep roots in society and is not a flight risk.",
      draftBtn: "Draft Bail Application",
      drafting: "Generating bail application...",
      resultTitle: "Draft Bail Application (Section 480 BNSS)",
      copyBtn: "Copy Application",
      copied: "Copied!",
      downloadBtn: "Download (.txt)",
      pitchTitle: "💰 Criminal Litigation B2B Subscription Hook",
      pitchDesc: "Bail applications are filed by the thousands every day in Indian Magistrate courts. A quick, mobile-accessible generator that structures standard bail grounds in clean BNSS/BNS nomenclature is a massive value-add for trial lawyers.",
      loadSampleBtn: "Load Cheating Allegation Sample"
    },
    hi: {
      title: "जमानत याचिका (Bail Application) निर्माता - BNSS",
      desc: "मजिस्ट्रेट या सत्र न्यायालयों के लिए भारतीय नागरिक सुरक्षा संहिता (BNSS), 2023 की धारा 480 (पूर्व में धारा 439 CrPC) के तहत औपचारिक जमानत याचिका का मसूदा तैयार करें।",
      courtLabel: "न्यायालय का नाम",
      courtPlaceholder: "उदा. न्यायिक मजिस्ट्रेट प्रथम श्रेणी न्यायालय, पुणे",
      accusedLabel: "आरोपी का नाम और व्यक्तिगत विवरण",
      accusedPlaceholder: "उदा. सुरेश कुमार, पिता विजय कुमार, आयु 32 वर्ष, निवासी बानेर, पुणे (वर्तमान में न्यायिक हिरासत में)",
      firLabel: "प्राथमिकी (FIR) संख्या, अपराध की धाराएं और पुलिस स्टेशन",
      firPlaceholder: "उदा. प्राथमिकी संख्या 120/2026, चतुर्शृंगी पुलिस स्टेशन में धारा 303 और 318 BNS के तहत दर्ज",
      groundsLabel: "जमानत के आधार (प्रति पंक्ति एक लिखें)",
      groundsPlaceholder: "उदा. आवेदक निर्दोष है और उसे झूठा फंसाया गया है।\nजांच पूरी हो चुकी है और हिरासत की आवश्यकता नहीं है।\nआवेदक का समाज में गहरा प्रभाव है और उसके भागने का कोई खतरा नहीं है।",
      draftBtn: "जमानत याचिका मसूदा बनाएं",
      drafting: "मसूदा जारी...",
      resultTitle: "जमानत याचिका मसूदा (धारा 480 BNSS)",
      copyBtn: "कॉपी करें",
      copied: "कॉपी हो गया!",
      downloadBtn: "डाउनलोड (.txt)",
      pitchTitle: "💰 आपराधिक वकालत सशुल्क सेवा हुक",
      pitchDesc: "भारतीय अदालतों में हर दिन हजारों जमानत याचिकाएं दायर की जाती हैं। ट्रायल कोर्ट के वकीलों के लिए मोबाइल पर त्वरित जमानत आवेदन पत्र तैयार करना बेहद उपयोगी है।",
      loadSampleBtn: "धोखाधड़ी आरोप उदाहरण लोड करें"
    },
    mr: {
      title: "जामीन अर्ज (Bail Application) निर्माता - BNSS",
      desc: "मॅजिस्ट्रेट किंवा सत्र न्यायालयांसाठी भारतीय नागरिक सुरक्षा संहिता (BNSS), २०२३ च्या कलम ४८० (पूर्वीचे ४३९ CrPC) अंतर्गत कायदेशीर जामीन अर्जाचा मसुदा तयार करा.",
      courtLabel: "न्यायाल्याचे नाव",
      courtPlaceholder: "उदा. प्रथम वर्ग न्यायदंडाधिकारी न्यायालय, पुणे",
      accusedLabel: "आरोपीचे नाव आणि सविस्तर माहिती",
      accusedPlaceholder: "उदा. सुरेश कुमार, रा. बाणेर, पुणे (सध्या न्यायालयीन कोठडीत)",
      firLabel: "एफआयआर (FIR) क्रमांक, गुन्ह्याची कलमे आणि पोलीस स्टेशन",
      firPlaceholder: "उदा. एफआयआर क्र. १२०/२०२६, चतुःश्रृंगी पोलीस ठाण्यात कलम ३०३ आणि ३१८ BNS अंतर्गत नोंदवलेला गुन्हा",
      groundsLabel: "जामीन मिळण्यासाठीचे कायदेशीर मुद्दे (एका ओळीत एक)",
      groundsPlaceholder: "उदा. अर्जदार निर्दोष असून त्याला खोट्या गुन्ह्यात अडकवण्यात आले आहे.\nपोलीस तपास पूर्ण झाला असून अर्जदाराची कोठडीत राहण्याची गरज नाही.\nअर्जदार पळून जाण्याची शक्यता नाही आणि तो तपासात सहकार्य करेल.",
      draftBtn: "जामीन अर्ज मसुदा तयार करा",
      drafting: "मसुदा तयार होत आहे...",
      resultTitle: "जामीन अर्ज मसुदा (कलम ४८० BNSS)",
      copyBtn: "कॉपी करा",
      copied: "कॉपी केले!",
      downloadBtn: "डाउनलोड (.txt)",
      pitchTitle: "💰 फौजदारी वकिली प्रगत फिचर संधी",
      pitchDesc: "मॅजिस्ट्रेट कोर्टात रोज शेकडो जामीन अर्ज दाखल होतात. वकिलांना आयत्या वेळी कोर्टामध्ये अर्ज तयार करून प्रिंट करण्यासाठी हे अतिशय सोयीचे व सशुल्क फिचर आहे.",
      loadSampleBtn: "फसवणूक गुन्हा नमुना लोड करा"
    }
  }[language];

  const [court, setCourt] = useState("");
  const [accusedName, setAccusedName] = useState("");
  const [firDetails, setFirDetails] = useState("");
  const [grounds, setGrounds] = useState("");
  const [draftOutput, setDraftOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleDraft = async (e) => {
    e.preventDefault();
    if (!court || !accusedName || !firDetails || !grounds || loading) return;

    setLoading(true);
    setDraftOutput("");
    try {
      const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
      const apiLanguage = langNameMap[language] || "English";
      
      const details = { court, accusedName, firDetails, grounds };
      const petition = await geminiService.draftBailApplication(details, apiLanguage);
      setDraftOutput(petition);
    } catch (err) {
      alert(`Drafting failed: ${err.message}`);
      setDraftOutput("Error drafting Bail Application.");
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
    element.download = "bail_application_draft.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLoadSample = () => {
    setCourt("In the Court of the Judicial Magistrate First Class (Anti-Corruption Cell), Pune");
    setAccusedName("Vijay Shantilal Shah, S/o Shantilal Shah, aged 41 years, residing at Flat 301, Tulip Heights, Kothrud, Pune (presently in Yerawada Central Prison)");
    setFirDetails("FIR No. 98 of 2026 registered at Deccan Gymkhana Police Station under Section 316 and 318 BNS (formerly Sec 406/420 IPC)");
    setGrounds("1. The applicant has been falsely implicated due to civil business rivalry and there is no prima facie case of cheating.\n2. The entire dispute is commercial in nature and a civil suit has already been filed.\n3. The applicant is ready to cooperate with the investigating officer and has already handed over all relevant books of accounts.");
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
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.accusedLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.accusedPlaceholder}
              value={accusedName}
              onChange={(e) => setAccusedName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.firLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.firPlaceholder}
              value={firDetails}
              onChange={(e) => setFirDetails(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.groundsLabel} *</label>
            <textarea
              className="editor-textarea"
              style={{ border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-md)", padding: "10px", fontSize: "12px", height: "100px", backgroundColor: "var(--color-cream-dark)" }}
              placeholder={t.groundsPlaceholder}
              value={grounds}
              onChange={(e) => setGrounds(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 18px", alignSelf: "flex-end" }} disabled={loading || !court || !accusedName || !firDetails || !grounds}>
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
              The drafted criminal bail application will appear here once generated.
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

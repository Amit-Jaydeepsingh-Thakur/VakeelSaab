import React, { useState } from "react";
import { Languages, FileText, Check, Copy, FileDown, Sparkles } from "lucide-react";
import { geminiService } from "../services/geminiService";

export default function LegalTranslator({ language = "en" }) {
  // Localization dictionary for the Legal Translator
  const t = {
    en: {
      title: "Vernacular Police Record Translator",
      desc: "Instantly translate Hindi or Marathi FIRs, Site Panchnamas, and Charge Sheets into formal English court filings.",
      sourceLangLabel: "Select Source Language",
      sourcePlaceholder: "Paste your Marathi or Hindi police complaint, FIR record, daily diary, or panchnama here...",
      targetTitle: "Translated Court English",
      translateBtn: "Translate Document",
      translating: "Translating document...",
      copyBtn: "Copy Translation",
      copied: "Copied!",
      downloadBtn: "Download TXT",
      pricingPitchTitle: "Premium Translation Notary Notary (Revenue Hook)",
      pricingPitchDesc: "Translation services in High Courts charge ₹250 per page. You can monetize this feature by offering instant translations of police records."
    },
    hi: {
      title: "स्थानीय पुलिस रिकॉर्ड अनुवादक",
      desc: "हिंदी या मराठी FIR, स्थल पंचनामा और आरोप पत्र को औपचारिक अंग्रेजी अदालती भाषा में तुरंत अनुवाद करें।",
      sourceLangLabel: "स्रोत भाषा चुनें",
      sourcePlaceholder: "अपना मराठी या हिंदी पुलिस शिकायत, एफआईआर रिकॉर्ड, या पंचनामा यहाँ पेस्ट करें...",
      targetTitle: "अनुवादित अदालती अंग्रेजी",
      translateBtn: "दस्तावेज़ का अनुवाद करें",
      translating: "अनुवाद किया जा रहा है...",
      copyBtn: "अनुवाद कॉपी करें",
      copied: "कॉपी हो गया!",
      downloadBtn: "TXT डाउनलोड करें",
      pricingPitchTitle: "प्रीमियम कानूनी अनुवादक (राजस्व हुक)",
      pricingPitchDesc: "उच्च न्यायालयों में अनुवाद सेवाओं के लिए प्रति पृष्ठ ₹250 का शुल्क लिया जाता है। आप इस विशेषता का उपयोग व्यावसायिक अनुवाद सेवा प्रदान करने के लिए कर सकते हैं।"
    },
    mr: {
      title: "स्थानिक पोलीस रेकॉर्ड अनुवादक",
      desc: "मराठी किंवा हिंदी एफआयआर (FIR), घटनास्थळ पंचनामा आणि दोषारोपपत्र यांचे न्यायालयाच्या अधिकृत इंग्रजी भाषेत भाषांतर करा.",
      sourceLangLabel: "स्रोत भाषा निवडा",
      sourcePlaceholder: "तुमची मराठी किंवा हिंदी पोलीस तक्रार, एफआयआर किंवा पंचनामा येथे पेस्ट करा...",
      targetTitle: "भाषांतरित न्यायालयीन इंग्रजी",
      translateBtn: "दस्तऐवज भाषांतरित करा",
      translating: "भाषांतर होत आहे...",
      copyBtn: "भाषांतर कॉपी करा",
      copied: "कॉपी केले!",
      downloadBtn: "TXT डाउनलोड करा",
      pricingPitchTitle: "प्रीमियम कायदेशीर अनुवादक (महसूल हुक)",
      pricingPitchDesc: "उच्च न्यायालयांमध्ये भाषांतर सेवांसाठी प्रति पृष्ठ ₹२५० आकारले जातात. पोलीस दस्तऐवजांचे झटपट इंग्रजी भाषांतर करून तुम्ही या सुविधेद्वारे महसूल मिळवू शकता."
    }
  }[language];

  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState("Marathi");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleTranslate = async (e) => {
    e.preventDefault();
    if (!sourceText.trim() || loading) return;

    setLoading(true);
    setTranslatedText("");
    try {
      const translation = await geminiService.translatePoliceRecord(sourceText, sourceLang);
      setTranslatedText(translation);
    } catch (err) {
      alert(`Translation failed: ${err.message}`);
      setTranslatedText("Error executing translation. Please check key or connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([translatedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `translated_record_${sourceLang.toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Preload a Marathi sample FIR extract to let the user test immediately
  const handleLoadSample = () => {
    if (sourceLang === "Marathi") {
      setSourceText(`प्रथम खबरी अहवाल (F.I.R.)
कलम १५४ फौजदारी प्रक्रिया संहिता

१. जिल्हा: पुणे, पोलीस ठाणे: शिवाजीनगर
२. फिर्यादीचे नाव: रमेश तात्याराव गोखले, पत्ता: सदाशिव पेठ, पुणे
३. आरोपीचे नाव: सुरेश मनोहर जोशी, पत्ता: कोथरूड, पुणे
४. गुन्ह्याचा तपशील:
फिर्यादीने आरोपीला त्यांच्या नवीन हॉटेल व्यवसायासाठी भांडवल म्हणून रुपये ५,००,०००/- (पाच लाख रुपये) रोख स्वरूपात कर्ज म्हणून दिले होते. आरोपीने हे पैसे परत करण्याचे वचन दिले होते. परंतु ठरलेल्या मुदतीत आरोपीने पैसे परत केले नाहीत. फिर्यादीने वारंवार तगादा लावला असता आरोपीने फिर्यादीला जीवे मारण्याची धमकी दिली आणि लबाडीने पैसे देण्यास नकार दिला. आरोपीने फिर्यादीचा विश्वासघात करून फसवणूक केली आहे.

५. पोलिसांची प्राथमिक नोंद: आरोपीविरुद्ध कलम ३१६ (विश्वासघात) आणि ३१८ (फसवणूक) भारतीय न्याय संहिता (BNS) अंतर्गत गुन्हा नोंदविला आहे.`);
    } else {
      setSourceText(`प्रथम सूचना रिपोर्ट (F.I.R.)
धारा १५४ दंड प्रक्रिया संहिता

१. जिला: दिल्ली, थाना: कनाट प्लेस
२. शिकायतकर्ता का नाम: अशोक कुमार गुप्ता
३. आरोपी का नाम: विकास कुमार वर्मा
४. अपराध का विवरण:
शिकायतकर्ता और आरोपी ने एक व्यापारिक समझौते पर हस्ताक्षर किए थे। आरोपी ने माल की डिलीवरी के बदले ५ लाख रुपये का अग्रिम भुगतान प्राप्त किया। निर्धारित तिथि बीत जाने के बाद भी आरोपी ने माल की डिलीवरी नहीं दी। जब शिकायतकर्ता ने पैसे वापस मांगे, तो आरोपी ने अभद्र भाषा का प्रयोग किया, धमकी दी और राशि लौटाने से स्पष्ट इंकार कर दिया। आरोपी ने जानबूझकर शिकायतकर्ता के साथ धोखाधड़ी और विश्वासघात किया है।`);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "100%" }}>
      
      {/* Source Language Panel */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Languages size={20} style={{ color: "var(--color-gold)" }} />
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)" }}>{t.title}</h3>
        </div>
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{t.desc}</p>

        <form onSubmit={handleTranslate} style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontSize: "12px", fontWeight: "600" }}>{t.sourceLangLabel}</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                type="button" 
                className={`btn ${sourceLang === "Marathi" ? "btn-gold" : "btn-secondary"}`}
                style={{ padding: "4px 10px", fontSize: "11px" }}
                onClick={() => setSourceLang("Marathi")}
              >
                Marathi (मराठी)
              </button>
              <button 
                type="button" 
                className={`btn ${sourceLang === "Hindi" ? "btn-gold" : "btn-secondary"}`}
                style={{ padding: "4px 10px", fontSize: "11px" }}
                onClick={() => setSourceLang("Hindi")}
              >
                Hindi (हिंदी)
              </button>
            </div>
          </div>

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
            placeholder={t.sourcePlaceholder}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            required
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ fontSize: "11px", padding: "6px 12px" }}
              onClick={handleLoadSample}
            >
              Load Sample {sourceLang} Record
            </button>

            <button type="submit" className="btn btn-primary" style={{ padding: "8px 18px" }} disabled={loading || !sourceText.trim()}>
              <Sparkles size={14} /> {loading ? t.translating : t.translateBtn}
            </button>
          </div>
        </form>
      </div>

      {/* Target Translation Panel */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContext: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-gray-border)", paddingBottom: "12px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1 }}>
            <FileText size={20} style={{ color: "var(--color-gold)" }} />
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)" }}>{t.targetTitle}</h3>
          </div>
          {translatedText && (
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
          fontSize: "13px",
          color: "var(--color-text-dark)",
          whiteSpace: "pre-line",
          overflowY: "auto",
          minHeight: "220px"
        }}>
          {translatedText || (
            <span style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
              The English legal translation will generate here once you click "Translate Document".
            </span>
          )}
        </div>

        {/* Business Pitch Callout */}
        <div style={{ backgroundColor: "var(--color-gold-light)", border: "1px solid var(--color-gold)", borderRadius: "var(--radius-md)", padding: "12px 16px" }}>
          <strong style={{ display: "block", fontSize: "11.5px", color: "#78350f", marginBottom: "4px" }}>🪙 {t.pricingPitchTitle}</strong>
          <span style={{ fontSize: "10.5px", color: "#92400e", lineHeight: "1.4" }}>{t.pricingPitchDesc}</span>
        </div>
      </div>

    </div>
  );
}

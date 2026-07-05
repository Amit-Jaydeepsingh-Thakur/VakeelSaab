import React, { useState } from "react";
import { Briefcase, FileText, Check, Copy, FileDown, Sparkles } from "lucide-react";
import { geminiService } from "../services/geminiService";
import { renderMarkdown } from "../utils/markdown";

export default function CaseBriefer({ language = "en" }) {
  // Localization
  const t = {
    en: {
      title: "Case Brief & Client Intake Generator",
      desc: "Paste raw client notes or narrative testimonies. The AI will structure them into a formal legal Case Brief.",
      label: "Raw Client Testimony / Story",
      placeholder: "e.g. My client Ramesh runs a grocery store. He entered a partner agreement with Amit on March 2025. Amit was in charge of accounts but secretly siphoned off ₹3 Lakhs to his personal bank and left the country last week...",
      generateBtn: "Generate Case Brief",
      generating: "Analyzing and briefer...",
      resultTitle: "Structured Legal Case Brief",
      copyBtn: "Copy Brief",
      copied: "Copied!",
      downloadBtn: "Download Brief (.txt)",
      pitchTitle: "💰 Client Case Intake Monetization Hook",
      pitchDesc: "Law firms spend hours drafting Case Briefs and summarizing raw inputs. This automated summarizing agent is a highly pitchable B2B SaaS subscription feature."
    },
    hi: {
      title: "केस संक्षिप्त (Case Brief) और मुवक्किल पूछताछ जेनरेटर",
      desc: "मुवक्किल के कच्चे नोट्स या मौखिक गवाही पेस्ट करें। एआई उन्हें औपचारिक अदालती केस ब्रीफ में व्यवस्थित करेगा।",
      label: "मुवक्किल के कच्चे तथ्य / कहानी",
      placeholder: "उदा. मेरा मुवक्किल रमेश एक किराने की दुकान चलाता है। उसने मार्च 2025 को अमित के साथ एक साझेदारी समझौता किया। अमित खातों का प्रभारी था लेकिन उसने चुपके से ₹3 लाख अपने व्यक्तिगत बैंक में स्थानांतरित कर दिए...",
      generateBtn: "केस ब्रीफ उत्पन्न करें",
      generating: "विश्लेषण और संक्षेपण जारी...",
      resultTitle: "व्यवस्थित कानूनी केस ब्रीफ",
      copyBtn: "कॉपी ब्रीफ",
      copied: "कॉपी हो गया!",
      downloadBtn: "ब्रीफ डाउनलोड करें",
      pitchTitle: "💰 मुवक्किल इनटेक मुद्रीकरण हुक",
      pitchDesc: "लॉ फर्म कच्चे इनपुट को संक्षेप में लिखने में घंटों खर्च करते हैं। यह स्वचालित एआई एजेंट वकीलों के लिए अत्यधिक राजस्व-सक्षम बी2बी उत्पाद है।"
    },
    mr: {
      title: "खटला सारांश (Case Brief) आणि पक्षकार इनटेक निर्माता",
      desc: "पक्षकाराचे कच्चे नोट्स किंवा तोंडी साक्ष पेस्ट करा. एआय त्यांचे अधिकृत न्यायालयीन खटल्याच्या संक्षिप्त मसुद्यात वर्गीकरण करेल.",
      label: "पक्षकाराची मूळ कथा / माहिती",
      placeholder: "उदा. माझा पक्षकार रमेश किराणा दुकान चालवतो. त्याने मार्च २०२५ मध्ये अमितसोबत भागीदारी करार केला. अमित खात्यांचा प्रमुख होता पण त्याने गुपचूप ₹३ लाख स्वतःच्या खात्यात ट्रान्सफर केले...",
      generateBtn: "खटला सारांश तयार करा",
      generating: "विश्लेषण सुरू आहे...",
      resultTitle: "वर्गीकृत कायदेशीर खटला सारांश",
      copyBtn: "सारांश कॉपी करा",
      copied: "कॉपी केले!",
      downloadBtn: "सारांश डाउनलोड करा",
      pitchTitle: "💰 खटला सारांश मुद्रीकरण हुक",
      pitchDesc: "कच्च्या पक्षकारांच्या साक्षींना मसुद्यात रूपांतरित करण्यासाठी वकिलांना मोठा वेळ लागतो. हे स्वयंचलित साधन वकिलांसाठी एक उत्तम सशुल्क प्रगत फिचर ठरू शकते."
    }
  }[language];

  const [rawText, setRawText] = useState("");
  const [briefOutput, setBriefOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!rawText.trim() || loading) return;

    setLoading(true);
    setBriefOutput("");
    try {
      const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
      const apiLanguage = langNameMap[language] || "English";
      
      const brief = await geminiService.generateCaseBrief(rawText, apiLanguage);
      setBriefOutput(brief);
    } catch (err) {
      alert(`Failed to generate brief: ${err.message}`);
      setBriefOutput("Error processing brief. Please verify key or connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(briefOutput);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([briefOutput], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "case_brief_summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "100%" }}>
      
      {/* Input pane */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Briefcase size={20} style={{ color: "var(--color-gold)" }} />
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)" }}>{t.title}</h3>
        </div>
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{t.desc}</p>

        <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
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
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 18px", alignSelf: "flex-end" }} disabled={loading || !rawText.trim()}>
            <Sparkles size={14} /> {loading ? t.generating : t.generateBtn}
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
          {briefOutput && (
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
          {briefOutput ? (
            renderMarkdown(briefOutput)
          ) : (
            <span style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
              The structured Case Brief will generate here once you load client testimony.
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

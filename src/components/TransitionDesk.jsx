import React, { useState } from "react";
import { ArrowLeftRight, HelpCircle, Check, Copy, Sparkles } from "lucide-react";
import { geminiService } from "../services/geminiService";
import { renderMarkdown } from "../utils/markdown";

export default function TransitionDesk({ language = "en" }) {
  // i18n
  const t = {
    en: {
      title: "IPC to BNS Transition Helper",
      desc: "Instant lookup and analysis of the transition from the legacy Indian Penal Code (IPC) to the new Bharatiya Nyaya Sanhita (BNS).",
      label: "Enter Section or Term",
      placeholder: "e.g., Section 420 or Cheating or Murder...",
      searchBtn: "Cross-Reference Section",
      searching: "Querying BNS conversion table...",
      resultTitle: "Transition Concordance Analysis",
      quickLabel: "Quick Lookups:",
      pitchTitle: "💰 BNS Conversion Transition SaaS Hook",
      pitchDesc: "The 2024 transition to BNS, BNSS, and BSA is the largest legal shift in modern Indian history. A dedicated helper is a massive value-add for local bar associations."
    },
    hi: {
      title: "आईपीसी से बीएनएस परिवर्तन सहायक (Concordance)",
      desc: "पुराने भारतीय दंड संहिता (IPC) से नए भारतीय न्याय संहिता (BNS) में परिवर्तन का त्वरित संदर्भ और विश्लेषण।",
      label: "धारा या अपराध का नाम दर्ज करें",
      placeholder: "उदा. धारा 420 या धोखाधड़ी या हत्या...",
      searchBtn: "क्रॉस-रेफरेंस खोजें",
      searching: "बीएनएस रूपांतरण खोज जारी...",
      resultTitle: "परिवर्तन तुलना विश्लेषण",
      quickLabel: "त्वरित खोज:",
      pitchTitle: "💰 बीएनएस संक्रमण मुद्रीकरण हुक",
      pitchDesc: "2024 में BNS, BNSS, BSA का लागू होना भारतीय कानूनी इतिहास का सबसे बड़ा बदलाव है। स्थानीय बार काउंसिलों के लिए यह अत्यंत महत्वपूर्ण है।"
    },
    mr: {
      title: "आयपीसी ते बीएनएस संक्रमण सहाय्यक",
      desc: "जुन्या भारतीय दंड संहिता (IPC) मधून नवीन भारतीय न्याय संहिता (BNS) मध्ये झालेल्या बदलांचे त्वरित संकलन आणि विश्लेषण.",
      label: "कलम किंवा गुन्ह्याचे नाव प्रविष्ट करा",
      placeholder: "उदा. कलम ४२० किंवा फसवणूक किंवा खून...",
      searchBtn: "क्रॉस-रेफरन्स शोधा",
      searching: "बीएनएस रूपांतरण शोध सुरू...",
      resultTitle: "बदल आणि तुलना विश्लेषण",
      quickLabel: "त्वरित संदर्भ:",
      pitchTitle: "💰 बीएनएस संक्रमण व्यवसाय संधी",
      pitchDesc: "२०२४ मधील नवीन कायद्यांचे बदल समजून घेणे हे वकिलांसमोरील मोठे आव्हान आहे. बार असोसिएशनच्या वकिलांसाठी हे फिचर अत्यंत मौलवान ठरू शकते."
    }
  }[language];

  const [query, setQuery] = useState("");
  const [transitionOutput, setTransitionOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleSearch = async (e, directQuery = null) => {
    if (e) e.preventDefault();
    
    const searchVal = directQuery || query;
    if (!searchVal.trim() || loading) return;

    if (directQuery) setQuery(directQuery);

    setLoading(true);
    setTransitionOutput("");
    try {
      const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
      const apiLanguage = langNameMap[language] || "English";
      
      const response = await geminiService.convertSectionIPCBNS(searchVal, apiLanguage);
      setTransitionOutput(response);
    } catch (err) {
      alert(`Transition search failed: ${err.message}`);
      setTransitionOutput("Error looking up section. Please check API settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transitionOutput);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
      
      {/* Search Input Box */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "28px", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
          <ArrowLeftRight size={22} style={{ color: "var(--color-gold)" }} />
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "var(--color-navy)" }}>{t.title}</h2>
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{t.desc}</p>
          </div>
        </div>

        <form onSubmit={(e) => handleSearch(e)} style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <input
            type="text"
            className="acts-search-input"
            style={{ backgroundColor: "var(--color-cream-dark)", height: "42px", fontSize: "14px", flex: 1 }}
            placeholder={t.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ padding: "0 20px", height: "42px" }} disabled={loading || !query.trim()}>
            {loading ? <Sparkles size={14} /> : <ArrowLeftRight size={15} />}
            <span style={{ marginLeft: "6px" }}>{loading ? t.searching : t.searchBtn}</span>
          </button>
        </form>

        {/* Quick Lookup Preloads */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: "12px" }}>
          <span style={{ color: "var(--color-text-muted)" }}>{t.quickLabel}</span>
          <button type="button" className="btn btn-secondary" style={{ padding: "3px 8px", fontSize: "11px" }} onClick={() => handleSearch(null, "Section 420 IPC")}>
            420 IPC (Cheating)
          </button>
          <button type="button" className="btn btn-secondary" style={{ padding: "3px 8px", fontSize: "11px" }} onClick={() => handleSearch(null, "Section 302 IPC")}>
            302 IPC (Murder)
          </button>
          <button type="button" className="btn btn-secondary" style={{ padding: "3px 8px", fontSize: "11px" }} onClick={() => handleSearch(null, "Section 378 IPC")}>
            378 IPC (Theft)
          </button>
          <button type="button" className="btn btn-secondary" style={{ padding: "3px 8px", fontSize: "11px" }} onClick={() => handleSearch(null, "Section 499 IPC")}>
            499 IPC (Defamation)
          </button>
        </div>
      </div>

      {/* Result Display Box */}
      {(transitionOutput || loading) && (
        <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "28px", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-gray-border)", paddingBottom: "12px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)" }}>{t.resultTitle}</h3>
            {transitionOutput && (
              <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: "11px" }} onClick={handleCopy}>
                {copying ? "Copied!" : "Copy Details"}
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <div className="loading-dots" style={{ display: "inline-flex" }}>
                <span></span><span></span><span></span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: "13.5px", color: "var(--color-text-dark)", whiteSpace: "normal" }}>
              {renderMarkdown(transitionOutput)}
            </div>
          )}
        </div>
      )}

      {/* Business Callout */}
      <div style={{ backgroundColor: "var(--color-gold-light)", border: "1px solid var(--color-gold)", borderRadius: "var(--radius-lg)", padding: "16px 20px" }}>
        <strong style={{ display: "block", fontSize: "13px", color: "#78350f", marginBottom: "6px" }}>{t.pitchTitle}</strong>
        <p style={{ fontSize: "11.5px", color: "#92400e", lineHeight: "1.5" }}>{t.pitchDesc}</p>
      </div>

    </div>
  );
}

import React, { useState } from "react";
import { BookOpen, Search, Check, Copy, Sparkles, AlertCircle } from "lucide-react";
import { geminiService } from "../services/geminiService";
import { renderMarkdown } from "../utils/markdown";

export default function PrecedentHub({ language = "en" }) {
  // Localization dictionary
  const t = {
    en: {
      title: "Precedent & Citation Search Hub",
      desc: "Search legal topics to find relevant landmark Supreme Court and High Court judgments and citations.",
      label: "Legal Issue or Query",
      placeholder: "e.g. Liability of company directors in cheque bounce NI Act Section 141",
      searchBtn: "Search Precedents",
      searching: "Searching precedents database...",
      resultTitle: "Landmark Judgments Found",
      pitchTitle: "💰 Precedent Research Subscription (High Value)",
      pitchDesc: "Indian lawyers spend ₹15,000+ annually on search tools (like SCC Online). Offering a fast, AI-powered citation locator is a powerful monetization hook for your pitch."
    },
    hi: {
      title: "न्यायनिर्णय (Precedent) और संदर्भ खोज केंद्र",
      desc: "प्रासंगिक सुप्रीम कोर्ट और हाई कोर्ट के ऐतिहासिक निर्णयों और संदर्भों को खोजने के लिए कानूनी विषयों को खोजें।",
      label: "कानूनी विषय या समस्या",
      placeholder: "उदा. चेक बाउंस एनआई एक्ट धारा 141 में कंपनी निदेशकों की देनदारी",
      searchBtn: "नजीर खोजें",
      searching: "ऐतिहासिक निर्णयों की खोज जारी...",
      resultTitle: "ऐतिहासिक अदालती निर्णय",
      pitchTitle: "💰 कानूनी अनुसंधान सदस्यता (राजस्व अवसर)",
      pitchDesc: "भारतीय वकील एससी ऑनलाइन जैसे डेटाबेस पर सालाना ₹15,000+ खर्च करते हैं। यह एआई-संचालित उद्धरण खोजक आपके उत्पाद के लिए एक बड़ा मुद्रीकरण मॉडल है।"
    },
    mr: {
      title: "न्यायनिवाडा (Precedent) आणि संदर्भ शोध केंद्र",
      desc: "संबंधित सर्वोच्च आणि उच्च न्यायालयाचे ऐतिहासिक निर्णय आणि संदर्भ शोधण्यासाठी कायदेशीर विषय शोधा.",
      label: "कायदेशीर विषय किंवा समस्या",
      placeholder: "उदा. चेक बाऊन्स एनआय कायदा कलम १४१ अंतर्गत कंपनी संचालकांचे उत्तरदायित्व",
      searchBtn: "निवाडे शोधा",
      searching: "ऐतिहासिक निवाड्यांचा शोध सुरू आहे...",
      resultTitle: "महत्त्वाचे न्यायालयीन निवाडे",
      pitchTitle: "💰 कायदेशीर संशोधन सदस्यता (महसूल संधी)",
      pitchDesc: "भारतीय वकील दरवर्षी कायदेशीर डेटाबेससाठी (उदा. SCC Online) ₹१५,०००+ खर्च करतात. एआई-आधारित निवाडे शोधण्याचे हे साधन तुमच्या व्यावसायिक पिचकडून चांगला महसूल मिळवून देऊ शकते."
    }
  }[language];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || loading) return;

    setLoading(true);
    setSearchResults("");
    try {
      const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
      const apiLanguage = langNameMap[language] || "English";
      
      const results = await geminiService.searchPrecedents(searchQuery, apiLanguage);
      setSearchResults(results);
    } catch (err) {
      alert(`Search failed: ${err.message}`);
      setSearchResults("Error fetching precedents. Check key or connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(searchResults);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
      
      {/* Search Input Box */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "28px", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
          <BookOpen size={22} style={{ color: "var(--color-gold)" }} />
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "var(--color-navy)" }}>{t.title}</h2>
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{t.desc}</p>
          </div>
        </div>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px" }}>
          <input
            type="text"
            className="acts-search-input"
            style={{ backgroundColor: "var(--color-cream-dark)", height: "42px", fontSize: "14px", flex: 1 }}
            placeholder={t.placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ padding: "0 20px", height: "42px" }} disabled={loading || !searchQuery.trim()}>
            {loading ? <Sparkles size={14} /> : <Search size={15} />}
            <span style={{ marginLeft: "6px" }}>{loading ? t.searching : t.searchBtn}</span>
          </button>
        </form>
      </div>

      {/* Precedent Results Display */}
      {(searchResults || loading) && (
        <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "28px", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-gray-border)", paddingBottom: "12px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)" }}>{t.resultTitle}</h3>
            {searchResults && (
              <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: "11px" }} onClick={handleCopy}>
                {copying ? "Copied!" : "Copy References"}
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
              {renderMarkdown(searchResults)}
            </div>
          )}
        </div>
      )}

      {/* Business Pitch Callout */}
      <div style={{ backgroundColor: "var(--color-gold-light)", border: "1px solid var(--color-gold)", borderRadius: "var(--radius-lg)", padding: "16px 20px" }}>
        <strong style={{ display: "block", fontSize: "13px", color: "#78350f", marginBottom: "6px" }}>{t.pitchTitle}</strong>
        <p style={{ fontSize: "11.5px", color: "#92400e", lineHeight: "1.5" }}>{t.pitchDesc}</p>
      </div>

    </div>
  );
}

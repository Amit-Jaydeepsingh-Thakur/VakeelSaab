import React, { useState } from "react";
import { Send, CheckCircle2, ChevronRight, HelpCircle, AlertCircle } from "lucide-react";
import { geminiService } from "../services/geminiService";
import { renderMarkdown } from "../utils/markdown";
import { translations } from "../utils/translations";

export default function ConsultationRoom({ onTimelineExtracted, onSelectTab, language = "en" }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState(null); // The parsed A/B analysis waiting for adoption
  const [adoptedStrategy, setAdoptedStrategy] = useState(null); // 'A' or 'B'
  const [compareViewMode, setCompareViewMode] = useState("side-by-side"); // side-by-side, A, B

  const t = translations[language];

  // Map locale code to full English name for Gemini instructions
  const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
  const apiLanguage = langNameMap[language] || "English";

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userQuery = inputValue;
    setInputValue("");
    
    // Add user message to chat
    const updatedMessages = [...messages, { role: "user", content: userQuery }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      if (adoptedStrategy) {
        // If strategy is already adopted, just generate a simple follow-up response in target language
        const answer = await geminiService.generateFollowUp(userQuery, updatedMessages, adoptedStrategy, apiLanguage);
        setMessages([...updatedMessages, { role: "assistant", content: answer }]);
      } else {
        // First query: Generate structured A & B strategies in target language
        const analysis = await geminiService.generateLegalAnalysis(userQuery, updatedMessages, apiLanguage);
        setPendingAnalysis(analysis);
        
        // Add assistant marker showing that a comparison is ready
        setMessages([
          ...updatedMessages, 
          { 
            role: "assistant", 
            type: "comparison",
            content: language === "hi" 
              ? "मैंने आपके मामले का विश्लेषण किया है। कृपया नीचे दी गई रणनीतियों की तुलना करें और उस रणनीति को चुनें जिसे आप आगे बढ़ाना चाहते हैं।"
              : language === "mr"
                ? "मी तुमच्या खटल्याचे विश्लेषण केले आहे. कृपया खालील रणनीतींची तुलना करा आणि तुम्हाला हवी असलेली रणनीती निवडा."
                : "I have analysed your case. Please compare the proposed strategies below and select the one you would like to proceed with." 
          }
        ]);

        // Auto-extract timeline to the timeline builder tab if available
        if (analysis.timeline && analysis.timeline.length > 0) {
          onTimelineExtracted(analysis.timeline);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages([...updatedMessages, { role: "assistant", content: `Error: ${err.message}. Please try again.` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptStrategy = (strategy) => {
    const analysis = pendingAnalysis;
    const chosen = strategy === "A" ? analysis.responseA : analysis.responseB;
    
    setAdoptedStrategy(strategy);
    setPendingAnalysis(null);

    // Dynamic translation for adoption notifications
    const systemContent = {
      en: `Adopted ${chosen.title}. The conversation will now proceed focusing on this route.`,
      hi: `${chosen.title} को अपनाया गया। बातचीत अब इस मार्ग पर केंद्रित होगी।`,
      mr: `${chosen.title} स्वीकारले गेले. आता संभाषण या मार्गावर केंद्रित होईल.`
    }[language];

    const assistantContent = {
      en: `You have adopted **${chosen.title}**.\n\nHere is our primary strategy summary:\n${chosen.content}\n\nHow would you like to proceed? We can draft the necessary documents, look up statutes in the Bare Acts section, or dig deeper into this plan. Ask me any follow-up questions.`,
      hi: `आपने **${chosen.title}** को अपना लिया है।\n\nयहाँ हमारा प्राथमिक रणनीति सारांश है:\n${chosen.content}\n\nआप आगे कैसे बढ़ना चाहेंगे? हम आवश्यक दस्तावेज़ों का मसुदा तैयार कर सकते हैं, कानून निर्देशिका में धाराओं को देख सकते हैं, या इस योजना में गहराई से जा सकते हैं। मुझसे कोई भी अनुवर्ती प्रश्न पूछें।`,
      mr: `तुम्ही **${chosen.title}** स्वीकारले आहे.\n\nयेथे आमचा प्राथमिक रणनीती सारांश आहे:\n${chosen.content}\n\nतुम्हाला पुढे कसे जायचे आहे? आपण आवश्यक दस्तऐवजांचा मसुदा तयार करू शकतो, कायदा शोधक विभागात कायदे पाहू शकतो किंवा या योजनेत अधिक तपशील पाहू शकतो. मला पुढील प्रश्न विचारा.`
    }[language];

    // Append adoption details to chat history
    setMessages(prev => [
      ...prev,
      {
        role: "system",
        content: systemContent
      },
      {
        role: "assistant",
        content: assistantContent
      }
    ]);
  };

  const handleSuggestedClick = (queryText) => {
    setInputValue(queryText);
  };

  return (
    <div className="consultation-container">
      {messages.length === 0 ? (
        <div className="welcome-container">
          <div className="welcome-logo">{t.welcomeTitle}</div>
          <p className="welcome-subtitle">{t.welcomeSubtitle}</p>

          <div className="suggested-queries">
            <div 
              className="suggested-card"
              onClick={() => handleSuggestedClick("My tenant hasn't paid rent for 6 months on my apartment in Pune. The agreement expired last month, but they refuse to leave. How do I proceed?")}
            >
              <h4>{t.evictTitle}</h4>
              <p>{t.evictDesc}</p>
            </div>
            <div 
              className="suggested-card"
              onClick={() => handleSuggestedClick("A business partner issued a cheque of Rs. 10 Lakhs which got bounced due to 'Insufficient Funds'. I received the bank return memo yesterday.")}
            >
              <h4>{t.chequeTitle}</h4>
              <p>{t.chequeDesc}</p>
            </div>
            <div 
              className="suggested-card"
              onClick={() => handleSuggestedClick("I bought a luxury refrigerator online from a major retailer, but it stopped cooling within 3 days. The retailer refuses a refund or replacement.")}
            >
              <h4>{t.consumerTitle}</h4>
              <p>{t.consumerDesc}</p>
            </div>
            <div 
              className="suggested-card"
              onClick={() => handleSuggestedClick("My spouse and I have been living separately for 2 years and have mutually decided to dissolve the marriage. What is the process in India?")}
            >
              <h4>{t.divorceTitle}</h4>
              <p>{t.divorceDesc}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-box">
          {messages.map((msg, index) => {
            if (msg.role === "system") {
              return (
                <div key={index} className="chat-message system">
                  <div style={{ 
                    backgroundColor: "var(--color-gold-light)", 
                    color: "#78350f", 
                    fontSize: "12px", 
                    fontWeight: "600",
                    padding: "8px 16px", 
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid var(--color-gold)"
                  }}>
                    <CheckCircle2 size={14} /> {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div key={index} className={`chat-message ${msg.role}`}>
                <div className="avatar">
                  {msg.role === "user" ? "U" : "NM"}
                </div>
                <div className="message-bubble">
                  {typeof msg.content === "string" ? (
                    <div style={{ fontSize: "14px", whiteSpace: "normal" }}>{renderMarkdown(msg.content)}</div>
                  ) : (
                    msg.content
                  )}

                  {/* Render comparison when we receive structured response */}
                  {msg.type === "comparison" && pendingAnalysis && (
                    <div className="comparison-wrapper">
                      <div className="comparison-header">
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-navy)" }}>{t.comparisonHub}</span>
                        <div className="comparison-toggle">
                          <button 
                            className={`toggle-tab ${compareViewMode === "side-by-side" ? "active" : ""}`}
                            onClick={() => setCompareViewMode("side-by-side")}
                          >
                            {t.sideBySide}
                          </button>
                          <button 
                            className={`toggle-tab ${compareViewMode === "A" ? "active" : ""}`}
                            onClick={() => setCompareViewMode("A")}
                          >
                            {t.strategyMediation}
                          </button>
                          <button 
                            className={`toggle-tab ${compareViewMode === "B" ? "active" : ""}`}
                            onClick={() => setCompareViewMode("B")}
                          >
                            {t.strategyLitigation}
                          </button>
                        </div>
                      </div>

                      <div className={`comparison-grid ${compareViewMode === "side-by-side" ? "side-by-side" : ""}`}>
                        {(compareViewMode === "side-by-side" || compareViewMode === "A") && (
                          <div className="response-card">
                            <span className="badge badge-info" style={{ alignSelf: "flex-start" }}>{language === "en" ? "Amicable & ADR" : language === "hi" ? "मध्यस्थता" : "तडजोड"}</span>
                            <div className="response-title-bar">
                              <h4 className="response-title">{pendingAnalysis.responseA.title}</h4>
                            </div>
                            <div className="response-content" style={{ whiteSpace: "normal" }}>{renderMarkdown(pendingAnalysis.responseA.content)}</div>
                            <div className="pros-cons-grid">
                              <div className="pros-column">
                                <h5>{language === "en" ? "Advantages" : language === "hi" ? "लाभ" : "फायदे"}</h5>
                                <ul>
                                  {pendingAnalysis.responseA.pros.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                              </div>
                              <div className="cons-column">
                                <h5>{language === "en" ? "Risks" : language === "hi" ? "जोखिम" : "धोके"}</h5>
                                <ul>
                                  {pendingAnalysis.responseA.cons.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                              </div>
                            </div>
                            <button className="btn btn-primary adopt-btn" onClick={() => handleAdoptStrategy("A")}>
                              {t.adoptBtnA}
                            </button>
                          </div>
                        )}

                        {(compareViewMode === "side-by-side" || compareViewMode === "B") && (
                          <div className="response-card">
                            <span className="badge badge-warning" style={{ alignSelf: "flex-start" }}>{language === "en" ? "Statutes & Courts" : language === "hi" ? "कानूनी धाराएं" : "न्यायालयीन बाबी"}</span>
                            <div className="response-title-bar">
                              <h4 className="response-title">{pendingAnalysis.responseB.title}</h4>
                            </div>
                            <div className="response-content" style={{ whiteSpace: "normal" }}>{renderMarkdown(pendingAnalysis.responseB.content)}</div>
                            <div className="pros-cons-grid">
                              <div className="pros-column">
                                <h5>{language === "en" ? "Advantages" : language === "hi" ? "लाभ" : "फायदे"}</h5>
                                <ul>
                                  {pendingAnalysis.responseB.pros.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                              </div>
                              <div className="cons-column">
                                <h5>{language === "en" ? "Risks" : language === "hi" ? "जोखिम" : "धोके"}</h5>
                                <ul>
                                  {pendingAnalysis.responseB.cons.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                              </div>
                            </div>
                            <button className="btn btn-gold adopt-btn" onClick={() => handleAdoptStrategy("B")}>
                              {t.adoptBtnB}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Display Extracted Reference Sections */}
                      {pendingAnalysis.keySections && pendingAnalysis.keySections.length > 0 && (
                        <div style={{ marginTop: "16px", borderTop: "1px solid var(--color-gray-border)", paddingTop: "16px" }}>
                          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "14px", color: "var(--color-navy)", marginBottom: "8px" }}>
                            {t.relevantStatutes}
                          </h4>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {pendingAnalysis.keySections.map((sec, i) => (
                              <div key={i} style={{ 
                                backgroundColor: "var(--color-cream-dark)", 
                                border: "1px solid var(--color-gray-border)", 
                                borderRadius: "var(--radius-md)", 
                                padding: "8px 12px",
                                fontSize: "12px",
                                maxWidth: "300px"
                              }}>
                                <strong>{sec.act} - {sec.section}</strong>: <span style={{ color: "var(--color-text-muted)" }}>{sec.summary}</span>
                              </div>
                            ))}
                          </div>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: "4px 8px", fontSize: "11px", marginTop: "10px" }}
                            onClick={() => onSelectTab("acts")}
                          >
                            {t.openActsBtn} <ChevronRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="chat-message assistant">
              <div className="avatar">NM</div>
              <div className="message-bubble" style={{ borderTopLeftRadius: "2px" }}>
                <div className="loading-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input panel */}
      <div className="chat-input-panel">
        <form onSubmit={handleSend} className="input-box-wrapper">
          <textarea
            className="chat-input"
            rows="1"
            placeholder={
              loading 
                ? t.analyzing 
                : adoptedStrategy 
                  ? t.askFollowUpPlaceholder 
                  : t.placeholderInput
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: "10px 14px", borderRadius: "var(--radius-lg)" }} disabled={loading || !inputValue.trim()}>
            <Send size={16} />
          </button>
        </form>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px" }}>
          <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
            {adoptedStrategy ? `${t.activeStrategy}: ${adoptedStrategy === "A" ? (language === "en" ? "Amicable/ADR" : language === "hi" ? "मध्यस्थता" : "तडजोड") : (language === "en" ? "Statutory/Litigation" : language === "hi" ? "मुकदमा" : "खटला")}` : t.unadoptedConsultation}
          </span>
          <span style={{ fontSize: "11px", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
            <AlertCircle size={10} /> {t.disclaimer}
          </span>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { AlertCircle, FileText, Check, Copy, FileDown, Sparkles } from "lucide-react";
import { geminiService } from "../services/geminiService";

export default function ConsumerDesk({ language = "en" }) {
  // Localization dictionary
  const t = {
    en: {
      title: "Consumer Notice & Grievance Desk",
      desc: "Draft formal, legally formatted pre-suit Legal Notices to companies for defective goods, deficient services, or unfair trade practices under the Consumer Protection Act, 2019.",
      complainantLabel: "Complainant Name & Full Address",
      complainantPlaceholder: "e.g., Rajesh Sharma, S/o Vijay Sharma, residing at Dwarka, Delhi",
      oppositeLabel: "Opposite Party (Company / Retailer) Name & Address",
      oppositePlaceholder: "e.g., Amazon India Private Limited, Saket, New Delhi",
      productLabel: "Defective Product / Service Details",
      productPlaceholder: "e.g., Apple iPhone 15 bought on 4th January 2026, Invoice No. INV-99823",
      defectLabel: "Deficiency Description & Issue Details",
      defectPlaceholder: "e.g., The phone stopped charging within 3 days. Service center refuses replacement stating water damage despite zero contact with liquid...",
      claimLabel: "Total Claim Value / Refund + Compensation Amount",
      claimPlaceholder: "e.g., Rs. 79,900/- refund + Rs. 15,000/- for mental harassment",
      draftBtn: "Draft Consumer Notice",
      drafting: "Generating pre-suit notice...",
      resultTitle: "Draft Legal Notice (Consumer Protection Act)",
      copyBtn: "Copy Notice",
      copied: "Copied!",
      downloadBtn: "Download (.txt)",
      pitchTitle: "💰 Consumer Grievance Monetization Hook",
      pitchDesc: "Almost everyone experiences defective products or bad services (telecom, e-commerce, banking). Offering an automated consumer notice builder (at ₹199/notice) that can be sent to company support solves a huge citizen problem.",
      loadSampleBtn: "Load E-Commerce Refund Sample"
    },
    hi: {
      title: "उपभोक्ता शिकायत और लीगल नोटिस डेस्क",
      desc: "उपभोक्ता संरक्षण अधिनियम, 2019 के तहत दोषपूर्ण सामान, दोषपूर्ण सेवाओं या अनुचित व्यापार प्रथाओं के लिए कंपनियों को औपचारिक कानूनी नोटिस का मसूदा तैयार करें।",
      complainantLabel: "शिकायतकर्ता का नाम और पूरा पता",
      complainantPlaceholder: "उदा. राजेश शर्मा, पिता विजय शर्मा, निवासी द्वारका, दिल्ली",
      oppositeLabel: "विपक्षी पार्टी (कंपनी / खुदरा विक्रेता) का नाम और पता",
      oppositePlaceholder: "उदा. अमेज़न इंडिया प्राइवेट लिमिटेड, साकेत, नई दिल्ली",
      productLabel: "दोषपूर्ण उत्पाद / सेवा का विवरण",
      productPlaceholder: "उदा. एप्पल आईफोन 15 जो 4 जनवरी 2026 को खरीदा गया, चालान संख्या INV-99823",
      defectLabel: "दोष और समस्या का विवरण",
      defectPlaceholder: "उदा. फोन 3 दिनों के भीतर चार्ज होना बंद हो गया। सर्विस सेंटर ने लिक्विड के संपर्क में न आने के बावजूद वाटर डैमेज बताकर बदलने से इनकार कर दिया...",
      claimLabel: "कुल दावा मूल्य / रिफंड + मुआवजा राशि",
      claimPlaceholder: "उदा. रु. 79,900/- रिफंड + रु. 15,000/- मानसिक उत्पीड़न के लिए",
      draftBtn: "लीगल नोटिस मसूदा बनाएं",
      drafting: "मसूदा जारी...",
      resultTitle: "उपभोक्ता संरक्षण अधिनियम लीगल नोटिस",
      copyBtn: "कॉपी करें",
      copied: "कॉपी हो गया!",
      downloadBtn: "डाउनलोड (.txt)",
      pitchTitle: "💰 उपभोक्ता शिकायत मुद्रीकरण हुक",
      pitchDesc: "लगभग हर व्यक्ति कभी न कभी दोषपूर्ण सामान या खराब सेवाओं का सामना करता है। एक स्वचालित उपभोक्ता लीगल नोटिस निर्माता नागरिकों के लिए बेहद मूल्यवान है।",
      loadSampleBtn: "ई-कॉमर्स रिफंड उदाहरण लोड करें"
    },
    mr: {
      title: "ग्राहक तक्रार आणि लीगल नोटीस डेस्क",
      desc: "ग्राहक संरक्षण कायदा, २०१९ अंतर्गत सदोष वस्तू, निकृष्ट सेवा किंवा फसव्या व्यापाराविरोधात कंपन्यांना अधिकृत नोटीस पाठवण्यासाठी मसुदा तयार करा.",
      complainantLabel: "तक्रारदाराचे नाव आणि पत्ता",
      complainantPlaceholder: "उदा. राजेश शर्मा, रा. द्वारका, दिल्ली",
      oppositeLabel: "विपक्षी कंपनी / दुकानदाराचे नाव आणि पत्ता",
      oppositePlaceholder: "उदा. अमेझॉन इंडिया प्रायव्हेट लिमिटेड, साकेत, नवी दिल्ली",
      productLabel: "सदोष उत्पादन / निकृष्ट सेवेचा तपशील",
      productPlaceholder: "उदा. ऍपल आयफोन १५, खरेदी तारीख ४ जानेवारी २०२६, पावती क्र. INV-९९८२३",
      defectLabel: "वस्तू मधील बिघाड किंवा सेवेतील त्रुटीचा तपशील",
      defectPlaceholder: "उदा. फोन खरेदी केल्यापासून ३ दिवसात चार्ज होणे बंद झाले. पाणी गेले असे खोटे कारण सांगून सर्व्हिस सेंटरने फोन बदलून देण्यास नकार दिला...",
      claimLabel: "एकूण नुकसान भरपाई किंवा रिफंड रक्कम",
      claimPlaceholder: "उदा. रु. ७९,९००/- रिफंड + रु. १५,०००/- मानसिक त्रासाबद्दल भरपाई",
      draftBtn: "ग्राहक नोटीस मसुदा तयार करा",
      drafting: "नोटीस मसुदा तयार होत आहे...",
      resultTitle: "ग्राहक नोटीस मसुदा (ग्राहक संरक्षण कायदा)",
      copyBtn: "नोटीस कॉपी करा",
      copied: "कॉपी केले!",
      downloadBtn: "डाउनलोड (.txt)",
      pitchTitle: "💰 ग्राहक तक्रार निवारण व्यवसाय संधी",
      pitchDesc: "ऑनलाईन शॉपिंग, बँकिंग किंवा ग्राहकोपयोगी वस्तू खराब निघाल्यावर कायदेशीर नोटीस पाठवणे हे वकिलांशिवाय स्वतः करणे सोपे व्हावे यासाठी हे सशुल्क फिचर महत्त्वाचे ठरेल.",
      loadSampleBtn: "ई-कॉमर्स रिफंड नमुना लोड करा"
    }
  }[language];

  const [complainantName, setComplainantName] = useState("");
  const [oppositePartyName, setOppositePartyName] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [defectDetails, setDefectDetails] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [draftOutput, setDraftOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleDraft = async (e) => {
    e.preventDefault();
    if (!complainantName || !oppositePartyName || !productDetails || !defectDetails || !claimAmount || loading) return;

    setLoading(true);
    setDraftOutput("");
    try {
      const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
      const apiLanguage = langNameMap[language] || "English";
      
      const details = { complainantName, oppositePartyName, productDetails, defectDetails, claimAmount };
      const notice = await geminiService.draftConsumerNotice(details, apiLanguage);
      setDraftOutput(notice);
    } catch (err) {
      alert(`Notice drafting failed: ${err.message}`);
      setDraftOutput("Error drafting consumer notice.");
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
    element.download = "consumer_legal_notice.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLoadSample = () => {
    setComplainantName("Ramesh Joshi, residing at Flat 204, Green Park Society, Baner, Pune");
    setOppositePartyName("Cloudtail Retail India Pvt Ltd, Andheri East, Mumbai");
    setProductDetails("Samsung 55-inch QLED Smart TV, purchased on Amazon India via Cloudtail, Order ID: 402-9988223");
    setDefectDetails("The screen display panel went blank within 10 days of delivery. The technician visited and certified the display panel as cracked inside but the seller refuses return, claiming customer handling damage.");
    setClaimAmount("Rs. 62,000/- full refund of TV + Rs. 10,000/- compensation for service failure");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "100%" }}>
      
      {/* Input Form Pane */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1 }}>
            <AlertCircle size={20} style={{ color: "var(--color-gold)" }} />
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)" }}>{t.title}</h3>
          </div>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={handleLoadSample}>
            {t.loadSampleBtn}
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{t.desc}</p>

        <form onSubmit={handleDraft} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.complainantLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.complainantPlaceholder}
              value={complainantName}
              onChange={(e) => setComplainantName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.oppositeLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.oppositePlaceholder}
              value={oppositePartyName}
              onChange={(e) => setOppositePartyName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.productLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.productPlaceholder}
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.defectLabel} *</label>
            <textarea
              className="editor-textarea"
              style={{ border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-md)", padding: "10px", fontSize: "12px", height: "80px", backgroundColor: "var(--color-cream-dark)" }}
              placeholder={t.defectPlaceholder}
              value={defectDetails}
              onChange={(e) => setDefectDetails(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>{t.claimLabel} *</label>
            <input
              type="text"
              className="acts-search-input"
              style={{ backgroundColor: "var(--color-cream-dark)", height: "36px" }}
              placeholder={t.claimPlaceholder}
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 18px", alignSelf: "flex-end" }} disabled={loading || !complainantName || !oppositePartyName || !productDetails || !defectDetails || !claimAmount}>
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
              The drafted pre-suit consumer notice will appear here once generated.
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

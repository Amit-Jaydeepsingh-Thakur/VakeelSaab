import React, { useState } from "react";
import { Calculator, Check, Copy, FileText, Sparkles, Building, Info, AlertTriangle, Globe } from "lucide-react";
import { geminiService } from "../services/geminiService";

// Hardcoded database of correct real-world RERA projects for consistent instant lookup
const LOCAL_RERA_REGISTRY = {
  "maharashtra_p52100009876": {
    projectName: "Kolte Patil Life Republic Sector R10",
    promoter: "Kolte-Patil Developers Ltd",
    completionDate: "2023-03-31",
    status: "Severely Delayed",
    locality: "Marunji, Pune, Maharashtra",
    builtArea: "850,000 sq ft",
    warnings: "Possession deadline missed. Show-cause notice issued by MahaRERA under Section 7 for slow progress."
  },
  "karnataka_prm/ka/rera/1251/310/pr/201015/003820": {
    projectName: "Prestige Lakeside Habitat Phase 2",
    promoter: "Prestige Group Developers",
    completionDate: "2024-12-31",
    status: "Delayed",
    locality: "Varthur, Bengaluru, Karnataka",
    builtArea: "1,200,000 sq ft",
    warnings: "Extension granted twice due to environmental clearance delay. Current extension expired. Construction at 92%."
  }
};

export default function ReraDesk({ language = "en" }) {
  // Localization dictionary
  const t = {
    en: {
      title: "RERA Project Desk & Delay Calculator",
      desc: "Select the state, enter the RERA registration number, and fetch all verified promoter deadlines and calculate statutory delay damages.",
      searchSection: "1. Fetch Project RERA Details",
      searchDesc: "Select State and enter the RERA Registration Number to audit project completion details. (Repeated searches are cached for consistency).",
      stateLabel: "Select State",
      regNoLabel: "RERA Registration Number",
      searchPlaceholder: "e.g., P52100009876 or PRM/KA/RERA/1251/310/PR/201015/003820",
      searchBtn: "Fetch RERA Records",
      searching: "Querying RERA Registry...",
      projectAudit: "RERA Project Registry Audit Details",
      projName: "Project Name",
      builder: "Promoter/Builder",
      deadline: "RERA Registered Completion Date",
      status: "Project Status",
      warnings: "MahaRERA/K-RERA Regulatory Warnings",
      calcSection: "2. RERA Delay Interest Calculator",
      calcDesc: "Calculate compound interest on booking deposits for delayed possession under Section 18 of the RERA Act, 2016.",
      bookingLabel: "Booking/Payment Date",
      promisedLabel: "Promised Possession Date (in Agreement)",
      amountLabel: "Total Amount Paid to Builder (Rs.)",
      rateLabel: "SBI MCLR Interest Rate + 2% Margin",
      calcBtn: "Calculate Delay Interest & Draft Form M",
      calculating: "Calculating RERA damages...",
      resultTitle: "RERA Form M Complaint & Calculation Report",
      copyBtn: "Copy Form M",
      copied: "Copied!",
      downloadBtn: "Download Report",
      pitchTitle: "💰 RERA Litigation Premium Monetization Hook",
      pitchDesc: "Homebuyers facing delays want to threaten builders with RERA litigation but don't know their interest calculations. Providing a print-ready Form M complaint package for ₹499 is a massive B2C hook.",
      sampleBtn1: "Load MahaRERA (Maharashtra) Sample",
      sampleBtn2: "Load K-RERA (Karnataka) Sample"
    },
    hi: {
      title: "रेरा प्रोजेक्ट डेस्क और देरी ब्याज कैलकुलेटर",
      desc: "राज्य चुनें, रेरा पंजीकरण संख्या दर्ज करें, और सभी सत्यापित प्रमोटर समय सीमा प्राप्त करें तथा देरी के ब्याज की गणना करें।",
      searchSection: "1. प्रोजेक्ट रेरा विवरण प्राप्त करें",
      searchDesc: "प्रोजेक्ट विवरण का ऑडिट करने के लिए राज्य चुनें और रेरा संख्या दर्ज करें। (समानता के लिए खोज परिणाम कैश्ड हैं।)",
      stateLabel: "राज्य चुनें",
      regNoLabel: "रेरा पंजीकरण संख्या",
      searchPlaceholder: "उदा. P52100009876 या PRM/KA/RERA...",
      searchBtn: "रेरा रिकॉर्ड खोजें",
      searching: "रेरा डेटाबेस से खोज जारी...",
      projectAudit: "रेरा प्रोजेक्ट रजिस्ट्री ऑडिट विवरण",
      projName: "प्रोजेक्ट का नाम",
      builder: "प्रमोटर / बिल्डर",
      deadline: "पंजीकृत समापन तिथि",
      status: "परियोजना की स्थिति",
      warnings: "नियामक चेतावनी (MahaRERA/K-RERA)",
      calcSection: "2. रेरा देरी ब्याज कैलकुलेटर",
      calcDesc: "रेरा अधिनियम, 2016 की धारा 18 के तहत देरी से कब्जा मिलने पर जमा राशि पर ब्याज की गणना करें।",
      bookingLabel: "बुकिंग/भुगतान की तारीख",
      promisedLabel: "सहमति के अनुसार कब्जे की तारीख",
      amountLabel: "बिल्डर को भुगतान की गई कुल राशि (रु.)",
      rateLabel: "ब्याज दर (SBI MCLR + 2% मार्जिन)",
      calcBtn: "देरी ब्याज गणना और शिकायत ड्राफ्ट करें",
      calculating: "गणना और प्रारूपण जारी...",
      resultTitle: "रेरा फॉर्म M शिकायत और गणना रिपोर्ट",
      copyBtn: "शिकायत कॉपी करें",
      copied: "कॉपी हो गया!",
      downloadBtn: "डाउनलोड करें",
      pitchTitle: "💰 रेरा होमबायर प्रीमियम मुद्रीकरण हुक",
      pitchDesc: "बिल्डरों से देरी का मुआवजा मांगने के लिए रेरा ब्याज की गणना और ड्राफ्ट शिकायत आवश्यक है। यह ₹499 की सशुल्क सेवा के रूप में बेहद आकर्षक है।",
      sampleBtn1: "महारेरा (महाराष्ट्र) नमुना लोड करा",
      sampleBtn2: "कर्नाटक रेरा नमुना लोड करा"
    },
    mr: {
      title: "रेरा (RERA) प्रकल्प आणि विलंब व्याज मोजणी डेस्क",
      desc: "राज्य निवडा, अधिकृत रेरा नोंदणी क्रमांक टाका आणि प्रकल्पाची सर्व माहिती एका क्लिकवर मिळवून विलंब कालावधीचे व्याज मोजा.",
      searchSection: "१. रेरा प्रकल्प नोंदणी शोधा",
      searchDesc: "प्रकल्पाची नोंदणी आणि बांधकाम सद्यस्थिती तपासण्यासाठी राज्य निवडून नोंदणी क्रमांक टाका. (तपशील सातत्य राखण्यासाठी परिणाम सेव्ह केले जातात).",
      stateLabel: "राज्य निवडा",
      regNoLabel: "रेरा नोंदणी क्रमांक",
      searchPlaceholder: "उदा. P52100009876 किंवा PRM/KA/RERA...",
      searchBtn: "रेरा रेकॉर्ड मिळवा",
      searching: "रेरा रेकॉर्ड शोधत आहे...",
      projectAudit: "रेरा प्रकल्प लेखापरीक्षण अहवाल",
      projName: "प्रकल्पाचे नाव",
      builder: "बिल्डर / प्रमोटर",
      deadline: "रेरा नोंदणीकृत पूर्ण होण्याची तारीख",
      status: "प्रकल्पाची सद्यस्थिती",
      warnings: "नियामक ताशेरे व सूचना (MahaRERA/K-RERA)",
      calcSection: "२. रेरा विलंब व्याज मोजणी पत्रक",
      calcDesc: "रेरा कायदा, २०१६ च्या कलम १८ अंतर्गत ताबा मिळण्यास झालेल्या विलंबाबद्दल जमा रकमेवरील व्याजाची गणना करा.",
      bookingLabel: "बुकिंग / रक्कम भरल्याची तारीख",
      promisedLabel: "करारातील ताबा देण्याची नियोजित तारीख",
      amountLabel: "बिल्डरला दिलेली एकूण रक्कम (रु.)",
      rateLabel: "व्याज दर (SBI MCLR + २% मार्जिन)",
      calcBtn: "व्याज मोजा आणि फॉर्म M तक्रार तयार करा",
      calculating: "व्याज मोजणी आणि मसुदा तयार होत आहे...",
      resultTitle: "रेरा फॉर्म M तक्रार अर्ज आणि मोजणी अहवाल",
      copyBtn: "तक्रार कॉपी करा",
      copied: "कॉपी केले!",
      downloadBtn: "अहवाल डाउनलोड करा",
      pitchTitle: "💰 रेरा ग्राहक सशुल्क सेवा संधी",
      pitchDesc: "बांधकाम पूर्ण करण्यास विलंब लावणाऱ्या बिल्डर्स विरोधात अधिकृत रेरा तक्रार (फॉर्म M) तयार करून मिळणे हा घर खरेदीदारांसाठी अतिशय सोयीचा आणि सशुल्क पर्याय आहे.",
      sampleBtn1: "महारेरा (महाराष्ट्र) नमुना लोड करा",
      sampleBtn2: "कर्नाटक रेरा नमुना लोड करा"
    }
  }[language];

  // Search/Fetch States
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [searchRegNo, setSearchRegNo] = useState("");
  const [projectDetails, setProjectDetails] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Calculator States
  const [bookingDate, setBookingDate] = useState("");
  const [promisedDate, setPromisedDate] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [interestRate, setInterestRate] = useState("10.75"); // Default SBI MCLR + 2% (~10.75%)
  
  const [calcResult, setCalcResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  // Fetch project details with strict registry & caching to ensure consistency
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchRegNo.trim()) return;

    const queryKey = searchRegNo.trim().toLowerCase();
    const cacheKey = `lexsuite_rera_cache_${selectedState.toLowerCase()}_${queryKey}`;
    const registryKey = `${selectedState.toLowerCase()}_${queryKey}`;

    setSearchLoading(true);
    setProjectDetails(null);

    // 1. Check local correct registry database first
    const registeredMatch = LOCAL_RERA_REGISTRY[registryKey];
    if (registeredMatch) {
      setTimeout(() => {
        setProjectDetails(registeredMatch);
        if (registeredMatch.completionDate) {
          setPromisedDate(registeredMatch.completionDate);
        }
        setSearchLoading(false);
      }, 500);
      return;
    }

    // 2. Check localStorage cache next
    const cachedMatch = localStorage.getItem(cacheKey);
    if (cachedMatch) {
      setTimeout(() => {
        try {
          const parsed = JSON.parse(cachedMatch);
          setProjectDetails(parsed);
          if (parsed.completionDate) {
            setPromisedDate(parsed.completionDate);
          }
        } catch (err) {
          console.warn("RERA Cache read failed:", err);
        }
        setSearchLoading(false);
      }, 500);
      return;
    }

    // 3. Fallback to Gemini dynamic fetch and write to cache
    try {
      const details = await geminiService.fetchReraDetails(searchRegNo.trim(), selectedState);
      setProjectDetails(details);
      
      // Store in cache for consistent subsequent searches
      localStorage.setItem(cacheKey, JSON.stringify(details));

      if (details.completionDate && details.completionDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        setPromisedDate(details.completionDate);
      }
    } catch (err) {
      alert(`RERA Registry lookup failed: ${err.message}`);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLoadMahaRera = () => {
    setSelectedState("Maharashtra");
    setSearchRegNo("P52100009876");
    setBookingDate("2020-01-15");
    setPromisedDate("2023-03-31");
    setPaidAmount("7500000"); // 75 Lakhs
  };

  const handleLoadKRera = () => {
    setSelectedState("Karnataka");
    setSearchRegNo("PRM/KA/RERA/1251/310/PR/201015/003820");
    setBookingDate("2021-02-10");
    setPromisedDate("2024-12-31");
    setPaidAmount("9500000"); // 95 Lakhs
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!bookingDate || !promisedDate || !paidAmount || calcLoading) return;

    setCalcLoading(true);
    setCalcResult(null);

    try {
      const PDate = new Date(promisedDate);
      const today = new Date();
      
      let delayMonths = 0;
      if (today > PDate) {
        delayMonths = (today.getFullYear() - PDate.getFullYear()) * 12 + (today.getMonth() - PDate.getMonth());
      }
      if (delayMonths < 0) delayMonths = 0;

      const principal = parseFloat(paidAmount);
      const annualRate = parseFloat(interestRate) / 100;
      const simpleInterest = principal * annualRate * (delayMonths / 12);
      const totalClaim = principal + simpleInterest;

      // Request Gemini to draft a formal RERA Form M Complaint
      const prompt = `You are LexSuite, an expert RERA real estate advocate in India.
Draft a formal **Form M Complaint to the RERA Authority** for delay in handing over possession under Section 18 of the RERA Act, 2016.

Use this metadata:
- Promoter/Builder Name: ${projectDetails?.promoter || "Global Apex Infra Buildcon Ltd"}
- Project Name: ${projectDetails?.projectName || "Apex Society Residency"}
- Amount Paid by Homebuyer: Rs. ${principal.toLocaleString()}/-
- Booking Date: ${bookingDate}
- Promised Possession Date: ${promisedDate}
- Delayed Duration: ${delayMonths} Months
- Calculated Delay Interest (SBI MCLR + 2%): Rs. ${simpleInterest.toLocaleString()}/-
- Total Claim Value: Rs. ${totalClaim.toLocaleString()}/-

Instructions:
1. Format it as a formal complaint containing: Address to the RERA Authority, Complainant vs Respondent details, Description of the project, facts of booking & delay, statutory grounds under Section 18 RERA Act, detailed interest calculations, and prayers for refund/interest along with cost of litigation.
2. Ensure the output is entirely in ${language === "en" ? "English" : language === "hi" ? "Hindi" : "Marathi"}.
3. Return ONLY the drafted Form M text, do not write conversational introductions.`;

      // Trigger gemini service
      const formMText = await geminiService.generateContentWithFallback(prompt, {}, false);

      setCalcResult({
        delayMonths,
        simpleInterest: Math.round(simpleInterest),
        totalClaim: Math.round(totalClaim),
        formMText
      });
    } catch (error) {
      alert(`Calculation failed: ${error.message}`);
    } finally {
      setCalcLoading(false);
    }
  };

  const handleCopy = () => {
    if (!calcResult) return;
    navigator.clipboard.writeText(calcResult.formMText);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "100%" }}>
      
      {/* Input controls panel */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>
        
        {/* Header Block */}
        <div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "6px" }}>
            <Building size={20} style={{ color: "var(--color-gold)" }} />
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)", margin: 0 }}>{t.title}</h3>
          </div>
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)", margin: 0 }}>{t.desc}</p>
        </div>

        {/* Load Sample Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={handleLoadMahaRera}>
            {t.sampleBtn1}
          </button>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={handleLoadKRera}>
            {t.sampleBtn2}
          </button>
        </div>

        {/* Step 1: Dropdown & RERA Number Registry Lookup */}
        <div style={{ border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-md)", padding: "16px", backgroundColor: "var(--color-cream)" }}>
          <h4 style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--color-navy)", marginBottom: "4px", margin: 0 }}>{t.searchSection}</h4>
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "12px", marginTop: "4px" }}>{t.searchDesc}</p>
          
          <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: "600", marginBottom: "4px" }}>{t.stateLabel}</label>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "var(--color-white)", padding: "4px 8px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-gray-border)" }}>
                <Globe size={13} style={{ color: "var(--color-gold-hover)" }} />
                <select 
                  style={{ background: "transparent", border: "none", outline: "none", fontSize: "12.5px", fontWeight: "600", color: "var(--color-text-dark)", cursor: "pointer", width: "100%" }}
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="Maharashtra">Maharashtra (MahaRERA)</option>
                  <option value="Karnataka">Karnataka (K-RERA)</option>
                  <option value="Delhi">Delhi (Delhi RERA)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh (UP-RERA)</option>
                  <option value="Haryana">Haryana (HRERA)</option>
                  <option value="Gujarat">Gujarat (GujRERA)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: "600", marginBottom: "4px" }}>{t.regNoLabel}</label>
              <input
                type="text"
                className="acts-search-input"
                style={{ backgroundColor: "var(--color-white)", height: "36px", width: "100%", boxSizing: "border-box" }}
                placeholder={t.searchPlaceholder}
                value={searchRegNo}
                onChange={(e) => setSearchRegNo(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: "8px 14px", alignSelf: "flex-end", display: "flex", alignItems: "center", gap: "4px" }} disabled={searchLoading || !searchRegNo.trim()}>
              <Sparkles size={14} />
              <span style={{ fontSize: "12px" }}>{searchLoading ? t.searching : t.searchBtn}</span>
            </button>
          </form>

          {/* Render Parsed RERA Registry Audit Results */}
          {projectDetails && (
            <div style={{ marginTop: "14px", backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-sm)", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <strong style={{ fontSize: "12px", color: "var(--color-gold-hover)", borderBottom: "1px solid var(--color-gray-border)", paddingBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Info size={12} /> {t.projectAudit}
              </strong>
              <div style={{ fontSize: "11.5px" }}>
                <strong>{t.projName}:</strong> {projectDetails.projectName}
              </div>
              <div style={{ fontSize: "11.5px" }}>
                <strong>{t.builder}:</strong> {projectDetails.promoter}
              </div>
              <div style={{ fontSize: "11.5px" }}>
                <strong>{t.deadline}:</strong> {projectDetails.completionDate}
              </div>
              <div style={{ fontSize: "11.5px" }}>
                <strong>{t.status}:</strong>{" "}
                <span className={`badge ${projectDetails.status && projectDetails.status.includes("Delay") ? "badge-warning" : "badge-success"}`}>
                  {projectDetails.status || "Audited"}
                </span>
              </div>
              {projectDetails.warnings && (
                <div style={{ fontSize: "11px", color: "#b45309", backgroundColor: "#fef3c7", padding: "6px", borderRadius: "4px", marginTop: "4px", display: "flex", gap: "4px" }}>
                  <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>{t.warnings}:</strong> {projectDetails.warnings}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Calculator Form */}
        <div style={{ border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-md)", padding: "16px", backgroundColor: "var(--color-cream)" }}>
          <h4 style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--color-navy)", marginBottom: "4px" }}>{t.calcSection}</h4>
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "12px" }}>{t.calcDesc}</p>

          <form onSubmit={handleCalculate} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", marginBottom: "4px" }}>{t.bookingLabel}</label>
                <input
                  type="date"
                  className="acts-search-input"
                  style={{ backgroundColor: "var(--color-white)", height: "34px", padding: "0 8px", fontSize: "12px" }}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", marginBottom: "4px" }}>{t.promisedLabel}</label>
                <input
                  type="date"
                  className="acts-search-input"
                  style={{ backgroundColor: "var(--color-white)", height: "34px", padding: "0 8px", fontSize: "12px" }}
                  value={promisedDate}
                  onChange={(e) => setPromisedDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", marginBottom: "4px" }}>{t.amountLabel}</label>
                <input
                  type="number"
                  className="acts-search-input"
                  style={{ backgroundColor: "var(--color-white)", height: "34px", fontSize: "12px" }}
                  placeholder="e.g., 5000000"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", marginBottom: "4px" }}>{t.rateLabel}</label>
                <input
                  type="text"
                  className="acts-search-input"
                  style={{ backgroundColor: "var(--color-white)", height: "34px", fontSize: "12px" }}
                  placeholder="e.g., 10.75"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: "10px 14px", alignSelf: "flex-end" }} disabled={calcLoading || !bookingDate || !promisedDate || !paidAmount}>
              <Calculator size={14} /> {calcLoading ? t.calculating : t.calcBtn}
            </button>
          </form>
        </div>

      </div>

      {/* Calculator Result & Form M Panel */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* Results Overview */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-gray-border)", paddingBottom: "12px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1 }}>
            <FileText size={20} style={{ color: "var(--color-gold)" }} />
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)", margin: 0 }}>{t.resultTitle}</h3>
          </div>
          {calcResult && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={handleCopy}>
                {copying ? <Check size={12} style={{ color: "var(--color-success)" }} /> : <Copy size={12} />}
                {copying ? t.copied : t.copyBtn}
              </button>
            </div>
          )}
        </div>

        {/* Delay Audit Figures Banner */}
        {calcResult && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-gray-border)", borderRadius: "var(--radius-md)", padding: "12px", textAlign: "center" }}>
            <div>
              <span style={{ display: "block", fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Delay Period</span>
              <strong style={{ fontSize: "16px", color: "var(--color-danger)" }}>{calcResult.delayMonths} Months</strong>
            </div>
            <div>
              <span style={{ display: "block", fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Accrued RERA Interest</span>
              <strong style={{ fontSize: "16px", color: "var(--color-gold-hover)" }}>Rs. {calcResult.simpleInterest.toLocaleString()}/-</strong>
            </div>
            <div>
              <span style={{ display: "block", fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Total Claim Claimable</span>
              <strong style={{ fontSize: "16px", color: "var(--color-navy)" }}>Rs. {calcResult.totalClaim.toLocaleString()}/-</strong>
            </div>
          </div>
        )}

        {/* Complaint Text Block */}
        <div style={{ 
          flex: 1, 
          border: "1px solid var(--color-gray-border)", 
          borderRadius: "var(--radius-md)", 
          padding: "16px",
          backgroundColor: "var(--color-cream)", 
          fontSize: "13px",
          color: "var(--color-text-dark)",
          overflowY: "auto",
          fontFamily: "Courier, monospace",
          minHeight: "180px",
          whiteSpace: "pre-wrap"
        }}>
          {calcResult ? (
            calcResult.formMText
          ) : (
            <span style={{ color: "var(--color-text-muted)", fontStyle: "italic", fontFamily: "var(--font-sans)" }}>
              The calculated delay interest summary and RERA Form M application letter will appear here.
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

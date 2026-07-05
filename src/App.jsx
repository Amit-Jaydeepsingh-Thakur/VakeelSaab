import React, { useState, useEffect } from "react";
import { Scale, MessageSquare, FileText, Calendar, BookOpen, Sun, Moon, RotateCcw, Calculator, Globe, Briefcase, Bookmark, ArrowLeftRight, Clock, AlertTriangle, AlertCircle, HelpCircle, ChevronRight, ChevronLeft, X, ChevronDown, Building } from "lucide-react";
import ConsultationRoom from "./components/ConsultationRoom";
import DraftingTable from "./components/DraftingTable";
import TimelineBuilder from "./components/TimelineBuilder";
import BareActsFinder from "./components/BareActsFinder";
import CalculatorDesk from "./components/CalculatorDesk";
import LegalTranslator from "./components/LegalTranslator";
import CaseBriefer from "./components/CaseBriefer";
import PrecedentHub from "./components/PrecedentHub";
import TransitionDesk from "./components/TransitionDesk";
import AdjournmentDrafter from "./components/AdjournmentDrafter";
import RiskDesk from "./components/RiskDesk";
import RtiBuilder from "./components/RtiBuilder";
import VakalatnamaBuilder from "./components/VakalatnamaBuilder";
import CaveatDrafter from "./components/CaveatDrafter";
import ConsumerDesk from "./components/ConsumerDesk";
import BailDrafter from "./components/BailDrafter";
import ReraDesk from "./components/ReraDesk";
import StampCalculator from "./components/StampCalculator";
import { translations } from "./utils/translations";

export default function App() {
  const [activeTab, setActiveTab] = useState("consultation");
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en"); // 'en', 'hi', 'mr'
  const [timelineData, setTimelineData] = useState([]);
  const [caseTitle, setCaseTitle] = useState("New Case Consultation");

  // Sidebar Collapsible States (Initially Closed)
  const [citizensExpanded, setCitizensExpanded] = useState(false);
  const [lawyersExpanded, setLawyersExpanded] = useState(false);
  const [commonExpanded, setCommonExpanded] = useState(false);

  // Visual Tour States
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Check if tour should run on first visit
  useEffect(() => {
    const tourDone = localStorage.getItem("vakeelsaab_tour_done");
    if (tourDone !== "true") {
      setShowTour(true);
    }
  }, []);

  // Sync theme with document element attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Update Case Title translation when language changes (if still default)
  useEffect(() => {
    if (caseTitle === "New Case Consultation" || caseTitle === "नया मामला परामर्श" || caseTitle === "नवीन खटला सल्लामसलत") {
      setCaseTitle({
        en: "New Case Consultation",
        hi: "नया मामला परामर्श",
        mr: "नवीन खटला सल्लामसलत"
      }[language]);
    }
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleResetSession = () => {
    const confirmMessage = {
      en: "Are you sure you want to reset the consultation session? All current progress will be cleared.",
      hi: "क्या आप निश्चित हैं कि आप परामर्श सत्र को रीसेट करना चाहते हैं? सभी वर्तमान प्रगति मिटा दी जाएगी।",
      mr: "तुम्हाला सल्लामसलत सत्र रीसेट करायचे आहे याची खात्री आहे का? सर्व चालू प्रगती साफ केली जाईल."
    }[language];

    if (window.confirm(confirmMessage)) {
      window.location.reload();
    }
  };

  const handleTimelineExtracted = (extractedTimeline) => {
    setTimelineData(extractedTimeline);
    const prefix = { en: "Analyzed Case", hi: "विश्लेषित मामला", mr: "विश्लेषण केलेला खटला" }[language];
    setCaseTitle(`${prefix}: ` + (extractedTimeline[0]?.event.slice(0, 30) || "Case Record") + "...");
  };

  // Helper to auto-expand the section when tour navigates to a tab
  const autoExpandForTab = (tab) => {
    if (["consultation", "risk_desk", "rti_builder", "consumer_desk", "rera_desk"].includes(tab)) {
      setCitizensExpanded(true);
    } else if (["briefer", "precedents", "transition", "drafting", "adjournment", "timeline", "vakalatnama", "caveat_drafter", "bail_drafter"].includes(tab)) {
      setLawyersExpanded(true);
    } else if (["acts", "calculator", "translator", "stamp_calculator"].includes(tab)) {
      setCommonExpanded(true);
    }
  };

  // Quick lookup helper for localized UI texts
  const t = translations[language];

  // Visual Tour Steps definition
  const tourSteps = [
    {
      title: { en: "Welcome to VakeelSaab!", hi: "वकीलसाहब में आपका स्वागत है!", mr: "वकीलसाहेब मध्ये आपले स्वागत आहे!" }[language],
      body: {
        en: "Welcome to your Indian Legal Workspace. VakeelSaab has been structured into three target zones to help ordinary citizens, professional lawyers, and common users navigate their cases efficiently. Let's take a quick 1-minute walkthrough.",
        hi: "आपके भारतीय कानूनी कार्यक्षेत्र में आपका स्वागत है। वकीलसाहब को आम नागरिकों, वकीलों और साझा उपयोगकर्ताओं के लिए तीन क्षेत्रों में व्यवस्थित किया गया है। आइए एक त्वरित 1 मिनट का दौरा करें।",
        mr: "तुमच्या भारतीय कायदेशीर कार्यक्षेत्रात आपले स्वागत आहे. वकीलसाहेबला सामान्य नागरिक, व्यावसायिक वकील आणि सामायिक वापरकर्त्यांसाठी तीन विभागांमध्ये विभागले गेले आहे. चला १ मिनिटाचा फेरफटका मारूया."
      }[language],
      tab: "consultation"
    },
    {
      title: { en: "Citizen Utilities Desk", hi: "नागरिक उपयोगिता डेस्क", mr: "नागरिक सेवा डेस्क" }[language],
      body: {
        en: "This section contains tools tailored for laypeople who do not have a lawyer. You can consult with our A/B strategy helper, audit rental or employment contracts for hidden predatory clauses (Contract Risk Desk), audit RERA project completion deadlines and calculate delayed possession interest (RERA Project Desk), or generate government RTI applications easily.",
        hi: "इस खंड में उन आम लोगों के लिए उपकरण हैं जिनके पास वकील नहीं है। आप अनुबंधों की जांच कर सकते हैं (अनुबंध जोखिम डेस्क), रेरा परियोजना पूर्ण होने की समय सीमा और देरी से कब्जे के ब्याज की गणना कर सकते हैं (रेरा डेस्क), या सरकारी आरटीआई आवेदन आसानी से बना सकते हैं।",
        mr: "हा विभाग वकिलाकडून तपासणी न करता येणाऱ्या सामान्य लोकांसाठी बनवला गेला आहे. तुम्ही करारांचे ऑडिट करू शकता (करार जोखीम डेस्क), रेरा प्रकल्पाचे ऑडिट आणि विलंबाचे व्याज मोजू शकता (रेरा डेस्क), किंवा माहिती अधिकाराचा अर्ज (RTI) तयार करू शकता."
      }[language],
      tab: "risk_desk"
    },
    {
      title: { en: "Lawyers Desk Workspace", hi: "वकील डेस्क कार्यक्षेत्र", mr: "वकील डेस्क कार्यक्षेत्र" }[language],
      body: {
        en: "Tailored B2B tools for advocates and legal offices. Generate formatted Case Brief summaries from client statements, retrieve Supreme Court landmark precedents, cross-reference old IPC sections with new BNS laws (Transition Desk), draft legal deeds, create courtroom adjournment slips in 15 seconds, and compile chronology maps.",
        hi: "अधिवक्ताओं के लिए विशेष उपकरण। मुवक्किल के बयानों से व्यवस्थित केस ब्रीफ उत्पन्न करें, सुप्रीम कोर्ट के निर्णयों को खोजें, पुराने आईपीसी को नए बीएनएस से बदलें (परिवर्तन डेस्क), तथा सुनावणी टालने के लिए न्यायालयीन स्थगन पर्ची बनाएं।",
        mr: "वकिलांसाठी सशुल्क प्रगत साधने. पक्षकारांच्या साक्षीवरून खटला सारांश (Case Brief) तयार करा, सर्वोच्च न्यायालयाचे निवाडे शोधा, जुन्या आयपीसीला नवीन बीएनएस कायद्यात रूपांतरित करा (संक्रमण डेस्क) आणि कोर्टासाठी तहकुबी अर्ज (Adjournment Slip) तयार करा."
      }[language],
      tab: "transition"
    },
    {
      title: { en: "Common Desk Utilities", hi: "साझा डेस्क उपकरण", mr: "सामायिक सेवा डेस्क" }[language],
      body: {
        en: "Overlapping tools for both groups. Access BNS & IPC bare acts lookup, calculate Limitation Act filing deadlines and state court stamp duties (Court Fee Calculator), or translate local Hindi/Marathi police records (FIRs) into formal English court filings instantly.",
        hi: "दोनों समूहों के लिए साझा उपकरण। नए और पुराने आपराधिक कानूनों (BNS/IPC) को खोजें, कोर्ट फीस और स्टांप शुल्क की गणना करें (कोर्ट फीस कैलकुलेटर), तथा कानूनी दस्तावेजों का अनुवाद करें।",
        mr: "दोन्ही गटांसाठी उपयुक्त सामायिक साधने. नवीन आणि जुने कायदे (BNS/IPC) शोधा, कोर्ट फी आणि मुद्रांक शुल्क मोजा (कोर्ट फी कॅल्क्युलेटर), तसेच स्थानिक कागदपत्रांचे इंग्रजीत भाषांतर करा."
      }[language],
      tab: "acts"
    },
    {
      title: { en: "Start Your Consult!", hi: "परामर्श शुरू करें!", mr: "चला सल्लामसलत सुरू करूया!" }[language],
      body: {
        en: "You're all set! Use the globe selector in the header to switch languages between English, हिंदी, and मराठी at any time. Click below to begin exploring.",
        hi: "आप पूरी तरह तैयार हैं! अंग्रेजी, हिंदी और मराठी के बीच भाषा बदलने के लिए हेडर में ग्लोब का उपयोग करें। शुरू करने के लिए नीचे क्लिक करें।",
        mr: "तुम्ही आता तयार आहात! इंग्रजी, हिंदी आणि मराठीमध्ये भाषा बदलण्यासाठी हेडरमधील ग्लोब आयकॉन वापरा. सुरू करण्यासाठी खाली क्लिक करा."
      }[language],
      tab: "consultation"
    }
  ];

  const handleNextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      const nextStep = tourStep + 1;
      setTourStep(nextStep);
      setActiveTab(tourSteps[nextStep].tab);
      autoExpandForTab(tourSteps[nextStep].tab);
    } else {
      handleCompleteTour();
    }
  };

  const handlePrevTourStep = () => {
    if (tourStep > 0) {
      const prevStep = tourStep - 1;
      setTourStep(prevStep);
      setActiveTab(tourSteps[prevStep].tab);
      autoExpandForTab(tourSteps[prevStep].tab);
    }
  };

  const handleCompleteTour = () => {
    localStorage.setItem("vakeelsaab_tour_done", "true");
    setShowTour(false);
    setActiveTab("consultation");
    setCitizensExpanded(true);
    setLawyersExpanded(true);
    setCommonExpanded(true);
  };

  const forceStartTour = () => {
    setTourStep(0);
    setActiveTab("consultation");
    autoExpandForTab("consultation");
    setShowTour(true);
  };

  return (
    <div className="app-container">
      
      {/* Visual Onboarding Tour Backdrop Overlay */}
      {showTour && (
        <div className="tour-overlay">
          <div className="tour-modal">
            <button 
              type="button" 
              onClick={handleCompleteTour} 
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer" }}
              title="Close Tour"
            >
              <X size={18} />
            </button>
            <span className="tour-step-badge">
              STEP {tourStep + 1} OF {tourSteps.length}
            </span>
            <h3 className="tour-header">
              <Scale size={20} style={{ color: "var(--color-gold)" }} />
              {tourSteps[tourStep].title}
            </h3>
            <p className="tour-body">{tourSteps[tourStep].body}</p>
            
            <div className="tour-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: "6px 12px", fontSize: "12px" }}
                onClick={handleCompleteTour}
              >
                {language === "en" ? "Skip Tour" : language === "hi" ? "दौरा छोड़ें" : "फेरफटका रद्द करा"}
              </button>
              
              <div style={{ display: "flex", gap: "8px" }}>
                {tourStep > 0 && (
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: "6px 12px", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                    onClick={handlePrevTourStep}
                  >
                    <ChevronLeft size={14} /> {language === "en" ? "Back" : language === "hi" ? "पीछे" : "मागे"}
                  </button>
                )}
                
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ padding: "6px 12px", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                  onClick={handleNextTourStep}
                >
                  {tourStep === tourSteps.length - 1 
                    ? (language === "en" ? "Finish" : language === "hi" ? "समाप्त" : "पूर्ण")
                    : (language === "en" ? "Next" : language === "hi" ? "आगे" : "पुढे")} 
                  {tourStep < tourSteps.length - 1 && <ChevronRight size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="sidebar" style={{ display: "flex", flexDirection: "column" }}>
        <div className="sidebar-header">
          <Scale size={24} style={{ color: "var(--color-gold)" }} />
          <span className="sidebar-logo">{t.title}</span>
        </div>
        
        <nav className="sidebar-nav" style={{ flex: 1, overflowY: "auto" }}>
          
          {/* Normal Citizens Group */}
          <div 
            className="nav-group-header" 
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", userSelect: "none" }}
            onClick={() => setCitizensExpanded(!citizensExpanded)}
          >
            <span>{t.groupCitizens}</span>
            {citizensExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          
          {citizensExpanded && (
            <>
              <div 
                className={`nav-item ${activeTab === "consultation" ? "active" : ""}`}
                onClick={() => setActiveTab("consultation")}
              >
                <MessageSquare size={18} />
                <span>{t.tabConsultation}</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "consumer_desk" ? "active" : ""}`}
                onClick={() => setActiveTab("consumer_desk")}
              >
                <AlertCircle size={18} />
                <span>{t.tabConsumerDesk}</span>
                <span className="badge badge-warning" style={{ marginLeft: "auto", fontSize: "9px" }}>₹</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "risk_desk" ? "active" : ""}`}
                onClick={() => setActiveTab("risk_desk")}
              >
                <AlertTriangle size={18} />
                <span>{t.tabRiskDesk}</span>
                <span className="badge badge-warning" style={{ marginLeft: "auto", fontSize: "9px" }}>₹</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "rera_desk" ? "active" : ""}`}
                onClick={() => setActiveTab("rera_desk")}
              >
                <Building size={18} />
                <span>{t.tabReraDesk}</span>
                <span className="badge badge-warning" style={{ marginLeft: "auto", fontSize: "9px" }}>₹</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "rti_builder" ? "active" : ""}`}
                onClick={() => setActiveTab("rti_builder")}
              >
                <HelpCircle size={18} />
                <span>{t.tabRtiBuilder}</span>
                <span className="badge badge-warning" style={{ marginLeft: "auto", fontSize: "9px" }}>₹</span>
              </div>
            </>
          )}

          {/* Professional Lawyers Group */}
          <div 
            className="nav-group-header" 
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", userSelect: "none" }}
            onClick={() => setLawyersExpanded(!lawyersExpanded)}
          >
            <span>{t.groupLawyers}</span>
            {lawyersExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>

          {lawyersExpanded && (
            <>
              <div 
                className={`nav-item ${activeTab === "briefer" ? "active" : ""}`}
                onClick={() => setActiveTab("briefer")}
              >
                <Briefcase size={18} />
                <span>{t.tabBriefer}</span>
                <span className="badge badge-success" style={{ marginLeft: "auto", fontSize: "9px" }}>AI</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "precedents" ? "active" : ""}`}
                onClick={() => setActiveTab("precedents")}
              >
                <Bookmark size={18} />
                <span>{t.tabPrecedents}</span>
                <span className="badge badge-success" style={{ marginLeft: "auto", fontSize: "9px" }}>SC</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "transition" ? "active" : ""}`}
                onClick={() => setActiveTab("transition")}
              >
                <ArrowLeftRight size={18} />
                <span>{t.tabTransition}</span>
                <span className="badge badge-warning" style={{ marginLeft: "auto", fontSize: "9px" }}>BNS</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "bail_drafter" ? "active" : ""}`}
                onClick={() => setActiveTab("bail_drafter")}
              >
                <Scale size={18} />
                <span>{t.tabBailDrafter}</span>
                <span className="badge badge-success" style={{ marginLeft: "auto", fontSize: "9px" }}>B2B</span>
              </div>
              
              <div 
                className={`nav-item ${activeTab === "drafting" ? "active" : ""}`}
                onClick={() => setActiveTab("drafting")}
              >
                <FileText size={18} />
                <span>{t.tabDrafting}</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "adjournment" ? "active" : ""}`}
                onClick={() => setActiveTab("adjournment")}
              >
                <Clock size={18} />
                <span>{t.tabAdjournment}</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "vakalatnama" ? "active" : ""}`}
                onClick={() => setActiveTab("vakalatnama")}
              >
                <FileText size={18} />
                <span>{t.tabVakalatnama}</span>
                <span className="badge badge-success" style={{ marginLeft: "auto", fontSize: "9px" }}>B2B</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "caveat_drafter" ? "active" : ""}`}
                onClick={() => setActiveTab("caveat_drafter")}
              >
                <Scale size={18} />
                <span>{t.tabCaveatDrafter}</span>
                <span className="badge badge-success" style={{ marginLeft: "auto", fontSize: "9px" }}>B2B</span>
              </div>
              
              <div 
                className={`nav-item ${activeTab === "timeline" ? "active" : ""}`}
                onClick={() => setActiveTab("timeline")}
              >
                <Calendar size={18} />
                <span>{t.tabTimeline}</span>
                {timelineData.length > 0 && (
                  <span className="badge badge-success" style={{ marginLeft: "auto", fontSize: "9px" }}>
                    {timelineData.length}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Common Desk Group */}
          <div 
            className="nav-group-header" 
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", userSelect: "none" }}
            onClick={() => setCommonExpanded(!commonExpanded)}
          >
            <span>{t.groupCommon}</span>
            {commonExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          
          {commonExpanded && (
            <>
              <div 
                className={`nav-item ${activeTab === "acts" ? "active" : ""}`}
                onClick={() => setActiveTab("acts")}
              >
                <BookOpen size={18} />
                <span>{t.tabActs}</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "stamp_calculator" ? "active" : ""}`}
                onClick={() => setActiveTab("stamp_calculator")}
              >
                <Calculator size={18} />
                <span>{t.tabStampCalculator}</span>
                <span className="badge badge-success" style={{ marginLeft: "auto", fontSize: "9px" }}>B2B</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "calculator" ? "active" : ""}`}
                onClick={() => setActiveTab("calculator")}
              >
                <Calculator size={18} />
                <span>{t.tabCalculator}</span>
              </div>

              <div 
                className={`nav-item ${activeTab === "translator" ? "active" : ""}`}
                onClick={() => setActiveTab("translator")}
              >
                <Globe size={18} />
                <span>{t.tabTranslator}</span>
                <span className="badge badge-warning" style={{ marginLeft: "auto", fontSize: "9px" }}>₹</span>
              </div>
            </>
          )}
        </nav>
        
        <div className="sidebar-footer">
          <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
            <span style={{ fontWeight: 600, color: "#f8fafc" }}>{t.assistantBadge}</span>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ fontSize: "11px", padding: "4px 8px", alignSelf: "flex-start", marginTop: "4px", backgroundColor: "var(--color-navy-light)", borderColor: "transparent", color: "var(--color-cream)" }}
              onClick={forceStartTour}
            >
              {language === "en" ? "💡 Take UI Tour" : language === "hi" ? "💡 ऐप यात्रा करें" : "💡 टूर करा"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="header">
          <div className="header-title-section">
            <h1>{caseTitle}</h1>
            <p>{t.subtitle}</p>
          </div>
          
          <div className="header-actions">
            {/* Bilingual Dropdown Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "var(--color-cream-dark)", padding: "4px 8px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-gray-border)" }}>
              <Globe size={14} style={{ color: "var(--color-gold-hover)" }} />
              <select 
                style={{ background: "transparent", border: "none", outline: "none", fontSize: "12px", fontWeight: "600", color: "var(--color-text-dark)", cursor: "pointer" }}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            <button 
              className="btn btn-secondary" 
              onClick={toggleTheme} 
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === "light" ? "Dark" : "Light"}</span>
            </button>
            
            <button 
              className="btn btn-secondary" 
              onClick={handleResetSession} 
              title="Reset Consultation"
              style={{ color: "var(--color-danger)" }}
            >
              <RotateCcw size={16} />
              <span>{t.resetBtn}</span>
            </button>
          </div>
        </header>

        {/* Tab Panel Render */}
        <div className="tab-content">
          {activeTab === "consultation" && (
            <ConsultationRoom 
              onTimelineExtracted={handleTimelineExtracted} 
              onSelectTab={setActiveTab}
              language={language}
            />
          )}

          {activeTab === "briefer" && (
            <CaseBriefer language={language} />
          )}

          {activeTab === "precedents" && (
            <PrecedentHub language={language} />
          )}

          {activeTab === "transition" && (
            <TransitionDesk language={language} />
          )}
          
          {activeTab === "drafting" && (
            <DraftingTable language={language} />
          )}

          {activeTab === "adjournment" && (
            <AdjournmentDrafter language={language} />
          )}

          {activeTab === "risk_desk" && (
            <RiskDesk language={language} />
          )}

          {activeTab === "rti_builder" && (
            <RtiBuilder language={language} />
          )}

          {activeTab === "vakalatnama" && (
            <VakalatnamaBuilder language={language} />
          )}

          {activeTab === "caveat_drafter" && (
            <CaveatDrafter language={language} />
          )}

          {activeTab === "consumer_desk" && (
            <ConsumerDesk language={language} />
          )}

          {activeTab === "bail_drafter" && (
            <BailDrafter language={language} />
          )}

          {activeTab === "rera_desk" && (
            <ReraDesk language={language} />
          )}

          {activeTab === "stamp_calculator" && (
            <StampCalculator language={language} />
          )}
          
          {activeTab === "timeline" && (
            <TimelineBuilder 
              timelineData={timelineData} 
              onUpdateTimeline={setTimelineData}
              language={language}
            />
          )}
          
          {activeTab === "acts" && (
            <BareActsFinder language={language} />
          )}

          {activeTab === "calculator" && (
            <CalculatorDesk language={language} />
          )}

          {activeTab === "translator" && (
            <LegalTranslator language={language} />
          )}
        </div>
      </main>
    </div>
  );
}

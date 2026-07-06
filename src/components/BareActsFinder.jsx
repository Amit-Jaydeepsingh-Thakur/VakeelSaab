import React, { useState } from "react";
import { Search, BookOpen, AlertCircle, HelpCircle } from "lucide-react";
import { geminiService } from "../services/geminiService";
import { renderMarkdown } from "../utils/markdown";

export default function BareActsFinder({ language = "en" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAct, setSelectedAct] = useState("bns");
  const [askSectionQuery, setAskSectionQuery] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  // UI translations for Bare Acts Finder
  const t = {
    en: {
      sidebarTitle: "Select Law Book",
      searchPlaceholder: "Search sections or terms...",
      interactiveTitle: "Ask AI to Explain Any Act or Section",
      interactiveDesc: "Query any section of Indian Law (e.g. 'Section 420 IPC', 'What are the rules of Anticipatory bail under BNSS?') and get a breakdown.",
      askPlaceholder: "e.g., Section 138 of NI Act or Section 356 BNS...",
      explainBtn: "Explain Section",
      explaining: "Explaining...",
      preloadedTitle: "Preloaded Sections Key Reference",
      noResults: "No sections found matching",
      aiLabel: "LexSuite AI Explanation:"
    },
    hi: {
      sidebarTitle: "कानून पुस्तक चुनें",
      searchPlaceholder: "धाराएं या शब्द खोजें...",
      interactiveTitle: "किसी भी कानून या धारा को एआई से समझें",
      interactiveDesc: "भारतीय कानून की किसी भी धारा के बारे में पूछें (जैसे 'धारा 420 आईपीसी', 'बीएनएसएस के तहत अग्रिम जमानत के क्या नियम हैं?') और विवरण प्राप्त करें।",
      askPlaceholder: "उदा. एनआई एक्ट की धारा 138 या धारा 356 बीएनएस...",
      explainBtn: "धारा स्पष्ट करें",
      explaining: "स्पष्टीकरण जारी...",
      preloadedTitle: "प्रीमियम धारा संदर्भ मार्गदर्शिका",
      noResults: "मेल खाने वाली कोई धारा नहीं मिली",
      aiLabel: "वकीलसाहब एआई स्पष्टीकरण:"
    },
    mr: {
      sidebarTitle: "कायदा पुस्तक निवडा",
      searchPlaceholder: "कलम किंवा शब्द शोधा...",
      interactiveTitle: "कोणतेही कलम किंवा कायदा एआय कडून समजून घ्या",
      interactiveDesc: "भारतीय कायद्याच्या कोणत्याही कलमाबद्दल विचारा (उदा. 'कलम ४२० आयपीसी', 'बीएनएसएस अंतर्गत अटकपूर्व जामिनाचे नियम काय आहेत?') आणि सविस्तर माहिती मिळवा.",
      askPlaceholder: "उदा. एनआय कायद्याचे कलम १३८ किंवा कलम ३५६ बीएनएस...",
      explainBtn: "कलम स्पष्ट करा",
      explaining: "स्पष्टीकरण सुरू...",
      preloadedTitle: "पूर्वलोड केलेले कलम संदर्भ मार्गदर्शिका",
      noResults: "जुळणारे कोणतेही कलम आढळले नाही",
      aiLabel: "वकीलसाहेब एआय स्पष्टीकरण:"
    }
  }[language];

  // Localized static quick references for major Indian Acts
  const actsDatabase = {
    en: {
      bns: {
        title: "Bharatiya Nyaya Sanhita (BNS), 2023",
        description: "Replaced the Indian Penal Code (IPC), 1860. The substantive criminal law of India.",
        sections: [
          { id: "101", title: "Section 101 - Murder", text: "Defines and penalizes murder. Equivalent to Section 302 of the old IPC." },
          { id: "115", title: "Section 115 - Voluntary Causing Hurt", text: "Voluntarily causing hurt, including grievous hurt and penalty provisions." },
          { id: "303", title: "Section 303 - Theft", text: "Dishonestly taking moveable property out of the possession of any person. Replaced Section 378 of IPC." },
          { id: "316", title: "Section 316 - Criminal Breach of Trust", text: "Dishonest misappropriation or conversion of property entrusted. Replaced Section 405/406 of IPC." },
          { id: "318", title: "Section 318 - Cheating", text: "Inducing delivery of property through deception. Replaced Section 415/420 of IPC." },
          { id: "356", title: "Section 356 - Defamation", text: "Imputation intending to harm reputation. Replaced Section 499/500 of IPC. Includes community service options." }
        ]
      },
      ipc: {
        title: "Indian Penal Code (IPC), 1860 (Legacy)",
        description: "Legacy penal code of India. Still relevant for cases registered before July 1, 2024.",
        sections: [
          { id: "302", title: "Section 302 - Punishment for Murder", text: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine." },
          { id: "378", title: "Section 378 - Theft", text: "Whoever, intending to take dishonestly any moveable property out of the possession of any person..." },
          { id: "406", title: "Section 406 - Punishment for Criminal Breach of Trust", text: "Punished with imprisonment up to three years, or with fine, or both." },
          { id: "420", title: "Section 420 - Cheating and dishonestly inducing delivery of property", text: "Cheating and thereby dishonestly inducing the person deceived to deliver property. Punished up to 7 years." },
          { id: "499", title: "Section 499 - Defamation", text: "Defines defamation with various exceptions and qualifications." }
        ]
      },
      bnss: {
        title: "Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023",
        description: "Replaced the Code of Criminal Procedure (CrPC), 1973. Governing the administration of criminal procedure.",
        sections: [
          { id: "173", title: "Section 173 - Information in Cognizable Cases", text: "Directs registration of FIR. Introduces modern Zero-FIR and e-FIR concepts." },
          { id: "480", title: "Section 480 - When bail may be taken in non-bailable offence", text: "Provisions regarding release on bail for non-bailable offences. Replaced Section 437 of CrPC." },
          { id: "482", title: "Section 482 - Anticipatory Bail", text: "Direction for grant of bail to person apprehending arrest. Replaced Section 438 of CrPC." }
        ]
      },
      niact: {
        title: "Negotiable Instruments Act, 1881",
        description: "Governing promissory notes, bills of exchange, and cheques.",
        sections: [
          { id: "138", title: "Section 138 - Dishonour of Cheque for insufficiency of funds", text: "Penalizes dishonour of cheque. Subject to double the amount of cheque or imprisonment up to two years." },
          { id: "141", title: "Section 141 - Offences by Companies", text: "Establishes vicarious liability for directors and managers in charge of company affairs." }
        ]
      }
    },
    hi: {
      bns: {
        title: "भारतीय न्याय संहिता (BNS), 2023",
        description: "भारतीय दंड संहिता (IPC), 1860 का स्थान लिया। भारत का मूल आपराधिक कानून।",
        sections: [
          { id: "101", title: "धारा 101 - हत्या (Murder)", text: "हत्या को परिभाषित करता है और दंडित करता है। पुराने IPC की धारा 302 के समकक्ष।" },
          { id: "115", title: "धारा 115 - स्वेच्छा से चोट पहुंचाना", text: "स्वेच्छा से चोट पहुंचाना, जिसमें गंभीर चोट और दंड के प्रावधान शामिल हैं।" },
          { id: "303", title: "धारा 303 - चोरी (Theft)", text: "किसी व्यक्ति के कब्जे से बेईमानी से चल संपत्ति ले जाना। IPC की धारा 378 का स्थान लिया।" },
          { id: "316", title: "धारा 316 - आपराधिक विश्वासघात", text: "सौंपी गई संपत्ति का बेईमानी से दुरुपयोग या परिवर्तन। IPC की धारा 405/406 का स्थान लिया।" },
          { id: "318", title: "धारा 318 - धोखाधड़ी (Cheating)", text: "धोखे से संपत्ति देने के लिए प्रेरित करना। IPC की धारा 415/420 का स्थान लिया।" },
          { id: "356", title: "धारा 356 - मानहानि (Defamation)", text: "प्रतिष्ठा को नुकसान पहुंचाने के इरादे से आरोप लगाना। IPC की धारा 499/500 का स्थान लिया।" }
        ]
      },
      ipc: {
        title: "भारतीय दंड संहिता (IPC), 1860 (पुराना)",
        description: "भारत की पुरानी दंड संहिता। 1 जुलाई 2024 से पहले दर्ज मामलों के लिए अभी भी प्रासंगिक है।",
        sections: [
          { id: "302", title: "धारा 302 - हत्या के लिए सजा", text: "जो कोई भी हत्या करेगा उसे मृत्युदंड या आजीवन कारावास से दंडित किया जाएगा, और जुर्माना भी लगाया जाएगा।" },
          { id: "378", title: "धारा 378 - चोरी", text: "जो कोई भी किसी व्यक्ति के कब्जे से बेईमानी से कोई चल संपत्ति ले जाने का इरादा रखता है..." },
          { id: "406", title: "धारा 406 - आपराधिक विश्वासघात के लिए सजा", text: "तीन साल तक की कैद, या जुर्माना, या दोनों से दंडित किया जाएगा।" },
          { id: "420", title: "धारा 420 - धोखाधड़ी और संपत्ति देने के लिए बेईमानी से प्रेरित करना", text: "धोखाधड़ी और इस प्रकार धोखेबाज व्यक्ति को संपत्ति सौंपने के लिए बेईमानी से प्रेरित करना। 7 साल तक की सजा।" },
          { id: "499", title: "धारा 499 - मानहानि", text: "विभिन्न अपवादों और योग्यताओं के साथ मानहानि को परिभाषित करता है।" }
        ]
      },
      bnss: {
        title: "भारतीय नागरिक सुरक्षा संहिता (BNSS), 2023",
        description: "दंड प्रक्रिया संहिता (CrPC), 1973 का स्थान लिया। आपराधिक प्रक्रिया के प्रशासन को नियंत्रित करता है।",
        sections: [
          { id: "173", title: "धारा 173 - संज्ञेय मामलों में सूचना", text: "प्राथमिकी (FIR) दर्ज करने का निर्देश देता है। आधुनिक जीरो-एफआईआर और ई-एफआईआर अवधारणाओं को पेश करता है।" },
          { id: "480", title: "धारा 480 - गैर-जमानती अपराध में कब जमानत ली जा सकती है", text: "गैर-जमानती अपराधों के लिए जमानत पर रिहाई के संबंध में प्रावधान। CrPC की धारा 437 का स्थान लिया।" },
          { id: "482", title: "धारा 482 - अग्रिम जमानत (Anticipatory Bail)", text: "गिरफ्तारी की आशंका वाले व्यक्ति को जमानत देने का निर्देश। CrPC की धारा 438 का स्थान लिया।" }
        ]
      },
      niact: {
        title: "परक्राम्य लिखत अधिनियम, 1881 (NI Act)",
        description: "वचन पत्र, विनिमय पत्र और चेक को विनियमित करता है।",
        sections: [
          { id: "138", title: "धारा 138 - धन की अपर्याप्तता के लिए चेक का अनादर", text: "चेक बाउंस को अपराध बनाता है। चेक की राशि के दोगुने तक के जुर्माने या दो साल तक की कैद या दोनों की सजा।" },
          { id: "141", title: "धारा 141 - कंपनियों द्वारा अपराध", text: "कंपनी के मामलों के प्रभारी निदेशकों और प्रबंधकों के लिए प्रतिनिधि दायित्व स्थापित करता है।" }
        ]
      }
    },
    mr: {
      bns: {
        title: "भारतीय न्याय संहिता (BNS), २०२३",
        description: "भारतीय दंड संहिता (IPC), १८६० ची जागा घेतली. भारताचा मुख्य फौजदारी कायदा.",
        sections: [
          { id: "101", title: "कलम १०१ - खून (Murder)", text: "खुनाची व्याख्या आणि शिक्षेची तरतूद. जुन्या IPC मधील कलम ३०२ च्या समतुल्य." },
          { id: "115", title: "कलम ११५ - स्वेच्छेने दुखापत करणे", text: "स्वेच्छेने साधी किंवा गंभीर दुखापत करणे आणि शिक्षेच्या तरतुदी." },
          { id: "303", title: "कलम ३०३ - चोरी (Theft)", text: "कोणत्याही व्यक्तीच्या ताब्यातून लबाडीने जंगम मालमत्ता काढून घेणे. IPC कलम ३७८ ची जागा घेतली." },
          { id: "316", title: "कलम ३१६ - गुन्हेगारी स्वरूपाचा विश्वासघात", text: "सोपवलेल्या मालमत्तेचा लबाडीने अपहार करणे. IPC कलम ४०५/४०६ ची जागा घेतली." },
          { id: "318", title: "कलम ३१८ - फसवणूक (Cheating)", text: "फसवणुकीद्वारे मालमत्ता देण्यास प्रवृत्त करणे. IPC कलम ४१५/४२० ची जागा घेतली." },
          { id: "356", title: "कलम ३५६ - अब्रुनुकसानी (Defamation)", text: "प्रतिष्ठेला हानी पोहोचवण्याच्या उद्देशाने खोटे आरोप करणे. IPC कलम ४९९/५०० ची जागा घेतली." }
        ]
      },
      ipc: {
        title: "भारतीय दंड संहिता (IPC), १८६० (जुना)",
        description: "भारताची जुनी दंड संहिता. १ जुलै २०२४ पूर्वी नोंदवलेल्या गुन्ह्यांसाठी अजूनही लागू आहे.",
        sections: [
          { id: "302", title: "कलम ३०२ - खुनाबद्दल शिक्षा", text: "जो कोणी खून करेल त्याला फाशी किंवा जन्मठेप आणि दंडाची शिक्षा होईल." },
          { id: "378", title: "कलम ३७८ - चोरी", text: "जो कोणी कोणत्याही व्यक्तीच्या ताब्यातून जंगम मालमत्ता लबाडीने काढून घेण्याच्या उद्देशाने..." },
          { id: "406", title: "कलम ४०६ - विश्वासघाताबद्दल शिक्षा", text: "तीन वर्षांपर्यंतचा तुरुंगवास, किंवा दंड, किंवा दोन्ही शिक्षा होतील." },
          { id: "420", title: "कलम ४२० - फसवणूक आणि मालमत्ता देण्यास प्रवृत्त करणे", text: "फसवणूक करून लबाडीने मालमत्ता देण्यास प्रवृत्त करणे. ७ वर्षांपर्यंत शिक्षा." },
          { id: "499", title: "कलम ४९९ - अब्रुनुकसानी (Defamation)", text: "अनेक अपवादांसह अब्रुनुकसानीची व्याख्या स्पष्ट करते." }
        ]
      },
      bnss: {
        title: "भारतीय नागरिक सुरक्षा संहिता (BNSS), २०२३",
        description: "फौजदारी प्रक्रिया संहिता (CrPC), १९७३ ची जागा घेतली. गुन्हेगारी प्रक्रिया व्यवस्थापन नियंत्रित करते.",
        sections: [
          { id: "173", title: "कलम १७३ - दखलपात्र गुन्ह्यांमधील माहिती", text: "एफआयआर (FIR) नोंदवण्याचे निर्देश. आधुनिक झिरो-एफआयआर आणि ई-एफआयआर संकल्पना मांडते." },
          { id: "480", title: "कलम ४८० - जामीनपात्र नसलेल्या गुन्ह्यात जामीन कधी दिला जाऊ शकतो", text: "जामीन नसलेल्या गुन्ह्यांसाठी जामीन देण्याच्या तरतुदी. CrPC कलम ४३७ ची जागा घेतली." },
          { id: "482", title: "कलम ४८२ - अटकपूर्व जामीन (Anticipatory Bail)", text: "अटक होण्याची भीती असलेल्या व्यक्तीला जामीन देण्याचे निर्देश. CrPC कलम ४३८ ची जागा घेतली." }
        ]
      },
      niact: {
        title: "परक्राम्य दस्तऐवज कायदा, १८८१ (NI Act)",
        description: "प्रॉमिसरी नोट्स, विनिमय बिले आणि धनादेश नियंत्रित करतो.",
        sections: [
          { id: "138", title: "कलम १३८ - अपुऱ्या निधीसाठी चेक बाऊन्स", text: "चेक बाऊन्स होणे हा गुन्हा ठरवतो. धनादेशाच्या दुप्पट दंडाची किंवा दोन वर्षांपर्यंतच्या कैदेची तरतूद." },
          { id: "141", title: "कलम १४१ - कंपन्यांद्वारे गुन्हे", text: "कंपनीचे कामकाज पाहणाऱ्या संचालकांवर संयुक्त कायदेशीर उत्तरदायित्व निश्चित करतो." }
        ]
      }
    }
  };

  const activeAct = actsDatabase[language]?.[selectedAct] || actsDatabase.en[selectedAct];
  
  const filteredSections = activeAct.sections.filter(sec => 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sec.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.id.includes(searchQuery)
  );

  const triggerExplanation = async (sectionQuery) => {
    if (!sectionQuery.trim()) return;

    setLoadingExplanation(true);
    setAiExplanation("");
    try {
      const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
      const apiLanguage = langNameMap[language] || "English";

      // Request explain response matching the current locale language
      const response = await geminiService.generateFollowUp(
        `Explain this specific legal section or provision in simple terms with examples for laypeople: "${sectionQuery}" under Indian law. Mention if there is a difference between old IPC/CrPC and new BNS/BNSS. Explain ENTIRELY in ${apiLanguage}.`,
        [],
        'A',
        apiLanguage
      );
      setAiExplanation(response);
    } catch (err) {
      setAiExplanation(`Failed: ${err.message}`);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleAskAI = (e) => {
    e.preventDefault();
    triggerExplanation(askSectionQuery);
  };

  const handleSectionClick = (secTitle) => {
    setAskSectionQuery(secTitle);
    triggerExplanation(secTitle);
  };

  return (
    <div className="acts-container">
      <div className="acts-sidebar">
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)", marginBottom: "8px" }}>{t.sidebarTitle}</h3>
        <div className="acts-list">
          <div className={`act-tab ${selectedAct === "bns" ? "active" : ""}`} onClick={() => { setSelectedAct("bns"); setSearchQuery(""); }}>
            <h4>{language === "en" ? "BNS, 2023 (New IPC)" : language === "hi" ? "बीएनएस, 2023 (नया)" : "बीएनएस, २०२३ (नवीन)"}</h4>
          </div>
          <div className={`act-tab ${selectedAct === "ipc" ? "active" : ""}`} onClick={() => { setSelectedAct("ipc"); setSearchQuery(""); }}>
            <h4>{language === "en" ? "IPC, 1860 (Old)" : language === "hi" ? "आईपीसी, 1860 (पुराना)" : "आयपीसी, १८६० (जुना)"}</h4>
          </div>
          <div className={`act-tab ${selectedAct === "bnss" ? "active" : ""}`} onClick={() => { setSelectedAct("bnss"); setSearchQuery(""); }}>
            <h4>{language === "en" ? "BNSS, 2023 (New CrPC)" : language === "hi" ? "बीएनएसएस, 2023" : "बीएनएसएस, २०२३"}</h4>
          </div>
          <div className={`act-tab ${selectedAct === "niact" ? "active" : ""}`} onClick={() => { setSelectedAct("niact"); setSearchQuery(""); }}>
            <h4>{language === "en" ? "NI Act (Cheque)" : language === "hi" ? "एनआई एक्ट (चेक)" : "एनआय कायदा (चेक)"}</h4>
          </div>
        </div>

        <div style={{ marginTop: "24px", borderTop: "1px solid var(--color-gray-border)", paddingTop: "16px" }}>
          <h4 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "8px" }}>{language === "en" ? "Lookup" : language === "hi" ? "खोज" : "शोध"}</h4>
          <input
            type="text"
            className="acts-search-input"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="acts-view">
        <div className="act-header">
          <h2>{activeAct.title}</h2>
          <p>{activeAct.description}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          
          {/* Explain Any Act Form */}
          <div style={{ background: "var(--color-gold-light)", padding: "20px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-gold)" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", color: "#78350f", marginBottom: "8px" }}>
              <HelpCircle size={18} /> {t.interactiveTitle}
            </h3>
            <p style={{ fontSize: "12px", color: "#92400e", marginBottom: "12px" }}>
              {t.interactiveDesc}
            </p>
            <form onSubmit={handleAskAI} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                className="acts-search-input"
                style={{ flex: 1, backgroundColor: "var(--color-white)" }}
                placeholder={t.askPlaceholder}
                value={askSectionQuery}
                onChange={(e) => setAskSectionQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: "var(--color-navy)", borderColor: "var(--color-navy)" }} disabled={loadingExplanation}>
                {loadingExplanation ? t.explaining : t.explainBtn}
              </button>
            </form>

            {loadingExplanation && (
              <div className="loading-dots" style={{ marginTop: "16px" }}>
                <span></span><span></span><span></span>
              </div>
            )}

            {aiExplanation && (
              <div style={{ 
                marginTop: "16px", 
                backgroundColor: "var(--color-white)", 
                padding: "20px", 
                borderRadius: "var(--radius-md)", 
                border: "1px solid var(--color-gray-border)",
                maxHeight: "350px",
                overflowY: "auto",
                fontSize: "13.5px",
                whiteSpace: "normal",
                lineHeight: "1.6"
              }}>
                <strong style={{ display: "block", marginBottom: "12px", borderBottom: "1px solid var(--color-gray-border)", paddingBottom: "6px", fontFamily: "var(--font-serif)", fontSize: "15px", color: "var(--color-navy)" }}>
                  {t.aiLabel}
                </strong>
                {renderMarkdown(aiExplanation)}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--color-navy)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <BookOpen size={18} /> {t.preloadedTitle}
            </h3>
            
            {filteredSections.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px", color: "var(--color-text-muted)" }}>
                <AlertCircle size={24} style={{ margin: "0 auto 8px" }} />
                {t.noResults} "{searchQuery}"
              </div>
            ) : (
              <div className="sections-list">
                {filteredSections.map((sec) => (
                  <div 
                    key={sec.id} 
                    className="section-card" 
                    onClick={() => handleSectionClick(sec.title)}
                    style={{ cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
                    title="Click to explain this section"
                  >
                    <div className="section-card-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{sec.title}</span>
                      <span style={{ fontSize: "10px", fontWeight: "600", backgroundColor: "var(--color-gold-light)", color: "#78350f", padding: "2px 6px", borderRadius: "4px" }}>
                        {language === "en" ? "Click to Explain" : language === "hi" ? "व्याख्या करें" : "स्पष्टीकरण"}
                      </span>
                    </div>
                    <div className="section-card-desc">{sec.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

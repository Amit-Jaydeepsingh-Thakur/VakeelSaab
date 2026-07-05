import React, { useState } from "react";
import { FileText, FileDown, Check, Sparkles, Copy, MessageSquare, Send, ArrowRight } from "lucide-react";
import { geminiService } from "../services/geminiService";

export default function DraftingTable({ language = "en" }) {
  const [activeSidebarMode, setActiveSidebarMode] = useState("templates"); // 'templates' or 'ai_assistant'
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [editorText, setEditorText] = useState("");
  const [polishInstructions, setPolishInstructions] = useState("");
  const [loadingPolish, setLoadingPolish] = useState(false);
  const [copying, setCopying] = useState(false);

  // AI Assistant Chat States
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: {
        en: "Hello! Tell me what legal document you would like to draft (e.g., 'Draft a Non-Disclosure Agreement for an IT startup', 'Rental contract for a shop in Mumbai'). I will generate a template and you can load it directly into the editor on the right.",
        hi: "नमस्ते! मुझे बताएं कि आप कौन सा कानूनी दस्तावेज़ तैयार करना चाहते हैं (जैसे, 'एक आईटी स्टार्टअप के लिए एनडीए अनुबंध', 'मुंबई में एक दुकान के लिए किराया समझौता')। मैं एक ड्राफ्ट तैयार करूँगा और आप इसे सीधे एडिटर में लोड कर सकते हैं।",
        mr: "नमस्कार! मला सांगा की तुम्हाला कोणता कायदेशीर दस्तऐवज तयार करायचा आहे (उदा. 'आयटी स्टार्टअपसाठी एनडीए करार', 'मुंबईतील दुकानासाठी भाडे करार'). मी मसुदा तयार करेन आणि तुम्ही तो थेट उजवीकडील एडिटरमध्ये लोड करू शकता."
      }[language]
    }
  ]);
  const [assistantInput, setAssistantInput] = useState("");
  const [loadingDraft, setLoadingDraft] = useState(false);

  // Localization Dictionary
  const t = {
    en: {
      templatesTab: "Boilerplates",
      assistantTab: "AI Generator Chat",
      toolbarCopy: "Copy",
      toolbarCopied: "Copied!",
      toolbarDownload: "Download (.txt)",
      editorPlaceholder: "Select a boilerplate on the left, or use the AI Assistant to generate any custom legal notice, reply, or deed instantly...",
      polishPlaceholder: "Instructions (e.g. Add penalty interest clause)...",
      polishBtn: "AI Legal Polish",
      draftingPlaceholder: "Draft custom legal notice, deed, contract...",
      loadBtn: "Load into Editor"
    },
    hi: {
      templatesTab: "मानक प्रारूप",
      assistantTab: "एआई ड्राफ्ट चैट",
      toolbarCopy: "कॉपी",
      toolbarCopied: "कॉपी हो गया!",
      toolbarDownload: "डाउनलोड (.txt)",
      editorPlaceholder: "बाईं ओर से एक प्रारूप चुनें, या किसी भी कस्टम कानूनी नोटिस, उत्तर, या विलेख को तुरंत उत्पन्न करने के लिए एआई सहायक का उपयोग करें...",
      polishPlaceholder: "सुधार निर्देश (जैसे ब्याज जुर्माना क्लॉज जोड़ें)...",
      polishBtn: "एआई कानूनी सुधार",
      draftingPlaceholder: "कस्टम कानूनी नोटिस, विलेख या अनुबंध लिखें...",
      loadBtn: "एडिटर में लोड करें"
    },
    mr: {
      templatesTab: "मानक नमुने",
      assistantTab: "एआय मसुदा चॅट",
      toolbarCopy: "कॉपी करा",
      toolbarCopied: "कॉपी केले!",
      toolbarDownload: "डाउनलोड (.txt)",
      editorPlaceholder: "डावीकडून एक नमुना निवडा, किंवा कोणतीही सानुकूल कायदेशीर नोटीस, उत्तर किंवा करार त्वरित व्युत्पन्न करण्यासाठी एआय सहाय्यक वापरा...",
      polishPlaceholder: "सुधारणा सूचना (उदा. व्याज दंड कलम जोडा)...",
      polishBtn: "एआय कायदेशीर सुधार",
      draftingPlaceholder: "सानुकूल कायदेशीर नोटीस, करार किंवा मसुदा लिहा...",
      loadBtn: "एडिटरमध्ये लोड करा"
    }
  }[language];

  const templates = [
    {
      id: "eviction_notice",
      title: { en: "Notice: Tenant Eviction", hi: "नोटिस: किरायेदार की बेदखली", mr: "नोटीस: भाडेकरू खाली करणे" }[language],
      description: {
        en: "Under Rent Control Act for non-payment of rent.",
        hi: "किराया भुगतान न करने पर किराया नियंत्रण अधिनियम के तहत।",
        mr: "भाडे थकबाकीसाठी भाडे नियंत्रण कायद्यांतर्गत."
      }[language],
      text: `LEGAL NOTICE

To,
[Tenant Name]
[Tenant Address]

Dear Sir/Madam,

Under instructions from my client [Landlord Name], residing at [Landlord Address], I hereby serve you with this Legal Notice:

1. You entered into a Leave and License Agreement dated [Date of Agreement] for the premises situated at [Premises Address], for a monthly rent of Rs. [Rent Amount]/-.
2. In terms of Clause [Clause Number] of the said Agreement, you agreed to pay the rent regularly on or before the [Due Day] of every calendar month.
3. However, you have failed and neglected to pay the monthly rent since [Month, Year] till date, causing an accumulation of arrears amounting to Rs. [Total Arrears]/-.
4. Despite multiple verbal and written reminders, you have failed to clear the outstanding dues, committing a material breach of the Agreement.

I, therefore, call upon you to:
a) Pay the entire outstanding rent amount of Rs. [Total Arrears]/- within 15 days of receipt of this notice.
b) Vacate and hand over peaceful vacant possession of the premises to my client on or before [End Date].

Failing which, my client has given me strict instructions to initiate legal proceedings against you in a Court of Law under the applicable Rent Control Act, holding you liable for all costs, consequences, and damages.

Yours faithfully,

___________________
Advocate
`
    },
    {
      id: "cheque_bounce_notice",
      title: { en: "Notice: Cheque Bounce (Sec 138)", hi: "नोटिस: चेक बाउंस (धारा 138)", mr: "नोटीस: चेक बाऊन्स (कलम १३८)" }[language],
      description: {
        en: "Statutory notice under Negotiable Instruments Act.",
        hi: "परक्राम्य लिखत अधिनियम के तहत वैधानिक मांग सूचना।",
        mr: "परक्राम्य दस्तऐवज कायद्यांतर्गत वैधानिक नोटीस."
      }[language],
      text: `REGISTERED AD / SPEED POST
LEGAL NOTICE

To,
[Drawer Name]
[Drawer Address]

Dear Sir/Madam,

Under instructions from my client [Payee Name], residing at [Payee Address], I hereby serve you with this Legal Notice:

1. That in discharge of your legally enforceable debt/liability, you issued a cheque bearing No. [Cheque Number] dated [Cheque Date] drawn on [Bank Name] for an amount of Rs. [Amount]/- in favor of my client.
2. My client presented the said cheque for encashment through their banker, [Payee Bank Name], within its validity period.
3. However, the said cheque was returned unpaid by your bank with the remarks "[Return Reason, e.g., Insufficient Funds]" vide Bank Return Memo dated [Memo Date].
4. My client immediately informed you of this dishonour, but you have failed to make the payment.

I, therefore, call upon you to pay the cheque amount of Rs. [Amount]/- to my client within 15 (fifteen) days from the receipt of this legal notice.

Please note that if you fail to make the said payment within the stipulated 15 days, my client will be constrained to file a criminal complaint against you under Section 138 of the Negotiable Instruments Act, 1881, which carries a punishment of imprisonment up to two years, or fine up to double the cheque amount, or both.

Yours faithfully,

___________________
Advocate
`
    },
    {
      id: "divorce_mutual",
      title: { en: "Petition: Mutual Divorce", hi: "याचिका: आपसी तलाक", mr: "याचिका: परस्पर संमतीने घटस्फोट" }[language],
      description: {
        en: "Under Section 13B of the Hindu Marriage Act, 1955.",
        hi: "हिंदू विवाह अधिनियम, 1955 की धारा 13B के तहत संयुक्त याचिका।",
        mr: "हिंदू विवाह कायदा, १९५५ च्या कलम १३B अंतर्गत संयुक्त याचिका."
      }[language],
      text: `IN THE COURT OF THE PRINCIPAL JUDGE, FAMILY COURT AT [CITY NAME]

H.M.A. PETITION NO. _________ OF 2026

IN THE MATTER OF:

[Husband's Name]
S/o [Father's Name]
R/o [Address]
...PETITIONER NO. 1

AND

[Wife's Name]
D/o [Father's Name]
R/o [Address]
...PETITIONER NO. 2

PETITION FOR DISSOLUTION OF MARRIAGE BY MUTUAL CONSENT UNDER SECTION 13-B OF THE HINDU MARRIAGE ACT, 1955

MOST RESPECTFULLY SHOWETH:

1. That the marriage between the Petitioners was solemnized on [Date of Marriage] at [Place of Marriage] as per Hindu rites and ceremonies.
2. That after the marriage, the Petitioners cohabited as husband and wife at [Matrimonial Home Address]. There is [no child / number of children] born out of this wedlock.
3. That due to temperamental differences and incompatibility, the Petitioners could not pull on together and have been living separately since [Separation Date].
4. That all attempts of reconciliation by family members and friends have failed, and there is no possibility of cohabitation.
5. That the Petitioners have mutually agreed to dissolve their marriage and have settled all claims regarding alimony, stridhan, and maintenance as detailed in the Settlement Deed dated [Settlement Date].

PRAYER:
The Petitioners, therefore, respectfully pray that this Hon'ble Court may be pleased to:
a) Pass a decree of dissolution of marriage by mutual consent, dissolving the marriage solemnized between the Petitioners on [Date of Marriage].
b) Pass any other order(s) which this Court deems fit and proper in the interest of justice.

PETITIONER NO. 1                            PETITIONER NO. 2
`
    },
    {
      id: "sale_deed",
      title: { en: "Sale Deed: Property Transfer", hi: "बिक्री विलेख (Sale Deed)", mr: "विक्री खरेदी खत (Sale Deed)" }[language],
      description: {
        en: "Deed for transfer of immovable property under Transfer of Property Act, 1882.",
        hi: "संपत्ति अंतरण अधिनियम, 1882 के तहत अचल संपत्ति के हस्तांतरण के लिए विलेख।",
        mr: "मालमत्ता हस्तांतरण कायद्यांतर्गत स्थावर मालमत्ता खरेदी विक्रीचा करार."
      }[language],
      text: `DEED OF SALE

This Deed of Sale is made and executed at [City Name] on this [Date] day of [Month], [Year] by and between:

[Seller Name], S/o [Father's Name], residing at [Address] (hereinafter called the VENDOR) OF THE FIRST PART.

AND

[Buyer Name], S/o [Father's Name], residing at [Address] (hereinafter called the VENDEE) OF THE SECOND PART.

WHEREAS the Vendor is the sole and absolute owner of the property situated at [Property Details, Survey No, Plot No, Municipal boundaries] (hereinafter referred to as the Schedule Property).

NOW THIS DEED WITNESSETH AS FOLLOWS:
1. In consideration of the sum of Rs. [Sale Price]/- paid by the Vendee to the Vendor, the receipt of which is hereby acknowledged, the Vendor hereby sells, conveys, and transfers all rights, title, and interest in the Schedule Property to the Vendee.
2. The Vendor covenants that the Schedule Property is free from all encumbrances, liens, mortgages, charges, and litigations.
3. The Vendor has handed over the peaceful vacant possession of the Schedule Property to the Vendee along with all title documents.

IN WITNESS WHEREOF the parties have signed this deed in the presence of witnesses:

VENDOR: _________________                  VENDEE: _________________

WITNESS 1: _________________                WITNESS 2: _________________
`
    },
    {
      id: "conveyance_deed",
      title: { en: "Conveyance Deed", hi: "हस्तांतरण पत्र (Conveyance)", mr: "हस्तांतरण पत्र (Conveyance Deed)" }[language],
      description: {
        en: "Deed transferring interest in property/building.",
        hi: "संपत्ति या भवन में अधिकार हस्तांतरित करने का विलेख।",
        mr: "मालमत्ता किंवा इमारतीमधील हक्क हस्तांतरित करण्याचा करार."
      }[language],
      text: `DEED OF CONVEYANCE

This Deed of Conveyance is made at [City Name] on this [Date] day of [Month], [Year] by and between [Transferor Name] (hereinafter called the Transferor) and [Transferee Name] (hereinafter called the Transferee).

WHEREAS the Transferor is possessed of the land and building described in the Schedule below and has agreed to convey the same to the Transferee for a consideration of Rs. [Amount]/-.

NOW THIS DEED OF CONVEYANCE WITNESSETH:
1. The Transferor hereby conveys and transfers all legal title and possession of the Schedule property to the Transferee.
2. The Transferor covenants that he has absolute right and authority to convey the said property and has paid all taxes and duties up to the date of execution.

THE SCHEDULE OF THE PROPERTY:
[Detailed description of boundaries and size]

TRANSFEROR: _________________                TRANSFEREE: _________________
`
    },
    {
      id: "gift_deed",
      title: { en: "Gift Deed (Sec 122)", hi: "दान पत्र (Gift Deed)", mr: "बक्षीस पत्र (Gift Deed)" }[language],
      description: {
        en: "Voluntary transfer under Section 122 of Transfer of Property Act.",
        hi: "संपत्ति अंतरण अधिनियम की धारा 122 के तहत स्वेच्छा से संपत्ति उपहार में देने का विलेख।",
        mr: "कोणत्याही मोबदल्याशिवाय मालमत्ता बक्षीस देण्याचा नोंदणीकृत करार."
      }[language],
      text: `DEED OF GIFT

This Deed of Gift is executed at [City Name] on this [Date] day of [Month], [Year] by [Donor Name], S/o [Father's Name] (hereinafter called the DONOR) of the one part, and [Donee Name], S/o [Father's Name] (hereinafter called the DONEE) of the other part.

WHEREAS out of natural love and affection, the Donor is desirous of gifting the property described in the Schedule hereto to the Donee, who is the [Relationship, e.g., Son/Daughter] of the Donor.

NOW THIS DEED WITNESSETH AS FOLLOWS:
1. The Donor, out of natural love and affection and without any monetary consideration, hereby transfers, gives, and conveys the property described in the Schedule to the Donee.
2. The Donee hereby accepts the gift and has taken possession of the same.
3. The value of the property for the purpose of stamp duty is estimated at Rs. [Property Value]/-.

DONOR: _________________                    DONEE: _________________
`
    },
    {
      id: "loan_agreement",
      title: { en: "Loan Agreement", hi: "ऋण समझौता (Loan Agreement)", mr: "कर्ज करार (Loan Agreement)" }[language],
      description: {
        en: "Under Indian Contract Act for lending transactions.",
        hi: "ऋण लेनदेन के लिए भारतीय अनुबंध अधिनियम के तहत समझौता।",
        mr: "पैसे कर्ज देण्याघेण्याबाबतचा कायदेशीर करार."
      }[language],
      text: `LOAN AGREEMENT

This Loan Agreement is entered into at [City Name] on this [Date] day of [Month], [Year] by and between:

[Lender Name], S/o [Father's Name], residing at [Address] (hereinafter called the LENDER).

AND

[Borrower Name], S/o [Father's Name], residing at [Address] (hereinafter called the BORROWER).

WHEREAS the Borrower has requested the Lender to grant a personal loan of Rs. [Loan Amount]/- for financial assistance, which the Lender has agreed to advance.

NOW TERMS OF AGREEMENT ARE AS FOLLOWS:
1. The Lender advances the sum of Rs. [Loan Amount]/- to the Borrower, bearing interest at the rate of [Interest Rate]% per annum.
2. The Borrower agrees to repay the entire loan amount along with interest in [Number of Months] monthly installments of Rs. [EMIAmount]/- starting from [Start Date].
3. In case of default, late fee penalty at the rate of [Penalty Rate]% per month shall apply.

LENDER: _________________                    BORROWER: _________________
`
    },
    {
      id: "partnership_deed",
      title: { en: "Partnership Deed", hi: "साझेदारी विलेख (Partnership Deed)", mr: "भागीदारी करार (Partnership Deed)" }[language],
      description: {
        en: "Under Indian Partnership Act, 1932 for firm creation.",
        hi: "फर्म के निर्माण के लिए भारतीय साझेदारी अधिनियम, 1932 के तहत विलेख।",
        mr: "भागीदारी संस्था (Firm) स्थापन करण्यासाठी भागीदारी करार."
      }[language],
      text: `PARTNERSHIP DEED

This Deed of Partnership is made at [City Name] on this [Date] day of [Month], [Year] by and between:
1. [Partner 1 Name], S/o [Father's Name], residing at [Address].
2. [Partner 2 Name], S/o [Father's Name], residing at [Address].

WHEREAS the partners have decided to carry on business in partnership under the firm name and style of M/S [Firm Name].

NOW THIS DEED WITNESSETH AS FOLLOWS:
1. NAME & PLACE: The business shall be carried under the name M/s [Firm Name] at [Business Office Address].
2. CAPITAL: The capital of the firm shall be Rs. [Total Capital]/- contributed equally or as [Partner 1 Contribution / Partner 2 Contribution].
3. PROFIT & LOSS SHARING: The profit and losses of the partnership shall be shared in the ratio of [Ratio, e.g. 50:50].
4. BANK ACCOUNT: The bank account of the firm shall be operated jointly by both partners.

PARTNER 1: _________________                PARTNER 2: _________________
`
    },
    {
      id: "generic_agreement",
      title: { en: "Generic Agreement / MoU", hi: "सामान्य समझौता / सहमति पत्र", mr: "साधारण करार / सामंजस्य करार" }[language],
      description: {
        en: "Standard multipurpose agreement template.",
        hi: "मानक बहुउद्देशीय समझौता और सहमति पत्र प्रारूप।",
        mr: "अनेक वापरांसाठी उपयुक्त असलेला सामान्य करार नमुना."
      }[language],
      text: `MEMORANDUM OF UNDERSTANDING / AGREEMENT

This Agreement is made at [City Name] on this [Date] day of [Month], [Year] by and between [First Party Name] (hereinafter First Party) and [Second Party Name] (hereinafter Second Party).

WHEREAS the parties desire to collaborate on [Purpose of Agreement] and record their terms of understanding.

NOW IT IS AGREED AS FOLLOWS:
1. SCOPE: The parties agree to perform the duties detailed in Clause [X]...
2. VALIDITY: This agreement shall remain valid for [Duration] from the date of execution.
3. TERMINATION: Either party can terminate this agreement by giving 30 days written notice.
4. JURISDICTION: Any disputes shall be subject to the courts situated in [City Name].

FIRST PARTY: _________________              SECOND PARTY: _________________
`
    }
  ];

  const handleSelectTemplate = (tpl) => {
    setActiveTemplate(tpl.id);
    setEditorText(tpl.text);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(editorText);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([editorText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${activeTemplate || "legal_draft"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAIPolish = async (e) => {
    e.preventDefault();
    if (!editorText.trim()) return;

    setLoadingPolish(true);
    try {
      const polished = await geminiService.polishDraft(editorText, polishInstructions);
      setEditorText(polished);
      setPolishInstructions("");
    } catch (err) {
      alert(`Error polishing draft: ${err.message}`);
    } finally {
      setLoadingPolish(false);
    }
  };

  const handleSendDraftRequest = async (e) => {
    e.preventDefault();
    if (!assistantInput.trim() || loadingDraft) return;

    const requestText = assistantInput;
    setAssistantInput("");

    const updated = [...chatMessages, { role: "user", content: requestText }];
    setChatMessages(updated);
    setLoadingDraft(true);

    try {
      const langNameMap = { en: "English", hi: "Hindi", mr: "Marathi" };
      const apiLanguage = langNameMap[language] || "English";
      
      const response = await geminiService.generateLegalDraft(requestText, apiLanguage);
      setChatMessages([...updated, { role: "assistant", content: response, isDraft: true }]);
    } catch (err) {
      setChatMessages([...updated, { role: "assistant", content: `Error: ${err.message}` }]);
    } finally {
      setLoadingDraft(false);
    }
  };

  const handleLoadIntoEditor = (text) => {
    setEditorText(text);
    setActiveTemplate("ai_generated_draft");
  };

  return (
    <div className="drafting-container" style={{ display: "grid", gridTemplateColumns: "340px 1fr", height: "100%", gap: "20px" }}>
      
      {/* Sidebar Control Pane */}
      <div className="templates-list" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", padding: "16px" }}>
        
        {/* Sub-tab selection */}
        <div style={{ display: "flex", backgroundColor: "var(--color-cream-dark)", padding: "4px", borderRadius: "var(--radius-md)", marginBottom: "16px" }}>
          <button 
            type="button"
            className={`toggle-tab ${activeSidebarMode === "templates" ? "active" : ""}`}
            style={{ flex: 1, fontSize: "11.5px", padding: "8px 0" }}
            onClick={() => setActiveSidebarMode("templates")}
          >
            <FileText size={13} style={{ display: "inline", marginRight: "4px" }} />
            {t.templatesTab}
          </button>
          <button 
            type="button"
            className={`toggle-tab ${activeSidebarMode === "ai_assistant" ? "active" : ""}`}
            style={{ flex: 1, fontSize: "11.5px", padding: "8px 0" }}
            onClick={() => setActiveSidebarMode("ai_assistant")}
          >
            <MessageSquare size={13} style={{ display: "inline", marginRight: "4px" }} />
            {t.assistantTab}
          </button>
        </div>

        {/* Sidebar Content Render */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {activeSidebarMode === "templates" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {templates.map((tpl) => (
                <div 
                  key={tpl.id} 
                  className={`template-item ${activeTemplate === tpl.id ? "active" : ""}`}
                  onClick={() => handleSelectTemplate(tpl)}
                >
                  <h4>{tpl.title}</h4>
                  <p>{tpl.description}</p>
                </div>
              ))}
            </div>
          ) : (
            /* AI Generator Chat Interface */
            <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "12px", fontSize: "12.5px" }}>
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                      backgroundColor: msg.role === "user" ? "var(--color-navy)" : "var(--color-cream-dark)",
                      color: msg.role === "user" ? "var(--color-white)" : "var(--color-text-dark)",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      maxWidth: "90%",
                      boxShadow: "var(--shadow-sm)",
                      border: msg.role === "user" ? "none" : "1px solid var(--color-gray-border)"
                    }}
                  >
                    <div style={{ whiteSpace: "pre-line" }}>
                      {typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)}
                    </div>
                    {msg.isDraft && (
                      <button 
                        className="btn btn-gold" 
                        style={{ marginTop: "10px", width: "100%", padding: "4px 8px", fontSize: "11px" }}
                        onClick={() => handleLoadIntoEditor(msg.content)}
                      >
                        {t.loadBtn} <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                ))}
                
                {loadingDraft && (
                  <div style={{ alignSelf: "flex-start", backgroundColor: "var(--color-cream-dark)", padding: "10px 14px", borderRadius: "var(--radius-md)" }}>
                    <div className="loading-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendDraftRequest} style={{ display: "flex", gap: "6px", borderTop: "1px solid var(--color-gray-border)", paddingTop: "10px" }}>
                <input
                  type="text"
                  className="acts-search-input"
                  style={{ backgroundColor: "var(--color-white)", fontSize: "12px", height: "34px", padding: "0 10px", flex: 1 }}
                  placeholder={t.draftingPlaceholder}
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  disabled={loadingDraft}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ padding: "0 12px", height: "34px" }} disabled={loadingDraft || !assistantInput.trim()}>
                  <Send size={12} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Editor Workspace Panel */}
      <div className="editor-panel">
        <div className="editor-toolbar">
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-secondary" onClick={handleCopyText} disabled={!editorText}>
              {copying ? <Check size={14} style={{ color: "var(--color-success)" }} /> : <Copy size={14} />}
              {copying ? t.toolbarCopied : t.toolbarCopy}
            </button>
            <button className="btn btn-secondary" onClick={handleDownload} disabled={!editorText}>
              <FileDown size={14} /> {t.toolbarDownload}
            </button>
          </div>
          
          <form onSubmit={handleAIPolish} style={{ display: "flex", gap: "8px", flex: 1, justifyContent: "flex-end", maxWidth: "500px" }}>
            <input
              type="text"
              className="acts-search-input"
              style={{ width: "220px", fontSize: "12px", height: "34px", padding: "0 10px" }}
              placeholder={t.polishPlaceholder}
              value={polishInstructions}
              onChange={(e) => setPolishInstructions(e.target.value)}
            />
            <button type="submit" className="btn btn-gold" style={{ height: "34px", fontSize: "12px", padding: "0 12px" }} disabled={loadingPolish || !editorText}>
              <Sparkles size={13} /> {loadingPolish ? "Polishing..." : t.polishBtn}
            </button>
          </form>
        </div>

        <div className="editor-body" style={{ height: "calc(100% - 60px)" }}>
          <textarea
            className="editor-textarea"
            style={{ height: "100%" }}
            placeholder={t.editorPlaceholder}
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

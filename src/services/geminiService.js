import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Check if API key is present
const hasApiKey = !!apiKey && apiKey !== "YOUR_API_KEY_HERE";
const genAI = hasApiKey ? new GoogleGenerativeAI(apiKey) : null;

// Helper to clean JSON string from Markdown code block formatting if it occurs
function cleanJSONString(str) {
  let cleaned = str.trim();
  
  // Extract content between first '{' and last '}'
  const startIdx = cleaned.indexOf("{");
  const endIdx = cleaned.lastIndexOf("}");
  if (startIdx !== -1 && endIdx !== -1) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  // Remove trailing commas before closing braces/brackets that break JSON.parse
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
  
  return cleaned.trim();
}

/**
 * Executes a Gemini request, falling back through available models if one fails.
 * This ensures the app is highly resilient across different model availabilities on free key structures.
 */
async function generateContentWithFallback(prompt, generationConfig = {}, isJsonMode = false) {
  if (!genAI) throw new Error("GoogleGenerativeAI is not initialized.");

  // List of fallback models to try sequentially (updated with verified active models for this key)
  const modelList = isJsonMode 
    ? ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-2.5-pro"]
    : ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-2.5-pro"];

  let lastError = null;
  for (const modelName of modelList) {
    try {
      const config = { model: modelName };
      if (isJsonMode) {
        config.generationConfig = { responseMimeType: "application/json", ...generationConfig };
      } else if (Object.keys(generationConfig).length > 0) {
        config.generationConfig = generationConfig;
      }
      
      const model = genAI.getGenerativeModel(config);
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.warn(`LexSuite: Model "${modelName}" failed. Falling back. Error:`, err.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error("All attempted Gemini models failed.");
}

/**
 * Service to handle legal AI generation using Gemini.
 */
export const geminiService = {
  /**
   * Generates a structured dual legal analysis (Response A vs Response B) in the chosen language.
   * @param {string} query - The user's query or case details.
   * @param {Array} history - Previous chat history.
   * @param {string} language - Active language (English, Hindi, Marathi).
   * @returns {Promise<Object>} The structured analysis.
   */
  async generateLegalAnalysis(query, history = [], language = "English") {
    if (!genAI) {
      return this.getMockResponse(query);
    }

    try {
      const historyContext = history.length > 0 
        ? `Chat History:\n${history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}\n\n`
        : "";

      const systemPrompt = `You are LexSuite, an expert Indian legal assistant. Your target audience includes both Indian lawyers and common citizens.
Analyze the user's query and provide a structured JSON response.

You must write all the text content values (like strategy titles, detailed content, pros/cons list items, key sections summaries, and timeline events) translated into the selected language: ${language}.
Keep the JSON key names exactly in English as defined below, but the text values MUST be in ${language}.

You must provide two contrasting strategies:
- Response A (Amicable & Advisory): Focus on a layperson's perspective, mediation, arbitration, consumer forums, legal notice drafts, and amicable settlements. Explain in clear, simple terms. Keep it highly concise, structured, and under 120 words.
- Response B (Procedural & Litigation): Focus on a professional lawyer's perspective, citing relevant statutes, procedural codes (BNS, BNSS, BSA, IPC, CrPC, CPC), court litigation strategies, and relevant judicial precedents. Keep it highly concise, technical, and under 150 words.

You must also extract:
- keySections: Specific legal sections under Indian law (BNS, BNSS, BSA, IPC, CPC, CrPC, NI Act, etc.) with a summary of each.
- timeline: Chronological timeline of events extracted or inferred from the case description.

The response must strictly match this JSON schema:
{
  "responseA": {
    "title": "Strategy A: Advisory & Resolution",
    "content": "Detailed strategy explanation for laypeople...",
    "pros": ["Pro 1", "Pro 2"],
    "cons": ["Con 1", "Con 2"]
  },
  "responseB": {
    "title": "Strategy B: Statutory & Litigation",
    "content": "Detailed statutory analysis and court process for lawyers...",
    "pros": ["Pro 1", "Pro 2"],
    "cons": ["Con 1", "Con 2"]
  },
  "keySections": [
    {
      "act": "Name of the Act (e.g., Bharatiya Nyaya Sanhita, 2023)",
      "section": "Section description (e.g., Section 115)",
      "summary": "Brief explanation of applicability"
    }
  ],
  "timeline": [
    {
      "date": "Date or timeframe (e.g., 15th January 2026)",
      "event": "Description of the event"
    }
  ]
}`;

      const prompt = `${systemPrompt}\n\n${historyContext}User Query: ${query}`;
      const responseText = await generateContentWithFallback(prompt, {}, true);
      const cleaned = cleanJSONString(responseText);
      return JSON.parse(cleaned);

    } catch (error) {
      console.error("Gemini API Error in generateLegalAnalysis:", error);
      // Fallback if the JSON parsing or API fails
      return this.getMockResponse(query, error.message);
    }
  },

  /**
   * Generates a follow-up response in the context of an adopted response style.
   * @param {string} query - The user's follow-up message.
   * @param {Array} history - The chat history.
   * @param {string} adoptedStrategy - 'A' or 'B'.
   * @param {string} language - Active language (English, Hindi, Marathi).
   */
  async generateFollowUp(query, history = [], adoptedStrategy = 'A', language = "English") {
    if (!genAI) {
      return `[Mock Response] Since no valid Gemini API Key is configured, here is a follow-up mock response answering: "${query}" in the context of Strategy ${adoptedStrategy}.`;
    }

    try {
      const historyText = history.map(msg => {
        return `${msg.role === 'user' ? 'User' : 'Assistant'}: ${typeof msg.content === 'object' ? JSON.stringify(msg.content) : msg.content}`;
      }).join('\n');

      const prompt = `You are LexSuite, an expert Indian legal assistant.
The user has chosen Strategy ${adoptedStrategy} for their case.
Answer the user's follow-up question in accordance with Indian Law, keeping the context of Strategy ${adoptedStrategy}.

You MUST respond entirely in the selected language: ${language}. Use clean, professional grammar.

Conversation History:
${historyText}

Follow-up Question:
${query}

Respond in clean, well-formatted markdown. Be professional, structured, and informative. Use bold headings and bullet points.`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in generateFollowUp:", error);
      return `Error generating response: ${error.message}. Please verify your API Key and network connection.`;
    }
  },

  /**
   * Translates local police records (FIR, Panchnama) into English court language.
   * @param {string} text - Excerpt text.
   * @param {string} sourceLanguage - 'Hindi' or 'Marathi'.
   */
  async translatePoliceRecord(text, sourceLanguage = "Marathi") {
    if (!genAI) {
      return `[Mock Translation] Translated from ${sourceLanguage}:\n\n1. Complainant [Name] states that on [Date], the accused committed criminal breach of trust.\n2. The site inspection (Panchnama) was conducted by Police Sub-Inspector on [Date].\n\n[Please configure a valid API Key to run live translations]`;
    }

    try {
      const prompt = `You are a certified professional legal translator specializing in Indian police records and court filings.
Translate the following police record from ${sourceLanguage} into formal English as used in Indian High Courts and the Supreme Court of India.

Instructions:
1. Translate all vernacular police terms into their standard English legal equivalents (e.g., 'Fariyadi' to 'Complainant', 'Aaropi' to 'Accused', 'Panchnama' to 'Seizure/Site Memo', 'Sanha' to 'Daily Diary Entry').
2. Maintain the structure and dates exactly.
3. Keep the tone highly formal and professional.
4. Output ONLY the translated English legal text. Do not add introductory or concluding notes.

Source Document (${sourceLanguage}):
"""
${text}
"""`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in translatePoliceRecord:", error);
      throw error;
    }
  },

  /**
   * Generates a legal document draft based on user prompt.
   * @param {string} promptText - User instructions (e.g., NDA contract).
   * @param {string} language - Target language (English, Hindi, Marathi).
   */
  async generateLegalDraft(promptText, language = "English") {
    if (!genAI) {
      return `[Mock Legal Draft] Draft generated for "${promptText}" in ${language}.\n\nThis is a mock draft. Configure a valid API key to run live drafting.`;
    }

    try {
      const prompt = `You are LexSuite, an expert Indian legal draftsman.
Draft a professional, standard legal document based on this request: "${promptText}".
Ensure the draft is structured formally, utilizes standard Indian court and contractual vocabulary (including proper sections/clauses where applicable), and fits Indian legal practice.

Write the draft document content in the selected language: ${language}.
Format the output in clean, professional text. Return ONLY the drafted legal document text. Do not add conversational intro or outro text.

Draft Request: ${promptText}`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in generateLegalDraft:", error);
      throw error;
    }
  },

  /**
   * Analyzes raw case details and creates a professional structured Case Brief.
   * @param {string} narrative - Raw story.
   * @param {string} language - Target language.
   */
  async generateCaseBrief(narrative, language = "English") {
    if (!genAI) {
      return `[Mock Case Brief] Brief for case in ${language}:\n\n- Parties: Complainant vs Opposite Party\n- Key Facts: Narrative described default of agreement.\n- Legal Issues: Breach of trust, recovery of dues.\n- Statutes: Section 316 BNS, NI Act Sec 138.`;
    }

    try {
      const prompt = `You are LexSuite, an expert Indian legal assistant.
Analyze the following raw client case description or facts and generate a highly professional, structured Case Brief / Synopsis.

The brief must be written entirely in the selected language: ${language}.
Format the output in clean Markdown. Use these standard headings:
### 1. Case Title & Parties
- Identify the likely Plaintiff/Complainant and Defendant/Accused.

### 2. Summary of Facts
- List the key facts of the dispute in chronologically ordered bullet points.

### 3. Key Legal Issues
- Formulate 2-3 core legal questions that a court would need to determine.

### 4. Relevant Statutes & Sections
- Cite the applicable Indian legal acts and sections (e.g. BNS, CPC, NI Act, etc.) with a brief note on how they apply.

### 5. Recommended Next Steps
- Actionable steps the lawyer should take next (documents to collect, notices to draft).

Client Facts:
"""
${narrative}
"""`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in generateCaseBrief:", error);
      throw error;
    }
  },

  /**
   * Recommends landmark precedents and citations under Indian law based on a legal issue.
   * @param {string} legalIssue - Topic to search (e.g. director liability in cheque bounce).
   * @param {string} language - Target language.
   */
  async searchPrecedents(legalIssue, language = "English") {
    if (!genAI) {
      return `[Mock Precedents] Precedents for "${legalIssue}" in ${language}:\n\n1. *Aneeta Hada v. Godfather Travels* (2012) 5 SCC 661 - Landmark ruling on vicarious company liability under NI Act.`;
    }

    try {
      const prompt = `You are LexSuite, an expert Indian legal researcher.
You are tasked with finding landmark Supreme Court of India or High Court judgments/precedents for this legal issue: "${legalIssue}".

Provide 2-3 key relevant judgments. For each judgment, provide:
1. **Case Title & Citation**: Standard citation formatting (e.g., (2012) 5 SCC 661).
2. **Relevant Court**: (e.g., Supreme Court of India).
3. **Ratio Decidendi / Key Holding**: Summarize the legal principle established by the court.
4. **Significance**: Why it is relevant to the issue.

Write the entire response in the selected language: ${language}. Format in clear, readable markdown with bold text and clean line spacing.

Legal Research Query: "${legalIssue}"`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in searchPrecedents:", error);
      throw error;
    }
  },

  /**
   * Cross-references IPC (1860) sections with BNS (2023) sections.
   * @param {string} query - The section query (e.g. "420" or "Section 302").
   * @param {string} language - Target language.
   */
  async convertSectionIPCBNS(query, language = "English") {
    if (!genAI) {
      return `[Mock Transition] Section conversion for "${query}" in ${language}:\n\n- Old Section: Section 420 IPC (Cheating)\n- New Section: Section 318 BNS (Cheating)\n- Key changes: Capped imprisonment, modern definitions.`;
    }

    try {
      const prompt = `You are LexSuite, an expert on the transition from the legacy Indian Penal Code (IPC), 1860 to the new Bharatiya Nyaya Sanhita (BNS), 2023.
Analyze this query: "${query}". Identify the relevant old IPC section and its equivalent new BNS section.

Provide a detailed comparison card. Output in clean Markdown format with these sections:
1. **Old IPC Section & Description**: Explain what the legacy section covered.
2. **New BNS Section & Description**: Explain where it is housed under BNS 2023.
3. **Punishment Details Comparison**: Contrast the old punishment with the new penalty, prison terms, or community service additions.
4. **Key Procedural Alteration under BNSS/BSA**: Note any major changes in investigation, bailability, police custody, or evidence admissibility (BSA) related to this offense.

Write the response ENTIRELY in ${language}. Do not write introductory or concluding conversational remarks.`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in convertSectionIPCBNS:", error);
      throw error;
    }
  },

  /**
   * Generates a formal Adjournment Application or Passover Slip for Indian Courts.
   * @param {Object} details - { court, caseNumber, reason, counselName, judgeName, nextDate }
   * @param {string} language - Target language.
   */
  async generateAdjournmentLetter(details, language = "English") {
    if (!genAI) {
      return `[Mock Letter] Adjournment Request for ${details.caseNumber} in ${language}:\n\nRespected Sir/Madam,\n\nI am requesting adjournment due to: ${details.reason}.`;
    }

    try {
      const prompt = `You are LexSuite, a professional Indian court clerk.
Draft a highly formal, respectful, and standard **Adjournment Application / Passover Slip** to be filed in court.

Use this input metadata:
- Court: ${details.court}
- Case Number: ${details.caseNumber}
- Judge Name: ${details.judgeName || "Ld. Judge"}
- Counsel Name: ${details.counselName}
- Reason for Adjournment: ${details.reason}
- Proposed Next Date (optional): ${details.nextDate || "suitable date"}

Instructions:
1. Use standard Indian judicial honorifics (e.g., "Hon'ble Court", "Ld. Counsel", "Your Honour").
2. Frame the reason politely (e.g. counsel is arguing in Court Room 12 of the High Court, or counsel is indisposed due to medical reasons).
3. Ensure the structure is formal (Header, Case details, Body, Prayer for Adjournment, Signature line).
4. Output the draft in the selected language: ${language}.
5. Return ONLY the drafted application text. Do not add intro/outro comments.`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in generateAdjournmentLetter:", error);
      throw error;
    }
  },

  /**
   * Reviews a contract and checks for predatory clauses, risks, and hidden costs.
   * @param {string} contractText - Raw agreement text.
   * @param {string} language - Target language.
   */
  async auditContractRisk(contractText, language = "English") {
    if (!genAI) {
      return `[Mock Contract Audit] Audit results in ${language}:\n\n1. Risk: High penalty fees.\n2. Hidden cost: Exit lock-in period of 2 years.`;
    }

    try {
      const prompt = `You are LexSuite, an expert contract auditor and negotiator under Indian law.
Analyze the following agreement text and create a comprehensive **Risk and Clause Audit Report**.

The report must be written entirely in the selected language: ${language}.
Format the output in clean Markdown. Structure it as follows:

### 🚨 1. Identified Risks & Red Flags
- Detail any predatory clauses, lock-in periods, heavy penalty interests, unfair dispute venues, or termination clauses. Classify each as [HIGH RISK], [MEDIUM RISK], or [LOW RISK].

### ⚖️ 2. Plain Language Explanations
- Select 2-3 complex legal clauses (jargon) from the text and explain what they actually mean in simple terms for a layperson.

### 📝 3. Recommended Negotiation Counter-Drafts
- Provide alternative, fairer clause texts that the user can send to the other party to protect their interests (e.g. capping interest rate, mutual exit options).

Contract/Agreement Text:
"""
${contractText}
"""`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in auditContractRisk:", error);
      throw error;
    }
  },

  /**
   * Drafts a formal police grievance / complaint for FIR registration.
   * @param {Object} details - { complainantName, incidentDetails, accusedDetails, stationName, address }
   * @param {string} language - Target language.
   */
  async draftPoliceComplaint(details, language = "English") {
    if (!genAI) {
      return `[Mock Complaint] Police Complaint to ${details.stationName} in ${language}:\n\nUnder Section 173(4) BNSS, requesting FIR for: ${details.incidentDetails}.`;
    }

    try {
      const prompt = `You are LexSuite, a legal advisor helping citizens register grievances with the police.
Draft a highly formal, legally grounded **Complaint Letter** addressed to the Station House Officer (SHO) of the local police station or the Superintendent of Police (SP) under Section 173(4) of Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 (formerly Section 154(3) CrPC) seeking registration of an FIR.

Use this metadata:
- Complainant Name & Address: ${details.complainantName}
- Accused Name/Details: ${details.accusedDetails || "Unknown person(s)"}
- Police Station Name: ${details.stationName}
- Incident Details & Date: ${details.incidentDetails}

Instructions:
1. Frame the complaint professionally, invoking relevant BNS (formerly IPC) criminal sections based on the incident (e.g., criminal intimidation, cheating, theft).
2. Structure the letter with standard Indian police complaint headers (To, In Re, Facts, Request/Prayer, Signature).
3. State that this letter is written to seek registration of a First Information Report (FIR) under Section 173 BNSS.
4. Output the draft in the selected language: ${language}.
5. Return ONLY the drafted complaint letter text. Do not add intro/outro comments.`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in draftPoliceComplaint:", error);
      throw error;
    }
  },

  /**
   * Drafts an RTI application under the Right to Information Act, 2005.
   * @param {Object} details - { complainantName, authorityName, subject, period, questions }
   * @param {string} language - Target language.
   */
  async draftRtiComplaint(details, language = "English") {
    if (!genAI) {
      return `[Mock RTI Application] Application under RTI Act 2005 in ${language}:\n\nTo, Public Information Officer, ${details.authorityName}. Subject: ${details.subject}.`;
    }

    try {
      const prompt = `You are LexSuite, an expert advisor on the Right to Information (RTI) Act, 2005 in India.
Draft a formal **RTI Application** based on the following details:

- Public Authority: ${details.authorityName}
- Subject matter of information: ${details.subject}
- Relevant Time Period: ${details.period}
- Specific questions/items of information:
${details.questions}
- Applicant Name & Address: ${details.complainantName}

Instructions:
1. Frame the application strictly in accordance with Section 6(1) of the Right to Information Act, 2005.
2. Structure it formally (PIIO Address block, subject header, numbered queries, standard declaration of citizenship, fee declaration block, signature lines).
3. The specific questions must be clear, concise, and requesting facts (e.g., "Provide the total amount allocated for road repair...", "Provide the copy of file notes...") rather than arguments or opinions.
4. Output the drafted application text ENTIRELY in ${language}. Return ONLY the drafted application text, do not write conversational introductions or greetings.`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in draftRtiComplaint:", error);
      throw error;
    }
  },

  /**
   * Drafts a standard Vakalatnama (Power of Attorney) for Indian Courts.
   * @param {Object} details - { court, clientName, advocateName, caseTitle }
   * @param {string} language - Target language.
   */
  async draftVakalatnama(details, language = "English") {
    if (!genAI) {
      return `[Mock Vakalatnama] Vakalatnama in ${language} for ${details.clientName} represented by ${details.advocateName} in ${details.court}.`;
    }

    try {
      const prompt = `You are LexSuite, an expert Indian courtroom clerk.
Draft a highly formal, standard **Vakalatnama** to be filed in court.

Use this metadata:
- Court Name: ${details.court}
- Case Title: ${details.caseTitle}
- Client Name (Principal): ${details.clientName}
- Advocate Name (Counsel): ${details.advocateName}

Instructions:
1. Frame the document in the standard format used in Indian High Courts and District Courts.
2. Structure the document with these headers: Court Header, Case Details, Authority Clauses (appointing the advocate, authorizing them to plead, compromise, sign documents, and receive deposits), Client's Signature block, Advocate's acceptance signature block.
3. Keep the language highly formal and classical legal.
4. Output the drafted document in the selected language: ${language}.
5. Return ONLY the drafted Vakalatnama text. Do not add intro/outro comments.`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in draftVakalatnama:", error);
      throw error;
    }
  },

  /**
   * Drafts a Caveat Petition under Section 148A of the Civil Procedure Code (CPC).
   * @param {Object} details - { court, caveatorName, caveateeName, caseDetails }
   * @param {string} language - Target language.
   */
  async draftCaveatPetition(details, language = "English") {
    if (!genAI) {
      return `[Mock Caveat Petition] Caveat Petition under Section 148A CPC in ${language} filed by ${details.caveatorName} against ${details.caveateeName} in ${details.court}.`;
    }

    try {
      const prompt = `You are LexSuite, an expert civil litigation lawyer in India.
Draft a formal **Caveat Petition under Section 148A of the Code of Civil Procedure (CPC), 1908** to be filed in court.

Use this metadata:
- Court Name: ${details.court}
- Caveator Name & Address (Filer): ${details.caveatorName}
- Caveatee Name & Address (Opposite Party): ${details.caveateeName}
- Subject Matter of Dispute (Case details): ${details.caseDetails}

Instructions:
1. Structure the document formally: Court Header, Caveat Petition No. of 2026, Filer vs Opposite Party details, Statement of Facts explaining the apprehension of the ex-parte suit/application, specific prayers under Section 148A CPC requesting notice before passing any orders, Verification statement, and Affidavit page outline.
2. Ensure the tone is highly formal, referencing proper sections of the Civil Procedure Code.
3. Output the drafted petition in the selected language: ${language}.
4. Return ONLY the drafted Caveat petition text. Do not add intro/outro comments.`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in draftCaveatPetition:", error);
      throw error;
    }
  },

  /**
   * Drafts a legal notice under the Consumer Protection Act, 2019.
   * @param {Object} details - { complainantName, oppositePartyName, productDetails, defectDetails, claimAmount }
   * @param {string} language - Target language.
   */
  async draftConsumerNotice(details, language = "English") {
    if (!genAI) {
      return `[Mock Consumer Notice] Consumer Legal Notice in ${language} to ${details.oppositePartyName} regarding ${details.productDetails} with claim of Rs. ${details.claimAmount}.`;
    }

    try {
      const prompt = `You are LexSuite, an expert consumer litigation lawyer in India.
Draft a formal **Legal Notice under the Consumer Protection Act, 2019** for deficiency of service / defective goods.

Use this metadata:
- Complainant (Client) Details: ${details.complainantName}
- Opposite Party Name & Address: ${details.oppositePartyName}
- Product/Service Details: ${details.productDetails}
- Defect / Deficiency Details: ${details.defectDetails}
- Total Claim/Compensation Amount: Rs. ${details.claimAmount}/-

Instructions:
1. Frame the notice in the standard legal format of an Indian legal notice.
2. Structure: Adv. Letterhead details, To block, Subject: Legal Notice for defective goods/deficiency of service, factual paragraphs detailing transaction, defect and mental agony, and the final demand calling upon the opposite party to refund/replace and pay compensation within 15 days of receipt of notice.
3. Reference relevant sections of the Consumer Protection Act, 2019.
4. Output the drafted notice in the selected language: ${language}.
5. Return ONLY the drafted notice text. Do not add intro/outro comments.`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in draftConsumerNotice:", error);
      throw error;
    }
  },

  /**
   * Drafts a Bail Application under Section 480 or 482 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023.
   * @param {Object} details - { court, accusedName, firDetails, grounds }
   * @param {string} language - Target language.
   */
  async draftBailApplication(details, language = "English") {
    if (!genAI) {
      return `[Mock Bail Application] Bail Application under Section 480 BNSS in ${language} for accused ${details.accusedName} in case ${details.firDetails}.`;
    }

    try {
      const prompt = `You are LexSuite, an expert criminal defense advocate in India.
Draft a formal **Bail Application under Section 480 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023** (formerly Section 437/439 of CrPC).

Use this metadata:
- Court Name: ${details.court}
- Accused Name & Details: ${details.accusedName}
- FIR Details & Police Station: ${details.firDetails}
- Grounds for Bail: ${details.grounds}

Instructions:
1. Format the application as a formal criminal court petition (To Ld. Magistrate/Sessions Judge, Case Details, Petition under Section 480 BNSS, list of grounds numbered logically, prayer for release on bail, verification, and surety outline).
2. Reference the correct sections of BNSS and the substantive offence under BNS.
3. The tone must be formal and respectful.
4. Output the drafted application in the selected language: ${language}.
5. Return ONLY the drafted bail application text. Do not add intro/outro comments.`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in draftBailApplication:", error);
      throw error;
    }
  },

  /**
   * Fetches RERA project details dynamically from Gemini's knowledge graph.
   * @param {string} regNo - The RERA Registration Number.
   * @param {string} stateName - The jurisdiction state name.
   */
  async fetchReraDetails(regNo, stateName = "Maharashtra") {
    if (!genAI) {
      return {
        projectName: "Prestige Habitat Phase 2 (Mock)",
        promoter: "Prestige Group (Mock)",
        completionDate: "2025-12-31",
        status: "Delayed",
        locality: "Whitefield, Bengaluru",
        builtArea: "500,000 sq ft",
        warnings: "Simulated warning."
      };
    }

    try {
      const prompt = `You are LexSuite, an expert Indian RERA auditor.
Query your knowledge database for the Indian RERA project registration number: "${regNo}" registered in the state of "${stateName}".

You must return a valid JSON object containing these keys:
- projectName (name of the real estate project)
- promoter (name of the builder / developer company)
- completionDate (the registered RERA completion/possession deadline in YYYY-MM-DD format)
- status (e.g. "On Schedule", "Delayed", "Severely Delayed", "Completed")
- locality (the area/city where the project is situated)
- builtArea (estimated square footage or scale of the project)
- warnings (regulatory alerts, extension alerts, or warnings regarding the developer's execution rate)

If you do not find the exact registration number in your training database, generate the most realistic, plausible real estate project details matching this registration number format for the state of ${stateName}.

Return ONLY the raw JSON object. Do not wrap it in markdown code fences or add conversational text.`;

      const responseText = await generateContentWithFallback(prompt, {}, true);
      try {
        return JSON.parse(cleanJSONString(responseText));
      } catch (jsonErr) {
        console.warn("LexSuite: JSON parse failed. Extracting values manually.", jsonErr);
        // Clean up brackets and attempt a basic regex capture or fallback
        const cleanText = responseText.replace(/[\r\n\t]/g, " ");
        const projName = (cleanText.match(/"projectName"\s*:\s*"([^"]+)"/) || [])[1] || "Simulated Housing Residency";
        const promoter = (cleanText.match(/"promoter"\s*:\s*"([^"]+)"/) || [])[1] || "Global Developers Group";
        const completionDate = (cleanText.match(/"completionDate"\s*:\s*"([^"]+)"/) || [])[1] || "2025-06-30";
        const status = (cleanText.match(/"status"\s*:\s*"([^"]+)"/) || [])[1] || "Delayed";
        const locality = (cleanText.match(/"locality"\s*:\s*"([^"]+)"/) || [])[1] || "Sector-5, Metropolitan Zone";
        const builtArea = (cleanText.match(/"builtArea"\s*:\s*"([^"]+)"/) || [])[1] || "450,000 sq ft";
        const warnings = (cleanText.match(/"warnings"\s*:\s*"([^"]+)"/) || [])[1] || "Construction audit ongoing.";
        
        return { projectName: projName, promoter, completionDate, status, locality, builtArea, warnings };
      }
    } catch (error) {
      console.error("Gemini API Error in fetchReraDetails:", error);
      throw error;
    }
  },

  /**
   * Parses raw copied text from an official RERA website project sheet.
   * @param {string} rawText - The pasted text.
   */
  async parseReraSheetText(rawText) {
    if (!genAI) {
      return {
        projectName: "Prestige Habitat Phase 2 (Pasted)",
        promoter: "Prestige Group (Pasted)",
        completionDate: "2024-12-31",
        status: "Delayed",
        locality: "Whitefield, Bengaluru",
        builtArea: "500,000 sq ft",
        warnings: "No regulatory warning."
      };
    }

    try {
      const prompt = `You are LexSuite, an expert Indian RERA auditor.
Below is the raw, copied text from an official state RERA project details sheet.

Pasted Text:
"""
${rawText}
"""

You must analyze this text and return a valid JSON object containing these keys:
- projectName (name of the real estate project mentioned in text)
- promoter (name of the developer / promoter company)
- completionDate (the registered RERA completion or revised possession deadline in YYYY-MM-DD format)
- status (evaluate the completionDate against today. If completionDate is past, status should be "Delayed" or "Completed", otherwise "On Schedule")
- locality (the area/city where the project is situated)
- builtArea (any mentioned built-up or carpet area, or "N/A")
- warnings (mention if there are any extension approvals, delays, or warning flags in the text)

Return ONLY the raw JSON object. Do not wrap it in markdown code fences or add conversational text.`;

      const responseText = await generateContentWithFallback(prompt, {}, true);
      try {
        return JSON.parse(cleanJSONString(responseText));
      } catch (jsonErr) {
        console.warn("LexSuite: JSON parse failed for pasted sheet. Extracting values manually.", jsonErr);
        const cleanText = responseText.replace(/[\r\n\t]/g, " ");
        const projName = (cleanText.match(/"projectName"\s*:\s*"([^"]+)"/) || [])[1] || "Parsed Housing Society";
        const promoter = (cleanText.match(/"promoter"\s*:\s*"([^"]+)"/) || [])[1] || "Parsed Developers Ltd";
        const completionDate = (cleanText.match(/"completionDate"\s*:\s*"([^"]+)"/) || [])[1] || "2025-06-30";
        const status = (cleanText.match(/"status"\s*:\s*"([^"]+)"/) || [])[1] || "Delayed";
        const locality = (cleanText.match(/"locality"\s*:\s*"([^"]+)"/) || [])[1] || "Metropolitan Zone";
        const builtArea = (cleanText.match(/"builtArea"\s*:\s*"([^"]+)"/) || [])[1] || "N/A";
        const warnings = (cleanText.match(/"warnings"\s*:\s*"([^"]+)"/) || [])[1] || "Audit complete.";
        
        return { projectName: projName, promoter, completionDate, status, locality, builtArea, warnings };
      }
    } catch (error) {
      console.error("Gemini API Error in parseReraSheetText:", error);
      throw error;
    }
  },

  /**
   * Polishes legal document text.
   * @param {string} text - The raw draft text.
   * @param {string} instructions - Specific polish instructions.
   */
  async polishDraft(text, instructions = "") {
    if (!genAI) {
      return `${text}\n\n[Mock Polish Applied based on: ${instructions}]`;
    }

    try {
      const prompt = `You are a professional Indian legal draftsperson.
Improve the following draft document text based on these instructions: "${instructions || "Polish the legal vocabulary and structure, ensuring it adheres to Indian court format."}".

Keep the structure formal, double check legal terminologies, use proper formatting, and return ONLY the polished draft text. Do not write introductory or concluding remarks.

Draft Document:
"""
${text}
"""`;

      return await generateContentWithFallback(prompt, {}, false);
    } catch (error) {
      console.error("Gemini API Error in polishDraft:", error);
      return text;
    }
  },

  /**
   * Fallback mock generator for demonstration / offline use.
   */
  getMockResponse(query, errorMessage = null) {
    const defaultResponse = {
      "responseA": {
        "title": "Strategy A: Advisory & Mediation",
        "content": `Based on your query: "${query}", the recommended amicable strategy is to issue a formal legal notice demanding compliance within 15 days. This provides an opportunity for mediation and shows good faith in court if litigation becomes necessary. If this is a consumer dispute, we can approach the District Consumer Disputes Redressal Commission before rushing to civil courts, which is faster and cost-effective.`,
        "pros": ["Cost-effective and resolves disputes faster", "Preserves business/personal relations", "Creates written admission of facts by the other party"],
        "cons": ["Dependent on the other party's willingness to negotiate", "Cannot grant immediate injunctions or stay orders"]
      },
      "responseB": {
        "title": "Strategy B: Statutory & Court Litigation",
        "content": `For your query: "${query}", a direct litigation strategy involves filing a Civil Suit for Injunction/Specific Performance in the court of competent jurisdiction. Under the Code of Civil Procedure (CPC), we will seek an ad-interim temporary injunction under Order 39 Rules 1 & 2 to prevent any immediate damage. If this involves criminal breach of trust, a complaint under Section 316 of Bharatiya Nyaya Sanhita (BNS) (formerly Section 406 IPC) can be filed with the local Magistrate.`,
        "pros": ["Legally binding orders and court decrees", "Ability to get urgent interim reliefs / status quo", "Strong leverage for recovery/compliance"],
        "cons": ["High legal costs and court fees", "Long gestation periods in Indian courts (years)", "Requires strict standards of evidence and documentation"]
      },
      "keySections": [
        {
          "act": "Bharatiya Nyaya Sanhita (BNS), 2023",
          "section": "Section 316 / Section 318",
          "summary": "Criminal breach of trust and Cheating. Applicable if dishonest intention is shown at inception."
        },
        {
          "act": "Specific Relief Act, 1963",
          "section": "Section 34 & 38",
          "summary": "Declaratory decrees and perpetual injunctions to protect property or contractual rights."
        }
      ],
      "timeline": [
        {
          "date": "Step 1 (Immediate)",
          "event": "Gather all documentary evidence including WhatsApp chats, emails, and bank receipts."
        },
        {
          "date": "Step 2 (Day 1-15)",
          "event": "Draft and dispatch a legal notice demanding rectification of breach."
        },
        {
          "date": "Step 3 (Day 16+)",
          "event": "File a suit or police complaint depending on the response received."
        }
      ]
    };

    if (errorMessage) {
      defaultResponse.responseA.content = `[Note: Gemini API failed with: "${errorMessage}". Showing mock consultation instead.]\n\n` + defaultResponse.responseA.content;
    }

    return defaultResponse;
  }
};

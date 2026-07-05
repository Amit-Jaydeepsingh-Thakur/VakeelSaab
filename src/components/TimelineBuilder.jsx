import React, { useState } from "react";
import { Plus, Trash2, Calendar, Download } from "lucide-react";

export default function TimelineBuilder({ timelineData = [], onUpdateTimeline, language = "en" }) {
  const [newDate, setNewDate] = useState("");
  const [newEvent, setNewEvent] = useState("");

  // Localization Dictionary for Timeline Builder
  const t = {
    en: {
      title: "Case Timeline Builder",
      desc: "A chronological sequence of facts. This is essential for Indian litigation (e.g., Synopsis of Dates & Events).",
      exportBtn: "Export CSV",
      addTitle: "Add Chronological Event",
      dateLabel: "Date / Timeframe",
      datePlaceholder: "e.g. 15 Jan 2026 or 12:30 PM",
      eventLabel: "Event Description",
      eventPlaceholder: "e.g. Loan Agreement signed by both parties",
      addBtn: "Add",
      emptyTitle: "No events on the timeline yet",
      emptyDesc: "Add events manually using the form above, or write details in the Consultation Room (Chat) to extract them automatically!"
    },
    hi: {
      title: "मामला समयरेखा निर्माता (Timeline)",
      desc: "तथ्यों का एक कालानुक्रमिक अनुक्रम। भारतीय अदालतों के लिए यह आवश्यक है (जैसे, तारीखों और घटनाओं का विवरण)।",
      exportBtn: "सीएसवी निर्यात करें",
      addTitle: "कालानुक्रमिक घटना जोड़ें",
      dateLabel: "तारीख / समय-सीमा",
      datePlaceholder: "उदा. 15 जनवरी 2026 या दोपहर 12:30 बजे",
      eventLabel: "घटना का विवरण",
      eventPlaceholder: "उदा. दोनों पक्षों द्वारा ऋण समझौते पर हस्ताक्षर किए गए",
      addBtn: "जोड़ें",
      emptyTitle: "समयरेखा पर अभी तक कोई घटना नहीं है",
      emptyDesc: "ऊपर दिए गए फॉर्म का उपयोग करके मैन्युअल रूप से घटनाएं जोड़ें, या उन्हें स्वचालित रूप से निकालने के लिए परामर्श कक्ष (चैट) में विवरण लिखें!"
    },
    mr: {
      title: "खटला वेळापत्रक निर्माता (Timeline)",
      desc: "तथ्यांचा कालानुक्रमिक क्रम. भारतीय न्यायालयांसाठी हे आवश्यक आहे (उदा., तारखा आणि घटनांचा गोषवारा).",
      exportBtn: "CSV निर्यात करा",
      addTitle: "कालानुक्रमिक घटना जोडा",
      dateLabel: "तारीख / वेळमर्यादा",
      datePlaceholder: "उदा. १५ जानेवारी २०२६ किंवा दुपारी १२:३० वाजता",
      eventLabel: "घटनेचे वर्णन",
      eventPlaceholder: "उदा. दोन्ही पक्षांनी कर्ज करारावर स्वाक्षरी केली",
      addBtn: "जोडा",
      emptyTitle: "वेळापत्रकावर अद्याप कोणतीही घटना नाही",
      emptyDesc: "वरील फॉर्म वापरून स्वतः घटना जोडा, किंवा सल्लामसलत कक्ष (चॅट) मध्ये मजकूर लिहून त्या स्वयंचलितपणे मिळवा!"
    }
  }[language];

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newDate.trim() || !newEvent.trim()) return;

    const updated = [
      ...timelineData,
      { date: newDate, event: newEvent }
    ];
    onUpdateTimeline(updated);
    setNewDate("");
    setNewEvent("");
  };

  const handleRemoveEvent = (index) => {
    const updated = timelineData.filter((_, i) => i !== index);
    onUpdateTimeline(updated);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Date,Event", ...timelineData.map(e => `"${e.date}","${e.event.replace(/"/g, '""')}"`)].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "case_timeline.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>{t.title}</h2>
            <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>
              {t.desc}
            </p>
          </div>
          {timelineData.length > 0 && (
            <button className="btn btn-secondary" onClick={handleExportCSV}>
              <Download size={14} /> {t.exportBtn}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>
        
        {/* Add Event Form */}
        <div style={{ background: "var(--color-cream-dark)", padding: "20px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-gray-border)" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "15px", marginBottom: "12px", color: "var(--color-navy)" }}>{t.addTitle}</h3>
          <form onSubmit={handleAddEvent} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "150px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", marginBottom: "4px" }}>{t.dateLabel}</label>
              <input
                type="text"
                className="acts-search-input"
                style={{ backgroundColor: "var(--color-white)" }}
                placeholder={t.datePlaceholder}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div style={{ flex: 2, minWidth: "250px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", marginBottom: "4px" }}>{t.eventLabel}</label>
              <input
                type="text"
                className="acts-search-input"
                style={{ backgroundColor: "var(--color-white)" }}
                placeholder={t.eventPlaceholder}
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end", height: "38px" }}>
              <Plus size={16} /> {t.addBtn}
            </button>
          </form>
        </div>

        {/* Timeline Path Display */}
        <div>
          {timelineData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-text-muted)" }}>
              <Calendar size={32} style={{ margin: "0 auto 12px", color: "var(--color-gold)" }} />
              <h4>{t.emptyTitle}</h4>
              <p style={{ fontSize: "12px", marginTop: "4px" }}>
                {t.emptyDesc}
              </p>
            </div>
          ) : (
            <div className="timeline-path">
              {timelineData.map((node, index) => (
                <div key={index} className="timeline-node">
                  <div className="timeline-node-dot"></div>
                  <div className="timeline-node-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div className="timeline-node-date">{node.date}</div>
                      <button 
                        onClick={() => handleRemoveEvent(index)}
                        style={{ border: "none", background: "none", color: "var(--color-danger)", cursor: "pointer", opacity: 0.7 }}
                        title="Delete event"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="timeline-node-event">{node.event}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

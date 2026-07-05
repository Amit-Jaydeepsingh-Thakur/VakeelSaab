import React from "react";

/**
 * Renders inline markdown elements like bold, italics, and inline code.
 */
export function parseInlineMarkdown(text) {
  if (typeof text !== "string") return text;
  
  const parts = [];
  let remaining = text;
  
  while (remaining) {
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    const italicMatch = remaining.match(/\*(.*?)\*/);
    const codeMatch = remaining.match(/`(.*?)`/);
    
    const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : -1;
    const italicIndex = italicMatch ? remaining.indexOf(italicMatch[0]) : -1;
    const codeIndex = codeMatch ? remaining.indexOf(codeMatch[0]) : -1;
    
    // Find the first match
    const indices = [
      { type: "bold", index: boldIndex, match: boldMatch },
      { type: "italic", index: italicIndex, match: italicMatch },
      { type: "code", index: codeIndex, match: codeMatch }
    ].filter(item => item.index !== -1);
    
    if (indices.length === 0) {
      parts.push(remaining);
      break;
    }
    
    // Sort to find the earliest match
    indices.sort((a, b) => a.index - b.index);
    const first = indices[0];
    
    if (first.index > 0) {
      parts.push(remaining.substring(0, first.index));
    }
    
    if (first.type === "bold") {
      parts.push(<strong key={remaining + first.index} style={{ fontWeight: "700" }}>{first.match[1]}</strong>);
    } else if (first.type === "italic") {
      parts.push(<em key={remaining + first.index} style={{ fontStyle: "italic" }}>{first.match[1]}</em>);
    } else if (first.type === "code") {
      parts.push(
        <code key={remaining + first.index} style={{ 
          backgroundColor: "var(--color-cream-dark)", 
          padding: "2px 6px", 
          borderRadius: "4px", 
          fontFamily: "monospace", 
          fontSize: "90%",
          color: "var(--color-navy-light)"
        }}>
          {first.match[1]}
        </code>
      );
    }
    
    remaining = remaining.substring(first.index + first.match[0].length);
  }
  
  return parts.length > 0 ? parts : text;
}

/**
 * Parses multi-line block markdown including tables, headers, lists, and quotes.
 */
export function renderMarkdown(text) {
  if (!text) return null;
  
  // Standardize carriage returns
  const cleanedText = text.replace(/\r\n/g, "\n");
  const blocks = cleanedText.split(/\n\n+/);
  
  return blocks.map((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    
    // 1. Table Detection
    if (trimmed.startsWith("|") && trimmed.includes("\n|")) {
      const lines = trimmed.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length >= 2) {
        const headerRow = lines[0];
        const bodyRows = lines.slice(2); // Skip header and divider rows (e.g. |---|)
        
        const headers = headerRow.split("|").map(h => h.trim()).filter(h => h !== "");
        const rows = bodyRows.map(row => 
          row.split("|").map(r => r.trim()).filter((r, idx, arr) => idx > 0 && idx < arr.length - 1)
        );
        
        return (
          <div key={index} className="table-responsive" style={{ overflowX: "auto", margin: "16px 0", width: "100%" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse", 
              fontSize: "13px", 
              border: "1px solid var(--color-gray-border)" 
            }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-cream-dark)", borderBottom: "2px solid var(--color-gray-border)" }}>
                  {headers.map((h, i) => (
                    <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontWeight: "600", border: "1px solid var(--color-gray-border)" }}>
                      {parseInlineMarkdown(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: "1px solid var(--color-gray-border)" }}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: "8px 12px", border: "1px solid var(--color-gray-border)" }}>
                        {parseInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }
    
    // 2. Headers: ### Title
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const content = parseInlineMarkdown(headerMatch[2]);
      const Tag = `h${Math.min(level + 2, 6)}`;
      return <Tag key={index} style={{ margin: "16px 0 8px", fontFamily: "var(--font-serif)", color: "var(--color-navy)", fontWeight: "600" }}>{content}</Tag>;
    }
    
    // 3. Lists (Unordered & Ordered)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.match(/^\d+\.\s/)) {
      const items = trimmed.split(/\n/);
      const isOrdered = trimmed.match(/^\d+\.\s/);
      const TagName = isOrdered ? "ol" : "ul";
      
      return (
        <TagName key={index} style={{ marginLeft: "20px", marginBottom: "12px", listStyleType: isOrdered ? "decimal" : "disc" }}>
          {items.map((item, i) => {
            const cleanItem = item.replace(/^([-*]|\d+\.)\s+/, "");
            return <li key={i} style={{ marginBottom: "6px", fontSize: "13.5px" }}>{parseInlineMarkdown(cleanItem)}</li>;
          })}
        </TagName>
      );
    }
    
    // 4. Blockquotes
    if (trimmed.startsWith(">")) {
      const quoteContent = trimmed.replace(/^>\s*/, "").split('\n').join(' ');
      return (
        <blockquote key={index} style={{ 
          borderLeft: "3px solid var(--color-gold)", 
          paddingLeft: "12px", 
          margin: "12px 0", 
          fontStyle: "italic", 
          color: "var(--color-text-muted)" 
        }}>
          {parseInlineMarkdown(quoteContent)}
        </blockquote>
      );
    }
    
    // 5. Default Paragraph
    return <p key={index} style={{ marginBottom: "12px", fontSize: "13.5px", lineHeight: "1.6" }}>{parseInlineMarkdown(trimmed)}</p>;
  });
}

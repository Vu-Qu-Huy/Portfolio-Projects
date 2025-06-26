import React from "react";
import { cn } from "@/lib/utils";

export function MarkdownRenderer({ content, className }) {
  // 1) Split into blocks: headers, lists, paragraphs
  const parseMarkdown = (text) => {
    if (!text) return [];

    const lines = text.split("\n");
    const elements = [];
    let inList = false;
    let listItems = [];

    const flushList = () => {
      if (inList && listItems.length) {
        elements.push({ type: "list", items: listItems });
        listItems = [];
      }
      inList = false;
    };

    lines.forEach((line, idx) => {
      const t = line.trim();
      // Header = **Something**
      if (t.startsWith("**") && t.endsWith("**") && t.length > 4) {
        flushList();
        elements.push({
          type: "header",
          text: t.slice(2, -2),
          key: `h-${idx}`,
        });
      }
      // Bullet
      else if (/^(\*|\-|\•)\s+/.test(t)) {
        inList = true;
        listItems.push({
          type: "bullet",
          text: t.replace(/^(\*|\-|\•)\s+/, ""),
          key: `li-${idx}`,
        });
      }
      // Numbered
      else if (/^\d+\.\s+/.test(t)) {
        inList = true;
        listItems.push({
          type: "number",
          text: t.replace(/^\d+\.\s+/, ""),
          key: `li-${idx}`,
        });
      }
      // Empty line = break paragraph or list
      else if (!t) {
        flushList();
      }
      // Paragraph
      else {
        flushList();
        elements.push({
          type: "paragraph",
          text: t,
          key: `p-${idx}`,
        });
      }
    });

    flushList();
    return elements;
  };

  // 2) Inline formatting: code, bold, italic
  const renderInlineFormatting = (text) => {
    if (!text) return null;
    const tokenRE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const parts = [];
    let last = 0,
      m;

    while ((m = tokenRE.exec(text)) !== null) {
      // plain text before token
      if (m.index > last) {
        parts.push(text.slice(last, m.index));
      }
      const tok = m[0];
      // **bold**
      if (tok.startsWith("**") && tok.endsWith("**")) {
        parts.push(
          <strong
            key={`b${m.index}`}
            className="font-bold text-purple-700 dark:text-purple-300"
          >
            {tok.slice(2, -2)}
          </strong>
        );
      }
      // *italic*
      else if (tok.startsWith("*") && tok.endsWith("*")) {
        parts.push(
          <em key={`i${m.index}`} className="italic">
            {tok.slice(1, -1)}
          </em>
        );
      }
      // `code`
      else if (tok.startsWith("`") && tok.endsWith("`")) {
        parts.push(
          <code
            key={`c${m.index}`}
            className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded text-sm font-fira"
          >
            {tok.slice(1, -1)}
          </code>
        );
      }
      last = m.index + tok.length;
    }

    // trailing text
    if (last < text.length) {
      parts.push(text.slice(last));
    }

    return parts.length > 1 ? parts : parts[0] ?? text;
  };

  const blocks = parseMarkdown(content);

  return (
    <div className={cn("space-y-4", className)}>
      {blocks.map((blk) => {
        switch (blk.type) {
          case "header":
            return (
              <h3
                key={blk.key}
                className="text-lg font-semibold text-purple-700 dark:text-purple-300 font-orbitron border-b border-purple-200 dark:border-purple-700 pb-2"
              >
                {renderInlineFormatting(blk.text)}
              </h3>
            );

          case "list":
            return (
              <ul
                key={blk.items[0]?.key}
                className="space-y-2 ml-6 list-inside"
              >
                {blk.items.map((it, i) => (
                  <li
                    key={it.key}
                    className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start gap-2"
                  >
                    <span className="flex-shrink-0 mt-1 text-purple-500 dark:text-purple-400">
                      {it.type === "number" ? `${i + 1}.` : "•"}
                    </span>
                    <span>{renderInlineFormatting(it.text)}</span>
                  </li>
                ))}
              </ul>
            );

          case "paragraph":
            return (
              <p
                key={blk.key}
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                {renderInlineFormatting(blk.text)}
              </p>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

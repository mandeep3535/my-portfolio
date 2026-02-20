// ============================================================
// MessageBubble.tsx
//
// Receives `colClass` (the shared COL string from ChatWindow)
// and applies it to BOTH user and assistant rows so all content
// sits inside the same centred column.
//
// User bubble:      right-aligned inside COL  (not the viewport)
// Assistant bubble: left-aligned inside COL with tinted full-width stripe
// ============================================================

import React from "react";
import type { ChatMessage } from "../utils/chatEngine";
import PromptChips from "./PromptChips";

interface MessageBubbleProps {
  message: ChatMessage;
  isDark: boolean;
  onChipClick: (label: string) => void;
  /** Shared centred-column Tailwind classes passed down from ChatWindow. */
  colClass: string;
}

// Mini Markdown renderer 

function renderMarkdown(text: string, isDark: boolean): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    if (line === "") {
      elements.push(<br key={`br-${lineIdx}`} />);
      return;
    }

    const headingMatch = line.match(/^\*\*(.+)\*\*$/);
    if (headingMatch) {
      elements.push(
        <p key={lineIdx} className={`font-semibold mt-3 mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
          {headingMatch[1]}
        </p>
      );
      return;
    }

    const isBullet = line.startsWith("â€¢ ") || line.startsWith("- ");
    if (isBullet) {
      elements.push(
        <div key={lineIdx} className="flex gap-2 my-0.5">
          <span className="mt-0.5 shrink-0 text-emerald-500">â€¢</span>
          <span>{parseInline(line.replace(/^[â€¢\-]\s*/, ""), isDark, lineIdx)}</span>
        </div>
      );
    } else {
      elements.push(<span key={lineIdx}>{parseInline(line, isDark, lineIdx)}</span>);
    }
  });

  return elements;
}

function parseInline(text: string, isDark: boolean, lineKey: number): React.ReactNode[] {
  const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)|_(.+?)_)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<React.Fragment key={`${lineKey}-t${i}`}>{text.slice(lastIndex, match.index)}</React.Fragment>);
    }
    if (match[0].startsWith("**")) {
      parts.push(<strong key={`${lineKey}-b${i}`} className={isDark ? "text-white" : "text-gray-900"}>{match[2]}</strong>);
    } else if (match[0].startsWith("[")) {
      parts.push(
        <a key={`${lineKey}-a${i}`} href={match[4]} target="_blank" rel="noopener noreferrer"
          className="text-emerald-500 underline hover:text-emerald-400 transition-colors">
          {match[3]}
        </a>
      );
    } else if (match[0].startsWith("_")) {
      parts.push(<em key={`${lineKey}-i${i}`} className="opacity-80">{match[5]}</em>);
    }
    lastIndex = match.index + match[0].length;
    i++;
  }

  if (lastIndex < text.length) {
    parts.push(<React.Fragment key={`${lineKey}-end`}>{text.slice(lastIndex)}</React.Fragment>);
  }
  return parts;
}

// Component 
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isDark, onChipClick, colClass }) => {
  const isUser = message.role === "user";

  if (isUser) {
    //  User message 
    // Outer row: full width so background covers edge-to-edge on scroll
    // Inner container: same COL as everything else â†’ bubble aligns to
    // the RIGHT edge of the column, never the screen edge.
    return (
      <div className="w-full py-2">
        <div className={colClass}>
          <div className="flex justify-end">
            <div
              className={`
                max-w-[70%] px-4 py-2.5
                rounded-2xl rounded-tr-sm text-sm leading-relaxed
                ${isDark ? "bg-emerald-600 text-white" : "bg-emerald-500 text-white"}
              `}
            >
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ Assistant message â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Full-width coloured stripe, content inside the same COL.
  return (
    <div className={`w-full py-4 ${isDark ? "bg-[#444654]" : "bg-gray-50/80"}`}>
      <div className={colClass}>
        <div className="flex gap-3 items-start">

          {/* Avatar */}
          <div
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #10a37f 0%, #1a7f64 100%)" }}
            aria-label="Portfolio Assistant avatar"
          >
            MS
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold mb-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Portfolio Assistant
            </p>
            <div className={`text-sm leading-7 space-y-0.5 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {renderMarkdown(message.content, isDark)}
            </div>

            {message.chips && message.chips.length > 0 && (
              <PromptChips
                chips={message.chips}
                onChipClick={onChipClick}
                isDark={isDark}
                scrollable
                className="mt-3"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

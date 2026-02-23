// ============================================================
// markdown.tsx
// Pure utility functions for rendering a lightweight subset of
// Markdown into React elements.
//
// WHY this exists:
// The assistant chatbot returns plain-text responses that use
// **bold**, _italic_, [links](url), and bullet lists.  Rather
// than pull in a full Markdown library (remark / marked), these
// two small functions handle just the syntax we actually use —
// keeping the bundle tiny.
//
// WHAT it supports:
//   **bold text**        → <strong>
//   _italic text_        → <em>
//   [label](url)         → <a> (opens in new tab)
//   Lines starting with  → bullet list items (• or -)
//   Blank lines          → <br> spacers
//   **Full-line bold**   → treated as a heading (<p> + font-semibold)
//
// Used exclusively by MessageBubble.tsx to render assistant
// message content.
// ============================================================

import React from "react";

// ─── Block-level renderer ─────────────────────────────────────────────────────
// Splits the full message on newlines and converts each line into the
// appropriate React node:  heading, bullet, blank line, or plain paragraph.

export function renderMarkdown(text: string, isDark: boolean): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    // Blank line → simple line break to create visual spacing
    if (line === "") {
      elements.push(<br key={`br-${lineIdx}`} />);
      return;
    }

    // Full-line bold  →  heading-style paragraph
    // e.g. "**About Me**" becomes <p class="font-semibold">About Me</p>
    const headingMatch = line.match(/^\*\*(.+)\*\*$/);
    if (headingMatch) {
      elements.push(
        <p
          key={lineIdx}
          className={`font-semibold mt-3 mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {headingMatch[1]}
        </p>
      );
      return;
    }

    // Bullet item  →  dot + inline-parsed content
    // Matches lines starting with "• " or "- "
    const isBullet = line.startsWith("\u2022 ") || line.startsWith("- ");
    if (isBullet) {
      elements.push(
        <div key={lineIdx} className="flex gap-2 my-0.5">
          <span className="mt-0.5 shrink-0 text-emerald-500">&bull;</span>
          <span>{parseInline(line.replace(/^[\u2022\-]\s*/, ""), isDark, lineIdx)}</span>
        </div>
      );
    } else {
      // Plain text line → run inline parser for bold / italic / links
      elements.push(
        <span key={lineIdx}>{parseInline(line, isDark, lineIdx)}</span>
      );
    }
  });

  return elements;
}

// ─── Inline renderer ──────────────────────────────────────────────────────────
// Scans a single line of text for inline patterns:
//   **bold**    →  <strong>
//   _italic_    →  <em>
//   [text](url) →  <a>
// Everything between matches is emitted as plain text fragments.

export function parseInline(
  text: string,
  isDark: boolean,
  lineKey: number
): React.ReactNode[] {
  // Regex matches bold **…**, links [text](url), and italic _…_ in one pass
  const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)|_(.+?)_)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;             // tracks how far we've consumed the string
  let match: RegExpExecArray | null;
  let i = 0;                     // counter for unique React keys

  while ((match = regex.exec(text)) !== null) {
    // Push any plain text that sits before this match
    if (match.index > lastIndex) {
      parts.push(
        <React.Fragment key={`${lineKey}-t${i}`}>
          {text.slice(lastIndex, match.index)}
        </React.Fragment>
      );
    }

    if (match[0].startsWith("**")) {
      // Bold text
      parts.push(
        <strong
          key={`${lineKey}-b${i}`}
          className={isDark ? "text-white" : "text-gray-900"}
        >
          {match[2]}
        </strong>
      );
    } else if (match[0].startsWith("[")) {
      // Markdown link → opens in a new tab
      parts.push(
        <a
          key={`${lineKey}-a${i}`}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-500 underline hover:text-emerald-400 transition-colors"
        >
          {match[3]}
        </a>
      );
    } else if (match[0].startsWith("_")) {
      // Italic text
      parts.push(
        <em key={`${lineKey}-i${i}`} className="opacity-80">
          {match[5]}
        </em>
      );
    }

    lastIndex = match.index + match[0].length;
    i++;
  }

  // Push any remaining plain text after the last match
  if (lastIndex < text.length) {
    parts.push(
      <React.Fragment key={`${lineKey}-end`}>
        {text.slice(lastIndex)}
      </React.Fragment>
    );
  }

  return parts;
}

// ============================================================
// MessageBubble.tsx  — Renders a single chat message
//
// Two visual styles:
//   • USER bubble   — small green pill, right-aligned inside COL
//   • ASSISTANT row — full-width tinted stripe with avatar + content
//
// Both styles sit inside the same centred column (`colClass`)
// so they align perfectly with the input bar and typing indicator.
//
// The assistant variant also runs a "typewriter" streaming
// animation: text appears character-by-character, finishing in
// ~2.5 seconds regardless of content length.
// ============================================================

import { useState, useEffect } from "react";
import type { FC } from "react";
import type { ChatMessage } from "../utils/chatEngine";
import { renderMarkdown } from "../utils/markdown";
import { AVATAR_GRADIENT, AVATAR_INITIALS } from "./ChatWindow";
import PromptChips from "./PromptChips";

// ─── Props ────────────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: ChatMessage;
  isDark: boolean;
  /** Fires when the user clicks a suggestion chip below the message. */
  onChipClick: (label: string) => void;
  /** Shared centred-column Tailwind classes from ChatWindow (e.g. COL). */
  colClass: string;
  /** When true, the assistant content animates in character-by-character. */
  isStreaming?: boolean;
  /** Callback fired once the typewriter animation reaches the end. */
  onStreamDone?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const MessageBubble: FC<MessageBubbleProps> = ({
  message, isDark, onChipClick, colClass, isStreaming = false, onStreamDone,
}) => {
  const isUser = message.role === "user";

  // ── Streaming typewriter state (assistant only) ──────────────────────
  // `displayed` holds the portion of the message shown so far.
  // When isStreaming = true we start at "" and grow character-by-character.
  // When isStreaming = false (older messages) we show the full content.
  const [displayed, setDisplayed] = useState(isStreaming ? "" : message.content);
  const [streamDone, setStreamDone] = useState(!isStreaming);

  useEffect(() => {
    // For messages that aren't streaming, just show everything immediately.
    if (!isStreaming) {
      setDisplayed(message.content);
      setStreamDone(true);
      return;
    }

    // Begin the typewriter animation from scratch.
    setDisplayed("");
    setStreamDone(false);

    const full = message.content;
    // Pace: we want the animation to finish in roughly 2.5 seconds
    // regardless of how long the reply is.
    // 150 ticks × 16 ms/tick ≈ 2400 ms.  So charsPerTick = length / 150.
    const charsPerTick = Math.max(1, Math.ceil(full.length / 150));
    let pos = 0;

    const id = setInterval(() => {
      pos = Math.min(pos + charsPerTick, full.length);
      setDisplayed(full.slice(0, pos));
      if (pos >= full.length) {
        clearInterval(id);
        setStreamDone(true);
        onStreamDone?.();      // tell ChatWindow the animation is done
      }
    }, 16);

    return () => clearInterval(id);   // cleanup if component unmounts mid-animation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming, message.id]);
  // ────────────────────────────────────────────────────────────────────────

  if (isUser) {
    // ── User message ───────────────────────────────────────────────────
    // Green rounded pill, narrower on desktop but roomy on phones.
    // The outer `w-full` wrapper ensures the bg covers edge-to-edge.
    return (
      <div className="w-full py-2">
        <div className={colClass}>
          <div className="flex justify-end">
            <div
              className={`
                max-w-[90%] sm:max-w-[70%] px-4 py-2.5
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

  // ── Assistant message ─────────────────────────────────────────────────
  // Full-width tinted stripe (dark or light) with the content inside COL.
  return (
    <div className={`w-full py-4 ${isDark ? "bg-[#444654]" : "bg-gray-50/80"}`}>
      <div className={colClass}>
        <div className="flex gap-3 items-start">

          {/* Avatar — uses the shared gradient + initials from ChatWindow */}
          <div
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: AVATAR_GRADIENT }}
            aria-label="Portfolio Assistant avatar"
          >
            {AVATAR_INITIALS}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold mb-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Portfolio Assistant
            </p>
            {/* Rendered Markdown content — converted by utils/markdown.tsx */}
            <div className={`text-sm leading-6 sm:leading-7 space-y-0.5 break-words whitespace-pre-wrap ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {renderMarkdown(displayed, isDark)}
              {/* Blinking cursor that shows while text is still streaming */}
              {!streamDone && (
                <span className="inline-block w-[2px] h-[1em] ml-0.5 bg-current align-middle animate-pulse" />
              )}
            </div>

            {/* Only show suggestion chips once streaming is done */}
            {streamDone && message.chips && message.chips.length > 0 && (
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
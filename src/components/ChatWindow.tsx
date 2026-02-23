// ============================================================
// ChatWindow.tsx  — The main chat conversation panel
//
// This component is the centrepiece of the portfolio.
// It shows either:
//   • The ProfileHero welcome card (when there are 0 messages), OR
//   • A scrollable list of MessageBubble components.
//
// Layout strategy
// ---------------
// Every visible row — hero, messages, typing indicator, AND the
// input bar — shares one centred-column class:
//
//   COL = "max-w-[780px] mx-auto w-full px-4 sm:px-6"
//
// This keeps user bubbles, assistant text, and the input box
// perfectly aligned horizontally regardless of screen width.
//
// The two thin dark strips at the very top and bottom of this
// panel are "cinematic letterbox" borders — purely decorative.
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import type { FC, KeyboardEvent, ChangeEvent } from "react";
import type { ChatMessage } from "../utils/chatEngine";
import { processMessage } from "../utils/chatEngine";
import MessageBubble from "./MessageBubble";
import PromptChips from "./PromptChips";
import ProfileHero from "./ProfileHero";
import resumeData from "../data/resumeData";
import avatarImg from "../assets/profile_image.png";

// ─── Shared constants ─────────────────────────────────────────────────────────

// The avatar shown next to every assistant message + the typing dots.
// Defined once here so we don't repeat the same gradient + initials
// in multiple places.
export const AVATAR_GRADIENT = "linear-gradient(135deg, #10a37f 0%, #1a7f64 100%)";
export const AVATAR_INITIALS = "MS";

// Curated badge list shown on the ProfileHero welcome card.
// Picked from the most recognisable skills in resumeData.
const HERO_BADGES = [
  "React", "TypeScript", "Java", "Spring Boot",
  "MySQL", "Docker", "Tailwind CSS", "REST APIs",
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface ChatWindowProps {
  isDark: boolean;
  /** Query string injected by the Sidebar — `null` when idle. */
  pendingQuery: string | null;
  /** Callback that tells App.tsx "I consumed the pending query, clear it." */
  onPendingQueryConsumed: () => void;
  /** Incremented by the "New Chat" button to reset conversation. */
  clearSignal: number;
}

// How long (ms) the "typing" dots animate before the bot reply appears.
const TYPING_DELAY_MS = 750;

// Shared centred-column class — every row uses this so the reading
// width stays consistent.  Change this ONE constant to adjust globally.
const COL = "max-w-[780px] mx-auto w-full px-4 sm:px-6";

// ─── Component ────────────────────────────────────────────────────────────────

const ChatWindow: FC<ChatWindowProps> = ({
  isDark,
  pendingQuery,
  onPendingQueryConsumed,
  clearSignal,
}) => {
  // ── Chat state ──────────────────────────────────────────────────────────
  // Start empty — the ProfileHero card acts as the welcome screen.
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);  // true while "bot is typing" dots show
  // ID of the assistant message currently doing the typewriter animation.
  // null = no animation in progress.
  const [streamingId, setStreamingId] = useState<string | null>(null);

  // ── Refs ────────────────────────────────────────────────────────────
  const bottomRef = useRef<HTMLDivElement>(null);  // invisible div at the bottom of the scroll area
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  /** Smoothly scroll the message list so the newest message is visible. */
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /**
   * Send a message as the user.
   * 1. Creates a user ChatMessage and appends it.
   * 2. Shows the typing indicator for TYPING_DELAY_MS.
   * 3. Calls processMessage() from chatEngine to get the bot reply.
   * 4. Appends the reply and starts the typewriter animation.
   */
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      setTimeout(() => {
        const reply = processMessage(trimmed);
        setMessages((prev) => [...prev, reply]);
        setIsTyping(false);
        setStreamingId(reply.id); // begin typewriter animation
      }, TYPING_DELAY_MS);
    },
    [isTyping]
  );

  // Auto-scroll whenever a new message arrives or typing starts.
  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  // "New Chat" effect — when clearSignal increments, wipe everything.
  // ProfileHero re-appears because messages becomes [].
  useEffect(() => {
    if (clearSignal > 0) {
      setMessages([]);
      setInputValue("");
      setStreamingId(null);
      inputRef.current?.focus();
    }
  }, [clearSignal]);

  // Sidebar bridge — when a sidebar link sets `pendingQuery`, treat
  // it exactly like the user typed that text and pressed Enter.
  useEffect(() => {
    if (pendingQuery) {
      sendMessage(pendingQuery);
      onPendingQueryConsumed();
    }
  }, [pendingQuery, sendMessage, onPendingQueryConsumed]);

  /** Enter = send, Shift+Enter = newline (standard chat UX). */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  /** Auto-resize the textarea as the user types (up to 140 px tall). */
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  // ── Derived colour classes ────────────────────────────────────────
  const chatBg    = isDark ? "bg-[#343541]"    : "bg-white";
  const inputBg   = isDark ? "bg-[#40414f]"    : "bg-gray-100";
  const inputText = isDark ? "text-gray-100"   : "text-gray-900";
  const textMuted = isDark ? "text-gray-400"   : "text-gray-500";
  const borderCol = isDark ? "border-white/10" : "border-gray-200";

  const hasMessages = messages.length > 0;

  return (
    <div className={`flex flex-col flex-1 w-full overflow-hidden ${chatBg}`}>

      {/* ── Dashboard header — always visible, edge-to-edge ──────────── */}
      {/* TODO: swap avatarUrl to a real hosted photo once available     */}
      <ProfileHero
        name={resumeData.name}
        title={resumeData.title}
        avatarUrl={avatarImg}
        location="Kelowna, BC · Open to remote"
        badges={HERO_BADGES}
        onSend={sendMessage}
        isDark={isDark}
      />

      {/* Scrollable message list */}
      <div className="flex-1 overflow-y-auto" aria-live="polite" aria-label="Chat conversation">

        {/* Empty state — shown when there are no messages yet */}
        {!hasMessages && (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-6 pb-16 select-none">

            {/* Icon */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: AVATAR_GRADIENT }}>
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              {/* Subtle pulse ring */}
              <div className="absolute inset-0 rounded-2xl animate-ping" style={{ background: AVATAR_GRADIENT, opacity: 0.25, animationDuration: "2.5s" }} />
            </div>

            {/* Heading + subtitle */}
            <div className="text-center space-y-1.5">
              <p className={`text-base font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                Ask me anything about Mandeep
              </p>
              <p className={`text-[12px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Get answers about his background, projects, skills, and more.
              </p>
            </div>

            {/* Quick-start chips */}
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
              {["About Mandeep", "Show projects", "View skills", "Work experience", "Education", "Contact"].map((label) => (
                <button
                  key={label}
                  onClick={() => sendMessage(label)}
                  className={`
                    px-3.5 py-1.5 rounded-full text-[12px] font-medium border
                    transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0
                    ${isDark
                      ? "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 shadow-sm"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message rows - each row renders inside COL via MessageBubble */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isDark={isDark}
            onChipClick={sendMessage}
            colClass={COL}
            isStreaming={msg.id === streamingId}
            onStreamDone={() => setStreamingId(null)}
          />
        ))}

        {/* Typing indicator — three bouncing dots with the bot avatar */}
        {isTyping && (
          <div className={`w-full py-4 ${isDark ? "bg-[#444654]" : "bg-gray-50/80"}`}>
            <div className={COL}>
              <div className="flex gap-3 items-start">
                {/* Re-uses the same avatar style as assistant messages */}
                <div
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: AVATAR_GRADIENT }}
                >
                  {AVATAR_INITIALS}
                </div>
                <div className="flex items-center gap-1 pt-2.5" aria-label="Typing indicator">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar
           Uses the identical COL container so the text box sits
           flush below the last message, not wider or narrower.    */}
      <div className={`shrink-0 border-t ${borderCol} py-3 pb-safe`}>
        <div className={COL}>

          {/* Chip strip - scrolls horizontally on mobile */}
          {hasMessages && !isTyping && (
            <PromptChips
              chips={["About Mandeep", "Show projects", "View skills", "Contact"]}
              onChipClick={sendMessage}
              isDark={isDark}
              scrollable
              className="mb-2"
            />
          )}

          {/* Input field + send button */}
          <div
            className={`
              flex items-end gap-2 px-4 py-3 rounded-xl border
              ${inputBg} ${borderCol}
              focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500
              transition-all duration-150
            `}
          >
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder='Message... or try "/help"'
              rows={1}
              aria-label="Message input"
              disabled={isTyping}
              className={`
                flex-1 resize-none bg-transparent outline-none text-sm leading-6
                ${inputText} placeholder:text-gray-400
                disabled:opacity-50 max-h-32 overflow-y-auto
              `}
              style={{ height: "24px" }}
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
              className={`
                shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                transition-all duration-150
                ${inputValue.trim() && !isTyping
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  : `${isDark ? "bg-white/10 text-gray-600" : "bg-gray-300 text-gray-400"} cursor-not-allowed`
                }
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          <p className={`hidden sm:block text-center text-xs mt-2 ${textMuted}`}>
            This portfolio is powered by resume data. Responses are pre-programmed.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ChatWindow;
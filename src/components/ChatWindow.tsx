// ============================================================
// ChatWindow.tsx
// The main chat area.
//
// Layout strategy
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Every visible row â€” welcome hero, messages, typing indicator,
// AND the input bar â€” shares one centred column:
//
//   COL = "max-w-[780px] mx-auto w-full px-4 sm:px-6"
//
// This guarantees user bubbles align to the right edge of that
// column (not the screen edge), and the input box sits directly
// below the last message with identical horizontal margins.
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage } from "../utils/chatEngine";
import { processMessage, getWelcomeMessage, defaultChips } from "../utils/chatEngine";
import MessageBubble from "./MessageBubble";
import PromptChips from "./PromptChips";
import resumeData from "../data/resumeData";

interface ChatWindowProps {
  isDark: boolean;
  pendingQuery: string | null;
  onPendingQueryConsumed: () => void;
  clearSignal: number;
}

const TYPING_DELAY_MS = 750;

// Shared column class â€” used by EVERY row including the input bar.
// Change this one constant to adjust the max reading width globally.
const COL = "max-w-[780px] mx-auto w-full px-4 sm:px-6";

const ChatWindow: React.FC<ChatWindowProps> = ({
  isDark,
  pendingQuery,
  onPendingQueryConsumed,
  clearSignal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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
      }, TYPING_DELAY_MS);
    },
    [isTyping]
  );

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);
  useEffect(() => { setMessages([getWelcomeMessage()]); }, []);

  useEffect(() => {
    if (clearSignal > 0) {
      setMessages([getWelcomeMessage()]);
      setInputValue("");
      inputRef.current?.focus();
    }
  }, [clearSignal]);

  useEffect(() => {
    if (pendingQuery) {
      sendMessage(pendingQuery);
      onPendingQueryConsumed();
    }
  }, [pendingQuery, sendMessage, onPendingQueryConsumed]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  const chatBg    = isDark ? "bg-[#343541]"    : "bg-white";
  const inputBg   = isDark ? "bg-[#40414f]"    : "bg-gray-100";
  const inputText = isDark ? "text-gray-100"   : "text-gray-900";
  const textMuted = isDark ? "text-gray-400"   : "text-gray-500";
  const borderCol = isDark ? "border-white/10" : "border-gray-200";

  const hasMessages = messages.length > 0;

  return (
    <div className={`flex flex-col flex-1 w-full overflow-hidden ${chatBg}`}>

      {/* â”€â”€ Scrollable message list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex-1 overflow-y-auto" aria-live="polite" aria-label="Chat conversation">

        {/* â”€â”€ Welcome hero (empty state) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {!hasMessages && (
          <div className="flex flex-col items-center justify-center min-h-full py-16 text-center">
            {/* Reuse COL for horizontal padding so hero aligns with messages */}
            <div className={COL}>
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold mb-5 mx-auto"
                style={{ background: "linear-gradient(135deg, #10a37f 0%, #1a7f64 100%)" }}
              >
                MS
              </div>
              <h1 className={`text-xl sm:text-2xl font-semibold mb-1.5 ${isDark ? "text-white" : "text-gray-900"}`}>
                {resumeData.name}
              </h1>
              <p className={`text-sm sm:text-base mb-6 ${textMuted}`}>{resumeData.title}</p>
              <PromptChips
                chips={defaultChips}
                onChipClick={sendMessage}
                isDark={isDark}
                className="justify-center"
              />
            </div>
          </div>
        )}

        {/* â”€â”€ Message rows â€” each row renders inside COL via MessageBubble */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isDark={isDark}
            onChipClick={sendMessage}
            colClass={COL}
          />
        ))}

        {/* â”€â”€ Typing indicator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {isTyping && (
          // Full-width tinted stripe, content constrained to COL
          <div className={`w-full py-4 ${isDark ? "bg-[#444654]" : "bg-gray-50/80"}`}>
            <div className={COL}>
              <div className="flex gap-3 items-start">
                <div
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #10a37f 0%, #1a7f64 100%)" }}
                >
                  MS
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

      {/* â”€â”€ Input bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           Uses the identical COL container so the text box sits
           flush below the last message, not wider or narrower.    */}
      <div className={`shrink-0 border-t ${borderCol} py-3 pb-safe`}>
        <div className={COL}>

          {/* Chip strip â€” scrolls horizontally on mobile */}
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
              placeholder='Messageâ€¦ or try "/help"'
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


// ============================================================
// App.tsx
// Root component — owns theme state, sidebar open/close state,
// and the "pending query" bridge between Sidebar and ChatWindow.
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

function App() {
  // ── Theme ────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Persist theme choice in localStorage
    const saved = localStorage.getItem("portfolio-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply / remove the `dark` class on <html> for Tailwind dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  // ── Sidebar (mobile) ─────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Bridge: section click → ChatWindow ───────────────────────
  // When user clicks a sidebar section, we store the query here.
  // ChatWindow watches this prop, fires the message, then clears it.
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const handleSectionClick = useCallback((query: string) => {
    setPendingQuery(query);
  }, []);

  // ── New Chat signal ───────────────────────────────────────────
  // Increment this number to tell ChatWindow to reset.
  const [clearSignal, setClearSignal] = useState(0);
  const handleNewChat = useCallback(() => {
    setClearSignal((n) => n + 1);
    setSidebarOpen(false);
  }, []);

  // ── Hamburger button ref (mobile) ─────────────────────────────
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // ── Derived styles ────────────────────────────────────────────
  const headerBg  = isDark ? "bg-[#343541] border-white/10" : "bg-white border-gray-200";
  const textMain  = isDark ? "text-gray-100" : "text-gray-800";
  const hoverBg   = isDark ? "hover:bg-white/10" : "hover:bg-gray-100";

  return (
    // w-full ensures the flex shell covers the entire viewport width.
    // h-[100dvh] = dynamic viewport height — accounts for iOS Safari chrome bar.
    <div className="flex w-full h-[100dvh] overflow-hidden">

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <Sidebar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onSectionClick={handleSectionClick}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main area ──────────────────────────────────────────────────── */}
      {/* overflow-hidden keeps this column from leaking outside the flex shell */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <header
          className={`
            lg:hidden flex items-center justify-between px-4 py-3 border-b shrink-0
            ${headerBg}
          `}
        >
          {/* Hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            className={`p-2 rounded-lg ${hoverBg} ${textMain}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className={`text-sm font-semibold ${textMain}`}>Portfolio Assistant</span>

          {/* New chat shortcut */}
          <button
            onClick={handleNewChat}
            aria-label="New chat"
            className={`p-2 rounded-lg ${hoverBg} ${textMain}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0111 16.5H9v-2a2 2 0 01.586-1.414z" />
            </svg>
          </button>
        </header>

        {/* Chat window — flex-1 fills all remaining height inside this flex-col */}
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <ChatWindow
            isDark={isDark}
            pendingQuery={pendingQuery}
            onPendingQueryConsumed={() => setPendingQuery(null)}
            clearSignal={clearSignal}
          />
        </main>
      </div>
    </div>
  );
}

export default App;

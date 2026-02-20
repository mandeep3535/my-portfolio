// ============================================================
// App.tsx  — Root component
//
// This is the top of the React tree.  It owns ALL shared state
// and passes it down as props.  Nothing else in the app calls
// useState for these values — single source of truth.
//
// Shared state managed here:
//   • isDark        – light / dark theme
//   • sidebarOpen   – mobile left-nav drawer
//   • pendingQuery  – bridge between Sidebar click → ChatWindow
//   • clearSignal   – incremented to reset the conversation
//   • activeProjectId / rightOpen – right project sidebar
//
// Layout (left → right):
//   [Sidebar]  [Main chat column]  [RightProjectSidebar]
// ============================================================

import { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import RightProjectSidebar from "./components/RightProjectSidebar";
import projects from "./data/projects";

function App() {
  // ── Theme (light / dark) ──────────────────────────────────────
  // On first load: check localStorage for a saved preference;
  // if none, fall back to the user's OS-level setting.
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Whenever isDark changes, toggle the "dark" class on <html>
  // (Tailwind reads this class for all dark: variants) and
  // persist the choice so it survives page refreshes.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  // ── Sidebar (mobile) ─────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Bridge: Sidebar section click → ChatWindow ───────────────
  // When the user clicks a nav link in the Sidebar (e.g. "Projects"),
  // we store that query text here.  ChatWindow watches `pendingQuery`,
  // sends it as if the user typed it, then calls back to clear it.
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

  // ── Right Project Sidebar ─────────────────────────────────────
  // activeProjectId: which project card is highlighted + previewed.
  // rightOpen: mobile drawer toggle (hidden on lg+).
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [rightOpen, setRightOpen] = useState(false);

  const handleSelectProject = useCallback((id: string) => {
    // Toggle: clicking the active project deselects it.
    setActiveProjectId((prev) => (prev === id ? null : id));
    setRightOpen(false); // close drawer on mobile after selection
  }, []);

  // ── Derived styles ────────────────────────────────────────────
  // Pre-computed Tailwind class strings for the mobile header bar.
  // Avoids repeating ternaries in the JSX.
  const headerBg  = isDark ? "bg-[#343541] border-white/10" : "bg-white border-gray-200";
  const textMain  = isDark ? "text-gray-100" : "text-gray-800";
  const hoverBg   = isDark ? "hover:bg-white/10" : "hover:bg-gray-100";

  return (
    // The outermost flex row: fills the full screen.
    // h-[100dvh] = "dynamic viewport height" — shrinks when the iOS
    // keyboard opens so the layout never overflows the visible area.
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

      {/* ── Main area (centre column) ──────────────────────────────────── */}
      {/* flex-col so mobile header + chat stack vertically.
          min-w-0 prevents this column from expanding beyond the flex shell. */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <header
          className={`
            lg:hidden flex items-center justify-between px-4 py-3 border-b shrink-0
            ${headerBg}
          `}
        >
          {/* Hamburger — opens the left sidebar drawer on mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            className={`p-2 rounded-lg ${hoverBg} ${textMain}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className={`text-sm font-semibold ${textMain}`}>Portfolio Assistant</span>

          {/* Right panel: Projects toggle (mobile) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setRightOpen(true)}
              aria-label="Open project hub"
              className={`p-2 rounded-lg ${hoverBg} ${textMain}`}
            >
              {/* Briefcase / projects icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M9 5V3h6v2" />
              </svg>
            </button>

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
          </div>
        </header>

        {/* Chat window occupies all remaining vertical space below the header. */}
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <ChatWindow
            isDark={isDark}
            pendingQuery={pendingQuery}
            onPendingQueryConsumed={() => setPendingQuery(null)}
            clearSignal={clearSignal}
          />
        </main>
      </div>

      {/* ── Right Project Sidebar ──────────────────────────────────────── */}
      {/* Desktop (lg+): always-visible static column beside the chat.      */}
      {/* Mobile (<lg): fixed drawer that slides in from the right.         */}
      <RightProjectSidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        isDark={isDark}
        isOpen={rightOpen}
        onClose={() => setRightOpen(false)}
      />
    </div>
  );
}

export default App;

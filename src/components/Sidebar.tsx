// ============================================================
// Sidebar.tsx  — Left navigation panel
//
// Mirrors the ChatGPT sidebar look:
//   • "New Chat" button  →  resets the conversation
//   • Section links      →  inject a query into ChatWindow
//   • Slash command hint →  reminds users of /about, /skills, etc.
//   • Mini profile card  →  name, email, theme toggle
//
// On mobile (<lg) this is a fixed drawer that slides in from
// the left, with a dark backdrop behind it.
// On desktop (lg+) it's a static column always visible.
// ============================================================

import type { FC } from "react";
import resumeData from "../data/resumeData";
import ThemeToggle from "./ThemeToggle";
import { AVATAR_GRADIENT, AVATAR_INITIALS } from "./ChatWindow";

interface SidebarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  /** Injects a query string into ChatWindow when a nav link is clicked. */
  onSectionClick: (query: string) => void;
  onNewChat: () => void;
  /** Whether the mobile drawer is open. Ignored on desktop (lg+). */
  isOpen: boolean;
  onClose: () => void;
}

// Navigation sections — each maps to a chat query string.
// When clicked, the query is sent to ChatWindow via pendingQuery.
const NAV_SECTIONS = [
  { label: "About",      icon: "👤", query: "About Mandeep" },
  { label: "Projects",   icon: "🚀", query: "Show projects" },
  { label: "Skills",     icon: "⚡", query: "What's your stack?" },
  { label: "Experience", icon: "💼", query: "Work experience" },
  { label: "Education",  icon: "🎓", query: "Education" },
  { label: "Contact",    icon: "📬", query: "Contact info" },
];

const Sidebar: FC<SidebarProps> = ({
  isDark,
  onToggleTheme,
  onSectionClick,
  onNewChat,
  isOpen,
  onClose,
}) => {
  const { name, contact } = resumeData;

  // ── Derived colour classes ────────────────────────────────────────────────
  const sidebarBg  = isDark ? "bg-[#0c0c0e]"  : "bg-[#f7f7f8]";
  const borderCol  = isDark ? "border-white/10" : "border-gray-200";
  const textMuted  = isDark ? "text-gray-400"   : "text-gray-500";
  const textMain   = isDark ? "text-gray-100"   : "text-gray-800";
  const hoverBg    = isDark ? "hover:bg-white/10" : "hover:bg-gray-200";

  return (
    <>
      {/* ── Mobile backdrop ──────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ────────────────────────────────────────────────── */}
      {/* w-[85vw] on xs phones, capped at 280px on sm+, fixed 256px on lg desktop */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full flex flex-col
          w-[85vw] max-w-[280px] lg:w-64
          ${sidebarBg} border-r ${borderCol}
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
        aria-label="Site navigation"
      >
        {/* ── Top: New Chat + close ───────────────────────────────────────── */}
        <div className={`flex items-center justify-between p-3 border-b ${borderCol}`}>
          <button
            onClick={onNewChat}
            className={`
              flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              transition-colors duration-150 ${textMain} ${hoverBg}
            `}
            aria-label="Start new chat"
          >
            {/* Pencil icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0111 16.5H9v-2a2 2 0 01.586-1.414z" />
            </svg>
            New Chat
          </button>

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className={`lg:hidden p-2 rounded-lg ${hoverBg} ${textMuted} ml-1`}
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Sections ─────────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2" aria-label="Portfolio sections">
          <p className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${textMuted}`}>
            Portfolio
          </p>

          {NAV_SECTIONS.map(({ label, icon, query }) => (
            <button
              key={label}
              onClick={() => { onSectionClick(query); onClose(); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                transition-colors duration-150 ${textMain} ${hoverBg} text-left
              `}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </button>
          ))}

          {/* ── Command hint ─────────────────────────────────────────────── */}
          <div className={`mt-4 mx-1 px-3 py-3 rounded-lg text-xs ${textMuted} ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
            <p className="font-semibold mb-1">⌨ Slash commands</p>
            <p className="opacity-80 leading-5">
              /about · /projects · /skills<br />
              /experience · /education<br />
              /contact · /resume · /help
            </p>
          </div>
        </nav>

        {/* ── Bottom: profile + theme toggle ───────────────────────────────── */}
        <div className={`p-3 border-t ${borderCol}`}>
          <div className="flex items-center justify-between">
            {/* Mini profile avatar — re-uses the same gradient as assistant messages */}
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: AVATAR_GRADIENT }}
              >
                {AVATAR_INITIALS}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${textMain}`}>{name}</p>
                <a
                  href={`mailto:${contact.email}`}
                  className={`text-xs truncate block ${textMuted} hover:underline`}
                >
                  {contact.email}
                </a>
              </div>
            </div>
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

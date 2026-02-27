// ============================================================
// RightProjectSidebar.tsx  — "Project Demo Hub"
//
// A right-hand panel that lets visitors browse, compare, and
// launch Mandeep's portfolio projects.
//
// Three zones (top → bottom):
//   1) ActivePreview    — glassmorphism card showing the selected
//                         project's stack, links, and compare highlights.
//   2) Project List     — scrollable cards (one per project).
//   3) Compare Chips    — gradient pill filters that switch the
//                         "lens" (Architecture, Database, Auth, etc.).
//
// Responsive behaviour:
//   Desktop (lg+): fixed 320 px column beside the chat.
//   Mobile  (<lg): hidden by default; slides in as a drawer from
//                  the right when the user taps the briefcase icon.
// ============================================================

import { useState, useEffect } from "react";
import type { FC } from "react";
import ActivePreview from "./projects/ActivePreview";
import ProjectCard from "./projects/ProjectCard";
import CompareChipsRow from "./projects/CompareChipsRow";
import type { Project, CompareCategory } from "../data/projects";

// ─── Props ────────────────────────────────────────────────────────────────────

interface RightProjectSidebarProps {
  projects: Project[];
  /** ID of the currently highlighted project (null = none selected). */
  activeProjectId: string | null;
  /** Toggle-selects a project card. */
  onSelectProject: (id: string) => void;
  isDark: boolean;
  /** Mobile drawer open state. Ignored on lg+ where the panel is always visible. */
  isOpen: boolean;
  onClose: () => void;
}

// Note: ActivePreview, ProjectCard and CompareChipsRow live in
// `src/components/projects/` to keep this file short and easy to follow.

// (component implementation lives below)

// ─── Main component ───────────────────────────────────────────────────────────

const RightProjectSidebar: FC<RightProjectSidebarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  isDark,
  isOpen,
  onClose,
}) => {
  // Which compare lens the user has chosen (local to this sidebar)
  const [compareCategory, setCompareCategory] = useState<CompareCategory>("details");

  const activeProject = projects.find((p) => p.id === activeProjectId);

  // Sidebar surface colours
  const sideBg     = isDark ? "bg-[#0c0c0e]"   : "bg-gray-50";
  const borderCol  = isDark ? "border-white/10"  : "border-gray-200";

  // Shared shell classes for the <aside> element.
  // Desktop (lg+): static column, always visible.
  // Mobile: fixed right drawer, toggled by isOpen prop.
  const drawerClasses = `
    fixed inset-y-0 right-0 z-50
    lg:static lg:z-auto lg:inset-auto
    w-[300px] sm:w-[320px]
    flex flex-col h-full
    ${sideBg} border-l ${borderCol}
    transition-transform duration-300
    ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
  `;

  return (
    <>
      {/* ── Mobile backdrop ────────────────────────────────────────────────
           Clicking it closes the drawer. Only rendered when open on mobile. */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar shell ─────────────────────────────────────────────────── */}
      <aside className={drawerClasses} aria-label="Project Demo Hub">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div
          className={`
            shrink-0 flex items-center justify-between px-4 py-3.5 border-b ${borderCol}
          `}
        >
          <div className="flex items-center gap-2">
            {/* Vibrant indicator dot */}
            <span className={`w-2 h-2 rounded-full shrink-0 ${isDark ? "bg-gray-500" : "bg-gray-300"}`} />
            <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Project Hub
            </h2>
          </div>

          {/* Close button — only shown on mobile */}
          <button
            onClick={onClose}
            aria-label="Close project sidebar"
            className={`
              lg:hidden p-1.5 rounded-lg transition-colors
              ${isDark ? "text-gray-400 hover:text-gray-200 hover:bg-white/10" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}
            `}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ──────────────────────────────────────────────── */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">

          {/* 1) Active Project Preview — fixed, padded */}
          <div className="shrink-0 px-3 pt-3 pb-2">
            <ActivePreview
              project={activeProject}
              compareCategory={compareCategory}
              isDark={isDark}
            />
          </div>

          {/* 2) Compare Chips — below the preview */}
          <CompareChipsRow
            active={compareCategory}
            onChange={setCompareCategory}
            isDark={isDark}
          />

          {/* Divider label */}
          <div className={`shrink-0 flex items-center gap-2 px-3 py-2`}>
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              All Projects
            </span>
            <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
            <span className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
              {projects.length} total
            </span>
          </div>

          {/* 3) Project List — scrollable */}
          <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-1.5 min-h-0">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={project.id === activeProjectId}
                onSelect={() => onSelectProject(project.id)}
                isDark={isDark}
              />
            ))}
          </div>
        </div>

      </aside>
    </>
  );
};

export default RightProjectSidebar;

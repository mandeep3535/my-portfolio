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

// ─── Compare chip metadata ─────────────────────────────────────────────────────
// These chips appear at the bottom of the sidebar.  Clicking one
// changes the "lens" through which the ActivePreview shows
// project highlights (e.g. switching from "Architecture" to "Database").

const COMPARE_CHIPS: {
  key: CompareCategory;
  label: string;
}[] = [
  { key: "architecture", label: "Architecture" },
  { key: "database",     label: "Database"     },
  { key: "auth",         label: "Auth"         },
  { key: "ui",           label: "UI"           },
  { key: "testing",      label: "Testing"      },
];

// ─── Gradient border wrapper ───────────────────────────────────────────────────
// A 1 px gradient outline achieved by rendering a gradient background
// on an outer div, then placing a slightly-smaller inner div on top.
// This avoids the limitations of CSS `border-image` with border-radius.

const GradientBorder: FC<{
  children: React.ReactNode;
  className?: string;
  roundedClass?: string;
  isDark?: boolean;
}> = ({ children, className = "", roundedClass = "rounded-xl", isDark }) => (
  <div className={`border ${isDark ? "border-white/[0.08]" : "border-gray-200"} ${roundedClass} ${className}`}>
    {children}
  </div>
);

// ─── Stack badge ──────────────────────────────────────────────────────────────
// Small rounded pill that shows a tech name ("React", "MySQL", etc.).

const Badge: FC<{ label: string; isDark: boolean }> = ({ label, isDark }) => (
  <span
    className={`
      inline-block px-2 py-0.5 text-[10px] font-medium rounded-md
      ${isDark
        ? "bg-white/10 text-gray-300 border border-white/10"
        : "bg-gray-100 text-gray-600 border border-gray-200"
      }
    `}
  >
    {label}
  </span>
);

// ─── Active Project Preview ────────────────────────────────────────────────────
// Top section of the sidebar.  Shows either:
//   (a) a "Pick a project" empty state, or
//   (b) the selected project's details + compare highlights.

const ActivePreview: FC<{
  project: Project | undefined;
  compareCategory: CompareCategory;
  isDark: boolean;
}> = ({ project, compareCategory, isDark }) => {
  const [showAllStack, setShowAllStack] = useState(false);
  // Reset when project changes
  const projectId = project?.id;
  useEffect(() => { setShowAllStack(false); }, [projectId]);

  // Panel background
  const panelBg = isDark ? "bg-[#141417]" : "bg-white";

  // ── Empty state — no project selected ───────────────────────────────────
  if (!project) {
    return (
      <GradientBorder isDark={isDark}>
        <div
          className={`
            flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-xl text-center
            ${panelBg}
          `}
        >
          {/* Folder icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
            <svg className={`w-5 h-5 ${isDark ? "text-gray-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
          </div>
          <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            Pick a project to preview
          </p>
          <p className={`text-xs leading-snug ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Select any card below to see live demo links, stack details and compare highlights.
          </p>
        </div>
      </GradientBorder>
    );
  }

  // ── Active project card ──────────────────────────────────────────────────
  const chip = COMPARE_CHIPS.find((c) => c.key === compareCategory)!;
  const bullets = project.highlights[compareCategory] ?? [];

  return (
    <GradientBorder isDark={isDark} className="transition-all duration-300">
      <div className={`rounded-xl p-4 ${panelBg}`}>

        {/* Header row: emoji + title */}
        <div className="flex items-start gap-2 mb-2">
          {project.emoji && (
            <span className="text-2xl leading-none mt-0.5 shrink-0">{project.emoji}</span>
          )}
          <div className="min-w-0">
            <h2
              className={`text-sm font-bold leading-snug line-clamp-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {project.title}
            </h2>
            <p className={`text-[11px] mt-0.5 line-clamp-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {project.description}
            </p>
          </div>
        </div>

        {/* Stack badges — wrapping pill row */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(showAllStack ? project.stack : project.stack.slice(0, 5)).map((tech) => (
            <Badge key={tech} label={tech} isDark={isDark} />
          ))}
          {!showAllStack && project.stack.length > 5 && (
            <button
              onClick={() => setShowAllStack(true)}
              className={`
                px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer
                transition-colors duration-150
                ${isDark
                  ? "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                }
              `}
            >
              +{project.stack.length - 5} more
            </button>
          )}
          {showAllStack && (
            <button
              onClick={() => setShowAllStack(false)}
              className={`
                px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer
                transition-colors duration-150
                ${isDark
                  ? "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                }
              `}
            >
              less
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-3">
          {/* Live Demo */}
          <a
            href={project.links.demo ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!project.links.demo}
            onClick={!project.links.demo ? (e) => e.preventDefault() : undefined}
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3
              text-xs font-semibold rounded-lg transition-all duration-150
              ${project.links.demo
                ? isDark ? "bg-white/15 border border-white/20 text-white hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0" : "bg-gray-800 text-white hover:bg-gray-700 hover:-translate-y-0.5 active:translate-y-0"
                : isDark
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {/* External link icon */}
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
            Live Demo
          </a>

          {/* GitHub */}
          <a
            href={project.links.github ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!project.links.github}
            onClick={!project.links.github ? (e) => e.preventDefault() : undefined}
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3
              text-xs font-semibold rounded-lg border transition-all duration-150
              ${project.links.github
                ? isDark
                  ? "bg-white/10 border-white/15 text-gray-200 hover:bg-white/15 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:-translate-y-0.5 active:translate-y-0"
                : isDark
                  ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {/* GitHub icon */}
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
        </div>

        {/* Compare highlights for the selected chip */}
        {bullets.length > 0 && (
          <div
            className={`
              rounded-lg p-3 text-[11px] leading-relaxed space-y-1
              ${isDark ? "bg-white/5 text-gray-300" : "bg-gray-50 text-gray-600"}
            `}
          >
            <p className={`font-semibold text-[10px] uppercase tracking-wider mb-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {chip.label} highlights
            </p>
            {bullets.map((b, i) => (
              <div key={i} className="flex gap-1.5">
                <span className={`shrink-0 mt-px ${isDark ? "text-gray-500" : "text-gray-400"}`}>•</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </GradientBorder>
  );
};

// ─── Project card (in the scrollable list) ─────────────────────────────────
// Each project in `projects` renders one of these cards.
// Clicking a card toggle-selects it (highlight + ActivePreview updates).

const ProjectCard: FC<{
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  isDark: boolean;
}> = ({ project, isActive, onSelect, isDark }) => {
  const baseBg  = isDark ? "bg-[#141417]"   : "bg-white";
  const hoverBg = isDark ? "hover:bg-white/5" : "hover:bg-gray-50";
  const borderActive = isDark ? "border-white/25" : "border-gray-400";
  const borderIdle   = isDark ? "border-white/10" : "border-gray-200";

  return (
    <button
      onClick={onSelect}
      aria-pressed={isActive}
      className={`
        w-full text-left group flex items-start gap-3 p-3 rounded-xl border
        transition-all duration-200 outline-none
        focus-visible:ring-2 focus-visible:ring-white/20
        hover:-translate-y-0.5 hover:shadow-md
        ${isActive
          ? `${baseBg} ${borderActive} shadow-sm`
          : `${baseBg} ${borderIdle} ${hoverBg} ${isDark ? "hover:border-white/15 hover:shadow-black/30" : "hover:border-gray-300 hover:shadow-gray-200"}`
        }
      `}
    >
      {/* Project name only — no emoji */}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p
          className={`
            text-[12px] font-semibold line-clamp-2 leading-snug
            ${isActive
              ? isDark ? "text-white" : "text-gray-900"
              : isDark ? "text-gray-200 group-hover:text-white" : "text-gray-800 group-hover:text-gray-900"
            }
          `}
        >
          {project.title}
        </p>


      </div>

      {/* "Active" badge — only shown when card is selected */}
      {isActive && (
        <span className={`shrink-0 self-start mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
          Active
        </span>
      )}
    </button>
  );
};

// ─── Compare Chips row ────────────────────────────────────────────────────────
// Pinned at the bottom of the sidebar.  Scrollable horizontal rail.
// The active chip determines which `highlights[key]` appear in ActivePreview.

const CompareChipsRow: FC<{
  active: CompareCategory;
  onChange: (cat: CompareCategory) => void;
  isDark: boolean;
}> = ({ active, onChange, isDark }) => (
  <div
    className={`
      shrink-0 py-3 border-t
      ${isDark ? "border-white/10" : "border-gray-200"}
    `}
  >
    <p className={`px-3 text-[10px] uppercase tracking-wider font-semibold mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
      Compare projects by
    </p>

    <div className="flex flex-wrap gap-1.5 px-3 pb-1">
        {COMPARE_CHIPS.map((chip) => {
          const isSelected = chip.key === active;
          return (
            <button
              key={chip.key}
              onClick={() => onChange(chip.key)}
              aria-pressed={isSelected}
              className={`
                shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold
                transition-all duration-150 outline-none whitespace-nowrap
                focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-1
                ${isSelected
                  ? isDark
                    ? "bg-white/15 text-white border border-white/20"
                    : "bg-gray-800 text-white"
                  : isDark
                    ? "bg-white/5 text-gray-400 border border-white/[0.07] hover:bg-white/10 hover:text-gray-200"
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                }
              `}
            >
              {chip.label}
            </button>
          );
        })}
    </div>
  </div>
);

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
  const [compareCategory, setCompareCategory] = useState<CompareCategory>("architecture");

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

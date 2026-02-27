import React from "react";
import type { Project } from "../../data/projects";

interface Props {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  isDark: boolean;
}

const ProjectCard: React.FC<Props> = ({ project, isActive, onSelect, isDark }) => {
  const baseBg  = isDark ? "bg-[#141417]"   : "bg-white";
  const hoverBg = isDark ? "hover:bg-white/5" : "hover:bg-gray-50";
  const borderActive = isDark ? "border-white/25" : "border-gray-400";
  const borderIdle   = isDark ? "border-white/10" : "border-gray-200";

  return (
    <button
      onClick={onSelect}
      aria-pressed={isActive}
      className={`w-full text-left group flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/20 hover:-translate-y-0.5 hover:shadow-md ${isActive ? `${baseBg} ${borderActive} shadow-sm` : `${baseBg} ${borderIdle} ${hoverBg} ${isDark ? "hover:border-white/15 hover:shadow-black/30" : "hover:border-gray-300 hover:shadow-gray-200"}`}`}
    >
      <div className="min-w-0 flex-1">
        <p className={`text-[12px] font-semibold line-clamp-2 leading-snug ${isActive ? (isDark ? "text-white" : "text-gray-900") : (isDark ? "text-gray-200 group-hover:text-white" : "text-gray-800 group-hover:text-gray-900")}`}>
          {project.title}
        </p>
      </div>

      {isActive && (
        <span className={`shrink-0 self-start mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
          Active
        </span>
      )}
    </button>
  );
};

export default ProjectCard;

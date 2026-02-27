import React, { useEffect, useState } from "react";
import type { Project, CompareCategory } from "../../data/projects";
import GradientBorder from "./GradientBorder";
import Badge from "./Badge";
import LinkButton from "../LinkButton";
import { COMPARE_CHIPS } from "./constants";

interface Props {
  project?: Project;
  compareCategory: CompareCategory;
  isDark: boolean;
}

const ActivePreview: React.FC<Props> = ({ project, compareCategory, isDark }) => {
  const [showAllStack, setShowAllStack] = useState(false);
  useEffect(() => { setShowAllStack(false); }, [project?.id]);

  if (!project) {
    return (
      <GradientBorder isDark={isDark}>
        <div className={`flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-xl text-center ${isDark ? "bg-[#141417]" : "bg-white"}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
            <svg className={`w-5 h-5 ${isDark ? "text-gray-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
          </div>
          <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>Pick a project to preview</p>
          <p className={`text-xs leading-snug ${isDark ? "text-gray-500" : "text-gray-400"}`}>Select any card below to see live demo links, stack details and compare highlights.</p>
        </div>
      </GradientBorder>
    );
  }

  const chip = COMPARE_CHIPS.find((c) => c.key === compareCategory)!;
  const bullets = project.highlights[compareCategory] ?? [];

  return (
    <GradientBorder isDark={isDark} className="transition-all duration-300">
      <div className={`rounded-xl p-4 ${isDark ? "bg-[#141417]" : "bg-white"}`}>
        <div className="flex items-start gap-2 mb-2">
          {project.emoji && <span className="text-2xl leading-none mt-0.5 shrink-0">{project.emoji}</span>}
          <div className="min-w-0">
            <h2 className={`text-sm font-bold leading-snug line-clamp-2 ${isDark ? "text-white" : "text-gray-900"}`}>{project.title}</h2>
            <p className={`text-[11px] mt-0.5 ${compareCategory === "details" ? "" : "line-clamp-1"} ${isDark ? "text-gray-400" : "text-gray-500"}`}>{project.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {(showAllStack ? project.stack : project.stack.slice(0, 5)).map((tech) => (
            <Badge key={tech} label={tech} isDark={isDark} />
          ))}
          {!showAllStack && project.stack.length > 5 && (
            <button onClick={() => setShowAllStack(true)} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isDark ? "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"}`}>+{project.stack.length - 5} more</button>
          )}
          {showAllStack && (
            <button onClick={() => setShowAllStack(false)} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isDark ? "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"}`}>less</button>
          )}
        </div>

        <div className="flex gap-2 mb-3">
          <LinkButton href={project.links.demo} label="Live Demo" isDark={isDark} solid icon={(
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
          )} />

          <LinkButton href={project.links.github} label="GitHub" isDark={isDark} icon={(
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          )} />
        </div>

        {bullets.length > 0 && (
          <div className={`rounded-lg p-3 text-[11px] leading-relaxed space-y-1 ${isDark ? "bg-white/5 text-gray-300" : "bg-gray-50 text-gray-600"}`}>
            <p className={`font-semibold text-[10px] uppercase tracking-wider mb-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {chip.key === "details" ? "Project Overview" : `${chip.label} highlights`}
            </p>
            {bullets.map((b, i) => (
              <div key={i} className="flex gap-1.5"><span className={`shrink-0 mt-px ${isDark ? "text-gray-500" : "text-gray-400"}`}>•</span><span>{b}</span></div>
            ))}
          </div>
        )}
      </div>
    </GradientBorder>
  );
};

export default ActivePreview;

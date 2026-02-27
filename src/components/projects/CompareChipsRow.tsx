import React from "react";
import type { CompareCategory } from "../../data/projects";
import { COMPARE_CHIPS } from "./constants";

const CompareChipsRow: React.FC<{ active: CompareCategory; onChange: (cat: CompareCategory) => void; isDark: boolean }> = ({ active, onChange, isDark }) => (
  <div className={`shrink-0 py-3 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}>
    <p className={`px-3 text-[10px] uppercase tracking-wider font-semibold mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
      Detailed Information
    </p>

    <div className="flex flex-wrap gap-1.5 px-3 pb-1">
      {COMPARE_CHIPS.map((chip) => {
        const isSelected = chip.key === active;
        return (
          <button
            key={chip.key}
            onClick={() => onChange(chip.key)}
            aria-pressed={isSelected}
            className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 outline-none whitespace-nowrap focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-1 ${isSelected ? (isDark ? "bg-white/15 text-white border border-white/20" : "bg-gray-800 text-white") : (isDark ? "bg-white/5 text-gray-400 border border-white/[0.07] hover:bg-white/10 hover:text-gray-200" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700")}`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default CompareChipsRow;

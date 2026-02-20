// ============================================================
// PromptChips.tsx  — Reusable row of clickable suggestion chips
//
// Used in two places:
//   1) Below the input bar (scrollable horizontal rail)
//   2) Below each assistant message (wrapping row)
//
// The `scrollable` prop toggles between the two layouts.
// ============================================================

import type { FC } from "react";

interface PromptChipsProps {
  chips: string[];
  /** Called with the chip label when the user clicks one. */
  onChipClick: (label: string) => void;
  isDark: boolean;
  /** Optional extra class names on the wrapper. */
  className?: string;
  /**
   * scrollable — puts chips on a single horizontal rail that scrolls on mobile
   * (used in the input-bar footer). Default wraps to multiple rows.
   */
  scrollable?: boolean;
}

const PromptChips: FC<PromptChipsProps> = ({
  chips,
  onChipClick,
  isDark,
  className = "",
  scrollable = false,
}) => {
  return (
    <div
      className={`
        flex gap-2
        ${scrollable
          ? "overflow-x-auto flex-nowrap no-scrollbar pb-0.5" // horizontal rail on mobile
          : "flex-wrap"                                         // wraps freely in hero/messages
        }
        ${className}
      `}
      role="list"
    >
      {chips.map((chip) => (
        <button
          key={chip}
          role="listitem"
          onClick={() => onChipClick(chip)}
          className={`
            shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border
            transition-all duration-150 whitespace-nowrap
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1
            ${isDark
              ? "border-white/20 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/40"
              : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
            }
          `}
        >
          {chip}
        </button>
      ))}
    </div>
  );
};

export default PromptChips;

// ============================================================
// ThemeToggle.tsx  — Sun / Moon theme switch button
//
// A simple controlled component:  App owns `isDark`, passes it
// down, and this component just renders the correct icon and
// fires `onToggle` when clicked.
// ============================================================

import type { FC } from "react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle: FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`
        p-2 rounded-lg transition-colors duration-200
        ${isDark
          ? "text-gray-400 hover:text-white hover:bg-white/10"
          : "text-gray-500 hover:text-gray-900 hover:bg-black/10"
        }
      `}
    >
      {isDark ? (
        /* Sun icon */
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" />
        </svg>
      ) : (
        /* Moon icon */
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;

import React from "react";

const Badge: React.FC<{ label: string; isDark: boolean }> = ({ label, isDark }) => (
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

export default Badge;

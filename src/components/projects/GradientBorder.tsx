import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  roundedClass?: string;
  isDark?: boolean;
}

const GradientBorder: React.FC<Props> = ({ children, className = "", roundedClass = "rounded-xl", isDark }) => (
  <div className={`border ${isDark ? "border-white/[0.08]" : "border-gray-200"} ${roundedClass} ${className}`}>
    {children}
  </div>
);

export default GradientBorder;

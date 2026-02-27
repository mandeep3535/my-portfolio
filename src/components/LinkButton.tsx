import React from "react";

interface LinkButtonProps {
  href?: string | null;
  label: string;
  icon?: React.ReactNode;
  isDark?: boolean;
  solid?: boolean; // solid vs outline style
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  label,
  icon,
  isDark = false,
  solid = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  const isActive = !!href && !disabled;

  const base = `flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all duration-150 ${className}`;

  let classes = "";
  if (isActive) {
    classes = solid
      ? (isDark ? "bg-white/15 border border-white/20 text-white hover:bg-white/20" : "bg-gray-800 text-white hover:bg-gray-700")
      : (isDark ? "bg-white/10 border-white/15 text-gray-200 hover:bg-white/15" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100");
  } else {
    classes = isDark ? "bg-white/5 text-gray-600 cursor-not-allowed" : "bg-gray-100 text-gray-400 cursor-not-allowed";
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!isActive) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <a
      href={isActive ? href! : "#"}
      target={isActive ? "_blank" : undefined}
      rel={isActive ? "noopener noreferrer" : undefined}
      aria-disabled={!isActive}
      onClick={handleClick}
      className={`${base} ${classes}`}
    >
      {icon}
      {label}
    </a>
  );
};

export default LinkButton;

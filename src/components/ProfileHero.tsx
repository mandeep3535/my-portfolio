// ============================================================
// ProfileHero.tsx  — Full-width SaaS dashboard header
//
// Redesigned as a Linear/Vercel/Raycast-inspired header bar.
// No floating card — edge-to-edge glassmorphism panel always
// pinned to the top of the chat column.
//
// Visual structure (left → right inside the bar)
// ─────────────────────────────────────────────────────────
//  [3 px gradient accent strip — purple → blue]
//  [Avatar] [Name / Title / Location] [Tech badges] [CTA btns]
// ─────────────────────────────────────────────────────────
//
// Responsive:
//   • mobile  : badges hidden, compact name + buttons
//   • md+     : badges visible in a horizontal scroll strip
// ============================================================

import { useState, useEffect } from "react";
import type { FC } from "react";
import resumeData from "../data/resumeData";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProfileHeroProps {
  name: string;
  title: string;
  /** URL for the profile photo. Falls back to initials if empty/broken. */
  avatarUrl: string;
  location?: string;
  /** Tech badge labels scrolled across the middle of the bar. */
  badges: string[];
  /** Fires a chat message when the user clicks a CTA button. */
  onSend: (text: string) => void;
  isDark: boolean;
}

// ─── Chat CTA chips ───────────────────────────────────────────────────────────

const CHAT_CHIPS = [
  {
    label: "Contact",
    query: "How can I contact you?",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

const ProfileHero: FC<ProfileHeroProps> = ({
  name, title, avatarUrl, location, badges, onSend, isDark,
}) => {
  const [imgError, setImgError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen]);

  // "MS" from "Mandeep Singh" — used when the avatar image is missing.
  const initials = name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ── Colour tokens ──────────────────────────────────────────────────────────
  const glassBg   = isDark
    ? "bg-[#141417] backdrop-blur-2xl"
    : "bg-white/90 backdrop-blur-2xl";
  const borderCol = isDark ? "border-white/[0.04]"  : "border-black/[0.06]";
  const textMain  = isDark ? "text-white"            : "text-gray-900";
  const textMuted = isDark ? "text-gray-400"         : "text-gray-500";
  const badgeCls  = isDark
    ? "bg-white/[0.06] text-gray-300 border-white/[0.09] hover:bg-white/[0.10]"
    : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200";

  return (
    <>
    <div className="relative w-full shrink-0">

      {/* ── Glass surface ───────────────────────────────────────────────── */}
      {/* backdrop-blur-2xl + semi-transparent bg = glassmorphism panel.
          border-b is the ONLY edge — no side borders → truly flush.
          shadow gives depth without lifting it off the page.               */}
      <div
        className={`
          w-full px-5 sm:px-8 pt-6 pb-5
          ${glassBg} border-b ${borderCol}
        `}
      >
        {/* ── Row 1: Avatar · Identity · CTA buttons ──────────────────── */}
        <div className="flex items-center gap-4 sm:gap-5 w-full min-w-0">

          {/* Avatar ─────────────────────────────────────────────── */}
          <div className="relative shrink-0">
            <button
              onClick={() => setLightboxOpen(true)}
              aria-label="View full photo"
              className="block w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden
                cursor-zoom-in hover:opacity-90 transition-opacity duration-150 focus:outline-none"
            >
              {!imgError && avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${name} profile photo`}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center
                  bg-gradient-to-br from-violet-600 to-cyan-500
                  text-white text-xl font-bold select-none">
                  {initials}
                </div>
              )}
            </button>
          </div>

          {/* Name + Title + Location ─────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <h1 className={`text-xl sm:text-2xl font-bold leading-tight tracking-tight truncate ${textMain}`}>
              {name}
            </h1>
            <p className={`text-sm mt-1 truncate ${textMuted}`}>{title}</p>
            {location && (
              <p className={`text-xs mt-0.5 hidden sm:block ${textMuted} opacity-75`}>{location}</p>
            )}
          </div>

          {/* Action buttons ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">

            {/* Resume download */}
            <a
              href={resumeData.resumeUrl ?? "#"}
              download
              aria-label="Download resume"
              className={`
                flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg
                text-xs sm:text-[13px] font-semibold whitespace-nowrap
                transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0
                outline-none focus-visible:ring-2 focus-visible:ring-violet-500
                ${
                  isDark
                    ? "bg-white/[0.08] text-gray-200 hover:bg-white/[0.13] border border-white/[0.09]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }
              `}
            >
              {/* Download icon */}
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v13M7 12l5 5 5-5" />
                <path d="M5 20h14" />
              </svg>
              Resume
            </a>

            {/* GitHub icon link */}
            <a
              href={resumeData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className={`
                flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg
                transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0
                outline-none focus-visible:ring-2 focus-visible:ring-violet-500
                ${
                  isDark
                    ? "bg-white/[0.08] text-gray-300 hover:bg-white/[0.13] border border-white/[0.09]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                }
              `}
            >
              {/* GitHub logo SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
                  0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
                  -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
                  .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951
                  0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65
                  0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337
                  c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651
                  .64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943
                  .359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747
                  0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* LinkedIn icon link */}
            <a
              href={resumeData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className={`
                flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg
                transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0
                outline-none focus-visible:ring-2 focus-visible:ring-violet-500
                ${
                  isDark
                    ? "bg-white/[0.08] text-gray-300 hover:bg-white/[0.13] border border-white/[0.09]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                }
              `}
            >
              {/* LinkedIn logo SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037
                  -1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046
                  c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337
                  7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782
                  13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0
                  23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774
                  23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            {/* Divider */}
            <div className={`w-px h-6 mx-0.5 ${ isDark ? "bg-white/[0.08]" : "bg-gray-200" }`} aria-hidden="true" />

            {/* Chat CTA chips */}
            {CHAT_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => onSend(chip.query)}
                aria-label={chip.query}
                className={`
                  px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg
                  text-xs sm:text-[13px] font-semibold whitespace-nowrap
                  transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0
                  outline-none focus-visible:ring-2 focus-visible:ring-violet-500
                  ${
                    isDark
                      ? "bg-white/[0.08] text-gray-200 hover:bg-white/[0.13] border border-white/[0.09]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }
                `}
              >
                {chip.label}
              </button>
            ))}

          </div>

        </div>

        {/* ── Row 2: Tech badge strip ──────────────────────────────────── */}
        {/* Full-width on all screen sizes — sits below the identity row.    */}
        {badges.length > 0 && (
          <div className="flex items-center gap-2 mt-4 overflow-x-auto scrollbar-none">
            {badges.slice(0, 12).map((badge) => (
              <span
                key={badge}
                className={`
                  shrink-0 px-3 py-1 rounded-full text-[11px]
                  font-medium border whitespace-nowrap
                  transition-colors duration-150 ${badgeCls}
                `}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>

    {/* ── Lightbox overlay ────────────────────────────────────────────── */}
    {lightboxOpen && avatarUrl && !imgError && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center
          bg-black/75 backdrop-blur-sm cursor-zoom-out"
        onClick={() => setLightboxOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label="Profile photo enlarged"
      >
        <img
          src={avatarUrl}
          alt={`${name} profile photo`}
          className="
            max-w-[80vw] max-h-[80vh] w-auto h-auto
            rounded-2xl shadow-2xl
            animate-[scale-in_0.18s_ease-out]
          "
          onClick={(e) => e.stopPropagation()}
        />
        {/* Close button */}
        <button
          onClick={() => setLightboxOpen(false)}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center
            rounded-full bg-white/10 hover:bg-white/20 text-white
            transition-colors duration-150"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none"
            stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    )}
    </>
  );
};

export default ProfileHero;
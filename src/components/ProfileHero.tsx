// ============================================================
// ProfileHero.tsx  — LinkedIn-style welcome hero card
//
// Shown at the TOP of the ChatWindow when the conversation
// is empty (no messages yet).  Once the user sends a message,
// ChatWindow hides this card and shows the message list instead.
//
// Visual structure (top → bottom inside the card)
// ------------------------------------------------
//   Gradient cover banner  (~140 px)
//   Avatar (overlaps the banner via negative margin)
//   Name · Title · Location
//   Tech badges (up to 8 pills)
//   ───── divider ─────
//   CTA chips ("Show Projects", "View Skills", "Contact")
//
// Card width: ~90% of the middle panel, max 820 px.
// The decorative "cinematic strips" live in ChatWindow, NOT here.
// ============================================================

import { useState } from "react";
import type { FC } from "react";

// ─── Props ────────────────────────────────────────────────────────────────────────

interface ProfileHeroProps {
  name: string;
  title: string;
  /** URL for the profile photo. Falls back to initials if empty or broken. */
  avatarUrl: string;
  location?: string;
  /** Tech badge labels shown below the name (e.g. "React", "Docker"). */
  badges: string[];
  /** Sends a chat query when the user clicks a CTA chip. */
  onSend: (text: string) => void;
  isDark: boolean;
}

// ─── CTA chip config ────────────────────────────────────────────────────────────
// Each chip is a gradient button at the bottom of the hero card.
// Clicking one sends `query` as if the user typed it into the chat.

const CTA_CHIPS = [
  {
    label:    "Show Projects",
    query:    "Show me your projects",
    gradient: "from-violet-500 to-purple-600",
    glow:     "hover:shadow-violet-500/35",
  },
  {
    label:    "View Skills",
    query:    "What are your skills?",
    gradient: "from-blue-500 to-cyan-500",
    glow:     "hover:shadow-blue-400/35",
  },
  {
    label:    "Contact",
    query:    "How can I contact you?",
    gradient: "from-emerald-500 to-teal-500",
    glow:     "hover:shadow-emerald-500/35",
  },
] as const;

// ─── Sub-components ─────────────────────────────────────────────────────────────

/** A small rounded pill showing a tech skill name (e.g. "React"). */
const TechBadge: FC<{ label: string; isDark: boolean }> = ({ label, isDark }) => (
  <span
    className={`
      px-2.5 py-[3px] rounded-full text-[10px] sm:text-[11px] font-medium
      border transition-colors duration-150
      ${
        isDark
          ? "bg-white/8 text-gray-300 border-white/10 hover:bg-white/12"
          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
      }
    `}
  >
    {label}
  </span>
);

/** Small map-pin SVG used next to the location text. */
const PinIcon: FC = () => (
  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ─── Main component ─────────────────────────────────────────────────────────────

const ProfileHero: FC<ProfileHeroProps> = ({
  name, title, avatarUrl, location, badges, onSend, isDark,
}) => {
  const [imgError, setImgError] = useState(false);

  // Extract the user's initials from their full name ("Mandeep Singh" → "MS")
  const initials = name.split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase();

  // Glass background for the content area below the banner.
  // "backdrop-blur-xl" gives the frosted-glass (glassmorphism) look.
  const glassBg = isDark
    ? "bg-[#1e1e30]/90 backdrop-blur-xl"
    : "bg-white/90  backdrop-blur-xl";
  const textMain  = isDark ? "text-white"    : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";

  return (
    // The card itself — pure UI, no cinematic strips here (those live in ChatWindow).
    <div className="w-full flex flex-col items-center px-3 sm:px-5">

      {/* Hero card: ~90% wide, rounded-2xl.  overflow-hidden clips avatar glow. */}
      <div
        className={`
          w-full max-w-[820px] rounded-2xl overflow-hidden
          shadow-2xl shadow-black/30
          ring-1 ${ isDark ? "ring-white/8" : "ring-black/8" }
        `}
      >
        {/* Gradient cover banner
             The top ~40% of the card. Glassmorphism overlay subtly frosts it.
             Ambient blobs add depth without looking cartoonish.               */}
        <div
          className="
            relative w-full h-[130px] sm:h-[150px]
            bg-gradient-to-br from-violet-700 via-purple-600 to-cyan-500
            overflow-hidden
          "
        >
          {/* Frosted tint layer */}
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]" />

          {/* Ambient light blobs */}
          <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-violet-400/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-6 right-0 w-52 h-52 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 w-24 h-24 rounded-full bg-purple-300/10 blur-2xl pointer-events-none" />

          {/* Tiny shimmer dots */}
          <div className="absolute top-4 right-12 w-1.5 h-1.5 rounded-full bg-white/50" />
          <div className="absolute top-8 right-20 w-1   h-1   rounded-full bg-white/30" />
          <div className="absolute bottom-6 left-10 w-1  h-1   rounded-full bg-white/40" />
        </div>

        {/* Content area (glassmorphism surface) */}
        <div className={`flex flex-col items-center text-center px-5 sm:px-8 pb-7 ${glassBg}`}>

          {/* Avatar - pulled up into the banner with negative margin */}
          <div className="relative -mt-[48px] mb-3 shrink-0">
            {/* Blurred glow halo behind the avatar - gradient ring effect */}
            <div
              className="
                absolute -inset-[4px] rounded-full
                bg-gradient-to-br from-violet-500 via-purple-400 to-cyan-400
                blur-[6px] opacity-75
              "
              aria-hidden="true"
            />
            {/* Solid separator ring - colour matches the glass bg so the avatar
                appears to "float" above the banner. z-10 keeps it above the glow. */}
            <div
              className={`
                relative w-[96px] h-[96px] rounded-full ring-[3px] overflow-hidden z-10
                ${ isDark ? "ring-[#1e1e30]" : "ring-white" }
              `}
            >
              {!imgError && avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${name} profile`}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                // Initials fallback - mirrors the banner gradient
                <div
                  className="
                    w-full h-full flex items-center justify-center select-none
                    bg-gradient-to-br from-violet-600 to-cyan-500
                    text-white text-3xl font-bold
                  "
                >
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <h1 className={`text-xl sm:text-2xl font-bold leading-tight tracking-tight ${textMain}`}>
            {name}
          </h1>

          {/* Role */}
          <p className={`text-sm mt-1 leading-snug ${textMuted}`}>
            {title}
          </p>

          {/* Location */}
          {location && (
            <p className={`flex items-center justify-center gap-1.5 text-[11px] mt-1.5 ${textMuted}`}>
              <PinIcon />
              {location}
            </p>
          )}

          {/* Tech badges - max 8, +N overflow badge */}
          {badges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-3.5 max-w-md">
              {badges.slice(0, 8).map((b) => (
                <TechBadge key={b} label={b} isDark={isDark} />
              ))}
              {badges.length > 8 && (
                <TechBadge label={`+${badges.length - 8} more`} isDark={isDark} />
              )}
            </div>
          )}

          {/* Divider */}
          <div
            className={`w-20 h-px my-4 ${ isDark ? "bg-white/10" : "bg-gray-200" }`}
            aria-hidden="true"
          />

          {/* CTA chips */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {CTA_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => onSend(chip.query)}
                aria-label={chip.query}
                className={`
                  px-4 sm:px-5 py-1.5 rounded-full
                  text-xs sm:text-[13px] font-semibold text-white
                  bg-gradient-to-r ${chip.gradient}
                  shadow-md ${chip.glow} hover:shadow-lg
                  hover:-translate-y-0.5 active:translate-y-0
                  transition-all duration-150
                  outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500
                `}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfileHero;
// ============================================================
// chatEngine.ts
//
// The "brain" behind the portfolio chatbot.
//
// HOW IT WORKS:
// 1. User types a message (or clicks a chip / sidebar link).
// 2. `processMessage(input)` is called with the raw text.
// 3. If the text starts with "/" we treat it as a slash command
//    (/about, /projects, /skills, etc.).
// 4. Otherwise we run through a list of keyword rules — the
//    first rule whose keywords appear in the input wins.
// 5. The matching handler pulls data from resumeData.ts and
//    returns a bot reply with Markdown content + suggestion chips.
// 6. If nothing matches, a friendly fallback is returned.
//
// IMPORTANT: This is a RULE-BASED engine, not AI.  Every
// response is deterministic, derived entirely from resumeData.
// ============================================================

import resumeData from "../data/resumeData";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape of every message displayed in the chat window. */
export interface ChatMessage {
  id: string;                   // unique random identifier
  role: "user" | "assistant";   // who sent it
  content: string;              // plain text with lightweight Markdown
  chips?: string[];             // optional follow-up suggestion labels
  timestamp: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Small pure functions used by the response builders below.

/** Generate a short random ID for a message (e.g. "k7f3n2xp"). */
function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Convenience factory: builds a complete assistant ChatMessage object. */
function botMsg(content: string, chips?: string[]): ChatMessage {
  return { id: uid(), role: "assistant", content, chips, timestamp: new Date() };
}

/**
 * Normalise user input for fuzzy keyword matching.
 * Lowercases everything and strips punctuation so that
 * "What's your stack?" becomes "whats your stack".
 */
function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

/**
 * Returns true if the normalised input contains ANY of the keywords.
 * Used by every intent rule to decide if it should handle the message.
 */
function contains(input: string, keywords: string[]): boolean {
  const n = normalize(input);
  return keywords.some((kw) => n.includes(kw));
}

// ─── Response builders ────────────────────────────────────────────────────────
// Each `build*()` function composes a Markdown string from resumeData fields.
// The Markdown is later rendered into React elements by utils/markdown.tsx.

/** Composes the "About Me" response with bio, links and awards. */
function buildAbout(): string {
  const { about, contact, awards } = resumeData;
  return (
    `**About Me**\n\n` +
    `${about}\n\n` +
    `${contact.email}  |  [GitHub](${contact.github})  |  [LinkedIn](${contact.linkedin})\n\n` +
    `**Highlights:**\n` +
    awards.map((a) => `• ${a}`).join("\n")
  );
}

/** Lists all skills grouped into back-end, front-end, and tools. */
function buildSkills(): string {
  const { backend, frontend, tools } = resumeData.skills;
  return (
    `**Skills**\n\n` +
    `**Back-End**\n${backend.join(" · ")}\n\n` +
    `**Front-End**\n${frontend.join(" · ")}\n\n` +
    `**Tools & Misc**\n${tools.join(" · ")}`
  );
}

/** Formats every project with tech stack, bullets, and links. */
function buildProjects(): string {
  const lines: string[] = ["**Projects**\n"];
  resumeData.projects.forEach((p, i) => {
    lines.push(
      `**${i + 1}. ${p.name}** ${p.highlight ? `_(${p.highlight})_` : ""}\n` +
        `_${p.period}_  |  Tech: ${p.tech.join(", ")}\n` +
        p.bullets.map((b) => `• ${b}`).join("\n") +
        (p.demo ? `\n[Live Demo](${p.demo})` : "") +
        (p.github ? `  [GitHub](${p.github})` : "")
    );
  });
  return lines.join("\n\n");
}

/** Builds the work experience timeline (role, company, bullets). */
function buildExperience(): string {
  const lines: string[] = ["**Work Experience**\n"];
  resumeData.experience.forEach((e) => {
    lines.push(
      `**${e.role}** — ${e.company}\n` +
        `_${e.period} · ${e.location}_\n` +
        e.bullets.map((b) => `• ${b}`).join("\n")
    );
  });
  return lines.join("\n\n");
}

/** Formats education entries plus relevant coursework grades. */
function buildEducation(): string {
  const lines: string[] = ["**Education**\n"];
  resumeData.education.forEach((ed) => {
    lines.push(`**${ed.school}**\n_${ed.degree}_ (${ed.year})\n${ed.honors}`);
  });
  lines.push(
    "\n**Relevant Coursework:**\n" +
      resumeData.coursework
        .map((c) => `${c.subject} (${c.grade})`)
        .join("  ·  ")
  );
  return lines.join("\n\n");
}

/** Renders all contact channels as clickable Markdown links. */
function buildContact(): string {
  const { contact } = resumeData;
  return (
    `**Let's Connect!**\n\n` +
    `Email: [${contact.email}](mailto:${contact.email})\n` +
    ` GitHub: [${contact.github}](${contact.github})\n` +
    `LinkedIn: [${contact.linkedin}](${contact.linkedin})\n\n` +
    (resumeData.resumeUrl
      ? `[Download Resume](${resumeData.resumeUrl})`
      : `Resume download coming soon.`)
  );
}

// ─── Intent map ───────────────────────────────────────────────────────────────
// Each rule has a list of keywords and a handler that returns a ChatMessage.
// The FIRST rule whose keywords match the user input wins — order matters.

interface IntentRule {
  keywords: string[];
  handler: () => ChatMessage;
}

const intentRules: IntentRule[] = [
  // About / intro
  {
    keywords: ["about", "who are you", "who is", "introduce", "mandeep", "bio", "background", "tell me about"],
    handler: () =>
      botMsg(buildAbout(), ["Show projects", "View skills", "Education", "Contact"]),
  },
  // Skills / stack / tech
  {
    keywords: ["skill", "stack", "tech", "technology", "language", "framework", "tool", "know", "use"],
    handler: () =>
      botMsg(buildSkills(), ["Show projects", "Work experience", "About Mandeep"]),
  },
  // Projects
  {
    keywords: ["project", "built", "build", "work on", "portfolio", "github", "code", "ta allocation", "ecommerce", "e-commerce", "student registration"],
    handler: () =>
      botMsg(buildProjects(), ["View skills", "Work experience", "Contact"]),
  },
  // Experience / work
  {
    keywords: ["experience", "work", "job", "rogers", "career", "employ", "position", "role"],
    handler: () =>
      botMsg(buildExperience(), ["Education", "Show projects", "About Mandeep"]),
  },
  // Education
  {
    keywords: ["education", "degree", "university", "ubc", "okanagan", "college", "gpa", "grade", "study", "coursework", "dean"],
    handler: () =>
      botMsg(buildEducation(), ["About Mandeep", "Show projects", "Contact"]),
  },
  // Contact / hire
  {
    keywords: ["contact", "email", "phone", "linkedin", "hire", "reach", "connect", "message"],
    handler: () =>
      botMsg(buildContact(), ["About Mandeep", "Show projects", "View skills"]),
  },
  // Resume download
  {
    keywords: ["resume", "cv", "download", "pdf"],
    handler: () =>
      botMsg(
        resumeData.resumeUrl
          ? `You can download the resume here: [Download Resume](${resumeData.resumeUrl})`
          : `The resume PDF isn't hosted yet.\n\nIn the meantime, feel free to ask me anything about Mandeep's background!`,
        ["About Mandeep", "Show projects", "Contact"]
      ),
  },
  // Awards / honors
  {
    keywords: ["award", "honor", "achievement", "scholarship", "merit", "recognition", "list"],
    handler: () =>
      botMsg(
        `**Honours & Awards**\n\n` +
          resumeData.awards.map((a) => `• ${a}`).join("\n"),
        ["About Mandeep", "Education", "Show projects"]
      ),
  },
];

// ─── Slash-command mode ──────────────────────────────────────────────────────
// When the user types a "/" prefix the engine skips keyword matching and
// jumps straight to the matching command.  This mirrors the UX of Discord
// or Slack slash commands.

/** Map a slash command string to its response (or null if unknown). */
function handleCommand(input: string): ChatMessage | null {
  const cmd = input.trim().toLowerCase();
  const commandMap: Record<string, () => ChatMessage> = {
    "/about":      () => botMsg(buildAbout(),      ["Show projects", "View skills"]),
    "/projects":   () => botMsg(buildProjects(),   ["View skills", "Contact"]),
    "/skills":     () => botMsg(buildSkills(),     ["Show projects", "About Mandeep"]),
    "/experience": () => botMsg(buildExperience(), ["Education", "Show projects"]),
    "/education":  () => botMsg(buildEducation(),  ["Show projects", "Contact"]),
    "/contact":    () => botMsg(buildContact(),    ["About Mandeep", "Show projects"]),
    "/resume":     () =>
      botMsg(
        resumeData.resumeUrl
          ? `[Download Resume](${resumeData.resumeUrl})`
          : `Resume URL not set yet.`,
        ["About Mandeep", "Contact"]
      ),
    "/help": () =>
      botMsg(
        `**Available commands:**\n\n` +
          `/about · /projects · /skills · /experience · /education · /contact · /resume`,
        ["About Mandeep", "Show projects", "Contact"]
      ),
  };
  return commandMap[cmd] ? commandMap[cmd]() : null;
}

// ─── Main entry point ─────────────────────────────────────────────────────────

/**
 * The ONLY function ChatWindow calls.
 *
 * Flow:
 *   1. Try slash command  → return immediately if matched.
 *   2. Try keyword rules  → first match wins.
 *   3. Fallback           → polite "I don't have that" reply.
 */
export function processMessage(input: string): ChatMessage {
  const trimmed = input.trim();
  if (!trimmed) return botMsg("Please type something and I'll do my best to help!");

  // 1. Slash command mode
  if (trimmed.startsWith("/")) {
    const cmdResult = handleCommand(trimmed);
    if (cmdResult) return cmdResult;
    return botMsg(
      `Unknown command **${trimmed}**. Try /help to see available commands.`,
      ["/about", "/projects", "/skills", "/contact"]
    );
  }

  // 2. Intent matching
  for (const rule of intentRules) {
    if (contains(trimmed, rule.keywords)) return rule.handler();
  }

  // 3. Fallback — polite out-of-scope response
  return botMsg(
    `I'm not sure I have that info, but here's what I can share about ${resumeData.name}:`,
    ["About Mandeep", "Show projects", "View skills", "Work experience", "Contact"]
  );
}

// NOTE: `getWelcomeMessage()` and `defaultChips` were previously exported
// here but were never imported anywhere.  ProfileHero now acts as the
// welcome screen, so these have been removed to keep the module clean.

// ============================================================
// chatEngine.ts
// Rule-based intent matcher + response generator.
// Processes user input and returns structured bot responses
// derived exclusively from resumeData.
// ============================================================

import resumeData from "../data/resumeData";

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single chat message in the conversation. */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Optional quick-reply chip labels shown below the message. */
  chips?: string[];
  timestamp: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a unique message ID. */
function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Build an assistant message object. */
function botMsg(content: string, chips?: string[]): ChatMessage {
  return { id: uid(), role: "assistant", content, chips, timestamp: new Date() };
}

/** Lowercase + strip punctuation for fuzzy matching. */
function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

/** Check if the normalised input contains any of the given keywords. */
function contains(input: string, keywords: string[]): boolean {
  const n = normalize(input);
  return keywords.some((kw) => n.includes(kw));
}

// ─── Response builders ────────────────────────────────────────────────────────

function buildAbout(): string {
  const { about, contact, awards } = resumeData;
  return (
    `**About Me**\n\n` +
    `${about}\n\n` +
    `📧 ${contact.email}  |  📱 ${contact.phone}\n` +
    `🔗 [GitHub](${contact.github})  |  [LinkedIn](${contact.linkedin})\n\n` +
    `**Highlights:**\n` +
    awards.map((a) => `• ${a}`).join("\n")
  );
}

function buildSkills(): string {
  const { backend, frontend, tools } = resumeData.skills;
  return (
    `**Skills**\n\n` +
    `**🖥 Back-End**\n${backend.join(" · ")}\n\n` +
    `**🎨 Front-End**\n${frontend.join(" · ")}\n\n` +
    `**🛠 Tools & Misc**\n${tools.join(" · ")}`
  );
}

function buildProjects(): string {
  const lines: string[] = ["**Projects**\n"];
  resumeData.projects.forEach((p, i) => {
    lines.push(
      `**${i + 1}. ${p.name}** ${p.highlight ? `_(${p.highlight})_` : ""}\n` +
        `_${p.period}_  |  Tech: ${p.tech.join(", ")}\n` +
        p.bullets.map((b) => `• ${b}`).join("\n") +
        (p.demo ? `\n🌐 [Live Demo](${p.demo})` : "") +
        (p.github ? `  🔗 [GitHub](${p.github})` : "")
    );
  });
  return lines.join("\n\n");
}

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

function buildContact(): string {
  const { contact } = resumeData;
  return (
    `**Let's Connect!**\n\n` +
    `📧 Email: [${contact.email}](mailto:${contact.email})\n` +
    `📱 Phone: ${contact.phone}\n` +
    `🔗 GitHub: [${contact.github}](${contact.github})\n` +
    `💼 LinkedIn: [${contact.linkedin}](${contact.linkedin})\n\n` +
    (resumeData.resumeUrl
      ? `📄 [Download Resume](${resumeData.resumeUrl})`
      : `📄 Resume download — _TODO: upload PDF and update resumeUrl in resumeData.ts_`)
  );
}

function buildWelcome(): ChatMessage {
  return botMsg(
    `Hi there! 👋 I'm **${resumeData.name}**'s Portfolio Assistant.\n\n` +
      `I can tell you all about ${resumeData.name}'s background, projects, skills, and more.\n\n` +
      `Here are a few things you can ask me:`,
    [
      "About Mandeep",
      "Show projects",
      "What's your stack?",
      "Work experience",
      "Education",
      "Contact info",
    ]
  );
}

// ─── Intent map ───────────────────────────────────────────────────────────────

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
          ? `📄 You can download the resume here: [Download Resume](${resumeData.resumeUrl})`
          : `📄 The resume PDF isn't hosted yet — _TODO: upload PDF and update resumeUrl in resumeData.ts_.\n\nIn the meantime, feel free to ask me anything about Mandeep's background!`,
        ["About Mandeep", "Show projects", "Contact"]
      ),
  },
  // Awards / honors
  {
    keywords: ["award", "honor", "achievement", "scholarship", "merit", "recognition", "list"],
    handler: () =>
      botMsg(
        `**Honours & Awards**\n\n` +
          resumeData.awards.map((a) => `🏅 ${a}`).join("\n"),
        ["About Mandeep", "Education", "Show projects"]
      ),
  },
];

// ─── Command mode ─────────────────────────────────────────────────────────────

/** Handle slash commands like /about, /projects, /skills, etc. */
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
          ? `📄 [Download Resume](${resumeData.resumeUrl})`
          : `📄 Resume URL not set yet — update \`resumeData.resumeUrl\` in resumeData.ts.`,
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
 * Process a user message and return the assistant's response.
 * Call this whenever the user submits a new message.
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

/** Returns the welcome message shown on first load. */
export function getWelcomeMessage(): ChatMessage {
  return buildWelcome();
}

/** Returns a list of suggestion chips for the initial empty state. */
export const defaultChips = [
  "About Mandeep",
  "Show projects",
  "What's your stack?",
  "Work experience",
  "Education",
  "Contact info",
];

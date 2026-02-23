// Lightweight OpenAI client for browser usage via Vite env var
// Note: Exposing an API key in frontend is a security risk. Prefer a server-side proxy.
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

async function queryChatGPT(prompt: string): Promise<string> {
  const key = import.meta.env.VITE_OPENAI_KEY as string | undefined;
  if (!key) throw new Error("Missing VITE_OPENAI_KEY environment variable");

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a concise assistant answering questions about a software engineer's portfolio. Keep replies short and on-topic." },
      { role: "user", content: prompt }
    ],
    max_tokens: 300,
    temperature: 0.2,
  };

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }

  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  return content ?? "(no response)";
}

export { queryChatGPT };

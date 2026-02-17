const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL || "https://ai-chatbot.advenoh.pe.kr";
const BLOG_ID = "investment";

export interface SourceDocument {
  title: string;
  url: string;
  snippet?: string;
}

export interface ChatResponse {
  answer: string;
  sources: SourceDocument[];
  message_id: string;
}

export async function sendChatMessage(
  question: string,
  chatHistory: [string, string][]
): Promise<ChatResponse> {
  const res = await fetch(`${CHAT_API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      blog_id: BLOG_ID,
      question,
      chat_history: chatHistory,
    }),
  });

  if (!res.ok) {
    throw new Error(`Chat API error: ${res.status}`);
  }

  return res.json();
}

export async function sendFeedback(params: {
  message_id: string;
  blog_id: string;
  question: string;
  rating: "up" | "down";
}): Promise<void> {
  const res = await fetch(`${CHAT_API_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Feedback API error: ${res.status}`);
  }
}

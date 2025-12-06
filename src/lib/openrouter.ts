// OpenRouter API Client for Browser
const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const streamChat = async (
  messages: ChatMessage[], 
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (err: any) => void
) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin, // Required by OpenRouter
        "X-Title": "Gravity AI", // Required by OpenRouter
      },
      body: JSON.stringify({
        model: "kwaipilot/kat-coder-pro:free",
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) throw new Error("No reader available");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ") && line !== "data: [DONE]") {
          try {
            const json = JSON.parse(line.replace("data: ", ""));
            const content = json.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error("Error parsing chunk", e);
          }
        }
      }
    }
    
    onComplete();

  } catch (error) {
    onError(error);
  }
};

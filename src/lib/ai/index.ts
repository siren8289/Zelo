import { geminiGenerateText } from "./gemini";
import { groqGenerateText } from "./groq";

/**
 * GROQ_API_KEY가 있으면 Groq, 없으면 GEMINI_API_KEY로 Gemini 사용.
 * 둘 다 있으면 Groq 우선.
 */
export async function generateText(prompt: string): Promise<string> {
  if (process.env.GROQ_API_KEY) {
    return groqGenerateText(prompt);
  }
  if (process.env.GEMINI_API_KEY) {
    return geminiGenerateText(prompt);
  }
  throw new Error("Set either GROQ_API_KEY or GEMINI_API_KEY in .env.local");
}

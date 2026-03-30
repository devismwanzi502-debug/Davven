import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiModel = "gemini-3-flash-preview";

export async function* streamGeminiResponse(prompt: string, history: { role: string; parts: { text: string }[] }[] = []) {
  try {
    const chat = ai.chats.create({
      model: geminiModel,
      config: {
        systemInstruction: "You are Gemini, a helpful and creative AI assistant from Google. Your responses should be clear, concise, and formatted using Markdown where appropriate.",
      },
      history: history,
    });

    const result = await chat.sendMessageStream({ message: prompt });

    for await (const chunk of result) {
      yield chunk.text || "";
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "I'm sorry, I encountered an error. Please try again.";
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateContent = async (promptText) => {
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  try {
    const result = await model.generateContent(promptText);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Gemini error:", error);
    throw error;
  }
};

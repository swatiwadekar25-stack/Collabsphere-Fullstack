
import { GoogleGenAI } from "@google/genai";

const createAskAI = (createClient = () => new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})) => async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        message: "Please enter a question or prompt.",
      });
    }

    if (prompt.length > 10000) {
      return res.status(400).json({
        message: "Prompt must be 10,000 characters or fewer.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        message: "The AI assistant is not configured yet.",
      });
    }

    const ai = createClient();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt.trim(),
    });

    res.status(200).json({
      answer: response.text || "The AI did not return any text.",
    });
  } catch (error) {
    // SDK errors can contain request details; keep credentials out of logs.
    console.error("Gemini request failed.");

    res.status(502).json({
      message: "The AI assistant could not process your request.",
    });
  }
};

const askAI = createAskAI();

export { askAI, createAskAI };

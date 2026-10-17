
import { GoogleGenAI } from "@google/genai";

const askAI = async (req, res, next) => {
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

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt.trim(),
    });

    res.status(200).json({
      answer: response.text || "The AI did not return any text.",
    });
  } catch (error) {
    console.error("Gemini request failed:", error.message);

    res.status(502).json({
      message: "The AI assistant could not process your request.",
    });
  }
};

export { askAI };

import { GoogleGenerativeAI } from "@google/generative-ai";

export const parseTaskAI = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    console.log("------------------------------------------------");
    console.log("📥 AI PARSE ENDPOINT TRIGGERED");
    console.log("📝 Incoming prompt text:", prompt);
    console.log("------------------------------------------------");

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "GEMINI_API_KEY is not set in your environment.",
      });
    }

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ message: "Please provide a prompt description." });
    }

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",   // ✅ up-to-date, fast, supports JSON mode
      generationConfig: { responseMimeType: "application/json" },
    });

    // ✅ User input is passed as a separate turn, not interpolated into instructions
    const instructions = `
      You are an expert AI productivity assistant. Analyze the user's input and extract structured task attributes.
      Return ONLY a valid JSON object matching this schema exactly:
      {
        "title": "A short, clean title summarizing the action item",
        "description": "Any remaining context or notes. Empty string if none.",
        "priority": "high" | "medium" | "low",
        "tags": ["extracted", "keywords"]
      }
    `;

    const result = await model.generateContent([
      { text: instructions },
      { text: `User input: ${prompt}` },
    ]);

    const responseText = result.response.text().trim();
    const structuredTaskData = JSON.parse(responseText);

    console.log("✅ AI SUCCESSFULLY PARSED PAYLOAD:", structuredTaskData);
    return res.status(200).json(structuredTaskData);

  } catch (error) {
    console.error("🔥 parseTaskAI error:", error);
    return res.status(500).json({
      message: "Failed to parse task with AI.",
      error: error.message,
    });
  }
};
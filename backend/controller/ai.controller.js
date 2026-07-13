import Task from "../models/task.model.js";

export const parseTaskAI = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    console.log("📥 AI PARSE ENDPOINT TRIGGERED VIA GROQ");
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        message: "GROQ_API_KEY is not set in your environment.",
      });
    }

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ message: "Please provide a prompt description." });
    }

    const instructions = `
      You are an expert AI productivity assistant. Analyze the user's input and extract structured task attributes.
      Return ONLY a valid JSON object matching this schema exactly:
      {
        "title": "A short, clean title summarizing the action item",
        "description": "Any remaining context or notes. Empty string if none.",
        "priority": "High" | "Medium" | "Low",
        "tags": ["extracted", "keywords"]
      }
      Note: Map priority to low, medium, or high capitalized as: 'Low', 'Medium', 'High'. Do not include any markdown code blocks or wrapper text, return ONLY the raw JSON object.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: instructions },
          { role: "user", content: `User input: ${prompt}` }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || `Groq responded with status ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content.trim();
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

export const chatAI = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Please provide a chat message." });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        message: "GROQ_API_KEY is not set in your environment.",
      });
    }

    // Fetch user tasks to offer intelligent task context to the chatbot
    let tasks = [];
    if (req.user.role === "admin") {
      tasks = await Task.find().populate("assignedTo", "name email");
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate("assignedTo", "name email");
    }

    const taskContext = tasks.map((t) => ({
      id: t._id,
      title: t.title,
      description: t.description || "",
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate,
      assignedTo: t.assignedTo?.map((u) => u.name).join(", "),
      progress: t.progress || 0,
      checklist: t.todoChecklist?.map((item) => `${item.text} (${item.completed ? "Done" : "Pending"})`) || [],
    }));

    const instructions = `
      You are M.I.N.D. (Modular Intelligence Network Device), an expert AI task planner and co-pilot assistant.
      The user is logged in as: ${req.user.name} (${req.user.role}).
      Here is the list of active tasks from their workspace:
      ${JSON.stringify(taskContext, null, 2)}

      Please respond to the user's message in a helpful, concise, and structured way. 
      Use clear markdown lists, code blocks, or bold keys if suggesting subtasks or schedules.
      Keep the tone highly smart, supportive, and futuristic. If they mention specific task IDs or names, reference them directly.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        messages: [
          { role: "system", content: instructions },
          { role: "user", content: `User message: ${message}` }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || `Groq responded with status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("🔥 chatAI error:", error);
    return res.status(500).json({
      message: "AI Chat co-pilot failed.",
      error: error.message,
    });
  }
};
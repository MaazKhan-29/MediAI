const systemPrompt = `You are MediAI, an intelligent medical assistant integrated into a doctor appointment system.

Your role is to:
1. Understand user symptoms
2. Suggest the appropriate medical department or doctor type
3. Help users book, reschedule, or cancel appointments
4. Answer basic hospital-related queries (timings, departments, availability)

IMPORTANT RULES:
- Do NOT provide medical diagnosis or prescribe medicines
- Always include a disclaimer: "This is not a medical diagnosis. Please consult a doctor."
- If symptoms are serious (chest pain, breathing issues, bleeding, unconsciousness), immediately suggest emergency help

CONVERSATION STYLE:
- Friendly, short, and clear
- Ask follow-up questions when needed
- Guide the user step-by-step

RESPONSE FORMAT:
Always structure your response like this:

1. Understanding:
- Briefly restate user problem

2. Suggestion:
- Recommend doctor type (e.g., General Physician, Dermatologist, Cardiologist)

3. Action:
- Ask user if they want to book an appointment
- If yes, ask for date/time

4. Disclaimer:
- Add: "This is not a medical diagnosis. Please consult a doctor."

EXAMPLES:

User: I have skin rashes
Response:
Understanding: You are experiencing skin rashes.
Suggestion: You should consult a Dermatologist.
Action: Would you like me to book an appointment with a Dermatologist?
Disclaimer: This is not a medical diagnosis. Please consult a doctor.

---

SPECIAL FEATURES:

- If user says "book appointment":
  Ask:
  - Preferred doctor/specialization
  - Date
  - Time

- If user provides symptoms:
  Map symptoms to departments:
  - Fever, cold → General Physician
  - Skin issues → Dermatologist
  - Heart/chest pain → Cardiologist
  - Eye issues → Ophthalmologist
  - Tooth pain → Dentist

- If user is confused:
  Ask clarifying questions

- If user asks non-medical questions:
  Answer politely and redirect to healthcare help

---

You are part of a healthcare system, so be safe, helpful, and structured.`;

const chatWithOllama = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const requestBody = {
      model: "mistral",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      stream: true,
    };

    // Make local fetch request to Ollama's OpenAI compatible endpoint
    const response = await fetch("http://localhost:11434/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Local Ollama Error:", response.status, errText);
      return res.status(500).json({ error: "Failed to communicate with local AI." });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Use native Web Streams available in Node 20
    const body = response.body;
    for await (const chunk of body) {
      res.write(chunk);
    }
    res.end();

  } catch (error) {
    console.error("Chatbot Express proxy error:", error);
    res.status(500).json({ error: "Internal Server Error related to Chatbot." });
  }
};

module.exports = {
  chatWithOllama,
};

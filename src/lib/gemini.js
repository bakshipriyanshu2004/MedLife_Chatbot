import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
export const isConfigured = Boolean(apiKey);

let genAI = null;
if (isConfigured) {
  genAI = new GoogleGenerativeAI(apiKey);
}

const MODEL_NAME = "gemini-1.5-flash"; // fast and capable for chat

const SYSTEM_PROMPT = `
You are MedLife, a helpful medical information assistant for general guidance.
Important rules:
- You are NOT a doctor and cannot provide medical diagnosis or treatment.
- Always encourage consulting a qualified healthcare professional for decisions.
- Be concise, clear, and empathetic. Avoid alarming language.
- If symptoms could be serious (chest pain, difficulty breathing, stroke signs, severe bleeding), recommend seeking urgent care.
- If asked for dosing or prescriptions, provide general over-the-counter guidance only if safe and non-specific; otherwise advise seeing a clinician.
- Refuse to generate harmful, illegal, or unsafe content.
`;

export async function askGemini(userMessages) {
  // userMessages: array of {role: 'user'|'model', content: string}
  if (!isConfigured) {
    return "Configuration missing: Set VITE_GEMINI_API_KEY in a .env file and restart the app.";
  }
  const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction: SYSTEM_PROMPT });

  // Build contents as per Gemini chat format
  const contents = userMessages.map(m => ({ role: m.role, parts: [{ text: m.content }]}));

  const response = await model.generateContent({ contents });
  const text = response.response?.text?.() ?? response.response?.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") ?? "";
  return text.trim();
}



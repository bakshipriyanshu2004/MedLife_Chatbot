import { GoogleGenerativeAI } from "@google/generative-ai";

// Prefer build-time env; fall back to a runtime key stored in localStorage
const envKey = import.meta.env.VITE_GEMINI_API_KEY;
const runtimeKey = (() => {
  try { return localStorage.getItem('medlife_api_key') || undefined } catch { return undefined }
})();
const effectiveKey = envKey || runtimeKey;

export const isConfigured = Boolean(effectiveKey);

let genAI = null;
if (isConfigured) {
  genAI = new GoogleGenerativeAI(effectiveKey);
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

export function setRuntimeApiKey(key) {
  try {
    if (!key || typeof key !== 'string') return false;
    localStorage.setItem('medlife_api_key', key.trim());
    return true;
  } catch {
    return false;
  }
}



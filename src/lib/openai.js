// Minimal OpenAI client for browser use via fetch.
// WARNING: Exposing API keys in the browser is insecure. This is for demo/dev only.

const envKey = import.meta.env.VITE_OPENAI_API_KEY;
const runtimeKey = (() => {
  try { return localStorage.getItem('medlife_openai_key') || undefined } catch { return undefined }
})();
const effectiveKey = envKey || runtimeKey;

export const isConfigured = Boolean(effectiveKey);

const MODEL_NAME = 'gpt-4o-mini';

const SYSTEM_PROMPT = `
You are MedLife, a helpful medical information assistant for general guidance.
Rules:
- You are NOT a doctor. Do not provide diagnosis or prescriptions.
- Encourage consulting qualified professionals for decisions.
- Be concise, clear, and empathetic.
- If symptoms might be serious (chest pain, breathing difficulty, stroke signs, severe bleeding), recommend urgent care.
- Refuse unsafe or illegal content.
`;

export async function askOpenAI(userMessages) {
  if (!isConfigured) {
    return "Configuration missing: Set VITE_OPENAI_API_KEY in a .env file or paste your key using the banner form.";
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...userMessages.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content }))
  ];

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${effectiveKey}`,
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages,
      temperature: 0.7,
    })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenAI error ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? '';
  return (content || '').trim();
}

export function setRuntimeApiKey(key) {
  try {
    if (!key || typeof key !== 'string') return false;
    localStorage.setItem('medlife_openai_key', key.trim());
    return true;
  } catch {
    return false;
  }
}



# MedLife (React + Vite + Tailwind + Gemini)

Futuristic medical info chatbot powered by Google Gemini. Designed with neon/glass UI and optimized for fast, helpful guidance. Not a replacement for professional medical advice.

## Setup

1) Install dependencies
```
npm install
```

2) Set your Gemini API key
Create a `.env` file in the project root:
```
VITE_GEMINI_API_KEY=your_key_here
```
Get a key from: https://ai.google.dev/gemini-api/

3) Run the dev server
```
npm run dev
```

4) Open the app
Visit the URL shown in the terminal (usually `http://localhost:5173`).

## Notes
- Keys placed in the browser are exposed to users. For production, proxy Gemini calls through a simple backend (Node/Express) and keep the key server-side.
- The bot provides general information only and includes safety guidance for urgent symptoms.

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Orbitron", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        neon: {
          pink: "#ff4dff",
          blue: "#4dd2ff",
          green: "#39ffba",
          purple: "#9b5cff",
        },
      },
      boxShadow: {
        glow: "0 0 25px rgba(77, 210, 255, 0.35)",
        neon: "0 0 20px rgba(155, 92, 255, 0.6)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
}


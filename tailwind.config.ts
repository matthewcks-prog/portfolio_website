import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        line: "var(--line)",
        text: "var(--text)",
        muted: "var(--muted)",
        cyan: "var(--c-cyan)",
        indigo: "var(--c-indigo)",
        violet: "var(--c-violet)",
        success: "var(--success)",
        warn: "var(--warn)",
        error: "var(--error)",
      },
      borderRadius: {
        xl: "var(--radius)",
      },
      boxShadow: {
        glass: "0 10px 30px rgba(0,0,0,.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;

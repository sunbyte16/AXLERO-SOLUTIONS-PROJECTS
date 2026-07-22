/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          pressed: "#1E40AF",
        },
        secondary: "#7C3AED",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        background: "#0F172A",
        surface: "#1E293B",
        card: "#334155",
        border: "#475569",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        btn: "10px",
        card: "16px",
        dialog: "20px",
        input: "12px",
      },
      maxWidth: {
        content: "1440px",
      },
      boxShadow: {
        glow: "0 0 30px rgba(37, 99, 235, 0.15)",
      },
    },
  },
  plugins: [],
};

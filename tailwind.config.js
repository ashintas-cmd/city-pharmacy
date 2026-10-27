/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        apollo: {
          50: "#EFF8F7",
          100: "#D8EFEC",
          200: "#B0DED9",
          300: "#7FC8C2",
          400: "#4BACA4",
          500: "#268F87",
          600: "#156F6C",
          700: "#165D59",
          800: "#124A47",
          900: "#0E3A38",
          950: "#082624",
        },
        coral: {
          50: "#FFF1F4",
          100: "#FFE0E6",
          200: "#FFC3CF",
          300: "#FFA0B2",
          400: "#FF8A9E",
          500: "#FF748E",
          600: "#F04E6E",
          700: "#D62F55",
        },
        cream: "#FAFBF9",
        sand: "#F6F1E7",
        ink: "#121414",
        muted: "#6F7573",
        line: "#E5E9E5",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 30px -18px rgba(14, 58, 56, 0.35)",
        float: "0 24px 60px -28px rgba(14, 58, 56, 0.45)",
        soft: "0 2px 10px -4px rgba(14, 58, 56, 0.18)",
        ring: "0 0 0 4px rgba(21, 111, 108, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) both",
        "fade-in": "fade-in 0.35s ease-out both",
        marquee: "marquee 28s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ivory: {
          50: "#FFFDF9",
          100: "#FAF6EE",
          200: "#F5ECE0",
          300: "#EAD9C4",
          400: "#DBC1A1",
          500: "#C4A27B",
          DEFAULT: "#FAF6EE",
        },
        gold: {
          50: "#FCFAF0",
          100: "#F9F3DB",
          200: "#F2E4B0",
          300: "#E8CE7B",
          400: "#D4AF37", // Primary ceremonial gold
          500: "#C59B27",
          600: "#A37D1A",
          700: "#7F5F14",
          800: "#5D4512",
          DEFAULT: "#D4AF37",
        },
        royal: {
          50: "#FAF5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          300: "#D8B4FE",
          400: "#A855F7",
          500: "#7E22CE",
          600: "#6B21A8",
          700: "#581C87",
          800: "#4A0E4E", // Deep Royal Purple
          900: "#2D0830",
          DEFAULT: "#4A0E4E",
        },
        magenta: {
          50: "#FDF2F8",
          100: "#FCE7F3",
          200: "#FBCFE8",
          300: "#F9A8D4",
          400: "#F472B6",
          500: "#EC4899",
          600: "#DB2777",
          700: "#BE185D", // Vibrant Rani Pink / Magenta
          800: "#9D174D",
          900: "#701A75",
          DEFAULT: "#BE185D",
        },
        maroon: {
          800: "#630018",
          900: "#45020E",
          DEFAULT: "#45020E",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
        display: ["var(--font-rozha)", "var(--font-cinzel)", "serif"],
        hindi: ["var(--font-yatra)", "var(--font-noto-devanagari)", "sans-serif"],
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        cursive: ["var(--font-great-vibes)", "cursive"],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.35)',
        'royal-glow': '0 0 25px -5px rgba(114, 9, 183, 0.3)',
        'card-warm': '0 10px 30px -10px rgba(74, 14, 78, 0.08), 0 4px 6px -2px rgba(74, 14, 78, 0.03)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mandala-pattern': "radial-gradient(circle at center, rgba(212, 175, 55, 0.07) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Vibrant Mint & Aquamarine
        mint: {
          50: "#f0fdf9",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        aquamarine: {
          light: "#7cf6e2",
          DEFAULT: "#2ed7be",
          glow: "#38ef7d",
          deep: "#044e45",
        },
        // Rich Emerald Jade tones (Dominant Green palette - NO BLACK DOMINANCE)
        jade: {
          950: "#051f1c", // Deepest forest jade
          900: "#082d29", // Canvas background
          850: "#0c3833", // Secondary canvas tone
          800: "#0f443e", // Tile Variant A
          750: "#135049", // Tile Variant B (Chessboard alternate)
          700: "#175d55", // Hover tile
          600: "#1e796f",
          500: "#25968a",
          400: "#34b7a8",
          border: "#1d6057",
          borderBright: "#2dd4bf",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        chess: ["var(--font-chess)", "Georgia", "serif"],
        islamic: ["var(--font-islamic)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

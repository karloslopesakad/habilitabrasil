import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          deep: "#0A2540",
          blue: "#1E3A8A",
        },
        success: {
          light: "#22C55E",
          DEFAULT: "#16A34A",
        },
        neutral: {
          light: "#F8FAFC",
          medium: "#CBD5E1",
        },
        accent: {
          purple: "#8B5CF6",
          teal: "#14B8A6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;


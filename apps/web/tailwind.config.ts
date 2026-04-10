import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        mist: "#F3F4F6",
        brand: {
          DEFAULT: "#0F766E",
          light: "#14B8A6",
          dark: "#115E59"
        },
        sand: "#F8F5F0",
        coral: "#F97316"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        panel: "0 18px 60px rgba(15, 118, 110, 0.14)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.08) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;

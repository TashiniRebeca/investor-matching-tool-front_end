import type { Config } from "tailwindcss";


export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#061a34", // Dark Blue
        accent: "#60A5FA", // Sky Blue
        background: "#F8FAFC", // Soft White
        text: "#334155", // Slate Gray
        border: "#CBD5E1", // Light Gray
        success: "#10B981", // Green
        error: "#EF4444", // Red
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
      keyframes: {
        spotlight: {
          "0%": {
            // @ts-ignore
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            // @ts-ignore
            opacity: 1,
            transform: "translate(-50%, -40%) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

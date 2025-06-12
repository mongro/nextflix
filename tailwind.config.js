/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        "primary-foreground": "var(--primary-foreground)",
      },
      scale: {
        66: "0.66666",
      },
      animation: {
        grow: "grow 0.3s linear forwards",
        appear: "appear 0.5s linear forwards",
        load: "load 0.5s linear",
        width: "width 0.3s linear forwards",
      },
      keyframes: {
        width: { from: { width: 0 }, to: { width: 250 } },
        load: {
          to: { transform: "translateX(0)" },
        },
        grow: {
          to: { transform: "scale(1) translateY(0)" },
        },
        appear: {
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};

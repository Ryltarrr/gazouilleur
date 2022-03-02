module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      padding: "1rem",
    },
    extend: {
      animation: {
        "reverse-spin": "reverse-spin 1s linear infinite",
        "fade-in": "fade-in 300ms ease-out",
        "spin-once": "reverse-spin 300ms linear",
      },
      keyframes: {
        "fade-in": {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 100,
          },
        },
        "reverse-spin": {
          from: {
            transform: "rotate(360deg)",
          },
          to: {
            transform: "rotate(0deg)",
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

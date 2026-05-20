/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
      },

      colors: {
        primary: "#130F6A",
        selected: "#FFEBF5",

        // Warna brand
        navy: "#130f6a",
        orange: "#ec8d41",
        dark: "#020038",
      },
    },
  },
  plugins: [],
};
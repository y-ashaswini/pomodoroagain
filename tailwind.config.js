/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jet: "#363636",
        coral: "#FF8360",
        latte: "#FFFAEB",
        steal: "#D5D5D5",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};

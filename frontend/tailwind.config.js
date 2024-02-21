/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': [ 'Outfit', "sans-serif" ] 
      },
      colors: {
        exeterDarkGreen: "#003c3c",
        exeterDeepGreen: "#007d69",
        exeterBrightGreen: "#00c896",
        exeterHighlightGreen: "#00dca5",
      }
    },
  },
  plugins: [],
}


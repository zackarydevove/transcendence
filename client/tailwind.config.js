/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        '42logo': "url('./images/42logo.png')",
        'pp': "url('./images/gear5.jpeg')",
      }
    },
  },
  plugins: [],
}


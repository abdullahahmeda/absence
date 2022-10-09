/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans Arabic'", 'sans-serif']
      },
      container: {
        center: true
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

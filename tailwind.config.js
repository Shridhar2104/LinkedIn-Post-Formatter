/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        linkedin: {
          50: '#e8f4fd',
          100: '#d0e9fb',
          200: '#a1d3f7',
          300: '#72bdf3',
          400: '#43a7ef',
          500: '#0a66c2',
          600: '#08529b',
          700: '#063d74',
          800: '#04294d',
          900: '#021426',
        }
      }
    },
  },
  plugins: [],
}

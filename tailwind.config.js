/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf8e8',
          100: '#f9edc5',
          200: '#f3d98a',
          300: '#e9be4a',
          400: '#d4a520',
          500: '#c49a1a',
          600: '#a67c14',
          700: '#8a6510',
          800: '#6e4f0d',
          900: '#5a4110',
        },
        imperial: {
          red: '#8B0000',
          'red-light': '#A52A2A',
          'red-dark': '#5C0000',
          black: '#0a0a0a',
          'black-light': '#1a1a1a',
          'black-medium': '#2a2a2a',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

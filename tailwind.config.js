/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c2185b',
        'primary-dark': '#9b0044',
        'primary-light': '#ffd9df',
        surface: '#fdfbf9',
        'on-surface': '#1c1b1b',
        'on-surface-variant': '#594045',
        outline: '#8d6f75',
        'outline-variant': '#e1bec4',
      },
      fontFamily: {
        serif: ['Noto Serif', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
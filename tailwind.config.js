/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      width: {
        '22': '5.5rem'
      },
      height: {
        '22': '5.5rem'
      },
      colors: {
        astral: {
          50: '#f0f9fb',
          100: '#d9f0f4',
          200: '#b7e1ea',
          300: '#85cadb',
          400: '#4caac4',
          500: '#308ba6',
          600: '#2b738f',
          700: '#295f75',
          800: '#294f61',
          900: '#264353',
          950: '#142b38'
        }
      }
    },
    minHeight: {
      '1/2': '20rem',
    }
  },
  plugins: [],
}
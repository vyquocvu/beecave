/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FCD535',
          secondary: '#f0b90b',
        },
        up: '#0ecb81',
        down: '#f6465d',
        bg: {
          primary: '#0b0e11',
          secondary: '#1e2329',
          tertiary: '#2b3139',
          overlay: '#1e2329',
        },
        border: {
          DEFAULT: '#2b3139',
          subtle: '#1e2329',
        },
        text: {
          primary: '#ffffff',
          secondary: '#eaecef',
          tertiary: '#707a8a',
          disabled: '#929aa5',
        },
        protocol: {
          hyperliquid: '#00D4AA',
          lighter: '#7B61FF',
          aster: '#FF6B35',
        },
      },
      fontFamily: {
        mono: ['SpaceMono'],
      },
    },
  },
  plugins: [],
};

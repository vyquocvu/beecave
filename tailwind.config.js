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
          DEFAULT: '#F0B429',
          secondary: '#E8A800',
        },
        up: '#0ECB81',
        down: '#F6465D',
        bg: {
          primary: '#0A0B0E',
          secondary: '#13151A',
          tertiary: '#1C1F28',
          overlay: '#242731',
        },
        border: {
          DEFAULT: '#252836',
          subtle: '#1E2130',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#8B92A5',
          tertiary: '#5A6072',
          disabled: '#3D4255',
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

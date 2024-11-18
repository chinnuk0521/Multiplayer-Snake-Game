/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        glow: 'glow 2s ease-in-out infinite',
      },
      colors: {
        neon: {
          blue: '#60A5FA',
          purple: '#A78BFA',
          green: '#34D399',
          yellow: '#FBBF24',
          red: '#F87171',
        },
      },
      boxShadow: {
        neon: '0 0 10px currentColor',
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Desktop-width screens that are short: used to trim the hero so the page fits without scrolling.
      screens: { short: { raw: '(min-width: 1024px) and (max-height: 780px)' } },
      fontFamily: { sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'] },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: { fadeIn: 'fadeIn 0.3s ease-out forwards' },
    },
  },
  plugins: [],
};

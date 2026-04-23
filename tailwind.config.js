/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FAF8F5',
          100: '#F5F0EB',
          200: '#EBE4DB',
          300: '#DDD4C8',
        },
        ink: {
          DEFAULT: '#2D2A26',
          light: '#5C5650',
          muted: '#8A827A',
          faint: '#B8AFA5',
        },
        accent: {
          DEFAULT: '#7C6955',
          light: '#A6927A',
          warm: '#C4956A',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        neu: '16px',
        'neu-sm': '12px',
      },
      boxShadow: {
        'neu-raised': '6px 6px 14px #D5CEC6, -6px -6px 14px #FFFFFF',
        'neu-raised-sm': '3px 3px 8px #D5CEC6, -3px -3px 8px #FFFFFF',
        'neu-inset': 'inset 4px 4px 10px #D5CEC6, inset -4px -4px 10px #FFFFFF',
        'neu-flat': '0 1px 3px rgba(45,42,38,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'card-float': 'cardFloat 0.5s ease-out both',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        cardFloat: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
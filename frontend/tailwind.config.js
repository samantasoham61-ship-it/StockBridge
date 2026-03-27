/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0e1a',
          800: '#0f1629',
          700: '#1a2340',
          600: '#1e2d4a',
          500: '#243356',
        },
        accent: {
          green: '#00d4aa',
          red: '#ff4757',
          blue: '#4a9eff',
          gold: '#ffd700',
          purple: '#a855f7',
        }
      },
      animation: {
        'pulse-green': 'pulseGreen 1s ease-in-out',
        'pulse-red': 'pulseRed 1s ease-in-out',
        'ticker': 'ticker 30s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        pulseGreen: { '0%, 100%': { backgroundColor: 'transparent' }, '50%': { backgroundColor: 'rgba(0, 212, 170, 0.2)' } },
        pulseRed: { '0%, 100%': { backgroundColor: 'transparent' }, '50%': { backgroundColor: 'rgba(255, 71, 87, 0.2)' } },
        ticker: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(-100%)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { transform: 'translateY(20px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
      }
    },
  },
  plugins: [],
}

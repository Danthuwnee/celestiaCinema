/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space': {
          dark: '#0B1026',
          deeper: '#060914',
          light: '#1A1F3A',
        },
        'galaxy': {
          purple: '#6C3BFF',
          purpleDark: '#5228CC',
          pink: '#FF4FD8',
          cyan: '#00D4FF',
        },
        'text': {
          primary: '#FFFFFF',
          secondary: '#B8C1EC',
          muted: '#7A859F',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'galaxy-gradient': 'linear-gradient(135deg, #0B1026 0%, #1A0A2E 50%, #0B1026 100%)',
        'galaxy-hero': 'linear-gradient(135deg, rgba(108,59,255,0.3) 0%, rgba(0,212,255,0.1) 50%, rgba(255,79,216,0.15) 100%)',
        'card-glass': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        'button-glow': 'linear-gradient(135deg, #6C3BFF 0%, #FF4FD8 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108,59,255,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255,79,216,0.6)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

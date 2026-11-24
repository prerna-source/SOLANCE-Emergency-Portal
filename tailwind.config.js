/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#0b0f19',
          card: '#131a2a',
          cardHover: '#182238',
          border: '#1e293b',
          borderLight: '#2a3b5c',
        },
        crimson: {
          DEFAULT: '#ef4444',
          dark: '#991b1b',
          glow: 'rgba(239, 68, 68, 0.35)',
        },
        amberStatus: {
          DEFAULT: '#f59e0b',
          dark: '#b45309',
          glow: 'rgba(245, 158, 11, 0.35)',
        },
        emeraldSafe: {
          DEFAULT: '#10b981',
          dark: '#047857',
          glow: 'rgba(16, 185, 129, 0.35)',
        },
        cyanInfo: {
          DEFAULT: '#38bdf8',
          dark: '#0284c7',
          glow: 'rgba(56, 189, 248, 0.35)',
        },
        shelterPurple: {
          DEFAULT: '#a855f7',
          dark: '#7e22ce',
          glow: 'rgba(168, 85, 247, 0.35)',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar': 'radar 4s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glowPulse: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

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
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          550: '#2563eb',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          400: '#a78bfa',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
        },
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // Dark theme tokens — matching reference image exactly
        darkBg: '#090a0f',
        darkSidebar: '#0d0f1a',
        darkCard: '#111827',
        darkCardHover: '#151c2e',
        darkBorder: '#1e2538',
        darkBorderLight: '#252d42',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.15)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.4)',
        'glow-blue': '0 0 20px rgba(37,99,235,0.3)',
        'glow-purple': '0 0 20px rgba(124,58,237,0.3)',
      },
      backgroundImage: {
        'sidebar-gradient': 'linear-gradient(180deg, #0d0f1a 0%, #0a0c15 100%)',
        'card-gradient': 'linear-gradient(135deg, #111827 0%, #0f1629 100%)',
        'active-gradient': 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        'logo-gradient': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease forwards',
        'slide-in': 'slide-in-left 0.35s ease forwards',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

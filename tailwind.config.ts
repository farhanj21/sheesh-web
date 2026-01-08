import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0a0a0a',
          900: '#121212',
          850: '#1a1a1a',
          800: '#1e1e1e',
          700: '#2a2a2a',
          600: '#404040',
        },
        silver: {
          100: '#f5f5f5',
          200: '#e8e8e8',
          300: '#d4d4d4',
          400: '#c0c0c0',
          500: '#a8a8a8',
          600: '#8c8c8c',
          700: '#6e6e6e',
        },
        accent: {
          silver: '#c0c0c0',
          chrome: '#e8e8e8',
          platinum: '#e5e4e2',
          pearl: '#f0ead6',
          disco: '#e066ff',
          neon: '#00ffff',
        },
      },
      fontFamily: {
        sans: ['var(--font-hk-grotesk)', 'system-ui', 'sans-serif'],
        display: ['var(--font-hk-grotesk)', 'system-ui', 'sans-serif'],
        fancy: ['var(--font-hk-grotesk)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(3rem, 10vw, 8rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        section: ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        shimmer: 'shimmer 3s linear infinite',
        shine: 'shine 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'glow-pulse': {
          '0%, 100%': {
            textShadow: '0 0 20px rgba(192, 192, 192, 0.8), 0 0 40px rgba(192, 192, 192, 0.4)',
          },
          '50%': {
            textShadow: '0 0 30px rgba(192, 192, 192, 1), 0 0 60px rgba(192, 192, 192, 0.6)',
          },
        },
      },
      backgroundImage: {
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(192, 192, 192, 0.3), transparent)',
        'metallic-gradient': 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 25%, #c0c0c0 50%, #a8a8a8 75%, #c0c0c0 100%)',
        'dark-gradient': 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
        'shimmer-gradient-light': 'linear-gradient(90deg, transparent, rgba(100,100,100,0.25), transparent)',
        'metallic-gradient-light': 'linear-gradient(135deg, #808080 0%, #a0a0a0 25%, #707070 50%, #606060 75%, #808080 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(192, 192, 192, 0.3)',
        'glow-lg': '0 0 40px rgba(192, 192, 192, 0.4)',
        'neon': '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
        'glow-dark': '0 0 20px rgba(100,100,100,0.3)',
        'glow-dark-lg': '0 0 40px rgba(80,80,80,0.4)',
      },
    },
  },
  plugins: [],
}

export default config

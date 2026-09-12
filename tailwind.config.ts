import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        paper: '#FFFFFF',
        sand: '#F5F3EE',
        line: '#E4E1D8',
        muted: '#6F6B63',
        accent: '#A9832E',
        green: '#2E6F52',
        greenDark: '#255A43',
        forest: '#122A1E',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
      borderRadius: {
        card: '0.25rem',
      },
      letterSpacing: {
        tightish: '-0.01em',
      },
    },
  },
  plugins: [],
};

export default config;

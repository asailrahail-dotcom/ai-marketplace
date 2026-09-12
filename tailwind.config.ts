import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0C',
        paper: '#FFFFFF',
        sand: '#F7F6F3',
        line: '#E7E5E0',
        muted: '#6B6B6B',
        accent: '#8A6D3B',
      },
      fontFamily: {
        sans: [
          'Tajawal',
          'IBM Plex Sans Arabic',
          'Segoe UI',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      maxWidth: {
        content: '1280px',
      },
      borderRadius: {
        card: '0.5rem',
      },
      letterSpacing: {
        tightish: '-0.01em',
      },
    },
  },
  plugins: [],
};

export default config;

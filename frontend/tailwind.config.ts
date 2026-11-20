import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF8FA3',
          50: '#FFF6F7',
          100: '#FFEAF0',
          200: '#FFD3DD',
          300: '#FFB6C5',
          400: '#F48FB1',
          500: '#FF8FA3',
          600: '#E9768C',
          700: '#C95F74',
          800: '#A74D60',
          900: '#803A49',
        },
        accent: {
          blue: '#3B82F6',
          pink: '#FF8FA3',
        },
      },
    },
  },
  plugins: [],
};

export default config;

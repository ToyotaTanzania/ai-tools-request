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
        brand: '#1d3c6f',
        'brand-dark': '#102849',
        'brand-light': '#e7ecf4',
        emblem: '#184377',
        'emblem-light': '#dfe6f1',
        accent: '#184377',
        ok: '#1d3c6f',
        okbg: '#e7ecf4',
        bad: '#5c6678',
        badbg: '#eef1f5',
        warn: '#184377',
        warnbg: '#dfe6f1',
        ink: '#1c2230',
        muted: '#5c6678',
        line: '#dde3ec',
        bg: '#f4f6fa',
        card: '#ffffff',
      },
      fontFamily: {
        sans: ['Segoe UI', '-apple-system', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(20,43,81,.08),0 8px 24px rgba(20,43,81,.06)',
      },
    },
  },
  plugins: [],
}

export default config

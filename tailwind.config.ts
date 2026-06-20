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
        'brand-dark': '#142b51',
        'brand-light': '#e9eef6',
        accent: '#c9a14a',
        ok: '#1f7a44',
        okbg: '#e6f4ec',
        bad: '#b3261e',
        badbg: '#fbe9e8',
        warn: '#8a6d00',
        warnbg: '#fbf3da',
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

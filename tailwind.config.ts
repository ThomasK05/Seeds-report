import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        harvest: {
          green: '#2D5016',
          'green-light': '#7AB648',
          cream: '#F9F6F0',
        },
      },
    },
  },
  plugins: [],
}
export default config

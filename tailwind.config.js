/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      colors: {
        brand: {
          white: '#FDFDFD',
          gray: '#F4F4F5',
          graphite: '#1A1C23',
          petroleum: '#0F172A',
          orange: '#F97316',
          blue: '#2563EB',
          green: '#10B981',
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular'],
      },
    },
  },
  plugins: [],
};

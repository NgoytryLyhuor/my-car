/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'toyota-blue': '#0B5394',
        'toyota-green': '#00A651',
        'hybrid-blue': '#1E88E5',
        'hybrid-green': '#4CAF50',
      },
    },
  },
  plugins: [],
}


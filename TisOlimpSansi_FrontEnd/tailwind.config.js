/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx,ts,tsx}",
    ".node_modules/leaflet/dist/leafllet.css",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors:{
        primary: "#180851",
        secondary:"#FE0000"
      },
      container:{
        center: true,
        padding:{
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl' :'6rem'
        }
      }
    },
  },
  plugins: [],
};
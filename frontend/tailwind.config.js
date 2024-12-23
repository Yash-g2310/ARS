/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    screens:{
      sm: '640px',  
      md: '768px',   
      lg: '1024px',  
      xl: '1280px',  
      '2xl': '1536px',
    },
    extend: {
      colors:{
        backg_dark: "#1E1F22",
        backg_mid_dark: "#202225",
        darkslategray: "#293b52",
        backg_1: "#2B2D31",
        button_purple: "#4752C4",
        light_gray: "#B5BAC1",
        light_white: "#F2F3F5",
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

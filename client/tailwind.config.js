/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#E0E0E0",
        typo: "#1F1F1F",
        bg_user: "#F1F1F1",
        bg_bot: "#F5E5CE",
        border: "#ECECEC",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        old: ["Old English Text MT", "sans-serif"],
        mont: ["Montserrat", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      lgg: "1365px",
      xl: "1700px",
    },
  },
  plugins: [],
};

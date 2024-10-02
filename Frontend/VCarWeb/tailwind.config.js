/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      primary: ["Nunito", "sans-serif;"],
    },
    colors: {
      primary: "#1DC071",
      secondary: "#6F49FD",
      tertiary: "#1DA1F2",
      quaternary: "#B7DFFF",
      quinary: "#FF9205",
      senary: "#fff9c0",
      text1: "#171725",
      text2: "#4B5264",
      text3: "#808191",
      text4: "#B2B3BD",
      text5: "#171725",
      text6: "#e7ecf0",
      text7: "#578EBE",
      text8: "#f3f7f9",
      iconColor: "#A2A2A8",
      white: "#FFFFFF",
      black: "#000000",
      whiteSoft: "#FCFBFF",
      graySoft: "#FCFCFC",
      grayf3: "#f3f3f3",
      grayf6: "#F6F7F9",
      strock: "#F1F1F3",
      lite: "#FCFCFD",
      error: "#EB5757",
      darkBG: "#13131A",
      darkSecondary: "#1C1C24",
      softDark: "#22222C",
      darkSoft: "#24242C",
      darkStrock: "#3A3A43",
      darkRed: "#422C32",

      // Primary Neutral Palette
      "primary-dark": "#0A196F",
      "primary-default": "#3563E9",
      "primary-light": "#658DF1",

      // Success Palette
      "success-dark": "#3B6506",
      "success-default": "#9CD323",
      "success-light": "#BCE455",

      // Error Palette
      "error-dark": "#7A0619",
      "error-default": "#FF4423",
      "error-light": "#FF7F59",

      // Warning Palette
      "warning-dark": "#7A4D0B",
      "warning-default": "#FFC73A",
      "warning-light": "#FFD96B",

      // Information Palette
      "info-dark": "#102E7A",
      "info-default": "#54A6FF",
      "info-light": "#7EC2FF",

      // Secondary Palette
      "secondary-dark": "#040815",
      "secondary-default": "#1A202C",
      "secondary-light": "#596780",

      "custom-blue": "#90A3BF",
      "filter-range": "#90A3BF",
    },
  },
  plugins: [],
};

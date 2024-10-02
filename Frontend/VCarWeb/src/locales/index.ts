import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en";
import vi from "./vi";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "vi",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en,
      vi,
    },
  });

export default i18n;

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import vi from './vi.json';

const resources = {
  en: en,
  vi: vi,
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'vi',
});

export default i18n;

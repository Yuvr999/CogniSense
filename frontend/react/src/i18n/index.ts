import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './translations';

// Retrieve saved language from localStorage if available, default to 'en'
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('cognisense_language') || 'en' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export const changeAppLanguage = (lng: 'en' | 'hi' | 'mr' | 'kn') => {
  i18n.changeLanguage(lng);
  if (typeof window !== 'undefined') {
    localStorage.setItem('cognisense_language', lng);
  }
};


export default i18n;

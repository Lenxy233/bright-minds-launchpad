import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import pt from './locales/pt.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  pt: { translation: pt },
};

// Initialize i18n asynchronously to avoid interfering with React initialization
const initI18n = async () => {
  if (!i18n.isInitialized) {
    await i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'en',
        lng: 'en',
        debug: false,
        detection: {
          order: ['localStorage', 'navigator', 'htmlTag'],
          caches: ['localStorage'],
        },
        interpolation: {
          escapeValue: false,
        },
      });
  }
  return i18n;
};

// Initialize immediately
initI18n();

export default i18n;
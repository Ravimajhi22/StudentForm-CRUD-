import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';
import teTranslation from './locales/te.json';
import urTranslation from './locales/ur.json';
import taTranslation from './locales/ta.json';
import mlTranslation from './locales/ml.json';
import knTranslation from './locales/kn.json';
import orTranslation from './locales/or.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
      te: { translation: teTranslation },
      ur: { translation: urTranslation },
      ta: { translation: taTranslation },
      ml: { translation: mlTranslation },
      kn: { translation: knTranslation },
      or: { translation: orTranslation },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './locales/en.json';
import translationBG from './locales/bg.json';


i18n.use(LanguageDetector).init({
    fallback: 'en',
    keySeparator: '.',
    resources: {
        en: {
            translations: translationEN,
        },
        bg: {
            translations: translationBG,
        }
    },
    ns: ['translations'],
    defaultNS: 'translations',
});
export default i18n;
import languages from '@agstudio/translations/lib';

const getLanguage = (acceptedLanguages: string[], defaultLanguage: string) => {
    let newLanguage = defaultLanguage;
    const langLocale = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase().split('-');
    if (langLocale.length >= 1) {
        newLanguage = langLocale[0];
    }
    if (acceptedLanguages.indexOf(newLanguage) === -1) {
        return defaultLanguage;
    }
    return newLanguage;
};
const acceptedLanguages = Object.keys(languages.translations);
const language = getLanguage(acceptedLanguages, languages.default);

export default {
    language,
    messages: languages.translations[language]
};

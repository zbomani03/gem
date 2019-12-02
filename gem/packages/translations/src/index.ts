import { Translations } from './Translations';

export interface ILanguages {
    default: string;
    translations: {
        [languageCode: string]: Object
    };
}

const languages: ILanguages = {
    default: 'en',
    translations: Translations
};

export default languages;

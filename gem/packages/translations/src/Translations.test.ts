import { Translations } from './Translations';

const assertTranslationCount = (translations: any, localeKey: string, count: number) => {
    const actualCount = Object.keys(translations[localeKey]).length;
    const pass = actualCount === count;
    if (!pass) {
        fail(`expected locale '${localeKey}' to have ${count} translation keys but got ${actualCount}`);
    }
};

const assertTranslationKey = (translations: any, localeKey: string, translationKey: string) => {
    const actual = translations[localeKey][translationKey];
    const pass = actual && actual !== '';
    if (!pass) {
        fail(`expected '${translationKey}' to exist for locale '${localeKey}' but got "${actual}"`);
    }
};

describe('Translations', () => {
    it('each local should have the same number of translations as en', () => {
        const numOfEnglishKeys = Object.keys(Translations.en).length;

        expect(numOfEnglishKeys).toBeGreaterThan(0);
        for (let localeKey in Translations) {
            if (localeKey !== 'en') {
                assertTranslationCount(Translations, localeKey, numOfEnglishKeys);
            }
        }
    });

    it('each local should have the same keys as en', () => {
        const englishKeys = Translations.en;

        for (let localeKey in Translations) {
            if (localeKey !== 'en') {
                for (let translationKey in englishKeys) {
                    if (translationKey) {
                        assertTranslationKey(Translations, localeKey, translationKey);
                    }
                }
            }
        }
    });
});

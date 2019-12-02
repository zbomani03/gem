import intl from "intl";
import languages from '@agstudio/translations/lib';
global.Intl = intl;
export default {
    messages: languages.translations
};

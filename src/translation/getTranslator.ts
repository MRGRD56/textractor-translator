import {DefinedTranslator, Translator} from '../configuration/Configuration';
import GoogleTranslator from './translators/GoogleTranslator';

const translators: Record<DefinedTranslator, Translator> = {
    GOOGLE_TRANSLATE: new GoogleTranslator()
};

const getDefinedTranslator = (translatorType: DefinedTranslator): Translator | undefined => {
    return translators[translatorType];
};

const getTranslator = (translator: DefinedTranslator | Translator): Translator => {
    let definedTranslator: Translator | undefined = undefined;

    if (typeof translator === 'string') {
        definedTranslator = getDefinedTranslator(translator);
    }

    return definedTranslator ?? (translator as Translator);
};

export default getTranslator;
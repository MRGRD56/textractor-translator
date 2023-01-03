import {DefinedTranslator, Translator} from '../configuration/Configuration';
import GoogleTranslator from './translators/GoogleTranslator';

class IdentityTranslator implements Translator {
    translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
        return Promise.resolve(text);
    }
}

class NoneTranslator implements Translator {
    translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
        return undefined as any;
    }
}

class InfiniteTranslator implements Translator {
    translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
        return new Promise<string>(() => {});
    }
}

const translators: Record<DefinedTranslator, Translator> = {
    GOOGLE_TRANSLATE: new GoogleTranslator(),
    X_IDENTITY: new IdentityTranslator(),
    X_NONE: new NoneTranslator(),
    X_INFINITE: new InfiniteTranslator()
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
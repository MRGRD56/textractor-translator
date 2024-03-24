import {DefinedTranslators, Translator} from '../configuration/Configuration';
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

export class DefinedTranslatorsImpl implements DefinedTranslators {
    GOOGLE_TRANSLATE = new GoogleTranslator();
    X_IDENTITY = new IdentityTranslator();
    X_NONE = new NoneTranslator();
    X_INFINITE = new InfiniteTranslator();

    public static INSTANCE: DefinedTranslators = new DefinedTranslatorsImpl();

    private constructor() {}
}
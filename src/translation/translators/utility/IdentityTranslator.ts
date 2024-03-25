import {Translator} from '../../../configuration/Configuration';

class IdentityTranslator implements Translator {
    translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
        return Promise.resolve(text);
    }
}

export default IdentityTranslator;
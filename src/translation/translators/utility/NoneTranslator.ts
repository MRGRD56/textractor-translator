import {Translator} from '../../../configuration/Configuration';

class NoneTranslator implements Translator {
    translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
        return undefined as any;
    }
}

export default NoneTranslator;
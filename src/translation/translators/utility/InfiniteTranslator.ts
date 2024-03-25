import {Translator} from '../../../configuration/Configuration';

class InfiniteTranslator implements Translator {
    translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
        return new Promise<string>(() => {});
    }
}

export default InfiniteTranslator;
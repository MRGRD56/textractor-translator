import httpRequest from '../../utils/httpRequest';
import {LibreTranslatorConfig, Translator} from '../../configuration/Configuration';

class LibreTranslator implements Translator {
    constructor(private readonly config: LibreTranslatorConfig) {
    }

    async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
        const host = this.config.host || 'https://libretranslate.com';
        const url = new URL('/translate', host).toString();

        const responseData: any = await httpRequest(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: text,
                source: sourceLanguage,
                target: targetLanguage,
                format: this.config.format,
                api_key: this.config.apiKey
            })
        }).then((response) => response.json());

        if (!responseData || responseData.translatedText == null) {
            console.error('LibreTranslator unable to translate: ', responseData);
            throw responseData;
        }

        return responseData.translatedText as string;
    }
}

export default LibreTranslator;
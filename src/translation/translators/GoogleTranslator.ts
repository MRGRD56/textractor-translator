import * as queryString from 'query-string';
import httpRequest from '../../utils/httpRequest';
import {Translator} from '../../configuration/Configuration';
class GoogleTranslator implements Translator {
    async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
        const url = 'https://translate.googleapis.com/translate_a/single';
        const responseData: any = await httpRequest(`${url}?${queryString.stringify({
            client: 'gtx',
            dt: 't',
            sl: sourceLanguage,
            tl: targetLanguage,
            q: text
        })}`, {
            method: 'GET'
        }).then((response) => response.json());

        return responseData[0].map((item: any) => item[0]).join('');
    }
}

export default GoogleTranslator;
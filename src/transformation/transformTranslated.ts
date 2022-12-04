import {Configuration, Sentence, OptionalTransformedText} from '../configuration/Configuration';

const transformTranslated = (configFunction: Configuration['transformTranslated']) => (translatedText: string, originalSentence: Sentence): OptionalTransformedText => {
    if (typeof configFunction === 'function') {
        const transformed = configFunction(translatedText, originalSentence);
        if (typeof transformed === 'string' || typeof transformed === 'object') {
            return transformed;
        }
        if (transformed == null) {
            return undefined;
        }

        return String(transformed);
    }

    return translatedText;
};

export default transformTranslated;
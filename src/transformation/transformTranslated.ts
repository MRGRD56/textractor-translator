import {Configuration, Sentence, OptionalTransformedText, TranslationMeta} from '../configuration/Configuration';

const transformTranslated = (configFunction: Configuration['transformTranslated']) => (translatedText: string, originalSentence: Sentence, translationMeta: TranslationMeta): OptionalTransformedText => {
    if (typeof configFunction === 'function') {
        const transformed = configFunction(translatedText, originalSentence, translationMeta);
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
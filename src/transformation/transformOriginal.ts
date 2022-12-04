import {Configuration, MultiTransformedText, Sentence} from '../configuration/Configuration';

const transformOriginal = (configFunction: Configuration['transformOriginal']) => (sentence: Sentence): MultiTransformedText | string | undefined => {
    if (typeof configFunction === 'function') {
        const transformed = configFunction(sentence);
        if (typeof transformed === 'string' || typeof transformed === 'object') {
            return transformed;
        }
        if (transformed == null) {
            return undefined;
        }

        return String(transformed);
    }

    return sentence.text;
};

export default transformOriginal;
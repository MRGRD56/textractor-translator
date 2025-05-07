import {StreamingTranslator, Translator} from './Configuration';

export const isStreamingTranslator = (translator: Translator): translator is StreamingTranslator => {
    return typeof (translator as any).translateStreaming === 'function';
}

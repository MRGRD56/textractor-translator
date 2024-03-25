export interface Sentence {
    text: string;
    meta?: SentenceMeta;
}

export interface SentenceMeta {
    isCurrentSelect: boolean;
    processId: number;
    threadNumber: number;
    threadName: number;
    timestamp: number;
}

export interface Translator {
    translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string>;
}

export interface LibreTranslatorConfig {
    host?: string;
    apiKey?: string;
    format?: 'text' | 'html';
}

export interface DefinedTranslators {
    GoogleTranslate: () => Translator,
    LibreTranslate: (config?: LibreTranslatorConfig) => Translator;
    debug: {
        Identity: () => Translator;
        Infinite: () => Translator;
        None: () => Translator;
    }
}

export interface DisplayedTransformedText {
    plain: string;
    displayed: string;
    isHtml?: boolean;
}

export type OptionalTransformedText = TransformedText | undefined;
export type TransformedText = DisplayedTransformedText | string;

export type MultiTransformedText = OptionalTransformedText | OptionalTransformedText[];

export interface Configuration {
    translator: Translator;
    languages: {
        source: string;
        target: string;
    };

    transformOriginal?(sentence: Sentence): MultiTransformedText;

    transformTranslated?(translatedText: string, originalSentence: Sentence): OptionalTransformedText;
}
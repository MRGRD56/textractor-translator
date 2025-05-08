import {ChatCompletionMessageParam} from 'openai/resources';
import {ChatCompletionCreateParamsBase} from 'openai/src/resources/chat/completions/completions';

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
    translate(
        text: string,
        sourceLanguage: string,
        targetLanguage: string
    ): Promise<string>;
}

export interface StreamingTranslator extends Translator {
    translateStreaming(
        text: string,
        sourceLanguage: string,
        targetLanguage: string
    ): AsyncGenerator<string, string>;
}

export interface LibreTranslatorConfig {
    host?: string;
    apiKey?: string;
    format?: 'text' | 'html';
}

export interface OpenAIChatCompletionsConfig {
    baseURL?: string;
    apiKey?: string;
    requestBodyParams: Omit<ChatCompletionCreateParamsBase, 'messages'>;
    systemPrompt?: object;
    createMessages?: (text: string, sourceLanguage: string, targetLanguage: string, previousMessages: ChatCompletionMessageParam[], getLanguageName: (languageCode: string | undefined) => string | undefined) => ChatCompletionMessageParam[];
    keptPreviousMessagesLimit?: number;
    transformAssistantResponseForChatHistory?: (assistantResponse: string) => string;
}

export interface DefinedTranslators {
    GoogleTranslate: () => Translator,
    LibreTranslate: (config?: LibreTranslatorConfig) => Translator;
    OpenAIChatCompletions: (config: OpenAIChatCompletionsConfig) => StreamingTranslator;
    debug: {
        Identity: () => Translator;
        Infinite: () => Translator;
        None: () => Translator;
    }
}

export interface ExtraHtml {
    html: string;
    position: InsertPosition;
}

export interface DisplayedTransformedText {
    plain: string;
    displayed: string;
    isHtml?: boolean;
    extraCss?: {
        sentenceContainer?: string[];
        sentence?: string[];
        textContainer?: string[];
        text?: string[];
    },
    extraHtml?: {
        sentenceContainer?: ExtraHtml[];
        sentence?: ExtraHtml[];
        textContainer?: ExtraHtml[];
        text?: ExtraHtml[];
    }
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
import {OpenAIChatCompletionsConfig, StreamingTranslator} from '../../configuration/Configuration';
import OpenAI from 'openai';
import {ChatCompletionMessageParam} from 'openai/resources';
import httpRequest from '../../utils/httpRequest';
import languagesMap from '../../utils/languagesMap';

class OpenAIChatCompletions implements StreamingTranslator {
    private readonly openai: OpenAI;
    private readonly messagesHistory: ChatCompletionMessageParam[] = [];
    private readonly messagesHistoryLimit: number;

    constructor(private readonly config: OpenAIChatCompletionsConfig) {
        this.openai = new OpenAI({
            baseURL: config.baseURL,
            apiKey: config.apiKey ?? process.env['OPENAI_API_KEY'],
            fetch: httpRequest as any,
            dangerouslyAllowBrowser: true
        });

        config.keptPreviousMessagesLimit ??= 10;
        this.messagesHistoryLimit = (config.keptPreviousMessagesLimit) * 2;
    }

    private putSentenceToHistory(userMessage: ChatCompletionMessageParam, translation: string) {
        if (!this.config.keptPreviousMessagesLimit) return;

        this.messagesHistory.push(userMessage);
        this.messagesHistory.push({ role: 'assistant', content: translation });

        if (this.messagesHistory.length > this.messagesHistoryLimit) {
            this.messagesHistory.splice(0, this.messagesHistory.length - this.messagesHistoryLimit);
        }
    }

    private createMessages(text: string, sourceLanguage: string, targetLanguage: string): ChatCompletionMessageParam[] {
        const fallbackCreate = (text: string, sourceLanguage: string, targetLanguage: string, previousMessages: ChatCompletionMessageParam[], getLanguageName: (languageCode: string | undefined) => string | undefined): ChatCompletionMessageParam[] => {
            const sourceLanguageName = getLanguageName(sourceLanguage);
            const targetLanguageName = getLanguageName(targetLanguage)

            return [
                {
                    role: 'system',
                    content: `You are a real-time translation service. You get text in one language and translate it to another, in plain text, without giving any comments. You only output the translation. Make sure to maintain quality and the context of the story. In your response output the translation of the text that is inside the text_to_translate tag right away without any comments, or any extra tags (do not ever output the "text_to_translate" tag itself! You are not allowed to output neither '<text_to_translate>' nor </text_to_translate>'!). You translate text ${sourceLanguageName ? `from ${sourceLanguageName} ` : ''}into ${targetLanguageName}.`,
                },
                ...previousMessages,
                {
                    role: 'user',
                    content: `Translate <text_to_translate>${text}</text_to_translate> Translation:`,
                }
            ];
        };

        return (this.config.createMessages ?? fallbackCreate)(
            text,
            sourceLanguage,
            targetLanguage,
            this.messagesHistory,
            getLanguageName
        );
    }

    async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
        const messages = this.createMessages(text, sourceLanguage, targetLanguage);

        const response = await this.openai.chat.completions.create({
            messages,
            ...this.config.requestBodyParams,
            stream: false
        });

        const result = response.choices[0]?.message?.content ?? '';
        this.putSentenceToHistory(messages[messages.length - 1], result);

        return result;
    }

    async *translateStreaming(text: string, sourceLanguage: string, targetLanguage: string): AsyncGenerator<string, string> {
        const messages = this.createMessages(text, sourceLanguage, targetLanguage);
        let full = '';

        const stream = await this.openai.chat.completions.create({
            messages,
            ...this.config.requestBodyParams,
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                full += content;
                yield content;
            }
        }

        this.putSentenceToHistory(messages[messages.length - 1], full);
        return full;
    }
}

const getLanguageName = (languageCode: string | undefined): string | undefined => {
    if (!languageCode ||  languageCode === 'auto') {
        return undefined;
    }

    return languagesMap[languageCode];
};

export default OpenAIChatCompletions;

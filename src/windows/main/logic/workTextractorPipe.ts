import {listenToPipe} from '../../../textractorServer';
import {Configuration, ExtraHtml, OptionalTransformedText, Sentence,} from '../../../configuration/Configuration';
import getProfileConfig from '../../../configuration/getProfileConfig';
import nodeConsole from '../../../utils/nodeConsole';
import {isHistoryShownRef} from '../preload';
import {isStreamingTranslator} from '../../../configuration/utils';

/**
 * Runtime‑type‑guard to detect an async generator.
 */
function isAsyncGenerator<T, R>(obj: any): obj is AsyncGenerator<T, R> {
    return obj && typeof obj[Symbol.asyncIterator] === 'function';
}

const appendExtraHtml = (htmlToAppend: ExtraHtml, element: Element) => {
    element.insertAdjacentHTML(htmlToAppend.position, htmlToAppend.html);
};

const appendExtraHtmls = (htmlsToAppend: ExtraHtml[] | undefined, element: Element) => {
    if (htmlsToAppend) {
        for (const htmlToAppend of htmlsToAppend) {
            if (htmlToAppend) {
                appendExtraHtml(htmlToAppend, element);
            }
        }
    }
};

const applyExtraCss = (cssToApply: string[] | undefined, element: Element) => {
    if (cssToApply) {
        for (const css of cssToApply) {
            if (css) {
                const existingStyle = element.getAttribute('style');
                if (existingStyle) {
                    const endsWithSemicolon = /;\s*$/.test(existingStyle);
                    element.setAttribute('style', existingStyle + (endsWithSemicolon ? '' : '; ') + css);
                } else {
                    element.setAttribute('style', css);
                }
            }
        }
    }
};

/**
 * Returns either a Promise with a full translation **или** AsyncGenerator, если переводчик поддерживает стриминг.
 */
const translateText = (
    originalText: string,
    config: Configuration,
): Promise<string> | AsyncGenerator<string, string> | undefined => {
    const translator: any = config.translator;
    if (!translator) return undefined;

    // Если есть streamTranslate → пользуемся ею
    if (isStreamingTranslator(translator)) {
        return translator.translateStreaming(
            originalText,
            config.languages.source,
            config.languages.target,
        );
    }

    // Fallback на обычный translate()
    return translator.translate(
        originalText,
        config.languages.source,
        config.languages.target,
    );
};

const showSentence = (
    config: Configuration,
    textContainer: HTMLElement,
    textContainerWrapper: HTMLElement,
    sampleTextContainer: HTMLElement,
    originalText: OptionalTransformedText,
    translatedTextHandle: Promise<string> | AsyncGenerator<string, string> | undefined,
    originalSentence: Sentence,
): void => {
    const originalTextDisplayed =
        typeof originalText === 'object' ? originalText.displayed ?? originalText.plain : originalText;
    const isHtml = typeof originalText === 'object' && Boolean(originalText.isHtml);
    const extraCss = typeof originalText === 'object' ? originalText.extraCss : undefined;
    const extraHtml = typeof originalText === 'object' ? originalText.extraHtml : undefined;

    const sentenceOriginalElement = document.createElement('div');
    sentenceOriginalElement.classList.add('sentence-original');

    const sentenceOriginalTextElement = document.createElement('div');
    sentenceOriginalTextElement.classList.add('sentence-text');

    if (isHtml) {
        sentenceOriginalTextElement.innerHTML = originalTextDisplayed as string;
    } else {
        sentenceOriginalTextElement.textContent = originalTextDisplayed as string;
    }
    sentenceOriginalElement.append(sentenceOriginalTextElement);

    const sentenceTranslatedElement = document.createElement('div');
    sentenceTranslatedElement.classList.add('sentence-translated', 'sentence-loading');
    sentenceTranslatedElement.innerHTML = '<div class="loading-horiz"><img src="../assets/loading-horiz.svg" alt="Translating..."></div>';

    const sentenceElement = document.createElement('div');
    sentenceElement.classList.add('sentence');
    sentenceElement.append(sentenceOriginalElement);
    if (translatedTextHandle) {
        sentenceElement.append(sentenceTranslatedElement);
    }

    const sentenceContainerElement = document.createElement('div');
    sentenceContainerElement.classList.add('sentence-container');
    sentenceContainerElement.append(sentenceElement);

    sampleTextContainer.classList.add('d-none');
    textContainer.append(sentenceContainerElement);

    if (extraHtml) {
        appendExtraHtmls(extraHtml.sentenceContainer, sentenceContainerElement);
        appendExtraHtmls(extraHtml.sentence, sentenceElement);
        appendExtraHtmls(extraHtml.textContainer, sentenceOriginalElement);
        appendExtraHtmls(extraHtml.text, sentenceOriginalTextElement);
    }
    if (extraCss) {
        applyExtraCss(extraCss.sentenceContainer, sentenceContainerElement);
        applyExtraCss(extraCss.sentence, sentenceElement);
        applyExtraCss(extraCss.textContainer, sentenceOriginalElement);
        applyExtraCss(extraCss.text, sentenceOriginalTextElement);
    }

    if (isHistoryShownRef.current) {
        textContainerWrapper.scrollTo(0, textContainerWrapper.scrollHeight);
    }

    /**
     * Обновление (или первый рендер) переведённого текста в DOM.
     */
    const renderTranslated = (translated: OptionalTransformedText) => {
        const translatedTextDisplayed =
            typeof translated === 'object' ? translated.displayed ?? translated.plain : translated;
        const isHtmlTranslated = typeof translated === 'object' && Boolean(translated.isHtml);
        const extraCssTr = typeof translated === 'object' ? translated.extraCss : undefined;
        const extraHtmlTr = typeof translated === 'object' ? translated.extraHtml : undefined;

        let sentenceTranslatedTextElement = sentenceTranslatedElement.querySelector('.sentence-text');
        if (!sentenceTranslatedTextElement) {
            sentenceTranslatedTextElement = document.createElement('div');
            sentenceTranslatedTextElement.classList.add('sentence-text');
            sentenceTranslatedElement.classList.remove('sentence-loading');
            sentenceTranslatedElement.innerHTML = '';
            sentenceTranslatedElement.append(sentenceTranslatedTextElement);
        }

        if (isHtmlTranslated) {
            sentenceTranslatedTextElement.innerHTML = translatedTextDisplayed as string;
        } else {
            sentenceTranslatedTextElement.textContent = translatedTextDisplayed as string;
        }

        // extra html / css для перевода — применяем один раз, когда впервые получили контент
        if (extraHtmlTr && !sentenceTranslatedElement.dataset.extraApplied) {
            appendExtraHtmls(extraHtmlTr.sentenceContainer, sentenceContainerElement);
            appendExtraHtmls(extraHtmlTr.sentence, sentenceElement);
            appendExtraHtmls(extraHtmlTr.textContainer, sentenceOriginalElement);
            appendExtraHtmls(extraHtmlTr.text, sentenceTranslatedElement);
            sentenceTranslatedElement.dataset.extraApplied = '1';
        }
        if (extraCssTr && !sentenceTranslatedElement.dataset.extraCssApplied) {
            applyExtraCss(extraCssTr.sentenceContainer, sentenceContainerElement);
            applyExtraCss(extraCssTr.sentence, sentenceElement);
            applyExtraCss(extraCssTr.textContainer, sentenceTranslatedElement);
            applyExtraCss(extraCssTr.text, sentenceTranslatedElement.querySelector('.sentence-text')!);
            sentenceTranslatedElement.dataset.extraCssApplied = '1';
        }
    };

    if (!translatedTextHandle) {
        // нет перевода — ничего не делаем
        return;
    }

    // ---- PROMISE‑БАЗОВЫЙ ПЕРЕВОД ----
    if (!isAsyncGenerator<string, string>(translatedTextHandle)) {
        translatedTextHandle
            .then((translatedText) => {
                const transformedText = config.transformTranslated?.(translatedText, originalSentence);

                if (transformedText === undefined) {
                    sentenceTranslatedElement.remove();
                    return;
                }

                renderTranslated(transformedText);
            })
            .catch((error) => {
                console.error('An error occurred while translating', error);
                sentenceTranslatedElement.classList.remove('sentence-loading');
                sentenceTranslatedElement.textContent = 'Error while translating';
            })
            .finally(() => {
                if (isHistoryShownRef.current) {
                    textContainerWrapper.scrollTo(0, textContainerWrapper.scrollHeight);
                }
            });
        return;
    }

    // ---- СТРИМИНГ ----
    (async () => {
        let fullTranslation = '';
        try {
            for await (const chunk of translatedTextHandle) {
                fullTranslation += chunk;
                const transformed = config.transformTranslated?.(fullTranslation, originalSentence);
                if (transformed !== undefined) {
                    renderTranslated(transformed);
                }
            }
        } catch (error) {
            console.error('An error occurred while translating', error);
            sentenceTranslatedElement.classList.remove('sentence-loading');
            sentenceTranslatedElement.textContent = 'Error while translating';
        } finally {
            if (isHistoryShownRef.current) {
                textContainerWrapper.scrollTo(0, textContainerWrapper.scrollHeight);
            }
        }
    })();
};

const workTextractorPipe = () => {
    const textContainerWrapper = document.getElementById('text-wrapper')!;
    const textContainer = document.getElementById('text')!;
    const sampleTextContainer = document.getElementById('text-sample')!;

    listenToPipe((sentence) => {
        try {
            const config = getProfileConfig();
            const multiTransformedText = config.transformOriginal?.(sentence);
            const transformedTexts = Array.isArray(multiTransformedText) ? multiTransformedText : [multiTransformedText];

            console.log('New Sentence', { sentence, transformedTexts });

            for (const transformedText of transformedTexts) {
                if (transformedText !== undefined) {
                    const text = typeof transformedText === 'object' ? transformedText.plain : transformedText;

                    showSentence(
                        config,
                        textContainer,
                        textContainerWrapper,
                        sampleTextContainer,
                        transformedText,
                        translateText(text, config),
                        sentence,
                    );
                }
            }
        } catch (e) {
            nodeConsole.error('Error handling a sentence', e);
            console.error('Error handling a sentence', e);
        }
    });
};

export default workTextractorPipe;

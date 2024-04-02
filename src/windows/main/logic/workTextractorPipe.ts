import {listenToPipe} from '../../../textractorServer';
import {Configuration, ExtraHtml, OptionalTransformedText, Sentence} from '../../../configuration/Configuration';
import getProfileConfig from '../../../configuration/getProfileConfig';
import nodeConsole from '../../../utils/nodeConsole';
import {isHistoryShownRef} from '../preload';

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

const translateText = (originalText: string, config: Configuration): Promise<string> => {
    return config.translator?.translate(originalText, config.languages.source, config.languages.target);
};

const showSentence = (
    config: Configuration,
    textContainer: HTMLElement,
    textContainerWrapper: HTMLElement,
    sampleTextContainer: HTMLElement,
    originalText: OptionalTransformedText,
    translatedTextPromise: Promise<string> | undefined,
    originalSentence: Sentence
): void => {
    const originalTextDisplayed = typeof originalText === 'object' ? (originalText.displayed ?? originalText.plain) : originalText;
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
    if (translatedTextPromise) {
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

    if (translatedTextPromise) {
        translatedTextPromise
            .then(translatedText => {
                const transformedText = config.transformTranslated?.(translatedText, originalSentence);

                if (transformedText === undefined) {
                    sentenceTranslatedElement.remove();
                    return;
                }

                const translatedTextDisplayed = typeof transformedText === 'object' ? (transformedText.displayed ?? transformedText.plain) : transformedText;
                const isHtml = typeof transformedText === 'object' && Boolean(transformedText.isHtml);
                const extraCss = typeof transformedText === 'object' ? transformedText.extraCss : undefined;
                const extraHtml = typeof transformedText === 'object' ? transformedText.extraHtml : undefined;

                const sentenceTranslatedTextElement = document.createElement('div');
                sentenceTranslatedTextElement.classList.add('sentence-text');

                if (isHtml) {
                    sentenceTranslatedTextElement.innerHTML = translatedTextDisplayed;
                } else {
                    sentenceTranslatedTextElement.textContent = translatedTextDisplayed;
                }

                sentenceTranslatedElement.classList.remove('sentence-loading');
                sentenceTranslatedElement.innerHTML = '';
                sentenceTranslatedElement.append(sentenceTranslatedTextElement);

                if (extraHtml) {
                    appendExtraHtmls(extraHtml.sentenceContainer, sentenceContainerElement);
                    appendExtraHtmls(extraHtml.sentence, sentenceElement);
                    appendExtraHtmls(extraHtml.textContainer, sentenceOriginalElement);
                    appendExtraHtmls(extraHtml.text, sentenceOriginalTextElement);
                }
                if (extraCss) {
                    applyExtraCss(extraCss.sentenceContainer, sentenceContainerElement);
                    applyExtraCss(extraCss.sentence, sentenceElement);
                    applyExtraCss(extraCss.textContainer, sentenceTranslatedElement);
                    applyExtraCss(extraCss.text, sentenceTranslatedTextElement);
                }
            })
            .catch(error => {
                console.error('An error occurred while translating', error)
                sentenceTranslatedElement.classList.remove('sentence-loading');
                sentenceTranslatedElement.textContent = 'Error while translating';
            })
            .finally(() => {
                if (isHistoryShownRef.current) {
                    textContainerWrapper.scrollTo(0, textContainerWrapper.scrollHeight); // todo check if the scroll is near to the bottom now
                }
            });
    }
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

            console.log('New Sentence', {sentence, transformedTexts});

            for (const transformedText of transformedTexts) {
                if (transformedText !== undefined) {
                    const text = typeof transformedText === 'object' ? transformedText.plain : transformedText;

                    showSentence(config, textContainer, textContainerWrapper, sampleTextContainer, transformedText, translateText(text, config), sentence);
                }
            }
        } catch (e) {
            nodeConsole.error('Error handling a sentence', e);
            console.error('Error handling a sentence', e);
        }
    });
};

export default workTextractorPipe;
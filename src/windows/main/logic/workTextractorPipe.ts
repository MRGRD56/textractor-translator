import {listenToPipe} from '../../../textractorServer';
import {Configuration, OptionalTransformedText, Sentence} from '../../../configuration/Configuration';
import getProfileConfig from '../../../configuration/getProfileConfig';
import nodeConsole from '../../../utils/nodeConsole';
import {isHistoryShownRef} from '../preload';

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
    const originalTextDisplayed = typeof originalText === 'object' ? originalText.displayed : originalText;
    const isHtml = typeof originalText === 'object' && Boolean(originalText.isHtml);

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

    if (translatedTextPromise) {
        translatedTextPromise
            .then(translatedText => {
                const transformedText = config.transformTranslated?.(translatedText, originalSentence);

                if (transformedText === undefined) {
                    sentenceTranslatedElement.remove();
                    return;
                }

                const translatedTextDisplayed = typeof transformedText === 'object' ? transformedText.displayed : transformedText;
                const isHtml = typeof transformedText === 'object' && Boolean(transformedText.isHtml);

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

    const sentenceElement = document.createElement('div');
    sentenceElement.classList.add('sentence');
    sentenceElement.append(sentenceOriginalElement);
    if (translatedTextPromise) {
        sentenceElement.append(sentenceTranslatedElement);
    }

    sampleTextContainer.classList.add('d-none');
    textContainer.append(sentenceElement);

    if (isHistoryShownRef.current) {
        textContainerWrapper.scrollTo(0, textContainerWrapper.scrollHeight);
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
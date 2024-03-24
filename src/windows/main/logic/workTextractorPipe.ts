import {listenToPipe} from '../../../textractorServer';
import {Configuration, OptionalTransformedText, Sentence} from '../../../configuration/Configuration';
import Store from 'electron-store';
import getProfileConfig from '../../../configuration/getProfileConfig';
import nodeConsole from '../../../utils/nodeConsole';

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
    if (isHtml) {
        sentenceOriginalElement.innerHTML = originalTextDisplayed as string;
    } else {
        sentenceOriginalElement.textContent = originalTextDisplayed as string;
    }

    const sentenceTranslatedElement = document.createElement('div');
    sentenceTranslatedElement.classList.add('sentence-translated');
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

                if (isHtml) {
                    sentenceTranslatedElement.innerHTML = translatedTextDisplayed;
                } else {
                    sentenceTranslatedElement.textContent = translatedTextDisplayed;
                }
            })
            .catch(error => {
                console.error('An error occurred while translating', error)
                sentenceTranslatedElement.textContent = 'Error while translating';
            })
            .finally(() => {
                textContainerWrapper.scrollTo(0, textContainerWrapper.scrollHeight); // todo check if the scroll is near to the bottom now
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

    textContainerWrapper.scrollTo(0, textContainerWrapper.scrollHeight);
};

const store = new Store();

const workTextractorPipe = () => {
    const textContainerWrapper = document.getElementById('text-wrapper')!;
    const textContainer = document.getElementById('text')!;
    const sampleTextContainer = document.getElementById('text-sample')!;

    listenToPipe((sentence) => {
        try {
            const config = getProfileConfig(store);
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
import {runTextractorServer} from '../../textractorServer';
import Store from 'electron-store';
import {CONFIG_SOURCE_KEY} from '../../constants/store-keys';
import getConfiguration from '../../configuration/getConfiguration';
import {Configuration, Sentence, OptionalTransformedText} from '../../configuration/Configuration';
import getTranslator from '../../translation/getTranslator';

const translateText = (originalText: string, config: Configuration): Promise<string> => {
    return getTranslator(config.translator).translate(originalText, config.languages.source, config.languages.target);
};

const showSentence = (config: Configuration, textContainer: HTMLElement, textContainerWrapper: HTMLElement, originalText: OptionalTransformedText, translatedTextPromise: Promise<string>, originalSentence: Sentence): void => {
    const originalTextDisplayed = typeof originalText === 'object' ? originalText.displayed : originalText;
    const isHtml = typeof originalText === 'object' && Boolean(originalText.isHtml);

    const sentenceOriginalElement = document.createElement('div');
    sentenceOriginalElement.classList.add('sentence-original');
    if (isHtml) {
        sentenceOriginalElement.innerHTML = originalTextDisplayed;
    } else {
        sentenceOriginalElement.textContent = originalTextDisplayed;
    }

    const sentenceTranslatedElement = document.createElement('div');
    sentenceTranslatedElement.classList.add('sentence-translated');
    sentenceTranslatedElement.textContent = 'Translating...';

    translatedTextPromise
        .then(translatedText => {
            const transformedText = config.transformTranslated(translatedText, originalSentence);

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

    const sentenceElement = document.createElement('div');
    sentenceElement.classList.add('sentence');
    sentenceElement.append(sentenceOriginalElement, sentenceTranslatedElement);

    textContainer.append(sentenceElement);

    textContainerWrapper.scrollTo(0, textContainerWrapper.scrollHeight);
};

const store = new Store();

window.addEventListener('DOMContentLoaded', () => {
    const textContainerWrapper = document.getElementById('text-wrapper')!;
    const textContainer = document.getElementById('text')!;

    runTextractorServer((sentence) => {
        const {meta} = sentence;

        const configSource = store.get(CONFIG_SOURCE_KEY) as string;
        const config = getConfiguration(configSource);
        const multiTransformedText = config.transformOriginal(sentence);
        const transformedTexts = Array.isArray(multiTransformedText) ? multiTransformedText : [multiTransformedText];

        for (const transformedText of transformedTexts) {
            if (transformedText !== undefined) {
                const text = typeof transformedText === 'object' ? transformedText.plain : transformedText;

                showSentence(config, textContainer, textContainerWrapper, transformedText, translateText(text, config), sentence);
            }
        }
    });
});

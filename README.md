# Textractor Translator

**Translate visual novels in real time, while reading**  
**Customize it however you wish**

<img src="https://user-images.githubusercontent.com/35491968/210263578-b57cb7fd-c081-4cb9-9ebd-2e09b22f1f09.png" width="600">

It works with [Textractor](https://github.com/Artikash/Textractor) letting you **configure** it for **each separate game**: **transform** the extracted text using **JavaScript**, **translate** it using a pre-defined translator or write **your own**, **stylize** the text window to **blend in** with the game.  

It can replace a huge part of the built-in `xdll` extensions for Textractor.

It allows you to perform and configure the following things for each game:
- Parsing and transforming the text extracted by Textractor, making it readable;
- Translating the transformed text;
- Transforming the translated text;
- Stylizing the text using HTML & CSS;
- The appearance of the text window;
- Using custom translators, besides the built-in ones;
- Using LLMs for translations, with streaming.

> [!NOTE]
> This project is not associated with the original Textractor developers.

## Demo

![2024-04-03_22-44-40-ezgif com-optimize](https://github.com/MRGRD56/textractor-translator/assets/35491968/ed6daf3e-d76a-48d3-a813-7160b790066f)

<details>
<summary>View more</summary>

<img src="https://user-images.githubusercontent.com/35491968/210839740-3f1b3801-1b06-4814-9dba-0a737b7890cd.gif" width=800>
<!--![textractor-translator-v0 2 0-demo_3](https://user-images.githubusercontent.com/35491968/210839740-3f1b3801-1b06-4814-9dba-0a737b7890cd.gif)-->
    
<img src="https://github.com/MRGRD56/textractor-translator/assets/35491968/f1e83c22-7810-4eaf-9c45-4eff49963fda" width="800">

<img src="https://github.com/MRGRD56/textractor-translator/assets/35491968/576e8d87-7bd1-439c-87c2-8ad5063861a5" width="800">

<img src="https://user-images.githubusercontent.com/35491968/216782294-7ac22557-c6a8-40c1-968f-9ad88c8ec810.png" width="800">

</details>

## Installation

Currently, only Windows x64 it supported.
It can work with both `Textractor x86` and `Textractor x64`.

1. Download the binaries in the [Releases](https://github.com/MRGRD56/textractor-translator/releases) section [x64](https://github.com/MRGRD56/textractor-translator/releases/latest/download/TextractorTranslator-win32-x64.zip)).  
2. Unzip the archive to the directory where the app will be stored.
3. Run the `TextractorTranslator.exe` file to run the application.
4. You will see the main window of the app:  
   ![image](https://github.com/MRGRD56/textractor-translator/assets/35491968/e9ec0a8c-d941-40a8-8eaf-88c86f4b983e)
5. Hover the top right corner of the window, then click the <img src="https://github.com/MRGRD56/textractor-translator/assets/35491968/c17cea08-7af2-4427-8af8-589ce7e05f22"></img> settings button.
6. You will see the settings window:  
   ![image](https://github.com/MRGRD56/textractor-translator/assets/35491968/ca35e748-4d0c-4212-835d-f3ec8cee367e)
7. Ensure you have [Textractor](https://github.com/Artikash/Textractor) installed. If you don't, install it before you continue. Remember the directory where you'll have installed it.  
8. Having Textractor installed, click a <img src="https://github.com/MRGRD56/textractor-translator/assets/35491968/cff85f4b-85e8-4fdc-89b4-da397347c4c3"></img> folder button to select the `Textractor.exe` executable of Textractor.
9. When you select either `Textractor x86` or `Textractor x64` location, the other one will be selected automatically. If not, please, select it manually if you need it.
10. It's recommended to check the `Autorun` checkbox for the Textractor you're planning to run with. It depends on the bitness of the game process. Usually it's `x86` for visual novels.
11. After you have configured the path(s) to Textractor, you'll have to install the [TextractorPipe](https://github.com/MRGRD56/textractor-integration-extensions) extension. It can be done automatically by clicking the install button(s):  
    ![image](https://github.com/MRGRD56/textractor-translator/assets/35491968/733824e3-1bd8-4e23-b0aa-b8152d021dcc)
12. After installing the extension, you can run Textractor by clicking one of the buttons:  
    ![image](https://github.com/MRGRD56/textractor-translator/assets/35491968/1a053ddd-51fe-4666-9ae2-2e19a7366980)
13. Now, text seen in Textractor should be displayed in Textractor Translator too:  
    ![image](https://github.com/MRGRD56/textractor-translator/assets/35491968/c38cf2e4-8228-4a47-89aa-cd87f4706037)

<hr>

### The following part of this README is supposed to be rewritten. Some info below might be obsolete.

<details>
<summary>History of this app</summary>

### Version 0.6.0

#### Aokana `en -> ru`

![image](https://github.com/MRGRD56/textractor-translator/assets/35491968/d29c4f89-512b-4152-b8a5-af90e853a52a)

### Version 0.5.0

#### eden* PLUS+MOSAIC `en -> ru`

![image](https://github.com/MRGRD56/textractor-translator/assets/35491968/576e8d87-7bd1-439c-87c2-8ad5063861a5)

### Version 0.2.1

#### Summer Pockets `en -> ru`

![image](https://user-images.githubusercontent.com/35491968/216782294-7ac22557-c6a8-40c1-968f-9ad88c8ec810.png)

### Version 0.2.0

#### Summer Pockets `en -> ru`

![image](https://user-images.githubusercontent.com/35491968/210804578-bbef4152-c46c-4722-bd9e-3a6cdaadee4d.png)

### Version 2023-01-03

#### Aokana `en -> ru`

![image](https://user-images.githubusercontent.com/35491968/210275440-7ccfa536-922f-4f72-bec8-d20c7f160f20.png)

### Version 2022-12-17

#### Memoria `en -> ru`

![Без названия (4)](https://user-images.githubusercontent.com/35491968/208255633-71fe3183-2762-480d-a50c-7f88f5b69fb0.jpg)

#### Aokana `en -> ru`

![image](https://user-images.githubusercontent.com/35491968/209694538-5e491b2f-25db-4418-b2e9-8ac6db492dab.png)

### Version 2022-12-05

#### White Album 2 `en -> ru`

![image](https://user-images.githubusercontent.com/35491968/205514998-f00fcb94-93c9-4bfd-8b73-bbbce2f1ee15.png)  

</details>

It also requires `TextractorPipe.xdll` extension for Textractor: https://github.com/MRGRD56/textractor-integration-extensions The app will not work without this extension installed. It can be automatically installed right in the app settings. You might need to restart Textractor for the extension to start working.

You need some JavaScript knowledge to configure and use this application.

The purpose of this software is to be able to fine-tune Textractor in terms of parsing, modifying and translating texts for each separate game.

Requires `TextractorPipe.xdll` extension for Textractor: https://github.com/MRGRD56/textractor-integration-extensions
The app will not work without this extension installed.

The extension can be installed right in the app:  
![image](https://user-images.githubusercontent.com/35491968/209697469-ba47b501-9c52-4a22-9c48-a43d8fb4089d.png)

#### Some configs that can be used

##### Common

```js
config.languages = {
    source: 'en',
    target: 'ru'
};

const googleTranslate = Translators.GoogleTranslate();
// const libreTranslate = Translators.LibreTranslate({
//     host: 'https://libretranslate.example.com'
// });

// implements caching translations of not really long sentences
// also optimizes translation if there are no English letters in text when translating from English - this kind of text returns as is
Translators.Custom = {};
/**
 * @returns {Translator}
 */
Translators.Custom.MainTranslator = () => ({
    translate: async (text, sourceLanguage, targetLanguage) => {
        const doTranslate = () => googleTranslate.translate(text, sourceLanguage, targetLanguage);

        if (sourceLanguage === 'en' && !/[a-z]+/i.test(text)) {
            return text;
        }

        if (text.length <= 200) {
            const translatedCache = memory.translatedCache ??= {};
            const cachedTranslation = translatedCache[text];
            if (cachedTranslation === undefined) {
                const translation = await doTranslate();
                translatedCache[text] = translation;
                return translation;
            } else {
                return cachedTranslation;
            }
        }

        return doTranslate();
    }
});

config.translator = Translators.Custom.MainTranslator();

config.transformOriginal = ({text, meta}) => {
    if (text.startsWith('Textractor:') || text.startsWith('vnreng:')) {
        return undefined;
    }

    return text;
};

config.transformTranslated = (text) => {
    return {
        plain: text,
        displayed: common.htmlifyText(text),
        isHtml: true
    };
};

const nameColor = '#ef9a9a';

/** @param {string} text */
common.htmlifyText = (text) => {
    return text
        .replace(/^([^:]+?): ["«](.+)["»][.!?]?$/, '<span style="color: ' + nameColor + ';">$1:</span> «$2»')
};

/** @param {string} text */
common.htmlifyTextJa = (text) => {
    return text
        .replace(/^([^:]+?): 「(.+)」[.!?]?$/, '<span style="color: ' + nameColor + ';">$1:</span> 「$2」')
};

common.style = (text, css) => {
    return `<span style="${css}">${text}</span>`;
};
```

##### Using LLM with OpenAI-compatible `/v1/chat/completions`

```js
const openAITranslatorWA2 = Translators.OpenAIChatCompletions({
    baseURL: 'http://localhost:15846/v1',
    apiKey: '...',
    requestBodyParams: { // everything in the request body except `messages`, which is set by `createMessages`
        "model": "koboldcpp/gemma-3-12b-it-q4_0",
        "temperature": 0.0,
        "min_p": 0.0,
        "top_p": 0.8,
        "top_k": 20,
        "stream": true, // streaming is enabled by default but can also be disabled
        "adapter": { // additional property for koboldcpp
            "system_start": "<start_of_turn>user\n",
            "system_end": "<end_of_turn>\n",
            "user_start": "<start_of_turn>user\n",
            "user_end": "<end_of_turn>\n",
            "assistant_start": "<start_of_turn>model\n",
            "assistant_end": "<end_of_turn>\n"
        }
    },
    keptPreviousMessagesLimit: 75, // 10 by default. can be set to 0 if needed
    // `createMessages` is optional, but you can override the default logic like this
    createMessages: (text, sourceLanguage, targetLanguage, previousMessages, getLanguageName) => {
        const sourceLanguageName = getLanguageName(sourceLanguage);
        const targetLanguageName = getLanguageName(targetLanguage)

        return [
            {
                role: 'system',
                content: `You are a real-time translation engine. You receive input wrapped in a <text_to_translate> tag and must output only the translated text — without any extra comments or tags.

Your job is to preserve the meaning, tone, and context of the original content as accurately as possible. Do not explain anything. Do not repeat the input or the translation. Never include the <text_to_translate> tags or mention them in any way.

Translation field: You're translating a visual novel - White Album 2, which is a Japanese one, but the user has its English version.

Translate text inside the text_to_translate tag ${sourceLanguageName ? `from ${sourceLanguageName} ` : ''}into ${targetLanguageName}, and output only the translated result.`
            },
            ...previousMessages,
            {
                role: 'user',
                content: `Translate <text_to_translate>${text}</text_to_translate> Translation:`,
            }
        ];
    }
});
```

##### Using LLM with OpenAI-compatible `/v1/chat/completions` + thinking

```js
const openAITranslatorThinking = Translators.OpenAIChatCompletions({
    baseURL: 'https://your-openai-api/v1',
    apiKey: '...',
    requestBodyParams: {
        "model": "koboldcpp/Qwen3-30B-A3B-Q5_K_M",
        "temperature": 0.6,
        "min_p": 0.0,
        "top_p": 0.95,
        "top_k": 20,
        "max_tokens": 2 * 1024,
        "adapter": {
            "system_start": "<|im_start|>system\n",
            "system_end": "<|im_end|>\n",
            "user_start": "<|im_start|>user\n",
            "user_end": "<|im_end|>\n",
            "assistant_start": "<|im_start|>assistant\n",
            "assistant_end": "<|im_end|>\n"
        }
    },
    keptPreviousMessagesLimit: 50,
    createMessages: (text, sourceLanguage, targetLanguage, previousMessages, getLanguageName) => {
        const sourceLanguageName = getLanguageName(sourceLanguage);
        const targetLanguageName = getLanguageName(targetLanguage)

        return [
            {
                role: 'system',
                content: `You are a real-time translation engine. You receive input wrapped in a <text_to_translate> tag and must output only the translated text — without any extra comments or tags.

Your job is to preserve the meaning, tone, and context of the original content as accurately as possible. Do not explain anything. Do not repeat the input or the translation. Never include the <text_to_translate> tags or mention them in any way.

Translate text inside the text_to_translate tag ${sourceLanguageName ? `from ${sourceLanguageName} ` : ''}into ${targetLanguageName}, and output only the translated result. /think` // `/think` can be used for Qwen 3
            },
            ...previousMessages,
            {
                role: 'user',
                content: `Translate <text_to_translate>${text}</text_to_translate> Translation:`,
            }
        ];
    },
    // using this so thinking is not included in the chat history
    transformAssistantResponseForChatHistory: (response) => {
        return response.replace(/\<think\>\n.*\n\<\/think\>\n\n/s, '');
    }
});

config.translator = openAITranslatorThinking;

config.transformTranslated = (text) => {
    // with streaming, transformTranslated is called every time we get a new chunk. `text` contains the whole response we have so far, not just the new chunk

    // #region working with the thinking block
    text = text
        .replace(/\<think\>\n.*\n\<\/think\>\n\n/s, '') // if the model has finished thinking - just removing the thinking part
        .replace(/\<think\>\n.*/s, 'Thinking...'); // if it is in the process of thinking - replacing the incomplete thinking part with a 'Thinking...' placeholder
    // #endregion

    return {
        plain: text,
        displayed: common.htmlifyText(text),
        isHtml: true
    };
};
```

##### LLM Translation Optimizations

```js
/**
 * @param baseTranslator {StreamingTranslator}
 * @returns {StreamingTranslator}
 */
Translators.Custom.MainLLMTranslator = (baseTranslator) => {
    return {
        translate: async (text, sourceLanguage, targetLanguage) => {
            throw new Error('Not supported.');
        },
        translateStreaming: async function* (text, sourceLanguage, targetLanguage) {
            if (sourceLanguage === 'en' && !/[a-z]+/i.test(text)) {
                console.log('Used original text:', text);
                yield text;
                return text;
            }

            let isToBeCached = false;

            const translatedCache = memory.translatedCache ??= {};

            if (text.length <= 200) {
                const cachedTranslation = translatedCache[text];
                if (cachedTranslation === undefined) {
                    isToBeCached = true;
                } else {
                    console.log('Used cached translation:', cachedTranslation);
                    yield cachedTranslation;
                    return cachedTranslation;
                }
            }

            try {
                let translation = '';

                const translationGenerator = baseTranslator.translateStreaming(text, sourceLanguage, targetLanguage);
                for await (const chunk of translationGenerator) {
                    translation += chunk;
                    yield chunk;
                }

                console.log(`${baseTranslator.__name__} translation result:`, translation);

                if (isToBeCached) {
                    translatedCache[text] = translation;
                }

                return translation;
            } catch (err) {
                console.error(`${baseTranslator.__name__} translation error:`, err);
                throw err;
            }
        }
    };
};
```

##### Siglus Engine

```js
config.transformOriginal = ({text, meta}) => {
    text = commonConfig.transformOriginal({text, meta});
    if (!text) {
        return text;
    }

    const result = text
        .replaceAll(/([a-z]\d){2,}/g, '')
        .replaceAll(/_stage_action/g, '');
        
    if (!result?.trim()) {
        return;
    }

    return result;
};

config.transformTranslated = (text) => text
    .replaceAll('…', '...');
```

##### Aokana EN

```js
const {style, htmlifyText} = common;

config.transformOriginal = ({text, meta}) => {
    text = commonConfig.transformOriginal({text, meta});
    if (!text) {
        return;
    }

    const englishText = /([【　].+?)␂/.exec(text)?.[1]?.trim();

    if (!englishText) {
        return;
    }

    const plainText = englishText
        .replace(/^【(.+?)】：(.+)$/, '$1: "$2"');

    if (!plainText) {
        return;
    }

    return {
        plain: plainText,
        displayed: htmlifyText(plainText),
        isHtml: true
    };
};
```

##### Aokana JA

```js
const {style, htmlifyText, htmlifyTextJa} = common;

config.languages.source = 'ja';
config.languages.target = 'en';

config.transformOriginal = ({text, meta}) => {
    text = commonConfig.transformOriginal({text, meta});
    if (!text) {
        return;
    }

    const japaneseText = /␂([【　]?.+?)␂/.exec(text)?.[1]?.trim();

    if (!japaneseText) {
        return;
    }

    const plainText = japaneseText
        .replace(/^【(.+?)】：(.+)$/, '$1: $2');

    if (!plainText) {
        return;
    }

    return {
        plain: plainText,
        displayed: htmlifyTextJa(plainText),
        isHtml: true
    };
};
```

##### White Album 2

```js
// /** @param {string} text */
// const htmlifyText = (text) => {
//     return text
//         .replace(/^([^:]+?): ["«](.+)["»][.!?]?$/, '<span style="color: #ffcdd2;">$1:</span> «$2»')
// };

config.transformOriginal = ({text, meta}) => {
    text = commonConfig.transformOriginal({text, meta});
    if (!text) {
        return;
    }

    if (/^mv\d+$/.test(text) || text === 'sepia.AMP') {
        return;
    }

    const normalText = text
        .replaceAll('~', ',')
        .replaceAll('\\n', ' ')
        .replaceAll('�c', '...')
        .replaceAll('�`', '~')
        .replaceAll('�[', ' - ')
        .replaceAll('\\k', '❄️');
    
    const plainText = normalText
        .replace(/^([^:"]+?)"(.+)"$/, '$1: "$2"');

    // const displayedText = normalText
    //     .replace(/^(.+?)"(.*)"$/, '<b style="color: #ffcdd2;">$1:</b> "$2"');
    
    return {
        plain: plainText,
        displayed: common.htmlifyText(plainText),
        isHtml: true
    };
};
```

##### White Album 2 - v2: LLM translation, better styles

```js
/** @param {string} text */
const htmlifyText = (text) => {
    return text
        .replace(/^([^:]+?): ["«](.+)["»][.!?]?$/, '«$2»')
        .replace(/^([^:]+?): ["«]([^"»]*)$/, '«$2')
};

const DEFAULT_CHARACTER_NAMES = [
    'Haruki',
    'Setsuna',
    'Kazusa',
    'Takeya',
    'Io',
    'Chikashi',
    'Takahiro',
    'Youko',
    'Homeroom Teacher',
    'Guidance Counselor'
];

memory.wa2CharacterNames ??= new Set(DEFAULT_CHARACTER_NAMES);
for (const characterName of DEFAULT_CHARACTER_NAMES) {
    memory.wa2CharacterNames.add(characterName);
}

config.transformOriginal = ({text, meta}) => {
    text = commonConfig.transformOriginal({text, meta});
    if (!text) {
        return;
    }

    if (/^mv\d+$/.test(text) || text === 'sepia.AMP' || text === 'CATCH') {
        return;
    }

    const normalText = text
        .replaceAll('~', ',')
        .replaceAll('\\n', ' ')
        .replaceAll('�c', '...')
        .replaceAll('�`', '~')
        .replaceAll('�[', ' - ')
        .replaceAll('\\k', '❄️');

    const isOnlyCharacterName = memory.wa2CharacterNames.has(normalText);

    if (isOnlyCharacterName) {
        memory.wa2LastCharacterName = normalText;

        return undefined;
    }

    const characterName = /^([^:"]+?\S)"(.+)$/.exec(normalText)?.[1];

    if (characterName) {
        memory.wa2LastCharacterName = characterName;
        memory.wa2CharacterNames.add(characterName);
    }
    
    let plainText = normalText
        .replace(/^([^:"]+?\S)(".+"?)$/, '$1: $2');

    if (plainText === normalText && /^".+"?$/.test(plainText) && memory.wa2LastCharacterName) {
        plainText = `${memory.wa2LastCharacterName}: ${plainText}`;
    }
    
    return {
        plain: plainText,
        displayed: htmlifyText(plainText),
        isHtml: true
    };
};

const openAITranslatorMistralWA2AtPC = Translators.OpenAIChatCompletions({
    baseURL: 'http://localhost:15846/v1',
    apiKey: '...',
    requestBodyParams: {
        "model": "koboldcpp/Mistral-Small-3.1-24B-Instruct-2503-UD-Q4_K_XL",
        "temperature": 0.0,
        "min_p": 0.0,
        "top_p": 0.95,
        "top_k": 64,
        "stream": true,
        "adapter": {
            "system_start": "[SYSTEM_PROMPT]",
            "system_end": "[/SYSTEM_PROMPT]",
            "user_start": "[INST]",
            "user_end": "[/INST]",
            "assistant_start": "",
            "assistant_end": "</s>"
        }
    },
    keptPreviousMessagesLimit: 75,
    createMessages: (text, sourceLanguage, targetLanguage, previousMessages, getLanguageName) => {
        const sourceLanguageName = getLanguageName(sourceLanguage);
        const targetLanguageName = getLanguageName(targetLanguage);

        return [
            {
                role: 'system',
                content: `You are a real-time translation engine. You receive input wrapped in a <text_to_translate> tag and must output only the translated text — without any extra comments or tags. Preserve punctuation, including quotes, though.

Your job is to preserve the meaning, tone, and context of the original content as accurately as possible. Do not explain anything. Do not repeat the input or the translation. Never include the <text_to_translate> tags or mention them in any way.

Translation field: You're translating a visual novel - White Album 2, which is a Japanese one, but the user has its English version.

Characters:

Haruki Kitahara (Харуки Китахара) - male - the protagonist;
Setsuna Ogiso (Сэцуна Огисо) - female - the first main heroine;
Kazusa Touma (Кадзуса Тома) - female - the second main heroine;
Takeya Iizuka (Такэя Идзука) - male - Haruki's close friend;
Io Mizusawa (Ио Мидзусава) - female;
Chikashi Hayasaka (Тикаси Хаясака) - male;
Takahiro Ogiso (Такахиро Огисо) - male;
Youko Touma (Ёко Тома) - female.

Translate the text that is inside the text_to_translate tag ${sourceLanguageName ? `from ${sourceLanguageName} ` : ''}into ${targetLanguageName}, and output only the translated result.`
            },
            ...previousMessages,
            {
                role: 'user',
                content: `Translate <text_to_translate>${text}</text_to_translate> Translation:`,
            }
        ];
    }
});
openAITranslatorMistralWA2AtPC.__name__ = 'OpenAIChatCompletions-mistral@pc/WA2';

config.translator = Translators.Custom.MainLLMTranslator(openAITranslatorMistralWA2AtPC);


config.transformTranslated = (text, original, meta) => {
    text = text.replace(/^— (.+)$/, '«$1»');

    if (config.translator.__thinking__) {
        text = text
            .replace(/\<think\>\n.*\n\<\/think\>\n\n/s, '')
            .replace(/\<think\>\n.*/s, 'Thinking...');
    }

    // console.log(`Streaming [${original.meta.sentenceId}]`, text, original, meta);

    if (meta.isStreamingMode && meta.state === 'STREAMING') {
        if (text.length <= 15) {
            console.log('Not displaying piece of sentence', text);
            return;
        }
    }

    let name = undefined;
    let phrase = undefined;

    const regexResult = /^([^:"]+?):\s?(["'«“].+(["'»”][.!?])?)?$/.exec(text);
    if (regexResult) {
        [, name, phrase] = regexResult;
    } else {
        phrase = text;
    }

    phrase = (phrase ?? '')
        .replace(/^— (.+)$/, '«$1»')
        .replace(/^["'«“](.+)["'»”]([.!?]*)$/, '«$1$2»')
        .replace(/^["'«“]([^"'»”]+)$/, '«$1');

    return {
        plain: phrase,
        displayed: `${name ? (`<span class="character-name">${name}</span> `) : (`<span class="character-name character-name-narrator">Narrator</span> `)}<span class="phrase">${phrase}</span>`,
        isHtml: true
    };
};
```

```css
.sentence-original {
    /* letter-spacing: -0.2rem; */
}

.text-container:not(.history-visible) .sentence-translated {
    /* letter-spacing: -0.1rem; */
    min-height: 115px;
}

.text-container-wrapper:has(.history-visible) {
    background-color: #1f4970b0 !important;
}

.character-name {
    font-weight: 600;
    letter-spacing: 1px;
    color: #ffffff;
    background: linear-gradient(90deg, rgba(82,202,251,0.75) 0%, rgba(62,177,238,0.75) 100%);
    padding: 6px 18px 3px 18px;
    border-radius: 5px;
    display: inline-block;
    margin-top: -5px;
    margin-bottom: 9px;
}

.character-name-narrator {
    visibility: hidden;
}

.text-container.history-visible .character-name-narrator {
    display: none;
}

.phrase {
    font-weight: 500;
    background: #386896bf;
    padding: 6px 10px;
    border-radius: 5px;
    display: block;
    line-height: 2rem;
}

.text-container.history-visible .phrase {
    border-radius: 5px 5px 0 0;
}

.text-container.history-visible .character-name:not(.character-name-narrator) + .phrase {
    border-radius: 0px 5px 0 0;
}

.text-container.history-visible .sentence-original .sentence-text {
    border-radius: 0 0 5px 5px;
}

.text-container.history-visible .character-name {
    margin-bottom: 0;
    border-radius: 5px 5px 0 0;
}

.text-container.history-visible .sentence {
    gap: 0;
}

.text-container.history-visible .sentence-container,
.text-container.history-visible .sentence-original,
.text-container.history-visible .sentence-translated {
    width: 100%;
}

.sentence-original .sentence-text {
    font-weight: 500;
    background: rgba(142, 196, 218, 0.1);
    padding: 6px 10px !important;
    border-radius: 5px;
    display: block !important;
    line-height: 1.45rem;
}
```

##### eden* PLUS+MOSAIC (English edition)

```js
config.transformOriginal = ({text, meta}) => {
    text = commonConfig.transformOriginal({text, meta});

    if (!text) {
        return;
    }
    
    text = text
        .replaceAll(/\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}/g, '')
        .replaceAll(/\S+\.(png|ogg|ani)/g, '')
        .replaceAll(/\\n/g, ' ')
        .replaceAll(/\\\w/g, '')
        .replaceAll('�', '\'')
        .replaceAll('#4', '~')
        .replaceAll('#5', '♪')
        .replace(/^'(.+)'$/, '"$1"')
        .trim();
    
    if (!text) {
        return;
    }

    return text;
};

config.transformTranslated = (text) => {
    text = text
        .replace(/^— (.+)$/, '«$1»')
        .replace(/^["'](.+)["']$/, '«$1»');

    return text;
};
```

##### Implementing a custom translator

The following variables can help you create your custom translators:

| Variable/Module                  | Description                                                                                      | Library/Source       |
|----------------------------------|--------------------------------------------------------------------------------------------------|----------------------|
| `net`                            | Node.js built-in module used for low-level networking operations                                 | Node.js              |
| `httpRequest`                    | Function used to make HTTP requests                                                              | [`node-fetch`](https://www.npmjs.com/package/node-fetch) |
| `queryString`                    | Utility for parsing and stringifying URL query strings                                           | [`query-string`](https://www.npmjs.com/package/query-string) |
| `URL`, `URLSearchParams`         | Classes for working with URLs and query parameters                                               | Node.js              |
| `OpenAI`                         | Interface for communicating with OpenAI’s API                                                    | [`openai`](https://www.npmjs.com/package/openai) |
| `langs`                          | Library providing language information like codes and names                                      | [`langs`](https://www.npmjs.com/package/langs) |
| `languagesCodeToNameMap`        | Object mapping ISO language codes to language names (e.g., `{ "en": "English", "ja": "Japanese" }`) | Custom/Utility       |


###### LibreTranslate

```js
/**
 * @param config {{host?: string, format?: string, apiKey?: string}}
 * @returns {Translator}
 */
Translators.LibreTranslateCustom = (config = {}) => ({
    translate: async (text, sourceLanguage, targetLanguage) => {
        const host = config.host || 'https://libretranslate.com';
        const url = new URL('/translate', host).toString();

        const responseData = await httpRequest(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: text,
                source: sourceLanguage,
                target: targetLanguage,
                format: config.format,
                api_key: config.apiKey
            })
        }).then((response) => response.json());

        if (!responseData || responseData.translatedText == null) {
            console.error('LibreTranslator unable to translate: ', responseData);
            throw responseData;
        }

        console.log('custom translator response:', responseData);
        return responseData.translatedText;
    }
});
```

###### OpenAI-compatible chat/completions (no streaming) + context `[OBSOLETE]`

```js
const LANGUAGES_MAP = {
    auto: undefined,
    ru: 'Russian',
    en: 'English',
    ja: 'Japanese'
};

/**
 * @param config {{baseUri?: string, token?: string, requestBodyParams?: object, createMessages?: function, previousSentencesKept?: number}}
 * @returns {Translator}
 */
Translators.Custom.OpenAIChatCompletions = (config = {}) => {
    const baseUri = config.baseUri;
    const token = config.token;
    const requestBodyParams = config.requestBodyParams;
    const createMessages = config.createMessages ?? ((text, sourceLanguage, targetLanguage, previousMessages) => ([
        {
            "role": "system",
            "content": "You are a real time translation service. You are translating a visual novel. You get any text from this visual novel in one language and translate it to another, in plain text, without giving any comments. You only output the translation. Make sure to maintain the quality and the context of the story. In your response, output the translation of the text inside the text_to_translate tag right away without any comments, or any extra tags (do not output the \"text_to_translate\" tag itself)."
        },
        ...previousMessages,
        {
            "role": "user",
            "content": "Translate this " + (sourceLanguage ? `from ${sourceLanguage} ` : "") + "into " + targetLanguage + ": <text_to_translate>" + text + "</text_to_translate> Translation:"
        }
    ]));

    if (!baseUri) {
        throw new Error('OpenAIChatCompletions translator requires a baseUri URL in config.');
    }

    const url = new URL(baseUri + '/chat/completions');

    const previousSentencesKept = config.previousSentencesKept ?? 10;
    const messagesHistoryLimit = previousSentencesKept * 2;

    const messagesHistory = [];

    const putSentenceToHistory = (userMessage, translation) => {
        if (previousSentencesKept === 0) {
            return;
        }

        messagesHistory.push(
            userMessage,
            {
                "role": "assistant",
                "content": translation
            }
        );

        if (messagesHistory.length > messagesHistoryLimit) {
            messagesHistory.splice(0, messagesHistory.length - messagesHistoryLimit);
        }
    };

    return {
        translate: async (text, sourceLanguage, targetLanguage) => {
            sourceLanguage = sourceLanguage && LANGUAGES_MAP[sourceLanguage];
            targetLanguage = targetLanguage && LANGUAGES_MAP[targetLanguage];

            if (!targetLanguage) {
                throw new Error('OpenAIChatCompletions translator requires targetLanguage.');
            }

            const messages = createMessages(text, sourceLanguage, targetLanguage, messagesHistory);

            const requestBody = {
                messages,
                stream: false,
                ...requestBodyParams,
            };

            console.log(`Translating using OpenAIChatCompletions: POST ${url.toString()}`, requestBody);

            const responseData = await httpRequest(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            }).then(res => res.json());

            const result = responseData?.choices[0].message.content;

            if (!result) {
                console.error('OpenAIChatCompletions translator failed: ', responseData);
                throw new Error('Translation failed');
            }

            putSentenceToHistory(messages[messages.length - 1], result);

            return result;
        }
    };
};

const openAITranslator = Translators.Custom.OpenAIChatCompletions({
    baseUri: 'https://your-openai-base-uri/v1',
    token: '...',
    requestBodyParams: {
        "model": "koboldcpp/Qwen3-30B-A3B-Q5_K_M",
        "temperature": 0.0,
        // "min_p": 0.0,
        // "top_p": 0.8,
        // "top_k": 20,
        "stream": false,
        "adapter": { // for koboldcpp, Qwen 3 non-thinking mode
            "system_start": "<|im_start|>system\n",
            "system_end": "<|im_end|>\n",
            "user_start": "<|im_start|>user\n",
            "user_end": "<|im_end|>\n",
            "assistant_start": "<|im_start|>assistant\n<think>\n\n</think>\n\n",
            "assistant_end": "<|im_end|>\n"
        }
    }
});
```

###### Creating a custom streaming translator using the `OpenAI` library (FYI there is already built-in `Translators.OpenAIChatCompletions` for `/v1/chat/completions`)

```js
class OpenAIChatCompletions {
    constructor(config) {
        this.config = config;
        this.openai = new OpenAI({
            baseURL: config.baseURL,
            apiKey: config.apiKey ?? process.env['OPENAI_API_KEY'],
            fetch: httpRequest,
            dangerouslyAllowBrowser: true
        });

        config.keptPreviousMessagesLimit ??= 10;
        this.messagesHistory = [];
        this.messagesHistoryLimit = config.keptPreviousMessagesLimit * 2;
    }

    putSentenceToHistory(userMessage, translation) {
        if (!this.config.keptPreviousMessagesLimit) return;

        this.messagesHistory.push(userMessage);
        this.messagesHistory.push({ role: 'assistant', content: translation });

        if (this.messagesHistory.length > this.messagesHistoryLimit) {
            this.messagesHistory.splice(0, this.messagesHistory.length - this.messagesHistoryLimit);
        }
    }

    createMessages(text, sourceLanguage, targetLanguage) {
        const fallbackCreate = (text, sourceLanguage, targetLanguage, previousMessages, getLanguageName) => {
            const sourceLanguageName = getLanguageName(sourceLanguage);
            const targetLanguageName = getLanguageName(targetLanguage);

            return [
                {
                    role: 'system',
                    content: `You are a real-time translation engine. You receive input wrapped in a <text_to_translate> tag and must output only the translated text — without any extra comments or tags.

Your job is to preserve the meaning, tone, and context of the original content as accurately as possible. Do not explain anything. Do not repeat the input or the translation. Never include the <text_to_translate> tags or mention them in any way.

Translate text inside the text_to_translate tag ${sourceLanguageName ? `from ${sourceLanguageName} ` : ''}into ${targetLanguageName}, and output only the translated result.`
                },
                ...previousMessages,
                {
                    role: 'user',
                    content: `Translate <text_to_translate>${text}</text_to_translate> Translation:`,
                }
            ];
        };

        const create = this.config.createMessages ?? fallbackCreate;
        return create(text, sourceLanguage, targetLanguage, this.messagesHistory, getLanguageName);
    }

    async translate(text, sourceLanguage, targetLanguage) {
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

    async *translateStreaming(text, sourceLanguage, targetLanguage) {
        if (this.config.requestBodyParams?.stream === false) {
            const translation = await this.translate(text, sourceLanguage, targetLanguage);
            yield translation;
            return translation;
        }

        const messages = this.createMessages(text, sourceLanguage, targetLanguage);
        let full = '';

        const stream = await this.openai.chat.completions.create({
            messages,
            ...this.config.requestBodyParams,
            stream: true,
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

const getLanguageName = (languageCode) => {
    if (!languageCode || languageCode === 'auto') {
        return undefined;
    }

    return languagesCodeToNameMap[languageCode];
};

config.translator = new OpenAIChatCompletions({
    baseURL: 'https://your-openai-base-uri/v1',
    apiKey: '...',
    requestBodyParams: {
        "model": "koboldcpp/Qwen3-30B-A3B-Q5_K_M",
        "temperature": 0.0,
        "min_p": 0.0,
        "top_p": 0.8,
        "top_k": 20,
        "adapter": {
            "system_start": "<|im_start|>system\n",
            "system_end": "<|im_end|>\n",
            "user_start": "<|im_start|>user\n",
            "user_end": "<|im_end|>\n",
            "assistant_start": "<|im_start|>assistant\n<think>\n\n</think>\n\n",
            "assistant_end": "<|im_end|>\n"
        }
    },
    keptPreviousMessagesLimit: 50,
    createMessages: (text, sourceLanguage, targetLanguage, previousMessages, getLanguageName) => {
        const sourceLanguageName = getLanguageName(sourceLanguage);
        const targetLanguageName = getLanguageName(targetLanguage)

        return [
            {
                role: 'system',
                content: `You are a real-time translation engine. You receive input wrapped in a <text_to_translate> tag and must output only the translated text — without any extra comments or tags.

Your job is to preserve the meaning, tone, and context of the original content as accurately as possible. Do not explain anything. Do not repeat the input or the translation. Never include the <text_to_translate> tags or mention them in any way.

Translation domain: You're translating a visual novel - White Album 2, which is a Japanese one, but the user has its English version.

Translate text inside the text_to_translate tag ${sourceLanguageName ? `from ${sourceLanguageName} ` : ''}into ${targetLanguageName}, and output only the translated result. /no_think`
            },
            ...previousMessages,
            {
                role: 'user',
                content: `Translate <text_to_translate>${text}</text_to_translate> Translation:`,
            }
        ];
    }
});
```

###### A translator attempting to use a list of translators, with retries and caching (streaming support is not implemented here)

```js
/**
 * @param baseTranslators {Translator[]}
 * @returns {Translator}
 */
Translators.Custom.MainTranslator = (baseTranslators) => ({
    translate: async (text, sourceLanguage, targetLanguage) => {
        const tryTranslate = async () => {
            let lastError;
            for (const translator of baseTranslators) {
                const translatorName = translator.__name__ ?? 'Unknown Translator';
                try {
                    const translation = await translator.translate(text, sourceLanguage, targetLanguage);
                    console.log(`${translatorName} translation result:`, translation);
                    return translation;
                } catch (err) {
                    console.error(`${translatorName} translation error:`, err);
                    lastError = err;
                }
            }
            throw lastError;
        };

        if (sourceLanguage === 'en' && !/[a-z]+/i.test(text)) {
            console.log('Used original text:', text);
            return text;
        }

        if (text.length <= 200) {
            const translatedCache = memory.translatedCache ??= {};
            const cachedTranslation = translatedCache[text];
            if (cachedTranslation === undefined) {
                const translation = await tryTranslate();
                translatedCache[text] = translation;
                return translation;
            } else {
                console.log('Used cached translation:', cachedTranslation);
                return cachedTranslation;
            }
        }

        return tryTranslate();
    }
});

config.translator = Translators.Custom.MainTranslator([
    openAITranslatorAtPC, openAITranslatorAtSrv, googleTranslate, googleTranslate
]);
```

#### Ideas to be implemented in the future

- ⚠️ Add a "retry" button if an error occurred while translating, also add auto retries (since v0.3.0 auto retries can be implemented by creating an own translator by extending the existing, in theory)
- ⚠️ Fix dragging when history mode is enabled
- ~Maybe return `200 OK` immediately after a reqeust (`/sentence`) to the app~ Not relevant anymore since HTTP has been replaced with named pipes
- ~If Textractor Translator is not running, TTBridge shows errors when sending `/sentence` requests to the app, so Textractor crashes~ Probably not relevant anymore
- ~Sometimes Google Translator works incorrectly, returning incomplete sentences as a translation, fix it if possible~ (not possible)
- Limit history size
- ⏬ Maybe add "export history" feature
- ⏬ Maybe save history to the storage and also add "clear history" button
- ⏬ Add a switch to disable automatic translation of each phrase, phrases would be translated by clicking on the button
- ⏬ Add more appearance settings: text shadows (✅), outline (✅), text only background (✅), vertical and horizontal text alignment
- Add a dictionary of words, you can add words there while reading and learn them later
- Add DeepL translator, improve custom translator creating feature
- Maybe move languages and translator settings somewhere from profiles code
- Profiles: add translator and languages options to `config.transformOriginal`
- ~Profiles: add `translators` object with predefined translators (objects, not names) in it~ The `DefinedTranslators` object has been added
- ⏬ Add Google Translate extension if it's possible
- ~Add a `global` object so that it's possible to store some global (mutable) variables~ The `memory` variable has been added for this purpose
- ~⚠️ Fix this: https://user-images.githubusercontent.com/35491968/215345061-34eb33c0-68f2-4651-b826-422856eff69c.png~ Not relevant
- ~Добавить возможность настраивать конфиг TTBridge (и вернуть туда JSON конфиг), включая возможность настройки порта для коммуникации TTBridge и Textractor Translator~
- Добавить возможность настраивать TextractorPipe, включая возможность фильтрации отправляемых данных (например только `isCurrentSelect` или все без исключения)
- Добавить перевод с контекстом для более точного перевода

---

See also: https://github.com/MRGRD56/RealTimeTranslator

---

__`readme` coming soon...__

# Textractor Translator `under development`

<img src="https://user-images.githubusercontent.com/35491968/210263578-b57cb7fd-c081-4cb9-9ebd-2e09b22f1f09.png" width="600">

Lets you translate visual novels in real time, while reading.  
It requires [Textractor](https://github.com/Artikash/Textractor) to work. I don't have anything to do with the original software (Textractor) developers.  
It also requires `TextractorPipe.xdll` extension for Textractor: https://github.com/MRGRD56/textractor-integration-extensions The app will not work without this extension installed. It can be automatically installed right in the app settings. You might need to restart Textractor for the extension to start working.

It's in early stage of development and not every visual novel can be translated using it.  
You need some JavaScript knowledge to configure and use this application.

The purpose of this software is to be able to fine-tune Textractor in terms of parsing, modifying and translating texts for each separate game.

### Demo: translating a visual novel from Japanese to English

![textractor-translator-v0 2 0-demo_3](https://user-images.githubusercontent.com/35491968/210839740-3f1b3801-1b06-4814-9dba-0a737b7890cd.gif)

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

// implements caching translations of not really long sentences
// also optimizes translation if there are no English letters in text when translating from English - this kind of text returns as is
config.translator = {
    translate: async (text, sourceLanguage, targetLanguage) => {
        const googleTranslate = () => DefinedTranslators.GOOGLE_TRANSLATE.translate(text, sourceLanguage, targetLanguage);

        if (sourceLanguage === 'en' && !/[a-z]+/i.test(text)) {
            return text;
        }

        if (text.length <= 50) {
            const translatedCache = memory.translatedCache ??= {};
            const cachedTranslation = translatedCache[text];
            if (cachedTranslation === undefined) {
                const translation = await googleTranslate();
                translatedCache[text] = translation;
                return translation;
            } else {
                return cachedTranslation;
            }
        }

        return googleTranslate();
    }
};

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

##### eden* PLUS+MOSAIC (English edition)

```js
config.transformOriginal = ({text, meta}) => {
    text = commonConfig.transformOriginal({text, meta});

    if (!text) {
        return;
    }
    
    const plainText = text
        .replaceAll(/\S+\.(png|ogg|ani)/g, '')
        .replaceAll(/\\n/g, ' ')
        .replaceAll(/\\\w/g, '')
        .replaceAll('�', '\'')
        .replaceAll('#4', '~')
        .trim();
    
    if (!plainText) {
        return;
    }

    return {
        plain: plainText,
        displayed: plainText,
        isHtml: false
    };
};

config.transformTranslated = (text) => {
    return {
        plain: text,
        displayed: text,
        isHtml: false
    };
};
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
- ⏬ Add more appearance settings: text shadows, outline (✅), text only background, vertical and horizontal text alignment
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

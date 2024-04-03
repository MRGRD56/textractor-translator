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
- The appearance of the text window.

> [!NOTE]
> I don't have anything to do with the original software (Textractor) developers.

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

Currently, only Windows it supported.
You can use either `ia32` or `x86` versions depending on your OS.
Both versions can work with both `Textractor x86` and `Textractor x64`.

1. Download the binaries for your operating system in the [Releases](https://github.com/MRGRD56/textractor-translator/releases) section ([x86](https://github.com/MRGRD56/textractor-translator/releases/latest/download/TextractorTranslator-win32-ia32.zip) [x64](https://github.com/MRGRD56/textractor-translator/releases/latest/download/TextractorTranslator-win32-x64.zip)).  
2. Unzip the archive to the directory where the app will be stored.
3. Run the `TextractorTranslator.exe` file to run the application.
4. You will see the main window of the app:  
   ![image](https://github.com/MRGRD56/textractor-translator/assets/35491968/e9ec0a8c-d941-40a8-8eaf-88c86f4b983e)
5. Hover the top right corner of the window, then click the <img src="https://github.com/MRGRD56/textractor-translator/assets/35491968/c17cea08-7af2-4427-8af8-589ce7e05f22"></img> settings button.
6. You will see the settings window:  
   ![image](https://github.com/MRGRD56/textractor-translator/assets/35491968/ca35e748-4d0c-4212-835d-f3ec8cee367e)
7. Ensure you have [Textractor](https://github.com/Artikash/Textractor) installed. If you don't, install it before you continue. Remember the directory where you'll have installed it.  
8. Having Textractor installed, click a <img src="https://github.com/MRGRD56/textractor-translator/assets/35491968/cff85f4b-85e8-4fdc-89b4-da397347c4c3"></img> folder button to select the `Textractor.exe` binary of Textractor.
9. When you select either `Textractor x86` or `Textractor x64` location, the other one will be selected automatically. If not, please, select it manually if you need it.
10. It's recommended to check the `Autorun` checkbox for the Textractor you're planning to run with. It depends on the bitness of the game process. Usually it's `x86` for visual novels.
11. After you have configured the path(s) to Textractor, you'll have to install the [TextractorPipe](https://github.com/MRGRD56/textractor-integration-extensions) extension. It can be done automatically by clicking the install button(s):  
    ![image](https://github.com/MRGRD56/textractor-translator/assets/35491968/733824e3-1bd8-4e23-b0aa-b8152d021dcc)
12. After installing the extension, you can run Textractor by clicking one of the buttons:  
    ![image](https://github.com/MRGRD56/textractor-translator/assets/35491968/1a053ddd-51fe-4666-9ae2-2e19a7366980)
13. Now, text seen in Textractor should be displayed in Textractor Translator too:  
    ![image](https://github.com/MRGRD56/textractor-translator/assets/35491968/c38cf2e4-8228-4a47-89aa-cd87f4706037)

<hr>

### The following part of this README is being rewritten

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

`net` (the node.js module), `httpRequest` ("electron-request" library), `queryString` ("query-string" library), `URL`, `URLSearchParams` variables can help you create your custom translators.

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

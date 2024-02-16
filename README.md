# Textractor Translator `under development`

<img src="https://user-images.githubusercontent.com/35491968/210263578-b57cb7fd-c081-4cb9-9ebd-2e09b22f1f09.png" width="600">

Lets you translate visual novels in real time, while reading.  
It requires [Textractor](https://github.com/Artikash/Textractor) to work.

It's in early stage of development and not every visual novel can be translated using it.  
You need some JavaScript knowledge to configure and use this application.

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


Requires `TextractorTranslatorBridge.xdll` or `HttpSender.xdll` extension for Textractor: https://github.com/MRGRD56/MgTextractorExtensions

It can be installed right in the app:  
![image](https://user-images.githubusercontent.com/35491968/209697469-ba47b501-9c52-4a22-9c48-a43d8fb4089d.png)


#### Ideas to be implemented in the future

- ⚠️ Add a "retry" button if an error occurred while translating, also add auto retries
- ⚠️ Fix dragging when history mode is enabled
- Maybe return `200 OK` immediately after a reqeust (`/sentence`) to the app
- If Textractor Translator is not running, TTBridge shows errors when sending `/sentence` requests to the app, so Textractor crashes
- <u>Sometimes Google Translator works incorrectly, returning incomplete sentences as a translation, fix it if possible</u> (not possible)
- Limit history size
- ⏬ Maybe add "export history" feature
- ⏬ Maybe save history to the storage and also add "clear history" button
- ⏬ Add a switch to disable automatic translation of each phrase, phrases would be translated by clicking on the button
- ⏬ Add more appearance settings: text shadows, outline (✅), text only background, vertical and horizontal text alignment
- Add a dictionary of words, you can add words there while reading and learn them later
- Add DeepL translator, improve custom translator creating feature
- Maybe move languages and translator settings somewhere from profiles code
- Profiles: add translator and languages options to `config.transformOriginal`
- Profiles: add `translators` object with predefined translators (objects, not names) in it
- ⏬ Add Google Translate extension if it's possible
- Add a `global` object so that it's possible to store some global (mutable) variables
- ⚠️ Fix this:  
![image](https://user-images.githubusercontent.com/35491968/215345061-34eb33c0-68f2-4651-b826-422856eff69c.png)
- Добавить возможность настраивать конфиг TTBridge (и вернуть туда JSON конфиг), включая возможность настройки порта для коммуникации TTBridge и Textractor Translator 
- Добавить перевод с контекстом для более точного перевода

---

See also: https://github.com/MRGRD56/RealTimeTranslator

---

__`readme` coming soon...__

import langs from 'langs';

// Получаем массив всех языков
const allLanguages = langs.all();

// Преобразуем в объект: { en: 'English', ru: 'Russian', ... }
const languagesMap: Record<string, string> = {};

for (const lang of allLanguages) {
    if (lang['1']) {
        languagesMap[lang['1']] = lang.name;
    }
}

export default Object.freeze(languagesMap);

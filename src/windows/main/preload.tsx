import workTextractorPipe from './logic/workTextractorPipe';
import {ipcRenderer, IpcRendererEvent} from 'electron';
import ref from '../../utils/ref';
import watchCtrl from './utils/watchCtrl';
import readStoreStateLazy from '../../utils/readStoreStateLazy';
import electronStore from '../../electron-store/electronStore';
import {StoreKeys} from '../../constants/store-keys';
import MainWindowAppearanceConfig, {
    MainWindowDragMode,
    TextOrder,
    TextOutlineType
} from '../../configuration/appearance/MainWindowAppearanceConfig';
import addColorAlpha from '../../utils/addColorAlpha';
import initWindowDragger from './logic/initWindowDragger';
import TextAppearanceConfig, {
    TextAppearanceOverrideType,
    TextBackgroundType
} from '../../configuration/appearance/TextAppearanceConfig';
import {defaultSettingsTab, SettingsTab} from '../settings/types';
import AppearanceConfig, {
    defaultAppearanceConfig,
    getAppearanceConfigKey
} from '../../configuration/appearance/AppearanceConfig';
import SavedProfiles from '../settings/profiles/SavedProfiles';
import initializeAppearanceConfig from '../../configuration/appearance/initializeAppearanceConfig';
import initializeSavedProfiles from '../../configuration/initializeSavedProfiles';

export const isHistoryShownRef = ref<boolean>(false);

const setHistoryShown = (isShown: boolean) => {
    const textContainer = document.querySelector('.text-container')!;
    const historyButton = document.getElementById('history-button')!;

    isHistoryShownRef.current = isShown;
    if (isShown) {
        const textContainerWrapper = document.getElementById('text-wrapper')!;

        historyButton.classList.add('active');
        textContainer.classList.add('history-visible');
        textContainerWrapper.scrollTo(0, textContainerWrapper.scrollHeight);
    } else {
        historyButton.classList.remove('active');
        textContainer.classList.remove('history-visible');
    }
};

const toggleHistory = () => {
    setHistoryShown(!isHistoryShownRef.current);
};

const initAutoHistory = () => {
    const textContainerWrapper = document.getElementById('text-wrapper')!;
    const textContainer = document.querySelector('.text-container')!;

    const isCtrlPressedRef = watchCtrl();

    textContainerWrapper.addEventListener('wheel', event => {
        if (isHistoryShownRef.current) {
            return;
        }

        if (isCtrlPressedRef.current) {
            return;
        }

        if (textContainer.childElementCount <= 1) {
            return;
        }

        const isScrollable = textContainerWrapper.scrollHeight > textContainerWrapper.clientHeight;

        if (isScrollable) {
            return;
        }

        const wheelEvent = event as WheelEvent;
        if (wheelEvent.deltaY < 0) {
            setHistoryShown(true);
        }
    });

    textContainerWrapper.addEventListener('contextmenu', () => {
        if (!isHistoryShownRef.current) {
            return;
        }

        setHistoryShown(false);
    });
};

const initToolbar = () => {
    const mainToolbar = document.querySelector('.main-toolbar')!;
    const closeAppButton = document.getElementById('close-app-button')!;
    const minimizeAppButton = document.getElementById('minimize-window-button')!;
    const settingsButton = document.getElementById('settings-button')!;
    const historyButton = document.getElementById('history-button')!;
    const devtoolsButton = document.getElementById('devtools-button')!;

    closeAppButton.addEventListener('click', () => ipcRenderer.invoke('main-window.close'));

    minimizeAppButton.addEventListener('click', () => ipcRenderer.invoke('main-window.minimize'));

    settingsButton.addEventListener('click', () => ipcRenderer.invoke('open-settings-window'));

    historyButton.addEventListener('click', () => {
        toggleHistory();
    });

    devtoolsButton.addEventListener('click', () => ipcRenderer.invoke('main-window.devtools'));

    mainToolbar.classList.add('force-visible');
    setTimeout(() => {
        mainToolbar.classList.remove('force-visible');
    }, 2000);
};

const getTextOutlineCss = (config: {
    textOutlineType?: TextOutlineType,
    textOutlineThickness: number,
    textOutlineColor: string
}): string => {
    const {textOutlineType} = config;
    if (!textOutlineType) {
        return '';
    }

    const {textOutlineThickness, textOutlineColor} = config;

    if (textOutlineType === TextOutlineType.OUTER) {
        const textShadow =
            `-${textOutlineThickness}px -${textOutlineThickness}px 0 ${textOutlineColor},
             0                         -${textOutlineThickness}px 0 ${textOutlineColor},
             ${textOutlineThickness}px -${textOutlineThickness}px 0 ${textOutlineColor},
             ${textOutlineThickness}px  0                         0 ${textOutlineColor},
             ${textOutlineThickness}px  ${textOutlineThickness}px 0 ${textOutlineColor},
             0                          ${textOutlineThickness}px 0 ${textOutlineColor},
            -${textOutlineThickness}px  ${textOutlineThickness}px 0 ${textOutlineColor},
            -${textOutlineThickness}px  0                         0 ${textOutlineColor}`;

        return `text-shadow: ${textShadow}; -webkit-text-stroke: none;`;
    }

    if (textOutlineType === TextOutlineType.OUTER_SHADOW) {
        const baseBorder = `0 0 ${textOutlineThickness}px ${textOutlineColor}`;

        const textShadow = Array(Math.ceil(textOutlineThickness ** 3))
            .fill(undefined)
            .map(() => baseBorder)
            .join(',');

        return `text-shadow: ${textShadow}; -webkit-text-stroke: none;`;
    }

    if (textOutlineType === TextOutlineType.INNER) {
        return `text-shadow: none; -webkit-text-stroke: ${textOutlineThickness}px ${textOutlineColor};`;
    }

    return '';
};

const initAppearanceSettingsHandling = () => {
    const mainWindowStyleElement = document.getElementById('customizable-styles__main-window')!;
    const originalTextStyleElement = document.getElementById('customizable-styles__original-text')!;
    const translatedTextStyleElement = document.getElementById('customizable-styles__translated-text')!;

    const container = document.querySelector<HTMLElement>('.text-container-wrapper')!;
    const mainToolbar = document.querySelector<HTMLElement>('.main-toolbar')!;
    const moveButton = document.getElementById('move-mw-button')!;

    const renderMainWindowAppearance = (config: MainWindowAppearanceConfig) => {
        const hoverOnlyCss = config.isHoverOnlyBackgroundSettings ? `
            html:hover .text-container-wrapper {
                background-color: ${addColorAlpha(config.backgroundColor, config.hoverOnlyBackgroundOpacity / 100)};
                border-color: ${addColorAlpha(config.borderColor, config.hoverOnlyBorderOpacity / 100)};
            }
        ` : '';

        mainWindowStyleElement.innerHTML = `
            .sentence {
                flex-direction: ${config.textOrder === TextOrder.TRANSLATED_ORIGINAL ? 'column-reverse' : 'column'};
                gap: ${config.sentenceGap ?? 4}px;
            }
                    
            .text-container-wrapper {
                transition-property: background-color, border-color;
                transition-duration: 0.12s;
                transition-function: ease-in;
            
                background-color: ${addColorAlpha(config.backgroundColor, config.backgroundOpacity / 100)};
                border-radius: ${config.borderRadius}px;
                border-width: ${config.borderThickness}px;
                border-color: ${addColorAlpha(config.borderColor, config.borderOpacity / 100)};
                color: ${config.textColor};
                font-family: "${config.fontFamily || 'Roboto'}", sans-serif;
                font-size: ${config.fontSize ?? 20}px;
                line-height: ${config.lineHeight == null ? 'normal' : (config.lineHeight + '%')};
                padding: ${config.paddingTop ?? 8}px ${config.paddingRight ?? 10}px ${config.paddingBottom ?? 8}px ${config.paddingLeft ?? 10}px;
                ${getTextOutlineCss(config)}
            }
            
            ${hoverOnlyCss}
            
            .main-toolbar {
                border-radius: 0 ${config.borderRadius ?? 4}px 0 ${Math.min(config.borderRadius ?? 4, 8)}px;
            }
        `;

        const isWindowDraggableItself = config.windowDragMode !== MainWindowDragMode.PANEL;
        document.body.setAttribute('data-mw-drag', String(isWindowDraggableItself));

        const isFullyDraggable = config.windowDragMode === MainWindowDragMode.ENTIRE_WINDOW;
        if (isFullyDraggable) {
            moveButton.classList.add('d-none');
        } else {
            moveButton.classList.remove('d-none');
        }
    };

    const renderTextAppearance = (config: TextAppearanceConfig, styleElement: HTMLElement, styledSelector: string) => {
        const textBackgroundCss = config.textBackgroundType && `
                background-color: ${addColorAlpha(config.textBackgroundColor, config.textBackgroundOpacity / 100)};
                outline-color: ${addColorAlpha(config.textBorderColor, config.textBorderOpacity / 100)};
                outline-width: ${config.textBorderThickness ?? 0}px;
                outline-offset: -${Math.ceil((config.textBorderThickness ?? 0) / 2)}px;
                outline-style: solid;
                border-radius: ${config.textBorderRadius ?? 0}px;
            `;

        const outlineCss: string = (() => {
            if (config.textOutlineType === TextAppearanceOverrideType.INHERIT) {
                return '';
            }

            if (!config.textOutlineType) {
                return `
                    text-shadow: none;
                    -webkit-text-stroke: none;
                `;
            }

            return getTextOutlineCss({
                textOutlineType: config.textOutlineType,
                textOutlineColor: config.textOutlineColor,
                textOutlineThickness: config.textOutlineThickness
            });
        })();

        styleElement.innerHTML = `
                ${styledSelector}:not(.sentence-loading) {
                    ${config.isDisplayed === false ? 'display: none !important;' : ''}
                    color: ${config.textColor || 'inherit'};
                    opacity: ${config.textOpacity == null ? 'inherit' : (config.textOpacity / 100)};
                    font-size: ${config.fontSize == null ? 'inherit' : config.fontSize + '%'};
                    font-family: ${config.fontFamily ? `"${config.fontFamily}"` : 'inherit'};
                    font-weight: ${config.fontWeight ?? 'inherit'};
                    font-style: ${config.isItalic ? 'italic' : 'normal'};
                    text-decoration: ${config.isUnderlined ? 'underline' : 'none'};
                    line-height: ${config.lineHeight == null ? 'normal' : (config.lineHeight + '%')};
                    
                    transition: opacity 0.12s ease-in;
                    
                    ${config.textBackgroundType === TextBackgroundType.BLOCK ? textBackgroundCss : ''}
                    
                    ${outlineCss}
                }
                
                html:not(:hover) ${styledSelector} {
                    ${config.isDisplayedOnHoverOnly ? 'opacity: 0;' : ''}
                }
                
                ${styledSelector}.sentence-loading, ${styledSelector}:not(.sentence-loading) > .sentence-text {
                    padding-top: ${config.textPaddingTop ?? 0}px;
                    padding-right: ${config.textPaddingRight ?? 0}px;
                    padding-bottom: ${config.textPaddingBottom ?? 0}px;
                    padding-left: ${config.textPaddingLeft ?? 0}px;
                }
                
                ${styledSelector}:not(.sentence-loading) > .sentence-text {
                    -webkit-box-decoration-break: clone;
                    
                    ${config.textBackgroundType === TextBackgroundType.INLINE ? textBackgroundCss : ''}
                }
            `;
    };

    ipcRenderer.on('appearance-settings-changed', (event: IpcRendererEvent, appearanceKey: keyof AppearanceConfig, config: AppearanceConfig[keyof AppearanceConfig]) => {
        switch (appearanceKey) {
        case 'mainWindow':
            renderMainWindowAppearance(config as MainWindowAppearanceConfig);
            break;
        case 'originalText':
            renderTextAppearance(config as TextAppearanceConfig, originalTextStyleElement, '.sentence-original');
            break;
        case 'translatedText':
            renderTextAppearance(config as TextAppearanceConfig, translatedTextStyleElement, '.sentence-translated');
            break;
        }
    });

    ipcRenderer.on('active-profile-changed', async (event, activeProfileId: string | undefined) => {
        const appearanceConfigKey = getAppearanceConfigKey(activeProfileId);
        const appearanceConfig = await electronStore.get<AppearanceConfig>(appearanceConfigKey)
            ?? await initializeAppearanceConfig(electronStore, appearanceConfigKey);

        renderMainWindowAppearance(appearanceConfig.mainWindow);
        renderTextAppearance(appearanceConfig.originalText, originalTextStyleElement, '.sentence-original');
        renderTextAppearance(appearanceConfig.translatedText, translatedTextStyleElement, '.sentence-translated');
    });

    electronStore.get<SavedProfiles | undefined>(StoreKeys.SAVED_PROFILES).then(async (savedProfiles) => {
        const activeProfileId = savedProfiles?.activeProfileId;

        const appearanceConfigKey = getAppearanceConfigKey(activeProfileId);
        const appearanceConfig = await electronStore.get<AppearanceConfig>(appearanceConfigKey, defaultAppearanceConfig)
            ?? await initializeAppearanceConfig(electronStore, appearanceConfigKey);

        renderMainWindowAppearance(appearanceConfig.mainWindow);
        renderTextAppearance(appearanceConfig.originalText, originalTextStyleElement, '.sentence-original');
        renderTextAppearance(appearanceConfig.translatedText, translatedTextStyleElement, '.sentence-translated');
    });
};

const initSampleTextShowing = () => {
    const textContainer = document.getElementById('text')!;
    const sampleTextContainer = document.getElementById('text-sample')!;

    const isSettingsWindowOpenRef = ref<boolean>();
    const currentSettingsTabRef = ref<SettingsTab>();

    const checkSampleTextVisibility = async (): Promise<boolean> => {
        const isTextContainerEmpty = !textContainer.childElementCount;

        if (!isTextContainerEmpty) {
            return false;
        }

        const currentSettingsTab = currentSettingsTabRef.current;

        if (currentSettingsTab !== SettingsTab.APPEARANCE) {
            return false;
        }

        const isSettingsWindowOpen = isSettingsWindowOpenRef.current
            ?? await ipcRenderer.invoke('global-get', 'app_isSettingsWindowOpen')
            ?? false;

        if (!isSettingsWindowOpen) {
            return false;
        }

        return true;
    };

    const updateSampleTextVisibility = async () => {
        const isVisible = await checkSampleTextVisibility();
        if (isVisible) {
            sampleTextContainer.classList.remove('d-none');
        } else {
            sampleTextContainer.classList.add('d-none');
        }
    };

    ipcRenderer.on('settings-window.@opened', () => {
        isSettingsWindowOpenRef.current = true;
        updateSampleTextVisibility();
    });
    ipcRenderer.on('settings-window.@closed', () => {
        isSettingsWindowOpenRef.current = false;
        updateSampleTextVisibility();
    });
    readStoreStateLazy(electronStore, StoreKeys.SETTINGS_TAB, defaultSettingsTab, tab => {
        currentSettingsTabRef.current = tab;
        updateSampleTextVisibility();
    });
};

const listenProfilesUpdate = () => {
    electronStore.onDidChange(StoreKeys.SAVED_PROFILES, async (newValue, oldValue) => {
        if (!oldValue) {
            return;
        }

        const oldProfiles = oldValue as SavedProfiles;
        const newProfiles = newValue as SavedProfiles;

        if (oldProfiles.activeProfileId !== newProfiles.activeProfileId) {
            ipcRenderer.invoke('active-profile-changed', newProfiles.activeProfileId);
        }

        // risky optimization
        if (oldProfiles.profiles.length === newProfiles.profiles.length) {
            return;
        }

        const oldProfileIds = oldProfiles.profiles.map(profile => profile.id);
        const newProfileIds = newProfiles.profiles.map(profile => profile.id);

        const oldProfileIdsSet = new Set<string>(oldProfileIds);
        const newProfileIdsSet = new Set<string>(newProfileIds);

        const deleted = oldProfileIds.filter(id => !newProfileIdsSet.has(id));
        const created = newProfileIds.filter(id => !oldProfileIdsSet.has(id));

        for (const profileId of deleted) {
            console.log('deleting config for profile', profileId);
            electronStore.delete(getAppearanceConfigKey(profileId));
        }

        for (const profileId of created) {
            const appearanceConfigKey = getAppearanceConfigKey(profileId);
            electronStore.get(appearanceConfigKey).then(currentValue => {
                if (!currentValue) {
                    console.log('initializing config for profile', profileId);
                    initializeAppearanceConfig(electronStore, appearanceConfigKey);
                }
            });
        }
    });
};

const initProfiles = () => {
    electronStore.get(StoreKeys.SAVED_PROFILES).then(value => {
        if (!value) {
            initializeSavedProfiles(electronStore)
        }
    });
};

window.addEventListener('DOMContentLoaded', () => {
    initToolbar();
    initWindowDragger();
    // initWindowResize();
    initAutoHistory();
    initAppearanceSettingsHandling();
    initSampleTextShowing();
    listenProfilesUpdate();
    initProfiles();
    workTextractorPipe();
});

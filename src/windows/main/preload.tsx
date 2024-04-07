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
    }, 2500);
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

        return `
            --txx-text-shadow: ${textShadow};
            text-shadow: var(--txx-text-shadow);
            
            --txx--webkit-text-stroke: none;
            -webkit-text-stroke: var(--txx--webkit-text-stroke);
        `;
    }

    if (textOutlineType === TextOutlineType.OUTER_SHADOW) {
        const baseBorder = `0 0 ${textOutlineThickness}px ${textOutlineColor}`;

        const textShadow = Array(Math.ceil(textOutlineThickness ** 3))
            .fill(undefined)
            .map(() => baseBorder)
            .join(',');

        return `
            --txx-text-shadow: ${textShadow};
            text-shadow: var(--txx-text-shadow);
            
            --txx--webkit-text-stroke: none;
            -webkit-text-stroke: var(--txx--webkit-text-stroke);
        `;
    }

    if (textOutlineType === TextOutlineType.INNER) {
        return `
            --txx-text-shadow: none;
            text-shadow: var(--txx-text-shadow);
            
            --txx--webkit-text-stroke: ${textOutlineThickness}px ${textOutlineColor};
            -webkit-text-stroke: var(--txx--webkit-text-stroke);
        `;
    }

    return '';
};

const initAppearanceSettingsHandling = () => {
    const mainWindowStyleElement = document.getElementById('customizable-styles__main-window')!;
    const originalTextStyleElement = document.getElementById('customizable-styles__original-text')!;
    const translatedTextStyleElement = document.getElementById('customizable-styles__translated-text')!;
    const customCssElement = document.getElementById('customizable-styles__custom-css')!;

    const container = document.querySelector<HTMLElement>('.text-container-wrapper')!;
    const mainToolbar = document.querySelector<HTMLElement>('.main-toolbar')!;
    const moveButton = document.getElementById('move-mw-button')!;

    const applyCustomCss = (customCss: string) => {
        customCssElement.innerHTML = customCss;
    }

    const applyMainWindowAppearance = (config: MainWindowAppearanceConfig) => {
        const hoverOnlyCss = config.isHoverOnlyBackgroundSettings ? `
            html:is(:hover, [data-window-hover=true]) .text-container-wrapper {
                --txx-background-color: ${addColorAlpha(config.backgroundColor, config.hoverOnlyBackgroundOpacity / 100)};
                background-color: var(--txx-background-color);
                
                --txx-border-color: ${addColorAlpha(config.borderColor, config.hoverOnlyBorderOpacity / 100)};
                border-color: var(--txx-border-color);
            }
        ` : '';

        mainWindowStyleElement.innerHTML = `
            .text-container-wrapper {
                --txx-transition-property: background-color, border-color;
                transition-property: var(--txx-transition-property);
                
                --txx-transition-duration: 0.12s;
                transition-duration: var(--txx-transition-duration);
                
                --txx-transition-function: ease-in;
                transition-timing-function: var(--txx-transition-function);
                
                --txx-background-color: ${addColorAlpha(config.backgroundColor, config.backgroundOpacity / 100)};
                background-color: var(--txx-background-color);
                
                --txx-border-radius: ${config.borderRadius}px;
                border-radius: var(--txx-border-radius);
                
                --txx-border-width: ${config.borderThickness}px;
                border-width: var(--txx-border-width);
                
                --txx-border-color: ${addColorAlpha(config.borderColor, config.borderOpacity / 100)};
                border-color: var(--txx-border-color);
                
                --txx-color: ${config.textColor};
                color: var(--txx-color);
                
                --txx-font-family: "${config.fontFamily || 'Roboto'}", sans-serif;
                font-family: var(--txx-font-family);
                
                --txx-font-size: ${config.fontSize ?? 20}px;
                font-size: var(--txx-font-size);
                
                --txx-line-height: ${config.lineHeight == null ? 'normal' : (config.lineHeight + '%')};
                line-height: var(--txx-line-height);
                
                --txx-padding-top: ${config.paddingTop ?? 8}px;
                --txx-padding-right: ${config.paddingRight ?? 10}px;
                --txx-padding-bottom: ${config.paddingBottom ?? 8}px;
                --txx-padding-left: ${config.paddingLeft ?? 10}px;
                padding: var(--txx-padding-top) var(--txx-padding-right) var(--txx-padding-bottom) var(--txx-padding-left);
                
                ${getTextOutlineCss(config)}
            }
        
            .sentence {
                --txx-sentence-original-order: ${config.textOrder === TextOrder.TRANSLATED_ORIGINAL ? '1' : '0'};
                --txx-sentence-translated-order: ${config.textOrder === TextOrder.ORIGINAL_TRANSLATED ? '1' : '0'};
                
                --txx-sentence-gap: ${config.sentenceGap ?? 4}px;
                gap: var(--txx-sentence-gap);
            }
            
            .sentence-original, .sentence-original-ordered {
                order: var(--txx-sentence-original-order);
            }
            
            .sentence-translated, .sentence-translated-ordered {
                order: var(--txx-sentence-translated-order);
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

    const applyTextAppearance = (config: TextAppearanceConfig, styleElement: HTMLElement, styledSelector: string) => {
        const textBackgroundCss = config.textBackgroundType && `
                --txx-background-color: ${addColorAlpha(config.textBackgroundColor, config.textBackgroundOpacity / 100)};
                background-color: var(--txx-background-color);
                
                --txx-outline-color: ${addColorAlpha(config.textBorderColor, config.textBorderOpacity / 100)};
                outline-color: var(--txx-outline-color);
                
                --txx-outline-width: ${config.textBorderThickness ?? 0}px;
                outline-width: var(--txx-outline-width);
                
                --txx-outline-offset: -${Math.ceil((config.textBorderThickness ?? 0) / 2)}px;
                outline-offset: var(--txx-outline-offset);
                
                --txx-outline-style: solid;
                outline-style: var(--txx-outline-style);
                
                --txx-border-radius: ${config.textBorderRadius ?? 0}px;
                border-radius: var(--txx-border-radius);
            `;

        const outlineCss: string = (() => {
            if (config.textOutlineType === TextAppearanceOverrideType.INHERIT) {
                return '';
            }

            if (!config.textOutlineType) {
                return `
                    --txx-text-shadow: none;
                    text-shadow: var(--txx-text-shadow);
                    --txx--webkit-text-stroke: none;
                    -webkit-text-stroke: var(--txx--webkit-text-stroke);
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
                    --txx-color: ${config.textColor || 'inherit'};
                    color: var(--txx-color);
                    
                    --txx-opacity: ${config.textOpacity == null ? 'inherit' : (config.textOpacity / 100)};
                    opacity: var(--txx-opacity);
                    
                    --txx-font-size: ${config.fontSize == null ? 'inherit' : config.fontSize + '%'};
                    font-size: var(--txx-font-size);
                    
                    --txx-font-family: ${config.fontFamily ? `"${config.fontFamily}"` : 'inherit'};
                    font-family: var(--txx-font-family);
                    
                    --txx-font-weight: ${config.fontWeight ?? 'inherit'};
                    font-weight: var(--txx-font-weight);
                    
                    --txx-font-style: ${config.isItalic ? 'italic' : 'normal'};
                    font-style: var(--txx-font-style);
                    
                    --txx-text-decoration: ${config.isUnderlined ? 'underline' : 'none'};
                    text-decoration: var(--txx-text-decoration);
                    
                    --txx-line-height: ${config.lineHeight == null ? 'normal' : (config.lineHeight + '%')};
                    line-height: var(--txx-line-height);
                    
                    --txx-transition-property: opacity;
                    --txx-transition-duration: 0.12s;
                    --txx-transition-function: ease-in;
                    transition-property: var(--txx-transition-property);
                    transition-duration: var(--txx-transition-duration);
                    transition-timing-function: var(--txx-transition-function);
                    
                    ${config.textBackgroundType === TextBackgroundType.BLOCK ? textBackgroundCss : ''}
                    
                    ${outlineCss}
                }
                
                html:not(:hover):not([data-window-hover=true]) ${styledSelector} {
                    ${config.isDisplayedOnHoverOnly ? 'opacity: 0;' : ''}
                }
                
                ${styledSelector}.sentence-loading, ${styledSelector}:not(.sentence-loading) > .sentence-text {
                    --txx-padding-top: ${config.textPaddingTop ?? 0}px;
                    padding-top: var(--txx-padding-top);
                    
                    --txx-padding-right: ${config.textPaddingRight ?? 0}px;
                    padding-right: var(--txx-padding-right);
                    
                    --txx-padding-bottom: ${config.textPaddingBottom ?? 0}px;
                    padding-bottom: var(--txx-padding-bottom);
                    
                    --txx-padding-left: ${config.textPaddingLeft ?? 0}px;
                    padding-left: var(--txx-padding-left);
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
            applyMainWindowAppearance(config as MainWindowAppearanceConfig);
            break;
        case 'originalText':
            applyTextAppearance(config as TextAppearanceConfig, originalTextStyleElement, '.sentence-original');
            break;
        case 'translatedText':
            applyTextAppearance(config as TextAppearanceConfig, translatedTextStyleElement, '.sentence-translated');
            break;
        case 'customCss':
            applyCustomCss(config as string);
            break;
        }
    });

    ipcRenderer.on('active-profile-changed', async (event, activeProfileId: string | undefined) => {
        const appearanceConfigKey = getAppearanceConfigKey(activeProfileId);
        const appearanceConfig = await electronStore.get<AppearanceConfig>(appearanceConfigKey)
            ?? await initializeAppearanceConfig(electronStore, appearanceConfigKey);

        applyMainWindowAppearance(appearanceConfig.mainWindow);
        applyTextAppearance(appearanceConfig.originalText, originalTextStyleElement, '.sentence-original');
        applyTextAppearance(appearanceConfig.translatedText, translatedTextStyleElement, '.sentence-translated');
    });

    electronStore.get<SavedProfiles | undefined>(StoreKeys.SAVED_PROFILES).then(async (savedProfiles) => {
        const activeProfileId = savedProfiles?.activeProfileId;

        const appearanceConfigKey = getAppearanceConfigKey(activeProfileId);
        const appearanceConfig = await electronStore.get<AppearanceConfig>(appearanceConfigKey, defaultAppearanceConfig)
            ?? await initializeAppearanceConfig(electronStore, appearanceConfigKey);

        applyMainWindowAppearance(appearanceConfig.mainWindow);
        applyTextAppearance(appearanceConfig.originalText, originalTextStyleElement, '.sentence-original');
        applyTextAppearance(appearanceConfig.translatedText, translatedTextStyleElement, '.sentence-translated');
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

const listenWindowHover = () => {
    ipcRenderer.on('main-window.hover-change', (event, isHover: boolean) => {
        window.document.documentElement.setAttribute('data-window-hover', String(isHover));
    });
};

window.addEventListener('DOMContentLoaded', () => {
    initToolbar();
    initWindowDragger();
    // initWindowResize();
    listenWindowHover();
    initAutoHistory();
    initAppearanceSettingsHandling();
    initSampleTextShowing();
    listenProfilesUpdate();
    initProfiles();
    workTextractorPipe();
});

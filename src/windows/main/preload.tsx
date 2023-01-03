import workTextractorServer from './logic/workTextractorServer';
import {ipcRenderer} from 'electron';
import ref from '../../utils/ref';
import watchCtrl from './utils/watchCtrl';
import readStoreStateLazy from '../../utils/readStoreStateLazy';
import electronStore from '../../electron-store/electronStore';
import {StoreKeys} from '../../constants/store-keys';
import MainWindowAppearanceConfig, {
    defaultMainWindowAppearance,
    MainWindowDragMode
} from '../../configuration/appearance/MainWindowAppearanceConfig';
import addColorAlpha from '../../utils/addColorAlpha';
import initWindowDragger from './logic/initWindowDragger';
import TextAppearanceConfig, {
    defaultOriginalTextAppearance,
    defaultTranslatedTextAppearance
} from '../../configuration/appearance/TextAppearanceConfig';
import {defaultSettingsTab, SettingsTab} from '../settings/types';

const isHistoryShownRef = ref<boolean>(false);

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

    closeAppButton.addEventListener('click', () => ipcRenderer.invoke('main-window.close'));

    minimizeAppButton.addEventListener('click', () => ipcRenderer.invoke('main-window.minimize'));

    settingsButton.addEventListener('click', () => ipcRenderer.invoke('open-settings-window'));

    historyButton.addEventListener('click', () => {
        toggleHistory();
    });

    mainToolbar.classList.add('force-visible');
    setTimeout(() => {
        mainToolbar.classList.remove('force-visible');
    }, 2000);
};

const initAppearanceSettingsHandling = () => {
    const mainWindowStyleElement = document.getElementById('customizable-styles__main-window')!;
    const originalTextStyleElement = document.getElementById('customizable-styles__original-text')!;
    const translatedTextStyleElement = document.getElementById('customizable-styles__translated-text')!;

    const container = document.querySelector<HTMLElement>('.text-container-wrapper')!;
    const mainToolbar = document.querySelector<HTMLElement>('.main-toolbar')!;
    const moveButton = document.getElementById('move-mw-button')!;

    readStoreStateLazy<MainWindowAppearanceConfig>(electronStore, StoreKeys.SETTINGS_APPEARANCE_MAIN_WINDOW, defaultMainWindowAppearance, (config) => {
        mainWindowStyleElement.innerHTML = `            
            .text-container-wrapper {
                background-color: ${addColorAlpha(config.backgroundColor, config.backgroundOpacity / 100)};
                border-radius: ${config.borderRadius}px;
                border-width: ${config.borderThickness}px;
                border-color: ${addColorAlpha(config.borderColor, config.borderOpacity / 100)};
                color: ${config.textColor};
                font-family: "${config.fontFamily || 'Roboto'}", sans-serif;
                font-size: ${config.fontSize ?? 20}px;
                line-height: ${config.lineHeight == null ? 'normal' : (config.lineHeight + '%')};
                padding: ${config.paddingTop ?? 8}px ${config.paddingRight ?? 10}px ${config.paddingBottom ?? 8}px ${config.paddingLeft ?? 10}px;
            }
            
            .main-toolbar {
                border-radius: 0 ${config.borderRadius ?? 4}px 0 ${Math.min(config.borderRadius ?? 4, 8)}px;
            }
        `;

        // container.style.backgroundColor = addColorAlpha(config.backgroundColor, config.backgroundOpacity / 100);
        // container.style.borderRadius = `${config.borderRadius}px`;
        // mainToolbar.style.borderTopRightRadius = `${config.borderRadius}px`;
        // container.style.borderWidth = `${config.borderThickness}px`;
        // container.style.borderColor = addColorAlpha(config.borderColor, config.borderOpacity / 100);
        // container.style.color = config.textColor;
        // container.style.fontFamily = `"${config.fontFamily}", 'Roboto', sans-serif`;
        // container.style.fontSize = `${config.fontSize ?? 20}px`;
        // container.style.lineHeight = config.lineHeight ? `${config.lineHeight}%` : '';

        const isWindowDraggableItself = config.windowDragMode !== MainWindowDragMode.PANEL;
        document.body.setAttribute('data-mw-drag', String(isWindowDraggableItself));

        const isFullyDraggable = config.windowDragMode === MainWindowDragMode.ENTIRE_WINDOW;
        if (isFullyDraggable) {
            moveButton.classList.add('d-none');
        } else {
            moveButton.classList.remove('d-none');
        }
    });

    const handleTextAppearanceChanges = (key: StoreKeys, defaultConfig: TextAppearanceConfig, styleElement: HTMLElement, styledSelector: string) => {
        readStoreStateLazy(electronStore, key, defaultConfig, (config) => {
            styleElement.innerHTML = `
                ${styledSelector} {
                    color: ${config.textColor ? addColorAlpha(config.textColor, config.textOpacity / 100) : 'inherit'};
                    font-size: ${config.fontSize == null ? 'inherit' : config.fontSize + '%'};
                    font-family: ${config.fontFamily ? `"${config.fontFamily}"` : 'inherit'};
                    font-weight: ${config.fontWeight ?? 'inherit'};
                    font-style: ${config.isItalic ? 'italic' : 'normal'};
                    text-decoration: ${config.isUnderlined ? 'underline' : 'none'};
                    line-height: ${config.lineHeight == null ? 'normal' : (config.lineHeight + '%')};
                }
            `;
        });
    };

    handleTextAppearanceChanges(StoreKeys.SETTINGS_APPEARANCE_ORIGINAL_TEXT, defaultOriginalTextAppearance, originalTextStyleElement, '.sentence-original');
    handleTextAppearanceChanges(StoreKeys.SETTINGS_APPEARANCE_TRANSLATED_TEXT, defaultTranslatedTextAppearance, translatedTextStyleElement, '.sentence-translated');
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

window.addEventListener('DOMContentLoaded', () => {
    initToolbar();
    initWindowDragger();
    initAutoHistory();
    initAppearanceSettingsHandling();
    initSampleTextShowing();
    workTextractorServer();
});

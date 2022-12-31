import workTextractorServer from './logic/workTextractorServer';
import {ipcRenderer} from 'electron';
import ref from '../../utils/ref';
import watchCtrl from './utils/watchCtrl';
import readStoreStateLazy from '../../utils/readStoreStateLazy';
import electronStore from '../../electron-store/electronStore';
import {StoreKeys} from '../../constants/store-keys';
import MainWindowAppearanceConfig, {defaultMainWindowAppearance} from '../../configuration/appearance/MainWindowAppearanceConfig';
import addColorAlpha from '../../utils/addColorAlpha';

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
    //TODO

    readStoreStateLazy<MainWindowAppearanceConfig>(electronStore, StoreKeys.SETTINGS_APPEARANCE_MAIN_WINDOW, defaultMainWindowAppearance, (config) => {
        const backgroundColorRgba = addColorAlpha(config.backgroundColor, config.backgroundOpacity / 100);
        const container = document.querySelector('.text-container-wrapper') as HTMLElement;
        container.style.backgroundColor = backgroundColorRgba;
    });
};

const initWindowDragger = () => {
    const moveMwButton = document.getElementById('move-mw-button')!;
    moveMwButton.addEventListener('mouseenter', () => {
        console.log('ENTER')
        ipcRenderer.invoke('set-main-window-draggable', true);
    });
    moveMwButton.addEventListener('mouseleave', () => {
        console.log('LEAVE')
        ipcRenderer.invoke('set-main-window-draggable', false);
    });
};

window.addEventListener('DOMContentLoaded', () => {
    initToolbar();
    initWindowDragger();
    initAutoHistory();
    initAppearanceSettingsHandling();
    workTextractorServer();
});

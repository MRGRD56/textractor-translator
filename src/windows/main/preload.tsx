import workTextractorServer from './logic/workTextractorServer';
import {ipcRenderer} from 'electron';
import ref, {NullableRef} from '../../utils/ref';
import watchCtrl from './utils/watchCtrl';
import readStoreStateLazy from '../../utils/readStoreStateLazy';
import electronStore from '../../electron-store/electronStore';
import {StoreKeys} from '../../constants/store-keys';
import MainWindowAppearanceConfig, {
    defaultMainWindowAppearance,
    MainWindowDragMode
} from '../../configuration/appearance/MainWindowAppearanceConfig';
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
    readStoreStateLazy<MainWindowAppearanceConfig>(electronStore, StoreKeys.SETTINGS_APPEARANCE_MAIN_WINDOW, defaultMainWindowAppearance, (config) => {
        const container = document.querySelector('.text-container-wrapper') as HTMLElement;
        const mainToolbar = document.querySelector('.main-toolbar') as HTMLElement;
        const moveButton = document.getElementById('move-mw-button') as HTMLElement;

        container.style.backgroundColor = addColorAlpha(config.backgroundColor, config.backgroundOpacity / 100);
        container.style.borderRadius = `${config.borderRadius}px`;
        mainToolbar.style.borderTopRightRadius = `${config.borderRadius}px`;
        container.style.borderWidth = `${config.borderThickness}px`;
        container.style.borderColor = addColorAlpha(config.borderColor, config.borderOpacity / 100);

        const isWindowDraggableItself = config.windowDragMode !== MainWindowDragMode.PANEL;
        document.body.setAttribute('data-mw-drag', String(isWindowDraggableItself));

        const isFullyDraggable = config.windowDragMode === MainWindowDragMode.ENTIRE_WINDOW;
        if (isFullyDraggable) {
            moveButton.classList.add('d-none');
        } else {
            moveButton.classList.remove('d-none');
        }
    });
};

const LEFT_MOUSE_BUTTON_CODE = 1;

const STRING_TO_BOOLEAN_MAP = {
    true: true,
    false: false
} as Record<string, boolean>;

const setMainWindowDraggableBackground = (isDraggable: boolean) => {
    ipcRenderer.invoke('set-main-window-draggable', isDraggable);
};

const setMainWindowDraggableTopPanelOnly = (isDraggable: boolean) => {
    ipcRenderer.invoke('set-main-window-draggable-top-panel-only', isDraggable);
};

const isDraggableElement = (element: HTMLElement | null): boolean | undefined => {
    if (!element) {
        return;
    }

    const draggableAttribute = element.getAttribute('data-mw-drag');
    if (!draggableAttribute) {
        return;
    }

    return STRING_TO_BOOLEAN_MAP[draggableAttribute];
};

const handleDragElementChange = (event: MouseEvent, element: HTMLElement, lmbUpListenerRef: NullableRef<(event: MouseEvent) => void>, setIsDraggable: (isDraggable: boolean) => void) => {
    const isDraggable = isDraggableElement((element as HTMLElement)?.closest('[data-mw-drag]')) ?? false;

    const isLeftButtonPressed = Boolean(event.buttons & LEFT_MOUSE_BUTTON_CODE);

    console.log('drag element change', {isDraggable, isLeftButtonPressed, event, eventButtons: event.buttons})

    if (isDraggable && isLeftButtonPressed) {
        if (!lmbUpListenerRef.current) {
            lmbUpListenerRef.current = (event) => {
                // if left mouse button is still pressed
                if (event.buttons & LEFT_MOUSE_BUTTON_CODE) {
                    return;
                }

                const isDraggable = isDraggableElement((event.target as HTMLElement)?.closest('[data-mw-drag]')) ?? false;

                setIsDraggable(isDraggable);

                if (lmbUpListenerRef.current) {
                    window.removeEventListener('mouseup', lmbUpListenerRef.current);
                    lmbUpListenerRef.current = undefined;
                }
            };

            window.addEventListener('mouseup', lmbUpListenerRef.current);
        }

        return;
    }

    setIsDraggable(isDraggable);
};

const handleDragElementEvents = (dragElement: HTMLElement, setIsDraggable: (isDraggable: boolean) => void) => {
    const lmbUpListenerRef = ref<((event: MouseEvent) => void)>();

    dragElement.addEventListener('mouseenter', (event) => {
        handleDragElementChange(event, event.target as HTMLElement, lmbUpListenerRef, setIsDraggable);
    });
    dragElement.addEventListener('mouseleave', (event) => {
        handleDragElementChange(event, event.relatedTarget as HTMLElement, lmbUpListenerRef, setIsDraggable);
    });
};

const initWindowDragger = () => {
    handleDragElementEvents(document.getElementById('move-mw-button')!, setMainWindowDraggableTopPanelOnly);

    const dragElements: NodeListOf<HTMLElement> = document.querySelectorAll('[data-mw-drag=true], [data-mw-drag=false]');
    dragElements.forEach(dragElement => handleDragElementEvents(dragElement, setMainWindowDraggableBackground));
};

window.addEventListener('DOMContentLoaded', () => {
    initToolbar();
    initWindowDragger();
    initAutoHistory();
    initAppearanceSettingsHandling();
    workTextractorServer();
});

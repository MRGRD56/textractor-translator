import {app, BrowserWindow} from 'electron';
import makeWindowFullyDraggable from '../../utils/makeWindowFullyDraggable';
import type Store from 'electron-store';
import MainWindowAppearanceConfig, {
    MainWindowDragMode
} from '../../configuration/appearance/MainWindowAppearanceConfig';
import {StoreKeys} from '../../constants/store-keys';
import MainWindowDragState from './logic/MainWindowDragState';
import AppearanceConfig, {getAppearanceConfigKey} from '../../configuration/appearance/AppearanceConfig';
import ref from '../../utils/ref';
import SavedProfiles from '../settings/profiles/SavedProfiles';
import nodeEventEmitter from '../../nodeEventEmitter';
import trackWindowHover from '../../utils/trackWindowHover';
import nodeConsole from '../../utils/nodeConsole';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export function createMainWindow(store: Store): BrowserWindow {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 200,
        width: 900,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            nodeIntegration: true,
            devTools: true
        },
        transparent: true,
        frame: false,
        resizable: true,
        movable: false,
        alwaysOnTop: true
        // {
        //     theme: 'dark',
        //         effect: 'acrylic',
        //     disableOnBlur: false,
        //     useCustomWindowRefreshMethod: false,
        //     maximumRefreshRate: 165
        // }
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // const appearanceConfig = readStoreStateSync<MainWindowAppearanceConfig>(store, StoreKeys.SETTINGS_APPEARANCE_MAIN_WINDOW, defaultMainWindowAppearance, (appearanceConfig) => {
    // const currentVibrancy = getVibrancyConfig(appearanceConfig);
    // console.log('currentVibrancy', currentVibrancy);
    // setVibrancy(mainWindow as any, currentVibrancy);
    // });
    (global as any).MainWindowDragState ??= {
        isDraggable: false
    } as typeof MainWindowDragState;

    const mainWindowAppearanceConfig = ref<MainWindowAppearanceConfig>();

    nodeEventEmitter.on('appearance-settings-changed', (appearanceKey: keyof AppearanceConfig, config: AppearanceConfig[keyof AppearanceConfig]) => {
        if (appearanceKey === 'mainWindow') {
            mainWindowAppearanceConfig.current = config as MainWindowAppearanceConfig;
        }
    });

    nodeEventEmitter.on('active-profile-changed', async (activeProfileId: string | undefined) => {
        const appearanceConfigKey = getAppearanceConfigKey(activeProfileId);
        const appearanceConfig = store.get(appearanceConfigKey) as AppearanceConfig;
        mainWindowAppearanceConfig.current = appearanceConfig.mainWindow;
    });

    const savedProfiles = store.get(StoreKeys.SAVED_PROFILES) as SavedProfiles | undefined;
    if (savedProfiles) {
        const appearanceConfigKey = getAppearanceConfigKey(savedProfiles.activeProfileId);
        const appearanceConfig = store.get(appearanceConfigKey) as AppearanceConfig | undefined;
        if (appearanceConfig) {
            mainWindowAppearanceConfig.current = appearanceConfig.mainWindow;
        }
    }

    mainWindow.hookWindowMessage(0x0200, () => {
        console.log('WM_MOUSEMOVE');
    });

    // trackWindowHover(mainWindow, isHover => {
    //     nodeConsole.log('isHover', isHover);
    // });

    makeWindowFullyDraggable(mainWindow, () => {
        const isFullyDraggable = mainWindowAppearanceConfig.current?.windowDragMode === MainWindowDragMode.ENTIRE_WINDOW;
        if (isFullyDraggable) {
            return true;
        }

        const isTopPanelOnlyDraggable = mainWindowAppearanceConfig.current?.windowDragMode === MainWindowDragMode.PANEL;

        const state = ((global as any).MainWindowDragState as typeof MainWindowDragState);

        if (isTopPanelOnlyDraggable) {
            return state?.isDraggableTopPanelOnly;
        }

        return state?.isDraggable;
    });

    // makeWindowResizable(mainWindow, 8);

    mainWindow.on('close', () => {
        app.quit();
    });

    return mainWindow;
}
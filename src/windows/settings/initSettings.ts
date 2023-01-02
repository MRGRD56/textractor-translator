import {BrowserWindow, shell} from 'electron';

declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string;
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let settingsWindow: BrowserWindow | undefined = undefined;

export function createSettingsWindow(): void {
    if (settingsWindow && !settingsWindow.isDestroyed()) {
        if (settingsWindow.isMinimized()) {
            settingsWindow.restore();
        }
        settingsWindow.focus();
        return;
    }

    settingsWindow = new BrowserWindow({
        height: 850,
        width: 1000,
        webPreferences: {
            preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
            sandbox: false,
            nodeIntegration: true
        },
        alwaysOnTop: true
    });

    settingsWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);

    // settingsWindow.on('close', () => {
    //     settingsWindow = undefined;
    // });
}
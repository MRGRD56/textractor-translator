import {BrowserWindow} from 'electron';

declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string;
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export function createSettingsWindow(): void {
    const settingsWindow = new BrowserWindow({
        height: 850,
        width: 1000,
        webPreferences: {
            preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
            sandbox: false,
            nodeIntegration: true
        }
    });

    settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);
}
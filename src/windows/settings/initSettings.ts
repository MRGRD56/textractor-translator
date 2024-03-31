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
        width: 900,
        webPreferences: {
            preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
            sandbox: false,
            nodeIntegration: true
        },
        // alwaysOnTop: true
    });

    settingsWindow.on('close', () => {
        (global as any).app_isSettingsWindowOpen = false;
        BrowserWindow.getAllWindows().forEach(window => {
            window.webContents.send('settings-window.@closed');
        });
    });

    settingsWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);

    (global as any).app_isSettingsWindowOpen = true;
    BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send('settings-window.@opened');
    });

    // settingsWindow.on('close', () => {
    //     settingsWindow = undefined;
    // });
}
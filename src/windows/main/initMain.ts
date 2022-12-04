import {BrowserWindow} from 'electron';
import makeWindowFullyDraggable from '../../makeWindowFullyDraggable';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export function createMainWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 200,
        width: 900,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            nodeIntegration: true
        },
        transparent: true,
        frame: false,
        resizable: true,
        movable: true,
        alwaysOnTop: true
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    makeWindowFullyDraggable(mainWindow);
}
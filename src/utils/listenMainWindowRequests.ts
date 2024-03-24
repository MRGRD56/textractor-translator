import {BrowserWindow, ipcMain} from 'electron';

const listenMainWindowRequests = (mainWindow: BrowserWindow) => {
    ipcMain.handle('main-window.close', () => {
        mainWindow.close();
    });
    ipcMain.handle('main-window.minimize', () => {
        mainWindow.minimize();
    });
    ipcMain.handle('main-window.devtools', () => {
        mainWindow.webContents.openDevTools({mode: 'detach', activate: true});
    });
};

export default listenMainWindowRequests;
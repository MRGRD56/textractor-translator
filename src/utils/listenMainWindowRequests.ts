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

        mainWindow.webContents.on('devtools-opened', () => {
            try {
                // Отправляет команду в DevTools для переключения на вкладку Console
                mainWindow.webContents.devToolsWebContents?.executeJavaScript('DevToolsAPI.showPanel("console")');
            } catch (e) {
                console.warn('Unable to switch devtools tab to console', e);
            }
        });

        mainWindow.webContents.devToolsWebContents?.focus();
    });
};

export default listenMainWindowRequests;
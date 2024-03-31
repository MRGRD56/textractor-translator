import {BrowserWindow, ipcMain} from 'electron';
import type Interact from 'interactjs';

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
    // ipcMain.handle('main-window.resize', (event, rect: Interact.FullRect) => {
    //     const bounds = mainWindow.getBounds();
    //
    //     const newBounds: Electron.Rectangle = {
    //         x: bounds.x + rect.left,
    //         y: bounds.y + rect.top,
    //         width: bounds.width + rect.width,
    //         height: bounds.height + rect.height
    //     };
    //
    //     console.log('handling mw resize', {rect, newBounds});
    //
    //     mainWindow.setBounds(newBounds);
    // });
};

export default listenMainWindowRequests;
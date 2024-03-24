import {BrowserWindow} from 'electron';

const rendererConsole = new Proxy({}, {
    get(target, property) {
        return (...args: any[]) => {
            BrowserWindow.getAllWindows().forEach(window => {
                window.webContents.send('console-method', { method: property, args });
            });
        };
    }
}) as any as Console;

export default rendererConsole;
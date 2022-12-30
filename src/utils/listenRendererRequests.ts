import {dialog, ipcMain, OpenDialogSyncOptions} from 'electron';
import {createSettingsWindow} from '../windows/settings/initSettings';
import MainWindowDragState from '../windows/main/logic/MainWindowDragState';

const listenRendererRequests = (): void => {
    ipcMain.handle('open-settings-window', () => {
        createSettingsWindow();
    });

    ipcMain.handle('show-open-dialog-sync', (event, options: OpenDialogSyncOptions) => {
        return dialog.showOpenDialogSync(options);
    });

    ipcMain.handle('global-set', (event, key, value) => {
        (global as any)[key] = value;
    });

    ipcMain.handle('global-get', (event, key) => {
        return (global as any)[key];
    });

    ipcMain.handle('set-main-window-draggable', (event, isDraggable: boolean) => {
        const mainWindowDragState = ((global as any).MainWindowDragState as typeof MainWindowDragState | undefined);
        if (mainWindowDragState) {
            mainWindowDragState.isDraggable = isDraggable;
        } else {
            (global as any).MainWindowDragState = {isDraggable} as typeof MainWindowDragState;
        }
    })
};

export default listenRendererRequests;
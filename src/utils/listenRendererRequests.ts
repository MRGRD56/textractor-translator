import {dialog, ipcMain, OpenDialogSyncOptions} from 'electron';
import {createSettingsWindow} from '../windows/settings/initSettings';

const listenRendererRequests = (): void => {
    ipcMain.handle('open-settings-window', () => {
        createSettingsWindow();
    });

    ipcMain.handle('show-open-dialog-sync', (event, options: OpenDialogSyncOptions) => {
        return dialog.showOpenDialogSync(options);
    });
};

export default listenRendererRequests;
import {BrowserWindow, dialog, ipcMain, OpenDialogSyncOptions} from 'electron';
import {createSettingsWindow} from '../windows/settings/initSettings';
import MainWindowDragState from '../windows/main/logic/MainWindowDragState';
import {getFonts, IOptions} from 'font-list';
import * as child_process from 'child_process';
import AppearanceConfig from '../configuration/appearance/AppearanceConfig';
import nodeEventEmitter from '../nodeEventEmitter';

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
    });

    ipcMain.handle('set-main-window-draggable-top-panel-only', (event, isDraggable: boolean) => {
        const mainWindowDragState = ((global as any).MainWindowDragState as typeof MainWindowDragState | undefined);
        if (mainWindowDragState) {
            mainWindowDragState.isDraggableTopPanelOnly = isDraggable;
        } else {
            (global as any).MainWindowDragState = {isDraggableTopPanelOnly: isDraggable} as typeof MainWindowDragState;
        }
    });

    ipcMain.handle('get-installed-fonts', (event, options: IOptions) => {
        return getFonts(options).then(fonts => {
            return [...new Set([...fonts, 'Roboto'])].sort((a, b) => a.localeCompare(b));
        });
    });

    ipcMain.handle('child-process.exec-file', (event, path: string) => {
        child_process.execFile(path);
    });

    ipcMain.handle('active-profile-changed', (event, activeProfileId: string | undefined) => {
        BrowserWindow.getAllWindows().forEach(window => {
            window.webContents.send('active-profile-changed', activeProfileId);
        });
        nodeEventEmitter.emit('active-profile-changed', activeProfileId);
    });

    ipcMain.handle('appearance-settings-changed', (event, appearanceKey: keyof AppearanceConfig, config: AppearanceConfig[keyof AppearanceConfig]) => {
        BrowserWindow.getAllWindows().forEach(window => {
            window.webContents.send('appearance-settings-changed', appearanceKey, config);
        });
        nodeEventEmitter.emit('appearance-settings-changed', appearanceKey, config);
    });
};

export default listenRendererRequests;
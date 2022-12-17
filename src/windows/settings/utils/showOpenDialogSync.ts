import type {IpcRenderer, OpenDialogSyncOptions} from 'electron';

const showOpenDialogSync = (options: OpenDialogSyncOptions): Promise<string[] | undefined> => {
    const ipcRenderer: IpcRenderer = (window as any).nodeApi.ipcRenderer;

    return ipcRenderer.invoke('show-open-dialog-sync', options) as Promise<string[] | undefined>;
};

export default showOpenDialogSync;
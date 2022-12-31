import {ipcRenderer} from 'electron';
import {ElectronStore, electronStoreKeysSimple} from './electronStoreShared';
import IpcRendererEvent = Electron.IpcRendererEvent;

const electronStore: ElectronStore = {} as ElectronStore;

for (const key of electronStoreKeysSimple) {
    (electronStore as any)[key] = (...args: any) => {
        return ipcRenderer.invoke(`store.${key}`, ...args);
    };

    electronStore.onDidAnyChange = (callback) => {
        const listener = (event: IpcRendererEvent, newValue: Readonly<Record<string, unknown>>, oldValue: Readonly<Record<string, unknown>>) => {
            callback(newValue, oldValue);
        };
        ipcRenderer.on('store.@event.onDidAnyChange', listener);

        return () => ipcRenderer.off('store.@event.onDidAnyChange', listener);
    };

    electronStore.onDidChange = (key, callback) => {
        return electronStore.onDidAnyChange((newValue, oldValue) => {
            if ((newValue && key in newValue) || (oldValue && key in oldValue)) {
                const newKeyValue = newValue?.[key];
                const oldKeyValue = oldValue?.[key];
                if (newKeyValue !== oldKeyValue) {
                    callback(newKeyValue, oldKeyValue);
                }
            }
        });
    };
}

export default electronStore;
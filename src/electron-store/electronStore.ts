import {ipcRenderer} from 'electron';
import {ElectronStore, electronStoreKeys} from './electronStoreShared';

const electronStore: ElectronStore = {} as ElectronStore;

for (const key of electronStoreKeys) {
    (electronStore as any)[key] = (...args: any) => {
        return ipcRenderer.invoke(`store.${key}`, ...args);
    };
}

export default electronStore;
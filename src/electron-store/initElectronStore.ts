import {ipcMain} from 'electron';
import Store from 'electron-store';
import nodeConsole from '../utils/nodeConsole';
import {electronStoreKeys} from './electronStoreShared';

export const initElectronStore = (): Store => {
    const store = new Store();

    nodeConsole.log('Creating handlers for electronStore')

    for (const key of electronStoreKeys) {
        if (typeof (store as any)[key] !== 'function') {
            continue;
        }

        nodeConsole.log('Create handler for ' + `store.${key}`)

        ipcMain.handle(`store.${key}`, (event, ...args) => {
            return (store as any)[key](...args);
        });
    }

    (global as any).store = store;

    return store;
};

export default initElectronStore;
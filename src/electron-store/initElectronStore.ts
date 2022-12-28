import {ipcMain} from 'electron';
import Store from 'electron-store';
import nodeConsole from '../utils/nodeConsole';
import {electronStoreKeys} from './electronStoreShared';

export const initElectronStore = () => {
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
};

export default initElectronStore;
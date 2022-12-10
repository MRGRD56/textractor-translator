// const store = new Store();

import electronStore from '../../electron-store/electronStore';
import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld(
    'nodeApi',
    {
        store: electronStore,
        ipcRenderer
    }
)

// (window as any).electron = {
//     helloworld: () => {
//         console.log('Hello world')
//     }
// };
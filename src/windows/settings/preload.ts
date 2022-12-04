// const store = new Store();

import electronStore from '../../electron-store/electronStore';
import {contextBridge} from 'electron';

contextBridge.exposeInMainWorld(
    'nodeApi',
    {
        store: electronStore
    }
)

// (window as any).electron = {
//     helloworld: () => {
//         console.log('Hello world')
//     }
// };
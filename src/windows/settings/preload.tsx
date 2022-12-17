// const store = new Store();

import electronStore from '../../electron-store/electronStore';
import {contextBridge, ipcRenderer} from 'electron';
import {GetTextractorPaths, TextractorPath, TextractorPaths, ValidateTextractorPath} from './types';
import * as fs from 'fs';
import * as path from 'path';
import {TextractorStatus} from './tabs/settingsTextractor/types';
import * as child_process from 'child_process';

const validateTextractorPath: ValidateTextractorPath = (exePath) => {
    if (fs.existsSync(exePath)) {
        if (fs.statSync(exePath).isFile()) {
            if (path.basename(exePath) === 'Textractor.exe') {
                return TextractorStatus.SUCCESS;
            }
        }
    }

    return TextractorStatus.ERROR;
};

const nodeApi = {
    store: electronStore,
    ipcRenderer,
    validateTextractorPath,
    getTextractorPaths: ((currentType, exePath, canAutofillAnother): TextractorPaths => {
        const anotherType = currentType === 'x86' ? 'x64' : 'x86';

        if (validateTextractorPath(exePath) === TextractorStatus.SUCCESS) {
            // valid

            const currentTextractor: TextractorPath = {
                path: exePath,
                status: TextractorStatus.SUCCESS
            };
            let anotherTextractor: TextractorPath | undefined;

            if (canAutofillAnother) {
                const textractorExeName = path.basename(exePath);

                const textractorDirectory = path.dirname(exePath);
                const parentDirectory = path.resolve(textractorDirectory, '..');
                const anotherTextractorExePath = path.resolve(parentDirectory, anotherType, textractorExeName);
                if (exePath !== anotherTextractorExePath) {
                    const hasAnotherTextractor = fs.existsSync(anotherTextractorExePath);
                    if (hasAnotherTextractor) {
                        anotherTextractor = {
                            path: anotherTextractorExePath,
                            status: TextractorStatus.SUCCESS
                        };
                    }
                }
            }

            return {
                [currentType]: currentTextractor,
                [anotherType]: anotherTextractor
            } as TextractorPaths;
        }

        return {
            [currentType]: {
                path: exePath,
                status: TextractorStatus.ERROR
            }
        } as TextractorPaths;
    }) as GetTextractorPaths,
    exec: (path: string): void => {
        child_process.execFile(path);
    }
};

export type SettingsNodeApi = typeof nodeApi;

contextBridge.exposeInMainWorld(
    'nodeApi',
    nodeApi
)

// (window as any).electron = {
//     helloworld: () => {
//         console.log('Hello world')
//     }
// };
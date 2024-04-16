// const store = new Store();

import electronStore from '../../electron-store/electronStore';
import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';
import {GetTextractorPaths, TextractorPath, TextractorPaths} from './types';
import * as fs from 'fs';
import * as path from 'path';
import {TextractorStatus} from './tabs/settingsTextractor/types';
import downloadFile from '../../utils/downloadFile';
import {v4} from 'uuid';
import validateTextractorPath from '../../utils/logic/validateTextractorPath';
import decompress = require('decompress');
import {ActiveProfileChangedEvent, AppearanceSettingsChangedEvent} from '../../types/custom-events';
import AppearanceConfig from '../../configuration/appearance/AppearanceConfig';

const TTBRIDGE_EXTENSION_NAME = 'TextractorPipe';
const TTBRIDGE_EXTENSION_FILENAME = `${TTBRIDGE_EXTENSION_NAME}.xdll`;

const EXTENSIONS_FILE = 'SavedExtensions.txt';

const TTBRIDGE_X86_DOWNLOAD_URL = 'https://github.com/MRGRD56/textractor-integration-extensions/releases/download/TextractorPipe_v1.0.0/win_x86.zip';
const TTBRIDGE_X64_DOWNLOAD_URL = 'https://github.com/MRGRD56/textractor-integration-extensions/releases/download/TextractorPipe_v1.0.0/win_x64.zip';

const checkExtensionFileExistence = (textractorDirectory: string): boolean => {
    const ttbridgeLibraryPath = path.resolve(textractorDirectory, TTBRIDGE_EXTENSION_FILENAME);
    return fs.existsSync(ttbridgeLibraryPath) && fs.statSync(ttbridgeLibraryPath).isFile();
};

const checkExtensionSpecifiedInList = (textractorDirectory: string): boolean => {
    const extensionsFilePath = path.resolve(textractorDirectory, EXTENSIONS_FILE);
    let extensionsFileText: string;
    try {
        extensionsFileText = fs.readFileSync(extensionsFilePath, 'utf8');
    } catch (error) {
        return false;
    }

    return new RegExp(`^(.+>)?${TTBRIDGE_EXTENSION_NAME}(>.*)?$`).test(extensionsFileText);
};

const nodeApi = {
    store: electronStore,
    ipcRenderer,
    validateTextractorPath,
    readFile: (path: string): string => {
        return fs.readFileSync(path, 'utf8');
    },
    readFileAsync: (path: string): Promise<string> => {
        return fs.promises.readFile(path, 'utf8');
    },
    getBasename: (filePath: string): string => {
        return path.basename(filePath);
    },
    parsePath: (filePath: string): path.ParsedPath => {
        return path.parse(filePath);
    },
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
        ipcRenderer.invoke('child-process.exec-file', path);
    },
    checkTTBridgeStatus: (textractorExePath: string): TextractorStatus => {
        const textractorDirectory = path.dirname(textractorExePath);
        if (!checkExtensionFileExistence(textractorDirectory)) {
            return TextractorStatus.ERROR;
        }

        if (!checkExtensionSpecifiedInList(textractorDirectory)) {
            return TextractorStatus.ERROR;
        }

        return TextractorStatus.SUCCESS;
    },
    installTTBridge: async (textractorExePath: string, type: 'x86' | 'x64'): Promise<TextractorStatus> => {
        const textractorDirectory = path.dirname(textractorExePath);

        const zipDownloadUrl = type === 'x86'
            ? TTBRIDGE_X86_DOWNLOAD_URL
            : TTBRIDGE_X64_DOWNLOAD_URL;

        const tempDirectory = path.resolve('.', 'tmp');
        const currentTempPath = path.resolve(tempDirectory, `${TTBRIDGE_EXTENSION_NAME}_${type}__${v4()}`);
        const extensionZipPath = path.resolve(currentTempPath, `win_${type}.zip`);

        fs.mkdirSync(currentTempPath, {recursive: true});

        try {
            await downloadFile(zipDownloadUrl, extensionZipPath);

            const extractedFiles = await decompress(extensionZipPath, textractorDirectory);
            if (!extractedFiles.length) {
                throw new Error('No extracted files');
            }
        } finally {
            fs.rmSync(currentTempPath, {recursive: true, force: true});
        }

        const extensionsFilePath = path.resolve(textractorDirectory, EXTENSIONS_FILE);
        if (!checkExtensionSpecifiedInList(textractorDirectory)) {
            if (fs.existsSync(extensionsFilePath)) {
                fs.appendFileSync(extensionsFilePath, `${TTBRIDGE_EXTENSION_NAME}>`);
            } else {
                fs.writeFileSync(extensionsFilePath, `${TTBRIDGE_EXTENSION_NAME}>`, {encoding: 'utf8'})
            }
        }

        return TextractorStatus.SUCCESS;
    }
};

export type SettingsNodeApi = typeof nodeApi;

contextBridge.exposeInMainWorld(
    'nodeApi',
    nodeApi
)

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('console-method', (event, { method, args }) => {
        if (typeof (console as any)[method] === 'function') {
            (console as any)[method](...args);
        } else {
            console.warn(`Trying to call an unsupported method '${method}' on console`);
        }
    });

    ipcRenderer.on('active-profile-changed', (event, activeProfileId: string | undefined) => {
        console.log('settings#ipcRenderer.on(\'active-profile-changed\')', activeProfileId);

        window.dispatchEvent(new ActiveProfileChangedEvent({
            activeProfileId
        }));
    });

    ipcRenderer.on('appearance-settings-changed', (event: IpcRendererEvent, appearanceKey: keyof AppearanceConfig, config: AppearanceConfig[keyof AppearanceConfig], sourceId?: string) => {
        console.log('settings#ipcRenderer.on(\'appearance-settings-changed\')', {appearanceKey, config});

        window.dispatchEvent(new AppearanceSettingsChangedEvent({
            appearanceKey, config, sourceId
        }));
    });
});

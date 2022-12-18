import {TextractorStatus} from './tabs/settingsTextractor/types';

export interface TextractorPath {
    path: string;
    status: TextractorStatus;
}

export interface TextractorPaths {
    x86?: TextractorPath;
    x64?: TextractorPath;
}

export interface TTBridge {
    status: TextractorStatus;
    isInstalling?: boolean;
}

export type GetTextractorPaths = (type: 'x86' | 'x64', path: string, canAutofillAnother: boolean) => TextractorPaths;

export type ValidateTextractorPath = (exePath: string) => TextractorStatus;
import React, {FC, useState} from 'react';
import {Button, Space} from 'antd';
import TextractorPathPicker from './settingsTextractor/TextractorPathPicker';
import {TextractorStatus} from './settingsTextractor/types';
import {TextractorPath} from '../types';
import {useDidMount} from 'rooks';
import {StoreKeys} from '../../../constants/store-keys';
import type {SettingsNodeApi} from '../preload';

const {
    store,
    getTextractorPaths,
    validateTextractorPath,
    exec
} = (window as any).nodeApi as SettingsNodeApi;

const SettingsTextractor: FC = () => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const [pathX86, setPathX86] = useState<TextractorPath>();
    const [pathX64, setPathX64] = useState<TextractorPath>();

    useDidMount(async () => {
        const savedX86 = await store.get<string | undefined>(StoreKeys.TEXTRACTOR_X86_PATH);
        const savedX64 = await store.get<string | undefined>(StoreKeys.TEXTRACTOR_X64_PATH);

        if (savedX86 != null) {
            setPathX86({
                path: savedX86,
                status: validateTextractorPath(savedX86)
            });
        }
        if (savedX64 != null) {
            setPathX64({
                path: savedX64,
                status: validateTextractorPath(savedX64)
            });
        }

        setIsInitialized(true);
    });

    const handlePathChange = (pathType: 'x86' | 'x64') => (path: string) => {
        const anotherPath = pathType === 'x86' ? pathX64 : pathX86;

        const paths = getTextractorPaths(pathType, path, !anotherPath?.path?.trim());
        console.log('PATHS', paths);
        if (paths.x86) {
            setPathX86(paths.x86);
            store.set(StoreKeys.TEXTRACTOR_X86_PATH, paths.x86.path);
        }
        if (paths.x64) {
            setPathX64(paths.x64);
            store.set(StoreKeys.TEXTRACTOR_X64_PATH, paths.x64.path);
        }
    };

    const handleTextractorRun = (path: string | undefined) => () => {
        if (!path) {
            return;
        }

        exec(path);
    };

    if (!isInitialized) {
        return null;
    }

    return (
        <div className="settings-tab__textractor">
            <Space size="large" className="textractor-heading-container">
                <h2 className="textractor-heading">Textractor</h2>
                <Space>
                    <Button
                        type="primary"
                        disabled={pathX86?.status !== TextractorStatus.SUCCESS}
                        onClick={handleTextractorRun(pathX86?.path)}
                    >
                        Run x86
                    </Button>
                    <Button
                        type="primary"
                        disabled={pathX64?.status !== TextractorStatus.SUCCESS}
                        onClick={handleTextractorRun(pathX64?.path)}
                    >
                        Run x64
                    </Button>
                </Space>
            </Space>

            <TextractorPathPicker
                label="Path to Textractor x86"
                example="C:\Example\Textractor\x86\Textractor.exe"
                value={pathX86?.path}
                onChange={handlePathChange('x86')}
                status={pathX86?.status}
            />

            <TextractorPathPicker
                label="Path to Textractor x64"
                example="C:\Example\Textractor\x64\Textractor.exe"
                value={pathX64?.path}
                onChange={handlePathChange('x64')}
                status={pathX64?.status}
            />
        </div>
    );
};

export default SettingsTextractor;
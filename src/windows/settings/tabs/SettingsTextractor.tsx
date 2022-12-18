import React, {FC, useState} from 'react';
import {Button, Space} from 'antd';
import TextractorPathPicker from './settingsTextractor/TextractorPathPicker';
import {TextractorStatus} from './settingsTextractor/types';
import {TextractorPath, TTBridge} from '../types';
import {useDidMount} from 'rooks';
import {StoreKeys} from '../../../constants/store-keys';
import type {SettingsNodeApi} from '../preload';
import TextractorStatusIcon from '../components/TextractorStatusIcon';

const {
    store,
    getTextractorPaths,
    validateTextractorPath,
    exec,
    checkTTBridgeStatus,
    installTTBridge
} = (window as any).nodeApi as SettingsNodeApi;

const checkTTBridgeByPath = (textractor: TextractorPath | undefined): TTBridge => {
    if (textractor?.status !== TextractorStatus.SUCCESS) {
        return {status: TextractorStatus.ERROR};
    }

    const status = checkTTBridgeStatus(textractor.path);
    return {status};
};

const SettingsTextractor: FC = () => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const [pathX86, setPathX86] = useState<TextractorPath>();
    const [pathX64, setPathX64] = useState<TextractorPath>();

    const [ttbridgeX86, setTtbridgeX86] = useState<TTBridge>();
    const [ttbridgeX64, setTtbridgeX64] = useState<TTBridge>();

    useDidMount(async () => {
        const savedX86 = await store.get<string | undefined>(StoreKeys.TEXTRACTOR_X86_PATH);
        const savedX64 = await store.get<string | undefined>(StoreKeys.TEXTRACTOR_X64_PATH);

        if (savedX86 != null) {
            const newPathX86: TextractorPath = {
                path: savedX86,
                status: validateTextractorPath(savedX86)
            };
            setPathX86(newPathX86);
            setTtbridgeX86(checkTTBridgeByPath(newPathX86));
        }
        if (savedX64 != null) {
            const newPathX64: TextractorPath = {
                path: savedX64,
                status: validateTextractorPath(savedX64)
            };
            setPathX64(newPathX64);
            setTtbridgeX64(checkTTBridgeByPath(newPathX64));
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
            setTtbridgeX86(checkTTBridgeByPath(paths.x86));
        }

        if (paths.x64) {
            setPathX64(paths.x64);
            store.set(StoreKeys.TEXTRACTOR_X64_PATH, paths.x64.path);
            setTtbridgeX64(checkTTBridgeByPath(paths.x64));
        }
    };

    const handleTextractorRun = (path: string | undefined) => () => {
        if (!path) {
            return;
        }

        exec(path);
    };

    const handleTTBridgeInstall = (pathType: 'x86' | 'x64') => async () => {
        const path = pathType === 'x86' ? pathX86 : pathX64;
        const setTtbridge = pathType === 'x86' ? setTtbridgeX86 : setTtbridgeX64;

        if (path?.status !== TextractorStatus.SUCCESS) {
            return;
        }

        setTtbridge(ttbridge => ({
            status: ttbridge?.status ?? TextractorStatus.ERROR,
            isInstalling: true
        }));

        try {
            const result = await installTTBridge(path.path, pathType);
            setTtbridge({status: result});
        } catch (error) {
            setTtbridge(ttbridge => ({
                status: ttbridge?.status ?? TextractorStatus.ERROR,
                isInstalling: false
            }));
        }
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

            <h2 className="ttbridge-heading">Textractor Translator Bridge</h2>

            <div>Required to send sentences to Textractor Translator</div>

            <h3 className="ttbridge-version-heading">TTBridge x86</h3>
            <Space>
                <Button
                    type={ttbridgeX86?.status === TextractorStatus.SUCCESS ? 'default' : 'primary'}
                    disabled={pathX86?.status !== TextractorStatus.SUCCESS}
                    onClick={handleTTBridgeInstall('x86')}
                    loading={ttbridgeX86?.isInstalling}
                >
                    Install
                </Button>
                <Space>
                    <TextractorStatusIcon status={ttbridgeX86?.status}/>
                    {ttbridgeX86?.status === TextractorStatus.SUCCESS ? 'Installed' : ttbridgeX86?.status === TextractorStatus.ERROR ? 'Not installed' : null}
                </Space>
            </Space>

            <h3 className="ttbridge-version-heading">TTBridge x64</h3>
            <Space>
                <Button
                    type={ttbridgeX64?.status === TextractorStatus.SUCCESS ? 'default' : 'primary'}
                    disabled={pathX64?.status !== TextractorStatus.SUCCESS}
                    onClick={handleTTBridgeInstall('x64')}
                    loading={ttbridgeX64?.isInstalling}
                >
                    Install
                </Button>
                <Space>
                    <TextractorStatusIcon status={ttbridgeX64?.status}/>
                    {ttbridgeX64?.status === TextractorStatus.SUCCESS ? 'Installed' : ttbridgeX64?.status === TextractorStatus.ERROR ? 'Not installed' : null}
                </Space>
            </Space>
        </div>
    );
};

export default SettingsTextractor;
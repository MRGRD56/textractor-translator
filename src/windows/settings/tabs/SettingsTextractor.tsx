import React, {FC, useMemo, useState} from 'react';
import {Button, Input, Space, Tooltip} from 'antd';
import {ElectronStore} from '../../../electron-store/electronStoreShared';
import {FolderOpenFilled} from '@ant-design/icons';
import TextractorPathPicker from './settingsTextractor/TextractorPathPicker';
import {TextractorStatus} from './settingsTextractor/types';

const store: ElectronStore = (window as any).nodeApi.store;

const SettingsTextractor: FC = () => {
    const [pathX86, setPathX86] = useState<string>();
    const [pathX64, setPathX64] = useState<string>();

    const statusX86 = useMemo(() => {
        return TextractorStatus.SUCCESS;
    }, [pathX86]);

    const statusX64 = useMemo(() => {
        return TextractorStatus.ERROR;
    }, [pathX64]);

    return (
        <div className="settings-tab__textractor">
            <Space size="large" className="textractor-heading-container">
                <h2 className="textractor-heading">Textractor</h2>
                <Space>
                    <Button type="primary" disabled={statusX86 !== TextractorStatus.SUCCESS}>Run x86</Button>
                    <Button type="primary" disabled={statusX64 !== TextractorStatus.SUCCESS}>Run x64</Button>
                </Space>
            </Space>

            <TextractorPathPicker
                label="Path to Textractor x86"
                example="C:\Example\Textractor\x86\Textractor.exe"
                value={pathX86}
                onChange={setPathX86}
                status={statusX86}
            />

            <TextractorPathPicker
                label="Path to Textractor x64"
                example="C:\Example\Textractor\x64\Textractor.exe"
                value={pathX64}
                onChange={setPathX64}
                status={statusX64}
            />
        </div>
    );
};

export default SettingsTextractor;
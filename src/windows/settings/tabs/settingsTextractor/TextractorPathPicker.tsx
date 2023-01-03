import React, {FC} from 'react';
import {Button, Checkbox, Input, Space} from 'antd';
import {FolderOpenFilled} from '@ant-design/icons';
import {TextractorStatus} from './types';
import showOpenDialogSync from '../../utils/showOpenDialogSync';
import TextractorStatusIcon from '../../components/TextractorStatusIcon';

interface Props {
    label: string;
    example: string;
    value: string | undefined;
    onChange: (value: string) => void;
    status: TextractorStatus | undefined;
    isAutorun: boolean;
    onAutorunChange: (isAutorun: boolean) => void;
}

const TextractorPathPicker: FC<Props> = ({label, example, value, onChange, status, isAutorun, onAutorunChange}) => {
    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.value);
    };

    const handlePickPath = async () => {
        const path = await showOpenDialogSync({
            properties: ['openFile'],
            filters: [
                {
                    name: 'Textractor.exe',
                    extensions: ['exe']
                },
                {
                    name: 'All Files',
                    extensions: ['*']
                }
            ]
        });

        if (path && path[0]) {
            onChange(path[0]);
        }
    };

    return (
        <div>
            <Space>
                <div>{label}</div>
                <TextractorStatusIcon status={status}/>
            </Space>
            <Input.Group compact className="textractor-path-input-container">
                <Input
                    placeholder={example}
                    className="textractor-path-input"
                    value={value}
                    onChange={handleChangeText}
                    readOnly
                />
                <Button icon={<FolderOpenFilled />} onClick={handlePickPath}/>
            </Input.Group>
            <Checkbox
                style={{marginTop: '2px'}}
                disabled={status !== TextractorStatus.SUCCESS}
                checked={isAutorun}
                onChange={e => onAutorunChange(e.target.checked)}
            >
                Autorun
            </Checkbox>
        </div>
    );
};

export default TextractorPathPicker;
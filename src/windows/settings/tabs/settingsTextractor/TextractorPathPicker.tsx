import React, {FC} from 'react';
import {Button, Input, Space, Typography} from 'antd';
import {CheckOutlined, CloseOutlined, FolderOpenFilled} from '@ant-design/icons';
import {TextractorStatus} from './types';
import showOpenDialogSync from '../../utils/showOpenDialogSync';

interface Props {
    label: string;
    example: string;
    value: string | undefined;
    onChange: (value: string) => void;
    status: TextractorStatus | undefined;
}

const TextractorPathPicker: FC<Props> = ({label, example, value, onChange, status}) => {
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
                {status === TextractorStatus.SUCCESS && <Typography.Text type="success"><CheckOutlined /></Typography.Text>}
                {status === TextractorStatus.ERROR && <Typography.Text type="danger"><CloseOutlined /></Typography.Text>}
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
        </div>
    );
};

export default TextractorPathPicker;
import React, {FC} from 'react';
import {TextractorStatus} from '../tabs/settingsTextractor/types';
import {Typography} from 'antd';
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';

interface Props {
    status: TextractorStatus | undefined;
}

const TextractorStatusIcon: FC<Props> = ({status}) => {
    return (
        <>
            {status === TextractorStatus.SUCCESS && <Typography.Text type="success"><CheckOutlined /></Typography.Text>}
            {status === TextractorStatus.ERROR && <Typography.Text type="danger"><CloseOutlined /></Typography.Text>}
        </>
    );
};

export default React.memo(TextractorStatusIcon);
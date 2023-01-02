import React, {FC} from 'react';
import {Space} from 'antd';

const SettingsAbout: FC = () => {
    return (
        <Space direction="vertical" className="settings-tab__about">
            <h1>Textractor Translator{' '}
                <span className="app-author-container">by <a href="https://github.com/MRGRD56/textractor-translator" target="_blank">MRGRD56</a></span>
            </h1>

            <img src="/assets/textractor-translator.png" alt="Textractor Translator" className="the-app-picture"/>
        </Space>
    );
};

export default SettingsAbout;
import React, {FC} from 'react';
import {Checkbox, Input, Radio, Slider} from 'antd';

const SettingsAppearance: FC = () => {
    return (
        <div className="settings-appearance">
            <label>
                <div>
                    Main window drag mode
                </div>
                <Radio.Group value="ENTIRE_WINDOW">
                    <Radio value="ENTIRE_WINDOW">Entire window</Radio>
                    <Radio value="TOP_PANEL">Top panel</Radio>
                </Radio.Group>
            </label>

            <label>
                Main window background color
                <Input/>
            </label>

            <label>
                Main window background opacity
                <Slider max={100} value={0.7}/>
            </label>
        </div>
    );
};

export default SettingsAppearance;
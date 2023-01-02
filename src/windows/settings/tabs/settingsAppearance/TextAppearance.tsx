import React, {FC} from 'react';
import {ChangeStateHandler} from '../../../../hooks/useChangeStateHandler';
import TextAppearanceConfig from '../../../../configuration/appearance/TextAppearanceConfig';
import getSettingsNodeApi from '../../utils/getSettingsNodeApi';
import useInstalledFontsOptions from '../../../../hooks/useInstalledFontsOptions';
import InputColor from '../../../../components/inputColor/InputColor';
import {Button, Select, SelectProps, Slider} from 'antd';
import {percentageFormatter, pxFormatter} from '../utils/formatters';
import {ItalicOutlined, UnderlineOutlined} from '@ant-design/icons';

const {ipcRenderer} = getSettingsNodeApi();

interface Props {
    appearance: TextAppearanceConfig;
    onAppearanceChange: ChangeStateHandler<TextAppearanceConfig>;
}

const fontWeightsOptions: SelectProps['options'] = [
    {
        value: 100,
        label: <div style={{fontWeight: 100}}>Thin 100</div>
    },
    {
        value: 200,
        label: <div style={{fontWeight: 200}}>ExtraLight 200</div>
    },
    {
        value: 300,
        label: <div style={{fontWeight: 300}}>Light 300</div>
    },
    {
        value: 400,
        label: <div style={{fontWeight: 400}}>Regular 400</div>
    },
    {
        value: 500,
        label: <div style={{fontWeight: 500}}>Medium 500</div>
    },
    {
        value: 600,
        label: <div style={{fontWeight: 600}}>SemiBold 600</div>
    },
    {
        value: 700,
        label: <div style={{fontWeight: 700}}>Bold 700</div>
    },
    {
        value: 800,
        label: <div style={{fontWeight: 800}}>ExtraBold 800</div>
    },
    {
        value: 900,
        label: <div style={{fontWeight: 900}}>Black 900</div>
    }
];

const TextAppearance: FC<Props> = ({appearance, onAppearanceChange}) => {
    const fontsOptions = useInstalledFontsOptions(ipcRenderer);

    return (
        <div className="settings-appearance-tab">
            <label>
                <span>Text color</span>
                <InputColor value={appearance.textColor} onChange={onAppearanceChange('textColor')}/>
            </label>

            <label>
                <span>Text opacity</span>
                <Slider min={0} max={100} value={appearance.textOpacity} onChange={onAppearanceChange('textOpacity')} tipFormatter={percentageFormatter}/>
            </label>

            <label>
                <span>Text font</span>
                <Select
                    value={appearance.fontFamily}
                    onChange={onAppearanceChange('fontFamily')}
                    options={fontsOptions}
                    showSearch
                    allowClear
                    placeholder="Inherited"
                />
            </label>

            <label>
                <span>Font size</span>
                <Slider min={10} max={200} value={appearance.fontSize} onChange={onAppearanceChange('fontSize')} tipFormatter={percentageFormatter}/>
            </label>

            <label>
                <span>Text line height</span>
                <Slider min={10} max={200} value={appearance.lineHeight} onChange={onAppearanceChange('lineHeight')} tipFormatter={percentageFormatter}/>
            </label>

            <label>
                <span>Font style</span>
                <Select
                    value={appearance.fontWeight}
                    onChange={onAppearanceChange('fontWeight')}
                    options={fontWeightsOptions}
                />
                
                {/*TODO*/}
                {/*<Button icon={<ItalicOutlined/>}/>*/}
                {/*<Button icon={<UnderlineOutlined/>}/>*/}
            </label>
        </div>
    );
};

export default TextAppearance;
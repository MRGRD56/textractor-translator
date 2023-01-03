import React, {FC} from 'react';
import {ChangeStateHandler} from '../../../../hooks/useChangeStateHandler';
import TextAppearanceConfig from '../../../../configuration/appearance/TextAppearanceConfig';
import getSettingsNodeApi from '../../utils/getSettingsNodeApi';
import useInstalledFontsOptions from '../../../../hooks/useInstalledFontsOptions';
import InputColor from '../../../../components/inputColor/InputColor';
import {Button, Select, SelectProps, Slider, Space} from 'antd';
import {percentageFormatter, pxFormatter} from '../utils/formatters';
import {ItalicOutlined, UnderlineOutlined} from '@ant-design/icons';
import CheckboxButton from '../../../../components/checkboxButton/CheckboxButton';
import InputColorExtended from '../../../../components/inputColor/InputColorExtended';
import MainWindowAppearanceConfig from '../../../../configuration/appearance/MainWindowAppearanceConfig';
import ValueSlider from '../../../../components/valueSlider/ValueSlider';

const {ipcRenderer} = getSettingsNodeApi();

interface Props {
    appearance: TextAppearanceConfig;
    onAppearanceChange: ChangeStateHandler<TextAppearanceConfig>;
    mwAppearance: MainWindowAppearanceConfig;
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

const TextAppearance: FC<Props> = ({appearance, onAppearanceChange, mwAppearance}) => {
    const fontsOptions = useInstalledFontsOptions(ipcRenderer);

    return (
        <div className="settings-appearance-tab">
            <label>
                {/*TODO add clear button*/}
                <span>Text color</span>
                <InputColorExtended
                    value={appearance.textColor} onChange={onAppearanceChange('textColor')} allowClear
                    placeholder={mwAppearance.textColor} placeholderColor={mwAppearance.textColor}
                />
            </label>

            <label>
                <span>Text opacity</span>
                <ValueSlider min={0} max={100} value={appearance.textOpacity} onChange={onAppearanceChange('textOpacity')} tipFormatter={percentageFormatter}/>
            </label>

            <label>
                <span>Text font</span>
                <Select
                    value={appearance.fontFamily}
                    onChange={onAppearanceChange('fontFamily')}
                    options={fontsOptions}
                    showSearch
                    allowClear
                    placeholder={mwAppearance.fontFamily}
                />
            </label>

            <label>
                <span>Font size</span>
                <ValueSlider min={10} max={200} value={appearance.fontSize} onChange={onAppearanceChange('fontSize')} tipFormatter={percentageFormatter}/>
            </label>

            <label>
                <span>Text line height</span>
                <ValueSlider min={10} max={200} value={appearance.lineHeight} onChange={onAppearanceChange('lineHeight')} tipFormatter={percentageFormatter}/>
            </label>

            <label>
                <span>Font style</span>
                <div className="flex-row-100">
                    <Select
                        value={appearance.fontWeight}
                        onChange={onAppearanceChange('fontWeight')}
                        options={fontWeightsOptions}
                        className="flex-row-100-child"
                    />

                    <CheckboxButton icon={<ItalicOutlined/>} checked={appearance.isItalic} onCheckedChange={onAppearanceChange('isItalic')}/>
                    <CheckboxButton icon={<UnderlineOutlined/>} checked={appearance.isUnderlined} onCheckedChange={onAppearanceChange('isUnderlined')}/>
                </div>
            </label>
        </div>
    );
};

export default TextAppearance;
import React, {FC} from 'react';
import {ChangeStateHandler} from '../../../../hooks/useChangeStateHandler';
import TextAppearanceConfig, {TextBackgroundType} from '../../../../configuration/appearance/TextAppearanceConfig';
import getSettingsNodeApi from '../../utils/getSettingsNodeApi';
import useInstalledFontsOptions from '../../../../hooks/useInstalledFontsOptions';
import {Checkbox, InputNumber, Select, SelectProps, Tooltip} from 'antd';
import {percentageFormatter, pxFormatter} from '../utils/formatters';
import {
    DownOutlined,
    ItalicOutlined,
    LeftOutlined,
    RightOutlined,
    UnderlineOutlined,
    UpOutlined
} from '@ant-design/icons';
import CheckboxButton from '../../../../components/checkboxButton/CheckboxButton';
import InputColorExtended from '../../../../components/inputColor/InputColorExtended';
import MainWindowAppearanceConfig, {
    TextOutlineType
} from '../../../../configuration/appearance/MainWindowAppearanceConfig';
import ValueSlider from '../../../../components/valueSlider/ValueSlider';
import InputColor from '../../../../components/inputColor/InputColor';

const {ipcRenderer} = getSettingsNodeApi();

interface Props {
    type: 'original' | 'translated';
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

const TextAppearance: FC<Props> = ({type, appearance, onAppearanceChange, mwAppearance}) => {
    const fontsOptions = useInstalledFontsOptions(ipcRenderer);

    return (
        <div className="settings-appearance-tab">
            <div>
                <Checkbox checked={appearance.isDisplayed}
                          onChange={e => onAppearanceChange('isDisplayed')(e.target.checked)}>
                    {type === 'original' ? 'Original text' : type === 'translated' ? 'Translated text' : 'Text'}{' '}visibility
                </Checkbox>
            </div>

            <div>
                <Checkbox disabled={!appearance.isDisplayed} checked={appearance.isDisplayedOnHoverOnly}
                          onChange={e => onAppearanceChange('isDisplayedOnHoverOnly')(e.target.checked)}>
                    Show only on hover
                </Checkbox>
            </div>

            <label>
                <span>Text color</span>
                <InputColorExtended
                    value={appearance.textColor} onChange={onAppearanceChange('textColor')} allowClear
                    placeholder={mwAppearance.textColor} placeholderColor={mwAppearance.textColor}
                />
            </label>

            <label>
                <span>Text opacity</span>
                <ValueSlider min={0} max={100} value={appearance.textOpacity}
                             onChange={onAppearanceChange('textOpacity')} tipFormatter={percentageFormatter}/>
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
                <ValueSlider min={10} max={200} value={appearance.fontSize} onChange={onAppearanceChange('fontSize')}
                             tipFormatter={percentageFormatter}/>
            </label>

            <label>
                <span>Text line height</span>
                <ValueSlider min={10} max={200} value={appearance.lineHeight}
                             onChange={onAppearanceChange('lineHeight')} tipFormatter={percentageFormatter}/>
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

                    <CheckboxButton icon={<ItalicOutlined/>} checked={appearance.isItalic}
                                    onCheckedChange={onAppearanceChange('isItalic')}/>
                    <CheckboxButton icon={<UnderlineOutlined/>} checked={appearance.isUnderlined}
                                    onCheckedChange={onAppearanceChange('isUnderlined')}/>
                </div>
            </label>

            <div className="label">
                <span title="Padding">Inner indents</span>
                <div className="flex-row-100 mwa__arrow-inputs">
                    <Tooltip placement="bottom" title="Top indent">
                        <div className="flex-row-100-child flex-row-100">
                            <UpOutlined className="mwa__arrow-icon mwa__arrow-icon-vertical"/>
                            <InputNumber className="flex-row-100-child mwa__arrow-input"
                                         value={appearance.textPaddingTop ?? 0}
                                         onChange={value => onAppearanceChange('textPaddingTop')(value ?? 0)} min={0}/>
                        </div>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Bottom indent">
                        <div className="flex-row-100-child flex-row-100">
                            <DownOutlined className="mwa__arrow-icon mwa__arrow-icon-vertical"/>
                            <InputNumber className="flex-row-100-child mwa__arrow-input"
                                         value={appearance.textPaddingBottom ?? 0}
                                         onChange={value => onAppearanceChange('textPaddingBottom')(value ?? 0)}
                                         min={0}/>
                        </div>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Left indent">
                        <div className="flex-row-100-child flex-row-100">
                            <LeftOutlined className="mwa__arrow-icon mwa__arrow-icon-horizontal"/>
                            <InputNumber className="flex-row-100-child mwa__arrow-input"
                                         value={appearance.textPaddingLeft ?? 0}
                                         onChange={value => onAppearanceChange('textPaddingLeft')(value ?? 0)} min={0}/>
                        </div>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Right indent">
                        <div className="flex-row-100-child flex-row-100">
                            <RightOutlined className="mwa__arrow-icon mwa__arrow-icon-horizontal"/>
                            <InputNumber className="flex-row-100-child mwa__arrow-input"
                                         value={appearance.textPaddingRight ?? 0}
                                         onChange={value => onAppearanceChange('textPaddingRight')(value ?? 0)}
                                         min={0}/>
                        </div>
                    </Tooltip>
                </div>
            </div>

            <label>
                <span>Background type</span>
                <Select
                    value={appearance.textBackgroundType}
                    onChange={onAppearanceChange('textBackgroundType')}
                    placeholder="None"
                >
                    <Select.Option key={undefined}>None</Select.Option>
                    <Select.Option key={TextBackgroundType.BLOCK}>Block</Select.Option>
                    <Select.Option key={TextBackgroundType.INLINE}>Inline</Select.Option>
                </Select>
            </label>

            {appearance.textBackgroundType ? (
                <>
                    <label>
                        <span>Background color</span>
                        <InputColor value={appearance.textBackgroundColor}
                                    onChange={onAppearanceChange('textBackgroundColor')}/>
                    </label>

                    <label>
                        <span>Background opacity</span>
                        <ValueSlider min={0} max={100} value={appearance.textBackgroundOpacity}
                                     onChange={onAppearanceChange('textBackgroundOpacity')}
                                     tipFormatter={percentageFormatter}/>
                    </label>

                    <label>
                        <span>Border color</span>
                        <InputColor value={appearance.textBorderColor} onChange={onAppearanceChange('textBorderColor')}/>
                    </label>

                    <label>
                        <span>Border opacity</span>
                        <ValueSlider min={0} max={100} value={appearance.textBorderOpacity}
                                     onChange={onAppearanceChange('textBorderOpacity')} tipFormatter={percentageFormatter}/>
                    </label>

                    <label>
                        <span>Border width</span>
                        <ValueSlider min={0} max={20} value={appearance.textBorderThickness}
                                     onChange={onAppearanceChange('textBorderThickness')} tipFormatter={pxFormatter}/>
                    </label>

                    <label>
                        <span>Border roundness</span>
                        <ValueSlider min={0} max={30} value={appearance.textBorderRadius}
                                     onChange={onAppearanceChange('textBorderRadius')} tipFormatter={pxFormatter}/>
                    </label>
                </>
            ) : null}
        </div>
    );
};

export default TextAppearance;
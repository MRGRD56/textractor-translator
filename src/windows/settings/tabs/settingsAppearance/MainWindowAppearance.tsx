import React, {FC} from 'react';
import {InputNumber, Radio, Select, Slider, Tooltip} from 'antd';
import MainWindowAppearanceConfig, {
    MainWindowDragMode, TextOutlineType
} from '../../../../configuration/appearance/MainWindowAppearanceConfig';
import InputColor from '../../../../components/inputColor/InputColor';
import {ChangeStateHandler} from '../../../../hooks/useChangeStateHandler';
import {percentageFormatter, pxFormatter} from '../utils/formatters';
import getSettingsNodeApi from '../../utils/getSettingsNodeApi';
import useInstalledFontsOptions from '../../../../hooks/useInstalledFontsOptions';
import {DownOutlined, LeftOutlined, RightOutlined, UpOutlined} from '@ant-design/icons';
import ValueSlider from '../../../../components/valueSlider/ValueSlider';

const {ipcRenderer} = getSettingsNodeApi();

interface Props {
    appearance: MainWindowAppearanceConfig;
    onAppearanceChange: ChangeStateHandler<MainWindowAppearanceConfig>;
}

const MainWindowAppearance: FC<Props> = ({appearance, onAppearanceChange}) => {
    const fontsOptions = useInstalledFontsOptions(ipcRenderer);

    if (!fontsOptions) {
        return null;
    }

    return (
        <div className="settings-appearance-tab">
            <div className="label">
                <span>
                    Window drag mode
                </span>
                <Radio.Group value={appearance.windowDragMode} onChange={onAppearanceChange('windowDragMode')}>
                    <Radio value={MainWindowDragMode.ENTIRE_WINDOW}>Entire window</Radio>
                    <Radio value={MainWindowDragMode.BACKGROUND}>Background</Radio>
                    <Radio value={MainWindowDragMode.PANEL}>Top panel</Radio>
                </Radio.Group>
            </div>

            <label>
                <span>Background color</span>
                <InputColor value={appearance.backgroundColor} onChange={onAppearanceChange('backgroundColor')}/>
            </label>

            <label>
                <span>Background opacity</span>
                <ValueSlider min={0} max={100} value={appearance.backgroundOpacity} onChange={onAppearanceChange('backgroundOpacity')} tipFormatter={percentageFormatter}/>
            </label>

            <label>
                <span>Border color</span>
                <InputColor value={appearance.borderColor} onChange={onAppearanceChange('borderColor')}/>
            </label>

            <label>
                <span>Border opacity</span>
                <ValueSlider min={0} max={100} value={appearance.borderOpacity} onChange={onAppearanceChange('borderOpacity')} tipFormatter={percentageFormatter}/>
            </label>

            <label>
                <span>Border width</span>
                <ValueSlider min={0} max={20} value={appearance.borderThickness} onChange={onAppearanceChange('borderThickness')} tipFormatter={pxFormatter}/>
            </label>

            <label>
                <span>Border roundness</span>
                <ValueSlider min={0} max={30} value={appearance.borderRadius} onChange={onAppearanceChange('borderRadius')} tipFormatter={pxFormatter}/>
            </label>

            <label>
                <span>Text color</span>
                <InputColor value={appearance.textColor} onChange={onAppearanceChange('textColor')}/>
            </label>

            <label>
                <span>Text font</span>
                <Select
                    value={appearance.fontFamily}
                    onChange={onAppearanceChange('fontFamily')}
                    options={fontsOptions}
                    showSearch
                />
            </label>

            <label>
                <span>Font size</span>
                <ValueSlider min={6} max={50} value={appearance.fontSize} onChange={onAppearanceChange('fontSize')} tipFormatter={pxFormatter}/>
            </label>

            <label>
                <span>Text line height</span>
                <ValueSlider min={10} max={200} value={appearance.lineHeight} onChange={onAppearanceChange('lineHeight')} tipFormatter={percentageFormatter}/>
            </label>

            <div className="label">
                <span title="Padding">Inner indents</span>
                <div className="flex-row-100 mwa__arrow-inputs">
                    <Tooltip placement="bottom" title="Top indent">
                        <div className="flex-row-100-child flex-row-100">
                            <UpOutlined className="mwa__arrow-icon mwa__arrow-icon-vertical"/>
                            <InputNumber className="flex-row-100-child mwa__arrow-input" value={appearance.paddingTop} onChange={value => onAppearanceChange('paddingTop')(value ?? 0)} min={0}/>
                        </div>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Bottom indent">
                        <div className="flex-row-100-child flex-row-100">
                            <DownOutlined className="mwa__arrow-icon mwa__arrow-icon-vertical"/>
                            <InputNumber className="flex-row-100-child mwa__arrow-input" value={appearance.paddingBottom} onChange={value => onAppearanceChange('paddingBottom')(value ?? 0)} min={0}/>
                        </div>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Left indent">
                        <div className="flex-row-100-child flex-row-100">
                            <LeftOutlined className="mwa__arrow-icon mwa__arrow-icon-horizontal"/>
                            <InputNumber className="flex-row-100-child mwa__arrow-input" value={appearance.paddingLeft} onChange={value => onAppearanceChange('paddingLeft')(value ?? 0)} min={0}/>
                        </div>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Right indent">
                        <div className="flex-row-100-child flex-row-100">
                            <RightOutlined className="mwa__arrow-icon mwa__arrow-icon-horizontal"/>
                            <InputNumber className="flex-row-100-child mwa__arrow-input" value={appearance.paddingRight} onChange={value => onAppearanceChange('paddingRight')(value ?? 0)} min={0}/>
                        </div>
                    </Tooltip>
                </div>
            </div>

            <label>
                <span>Text outline</span>
                <Select
                    value={appearance.textOutlineType}
                    onChange={onAppearanceChange('textOutlineType')}
                >
                    <Select.Option key={undefined}>None</Select.Option>
                    <Select.Option key={TextOutlineType.OUTER}>Outer</Select.Option>
                    <Select.Option key={TextOutlineType.INNER}>Inner</Select.Option>
                </Select>
            </label>

            {appearance.textOutlineType ? (
                <>
                    <label>
                        <span>Outline color</span>
                        <InputColor value={appearance.textOutlineColor} onChange={onAppearanceChange('textOutlineColor')}/>
                    </label>

                    <label>
                        <span>Outline width</span>
                        <ValueSlider min={0} max={10} step={0.1} value={appearance.textOutlineThickness} onChange={onAppearanceChange('textOutlineThickness')} tipFormatter={pxFormatter}/>
                    </label>
                </>
            ) : null}
        </div>
    );
};

export default MainWindowAppearance;
import React, {FC} from 'react';
import {Radio, Select, Slider} from 'antd';
import MainWindowAppearanceConfig, {
    MainWindowDragMode
} from '../../../../configuration/appearance/MainWindowAppearanceConfig';
import InputColor from '../../../../components/inputColor/InputColor';
import {ChangeStateHandler} from '../../../../hooks/useChangeStateHandler';
import {percentageFormatter, pxFormatter} from '../utils/formatters';
import getSettingsNodeApi from '../../utils/getSettingsNodeApi';
import useInstalledFontsOptions from '../../../../hooks/useInstalledFontsOptions';

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
            <label>
                <span>
                    Window drag mode
                </span>
                <Radio.Group value={appearance.windowDragMode} onChange={onAppearanceChange('windowDragMode')}>
                    <Radio value={MainWindowDragMode.ENTIRE_WINDOW}>Entire window</Radio>
                    <Radio value={MainWindowDragMode.BACKGROUND}>Background</Radio>
                    <Radio value={MainWindowDragMode.PANEL}>Top panel</Radio>
                </Radio.Group>
            </label>

            <label>
                <span>Background color</span>
                <InputColor value={appearance.backgroundColor} onChange={onAppearanceChange('backgroundColor')}/>
            </label>

            <label>
                <span>Background opacity</span>
                <Slider min={0} max={100} value={appearance.backgroundOpacity} onChange={onAppearanceChange('backgroundOpacity')} tipFormatter={percentageFormatter}/>
            </label>

            <label>
                <span>Border color</span>
                <InputColor value={appearance.borderColor} onChange={onAppearanceChange('borderColor')}/>
            </label>

            <label>
                <span>Border opacity</span>
                <Slider min={0} max={100} value={appearance.borderOpacity} onChange={onAppearanceChange('borderOpacity')} tipFormatter={percentageFormatter}/>
            </label>

            <label>
                <span>Border width</span>
                <Slider min={0} max={20} value={appearance.borderThickness} onChange={onAppearanceChange('borderThickness')} tipFormatter={pxFormatter}/>
            </label>

            <label>
                <span>Border roundness</span>
                <Slider min={0} max={20} value={appearance.borderRadius} onChange={onAppearanceChange('borderRadius')} tipFormatter={pxFormatter}/>
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
                <Slider min={6} max={50} value={appearance.fontSize} onChange={onAppearanceChange('fontSize')} tipFormatter={pxFormatter}/>
            </label>
        </div>
    );
};

export default MainWindowAppearance;
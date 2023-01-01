import React, {FC, ReactNode} from 'react';
import {Radio, Slider, Tabs} from 'antd';
import InputColor from '../../../components/inputColor/InputColor';
import useStoreStateWriter from '../../../hooks/useStoreStateWriter';
import {SettingsNodeApi} from '../preload';
import {StoreKeys} from '../../../constants/store-keys';
import MainWindowAppearanceConfig, {
    defaultMainWindowAppearance,
    MainWindowDragMode
} from '../../../configuration/appearance/MainWindowAppearanceConfig';
import useChangeStateHandler from '../../../hooks/useChangeStateHandler';

const {
    store
} = (window as any).nodeApi as SettingsNodeApi;

const createNumberFormatter = (formatter: (value: number) => ReactNode) => (value: number | undefined): ReactNode => {
    if (value == null) {
        return;
    }

    return formatter(value);
};

const percentageFormatter = createNumberFormatter((value: number) => `${value}%`);
const pxFormatter = createNumberFormatter((value: number) => `${value}px`);

const SettingsAppearance: FC = () => {
    const [mwAppearance, setMwAppearance] = useStoreStateWriter<MainWindowAppearanceConfig>(store, StoreKeys.SETTINGS_APPEARANCE_MAIN_WINDOW, defaultMainWindowAppearance);
    const handleMwAppearanceChange = useChangeStateHandler(setMwAppearance);

    if (!mwAppearance) {
        return null;
    }

    return (
        <div className="settings-appearance">
            <Tabs>
                <Tabs.TabPane tab="Main Window">
                    <div className="settings-appearance-tab">
                        <label>
                            <span>
                                Window drag mode
                            </span>
                            <Radio.Group value={mwAppearance.windowDragMode} onChange={handleMwAppearanceChange('windowDragMode')}>
                                <Radio value={MainWindowDragMode.ENTIRE_WINDOW}>Entire window</Radio>
                                <Radio value={MainWindowDragMode.BACKGROUND}>Background</Radio>
                                <Radio value={MainWindowDragMode.PANEL}>Top panel</Radio>
                            </Radio.Group>
                        </label>

                        <label>
                            <span>Background color</span>
                            <InputColor value={mwAppearance.backgroundColor} onChange={handleMwAppearanceChange('backgroundColor')}/>
                        </label>

                        <label>
                            <span>Background opacity</span>
                            <Slider min={0} max={100} value={mwAppearance.backgroundOpacity} onChange={handleMwAppearanceChange('backgroundOpacity')} tipFormatter={percentageFormatter}/>
                        </label>

                        <label>
                            <span>Border color</span>
                            <InputColor value={mwAppearance.borderColor} onChange={handleMwAppearanceChange('borderColor')}/>
                        </label>

                        <label>
                            <span>Border opacity</span>
                            <Slider min={0} max={100} value={mwAppearance.borderOpacity} onChange={handleMwAppearanceChange('borderOpacity')} tipFormatter={percentageFormatter}/>
                        </label>

                        <label>
                            <span>Border width</span>
                            <Slider min={0} max={20} value={mwAppearance.borderThickness} onChange={handleMwAppearanceChange('borderThickness')} tipFormatter={pxFormatter}/>
                        </label>

                        <label>
                            <span>Border roundness</span>
                            <Slider min={0} max={20} value={mwAppearance.borderRadius} onChange={handleMwAppearanceChange('borderRadius')} tipFormatter={pxFormatter}/>
                        </label>
                    </div>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default SettingsAppearance;
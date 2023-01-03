import React, {FC, ReactNode, useMemo} from 'react';
import {Radio, Slider, Tabs, TabsProps} from 'antd';
import InputColor from '../../../components/inputColor/InputColor';
import useStoreStateWriter from '../../../hooks/useStoreStateWriter';
import {SettingsNodeApi} from '../preload';
import {StoreKeys} from '../../../constants/store-keys';
import MainWindowAppearanceConfig, {
    defaultMainWindowAppearance,
    MainWindowDragMode
} from '../../../configuration/appearance/MainWindowAppearanceConfig';
import useChangeStateHandler from '../../../hooks/useChangeStateHandler';
import generateArray from '../../../utils/generateArray';
import MainWindowAppearance from './settingsAppearance/MainWindowAppearance';
import TextAppearanceConfig, {
    defaultOriginalTextAppearance, defaultTranslatedTextAppearance
} from '../../../configuration/appearance/TextAppearanceConfig';
import TextAppearance from './settingsAppearance/TextAppearance';

const {
    store
} = (window as any).nodeApi as SettingsNodeApi;

const SettingsAppearance: FC = () => {
    const [mwAppearance, setMwAppearance] = useStoreStateWriter<MainWindowAppearanceConfig>(store, StoreKeys.SETTINGS_APPEARANCE_MAIN_WINDOW, defaultMainWindowAppearance);
    const handleMwAppearanceChange = useChangeStateHandler(setMwAppearance);

    const [originalTextAppearance, setOriginalTextAppearance] = useStoreStateWriter<TextAppearanceConfig>(store, StoreKeys.SETTINGS_APPEARANCE_ORIGINAL_TEXT, defaultOriginalTextAppearance);
    const handleOriginalTextAppearanceChange = useChangeStateHandler(setOriginalTextAppearance);

    const [translatedTextAppearance, setTranslatedTextAppearance] = useStoreStateWriter<TextAppearanceConfig>(store, StoreKeys.SETTINGS_APPEARANCE_TRANSLATED_TEXT, defaultTranslatedTextAppearance);
    const handleTranslatedTextAppearanceChange = useChangeStateHandler(setTranslatedTextAppearance);

    const tabs = useMemo<TabsProps['items']>(() => {
        if (!mwAppearance || !originalTextAppearance || !translatedTextAppearance) {
            return;
        }

        return [
            {
                key: 'MAIN_WINDOW',
                label: 'Main Window',
                children: <MainWindowAppearance appearance={mwAppearance} onAppearanceChange={handleMwAppearanceChange}/>
            },
            {
                key: 'ORIGINAL_TEXT',
                label: 'Original Text',
                children: <TextAppearance appearance={originalTextAppearance} onAppearanceChange={handleOriginalTextAppearanceChange} mwAppearance={mwAppearance}/>
            },
            {
                key: 'TRANSLATED_TEXT',
                label: 'Translated Text',
                children: <TextAppearance appearance={translatedTextAppearance} onAppearanceChange={handleTranslatedTextAppearanceChange} mwAppearance={mwAppearance}/>
            }
        ];
    }, [mwAppearance, handleMwAppearanceChange, originalTextAppearance, handleOriginalTextAppearanceChange, translatedTextAppearance, handleTranslatedTextAppearanceChange]);

    if (!mwAppearance) {
        return null;
    }

    return (
        <div className="settings-appearance">
            <Tabs items={tabs}/>
        </div>
    );
};

export default SettingsAppearance;
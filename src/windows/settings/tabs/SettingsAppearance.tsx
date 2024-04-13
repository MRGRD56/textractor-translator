import React, {FC, useCallback, useMemo, useState} from 'react';
import {Tabs, TabsProps} from 'antd';
import useAppearanceConfig from '../../../hooks/useAppearanceConfig';
import {StoreKeys} from '../../../constants/store-keys';
import MainWindowAppearanceConfig from '../../../configuration/appearance/MainWindowAppearanceConfig';
import useChangeStateHandler from '../../../hooks/useChangeStateHandler';
import MainWindowAppearance from './settingsAppearance/MainWindowAppearance';
import TextAppearanceConfig from '../../../configuration/appearance/TextAppearanceConfig';
import TextAppearance from './settingsAppearance/TextAppearance';
import SavedProfiles from '../profiles/SavedProfiles';
import {ActiveProfileChangedEvent} from '../../../types/custom-events';
import {useDidMount, useWillUnmount} from 'rooks';
import initializeSavedProfiles from '../../../configuration/initializeSavedProfiles';
import getSettingsNodeApi from '../utils/getSettingsNodeApi';
import AppearanceProfiles from './settingsAppearance/AppearanceProfiles';
import styles from './SettingsAppearance.module.scss';
import classNames from 'classnames';
import CustomCssAppearance from './settingsAppearance/CustomCssAppearance';

const {store} = getSettingsNodeApi();

const SettingsAppearance: FC = () => {
    const [savedProfiles, setSavedProfiles] = useState<SavedProfiles>();
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const activeProfileChangedCallback = useCallback((event: ActiveProfileChangedEvent) => {
        const activeProfileId = event.detail.activeProfileId;

        setSavedProfiles(savedProfiles => {
            if (!savedProfiles) {
                return savedProfiles;
            }

            if (savedProfiles.activeProfileId === activeProfileId) {
                return savedProfiles;
            }

            return {
                ...savedProfiles,
                activeProfileId
            };
        });
    }, []);

    useDidMount(async () => {
        const loadedSavedProfiles: SavedProfiles = await store.get(StoreKeys.SAVED_PROFILES) ?? initializeSavedProfiles(store);
        setSavedProfiles(loadedSavedProfiles);

        window.addEventListener('active-profile-changed', activeProfileChangedCallback);

        setIsInitialized(true);
    });

    useWillUnmount(() => {
        window.removeEventListener('active-profile-changed', activeProfileChangedCallback);
    });

    const {
        value: mwAppearance,
        setValue: setMwAppearance
    } = useAppearanceConfig<MainWindowAppearanceConfig>(store, 'mainWindow', savedProfiles);
    const handleMwAppearanceChange = useChangeStateHandler(setMwAppearance);

    const {
        value: originalTextAppearance,
        setValue: setOriginalTextAppearance
    } = useAppearanceConfig<TextAppearanceConfig>(store, 'originalText', savedProfiles);
    const handleOriginalTextAppearanceChange = useChangeStateHandler(setOriginalTextAppearance);

    const {
        value: translatedTextAppearance,
        setValue: setTranslatedTextAppearance
    } = useAppearanceConfig<TextAppearanceConfig>(store, 'translatedText', savedProfiles);
    const handleTranslatedTextAppearanceChange = useChangeStateHandler(setTranslatedTextAppearance);

    const {
        initialValue: initialCustomCssAppearance,
        setValue: setCustomCssAppearance
    } = useAppearanceConfig<string>(store, 'customCss', savedProfiles);

    const tabs = useMemo<TabsProps['items']>(() => {
        if (!mwAppearance || !originalTextAppearance || !translatedTextAppearance) {
            return;
        }

        return [
            {
                key: 'MAIN_WINDOW',
                label: 'Main Window',
                children: <MainWindowAppearance appearance={mwAppearance}
                                                onAppearanceChange={handleMwAppearanceChange}/>
            },
            {
                key: 'ORIGINAL_TEXT',
                label: 'Original Text',
                children: <TextAppearance type="original" appearance={originalTextAppearance}
                                          onAppearanceChange={handleOriginalTextAppearanceChange}
                                          mwAppearance={mwAppearance}/>
            },
            {
                key: 'TRANSLATED_TEXT',
                label: 'Translated Text',
                children: <TextAppearance type="translated" appearance={translatedTextAppearance}
                                          onAppearanceChange={handleTranslatedTextAppearanceChange}
                                          mwAppearance={mwAppearance}/>
            },
            {
                key: 'CUSTOM_CSS',
                label: 'Custom CSS',
                children: <CustomCssAppearance initialCustomCss={initialCustomCssAppearance}
                                               onCustomCssChange={setCustomCssAppearance}/>
            },
            {
                key: 'APPEARANCE_PROFILES',
                label: (
                    <span className={styles.profilesTabTitle}>
                        <span className={styles.titleIconWrapper}>
                            <span className={classNames('material-symbols-rounded', styles.titleIcon)}>
                                build
                            </span>
                        </span>
                        <span>Profiles</span>
                    </span>
                ),
                children: <AppearanceProfiles/>
            }
        ];
    }, [
        mwAppearance,
        handleMwAppearanceChange,
        originalTextAppearance,
        handleOriginalTextAppearanceChange,
        translatedTextAppearance,
        handleTranslatedTextAppearanceChange,
        initialCustomCssAppearance,
        setCustomCssAppearance
    ]);

    if (!mwAppearance || !isInitialized) {
        return null;
    }

    return (
        <div className="settings-appearance">
            <Tabs items={tabs} className="settings-appearance-tabs"/>
        </div>
    );
};

export default SettingsAppearance;
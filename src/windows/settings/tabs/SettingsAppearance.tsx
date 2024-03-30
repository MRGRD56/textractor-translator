import React, {FC, useCallback, useMemo, useState} from 'react';
import {Tabs, TabsProps} from 'antd';
import useStoreStateWriter from '../../../hooks/useStoreStateWriter';
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

    const [mwAppearance, setMwAppearance] = useStoreStateWriter<MainWindowAppearanceConfig>(store, 'mainWindow', savedProfiles);
    const handleMwAppearanceChange = useChangeStateHandler(setMwAppearance);

    const [originalTextAppearance, setOriginalTextAppearance] = useStoreStateWriter<TextAppearanceConfig>(store, 'originalText', savedProfiles);
    const handleOriginalTextAppearanceChange = useChangeStateHandler(setOriginalTextAppearance);

    const [translatedTextAppearance, setTranslatedTextAppearance] = useStoreStateWriter<TextAppearanceConfig>(store, 'translatedText', savedProfiles);
    const handleTranslatedTextAppearanceChange = useChangeStateHandler(setTranslatedTextAppearance);

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
    }, [mwAppearance, handleMwAppearanceChange, originalTextAppearance, handleOriginalTextAppearanceChange, translatedTextAppearance, handleTranslatedTextAppearanceChange]);

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
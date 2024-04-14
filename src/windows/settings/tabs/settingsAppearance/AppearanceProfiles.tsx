import React, {FC, useCallback, useEffect, useState} from 'react';
import SavedProfiles from '../../profiles/SavedProfiles';
import {StoreKeys} from '../../../../constants/store-keys';
import initializeSavedProfiles from '../../../../configuration/initializeSavedProfiles';
import getSettingsNodeApi from '../../utils/getSettingsNodeApi';
import {COMMON_PROFILE_ID} from '../../profiles/constants';
import {Button, Checkbox, Select} from 'antd';
import classNames from 'classnames';
import styles from '../SettingsAppearance.module.scss';
import useStoreStateReader from '../../../../hooks/useStoreStateReader';
import {CheckOutlined} from '@ant-design/icons';
import AppearanceConfig, {getAppearanceConfigKey} from '../../../../configuration/appearance/AppearanceConfig';

const {store, ipcRenderer} = getSettingsNodeApi();

const emitAppearanceSettingsChanged = (config: AppearanceConfig, key: keyof AppearanceConfig): Promise<void> => {
    return ipcRenderer.invoke('appearance-settings-changed', key, config[key]);
};

const AppearanceProfiles: FC = () => {
    const savedProfiles = useStoreStateReader<SavedProfiles>(store, StoreKeys.SAVED_PROFILES, () => initializeSavedProfiles(store));

    const [sourceProfileId, setSourceProfileId] = useState<string>();
    const [destinationProfileId, setDestinationProfileId] = useState<string>();

    const [isMainWindowTransferred, setIsMainWindowTransferred] = useState<boolean>(true);
    const [isOriginalTextTransferred, setIsOriginalTextTransferred] = useState<boolean>(true);
    const [isTranslatedTextTransferred, setIsTranslatedTextTransferred] = useState<boolean>(true);
    const [isCustomCssTransferred, setIsCustomCssTransferred] = useState<boolean>(true);

    const [isDoneTransferring, setIsDoneTransferring] = useState<boolean>(false);

    useEffect(() => {
        if (!savedProfiles) {
            return;
        }

        setSourceProfileId(sourceProfileId => sourceProfileId ?? COMMON_PROFILE_ID);
        setDestinationProfileId(savedProfiles.activeProfileId || COMMON_PROFILE_ID);
    }, [savedProfiles === undefined, savedProfiles?.activeProfileId])

    useEffect(() => {
        setIsDoneTransferring(false);
    }, [sourceProfileId, destinationProfileId, isMainWindowTransferred, isOriginalTextTransferred, isTranslatedTextTransferred]);

    const handleTransferProfile = useCallback(async () => {
        if (savedProfiles === undefined || sourceProfileId === undefined || destinationProfileId === undefined) {
            return;
        }

        const isActiveProfileUpdated = destinationProfileId === savedProfiles.activeProfileId;

        const sourceAppearanceKey = getAppearanceConfigKey(sourceProfileId);
        const destinationAppearanceKey = getAppearanceConfigKey(destinationProfileId);

        const sourceAppearanceConfig = await store.get<AppearanceConfig>(sourceAppearanceKey);
        const destinationAppearanceConfig = await store.get<AppearanceConfig>(destinationAppearanceKey);

        const mergedConfig: AppearanceConfig = {...destinationAppearanceConfig};
        if (isMainWindowTransferred) {
            mergedConfig.mainWindow = sourceAppearanceConfig.mainWindow;
            if (isActiveProfileUpdated) {
                await emitAppearanceSettingsChanged(mergedConfig, 'mainWindow');
            }
        }
        if (isOriginalTextTransferred) {
            mergedConfig.originalText = sourceAppearanceConfig.originalText;
            if (isActiveProfileUpdated) {
                await emitAppearanceSettingsChanged(mergedConfig, 'originalText');
            }
        }
        if (isTranslatedTextTransferred) {
            mergedConfig.translatedText = sourceAppearanceConfig.translatedText;
            if (isActiveProfileUpdated) {
                await emitAppearanceSettingsChanged(mergedConfig, 'translatedText');
            }
        }
        if (isCustomCssTransferred) {
            mergedConfig.customCss = sourceAppearanceConfig.customCss;
            if (isActiveProfileUpdated) {
                await emitAppearanceSettingsChanged(mergedConfig, 'customCss');
            }
        }

        store.set(destinationAppearanceKey, mergedConfig);

        setIsDoneTransferring(true);
    }, [savedProfiles, sourceProfileId, destinationProfileId, isMainWindowTransferred, isOriginalTextTransferred, isTranslatedTextTransferred]);

    if (!savedProfiles) {
        return null;
    }

    return (
        <div className={styles.appearanceProfilesContainer}>
            <h2>Copy profile appearance settings</h2>

            <div className={styles.appearanceProfilesForm}>
                <div className={styles.profilesSelects}>
                    <Select
                        value={sourceProfileId}
                        onChange={setSourceProfileId}
                        style={{minWidth: '140px'}}
                    >
                        {savedProfiles.profiles
                            .map(profile => (
                                <Select.Option key={profile.id}>{profile.name}</Select.Option>
                            ))}
                    </Select>
                    <span className={classNames('material-symbols-rounded', styles.profilesArrow)}>
                        arrow_right_alt
                    </span>
                    <Select
                        value={destinationProfileId}
                        onChange={setDestinationProfileId}
                        style={{minWidth: '140px'}}
                    >
                        {savedProfiles.profiles
                            .map(profile => (
                                <Select.Option key={profile.id}>{profile.name}</Select.Option>
                            ))}
                    </Select>
                </div>

                <div>
                    <div>
                        <Checkbox
                            checked={isMainWindowTransferred}
                            onChange={event => setIsMainWindowTransferred(event.target.checked)}
                        >
                            Main Window
                        </Checkbox>
                    </div>

                    <div>
                        <Checkbox
                            checked={isOriginalTextTransferred}
                            onChange={event => setIsOriginalTextTransferred(event.target.checked)}
                        >
                            Original Text
                        </Checkbox>
                    </div>

                    <div>
                        <Checkbox
                            checked={isTranslatedTextTransferred}
                            onChange={event => setIsTranslatedTextTransferred(event.target.checked)}
                        >
                            Translated Text
                        </Checkbox>
                    </div>

                    <div>
                        <Checkbox
                            checked={isCustomCssTransferred}
                            onChange={event => setIsCustomCssTransferred(event.target.checked)}
                        >
                            Custom CSS
                        </Checkbox>
                    </div>
                </div>

                <Button
                    type="primary"
                    icon={isDoneTransferring ? <CheckOutlined/> : undefined}
                    onClick={handleTransferProfile}
                    disabled={sourceProfileId === destinationProfileId}
                >
                    Copy settings
                </Button>
            </div>
        </div>
    );
};

export default AppearanceProfiles;
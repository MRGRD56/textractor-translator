import React, {FC, useCallback, useState} from 'react';
import {Select, Tabs, TabsProps} from 'antd';
import SettingsProfiles from './tabs/SettingsProfiles';
import SettingsTextractor from './tabs/SettingsTextractor';
import {useDidMount} from 'rooks';
import {StoreKeys} from '../../constants/store-keys';
import SettingsAppearance from './tabs/SettingsAppearance';
import SettingsAbout from './tabs/SettingsAbout';
import {defaultSettingsTab, SettingsTab} from './types';
import SavedProfiles from './profiles/SavedProfiles';
import initializeSavedProfiles from '../../configuration/initializeSavedProfiles';
import {COMMON_PROFILE_ID} from './profiles/constants';
import getSettingsNodeApi from './utils/getSettingsNodeApi';
import useStoreStateReader from '../../hooks/useStoreStateReader';

const tabsItems: TabsProps['items'] = [
    {
        key: SettingsTab.PROFILES,
        label: 'Profiles',
        children: <SettingsProfiles/>
    },
    {
        key: SettingsTab.APPEARANCE,
        label: 'Appearance',
        children: <SettingsAppearance/>
    },
    {
        key: SettingsTab.TEXTRACTOR,
        label: 'Textractor',
        children: <SettingsTextractor/>
    },
    {
        key: SettingsTab.ABOUT,
        label: 'About',
        children: <SettingsAbout/>
    }
];

const {store, ipcRenderer} = getSettingsNodeApi();

const Settings: FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>();
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const savedProfiles = useStoreStateReader<SavedProfiles>(store, StoreKeys.SAVED_PROFILES, () => initializeSavedProfiles(store));

    useDidMount(async () => {
        const savedActiveTab = await store.get<SettingsTab>(StoreKeys.SETTINGS_TAB, defaultSettingsTab);
        setActiveTab(savedActiveTab);

        setIsInitialized(true);
    });

    const handleActiveTabChange = useCallback((newActiveTab: string) => {
        setActiveTab(newActiveTab as SettingsTab);
        store.set(StoreKeys.SETTINGS_TAB, newActiveTab);
    }, []);

    const handleProfileActivate = useCallback(async (profileId: string) => {
        const savedProfiles = await store.get<SavedProfiles>(StoreKeys.SAVED_PROFILES);

        if (!savedProfiles) {
            return;
        }

        const newSavedProfiles = {
            ...savedProfiles,
            activeProfileId: profileId === COMMON_PROFILE_ID ? undefined : profileId
        }

        console.log('newSavedProfiles', newSavedProfiles);

        store.set(StoreKeys.SAVED_PROFILES, newSavedProfiles);
        console.log('set SAVED_PROFILES handleProfileActivate', {newSavedProfiles});
        ipcRenderer.invoke('active-profile-changed', newSavedProfiles.activeProfileId);
    }, []);

    if (!isInitialized) {
        return null;
    }

    const profileSelect = (
        <Select
            value={savedProfiles?.activeProfileId ?? COMMON_PROFILE_ID}
            onChange={handleProfileActivate}
            style={{minWidth: '200px', marginRight: '4px'}}
            allowClear={true}
            placeholder="Common Config"
        >
            {savedProfiles?.profiles
                .map(profile => (
                    <Select.Option key={profile.id}>{profile.name}</Select.Option>
                ))}
        </Select>
    );

    return (
        <div className="card-container settings-main-tabs-container">
            <Tabs
                type="card"
                items={tabsItems}
                className="settings-main-tabs"
                activeKey={activeTab}
                onChange={handleActiveTabChange}
                tabBarExtraContent={profileSelect}
            />
        </div>
    );
};

export default Settings;
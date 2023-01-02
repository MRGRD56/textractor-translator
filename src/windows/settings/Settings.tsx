import React, {FC, useCallback, useState} from 'react';
import {Tabs, TabsProps} from 'antd';
import SettingsProfiles from './tabs/SettingsProfiles';
import SettingsTextractor from './tabs/SettingsTextractor';
import {ElectronStore} from '../../electron-store/electronStoreShared';
import {useDidMount} from 'rooks';
import {StoreKeys} from '../../constants/store-keys';
import SettingsAppearance from './tabs/SettingsAppearance';
import SettingsAbout from './tabs/SettingsAbout';

enum SettingsTab {
    PROFILES = 'PROFILES',
    TEXTRACTOR = 'TEXTRACTOR',
    APPEARANCE = 'APPEARANCE',
    ABOUT = 'ABOUT'
}

const tabsItems: TabsProps['items'] = [
    {
        key: SettingsTab.PROFILES,
        label: 'Profiles',
        children: <SettingsProfiles/>
    },
    {
        key: SettingsTab.TEXTRACTOR,
        label: 'Textractor',
        children: <SettingsTextractor/>
    },
    {
        key: SettingsTab.APPEARANCE,
        label: 'Appearance',
        children: <SettingsAppearance/>
    },
    {
        key: SettingsTab.ABOUT,
        label: 'About',
        children: <SettingsAbout/>
    }
];

const store: ElectronStore = (window as any).nodeApi.store;

const Settings: FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>();
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useDidMount(async () => {
        const savedActiveTab = await store.get<SettingsTab>(StoreKeys.SETTINGS_TAB, SettingsTab.PROFILES);
        setActiveTab(savedActiveTab);
        setIsInitialized(true);
    });

    const handleActiveTabChange = useCallback((newActiveTab: string) => {
        setActiveTab(newActiveTab as SettingsTab);
        store.set(StoreKeys.SETTINGS_TAB, newActiveTab);
    }, []);

    if (!isInitialized) {
        return null;
    }

    return (
        <div className="card-container settings-main-tabs-container">
            <Tabs
                type="card"
                items={tabsItems}
                className="settings-main-tabs"
                activeKey={activeTab}
                onChange={handleActiveTabChange}
            />
        </div>
    );
};

export default Settings;
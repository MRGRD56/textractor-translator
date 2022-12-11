import React, {FC, useCallback, useMemo, useState} from 'react';
import {useDidMount} from 'rooks';
import tabsCore, {Tabs, TabsApi, TabsChange, TabsChangeCause} from '../../utils/tabsCore';
import {ElectronStore} from '../../electron-store/electronStoreShared';
import {SAVED_PROFILES_KEY} from '../../constants/store-keys';
import TabsPanel from './components/tabs/TabsPanel';
import SavedProfiles from './profiles/SavedProfiles';
import {v4} from 'uuid';
import {savedProfilesToTabs, tabsToSavedProfiles} from './profiles/profileTabConversions';
import ProfileSourceEditor from './components/ProfileSourceEditor';
import SettingsProfile from './profiles/SettingsProfile';
import {COMMON_PROFILE_ID, NEW_PROFILE_NAME} from './profiles/constants';
import {deleteProfile} from './utils/profiles';

const initialSavedProfiles = ((): SavedProfiles => {
    const firstProfileId = v4();

    return {
        profiles: [
            {
                id: COMMON_PROFILE_ID,
                name: 'Common',
                isPredefined: true,
                configSource: `
config.languages = {
    source: 'auto',
    target: 'en'
};

config.translator = 'GOOGLE_TRANSLATE';
`.trim()
            },
            {
                id: firstProfileId,
                name: 'New profile',
                configSource: `
config.transformOriginal = ({text, meta}) => {
    return text;
};`.trim(),
            }
        ],
        activeProfileId: firstProfileId,
        tabs: {
            tabIds: [COMMON_PROFILE_ID, firstProfileId],
            activeId: firstProfileId
        }
    };
})();

// {
//     list: [
//         createTab('Common', {
//             isPinned: true,
//             icon: {
//                 className: 'tab-icon-yellow',
//                 name: 'star'
//             }
//         }),
//         createTab('WA2', {
//             className: 'activated',
//             icon: {
//                 className: 'tab-icon-blue',
//                 name: 'check'
//             }
//         }),
//         createTab('White Album 2'),
//         createTab('Aokana')
//     ]
// }

const store: ElectronStore = (window as any).nodeApi.store;

const Settings: FC = () => {
    const [savedProfiles, setSavedProfiles] = useState<SavedProfiles>();
    const [tabsApi, setTabsApi] = useState<TabsApi>();

    const activeProfileTab = useMemo<SettingsProfile | undefined>(() => {
        return savedProfiles?.profiles.find(profile => {
            return profile.id === savedProfiles.tabs.activeId
        });
    }, [savedProfiles]);

    useDidMount(async () => {
        const loadedSavedProfiles: SavedProfiles = await store.get(SAVED_PROFILES_KEY, initialSavedProfiles);
        const loadedTabs = savedProfilesToTabs(loadedSavedProfiles);
        const loadedTabsApi = tabsCore(loadedTabs)
        setSavedProfiles(loadedSavedProfiles);
        setTabsApi(loadedTabsApi);
    });

    const handleTabsChange = useCallback((tabs: Tabs, changes: TabsChange[]) => {
        store.get<SavedProfiles>(SAVED_PROFILES_KEY).then((savedProfiles) => {
            savedProfiles ??= initialSavedProfiles;

            const closedEmptyTabIds = changes
                .map(change => {
                    if (change.cause !== TabsChangeCause.TAB_CLOSED) {
                        return;
                    }

                    if (change.tab.name === NEW_PROFILE_NAME && !change.tab.isActivated) {
                        const profile = savedProfiles.profiles.find(profile => profile.id === change.tab.id);
                        if (profile && !profile.configSource?.trim()) {
                            return change.tab.id;
                        }
                    }
                })
                .filter(Boolean) as string[];

            let newSavedProfiles = tabsToSavedProfiles(savedProfiles, tabs);
            if (closedEmptyTabIds.length) {
                newSavedProfiles = deleteProfile(newSavedProfiles, closedEmptyTabIds)
            }

            store.set(SAVED_PROFILES_KEY, newSavedProfiles);
            console.log('set SAVED_PROFILES handleTabsChange', {newSavedProfiles})
            setSavedProfiles(newSavedProfiles);
        });
    }, []);

    const handleProfileActivate = useCallback((profileId: string) => {
        if (!savedProfiles) {
            return savedProfiles;
        }

        const newSavedProfiles = {
            ...savedProfiles,
            activeProfileId: profileId
        }

        setSavedProfiles(newSavedProfiles);
        store.set(SAVED_PROFILES_KEY, newSavedProfiles)
        console.log('set SAVED_PROFILES handleProfileActivate', {newSavedProfiles})
        tabsApi?.setTabsObject(savedProfilesToTabs(newSavedProfiles));
    }, [savedProfiles, tabsApi]);

    const handleActiveProfileSourceChange = useCallback((profileId: string, profileSource: string) => {
        setSavedProfiles(savedProfiles => {
            if (!savedProfiles) {
                return savedProfiles;
            }

            const newSavedProfiles = {
                ...savedProfiles,
                profiles: savedProfiles.profiles.map(profile => {
                    if (profile.id !== profileId) {
                        return profile;
                    }

                    return {
                        ...profile,
                        configSource: profileSource
                    };
                })
            };

            store.set(SAVED_PROFILES_KEY, newSavedProfiles);
            console.log('set SAVED_PROFILES handleActiveProfileSourceChange', {newSavedProfiles})
            return newSavedProfiles;
        });
    }, []);

    if (!savedProfiles || !tabsApi) {
        return null;
    }

    return (
        <>
            <TabsPanel api={tabsApi} onChange={handleTabsChange} onProfileActivate={handleProfileActivate}/>
            {activeProfileTab && (
                <ProfileSourceEditor profile={activeProfileTab} onSourceChange={handleActiveProfileSourceChange}/>
            )}
        </>
    );
};

export default Settings;
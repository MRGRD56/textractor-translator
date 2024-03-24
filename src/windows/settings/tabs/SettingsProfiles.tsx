import React, {FC, useCallback, useMemo, useState} from 'react';
import TabsPanel from '../components/tabs/TabsPanel';
import ProfileSourceEditor from '../components/ProfileSourceEditor';
import SavedProfiles from '../profiles/SavedProfiles';
import tabsCore, {ProfileTabs, TabsApi, TabsChange, TabsChangeCause} from '../../../utils/tabsCore';
import SavedProfile from '../profiles/SavedProfile';
import {useDidMount} from 'rooks';
import {StoreKeys} from '../../../constants/store-keys';
import {savedProfilesToTabs, tabsToSavedProfiles} from '../profiles/profileTabConversions';
import {COMMON_PROFILE_ID, NEW_PROFILE_NAME} from '../profiles/constants';
import {deleteProfile} from '../utils/profiles';
import {v4} from 'uuid';
import {ElectronStore} from '../../../electron-store/electronStoreShared';
import initializeSavedProfiles from '../../../configuration/initializeSavedProfiles';


const store: ElectronStore = (window as any).nodeApi.store;

const SettingsProfiles: FC = () => {
    const [savedProfiles, setSavedProfiles] = useState<SavedProfiles>();
    const [tabsApi, setTabsApi] = useState<TabsApi>();

    const activeProfileTab = useMemo<SavedProfile | undefined>(() => {
        return savedProfiles?.profiles.find(profile => {
            return profile.id === savedProfiles.tabs.activeId
        });
    }, [savedProfiles]);

    useDidMount(async () => {
        const loadedSavedProfiles: SavedProfiles = await store.get(StoreKeys.SAVED_PROFILES) ?? initializeSavedProfiles(store);
        const loadedTabs = savedProfilesToTabs(loadedSavedProfiles);
        const loadedTabsApi = tabsCore(loadedTabs)
        setSavedProfiles(loadedSavedProfiles);
        setTabsApi(loadedTabsApi);
    });

    const handleTabsChange = useCallback((tabs: ProfileTabs, changes: TabsChange[]) => {
        store.get<SavedProfiles>(StoreKeys.SAVED_PROFILES).then((savedProfiles) => {
            savedProfiles ??= initializeSavedProfiles(store);

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

            store.set(StoreKeys.SAVED_PROFILES, newSavedProfiles);
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
            activeProfileId: savedProfiles.activeProfileId === profileId ? undefined : profileId
        }

        console.log('newSavedProfiles', newSavedProfiles);

        setSavedProfiles(newSavedProfiles);
        store.set(StoreKeys.SAVED_PROFILES, newSavedProfiles)
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

            store.set(StoreKeys.SAVED_PROFILES, newSavedProfiles);
            console.log('set SAVED_PROFILES handleActiveProfileSourceChange', {newSavedProfiles})
            return newSavedProfiles;
        });
    }, []);

    const handleProfilesChange = useCallback((newSavedProfiles: SavedProfiles) => {
        setSavedProfiles(newSavedProfiles);
        store.set(StoreKeys.SAVED_PROFILES, newSavedProfiles);
        tabsApi?.setTabsObject(savedProfilesToTabs(newSavedProfiles));
    }, [tabsApi]);

    if (!savedProfiles || !tabsApi) {
        return null;
    }

    return (
        <>
            <TabsPanel
                profiles={savedProfiles}
                api={tabsApi}
                onChange={handleTabsChange}
                onProfileActivate={handleProfileActivate}
                onProfilesChange={handleProfilesChange}
            />
            {activeProfileTab && (
                <ProfileSourceEditor profile={activeProfileTab} onSourceChange={handleActiveProfileSourceChange}/>
            )}
        </>
    );
};

export default SettingsProfiles;
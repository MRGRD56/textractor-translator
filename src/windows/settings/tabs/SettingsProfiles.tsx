import React, {FC, useCallback, useMemo, useState} from 'react';
import TabsPanel from '../components/tabs/TabsPanel';
import ProfileSourceEditor from '../components/ProfileSourceEditor';
import SavedProfiles from '../profiles/SavedProfiles';
import tabsCore, {ProfileTabs, TabsApi, TabsChange, TabsChangeCause} from '../../../utils/tabsCore';
import SavedProfile from '../profiles/SavedProfile';
import {useDidMount, useWillUnmount} from 'rooks';
import {StoreKeys} from '../../../constants/store-keys';
import {savedProfilesToTabs, tabsToSavedProfiles} from '../profiles/profileTabConversions';
import {NEW_PROFILE_NAME} from '../profiles/constants';
import {deleteProfile} from '../utils/profiles';
import initializeSavedProfiles from '../../../configuration/initializeSavedProfiles';
import {ActiveProfileChangedEvent} from '../../../types/custom-events';
import useAutoRef from '../../../utils/useAutoRef';
import getSettingsNodeApi from '../utils/getSettingsNodeApi';

const {store, ipcRenderer} = getSettingsNodeApi();

const SettingsProfiles: FC = () => {
    const [savedProfiles, setSavedProfiles] = useState<SavedProfiles>();
    const [tabsApi, setTabsApi] = useState<TabsApi>();

    const savedProfilesRef = useAutoRef(savedProfiles);
    const tabsApiRef = useAutoRef(tabsApi);

    const activeProfileTab = useMemo<SavedProfile | undefined>(() => {
        return savedProfiles?.profiles.find(profile => {
            return profile.id === savedProfiles.tabs.activeId
        });
    }, [savedProfiles]);

    const profileChangedCallback = useCallback((event: ActiveProfileChangedEvent) => {
        console.log('settingsProfiles: profileChanged', event)

        const activeProfileId = event.detail.activeProfileId;

        const savedProfiles = savedProfilesRef.current;

        if (!savedProfiles) {
            throw new Error('savedProfiles is undefined');
        }

        if (savedProfiles.activeProfileId === activeProfileId) {
            return;
        }

        const newSavedProfiles: SavedProfiles = ({
            ...savedProfiles,
            activeProfileId
        });

        setSavedProfiles(newSavedProfiles);
        tabsApiRef.current!.setTabsObject(savedProfilesToTabs(newSavedProfiles));
        console.log('settingsProfiles: profileChanged savedProfiles, tabsApi', {newSavedProfiles, tabsApi})
    }, []);

    useDidMount(async () => {
        const loadedSavedProfiles: SavedProfiles = await store.get(StoreKeys.SAVED_PROFILES) ?? initializeSavedProfiles(store);
        const loadedTabs = savedProfilesToTabs(loadedSavedProfiles);
        const loadedTabsApi = tabsCore(loadedTabs)
        setSavedProfiles(loadedSavedProfiles);
        setTabsApi(loadedTabsApi);
        window.addEventListener('active-profile-changed', profileChangedCallback);
    });

    useWillUnmount(() => {
        window.removeEventListener('active-profile-changed', profileChangedCallback);
    });

    const handleTabsChange = useCallback((tabs: ProfileTabs, changes: TabsChange[]) => {
        store.get<SavedProfiles>(StoreKeys.SAVED_PROFILES).then((savedProfiles) => {
            savedProfiles ??= initializeSavedProfiles(store);

            // const closedEmptyTabIds = changes
            //     .map(change => {
            //         if (change.cause !== TabsChangeCause.TAB_CLOSED) {
            //             return;
            //         }
            //
            //         if (change.tab.name === NEW_PROFILE_NAME && !change.tab.isActivated) {
            //             const profile = savedProfiles.profiles.find(profile => profile.id === change.tab.id);
            //             if (profile && !profile.configSource?.trim()) {
            //                 return change.tab.id;
            //             }
            //         }
            //     })
            //     .filter(Boolean) as string[];

            const newSavedProfiles = tabsToSavedProfiles(savedProfiles, tabs);
            // if (closedEmptyTabIds.length) {
            //     newSavedProfiles = deleteProfile(newSavedProfiles, closedEmptyTabIds)
            // }

            store.set(StoreKeys.SAVED_PROFILES, newSavedProfiles);
            console.log('set SAVED_PROFILES handleTabsChange', {newSavedProfiles})
            setSavedProfiles(newSavedProfiles);
        });
    }, []);

    const handleProfileActivate = useCallback((profileId: string) => {
        if (!savedProfiles) {
            return;
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

        window.dispatchEvent(new ActiveProfileChangedEvent({
            activeProfileId: newSavedProfiles.activeProfileId
        }));
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
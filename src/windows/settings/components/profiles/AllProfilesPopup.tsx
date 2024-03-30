import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import SavedProfiles from '../../profiles/SavedProfiles';
import SavedProfile from '../../profiles/SavedProfile';
import PopupProfile from './PopupProfile';
import {createTab, TabsApi} from '../../../../utils/tabsCore';
import {deleteProfile} from '../../utils/profiles';
import {NEW_PROFILE_NAME} from '../../profiles/constants';
import {SettingsNodeApi} from '../../preload';
import showOpenDialogSync from '../../utils/showOpenDialogSync';
import {v4} from 'uuid';
import getSettingsNodeApi from '../../utils/getSettingsNodeApi';

interface Props {
    profiles: SavedProfiles;
    onProfilesChange: (profiles: SavedProfiles) => void;
    tabsApi: TabsApi;
}

const {
    readFileAsync,
    parsePath
} = getSettingsNodeApi();

const AllProfilesPopup: FC<Props> = ({tabsApi, profiles, onProfilesChange}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const profilesList = useMemo<SavedProfile[]>(() => {
        return [...profiles.profiles].sort((a, b) => {
            const predefinedValue = Number(a.isPredefined) - Number(b.isPredefined);
            if (predefinedValue !== 0) {
                return predefinedValue;
            }

            return 0;
        });
    }, [profiles]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handler = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const isInsidePopup = Boolean(target.closest('.settings-profiles-popup-wrapper, .settings-profiles-popup-part'));
            console.log('HANDLER11', {event, target, isInsidePopup});
            if (!isInsidePopup) {
                setIsOpen(false);
            }
        };

        window.addEventListener('mousedown', handler);

        return () => {
            window.removeEventListener('mousedown', handler);
        };
    }, [isOpen]);

    const closePopup = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleProfileDelete = useCallback((profile: SavedProfile) => () => {
        onProfilesChange(deleteProfile(profiles, [profile.id]));
    }, [profiles, onProfilesChange]);

    const handlePopupOpenClick = useCallback(() => {
        const isOpenNow = !isOpen;
        setIsOpen(isOpenNow);
    }, [isOpen]);

    const handleAddProfileClick = useCallback(() => {
        const tab = tabsApi.addTab(createTab(NEW_PROFILE_NAME))
        tabsApi.setActiveTabId(tab.id);
        closePopup();
    }, [closePopup, tabsApi]);

    const handleImportProfileClick = useCallback(() => {
        showOpenDialogSync({
            properties: ['openFile'],
            filters: [
                {
                    name: 'Config file',
                    extensions: ['js']
                },
                {
                    name: 'All Files',
                    extensions: ['*']
                }
            ]
        }).then(async (filePaths) => {
            if (!filePaths) {
                return;
            }

            let actualProfiles = profiles;

            const newProfiles: SavedProfile[] = [];

            for (const filePath of filePaths) {
                const profileName = parsePath(filePath)?.name || 'Imported profile';
                const profileContent = await readFileAsync(filePath);

                newProfiles.push({
                    name: profileName,
                    configSource: profileContent,
                    id: v4()
                });
            }

            let profile: SavedProfile | undefined = undefined;
            for (profile of newProfiles) {
                actualProfiles = {
                    ...actualProfiles,
                    profiles: [
                        ...actualProfiles.profiles,
                        profile
                    ],
                    tabs: {
                        ...actualProfiles.tabs,
                        tabIds: [
                            ...actualProfiles.tabs.tabIds,
                            profile.id
                        ]
                    }
                };
                onProfilesChange(actualProfiles);

                // const tab = tabsApi.addTab(createTab(profileName))
            }

            if (profile) {
                tabsApi.setActiveTabId(profile.id);
                closePopup();
            }
        })
    }, [profiles, onProfilesChange, closePopup]);

    return (
        <div className="settings-profiles-popup-wrapper">
            <button className="icon-button profiles-button" onClick={handlePopupOpenClick}>
                <span className="material-symbols-rounded">expand_more</span>
            </button>
            {isOpen && (
                <div className="settings-profiles-popup">
                    {profilesList.map(profile => (
                        <PopupProfile
                            key={profile.id}
                            tabsApi={tabsApi}
                            profile={profile}
                            active={profile.id === profiles.activeProfileId}
                            open={tabsApi.getTabsMap().has(profile.id)}
                            onDelete={handleProfileDelete(profile)}
                            onPopupClose={closePopup}
                        />
                    ))}
                    <hr className="profiles-popup-item-separator"/>
                    <div className="profiles-popup-item" onClick={handleAddProfileClick}>
                        <div className="profiles-popup-item-main">
                            <div className="profiles-popup-item-main-icon-wrapper">
                                <div className="profiles-popup-item-main-icon icon-gray">
                                    <span className="material-symbols-rounded">
                                        add
                                    </span>
                                </div>
                            </div>
                            <div className="profiles-popup-item-main-name">
                                Add profile
                            </div>
                        </div>
                    </div>
                    <div className="profiles-popup-item" onClick={handleImportProfileClick}>
                        <div className="profiles-popup-item-main">
                            <div className="profiles-popup-item-main-icon-wrapper">
                                <div className="profiles-popup-item-main-icon icon-gray">
                                    <span className="material-symbols-rounded">
                                        download
                                    </span>
                                </div>
                            </div>
                            <div className="profiles-popup-item-main-name">
                                Import profile
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProfilesPopup;
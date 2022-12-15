import SavedProfiles from './SavedProfiles';
import {ProfileTab, ProfileTabs} from '../../../utils/tabsCore';
import indexArrayBy from '../../../utils/indexArrayBy';
import SavedProfile from './SavedProfile';

export const iconActiveProfile: ProfileTab['icon'] = {
    className: 'tab-icon-blue',
    name: 'check'
};

export const iconCommonProfile: ProfileTab['icon'] = {
    className: 'tab-icon-yellow',
    name: 'star'
};

export const profileToTab = (profile: SavedProfile, isActiveProfile: boolean, tabIndex  = -1): ProfileTab => {
    return {
        id: profile.id,
        name: profile.name,
        icon: profile.isPredefined ? iconCommonProfile : isActiveProfile ? iconActiveProfile : undefined,
        index: tabIndex,
        isRenameable: !profile.isPredefined,
        isActivated: isActiveProfile
    };
};

export const savedProfilesToTabs = (savedProfiles: SavedProfiles): ProfileTabs => {
    const {activeProfileId, profiles} = savedProfiles;
    const profilesMap = indexArrayBy(profiles, 'id');

    const tabsList: ProfileTab[] = savedProfiles.tabs.tabIds.map((tabId, index) => {
        const profile = profilesMap.get(tabId);

        if (!profile) {
            return;
        }

        const isActiveProfile = tabId === activeProfileId;

        return profileToTab(profile, isActiveProfile, index);
    }).filter(Boolean) as ProfileTab[];

    return {
        list: tabsList,
        activeId: savedProfiles.tabs.activeId
    };
};

export const tabsToSavedProfiles = (savedProfiles: SavedProfiles, tabs: ProfileTabs): SavedProfiles => {
    const newTabsMap = indexArrayBy(tabs.list, 'id');

    return {
        profiles: [
            ...savedProfiles.profiles.map(profile => {
                return {
                    ...profile,
                    name: newTabsMap.get(profile.id)?.name ?? profile.name
                };
            }),
            ...tabs.list
                .filter(tab => {
                    return !savedProfiles.profiles.some(profile => profile.id === tab.id);
                })
                .map(tab => {
                    return {
                        id: tab.id,
                        name: tab.name,
                        configSource: ''
                    } as SavedProfile;
                })
        ],
        activeProfileId: savedProfiles.activeProfileId,
        tabs: {
            tabIds: tabs.list.map(tab => tab.id),
            activeId: tabs.activeId
        }
    };
};
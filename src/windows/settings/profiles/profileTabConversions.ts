import SavedProfiles from './SavedProfiles';
import {Tab, Tabs} from '../../../utils/tabsCore';
import indexArrayBy from '../../../utils/indexArrayBy';
import SettingsProfile from './SettingsProfile';

export const iconActiveProfile: Tab['icon'] = {
    className: 'tab-icon-blue',
    name: 'check'
};

export const iconCommonProfile: Tab['icon'] = {
    className: 'tab-icon-yellow',
    name: 'star'
};

export const savedProfilesToTabs = (savedProfiles: SavedProfiles): Tabs => {
    const {activeProfileId, profiles} = savedProfiles;
    const profilesMap = indexArrayBy(profiles, 'id');

    const tabsList: Tab[] = savedProfiles.tabs.tabIds.map((tabId, index) => {
        const profile = profilesMap.get(tabId);

        if (!profile) {
            return;
        }

        const isActiveProfile = tabId === activeProfileId;

        return {
            id: tabId,
            name: profile.name,
            icon: profile.isPredefined ? iconCommonProfile : isActiveProfile ? iconActiveProfile : undefined,
            index,
            isRenameable: !profile.isPredefined,
            isActivated: profile.id === activeProfileId
        };
    }).filter(Boolean) as Tab[];

    return {
        list: tabsList,
        activeId: savedProfiles.tabs.activeId
    };
};

export const tabsToSavedProfiles = (savedProfiles: SavedProfiles, tabs: Tabs): SavedProfiles => {
    return {
        profiles: [
            ...savedProfiles.profiles,
            ...tabs.list
                .filter(tab => {
                    return !savedProfiles.profiles.some(profile => profile.id === tab.id);
                })
                .map(tab => {
                    return {
                        id: tab.id,
                        name: tab.name,
                        configSource: ''
                    } as SettingsProfile;
                })
        ],
        activeProfileId: savedProfiles.activeProfileId,
        tabs: {
            tabIds: tabs.list.map(tab => tab.id),
            activeId: tabs.activeId
        }
    };
};
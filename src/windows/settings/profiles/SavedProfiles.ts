import SettingsProfile from './SettingsProfile';

interface SavedProfiles {
    profiles: SettingsProfile[];
    activeProfileId: string;
    tabs: {
        tabIds: string[];
        activeId: string | undefined;
    },
}

export default SavedProfiles;
import SavedProfile from './SavedProfile';

interface SavedProfiles {
    profiles: SavedProfile[];
    activeProfileId?: string;
    tabs: {
        tabIds: string[];
        activeId: string | undefined;
    },
}

export default SavedProfiles;
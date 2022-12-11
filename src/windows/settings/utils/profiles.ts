import SavedProfiles from '../profiles/SavedProfiles';

export const deleteProfile = (savedProfiles: SavedProfiles, profileIds: string[]): SavedProfiles => {
    const wasActive = profileIds.includes(savedProfiles.activeProfileId as string);

    return {
        ...savedProfiles,
        activeProfileId: wasActive ? undefined : savedProfiles.activeProfileId,
        profiles: savedProfiles.profiles.filter(profile => !profileIds.includes(profile.id))
    };
};
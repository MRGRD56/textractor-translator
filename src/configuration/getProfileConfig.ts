import {SAVED_PROFILES_KEY} from '../constants/store-keys';
import SavedProfiles from '../windows/settings/profiles/SavedProfiles';
import indexArrayBy from '../utils/indexArrayBy';
import {COMMON_PROFILE_ID} from '../windows/settings/profiles/constants';
import getConfiguration from './getConfiguration';
import type Store from 'electron-store';
import {Configuration} from './Configuration';

const getProfileConfig = (store: Store, profileId?: string): Configuration => {
    const savedProfiles = store.get(SAVED_PROFILES_KEY) as SavedProfiles;
    const savedProfilesMap = indexArrayBy(savedProfiles.profiles, 'id');

    const commonProfile = savedProfilesMap.get(COMMON_PROFILE_ID);
    const activeProfileId = profileId ?? savedProfiles.activeProfileId;
    const activeProfile = activeProfileId ? savedProfilesMap.get(activeProfileId) : undefined;

    return getConfiguration(commonProfile?.configSource, activeProfile?.configSource);
};

export default getProfileConfig;
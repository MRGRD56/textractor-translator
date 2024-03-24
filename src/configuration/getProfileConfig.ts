import indexArrayBy from '../utils/indexArrayBy';
import {COMMON_PROFILE_ID} from '../windows/settings/profiles/constants';
import getConfiguration from './getConfiguration';
import type Store from 'electron-store';
import {Configuration} from './Configuration';
import initializeSavedProfiles from './initializeSavedProfiles';
import {StoreKeys} from '../constants/store-keys';
import SavedProfiles from '../windows/settings/profiles/SavedProfiles';

const getProfileConfig = (store: Store, profileId?: string): Configuration => {
    const savedProfiles = store.get(StoreKeys.SAVED_PROFILES) as (SavedProfiles | undefined) ?? initializeSavedProfiles(store);
    const savedProfilesMap = indexArrayBy(savedProfiles.profiles, 'id');

    const commonProfile = savedProfilesMap.get(COMMON_PROFILE_ID);
    const activeProfileId = profileId ?? savedProfiles.activeProfileId;
    const activeProfile = activeProfileId ? savedProfilesMap.get(activeProfileId) : undefined;

    return getConfiguration(commonProfile?.configSource, activeProfile?.configSource);
};

export default getProfileConfig;
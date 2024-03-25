import indexArrayBy from '../utils/indexArrayBy';
import {COMMON_PROFILE_ID} from '../windows/settings/profiles/constants';
import getConfiguration from './getConfiguration';
import {Configuration} from './Configuration';
import initializeSavedProfiles from './initializeSavedProfiles';
import {StoreKeys} from '../constants/store-keys';
import SavedProfiles from '../windows/settings/profiles/SavedProfiles';
import ref from '../utils/ref';
import electronStore from '../electron-store/electronStore';
import store from '../electron-store/store';

const configurationCache = ref<Configuration>();

store.onDidChange(StoreKeys.SAVED_PROFILES, () => {
    configurationCache.current = undefined;
});

electronStore.onDidChange(StoreKeys.SAVED_PROFILES, () => {
    configurationCache.current = undefined;
});

const getProfileConfig = (profileId?: string): Configuration => {
    const cache = configurationCache.current;
    if (cache) {
        return cache;
    }

    const savedProfiles = store.get(StoreKeys.SAVED_PROFILES) as (SavedProfiles | undefined) ?? initializeSavedProfiles(store);
    const savedProfilesMap = indexArrayBy(savedProfiles.profiles, 'id');

    const commonProfile = savedProfilesMap.get(COMMON_PROFILE_ID);
    const activeProfileId = profileId ?? savedProfiles.activeProfileId;
    const activeProfile = activeProfileId ? savedProfilesMap.get(activeProfileId) : undefined;

    const result = getConfiguration(commonProfile?.configSource, activeProfile?.configSource);
    configurationCache.current = result;
    return result;
};

export default getProfileConfig;
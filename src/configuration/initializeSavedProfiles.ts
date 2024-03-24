import Store from 'electron-store';
import SavedProfiles from '../windows/settings/profiles/SavedProfiles';
import {StoreKeys} from '../constants/store-keys';
import initialSavedProfiles from './initialSavedProfiles';
import {ElectronStore} from '../electron-store/electronStoreShared';

const initializeSavedProfiles = (store: Store | ElectronStore): SavedProfiles => {
    store.set(StoreKeys.SAVED_PROFILES, initialSavedProfiles);
    return initialSavedProfiles;
};

export default initializeSavedProfiles;
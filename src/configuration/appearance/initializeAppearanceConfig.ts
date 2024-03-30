import Store from 'electron-store';
import {ElectronStore} from '../../electron-store/electronStoreShared';
import AppearanceConfig, {defaultAppearanceConfig, getAppearanceConfigKey} from './AppearanceConfig';
import {COMMON_PROFILE_ID} from '../../windows/settings/profiles/constants';

const initializeAppearanceConfig = async (store: Store | ElectronStore, appearanceConfigKey: string): Promise<AppearanceConfig> => {
    const baseConfigRaw: AppearanceConfig | Promise<AppearanceConfig> = (store as any).get(getAppearanceConfigKey(COMMON_PROFILE_ID), defaultAppearanceConfig);
    let baseConfig: AppearanceConfig;
    if (baseConfigRaw instanceof Promise) {
        baseConfig = await baseConfigRaw;
    } else {
        baseConfig = baseConfigRaw;
    }

    store.set(appearanceConfigKey, baseConfig);
    return baseConfig;
};

export default initializeAppearanceConfig;
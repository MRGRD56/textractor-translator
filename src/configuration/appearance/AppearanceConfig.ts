import MainWindowAppearanceConfig, {defaultMainWindowAppearance} from './MainWindowAppearanceConfig';
import TextAppearanceConfig, {
    defaultOriginalTextAppearance,
    defaultTranslatedTextAppearance
} from './TextAppearanceConfig';
import {StoreKeys} from '../../constants/store-keys';
import {COMMON_PROFILE_ID} from '../../windows/settings/profiles/constants';

interface AppearanceConfig {
    mainWindow: MainWindowAppearanceConfig;
    originalText: TextAppearanceConfig;
    translatedText: TextAppearanceConfig;
}

export default AppearanceConfig;

export const getAppearanceConfigKey = (activeProfileId: string | undefined) => {
    if (activeProfileId === undefined || activeProfileId === COMMON_PROFILE_ID) {
        return StoreKeys.APPEARANCE_CONFIG + '.common';
    }

    return StoreKeys.APPEARANCE_CONFIG + '.' + activeProfileId;
};

export const defaultAppearanceConfig: AppearanceConfig = {
    mainWindow: defaultMainWindowAppearance,
    originalText: defaultOriginalTextAppearance,
    translatedText: defaultTranslatedTextAppearance
};
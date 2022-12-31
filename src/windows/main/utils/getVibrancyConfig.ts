import MainWindowAppearanceConfig from '../../../configuration/appearance/MainWindowAppearanceConfig';
import {Vibrancy} from 'electron-acrylic-window';

const getVibrancyConfig = (config: MainWindowAppearanceConfig): Vibrancy | undefined => {
    if (!config.isBackgroundBlurEnabled) {
        return undefined;
    }

    return {
        theme: config.backgroundBlurTheme,
        effect: config.backgroundBlurEffect,
        maximumRefreshRate: 1000, //TODO
        disableOnBlur: false,
        useCustomWindowRefreshMethod: false
    };
};

export default getVibrancyConfig;
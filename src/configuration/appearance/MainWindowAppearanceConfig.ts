import type {VibrancyEffect, VibrancyTheme} from 'electron-acrylic-window';

export enum MainWindowDragMode {
    ENTIRE_WINDOW = 'ENTIRE_WINDOW',
    PANEL = 'PANEL'
}

interface MainWindowAppearanceConfig {
    windowDragMode: MainWindowDragMode;
    backgroundColor: string;
    backgroundOpacity: number;
    borderColor: string;
    borderOpacity: number;
    borderThickness: number;
    borderRadius: number;
    isBackgroundBlurEnabled: boolean;
    backgroundBlurTheme: VibrancyTheme;
    backgroundBlurEffect: VibrancyEffect;
}

export default MainWindowAppearanceConfig;

export const defaultMainWindowAppearance: MainWindowAppearanceConfig = {
    backgroundColor: '#000000',
    backgroundOpacity: 80,
    borderColor: '#C8C8C8',
    borderOpacity: 0.15,
    borderThickness: 1,
    borderRadius: 4,
    windowDragMode: MainWindowDragMode.ENTIRE_WINDOW,
    isBackgroundBlurEnabled: false,
    backgroundBlurTheme: 'dark',
    backgroundBlurEffect: 'acrylic'
};
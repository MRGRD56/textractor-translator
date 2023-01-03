import type {VibrancyEffect, VibrancyTheme} from 'electron-acrylic-window';

export enum MainWindowDragMode {
    ENTIRE_WINDOW = 'ENTIRE_WINDOW',
    BACKGROUND = 'BACKGROUND',
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
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    textColor: string;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
}

export default MainWindowAppearanceConfig;

export const defaultMainWindowAppearance: MainWindowAppearanceConfig = {
    backgroundColor: '#000000',
    backgroundOpacity: 80,
    borderColor: '#C8C8C8',
    borderOpacity: 15,
    borderThickness: 1,
    borderRadius: 4,
    windowDragMode: MainWindowDragMode.BACKGROUND,
    isBackgroundBlurEnabled: false,
    backgroundBlurTheme: 'dark',
    backgroundBlurEffect: 'acrylic',
    fontFamily: 'Roboto',
    fontSize: 20,
    lineHeight: 120,
    textColor: '#ffffff',
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10
};
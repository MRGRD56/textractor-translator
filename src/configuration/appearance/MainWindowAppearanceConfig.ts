// import type {VibrancyEffect, VibrancyTheme} from 'electron-acrylic-window';

export enum MainWindowDragMode {
    ENTIRE_WINDOW = 'ENTIRE_WINDOW',
    BACKGROUND = 'BACKGROUND',
    PANEL = 'PANEL'
}

export enum TextOutlineType {
    OUTER = 'OUTER',
    OUTER_SHADOW = 'OUTER_SHADOW',
    INNER = 'INNER'
}

export enum TextOrder {
    ORIGINAL_TRANSLATED = 'ORIGINAL_TRANSLATED',
    TRANSLATED_ORIGINAL = 'TRANSLATED_ORIGINAL'
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
    // backgroundBlurTheme: VibrancyTheme;
    // backgroundBlurEffect: VibrancyEffect;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    textColor: string;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
    textOutlineType: TextOutlineType | undefined;
    textOutlineColor: string;
    textOutlineThickness: number;
    textOrder: TextOrder;
    sentenceGap: number;
    isHoverOnlyBackgroundSettings: boolean;
    hoverOnlyBackgroundOpacity: number;
    hoverOnlyBorderOpacity: number;
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
    // backgroundBlurTheme: 'dark',
    // backgroundBlurEffect: 'acrylic',
    fontFamily: 'Roboto',
    fontSize: 20,
    lineHeight: 120,
    textColor: '#ffffff',
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    textOutlineType: undefined,
    textOutlineColor: '#000000',
    textOutlineThickness: 1.2,
    textOrder: TextOrder.ORIGINAL_TRANSLATED,
    sentenceGap: 4,
    isHoverOnlyBackgroundSettings: false,
    hoverOnlyBackgroundOpacity: 100,
    hoverOnlyBorderOpacity: 100
};
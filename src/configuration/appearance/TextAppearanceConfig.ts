import {TextOutlineType} from './MainWindowAppearanceConfig';

export enum TextBackgroundType {
    BLOCK = 'BLOCK',
    INLINE = 'INLINE'
}

export enum TextAppearanceOverrideType {
    INHERIT = 'INHERIT'
}

interface TextAppearanceConfig {
    isDisplayed: boolean;
    isDisplayedOnHoverOnly: boolean;
    textColor?: string;
    textOpacity: number;
    fontSize: number;
    // fontSizeUnit: string;
    fontFamily?: string;
    fontWeight: number;
    isItalic: boolean;
    isUnderlined: boolean;
    lineHeight: number;
    textPaddingTop: number;
    textPaddingRight: number;
    textPaddingBottom: number;
    textPaddingLeft: number;
    textBackgroundType?: TextBackgroundType;
    textBackgroundColor: string;
    textBackgroundOpacity: number;
    textBorderColor: string;
    textBorderOpacity: number;
    textBorderThickness: number;
    textBorderRadius: number;
    textOutlineType: TextOutlineType | TextAppearanceOverrideType | undefined;
    textOutlineColor: string;
    textOutlineThickness: number;
}

export default TextAppearanceConfig;

export const defaultOriginalTextAppearance: TextAppearanceConfig = {
    isDisplayed: true,
    isDisplayedOnHoverOnly: false,
    textColor: undefined,
    textOpacity: 92,
    fontSize: 85,
    fontFamily: undefined,
    fontWeight: 300,
    isItalic: false,
    isUnderlined: false,
    lineHeight: 120,
    textBackgroundType: undefined,
    textBackgroundColor: '#000000',
    textBackgroundOpacity: 100,
    textPaddingTop: 0,
    textPaddingRight: 0,
    textPaddingBottom: 0,
    textPaddingLeft: 0,
    textBorderColor: '#C8C8C8',
    textBorderOpacity: 15,
    textBorderThickness: 1,
    textBorderRadius: 4,
    textOutlineType: TextAppearanceOverrideType.INHERIT,
    textOutlineColor: '#000000',
    textOutlineThickness: 1.2,
};

export const defaultTranslatedTextAppearance: TextAppearanceConfig = {
    ...defaultOriginalTextAppearance,
    fontWeight: 500,
    textOpacity: 100,
    fontSize: 100
};
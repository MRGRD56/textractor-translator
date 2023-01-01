interface TextAppearanceConfig {
    textColor?: string;
    textOpacity: number;
    fontSize: number;
    // fontSizeUnit: string;
    fontFamily?: string;
    fontWeight: number;
    isItalic: boolean;
    isUnderlined: boolean;
    lineHeight?: number;
}

export default TextAppearanceConfig;

export const defaultOriginalTextAppearance: TextAppearanceConfig = {
    textColor: undefined,
    textOpacity: 100,
    fontSize: 100,
    fontFamily: undefined,
    fontWeight: 400,
    isItalic: false,
    isUnderlined: false,
    lineHeight: undefined
};

export const defaultTranslatedTextAppearance: TextAppearanceConfig = {
    ...defaultOriginalTextAppearance,
    fontWeight: 700
};
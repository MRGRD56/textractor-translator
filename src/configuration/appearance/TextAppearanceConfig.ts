interface TextAppearanceConfig {
    textColor?: string;
    textOpacity: number;
    fontSize: number;
    // fontSizeUnit: string;
    fontFamily?: string;
    fontWeight: number;
    isItalic: boolean;
    isUnderlined: boolean;
    lineHeight: number;
}

export default TextAppearanceConfig;

export const defaultOriginalTextAppearance: TextAppearanceConfig = {
    textColor: undefined,
    textOpacity: 92,
    fontSize: 85,
    fontFamily: undefined,
    fontWeight: 300,
    isItalic: false,
    isUnderlined: false,
    lineHeight: 120
};

export const defaultTranslatedTextAppearance: TextAppearanceConfig = {
    ...defaultOriginalTextAppearance,
    fontWeight: 500,
    textOpacity: 100,
    fontSize: 100
};
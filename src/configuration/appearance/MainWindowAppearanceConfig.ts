export enum MainWindowDragMode {
    ENTIRE_WINDOW = 'ENTIRE_WINDOW',
    PANEL = 'PANEL'
}

interface MainWindowAppearanceConfig {
    windowDragMode: MainWindowDragMode;
    backgroundColor: string;
    backgroundOpacity: number;
}

export default MainWindowAppearanceConfig;

export const defaultMainWindowAppearance: MainWindowAppearanceConfig = {
    backgroundColor: '#000000',
    backgroundOpacity: 80,
    windowDragMode: MainWindowDragMode.ENTIRE_WINDOW
};
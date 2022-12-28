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
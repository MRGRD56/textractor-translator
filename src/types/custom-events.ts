import AppearanceConfig from '../configuration/appearance/AppearanceConfig';

export interface ActiveProfileChangedEventDetail {
    activeProfileId: string | undefined;
}

export class ActiveProfileChangedEvent extends CustomEvent<ActiveProfileChangedEventDetail> {
    constructor(detail: ActiveProfileChangedEventDetail) {
        super('active-profile-changed', {detail});
    }
}

export interface AppearanceSettingsChangedEventDetail {
    appearanceKey: keyof AppearanceConfig;
    config: AppearanceConfig[keyof AppearanceConfig];
    sourceId?: string;
}

export class AppearanceSettingsChangedEvent extends CustomEvent<AppearanceSettingsChangedEventDetail> {
    constructor(detail: AppearanceSettingsChangedEventDetail) {
        super('appearance-settings-changed', {detail});
    }
}

interface CustomEventMap {
    'active-profile-changed': ActiveProfileChangedEvent;
    'appearance-settings-changed': AppearanceSettingsChangedEvent;
}

declare global {
    interface Window {
        addEventListener<K extends keyof CustomEventMap>(type: K,
            listener: (this: Document, ev: CustomEventMap[K]) => void, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof CustomEventMap>(type: K,
            listener: (this: Document, ev: CustomEventMap[K]) => void, options?: boolean | EventListenerOptions): void;
        dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
    }
}

export { };

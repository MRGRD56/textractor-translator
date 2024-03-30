export class ActiveProfileChangedEvent extends CustomEvent<{activeProfileId: string | undefined}> {
    constructor(detail: {activeProfileId: string | undefined}) {
        super('active-profile-changed', {detail});
    }
}

interface CustomEventMap {
    'active-profile-changed': ActiveProfileChangedEvent;
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

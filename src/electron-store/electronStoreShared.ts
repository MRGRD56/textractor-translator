import type Store from 'electron-store';

export const electronStoreKeys = ['get', 'set', 'has', 'reset', 'delete', 'clear', 'onDidChange', 'onDidAnyChange'] as const;

// type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (...a: Parameters<T>) => TNewReturn;

interface ElectronStoreGet {
    get<T = unknown>(key: string): Promise<T>;
    get<T>(key: string, defaultValue: T): Promise<T>;
}

export type ElectronStore = Omit<{
    [K in (typeof electronStoreKeys)[number]]: Store[K];
}, 'get'> & ElectronStoreGet;
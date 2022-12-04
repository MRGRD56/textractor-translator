import type Store from 'electron-store';

export const electronStoreKeys = ['get', 'set', 'has', 'reset', 'delete', 'clear', 'onDidChange', 'onDidAnyChange'] as const;

// type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (...a: Parameters<T>) => TNewReturn;

interface ElectronStoreGet {
    get(key: string): Promise<unknown>;
    get<T>(key: string, defaultValue: Required<T>): Promise<Required<T>>;
}

export type ElectronStore = Omit<{
    [K in (typeof electronStoreKeys)[number]]: Store[K];
}, 'get'> & ElectronStoreGet;
import Store from 'electron-store';
import {ElectronStore} from '../electron-store/electronStoreShared';
import {useEffect, useState} from 'react';
import {isFunction} from 'lodash';

const useStoreStateReader = <T>(store: Store | ElectronStore, key: string, defaultValue?: T | (() => T)): T | undefined => {
    const [value, setValue] = useState<T>();

    useEffect(() => {
        const initialValue = (store as any).get(key) ?? (isFunction(defaultValue) ? defaultValue() : defaultValue);
        if (initialValue instanceof Promise) {
            initialValue.then(setValue);
        } else {
            setValue(initialValue);
        }

        const unsubscribe = store.onDidChange(key, (newValue) => {
            setValue(newValue as T);
        });

        return () => {
            (async () => {
                (await unsubscribe)();
            })();
        };
    }, [store, key]);

    return value;
};

export default useStoreStateReader;
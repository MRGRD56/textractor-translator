import React, {useCallback, useMemo, useState} from 'react';
import type Store from 'electron-store';
import type {ElectronStore} from '../electron-store/electronStoreShared';
import {isFunction} from 'lodash';
import {useDidMount} from 'rooks';

type Result<T> = [T | undefined, React.Dispatch<React.SetStateAction<T>>];

const useStoreStateWriter = <T>(store: Store | ElectronStore, key: string, initialState: T): Result<T> => {
    const [value, _setValue] = useState<T>();

    useDidMount(async () => {
        const valueToSet = await (store as any).get(key, initialState);
        _setValue(valueToSet);
    });

    const setValue = useCallback<React.Dispatch<React.SetStateAction<T>>>((value) => {
        _setValue(currentValue => {
            if (currentValue === undefined) {
                return;
            }

            const newValue = isFunction(value)
                ? value(currentValue)
                : value;

            store.set(key, newValue);

            return newValue;
        });
    }, [store, key]);

    const result = [value, setValue] as Result<T>;

    return useMemo(() => result, result);
};

export default useStoreStateWriter;
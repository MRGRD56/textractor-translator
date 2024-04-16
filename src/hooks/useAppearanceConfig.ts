import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type Store from 'electron-store';
import type {ElectronStore} from '../electron-store/electronStoreShared';
import {isFunction} from 'lodash';
import {useAsyncEffect} from 'rooks';
import AppearanceConfig, {defaultAppearanceConfig} from '../configuration/appearance/AppearanceConfig';
import SavedProfiles from '../windows/settings/profiles/SavedProfiles';
import {StoreKeys} from '../constants/store-keys';
import getSettingsNodeApi from '../windows/settings/utils/getSettingsNodeApi';
import {COMMON_PROFILE_ID} from '../windows/settings/profiles/constants';
import {Ref} from '../utils/ref';
import {AppearanceSettingsChangedEvent} from '../types/custom-events';

export type Wrapped<T> = Readonly<Ref<T>>;

interface Result<T> {
    value: T | undefined;
    initialValue: Wrapped<T | undefined>;
    setValue: React.Dispatch<React.SetStateAction<T>>;
}

const {ipcRenderer} = getSettingsNodeApi();

const SOURCE_ID = 'useAppearanceConfig';
const useAppearanceConfig = <T extends AppearanceConfig[keyof AppearanceConfig]>(
    store: Store | ElectronStore,
    appearanceKey: keyof AppearanceConfig,
    savedProfiles: SavedProfiles | undefined
): Result<T> => {
    const [value, _setValue] = useState<AppearanceConfig>();
    const [initialValue, setInitialValue] = useState<Wrapped<T>>();

    const storeKey = useMemo<string | undefined>(() => {
        if (!savedProfiles) {
            return undefined;
        }

        const activeProfileId = savedProfiles.activeProfileId ?? COMMON_PROFILE_ID;
        return StoreKeys.APPEARANCE_CONFIG + '.' + activeProfileId;
    }, [savedProfiles === undefined, savedProfiles?.activeProfileId]);

    useAsyncEffect(async () => {
        if (storeKey === undefined) {
            return;
        }

        const valueToSet: AppearanceConfig = await (store as any).get(storeKey, defaultAppearanceConfig);
        _setValue(valueToSet);
        setInitialValue({current: valueToSet[appearanceKey] as T});
    }, [storeKey, appearanceKey]);

    const setValue = useCallback<React.Dispatch<React.SetStateAction<T>>>((value) => {
        if (storeKey === undefined) {
            throw new Error('storeKey is undefined');
        }

        _setValue(currentValue => {
            if (currentValue === undefined) {
                return;
            }

            const newValue = isFunction(value)
                ? value(currentValue[appearanceKey] as T)
                : value;

            const newAppearance = {
                ...currentValue,
                [appearanceKey]: newValue
            };

            store.set(storeKey, newAppearance);
            ipcRenderer.invoke('appearance-settings-changed', appearanceKey, newValue, SOURCE_ID);

            return newAppearance;
        });
    }, [store, storeKey]);

    useEffect(() => {
        const handler = (event: AppearanceSettingsChangedEvent) => {
            if (!value) {
                throw new Error('value is undefined');
            }

            const {appearanceKey: eventAppearanceKey, config: newValue, sourceId} = event.detail;

            if (sourceId === SOURCE_ID) {
                return;
            }

            if (eventAppearanceKey !== appearanceKey) {
                // console.log('different appearance key', appearanceKey, 'when working with', eventAppearanceKey);
                return;
            }

            const previousValue = value[appearanceKey];

            if (newValue === previousValue) {
                // console.log('newValue equals to previousValue', previousValue);
                return;
            }

            // console.log('newValue is not equal to previousValue', {newValue, previousValue});

            setValue(newValue as T);
            setInitialValue({current: newValue as T});
        };

        window.addEventListener('appearance-settings-changed', handler);

        return () => {
            window.removeEventListener('appearance-settings-changed', handler);
        };
    }, [value, appearanceKey, setValue]);

    return useMemo(() => ({
        value: value?.[appearanceKey],
        initialValue,
        setValue
    } as Result<T>), [value, appearanceKey, initialValue, setValue]);
};

export default useAppearanceConfig;
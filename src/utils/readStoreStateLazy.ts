import ref, {NullableRef} from './ref';
import type Store from 'electron-store';
import type {ElectronStore} from '../electron-store/electronStoreShared';

const readStoreStateLazy = <T>(store: Store | ElectronStore, key: string, defaultValue: T, onChange?: (value: T) => void): NullableRef<T> => {
    const valueRef = ref<T>();

    const initialValue = (store as any).get(key, defaultValue);
    if (initialValue instanceof Promise) {
        initialValue.then(value => {
            valueRef.current = value;
            onChange?.(value);
        });
    } else {
        valueRef.current = initialValue;
        onChange?.(initialValue);
    }

    const unsubscribe = store.onDidChange(key, (newValue) => {
        valueRef.current = newValue as T;
        onChange?.(newValue as T);
    });

    return valueRef;
};

export default readStoreStateLazy;
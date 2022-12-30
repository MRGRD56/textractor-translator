import ref, {Ref} from './ref';
import type Store from 'electron-store';

const readStoreStateSync = <T>(store: Store, key: string, defaultValue: T, onChange?: (value: T) => void): Ref<T> => {
    const initialValue = (store as any).get(key, defaultValue);
    onChange?.(initialValue);
    const valueRef = ref<T>(initialValue);

    const unsubscribe = store.onDidChange(key, (newValue) => {
        valueRef.current = newValue as T;
        onChange?.(valueRef.current);
    });

    return valueRef;
};

export default readStoreStateSync;
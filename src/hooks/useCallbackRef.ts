import {MutableRefObject, useCallback, useMemo, useRef} from 'react';

const useCallbackRef = <T>(extraCallback?: (value: T) => void): [MutableRefObject<T | undefined>, (value: T | null) => void] => {
    const ref = useRef<T>();

    const refCallback = useCallback((value: T | null) => {
        ref.current = value ?? undefined;
        if (value != null) {
            extraCallback?.(value);
        }
    }, [extraCallback]);

    return useMemo(() => {
        return [ref, refCallback];
    }, [refCallback]);
};

export default useCallbackRef;
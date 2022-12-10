import { MutableRefObject, useEffect, useRef } from 'react';

const useAutoRef = <T>(value: T): Readonly<MutableRefObject<T>> => {
    const valueRef = useRef<T>(value);

    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    return valueRef;
};

export default useAutoRef;
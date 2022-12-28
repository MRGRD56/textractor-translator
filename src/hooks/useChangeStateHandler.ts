import { Dispatch, SetStateAction, useCallback } from 'react';
import call from '../utils/call';
import useChangeState from './useChangeState';
import { isChangeEvent, TypedChangeEvent } from './useChangeAnyStateHandler';
import ObjectKey from '../types/common/ObjectKey';

const useChangeStateHandler = <S extends object, P extends ObjectKey = 'value'>(
    setState: Dispatch<SetStateAction<S>>,
    property: P = 'value' as P
) => {
    const changeState = useChangeState(setState);

    return useCallback(
        <K extends keyof S, T extends S[K]>(key: K) => {
            return (value: TypedChangeEvent<T, P> | T) => {
                const actualValue = call(() => {
                    if (isChangeEvent(value)) {
                        const event = value as TypedChangeEvent<T, P>;
                        return event.target[property];
                    }

                    return value;
                });

                changeState(key, actualValue);
            };
        },
        [changeState]
    );
};

export default useChangeStateHandler;

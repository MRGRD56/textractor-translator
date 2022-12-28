import { Dispatch, SetStateAction } from 'react';
import { isObject } from 'lodash';
import call from '../utils/call';
import ObjectKey from '../types/common/ObjectKey';

export interface TypedChangeEvent<T, P extends ObjectKey> {
    target: {
        [key in P]: T;
    };
}

export const isChangeEvent = (value: unknown): value is TypedChangeEvent<unknown, ObjectKey> => {
    return isObject(value) && 'target' in value;
};

const useChangeAnyStateHandler = <S, P extends ObjectKey>(
    setState: Dispatch<SetStateAction<S>>,
    property: P = 'value' as P
) => {
    return (value: TypedChangeEvent<S, P> | S) => {
        const actualValue = call(() => {
            if (isChangeEvent(value)) {
                const event = value as TypedChangeEvent<S, P>;
                return event.target[property];
            }

            return value;
        });

        setState(actualValue);
    };
};

export default useChangeAnyStateHandler;

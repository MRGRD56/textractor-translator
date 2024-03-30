import { Dispatch, SetStateAction, useCallback } from 'react';

const useChangeState = <S extends object>(setState: Dispatch<SetStateAction<S>>) => {
    return useCallback(<K extends keyof S>(key: K, value: S[K]) => {
        setState((state) => ({
            ...state,
            [key]: value
        }));
    }, [setState]);
};

export default useChangeState;
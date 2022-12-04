export enum PromiseResultState {
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED'
}

export interface FulfilledPromiseResult<T> {
    state: PromiseResultState.FULFILLED;
    value: T;
}

export interface RejectedPromiseResult {
    state: PromiseResultState.REJECTED;
    error: any;
}

type PromiseResult<T> = FulfilledPromiseResult<T> | RejectedPromiseResult;

export default PromiseResult;

export const promiseToResult = <T>(promise: Promise<T>): Promise<PromiseResult<T>> => {
    return promise
        .then(value => ({
            state: PromiseResultState.FULFILLED,
            value
        } as FulfilledPromiseResult<T>))
        .catch(error => ({
            state: PromiseResultState.REJECTED,
            error
        } as RejectedPromiseResult));
};

export const resultToPromise = <T>(promiseResult: PromiseResult<T>): Promise<T> => {
    if (promiseResult.state === PromiseResultState.REJECTED) {
        return Promise.reject(promiseResult.error);
    }

    return Promise.resolve(promiseResult.value);
};
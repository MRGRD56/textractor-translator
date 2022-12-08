export interface Ref<T> {
    current: T;
}

export interface NullableRef<T> {
    current?: T;
}

function ref<T>(value: T): Ref<T>;
function ref<T>(value?: T): NullableRef<T>;
function ref<T>(value?: T): Ref<T> | NullableRef<T> {
    return {current: value};
}

export default ref;
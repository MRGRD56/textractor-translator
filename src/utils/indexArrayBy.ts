const indexArrayBy = <T, K extends keyof T>(array: T[], key: K): Map<T[K], T> => {
    return array.reduce((result, item) => {
        result.set(item[key], item);
        return result;
    }, new Map());
};

export default indexArrayBy;
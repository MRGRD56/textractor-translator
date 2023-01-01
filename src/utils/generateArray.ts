const generateArray = <T>(generator: () => Generator<T, void>): T[] => {
    return [...generator()];
};

export default generateArray;
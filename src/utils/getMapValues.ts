const getMapValues = <T>(map: Map<unknown, T>): T[] => {
    return Array.from(map.values());
};

export default getMapValues;
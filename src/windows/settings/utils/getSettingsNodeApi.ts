import type {SettingsNodeApi} from '../preload';

const getSettingsNodeApi = () => {
    return (window as any).nodeApi as SettingsNodeApi;
};

export default getSettingsNodeApi;
import {Configuration, DefinedTranslator} from './Configuration';
import safeEval from 'safe-eval';
import transformOriginal from '../transformation/transformOriginal';
import transformTranslated from '../transformation/transformTranslated';

interface Context {
    app: Configuration;
}

const getConfiguration = (configSourceCode: string): Configuration => {
    const context: Context = {
        app: {
            translator: 'GOOGLE_TRANSLATE',
            languages: {
                source: 'en',
                target: 'en'
            },
            transformOriginal: undefined,
            transformTranslated: undefined
        }
    };

    safeEval(configSourceCode, context);
    const config = context.app;
    config.transformOriginal = transformOriginal(config.transformOriginal);
    config.transformTranslated = transformTranslated(config.transformTranslated);

    return config;
};

export default getConfiguration;
import {Configuration} from './Configuration';
import safeEval from 'safe-eval';
import transformOriginal from '../transformation/transformOriginal';
import transformTranslated from '../transformation/transformTranslated';

interface CommonConfigContext {
    config: Configuration;
    common: object;
}

interface CustomConfigContext extends CommonConfigContext {
    commonConfig: Configuration;
}

const prepareConfig = (config: Configuration): Configuration => {
    config.transformOriginal = transformOriginal(config.transformOriginal);
    config.transformTranslated = transformTranslated(config.transformTranslated);
    return config;
};

const safeEvalVoid = (code: string, context?: Record<string, any>): void => {
    const functionCode = `(function () { ${code} })()`;
    safeEval(functionCode, context);
};

const getCommonConfiguration = (configSourceCode: string | undefined): CommonConfigContext => {
    const context: CommonConfigContext = {
        config: {
            translator: 'GOOGLE_TRANSLATE',
            languages: {
                source: 'en',
                target: 'en'
            },
            transformOriginal: undefined,
            transformTranslated: undefined
        },
        common: {}
    };

    if (configSourceCode != null) {
        safeEvalVoid(configSourceCode, context);
    }

    return {
        ...context,
        config: prepareConfig(context.config)
    };
};

const getConfiguration = (commonConfigSourceCode: string | undefined, configSourceCode: string | undefined): Configuration => {
    const commonConfigContext = getCommonConfiguration(commonConfigSourceCode);

    if (configSourceCode == null) {
        return commonConfigContext.config;
    }

    const context: CustomConfigContext = {
        common: commonConfigContext.common,
        commonConfig: commonConfigContext.config,
        config: {...commonConfigContext.config}
    };

    safeEvalVoid(configSourceCode, context);

    return context.config;
};

export default getConfiguration;
import {Configuration, DefinedTranslators} from './Configuration';
import safeEval from 'safe-eval';
import transformOriginal from '../transformation/transformOriginal';
import transformTranslated from '../transformation/transformTranslated';
import nodeConsole from '../utils/nodeConsole';
import {DefinedTranslatorsImpl} from '../translation/DefinedTranslators';
import httpRequest from '../utils/httpRequest';
import * as queryString from 'query-string';

interface CommonConfigContext {
    config: Configuration;
    common: object;
    memory: object;
    DefinedTranslators: DefinedTranslators;
    httpRequest: typeof httpRequest;
    queryString: typeof queryString
    console: Console;
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

const memory = {};

const getCommonConfiguration = (configSourceCode: string | undefined): CommonConfigContext => {
    const context: CommonConfigContext = {
        config: {
            translator: DefinedTranslatorsImpl.INSTANCE.GOOGLE_TRANSLATE,
            languages: {
                source: 'auto',
                target: 'en'
            },
            transformOriginal: undefined,
            transformTranslated: undefined
        },
        common: {},
        memory,
        DefinedTranslators: DefinedTranslatorsImpl.INSTANCE,
        httpRequest,
        queryString,
        console
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
    try {
        const commonConfigContext = getCommonConfiguration(commonConfigSourceCode);

        if (configSourceCode == null) {
            return commonConfigContext.config;
        }

        const context: CustomConfigContext = {
            common: commonConfigContext.common,
            commonConfig: commonConfigContext.config,
            config: {...commonConfigContext.config},
            memory,
            DefinedTranslators: DefinedTranslatorsImpl.INSTANCE,
            httpRequest,
            queryString,
            console
        };

        safeEvalVoid(configSourceCode, context);

        return context.config;
    } catch (e) {
        console.error('Error loading configuration', e);
        nodeConsole.error('Error loading configuration', e);
        throw e;
    }
};

export default getConfiguration;
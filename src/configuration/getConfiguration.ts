import {Configuration, DefinedTranslators} from './Configuration';
import safeEval from 'safe-eval';
import transformOriginal from '../transformation/transformOriginal';
import transformTranslated from '../transformation/transformTranslated';
import nodeConsole from '../utils/nodeConsole';
import httpRequest from '../utils/httpRequest';
import * as queryString from 'query-string';
import {DefinedTranslatorsImpl} from '../translation/DefinedTranslators';
import * as net from 'net';

interface CommonConfigContext {
    config: Configuration;
    common: object;
    memory: object;
    Translators: DefinedTranslators;
    httpRequest: typeof httpRequest;
    queryString: typeof queryString
    console: Console;
    URL: typeof URL,
    URLSearchParams: typeof URLSearchParams,
    net: typeof net
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
    const definedTranslators = new DefinedTranslatorsImpl();

    const context: CommonConfigContext = {
        config: {
            translator: definedTranslators.GoogleTranslate(),
            languages: {
                source: 'auto',
                target: 'en'
            },
            transformOriginal: undefined,
            transformTranslated: undefined
        },
        common: {},
        memory,
        Translators: definedTranslators,
        httpRequest,
        queryString,
        console,
        URL,
        URLSearchParams,
        net
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
            ...commonConfigContext,
            commonConfig: commonConfigContext.config,
            config: {...commonConfigContext.config},
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
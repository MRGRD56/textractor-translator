import {DefinedTranslators, LibreTranslatorConfig} from '../configuration/Configuration';
import GoogleTranslator from './translators/GoogleTranslator';
import IdentityTranslator from './translators/utility/IdentityTranslator';
import InfiniteTranslator from './translators/utility/InfiniteTranslator';
import NoneTranslator from './translators/utility/NoneTranslator';
import LibreTranslator from './translators/LibreTranslator';

export class DefinedTranslatorsImpl implements DefinedTranslators {
    constructor() {
        Object.keys(this).forEach((keyName) => {
            const key = keyName as keyof DefinedTranslatorsImpl;
            Object.defineProperty(this, key, {
                value: this[key],
                writable: false,
                configurable: false,
                enumerable: true
            });
        });
    }

    GoogleTranslate = () => {
        return new GoogleTranslator();
    };

    LibreTranslate = (config?: LibreTranslatorConfig) => {
        return new LibreTranslator(config || {});
    };

    debug = Object.freeze({
        Identity: () => new IdentityTranslator(),
        Infinite: () => new InfiniteTranslator(),
        None: () => new NoneTranslator()
    });
}
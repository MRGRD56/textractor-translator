import * as monaco from 'monaco-editor';
import '../../style/basic.css';
import './styles/settings.css';
// eslint-disable-next-line
// @ts-ignore
// eslint-disable-next-line
import configurationDeclarations from "!!raw-loader!../../configuration/Configuration";
import {CONFIG_SOURCE_KEY} from '../../constants/store-keys';
import {ElectronStore} from '../../electron-store/electronStoreShared';
import {defaultTransformerSource} from '../../configuration/constants';

window.addEventListener('DOMContentLoaded', async () => {
    const {store}: {
        store: ElectronStore
    } = (window as any).nodeApi;

    const originalTextTransformerInput = document.getElementById('original-text-transformer-javascript')!;

    const configDeclarationsUsable = configurationDeclarations
        .replace(/export default \w+;?/, '')
        .replace(/export ([a-z]+) /g, '$1 ');

    console.log(configDeclarationsUsable);

    // monaco.languages.typescript.typescriptDefaults.addExtraLib(configDeclarationsUsable);

    monaco.languages.typescript.javascriptDefaults.addExtraLib(configDeclarationsUsable + `
declare const app: Configuration;
`.trim());

    console.log('store.get(TRANSFORMER_SOURCE_KEY, defaultTransformerSource)', store.get(CONFIG_SOURCE_KEY, defaultTransformerSource))

    const value = (await store.get(CONFIG_SOURCE_KEY, defaultTransformerSource)) as string;

    const editor = monaco.editor.create(originalTextTransformerInput, {
        value: value,
        language: 'javascript',
        minimap: {enabled: false}
    });

    editor.onDidChangeModelContent(e => {
        store.set(CONFIG_SOURCE_KEY, editor.getValue());
    });
});
import * as monaco from 'monaco-editor';
import '../../../node_modules/material-symbols/index.css';
import '../../style/basic.scss';
import './styles/settings.scss';
// @ts-ignore
// eslint-disable-next-line
import configurationDeclarations from "!!raw-loader!../../configuration/Configuration";
import {CONFIG_SOURCE_KEY} from '../../constants/store-keys';
import {ElectronStore} from '../../electron-store/electronStoreShared';
import {defaultTransformerSource} from '../../configuration/constants';
import {initTabs} from './tabs';
import {createTab, TabsChangeCause} from '../../utils/tabsCore';

const initSettingsTabs = () => {
    const tabsApi = initTabs(document.getElementById('settings-tabs'), {
        list: [
            createTab('Common', {
                isPinned: true,
                icon: {
                    className: 'tab-icon-yellow',
                    name: 'star'
                },
                className: 'pinned'
            }),
            createTab('WA2', {
                className: 'activated',
                icon: {
                    className: 'tab-icon-blue',
                    name: 'check'
                }
            }),
            createTab('White Album 2'),
            createTab('Aokana')
        ]
    });

    tabsApi.onChange(tabsChanges => {
        for (const change of tabsChanges) {
            if (change.cause !== TabsChangeCause.ACTIVE_TAB_CHANGED) {
                continue;
            }

            console.log('Active tab changed to', change.activeTabId);

            break;
        }
    });
};

window.addEventListener('DOMContentLoaded', async () => {
    const {store}: {
        store: ElectronStore
    } = (window as any).nodeApi;

    const originalTextTransformerInput = document.getElementById('original-text-transformer-javascript')!;

    const configDeclarationsUsable = configurationDeclarations
        .replace(/export default \w+;?/, '')
        .replace(/export ([a-z]+) /g, '$1 ');

    initSettingsTabs();

    console.log(configDeclarationsUsable);

    // monaco.languages.typescript.typescriptDefaults.addExtraLib(configDeclarationsUsable);

    monaco.languages.typescript.javascriptDefaults.addExtraLib(configDeclarationsUsable + `
declare const app: Configuration;
`.trim());

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        ...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowJs: true,
        checkJs: true,
        strictFunctionTypes: true
    });

    console.log('store.get(TRANSFORMER_SOURCE_KEY, defaultTransformerSource)', store.get(CONFIG_SOURCE_KEY, defaultTransformerSource))

    const value = (await store.get(CONFIG_SOURCE_KEY, defaultTransformerSource)) as string;

    const editor = monaco.editor.create(originalTextTransformerInput, {
        value: value,
        language: 'javascript',
        minimap: {enabled: false},
        automaticLayout: true
    });

    editor.onDidChangeModelContent(e => {
        store.set(CONFIG_SOURCE_KEY, editor.getValue());
    });
});
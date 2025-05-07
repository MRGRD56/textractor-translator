import React, {FC, useEffect} from 'react';
// @ts-ignore
// eslint-disable-next-line
import configurationDeclarations from "!!raw-loader!../../../configuration/Configuration";
// @ts-ignore
// eslint-disable-next-line
import queryStringDeclarations from '!!raw-loader!query-string/index.d.ts'
// @ts-ignore
// eslint-disable-next-line
import nodeNetDeclarations from '!!raw-loader!@types/node/net.d.ts'
// @ts-ignore
// eslint-disable-next-line
import langsDeclarations from '!!raw-loader!@types/langs/index.d.ts'
import * as monaco from 'monaco-editor';
import SavedProfile from '../profiles/SavedProfile';
import {COMMON_PROFILE_ID} from '../profiles/constants';

const initializeMonacoTypes = (isCommon: boolean) => {
    const configDeclarationsUsable = configurationDeclarations
        .replace(/export default \w+;?/, '')
        .replace(/export \{.*};/g, '')
        .replace(/export ([a-z]+) /g, '$1 ')
        .replace(/import .+;/g, '');

    monaco.languages.typescript.javascriptDefaults.setExtraLibs([
        {
            content: nodeNetDeclarations
                .replace('declare module \'net\' {', 'declare namespace net {')
                .replace('declare module \'node:net\' {\n    export * from \'net\';\n}', ''),
            filePath: 'node/net.ts'
        },
        {
            content: langsDeclarations
                .replace('export = langs;', ''),
            filePath: 'langs.ts'
        },
        {
            content: 'declare namespace queryString {\n' + (queryStringDeclarations.toString()
                .replace(/export \{.*};/g, ''))
            + '\n}',
            filePath: 'queryString.ts'
        },
        {
            content: configDeclarationsUsable + `
declare const config: Configuration;
const common: object;
const memory: object;
const Translators: DefinedTranslators;
const queryString: any;
const httpRequest: typeof window.fetch;
const OpenAI: any;
const languagesCodeToNameMap: Record<string, string>;
`.trimEnd() + (isCommon ? '' : `

declare const commonConfig: Configuration;
`.trimEnd()),
            filePath: 'Configuration.ts'
        }
    ]);

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        ...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowJs: true,
        checkJs: true,
        strictFunctionTypes: true
    });
};

interface Props {
    profile: SavedProfile;
    onSourceChange: (profileId: string, profileSource: string) => void;
}

const ProfileSourceEditor: FC<Props> = ({profile, onSourceChange}) => {
    useEffect(() => {
        const originalTextTransformerInput = document.getElementById('original-text-transformer-javascript')!;

        // monaco.languages.typescript.typescriptDefaults.addExtraLib(configDeclarationsUsable);

        initializeMonacoTypes(profile.id === COMMON_PROFILE_ID);

        // const value = (await store.get(CONFIG_SOURCE_KEY, defaultTransformerSource)) as string;
        const value = profile.configSource;

        const editor = monaco.editor.create(originalTextTransformerInput, {
            value: value,
            language: 'javascript',
            minimap: {enabled: false},
            automaticLayout: true
        });

        editor.onDidChangeModelContent(e => {
            // store.set(CONFIG_SOURCE_KEY, editor.getValue());
            onSourceChange(profile.id, editor.getValue());
        });

        return () => {
            editor.dispose();
        };
    }, [profile.id]);

    return (
        <div className="txx-monaco-editor-container-wrapper">
            <div id="original-text-transformer-javascript" className="txx-monaco-editor-container"/>
        </div>
    );
};

export default ProfileSourceEditor;
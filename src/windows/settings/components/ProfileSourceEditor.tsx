import React, {FC, useEffect} from 'react';
// @ts-ignore
// eslint-disable-next-line
import configurationDeclarations from "!!raw-loader!../../../configuration/Configuration";
// @ts-ignore
// eslint-disable-next-line
import electronRequestDeclarations from '!!raw-loader!electron-request/dist/index'
// @ts-ignore
// eslint-disable-next-line
// import queryStringDeclarations from '!!raw-loader!query-string/index'
import * as monaco from 'monaco-editor';
import SavedProfile from '../profiles/SavedProfile';
import {COMMON_PROFILE_ID} from '../profiles/constants';

const initializeMonacoTypes = (isCommon: boolean) => {
    const declarations = [
        electronRequestDeclarations.toString()
            .replace(/declare const main:.*;/g, ''),
        configurationDeclarations,
    ];

    const configDeclarationsUsable = declarations
        .join('\n\n')
        .replace(/export default \w+;?/, '')
        .replace(/export ([a-z]+) /g, '$1 ')
        .replace(/export \{.*};/g, '');

    monaco.languages.typescript.javascriptDefaults.setExtraLibs([
        {
            content: configDeclarationsUsable + `
declare const config: Configuration;
const common: object;
const memory: object;
const DefinedTranslators: DefinedTranslators;
const httpRequest: (requestURL: string, options?: Options) => Promise<Response>;
const queryString: any;
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
        <div className="settings-profile-editor-wrapper">
            <div id="original-text-transformer-javascript" className="original-text-transformer-editor"/>
        </div>
    );
};

export default ProfileSourceEditor;
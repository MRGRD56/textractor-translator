import React, {FC, useEffect} from 'react';
// @ts-ignore
// eslint-disable-next-line
import configurationDeclarations from "!!raw-loader!../../../configuration/Configuration";
import * as monaco from 'monaco-editor';
import SettingsProfile from '../profiles/SettingsProfile';
import {COMMON_PROFILE_ID} from '../profiles/constants';

const initializeMonacoTypes = (isCommon: boolean) => {
    const configDeclarationsUsable = configurationDeclarations
        .replace(/export default \w+;?/, '')
        .replace(/export ([a-z]+) /g, '$1 ');

    monaco.languages.typescript.javascriptDefaults.setExtraLibs([
        {
            content: configDeclarationsUsable + `
declare const config: Configuration;
const common: object;
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
    profile: SettingsProfile;
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
            <div id="original-text-transformer-javascript" className="original-text-transformer-editor" />
        </div>
    );
};

export default ProfileSourceEditor;
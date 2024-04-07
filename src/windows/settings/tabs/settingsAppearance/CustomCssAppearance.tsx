import React, {FC, useEffect, useRef, useState} from 'react';
import styles from '../SettingsAppearance.module.scss';
import * as monaco from 'monaco-editor';
import {editor} from 'monaco-editor';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import classNames from 'classnames';
import {useWillUnmount} from 'rooks';

interface Props {
    customCss: string | undefined;
    onCustomCssChange: (customCss: string) => void;
}

const CustomCssAppearance: FC<Props> = ({customCss, onCustomCssChange}) => {
    const editorElementRef = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<IStandaloneCodeEditor>();

    useEffect(() => {
        console.log('customCss-useEffect', {customCss});

        if (editor) {
            if (customCss != null) {
                editor.setValue(customCss);
            }

            return;
        }

        const editorElement = editorElementRef.current!;

        const newEditor = monaco.editor.create(editorElement, {
            value: customCss,
            language: 'css',
            minimap: {enabled: false},
            automaticLayout: true
        });

        setEditor(newEditor);

        newEditor.onDidChangeModelContent(e => {
            const value = newEditor.getValue();
            console.log('onDidChangeModelContent', {value});
            onCustomCssChange(value);
        });
    }, [customCss, editor]);

    useWillUnmount(() => {
        editor?.dispose();
    });

    return (
        <div className={classNames(styles.appearanceProfilesContainer, 'txx-monaco-editor-container-wrapper')}>
            <div ref={editorElementRef} className="txx-monaco-editor-container"/>
        </div>
    );
};

export default CustomCssAppearance;
import React, {FC, useCallback, useEffect, useRef} from 'react';
import styles from '../SettingsAppearance.module.scss';
import * as monaco from 'monaco-editor';
import classNames from 'classnames';
import {useWillUnmount} from 'rooks';
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import {Wrapped} from '../../../../hooks/useAppearanceConfig';
import useAutoRef from '../../../../utils/useAutoRef';

interface Props {
    initialCustomCss: Wrapped<string | undefined>;
    onCustomCssChange: (customCss: string) => void;
}

const CustomCssAppearance: FC<Props> = ({initialCustomCss, onCustomCssChange}) => {
    const onCustomCssChangeRef = useAutoRef(onCustomCssChange);

    const editorRef = useRef<IStandaloneCodeEditor>();
    const editorElementRef = useRef<HTMLDivElement>(null);

    const createModelChangeHandler = useCallback(() => () => {
        const editor = editorRef.current;
        if (!editor) {
            throw new Error('Editor is undefined');
        }

        const value = editor.getValue();
        onCustomCssChangeRef.current(value);
    }, []);

    useEffect(() => {
        editorRef.current?.dispose();

        const editorElement = editorElementRef.current!;

        const newEditor = monaco.editor.create(editorElement, {
            value: initialCustomCss.current,
            language: 'css',
            minimap: {enabled: false},
            automaticLayout: true
        });

        editorRef.current = newEditor;

        newEditor.onDidChangeModelContent(createModelChangeHandler());
    }, [initialCustomCss]);

    useWillUnmount(() => {
        editorRef.current?.dispose();
    });

    return (
        <div className={classNames(styles.appearanceProfilesContainer, 'txx-monaco-editor-container-wrapper')}>
            <div ref={editorElementRef} className="txx-monaco-editor-container"/>
        </div>
    );
};

export default CustomCssAppearance;
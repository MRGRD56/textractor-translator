import React, {useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import styles from './InputColor.module.scss';
import {Input, InputProps, InputRef} from 'antd';
import classNames from 'classnames';
import {useDidMount} from 'rooks';
import {isString} from 'lodash';

export interface InputColorProps extends InputProps {
    placeholderColor?: string;
}

const InputColor = React.forwardRef<InputRef, InputColorProps>(({placeholderColor, type, className, value, onChange, placeholder, ...props}, ref) => {
    const inputRef = useRef<InputRef>(null);

    const [actualValue, setActualValue] = useState<string>();

    useImperativeHandle(ref, () => inputRef.current!);

    useDidMount(() => {
        const input = inputRef.current?.input;
        if (!input) {
            return;
        }

        setActualValue(input.value);
    });

    useEffect(() => {
        if (isString(value)) {
            setActualValue(value);
        }
    }, [value]);

    const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        setActualValue(event.currentTarget.value);
        onChange?.(event);
    }, [onChange]);

    return (
        <Input
            ref={inputRef}
            type={type || 'color'}
            className={classNames('app-input-color', styles.input, className)}
            data-value={value == null ? (placeholder || 'Not selected') : actualValue}
            data-empty={value == null ? 'true' : 'false'}
            value={value || placeholderColor || '#000000'}
            onChange={handleChange}
            {...props}
        />
    );
});

export default InputColor;
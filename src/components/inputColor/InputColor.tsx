import React, {FC, useCallback, useRef, useState} from 'react';
import styles from './InputColor.module.scss';
import {Input, InputProps, InputRef} from 'antd';
import classNames from 'classnames';
import {useDidMount} from 'rooks';

export type InputColorProps = InputProps;

const InputColor: FC<InputColorProps> = ({type, className, onChange, ...props}) => {
    const inputRef = useRef<InputRef>(null);

    const [actualValue, setActualValue] = useState<string>();

    useDidMount(() => {
        const input = inputRef.current?.input;
        if (!input) {
            return;
        }

        setActualValue(input.value);
    });

    const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        setActualValue(event.currentTarget.value);
        onChange?.(event);
    }, [onChange]);

    return (
        <Input
            ref={inputRef}
            type={type || 'color'}
            className={classNames(styles.input, className)}
            data-value={actualValue}
            onChange={handleChange}
            {...props}
        />
    );
};

export default InputColor;
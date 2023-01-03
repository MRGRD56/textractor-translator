import React, {FC, useRef} from 'react';
import InputColor, {InputColorProps} from './InputColor';
import ClearIcon from '../ClearIcon';
import classNames from 'classnames';
import styles from './InputColor.module.scss';
import {InputRef} from 'antd';

export interface InputColorExtendedProps extends Omit<InputColorProps, 'value' | 'onChange'> {
    value?: string;
    onChange?: (value: string | undefined, event?: React.ChangeEvent<HTMLInputElement>) => void;
    containerClassName?: string;
}

const InputColorExtended: FC<InputColorExtendedProps> = ({value, onChange, containerClassName, allowClear, ...props}) => {
    const inputRef = useRef<InputRef>(null);

    const handleClearClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();

        onChange?.(undefined);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.currentTarget.value, event);
    };

    return (
        <div className={classNames(containerClassName, styles.extendedContainer)}>
            <InputColor value={value} onChange={handleChange} ref={inputRef} {...props}/>
            {allowClear && Boolean(value) && <ClearIcon className={styles.clearIcon} onClickCapture={handleClearClick}/>}
        </div>
    );
};

export default InputColorExtended;
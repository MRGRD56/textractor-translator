import React, {FC} from 'react';
import {Button, ButtonProps} from 'antd';

interface Props extends ButtonProps {
    checked?: boolean;
    onCheckedChange?: (isChecked: boolean) => void;
}

const CheckboxButton: FC<Props> = ({checked, onCheckedChange, type, onClick, ...props}) => {
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        onCheckedChange?.(!checked);
        onClick?.(event);
    };

    return (
        <Button type={type ?? (checked ? 'primary' : 'default')} onClick={handleClick} {...props}/>
    );
};

export default CheckboxButton;
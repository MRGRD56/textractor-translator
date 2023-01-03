import React, {FC} from 'react';
import {Slider, SliderSingleProps} from 'antd';
import classNames from 'classnames';
import styles from './ValueSlider.module.scss';

type Props = SliderSingleProps & {
    containerClassName?: string;
};

const ValueSlider: FC<Props> = ({value, tipFormatter, containerClassName, className, ...props}) => {
    return (
        <div className={classNames('flex-row-100', containerClassName)}>
            <Slider className={classNames('flex-row-100-child', className)} value={value} tipFormatter={tipFormatter} {...props}/>
            <div className={styles.value}>{value != null ? (tipFormatter ? tipFormatter?.(value) : value) : value}</div>
        </div>
    );
};

export default ValueSlider;
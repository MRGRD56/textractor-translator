import type {ReactNode} from 'react';

export const createNumberFormatter = (formatter: (value: number) => ReactNode) => (value: number | undefined): ReactNode => {
    if (value == null) {
        return;
    }

    return formatter(value);
};

export const percentageFormatter = createNumberFormatter((value: number) => `${value}%`);
export const pxFormatter = createNumberFormatter((value: number) => `${value}px`);
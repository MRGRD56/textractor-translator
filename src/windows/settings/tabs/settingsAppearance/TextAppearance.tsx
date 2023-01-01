import React, {FC} from 'react';
import {ChangeStateHandler} from '../../../../hooks/useChangeStateHandler';
import TextAppearanceConfig from '../../../../configuration/appearance/TextAppearanceConfig';

interface Props {
    appearance: TextAppearanceConfig;
    onAppearanceChange: ChangeStateHandler<TextAppearanceConfig>;
}

const TextAppearance: FC<Props> = ({appearance, onAppearanceChange}) => {
    return (
        <div>

        </div>
    );
};

export default TextAppearance;
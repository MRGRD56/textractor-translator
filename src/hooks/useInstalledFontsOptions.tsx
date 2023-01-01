import type {IpcRenderer} from 'electron';
import {SelectProps} from 'antd';
import useInstalledFonts from './useInstalledFonts';
import {useMemo} from 'react';

const useInstalledFontsOptions = (ipcRenderer: IpcRenderer): SelectProps['options'] | undefined => {
    const fonts = useInstalledFonts(ipcRenderer);

    return useMemo(() => {
        if (!fonts) {
            return undefined;
        }

        return fonts.map(font => ({
            value: font,
            label: <div style={{fontFamily: `"${font}"`}} title={font}>{font}</div>
        }));
    }, [fonts]);
};

export default useInstalledFontsOptions;
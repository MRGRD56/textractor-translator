import type {IpcRenderer} from 'electron';
import {useState} from 'react';
import {useDidMount} from 'rooks';
import type {IOptions} from 'font-list';

const useInstalledFonts = (ipcRenderer: IpcRenderer): string[] | undefined => {
    const [fonts, setFonts] = useState<string[]>();

    useDidMount(async () => {
        const fonts = await ipcRenderer.invoke('get-installed-fonts', {
            disableQuoting: true
        } as IOptions) as string[];

        setFonts(fonts || []);
    });

    return fonts;
};

export default useInstalledFonts;
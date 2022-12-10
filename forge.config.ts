import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
    packagerConfig: {},
    rebuildConfig: {},
    makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
    plugins: [
        new WebpackPlugin({
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        name: 'main_window',
                        html: './src/windows/main/index.html',
                        js: './src/windows/main/renderer.tsx',
                        preload: {
                            js: './src/windows/main/preload.tsx',
                        },
                    },
                    {
                        name: 'settings_window',
                        html: './src/windows/settings/settings.html',
                        js: './src/windows/settings/renderer.tsx',
                        preload: {
                            js: './src/windows/settings/preload.tsx',
                        },
                    },
                ],
            },
        }),
    ],
};

export default config;

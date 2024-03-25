import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import path from 'path';

export const mainConfig: Configuration = {
    /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
    entry: './src/index.ts',
    // Put your normal webpack config below here
    module: {
        rules,
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.sass', '.json'],
        alias: {
            '@types/node': path.resolve(__dirname, 'node_modules/@types/node')
        }
    },
};

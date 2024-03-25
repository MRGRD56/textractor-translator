import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');

rules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
    module: {
        rules,
    },
    plugins: [
        ...plugins,
        // new webpack.ExternalsPlugin('commonjs', [
        //     'electron'
        // ])
    ],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        alias: {
            '@types/node': path.resolve(__dirname, 'node_modules/@types/node')
        }
    },
};

import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type MonacoEditorWebpackPluginType from 'monaco-editor-webpack-plugin';
import * as path from 'path';
import CopyWebpackPlugin = require('copy-webpack-plugin');

const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MonacoEditorWebpackPlugin: typeof MonacoEditorWebpackPluginType = require('monaco-editor-webpack-plugin');

export const plugins = [
    new ForkTsCheckerWebpackPlugin({
        logger: 'webpack-infrastructure',
    }),
    new MonacoEditorWebpackPlugin(),
    new CopyWebpackPlugin({
        patterns: [
            {
                from: path.resolve(__dirname, 'src', 'assets'),
                to: path.resolve(__dirname, '.webpack/renderer', 'assets')
            }
        ]
    })
];

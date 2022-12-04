import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type MonacoEditorWebpackPluginType from 'monaco-editor-webpack-plugin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoEditorWebpackPlugin: typeof MonacoEditorWebpackPluginType = require('monaco-editor-webpack-plugin');


export const plugins = [
    new ForkTsCheckerWebpackPlugin({
        logger: 'webpack-infrastructure',
    }),
    new MonacoEditorWebpackPlugin()
];

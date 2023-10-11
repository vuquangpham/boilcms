const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const {CORE_DIRECTORY} = require("../core/utils/config.utils");

// front end
const dirApp = path.join(__dirname, '..', 'app');
const dirShared = path.join(__dirname, '..', 'shared');
const dirPublic = path.join(__dirname, '..', 'public', 'themes');

// backend
const dirAppBE = path.join(CORE_DIRECTORY, 'assets', 'js');

module.exports = {
    entry: {
        'main-fe': path.join(dirApp, 'index.js'),
        'main-be': path.join(dirAppBE, 'index.js'),
    },

    output: {
        path: path.resolve(__dirname, '..', 'public', 'themes'),
        assetModuleFilename: '[name][ext]',
        clean: true,
    },

    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
            '@': dirApp
        },
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),

        new CopyWebpackPlugin({
            patterns: [

                {
                    from: dirShared,
                    to: dirPublic,
                    noErrorOnMissing: true
                }
            ]
        }),

        new CleanWebpackPlugin(),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                },
            },

            {
                test: /\.scss$/,
                use: [
                    {loader: MiniCssExtractPlugin.loader,},
                    {
                        loader: 'css-loader',
                        options: {sourceMap: false,},
                    },
                    {loader: 'postcss-loader',},
                    {loader: 'sass-loader',},
                ],
            },

            {
                test: /\.(png|jpg|gif|jpe?g|svg|woff2?|fnt|webp|mp4)$/,
                type: 'asset/resource',
                generator: {
                    filename: '[name].[hash].[ext]',
                },
            },

            {
                test: /\.(glsl|frag|vert)$/,
                type: 'asset/source', // replaced raw-loader
                exclude: /node_modules/,
            },
        ],
    },

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};
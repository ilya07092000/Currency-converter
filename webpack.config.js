const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
require('babel-polyfill');

const PATHS = {
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname, 'docs')
}

module.exports = {
    entry: {
        main: ['babel-polyfill', PATHS.src + '/script.js']
    },
    output: {
        path: PATHS.dist,
        filename: 'js/bundle.js',
    },
    devServer: {
        port: 2288
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css'
        }),
        new CleanWebpackPlugin(),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: PATHS.src + '/img/',
        //             to: 'img',
        //         },
        //     ]
        // })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            plugins: [require('autoprefixer')],
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    browsers:['ie >= 11', 'last 2 version']
                                })
                            ],
                        },
                    },
                    'sass-loader'
                ]
            },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            {
                test: /\.(png|svg|jpe?g|gif|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { name: 'img/[name].[ext]' },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { name: 'fonts/[name].[ext]' },
                    },
                ],
            },
        ]
    },
}

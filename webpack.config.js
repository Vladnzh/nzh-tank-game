const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

const config = {
    plugins: [new MiniCssExtractPlugin(), new HotModuleReplacementPlugin(), new ErrorOverlayPlugin()],
    devtool: 'cheap-module-source-map',
    mode: 'production',
    entry: {
        app: ['./src/index.ts', 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './build'),
        publicPath: '/build',
    },
    module: {
        rules: [
            {
                test: /|.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            controllers: path.resolve(__dirname, 'src/controller'),
            models: path.resolve(__dirname, 'src/models'),
            views: path.resolve(__dirname, 'src/view'),
        },
    },
    devServer: {
        overlay: true,
    },
};

module.exports = () => {
    if (process.env.NODE_ENV !== 'production') {
        config.mode = 'development';
    }

    return config;
};

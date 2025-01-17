const path = require('path');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

// Common configuration
const commonConfig = {
    mode: process.env.NODE_ENV || 'development',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};

const configs = {
    umd: {
        ...commonConfig,
        name: 'umd',
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.js',
            library: 'RTWidgetMedals',
            libraryTarget: 'umd',
            umdNamedDefine: true,
            globalObject: 'this'
        },
        externals: {
            react: {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'react',
                root: 'React'
            },
            'react-dom': {
                commonjs: 'react-dom',
                commonjs2: 'react-dom',
                amd: 'react-dom',
                root: 'ReactDOM'
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'dist/iframe.html'),
                        to: path.resolve(__dirname, 'dist/iframe.html')
                    }
                ]
            })
        ]
    },
    loader: {
        ...commonConfig,
        name: 'loader',
        entry: './src/loader.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'loader.js',
            libraryTarget: 'umd',
            globalObject: 'this'
        },
        externals: {
            react: {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'react',
                root: 'React'
            },
            'react-dom': {
                commonjs: 'react-dom',
                commonjs2: 'react-dom',
                amd: 'react-dom',
                root: 'ReactDOM'
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            })
        ]
    },
    esm: {
        ...commonConfig,
        name: 'esm',
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist/esm'),
            filename: 'index.js',
            library: {
                type: 'module'
            }
        },
        experiments: {
            outputModule: true
        },
        externals: {
            react: 'react',
            'react-dom': 'react-dom'
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            })
        ]
    },
    federation: {
        ...commonConfig,
        name: 'federation',
        entry: './src/loader.ts',
        output: {
            path: path.resolve(__dirname, 'dist/federation'),
            publicPath: '/widget-medals/federation/',
            clean: true
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            }),
            new ModuleFederationPlugin({
                name: 'medals_widget',
                filename: 'remoteEntry.js',
                exposes: {
                    './Widget': './src/loader.ts'
                },
                shared: {
                    react: {
                        singleton: true,
                        eager: true,
                        requiredVersion: '^18.0.0'
                    },
                    'react-dom': {
                        singleton: true,
                        eager: true,
                        requiredVersion: '^18.0.0'
                    }
                }
            })
        ]
    },
    webcomponent: {
        ...commonConfig,
        name: 'webcomponent',
        entry: './src/web-components/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist/web-components'),
            filename: 'index.js',
            publicPath: '/widget-medals/web-components/'
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            }),
            new ModuleFederationPlugin({
                name: 'medals_widget_webcomponent',
                filename: 'remoteEntry.js',
                exposes: {
                    './WebComponent': './src/web-components/index.ts'
                },
                shared: {
                    react: {
                        singleton: true,
                        eager: true,
                        requiredVersion: '^18.0.0'
                    },
                    'react-dom': {
                        singleton: true,
                        eager: true,
                        requiredVersion: '^18.0.0'
                    }
                }
            })
        ]
    }
};

// Export a function that returns a single configuration based on the environment
module.exports = Object.values(configs); 
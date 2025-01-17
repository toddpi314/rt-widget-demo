const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {}, // No entry points needed as we're serving static HTML
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
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
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    // Static pages
    new HtmlWebpackPlugin({
      template: './public/harness/basic.html',
      filename: 'basic.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: './public/harness/embedded.html',
      filename: 'embedded.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: './public/harness/cdn.html',
      filename: 'cdn.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: './public/harness/script-embed.html',
      filename: 'script-embed.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: './public/harness/iframe-embed.html',
      filename: 'iframe-embed.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: './public/harness/web-component.html',
      filename: 'web-component.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: './public/harness/federation.html',
      filename: 'federation.html',
      inject: false,
    }),
    // Index page listing all scenarios
    new HtmlWebpackPlugin({
      template: './public/harness/index.html',
      filename: 'index.html',
      inject: false,
      templateParameters: {
        scenarios: [
          'basic',
          'embedded',
          'cdn',
          'script-embed',
          'iframe-embed',
          'web-component',
          'federation'
        ],
      },
    }),
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'public'),
      },
      {
        directory: path.join(__dirname, '../widget-medals/dist'),
        publicPath: '/widget-medals'
      },
      {
        directory: path.join(__dirname, '../widget-medals/dist/web-components'),
        publicPath: '/widget-medals/web-components'
      }
    ],
    port: 8080,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      "Content-Security-Policy": "default-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline';"
    }
  }
}; 
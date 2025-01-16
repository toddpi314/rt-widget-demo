const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

// Get all test scenarios
const scenarioFiles = fs.readdirSync(
  path.resolve(__dirname, 'src/scenarios')
).filter(file => file.endsWith('.js'));

// Create entry points for each scenario
const entries = {};
scenarioFiles.forEach(file => {
  const name = file.replace('.js', '');
  entries[name] = `./src/scenarios/${file}`;
});

module.exports = {
  mode: 'development',
  entry: entries,
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
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 8080,
    hot: true,
  },
  plugins: [
    // Create an HTML file for each scenario
    ...scenarioFiles.map(file => {
      const name = file.replace('.js', '');
      return new HtmlWebpackPlugin({
        template: `./public/harness/${name}.html`,
        filename: `${name}.html`,
        chunks: [name],
      });
    }),
    // Index page listing all scenarios
    new HtmlWebpackPlugin({
      template: './public/harness/index.html',
      filename: 'index.html',
      inject: false,
      templateParameters: {
        scenarios: scenarioFiles.map(f => f.replace('.js', '')),
      },
    }),
  ],
}; 
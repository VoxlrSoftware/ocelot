/* eslint-disable */
var path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: '[name].map',
    publicPath: '/static/'
  },
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: {
      index: 'index.html'
    },
    hot: true
  },
  node: {
    fs: 'empty',
    net: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|ttf|eot)$/,
        use: ['file-loader']
      },
      {
        test: /\.js|.jsx?$/,
        exclude: /(node_modules)/,
        loaders: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: [{
            loader: 'style-loader'
        }, {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              advanced: true,
              autoprefixer: true
            }
        }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
        }]
    }]
  },
}
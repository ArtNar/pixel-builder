const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path');
const devConfig = require('./webpack.config.dev');

const commonConfig = {
  target: "web",
  entry: {
    main: path.resolve('src/index.tsx'),
  },
  output: {
      publicPath: '/',
      path: path.resolve('dist'),
      filename: '[name].[hash].bundle.js',
      chunkFilename: '[name].[hash].bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`
              implementation: require("sass"),
            },
          },
        ],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2|png|svg)$/,
        use: 'file-loader',
        exclude: /\.inline.svg$/,
      },
      {
        test: /\.inline.svg$/,
        use: [
          { loader: 'react-svg-loader' },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: path.resolve('src/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[name].[hash].css',
    }),
  ],
};

module.exports = (env, { mode = 'production' }) => {
  return merge(commonConfig, mode === 'production' ? prodConfig : devConfig, { mode });
}

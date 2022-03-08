const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');


module.exports = {
  devServer: {
    static: true,
    hot: true,
    historyApiFallback: true,
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
  },
  devtool: 'inline-source-map',
  plugins: [
    new ReactRefreshPlugin(),
  ],
};

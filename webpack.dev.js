const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge (common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    historyApiFallback: { disableDotRule: true },
    proxy: {
      '/': 'http://localhost:3001'
    },
    open: true,
    overlay: true,
    stats: 'errors-only'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?sourceMap'
        ]
      },
    ]
  }
});

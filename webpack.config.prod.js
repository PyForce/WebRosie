var webpack = require('webpack');
var config = require('./webpack.config');

config.plugins.push(
  new webpack.LoaderOptionsPlugin({
    minify: true,
    debug: false
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    beautify: false,
    mangle: {
      screw_ie8: true,
      keep_fnames: true
    },
    compress: {
      screw_ie8: true
    }
  })
);

module.exports = config;

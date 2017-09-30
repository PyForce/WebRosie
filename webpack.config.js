var path = require('path');
var webpack = require('webpack');

var config = {
  context: __dirname
};

config.entry = [
  'babel-polyfill',
  path.join(__dirname, 'src', 'js', 'main.js')
];

config.module = {
  rules: [{
    test: /\.jsx?$/,
    loader: 'babel-loader',
    exclude: /node_modules/
  }],
};

config.output = {
  filename: '[name].bundle.js',
  chunkFilename: '[id].chunk.js',
  path: path.join(__dirname, 'public', 'static', 'js'),
  publicPath: '/static/js'
};

config.plugins = [
  new webpack.SourceMapDevToolPlugin({
    test: /.*\.js(x)?$/,
    filename: 'main.bundle.js.map'
  })
];

config.resolve = {
  extensions: [
    '.js',
    '.jsx'
  ],
  modules: [
    path.join(__dirname, 'src'),
    path.join(__dirname, 'node_modules')
  ]
};

module.exports = config;

var path = require('path');
var webpack = require('webpack');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');

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
  }, {
    test: /\.(le|c)ss$/,
    use: ExtractTextWebpackPlugin.extract({
      use: [{
        loader: 'css-loader'
      },{
        loader: 'postcss-loader', options: {
          plugins: [
            require('autoprefixer'),
            require('cssnano')
          ]
        }
      }, {
        loader: 'less-loader', options: {
          paths: [
            path.resolve(__dirname, 'node_modules')
          ]
        }
      }]
    })
  }, {
    test: /\.(jpe?g)|(png)|(gif)$/,
    loader: 'file-loader'
  }],
};

config.output = {
  filename: '[name].js',
  chunkFilename: 'chunk.js',
  path: path.join(__dirname, 'public'),
  // publicPath: '/'
};

config.plugins = [
  new webpack.SourceMapDevToolPlugin({
    test: /.*\.js(x)?$/,
    filename: '[name].js.map'
  }),
  new ExtractTextWebpackPlugin({
    filename: '[name].css'
  }),
  new HTMLWebpackPlugin({
    title: 'WebRosie',
    template: 'index.ejs',
    favicon: 'favicon.png',
    minify: {
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      useShortDoctype: true
    }
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

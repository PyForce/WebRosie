const gulp = require('gulp'),
  webpack = require('webpack'),
  watch = require('gulp-watch'),
  less = require('gulp-less'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('cssnano');

const webpackConfig = require('./webpack.config');

const LESS_SRC = './src/less/main.less',
      LESS = less({
        paths: ['.', './node_modules']
      }),
      POSTCSS = postcss([
          autoprefixer()
      ]);

function onBuild (name, done) {
  return (err, stats) => {
    if (err)
      console.log('Error compiling ' + name, err);

    if (stats)
      console.log(stats.toString({
        colors: true,
        chunkModules: false
      }));

    if (done)
      done();
  };
}

gulp.task('js:compile', (done) => {
  webpack(webpackConfig, onBuild('js', done));
});

gulp.task('js:prod', (done) => {
  var prodConfig = Object.create(webpackConfig);
  prodConfig.plugins = prodConfig.plugins.concat(
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);
  webpack(prodConfig, onBuild('js', done));
});

gulp.task('js:watch', () => {
  webpack(webpackConfig).watch(100, onBuild('js'));
});

gulp.task('css:compile', () => gulp.src(LESS_SRC)
    .pipe(LESS)
    .pipe(POSTCSS)
    .pipe(gulp.dest('./static/css'))
);

gulp.task('css:prod', () => gulp.src(LESS_SRC)
    .pipe(LESS)
    .pipe(postcss([
        autoprefixer(), 
        cssnano({ safe: true }) 
    ]))
    .pipe(gulp.dest('./static/css'))
);

gulp.task('css:watch', () => gulp.src(LESS_SRC)
    .pipe(watch('./src/less/**/*'))
    .pipe(LESS)
    .pipe(POSTCSS)
    .pipe(gulp.dest('./static/css'))
);

gulp.task('compile', ['js:compile', 'css:compile']);
gulp.task('prod',    ['js:prod', 'css:prod']);
gulp.task('watch',   ['js:watch', 'css:watch']);

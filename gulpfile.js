const gulp = require("gulp")

const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')

const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')

function assets(cb) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            return reject(err)
        }
        if (stats.hasErrors()) {
            return reject(new Error(stats.compilation.errors.join('\n')))
        }
        resolve()
    })
})
}

gulp.task('buildStyles', () => {
  return gulp.src('./src/sass/**/*.scss')
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 2 versions'],
    cascade: false
}))
  .pipe(gulp.dest('./dist/css/'))
})

gulp.task('minifyStyles', () => {
  return gulp.src('./dist/css/*.css')
  .pipe(sourcemaps.init())
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./dist/css/'))
})

gulp.task('build', gulp.series(assets, 'buildStyles'))
gulp.task('production', gulp.series(assets, 'buildStyles', 'minifyStyles'))
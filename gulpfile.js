const gulp = require("gulp")

const webpack = require('webpack')
const webpackStream = require('webpack-stream')

const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const browserSync = require('browser-sync').create()

//  Webpack configs
// const webpackConfigDev = {
//   entry: {
//     main: [
//       './src/js/main.js',
//       'webpack/hot/dev-server',
//       'webpack-hot-middleware/client'
//     ]
//   },
//   output: {
//     path: __dirname + 'dist/js',
//     filename: 'main.js'
//   },
//   mode: 'development',
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /(node_modules)/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env']
//           }
//         }
//       }
//   ]
//   },
//   plugins: [
//     new webpack.HotModuleReplacementPlugin()
//   ]
// }

const webpackConfigProd = {
  entry: './src/js/main.js',
  output: {
    path: __dirname + 'dist/js',
    filename: 'main.js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
  ]
  }
}

//  webpack functions
// gulp.task('webpack', function () {
//   return new Promise(resolve => webpack(config, (err, stats) => {

//     if (err) console.log('Webpack', err)

//     console.log(stats.toString({ /* stats options */ }))

//     resolve()
// }))
// })

gulp.task('webpackProd', function () {
  return gulp.src('./src/js/main.js')
      .pipe(webpackStream(webpackConfigProd, webpack, function (err, stats) {
          console.log(stats.toString({ colors: true }))
      }))
      .pipe(gulp.dest('./dist/js'))
})

//  style functions
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

//  watch functions
// function serve() {
//   return browserSync.init({
//     server: './dist',
//     port: 4500,
//     open: true,
//     middleware: [
//         webpackDevMiddleware(webpack(webpackConfigDev), { /* options */ }),
//         webpackHotMiddleware(webpack(webpackConfigDev))
//     ],
//   });
// }

// gulp.task('watch', function() {
//   serve()

//   gulp.watch("./src/sass/**/*.scss", gulp.series('buildStyles', browserSync.reload))
//   gulp.watch("./src/js/**/*.js", gulp.series(browserSync.reload))
// });

//  final tasks to run in console
gulp.task('build', gulp.series('webpackProd', 'buildStyles'))
gulp.task('production', gulp.series('webpackProd', 'buildStyles', 'minifyStyles'))
// gulp.task('watch', gulp.series('build', 'watch'))
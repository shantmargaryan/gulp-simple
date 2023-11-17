// global plugins
import gulp from "gulp";
import gulpNotify from "gulp-notify";
import gulpPlumber from "gulp-plumber";
import gulpChanged from "gulp-changed";
// plugin for delete docs folder
import del from "del";
// plugin for server
import browserSync from "browser-sync";
// plugins for html
import gulpFileInclude from "gulp-file-include";
import gulpTypograf from "gulp-typograf";
// plugins for css
import gulpRename from "gulp-rename";
import gulpSass from "gulp-sass";
import * as sass from 'sass';
const dartSass = gulpSass(sass);
// plugins for js
import webpackStream from "webpack-stream";
// plugins for svg
import gulpSvgSprite from "gulp-svg-sprite";
// path
const srcFolder = './src/';
const destFolder = './docs/';
// config for plugins plumber and notify
const plumberNotify = (addTitle) => {
  return {
    errorHandler: gulpNotify.onError(error => ({
      title: addTitle,
      message: error.message
    }))
  }
}
// html task
const html = () => {
  return gulp.src(`${srcFolder}html/*.html`)
    .pipe(gulpPlumber(plumberNotify('html')))
    .pipe(gulpFileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(gulpTypograf({
      locale: ['ru', 'en-US']
    }))
    .pipe(gulp.dest(destFolder))
}
export { html }
// css task
const css = () => {
  return gulp.src(`${srcFolder}scss/*.scss`, { sourcemaps: true })
    .pipe(gulpPlumber(plumberNotify('css')))
    .pipe(dartSass())
    .pipe(gulpRename({
      suffix: ".min",
      extname: ".css"
    }))
    .pipe(gulp.dest(`${destFolder}css/`, { sourcemaps: true }))
}
export { css }
// js task
const js = () => {
  return gulp.src(`${srcFolder}js/*.js`)
    .pipe(gulpPlumber(plumberNotify('js')))
    .pipe(webpackStream({
      mode: 'development',
      entry: {
        index: './src/js/index.js'
        // contacts: './src/js/contacts.js',
        // about: './src/js/about.js',
      },
      output: {
        filename: '[name].min.js',
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
    }))
    .pipe(gulp.dest(`${destFolder}js/`))
}
export { js }
// img task
const img = () => {
  return gulp.src(`${srcFolder}img/**/*.{jpeg,jpg,png,gif,ico,webp,webmanifest,xml,json,svg}`)
    .pipe(gulpChanged(`${destFolder}img/`))
    .pipe(gulpPlumber(plumberNotify('img')))
    .pipe(gulp.dest(`${destFolder}img/`))
}
export { img }
// svg task
const svg = () => {
  return gulp.src(`${srcFolder}svg/**/*.svg`)
    .pipe(gulpChanged(`${destFolder}img/svg`))
    .pipe(gulpPlumber(plumberNotify('svg')))

    .pipe(gulpSvgSprite({
      mode: {
        stack: {
          sprite: `../sprite.svg`,
        },
      }
    }))
    .pipe(gulp.dest(`${destFolder}img/svg`))
}
export { svg }
// fonts task
const fonts = () => {
  return gulp.src(`${srcFolder}fonts/**/*.{woff,woff2}`)
    .pipe(gulpChanged(`${destFolder}fonts/`))
    .pipe(gulp.dest(`${destFolder}fonts/`))
}
export { fonts }
// files task
const files = () => {
  return gulp.src(`${srcFolder}files/**/*.*`)
    .pipe(gulpChanged(`${destFolder}files/`))
    .pipe(gulp.dest(`${destFolder}files/`))
}
export { files }
// browser-sync server
const server = () => {
  browserSync.init({
    server: {
      baseDir: destFolder
    }
  })
}
export { server }
// task for delete docs folder
const clean = () => {
  return del(destFolder)
}
export { clean }
// task to view changes to all tasks
const watcher = () => {
  gulp.watch(`${srcFolder}files/**/*.*`).on("all", browserSync.reload)
  gulp.watch(`${srcFolder}html/**/*.html`, html).on("all", browserSync.reload)
  gulp.watch(`${srcFolder}scss/**/*.scss`, css).on("all", browserSync.reload)
  gulp.watch(`${srcFolder}js/**/*.js`, js).on("all", browserSync.reload)
  gulp.watch(`${srcFolder}img/**/*.{jpeg,jpg,png,gif,ico,webp,webmanifest,xml,json}`, img).on("all", browserSync.reload)
  gulp.watch(`${srcFolder}svg/**/*.svg`, svg).on("all", browserSync.reload)
  gulp.watch(`${srcFolder}fonts/**/*.*`, fonts).on("all", browserSync.reload)
}
export { watcher }

const mainTasks = gulp.parallel(html, css, js, img, svg, fonts, files);
// npm run dev
const dev = gulp.series(clean, mainTasks, gulp.parallel(server, watcher));
export { dev }

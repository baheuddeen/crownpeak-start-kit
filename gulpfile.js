const gulp = require('gulp');
const HTMLParser = require('node-html-parser');
const sourcemaps = require('gulp-sourcemaps');
const browserSyncCreator = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const routeRules = require('./routeRules');
const rename = require('gulp-rename');
const changeFile = require('gulp-change');
const fileinclude = require('gulp-file-include');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const path = require('path');
const fs = require('fs');
const env = require('dotenv');

env.config();
const {port, proxy} = process.env;

let browserSync;

gulp.task('init-browser', async () => {
  if (browserSync) {
    return;
  }
  browserSync = browserSyncCreator.create();
  let serveStaticRules = await routeRules.getRules();
  serveStaticRules = JSON.parse(JSON.stringify(serveStaticRules));
  console.log(serveStaticRules);
  
  
  browserSync.init({
    port: port,
    proxy: proxy,
    serveStatic: serveStaticRules,
  });
});

gulp.task('browser-refresh', (done) => {
  if (browserSync) {
    console.log('Browser refresh');
    browserSync.reload();
  }
  done();
});

gulp.task('build-css', () => {
    gulp.src([
      'src/global-assets/scss/main.scss',
    ])
      .pipe(sourcemaps.init())
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(postcss([autoprefixer(), cssnano()]))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/global-assets/css'));
  
  return gulp.src([
      'src/components/**/*.scss'
    ])
      .pipe(sourcemaps.init())
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(postcss([autoprefixer(), cssnano()]))
      .pipe(sourcemaps.write('./'))
      .pipe(rename({dirname: 'components'}))
      .pipe(gulp.dest('./dist/global-assets/css/'));
});

gulp.task('build-html', () => {
    return gulp.src(['src/html/**/*.html'])
      .pipe(changeFile((content) => {
        let html = HTMLParser.parse(content);
        const pageHead = html.querySelector('head');
        let folders = fs.readdirSync(path.join(__dirname, './dist/global-assets/css'));
        for(const folder of folders){
          if(!folder.includes('.css')){
            let styles = fs.readdirSync(path.join(__dirname, `./dist/global-assets/css/${folder}`));
            styles.forEach((file) => {
                pageHead.appendChild(HTMLParser.parse(`<link rel="stylesheet" href="/global-assets/css/${folder}/${file}" />`));
            });
            }
          }
        return html.innerHTML;
      }))
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file',
      }))
      .pipe(gulp.dest('./dist/html'));
});

gulp.task('watch-refresh', () => {
  gulp.watch([
   'src/global-assets/scss/**/*.scss',
   'src/global-assets/scss/*.scss', 
   'src/components/**/*.scss'
  ], gulp.series(['build-css', 'browser-refresh']));
  gulp.watch([
    'src/html/**/**/*.html',
    'src/html/**/**/**/*.html',
    'src/components/**/*.html'
    ], gulp.series(['build-html', 'browser-refresh']));

});

gulp.task('default',  gulp.series([ 'build-css', 'build-html', 'init-browser', 'watch-refresh']) );
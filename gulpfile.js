var gulp = require('gulp');
//工具
var autoprefixer = require('gulp-autoprefixer');
var include = require('gulp-file-include');
var gulpSequence = require('gulp-sequence');
var clean = require('gulp-clean');
//转码
var sass = require('gulp-sass');
var babel = require('gulp-babel');
//压缩
var minifyHtml = require('gulp-htmlmin');
var minifyImage = require('gulp-imagemin');
var minifyJs = require('gulp-jsmin');
var minifyCss = require('gulp-clean-css');
//版本控制
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var revUrl = require('gulp-rev-css-url');
//localhost
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
//路径定义
var srcPath = {
  root: 'src',
  html: 'src/**/*.html',
  images: 'src/images/*',
  scss: 'src/scss/*.scss',
  css: 'src/css/*.css',
  js: 'src/js/*.js',
},
distPath = {
  root: 'dist',
  html: 'dist',
  images: 'dist/images',
  css: 'dist/css',
  js: 'dist/js',
  manifest: 'dist/**/*.json',
};

//生产环境
//css处理
gulp.task('css-dist', () => {
  return gulp.src([distPath.manifest, srcPath.scss])
  .pipe(revCollector())
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false,
  }))
  .pipe(minifyCss())
  .pipe(rev())
  .pipe(gulp.dest(distPath.css))
  .pipe(rev.manifest())
  .pipe(gulp.dest(distPath.css))
})
//js处理
gulp.task('js-dist', ()=>{
  return gulp.src(srcPath.js)
  .pipe(babel({
    presets: ['env'],
  }))
  .pipe(minifyJs())
  .pipe(rev())
  .pipe(gulp.dest(distPath.js))
  .pipe(rev.manifest())
  .pipe(gulp.dest(distPath.js))
})
//image 处理
gulp.task('images-dist', ()=>{
  return gulp.src(srcPath.images)
  .pipe(minifyImage())
  .pipe(rev())
  .pipe(gulp.dest(distPath.images))
  .pipe(rev.manifest())
  .pipe(gulp.dest(distPath.images))
})
//html 处理
gulp.task('html-dist', ()=>{
  return gulp.src([distPath.manifest, srcPath.html])
  .pipe(revCollector())
  .pipe(minifyHtml())
  .pipe(gulp.dest(distPath.html))
})

//开发环境
//css处理
gulp.task('css-dev', () => {
  return gulp.src([srcPath.scss])
  .pipe(sass())
  .pipe(gulp.dest(distPath.css))
  .pipe(reload({stream: true}))
})
//js处理
gulp.task('js-dev', ()=>{
  return gulp.src(srcPath.js)
  .pipe(babel({
    presets: ['env'],
  }))
  .pipe(gulp.dest(distPath.js))
  .pipe(reload({stream: true}))

})
//image 处理
gulp.task('images-dev', ()=>{
  return gulp.src(srcPath.images)
  .pipe(gulp.dest(distPath.images))
  .pipe(reload({stream: true}))

})
//html 处理
gulp.task('html-dev', ()=>{
  return gulp.src([srcPath.html])
  .pipe(gulp.dest(distPath.html))
  .pipe(reload({stream: true}))

})

//清除dist目录
gulp.task('clean', ()=>{
  return gulp.src('dist/*')
  .pipe(clean({read: false}))
})
//静态服务器
gulp.task('browserSync', ()=>{
  browserSync.init({
    server: {
      baseDir: './dist',
      //proxy: 'ip地址',
    }
  })
})
// build
gulp.task('build', gulpSequence('clean', 'images-dist', ['js-dist', 'css-dist'], 'html-dist'));
// dev
gulp.task('dev', (cb)=>{
  gulpSequence('clean', ['css-dev','images-dev', 'js-dev', 'html-dev'], 'browserSync')(cb);
  gulp.watch(srcPath.scss, ['css-dev']);
  gulp.watch(srcPath.html, ['html-dev']);
  gulp.watch(srcPath.js, ['js-dev']);
  gulp.watch(srcPath.images, ['images-dev']);
})

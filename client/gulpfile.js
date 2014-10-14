/*-------------------------------------------------------------------
    Gulp
-------------------------------------------------------------------*/
var gulp = require('gulp'); 

/*-------------------------------------------------------------------
    Plugins
-------------------------------------------------------------------*/
var compass = require('gulp-compass');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var clean = require('gulp-clean');
var filter = require('gulp-filter');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');

/*-------------------------------------------------------------------
    Define filters
-------------------------------------------------------------------*/

var jsFilter = filter('**/*.js');
var cssFilter = filter('**/*.css');

/*-------------------------------------------------------------------
    SASS
-------------------------------------------------------------------*/
gulp.task('sass', function() {
    return gulp.src('sass/**/*.scss')
        .pipe(plumber())
        .pipe(compass({
            sass: 'sass',
            css: 'css',
            comments: false
        }))
        .pipe(gulp.dest('css'))
        .pipe(livereload({ auto: false }));
});

/*-------------------------------------------------------------------
    JS
-------------------------------------------------------------------*/
gulp.task('scripts', function() {

    return gulp.src(['!js/app.min.js', '!js/vendor.min.js', 'components/**/*.js', 'views/**/*.js', 'js/*.js'])
        .pipe(plumber())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('js'))
        .pipe(livereload({ auto: false }));
});

/*-------------------------------------------------------------------
    Vendor
-------------------------------------------------------------------*/
gulp.task('vendor', function() {

    return gulp.src(['!js/vendor/modernizr-2.6.2-respond-1.1.0.min.js', 'js/vendor/jquery-1.11.0.min.js', 'js/vendor/angular.min.js', 'js/vendor/*.js'])
        .pipe(plumber())
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('js'))
        .pipe(livereload({ auto: false }));
});

/*-------------------------------------------------------------------
    IMAGES
-------------------------------------------------------------------*/
gulp.task('img', function(){
 return gulp.src('img/**/*')
     .pipe(imagemin())
     .pipe(gulp.dest('dist/img'));
});

/*-------------------------------------------------------------------
    Livereload
-------------------------------------------------------------------*/
// Watch Files For Changes
gulp.task('watch', function() {

    console.log("watching ...");

    // Livereload
    livereload.listen();

    gulp.watch(['js/**/*.js', 'components/**/*.js', 'views/**/*.js'], ['vendor', 'scripts'])
    .on('change', livereload.changed);

    gulp.watch('sass/**/*.scss', ['sass'])
    .on('change', livereload.changed);

    gulp.watch(['*.html', '**/*.html'])
    .on('change', livereload.changed);

    gulp.watch('data/**/*', ['data'])
    .on('change', livereload.changed);
});

/*-------------------------------------------------------------------
    Clean dist folder
-------------------------------------------------------------------*/
gulp.task('clean', function(){
 return gulp.src('dist', {read: false}).pipe(clean());
});

/*-------------------------------------------------------------------
    Dist
-------------------------------------------------------------------*/
gulp.task('dist', ['scripts', 'sass', 'clean', 'img'], function(){
    return gulp.src('*.html')
        .pipe(useref.assets())
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifyCss())
        .pipe(cssFilter.restore())
        .pipe(useref.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});
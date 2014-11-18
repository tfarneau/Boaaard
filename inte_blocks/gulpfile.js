var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');

gulp.task('sass', function () {
    gulp.src('style/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('style/'));
});

gulp.task('watch', function() {
  var server = livereload();
  gulp.watch('style/**',['sass']).on('change', function(file) {
      server.changed(file.path);
  });
});
// Gulpfile.js
var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , jshint = require('gulp-jshint')
  , liveReload = require('gulp-livereload');

gulp.task('lint', function () {
  gulp.src('app/**/*.js')
    .pipe(jshint())
})


gulp.task('node', function () {

	nodemon({ script: 'app/server.js', ext: 'html js', ignore: ['ignored.js'] })
	.on('change', ['lint'])
	.on('restart', function () {
	 	console.log('Server restarted')
	});

})

gulp.task('default',['node'], function(){})
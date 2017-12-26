const
	gulp = require('gulp'),
	less = require('gulp-less'),  // for less > css
    autoprefixer = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'), //for css minify
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),  //for js minify
	imagemin = require('gulp-imagemin') //for images minify
	clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload');

gulp.task('default',function(){
	gulp.start('less','js');
})
gulp.task('less', function() {
	gulp.src('./dev/public/less/*.less')
	.pipe(less())
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(minifyCSS())
	.pipe(gulp.dest('./dist/public/css'));
});
gulp.task('js', function() {
	gulp.src('./dev/public/js/*.js')
	// .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
	// .pipe(uglify())
    // .pipe(concat('index.js'))
	.pipe(gulp.dest('./dist/public/js'));

	gulp.src('./dev/public/js/main/*.js')
	// .pipe(concat('bundle.js'))
	.pipe(gulp.dest('./dist/public/js'))
});

// 看守
gulp.task('watch', function() {
  gulp.watch('./dev/public/less/*.less', ['less']);
  gulp.watch('./dev/public/js/**/*.js', ['js']);
});
var 
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


gulp.task('default',['clean'],function(){
	gulp.start( 'lib', 'public_less','public_cropper','public_js','public_img','public_voice','routes','app');
})
gulp.task('clean', function() { 
  return gulp.src(['dist'], {read: false})
    .pipe(clean());
});
gulp.task('lib', function() {
	gulp.src('./dev/lib/*.js')
	.pipe(gulp.dest('./dist/lib'));
}); 

gulp.task('public_less', function() {
	gulp.src('./dev/public/less/*.less')
	.pipe(less())
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(minifyCSS())
	.pipe(gulp.dest('./dist/public/css'));

	gulp.src('./dev/public/less/*.css')
	.pipe(minifyCSS())
	.pipe(gulp.dest('./dist/public/css'))
});

gulp.task('public_cropper', function() {
	gulp.src('./dev/public/cropper/*.*')
	.pipe(gulp.dest('./dist/public/cropper'));
});
gulp.task('public_js', function() {
	gulp.src('./dev/public/js/**/*.js')
	// .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
	// .pipe(uglify())
    // .pipe(concat('index.js'))
	.pipe(gulp.dest('./dist/public/js'));
});
gulp.task('public_img', function() {
	gulp.src('./dev/public/img/**/*.*')
	.pipe(imagemin())
	.pipe(gulp.dest('./dist/public/img'));
});
gulp.task('public_voice', function() {
	gulp.src('./dev/public/voice/*.*')
	.pipe(gulp.dest('./dist/public/voice'));
});
gulp.task('routes', function() {
	gulp.src('./dev/routes/**/*.js')
	.pipe(gulp.dest('./dist/routes'));
});
gulp.task('app', function() {
	gulp.src('./dev/app.js')
	.pipe(gulp.dest('./dist'));
});
	
// 看守
gulp.task('watch', function() {
  gulp.watch('./dev/lib/*.js', ['db']);
  gulp.watch('./dev/public/less/*.less', ['public_less']);
  gulp.watch('./dev/public/cropper/*.*', ['public_cropper']);
  gulp.watch('./dev/public/js/**/*.js', ['public_js']);
  gulp.watch('./dev/public/img/**/*.*', ['public_img']);
  gulp.watch('./dev/public/voice/*.*', ['public_voice']);
  gulp.watch('./dev/routes/**/*.js', ['routes']);
  gulp.watch('./dev/app.js', ['app']);

  // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
  gulp.watch(['dist/**']).on('change', function(file) {
    livereload.changed(file.path)
  });
 
});
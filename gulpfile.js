const
	gulp = require('gulp'),
	less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'), 
	jshint = require('gulp-jshint'),
  	map = require("map-stream"),
	uglify = require('gulp-uglify'), 
	pump = require('pump'),
	imagemin = require('gulp-imagemin')
	clean = require('gulp-clean'),
    concat = require('gulp-concat');



gulp.task('clean',function(){
	gulp.src('./dist/public/js/*.js')
		.pipe(clean());
	gulp.src('./dist/public/css/*.css')
		.pipe(clean());
});


gulp.task('pro',function(){
	gulp.start('clean','pro-less','pro-js');
});


gulp.task('pro-less',function(){
	gulp.src('./dev/less/main-*')
	.pipe(less())
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(minifyCSS())
	.pipe(concat('main.css'))
	.pipe(gulp.dest('./dist/public/css'));
});


gulp.task('pro-js',function(){
	function createErrorHandler(name){
		return function (err) {
		  console.error('Error from ' + name + ' in compress task', err.toString());
		};
	}
	pump([
		gulp.src(['./dev/js/**/*.js','!./dev/js/main-*'])
		    .pipe(uglify())
		    .on('error', createErrorHandler('PRO-NOT-MAIN'))
		    .pipe(gulp.dest('./dist/public/js'))
	]);


	pump([
		gulp.src(['./dev/js/main-*','./dev/js/lib.js'])
		    .pipe(uglify())
		    .on('error', createErrorHandler('PRO-MAINJS'))
		    .pipe(concat('main.js'))
		    .pipe(gulp.dest('./dist/public/js'))
	]);
});






gulp.task('dev',function(){
	gulp.start('clean','dev-less','dev-js');
});

gulp.task('dev-less', function() {
	gulp.src('./dev/less/main-*')
	.pipe(less())
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(minifyCSS())
	.pipe(concat('main.css'))
	.pipe(gulp.dest('./dist/public/css'));
});

gulp.task('dev-js', function() {
	var map = require("map-stream");
	var customerReporter = map(function(file,cb){  
		if(!file.jshint.success){  
		 //打印出错误信息
		 console.log("jshint fail in:" + file.path);  
		 file.jshint.results.forEach(function(err){  
		     if(err){  
		        console.log(err);  
		        console.log("在 "+file.path+" 文件的第"+err.error.line+" 行的第"+err.error.character+" 列发生错误");  
		     }  
		 });  
		}  
	});

	gulp.src(['./dev/js/**/*.js','!./dev/js/main-*'])
	    .pipe(jshint())
	    .pipe(gulp.dest('./dist/public/js'))
	    .pipe(customerReporter)

	// gulp.src(['./dev/js/main-*.js','./dev/js/lib.js'])
	gulp.src(['./dev/js/main-*.js'])
	    .pipe(jshint())
	    // .pipe(concat('main.js'))
	    .pipe(gulp.dest('./dist/public/js'))
	    .pipe(customerReporter)
});

gulp.task('dev-watch', function() {
  gulp.watch('./dev/less/*.less', ['dev-less']);
  gulp.watch('./dev/js/*.js', ['dev-js']);
});
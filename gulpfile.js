const
	gulp = require('gulp'),
	less = require('gulp-less'),  // for less > css
    autoprefixer = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'), //for css minify
	jshint = require('gulp-jshint'),
  	map = require("map-stream"),
	uglify = require('gulp-uglify'),  //for js minify
	imagemin = require('gulp-imagemin') //for images minify
	clean = require('gulp-clean'),
    concat = require('gulp-concat');





gulp.task('pro',function(){
	gulp.start('pro-less','pro-js');
});






























gulp.task('dev',function(){
	gulp.start('dev-less','dev-js');
});

gulp.task('dev-less', function() {
	gulp.src('./dev/less/*.less')
	.pipe(less())
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(minifyCSS())
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
	gulp.src('./dev/js/**/*.js')
	    .pipe(jshint())
	    .pipe(gulp.dest('./dist/public/js'))
	    .pipe(customerReporter)
});

gulp.task('dev-watch', function() {
  gulp.watch('./dev/less/*.less', ['dev-less']);
  gulp.watch('./dev/js/*.js', ['dev-js']);
});
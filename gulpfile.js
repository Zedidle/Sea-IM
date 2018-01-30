const config = require('./build/config.js');


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


var browserSync = require('browser-sync').create();
// 'reload' is method to reload the browser
var reload = browserSync.reload;

// clean the js and css
gulp.task('clean',function(){
	gulp.src('./build/public/js/*.js')
		.pipe(clean());
	gulp.src('./build/public/css/*.css')
		.pipe(clean());
	gulp.src('./build/public/views/**/*.ejs')
		.pipe(clean());
});


// pro model
gulp.task('pro',function(){
	gulp.start('clean','pro-less','pro-js');
});


gulp.task('pro-less',function(){
	gulp.src('./src/less/main-*')
	.pipe(less())
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(minifyCSS())
	.pipe(concat('main.css'))
	.pipe(gulp.dest('./build/public/css'));
});


gulp.task('pro-js',function(){
	function createErrorHandler(name){
		return function (err) {
		  console.error('Error from ' + name + ' in compress task', err.toString());
		};
	}
	pump([
		gulp.src(['./src/js/**/*.js','!./src/js/main-*'])
		    .pipe(uglify())
		    .on('error', createErrorHandler('PRO-NOT-MAIN'))
		    .pipe(gulp.dest('./build/public/js'))
	]);


	pump([
		gulp.src(['./src/js/main-*','./src/js/lib.js'])
		    .pipe(uglify())
		    .on('error', createErrorHandler('PRO-MAINJS'))
		    .pipe(concat('main.js'))
		    .pipe(gulp.dest('./build/public/js'))
	]);
});














//	dev model
gulp.task('js', function () {
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

	gulp.src(['./src/js/**/*.js','!./src/js/main-*'])
	    .pipe(jshint())
	    .pipe(gulp.dest('./build/public/js'))
	    .pipe(customerReporter)

	// gulp.src(['./src/js/main-*.js','./src/js/lib.js'])
	gulp.src(['./src/js/main-*.js'])
	    .pipe(jshint())
	    // .pipe(concat('main.js'))
	    .pipe(gulp.dest('./build/public/js'))
	    .pipe(customerReporter)
  
	reload();
});

gulp.task('less', function() {
	gulp.src('./src/less/main-*')
	.pipe(less())
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(minifyCSS())
	.pipe(concat('main.css'))
	.pipe(gulp.dest('./build/public/css'));

	gulp.src(['./src/less/*.less','!./src/less/main-*','!./src/less/config.less'])
	.pipe(less())
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(minifyCSS())
	.pipe(gulp.dest('./build/public/css'));

	reload();
});


gulp.task('views', function() {
	gulp.src('./src/views/**/*.ejs')
	.pipe(gulp.dest('./build/views'))

	reload();
});

gulp.task('routes', function() {
	gulp.src('./src/routes/**/*.js')
	.pipe(gulp.dest('./build/routes'))

	reload();
});


// 创建一个任务确保JS任务完成之前能够继续响应
gulp.task('js-watch', ['js']);
gulp.task('less-watch', ['less']);
gulp.task('views-watch', ['views']);
gulp.task('routes-watch', ['routes']);

// 使用默认任务启动Browsersync，监听JS,Less
gulp.task('serve', ['js','less','views','routes'], function () {

    // 从这个项目的根目录启动服务器
    browserSync.init({
        proxy: config.ip +':'+config.port
    });

    // 添加 browserSync.reload 到任务队列里
    // 所有的浏览器重载后任务完成。
    gulp.watch("./src/js/**/*.js", ['js-watch']);
    gulp.watch("./src/less/**/*.less", ['less-watch']);
    gulp.watch("./src/views/**/*.ejs", ['views-watch']);
    gulp.watch("./src/routes/**/*.js", ['routes-watch']);
});
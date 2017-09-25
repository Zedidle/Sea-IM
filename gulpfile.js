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

	gulp.start( 'lib', 'mongoModel','public_less','public_cropper','public_js','public_img','public_voice','routes','views','app');

})
gulp.task('clean', function() { 
  return gulp.src(['dist'], {read: false})
    .pipe(clean());
});

gulp.task('lib', function() {
	gulp.src('./dev/lib/*.js')
	.pipe(gulp.dest('./dist/lib'));
}); 
gulp.task('mongoModel', function() {
	gulp.src('./dev/mongoModel/*.js')
	.pipe(gulp.dest('./dist/mongoModel'));
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
gulp.task('views', function() {
	gulp.src('./dev/views/**/*.ejs')
	.pipe(gulp.dest('./dist/views'));
});
gulp.task('app', function() {
	gulp.src('./dev/*.*')
	.pipe(gulp.dest('./dist'));
});
	
// 看守
gulp.task('watch', function() {
  gulp.watch('./dev/lib/*.js', ['db']);
  gulp.watch('./dev/mongoModel/*.js', ['mongoModel']);
  gulp.watch('./dev/public/less/*.less', ['public_less']);
  gulp.watch('./dev/public/cropper/*.*', ['public_cropper']);
  gulp.watch('./dev/public/js/**/*.js', ['public_js']);
  gulp.watch('./dev/public/img/**/*.*', ['public_img']);
  gulp.watch('./dev/public/voice/*.*', ['public_voice']);
  gulp.watch('./dev/routes/**/*.js', ['routes']);
  gulp.watch('./dev/views/**/*.ejs', ['views']);
  gulp.watch('./dev/*.*', ['app']);

  // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
  gulp.watch(['dist/**']).on('change', function(file) {
    livereload.changed(file.path)
  });
 
});








// //载入外挂
// var gulp = require('gulp'), 
//     less = require('gulp-less'),
//     autoprefixer = require('gulp-autoprefixer'),
//     minifycss = require('gulp-minify-css'),
//     jshint = require('gulp-jshint'),
//     uglify = require('gulp-uglify'),
//     imagemin = require('gulp-imagemin'),
//     rename = require('gulp-rename'),
//     clean = require('gulp-clean'),
//     concat = require('gulp-concat'),
//     notify = require('gulp-notify'),
//     cache = require('gulp-cache'),
//     livereload = require('gulp-livereload');
 
// // 样式
// gulp.task('styles', function() { 
//   return gulp.src('src/styles/main.scss')
//     .pipe(sass({ style: 'expanded', }))
//     .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
//     .pipe(gulp.dest('dist/styles'))
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(minifycss())
//     .pipe(gulp.dest('dist/styles'))
//     .pipe(notify({ message: 'Styles task complete' }));
// });
 
// // 脚本
// gulp.task('scripts', function() { 
//   return gulp.src('src/scripts/**/*.js')
//     .pipe(jshint('.jshintrc'))
//     .pipe(jshint.reporter('default'))
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('dist/scripts'))
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(uglify())
//     .pipe(gulp.dest('dist/scripts'))
//     .pipe(notify({ message: 'Scripts task complete' }));
// });
 
// // 图片
// gulp.task('images', function() { 
//   return gulp.src('src/images/**/*')
//     .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
//     .pipe(gulp.dest('dist/images'))
//     .pipe(notify({ message: 'Images task complete' }));
// });
 
// // 清理
// gulp.task('clean', function() { 
//   return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
//     .pipe(clean());
// });
 
// // 预设任务
// gulp.task('default', ['clean'], function() { 
//     gulp.start('styles', 'scripts', 'images');
// });
 
// // 看守
// gulp.task('watch', function() {
 
//   // 看守所有.scss档
//   gulp.watch('src/styles/**/*.scss', ['styles']);
 
//   // 看守所有.js档
//   gulp.watch('src/scripts/**/*.js', ['scripts']);
 
//   // 看守所有图片档
//   gulp.watch('src/images/**/*', ['images']);
 
//   // 建立即时重整伺服器
//   var server = livereload();
 
//   // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
//   gulp.watch(['dist/**']).on('change', function(file) {
//     server.changed(file.path);
//   });
 
// });

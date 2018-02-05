const {
	ip,
	port,
} = require('./configs/server.config.js');

const
	gulp = require('gulp'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'), 
	map = require("map-stream"),
	uglify = require('gulp-uglify'), 
	gutil = require('gulp-util'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	combiner = require('stream-combiner2'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	sourcemaps = require('gulp-sourcemaps'),
	vueify = require('vueify'),
	envify = require('envify/custom'),
	runSequence = require('run-sequence'),
	gulpSequence = require('gulp-sequence')



var browserSync = require('browser-sync').create();
// 'reload' is method to reload the browser
var reload = browserSync.reload;





// -----------------------Use Vue template---------------------------


gulp.task('clean-dev-main',function(){
	console.log('Cleaning files for task "dev-main" ');

	gulp.src('build/public/js/*')
	.pipe(clean());
});




// 开发环境 ， 使用npm run dev

gulp.task('dev-main',function(){

  vueify.compiler.applyConfig(require('./configs/vue.config.js'));
  var b = browserify('./src/main.js',require('./configs/browserify.config.js'))
    .transform(babelify)  //使用ES6转换到ES5的语法编译
    .transform(vueify)  //编译vue模板
    .transform(
      // 必填项，以处理 node_modules 里的文件
      { global: true },
      envify({ NODE_ENV: 'development' })
     )

    console.log('转换ES6 --> ES5');
    console.log('编译vue Template');
    console.log('转换为开发环境');

    console.log('根据依赖合并所有模块')
    console.log('压缩JS : 正在监听错误...')
    console.log('生成sourcemap')
    console.log('输出报错流...');
    console.log('输出文件！')
  
  combiner.obj([
      b.bundle(),  //开始连接并捆绑所有文件
        source('bundle.js'),   //命名捆绑成的文件，并当作源文件
        buffer(),   
        sourcemaps.init({loadMaps: true}),  //生成map
        uglify().on('error', gutil.log),   //压缩
        sourcemaps.write('./'),  //map文件相对压缩文件的位置
        gulp.dest('./build/public/js') // 压缩文件的相对输出位置
    ])
    .on('error', console.error.bind(console)); //确认开启报错
   

});


gulp.task('dev-main-watch',['dev-main'],function(){
	browserReload();
})
function browserReload(){
	return reload();
}


gulp.task('development',function(){
	    // 从这个项目的根目录启动服务器
    
	gulpSequence(
		'clean-dev-main',
		'font-styles',
		'dev-main',
		function(){
			console.log('According to the Sequence... Finished!');
		}
	)


    browserSync.init({
        proxy: ip +':'+port
    });


    gulp.watch(["src/main.js","./src/**/*.js","./configs/ui.config.js"],["dev-main-watch"]);
    gulp.watch("./src/**/*.vue",["dev-main-watch"]);
	gulp.watch(['./src/less/**/*.less','./configs/config.less'],['font-styles']);
	console.log('正在监听:*.vue');
	console.log('正在监听:*.less');
	console.log('正在监听:*.js');

});

    



// 生产环境 ， 使用npm run build

gulp.task('pro-main',function(){

  vueify.compiler.applyConfig(require('./configs/vue.config.js'));

  var b = browserify('./src/main.js',require('./configs/browserify.config.js'))
    .transform(babelify)  //使用ES6转换到ES5的语法编译
    .transform(vueify)  //编译vue模板
    .transform(
      // 必填项，以处理 node_modules 里的文件
      { global: true },
      envify({ NODE_ENV: 'production' })
    )

    console.log('转换ES6 --> ES5');
    console.log('编译vue Template');
    console.log('转换为生产环境');

    console.log('根据依赖合并所有模块')
    console.log('压缩JS : 正在监听错误...')
    console.log('输出！')
  
  return combiner.obj([
      b.bundle(),  //开始连接并捆绑所有文件
        source('bundle.js'),   //命名捆绑成的文件，并当作源文件
        buffer(),   //转换成二进制文件,方便产生map
        uglify().on('error', gutil.log),   //压缩
        gulp.dest('./build/public/js') // 压缩文件的相对输出位置
    ])

});

// production 
gulp.task('production',['pro-main'], function () {
    // 从这个项目的根目录启动服务器
    console.log('开启端口监听：'+ip +':'+port);
    browserSync.init({
        proxy: ip +':'+port
    });
});









//----------------------------Uglify Images------------------------------
// More info of module(gulp-image): https://www.npmjs.com/package/gulp-image
const imagemin = require('gulp-imagemin');


gulp.task('clean-images',function(){
	gulp.src(['build/public/img/*'])
	.pipe(clean());
	console.log('Clean Images in Build Public');
})

gulp.task('image', function () {
  gulp.src([
  	'src/img/**/*.jpg',
  	'src/img/**/*.png',
  	'src/img/**/*.jpeg',
  	'src/img/**/*.gif',
  	'src/img/**/*.svg'
  ])
    .pipe(imagemin())
    .pipe(gulp.dest('build/public/img'));

});
 
gulp.task('img', function(){
 	gulpSequence(
 		'clean-images',
        'image',
        function(){
        	console.log('输出完成！');
        }
	);
});














// -------------------Only For Styles---------------------------

gulp.task('css',function(){
	gulp.src('./src/less/**/*.less')
	.pipe(less())
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(concat('app.css'))
	.pipe(sourcemaps.init({loadMaps: true}))  //生成map
	.pipe(minifyCSS())
    .pipe(sourcemaps.write('./'))  //map文件相对压缩文件的位置
	.pipe(gulp.dest('./build/public/css'));

	reload();
	console.log('构建压缩合并css完成：*.less --> app.css')
})




// ------------------ Font --------------------------
gulp.task('font',function(){
	gulp.src(['./src/font/css/animation.css','./src/font/css/fontello.css'])
	.pipe(concat('font.css'))
	.pipe(minifyCSS())
	.pipe(gulp.dest('./build/public/css'));

	console.log('合并Font完成！')
});

gulp.task('font-app',function(){
	gulp.src([
		'./build/public/css/app.css'
		,'./build/public/css/font.css'
		,'./build/static/bootstrap/css/bootstrap.min.css'
	])
	.pipe(concat('font-app.css'))
	.pipe(gulp.dest('./build/public/css'))
});



gulp.task('font-styles',function(){
 	gulpSequence(
 		'css',
        'font',
        'font-app',
        function(){
        	console.log('字体和样式输出完成！');
      		reload();
        }
	);
});


gulp.task('watch-styles',function(){
	gulp.watch(['./src/less/**/*.less','./configs/config.less'],['font-styles']);
});














// ---------------------------------No Use Vue Template-------------------------------





// clean the js and css
gulp.task('clean',function(){
	gulp.src('./build/public/js/*.js')
		.pipe(clean());
	gulp.src('./build/public/css/*.css')
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
	// pump([
		gulp.src(['./src/js/**/*.js','!./src/js/main-*'])
		    .pipe(uglify())
		    .on('error', createErrorHandler('PRO-NOT-MAIN'))
		    .pipe(gulp.dest('./build/public/js'))
	// ]);


	// pump([
		gulp.src(['./src/js/main-*','./src/js/lib.js'])
		    .pipe(uglify())
		    .on('error', createErrorHandler('PRO-MAINJS'))
		    .pipe(concat('main.js'))
		    .pipe(gulp.dest('./build/public/js'))
	// ]);
});































//	dev model
gulp.task('js', function () {
	var map = require("map-stream");
	var customerReporter = map(function(file,cb){  
		// if(!file.jshint.success){  
		//  //打印出错误信息
		//  console.log("jshint fail in:" + file.path);  
		//  file.jshint.results.forEach(function(err){  
		//      if(err){  
		//         console.log(err);  
		//         console.log("在 "+file.path+" 文件的第"+err.error.line+" 行的第"+err.error.character+" 列发生错误");  
		//      }  
		//  });  
		// }  
	});

	gulp.src(['./src/js/**/*.js','!./src/js/main-*'])
	    // .pipe(jshint())
	    .pipe(gulp.dest('./build/public/js'))
	    .pipe(customerReporter)

	// gulp.src(['./src/js/main-*.js','./src/js/lib.js'])
	gulp.src(['./src/js/main-*.js'])
	    // .pipe(jshint())
	    // .pipe(concat('main.js'))
	    .pipe(gulp.dest('./build/public/js'))
	    .pipe(customerReporter)
  
	reload();
});

gulp.task('page', function () {
	gulp.src(['./src/page/**/*'])
		.pipe(concat('app.js'))
	    .pipe(gulp.dest('./build/public/'))
  
	reload();
});

gulp.task('less', function() {
	gulp.src('./src/less/**/*')
	.pipe(less())
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	// .pipe(minifyCSS())
	.pipe(concat('app.css'))
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

gulp.task('img', function() {
	gulp.src('./src/img/**/*.*')
	.pipe(gulp.dest('./build/public/img'))

	reload();
});


gulp.task('voice', function() {
	gulp.src('./src/voice/**/*.*')
	.pipe(gulp.dest('./build/public/voice'))

	reload();
});

gulp.task('app.ejs', function() {
	gulp.src('./build/app.ejs')
	.pipe(gulp.dest('./build'))

	reload();
});

// 创建一个任务确保JS任务完成之前能够继续响应
gulp.task('js-watch', ['js']);
gulp.task('page-watch', ['page']);
gulp.task('less-watch', ['less']);
gulp.task('views-watch', ['views']);
// gulp.task('routes-watch', ['routes']);
gulp.task('img-watch', ['img']);
gulp.task('voice-watch', ['voice']);
gulp.task('app.ejs-watch', ['app.ejs']);

// 使用默认任务启动Browsersync，监听JS,Less
gulp.task('serve', ['js','less','views','img','voice','page'], function () {

    // 从这个项目的根目录启动服务器
    browserSync.init({
        proxy: ip +':'+port
    });

    // 添加 browserSync.reload 到任务队列里
    // 所有的浏览器重载后任务完成。
    gulp.watch("./src/js/**/*.js", ['js-watch']);
    gulp.watch("./src/page/**/*", ['page-watch']);
    gulp.watch("./src/less/**/*.less", ['less-watch']);
    gulp.watch("./src/views/**/*.ejs", ['views-watch']);

    // gulp.watch("./src/routes/**/*.js", ['routes-watch']);
    gulp.watch("./src/img/**/*", ['img-watch']);
    gulp.watch("./src/voice/**/*", ['voice-watch']);

    gulp.watch("./build/app.ejs",['app.ejs-watch']);

});
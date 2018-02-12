import $ from 'jquery';
import App from '../App.vue';
// console.log('App is:');
// console.log(App);



/*所有的路由并没有提前组合好，只是凭借文件路径简单分配.
但是实际上要放到这个文件来自由“组装”，可以把这个文件称为路由管理中枢。*/
import start from '../page/start/start.vue';
import main from '../page/main/main.vue';



// !定义路由 -> 每个路由应该映射一个组件。
// This is called routes
export default [{
	path: '/', 
	component: App, // 顶层路由
	children:[
		//默认路由：处理登录或者注册
		{ 
			path: '/', 
			component: start 
		}, 
		//登录后的路由：main界面    
		{ 
			path: '/m',
			component: main,
			children:[
				{
					path:'n',
					component:{
						template:'<div>NNNNNNNNNNNNNNNN</div>'
					}
				}
			]
		},
	]
}];


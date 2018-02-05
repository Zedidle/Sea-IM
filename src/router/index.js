import $ from 'jquery';
import App from '../App.vue';
// console.log('App is:');
// console.log(App);

import start from '../page/start/start.vue';

var main = {
	template:'<div>MAIN</div>'
} 

// !定义路由 -> 每个路由应该映射一个组件。
// This is called routes
export default [{
	path: '/', 
	component: App, // 顶层路由
	children:[
		{ path: '/', component: start },     //默认路由：处理登录或者注册
		{ path: 'main', component: main },   //登录后的路由：住界面
	]
}];


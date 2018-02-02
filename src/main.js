import Vue from "vue";

import VueRouter from 'vue-router';

import routes from './router/router';

import store from './store';

Vue.use(VueRouter);

const router = new VueRouter({
	// get the vue router
	routes,

	// mode
    // 类型: string
    // 默认值: "hash" (浏览器环境) | "abstract" (Node.js 环境)
    // 可选值: "hash" | "history" | "abstract"
    // 配置路由模式:
    //     hash: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器。
    //     history: 依赖 HTML5 History API 和服务器配置。查看 HTML5 History 模式。
    //     abstract: 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式。

	// mode: routerMode,

	// routerMode is:
	// {
	// 	baseUrl,
	// 	routerMode,
	// 	imgBaseUrl,
	// }

	// ?process.env, t
	strict: process.env.NODE_ENV !== 'production',
})

// 对应build/index.ejs
new Vue({
  el:"#app",
  router,
  store,
  render: function (createElement) {
    return createElement(App)
  }
})
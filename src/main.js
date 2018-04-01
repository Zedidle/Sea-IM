import Vue from "vue";
import VueRouter from 'vue-router';
import routes from './router';  //Array
import store from './store';
import uiConfig from '../configs/ui.config.js';

uiConfig();

// console.log('Bundle->routes:');
// console.log(routes);

Vue.use(VueRouter);

const router = new VueRouter({
	// strict: process.env.NODE_ENV !== 'production',
	routes,
});

// 对应build/index.html
new Vue({
  	router,
  	store,
}).$mount('#app');








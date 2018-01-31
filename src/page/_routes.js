const Domore2 = {
	template:`<div>Test Domore</div>`
}


const router = new VueRouter({
	routes: [
	  // 动态路径参数 以冒号开头
	  { path: '/domore', component: Domore2 }
	]
})

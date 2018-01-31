var app = new Vue({
	el:'#app',
	router,
	store,
	components:{

	},
	data:{
		t:'SeaNet Application'
	},
	computed:{
		tt:function(){
			return store.state.count;
		}
	},
	methods:{

	},
	watch:{

	}
})
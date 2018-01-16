var login = new Vue({
	el:'#login',
	data:{
	},
	methods:{
		gettoregist:function(){
			window.location.href='/regist';
		},
	}
});
setTimeout(function(){
	document.getElementById('login_tip').innerText = '';
},5000);
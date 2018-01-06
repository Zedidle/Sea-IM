var login = new Vue({
	el:'#login',
	data:{},
	methods:{
		gettoregist:function(){
			window.location.href='/regist';
		},
		hehe:function(){
			alert('呵呵，活该！');
		}
	}
});
setTimeout(function(){
	if(document.getElementById('tipinfo')){
		document.getElementById('tipinfo').innerText = '';
	}
},3000);
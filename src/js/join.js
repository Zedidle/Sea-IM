var join = new Vue({
	el:'#join',
	data:{
	},
	methods:{
		back:function(){ 
			zPost('/main',UserEnsure);
		},
		ok:function(){
			var okEnsure = {
				password:document.getElementById('pw').value.trim(),
				uid:UID,
				tid:tid
			};
			$.post('/join_ok',okEnsure,function(judge){
				if(judge){ 
					join.back();
				}else{
					document.getElementById('tip').innerText='口令不对!';
				}
			});
		}
	}
});
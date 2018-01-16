var join = new Vue({
	el:'#join',
	data:{ 
		uidEnsure:{ 
			uid:uid
		}
	},
	methods:{
		back:function(){ 
			zPost('/main',this.uidEnsure);
		},
		ok:function(){
			var okEnsure = {
				password:document.getElementById('pw').value.trim(),
				uid:uid,
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
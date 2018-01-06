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
			var J_data = JSON.stringify(okEnsure);
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("POST","/join_ok",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send("J_data="+J_data);
			xmlhttp.onreadystatechange=function(){
 				if(xmlhttp.readyState==4 && xmlhttp.status==200){
 					var judge = JSON.parse(xmlhttp.responseText);
 					if(judge){ 
 						join.back();
 					}else{
 						document.getElementById('tip').innerText='口令不对!';
 					}
 				}
 			};
		}
	}
});
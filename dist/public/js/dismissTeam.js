var dismissTeam = new Vue({
	el:'#dismissTeam',
	data:{
		uid:uid,
		pw:pw,
		dataforback:{
			uid:uid
		}
	},
	methods:{
		subOnclick:function(){
		var ID = document.getElementById('ID').value.trim();
		var PW = document.getElementById('PW').value.trim();
		var issameID = issame(ID,this.uid),
			issamePW = issame(PW,this.pw);
		if(issameID&&issamePW){
			document.getElementById('dismissForm').submit();
		}else{
			if(!issameID){
				document.querySelector('.tipID').innerText = 'ID False';
			}else{
				document.querySelector('.tipID').innerText = '';
			}
			if(!issamePW){
				document.querySelector('.tipPW').innerText = 'Password False';
			}else{
				document.querySelector('.tipPW').innerText = '';
			}
		}
		},
		backtomainpage:function(){
			zPost('/main',this.dataforback);
		}
	}
});
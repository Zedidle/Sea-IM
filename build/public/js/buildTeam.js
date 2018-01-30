var buildTeam = new Vue({
	el:'#buildTeam',
	data:{
		regTeamname:/^.{2,10}$/,
		regPassword:/^.{3,8}$/,

		teamname:'',
		password:'',
		password1:'',

		tipTeamname:'',
		tipPassword:'',
		tipPassword1:'',

		flagTeamname:false,
		flagPassword:false,
		flagPassword1:false

		
	},
	methods:{

		tipOk:function(obj){
			obj.style.color = 'green';
		},
		tipAlert:function(obj){
			obj.style.color = 'red';
		},

		focusTeamname:function(){
			this.tipOk($('#tipTeamname')[0]);
			this.tipTeamname = '团队名称长度限制在2-10之间';
		},
		focusPassword:function(){
			this.tipOk($('#tipPassword')[0]);
			this.tipPassword = '口令长度限制在3-8之间';
		},
		focusPassword1:function(){
			this.tipOk($('#tipPassword1')[0]);
			this.tipPassword1 = '确认团队口令';
		},

		blurTeamname:function(){
			if(this.regTeamname.test(this.teamname)){
				this.tipTeamname = '团队名称可行';
				this.flagTeamname = true;
			}else{
				this.tipAlert($('#tipTeamname')[0]);
				this.tipTeamname = '团队名称有误';
				this.flagTeamname = false;
			}
		},
		blurPassword:function(){
			if(this.regPassword.test(this.password)){
				this.tipPassword = '密码可行';
				this.flagPassword = true;
			}else{
				this.tipAlert($('#tipPassword')[0]);
				this.tipPassword = '密码有误';
				this.flagPassword = false;
			}
		},
		blurPassword1:function(){
			if(isSame(this.password,this.password1)){
				this.tipPassword1 = '密码确认完成';
				this.flagPassword1 = true;
			}else{
				this.tipAlert($('#tipPassword1')[0]);
				this.tipPassword1 = '两次密码不一样';
				this.flagPassword1 = false;
			}
		},

		backToMainPage:function(){ 
			zPost('/main',UserEnsure);
		},

		formSubmit:function(){

			if(!(this.flagTeamname && this.flagPassword && this.flagPassword1)){
				return false;
			}
			formAddInput($('#teamForm')[0],'uid',UID);
			$('#teamForm')[0].submit();
		}	
	},
});
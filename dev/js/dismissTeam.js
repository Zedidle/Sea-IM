var dismissTeam = new Vue({
	el:'#dismissTeam',
	data:{
		teamId:'',
		teamPassword:'',

		tipTeamId:'',
		tipTeamPassword:'',

		styleTipTeamId:{
			height:'15px',
			color:'green'
		},
		styleTipTeamPassword:{
			height:'15px',
			color:'green'
		}
	},

	computed:{
		flagTeamId:function(){
			return isSame(this.teamId,UID);
		},
		flagTeamPassword:function(){
			return isSame(this.teamPassword,TeamPassword);
		}
	},

	methods:{

		focusTeamId:function(){
			this.tipTeamId = '请输入团队ID';
		},
		blurTeamId:function(){
			if(this.flagTeamId){
				this.tipTeamId = 'ID正确';
				this.styleTipTeamId.color = 'green';
			}else{
				this.tipTeamId = 'ID不正确';
				this.styleTipTeamId.color = 'red';
			}
		},

		focusTeamPassword:function(){
			this.teamPassword = '请输入团队口令'; 
		},
		blurTeamPassword:function(){
			if(this.flagTeamPassword){
				this.tipTeamPassword = '口令正确';
				this.styleTipTeamPassword.color = 'green';
			}else{
				this.tipTeamPassword = '口令不正确';
				this.styleTipTeamPassword.color = 'red';
			}
		},


		formSubmit:function(){

			if(this.flagTeamId && this.flagTeamPassword){
				document.getElementById('dismissForm').submit();
				return true;
			}

			if(!this.flagTeamId){
				this.tipTeamId = 'ID不正确';
			}

			if(!this.flagTeamPassword){
				this.tipTeamPassword = '口令不正确';
			}
		},
		backToMainPage:function(){
			zPost('/main',UserEnsure);
		}
	}
});
var login = new Vue({
	el:'#login',
	data:{
		uid:'',
		password:'',
		tip:Tip,
	},
	methods:{
		toRegist:function(){
			window.location.href='/regist';
		},

		warnTip:function(text){
			this.tip = text;
			setTimeout(function(){
				this.tip = '';
			}.bind(this), 3000);
		},

		loginJudge:function(){

			if(this.uid === '' || this.password === ''){
				this.warnTip('账号和密码不能为空');
				return false;
			}

			var data = {
				uid: this.uid,
				password: this.password
			};

			$.get('/loginJudge', data, function(bool){

				if(bool){
					this.uid = data.uid;
					this.password = data.password;
					$('#loginForm')[0].submit();

					//将帐号记录在本地
					// localStorage.setItem('UID',this.uid);
					sessionStorage.setItem('UID',this.uid);

				}else{
					this.warnTip('账号或密码有误');
				}

			}.bind(this));
		}
	}
});
var regist = new Vue({
	el:'#regist',
	data:{
		regUid:/^\w{6,16}$/,
		regPw:/^.{6,14}$/,

		uid:'',
		pw:'',
		pww:'',
		
		tipUid:'',
		tipPw:'',
		tipPww:'',
	
		styleTipUid:{
			height:'30px',
			color:'green'
		},
		styleTipPw:{
			height:'30px',
			color:'green'
		},
		styleTipPww:{
			height:'30px',
			color:'green'
		},

		submitText:'提交'
	},
	computed:{
		flagUid:function(){
			return this.regUid.test(this.uid);
		},
		flagPw:function(){
			return this.regPw.test(this.pw);
		},
		flagPww:function(){
			return isSame(this.pw,this.pww);
		}
	},
	methods:{
		backToLogin:function(){
			window.location.href='/';
		},

		focusUid:function(){
			this.tipUid = '字母和数字皆可,长度为6-16';
		},
		blurUid:function(){
			if(!this.flagUid){
				this.styleTipUid.color = 'red';
				this.tipUid = '账号有误';
				return false;
			}

			var t = this;
			$.get('/checkUidIsUsed',{uid: this.uid},function(bool){
				if(bool){
					t.tipUid = '账号已被使用';
					t.styleTipUid.color = 'red';
				}else{
					t.tipUid = '账号可用';
					t.styleTipUid.color = 'green';
				}
			});
		},
	

		focusPw:function(){
			this.tipPw = '请输入密码';
		},
		blurPw:function(){
			this.styleTipPw.color = 'green';
			
			if(this.pw === ''){
				this.tipPw = '密码不能为空';
				this.styleTipPw.color = 'red';
				return false;
			}else if(!this.flagPw){
				this.tipPw = '密码长度不对';
				this.styleTipPw.color = 'red';
			}else{
				this.tipPw = '密码可行';
				this.styleTipPw.color = 'green';
			}
		},

		focusPww:function(){
			this.tipPww = '重复确认密码';
		},
		blurPww:function(){
			if(this.pww === ''){
				this.tipPww = '密码不能为空';
				this.styleTipPww.color = 'red';
			}else if(!this.flagPww){
				this.tipPww = '两次密码不一样';
				this.styleTipPww.color = 'red';
			}else{
				this.tipPww = '确认完成';
				this.styleTipPww.color = 'green';
			}
		},

		formSubmit:function(){
			if(this.flagUid && this.flagPw && this.flagPww){
				$('#registForm').submit();
			}else{
				this.submitText = '请检查每个输入项';
				setTimeout(function(){
					regist.submitText = '提交';
				}, 2000);
			}
		},
	}
});
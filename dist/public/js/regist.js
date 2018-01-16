var regist = new Vue({
	el:'#regist',
	data:{
		uid_reg:/^\w{6,16}$/,
		pw_reg:/^.{6,14}$/,
		uid:'',
		pw:'',
		pww:'',
		uid_tip:'',
		pw_tip:'',
		pww_tip:'',
		uid_flag:false,
		pw_flag:false,
		pww_flag:false,
		submit_text:'提交'
	},
	methods:{
		backtologin:function(){
			window.location.href='/';
		},
		uidBlurCheckIsUsed:function(){
			this.uid_flag = this.uid_reg.test(this.uid);
			if(!this.uid_flag){
				$('#uid_tip')[0].style.color = 'red';
				regist.uid_tip = '账号有误';
				return false;
			}
			$.get('/checkUidIsUsed',{uid: this.uid},function(bool){
				if(bool){
					regist.uid_tip = '账号已被使用';
					$('#uid_tip')[0].style.color = 'red';
				}else{
					regist.uid_tip = '账号可用';
					$('#uid_tip')[0].style.color = 'green';
				}
			});
		},
		focusUidResponse:function(){
			this.uid_tip = '字母和数字皆可,长度为6-16';
			$('#uid_tip')[0].style.color = 'green';
		},
		focusPwResponse:function(){
			this.pw_tip = '	请输入密码';
			$('#pw_tip')[0].style.color = 'green';
		},
		blurPwResponse:function(){
			this.pw_flag = this.pw_reg.test(this.pw);
			$('#pw_tip')[0].style.color = 'red';
			if(this.pw === ''){
				return false;
			}
			if(!this.pw_flag){
				this.pw_tip = '密码长度不对';
			}else{
				this.pw_tip = '密码可行';
				$('#pw_tip')[0].style.color = 'green';
			}
		},
		focusPwwResponse:function(){
			this.pww_tip = '重复确认密码';
			$('#pww_tip')[0].style.color = 'green';	
		},
		blurPwwResponse:function(){
			this.pww_flag = issame(this.pw,this.pww);
			$('#pww_tip')[0].style.color = 'red';				
			if(!this.pww_flag){
				this.pww_tip = '两次密码不一样';
			}else if(this.pww === ''){
				this.pww_tip = '密码不能为空';
			}else{
				this.pww_tip = '确认完成';
				$('#pww_tip')[0].style.color = 'green';				
			}
		},
		formSubmit:function(){
			if(this.uid_flag && this.pw_flag && this.pww_flag){
				$('#registForm').submit();
			}else{
				this.submit_text = '请检查每个输入项';
				setTimeout(function(){
					regist.submit_text = '提交';
				},2000);
			}
		},
	}
});
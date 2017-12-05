var regist = new Vue({
	el:'#regist',
	data:{
		uidReg:new RegExp(/^[a-zA-Z].{5,15}$/),
		pwReg:new RegExp(/^[a-zA-Z0-9]{8,16}$/),
	},

	methods:{
		backtologin:function(){window.location.href='/';},
		uid:function(){$('#tip').text('字母开头，长度为6-16，数字、大小写字母和特殊字符混合');},
		Pw:function(){$('#tip').text('长度为8-16，数字和大小写字母混合');},
		Pww:function(){$('#tip').text('请重复你的密码');},
		formSubmit:function(){
			var 
				flaguser = this.uidReg.test($("#uid").val()),
				flagpw = this.pwReg.test($("#password").val())			
				flagpww = issame($("#password").val(),$("#passwordCheck").val());

			if(flaguser&&flagpw&&flagpww){
				$('#registForm').submit();
			}
			var tipText = '';
			if(!flaguser){
				tipText += '<p>用户名不正确</p>';
				$("#uid").addClass('redBorder');
			}else{
				$("#uid").removeClass('redBorder');
			}
			if(!flagpw){
				tipText += '<p>密码不正确</p>';
				$("#password").addClass('redBorder');
			}else{
				$("#password").removeClass('redBorder');
			}
			if(!flagpww){
				tipText += '<p>两次密码不一样</p>';
			} 
			$('#tip').html(tipText);
		},
	}
})
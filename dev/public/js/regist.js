$().ready(function () {
	$("#username").focus(tipUserName);
	$("#password").focus(tipPw);
	$("#passwordCheck").focus(tipPww);
	$("#email").focus(tipEmail);
	$("#sub").click(formSubmit);
	$('#backtologin').click(function(){
		window.location.href='/';
	})
})

function tipUserName(){
	$('#tip').text('字母开头，长度为6-16，数字、大小写字母和特殊字符混合');
}
function tipPw(){
	$('#tip').text('长度为8-16，数字和大小写字母混合');
}
function tipPww(){
	$('#tip').text('请重复你的密码');
}
function tipEmail(){
	$('#tip').text('请输入正确邮箱地址');
}


function formSubmit(){
	//首先会检查所有信息
	//正则集合
	var userNameReg = new RegExp(/^[a-zA-Z].{5,15}$/),
		pwReg = new RegExp(/^[a-zA-Z0-9]{8,16}$/),
		emailReg = new RegExp(/^\w+@\w+\.[a-z]{2,3}$/);

	//获取值
	var userNameVal = $("#username").val(),
		pwVal = $("#password").val(),
		pwwVal = $("#passwordCheck").val(),
		emailVal = $("#email").val();

	var flag = {
		user:userNameReg.test(userNameVal),
		pw:pwReg.test(pwVal)&&pwCheck(pwVal,pwwVal),
		email:emailReg.test(emailVal)
	};
	var tipText = '';
	if(!userNameReg.test(userNameVal)){
		tipText += '<p>用户名不正确</p>';
		$("#username").addClass('redBorder');
	}else{
		$("#username").removeClass('redBorder');
	}
	if(!pwReg.test(pwVal)){
		tipText += '<p>密码不正确</p>';
		$("#password").addClass('redBorder');
	}else{
		$("#password").removeClass('redBorder');
	}
	if(!pwCheck(pwVal,pwwVal)){
		tipText += '<p>两次密码不一样</p>';
	}
	if(!emailReg.test(emailVal)){
		tipText += '<p>电子邮箱不正确</p>';
		$("#email").addClass('redBorder');
	}else{
		$("#email").removeClass('redBorder');
	}
	$('#tip').html(tipText);

	// console.log()
	console.log(flag.user&&flag.pw&&flag.email)
	if(flag.user&&flag.pw&&flag.email){
		console.log(30)
		$('#registForm').submit();
	}else{
		console.log(29)
	}
}

//通过回车发送表单
$("body").keydown(function(e){ 
	var curKey = e.which; 
	// console.log(curKey);
	if(curKey == 13){ 
		formSubmit();
	} 
}); 


//检查两次密码是否一致
function pwCheck(pw,pww){
	return (pw===pww)?true:false;
}
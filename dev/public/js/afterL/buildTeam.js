function buildTeam(username){
	$('#back').click(function(){
		var data = {
			username:username
		}
		formPostUrl('/main',data);
	})
	var teamname = $('#teamname'),
		password = $('#password'),
		passworda = $('#passworda'),
		major = $('#major');

		teamname.focus(function(){
			$('#tipteamname').css('color','green');
			$('#tipteamname').html('<p>Your team\'s nickname:(length between 4 and 20)</p>');
		});
		password.focus(function(){
			$('#tippassword').css('color','green');
			$('#tippassword').html('<p>Your team\'s password:(length between 3 and 8)</p>');
		})
		passworda.focus(function(){
			$('#tippassworda').css('color','green');
			$('#tippassworda').html('<p>Ensure you password</p>');
		})
		major.focus(function(){
			$('#tipmajor').css('color','green');
			$('#tipmajor').html('<p>Your team is major in:?(length between 2 and 20)</p>');
		})


$('#sub').click(tip);
function tip(){
	var teamname_v = teamname.val().trim(),
		password_v = password.val().trim(),
		passworda_v = passworda.val().trim(),
		major_v = major.val().trim();

	var	reg = {
		tn:/^.{4,20}$/,
		pw:/^\w{3,8}$/,
		mj:/^.{2,20}$/,
	}

	var flag = {};

	if(reg.tn.test(teamname_v)){
		flag.tn = true;
		$('#tipteamname').html('');
	}else{
		flag.tn = false;
		$('#tipteamname').css('color','red');
		$('#tipteamname').html('<p>Teamname False</p>');
	}


	var ifSamepw = ifSame(password_v,passworda_v);
	if(reg.pw.test(password_v)&&ifSamepw){
		$('#tippassword').html('');
		$('#tippassworda').html('');
		flag.pw = true;
	}else{
		flag.pw = false;
		if(!ifSamepw){
			$('#tippassworda').css('color','red');
			$('#tippassworda').html('<p>Twice Password Not Same</p>');
		}
		if(!reg.pw.test(password_v)){
			$('#tippassword').css('color','red');
			$('#tippassword').html('<p>Password False</p>');
		
		}

	}
	if(reg.mj.test(major_v)){
		$('#tipmajor').html('');
		flag.mj = true;
	}else{
		flag.mj = false;
		$('#tipmajor').css('color','red');
		$('#tipmajor').html('<p>Major False</p>');
	}


	if(flag.tn&&flag.pw&&flag.mj){
		var input = document.createElement('input');
		input.name = 'username';
		input.value = username;
		$('#teamForm').append(input);
		$('#teamForm').submit();
	}

	function ifSame(pw,pwa){
		return pw===pwa?true:false;
	}
}
}
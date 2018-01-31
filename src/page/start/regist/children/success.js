const SuccessRegist = {
	template:`
    
<div class="container">
  	<h2>恭喜,注册成功!</h2>
    <button
      id='login-btn'
      type="button"
      class="btn btn-success"
      >直接登录
    </button>

    <a href="/">
      <button
        type="button"
        class="btn btn-default"
        >返回
      </button>
    </a>

  var UID = '<%= uid%>';
  var Password = '<%= password%>';
  document.getElementById('login-btn').onclick = function(){
    zPost('/main',{
      uid:UID,
      password:Password
    });
    sessionStorage.setItem('UID',UID);
  };


</div>
	color:#444;
      padding-top:50px;
      text-align: center;
      margin:15% auto;
      border-top:solid 5px #00A2AF;
      border-bottom:solid 5px #00A2AF;
      display: block;
      width: 80%;
      height:250px;
	`,


}


      




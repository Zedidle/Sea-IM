var Login = new Vue({

	template:`

<div id='login'>
    <div id='welcomeText'>SeaNet</div>
    <form
        v-on:keydown.enter = 'loginJudge'
        id='loginForm'
        class="bs-example bs-example-form"
        action="/"
        method="post"
    >

        <div class="title">
            登录
        </div>

        <div id="login-content">
            <div class="input-group">
                <span class="min-width-90 input-group-addon">
                    <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                    用户名
                </span>
                <input
                    class="form-control"
                    name="uid"
                    id="uid"
                    v-model.trim='uid'
                    placeholder="输入ID"
                >
            </div>
            <br>
            <div class="input-group">
                <span class="min-width-90 input-group-addon">
                    <span class="glyphicon glyphicon-lock" aria-hidden="true"></span>
                    密码
                </span>
                <input
                    type="password"
                    class="form-control"
                    name="password"
                    id="password"
                    v-model.trim='password'
                    placeholder="输入密码"
                >
            </div>

            <div id='tip'><b>{{tip}}</b></div>

            <div id='chooseRL'>
                <input
                    id='loginSubmitBtn'
                    type="button"
                    class="btn btn-success"
                    v-on:click='loginJudge'
                    value="登录"
                >
                <input
                    id="toRegistBtn"
                    v-on:click='toRegist'
                    type="button"
                    class="btn btn-primary"
                    value="注册"
                >
            </div>
        </div>
    </form>
</div>


<script>
    var Tip = '<%= loginTip%>';
</script>

	`,

	data:function(){
        return {
    		uid:'',
    		password:'',
    		tip:false,
        }
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
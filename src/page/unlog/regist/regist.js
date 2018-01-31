var regist = {
	// el:'#regist',





	tempalte:`
#regist{
        border:1px solid #00A2AF;
        border-bottom-width:10px;
        box-shadow: 0 0 5px #999;
        margin-top:10%;
        width:320px;
        padding:0;
        border-radius: 2px;
    }
    .title{
        background-color:#00A2AF;
        color:#FFF;
        height:40px;
        line-height: 40px;
        font-weight:600;
        font-size:16px;
        text-align: center;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
    }
    #registForm{
        margin:20px auto;
        width:300px;
    }
    @media (max-width: 500px){
        .container{
            padding:5px;
        }
        #registForm{
            padding:10px;
        }
    }
    #registForm input{
        height:40px;
    }
    .redBorder{
        border:1px solid red;
    }
    .btn{
        margin:0 2%;
        width:45%;
    }
    .min-widch-100{
        min-width:100px;
    }
    </style>
</head>
<body>

<div class="container" id='regist'>


    <div class="title">
        注册
    </div>

    <form
        v-on:keyup.enter="formSubmit"
        class="bs-example bs-example-form"
        role="form"
        id='registForm'
        action="/successRegist"
        method="post"
    >
        <div class="input-group">
            <span class="min-widch-100 input-group-addon">
                <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                ID
            </span>
            <input
                v-on:focus='focusUid'
                v-on:blur='blurUid'
                type="text"
                class="form-control"
                name="uid"
                v-model.trim='uid'
                placeholder="输入ID"
            >
        </div>
        <div
            v-bind:style='styleTipUid'
        >{{tipUid}}
        </div>

        <div class="input-group">
            <span class="min-widch-100 input-group-addon">
                <span class="glyphicon glyphicon-lock" aria-hidden="true"></span>
                密码
            </span>
             <input
                v-on:focus="focusPw"
                v-on:blur='blurPw'
                type="password"
                class="form-control"
                name="password"
                id="password"
                v-model.trim='pw'
                placeholder="输入密码"
            >
        </div>
        <div
            v-bind:style='styleTipPw'
        >{{tipPw}}
        </div>

    	<div class="input-group">
            <span class="min-widch-100 input-group-addon">
                <span class="glyphicon glyphicon-lock" aria-hidden="true"></span>
                确认密码
            </span>
            <input
                v-on:focus="focusPww"
                v-on:blur='blurPww'
                type="password"
                class="form-control"
                name="passwordCheck"
                id="passwordCheck"
                v-model.trim='pww'
                placeholder="确认密码"
            >
        </div>
        <div
            v-bind:style='styleTipPww'
        >{{tipPww}}
        </div>

    	<button
            v-on:click="formSubmit"
            type="button"
            class="btn btn-success"
        >{{submitText}}
        </button>
    	
        <button 
            v-on:click='backToLogin'
            type="button"
            class="btn btn-default"
        >返回
        </button>
    </form>
	`,
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
}
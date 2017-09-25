var buildTeam = new Vue({
	components:{
		'submit-button':{
			props:['uid'],
      template:` 
      	<input v-on:click='tipSubmit' type="button" id='sub' value='Bulid'>
			`,
			data:function(){
				return {		
					flag:{},
					reg:{
						tn:/^.{4,20}$/,
						pw:/^\w{3,8}$/,
						mj:/^.{2,20}$/,
					}
				}
			},
			computed:{		
				name_v:function(){
					return $('#name').val().trim();
				},
				password_v:function(){
					return $('#password').val().trim();
				},
				passworda_v:function(){
					return $('#passworda').val().trim();
				},
				major_v:function(){
					return $('#major').val().trim();
				},
			},
			methods:{
				tipSubmit:function(){
			if(this.reg.tn.test(this.name_v)){
				this.flag.tn = true;
				$('#tipname').html('');
			}else{
				this.flag.tn = false;
				$('#tipname').css('color','red');
				$('#tipname').html('<p>name False</p>');
			}

			var issamepw = issame(this.password_v,this.passworda_v);
			if(this.reg.pw.test(this.password_v)&&issamepw){
				$('#tippassword').html('');
				$('#tippassworda').html('');
				this.flag.pw = true;
			}else{
				this.flag.pw = false;
				if(!issamepw){
					$('#tippassworda').css('color','red');
					$('#tippassworda').html('<p>Twice Password Not Same</p>');
				}
				if(!this.reg.pw.test(this.password_v)){
					$('#tippassword').css('color','red');
					$('#tippassword').html('<p>Password False</p>');
				}
			}
			if(this.reg.mj.test(this.major_v)){
				$('#tipmajor').html('');
				this.flag.mj = true;
			}else{
				this.flag.mj = false;
				$('#tipmajor').css('color','red');
				$('#tipmajor').html('<p>Major False</p>');
			}
			if(this.flag.tn&&this.flag.pw&&this.flag.mj){
				var input = document.createElement('input');
				input.name = 'uid';
				input.value = this.uid;
				$('#teamForm').append(input);
				$('#teamForm').submit();
			}
		}	
			}
		},

		'back-button':{
			props:['uid'],
      template:`
      	<button v-on:click='backtomain' type='button' id='back'>Cancel</button>
			`,
			data:function(){
				return{
					userEnsure:{
						uid:this.uid
					},
				}
			},
			methods:{
				backtomain:function(){
					formPostUrl('/main',this.userEnsure);
				},
			},
		}
	},


	el:'#buildTeam',
	data:{

	},
	computed:{

	},
	methods:{
		tipname:function(){
			$('#tipname').css('color','green');
			$('#tipname').html('<p>Team\'s name:(length between 4 and 20)</p>');
		},
		tipPassword:function(){
			$('#tippassword').css('color','green');
			$('#tippassword').html('<p>Your team\'s password:(length between 3 and 8)</p>');
		},
		tipPasswordA:function(){
			$('#tippassworda').css('color','green');
			$('#tippassworda').html('<p>Ensure you password</p>');
		},
		tipMajor:function(){
			$('#tipmajor').css('color','green');
			$('#tipmajor').html('<p>Your team is major in:?(length between 2 and 20)</p>');
		},
	},
});
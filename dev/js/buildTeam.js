var buildTeam = new Vue({
	components:{
		'submit-button':{
			props:['uid'],
      		template:
      			'<input v-on:click="tipSubmit" type="button" id="sub" value="Bulid">',
			data:function(){
				return {		
					flag:{},
					reg:{
						tn:/^.{2,20}$/,
						pw:/^\w{3,8}$/
					}
				};
			},
			methods:{
				tipSubmit:function(){
					var name_v = $('#teamname').val().trim();
					var pw_v = $('#pw').val().trim();
					var pww_v = $('#pww').val().trim();

					if(this.reg.tn.test(name_v)){
						this.flag.tn = true;
						$('#tipname').html('');
					}else{
						this.flag.tn = false;
						$('#tipname').css('color','red');
						$('#tipname').html('<p>name error</p>');
					}

					var issamepw = issame(pw_v,pww_v);
					if(this.reg.pw.test(pw_v)&&issamepw){
						$('#tippw').html(''); $('#tippww').html('');
						this.flag.pw = true;
					}else{
						this.flag.pw = false;
						if(!issamepw){
							$('#tippww').css('color','red');
							$('#tippww').html('<p>twice password not same</p>');
						}
						if(!this.reg.pw.test(pw_v)){
							$('#tippw').css('color','red');
							$('#tippw').html('<p>password error</p>');
						}
					}
					if(this.flag.tn&&this.flag.pw){
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
      		template:
      			'<button v-on:click="backtomain" type="button" id="back">Cancel</button>',
			data:function(){
				return{
					userEnsure:{ 
						uid:this.uid
					},
				};
			},
			methods:{
				backtomain:function(){ 
					zPost('/main',this.userEnsure);
				}
			},
		}
	},

	el:'#buildTeam',
	data:{},
	computed:{},
	methods:{
		tipname:function(){
			$('#tipname').css('color','green');
			$('#tipname').html('<p>Team\'s name:(length between 4 and 20)</p>');
		},
		tipPassword:function(){
			$('#tippw').css('color','green');
			$('#tippw').html('<p>Your team\'s password:(length between 3 and 8)</p>');
		},
		tipPasswordA:function(){
			$('#tippww').css('color','green');
			$('#tippww').html('<p>Ensure you password</p>');
		},
	},
});
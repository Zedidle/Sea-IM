<template>
	<div id='LRform'>
		<form
	        class="bs-example bs-example-form"
	    >
	        <div class="title">
	            {{ loginOrRegist==='l'?'登录':'注册' }}
	        </div>

        	<div :style='contentS'>
	            <div class="input-group">
	                <span class="min-width-90 input-group-addon">
	                    ID
	                </span>
	                <input
	                	@focus='focusUid'
	                	@blur='blurUid'
	                    class="form-control"
	                    name="uid"
	                    id="uid"
	                    v-model.trim='uid'
	                    placeholder="输入ID"
	                >
	            </div>
	            <b
					:style='tipUidS'
	            >{{tipUid}}
	        	</b>



	            <br>
	            <div class="input-group">
	                <span class="min-width-90 input-group-addon">
	                    密码
	                </span>
	                <input
		                @focus="focusPw"
		                @blur='blurPw'
	                    type="password"
	                    class="form-control"
	                    name="password"
	                    id="pw"
	                    v-model.trim='pw'
	                    placeholder="输入密码"
	                >
	            </div>
	           	<b
					:style='tipPwS'
	            >{{tipPw}}
	        	</b>



	            <br>
				<transition name='fadeX50'>
		           	<div class="input-group" v-if='loginOrRegist==="r"'>
		                <span class="min-width-90 input-group-addon">
		                    重复密码
		                </span>
			            <input
			                @focus="focusPww"
			                @blur='blurPww'
			                type="password"
			                class="form-control"
			                name="passwordCheck"
			                id="pww"
			                v-model.trim='pww'
			                placeholder="确认密码"
			            >
					</div>
				</transition>
				<transition name='fadeX50'>
					<b
						v-if='loginOrRegist==="r"'
						:style='tipPwwS'
			            >{{tipPww}}
			        </b>
				</transition>


			</div>

            <div id='chooseRL'>
                <input
                    type="button"
                    :style='lBtnS'
                    @click='toLogin'
                    class="btn btn-success"
                    v-model="lBtnText"
                >
                <input
                    type="button"
                    :style='rBtnS'
                    @click='toRegist'
                    class="btn btn-primary"
                    v-model="rBtnText"
                >
            </div>
	    </form>
	

        <transition name='bounce'>
            <success-regist
                v-show='isSuccessRegist'
            ></success-regist>
        </transition>   
    </div>
</template>

<script>
	
import $ from 'jquery';
import {mapState,mapMutations} from 'vuex';
import successRegist from './children/successRegist.vue';

export default{
	data(){
		return{
			LOR:'l',
			
			lBtnText:'登录',
			rBtnText:'注册',

			tip:null,
			regUid:/^\w{6,16}$/,
            regPw:/^.{6,14}$/,

            uid:'',
            pw:'',
            pww:'',
            
            tipUid:'',
            tipPw:'',
            tipPww:'',

            tipUidS:{
            	color:'green',
            },
            tipPwS:{
            	color:'green',
            },
            tipPwwS:{
            	color:'green',
            },
		}
	},
	components:{
		successRegist,
	},
	computed:{
        ...mapState([
        	'loginOrRegist',
            'isLogin',
            'isSuccessRegist'
        ]),

		lBtnS(){
			return{
				float:'left',
				width:this.LOR === 'l'?'80%':'15%',
			}
		},

		rBtnS(){
			return{
				float:'right',
				width:this.LOR === 'r'?'80%':'15%',
			}
		},

		contentS(){
			return {
	        	padding:'10px',
				height:this.LOR === 'l'?'120px':'170px',
				overflow: 'hidden',
				transition:'height .5s',
			}
        },


        flagUid:function(){
            return this.regUid.test(this.uid);
        },
        flagPw:function(){
            return this.regPw.test(this.pw);
        },
        flagPww:function(){
            return this.issame(this.pw,this.pww);
        },



	},
	methods:{

        ...mapMutations([
            'startLogin',
            'startRegist',
            'toLogin',
            'toggleRegistS'
        ]),


        issame:function(v1,v2){
        	return v1===v2;
        },

        toLogin:function(){
        	
        	if(this.LOR ==='l'){
        		this.lSubmit();
        		return;
        	}

        	this.LOR = 'l';
        	this.startLogin();

        },
        toRegist:function(){
        	if(this.LOR ==='r'){
        		this.rSubmit();
        		return;
        	}

        	this.LOR = 'r';
        	this.startRegist();
        },

        lSubmit:function(){

            if(this.uid === '' || this.pw === '') return; 

            let vm = this;

        	if(this.flagUid && this.flagPw){
            $.get('/loginJudge', {
              uid: this.uid,
              password: this.password
            }, function(isOkToLogin){
              if(isOkToLogin){
                vm.uid = data.uid;
                vm.password = data.password;
                  
                $.post('/login',{
                  uid:vm.uid,
                  password:vm.password
                },function(allData){
                  //这里去获得所有状态到vuex里

                //*************************
                










                


















                  //将帐号记录在浏览器
                  // localStorage.setItem('UID',this.uid);
                  // sessionStorage.setItem('UID',this.uid);
                });


                }else{
                  this.lBtnText = '帐号已登录';
                  setTimeout(function(){
                    vm.lBtnText = '登录';
                  }, 2000);
                }
            });
          }else{
              this.lBtnText = '请检查每个输入项';
              setTimeout(function(){
                  vm.lBtnText = '登录';
              }, 2000);
          }
        },

        rSubmit:function(){
        	console.log('rSubmit');

        	console.log(this.flagUid && this.flagPw && this.flagPww);

        	if(this.flagUid && this.flagPw && this.flagPww){

                let vm = this;
                $.post('/regist',{
                    uid:this.uid,
                    password:this.pw

                },function(isSuccess){
                    if(isSuccess){
                        console.log('regist success!')
                        vm.uid = '';
                        vm.pw = '';
                        vm.pww = '';
                        // 提示注册成功的组件出现
                        vm.toggleRegistS();
                    }else{
                        console.log('regist fail!')
                    }
                })


            }else{
                this.rBtnText = '请检查每个输入项';
                var vm = this;
                setTimeout(function(){
                    vm.rBtnText = '注册';
                }, 2000);
            }
        },

        focusUid:function(){
        	if(this.LOR==='l'){
        		this.tipUid = '';
        	}else{
            	this.tipUid = '字母和数字皆可,长度为6-16';
        	}
        },
        blurUid:function(){

            if(!this.flagUid){
                this.tipUid = '账号有误';
                this.tipUidS.color = 'red';
                return;
            }

            var vm = this;
            $.get('/checkUidIsUsed',{uid: this.uid},function(bool){
            	//检查帐号是否存在
            	console.log('检查帐号是否存在');
                if(bool){
                	if(vm.LOR==='r'){
                    	vm.tipUid = '账号已被使用';
                    	vm.tipUidS.color = 'red';
                	}else{

                	}
                }else{
                	console.log(vm.LOR);
                	if(vm.LOR==='l'){
	                    vm.tipUid = '此账号不存在';
                    	vm.tipUidS.color = 'red';
                	}else{
                    	vm.tipUid = '账号可用';
                    	vm.tipUidS.color = 'green';
                	}
                }
            });
        },

        focusPw:function(){
            this.tipPw = '请输入密码';
        },
        blurPw:function(){
            this.tipPwS.color = 'green';
            
            if(this.pw === ''){
                this.tipPw = '密码不能为空';
                this.tipPwS.color = 'red';
                return false;
            }else if(!this.flagPw){
                this.tipPw = '密码长度不对';
                this.tipPwS.color = 'red';
            }else{
                this.tipPw = '密码可行';
                this.tipPwS.color = 'green';
            }
        },

        focusPww:function(){
            this.tipPww = '重复确认密码';
        },
        blurPww:function(){
        	console.log('blurPww');
            if(this.pww === ''){
                this.tipPww = '密码不能为空';
                this.tipPwwS.color = 'red';
            }else if(!this.flagPww){
                this.tipPww = '两次密码不一样';
                this.tipPwwS.color = 'red';
            }else{
                this.tipPww = '确认完成';
                this.tipPwwS.color = 'green';
            }
        },
	}
}
</script>

<style lang='less' scoped>

    .min-width-90{
        min-width:90px;
    }

	#LRform{
		min-width:320px;
		width:400px;
        display:inline-block;
        border:1px solid #479;
        border-radius:2px;
        background:rgba(255,255,255,0.9);
        box-shadow: 0 0 10px #999;
        @media(max-width:768px){
            width:95%;
            position:fixed;
            left:50%;
            top:30%;
            transform: translateX(-50%);
        }

        #chooseRL{
        	margin:10px;
			
			&:after{
				content:'';
				display:block;
				height:0;
				clear:both;
				visibility:hidden;
			}
        }
	}

</style>
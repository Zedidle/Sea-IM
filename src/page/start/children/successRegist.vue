<template>
	<div class="success">
	  	<h2>恭喜,注册成功!</h2>
	    <button @click = 'toLoginSR'> 直接登录 </button>
		<button @click = 'toggleRegistS'> 返回 </button>
	</div>
</template>

<script>

	console.log('link to successRegist!');
	import $ from 'jquery';
	import {mapState,mapMutations} from 'vuex';

	export default {
		data(){
			return{

			}
		},

		computed:{
			...mapState([
            	'isSuccessRegist',
            	'rUid',
            	'rPw',
        	]),
		},

		methods:{

	        ...mapMutations([
	            'toggleRegistS',
	            'getAllLoginData',
	        ]),
	        toLoginSR(){
	        	let vm = this;
	        	console.log(vm.rUid);
	        	console.log(vm.rPw);
	        	$.post('/login',{
                    uid:vm.rUid,
                    password:vm.rPw
                },allData=>{
                    //这里去获得所有状态到vuex里
                    console.log(allData);
                    vm.getAllLoginData(allData);
                    //并使页面跳转
                    vm.$router.push({ path: '/m'});
                });
	        },
		}
	}
</script>

<style scoped>
  .success{
  	z-index: 8888888;
  	position:absolute;
    top:50%;
    left:50%;
    width: 400px;
    height:200px;
    padding-top:30px;
    color:#333;
    background:rgba(255,255,255,0.8);
    transform: translateX(-50%) translateY(-50%);
    text-align: center;
    border-top:solid 5px #00A2AF;
    border-bottom:solid 5px #00A2AF;
  }
</style>



      

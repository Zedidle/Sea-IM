<template>
	<div class="success">
	  	<h2>恭喜,注册成功!</h2>
	    <button
	      type="button"
	      class="btn btn-success"
	      >直接登录
	    </button>

		<button
			type="button"
			class="btn btn-default"
			@click = 'toggleRegistS'
		>返回
		</button>
	</div>
</template>

<script>

	console.log('link to successRegist!');
	import {mapState,mapMutations} from 'vuex';

	export default {
		data(){
			return{

			}
		},

		computed:{
			...mapState([
            	'isSuccessRegist'
        	]),
		},

		methods:{

	        ...mapMutations([
	            'toggleRegistS'
	        ]),

			back(){
				console.log('back 23333');
			    // zPost('/main',{
			      // uid:UID,
			      // password:Password
			    // });
			    // sessionStorage.setItem('UID',UID);
			}
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
    padding-top:20px;
    color:#333;
    background:rgba(255,255,255,0.8);
    transform: translateX(-50%) translateY(-50%);
    text-align: center;
    border-top:solid 5px #00A2AF;
    border-bottom:solid 5px #00A2AF;
  }
</style>



      

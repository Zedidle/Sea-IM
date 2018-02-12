<template>
	<div id="should">
		<h4 style='color:#333;'>你已经建立了一个团队，需要先解散原团队.</h4>
		<button 
			@click = 'dismiss'
			class="btn 	btn-warning"
		>解散原团队
		</button>
		<button id='back' class="btn btn-default">返回</button>
	</div>
</template>


<script>
import {mapState,mapMutations} from 'vuex';

export default {
  data(){
    return {
		style1:{
			paddingTop:'50px',
			textAlign: 'center',
			margin:'15% auto',
			borderTop:'solid 5px #AA2233',
			borderBottom:'solid 5px #AA2233',
			display: 'block',
			width: '80%',
			height:'200px',
			boxShadow: '5px 5px 10px #999',
		}
    }
  },
  computed:{
    ...mapState([

    ]),
  },
  methods:{
    ...mapMutations([

    ]),
    dismiss:function(){
    	console.log('DISMISS');
		// window.location.href='/dismissTeam?uid='+UID;

    }
  }
}

</script>

<style lang='less' scoped>
    
</style>



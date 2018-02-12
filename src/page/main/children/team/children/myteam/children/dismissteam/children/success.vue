<template>
    <div id="success-dismiss">
		<h3>已经成功解散团队！</h3>
		<h4>接下来要：</h4>
		<button
			@click = 'back'	
		>返回主页
		</button>
		<button
			@click = 'toBuild'
		>另建团队
	</button>
	</div>
</template>


<script>
import {mapState,mapMutations} from 'vuex';

export default {
  data(){
    return {
    }
  },
  computed:{
    ...mapState([

    ]),
  },
  methods:{
    ...mapMutations([

    ]),
    back:function(){
    	console.log('back');
    },
    toBuild:function(){
    	console.log('to build');
		// zPost('/DealWithTeam');
    }
  }
}

</script>

<style lang='less' scoped>
    
</style>




	<script>

	</script>

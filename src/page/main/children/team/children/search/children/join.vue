<template>
<div
	class='joinContainer'
	v-if='isToJoin'
>
	<div
		class='cancel'
		v-if='isHadJoined()'
		@click='notJoin'
	>
		<h4>You had joined this team.</h4>
	</div>

	<div 
		v-else
		class='content'
	>
		<h5 style='text-align:center;'>
			PASSWORD
		</h5>
		<input v-model='pw'/>
		<button
			@click='ensureToJoin'
			class='btn btn-primary'
		>ENSURE
		</button>
		<button
			@click='notJoin'
			class='btn btn-warning'
		>CANCEL
		</button>
	</div>
</div>
</template>


<script>
import {mapState,mapMutations} from 'vuex';

export default {
  data(){
    return {
    	pw:'',
    }
  },
  computed:{
    ...mapState([
    	'isToJoin',
    	'teamInfo',
    	'tTodoProps',
    	'foundTeamsInfo',
    ]),
  },
  methods:{
    ...mapMutations([
    	'notJoin',
    ]),

    ensureToJoin(){
    	console.log('----------ensureToJoin----------');
    	for(let i of this.foundTeamsInfo){
    		console.log('tid,password:');
    		console.log(i.uid,i.password);
    		if(this.tTodoProps.uid === i.uid &&
    		 this.pw === i.password){
    			/*join...*/
    			console.log('got it!');
    		}
    	}
    },
    isHadJoined(){
		for(let i of this.teamInfo){
			if(i.uid === this.tTodoProps.uid){
				return true;
			}
		}
		return false;
	},
  }
}

</script>

<style lang='less' scoped>
    .joinContainer{
		width:300px;
		padding:10px 0;
		box-shadow: 0 0 5px #999;
		.cancel{
			&:hover{
				box-shadow: 0 0 5px #999;
			}
		}
		.content{
			text-align: center;
			input{
				text-align: center;
				border:none;
				box-shadow: 0 0 3px #999;
				margin-bottom:5px;
				&:hover{
					box-shadow: 0 0 3px #7CC;
				};
			}
		}
    }
</style>

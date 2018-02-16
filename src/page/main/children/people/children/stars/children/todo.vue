<template>
	<div
		id='pTodo'
		v-if='onPTodo'
		:style='pTodoS'
	>
		<div
			@click='hidePTodo'
			style='color:red;'
		><b>
			<i class='icon iconfont icon-wrong'></i>			
		</b>
		</div>
		<div><b>{{pTodoProps.uid}}</b></div>
		<button
			id='moreinfo'
		>
			<i class='icon iconfont icon-account'></i>			
		</button>
		<button
			id='mess'
		>
			<i class='icon iconfont icon-edit'></i>			
		</button>
		<button
			id='remove'
		>
			<i class='icon iconfont icon-delete'></i>			
		</button>
	</div>
</template>

<script>
import {mapState,mapMutations} from 'vuex';

	export default{
		data(){
			return{

			}
		},
		computed:{
			...mapState([
				'onPTodo',
				'pTodoProps',
			]),
			pTodoS(){
				return {
					position:'absolute',
					width:'120px',
					boxShadow:'0 0 5px #999',
					top:this.pTodoProps.y + 'px',
					left:this.pTodoProps.x + 'px',
					textAlign: 'center',
				}
			}
		},
		methods:{
			...mapMutations([
				'hidePTodo',
			]),
		}
		
	}
</script>

<style lang='less' scoped>
	#pTodo{
		div{
			text-align: center;
			background-color: #111;
			color:#FFF;
			&:first-child{
				cursor:pointer;
			};
		}
		button{
			text-align: center;
			vertical-align: center;
			border:none;
			color:#FFF;
			margin:5px 0;
			width:100px;
			height:30px;
		}
		#moreinfo{
			background-color: #55A;
			box-shadow: 0 0 5px #55A;
		}
		#mess{
			background-color: #3A3;
			box-shadow: 0 0 5px #3A3;
		}
		#remove{
			background-color: #A22;
			box-shadow: 0 0 5px #A22;
		}
	}
</style>
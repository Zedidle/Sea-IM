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
			@click='clickMoreInfo'
		>
			<i class='icon iconfont icon-account'></i>			
		</button>
		<button
			id='mess'
			@click = 'clickMessBtn'
		>
			<i class='icon iconfont icon-edit'></i>			
		</button>
		<button
			id='remove'
			@click='removeStar'
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
				'UID',
				'onPTodo',
				'pTodoProps',
				'starInfo',
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
				'showSMoreInfo',
		    	'showMessageframe',
		    	'toggleDomore',
		    	'togglePeople',
		    	'removeStar',
			]),
			clickMoreInfo(){
				console.log('------clickMoreInfo------')
				console.log('starInfo:');
				console.log(this.starInfo);
				for(let i of this.starInfo){
					if(this.pTodoProps.uid===i.uid){
						this.showSMoreInfo(i);
						break;
					}
				}
			},
			clickMessBtn(){
				console.log('------clickMoreInfo------')
				for(let i of this.starInfo){
					if(this.pTodoProps.uid===i.uid){
						console.log('------clickMoreInfo------');
						console.log('star info:');
						console.log(i);
        				this.showMessageframe({uid:i.uid,name:i.name,type:i.level?"t":"p"});
						this.togglePeople();
						this.toggleDomore();
						break;
					}
				}
			}
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
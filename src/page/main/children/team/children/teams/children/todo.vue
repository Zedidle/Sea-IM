<template>
	<div
		id='tTodo'
		v-if='onTTodo'
		:style='tTodoS'
	>
		<div
			@click='hideTTodo'
			style='color:red;'
		><b>
			<i class='icon iconfont icon-wrong'></i>			
		</b>
		</div>
		<div><b>{{tTodoProps.uid}}</b></div>
		<button
			id='moreinfo'
			@click='clickMoreInfo'
		>
			<i class='icon iconfont icon-navlist'></i>			
		</button>
		<button
			id='mess'
			@click = 'clickMessBtn'
		>
			<i class='icon iconfont icon-edit'></i>			
		</button>
		<button
			id='add'
			v-show='!isMyteam'
			@click='leaveTeam'
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
				'teamInfo',
				'onTTodo',
				'tTodoProps',
				'foundTeamsInfo',
			]),
			isMyteam(){
				return this.UID === this.tTodoProps.uid;
			},
			tTodoS(){
				return {
					position:'absolute',
					width:'120px',
					boxShadow:'0 0 5px #999',
					top:this.tTodoProps.y + 'px',
					left:this.tTodoProps.x + 'px',
					textAlign: 'center',
				}
			}
		},
		methods:{
			...mapMutations([
				'hideTTodo',
				'showTMoreInfo',
		    	'showMessageframe',
		    	'toggleDomore',
		    	'toggleTeam',
		    	'leaveTeam',
			]),
			clickMoreInfo(){
				console.log('------clickMoreInfo------')
				for(let i of this.teamInfo){
					if(this.tTodoProps.uid===i.uid){
						this.showTMoreInfo(i);
						break;
					}
				}
			},
			clickMessBtn(){
				console.log('------clickMessBtn------')
				for(let i of this.teamInfo){
					if(this.tTodoProps.uid===i.uid){
						console.log('team info:');
						console.log(i);
        				this.showMessageframe({uid:i.uid,name:i.name,type:i.level?"t":"p"});
						this.toggleTeam();
						this.toggleDomore();
						break;
					}
				}
			}
		}
		
	}
</script>

<style lang='less' scoped>
	#tTodo{
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
		#add{
			background-color: #A22;
			box-shadow: 0 0 5px #A22;
		}
	}
</style>
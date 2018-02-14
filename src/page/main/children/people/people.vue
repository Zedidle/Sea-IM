<template>
	<div 
		id="people"
		v-show='onPeople'
	>
		<div 
			class="close"
			@click = 'togglePeople'
		>
			<i class='icon iconfont icon-wrong'></i>
		</div>

		<div class="top">

			<transition name='fadeY-10'>
			<div
				id='operator'
				v-show='!onPSearch'
			>
				<div>
					<i class='icon iconfont icon-accountfilling'></i>
				</div>
				<div>
					<i class='icon iconfont icon-favorite'></i>
				</div>
				<div
					@click='showPSearch'
				>
					<i class='icon iconfont icon-search'></i>
				</div>
			</div>
			</transition>


			<transition name='fadeY-10'>
			<div 
				id='search'
				v-show='onPSearch'
			>
				<span
					@click='hidePSearch'
				>
					<i class='icon iconfont icon-close'></i>
				</span>
				<input 
					v-model='psInput'
				>
				<div
				>
					<i class='icon iconfont icon-search'></i>
				</div>
			</div>
			</transition>


		</div>
		
<!-- 		<div class="content">
			<transition name='fadeY-10'>
				<me></me>
			</transition>	
			<transition name='fadeY-10'>
				<stars></stars>
			</transition>	
			<transition name='fadeY-10'>
				<search></search>
			</transition>	
		</div> -->

	</div>


</template>



<script>
	import me from './children/me.vue';
	import stars from './children/stars.vue';
	import search from './children/search.vue';

	import {mapState,mapMutations} from 'vuex';
	export default {
		data(){
			return{
				psInput:'',
			}
		},
		components:{
			me,
			stars,
			search,
		},
		computed:{
			...mapState([
				'onPeople',
				'userInfo',
				'onPSearch',
			]),
		},
		methods:{
			...mapMutations([
				'togglePeople',
				'showPSearch',
				'hidePSearch',
			]),
		}
	}


</script>



<style lang='less' scoped>
	#people{
		
		width: 300px;
		height: 500px;
		box-shadow: 0 0 10px #999;
		position:absolute;
		top:50%;
		left:50%;
		transform: translateX(-50%) translateY(-50%);
		background:rgba(255,255,255,0.9);
		z-index:10000001;


		.close{
			width: 100%;
			height:40px;
			line-height: 34px;
			text-align: center;
			font-size: 24px;
			font-weight: 600;
			border-bottom:2px solid #7CC;
			&:hover{
				i{
					color:red;
				}
			}
		}
		.top{
			height:40px;

			#operator{
				height:40px;
				div{
					text-align: center;
					font-weight: 600;
					float: left;
					width:99px;
					line-height:40px; 
					height: 40px;
					border-bottom:1px solid #7CC;

					&:hover{
						box-shadow: 0 0 5px #999;
						color:#77CCCC;
						cursor:pointer;
					};
				}
			}

			#search{
				span{
					display: inline-block;
					float:left;
					height:40px;
					width:40px;
					line-height: 35px;
					text-align: center;
					font-size:22px;
					&:hover{
						cursor: pointer;
						color:red;
						box-shadow: 0 0 5px #999;
					};
				}
				
				input{
					border:none;
					float:left;
					font-size: 18px;
					background:transparent;
					height:40px;
					width:200px;
					&:hover{
						box-shadow: 0 5px 5px #999;
						color:#77CCCC;
					};		
				}

				div{
					float:left;
					width:58px;
					height:40px;
					line-height: 40px;
					text-align: center;
					&:hover{
						cursor: pointer;
						box-shadow: 0 0 5px #999;
						color:#77CCCC;
					};
				}
			}
		}

		.content{
			height:440px;
		}
	}

</style>
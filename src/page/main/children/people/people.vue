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


		<transition name='fadeY-10'>
		<div
			id='operator'
			v-show='!onPSearch'
		>
			<div
				@click='changeContent("me")'
			>
				<i class='icon iconfont icon-accountfilling'></i>
			</div>
			<div
				@click='changeContent("stars")'
			>
				<i class='icon iconfont icon-favorite'></i>
			</div>
			<div
				@click='changeContent("search")'
			>
				<i class='icon iconfont icon-search'></i>
			</div>
		</div>
		</transition>

		<!-- search people -->
		<transition name='fadeY-10'>
		<div 
			id='search'
			v-show='onPSearch'
		>
			<span
				@click='closePSearch'
			>
				<i class='icon iconfont icon-close'></i>
			</span>
			<input 
				v-model='psInput'
				@keyup.enter = 'searchP'
			>
			<div
				@click='searchP'
			>
				<i class='icon iconfont icon-search'></i>
			</div>
		</div>
		</transition>


		
		<div class="content">
			<component :is='pContent'></component>
		</div>

	</div>


</template>



<script>
	import me from './children/me/me.vue';
	import stars from './children/stars/stars.vue';
	import search from './children/search/search.vue';

	import {mapState,mapMutations} from 'vuex';
	export default {
		data(){
			return{
				psInput:'',
				pContent:'me',  //default:me||stars||search
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
				'searchPeople',
			]),
			searchP(){
				console.log('----------searchP----------');
				console.log('psInput:');
				console.log(this.psInput);
				if(this.psInput){
					this.searchPeople(this.psInput);
				}
			},
			changeContent(d){
				this.pContent = d;
				if(d==='search'){
					this.showPSearch()
				}

			},
			closePSearch(){
				this.hidePSearch();
				this.pContent = 'me';
			}

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

		#operator{
			height:40px;
			margin-top:40px;
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
			&:after{
				display:block;
				clear:both;
				content:"";
				visibility:hidden;
				height:0;
			}
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

		.content{
			height:440px;
		}
	}

</style>
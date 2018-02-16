<template>
	<div 
		id="stars"
	>
		<todo></todo>


		<!-- find stars in your list base on keyword-->
		<div class='find'>
			<div>
				<i class='icon iconfont icon-search'></i>
				<input
					v-model='starsKeyword'
					@keyup='keyupFSI'
					@focus='focusFSI'
					@blur='blurFSI'
				>
			</div>
			<transition-group tag='ul' name='fadeY-10'>
				<li
					v-for='i in foundStarsInfo'
					:key='i.uid'
					@click='clickLi(i.uid,$event)'

				>
					<img :src="i.headImg">
					<div>
						<div class='name'>{{i.name}}</div> 			
						<div class='introduce'>{{i.introduce}}</div> 			
  					</div>
				</li>				
			</transition-group>
		</div>


		<!-- all stars in your list -->
		<ul>
			<li 
				v-for="i in starInfo"
				:key="i.uid"
				@click = 'clickLi(i.uid,$event)'
			>
				<img :src="i.headImg">
				<div>
					<div class='name'>{{i.name}}</div> 			
					<div class='introduce'>{{i.introduce}}</div>	
  				</div>
  			</li>
		</ul>

	</div>
</template>
<script>
import todo from './children/todo.vue';
import {mapState,mapMutations} from 'vuex';
	export default {
		data(){
			return{
				starsKeyword:'',
				ensureFind:false,
				intervalFind:null,
				timeoutCancelF:null,
			}
		},
		components:{
			todo,
		},
		computed:{
			...mapState([
				'starInfo',
				'foundStarsInfo',
			]),
		},

		methods:{
			...mapMutations([
				'findStars',
				'showPTodo',
			]),
			clickLi(uid,e){
				console.log('---------clickLi---------');
				console.log(uid);
				/*get x and y*/
				console.log('event:')
				console.log(e);
				this.showPTodo({
					uid,
					x:e.layerX-50,
					y:e.layerY
				});

			},
			keyupFSI(){
				this.ensureFind = true;
				clearTimeout(this.timeoutCancelF);
				let vm = this;
				this.timeoutCancelF = setTimeout(()=>{
					vm.ensureFind = false;
				},500);
			},
			focusFSI(){
				console.log('focusFSI');
				let vm = this;
				this.intervalFind = setInterval(()=>{
					if(vm.ensureFind){
						// console.log('find stars...');
						vm.findStars(vm.starsKeyword);
					}
				},500)
			},
			blurFSI(){
				clearInterval(this.intervalFind);
			}
		}

	}
</script>
<style lang='less' scoped>
	#stars{
		overflow-y:scroll;
		.find{
			border-bottom:1px solid #7BB;
			&>div{
				text-align: center;
				input{
					display: inline-block;
					width:200px;
					border:none;
					background:transparent;
					height:24px;
					border-bottom:1px solid #7CC;
					&:hover{
						box-shadow:0 0 5px #999;
					};
				}
			};

		}

		ul{
			li{
				list-style: none;
				height:60px;
				&:hover{
					cursor:pointer;
					box-shadow:0 0 5px #999;
				};

				img{
					width: 60px;
					height: 60px;
					border-radius: 50%;
					border:1px solid #999;
					float:right;
				}
				div{
					display: inline-block;
					float:left;
					width:200px;
					.name{
						height:20px;
					}
					.introduce{
						height:40px;
					}
				}
			}
		}
	}

</style>
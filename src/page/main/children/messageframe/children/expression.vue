<template>
	<div
      class='messageframe-expression'
      v-if='expressionsSeen'
    >
		<div v-for='i in 50'
			:style='bgPosition(i)'
			:mark='i'
			@click = 'expressionToText'
		></div>


    </div>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';



	export default{
		data(){
			return {
				great:{
					backgroundColor:'#222',
					
				}
			}
		},
		computed:{
			...mapState([
				'expressionsSeen',
			]),

		},


		methods:{
			bgPosition(i){
				return {
					backgroundPosition:'0px -'+i*30+'px',
				}
			},

		    expressionToText(e){
			  let t;
			  switch(parseInt(e.target.attributes[1].value)){
			    case 0:t = '呵呵'; break;
			    case 1:t = '哈哈'; break;
			    case 2:t = '吐舌'; break;
			    case 3:t = '啊'; break;
			    case 4:t = '酷'; break;
			    case 5:t = '怒'; break;
			    case 6:t = '开心'; break;
			    case 7:t = '汗'; break;
			    case 8:t = '泪'; break;
			    case 9:t = '黑线'; break;
			    case 10:t = '鄙视'; break;
			    case 11:t = '不高兴'; break;
			    case 12:t = '真棒'; break;
			    case 13:t = '钱'; break;
			    case 14:t = '疑问'; break;
			    case 15:t = '阴险'; break;
			    case 16:t = '吐'; break;
			    case 17:t = '咦'; break;
			    case 18:t = '委屈'; break;
			    case 19:t = '花心'; break;
			    case 20:t = '呼'; break;
			    case 21:t = '笑眼'; break;
			    case 22:t = '冷'; break;
			    case 23:t = '太开心'; break;
			    case 24:t = '滑稽'; break;
			    case 25:t = '勉强'; break;
			    case 26:t = '狂汗'; break;
			    case 27:t = '乖'; break;
			    case 28:t = '睡觉'; break;
			    case 29:t = '惊哭'; break;
			    case 30:t = '生气'; break;
			    case 31:t = '惊讶'; break;
			    case 32:t = '喷'; break;
			    case 33:t = '爱心'; break;
			    case 34:t = '心碎'; break;
			    case 35:t = '玫瑰'; break;
			    case 36:t = '礼物'; break;
			    case 37:t = '彩虹'; break;
			    case 38:t = '星星月亮'; break;
			    case 39:t = '太阳'; break;
			    case 40:t = '钱币'; break;
			    case 41:t = '灯泡'; break;
			    case 42:t = '咖啡'; break;
			    case 43:t = '蛋糕'; break;
			    case 44:t = '音乐'; break;
			    case 45:t = 'haha'; break;
			    case 46:t = '胜利'; break;
			    case 47:t = '大拇指'; break;
			    case 48:t = '弱'; break;
			    case 49:t = 'ok'; break;
			  }
			  main.expressionSeen = false;
			  let input = document.getElementById('messageframe-input');
			  let end = input.selectionEnd;
			  let v = input.value;
			  input.value = v.substr(0,end) + "#("+t+")" + v.substr(end,v.length);
			},


			
		}

	}	
</script>

<style lang='less' scoped>
.messageframe-expression{
    background:rgba(255,255,255,0.5);
	position: absolute;
	width:520px;
	left:50%;
	bottom:50px;
	box-shadow: 0 0 10px #999;
	transform: translateX(-50%);
    z-index:100000000000000;
    @media(max-width: 468px){
    	width:90%;
    	height:130px;
    	overflow: scroll;

    }
    div{
		cursor:pointer;
		width: 30px;
		height: 30px;
		margin:5px;
		float: left;
		background: url('img/faces.png') no-repeat;
		background-position: left -30px;
		&:hover{
    		background-color:#EEF;
      	}
    }
  }
</style>
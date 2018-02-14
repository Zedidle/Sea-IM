<!-- 这是顶层路由 -->
<template>
  <div id='container'>
  <keep-alive>
    <transition name='fadeY-10'>
      <!-- 默认为start -->
      <router-view></router-view> 
    </transition>
  </keep-alive>



  <transition name='fadeX50'>

    <h1 
      :style='h1Style'
      class='welcome'
      v-show='welcomeShow'
      @click = 'hideGreeting'
      @mouseover = 'onH1Color'
      @mouseout = 'offH1Color'
      >{{greeting}}

    </h1>
  </transition>



  <transition name='waiting'>
    <i v-show='waiting'></i>
  </transition>
  </div>
</template>

<script>

import {mapState} from 'vuex';


  	export default {
  		data(){
  			return {
  				greeting:'SeaNet',
          welcomeShow:true,
          waiting:true,
          onH1:false,
  			}
  		},
      computed:{
        ...mapState([
          'isLogin'
        ]),
        h1Style(){
          return{
            position:'absolute',
            top:this.isLogin?'5%':'45%',
            left:this.isLogin?'70%':'60%',
            transition:'all 1s',
            textAlign:'center',
            cursor:'pointer',
            fontSize:'60px',
            color:this.onH1?'#036497':'#EEF'
          }
        }
      },
      methods:{
        hideGreeting:function(){
          this.welcomeShow = false;
        },
        onH1Color:function(){
          this.onH1 = true;
        },
        offH1Color:function(){
          this.onH1 = false;
        }
      }
  	}

</script>

<style lang="less" scoped>
  #container{
    padding-left:10%;
    padding-right:10%;
    overflow: hidden;
    width:100%;
    height:700px;
    align-items: center;
    display: flex;
    justify-content: space-between;
    @media(max-width: 768px){
      display: block;
    }
  }
  
  .welcome{
    color:#666;
    @media(max-width:768px){
      top:5%;
    }
  }
</style>
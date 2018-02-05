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
        v-show='show'
        @click = 'showGreeting'
        @mouseover = 'onH1Color'
        @mouseout = 'offH1Color'
        >{{greeting}}</h1>
    </transition>
  </div>
</template>

<script>

import {mapState} from 'vuex';


  	export default {
  		data(){
  			return {
  				greeting:'SeaNet',
          show:true,
          h1Style:{
            textAlign:'center',
            color:'#EEF',
            cursor:'pointer',
            fontSize:'60px',
          }
  			}
  		},
      computed:{
        ...mapState([
          'isLogin'
          ])
      },
      methods:{
        showGreeting:function(){
          this.show = false;
        },
        onH1Color:function(){
          this.h1Style.color = '#036497';
        },
        offH1Color:function(){
          this.h1Style.color = '#EEF';
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
</style>
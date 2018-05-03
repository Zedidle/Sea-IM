<!-- 这是顶层路由 -->
<template>
  <div id='container'>
  <keep-alive>
    <transition name='fadeY-10'>
      <!-- 默认为start -->
      <router-view></router-view> 
    </transition>
  </keep-alive>

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
    display:flex;
  }
  
</style>
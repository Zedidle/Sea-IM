<template>
  <div class='user-wrap'>
    
    <img
      :class='{active:onDomore}'
      :src='userInfo.headImg'
      @click='toggleDomore'
    >
    <div
      class='info'
    >
      <input 
        @blur = 'meUpdateText'  
        v-model='userInfo.name'>
      <textarea
        @blur = 'meUpdateText'
        v-model='userInfo.introduce'
      ></textarea>
    </div>
  
  </div>

</template>


<script>
  
import $ from 'jquery';
import {mapState,mapMutations} from 'vuex';


export default {
  date(){
    return {

    }
  },
  computed:{
    ...mapState([
      'userInfo',
      'onDomore'
    ]),

  },
  methods:{
    ...mapMutations([
      'toggleDomore',
    ]),
    meUpdateText(){
      console.log('meUpdate:');
      console.log('userInfo:');
      console.log(this.userInfo);
      $.post('/meUpdateText',this.userInfo,(d)=>{
        console.log('meUpdate callback: data:');
        console.log(d);
      });
    },
  }
}



</script>
  


<style lang='less' scoped>
  .user-wrap{
    width:100%;
    height:80px;
    border-bottom:2px solid #999;

    img{
      width:80px;
      height:80px;
      border:1px solid #AAA;
      border-radius: 50%;
      float:left;

      &:hover{
        cursor: crosshair;
        box-shadow: 0 0 5px #EEF; 
      }
    }

    .info{
      float:left;
      padding-left:5px;
      width:160px;
      height:100%;
      input{
        background:transparent;
        display: inline-block;
        width:160px;
        height:25px;
        border:none;
        &:hover{
          box-shadow:0 0 5px #999;
        };
      }
      textarea{
        background:transparent;
        display: inline-block;
        overflow: hidden;
        width:160px;
        height: 40px;
        border:none;
        &:hover{
          box-shadow:0 0 5px #999;
        };
      }
    }
    .active{
      box-shadow:0 0 10px #999;
    }
  }






</style>
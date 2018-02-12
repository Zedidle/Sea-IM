<template>
  <div 
    v-show = 'onDomore'
    id='domore'
  >
      <div 
        id='person'
        class='ele'
        data-toggle='tooltip'
        data-placement='left'
        title='个人信息'
      >
      P
      </div>
      <div
        id='myteam'
        class='ele'
        data-toggle='tooltip'
        data-placement='top'
        title='团队'
      >
      T
      </div>
 

      <div
        id='logOff'
        @click='toLogoff'
      >注销</div>
  </div>
</template>


<script>


import {mapState,mapMutations} from 'vuex';



export default {
  data(){
    return {

    }
  },
  computed:{
    ...mapState([
      'userInfo',
      'onDomore',
    ]),
  },
  methods:{
    ...mapMutations([
      'toggleDomore',
      'toLogoff',
    ]),
  }
}

</script>


<style lang='less' scoped>
#domore{
  
  position:absolute;
  width:240px;
  top:50%;
  left:50%;
  transform: translateX(-50%) translateY(-50%);
  overflow: hidden;
  z-index: 10000000;
  box-shadow: 0 0 10px #999;
  


  #logOff{
    width:100%;
    font-weight: 600;
    border-top:3px solid transparent;
    border-bottom:3px solid transparent;
    height:34px;
    line-height: 28px;
    font-size: 20px;
    text-align:center;
    cursor:pointer;
    color:#fff;
    background-color: #999;
    &:hover{
      background-color: #AAA;
      border-color:#EEE;
    }
  }

  .ele{
    width:50px;
    height:50px;
    line-height: 50px;
    border-radius: 10%;
    margin:10px;
    font-size: 1.8em;
    text-align: center;
    display: inline-block;
    cursor:pointer;
    color:#7EBCB7;
    background:rgba(255,255,255,0.8);
    &:hover{
      box-shadow: 0 0 5px #999;
    }
    @media(max-width:480px){
      &:hover{
        box-shadow: 0 0 5px #FFF;
      }
    }
  }

}
</style>

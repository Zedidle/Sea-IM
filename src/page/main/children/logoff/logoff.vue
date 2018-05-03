<template>
	<div
    class='logoff'  
    v-show='showLogoff'
	>
    <div class='title'> 确认注销吗？</div>

    <div
      class='ensureLogoff-btn'
      @click = 'toStart'
    >确认
    </div>
    
    <div
      class='cancelLogoff-btn'
      @click = 'cancelLogoff'
    >取消
    </div>
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
      'showLogoff',
      
    ]),
  },
  methods:{
    ...mapMutations([
      'toggleDomore',
      'ensureLogoff',
      'cancelLogoff',

    ]),
    toStart(){
      this.ensureLogoff();
      window.location.href='/';
    }
  }
}

</script>

<style lang='less' scoped>


  .logoff{

    position:absolute;
    z-index: 999999999;
    width:15rem;
    height:4.5rem;
    box-shadow: 0px 0px 50px #666;
    background-color: rgba(255,255,255,0.8);
    border:1px solid #222;
    left:50%;
    top:50%;
    transform:translateX(-50%) translateY(-50%);

    .title{
      text-align:center;
    }

    .cancelLogoff-btn,.ensureLogoff-btn{
      float: right;
      text-align: center;
      height:35px;
      line-height: 30px;
      width:45%;
      font-size:1.2rem;
      border:1px solid #456; 
      margin:5px;
      color:#FFF;
      background-color:#444;
      cursor:pointer;
      &:hover{
        box-shadow: 5px 5px 10px #999;
      }
    }
  }

</style>
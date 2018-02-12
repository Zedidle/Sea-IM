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
      this.$router.push({path:'/'});
    }
  }
}

</script>

<style lang='less' scoped>

  .logoff{
    position:absolute;
    z-index: 999999999;
    width:240px;
    height:100px;
    box-shadow: 0px 0px 50px #666;
    background-color: rgba(255,255,255,0.8);
    border:2px solid #222;
    left:50%;
    top:50%;
    transform:translateX(-50%) translateY(-50%);
    .cancelLogoff-btn{
      float: right;
      text-align: center;
      height:45px;
      line-height: 45px;
      width:35%;
      font-size:28px;
      border-right:2px solid #999;
      border:1px solid #456; 
      margin:5px;
      color:#FFF;
      background-color:brown;
      cursor:pointer;
      &:hover{
        border-radius: 10px;
        box-shadow: 5px 5px 10px #999;
        border-width: 2px;
      }
    }
    .ensureLogoff-btn{
      float: left;
      text-align: center;
      height:45px;
      line-height: 45px;
      width:55%;
      font-size: 28px;
      border:1px solid #456; 
      margin:5px;
      color:#FFF;
      background-color:#999;
      cursor:pointer;
      &:hover{
        border-radius: 10px;
        box-shadow: 5px 5px 10px #999;
        border-width: 2px;
      }
    }
  }

</style>
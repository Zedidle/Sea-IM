<template>
 <div 
  v-if = 'onTMoreInfo'
  id='tMoreInfo'
 >
  <div 
    @click='hideTMoreInfo'
    class="close"
  >
    <i class='icon iconfont icon-close'></i>
  </div>
  <img 
    class='headImg'
    :src="tMoreInfo.headImg"
  >
  <div><b>{{tMoreInfo.uid}}</b></div>
  <div><b>Level: {{tMoreInfo.level}}</b></div>
  <div><b>Scale: {{tMoreInfo.member.length}}</b></div>
  <input 
    readonly 
    class="name"
    v-model='tMoreInfo.name'
    placeholder="name"
  >
  <textarea
    readonly
    class="introduce"
    v-model='tMoreInfo.introduce'  
    placeholder="say somthing..."
  ></textarea>

 </div>

</template>


<script>
import $ from 'jquery';
import {mapState,mapMutations} from 'vuex';

export default {
  data(){
       return{

       }
  },
  components:{
  },
  computed:{
    ...mapState([
      'teamInfo',
      'onTMoreInfo',
      'tMoreInfo',
    ]),
  },
  methods:{
    ...mapMutations([
      'hideTMoreInfo',
    ]),
  }
}

</script>


<style lang='less' scoped>
#tMoreInfo{
  border-top:5px solid #7BB;
  min-width:240px;
  min-height:360px;
  color:#333;
  box-shadow: 0 0 5px #999;
  background:rgba(255,255,255,0.95);
  text-align: center;
  position:fixed;
  top:50%;
  left:50%;
  transform:translateX(-50%) translateY(-50%);
  .close{
    width:100%;
    color:red;
    text-align: center;
    border-bottom:2px solid #7CC;
    margin-bottom:5px;
  }
  .headImg{
    border-radius: 50%;
    width:80px;
    height:80px;
    border:1px solid #999;
    margin-bottom:10px;
  }
  input{
    margin:5px 0;
    width:80%;
    text-align: center;
    background: transparent;
    border:1px solid transparent;
  }
  textarea{
    width:90%;
    text-align: center;
    background: transparent;
    border:1px solid transparent;
  }
}
</style>
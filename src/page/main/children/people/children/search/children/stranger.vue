<template>
 <div 
  v-if = 'onSMoreInfo'
  id='stranger'
 >
  <div 
    @click='hideSMoreInfo'
    class="close"
  >
    <i class='icon iconfont icon-close'></i>
  </div>
  <img 
    class='headImg'
    :src="sMoreInfo.headImg"
  >
  <div><b>{{sMoreInfo.uid}}</b></div>
  <input readonly class="name" v-model='sMoreInfo.name'>
  <input readonly class="birthday" v-model='sMoreInfo.birthday'>
  <input readonly class="hobby" v-model='sMoreInfo.hobby' >
  <textarea readonly class="introduce" v-model='sMoreInfo.introduce'></textarea>
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
      'starInfo',
      'onSMoreInfo',
      'sMoreInfo',
    ]),
  },
  methods:{
    ...mapMutations([
      'hideSMoreInfo',
    ]),
  }
}

</script>


<style lang='less' scoped>
#stranger{
  border-top:5px solid #7BB;
  min-width:240px;
  min-height:360px;
  color:#333;
  box-shadow: 0 0 5px #999;
  background:rgba(255,255,239,0.9);
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
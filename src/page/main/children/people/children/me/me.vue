<template>
 <div id='me'>
  <img-update></img-update>
  <img 
       @click='clickHeadImg'     
       :src="userInfo.headImg"
       class="headImg"
  >
  <div><b>{{userInfo.uid}}</b></div>
    <input class="name" v-model='userInfo.name' placeholder="name">
    <input class="birthday" v-model='userInfo.birthday'  placeholder="birthday">
    <input class="hobby" v-model='userInfo.hobby'  placeholder="hobby">
    <textarea class="introduce" v-model='userInfo.introduce'  placeholder="introduce"></textarea>

    <button
         @click='meUpdateText'
    >UPDATE</button>
 </div>
</template>

<script>
import $ from 'jquery';
import {mapState,mapMutations} from 'vuex';
import imgUpdate from './children/imgUpdate.vue';

export default {
  data(){
       return{

       }
  },
  components:{
    imgUpdate,
  },
  computed:{
    ...mapState([
      'userInfo',
      'onPImgUpdate',
    ]),
  },
  methods:{
    ...mapMutations([
      'showPImgUpdate',
    ]),
    clickHeadImg(){
      let vm = this;
      let input = document.createElement('input');
      input.type='file';
      input.click();
      input.onchange=function(){
        let r = new FileReader();
        r.readAsDataURL(input.files[0]);
        r.onload = function(){
           vm.showPImgUpdate(r.result);
        }
      }
    },

    meUpdateText(){
      $.post('/meUpdateText',this.userInfo);
    },
  }
}

</script>


<style lang='less' scoped>
#me{
  text-align: center;
  .headImg{
    border-radius: 50%;
    width:80px;
    height:80px;
    border:1px solid #999;
    cursor:pointer;
    margin-bottom:10px;
    &:hover{
      box-shadow:0 0 5px #999
    }
  }
  input{
    margin:5px 0;
    width:80%;
    text-align: center;
    background: transparent;
    border:1px solid transparent;
    &:hover{
      border-bottom-color:#7CC;
    };
  }
  textarea{
    width:90%;
    text-align: center;
    background: transparent;
    border:1px solid transparent;
    &:hover{
      border-color:#7CC;
    };
  }
  button{
    margin-top:10px;
    background-color:#3c3;
    color:#FFF;
    border:none;
    width:100px;
    height:30px;
    text-align: center;
    vertical-align: center;
    box-shadow:0 0 5px #3c3;
    &:hover{
      box-shadow:0 0 10px #3c3;
    }
  }
}
</style>
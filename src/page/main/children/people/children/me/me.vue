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
      console.log('--------clickHeadImg--------');
      let vm = this;

      if(document.getElementById('cropperScript')){
        toGetImg();
      }else{
        let script = document.createElement('script');
        script.id = 'cropperScript'
        script.src = 'cropperjs/dist/cropper.min.js';
        script.async="async";
        console.log('loading cropper.min.js ...');
        document.body.appendChild(script);
        script.onload = function(){
          console.log('cropper.min.js ok!');
          toGetImg();
        }
      }

      function toGetImg(){
        let input = document.createElement('input');
        input.type='file';
        input.click();
        input.onchange=function(){
          console.log('input Image Change!');
          console.log('The files : ')
          console.log(input.files[0]);

          let r = new FileReader();
          r.readAsDataURL(input.files[0]);
          r.onload = function(){
             console.log('read file 100%');
             console.log('DataURL:');
             console.log(r.result);
             vm.showPImgUpdate(r.result);
          }
        }
      }
    },

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
#me{
  text-align: center;
  padding-top:10px;
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
<template>
    <div id='myteam'>

      <div 
        v-if='!myteamInfo'
        id='tip'
      >
        <h4 
          style='text-align:center;'
        >还没有建立团队
        </h4>

        <button>TO BUILD</button>
      </div>

      <div
        v-else 
        class='content'
      >
        <img-update></img-update>
        <img 
             @click='clickHeadImg'     
             :src="myteamInfo.headImg"
             class="headImg"
        >
        <div><b>{{myteamInfo.uid}}</b></div>
        <div>
          <b>Level: {{myteamInfo.level}}</b>
        </div>
        <div>
          <b>Scale: {{myteamInfo.member.length}}</b>
        </div>
          <input class="name" v-model='myteamInfo.name' placeholder="name">
          <textarea class="introduce" v-model='myteamInfo.introduce'  placeholder="say somthing..."></textarea>

          <button
               @click='myteamUpdateText'
          >UPDATE</button>
      </div>
    </div>
</template>

<script>

import $ from 'jquery';
import imgUpdate from './children/imgUpdate.vue';
import {mapState,mapMutations} from 'vuex';

export default {
  data(){
    return {
    }
  },
  components:{
    imgUpdate,
  },
  computed:{
    ...mapState([
      'UID',
      'teamInfo',
    ]),
    myteamInfo(){
      console.log('get myteam');
      for(let i of this.teamInfo){
        if(i.uid===this.UID){
          return i;
        }
      }
      return null;
    },
  },
  methods:{
    ...mapMutations([
      'showTImgUpdate',
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
             vm.showTImgUpdate(r.result);
          }
        }
      }
    },

    myteamUpdateText(){
      console.log('myteamUpdate:');
      $.post('/myteamUpdateText',this.myteamInfo,(d)=>{
        console.log('myteamUpdate callback: ');
        console.log(d);
      });
    },
  }
}

</script>

<style lang='less' scoped>
#myteam{
  .content{
    text-align: center;
    .headImg{
      border-radius: 50%;
      width:80px;
      height:80px;
      border:1px solid #999;
      cursor:pointer;
      margin:10px 0;
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
}
</style>





